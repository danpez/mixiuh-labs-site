"use client";

import { EP03_CHALLENGES } from "@/data/ep03Data";
import { EP04_CHALLENGES } from "@/data/ep04Data";

export interface ArenaLatestProps {
  lang: "es" | "en";
  /** EP04: the three Claude tiers side by side. EP03: raw run next to the kit run. */
  episode: "ep04" | "ep03";
  ep04ChallengeN: number;
  setEp04ChallengeN: (n: number) => void;
  ep03ChallengeN: number;
  setEp03ChallengeN: (n: number) => void;
  navigateToView: (view: "dossiers", ep: "ep04" | "ep03") => void;
}

/**
 * Arena of the newest episodes (EP04, EP03): challenge picker and live demos.
 * Loaded on demand, like the EP02/EP01 arena, so their data stays off the home page.
 * The Arena view supplies the page's <h1>, so the challenge title here is an <h2>.
 */
export default function ArenaLatest({
  lang,
  episode,
  ep04ChallengeN,
  setEp04ChallengeN,
  ep03ChallengeN,
  setEp03ChallengeN,
  navigateToView,
}: ArenaLatestProps) {
  // English mode shows the English twin of a note where the data has one
  const fpsNote = (note: string, note_en?: string) =>
    lang === "es" ? note : (note_en ?? note);

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
