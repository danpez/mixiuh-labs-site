"use client";

import { useState } from "react";
import { EP03_CHALLENGES } from "@/data/ep03Data";
import { EP04_CHALLENGES } from "@/data/ep04Data";
import { EP05_CHALLENGES } from "@/data/ep05Data";
import { EP06_CHALLENGES } from "@/data/ep06Data";
import { EP07_CHALLENGES } from "@/data/ep07Data";
import { EP08_CHALLENGES } from "@/data/ep08Data";
import { EP09_CHALLENGES } from "@/data/ep09Data";
import { EP10_CHALLENGES } from "@/data/ep10Data";
import { EP11_CHALLENGES, EP11_THINKING_LEVELS } from "@/data/ep11Data";
import { EP12_CHALLENGES } from "@/data/ep12Data";
import { EP13_CHALLENGES, EP13_R04_MODULAR } from "@/data/ep13Data";

export interface ArenaLatestProps {
  lang: "es" | "en";
  /** EP13: Gemini 4 Ecosystem + Orchestrator. EP12..EP03: previous labs. */
  episode: "ep13" | "ep12" | "ep11" | "ep10" | "ep09" | "ep08" | "ep07" | "ep06" | "ep05" | "ep04" | "ep03";
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
  ep03ChallengeN: number;
  setEp03ChallengeN: (n: number) => void;
  navigateToView: (
    view: "dossiers",
    ep: "ep13" | "ep12" | "ep11" | "ep10" | "ep09" | "ep08" | "ep07" | "ep06" | "ep05" | "ep04" | "ep03"
  ) => void;
}

/**
 * Arena of the newest episodes (EP13 through EP03): challenge picker and live demos.
 * Loaded on demand, like the EP02/EP01 arena, so their data stays off the home page.
 * The Arena view supplies the page's <h1>, so the challenge title here is an <h2>.
 */
export default function ArenaLatest({
  lang,
  episode,
  ep13ChallengeN = 4,
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
  ep03ChallengeN,
  setEp03ChallengeN,
  navigateToView,
}: ArenaLatestProps) {
  const [showRescuedArgon, setShowRescuedArgon] = useState(true);
  const [showRecoveredCarbon, setShowRecoveredCarbon] = useState(true);
  const [ep06ViewMode, setEp06ViewMode] = useState<"arena" | "clones">("arena");
  const [ep10ViewMode, setEp10ViewMode] = useState<"arena" | "builds">("arena");
  const [ep11ViewMode, setEp11ViewMode] = useState<"arena" | "builds" | "levels">("arena");
  const [ep11LevelKey, setEp11LevelKey] = useState<"low" | "medium" | "high" | "xhigh">("xhigh");
  const [ep12ViewMode, setEp12ViewMode] = useState<"arena" | "builds">("arena");
  // English mode shows the English twin of a note where the data has one
  const fpsNote = (note: string, note_en?: string) =>
    lang === "es" ? note : (note_en ?? note);

  if (episode === "ep13") {
    const isModular = ep13ChallengeN === 4;
    const curSolo = EP13_CHALLENGES.find((c) => c.n === ep13ChallengeN) || EP13_CHALLENGES[0];
    const title = isModular
      ? lang === "es"
        ? EP13_R04_MODULAR.name_es
        : EP13_R04_MODULAR.name_en
      : lang === "es"
      ? curSolo.name_es
      : curSolo.name_en;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP13" : "EP13 challenges"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
        >
          {EP13_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp13ChallengeN(ch.n)}
              aria-pressed={ep13ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep13ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#22D3EE]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#22D3EE] font-bold">R0{ch.n}</span>
                <span className="text-[#FFD100] font-bold">{ch.winner.toUpperCase()}</span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
          <button
            onClick={() => setEp13ChallengeN(4)}
            aria-pressed={ep13ChallengeN === 4}
            className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
              ep13ChallengeN === 4
                ? "bg-[#1A2132] border-[#FFD100]"
                : "bg-[#111622] border-[#2A344B]"
            }`}
          >
            <div className="flex items-center justify-between font-mono-hud text-[10px]">
              <span className="text-[#FFD100] font-bold">R04 · MODULAR</span>
              <span className="text-[#10B981] font-bold">ORCHESTRATOR 2X</span>
            </div>
            <div className="font-display text-xs font-bold text-white mt-1 truncate">
              {lang === "es" ? EP13_R04_MODULAR.name_es : EP13_R04_MODULAR.name_en}
            </div>
          </button>
        </div>

        <div className="bg-[#090B10] border-2 border-[#22D3EE] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP13 R0{isModular ? 4 : curSolo.n}: {title}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {isModular
                  ? lang === "es"
                    ? EP13_R04_MODULAR.fun_fact_es
                    : EP13_R04_MODULAR.fun_fact_en
                  : lang === "es"
                  ? curSolo.fun_fact_es
                  : curSolo.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {isModular
                  ? lang === "es"
                    ? EP13_R04_MODULAR.verdict_es
                    : EP13_R04_MODULAR.verdict_en
                  : lang === "es"
                  ? curSolo.verdict_es
                  : curSolo.verdict_en}
              </p>
            </div>
            <button
              onClick={() => navigateToView("dossiers", "ep13")}
              className="px-3.5 py-1.5 bg-[#FFD100] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
            >
              {lang === "es" ? "Ver Guía y Dossier EP13 →" : "Open Full EP13 Dossier →"}
            </button>
          </div>

          {isModular ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#FFD100] font-bold">
                    ORCHESTRATOR NEON ({EP13_R04_MODULAR.orchestrator.min}m · {EP13_R04_MODULAR.orchestrator.lines} LOC)
                  </span>
                  <a href={EP13_R04_MODULAR.orchestrator.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#FFD100] border border-[#FFD100]/50 text-[10px] font-bold">
                    {lang === "es" ? EP13_R04_MODULAR.orchestrator.testsLabel_es : EP13_R04_MODULAR.orchestrator.testsLabel_en} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={EP13_R04_MODULAR.orchestrator.demoUrl} title={`Orchestrator Neon: ${title}`} className="w-full h-[560px] border-0 bg-[#090B10]" />
              </div>
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#22D3EE] font-bold">
                    NEON XHIGH SOLO ({EP13_R04_MODULAR.neon_solo.min}m · {EP13_R04_MODULAR.neon_solo.lines} LOC)
                  </span>
                  <a href={EP13_R04_MODULAR.neon_solo.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#22D3EE] border border-[#22D3EE]/50 text-[10px] font-bold">
                    {lang === "es" ? EP13_R04_MODULAR.neon_solo.testsLabel_es : EP13_R04_MODULAR.neon_solo.testsLabel_en} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={EP13_R04_MODULAR.neon_solo.demoUrl} title={`Neon Solo: ${title}`} className="w-full h-[560px] border-0 bg-[#090B10]" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#22D3EE] font-bold">
                    NEON (${curSolo.neon.usd.toFixed(2)} · {curSolo.neon.min}m)
                  </span>
                  <a href={curSolo.neon.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#22D3EE] border border-[#22D3EE]/50 text-[10px] font-bold">
                    {fpsNote(curSolo.neon.fps, curSolo.neon.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={curSolo.neon.demoUrl} title={`Gemini 4 Neon: ${title}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#B794F6] font-bold">
                    ARGON (${curSolo.argon.usd.toFixed(2)} · {curSolo.argon.min}m)
                  </span>
                  <a href={curSolo.argon.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#B794F6] border border-[#B794F6]/50 text-[10px] font-bold">
                    {fpsNote(curSolo.argon.fps, curSolo.argon.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={curSolo.argon.demoUrl} title={`Gemini 4 Argon: ${title}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                    HYDROGEN (${curSolo.hydrogen.usd.toFixed(2)} · {curSolo.hydrogen.min}m)
                  </span>
                  <a href={curSolo.hydrogen.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#38BDF8] border border-[#38BDF8]/50 text-[10px] font-bold">
                    {fpsNote(curSolo.hydrogen.fps, curSolo.hydrogen.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={curSolo.hydrogen.demoUrl} title={`Gemini 4 Hydrogen: ${title}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (episode === "ep12") {
    const cur =
      EP12_CHALLENGES.find((c) => c.n === ep12ChallengeN) || EP12_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;
    const haikuUrl = cur.haiku.rescuedDemoUrl || cur.haiku.demoUrl;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP12" : "EP12 challenges"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {EP12_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp12ChallengeN(ch.n)}
              aria-pressed={ep12ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep12ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#10B981]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#10B981] font-bold">R0{ch.n}</span>
                <span className="text-[#FFD100] font-bold">
                  {ch.arena.arenaWinner.toUpperCase()}
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#10B981] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP12 R0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEp12ViewMode("arena")}
                className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                  ep12ViewMode === "arena"
                    ? "bg-[#10B981] text-[#090B10]"
                    : "bg-[#111622] text-[#10B981] border-[#10B981]"
                }`}
              >
                {lang === "es"
                  ? "FASE B · ARENA 3 IAS EN VIVO"
                  : "PHASE B · 3-WAY LIVE ARENA"}
              </button>
              <button
                onClick={() => setEp12ViewMode("builds")}
                className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                  ep12ViewMode === "builds"
                    ? "bg-[#38BDF8] text-[#090B10]"
                    : "bg-[#111622] text-[#38BDF8] border-[#38BDF8]"
                }`}
              >
                {lang === "es"
                  ? "FASE A · 3 MODELOS LADO A LADO"
                  : "PHASE A · 3 BUILDS SIDE BY SIDE"}
              </button>
              <button
                onClick={() => navigateToView("dossiers", "ep12")}
                className="px-3.5 py-1.5 bg-[#FFD100] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es" ? "Ver Dossier Completo EP12 →" : "Open Full EP12 Dossier →"}
              </button>
            </div>
          </div>

          {ep12ViewMode === "arena" ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="text-[#FFD100] font-bold">
                  {lang === "es" ? cur.arena.score_es : cur.arena.score_en}
                </span>
                <div className="flex items-center gap-3">
                  <a href={cur.arena.logUrl} target="_blank" rel="noopener noreferrer" className="text-[#10B981] font-bold underline">
                    {lang === "es" ? "Resumen JSON ↗" : "JSON Summary ↗"}
                  </a>
                  <a href={cur.arena.arenaUrl} target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] font-bold underline">
                    {lang === "es" ? "Abrir Arena en Pantalla Completa ↗" : "Open Arena Fullscreen ↗"}
                  </a>
                </div>
              </div>
              <iframe
                allowFullScreen
                src={cur.arena.arenaUrl}
                title={`EP12 Live Arena: ${name}`}
                className="w-full h-[640px] border-0 bg-[#090B10]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                    HYDROGEN (${cur.hydrogen.usd.toFixed(2)} · {cur.hydrogen.min}m)
                  </span>
                  <a href={cur.hydrogen.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#38BDF8] border border-[#38BDF8]/50 text-[10px] font-bold">
                    {fpsNote(cur.hydrogen.fps, cur.hydrogen.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={cur.hydrogen.demoUrl} title={`Hydrogen: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>

              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#FB923C] font-bold">
                    HAIKU 5.5 ({cur.haiku.rescuedLines ? `Rescate ${cur.haiku.rescuedLines} LOC` : `${cur.haiku.lines} LOC`})
                  </span>
                  <a href={haikuUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#FB923C] border border-[#FB923C]/50 text-[10px] font-bold">
                    {fpsNote(cur.haiku.fps, cur.haiku.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={haikuUrl} title={`Haiku 5.5: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>

              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#10B981] font-bold">
                    GPT-6 LUNA (${cur.luna.usd.toFixed(2)} · {cur.luna.min}m)
                  </span>
                  <a href={cur.luna.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#10B981] border border-[#10B981]/50 text-[10px] font-bold">
                    {fpsNote(cur.luna.fps, cur.luna.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={cur.luna.demoUrl} title={`GPT-6 Luna: ${name}`} className="w-full h-[540px] border-0 bg-[#090B10]" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (episode === "ep11") {
    const cur =
      EP11_CHALLENGES.find((c) => c.n === ep11ChallengeN) || EP11_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;
    const effectiveMode =
      cur.n === 1 && ep11ViewMode === "levels"
        ? "levels"
        : cur.arena && ep11ViewMode === "arena"
        ? "arena"
        : "builds";

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP11" : "EP11 challenges"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {EP11_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp11ChallengeN(ch.n)}
              aria-pressed={ep11ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep11ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#38BDF8]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#38BDF8] font-bold">R0{ch.n}</span>
                <span className="text-[#FFD100] font-bold">
                  {ch.arena ? `ARENA: ${ch.arena.arenaWinner.toUpperCase()}` : `FASE A: ${ch.build_winner.toUpperCase()}`}
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#38BDF8] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP11 R0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {cur.n === 1 && (
                <button
                  onClick={() => setEp11ViewMode("levels")}
                  className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                    effectiveMode === "levels"
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#FFD100] border-[#FFD100]"
                  }`}
                >
                  {lang === "es" ? "4 NIVELES DE PENSAMIENTO" : "4 THINKING LEVELS"}
                </button>
              )}
              {cur.arena && (
                <button
                  onClick={() => setEp11ViewMode("arena")}
                  className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                    effectiveMode === "arena"
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#FFD100] border-[#FFD100]"
                  }`}
                >
                  {lang === "es" ? "FASE B · ARENA IA VS IA" : "PHASE B · LIVE ARENA"}
                </button>
              )}
              <button
                onClick={() => setEp11ViewMode("builds")}
                className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                  effectiveMode === "builds"
                    ? "bg-[#38BDF8] text-[#090B10]"
                    : "bg-[#111622] text-[#38BDF8] border-[#38BDF8]"
                }`}
              >
                {lang === "es" ? "FASE A · 2 MODELOS LADO A LADO" : "PHASE A · 2 MODELS SIDE BY SIDE"}
              </button>
              <button
                onClick={() => navigateToView("dossiers", "ep11")}
                className="px-3.5 py-1.5 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es" ? "Ver Dossier Completo EP11 →" : "Open Full EP11 Dossier →"}
              </button>
            </div>
          </div>

          {effectiveMode === "levels" && cur.n === 1 ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                <div className="flex flex-wrap gap-2">
                  {EP11_THINKING_LEVELS.map((lvl) => (
                    <button
                      key={lvl.key}
                      onClick={() => setEp11LevelKey(lvl.key)}
                      className={`px-2.5 py-1 font-bold border cursor-pointer ${
                        ep11LevelKey === lvl.key
                          ? "bg-[#38BDF8] text-[#090B10] border-[#090B10]"
                          : "bg-[#111622] text-white border-[#2A344B]"
                      }`}
                    >
                      {lang === "es" ? lvl.label_es : lvl.label_en} (${lvl.usd.toFixed(2)})
                    </button>
                  ))}
                </div>
                {(() => {
                  const curLvl = EP11_THINKING_LEVELS.find((l) => l.key === ep11LevelKey) || EP11_THINKING_LEVELS[3];
                  return (
                    <a href={curLvl.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] font-bold underline">
                      {lang === "es" ? "Pantalla Completa ↗" : "Fullscreen ↗"}
                    </a>
                  );
                })()}
              </div>
              {(() => {
                const curLvl = EP11_THINKING_LEVELS.find((l) => l.key === ep11LevelKey) || EP11_THINKING_LEVELS[3];
                return (
                  <>
                    <div className="px-4 py-2 bg-[#111622] border-b border-[#2A344B] font-mono-hud text-xs text-[#FFD100]">
                      {curLvl.sec}s ({curLvl.min}m) · {curLvl.outTokens.toLocaleString()} out · {curLvl.lines} LOC —{" "}
                      {lang === "es" ? curLvl.summary_es : curLvl.summary_en}
                    </div>
                    <iframe allowFullScreen src={curLvl.demoUrl} title={`Hydrogen ${curLvl.key}`} className="w-full h-[580px] border-0 bg-[#090B10]" />
                  </>
                );
              })()}
            </div>
          ) : effectiveMode === "arena" && cur.arena ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="text-[#FFD100] font-bold">
                  {lang === "es" ? cur.arena.score_es : cur.arena.score_en}
                </span>
                <div className="flex items-center gap-3">
                  <a href={cur.arena.logUrl} target="_blank" rel="noopener noreferrer" className="text-[#10B981] font-bold underline">
                    {lang === "es" ? "Resumen JSON ↗" : "JSON Summary ↗"}
                  </a>
                  <a href={cur.arena.arenaUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] font-bold underline">
                    {lang === "es" ? "Abrir Arena en Pantalla Completa ↗" : "Open Arena Fullscreen ↗"}
                  </a>
                </div>
              </div>
              <iframe allowFullScreen src={cur.arena.arenaUrl} title={`EP11 Live Arena: ${name}`} className="w-full h-[640px] border-0 bg-[#090B10]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                    GEMINI 4 HYDROGEN (${cur.hydrogen.usd.toFixed(2)} · {cur.hydrogen.min}m)
                  </span>
                  <a href={cur.hydrogen.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#38BDF8] border border-[#38BDF8]/50 text-[10px] font-bold">
                    {fpsNote(cur.hydrogen.fps, cur.hydrogen.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={cur.hydrogen.demoUrl} title={`Hydrogen: ${name}`} className="w-full h-[560px] border-0 bg-[#090B10]" />
              </div>

              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#FBBF24] font-bold">
                    GEMINI 3.8 FLASH (${cur.flash.usd.toFixed(2)} · {cur.flash.min}m)
                  </span>
                  <a href={cur.flash.demoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-[#131824] text-[#FBBF24] border border-[#FBBF24]/50 text-[10px] font-bold">
                    {fpsNote(cur.flash.fps, cur.flash.fps_en)} ↗
                  </a>
                </div>
                <iframe allowFullScreen src={cur.flash.demoUrl} title={`Flash 3.8: ${name}`} className="w-full h-[560px] border-0 bg-[#090B10]" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (episode === "ep10") {
    const cur =
      EP10_CHALLENGES.find((c) => c.n === ep10ChallengeN) || EP10_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;
    const effectiveMode = cur.arena ? ep10ViewMode : "builds";

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP10" : "EP10 challenges"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {EP10_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp10ChallengeN(ch.n)}
              aria-pressed={ep10ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep10ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#FFD100]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#FFD100] font-bold">R0{ch.n}</span>
                <span className="text-[#00E5FF] font-bold">
                  {ch.arena
                    ? `ARENA: ${ch.arena.arenaWinner === "fable52" ? "FABLE 5.2" : "CARBON"}`
                    : `FASE A: ${ch.build_winner === "fable52" ? "FABLE 5.2" : "CARBON"}`}
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#FFD100] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP10 R0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {cur.arena && (
                <button
                  onClick={() => setEp10ViewMode("arena")}
                  className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                    effectiveMode === "arena"
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#FFD100] border-[#FFD100]"
                  }`}
                >
                  {lang === "es"
                    ? "FASE B · ARENA IA VS IA EN VIVO"
                    : "PHASE B · LIVE AI VS AI ARENA"}
                </button>
              )}
              <button
                onClick={() => setEp10ViewMode("builds")}
                className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                  effectiveMode === "builds"
                    ? "bg-[#00E5FF] text-[#090B10]"
                    : "bg-[#111622] text-[#00E5FF] border-[#00E5FF]"
                }`}
              >
                {lang === "es"
                  ? "FASE A · 2 SIMULADORES LADO A LADO"
                  : "PHASE A · 2 BUILDS SIDE BY SIDE"}
              </button>
              <button
                onClick={() => navigateToView("dossiers", "ep10")}
                className="px-3.5 py-1.5 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es"
                  ? "Ver Dossier Completo EP10 →"
                  : "Open Full EP10 Dossier →"}
              </button>
            </div>
          </div>

          {effectiveMode === "arena" && cur.arena ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="text-[#FFD100] font-bold">
                  {lang === "es" ? cur.arena.score_es : cur.arena.score_en} ·{" "}
                  {cur.arena.loggedActions}{" "}
                  {lang === "es" ? "jugadas en log JSON" : "logged JSON plays"}
                </span>
                <div className="flex items-center gap-3">
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
                    {lang === "es"
                      ? "Abrir Arena en Pantalla Completa ↗"
                      : "Open Arena Fullscreen ↗"}
                  </a>
                </div>
              </div>
              <iframe
                allowFullScreen
                src={cur.arena.arenaUrl}
                title={`EP10 Live Arena: ${name}`}
                className="w-full h-[640px] border-0 bg-[#090B10]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                    GEMINI 4 CARBON (${cur.carbon.usd.toFixed(2)} · {cur.carbon.min}&nbsp;min)
                  </span>
                  <a
                    href={cur.carbon.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#38BDF8] border border-[#38BDF8]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.carbon.fps, cur.carbon.fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={cur.carbon.demoUrl}
                  title={`Gemini 4 Carbon: ${name}`}
                  className="w-full h-[560px] border-0 bg-[#090B10]"
                />
              </div>

              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#FB923C] font-bold">
                    CLAUDE FABLE 5.2 (${cur.fable52.usd.toFixed(2)} · {cur.fable52.min}&nbsp;min)
                  </span>
                  <a
                    href={cur.fable52.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#FB923C] border border-[#FB923C]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.fable52.fps, cur.fable52.fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={cur.fable52.demoUrl}
                  title={`Claude Fable 5.2: ${name}`}
                  className="w-full h-[560px] border-0 bg-[#090B10]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (episode === "ep09") {
    const cur =
      EP09_CHALLENGES.find((c) => c.n === ep09ChallengeN) || EP09_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP09" : "EP09 challenges"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
        >
          {EP09_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp09ChallengeN(ch.n)}
              aria-pressed={ep09ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep09ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#FB923C]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#FB923C] font-bold">P0{ch.n}</span>
                <span className="text-[#FFD100] font-bold">
                  {ch.winner === "fable52" ? "FABLE 5.2 WIN" : "OPUS 5.5 WIN"}
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#FB923C] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP09 P0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <button
              onClick={() => navigateToView("dossiers", "ep09")}
              className="px-3.5 py-1.5 bg-[#FB923C] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
            >
              {lang === "es"
                ? "Ver Dossier Completo EP09 →"
                : "Open Full EP09 Dossier →"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#FB923C] font-bold">
                  CLAUDE FABLE 5.2 (${cur.fable52.usd.toFixed(2)} · {cur.fable52.min}&nbsp;min)
                </span>
                <a
                  href={cur.fable52.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#FB923C] border border-[#FB923C]/50 text-[10px] font-bold"
                >
                  {fpsNote(cur.fable52.fps, cur.fable52.fps_en)} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={cur.fable52.demoUrl}
                title={`Claude Fable 5.2: ${name}`}
                className="w-full h-[560px] border-0 bg-[#090B10]"
              />
            </div>

            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#C084FC] font-bold">
                  CLAUDE OPUS 5.5 (${cur.opus55.usd.toFixed(2)} · {cur.opus55.min}&nbsp;min)
                </span>
                <a
                  href={cur.opus55.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#C084FC] border border-[#C084FC]/50 text-[10px] font-bold"
                >
                  {fpsNote(cur.opus55.fps, cur.opus55.fps_en)} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={cur.opus55.demoUrl}
                title={`Claude Opus 5.5: ${name}`}
                className="w-full h-[560px] border-0 bg-[#090B10]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (episode === "ep08") {
    const cur =
      EP08_CHALLENGES.find((c) => c.n === ep08ChallengeN) || EP08_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;
    const carbonUrl =
      showRecoveredCarbon && cur.carbon.rescuedDemoUrl
        ? cur.carbon.rescuedDemoUrl
        : cur.carbon.demoUrl;
    const carbonFpsText =
      showRecoveredCarbon && cur.carbon.rescuedFps
        ? fpsNote(cur.carbon.rescuedFps, cur.carbon.rescuedFps_en)
        : fpsNote(cur.carbon.fps, cur.carbon.fps_en);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP08" : "EP08 challenges"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
        >
          {EP08_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp08ChallengeN(ch.n)}
              aria-pressed={ep08ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep08ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#38BDF8]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#38BDF8] font-bold">P0{ch.n}</span>
                <span className="text-[#FFD100] font-bold">
                  {ch.carbon.rescuedDemoUrl
                    ? lang === "es"
                      ? "ARGON WIN + RECUPERACION"
                      : "ARGON WIN + RECOVERY"
                    : ch.winner === "carbon"
                    ? "CARBON WIN"
                    : "ARGON WIN"}
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#38BDF8] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP08 P0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {cur.carbon.rescuedDemoUrl && (
                <button
                  onClick={() => setShowRecoveredCarbon((v) => !v)}
                  className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                    showRecoveredCarbon
                      ? "bg-[#10B981] text-[#090B10]"
                      : "bg-[#111622] text-[#10B981] border-[#10B981]"
                  }`}
                >
                  {showRecoveredCarbon
                    ? lang === "es"
                      ? "CARBON: VIENDO RECUPERACION 60 FPS (VER ZERO-SHOT)"
                      : "CARBON: VIEWING 60 FPS RECOVERY (SHOW ZERO-SHOT)"
                    : lang === "es"
                    ? "CARBON: VIENDO ZERO-SHOT (ACTIVAR RECUPERACION -1 LETRA)"
                    : "CARBON: VIEWING ZERO-SHOT (ENABLE -1 LETTER RECOVERY)"}
                </button>
              )}
              <button
                onClick={() => navigateToView("dossiers", "ep08")}
                className="px-3.5 py-1.5 bg-[#38BDF8] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es"
                  ? "Ver Dossier Completo EP08 →"
                  : "Open Full EP08 Dossier →"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#38BDF8] font-bold">
                  GEMINI 4 CARBON (${cur.carbon.usd.toFixed(2)} · {cur.carbon.min}&nbsp;min)
                </span>
                <a
                  href={carbonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#38BDF8] border border-[#38BDF8]/50 text-[10px] font-bold"
                >
                  {carbonFpsText} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={carbonUrl}
                title={`Gemini 4 Carbon: ${name}`}
                className="w-full h-[560px] border-0 bg-[#090B10]"
              />
            </div>

            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#A855F7] font-bold">
                  GEMINI 4 ARGON (${cur.argon.usd.toFixed(2)} · {cur.argon.min}&nbsp;min)
                </span>
                <a
                  href={cur.argon.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#A855F7] border border-[#A855F7]/50 text-[10px] font-bold"
                >
                  {fpsNote(cur.argon.fps, cur.argon.fps_en)} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={cur.argon.demoUrl}
                title={`Gemini 4 Argon: ${name}`}
                className="w-full h-[560px] border-0 bg-[#090B10]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (episode === "ep07") {
    const cur =
      EP07_CHALLENGES.find((c) => c.n === ep07ChallengeN) || EP07_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP07" : "EP07 challenges"}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {EP07_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp07ChallengeN(ch.n)}
              aria-pressed={ep07ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep07ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#38BDF8]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#38BDF8] font-bold">{ch.code}</span>
                <span className="text-[#10B981] font-bold">
                  OMNI 1.2 ({ch.omni12.score})
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#38BDF8] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                EP07 {cur.code}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <button
              onClick={() => navigateToView("dossiers", "ep07")}
              className="px-btn bg-[#38BDF8] text-[#090B10] px-3 py-2 text-xs font-bold"
            >
              {lang === "es" ? "Ver Dossier Completo EP07 →" : "Full EP07 Dossier →"}
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-[#090B10]">
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
        </div>
      </div>
    );
  }

  if (episode === "ep06") {
    const cur =
      EP06_CHALLENGES.find((c) => c.n === ep06ChallengeN) || EP06_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP06" : "EP06 challenges"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
        >
          {EP06_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp06ChallengeN(ch.n)}
              aria-pressed={ep06ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep06ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#00E5FF]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#00E5FF] font-bold">R0{ch.n}</span>
                <span className="text-[#FFD100] font-bold">
                  CLON: {ch.clone_winner.toUpperCase()} · ARENA: {ch.arena_winner.toUpperCase()}
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#00E5FF] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                {lang === "es" ? "EP06 Clasico" : "EP06 Classic"} 0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEp06ViewMode("arena")}
                className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                  ep06ViewMode === "arena"
                    ? "bg-[#FFD100] text-[#090B10]"
                    : "bg-[#111622] text-[#FFD100] border-[#FFD100]"
                }`}
              >
                {lang === "es"
                  ? "PELEA EN VIVO (3 IAS EN EL MISMO MAPA)"
                  : "LIVE ARENA BATTLE (3 AIS IN SAME MAP)"}
              </button>
              <button
                onClick={() => setEp06ViewMode("clones")}
                className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                  ep06ViewMode === "clones"
                    ? "bg-[#00E5FF] text-[#090B10]"
                    : "bg-[#111622] text-[#00E5FF] border-[#00E5FF]"
                }`}
              >
                {lang === "es"
                  ? "3 CLONES ZERO-SHOT LADO A LADO"
                  : "3 ZERO-SHOT CLONES SIDE-BY-SIDE"}
              </button>
              <button
                onClick={() => navigateToView("dossiers", "ep06")}
                className="px-3.5 py-1.5 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es"
                  ? "Ver Dossier Completo EP06 →"
                  : "Open Full EP06 Dossier →"}
              </button>
            </div>
          </div>

          {ep06ViewMode === "arena" ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-[#090B10] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="text-[#FFD100] font-bold">
                  {lang === "es"
                    ? `ARENA OFICIAL EN VIVO (JUEGO GANADOR) · ${cur.winner_label_es}`
                    : `OFFICIAL LIVE ARENA (WINNING CLONE) · ${cur.winner_label_en}`}
                </span>
                <div className="flex items-center gap-3">
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
                    {lang === "es" ? "Abrir Arena en Pantalla Completa ↗" : "Open Arena Fullscreen ↗"}
                  </a>
                </div>
              </div>
              <iframe
                allowFullScreen
                src={cur.arenaDemoUrl}
                title={`Live Arena: ${name}`}
                className="w-full h-[640px] border-0 bg-[#090B10]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#00E5FF] font-bold">
                    GEMINI 4 ARGON (${cur.argon.usd.toFixed(2)} · {cur.argon.min}&nbsp;min)
                  </span>
                  <a
                    href={cur.argon.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#00E5FF] border border-[#00E5FF]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.argon.fps, cur.argon.fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={cur.argon.demoUrl}
                  title={`Gemini 4 Argon High: ${name}`}
                  className="w-full h-[520px] border-0 bg-[#090B10]"
                />
              </div>

              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#C084FC] font-bold">
                    CLAUDE OPUS 5.5 (${cur.opus.usd.toFixed(2)} · {cur.opus.min}&nbsp;min)
                  </span>
                  <a
                    href={cur.opus.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#C084FC] border border-[#C084FC]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.opus.fps, cur.opus.fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={cur.opus.demoUrl}
                  title={`Claude Opus 5.5 High: ${name}`}
                  className="w-full h-[520px] border-0 bg-[#090B10]"
                />
              </div>

              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#10B981] font-bold">
                    GPT-6 ASTRA (${cur.astra.usd.toFixed(2)} · {cur.astra.min}&nbsp;min)
                  </span>
                  <a
                    href={cur.astra.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#10B981] border border-[#10B981]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.astra.fps, cur.astra.fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={cur.astra.demoUrl}
                  title={`GPT-6 Astra High: ${name}`}
                  className="w-full h-[520px] border-0 bg-[#090B10]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (episode === "ep05") {
    const cur =
      EP05_CHALLENGES.find((c) => c.n === ep05ChallengeN) || EP05_CHALLENGES[0];
    const name = lang === "es" ? cur.name_es : cur.name_en;
    const argonUrl =
      showRescuedArgon && cur.argon.rescuedDemoUrl
        ? cur.argon.rescuedDemoUrl
        : cur.argon.demoUrl;
    const opusUrl = cur.opus.demoUrl;
    const astraUrl = cur.astra.demoUrl;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <div
          role="group"
          aria-label={lang === "es" ? "Retos del EP05" : "EP05 challenges"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {EP05_CHALLENGES.map((ch) => (
            <button
              key={ch.n}
              onClick={() => setEp05ChallengeN(ch.n)}
              aria-pressed={ep05ChallengeN === ch.n}
              className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
                ep05ChallengeN === ch.n
                  ? "bg-[#1A2132] border-[#10B981]"
                  : "bg-[#111622] border-[#2A344B]"
              }`}
            >
              <div className="flex items-center justify-between font-mono-hud text-[10px]">
                <span className="text-[#00E5FF] font-bold">R0{ch.n}</span>
                <span
                  className={
                    ch.winner === "astra"
                      ? "text-[#10B981] font-bold"
                      : ch.winner === "argon"
                      ? "text-[#00E5FF] font-bold"
                      : "text-[#C084FC] font-bold"
                  }
                >
                  {ch.winner.toUpperCase()} WIN
                </span>
              </div>
              <div className="font-display text-xs font-bold text-white mt-1 truncate">
                {lang === "es" ? ch.name_es : ch.name_en}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#090B10] border-2 border-[#10B981] overflow-hidden shadow-[6px_6px_0_#040508]">
          <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-3xl">
              <h2 className="font-display text-lg font-black text-white">
                {lang === "es" ? "EP05 Reto" : "EP05 Round"} 0{cur.n}: {name}
              </h2>
              <p className="text-xs text-[#FFD100] font-semibold">
                {lang === "es" ? cur.fun_fact_es : cur.fun_fact_en}
              </p>
              <p className="text-xs text-[#CBD5E1]">
                {lang === "es" ? cur.verdict_es : cur.verdict_en}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {cur.argon.rescuedDemoUrl && (
                <button
                  onClick={() => setShowRescuedArgon((v) => !v)}
                  className={`px-3 py-1.5 font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508] ${
                    showRescuedArgon
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#FFD100] border-[#FFD100]"
                  }`}
                >
                  {showRescuedArgon
                    ? lang === "es"
                      ? "ARGON: VIENDO RESCATE 60 FPS (VER 1ER INTENTO)"
                      : "ARGON: VIEWING 60 FPS RESCUE (SHOW 1ST TRY)"
                    : lang === "es"
                    ? "ARGON: VIENDO 1ER INTENTO (ACTIVAR RESCATE 60 FPS)"
                    : "ARGON: VIEWING 1ST TRY (ENABLE 60 FPS RESCUE)"}
                </button>
              )}
              <button
                onClick={() => navigateToView("dossiers", "ep05")}
                className="px-3.5 py-1.5 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es"
                  ? "Ver Dossier Completo EP05 →"
                  : "Open Full EP05 Dossier →"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
            {/* Column 1: Gemini 4 Argon High */}
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#00E5FF] font-bold">
                  GEMINI 4 ARGON (${cur.argon.usd.toFixed(2)} · {cur.argon.min}&nbsp;min)
                </span>
                <a
                  href={argonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#00E5FF] border border-[#00E5FF]/50 text-[10px] font-bold"
                >
                  {fpsNote(cur.argon.fps, cur.argon.fps_en)} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={argonUrl}
                title={`Gemini 4 Argon High: ${name}`}
                className="w-full h-[520px] border-0 bg-[#090B10]"
              />
            </div>

            {/* Column 2: Claude Opus 5.5 High */}
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#C084FC] font-bold">
                  CLAUDE OPUS 5.5 (${cur.opus.usd.toFixed(2)} · {cur.opus.min}&nbsp;min)
                </span>
                <a
                  href={opusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#C084FC] border border-[#C084FC]/50 text-[10px] font-bold"
                >
                  {fpsNote(cur.opus.fps, cur.opus.fps_en)} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={opusUrl}
                title={`Claude Opus 5.5 High: ${name}`}
                className="w-full h-[520px] border-0 bg-[#090B10]"
              />
            </div>

            {/* Column 3: GPT-6 Astra High */}
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                <span className="font-pixel text-[10px] text-[#10B981] font-bold">
                  GPT-6 ASTRA (${cur.astra.usd.toFixed(2)} · {cur.astra.min}&nbsp;min)
                </span>
                <a
                  href={astraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#131824] text-[#10B981] border border-[#10B981]/50 text-[10px] font-bold"
                >
                  {fpsNote(cur.astra.fps, cur.astra.fps_en)} ↗
                </a>
              </div>
              <iframe
                allowFullScreen
                src={astraUrl}
                title={`GPT-6 Astra High: ${name}`}
                className="w-full h-[520px] border-0 bg-[#090B10]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return episode === "ep04" ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      <div
        role="group"
        aria-label={lang === "es" ? "Retos del EP04" : "EP04 challenges"}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
      >
        {EP04_CHALLENGES.map((ch) => (
          <button
            key={ch.n}
            onClick={() => setEp04ChallengeN(ch.n)}
            aria-pressed={ep04ChallengeN === ch.n}
            className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
              ep04ChallengeN === ch.n
                ? "bg-[#1A2132] border-[#00E5FF]"
                : "bg-[#111622] border-[#2A344B]"
            }`}
          >
            <div className="flex items-center justify-between font-mono-hud text-[10px]">
              <span className="text-[#00E5FF] font-bold">R0{ch.n}</span>
              <span
                className={
                  ch.winner === "haiku"
                    ? "text-[#10B981] font-bold"
                    : ch.winner === "sonnet"
                    ? "text-[#FFD100] font-bold"
                    : "text-[#C084FC] font-bold"
                }
              >
                {ch.winner.toUpperCase()} WIN
              </span>
            </div>
            <div className="font-display text-xs font-bold text-white mt-1 truncate">
              {lang === "es" ? ch.name_es : ch.name_en}
            </div>
          </button>
        ))}
      </div>

      {(() => {
        const cur =
          EP04_CHALLENGES.find((c) => c.n === ep04ChallengeN) ||
          EP04_CHALLENGES[0];
        const haikuUrl = cur.haiku.demoUrl;
        const sonnetUrl = cur.sonnet.demoUrl;
        const opusUrl = cur.opus.demoUrl;
        const name = lang === "es" ? cur.name_es : cur.name_en;
        return (
          <div className="bg-[#090B10] border-2 border-[#00E5FF] overflow-hidden shadow-[6px_6px_0_#040508]">
            <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-black text-white">
                  {lang === "es" ? "EP04 Reto" : "EP04 Challenge"} 0{cur.n}:{" "}
                  {name}
                </h2>
                <p className="text-xs text-[#CBD5E1] mt-1">
                  {lang === "es" ? cur.verdict_es : cur.verdict_en}
                </p>
              </div>
              <button
                onClick={() => navigateToView("dossiers", "ep04")}
                className="px-3.5 py-1.5 bg-[#00E5FF] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
              >
                {lang === "es"
                  ? "Ver Dossier Completo EP04 →"
                  : "Open Full EP04 Dossier →"}
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              {/* Column 1: Claude Haiku 5.5 */}
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#10B981] font-bold">
                    CLAUDE HAIKU 5.5 (${cur.haiku.usd.toFixed(2)} · {cur.haiku.min}&nbsp;min)
                  </span>
                  <a
                    href={haikuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#10B981] border border-[#10B981]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.haiku.fps, cur.haiku.fps_en)} ↗
                  </a>
                </div>
                <iframe
                        allowFullScreen
                  src={haikuUrl}
                  title={`Claude Haiku 5.5: ${name}`}
                  className="w-full h-[520px] border-0 bg-[#090B10]"
                />
              </div>

              {/* Column 2: Claude Sonnet 5.5 */}
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#FFD100] font-bold">
                    CLAUDE SONNET 5.5 (${cur.sonnet.usd.toFixed(2)} · {cur.sonnet.min}&nbsp;min)
                  </span>
                  <a
                    href={sonnetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#FFD100] border border-[#FFD100]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.sonnet.fps, cur.sonnet.fps_en)} ↗
                  </a>
                </div>
                <iframe
                        allowFullScreen
                  src={sonnetUrl}
                  title={`Claude Sonnet 5.5: ${name}`}
                  className="w-full h-[520px] border-0 bg-[#090B10]"
                />
              </div>

              {/* Column 3: Claude Opus 5.5 */}
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#C084FC] font-bold">
                    CLAUDE OPUS 5.5 (${cur.opus.usd.toFixed(2)} · {cur.opus.min}&nbsp;min)
                  </span>
                  <a
                    href={opusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#C084FC] border border-[#A855F7]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.opus.fps, cur.opus.fps_en)} ↗
                  </a>
                </div>
                <iframe
                        allowFullScreen
                  src={opusUrl}
                  title={`Claude Opus 5.5: ${name}`}
                  className="w-full h-[520px] border-0 bg-[#090B10]"
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  ) : (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      <div
        role="group"
        aria-label={lang === "es" ? "Retos del EP03" : "EP03 challenges"}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
      >
        {EP03_CHALLENGES.map((ch) => (
          <button
            key={ch.n}
            onClick={() => setEp03ChallengeN(ch.n)}
            aria-pressed={ep03ChallengeN === ch.n}
            className={`p-3 shadow-[4px_4px_0_#040508] border text-left transition cursor-pointer ${
              ep03ChallengeN === ch.n
                ? "bg-[#1A2132] border-[#10B981]"
                : "bg-[#111622] border-[#2A344B]"
            }`}
          >
            <div className="flex items-center justify-between font-mono-hud text-[10px]">
              <span className="text-[#00E5FF] font-bold">R0{ch.n}</span>
              <span
                className={
                  ch.winner === "superkit"
                    ? "text-[#10B981] font-bold"
                    : "text-[#FFD100] font-bold"
                }
              >
                {ch.winner === "superkit" ? "KIT WIN" : "RAW WIN"}
              </span>
            </div>
            <div className="font-display text-xs font-bold text-white mt-1 truncate">
              {lang === "es" ? ch.name_es : ch.name_en}
            </div>
          </button>
        ))}
      </div>

      {(() => {
        const cur =
          EP03_CHALLENGES.find((c) => c.n === ep03ChallengeN) ||
          EP03_CHALLENGES[0];
        const vanillaUrl = `/demos/ia-sin-kit/${cur.dir}/index.html`;
        const superkitUrl = `/demos/ia-superpowers-kit/${cur.dir}/index.html`;
        const name = lang === "es" ? cur.name_es : cur.name_en;
        const rawLabel = lang === "es" ? "IA SIN KIT" : "RAW AI";
        const kitLabel = lang === "es" ? "IA + SUPERPOWERS KIT" : "AI + SUPERPOWERS KIT";
        return (
          <div className="bg-[#090B10] border-2 border-[#10B981]/50 overflow-hidden shadow-[6px_6px_0_#040508]">
            <div className="p-4 bg-[#1A2132] border-b border-[#2A344B] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-black text-white">
                  {lang === "es" ? "EP03 Reto" : "EP03 Challenge"} 0{cur.n}:{" "}
                  {name}
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  {lang === "es" ? cur.verdict_es : cur.verdict_en}
                </p>
              </div>
              <button
                onClick={() => navigateToView("dossiers", "ep03")}
                className="px-3.5 py-1.5 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer"
              >
                {lang === "es"
                  ? "Ver Dossier Completo EP03 →"
                  : "Open Full EP03 Dossier →"}
              </button>
            </div>
            {/* Each column names its run: they sit side by side from lg and stack below it */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2A344B]">
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#FFD100] font-bold">
                    {rawLabel}
                  </span>
                  <a
                    href={vanillaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#FFD100] border border-[#FFD100]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.vanilla_fps, cur.vanilla_fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={vanillaUrl}
                  title={`${lang === "es" ? "IA sin kit" : "Raw AI"}: ${name}`}
                  className="w-full h-[560px] border-0 bg-[#090B10]"
                />
              </div>
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-[#090B10] border-b border-[#2A344B] flex items-center justify-between gap-2 font-mono-hud text-xs">
                  <span className="font-pixel text-[10px] text-[#10B981] font-bold">
                    {kitLabel}
                  </span>
                  <a
                    href={superkitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-[#131824] text-[#10B981] border border-[#10B981]/50 text-[10px] font-bold"
                  >
                    {fpsNote(cur.superkit_fps, cur.superkit_fps_en)} ↗
                  </a>
                </div>
                <iframe
                  allowFullScreen
                  src={superkitUrl}
                  title={`${lang === "es" ? "IA + Superpowers Kit" : "AI + Superpowers Kit"}: ${name}`}
                  className="w-full h-[560px] border-0 bg-[#090B10]"
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
