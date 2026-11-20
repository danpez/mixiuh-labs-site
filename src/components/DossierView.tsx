"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CHALLENGES } from "@/data/labsData";
import { EP02_CHALLENGES } from "@/data/ep02Data";
import { EP03_CHALLENGES, EP03_HONESTY_NOTES } from "@/data/ep03Data";
import { EP04_BENCHMARK_TOTALS, EP04_CHALLENGES } from "@/data/ep04Data";
import { EP05_BENCHMARK_TOTALS, EP05_CHALLENGES } from "@/data/ep05Data";
import { EP06_BENCHMARK_TOTALS, EP06_CHALLENGES } from "@/data/ep06Data";
import { EP07_BENCHMARK_TOTALS, EP07_CHALLENGES } from "@/data/ep07Data";
import { EP08_BENCHMARK_TOTALS, EP08_CHALLENGES } from "@/data/ep08Data";
import { EP09_BENCHMARK_TOTALS, EP09_CHALLENGES } from "@/data/ep09Data";
import { EP10_BENCHMARK_TOTALS, EP10_CHALLENGES } from "@/data/ep10Data";
import {
  EP11_BENCHMARK_TOTALS,
  EP11_CHALLENGES,
  EP11_THINKING_LEVELS,
} from "@/data/ep11Data";
import { EP12_BENCHMARK_TOTALS, EP12_CHALLENGES } from "@/data/ep12Data";
import {
  EP13_BENCHMARK_TOTALS,
  EP13_CHALLENGES,
  EP13_PERIODIC_TIERS,
  EP13_R04_MODULAR,
  EP13_SUBSCRIPTION_PLANS,
} from "@/data/ep13Data";
import { EP14_BENCHMARK_TOTALS, EP14_CHALLENGES } from "@/data/ep14Data";
import { YOUTUBE_LINKS } from "@/data/glossary";
import type { ReleasedState } from "@/data/releaseSchedule";
import {
  PixelCopyButton,
  PixelIcon,
  PixelSwipeHint,
  PixelTabs,
  type PixelSoundName,
} from "@mixiuh/pixel-ui";

export type DossierEpisode =
  | "ep14"
  | "ep13"
  | "ep12"
  | "ep11"
  | "ep10"
  | "ep09"
  | "ep08"
  | "ep07"
  | "ep06"
  | "ep05"
  | "ep04"
  | "ep03"
  | "ep02"
  | "ep01";
export type Ep14Mode = "arena" | "split" | "astra62" | "fable52";
export type Ep13Mode = "triple" | "neon" | "argon" | "hydrogen";
export type Ep12Mode =
  | "arena"
  | "triple"
  | "hydrogen"
  | "haiku"
  | "haiku_rescue"
  | "luna";
export type Ep11Mode = "arena" | "split" | "hydrogen" | "flash" | "levels";
export type Ep10Mode = "arena" | "split" | "carbon" | "fable52";
export type Ep09Mode = "split" | "fable52" | "opus55";
export type Ep08Mode = "split" | "carbon" | "argon" | "recovery";
export type Ep07Mode = "triple" | "omni12" | "omni11" | "veo31q" | "contact";
export type Ep06Mode = "arena" | "triple" | "argon" | "opus" | "astra";
export type Ep05Mode = "triple" | "argon" | "opus" | "astra" | "rescue";
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
  ep14ChallengeN?: number;
  setEp14ChallengeN?: (n: number) => void;
  ep13ChallengeN?: number;
  setEp13ChallengeN?: (n: number) => void;
  ep12ChallengeN?: number;
  setEp12ChallengeN?: (n: number) => void;
  ep11ChallengeN?: number;
  setEp11ChallengeN?: (n: number) => void;
  ep10ChallengeN?: number;
  setEp10ChallengeN?: (n: number) => void;
  ep09ChallengeN?: number;
  setEp09ChallengeN?: (n: number) => void;
  ep08ChallengeN?: number;
  setEp08ChallengeN?: (n: number) => void;
  ep07ChallengeN?: number;
  setEp07ChallengeN?: (n: number) => void;
  ep06ChallengeN?: number;
  setEp06ChallengeN?: (n: number) => void;
  ep05ChallengeN?: number;
  setEp05ChallengeN?: (n: number) => void;
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
/**
 * Scroller: snaps value columns to the right edge of the 120px pinned column.
 * Its keyboard focus ring sits just inside its edge from sm up; on phones the
 * pinned column would paint over that, so there the ring is drawn just outside
 * the edge, over the card's border (PIN_CARD_OVERFLOW leaves it unclipped).
 */
const PIN_SCROLLER =
  "overflow-x-auto max-sm:snap-x max-sm:scroll-pl-30 " +
  "sm:focus-visible:outline-offset-[-3px] max-sm:focus-visible:outline-offset-0";
/** Card around a pinned table: it clips its overflow from sm up only. */
const PIN_CARD_OVERFLOW = "overflow-hidden max-sm:overflow-visible";
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
 * Sideways scroller of a results table. As in PixelDataTable, it becomes a
 * focusable region named after its table only while the table overflows it,
 * so keyboard users can scroll it too.
 */
function TableScroller({ label, children }: { label: string; children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      setOverflowing(scroller.scrollWidth > scroller.clientWidth + 1);
    });
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={scrollRef}
      role={overflowing ? "region" : undefined}
      aria-label={overflowing ? label : undefined}
      tabIndex={overflowing ? 0 : undefined}
      className={PIN_SCROLLER}
    >
      {children}
    </div>
  );
}

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
  ep14ChallengeN = 1,
  setEp14ChallengeN = () => {},
  ep13ChallengeN = 1,
  setEp13ChallengeN = () => {},
  ep12ChallengeN = 1,
  setEp12ChallengeN = () => {},
  ep11ChallengeN = 1,
  setEp11ChallengeN = () => {},
  ep10ChallengeN = 1,
  setEp10ChallengeN = () => {},
  ep09ChallengeN = 1,
  setEp09ChallengeN = () => {},
  ep08ChallengeN = 3,
  setEp08ChallengeN = () => {},
  ep07ChallengeN = 1,
  setEp07ChallengeN = () => {},
  ep06ChallengeN = 1,
  setEp06ChallengeN = () => {},
  ep05ChallengeN = 1,
  setEp05ChallengeN = () => {},
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
  const [ep14Mode, setEp14Mode] = useState<Ep14Mode>("arena");
  const [ep13Mode, setEp13Mode] = useState<Ep13Mode>("triple");
  const [ep12Mode, setEp12Mode] = useState<Ep12Mode>("arena");
  const [ep11Mode, setEp11Mode] = useState<Ep11Mode>("arena");
  const [ep11LevelKey, setEp11LevelKey] = useState<"low" | "medium" | "high" | "xhigh">("xhigh");
  const [ep10Mode, setEp10Mode] = useState<Ep10Mode>("arena");
  const [ep09Mode, setEp09Mode] = useState<Ep09Mode>("split");
  const [ep08Mode, setEp08Mode] = useState<Ep08Mode>("recovery");
  const [ep07Mode, setEp07Mode] = useState<Ep07Mode>("triple");
  const [ep06Mode, setEp06Mode] = useState<Ep06Mode>("arena");
  const [ep05Mode, setEp05Mode] = useState<Ep05Mode>("triple");
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
              ? "Bitacora de Benchmarks, Dossiers Tecnicos y Pruebas en Vivo (EP01 – EP14)"
              : "Benchmark Log, Technical Dossiers & Live Tests (EP01 – EP14)"}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {released.ep14 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep14");
              }}
              aria-pressed={dossierEp === "ep14"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep14"
                  ? "bg-[#182235] border-[#FB7185]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#FB7185]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#FB7185] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 14 · ASTRA VS FABLE" : "DISK 14 · ASTRA VS FABLE"}
                </span>
                <span className="text-[#FB7185]">
                  5-4 · $13.92 vs $55.18
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "GPT-6.2 Astra vs Fable 5.2 (15 Demos + 3 Arenas)"
                  : "GPT-6.2 Astra vs Fable 5.2 (15 Demos + 3 Arenas)"}
              </div>
            </button>
          )}

          {released.ep13 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep13");
              }}
              aria-pressed={dossierEp === "ep13"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep13"
                  ? "bg-[#182235] border-[#22D3EE]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#22D3EE]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#22D3EE] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 13 · GEMINI 4" : "DISK 13 · GEMINI 4"}
                </span>
                <span className="text-[#22D3EE]">
                  1-1-1 · ORCH 11.8m vs 22.2m
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Ecosistema Gemini 4 + Orchestrator (11 Demos)"
                  : "Gemini 4 Ecosystem + Orchestrator (11 Demos)"}
              </div>
            </button>
          )}

          {released.ep12 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep12");
              }}
              aria-pressed={dossierEp === "ep12"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep12"
                  ? "bg-[#182235] border-[#10B981]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#10B981]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#10B981] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 12 · LIGEROS" : "DISK 12 · LITE EXTRA"}
                </span>
                <span className="text-[#10B981]">
                  6-2-4 · $2.26 / $1.66 / $0.17
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Hydrogen vs Haiku vs Luna (Extra · 24 Demos)"
                  : "Hydrogen vs Haiku vs Luna (Extra · 24 Demos)"}
              </div>
            </button>
          )}

          {released.ep11 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep11");
              }}
              aria-pressed={dossierEp === "ep11"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep11"
                  ? "bg-[#182235] border-[#38BDF8]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#38BDF8]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#38BDF8] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 11 · HYDROGEN" : "DISK 11 · HYDROGEN"}
                </span>
                <span className="text-[#38BDF8]">
                  7-2 · $3.22 vs $0.58
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Gemini 4 Hydrogen vs Flash 3.8 (18 Demos)"
                  : "Gemini 4 Hydrogen vs Flash 3.8 (18 Demos)"}
              </div>
            </button>
          )}

          {released.ep10 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep10");
              }}
              aria-pressed={dossierEp === "ep10"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep10"
                  ? "bg-[#182235] border-[#FFD100]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#FFD100]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#FFD100] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 10 · FINAL" : "DISK 10 · FINALE"}
                </span>
                <span className="text-[#FFD100]">
                  7-3 · $8.20 vs $23.35
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Carbon vs Fable 5.2 (16 Demos + Arenas)"
                  : "Carbon vs Fable 5.2 (16 Demos + Arenas)"}
              </div>
            </button>
          )}

          {released.ep09 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep09");
              }}
              aria-pressed={dossierEp === "ep09"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep09"
                  ? "bg-[#182235] border-[#FB923C]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#FB923C]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#FB923C] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 09 · NUEVO" : "DISK 09 · NEW"}
                </span>
                <span className="text-[#FFD100]">
                  3-1 · $17.70 vs $16.33
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Claude Fable 5.2 vs Opus 5.5"
                  : "Claude Fable 5.2 vs Opus 5.5"}
              </div>
            </button>
          )}

          {released.ep08 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep08");
              }}
              aria-pressed={dossierEp === "ep08"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep08"
                  ? "bg-[#182235] border-[#38BDF8]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#38BDF8]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#38BDF8] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 08 · +RESCATE" : "DISK 08 · +RESCUE"}
                </span>
                <span className="text-[#FFD100]">
                  3-1 · $5.36 vs $2.90
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Gemini 4 Carbon en Vivo + Recuperacion"
                  : "Gemini 4 Carbon Live + Recovery Round"}
              </div>
            </button>
          )}

          {released.ep07 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep07");
              }}
              aria-pressed={dossierEp === "ep07"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep07"
                  ? "bg-[#182235] border-[#38BDF8]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#38BDF8]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#38BDF8] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 07 · OMNI 1.2" : "DISK 07 · OMNI 1.2"}
                </span>
                <span className="text-[#FFD100]">
                  4-0 · $2.71 vs $12.80
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Gemini Omni 1.2 Flash vs 1.1 vs Veo 3.1"
                  : "Gemini Omni 1.2 Flash vs 1.1 vs Veo 3.1"}
              </div>
            </button>
          )}

          {released.ep06 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep06");
              }}
              aria-pressed={dossierEp === "ep06"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep06"
                  ? "bg-[#182235] border-[#00E5FF]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#00E5FF]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#00E5FF] text-[#090B10] font-bold">
                  {lang === "es" ? "DISK 06 · NUEVO" : "DISK 06 · NEW"}
                </span>
                <span className="text-[#FFD100]">
                  5-4-1 · $1.13 vs $17.99
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Clasicos + Arena IA en Vivo (20 Juegos)"
                  : "Classics + Live AI Arena (20 Games)"}
              </div>
            </button>
          )}

          {released.ep05 && (
            <button
              onClick={() => {
                playSfx("cartridgeInsert");
                selectDossierEp("ep05");
              }}
              aria-pressed={dossierEp === "ep05"}
              className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                dossierEp === "ep05"
                  ? "bg-[#182235] border-[#10B981]"
                  : "bg-[#090B10] border-[#2A344B] hover:border-[#10B981]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-pixel text-[10px]">
                <span className="px-1.5 py-0.5 whitespace-nowrap bg-[#10B981] text-[#090B10] font-bold">
                  DISK 05
                </span>
                <span className="text-[#FFD100]">
                  3-2-1 · $1.51 vs $32.75
                </span>
              </div>
              <div className="font-display text-sm font-black text-white mt-2 truncate">
                {lang === "es"
                  ? "Torneo 3 Gigantes: Argon vs Opus vs Astra"
                  : "3 Giants Tournament: Argon vs Opus vs Astra"}
              </div>
            </button>
          )}

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
                  DISK 04
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
          SUB-DOSSIER EPISODIO 14 (GPT-6.2 ASTRA VS CLAUDE FABLE 5.2)
         ----------------------------------------------------------------- */}
      {released.ep14 && dossierEp === "ep14" && (
        <div id="ep14-astra-vs-fable" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #FB7185" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FB7185] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "EPISODIO 14 · MISMO PRECIO API $8/$40 · 12 BUILDS ZERO-SHOT + 3 ARENAS IA VS IA (9 PUNTOS)"
                : "EPISODE 14 · IDENTICAL $8/$40 API TIER · 12 ZERO-SHOT BUILDS + 3 LIVE AI ARENAS (9 POINTS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "GPT-6.2 Astra (xHigh) vs Claude Fable 5.2 (High): Empate de Precio ($8/$40), Remontada de Arena y Marcador 5 a 4"
                : "GPT-6.2 Astra (xHigh) vs Claude Fable 5.2 (High): Same $8/$40 Rate, Arena Comeback & 5-4 Finale"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Duelo directo al mismo precio de API ($8 entrada / $40 salida por millon) entre GPT-6.2 Astra y Claude Fable 5.2 en 6 simulaciones 3D y de ingenieria sin edicion manual, mas 3 arenas autonomas donde ambos cerebros compiten a 1080p60. Astra 6.2 domino la fase visual 5 a 1 por solo $13.92 USD en 90.15 min (3,272 LOC); Fable 5.2 barrio 3 a 0 las arenas en vivo para cerrar 5 a 4 ($55.18 USD en 188.50 min y 6,452 LOC, incluyendo $11.50 USD / 47.1 min perdidos por bloqueos del filtro [reasoning_extraction] en R01 y R05 antes de rescatarlos en Medium)."
                : "Head-to-head clash at identical $8 in / $40 out per 1M API pricing between GPT-6.2 Astra and Claude Fable 5.2 across 6 unedited zero-shot 3D/physics builds plus 3 live 1080p60 AI arenas. Astra 6.2 dominated Phase A visuals 5-1 for just $13.92 USD in 90.15 min (3,272 LOC); Fable 5.2 swept Phase B live arenas 3-0 to force a razor-thin 5-4 final ($55.18 USD across 188.50 min and 6,452 LOC, transparently including $11.50 / 47.1 min from attempt-1 [reasoning_extraction] safeguard refusals on R01 & R05 prior to Medium rescue)."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "GANADOR GLOBAL (5 PTS)" : "OVERALL WINNER (5 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  GPT-6.2 Astra
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP14_BENCHMARK_TOTALS.astra62_min}&nbsp;min · ${EP14_BENCHMARK_TOTALS.astra62_usd.toFixed(2)} USD · 5 Fase A + 0 Arena
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FB923C] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FB923C] font-bold">
                  {lang === "es" ? "CAMPEON DE ARENAS (4 PTS)" : "ARENA SWEEPER (4 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Claude Fable 5.2
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP14_BENCHMARK_TOTALS.fable52_min}&nbsp;min · ${EP14_BENCHMARK_TOTALS.fable52_usd.toFixed(2)} USD · 1 Fase A + 3 Arena
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FB7185] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FB7185] font-bold">
                  {lang === "es" ? "BLOQUEO SAFEGUARD (2 RESCATES)" : "SAFEGUARD LOG (2 RESCUES)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  +$11.50 / 47.1m
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es"
                    ? "Fable rechazo R01 y R05 en High -> rescate Medium OK"
                    : "Fable blocked on R01/R05 High -> rescued at Medium"}
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#22D3EE] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#22D3EE] font-bold">
                  {lang === "es" ? "AUDITORIA 1080P60 CHROME" : "CHROME 1080P60 AUDIT"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  15 Demos · 0 Emojis
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "12 builds + 3 arenas en JSON verificados" : "12 builds + 3 arenas logged in JSON"}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#FB7185]">
                {lang === "es"
                  ? "TABLA OFICIAL EP14 (6 RETOS FASE A + 3 ARENAS IA VS IA · HAZ CLIC EN CUALQUIER FILA)"
                  : "OFFICIAL EP14 TABLE (6 PHASE A BUILDS + 3 LIVE AI ARENAS · CLICK ANY ROW)"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 font-mono-hud text-xs">
                <a
                  href="/demos/ep14-astra-6-2-vs-fable-5-2/logs/benchmark_results_ep14.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#10B981] font-bold underline"
                >
                  benchmark_results_ep14.json ↗
                </a>
                <a
                  href="/demos/ep14-astra-6-2-vs-fable-5-2/logs/arena_summary_ep14.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22D3EE] font-bold underline"
                >
                  arena_summary_ep14.json ↗
                </a>
                <span className="text-[#FB7185] font-bold">
                  {lang === "es" ? "FINAL: ASTRA [5] - [4] FABLE" : "FINAL: ASTRA [5] - [4] FABLE"}
                </span>
              </div>
            </div>
            <TableScroller label="EP14 Astra 6.2 vs Fable 5.2 Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "RETO / DATO CURIOSO" : "CHALLENGE / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#10B981] ${SNAP_COL}`}>GPT-6.2 ASTRA ($8/$40)</th>
                    <th className={`py-3 px-4 text-[#FB923C] ${SNAP_COL}`}>CLAUDE FABLE 5.2 ($8/$40)</th>
                    <th className={`py-3 px-4 text-[#FB7185] ${SNAP_COL}`}>
                      {lang === "es" ? "VEREDICTO (FASE A + ARENA)" : "VERDICT (PHASE A + ARENA)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP14_CHALLENGES.map((ch) => {
                    const selected = ep14ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp14ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#FB7185] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#10B981]">
                            {ch.astra62.min}&nbsp;min · ${ch.astra62.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.astra62.fps, ch.astra62.fps_en)} · {ch.astra62.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#FB923C]">
                            {ch.fable52.min}&nbsp;min · ${ch.fable52.usd.toFixed(2)} USD
                            {ch.fable52.rescued ? (lang === "es" ? " (Rescate)" : " (Rescued)") : ""}
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.fable52.fps, ch.fable52.fps_en)} · {ch.fable52.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FB7185]">
                          <div>{lang === "es" ? ch.winner_label_es : ch.winner_label_en}</div>
                          {ch.arena && (
                            <div className="text-[11px] text-[#22D3EE] mt-0.5">
                              {lang === "es" ? ch.arena.score_es : ch.arena.score_en}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur =
              EP14_CHALLENGES.find((c) => c.n === ep14ChallengeN) || EP14_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            const activeMode: Ep14Mode = !cur.arena && ep14Mode === "arena" ? "split" : ep14Mode;
            return (
              <div className="bg-[#111622] border-2 border-[#FB7185] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#FB7185]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                    <p className="text-xs text-[#CBD5E1] mt-1">
                      {lang === "es" ? cur.verdict_es : cur.verdict_en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {cur.arena && (
                      <button
                        onClick={() => setEp14Mode("arena")}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === "arena"
                            ? "bg-[#FB7185] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {lang === "es" ? "ARENA IA VS IA EN VIVO" : "LIVE AI VS AI ARENA"}
                      </button>
                    )}
                    {(["split", "astra62", "fable52"] as Ep14Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp14Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === m
                            ? "bg-[#22D3EE] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "split"
                          ? lang === "es"
                            ? "LADO A LADO"
                            : "SIDE BY SIDE"
                          : m === "astra62"
                          ? "GPT-6.2 ASTRA"
                          : "CLAUDE FABLE 5.2"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep14", cur.n)}
                      className="px-3 py-1.5 bg-[#10B981] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {activeMode === "arena" && cur.arena ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                      <span className="text-[#FB7185] font-bold">
                        {lang === "es" ? cur.arena.summary_es : cur.arena.summary_en}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <a
                          href={cur.arena.logUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] font-bold underline"
                        >
                          {lang === "es" ? "Arena JSON Verificado ↗" : "Verified Arena JSON ↗"}
                        </a>
                        <a
                          href={cur.arena.arenaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#22D3EE] font-bold underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                    </div>
                    <iframe
                      allowFullScreen
                      src={cur.arena.arenaUrl}
                      title={`EP14 Arena: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                ) : activeMode === "split" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#10B981] font-bold">
                          GPT-6.2 ASTRA (${cur.astra62.usd.toFixed(2)} · {cur.astra62.min}m)
                        </span>
                        <a href={cur.astra62.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#10B981] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.astra62.demoUrl} title={`Astra 6.2: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#FB923C] font-bold">
                          CLAUDE FABLE 5.2 (${cur.fable52.usd.toFixed(2)} · {cur.fable52.min}m)
                        </span>
                        <a href={cur.fable52.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FB923C] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.fable52.demoUrl} title={`Fable 5.2: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={activeMode === "astra62" ? cur.astra62.demoUrl : cur.fable52.demoUrl}
                    title={`${activeMode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 13 (ECOSISTEMA GEMINI 4 NEON + ORCHESTRATOR)
         ----------------------------------------------------------------- */}
      {released.ep13 && dossierEp === "ep13" && (
        <div id="ep13-ecosistema-gemini-4-neon" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #22D3EE" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22D3EE] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "EPISODIO 13 · GUIA COMPLETA GEMINI 4 + 3 RETOS SOLO + RETO 4 MODULAR ORCHESTRATOR (11 DEMOS)"
                : "EPISODE 13 · COMPLETE GEMINI 4 ECOSYSTEM + 3 SOLO BUILDS + MODULAR ORCHESTRATOR (11 DEMOS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Ecosistema Gemini 4 (Hydrogen, Neon, Argon, Carbon), Suscripciones y Orchestrator en Antigravity"
                : "The Full Gemini 4 Ecosystem (Hydrogen, Neon, Argon, Carbon), Subscriptions & Antigravity Orchestrator"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Guia tecnica verificada del cambio completo en Google Gemini 4 tras el estreno de Neon (18 nov 2026) y el cierre de tarifa intro de Argon/Carbon (30 nov -> doble el 1 dic). En los 3 retos de fisica extrema hubo empate triple 1-1-1 (Argon en levitacion 40 kHz, Neon en origami NASA Miura-ori 64 paneles e Hydrogen en litografia EUV 2 nm con 11.82 min totales), y en el Reto 4 modular de la Rueda de Falkirk, Orchestrator (Neon) paso 6/6 pruebas en la mitad de tiempo que Neon Solo (11.75 min vs 22.23 min)."
                : "Verified technical guide to Google's November 2026 Gemini 4 reshuffle after Neon's launch (Nov 18) and ahead of Argon/Carbon's Dec 1 doubling. Across 3 extreme physics builds it tied 1-1-1 (Argon levitation, Neon 64-facet Miura-ori origami, Hydrogen clean 2 nm EUV in 11.82m total), while on Challenge 4 modular Falkirk Wheel, Orchestrator (Neon) passed 6/6 automated tests in half Neon Solo's wall time (11.75 min vs 22.23 min)."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {EP13_PERIODIC_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="p-4 bg-[#090B10] border-2 shadow-[4px_4px_0_#040508] space-y-1.5"
                  style={{ borderColor: tier.accentHex }}
                >
                  <div className="font-pixel text-[10px] font-bold" style={{ color: tier.accentHex }}>
                    {tier.aaScore}
                  </div>
                  <div className="font-display text-lg font-black text-white">
                    {tier.name}
                  </div>
                  <div className="text-[11px] font-bold text-[#FFD100]">
                    {lang === "es" ? tier.role_es : tier.role_en}
                  </div>
                  <div className="font-mono-hud text-[11px] text-[#CBD5E1]">
                    {lang === "es" ? tier.apiPrice_es : tier.apiPrice_en}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {lang === "es" ? tier.subTier_es : tier.subTier_en}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#22D3EE]">
                {lang === "es"
                  ? "PLANES Y SUSCRIPCIONES OFICIALES GOOGLE AI (NOVIEMBRE 2026)"
                  : "OFFICIAL GOOGLE AI SUBSCRIPTIONS MATRIX (NOVEMBER 2026)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FB923C]">
                {lang === "es" ? "PRECIO INTRO ARGON/CARBON HASTA 30 NOV" : "ARGON/CARBON INTRO RATE THRU NOV 30"}
              </span>
            </div>
            <TableScroller label="EP13 Subscriptions">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4">{lang === "es" ? "PLAN" : "TIER"}</th>
                    <th className="py-3 px-4">{lang === "es" ? "PRECIO" : "PRICE"}</th>
                    <th className="py-3 px-4">{lang === "es" ? "NUBE" : "STORAGE"}</th>
                    <th className="py-3 px-4">FLOW</th>
                    <th className="py-3 px-4">{lang === "es" ? "MODELOS INCLUIDOS" : "INCLUDED MODELS"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP13_SUBSCRIPTION_PLANS.map((sp) => (
                    <tr key={sp.plan} className="hover:bg-[#1A2132]/70">
                      <td className="py-2.5 px-4 font-bold text-white">{sp.plan}</td>
                      <td className="py-2.5 px-4 font-bold text-[#FFD100]">{sp.price}</td>
                      <td className="py-2.5 px-4 text-[#CBD5E1]">{sp.storage}</td>
                      <td className="py-2.5 px-4 text-[#38BDF8]">{sp.flowCredits}</td>
                      <td className="py-2.5 px-4 text-[#10B981]">
                        {lang === "es" ? sp.models_es : sp.models_en}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroller>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#22D3EE]">
                {lang === "es"
                  ? "TABLA EMPIRICA R01-R03 (NEON VS ARGON VS HYDROGEN · CLIC PARA PROBAR)"
                  : "EMPIRICAL R01-R03 BENCHMARK (NEON VS ARGON VS HYDROGEN · CLICK ANY ROW)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es"
                  ? `EMPATE 1-1-1 · TOTALES: NEON $${EP13_BENCHMARK_TOTALS.neon_usd.toFixed(2)} | ARGON $${EP13_BENCHMARK_TOTALS.argon_usd.toFixed(2)} | HYDROGEN $${EP13_BENCHMARK_TOTALS.hydrogen_usd.toFixed(2)}`
                  : `1-1-1 TIE · TOTALS: NEON $${EP13_BENCHMARK_TOTALS.neon_usd.toFixed(2)} | ARGON $${EP13_BENCHMARK_TOTALS.argon_usd.toFixed(2)} | HYDROGEN $${EP13_BENCHMARK_TOTALS.hydrogen_usd.toFixed(2)}`}
              </span>
            </div>
            <TableScroller label="EP13 Solo 3-Way Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>{lang === "es" ? "RETO / DATO REAL" : "CHALLENGE / FACT"}</th>
                    <th className={`py-3 px-4 text-[#22D3EE] ${SNAP_COL}`}>NEON ($3/$15)</th>
                    <th className={`py-3 px-4 text-[#B794F6] ${SNAP_COL}`}>ARGON ($2/$10)</th>
                    <th className={`py-3 px-4 text-[#38BDF8] ${SNAP_COL}`}>HYDROGEN ($1.5/$7.5)</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>{lang === "es" ? "GANADOR" : "WINNER"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP13_CHALLENGES.map((ch) => {
                    const selected = ep13ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp13ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#22D3EE] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#22D3EE]">{ch.neon.min}m · ${ch.neon.usd.toFixed(2)}</div>
                          <div className="text-[11px] text-[#CBD5E1]">{fpsNote(ch.neon.fps, ch.neon.fps_en)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#B794F6]">{ch.argon.min}m · ${ch.argon.usd.toFixed(2)}</div>
                          <div className="text-[11px] text-[#CBD5E1]">{fpsNote(ch.argon.fps, ch.argon.fps_en)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#38BDF8]">{ch.hydrogen.min}m · ${ch.hydrogen.usd.toFixed(2)}</div>
                          <div className="text-[11px] text-[#CBD5E1]">{fpsNote(ch.hydrogen.fps, ch.hydrogen.fps_en)}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          {lang === "es" ? ch.winner_label_es : ch.winner_label_en}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur = EP13_CHALLENGES.find((c) => c.n === ep13ChallengeN) || EP13_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            return (
              <div className="bg-[#111622] border-2 border-[#22D3EE] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#22D3EE]">{lang === "es" ? cur.world_es : cur.world_en}</div>
                    <h3 className="font-display text-xl font-black text-white mt-1">0{cur.n}. {name}</h3>
                    <p className="text-xs text-[#CBD5E1] mt-1">{lang === "es" ? cur.verdict_es : cur.verdict_en}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {(["triple", "neon", "argon", "hydrogen"] as Ep13Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp13Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          ep13Mode === m ? "bg-[#22D3EE] text-[#090B10] border-[#090B10]" : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "triple" ? (lang === "es" ? "3 MODELOS LADO A LADO" : "3 BUILDS SIDE BY SIDE") : m.toUpperCase()}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep13", cur.n)}
                      className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>
                {ep13Mode === "triple" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <iframe allowFullScreen src={cur.neon.demoUrl} title={`Neon: ${name}`} className="w-full h-[500px] border-0 bg-[#090B10]" />
                    <iframe allowFullScreen src={cur.argon.demoUrl} title={`Argon: ${name}`} className="w-full h-[500px] border-0 bg-[#090B10]" />
                    <iframe allowFullScreen src={cur.hydrogen.demoUrl} title={`Hydrogen: ${name}`} className="w-full h-[500px] border-0 bg-[#090B10]" />
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={ep13Mode === "neon" ? cur.neon.demoUrl : ep13Mode === "argon" ? cur.argon.demoUrl : cur.hydrogen.demoUrl}
                    title={`${ep13Mode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}

          <div className="bg-[#111622] border-2 border-[#FFD100] shadow-[6px_6px_0_#040508] overflow-hidden">
            <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-pixel text-[10px] text-[#FFD100]">
                  {lang === "es"
                    ? "RETO 04 MODULAR (4 ARCHIVOS ES + SUITE TESTS.MJS) · ANTIGRAVITY ORCHESTRATOR VS NEON SOLO"
                    : "CHALLENGE 04 MODULAR (4 ES FILES + TESTS.MJS) · ANTIGRAVITY ORCHESTRATOR VS NEON SOLO"}
                </div>
                <h3 className="font-display text-xl font-black text-white mt-1">
                  04. {lang === "es" ? EP13_R04_MODULAR.name_es : EP13_R04_MODULAR.name_en}
                </h3>
                <p className="text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? EP13_R04_MODULAR.verdict_es : EP13_R04_MODULAR.verdict_en}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono-hud text-xs">
                <a href="/demos/ep13-ecosistema-gemini-4-neon/logs/orchestrator_results_ep13.json" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#131824] text-[#10B981] border border-[#10B981]/50 font-bold">
                  {lang === "es" ? "Ver Log Modular JSON ↗" : "View Modular JSON ↗"}
                </a>
                <button
                  onClick={() => handleJumpToArena("ep13", 4)}
                  className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                >
                  {lang === "es" ? "Abrir Duelo R04 en Arena →" : "Open R04 in Arena →"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#FFD100] font-bold">
                    ORCHESTRATOR (NEON): {EP13_R04_MODULAR.orchestrator.min}m · {lang === "es" ? EP13_R04_MODULAR.orchestrator.usdNote_es : EP13_R04_MODULAR.orchestrator.usdNote_en} · {lang === "es" ? EP13_R04_MODULAR.orchestrator.testsLabel_es : EP13_R04_MODULAR.orchestrator.testsLabel_en}
                  </span>
                  <a href={EP13_R04_MODULAR.orchestrator.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FFD100] underline">
                    {lang === "es" ? "Abrir ↗" : "Open ↗"}
                  </a>
                </div>
                <iframe allowFullScreen src={EP13_R04_MODULAR.orchestrator.demoUrl} title="Orchestrator Falkirk" className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>
              <div className="flex flex-col">
                <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#22D3EE] font-bold">
                    NEON SOLO (XHIGH): {EP13_R04_MODULAR.neon_solo.min}m · {lang === "es" ? EP13_R04_MODULAR.neon_solo.usdNote_es : EP13_R04_MODULAR.neon_solo.usdNote_en} · {lang === "es" ? EP13_R04_MODULAR.neon_solo.testsLabel_es : EP13_R04_MODULAR.neon_solo.testsLabel_en}
                  </span>
                  <a href={EP13_R04_MODULAR.neon_solo.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] underline">
                    {lang === "es" ? "Abrir ↗" : "Open ↗"}
                  </a>
                </div>
                <iframe allowFullScreen src={EP13_R04_MODULAR.neon_solo.demoUrl} title="Neon Solo Falkirk" className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 12 (TORNEO DE LOS 3 LIGEROS EN EXTRA)
         ----------------------------------------------------------------- */}
      {released.ep12 && dossierEp === "ep12" && (
        <div id="ep12-torneo-ligeros-extra" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #10B981" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "EPISODIO 12 · TORNEO DE LIGEROS EN EXTRA · 6 RETOS + 6 ARENAS TRIPLES (12 PUNTOS)"
                : "EPISODE 12 · LIGHTWEIGHT EXTRA TOURNAMENT · 6 CHALLENGES + 6 3-WAY ARENAS (12 PTS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "El Torneo de los 3 Ligeros en Extra: Gemini 4 Hydrogen ($1.50/$7.50) vs Claude Haiku 5.5 ($0.10/$0.50) vs GPT-6 Luna ($0.10/$0.50)"
                : "The 3 Lightweight Models in Extra Mode: Gemini 4 Hydrogen vs Claude Haiku 5.5 vs GPT-6 Luna"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Enfrentamos a los tres modelos rapidos de frontera llevados a su maximo nivel de razonamiento (Extra / xHigh) en 6 retos fisicos y economicos completamente nuevos, seguidos por 6 arenas todos contra todos dentro de cada simulador ganador. Gemini 4 Hydrogen se corona campeon 6 a 2 a 4 en apenas 14.5 minutos totales ($2.26 USD), GPT-6 Luna sorprende ganando 4 puntos (Air Hockey y Robot Sumo) por solo $0.17 USD en total, y Claude Haiku 5.5 queda expuesto cuando agota el techo de 256K tokens en R01 y R03 antes de rescatar sus builds en Ronda de Recuperacion."
                : "We pushed the three leading lightweight models to maximum Extra thinking across 6 brand-new physics and game-theory builds followed by 6 free-for-all AI arenas. Gemini 4 Hydrogen claims the 6-2-4 title in just 14.5 minutes ($2.26 USD), GPT-6 Luna upsets with 4 points for an astonishing $0.17 USD total bill, while Claude Haiku 5.5 burned 256K thinking tokens with zero output twice before recovery rounds unblocked it."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#38BDF8] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                  {lang === "es" ? "CAMPEON TORNEO (6 PTS)" : "TOURNAMENT WINNER (6 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini 4 Hydrogen Extra
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP12_BENCHMARK_TOTALS.hydrogen_min}&nbsp;min · ${EP12_BENCHMARK_TOTALS.hydrogen_usd.toFixed(2)} USD · {EP12_BENCHMARK_TOTALS.hydrogen_lines} LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "SORPRESA ECONOMICA (4 PTS)" : "VALUE SENSATION (4 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  GPT-6 Luna Extra
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP12_BENCHMARK_TOTALS.luna_min}&nbsp;min · ${EP12_BENCHMARK_TOTALS.luna_usd.toFixed(2)} USD · {EP12_BENCHMARK_TOTALS.luna_lines} LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FB923C] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FB923C] font-bold">
                  {lang === "es" ? "TERCER LUGAR (2 PTS + RESCATE)" : "THIRD PLACE (2 PTS + RESCUE)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Claude Haiku 5.5 Extra
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP12_BENCHMARK_TOTALS.haiku_min}&nbsp;min · ${EP12_BENCHMARK_TOTALS.haiku_usd.toFixed(2)} USD · {EP12_BENCHMARK_TOTALS.haiku_tokens}
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                  {lang === "es" ? "6 ARENAS TODOS CONTRA TODOS" : "6 FREE-FOR-ALL ARENAS"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  24 Demos + JSON
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "Mismo sandbox · 0 errores consola" : "Shared sandbox · 0 console errors"}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#10B981]">
                {lang === "es"
                  ? "TABLA OFICIAL EP12 (6 RETOS + 6 ARENAS TRIPLES + RESCATE HAIKU · CLIC EN CUALQUIER FILA)"
                  : "OFFICIAL EP12 TABLE (6 BUILDS + 6 3-WAY ARENAS + HAIKU RESCUE · CLICK ANY ROW)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es" ? "MARCADOR FINAL: HYDROGEN 6 - LUNA 4 - HAIKU 2" : "FINAL SCORE: HYDROGEN 6 - LUNA 4 - HAIKU 2"}
              </span>
            </div>
            <TableScroller label="EP12 3 Lightweight Models Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "RETO / DATO CURIOSO" : "CHALLENGE / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#38BDF8] ${SNAP_COL}`}>HYDROGEN ($1.50/$7.50)</th>
                    <th className={`py-3 px-4 text-[#FB923C] ${SNAP_COL}`}>HAIKU 5.5 ($0.10/$0.50*)</th>
                    <th className={`py-3 px-4 text-[#10B981] ${SNAP_COL}`}>GPT-6 LUNA ($0.10/$0.50)</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "GANADORES" : "WINNERS"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP12_CHALLENGES.map((ch) => {
                    const selected = ep12ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp12ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#10B981] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#38BDF8]">
                            {ch.hydrogen.min}&nbsp;min · ${ch.hydrogen.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.hydrogen.fps, ch.hydrogen.fps_en)} · {ch.hydrogen.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#FB923C]">
                            {ch.haiku.min}&nbsp;min · ${ch.haiku.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.haiku.fps, ch.haiku.fps_en)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#10B981]">
                            {ch.luna.min}&nbsp;min · ${ch.luna.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.luna.fps, ch.luna.fps_en)} · {ch.luna.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          <div>{lang === "es" ? ch.winner_label_es : ch.winner_label_en}</div>
                          <div className="text-[11px] text-[#10B981] mt-0.5">
                            {lang === "es" ? ch.arena.score_es : ch.arena.score_en}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur = EP12_CHALLENGES.find((c) => c.n === ep12ChallengeN) || EP12_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            const activeMode: Ep12Mode =
              ep12Mode === "haiku_rescue" && !cur.haiku.rescuedDemoUrl ? "haiku" : ep12Mode;
            const haikuDisplayUrl = cur.haiku.rescuedDemoUrl || cur.haiku.demoUrl;
            return (
              <div className="bg-[#111622] border-2 border-[#10B981] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#10B981]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                    <p className="text-xs text-[#FFD100] mt-1">
                      {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {(["arena", "triple", "hydrogen", "haiku", ...(cur.haiku.rescuedDemoUrl ? ["haiku_rescue"] : []), "luna"] as Ep12Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp12Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === m
                            ? "bg-[#10B981] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "arena"
                          ? lang === "es"
                            ? "ARENA 3 IAS EN VIVO"
                            : "LIVE 3-WAY ARENA"
                          : m === "triple"
                          ? lang === "es"
                            ? "3 SIMULADORES LADO A LADO"
                            : "3 BUILDS SIDE BY SIDE"
                          : m === "hydrogen"
                          ? "HYDROGEN"
                          : m === "haiku"
                          ? "HAIKU 5.5"
                          : m === "haiku_rescue"
                          ? lang === "es"
                            ? "HAIKU RESCATE"
                            : "HAIKU RESCUED"
                          : "GPT-6 LUNA"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep12", cur.n)}
                      className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {activeMode === "arena" ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                      <span className="text-[#FFD100] font-bold">
                        {lang === "es" ? cur.arena.summary_es : cur.arena.summary_en}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <a href={cur.arena.logUrl} target="_blank" rel="noopener noreferrer" className="text-[#10B981] font-bold underline">
                          {lang === "es" ? "Resumen JSON ↗" : "JSON Summary ↗"}
                        </a>
                        <a href={cur.arena.arenaUrl} target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] font-bold underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                    </div>
                    <iframe
                      allowFullScreen
                      src={cur.arena.arenaUrl}
                      title={`EP12 Arena: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                ) : activeMode === "triple" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#38BDF8] font-bold">HYDROGEN (${cur.hydrogen.usd.toFixed(2)} · {cur.hydrogen.min}m)</span>
                        <a href={cur.hydrogen.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">
                          {lang === "es" ? "Abrir ↗" : "Open ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.hydrogen.demoUrl} title={`Hydrogen: ${name}`} className="w-full h-[500px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#FB923C] font-bold">
                          HAIKU 5.5 ({cur.haiku.rescuedLines ? `Rescate ${cur.haiku.rescuedLines} LOC` : `${cur.haiku.lines} LOC`})
                        </span>
                        <a href={haikuDisplayUrl} target="_blank" rel="noopener noreferrer" className="text-[#FB923C] underline">
                          {lang === "es" ? "Abrir ↗" : "Open ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={haikuDisplayUrl} title={`Haiku 5.5: ${name}`} className="w-full h-[500px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#10B981] font-bold">GPT-6 LUNA (${cur.luna.usd.toFixed(2)} · {cur.luna.min}m)</span>
                        <a href={cur.luna.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#10B981] underline">
                          {lang === "es" ? "Abrir ↗" : "Open ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.luna.demoUrl} title={`GPT-6 Luna: ${name}`} className="w-full h-[500px] border-0 bg-[#090B10]" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={
                      activeMode === "hydrogen"
                        ? cur.hydrogen.demoUrl
                        : activeMode === "haiku_rescue"
                        ? haikuDisplayUrl
                        : activeMode === "haiku"
                        ? cur.haiku.demoUrl
                        : cur.luna.demoUrl
                    }
                    title={`${activeMode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 11 (GEMINI 4 HYDROGEN 4 NIVELES VS FLASH 3.8)
         ----------------------------------------------------------------- */}
      {released.ep11 && dossierEp === "ep11" && (
        <div id="ep11-hydrogen-vs-flash" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #38BDF8" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#38BDF8] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "EPISODIO 11 · ESTRENO GEMINI 4 HYDROGEN (4 NIVELES) VS FLASH 3.8 · 15 DEMOS + 3 ARENAS IA (9 PUNTOS)"
                : "EPISODE 11 · GEMINI 4 HYDROGEN (4 LEVELS) VS FLASH 3.8 · 15 DEMOS + 3 AI ARENAS (9 POINTS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Gemini 4 Hydrogen ($1.50/$7.50 · 4 Niveles de Pensamiento) vs Gemini 3.8 Flash ($0.75/$3.75): 6 Retos y 3 Arenas IA vs IA"
                : "Gemini 4 Hydrogen ($1.50/$7.50 · 4 Thinking Levels) vs Gemini 3.8 Flash ($0.75/$3.75): 6 Challenges & 3 Live Arenas"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Estrenamos el nuevo sucesor de Flash con ventana plana de 1 millon de tokens, 54 puntos en el indice de inteligencia en modo Extra y 4 niveles configurables de pensamiento (Low, Medium, High, Extra). Primero medimos sus 4 niveles en vivo sobre el Billar Masse, y luego lo enfrentamos a Gemini 3.8 Flash en 6 retos con 3 arenas cabeza a cabeza: Hydrogen barre 7 a 2 ($3.22 USD y 22.8 min frente a $0.58 USD y 11.3 min de Flash)."
                : "Introducing Google's new Flash successor featuring a flat 1M context window, 54 points on the Intelligence Index in Extra mode, and 4 tunable thinking tiers (Low, Medium, High, Extra). First we benchmark all 4 thinking depths side-by-side on Trick-Shot Pool, then pit Hydrogen Extra against Gemini 3.8 Flash High across 6 challenges and 3 live arenas: Hydrogen wins 7 to 2 ($3.22 USD in 22.8 min vs $0.58 USD in 11.3 min)."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#38BDF8] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                  {lang === "es" ? "GANADOR OFICIAL (7 - 2)" : "OFFICIAL WINNER (7 - 2)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini 4 Hydrogen Extra
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP11_BENCHMARK_TOTALS.hydrogen_min}&nbsp;min · ${EP11_BENCHMARK_TOTALS.hydrogen_usd.toFixed(2)} USD · {EP11_BENCHMARK_TOTALS.hydrogen_lines} LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FBBF24] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FBBF24] font-bold">
                  {lang === "es" ? "PREDECESOR RAPIDO (2 PTS)" : "FAST PREDECESSOR (2 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini 3.8 Flash High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP11_BENCHMARK_TOTALS.flash_min}&nbsp;min · ${EP11_BENCHMARK_TOTALS.flash_usd.toFixed(2)} USD · {EP11_BENCHMARK_TOTALS.flash_lines} LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "TARIFA OFICIAL API" : "OFFICIAL API PRICING"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  $1.50 / $7.50 (2x)
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "Ventana plana 1M · 54 pts Extra" : "Flat 1M context · 54 pts Extra"}
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                  {lang === "es" ? "ESCALERA + ARENAS" : "THINKING TIERS + ARENAS"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  15 Demos + 3 Arenas
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "Incluye Low/Med/High/Extra en vivo" : "Includes live Low/Med/High/Extra"}
                </div>
              </div>
            </div>
          </div>

          {/* Banco Interactivo de los 4 Niveles de Pensamiento de Gemini 4 Hydrogen */}
          <div className="bg-[#111622] border-2 border-[#38BDF8] shadow-[6px_6px_0_#040508] overflow-hidden">
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-pixel text-[10px] text-[#38BDF8]">
                  {lang === "es" ? "EXPERIMENTO EP11 · MISMO PROMPT EN LOS 4 NIVELES DE HYDROGEN" : "EP11 EXPERIMENT · SAME PROMPT ACROSS HYDROGEN'S 4 THINKING LEVELS"}
                </div>
                <h2 className="font-display text-lg font-black text-white mt-1">
                  {lang === "es" ? "Low ($0.14) vs Medium ($0.37) vs High ($0.67) vs Extra ($1.18)" : "Low ($0.14) vs Medium ($0.37) vs High ($0.67) vs Extra ($1.18)"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                {EP11_THINKING_LEVELS.map((lvl) => (
                  <button
                    key={lvl.key}
                    onClick={() => setEp11LevelKey(lvl.key)}
                    aria-pressed={ep11LevelKey === lvl.key}
                    className={`px-3 py-1.5 font-bold border cursor-pointer ${
                      ep11LevelKey === lvl.key
                        ? "bg-[#38BDF8] text-[#090B10] border-[#090B10]"
                        : "bg-[#131824] text-white border-[#2A344B]"
                    }`}
                  >
                    {lang === "es" ? lvl.label_es : lvl.label_en} (${lvl.usd.toFixed(2)})
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const curLvl = EP11_THINKING_LEVELS.find((l) => l.key === ep11LevelKey) || EP11_THINKING_LEVELS[3];
              return (
                <div className="flex flex-col">
                  <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                    <span className="text-[#CBD5E1]">
                      <strong className="text-[#FFD100]">{curLvl.sec}s ({curLvl.min}m)</strong> · ${curLvl.usd.toFixed(4)} USD · {curLvl.outTokens.toLocaleString()} out · {curLvl.lines} LOC —{" "}
                      {lang === "es" ? curLvl.summary_es : curLvl.summary_en}
                    </span>
                    <a href={curLvl.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] font-bold underline shrink-0">
                      {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                    </a>
                  </div>
                  <iframe
                    allowFullScreen
                    src={curLvl.demoUrl}
                    title={`Hydrogen ${curLvl.key}`}
                    className="w-full h-[540px] border-0 bg-[#090B10]"
                  />
                </div>
              );
            })()}
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#38BDF8]">
                {lang === "es"
                  ? "TABLA OFICIAL EP11 (6 RETOS + 3 ARENAS IA VS IA · HAZ CLIC EN CUALQUIER FILA)"
                  : "OFFICIAL EP11 TABLE (6 CHALLENGES + 3 LIVE AI ARENAS · CLICK ANY ROW)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es" ? "MARCADOR FINAL: HYDROGEN 7 - 2 FLASH 3.8" : "FINAL SCORE: HYDROGEN 7 - 2 FLASH 3.8"}
              </span>
            </div>
            <TableScroller label="EP11 Hydrogen vs Flash 3.8 Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "RETO / DATO CURIOSO" : "CHALLENGE / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#38BDF8] ${SNAP_COL}`}>GEMINI 4 HYDROGEN ($1.50/$7.50)</th>
                    <th className={`py-3 px-4 text-[#FBBF24] ${SNAP_COL}`}>GEMINI 3.8 FLASH ($0.75/$3.75)</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "VEREDICTO (FASE A + ARENA)" : "VERDICT (PHASE A + ARENA)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP11_CHALLENGES.map((ch) => {
                    const selected = ep11ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp11ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#38BDF8] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#38BDF8]">
                            {ch.hydrogen.min}&nbsp;min · ${ch.hydrogen.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.hydrogen.fps, ch.hydrogen.fps_en)} · {ch.hydrogen.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#FBBF24]">
                            {ch.flash.min}&nbsp;min · ${ch.flash.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.flash.fps, ch.flash.fps_en)} · {ch.flash.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          <div>{lang === "es" ? ch.winner_label_es : ch.winner_label_en}</div>
                          {ch.arena && (
                            <div className="text-[11px] text-[#10B981] mt-0.5">
                              {lang === "es" ? ch.arena.score_es : ch.arena.score_en}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur = EP11_CHALLENGES.find((c) => c.n === ep11ChallengeN) || EP11_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            const activeMode: Ep11Mode = !cur.arena && ep11Mode === "arena" ? "split" : ep11Mode;
            return (
              <div className="bg-[#111622] border-2 border-[#38BDF8] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#38BDF8]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                    <p className="text-xs text-[#FFD100] mt-1">
                      {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {cur.arena && (
                      <button
                        onClick={() => setEp11Mode("arena")}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === "arena"
                            ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {lang === "es" ? "ARENA IA VS IA EN VIVO" : "LIVE AI VS AI ARENA"}
                      </button>
                    )}
                    {(["split", "hydrogen", "flash"] as Ep11Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp11Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === m
                            ? "bg-[#38BDF8] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "split"
                          ? lang === "es"
                            ? "LADO A LADO"
                            : "SIDE BY SIDE"
                          : m === "hydrogen"
                          ? "GEMINI 4 HYDROGEN"
                          : "GEMINI 3.8 FLASH"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep11", cur.n)}
                      className="px-3 py-1.5 bg-[#10B981] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {activeMode === "arena" && cur.arena ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                      <span className="text-[#FFD100] font-bold">
                        {lang === "es" ? cur.arena.summary_es : cur.arena.summary_en}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <a href={cur.arena.logUrl} target="_blank" rel="noopener noreferrer" className="text-[#10B981] font-bold underline">
                          {lang === "es" ? "Resumen JSON ↗" : "JSON Summary ↗"}
                        </a>
                        <a href={cur.arena.arenaUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] font-bold underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                    </div>
                    <iframe
                      allowFullScreen
                      src={cur.arena.arenaUrl}
                      title={`EP11 Arena: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                ) : activeMode === "split" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#38BDF8] font-bold">
                          GEMINI 4 HYDROGEN (${cur.hydrogen.usd.toFixed(2)} · {cur.hydrogen.min}m)
                        </span>
                        <a href={cur.hydrogen.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.hydrogen.demoUrl} title={`Hydrogen: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#FBBF24] font-bold">
                          GEMINI 3.8 FLASH (${cur.flash.usd.toFixed(2)} · {cur.flash.min}m)
                        </span>
                        <a href={cur.flash.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.flash.demoUrl} title={`Flash 3.8: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={activeMode === "hydrogen" ? cur.hydrogen.demoUrl : cur.flash.demoUrl}
                    title={`${activeMode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 10 (CARBON VS FABLE 5.2 + 4 ARENAS EN VIVO)
         ----------------------------------------------------------------- */}
      {released.ep10 && dossierEp === "ep10" && (
        <div id="ep10-carbon-vs-fable" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #FFD100" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD100] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "GRAN FINAL TRILOGIA FRONTERA · EPISODIO 10 · 12 APPS ZERO-SHOT + 4 ARENAS IA VS IA EN VIVO (10 PUNTOS)"
                : "FRONTIER TRILOGY FINALE · EPISODE 10 · 12 ZERO-SHOT APPS + 4 LIVE AI VS AI ARENAS (10 POINTS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Gemini 4 Carbon ($2/$10) vs Claude Fable 5.2 ($8/$40): 6 Retos Extremos, 4 Arenas IA vs IA en Vivo y 430 Jugadas Verificadas en JSON"
                : "Gemini 4 Carbon ($2/$10) vs Claude Fable 5.2 ($8/$40): 6 Extreme Challenges, 4 Live AI vs AI Arenas & 430 Verified JSON Plays"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "El choque directo entre los dos nuevos modelos bandera de Google y Anthropic a tarifa 1x vs 4x. Primero evaluamos 6 simulaciones construidas en un solo intento sin intervenciones (Fase A, 6 puntos), y en los retos competitivos enfrentamos a los dos cerebros cara a cara dentro del simulador ganador con registro determinista de cada accion en JSON (Fase B, 4 puntos). Claude Fable 5.2 se corona campeon global 7 a 3 ($23.35 USD · 9,626 lineas), mientras Gemini 4 Carbon entrega 20,246 lineas por apenas $8.20 USD."
                : "The direct clash between Google's and Anthropic's new flagship frontier models at 1x vs 4x API pricing. First we judge 6 unedited zero-shot simulations (Phase A, 6 points), and in the 4 head-to-head challenges both AI brains battle live inside the winning simulator with deterministic JSON action logs (Phase B, 4 points). Claude Fable 5.2 wins the 7-3 overall crown ($23.35 USD · 9,626 LOC), while Gemini 4 Carbon delivers 20,246 lines for just $8.20 USD."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#FB923C] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FB923C] font-bold">
                  {lang === "es" ? "CAMPEON GLOBAL (7 PTS)" : "OVERALL CHAMPION (7 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Claude Fable 5.2
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP10_BENCHMARK_TOTALS.fable52_min}&nbsp;min · ${EP10_BENCHMARK_TOTALS.fable52_usd.toFixed(2)} USD · 4 Fase A + 3 Arena
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#38BDF8] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                  {lang === "es" ? "CAMPEON CALIDAD-PRECIO (3 PTS)" : "VALUE CHAMPION (3 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini 4 Carbon
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP10_BENCHMARK_TOTALS.carbon_min}&nbsp;min · ${EP10_BENCHMARK_TOTALS.carbon_usd.toFixed(2)} USD · 20,246 LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "TARIFA API COMPARADA" : "API RATE COMPARISON"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  $2/$10 vs $8/$40
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "Carbon cuesta 4x menos por token" : "Carbon costs 4x less per token"}
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                  {lang === "es" ? "AUDITORIA DETERMINISTA" : "DETERMINISTIC AUDIT"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  16 Demos + 430 Logs
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "0 errores JS en las 16 entregas" : "0 JS errors across all 16 builds"}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#FFD100]">
                {lang === "es"
                  ? "TABLA OFICIAL EP10 (6 RETOS FASE A + 4 ARENAS IA VS IA EN VIVO · HAZ CLIC EN CUALQUIER FILA)"
                  : "OFFICIAL EP10 TABLE (6 PHASE A BUILDS + 4 LIVE AI VS AI ARENAS · CLICK ANY ROW)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es" ? "MARCADOR FINAL: FABLE 5.2 [7] - [3] CARBON" : "FINAL SCORE: FABLE 5.2 [7] - [3] CARBON"}
              </span>
            </div>
            <TableScroller label="EP10 Carbon vs Fable 5.2 Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "RETO / DATO CURIOSO" : "CHALLENGE / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#38BDF8] ${SNAP_COL}`}>GEMINI 4 CARBON ($2/$10)</th>
                    <th className={`py-3 px-4 text-[#FB923C] ${SNAP_COL}`}>CLAUDE FABLE 5.2 ($8/$40)</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "VEREDICTO (FASE A + ARENA)" : "VERDICT (PHASE A + ARENA)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP10_CHALLENGES.map((ch) => {
                    const selected = ep10ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp10ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#FFD100] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#38BDF8]">
                            {ch.carbon.min}&nbsp;min · ${ch.carbon.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.carbon.fps, ch.carbon.fps_en)} · {ch.carbon.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#FB923C]">
                            {ch.fable52.min}&nbsp;min · ${ch.fable52.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.fable52.fps, ch.fable52.fps_en)} · {ch.fable52.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          <div>{lang === "es" ? ch.winner_label_es : ch.winner_label_en}</div>
                          {ch.arena && (
                            <div className="text-[11px] text-[#10B981] mt-0.5">
                              {lang === "es" ? ch.arena.score_es : ch.arena.score_en}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur =
              EP10_CHALLENGES.find((c) => c.n === ep10ChallengeN) || EP10_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            const activeMode: Ep10Mode = !cur.arena && ep10Mode === "arena" ? "split" : ep10Mode;
            return (
              <div className="bg-[#111622] border-2 border-[#FFD100] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#FFD100]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                    <p className="text-xs text-[#FFD100] mt-1">
                      {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {cur.arena && (
                      <button
                        onClick={() => setEp10Mode("arena")}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === "arena"
                            ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {lang === "es" ? "ARENA IA VS IA EN VIVO" : "LIVE AI VS AI ARENA"}
                      </button>
                    )}
                    {(["split", "carbon", "fable52"] as Ep10Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp10Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === m
                            ? "bg-[#00E5FF] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "split"
                          ? lang === "es"
                            ? "LADO A LADO"
                            : "SIDE BY SIDE"
                          : m === "carbon"
                          ? "GEMINI 4 CARBON"
                          : "CLAUDE FABLE 5.2"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep10", cur.n)}
                      className="px-3 py-1.5 bg-[#10B981] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {activeMode === "arena" && cur.arena ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                      <span className="text-[#FFD100] font-bold">
                        {lang === "es" ? cur.arena.summary_es : cur.arena.summary_en}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <a
                          href={cur.arena.logUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] font-bold underline"
                        >
                          {lang === "es" ? "Log JSON Verificado ↗" : "Verified JSON Log ↗"}
                        </a>
                        <a
                          href={cur.arena.arenaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5FF] font-bold underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                    </div>
                    <iframe
                      allowFullScreen
                      src={cur.arena.arenaUrl}
                      title={`EP10 Arena: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                ) : activeMode === "split" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#38BDF8] font-bold">
                          GEMINI 4 CARBON (${cur.carbon.usd.toFixed(2)} · {cur.carbon.min}m)
                        </span>
                        <a href={cur.carbon.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.carbon.demoUrl} title={`Carbon: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#FB923C] font-bold">
                          CLAUDE FABLE 5.2 (${cur.fable52.usd.toFixed(2)} · {cur.fable52.min}m)
                        </span>
                        <a href={cur.fable52.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FB923C] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.fable52.demoUrl} title={`Fable 5.2: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={activeMode === "carbon" ? cur.carbon.demoUrl : cur.fable52.demoUrl}
                    title={`${activeMode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 09 (CLAUDE FABLE 5.2 EN VIVO VS OPUS 5.5)
         ----------------------------------------------------------------- */}
      {released.ep09 && dossierEp === "ep09" && (
        <div id="ep09-claude-fable-vivo" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #FB923C" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FB923C] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "PARTE 2 TRILOGIA FRONTERA · EPISODIO 09 · CLAUDE FABLE 5.2 ($8/$40) VS CLAUDE OPUS 5.5 (8 SIMULADORES ZERO-SHOT)"
                : "FRONTIER TRILOGY PART 2 · EPISODE 09 · CLAUDE FABLE 5.2 ($8/$40) VS CLAUDE OPUS 5.5 (8 ZERO-SHOT SIMULATORS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Claude Fable 5.2 vs Claude Opus 5.5: 4 retos, un solo intento"
                : "Claude Fable 5.2 vs Claude Opus 5.5: 4 Challenges, One Attempt"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Anthropic responde abriendo Claude Fable 5.2 al publico ($8 entrada / $40 salida por millon de tokens, mientras reserva Mythos 5.2 para laboratorios aliados). Lo pusimos a prueba a un solo intento frente a Claude Opus 5.5 en 4 retos de fisica relativista, electronica analogica, refactorizacion critica y relojeria suiza: cero errores de consola en las 8 entregas y victoria 3 a 1 para Fable 5.2."
                : "Anthropic strikes back with Claude Fable 5.2 in public API ($8 input / $40 output per 1M tokens, while keeping Mythos 5.2 gated). Tested blind in a single attempt against Claude Opus 5.5 across general relativity, analog electronics, legacy POS rescue, and Swiss horology: zero console errors across all 8 apps and a 3-1 win for Fable 5.2."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#FB923C] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FB923C] font-bold">
                  {lang === "es" ? "GANADOR (3 - 1)" : "WINNER (3 - 1)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">Claude Fable 5.2</div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP09_BENCHMARK_TOTALS.fable52_min}&nbsp;min · ${EP09_BENCHMARK_TOTALS.fable52_usd.toFixed(2)} USD · {EP09_BENCHMARK_TOTALS.fable52_lines} LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#C084FC] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#C084FC] font-bold">
                  {lang === "es" ? "ANTECESOR (1 VICTORIA)" : "PREDECESSOR (1 WIN)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">Claude Opus 5.5</div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP09_BENCHMARK_TOTALS.opus55_min}&nbsp;min · ${EP09_BENCHMARK_TOTALS.opus55_usd.toFixed(2)} USD · {EP09_BENCHMARK_TOTALS.opus55_lines} LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "PRECISION ZERO-SHOT" : "ZERO-SHOT RELIABILITY"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">8 / 8 Sin Bugs</div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "0 errores JS en Playwright headless" : "0 JS errors in headless Playwright"}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <TableScroller label="EP09 Fable 5.2 vs Opus 5.5 Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "PRUEBA / DATO CURIOSO" : "TEST / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#FB923C] ${SNAP_COL}`}>CLAUDE FABLE 5.2</th>
                    <th className={`py-3 px-4 text-[#C084FC] ${SNAP_COL}`}>CLAUDE OPUS 5.5</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "GANADOR" : "WINNER"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP09_CHALLENGES.map((ch) => {
                    const selected = ep09ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp09ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#FB923C] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#FB923C]">
                            {ch.fable52.min}&nbsp;min · ${ch.fable52.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.fable52.fps, ch.fable52.fps_en)} · {ch.fable52.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#C084FC]">
                            {ch.opus55.min}&nbsp;min · ${ch.opus55.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.opus55.fps, ch.opus55.fps_en)} · {ch.opus55.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          {lang === "es" ? ch.winner_label_es : ch.winner_label_en}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur =
              EP09_CHALLENGES.find((c) => c.n === ep09ChallengeN) || EP09_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            return (
              <div className="bg-[#111622] border-2 border-[#FB923C] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#FB923C]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {(["split", "fable52", "opus55"] as Ep09Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp09Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          ep09Mode === m
                            ? "bg-[#FB923C] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "split"
                          ? lang === "es"
                            ? "LADO A LADO"
                            : "SIDE BY SIDE"
                          : m === "fable52"
                          ? "CLAUDE FABLE 5.2"
                          : "CLAUDE OPUS 5.5"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep09", cur.n)}
                      className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {ep09Mode === "split" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#FB923C] font-bold">
                          CLAUDE FABLE 5.2 (${cur.fable52.usd.toFixed(2)} · {cur.fable52.min}m)
                        </span>
                        <a href={cur.fable52.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FB923C] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.fable52.demoUrl} title={`Fable 5.2: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#C084FC] font-bold">
                          CLAUDE OPUS 5.5 (${cur.opus55.usd.toFixed(2)} · {cur.opus55.min}m)
                        </span>
                        <a href={cur.opus55.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#C084FC] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.opus55.demoUrl} title={`Opus 5.5: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={ep09Mode === "fable52" ? cur.fable52.demoUrl : cur.opus55.demoUrl}
                    title={`${ep09Mode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 08 (GEMINI 4 CARBON EN VIVO + RONDA DE RECUPERACION)
         ----------------------------------------------------------------- */}
      {released.ep08 && dossierEp === "ep08" && (
        <div id="ep08-gemini-carbon-vivo" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #38BDF8" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#38BDF8] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "PARTE 1 TRILOGIA FRONTERA · EPISODIO 08 · GEMINI 4 CARBON GA ($2/$10) VS ARGON + RONDA DE RECUPERACION"
                : "FRONTIER TRILOGY PART 1 · EPISODE 08 · GEMINI 4 CARBON GA ($2/$10) VS ARGON + RECOVERY ROUND"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Gemini 4 Carbon Abierto para Todos vs Gemini 4 Argon: 4 Retos Reales (3 - 1) + Ronda de Recuperacion del Puente Oculto (-1 Letra)"
                : "Gemini 4 Carbon Public GA vs Gemini 4 Argon: 4 Live Challenges (3 - 1) + 1-Letter Hidden Bridge Recovery Round"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Google DeepMind libera Gemini 4 Carbon fuera de Project Glasswing con 1M de contexto y tarifa promocional de $2/$10 USD. Gano 3 a 1 frente a Gemini 4 Argon escribiendo 12,056 lineas por $5.36 USD. En la Prueba 03 (Puente de Tacoma) dejo el lienzo en negro por escribir una sola letra 'd' extra (baseDdvy en la linea 1664); respetamos el punto oficial de Argon y abrimos la Ronda de Recuperacion borrando unicamente ese caracter para revelar el puente 2.5D de 186 cables y 50 rupturas ocultas."
                : "Google DeepMind unlocks Gemini 4 Carbon beyond Project Glasswing with 1M context and $2/$10 promo pricing. It defeated Gemini 4 Argon 3-1 across 12,056 lines for $5.36 USD. On Challenge 03 (Tacoma Bridge), one extra letter 'd' on line 1664 (baseDdvy) blacked out the canvas; we kept Argon's official zero-shot point intact and ran an out-of-competition Recovery Round removing just that 1 character to reveal Carbon's hidden 186-cable 2.5D bridge."}
            </p>

            {/* Callout Forense Ronda de Recuperacion */}
            <div className="p-4 sm:p-5 bg-[#041520] border-2 border-[#10B981] shadow-[4px_4px_0_#040508] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es"
                    ? "RONDA DE RECUPERACION · PRUEBA 03 (LINEA 1664 DE 3,204 · PARCHE EXTERNO DE -1 BYTE)"
                    : "RECOVERY ROUND · CHALLENGE 03 (LINE 1664 OF 3,204 · -1 BYTE EXTERNAL PATCH)"}
                </div>
                <p className="font-mono-hud text-xs text-white">
                  {lang === "es"
                    ? "Error original: baseDdvy[i] (mezclo baseDvy y sumDdvy en la suma RK4). Parche: baseDvy[i]. Resultado desbloqueado: 186 cables 2.5D, trafico vivo, tunel de viento, torsion de 60.2 grados con 50 cables rotos y estabilizacion por carenado + TMD."
                    : "Original bug: baseDdvy[i] (blended baseDvy and sumDdvy in final RK4 sum). Patch: baseDvy[i]. Unlocked engine: 186 2.5D cables, highway traffic, live wind tunnel, 60.2 deg flutter snapping 50 cables, and fairing + TMD stabilization."}
                </p>
              </div>
              <button
                onClick={() => {
                  setEp08ChallengeN(3);
                  setEp08Mode("recovery");
                }}
                className="px-4 py-2 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold border-2 border-[#090B10] shadow-[3px_3px_0_#040508] shrink-0 cursor-pointer"
              >
                {lang === "es"
                  ? "Jugar Puente Recuperado Ahora →"
                  : "Play Recovered Bridge Now →"}
              </button>
            </div>
          </div>

          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <TableScroller label="EP08 Carbon vs Argon Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "PRUEBA / DATO CURIOSO" : "TEST / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#38BDF8] ${SNAP_COL}`}>GEMINI 4 CARBON</th>
                    <th className={`py-3 px-4 text-[#A855F7] ${SNAP_COL}`}>GEMINI 4 ARGON</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "VEREDICTO OFICIAL" : "OFFICIAL VERDICT"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP08_CHALLENGES.map((ch) => {
                    const selected = ep08ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp08ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#38BDF8] max-sm:hidden">0{ch.n}</td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#38BDF8]">
                            {ch.carbon.min}&nbsp;min · ${ch.carbon.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.carbon.fps, ch.carbon.fps_en)} · {ch.carbon.lines} LOC
                          </div>
                          {ch.carbon.rescuedFps && (
                            <div className="text-[11px] text-[#10B981] font-bold mt-0.5">
                              {fpsNote(ch.carbon.rescuedFps, ch.carbon.rescuedFps_en)}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#A855F7]">
                            {ch.argon.min}&nbsp;min · ${ch.argon.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.argon.fps, ch.argon.fps_en)} · {ch.argon.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          {lang === "es" ? ch.winner_label_es : ch.winner_label_en}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {(() => {
            const cur =
              EP08_CHALLENGES.find((c) => c.n === ep08ChallengeN) || EP08_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            const activeMode: Ep08Mode =
              !cur.carbon.rescuedDemoUrl && ep08Mode === "recovery" ? "split" : ep08Mode;
            const carbonSplitUrl =
              cur.carbon.rescuedDemoUrl ?? cur.carbon.demoUrl;
            return (
              <div className="bg-[#111622] border-2 border-[#38BDF8] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#38BDF8]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {cur.carbon.rescuedDemoUrl && (
                      <button
                        onClick={() => setEp08Mode("recovery")}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === "recovery"
                            ? "bg-[#10B981] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-[#10B981] border-[#10B981]"
                        }`}
                      >
                        {lang === "es"
                          ? "RONDA DE RECUPERACION (-1 LETRA 'd')"
                          : "RECOVERY ROUND (-1 LETTER 'd')"}
                      </button>
                    )}
                    {(["split", "carbon", "argon"] as Ep08Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp08Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          activeMode === m
                            ? "bg-[#38BDF8] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "split"
                          ? lang === "es"
                            ? "LADO A LADO"
                            : "SIDE BY SIDE"
                          : m === "carbon"
                          ? cur.carbon.rescuedDemoUrl
                            ? "CARBON ZERO-SHOT (BUG)"
                            : "GEMINI 4 CARBON"
                          : "GEMINI 4 ARGON"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep08", cur.n)}
                      className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {activeMode === "recovery" && cur.carbon.rescuedDemoUrl ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 bg-[#041520] border-b border-[#10B981] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                      <span className="text-[#10B981] font-bold">
                        {lang === "es"
                          ? "PUENTE OCULTO RECUPERADO (LINEA 1664: baseDdvy -> baseDvy) · PUNTO OFICIAL SIGUE EN ARGON (3 - 1)"
                          : "RECOVERED HIDDEN BRIDGE (LINE 1664: baseDdvy -> baseDvy) · OFFICIAL POINT STAYS WITH ARGON (3 - 1)"}
                      </span>
                      <a
                        href={cur.carbon.rescuedDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] font-bold underline"
                      >
                        {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                      </a>
                    </div>
                    <iframe
                      allowFullScreen
                      src={cur.carbon.rescuedDemoUrl}
                      title={`Recovered Carbon: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                ) : activeMode === "split" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#38BDF8] font-bold">
                          GEMINI 4 CARBON (${cur.carbon.usd.toFixed(2)} · {cur.carbon.min}m)
                        </span>
                        <a href={carbonSplitUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={carbonSplitUrl} title={`Carbon: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#A855F7] font-bold">
                          GEMINI 4 ARGON (${cur.argon.usd.toFixed(2)} · {cur.argon.min}m)
                        </span>
                        <a href={cur.argon.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#A855F7] underline">
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe allowFullScreen src={cur.argon.demoUrl} title={`Argon: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    allowFullScreen
                    src={activeMode === "carbon" ? cur.carbon.demoUrl : cur.argon.demoUrl}
                    title={`${activeMode}: ${name}`}
                    className="w-full h-[640px] border-0 bg-[#090B10]"
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 07 (ESPECIAL GEMINI OMNI 1.2 FLASH VS OMNI 1.1 FLASH VS VEO 3.1 QUALITY)
         ----------------------------------------------------------------- */}
      {released.ep07 && dossierEp === "ep07" && (
        <div id="ep07-omni-1-2-flash" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #38BDF8" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#38BDF8] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "DOSSIER OFICIAL EPISODIO 07 · ESPECIAL GEMINI OMNI 1.2 FLASH (15S NATIVOS + 12 VIDEOS EN GOOGLE FLOW)"
                : "OFFICIAL EPISODE 07 DOSSIER · GEMINI OMNI 1.2 FLASH SPECIAL (15S NATIVE + 12 LIVE GOOGLE FLOW VIDEOS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Google Lanza Gemini Omni 1.2 Flash ($0.069/s): 15s Continuos, 6 Ingredientes y Benchmark en Vivo vs Omni 1.1 Flash y Veo 3.1 Quality (4 - 0)"
                : "Google Launches Gemini Omni 1.2 Flash ($0.069/s): 15s Continuous Video, 6 Ingredients & Live Benchmark vs Omni 1.1 Flash & Veo 3.1 Quality (4 - 0)"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Abrimos Google Flow en vivo y sometimos al nuevo Gemini Omni 1.2 Flash ($0.069/s en API 720p, hasta 15 segundos continuos en pasos de 1s y hasta 6 imagenes de referencia) a 4 pruebas reales frente a su predecesor Gemini Omni 1.1 Flash ($0.101/s, tope 10s) y Veo 3.1 Quality ($0.40/s, tope 8s). Omni 1.2 Flash baraja el marcador 4 a 0 ($2.71 USD totales frente a $12.80 USD de Veo 3.1 Quality), proyectando hologramas 3D reales, evitando el pasillo fantasma de Veo 3.1 en t=3.0s y fusionando las 3 fotos de referencia que Veo 3.1 Quality bloqueo."
                : "We opened Google Flow live and put the new Gemini Omni 1.2 Flash ($0.069/s on 720p API, up to 15 continuous seconds in 1s increments, and up to 6 reference images) through 4 live tests against its predecessor Gemini Omni 1.1 Flash ($0.101/s, 10s cap) and Veo 3.1 Quality ($0.40/s, 8s cap). Omni 1.2 Flash sweeps 4-0 ($2.71 USD total vs Veo 3.1 Quality's $12.80 USD), projecting floating 3D holograms, avoiding Veo 3.1's t=3.0s ghost hallway, and fusing the 3 reference photos that Veo 3.1 Quality blocked."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#38BDF8] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                  {lang === "es" ? "CAMPEON INVICTO (4-0)" : "UNDEFEATED CHAMPION (4-0)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini Omni 1.2 Flash
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP07_BENCHMARK_TOTALS.omni12_avg} · ${EP07_BENCHMARK_TOTALS.omni12_usd.toFixed(2)} USD · 15s Nativos
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#A855F7] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#A855F7] font-bold">
                  {lang === "es" ? "PREDECESOR (0 PTS)" : "PREDECESSOR (0 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini Omni 1.1 Flash
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP07_BENCHMARK_TOTALS.omni11_avg} · ${EP07_BENCHMARK_TOTALS.omni11_usd.toFixed(2)} USD · Tope 10s
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#F59E0B] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#F59E0B] font-bold">
                  {lang === "es" ? "MODELO CINE (0 PTS)" : "CINEMA MODEL (0 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Veo 3.1 - Quality
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP07_BENCHMARK_TOTALS.veo31q_avg} · ${EP07_BENCHMARK_TOTALS.veo31q_usd.toFixed(2)} USD · Tope 8s
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "AHORRO EN API 720P" : "720P API SAVINGS"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  -31.7% vs 1.1 · 4.7x vs Veo
                </div>
                <div className="font-mono-hud text-xs text-[#10B981] mt-1">
                  $0.069/s vs $0.101/s vs $0.400/s
                </div>
              </div>
            </div>
          </div>

          {/* Tabla Comparativa de las 4 Pruebas en Google Flow */}
          <div
            data-px-reveal="true"
            className={`bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}
            style={{ outline: "2px solid #2A344B" }}
          >
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <div className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                {lang === "es"
                  ? "MATRIZ DE RESULTADOS · 4 PRUEBAS EN VIVO EN GOOGLE FLOW (12 VIDEOS 1080P)"
                  : "BENCHMARK MATRIX · 4 LIVE TESTS IN GOOGLE FLOW (12 1080P VIDEOS)"}
              </div>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es"
                  ? "MARCADOR FINAL: OMNI 1.2 [4] - OMNI 1.1 [0] - VEO 3.1 [0]"
                  : "FINAL SCORE: OMNI 1.2 [4] - OMNI 1.1 [0] - VEO 3.1 [0]"}
              </span>
            </div>
            <TableScroller label={lang === "es" ? "Tabla EP07 Omni 1.2 Flash" : "EP07 Omni 1.2 Flash Table"}>
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "Prueba en Google Flow" : "Google Flow Test"}
                    </th>
                    <th className={`py-3 px-4 text-[#38BDF8] ${SNAP_COL}`}>Omni 1.2 Flash</th>
                    <th className={`py-3 px-4 text-[#A855F7] ${SNAP_COL}`}>Omni 1.1 Flash</th>
                    <th className={`py-3 px-4 text-[#F59E0B] ${SNAP_COL}`}>Veo 3.1 Quality</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "Ganador" : "Winner"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {EP07_CHALLENGES.map((ch) => {
                    const selected = ep07ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp07ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#38BDF8] max-sm:hidden">
                          {ch.code}
                        </td>
                        <td className={`py-3 px-4 font-sans font-bold text-white ${pinCell(selected)}`}>
                          {lang === "es" ? ch.name_es : ch.name_en}
                        </td>
                        <td className="py-3 px-4 text-[#38BDF8]">
                          <div className="font-bold">{ch.omni12.score} · ${ch.omni12.usd.toFixed(2)}</div>
                          <div className="text-[11px] text-[#94A3B8]">
                            {ch.omni12.duration_s}s · {ch.omni12.gen_time_s}s gen · {ch.omni12.credits} cr
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#C084FC]">
                          <div className="font-bold">{ch.omni11.score} · ${ch.omni11.usd.toFixed(2)}</div>
                          <div className="text-[11px] text-[#94A3B8]">
                            {ch.omni11.duration_s}s · {ch.omni11.gen_time_s}s gen · {ch.omni11.credits} cr
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#FBBF24]">
                          <div className="font-bold">{ch.veo31q.score} · ${ch.veo31q.usd.toFixed(2)}</div>
                          <div className="text-[11px] text-[#94A3B8]">
                            {ch.veo31q.duration_s}s · {ch.veo31q.gen_time_s}s gen · {ch.veo31q.credits} cr
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#10B981]">
                          OMNI 1.2 FLASH
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {/* Selector de Prueba y Comparador Interactivo de los 12 Videos 1080p */}
          {(() => {
            const cur =
              EP07_CHALLENGES.find((c) => c.n === ep07ChallengeN) || EP07_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            return (
              <div className="bg-[#111622] border-2 border-[#38BDF8] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 bg-[#182235] border-b border-[#2A344B] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {EP07_CHALLENGES.map((ch) => (
                        <button
                          key={ch.n}
                          onClick={() => setEp07ChallengeN(ch.n)}
                          className={`px-3 py-1.5 font-pixel text-[10px] font-bold border cursor-pointer transition ${
                            ep07ChallengeN === ch.n
                              ? "bg-[#38BDF8] text-[#090B10] border-[#090B10]"
                              : "bg-[#090B10] text-[#CBD5E1] border-[#2A344B] hover:border-[#38BDF8]"
                          }`}
                        >
                          {ch.code} · {lang === "es" ? ch.name_es.split(":")[0] : ch.name_en.split(":")[0]}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 font-mono-hud text-xs">
                      {(
                        [
                          ["triple", lang === "es" ? "3 Modelos Lado a Lado" : "3-Model Side-by-Side"],
                          ["omni12", "Omni 1.2 Flash (#1)"],
                          ["omni11", "Omni 1.1 Flash"],
                          ["veo31q", "Veo 3.1 Quality"],
                          ["contact", lang === "es" ? "Hoja de Contacto 4K" : "4K Contact Sheet"],
                        ] as const
                      ).map(([mKey, mLabel]) => (
                        <button
                          key={mKey}
                          onClick={() => setEp07Mode(mKey)}
                          className={`px-2.5 py-1 font-bold border cursor-pointer ${
                            ep07Mode === mKey
                              ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                              : "bg-[#090B10] text-[#CBD5E1] border-[#2A344B]"
                          }`}
                        >
                          {mLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono-hud text-[#38BDF8] font-bold">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h2 className="font-display text-xl font-black text-white">
                      {cur.code}: {name}
                    </h2>
                    <p className="text-xs text-[#FFD100] font-semibold">
                      {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
                    </p>
                    <p className="text-xs text-[#CBD5E1]">
                      {lang === "es" ? cur.verdict_es : cur.verdict_en}
                    </p>
                  </div>

                  {/* Prompt Box */}
                  <div className="p-3 bg-[#090B10] border border-[#2A344B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-[#94A3B8] font-mono-hud">
                      <span className="text-[#38BDF8] font-bold">PROMPT: </span>
                      {lang === "es" ? cur.prompt_es : cur.prompt_en}
                    </div>
                    <PixelCopyButton
                      text={lang === "es" ? cur.prompt_es : cur.prompt_en}
                      label={lang === "es" ? "Copiar Prompt" : "Copy Prompt"}
                      copiedLabel={lang === "es" ? "Copiado" : "Copied"}
                    />
                  </div>
                </div>

                {ep07Mode === "contact" ? (
                  <div className="p-4 bg-[#090B10] space-y-4">
                    <img
                      src={cur.contactSheetUrl}
                      alt={name}
                      className="w-full h-auto border border-[#2A344B]"
                    />
                    {cur.proofImageUrl && (
                      <div className="space-y-2">
                        <div className="font-pixel text-[10px] text-[#FF3355] font-bold">
                          {lang === "es"
                            ? "EVIDENCIA EN VIVO: VEO 3.1 QUALITY BLOQUEANDO LOS 3 INGREDIENTES EN GOOGLE FLOW"
                            : "LIVE PROOF: VEO 3.1 QUALITY BLOCKING ALL 3 INGREDIENTS IN GOOGLE FLOW"}
                        </div>
                        <img
                          src={cur.proofImageUrl}
                          alt="Veo 3.1 Quality Ingredients Error Proof"
                          className="w-full max-w-3xl h-auto border-2 border-[#FF3355]"
                        />
                      </div>
                    )}
                  </div>
                ) : ep07Mode === "triple" ? (
                  <div className="p-4 bg-[#090B10] space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {[
                        { m: cur.omni12, color: "#38BDF8", badge: lang === "es" ? "GANADOR" : "WINNER" },
                        { m: cur.omni11, color: "#A855F7", badge: "PREDECESOR" },
                        { m: cur.veo31q, color: "#F59E0B", badge: "CINE 8S" },
                      ].map(({ m, color, badge }) => (
                        <div
                          key={m.model_name}
                          className="bg-[#111622] border-2 flex flex-col justify-between"
                          style={{ borderColor: color }}
                        >
                          <div className="p-3 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                            <span className="font-bold" style={{ color }}>
                              {m.model_name}
                            </span>
                            <span
                              className="px-2 py-0.5 text-[10px] font-pixel font-bold text-[#090B10]"
                              style={{ backgroundColor: color }}
                            >
                              {badge} · {m.score}
                            </span>
                          </div>
                          <video
                            key={m.videoUrl}
                            src={m.videoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full aspect-video bg-black"
                          />
                          <div className="p-3 space-y-1 font-mono-hud text-xs">
                            <div className="flex items-center justify-between text-[#CBD5E1]">
                              <span>
                                {m.duration_s}s · {m.gen_time_s}s gen
                              </span>
                              <span className="text-[#FFD100] font-bold">
                                {m.credits} cr · ${m.usd.toFixed(2)} USD
                              </span>
                            </div>
                            <div className="text-[11px] text-[#94A3B8]">
                              {lang === "es" ? m.note_es : m.note_en}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {cur.proofImageUrl && (
                      <div className="p-4 bg-[#111622] border-2 border-[#FF3355] flex flex-col lg:flex-row items-center gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="font-pixel text-[10px] text-[#FF3355] font-bold">
                            {lang === "es"
                              ? "CAPTURA REAL EN GOOGLE FLOW · BLOQUEO DE INGREDIENTES EN VEO 3.1 QUALITY"
                              : "LIVE GOOGLE FLOW SCREENSHOT · VEO 3.1 QUALITY INGREDIENT BLOCK"}
                          </div>
                          <p className="text-xs text-[#CBD5E1]">
                            {lang === "es"
                              ? "Al adjuntar las 3 imagenes de referencia y seleccionar Veo 3.1 Quality, Google Flow deshabilita el boton de generar con la alerta: 'El modelo seleccionado no admite los ingredientes agregados'."
                              : "When attaching all 3 reference images and selecting Veo 3.1 Quality, Google Flow disables generation with the warning: 'The selected model does not support the added ingredients'."}
                          </p>
                        </div>
                        <img
                          src={cur.proofImageUrl}
                          alt="Veo 3.1 Quality Ingredients Error"
                          className="w-full lg:w-96 h-auto border border-[#FF3355]"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-[#090B10]">
                    {(() => {
                      const chosen =
                        ep07Mode === "omni12"
                          ? cur.omni12
                          : ep07Mode === "omni11"
                          ? cur.omni11
                          : cur.veo31q;
                      return (
                        <div className="max-w-4xl mx-auto space-y-3">
                          <div className="flex items-center justify-between font-mono-hud text-sm text-white">
                            <span className="font-bold">{chosen.model_name}</span>
                            <span className="text-[#FFD100]">
                              {chosen.score} · {chosen.duration_s}s · {chosen.gen_time_s}s gen · ${chosen.usd.toFixed(2)} USD
                            </span>
                          </div>
                          <video
                            key={chosen.videoUrl}
                            src={chosen.videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full aspect-video bg-black border-2 border-[#38BDF8]"
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER EPISODIO 06 (5 CLASICOS + ARENA DE SUPERVIVENCIA EN VIVO)
         ----------------------------------------------------------------- */}
      {released.ep06 && dossierEp === "ep06" && (
        <div id="ep06-clasicos-arena-ia" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #00E5FF" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "DOSSIER OFICIAL EPISODIO 06 · 15 CLONES ZERO-SHOT + 5 ARENAS DE SUPERVIVENCIA EN VIVO (10 PUNTOS)"
                : "OFFICIAL EPISODE 06 DOSSIER · 15 ZERO-SHOT CLONES + 5 LIVE SURVIVAL ARENAS (10 POINTS)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "Clasicos Mundiales + Arena de Supervivencia en Vivo: Gemini 4 Argon High vs Claude Opus 5.5 High vs GPT-6 Astra High (Snake, Bomberman, Pac-Man, Tanques y Hex-A-Gone 3D)"
                : "World Classics + Live Survival Arena: Gemini 4 Argon High vs Claude Opus 5.5 High vs GPT-6 Astra High (Snake, Bomberman, Pac-Man, Tanks & 3D Hex-A-Gone)"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Por primera vez en Mixiuh Labs, cada reto vale doble: primero evaluamos cual de los 3 gigantes clono mejor cada videojuego clasico al primer intento (5 puntos de clonacion), y enseguida metemos a las 3 IAs dentro del juego que resulto ganador para que peleen a muerte entre ellas con registro de cada accion en logs verificados (5 puntos de Arena en Vivo). Tras el empate 4-4 de Opus en el clon 3D de Hex-A-Gone, Gemini 4 Argon High barre las 3 Coronas en la Arena 3D y se corona campeon 5-4-1."
                : "For the first time at Mixiuh Labs, every round counts double: first we judge which of the 3 giants cloned each classic game best on the first attempt (5 clone points), and right after we drop all 3 AIs into the winning clone of each challenge to fight to the last survivor with verified JSON action logs (5 Live Arena points). After Opus tied the score 4-4 on the 3D Hex-A-Gone clone, Gemini 4 Argon High sweeps 3 of 3 Crowns in the 3D Arena to claim the 5-4-1 championship."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#00E5FF] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#00E5FF] font-bold">
                  {lang === "es" ? "CAMPEON GLOBAL (5 PTS)" : "OVERALL CHAMPION (5 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini 4 Argon High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP06_BENCHMARK_TOTALS.argon_min}&nbsp;min · ${EP06_BENCHMARK_TOTALS.argon_usd.toFixed(2)} USD · 2 Clon + 3 Arena
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#C084FC] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#C084FC] font-bold">
                  {lang === "es" ? "SUBCAMPEON (4 PTS)" : "RUNNER-UP (4 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Claude Opus 5.5 High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP06_BENCHMARK_TOTALS.opus_min}&nbsp;min · ${EP06_BENCHMARK_TOTALS.opus_usd.toFixed(2)} USD · 2 Clon + 2 Arena
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "TERCER LUGAR (1 PTO)" : "THIRD PLACE (1 PT)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  GPT-6 Astra High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP06_BENCHMARK_TOTALS.astra_min}&nbsp;min · ${EP06_BENCHMARK_TOTALS.astra_usd.toFixed(2)} USD · 1 Clon + 0 Arena
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                  {lang === "es" ? "20 JUEGOS + LOGS VERIFICADOS" : "20 GAMES + VERIFIED LOGS"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  15 Clones + 5 Arenas
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? "3 IAs en el juego ganador + JSON Logs" : "3 AIs in winning clone + JSON Logs"}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla Comparativa de los 5 Clasicos (Clon Zero-Shot + Arena en Vivo) */}
          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#00E5FF]">
                {lang === "es"
                  ? "TABLA OFICIAL DE LOS 5 CLASICOS (15 CLONES ZERO-SHOT + 5 ARENAS EN VIVO · HAZ CLIC EN CUALQUIER FILA)"
                  : "OFFICIAL 5-CLASSIC TABLE (15 ZERO-SHOT CLONES + 5 LIVE ARENAS · CLICK ANY ROW TO PLAY)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es"
                  ? "10 PUNTOS EN JUEGO (5-4-1 ARGON)"
                  : "10 POINTS AT STAKE (5-4-1 ARGON)"}
              </span>
            </div>
            <TableScroller label="EP06 5-Classic Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "CLASICO / DATO CURIOSO" : "CLASSIC / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#00E5FF] ${SNAP_COL}`}>GEMINI 4 ARGON HIGH</th>
                    <th className={`py-3 px-4 text-[#C084FC] ${SNAP_COL}`}>CLAUDE OPUS 5.5 HIGH</th>
                    <th className={`py-3 px-4 text-[#10B981] ${SNAP_COL}`}>GPT-6 ASTRA HIGH</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "GANADORES (CLON + ARENA)" : "WINNERS (CLONE + ARENA)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP06_CHALLENGES.map((ch) => {
                    const selected = ep06ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp06ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#00E5FF] max-sm:hidden">
                          0{ch.n}
                        </td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#00E5FF]">
                            {ch.argon.min}&nbsp;min · ${ch.argon.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.argon.fps, ch.argon.fps_en)} · {ch.argon.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#C084FC]">
                            {ch.opus.min}&nbsp;min · ${ch.opus.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.opus.fps, ch.opus.fps_en)} · {ch.opus.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#10B981]">
                            {ch.astra.min}&nbsp;min · ${ch.astra.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.astra.fps, ch.astra.fps_en)} · {ch.astra.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          {lang === "es" ? ch.winner_label_es : ch.winner_label_en}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {/* Visor Interactivo de los 20 Juegos de EP06 (Arena en Vivo + 3 Clones) */}
          {(() => {
            const cur =
              EP06_CHALLENGES.find((c) => c.n === ep06ChallengeN) ||
              EP06_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            return (
              <div className="bg-[#111622] border-2 border-[#00E5FF] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#00E5FF]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                    <p className="text-xs text-[#FFD100] mt-1">
                      {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {(["arena", "triple", "argon", "opus", "astra"] as Ep06Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp06Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          ep06Mode === m
                            ? "bg-[#00E5FF] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "arena"
                          ? lang === "es"
                            ? "PELEA EN VIVO (3 IAS EN LA ARENA)"
                            : "LIVE ARENA BATTLE (3 AIS)"
                          : m === "triple"
                          ? lang === "es"
                            ? "3 CLONES LADO A LADO"
                            : "3 CLONES SIDE BY SIDE"
                          : m === "argon"
                          ? "CLON ARGON"
                          : m === "opus"
                          ? "CLON OPUS 5.5"
                          : "CLON ASTRA"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep06", cur.n)}
                      className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {ep06Mode === "arena" ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                      <span className="text-[#FFD100] font-bold">
                        {lang === "es" ? cur.verdict_es : cur.verdict_en}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <a
                          href={cur.arenaLogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] font-bold underline"
                        >
                          {lang === "es" ? "Log JSON Verificado ↗" : "Verified JSON Log ↗"}
                        </a>
                        <a
                          href={cur.arenaDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5FF] font-bold underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                    </div>
                    <iframe
                      allowFullScreen
                      src={cur.arenaDemoUrl}
                      title={`Arena: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                ) : ep06Mode === "triple" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#00E5FF] font-bold">
                          GEMINI 4 ARGON (${cur.argon.usd.toFixed(2)} · {cur.argon.min}m)
                        </span>
                        <a
                          href={cur.argon.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5FF] underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe
                        allowFullScreen
                        src={cur.argon.demoUrl}
                        title={`Argon: ${name}`}
                        className="w-full h-[500px] border-0 bg-[#090B10]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#C084FC] font-bold">
                          CLAUDE OPUS 5.5 (${cur.opus.usd.toFixed(2)} · {cur.opus.min}m)
                        </span>
                        <a
                          href={cur.opus.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C084FC] underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe
                        allowFullScreen
                        src={cur.opus.demoUrl}
                        title={`Opus: ${name}`}
                        className="w-full h-[500px] border-0 bg-[#090B10]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#10B981] font-bold">
                          GPT-6 ASTRA (${cur.astra.usd.toFixed(2)} · {cur.astra.min}m)
                        </span>
                        <a
                          href={cur.astra.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe
                        allowFullScreen
                        src={cur.astra.demoUrl}
                        title={`Astra: ${name}`}
                        className="w-full h-[500px] border-0 bg-[#090B10]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <iframe
                      allowFullScreen
                      src={
                        ep06Mode === "argon"
                          ? cur.argon.demoUrl
                          : ep06Mode === "opus"
                          ? cur.opus.demoUrl
                          : cur.astra.demoUrl
                      }
                      title={`${ep06Mode}: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUB-DOSSIER 00: EPISODIO 05 (3 GIANTS TOURNAMENT + RESCUE ROUND)
         ----------------------------------------------------------------- */}
      {released.ep05 && dossierEp === "ep05" && (
        <div id="ep05-torneo-tres-gigantes" className="space-y-10">
          <div
            data-px-reveal="true"
            className="bg-[#111622] border-2 border-[#090B10] p-6 sm:p-8 shadow-[6px_6px_0_#040508] space-y-6"
            style={{ outline: "2px solid #10B981" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981] text-[#090B10] border border-[#090B10] font-pixel text-[10px] font-bold">
              {lang === "es"
                ? "DOSSIER OFICIAL EPISODIO 05 · 18 CORRIDAS ZERO-SHOT + 2 RESCATADAS EN 3D (ARGON VS OPUS VS ASTRA)"
                : "OFFICIAL EPISODE 05 DOSSIER · 18 ZERO-SHOT RUNS + 2 RESCUED 3D GAMES (ARGON VS OPUS VS ASTRA)"}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight">
              {lang === "es"
                ? "El Torneo de los 3 Gigantes: Gemini 4 Argon High vs Claude Opus 5.5 High vs GPT-6 Astra High (6 Retos 3D + Ronda de Rescate)"
                : "The 3 Giants Tournament: Gemini 4 Argon High vs Claude Opus 5.5 High vs GPT-6 Astra High (6 3D Challenges + Rescue Round)"}
            </h1>

            <p className="text-[#CBD5E1] text-sm sm:text-base max-w-4xl leading-relaxed">
              {lang === "es"
                ? "Enfrentamos a las tres inteligencias artificiales mas potentes del planeta en su modo de razonamiento maximo (HIGH) a lo largo de seis desafios visuales 3D con datos curiosos de fisica, trafico y sonido matematico. Ademas, abrimos la Ronda de Rescate donde cambiar una sola palabra (innerPixelRatio por devicePixelRatio) desbloquea 3,834 lineas de codigo 3D a 60 FPS en los dos juegos finales de Argon."
                : "We put the three most powerful AI models on Earth in maximum reasoning mode (HIGH) head-to-head across six 3D visual challenges with fun science facts on gravity, traffic, and mathematical sound waves. Plus, we open the Rescue Round where fixing a single word (innerPixelRatio to devicePixelRatio) unlocks 3,834 lines of 60 FPS 3D code across Argon's final two games."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#10B981] font-bold">
                  {lang === "es" ? "CAMPEON DEL TORNEO (3 PTS)" : "TOURNAMENT CHAMPION (3 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  GPT-6 Astra High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP05_BENCHMARK_TOTALS.astra_min}&nbsp;min · ${EP05_BENCHMARK_TOTALS.astra_usd.toFixed(2)} USD · 6/6 OK
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#00E5FF] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#00E5FF] font-bold">
                  {lang === "es" ? "MAS RAPIDO Y BARATO (2 PTS)" : "FASTEST & CHEAPEST (2 PTS)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Gemini 4 Argon High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP05_BENCHMARK_TOTALS.argon_min}&nbsp;min · ${EP05_BENCHMARK_TOTALS.argon_usd.toFixed(2)} USD · 12,844 LOC
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#C084FC] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#C084FC] font-bold">
                  {lang === "es" ? "MEJOR ESCENARIO DJ (1 PT)" : "BEST DJ CONCERT STAGE (1 PT)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  Claude Opus 5.5 High
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  {EP05_BENCHMARK_TOTALS.opus_min}&nbsp;min · ${EP05_BENCHMARK_TOTALS.opus_usd.toFixed(2)} USD · 6/6 OK
                </div>
              </div>
              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                  {lang === "es" ? "RONDA DE RESCATE (1 PALABRA)" : "RESCUE ROUND (1 WORD FIX)"}
                </div>
                <div className="font-display text-xl font-black text-white mt-1">
                  +2 Juegos Argon 60 FPS
                </div>
                <div className="font-mono-hud text-xs text-[#CBD5E1] mt-1">
                  3,834 {lang === "es" ? "lineas desbloqueadas" : "lines unlocked"} (R5 & R6)
                </div>
              </div>
            </div>
          </div>

          {/* Tabla Comparativa de las 6 Rondas + Rescate */}
          <div className={`bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${PIN_CARD_OVERFLOW}`}>
            <div className="p-4 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-pixel text-xs text-[#10B981]">
                {lang === "es"
                  ? "TABLA OFICIAL DE LOS 6 RETOS 3D + RONDA DE RESCATE (HAZ CLIC EN CUALQUIER FILA PARA PROBAR)"
                  : "OFFICIAL 6-ROUND 3D TABLE + RESCUE ROUND (CLICK ANY ROW TO PLAY LIVE)"}
              </h2>
              <span className="font-mono-hud text-xs text-[#FFD100]">
                {lang === "es"
                  ? "20 SIMULADORES 3D INTERACTIVOS"
                  : "20 INTERACTIVE 3D SIMULATORS"}
              </span>
            </div>
            <TableScroller label="EP05 6-Round Results">
              <table className={`w-full text-left border-collapse font-mono-hud text-xs ${PIN_TABLE}`}>
                <thead>
                  <tr className="bg-[#090B10] text-[#94A3B8] border-b border-[#2A344B]">
                    <th className="py-3 px-4 max-sm:hidden">#</th>
                    <th className={`py-3 px-4 ${PIN_BAR_CELL}`}>
                      {lang === "es" ? "RETO 3D / DATO CURIOSO" : "3D ROUND / FUN FACT"}
                    </th>
                    <th className={`py-3 px-4 text-[#00E5FF] ${SNAP_COL}`}>GEMINI 4 ARGON HIGH</th>
                    <th className={`py-3 px-4 text-[#C084FC] ${SNAP_COL}`}>CLAUDE OPUS 5.5 HIGH</th>
                    <th className={`py-3 px-4 text-[#10B981] ${SNAP_COL}`}>GPT-6 ASTRA HIGH</th>
                    <th className={`py-3 px-4 text-[#FFD100] ${SNAP_COL}`}>
                      {lang === "es" ? "GANADOR" : "WINNER"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A344B]">
                  {EP05_CHALLENGES.map((ch) => {
                    const selected = ep05ChallengeN === ch.n;
                    return (
                      <tr
                        key={ch.n}
                        onClick={() => setEp05ChallengeN(ch.n)}
                        className={`group/row cursor-pointer transition ${
                          selected ? "bg-[#1A2132]" : "hover:bg-[#1A2132]/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#00E5FF] max-sm:hidden">
                          0{ch.n}
                        </td>
                        <td className={`py-3 px-4 ${pinCell(selected)}`}>
                          <div className="font-display font-bold text-white text-sm">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                            {lang === "es" ? ch.fun_fact_es : ch.fun_fact_en}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#00E5FF]">
                            {ch.argon.min}&nbsp;min · ${ch.argon.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.argon.fps, ch.argon.fps_en)} · {ch.argon.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#C084FC]">
                            {ch.opus.min}&nbsp;min · ${ch.opus.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.opus.fps, ch.opus.fps_en)} · {ch.opus.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#10B981]">
                            {ch.astra.min}&nbsp;min · ${ch.astra.usd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-[#CBD5E1]">
                            {fpsNote(ch.astra.fps, ch.astra.fps_en)} · {ch.astra.lines} LOC
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFD100]">
                          {lang === "es" ? ch.winner_label_es : ch.winner_label_en}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroller>
          </div>

          {/* Visor Interactivo de los 20 Simuladores 3D de EP05 */}
          {(() => {
            const cur =
              EP05_CHALLENGES.find((c) => c.n === ep05ChallengeN) ||
              EP05_CHALLENGES[0];
            const name = lang === "es" ? cur.name_es : cur.name_en;
            return (
              <div className="bg-[#111622] border-2 border-[#10B981] shadow-[6px_6px_0_#040508] overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[10px] text-[#10B981]">
                      {lang === "es" ? cur.world_es : cur.world_en}
                    </div>
                    <h3 className="font-display text-xl font-black text-white mt-1">
                      0{cur.n}. {name}
                    </h3>
                    <p className="text-xs text-[#FFD100] mt-1">
                      {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    {(["triple", "argon", "opus", "astra", ...(cur.argon.rescuedDemoUrl ? (["rescue"] as const) : [])] as Ep05Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEp05Mode(m)}
                        className={`px-3 py-1.5 font-bold border cursor-pointer ${
                          ep05Mode === m
                            ? "bg-[#10B981] text-[#090B10] border-[#090B10]"
                            : "bg-[#131824] text-white border-[#2A344B]"
                        }`}
                      >
                        {m === "triple"
                          ? lang === "es"
                            ? "3 GIGANTES LADO A LADO"
                            : "3 GIANTS SIDE BY SIDE"
                          : m === "argon"
                          ? "GEMINI 4 ARGON"
                          : m === "opus"
                          ? "CLAUDE OPUS 5.5"
                          : m === "astra"
                          ? "GPT-6 ASTRA"
                          : lang === "es"
                          ? "ARGON RESCATADO (60 FPS)"
                          : "ARGON RESCUED (60 FPS)"}
                      </button>
                    ))}
                    <button
                      onClick={() => handleJumpToArena("ep05", cur.n)}
                      className="px-3 py-1.5 bg-[#FFD100] text-[#090B10] font-bold border border-[#090B10] cursor-pointer"
                    >
                      {lang === "es" ? "Abrir en Arena →" : "Open in Arena →"}
                    </button>
                  </div>
                </div>

                {ep05Mode === "triple" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#00E5FF] font-bold">
                          GEMINI 4 ARGON (${cur.argon.usd.toFixed(2)} · {cur.argon.min}m)
                        </span>
                        <a
                          href={cur.argon.rescuedDemoUrl || cur.argon.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5FF] underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe
                        allowFullScreen
                        src={cur.argon.rescuedDemoUrl || cur.argon.demoUrl}
                        title={`Argon: ${name}`}
                        className="w-full h-[500px] border-0 bg-[#090B10]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#C084FC] font-bold">
                          CLAUDE OPUS 5.5 (${cur.opus.usd.toFixed(2)} · {cur.opus.min}m)
                        </span>
                        <a
                          href={cur.opus.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C084FC] underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe
                        allowFullScreen
                        src={cur.opus.demoUrl}
                        title={`Opus: ${name}`}
                        className="w-full h-[500px] border-0 bg-[#090B10]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between font-mono-hud text-xs">
                        <span className="text-[#10B981] font-bold">
                          GPT-6 ASTRA (${cur.astra.usd.toFixed(2)} · {cur.astra.min}m)
                        </span>
                        <a
                          href={cur.astra.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] underline"
                        >
                          {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                        </a>
                      </div>
                      <iframe
                        allowFullScreen
                        src={cur.astra.demoUrl}
                        title={`Astra: ${name}`}
                        className="w-full h-[500px] border-0 bg-[#090B10]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <iframe
                      allowFullScreen
                      src={
                        ep05Mode === "argon"
                          ? cur.argon.demoUrl
                          : ep05Mode === "rescue"
                          ? cur.argon.rescuedDemoUrl || cur.argon.demoUrl
                          : ep05Mode === "opus"
                          ? cur.opus.demoUrl
                          : cur.astra.demoUrl
                      }
                      title={`${ep05Mode}: ${name}`}
                      className="w-full h-[640px] border-0 bg-[#090B10]"
                    />
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

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
          <div className={`bg-[#111622] border-2 border-[#00E5FF]/30 ${PIN_CARD_OVERFLOW} shadow-[4px_4px_0_#040508]`}>
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
            <TableScroller label={lang === "es" ? "Matriz comparativa EP03" : "EP03 comparative matrix"}>
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
            </TableScroller>
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
          <div className={`bg-[#111622] border-2 border-[#00E5FF]/25 ${PIN_CARD_OVERFLOW} shadow-[4px_4px_0_#040508]`}>
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
            <TableScroller
              label={
                isEp02
                  ? lang === "es" ? "Matriz comparativa EP02" : "EP02 comparative matrix"
                  : lang === "es" ? "Matriz comparativa EP01" : "EP01 comparative matrix"
              }
            >
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
            </TableScroller>
          </div>
        </div>
      )}
    </div>
  );
}
