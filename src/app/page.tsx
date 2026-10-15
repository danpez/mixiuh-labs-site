"use client";

import React, { useState } from "react";
import {
  BENCHMARK_TOTALS,
  CHALLENGES,
  EPISODE_01_CHAPTERS,
  LAB_GLOSSARY,
  SCIENTIFIC_HONESTY_NOTES,
} from "@/data/labsData";
import DemoArenaSection from "@/components/DemoArenaModal";
import ForumSection from "@/components/ForumSection";
import {
  Play,
  Terminal,
  Code2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Cpu,
  BookOpen,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowUpRight,
  Globe,
  Film,
  Volume2,
  Database,
  ChevronRight,
} from "lucide-react";

export default function MixiuhLabsHomePage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [selectedChallengeN, setSelectedChallengeN] = useState<number>(6);
  const [activeVideoClip, setActiveVideoClip] = useState<"hook" | "boss">(
    "hook"
  );
  const [glossarySearch, setGlossarySearch] = useState("");

  const handleJumpToArena = (challengeN: number) => {
    setSelectedChallengeN(challengeN);
    const el = document.getElementById("arena");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredGlossary = LAB_GLOSSARY.filter((item) => {
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.plain_es.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen labs-grid-bg text-[#F5F7FA]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#060B14]/90 border-b border-[#22A2DD]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/brand/logos/mixiuh-labs_mark_dark.svg"
              alt="Mixiuh Labs"
              className="h-8 w-8 shrink-0"
            />
            <div className="flex items-center gap-2">
              <span className="font-mono-hud text-sm sm:text-base font-bold tracking-wider text-white whitespace-nowrap">
                MIXIUH <span className="text-[#22A2DD]">LABS</span>
              </span>
              <span className="hidden 2xl:inline-block px-2 py-0.5 rounded bg-[#11283F] border border-[#22A2DD]/30 font-mono-hud text-[10px] font-bold text-[#5EEAD4] whitespace-nowrap">
                FORUM & BENCHMARK HUB
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-4 text-xs font-mono-hud text-[#8FA3B8] whitespace-nowrap">
            <a
              href="#ep01"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "EP01 Dossier" : "EP01 Dossier"}
            </a>
            <a
              href="#matriz"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Matriz 10 Retos" : "10-Challenge Matrix"}
            </a>
            <a
              href="#arena"
              className="hover:text-[#B794F6] text-white font-bold transition-colors"
            >
              {lang === "es" ? "Arena (20 Demos)" : "Live Arena (20 Demos)"}
            </a>
            <a
              href="#foro"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Foro y Autopsias" : "Forum & Autopsies"}
            </a>
            <a
              href="#glosario"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Glosario" : "Glossary"}
            </a>
            <a
              href="#ecosistema"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Ecosistema" : "Ecosystem"}
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {/* Language Switcher */}
            <div className="inline-flex rounded-lg bg-[#0B1D30] p-0.5 border border-white/15">
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 rounded-md font-mono-hud text-xs font-bold transition cursor-pointer ${
                  lang === "es"
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md font-mono-hud text-xs font-bold transition cursor-pointer ${
                  lang === "en"
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="https://github.com/danpez/gemini-4-argon-vs-3.8-flash-benchmark"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1D30] hover:bg-[#11283F] border border-white/15 font-mono-hud text-xs text-white transition whitespace-nowrap"
            >
              <Code2 className="w-3.5 h-3.5 text-[#5EEAD4] shrink-0" />
              <span>GitHub Repo</span>
            </a>

            <a
              href="https://mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition whitespace-nowrap"
            >
              <span>mixiuh.online</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO & EPISODE 01 COMMAND CENTER */}
      <section id="top" className="relative pt-10 pb-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Motto Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B1D30] border border-[#22A2DD]/40">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="font-mono-hud text-xs font-bold tracking-wider text-[#5EEAD4]">
                {lang === "es"
                  ? "AQUI NO SE OPINA: SE PRUEBA. // LABORATORIO ABIERTO Y FORO DE INGENIERIA"
                  : "HERE, WE DON'T GUESS: WE TEST. // OPEN BENCHMARK LAB & ENGINEERING FORUM"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono-hud text-[#8FA3B8]">
              <span className="px-2.5 py-1 rounded bg-[#0B1D30] border border-white/10">
                ES: <strong className="text-white">@MixiuhLabsES</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B1D30] border border-white/10">
                EN: <strong className="text-white">@MixiuhLabsEN</strong>
              </span>
            </div>
          </div>

          {/* Hero Grid */}
          <div id="ep01" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Title, Scoreboard & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B794F6]/15 border border-[#B794F6]/40 text-[#B794F6] font-mono-hud text-xs font-bold">
                {lang === "es"
                  ? "EPISODIO 01 · TORNEO ZERO-SHOT EN ANTIGRAVITY"
                  : "EPISODE 01 · ZERO-SHOT TOURNAMENT IN ANTIGRAVITY"}
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-[1.08]">
                {lang === "es" ? (
                  <>
                    Gemini 4{" "}
                    <span className="text-[#B794F6]">Argon</span> vs. Gemini
                    3.8 <span className="text-[#FBBF24]">Flash</span>:{" "}
                    <span className="text-[#5EEAD4]">
                      10 Retos y el Medio Píxel que Rompió un Mundo
                    </span>
                  </>
                ) : (
                  <>
                    Gemini 4{" "}
                    <span className="text-[#B794F6]">Argon</span> vs. Gemini
                    3.8 <span className="text-[#FBBF24]">Flash</span>:{" "}
                    <span className="text-[#5EEAD4]">
                      10 Challenges & the Half Pixel That Broke a World
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#8FA3B8] leading-relaxed">
                {lang === "es"
                  ? "Enfrentamos a las variantes High de Gemini 4 Argon y Gemini 3.8 Flash dentro de Antigravity con el mismo prompt, un solo intento sin correcciones y cero imagenes externas en 10 retos de WebGL, fisica, pixel art, CSS puro y matematicas. Explora las 20 simulaciones en vivo, audita el codigo fuente y participa en el foro."
                  : "We pitted the High variants of Gemini 4 Argon and Gemini 3.8 Flash head-to-head inside Antigravity using identical prompts, a single attempt with zero follow-ups, and zero external images across 10 WebGL, physics, pixel art, pure CSS, and math challenges. Play all 20 simulations live, audit the code, and join the forum."}
              </p>

              {/* Big VS Scoreboard Card with Mascots */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border border-[#22A2DD]/30 shadow-2xl">
                <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-white/10">
                  {/* Left: FLASH (Mixiuh Labs rule: Flash always on left) */}
                  <div className="flex items-center gap-3">
                    <img
                      src="/brand/mascots/flash_embarrassed.png"
                      alt="Gemini 3.8 Flash"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#060B14] p-1 border border-[#FBBF24]/40 object-contain shrink-0"
                    />
                    <div>
                      <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#FBBF24] uppercase">
                        Gemini 3.8 Flash
                      </div>
                      <div className="font-display text-2xl sm:text-4xl font-black text-white">
                        0
                      </div>
                      <div className="font-mono-hud text-[11px] text-[#8FA3B8]">
                        94 min · 8/10 func.
                      </div>
                    </div>
                  </div>

                  {/* Center VS */}
                  <div className="text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#060B14] border border-white/15 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                      MARCADOR FINAL
                    </div>
                    <div className="font-mono-hud text-xs text-[#34D399] font-bold mt-1.5">
                      {lang === "es"
                        ? "-39 MIN (-41.5%)"
                        : "-39 MIN (-41.5%)"}
                    </div>
                  </div>

                  {/* Right: ARGON */}
                  <div className="flex items-center justify-end gap-3 text-right">
                    <div>
                      <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#B794F6] uppercase">
                        Gemini 4 Argon
                      </div>
                      <div className="font-display text-2xl sm:text-4xl font-black text-[#34D399]">
                        10
                      </div>
                      <div className="font-mono-hud text-[11px] text-[#8FA3B8]">
                        55 min · 10/10 func.
                      </div>
                    </div>
                    <img
                      src="/brand/mascots/argon_winner.png"
                      alt="Gemini 4 Argon"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#060B14] p-1 border border-[#B794F6]/50 object-contain shrink-0"
                    />
                  </div>
                </div>

                {/* 4 Sub-metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                    <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      {lang === "es" ? "RELOJ ACUMULADO" : "OVERALL CLOCK"}
                    </div>
                    <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                      55m vs 94m
                    </div>
                    <div className="text-[11px] text-[#34D399]">
                      Argon 1.71x total
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                    <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      {lang === "es" ? "VELOCIDAD POR RETO" : "SPEED PER TEST"}
                    </div>
                    <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                      Argon 7 · Flash 3
                    </div>
                    <div className="text-[11px] text-[#FBBF24]">
                      {lang === "es" ? "Rigor: no fue 10-0" : "Honest clock split"}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                    <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      {lang === "es" ? "VOLUMEN CODIGO" : "CODE VOLUME"}
                    </div>
                    <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                      671 KB vs 603 KB
                    </div>
                    <div className="text-[11px] text-[#B794F6]">
                      17,582 vs 18,673 loc
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                    <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      {lang === "es" ? "EN <= 5 MINUTOS" : "IN <= 5 MINUTES"}
                    </div>
                    <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                      8 de 10 retos
                    </div>
                    <div className="text-[11px] text-[#5EEAD4]">
                      {lang === "es" ? "Mediana Argon: 4m" : "Argon median: 4m"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#arena"
                  className="px-6 py-3.5 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_28px_rgba(183,148,246,0.35)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {lang === "es"
                    ? "Jugar las 20 Simulaciones en Vivo"
                    : "Play All 20 Simulations Live"}
                </a>

                <a
                  href="#foro"
                  className="px-5 py-3.5 rounded-xl bg-[#11283F] hover:bg-[#22A2DD]/20 border border-[#22A2DD]/40 text-white font-mono-hud text-xs sm:text-sm font-bold transition flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-[#5EEAD4]" />
                  {lang === "es"
                    ? "Ver Autopsia del Medio Pixel (Nivel 6)"
                    : "Inspect Half-Pixel Bug Autopsy (Level 6)"}
                </a>

                <a
                  href="https://danpez.github.io/gemini-4-argon-vs-3.8-flash-benchmark/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-[#0B1D30] hover:bg-[#11283F] border border-white/15 text-[#8FA3B8] hover:text-white font-mono-hud text-xs transition flex items-center gap-1.5"
                >
                  <span>GitHub Pages Mirror</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right 5 Cols: Video Preview Player + 14 Interactive Chapters */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 overflow-hidden shadow-2xl">
              {/* Video Clip Switcher Header */}
              <div className="p-3.5 bg-[#11283F] border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveVideoClip("hook")}
                    className={`px-3 py-1.5 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                      activeVideoClip === "hook"
                        ? "bg-[#22A2DD] text-[#060B14]"
                        : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                    }`}
                  >
                    {lang === "es"
                      ? "1. Avance Oficial (Hook)"
                      : "1. Official Hook Preview"}
                  </button>
                  <button
                    onClick={() => setActiveVideoClip("boss")}
                    className={`px-3 py-1.5 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                      activeVideoClip === "boss"
                        ? "bg-[#F43F5E] text-white"
                        : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                    }`}
                  >
                    {lang === "es"
                      ? "2. Nivel 6: El Jefe (Raycasting)"
                      : "2. Level 6: Boss Fight"}
                  </button>
                </div>
                <span className="font-mono-hud text-[11px] text-[#5EEAD4]">
                  Voicefy 44.1kHz
                </span>
              </div>

              {/* HTML5 Video Player with real rendered EP01 footage */}
              <div className="relative bg-black aspect-video">
                <video
                  key={activeVideoClip}
                  controls
                  playsInline
                  preload="metadata"
                  poster={
                    activeVideoClip === "hook"
                      ? "/brand/thumbs/01_marcador-0-10_1280.jpg"
                      : "/brand/thumbs/02_medio-pixel_1280.jpg"
                  }
                  className="w-full h-full object-cover"
                >
                  <source
                    src={
                      activeVideoClip === "hook"
                        ? "/videos/ep01-hook.mp4"
                        : "/videos/ep01-boss.mp4"
                    }
                    type="video/mp4"
                  />
                  <track
                    kind="captions"
                    src="/videos/captions_es.vtt"
                    srcLang="es"
                    label="Espanol (Mexico)"
                  />
                </video>
              </div>

              {/* Interactive 14 Chapters List */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono-hud text-xs font-bold text-[#5EEAD4] uppercase">
                    {lang === "es"
                      ? "14 CAPITULOS DEL EPISODIO (CLIC PARA CARGAR RETO)"
                      : "14 EPISODE CHAPTERS (CLICK TO LOAD CHALLENGE)"}
                  </span>
                  <span className="font-mono-hud text-[11px] text-[#8FA3B8]">
                    10:05 · 4K60
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {EPISODE_01_CHAPTERS.map((chap) => (
                    <button
                      key={chap.time}
                      onClick={() => {
                        if (chap.level) {
                          handleJumpToArena(chap.level);
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#060B14]/70 hover:bg-[#11283F] border border-white/5 hover:border-[#22A2DD]/40 transition flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono-hud text-xs font-bold text-[#22A2DD] shrink-0">
                          {chap.time}
                        </span>
                        <span className="text-xs text-[#F5F7FA] truncate">
                          {lang === "es" ? chap.title_es : chap.title_en}
                        </span>
                      </div>
                      {chap.level && (
                        <span className="font-mono-hud text-[10px] px-2 py-0.5 rounded bg-[#B794F6]/15 text-[#B794F6] shrink-0">
                          {lang === "es"
                            ? `Jugar N${chap.level}`
                            : `Play L${chap.level}`}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-CHALLENGE COMPARATIVE MATRIX TABLE */}
      <section
        id="matriz"
        className="scroll-mt-24 py-12 border-t border-[#22A2DD]/15 bg-[#060B14]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono-hud uppercase text-[#5EEAD4] font-bold mb-1">
                {lang === "es"
                  ? "TABLA MAESTRA VERIFICADA · 10 RETOS ZERO-SHOT"
                  : "VERIFIED MASTER TABLE · 10 ZERO-SHOT CHALLENGES"}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                {lang === "es"
                  ? "Matriz Comparativa Nivel por Nivel"
                  : "Level-by-Level Comparative Matrix"}
              </h2>
            </div>
            <div className="font-mono-hud text-xs text-[#8FA3B8]">
              {lang === "es"
                ? "Haz clic en cualquier fila para abrir el simulador en la Arena Interactiva"
                : "Click any row to launch the simulator in the Interactive Arena"}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/25 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#11283F] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">
                      {lang === "es" ? "Reto y Mundo" : "Challenge & World"}
                    </th>
                    <th className="py-3.5 px-4 text-[#FBBF24]">
                      Flash (Tiempo / Loc)
                    </th>
                    <th className="py-3.5 px-4 text-[#B794F6]">
                      Argon (Tiempo / Loc)
                    </th>
                    <th className="py-3.5 px-4">
                      {lang === "es" ? "Relacion Reloj" : "Speed Ratio"}
                    </th>
                    <th className="py-3.5 px-4">
                      {lang === "es" ? "Veredicto Calidad" : "Quality Verdict"}
                    </th>
                    <th className="py-3.5 px-4 text-right">
                      {lang === "es" ? "Accion" : "Action"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                  {CHALLENGES.map((ch) => (
                    <tr
                      key={ch.n}
                      onClick={() => handleJumpToArena(ch.n)}
                      className="hover:bg-[#11283F]/60 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono-hud font-bold text-[#5EEAD4]">
                        {String(ch.n).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {lang === "es" ? ch.name_es : ch.name_en}
                        </div>
                        <div className="text-xs text-[#8FA3B8]">{ch.tech}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud">
                        <span className="text-[#FBBF24] font-bold">
                          {ch.time_min.flash} min
                        </span>
                        <span className="text-[#8FA3B8] text-xs block">
                          {ch.code_stats.flash_lines} loc ·{" "}
                          {ch.code_stats.flash_kb} KB
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud">
                        <span className="text-[#B794F6] font-bold">
                          {ch.time_min.argon} min
                        </span>
                        <span className="text-[#8FA3B8] text-xs block">
                          {ch.code_stats.argon_lines} loc ·{" "}
                          {ch.code_stats.argon_kb} KB
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud text-xs">
                        <span
                          className={
                            ch.faster_model === "argon"
                              ? "text-[#34D399]"
                              : "text-[#FBBF24]"
                          }
                        >
                          {ch.speed_ratio}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#34D399]/15 border border-[#34D399]/40 font-mono-hud text-[11px] font-bold text-[#34D399]">
                            ARGON (0-{ch.n})
                          </span>
                          {ch.flash_broken && (
                            <span className="px-2 py-0.5 rounded bg-[#F43F5E]/15 border border-[#F43F5E]/40 font-mono-hud text-[10px] font-bold text-[#F43F5E]">
                              {lang === "es" ? "FLASH ROTO" : "FLASH BROKEN"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJumpToArena(ch.n);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#22A2DD]/15 hover:bg-[#22A2DD] text-[#5EEAD4] hover:text-[#060B14] font-mono-hud text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          {lang === "es" ? "Probar" : "Test"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#060B14] border-t-2 border-[#22A2DD]/30 font-mono-hud text-xs font-bold">
                    <td className="py-4 px-4 text-[#5EEAD4]">TOTAL</td>
                    <td className="py-4 px-4 text-white">
                      {lang === "es"
                        ? "10 Retos Completados (20 Archivos index.html)"
                        : "10 Completed Challenges (20 index.html Files)"}
                    </td>
                    <td className="py-4 px-4 text-[#FBBF24]">
                      {BENCHMARK_TOTALS.flash_min} min ·{" "}
                      {BENCHMARK_TOTALS.code_totals.flash_lines} loc (
                      {BENCHMARK_TOTALS.code_totals.flash_kb} KB)
                    </td>
                    <td className="py-4 px-4 text-[#B794F6]">
                      {BENCHMARK_TOTALS.argon_min} min ·{" "}
                      {BENCHMARK_TOTALS.code_totals.argon_lines} loc (
                      {BENCHMARK_TOTALS.code_totals.argon_kb} KB)
                    </td>
                    <td className="py-4 px-4 text-[#34D399]">
                      -39 min (-{BENCHMARK_TOTALS.pct_time_saved}%)
                    </td>
                    <td className="py-4 px-4 text-[#34D399]">
                      MARCADOR {BENCHMARK_TOTALS.score}
                    </td>
                    <td className="py-4 px-4 text-right text-[#8FA3B8]">
                      10/10 vs 8/10
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE LIVE ARENA (ALL 20 SIMULATIONS + GUMMY BEARS BONUS) */}
      <DemoArenaSection
        lang={lang}
        selectedChallengeN={selectedChallengeN}
        onSelectChallengeN={setSelectedChallengeN}
      />

      {/* INTERACTIVE ENGINEERING FORUM & COMMUNITY */}
      <ForumSection lang={lang} onJumpToArena={handleJumpToArena} />

      {/* TECHNICAL GLOSSARY (37 TERMS) & SCIENTIFIC HONESTY PROTOCOL */}
      <section
        id="glosario"
        className="scroll-mt-24 py-14 border-t border-[#22A2DD]/15 bg-[#060B14]/70"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Scientific Honesty & Transparency Protocol */}
          <div className="rounded-2xl bg-[#0B1D30] border border-[#34D399]/30 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono-hud uppercase text-[#34D399] font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              {lang === "es"
                ? "PROTOCOLO DE HONESTIDAD CIENTIFICA Y TRANSPARENCIA DE DATOS"
                : "SCIENTIFIC HONESTY & DATA TRANSPARENCY PROTOCOL"}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
              {lang === "es"
                ? "Lo que Mixiuh Labs NO afirma (Notas de Rigor Metodologico)"
                : "What Mixiuh Labs Explicitly Does NOT Claim (Methodological Rigor)"}
            </h2>
            <p className="text-sm text-[#8FA3B8] mb-6 max-w-3xl">
              {lang === "es"
                ? "Para que nuestras pruebas sean tomadas en serio por ingenieros, documentamos abiertamente los matices tecnicos, limites de hardware y correcciones detectadas al auditar los 20 proyectos y las grabaciones en bruto:"
                : "So that our benchmarks stand up to strict engineering scrutiny, we openly document every technical nuance, hardware cap, and audit note across all 20 deliverables and raw recordings:"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {SCIENTIFIC_HONESTY_NOTES.slice(0, 10).map((note, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#060B14] border border-white/10 text-xs text-[#F5F7FA]/90 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-mono-hud text-[#5EEAD4] font-bold shrink-0">
                    [{String(idx + 1).padStart(2, "0")}]
                  </span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive 37-Term Glossary */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-hud uppercase text-[#5EEAD4] font-bold mb-1">
                  <BookOpen className="w-4 h-4" />
                  {lang === "es"
                    ? "GLOSARIO TECNICO DEL EPISODIO 01 (37 CONCEPTOS)"
                    : "EPISODE 01 TECHNICAL GLOSSARY (37 CONCEPTS)"}
                </div>
                <h3 className="font-display text-2xl font-black text-white">
                  {lang === "es"
                    ? "Diccionario de Ingenieria en Lenguaje Claro"
                    : "Plain-Language Engineering Dictionary"}
                </h3>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8FA3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder={
                    lang === "es"
                      ? "Buscar DDA, quadtree, Hooke..."
                      : "Search DDA, quadtree, Hooke..."
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1D30] border border-white/15 text-xs text-white placeholder:text-[#8FA3B8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGlossary.map((g) => (
                <div
                  key={g.term}
                  className="p-4 rounded-xl bg-[#0B1D30] border border-white/10 hover:border-[#22A2DD]/40 transition"
                >
                  <div className="font-mono-hud text-xs font-bold text-[#5EEAD4] mb-1">
                    {g.term}
                  </div>
                  <p className="text-xs text-[#F5F7FA]/90 leading-relaxed">
                    {g.plain_es}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MIXIUH ECOSYSTEM & B2B ENGINEERING FUNNEL */}
      <section
        id="ecosistema"
        className="scroll-mt-24 py-14 border-t border-[#22A2DD]/20 bg-gradient-to-b from-[#060B14] to-[#0B1D30]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11283F] border border-[#22A2DD]/30 font-mono-hud text-xs text-[#5EEAD4] mb-3">
              ECOSISTEMA DE PRODUCTOS PROPIOS MIXIUH
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              {lang === "es"
                ? "Las Herramientas con las que Construimos Mixiuh Labs"
                : "The In-House Tools Behind Mixiuh Labs"}
            </h2>
            <p className="text-sm sm:text-base text-[#8FA3B8] mt-2">
              {lang === "es"
                ? "Mixiuh Labs es el brazo de investigacion y pruebas de Mixiuh. Todos nuestros episodios, voces clonadas, editores de video y plataformas SaaS son tecnologia propia."
                : "Mixiuh Labs is the research and benchmarking arm of Mixiuh. All our episodes, cloned voices, video editors, and SaaS platforms are built with our own proprietary technology."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            <a
              href="https://reelfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-[#060B14] border border-white/10 hover:border-[#22A2DD] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#22A2DD]/15 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                    REELFY + VOICEFY
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8FA3B8] group-hover:text-[#5EEAD4]" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  Edicion de Video Local-First e IA de Voz a 44.1 kHz
                </h3>
                <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                  El motor de montaje, subtitulos, tarjetas Skia 4K60 y clonacion de voz local con F5-TTS y Dynamic Match EQ con el que se produjo el Episodio 01.
                </p>
              </div>
              <div className="mt-4 font-mono-hud text-xs text-[#5EEAD4]">
                reelfy.mixiuh.online →
              </div>
            </a>

            <a
              href="https://holdyfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-[#060B14] border border-white/10 hover:border-[#B794F6] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#B794F6]/15 font-mono-hud text-xs font-bold text-[#B794F6]">
                    HOLDYFY + WHATSAPP CLOUD AI
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8FA3B8] group-hover:text-[#B794F6]" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  Agenda Inteligente, Anticipos y Agente IA WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                  Red de profesionales y servicios agendables con cobros protegidos anti no-show y automatizacion oficial con Meta WhatsApp Cloud API.
                </p>
              </div>
              <div className="mt-4 font-mono-hud text-xs text-[#B794F6]">
                holdyfy.mixiuh.online →
              </div>
            </a>

            <a
              href="https://queryfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-[#060B14] border border-white/10 hover:border-[#34D399] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#34D399]/15 font-mono-hud text-xs font-bold text-[#34D399]">
                    QUERYFY + STOCKFY
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8FA3B8] group-hover:text-[#34D399]" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  DBA Local-First con IA y Punto de Venta Movil
                </h3>
                <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                  Administracion de bases de datos SQL/NoSQL asistida por IA (Queryfy) y punto de venta todo en uno con Tap-to-Pay desde celular (Stockfy).
                </p>
              </div>
              <div className="mt-4 font-mono-hud text-xs text-[#34D399]">
                queryfy.mixiuh.online →
              </div>
            </a>
          </div>

          {/* Sponsorship & Custom Engineering CTA Banner */}
          <div className="rounded-2xl bg-[#11283F] border border-[#22A2DD]/40 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="font-mono-hud text-xs text-[#5EEAD4] font-bold uppercase mb-1">
                {lang === "es"
                  ? "CONTACTO COMERCIAL, PATROCINIOS Y DESARROLLO DE SOFTWARE"
                  : "COMMERCIAL CONTACT, SPONSORSHIPS & CUSTOM ENGINEERING"}
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                {lang === "es"
                  ? "¿Quieres patrocinar un benchmark o construir software de alto rendimiento con Mixiuh?"
                  : "Want to sponsor a benchmark or build high-performance software with Mixiuh?"}
              </h3>
              <p className="text-xs sm:text-sm text-[#8FA3B8] mt-1 max-w-2xl">
                {lang === "es"
                  ? "Desarrollamos plataformas web Next.js, agentes de IA sobre Meta WhatsApp Cloud API, aplicaciones moviles iOS/Android y herramientas de ingenieria a medida."
                  : "We architect ultra-fast Next.js platforms, Meta WhatsApp Cloud API AI agents, native iOS/Android mobile apps, and custom engineering tools."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="mailto:mixiuhonline@gmail.com?subject=Mixiuh%20Labs%20-%20Contacto"
                className="px-5 py-3 rounded-xl bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition"
              >
                mixiuhonline@gmail.com
              </a>
              <a
                href="https://mixiuh.online"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#060B14] border border-white/15 text-white font-mono-hud text-xs font-bold hover:border-[#5EEAD4] transition"
              >
                {lang === "es" ? "Visitar mixiuh.online" : "Visit mixiuh.online"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-[#060B14] text-xs font-mono-hud text-[#8FA3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logos/mixiuh-labs_mark_dark.svg"
              alt="Mixiuh Labs Mark"
              className="w-6 h-6"
            />
            <span>
              Mixiuh Labs · labs.mixiuh.online · &ldquo;Aqui no se opina: se
              prueba.&rdquo;
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Mixiuh
            </a>
            <a
              href="https://holdyfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Holdyfy
            </a>
            <a
              href="https://stockfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Stockfy
            </a>
            <a
              href="https://reelfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Reelfy
            </a>
            <a
              href="https://queryfy.mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Queryfy
            </a>
            <a
              href="https://github.com/danpez/gemini-4-argon-vs-3.8-flash-benchmark"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#5EEAD4]"
            >
              GitHub Benchmark
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
