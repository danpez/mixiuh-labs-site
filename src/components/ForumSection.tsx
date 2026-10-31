"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  PixelIcon,
  copyTextToClipboard,
  prefersReducedMotion,
  usePixelDialog,
} from "@mixiuh/pixel-ui";
import {
  INITIAL_FORUM_THREADS,
  INITIAL_EP02_PROPOSALS,
  type ForumCategory,
  type ForumComment,
  type ForumThread,
  type Ep02Proposal,
} from "@/data/forumData";
import { isCuratedThreadReleased } from "@/data/forumStats";
import { CHALLENGES } from "@/data/labsData";
import { EP02_CHALLENGES } from "@/data/ep02Data";
import { EP03_CHALLENGES } from "@/data/ep03Data";
import { EP04_CHALLENGES } from "@/data/ep04Data";
import {
  RELEASE_TIMESTAMPS_CST,
  getReleasedStatus,
  type ReleaseKey,
  type ReleasedState,
} from "@/data/releaseSchedule";

interface Props {
  lang: "es" | "en";
  onJumpToArena: (
    episode: "ep04" | "ep03" | "ep02" | "ep01",
    challengeN: number
  ) => void;
  released?: ReleasedState;
}

function formatInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 bg-[#090B10] border border-[#00E5FF]/30 font-mono-hud text-[#00E5FF] text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// What this browser keeps between visits. Vote counts are never stored: the
// shown count is the base count from the data files plus the visitor's flag.
const UPVOTES_KEY = "mlabs_upvotes_v1";
const PROPOSAL_VOTES_KEY = "mlabs_prop_votes_v1";
const CUSTOM_THREADS_KEY = "mlabs_custom_threads_v1";
const COMMENTS_KEY = "mlabs_comments_v1";

function readStoredJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Best effort: storage can be full or blocked (private mode, disabled cookies). */
function writeStoredJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The in-memory state still updates; it just won't survive a reload.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Saved vote flags as { [id]: true }; anything malformed is ignored. */
function readStoredFlags(key: string): Record<string, boolean> {
  const saved = readStoredJson<unknown>(key);
  const flags: Record<string, boolean> = {};
  if (isRecord(saved)) {
    for (const [id, on] of Object.entries(saved)) {
      if (on === true) flags[id] = true;
    }
  }
  return flags;
}

function toggleFlag(
  flags: Record<string, boolean>,
  id: string
): Record<string, boolean> {
  const next = { ...flags };
  if (next[id]) delete next[id];
  else next[id] = true;
  return next;
}

function isStoredComment(value: unknown): value is ForumComment {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.author === "string" &&
    typeof value.role === "string" &&
    typeof value.handle === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.body_es === "string" &&
    typeof value.body_en === "string" &&
    typeof value.upvotes === "number"
  );
}

/** Comments posted from this browser, keyed by thread id. */
function readStoredComments(): Record<string, ForumComment[]> {
  const saved = readStoredJson<unknown>(COMMENTS_KEY);
  const byThread: Record<string, ForumComment[]> = {};
  if (isRecord(saved)) {
    for (const [threadId, list] of Object.entries(saved)) {
      if (!Array.isArray(list)) continue;
      const valid = list.filter(isStoredComment);
      if (valid.length > 0) byThread[threadId] = valid;
    }
  }
  return byThread;
}

/** Checks the fields the list, search and reader need before rendering a saved thread. */
function isStoredThread(value: unknown): value is ForumThread {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title_es === "string" &&
    typeof value.title_en === "string" &&
    typeof value.excerpt_es === "string" &&
    typeof value.excerpt_en === "string" &&
    typeof value.upvotes === "number" &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === "string") &&
    Array.isArray(value.content_es) &&
    Array.isArray(value.content_en) &&
    Array.isArray(value.comments)
  );
}

/** Threads the visitor published from this browser, newest first. */
function readStoredThreads(): ForumThread[] {
  const saved = readStoredJson<unknown>(CUSTOM_THREADS_KEY);
  return Array.isArray(saved) ? saved.filter(isStoredThread) : [];
}

/** Renders its children into <body>, outside the page's z-10 foreground layer. */
function BodyPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

/** Id for a thread or comment posted from this browser (submit handlers only). */
function localPostId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

/** Today in the visitor's time zone as YYYY-MM-DD, the forum's date format. */
function localIsoDate(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Publication day of a production (YYYY-MM-DD, the date part of its CST timestamp). */
function releaseDay(key: ReleaseKey): string {
  return RELEASE_TIMESTAMPS_CST[key].slice(0, 10);
}

// Forum dates are calendar days. Formatting them in UTC keeps the same day in
// every time zone, on the server and in the browser.
const DATE_FORMATS: Record<Props["lang"], Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
  en: new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
};

/**
 * "2026-10-31" reads "31 oct 2026" / "Oct 31, 2026". Any other text, such as
 * "Justo ahora" on comments older builds saved in this browser, shows as is.
 */
function ForumDate({ value, lang }: { value: string; lang: Props["lang"] }) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return <>{value}</>;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return <>{value}</>;
  }
  return (
    <time dateTime={value} className="whitespace-nowrap">
      {DATE_FORMATS[lang].format(date)}
    </time>
  );
}

// English for the Spanish tags, model chips, comment roles and default names
// that forumData.ts and this form keep as one shared string. Keyed by the exact
// Spanish text, so an edited source string shows as written, never a stale label.
const LABELS_EN: Record<string, string> = {
  "Bug Forense": "Forensic Bug",
  "Visualizador ADN": "DNA Visualizer",
  Telemetria: "Telemetry",
  "Teoria de Numeros": "Number Theory",
  "Euclides MCD": "Euclid GCD",
  "Radar Mixiuh": "Mixiuh Radar",
  "Noticias IA": "AI News",
  Ciberseguridad: "Cybersecurity",
  "Precios API": "API Pricing",
  "Del Comentario al Codigo": "Comment to Code",
  "Streetwear IA": "AI Streetwear",
  "Benchmark Real": "Real Benchmark",
  "Arbitro · Mixiuh Labs": "Referee · Mixiuh Labs",
  "Autor del Reto Original · Instagram": "Original Challenge Author · Instagram",
  "Ingeniero WebGL": "WebGL Engineer",
  "Desarrollador C++ / JS": "C++ / JS Developer",
  "Ingeniero Invitado": "Guest Engineer",
  "Comunidad Mixiuh Labs": "Mixiuh Labs Community",
  "Miembro del Lab": "Lab Member",
};

function toEnglishLabel(text: string): string {
  const known = LABELS_EN[text];
  if (known) return known;
  const numbered = /^(Reto|Nivel) (\d+)$/.exec(text);
  if (numbered) {
    return `${numbered[1] === "Reto" ? "Challenge" : "Level"} ${numbered[2]}`;
  }
  const winner = /^Ganador: (.+)$/.exec(text);
  if (winner) return `Winner: ${toEnglishLabel(winner[1])}`;
  const proposedBy = /^Reto de (.+)$/.exec(text);
  if (proposedBy) return `Challenge by ${proposedBy[1]}`;
  return text;
}

function labelIn(lang: Props["lang"], text: string): string {
  return lang === "en" ? toEnglishLabel(text) : text;
}

/** Generated prompt threads also carry English tags; the others go through LABELS_EN. */
type ForumThreadEntry = ForumThread & { tags_en?: string[] };

function threadTags(thread: ForumThreadEntry, lang: Props["lang"]): string[] {
  if (lang === "es") return thread.tags;
  return thread.tags_en ?? thread.tags.map(toEnglishLabel);
}

// Proposal cards that describe a production's results stay hidden until it airs.
const PROPOSAL_RELEASES: Partial<Record<string, ReleaseKey>> = {
  "prop-cc01-overfit": "cc01",
  "prop-emulador-chip8": "ep04",
  "prop-raytracer-bvh": "ep04",
};

export default function ForumSection({ lang, onJumpToArena, released }: Props) {
  const rel = useMemo<ReleasedState>(
    () => released ?? getReleasedStatus(),
    [released]
  );

  // Latest published lab episode drives the copy (log range, prompt count, next vote)
  const latestEp = rel.ep04 ? 4 : rel.ep03 ? 3 : 2;
  const nextEp = String(latestEp + 1).padStart(2, "0");
  const promptCount = 10 + 6 + (rel.ep03 ? 6 : 0) + (rel.ep04 ? 6 : 0);

  // Combine curated threads with individual prompt/audit threads for released episodes only (zero spoilers)
  const defaultThreads = useMemo<ForumThreadEntry[]>(() => {
    const releasedCuratedThreads = INITIAL_FORUM_THREADS.filter((t) =>
      isCuratedThreadReleased(t, rel)
    );

    const ep04Threads: ForumThreadEntry[] = rel.ep04
      ? EP04_CHALLENGES.map((ch) => ({
          id: `thread-ep04-challenge-${ch.n}`,
          slug: `ep04-reto-${ch.n}-${ch.dir}`,
          category: "prompts",
          episode: "ep04",
          badge_es: `EP04 PROMPT Y TELEMETRIA · RETO 0${ch.n}`,
          badge_en: `EP04 PROMPT & TELEMETRY · CHALLENGE 0${ch.n}`,
          title_es: `EP04 Reto 0${ch.n} (${ch.name_es}): Haiku ($${ch.haiku.usd.toFixed(2)}) vs Sonnet ($${ch.sonnet.usd.toFixed(2)}) vs Opus ($${ch.opus.usd.toFixed(2)})`,
          title_en: `EP04 Challenge 0${ch.n} (${ch.name_en}): Haiku ($${ch.haiku.usd.toFixed(2)}) vs Sonnet ($${ch.sonnet.usd.toFixed(2)}) vs Opus ($${ch.opus.usd.toFixed(2)})`,
          excerpt_es: ch.verdict_es,
          excerpt_en: ch.verdict_en,
          author: "Kevin Gonzalez",
          authorRole_es: "Arbitro · Mixiuh Labs",
          authorRole_en: "Referee · Mixiuh Labs",
          createdAt: releaseDay("ep04"),
          readTime: "4 min",
          upvotes: 132 + (7 - ch.n) * 12,
          views: 920 + ch.n * 80,
          relatedChallengeN: ch.n,
          tags: [
            "EP04",
            `Reto 0${ch.n}`,
            ch.dir,
            `Ganador: ${ch.winner.toUpperCase()} 5.5`,
          ],
          tags_en: [
            "EP04",
            `Challenge 0${ch.n}`,
            ch.dir,
            `Winner: ${ch.winner.toUpperCase()} 5.5`,
          ],
          content_es: [
            `Categoria del reto: ${ch.world_es} — ${ch.sub_es}.`,
            `Claude Haiku 5.5: ${ch.haiku.min} min · $${ch.haiku.usd.toFixed(2)} USD · ${ch.haiku.tok} tok · ${ch.haiku.lines} lineas · ${ch.haiku.fps}.`,
            `Claude Sonnet 5.5: ${ch.sonnet.min} min · $${ch.sonnet.usd.toFixed(2)} USD · ${ch.sonnet.tok} tok · ${ch.sonnet.lines} lineas · ${ch.sonnet.fps}.`,
            `Claude Opus 5.5: ${ch.opus.min} min · $${ch.opus.usd.toFixed(2)} USD · ${ch.opus.tok} tok · ${ch.opus.lines} lineas · ${ch.opus.fps}.`,
            `Veredicto forense: ${ch.verdict_es}`,
          ],
          content_en: [
            `Challenge category: ${ch.world_en} — ${ch.sub_en}.`,
            `Claude Haiku 5.5: ${ch.haiku.min} min · $${ch.haiku.usd.toFixed(2)} USD · ${ch.haiku.tok} tok · ${ch.haiku.lines} lines · ${ch.haiku.fps_en ?? ch.haiku.fps}.`,
            `Claude Sonnet 5.5: ${ch.sonnet.min} min · $${ch.sonnet.usd.toFixed(2)} USD · ${ch.sonnet.tok} tok · ${ch.sonnet.lines} lines · ${ch.sonnet.fps_en ?? ch.sonnet.fps}.`,
            `Claude Opus 5.5: ${ch.opus.min} min · $${ch.opus.usd.toFixed(2)} USD · ${ch.opus.tok} tok · ${ch.opus.lines} lines · ${ch.opus.fps_en ?? ch.opus.fps}.`,
            `Forensic verdict: ${ch.verdict_en}`,
          ],
          comments: [],
        }))
      : [];

    const ep03Threads: ForumThreadEntry[] = rel.ep03
      ? EP03_CHALLENGES.map((ch) => ({
          id: `thread-ep03-challenge-${ch.n}`,
          slug: `ep03-reto-${ch.n}-${ch.dir}`,
          category: "prompts",
          episode: "ep03",
          badge_es: `EP03 PROMPT Y AUDITORIA · RETO 0${ch.n}`,
          badge_en: `EP03 PROMPT & AUDIT · CHALLENGE 0${ch.n}`,
          title_es: `EP03 Reto 0${ch.n} (${ch.name_es}): Prompt, Tokens (${ch.superkit_tok} vs ${ch.vanilla_tok}) y Costo ($${ch.superkit_usd.toFixed(2)} vs $${ch.vanilla_usd.toFixed(2)} USD)`,
          title_en: `EP03 Challenge 0${ch.n} (${ch.name_en}): Prompt, Tokens (${ch.superkit_tok} vs ${ch.vanilla_tok}) & Cost ($${ch.superkit_usd.toFixed(2)} vs $${ch.vanilla_usd.toFixed(2)} USD)`,
          excerpt_es: ch.verdict_es,
          excerpt_en: ch.verdict_en,
          author: "Kevin Gonzalez",
          authorRole_es: "Arbitro · Mixiuh Labs",
          authorRole_en: "Referee · Mixiuh Labs",
          createdAt: releaseDay("ep03"),
          readTime: "4 min",
          upvotes: 118 + (7 - ch.n) * 11,
          views: 840 + ch.n * 75,
          relatedChallengeN: ch.n,
          tags: [
            "EP03",
            `Reto 0${ch.n}`,
            ch.dir,
            ch.winner === "superkit"
              ? "Ganador: Superpowers Kit"
              : "Ganador: IA Sin Kit",
            ch.skill,
          ],
          tags_en: [
            "EP03",
            `Challenge 0${ch.n}`,
            ch.dir,
            ch.winner === "superkit"
              ? "Winner: Superpowers Kit"
              : "Winner: Raw AI",
            ch.skill,
          ],
          content_es: [
            `Enfoque del reto: ${ch.skill} (${ch.tech}).`,
            `Reloj y rendimiento en Antigravity CLI (Gemini 4 Argon High): Con el Superpowers Kit tardo ${ch.superkit_min} minutos (${ch.superkit_lines} lineas / ${ch.superkit_kb} KB · ${ch.superkit_fps}) contra ${ch.vanilla_min} minutos de Gemini 4 Argon High Sin Kit (${ch.vanilla_lines} lineas / ${ch.vanilla_kb} KB · ${ch.vanilla_fps}).`,
            `Telemetria de tokens y factura API: Superpowers Kit consumio ${ch.superkit_tok} tokens (${ch.superkit_steps} pasos de agente) por $${ch.superkit_usd.toFixed(2)} USD. IA Sin Kit consumio ${ch.vanilla_tok} tokens (${ch.vanilla_steps} pasos de agente) por $${ch.vanilla_usd.toFixed(2)} USD.`,
            `Veredicto del arbitro (Kevin Gonzalez): ${ch.verdict_es}`,
          ],
          content_en: [
            `Challenge focus: ${ch.skill} (${ch.tech_en ?? ch.tech}).`,
            `Clock & performance in Antigravity CLI (Gemini 4 Argon High): With the Superpowers Kit it took ${ch.superkit_min} minutes (${ch.superkit_lines} lines / ${ch.superkit_kb} KB · ${ch.superkit_fps_en ?? ch.superkit_fps}) versus ${ch.vanilla_min} minutes for Raw Gemini 4 Argon High (${ch.vanilla_lines} lines / ${ch.vanilla_kb} KB · ${ch.vanilla_fps_en ?? ch.vanilla_fps}).`,
            `Token telemetry & API bill: Superpowers Kit consumed ${ch.superkit_tok} tokens (${ch.superkit_steps} agent steps) for $${ch.superkit_usd.toFixed(2)} USD. Raw AI consumed ${ch.vanilla_tok} tokens (${ch.vanilla_steps} agent steps) for $${ch.vanilla_usd.toFixed(2)} USD.`,
            `Referee verdict (Kevin Gonzalez): ${ch.verdict_en}`,
          ],
          comments: [],
        }))
      : [];

    const ep02Threads: ForumThreadEntry[] = EP02_CHALLENGES.map((ch) => ({
      id: `thread-ep02-challenge-${ch.n}`,
      slug: `ep02-reto-${ch.n}-${ch.dir}`,
      category: "prompts",
      episode: "ep02",
      badge_es: `EP02 PROMPT Y FACTURA · RETO 0${ch.n}`,
      badge_en: `EP02 PROMPT & BILL · CHALLENGE 0${ch.n}`,
      title_es: `EP02 Reto 0${ch.n} (${ch.name_es}): Prompt Zero-Shot, Tokens (${ch.tokens.argon_total} vs ${ch.tokens.opus_total}) y Costo ($${ch.cost_usd.argon.toFixed(2)} vs $${ch.cost_usd.opus.toFixed(2)} USD)`,
      title_en: `EP02 Challenge 0${ch.n} (${ch.name_en}): Zero-Shot Prompt, Tokens (${ch.tokens.argon_total} vs ${ch.tokens.opus_total}) & Cost ($${ch.cost_usd.argon.toFixed(2)} vs $${ch.cost_usd.opus.toFixed(2)} USD)`,
      excerpt_es: ch.fun_angle_es,
      excerpt_en: ch.fun_angle_en,
      author: "Kevin Gonzalez",
      authorRole_es: "Arbitro · Mixiuh Labs",
      authorRole_en: "Referee · Mixiuh Labs",
      createdAt: releaseDay("ep02"),
      readTime: "4 min",
      upvotes: 95 + (7 - ch.n) * 9,
      views: 680 + ch.n * 65,
      relatedChallengeN: ch.n,
      tags: [
        "EP02",
        `Reto 0${ch.n}`,
        ch.dir,
        ch.winner === "argon" ? "Ganador: Argon" : "Ganador: Opus 5.5",
        "Zero-Shot",
      ],
      tags_en: [
        "EP02",
        `Challenge 0${ch.n}`,
        ch.dir,
        ch.winner === "argon" ? "Winner: Argon" : "Winner: Opus 5.5",
        "Zero-Shot",
      ],
      content_es: [
        `Resumen del reto (EP02 Argon vs Claude Opus 5.5): ${ch.prompt_gist_es}`,
        `Reloj y rendimiento en Antigravity: Gemini 4 Argon (High) tardo ${ch.time_min.argon} minutos (${ch.code_stats.argon_lines} lineas / ${ch.code_stats.argon_kb} KB · ${ch.fps.argon}) contra ${ch.time_min.opus} minutos de Claude Opus 5.5 (High) (${ch.code_stats.opus_lines} lineas / ${ch.code_stats.opus_kb} KB · ${ch.fps.opus}). ${ch.speed_ratio_es}.`,
        `Telemetria de tokens y factura API: Argon consumio ${ch.tokens.argon_total} tokens (${ch.tokens.argon_in} In, ${ch.tokens.argon_cache} Cache, ${ch.tokens.argon_out} Out en ${ch.tokens.argon_steps} pasos) por $${ch.cost_usd.argon.toFixed(2)} USD. Opus 5.5 consumio ${ch.tokens.opus_total} tokens (${ch.tokens.opus_in} In+CW, ${ch.tokens.opus_cache} Cache, ${ch.tokens.opus_out} Out en ${ch.tokens.opus_steps} pasos) por $${ch.cost_usd.opus.toFixed(2)} USD (${ch.cost_ratio_es}).`,
        `Veredicto del arbitro (Kevin Gonzalez): "${ch.kevin_note_es}"`,
        `Entregables destacados en Argon: ${ch.argon_features.join(" · ")}.`,
        `Entregables y observaciones en Opus 5.5: ${ch.opus_features.join(" · ")} | ${ch.opus_observations.join(" · ")}.`,
      ],
      content_en: [
        `Challenge summary (EP02 Argon vs Claude Opus 5.5): ${ch.prompt_gist_en}`,
        `Clock & performance in Antigravity: Gemini 4 Argon (High) took ${ch.time_min.argon} minutes (${ch.code_stats.argon_lines} lines / ${ch.code_stats.argon_kb} KB · ${ch.fps.argon}) versus ${ch.time_min.opus} minutes for Claude Opus 5.5 (High) (${ch.code_stats.opus_lines} lines / ${ch.code_stats.opus_kb} KB · ${ch.fps.opus}). ${ch.speed_ratio_en}.`,
        `Token telemetry & API bill: Argon consumed ${ch.tokens.argon_total} tokens (${ch.tokens.argon_in} In, ${ch.tokens.argon_cache} Cache, ${ch.tokens.argon_out} Out across ${ch.tokens.argon_steps} steps) for $${ch.cost_usd.argon.toFixed(2)} USD. Opus 5.5 consumed ${ch.tokens.opus_total} tokens (${ch.tokens.opus_in} In+CW, ${ch.tokens.opus_cache} Cache, ${ch.tokens.opus_out} Out across ${ch.tokens.opus_steps} steps) for $${ch.cost_usd.opus.toFixed(2)} USD (${ch.cost_ratio_en}).`,
        // kevin_note_verbatim_en is set where kevin_note_en is not a faithful translation
        `Referee verdict (Kevin Gonzalez, translated from Spanish): "${ch.kevin_note_verbatim_en ?? ch.kevin_note_en}"`,
        `Key Argon deliverables: ${(ch.argon_features_en ?? ch.argon_features).join(" · ")}.`,
        `Opus 5.5 deliverables & observations: ${(ch.opus_features_en ?? ch.opus_features).join(" · ")} | ${(ch.opus_observations_en ?? ch.opus_observations).join(" · ")}.`,
      ],
      comments: [],
    }));

    const ep01Threads: ForumThreadEntry[] = CHALLENGES.map((ch) => ({
      id: `thread-challenge-${ch.n}`,
      slug: `reto-${ch.n}-${ch.dir}`,
      category: "prompts",
      episode: "ep01",
      badge_es: `EP01 PROMPT Y RESULTADO · NIVEL ${String(ch.n).padStart(2, "0")}`,
      badge_en: `EP01 PROMPT & RESULT · LEVEL ${String(ch.n).padStart(2, "0")}`,
      title_es: `EP01 Nivel ${ch.n} (${ch.name_es}): Prompt Zero-Shot, Metricas (${ch.time_min.argon}m vs ${ch.time_min.flash}m) y Notas de Arbitraje`,
      title_en: `EP01 Level ${ch.n} (${ch.name_en}): Zero-Shot Prompt, Metrics (${ch.time_min.argon}m vs ${ch.time_min.flash}m) & Referee Notes`,
      excerpt_es: ch.fun_angle_es,
      excerpt_en: ch.fun_angle_en,
      author: "Kevin Gonzalez",
      authorRole_es: "Arbitro · Mixiuh Labs",
      authorRole_en: "Referee · Mixiuh Labs",
      createdAt: releaseDay("ep01"),
      readTime: "4 min",
      upvotes: 60 + (11 - ch.n) * 7,
      views: 420 + ch.n * 45,
      relatedChallengeN: ch.n,
      tags: ["EP01", `Nivel ${ch.n}`, ch.dir, ch.tech.split("+")[0].trim(), "Zero-Shot"],
      tags_en: [
        "EP01",
        `Level ${ch.n}`,
        ch.dir,
        (ch.tech_en ?? ch.tech).split("+")[0].trim(),
        "Zero-Shot",
      ],
      content_es: [
        `Resumen del reto (EP01 Argon vs Flash): ${ch.prompt_gist_es}`,
        `Tiempos de generacion en Antigravity: Gemini 4 Argon (High) tardo ${ch.time_min.argon} minutos (${ch.code_stats.argon_lines} lineas / ${ch.code_stats.argon_kb} KB) contra ${ch.time_min.flash} minutos de Gemini 3.8 Flash (High) (${ch.code_stats.flash_lines} lineas / ${ch.code_stats.flash_kb} KB). Relacion de velocidad: ${ch.speed_ratio}.`,
        `Nota textual del arbitro (Kevin Gonzalez): "${ch.kevin_note_verbatim}"`,
        `Entregables destacados en Argon: ${ch.argon_features.join(" · ")}.`,
        `Observaciones en Flash: ${ch.flash_problems.join(" · ")}.`,
      ],
      content_en: [
        `Challenge summary (EP01 Argon vs Flash): ${ch.prompt_gist_en}`,
        `Generation times in Antigravity: Gemini 4 Argon (High) took ${ch.time_min.argon} minutes (${ch.code_stats.argon_lines} lines / ${ch.code_stats.argon_kb} KB) versus ${ch.time_min.flash} minutes for Gemini 3.8 Flash (High) (${ch.code_stats.flash_lines} lines / ${ch.code_stats.flash_kb} KB). Speed ratio: ${ch.speed_ratio_en ?? ch.speed_ratio}.`,
        // Only the faithful translation of the verbatim note is quoted as Kevin's
        // words; kevin_note_en is an editorial rewrite, so it is never put in quotes.
        ch.kevin_note_verbatim_en
          ? `Referee note (Kevin Gonzalez, translated from Spanish): "${ch.kevin_note_verbatim_en}"`
          : `Editorial summary (not the referee's words): ${ch.kevin_note_en}`,
        `Key Argon features: ${(ch.argon_features_en ?? ch.argon_features).join(" · ")}.`,
        `Flash observations: ${(ch.flash_problems_en ?? ch.flash_problems).join(" · ")}.`,
      ],
      comments: [],
    }));
    return [
      ...releasedCuratedThreads,
      ...ep04Threads,
      ...ep03Threads,
      ...ep02Threads,
      ...ep01Threads,
    ];
  }, [rel]);

  const proposals = useMemo<Ep02Proposal[]>(() => {
    return INITIAL_EP02_PROPOSALS.filter((p) => {
      const airsWith = PROPOSAL_RELEASES[p.id];
      return !airsWith || rel[airsWith];
    });
  }, [rel]);

  // The forum only mounts on the client (the prerendered view is always the home
  // page), so saved threads, comments and vote flags are read directly in the
  // state initializers. Everything is re-read on mount, so the Hilos/Glosario
  // switch (which unmounts the forum) or a reload loses nothing.
  const [customThreads, setCustomThreads] =
    useState<ForumThread[]>(readStoredThreads);
  const [postedComments, setPostedComments] =
    useState<Record<string, ForumComment[]>>(readStoredComments);
  const threads = useMemo<ForumThreadEntry[]>(
    () =>
      [...customThreads, ...defaultThreads].map((t) => {
        const posted = postedComments[t.id];
        return posted?.length
          ? { ...t, comments: [...t.comments, ...posted] }
          : t;
      }),
    [customThreads, defaultThreads, postedComments]
  );
  const [activeCategory, setActiveCategory] = useState<ForumCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    defaultThreads[0]?.id || "thread-ep02-dossier"
  );
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>(() =>
    readStoredFlags(UPVOTES_KEY)
  );
  const [votedProposals, setVotedProposals] = useState<Record<string, boolean>>(
    () => readStoredFlags(PROPOSAL_VOTES_KEY)
  );
  // Shown counts = base count + 1 when the visitor's saved flag is set
  const threadVotes = (t: ForumThread) => t.upvotes + (upvotedIds[t.id] ? 1 : 0);

  const threadDetailRef = useRef<HTMLDivElement | null>(null);
  const revealThreadDetail = () => {
    requestAnimationFrame(() => {
      threadDetailRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      threadDetailRef.current?.focus({ preventScroll: true });
    });
  };
  // The reader is not a live region (it would queue the whole thread). On
  // phones it sits below the list, so selecting moves focus there; on desktop
  // focus stays in the list and a polite status names the opened thread.
  const [threadAnnouncement, setThreadAnnouncement] = useState("");
  // A language switch drops it, so the status never keeps a string in the
  // other language (adjusting state during render avoids an extra effect pass)
  const [announcementLang, setAnnouncementLang] = useState(lang);
  if (announcementLang !== lang) {
    setAnnouncementLang(lang);
    setThreadAnnouncement("");
  }
  const selectThread = (id: string) => {
    setSelectedThreadId(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setThreadAnnouncement("");
      revealThreadDetail();
      return;
    }
    const thread = threads.find((t) => t.id === id);
    if (!thread) return;
    // Backticks only mark inline code in titles; they are not read aloud
    const title = (lang === "es" ? thread.title_es : thread.title_en).replace(
      /`/g,
      ""
    );
    setThreadAnnouncement(
      lang === "es" ? `Hilo abierto: ${title}` : `Thread opened: ${title}`
    );
  };

  // Comment composer state
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentRole, setCommentRole] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [copiedPromptInThread, setCopiedPromptInThread] = useState(false);

  // New Thread / Proposal modal state
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState<Exclude<ForumCategory, "all">>("propuestas");
  const [newAuthor, setNewAuthor] = useState("");
  // Matches the default category (proposals for the next episode)
  const [newTags, setNewTags] = useState(
    `EP${nextEp}, Benchmark, Zero-Shot`
  );
  const [newBody, setNewBody] = useState("");

  // The modal is a real dialog: focus moves in, Tab stays inside, Escape closes,
  // page scroll locks and focus returns to the opener on close.
  const closeNewThreadModal = useCallback(
    () => setShowNewThreadModal(false),
    []
  );
  const newThreadDialogRef = usePixelDialog<HTMLDivElement>(
    showNewThreadModal,
    closeNewThreadModal
  );
  // Pairs each visible label with its control, and the dialog with its title
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const matchesCat =
        activeCategory === "all" || t.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCat;
      const title = (lang === "es" ? t.title_es : t.title_en).toLowerCase();
      const excerpt = (
        lang === "es" ? t.excerpt_es : t.excerpt_en
      ).toLowerCase();
      // Shown tags plus the shared originals, so a Spanish tag still matches in English
      const tags = lang === "es" ? t.tags : [...t.tags, ...threadTags(t, lang)];
      const tagsMatch = tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCat && (title.includes(q) || excerpt.includes(q) || tagsMatch);
    });
  }, [threads, activeCategory, searchQuery, lang]);

  const activeThread =
    threads.find((t) => t.id === selectedThreadId) ||
    filteredThreads[0] ||
    threads[0];
  // The reader keeps the open thread while the visitor filters, and says so
  // when the current search or category no longer lists it
  const activeThreadFilteredOut =
    !!activeThread && !filteredThreads.some((t) => t.id === activeThread.id);

  // Empty list text, and what the search status reads: nothing while the box
  // is empty, otherwise the number of matching threads or the empty text
  const trimmedQuery = searchQuery.trim();
  const emptyListText = trimmedQuery
    ? lang === "es"
      ? `Sin resultados para "${trimmedQuery}"`
      : `No results for "${trimmedQuery}"`
    : lang === "es"
    ? "No hay hilos en esta categoria"
    : "No threads in this category";
  const searchStatusText = !trimmedQuery
    ? ""
    : filteredThreads.length === 0
    ? emptyListText
    : lang === "es"
    ? `${filteredThreads.length} ${filteredThreads.length === 1 ? "hilo" : "hilos"}`
    : `${filteredThreads.length} ${filteredThreads.length === 1 ? "thread" : "threads"}`;
  // Spoken after a pause in typing, never on load (the PixelDataTable pattern)
  const [searchStatus, setSearchStatus] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setSearchStatus(searchStatusText), 400);
    return () => window.clearTimeout(timer);
  }, [searchStatusText]);

  const activeThreadEpisode: "ep04" | "ep03" | "ep02" | "ep01" =
    activeThread?.episode === "ep01"
      ? "ep01"
      : activeThread?.episode === "ep03"
      ? "ep03"
      : activeThread?.episode === "ep04"
      ? "ep04"
      : "ep02";

  const linkedPromptVerbatim = useMemo(() => {
    if (!activeThread?.relatedChallengeN) return undefined;
    if (activeThreadEpisode === "ep04") {
      return EP04_CHALLENGES.find((c) => c.n === activeThread.relatedChallengeN)
        ?.prompt_verbatim;
    }
    if (activeThreadEpisode === "ep03") {
      return EP03_CHALLENGES.find((c) => c.n === activeThread.relatedChallengeN)
        ?.prompt_verbatim;
    }
    if (activeThreadEpisode === "ep02") {
      return EP02_CHALLENGES.find((c) => c.n === activeThread.relatedChallengeN)
        ?.prompt_verbatim;
    }
    return CHALLENGES.find((c) => c.n === activeThread.relatedChallengeN)
      ?.prompt_verbatim;
  }, [activeThread, activeThreadEpisode]);

  // Votes only toggle the visitor's flag; the shown count is derived from it
  const handleUpvoteThread = (id: string) => {
    const next = toggleFlag(upvotedIds, id);
    setUpvotedIds(next);
    writeStoredJson(UPVOTES_KEY, next);
  };

  const handleVoteProposal = (id: string) => {
    const next = toggleFlag(votedProposals, id);
    setVotedProposals(next);
    writeStoredJson(PROPOSAL_VOTES_KEY, next);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const body = commentBody.trim();
    if (!body || !activeThread) return;
    const authorName =
      commentAuthor.trim() ||
      (lang === "es" ? "Ingeniero Invitado" : "Guest Engineer");
    const roleName =
      commentRole.trim() ||
      (lang === "es" ? "Comunidad Mixiuh Labs" : "Mixiuh Labs Community");
    const newComment: ForumComment = {
      id: localPostId("c"),
      author: authorName,
      role: roleName,
      handle: `@${
        authorName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 12) || "dev"
      }`,
      createdAt: localIsoDate(),
      body_es: body,
      body_en: body,
      upvotes: 1,
    };
    const threadId = activeThread.id;

    setPostedComments((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), newComment],
    }));
    // Re-read before writing so comments posted from another tab are kept
    const stored = readStoredComments();
    writeStoredJson(COMMENTS_KEY, {
      ...stored,
      [threadId]: [...(stored[threadId] ?? []), newComment],
    });
    setCommentBody("");
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    const body = newBody.trim();
    if (!title || !body) return;
    const id = localPostId("custom");
    const created: ForumThread = {
      id,
      slug: id,
      category: newCategory,
      badge_es: "APORTE DE LA COMUNIDAD",
      badge_en: "COMMUNITY SUBMISSION",
      title_es: title,
      title_en: title,
      excerpt_es: body.slice(0, 160),
      excerpt_en: body.slice(0, 160),
      author: newAuthor.trim() || (lang === "es" ? "Miembro del Lab" : "Lab Member"),
      authorRole_es: "Investigador Invitado",
      authorRole_en: "Guest Researcher",
      createdAt: localIsoDate(),
      readTime: "3 min",
      upvotes: 1,
      views: 1,
      tags: newTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      content_es: body.split("\n\n"),
      content_en: body.split("\n\n"),
      comments: [],
    };

    setCustomThreads((prev) => [created, ...prev]);
    // Re-read before writing so threads posted from another tab are kept
    writeStoredJson(CUSTOM_THREADS_KEY, [created, ...readStoredThreads()]);
    setShowNewThreadModal(false);
    setNewTitle("");
    setNewBody("");
    // Open the new thread and move focus to it: the reader is off-screen from
    // the trigger on every layout (APG: focus may go to the item just created).
    // The status would still name the previously opened thread, so clear it.
    setSelectedThreadId(created.id);
    setThreadAnnouncement("");
    revealThreadDetail();
  };

  const categories: { id: ForumCategory; label_es: string; label_en: string }[] =
    [
      {
        id: "all",
        label_es: `Todos los Hilos (${threads.length})`,
        label_en: `All Threads (${threads.length})`,
      },
      {
        id: "benchmarks",
        label_es: `Dossiers y Benchmarks (EP01 – EP0${latestEp})`,
        label_en: `Dossiers & Benchmarks (EP01 – EP0${latestEp})`,
      },
      {
        id: "autopsias",
        label_es: "Autopsias de Codigo y Tokens",
        label_en: "Code & Token Autopsies",
      },
      {
        id: "prompts",
        label_es: `Los ${promptCount} Prompts Zero-Shot`,
        label_en: `All ${promptCount} Zero-Shot Prompts`,
      },
      {
        id: "pipeline",
        label_es: "Pipeline Voicefy + Reelfy",
        label_en: "Voicefy + Reelfy Pipeline",
      },
      {
        id: "propuestas",
        label_es: "Propuestas de la Comunidad",
        label_en: "Community Proposals",
      },
    ];

  return (
    <section id="foro" className="py-14 border-t border-[#00E5FF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A2132] border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono-hud uppercase tracking-wider mb-3">
              <PixelIcon name="message" size={14} />
              {lang === "es"
                ? `FORO TECNICO MIXIUH LABS · BITACORA DE PRUEBAS EP01 – EP0${latestEp}`
                : `MIXIUH LABS TECHNICAL FORUM · EP01 – EP0${latestEp} EXPERIMENT LOG`}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
              {lang === "es"
                ? "Foro de Pruebas, Autopsias de Codigo y Comunidad"
                : "Experiment Forum, Code Autopsies & Community"}
            </h2>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-2 max-w-3xl">
              {lang === "es"
                ? `Explora el analisis forense de los Episodios 01 al 0${latestEp}, inspecciona por que Claude Opus 5.5 cayo a 28 FPS en la tela Verlet o por que su factura triplico los tokens, copia los ${promptCount} prompts y vota por el Episodio ${nextEp}.`
                : `Explore the forensic breakdown of Episodes 01 to 0${latestEp}, inspect why Claude Opus 5.5 dropped to 28 FPS on the Verlet cloth or why its token bill was 2.6x higher, copy all ${promptCount} prompts, and vote on Episode ${nextEp}.`}
            </p>
          </div>

          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setShowNewThreadModal(true)}
            className="self-start lg:self-end px-5 py-3 bg-[#00E5FF] hover:brightness-110 text-[#090B10] font-mono-hud text-xs font-bold transition flex items-center gap-2 shadow-[4px_4px_0_#040508] cursor-pointer"
          >
            <PixelIcon name="plus" size={16} />
            {lang === "es"
              ? "Publicar Hilo / Proponer Reto"
              : "Post Thread / Propose Challenge"}
          </button>
        </div>

        {/* Next-episode Voting Board */}
        <div className="mb-10 p-5 sm:p-6 shadow-[6px_6px_0_#040508] bg-[#111622] border-2 border-[#00E5FF]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="text-xs font-mono-hud uppercase text-[#FFD100] font-bold flex flex-wrap items-center gap-1.5">
                <span>
                  {lang === "es"
                    ? "PIZARRA DE VOTACION ACTIVA · PROXIMO VIDEO EN YOUTUBE ("
                    : "ACTIVE VOTING BOARD · NEXT YOUTUBE EPISODE ("}
                </span>
                <a
                  href="https://www.youtube.com/@MixiuhLabsES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-[#00E5FF] hover:underline"
                >
                  @MixiuhLabsES
                </a>
                <span>/</span>
                <a
                  href="https://www.youtube.com/@MixiuhLabsEN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-[#C084FC] hover:underline"
                >
                  @MixiuhLabsEN
                </a>
                <span>)</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                {lang === "es"
                  ? `¿Que modelos o reto extremo metemos al laboratorio en el Episodio ${nextEp}?`
                  : `Which models or extreme challenge should we test in Episode ${nextEp}?`}
              </h3>
            </div>
            <span className="font-mono-hud text-xs text-[#00E5FF]">
              {lang === "es"
                ? "Haz clic en una tarjeta para sumar tu voto"
                : "Click a card to cast your vote"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {proposals.map((prop) => {
              const voted = !!votedProposals[prop.id];
              return (
                <div
                  key={prop.id}
                  className={`p-4 shadow-[4px_4px_0_#040508] border transition flex flex-col justify-between ${
                    voted
                      ? "bg-[#090B10] border-[#10B981] shadow-[4px_4px_0_#040508]"
                      : "bg-[#090B10] border-[#2A344B] hover:border-[#00E5FF]/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#00E5FF]/15 text-[#00E5FF] font-mono-hud text-[10px] font-bold">
                        {labelIn(lang, prop.models)}
                      </span>
                      <span className="font-mono-hud text-[10px] text-[#94A3B8]">
                        {lang === "es" ? prop.status_es : prop.status_en}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-white leading-snug mb-2">
                      {lang === "es" ? prop.title_es : prop.title_en}
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                      {lang === "es" ? prop.description_es : prop.description_en}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVoteProposal(prop.id)}
                    className={`w-full py-2 px-3 font-mono-hud text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      voted
                        ? "bg-[#10B981] text-[#090B10]"
                        : "bg-[#1A2132] text-white hover:bg-[#00E5FF] hover:text-[#090B10]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <PixelIcon name="arrow-up" size={14} />
                      {voted
                        ? lang === "es"
                          ? "Voto Registrado"
                          : "Vote Recorded"
                        : lang === "es"
                        ? "Votar por este reto"
                        : "Vote for this test"}
                    </span>
                    <span>{prop.votes + (voted ? 1 : 0)} pts</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter Bar + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div
            role="group"
            aria-label={lang === "es" ? "Categorias del foro" : "Forum categories"}
            className="flex flex-wrap items-center gap-1.5"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 shadow-[4px_4px_0_#040508] font-mono-hud text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#00E5FF] text-[#090B10]"
                    : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#2A344B]"
                }`}
              >
                {lang === "es" ? cat.label_es : cat.label_en}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <PixelIcon name="search" size={16} className="text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={lang === "es" ? "Buscar en el foro" : "Search the forum"}
              placeholder={
                lang === "es"
                  ? "Buscar Opus, Verlet, tokens, CCD, Uint32Array..."
                  : "Search Opus, Verlet, tokens, CCD, Uint32Array..."
              }
              className="w-full pl-10 pr-4 py-2 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] text-xs sm:text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00E5FF]"
            />
            <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {searchStatus}
            </p>
          </div>
        </div>

        {/* Two-Column Forum Layout: Left Thread Feed (5 cols), Right Active Thread Reader (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Thread List. `relative` makes this scroller the
              containing block of the cards' sr-only text, so it is clipped
              here instead of stretching the page below the footer. */}
          <div className="relative lg:col-span-5 space-y-3 max-h-[60vh] lg:max-h-[880px] overflow-y-auto pr-1">
            {filteredThreads.length === 0 && (
              <p className="p-4 shadow-[4px_4px_0_#040508] bg-[#111622] border border-[#2A344B] font-mono-hud text-xs text-[#CBD5E1]">
                {emptyListText}
              </p>
            )}
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThread?.id;
              const isUpvoted = !!upvotedIds[thread.id];
              return (
                <div
                  key={thread.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => selectThread(thread.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectThread(thread.id);
                    }
                  }}
                  className={`p-4 shadow-[4px_4px_0_#040508] border transition cursor-pointer ${
                    isSelected
                      ? "bg-[#1A2132] border-[#00E5FF] shadow-[4px_4px_0_#040508]"
                      : "bg-[#111622] border-[#2A344B] hover:border-[#3A4560] hover:bg-[#111622]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 font-mono-hud text-[10px] font-bold ${
                        thread.category === "autopsias"
                          ? "bg-[#FF3355] text-[#090B10] border border-[#090B10]"
                          : thread.category === "benchmarks"
                          ? "bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/30"
                          : thread.category === "pipeline"
                          ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                          : "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30"
                      }`}
                    >
                      {lang === "es" ? thread.badge_es : thread.badge_en}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#94A3B8]">
                      {thread.readTime} ·{" "}
                      <ForumDate value={thread.createdAt} lang={lang} />
                    </span>
                  </div>

                  <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug mb-1.5">
                    {formatInlineCode(
                      lang === "es" ? thread.title_es : thread.title_en
                    )}
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed mb-3">
                    {formatInlineCode(
                      lang === "es" ? thread.excerpt_es : thread.excerpt_en
                    )}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono-hud text-[#94A3B8]">
                    <span>{labelIn(lang, thread.author)}</span>
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          isUpvoted ? "text-[#10B981] font-bold" : "text-[#00E5FF]"
                        }
                      >
                        <span aria-hidden="true">▲</span> {threadVotes(thread)}
                        <span className="sr-only">
                          {lang === "es" ? " votos" : " votes"}
                        </span>
                      </span>
                      <span>
                        {thread.comments.length}{" "}
                        {lang === "es" ? "respuestas" : "replies"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Thread Detail Reader */}
          {activeThread && (
            <div
              ref={threadDetailRef}
              tabIndex={-1}
              className="lg:col-span-7 focus:outline-none bg-[#111622] border-2 border-[#00E5FF]/30 p-5 sm:p-8 shadow-[6px_6px_0_#040508]"
            >
              {activeThreadFilteredOut && (
                <p className="mb-4 px-3 py-2 bg-[#090B10] border border-[#FFD100]/40 font-mono-hud text-xs text-[#FFD100]">
                  {lang === "es"
                    ? "Este hilo no esta entre los resultados de la busqueda o categoria actual."
                    : "This thread is not among the results for the current search or category."}
                </p>
              )}

              {/* Top Meta & Upvote */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2A344B]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#1A2132] border border-[#00E5FF]/40 font-mono-hud text-xs font-bold text-[#00E5FF]">
                    {lang === "es"
                      ? activeThread.badge_es
                      : activeThread.badge_en}
                  </span>
                  <span className="text-xs font-mono-hud text-[#94A3B8]">
                    <ForumDate value={activeThread.createdAt} lang={lang} /> ·{" "}
                    {activeThread.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeThread.relatedChallengeN && (
                    <button
                      onClick={() =>
                        onJumpToArena(
                          activeThreadEpisode,
                          activeThread.relatedChallengeN!
                        )
                      }
                      className="px-3 py-1.5 bg-[#A855F7] text-[#090B10] font-mono-hud text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition cursor-pointer"
                    >
                      <PixelIcon name="play" size={14} />
                      {lang === "es"
                        ? `Jugar ${activeThreadEpisode.toUpperCase()} Reto ${activeThread.relatedChallengeN}`
                        : `Play ${activeThreadEpisode.toUpperCase()} Challenge ${activeThread.relatedChallengeN}`}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleUpvoteThread(activeThread.id)}
                    aria-pressed={!!upvotedIds[activeThread.id]}
                    aria-label={
                      lang === "es"
                        ? `Votar este hilo (${threadVotes(activeThread)} votos)`
                        : `Upvote this thread (${threadVotes(activeThread)} votes)`
                    }
                    className={`px-3.5 py-1.5 font-mono-hud text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                      upvotedIds[activeThread.id]
                        ? "bg-[#10B981] text-[#090B10] border-[#10B981]"
                        : "bg-[#1A2132] text-white border-[#2A344B] hover:border-[#10B981]"
                    }`}
                  >
                    <PixelIcon name="arrow-up" size={14} />
                    <span>{threadVotes(activeThread)}</span>
                  </button>
                </div>
              </div>

              {/* Title & Author */}
              <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-5 mb-2 leading-tight">
                {formatInlineCode(
                  lang === "es" ? activeThread.title_es : activeThread.title_en
                )}
              </h3>
              <div className="text-xs font-mono-hud text-[#94A3B8] mb-5">
                {labelIn(lang, activeThread.author)} —{" "}
                <span className="text-[#00E5FF]">
                  {lang === "es"
                    ? activeThread.authorRole_es
                    : activeThread.authorRole_en}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {threadTags(activeThread, lang).map((tag, idx) => (
                  <span
                    key={`${idx}-${tag}`}
                    className="px-2.5 py-0.5 bg-[#090B10] border border-[#2A344B] font-mono-hud text-[11px] text-[#94A3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Body Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-[#F5F2EB]/90 leading-relaxed">
                {(lang === "es"
                  ? activeThread.content_es
                  : activeThread.content_en
                ).map((p, idx) => (
                  <p key={idx}>{formatInlineCode(p)}</p>
                ))}
              </div>

              {/* Forensic Code Comparison Box (if present) */}
              {activeThread.codeComparison && (
                <div className="mt-6 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#FF3355]/30 overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#1A2132] border-b border-[#2A344B] font-mono-hud text-xs font-bold text-[#00E5FF]">
                    {lang === "es"
                      ? activeThread.codeComparison.title_es
                      : activeThread.codeComparison.title_en}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2A344B]">
                    <div className="p-4">
                      <div className="text-[11px] font-mono-hud font-bold text-[#FFD100] mb-2">
                        {lang === "es"
                          ? activeThread.codeComparison.leftLabel_es ||
                            "[IZQUIERDA] GEMINI 3.8 FLASH (BUG / OMISION)"
                          : activeThread.codeComparison.leftLabel_en ||
                            "[LEFT] GEMINI 3.8 FLASH (BUG / OMISSION)"}
                      </div>
                      <pre className="text-xs font-mono-hud text-[#F5F2EB] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeThread.codeComparison.flashCode}
                      </pre>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] font-mono-hud font-bold text-[#C084FC] mb-2">
                        {lang === "es"
                          ? activeThread.codeComparison.rightLabel_es ||
                            "[DERECHA] GEMINI 4 ARGON (SOLUCION EXACTA)"
                          : activeThread.codeComparison.rightLabel_en ||
                            "[RIGHT] GEMINI 4 ARGON (EXACT SOLUTION)"}
                      </div>
                      <pre className="text-xs font-mono-hud text-[#10B981] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeThread.codeComparison.argonCode}
                      </pre>
                    </div>
                  </div>
                  <div className="p-4 bg-[#111622] border-t border-[#2A344B] text-xs text-[#94A3B8] leading-relaxed">
                    <strong className="text-white font-mono-hud">
                      {lang === "es" ? "Diagnostico Tecnico: " : "Technical Diagnosis: "}
                    </strong>
                    {formatInlineCode(
                      lang === "es"
                        ? activeThread.codeComparison.explanation_es
                        : activeThread.codeComparison.explanation_en
                    )}
                  </div>
                </div>
              )}

              {/* Verbatim Prompt Box if thread is linked to a challenge */}
              {linkedPromptVerbatim && (
                <div className="mt-6 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#00E5FF]/30 overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#1A2132] border-b border-[#2A344B] flex items-center justify-between gap-2">
                    <span className="font-mono-hud text-xs font-bold text-[#00E5FF]">
                      {lang === "es"
                        ? `Prompt Oficial Zero-Shot — ${activeThreadEpisode.toUpperCase()} Reto ${activeThread.relatedChallengeN}`
                        : `Official Zero-Shot Prompt (verbatim, in Spanish as run) — ${activeThreadEpisode.toUpperCase()} Challenge ${activeThread.relatedChallengeN}`}
                    </span>
                    <button
                      onClick={() => {
                        void copyTextToClipboard(linkedPromptVerbatim);
                        setCopiedPromptInThread(true);
                        setTimeout(() => setCopiedPromptInThread(false), 2000);
                      }}
                      className="px-3 py-1 bg-[#00E5FF] text-[#090B10] font-mono-hud text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPromptInThread ? (
                        <>
                          <PixelIcon name="check" size={12} />
                          {lang === "es" ? "Copiado" : "Copied"}
                        </>
                      ) : (
                        <>
                          <PixelIcon name="copy" size={12} />
                          {lang === "es" ? "Copiar Prompt" : "Copy Prompt"}
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono-hud text-[#F5F2EB]/90 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
                    {linkedPromptVerbatim}
                  </pre>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-8 pt-6 border-t border-[#2A344B]">
                <h4 className="font-mono-hud text-xs uppercase tracking-wider text-[#00E5FF] font-bold mb-4">
                  {lang === "es"
                    ? `COMENTARIOS Y APORTES TECNICOS (${activeThread.comments.length})`
                    : `TECHNICAL COMMENTS & DISCUSSION (${activeThread.comments.length})`}
                </h4>

                <div className="space-y-3 mb-6">
                  {activeThread.comments.length === 0 ? (
                    <div className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B] text-xs text-[#94A3B8]">
                      {lang === "es"
                        ? "Se el primero en comentar este analisis o compartir tus resultados replicando el prompt."
                        : "Be the first to comment on this analysis or share your results replicating the prompt."}
                    </div>
                  ) : (
                    activeThread.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#2A344B]"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="text-xs font-mono-hud">
                            <span className="font-bold text-white">
                              {labelIn(lang, c.author)}
                            </span>{" "}
                            <span className="text-[#00E5FF]">
                              · {labelIn(lang, c.role)}
                            </span>
                          </div>
                          <span className="shrink-0 text-[11px] font-mono-hud text-[#94A3B8]">
                            <ForumDate value={c.createdAt} lang={lang} />
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#F5F2EB]/90 leading-relaxed">
                          {lang === "es" ? c.body_es : c.body_en}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form
                  onSubmit={handleAddComment}
                  aria-labelledby={fieldId("comment-heading")}
                  className="p-4 shadow-[4px_4px_0_#040508] bg-[#090B10] border border-[#00E5FF]/25 space-y-3"
                >
                  <div
                    id={fieldId("comment-heading")}
                    className="text-xs font-mono-hud text-white font-bold"
                  >
                    {lang === "es"
                      ? "Agregar comentario o reporte de prueba"
                      : "Add comment or benchmark report"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      aria-label={
                        lang === "es" ? "Tu nombre o alias" : "Your name or handle"
                      }
                      placeholder={
                        lang === "es" ? "Tu nombre o alias" : "Your name or handle"
                      }
                      className="px-3 py-2 bg-[#111622] border border-[#2A344B] text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00E5FF]"
                    />
                    <input
                      type="text"
                      value={commentRole}
                      onChange={(e) => setCommentRole(e.target.value)}
                      aria-label={lang === "es" ? "Especialidad" : "Role"}
                      placeholder={
                        lang === "es"
                          ? "Especialidad (ej. Frontend, IA, Shaders)"
                          : "Role (e.g. Graphics Dev, AI Engineer)"
                      }
                      className="px-3 py-2 bg-[#111622] border border-[#2A344B] text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    aria-label={lang === "es" ? "Comentario" : "Comment"}
                    placeholder={
                      lang === "es"
                        ? "Escribe tu observacion sobre el codigo, propon una variacion del prompt o comparte que modelo probaste..."
                        : "Write your code observation, suggest a prompt tweak, or share which model you tested..."
                    }
                    className="w-full px-3 py-2 bg-[#111622] border border-[#2A344B] text-xs sm:text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00E5FF]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#00E5FF] text-[#090B10] font-mono-hud text-xs font-bold hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <PixelIcon name="send" size={14} />
                      {lang === "es" ? "Publicar Comentario" : "Post Comment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {threadAnnouncement}
          </p>
        </div>
      </div>

      {/* Modal for Creating a New Thread. Portaled to <body> at the kit's modal
          layer (z-[88], like PixelDrawer): inside the page's z-10 foreground
          layer the backdrop could not cover the floating back-to-top button
          (z-[80]). Only rendered after a click, so `document` is never touched
          during SSR. The panel scrolls when it is taller than the screen. */}
      {showNewThreadModal && (
        <BodyPortal>
          <div className="fixed inset-0 z-[88] px-backdrop flex items-center justify-center p-4">
            <div
              ref={newThreadDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={fieldId("dialog-title")}
              className="w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-[#111622] border-2 border-[#00E5FF]/40 p-6 shadow-[6px_6px_0_#040508]"
            >
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#2A344B]">
                <h2
                  id={fieldId("dialog-title")}
                  className="font-display text-lg font-bold text-white"
                >
                  {lang === "es"
                    ? "Publicar Nuevo Hilo / Proponer Experimento"
                    : "Publish New Thread / Propose Experiment"}
                </h2>
                <button
                  type="button"
                  onClick={closeNewThreadModal}
                  aria-label={lang === "es" ? "Cerrar" : "Close"}
                  className="shrink-0 p-3.5 sm:p-1.5 bg-[#1A2132] text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <PixelIcon name="close" size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={fieldId("author")}
                      className="block text-xs font-mono-hud text-[#94A3B8] mb-1"
                    >
                      {lang === "es" ? "Autor / Alias" : "Author / Handle"}
                    </label>
                    <input
                      id={fieldId("author")}
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder={
                        lang === "es" ? "Ej. Kevin Gonzalez" : "E.g. Kevin Gonzalez"
                      }
                      className="w-full px-3 py-2 bg-[#090B10] border border-[#2A344B] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={fieldId("category")}
                      className="block text-xs font-mono-hud text-[#94A3B8] mb-1"
                    >
                      {lang === "es" ? "Categoria" : "Category"}
                    </label>
                    <select
                      id={fieldId("category")}
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(
                          e.target.value as Exclude<ForumCategory, "all">
                        )
                      }
                      className="w-full px-3 py-2 bg-[#090B10] border border-[#2A344B] text-xs text-white"
                    >
                      <option value="propuestas">
                        {lang === "es"
                          ? `Propuestas Episodio ${nextEp}`
                          : `Episode ${nextEp} Proposals`}
                      </option>
                      <option value="benchmarks">
                        {lang === "es"
                          ? "Dossiers y Benchmarks"
                          : "Dossiers & Benchmarks"}
                      </option>
                      <option value="autopsias">
                        {lang === "es" ? "Autopsias de Codigo" : "Code Autopsies"}
                      </option>
                      <option value="prompts">
                        {lang === "es"
                          ? "Prompts y Reproducibilidad"
                          : "Prompts & Reproducibility"}
                      </option>
                      <option value="pipeline">
                        {lang === "es"
                          ? "Pipeline Mixiuh Labs"
                          : "Mixiuh Labs Pipeline"}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={fieldId("title")}
                    className="block text-xs font-mono-hud text-[#94A3B8] mb-1"
                  >
                    {lang === "es" ? "Titulo del Hilo" : "Thread Title"}
                  </label>
                  <input
                    id={fieldId("title")}
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={
                      lang === "es"
                        ? `Ej. Propuesta EP${nextEp}: Gemini 4 Argon vs GPT-5.4 High en WebGPU`
                        : `E.g. EP${nextEp} Proposal: Gemini 4 Argon vs GPT-5.4 High in WebGPU`
                    }
                    className="w-full px-3 py-2 bg-[#090B10] border border-[#2A344B] text-xs sm:text-sm text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor={fieldId("tags")}
                    className="block text-xs font-mono-hud text-[#94A3B8] mb-1"
                  >
                    {lang === "es"
                      ? "Etiquetas (separadas por coma)"
                      : "Tags (comma-separated)"}
                  </label>
                  <input
                    id={fieldId("tags")}
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090B10] border border-[#2A344B] text-xs text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor={fieldId("body")}
                    className="block text-xs font-mono-hud text-[#94A3B8] mb-1"
                  >
                    {lang === "es"
                      ? "Desarrollo Tecnico / Reglas del Reto"
                      : "Technical Breakdown / Challenge Spec"}
                  </label>
                  <textarea
                    id={fieldId("body")}
                    rows={5}
                    required
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder={
                      lang === "es"
                        ? "Describe la hipotesis, el prompt utilizado o las condiciones de la prueba..."
                        : "Describe the hypothesis, prompt used, or benchmark conditions..."
                    }
                    className="w-full px-3 py-2 bg-[#090B10] border border-[#2A344B] text-xs sm:text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeNewThreadModal}
                    className="px-4 py-2 bg-[#1A2132] text-xs font-mono-hud text-[#94A3B8] cursor-pointer"
                  >
                    {lang === "es" ? "Cancelar" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00E5FF] text-[#090B10] font-mono-hud text-xs font-bold cursor-pointer"
                  >
                    {lang === "es" ? "Publicar en el Foro" : "Publish to Forum"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </BodyPortal>
      )}
    </section>
  );
}
