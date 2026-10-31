"use client";

import { useRef } from "react";
import { CHALLENGES } from "@/data/labsData";
import { EP02_CHALLENGES } from "@/data/ep02Data";
import { EP03_CHALLENGES, EP03_HONESTY_NOTES } from "@/data/ep03Data";
import { EP04_BENCHMARK_TOTALS, EP04_CHALLENGES } from "@/data/ep04Data";
import { YOUTUBE_LINKS } from "@/data/glossary";
import type { ReleasedState } from "@/data/releaseSchedule";
import {
  PixelCopyButton,
  PixelIcon,
  PixelSwipeHint,
  PixelTabs,
  type PixelSoundName,
} from "@mixiuh/pixel-ui";

export type DossierEpisode = "ep04" | "ep03" | "ep02" | "ep01";
export type Ep04Mode = "triple" | "haiku" | "sonnet" | "opus" | "prompt";
export type Ep03Mode = "split" | "superkit" | "vanilla" | "still" | "prompt";
export type VideoClip = "hook" | "boss";

/** State and handlers stay in the portal, which owns the hash routing. */
export interface DossierViewProps {
  lang: "es" | "en";
  released: ReleasedState;
  dossierEp: DossierEpisode;
  selectDossierEp: (ep: DossierEpisode) => void;
  handleEpisodeChange: (ep: "ep02" | "ep01") => void;
  navigateToView: (view: "noticias" | "comunidad") => void;
  handleJumpToArena: (episode: DossierEpisode, challengeN: number) => void;
  playSfx: (name: PixelSoundName) => void;
  ep04ChallengeN: number;
  setEp04ChallengeN: (n: number) => void;
  ep04Mode: Ep04Mode;
  setEp04Mode: (mode: Ep04Mode) => void;
  ep03ChallengeN: number;
  setEp03ChallengeN: (n: number) => void;
  ep03Mode: Ep03Mode;
  setEp03Mode: (mode: Ep03Mode) => void;
  activeVideoClip: VideoClip;
  setActiveVideoClip: (clip: VideoClip) => void;
}

/** EP04 runs of one tier marked "ok" in ep04Data.ts, e.g. "5/6 OK". */
const ep04OkRuns = (tier: "haiku" | "sonnet" | "opus") =>
  `${EP04_CHALLENGES.filter((c) => c[tier].status === "ok").length}/${EP04_CHALLENGES.length} OK`;

/*
 * Phones (below sm) swipe the comparison tables sideways. There the "#" column
 * is hidden and the challenge-name column stays pinned at the left, narrow and
 * opaque (its background follows the row's hover and selection), so every value
 * keeps its row label and two value columns fit beside it. Value columns snap to
 * the pinned column's edge. From sm up the tables are unchanged.
 */
/** Table: tighter cell padding on phones. */
const PIN_TABLE = "max-sm:[&_th]:px-3 max-sm:[&_td]:px-3";
/** Scroller: snaps value columns to the right edge of the 120px pinned column. */
const PIN_SCROLLER = "overflow-x-auto max-sm:snap-x max-sm:scroll-pl-30";
/** Pinned name cell of the dark header and footer rows. */
const PIN_BAR_CELL = "max-sm:sticky max-sm:left-0 max-sm:z-[1] max-sm:w-30 max-sm:min-w-30 max-sm:bg-[#090B10]";
/** Pinned name cell of a body row (whose <tr> has `group/row`). */
const pinCell = (selected = false) =>
  `max-sm:sticky max-sm:left-0 max-sm:z-[1] max-sm:w-30 max-sm:min-w-30 transition ${
    selected ? "max-sm:bg-[#1A2132]" : "max-sm:bg-[#111622] max-sm:group-hover/row:bg-[#1A2132]"
  }`;
/** Header cell of a value column: a snap point. */
const SNAP_COL = "max-sm:snap-start";

/**
 * Videos / Labs view: the EP04 to EP01 dossiers, their tables and demo
 * comparators. Loaded on demand, so the episode datasets stay off the home page.
 */
export default function DossierView({
  lang,
  released,
  dossierEp,
  selectDossierEp,
  handleEpisodeChange,
  navigateToView,
  handleJumpToArena,
  playSfx,
  ep04ChallengeN,
  setEp04ChallengeN,
  ep04Mode,
  setEp04Mode,
  ep03ChallengeN,
  setEp03ChallengeN,
  ep03Mode,
  setEp03Mode,
  activeVideoClip,
  setActiveVideoClip,
}: DossierViewProps) {
  // English mode shows the English twin of a note where the data has one
  const fpsNote = (note: string, note_en?: string) =>
    lang === "es" ? note : (note_en ?? note);
  /** "p" (pasos) is the Spanish shorthand for agent steps in the EP03 figures. */
  const stepsUnit = lang === "es" ? "p" : " steps";

  // The EP04 "Ejecutar Demo" buttons unmount with the 3-way composite they sit
  // in, so focus moves into the demo pane that replaces it instead of <body>.
  // The pane is then scrolled to its top (below the sticky header, via the
  // page's scroll-padding): focus() alone can leave its title bar under the
  // header on short phones.
  const ep04DemoPaneRef = useRef<HTMLDivElement>(null);
  const launchEp04Demo = (tier: "haiku" | "sonnet" | "opus") => {
    setEp04Mode(tier);
    requestAnimationFrame(() => {
      const pane = ep04DemoPaneRef.current;
      pane?.focus({ preventScroll: true });
      pane?.scrollIntoView({ block: "start" });
    });
  };

  const isEp02 = dossierEp === "ep02";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section 01 Opaque Pixel-Art Header Banner */}
      <div
        data-px-reveal="true"
        className="p-5 sm:p-6 bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style={{ outline: "2px solid #10B981" }}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#10B981] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold mb-2">
            <PixelIcon name="floppy" size={13} color="#090B10" />
            <span>
              {lang === "es"
                ? "SECCION 01 · VIDEOS Y LABORATORIOS EMPIRICOS"
                : "SECTION 01 · EMPIRICAL VIDEOS & LABS"}
            </span>
          </div>
          {/* Banner text, not a heading: each episode's title below is the view's <h1> */}
          <p className="font-display text-xl sm:text-2xl font-black text-white">
            {lang === "es"
              ? "Bitacora de Benchmarks, Dossiers Tecnicos y Pruebas en Vivo (EP01 – EP04)"
              : "Benchmark Log, Technical Dossiers & Live Tests (EP01 – EP04)"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
          <button
            onClick={() => navigateToView("noticias")}
            className="px-btn bg-[#00E5FF] text-[#090B10] px-3.5 py-2"
          >
            <PixelIcon name="broadcast" size={13} color="#090B10" />
            <span>
              {lang === "es"
                ? "Ir a Noticias IA (Carbon) →"
                : "Go to AI News (Carbon) →"}
            </span>
          </button>
          <button
            onClick={() => navigateToView("comunidad")}
            className="px-btn bg-[#FFD100] text-[#090B10] px-3.5 py-2"
          >
            <PixelIcon name="sparkles" size={13} color="#090B10" />
            <span>
              {lang === "es"
                ? "Ir a Comentario al Codigo →"
                : "Go to Comment to Code →"}
            </span>
          </button>
        </div>
      </div>

      {/* 3.5" Floppy Diskette Episode Selector Bar (Opaque Pixel-Art) */}
      <div
        data-px-reveal="true"
        className="p-4 bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] space-y-3"
        style={{ outline: "2px solid #2A344B" }}
      >
        <div className="flex items-center justify-between gap-2 font-pixel text-[10px] text-[#FFD100]">
          <div className="flex items-center gap-2">
            <PixelIcon name="floppy" size={14} color="#FFD100" />
            <span id="dossier-disk-label">
              {lang === "es"
                ? "SELECCIONA EL DISQUETE / LABORATORIO A INSPECCIONAR:"
                : "SELECT THE FLOPPY DISK / LAB EPISODE TO INSPECT:"}
            </span>
          </div>
          <span className="text-[#94A3B8]">3.5&quot; HD // ZERO-SHOT</span>
        </div>

        <div
          role="group"
          aria-labelledby="dossier-disk-label"
          className={`grid grid-cols-1 ${
            released.ep04
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : released.ep03
              ? "sm:grid-cols-3"
              : "sm:grid-cols-2"
          } gap-3`}
        >
          {released.ep04 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep04");
              }}
              aria-pressed={dossierEp === "ep04"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep04"
                  ? "bg-[#182235] border-[#FF3355]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#FF3355]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#FF3355] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 04 · NUEVO" : "DISK 04 · NEW"}
                </span>
                <span className="text-[#10B981]">
                  3-2-1 · $1.54 vs $29.94
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Escalera Claude: Haiku vs Sonnet vs Opus"
                  : "Claude Ladder: Haiku vs Sonnet vs Opus"}
              </div>
            </button>
          )}

          {released.ep03 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep03");
              }}
              aria-pressed={dossierEp === "ep03"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep03"
                  ? "bg-[#182235] border-[#10B981]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#10B981]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#10B981] text-[#090B10] font-bold">
                  DISK 03
                </span>
                {/* "min", not "m": the pixel font has no lowercase, and "M" reads as millions */}
                <span className="text-[#FFD100]">4-2 · 276&nbsp;min vs 302&nbsp;min</span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Argon High Sin Kit vs. Superpowers Kit"
                  : "Argon High Raw vs. Superpowers Kit"}
              </div>
            </button>
          )}

          <button
            onClick={() => {
              playSfx("cartridgeInsert");
              handleEpisodeChange("ep02");
            }}
            aria-pressed={dossierEp === "ep02"}
            className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
              dossierEp === "ep02"
                ? "bg-[#182235] border-[#A855F7]"
                : "bg-[#090B10] border-[#2A344B] hover:border-[#A855F7]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
              <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#A855F7] text-[#090B10] font-bold">
                DISK 02
              </span>
              <span className="text-[#00E5FF]">
                4-2 · $6.26 vs $16.26
              </span>
            </div>
            <div className="font-display text-sm font-black text-white mt-2 truncate">
              Gemini 4 Argon vs. Claude Opus 5.5
            </div>
          </button>

          <button
            onClick={() => {
              playSfx("cartridgeInsert");
              handleEpisodeChange("ep01");
            }}
            aria-pressed={dossierEp === "ep01"}
            className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
              dossierEp === "ep01"
                ? "bg-[#182235] border-[#F5F2EB]"
                : "bg-[#090B10] border-[#2A344B] hover:border-[#F5F2EB]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
              <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#F5F2EB] text-[#090B10] font-bold">
                DISK 01
              </span>
              <span className="text-[#94A3B8]">10-0 · 55&nbsp;min vs 94&nbsp;min</span>
            </div>
            <div className="font-display text-sm font-black text-white mt-2 truncate">
              Gemini 4 Argon vs. Gemini 3.8 Flash
            </div>
          </button>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          SUB-DOSSIER 0: EPISODIO 04 (GATED BY RELEASE SCHEDULE)
         ----------------------------------------------------------------- */}
      {released.ep04 && dossierEp === "ep04" && (
        <div id="ep04-escalera-claude" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #00E5FF" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "DOSSIER OFICIAL EPISODIO 04 · 18 CORRIDAS REALES EN CLAUDE CODE CLI (HAIKU VS SONNET VS OPUS)"
                : "OFFICIAL EPISODE 04 DOSSIER · 18 REAL CLAUDE CODE CLI RUNS (HAIKU VS SONNET VS OPUS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es" ? (
                <>
                  La Escalera Completa de Claude 5.5:{" "}
                  <span className="text-[#10B981]">Haiku ($1.54)</span> vs.{" "}
                  <span className="text-[#FFD100]">Sonnet ($12.22)</span>{" "}
                  vs.{" "}
                  <span className="text-[#C084FC]">Opus ($29.94)</span>
                </>
              ) : (
                <>
                  The Full Claude 5.5 Ladder:{" "}
                  <span className="text-[#10B981]">Haiku ($1.54)</span> vs.{" "}
                  <span className="text-[#FFD100]">Sonnet ($12.22)</span>{" "}
                  vs.{" "}
                  <span className="text-[#C084FC]">Opus ($29.94)</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-4xl">
              {lang === "es"
                ? "Enfrentamos a los 3 niveles de Claude 5.5 en 18 ejecuciones aisladas (6 retos extremos x 3 modelos). Opus 5.5 gano 3 puntos en fisica multicapa y shaders cientificos (Rover Verlet, Bio-Red Tokio GPU y Puente XPBD), Sonnet 5.5 gano 2 puntos en los retos finales (Path Tracer WebGL2 a 22 FPS vs 15 FPS de Opus y Consola Retro CHIP-8 con Pong en vivo mientras Opus olvido ensamblar la ROM), y Haiku 5.5 gano 1 punto historico al construir el Estudio Acido 3D a 61 FPS por solo $0.21 USD (24 veces mas barato que Opus)."
                : "We pitted all 3 tiers of Claude 5.5 across 18 isolated runs (6 extreme challenges x 3 models). Opus 5.5 won 3 points on multi-pass physics and scientific shaders (Verlet Rover, Tokyo GPU Bio-Network, and XPBD Bridge), Sonnet 5.5 won 2 points in the final challenges (WebGL2 Path Tracer at 22 FPS vs Opus's 15 FPS and Retro CHIP-8 Console booting live Pong while Opus left a 0-byte ROM), and Haiku 5.5 won 1 historic ROI point by building a 61 FPS 3D Acid Studio for $0.21 USD (24x cheaper than Opus)."}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={lang === "es" ? YOUTUBE_LINKS.ep04_es : YOUTUBE_LINKS.ep04_en}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 shadow-[4px_4px_0_#040508] bg-[#FF3355] text-[#090B10] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition inline-flex items-center gap-2"
              >
                <PixelIcon name="play" size={16} />
                <span>
                  {lang === "es"
                    ? "Ver en YouTube (4K60)"
                    : "Watch on YouTube (4K60)"}
                </span>
                <PixelIcon name="external" size={14} />
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 bg-[#090B10] border-2 border-[#00E5FF] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#00E5FF] font-bold">
                  {lang === "es" ? "MARCADOR TRIPLE" : "3-WAY SCOREBOARD"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  {EP04_BENCHMARK_TOTALS.score}
                </div>
                <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                  Opus 3 · Sonnet 2 · Haiku 1
                </div>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es"
                    ? "CLAUDE HAIKU 5.5 (6 RETOS)"
                    : "CLAUDE HAIKU 5.5 (6 CHALLENGES)"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  ${EP04_BENCHMARK_TOTALS.haiku_usd.toFixed(2)}{" "}
                  <span className="text-sm text-[#10B981]">
                    ({EP04_BENCHMARK_TOTALS.haiku_min}m)
                  </span>
                </div>
                <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                  {`${(EP04_BENCHMARK_TOTALS.opus_usd / EP04_BENCHMARK_TOTALS.haiku_usd).toFixed(1)}x ${
                    lang === "es" ? "mas barato que Opus" : "cheaper than Opus"
                  } · ${ep04OkRuns("haiku")}`}
                </div>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                  {lang === "es"
                    ? "CLAUDE SONNET 5.5 (6 RETOS)"
                    : "CLAUDE SONNET 5.5 (6 CHALLENGES)"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  ${EP04_BENCHMARK_TOTALS.sonnet_usd.toFixed(2)}{" "}
                  <span className="text-sm text-[#FFD100]">
                    ({EP04_BENCHMARK_TOTALS.sonnet_min}m)
                  </span>
                </div>
                <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                  {`${(EP04_BENCHMARK_TOTALS.opus_usd / EP04_BENCHMARK_TOTALS.sonnet_usd).toFixed(2)}x ${
                    lang === "es" ? "mas barato que Opus" : "cheaper than Opus"
                  } · ${ep04OkRuns("sonnet")}`}
                </div>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#A855F7] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#C084FC] font-bold">
                  {lang === "es"
                    ? "CLAUDE OPUS 5.5 (6 RETOS)"
                    : "CLAUDE OPUS 5.5 (6 CHALLENGES)"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  ${EP04_BENCHMARK_TOTALS.opus_usd.toFixed(2)}{" "}
                  <span className="text-sm text-[#C084FC]">
                    ({EP04_BENCHMARK_TOTALS.opus_min}m)
                  </span>
                </div>
                <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                  {`${EP04_BENCHMARK_TOTALS.opus_lines.toLocaleString("en-US")} ${
                    lang === "es" ? "lineas" : "lines"
                  } · ${EP04_BENCHMARK_TOTALS.opus_tokens} tokens · ${ep04OkRuns("opus")}`}
                </div>
              </div>
            </div>
          </div>

          {/* EP04 Interactive 18-Demo 3-Way Comparator */}
          {(() => {
            const ch4 =
              EP04_CHALLENGES.find((c) => c.n === ep04ChallengeN) ||
              EP04_CHALLENGES[0];
            return (
              <div className="space-y-5">
                <div
                  data-px-reveal="true"
                  role="group"
                  aria-label={lang === "es" ? "Retos del EP04" : "EP04 challenges"}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
                >
                  {EP04_CHALLENGES.map((ch) => {
                    const active = ep04ChallengeN === ch.n;
                    const winCol =
                      ch.winner === "opus"
                        ? "#A855F7"
                        : ch.winner === "sonnet"
                        ? "#FFD100"
                        : "#10B981";
                    return (
                      <button
                        key={ch.n}
                        onClick={() => {
                          playSfx("click");
                          setEp04ChallengeN(ch.n);
                        }}
                        aria-pressed={active}
                        className={`p-3 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                          active
                            ? "bg-[#182235] border-[#00E5FF]"
                            : "bg-[#111622] border-[#2A344B] hover:border-[#00E5FF]"
                        }`}
                      >
                        <div className="flex items-center justify-between font-pixel text-[10px]">
                          <span className="text-[#00E5FF] font-bold">
                            R0{ch.n}
                          </span>
                          <span
                            className="px-1.5 py-0.5 font-bold text-[#090B10]"
                            style={{ backgroundColor: winCol }}
                          >
                            {ch.winner.toUpperCase()} WIN
                          </span>
                        </div>
                        <div className="font-display text-xs font-bold text-white mt-1.5 truncate">
                          {lang === "es" ? ch.name_es : ch.name_en}
                        </div>
                        <div className="font-mono-hud text-[10px] text-[#94A3B8] mt-1">
                          ${ch.haiku.usd.toFixed(2)} | $
                          {ch.sonnet.usd.toFixed(2)} | $
                          {ch.opus.usd.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  data-px-reveal="true"
                  className="bg-[#111622] border-2 border-[#090B10] overflow-hidden shadow-[6px_6px_0_#040508]"
                  style={{ outline: "2px solid #00E5FF" }}
                >
                  <div className="p-4 sm:p-5 bg-[#090B10] border-b-2 border-[#2A344B] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="font-mono-hud text-xs font-bold text-[#00E5FF]">
                        {lang === "es" ? ch4.world_es : ch4.world_en} ·{" "}
                        {lang === "es"
                          ? ch4.winner_label_es
                          : ch4.winner_label_en}
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
                        0{ch4.n}.{" "}
                        {lang === "es" ? ch4.name_es : ch4.name_en}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                        {lang === "es" ? ch4.sub_es : ch4.sub_en}
                      </p>
                    </div>

                    <PixelTabs
                      ariaLabel={lang === "es" ? "Modo de comparacion EP04" : "EP04 comparison mode"}
                      tone="cyan"
                      size="sm"
                      wrap
                      value={ep04Mode}
                      onChange={setEp04Mode}
                      items={[
                        {
                          id: "triple" as const,
                          label: lang === "es" ? "Comparativa Triple" : "3-Way Composite",
                          icon: "grid" as const,
                        },
                        {
                          id: "haiku" as const,
                          label: `Haiku 5.5 ($${ch4.haiku.usd.toFixed(2)})`,
                        },
                        {
                          id: "sonnet" as const,
                          label: `Sonnet 5.5 ($${ch4.sonnet.usd.toFixed(2)})`,
                        },
                        {
                          id: "opus" as const,
                          label: `Opus 5.5 ($${ch4.opus.usd.toFixed(2)})`,
                        },
                        { id: "prompt" as const, label: "Prompt", icon: "terminal" as const },
                      ]}
                    />
                  </div>

                  <div className="p-4 sm:p-6 space-y-5">
                    {ep04Mode === "triple" && (
                      <div className="space-y-4">
                        <img
                          src={ch4.vs_still}
                          alt={
                            lang === "es"
                              ? `Captura comparativa del reto 0${ch4.n}, ${ch4.name_es}: Haiku, Sonnet y Opus lado a lado`
                              : `Comparison still for challenge 0${ch4.n}, ${ch4.name_en}: Haiku, Sonnet and Opus side by side`
                          }
                          className="w-full border border-[#2A344B] shadow-[4px_4px_0_#040508]"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-hud text-xs">
                          {(
                            [
                              {
                                id: "haiku" as const,
                                title: "CLAUDE HAIKU 5.5",
                                col: "#10B981",
                                data: ch4.haiku,
                              },
                              {
                                id: "sonnet" as const,
                                title: "CLAUDE SONNET 5.5",
                                col: "#FFD100",
                                data: ch4.sonnet,
                              },
                              {
                                id: "opus" as const,
                                title: "CLAUDE OPUS 5.5",
                                col: "#A855F7",
                                data: ch4.opus,
                              },
                            ]
                          ).map((t) => (
                            <div
                              key={t.id}
                              className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B] flex flex-col justify-between gap-3"
                            >
                              <div>
                                <div
                                  className="font-bold text-sm"
                                  style={{ color: t.col }}
                                >
                                  {t.title}
                                </div>
                                <div className="text-white font-bold mt-1">
                                  {t.data.min} min · $
                                  {t.data.usd.toFixed(2)} USD ·{" "}
                                  {t.data.lines} loc
                                </div>
                                <div className="text-[#94A3B8] mt-0.5">
                                  {fpsNote(t.data.fps, t.data.fps_en)} · {t.data.tok} tok
                                </div>
                              </div>
                              <button
                                onClick={() => launchEp04Demo(t.id)}
                                className="w-full py-2 font-bold text-[#090B10] hover:brightness-110 transition cursor-pointer"
                                style={{ backgroundColor: t.col }}
                              >
                                {lang === "es"
                                  ? `Ejecutar Demo ${t.title}`
                                  : `Launch ${t.title} Demo`}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(ep04Mode === "haiku" ||
                      ep04Mode === "sonnet" ||
                      ep04Mode === "opus") && (
                      <div
                        ref={ep04DemoPaneRef}
                        tabIndex={-1}
                        role="group"
                        aria-labelledby="ep04-demo-pane-label"
                        className="space-y-3 focus:outline-none"
                      >
                        <div className="flex items-center justify-between font-mono-hud text-xs bg-[#090B10] px-4 py-2.5 shadow-[4px_4px_0_#040508] border border-[#2A344B]">
                          <span id="ep04-demo-pane-label" className="text-[#00E5FF] font-bold">
                            {ep04Mode.toUpperCase()} 5.5 ·{" "}
                            {ch4[ep04Mode].min} min · $
                            {ch4[ep04Mode].usd.toFixed(2)} USD ·{" "}
                            {fpsNote(ch4[ep04Mode].fps, ch4[ep04Mode].fps_en)}
                          </span>
                          <a
                            href={ch4[ep04Mode].demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-[#00E5FF] inline-flex items-center gap-1"
                          >
                            <span>
                              {lang === "es"
                                ? "Abrir en pestaña completa"
                                : "Open in new tab"}
                            </span>
                            <PixelIcon name="external" size={14} />
                          </a>
                        </div>
                        <iframe
                          allowFullScreen
                          src={ch4[ep04Mode].demoUrl}
                          title={`Claude ${ep04Mode.charAt(0).toUpperCase()}${ep04Mode.slice(1)} 5.5: ${
                            lang === "es" ? ch4.name_es : ch4.name_en
                          }`}
                          className="w-full h-[620px] shadow-[4px_4px_0_#040508] border border-[#2A344B] bg-black"
                        />
                      </div>
                    )}

                    {ep04Mode === "prompt" && (
                      <div className="p-5 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono-hud text-xs font-bold text-[#00E5FF]">
                            {lang === "es"
                              ? "PROMPT EXACTO (1 INTENTO · CLAUDE CODE CLI)"
                              : "EXACT PROMPT (1 ATTEMPT · CLAUDE CODE CLI)"}
                          </span>
                          <PixelCopyButton
                            text={ch4.prompt_verbatim}
                            label={lang === "es" ? "Copiar" : "Copy"}
                            copiedLabel={lang === "es" ? "Copiado" : "Copied"}
                            toastTitle={
                              lang === "es"
                                ? "PROMPT EP04 COPIADO"
                                : "EP04 PROMPT COPIED"
                            }
                          />
                        </div>
                        <pre className="text-xs sm:text-sm text-[#F5F2EB] whitespace-pre-wrap font-mono-hud leading-relaxed">
                          {ch4.prompt_verbatim}
                        </pre>
                      </div>
                    )}

                    <div className="p-4 bg-[#090B10] border-2 border-[#00E5FF] text-xs sm:text-sm text-[#F5F2EB] leading-relaxed">
                      <span className="font-pixel font-bold text-[#00E5FF] mr-2">
                        {lang === "es"
                          ? "VEREDICTO FORENSE:"
                          : "FORENSIC VERDICT:"}
                      </span>
                      {lang === "es" ? ch4.verdict_es : ch4.verdict_en}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER A: EPISODIO 03 (GATED BY RELEASE SCHEDULE)
         ----------------------------------------------------------------- */}
      {released.ep03 && dossierEp === "ep03" && (
        <div id="ep03-superpowers-kit" className="space-y-10">
          {/* EP03 Hero & Scoreboard */}
          <div className="bg-[#111622] border-2 border-[#10B981]/40 p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/50 font-mono-hud text-xs font-bold text-[#10B981]">
                {lang === "es"
                  ? "DOSSIER OFICIAL EPISODIO 03 · 12 CORRIDAS REALES AGY CLI (GEMINI 4 ARGON HIGH)"
                  : "OFFICIAL EPISODE 03 DOSSIER · 12 REAL AGY CLI RUNS (GEMINI 4 ARGON HIGH)"}
              </div>
              <a
                href="/downloads/mixiuh-superpowers-kit.zip"
                download
                className="px-4 py-2 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-2 shadow-[4px_4px_0_#040508]"
              >
                <PixelIcon name="download" size={16} />
                <span>
                  {lang === "es"
                    ? "Descargar Mixiuh Superpowers Kit v1.0 (.ZIP Gratis)"
                    : "Download Mixiuh Superpowers Kit v1.0 (Free .ZIP)"}
                </span>
              </a>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es" ? (
                <>
                  Gemini 4 Argon High{" "}
                  <span className="text-[#FFD100]">Sin Kit (Raw)</span>{" "}
                  vs.{" "}
                  <span className="text-[#10B981]">
                    Mixiuh Superpowers Kit v1.0
                  </span>
                  :{" "}
                  <span className="text-[#00E5FF]">
                    ¿Siguen Sirviendo los Skills y Memoria Hoy?
                  </span>
                </>
              ) : (
                <>
                  Gemini 4 Argon High{" "}
                  <span className="text-[#FFD100]">Raw (No Kit)</span> vs.{" "}
                  <span className="text-[#10B981]">
                    Mixiuh Superpowers Kit v1.0
                  </span>
                  :{" "}
                  <span className="text-[#00E5FF]">
                    Do You Still Need Skills & Memory Kits Today?
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-4xl">
              {lang === "es"
                ? "Ejecutamos 12 instancias aisladas de `agy --model gemini-4-argon-high --effort high` en 6 sistemas extremos. A diferencia de los modelos del ano pasado, Gemini 4 Argon High sin kit NO entrego codigo roto en ningun reto e incluso gano 2 puntos (Reto 03 Arcade Bullet-Hell con 1,829 proyectiles activos en 51m vs 69m, y Reto 04 Red Zero-Trust 3D en solo 5 pasos de agente por $0.74 USD). Sin embargo, el Mixiuh Superpowers Kit gano 4 a 2 en el global y ahorro 26 minutos totales (276m vs 302m), terminando la Terminal HFT Zero-GC mas rapido y mas barato (su HUD marca 70,406 vs 11,073 ord/s, pero esa cifra sale de una formula, no de una medicion), compilando el estudio DAG GLSL 10 minutos antes al mismo precio y corrigiendo con el Auto-Debugger MCP el solapamiento de ventanas en MixiuhOS."
                : "We ran 12 isolated instances of `agy --model gemini-4-argon-high --effort high` across 6 extreme systems. Unlike last year's models, Raw Gemini 4 Argon High shipped zero broken apps and won 2 rounds outright (Ch 03 Bullet-Hell Boss Rush with 1,829 active bullets in 51m vs 69m, and Ch 04 3D Zero-Trust Network in just 5 agent steps for $0.74 USD). However, the Mixiuh Superpowers Kit won 4-2 overall and saved 26 total minutes (276m vs 302m), finishing the Zero-GC HFT Terminal faster and cheaper (its HUD reads 70,406 vs 11,073 ord/s, but that figure comes from a formula, not a measurement), compiling the DAG GLSL Studio 10 minutes earlier for the exact same cost, and catching overlapping startup windows in MixiuhOS via the MCP Auto-Debugger."}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={lang === "es" ? YOUTUBE_LINKS.ep03_es : YOUTUBE_LINKS.ep03_en}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 shadow-[4px_4px_0_#040508] bg-[#FF3355] text-[#090B10] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition inline-flex items-center gap-2"
              >
                <PixelIcon name="play" size={16} />
                <span>
                  {lang === "es"
                    ? "Ver en YouTube (4K60)"
                    : "Watch on YouTube (4K60)"}
                </span>
                <PixelIcon name="external" size={14} />
              </a>
            </div>

            {/* 4 Real Telemetry Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#10B981]/40">
                <div className="font-mono-hud text-[11px] text-[#10B981] font-bold">
                  {lang === "es"
                    ? "MARCADOR GLOBAL REAL"
                    : "REAL OVERALL SCORE"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  4 - 2{" "}
                  <span className="text-sm text-[#10B981]">SUPERKIT</span>
                </div>
                <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                  {lang === "es"
                    ? "Kit gana R1, R2, R5, R6 · Raw gana R3, R4"
                    : "Kit wins C1, C2, C5, C6 · Raw wins C3, C4"}
                </div>
              </div>

              <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#00E5FF]/40">
                <div className="font-mono-hud text-[11px] text-[#00E5FF] font-bold">
                  {lang === "es"
                    ? "RELOJ ACUMULADO (6 RETOS)"
                    : "TOTAL CLOCK (6 TESTS)"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  276m <span className="text-sm text-[#94A3B8]">vs 302m</span>
                </div>
                <div className="font-mono-hud text-xs text-[#10B981] mt-1">
                  {lang === "es"
                    ? "-26 minutos totales a favor del Kit"
                    : "-26 total minutes saved with Kit"}
                </div>
              </div>

              <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#FFD100]/40">
                <div className="font-mono-hud text-[11px] text-[#FFD100] font-bold">
                  {lang === "es"
                    ? "FACTURA API Y TOKENS"
                    : "API BILL & TOKENS"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  $10.85{" "}
                  <span className="text-sm text-[#94A3B8]">vs $7.69</span>
                </div>
                <div className="font-mono-hud text-xs text-[#FFD100] mt-1">
                  {`3.52M tok (80${stepsUnit}) vs 2.65M tok (53${stepsUnit})`}
                </div>
              </div>

              <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#A855F7]/40">
                <div className="font-mono-hud text-[11px] text-[#C084FC] font-bold">
                  {lang === "es"
                    ? "VOLUMEN DE CODIGO REAL"
                    : "REAL CODE VOLUME"}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  7,937{" "}
                  <span className="text-sm text-[#94A3B8]">vs 6,996 loc</span>
                </div>
                <div className="font-mono-hud text-xs text-[#00E5FF] mt-1">
                  {lang === "es"
                    ? "325.4 KB (Kit) vs 279.1 KB (Sin Kit)"
                    : "325.4 KB (Kit) vs 279.1 KB (Raw)"}
                </div>
              </div>
            </div>
          </div>

          {/* EP03 Verified Comparative Matrix Table */}
          <div className="bg-[#111622] border-2 border-[#00E5FF]/30 overflow-hidden shadow-[4px_4px_0_#040508]">
            <div className="p-5 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-mono-hud text-xs font-bold text-[#10B981] uppercase">
                  {lang === "es"
                    ? "MATRIZ COMPARATIVA VERIFICADA EP03 · 12 CORRIDAS AGY CLI"
                    : "VERIFIED EP03 COMPARATIVE MATRIX · 12 AGY CLI RUNS"}
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
                  {lang === "es"
                    ? "Desglose por Reto: Reloj, Costo USD, Tokens, Pasos y Veredicto"
                    : "Challenge Breakdown: Clock, USD Cost, Tokens, Steps & Verdict"}
                </h2>
              </div>
            </div>

            <PixelSwipeHint label={lang === "es" ? "Desliza para ver todas las columnas" : "Swipe to see every column"} />
            <div className={PIN_SCROLLER}>
              <table className={`w-full min-w-[620px] sm:min-w-[860px] text-left border-collapse ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] border-b border-[#2A344B] font-mono-hud text-[11px] uppercase text-[#94A3B8]">
                    <th className="py-3.5 px-4 hidden sm:table-cell">#</th>
                    {/* The focus line under each name shows from sm up, and so does its header word */}
                    <th className={`py-3.5 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "Reto" : "Challenge"}
                      <span className="hidden sm:inline">
                        {lang === "es" ? " y enfoque" : " & focus"}
                      </span>
                    </th>
                    <th className={`py-3.5 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es"
                        ? "IA Sin Kit (Reloj / Loc / FPS)"
                        : "Raw AI (Clock / Loc / FPS)"}
                    </th>
                    <th className={`py-3.5 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es"
                        ? "Sin Kit Tokens / USD"
                        : "Raw Tokens / USD"}
                    </th>
                    <th className={`py-3.5 px-4 text-[#10B981] ${SNAP_COL}`}>
                      {lang === "es"
                        ? "Superpowers Kit (Reloj / Loc / FPS)"
                        : "Superpowers Kit (Clock / Loc / FPS)"}
                    </th>
                    <th className={`py-3.5 px-4 text-[#10B981] ${SNAP_COL}`}>
                      Superkit Tokens / USD
                    </th>
                    <th className={`py-3.5 px-4 ${SNAP_COL}`}>
                      {lang === "es" ? "Ganador" : "Winner"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B] text-xs sm:text-sm">
                  {EP03_CHALLENGES.map((ch) => (
                    <tr
                      key={ch.n}
                      onClick={() => setEp03ChallengeN(ch.n)}
                      className={`group/row hover:bg-[#1A2132] transition cursor-pointer ${
                        ep03ChallengeN === ch.n ? "bg-[#1A2132]" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono-hud font-bold text-[#00E5FF] hidden sm:table-cell">
                        0{ch.n}
                      </td>
                      <td className={`py-3.5 px-4 ${pinCell(ep03ChallengeN === ch.n)}`}>
                        <div className="font-bold text-white">
                          {lang === "es" ? ch.name_es : ch.name_en}
                        </div>
                        <div className="hidden sm:block text-xs text-[#10B981] font-mono-hud">
                          {ch.skill}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud">
                        <span className="text-[#FFD100] font-bold">
                          {ch.vanilla_min} min
                        </span>{" "}
                        <span className="text-xs text-[#94A3B8]">
                          · {fpsNote(ch.vanilla_fps, ch.vanilla_fps_en)}
                        </span>
                        <span className="text-xs text-[#94A3B8] block">
                          {ch.vanilla_lines} loc · {ch.vanilla_kb} KB
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud">
                        <span className="text-[#FFD100] font-bold">
                          ${ch.vanilla_usd.toFixed(2)} USD
                        </span>
                        <span className="text-xs text-[#94A3B8] block">
                          {ch.vanilla_tok} tok ({ch.vanilla_steps}
                          {stepsUnit})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud">
                        <span className="text-[#10B981] font-bold">
                          {ch.superkit_min} min
                        </span>{" "}
                        <span className="text-xs text-[#00E5FF]">
                          · {fpsNote(ch.superkit_fps, ch.superkit_fps_en)}
                        </span>
                        <span className="text-xs text-[#94A3B8] block">
                          {ch.superkit_lines} loc · {ch.superkit_kb} KB
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-hud">
                        <span className="text-[#10B981] font-bold">
                          ${ch.superkit_usd.toFixed(2)} USD
                        </span>
                        <span className="text-xs text-[#94A3B8] block">
                          {ch.superkit_tok} tok ({ch.superkit_steps}
                          {stepsUnit})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {ch.winner === "superkit" ? (
                          <span className="px-2.5 py-1 bg-[#10B981]/15 border border-[#10B981]/40 font-mono-hud text-[11px] font-bold text-[#10B981]">
                            SUPERKIT
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#FFD100]/15 border border-[#FFD100]/40 font-mono-hud text-[11px] font-bold text-[#FFD100]">
                            {lang === "es" ? "IA SIN KIT" : "RAW AI"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#090B10] border-t-2 border-[#10B981]/40 font-mono-hud text-xs font-bold">
                    <td className="py-4 px-4 text-[#00E5FF] hidden sm:table-cell">TOTAL</td>
                    <td className={`py-4 px-4 text-white ${PIN_BAR_CELL}`}>
                      {/* The "#" column holds TOTAL from sm up */}
                      <span className="block sm:hidden text-[#00E5FF]">TOTAL</span>
                      {lang === "es"
                        ? "6 Retos Extremos (12 Corridas Reales agy CLI)"
                        : "6 Extreme Challenges (12 Real agy CLI Runs)"}
                    </td>
                    <td className="py-4 px-4 text-[#FFD100]">
                      302 min · 6,996 loc (279.1 KB)
                    </td>
                    <td className="py-4 px-4 text-[#FFD100]">
                      {`$7.69 USD · 2.65M tok (53${stepsUnit})`}
                    </td>
                    <td className="py-4 px-4 text-[#10B981]">
                      276 min · 7,937 loc (325.4 KB)
                    </td>
                    <td className="py-4 px-4 text-[#10B981]">
                      {`$10.85 USD · 3.52M tok (80${stepsUnit})`}
                    </td>
                    <td className="py-4 px-4 text-[#10B981]">
                      SUPERKIT 4 - 2
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* EP03 Interactive 12-Demo Comparator */}
          <div className="space-y-4">
            <div
              role="group"
              aria-label={lang === "es" ? "Retos del EP03" : "EP03 challenges"}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
            >
              {EP03_CHALLENGES.map((ch) => {
                const active = ep03ChallengeN === ch.n;
                return (
                  <button
                    key={ch.n}
                    onClick={() => setEp03ChallengeN(ch.n)}
                    aria-pressed={active}
                    className={`p-3 shadow-[4px_4px_0_#040508] border-2 text-left transition cursor-pointer ${
                      active
                        ? "bg-[#182235] border-[#10B981]"
                        : "bg-[#111622] border-[#2A344B] hover:border-[#10B981]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-hud text-[10px]">
                      <span className="text-[#00E5FF] font-bold">
                        R0{ch.n}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 font-bold ${
                          ch.winner === "superkit"
                            ? "bg-[#10B981]/15 text-[#10B981]"
                            : "bg-[#FFD100]/20 text-[#FFD100]"
                        }`}
                      >
                        {ch.winner === "superkit" ? "KIT WIN" : "RAW WIN"}
                      </span>
                    </div>
                    <div className="font-display text-xs font-bold text-white mt-1 truncate">
                      {lang === "es" ? ch.name_es : ch.name_en}
                    </div>
                    <div className="font-mono-hud text-[10px] text-[#94A3B8] mt-1">
                      {ch.superkit_min}m vs {ch.vanilla_min}m
                    </div>
                  </button>
                );
              })}
            </div>

            {(() => {
              const cur =
                EP03_CHALLENGES.find((c) => c.n === ep03ChallengeN) ||
                EP03_CHALLENGES[0];
              const vanillaUrl = `/demos/ia-sin-kit/${cur.dir}/index.html`;
              const superkitUrl = `/demos/ia-superpowers-kit/${cur.dir}/index.html`;
              const curName = lang === "es" ? cur.name_es : cur.name_en;
              return (
                <div className="bg-[#090B10] border-2 border-[#10B981]/50 overflow-hidden shadow-[6px_6px_0_#040508]">
                  <div className="p-4 sm:p-5 bg-[#1A2132] border-b border-[#2A344B] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                        <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-bold">
                          {cur.skill}
                        </span>
                        <span className="text-[#FFD100]">
                          {lang === "es" ? "Sin Kit" : "Raw"}: {cur.vanilla_min}m · $
                          {cur.vanilla_usd.toFixed(2)} ({cur.vanilla_tok}{" "}
                          tok)
                        </span>
                        <span className="text-[#00E5FF]">
                          Superkit: {cur.superkit_min}m · $
                          {cur.superkit_usd.toFixed(2)} ({cur.superkit_tok}{" "}
                          tok)
                        </span>
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-black text-white">
                        0{cur.n}. {curName}
                      </h2>
                      <p className="text-xs text-[#94A3B8] max-w-3xl">
                        {lang === "es" ? cur.verdict_es : cur.verdict_en}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <PixelTabs
                        ariaLabel={lang === "es" ? "Modo de comparacion EP03" : "EP03 comparison mode"}
                        tone="emerald"
                        size="sm"
                        wrap
                        value={ep03Mode}
                        onChange={setEp03Mode}
                        items={[
                          { id: "split" as const, label: lang === "es" ? "Lado a Lado" : "Side by Side", icon: "grid" as const },
                          { id: "superkit" as const, label: "Superkit" },
                          { id: "vanilla" as const, label: lang === "es" ? "IA Sin Kit" : "Raw AI" },
                          { id: "still" as const, label: lang === "es" ? "Captura VS" : "VS Still", icon: "image" as const },
                          { id: "prompt" as const, label: "Prompt", icon: "terminal" as const },
                        ]}
                      />
                    </div>
                  </div>

                  {ep03Mode === "split" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                      <div className="flex flex-col">
                        <div className="px-3 py-2 bg-[#111622] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                          <span className="text-[#FFD100] font-bold">
                            {/* No left/right words: the columns stack below lg */}
                            {lang === "es"
                              ? "GEMINI 4 ARGON HIGH SIN KIT —"
                              : "GEMINI 4 ARGON HIGH RAW —"}{" "}
                            {fpsNote(cur.vanilla_fps, cur.vanilla_fps_en)}
                          </span>
                          <div className="flex items-center gap-3">
                            <a
                              href={`/api/source?model=ia-sin-kit&dir=${cur.dir}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#94A3B8] hover:text-white underline"
                            >
                              JSON Source ({cur.vanilla_lines} loc)
                            </a>
                            <a
                              href={vanillaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FFD100] hover:underline"
                            >
                              {lang === "es" ? "Pantalla Completa ↗" : "Full Screen ↗"}
                            </a>
                          </div>
                        </div>
                        <iframe
                          allowFullScreen
                          src={vanillaUrl}
                          title={`${lang === "es" ? "IA sin kit" : "Raw AI"}: ${curName}`}
                          className="w-full h-[540px] border-0 bg-[#090B10]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="px-3 py-2 bg-[#111622] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                          <span className="text-[#10B981] font-bold">
                            {lang === "es"
                              ? "IA + MIXIUH SUPERPOWERS KIT —"
                              : "AI + MIXIUH SUPERPOWERS KIT —"}{" "}
                            {fpsNote(cur.superkit_fps, cur.superkit_fps_en)}
                          </span>
                          <div className="flex items-center gap-3">
                            <a
                              href={`/api/source?model=ia-superpowers-kit&dir=${cur.dir}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00E5FF] hover:text-white underline"
                            >
                              JSON Source ({cur.superkit_lines} loc)
                            </a>
                            <a
                              href={superkitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#10B981] hover:underline"
                            >
                              {lang === "es" ? "Pantalla Completa ↗" : "Full Screen ↗"}
                            </a>
                          </div>
                        </div>
                        <iframe
                          allowFullScreen
                          src={superkitUrl}
                          title={`${lang === "es" ? "IA + Superpowers Kit" : "AI + Superpowers Kit"}: ${curName}`}
                          className="w-full h-[540px] border-0 bg-[#090B10]"
                        />
                      </div>
                    </div>
                  )}

                  {(ep03Mode === "superkit" ||
                    ep03Mode === "vanilla") && (
                    <iframe
                          allowFullScreen
                      src={
                        ep03Mode === "superkit" ? superkitUrl : vanillaUrl
                      }
                      title={`${
                        ep03Mode === "superkit"
                          ? lang === "es" ? "IA + Superpowers Kit" : "AI + Superpowers Kit"
                          : lang === "es" ? "IA sin kit" : "Raw AI"
                      }: ${curName}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  )}

                  {ep03Mode === "still" && (
                    <div className="p-6 bg-[#090B10] flex flex-col items-center">
                      <img
                        src={cur.vs_still}
                        alt={
                          lang === "es"
                            ? `Captura comparativa del reto 0${cur.n}, ${cur.name_es}: IA sin kit y Superpowers Kit lado a lado`
                            : `Comparison still for challenge 0${cur.n}, ${cur.name_en}: raw AI and Superpowers Kit side by side`
                        }
                        className="max-h-[580px] w-auto shadow-[4px_4px_0_#040508] border border-[#2A344B]"
                      />
                    </div>
                  )}

                  {ep03Mode === "prompt" && (
                    <div className="p-6 bg-[#090B10] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-hud text-xs font-bold text-[#00E5FF]">
                          {lang === "es"
                            ? "PROMPT IDENTICO ENVIADO A AMBAS INSTANCIAS DE AGY CLI"
                            : "IDENTICAL PROMPT SENT TO BOTH AGY CLI INSTANCES"}
                        </span>
                        <PixelCopyButton
                          text={cur.prompt_verbatim}
                          tone="cyan"
                          label={lang === "es" ? "Copiar Prompt" : "Copy Prompt"}
                          copiedLabel={lang === "es" ? "Copiado" : "Copied"}
                          toastTitle={
                            lang === "es"
                              ? "PROMPT EP03 COPIADO"
                              : "EP03 PROMPT COPIED"
                          }
                        />
                      </div>
                      <pre className="p-4 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] text-xs sm:text-sm text-[#F5F2EB] whitespace-pre-wrap font-mono-hud leading-relaxed">
                        {cur.prompt_verbatim}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* EP03 Honesty Notes */}
          <div className="shadow-[6px_6px_0_#040508] bg-[#111622] border-2 border-[#10B981]/30 p-6">
            <div className="flex items-center gap-2 font-mono-hud text-xs text-[#10B981] font-bold uppercase mb-3">
              <PixelIcon name="shield" size={16} />
              <span>
                {lang === "es"
                  ? "PROTOCOLO DE HONESTIDAD CIENTIFICA · EPISODIO 03"
                  : "SCIENTIFIC HONESTY PROTOCOL · EPISODE 03"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {EP03_HONESTY_NOTES.map((n, idx) => (
                <div
                  key={idx}
                  className="p-3.5 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B] text-xs text-[#F5F2EB]/90 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-mono-hud text-[#10B981] font-bold shrink-0">
                    [0{idx + 1}]
                  </span>
                  <span>{lang === "es" ? n.es : n.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER B & C: EPISODIO 02 OR EPISODIO 01
         ----------------------------------------------------------------- */}
      {(dossierEp === "ep02" || dossierEp === "ep01") && (
        <div className="space-y-10">
          {/* Hero Grid for EP02 / EP01 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#C084FC] font-mono-hud text-xs font-bold">
                {isEp02
                  ? lang === "es"
                    ? "EPISODIO 02 · DUELO DE TITANES ZERO-SHOT + FACTURA REAL DE TOKENS"
                    : "EPISODE 02 · ZERO-SHOT TITAN DUEL + REAL API TOKEN BILL"
                  : lang === "es"
                  ? "EPISODIO 01 · TORNEO ZERO-SHOT EN ANTIGRAVITY"
                  : "EPISODE 01 · ZERO-SHOT TOURNAMENT IN ANTIGRAVITY"}
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
                {isEp02
                  ? lang === "es"
                    ? "Gemini 4 Argon vs. Claude Opus 5.5: 6 Retos Extremos y la Factura Real"
                    : "Gemini 4 Argon vs. Claude Opus 5.5: 6 Extreme Challenges & the Real API Bill"
                  : lang === "es"
                  ? "Gemini 4 Argon vs. Gemini 3.8 Flash: 10 Retos y el Medio Pixel que Rompio un Mundo"
                  : "Gemini 4 Argon vs. Gemini 3.8 Flash: 10 Challenges & the Half Pixel That Broke a World"}
              </h1>

              {/* Scoreboard Card */}
              {isEp02 ? (
                <div className="p-5 sm:p-6 bg-[#111622] border-2 border-[#00E5FF]/30 shadow-[6px_6px_0_#040508]">
                  <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-[#2A344B]">
                    <div className="flex items-center gap-3">
                      <img
                        src="/brand/mascots/opus_star.png"
                        alt="Claude Opus 5.5"
                        className="w-12 h-12 sm:w-16 sm:h-16 shadow-[4px_4px_0_#040508] bg-[#090B10] p-1.5 border border-[#FFD100]/50 object-contain shrink-0"
                      />
                      <div>
                        <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#FFD100] uppercase">
                          Claude Opus 5.5
                        </div>
                        <div className="font-display text-2xl sm:text-4xl font-black text-[#FFD100]">
                          2
                        </div>
                        <div className="font-mono-hud text-[11px] text-[#94A3B8]">
                          159 min · $16.26 USD
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="inline-block px-3 py-1 bg-[#090B10] border border-[#2A344B] font-mono-hud text-xs font-bold text-[#00E5FF]">
                        {lang === "es" ? "MARCADOR 4 - 2" : "SCORE 4 - 2"}
                      </div>
                      <div className="font-mono-hud text-xs text-[#10B981] font-bold mt-1.5">
                        -69 MIN · -$10.00 USD
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 text-right">
                      <div>
                        <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#C084FC] uppercase">
                          Gemini 4 Argon
                        </div>
                        <div className="font-display text-2xl sm:text-4xl font-black text-[#10B981]">
                          4
                        </div>
                        <div className="font-mono-hud text-[11px] text-[#94A3B8]">
                          90 min · $6.26 USD
                        </div>
                      </div>
                      <img
                        src="/brand/mascots/argon_winner.png"
                        alt="Gemini 4 Argon"
                        className="w-12 h-12 sm:w-16 sm:h-16 shadow-[4px_4px_0_#040508] bg-[#090B10] p-1 border border-[#A855F7]/50 object-contain shrink-0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 bg-[#111622] border-2 border-[#00E5FF]/30 shadow-[6px_6px_0_#040508]">
                  <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-[#2A344B]">
                    <div className="flex items-center gap-3">
                      <img
                        src="/brand/mascots/flash_embarrassed.png"
                        alt="Gemini 3.8 Flash"
                        className="w-12 h-12 sm:w-16 sm:h-16 shadow-[4px_4px_0_#040508] bg-[#090B10] p-1 border border-[#FFD100]/40 object-contain shrink-0"
                      />
                      <div>
                        <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#FFD100] uppercase">
                          Gemini 3.8 Flash
                        </div>
                        <div className="font-display text-2xl sm:text-4xl font-black text-white">
                          0
                        </div>
                        <div className="font-mono-hud text-[11px] text-[#94A3B8]">
                          {lang === "es" ? "94 min · 8/10 func." : "94 min · 8/10 working"}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="inline-block px-3 py-1 bg-[#090B10] border border-[#2A344B] font-mono-hud text-xs font-bold text-[#00E5FF]">
                        {lang === "es" ? "MARCADOR 10 - 0" : "SCORE 10 - 0"}
                      </div>
                      <div className="font-mono-hud text-xs text-[#10B981] font-bold mt-1.5">
                        -39 MIN (-41.5%)
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 text-right">
                      <div>
                        <div className="font-mono-hud text-[10px] sm:text-xs font-bold text-[#C084FC] uppercase">
                          Gemini 4 Argon
                        </div>
                        <div className="font-display text-2xl sm:text-4xl font-black text-[#10B981]">
                          10
                        </div>
                        <div className="font-mono-hud text-[11px] text-[#94A3B8]">
                          {lang === "es" ? "55 min · 10/10 func." : "55 min · 10/10 working"}
                        </div>
                      </div>
                      <img
                        src="/brand/mascots/argon_winner.png"
                        alt="Gemini 4 Argon"
                        className="w-12 h-12 sm:w-16 sm:h-16 shadow-[4px_4px_0_#040508] bg-[#090B10] p-1 border border-[#A855F7]/50 object-contain shrink-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() =>
                    handleJumpToArena(isEp02 ? "ep02" : "ep01", 1)
                  }
                  className="px-5 py-3 shadow-[4px_4px_0_#040508] bg-[#A855F7] text-[#090B10] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                >
                  <PixelIcon name="play" size={16} />
                  <span>
                    {isEp02
                      ? lang === "es"
                        ? "Abrir los 12 Motores EP02 en la Arena"
                        : "Open the 12 EP02 Engines in the Arena"
                      : lang === "es"
                      ? "Abrir las 20 Simulaciones EP01 en la Arena"
                      : "Open the 20 EP01 Simulations in the Arena"}
                  </span>
                </button>

                <a
                  href={
                    isEp02
                      ? lang === "es"
                        ? YOUTUBE_LINKS.ep02_es
                        : YOUTUBE_LINKS.ep02_en
                      : lang === "es"
                      ? YOUTUBE_LINKS.ep01_es
                      : YOUTUBE_LINKS.ep01_en
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 shadow-[4px_4px_0_#040508] bg-[#FF3355] text-[#090B10] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition inline-flex items-center gap-2"
                >
                  <PixelIcon name="play" size={16} />
                  <span>
                    {lang === "es"
                      ? "Ver en YouTube (4K60)"
                      : "Watch on YouTube (4K60)"}
                  </span>
                  <PixelIcon name="external" size={14} />
                </a>
              </div>
            </div>

            {/* Right Video Preview */}
            <div className="lg:col-span-5 bg-[#111622] border-2 border-[#00E5FF]/30 overflow-hidden shadow-[6px_6px_0_#040508]">
              <div className="p-3 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
                <div
                  role="group"
                  aria-label={lang === "es" ? "Clip de video" : "Video clip"}
                  className="flex items-center gap-1.5"
                >
                  <button
                    onClick={() => setActiveVideoClip("hook")}
                    aria-pressed={activeVideoClip === "hook"}
                    className={`px-3 py-1 font-mono-hud text-xs font-bold cursor-pointer ${
                      activeVideoClip === "hook"
                        ? "bg-[#00E5FF] text-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8]"
                    }`}
                  >
                    {lang === "es" ? "1. Hook Oficial" : "1. Official Hook"}
                  </button>
                  <button
                    onClick={() => setActiveVideoClip("boss")}
                    aria-pressed={activeVideoClip === "boss"}
                    className={`px-3 py-1 font-mono-hud text-xs font-bold cursor-pointer ${
                      activeVideoClip === "boss"
                        ? "bg-[#FF3355] text-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8]"
                    }`}
                  >
                    {lang === "es" ? "2. Nivel Jefe" : "2. Boss Level"}
                  </button>
                </div>
                <span className="font-mono-hud text-xs text-[#00E5FF]">
                  {isEp02 ? "EP02 · 4K60" : "EP01 · 4K60"}
                  {lang === "en" && " · Spanish audio"}
                </span>
              </div>
              <div className="relative bg-black aspect-video">
                <video
                  key={`${dossierEp}-${activeVideoClip}`}
                  controls
                  playsInline
                  preload="metadata"
                  poster={
                    isEp02
                      ? "/brand/thumbs/ep02_thumb_A_1280.jpg"
                      : "/brand/thumbs/01_marcador-0-10_1280.jpg"
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
                  {/* Spanish narration: per-clip cuts of the episode VTTs,
                      offsets checked against each clip's audio pauses */}
                  <track
                    kind="captions"
                    src={`/captions/${isEp02 ? "ep02" : "ep01"}-${activeVideoClip}.es.vtt`}
                    srcLang="es"
                    label="Español"
                    default
                  />
                </video>
              </div>
              {/* The clips exist only in Spanish: point English visitors to the English cut */}
              {lang === "en" && (
                <div className="px-3 py-2.5 bg-[#1A2132] border-t border-[#2A344B] font-mono-hud text-xs">
                  <a
                    href={isEp02 ? YOUTUBE_LINKS.ep02_en : YOUTUBE_LINKS.ep01_en}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00E5FF] hover:text-white inline-flex items-center gap-1.5"
                  >
                    <PixelIcon name="play" size={12} />
                    <span>Watch in English on YouTube</span>
                    <PixelIcon name="external" size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Comparative Matrix Table for EP02 or EP01 */}
          <div className="bg-[#111622] border-2 border-[#00E5FF]/25 overflow-hidden shadow-[4px_4px_0_#040508]">
            <div className="p-5 bg-[#1A2132] border-b border-[#2A344B]">
              <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                {isEp02
                  ? lang === "es"
                    ? "Matriz Comparativa EP02: Tiempo, FPS, Tokens y Costo en USD"
                    : "EP02 Comparative Matrix: Time, FPS, Tokens & USD Cost"
                  : lang === "es"
                  ? "Matriz Comparativa EP01: 10 Retos Zero-Shot"
                  : "EP01 Comparative Matrix: 10 Zero-Shot Challenges"}
              </h2>
            </div>
            <PixelSwipeHint label={lang === "es" ? "Desliza para ver todas las columnas" : "Swipe to see every column"} />
            <div className={PIN_SCROLLER}>
              {isEp02 ? (
                <table className={`w-full min-w-[600px] sm:min-w-[860px] text-left border-collapse ${PIN_TABLE}`}>
                  <thead>
                    <tr className="bg-[#090B10] border-b border-[#2A344B] font-mono-hud text-[11px] uppercase text-[#94A3B8]">
                      <th className="py-3.5 px-4 hidden sm:table-cell">#</th>
                      {/* The stack line under each name shows from sm up, and so does its header word */}
                      <th className={`py-3.5 px-4 ${PIN_BAR_CELL}`}>
                        {lang === "es" ? "Reto" : "Challenge"}
                        <span className="hidden sm:inline">
                          {lang === "es" ? " y Stack" : " & Stack"}
                        </span>
                      </th>
                      <th className={`py-3.5 px-4 text-[#FFD100] ${SNAP_COL}`}>
                        Claude Opus 5.5
                      </th>
                      <th className={`py-3.5 px-4 text-[#FFD100] ${SNAP_COL}`}>
                        Opus Tokens / USD
                      </th>
                      <th className={`py-3.5 px-4 text-[#C084FC] ${SNAP_COL}`}>
                        Gemini 4 Argon
                      </th>
                      <th className={`py-3.5 px-4 text-[#C084FC] ${SNAP_COL}`}>
                        Argon Tokens / USD
                      </th>
                      <th className={`py-3.5 px-4 ${SNAP_COL}`}>
                        {lang === "es" ? "Ganador" : "Winner"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A344B] text-xs sm:text-sm">
                    {EP02_CHALLENGES.map((ch) => (
                      <tr
                        key={ch.n}
                        onClick={() => handleJumpToArena("ep02", ch.n)}
                        className="group/row hover:bg-[#1A2132] transition cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono-hud font-bold text-[#00E5FF] hidden sm:table-cell">
                          0{ch.n}
                        </td>
                        <td className={`py-3.5 px-4 ${pinCell()}`}>
                          <div className="font-bold text-white">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="hidden sm:block text-xs text-[#94A3B8]">
                            {lang === "en" ? (ch.tech_en ?? ch.tech) : ch.tech}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#FFD100]">
                          {ch.time_min.opus} min · {ch.fps.opus}
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#FFD100]">
                          ${ch.cost_usd.opus.toFixed(2)} USD (
                          {ch.tokens.opus_total})
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#C084FC]">
                          {ch.time_min.argon} min · {ch.fps.argon}
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#10B981]">
                          ${ch.cost_usd.argon.toFixed(2)} USD (
                          {ch.tokens.argon_total})
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud font-bold">
                          {ch.winner === "argon" ? (
                            <span className="text-[#10B981]">ARGON</span>
                          ) : (
                            <span className="text-[#FFD100]">
                              OPUS 5.5
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className={`w-full min-w-[470px] sm:min-w-[680px] text-left border-collapse ${PIN_TABLE}`}>
                  <thead>
                    <tr className="bg-[#090B10] border-b border-[#2A344B] font-mono-hud text-[11px] uppercase text-[#94A3B8]">
                      <th className="py-3.5 px-4 hidden sm:table-cell">#</th>
                      <th className={`py-3.5 px-4 ${PIN_BAR_CELL}`}>
                        {lang === "es" ? "Reto" : "Challenge"}
                      </th>
                      <th className={`py-3.5 px-4 text-[#FFD100] ${SNAP_COL}`}>
                        Gemini 3.8 Flash
                      </th>
                      <th className={`py-3.5 px-4 text-[#C084FC] ${SNAP_COL}`}>
                        Gemini 4 Argon
                      </th>
                      <th className={`py-3.5 px-4 ${SNAP_COL}`}>
                        {lang === "es" ? "Relacion" : "Speed ratio"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A344B] text-xs sm:text-sm">
                    {CHALLENGES.map((ch) => (
                      <tr
                        key={ch.n}
                        onClick={() => handleJumpToArena("ep01", ch.n)}
                        className="group/row hover:bg-[#1A2132] transition cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono-hud font-bold text-[#00E5FF] hidden sm:table-cell">
                          {String(ch.n).padStart(2, "0")}
                        </td>
                        <td className={`py-3.5 px-4 font-bold text-white ${pinCell()}`}>
                          {lang === "es" ? ch.name_es : ch.name_en}
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#FFD100]">
                          {ch.time_min.flash} min (
                          {ch.code_stats.flash_lines} loc)
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#C084FC]">
                          {ch.time_min.argon} min (
                          {ch.code_stats.argon_lines} loc)
                        </td>
                        <td className="py-3.5 px-4 font-mono-hud text-[#10B981]">
                          {lang === "en"
                            ? (ch.speed_ratio_en ?? ch.speed_ratio)
                            : ch.speed_ratio}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
