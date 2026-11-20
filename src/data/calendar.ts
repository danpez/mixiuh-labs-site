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
  cc02: {
    es: "CC02: ROBLOX 3D (Astra vs Argon vs Opus + Bonus)",
    en: "CC02: 3D ROBLOX (Astra vs Argon vs Opus + Bonus)",
  },
  ep05: {
    es: "EP05: Torneo 3 Gigantes (20 Simuladores 3D)",
    en: "EP05: 3 Giants Tournament (20 3D Simulators)",
  },
  ep06: {
    es: "EP06: Clasicos + Arena IA en Vivo (20 Juegos)",
    en: "EP06: Classics + Live AI Arena (20 Games)",
  },
  ep07: {
    es: "EP07: Gemini Omni 1.2 Flash vs 1.1 vs Veo 3.1 (4-0)",
    en: "EP07: Gemini Omni 1.2 Flash vs 1.1 vs Veo 3.1 (4-0)",
  },
  ep08: {
    es: "EP08: Gemini 4 Carbon en Vivo vs Argon + Recuperacion (3-1)",
    en: "EP08: Gemini 4 Carbon Live vs Argon + Recovery (3-1)",
  },
  ep09: {
    es: "EP09: Claude Fable 5.2 vs Opus 5.5 (3-1)",
    en: "EP09: Claude Fable 5.2 vs Opus 5.5 (3-1)",
  },
  ep13: {
    es: "EP13: Ecosistema Gemini 4 (Neon + Orchestrator)",
    en: "EP13: Gemini 4 Ecosystem (Neon + Orchestrator)",
  },
  ep12: {
    es: "EP12: Torneo de Ligeros Extra (Hydrogen vs Haiku vs Luna)",
    en: "EP12: Lightweight Extra Tournament (Hydrogen vs Haiku vs Luna)",
  },
  ep11: {
    es: "EP11: Gemini 4 Hydrogen (4 Niveles) vs Flash 3.8 (18 Demos)",
    en: "EP11: Gemini 4 Hydrogen (4 Levels) vs Flash 3.8 (18 Demos)",
  },
  ep10: {
    es: "EP10: Carbon vs Fable 5.2 Gran Final (16 Demos + Arenas)",
    en: "EP10: Carbon vs Fable 5.2 Grand Finale (16 Demos + Arenas)",
  },
};

/** Calendar tone of each production (the same accent as its blog card). */
export const CALENDAR_TONES: Record<ReleaseKey, PixelTone> = {
  ep13: "cyan",
  ep12: "emerald",
  ep11: "cyan",
  ep10: "yellow",
  ep09: "coral",
  ep08: "cyan",
  ep07: "cyan",
  ep06: "cyan",
  ep05: "emerald",
  cc02: "emerald",
  carbon01: "cyan",
  ep04: "coral",
  ep03: "emerald",
  cc01: "yellow",
  ep02: "violet",
  ep01: "chalk",
};
