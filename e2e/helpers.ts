import { expect, type Page } from "@playwright/test";

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** Opens a home URL in one language and waits until the monitor has its final channel list. */
export async function openHome(page: Page, lang: Lang, width: number, path: string) {
  await page.addInitScript((value) => {
    try {
      window.localStorage.setItem("mixiuh_lang", value);
    } catch {
      /* storage blocked: the page falls back to Spanish */
    }
  }, lang);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  // Language and release clock are applied by effects right after hydration.
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  await page.locator(".px-3d-crt-shell").waitFor();
  await page.evaluate(() => document.fonts.ready);
  // The channel list is final once two looks 250ms apart agree.
  let previous = -1;
  await expect
    .poll(
      async () => {
        const count = await page.locator(".px-3d-screen-bezel button").count();
        const stable = count === previous;
        previous = count;
        return stable && count > 0;
      },
      { intervals: [250] }
    )
    .toBe(true);
}

/** Scrolls from top to bottom so every lazy image is requested, then waits for the network. */
export async function scrollWholePage(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForLoadState("networkidle");
}

export interface ShownCover {
  /** Where it is shown: the channel code ("EP.09") or "card 3". */
  where: string;
  /** Path of the file the browser ended up showing. */
  path: string;
  loaded: boolean;
}

/** Switches through every channel of the monitor and reports the cover each one shows. */
export async function monitorCovers(page: Page): Promise<ShownCover[]> {
  return page.evaluate(async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const shell = document.querySelector<HTMLElement>(".px-3d-crt-shell");
    if (!shell) return [];
    const channelButtons = () =>
      Array.from(shell.querySelectorAll<HTMLButtonElement>(".px-3d-screen-bezel button"));
    const shown: { where: string; path: string; loaded: boolean }[] = [];
    for (const code of channelButtons().map((b) => (b.textContent ?? "").trim())) {
      channelButtons()
        .find((b) => (b.textContent ?? "").trim() === code)
        ?.click();
      await wait(220); // past the 140ms "TUNING" static flash
      // A cover that falls back to its original loads twice: give it time to settle.
      let cover: HTMLImageElement | null = null;
      for (let tries = 0; tries < 60; tries++) {
        cover = shell.querySelector<HTMLImageElement>(".px-3d-screen-bezel img");
        if (cover && cover.complete && cover.naturalWidth > 0) break;
        await wait(100);
      }
      shown.push({
        where: code,
        path: cover ? new URL(cover.currentSrc || cover.src, location.href).pathname : "",
        loaded: Boolean(cover && cover.complete && cover.naturalWidth > 0),
      });
    }
    return shown;
  });
}

/**
 * The cover of every blog card (CoverImage marks them with data-cover). They are
 * lazy images, so each one is brought into view and given time to load; scrolling
 * past them quickly is not enough on a busy machine.
 */
export async function cardCovers(page: Page): Promise<ShownCover[]> {
  return page.evaluate(async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const images = () => Array.from(document.querySelectorAll<HTMLImageElement>("img[data-cover]"));
    const shown: { where: string; path: string; loaded: boolean }[] = [];
    for (let i = 0; i < images().length; i++) {
      let img = images()[i];
      for (let tries = 0; tries < 80; tries++) {
        img = images()[i];
        if (img.complete && img.naturalWidth > 0) break;
        if (tries % 10 === 0) img.scrollIntoView({ block: "center", behavior: "instant" });
        await wait(100);
      }
      shown.push({
        where: `card ${i + 1}`,
        path: new URL(img.currentSrc || img.src, location.href).pathname,
        loaded: img.complete && img.naturalWidth > 0,
      });
    }
    return shown;
  });
}
