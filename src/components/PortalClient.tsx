"use client";

import React, { useState, useEffect, useEffectEvent, useRef } from "react";
import { LAB_GLOSSARY, YOUTUBE_LINKS } from "@/data/glossary";
import {
  CARBON_BENCHMARK_STATS,
  CARBON_FULL_BENCHMARKS,
  type CarbonBenchmarkRow,
} from "@/data/carbonBenchmarks";
import {
  CALENDAR_LABELS,
  CALENDAR_TONES,
  PIXEL_UI_RELEASE_DATE,
} from "@/data/calendar";
import type { ForumCounts } from "@/data/forumCounts";
import dynamic from "next/dynamic";
import type {
  DossierEpisode,
  Ep03Mode,
  Ep04Mode,
  VideoClip,
} from "@/components/DossierView";
import {
  Pixel3DCRTWorkstation,
  PixelCalendar,
  PixelCollapse,
  PixelCreditBadge,
  PixelDonutGauge,
  PixelIcon,
  PixelMultiLineChart,
  PixelProceduralAmbientBg,
  PixelScrollMaterializer,
  PixelSocialBar,
  PixelSwipeHint,
  ALL_PIXEL_ICON_NAMES,
  PIXEL_CURSOR_PRESETS,
  PixelBackToTop,
  PixelCommandPalette,
  PixelDrawer,
  PixelPopover,
  PixelRadioGroup,
  PixelToggle,
  PixelCopyButton,
  PixelTabs,
  PixelToaster,
  PixelTooltip,
  PIXEL_UI_VERSION,
  pixelToast,
  prefersReducedMotion,
  usePixelCursor,
  usePixelPref,
  usePixelSound,
  type AmbientSimulationMode,
  type PixelCalendarEvent,
  type PixelCommandItem,
  type PixelIconName,
  type PocketConsoleCartridgeItem,
} from "@mixiuh/pixel-ui";
import {
  BUILD_TIME,
  getReleasedStatus,
  RELEASE_TIMESTAMPS_CST,
  type ReleaseKey,
  type ReleasedState,
} from "@/data/releaseSchedule";

// Heavy views (and their data) load on demand: the home page never ships them
function ViewLoading() {
  return (
    <div
      role="status"
      // A full screen tall, so the footer never flashes into view and then jumps away while the view loads
      className="max-w-7xl mx-auto min-h-svh px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="p-6 bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] font-pixel text-[11px] text-[#FFD100]">
        CARGANDO MODULO // LOADING
        <span className="inline-block w-2 h-3 bg-[#FFD100] ml-2 align-middle animate-px-blink" />
      </div>
    </div>
  );
}

const DemoArenaSection = dynamic(() => import("@/components/DemoArenaModal"), {
  loading: ViewLoading,
});
const ForumSection = dynamic(() => import("@/components/ForumSection"), {
  loading: ViewLoading,
});
const NewsSection = dynamic(() => import("@/components/NewsSection"), {
  loading: ViewLoading,
});
const PixelUiShowcase = dynamic(() => import("@/components/PixelUiShowcase"), {
  loading: ViewLoading,
});
const DossierView = dynamic(() => import("@/components/DossierView"), {
  loading: ViewLoading,
});
const ArenaLatest = dynamic(() => import("@/components/ArenaLatest"), {
  loading: ViewLoading,
});

type MainView =
  | "blog"
  | "dossiers"
  | "comunidad"
  | "noticias"
  | "arena"
  | "pixelui"
  | "foro";
type BlogFilter = "all" | "laboratorios" | "comunidad" | "noticias";
type ForoSubTab = "hilos" | "glosario";

const DOSSIER_HASH: Record<DossierEpisode, string> = {
  ep05: "ep05-torneo-tres-gigantes",
  ep04: "ep04-escalera-claude",
  ep03: "ep03-superpowers-kit",
  ep02: "ep02-argon-vs-opus",
  ep01: "ep01-argon-vs-flash",
};

/** Canonical, shareable URL fragment for every view of the single-page portal. */
function hashFor(
  view: MainView,
  ep: DossierEpisode,
  foroTab: ForoSubTab = "hilos"
): string {
  switch (view) {
    case "blog":
      return "";
    case "dossiers":
      return DOSSIER_HASH[ep];
    case "comunidad":
      return "comentario-al-codigo";
    case "noticias":
      return "noticias";
    case "arena":
      return "arena";
    case "pixelui":
      return "pixel-ui";
    case "foro":
      return foroTab === "glosario" ? "glosario" : "foro";
  }
}

interface ViewTarget {
  view: MainView;
  ep?: DossierEpisode;
  foroTab?: ForoSubTab;
}

/** View a URL fragment opens (respecting embargoes); null for any other fragment, e.g. an in-page anchor. */
function viewForHash(h: string, rel: ReleasedState): ViewTarget | null {
  // Empty or #top: back button to the portal root
  if (!h || h === "top") return { view: "blog" };
  if (
    (h === "noticias" || h === "radar-mixiuh" || h === "gemini-4-carbon") &&
    rel.carbon01
  ) {
    return { view: "noticias" };
  }
  if (h === "ep05-torneo-tres-gigantes" && rel.ep05) return { view: "dossiers", ep: "ep05" };
  if (h === "ep04-escalera-claude" && rel.ep04) return { view: "dossiers", ep: "ep04" };
  if (h === "ep03-superpowers-kit" && rel.ep03) return { view: "dossiers", ep: "ep03" };
  if (h === DOSSIER_HASH.ep02) return { view: "dossiers", ep: "ep02" };
  if (h === DOSSIER_HASH.ep01) return { view: "dossiers", ep: "ep01" };
  if (h === "comentario-al-codigo" && (rel.cc01 || rel.cc02)) return { view: "comunidad" };
  if (h === "dossier" || h === "matriz" || h === "laboratorios") return { view: "dossiers" };
  if (h === "arena") return { view: "arena" };
  if (h === "pixel-ui" || h === "pixelui" || h === "ui-kit") return { view: "pixelui" };
  if (h === "foro") return { view: "foro", foroTab: "hilos" };
  if (h === "glosario" || h === "ecosistema") return { view: "foro", foroTab: "glosario" };
  return null;
}

/** Home tab title (the Spanish one is the metadata default in layout.tsx). */
const SITE_TITLE = {
  es: "Mixiuh Labs | Benchmarks Zero-Shot de IA, Arena de Demos y Foro Tecnico",
  en: "Mixiuh Labs | Zero-Shot AI Benchmarks, Demo Arena & Tech Forum",
} as const;

const DOSSIER_NAME: Record<DossierEpisode, { es: string; en: string }> = {
  ep05: {
    es: "Laboratorio EP05: El Torneo de los 3 Gigantes (6 Retos 3D + Ronda de Rescate)",
    en: "Lab EP05: The 3 Giants Tournament (6 3D Rounds + Rescue Round)",
  },
  ep04: { es: "Laboratorio EP04: Escalera Claude 5.5", en: "Lab EP04: Claude 5.5 Ladder" },
  ep03: {
    es: "Laboratorio EP03: Argon High Sin Kit vs Superpowers Kit",
    en: "Lab EP03: Argon High Raw vs Superpowers Kit",
  },
  ep02: {
    es: "Laboratorio EP02: Gemini 4 Argon vs Claude Opus 5.5",
    en: "Lab EP02: Gemini 4 Argon vs Claude Opus 5.5",
  },
  ep01: {
    es: "Laboratorio EP01: Gemini 4 Argon vs Gemini 3.8 Flash",
    en: "Lab EP01: Gemini 4 Argon vs Gemini 3.8 Flash",
  },
};

/** Name of each view: its tab title ("<name> | Mixiuh Labs") and what a view switch announces. */
function viewName(
  view: MainView,
  ep: DossierEpisode,
  foroTab: ForoSubTab,
  lang: "es" | "en"
): string {
  const es = lang === "es";
  switch (view) {
    case "blog":
      return es ? "Inicio" : "Home";
    case "dossiers":
      return DOSSIER_NAME[ep][lang];
    case "comunidad":
      return es
        ? "Del Comentario al Codigo (#01–#02): ROBLOX 3D + OVERFIT Studio 3D"
        : "From Comment to Code (#01–#02): 3D ROBLOX + OVERFIT Studio 3D";
    case "noticias":
      return es ? "Noticias IA #01: Gemini 4 Carbon" : "AI News #01: Gemini 4 Carbon";
    case "arena":
      return es ? "Arena de Demos" : "Demo Arena";
    case "pixelui":
      return `Mixiuh Pixel UI v${PIXEL_UI_VERSION}`;
    case "foro":
      return foroTab === "glosario"
        ? es
          ? "Glosario Tecnico"
          : "Technical Glossary"
        : es
        ? "Foro Tecnico"
        : "Technical Forum";
  }
}

/** Result count the command palette announces while the visitor types. */
const PALETTE_RESULTS_LABEL = {
  es: (n: number) => (n === 1 ? "1 resultado" : `${n} resultados`),
  en: (n: number) => (n === 1 ? "1 result" : `${n} results`),
} as const;

function writeHash(hash: string, mode: "push" | "replace") {
  const url = `${window.location.pathname}${window.location.search}${
    hash ? `#${hash}` : ""
  }`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (url === current) return;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

/** One accent per production, shared by blog cards, calendar, CRT and floppy selector. */
const EPISODE_ACCENT: Record<ReleaseKey, string> = {
  ep05: "#10B981",
  cc02: "#10B981",
  carbon01: "#00E5FF",
  ep04: "#FF3355",
  ep03: "#10B981",
  cc01: "#FFD100",
  ep02: "#A855F7",
  ep01: "#F5F2EB",
};

/** Deep link of each production (used by the share popover). */
const ARTICLE_HASH: Record<ReleaseKey, string> = {
  ep05: "ep05-torneo-tres-gigantes",
  cc02: "comentario-al-codigo",
  carbon01: "noticias",
  ep04: "ep04-escalera-claude",
  ep03: "ep03-superpowers-kit",
  cc01: "comentario-al-codigo",
  ep02: "ep02-argon-vs-opus",
  ep01: "ep01-argon-vs-flash",
};

/**
 * Verbatim text of the Instagram comment shown as an image in CC01
 * (/brand/thumbs/tenito_comment.png); it is the image's text alternative.
 */
const TENITO_COMMENT_ES =
  "Si ahora con esa textura le pides hacer una playera y también le pides que te de un mockup en blanco para editarlo ahora puedes crear una marca de ropa ?";
const TENITO_COMMENT_EN =
  "If you now take that texture and ask it to make a T-shirt, and also ask it to give you a blank mockup to edit, can you now create a clothing brand?";

/**
 * English alt text of the covers with Spanish text baked in (there are no
 * English versions): the Spanish text plus its translation, like the tenito
 * comment's alt. Keyed by image path; other images keep their usual alt.
 */
const SPANISH_COVER_ALT_EN: Partial<Record<string, string>> = {
  "/brand/thumbs/cc01_thumb_A.jpg": `OVERFIT Studio 3D cover A, in Spanish: "De comentario a marca. Reto de @tenito03 · OVERFIT" (English: "From a comment to a brand. @tenito03 challenge · OVERFIT")`,
  "/brand/thumbs/cc01_thumb_B.jpg": `OVERFIT Studio 3D cover B, in Spanish: "10 diseños IA 3D. Coleccion Guerra de Pesos" (English: "10 3D AI designs. Weight War collection")`,
  "/brand/thumbs/cc01_thumb_C.jpg": `OVERFIT Studio 3D cover C, in Spanish: "Mockups 300 GSM. Frente + espalda + redes" (English: "300 GSM mockups. Front + back + social media")`,
  "/brand/thumbs/ep03_thumb_A.jpg": `Lab EP03 cover "Raw vs Superkit", the raw side labelled in Spanish: "IA sin kit" (English: "AI without a kit")`,
};

/**
 * Carbon figures on the home page come from the official Google DeepMind rows
 * in carbonBenchmarks.ts (no retyped numbers). A renamed row fails the build here.
 */
function carbonRow(benchmark: string): CarbonBenchmarkRow {
  const row = CARBON_FULL_BENCHMARKS.find((r) => r.benchmark === benchmark);
  if (!row) throw new Error(`carbonBenchmarks.ts has no Carbon row "${benchmark}"`);
  return row;
}
const CARBON_TERMINAL_BENCH = carbonRow("Terminal-Bench 4.0 (AA)");
const CARBON_SEC_BENCH = carbonRow("SEC-bench Pro");
const CARBON_AA_INDEX = carbonRow("AA Index v5.0");

/** Carbon's score, tagged "(#1)" only where the official table ranks it first. */
const carbonScore = (row: CarbonBenchmarkRow) =>
  `${row.carbon}${row.winner === "carbon" ? " (#1)" : ""}`;

/** Benchmarks in DeepMind's master table (17); the News view's table adds Gray Swan IPI (18). */
const CARBON_TABLE_EVALS = CARBON_BENCHMARK_STATS.masterTable;
const CARBON_SITE_EVALS = CARBON_BENCHMARK_STATS.total;

/** Home telemetry chart: official rows that have a Carbon, Opus 5.5 and Argon score. */
const CARBON_TELEMETRY_DATA = (
  [
    ["Terminal-Bench 4.0 (AA)", "TERMINAL-BENCH 4.0"],
    ["Agents' Last Exam v1.1", "AGENTS' LAST EXAM"],
    ["CWE-bench", "CWE-BENCH"],
    ["ExploitGym", "EXPLOITGYM"],
  ] as const
).map(([benchmark, label]) => {
  const row = carbonRow(benchmark);
  return {
    label,
    values: {
      carbon: parseFloat(row.carbon),
      opus: parseFloat(row.opus55),
      argon: parseFloat(row.argon),
    },
  };
});

interface BlogMetric {
  label_es: string;
  label_en: string;
  val: string;
  /** Set only where `val` contains Spanish words. */
  val_en?: string;
}

interface BlogArticle {
  id: ReleaseKey;
  filter: Exclude<BlogFilter, "all">;
  date: string;
  readTime_es: string;
  readTime_en: string;
  badge_es: string;
  badge_en: string;
  accentColor: string;
  scoreBadge_es: string;
  scoreBadge_en: string;
  thumb: string;
  /** Set only where the cover has an English version. */
  thumb_en?: string;
  title_es: string;
  title_en: string;
  excerpt_es: string;
  excerpt_en: string;
  metrics: BlogMetric[];
  onOpenDossier: () => void;
  onOpenArena: () => void;
}

const AMBIENT_MODES: AmbientSimulationMode[] = [
  "ai-ecosystem",
  "neural-packets",
  "voxel-rain",
  "off",
];

const PREF_LANG_KEY = "mixiuh_lang";
const PREF_AMBIENT_KEY = "mixiuh_ambient";

const isLang = (value: string): value is "es" | "en" =>
  value === "es" || value === "en";
const isAmbientMode = (value: string): value is AmbientSimulationMode =>
  (AMBIENT_MODES as string[]).includes(value);

export interface PortalClientProps {
  /** Forum thread counts per release, computed on the server (forumCounts.ts). */
  forumCounts: ForumCounts;
}

export default function PortalClient({ forumCounts }: PortalClientProps) {
  // Persisted, tab-synced and hydration-safe (static HTML renders "es" first)
  const [lang, setLang] = usePixelPref(PREF_LANG_KEY, "es", isLang);
  const { enabled: sfxEnabled, play: playSfx, toggle: toggleSfx } =
    usePixelSound();
  const { cursorStyle, setCursorStyle } = usePixelCursor("cyber-arrow");
  const [ambientMode, setAmbientMode] = usePixelPref<AmbientSimulationMode>(
    PREF_AMBIENT_KEY,
    "ai-ecosystem",
    isAmbientMode
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const cursorLabel = (id: string) => {
    const preset = PIXEL_CURSOR_PRESETS.find((p) => p.id === id);
    if (!preset) return id;
    return lang === "es" ? preset.name_es : preset.name_en;
  };

  const cycleCursorStyle = () => {
    const idx = PIXEL_CURSOR_PRESETS.findIndex((p) => p.id === cursorStyle);
    const next =
      PIXEL_CURSOR_PRESETS[(idx + 1) % PIXEL_CURSOR_PRESETS.length].id;
    setCursorStyle(next);
    pixelToast.show({
      title: `CURSOR: ${cursorLabel(next).toUpperCase()}`,
      tone: "cyan",
      icon: "mouse",
      sound: null,
    });
  };

  const ambientLabel = (mode: AmbientSimulationMode) =>
    mode === "off"
      ? lang === "es"
        ? "APAGADO"
        : "OFF"
      : mode.replace("-", " ").toUpperCase();

  const cycleAmbientMode = () => {
    playSfx("click");
    const next =
      AMBIENT_MODES[(AMBIENT_MODES.indexOf(ambientMode) + 1) % AMBIENT_MODES.length];
    setAmbientMode(next);
    pixelToast.show({
      title: `${lang === "es" ? "FONDO IA" : "AI BACKGROUND"}: ${ambientLabel(next)}`,
      tone: next === "off" ? "ink" : "emerald",
      icon: "brain-ai",
      sound: null,
    });
  };
  // First render uses the build clock (matches the static HTML); the mount
  // effect below switches to the visitor's live clock.
  const [released, setReleased] = useState<ReleasedState>(() =>
    getReleasedStatus(BUILD_TIME)
  );
  const [mainView, setMainView] = useState<MainView>("blog");
  const [blogFilter, setBlogFilter] = useState<BlogFilter>("all");
  const [dossierEp, setDossierEp] = useState<DossierEpisode>(() => {
    const r = getReleasedStatus(BUILD_TIME);
    if (r.ep05) return "ep05";
    if (r.ep04) return "ep04";
    if (r.ep03) return "ep03";
    return "ep02";
  });

  // Arena & Episode state
  const [activeEpisode, setActiveEpisode] = useState<"ep02" | "ep01">("ep02");
  const [selectedChallengeN, setSelectedChallengeN] = useState<number>(1);
  const [arenaMode, setArenaMode] = useState<"ep05" | "ep04" | "ep03" | "ep02_ep01">(
    () => {
      const r = getReleasedStatus(BUILD_TIME);
      if (r.ep05) return "ep05";
      if (r.ep04) return "ep04";
      if (r.ep03) return "ep03";
      return "ep02_ep01";
    }
  );

  // EP05 interactive 3-way + Rescue comparator state
  const [ep05ChallengeN, setEp05ChallengeN] = useState<number>(1);

  // EP03 interactive comparator state
  const [ep03ChallengeN, setEp03ChallengeN] = useState<number>(2);
  const [ep03Mode, setEp03Mode] = useState<Ep03Mode>("split");

  // EP04 interactive 3-way comparator state
  const [ep04ChallengeN, setEp04ChallengeN] = useState<number>(4);
  const [ep04Mode, setEp04Mode] = useState<Ep04Mode>("triple");

  // CC02 Roblox 3D 3-Giants interactive comparator state
  const [cc02Model, setCc02Model] = useState<
    "astra" | "argon" | "opus" | "opus_fixed" | "triple" | "prompt"
  >("astra");
  const [comunidadEp, setComunidadEp] = useState<"all" | "cc02" | "cc01">(
    "all"
  );

  // Video & Glossary state
  const [activeVideoClip, setActiveVideoClip] = useState<VideoClip>("hook");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [foroSubTab, setForoSubTab] = useState<ForoSubTab>("hilos");

  // Keep <html lang> in sync for screen readers, hyphenation & translation tools
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Tab title per view, dossier episode and language (home keeps the site title).
  // Next's metadata <title> can commit after this effect and write back its
  // static default, so the title is re-applied whenever <head> changes.
  const currentViewName = viewName(mainView, dossierEp, foroSubTab, lang);
  const pageTitle =
    mainView === "blog" ? SITE_TITLE[lang] : `${currentViewName} | Mixiuh Labs`;
  useEffect(() => {
    document.title = pageTitle;
    const observer = new MutationObserver(() => {
      if (document.title !== pageTitle) document.title = pageTitle;
    });
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [pageTitle]);

  // A view switch (never the first load) is announced in the live region at the
  // end of the page and moves focus to the new view's <main>. In-place selectors
  // (dossier disks, EP04 modes, filters) don't come through here.
  const headerRef = useRef<HTMLElement>(null);
  const [viewSwitch, setViewSwitch] = useState({ id: 0, name: "" });
  const announceViewSwitch = (name: string) =>
    setViewSwitch((prev) => ({ id: prev.id + 1, name }));
  useEffect(() => {
    if (!viewSwitch.id) return;
    // Runs after the commit that mounted the new view's <main id="contenido">
    const frame = requestAnimationFrame(() => {
      // A visitor on a persistent header control keeps their place there, and
      // so does one in an open modal (the palette and settings drawer outlive
      // the view, e.g. on a Back step while they are open)
      const current = document.activeElement;
      if (headerRef.current?.contains(current) || current?.closest('[aria-modal="true"]')) {
        return;
      }
      document.getElementById("contenido")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [viewSwitch.id]);

  // Phone section strip: after every view change, deep link, reload or language
  // switch, centre the current section's tab in it. Only the strip scrolls
  // (never the page), and nothing happens when it fits or is hidden (lg up).
  const mobileNavRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const centreActiveTab = () => {
      const strip = mobileNavRef.current;
      const tab = strip?.querySelector<HTMLElement>("[data-mobile-tab-active]");
      if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return;
      const stripBox = strip.getBoundingClientRect();
      const tabBox = tab.getBoundingClientRect();
      strip.scrollTo({
        left:
          strip.scrollLeft +
          tabBox.left -
          stripBox.left -
          (strip.clientWidth - tabBox.width) / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    };
    centreActiveTab();
    // Web fonts that arrive later resize the tabs: centre again once they are in
    if (document.fonts.status !== "loading") return;
    let current = true;
    document.fonts.ready.then(() => {
      if (current) centreActiveTab();
    });
    return () => {
      current = false;
    };
  }, [mainView, lang, released]);

  // Back/forward and typed fragments switch views too (named in the current language)
  const onHistoryViewSwitch = useEffectEvent((target: ViewTarget) => {
    announceViewSwitch(
      viewName(target.view, target.ep ?? dossierEp, target.foroTab ?? foroSubTab, lang)
    );
  });

  // After hydration: switch from the build clock to the visitor's live clock and
  // the URL hash (respecting embargo dates unless ?preview=all). This is the one
  // place where state is synchronised from external systems on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previewAll = params.get("preview") === "all";
    const rel = getReleasedStatus(new Date(), previewAll);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- live clock only exists after hydration
    setReleased(rel);

    // Default episode/arena = newest published one (content may have been
    // released after this HTML was built); the hash below can override it.
    setDossierEp(rel.ep05 ? "ep05" : rel.ep04 ? "ep04" : rel.ep03 ? "ep03" : "ep02");
    setArenaMode(rel.ep05 ? "ep05" : rel.ep04 ? "ep04" : rel.ep03 ? "ep03" : "ep02_ep01");

    const applyHash = () => {
      const target = viewForHash(window.location.hash.replace("#", ""), rel);
      if (!target) return null;
      setMainView(target.view);
      if (target.ep) {
        setDossierEp(target.ep);
        if (target.ep === "ep02" || target.ep === "ep01") setActiveEpisode(target.ep);
      }
      if (target.foroTab) setForoSubTab(target.foroTab);
      return target;
    };
    applyHash();

    // The boot script in layout.tsx hides #contenido while a deep link or a
    // saved language is pending. Both are applied by now (the saved language
    // re-renders right after hydration): reveal it once they are painted.
    let revealFrame = requestAnimationFrame(() => {
      revealFrame = requestAnimationFrame(() => {
        document.documentElement.removeAttribute("data-boot-view");
        document.documentElement.removeAttribute("data-boot-lang");
      });
    });

    // One fragment step fires popstate, then hashchange: handle it once
    let handledUrl = "";
    const onHistoryStep = (e: Event) => {
      if (e instanceof HashChangeEvent && e.newURL === handledUrl) return;
      handledUrl = window.location.href;
      const target = applyHash();
      if (target) onHistoryViewSwitch(target);
    };
    window.addEventListener("hashchange", onHistoryStep);
    window.addEventListener("popstate", onHistoryStep);
    return () => {
      cancelAnimationFrame(revealFrame);
      window.removeEventListener("hashchange", onHistoryStep);
      window.removeEventListener("popstate", onHistoryStep);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const navigateToView = (
    view: MainView,
    subEp?: DossierEpisode,
    foroTab?: ForoSubTab
  ) => {
    playSfx("click");
    if (
      (view === "comunidad" && !released.cc01 && !released.cc02 && !released.ep03) ||
      (view === "noticias" && !released.carbon01)
    ) {
      setMainView("blog");
      writeHash("", "push");
      announceViewSwitch(viewName("blog", dossierEp, foroSubTab, lang));
      return;
    }
    setMainView(view);
    let nextEp = dossierEp;
    if (subEp) {
      const safeEp =
        subEp === "ep04" && !released.ep04
          ? released.ep03
            ? "ep03"
            : "ep02"
          : subEp === "ep03" && !released.ep03
          ? "ep02"
          : subEp;
      nextEp = safeEp;
      setDossierEp(safeEp);
      if (safeEp === "ep02" || safeEp === "ep01") {
        setActiveEpisode(safeEp);
      }
    }
    if (foroTab) setForoSubTab(foroTab);
    writeHash(hashFor(view, nextEp, foroTab ?? foroSubTab), "push");
    announceViewSwitch(viewName(view, nextEp, foroTab ?? foroSubTab, lang));
    scrollToTop();
  };

  /** Real links (shareable, open-in-new-tab) that still navigate in-app on a plain click. */
  const viewLink = (
    view: MainView,
    subEp?: DossierEpisode,
    foroTab?: ForoSubTab
  ) => ({
    href: `#${hashFor(view, subEp ?? dossierEp, foroTab ?? foroSubTab)}`,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      e.preventDefault();
      navigateToView(view, subEp, foroTab);
    },
  });

  const selectDossierEp = (ep: DossierEpisode) => {
    setDossierEp(ep);
    writeHash(DOSSIER_HASH[ep], "replace");
  };

  const selectForoSubTab = (tab: ForoSubTab) => {
    setForoSubTab(tab);
    writeHash(tab === "glosario" ? "glosario" : "foro", "replace");
  };

  const handleEpisodeChange = (ep: "ep02" | "ep01") => {
    setActiveEpisode(ep);
    selectDossierEp(ep);
    setSelectedChallengeN(ep === "ep02" ? 1 : 6);
    setActiveVideoClip("hook");
  };

  // Inside the Arena the URL stays #arena; bumping the key remounts the EP01/EP02
  // arena so any open bonus demo or source tab resets with the new episode.
  const [arenaResetKey, setArenaResetKey] = useState(0);
  const selectArenaEpisode = (ep: "ep02" | "ep01") => {
    setArenaMode("ep02_ep01");
    setActiveEpisode(ep);
    setDossierEp(ep);
    setSelectedChallengeN(ep === "ep02" ? 1 : 6);
    setArenaResetKey((k) => k + 1);
  };

  const handleJumpToArena = (
    episode: "ep05" | "ep04" | "ep03" | "ep02" | "ep01",
    challengeN: number
  ) => {
    if (episode === "ep05" && released.ep05) {
      setEp05ChallengeN(challengeN);
      setArenaMode("ep05");
      setMainView("arena");
    } else if (episode === "ep04" && released.ep04) {
      setEp04ChallengeN(challengeN);
      setArenaMode("ep04");
      setMainView("arena");
    } else if (episode === "ep03" && released.ep03) {
      setEp03ChallengeN(challengeN);
      setArenaMode("ep03");
      setMainView("arena");
    } else {
      const safeEp =
        episode === "ep05" || episode === "ep04" || episode === "ep03" ? "ep02" : episode;
      setActiveEpisode(safeEp);
      setSelectedChallengeN(challengeN);
      setArenaMode("ep02_ep01");
      setArenaResetKey((k) => k + 1);
      setMainView("arena");
    }
    writeHash("arena", "push");
    announceViewSwitch(viewName("arena", dossierEp, foroSubTab, lang));
    scrollToTop();
  };

  const openGlossaryTerm = (term: string) => {
    setGlossarySearch(term);
    setMainView("foro");
    setForoSubTab("glosario");
    writeHash("glosario", "push");
    announceViewSwitch(viewName("foro", dossierEp, "glosario", lang));
    scrollToTop();
  };

  const glossaryQuery = glossarySearch.trim();
  const filteredGlossary = LAB_GLOSSARY.filter((item) => {
    const q = glossaryQuery.toLowerCase();
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.plain_es.toLowerCase().includes(q) ||
      (item.term_en ?? "").toLowerCase().includes(q) ||
      (item.plain_en ?? "").toLowerCase().includes(q)
    );
  });

  // Glossary search results for screen readers: nothing for an empty query,
  // otherwise the count or the visible no-results text, debounced while typing
  const glossaryCount = filteredGlossary.length;
  const glossaryNoResults =
    lang === "es"
      ? `Sin resultados para "${glossaryQuery}"`
      : `No results for "${glossaryQuery}"`;
  const glossaryStatusText = !glossaryQuery
    ? ""
    : glossaryCount === 0
    ? glossaryNoResults
    : lang === "es"
    ? `${glossaryCount} ${glossaryCount === 1 ? "concepto" : "conceptos"}`
    : `${glossaryCount} ${glossaryCount === 1 ? "term" : "terms"}`;
  const [glossaryStatus, setGlossaryStatus] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setGlossaryStatus(glossaryStatusText), 400);
    return () => window.clearTimeout(timer);
  }, [glossaryStatusText]);

  // English mode shows the English twins of the data where they exist
  const glossaryTerm = (g: (typeof LAB_GLOSSARY)[number]) =>
    lang === "es" ? g.term : (g.term_en ?? g.term);
  const glossaryPlain = (g: (typeof LAB_GLOSSARY)[number]) =>
    lang === "es" ? g.plain_es : (g.plain_en ?? g.plain_es);

  // Blog Cards Data (All 7 Productions across the 3 Editorial Pillars, gated by releaseSchedule.ts)
  const BLOG_ARTICLES: BlogArticle[] = [
    {
      id: "ep05" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "01 Nov 2026",
      readTime_es: "Video 4K60 · 20 Simuladores 3D",
      readTime_en: "4K60 Video · 20 3D Simulators",
      badge_es: "LABORATORIO EP05 · EL TORNEO DE LOS 3 GIGANTES",
      badge_en: "LAB EP05 · THE 3 GIANTS TOURNAMENT",
      accentColor: EPISODE_ACCENT.ep05,
      scoreBadge_es: "ASTRA 3 · ARGON 2 · OPUS 1",
      scoreBadge_en: "ASTRA 3 · ARGON 2 · OPUS 1",
      thumb: "/brand/thumbs/ep05/01-impacto-planetario-3d_argon.png",
      title_es:
        "El Torneo de los 3 Gigantes: Gemini 4 Argon High ($1.51) vs. Claude Opus 5.5 High ($32.75) vs. GPT-6 Astra High ($2.74) en 6 Retos 3D + Ronda de Rescate",
      title_en:
        "The 3 Giants Tournament: Gemini 4 Argon High ($1.51) vs. Claude Opus 5.5 High ($32.75) vs. GPT-6 Astra High ($2.74) across 6 3D Challenges + Rescue Round",
      excerpt_es:
        "Enfrentamos a los tres modelos frontera en modo HIGH a lo largo de 6 desafios visuales 3D con datos curiosos sobre el Problema de los 3 Cuerpos, el Efecto Tunel, los Atascos Fantasma y el sonido matematico. GPT-6 Astra High se corono campeon 3-2-1 en 42.9 min por $2.74 USD (6/6 al primer intento), Gemini 4 Argon High fue el mas rapido y barato (25.8 min, $1.51 USD, 12,844 lineas) y en la Ronda de Rescate cambiar una sola palabra (innerPixelRatio -> devicePixelRatio) desbloqueo sus 2 juegos finales a 60 FPS.",
      excerpt_en:
        "We put all three frontier models in HIGH mode head-to-head across 6 3D visual challenges with fun science facts on the Three-Body Problem, Bullet Tunneling, Phantom Traffic Jams, and math sound waves. GPT-6 Astra High won the 3-2-1 crown in 42.9 min for $2.74 USD (6/6 first-try success), Gemini 4 Argon High was the fastest and cheapest (25.8 min, $1.51 USD, 12,844 lines), and in the Rescue Round fixing one word (innerPixelRatio -> devicePixelRatio) unlocked its final 2 games at 60 FPS.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "3 - 2 - 1 Astra" },
        { label_es: "GPT-6 ASTRA", label_en: "GPT-6 ASTRA", val: "42.9m · $2.74 (6/6 OK)" },
        { label_es: "ARGON HIGH", label_en: "ARGON HIGH", val: "25.8m · $1.51 (+2 Rescate)", val_en: "25.8m · $1.51 (+2 Rescued)" },
        { label_es: "OPUS 5.5 HIGH", label_en: "OPUS 5.5 HIGH", val: "194.6m · $32.75 (DJ 32 Pads)" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep05"),
      onOpenArena: () => handleJumpToArena("ep05", 1),
    },
    {
      id: "cc02" as ReleaseKey,
      filter: "comunidad" as const,
      date: "31 Oct 2026",
      readTime_es: "Video 4K60 · 4 Motores Roblox 3D",
      readTime_en: "4K60 Video · 4 3D Roblox Engines",
      badge_es: "DEL COMENTARIO AL CODIGO #02 · RETO ROBLOX 3D",
      badge_en: "FROM COMMENT TO CODE #02 · 3D ROBLOX CHALLENGE",
      accentColor: EPISODE_ACCENT.cc02,
      scoreBadge_es: "ASTRA 2 · ARGON 1 · OPUS 0",
      scoreBadge_en: "ASTRA 2 · ARGON 1 · OPUS 0",
      thumb: "/brand/thumbs/cc02_thumb_A.png",
      title_es:
        "Le Pedi un Juego Tipo ROBLOX 3D a Gemini 4 Argon High ($0.32) vs. Claude Opus 5.5 High ($9.91) vs. GPT-6 Astra High ($1.11) + Bonus Opus Reparado",
      title_en:
        "I Asked Gemini 4 Argon High ($0.32) vs. Claude Opus 5.5 High ($9.91) vs. GPT-6 Astra High ($1.11) to Build a 3D ROBLOX Game + Fixed Opus Bonus",
      excerpt_es:
        "Un suscriptor en Instagram nos reto a enfrentar a los 3 gigantes en modo HIGH creando un juego tipo ROBLOX 3D completo en un solo intento (circuito Obby de 10 islas, 6 robots IA con chat y modo Roblox Studio 3D). GPT-6 Astra High termino primero en 18.9 min con 4,727 lineas a 61 FPS por $1.11 USD (2-1), Gemini 4 Argon High entrego el mejor modo Roblox Studio 3D por $0.32 USD (27.2 min), y Claude Opus 5.5 High tardo 55.1 min ($9.91 USD) rompiendo su escena 3D en la linea 1062 — que reparamos en el Bonus Extendido.",
      excerpt_en:
        "An Instagram subscriber challenged us to pit the 3 AI Giants in HIGH mode building a complete 3D ROBLOX game in a single attempt (10-island Obby course, 6 AI robots with chat, and live 3D Roblox Studio mode). GPT-6 Astra High finished first in 18.9 min with 4,727 lines at 61 FPS for $1.11 USD (2-1), Gemini 4 Argon High built the best 3D Studio preview tool for $0.32 USD (27.2 min), and Claude Opus 5.5 High spent 55.1 min ($9.91 USD) crashing on line 1062 — which we unlocked in the Extended Bonus.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "2 - 1 - 0 Astra" },
        { label_es: "GPT-6 ASTRA", label_en: "GPT-6 ASTRA", val: "18.9m · 4,727 Lín ($1.11)", val_en: "18.9m · 4,727 LoC ($1.11)" },
        { label_es: "ARGON HIGH", label_en: "ARGON HIGH", val: "27.2m · 2,578 Lín ($0.32)", val_en: "27.2m · 2,578 LoC ($0.32)" },
        { label_es: "OPUS 5.5 HIGH", label_en: "OPUS 5.5 HIGH", val: "55.1m · $9.91 (+Bonus 60FPS)", val_en: "55.1m · $9.91 (+60FPS Bonus)" },
      ],
      onOpenDossier: () => {
        setComunidadEp("cc02");
        navigateToView("comunidad");
      },
      onOpenArena: () => {
        setComunidadEp("cc02");
        navigateToView("comunidad");
      },
    },
    {
      id: "carbon01" as ReleaseKey,
      filter: "noticias" as const,
      date: "29 Oct 2026",
      readTime_es: `04:19 Video · 8 Capitulos · ${CARBON_TABLE_EVALS} Evals`,
      readTime_en: `04:19 Video · 8 Chapters · ${CARBON_TABLE_EVALS} Evals`,
      badge_es: "RADAR MIXIUH · NOTICIAS IA #01",
      badge_en: "MIXIUH NEWS · AI RADAR #01",
      accentColor: EPISODE_ACCENT.carbon01,
      scoreBadge_es: "NUEVO #1 MUNDIAL",
      scoreBadge_en: "NEW #1 WORLDWIDE",
      thumb: "/brand/thumbs/carbon_thumb_A.jpg",
      thumb_en: "/brand/thumbs/carbon_thumb_A_en.jpg",
      title_es:
        "Google Anuncia Gemini 4 Carbon: El Nuevo #1 Mundial (14 Dias Despues de Argon) y el Salto a $4/$20 USD",
      title_en:
        "Google Unveils Gemini 4 Carbon: The New #1 Worldwide (14 Days After Argon) & the $4/$20 USD Price Jump",
      excerpt_es: `Analisis completo de las ${CARBON_TABLE_EVALS} evaluaciones oficiales de Google DeepMind: como Gemini 4 Carbon destrona a Claude Opus 5.5 en Terminal-Bench 4.0 (${CARBON_TERMINAL_BENCH.carbon} vs ${CARBON_TERMINAL_BENCH.opus55}) y programacion de largo horizonte, arrasa en ciberseguridad defensiva (${CARBON_SEC_BENCH.carbon} en SEC-bench Pro) y por que duplicar el precio de la API ($4/$20 USD) sigue costando un 20% menos que Opus ($5/$25).`,
      excerpt_en: `Full breakdown of Google DeepMind's ${CARBON_TABLE_EVALS} official benchmarks: how Gemini 4 Carbon dethrones Claude Opus 5.5 on Terminal-Bench 4.0 (${CARBON_TERMINAL_BENCH.carbon} vs ${CARBON_TERMINAL_BENCH.opus55}) and long-horizon coding, sweeps defensive cybersecurity (${CARBON_SEC_BENCH.carbon} on SEC-bench Pro), and why doubling the API price ($4/$20 USD) still costs 20% less than Opus ($5/$25).`,
      metrics: [
        { label_es: "TERMINAL-BENCH 4.0", label_en: "TERMINAL-BENCH 4.0", val: carbonScore(CARBON_TERMINAL_BENCH) },
        { label_es: "SEC-BENCH PRO", label_en: "SEC-BENCH PRO", val: carbonScore(CARBON_SEC_BENCH) },
        { label_es: "AA INDEX", label_en: "AA INDEX", val: carbonScore(CARBON_AA_INDEX) },
        { label_es: "PRECIO API", label_en: "API PRICE", val: "$4 / $20 USD" },
      ],
      onOpenDossier: () => navigateToView("noticias"),
      onOpenArena: () => navigateToView("noticias"),
    },
    {
      id: "ep04" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "28 Oct 2026",
      readTime_es: "08:15 Video · 18 Demos",
      readTime_en: "08:15 Video · 18 Demos",
      badge_es: "LABORATORIO EP04 · ESCALERA CLAUDE 5.5",
      badge_en: "LAB EP04 · CLAUDE 5.5 LADDER",
      accentColor: EPISODE_ACCENT.ep04,
      scoreBadge_es: "OPUS 3 · SONNET 2 · HAIKU 1",
      scoreBadge_en: "OPUS 3 · SONNET 2 · HAIKU 1",
      thumb: "/brand/thumbs/ep04_thumb_A.jpg",
      title_es:
        "Claude Haiku 5.5 vs. Sonnet 5.5 vs. Opus 5.5: ¿En Que Nivel Conviene Gastar Tu Dinero? ($1.54 vs $12.22 vs $29.94)",
      title_en:
        "Claude Haiku 5.5 vs. Sonnet 5.5 vs. Opus 5.5: Which Tier Is Actually Worth Your Money? ($1.54 vs $12.22 vs $29.94)",
      excerpt_es:
        "Corrimos 18 pruebas aisladas en Claude Code CLI con los 3 niveles de Claude 5.5 en 6 retos extremos. Opus 5.5 gano los primeros 3 retos de fisica y shaders (3-0), pero Haiku 5.5 sorprendio construyendo el Estudio Acido 3D a 61 FPS por solo $0.21 USD (24x mas barato que Opus), y Sonnet 5.5 gano los ultimos 2 retos sacando casi 1.5 veces los FPS de Opus en el Path Tracer (22 vs 15 FPS) y arrancando Pong en vivo en la consola CHIP-8.",
      excerpt_en:
        "We ran 18 isolated Claude Code CLI benchmarks across all 3 tiers of Claude 5.5 in 6 extreme challenges. Opus 5.5 swept the first 3 physics and shader rounds (3-0), but Haiku 5.5 stunned by building a 61 FPS 3D Acid Studio for $0.21 USD (24x cheaper than Opus), and Sonnet 5.5 won the final 2 challenges—running the Path Tracer at about 1.5x Opus's FPS (22 vs 15 FPS) and booting live Pong on the CHIP-8 console.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "3 - 2 - 1" },
        { label_es: "HAIKU 5.5", label_en: "HAIKU 5.5", val: "$1.54 · 87m" },
        { label_es: "SONNET 5.5", label_en: "SONNET 5.5", val: "$12.22 · 105m" },
        { label_es: "OPUS 5.5", label_en: "OPUS 5.5", val: "$29.94 · 179m" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep04"),
      onOpenArena: () => handleJumpToArena("ep04", 4),
    },
    {
      id: "ep03" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "25 Oct 2026",
      readTime_es: "07:31 Video · 12 Demos",
      readTime_en: "07:31 Video · 12 Demos",
      badge_es: "LABORATORIO EP03 · BENCHMARK AGY CLI",
      badge_en: "LAB EP03 · AGY CLI BENCHMARK",
      accentColor: EPISODE_ACCENT.ep03,
      scoreBadge_es: "SUPERKIT 4 - 2 SIN KIT",
      scoreBadge_en: "SUPERKIT 4 - 2 RAW AI",
      thumb: "/brand/thumbs/ep03_thumb_A.jpg",
      title_es:
        "Gemini 4 Argon High Sin Kit vs. Mixiuh Superpowers Kit: ¿Siguen Sirviendo los Skills y Memoria Hoy?",
      title_en:
        "Gemini 4 Argon High Raw vs. Mixiuh Superpowers Kit: Do You Still Need Skills & Memory Kits Today?",
      excerpt_es:
        "Corrimos 12 instancias reales y aisladas en la terminal de Antigravity. Gemini 4 Argon High sin kit gano 2 retos clave (Arcade Bullet-Hell con 1,829 balas en 51m y Red Zero-Trust 3D en 5 pasos por $0.74 USD), pero el Superpowers Kit gano 4-2 en el global (276m vs 302m): el HUD de su Terminal HFT Zero-GC marca 70,406 ord/s frente a 11,073 sin kit (una formula, no una medicion) y el Auto-Debugger MCP corrigio el solapamiento de ventanas.",
      excerpt_en:
        "We executed 12 real isolated runs in the Antigravity CLI. Raw Gemini 4 Argon High won 2 key rounds (Bullet-Hell Boss Rush with 1,829 bullets in 51m and 3D Zero-Trust Network in 5 steps for $0.74 USD), while the Superpowers Kit won 4-2 overall (276m vs 302m): its Zero-GC HFT Terminal's HUD reads 70,406 ord/s vs Raw AI's 11,073 (a formula, not a measurement), and the MCP Auto-Debugger fixed overlapping windows.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "4 - 2 Kit" },
        { label_es: "TIEMPO TOTAL", label_en: "TOTAL TIME", val: "276m vs 302m" },
        { label_es: "COSTO API", label_en: "API COST", val: "$10.85 vs $7.69" },
        { label_es: "TOKENS", label_en: "TOKENS", val: "3.52M vs 2.65M" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep03"),
      onOpenArena: () => handleJumpToArena("ep03", 2),
    },
    {
      id: "cc01" as ReleaseKey,
      filter: "comunidad" as const,
      date: "24 Oct 2026",
      readTime_es: "Estudio 3D + 10 Artes 2K",
      readTime_en: "3D Studio + 10 2K Prints",
      badge_es: "DEL COMENTARIO AL CODIGO #01 · @TENITO03",
      badge_en: "FROM COMMENT TO CODE #01 · @TENITO03",
      accentColor: EPISODE_ACCENT.cc01,
      scoreBadge_es: "OVERFIT STUDIO 3D",
      scoreBadge_en: "OVERFIT STUDIO 3D",
      thumb: "/brand/thumbs/cc01_thumb_A.jpg",
      title_es:
        "De un Comentario a una Marca de Ropa IA en 3D: OVERFIT Studio 3D y la Coleccion 'Guerra de Pesos'",
      title_en:
        "From a Comment to a 3D AI Streetwear Brand: OVERFIT Studio 3D & the 'Weight War' Collection",
      excerpt_es:
        "@tenito03 nos pregunto en el Reel de la tela Verlet si con esa textura podiamos hacer una playera, un mockup en blanco editable y lanzar una marca de ropa. Esculpimos en Blender Cycles 3 maniquies de algodon de 300 GSM (Hombre, Mujer y Mesa) y disenamos 10 estampados satiricos en 2K con exportacion 4K.",
      excerpt_en:
        "@tenito03 asked on the Verlet cloth Reel if we could turn that texture into a t-shirt, an editable blank mockup, and launch a clothing brand. We sculpted 3 300 GSM mannequins in Blender Cycles (Male, Female, Flat-Lay) and designed 10 satirical 2K prints with 4K export.",
      metrics: [
        { label_es: "MANIQUIES 3D", label_en: "3D MODELS", val: "Hombre/Mujer/Mesa", val_en: "Male/Female/Flat-Lay" },
        { label_es: "COLECCION", label_en: "COLLECTION", val: "10 Artes 2K UHD", val_en: "10 2K UHD Prints" },
        { label_es: "GRAMAJE", label_en: "FABRIC", val: "300 GSM + Verlet" },
        { label_es: "EXPORTACION", label_en: "EXPORT", val: "Reels 9:16 + PNG 4K" },
      ],
      onOpenDossier: () => navigateToView("comunidad"),
      onOpenArena: () => navigateToView("comunidad"),
    },
    {
      id: "ep02" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "21 Oct 2026",
      // The ES and EN cuts differ (captions end at 10:08 and 9:50)
      readTime_es: "~10 min Video · 12 Demos",
      readTime_en: "~10 min Video · 12 Demos",
      badge_es: "LABORATORIO EP02 · DUELO DE TITANES HIGH",
      badge_en: "LAB EP02 · HIGH TITAN DUEL",
      accentColor: EPISODE_ACCENT.ep02,
      scoreBadge_es: "ARGON 4 - 2 OPUS 5.5",
      scoreBadge_en: "ARGON 4 - 2 OPUS 5.5",
      // 1280px copy of the same art (cards render at most ~600 CSS px wide)
      thumb: "/brand/thumbs/ep02_thumb_A_1280.jpg",
      title_es:
        "Gemini 4 Argon vs. Claude Opus 5.5: 6 Retos Extremos de Fisica, WebGL2 y la Factura Real de Tokens",
      title_en:
        "Gemini 4 Argon vs. Claude Opus 5.5: 6 Extreme Physics & WebGL2 Challenges and the Real Token Bill",
      excerpt_es:
        "Enfrentamos a Claude Opus 5.5 (High) contra Gemini 4 Argon (High) en 6 motores zero-shot: Tela Verlet con desgarro, Fluidos Navier-Stokes GLSL, Cuerpos Blandos XPBD, Motor Voxel 3D, Sintetizador FM DX7 y Pinball CCD. Opus gano 2 retos, pero Argon se impuso 4-2 siendo 1.76x mas rapido y 2.60x mas barato.",
      excerpt_en:
        "We pitted Claude Opus 5.5 (High) against Gemini 4 Argon (High) across 6 zero-shot engines: Tearable Verlet Cloth, GLSL Navier-Stokes Fluids, XPBD Soft Bodies, 3D Voxel Engine, DX7 FM Synth, and CCD Pinball. Opus won 2 rounds, while Argon won 4-2 at 1.76x speed and 2.60x lower cost.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "4 - 2 Argon" },
        { label_es: "TIEMPO TOTAL", label_en: "TOTAL TIME", val: "90m vs 159m" },
        { label_es: "COSTO API", label_en: "API COST", val: "$6.26 vs $16.26" },
        { label_es: "TOKENS", label_en: "TOKENS", val: "3.63M vs 13.01M" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep02"),
      onOpenArena: () => handleJumpToArena("ep02", 1),
    },
    {
      id: "ep01" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "16 Oct 2026",
      readTime_es: "10:05 Video · 21 Demos",
      readTime_en: "10:05 Video · 21 Demos",
      badge_es: "LABORATORIO EP01 · TORNEO FUNDACIONAL",
      badge_en: "LAB EP01 · FOUNDATIONAL TOURNAMENT",
      accentColor: EPISODE_ACCENT.ep01,
      scoreBadge_es: "ARGON 10 - 0 FLASH",
      scoreBadge_en: "ARGON 10 - 0 FLASH",
      thumb: "/brand/thumbs/01_marcador-0-10_1280.jpg",
      title_es:
        "Gemini 4 Argon vs. Gemini 3.8 Flash: 10 Retos Zero-Shot y el Medio Pixel que Rompio un Mundo 3D",
      title_en:
        "Gemini 4 Argon vs. Gemini 3.8 Flash: 10 Zero-Shot Challenges & the Half Pixel That Broke a 3D World",
      excerpt_es:
        "10 pruebas zero-shot sin imagenes externas en Antigravity: Sistema Solar 3D, ADN, Boids, Mazmorras, Falling Sand, Raycasting Wolfenstein, Pixel Art, Reloj CSS, Arbol Fractal y Spirograph. Incluye la autopsia forense del medio pixel: drawStart = -lineHeight / 2 + halfH sin redondear en un Uint32Array, que convirtio las paredes de Flash en rejas.",
      excerpt_en:
        "10 zero-shot challenges with zero external assets in Antigravity: 3D Solar System, DNA Helix, Boids, Dungeons, Falling Sand, Wolfenstein Raycaster, Pixel Art, CSS Clock, Fractal Tree, and Spirograph. Includes the forensic autopsy of the half pixel: drawStart = -lineHeight / 2 + halfH left unrounded on a Uint32Array, which turned Flash's walls into jail bars.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "10 - 0 Argon" },
        { label_es: "TIEMPO TOTAL", label_en: "TOTAL TIME", val: "55m vs 94m" },
        { label_es: "APPS FUNCIONALES", label_en: "WORKING APPS", val: "10/10 vs 8/10" },
        { label_es: "CODIGO GENERADO", label_en: "CODE VOLUME", val: "671 KB vs 603 KB" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep01"),
      onOpenArena: () => handleJumpToArena("ep01", 6),
    },
  ];

  const releasedArticles = BLOG_ARTICLES.filter((a) => released[a.id]);
  // Home hero features the most recently released production (never an embargoed one)
  const heroArticle = [...releasedArticles].sort((a, b) =>
    RELEASE_TIMESTAMPS_CST[b.id].localeCompare(RELEASE_TIMESTAMPS_CST[a.id])
  )[0];
  const filteredArticles = releasedArticles.filter(
    (a) => blogFilter === "all" || a.filter === blogFilter
  );

  // Dynamic spoiler-free counters matching only what has been published
  const totalEpisodesCount = releasedArticles.length;
  const totalLabsCount =
    2 + (released.ep03 ? 1 : 0) + (released.ep04 ? 1 : 0) + (released.ep05 ? 1 : 0);
  const totalComunidadCount =
    (released.cc01 ? 1 : 0) + (released.cc02 ? 1 : 0);
  const totalDemosCount =
    21 +
    12 +
    (released.cc01 ? 1 : 0) +
    (released.ep03 ? 12 : 0) +
    (released.ep04 ? 18 : 0) +
    (released.cc02 ? 4 : 0) +
    (released.ep05 ? 20 : 0);
  const totalPromptsCount =
    10 + 6 + (released.ep03 ? 6 : 0) + (released.ep04 ? 6 : 0) + (released.cc02 ? 1 : 0) + (released.ep05 ? 6 : 0);
  // Same size as the forum's thread list (counted on the server, see forumCounts.ts)
  const totalForumThreadsCount = (
    Object.keys(forumCounts.byRelease) as ReleaseKey[]
  ).reduce(
    (sum, key) => sum + (released[key] ? forumCounts.byRelease[key] : 0),
    forumCounts.base
  );

  // Release calendar: same timestamps that gate the content (no hand-typed dates)
  const calendarEvents: PixelCalendarEvent[] = [
    ...(Object.keys(RELEASE_TIMESTAMPS_CST) as ReleaseKey[])
      .filter((key) => released[key])
      .map((key) => ({
        date: RELEASE_TIMESTAMPS_CST[key].slice(0, 10),
        label: lang === "es" ? CALENDAR_LABELS[key].es : CALENDAR_LABELS[key].en,
        tone: CALENDAR_TONES[key],
      })),
    {
      date: PIXEL_UI_RELEASE_DATE,
      label: `Mixiuh Pixel UI v${PIXEL_UI_VERSION}`,
      tone: "yellow" as const,
    },
  ].sort((a, b) => a.date.localeCompare(b.date));

  const pocketConsoleItems: PocketConsoleCartridgeItem[] = [
    ...(released.ep05
      ? [
          {
            id: "ep05",
            code: "EP.05",
            kicker:
              lang === "es"
                ? "TORNEO 3 GIGANTES · 20 SIMULADORES 3D"
                : "3 GIANTS TOURNAMENT · 20 3D DEMOS",
            title:
              lang === "es"
                ? "Argon High vs Opus 5.5 vs GPT-6 Astra (6 Retos + Rescate)"
                : "Argon High vs Opus 5.5 vs GPT-6 Astra (6 Rounds + Rescue)",
            verdict:
              lang === "es"
                ? "ASTRA 3 · ARGON 2 · OPUS 1 (+2 RESCATADOS)"
                : "ASTRA 3 · ARGON 2 · OPUS 1 (+2 RESCUED)",
            timeMetric: "25.8m vs 194.6m vs 42.9m",
            costMetric: "$1.51 vs $32.75 vs $2.74",
            thumb: "/brand/thumbs/ep05/01-impacto-planetario-3d_argon.png",
            accentHex: "#10B981",
            character: "argon" as const,
            onLaunchPrimary: () => navigateToView("dossiers", "ep05"),
            onLaunchSecondary: () => handleJumpToArena("ep05", 1),
            primaryLabel:
              lang === "es"
                ? "ABRIR TORNEO EP05 (20 JUEGOS 3D)"
                : "OPEN EP05 TOURNAMENT (20 3D GAMES)",
            secondaryLabel: "ARENA",
          },
        ]
      : []),
    ...(released.cc02
      ? [
          {
            id: "cc02",
            code: "CC.02",
            kicker:
              lang === "es"
                ? "COMENTARIO AL CODIGO #02 · ROBLOX 3D"
                : "COMMENT TO CODE #02 · 3D ROBLOX",
            title:
              lang === "es"
                ? "Roblox 3D: GPT-6 Astra vs Argon vs Opus 5.5"
                : "3D Roblox: GPT-6 Astra vs Argon vs Opus 5.5",
            verdict:
              lang === "es"
                ? "ASTRA 2 - ARGON 1 - OPUS 0 (+BONUS 60FPS)"
                : "ASTRA 2 - ARGON 1 - OPUS 0 (+60FPS BONUS)",
            timeMetric: "18.9m vs 27.2m vs 55.1m",
            costMetric: "$1.11 vs $0.32 vs $9.91",
            thumb: "/brand/thumbs/cc02_thumb_A.png",
            accentHex: "#10B981",
            character: "argon" as const,
            onLaunchPrimary: () => {
              setComunidadEp("cc02");
              navigateToView("comunidad");
            },
            onLaunchSecondary: () => navigateToView("noticias"),
            primaryLabel:
              lang === "es"
                ? "JUGAR LOS 4 ROBLOX 3D EN VIVO"
                : "PLAY ALL 4 LIVE 3D ROBLOX GAMES",
            secondaryLabel: "CARBON #1",
          },
        ]
      : []),
    ...(released.carbon01
      ? [
          {
            id: "carbon01",
            code: "CARBON",
            kicker:
              lang === "es"
                ? "NOTICIA IA #01 · #1 MUNDIAL"
                : "AI NEWS #01 · #1 WORLD",
            title: `Gemini 4 Carbon: ${CARBON_TERMINAL_BENCH.carbon} Terminal-Bench 4.0`,
            verdict:
              lang === "es"
                ? `DESTRONA A OPUS 5.5 · ${CARBON_TABLE_EVALS} EVALS`
                : `DETHRONES OPUS 5.5 · ${CARBON_TABLE_EVALS} EVALS`,
            timeMetric: "04:19 4K60",
            costMetric: "$4/$20 USD",
            thumb:
              lang === "es"
                ? "/brand/thumbs/carbon_thumb_A.jpg"
                : "/brand/thumbs/carbon_thumb_A_en.jpg",
            accentHex: "#00E5FF",
            character: "carbon" as const,
            onLaunchPrimary: () => navigateToView("noticias"),
            onLaunchSecondary: () => navigateToView("dossiers", "ep04"),
            primaryLabel:
              lang === "es"
                ? `ABRIR ESPECIAL CARBON (VIDEO + ${CARBON_TABLE_EVALS} EVALS)`
                : `OPEN CARBON SPECIAL (VIDEO + ${CARBON_TABLE_EVALS} EVALS)`,
            secondaryLabel: "EP04",
          },
        ]
      : []),
    ...(released.ep04
      ? [
          {
            id: "ep04",
            code: "EP.04",
            kicker:
              lang === "es"
                ? "ESCALERA CLAUDE 5.5 · 18 DEMOS"
                : "CLAUDE 5.5 LADDER · 18 DEMOS",
            title:
              lang === "es"
                ? "Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5"
                : "Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5",
            verdict: "OPUS 3 · SONNET 2 · HAIKU 1",
            timeMetric: "87m/105m/179m",
            costMetric: "$1.54 - $29.94",
            thumb: "/brand/thumbs/ep04_thumb_A.jpg",
            accentHex: EPISODE_ACCENT.ep04,
            character: "opus" as const,
            onLaunchPrimary: () => navigateToView("dossiers", "ep04"),
            onLaunchSecondary: () => handleJumpToArena("ep04", 4),
            primaryLabel:
              lang === "es"
                ? "ABRIR LABORATORIO EP04 (18 DEMOS)"
                : "OPEN LAB EP04 (18 DEMOS)",
            secondaryLabel: "ARENA",
          },
        ]
      : []),
    ...(released.ep03
      ? [
          {
            id: "ep03",
            code: "EP.03",
            kicker: "BENCHMARK AGY CLI · 12 DEMOS",
            title:
              lang === "es"
                ? "Argon High Sin Kit vs Superpowers Kit"
                : "Argon High Raw vs Superpowers Kit",
            verdict:
              lang === "es" ? "SUPERKIT 4 - 2 SIN KIT" : "SUPERKIT 4 - 2 RAW AI",
            timeMetric: "276m vs 302m",
            costMetric: "$10.85 vs $7.69",
            thumb: "/brand/thumbs/ep03_thumb_A.jpg",
            thumbAlt: lang === "en" ? SPANISH_COVER_ALT_EN["/brand/thumbs/ep03_thumb_A.jpg"] : undefined,
            accentHex: "#10B981",
            character: "mixiuh" as const,
            onLaunchPrimary: () => navigateToView("dossiers", "ep03"),
            onLaunchSecondary: () => handleJumpToArena("ep03", 2),
            primaryLabel:
              lang === "es"
                ? "ABRIR LABORATORIO EP03 (12 DEMOS)"
                : "OPEN LAB EP03 (12 DEMOS)",
            secondaryLabel: "ARENA",
          },
        ]
      : []),
    ...(released.cc01
      ? [
          {
            id: "cc01",
            code: "CC.01",
            kicker:
              lang === "es"
                ? "COMENTARIO AL CODIGO · @TENITO03"
                : "COMMENT TO CODE · @TENITO03",
            title: "OVERFIT Studio 3D · 300 GSM Streetwear",
            verdict:
              lang === "es"
                ? "3 MANIQUIES 3D + 10 ARTES 2K"
                : "3 3D MANNEQUINS + 10 2K PRINTS",
            timeMetric: "BLENDER + GLB",
            costMetric: "EXPORT 4K",
            thumb: "/brand/thumbs/cc01_thumb_A.jpg",
            thumbAlt: lang === "en" ? SPANISH_COVER_ALT_EN["/brand/thumbs/cc01_thumb_A.jpg"] : undefined,
            accentHex: "#FFD100",
            character: "flash" as const,
            onLaunchPrimary: () => navigateToView("comunidad"),
            primaryLabel:
              lang === "es"
                ? "ABRIR OVERFIT STUDIO 3D EN VIVO"
                : "OPEN LIVE OVERFIT STUDIO 3D",
          },
        ]
      : []),
    {
      id: "ep02",
      code: "EP.02",
      kicker:
        lang === "es"
          ? "DUELO DE TITANES HIGH · 12 DEMOS"
          : "HIGH TITAN DUEL · 12 DEMOS",
      title: "Gemini 4 Argon vs Claude Opus 5.5",
      verdict: "ARGON 4 - 2 OPUS 5.5",
      timeMetric: "90m vs 159m",
      costMetric: "$6.26 vs $16.26",
      thumb: "/brand/thumbs/ep02_thumb_A_1280.jpg",
      accentHex: "#A855F7",
      character: "argon" as const,
      onLaunchPrimary: () => navigateToView("dossiers", "ep02"),
      onLaunchSecondary: () => handleJumpToArena("ep02", 1),
      primaryLabel:
        lang === "es"
          ? "ABRIR LABORATORIO EP02 (12 MOTORES)"
          : "OPEN LAB EP02 (12 ENGINES)",
      secondaryLabel: "ARENA",
    },
  ];

  const navItems: {
    view: MainView;
    icon: PixelIconName;
    accent: string;
    activeClass: string;
    activeIconHex: string;
    idleClass: string;
    short_es: string;
    short_en: string;
    label_es: string;
    label_en: string;
    count?: number;
    /** Command palette search terms (default: the view id). */
    keywords?: string;
  }[] = [
    {
      view: "blog" as const,
      icon: "home" as const,
      accent: "#FFD100",
      activeClass: "bg-[#FFD100] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#CBD5E1] hover:text-white",
      short_es: "Inicio",
      short_en: "Home",
      label_es: "Inicio",
      label_en: "Home",
      count: totalEpisodesCount,
      show: true,
    },
    {
      view: "dossiers" as const,
      icon: "floppy" as const,
      accent: "#10B981",
      activeClass: "bg-[#10B981] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#CBD5E1] hover:text-white",
      short_es: "Videos/Labs",
      short_en: "Videos/Labs",
      label_es: "Videos / Labs",
      label_en: "Videos / Labs",
      count: totalLabsCount,
      show: true,
    },
    {
      view: "comunidad" as const,
      icon: "sparkles" as const,
      accent: "#FFD100",
      activeClass: "bg-[#FFD100] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#CBD5E1] hover:text-white",
      short_es: "Comunidad",
      short_en: "Community",
      label_es: "Comentario al Codigo",
      label_en: "Comment to Code",
      count: totalComunidadCount,
      show: released.cc01 || released.cc02,
    },
    {
      view: "noticias" as const,
      icon: "broadcast" as const,
      accent: "#00E5FF",
      activeClass: "bg-[#00E5FF] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#00E5FF] hover:text-white",
      short_es: "Noticias IA",
      short_en: "AI News",
      label_es: "Noticias IA",
      label_en: "AI News",
      count: 1,
      keywords: "noticias news radar carbon gemini deepmind especial special",
      show: released.carbon01,
    },
    {
      view: "arena" as const,
      icon: "gamepad" as const,
      accent: "#A855F7",
      activeClass: "bg-[#A855F7] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#CBD5E1] hover:text-white",
      short_es: "Arena",
      short_en: "Arena",
      label_es: "Arena",
      label_en: "Arena",
      count: totalDemosCount,
      show: true,
    },
    {
      view: "pixelui" as const,
      icon: "crt-tv" as const,
      accent: "#FF3355",
      activeClass: "bg-[#FF3355] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#FF3355] hover:text-white",
      short_es: "Pixel UI",
      short_en: "Pixel UI",
      label_es: "Pixel UI Kit",
      label_en: "Pixel UI Kit",
      show: true,
    },
    {
      view: "foro" as const,
      icon: "message" as const,
      accent: "#F5F2EB",
      activeClass: "bg-[#F5F2EB] text-[#090B10]",
      activeIconHex: "#090B10",
      idleClass: "text-[#CBD5E1] hover:text-white",
      short_es: "Foro",
      short_en: "Forum",
      label_es: "Foro",
      label_en: "Forum",
      show: true,
    },
  ].filter((item) => item.show);

  // Ctrl/Cmd+K command palette: every view, episode, demo arena, setting & glossary term
  const es = lang === "es";
  const commandItems: PixelCommandItem[] = paletteOpen
    ? [
        ...navItems.map((item) => ({
          id: `nav-${item.view}`,
          group: es ? "Navegar" : "Navigate",
          label: es ? item.label_es : item.label_en,
          hint: item.count !== undefined ? String(item.count) : undefined,
          icon: item.icon,
          keywords: item.keywords ?? item.view,
          onSelect: () => navigateToView(item.view),
        })),
        {
          id: "nav-glosario",
          group: es ? "Navegar" : "Navigate",
          label: es ? "Glosario Tecnico" : "Technical Glossary",
          hint: `${LAB_GLOSSARY.length} ${es ? "conceptos" : "concepts"}`,
          icon: "book" as const,
          keywords: "glossary diccionario terminos",
          onSelect: () => navigateToView("foro", undefined, "glosario"),
        },
        // The home hero's headline story, findable by name
        ...(released.carbon01
          ? [
              {
                id: "news-carbon01",
                group: es ? "Noticias IA" : "AI News",
                label: es ? "Especial Gemini 4 Carbon" : "Gemini 4 Carbon Special",
                hint: `${CARBON_TABLE_EVALS} evals`,
                icon: "broadcast" as const,
                tone: "cyan" as const,
                keywords:
                  "carbon gemini google deepmind noticias news radar especial special video benchmarks precio price api",
                onSelect: () => navigateToView("noticias"),
              },
            ]
          : []),
        ...(
          [
            { ep: "ep05" as const, label: es ? "EP05 · Torneo de los 3 Gigantes (Argon vs Opus vs Astra)" : "EP05 · 3 Giants Tournament (Argon vs Opus vs Astra)", tone: "emerald" as const, show: released.ep05 },
            { ep: "ep04" as const, label: es ? "EP04 · Escalera Claude 5.5 (Haiku vs Sonnet vs Opus)" : "EP04 · Claude 5.5 Ladder (Haiku vs Sonnet vs Opus)", tone: "cyan" as const, show: released.ep04 },
            { ep: "ep03" as const, label: es ? "EP03 · Argon High Sin Kit vs Superpowers Kit" : "EP03 · Argon High Raw vs Superpowers Kit", tone: "emerald" as const, show: released.ep03 },
            { ep: "ep02" as const, label: "EP02 · Gemini 4 Argon vs Claude Opus 5.5", tone: "violet" as const, show: released.ep02 },
            { ep: "ep01" as const, label: "EP01 · Gemini 4 Argon vs Gemini 3.8 Flash", tone: "yellow" as const, show: released.ep01 },
          ].filter((e) => e.show)
        ).flatMap((e) => [
          {
            id: `dossier-${e.ep}`,
            group: es ? "Episodios" : "Episodes",
            label: `${es ? "Dossier" : "Dossier"} ${e.label}`,
            icon: "floppy" as const,
            tone: e.tone,
            keywords: "laboratorio lab video benchmark",
            onSelect: () => navigateToView("dossiers", e.ep),
          },
          {
            id: `arena-${e.ep}`,
            group: es ? "Episodios" : "Episodes",
            label: `${es ? "Jugar demos" : "Play demos"} ${e.label.split(" · ")[0]}`,
            hint: "Arena",
            icon: "gamepad" as const,
            tone: e.tone,
            keywords: "arena demos simuladores play",
            onSelect: () =>
              handleJumpToArena(e.ep, e.ep === "ep05" ? 1 : e.ep === "ep04" ? 4 : e.ep === "ep03" ? 2 : e.ep === "ep02" ? 1 : 6),
          },
        ]),
        {
          id: "set-sfx",
          group: es ? "Ajustes" : "Settings",
          label: es
            ? `Sonido 8-bit: ${sfxEnabled ? "apagar" : "encender"}`
            : `8-bit sound: turn ${sfxEnabled ? "off" : "on"}`,
          hint: sfxEnabled ? "ON" : "OFF",
          icon: sfxEnabled ? ("volume-off" as const) : ("volume-on" as const),
          keywords: "sfx audio mute sonido",
          onSelect: () => toggleSfx(),
        },
        {
          id: "set-cursor",
          group: es ? "Ajustes" : "Settings",
          label: es ? "Cambiar cursor pixel-art" : "Switch pixel-art cursor",
          hint: cursorLabel(cursorStyle),
          icon: "mouse" as const,
          keywords: "cursor puntero mouse",
          onSelect: cycleCursorStyle,
        },
        {
          id: "set-ambient",
          group: es ? "Ajustes" : "Settings",
          label: es ? "Cambiar fondo IA procedural" : "Switch procedural AI background",
          hint: ambientLabel(ambientMode),
          icon: "brain-ai" as const,
          keywords: "fondo background ambient animacion",
          onSelect: cycleAmbientMode,
        },
        {
          id: "set-lang",
          group: es ? "Ajustes" : "Settings",
          label: es ? "Switch to English" : "Cambiar a Espanol",
          hint: es ? "EN" : "ES",
          icon: "globe" as const,
          keywords: "idioma language english espanol",
          onSelect: () => setLang(es ? "en" : "es"),
        },
        {
          id: "link-kit",
          group: es ? "Enlaces" : "Links",
          label: es
            ? `Descargar Mixiuh Pixel UI v${PIXEL_UI_VERSION} (.zip)`
            : `Download Mixiuh Pixel UI v${PIXEL_UI_VERSION} (.zip)`,
          icon: "download" as const,
          tone: "coral" as const,
          keywords: "kit libreria library zip descargar",
          onSelect: () => window.location.assign("/pixel-ui/mixiuh-pixel-ui-kit.zip"),
        },
        {
          id: "link-yt",
          group: es ? "Enlaces" : "Links",
          label: es ? "Canal de YouTube" : "YouTube channel",
          hint: es ? "ES" : "EN",
          icon: "youtube" as const,
          tone: "coral" as const,
          onSelect: () =>
            window.open(
              es ? YOUTUBE_LINKS.channel_es : YOUTUBE_LINKS.channel_en,
              "_blank",
              "noopener,noreferrer"
            ),
        },
        {
          id: "link-x",
          group: es ? "Enlaces" : "Links",
          label: "X @MixiuhLabs",
          icon: "x" as const,
          tone: "chalk" as const,
          keywords: "twitter",
          onSelect: () =>
            window.open("https://x.com/MixiuhLabs", "_blank", "noopener,noreferrer"),
        },
        ...LAB_GLOSSARY.map((g) => ({
          id: `term-${g.term}`,
          group: es ? "Glosario" : "Glossary",
          label: glossaryTerm(g),
          hint: glossaryPlain(g),
          icon: "book" as const,
          tone: "emerald" as const,
          // Both languages stay searchable whichever one is shown
          keywords: [g.term, g.term_en, g.plain_es, g.plain_en]
            .filter(Boolean)
            .join(" "),
          onSelect: () => openGlossaryTerm(glossaryTerm(g)),
        })),
      ]
    : [];

  return (
    <div className="min-h-screen labs-grid-bg text-[#F5F2EB] flex flex-col relative overflow-x-clip">
      {/* PROCEDURAL PIXEL-ART AI ECOSYSTEM BACKGROUND (Strictly z-0 underneath all opaque components) */}
      <PixelProceduralAmbientBg mode={ambientMode} opacity={0.34} />

      {/* PROCEDURAL PIXEL-BY-PIXEL SCROLL CARD MATERIALIZER */}
      <PixelScrollMaterializer
        watchKey={`${mainView}-${dossierEp}-${blogFilter}-${arenaMode}-${foroSubTab}`}
        selector='[data-px-reveal], .px-card, .px-card-yellow, .px-card-cyan, .px-card-emerald, .px-card-coral, .px-card-violet, .px-card-chalk, article, main [class*="shadow-[6px_6px_0_#040508]"]'
      />

      {/* FOREGROUND OPAQUE LAYER (Strictly z-10 above background canvas) */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        <a
          href="#contenido"
          className="px-skip-link"
          onClick={(e) => {
            // Move focus without rewriting the shareable view hash
            e.preventDefault();
            const target = document.getElementById("contenido");
            target?.focus();
            target?.scrollIntoView();
          }}
        >
          {lang === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>

        {/* FULL-WIDTH OPAQUE PIXEL-ART HEADER: one data-driven nav for desktop + mobile */}
        <header
          ref={headerRef}
          className="sticky top-0 z-50 bg-[#090B10] border-b-3 border-[#FFD100] shadow-[0_4px_0_#040508] w-full"
        >
          {/* Below 360px the padding, gaps and wordmark tighten so the whole
              control group (EN included) fits down to 320px */}
          <div className="w-full px-2 max-[360px]:px-1.5 sm:px-3 lg:px-4">
            <div className="h-14 flex items-center justify-between gap-2 max-[360px]:gap-1 flex-nowrap">
              {/* Left: Clean Mixiuh Labs Brand Logo */}
              <a
                {...viewLink("blog")}
                aria-label={lang === "es" ? "Mixiuh Labs, inicio" : "Mixiuh Labs, home"}
                className="flex items-center gap-2 max-[360px]:gap-1.5 shrink-0 group cursor-pointer text-left"
              >
                <div className="p-1 bg-[#FFD100] border-2 border-[#090B10] shadow-[2px_2px_0_#00E5FF]">
                  <img
                    src="/brand/logos/mixiuh-labs_mark_dark.svg"
                    alt=""
                    className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
                  />
                </div>
                <span className="font-pixel text-xs max-[360px]:text-[10px] sm:text-sm font-bold tracking-wider max-[360px]:tracking-normal text-white whitespace-nowrap lg:hidden xl:inline">
                  MIXIUH <span className="text-[#FFD100]">LABS</span>
                </span>
              </a>

              {/* Center: desktop tab bar (icons from xl, counters from 2xl) */}
              <nav
                aria-label={lang === "es" ? "Secciones" : "Sections"}
                className="hidden lg:flex min-w-0 flex-nowrap items-center gap-1 bg-[#111622] p-1 border-2 border-[#2A344B] font-mono-hud text-[11px] xl:text-xs mx-auto overflow-x-auto"
              >
                {navItems.map((item) => {
                  const active = mainView === item.view;
                  return (
                    <a
                      key={item.view}
                      {...viewLink(item.view)}
                      aria-current={active ? "page" : undefined}
                      title={lang === "es" ? item.label_es : item.label_en}
                      className={`shrink-0 px-1.5 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                        active
                          ? `${item.activeClass} border-[#090B10]`
                          : `${item.idleClass} border-transparent hover:bg-[#1A2132]`
                      }`}
                    >
                      <PixelIcon
                        name={item.icon}
                        size={12}
                        color={active ? item.activeIconHex : item.accent}
                      />
                      <span>{lang === "es" ? item.short_es : item.short_en}</span>
                      {item.count !== undefined && (
                        <span className="hidden 2xl:inline">({item.count})</span>
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Right: compact icon-only hardware & social controls */}
              <div className="flex items-center gap-1 shrink-0">
                <PixelTooltip placement="bottom" content={lang === "es" ? "Buscar en todo el sitio (Ctrl+K)" : "Search the whole site (Ctrl+K)"}>
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  aria-label={
                    lang === "es"
                      ? "Buscar y abrir comandos, Ctrl+K"
                      : "Search & run commands, Ctrl+K"
                  }
                  className="inline-flex min-h-8 min-w-8 justify-center px-2 py-1 bg-[#111622] hover:bg-[#FFD100] hover:text-[#090B10] text-[#FFD100] border-2 border-[#090B10] font-pixel text-[10px] font-bold items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#040508]"
                >
                  <PixelIcon name="search" size={12} />
                  {/* The name above must contain the keycaps' text, outside
                      parentheses (WCAG 2.5.3). The space keeps it "Ctrl K",
                      not "CtrlK"; the flex row does not render it */}
                  <span className="hidden xl:inline-flex items-center gap-0.5">
                    <kbd className="px-kbd">Ctrl</kbd>{" "}
                    <kbd className="px-kbd">K</kbd>
                  </span>
                </button>
                </PixelTooltip>

                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setSettingsOpen(true);
                  }}
                  aria-label={lang === "es" ? "Ajustes y redes" : "Settings & links"}
                  aria-haspopup="dialog"
                  className="sm:hidden inline-flex min-h-8 min-w-8 justify-center items-center px-2 py-1 bg-[#111622] text-[#10B981] border-2 border-[#090B10] cursor-pointer shadow-[2px_2px_0_#040508]"
                >
                  <PixelIcon name="settings" size={12} />
                </button>

                {/* Phones reach these from the settings drawer: their tooltip
                    wrappers hide with them, so they leave no gap in the row */}
                <PixelTooltip placement="bottom" className="hidden sm:inline-flex" content={lang === "es" ? `Cursor: ${cursorLabel(cursorStyle)}` : `Cursor: ${cursorLabel(cursorStyle)}`}>
                <button
                  type="button"
                  onClick={cycleCursorStyle}
                  aria-label={
                    lang === "es"
                      ? `Cambiar cursor pixel-art (actual: ${cursorLabel(cursorStyle)})`
                      : `Switch pixel-art cursor (current: ${cursorLabel(cursorStyle)})`
                  }
                  className="hidden sm:inline-flex min-h-8 min-w-8 justify-center px-2 py-1 bg-[#111622] hover:bg-[#00E5FF] hover:text-[#090B10] text-[#00E5FF] border-2 border-[#090B10] items-center cursor-pointer shadow-[2px_2px_0_#040508]"
                >
                  <PixelIcon name="mouse" size={12} />
                </button>
                </PixelTooltip>

                <PixelTooltip placement="bottom" className="hidden sm:inline-flex" content={`${lang === "es" ? "Fondo IA" : "AI background"}: ${ambientLabel(ambientMode)}`}>
                <button
                  type="button"
                  onClick={cycleAmbientMode}
                  aria-label={
                    lang === "es"
                      ? `Cambiar ecosistema IA de fondo (actual: ${ambientLabel(ambientMode)})`
                      : `Switch background AI ecosystem (current: ${ambientLabel(ambientMode)})`
                  }
                  aria-pressed={ambientMode !== "off"}
                  className={`hidden sm:inline-flex min-h-8 min-w-8 justify-center px-2 py-1 border-2 border-[#090B10] items-center cursor-pointer shadow-[2px_2px_0_#040508] ${
                    ambientMode !== "off"
                      ? "bg-[#10B981] text-[#090B10]"
                      : "bg-[#111622] text-[#94A3B8]"
                  }`}
                >
                  <PixelIcon name="brain-ai" size={12} />
                </button>
                </PixelTooltip>

                <PixelTooltip placement="bottom" content={sfxEnabled ? (lang === "es" ? "Sonido 8-bit: activado" : "8-bit sound: on") : (lang === "es" ? "Sonido 8-bit: silenciado" : "8-bit sound: muted")}>
                <button
                  type="button"
                  onClick={toggleSfx}
                  aria-label={
                    lang === "es"
                      ? "Activar/Desactivar sonidos 8-Bit WebAudio"
                      : "Toggle 8-Bit WebAudio SFX"
                  }
                  aria-pressed={sfxEnabled}
                  className={`min-h-8 min-w-8 justify-center px-2 py-1 border-2 border-[#090B10] flex items-center cursor-pointer shadow-[2px_2px_0_#040508] ${
                    sfxEnabled
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#94A3B8]"
                  }`}
                >
                  <PixelIcon
                    name={sfxEnabled ? "volume-on" : "volume-off"}
                    size={12}
                  />
                </button>
                </PixelTooltip>

                <div
                  role="group"
                  aria-label={lang === "es" ? "Idioma" : "Language"}
                  data-lang-switch=""
                  className="inline-flex bg-[#111622] p-0.5 border-2 border-[#2A344B]"
                >
                  {(["es", "en"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      aria-pressed={lang === code}
                      onClick={() => {
                        playSfx("click");
                        setLang(code);
                      }}
                      className={`min-h-7 min-w-7 px-1.5 py-0.5 font-pixel text-[10px] font-bold transition cursor-pointer ${
                        lang === code
                          ? "bg-[#FFD100] text-[#090B10]"
                          : "text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>

                <PixelTooltip placement="bottom" className="hidden sm:inline-flex" content={"X @MixiuhLabs"}>
                <a
                  href="https://x.com/MixiuhLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("coin")}
                  aria-label="X @MixiuhLabs"
                  className="hidden sm:inline-flex min-h-8 min-w-8 justify-center items-center px-2 py-1 bg-[#F5F2EB] text-[#090B10] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] hover:bg-[#00E5FF] transition"
                >
                  <PixelIcon name="x" size={12} color="#090B10" />
                </a>
                </PixelTooltip>

                <PixelTooltip placement="bottom" className="hidden sm:inline-flex" content={"YouTube Mixiuh Labs"}>
                <a
                  href={
                    lang === "es"
                      ? YOUTUBE_LINKS.channel_es
                      : YOUTUBE_LINKS.channel_en
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("coin")}
                  aria-label="YouTube Mixiuh Labs"
                  className="hidden sm:inline-flex min-h-8 min-w-8 justify-center items-center px-2 py-1 bg-[#FF3355] text-[#090B10] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] hover:brightness-110 transition"
                >
                  <PixelIcon name="youtube" size={12} color="#FFFFFF" />
                </a>
                </PixelTooltip>
              </div>
            </div>

            {/* Mobile / tablet scrollable tab strip (same data as desktop) */}
            <nav
              ref={mobileNavRef}
              aria-label={lang === "es" ? "Secciones" : "Sections"}
              // Chromium leaves a half-visible focused tab where it is: reveal it
              onFocus={(e) => {
                if (e.target !== e.currentTarget) {
                  e.target.scrollIntoView({ block: "nearest", inline: "nearest" });
                }
              }}
              className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 font-mono-hud text-[11px] whitespace-nowrap"
            >
              {navItems.map((item) => {
                const active = mainView === item.view;
                return (
                  <a
                    key={item.view}
                    {...viewLink(item.view)}
                    aria-current={active ? "page" : undefined}
                    data-mobile-tab-active={active ? "true" : undefined}
                    className={`shrink-0 px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer inline-flex items-center gap-1.5 ${
                      active ? item.activeClass : "bg-[#111622] text-[#94A3B8]"
                    }`}
                  >
                    <PixelIcon
                      name={item.icon}
                      size={11}
                      color={active ? item.activeIconHex : item.accent}
                    />
                    <span>{lang === "es" ? item.label_es : item.label_en}</span>
                    {item.count !== undefined && <span>({item.count})</span>}
                  </a>
                );
              })}
            </nav>
          </div>
        </header>

      {/* =====================================================================
          VIEW 1: PLAYDATE FLAT MINIMALIST + 3D CONSOLE PORTAL PRINCIPAL
         ===================================================================== */}
      {mainView === "blog" && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* PLAYDATE HERO: FLAT MINIMALIST LEFT + FLOATING 3D POCKET CONSOLE RIGHT */}
            <div className="bg-[#111622] border-3 border-[#FFD100] shadow-[8px_8px_0_#040508] overflow-hidden">
              {/* Top Signal Yellow Hardware Banner Strip */}
              <div className="px-5 py-2.5 bg-[#FFD100] text-[#090B10] border-b-3 border-[#090B10] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs font-bold">
                <div className="flex items-center gap-2">
                  <PixelIcon name="console" size={15} color="#090B10" />
                  <span className="font-pixel text-[11px] tracking-wider">
                    {lang === "es"
                      ? "MIXIUH LABS // AQUI NO SE OPINA: SE PRUEBA."
                      : "MIXIUH LABS // HERE WE DON'T GUESS: WE TEST."}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 bg-[#090B10] text-[#FFD100] font-pixel text-[10px]">
                    {`${totalEpisodesCount} ${lang === "es" ? "PRODUCCIONES 4K60" : "4K60 PRODUCTIONS"}`}
                  </span>
                  <span className="px-2 py-0.5 bg-[#090B10] text-[#00E5FF] font-pixel text-[10px]">
                    {`${totalDemosCount} ${lang === "es" ? "MOTORES EN VIVO" : "LIVE ENGINES"}`}
                  </span>
                </div>
              </div>

              {/* Main 2-Column Playdate Flat + 3D Stage */}
              <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: editorial protagonist = latest released production */}
                <div className="lg:col-span-7 space-y-5">
                  {heroArticle?.id === "carbon01" ? (
                    <>
                    <div className="inline-flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-[#00E5FF] text-[#090B10] border-2 border-[#090B10] font-pixel text-[10px] font-bold">
                        {lang === "es"
                          ? "ULTIMA HORA · RADAR MIXIUH NOTICIAS IA #01"
                          : "BREAKING · MIXIUH AI NEWS RADAR #01"}
                      </span>
                      <span className="px-2.5 py-1 bg-[#090B10] text-[#10B981] border border-[#10B981] font-mono-hud text-xs font-bold inline-flex items-center gap-1.5">
                        <PixelIcon name="trophy" size={12} color="#10B981" />
                        <span>{`${CARBON_TABLE_EVALS} EVALS DEEPMIND`}</span>
                      </span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.06] px-extrude-title">
                      {lang === "es" ? (
                        <>
                          Google Anuncia{" "}
                          <span className="text-[#00E5FF]">Gemini 4 Carbon</span>:
                          El Nuevo{" "}
                          <span className="text-[#FFD100]">#1 Mundial</span> y el
                          Salto a{" "}
                          <span className="text-[#FF3355]">$4/$20 USD</span>
                        </>
                      ) : (
                        <>
                          Google Unveils{" "}
                          <span className="text-[#00E5FF]">Gemini 4 Carbon</span>:
                          The New{" "}
                          <span className="text-[#FFD100]">#1 Worldwide</span> &
                          the <span className="text-[#FF3355]">$4/$20 USD</span>{" "}
                          Jump
                        </>
                      )}
                    </h1>

                    <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                      {lang === "es"
                        ? `A solo 14 dias de lanzar Argon, Google DeepMind publica Gemini 4 Carbon. Desglosamos los 8 capitulos del reporte en 4K60: como destrona a Claude Opus 5.5 en Terminal-Bench 4.0 (${CARBON_TERMINAL_BENCH.carbon} vs ${CARBON_TERMINAL_BENCH.opus55}), su dominio en ciberseguridad defensiva (${CARBON_SEC_BENCH.carbon} en SEC-bench Pro) y por que duplicar la tarifa API ($4/$20 USD) sigue costando 20% menos que Opus ($5/$25).`
                        : `Just 14 days after launching Argon, Google DeepMind releases Gemini 4 Carbon. We break down all 8 chapters in 4K60: how it dethrones Claude Opus 5.5 on Terminal-Bench 4.0 (${CARBON_TERMINAL_BENCH.carbon} vs ${CARBON_TERMINAL_BENCH.opus55}), sweeps defensive cybersecurity (${CARBON_SEC_BENCH.carbon} on SEC-bench Pro), and why doubling the API rate ($4/$20 USD) still costs 20% less than Opus ($5/$25).`}
                    </p>

                    {/* Standard Mixiuh Telemetry Strip ([CLOCK + MIN] & [COIN + $ USD]) */}
                    <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                      <span className="px-3 py-1.5 bg-[#090B10] border-2 border-[#00E5FF] text-[#F5F2EB] font-bold inline-flex items-center gap-1.5">
                        <PixelIcon name="clock" size={13} color="#00E5FF" />
                        <span>{`TERMINAL-BENCH 4.0: ${carbonScore(CARBON_TERMINAL_BENCH)}`}</span>
                      </span>
                      <span className="px-3 py-1.5 bg-[#090B10] border-2 border-[#FFD100] text-[#FFD100] font-bold inline-flex items-center gap-1.5">
                        <PixelIcon name="coin" size={13} color="#FFD100" />
                        <span>API: $4 / $20 USD (-20% VS OPUS)</span>
                      </span>
                      <span className="px-3 py-1.5 bg-[#090B10] border-2 border-[#10B981] text-[#10B981] font-bold inline-flex items-center gap-1.5">
                        <PixelIcon name="shield" size={13} color="#10B981" />
                        <span>{`SEC-BENCH PRO: ${carbonScore(CARBON_SEC_BENCH)}`}</span>
                      </span>
                    </div>

                    {/* Tactile Hardware Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => navigateToView("noticias")}
                        className="px-btn bg-[#FFD100] text-[#090B10] px-5 py-3 text-xs sm:text-sm"
                      >
                        <PixelIcon name="play" size={15} color="#090B10" />
                        <span>
                          {lang === "es"
                            ? "Ver Video + Especial Gemini 4 Carbon"
                            : "Watch Video + Gemini 4 Carbon Special"}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateToView("dossiers", "ep04")}
                        className="px-btn bg-[#00E5FF] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                      >
                        <PixelIcon name="cartridge" size={15} color="#090B10" />
                        <span>
                          {lang === "es"
                            ? "Laboratorio EP04: Escalera Claude 5.5"
                            : "Lab EP04: Claude 5.5 Ladder"}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateToView("pixelui")}
                        className="px-btn bg-[#F5F2EB] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                      >
                        <PixelIcon name="console" size={15} color="#090B10" />
                        <span>
                          {lang === "es"
                            ? "Mixiuh Pixel UI (Gratis)"
                            : "Mixiuh Pixel UI (Free)"}
                        </span>
                      </button>
                    </div>
                    </>
                  ) : heroArticle ? (
                    <>
                      <div className="inline-flex flex-wrap items-center gap-2">
                        <span
                          className="px-3 py-1 text-[#090B10] border-2 border-[#090B10] font-pixel text-[10px] font-bold"
                          style={{ backgroundColor: heroArticle.accentColor }}
                        >
                          {lang === "es" ? heroArticle.badge_es : heroArticle.badge_en}
                        </span>
                        <span className="px-2.5 py-1 bg-[#090B10] text-[#FFD100] border border-[#FFD100] font-mono-hud text-xs font-bold inline-flex items-center gap-1.5">
                          <PixelIcon name="trophy" size={12} color="#FFD100" />
                          <span>
                            {lang === "es"
                              ? heroArticle.scoreBadge_es
                              : heroArticle.scoreBadge_en}
                          </span>
                        </span>
                      </div>

                      <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.06] px-extrude-title">
                        {lang === "es" ? heroArticle.title_es : heroArticle.title_en}
                      </h1>

                      <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                        {lang === "es" ? heroArticle.excerpt_es : heroArticle.excerpt_en}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                        {heroArticle.metrics.slice(0, 3).map((m, idx) => (
                          <span
                            key={m.label_es}
                            className="px-3 py-1.5 bg-[#090B10] border-2 font-bold inline-flex items-center gap-1.5 text-[#F5F2EB]"
                            style={{
                              borderColor: idx === 0 ? heroArticle.accentColor : "#2A344B",
                            }}
                          >
                            <span className="text-[#94A3B8]">
                              {lang === "es" ? m.label_es : m.label_en}:
                            </span>
                            <span>{lang === "es" ? m.val : (m.val_en ?? m.val)}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          onClick={heroArticle.onOpenDossier}
                          className="px-btn text-[#090B10] px-5 py-3 text-xs sm:text-sm"
                          style={{ backgroundColor: heroArticle.accentColor }}
                        >
                          <PixelIcon name="play" size={15} color="#090B10" />
                          <span>{lang === "es" ? "Abrir Produccion" : "Open Production"}</span>
                        </button>
                        <button
                          onClick={heroArticle.onOpenArena}
                          className="px-btn bg-[#131824] text-[#F5F2EB] px-4 py-3 text-xs sm:text-sm"
                        >
                          <PixelIcon name="gamepad" size={15} />
                          <span>{lang === "es" ? "Probar Demos" : "Play Demos"}</span>
                        </button>
                        <button
                          onClick={() => navigateToView("pixelui")}
                          className="px-btn bg-[#F5F2EB] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                        >
                          <PixelIcon name="console" size={15} color="#090B10" />
                          <span>
                            {lang === "es"
                              ? "Mixiuh Pixel UI (Gratis)"
                              : "Mixiuh Pixel UI (Free)"}
                          </span>
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Right Column: Interactive 3D Retro CRT Monitor Workstation */}
                <div className="lg:col-span-5">
                  <Pixel3DCRTWorkstation
                    items={pocketConsoleItems}
                    lang={lang}
                  />
                </div>
              </div>
            </div>

            {/* OFFICIAL SOCIAL MEDIA & COMMUNITY REDIRECT HUB IN PIXEL-ART */}
            <div
              data-px-reveal="true"
              className="bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] p-4 sm:p-5 space-y-3"
              style={{ outline: "2px solid #2A344B" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-pixel text-[10px] font-bold text-[#FFD100]">
                  <PixelIcon name="share" size={14} color="#FFD100" />
                  <span>
                    {lang === "es"
                      ? "REDES OFICIALES Y COMUNIDAD MIXIUH LABS (YOUTUBE · INSTAGRAM · TIKTOK · X · GITHUB)"
                      : "OFFICIAL MIXIUH LABS SOCIAL CHANNELS & COMMUNITY"}
                  </span>
                </div>
                <span className="font-mono-hud text-[11px] text-[#94A3B8]">
                  @MixiuhLabs · @labs.mixiuh · labs.mixiuh.online
                </span>
              </div>
              <PixelSocialBar />
            </div>

            {/* 4-PILLAR FLAT PLAYDATE SPEC DIRECTORY BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pillar 1: Videos / Laboratorios */}
              <a
                {...viewLink("dossiers", "ep05")}
                className="px-card-emerald px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#10B981] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>01 // VIDEOS & LABS</span>
                    <span>EP01-EP05</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "Benchmarks Empiricos y Duelos Zero-Shot"
                        : "Empirical Benchmarks & Zero-Shot Duels"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? "5 episodios completos y 83 simuladores: Torneo 3 Gigantes (EP05), Escalera Claude 5.5 (EP04), Superpowers Kit (EP03), Argon vs Opus 5.5 (EP02) y Argon vs 3.8 Flash (EP01)."
                        : "5 full episodes and 83 simulators: 3 Giants Tournament (EP05), Claude 5.5 Ladder (EP04), Superpowers Kit (EP03), Argon vs Opus 5.5 (EP02), and Argon vs 3.8 Flash (EP01)."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#10B981] font-bold">
                    {lang === "es" ? "Abrir Dossiers →" : "Open Dossiers →"}
                  </span>
                  <PixelIcon name="cartridge" size={14} color="#10B981" />
                </div>
              </a>

              {/* Pillar 2: Del Comentario al Codigo */}
              <a
                {...viewLink("comunidad")}
                className="px-card-yellow px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#FFD100] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>
                      {lang === "es"
                        ? "02 // COMENTARIO AL CODIGO"
                        : "02 // COMMENT TO CODE"}
                    </span>
                    <span>CC02 + CC01</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "ROBLOX 3D (3 Gigantes + Bonus) & OVERFIT 3D"
                        : "3D ROBLOX (3 Giants + Bonus) & OVERFIT 3D"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? "Duelo Roblox 3D en modo HIGH (GPT-6 Astra vs Argon vs Opus 5.5 + Bonus) y estudio 300 GSM en Blender Cycles."
                        : "HIGH mode 3D Roblox showdown (GPT-6 Astra vs Argon vs Opus 5.5 + Bonus) & 300 GSM Blender Cycles studio."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#FFD100] font-bold">
                    {lang === "es"
                      ? "Jugar Roblox 3D + Estudio →"
                      : "Play 3D Roblox + Studio →"}
                  </span>
                  <PixelIcon name="sparkles" size={14} color="#FFD100" />
                </div>
              </a>

              {/* Pillar 3: Radar Mixiuh Noticias IA */}
              <a
                {...viewLink("noticias")}
                className="px-card-cyan px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#00E5FF] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>
                      {lang === "es"
                        ? "03 // NOTICIAS IA · RADAR"
                        : "03 // AI NEWS · RADAR"}
                    </span>
                    <span>CARBON #1</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? `Especial #01: Gemini 4 Carbon (${CARBON_TABLE_EVALS} Evals)`
                        : `Special #01: Gemini 4 Carbon (${CARBON_TABLE_EVALS} Evals)`}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? `Video 4K60, Short vertical, tabla interactiva de las ${CARBON_SITE_EVALS} evaluaciones oficiales y comparativa de costos API.`
                        : `4K60 video, vertical Short, interactive table of all ${CARBON_SITE_EVALS} official benchmarks, and API cost breakdown.`}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#00E5FF] font-bold">
                    {lang === "es" ? "Abrir Noticias IA →" : "Open AI News →"}
                  </span>
                  <PixelIcon name="broadcast" size={14} color="#00E5FF" />
                </div>
              </a>

              {/* Pillar 4: Mixiuh Pixel UI Open Source Library */}
              <a
                {...viewLink("pixelui")}
                className="px-card-coral px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#FF3355] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>{`04 // PIXEL UI KIT v${PIXEL_UI_VERSION}`}</span>
                    <span>OPEN SOURCE</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "Libreria Pixel-Art + 3D + Audio (Gratis)"
                        : "Pixel-Art + 3D + Audio UI Library (Free)"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? `+45 componentes, ${ALL_PIXEL_ICON_NAMES.length} iconos 16x16, graficas, consolas 3D, paleta de comandos y sintetizador WebAudio 8-bit. Libre para uso comercial con credito.`
                        : `45+ components, ${ALL_PIXEL_ICON_NAMES.length} 16x16 icons, charts, 3D consoles, a command palette & WebAudio 8-bit synth. Free for commercial use with credit.`}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#FF3355] font-bold">
                    {lang === "es"
                      ? "Probar y Descargar UI Kit →"
                      : "Test & Download UI Kit →"}
                  </span>
                  <PixelIcon name="download" size={14} color="#FF3355" />
                </div>
              </a>
            </div>

            {/* CATALOGO DE EPISODIOS EN CARTUCHOS / SPEC CARDS PLAYDATE */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#2A344B] pb-4">
                <div>
                  <div className="font-pixel text-xs font-bold text-[#FFD100] uppercase mb-1">
                    {lang === "es"
                      ? "CATALOGO DE PRODUCCIONES Y CARTUCHOS DE LABORATORIO"
                      : "PRODUCTION CATALOG & LAB CARTRIDGE ARCHIVE"}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {lang === "es"
                      ? "Videos / Laboratorios, Del Comentario al Codigo y Noticias IA"
                      : "Videos / Labs, Comment to Code & AI News"}
                  </h2>
                </div>

                {/* Playdate Tactile Filter Tabs */}
                <PixelTabs
                  ariaLabel={lang === "es" ? "Filtrar producciones" : "Filter productions"}
                  value={blogFilter}
                  onChange={setBlogFilter}
                  wrap
                  items={[
                    {
                      id: "all" as const,
                      label: lang === "es" ? "Todos" : "All",
                      badge: totalEpisodesCount,
                    },
                    {
                      id: "laboratorios" as const,
                      label: "Videos / Labs",
                      badge: totalLabsCount,
                    },
                    ...(released.cc01 || released.cc02
                      ? [
                          {
                            id: "comunidad" as const,
                            label: lang === "es" ? "Comentario al Codigo" : "Comment to Code",
                            badge: totalComunidadCount,
                          },
                        ]
                      : []),
                    ...(released.carbon01
                      ? [
                          {
                            id: "noticias" as const,
                            label: lang === "es" ? "Noticias IA" : "AI News",
                            badge: 1,
                          },
                        ]
                      : []),
                  ]}
                />
              </div>

              {/* 2-Column Playdate Spec + 3D Cartridge Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className="bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] flex flex-col justify-between transition hover:-translate-y-1"
                    style={{ outline: `2px solid ${art.accentColor}` }}
                  >
                    <div>
                      {/* Top Cartridge Header Strip */}
                      <div
                        className="px-4 py-2 border-b-2 border-[#090B10] flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-pixel text-[10px] font-bold text-[#090B10]"
                        style={{ backgroundColor: art.accentColor }}
                      >
                        <span className="min-w-0 break-words">
                          {lang === "es" ? art.badge_es : art.badge_en}
                        </span>
                        <span className="px-2 py-0.5 bg-[#090B10] text-[#FFD100] shrink-0">
                          {lang === "es"
                            ? art.scoreBadge_es
                            : art.scoreBadge_en}
                        </span>
                      </div>

                      {/* 4K Thumbnail Protagonist */}
                      <div
                        onClick={art.onOpenDossier}
                        className="relative aspect-video bg-[#090B10] border-b-2 border-[#090B10] overflow-hidden cursor-pointer group"
                      >
                        {/* Below the fold: lazy also keeps it out of the <head> preloads React adds for eager images */}
                        <img
                          src={lang === "es" ? art.thumb : (art.thumb_en ?? art.thumb)}
                          alt={
                            lang === "es"
                              ? art.title_es
                              : (SPANISH_COVER_ALT_EN[art.thumb] ?? art.title_en)
                          }
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono-hud text-[11px]">
                          <span className="px-2.5 py-1 bg-[#090B10] border border-[#3A4560] text-[#F5F2EB] font-bold">
                            {art.date}
                          </span>
                          <span className="px-2.5 py-1 bg-[#090B10] border border-[#FFD100] text-[#FFD100] font-bold">
                            {lang === "es" ? art.readTime_es : art.readTime_en}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <h3
                          onClick={art.onOpenDossier}
                          className="font-display text-xl sm:text-2xl font-black text-white leading-snug hover:text-[#FFD100] transition cursor-pointer"
                        >
                          {lang === "es" ? art.title_es : art.title_en}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                          {lang === "es" ? art.excerpt_es : art.excerpt_en}
                        </p>

                        {/* 4 Mini Telemetry Blocks */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {art.metrics.map((m, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-[#090B10] border border-[#2A344B]"
                            >
                              <div className="font-mono-hud text-[10px] text-[#94A3B8]">
                                {lang === "es" ? m.label_es : m.label_en}
                              </div>
                              <div
                                className="font-mono-hud text-xs font-bold mt-0.5 truncate"
                                style={{
                                  color:
                                    idx === 0 ? art.accentColor : "#F5F2EB",
                                }}
                              >
                                {lang === "es" ? m.val : (m.val_en ?? m.val)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Hardware Buttons */}
                    <div className="px-5 py-3.5 bg-[#090B10] border-t-2 border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={art.onOpenDossier}
                        className="px-btn px-4 py-2 text-xs text-[#090B10]"
                        style={{ backgroundColor: art.accentColor }}
                      >
                        <PixelIcon name="play" size={13} color="#090B10" />
                        <span>
                          {art.filter === "noticias"
                            ? lang === "es"
                              ? "Abrir Noticia + Video"
                              : "Open News + Video"
                            : art.id === "cc02"
                            ? lang === "es"
                              ? "Jugar ROBLOX 3D (4 Demos)"
                              : "Play 3D ROBLOX (4 Demos)"
                            : art.filter === "comunidad"
                            ? lang === "es"
                              ? "Abrir OVERFIT Studio 3D"
                              : "Open OVERFIT Studio 3D"
                            : lang === "es"
                            ? "Abrir Laboratorio"
                            : "Open Lab Dossier"}
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={art.onOpenArena}
                          className="px-btn bg-[#131824] text-[#F5F2EB] hover:bg-[#FFD100] hover:text-[#090B10] px-3 py-2 text-xs"
                        >
                          <PixelIcon name="gamepad" size={13} />
                          <span>
                            {art.filter === "noticias"
                              ? `${CARBON_TABLE_EVALS} Evals`
                              : lang === "es"
                              ? "Probar Demos"
                              : "Play Demos"}
                          </span>
                        </button>

                        <button
                          onClick={() => navigateToView("foro")}
                          className="px-btn bg-[#131824] text-[#94A3B8] hover:text-white px-3 py-2 text-xs"
                        >
                          {lang === "es" ? "Foro" : "Forum"}
                        </button>

                        {(() => {
                          const shareUrl = `https://labs.mixiuh.online/#${ARTICLE_HASH[art.id]}`;
                          const shareTitle = lang === "es" ? art.title_es : art.title_en;
                          return (
                            <PixelPopover
                              trigger={<PixelIcon name="share" size={13} />}
                              triggerAriaLabel={lang === "es" ? "Compartir" : "Share"}
                              triggerClassName="bg-[#131824] text-[#00E5FF] px-3 py-2 text-xs"
                              tone="cyan"
                              title={lang === "es" ? "COMPARTIR" : "SHARE"}
                              closeLabel={lang === "es" ? "Cerrar" : "Close"}
                              placement="top"
                              widthClassName="w-64"
                            >
                              <div className="grid gap-2 font-mono-hud text-xs">
                                <PixelCopyButton
                                  text={shareUrl}
                                  tone="cyan"
                                  className="w-full"
                                  label={lang === "es" ? "Copiar enlace" : "Copy link"}
                                  copiedLabel={lang === "es" ? "Enlace copiado" : "Link copied"}
                                  toastTitle={lang === "es" ? "ENLACE COPIADO" : "LINK COPIED"}
                                />
                                {[
                                  {
                                    label: "X / Twitter",
                                    icon: "x" as const,
                                    href: `https://x.com/intent/post?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
                                  },
                                  {
                                    label: "WhatsApp",
                                    icon: "whatsapp" as const,
                                    href: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
                                  },
                                  {
                                    label: "LinkedIn",
                                    icon: "linkedin" as const,
                                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                                  },
                                ].map((net) => (
                                  <a
                                    key={net.label}
                                    href={net.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => playSfx("coin")}
                                    className="px-btn w-full justify-start bg-[#131824] text-[#F5F2EB] px-3 py-1.5"
                                  >
                                    <PixelIcon name={net.icon} size={13} />
                                    <span>{net.label}</span>
                                  </a>
                                ))}
                              </div>
                            </PixelPopover>
                          );
                        })()}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* QUICK NAVIGATION CARDS TO ARENA, PIXEL UI KIT & FORUM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <a
                {...viewLink("arena")}
                className="px-card-violet px-card-interactive p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#A855F7] text-[#090B10] font-pixel text-[10px] font-bold mb-3">
                    <PixelIcon name="gamepad" size={13} color="#090B10" />
                    <span>{`ARENA (${totalDemosCount} DEMOS)`}</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-white mb-2">
                    {lang === "es"
                      ? `Ejecuta los ${totalDemosCount} Simuladores en tu Navegador`
                      : `Run All ${totalDemosCount} Simulators Live in Your Browser`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {lang === "es"
                      ? "Compara lado a lado las entregas de EP04 (Haiku vs Sonnet vs Opus), EP03 (Sin Kit vs Superpowers Kit), EP02 (Argon vs Opus 5.5), EP01 y OVERFIT 3D."
                      : "Compare side-by-side deliverables from EP04 (Haiku vs Sonnet vs Opus), EP03 (Raw vs Superpowers Kit), EP02 (Argon vs Opus 5.5), EP01, and OVERFIT 3D."}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#C084FC]">
                  {lang === "es" ? "Entrar a la Arena →" : "Enter the Arena →"}
                </div>
              </a>

              <a
                {...viewLink("pixelui")}
                className="px-card-chalk px-card-interactive p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#090B10] text-[#FFD100] font-pixel text-[10px] font-bold mb-3">
                    <PixelIcon name="crt-tv" size={13} color="#FFD100" />
                    <span>{`@MIXIUH/PIXEL-UI v${PIXEL_UI_VERSION} (${lang === "es" ? "GRATIS" : "FREE"})`}</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-[#090B10] mb-2">
                    {lang === "es"
                      ? `Descarga Nuestra Libreria Pixel-Art (${ALL_PIXEL_ICON_NAMES.length} Iconos + 3D + Audio)`
                      : `Download Our Pixel-Art UI Library (${ALL_PIXEL_ICON_NAMES.length} Icons + 3D + Audio)`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#090B10] leading-relaxed">
                    {lang === "es"
                      ? `Usa libremente todos nuestros botones tactiles, monitor CRT 3D, disquetes 3.5", ${ALL_PIXEL_ICON_NAMES.length} iconos (incluyendo redes sociales), cursores y sonidos 8-bit dando credito a Mixiuh Labs.`
                      : `Freely use all our tactile buttons, 3D CRT monitor, 3.5" floppies, ${ALL_PIXEL_ICON_NAMES.length} icons (including social brands), cursors, and 8-bit sounds by crediting Mixiuh Labs.`}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#090B10]">
                  {lang === "es"
                    ? "Abrir Estudio Pixel UI + Descargar ZIP →"
                    : "Open Pixel UI Studio + Download ZIP →"}
                </div>
              </a>

              <a
                {...viewLink("foro", undefined, "hilos")}
                className="px-card-cyan px-card-interactive p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00E5FF] text-[#090B10] font-pixel text-[10px] font-bold mb-3">
                    <PixelIcon name="message" size={13} color="#090B10" />
                    <span>
                      {lang === "es"
                        ? `FORO Y GLOSARIO (${totalForumThreadsCount} HILOS)`
                        : `FORUM & GLOSSARY (${totalForumThreadsCount} THREADS)`}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-black text-white mb-2">
                    {lang === "es"
                      ? `Autopsias de Codigo, Facturas de Tokens y ${LAB_GLOSSARY.length} Conceptos`
                      : `Code Autopsies, Token Bills & ${LAB_GLOSSARY.length} Concepts`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {lang === "es"
                      ? `Lee las autopsias forenses de Gemini 4 Carbon, Escalera Claude 5.5, Superpowers Kit y copia los ${totalPromptsCount} prompts originales.`
                      : `Read the forensic breakdowns of Gemini 4 Carbon, Claude 5.5 Ladder, Superpowers Kit, and copy all ${totalPromptsCount} verbatim prompts.`}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#00E5FF]">
                  {lang === "es"
                    ? "Abrir Foro y Glosario →"
                    : "Open Forum & Glossary →"}
                </div>
              </a>
            </div>

            {/* LIVE PIXEL-ART TELEMETRY CHARTS, RELEASE CALENDAR & COLLAPSE FAQ */}
            <div
              data-px-reveal="true"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left 7 Cols: Multi-Series Pixel Telemetry Chart + Donut Gauges */}
              <div className="lg:col-span-7 space-y-4">
                {/* The plot never shrinks below 1:1, so narrow phones pan it
                    sideways: the hint is the chart card's top strip there */}
                <div>
                <PixelSwipeHint
                  hideFrom="sm"
                  className="border-x-2 border-t-2 shadow-[5px_5px_0_#040508] text-center"
                  label={
                    lang === "es"
                      ? "Desliza para ver los 4 benchmarks"
                      : "Swipe to see all 4 benchmarks"
                  }
                />
                <PixelMultiLineChart
                  title={
                    lang === "es"
                      ? "TELEMETRIA COMPARATIVA // GEMINI 4 CARBON VS OPUS 5.5 VS ARGON"
                      : "COMPARATIVE TELEMETRY // GEMINI 4 CARBON VS OPUS 5.5 VS ARGON"
                  }
                  subtitle={
                    lang === "es"
                      ? "Tabla oficial de Google DeepMind (ExploitGym: Carbon y Argon con limite de 10 h por tarea, Opus con 6 h). Haz clic en cada modelo para activar/ocultar series o pasa el cursor sobre los nodos"
                      : "Google DeepMind's official table (ExploitGym: Carbon & Argon capped at 10h per task, Opus at 6h). Click any model legend to toggle series or hover over pixel nodes"
                  }
                  // Same model colors as the News view's benchmark table
                  series={[
                    {
                      key: "carbon",
                      name: "Gemini 4 Carbon",
                      color: "#00E5FF",
                    },
                    {
                      key: "opus",
                      name: "Claude Opus 5.5",
                      color: "#FB923C",
                    },
                    {
                      key: "argon",
                      name: "Gemini 4 Argon",
                      color: "#C084FC",
                    },
                  ]}
                  data={CARBON_TELEMETRY_DATA}
                  // One decimal, as in the official table (65.2% next to 69.0%, not 69%)
                  formatValue={(v) => `${v.toFixed(1)}%`}
                />
                </div>

                {/* Labels wrap instead of truncating ("TERMINAL-BE…") in the 3-column row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 [&_.truncate]:whitespace-normal [&_.truncate]:break-words">
                  <PixelDonutGauge
                    label="TERMINAL-BENCH 4.0"
                    sublabel={
                      lang === "es"
                        ? CARBON_TERMINAL_BENCH.highlight_es
                        : CARBON_TERMINAL_BENCH.highlight_en
                    }
                    value={parseFloat(CARBON_TERMINAL_BENCH.carbon)}
                    maxValue={100}
                    displayValue={CARBON_TERMINAL_BENCH.carbon}
                    tone="cyan"
                  />
                  <PixelDonutGauge
                    label="SEC-BENCH PRO"
                    sublabel={
                      lang === "es"
                        ? CARBON_SEC_BENCH.highlight_es
                        : CARBON_SEC_BENCH.highlight_en
                    }
                    value={parseFloat(CARBON_SEC_BENCH.carbon)}
                    maxValue={100}
                    displayValue={CARBON_SEC_BENCH.carbon}
                    tone="emerald"
                  />
                  <PixelDonutGauge
                    label={lang === "es" ? "AHORRO API VS OPUS" : "API SAVINGS VS OPUS"}
                    sublabel="$4/$20 vs $5/$25 USD"
                    value={20}
                    maxValue={100}
                    displayValue="-20%"
                    tone="yellow"
                  />
                </div>
              </div>

              {/* Right 5 Cols: Release Calendar + Collapsible Methodology */}
              <div className="lg:col-span-5 space-y-4">
                <PixelCalendar
                  lang={lang}
                  selectedDate={calendarEvents[calendarEvents.length - 1]?.date}
                  tone="yellow"
                  events={calendarEvents}
                />

                <PixelCollapse
                  tone="cyan"
                  defaultOpenIds={["faq-1"]}
                  items={[
                    {
                      id: "faq-1",
                      title:
                        lang === "es"
                          ? "¿Como se auditan las pruebas en Mixiuh Labs?"
                          : "How are benchmarks audited at Mixiuh Labs?",
                      badge: "ZERO-SHOT",
                      icon: "shield",
                      content:
                        lang === "es"
                          ? "Cada reto se ejecuta con el mismo prompt exacto en un unico intento (zero-shot) sin editar ni una linea de codigo. Publicamos el index.html integro, el tiempo cronometrado y la factura real de API."
                          : "Every challenge runs with the exact same verbatim prompt in a single zero-shot attempt without editing a single line of code. We publish the raw index.html, wall-clock time, and real API bill.",
                    },
                    {
                      id: "faq-2",
                      title:
                        lang === "es"
                          ? "¿Puedo usar @mixiuh/pixel-ui en proyectos comerciales?"
                          : "Can I use @mixiuh/pixel-ui in commercial projects?",
                      badge: "CC-BY 4.0",
                      icon: "crt-tv",
                      content:
                        lang === "es"
                          ? "Si, 100% gratis para uso personal o comercial en cualquier parte del mundo. Solo debes incluir una insignia o enlace de credito a labs.mixiuh.online."
                          : "Yes, 100% free for personal or commercial use worldwide. Just include a visible credit badge or link back to labs.mixiuh.online.",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 2: SECCION 01 · VIDEOS Y LABORATORIOS (EP01 – EP04) — 100% OPAQUE PIXEL UI
         ===================================================================== */}
      {mainView === "dossiers" && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1 py-8 sm:py-10">
          <DossierView
            lang={lang}
            released={released}
            dossierEp={dossierEp}
            selectDossierEp={selectDossierEp}
            handleEpisodeChange={handleEpisodeChange}
            navigateToView={navigateToView}
            handleJumpToArena={handleJumpToArena}
            playSfx={playSfx}
            ep05ChallengeN={ep05ChallengeN}
            setEp05ChallengeN={setEp05ChallengeN}
            ep04ChallengeN={ep04ChallengeN}
            setEp04ChallengeN={setEp04ChallengeN}
            ep04Mode={ep04Mode}
            setEp04Mode={setEp04Mode}
            ep03ChallengeN={ep03ChallengeN}
            setEp03ChallengeN={setEp03ChallengeN}
            ep03Mode={ep03Mode}
            setEp03Mode={setEp03Mode}
            activeVideoClip={activeVideoClip}
            setActiveVideoClip={setActiveVideoClip}
          />
        </main>
      )}

      {/* =====================================================================
          VIEW 3: SECCION 02 · DEL COMENTARIO AL CODIGO (#02 ROBLOX 3D & #01 OVERFIT 3D)
         ===================================================================== */}
      {mainView === "comunidad" && (released.cc01 || released.cc02) && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Section 02 Header Banner */}
            <div className="p-5 sm:p-6 bg-[#111622] border-2 border-[#FFD100]/45 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[4px_4px_0_#040508]">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFD100]/15 border border-[#FFD100]/45 font-mono-hud text-[11px] font-bold text-[#FFD100] mb-2">
                  <PixelIcon name="sparkles" size={14} />
                  <span>
                    {lang === "es"
                      ? `SECCION 02 · DEL COMENTARIO AL CODIGO (${totalComunidadCount} EPISODIOS)`
                      : `SECTION 02 · FROM COMMENT TO CODE (${totalComunidadCount} EPISODES)`}
                  </span>
                </div>
                {/* Banner text, not a heading: the article <h1> below is the first heading */}
                <p className="font-display text-xl sm:text-2xl font-black text-white">
                  {lang === "es"
                    ? "Retos y Preguntas de la Comunidad Convertidos en Software 3D Real"
                    : "Community Questions & Challenges Turned Into Live 3D Software"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                <button
                  onClick={() => setComunidadEp("all")}
                  aria-pressed={comunidadEp === "all"}
                  className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                    comunidadEp === "all"
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#090B10] border border-[#2A344B] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {lang === "es" ? `Todos (${totalComunidadCount})` : `All (${totalComunidadCount})`}
                </button>
                {released.cc02 && (
                  <button
                    onClick={() => setComunidadEp("cc02")}
                    aria-pressed={comunidadEp === "cc02"}
                    className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                      comunidadEp === "cc02"
                        ? "bg-[#10B981] text-[#090B10]"
                        : "bg-[#090B10] border border-[#10B981]/40 text-[#10B981] hover:bg-[#1A2132]"
                    }`}
                  >
                    {lang === "es"
                      ? "#02 ROBLOX 3D (3 Gigantes + Bonus)"
                      : "#02 ROBLOX 3D (3 Giants + Bonus)"}
                  </button>
                )}
                {released.cc01 && (
                  <button
                    onClick={() => setComunidadEp("cc01")}
                    aria-pressed={comunidadEp === "cc01"}
                    className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                      comunidadEp === "cc01"
                        ? "bg-[#FFD100] text-[#090B10]"
                        : "bg-[#090B10] border border-[#FFD100]/40 text-[#FFD100] hover:bg-[#1A2132]"
                    }`}
                  >
                    {lang === "es"
                      ? "#01 OVERFIT Studio 3D (@tenito03)"
                      : "#01 OVERFIT Studio 3D (@tenito03)"}
                  </button>
                )}
                <button
                  onClick={() => navigateToView("dossiers", "ep04")}
                  className="px-3.5 py-2 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B] text-[#94A3B8] hover:text-white font-bold cursor-pointer"
                >
                  {lang === "es"
                    ? "Ir a Videos / Labs →"
                    : "Go to Videos / Labs →"}
                </button>
              </div>
            </div>

            {/* =====================================================================
                EPISODE #02: JUEGO TIPO ROBLOX 3D (GEMINI 4 ARGON vs CLAUDE OPUS 5.5 vs GPT-6 ASTRA + BONUS OPUS REPARADO)
               ===================================================================== */}
            {released.cc02 && (comunidadEp === "all" || comunidadEp === "cc02") && (
              <div className="bg-[#111622] border-2 border-[#10B981]/50 p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="px-3.5 py-1 bg-[#10B981]/15 border border-[#10B981]/50 font-mono-hud text-xs font-bold text-[#10B981]">
                    {lang === "es"
                      ? "SERIE DEL COMENTARIO AL CODIGO #02 · RETO COMUNIDAD INSTAGRAM · EDICION EXTENDIDA"
                      : "FROM COMMENT TO CODE SERIES #02 · INSTAGRAM COMMUNITY CHALLENGE · EXTENDED EDITION"}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="/demos/cc02-roblox/gpt-6-astra.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 shadow-[4px_4px_0_#040508] bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <PixelIcon name="play" size={14} />
                      <span>
                        {lang === "es"
                          ? "Jugar GPT-6 Astra (Ganador)"
                          : "Play GPT-6 Astra (Winner)"}
                      </span>
                      <PixelIcon name="external" size={14} />
                    </a>
                    <a
                      href="/demos/cc02-roblox/gemini-4-argon.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 shadow-[4px_4px_0_#040508] bg-[#00E5FF] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <PixelIcon name="play" size={14} />
                      <span>
                        {lang === "es"
                          ? "Jugar Gemini 4 Argon (7 Jugadores)"
                          : "Play Gemini 4 Argon (7 Players)"}
                      </span>
                      <PixelIcon name="external" size={14} />
                    </a>
                    <a
                      href="/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 shadow-[4px_4px_0_#040508] bg-[#A855F7] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <PixelIcon name="wrench" size={14} />
                      <span>
                        {lang === "es"
                          ? "Bonus: Jugar Opus 5.5 Reparado"
                          : "Bonus: Play Repaired Opus 5.5"}
                      </span>
                      <PixelIcon name="external" size={14} />
                    </a>
                  </div>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                  {lang === "es"
                    ? "Juego Tipo ROBLOX 3D en 1 Intento: Gemini 4 Argon High vs Claude Opus 5.5 High vs GPT-6 Astra High (+ Bonus Opus Reparado)"
                    : "ROBLOX-Style 3D Game in 1 Attempt: Gemini 4 Argon High vs Claude Opus 5.5 High vs GPT-6 Astra High (+ Repaired Opus Bonus)"}
                </h1>

                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {lang === "es"
                    ? "Un seguidor en Instagram nos pidio enfrentar a los 3 modelos mas potentes del planeta (en razonamiento High) creando un juego tipo Roblox 3D completo en un solo archivo HTML (Modo Jugar Obby 3D con Lava + Modo Construir + Fisica de Bots). Cada modelo hizo 1 sola entrega continua de principio a fin y evaluamos el resultado en 3 etapas clave. Ademas, incluimos la Edicion Extendida (2da Oportunidad) donde reparamos unicamente la linea 1062 de Claude Opus 5.5 para descubrir el juego de 1,452 lineas que habia programado."
                    : "An Instagram follower asked us to pit the 3 most powerful frontier models (in High reasoning) against each other building a complete 3D Roblox-style game in a single HTML file (3D Lava Obby Play Mode + Studio Build Mode + Bot Physics). Each model performed 1 single continuous run from start to finish and we evaluated the output across 3 core stages. Plus, we include the Extended Edition (2nd Chance) where we patched only line 1062 of Claude Opus 5.5 to unlock the 1,452-line game it had built."}
                </p>

                {/* Telemetry Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border-2 border-[#FFD100]/45">
                    <div className="font-mono-hud text-[11px] font-bold text-[#FFD100] uppercase">
                      {lang === "es" ? "MARCADOR OFICIAL ZERO-SHOT" : "OFFICIAL ZERO-SHOT SCORE"}
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                      2 - 1 - 0
                    </div>
                    <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                      {lang === "es"
                        ? "Astra 2 pts · Argon 1 pt · Opus 0 pts"
                        : "Astra 2 pts · Argon 1 pt · Opus 0 pts"}
                    </div>
                  </div>

                  <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border-2 border-[#10B981]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#10B981] uppercase">
                      {lang === "es" ? "1º GPT-6 ASTRA HIGH (GANADOR)" : "1ST GPT-6 ASTRA HIGH (WINNER)"}
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                      18.9m <span className="text-sm text-[#10B981]">· $1.11</span>
                    </div>
                    <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                      {lang === "es"
                        ? "1,713 lineas · 60 FPS · Gana Etapas 01 y 02"
                        : "1,713 lines · 60 FPS · Wins Stages 01 & 02"}
                    </div>
                  </div>

                  <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border-2 border-[#00E5FF]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#00E5FF] uppercase">
                      {lang === "es" ? "2º GEMINI 4 ARGON HIGH (MEJOR ROI)" : "2ND GEMINI 4 ARGON HIGH (BEST ROI)"}
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                      27.2m <span className="text-sm text-[#00E5FF]">· $0.32</span>
                    </div>
                    <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                      {lang === "es"
                        ? "1,027 lineas · 60 FPS · Gana Etapa 03 (7 Jugadores)"
                        : "1,027 lines · 60 FPS · Wins Stage 03 (7 Players)"}
                    </div>
                  </div>

                  <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border-2 border-[#A855F7]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#C084FC] uppercase">
                      {lang === "es" ? "3º CLAUDE OPUS 5.5 HIGH (+ BONUS)" : "3RD CLAUDE OPUS 5.5 HIGH (+ BONUS)"}
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                      55.1m <span className="text-sm text-[#FF3355]">· $9.91</span>
                    </div>
                    <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                      {lang === "es"
                        ? "1,452 lineas · 0 FPS (Bug L1062) → 60 FPS Reparado"
                        : "1,452 lines · 0 FPS (L1062 Bug) → 60 FPS Repaired"}
                    </div>
                  </div>
                </div>

                {/* Thumbnails A/B/C */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["A", "B", "C"] as const).map((variant) => (
                    <img
                      key={variant}
                      src={`/brand/thumbs/cc02_thumb_${variant}.png`}
                      alt={
                        lang === "es"
                          ? `Miniatura ${variant} Reto ROBLOX 3D`
                          : `ROBLOX 3D Challenge Thumbnail ${variant}`
                      }
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-video object-cover shadow-[4px_4px_0_#040508] border border-[#2A344B]"
                    />
                  ))}
                </div>

                {/* Single-Attempt Total Time & 3-Stage Evaluation Breakdown */}
                <div className="bg-[#090B10] border-2 border-[#2A344B] p-4 sm:p-5 shadow-[4px_4px_0_#040508] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono-hud text-xs font-bold text-[#FFD100] uppercase">
                      {lang === "es"
                        ? "TIEMPO Y COSTO TOTAL (1 SOLO INTENTO PARA LAS 3 ETAPAS) + DESGLOSE DE EVALUACION"
                        : "TOTAL TIME & COST (1 SINGLE ATTEMPT FOR ALL 3 STAGES) + EVALUATION BREAKDOWN"}
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 font-mono-hud text-[11px] font-bold text-[#10B981]">
                      {lang === "es"
                        ? "1 ENTREGA CONTINUA POR MODELO (NO X3)"
                        : "1 CONTINUOUS RUN PER MODEL (NOT X3)"}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono-hud text-xs">
                      <thead>
                        <tr className="border-b border-[#2A344B] text-[#94A3B8]">
                          <th className="py-2 pr-3">{lang === "es" ? "ETAPA / METRICA" : "STAGE / METRIC"}</th>
                          <th className="py-2 px-3 text-[#00E5FF]">GEMINI 4 ARGON HIGH</th>
                          <th className="py-2 px-3 text-[#C084FC]">CLAUDE OPUS 5.5 HIGH</th>
                          <th className="py-2 px-3 text-[#10B981]">GPT-6 ASTRA HIGH</th>
                          <th className="py-2 pl-3 text-[#FFD100]">{lang === "es" ? "GANADOR" : "WINNER"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E2638] text-[#F5F2EB]">
                        <tr className="bg-[#111622]/70 font-bold">
                          <td className="py-2.5 pr-3 text-[#FFD100]">
                            {lang === "es"
                              ? "ENTREGA TOTAL (1 Intento Completo)"
                              : "TOTAL DELIVERY (1 Complete Run)"}
                          </td>
                          <td className="py-2.5 px-3 text-[#00E5FF]">27.2 min · $0.32 USD (1,027 L)</td>
                          <td className="py-2.5 px-3 text-[#FF3355]">55.1 min · $9.91 USD (1,452 L)</td>
                          <td className="py-2.5 px-3 text-[#10B981]">18.9 min · $1.11 USD (1,713 L)</td>
                          <td className="py-2.5 pl-3 text-[#10B981]">
                            {lang === "es" ? "ASTRA (Mas Rapido)" : "ASTRA (Fastest)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-3">
                            {lang === "es"
                              ? "Etapa 01 · Mundo Obby 3D + Avatar + Lava"
                              : "Stage 01 · 3D Obby World + Avatar + Lava"}
                          </td>
                          <td className="py-2.5 px-3">60 FPS · Islas flotantes y lava</td>
                          <td className="py-2.5 px-3 text-[#FF3355]">0 FPS · Crash L1062 (setComponent)</td>
                          <td className="py-2.5 px-3 text-[#10B981]">60 FPS · Sky-Citadel + 4 Checkpoints</td>
                          <td className="py-2.5 pl-3 font-bold text-[#10B981]">GPT-6 ASTRA (0-0-1)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-3">
                            {lang === "es"
                              ? "Etapa 02 · Modo Estudio / Construir en Vivo"
                              : "Stage 02 · Live Studio / Build Mode"}
                          </td>
                          <td className="py-2.5 px-3">60 FPS · Raycaster + 8 colores</td>
                          <td className="py-2.5 px-3 text-[#FF3355]">0 FPS · Inaccesible sin parche</td>
                          <td className="py-2.5 px-3 text-[#10B981]">60 FPS · 5 materiales + Trampolines</td>
                          <td className="py-2.5 pl-3 font-bold text-[#10B981]">GPT-6 ASTRA (0-0-2)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-3">
                            {lang === "es"
                              ? "Etapa 03 · Fisica, Bots IA y Retorno (ROI)"
                              : "Stage 03 · Physics, AI Bots & ROI"}
                          </td>
                          <td className="py-2.5 px-3 text-[#00E5FF]">60 FPS · 7 Jugadores (6 Bots) · $0.32</td>
                          <td className="py-2.5 px-3 text-[#FF3355]">0 FPS · $9.91 USD (31x mas caro)</td>
                          <td className="py-2.5 px-3">60 FPS · 3 Bots · $1.11 USD</td>
                          <td className="py-2.5 pl-3 font-bold text-[#00E5FF]">GEMINI 4 ARGON (1-0-2)</td>
                        </tr>
                        <tr className="bg-[#A855F7]/10">
                          <td className="py-2.5 pr-3 text-[#C084FC] font-bold">
                            {lang === "es"
                              ? "BONUS · 2da Oportunidad Opus 5.5 (Parche L1062)"
                              : "BONUS · Opus 5.5 2nd Chance (L1062 Patch)"}
                          </td>
                          <td className="py-2.5 px-3 text-[#94A3B8]">—</td>
                          <td className="py-2.5 px-3 text-[#C084FC] font-bold">
                            60 FPS · 4 Islas, Martillo, Bots y Minijuego
                          </td>
                          <td className="py-2.5 px-3 text-[#94A3B8]">—</td>
                          <td className="py-2.5 pl-3 font-bold text-[#C084FC]">
                            {lang === "es" ? "RESCATADO (1 LINEA)" : "RESCUED (1 LINE)"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interactive Simulator Switcher (4 Playable Versions + Triple View + Prompt/Autopsy) */}
                <div className="bg-[#090B10] border-2 border-[#10B981]/50 overflow-hidden shadow-[6px_6px_0_#040508]">
                  <div className="px-4 py-3 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono-hud text-xs font-bold text-white">
                      {lang === "es"
                        ? "SIMULADOR ROBLOX 3D EN VIVO · PRUEBA LAS 4 VERSIONES EN TU NAVEGADOR"
                        : "LIVE 3D ROBLOX SIMULATOR · PLAY ALL 4 VERSIONS IN YOUR BROWSER"}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono-hud text-xs">
                      <button
                        onClick={() => setCc02Model("astra")}
                        className={`px-3 py-1.5 font-bold cursor-pointer ${
                          cc02Model === "astra"
                            ? "bg-[#10B981] text-[#090B10]"
                            : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        1. GPT-6 Astra ($1.11 · 18.9m)
                      </button>
                      <button
                        onClick={() => setCc02Model("argon")}
                        className={`px-3 py-1.5 font-bold cursor-pointer ${
                          cc02Model === "argon"
                            ? "bg-[#00E5FF] text-[#090B10]"
                            : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        2. Gemini 4 Argon ($0.32 · 7 Jugadores)
                      </button>
                      <button
                        onClick={() => setCc02Model("opus")}
                        className={`px-3 py-1.5 font-bold cursor-pointer ${
                          cc02Model === "opus"
                            ? "bg-[#FF3355] text-[#090B10]"
                            : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {lang === "es" ? "3. Opus 5.5 (Fallo Zero-Shot)" : "3. Opus 5.5 (Zero-Shot Crash)"}
                      </button>
                      <button
                        onClick={() => setCc02Model("opus_fixed")}
                        className={`px-3 py-1.5 font-bold cursor-pointer ${
                          cc02Model === "opus_fixed"
                            ? "bg-[#A855F7] text-[#090B10]"
                            : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {lang === "es" ? "4. Bonus: Opus Reparado" : "4. Bonus: Repaired Opus"}
                      </button>
                      <button
                        onClick={() => setCc02Model("triple")}
                        className={`px-3 py-1.5 font-bold cursor-pointer ${
                          cc02Model === "triple"
                            ? "bg-[#FFD100] text-[#090B10]"
                            : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {lang === "es" ? "Comparativa Triple" : "Triple Comparison"}
                      </button>
                      <button
                        onClick={() => setCc02Model("prompt")}
                        className={`px-3 py-1.5 font-bold cursor-pointer ${
                          cc02Model === "prompt"
                            ? "bg-[#F5F2EB] text-[#090B10]"
                            : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {lang === "es" ? "Prompt + Autopsia L1062" : "Prompt + L1062 Autopsy"}
                      </button>
                    </div>
                  </div>

                  {cc02Model === "triple" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                      <div>
                        <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                          <span className="font-bold text-[#00E5FF]">GEMINI 4 ARGON ($0.32 · 27.2m)</span>
                          <a
                            href="/demos/cc02-roblox/gemini-4-argon.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00E5FF] hover:underline"
                          >
                            ↗
                          </a>
                        </div>
                        <iframe
                          loading="lazy"
                          src="/demos/cc02-roblox/gemini-4-argon.html"
                          title="Gemini 4 Argon High - Roblox 3D"
                          className="w-full h-[540px] border-0 bg-[#090B10]"
                        />
                      </div>
                      <div>
                        <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                          <span className="font-bold text-[#C084FC]">OPUS 5.5 REPARADO ($9.91 · 55.1m)</span>
                          <a
                            href="/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C084FC] hover:underline"
                          >
                            ↗
                          </a>
                        </div>
                        <iframe
                          loading="lazy"
                          src="/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                          title="Claude Opus 5.5 Repaired - Roblox 3D"
                          className="w-full h-[540px] border-0 bg-[#090B10]"
                        />
                      </div>
                      <div>
                        <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                          <span className="font-bold text-[#10B981]">GPT-6 ASTRA ($1.11 · 18.9m)</span>
                          <a
                            href="/demos/cc02-roblox/gpt-6-astra.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#10B981] hover:underline"
                          >
                            ↗
                          </a>
                        </div>
                        <iframe
                          loading="lazy"
                          src="/demos/cc02-roblox/gpt-6-astra.html"
                          title="GPT-6 Astra High - Roblox 3D"
                          className="w-full h-[540px] border-0 bg-[#090B10]"
                        />
                      </div>
                    </div>
                  ) : cc02Model === "prompt" ? (
                    <div className="p-6 space-y-5 font-mono-hud text-xs text-[#F5F2EB]">
                      <div className="p-4 bg-[#111622] border border-[#FF3355]/50 space-y-2">
                        <div className="font-bold text-[#FF3355]">
                          {lang === "es"
                            ? "AUTOPSIA FORENSE · ¿POR QUE FALLO CLAUDE OPUS 5.5 EN ZERO-SHOT Y COMO SE REPARO?"
                            : "FORENSIC AUTOPSY · WHY DID CLAUDE OPUS 5.5 CRASH IN ZERO-SHOT AND HOW WAS IT REPAIRED?"}
                        </div>
                        <p className="text-[#CBD5E1] leading-relaxed">
                          {lang === "es"
                            ? "En las lineas 714-718 de claude-opus-5.5.html, Opus 5.5 guardo pos como un objeto plano { x, y, z } en lugar de THREE.Vector3. Pero en el bucle animate() (linea 1062) invoco m.p.pos.setComponent(m.axis, ...), lanzando TypeError: m.p.pos.setComponent is not a function en el frame 1. Al reemplazar esa unica llamada por asignacion de eje (m.p.pos[m.axis] = ...), el motor completo de 1,452 lineas corre a 60 FPS."
                            : "In lines 714-718 of claude-opus-5.5.html, Opus 5.5 stored pos as a plain { x, y, z } object instead of THREE.Vector3. Inside animate() (line 1062) it called m.p.pos.setComponent(m.axis, ...), throwing TypeError: m.p.pos.setComponent is not a function on frame 1. Replacing that single call with direct axis assignment (m.p.pos[m.axis] = ...) unlocks the full 1,452-line engine at 60 FPS."}
                        </p>
                        <pre className="p-3 bg-[#090B10] border border-[#2A344B] overflow-x-auto text-[11px] text-[#10B981]">
{`// [FALLO] claude-opus-5.5.html (Linea 1062 - Zero-Shot Original: 0 FPS)
m.p.pos.setComponent(m.axis, m.base + offset);

// [REPARADO] claude-opus-5.5-fixed.html (Linea 1062 - 2da Oportunidad: 60 FPS)
m.p.pos[m.axis] = m.base + offset;`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#00E5FF]">
                            {lang === "es"
                              ? "PROMPT EXACTO ZERO-SHOT ENVIADO A LOS 3 GIGANTES:"
                              : "EXACT ZERO-SHOT PROMPT SENT TO ALL 3 GIANTS:"}
                          </span>
                          <PixelCopyButton
                            text={`Create a complete, self-contained, playable 3D Roblox-style Obby & Voxel Sandbox Studio ("ROBLOX STUDIO / OBBY BUILDER 3D") inside a single index.html file using Three.js (r128 CDN), WebGL, and procedural Web Audio API sound synthesis. Include Play Mode (3D Blocky Avatar with limbs, third-person camera, moving platforms, spinning sweepers, bounce pads, lava floor, 4 checkpoints, coins, and AI bots) and Build/Studio Mode (raycast voxel placement/removal, material palette, save/load, and live HUD telemetry).`}
                            label={lang === "es" ? "Copiar Prompt" : "Copy Prompt"}
                          />
                        </div>
                        <pre className="p-4 bg-[#111622] border border-[#2A344B] whitespace-pre-wrap text-[11px] text-[#CBD5E1] leading-relaxed">
{`Create a complete, self-contained, playable 3D Roblox-style Obby & Voxel Sandbox Studio ("ROBLOX STUDIO / OBBY BUILDER 3D") inside a single index.html file using Three.js (r128 CDN), WebGL, and procedural Web Audio API sound synthesis.
1. Stage 01 (Play Mode): 3D blocky character with articulated limbs, third-person orbital camera, floating Obby islands, moving platforms, rotating obstacle bars, jump pads, lava hazard floor with respawn, 4 checkpoints, collectible coins, and goal trophy.
2. Stage 02 (Studio / Build Mode): Real-time raycast grid cursor to place/remove 3D blocks, palette of materials/colors (brick, neon, gold, ice, lava, bounce pad), clear/reset, and instant switch between Build and Play.
3. Stage 03 (Physics, AI Bots & Telemetry HUD): Autonomous AI bot players running and jumping the Obby simultaneously, AABB collision detection, procedural Web Audio SFX, and live FPS/block/coin HUD.`}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                        <span className="text-[#CBD5E1]">
                          {cc02Model === "astra"
                            ? lang === "es"
                              ? "Viendo: GPT-6 Astra High (Ganador 2 Puntos · 18.9 min · $1.11 USD · 1,713 lineas)"
                              : "Viewing: GPT-6 Astra High (2-Point Winner · 18.9 min · $1.11 USD · 1,713 lines)"
                            : cc02Model === "argon"
                            ? lang === "es"
                              ? "Viendo: Gemini 4 Argon High (Ganador Etapa 03 · 7 Jugadores [Tu + 6 Bots] · 27.2 min · $0.32 USD)"
                              : "Viewing: Gemini 4 Argon High (Stage 03 Winner · 7 Players [You + 6 Bots] · 27.2 min · $0.32 USD)"
                            : cc02Model === "opus"
                            ? lang === "es"
                              ? "Viendo: Claude Opus 5.5 High Zero-Shot Original (Se congela en el menu por TypeError en linea 1062)"
                              : "Viewing: Claude Opus 5.5 High Original Zero-Shot (Freezes on menu due to line 1062 TypeError)"
                            : lang === "es"
                            ? "Viendo: BONUS Claude Opus 5.5 Reparado (Parche de 1 sola linea en L1062 · 1,452 lineas desbloqueadas)"
                            : "Viewing: BONUS Repaired Claude Opus 5.5 (1-line patch at L1062 · 1,452 lines unlocked)"}
                        </span>
                        <a
                          href={
                            cc02Model === "astra"
                              ? "/demos/cc02-roblox/gpt-6-astra.html"
                              : cc02Model === "argon"
                              ? "/demos/cc02-roblox/gemini-4-argon.html"
                              : cc02Model === "opus"
                              ? "/demos/cc02-roblox/claude-opus-5.5.html"
                              : "/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#10B981] hover:underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Full Screen ↗"}
                        </a>
                      </div>
                      <iframe
                        key={cc02Model}
                        allowFullScreen
                        loading="lazy"
                        src={
                          cc02Model === "astra"
                            ? "/demos/cc02-roblox/gpt-6-astra.html"
                            : cc02Model === "argon"
                            ? "/demos/cc02-roblox/gemini-4-argon.html"
                            : cc02Model === "opus"
                            ? "/demos/cc02-roblox/claude-opus-5.5.html"
                            : "/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                        }
                        title={`ROBLOX 3D - ${cc02Model}`}
                        className="w-full h-[760px] border-0 bg-[#090B10]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =====================================================================
                EPISODE #01: OVERFIT STUDIO 3D (@TENITO03)
               ===================================================================== */}
            {released.cc01 && (comunidadEp === "all" || comunidadEp === "cc01") && (
            <div className="bg-[#111622] border-2 border-[#FFD100]/40 p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 bg-[#FFD100]/15 border border-[#FFD100]/50 font-mono-hud text-xs font-bold text-[#FFD100]">
                  {lang === "es"
                    ? "SERIE DEL COMENTARIO AL CODIGO #01 · RETO DE @TENITO03"
                    : "FROM COMMENT TO CODE SERIES #01 · @TENITO03 CHALLENGE"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/overfit/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 shadow-[4px_4px_0_#040508] bg-[#FFD100] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                  >
                    <PixelIcon name="play" size={14} />
                    <span>
                      {lang === "es"
                        ? "Abrir OVERFIT Studio 3D en Pantalla Completa"
                        : "Open OVERFIT Studio 3D Full Screen"}
                    </span>
                    <PixelIcon name="external" size={14} />
                  </a>
                  <a
                    href="/api/source?model=comunidad&dir=cc01-overfit-studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#00E5FF]/40 text-[#00E5FF] font-mono-hud text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <PixelIcon name="code" size={14} />
                    <span>JSON Source</span>
                  </a>
                  {/* CC01 has a Spanish cut only; sized like the buttons beside it */}
                  <a
                    href={YOUTUBE_LINKS.cc01_es}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 shadow-[4px_4px_0_#040508] bg-[#FF3355] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                  >
                    <PixelIcon name="play" size={14} />
                    <span>
                      {lang === "es"
                        ? "Ver en YouTube (4K60)"
                        : "Watch on YouTube (4K60, in Spanish)"}
                    </span>
                    <PixelIcon name="external" size={14} />
                  </a>
                </div>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                {lang === "es"
                  ? "De un Comentario a una Marca de Ropa IA en 3D: OVERFIT Studio 3D (Coleccion Guerra de Pesos)"
                  : "From a Comment to a 3D AI Streetwear Brand: OVERFIT Studio 3D (Weight War Collection)"}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-5 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#00E5FF]/30 p-4 flex flex-col justify-between gap-3">
                  <div className="font-mono-hud text-xs font-bold text-[#00E5FF]">
                    {lang === "es"
                      ? "1. EL COMENTARIO ORIGINAL DE @TENITO03 EN INSTAGRAM"
                      : "1. THE ORIGINAL INSTAGRAM COMMENT BY @TENITO03"}
                  </div>
                  <div className="overflow-hidden bg-white p-2">
                    <img
                      src="/brand/thumbs/tenito_comment.png"
                      width={1840}
                      height={492}
                      loading="lazy"
                      decoding="async"
                      alt={
                        lang === "es"
                          ? `Comentario de @tenito03 en Instagram: "${TENITO_COMMENT_ES}"`
                          : `Instagram comment by @tenito03, in Spanish: "${TENITO_COMMENT_ES}" (English: "${TENITO_COMMENT_EN}")`
                      }
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["A", "B", "C"] as const).map((variant) => {
                    const src = `/brand/thumbs/cc01_thumb_${variant}.jpg`;
                    return (
                      <img
                        key={variant}
                        src={src}
                        alt={
                          lang === "es"
                            ? `Miniatura ${variant} OVERFIT`
                            : (SPANISH_COVER_ALT_EN[src] ?? `OVERFIT thumbnail ${variant}`)
                        }
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-video object-cover shadow-[4px_4px_0_#040508] border border-[#2A344B]"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Embedded Live OVERFIT Studio 3D */}
              <div className="bg-[#090B10] border-2 border-[#FFD100]/50 overflow-hidden shadow-[6px_6px_0_#040508]">
                <div className="px-4 py-3 bg-[#1A2132] border-b border-[#2A344B] flex items-center justify-between">
                  <span className="font-mono-hud text-xs font-bold text-white">
                    {lang === "es"
                      ? "OVERFIT STUDIO 3D EN VIVO · GIRA 360°, HAZ ZOOM MACRO HD O PRUEBA LOS 10 ESTAMPADOS"
                      : "LIVE OVERFIT STUDIO 3D · SPIN 360°, ZOOM IN MACRO HD OR TRY THE 10 PRINTS"}
                  </span>
                  <a
                    href="/overfit/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-hud text-xs font-bold text-[#FFD100] hover:underline"
                  >
                    {lang === "es" ? "Pantalla Completa ↗" : "Full Screen ↗"}
                  </a>
                </div>
                {/* ~6 MB of scripts: wait until it nears the viewport (below the fold on phones) */}
                <iframe
                  allowFullScreen
                  loading="lazy"
                  src="/overfit/index.html"
                  title="OVERFIT Studio 3D"
                  className="w-full h-[820px] border-0 bg-[#090B10]"
                />
              </div>
            </div>
            )}
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 4: SECCION 03 · RADAR MIXIUH NOTICIAS IA (#01 GEMINI 4 CARBON)
         ===================================================================== */}
      {mainView === "noticias" && released.carbon01 && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsSection
              lang={lang}
              onOpenLabEpisode={(ep) => navigateToView("dossiers", ep)}
              onOpenArena={() => navigateToView("arena")}
            />
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 5: ARENA INTERACTIVA (STRICTLY RELEASED DEMOS ONLY)
         ===================================================================== */}
      {mainView === "arena" && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1 py-6">
          {/* The view's title for heading navigation (no visible title here) */}
          <h1 className="sr-only">{currentViewName}</h1>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="p-3 shadow-[6px_6px_0_#040508] bg-[#111622] border-2 border-[#A855F7]/40 flex flex-wrap items-center justify-between gap-3">
              <div
                id="arena-mode-label"
                className="font-mono-hud text-xs font-bold text-[#C084FC]"
              >
                {lang === "es"
                  ? `MODO DE ARENA INTERACTIVA (${totalDemosCount} DEMOS PUBLICADAS):`
                  : `INTERACTIVE ARENA MODE (${totalDemosCount} PUBLISHED DEMOS):`}
              </div>
              <div
                role="group"
                aria-labelledby="arena-mode-label"
                className="flex flex-wrap items-center gap-2 font-mono-hud text-xs"
              >
                {released.ep05 && (
                  <button
                    onClick={() => setArenaMode("ep05")}
                    aria-pressed={arenaMode === "ep05"}
                    className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                      arenaMode === "ep05"
                        ? "bg-[#10B981] text-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {lang === "es"
                      ? "EP05: Torneo 3 Gigantes (20)"
                      : "EP05: 3 Giants Tournament (20)"}
                  </button>
                )}
                {released.ep04 && (
                  <button
                    onClick={() => setArenaMode("ep04")}
                    aria-pressed={arenaMode === "ep04"}
                    className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                      arenaMode === "ep04"
                        ? "bg-[#00E5FF] text-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {lang === "es"
                      ? "EP04: Escalera Claude 5.5 (18)"
                      : "EP04: Claude 5.5 Ladder (18)"}
                  </button>
                )}
                {released.ep03 && (
                  <button
                    onClick={() => setArenaMode("ep03")}
                    aria-pressed={arenaMode === "ep03"}
                    className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                      arenaMode === "ep03"
                        ? "bg-[#10B981] text-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {lang === "es"
                      ? "EP03: Sin Kit vs Superpowers Kit (12)"
                      : "EP03: Raw vs Superpowers Kit (12)"}
                  </button>
                )}
                <button
                  onClick={() => {
                    playSfx("click");
                    selectArenaEpisode("ep02");
                  }}
                  aria-pressed={arenaMode === "ep02_ep01" && activeEpisode === "ep02"}
                  className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                    arenaMode === "ep02_ep01" && activeEpisode === "ep02"
                      ? "bg-[#A855F7] text-[#090B10]"
                      : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  EP02: Argon vs Opus 5.5 (12)
                </button>
                <button
                  onClick={() => {
                    playSfx("click");
                    selectArenaEpisode("ep01");
                  }}
                  aria-pressed={arenaMode === "ep02_ep01" && activeEpisode === "ep01"}
                  className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-bold cursor-pointer ${
                    arenaMode === "ep02_ep01" && activeEpisode === "ep01"
                      ? "bg-[#00E5FF] text-[#090B10]"
                      : "bg-[#090B10] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  EP01: Argon vs 3.8 Flash (20 + Bonus)
                </button>
                {released.cc02 && (
                  <button
                    onClick={() => {
                      setComunidadEp("cc02");
                      navigateToView("comunidad");
                    }}
                    className="px-3.5 py-2 shadow-[4px_4px_0_#040508] bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] font-bold cursor-pointer"
                  >
                    {lang === "es"
                      ? "CC02: ROBLOX 3D (3 Gigantes + Bonus)"
                      : "CC02: ROBLOX 3D (3 Giants + Bonus)"}
                  </button>
                )}
                {released.cc01 && (
                  <button
                    onClick={() => {
                      setComunidadEp("cc01");
                      navigateToView("comunidad");
                    }}
                    className="px-3.5 py-2 shadow-[4px_4px_0_#040508] bg-[#FFD100]/20 border border-[#FFD100]/50 text-[#FFD100] font-bold cursor-pointer"
                  >
                    OVERFIT Studio 3D (1)
                  </button>
                )}
              </div>
            </div>
          </div>

          {(released.ep05 && arenaMode === "ep05") ||
          (released.ep04 && arenaMode === "ep04") ||
          (released.ep03 && arenaMode === "ep03") ? (
            <ArenaLatest
              lang={lang}
              episode={arenaMode}
              ep05ChallengeN={ep05ChallengeN}
              setEp05ChallengeN={setEp05ChallengeN}
              ep04ChallengeN={ep04ChallengeN}
              setEp04ChallengeN={setEp04ChallengeN}
              ep03ChallengeN={ep03ChallengeN}
              setEp03ChallengeN={setEp03ChallengeN}
              navigateToView={navigateToView}
            />
          ) : (
            <DemoArenaSection
              key={arenaResetKey}
              lang={lang}
              activeEpisode={activeEpisode}
              onChangeEpisode={(ep) => {
                setActiveEpisode(ep);
                setDossierEp(ep);
                setSelectedChallengeN(ep === "ep02" ? 1 : 6);
              }}
              selectedChallengeN={selectedChallengeN}
              onSelectChallengeN={setSelectedChallengeN}
            />
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW 6: FORO TECNICO, AUTOPSIAS & GLOSARIO
         ===================================================================== */}
      {mainView === "foro" && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1 py-6">
          {/* Forum or glossary title above the sections' own h2s */}
          <h1 className="sr-only">{currentViewName}</h1>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <PixelTabs
              ariaLabel={lang === "es" ? "Foro y glosario" : "Forum & glossary"}
              tone="cyan"
              wrap
              value={foroSubTab}
              onChange={selectForoSubTab}
              items={[
                {
                  id: "hilos" as const,
                  icon: "message" as const,
                  label:
                    lang === "es"
                      ? "Foro Tecnico, Autopsias y Prompts"
                      : "Technical Forum, Autopsies & Prompts",
                  badge: totalForumThreadsCount,
                },
                {
                  id: "glosario" as const,
                  icon: "book" as const,
                  label:
                    lang === "es"
                      ? "Glosario Tecnico & Ecosistema"
                      : "Technical Glossary & Ecosystem",
                  badge: LAB_GLOSSARY.length,
                },
              ]}
            />
          </div>

          {foroSubTab === "hilos" ? (
            <ForumSection
              lang={lang}
              onJumpToArena={handleJumpToArena}
              released={released}
            />
          ) : (
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono-hud uppercase text-[#00E5FF] font-bold mb-1">
                        <PixelIcon name="book" size={16} />
                        <span>
                          {lang === "es"
                            ? `GLOSARIO TECNICO MIXIUH LABS (${LAB_GLOSSARY.length} CONCEPTOS)`
                            : `MIXIUH LABS TECHNICAL GLOSSARY (${LAB_GLOSSARY.length} CONCEPTS)`}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                        {lang === "es"
                          ? "Diccionario de Ingenieria en Lenguaje Claro"
                          : "Plain-Language Engineering Dictionary"}
                      </h2>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <PixelIcon name="search" size={16} className="text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={glossarySearch}
                        onChange={(e) => setGlossarySearch(e.target.value)}
                        aria-label={lang === "es" ? "Buscar en el glosario" : "Search the glossary"}
                        placeholder={
                          lang === "es"
                            ? "Buscar Verlet, CCD, FBO, DDA..."
                            : "Search Verlet, CCD, FBO, DDA..."
                        }
                        className="w-full pl-10 pr-4 py-2 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] text-xs text-white placeholder:text-[#94A3B8]"
                      />
                      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                        {glossaryStatus}
                      </p>
                    </div>
                  </div>

                  {glossaryCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredGlossary.map((g) => (
                        <div
                          key={g.term}
                          className="p-4 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] hover:border-[#00E5FF]/40 transition"
                        >
                          <div className="font-mono-hud text-xs font-bold text-[#00E5FF] mb-1">
                            {glossaryTerm(g)}
                          </div>
                          <p className="text-xs text-[#F5F2EB]/90 leading-relaxed">
                            {glossaryPlain(g)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] font-mono-hud text-xs text-[#CBD5E1] break-words">
                      {glossaryNoResults}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW 7: MIXIUH PIXEL UI (OPEN SOURCE LIBRARY & PLAYGROUND)
         ===================================================================== */}
      {mainView === "pixelui" && (
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex-1">
          <PixelUiShowcase
            lang={lang}
            cursorStyle={cursorStyle}
            onChangeCursor={setCursorStyle}
            ambientMode={ambientMode}
            onChangeAmbient={setAmbientMode}
            released={released}
          />
        </main>
      )}

      {/* PIXEL-ART HARDWARE FOOTER WITH SOCIAL BAR & OPEN-SOURCE ATTRIBUTION BADGE */}
      <footer className="py-8 border-t-3 border-[#FFD100] bg-[#090B10] text-xs font-mono-hud text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Compact Social Media Redirect Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2A344B]">
            <div className="flex items-center gap-2 font-pixel text-[10px] text-[#FFD100]">
              <PixelIcon name="share" size={14} color="#FFD100" />
              <span>
                {lang === "es"
                  ? "SIGUENOS EN TODAS LAS REDES DE MIXIUH LABS:"
                  : "FOLLOW MIXIUH LABS ACROSS ALL PLATFORMS:"}
              </span>
            </div>
            <PixelSocialBar compact />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <PixelCreditBadge variant="hardware" />
              <span>
                {lang === "es"
                  ? "Mixiuh Labs · labs.mixiuh.online · “Aqui no se opina: se prueba.”"
                  : "Mixiuh Labs · labs.mixiuh.online · “Here we don't guess: we test.”"}
              </span>
            </div>
            <nav
              aria-label={lang === "es" ? "Mapa del sitio" : "Site map"}
              className="flex flex-wrap items-center gap-4"
            >
              <a {...viewLink("blog")} className="inline-block py-1.5 hover:text-white cursor-pointer">
                {lang === "es" ? "Inicio" : "Home"}
              </a>
              <a
                {...viewLink("dossiers", "ep05")}
                className="inline-block py-1.5 text-[#10B981] hover:text-white font-bold cursor-pointer"
              >
                {lang === "es"
                  ? "Videos / Laboratorios (EP01–EP05)"
                  : "Videos / Labs (EP01–EP05)"}
              </a>
              {(released.cc01 || released.cc02) && (
                <a
                  {...viewLink("comunidad")}
                  className="inline-block py-1.5 text-[#FFD100] hover:text-white font-bold cursor-pointer"
                >
                  {lang === "es"
                    ? "Del Comentario al Codigo (#01–#02)"
                    : "From Comment to Code (#01–#02)"}
                </a>
              )}
              {released.carbon01 && (
                <a
                  {...viewLink("noticias")}
                  className="inline-block py-1.5 text-[#00E5FF] hover:text-white font-bold cursor-pointer"
                >
                  {lang === "es"
                    ? "Noticias IA (Gemini 4 Carbon)"
                    : "AI News (Gemini 4 Carbon)"}
                </a>
              )}
              <a
                {...viewLink("pixelui")}
                className="inline-block py-1.5 text-[#FF3355] hover:text-white font-bold cursor-pointer"
              >
                {`Mixiuh Pixel UI v${PIXEL_UI_VERSION} (${lang === "es" ? "Gratis" : "Free"})`}
              </a>
              <a
                href="https://mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 hover:text-white"
              >
                Mixiuh
              </a>
            </nav>
          </div>

          {/* Familia Mixiuh Ecosystem Navigation Bar */}
          <nav
            aria-label="Familia Mixiuh"
            className="pt-4 border-t border-[#2A344B] flex flex-wrap items-center justify-between gap-3 text-[11px]"
          >
            <span className="font-pixel text-[10px] text-[#FFD100]">
              FAMILIA MIXIUH // ECOSISTEMA OFICIAL:
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <a
                href="https://mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Mixiuh (mixiuh.online)
              </a>
              <a
                href="https://holdyfy.mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Holdyfy
              </a>
              <a
                href="https://stockfy.mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Stockfy
              </a>
              <a
                href="https://queryfy.mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Queryfy
              </a>
              <a
                href="https://reelfy.mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Reelfy
              </a>
              <a
                href="https://tinteca.mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Tinteca
              </a>
              <a
                href="https://keruvin.store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Keruvin Store
              </a>
            </div>
          </nav>
        </div>
      </footer>
      </div>

      <PixelCommandPalette
        items={commandItems}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        title={es ? "MIXIUH LABS // BIOS DE COMANDOS" : "MIXIUH LABS // COMMAND BIOS"}
        placeholder={
          es
            ? "Busca secciones, episodios, demos, ajustes o terminos..."
            : "Search sections, episodes, demos, settings or terms..."
        }
        emptyLabel={es ? "Sin resultados. Prueba con otra palabra." : "No results. Try another word."}
        resultsLabel={PALETTE_RESULTS_LABEL[lang]}
        footerHint={
          es
            ? "↑↓ navegar · ENTER abrir · ESC cerrar"
            : "↑↓ navigate · ENTER open · ESC close"
        }
      />
      <PixelDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        side="right"
        size="sm"
        tone="emerald"
        title={es ? "AJUSTES // MIXIUH LABS" : "SETTINGS // MIXIUH LABS"}
        description={
          es
            ? "Sonido, idioma, fondo animado y redes. Se guardan en este dispositivo."
            : "Sound, language, animated background and links. Saved on this device."
        }
        closeLabel={es ? "Cerrar ajustes" : "Close settings"}
        footer={
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="px-btn bg-[#10B981] text-[#090B10] px-4 py-2 text-xs"
          >
            {es ? "Listo" : "Done"}
          </button>
        }
      >
        <div className="space-y-6 font-mono-hud text-xs">
          <section className="space-y-2">
            {/* Named by its purpose: on/off is the switch state (aria-checked + knob) */}
            <PixelToggle
              checked={sfxEnabled}
              onChange={(next) => {
                if (next !== sfxEnabled) toggleSfx();
              }}
              label={es ? "Sonido 8-bit" : "8-bit sound"}
            />
          </section>

          <section className="space-y-2">
            <h3 className="font-pixel text-[11px] text-[#FFD100]">
              {es ? "IDIOMA" : "LANGUAGE"}
            </h3>
            <PixelTabs
              ariaLabel={es ? "Idioma" : "Language"}
              value={lang}
              onChange={setLang}
              items={[
                { id: "es" as const, label: "Espanol" },
                { id: "en" as const, label: "English" },
              ]}
            />
          </section>

          <section className="space-y-2">
            <PixelRadioGroup
              label={es ? "FONDO IA PROCEDURAL" : "PROCEDURAL AI BACKGROUND"}
              value={ambientMode}
              onChange={(v) => {
                if (isAmbientMode(v)) setAmbientMode(v);
              }}
              tone="emerald"
              options={[
                {
                  value: "ai-ecosystem",
                  label: es ? "Ecosistema de agentes IA" : "AI agent ecosystem",
                },
                {
                  value: "neural-packets",
                  label: es ? "Paquetes y circuitos" : "Packets & circuits",
                },
                {
                  value: "voxel-rain",
                  label: es ? "Lluvia binaria voxel" : "Voxel binary rain",
                },
                {
                  value: "off",
                  label: es ? "Apagado (ahorra bateria)" : "Off (saves battery)",
                },
              ]}
            />
          </section>

          <section className="space-y-2 hidden pointer-fine:block">
            <PixelRadioGroup
              label={es ? "CURSOR PIXEL-ART" : "PIXEL-ART CURSOR"}
              value={cursorStyle}
              onChange={(v) => {
                const preset = PIXEL_CURSOR_PRESETS.find((p) => p.id === v);
                if (preset) setCursorStyle(preset.id);
              }}
              tone="cyan"
              options={PIXEL_CURSOR_PRESETS.map((p) => ({
                value: p.id,
                label: es ? p.name_es : p.name_en,
              }))}
            />
          </section>

          <section className="space-y-2">
            <h3 className="font-pixel text-[11px] text-[#FFD100]">
              {es ? "BUSCAR EN TODO EL SITIO" : "SEARCH THE WHOLE SITE"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                window.setTimeout(() => setPaletteOpen(true), 0);
              }}
              className="px-btn bg-[#FFD100] text-[#090B10] px-4 py-2 text-xs"
            >
              <PixelIcon name="search" size={13} />
              <span>{es ? "Abrir buscador" : "Open search"}</span>
              <kbd className="px-kbd hidden pointer-fine:inline-flex">Ctrl K</kbd>
            </button>
          </section>

          <section className="space-y-2">
            <h3 className="font-pixel text-[11px] text-[#FFD100]">
              {es ? "REDES OFICIALES" : "OFFICIAL CHANNELS"}
            </h3>
            <PixelSocialBar compact />
          </section>
        </div>
      </PixelDrawer>
      {/* View switches: the new view's name (a new node per switch, so a
          repeated name is read again) */}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {viewSwitch.id > 0 && <span key={viewSwitch.id}>{viewSwitch.name}</span>}
      </p>
      <PixelToaster />
      <PixelBackToTop
        label={es ? "Volver arriba" : "Back to top"}
        focusTargetId="contenido"
      />
    </div>
  );
}
