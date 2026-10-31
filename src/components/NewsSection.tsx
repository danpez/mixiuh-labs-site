"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PixelDataTable,
  PixelIcon,
  PixelSwipeHint,
  PixelTabs,
  usePixelDialog,
} from "@mixiuh/pixel-ui";
import {
  CARBON_NEWS_META,
  CARBON_CHAPTERS,
  CARBON_FULL_BENCHMARKS,
  CARBON_BENCHMARK_STATS,
  CARBON_MASTER_TABLE_IMG,
  CARBON_PRICING_TABLE,
  CARBON_OFFICIAL_GALLERY,
  type CarbonBenchmarkRow,
  type NewsBenchmarkDomain,
  type OfficialChartAsset,
} from "@/data/newsData";

interface NewsSectionProps {
  lang: "es" | "en";
  onOpenLabEpisode: (ep: "ep04" | "ep03" | "ep02" | "ep01") => void;
  onOpenArena: () => void;
}

const BENCH_DOMAINS: { id: NewsBenchmarkDomain; es: string; en: string }[] = [
  { id: "all", es: "Todos", en: "All" },
  { id: "agentes", es: "Codigo y Agentes", en: "Coding & Agents" },
  { id: "cyber", es: "Ciberseguridad", en: "Cybersecurity" },
  { id: "negocios", es: "Negocios y Economia", en: "Business & Economics" },
  { id: "ciencia", es: "Ciencia y Matematicas", en: "Science & Math" },
];

const MODEL_COLUMNS: {
  key: "carbon" | "argon" | "gpt6" | "opus55";
  name: string;
  color: string;
}[] = [
  { key: "carbon", name: "Gemini 4 Carbon", color: "#00E5FF" },
  { key: "argon", name: "Gemini 4 Argon", color: "#C084FC" },
  { key: "gpt6", name: "GPT-6 Astra", color: "#10B981" },
  { key: "opus55", name: "Claude Opus 5.5", color: "#FB923C" },
];

/** "70.4%", "$16,484", "1736" -> number for sorting/CSV; "—" -> null. */
function parseBenchScore(raw: string): number | null {
  const n = parseFloat(raw.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** 1 -> "01" for the chapter and card counters. */
const pad2 = (n: number) => String(n).padStart(2, "0");

/** Counts shown in the UI come from the data, so they cannot drift from it. */
const CHAPTER_COUNT = CARBON_CHAPTERS.length;
const {
  total: BENCH_TOTAL,
  carbonWins: BENCH_CARBON_WINS,
  masterTable: MASTER_TABLE_ROWS,
  masterTableCarbonWins: MASTER_TABLE_CARBON_WINS,
} = CARBON_BENCHMARK_STATS;
/** Table rows that come from their own official chart, not the master table. */
const OFF_TABLE_BENCHMARKS = CARBON_FULL_BENCHMARKS.filter(
  (row) => row.source !== CARBON_MASTER_TABLE_IMG
)
  .map((row) => row.benchmark)
  .join(" + ");

/**
 * Comparison table below sm: its benchmark name column is pinned (sticky) while
 * the scores swipe under it. Against collapsed borders Chrome paints sticky
 * cells up to a pixel off (row separators step and the Carbon tint shows
 * through), so on phones the table uses separate borders and its cells draw
 * the separators that its rows draw on wider screens. Keyboard focus stays
 * clear of the pinned column too: Tab scrolls a sort button out from under it
 * (scroll padding), and the scroller's focus ring is drawn just outside its
 * edge, where the pinned cells cannot cover it.
 */
const PHONE_TABLE_CLASS =
  "max-sm:[&_table]:border-separate max-sm:[&_table]:border-spacing-0 " +
  "max-sm:[&_thead_th]:border-b-2 max-sm:[&_thead_th]:border-b-[#2A344B] " +
  "max-sm:[&_tbody_td]:border-b max-sm:[&_tbody_td]:border-b-[#1E2638] " +
  "max-sm:[&_tbody_tr:last-child_td]:border-b-0 " +
  "max-sm:[&_div:has(>table)]:scroll-pl-36 " +
  "max-sm:[&_div:has(>table)]:focus-visible:outline-offset-0";

/**
 * The pricing table's version of PHONE_TABLE_CLASS (a plain <table>, on its
 * own colours): below sm its model column is pinned while the prices swipe
 * under it, so it uses separate borders there and its cells draw the 1px
 * lines its rows draw on wider screens (under the header and between rows).
 */
const PHONE_PRICE_TABLE_CLASS =
  "max-sm:border-separate max-sm:border-spacing-0 " +
  "max-sm:[&_th]:border-b max-sm:[&_th]:border-b-[#2A344B] " +
  "max-sm:[&_tbody_tr:not(:last-child)_td]:border-b max-sm:[&_td]:border-b-[#2A344B]";

/** The English version of an image when the asset has one. */
function assetSrc(asset: OfficialChartAsset, es: boolean): string {
  return !es && asset.src_en ? asset.src_en : asset.src;
}

/**
 * Reports whether `scroller` really scrolls (its content runs more than a
 * pixel past its box), now and whenever it or its content resizes, as when
 * the image inside it loads. Returns the cleanup.
 */
function watchOverflow(
  scroller: HTMLElement,
  onChange: (overflowing: boolean) => void
): () => void {
  if (typeof ResizeObserver === "undefined") return () => {};
  const observer = new ResizeObserver(() => {
    onChange(
      scroller.scrollWidth > scroller.clientWidth + 1 ||
        scroller.scrollHeight > scroller.clientHeight + 1
    );
  });
  observer.observe(scroller);
  if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
  return () => observer.disconnect();
}

/**
 * In-page jump that keeps the shareable #noticias hash: scrolls to the link's
 * section and moves focus there too (like the skip link), so the next Tab
 * continues from that section instead of the link left far above.
 */
function jumpToSection(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const target = document.getElementById(e.currentTarget.hash.slice(1));
  target?.scrollIntoView();
  target?.focus({ preventScroll: true });
}

type HeroView = "video" | "short" | "A" | "B" | "C" | "table";

export default function NewsSection({
  lang,
  onOpenLabEpisode,
  onOpenArena,
}: NewsSectionProps) {
  const es = lang === "es";
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(1);
  const [domainFilter, setDomainFilter] = useState<NewsBenchmarkDomain>("all");
  const [heroThumb, setHeroThumb] = useState<HeroView>("video");
  const [zoomedAsset, setZoomedAsset] = useState<OfficialChartAsset | null>(
    null
  );

  // Chart lightbox = modal dialog: focus moves in, Tab stays inside, Escape
  // closes, page scroll locks and focus returns to the opener on close.
  const closeZoom = useCallback(() => setZoomedAsset(null), []);
  const zoomPanelRef = usePixelDialog<HTMLDivElement>(
    zoomedAsset !== null,
    closeZoom
  );
  const zoomTitleId = useId();
  const zoomDescId = useId();

  // The lightbox's image box scrolls on phones and on short screens: like
  // PixelDataTable's scroller, it is focusable (a named region) only while
  // it does, so keyboard users can scroll it too.
  const [zoomBoxOverflowing, setZoomBoxOverflowing] = useState(false);
  const zoomBoxRef = useCallback((box: HTMLDivElement | null) => {
    if (!box) return;
    const stopWatching = watchOverflow(box, setZoomBoxOverflowing);
    return () => {
      stopWatching();
      setZoomBoxOverflowing(false);
    };
  }, []);

  // Pricing table scroller: the same, named by the section heading.
  const priceScrollRef = useRef<HTMLDivElement>(null);
  const [priceOverflowing, setPriceOverflowing] = useState(false);
  const priceTitleId = useId();
  useEffect(() => {
    const scroller = priceScrollRef.current;
    return scroller ? watchOverflow(scroller, setPriceOverflowing) : undefined;
  }, []);

  // Key-facts ticker: one long line that scrolls sideways on most widths.
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerOverflowing, setTickerOverflowing] = useState(false);
  useEffect(() => {
    const ticker = tickerRef.current;
    return ticker ? watchOverflow(ticker, setTickerOverflowing) : undefined;
  }, []);

  const activeChapter =
    CARBON_CHAPTERS.find((c) => c.idx === activeChapterIdx) ||
    CARBON_CHAPTERS[0];

  // Covers B and C exist only in Spanish (no _en file), so English mode only
  // offers the views it can show in English.
  const heroTabs: { id: HeroView; label: string }[] = [
    { id: "video", label: es ? "Video 16:9" : "16:9 Video" },
    { id: "short", label: es ? "Short 9:16" : "9:16 Short" },
    { id: "A", label: es ? "Portada A" : "Cover A" },
    ...(es
      ? [
          { id: "B" as const, label: "14 Dias B" },
          { id: "C" as const, label: "Precios C" },
        ]
      : []),
    { id: "table", label: es ? "Tabla" : "Table" },
  ];
  const activeHeroThumb: HeroView = heroTabs.some((tab) => tab.id === heroThumb)
    ? heroThumb
    : "video";

  const heroImageSrc =
    activeHeroThumb === "A"
      ? es
        ? "/brand/thumbs/carbon_thumb_A.jpg"
        : "/brand/thumbs/carbon_thumb_A_en.jpg"
      : activeHeroThumb === "B"
      ? "/brand/thumbs/carbon_thumb_B.jpg"
      : activeHeroThumb === "C"
      ? "/brand/thumbs/carbon_thumb_C.jpg"
      : CARBON_MASTER_TABLE_IMG;

  // Covers A-C are Mixiuh's own summary art (1280x720); "table" is Google
  // DeepMind's master table (2000x1682). Neither is 4K, so no resolution badge.
  const heroIsTable = activeHeroThumb === "table";
  const heroZoomAsset: OfficialChartAsset = {
    id: `hero-${activeHeroThumb}`,
    title_es: heroIsTable
      ? `Tabla Maestra Oficial Google DeepMind · ${MASTER_TABLE_ROWS} Benchmarks`
      : `Infografia Resumen ${activeHeroThumb} · Radar Mixiuh Noticias IA`,
    title_en: heroIsTable
      ? `Official Google DeepMind Master Table · ${MASTER_TABLE_ROWS} Benchmarks`
      : `Summary Infographic ${activeHeroThumb} · Mixiuh News AI Radar`,
    badge_es: heroIsTable
      ? `CARBON #1 EN ${MASTER_TABLE_CARBON_WINS} DE ${MASTER_TABLE_ROWS}`
      : "RESUMEN VISUAL",
    badge_en: heroIsTable
      ? `CARBON #1 ON ${MASTER_TABLE_CARBON_WINS} OF ${MASTER_TABLE_ROWS}`
      : "VISUAL SUMMARY",
    desc_es:
      "Haz clic afuera, pulsa Esc o usa el boton superior derecho para cerrar la vista ampliada.",
    desc_en:
      "Click outside, press Esc or use the top-right button to close the magnified view.",
    src: heroImageSrc,
    accent: "#00E5FF",
  };

  const chapterZoomAsset: OfficialChartAsset = {
    id: activeChapter.id,
    title_es: activeChapter.chart_title_es,
    title_en: activeChapter.chart_title_en,
    badge_es: activeChapter.badge_es,
    badge_en: activeChapter.badge_en,
    desc_es: activeChapter.explanation_es,
    desc_en: activeChapter.explanation_en,
    src: activeChapter.chart_img,
    accent: activeChapter.accent,
  };

  const ytLongUrl = es
    ? "https://youtu.be/h_wVhlSfl64"
    : "https://youtu.be/1PspBBoP318";
  const ytShortUrl = es
    ? "https://www.youtube.com/shorts/MY_86o2GqEs"
    : "https://www.youtube.com/shorts/tBHRMWmC_Vk";

  return (
    <div className="space-y-12">
      {/* =====================================================================
          1. BREAKING NEWS BROADCAST MASTHEAD & TICKER
         ===================================================================== */}
      <div className="bg-[#111622] border-2 border-[#00E5FF]/45 p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0_#040508] space-y-6">
        {/* Top Broadcast Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2A344B]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#B31935] border border-[#FF3355]/60 font-mono-hud text-xs font-bold text-white shadow-[4px_4px_0_#040508]">
              <span className="w-2.5 h-2.5 bg-white animate-pulse" />
              <span>
                {es
                  ? "ULTIMA HORA · RADAR MIXIUH · NOTICIAS IA #01"
                  : "BREAKING NEWS · MIXIUH NEWS · AI RADAR #01"}
              </span>
            </span>

            <span className="px-3 py-1.5 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#FFD100]/50 font-mono-hud text-xs font-bold text-[#FFD100]">
              {es ? CARBON_NEWS_META.date_es : CARBON_NEWS_META.date_en}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
            <a
              href={CARBON_NEWS_META.officialBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 shadow-[4px_4px_0_#040508] bg-[#090B10] hover:bg-[#1A2132] border border-[#00E5FF]/45 text-[#00E5FF] font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>
                {es ? "Anuncio Oficial Google" : "Official Google Blog"}
              </span>
              <PixelIcon name="external" size={14} />
            </a>
            <a
              href={CARBON_NEWS_META.officialMethodologyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 shadow-[4px_4px_0_#040508] bg-[#090B10] hover:bg-[#1A2132] border border-[#10B981]/45 text-[#10B981] font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>
                {es ? "Metodologia DeepMind" : "DeepMind Methodology"}
              </span>
              <PixelIcon name="external" size={14} />
            </a>
            <a
              href={CARBON_NEWS_META.officialFairwindUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 shadow-[4px_4px_0_#040508] bg-[#090B10] hover:bg-[#1A2132] border border-[#A855F7]/45 text-[#C084FC] font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>Google Fairwind</span>
              <PixelIcon name="external" size={14} />
            </a>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] font-mono-hud text-xs font-bold">
              {es
                ? "COBERTURA ESPECIAL · REPORTE OFICIAL GOOGLE DEEPMIND EXPLICADO CON EJEMPLOS"
                : "SPECIAL COVERAGE · OFFICIAL GOOGLE DEEPMIND REPORT EXPLAINED WITH EXAMPLES"}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
              {es ? (
                <>
                  Google anuncia{" "}
                  <span className="text-[#00E5FF]">Gemini 4 Carbon</span>: El
                  Nuevo <span className="text-[#10B981]">#1 Mundial</span>{" "}
                  <span className="text-[#FFD100]">
                    (14 Dias Despues de Argon)
                  </span>
                </>
              ) : (
                <>
                  Google Unveils{" "}
                  <span className="text-[#00E5FF]">Gemini 4 Carbon</span>: The
                  New <span className="text-[#10B981]">World #1</span>{" "}
                  <span className="text-[#FFD100]">(14 Days After Argon)</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              {es
                ? "Apenas dos semanas despues de lanzar Gemini 4 Argon (50 pts), Google DeepMind presento a su hermano mayor de razonamiento profundo: Gemini 4 Carbon. Toma el puesto #1 mundial en Artificial Analysis v5.0 con 59 puntos (superando los 58 de Claude Opus 5.5 y los 57 de GPT-6 Astra), duplica a Argon en ingenieria de software extrema (9.6% en SWE-sweep), rompe records en ciberseguridad (88.2% en SEC-bench Pro y 71.0% en CWE-bench sobre Google Antigravity) y en Gray Swan deja en 0.0% el exito de los ataques de Prompt Injection indirecta, aun cuando el atacante tiene 15 intentos."
                : "Just two weeks after releasing Gemini 4 Argon (50 pts), Google DeepMind unveiled its deep-reasoning big brother: Gemini 4 Carbon. It claims the #1 world spot on Artificial Analysis v5.0 with 59 points (beating Claude Opus 5.5 at 58 and GPT-6 Astra at 57), more than doubles Argon on extreme agentic coding (9.6% SWE-sweep), sets cybersecurity records (88.2% SEC-bench Pro and 71.0% CWE-bench on Google Antigravity), and holds indirect Prompt Injection attacks on Gray Swan to a 0.0% success rate, even when the attacker gets 15 attempts."}
            </p>

            {/* 4 Hero Concept KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#00E5FF]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#00E5FF]">
                  {es ? "PODIO MUNDIAL AA V5.0" : "WORLD PODIUM AA V5.0"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  59 PTS
                </div>
                <div className="font-mono-hud text-[11px] text-[#10B981] font-bold mt-0.5">
                  #1 (Opus 58 · GPT-6 57)
                </div>
              </div>

              <div className="p-3.5 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#10B981]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#10B981]">
                  {es ? "SEC-BENCH PRO · CIBER" : "SEC-BENCH PRO · CYBER"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  88.2%
                </div>
                <div className="font-mono-hud text-[11px] text-[#00E5FF] font-bold mt-0.5">
                  71.0% CWE Antigravity #1
                </div>
              </div>

              <div className="p-3.5 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#A855F7]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#C084FC]">
                  GRAY SWAN IPI
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  0.0%
                </div>
                <div className="font-mono-hud text-[11px] text-[#10B981] font-bold mt-0.5">
                  {es ? "Aun con 15 intentos" : "Even at 15 tries"}
                </div>
              </div>

              <div className="p-3.5 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#FFD100]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#FFD100]">
                  {es ? "PRECIO API (1M TOK)" : "API PRICE (1M TOK)"}
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-white mt-1">
                  $2/$10 → $4/$20
                </div>
                <div className="font-mono-hud text-[11px] text-[#FFD100] font-bold mt-0.5">
                  {es ? "Se duplica post-promo" : "Doubles post-promo"}
                </div>
              </div>
            </div>

            {/* Quick Section Jump + Omnichannel Social Video Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={ytLongUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#FF3355] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5 shadow-[4px_4px_0_#040508]"
              >
                <PixelIcon name="play" size={16} />
                <span>
                  {es
                    ? "Ver Video en YouTube (4K60)"
                    : "Watch on YouTube (4K60)"}
                </span>
                <PixelIcon name="external" size={14} />
              </a>

              <a
                href={ytShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 shadow-[4px_4px_0_#040508] bg-[#090B10] hover:bg-[#1A2132] border border-[#FF3355]/50 text-[#FF3355] font-mono-hud text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <PixelIcon name="play" size={14} />
                <span>{es ? "YouTube Short (4K60)" : "YouTube Short (4K60)"}</span>
                <PixelIcon name="external" size={12} />
              </a>

              <a
                href="#explorador-capitulos-carbon"
                onClick={jumpToSection}
                className="px-4 py-2.5 bg-[#00E5FF] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5 shadow-[4px_4px_0_#040508]"
              >
                <PixelIcon name="sparkles" size={16} />
                <span>
                  {es
                    ? `${CHAPTER_COUNT} Capitulos Interactivos`
                    : `${CHAPTER_COUNT} Interactive Chapters`}
                </span>
              </a>

              <a
                href="#tabla-oficial-benchmarks-carbon"
                onClick={jumpToSection}
                className="px-4 py-2.5 shadow-[4px_4px_0_#040508] bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
              >
                <PixelIcon name="file" size={16} />
                <span>
                  {es
                    ? `Tabla (${BENCH_TOTAL} Benchmarks)`
                    : `Table (${BENCH_TOTAL} Benchmarks)`}
                </span>
              </a>
            </div>

            {/* Omnichannel Social Bar (YT · IG Reels · TikTok · X) */}
            <div className="p-3 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-[11px]">
              <span className="text-[#00E5FF] font-bold">
                {es
                  ? "PUBLICADO EN TODAS LAS REDES:"
                  : "PUBLISHED ACROSS ALL NETWORKS:"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={ytLongUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#FF3355]/15 border border-[#FF3355]/70 text-[#F5F2EB] hover:bg-[#FF3355] hover:text-[#090B10] font-bold inline-flex items-center gap-1"
                >
                  <span>YouTube 16:9</span>
                  <PixelIcon name="arrow-up-right" size={12} />
                </a>
                <a
                  href={ytShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#FF3355]/15 border border-[#FF3355]/70 text-[#F5F2EB] hover:bg-[#FF3355] hover:text-[#090B10] font-bold inline-flex items-center gap-1"
                >
                  <span>YT Shorts 9:16</span>
                  <PixelIcon name="arrow-up-right" size={12} />
                </a>
                <a
                  href="https://www.instagram.com/labs.mixiuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#FF3355]/15 border border-[#FF3355]/70 text-[#F5F2EB] hover:bg-[#FF3355] hover:text-[#090B10] font-bold inline-flex items-center gap-1"
                >
                  <span>IG Reels (@labs.mixiuh)</span>
                  <PixelIcon name="arrow-up-right" size={12} />
                </a>
                <a
                  href="https://www.tiktok.com/@mixiuhlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>TikTok (@mixiuhlabs)</span>
                  <PixelIcon name="arrow-up-right" size={12} />
                </a>
                <a
                  href="https://x.com/MixiuhLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#1A2132] border border-[#3A4560] text-white hover:bg-[#2A344B] font-bold inline-flex items-center gap-1"
                >
                  <span>
                    {es ? "X / Hilo (@MixiuhLabs)" : "X / Thread (@MixiuhLabs)"}
                  </span>
                  <PixelIcon name="arrow-up-right" size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Video (16:9 & 9:16 Short) + Infographic Switcher */}
          <div className="lg:col-span-5 space-y-3">
            <div className="overflow-hidden border-2 border-[#00E5FF]/60 bg-[#090B10] shadow-[6px_6px_0_#040508]">
              <div className="px-3 py-2.5 bg-[#111622] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
                {/* The local files are 1280x720 at 30 fps, so no "4K60" here. */}
                <span className="font-mono-hud text-[11px] font-bold text-[#00E5FF]">
                  {es
                    ? "VIDEO OFICIAL & INFOGRAFIAS"
                    : "OFFICIAL VIDEO & INFOGRAPHICS"}
                </span>
                <div
                  role="group"
                  aria-label={
                    es ? "Elegir video o infografia" : "Choose video or infographic"
                  }
                  className="flex flex-wrap bg-[#090B10] p-0.5 border border-[#2A344B] font-mono-hud text-[10px]"
                >
                  {heroTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={activeHeroThumb === tab.id}
                      onClick={() => setHeroThumb(tab.id)}
                      className={`px-2 py-1 font-bold transition cursor-pointer ${
                        activeHeroThumb === tab.id
                          ? "bg-[#00E5FF] text-[#090B10]"
                          : "text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeHeroThumb === "video" ? (
                <div className="relative aspect-video bg-black">
                  <video
                    key={`carbon-video-${lang}`}
                    controls
                    playsInline
                    preload="metadata"
                    poster={
                      es
                        ? "/brand/thumbs/carbon_thumb_A.jpg"
                        : "/brand/thumbs/carbon_thumb_A_en.jpg"
                    }
                    className="w-full h-full object-contain"
                  >
                    <source
                      src={
                        es
                          ? "/videos/carbon-reporte-es.mp4"
                          : "/videos/carbon-reporte-en.mp4"
                      }
                      type="video/mp4"
                    />
                    <track
                      kind="captions"
                      src={
                        es
                          ? "/videos/carbon_captions_es.vtt"
                          : "/videos/carbon_captions_en.vtt"
                      }
                      srcLang={lang}
                      label={es ? "Español" : "English"}
                      default
                    />
                  </video>
                </div>
              ) : activeHeroThumb === "short" ? (
                <div className="relative aspect-video max-sm:aspect-auto bg-[#090B10] flex items-center justify-center p-2">
                  {/* No <track> on purpose: the Short has its own script with
                      burned-in (open) word-by-word captions. carbon_captions_*.vtt
                      belong to the long report and do not match this audio.
                      Phones size the player by the card's width: inside the
                      16:9 box it would be under 90px wide. */}
                  <video
                    key={`carbon-short-${lang}`}
                    controls
                    playsInline
                    preload="metadata"
                    poster={
                      es
                        ? "/brand/thumbs/carbon_short_cover_es.jpg"
                        : "/brand/thumbs/carbon_short_cover_en.jpg"
                    }
                    className="h-full max-h-[340px] aspect-[9/16] max-sm:h-auto max-sm:w-full max-sm:max-w-[20rem] max-sm:max-h-[75svh] border border-[#00E5FF]/40 object-contain bg-black shadow-[4px_4px_0_#040508]"
                  >
                    <source
                      src={
                        es
                          ? "/videos/carbon-short-es.mp4"
                          : "/videos/carbon-short-en.mp4"
                      }
                      type="video/mp4"
                    />
                  </video>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setZoomedAsset(heroZoomAsset)}
                  aria-label={
                    es
                      ? `Clic para ampliar: ${heroZoomAsset.title_es}`
                      : `Click to magnify: ${heroZoomAsset.title_en}`
                  }
                  className="relative block w-full aspect-video bg-[#090B10] cursor-zoom-in group overflow-hidden focus-visible:outline-none"
                >
                  <img
                    src={heroImageSrc}
                    alt={es ? heroZoomAsset.title_es : heroZoomAsset.title_en}
                    className="absolute inset-0 w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#090B10] border border-[#00E5FF]/50 font-mono-hud text-[11px] font-bold text-[#00E5FF]">
                    {es ? "Clic para ampliar ↗" : "Click to magnify ↗"}
                  </span>
                  {/* Focus ring drawn above the picture: the button's own outline
                      would sit under the image and be clipped by the card edge. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 group-focus-visible:outline-2 group-focus-visible:outline-[var(--px-focus)] group-focus-visible:outline-offset-[-4px]"
                  />
                </button>
              )}
            </div>

            {/* Live Key Ticker Strip */}
            <div
              ref={tickerRef}
              role={tickerOverflowing ? "region" : undefined}
              aria-label={tickerOverflowing ? (es ? "Datos clave" : "Key facts") : undefined}
              tabIndex={tickerOverflowing ? 0 : undefined}
              className="p-3 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B] font-mono-hud text-[11px] text-[#EAE5D9] flex items-center gap-2.5 overflow-x-auto whitespace-nowrap focus-visible:outline-offset-[-3px]"
            >
              <span className="px-2 py-0.5 bg-[#B31935] text-white font-bold shrink-0">
                {es ? "DATOS CLAVE" : "KEY FACTS"}
              </span>
              <span>
                {(es
                  ? CARBON_NEWS_META.ticker_es
                  : CARBON_NEWS_META.ticker_en
                ).join("   ///   ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. INTERACTIVE 8-CHAPTER CONCEPTUAL & TELEMETRY EXPLORER
         ===================================================================== */}
      {/* tabIndex -1: focus target of the "N Capitulos Interactivos" jump link */}
      <section
        id="explorador-capitulos-carbon"
        tabIndex={-1}
        className="space-y-5 focus:outline-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2A344B] pb-4">
          <div>
            <div className="font-mono-hud text-xs font-bold text-[#00E5FF] uppercase mb-1">
              {es
                ? `DESGLOSE INTERACTIVO EN ${CHAPTER_COUNT} CAPITULOS · PUNTOS CLAVE Y TELEMETRIA`
                : `${CHAPTER_COUNT}-CHAPTER INTERACTIVE BREAKDOWN · KEY POINTS & TELEMETRY`}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              {es
                ? "Todo el Reporte de Gemini 4 Carbon Explicado Paso a Paso"
                : "The Complete Gemini 4 Carbon Report Explained Step by Step"}
            </h2>
          </div>
          <span className="font-mono-hud text-xs text-[#00E5FF]">
            {es
              ? `Selecciona cualquiera de los ${CHAPTER_COUNT} temas para ver sus tarjetas conceptuales y grafica oficial`
              : `Select any of the ${CHAPTER_COUNT} topics to inspect its conceptual cards and official chart`}
          </span>
        </div>

        {/* Chapter Selector Grid (single choice: the pressed button is the open chapter) */}
        <div
          role="group"
          aria-label={es ? "Capitulos del reporte" : "Report chapters"}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2"
        >
          {CARBON_CHAPTERS.map((ch) => {
            const active = ch.idx === activeChapterIdx;
            return (
              <button
                key={ch.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveChapterIdx(ch.idx)}
                className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer flex flex-col justify-between ${
                  active
                    ? "bg-[#1A2132] border-[#00E5FF] shadow-[4px_4px_0_#040508]"
                    : "bg-[#111622] border-[#2A344B] hover:border-[#3A4560]"
                }`}
              >
                <div className="flex items-center justify-between font-mono-hud text-[10px] gap-1">
                  <span className="text-[#00E5FF] font-bold">
                    {pad2(ch.idx)} · {ch.timestamp}
                  </span>
                </div>
                <div className="font-display text-xs font-bold text-white mt-1.5 line-clamp-2">
                  {es ? ch.badge_es : ch.badge_en}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Stage Card */}
        <div className="bg-[#111622] border-2 border-[#00E5FF]/40 overflow-hidden shadow-[6px_6px_0_#040508]">
          {/* Stage Header */}
          <div className="p-5 sm:p-6 bg-[#1A2132] border-b border-[#2A344B] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                <span
                  className="px-2.5 py-0.5 font-bold text-[#090B10]"
                  style={{ backgroundColor: activeChapter.accent }}
                >
                  {es ? activeChapter.badge_es : activeChapter.badge_en}
                </span>
                <span className="text-[#00E5FF] font-bold">
                  {es ? activeChapter.kicker_es : activeChapter.kicker_en}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                {es ? activeChapter.title_es : activeChapter.title_en}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono-hud text-xs">
              <button
                type="button"
                onClick={() =>
                  setActiveChapterIdx((prev) => (prev > 1 ? prev - 1 : CHAPTER_COUNT))
                }
                className="px-3 py-1.5 bg-[#090B10] hover:bg-[#111622] text-[#94A3B8] hover:text-white border border-[#2A344B] cursor-pointer"
              >
                {es ? "← Anterior" : "← Prev"}
              </button>
              <span className="px-3 py-1.5 bg-[#090B10] text-white font-bold border border-[#2A344B]">
                {pad2(activeChapter.idx)} / {pad2(CHAPTER_COUNT)}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveChapterIdx((prev) => (prev < CHAPTER_COUNT ? prev + 1 : 1))
                }
                className="px-3 py-1.5 bg-[#00E5FF] text-[#090B10] font-bold hover:brightness-110 cursor-pointer"
              >
                {es ? "Siguiente →" : "Next →"}
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-8">
            {/* A. 3 Conceptual Visual Cards (Matching v3.0 Video Engine!) */}
            <div className="space-y-3">
              <div className="font-mono-hud text-xs font-bold text-[#FFD100] uppercase">
                {es
                  ? activeChapter.concept_hdr_es
                  : activeChapter.concept_hdr_en}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeChapter.nodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-5 bg-[#090B10] border-2 flex flex-col justify-between gap-4 shadow-[4px_4px_0_#040508]"
                    style={{ borderColor: `${node.color}66` }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="px-3 py-1 font-mono-hud text-xs font-bold bg-[#111622] border"
                        style={{
                          borderColor: `${node.color}66`,
                          color: node.color,
                        }}
                      >
                        {es ? node.tag_es : node.tag_en}
                      </span>
                      <span className="font-mono-hud text-xs text-[#94A3B8]">
                        {pad2(i + 1)}/{pad2(activeChapter.nodes.length)}
                      </span>
                    </div>

                    <div className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {es ? node.stat : (node.stat_en ?? node.stat)}
                    </div>

                    <div className="space-y-2">
                      <div
                        className="w-full py-2 px-3 shadow-[4px_4px_0_#040508] font-mono-hud text-xs font-bold text-white text-center border"
                        style={{
                          backgroundColor: "#1A2132",
                          borderColor: node.color,
                        }}
                      >
                        {es ? node.pill1_es : node.pill1_en}
                      </div>
                      <div className="w-full py-1.5 px-3 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] font-mono-hud text-xs font-bold text-[#FFD100] text-center">
                        {es ? node.pill2_es : node.pill2_en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B. Telemetry Bars + Official Google DeepMind Chart Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left: Animated Telemetry Comparison Bars */}
              <div className="lg:col-span-6 p-5 sm:p-6 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#2A344B] flex flex-col justify-between space-y-4">
                <div>
                  <div className="font-mono-hud text-xs font-bold text-[#FFD100] uppercase mb-4">
                    {es
                      ? activeChapter.bars_title_es
                      : activeChapter.bars_title_en}
                  </div>
                  <div className="space-y-3.5">
                    {activeChapter.bars.map((bar, bIdx) => {
                      const pct = Math.max(
                        6,
                        Math.min(100, (bar.value / bar.max) * 100)
                      );
                      return (
                        <div
                          key={bIdx}
                          className={`p-3.5 shadow-[4px_4px_0_#040508] border ${
                            bar.isCarbon
                              ? "bg-[#111622] border-[#00E5FF]/70"
                              : "bg-[#111622] border-[#2A344B]"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono-hud text-xs mb-2 gap-2">
                            <span className="font-bold text-white">
                              {es ? bar.model : (bar.model_en ?? bar.model)}
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: bar.color }}
                            >
                              {es ? bar.label_es : bar.label_en}
                            </span>
                          </div>
                          <div className="w-full h-3.5 bg-[#090B10] overflow-hidden p-0.5 border border-[#2A344B]">
                            <div
                              className="h-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: bar.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verified Quote Box */}
                <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#00E5FF]/30 space-y-1.5">
                  <div className="flex items-center justify-between font-mono-hud text-[11px]">
                    <span className="font-bold text-[#00E5FF]">
                      {es
                        ? activeChapter.quote.author
                        : activeChapter.quote.author_en}
                    </span>
                    <span className="text-[#94A3B8]">
                      {es
                        ? activeChapter.quote.role_es
                        : activeChapter.quote.role_en}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F5F2EB] italic leading-relaxed">
                    &ldquo;
                    {es
                      ? activeChapter.quote.text_es
                      : activeChapter.quote.text_en}
                    &rdquo;
                  </p>
                </div>
              </div>

              {/* Right: Official Chart + Plain-Language Explanation */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setZoomedAsset(chapterZoomAsset)}
                  // Starts with the visible title, then the visible "Ampliar" (WCAG label in name)
                  aria-label={
                    es
                      ? `${activeChapter.chart_title_es}, ampliar`
                      : `${activeChapter.chart_title_en}, zoom`
                  }
                  className="block w-full text-left shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#2A344B] overflow-hidden cursor-zoom-in group"
                >
                  <span className="px-4 py-2.5 bg-[#111622] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                    <span className="text-white font-bold truncate">
                      {es
                        ? activeChapter.chart_title_es
                        : activeChapter.chart_title_en}
                    </span>{" "}
                    <span className="text-[#00E5FF] font-bold shrink-0 ml-2">
                      {es ? "Ampliar ↗" : "Zoom ↗"}
                    </span>
                  </span>
                  <span className="p-3 bg-[#F5F2EB] flex items-center justify-center max-h-[340px] overflow-hidden">
                    <img
                      src={activeChapter.chart_img}
                      alt={
                        es
                          ? activeChapter.chart_title_es
                          : activeChapter.chart_title_en
                      }
                      loading="lazy"
                      decoding="async"
                      className="max-h-[310px] w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </span>
                </button>

                {/* Pedagogical Explanation Card */}
                <div className="p-5 shadow-[6px_6px_0_#040508] bg-[#090B10] border-2 border-[#10B981]/35 space-y-2.5">
                  <div className="font-mono-hud text-xs font-bold text-[#10B981] uppercase">
                    {es
                      ? "¿QUE SIGNIFICA ESTO EN LA PRACTICA?"
                      : "WHAT DOES THIS MEAN IN PRACTICE?"}
                  </div>
                  <p className="text-xs sm:text-sm text-[#EAE5D9] leading-relaxed">
                    {es
                      ? activeChapter.explanation_es
                      : activeChapter.explanation_en}
                  </p>
                  <p className="text-xs sm:text-sm text-[#00E5FF] font-medium leading-relaxed">
                    {es ? activeChapter.example_es : activeChapter.example_en}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. OFFICIAL BENCHMARK COMPARISON TABLE (counts: CARBON_BENCHMARK_STATS)
         ===================================================================== */}
      {/* tabIndex -1: focus target of the "Tabla (N Benchmarks)" jump link */}
      <section
        id="tabla-oficial-benchmarks-carbon"
        tabIndex={-1}
        className="space-y-3 focus:outline-none"
      >
        <div className="space-y-1">
          <div className="font-mono-hud text-xs font-bold text-[#00E5FF] uppercase">
            {es
              ? `DATOS OFICIALES DE GOOGLE DEEPMIND · CARBON #1 EN ${BENCH_CARBON_WINS} DE ${BENCH_TOTAL}`
              : `OFFICIAL GOOGLE DEEPMIND DATA · CARBON #1 ON ${BENCH_CARBON_WINS} OF ${BENCH_TOTAL}`}
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-white">
            {es
              ? "Tabla Comparativa Completa: Gemini 4 Carbon vs. Argon vs. GPT-6 Astra vs. Claude Opus 5.5"
              : "Full Benchmark Table: Gemini 4 Carbon vs. Argon vs. GPT-6 Astra vs. Claude Opus 5.5"}
          </h2>
          <p className="font-mono-hud text-xs text-[#94A3B8]">
            {es
              ? "Ordena cualquier columna, filtra por dominio o busca un benchmark y exporta el resultado a CSV."
              : "Sort any column, filter by domain or search a benchmark, then export the result to CSV."}
          </p>
        </div>

        <PixelSwipeHint
          label={es ? "Desliza para ver los 4 modelos" : "Swipe to see all 4 models"}
        />
        <PixelDataTable<CarbonBenchmarkRow>
          caption={
            es
              ? `${BENCH_TOTAL} benchmarks oficiales (los ${MASTER_TABLE_ROWS} de la tabla maestra + ${OFF_TABLE_BENCHMARKS} de su grafica oficial): Gemini 4 Carbon, Gemini 4 Argon, GPT-6 Astra y Claude Opus 5.5`
              : `${BENCH_TOTAL} official benchmarks (the master table's ${MASTER_TABLE_ROWS} + ${OFF_TABLE_BENCHMARKS} from its own official chart): Gemini 4 Carbon, Gemini 4 Argon, GPT-6 Astra and Claude Opus 5.5`
          }
          tone="cyan"
          locale="es"
          searchable
          exportFileName={`gemini-4-carbon-${BENCH_TOTAL}-benchmarks.csv`}
          // Toolbar rows: the domain tabs get the first row, so the search never
          // gets squeezed beside them (its text is 16px on touch screens). On
          // phones the search also takes its own row and "Exportar CSV" wraps below.
          toolbarLayout="stacked"
          className={`sm:[&_table]:min-w-[880px] ${PHONE_TABLE_CLASS}`}
          rows={CARBON_FULL_BENCHMARKS.filter(
            (row) => domainFilter === "all" || row.domain === domainFilter
          )}
          getRowId={(row) => String(row.n)}
          initialSort={{ key: "n", direction: "asc" }}
          labels={
            es
              ? { searchPlaceholder: "Buscar benchmark..." }
              : {
                  search: "Search the table",
                  searchPlaceholder: "Search benchmarks...",
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
                }
          }
          toolbar={
            <PixelTabs
              ariaLabel={es ? "Dominio" : "Domain"}
              tone="cyan"
              size="sm"
              wrap
              value={domainFilter}
              onChange={setDomainFilter}
              items={BENCH_DOMAINS.map((d) => ({
                id: d.id,
                label: es ? d.es : d.en,
                badge:
                  d.id === "all"
                    ? CARBON_FULL_BENCHMARKS.length
                    : CARBON_FULL_BENCHMARKS.filter((r) => r.domain === d.id).length,
              }))}
            />
          }
          // Phones: no "#" column, a narrow name column (the subtitle is only
          // read out) and no 880px minimum (the score columns keep their
          // content width), so the name and two scores fit at rest. The name
          // column stays put while the scores swipe under it (PHONE_TABLE_CLASS);
          // its cells take their row's stripe/hover colour (bg-inherit) so
          // nothing shows through. Its edge is a border, not a box-shadow: the
          // table's inline sort underline would replace a shadow on its header.
          columns={[
            {
              key: "n",
              header: "#",
              value: (r) => r.n,
              render: (r) => (
                <span className="font-bold text-[#00E5FF]">{String(r.n).padStart(2, "0")}</span>
              ),
              headerClassName: "max-sm:hidden",
              className: "max-sm:hidden",
            },
            {
              key: "benchmark",
              header: (
                <>
                  <span className="sm:hidden">Benchmark</span>
                  <span className="max-sm:hidden">
                    {es ? "Benchmark y que mide" : "Benchmark & what it tests"}
                  </span>
                </>
              ),
              headerText: es ? "Benchmark y que mide" : "Benchmark & what it tests",
              value: (r) => `${r.benchmark} ${es ? r.subtitle_es : r.subtitle_en}`,
              render: (r) => (
                <div className="sm:min-w-[200px]">
                  <div className="font-bold text-white">{r.benchmark}</div>
                  <div className="max-sm:sr-only text-[11px] text-[#94A3B8]">
                    {es ? r.subtitle_es : r.subtitle_en}
                  </div>
                </div>
              ),
              headerClassName:
                "max-sm:sticky max-sm:left-0 max-sm:z-[1] max-sm:w-36 max-sm:bg-[#090B10] max-sm:border-r max-sm:border-r-[#2A344B]",
              className:
                "max-sm:sticky max-sm:left-0 max-sm:z-[1] max-sm:w-36 max-sm:bg-inherit max-sm:border-r max-sm:border-r-[#2A344B]",
            },
            ...MODEL_COLUMNS.map((m) => ({
              key: m.key,
              header: m.name,
              value: (r: CarbonBenchmarkRow) => parseBenchScore(r[m.key]),
              render: (r: CarbonBenchmarkRow) => (
                <span
                  className={m.key === "carbon" ? "font-black text-base" : ""}
                  style={{ color: m.color }}
                >
                  {r[m.key]}
                </span>
              ),
              align: "right" as const,
              headerClassName: m.key === "carbon" ? "bg-[#00E5FF]/10" : undefined,
              className: m.key === "carbon" ? "bg-[#00E5FF]/10" : undefined,
            })),
            {
              key: "highlight",
              header: es ? "Puesto de Carbon y margen" : "Carbon rank & margin",
              value: (r) => (es ? r.highlight_es : r.highlight_en),
              sortable: false,
              // Phones: a wrapped block with a whole-pixel line height. The
              // inherited 14.67px one leaves rows on sub-pixel offsets, where
              // the pinned name cells drift a pixel from their row's separator.
              render: (r) => (
                <span
                  className={`inline-block max-sm:block max-sm:min-w-44 max-sm:leading-4 px-2.5 py-1 font-bold text-[11px] ${
                    r.winner === "carbon"
                      ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                      : "bg-[#1A2132] text-[#EAE5D9]"
                  }`}
                >
                  {es ? r.highlight_es : r.highlight_en}
                </span>
              ),
            },
          ]}
        />
      </section>

      {/* =====================================================================
          4. API PRICING & FINE PRINT TABLE ($2/$10 -> $4/$20 USD)
         ===================================================================== */}
      <section id="letra-pequena-precios-carbon" className="space-y-5">
        {/* Phones: no overflow clip, so the table's focus ring (drawn just
            outside its scroller there) is not cut off by this card. */}
        <div className="bg-[#111622] border-2 border-[#FFD100]/45 overflow-hidden max-sm:overflow-visible shadow-[6px_6px_0_#040508]">
          <div className="p-5 sm:p-6 bg-[#1A2132] border-b border-[#2A344B]">
            <div className="font-mono-hud text-xs font-bold text-[#FFD100] uppercase">
              {es
                ? "AUDITORIA DE COSTOS API · LA LETRA PEQUENA DEL ANUNCIO OFICIAL"
                : "API COST AUDIT · THE OFFICIAL ANNOUNCEMENT FINE PRINT"}
            </div>
            <h2
              id={priceTitleId}
              className="font-display text-xl sm:text-2xl font-black text-white mt-0.5"
            >
              {es
                ? "Precio por 1 Millon de Tokens: Promo de Lanzamiento ($2/$10) vs. Tarifa Estandar ($4/$20)"
                : "Price per 1 Million Tokens: Launch Promo ($2/$10) vs. Standard Rate ($4/$20)"}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              {es
                ? "Durante el lanzamiento, Gemini 4 Carbon cuesta exactamente lo mismo que Gemini 4 Argon ($2 entrada / $10 salida). Al concluir la promo, su precio estandar se duplica a $4 / $20 USD (quedando aun 20% por debajo de los $5 / $25 USD de Claude Opus 5.5)."
                : "During launch, Gemini 4 Carbon costs the exact same as Gemini 4 Argon ($2 input / $10 output). After the promo window ends, its standard price doubles to $4 / $20 USD (remaining 20% cheaper than Claude Opus 5.5 at $5 / $25 USD)."}
            </p>
          </div>

          {/* Phones get the comparison table's treatment: the model column
              stays put while the prices swipe under it (PHONE_PRICE_TABLE_CLASS),
              its cells take their row's opaque colour (bg-inherit), whole-pixel
              line heights keep every row on whole pixels (where the pinned cells
              meet their row's separator), scroll padding keeps a scrolled-to
              cell clear of the pinned column and the focus ring sits just
              outside the scroller, where the pinned cells cannot cover it. */}
          <div
            ref={priceScrollRef}
            role={priceOverflowing ? "region" : undefined}
            aria-labelledby={priceOverflowing ? priceTitleId : undefined}
            tabIndex={priceOverflowing ? 0 : undefined}
            className="overflow-x-auto focus-visible:outline-offset-[-3px] max-sm:scroll-pl-36 max-sm:focus-visible:outline-offset-0"
          >
            <table
              className={`w-full text-left border-collapse ${PHONE_PRICE_TABLE_CLASS}`}
            >
              <thead>
                <tr className="bg-[#090B10] border-b border-[#2A344B] font-mono-hud text-[11px] max-sm:leading-[18px] uppercase text-[#94A3B8]">
                  <th className="py-3.5 px-4 max-sm:sticky max-sm:left-0 max-sm:z-[1] max-sm:w-36 max-sm:bg-[#090B10] max-sm:border-r max-sm:border-r-[#2A344B]">
                    {es ? "Modelo y Modalidad" : "Model & Tier"}
                  </th>
                  <th className="py-3.5 px-4">
                    {es ? "Entrada (<=200k)" : "Input (<=200k)"}
                  </th>
                  <th className="py-3.5 px-4">
                    {es ? "Salida (<=200k)" : "Output (<=200k)"}
                  </th>
                  <th className="py-3.5 px-4">
                    {es ? "Contexto Largo (>200k)" : "Long Context (>200k)"}
                  </th>
                  <th className="py-3.5 px-4">Context Caching</th>
                  <th className="py-3.5 px-4">{es ? "Nota Clave" : "Note"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A344B] text-xs sm:text-sm">
                {CARBON_PRICING_TABLE.map((row, idx) => (
                  <tr
                    key={idx}
                    className="max-sm:bg-[#111622] hover:bg-[#1A2132] transition"
                  >
                    {/* Phones: badge above the name, so the pinned column stays narrow */}
                    <td className="py-4 px-4 max-sm:sticky max-sm:left-0 max-sm:z-[1] max-sm:w-36 max-sm:bg-inherit max-sm:border-r max-sm:border-r-[#2A344B]">
                      <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-1.5">
                        <span
                          className="px-2 py-0.5 font-mono-hud text-[10px] max-sm:leading-[13px] font-bold text-[#090B10]"
                          style={{ backgroundColor: row.color }}
                        >
                          {es ? row.badge_es : row.badge_en}
                        </span>
                        <span className="font-bold text-white">
                          {es ? row.model_es : row.model_en}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-4 px-4 font-mono-hud font-bold"
                      style={{ color: row.color }}
                    >
                      {row.input_200k}
                    </td>
                    <td
                      className="py-4 px-4 font-mono-hud font-bold"
                      style={{ color: row.color }}
                    >
                      {row.output_200k}
                    </td>
                    <td className="py-4 px-4 font-mono-hud text-white">
                      {row.input_long} / {row.output_long}
                    </td>
                    <td className="py-4 px-4 font-mono-hud text-[#10B981] font-bold">
                      {row.caching}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#94A3B8]">
                      {es ? row.note_es : row.note_en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. OFFICIAL GOOGLE DEEPMIND CHART GALLERY (CLICK TO ZOOM)
         ===================================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2A344B] pb-4">
          <div>
            <div className="font-mono-hud text-xs font-bold text-[#00E5FF] uppercase mb-1">
              {es
                ? "EVIDENCIA PRIMARIA · GALERIA DE GRAFICAS OFICIALES"
                : "PRIMARY EVIDENCE · OFFICIAL CHART GALLERY"}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              {es
                ? "Graficas Oficiales de Google DeepMind e Infografias"
                : "Official Google DeepMind Charts & Infographics"}
            </h2>
          </div>
          <span className="font-mono-hud text-xs text-[#94A3B8]">
            {es
              ? "Haz clic en cualquier grafica para inspeccionarla en tamano completo"
              : "Click any chart to inspect it at full resolution"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARBON_OFFICIAL_GALLERY.map((item) => (
            // The "Ampliar" button below stretches over the whole card (after:inset-0),
            // so a click anywhere still opens the chart while the h3 stays a heading.
            <div
              key={item.id}
              className="relative bg-[#111622] border-2 border-[#2A344B] hover:border-[#00E5FF]/60 has-[:focus-visible]:border-[#00E5FF]/60 overflow-hidden shadow-[4px_4px_0_#040508] flex flex-col justify-between cursor-zoom-in group transition"
            >
              <div>
                <div className="p-3 bg-[#F5F2EB] aspect-video flex items-center justify-center overflow-hidden">
                  {/* Near the end of the view: load on approach (the 2000px
                      PNGs add up to about 2 MB). The lightbox shows the full file. */}
                  <img
                    src={assetSrc(item, es)}
                    alt={es ? item.title_es : item.title_en}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-0.5 font-mono-hud text-[10px] font-bold text-[#090B10]"
                      style={{ backgroundColor: item.accent }}
                    >
                      {es ? item.badge_es : item.badge_en}
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomedAsset(item)}
                      aria-label={
                        es
                          ? `Ampliar: ${item.title_es}`
                          : `Magnify: ${item.title_en}`
                      }
                      className="font-mono-hud text-[11px] text-[#00E5FF] font-bold cursor-zoom-in after:absolute after:inset-0"
                    >
                      {es ? "Ampliar ↗" : "Magnify ↗"}
                    </button>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    {es ? item.title_es : item.title_en}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {es ? item.desc_es : item.desc_en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. CONNECTION TO MIXIUH LABS BENCHMARKS
         ===================================================================== */}
      <section className="bg-[#111622] border-2 border-[#10B981]/40 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[6px_6px_0_#040508]">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono-hud text-xs font-bold text-[#10B981]">
            <PixelIcon name="shield" size={16} />
            <span>
              {es
                ? "PROXIMO DUELO EN VIVO EN MIXIUH LABS: GEMINI 4 CARBON VS. CLAUDE OPUS 5.5"
                : "NEXT LIVE DUEL IN MIXIUH LABS: GEMINI 4 CARBON VS. CLAUDE OPUS 5.5"}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white">
            {es
              ? "Mientras se abre el acceso API publico de Carbon, explora nuestros Laboratorios en Vivo"
              : "While Carbon Public API Access Rolls Out, Explore Our Live Lab Benchmarks"}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            {es
              ? "En el Episodio 02 vimos a Gemini 4 Argon vencer 4-2 a Claude Opus 5.5, y en el Episodio 04 pusimos a prueba la escalera completa de Claude 5.5 (Haiku vs Sonnet vs Opus) en 18 corridas reales."
              : "In Episode 02 we watched Gemini 4 Argon defeat Claude Opus 5.5 4-2, and in Episode 04 we benchmarked the full Claude 5.5 Ladder (Haiku vs Sonnet vs Opus) across 18 isolated runs."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono-hud text-xs">
          <button
            onClick={() => onOpenLabEpisode("ep04")}
            className="px-4 py-3 shadow-[4px_4px_0_#040508] bg-[#00E5FF] text-[#090B10] font-bold hover:brightness-110 transition cursor-pointer"
          >
            {es
              ? "Ver EP04: Escalera Claude 5.5"
              : "Open EP04: Claude 5.5 Ladder"}
          </button>
          <button
            onClick={() => onOpenLabEpisode("ep02")}
            className="px-4 py-3 shadow-[4px_4px_0_#040508] bg-[#A855F7] text-[#090B10] font-bold hover:brightness-110 transition cursor-pointer"
          >
            {es ? "Ver EP02: Argon vs Opus 5.5" : "Open EP02: Argon vs Opus 5.5"}
          </button>
          <button
            onClick={onOpenArena}
            className="px-4 py-3 shadow-[4px_4px_0_#040508] bg-[#090B10] hover:bg-[#1A2132] border border-[#2A344B] text-white font-bold transition cursor-pointer"
          >
            {es ? "Ir a la Arena Interactiva" : "Open Interactive Arena"}
          </button>
        </div>
      </section>

      {/* =====================================================================
          LIGHTBOX MODAL FOR OFFICIAL CHARTS
         ===================================================================== */}
      {/* Portaled to <body> at the kit's modal layer (z-[88], like PixelDrawer):
          inside the page's z-10 foreground layer the backdrop could not cover
          the floating back-to-top button (z-[80]). Only rendered after a click,
          so `document` is never touched during SSR. */}
      {zoomedAsset &&
        createPortal(
          <div
            onClick={closeZoom}
            className="fixed inset-0 z-[88] px-backdrop flex items-center justify-center p-4 sm:p-8"
          >
            <div
              ref={zoomPanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={zoomTitleId}
              aria-describedby={zoomDescId}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full max-h-full flex flex-col bg-[#111622] border-2 border-[#00E5FF] overflow-hidden shadow-[6px_6px_0_#040508]"
            >
              <div className="px-5 py-3.5 bg-[#1A2132] border-b border-[#2A344B] flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono-hud text-xs font-bold text-[#00E5FF] mr-2">
                    [{es ? zoomedAsset.badge_es : zoomedAsset.badge_en}]
                  </span>
                  <h2
                    id={zoomTitleId}
                    className="inline font-display text-base sm:text-lg font-bold text-white"
                  >
                    {es ? zoomedAsset.title_es : zoomedAsset.title_en}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeZoom}
                  aria-label={es ? "Cerrar" : "Close"}
                  className="shrink-0 p-3 sm:p-1.5 bg-[#090B10] text-white hover:text-[#00E5FF] border border-[#2A344B] cursor-pointer"
                >
                  <PixelIcon name="close" size={20} />
                </button>
              </div>
              {/* Phones: fitting the chart to the screen would leave its text
                  about 5px tall, so it opens at a readable width (up to 56rem,
                  never upscaled) and pans inside this box. Start-aligned there:
                  centred overflow could not be scrolled back to the left. At
                  every width the dialog is a column capped at the screen height
                  (a landscape phone or a short laptop window too), so this box
                  takes what the header and caption leave and scrolls the rest.
                  From sm the chart is centred by auto margins, which drop to 0
                  when it does not fit (safe centring): its top stays reachable. */}
              <PixelSwipeHint
                hideFrom="sm"
                label={es ? "Desliza para recorrer la imagen" : "Swipe to pan the image"}
              />
              {/* Its focus ring is dark and inset: a yellow one would barely
                  show on white, and the dialog clips anything outside it. */}
              <div
                ref={zoomBoxRef}
                role={zoomBoxOverflowing ? "region" : undefined}
                aria-label={
                  zoomBoxOverflowing
                    ? es
                      ? "Vista ampliada (desplazable)"
                      : "Magnified view (scrollable)"
                    : undefined
                }
                tabIndex={zoomBoxOverflowing ? 0 : undefined}
                className="p-4 sm:p-6 bg-white flex items-start justify-start max-h-[78vh] overflow-auto overscroll-contain focus-visible:outline-[#090B10] focus-visible:outline-offset-[-3px]"
              >
                <img
                  src={assetSrc(zoomedAsset, es)}
                  alt={es ? zoomedAsset.title_es : zoomedAsset.title_en}
                  className="max-h-[72vh] w-auto object-contain sm:m-auto max-sm:max-h-none max-sm:max-w-[56rem] max-sm:shrink-0"
                />
              </div>
              <div className="px-5 py-3 bg-[#090B10] border-t border-[#2A344B] text-xs text-[#94A3B8] flex max-sm:flex-col max-sm:items-start max-sm:gap-2 items-center justify-between gap-4">
                <span id={zoomDescId}>
                  {es ? zoomedAsset.desc_es : zoomedAsset.desc_en}
                </span>
                <a
                  href={assetSrc(zoomedAsset, es)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-hud text-xs font-bold text-[#00E5FF] hover:underline shrink-0 inline-flex items-center gap-1"
                >
                  <span>{es ? "Abrir original" : "Open original"}</span>
                  <PixelIcon name="arrow-up-right" size={14} />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
