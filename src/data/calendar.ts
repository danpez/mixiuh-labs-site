import type { PixelTone } from "@mixiuh/pixel-ui";
import type { ReleaseKey } from "@/data/releaseSchedule";

/**
 * Release calendar entries shared by the home page and the Pixel UI calendar
 * demo. Dates come from RELEASE_TIMESTAMPS_CST; only labels and tones live here.
 */

/** Release day of the current @mixiuh/pixel-ui version (shown in the calendar). */
export const PIXEL_UI_RELEASE_DATE = "2026-10-31";

export const CALENDAR_LABELS: Record<ReleaseKey, { es: string; en: string }> = {
  ep01: { es: "EP01: Argon vs 3.8 Flash (10-0)", en: "EP01: Argon vs 3.8 Flash (10-0)" },
  ep02: { es: "EP02: Argon vs Claude Opus 5.5 (4-2)", en: "EP02: Argon vs Claude Opus 5.5 (4-2)" },
  cc01: { es: "CC01: OVERFIT Studio 3D (@tenito03)", en: "CC01: OVERFIT Studio 3D (@tenito03)" },
  ep03: { es: "EP03: Sin Kit vs Superpowers Kit (4-2)", en: "EP03: Raw vs Superpowers Kit (4-2)" },
  ep04: { es: "EP04: Escalera Claude 5.5 (18 corridas)", en: "EP04: Claude 5.5 Ladder (18 runs)" },
  carbon01: { es: "Noticias IA #01: Gemini 4 Carbon", en: "AI News #01: Gemini 4 Carbon" },
};

/** Calendar tone of each production (the same accent as its blog card). */
export const CALENDAR_TONES: Record<ReleaseKey, PixelTone> = {
  carbon01: "cyan",
  ep04: "coral",
  ep03: "emerald",
  cc01: "yellow",
  ep02: "violet",
  ep01: "chalk",
};
