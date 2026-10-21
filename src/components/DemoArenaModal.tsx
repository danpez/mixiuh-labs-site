"use client";

import React, { useState, useEffect } from "react";
import {
  CHALLENGES,
  BONUS_EXPERIMENT,
  YOUTUBE_LINKS,
  type ChallengeData,
} from "@/data/labsData";
import {
  EP02_CHALLENGES,
  type Ep02ChallengeData,
} from "@/data/ep02Data";
import {
  Play,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Columns,
  Maximize2,
  Terminal,
  FileCode,
  Sparkles,
  Image as ImageIcon,
  Cpu,
} from "lucide-react";

interface Props {
  lang: "es" | "en";
  activeEpisode: "ep02" | "ep01";
  onChangeEpisode: (ep: "ep02" | "ep01") => void;
  selectedChallengeN: number;
  onSelectChallengeN: (n: number) => void;
}

type ArenaTab = "argon" | "split" | "opponent" | "prompt" | "source" | "stills";

export default function DemoArenaSection({
  lang,
  activeEpisode,
  onChangeEpisode,
  selectedChallengeN,
  onSelectChallengeN,
}: Props) {
  const [activeTab, setActiveTab] = useState<ArenaTab>("argon");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [sourceModel, setSourceModel] = useState<"argon" | "opponent">("argon");
  const [sourceData, setSourceData] = useState<{
    code: string;
    lines: number;
    kb: number;
  } | null>(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const [showBonus, setShowBonus] = useState(false);

  const isEp02 = activeEpisode === "ep02";

  const ep02Challenge: Ep02ChallengeData =
    EP02_CHALLENGES.find((c) => c.n === selectedChallengeN) || EP02_CHALLENGES[0];

  const ep01Challenge: ChallengeData =
    CHALLENGES.find((c) => c.n === selectedChallengeN) || CHALLENGES[5];

  const activeDir = showBonus
    ? BONUS_EXPERIMENT.dir
    : isEp02
    ? ep02Challenge.dir
    : ep01Challenge.dir;

  useEffect(() => {
    if (activeTab === "source") {
      setLoadingSource(true);
      const apiModel = showBonus
        ? "argon"
        : sourceModel === "argon"
        ? "argon"
        : isEp02
        ? "opus"
        : "flash";
      fetch(`/api/source?model=${apiModel}&dir=${activeDir}`)
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
  }, [activeTab, sourceModel, activeDir, showBonus, isEp02]);

  const activePromptVerbatim = isEp02
    ? ep02Challenge.prompt_verbatim
    : ep01Challenge.prompt_verbatim;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePromptVerbatim);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleCopySource = () => {
    if (!sourceData?.code) return;
    navigator.clipboard.writeText(sourceData.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const opponentShortName = isEp02 ? "Opus 5.5" : "Flash";
  const opponentFullName = isEp02 ? "Claude Opus 5.5" : "Gemini 3.8 Flash";

  return (
    <section id="arena" className="scroll-mt-24 py-14 border-t border-[#22A2DD]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11283F] border border-[#22A2DD]/30 text-[#5EEAD4] text-xs font-mono-hud uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5" />
              {isEp02
                ? lang === "es"
                  ? "ARENA INTERACTIVA EP02 · 12 MOTORES ZERO-SHOT EN VIVO (ARGON VS OPUS 5.5)"
                  : "INTERACTIVE ARENA EP02 · 12 LIVE ZERO-SHOT ENGINES (ARGON VS OPUS 5.5)"
                : lang === "es"
                ? "ARENA INTERACTIVA EP01 · 20 SIMULACIONES EN VIVO (ARGON VS 3.8 FLASH)"
                : "INTERACTIVE ARENA EP01 · 20 LIVE SIMULATIONS (ARGON VS 3.8 FLASH)"}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
              {isEp02
                ? lang === "es"
                  ? "Juega y Audita los 6 Retos Extremos (Argon vs Claude Opus 5.5)"
                  : "Play & Audit All 6 Extreme Challenges (Argon vs Claude Opus 5.5)"
                : lang === "es"
                ? "Juega y Audita los 10 Retos del Episodio 01 (Argon vs 3.8 Flash)"
                : "Play & Audit All 10 Episode 01 Challenges (Argon vs 3.8 Flash)"}
            </h2>
            <p className="text-[#8FA3B8] text-sm sm:text-base mt-2 max-w-3xl">
              {isEp02
                ? lang === "es"
                  ? "Cada simulador es el archivo index.html original entregado en un solo intento dentro de Antigravity, sin editar ni una linea. Ejecuta Gemini 4 Argon o Claude Opus 5.5, comparalos lado a lado, o inspecciona la telemetria real de tokens y costos API."
                  : "Every simulator below is the untouched single-attempt index.html generated inside Antigravity. Run Gemini 4 Argon or Claude Opus 5.5, compare them side-by-side, or inspect real token telemetry and API costs."
                : lang === "es"
                ? "Cada simulacion de abajo es el archivo index.html original entregado en un solo intento dentro de Antigravity, sin editar una sola linea. Corre Gemini 4 Argon, comparalo lado a lado contra Gemini 3.8 Flash, o copia el prompt exacto."
                : "Every simulation below is the untouched single-attempt index.html generated inside Antigravity. Run Gemini 4 Argon, compare it side-by-side against Gemini 3.8 Flash, or copy the verbatim prompt."}
            </p>
          </div>

          {/* Episode Switcher + Bonus Gummy Bears Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
            <div className="inline-flex rounded-xl bg-[#0B1D30] p-1 border border-[#22A2DD]/30">
              <button
                onClick={() => {
                  setShowBonus(false);
                  onChangeEpisode("ep02");
                }}
                className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                  isEp02 && !showBonus
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                {lang === "es" ? "EP02: Argon vs Opus (12)" : "EP02: Argon vs Opus (12)"}
              </button>
              <button
                onClick={() => {
                  setShowBonus(false);
                  onChangeEpisode("ep01");
                }}
                className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition cursor-pointer ${
                  !isEp02 && !showBonus
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                {lang === "es" ? "EP01: Argon vs Flash (20)" : "EP01: Argon vs Flash (20)"}
              </button>
            </div>

            <button
              onClick={() => {
                setShowBonus(!showBonus);
                if (!showBonus) setActiveTab("argon");
              }}
              className={`px-3.5 py-2.5 rounded-xl font-mono-hud text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                showBonus
                  ? "bg-[#B794F6]/20 border-[#B794F6] text-white shadow-[0_0_20px_rgba(183,148,246,0.25)]"
                  : "bg-[#0B1D30] border-[#22A2DD]/25 text-[#8FA3B8] hover:text-white hover:border-[#B794F6]/60"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#B794F6]" />
              {lang === "es" ? "Bonus: Gummy Bears SDF" : "Bonus: Gummy Bears SDF"}
            </button>
          </div>
        </div>

        {/* Challenge Selector Grid: 6 cards for EP02, 10 cards for EP01 */}
        {isEp02 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
            {EP02_CHALLENGES.map((ch) => {
              const isSelected = !showBonus && ch.n === ep02Challenge.n;
              const isOpusWin = ch.winner === "opus";
              return (
                <button
                  key={ch.n}
                  onClick={() => {
                    setShowBonus(false);
                    onSelectChallengeN(ch.n);
                  }}
                  className={`group relative text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#11283F] border-[#B794F6] shadow-[0_0_18px_rgba(183,148,246,0.22)]"
                      : "bg-[#0B1D30]/80 border-white/10 hover:border-[#22A2DD]/50 hover:bg-[#0B1D30]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`font-mono-hud text-[11px] font-bold ${
                        isSelected ? "text-[#B794F6]" : "text-[#5EEAD4]"
                      }`}
                    >
                      R{String(ch.n).padStart(2, "0")}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono-hud text-[9px] font-bold ${
                        isOpusWin
                          ? "bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#FBBF24]"
                          : "bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399]"
                      }`}
                    >
                      {isOpusWin ? "OPUS WIN" : "ARGON WIN"}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white line-clamp-2 leading-snug mb-1.5">
                    {lang === "es" ? ch.name_es : ch.name_en}
                  </div>
                  <div className="flex items-center justify-between font-mono-hud text-[10px] text-[#8FA3B8] pt-1 border-t border-white/5">
                    <span>
                      {ch.time_min.argon}m vs {ch.time_min.opus}m
                    </span>
                    <span className="text-[#5EEAD4]">
                      ${ch.cost_usd.argon.toFixed(2)}/${ch.cost_usd.opus.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
            {CHALLENGES.map((ch) => {
              const isSelected = !showBonus && ch.n === ep01Challenge.n;
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
        )}

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
          ) : isEp02 ? (
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border-b border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-hud mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#22A2DD]/15 border border-[#22A2DD]/40 text-[#5EEAD4]">
                      {lang === "es"
                        ? ep02Challenge.world_es
                        : ep02Challenge.world_en}
                    </span>
                    <a
                      href={`${YOUTUBE_LINKS.ep02_es}?t=${(() => {
                        const ts =
                          lang === "es"
                            ? ep02Challenge.timestamp_es
                            : ep02Challenge.timestamp_en;
                        const [mm, ss] = ts.split(":").map(Number);
                        return (mm || 0) * 60 + (ss || 0);
                      })()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-0.5 rounded-md bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 border border-[#F43F5E]/40 text-white hover:text-[#F43F5E] transition-colors cursor-pointer"
                    >
                      {lang === "es"
                        ? `VER EN YT (${ep02Challenge.timestamp_es})`
                        : `WATCH ON YT (${ep02Challenge.timestamp_en})`}
                    </a>
                    {ep02Challenge.winner === "argon" ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-bold">
                        {lang === "es"
                          ? "GANADOR: GEMINI 4 ARGON"
                          : "WINNER: GEMINI 4 ARGON"}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#FBBF24] font-bold">
                        {lang === "es"
                          ? "GANADOR: CLAUDE OPUS 5.5"
                          : "WINNER: CLAUDE OPUS 5.5"}
                      </span>
                    )}
                    {ep02Challenge.opus_slow_fps && (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#F43F5E] font-bold">
                        OPUS FPS: {ep02Challenge.fps.opus}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                    {lang === "es"
                      ? `Reto 0${ep02Challenge.n}: ${ep02Challenge.name_es}`
                      : `Challenge 0${ep02Challenge.n}: ${ep02Challenge.name_en}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8FA3B8] mt-1">
                    <span className="text-[#5EEAD4] font-mono-hud">Stack:</span>{" "}
                    {ep02Challenge.tech}
                  </p>
                </div>

                {/* EP02 Speed, Tokens & Cost Scoreboard */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-[#B794F6]/40">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono-hud uppercase text-[#B794F6]">
                      <span>Gemini 4 Argon</span>
                      <span className="text-[#34D399] font-bold">
                        ${ep02Challenge.cost_usd.argon.toFixed(2)} USD
                      </span>
                    </div>
                    <div className="font-mono-hud text-base font-bold text-white">
                      {ep02Challenge.time_min.argon} min{" "}
                      <span className="text-xs font-normal text-[#8FA3B8]">
                        · {ep02Challenge.code_stats.argon_lines} loc ·{" "}
                        {ep02Challenge.fps.argon}
                      </span>
                    </div>
                    <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      Tokens: {ep02Challenge.tokens.argon_total} (
                      {ep02Challenge.tokens.argon_steps} pasos)
                    </div>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-[#FBBF24]/40">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono-hud uppercase text-[#FBBF24]">
                      <span>Claude Opus 5.5</span>
                      <span className="text-[#FBBF24] font-bold">
                        ${ep02Challenge.cost_usd.opus.toFixed(2)} USD
                      </span>
                    </div>
                    <div className="font-mono-hud text-base font-bold text-white">
                      {ep02Challenge.time_min.opus} min{" "}
                      <span className="text-xs font-normal text-[#8FA3B8]">
                        · {ep02Challenge.code_stats.opus_lines} loc ·{" "}
                        {ep02Challenge.fps.opus}
                      </span>
                    </div>
                    <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                      Tokens: {ep02Challenge.tokens.opus_total} (
                      {ep02Challenge.tokens.opus_steps} pasos)
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-white/10">
                    <div className="text-[10px] font-mono-hud uppercase text-[#5EEAD4]">
                      {lang === "es" ? "Reloj y Factura API" : "Clock & API Bill"}
                    </div>
                    <div className="font-mono-hud text-xs font-bold text-white mt-0.5">
                      {lang === "es"
                        ? ep02Challenge.speed_ratio_es
                        : ep02Challenge.speed_ratio_en}
                    </div>
                    <div className="font-mono-hud text-[11px] text-[#34D399] mt-0.5">
                      {lang === "es"
                        ? ep02Challenge.cost_ratio_es
                        : ep02Challenge.cost_ratio_en}
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
                    ? ep02Challenge.fun_angle_es
                    : ep02Challenge.fun_angle_en}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border-b border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-hud mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#22A2DD]/15 border border-[#22A2DD]/40 text-[#5EEAD4]">
                      {lang === "es"
                        ? ep01Challenge.world_es
                        : ep01Challenge.world_en}
                    </span>
                    <a
                      href={`${lang === "es" ? YOUTUBE_LINKS.ep01_es : YOUTUBE_LINKS.ep01_en}?t=${(() => {
                        const [mm, ss] = ep01Challenge.timestamp.split(":").map(Number);
                        return (mm || 0) * 60 + (ss || 0);
                      })()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-0.5 rounded-md bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 border border-[#F43F5E]/40 text-white hover:text-[#F43F5E] transition-colors cursor-pointer"
                    >
                      {lang === "es"
                        ? `VER EN YT (${ep01Challenge.timestamp})`
                        : `WATCH ON YT (${ep01Challenge.timestamp})`}
                    </a>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-bold">
                      {lang === "es"
                        ? "GANADOR: GEMINI 4 ARGON"
                        : "WINNER: GEMINI 4 ARGON"}
                    </span>
                    {ep01Challenge.flash_broken && (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#F43F5E] font-bold">
                        {lang === "es"
                          ? "FLASH ENTREGO ROTO / INCOMPLETO"
                          : "FLASH DELIVERED BROKEN"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                    {lang === "es"
                      ? `Nivel ${ep01Challenge.n}: ${ep01Challenge.name_es}`
                      : `Level ${ep01Challenge.n}: ${ep01Challenge.name_en}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8FA3B8] mt-1">
                    <span className="text-[#5EEAD4] font-mono-hud">Stack:</span>{" "}
                    {ep01Challenge.tech}
                  </p>
                </div>

                {/* EP01 Speed & Code Scoreboard */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-[#B794F6]/40">
                    <div className="text-[10px] font-mono-hud uppercase text-[#B794F6]">
                      Gemini 4 Argon
                    </div>
                    <div className="font-mono-hud text-base font-bold text-white">
                      {ep01Challenge.time_min.argon} min{" "}
                      <span className="text-xs font-normal text-[#8FA3B8]">
                        · {ep01Challenge.code_stats.argon_lines} loc (
                        {ep01Challenge.code_stats.argon_kb} KB)
                      </span>
                    </div>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-[#FBBF24]/40">
                    <div className="text-[10px] font-mono-hud uppercase text-[#FBBF24]">
                      Gemini 3.8 Flash
                    </div>
                    <div className="font-mono-hud text-base font-bold text-white">
                      {ep01Challenge.time_min.flash} min{" "}
                      <span className="text-xs font-normal text-[#8FA3B8]">
                        · {ep01Challenge.code_stats.flash_lines} loc (
                        {ep01Challenge.code_stats.flash_kb} KB)
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-xl bg-[#060B14]/80 border border-white/10">
                    <div className="text-[10px] font-mono-hud uppercase text-[#5EEAD4]">
                      {lang === "es" ? "Diferencia Reloj" : "Speed Ratio"}
                    </div>
                    <div className="font-mono-hud text-xs font-bold text-white mt-0.5">
                      {ep01Challenge.speed_ratio}
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
                    ? ep01Challenge.fun_angle_es
                    : ep01Challenge.fun_angle_en}
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
                  ? "Jugar Argon"
                  : "Play Argon"}
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
                      ? `Arena Lado a Lado (${opponentShortName} vs Argon)`
                      : `Side-by-Side Arena (${opponentShortName} vs Argon)`}
                  </button>

                  <button
                    onClick={() => setActiveTab("opponent")}
                    className={`px-3.5 py-2 rounded-lg font-mono-hud text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "opponent"
                        ? "bg-[#FBBF24] text-[#060B14]"
                        : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    {lang === "es"
                      ? `Jugar ${opponentShortName}`
                      : `Play ${opponentShortName}`}
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
                    {isEp02
                      ? lang === "es"
                        ? "Prompt, Tokens y Auditoria"
                        : "Prompt, Tokens & Audit"
                      : lang === "es"
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
                activeTab === "opponent" ||
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
                    href={
                      isEp02
                        ? ep02Challenge.demo_urls.argon
                        : ep01Challenge.demo_urls.argon
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#B794F6]/15 hover:bg-[#B794F6]/25 border border-[#B794F6]/40 text-xs font-mono-hud text-[#B794F6] flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Argon
                  </a>
                  <a
                    href={
                      isEp02
                        ? ep02Challenge.demo_urls.opus
                        : ep01Challenge.demo_urls.flash
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#FBBF24]/15 hover:bg-[#FBBF24]/25 border border-[#FBBF24]/40 text-xs font-mono-hud text-[#FBBF24] flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    {opponentShortName}
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
                    : isEp02
                    ? `GEMINI 4 ARGON (HIGH) // ${ep02Challenge.page_titles.argon}`
                    : `GEMINI 4 ARGON (HIGH) // ${ep01Challenge.page_titles.argon}`}
                </span>
                <span className="text-[#8FA3B8]">
                  {showBonus
                    ? `${BONUS_EXPERIMENT.lines} lineas · ${BONUS_EXPERIMENT.kb} KB`
                    : isEp02
                    ? `${ep02Challenge.time_min.argon} min · $${ep02Challenge.cost_usd.argon.toFixed(2)} USD · ${ep02Challenge.code_stats.argon_lines} lineas · ${ep02Challenge.fps.argon}`
                    : `${ep01Challenge.time_min.argon} min · ${ep01Challenge.code_stats.argon_lines} lineas`}
                </span>
              </div>
              <iframe
                key={`argon-${activeEpisode}-${activeDir}-${showBonus}-${iframeKey}`}
                src={
                  showBonus
                    ? BONUS_EXPERIMENT.demo_url
                    : isEp02
                    ? ep02Challenge.demo_urls.argon
                    : ep01Challenge.demo_urls.argon
                }
                title={
                  showBonus
                    ? "Gummy Bears Soft-Body Physics"
                    : isEp02
                    ? ep02Challenge.page_titles.argon
                    : ep01Challenge.page_titles.argon
                }
                className="w-full h-[560px] sm:h-[650px] border-0 bg-black"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            </div>
          )}

          {activeTab === "opponent" && !showBonus && (
            <div className="relative bg-black">
              <div className="px-4 py-2 bg-[#060B14] border-b border-white/10 flex items-center justify-between text-xs font-mono-hud">
                <span className="text-[#FBBF24] font-bold">
                  {isEp02
                    ? `CLAUDE OPUS 5.5 (HIGH) // ${ep02Challenge.page_titles.opus}`
                    : `GEMINI 3.8 FLASH (HIGH) // ${ep01Challenge.page_titles.flash}`}
                </span>
                <span className="text-[#8FA3B8]">
                  {isEp02
                    ? `${ep02Challenge.time_min.opus} min · $${ep02Challenge.cost_usd.opus.toFixed(2)} USD · ${ep02Challenge.code_stats.opus_lines} lineas · ${ep02Challenge.fps.opus}`
                    : `${ep01Challenge.time_min.flash} min · ${ep01Challenge.code_stats.flash_lines} lineas`}
                </span>
              </div>
              <iframe
                key={`opponent-${activeEpisode}-${activeDir}-${iframeKey}`}
                src={
                  isEp02
                    ? ep02Challenge.demo_urls.opus
                    : ep01Challenge.demo_urls.flash
                }
                title={
                  isEp02
                    ? ep02Challenge.page_titles.opus
                    : ep01Challenge.page_titles.flash
                }
                className="w-full h-[560px] sm:h-[650px] border-0 bg-black"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            </div>
          )}

          {activeTab === "split" && !showBonus && (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/15 bg-black">
              {/* Left: OPPONENT (per Mixiuh Labs canon: Opponent always on the left in amber, ARGON on the right in violet) */}
              <div>
                <div className="px-4 py-2 bg-[#060B14] border-b border-[#FBBF24]/30 flex items-center justify-between text-xs font-mono-hud">
                  <span className="text-[#FBBF24] font-bold">
                    {isEp02
                      ? `[IZQUIERDA] CLAUDE OPUS 5.5 · ${ep02Challenge.time_min.opus} MIN · $${ep02Challenge.cost_usd.opus.toFixed(2)}`
                      : `[IZQUIERDA] GEMINI 3.8 FLASH · ${ep01Challenge.time_min.flash} MIN`}
                  </span>
                  <span className="text-[#8FA3B8]">
                    {isEp02
                      ? `${ep02Challenge.code_stats.opus_lines} loc · ${ep02Challenge.fps.opus}`
                      : `${ep01Challenge.code_stats.flash_lines} loc · ${ep01Challenge.code_stats.flash_kb} KB`}
                  </span>
                </div>
                <iframe
                  key={`split-opp-${activeEpisode}-${activeDir}-${iframeKey}`}
                  src={
                    isEp02
                      ? ep02Challenge.demo_urls.opus
                      : ep01Challenge.demo_urls.flash
                  }
                  title={`${opponentFullName} - ${activeDir}`}
                  className="w-full h-[480px] sm:h-[560px] border-0 bg-black"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                />
              </div>

              {/* Right: ARGON */}
              <div>
                <div className="px-4 py-2 bg-[#060B14] border-b border-[#B794F6]/30 flex items-center justify-between text-xs font-mono-hud">
                  <span className="text-[#B794F6] font-bold">
                    {isEp02
                      ? `[DERECHA] GEMINI 4 ARGON · ${ep02Challenge.time_min.argon} MIN · $${ep02Challenge.cost_usd.argon.toFixed(2)}`
                      : `[DERECHA] GEMINI 4 ARGON · ${ep01Challenge.time_min.argon} MIN (GANADOR)`}
                  </span>
                  <span className="text-[#8FA3B8]">
                    {isEp02
                      ? `${ep02Challenge.code_stats.argon_lines} loc · ${ep02Challenge.fps.argon}`
                      : `${ep01Challenge.code_stats.argon_lines} loc · ${ep01Challenge.code_stats.argon_kb} KB`}
                  </span>
                </div>
                <iframe
                  key={`split-argon-${activeEpisode}-${activeDir}-${iframeKey}`}
                  src={
                    isEp02
                      ? ep02Challenge.demo_urls.argon
                      : ep01Challenge.demo_urls.argon
                  }
                  title={`Argon - ${activeDir}`}
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
                    ? "VEREDICTO Y AUDITORIA DE KEVIN GONZALEZ (ARBITRO)"
                    : "KEVIN GONZALEZ'S REFEREE VERDICT & AUDIT"}
                </div>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  &ldquo;
                  {isEp02
                    ? lang === "es"
                      ? ep02Challenge.kevin_note_es
                      : ep02Challenge.kevin_note_en
                    : lang === "es"
                    ? ep01Challenge.kevin_note_verbatim
                    : ep01Challenge.kevin_note_en}
                  &rdquo;
                </p>
              </div>

              {/* EP02 Token & API Cost Telemetry Box */}
              {isEp02 && (
                <div className="p-5 rounded-xl bg-[#0B1D30] border border-[#22A2DD]/30">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="text-xs font-mono-hud uppercase text-[#5EEAD4] font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      {lang === "es"
                        ? `TELEMETRIA DE TOKENS Y FACTURA API · RETO 0${ep02Challenge.n}`
                        : `TOKEN TELEMETRY & API BILL · CHALLENGE 0${ep02Challenge.n}`}
                    </div>
                    <span className="font-mono-hud text-xs text-[#8FA3B8]">
                      {lang === "es"
                        ? ep02Challenge.cost_ratio_es
                        : ep02Challenge.cost_ratio_en}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-hud text-xs">
                    <div className="p-3.5 rounded-lg bg-[#060B14] border border-[#B794F6]/30 flex items-center justify-between">
                      <div>
                        <div className="text-[#B794F6] font-bold">
                          GEMINI 4 ARGON (HIGH)
                        </div>
                        <div className="text-[#8FA3B8] mt-1">
                          In: {ep02Challenge.tokens.argon_in} · Cache:{" "}
                          {ep02Challenge.tokens.argon_cache} · Out:{" "}
                          {ep02Challenge.tokens.argon_out}
                        </div>
                        <div className="text-white mt-0.5">
                          Total: {ep02Challenge.tokens.argon_total} tokens (
                          {ep02Challenge.tokens.argon_steps} pasos)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#34D399]">
                          ${ep02Challenge.cost_usd.argon.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">USD</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#060B14] border border-[#FBBF24]/30 flex items-center justify-between">
                      <div>
                        <div className="text-[#FBBF24] font-bold">
                          CLAUDE OPUS 5.5 (HIGH)
                        </div>
                        <div className="text-[#8FA3B8] mt-1">
                          In+CW: {ep02Challenge.tokens.opus_in} · Cache:{" "}
                          {ep02Challenge.tokens.opus_cache} · Out:{" "}
                          {ep02Challenge.tokens.opus_out}
                        </div>
                        <div className="text-white mt-0.5">
                          Total: {ep02Challenge.tokens.opus_total} tokens (
                          {ep02Challenge.tokens.opus_steps} pasos)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#FBBF24]">
                          ${ep02Challenge.cost_usd.opus.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">USD</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature & Observation Audit Grid */}
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
                      {isEp02
                        ? `${ep02Challenge.time_min.argon}m · $${ep02Challenge.cost_usd.argon.toFixed(2)}`
                        : `${ep01Challenge.time_min.argon} min`}
                    </span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#F5F7FA]">
                    {(isEp02
                      ? ep02Challenge.argon_features
                      : ep01Challenge.argon_features
                    ).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono-hud text-[#34D399] font-bold mt-0.5">
                          [+]
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opponent Features & Observations */}
                <div className="p-5 rounded-xl bg-[#0B1D30] border border-[#FBBF24]/30 space-y-4">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#FBBF24] mb-3 flex items-center justify-between">
                      <span>
                        {isEp02
                          ? lang === "es"
                            ? "Lo que entrego Claude Opus 5.5 (High)"
                            : "Delivered by Claude Opus 5.5 (High)"
                          : lang === "es"
                          ? "Lo que entrego Gemini 3.8 Flash (High)"
                          : "Delivered by Gemini 3.8 Flash (High)"}
                      </span>
                      <span className="font-mono-hud text-xs px-2 py-0.5 rounded bg-[#FBBF24]/15">
                        {isEp02
                          ? `${ep02Challenge.time_min.opus}m · $${ep02Challenge.cost_usd.opus.toFixed(2)}`
                          : `${ep01Challenge.time_min.flash} min`}
                      </span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#F5F7FA]">
                      {(isEp02
                        ? ep02Challenge.opus_features
                        : ep01Challenge.flash_features
                      ).map((feat, i) => (
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
                      {isEp02
                        ? lang === "es"
                          ? "NOTAS DE AUDITORIA Y TELEMETRIA EN OPUS 5.5"
                          : "AUDIT & TELEMETRY NOTES ON OPUS 5.5"
                        : lang === "es"
                        ? "FALLOS Y OMISIONES DETECTADOS EN FLASH"
                        : "BUGS & OMISSIONS DETECTED IN FLASH"}
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#8FA3B8]">
                      {(isEp02
                        ? ep02Challenge.opus_observations
                        : ep01Challenge.flash_problems
                      ).map((prob, i) => (
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
                        ? `PROMPT OFICIAL INTEGRO · ${isEp02 ? `EP02 RETO 0${ep02Challenge.n}` : `EP01 NIVEL ${ep01Challenge.n}`} (${activeDir})`
                        : `OFFICIAL VERBATIM PROMPT · ${isEp02 ? `EP02 CHALLENGE 0${ep02Challenge.n}` : `EP01 LEVEL ${ep01Challenge.n}`} (${activeDir})`}
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
                  {activePromptVerbatim}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "stills" && !showBonus && (
            <div className="p-5 sm:p-8 bg-[#060B14]/90 space-y-6">
              {isEp02 && ep02Challenge.stills.vs && (
                <div className="rounded-xl overflow-hidden border border-[#22A2DD]/40 bg-black">
                  <div className="px-4 py-2 bg-[#11283F] text-xs font-mono-hud font-bold text-[#5EEAD4]">
                    {lang === "es"
                      ? `COMPARATIVA LADO A LADO 4K — RETO 0${ep02Challenge.n} (OPUS 5.5 VS ARGON)`
                      : `4K SIDE-BY-SIDE COMPARISON — CHALLENGE 0${ep02Challenge.n} (OPUS 5.5 VS ARGON)`}
                  </div>
                  <img
                    src={ep02Challenge.stills.vs}
                    alt={`EP02 VS ${ep02Challenge.dir}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-mono-hud text-xs uppercase tracking-wider text-[#FBBF24] font-bold mb-3">
                    [IZQUIERDA] CAPTURAS DE GRABACION REAL — {opponentFullName.toUpperCase()}
                  </h4>
                  <div className="space-y-3">
                    {(isEp02
                      ? ep02Challenge.stills.opus
                      : ep01Challenge.stills.flash
                    ).map((src) => (
                      <div
                        key={src}
                        className="rounded-xl overflow-hidden border border-[#FBBF24]/30 bg-black"
                      >
                        <img
                          src={src}
                          alt={`${opponentShortName} capture ${src}`}
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
                    {(isEp02
                      ? ep02Challenge.stills.argon
                      : ep01Challenge.stills.argon
                    ).map((src) => (
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
                        gemini-4-argon/{activeDir}/index.html (
                        {isEp02
                          ? ep02Challenge.code_stats.argon_lines
                          : ep01Challenge.code_stats.argon_lines}{" "}
                        loc)
                      </button>
                      <button
                        onClick={() => setSourceModel("opponent")}
                        className={`px-3.5 py-1.5 rounded-lg font-mono-hud text-xs font-bold cursor-pointer ${
                          sourceModel === "opponent"
                            ? "bg-[#FBBF24] text-[#060B14]"
                            : "bg-[#0B1D30] text-[#8FA3B8] border border-white/10"
                        }`}
                      >
                        {isEp02 ? "claude-opus-5.5" : "gemini-3.8-flash"}/
                        {activeDir}/index.html (
                        {isEp02
                          ? ep02Challenge.code_stats.opus_lines
                          : ep01Challenge.code_stats.flash_lines}{" "}
                        loc)
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
