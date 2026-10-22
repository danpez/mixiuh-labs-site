"use client";

import React, { useState } from "react";
import {
  BENCHMARK_TOTALS,
  CHALLENGES,
  EPISODE_01_CHAPTERS,
  LAB_GLOSSARY,
  SCIENTIFIC_HONESTY_NOTES,
  YOUTUBE_LINKS,
} from "@/data/labsData";
import {
  EP02_BENCHMARK_TOTALS,
  EP02_CHALLENGES,
  EPISODE_02_CHAPTERS,
  EP02_HONESTY_NOTES,
} from "@/data/ep02Data";
import DemoArenaSection from "@/components/DemoArenaModal";
import ForumSection from "@/components/ForumSection";
import {
  Play,
  Terminal,
  Code2,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Search,
  ArrowUpRight,
  Layers,
} from "lucide-react";

export default function MixiuhLabsHomePage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [activeEpisode, setActiveEpisode] = useState<"ep02" | "ep01">("ep02");
  const [selectedChallengeN, setSelectedChallengeN] = useState<number>(1);
  const [activeVideoClip, setActiveVideoClip] = useState<"hook" | "boss">(
    "hook"
  );
  const [glossarySearch, setGlossarySearch] = useState("");

  const isEp02 = activeEpisode === "ep02";

  const handleEpisodeChange = (ep: "ep02" | "ep01") => {
    setActiveEpisode(ep);
    setSelectedChallengeN(ep === "ep02" ? 1 : 6);
    setActiveVideoClip("hook");
  };

  const handleJumpToArena = (episode: "ep02" | "ep01", challengeN: number) => {
    setActiveEpisode(episode);
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

  const activeHonestyNotes = isEp02
    ? EP02_HONESTY_NOTES.map((n) => (lang === "es" ? n.es : n.en))
    : SCIENTIFIC_HONESTY_NOTES.slice(0, 10);

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

          <nav className="hidden lg:flex items-center gap-3 text-[11px] font-mono-hud text-[#8FA3B8] whitespace-nowrap">
            <a
              href="#comentario-al-codigo"
              className="px-2 py-1 rounded bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#FBBF24] hover:text-white font-bold transition-colors"
            >
              {lang === "es"
                ? "OVERFIT 3D (#01)"
                : "OVERFIT 3D (#01)"}
            </a>
            <a
              href="#dossier"
              onClick={() => handleEpisodeChange("ep02")}
              className={`transition-colors ${
                isEp02 ? "text-[#5EEAD4] font-bold" : "hover:text-[#5EEAD4]"
              }`}
            >
              {lang === "es" ? "EP02: Argon vs Opus" : "EP02: Argon vs Opus"}
            </a>
            <a
              href="#dossier"
              onClick={() => handleEpisodeChange("ep01")}
              className={`transition-colors ${
                !isEp02 ? "text-[#5EEAD4] font-bold" : "hover:text-[#5EEAD4]"
              }`}
            >
              {lang === "es" ? "EP01: Argon vs Flash" : "EP01: Argon vs Flash"}
            </a>
            <a
              href="#matriz"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Matriz" : "Matrix"}
            </a>
            <a
              href="#arena"
              className="hover:text-[#B794F6] text-white font-bold transition-colors"
            >
              {lang === "es" ? "Arena (32)" : "Arena (32)"}
            </a>
            <a
              href="#foro"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Foro" : "Forum"}
            </a>
            <a
              href="#glosario"
              className="hover:text-[#5EEAD4] transition-colors"
            >
              {lang === "es" ? "Glosario" : "Glossary"}
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
              href={
                lang === "es"
                  ? YOUTUBE_LINKS.channel_es
                  : YOUTUBE_LINKS.channel_en
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1D30] hover:bg-[#11283F] border border-[#F43F5E]/40 font-mono-hud text-xs text-white transition whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-[#F43F5E] fill-current shrink-0" />
              <span>
                {lang === "es" ? "@MixiuhLabsES" : "@MixiuhLabsEN"}
              </span>
            </a>

            <a
              href="https://github.com/danpez/mixiuh-labs-site"
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

      {/* HERO & EPISODE COMMAND CENTER */}
      <section id="top" className="relative pt-8 pb-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Motto Pill + Channel Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B1D30] border border-[#22A2DD]/40">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="font-mono-hud text-xs font-bold tracking-wider text-[#5EEAD4]">
                {lang === "es"
                  ? "AQUI NO SE OPINA: SE PRUEBA. // LABORATORIO ABIERTO Y FORO DE INGENIERIA"
                  : "HERE, WE DON'T GUESS: WE TEST. // OPEN BENCHMARK LAB & ENGINEERING FORUM"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-hud text-[#8FA3B8]">
              <a
                href={YOUTUBE_LINKS.channel_es}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#0B1D30] hover:bg-[#11283F] border border-white/15 hover:border-[#22A2DD] transition inline-flex items-center gap-1"
              >
                <span>YouTube ES:</span>
                <strong className="text-white">@MixiuhLabsES</strong>
                <ArrowUpRight className="w-3 h-3 text-[#5EEAD4]" />
              </a>
              <a
                href={YOUTUBE_LINKS.channel_en}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#0B1D30] hover:bg-[#11283F] border border-white/15 hover:border-[#22A2DD] transition inline-flex items-center gap-1"
              >
                <span>YouTube EN:</span>
                <strong className="text-white">@MixiuhLabsEN</strong>
                <ArrowUpRight className="w-3 h-3 text-[#5EEAD4]" />
              </a>
            </div>
          </div>

          {/* Episode Selector Switchbar */}
          <div
            id="dossier"
            className="scroll-mt-24 mb-8 p-2 rounded-2xl bg-[#0B1D30]/90 border border-[#22A2DD]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1">
              <a
                href="#comentario-al-codigo"
                className="p-3 rounded-xl border bg-gradient-to-r from-[#11283F] to-[#0B1D30] border-[#FBBF24]/70 hover:border-[#FBBF24] shadow-[0_0_20px_rgba(251,191,36,0.18)] text-left transition flex items-center justify-between gap-3 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#FBBF24]/20 border border-[#FBBF24]/50 font-mono-hud text-[10px] font-bold text-[#FBBF24]">
                      {lang === "es"
                        ? "ESTRENO · DEL COMENTARIO AL CODIGO #01"
                        : "NEW · COMMENT TO CODE #01"}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#5EEAD4]">
                      @tenito03
                    </span>
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
                    {lang === "es"
                      ? "OVERFIT Studio 3D: 10 Artes IA + Mockups 300 GSM"
                      : "OVERFIT Studio 3D: 10 AI Prints + 300 GSM Mockups"}
                  </div>
                </div>
                <span className="font-mono-hud text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FBBF24] text-[#060B14] shrink-0">
                  {lang === "es" ? "Abrir 3D" : "Open 3D"}
                </span>
              </a>

              <button
                onClick={() => handleEpisodeChange("ep02")}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  isEp02
                    ? "bg-[#11283F] border-[#B794F6] shadow-[0_0_20px_rgba(183,148,246,0.22)]"
                    : "bg-[#060B14]/70 border-white/10 hover:border-white/25"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#34D399]/20 border border-[#34D399]/40 font-mono-hud text-[10px] font-bold text-[#34D399]">
                      {lang === "es" ? "NUEVO · EPISODIO 02" : "NEW · EPISODE 02"}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#8FA3B8]">
                      4-2 · $6.26 vs $16.26 USD
                    </span>
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
                    Gemini 4 Argon vs. Claude Opus 5.5 (6 Retos Extremos)
                  </div>
                </div>
                <span
                  className={`font-mono-hud text-xs font-bold px-2.5 py-1 rounded-lg ${
                    isEp02
                      ? "bg-[#B794F6] text-[#060B14]"
                      : "bg-white/5 text-[#8FA3B8]"
                  }`}
                >
                  12 Demos
                </span>
              </button>

              <button
                onClick={() => handleEpisodeChange("ep01")}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  !isEp02
                    ? "bg-[#11283F] border-[#22A2DD] shadow-[0_0_20px_rgba(34,162,221,0.22)]"
                    : "bg-[#060B14]/70 border-white/10 hover:border-white/25"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#22A2DD]/20 border border-[#22A2DD]/40 font-mono-hud text-[10px] font-bold text-[#5EEAD4]">
                      {lang === "es" ? "ARCHIVO · EPISODIO 01" : "ARCHIVE · EPISODE 01"}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#8FA3B8]">
                      10-0 · 55m vs 94m
                    </span>
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
                    Gemini 4 Argon vs. Gemini 3.8 Flash (10 Retos + Medio Pixel)
                  </div>
                </div>
                <span
                  className={`font-mono-hud text-xs font-bold px-2.5 py-1 rounded-lg ${
                    !isEp02
                      ? "bg-[#22A2DD] text-[#060B14]"
                      : "bg-white/5 text-[#8FA3B8]"
                  }`}
                >
                  20 Demos
                </span>
              </button>
            </div>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Title, Scoreboard & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B794F6]/15 border border-[#B794F6]/40 text-[#B794F6] font-mono-hud text-xs font-bold">
                {isEp02
                  ? lang === "es"
                    ? "EPISODIO 02 · DUELO DE TITANES ZERO-SHOT + FACTURA REAL DE TOKENS"
                    : "EPISODE 02 · ZERO-SHOT TITAN DUEL + REAL API TOKEN BILL"
                  : lang === "es"
                  ? "EPISODIO 01 · TORNEO ZERO-SHOT EN ANTIGRAVITY"
                  : "EPISODE 01 · ZERO-SHOT TOURNAMENT IN ANTIGRAVITY"}
              </div>

              {isEp02 ? (
                <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] font-black text-white tracking-tight leading-[1.08]">
                  {lang === "es" ? (
                    <>
                      Gemini 4{" "}
                      <span className="text-[#B794F6]">Argon</span> vs. Claude{" "}
                      <span className="text-[#FBBF24]">Opus 5.5</span>:{" "}
                      <span className="text-[#5EEAD4]">
                        6 Retos Extremos y la Factura Real
                      </span>
                    </>
                  ) : (
                    <>
                      Gemini 4{" "}
                      <span className="text-[#B794F6]">Argon</span> vs. Claude{" "}
                      <span className="text-[#FBBF24]">Opus 5.5</span>:{" "}
                      <span className="text-[#5EEAD4]">
                        6 Extreme Challenges & the Real API Bill
                      </span>
                    </>
                  )}
                </h1>
              ) : (
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
              )}

              <p className="text-base sm:text-lg text-[#8FA3B8] leading-relaxed">
                {isEp02
                  ? lang === "es"
                    ? "Despues del 10-0 contra Flash, metimos al laboratorio a un rival peso pesado: Claude Opus 5.5 (High) contra Gemini 4 Argon (High) en Antigravity. Mismo prompt, un solo intento sin correcciones y telemetria completa de tokens en 6 motores extremos (Tela Verlet, Navier-Stokes, Audio FFT Bloom, 65,536 particulas GPU, Sintetizador FM de 4 operadores y Pinball CCD). Juega las 12 entregas en vivo y audita cada centavo."
                    : "After the 10-0 sweep against Flash, we brought a heavyweight contender into the lab: Claude Opus 5.5 (High) vs. Gemini 4 Argon (High) inside Antigravity. Identical prompts, single zero-shot attempt, and full token telemetry across 6 extreme engines (Verlet Cloth, Navier-Stokes Fluid, Audio FFT Bloom, 65,536 GPU Particles, 4-Op FM Synth, and CCD Pinball). Play all 12 deliverables live and audit every cent."
                  : lang === "es"
                  ? "Enfrentamos a las variantes High de Gemini 4 Argon y Gemini 3.8 Flash dentro de Antigravity con el mismo prompt, un solo intento sin correcciones y cero imagenes externas en 10 retos de WebGL, fisica, pixel art, CSS puro y matematicas. Explora las 20 simulaciones en vivo, audita el codigo fuente y participa en el foro."
                  : "We pitted the High variants of Gemini 4 Argon and Gemini 3.8 Flash head-to-head inside Antigravity using identical prompts, a single attempt with zero follow-ups, and zero external images across 10 WebGL, physics, pixel art, pure CSS, and math challenges. Play all 20 simulations live, audit the code, and join the forum."}
              </p>

              {/* Big VS Scoreboard Card with Mascots */}
              {isEp02 ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border border-[#22A2DD]/30 shadow-2xl">
                  <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-white/10">
                    {/* Left: CLAUDE OPUS 5.5 (Mixiuh Labs canon: Opponent always on left in amber) */}
                    <div className="flex items-center gap-3">
                      <img
                        src="/brand/mascots/opus_star.png"
                        alt="Claude Opus 5.5"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#060B14] p-1.5 border border-[#FBBF24]/50 object-contain shrink-0"
                      />
                      <div>
                        <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#FBBF24] uppercase">
                          Claude Opus 5.5
                        </div>
                        <div className="font-display text-2xl sm:text-4xl font-black text-[#FBBF24]">
                          2
                        </div>
                        <div className="font-mono-hud text-[11px] text-[#8FA3B8]">
                          159 min · $16.26 USD
                        </div>
                      </div>
                    </div>

                    {/* Center VS */}
                    <div className="text-center">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#060B14] border border-white/15 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                        MARCADOR 4 - 2
                      </div>
                      <div className="font-mono-hud text-xs text-[#34D399] font-bold mt-1.5">
                        -69 MIN · -$10.00 USD
                      </div>
                    </div>

                    {/* Right: GEMINI 4 ARGON */}
                    <div className="flex items-center justify-end gap-3 text-right">
                      <div>
                        <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#B794F6] uppercase">
                          Gemini 4 Argon
                        </div>
                        <div className="font-display text-2xl sm:text-4xl font-black text-[#34D399]">
                          4
                        </div>
                        <div className="font-mono-hud text-[11px] text-[#8FA3B8]">
                          90 min · $6.26 USD
                        </div>
                      </div>
                      <img
                        src="/brand/mascots/argon_winner.png"
                        alt="Gemini 4 Argon"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#060B14] p-1 border border-[#B794F6]/50 object-contain shrink-0"
                      />
                    </div>
                  </div>

                  {/* 4 Sub-metrics for EP02 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                      <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                        {lang === "es" ? "RELOJ ACUMULADO" : "OVERALL CLOCK"}
                      </div>
                      <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                        90m vs 159m
                      </div>
                      <div className="text-[11px] text-[#34D399]">
                        {lang === "es"
                          ? "Argon 1.76x mas rapido"
                          : "Argon 1.76x faster"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                      <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                        {lang === "es" ? "FACTURA API REAL" : "REAL API BILL"}
                      </div>
                      <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                        $6.26 vs $16.26
                      </div>
                      <div className="text-[11px] text-[#FBBF24]">
                        {lang === "es"
                          ? "Opus 2.60x mas caro"
                          : "Opus 2.60x costlier"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                      <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                        {lang === "es" ? "TOKENS CONSUMIDOS" : "TOTAL TOKENS"}
                      </div>
                      <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                        3.63M vs 13.01M
                      </div>
                      <div className="text-[11px] text-[#B794F6]">
                        {lang === "es"
                          ? "45 vs 143 pasos agente"
                          : "45 vs 143 agent steps"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#060B14]/70 border border-white/10">
                      <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                        {lang === "es" ? "TASA DE CUADROS" : "FRAME RATE"}
                      </div>
                      <div className="font-mono-hud text-sm font-bold text-white mt-0.5">
                        120 FPS (6/6 Argon)
                      </div>
                      <div className="text-[11px] text-[#F43F5E]">
                        {lang === "es"
                          ? "Opus: 28 FPS en Reto 01"
                          : "Opus: 28 FPS on Ch 01"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border border-[#22A2DD]/30 shadow-2xl">
                  <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-white/10">
                    {/* Left: FLASH */}
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
                        -39 MIN (-41.5%)
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

                  {/* 4 Sub-metrics for EP01 */}
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
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#arena"
                  className="px-6 py-3.5 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_28px_rgba(183,148,246,0.35)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isEp02
                    ? lang === "es"
                      ? "Jugar los 12 Motores EP02 en Vivo"
                      : "Play All 12 EP02 Engines Live"
                    : lang === "es"
                    ? "Jugar las 20 Simulaciones EP01 en Vivo"
                    : "Play All 20 EP01 Simulations Live"}
                </a>

                <a
                  href={
                    isEp02
                      ? YOUTUBE_LINKS.ep02_es
                      : lang === "es"
                      ? YOUTUBE_LINKS.ep01_es
                      : YOUTUBE_LINKS.ep01_en
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#F43F5E] hover:brightness-110 text-white font-mono-hud text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-[0_0_24px_rgba(244,63,94,0.32)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isEp02
                    ? lang === "es"
                      ? "Ver Episodio 02 en YouTube (4K60)"
                      : "Watch Episode 02 on YouTube (4K60)"
                    : lang === "es"
                    ? "Ver Episodio 01 en YouTube (4K60)"
                    : "Watch Episode 01 on YouTube (4K60)"}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#foro"
                  className="px-5 py-3.5 rounded-xl bg-[#11283F] hover:bg-[#22A2DD]/20 border border-[#22A2DD]/40 text-white font-mono-hud text-xs sm:text-sm font-bold transition flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-[#5EEAD4]" />
                  {isEp02
                    ? lang === "es"
                      ? "Autopsia 28 FPS vs 120 FPS y Tokens"
                      : "28 FPS vs 120 FPS & Token Autopsy"
                    : lang === "es"
                    ? "Ver Autopsia del Medio Pixel (Nivel 6)"
                    : "Inspect Half-Pixel Bug Autopsy (Level 6)"}
                </a>
              </div>
            </div>

            {/* Right 5 Cols: Video Preview Player + Interactive Chapters */}
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
                    {isEp02
                      ? lang === "es"
                        ? "1. Hook Oficial EP02"
                        : "1. Official EP02 Hook"
                      : lang === "es"
                      ? "1. Hook Oficial EP01"
                      : "1. Official EP01 Hook"}
                  </button>
                  <button
                    onClick={() => setActiveVideoClip("boss")}
                    className={`px-3 py-1.5 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                      activeVideoClip === "boss"
                        ? "bg-[#F43F5E] text-white"
                        : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                    }`}
                  >
                    {isEp02
                      ? lang === "es"
                        ? "2. Reto 01 & 06 (Verlet + Pinball)"
                        : "2. Ch 01 & 06 (Verlet + Pinball)"
                      : lang === "es"
                      ? "2. Nivel 6: El Jefe (Raycasting)"
                      : "2. Level 6: Boss Fight"}
                  </button>
                </div>
                <a
                  href={
                    isEp02
                      ? YOUTUBE_LINKS.ep02_es
                      : lang === "es"
                      ? YOUTUBE_LINKS.ep01_es
                      : YOUTUBE_LINKS.ep01_en
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-hud text-[11px] font-bold text-[#5EEAD4] hover:text-white inline-flex items-center gap-1"
                >
                  <span>YouTube 4K60</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              {/* HTML5 Video Player with real rendered EP02 / EP01 footage */}
              <div className="relative bg-black aspect-video">
                <video
                  key={`${activeEpisode}-${activeVideoClip}`}
                  controls
                  playsInline
                  preload="metadata"
                  poster={
                    isEp02
                      ? activeVideoClip === "hook"
                        ? "/brand/thumbs/ep02_thumb_A_1280.jpg"
                        : "/brand/thumbs/ep02_thumb_B_1280.jpg"
                      : activeVideoClip === "hook"
                      ? "/brand/thumbs/01_marcador-0-10_1280.jpg"
                      : "/brand/thumbs/02_medio-pixel_1280.jpg"
                  }
                  className="w-full h-full object-cover"
                >
                  <source
                    src={
                      isEp02
                        ? activeVideoClip === "hook"
                          ? "/videos/ep02-hook.mp4"
                          : "/videos/ep02-boss.mp4"
                        : activeVideoClip === "hook"
                        ? "/videos/ep01-hook.mp4"
                        : "/videos/ep01-boss.mp4"
                    }
                    type="video/mp4"
                  />
                  <track
                    kind="captions"
                    src={
                      isEp02
                        ? "/videos/ep02_captions_es.vtt"
                        : "/videos/captions_es.vtt"
                    }
                    srcLang="es"
                    label="Espanol (Mexico)"
                  />
                  {isEp02 && (
                    <track
                      kind="captions"
                      src="/videos/ep02_captions_en.vtt"
                      srcLang="en"
                      label="English"
                    />
                  )}
                </video>
              </div>

              {/* Full Episode YouTube Banner */}
              <div className="px-4 py-2.5 bg-[#11283F]/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={
                    isEp02
                      ? YOUTUBE_LINKS.ep02_es
                      : lang === "es"
                      ? YOUTUBE_LINKS.ep01_es
                      : YOUTUBE_LINKS.ep01_en
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-hud text-xs font-bold text-white hover:text-[#5EEAD4] transition inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-[#F43F5E] fill-current shrink-0" />
                  <span>
                    {isEp02
                      ? lang === "es"
                        ? "Abrir Episodio 02 en YouTube (08:06 · 4K60)"
                        : "Open Episode 02 on YouTube (08:06 · 4K60)"
                      : lang === "es"
                      ? "Abrir Episodio 01 en YouTube (10:05 · 4K60)"
                      : "Open Episode 01 on YouTube (10:05 · 4K60)"}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#5EEAD4]" />
                </a>
                <div className="flex items-center gap-2 font-mono-hud text-[11px]">
                  <a
                    href={isEp02 ? YOUTUBE_LINKS.ep02_es : YOUTUBE_LINKS.ep01_es}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-[#060B14] border border-white/15 text-[#5EEAD4] hover:border-[#22A2DD]"
                  >
                    YT ES
                  </a>
                  <a
                    href={isEp02 ? YOUTUBE_LINKS.ep02_en : YOUTUBE_LINKS.ep01_en}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-[#060B14] border border-white/15 text-[#B794F6] hover:border-[#B794F6]"
                  >
                    YT EN
                  </a>
                </div>
              </div>

              {/* Interactive Chapters List */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono-hud text-xs font-bold text-[#5EEAD4] uppercase">
                    {isEp02
                      ? lang === "es"
                        ? "10 CAPITULOS DEL EPISODIO 02 (CLIC PARA JUGAR O VER EN YT)"
                        : "10 EPISODE 02 CHAPTERS (CLICK TO PLAY OR WATCH ON YT)"
                      : lang === "es"
                      ? "14 CAPITULOS DEL EPISODIO 01 (CLIC PARA JUGAR O VER EN YT)"
                      : "14 EPISODE 01 CHAPTERS (CLICK TO PLAY OR WATCH ON YT)"}
                  </span>
                  <span className="font-mono-hud text-[11px] text-[#8FA3B8]">
                    {isEp02 ? "08:06 · 4K60" : "10:05 · 4K60"}
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {isEp02
                    ? EPISODE_02_CHAPTERS.map((chap) => {
                        const timeStr =
                          lang === "es" ? chap.time_es : chap.time_en;
                        const secs =
                          lang === "es" ? chap.seconds_es : chap.seconds_en;
                        const ytUrl = `${YOUTUBE_LINKS.ep02_es}?t=${secs}`;
                        return (
                          <div
                            key={chap.time_es}
                            onClick={() => {
                              if (chap.level) {
                                handleJumpToArena("ep02", chap.level);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg bg-[#060B14]/70 hover:bg-[#11283F] border border-white/5 hover:border-[#22A2DD]/40 transition flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <a
                                href={ytUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono-hud text-xs font-bold text-[#22A2DD] hover:text-[#5EEAD4] underline decoration-[#22A2DD]/40 shrink-0"
                              >
                                {timeStr}
                              </a>
                              <span className="text-xs text-[#F5F7FA] truncate">
                                {lang === "es" ? chap.title_es : chap.title_en}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {chap.level && (
                                <span className="font-mono-hud text-[10px] px-2 py-0.5 rounded bg-[#B794F6]/15 text-[#B794F6]">
                                  {lang === "es"
                                    ? `Jugar R0${chap.level}`
                                    : `Play C0${chap.level}`}
                                </span>
                              )}
                              <a
                                href={ytUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono-hud text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#F43F5E]/20 text-[#8FA3B8] hover:text-white border border-white/10"
                              >
                                YT
                              </a>
                            </div>
                          </div>
                        );
                      })
                    : EPISODE_01_CHAPTERS.map((chap) => {
                        const ytBase =
                          lang === "es"
                            ? YOUTUBE_LINKS.ep01_es
                            : YOUTUBE_LINKS.ep01_en;
                        const ytUrl = `${ytBase}?t=${chap.seconds}`;
                        return (
                          <div
                            key={chap.time}
                            onClick={() => {
                              if (chap.level) {
                                handleJumpToArena("ep01", chap.level);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg bg-[#060B14]/70 hover:bg-[#11283F] border border-white/5 hover:border-[#22A2DD]/40 transition flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <a
                                href={ytUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono-hud text-xs font-bold text-[#22A2DD] hover:text-[#5EEAD4] underline decoration-[#22A2DD]/40 shrink-0"
                              >
                                {chap.time}
                              </a>
                              <span className="text-xs text-[#F5F7FA] truncate">
                                {lang === "es" ? chap.title_es : chap.title_en}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {chap.level && (
                                <span className="font-mono-hud text-[10px] px-2 py-0.5 rounded bg-[#B794F6]/15 text-[#B794F6]">
                                  {lang === "es"
                                    ? `Jugar N${chap.level}`
                                    : `Play L${chap.level}`}
                                </span>
                              )}
                              <a
                                href={ytUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono-hud text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#F43F5E]/20 text-[#8FA3B8] hover:text-white border border-white/10"
                              >
                                YT
                              </a>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEL COMENTARIO AL CODIGO #01 — OVERFIT STUDIO 3D (@TENITO03) */}
      <section
        id="comentario-al-codigo"
        className="scroll-mt-20 py-14 border-t border-[#FBBF24]/30 bg-gradient-to-b from-[#081526] via-[#060B14] to-[#0B1D30]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/40 font-mono-hud text-xs font-bold text-[#FBBF24]">
                <span>
                  {lang === "es"
                    ? "NUEVA SECCION · DEL COMENTARIO AL CODIGO #01 · RETO DE @TENITO03"
                    : "NEW SERIES · FROM COMMENT TO CODE #01 · @TENITO03 CHALLENGE"}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                {lang === "es" ? (
                  <>
                    De un Comentario a una Marca de Ropa IA en 3D:{" "}
                    <span className="text-[#5EEAD4]">OVERFIT Studio 3D</span>{" "}
                    <span className="text-[#B794F6]">
                      (Coleccion Guerra de Pesos)
                    </span>
                  </>
                ) : (
                  <>
                    From a Comment to a 3D AI Streetwear Brand:{" "}
                    <span className="text-[#5EEAD4]">OVERFIT Studio 3D</span>{" "}
                    <span className="text-[#B794F6]">
                      (Weight War Collection)
                    </span>
                  </>
                )}
              </h2>
              <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed">
                {lang === "es"
                  ? "Despues de publicar la tela fisica de Verlet del Episodio 02, @tenito03 nos reto en comentarios a convertir esa textura en una playera, un mockup en blanco editable y una marca de ropa completa. Esculpimos en Blender Cycles tres siluetas reales en algodon de 300 gramos (Hombre, Mujer y Mesa) y creamos los 10 artes satiricos de la coleccion Guerra de Pesos. Pruebalo en vivo aqui abajo o abrelo a pantalla completa."
                  : "After posting the Episode 02 Verlet cloth simulation, @tenito03 challenged us in the comments to turn that texture into a t-shirt, an editable blank mockup, and a full clothing brand. We sculpted three real 300 GSM silhouettes in Blender Cycles (Male, Female, Flat-Lay) and designed 10 satirical AI prints for the Weight War collection. Try it live below or open it in full screen."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/overfit/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#FBBF24] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition inline-flex items-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.3)]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {lang === "es"
                    ? "Abrir OVERFIT Studio 3D (Pantalla Completa)"
                    : "Launch OVERFIT Studio 3D (Full Screen)"}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="/api/source?model=comunidad&dir=cc01-overfit-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#0B1D30] hover:bg-[#11283F] border border-[#22A2DD]/40 text-[#5EEAD4] font-mono-hud text-xs sm:text-sm font-bold transition inline-flex items-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                <span>
                  {lang === "es"
                    ? "Auditar Codigo (JSON / HTML)"
                    : "Audit Source (JSON / HTML)"}
                </span>
              </a>

              <a
                href="#foro"
                className="px-4 py-3 rounded-xl bg-[#11283F] hover:bg-[#B794F6]/20 border border-[#B794F6]/40 text-white font-mono-hud text-xs sm:text-sm font-bold transition inline-flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-[#B794F6]" />
                <span>
                  {lang === "es"
                    ? "Proponer Reto para el Episodio #02"
                    : "Propose Challenge for Episode #02"}
                </span>
              </a>
            </div>
          </div>

          {/* 3-Column Overview: Original Comment + 3 Stages + Thumbnails */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Col 1: Original Comment Card */}
            <div className="lg:col-span-4 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 p-4 flex flex-col justify-between gap-4">
              <div>
                <div className="font-mono-hud text-[11px] font-bold text-[#5EEAD4] uppercase mb-2">
                  {lang === "es"
                    ? "1. EL COMENTARIO ORIGINAL (@TENITO03)"
                    : "1. THE ORIGINAL COMMENT (@TENITO03)"}
                </div>
                <div className="rounded-xl overflow-hidden border-2 border-[#22A2DD]/50 bg-white p-1 shadow-lg">
                  <img
                    src="/brand/thumbs/comentario_tenito03_ig.jpg"
                    alt="Comentario de @tenito03 en Instagram"
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono-hud text-[10px] text-center">
                <div className="p-2 rounded-lg bg-[#060B14] border border-[#34D399]/40 text-[#34D399] font-bold">
                  1. MOCKUP 300G
                </div>
                <div className="p-2 rounded-lg bg-[#060B14] border border-[#22A2DD]/40 text-[#5EEAD4] font-bold">
                  2. 10 ARTES IA
                </div>
                <div className="p-2 rounded-lg bg-[#060B14] border border-[#FBBF24]/40 text-[#FBBF24] font-bold">
                  3. PACK 4K
                </div>
              </div>
            </div>

            {/* Col 2: Architecture & 10 Designs Summary */}
            <div className="lg:col-span-8 rounded-2xl bg-[#0B1D30] border border-[#B794F6]/30 p-5 flex flex-col justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#060B14] border border-white/10">
                  <div className="font-mono-hud text-[11px] font-bold text-[#34D399]">
                    {lang === "es"
                      ? "ETAPA 1 · BLENDER CYCLES 300G"
                      : "STAGE 1 · BLENDER CYCLES 300G"}
                  </div>
                  <div className="font-display text-sm font-bold text-white mt-1">
                    {lang === "es"
                      ? "Hombre, Mujer y Mesa Flat-Lay"
                      : "Male, Female & Studio Flat-Lay"}
                  </div>
                  <p className="text-xs text-[#8FA3B8] mt-1 leading-relaxed">
                    {lang === "es"
                      ? "Mapas de iluminacion y pliegues reales en 300 GSM con 6 colores textiles, modo Mockup en Blanco y subida de tu propio logo PNG."
                      : "Real 300 GSM lighting and fold displacement maps with 6 colorways, Blank Mockup mode, and custom PNG logo upload."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060B14] border border-white/10">
                  <div className="font-mono-hud text-[11px] font-bold text-[#5EEAD4]">
                    {lang === "es"
                      ? "ETAPA 2 · 10 ARTES OVERFIT"
                      : "STAGE 2 · 10 OVERFIT PRINTS"}
                  </div>
                  <div className="font-display text-sm font-bold text-white mt-1">
                    {lang === "es"
                      ? "Coleccion Guerra de Pesos"
                      : "Weight War Collection"}
                  </div>
                  <p className="text-xs text-[#8FA3B8] mt-1 leading-relaxed">
                    {lang === "es"
                      ? "#01 Strawberry R's, #02 Vibe Coding en Prod, #03 CUDA Poor, #04 Benchmark, #05 Open Source, #06 Censura, #07 Tabla Nutricional LLM, #08 Sin AGI, #09 Dev Evolution y #10 Tranvia."
                      : "#01 Strawberry R's, #02 Vibe Coding in Prod, #03 CUDA Poor, #04 Benchmark, #05 Open Source, #06 Refusal, #07 LLM Nutrition Facts, #08 No AGI, #09 Dev Evolution & #10 Token Trolley."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060B14] border border-white/10">
                  <div className="font-mono-hud text-[11px] font-bold text-[#FBBF24]">
                    {lang === "es"
                      ? "ETAPA 3 · VISTAS Y SALIDA 4K"
                      : "STAGE 3 · VIEWS & 4K EXPORT"}
                  </div>
                  <div className="font-display text-sm font-bold text-white mt-1">
                    {lang === "es"
                      ? "Frente + Espalda y Lookbook"
                      : "Front + Back & Lookbook"}
                  </div>
                  <p className="text-xs text-[#8FA3B8] mt-1 leading-relaxed">
                    {lang === "es"
                      ? "Alterna entre Vista Frente, Zoom Pecho, Espalda, Frente + Espalda (#07 Tabla Nutricional) y Hombre + Mujer, y exporta posters 9:16 y PNG 4K."
                      : "Switch between Front, Chest Zoom, Back, Front + Back (#07 LLM Nutrition Facts), and Male + Female views, and export 9:16 posters and 4K PNGs."}
                  </p>
                </div>
              </div>

              {/* 3 Episode Thumbnails Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <img
                  src="/brand/thumbs/cc01_thumb_A.jpg"
                  alt="Miniatura A - De Comentario a Marca"
                  className="w-full h-28 sm:h-32 object-cover rounded-xl border border-white/15"
                />
                <img
                  src="/brand/thumbs/cc01_thumb_B.jpg"
                  alt="Miniatura B - 10 Diseños IA 3D"
                  className="w-full h-28 sm:h-32 object-cover rounded-xl border border-white/15"
                />
                <img
                  src="/brand/thumbs/cc01_thumb_C.jpg"
                  alt="Miniatura C - Mockups 300 GSM"
                  className="w-full h-28 sm:h-32 object-cover rounded-xl border border-white/15"
                />
              </div>
            </div>
          </div>

          {/* Live Interactive Embedded OVERFIT Studio 3D */}
          <div className="rounded-2xl bg-[#060B14] border-2 border-[#22A2DD]/40 overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                <span className="font-mono-hud text-xs sm:text-sm font-bold text-white">
                  {lang === "es"
                    ? "ESTUDIO INTERACTIVO EN VIVO · OVERFIT STUDIO 3D (PRUEBA LOS 10 ESTAMPADOS, SILUETAS Y VISTAS)"
                    : "LIVE INTERACTIVE STUDIO · OVERFIT STUDIO 3D (TEST ALL 10 PRINTS, SILHOUETTES & VIEWS)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/overfit/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1"
                >
                  <span>
                    {lang === "es"
                      ? "Abrir en Nueva Pestaña"
                      : "Open in New Tab"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="w-full h-[820px] sm:h-[860px] bg-[#04060A]">
              <iframe
                src="/overfit/index.html"
                title="OVERFIT Studio 3D — Del Comentario al Codigo #01 (@tenito03)"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVE MATRIX TABLE (EP02 6 CHALLENGES + TOKEN BILL OR EP01 10 CHALLENGES) */}
      <section
        id="matriz"
        className="scroll-mt-24 py-12 border-t border-[#22A2DD]/15 bg-[#060B14]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono-hud uppercase text-[#5EEAD4] font-bold mb-1">
                {isEp02
                  ? lang === "es"
                    ? "TABLA MAESTRA VERIFICADA EP02 · 6 RETOS ZERO-SHOT + FACTURA DE TOKENS"
                    : "VERIFIED EP02 MASTER TABLE · 6 ZERO-SHOT CHALLENGES + TOKEN BILL"
                  : lang === "es"
                  ? "TABLA MAESTRA VERIFICADA EP01 · 10 RETOS ZERO-SHOT"
                  : "VERIFIED EP01 MASTER TABLE · 10 ZERO-SHOT CHALLENGES"}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                {isEp02
                  ? lang === "es"
                    ? "Matriz Comparativa: Tiempo, FPS, Tokens y Costo en USD"
                    : "Comparative Matrix: Time, FPS, Tokens & Cost in USD"
                  : lang === "es"
                  ? "Matriz Comparativa Nivel por Nivel (Episodio 01)"
                  : "Level-by-Level Comparative Matrix (Episode 01)"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEpisodeChange("ep02")}
                className={`px-3 py-1.5 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                  isEp02
                    ? "bg-[#B794F6] text-[#060B14]"
                    : "bg-[#0B1D30] text-[#8FA3B8] border border-white/10"
                }`}
              >
                EP02: Argon vs Opus (6)
              </button>
              <button
                onClick={() => handleEpisodeChange("ep01")}
                className={`px-3 py-1.5 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                  !isEp02
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "bg-[#0B1D30] text-[#8FA3B8] border border-white/10"
                }`}
              >
                EP01: Argon vs Flash (10)
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/25 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              {isEp02 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#11283F] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">
                        {lang === "es" ? "Reto y Stack" : "Challenge & Stack"}
                      </th>
                      <th className="py-3.5 px-4 text-[#FBBF24]">
                        Claude Opus 5.5 (Reloj / Loc / FPS)
                      </th>
                      <th className="py-3.5 px-4 text-[#FBBF24]">
                        Opus Tokens / USD
                      </th>
                      <th className="py-3.5 px-4 text-[#B794F6]">
                        Gemini 4 Argon (Reloj / Loc / FPS)
                      </th>
                      <th className="py-3.5 px-4 text-[#B794F6]">
                        Argon Tokens / USD
                      </th>
                      <th className="py-3.5 px-4">
                        {lang === "es" ? "Ganador" : "Winner"}
                      </th>
                      <th className="py-3.5 px-4 text-right">
                        {lang === "es" ? "Accion" : "Action"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                    {EP02_CHALLENGES.map((ch) => (
                      <tr
                        key={ch.n}
                        onClick={() => handleJumpToArena("ep02", ch.n)}
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
                            {ch.time_min.opus} min
                          </span>{" "}
                          <span
                            className={`text-xs ${
                              ch.opus_slow_fps
                                ? "text-[#F43F5E] font-bold"
                                : "text-[#8FA3B8]"
                            }`}
                          >
                            · {ch.fps.opus}
                          </span>
                          <span className="text-[#8FA3B8] text-xs block">
                            {ch.code_stats.opus_lines} loc · {ch.code_stats.opus_kb} KB
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud">
                          <span className="text-[#FBBF24] font-bold">
                            ${ch.cost_usd.opus.toFixed(2)} USD
                          </span>
                          <span className="text-[#8FA3B8] text-xs block">
                            {ch.tokens.opus_total} tok ({ch.tokens.opus_steps}p)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud">
                          <span className="text-[#B794F6] font-bold">
                            {ch.time_min.argon} min
                          </span>{" "}
                          <span className="text-[#34D399] text-xs">
                            · {ch.fps.argon}
                          </span>
                          <span className="text-[#8FA3B8] text-xs block">
                            {ch.code_stats.argon_lines} loc · {ch.code_stats.argon_kb} KB
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud">
                          <span className="text-[#34D399] font-bold">
                            ${ch.cost_usd.argon.toFixed(2)} USD
                          </span>
                          <span className="text-[#8FA3B8] text-xs block">
                            {ch.tokens.argon_total} tok ({ch.tokens.argon_steps}p)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {ch.winner === "argon" ? (
                            <span className="px-2.5 py-1 rounded bg-[#34D399]/15 border border-[#34D399]/40 font-mono-hud text-[11px] font-bold text-[#34D399]">
                              ARGON
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-[#FBBF24]/15 border border-[#FBBF24]/40 font-mono-hud text-[11px] font-bold text-[#FBBF24]">
                              OPUS 5.5
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJumpToArena("ep02", ch.n);
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
                          ? "6 Retos Extremos (12 Archivos index.html)"
                          : "6 Extreme Challenges (12 index.html Files)"}
                      </td>
                      <td className="py-4 px-4 text-[#FBBF24]">
                        {EP02_BENCHMARK_TOTALS.opus_min_rounded} min ·{" "}
                        {EP02_BENCHMARK_TOTALS.code_totals.opus_lines} loc (
                        {EP02_BENCHMARK_TOTALS.code_totals.opus_kb} KB)
                      </td>
                      <td className="py-4 px-4 text-[#FBBF24]">
                        ${EP02_BENCHMARK_TOTALS.opus_cost_usd.toFixed(2)} USD ·{" "}
                        {EP02_BENCHMARK_TOTALS.opus_tokens_total} tok
                      </td>
                      <td className="py-4 px-4 text-[#B794F6]">
                        {EP02_BENCHMARK_TOTALS.argon_min_rounded} min ·{" "}
                        {EP02_BENCHMARK_TOTALS.code_totals.argon_lines} loc (
                        {EP02_BENCHMARK_TOTALS.code_totals.argon_kb} KB)
                      </td>
                      <td className="py-4 px-4 text-[#34D399]">
                        ${EP02_BENCHMARK_TOTALS.argon_cost_usd.toFixed(2)} USD ·{" "}
                        {EP02_BENCHMARK_TOTALS.argon_tokens_total} tok
                      </td>
                      <td className="py-4 px-4 text-[#34D399]">
                        ARGON {EP02_BENCHMARK_TOTALS.score}
                      </td>
                      <td className="py-4 px-4 text-right text-[#8FA3B8]">
                        1.76x / 2.60x
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
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
                        onClick={() => handleJumpToArena("ep01", ch.n)}
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
                              handleJumpToArena("ep01", ch.n);
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE LIVE ARENA (ALL 32 SIMULATIONS + GUMMY BEARS BONUS) */}
      <DemoArenaSection
        lang={lang}
        activeEpisode={activeEpisode}
        onChangeEpisode={handleEpisodeChange}
        selectedChallengeN={selectedChallengeN}
        onSelectChallengeN={setSelectedChallengeN}
      />

      {/* INTERACTIVE ENGINEERING FORUM & COMMUNITY */}
      <ForumSection lang={lang} onJumpToArena={handleJumpToArena} />

      {/* TECHNICAL GLOSSARY (53 TERMS) & SCIENTIFIC HONESTY PROTOCOL */}
      <section
        id="glosario"
        className="scroll-mt-24 py-14 border-t border-[#22A2DD]/15 bg-[#060B14]/70"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Scientific Honesty & Transparency Protocol */}
          <div className="rounded-2xl bg-[#0B1D30] border border-[#34D399]/30 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs font-mono-hud uppercase text-[#34D399] font-bold">
                <ShieldCheck className="w-4 h-4" />
                {lang === "es"
                  ? `PROTOCOLO DE HONESTIDAD CIENTIFICA · ${isEp02 ? "EPISODIO 02" : "EPISODIO 01"}`
                  : `SCIENTIFIC HONESTY PROTOCOL · ${isEp02 ? "EPISODE 02" : "EPISODE 01"}`}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEpisodeChange("ep02")}
                  className={`px-2.5 py-1 rounded font-mono-hud text-[11px] font-bold cursor-pointer ${
                    isEp02
                      ? "bg-[#34D399] text-[#060B14]"
                      : "bg-[#060B14] text-[#8FA3B8]"
                  }`}
                >
                  Notas EP02
                </button>
                <button
                  onClick={() => handleEpisodeChange("ep01")}
                  className={`px-2.5 py-1 rounded font-mono-hud text-[11px] font-bold cursor-pointer ${
                    !isEp02
                      ? "bg-[#34D399] text-[#060B14]"
                      : "bg-[#060B14] text-[#8FA3B8]"
                  }`}
                >
                  Notas EP01
                </button>
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
              {lang === "es"
                ? "Notas de Rigor Metodologico y Transparencia de Datos"
                : "Methodological Rigor & Data Transparency Notes"}
            </h2>
            <p className="text-sm text-[#8FA3B8] mb-6 max-w-3xl">
              {lang === "es"
                ? "Para que nuestras pruebas sean tomadas en serio por ingenieros, documentamos abiertamente las victorias del rival, las tarifas de tokens y los limites de hardware observados:"
                : "So that our benchmarks stand up to strict engineering scrutiny, we openly document rival wins, official token rates, and hardware boundaries:"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeHonestyNotes.map((note, idx) => (
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

          {/* Interactive 53-Term Glossary */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-hud uppercase text-[#5EEAD4] font-bold mb-1">
                  <BookOpen className="w-4 h-4" />
                  {lang === "es"
                    ? `GLOSARIO TECNICO MIXIUH LABS (${LAB_GLOSSARY.length} CONCEPTOS EP01 + EP02)`
                    : `MIXIUH LABS TECHNICAL GLOSSARY (${LAB_GLOSSARY.length} CONCEPTS EP01 + EP02)`}
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
                      ? "Buscar Verlet, CCD, FBO, DDA..."
                      : "Search Verlet, CCD, FBO, DDA..."
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
                  El motor de montaje, subtitulos, tarjetas Skia 4K60 y clonacion de voz local con F5-TTS y Dynamic Match EQ con el que se produjeron los Episodios 01 y 02.
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
              href={YOUTUBE_LINKS.channel_es}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#5EEAD4]"
            >
              YouTube ES (@MixiuhLabsES)
            </a>
            <a
              href={YOUTUBE_LINKS.channel_en}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#B794F6]"
            >
              YouTube EN (@MixiuhLabsEN)
            </a>
            <a
              href={YOUTUBE_LINKS.ep02_es}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#34D399] hover:text-white font-bold"
            >
              {lang === "es" ? "Episodio 02 (YouTube)" : "Episode 02 (YouTube)"}
            </a>
            <a
              href={
                lang === "es"
                  ? YOUTUBE_LINKS.ep01_es
                  : YOUTUBE_LINKS.ep01_en
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F43F5E] hover:text-white font-bold"
            >
              {lang === "es" ? "Episodio 01 (YouTube)" : "Episode 01 (YouTube)"}
            </a>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
