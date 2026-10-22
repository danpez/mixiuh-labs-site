"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  INITIAL_FORUM_THREADS,
  INITIAL_EP02_PROPOSALS,
  type ForumCategory,
  type ForumThread,
  type Ep02Proposal,
} from "@/data/forumData";
import { CHALLENGES } from "@/data/labsData";
import { EP02_CHALLENGES } from "@/data/ep02Data";
import { EP03_CHALLENGES } from "@/data/ep03Data";
import {
  MessageSquare,
  ArrowUp,
  Search,
  Plus,
  Send,
  Play,
  Copy,
  Check,
  X,
} from "lucide-react";

interface Props {
  lang: "es" | "en";
  onJumpToArena: (episode: "ep03" | "ep02" | "ep01", challengeN: number) => void;
}

function formatInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-[#060B14] border border-[#22A2DD]/30 font-mono-hud text-[#5EEAD4] text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function ForumSection({ lang, onJumpToArena }: Props) {
  // Combine curated threads with individual prompt/audit threads for all 6 EP03 + 6 EP02 + 10 EP01 challenges
  const defaultThreads = useMemo<ForumThread[]>(() => {
    const ep03Threads: ForumThread[] = EP03_CHALLENGES.map((ch) => ({
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
      createdAt: "2026-10-22",
      readTime: "4 min",
      upvotes: 118 + (7 - ch.n) * 11,
      views: 840 + ch.n * 75,
      relatedChallengeN: ch.n,
      tags: [
        "EP03",
        `Reto 0${ch.n}`,
        ch.dir,
        ch.winner === "superkit" ? "Ganador: Superpowers Kit" : "Ganador: IA Sin Kit",
        ch.skill,
      ],
      content_es: [
        `Skill evaluado en el reto: ${ch.skill} (${ch.tech}).`,
        `Reloj y rendimiento en Antigravity CLI (Gemini 4 Argon High): Con el Superpowers Kit tardo ${ch.superkit_min} minutos (${ch.superkit_lines} lineas / ${ch.superkit_kb} KB · ${ch.superkit_fps}) contra ${ch.vanilla_min} minutos de Gemini 4 Argon High Sin Kit (${ch.vanilla_lines} lineas / ${ch.vanilla_kb} KB · ${ch.vanilla_fps}).`,
        `Telemetria de tokens y factura API: Superpowers Kit consumio ${ch.superkit_tok} tokens (${ch.superkit_steps} pasos de agente) por $${ch.superkit_usd.toFixed(2)} USD. IA Sin Kit consumio ${ch.vanilla_tok} tokens (${ch.vanilla_steps} pasos de agente) por $${ch.vanilla_usd.toFixed(2)} USD.`,
        `Veredicto del arbitro (Kevin Gonzalez): ${ch.verdict_es}`,
      ],
      content_en: [
        `Evaluated Skill: ${ch.skill} (${ch.tech}).`,
        `Clock & performance in Antigravity CLI (Gemini 4 Argon High): With the Superpowers Kit it took ${ch.superkit_min} minutes (${ch.superkit_lines} lines / ${ch.superkit_kb} KB · ${ch.superkit_fps}) versus ${ch.vanilla_min} minutes for Raw Gemini 4 Argon High (${ch.vanilla_lines} lines / ${ch.vanilla_kb} KB · ${ch.vanilla_fps}).`,
        `Token telemetry & API bill: Superpowers Kit consumed ${ch.superkit_tok} tokens (${ch.superkit_steps} agent steps) for $${ch.superkit_usd.toFixed(2)} USD. Raw AI consumed ${ch.vanilla_tok} tokens (${ch.vanilla_steps} agent steps) for $${ch.vanilla_usd.toFixed(2)} USD.`,
        `Referee verdict (Kevin Gonzalez): ${ch.verdict_en}`,
      ],
      comments: [],
    }));

    const ep02Threads: ForumThread[] = EP02_CHALLENGES.map((ch) => ({
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
      createdAt: "2026-10-18",
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
        `Referee verdict (Kevin Gonzalez): "${ch.kevin_note_en}"`,
        `Key Argon deliverables: ${ch.argon_features.join(" · ")}.`,
        `Opus 5.5 deliverables & observations: ${ch.opus_features.join(" · ")} | ${ch.opus_observations.join(" · ")}.`,
      ],
      comments: [],
    }));

    const ep01Threads: ForumThread[] = CHALLENGES.map((ch) => ({
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
      createdAt: "2026-10-14",
      readTime: "4 min",
      upvotes: 60 + (11 - ch.n) * 7,
      views: 420 + ch.n * 45,
      relatedChallengeN: ch.n,
      tags: ["EP01", `Nivel ${ch.n}`, ch.dir, ch.tech.split("+")[0].trim(), "Zero-Shot"],
      content_es: [
        `Resumen del reto (EP01 Argon vs Flash): ${ch.prompt_gist_es}`,
        `Tiempos de generacion en Antigravity: Gemini 4 Argon (High) tardo ${ch.time_min.argon} minutos (${ch.code_stats.argon_lines} lineas / ${ch.code_stats.argon_kb} KB) contra ${ch.time_min.flash} minutos de Gemini 3.8 Flash (High) (${ch.code_stats.flash_lines} lineas / ${ch.code_stats.flash_kb} KB). Relacion de velocidad: ${ch.speed_ratio}.`,
        `Nota textual del arbitro (Kevin Gonzalez): "${ch.kevin_note_verbatim}"`,
        `Entregables destacados en Argon: ${ch.argon_features.join(" · ")}.`,
        `Observaciones en Flash: ${ch.flash_problems.join(" · ")}.`,
      ],
      content_en: [
        `Challenge summary (EP01 Argon vs Flash): ${ch.prompt_gist_en}`,
        `Generation times in Antigravity: Gemini 4 Argon (High) took ${ch.time_min.argon} minutes (${ch.code_stats.argon_lines} lines / ${ch.code_stats.argon_kb} KB) versus ${ch.time_min.flash} minutes for Gemini 3.8 Flash (High) (${ch.code_stats.flash_lines} lines / ${ch.code_stats.flash_kb} KB). Speed ratio: ${ch.speed_ratio}.`,
        `Referee note (Kevin Gonzalez): "${ch.kevin_note_en}"`,
        `Key Argon features: ${ch.argon_features.join(" · ")}.`,
        `Flash observations: ${ch.flash_problems.join(" · ")}.`,
      ],
      comments: [],
    }));
    return [...INITIAL_FORUM_THREADS, ...ep03Threads, ...ep02Threads, ...ep01Threads];
  }, []);

  const [threads, setThreads] = useState<ForumThread[]>(defaultThreads);
  const [proposals, setProposals] = useState<Ep02Proposal[]>(
    INITIAL_EP02_PROPOSALS
  );
  const [activeCategory, setActiveCategory] = useState<ForumCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    INITIAL_FORUM_THREADS[1].id // Default open: EP02 Level 1 Verlet 28 FPS vs 120 FPS Autopsy
  );
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [votedProposals, setVotedProposals] = useState<Record<string, boolean>>(
    {}
  );

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
  const [newTags, setNewTags] = useState("EP03, Benchmark, Zero-Shot");
  const [newBody, setNewBody] = useState("");

  // Load saved threads/votes from localStorage
  useEffect(() => {
    try {
      const savedUpvotes = localStorage.getItem("mlabs_upvotes_v1");
      if (savedUpvotes) setUpvotedIds(JSON.parse(savedUpvotes));

      const savedPropVotes = localStorage.getItem("mlabs_prop_votes_v1");
      if (savedPropVotes) setVotedProposals(JSON.parse(savedPropVotes));

      const savedCustomThreads = localStorage.getItem("mlabs_custom_threads_v1");
      if (savedCustomThreads) {
        const parsed: ForumThread[] = JSON.parse(savedCustomThreads);
        setThreads([...parsed, ...defaultThreads]);
      }
    } catch {
      // ignore storage errors
    }
  }, [defaultThreads]);

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
      const tagsMatch = t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCat && (title.includes(q) || excerpt.includes(q) || tagsMatch);
    });
  }, [threads, activeCategory, searchQuery, lang]);

  const activeThread =
    threads.find((t) => t.id === selectedThreadId) ||
    filteredThreads[0] ||
    threads[0];

  const activeThreadEpisode: "ep03" | "ep02" | "ep01" =
    activeThread?.episode === "ep01"
      ? "ep01"
      : activeThread?.episode === "ep03"
      ? "ep03"
      : "ep02";

  const linkedPromptVerbatim = useMemo(() => {
    if (!activeThread?.relatedChallengeN) return undefined;
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

  const handleUpvoteThread = (id: string) => {
    const already = !!upvotedIds[id];
    const nextUpvoted = { ...upvotedIds, [id]: !already };
    setUpvotedIds(nextUpvoted);
    localStorage.setItem("mlabs_upvotes_v1", JSON.stringify(nextUpvoted));
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, upvotes: t.upvotes + (already ? -1 : 1) } : t
      )
    );
  };

  const handleVoteProposal = (id: string) => {
    const already = !!votedProposals[id];
    const nextVoted = { ...votedProposals, [id]: !already };
    setVotedProposals(nextVoted);
    localStorage.setItem("mlabs_prop_votes_v1", JSON.stringify(nextVoted));
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, votes: p.votes + (already ? -1 : 1) } : p
      )
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    const authorName =
      commentAuthor.trim() ||
      (lang === "es" ? "Ingeniero Invitado" : "Guest Engineer");
    const roleName =
      commentRole.trim() ||
      (lang === "es" ? "Comunidad Mixiuh Labs" : "Mixiuh Labs Community");
    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      role: roleName,
      handle: `@${
        authorName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 12) || "dev"
      }`,
      createdAt: lang === "es" ? "Justo ahora" : "Just now",
      body_es: commentBody.trim(),
      body_en: commentBody.trim(),
      upvotes: 1,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? { ...t, comments: [...t.comments, newComment] }
          : t
      )
    );
    setCommentBody("");
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const created: ForumThread = {
      id: `custom-${Date.now()}`,
      slug: `custom-${Date.now()}`,
      category: newCategory,
      badge_es: "APORTE DE LA COMUNIDAD",
      badge_en: "COMMUNITY SUBMISSION",
      title_es: newTitle.trim(),
      title_en: newTitle.trim(),
      excerpt_es: newBody.trim().slice(0, 160),
      excerpt_en: newBody.trim().slice(0, 160),
      author: newAuthor.trim() || "Miembro del Lab",
      authorRole_es: "Investigador Invitado",
      authorRole_en: "Guest Researcher",
      createdAt: "2026-10-21",
      readTime: "3 min",
      upvotes: 1,
      views: 1,
      tags: newTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      content_es: newBody.trim().split("\n\n"),
      content_en: newBody.trim().split("\n\n"),
      comments: [],
    };

    setThreads((prev) => [created, ...prev]);
    try {
      const existing = JSON.parse(
        localStorage.getItem("mlabs_custom_threads_v1") || "[]"
      );
      localStorage.setItem(
        "mlabs_custom_threads_v1",
        JSON.stringify([created, ...existing])
      );
    } catch {
      // ignore
    }
    setSelectedThreadId(created.id);
    setShowNewThreadModal(false);
    setNewTitle("");
    setNewBody("");
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
        label_es: "Dossiers y Benchmarks (EP01/EP02/EP03)",
        label_en: "Dossiers & Benchmarks (EP01/EP02/EP03)",
      },
      {
        id: "autopsias",
        label_es: "Autopsias de Codigo y Tokens",
        label_en: "Code & Token Autopsies",
      },
      {
        id: "prompts",
        label_es: "Los 22 Prompts Zero-Shot",
        label_en: "All 22 Zero-Shot Prompts",
      },
      {
        id: "pipeline",
        label_es: "Pipeline Voicefy + Reelfy",
        label_en: "Voicefy + Reelfy Pipeline",
      },
      {
        id: "propuestas",
        label_es: "Propuestas Episodio 03",
        label_en: "Episode 03 Proposals",
      },
    ];

  return (
    <section id="foro" className="scroll-mt-24 py-14 border-t border-[#22A2DD]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11283F] border border-[#22A2DD]/30 text-[#5EEAD4] text-xs font-mono-hud uppercase tracking-wider mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              {lang === "es"
                ? "FORO TECNICO MIXIUH LABS · BITACORA DE PRUEBAS EP01 + EP02"
                : "MIXIUH LABS TECHNICAL FORUM · EP01 + EP02 EXPERIMENT LOG"}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
              {lang === "es"
                ? "Foro de Pruebas, Autopsias de Codigo y Comunidad"
                : "Experiment Forum, Code Autopsies & Community"}
            </h2>
            <p className="text-[#8FA3B8] text-sm sm:text-base mt-2 max-w-3xl">
              {lang === "es"
                ? "Explora el analisis forense de los Episodios 01 y 02, inspecciona por que Claude Opus 5.5 cayo a 28 FPS en la tela Verlet o por que su factura triplico los tokens, copia los 16 prompts y vota por el Episodio 03."
                : "Explore the forensic breakdown of Episodes 01 and 02, inspect why Claude Opus 5.5 dropped to 28 FPS on the Verlet cloth or why its token bill was 2.6x higher, copy all 16 prompts, and vote on Episode 03."}
            </p>
          </div>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="self-start lg:self-end px-5 py-3 rounded-xl bg-[#22A2DD] hover:brightness-110 text-[#060B14] font-mono-hud text-xs font-bold transition flex items-center gap-2 shadow-[0_0_24px_rgba(34,162,221,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {lang === "es"
              ? "Publicar Hilo / Proponer Reto"
              : "Post Thread / Propose Challenge"}
          </button>
        </div>

        {/* Episode 03 Voting Board */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0B1D30] via-[#11283F]/90 to-[#0B1D30] border border-[#22A2DD]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="text-xs font-mono-hud uppercase text-[#FBBF24] font-bold flex flex-wrap items-center gap-1.5">
                <span>
                  {lang === "es"
                    ? "PIZARRA DE VOTACION ACTIVA · PROXIMO VIDEO EN YOUTUBE ("
                    : "ACTIVE VOTING BOARD · NEXT YOUTUBE EPISODE ("}
                </span>
                <a
                  href="https://www.youtube.com/@MixiuhLabsES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5EEAD4] hover:underline"
                >
                  @MixiuhLabsES
                </a>
                <span>/</span>
                <a
                  href="https://www.youtube.com/@MixiuhLabsEN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B794F6] hover:underline"
                >
                  @MixiuhLabsEN
                </a>
                <span>)</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                {lang === "es"
                  ? "¿Que modelos o reto extremo metemos al laboratorio en el Episodio 03?"
                  : "Which models or extreme challenge should we test in Episode 03?"}
              </h3>
            </div>
            <span className="font-mono-hud text-xs text-[#5EEAD4]">
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
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    voted
                      ? "bg-[#060B14] border-[#34D399] shadow-[0_0_16px_rgba(52,211,153,0.18)]"
                      : "bg-[#060B14]/70 border-white/10 hover:border-[#22A2DD]/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-[#22A2DD]/15 text-[#5EEAD4] font-mono-hud text-[10px] font-bold">
                        {prop.models}
                      </span>
                      <span className="font-mono-hud text-[10px] text-[#8FA3B8]">
                        {lang === "es" ? prop.status_es : prop.status_en}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-white leading-snug mb-2">
                      {lang === "es" ? prop.title_es : prop.title_en}
                    </h4>
                    <p className="text-xs text-[#8FA3B8] leading-relaxed mb-4">
                      {lang === "es" ? prop.description_es : prop.description_en}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVoteProposal(prop.id)}
                    className={`w-full py-2 px-3 rounded-lg font-mono-hud text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      voted
                        ? "bg-[#34D399] text-[#060B14]"
                        : "bg-[#11283F] text-white hover:bg-[#22A2DD] hover:text-[#060B14]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowUp className="w-3.5 h-3.5" />
                      {voted
                        ? lang === "es"
                          ? "Voto Registrado"
                          : "Vote Recorded"
                        : lang === "es"
                        ? "Votar por este reto"
                        : "Vote for this test"}
                    </span>
                    <span>{prop.votes} pts</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter Bar + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl font-mono-hud text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                }`}
              >
                {lang === "es" ? cat.label_es : cat.label_en}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#8FA3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "es"
                  ? "Buscar Opus, Verlet, tokens, CCD, Uint32Array..."
                  : "Search Opus, Verlet, tokens, CCD, Uint32Array..."
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1D30] border border-white/15 text-xs sm:text-sm text-white placeholder:text-[#8FA3B8] focus:outline-none focus:border-[#22A2DD]"
            />
          </div>
        </div>

        {/* Two-Column Forum Layout: Left Thread Feed (5 cols), Right Active Thread Reader (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Thread List */}
          <div className="lg:col-span-5 space-y-3 max-h-[880px] overflow-y-auto pr-1">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThread?.id;
              const isUpvoted = !!upvotedIds[thread.id];
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-[#11283F] border-[#22A2DD] shadow-[0_0_24px_rgba(34,162,221,0.18)]"
                      : "bg-[#0B1D30]/90 border-white/10 hover:border-white/25 hover:bg-[#0B1D30]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded font-mono-hud text-[10px] font-bold ${
                        thread.category === "autopsias"
                          ? "bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/30"
                          : thread.category === "benchmarks"
                          ? "bg-[#B794F6]/20 text-[#B794F6] border border-[#B794F6]/30"
                          : thread.category === "pipeline"
                          ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30"
                          : "bg-[#22A2DD]/20 text-[#5EEAD4] border border-[#22A2DD]/30"
                      }`}
                    >
                      {lang === "es" ? thread.badge_es : thread.badge_en}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#8FA3B8]">
                      {thread.readTime} · {thread.createdAt}
                    </span>
                  </div>

                  <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug mb-1.5">
                    {formatInlineCode(
                      lang === "es" ? thread.title_es : thread.title_en
                    )}
                  </h3>

                  <p className="text-xs text-[#8FA3B8] line-clamp-2 leading-relaxed mb-3">
                    {formatInlineCode(
                      lang === "es" ? thread.excerpt_es : thread.excerpt_en
                    )}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono-hud text-[#8FA3B8]">
                    <span>{thread.author}</span>
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          isUpvoted ? "text-[#34D399] font-bold" : "text-[#5EEAD4]"
                        }
                      >
                        ▲ {thread.upvotes}
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
            <div className="lg:col-span-7 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 p-5 sm:p-8 shadow-2xl">
              {/* Top Meta & Upvote */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#11283F] border border-[#22A2DD]/40 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                    {lang === "es"
                      ? activeThread.badge_es
                      : activeThread.badge_en}
                  </span>
                  <span className="text-xs font-mono-hud text-[#8FA3B8]">
                    {activeThread.createdAt} · {activeThread.readTime}
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
                      className="px-3 py-1.5 rounded-lg bg-[#B794F6] text-[#060B14] font-mono-hud text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {lang === "es"
                        ? `Jugar ${activeThreadEpisode.toUpperCase()} Reto ${activeThread.relatedChallengeN}`
                        : `Play ${activeThreadEpisode.toUpperCase()} Challenge ${activeThread.relatedChallengeN}`}
                    </button>
                  )}
                  <button
                    onClick={() => handleUpvoteThread(activeThread.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-mono-hud text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                      upvotedIds[activeThread.id]
                        ? "bg-[#34D399] text-[#060B14] border-[#34D399]"
                        : "bg-[#11283F] text-white border-white/15 hover:border-[#34D399]"
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{activeThread.upvotes}</span>
                  </button>
                </div>
              </div>

              {/* Title & Author */}
              <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-5 mb-2 leading-tight">
                {formatInlineCode(
                  lang === "es" ? activeThread.title_es : activeThread.title_en
                )}
              </h3>
              <div className="text-xs font-mono-hud text-[#8FA3B8] mb-5">
                {activeThread.author} —{" "}
                <span className="text-[#5EEAD4]">
                  {lang === "es"
                    ? activeThread.authorRole_es
                    : activeThread.authorRole_en}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {activeThread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-[#060B14] border border-white/10 font-mono-hud text-[11px] text-[#8FA3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Body Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-[#F5F7FA]/90 leading-relaxed">
                {(lang === "es"
                  ? activeThread.content_es
                  : activeThread.content_en
                ).map((p, idx) => (
                  <p key={idx}>{formatInlineCode(p)}</p>
                ))}
              </div>

              {/* Forensic Code Comparison Box (if present) */}
              {activeThread.codeComparison && (
                <div className="mt-6 rounded-xl bg-[#060B14] border border-[#F43F5E]/30 overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#11283F] border-b border-white/10 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                    {lang === "es"
                      ? activeThread.codeComparison.title_es
                      : activeThread.codeComparison.title_en}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-4">
                      <div className="text-[11px] font-mono-hud font-bold text-[#FBBF24] mb-2">
                        {lang === "es"
                          ? activeThread.codeComparison.leftLabel_es ||
                            "[IZQUIERDA] GEMINI 3.8 FLASH (BUG / OMISION)"
                          : activeThread.codeComparison.leftLabel_en ||
                            "[LEFT] GEMINI 3.8 FLASH (BUG / OMISSION)"}
                      </div>
                      <pre className="text-xs font-mono-hud text-[#F5F7FA] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeThread.codeComparison.flashCode}
                      </pre>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] font-mono-hud font-bold text-[#B794F6] mb-2">
                        {lang === "es"
                          ? activeThread.codeComparison.rightLabel_es ||
                            "[DERECHA] GEMINI 4 ARGON (SOLUCION EXACTA)"
                          : activeThread.codeComparison.rightLabel_en ||
                            "[RIGHT] GEMINI 4 ARGON (EXACT SOLUTION)"}
                      </div>
                      <pre className="text-xs font-mono-hud text-[#34D399] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeThread.codeComparison.argonCode}
                      </pre>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0B1D30]/80 border-t border-white/10 text-xs text-[#8FA3B8] leading-relaxed">
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
                <div className="mt-6 rounded-xl bg-[#060B14] border border-[#22A2DD]/30 overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#11283F] border-b border-white/10 flex items-center justify-between gap-2">
                    <span className="font-mono-hud text-xs font-bold text-[#5EEAD4]">
                      {lang === "es"
                        ? `Prompt Oficial Zero-Shot — ${activeThreadEpisode.toUpperCase()} Reto ${activeThread.relatedChallengeN}`
                        : `Official Zero-Shot Prompt — ${activeThreadEpisode.toUpperCase()} Challenge ${activeThread.relatedChallengeN}`}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(linkedPromptVerbatim);
                        setCopiedPromptInThread(true);
                        setTimeout(() => setCopiedPromptInThread(false), 2000);
                      }}
                      className="px-3 py-1 rounded bg-[#22A2DD] text-[#060B14] font-mono-hud text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPromptInThread ? (
                        <>
                          <Check className="w-3 h-3" />
                          {lang === "es" ? "Copiado" : "Copied"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          {lang === "es" ? "Copiar Prompt" : "Copy Prompt"}
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono-hud text-[#F5F7FA]/90 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
                    {linkedPromptVerbatim}
                  </pre>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="font-mono-hud text-xs uppercase tracking-wider text-[#5EEAD4] font-bold mb-4">
                  {lang === "es"
                    ? `COMENTARIOS Y APORTES TECNICOS (${activeThread.comments.length})`
                    : `TECHNICAL COMMENTS & DISCUSSION (${activeThread.comments.length})`}
                </h4>

                <div className="space-y-3 mb-6">
                  {activeThread.comments.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#060B14]/60 border border-white/10 text-xs text-[#8FA3B8]">
                      {lang === "es"
                        ? "Se el primero en comentar este analisis o compartir tus resultados replicando el prompt."
                        : "Be the first to comment on this analysis or share your results replicating the prompt."}
                    </div>
                  ) : (
                    activeThread.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-[#060B14] border border-white/10"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="text-xs font-mono-hud">
                            <span className="font-bold text-white">
                              {c.author}
                            </span>{" "}
                            <span className="text-[#5EEAD4]">· {c.role}</span>
                          </div>
                          <span className="text-[11px] font-mono-hud text-[#8FA3B8]">
                            {c.createdAt}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#F5F7FA]/90 leading-relaxed">
                          {lang === "es" ? c.body_es : c.body_en}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form
                  onSubmit={handleAddComment}
                  className="p-4 rounded-xl bg-[#060B14] border border-[#22A2DD]/25 space-y-3"
                >
                  <div className="text-xs font-mono-hud text-white font-bold">
                    {lang === "es"
                      ? "Agregar comentario o reporte de prueba"
                      : "Add comment or benchmark report"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder={
                        lang === "es" ? "Tu nombre o alias" : "Your name or handle"
                      }
                      className="px-3 py-2 rounded-lg bg-[#0B1D30] border border-white/10 text-xs text-white placeholder:text-[#8FA3B8] focus:outline-none focus:border-[#22A2DD]"
                    />
                    <input
                      type="text"
                      value={commentRole}
                      onChange={(e) => setCommentRole(e.target.value)}
                      placeholder={
                        lang === "es"
                          ? "Especialidad (ej. Frontend, IA, Shaders)"
                          : "Role (e.g. Graphics Dev, AI Engineer)"
                      }
                      className="px-3 py-2 rounded-lg bg-[#0B1D30] border border-white/10 text-xs text-white placeholder:text-[#8FA3B8] focus:outline-none focus:border-[#22A2DD]"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder={
                      lang === "es"
                        ? "Escribe tu observacion sobre el codigo, propon una variacion del prompt o comparte que modelo probaste..."
                        : "Write your code observation, suggest a prompt tweak, or share which model you tested..."
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1D30] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#8FA3B8] focus:outline-none focus:border-[#22A2DD]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {lang === "es" ? "Publicar Comentario" : "Post Comment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating a New Thread */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white">
                {lang === "es"
                  ? "Publicar Nuevo Hilo / Proponer Experimento"
                  : "Publish New Thread / Propose Experiment"}
              </h3>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1.5 rounded-lg bg-white/5 text-[#8FA3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-hud text-[#8FA3B8] mb-1">
                    {lang === "es" ? "Autor / Alias" : "Author / Handle"}
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Ej. Kevin Gonzalez"
                    className="w-full px-3 py-2 rounded-lg bg-[#060B14] border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-hud text-[#8FA3B8] mb-1">
                    {lang === "es" ? "Categoria" : "Category"}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as Exclude<ForumCategory, "all">
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#060B14] border border-white/15 text-xs text-white"
                  >
                    <option value="propuestas">Propuestas Episodio 03</option>
                    <option value="benchmarks">Dossiers y Benchmarks</option>
                    <option value="autopsias">Autopsias de Codigo</option>
                    <option value="prompts">Prompts y Reproducibilidad</option>
                    <option value="pipeline">Pipeline Mixiuh Labs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-hud text-[#8FA3B8] mb-1">
                  {lang === "es" ? "Titulo del Hilo" : "Thread Title"}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    lang === "es"
                      ? "Ej. Propuesta EP03: Gemini 4 Argon vs GPT-5.4 High en WebGPU"
                      : "E.g. EP03 Proposal: Gemini 4 Argon vs GPT-5.4 High in WebGPU"
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#060B14] border border-white/15 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-hud text-[#8FA3B8] mb-1">
                  {lang === "es"
                    ? "Etiquetas (separadas por coma)"
                    : "Tags (comma-separated)"}
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#060B14] border border-white/15 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-hud text-[#8FA3B8] mb-1">
                  {lang === "es"
                    ? "Desarrollo Tecnico / Reglas del Reto"
                    : "Technical Breakdown / Challenge Spec"}
                </label>
                <textarea
                  rows={5}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder={
                    lang === "es"
                      ? "Describe la hipotesis, el prompt utilizado o las condiciones de la prueba..."
                      : "Describe the hypothesis, prompt used, or benchmark conditions..."
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#060B14] border border-white/15 text-xs sm:text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono-hud text-[#8FA3B8] cursor-pointer"
                >
                  {lang === "es" ? "Cancelar" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold cursor-pointer"
                >
                  {lang === "es" ? "Publicar en el Foro" : "Publish to Forum"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
