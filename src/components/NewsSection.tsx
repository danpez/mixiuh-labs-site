"use client";

import React, { useState } from "react";
import {
  CARBON_NEWS_META,
  CARBON_CHAPTERS,
  CARBON_FULL_BENCHMARKS,
  CARBON_PRICING_TABLE,
  CARBON_OFFICIAL_GALLERY,
  type NewsBenchmarkDomain,
  type OfficialChartAsset,
} from "@/data/newsData";
import {
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  FileText,
  Play,
  Cpu,
  Layers,
  X,
  ArrowUpRight,
} from "lucide-react";

interface NewsSectionProps {
  lang: "es" | "en";
  onOpenLabEpisode: (ep: "ep04" | "ep03" | "ep02" | "ep01") => void;
  onOpenArena: () => void;
}

export default function NewsSection({
  lang,
  onOpenLabEpisode,
  onOpenArena,
}: NewsSectionProps) {
  const es = lang === "es";
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(1);
  const [domainFilter, setDomainFilter] = useState<NewsBenchmarkDomain>("all");
  const [benchSearch, setBenchSearch] = useState<string>("");
  const [heroThumb, setHeroThumb] = useState<
    "video" | "short" | "A" | "B" | "C" | "table"
  >("video");
  const [zoomedAsset, setZoomedAsset] = useState<OfficialChartAsset | null>(
    null
  );

  const activeChapter =
    CARBON_CHAPTERS.find((c) => c.idx === activeChapterIdx) ||
    CARBON_CHAPTERS[0];

  const filteredBenchmarks = CARBON_FULL_BENCHMARKS.filter((row) => {
    if (domainFilter !== "all" && row.domain !== domainFilter) return false;
    const q = benchSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      row.benchmark.toLowerCase().includes(q) ||
      row.subtitle_es.toLowerCase().includes(q) ||
      row.subtitle_en.toLowerCase().includes(q) ||
      row.highlight_es.toLowerCase().includes(q)
    );
  });

  const heroImageSrc =
    heroThumb === "A"
      ? es
        ? "/brand/thumbs/carbon_thumb_A.jpg"
        : "/brand/thumbs/carbon_thumb_A_en.jpg"
      : heroThumb === "B"
      ? "/brand/thumbs/carbon_thumb_B.jpg"
      : heroThumb === "C"
      ? "/brand/thumbs/carbon_thumb_C.jpg"
      : "/stills/noticias/carbon/03_evals_table.png";

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
      <div className="rounded-3xl bg-gradient-to-br from-[#09152B] via-[#0B1D36] to-[#060B14] border-2 border-[#38BDF8]/45 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
        {/* Top Broadcast Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#B91C1C] border border-[#FCA5A5]/60 font-mono-hud text-xs font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span>
                {es
                  ? "ULTIMA HORA · RADAR MIXIUH · NOTICIAS IA #01"
                  : "BREAKING NEWS · MIXIUH NEWS · AI RADAR #01"}
              </span>
            </span>

            <span className="px-3 py-1.5 rounded-xl bg-[#060B14] border border-[#FBBF24]/50 font-mono-hud text-xs font-bold text-[#FBBF24]">
              {es ? CARBON_NEWS_META.date_es : CARBON_NEWS_META.date_en}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
            <a
              href={CARBON_NEWS_META.officialBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#38BDF8]/45 text-[#38BDF8] font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>
                {es ? "Anuncio Oficial Google" : "Official Google Blog"}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={CARBON_NEWS_META.officialMethodologyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#10B981]/45 text-[#34D399] font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>
                {es ? "Metodologia DeepMind" : "DeepMind Methodology"}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={CARBON_NEWS_META.officialFairwindUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#A855F7]/45 text-[#C084FC] font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>Google Fairwind</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] font-mono-hud text-xs font-bold">
              {es
                ? "COBERTURA ESPECIAL · REPORTE OFICIAL GOOGLE DEEPMIND EXPLICADO CON EJEMPLOS"
                : "SPECIAL COVERAGE · OFFICIAL GOOGLE DEEPMIND REPORT EXPLAINED WITH EXAMPLES"}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
              {es ? (
                <>
                  Google anuncia{" "}
                  <span className="text-[#38BDF8]">Gemini 4 Carbon</span>: El
                  Nuevo <span className="text-[#34D399]">#1 Mundial</span>{" "}
                  <span className="text-[#FBBF24]">
                    (14 Dias Despues de Argon)
                  </span>
                </>
              ) : (
                <>
                  Google Unveils{" "}
                  <span className="text-[#38BDF8]">Gemini 4 Carbon</span>: The
                  New <span className="text-[#34D399]">World #1</span>{" "}
                  <span className="text-[#FBBF24]">(14 Days After Argon)</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed">
              {es
                ? "Apenas dos semanas despues de lanzar Gemini 4 Argon (50 pts), Google DeepMind presento a su hermano mayor de razonamiento profundo: Gemini 4 Carbon. Toma el puesto #1 mundial en Artificial Analysis v5.0 con 59 puntos (superando los 58 de Claude Opus 5.5 y los 57 de GPT-6 Astra), duplica a Argon en ingenieria de software extrema (9.6% en SWE-sweep), rompe records en ciberseguridad (88.2% en SEC-bench Pro y 71.0% en CWE-bench sobre Google Antigravity) y bloquea el 100% de ataques de Prompt Injection en Gray Swan (0.0%)."
                : "Just two weeks after releasing Gemini 4 Argon (50 pts), Google DeepMind unveiled its deep-reasoning big brother: Gemini 4 Carbon. It claims the #1 world spot on Artificial Analysis v5.0 with 59 points (beating Claude Opus 5.5 at 58 and GPT-6 Astra at 57), more than doubles Argon on extreme agentic coding (9.6% SWE-sweep), sets cybersecurity records (88.2% SEC-bench Pro and 71.0% CWE-bench on Google Antigravity), and blocks 100% of Prompt Injection attacks on Gray Swan (0.0%)."}
            </p>

            {/* 4 Hero Concept KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#060B14] border border-[#38BDF8]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#38BDF8]">
                  {es ? "PODIO MUNDIAL AA V5.0" : "WORLD PODIUM AA V5.0"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  59 PTS
                </div>
                <div className="font-mono-hud text-[11px] text-[#34D399] font-bold mt-0.5">
                  #1 (Opus 58 · GPT-6 57)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#060B14] border border-[#10B981]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#34D399]">
                  {es ? "CIBERDEFENSA & AGY" : "CYBER & ANTIGRAVITY"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  88.2%
                </div>
                <div className="font-mono-hud text-[11px] text-[#38BDF8] font-bold mt-0.5">
                  71.0% CWE Antigravity #1
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#060B14] border border-[#A855F7]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#C084FC]">
                  GRAY SWAN IPI
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  0.0%
                </div>
                <div className="font-mono-hud text-[11px] text-[#34D399] font-bold mt-0.5">
                  {es ? "15/15 Bloqueados" : "15/15 Blocked"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#060B14] border border-[#F59E0B]/45">
                <div className="font-mono-hud text-[10px] font-bold text-[#FBBF24]">
                  {es ? "PRECIO API (1M TOK)" : "API PRICE (1M TOK)"}
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-white mt-1">
                  $2/$10 → $4/$20
                </div>
                <div className="font-mono-hud text-[11px] text-[#FBBF24] font-bold mt-0.5">
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
                className="px-4 py-2.5 rounded-xl bg-[#F43F5E] text-white font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {es
                    ? "Ver Video en YouTube (4K60)"
                    : "Watch on YouTube (4K60)"}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={ytShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#F43F5E]/50 text-[#FCA5A5] font-mono-hud text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{es ? "YouTube Short (4K60)" : "YouTube Short (4K60)"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="#explorador-capitulos-carbon"
                className="px-4 py-2.5 rounded-xl bg-[#38BDF8] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {es
                    ? "8 Capitulos Interactivos"
                    : "8 Interactive Chapters"}
                </span>
              </a>

              <a
                href="#tabla-oficial-19-benchmarks"
                className="px-4 py-2.5 rounded-xl bg-[#10B981] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {es ? "Tabla (19 Benchmarks)" : "Table (19 Benchmarks)"}
                </span>
              </a>
            </div>

            {/* Omnichannel Social Bar (YT · IG Reels · TikTok · X) */}
            <div className="p-3 rounded-2xl bg-[#060B14]/90 border border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono-hud text-[11px]">
              <span className="text-[#5EEAD4] font-bold">
                {es
                  ? "PUBLICADO EN TODAS LAS REDES:"
                  : "PUBLISHED ACROSS ALL NETWORKS:"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={ytLongUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#FCA5A5] hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>YouTube 16:9</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href={ytShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#FCA5A5] hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>YT Shorts 9:16</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://www.instagram.com/labs.mixiuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#EC4899]/15 border border-[#EC4899]/40 text-[#F472B6] hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>IG Reels (@labs.mixiuh)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://www.tiktok.com/@mixiuhlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#22D3EE]/15 border border-[#22D3EE]/40 text-[#22D3EE] hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>TikTok (@mixiuhlabs)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://x.com/mixiuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold inline-flex items-center gap-1"
                >
                  <span>X / Hilo (@mixiuh)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Video (16:9 & 9:16 Short) + 4K Infographic Switcher */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl overflow-hidden border-2 border-[#38BDF8]/60 bg-[#040814] shadow-2xl">
              <div className="px-3 py-2.5 bg-[#0A1830] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono-hud text-[11px] font-bold text-[#38BDF8]">
                  {es
                    ? "VIDEO OFICIAL 4K60 & INFOGRAFIAS"
                    : "OFFICIAL 4K60 VIDEO & INFOGRAPHICS"}
                </span>
                <div className="flex flex-wrap rounded-lg bg-[#060B14] p-0.5 border border-white/15 font-mono-hud text-[10px]">
                  {(
                    [
                      {
                        id: "video" as const,
                        label: es ? "Video 16:9" : "16:9 Video",
                      },
                      {
                        id: "short" as const,
                        label: es ? "Short 9:16" : "9:16 Short",
                      },
                      { id: "A" as const, label: es ? "Portada A" : "Cover A" },
                      { id: "B" as const, label: es ? "14 Dias B" : "14 Days B" },
                      { id: "C" as const, label: es ? "Precios C" : "Pricing C" },
                      {
                        id: "table" as const,
                        label: es ? "Tabla" : "Table",
                      },
                    ]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHeroThumb(tab.id)}
                      className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                        heroThumb === tab.id
                          ? "bg-[#38BDF8] text-[#060B14]"
                          : "text-[#8FA3B8] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {heroThumb === "video" ? (
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
                      label={es ? "Espanol" : "English"}
                      default
                    />
                  </video>
                </div>
              ) : heroThumb === "short" ? (
                <div className="relative aspect-video bg-[#040814] flex items-center justify-center p-2">
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
                    className="h-full max-h-[340px] aspect-[9/16] rounded-xl border border-[#38BDF8]/40 object-contain bg-black shadow-xl"
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
                <div
                  onClick={() =>
                    setZoomedAsset({
                      id: "hero-preview",
                      title_es: "Infografia Oficial · Especial Gemini 4 Carbon",
                      title_en: "Official Infographic · Gemini 4 Carbon Special",
                      badge_es: "4K UHD",
                      badge_en: "4K UHD",
                      desc_es:
                        "Haz clic afuera o en el boton superior derecho para cerrar la vista ampliada.",
                      desc_en:
                        "Click outside or on the top-right button to close the magnified view.",
                      src: heroImageSrc,
                      accent: "#38BDF8",
                    })
                  }
                  className="relative aspect-video bg-[#040814] cursor-zoom-in group overflow-hidden"
                >
                  <img
                    src={heroImageSrc}
                    alt="Gemini 4 Carbon Radar Mixiuh"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#060B14]/90 border border-[#38BDF8]/50 font-mono-hud text-[11px] font-bold text-[#38BDF8]">
                    {es ? "Clic para ampliar ↗" : "Click to magnify ↗"}
                  </div>
                </div>
              )}
            </div>

            {/* Live Key Ticker Strip */}
            <div className="p-3 rounded-xl bg-[#060B14] border border-white/10 font-mono-hud text-[11px] text-[#E2E8F0] flex items-center gap-2.5 overflow-x-auto whitespace-nowrap">
              <span className="px-2 py-0.5 rounded bg-[#B91C1C] text-white font-bold shrink-0">
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
      <section id="explorador-capitulos-carbon" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="font-mono-hud text-xs font-bold text-[#38BDF8] uppercase mb-1">
              {es
                ? "DESGLOSE INTERACTIVO EN 8 CAPITULOS · PUNTOS CLAVE Y TELEMETRIA"
                : "8-CHAPTER INTERACTIVE BREAKDOWN · KEY POINTS & TELEMETRY"}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              {es
                ? "Todo el Reporte de Gemini 4 Carbon Explicado Paso a Paso"
                : "The Complete Gemini 4 Carbon Report Explained Step by Step"}
            </h2>
          </div>
          <span className="font-mono-hud text-xs text-[#5EEAD4]">
            {es
              ? "Selecciona cualquiera de los 8 temas para ver sus tarjetas conceptuales y grafica oficial"
              : "Select any of the 8 topics to inspect its conceptual cards and official chart"}
          </span>
        </div>

        {/* 8 Chapter Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CARBON_CHAPTERS.map((ch) => {
            const active = ch.idx === activeChapterIdx;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapterIdx(ch.idx)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  active
                    ? "bg-[#11283F] border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                    : "bg-[#0B1D30]/80 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between font-mono-hud text-[10px] gap-1">
                  <span className="text-[#5EEAD4] font-bold">
                    0{ch.idx} · {ch.timestamp}
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
        <div className="rounded-3xl bg-[#0B1D30] border-2 border-[#38BDF8]/40 overflow-hidden shadow-2xl">
          {/* Stage Header */}
          <div className="p-5 sm:p-6 bg-[#11283F] border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                <span
                  className="px-2.5 py-0.5 rounded font-bold text-[#060B14]"
                  style={{ backgroundColor: activeChapter.accent }}
                >
                  {es ? activeChapter.badge_es : activeChapter.badge_en}
                </span>
                <span className="text-[#5EEAD4] font-bold">
                  {es ? activeChapter.kicker_es : activeChapter.kicker_en}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                {es ? activeChapter.title_es : activeChapter.title_en}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono-hud text-xs">
              <button
                onClick={() =>
                  setActiveChapterIdx((prev) => (prev > 1 ? prev - 1 : 8))
                }
                className="px-3 py-1.5 rounded-lg bg-[#060B14] hover:bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/15 cursor-pointer"
              >
                {es ? "← Anterior" : "← Prev"}
              </button>
              <span className="px-3 py-1.5 rounded-lg bg-[#060B14] text-white font-bold border border-white/10">
                0{activeChapter.idx} / 08
              </span>
              <button
                onClick={() =>
                  setActiveChapterIdx((prev) => (prev < 8 ? prev + 1 : 1))
                }
                className="px-3 py-1.5 rounded-lg bg-[#38BDF8] text-[#060B14] font-bold hover:brightness-110 cursor-pointer"
              >
                {es ? "Siguiente →" : "Next →"}
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-8">
            {/* A. 3 Conceptual Visual Cards (Matching v3.0 Video Engine!) */}
            <div className="space-y-3">
              <div className="font-mono-hud text-xs font-bold text-[#FBBF24] uppercase">
                {es
                  ? activeChapter.concept_hdr_es
                  : activeChapter.concept_hdr_en}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeChapter.nodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#060B14] border-2 flex flex-col justify-between gap-4 shadow-lg"
                    style={{ borderColor: `${node.color}66` }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="px-3 py-1 rounded-lg font-mono-hud text-xs font-bold bg-[#0B1D30] border"
                        style={{
                          borderColor: `${node.color}66`,
                          color: node.color,
                        }}
                      >
                        {es ? node.tag_es : node.tag_en}
                      </span>
                      <span className="font-mono-hud text-xs text-[#8FA3B8]">
                        0{i + 1}/03
                      </span>
                    </div>

                    <div className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {node.stat}
                    </div>

                    <div className="space-y-2">
                      <div
                        className="w-full py-2 px-3 rounded-xl font-mono-hud text-xs font-bold text-white text-center border"
                        style={{
                          backgroundColor: "#0D2549",
                          borderColor: node.color,
                        }}
                      >
                        {es ? node.pill1_es : node.pill1_en}
                      </div>
                      <div className="w-full py-1.5 px-3 rounded-xl bg-[#0B1D30] border border-white/10 font-mono-hud text-xs font-bold text-[#FDE68A] text-center">
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
              <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#060B14] border border-white/15 flex flex-col justify-between space-y-4">
                <div>
                  <div className="font-mono-hud text-xs font-bold text-[#FBBF24] uppercase mb-4">
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
                          className={`p-3.5 rounded-xl border ${
                            bar.isCarbon
                              ? "bg-[#0C1E3D] border-[#38BDF8]/70"
                              : "bg-[#09152B] border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono-hud text-xs mb-2 gap-2">
                            <span className="font-bold text-white">
                              {bar.model}
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: bar.color }}
                            >
                              {es ? bar.label_es : bar.label_en}
                            </span>
                          </div>
                          <div className="w-full h-3.5 rounded-full bg-[#040914] overflow-hidden p-0.5 border border-white/10">
                            <div
                              className="h-full rounded-full transition-all duration-500"
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
                <div className="p-4 rounded-xl bg-[#0B1D30] border border-[#38BDF8]/30 space-y-1.5">
                  <div className="flex items-center justify-between font-mono-hud text-[11px]">
                    <span className="font-bold text-[#38BDF8]">
                      {activeChapter.quote.author}
                    </span>
                    <span className="text-[#8FA3B8]">
                      {es
                        ? activeChapter.quote.role_es
                        : activeChapter.quote.role_en}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F5F7FA] italic leading-relaxed">
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
                <div
                  onClick={() =>
                    setZoomedAsset({
                      id: activeChapter.id,
                      title_es: activeChapter.chart_title_es,
                      title_en: activeChapter.chart_title_en,
                      badge_es: activeChapter.badge_es,
                      badge_en: activeChapter.badge_en,
                      desc_es: activeChapter.explanation_es,
                      desc_en: activeChapter.explanation_en,
                      src: activeChapter.chart_img,
                      accent: activeChapter.accent,
                    })
                  }
                  className="rounded-2xl bg-[#060B14] border border-white/15 overflow-hidden cursor-zoom-in group"
                >
                  <div className="px-4 py-2.5 bg-[#09152B] border-b border-white/10 flex items-center justify-between font-mono-hud text-xs">
                    <span className="text-white font-bold truncate">
                      {es
                        ? activeChapter.chart_title_es
                        : activeChapter.chart_title_en}
                    </span>
                    <span className="text-[#38BDF8] font-bold shrink-0 ml-2">
                      {es ? "Ampliar ↗" : "Zoom ↗"}
                    </span>
                  </div>
                  <div className="p-3 bg-white/95 flex items-center justify-center max-h-[340px] overflow-hidden">
                    <img
                      src={activeChapter.chart_img}
                      alt={
                        es
                          ? activeChapter.chart_title_es
                          : activeChapter.chart_title_en
                      }
                      className="max-h-[310px] w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Pedagogical Explanation Card */}
                <div className="p-5 rounded-2xl bg-[#060B14] border border-[#10B981]/35 space-y-2.5">
                  <div className="font-mono-hud text-xs font-bold text-[#34D399] uppercase">
                    {es
                      ? "¿QUE SIGNIFICA ESTO EN LA PRACTICA?"
                      : "WHAT DOES THIS MEAN IN PRACTICE?"}
                  </div>
                  <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                    {es
                      ? activeChapter.explanation_es
                      : activeChapter.explanation_en}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5EEAD4] font-medium leading-relaxed">
                    {es ? activeChapter.example_es : activeChapter.example_en}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. MASTER 19-BENCHMARK OFFICIAL COMPARISON TABLE
         ===================================================================== */}
      <section id="tabla-oficial-19-benchmarks" className="space-y-5">
        <div className="rounded-3xl bg-[#0B1D30] border border-[#38BDF8]/35 overflow-hidden shadow-2xl">
          <div className="p-5 sm:p-6 bg-[#11283F] border-b border-white/10 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="font-mono-hud text-xs font-bold text-[#38BDF8] uppercase">
                  {es
                    ? "DATOS OFICIALES DE GOOGLE DEEPMIND · 14 DE 19 VICTORIAS ABSOLUTAS"
                    : "OFFICIAL GOOGLE DEEPMIND DATA · 14 OF 19 OUTRIGHT WINS"}
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
                  {es
                    ? "Tabla Comparativa Completa: Gemini 4 Carbon vs. Argon vs. GPT-6 Astra vs. Claude Opus 5.5"
                    : "Full Benchmark Table: Gemini 4 Carbon vs. Argon vs. GPT-6 Astra vs. Claude Opus 5.5"}
                </h2>
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-[#8FA3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={benchSearch}
                  onChange={(e) => setBenchSearch(e.target.value)}
                  placeholder={
                    es
                      ? "Filtrar SWE-sweep, CWE, Vending..."
                      : "Filter SWE-sweep, CWE, Vending..."
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#060B14] border border-white/15 text-xs text-white placeholder:text-[#8FA3B8]"
                />
              </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono-hud text-xs">
              {(
                [
                  {
                    id: "all" as const,
                    es: "Todos los Benchmarks (19)",
                    en: "All Benchmarks (19)",
                  },
                  {
                    id: "agentes" as const,
                    es: "Codigo y Agentes (6)",
                    en: "Coding & Agents (6)",
                  },
                  {
                    id: "cyber" as const,
                    es: "Ciberseguridad (4)",
                    en: "Cybersecurity (4)",
                  },
                  {
                    id: "negocios" as const,
                    es: "Negocios y Economia (4)",
                    en: "Business & Economics (4)",
                  },
                  {
                    id: "ciencia" as const,
                    es: "Ciencia y Matematicas (5)",
                    en: "Science & Math (5)",
                  },
                ]
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDomainFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    domainFilter === f.id
                      ? "bg-[#38BDF8] text-[#060B14]"
                      : "bg-[#060B14] text-[#8FA3B8] hover:text-white border border-white/10"
                  }`}
                >
                  {es ? f.es : f.en}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#060B14] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">
                    {es ? "Benchmark y Qué Mide" : "Benchmark & What It Tests"}
                  </th>
                  <th className="py-3.5 px-4 text-[#38BDF8] bg-[#38BDF8]/10">
                    Gemini 4 Carbon
                  </th>
                  <th className="py-3.5 px-4 text-[#C084FC]">
                    Gemini 4 Argon
                  </th>
                  <th className="py-3.5 px-4 text-[#34D399]">GPT-6 Astra</th>
                  <th className="py-3.5 px-4 text-[#FB923C]">
                    Claude Opus 5.5
                  </th>
                  <th className="py-3.5 px-4">
                    {es ? "Diferencial Clave" : "Key Differential"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {filteredBenchmarks.map((r) => (
                  <tr key={r.n} className="hover:bg-[#11283F]/60 transition">
                    <td className="py-3.5 px-4 font-mono-hud font-bold text-[#5EEAD4]">
                      {String(r.n).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{r.benchmark}</div>
                      <div className="text-xs text-[#8FA3B8]">
                        {es ? r.subtitle_es : r.subtitle_en}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-hud font-black text-base text-[#38BDF8] bg-[#38BDF8]/10">
                      {r.carbon}
                    </td>
                    <td className="py-3.5 px-4 font-mono-hud text-[#C084FC]">
                      {r.argon}
                    </td>
                    <td className="py-3.5 px-4 font-mono-hud text-[#34D399]">
                      {r.gpt6}
                    </td>
                    <td className="py-3.5 px-4 font-mono-hud text-[#FB923C]">
                      {r.opus55}
                    </td>
                    <td className="py-3.5 px-4 font-mono-hud text-xs">
                      <span
                        className={`px-2.5 py-1 rounded font-bold ${
                          r.winner === "carbon"
                            ? "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40"
                            : "bg-white/5 text-[#E2E8F0]"
                        }`}
                      >
                        {es ? r.highlight_es : r.highlight_en}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. API PRICING & FINE PRINT TABLE ($2/$10 -> $4/$20 USD)
         ===================================================================== */}
      <section id="letra-pequena-precios-carbon" className="space-y-5">
        <div className="rounded-3xl bg-[#0B1D30] border border-[#F59E0B]/45 overflow-hidden shadow-2xl">
          <div className="p-5 sm:p-6 bg-[#11283F] border-b border-white/10">
            <div className="font-mono-hud text-xs font-bold text-[#FBBF24] uppercase">
              {es
                ? "AUDITORIA DE COSTOS API · LA LETRA PEQUENA DEL ANUNCIO OFICIAL"
                : "API COST AUDIT · THE OFFICIAL ANNOUNCEMENT FINE PRINT"}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
              {es
                ? "Precio por 1 Millon de Tokens: Promo de Lanzamiento ($2/$10) vs. Tarifa Estandar ($4/$20)"
                : "Price per 1 Million Tokens: Launch Promo ($2/$10) vs. Standard Rate ($4/$20)"}
            </h2>
            <p className="text-xs sm:text-sm text-[#8FA3B8] mt-1">
              {es
                ? "Durante el lanzamiento, Gemini 4 Carbon cuesta exactamente lo mismo que Gemini 4 Argon ($2 entrada / $10 salida). Al concluir la promo, su precio estandar se duplica a $4 / $20 USD (quedando aun 20% por debajo de los $5 / $25 USD de Claude Opus 5.5)."
                : "During launch, Gemini 4 Carbon costs the exact same as Gemini 4 Argon ($2 input / $10 output). After the promo window ends, its standard price doubles to $4 / $20 USD (remaining 20% cheaper than Claude Opus 5.5 at $5 / $25 USD)."}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#060B14] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                  <th className="py-3.5 px-4">
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
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {CARBON_PRICING_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#11283F]/60 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded font-mono-hud text-[10px] font-bold text-[#060B14]"
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
                    <td className="py-4 px-4 font-mono-hud text-[#34D399] font-bold">
                      {row.caching}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#8FA3B8]">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="font-mono-hud text-xs font-bold text-[#5EEAD4] uppercase mb-1">
              {es
                ? "EVIDENCIA PRIMARIA · GALERIA DE GRAFICAS OFICIALES"
                : "PRIMARY EVIDENCE · OFFICIAL CHART GALLERY"}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              {es
                ? "Graficas Oficiales de Google DeepMind e Infografias 4K"
                : "Official Google DeepMind Charts & 4K Infographics"}
            </h2>
          </div>
          <span className="font-mono-hud text-xs text-[#8FA3B8]">
            {es
              ? "Haz clic en cualquier grafica para inspeccionarla en tamano completo"
              : "Click any chart to inspect it at full resolution"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARBON_OFFICIAL_GALLERY.map((item) => (
            <div
              key={item.id}
              onClick={() => setZoomedAsset(item)}
              className="rounded-2xl bg-[#0B1D30] border border-white/10 hover:border-[#38BDF8]/60 overflow-hidden shadow-xl flex flex-col justify-between cursor-zoom-in group transition"
            >
              <div>
                <div className="p-3 bg-white/95 aspect-video flex items-center justify-center overflow-hidden">
                  <img
                    src={item.src}
                    alt={es ? item.title_es : item.title_en}
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded font-mono-hud text-[10px] font-bold text-[#060B14]"
                      style={{ backgroundColor: item.accent }}
                    >
                      {es ? item.badge_es : item.badge_en}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#38BDF8] font-bold">
                      {es ? "Ampliar ↗" : "Magnify ↗"}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    {es ? item.title_es : item.title_en}
                  </h3>
                  <p className="text-xs text-[#8FA3B8] leading-relaxed">
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
      <section className="rounded-3xl bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border border-[#34D399]/40 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono-hud text-xs font-bold text-[#34D399]">
            <ShieldCheck className="w-4 h-4" />
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
          <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
            {es
              ? "En el Episodio 02 vimos a Gemini 4 Argon vencer 4-2 a Claude Opus 5.5, y en el Episodio 04 pusimos a prueba la escalera completa de Claude 5.5 (Haiku vs Sonnet vs Opus) en 18 corridas reales."
              : "In Episode 02 we watched Gemini 4 Argon defeat Claude Opus 5.5 4-2, and in Episode 04 we benchmarked the full Claude 5.5 Ladder (Haiku vs Sonnet vs Opus) across 18 isolated runs."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono-hud text-xs">
          <button
            onClick={() => onOpenLabEpisode("ep04")}
            className="px-4 py-3 rounded-xl bg-[#22D3EE] text-[#060B14] font-bold hover:brightness-110 transition cursor-pointer"
          >
            {es
              ? "Ver EP04: Escalera Claude 5.5"
              : "Open EP04: Claude 5.5 Ladder"}
          </button>
          <button
            onClick={() => onOpenLabEpisode("ep02")}
            className="px-4 py-3 rounded-xl bg-[#B794F6] text-[#060B14] font-bold hover:brightness-110 transition cursor-pointer"
          >
            {es ? "Ver EP02: Argon vs Opus 5.5" : "Open EP02: Argon vs Opus 5.5"}
          </button>
          <button
            onClick={onOpenArena}
            className="px-4 py-3 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-white/15 text-white font-bold transition cursor-pointer"
          >
            {es ? "Ir a la Arena Interactiva" : "Open Interactive Arena"}
          </button>
        </div>
      </section>

      {/* =====================================================================
          LIGHTBOX MODAL FOR OFFICIAL CHARTS
         ===================================================================== */}
      {zoomedAsset && (
        <div
          onClick={() => setZoomedAsset(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl w-full rounded-2xl bg-[#0B1D30] border-2 border-[#38BDF8] overflow-hidden shadow-2xl"
          >
            <div className="px-5 py-3.5 bg-[#11283F] border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="font-mono-hud text-xs font-bold text-[#38BDF8] mr-2">
                  [{es ? zoomedAsset.badge_es : zoomedAsset.badge_en}]
                </span>
                <span className="font-display text-base sm:text-lg font-bold text-white">
                  {es ? zoomedAsset.title_es : zoomedAsset.title_en}
                </span>
              </div>
              <button
                onClick={() => setZoomedAsset(null)}
                className="p-1.5 rounded-lg bg-[#060B14] text-white hover:text-[#38BDF8] border border-white/15 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-white flex items-center justify-center max-h-[78vh] overflow-auto">
              <img
                src={zoomedAsset.src}
                alt={es ? zoomedAsset.title_es : zoomedAsset.title_en}
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>
            <div className="px-5 py-3 bg-[#060B14] border-t border-white/10 text-xs text-[#8FA3B8] flex items-center justify-between gap-4">
              <span>{es ? zoomedAsset.desc_es : zoomedAsset.desc_en}</span>
              <a
                href={zoomedAsset.src}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-hud text-xs font-bold text-[#38BDF8] hover:underline shrink-0 inline-flex items-center gap-1"
              >
                <span>{es ? "Abrir original" : "Open original"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
