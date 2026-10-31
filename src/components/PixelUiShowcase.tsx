"use client";

import React, { useCallback, useId, useMemo, useState } from "react";
import { EP04_CHALLENGES, type Ep04ChallengeData } from "@/data/ep04Data";
import { EP02_BENCHMARK_TOTALS } from "@/data/ep02Data";
import {
  CARBON_BENCHMARK_STATS,
  CARBON_FULL_BENCHMARKS,
  CARBON_PRICING_TABLE,
} from "@/data/newsData";
import {
  RELEASE_TIMESTAMPS_CST,
  getReleasedStatus,
  type ReleaseKey,
  type ReleasedState,
} from "@/data/releaseSchedule";
import {
  CALENDAR_LABELS,
  CALENDAR_TONES,
  PIXEL_UI_RELEASE_DATE,
} from "@/data/calendar";
import {
  PixelButton,
  PixelKeycap,
  PixelToggle,
  PixelCrank,
  PixelWindow,
  PixelFloppyCard,
  PixelBarChart,
  PixelAudioSequencer,
  PixelDialogBox,
  PixelTelemetryPill,
  PixelCreditBadge,
  PixelSocialBar,
  PixelInput,
  PixelSelect,
  PixelAutocomplete,
  PixelCheckbox,
  PixelRadioGroup,
  PixelCollapse,
  PixelCalendar,
  PixelSlider,
  PixelMultiLineChart,
  PixelDonutGauge,
  PixelIcon,
  PixelSprite,
  PixelSceneAnimation,
  ALL_PIXEL_ICON_NAMES,
  PIXEL_ICON_CATEGORIES,
  PIXEL_CURSOR_PRESETS,
  copyTextToClipboard,
  usePixelSound,
  PIXEL_UI_VERSION,
  PixelContextMenu,
  PixelDataTable,
  PixelDrawer,
  PixelPopover,
  PixelSheet,
  PixelTooltip,
  PixelTabs,
  PixelCopyButton,
  PixelSwipeHint,
  pixelToast,
  type PixelColorTone,
  type PixelMenuItem,
  type PixelSoundName,
  type PixelSpriteCharacter,
  type PixelSpriteMotion,
  type PixelIconName,
  type PixelIconCategoryId,
  type PixelCursorStyle,
  type AmbientSimulationMode,
  type PixelBarChartItem,
  type PixelCalendarEvent,
  type PixelDataTableLabels,
  type PixelMultiSeriesPoint,
  type PixelSceneType,
} from "@mixiuh/pixel-ui";

interface Ep04Row {
  n: number;
  name_es: string;
  name_en: string;
  haiku: number;
  sonnet: number;
  opus: number;
  winner: string;
}

const EP04_ROWS: Ep04Row[] = EP04_CHALLENGES.map((c) => ({
  n: c.n,
  name_es: c.name_es,
  name_en: c.name_en,
  haiku: c.haiku.usd,
  sonnet: c.sonnet.usd,
  opus: c.opus.usd,
  winner: c.winner,
}));

/**
 * One card per sound of the library's synth. Keyed by PixelSoundName, so
 * TypeScript fails here when packages/mixiuh-pixel-ui/src/sound.ts adds a
 * sound without a card. Notes/Hz are the ones sound.ts actually plays.
 */
const SOUND_PRESET_MAP: Record<
  PixelSoundName,
  { label: string; desc_es: string; desc_en: string }
> = {
  click: {
    label: "SFX_CLICK",
    desc_es: "Interruptor mecanico de terminal (1950Hz -> 620Hz)",
    desc_en: "Mechanical terminal micro-switch (1950Hz -> 620Hz)",
  },
  crank: {
    label: "SFX_TUNER_DIAL",
    desc_es: "Perilla rotativa VHF/UHF de televisor CRT",
    desc_en: "CRT TV VHF/UHF rotary tuner dial tick",
  },
  coin: {
    label: "SFX_COIN",
    desc_es: "Moneda arcade 8-bit (B5 -> E6 onda cuadrada)",
    desc_en: "8-bit arcade coin pickup (B5 -> E6 square wave)",
  },
  powerup: {
    label: "SFX_POWERUP",
    desc_es: "Arpegio ascendente de 6 notas chiptune",
    desc_en: "6-note ascending chiptune arpeggio",
  },
  cartridgeInsert: {
    label: "SFX_FLOPPY_LOAD",
    desc_es: "Encaje mecanico de disquete 3.5 + acorde BIOS",
    desc_en: "3.5 floppy disk lock + BIOS boot chord",
  },
  laser: {
    label: "SFX_DEGAUSS",
    desc_es: "Pulso magnetico de desmagnetizacion CRT",
    desc_en: "Magnetic CRT degauss frequency sweep",
  },
  jump: {
    label: "SFX_JUMP",
    desc_es: "Salto de plataformas 8-bit (210Hz -> 680Hz)",
    desc_en: "8-bit platformer jump bend (210Hz -> 680Hz)",
  },
  hit: {
    label: "SFX_CRT_OFF",
    desc_es: "Colapso de tubo catodico / impacto retro",
    desc_en: "Cathode-ray tube power-down / impact thud",
  },
  dialogBlip: {
    label: "SFX_DIALOG",
    desc_es: "Voz sintetizada de dialogo RPG por letra",
    desc_en: "Per-character RPG typewriter voice blip",
  },
  achievement: {
    label: "SFX_FANFARE",
    desc_es: "Fanfarria de logro desbloqueado en 4 tiempos",
    desc_en: "4-step achievement unlocked fanfare",
  },
  toggleOn: {
    label: "SFX_SWITCH_ON",
    desc_es: "Interruptor fisico activado (C5 -> G5)",
    desc_en: "Physical dip-switch ON (C5 -> G5)",
  },
  toggleOff: {
    label: "SFX_SWITCH_OFF",
    desc_es: "Interruptor fisico desactivado (G5 -> A4)",
    desc_en: "Physical dip-switch OFF (G5 -> A4)",
  },
  hover: {
    label: "SFX_TICK_1BIT",
    desc_es: "Pulso sutil 1-bit al pasar el cursor",
    desc_en: "Subtle 1-bit cursor hover tick",
  },
};

const SOUND_PRESETS = (Object.keys(SOUND_PRESET_MAP) as PixelSoundName[]).map(
  (id) => ({ id, ...SOUND_PRESET_MAP[id] })
);

const SPRITE_LIST: {
  id: PixelSpriteCharacter;
  name: string;
  role_es: string;
  role_en: string;
}[] = [
  { id: "mixiuh", name: "MIXIUH", role_es: "Director Lab", role_en: "Lab Director" },
  { id: "carbon", name: "CARBON", role_es: "Reactor #1", role_en: "#1 Reactor" },
  { id: "argon", name: "ARGON", role_es: "Nucleo Neural", role_en: "Neural Core" },
  { id: "opus", name: "OPUS 5.5", role_es: "Arquitecto", role_en: "Architect" },
  { id: "sonnet", name: "SONNET 5.5", role_es: "Unidad Synth", role_en: "Synth Unit" },
  { id: "haiku", name: "HAIKU 5.5", role_es: "Velocidad", role_en: "Speed Unit" },
  { id: "flash", name: "FLASH 3.8", role_es: "Rayo 8-Bit", role_en: "8-Bit Bolt" },
  { id: "crt-monitor", name: "CRT BOT", role_es: "Tele-Monitor", role_en: "Tele-Monitor" },
  { id: "floppy-bot", name: "FLOPPY BOT", role_es: "Unidad 1.44MB", role_en: "1.44MB Unit" },
  { id: "cyber-cat", name: "CYBER CAT", role_es: "Gato de Lab", role_en: "Lab Cat" },
  { id: "mech-drone", name: "MECH DRONE", role_es: "Dron IA", role_en: "AI Drone" },
  { id: "knight-debugger", name: "DEBUGGER", role_es: "Caza-Bugs", role_en: "Bug Slayer" },
  { id: "wizard-llm", name: "ALCHEMIST", role_es: "Mago Prompt", role_en: "Prompt Mage" },
  { id: "arcade-invader", name: "INVADER", role_es: "Invasor 80s", role_en: "80s Invader" },
  { id: "glitch-boss", name: "GLITCH BOSS", role_es: "Jefe Final", role_en: "Final Boss" },
  { id: "pocket-lab", name: "TERMINAL", role_es: "Estacion 3D", role_en: "3D Station" },
];

/** Icon color swatches. The names give each color-only button an accessible name. */
const ICON_COLORS: { hex: string; es: string; en: string }[] = [
  { hex: "#00E5FF", es: "Cian", en: "Cyan" },
  { hex: "#FFD100", es: "Amarillo", en: "Yellow" },
  { hex: "#10B981", es: "Esmeralda", en: "Emerald" },
  { hex: "#FF3355", es: "Coral", en: "Coral" },
  { hex: "#A855F7", es: "Violeta", en: "Violet" },
  { hex: "#F5F2EB", es: "Tiza", en: "Chalk" },
];

const SCENE_LIST: { scene: PixelSceneType; label: string }[] = [
  { scene: "crt-boot", label: "CRT BIOS BOOT" },
  { scene: "floppy-rw", label: "FLOPPY TRACK I/O" },
  { scene: "ai-duel", label: "CARBON VS OPUS DUEL" },
  { scene: "radar-sweep", label: "RADAR TARGET LOCK" },
  { scene: "campfire", label: "8-BIT CAMPFIRE" },
  { scene: "potion-lab", label: "SHADER ALCHEMY" },
  { scene: "hourglass-sand", label: "PIXEL HOURGLASS" },
  { scene: "cassette-spin", label: "DATA CASSETTE" },
];

/* Library counts quoted in the copy, read from the library itself */
const ICON_COUNT = ALL_PIXEL_ICON_NAMES.length;
const BRAND_ICON_COUNT =
  PIXEL_ICON_CATEGORIES.find((c) => c.id === "brands")?.icons.length ?? 0;
const SPRITE_COUNT = SPRITE_LIST.length;
const SCENE_COUNT = SCENE_LIST.length;
const SOUND_COUNT = SOUND_PRESETS.length;
const CURSOR_COUNT = PIXEL_CURSOR_PRESETS.length;
/** The "system" preset is the browser's own cursor, not pixel art. */
const PIXEL_ART_CURSOR_COUNT = PIXEL_CURSOR_PRESETS.filter(
  (c) => c.id !== "system"
).length;

/* ---------------------------------------------------------------------------
   Figures shown in the demos. Every number comes from src/data (the official
   Google DeepMind table and the EP02/EP04 logs); nothing is typed by hand.
   --------------------------------------------------------------------------- */

/** "65.2%" -> 65.2 */
const pctValue = (s: string) => Number.parseFloat(s);
/** "$4.00 USD" -> "$4" */
const shortUsd = (s: string) => s.replace(/ USD$/, "").replace(/\.00$/, "");

const carbonRow = (prefix: string) =>
  CARBON_FULL_BENCHMARKS.find((r) => r.benchmark.startsWith(prefix));
const TERMINAL_BENCH_NAME = "Terminal-Bench 4.0";
const TERMINAL_BENCH = carbonRow(TERMINAL_BENCH_NAME);
const SEC_BENCH = carbonRow("SEC-bench Pro");

/** Standard per-1M-token price (<=200k context) from the official pricing table. */
const priceOf = (modelPrefix: string) => {
  const row = CARBON_PRICING_TABLE.find((r) => r.model_en.startsWith(modelPrefix));
  return row
    ? `${shortUsd(row.input_200k)} / ${shortUsd(row.output_200k)} USD`
    : undefined;
};
const CARBON_PRICE = priceOf("Gemini 4 Carbon (Standard");
const OPUS_PRICE = priceOf("Claude Opus 5.5");

const joinDot = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).join(" · ");

/** Terminal-Bench 4.0 bars (official table): Carbon vs Claude Opus 5.5. */
const TERMINAL_BENCH_BARS: PixelBarChartItem[] = TERMINAL_BENCH
  ? [
      {
        label: `Gemini 4 Carbon (${TERMINAL_BENCH_NAME})`,
        value: pctValue(TERMINAL_BENCH.carbon),
        maxValue: 70,
        displayValue: TERMINAL_BENCH.carbon,
        tone: "cyan",
        badge: TERMINAL_BENCH.winner === "carbon" ? "#1" : undefined,
      },
      {
        label: `Claude Opus 5.5 (${TERMINAL_BENCH_NAME})`,
        value: pctValue(TERMINAL_BENCH.opus55),
        maxValue: 70,
        displayValue: TERMINAL_BENCH.opus55,
        tone: "coral",
        badge: TERMINAL_BENCH.winner === "opus55" ? "#1" : undefined,
      },
    ]
  : [];

/** Carbon donuts: the two headline rows of the official table. */
const CARBON_DONUTS = [
  { row: TERMINAL_BENCH, label: "TERMINAL-BENCH 4.0", tone: "cyan" as const },
  { row: SEC_BENCH, label: "SEC-BENCH PRO", tone: "emerald" as const },
].flatMap(({ row, label, tone }) =>
  row ? [{ label, value: pctValue(row.carbon), displayValue: row.carbon, tone }] : []
);

type Ep04Tier = Ep04ChallengeData["winner"];
const EP04_TIERS: Ep04Tier[] = ["haiku", "sonnet", "opus"];
const EP04_TIER_NAME: Record<Ep04Tier, string> = {
  haiku: "Haiku 5.5",
  sonnet: "Sonnet 5.5",
  opus: "Opus 5.5",
};
const EP04_TIER_COLOR: Record<Ep04Tier, string> = {
  haiku: "#10B981",
  sonnet: "#FFD100",
  opus: "#A855F7",
};
const ep04Code = (c: Ep04ChallengeData) => `R${String(c.n).padStart(2, "0")}`;
const ep04Challenge = (n: number) => EP04_CHALLENGES.find((c) => c.n === n);
/** "61 FPS (Puente Colgante + Faro)" -> "61 FPS" */
const fpsOf = (s: string) => /^\d+ FPS/.exec(s)?.[0];

/** Short x-axis names of the EP04 challenges, by challenge number. */
const EP04_SHORT: Record<number, { es: string; en: string }> = {
  1: { es: "ROVER", en: "ROVER" },
  2: { es: "PHYSARUM", en: "PHYSARUM" },
  3: { es: "PUENTE", en: "BRIDGE" },
  4: { es: "TB-303", en: "TB-303" },
  5: { es: "BVH-RT", en: "BVH-RT" },
  6: { es: "CHIP-8", en: "CHIP-8" },
};

/** Badge and icon of each EP04 challenge in the autocomplete demo. */
const EP04_OPTION_STYLE: Record<number, { badge: string; icon: PixelIconName }> = {
  1: { badge: "PHYSICS", icon: "rocket" },
  2: { badge: "WEBGL2", icon: "dna" },
  3: { badge: "XPBD", icon: "hammer" },
  4: { badge: "WEBAUDIO", icon: "music" },
  5: { badge: "RAYTRACING", icon: "gpu" },
  6: { badge: "EMULATOR", icon: "gamepad" },
};

/** Real EP04 minutes per run; the y axis tops out at the next multiple of 20. */
const EP04_MAX_MIN = Math.max(
  ...EP04_CHALLENGES.flatMap((c) => EP04_TIERS.map((t) => c[t].min))
);
const EP04_CHART_MAX_Y = Math.max(20, Math.ceil(EP04_MAX_MIN / 20) * 20);

/** EP04 Reto 04: Haiku's cost against Opus's (the "24x cheaper" run). */
const ACID_RUN = ep04Challenge(4);
const HAIKU_ROI = ACID_RUN
  ? {
      ratio: Math.round(ACID_RUN.opus.usd / ACID_RUN.haiku.usd),
      savedPct: Math.round((1 - ACID_RUN.haiku.usd / ACID_RUN.opus.usd) * 100),
      haikuUsd: ACID_RUN.haiku.usd.toFixed(2),
      opusUsd: ACID_RUN.opus.usd.toFixed(2),
      code: ep04Code(ACID_RUN),
    }
  : undefined;
/** EP04 Reto 05: Sonnet's path tracer. */
const PATH_TRACER_RUN = ep04Challenge(5);
const EP04_RUN_COUNT = EP04_CHALLENGES.length * EP04_TIERS.length;

/** English labels of the EP04 table (stable object: the table memoizes on it). */
const EP04_TABLE_LABELS_EN: Partial<PixelDataTableLabels> = {
  search: "Search the table",
  searchPlaceholder: "Search...",
  clearSearch: "Clear search",
  noResults: "No results",
  resultsCount: (count) => (count === 1 ? "1 result" : `${count} results`),
  exportCsv: "Export CSV",
  previous: "Previous",
  next: "Next",
  rowsSummary: (from, to, total) => `${from}–${to} of ${total}`,
  pageOf: (page, pages) => `Page ${page} of ${pages}`,
  sortHint: "Sort by",
  sortStatus: (column, direction) =>
    `Sorted by ${column}, ${direction === "asc" ? "ascending" : "descending"}`,
  sortReset: "Original order",
};

/** English labels of the PixelWindow minimize button (the library defaults to Spanish). */
const PIXEL_WINDOW_LABELS_EN = {
  minimizeLabel: "Minimize window",
  expandLabel: "Expand window",
};

/** Components named by each "COPY JSX" button (its accessible name and confirmation). */
const COPY_JSX_TARGETS: Record<string, string> = {
  "comp-input": "PixelInput",
  "comp-select": "PixelSelect",
  "comp-check": "PixelCheckbox",
  "social-bar": "PixelSocialBar",
};

type Bilingual = { es: string; en: string };

/** Section 10 comparison matrix. `bad` cells are drawn in coral. */
const COMPARISON_ROWS: {
  capability: Bilingual;
  mixiuh: Bilingual & { className: string };
  others: (Bilingual & { bad?: boolean })[];
}[] = [
  {
    capability: {
      es: "Formularios Pro (Input, Select, Autocomplete, Checks, Radio, Slider, Calendar)",
      en: "Pro Forms (Input, Select, Autocomplete, Checks, Radio, Slider, Calendar)",
    },
    mixiuh: {
      es: "INCLUIDO (desde v2.2, con Audio 8-Bit + Tones)",
      en: "INCLUDED (since v2.2, with 8-Bit Audio + Tones)",
      className: "text-[#10B981]",
    },
    others: [
      { es: "Incluido (Estilo corporativo plano)", en: "Included (Flat corporate style)" },
      { es: "Incluido (Pesado, sin pixel-art)", en: "Included (Heavy, no pixel art)" },
      { es: "Incompleto (Sin Autocomplete ni Calendar)", en: "Incomplete (No Autocomplete or Calendar)", bad: true },
    ],
  },
  {
    capability: {
      es: "Visualizacion de Datos (MultiLine, Bar, Versus, Sparkline, Donut Gauge)",
      en: "Data Visualization (MultiLine, Bar, Versus, Sparkline, Donut Gauge)",
    },
    mixiuh: { es: "INCLUIDO NATIVO (SVG CrispEdges)", en: "BUILT IN (SVG CrispEdges)", className: "text-[#10B981]" },
    others: [
      { es: "Requiere Recharts externo", en: "Requires external Recharts" },
      { es: "Paquete empresarial separado", en: "Separate enterprise package" },
      { es: "No existe", en: "Not available", bad: true },
    ],
  },
  {
    capability: {
      es: 'Hardware Retro 3D (Monitor CRT 3D, Disquetes 3.5", Perilla VHF, Keycaps)',
      en: '3D Retro Hardware (3D CRT Monitor, 3.5" Floppies, VHF Dial, Keycaps)',
    },
    mixiuh: {
      es: "EXCLUSIVO MIXIUH (3D + Degauss + Fosforo)",
      en: "MIXIUH EXCLUSIVE (3D + Degauss + Phosphor)",
      className: "text-[#00E5FF]",
    },
    others: [
      { es: "No existe", en: "Not available", bad: true },
      { es: "No existe", en: "Not available", bad: true },
      { es: "Solo bordes 2D basicos", en: "Basic 2D borders only", bad: true },
    ],
  },
  {
    capability: {
      es: "Iconografia Vectorial Pixel-Art + Marcas (YouTube, X, Instagram, TikTok, Google)",
      en: "Pixel-Art Vector Icons + Brands (YouTube, X, Instagram, TikTok, Google)",
    },
    mixiuh: {
      es: `${ICON_COUNT} ICONOS 16x16 NATIVOS (Cero Emojis)`,
      en: `${ICON_COUNT} NATIVE 16x16 ICONS (Zero Emojis)`,
      className: "text-[#10B981]",
    },
    others: [
      { es: "Usa Lucide (Lineas curvas)", en: "Uses Lucide (Curved strokes)" },
      { es: "Material Icons (Curvos)", en: "Material Icons (Curved)" },
      { es: "Menos de 25 iconos", en: "Fewer than 25 icons" },
    ],
  },
  {
    capability: {
      es: "Navegacion Pro y Accesibilidad (Command Palette Ctrl+K, Tabs con teclado, Toasts, foco visible, prefers-reduced-motion)",
      en: "Pro Navigation & Accessibility (Ctrl+K Command Palette, keyboard Tabs, Toasts, visible focus, prefers-reduced-motion)",
    },
    mixiuh: {
      es: "INCLUIDO (v2.5 · WAI-ARIA + teclado)",
      en: "INCLUDED (v2.5 · WAI-ARIA + keyboard)",
      className: "text-[#10B981]",
    },
    others: [
      { es: "Incluido (cmdk + Radix por separado)", en: "Included (cmdk + Radix separately)" },
      { es: "Parcial (sin Command Palette)", en: "Partial (no Command Palette)" },
      { es: "No existe", en: "Not available", bad: true },
    ],
  },
  {
    capability: {
      es: "Audio Chiptune WebAudio + Cursores + Fondo IA + Scroll Procedural",
      en: "WebAudio Chiptune + Cursors + AI Background + Procedural Scroll",
    },
    mixiuh: {
      es: `INCLUIDO (${SOUND_COUNT} SFX + Secuenciador + Bots IA)`,
      en: `INCLUDED (${SOUND_COUNT} SFX + Sequencer + AI Bots)`,
      className: "text-[#FFD100]",
    },
    others: [
      { es: "No existe", en: "Not available", bad: true },
      { es: "No existe", en: "Not available", bad: true },
      { es: "No existe", en: "Not available", bad: true },
    ],
  },
];

/** Section 10 roadmap cards. Versions follow the library README (2.2 forms, 2.3 overlays, 2.5 data & overlays). */
const ROADMAP_PHASES: {
  borderClass: string;
  badgeClass: string;
  badge: Bilingual;
  title: Bilingual;
  done?: boolean;
  items: Bilingual[];
}[] = [
  {
    borderClass: "border-[#10B981]",
    badgeClass: "bg-[#10B981]",
    badge: { es: "FASE 1 · COMPLETADO (v2.2)", en: "PHASE 1 · DONE (v2.2)" },
    title: {
      es: "Core Pixel-Art, Hardware 3D, Formularios y Graficas",
      en: "Pixel-Art Core, 3D Hardware, Forms & Charts",
    },
    items: [
      {
        es: `${ICON_COUNT} iconos 16x16 (incluye ${BRAND_ICON_COUNT} marcas: X, YT, IG, TikTok, Google)`,
        en: `${ICON_COUNT} 16x16 icons (incl. ${BRAND_ICON_COUNT} brands: X, YT, IG, TikTok, Google)`,
      },
      { es: 'Monitor CRT 3D + Disquetes 3.5" + Keycaps', en: '3D CRT Monitor + 3.5" Floppies + Keycaps' },
      {
        es: "Input, Select, Autocomplete, Checkbox, Radio, Slider",
        en: "Input, Select, Autocomplete, Checkbox, Radio, Slider",
      },
      {
        es: "Collapse, Calendar, MultiLineChart, DonutGauge",
        en: "Collapse, Calendar, MultiLineChart, DonutGauge",
      },
      {
        es: `${SPRITE_COUNT} Sprites + ${SCENE_COUNT} Escenas + ${SOUND_COUNT} SFX + Scroll Procedural`,
        en: `${SPRITE_COUNT} Sprites + ${SCENE_COUNT} Scenes + ${SOUND_COUNT} SFX + Procedural Scroll`,
      },
    ],
  },
  {
    borderClass: "border-[#00E5FF]",
    badgeClass: "bg-[#00E5FF]",
    badge: { es: "FASE 2 · COMPLETADO (v2.5)", en: "PHASE 2 · DONE (v2.5)" },
    title: {
      es: "Command Palette, Notificaciones, DataGrid y Overlays",
      en: "Command Palette, Notifications, DataGrid & Overlays",
    },
    done: true,
    items: [
      { es: "PixelCommandPalette (Ctrl+K / Cmd+K estilo BIOS)", en: "PixelCommandPalette (BIOS-style Ctrl+K / Cmd+K)" },
      { es: "PixelToaster + pixelToast (alertas con fanfarria)", en: "PixelToaster + pixelToast (alerts with fanfare)" },
      { es: "PixelTabs, PixelCopyButton y PixelBackToTop", en: "PixelTabs, PixelCopyButton & PixelBackToTop" },
      {
        es: "PixelDataTable (orden, filtros, paginacion, export CSV)",
        en: "PixelDataTable (sorting, filters, pagination, CSV export)",
      },
      {
        es: "PixelDrawer, PixelSheet, PixelTooltip y PixelPopover",
        en: "PixelDrawer, PixelSheet, PixelTooltip & PixelPopover",
      },
      {
        es: "PixelContextMenu (menu clic derecho + Shift+F10)",
        en: "PixelContextMenu (right-click menu + Shift+F10)",
      },
    ],
  },
  {
    borderClass: "border-[#FFD100]",
    badgeClass: "bg-[#FFD100]",
    badge: { es: "FASE 3 · FLUJOS AVANZADOS Y MEDIA (v3.0)", en: "PHASE 3 · ADVANCED FLOWS & MEDIA (v3.0)" },
    title: {
      es: "Kanban, Editor de Codigo, Grafos de Nodos y Graficas 3D",
      en: "Kanban, Code Editor, Node Graphs & 3D Charts",
    },
    items: [
      {
        es: "PixelKanbanBoard (Drag & Drop con fisica de cartuchos)",
        en: "PixelKanbanBoard (Drag & Drop with cartridge physics)",
      },
      {
        es: "PixelCodeEditor & DiffViewer (Comparador lado a lado)",
        en: "PixelCodeEditor & DiffViewer (Side-by-side comparison)",
      },
      {
        es: "PixelNodeGraph (Editor visual de flujos de agentes IA)",
        en: "PixelNodeGraph (Visual AI-agent flow editor)",
      },
      {
        es: "PixelRadarChart, Heatmap & Candlestick financiero",
        en: "PixelRadarChart, Heatmap & financial Candlestick",
      },
      {
        es: "PixelFileDropzone (Subida de archivos con animacion Floppy)",
        en: "PixelFileDropzone (File upload with a Floppy animation)",
      },
    ],
  },
  {
    borderClass: "border-[#A855F7]",
    badgeClass: "bg-[#A855F7]",
    badge: {
      es: "FASE 4 · ECOSISTEMA CLI Y MULTI-FRAMEWORK (v4.0)",
      en: "PHASE 4 · CLI & MULTI-FRAMEWORK ECOSYSTEM (v4.0)",
    },
    title: {
      es: "CLI npx mixiuh-pixel-ui, Editor de Sprites y Temas",
      en: "npx mixiuh-pixel-ui CLI, Sprite Editor & Themes",
    },
    items: [
      {
        es: "CLI oficial: npx @mixiuh/pixel-ui add [component]",
        en: "Official CLI: npx @mixiuh/pixel-ui add [component]",
      },
      {
        es: "Theme Builder en vivo (Exportador de variables CSS/Tailwind)",
        en: "Live Theme Builder (CSS/Tailwind variable exporter)",
      },
      {
        es: "Editor de Sprites e Iconos 16x16 en el navegador",
        en: "In-browser 16x16 Sprite & Icon Editor",
      },
      {
        es: "Adaptadores Web Components / Vue / Svelte / Astro",
        en: "Web Components / Vue / Svelte / Astro adapters",
      },
      {
        es: "Kit oficial de Figma con Auto-Layout y tokens",
        en: "Official Figma kit with Auto-Layout & tokens",
      },
    ],
  },
];

export interface PixelUiShowcaseProps {
  lang: "es" | "en";
  cursorStyle?: PixelCursorStyle;
  onChangeCursor?: (c: PixelCursorStyle) => void;
  ambientMode?: AmbientSimulationMode;
  onChangeAmbient?: (m: AmbientSimulationMode) => void;
  /**
   * Which productions are public (page state, which honours ?preview=all).
   * Without it the calendar demo uses the visitor's clock.
   */
  released?: ReleasedState;
}

/**
 * A callback ref plus whether its element's content is wider than its box
 * (re-measured on resize), like PixelDataTable's scroller. A ref callback, so
 * it follows the element when PixelWindow remounts its body after minimizing.
 */
function useOverflowsX() {
  const [overflowing, setOverflowing] = useState(false);
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      setOverflowing(el.scrollWidth > el.clientWidth + 1);
    });
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      observer.disconnect();
      setOverflowing(false);
    };
  }, []);
  return [ref, overflowing] as const;
}

export default function PixelUiShowcase({
  lang,
  cursorStyle = "cyber-arrow",
  onChangeCursor,
  ambientMode = "ai-ecosystem",
  onChangeAmbient,
  released,
}: PixelUiShowcaseProps) {
  const es = lang === "es";
  // Spread into every PixelWindow
  const windowLabels = es ? {} : PIXEL_WINDOW_LABELS_EN;
  const { enabled: soundEnabled, play, toggle: toggleSound } = usePixelSound();
  // Prefix for the ids that label each selector group
  const uid = useId();
  const [tunerAngle, setTunerAngle] = useState(90);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [switchC, setSwitchC] = useState(true);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<PixelIconName>("youtube");
  const [iconCategory, setIconCategory] = useState<PixelIconCategoryId>("all");
  const [iconSearch, setIconSearch] = useState("");
  const [iconColor, setIconColor] = useState("#00E5FF");
  const [iconSize, setIconSize] = useState<16 | 24 | 32>(24);
  const [spriteMotion, setSpriteMotion] = useState<PixelSpriteMotion>("float");
  const [creditVariant, setCreditVariant] = useState<
    "pill" | "hardware" | "minimal" | "banner"
  >("hardware");

  // Live Customizer State for Pro Form, Navigation & Chart Components
  const [customTone, setCustomTone] = useState<PixelColorTone>("cyan");
  const [customSize, setCustomSize] = useState<"sm" | "md" | "lg">("md");
  const [demoInput, setDemoInput] = useState("gemini-4-carbon-zero-shot");
  const [demoSelect, setDemoSelect] = useState("carbon");
  const [demoAuto, setDemoAuto] = useState("ep04-r04");
  const [demoCheckA, setDemoCheckA] = useState(true);
  const [demoCheckB, setDemoCheckB] = useState(true);
  const [demoCheckC, setDemoCheckC] = useState(false);
  const [demoRadio, setDemoRadio] = useState("60fps");
  const [demoSlider, setDemoSlider] = useState(60);
  const [demoCalDate, setDemoCalDate] = useState(PIXEL_UI_RELEASE_DATE);
  const [demoTab, setDemoTab] = useState<"palette" | "toasts" | "a11y">(
    "palette"
  );
  const [demoDrawer, setDemoDrawer] = useState(false);
  const [demoSheet, setDemoSheet] = useState(false);
  // The comparison matrix scrolls sideways on phones: a named tab stop only then
  const [matrixRef, matrixOverflowing] = useOverflowsX();

  // Release calendar built like the home one (shared labels, tones and date in
  // @/data/calendar): the timestamps that gate the content (published
  // productions only) plus the current Pixel UI release.
  const rel = useMemo<ReleasedState>(
    () => released ?? getReleasedStatus(),
    [released]
  );
  const calendarEvents: PixelCalendarEvent[] = [
    ...(Object.keys(RELEASE_TIMESTAMPS_CST) as ReleaseKey[])
      .filter((key) => rel[key])
      .map((key) => ({
        date: RELEASE_TIMESTAMPS_CST[key].slice(0, 10),
        label: es ? CALENDAR_LABELS[key].es : CALENDAR_LABELS[key].en,
        tone: CALENDAR_TONES[key],
      })),
    {
      date: PIXEL_UI_RELEASE_DATE,
      label: `Mixiuh Pixel UI v${PIXEL_UI_VERSION}`,
      tone: "yellow" as const,
    },
  ].sort((a, b) => a.date.localeCompare(b.date));

  // Sublabels lead with the figure: the list truncates them on phones and the
  // trigger truncates them on desktop. Sonnet/Haiku per-token prices have no
  // source in src/data, so those two quote their EP04 runs instead.
  const modelOptions = [
    {
      value: "carbon",
      label: "Gemini 4 Carbon",
      sublabel: joinDot(
        TERMINAL_BENCH && `${TERMINAL_BENCH.carbon} ${TERMINAL_BENCH_NAME}`,
        CARBON_PRICE
      ),
      badge: "#1 GLOBAL",
      icon: "gemini-brand" as const,
    },
    {
      value: "opus",
      label: "Claude Opus 5.5",
      sublabel: joinDot(
        TERMINAL_BENCH && `${TERMINAL_BENCH.opus55} ${TERMINAL_BENCH_NAME}`,
        OPUS_PRICE
      ),
      badge: "ARCHITECT",
      icon: "anthropic" as const,
    },
    {
      value: "sonnet",
      label: "Claude Sonnet 5.5",
      sublabel: PATH_TRACER_RUN
        ? joinDot(
            `Path Tracer ${fpsOf(PATH_TRACER_RUN.sonnet.fps) ?? `${PATH_TRACER_RUN.sonnet.min} min`}`,
            `EP04 ${ep04Code(PATH_TRACER_RUN)}`
          )
        : undefined,
      badge: "BALANCED",
      icon: "cpu" as const,
    },
    {
      value: "haiku",
      label: "Claude Haiku 5.5",
      sublabel: HAIKU_ROI
        ? joinDot(
            es
              ? `${HAIKU_ROI.ratio}x mas barato que Opus`
              : `${HAIKU_ROI.ratio}x cheaper than Opus`,
            `EP04 ${HAIKU_ROI.code}`
          )
        : undefined,
      badge: "ROI KING",
      icon: "bolt" as const,
    },
  ];

  // One option per EP04 challenge: its winner, that run's cost and frame rate
  const ep04Options = EP04_CHALLENGES.map((c) => {
    const run = c[c.winner];
    const style = EP04_OPTION_STYLE[c.n];
    return {
      value: `ep04-${ep04Code(c).toLowerCase()}`,
      label: `EP04 ${ep04Code(c)}: ${es ? c.name_es : c.name_en}`,
      sublabel: joinDot(
        `${EP04_TIER_NAME[c.winner]} ($${run.usd.toFixed(2)})`,
        fpsOf(run.fps)
      ),
      badge: style?.badge,
      icon: style?.icon,
    };
  });

  const ep04MinutesData: PixelMultiSeriesPoint[] = EP04_CHALLENGES.map((c) => {
    const short = EP04_SHORT[c.n];
    return {
      label: short ? `${ep04Code(c)} ${es ? short.es : short.en}` : ep04Code(c),
      values: { haiku: c.haiku.min, sonnet: c.sonnet.min, opus: c.opus.min },
    };
  });

  const contextMenuItems: PixelMenuItem[] = [
    { type: "label", id: "lbl", label: lang === "es" ? "CARTUCHO EP04" : "EP04 CARTRIDGE" },
    {
      id: "load",
      label: lang === "es" ? "Cargar cartucho" : "Load cartridge",
      icon: "play",
      shortcut: "Enter",
      onSelect: () => pixelToast.show({ title: lang === "es" ? "CARTUCHO CARGADO" : "CARTRIDGE LOADED", tone: "emerald", icon: "cartridge" }),
    },
    {
      id: "copy",
      label: lang === "es" ? "Copiar ROM" : "Copy ROM",
      icon: "copy",
      shortcut: "Ctrl C",
      onSelect: () => pixelToast.show({ title: lang === "es" ? "ROM COPIADA" : "ROM COPIED", tone: "cyan", icon: "copy" }),
    },
    { type: "separator", id: "sep" },
    {
      id: "erase",
      label: lang === "es" ? "Borrar partida" : "Erase save",
      icon: "trash",
      danger: true,
      onSelect: () => pixelToast.show({ title: lang === "es" ? "PARTIDA BORRADA" : "SAVE ERASED", tone: "coral", icon: "trash", sound: "hit" }),
    },
  ];

  const overlaySnippet = `import {
  PixelCommandPalette,
  PixelToaster,
  pixelToast,
  PixelTabs,
} from "@mixiuh/pixel-ui";

<PixelCommandPalette open={open} onOpenChange={setOpen} items={[
  { id: "home", label: "${es ? "Inicio" : "Home"}", icon: "home", onSelect: goHome },
]} />
<PixelToaster />

pixelToast.show({ title: "${es ? "GUARDADO" : "SAVED"}", tone: "emerald", icon: "check" });`;

  const copyCode = (id: string, text: string) => {
    void copyTextToClipboard(text);
    play("coin");
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // "COPY JSX" button: its accessible name starts with the visible text and
  // names the component it copies (all of them used to read just "COPY JSX")
  const copyJsxButton = (id: string, snippet: string, className: string) => {
    const component = COPY_JSX_TARGETS[id] ?? id;
    const copied = copiedSnippet === id;
    return (
      <button
        type="button"
        onClick={() => copyCode(id, snippet)}
        aria-label={
          copied
            ? es
              ? `Copiado: ${component}`
              : `Copied: ${component}`
            : es
            ? `Copiar JSX: ${component}`
            : `Copy JSX: ${component}`
        }
        className={`${className} shrink-0 inline-flex items-center justify-center min-h-6 whitespace-nowrap text-[#090B10] font-pixel text-[10px] font-bold cursor-pointer`}
      >
        {copied ? (es ? "COPIADO" : "COPIED") : es ? "COPIAR JSX" : "COPY JSX"}
      </button>
    );
  };

  // Screen-reader confirmation for copyCode (sprite cards have no visible
  // feedback, and neither the COPY JSX label nor the icon message is a live region).
  const copyStatus = (() => {
    if (!copiedSnippet) return "";
    const target = COPY_JSX_TARGETS[copiedSnippet];
    if (target) {
      return es ? `JSX de ${target} copiado` : `${target} JSX copied`;
    }
    if (copiedSnippet.startsWith("sprite-")) {
      const name =
        SPRITE_LIST.find((sp) => `sprite-${sp.id}` === copiedSnippet)?.name ??
        "sprite";
      return es ? `JSX de ${name} copiado` : `${name} JSX copied`;
    }
    if (copiedSnippet.startsWith("icon-")) {
      const name = copiedSnippet.slice("icon-".length);
      return es ? `JSX del icono ${name} copiado` : `${name} icon JSX copied`;
    }
    return es ? "Código copiado" : "Code copied";
  })();

  const categoryPool =
    iconCategory === "all"
      ? ALL_PIXEL_ICON_NAMES
      : PIXEL_ICON_CATEGORIES.find((c) => c.id === iconCategory)?.icons ||
        ALL_PIXEL_ICON_NAMES;

  const filteredIcons = categoryPool.filter((n) =>
    n.toLowerCase().includes(iconSearch.trim().toLowerCase())
  );

  const creditSnippet = `<!-- Mixiuh Pixel UI v${PIXEL_UI_VERSION} (Free Commercial & Personal Use with Attribution) -->
<link rel="stylesheet" href="https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui.css" />

<!-- React / Next.js Attribution Component -->
import { PixelCreditBadge } from "@mixiuh/pixel-ui";
<PixelCreditBadge variant="${creditVariant}" />

<!-- Plain HTML Attribution -->
<a href="https://labs.mixiuh.online#pixel-ui" target="_blank" rel="noopener">
  UI powered by Mixiuh Pixel UI (labs.mixiuh.online)
</a>`;

  return (
    <div className="py-8 sm:py-10 space-y-10 relative z-10">
      {/* First child so it never changes the space-y margins of the layout */}
      <p role="status" className="sr-only">
        {copyStatus}
      </p>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HERO BANNER — RETRO CRT COMPUTER & OPEN SOURCE PIXEL UI */}
        <div className="bg-[#FFD100] text-[#090B10] border-3 border-[#090B10] shadow-[8px_8px_0_#040508] p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#090B10] text-[#FFD100] font-pixel text-xs font-bold">
                  {`@MIXIUH/PIXEL-UI v${PIXEL_UI_VERSION}`}
                </span>
                <span className="px-3 py-1 bg-[#F5F2EB] text-[#090B10] border-2 border-[#090B10] font-mono-hud text-xs font-bold">
                  {lang === "es"
                    ? "100% GRATIS · USO COMERCIAL Y PERSONAL CON CREDITO"
                    : "100% FREE · COMMERCIAL & PERSONAL USE WITH CREDIT"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.04]">
                {lang === "es"
                  ? "La Libreria Pixel-Art, Retro CRT 3D, Cursores y Audio 8-Bit Mas Completa del Mundo."
                  : "The World's Most Complete Pixel-Art, 3D Retro CRT, Custom Cursor & 8-Bit Audio UI Library."}
              </h1>

              <p className="text-sm sm:text-base font-medium text-[#090B10]/85 leading-relaxed">
                {lang === "es"
                  ? `Creada desde cero por Mixiuh Labs: combina superficies opacas de alto contraste con monitores CRT 3D, disquetes 3.5", ${ICON_COUNT} iconos vectoriales 16x16 (incluyendo ${BRAND_ICON_COUNT} marcas y redes sociales como YouTube, X, Instagram, TikTok, Facebook, Google, GitHub, Discord), ${SPRITE_COUNT} sprites animados, ${SCENE_COUNT} escenas pixel-art, ${PIXEL_ART_CURSOR_COUNT} cursores pixel-art, generacion procedural por pixeles al hacer scroll y un secuenciador WebAudio 8-bit con ${SOUND_COUNT} efectos.`
                  : `Built from scratch by Mixiuh Labs: combines high-contrast opaque surfaces with 3D CRT monitors, 3.5" floppy disks, ${ICON_COUNT} 16x16 vector icons (including ${BRAND_ICON_COUNT} social & tech brands like YouTube, X, Instagram, TikTok, Facebook, Google, GitHub, Discord), ${SPRITE_COUNT} animated sprites, ${SCENE_COUNT} pixel-art scenes, ${PIXEL_ART_CURSOR_COUNT} pixel-art cursors, procedural pixel scroll reveal, and an 8-bit WebAudio synth & sequencer with ${SOUND_COUNT} effects.`}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/pixel-ui/mixiuh-pixel-ui-kit.zip"
                  download
                  onClick={() => play("powerup")}
                  className="px-btn bg-[#090B10] text-[#FFD100] px-5 py-3 text-xs sm:text-sm"
                >
                  <PixelIcon name="download" size={16} color="#FFD100" />
                  <span>
                    {lang === "es"
                      ? `Descargar Libreria v${PIXEL_UI_VERSION} (.ZIP)`
                      : `Download Library v${PIXEL_UI_VERSION} (.ZIP)`}
                  </span>
                </a>

                <a
                  href="/pixel-ui/mixiuh-pixel-ui.css"
                  download
                  onClick={() => play("coin")}
                  className="px-btn bg-[#F5F2EB] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                >
                  <PixelIcon name="code" size={16} color="#090B10" />
                  <span>mixiuh-pixel-ui.css (CDN)</span>
                </a>

                <button
                  type="button"
                  onClick={toggleSound}
                  className="px-btn bg-[#00E5FF] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                >
                  <PixelIcon
                    name={soundEnabled ? "volume-on" : "volume-off"}
                    size={16}
                    color="#090B10"
                  />
                  <span>
                    {soundEnabled ? "WEB AUDIO SFX: ON" : "WEB AUDIO SFX: OFF"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Retro VHF Tuner Dial & 3D Mechanical Keycaps */}
            <div className="lg:col-span-5 bg-[#090B10] text-[#F5F2EB] border-3 border-[#090B10] shadow-[6px_6px_0_rgba(0,0,0,0.35)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A344B] pb-2.5 font-mono-hud text-xs">
                <span className="font-pixel text-[#FFD100]">
                  CRT-9000 DECK // HARDWARE TEST
                </span>
                <span className="text-[#00E5FF] font-bold">VHF / 60Hz</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <PixelCrank
                  angle={tunerAngle}
                  onChange={setTunerAngle}
                  label={
                    lang === "es" ? "SINTONIZADOR VHF" : "VHF ROTARY TUNER"
                  }
                />
                <div className="flex items-center gap-2">
                  <PixelKeycap
                    keyLabel="A"
                    caption="COIN"
                    tone="yellow"
                    onTrigger={() => play("coin")}
                  />
                  <PixelKeycap
                    keyLabel="B"
                    caption="DEGAUSS"
                    tone="coral"
                    onTrigger={() => play("laser")}
                  />
                  <PixelKeycap
                    keyLabel="X"
                    caption="BOOT"
                    tone="cyan"
                    onTrigger={() => play("powerup")}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#131824] border border-[#2A344B] font-mono-hud text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">
                    {lang === "es"
                      ? "FRECUENCIA DE CANAL CRT"
                      : "CRT CHANNEL FREQUENCY"}
                  </span>
                  <span className="font-pixel text-[#00E5FF]">
                    {tunerAngle} MHz
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3"
                      style={{
                        backgroundColor:
                          i <= Math.floor((tunerAngle / 360) * 12)
                            ? "#00E5FF"
                            : "#090B10",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: CUSTOM PIXEL MOUSE & PROCEDURAL AI ECOSYSTEM CONTROLS */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? "01 // PERSONALIZACION DE CURSOR PIXEL-ART Y ECOSISTEMA IA DE FONDO"
              : "01 // PIXEL-ART CURSOR CUSTOMIZATION & AI BACKGROUND ECOSYSTEM"
          }
          subtitle={
            lang === "es"
              ? "Cambia el puntero del mouse en vivo y controla los agentes IA procedurales que patrullan el fondo"
              : "Switch your live mouse pointer and control the procedural AI agents patrolling the background"
          }
          tone="yellow"
          statusLeft={`ACTIVE CURSOR: ${cursorStyle.toUpperCase()}`}
          statusRight={`BACKGROUND ENGINE: ${ambientMode.toUpperCase()}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Pixel Cursor Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  id={`${uid}-cursor-label`}
                  className="font-pixel text-xs text-[#FFD100]"
                >
                  {es
                    ? `A. ${PIXEL_ART_CURSOR_COUNT} CURSORES PIXEL-ART + EL DEL SISTEMA (USE_PIXEL_CURSOR)`
                    : `A. ${PIXEL_ART_CURSOR_COUNT} PIXEL-ART CURSORS + THE SYSTEM ONE (USE_PIXEL_CURSOR)`}
                </span>
                <PixelIcon name="cursor-hand" size={16} color="#FFD100" />
              </div>
              <p className="text-xs text-[#94A3B8]">
                {lang === "es"
                  ? `Haz clic en cualquiera de los ${CURSOR_COUNT} estilos para cambiar inmediatamente el cursor de toda la web (los pixel-art incluyen estado normal + mano pixelada sobre botones):`
                  : `Click any of the ${CURSOR_COUNT} styles to immediately switch the cursor across the entire website (the pixel-art ones include a normal state + pixel hand on buttons):`}
              </p>
              <div
                role="group"
                aria-labelledby={`${uid}-cursor-label`}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
              >
                {PIXEL_CURSOR_PRESETS.map((c) => {
                  const active = cursorStyle === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onChangeCursor?.(c.id)}
                      className={`p-3 border-2 text-left transition cursor-pointer ${
                        active
                          ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold shadow-[3px_3px_0_#00E5FF]"
                          : "bg-[#131824] text-[#F5F2EB] border-[#2A344B] hover:border-[#FFD100]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <PixelIcon
                          name="mouse"
                          size={14}
                          color={active ? "#090B10" : c.accent}
                        />
                        <span className="font-pixel text-[10px]">
                          {active
                            ? es
                              ? "ACTIVO"
                              : "ACTIVE"
                            : es
                            ? "ELEGIR"
                            : "SELECT"}
                        </span>
                      </div>
                      <div className="font-mono-hud text-xs font-bold truncate">
                        {lang === "es" ? c.name_es : c.name_en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Procedural Background AI Simulation Mode Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  id={`${uid}-ambient-label`}
                  className="font-pixel text-xs text-[#00E5FF]"
                >
                  {es
                    ? "B. FONDO PROCEDURAL CON AGENTES IA (PIXEL_AMBIENT_BG)"
                    : "B. PROCEDURAL AI-AGENT BACKGROUND (PIXEL_AMBIENT_BG)"}
                </span>
                <PixelIcon name="brain-ai" size={16} color="#00E5FF" />
              </div>
              <p className="text-xs text-[#94A3B8]">
                {lang === "es"
                  ? "Observa el fondo de la pagina: pequeños bots pixel-art (Carbon, Argon, Opus, Haiku) patrullan la grilla, conversan entre si enviando paquetes de datos, construyen nodos y escanean tu cursor al acercarte:"
                  : "Look at the page background: tiny pixel-art bots (Carbon, Argon, Opus, Haiku) patrol the grid, chat by exchanging data packets, build nodes, and scan your cursor when you move near them:"}
              </p>
              <div
                role="group"
                aria-labelledby={`${uid}-ambient-label`}
                className="grid grid-cols-2 gap-2.5"
              >
                {(
                  [
                    {
                      id: "ai-ecosystem" as const,
                      es: "Ecosistema Agentes IA (Bots + Nodos)",
                      en: "AI Agent Ecosystem (Bots + Nodes)",
                    },
                    {
                      id: "neural-packets" as const,
                      es: "Solo Paquetes y Circuitos",
                      en: "Data Packets & Circuits Only",
                    },
                    {
                      id: "voxel-rain" as const,
                      es: "Lluvia Binaria Voxel 8-Bit",
                      en: "8-Bit Voxel Binary Rain",
                    },
                    {
                      id: "off" as const,
                      es: "Fondo Estatico (Pausar)",
                      en: "Static Grid (Pause)",
                    },
                  ]
                ).map((m) => {
                  const active = ambientMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        play("click");
                        onChangeAmbient?.(m.id);
                      }}
                      className={`p-3 border-2 text-left font-mono-hud text-xs transition cursor-pointer ${
                        active
                          ? "bg-[#00E5FF] text-[#090B10] border-[#090B10] font-bold shadow-[3px_3px_0_#FFD100]"
                          : "bg-[#131824] text-[#F5F2EB] border-[#2A344B] hover:border-[#00E5FF]"
                      }`}
                    >
                      <div className="font-pixel text-[10px] mb-1">
                        {active
                          ? es
                            ? "● ACTIVO"
                            : "● RUNNING"
                          : es
                          ? "○ MODO"
                          : "○ MODE"}
                      </div>
                      <div className="font-bold">
                        {lang === "es" ? m.es : m.en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 2: 8-BIT STEP SEQUENCER & WEBAUDIO SYNTHESIZER (ONE CARD PER LIBRARY SOUND) */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? "02 // SECUENCIADOR CHIPTUNE 8-BIT + SINTETIZADOR WEBAUDIO"
              : "02 // 8-BIT CHIPTUNE SEQUENCER + WEBAUDIO SYNTHESIZER"
          }
          subtitle={
            lang === "es"
              ? `Compon ritmos 8-bit en vivo y prueba los ${SOUND_COUNT} efectos procedurales sin archivos MP3`
              : `Compose live 8-bit loops and test all ${SOUND_COUNT} procedural sound effects with zero MP3 files`
          }
          tone="cyan"
          statusLeft="WEBAUDIO SYNTHESIS"
          statusRight="ZERO EXTERNAL ASSETS"
        >
          <div className="space-y-6">
            <PixelAudioSequencer
              cellLabel={(track, step) =>
                es ? `${track} paso ${step}` : `${track} step ${step}`
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SOUND_PRESETS.map((s) => (
                // A real button (Enter / Space). Inner spans keep valid button
                // content; items-stretch + text-left undo the UA button defaults
                // so it looks exactly like the former card div.
                // Named by its whole visible text (label, description, call, PLAY),
                // so speech input can use any of it; the hidden verb leads.
                <button
                  key={s.id}
                  type="button"
                  onClick={() => play(s.id)}
                  className="p-3.5 bg-[#131824] border-2 border-[#2A344B] hover:border-[#FFD100] shadow-[4px_4px_0_#040508] active:translate-y-0.5 cursor-pointer transition flex flex-col items-stretch justify-between text-left"
                >
                  <span className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-pixel text-xs font-bold text-[#FFD100]">
                      <span className="sr-only">{es ? "Reproducir " : "Play "}</span>
                      {s.label}
                    </span>
                    <PixelIcon name="volume-on" size={14} color="#00E5FF" />
                  </span>
                  <span className="block text-xs text-[#94A3B8] leading-snug">
                    {lang === "es" ? s.desc_es : s.desc_en}
                  </span>
                  <span className="mt-3 pt-2 border-t border-[#2A344B] flex items-center justify-between font-mono-hud text-[10px]">
                    <code className="text-[#00E5FF]">{`play("${s.id}")`}</code>
                    <span className="px-1.5 py-0.5 bg-[#FFD100] text-[#090B10] font-bold">
                      PLAY ▶
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 3: 16 ANIMATED SPRITES + 8 PIXEL-ART MINI SCENES */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? `03 // ${SPRITE_COUNT} SPRITES PIXEL-ART ANIMADOS Y ${SCENE_COUNT} ESCENAS PROCEDURALES`
              : `03 // ${SPRITE_COUNT} ANIMATED PIXEL-ART SPRITES & ${SCENE_COUNT} PROCEDURAL SCENES`
          }
          subtitle={
            es
              ? "Controla el estado de animacion en vivo y copia el JSX de cualquier sprite"
              : "Control the animation state live and copy any sprite's JSX"
          }
          tone="emerald"
          statusLeft={`${SPRITE_COUNT} CHARACTERS + ${SCENE_COUNT} SCENES`}
          statusRight="CRISP 16x16 SVG"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A344B] pb-3">
              <span className="font-pixel text-xs text-[#10B981]">
                {es
                  ? `A. GALERIA DE ${SPRITE_COUNT} SPRITES (`
                  : `A. ${SPRITE_COUNT}-SPRITE GALLERY (`}
                <code className="text-white">&lt;PixelSprite /&gt;</code>)
              </span>
              <div
                role="group"
                aria-labelledby={`${uid}-motion-label`}
                className="flex flex-wrap items-center gap-1.5 font-mono-hud text-xs"
              >
                <span id={`${uid}-motion-label`} className="text-[#94A3B8] mr-1">
                  {es ? "ANIMACION:" : "ANIMATION:"}
                </span>
                {(["float", "bounce", "pulse", "none"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={spriteMotion === m}
                    onClick={() => {
                      play("click");
                      setSpriteMotion(m);
                    }}
                    className={`px-2.5 py-1.5 font-pixel text-[10px] border cursor-pointer ${
                      spriteMotion === m
                        ? "bg-[#10B981] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#94A3B8] border-[#2A344B]"
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
              {SPRITE_LIST.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() =>
                    copyCode(
                      `sprite-${sp.id}`,
                      `<PixelSprite character="${sp.id}" size={48} motion="${spriteMotion}" />`
                    )
                  }
                  aria-label={
                    lang === "es"
                      ? `Copiar JSX de ${sp.name}, ${sp.role_es}`
                      : `Copy JSX for ${sp.name}, ${sp.role_en}`
                  }
                  className="p-3 bg-[#131824] border-2 border-[#2A344B] hover:border-[#10B981] flex flex-col items-center text-center cursor-pointer transition"
                >
                  <PixelSprite
                    character={sp.id}
                    size={42}
                    motion={spriteMotion}
                  />
                  <span className="font-pixel text-[10px] text-[#F5F2EB] mt-2 truncate w-full">
                    {sp.name}
                  </span>{" "}
                  <span className="font-mono-hud text-[10px] text-[#94A3B8] truncate w-full">
                    {lang === "es" ? sp.role_es : sp.role_en}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <div className="font-pixel text-xs text-[#FFD100] mb-3">
                {es
                  ? `B. ${SCENE_COUNT} ESCENAS Y LOADERS PIXEL-ART ANIMADOS (`
                  : `B. ${SCENE_COUNT} ANIMATED PIXEL-ART SCENES & LOADERS (`}
                <code className="text-white">&lt;PixelSceneAnimation /&gt;</code>)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SCENE_LIST.map((s) => (
                  <PixelSceneAnimation key={s.scene} scene={s.scene} label={s.label} />
                ))}
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 4: 3.5" FLOPPY DISK CARDS, BUTTONS & RPG DIALOG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PixelWindow
            {...windowLabels}
            title={
              es
                ? "04 // DISQUETES 3.5 PULGADAS Y CONTROLES DE HARDWARE"
                : '04 // 3.5" FLOPPY DISKS & HARDWARE CONTROLS'
            }
            subtitle={
              es
                ? "Pasa el cursor sobre los disquetes para deslizar el obturador metalico"
                : "Hover over a floppy to slide its metal shutter"
            }
            tone="coral"
            statusLeft="3.5 INCH HD FLOPPY"
            statusRight="TACTILE SWITCHES"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PixelFloppyCard
                  diskCode="DISK_01"
                  title="Gemini 4 Carbon Evals"
                  capacity="1.44 MB"
                  description={
                    es
                      ? `${CARBON_BENCHMARK_STATS.masterTable} benchmarks de la tabla oficial de Google DeepMind.`
                      : `${CARBON_BENCHMARK_STATS.masterTable} benchmarks from Google DeepMind's official table.`
                  }
                  tone="cyan"
                  sectorLabel="SECTOR 00 // ZERO-SHOT"
                  loadLabel={es ? "CARGAR" : "LOAD DISK"}
                />
                <PixelFloppyCard
                  diskCode="DISK_02"
                  title={es ? "Escalera Claude 5.5" : "Claude 5.5 Ladder"}
                  capacity="1.44 MB"
                  description={
                    es
                      ? `${EP04_RUN_COUNT} corridas zero-shot: Haiku vs Sonnet vs Opus 5.5.`
                      : `${EP04_RUN_COUNT} zero-shot runs: Haiku vs Sonnet vs Opus 5.5.`
                  }
                  tone="yellow"
                  sectorLabel="SECTOR 00 // ZERO-SHOT"
                  loadLabel={es ? "CARGAR" : "LOAD DISK"}
                />
              </div>

              <div className="pt-3 border-t border-[#2A344B] flex flex-wrap gap-2">
                <PixelButton tone="yellow" icon="crt-tv">
                  CRT YELLOW
                </PixelButton>
                <PixelButton tone="cyan" icon="floppy">
                  FLOPPY CYAN
                </PixelButton>
                <PixelButton tone="emerald" icon="joystick">
                  ARCADE GREEN
                </PixelButton>
                <PixelButton tone="coral" icon="rocket" sound="laser">
                  SIGNAL CORAL
                </PixelButton>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <PixelToggle
                  checked={switchA}
                  onChange={setSwitchA}
                  label="60Hz VSYNC"
                  tone="yellow"
                />
                <PixelToggle
                  checked={switchB}
                  onChange={setSwitchB}
                  label="DEGAUSS AUTO"
                  tone="cyan"
                />
                <PixelToggle
                  checked={switchC}
                  onChange={setSwitchC}
                  label="TURBO 66MHz"
                  tone="emerald"
                />
              </div>
            </div>
          </PixelWindow>

          <PixelWindow
            {...windowLabels}
            title={
              es
                ? "05 // DIALOGO RPG Y GRAFICAS DE TELEMETRIA"
                : "05 // RPG DIALOG & TELEMETRY CHARTS"
            }
            subtitle={
              es
                ? "Texto con voz 8-bit por letra y barras segmentadas LED"
                : "Per-letter 8-bit voice text and segmented LED bars"
            }
            tone="violet"
            statusLeft="RPG TYPEWRITER"
            statusRight="LED TELEMETRY"
          >
            <div className="space-y-4">
              <PixelDialogBox
                speaker="MIXIUH BIOS"
                role={`MIXIUH PIXEL UI v${PIXEL_UI_VERSION}`}
                character="crt-monitor"
                tone="cyan"
                nextLabel={es ? "SIGUIENTE" : "NEXT"}
                messages={[
                  lang === "es"
                    ? "Monitor de pruebas inicializado. Haz clic en esta ventana para avanzar el dialogo con voz sintetizada en 8-bit."
                    : "Benchmark monitor initialized. Click this box to advance the dialog with 8-bit synthesized voice blips.",
                  lang === "es"
                    ? "Toda esta libreria es 100% libre para uso comercial o personal dando credito a Mixiuh Labs."
                    : "This entire library is 100% free for commercial or personal use by crediting Mixiuh Labs.",
                ]}
              />

              {/* Official Google DeepMind table (CARBON_FULL_BENCHMARKS) */}
              <PixelBarChart items={TERMINAL_BENCH_BARS} />

              {/* Gemini 4 Argon's EP02 totals (EP02_BENCHMARK_TOTALS) */}
              <div className="flex flex-wrap gap-2">
                <PixelTelemetryPill kind="model" value="ARGON · EP02" tone="violet" />
                <PixelTelemetryPill
                  kind="time"
                  value={`${EP02_BENCHMARK_TOTALS.argon_min_rounded} MIN`}
                  tone="cyan"
                />
                <PixelTelemetryPill
                  kind="cost"
                  value={`$${EP02_BENCHMARK_TOTALS.argon_cost_usd.toFixed(2)} USD`}
                  tone="yellow"
                />
                <PixelTelemetryPill
                  kind="score"
                  value={`${EP02_BENCHMARK_TOTALS.argon_wins} - ${EP02_BENCHMARK_TOTALS.opus_wins} WIN`}
                  tone="emerald"
                />
              </div>
            </div>
          </PixelWindow>
        </div>

        {/* SECTION 5B: PRO FORM, SELECT, AUTOCOMPLETE, CHECKS, COLLAPSE, CALENDAR & CHARTS STUDIO */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? "06 // PERSONALIZADOR INTERACTIVO: INPUTS, SELECTS, AUTOCOMPLETE, CHECKS, COLLAPSE, CALENDARIO Y GRAFICAS"
              : "06 // INTERACTIVE CUSTOMIZER: INPUTS, SELECTS, AUTOCOMPLETE, CHECKS, COLLAPSE, CALENDAR & CHARTS"
          }
          subtitle={
            lang === "es"
              ? "Personaliza el color de acento (tone) y tamano (size) en tiempo real y prueba cada componente profesional"
              : "Customize accent tone and size in real time and test every pro interactive component"
          }
          tone={customTone}
          statusLeft={`CUSTOMIZER TONE: ${customTone.toUpperCase()} · SIZE: ${customSize.toUpperCase()}`}
          statusRight={
            es ? "COPIAR JSX EN CADA TARJETA" : "COPY JSX ON EVERY CARD"
          }
        >
          <div className="space-y-6">
            {/* Global Live Customizer Toolbar */}
            <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] flex flex-wrap items-center justify-between gap-4 font-mono-hud text-xs">
              <div
                role="group"
                aria-labelledby={`${uid}-tone-label`}
                className="flex flex-wrap items-center gap-2"
              >
                <span
                  id={`${uid}-tone-label`}
                  className="font-pixel text-[10px] text-[#FFD100]"
                >
                  {lang === "es" ? "1. TEMA / ACENTO (TONE):" : "1. ACCENT TONE:"}
                </span>
                {(
                  [
                    "cyan",
                    "yellow",
                    "emerald",
                    "coral",
                    "violet",
                    "chalk",
                  ] as const
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={customTone === t}
                    onClick={() => {
                      play("click");
                      setCustomTone(t);
                    }}
                    className={`px-2.5 py-1.5 font-pixel text-[10px] border-2 cursor-pointer uppercase ${
                      customTone === t
                        ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#CBD5E1] border-[#2A344B] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div
                role="group"
                aria-labelledby={`${uid}-size-label`}
                className="flex items-center gap-2"
              >
                <span
                  id={`${uid}-size-label`}
                  className="font-pixel text-[10px] text-[#00E5FF]"
                >
                  {lang === "es" ? "2. ESCALA (SIZE):" : "2. SCALE (SIZE):"}
                </span>
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    aria-pressed={customSize === sz}
                    onClick={() => {
                      play("click");
                      setCustomSize(sz);
                    }}
                    className={`px-2.5 py-1.5 font-pixel text-[10px] border-2 cursor-pointer uppercase ${
                      customSize === sz
                        ? "bg-[#00E5FF] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#CBD5E1] border-[#2A344B] hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Row 1: Inputs, Selects, Autocomplete & Slider */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: PixelInput + PixelSlider */}
              <div className="p-4 bg-[#131824] border-2 border-[#2A344B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A344B] pb-2">
                  <span className="font-pixel text-[10px] text-[#FFD100]">
                    &lt;PixelInput /&gt; &amp; &lt;PixelSlider /&gt;
                  </span>
                  {copyJsxButton(
                    "comp-input",
                    `<PixelInput label="PROMPT ID" value="${demoInput}" tone="${customTone}" size="${customSize}" iconLeft="terminal" clearable />`,
                    "px-2 py-0.5 bg-[#00E5FF]"
                  )}
                </div>

                <PixelInput
                  label={
                    lang === "es"
                      ? "1. INPUT CON ICONO Y LIMPIEZA"
                      : "1. INPUT WITH ICON & CLEAR"
                  }
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onClear={() => setDemoInput("")}
                  clearable
                  clearLabel={lang === "es" ? "Limpiar" : "Clear"}
                  iconLeft="terminal"
                  tone={customTone}
                  size={customSize}
                  placeholder={es ? "Ej. claude-opus-5.5..." : "e.g. claude-opus-5.5..."}
                  helperText={
                    lang === "es"
                      ? "Soporta iconos izquierda/derecha, clearable y estado de error."
                      : "Supports left/right icons, clearable button, and error states."
                  }
                />

                <PixelSlider
                  label={
                    lang === "es"
                      ? "2. SLIDER LED DE VELOCIDAD (FPS)"
                      : "2. LED SPEED SLIDER (FPS)"
                  }
                  value={demoSlider}
                  min={15}
                  max={120}
                  step={5}
                  unit=" FPS"
                  onChange={setDemoSlider}
                  tone={customTone}
                />
              </div>

              {/* Column 2: PixelSelect + PixelAutocomplete */}
              <div className="p-4 bg-[#131824] border-2 border-[#2A344B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A344B] pb-2">
                  <span className="font-pixel text-[10px] text-[#00E5FF]">
                    &lt;PixelSelect /&gt; &amp; &lt;PixelAutocomplete /&gt;
                  </span>
                  {copyJsxButton(
                    "comp-select",
                    `<PixelSelect label="AI MODEL" value="${demoSelect}" onChange={setModel} tone="${customTone}" size="${customSize}" options={options} />`,
                    "px-2 py-0.5 bg-[#FFD100]"
                  )}
                </div>

                <PixelSelect
                  label={
                    lang === "es"
                      ? "3. SELECT DESPLEGABLE PIXEL-ART"
                      : "3. PIXEL-ART DROPDOWN SELECT"
                  }
                  value={demoSelect}
                  onChange={setDemoSelect}
                  tone={customTone}
                  size={customSize}
                  options={modelOptions}
                />

                <PixelAutocomplete
                  label={
                    lang === "es"
                      ? "4. AUTOCOMPLETE CON BUSQUEDA EN VIVO"
                      : "4. LIVE SEARCH AUTOCOMPLETE"
                  }
                  value={demoAuto}
                  onChange={setDemoAuto}
                  tone={customTone}
                  clearLabel={lang === "es" ? "Limpiar" : "Clear"}
                  toggleLabel={lang === "es" ? "Mostrar opciones" : "Show options"}
                  emptyLabel={es ? "Sin coincidencias para" : "No matches for"}
                  placeholder={
                    lang === "es"
                      ? "Filtra entre simuladores (ej. rover, tb-303, chip-8)..."
                      : "Filter simulators (e.g. rover, tb-303, chip-8)..."
                  }
                  options={ep04Options}
                />
              </div>

              {/* Column 3: PixelCheckbox & PixelRadioGroup */}
              <div className="p-4 bg-[#131824] border-2 border-[#2A344B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A344B] pb-2">
                  <span className="font-pixel text-[10px] text-[#10B981]">
                    &lt;PixelCheckbox /&gt; &amp; &lt;PixelRadioGroup /&gt;
                  </span>
                  {copyJsxButton(
                    "comp-check",
                    `<PixelCheckbox checked={checked} onChange={setChecked} label="Zero-Shot Verification" tone="${customTone}" />`,
                    "px-2 py-0.5 bg-[#10B981]"
                  )}
                </div>

                <div className="space-y-2.5">
                  <PixelCheckbox
                    checked={demoCheckA}
                    onChange={setDemoCheckA}
                    tone={customTone}
                    label={
                      lang === "es"
                        ? "Unico intento Zero-Shot (Sin edicion humana)"
                        : "Single Zero-Shot Attempt (No human edits)"
                    }
                    description={
                      lang === "es"
                        ? "Se publica el archivo index.html tal cual salio del CLI."
                        : "Raw index.html published directly from CLI output."
                    }
                  />
                  <PixelCheckbox
                    checked={demoCheckB}
                    onChange={setDemoCheckB}
                    tone={customTone}
                    label={
                      lang === "es"
                        ? "Auditoria de Factura API ($ USD + Tokens)"
                        : "Real API Bill Audit ($ USD + Tokens)"
                    }
                  />
                  <PixelCheckbox
                    checked={demoCheckC}
                    onChange={setDemoCheckC}
                    tone={customTone}
                    label={
                      lang === "es"
                        ? "Permitir librerias externas no autorizadas"
                        : "Allow unauthorized external libraries"
                    }
                  />
                </div>

                <PixelRadioGroup
                  label={
                    lang === "es"
                      ? "5. RADIO GROUP DE MODO DE RENDER"
                      : "5. RENDER TARGET RADIO GROUP"
                  }
                  value={demoRadio}
                  onChange={setDemoRadio}
                  tone={customTone}
                  options={[
                    {
                      value: "60fps",
                      label: "4K UHD @ 60Hz VSync Lock",
                      badge: "MASTER",
                    },
                    {
                      value: "crt-rgb",
                      label: "CRT Shadow-Mask Phosphor",
                      badge: "RETRO",
                    },
                  ]}
                />
              </div>
            </div>

            {/* Grid Row 2: PixelCalendar, PixelCollapse & PixelMultiLineChart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <PixelCalendar
                  lang={lang}
                  selectedDate={demoCalDate}
                  onSelectDate={setDemoCalDate}
                  tone={customTone}
                  events={calendarEvents}
                />

                <PixelCollapse
                  tone={customTone}
                  defaultOpenIds={["col-1"]}
                  items={[
                    {
                      id: "col-1",
                      title:
                        lang === "es"
                          ? "01. ¿Como funciona <PixelCollapse />?"
                          : "01. How does <PixelCollapse /> work?",
                      badge: "ACCORDION",
                      icon: "folder-open",
                      content:
                        lang === "es"
                          ? "Soporta apertura unica o multiple (allowMultiple), insignias de estado, iconos 16x16 personalizados y efectos de sonido 8-bit al expandir o contraer."
                          : "Supports single or multi-panel expansion (allowMultiple), status badges, custom 16x16 icons, and 8-bit sound effects on expand/collapse.",
                    },
                    {
                      id: "col-2",
                      title:
                        lang === "es"
                          ? "02. ¿Que incluye <PixelCalendar />?"
                          : "02. What does <PixelCalendar /> include?",
                      badge: "DATE PICKER",
                      icon: "calendar",
                      content:
                        lang === "es"
                          ? "Navegacion mensual/anual bilingue (ES/EN), marcadores de eventos con color por fecha, seleccion interactiva en formato ISO (YYYY-MM-DD) y barra inferior de telemetria."
                          : "Bilingual (ES/EN) month/year navigation, color-coded event markers per date, interactive ISO date selection (YYYY-MM-DD), and a bottom telemetry bar.",
                    },
                  ]}
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                {/* Real EP04 run times (ep04Data). Gemini 4 Carbon did not run EP04. */}
                <PixelMultiLineChart
                  title={
                    lang === "es"
                      ? "GRAFICA MULTISERIE (<PixelMultiLineChart />) · EP04: MINUTOS POR RETO"
                      : "MULTI-SERIES LINE CHART (<PixelMultiLineChart />) · EP04: MINUTES PER CHALLENGE"
                  }
                  subtitle={
                    lang === "es"
                      ? "Tiempo real de cada corrida de la Escalera Claude: haz clic en las leyendas para filtrar series o en un reto para ver sus valores"
                      : "Real time of every Claude Ladder run: click a legend to toggle its series or a challenge to read its values"
                  }
                  series={EP04_TIERS.map((t) => ({
                    key: t,
                    name: `Claude ${EP04_TIER_NAME[t]}`,
                    color: EP04_TIER_COLOR[t],
                  }))}
                  data={ep04MinutesData}
                  maxY={EP04_CHART_MAX_Y}
                  unit=" min"
                  categoryLabel={es ? "Reto" : "Challenge"}
                  // Run times are logged to 0.1 min: 17.0 stays "17.0 min"
                  formatValue={(v) => `${v.toFixed(1)} min`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CARBON_DONUTS.map((d) => (
                    <PixelDonutGauge
                      key={d.label}
                      label={d.label}
                      sublabel="Gemini 4 Carbon"
                      value={d.value}
                      maxValue={100}
                      displayValue={d.displayValue}
                      tone={d.tone}
                    />
                  ))}
                  {HAIKU_ROI && (
                    <PixelDonutGauge
                      label="HAIKU ROI RATIO"
                      sublabel={`EP04 ${HAIKU_ROI.code}: $${HAIKU_ROI.haikuUsd} vs $${HAIKU_ROI.opusUsd} Opus`}
                      value={HAIKU_ROI.savedPct}
                      maxValue={100}
                      displayValue={`${HAIKU_ROI.ratio}x`}
                      tone="yellow"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 6: CRISP 16x16 PIXEL SVG ICONS WITH CATEGORY FILTERS, BRANDS & SEARCH */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? `07 // ${ICON_COUNT} ICONOS VECTORIALES PIXEL-ART EN GRILLA 16x16 (INCLUYE MARCAS Y REDES)`
              : `07 // ${ICON_COUNT} PIXEL-ART VECTOR ICONS ON A 16x16 GRID (BRANDS & SOCIAL INCLUDED)`
          }
          subtitle={
            es
              ? "Incluye YouTube, X, Instagram, Facebook, TikTok, Google, GitHub, Discord, Vercel y todas las categorias UI"
              : "Includes YouTube, X, Instagram, Facebook, TikTok, Google, GitHub, Discord, Vercel and every UI category"
          }
          tone="chalk"
          statusLeft={`SELECTED: <PixelIcon name="${selectedIcon}" size={${iconSize}} color="${iconColor}" />`}
          statusRight="ZERO UNICODE EMOJIS"
        >
          <div className="space-y-4">
            {/* Live Social Media Bar Component Preview */}
            <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-pixel text-[10px] text-[#FFD100]">
                  {es ? "COMPONENTE DE REDES SOCIALES (" : "SOCIAL MEDIA COMPONENT ("}
                  <code className="text-white">&lt;PixelSocialBar /&gt;</code>)
                </span>
                {copyJsxButton(
                  "social-bar",
                  "<PixelSocialBar />",
                  "px-2.5 py-1.5 bg-[#00E5FF]"
                )}
              </div>
              <PixelSocialBar />
            </div>

            {/* Category Filter Pills */}
            <div
              role="group"
              aria-label={lang === "es" ? "Categorías de iconos" : "Icon categories"}
              className="flex flex-wrap items-center gap-1.5"
            >
              <button
                type="button"
                aria-pressed={iconCategory === "all"}
                onClick={() => {
                  play("click");
                  setIconCategory("all");
                }}
                className={`px-3 py-1.5 font-pixel text-[10px] border-2 cursor-pointer ${
                  iconCategory === "all"
                    ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold"
                    : "bg-[#131824] text-[#94A3B8] border-[#2A344B] hover:text-white"
                }`}
              >
                {lang === "es"
                  ? `Todos (${ALL_PIXEL_ICON_NAMES.length})`
                  : `All (${ALL_PIXEL_ICON_NAMES.length})`}
              </button>
              {PIXEL_ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={iconCategory === cat.id}
                  onClick={() => {
                    play("click");
                    setIconCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 font-pixel text-[10px] border-2 cursor-pointer ${
                    iconCategory === cat.id
                      ? "bg-[#00E5FF] text-[#090B10] border-[#090B10] font-bold"
                      : "bg-[#131824] text-[#94A3B8] border-[#2A344B] hover:text-white"
                  }`}
                >
                  {lang === "es" ? cat.label_es : cat.label_en}
                </button>
              ))}
            </div>

            {/* Icon Search, Color & Size Customizer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131824] p-3 border-2 border-[#2A344B]">
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                aria-label={es ? "Buscar iconos" : "Search icons"}
                placeholder={
                  lang === "es"
                    ? "Buscar icono (ej. youtube, google, instagram, x, floppy)..."
                    : "Search icon (e.g. youtube, google, instagram, x, floppy)..."
                }
                className="px-3 py-1.5 bg-[#090B10] border-2 border-[#2A344B] font-mono-hud text-xs text-white w-full sm:w-80"
              />

              <div className="flex flex-wrap items-center gap-3 font-mono-hud text-xs">
                <div
                  role="group"
                  aria-labelledby={`${uid}-icon-color-label`}
                  className="flex items-center gap-1.5"
                >
                  <span id={`${uid}-icon-color-label`} className="text-[#94A3B8]">
                    COLOR:
                  </span>
                  {ICON_COLORS.map(({ hex, es, en }) => (
                    <button
                      key={hex}
                      type="button"
                      aria-label={`${lang === "es" ? es : en} (${hex})`}
                      aria-pressed={iconColor === hex}
                      onClick={() => {
                        play("click");
                        setIconColor(hex);
                      }}
                      className={`w-6 h-6 border-2 cursor-pointer ${
                        iconColor === hex
                          ? "border-white scale-110"
                          : "border-[#090B10]"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>

                <div
                  role="group"
                  aria-labelledby={`${uid}-icon-size-label`}
                  className="flex items-center gap-1"
                >
                  <span id={`${uid}-icon-size-label`} className="text-[#94A3B8]">
                    SIZE:
                  </span>
                  {([16, 24, 32] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      aria-pressed={iconSize === sz}
                      onClick={() => {
                        play("click");
                        setIconSize(sz);
                      }}
                      className={`px-2.5 py-1.5 font-pixel text-[10px] border cursor-pointer ${
                        iconSize === sz
                          ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                          : "bg-[#090B10] text-[#94A3B8] border-[#2A344B]"
                      }`}
                    >
                      {sz}PX
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              role="group"
              aria-label={
                lang === "es"
                  ? "Iconos: pulsa uno para seleccionarlo y copiar su JSX"
                  : "Icons: press one to select it and copy its JSX"
              }
              className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2"
            >
              {filteredIcons.map((iconName) => {
                const isSel = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    aria-pressed={isSel}
                    onClick={() => {
                      setSelectedIcon(iconName);
                      copyCode(
                        `icon-${iconName}`,
                        `<PixelIcon name="${iconName}" size={${iconSize}} color="${iconColor}" />`
                      );
                    }}
                    className={`p-2.5 border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSel
                        ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#F5F2EB] border-[#2A344B] hover:border-[#00E5FF]"
                    }`}
                  >
                    <PixelIcon
                      name={iconName}
                      size={iconSize}
                      color={isSel ? "#090B10" : iconColor}
                    />
                    <span className="font-mono-hud text-[10px] truncate w-full text-center">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
            {copiedSnippet?.startsWith("icon-") && (
              <div className="mt-2 px-3 py-2 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold inline-flex items-center gap-2">
                <PixelIcon name="check" size={14} color="#090B10" />
                <span>
                  {`${es ? "Copiado" : "Copied"}: <PixelIcon name="${selectedIcon}" size={${iconSize}} color="${iconColor}" />`}
                </span>
              </div>
            )}
          </div>
        </PixelWindow>

        {/* SECTION 6: FREE COMMERCIAL LICENSE & 1-LINE ATTRIBUTION GENERATOR */}
        <div className="bg-[#111622] border-2 border-[#FFD100] shadow-[6px_6px_0_#040508] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#2A344B] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFD100] text-[#090B10] font-pixel text-[10px] font-bold mb-2">
                {es
                  ? "LICENCIA ABIERTA MIXIUH (CC-BY 4.0 / MIT CON ATRIBUCION)"
                  : "MIXIUH OPEN ATTRIBUTION LICENSE (CC-BY 4.0 / MIT WITH ATTRIBUTION)"}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                {lang === "es"
                  ? "Usala Libremente en Cualquier Proyecto (Personal o Comercial)"
                  : "Use It Freely in Any Project (Personal or Commercial)"}
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                {lang === "es"
                  ? "La unica condicion es incluir credito visible a Mixiuh Labs (labs.mixiuh.online) en el pie de pagina, pantalla de creditos o README. Elige el estilo de insignia que prefieras:"
                  : "The only requirement is to include visible credit to Mixiuh Labs (labs.mixiuh.online) in your footer, credits screen, or README. Pick your preferred badge style:"}
              </p>
            </div>

            <div
              role="group"
              aria-label={
                lang === "es" ? "Estilo de la insignia de crédito" : "Credit badge style"
              }
              className="flex flex-wrap gap-2"
            >
              {(["hardware", "pill", "minimal", "banner"] as const).map(
                (v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={creditVariant === v}
                    onClick={() => {
                      play("click");
                      setCreditVariant(v);
                    }}
                    className={`px-3 py-1.5 font-mono-hud text-xs font-bold border-2 cursor-pointer ${
                      creditVariant === v
                        ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8] border-[#2A344B] hover:text-white"
                    }`}
                  >
                    {v.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-6 bg-[#090B10] border-2 border-[#2A344B] px-dither-dots flex items-center justify-center">
            <PixelCreditBadge variant={creditVariant} />
          </div>

          <div className="relative bg-[#090B10] border-2 border-[#2A344B] p-4 font-mono-hud text-xs text-[#00E5FF] overflow-x-auto">
            <pre className="leading-relaxed">{creditSnippet}</pre>
            <button
              type="button"
              onClick={() => copyCode("credit", creditSnippet)}
              className="mt-3 px-4 py-2 bg-[#FFD100] text-[#090B10] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PixelIcon
                name={copiedSnippet === "credit" ? "check" : "copy"}
                size={14}
                color="#090B10"
              />
              <span>
                {copiedSnippet === "credit"
                  ? lang === "es"
                    ? "¡Snippet Copiado!"
                    : "Snippet Copied!"
                  : lang === "es"
                  ? "Copiar Codigo de Instalacion + Credito"
                  : "Copy Install + Attribution Snippet"}
              </span>
            </button>
          </div>
        </div>

        {/* SECTION 8: NAVIGATION & OVERLAY SUITE (shipped in v2.3, see the library README) */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? "08 // DESDE v2.3: COMMAND PALETTE, TOASTS, TABS Y COPIA"
              : "08 // SINCE v2.3: COMMAND PALETTE, TOASTS, TABS & COPY"
          }
          subtitle={
            lang === "es"
              ? "Primera entrega de la Fase 2 del roadmap, accesible con teclado y lector de pantalla"
              : "First Phase 2 roadmap drop, fully keyboard & screen-reader friendly"
          }
          tone="cyan"
          statusLeft="WAI-ARIA · KEYBOARD · REDUCED MOTION"
          statusRight="Ctrl+K"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono-hud text-xs">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-pixel text-[10px] text-[#00E5FF]">
                  {"<PixelTabs />"}
                </div>
                <PixelTabs
                  ariaLabel={es ? "Pestañas de demostración" : "Demo tabs"}
                  tone="cyan"
                  wrap
                  value={demoTab}
                  onChange={setDemoTab}
                  items={[
                    { id: "palette", label: "Command Palette", icon: "command" },
                    { id: "toasts", label: "Toasts", icon: "bell" },
                    { id: "a11y", label: lang === "es" ? "Accesibilidad" : "Accessibility", icon: "eye" },
                  ]}
                />
                <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] text-[#CBD5E1] leading-relaxed min-h-[96px]">
                  {demoTab === "palette" &&
                    (lang === "es"
                      ? "Pulsa Ctrl+K (o Cmd+K) en cualquier parte del sitio: busca secciones, episodios, demos de la Arena, ajustes y los terminos del glosario sin tocar el mouse."
                      : "Press Ctrl+K (or Cmd+K) anywhere on the site: search sections, episodes, Arena demos, settings and glossary terms without touching the mouse.")}
                  {demoTab === "toasts" &&
                    (lang === "es"
                      ? "pixelToast.show() es una API global: llamala desde cualquier evento y <PixelToaster /> la anuncia con aria-live y un blip 8-bit."
                      : "pixelToast.show() is a global API: call it from any event and <PixelToaster /> announces it via aria-live with an 8-bit blip.")}
                  {demoTab === "a11y" &&
                    (lang === "es"
                      ? "Las tabs se mueven con flechas, Inicio y Fin. Todo el kit muestra un anillo de foco pixel y respeta prefers-reduced-motion (sin fondo animado ni reveal)."
                      : "Tabs move with arrow keys, Home and End. The whole kit shows a pixel focus ring and honours prefers-reduced-motion (no animated background or reveal).")}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
                    )
                  }
                  className="px-btn bg-[#FFD100] text-[#090B10] px-4 py-2.5 text-xs"
                >
                  <PixelIcon name="command" size={14} />
                  <span>
                    {lang === "es" ? "Abrir Command Palette" : "Open Command Palette"}
                  </span>
                  <kbd className="px-kbd">Ctrl K</kbd>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-pixel text-[10px] text-[#00E5FF]">
                  {"pixelToast.show({ ... })"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { tone: "emerald", icon: "check", es: "Guardado", en: "Saved" },
                      { tone: "cyan", icon: "broadcast", es: "Nuevo episodio", en: "New episode" },
                      { tone: "yellow", icon: "trophy", es: "Logro desbloqueado", en: "Achievement unlocked" },
                      { tone: "coral", icon: "bug", es: "Error de compilacion", en: "Build error" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.tone}
                      type="button"
                      onClick={() =>
                        pixelToast.show({
                          title: (lang === "es" ? t.es : t.en).toUpperCase(),
                          description: `tone="${t.tone}" · icon="${t.icon}"`,
                          tone: t.tone,
                          icon: t.icon,
                          sound: t.tone === "yellow" ? "achievement" : t.tone === "coral" ? "hit" : "dialogBlip",
                        })
                      }
                      className="px-btn bg-[#131824] text-[#F5F2EB] px-3 py-2 text-[11px]"
                    >
                      <PixelIcon name={t.icon} size={12} />
                      <span>{lang === "es" ? t.es : t.en}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[10px] text-[#00E5FF]">
                    {"<PixelCopyButton />"}
                  </span>
                  <PixelCopyButton
                    text={overlaySnippet}
                    tone="cyan"
                    size="xs"
                    label={lang === "es" ? "Copiar" : "Copy"}
                    copiedLabel={lang === "es" ? "Copiado" : "Copied"}
                    toastTitle={lang === "es" ? "SNIPPET COPIADO" : "SNIPPET COPIED"}
                    failedLabel={lang === "es" ? "NO SE PUDO COPIAR" : "COPY FAILED"}
                  />
                </div>
                <pre className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] text-[11px] text-[#F5F2EB] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {overlaySnippet}
                </pre>
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 9: PHASE 2 COMPLETE (v2.5) — DATA TABLE, TOOLTIP, POPOVER, DRAWER, SHEET, CONTEXT MENU */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? "09 // FASE 2 COMPLETA v2.5: DATATABLE, TOOLTIP, POPOVER, DRAWER Y MENU CONTEXTUAL"
              : "09 // PHASE 2 COMPLETE v2.5: DATATABLE, TOOLTIP, POPOVER, DRAWER & CONTEXT MENU"
          }
          subtitle={
            lang === "es"
              ? "Componentes de datos y overlays con teclado completo, foco atrapado y lectores de pantalla"
              : "Data and overlay components with full keyboard support, focus management and screen readers"
          }
          tone="emerald"
          statusLeft="ARIA SORT · DIALOG · MENU · TOOLTIP"
          statusRight="CSV EXPORT"
        >
          <div className="space-y-6 font-mono-hud text-xs">
            <div className="space-y-2">
              <div className="font-pixel text-[11px] text-[#10B981]">
                {es
                  ? "<PixelDataTable /> // EP04 · costo por reto (USD)"
                  : "<PixelDataTable /> // EP04 · cost per challenge (USD)"}
              </div>
              <PixelDataTable<Ep04Row>
                caption={lang === "es" ? "Costo por reto EP04" : "EP04 cost per challenge"}
                tone="emerald"
                locale="es"
                searchable
                pageSize={4}
                exportFileName={es ? "ep04-costos.csv" : "ep04-costs.csv"}
                rows={EP04_ROWS}
                getRowId={(r) => String(r.n)}
                className="[&_table]:min-w-[560px]"
                labels={es ? undefined : EP04_TABLE_LABELS_EN}
                columns={[
                  { key: "n", header: "#", value: (r) => r.n },
                  {
                    key: "reto",
                    header: lang === "es" ? "Reto" : "Challenge",
                    value: (r) => (lang === "es" ? r.name_es : r.name_en),
                  },
                  {
                    key: "haiku",
                    header: "Haiku 5.5",
                    value: (r) => r.haiku,
                    render: (r) => <span className="text-[#10B981]">${r.haiku.toFixed(2)}</span>,
                    align: "right",
                  },
                  {
                    key: "sonnet",
                    header: "Sonnet 5.5",
                    value: (r) => r.sonnet,
                    render: (r) => <span className="text-[#FFD100]">${r.sonnet.toFixed(2)}</span>,
                    align: "right",
                  },
                  {
                    key: "opus",
                    header: "Opus 5.5",
                    value: (r) => r.opus,
                    render: (r) => <span className="text-[#C084FC]">${r.opus.toFixed(2)}</span>,
                    align: "right",
                  },
                  {
                    key: "winner",
                    header: lang === "es" ? "Ganador" : "Winner",
                    value: (r) => r.winner.toUpperCase(),
                  },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3">
                <div className="font-pixel text-[11px] text-[#00E5FF]">{"<PixelTooltip />"}</div>
                <div className="flex flex-wrap gap-2">
                  {(["top", "bottom", "right"] as const).map((placement) => (
                    <PixelTooltip
                      key={placement}
                      placement={placement}
                      content={
                        lang === "es"
                          ? `Tooltip ${placement} (hover o foco con teclado)`
                          : `Tooltip ${placement} (hover or keyboard focus)`
                      }
                    >
                      <button type="button" className="px-btn bg-[#131824] text-[#F5F2EB] px-3 py-2 text-[11px]">
                        {placement.toUpperCase()}
                      </button>
                    </PixelTooltip>
                  ))}
                </div>
                {/* Touch screens: PixelTooltip deliberately ignores taps */}
                <p className="hidden pointer-coarse:block font-mono-hud text-[11px] text-[#94A3B8]">
                  {lang === "es"
                    ? "El tooltip aparece con hover o foco de teclado, no al tocar."
                    : "The tooltip shows on hover or keyboard focus, not on tap."}
                </p>
                <div className="font-pixel text-[11px] text-[#00E5FF] pt-2">{"<PixelPopover />"}</div>
                <PixelPopover
                  trigger={
                    <>
                      <PixelIcon name="settings" size={13} />
                      <span>{lang === "es" ? "Opciones" : "Options"}</span>
                    </>
                  }
                  tone="cyan"
                  title={lang === "es" ? "OPCIONES DEL LAB" : "LAB OPTIONS"}
                  closeLabel={lang === "es" ? "Cerrar" : "Close"}
                >
                  <div className="space-y-3">
                    <PixelToggle checked={switchA} onChange={setSwitchA} label="60Hz VSYNC" tone="cyan" />
                    <PixelToggle checked={switchB} onChange={setSwitchB} label="DEGAUSS AUTO" tone="coral" />
                  </div>
                </PixelPopover>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3">
                <div className="font-pixel text-[11px] text-[#FFD100]">{"<PixelDrawer /> · <PixelSheet />"}</div>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {lang === "es"
                    ? "Paneles modales laterales o inferiores con foco atrapado, Escape y bloqueo de scroll. El menu de Ajustes del sitio en movil usa PixelDrawer."
                    : "Side or bottom modal panels with focus trap, Escape and scroll lock. The site's mobile Settings menu uses PixelDrawer."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoDrawer(true)}
                    className="px-btn bg-[#FFD100] text-[#090B10] px-3 py-2 text-[11px]"
                  >
                    {lang === "es" ? "Abrir Drawer" : "Open Drawer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoSheet(true)}
                    className="px-btn bg-[#00E5FF] text-[#090B10] px-3 py-2 text-[11px]"
                  >
                    {lang === "es" ? "Abrir Sheet" : "Open Sheet"}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3">
                <div className="font-pixel text-[11px] text-[#FF3355]">{"<PixelContextMenu />"}</div>
                <PixelContextMenu
                  label={lang === "es" ? "Acciones del cartucho" : "Cartridge actions"}
                  tone="coral"
                  items={contextMenuItems}
                >
                  <div
                    tabIndex={0}
                    className="p-4 bg-[#111622] border-2 border-dashed border-[#FF3355] text-center text-[#CBD5E1] leading-relaxed"
                  >
                    <PixelIcon name="cartridge" size={28} color="#FF3355" className="mx-auto mb-2" />
                    {lang === "es"
                      ? "Clic derecho aqui (o enfoca y pulsa Shift+F10 / tecla Menu)"
                      : "Right-click here (or focus and press Shift+F10 / Menu key)"}
                  </div>
                </PixelContextMenu>
              </div>
            </div>
          </div>

          <PixelDrawer
            open={demoDrawer}
            onOpenChange={setDemoDrawer}
            title={lang === "es" ? "DRAWER DE DEMOSTRACION" : "DEMO DRAWER"}
            description={lang === "es" ? "Tab y Shift+Tab se quedan dentro; Escape cierra." : "Tab and Shift+Tab stay inside; Escape closes."}
            closeLabel={lang === "es" ? "Cerrar" : "Close"}
            footer={
              <button type="button" onClick={() => setDemoDrawer(false)} className="px-btn bg-[#FFD100] text-[#090B10] px-4 py-2 text-xs">
                OK
              </button>
            }
          >
            <div className="space-y-3 font-mono-hud text-xs">
              <PixelToggle checked={switchC} onChange={setSwitchC} label="TURBO 66MHz" tone="emerald" />
              <p className="text-[#CBD5E1]">
                {lang === "es" ? "Contenido desplazable, formularios y acciones." : "Scrollable content, forms and actions."}
              </p>
            </div>
          </PixelDrawer>
          <PixelSheet
            open={demoSheet}
            onOpenChange={setDemoSheet}
            tone="cyan"
            size="sm"
            title={lang === "es" ? "SHEET INFERIOR" : "BOTTOM SHEET"}
            closeLabel={lang === "es" ? "Cerrar" : "Close"}
          >
            <p className="font-mono-hud text-xs text-[#CBD5E1]">
              {lang === "es" ? "Ideal para acciones rapidas en movil." : "Great for quick actions on phones."}
            </p>
          </PixelSheet>
        </PixelWindow>

        {/* SECTION 10: MASTER ROADMAP & COMPETITIVE BENCHMARK MATRIX VS TOP UI LIBRARIES */}
        <PixelWindow
          {...windowLabels}
          title={
            es
              ? "10 // ROADMAP DE @MIXIUH/PIXEL-UI Y COMPARATIVA CONTRA LIBRERIAS UI PROFESIONALES"
              : "10 // @MIXIUH/PIXEL-UI ROADMAP & COMPARISON WITH PROFESSIONAL UI LIBRARIES"
          }
          subtitle={
            lang === "es"
              ? `Que tenemos hoy en v${PIXEL_UI_VERSION}, como se compara frente a shadcn/ui, MUI, Ant Design y NES.css, y las siguientes fases de evolucion`
              : `What we have today in v${PIXEL_UI_VERSION}, how it compares against shadcn/ui, MUI, Ant Design & NES.css, and upcoming roadmap phases`
          }
          tone="yellow"
          statusLeft={`v${PIXEL_UI_VERSION} PRODUCTION READY`}
          statusRight={`ROADMAP v${PIXEL_UI_VERSION} -> v4.0`}
        >
          <div className="space-y-6 font-mono-hud text-xs">
            {/* Comparative Matrix Table */}
            <div className="border-2 border-[#2A344B]">
              <PixelSwipeHint
                label={lang === "es" ? "Desliza para comparar" : "Swipe to compare"}
              />
              <div
                ref={matrixRef}
                role={matrixOverflowing ? "region" : undefined}
                aria-label={matrixOverflowing ? (es ? "Matriz comparativa" : "Comparison matrix") : undefined}
                tabIndex={matrixOverflowing ? 0 : undefined}
                className="overflow-x-auto focus-visible:outline-offset-[-3px]"
              >
              <table className="w-full min-w-[760px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#090B10] text-[#FFD100] font-pixel text-[10px] border-b-2 border-[#2A344B]">
                    <th className="p-3">{es ? "CAPACIDAD / SISTEMA" : "CAPABILITY / SYSTEM"}</th>
                    <th className="p-3 text-[#00E5FF]">{`@MIXIUH/PIXEL-UI v${PIXEL_UI_VERSION}`}</th>
                    <th className="p-3 text-[#94A3B8]">shadcn/ui + Radix</th>
                    <th className="p-3 text-[#94A3B8]">MUI / Ant Design</th>
                    <th className="p-3 text-[#94A3B8]">NES.css / Pixel-Retro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] bg-[#111622] text-[#CBD5E1]">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.capability.en}>
                      <td className="p-3 font-bold text-white">
                        {es ? row.capability.es : row.capability.en}
                      </td>
                      <td className={`p-3 ${row.mixiuh.className} font-bold`}>
                        {es ? row.mixiuh.es : row.mixiuh.en}
                      </td>
                      {row.others.map((cell, i) => (
                        <td
                          key={i}
                          className={cell.bad ? "p-3 text-[#FF3355]" : "p-3"}
                        >
                          {es ? cell.es : cell.en}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* 4-Phase Roadmap Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROADMAP_PHASES.map((phase) => (
                <div
                  key={phase.badge.en}
                  className={`p-4 bg-[#090B10] border-2 ${phase.borderClass} space-y-2`}
                >
                  <div
                    className={`px-2 py-0.5 ${phase.badgeClass} text-[#090B10] font-pixel text-[10px] font-bold inline-block`}
                  >
                    {es ? phase.badge.es : phase.badge.en}
                  </div>
                  <h3 className="font-display text-sm font-black text-white">
                    {es ? phase.title.es : phase.title.en}
                  </h3>
                  <ul
                    className={`space-y-1 text-[11px] ${
                      phase.done ? "text-[#10B981]" : "text-[#CBD5E1]"
                    }`}
                  >
                    {phase.items.map((item) => (
                      <li key={item.en}>
                        {`${phase.done ? "✓" : "+"} ${es ? item.es : item.en}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </PixelWindow>
      </div>
    </div>
  );
}
