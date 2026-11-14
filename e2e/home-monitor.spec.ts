import { expect, test, type Page } from "@playwright/test";

/**
 * The home monitor (Pixel3DCRTWorkstation) is the first thing a visitor sees, and
 * every new episode adds a channel with its own label, metrics, verdict, title and
 * cover. This suite fails when any of that text is cut by the bezel, truncated to
 * "…" or clamped, or when a cover does not load: on every channel, at every width
 * below, in Spanish and in English, in Chromium and in WebKit (Safari).
 *
 * It opens the production build with the embargo lifted (?preview=all), so a
 * problem in an unreleased episode shows up here and not on release day.
 */

// Phones (280 = folded Galaxy, 320 = small iPhone, 360-430 = most phones), tablets,
// the 1024-1180 range where the two-column hero makes the monitor as narrow as a
// phone, and desktops.
const WIDTHS = [
  280, 320, 360, 375, 390, 412, 430, 540, 640, 768, 820, 900, 1024, 1100, 1180,
  1280, 1366, 1440, 1920,
];
const LANGS = ["es", "en"] as const;
type Lang = (typeof LANGS)[number];

// From this width up the monitor must not change height from one channel to the
// next (the hero would jump on every channel switch).
const CONSTANT_HEIGHT_FROM = 1280;

async function openHome(page: Page, lang: Lang, width: number, path: string) {
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

/** Switches through every channel of the monitor and reports what is not fully visible. */
async function auditMonitor(page: Page) {
  return page.evaluate(async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const shell = document.querySelector<HTMLElement>(".px-3d-crt-shell");
    if (!shell) return { channels: [] as string[], problems: ["monitor not found"], heights: [] as number[], pageOverflow: 0 };

    const channelButtons = () =>
      Array.from(shell.querySelectorAll<HTMLButtonElement>(".px-3d-screen-bezel button"));
    const codes = channelButtons().map((b) => (b.textContent ?? "").trim());
    const problems: string[] = [];
    const heights: number[] = [];
    const quote = (text: string) => `"${text.trim().replace(/\s+/g, " ").slice(0, 48)}"`;

    for (const code of codes) {
      const button = channelButtons().find((b) => (b.textContent ?? "").trim() === code);
      if (!button) {
        problems.push(`${code}: channel button disappeared`);
        continue;
      }
      button.click();
      await wait(220); // past the 140ms "TUNING" static flash

      // 1. The cover of the channel must load.
      const cover = shell.querySelector<HTMLImageElement>(".px-3d-screen-bezel img");
      if (!cover) {
        problems.push(`${code}: no cover image`);
      } else {
        if (!cover.complete) {
          await Promise.race([
            new Promise((resolve) => {
              cover.addEventListener("load", resolve, { once: true });
              cover.addEventListener("error", resolve, { once: true });
            }),
            wait(8000),
          ]);
        }
        if (!cover.complete || cover.naturalWidth === 0) {
          problems.push(`${code}: cover does not load (${cover.getAttribute("src")})`);
        }
      }

      // 2. No text may be truncated ("…"), clamped or scrolled out of its own box.
      for (const el of Array.from(shell.querySelectorAll<HTMLElement>("*"))) {
        const ownText = Array.from(el.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent ?? "")
          .join("")
          .trim();
        if (!ownText) continue;
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) continue;
        const style = getComputedStyle(el);
        const cutX = el.scrollWidth > el.clientWidth + 1 && style.overflowX !== "visible";
        const cutY =
          el.scrollHeight > el.clientHeight + 1 &&
          (style.overflowY !== "visible" || style.webkitLineClamp !== "none");
        if (cutX) problems.push(`${code}: truncated by ${el.scrollWidth - el.clientWidth}px ${quote(ownText)}`);
        else if (cutY) problems.push(`${code}: clamped by ${el.scrollHeight - el.clientHeight}px ${quote(ownText)}`);
      }

      // 3. No text may stick out of the tube (the bezel clips whatever does).
      const bezel = shell.querySelector<HTMLElement>(".px-3d-screen-bezel");
      if (bezel) {
        const box = bezel.getBoundingClientRect();
        const style = getComputedStyle(bezel);
        const left = box.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
        const right = box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight);
        const walker = document.createTreeWalker(bezel, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = (node.textContent ?? "").trim();
          if (!text) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          const rect = range.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const over = Math.max(rect.right - right, left - rect.left);
          if (over > 1) problems.push(`${code}: ${Math.round(over)}px outside the tube ${quote(text)}`);
        }
      }

      heights.push(Math.round(shell.getBoundingClientRect().height));
    }

    return {
      channels: codes,
      problems,
      heights,
      pageOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });
}

for (const lang of LANGS) {
  for (const width of WIDTHS) {
    test(`monitor shows every channel in full · ${lang} · ${width}px`, async ({ page }) => {
      await openHome(page, lang, width, "/?preview=all");
      const report = await auditMonitor(page);

      expect(report.channels.length, "channels on the monitor").toBeGreaterThanOrEqual(10);
      expect(report.problems, "text or covers that are not fully visible").toEqual([]);
      expect(report.pageOverflow, "horizontal scroll of the page").toBe(0);
      if (width >= CONSTANT_HEIGHT_FROM) {
        expect(
          [...new Set(report.heights)],
          "monitor heights across channels (shorten the longest label, verdict or title)"
        ).toHaveLength(1);
      }
    });
  }
}

for (const path of ["/", "/?preview=all"]) {
  for (const width of [375, 1280]) {
    test(`home has no broken images or failed files · ${path} · ${width}px`, async ({ page }) => {
      const failed: string[] = [];
      page.on("response", (response) => {
        const url = new URL(response.url());
        // /_vercel/* (analytics) only exists on Vercel, not on a local `next start`.
        if (url.hostname !== "localhost" || url.pathname.startsWith("/_vercel/")) return;
        if (response.status() >= 400) failed.push(`${response.status()} ${url.pathname}`);
      });

      await openHome(page, "es", width, path);
      // Walk the whole page so every lazy image is requested.
      await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForLoadState("networkidle");

      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.getAttribute("src"))
      );
      expect(broken, "images that failed to load").toEqual([]);
      expect(failed, "same-origin requests answered with 4xx/5xx").toEqual([]);
      expect(
        await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth)),
        "horizontal scroll of the page"
      ).toBe(0);
    });
  }
}
