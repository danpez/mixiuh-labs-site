"use client";

import React, { useState, useEffect } from "react";
import {
  CHALLENGES,
  BONUS_EXPERIMENT,
  type ChallengeData,
} from "@/data/labsData";
import {
  Play,
  Code2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Columns,
  Maximize2,
  Terminal,
  AlertTriangle,
  Award,
  Clock,
  FileCode,
  Sparkles,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

interface Props {
  lang: "es" | "en";
  selectedChallengeN: number;
  onSelectChallengeN: (n: number) => void;
}

type ArenaTab = "argon" | "split" | "flash" | "prompt" | "source" | "stills";

export default function DemoArenaSection({
  lang,
  selectedChallengeN,
  onSelectChallengeN,
}: Props) {
  const [activeTab, setActiveTab] = useState<ArenaTab>("argon");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [sourceModel, setSourceModel] = useState<"argon" | "flash">("argon");
  const [sourceData, setSourceData] = useState<{
    code: string;
    lines: number;
    kb: number;
  } | null>(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const [showBonus, setShowBonus] = useState(false);

  const currentChallenge: ChallengeData =
    CHALLENGES.find((c) => c.n === selectedChallengeN) || CHALLENGES[5];

  useEffect(() => {
    if (activeTab === "source") {
      setLoadingSource(true);
      const dir = showBonus ? BONUS_EXPERIMENT.dir : currentChallenge.dir;
      const model = showBonus ? "argon" : sourceModel;
      fetch(`/api/source?model=${model}&dir=${dir}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.code) {
            setSourceData({
              code: data.code,
              lines: data.lines,
              kb: data.kb,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingSource(false));
    }
  }, [activeTab, sourceModel, currentChallenge.dir, showBonus]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentChallenge.prompt_verbatim);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleCopySource = () => {
    if (!sourceData?.code) return;
    navigator.clipboard.writeText(sourceData.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <section id="arena" className="scroll-mt-24 py-14 border-t border-[#22A2DD]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11283F] border border-[#22A2DD]/30 text-[#5EEAD4] text-xs font-mono-hud uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5" />
              {lang === "es"
                ? "ARENA INTERACTIVA ZERO-SHOT · 20 SIMULACIONES EN VIVO"
                : "INTERACTIVE ZERO-SHOT ARENA · 20 LIVE SIMULATIONS"}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
              {lang === "es"
                ? "Juega y Audita los 10 Retos en tu Navegador"
                : "Play & Audit All 10 Challenges in Your Browser"}
            </h2>
            <p className="text-[#8FA3B8] text-sm sm:text-base mt-2 max-w-3xl">
              {lang === "es"
                ? "Cada simulacion de abajo es el archivo index.html original entregado en un solo intento dentro de Antigravity, sin editar una sola linea. Corre Gemini 4 Argon, comparalo lado a lado contra Gemini 3.8 Flash, o copia el prompt exacto."
                : "Every simulation below is the untouched single-attempt index.html generated inside Antigravity. Run Gemini 4 Argon, compare it side-by-side against Gemini 3.8 Flash, or copy the verbatim prompt."}
            </p>
          </div>

          {/* Bonus Gummy Bears Toggle */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            <button
              onClick={() => {
                setShowBonus(!showBonus);
                if (!showBonus) setActiveTab("argon");
              }}
              className={`px-4 py-2.5 rounded-xl font-mono-hud text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                showBonus
                  ? "bg-[#B794F6]/20 border-[#B794F6] text-white shadow-[0_0_20px_rgba(183,148,246,0.25)]"
                  : "bg-[#0B1D30] border-[#22A2DD]/25 text-[#8FA3B8] hover:text-white hover:border-[#B794F6]/60"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#B794F6]" />
              {lang === "es"
                ? "Bonus Lab: Gummy Bears SDF"
                : "Bonus Lab: Gummy Bears SDF"}
            </button>
          </div>
        </div>

        {/* 10 Challenge Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
          {CHALLENGES.map((ch) => {
            const isSelected = !showBonus && ch.n === selectedChallengeN;
            return (
              <button
                key={ch.n}
                onClick={() => {
                  setShowBonus(false);
                  onSelectChallengeN(ch.n);
                }}
                className={`group relative text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#11283F] border-[#B794F6] shadow-[0_0_18px_rgba(183,148,246,0.2)]"
                    : "bg-[#0B1D30]/80 border-white/10 hover:border-[#22A2DD]/50 hover:bg-[#0B1D30]"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`font-mono-hud text-[11px] font-bold ${
                      isSelected ? "text-[#B794F6]" : "text-[#5EEAD4]"
                    }`}
                  >
                    N{String(ch.n).padStart(2, "0")}
                  </span>
                  {ch.flash_broken ? (
                    <span className="px-1.5 py-0.5 rounded bg-[#F43F5E]/20 border border-[#F43F5E]/40 text-[#F43F5E] font-mono-hud text-[9px] font-bold">
                      {lang === "es" ? "FLASH ROTO" : "BROKEN"}
                    </span>
                  ) : (
                    <span className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      {ch.time_min.argon}m/{ch.time_min.flash}m
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {lang === "es" ? ch.name_es : ch.name_en}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Arena Card */}
        <div className="rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/25 overflow-hidden shadow-2xl">
          {/* Challenge Telemetry Top Bar */}
          {showBonus ? (
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border-b border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono-hud text-[#B794F6] mb-1">
                    <span>ARCHIVO EXTRA FUERA DE TORNEO · 2026-10-14 02:28</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    {lang === "es"
                      ? BONUS_EXPERIMENT.title_es
                      : BONUS_EXPERIMENT.title_en}
                  </h3>
                  <p className="text-sm text-[#8FA3B8] mt-1 max-w-3xl">
                    {lang === "es"
                      ? BONUS_EXPERIMENT.description_es
                      : BONUS_EXPERIMENT.description_en}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={BONUS_EXPERIMENT.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {lang === "es" ? "Abrir Pantalla Completa" : "Open Fullscreen"}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border-b border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-hud mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#22A2DD]/15 border border-[#22A2DD]/40 text-[#5EEAD4]">
                      {lang === "es"
                        ? currentChallenge.world_es
                        : currentChallenge.world_en}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#8FA3B8]">
                      CAPITULO YT {currentChallenge.timestamp}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-bold">
                      {lang === "es"
                        ? "GANADOR: GEMINI 4 ARGON"
                        : "WINNER: GEMINI 4 ARGON"}
                    </span>
                    {currentChallenge.flash_broken && (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#F43F5E] font-bold">
                        {lang === "es"
                          ? "FLASH ENTREGO ROTO / INCOMPLETO"
                          : "FLASH DELIVERED BROKEN"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                    {lang === "es"
                      ? `Nivel ${currentChallenge.n}: ${currentChallenge.name_es}`
                      : `Level ${currentChallenge.n}: ${currentChallenge.name_en}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8FA3B8] mt-1">
                    <span className="text-[#5EEAD4] font-mono-hud">Stack:</span>{" "}
                    {currentChallenge.tech}
                  </p>
                </div>

                {/* Speed & Code Scoreboard */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-[#B794F6]/40">
                    <div className="text-[10px] font-mono-hud uppercase text-[#B794F6]">
                      Gemini 4 Argon
                    </div>
                    <div className="font-mono-hud text-base font-bold text-white">
                      {currentChallenge.time_min.argon} min{" "}
                      <span className="text-xs font-normal text-[#8FA3B8]">
                        · {currentChallenge.code_stats.argon_lines} loc (
                        {currentChallenge.code_stats.argon_kb} KB)
                      </span>
                    </div>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-[#FBBF24]/40">
                    <div className="text-[10px] font-mono-hud uppercase text-[#FBBF24]">
                      Gemini 3.8 Flash
                    </div>
                    <div className="font-mono-hud text-base font-bold text-white">
                      {currentChallenge.time_min.flash} min{" "}
                      <span className="text-xs font-normal text-[#8FA3B8]">
                        · {currentChallenge.code_stats.flash_lines} loc (
                        {currentChallenge.code_stats.flash_kb} KB)
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-white/10">
                    <div className="text-[10px] font-mono-hud uppercase text-[#5EEAD4]">
                      {lang === "es" ? "Diferencia Reloj" : "Speed Ratio"}
                    </div>
                    <div className="font-mono-hud text-xs font-bold text-white mt-0.5">
                      {currentChallenge.speed_ratio}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fun Angle / Insight Banner */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#060B14]/70 border border-[#22A2DD]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#F5F7FA]">
                  <span className="font-mono-hud font-bold text-[#5EEAD4] mr-2">
                    [HALLAZGO CLAVE]
                  </span>
                  {lang === "es"
                    ? currentChallenge.fun_angle_es
                    : currentChallenge.fun_angle_en}
                </p>
              </div>
            </div>
          )}

          {/* Mode Switcher Toolbar */}
          <div className="px-4 sm:px-6 py-3 bg-[#060B14] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab("argon")}
                className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "argon"
                    ? "bg-[#B794F6] text-[#060B14]"
                    : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                {showBonus
                  ? "Jugar Gummy Bears (WebGL)"
                  : lang === "es"
                  ? "Jugar Argon (Ganador)"
                  : "Play Argon (Winner)"}
              </button>

              {!showBonus && (
                <>
                  <button
                    onClick={() => setActiveTab("split")}
                    className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "split"
                        ? "bg-[#22A2DD] text-[#060B14]"
                        : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    {lang === "es"
                      ? "Arena Lado a Lado (Flash vs Argon)"
                      : "Side-by-Side Arena (Flash vs Argon)"}
                  </button>

                  <button
                    onClick={() => setActiveTab("flash")}
                    className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "flash"
                        ? "bg-[#FBBF24] text-[#060B14]"
                        : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    {lang === "es" ? "Jugar Flash" : "Play Flash"}
                  </button>

                  <button
                    onClick={() => setActiveTab("prompt")}
                    className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "prompt"
                        ? "bg-[#34D399] text-[#060B14]"
                        : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {lang === "es"
                      ? "Prompt Exacto y Auditoria"
                      : "Verbatim Prompt & Audit"}
                  </button>

                  <button
                    onClick={() => setActiveTab("stills")}
                    className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "stills"
                        ? "bg-[#5EEAD4] text-[#060B14]"
                        : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {lang === "es" ? "Capturas 4K" : "4K Stills"}
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTab("source")}
                className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "source"
                    ? "bg-white text-[#060B14]"
                    : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                {lang === "es" ? "Codigo Fuente (index.html)" : "Source Code (index.html)"}
              </button>
            </div>

            {/* Right Controls: Reload Iframe + Open in New Tab */}
            <div className="flex items-center gap-2">
              {(activeTab === "argon" ||
                activeTab === "flash" ||
                activeTab === "split") && (
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="px-3 py-1.5 rounded-lg bg-[#11283F] hover:bg-[#22A2DD]/20 border border-white/10 text-xs font-mono-hud text-[#F5F7FA] flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {lang === "es" ? "Reiniciar Simulador" : "Reload Sim"}
                </button>
              )}

              {!showBonus && (
                <>
                  <a
                    href={currentChallenge.demo_urls.argon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#B794F6]/15 hover:bg-[#B794F6]/25 border border-[#B794F6]/40 text-xs font-mono-hud text-[#B794F6] flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Argon
                  </a>
                  <a
                    href={currentChallenge.demo_urls.flash}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#FBBF24]/15 hover:bg-[#FBBF24]/25 border border-[#FBBF24]/40 text-xs font-mono-hud text-[#FBBF24] flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Flash
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Arena Viewport Content */}
          {activeTab === "argon" && (
            <div className="relative bg-black">
              <div className="px-4 py-2 bg-[#060B14] border-b border-white/10 flex items-center justify-between text-xs font-mono-hud">
                <span className="text-[#B794F6] font-bold">
                  {showBonus
                    ? "GEMINI 4 ARGON // GUMMY BEARS SOFT-BODY SIMULATION"
                    : `GEMINI 4 ARGON (HIGH) // ${currentChallenge.page_titles.argon}`}
                </span>
                <span className="text-[#8FA3B8]">
                  {showBonus
                    ? `${BONUS_EXPERIMENT.lines} lineas · ${BONUS_EXPERIMENT.kb} KB`
                    : `${currentChallenge.time_min.argon} min · ${currentChallenge.code_stats.argon_lines} lineas`}
                </span>
              </div>
              <iframe
                key={`argon-${currentChallenge.dir}-${showBonus}-${iframeKey}`}
                src={
                  showBonus
                    ? BONUS_EXPERIMENT.demo_url
                    : currentChallenge.demo_urls.argon
                }
                title={
                  showBonus
                    ? "Gummy Bears Soft-Body Physics"
                    : currentChallenge.page_titles.argon
                }
                className="w-full h-[560px] sm:h-[650px] border-0 bg-black"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            </div>
          )}

          {activeTab === "flash" && !showBonus && (
            <div className="relative bg-black">
              <div className="px-4 py-2 bg-[#060B14] border-b border-white/10 flex items-center justify-between text-xs font-mono-hud">
                <span className="text-[#FBBF24] font-bold">
                  GEMINI 3.8 FLASH (HIGH) // {currentChallenge.page_titles.flash}
                </span>
                <span className="text-[#8FA3B8]">
                  {currentChallenge.time_min.flash} min ·{" "}
                  {currentChallenge.code_stats.flash_lines} lineas
                </span>
              </div>
              <iframe
                key={`flash-${currentChallenge.dir}-${iframeKey}`}
                src={currentChallenge.demo_urls.flash}
                title={currentChallenge.page_titles.flash}
                className="w-full h-[560px] sm:h-[650px] border-0 bg-black"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            </div>
          )}

          {activeTab === "split" && !showBonus && (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/15 bg-black">
              {/* Left: FLASH (per Mixiuh Labs canon: FLASH always on the left, ARGON on the right) */}
              <div>
                <div className="px-4 py-2 bg-[#060B14] border-b border-[#FBBF24]/30 flex items-center justify-between text-xs font-mono-hud">
                  <span className="text-[#FBBF24] font-bold">
                    [IZQUIERDA] GEMINI 3.8 FLASH · {currentChallenge.time_min.flash} MIN
                  </span>
                  <span className="text-[#8FA3B8]">
                    {currentChallenge.code_stats.flash_lines} loc ·{" "}
                    {currentChallenge.code_stats.flash_kb} KB
                  </span>
                </div>
                <iframe
                  key={`split-flash-${currentChallenge.dir}-${iframeKey}`}
                  src={currentChallenge.demo_urls.flash}
                  title={`Flash - ${currentChallenge.name_es}`}
                  className="w-full h-[480px] sm:h-[560px] border-0 bg-black"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                />
              </div>

              {/* Right: ARGON */}
              <div>
                <div className="px-4 py-2 bg-[#060B14] border-b border-[#B794F6]/30 flex items-center justify-between text-xs font-mono-hud">
                  <span className="text-[#B794F6] font-bold">
                    [DERECHA] GEMINI 4 ARGON · {currentChallenge.time_min.argon} MIN (GANADOR)
                  </span>
                  <span className="text-[#8FA3B8]">
                    {currentChallenge.code_stats.argon_lines} loc ·{" "}
                    {currentChallenge.code_stats.argon_kb} KB
                  </span>
                </div>
                <iframe
                  key={`split-argon-${currentChallenge.dir}-${iframeKey}`}
                  src={currentChallenge.demo_urls.argon}
                  title={`Argon - ${currentChallenge.name_es}`}
                  className="w-full h-[480px] sm:h-[560px] border-0 bg-black"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                />
              </div>
            </div>
          )}

          {activeTab === "prompt" && !showBonus && (
            <div className="p-5 sm:p-8 space-y-6 bg-[#060B14]/90">
              {/* Referee Verbatim Verdict */}
              <div className="p-5 rounded-xl bg-[#0B1D30] border border-[#34D399]/30">
                <div className="text-xs font-mono-hud uppercase text-[#34D399] font-bold mb-1.5">
                  {lang === "es"
                    ? "NOTA TEXTUAL DE EVALUACION DE KEVIN GONZALEZ (ARBITRO)"
                    : "KEVIN GONZALEZ'S VERBATIM REFEREE NOTE"}
                </div>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  &ldquo;
                  {lang === "es"
                    ? currentChallenge.kevin_note_verbatim
                    : currentChallenge.kevin_note_en}
                  &rdquo;
                </p>
              </div>

              {/* Feature & Problem Audit Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Argon Features */}
                <div className="p-5 rounded-xl bg-[#0B1D30] border border-[#B794F6]/30">
                  <h4 className="font-display text-base font-bold text-[#B794F6] mb-3 flex items-center justify-between">
                    <span>
                      {lang === "es"
                        ? "Lo que entrego Gemini 4 Argon (High)"
                        : "Delivered by Gemini 4 Argon (High)"}
                    </span>
                    <span className="font-mono-hud text-xs px-2 py-0.5 rounded bg-[#B794F6]/15">
                      {currentChallenge.time_min.argon} min
                    </span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#F5F7FA]">
                    {currentChallenge.argon_features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono-hud text-[#34D399] font-bold mt-0.5">
                          [+]
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flash Features & Problems */}
                <div className="p-5 rounded-xl bg-[#0B1D30] border border-[#FBBF24]/30 space-y-4">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#FBBF24] mb-3 flex items-center justify-between">
                      <span>
                        {lang === "es"
                          ? "Lo que entrego Gemini 3.8 Flash (High)"
                          : "Delivered by Gemini 3.8 Flash (High)"}
                      </span>
                      <span className="font-mono-hud text-xs px-2 py-0.5 rounded bg-[#FBBF24]/15">
                        {currentChallenge.time_min.flash} min
                      </span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#F5F7FA]">
                      {currentChallenge.flash_features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-mono-hud text-[#FBBF24] font-bold mt-0.5">
                            [·]
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs font-mono-hud uppercase text-[#F43F5E] font-bold mb-2">
                      {lang === "es"
                        ? "FALLOS Y OMISIONES DETECTADOS EN FLASH"
                        : "BUGS & OMISSIONS DETECTED IN FLASH"}
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#8FA3B8]">
                      {currentChallenge.flash_problems.map((prob, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-mono-hud text-[#F43F5E] font-bold mt-0.5">
                            [!]
                          </span>
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verbatim Prompt Box */}
              <div className="rounded-xl bg-[#0B1D30] border border-[#22A2DD]/30 overflow-hidden">
                <div className="px-4 py-3 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono-hud text-xs font-bold text-[#5EEAD4]">
                      {lang === "es"
                        ? `PROMPT OFICIAL INTEGRO · NIVEL ${currentChallenge.n} (${currentChallenge.dir})`
                        : `OFFICIAL VERBATIM PROMPT · LEVEL ${currentChallenge.n} (${currentChallenge.dir})`}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3.5 py-1.5 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        {lang === "es" ? "Prompt Copiado" : "Prompt Copied"}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {lang === "es"
                          ? "Copiar Prompt para Probar"
                          : "Copy Verbatim Prompt"}
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono-hud text-[#F5F7FA] whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                  {currentChallenge.prompt_verbatim}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "stills" && !showBonus && (
            <div className="p-5 sm:p-8 bg-[#060B14]/90 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-mono-hud text-xs uppercase tracking-wider text-[#FBBF24] font-bold mb-3">
                    [IZQUIERDA] CAPTURAS DE GRABACION REAL — GEMINI 3.8 FLASH
                  </h4>
                  <div className="space-y-3">
                    {currentChallenge.stills.flash.map((src) => (
                      <div
                        key={src}
                        className="rounded-xl overflow-hidden border border-[#FBBF24]/30 bg-black"
                      >
                        <img
                          src={src}
                          alt={`Flash capture ${src}`}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        <div className="px-3 py-1.5 bg-[#0B1D30] text-[11px] font-mono-hud text-[#8FA3B8]">
                          {src.replace("/stills/", "")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono-hud text-xs uppercase tracking-wider text-[#B794F6] font-bold mb-3">
                    [DERECHA] CAPTURAS DE GRABACION REAL — GEMINI 4 ARGON
                  </h4>
                  <div className="space-y-3">
                    {currentChallenge.stills.argon.map((src) => (
                      <div
                        key={src}
                        className="rounded-xl overflow-hidden border border-[#B794F6]/30 bg-black"
                      >
                        <img
                          src={src}
                          alt={`Argon capture ${src}`}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        <div className="px-3 py-1.5 bg-[#0B1D30] text-[11px] font-mono-hud text-[#8FA3B8]">
                          {src.replace("/stills/", "")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "source" && (
            <div className="p-5 sm:p-6 bg-[#060B14]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {!showBonus && (
                    <>
                      <button
                        onClick={() => setSourceModel("argon")}
                        className={`px-3.5 py-1.5 rounded-lg font-mono-hud text-xs font-bold cursor-pointer ${
                          sourceModel === "argon"
                            ? "bg-[#B794F6] text-[#060B14]"
                            : "bg-[#0B1D30] text-[#8FA3B8] border border-white/10"
                        }`}
                      >
                        gemini-4-argon/{currentChallenge.dir}/index.html (
                        {currentChallenge.code_stats.argon_lines} loc)
                      </button>
                      <button
                        onClick={() => setSourceModel("flash")}
                        className={`px-3.5 py-1.5 rounded-lg font-mono-hud text-xs font-bold cursor-pointer ${
                          sourceModel === "flash"
                            ? "bg-[#FBBF24] text-[#060B14]"
                            : "bg-[#0B1D30] text-[#8FA3B8] border border-white/10"
                        }`}
                      >
                        gemini-3.8-flash/{currentChallenge.dir}/index.html (
                        {currentChallenge.code_stats.flash_lines} loc)
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={handleCopySource}
                  className="px-3.5 py-1.5 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {lang === "es" ? "HTML Copiado" : "HTML Copied"}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {lang === "es" ? "Copiar index.html Completo" : "Copy Full index.html"}
                    </>
                  )}
                </button>
              </div>

              {loadingSource ? (
                <div className="py-16 text-center font-mono-hud text-sm text-[#8FA3B8]">
                  {lang === "es"
                    ? "Cargando archivo index.html original..."
                    : "Loading original index.html file..."}
                </div>
              ) : (
                <pre className="p-4 rounded-xl bg-[#0B1D30] border border-white/10 text-xs font-mono-hud text-[#F5F7FA] overflow-x-auto max-h-[520px] overflow-y-auto leading-relaxed">
                  {sourceData?.code || ""}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
