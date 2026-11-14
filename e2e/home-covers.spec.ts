import { expect, test, type Page, type Route } from "@playwright/test";
import { COVERS } from "../src/data/covers";
import { LANGS, cardCovers, monitorCovers, openHome, scrollWholePage } from "./helpers";

/**
 * The covers of the home (the monitor's channels and the blog cards) are the first
 * and the heaviest thing a visitor downloads. Served as the original PNG or JPG
 * they added up to 9.9 MB, and the newest episode's cover alone was 1.3 MB on a
 * phone. Each one now has a light AVIF twin (src/data/covers.ts, `npm run covers`).
 *
 * This suite opens the production build with the embargo lifted and fails when:
 *  - a cover the browser downloads is over the weight budget, e.g. a new episode
 *    wired straight to its full-size image;
 *  - the page downloads the full-size original of a cover besides its twin;
 *  - a browser that cannot show AVIF is left without a cover.
 */

// Same limit as MAX_BYTES in scripts/build-covers.mjs.
const COVER_BUDGET = 250 * 1024;
const ORIGINALS = new Set<string>(Object.values(COVERS));
const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/** Size of every image file the page downloads, by path. Call settled() before reading it. */
function recordImageDownloads(page: Page) {
  const bytes = new Map<string, number>();
  const pending: Promise<void>[] = [];
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.hostname !== "localhost" || !/\.(avif|png|jpe?g|webp|gif)$/i.test(url.pathname)) return;
    pending.push(
      response
        .body()
        .then((body) => void bytes.set(url.pathname, body.length))
        .catch(() => undefined)
    );
  });
  return {
    async settled() {
      await Promise.all(pending);
      return bytes;
    },
  };
}

/** What a browser without AVIF gets from an .avif: a file it downloads and cannot decode. */
const undecodable = (route: Route) =>
  route.fulfill({ status: 200, contentType: "image/avif", body: "not an image this browser can decode" });

for (const lang of LANGS) {
  for (const width of [375, 1280]) {
    test(`every cover the home downloads is light · ${lang} · ${width}px`, async ({ page }) => {
      const downloads = recordImageDownloads(page);
      await openHome(page, lang, width, "/?preview=all");
      const onMonitor = await monitorCovers(page);
      await scrollWholePage(page);
      const onCards = await cardCovers(page);
      const bytes = await downloads.settled();
      const covers = [...onMonitor, ...onCards];

      expect(onMonitor.length, "channels on the monitor").toBeGreaterThanOrEqual(10);
      expect(onCards.length, "blog cards with a cover").toBeGreaterThanOrEqual(10);
      expect(
        covers.filter((cover) => !cover.loaded).map((cover) => `${cover.where}: ${cover.path}`),
        "covers that did not load"
      ).toEqual([]);

      const overBudget = covers
        .filter((cover) => (bytes.get(cover.path) ?? Infinity) > COVER_BUDGET)
        .map((cover) => {
          const size = bytes.get(cover.path);
          return `${cover.where}: ${cover.path} ${size ? `weighs ${kb(size)}` : "was never seen downloading"}`;
        });
      expect(
        overBudget,
        `covers over ${kb(COVER_BUDGET)} (list the cover in src/data/covers.ts, run \`npm run covers\` and use COVERS.<id>)`
      ).toEqual([]);

      expect(
        [...bytes.keys()].filter((path) => ORIGINALS.has(path)),
        "full-size originals downloaded although a light twin exists"
      ).toEqual([]);
    });
  }
}

for (const width of [375, 1280]) {
  test(`a browser without AVIF still shows every cover · ${width}px`, async ({ page }) => {
    await page.route("**/*.avif", undecodable);
    await openHome(page, "es", width, "/?preview=all");
    const onMonitor = await monitorCovers(page);
    await scrollWholePage(page);
    const onCards = await cardCovers(page);
    const covers = [...onMonitor, ...onCards];

    expect(covers.length, "covers on the home").toBeGreaterThanOrEqual(20);
    expect(
      covers.filter((cover) => !cover.loaded).map((cover) => `${cover.where}: ${cover.path}`),
      "covers left broken"
    ).toEqual([]);
    expect(
      covers.filter((cover) => !ORIGINALS.has(cover.path)).map((cover) => `${cover.where}: ${cover.path}`),
      "covers that are not showing their original"
    ).toEqual([]);
  });
}

test("the first cover recovers when its light file fails before the page is interactive", async ({ page }) => {
  await page.route("**/*.avif", undecodable);
  // Hold every script back so the image error fires before React hydrates and can
  // listen for it (a slow phone on a slow network does the same).
  await page.route(/\/_next\/static\/.*\.js(\?.*)?$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "commit" });

  const cover = page.locator(".px-3d-screen-bezel img");
  const state = () =>
    cover.evaluate((img: HTMLImageElement) => ({
      broken: img.complete && img.naturalWidth === 0,
      shown: img.complete && img.naturalWidth > 0 ? new URL(img.currentSrc, location.href).pathname : "",
      hydrated: Object.keys(img).some((key) => key.startsWith("__reactFiber")),
    }));

  // The precondition: the cover is already broken while React has not touched it.
  await expect.poll(state, { intervals: [50] }).toMatchObject({ broken: true, hydrated: false });
  // Once the page is interactive it must notice and load the original instead.
  await expect.poll(async () => (await state()).shown, { timeout: 15000 }).toMatch(/\.(png|jpe?g)$/);
});
