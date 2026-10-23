"use client";

import React, { useState, useEffect } from "react";
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
import {
  EP03_BENCHMARK_TOTALS,
  EP03_CHALLENGES,
  EPISODE_03_CHAPTERS,
  EP03_HONESTY_NOTES,
} from "@/data/ep03Data";
import DemoArenaSection from "@/components/DemoArenaModal";
import ForumSection from "@/components/ForumSection";
import {
  getReleasedStatus,
  isContentReleased,
  type ReleaseKey,
  type ReleasedState,
} from "@/data/releaseSchedule";
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
  LayoutGrid,
  FileText,
  Sparkles,
  MessageSquare,
  Cpu,
  Download,
  Copy,
  Check,
} from "lucide-react";

type MainView = "blog" | "dossiers" | "comunidad" | "arena" | "foro";
type DossierEpisode = "ep03" | "ep02" | "ep01";
type BlogFilter = "all" | "torneos" | "kits" | "comunidad";

export default function MixiuhLabsHomePage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [released, setReleased] = useState<ReleasedState>(() =>
    getReleasedStatus()
  );
  const [mainView, setMainView] = useState<MainView>("blog");
  const [blogFilter, setBlogFilter] = useState<BlogFilter>("all");
  const [dossierEp, setDossierEp] = useState<DossierEpisode>(() =>
    getReleasedStatus().ep03 ? "ep03" : "ep02"
  );

  // Arena & Episode state
  const [activeEpisode, setActiveEpisode] = useState<"ep02" | "ep01">("ep02");
  const [selectedChallengeN, setSelectedChallengeN] = useState<number>(1);
  const [arenaMode, setArenaMode] = useState<"ep03" | "ep02_ep01">(() =>
    getReleasedStatus().ep03 ? "ep03" : "ep02_ep01"
  );

  // EP03 interactive comparator state
  const [ep03ChallengeN, setEp03ChallengeN] = useState<number>(2);
  const [ep03Mode, setEp03Mode] = useState<
    "split" | "superkit" | "vanilla" | "still" | "prompt"
  >("split");
  const [copiedEp03Prompt, setCopiedEp03Prompt] = useState(false);

  // Video & Glossary state
  const [activeVideoClip, setActiveVideoClip] = useState<"hook" | "boss">(
    "hook"
  );
  const [glossarySearch, setGlossarySearch] = useState("");
  const [foroSubTab, setForoSubTab] = useState<"hilos" | "glosario">("hilos");

  // Sync release status + URL hash navigation (respecting embargo dates unless ?preview=all)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previewAll = params.get("preview") === "all";
    const rel = getReleasedStatus(new Date(), previewAll);
    setReleased(rel);

    if (!rel.ep03) {
      setDossierEp((prev) => (prev === "ep03" ? "ep02" : prev));
      setArenaMode("ep02_ep01");
    }

    const applyHash = () => {
      const h = window.location.hash.replace("#", "");
      if (!h || h === "top") return;
      if (h === "ep03-superpowers-kit" && rel.ep03) {
        setMainView("dossiers");
        setDossierEp("ep03");
      } else if (h === "comentario-al-codigo" && rel.cc01) {
        setMainView("comunidad");
      } else if (h === "dossier" || h === "matriz") {
        setMainView("dossiers");
      } else if (h === "arena") {
        setMainView("arena");
      } else if (h === "foro") {
        setMainView("foro");
        setForoSubTab("hilos");
      } else if (h === "glosario" || h === "ecosistema") {
        setMainView("foro");
        setForoSubTab("glosario");
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const navigateToView = (view: MainView, subEp?: DossierEpisode) => {
    if (view === "comunidad" && !released.cc01 && !released.ep03) {
      setMainView("blog");
      return;
    }
    setMainView(view);
    if (subEp) {
      const safeEp = subEp === "ep03" && !released.ep03 ? "ep02" : subEp;
      setDossierEp(safeEp);
      if (safeEp === "ep02" || safeEp === "ep01") {
        setActiveEpisode(safeEp);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEpisodeChange = (ep: "ep02" | "ep01") => {
    setActiveEpisode(ep);
    setDossierEp(ep);
    setSelectedChallengeN(ep === "ep02" ? 1 : 6);
    setActiveVideoClip("hook");
  };

  const handleJumpToArena = (
    episode: "ep03" | "ep02" | "ep01",
    challengeN: number
  ) => {
    if (episode === "ep03" && released.ep03) {
      setEp03ChallengeN(challengeN);
      setArenaMode("ep03");
      setMainView("arena");
    } else {
      const safeEp = episode === "ep03" ? "ep02" : episode;
      setActiveEpisode(safeEp);
      setSelectedChallengeN(challengeN);
      setArenaMode("ep02_ep01");
      setMainView("arena");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredGlossary = LAB_GLOSSARY.filter((item) => {
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.plain_es.toLowerCase().includes(q)
    );
  });

  const isEp02 = dossierEp === "ep02";

  // Blog Cards Data (All 4 Productions, strictly gated by releaseSchedule.ts)
  const BLOG_ARTICLES = [
    {
      id: "ep03" as ReleaseKey,
      filter: "kits" as const,
      date: "25 Oct 2026",
      readTime: "07:31 Video · 12 Demos",
      badge_es: "EPISODIO 03 · BENCHMARK AGY CLI",
      badge_en: "EPISODE 03 · AGY CLI BENCHMARK",
      accentColor: "#34D399",
      scoreBadge_es: "SUPERKIT 4 - 2 SIN KIT",
      scoreBadge_en: "SUPERKIT 4 - 2 RAW AI",
      thumb: "/brand/thumbs/ep03_thumb_A.jpg",
      title_es:
        "Gemini 4 Argon High Sin Kit vs. Mixiuh Superpowers Kit: ¿Siguen Sirviendo los Skills y Memoria Hoy?",
      title_en:
        "Gemini 4 Argon High Raw vs. Mixiuh Superpowers Kit: Do You Still Need Skills & Memory Kits Today?",
      excerpt_es:
        "Corrimos 12 instancias reales y aisladas en la terminal de Antigravity. Gemini 4 Argon High sin kit gano 2 retos clave (Arcade Bullet-Hell con 1,829 balas en 51m y Red Zero-Trust 3D en 5 pasos por $0.74 USD), pero el Superpowers Kit gano 4-2 en el global (276m vs 302m), entregando 70,406 ord/s en HFT Zero-GC y corrigiendo ventanas con el Auto-Debugger MCP.",
      excerpt_en:
        "We executed 12 real isolated runs in the Antigravity CLI. Raw Gemini 4 Argon High won 2 key rounds (Bullet-Hell Boss Rush with 1,829 bullets in 51m and 3D Zero-Trust Network in 5 steps for $0.74 USD), while the Superpowers Kit won 4-2 overall (276m vs 302m), delivering 70,406 ord/s in Zero-GC HFT and fixing overlapping windows via the MCP Auto-Debugger.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "4 - 2 Kit" },
        { label_es: "TIEMPO TOTAL", label_en: "TOTAL TIME", val: "276m vs 302m" },
        { label_es: "COSTO API", label_en: "API COST", val: "$10.85 vs $7.69" },
        { label_es: "TOKENS", label_en: "TOKENS", val: "3.52M vs 2.65M" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep03"),
      onOpenArena: () => {
        setArenaMode("ep03");
        navigateToView("arena");
      },
    },
    {
      id: "cc01" as ReleaseKey,
      filter: "comunidad" as const,
      date: "24 Oct 2026",
      readTime: "Estudio 3D + 10 Artes 2K",
      badge_es: "DEL COMENTARIO AL CODIGO #01 · @TENITO03",
      badge_en: "FROM COMMENT TO CODE #01 · @TENITO03",
      accentColor: "#FBBF24",
      scoreBadge_es: "OVERFIT STUDIO 3D",
      scoreBadge_en: "OVERFIT STUDIO 3D",
      thumb: "/brand/thumbs/cc01_thumb_A.jpg",
      title_es:
        "De un Comentario a una Marca de Ropa IA en 3D: OVERFIT Studio 3D y la Coleccion 'Guerra de Pesos'",
      title_en:
        "From a Comment to a 3D AI Streetwear Brand: OVERFIT Studio 3D & the 'Weight War' Collection",
      excerpt_es:
        "@tenito03 nos pregunto en el Reel de la tela Verlet si con esa textura podiamos hacer una playera, un mockup en blanco editable y lanzar una marca de ropa. Esculpimos en Blender Cycles 3 maniquies de algodon de 300 GSM (Hombre, Mujer y Mesa) y disenamos 10 estampados satiricos en 2K con exportacion 4K.",
      excerpt_en:
        "@tenito03 asked on the Verlet cloth Reel if we could turn that texture into a t-shirt, an editable blank mockup, and launch a clothing brand. We sculpted 3 300 GSM mannequins in Blender Cycles (Male, Female, Flat-Lay) and designed 10 satirical 2K prints with 4K export.",
      metrics: [
        { label_es: "MANIQUIES 3D", label_en: "3D MODELS", val: "Hombre/Mujer/Mesa" },
        { label_es: "COLECCION", label_en: "COLLECTION", val: "10 Artes 2K UHD" },
        { label_es: "GRAMAJE", label_en: "FABRIC", val: "300 GSM + Verlet" },
        { label_es: "EXPORTACION", label_en: "EXPORT", val: "Reels 9:16 + PNG 4K" },
      ],
      onOpenDossier: () => navigateToView("comunidad"),
      onOpenArena: () => navigateToView("comunidad"),
    },
    {
      id: "ep02" as ReleaseKey,
      filter: "torneos" as const,
      date: "21 Oct 2026",
      readTime: "08:06 Video · 12 Demos",
      badge_es: "EPISODIO 02 · DUELO DE TITANES HIGH",
      badge_en: "EPISODE 02 · HIGH TITAN DUEL",
      accentColor: "#B794F6",
      scoreBadge_es: "ARGON 4 - 2 OPUS 5.5",
      scoreBadge_en: "ARGON 4 - 2 OPUS 5.5",
      thumb: "/brand/thumbs/ep02_thumb_A.jpg",
      title_es:
        "Gemini 4 Argon vs. Claude Opus 5.5: 6 Retos Extremos de Fisica, WebGL2 y la Factura Real de Tokens",
      title_en:
        "Gemini 4 Argon vs. Claude Opus 5.5: 6 Extreme Physics & WebGL2 Challenges and the Real Token Bill",
      excerpt_es:
        "Enfrentamos a Claude Opus 5.5 (High) contra Gemini 4 Argon (High) en 6 motores zero-shot: Tela Verlet con desgarro, Fluidos Navier-Stokes GLSL, Cuerpos Blandos XPBD, Motor Voxel 3D, Sintetizador FM DX7 y Pinball CCD. Opus gano 2 retos, pero Argon se impuso 4-2 siendo 1.76x mas rapido y 2.60x mas barato.",
      excerpt_en:
        "We pitted Claude Opus 5.5 (High) against Gemini 4 Argon (High) across 6 zero-shot engines: Tearable Verlet Cloth, GLSL Navier-Stokes Fluids, XPBD Soft Bodies, 3D Voxel Engine, DX7 FM Synth, and CCD Pinball. Opus won 2 rounds, while Argon won 4-2 at 1.76x speed and 2.60x lower cost.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "4 - 2 Argon" },
        { label_es: "TIEMPO TOTAL", label_en: "TOTAL TIME", val: "90m vs 159m" },
        { label_es: "COSTO API", label_en: "API COST", val: "$6.26 vs $16.26" },
        { label_es: "TOKENS", label_en: "TOKENS", val: "3.63M vs 13.01M" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep02"),
      onOpenArena: () => handleJumpToArena("ep02", 1),
    },
    {
      id: "ep01" as ReleaseKey,
      filter: "torneos" as const,
      date: "16 Oct 2026",
      readTime: "10:05 Video · 21 Demos",
      badge_es: "EPISODIO 01 · TORNEO FUNDACIONAL",
      badge_en: "EPISODE 01 · FOUNDATIONAL TOURNAMENT",
      accentColor: "#22A2DD",
      scoreBadge_es: "ARGON 10 - 0 FLASH",
      scoreBadge_en: "ARGON 10 - 0 FLASH",
      thumb: "/brand/thumbs/01_marcador-0-10_1280.jpg",
      title_es:
        "Gemini 4 Argon vs. Gemini 3.8 Flash: 10 Retos Zero-Shot y el Medio Pixel que Rompio un Mundo 3D",
      title_en:
        "Gemini 4 Argon vs. Gemini 3.8 Flash: 10 Zero-Shot Challenges & the Half Pixel That Broke a 3D World",
      excerpt_es:
        "10 pruebas zero-shot sin imagenes externas en Antigravity: Sistema Solar 3D, ADN, Boids, Mazmorras, Falling Sand, Raycasting Wolfenstein, Pixel Art, Reloj CSS, Arbol Fractal y Spirograph. Incluye la autopsia forense del error de redondeo Math.floor(p.x + 0.5) que encerro la camara de Flash dentro de un muro.",
      excerpt_en:
        "10 zero-shot challenges with zero external assets in Antigravity: 3D Solar System, DNA Helix, Boids, Dungeons, Falling Sand, Wolfenstein Raycaster, Pixel Art, CSS Clock, Fractal Tree, and Spirograph. Includes the forensic autopsy of the Math.floor(p.x + 0.5) bug that trapped Flash inside a wall.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "10 - 0 Argon" },
        { label_es: "TIEMPO TOTAL", label_en: "TOTAL TIME", val: "55m vs 94m" },
        { label_es: "APPS FUNCIONALES", label_en: "WORKING APPS", val: "10/10 vs 8/10" },
        { label_es: "CODIGO GENERADO", label_en: "CODE VOLUME", val: "671 KB vs 603 KB" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep01"),
      onOpenArena: () => handleJumpToArena("ep01", 6),
    },
  ];

  const releasedArticles = BLOG_ARTICLES.filter((a) => released[a.id]);
  const filteredArticles = releasedArticles.filter(
    (a) => blogFilter === "all" || a.filter === blogFilter
  );

  // Dynamic spoiler-free counters matching only what has been published
  const totalEpisodesCount = releasedArticles.length;
  const totalDemosCount =
    20 + 12 + (released.cc01 ? 1 : 0) + (released.ep03 ? 12 : 0);
  const totalPromptsCount = 10 + 6 + (released.ep03 ? 6 : 0);
  const totalForumThreadsCount =
    totalPromptsCount + 5 + (released.cc01 ? 1 : 0) + (released.ep03 ? 1 : 0);

  return (
    <div className="min-h-screen labs-grid-bg text-[#F5F7FA] flex flex-col">
      {/* STICKY HEADER WITH CLEAN PORTAL SECTIONS */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#060B14]/95 border-b border-[#22A2DD]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3">
            {/* Brand Logo */}
            <button
              onClick={() => navigateToView("blog")}
              className="flex items-center gap-2.5 shrink-0 group cursor-pointer text-left"
            >
              <img
                src="/brand/logos/mixiuh-labs_mark_dark.svg"
                alt="Mixiuh Labs"
                className="h-8 w-8 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-hud text-sm sm:text-base font-bold tracking-wider text-white whitespace-nowrap">
                    MIXIUH <span className="text-[#22A2DD]">LABS</span>
                  </span>
                  <span className="hidden xl:inline-block px-2 py-0.5 rounded bg-[#11283F] border border-[#22A2DD]/30 font-mono-hud text-[10px] font-bold text-[#5EEAD4] whitespace-nowrap">
                    BLOG · BENCHMARKS · ARENA
                  </span>
                </div>
              </div>
            </button>

            {/* Primary Portal Switcher (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-[#0B1D30] p-1 rounded-xl border border-white/10 font-mono-hud text-[11px] lg:text-xs">
              <button
                onClick={() => navigateToView("blog")}
                className={`px-2.5 lg:px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  mainView === "blog"
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>{`Blog (${totalEpisodesCount})`}</span>
              </button>

              <button
                onClick={() => navigateToView("dossiers")}
                className={`px-2.5 lg:px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  mainView === "dossiers"
                    ? "bg-[#34D399] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {released.ep03
                    ? "Dossiers (EP03·02·01)"
                    : "Dossiers (EP02·01)"}
                </span>
              </button>

              {(released.cc01 || released.ep03) && (
                <button
                  onClick={() => navigateToView("comunidad")}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    mainView === "comunidad"
                      ? "bg-[#FBBF24] text-[#060B14]"
                      : "text-[#8FA3B8] hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {released.ep03
                      ? "OVERFIT 3D & SuperKit"
                      : "OVERFIT Studio 3D"}
                  </span>
                </button>
              )}

              <button
                onClick={() => navigateToView("arena")}
                className={`px-2.5 lg:px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  mainView === "arena"
                    ? "bg-[#B794F6] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                <Play className="w-3.5 h-3.5 shrink-0" />
                <span>{`Arena (${totalDemosCount} Demos)`}</span>
              </button>

              <button
                onClick={() => navigateToView("foro")}
                className={`px-2.5 lg:px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  mainView === "foro"
                    ? "bg-[#5EEAD4] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === "es" ? "Foro & Glosario" : "Forum & Glossary"}
                </span>
              </button>
            </nav>

            {/* Right Controls: Lang + YouTube + GitHub */}
            <div className="flex items-center gap-2 shrink-0">
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
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1D30] hover:bg-[#11283F] border border-[#F43F5E]/40 font-mono-hud text-xs text-white transition"
              >
                <Play className="w-3.5 h-3.5 text-[#F43F5E] fill-current shrink-0" />
                <span>{lang === "es" ? "@MixiuhLabsES" : "@MixiuhLabsEN"}</span>
              </a>

              <a
                href="https://github.com/danpez/gemini-4-argon-vs-3.8-flash-benchmark"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1D30] hover:bg-[#11283F] border border-white/15 font-mono-hud text-xs text-white transition"
              >
                <Code2 className="w-3.5 h-3.5 text-[#5EEAD4] shrink-0" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Mobile View Switcher Bar */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 font-mono-hud text-[11px] whitespace-nowrap">
            <button
              onClick={() => navigateToView("blog")}
              className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                mainView === "blog"
                  ? "bg-[#22A2DD] text-[#060B14]"
                  : "bg-[#0B1D30] text-[#8FA3B8]"
              }`}
            >
              {`Blog (${totalEpisodesCount})`}
            </button>
            <button
              onClick={() => navigateToView("dossiers")}
              className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                mainView === "dossiers"
                  ? "bg-[#34D399] text-[#060B14]"
                  : "bg-[#0B1D30] text-[#8FA3B8]"
              }`}
            >
              {released.ep03 ? "Dossiers EP01-03" : "Dossiers EP01-02"}
            </button>
            {(released.cc01 || released.ep03) && (
              <button
                onClick={() => navigateToView("comunidad")}
                className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                  mainView === "comunidad"
                    ? "bg-[#FBBF24] text-[#060B14]"
                    : "bg-[#0B1D30] text-[#8FA3B8]"
                }`}
              >
                {released.ep03 ? "OVERFIT 3D & Kit" : "OVERFIT 3D"}
              </button>
            )}
            <button
              onClick={() => navigateToView("arena")}
              className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                mainView === "arena"
                  ? "bg-[#B794F6] text-[#060B14]"
                  : "bg-[#0B1D30] text-[#8FA3B8]"
              }`}
            >
              {`Arena (${totalDemosCount})`}
            </button>
            <button
              onClick={() => navigateToView("foro")}
              className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                mainView === "foro"
                  ? "bg-[#5EEAD4] text-[#060B14]"
                  : "bg-[#0B1D30] text-[#8FA3B8]"
              }`}
            >
              {lang === "es" ? "Foro & Glosario" : "Forum & Glossary"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          VIEW 1: BLOG & PORTADA DE EPISODIOS (CLEAN EDITORIAL HUB)
         ===================================================================== */}
      {mainView === "blog" && (
        <main className="flex-1 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Editorial Lab Header + Dynamic Featured Hero (Strictly Released Content Only) */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0B1D30] via-[#11283F] to-[#060B14] border border-[#22A2DD]/35 p-6 sm:p-10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#060B14] border border-[#34D399]/50">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="font-mono-hud text-xs font-bold tracking-wider text-[#34D399]">
                    {lang === "es"
                      ? "AQUI NO SE OPINA: SE PRUEBA. // BLOG DE BENCHMARKS Y LABORATORIO INTERACTIVO"
                      : "HERE, WE DON'T GUESS: WE TEST. // BENCHMARK BLOG & INTERACTIVE LAB"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                  {released.ep03 && (
                    <a
                      href="/downloads/mixiuh-superpowers-kit.zip"
                      download
                      className="px-3 py-1.5 rounded-lg bg-[#34D399] text-[#060B14] font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {lang === "es"
                          ? "Descargar Superpowers Kit v1.0 (.ZIP)"
                          : "Download Superpowers Kit v1.0 (.ZIP)"}
                      </span>
                    </a>
                  )}
                  {released.cc01 && (
                    <button
                      onClick={() => navigateToView("comunidad")}
                      className="px-3 py-1.5 rounded-lg bg-[#FBBF24] text-[#060B14] font-bold hover:brightness-110 transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>OVERFIT Studio 3D</span>
                    </button>
                  )}
                  {!released.ep03 && !released.cc01 && (
                    <a
                      href={YOUTUBE_LINKS.ep02_es}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#F43F5E] text-white font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {lang === "es"
                          ? "Ver EP02 en YouTube (4K60)"
                          : "Watch EP02 on YouTube (4K60)"}
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {released.ep03 ? (
                /* STAGE C HERO: EPISODIO 03 (Releases Sun Oct 25 11:00 CST) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-mono-hud text-xs font-bold">
                      {lang === "es"
                        ? "ESTRENO DESTACADO · EPISODIO 03 · 12 CORRIDAS REALES EN ANTIGRAVITY CLI"
                        : "FEATURED RELEASE · EPISODE 03 · 12 REAL ANTIGRAVITY CLI RUNS"}
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
                      {lang === "es" ? (
                        <>
                          Gemini 4 Argon High{" "}
                          <span className="text-[#FBBF24]">Sin Kit</span> vs.{" "}
                          <span className="text-[#34D399]">
                            Mixiuh Superpowers Kit
                          </span>
                          :{" "}
                          <span className="text-[#5EEAD4]">
                            El Veredicto 4 - 2 Real
                          </span>
                        </>
                      ) : (
                        <>
                          Gemini 4 Argon High{" "}
                          <span className="text-[#FBBF24]">Raw</span> vs.{" "}
                          <span className="text-[#34D399]">
                            Mixiuh Superpowers Kit
                          </span>
                          :{" "}
                          <span className="text-[#5EEAD4]">
                            The Honest 4 - 2 Verdict
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed">
                      {lang === "es"
                        ? "¿Siguen siendo necesarios los Kits de Skills, bancos de memoria y el Auto-Debugger MCP hoy, o solo gastan mas tokens? Pusimos a prueba a Gemini 4 Argon High en 12 instancias aisladas. El modelo sin kit gano 2 rondas clave (Arcade Bullet-Hell con 1,829 proyectiles y Red Zero-Trust 3D en 5 pasos por $0.74), pero el Superpowers Kit gano 4-2 en el global (276m vs 302m), entregando 70,406 ord/s en HFT Zero-GC y corrigiendo ventanas con MCP."
                        : "Are Skills Kits, Memory Banks, and MCP Auto-Debuggers still needed today, or do they just burn extra tokens? We tested Gemini 4 Argon High across 12 isolated runs. Raw AI won 2 key rounds (Bullet-Hell Boss Rush with 1,829 bullets and 3D Zero-Trust Network in 5 steps for $0.74), while the Superpowers Kit won 4-2 overall (276m vs 302m), delivering 70,406 ord/s in Zero-GC HFT and fixing window overlaps via MCP."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => navigateToView("dossiers", "ep03")}
                        className="px-5 py-3 rounded-xl bg-[#34D399] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_24px_rgba(52,211,153,0.3)] cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>
                          {lang === "es"
                            ? "Leer Dossier EP03 + Probar 12 Demos"
                            : "Read EP03 Dossier + Play 12 Demos"}
                        </span>
                      </button>

                      {released.cc01 && (
                        <button
                          onClick={() => navigateToView("comunidad")}
                          className="px-5 py-3 rounded-xl bg-[#FBBF24] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {lang === "es"
                              ? "Ver Del Comentario al Codigo #01 (OVERFIT 3D)"
                              : "Open Comment to Code #01 (OVERFIT 3D)"}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => navigateToView("dossiers", "ep02")}
                        className="px-4 py-3 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#B794F6]/50 text-[#B794F6] font-mono-hud text-xs sm:text-sm font-bold transition cursor-pointer"
                      >
                        {lang === "es"
                          ? "Dossier EP02 (Argon vs Opus 5.5)"
                          : "EP02 Dossier (Argon vs Opus 5.5)"}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div
                      onClick={() => navigateToView("dossiers", "ep03")}
                      className="group relative rounded-2xl overflow-hidden border-2 border-[#34D399]/60 shadow-2xl cursor-pointer"
                    >
                      <img
                        src="/brand/thumbs/ep03_thumb_A.jpg"
                        alt="EP03 Raw vs Superpowers Kit"
                        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-transparent to-transparent flex items-end p-4">
                        <div className="w-full flex items-center justify-between font-mono-hud text-xs">
                          <span className="px-2.5 py-1 rounded bg-[#34D399] text-[#060B14] font-bold">
                            MARCADOR REAL: 4 - 2 SUPERKIT
                          </span>
                          <span className="text-white font-bold">
                            276m vs 302m · $10.85 vs $7.69
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center font-mono-hud">
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#34D399]">
                          {totalEpisodesCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "EPISODIOS" : "EPISODES"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#5EEAD4]">
                          {totalDemosCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "DEMOS EN VIVO" : "LIVE DEMOS"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#B794F6]">
                          {totalPromptsCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "PROMPTS PUROS" : "RAW PROMPTS"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#FBBF24]">
                          53
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "GLOSARIO" : "GLOSSARY"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : released.cc01 ? (
                /* STAGE B HERO: DEL COMENTARIO AL CODIGO #01 (Releases Sat Oct 24 11:00 CST) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#FBBF24] font-mono-hud text-xs font-bold">
                      {lang === "es"
                        ? "ESTRENO DESTACADO · DEL COMENTARIO AL CODIGO #01 · RETO DE @TENITO03"
                        : "FEATURED RELEASE · FROM COMMENT TO CODE #01 · @TENITO03 CHALLENGE"}
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
                      {lang === "es" ? (
                        <>
                          De un Comentario a una{" "}
                          <span className="text-[#FBBF24]">
                            Marca de Ropa IA en 3D
                          </span>
                          :{" "}
                          <span className="text-[#5EEAD4]">
                            OVERFIT Studio 3D
                          </span>
                        </>
                      ) : (
                        <>
                          From a Comment to a{" "}
                          <span className="text-[#FBBF24]">
                            3D AI Streetwear Brand
                          </span>
                          :{" "}
                          <span className="text-[#5EEAD4]">
                            OVERFIT Studio 3D
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed">
                      {lang === "es"
                        ? "@tenito03 nos pregunto en el Reel de la tela Verlet si con esa textura podiamos hacer una playera, un mockup en blanco editable y lanzar una marca de ropa. Esculpimos en Blender Cycles 3 maniquies de algodon de 300 GSM (Hombre, Mujer y Mesa) y disenamos 10 estampados satiricos en 2K con exportacion 4K."
                        : "@tenito03 asked on the Verlet cloth Reel if we could turn that texture into a t-shirt, an editable blank mockup, and launch a clothing brand. We sculpted 3 300 GSM mannequins in Blender Cycles (Male, Female, Flat-Lay) and designed 10 satirical 2K prints with 4K export."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => navigateToView("comunidad")}
                        className="px-5 py-3 rounded-xl bg-[#FBBF24] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_24px_rgba(251,191,36,0.3)] cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {lang === "es"
                            ? "Abrir OVERFIT Studio 3D en Vivo"
                            : "Open Live OVERFIT Studio 3D"}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateToView("dossiers", "ep02")}
                        className="px-5 py-3 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>
                          {lang === "es"
                            ? "Dossier EP02 (Argon vs Opus 5.5)"
                            : "EP02 Dossier (Argon vs Opus 5.5)"}
                        </span>
                      </button>

                      <button
                        onClick={() => handleJumpToArena("ep02", 1)}
                        className="px-4 py-3 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#22A2DD]/50 text-[#5EEAD4] font-mono-hud text-xs sm:text-sm font-bold transition cursor-pointer"
                      >
                        {lang === "es"
                          ? "Arena Interactiva (32 Demos)"
                          : "Interactive Arena (32 Demos)"}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div
                      onClick={() => navigateToView("comunidad")}
                      className="group relative rounded-2xl overflow-hidden border-2 border-[#FBBF24]/60 shadow-2xl cursor-pointer"
                    >
                      <img
                        src="/brand/thumbs/cc01_thumb_A.jpg"
                        alt="OVERFIT Studio 3D"
                        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-transparent to-transparent flex items-end p-4">
                        <div className="w-full flex items-center justify-between font-mono-hud text-xs">
                          <span className="px-2.5 py-1 rounded bg-[#FBBF24] text-[#060B14] font-bold">
                            OVERFIT STUDIO 3D · 300 GSM
                          </span>
                          <span className="text-white font-bold">
                            3 Maniquies GLB · 10 Artes 2K
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center font-mono-hud">
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#34D399]">
                          {totalEpisodesCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "EPISODIOS" : "EPISODES"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#5EEAD4]">
                          {totalDemosCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "DEMOS EN VIVO" : "LIVE DEMOS"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#B794F6]">
                          {totalPromptsCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "PROMPTS PUROS" : "RAW PROMPTS"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#FBBF24]">
                          53
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "GLOSARIO" : "GLOSSARY"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* STAGE A HERO (CURRENT): EPISODIO 02 (Argon vs Claude Opus 5.5 — Zero Spoilers of CC01 or EP03) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B794F6]/15 border border-[#B794F6]/40 text-[#B794F6] font-mono-hud text-xs font-bold">
                      {lang === "es"
                        ? "ESTRENO DESTACADO · EPISODIO 02 · DUELO DE TITANES HIGH + FACTURA REAL DE TOKENS"
                        : "FEATURED RELEASE · EPISODE 02 · HIGH TITAN DUEL + REAL API TOKEN BILL"}
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
                      {lang === "es" ? (
                        <>
                          <span className="text-[#B794F6]">Gemini 4 Argon</span>{" "}
                          vs.{" "}
                          <span className="text-[#FBBF24]">
                            Claude Opus 5.5
                          </span>
                          :{" "}
                          <span className="text-[#5EEAD4]">
                            6 Retos Extremos y la Factura Real
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#B794F6]">Gemini 4 Argon</span>{" "}
                          vs.{" "}
                          <span className="text-[#FBBF24]">
                            Claude Opus 5.5
                          </span>
                          :{" "}
                          <span className="text-[#5EEAD4]">
                            6 Extreme Challenges & the Real API Bill
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed">
                      {lang === "es"
                        ? "Enfrentamos a Claude Opus 5.5 (High) contra Gemini 4 Argon (High) bajo las mismas reglas de laboratorio: un solo prompt identico, cero imagenes externas y entrega en un unico archivo HTML5. Evaluamos Tela Fisica Verlet con desgarro, Fluidos Navier-Stokes GLSL, Cuerpos Blandos XPBD, Motor Voxel 3D, Sintetizador FM DX7 y Pinball Cyberpunk CCD midiendo tiempo real (90m vs 159m) y costo exacto de API ($6.26 vs $16.26 USD)."
                        : "We pitted Claude Opus 5.5 (High) against Gemini 4 Argon (High) under identical zero-shot laboratory rules: Tearable Verlet Cloth, GLSL Navier-Stokes Fluids, XPBD Soft Bodies, 3D Voxel Engine, DX7 FM Synth, and Cyberpunk CCD Pinball—auditing wall-clock time (90m vs 159m) and exact API token cost ($6.26 vs $16.26 USD)."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => navigateToView("dossiers", "ep02")}
                        className="px-5 py-3 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_24px_rgba(183,148,246,0.3)] cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>
                          {lang === "es"
                            ? "Leer Dossier EP02 + Ver Video 4K60"
                            : "Read EP02 Dossier + Watch 4K60 Video"}
                        </span>
                      </button>

                      <button
                        onClick={() => handleJumpToArena("ep02", 1)}
                        className="px-5 py-3 rounded-xl bg-[#34D399] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>
                          {lang === "es"
                            ? "Probar los 12 Motores EP02 en Vivo"
                            : "Play All 12 EP02 Engines Live"}
                        </span>
                      </button>

                      <button
                        onClick={() => navigateToView("dossiers", "ep01")}
                        className="px-4 py-3 rounded-xl bg-[#060B14] hover:bg-[#11283F] border border-[#22A2DD]/50 text-[#5EEAD4] font-mono-hud text-xs sm:text-sm font-bold transition cursor-pointer"
                      >
                        {lang === "es"
                          ? "Dossier EP01 (Argon vs 3.8 Flash)"
                          : "EP01 Dossier (Argon vs 3.8 Flash)"}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div
                      onClick={() => navigateToView("dossiers", "ep02")}
                      className="group relative rounded-2xl overflow-hidden border-2 border-[#B794F6]/60 shadow-2xl cursor-pointer"
                    >
                      <img
                        src="/brand/thumbs/ep02_thumb_A.jpg"
                        alt="EP02 Gemini 4 Argon vs Claude Opus 5.5"
                        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-transparent to-transparent flex items-end p-4">
                        <div className="w-full flex items-center justify-between font-mono-hud text-xs">
                          <span className="px-2.5 py-1 rounded bg-[#B794F6] text-[#060B14] font-bold">
                            MARCADOR: ARGON 4 - 2 OPUS 5.5
                          </span>
                          <span className="text-white font-bold">
                            90m vs 159m · $6.26 vs $16.26
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center font-mono-hud">
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#34D399]">
                          {totalEpisodesCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "EPISODIOS" : "EPISODES"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#5EEAD4]">
                          {totalDemosCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "DEMOS EN VIVO" : "LIVE DEMOS"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#B794F6]">
                          {totalPromptsCount}
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "PROMPTS PUROS" : "RAW PROMPTS"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#060B14]/90 border border-white/10">
                        <div className="text-base sm:text-lg font-black text-[#FBBF24]">
                          53
                        </div>
                        <div className="text-[10px] text-[#8FA3B8]">
                          {lang === "es" ? "GLOSARIO" : "GLOSSARY"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BLOG / ARCHIVO DE EPISODIOS Y DOSSIERS TECNICOS */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="font-mono-hud text-xs font-bold text-[#5EEAD4] uppercase mb-1">
                    {lang === "es"
                      ? "ARCHIVO EDITORIAL Y BITACORA DE PRUEBAS"
                      : "EDITORIAL ARCHIVE & BENCHMARK LOG"}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {lang === "es"
                      ? "Episodios Publicados y Dossiers Tecnicos"
                      : "Published Episodes & Technical Dossiers"}
                  </h2>
                </div>

                {/* Category Filter Pills (Strictly Released Categories Only) */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono-hud text-xs">
                  {(
                    [
                      {
                        id: "all" as const,
                        show: true,
                        es: `Todos (${totalEpisodesCount})`,
                        en: `All (${totalEpisodesCount})`,
                      },
                      {
                        id: "torneos" as const,
                        show: true,
                        es: "Torneos IA vs IA (EP01, EP02)",
                        en: "AI vs AI Duels (EP01, EP02)",
                      },
                      {
                        id: "kits" as const,
                        show: released.ep03,
                        es: "Kits & Workflows (EP03)",
                        en: "Kits & Workflows (EP03)",
                      },
                      {
                        id: "comunidad" as const,
                        show: released.cc01,
                        es: "Del Comentario al Codigo (#01)",
                        en: "Comment to Code (#01)",
                      },
                    ]
                  )
                    .filter((f) => f.show)
                    .map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setBlogFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                          blogFilter === f.id
                            ? "bg-[#22A2DD] text-[#060B14]"
                            : "bg-[#0B1D30] text-[#8FA3B8] hover:text-white border border-white/10"
                        }`}
                      >
                        {lang === "es" ? f.es : f.en}
                      </button>
                    ))}
                </div>
              </div>

              {/* 2-Column Editorial Blog Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className="rounded-2xl bg-[#0B1D30] border border-white/10 hover:border-[#22A2DD]/50 overflow-hidden shadow-xl flex flex-col justify-between transition"
                  >
                    <div>
                      {/* Thumbnail Banner */}
                      <div
                        onClick={art.onOpenDossier}
                        className="relative aspect-video bg-black overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={art.thumb}
                          alt={lang === "es" ? art.title_es : art.title_en}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span
                            className="px-2.5 py-1 rounded-md bg-[#060B14]/90 border font-mono-hud text-[11px] font-bold"
                            style={{
                              borderColor: art.accentColor,
                              color: art.accentColor,
                            }}
                          >
                            {lang === "es" ? art.badge_es : art.badge_en}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-md font-mono-hud text-[11px] font-bold text-[#060B14]"
                            style={{ backgroundColor: art.accentColor }}
                          >
                            {lang === "es"
                              ? art.scoreBadge_es
                              : art.scoreBadge_en}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between font-mono-hud text-xs text-[#8FA3B8]">
                          <span>{art.date}</span>
                          <span className="text-[#5EEAD4]">{art.readTime}</span>
                        </div>

                        <h3
                          onClick={art.onOpenDossier}
                          className="font-display text-xl sm:text-2xl font-black text-white leading-snug hover:text-[#5EEAD4] transition cursor-pointer"
                        >
                          {lang === "es" ? art.title_es : art.title_en}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                          {lang === "es" ? art.excerpt_es : art.excerpt_en}
                        </p>

                        {/* 4 Mini Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          {art.metrics.map((m, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-[#060B14]/80 border border-white/10"
                            >
                              <div className="font-mono-hud text-[10px] text-[#8FA3B8]">
                                {lang === "es" ? m.label_es : m.label_en}
                              </div>
                              <div className="font-mono-hud text-xs font-bold text-white mt-0.5 truncate">
                                {m.val}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 py-4 bg-[#060B14]/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={art.onOpenDossier}
                        className="px-4 py-2 rounded-xl font-mono-hud text-xs font-bold text-[#060B14] hover:brightness-110 transition inline-flex items-center gap-1.5 cursor-pointer"
                        style={{ backgroundColor: art.accentColor }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {lang === "es"
                            ? "Abrir Dossier Completo"
                            : "Open Full Dossier"}
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={art.onOpenArena}
                          className="px-3.5 py-2 rounded-xl bg-[#11283F] hover:bg-[#22A2DD] text-[#5EEAD4] hover:text-[#060B14] font-mono-hud text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>
                            {lang === "es" ? "Probar Demos" : "Play Demos"}
                          </span>
                        </button>

                        <button
                          onClick={() => navigateToView("foro")}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8FA3B8] hover:text-white font-mono-hud text-xs transition cursor-pointer"
                        >
                          {lang === "es" ? "Foro" : "Forum"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* QUICK NAVIGATION CARDS TO SPECIALIZED LAB SECTIONS (SPOILER-FREE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              <div
                onClick={() => navigateToView("arena")}
                className="p-6 rounded-2xl bg-[#0B1D30] border border-[#B794F6]/40 hover:border-[#B794F6] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#B794F6]/15 font-mono-hud text-xs font-bold text-[#B794F6] mb-3">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{`ARENA ZERO-SHOT (${totalDemosCount} DEMOS)`}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {lang === "es"
                      ? `Ejecuta los ${totalDemosCount} Simuladores en tu Navegador`
                      : `Run All ${totalDemosCount} Simulators Live in Your Browser`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                    {released.ep03
                      ? lang === "es"
                        ? "Compara lado a lado las entregas de EP03 (Sin Kit vs Superpowers Kit), EP02 (Argon vs Opus 5.5), EP01 (Argon vs Flash) y OVERFIT 3D sin recargar todo el sitio."
                        : "Compare side-by-side deliverables from EP03 (Raw vs Superpowers Kit), EP02 (Argon vs Opus 5.5), EP01 (Argon vs Flash), and OVERFIT 3D with zero page lag."
                      : lang === "es"
                      ? "Compara lado a lado las entregas originales de EP02 (Gemini 4 Argon vs Claude Opus 5.5) y EP01 (Gemini 4 Argon vs Gemini 3.8 Flash) directamente en tu navegador."
                      : "Compare side-by-side deliverables from EP02 (Gemini 4 Argon vs Claude Opus 5.5) and EP01 (Gemini 4 Argon vs Gemini 3.8 Flash) live in your browser."}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#B794F6]">
                  {lang === "es" ? "Entrar a la Arena →" : "Enter the Arena →"}
                </div>
              </div>

              <div
                onClick={() => {
                  setForoSubTab("hilos");
                  navigateToView("foro");
                }}
                className="p-6 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/40 hover:border-[#22A2DD] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#22A2DD]/15 font-mono-hud text-xs font-bold text-[#5EEAD4] mb-3">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{`FORO TECNICO Y AUTOPSIAS (${totalForumThreadsCount} HILOS)`}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {lang === "es"
                      ? "Autopsias de Codigo, Facturas de Tokens y Prompts"
                      : "Code Autopsies, Token Bills & Verbatim Prompts"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                    {lang === "es"
                      ? `Lee el analisis forense del 28 FPS vs 120 FPS de Verlet en EP02, la factura real de tokens de Claude Opus 5.5, el bug del medio pixel en EP01, copia los ${totalPromptsCount} prompts y vota por el siguiente reto.`
                      : `Read the forensic breakdown of EP02's 28 FPS Verlet bottleneck, Claude Opus 5.5's token bill, EP01's half-pixel bug, copy all ${totalPromptsCount} prompts, and vote on the next challenge.`}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                  {lang === "es"
                    ? "Abrir Foro y Autopsias →"
                    : "Open Forum & Autopsies →"}
                </div>
              </div>

              <div
                onClick={() => {
                  setForoSubTab("glosario");
                  navigateToView("foro");
                }}
                className="p-6 rounded-2xl bg-[#0B1D30] border border-[#34D399]/40 hover:border-[#34D399] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#34D399]/15 font-mono-hud text-xs font-bold text-[#34D399] mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>GLOSARIO (53 TERMINOS) & ECOSISTEMA</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {lang === "es"
                      ? "Diccionario de Ingenieria y Protocolo Cientifico"
                      : "Engineering Dictionary & Scientific Honesty Protocol"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8FA3B8] leading-relaxed">
                    {lang === "es"
                      ? "Consulta en lenguaje claro los 53 conceptos de nuestros episodios (Verlet, Navier-Stokes, XPBD, FFT, CCD, DDA) y conoce las herramientas propias de Mixiuh."
                      : "Look up 53 plain-language engineering concepts (Verlet, Navier-Stokes, XPBD, FFT, CCD, DDA) and explore Mixiuh's proprietary software stack."}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#34D399]">
                  {lang === "es"
                    ? "Explorar Glosario →"
                    : "Explore Glossary →"}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 2: DOSSIERS DE EPISODIOS (STRICTLY RELEASED EPISODES ONLY)
         ===================================================================== */}
      {mainView === "dossiers" && (
        <main className="flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Top Episode Dossier Selector Bar */}
            <div className="p-3 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2 font-mono-hud text-xs text-[#5EEAD4] px-2">
                <FileText className="w-4 h-4 shrink-0" />
                <span className="font-bold uppercase">
                  {lang === "es"
                    ? "SELECCIONA EL DOSSIER TECNICO:"
                    : "SELECT TECHNICAL DOSSIER:"}
                </span>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  released.ep03 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                } gap-2 flex-1 max-w-4xl`}
              >
                {released.ep03 && (
                  <button
                    onClick={() => setDossierEp("ep03")}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      dossierEp === "ep03"
                        ? "bg-[#11283F] border-[#34D399] shadow-[0_0_20px_rgba(52,211,153,0.25)]"
                        : "bg-[#060B14]/70 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-hud text-[10px]">
                      <span className="text-[#34D399] font-bold">
                        EPISODIO 03 · NUEVO
                      </span>
                      <span className="text-[#5EEAD4]">4-2 · 276m vs 302m</span>
                    </div>
                    <div className="font-display text-xs sm:text-sm font-bold text-white mt-1 truncate">
                      Argon High Sin Kit vs. Superpowers Kit
                    </div>
                  </button>
                )}

                <button
                  onClick={() => handleEpisodeChange("ep02")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    dossierEp === "ep02"
                      ? "bg-[#11283F] border-[#B794F6] shadow-[0_0_20px_rgba(183,148,246,0.25)]"
                      : "bg-[#060B14]/70 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-hud text-[10px]">
                    <span className="text-[#B794F6] font-bold">EPISODIO 02</span>
                    <span className="text-[#5EEAD4]">
                      4-2 · $6.26 vs $16.26
                    </span>
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-white mt-1 truncate">
                    Gemini 4 Argon vs. Claude Opus 5.5
                  </div>
                </button>

                <button
                  onClick={() => handleEpisodeChange("ep01")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    dossierEp === "ep01"
                      ? "bg-[#11283F] border-[#22A2DD] shadow-[0_0_20px_rgba(34,162,221,0.25)]"
                      : "bg-[#060B14]/70 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-hud text-[10px]">
                    <span className="text-[#5EEAD4] font-bold">EPISODIO 01</span>
                    <span className="text-[#8FA3B8]">10-0 · 55m vs 94m</span>
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-white mt-1 truncate">
                    Gemini 4 Argon vs. Gemini 3.8 Flash
                  </div>
                </button>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                SUB-DOSSIER A: EPISODIO 03 (GATED BY RELEASE SCHEDULE)
               ----------------------------------------------------------------- */}
            {released.ep03 && dossierEp === "ep03" && (
              <div id="ep03-superpowers-kit" className="space-y-10">
                {/* EP03 Hero & Scoreboard */}
                <div className="rounded-2xl bg-[#0B1D30] border border-[#34D399]/40 p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/50 font-mono-hud text-xs font-bold text-[#34D399]">
                      {lang === "es"
                        ? "DOSSIER OFICIAL EPISODIO 03 · 12 CORRIDAS REALES AGY CLI (GEMINI 4 ARGON HIGH)"
                        : "OFFICIAL EPISODE 03 DOSSIER · 12 REAL AGY CLI RUNS (GEMINI 4 ARGON HIGH)"}
                    </div>
                    <a
                      href="/downloads/mixiuh-superpowers-kit.zip"
                      download
                      className="px-4 py-2 rounded-xl bg-[#34D399] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-2 shadow-[0_0_24px_rgba(52,211,153,0.3)]"
                    >
                      <Download className="w-4 h-4" />
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
                        <span className="text-[#FBBF24]">Sin Kit (Raw)</span>{" "}
                        vs.{" "}
                        <span className="text-[#34D399]">
                          Mixiuh Superpowers Kit v1.0
                        </span>
                        :{" "}
                        <span className="text-[#5EEAD4]">
                          ¿Siguen Sirviendo los Skills y Memoria Hoy?
                        </span>
                      </>
                    ) : (
                      <>
                        Gemini 4 Argon High{" "}
                        <span className="text-[#FBBF24]">Raw (No Kit)</span> vs.{" "}
                        <span className="text-[#34D399]">
                          Mixiuh Superpowers Kit v1.0
                        </span>
                        :{" "}
                        <span className="text-[#5EEAD4]">
                          Do You Still Need Skills & Memory Kits Today?
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed max-w-4xl">
                    {lang === "es"
                      ? "Ejecutamos 12 instancias aisladas de `agy --model gemini-4-argon-high --effort high` en 6 sistemas extremos. A diferencia de los modelos del ano pasado, Gemini 4 Argon High sin kit NO entrego codigo roto en ningun reto e incluso gano 2 puntos (Reto 03 Arcade Bullet-Hell con 1,829 proyectiles activos en 51m vs 69m, y Reto 04 Red Zero-Trust 3D en solo 5 pasos de agente por $0.74 USD). Sin embargo, el Mixiuh Superpowers Kit gano 4 a 2 en el global y ahorro 26 minutos totales (276m vs 302m), logrando 70,406 ord/s en la Terminal HFT Zero-GC (6.3x mas rapido y mas barato), compilando el estudio DAG GLSL 10 minutos antes al mismo precio y corrigiendo con el Auto-Debugger MCP el solapamiento de ventanas en MixiuhOS."
                      : "We ran 12 isolated instances of `agy --model gemini-4-argon-high --effort high` across 6 extreme systems. Unlike last year's models, Raw Gemini 4 Argon High shipped zero broken apps and won 2 rounds outright (Ch 03 Bullet-Hell Boss Rush with 1,829 active bullets in 51m vs 69m, and Ch 04 3D Zero-Trust Network in just 5 agent steps for $0.74 USD). However, the Mixiuh Superpowers Kit won 4-2 overall and saved 26 total minutes (276m vs 302m), delivering 70,406 ord/s in the Zero-GC HFT Terminal (6.3x higher throughput, faster and cheaper), compiling the DAG GLSL Studio 10 minutes earlier for the exact same cost, and catching overlapping startup windows in MixiuhOS via the MCP Auto-Debugger."}
                  </p>

                  {/* 4 Real Telemetry Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-[#060B14] border border-[#34D399]/40">
                      <div className="font-mono-hud text-[11px] text-[#34D399] font-bold">
                        {lang === "es"
                          ? "MARCADOR GLOBAL REAL"
                          : "REAL OVERALL SCORE"}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        4 - 2{" "}
                        <span className="text-sm text-[#34D399]">SUPERKIT</span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#8FA3B8] mt-1">
                        {lang === "es"
                          ? "Kit gana R1, R2, R5, R6 · Raw gana R3, R4"
                          : "Kit wins C1, C2, C5, C6 · Raw wins C3, C4"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#060B14] border border-[#22A2DD]/40">
                      <div className="font-mono-hud text-[11px] text-[#5EEAD4] font-bold">
                        {lang === "es"
                          ? "RELOJ ACUMULADO (6 RETOS)"
                          : "TOTAL CLOCK (6 TESTS)"}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        276m <span className="text-sm text-[#8FA3B8]">vs 302m</span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#34D399] mt-1">
                        {lang === "es"
                          ? "-26 minutos totales a favor del Kit"
                          : "-26 total minutes saved with Kit"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#060B14] border border-[#FBBF24]/40">
                      <div className="font-mono-hud text-[11px] text-[#FBBF24] font-bold">
                        {lang === "es"
                          ? "FACTURA API Y TOKENS"
                          : "API BILL & TOKENS"}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        $10.85{" "}
                        <span className="text-sm text-[#8FA3B8]">vs $7.69</span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#FBBF24] mt-1">
                        3.52M tok (80p) vs 2.65M tok (53p)
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#060B14] border border-[#B794F6]/40">
                      <div className="font-mono-hud text-[11px] text-[#B794F6] font-bold">
                        {lang === "es"
                          ? "VOLUMEN DE CODIGO REAL"
                          : "REAL CODE VOLUME"}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        7,937{" "}
                        <span className="text-sm text-[#8FA3B8]">vs 6,996 loc</span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#5EEAD4] mt-1">
                        325.4 KB (Kit) vs 279.1 KB (Sin Kit)
                      </div>
                    </div>
                  </div>
                </div>

                {/* EP03 Verified Comparative Matrix Table */}
                <div className="rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 overflow-hidden shadow-xl">
                  <div className="p-5 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-mono-hud text-xs font-bold text-[#34D399] uppercase">
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

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#060B14] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                          <th className="py-3.5 px-4">#</th>
                          <th className="py-3.5 px-4">
                            {lang === "es"
                              ? "Reto y Skill Evaluado"
                              : "Challenge & Evaluated Skill"}
                          </th>
                          <th className="py-3.5 px-4 text-[#FBBF24]">
                            IA Sin Kit (Reloj / Loc / FPS)
                          </th>
                          <th className="py-3.5 px-4 text-[#FBBF24]">
                            Sin Kit Tokens / USD
                          </th>
                          <th className="py-3.5 px-4 text-[#34D399]">
                            Superpowers Kit (Reloj / Loc / FPS)
                          </th>
                          <th className="py-3.5 px-4 text-[#34D399]">
                            Superkit Tokens / USD
                          </th>
                          <th className="py-3.5 px-4">
                            {lang === "es" ? "Ganador" : "Winner"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                        {EP03_CHALLENGES.map((ch) => (
                          <tr
                            key={ch.n}
                            onClick={() => setEp03ChallengeN(ch.n)}
                            className={`hover:bg-[#11283F]/70 transition cursor-pointer ${
                              ep03ChallengeN === ch.n ? "bg-[#11283F]/40" : ""
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono-hud font-bold text-[#5EEAD4]">
                              0{ch.n}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white">
                                {lang === "es" ? ch.name_es : ch.name_en}
                              </div>
                              <div className="text-xs text-[#34D399] font-mono-hud">
                                {ch.skill}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono-hud">
                              <span className="text-[#FBBF24] font-bold">
                                {ch.vanilla_min} min
                              </span>{" "}
                              <span className="text-xs text-[#8FA3B8]">
                                · {ch.vanilla_fps}
                              </span>
                              <span className="text-xs text-[#8FA3B8] block">
                                {ch.vanilla_lines} loc · {ch.vanilla_kb} KB
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono-hud">
                              <span className="text-[#FBBF24] font-bold">
                                ${ch.vanilla_usd.toFixed(2)} USD
                              </span>
                              <span className="text-xs text-[#8FA3B8] block">
                                {ch.vanilla_tok} tok ({ch.vanilla_steps}p)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono-hud">
                              <span className="text-[#34D399] font-bold">
                                {ch.superkit_min} min
                              </span>{" "}
                              <span className="text-xs text-[#5EEAD4]">
                                · {ch.superkit_fps}
                              </span>
                              <span className="text-xs text-[#8FA3B8] block">
                                {ch.superkit_lines} loc · {ch.superkit_kb} KB
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono-hud">
                              <span className="text-[#34D399] font-bold">
                                ${ch.superkit_usd.toFixed(2)} USD
                              </span>
                              <span className="text-xs text-[#8FA3B8] block">
                                {ch.superkit_tok} tok ({ch.superkit_steps}p)
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {ch.winner === "superkit" ? (
                                <span className="px-2.5 py-1 rounded bg-[#34D399]/15 border border-[#34D399]/40 font-mono-hud text-[11px] font-bold text-[#34D399]">
                                  SUPERKIT
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded bg-[#FBBF24]/15 border border-[#FBBF24]/40 font-mono-hud text-[11px] font-bold text-[#FBBF24]">
                                  IA SIN KIT
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#060B14] border-t-2 border-[#34D399]/40 font-mono-hud text-xs font-bold">
                          <td className="py-4 px-4 text-[#5EEAD4]">TOTAL</td>
                          <td className="py-4 px-4 text-white">
                            6 Retos Extremos (12 Corridas Reales agy CLI)
                          </td>
                          <td className="py-4 px-4 text-[#FBBF24]">
                            302 min · 6,996 loc (279.1 KB)
                          </td>
                          <td className="py-4 px-4 text-[#FBBF24]">
                            $7.69 USD · 2.65M tok (53p)
                          </td>
                          <td className="py-4 px-4 text-[#34D399]">
                            276 min · 7,937 loc (325.4 KB)
                          </td>
                          <td className="py-4 px-4 text-[#34D399]">
                            $10.85 USD · 3.52M tok (80p)
                          </td>
                          <td className="py-4 px-4 text-[#34D399]">
                            SUPERKIT 4 - 2
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* EP03 Interactive 12-Demo Comparator */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {EP03_CHALLENGES.map((ch) => {
                      const active = ep03ChallengeN === ch.n;
                      return (
                        <button
                          key={ch.n}
                          onClick={() => setEp03ChallengeN(ch.n)}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            active
                              ? "bg-[#11283F] border-[#34D399] shadow-[0_0_20px_rgba(52,211,153,0.22)]"
                              : "bg-[#0B1D30]/80 border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono-hud text-[10px]">
                            <span className="text-[#5EEAD4] font-bold">
                              R0{ch.n}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold ${
                                ch.winner === "superkit"
                                  ? "bg-[#34D399]/20 text-[#34D399]"
                                  : "bg-[#FBBF24]/20 text-[#FBBF24]"
                              }`}
                            >
                              {ch.winner === "superkit" ? "KIT WIN" : "RAW WIN"}
                            </span>
                          </div>
                          <div className="font-display text-xs font-bold text-white mt-1 truncate">
                            {lang === "es" ? ch.name_es : ch.name_en}
                          </div>
                          <div className="font-mono-hud text-[10px] text-[#8FA3B8] mt-1">
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
                    return (
                      <div className="rounded-2xl bg-[#060B14] border-2 border-[#34D399]/50 overflow-hidden shadow-2xl">
                        <div className="p-4 sm:p-5 bg-[#11283F] border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                              <span className="px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-bold">
                                {cur.skill}
                              </span>
                              <span className="text-[#FBBF24]">
                                Sin Kit: {cur.vanilla_min}m · $
                                {cur.vanilla_usd.toFixed(2)} ({cur.vanilla_tok}{" "}
                                tok)
                              </span>
                              <span className="text-[#5EEAD4]">
                                Superkit: {cur.superkit_min}m · $
                                {cur.superkit_usd.toFixed(2)} ({cur.superkit_tok}{" "}
                                tok)
                              </span>
                            </div>
                            <h3 className="font-display text-lg sm:text-xl font-black text-white">
                              0{cur.n}.{" "}
                              {lang === "es" ? cur.name_es : cur.name_en}
                            </h3>
                            <p className="text-xs text-[#8FA3B8] max-w-3xl">
                              {lang === "es" ? cur.verdict_es : cur.verdict_en}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <div className="inline-flex flex-wrap rounded-lg bg-[#060B14] p-0.5 border border-white/15 font-mono-hud text-xs">
                              <button
                                onClick={() => setEp03Mode("split")}
                                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                                  ep03Mode === "split"
                                    ? "bg-[#34D399] text-[#060B14]"
                                    : "text-[#8FA3B8] hover:text-white"
                                }`}
                              >
                                {lang === "es" ? "Lado a Lado" : "Side by Side"}
                              </button>
                              <button
                                onClick={() => setEp03Mode("superkit")}
                                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                                  ep03Mode === "superkit"
                                    ? "bg-[#5EEAD4] text-[#060B14]"
                                    : "text-[#8FA3B8] hover:text-white"
                                }`}
                              >
                                Superkit
                              </button>
                              <button
                                onClick={() => setEp03Mode("vanilla")}
                                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                                  ep03Mode === "vanilla"
                                    ? "bg-[#FBBF24] text-[#060B14]"
                                    : "text-[#8FA3B8] hover:text-white"
                                }`}
                              >
                                {lang === "es" ? "IA Sin Kit" : "Raw AI"}
                              </button>
                              <button
                                onClick={() => setEp03Mode("still")}
                                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                                  ep03Mode === "still"
                                    ? "bg-[#B794F6] text-[#060B14]"
                                    : "text-[#8FA3B8] hover:text-white"
                                }`}
                              >
                                {lang === "es" ? "Captura VS" : "VS Still"}
                              </button>
                              <button
                                onClick={() => setEp03Mode("prompt")}
                                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                                  ep03Mode === "prompt"
                                    ? "bg-[#22A2DD] text-[#060B14]"
                                    : "text-[#8FA3B8] hover:text-white"
                                }`}
                              >
                                Prompt
                              </button>
                            </div>
                          </div>
                        </div>

                        {ep03Mode === "split" && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                            <div className="flex flex-col">
                              <div className="px-3 py-2 bg-[#0B1D30] border-b border-white/10 flex items-center justify-between font-mono-hud text-xs">
                                <span className="text-[#FBBF24] font-bold">
                                  IZQUIERDA · GEMINI 4 ARGON HIGH SIN KIT —{" "}
                                  {cur.vanilla_fps}
                                </span>
                                <div className="flex items-center gap-3">
                                  <a
                                    href={`/api/source?model=ia-sin-kit&dir=${cur.dir}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#8FA3B8] hover:text-white underline"
                                  >
                                    JSON Source ({cur.vanilla_lines} loc)
                                  </a>
                                  <a
                                    href={vanillaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FBBF24] hover:underline"
                                  >
                                    Pantalla Completa ↗
                                  </a>
                                </div>
                              </div>
                              <iframe
                                src={vanillaUrl}
                                title={`Raw AI ${cur.dir}`}
                                className="w-full h-[540px] border-0 bg-[#04060A]"
                              />
                            </div>
                            <div className="flex flex-col">
                              <div className="px-3 py-2 bg-[#0B1D30] border-b border-white/10 flex items-center justify-between font-mono-hud text-xs">
                                <span className="text-[#34D399] font-bold">
                                  DERECHA · IA + MIXIUH SUPERPOWERS KIT —{" "}
                                  {cur.superkit_fps}
                                </span>
                                <div className="flex items-center gap-3">
                                  <a
                                    href={`/api/source?model=ia-superpowers-kit&dir=${cur.dir}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5EEAD4] hover:text-white underline"
                                  >
                                    JSON Source ({cur.superkit_lines} loc)
                                  </a>
                                  <a
                                    href={superkitUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#34D399] hover:underline"
                                  >
                                    Pantalla Completa ↗
                                  </a>
                                </div>
                              </div>
                              <iframe
                                src={superkitUrl}
                                title={`Superkit ${cur.dir}`}
                                className="w-full h-[540px] border-0 bg-[#04060A]"
                              />
                            </div>
                          </div>
                        )}

                        {(ep03Mode === "superkit" ||
                          ep03Mode === "vanilla") && (
                          <iframe
                            src={
                              ep03Mode === "superkit" ? superkitUrl : vanillaUrl
                            }
                            title={`EP03 ${ep03Mode} ${cur.dir}`}
                            className="w-full h-[640px] border-0 bg-[#04060A]"
                          />
                        )}

                        {ep03Mode === "still" && (
                          <div className="p-6 bg-[#04060A] flex flex-col items-center">
                            <img
                              src={cur.vs_still}
                              alt={cur.name_es}
                              className="max-h-[580px] w-auto rounded-xl border border-white/15"
                            />
                          </div>
                        )}

                        {ep03Mode === "prompt" && (
                          <div className="p-6 bg-[#060B14] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono-hud text-xs font-bold text-[#5EEAD4]">
                                PROMPT IDENTICO ENVIADO A AMBAS INSTANCIAS DE
                                AGY CLI
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    cur.prompt_verbatim
                                  );
                                  setCopiedEp03Prompt(true);
                                  setTimeout(
                                    () => setCopiedEp03Prompt(false),
                                    2000
                                  );
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#22A2DD] text-[#060B14] font-mono-hud text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                {copiedEp03Prompt ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {copiedEp03Prompt
                                    ? "Copiado"
                                    : "Copiar Prompt"}
                                </span>
                              </button>
                            </div>
                            <pre className="p-4 rounded-xl bg-[#0B1D30] border border-white/10 text-xs sm:text-sm text-[#F5F7FA] whitespace-pre-wrap font-mono-hud leading-relaxed">
                              {cur.prompt_verbatim}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* EP03 Honesty Notes */}
                <div className="rounded-2xl bg-[#0B1D30] border border-[#34D399]/30 p-6">
                  <div className="flex items-center gap-2 font-mono-hud text-xs text-[#34D399] font-bold uppercase mb-3">
                    <ShieldCheck className="w-4 h-4" />
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
                        className="p-3.5 rounded-xl bg-[#060B14] border border-white/10 text-xs text-[#F5F7FA]/90 leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="font-mono-hud text-[#34D399] font-bold shrink-0">
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B794F6]/15 border border-[#B794F6]/40 text-[#B794F6] font-mono-hud text-xs font-bold">
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
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border border-[#22A2DD]/30 shadow-2xl">
                        <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-white/10">
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

                          <div className="text-center">
                            <div className="inline-block px-3 py-1 rounded-full bg-[#060B14] border border-white/15 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                              MARCADOR 4 - 2
                            </div>
                            <div className="font-mono-hud text-xs text-[#34D399] font-bold mt-1.5">
                              -69 MIN · -$10.00 USD
                            </div>
                          </div>

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
                      </div>
                    ) : (
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1D30] via-[#11283F] to-[#0B1D30] border border-[#22A2DD]/30 shadow-2xl">
                        <div className="grid grid-cols-3 items-center gap-3 pb-5 border-b border-white/10">
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

                          <div className="text-center">
                            <div className="inline-block px-3 py-1 rounded-full bg-[#060B14] border border-white/15 font-mono-hud text-xs font-bold text-[#5EEAD4]">
                              MARCADOR 10 - 0
                            </div>
                            <div className="font-mono-hud text-xs text-[#34D399] font-bold mt-1.5">
                              -39 MIN (-41.5%)
                            </div>
                          </div>

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
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() =>
                          handleJumpToArena(isEp02 ? "ep02" : "ep01", 1)
                        }
                        className="px-5 py-3 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>
                          {isEp02
                            ? "Abrir los 12 Motores EP02 en la Arena"
                            : "Abrir las 20 Simulaciones EP01 en la Arena"}
                        </span>
                      </button>

                      <a
                        href={
                          isEp02 ? YOUTUBE_LINKS.ep02_es : YOUTUBE_LINKS.ep01_es
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl bg-[#F43F5E] text-white font-mono-hud text-xs sm:text-sm font-bold hover:brightness-110 transition inline-flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Ver en YouTube (4K60)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Right Video Preview */}
                  <div className="lg:col-span-5 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 overflow-hidden shadow-2xl">
                    <div className="p-3 bg-[#11283F] border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveVideoClip("hook")}
                          className={`px-3 py-1 rounded-lg font-mono-hud text-xs font-bold cursor-pointer ${
                            activeVideoClip === "hook"
                              ? "bg-[#22A2DD] text-[#060B14]"
                              : "bg-[#060B14] text-[#8FA3B8]"
                          }`}
                        >
                          1. Hook Oficial
                        </button>
                        <button
                          onClick={() => setActiveVideoClip("boss")}
                          className={`px-3 py-1 rounded-lg font-mono-hud text-xs font-bold cursor-pointer ${
                            activeVideoClip === "boss"
                              ? "bg-[#F43F5E] text-white"
                              : "bg-[#060B14] text-[#8FA3B8]"
                          }`}
                        >
                          2. Nivel Jefe
                        </button>
                      </div>
                      <span className="font-mono-hud text-xs text-[#5EEAD4]">
                        {isEp02 ? "EP02 · 4K60" : "EP01 · 4K60"}
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
                      </video>
                    </div>
                  </div>
                </div>

                {/* Comparative Matrix Table for EP02 or EP01 */}
                <div className="rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/25 overflow-hidden shadow-xl">
                  <div className="p-5 bg-[#11283F] border-b border-white/10">
                    <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                      {isEp02
                        ? "Matriz Comparativa EP02: Tiempo, FPS, Tokens y Costo en USD"
                        : "Matriz Comparativa EP01: 10 Retos Zero-Shot"}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    {isEp02 ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#060B14] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                            <th className="py-3.5 px-4">#</th>
                            <th className="py-3.5 px-4">Reto y Stack</th>
                            <th className="py-3.5 px-4 text-[#FBBF24]">
                              Claude Opus 5.5
                            </th>
                            <th className="py-3.5 px-4 text-[#FBBF24]">
                              Opus Tokens / USD
                            </th>
                            <th className="py-3.5 px-4 text-[#B794F6]">
                              Gemini 4 Argon
                            </th>
                            <th className="py-3.5 px-4 text-[#B794F6]">
                              Argon Tokens / USD
                            </th>
                            <th className="py-3.5 px-4">Ganador</th>
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
                                0{ch.n}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-white">
                                  {lang === "es" ? ch.name_es : ch.name_en}
                                </div>
                                <div className="text-xs text-[#8FA3B8]">
                                  {ch.tech}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#FBBF24]">
                                {ch.time_min.opus} min · {ch.fps.opus}
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#FBBF24]">
                                ${ch.cost_usd.opus.toFixed(2)} USD (
                                {ch.tokens.opus_total})
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#B794F6]">
                                {ch.time_min.argon} min · {ch.fps.argon}
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#34D399]">
                                ${ch.cost_usd.argon.toFixed(2)} USD (
                                {ch.tokens.argon_total})
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud font-bold">
                                {ch.winner === "argon" ? (
                                  <span className="text-[#34D399]">ARGON</span>
                                ) : (
                                  <span className="text-[#FBBF24]">
                                    OPUS 5.5
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#060B14] border-b border-white/10 font-mono-hud text-[11px] uppercase text-[#8FA3B8]">
                            <th className="py-3.5 px-4">#</th>
                            <th className="py-3.5 px-4">Reto</th>
                            <th className="py-3.5 px-4 text-[#FBBF24]">
                              Gemini 3.8 Flash
                            </th>
                            <th className="py-3.5 px-4 text-[#B794F6]">
                              Gemini 4 Argon
                            </th>
                            <th className="py-3.5 px-4">Relacion</th>
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
                              <td className="py-3.5 px-4 font-bold text-white">
                                {lang === "es" ? ch.name_es : ch.name_en}
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#FBBF24]">
                                {ch.time_min.flash} min (
                                {ch.code_stats.flash_lines} loc)
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#B794F6]">
                                {ch.time_min.argon} min (
                                {ch.code_stats.argon_lines} loc)
                              </td>
                              <td className="py-3.5 px-4 font-mono-hud text-[#34D399]">
                                {ch.speed_ratio}
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
        </main>
      )}

      {/* =====================================================================
          VIEW 3: DEL COMENTARIO AL CODIGO #01 (OVERFIT 3D) & SUPERPOWERS KIT
         ===================================================================== */}
      {mainView === "comunidad" && released.cc01 && (
        <main id="comentario-al-codigo" className="flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="rounded-2xl bg-[#0B1D30] border border-[#FBBF24]/40 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/50 font-mono-hud text-xs font-bold text-[#FBBF24]">
                  {lang === "es"
                    ? "SERIE DEL COMENTARIO AL CODIGO #01 · RETO DE @TENITO03"
                    : "FROM COMMENT TO CODE SERIES #01 · @TENITO03 CHALLENGE"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/overfit/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#FBBF24] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {lang === "es"
                        ? "Abrir OVERFIT Studio 3D en Pantalla Completa"
                        : "Open OVERFIT Studio 3D Full Screen"}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/api/source?model=comunidad&dir=cc01-overfit-studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#060B14] border border-[#22A2DD]/40 text-[#5EEAD4] font-mono-hud text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>JSON Source</span>
                  </a>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                {lang === "es"
                  ? "De un Comentario a una Marca de Ropa IA en 3D: OVERFIT Studio 3D (Coleccion Guerra de Pesos)"
                  : "From a Comment to a 3D AI Streetwear Brand: OVERFIT Studio 3D (Weight War Collection)"}
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-5 rounded-xl bg-[#060B14] border border-[#22A2DD]/30 p-4 flex flex-col justify-between gap-3">
                  <div className="font-mono-hud text-xs font-bold text-[#5EEAD4]">
                    1. EL COMENTARIO ORIGINAL DE @TENITO03 EN INSTAGRAM
                  </div>
                  <div className="rounded-lg overflow-hidden bg-white p-2">
                    <img
                      src="/brand/thumbs/tenito_comment.png"
                      alt="Comentario de @tenito03"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <img
                    src="/brand/thumbs/cc01_thumb_A.jpg"
                    alt="Miniatura A OVERFIT"
                    className="w-full aspect-video object-cover rounded-xl border border-white/15"
                  />
                  <img
                    src="/brand/thumbs/cc01_thumb_B.jpg"
                    alt="Miniatura B OVERFIT"
                    className="w-full aspect-video object-cover rounded-xl border border-white/15"
                  />
                  <img
                    src="/brand/thumbs/cc01_thumb_C.jpg"
                    alt="Miniatura C OVERFIT"
                    className="w-full aspect-video object-cover rounded-xl border border-white/15"
                  />
                </div>
              </div>

              {/* Embedded Live OVERFIT Studio 3D */}
              <div className="rounded-2xl bg-[#060B14] border-2 border-[#FBBF24]/50 overflow-hidden shadow-2xl">
                <div className="px-4 py-3 bg-[#11283F] border-b border-white/10 flex items-center justify-between">
                  <span className="font-mono-hud text-xs font-bold text-white">
                    OVERFIT STUDIO 3D EN VIVO · GIRA 360°, HAZ ZOOM MACRO HD O
                    PRUEBA LOS 10 ESTAMPADOS
                  </span>
                  <a
                    href="/overfit/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-hud text-xs font-bold text-[#FBBF24] hover:underline"
                  >
                    Pantalla Completa ↗
                  </a>
                </div>
                <iframe
                  src="/overfit/index.html"
                  title="OVERFIT Studio 3D"
                  className="w-full h-[820px] border-0 bg-[#04060A]"
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 4: ARENA INTERACTIVA (STRICTLY RELEASED DEMOS ONLY)
         ===================================================================== */}
      {mainView === "arena" && (
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="p-3 rounded-2xl bg-[#0B1D30] border border-[#B794F6]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono-hud text-xs font-bold text-[#B794F6]">
                {lang === "es"
                  ? `MODO DE ARENA INTERACTIVA (${totalDemosCount} DEMOS PUBLICADAS):`
                  : `INTERACTIVE ARENA MODE (${totalDemosCount} PUBLISHED DEMOS):`}
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                {released.ep03 && (
                  <button
                    onClick={() => setArenaMode("ep03")}
                    className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer ${
                      arenaMode === "ep03"
                        ? "bg-[#34D399] text-[#060B14]"
                        : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                    }`}
                  >
                    EP03: Sin Kit vs Superpowers Kit (12)
                  </button>
                )}
                <button
                  onClick={() => {
                    setArenaMode("ep02_ep01");
                    handleEpisodeChange("ep02");
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer ${
                    (!released.ep03 || arenaMode === "ep02_ep01") &&
                    activeEpisode === "ep02"
                      ? "bg-[#B794F6] text-[#060B14]"
                      : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                  }`}
                >
                  EP02: Argon vs Opus 5.5 (12)
                </button>
                <button
                  onClick={() => {
                    setArenaMode("ep02_ep01");
                    handleEpisodeChange("ep01");
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer ${
                    (!released.ep03 || arenaMode === "ep02_ep01") &&
                    activeEpisode === "ep01"
                      ? "bg-[#22A2DD] text-[#060B14]"
                      : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                  }`}
                >
                  EP01: Argon vs 3.8 Flash (20 + Bonus)
                </button>
                {released.cc01 && (
                  <button
                    onClick={() => navigateToView("comunidad")}
                    className="px-3.5 py-2 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] font-bold cursor-pointer"
                  >
                    OVERFIT Studio 3D (1)
                  </button>
                )}
              </div>
            </div>
          </div>

          {released.ep03 && arenaMode === "ep03" ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {EP03_CHALLENGES.map((ch) => (
                  <button
                    key={ch.n}
                    onClick={() => setEp03ChallengeN(ch.n)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      ep03ChallengeN === ch.n
                        ? "bg-[#11283F] border-[#34D399]"
                        : "bg-[#0B1D30] border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-hud text-[10px]">
                      <span className="text-[#5EEAD4] font-bold">R0{ch.n}</span>
                      <span
                        className={
                          ch.winner === "superkit"
                            ? "text-[#34D399] font-bold"
                            : "text-[#FBBF24] font-bold"
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
                return (
                  <div className="rounded-2xl bg-[#060B14] border-2 border-[#34D399]/50 overflow-hidden shadow-2xl">
                    <div className="p-4 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-black text-white">
                          EP03 Reto 0{cur.n}:{" "}
                          {lang === "es" ? cur.name_es : cur.name_en}
                        </h3>
                        <p className="text-xs text-[#8FA3B8]">
                          {lang === "es" ? cur.verdict_es : cur.verdict_en}
                        </p>
                      </div>
                      <button
                        onClick={() => navigateToView("dossiers", "ep03")}
                        className="px-3.5 py-1.5 rounded-lg bg-[#34D399] text-[#060B14] font-mono-hud text-xs font-bold cursor-pointer"
                      >
                        Ver Dossier Completo EP03
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                      <iframe
                        src={vanillaUrl}
                        title={`Raw ${cur.dir}`}
                        className="w-full h-[560px] border-0 bg-[#04060A]"
                      />
                      <iframe
                        src={superkitUrl}
                        title={`Superkit ${cur.dir}`}
                        className="w-full h-[560px] border-0 bg-[#04060A]"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <DemoArenaSection
              lang={lang}
              activeEpisode={activeEpisode}
              onChangeEpisode={handleEpisodeChange}
              selectedChallengeN={selectedChallengeN}
              onSelectChallengeN={setSelectedChallengeN}
            />
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW 5: FORO TECNICO, AUTOPSIAS & GLOSARIO (53 TERMINOS)
         ===================================================================== */}
      {mainView === "foro" && (
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="p-2.5 rounded-2xl bg-[#0B1D30] border border-[#22A2DD]/30 inline-flex items-center gap-2 font-mono-hud text-xs">
              <button
                onClick={() => setForoSubTab("hilos")}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
                  foroSubTab === "hilos"
                    ? "bg-[#22A2DD] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                {lang === "es"
                  ? `1. Foro Tecnico, Autopsias y Prompts (${totalForumThreadsCount} Hilos)`
                  : `1. Technical Forum, Autopsies & Prompts (${totalForumThreadsCount} Threads)`}
              </button>
              <button
                onClick={() => setForoSubTab("glosario")}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
                  foroSubTab === "glosario"
                    ? "bg-[#34D399] text-[#060B14]"
                    : "text-[#8FA3B8] hover:text-white"
                }`}
              >
                {lang === "es"
                  ? "2. Glosario Tecnico (53 Conceptos) & Ecosistema"
                  : "2. Technical Glossary (53 Concepts) & Ecosystem"}
              </button>
            </div>
          </div>

          {foroSubTab === "hilos" ? (
            <ForumSection
              lang={lang}
              onJumpToArena={handleJumpToArena}
              released={released}
            />
          ) : (
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono-hud uppercase text-[#5EEAD4] font-bold mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span>
                          GLOSARIO TECNICO MIXIUH LABS ({LAB_GLOSSARY.length}{" "}
                          CONCEPTOS)
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                        {lang === "es"
                          ? "Diccionario de Ingenieria en Lenguaje Claro"
                          : "Plain-Language Engineering Dictionary"}
                      </h2>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-[#8FA3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={glossarySearch}
                        onChange={(e) => setGlossarySearch(e.target.value)}
                        placeholder="Buscar Verlet, CCD, FBO, DDA..."
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
          )}
        </main>
      )}

      {/* FOOTER */}
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
            <button
              onClick={() => navigateToView("blog")}
              className="hover:text-white cursor-pointer"
            >
              Inicio / Blog
            </button>
            {released.ep03 && (
              <button
                onClick={() => navigateToView("dossiers", "ep03")}
                className="text-[#34D399] hover:text-white font-bold cursor-pointer"
              >
                EP03 Superpowers Kit
              </button>
            )}
            {released.cc01 && (
              <button
                onClick={() => navigateToView("comunidad")}
                className="text-[#FBBF24] hover:text-white font-bold cursor-pointer"
              >
                OVERFIT 3D
              </button>
            )}
            <button
              onClick={() => navigateToView("dossiers", "ep02")}
              className="text-[#B794F6] hover:text-white font-bold cursor-pointer"
            >
              EP02 Argon vs Opus
            </button>
            <button
              onClick={() => navigateToView("dossiers", "ep01")}
              className="text-[#5EEAD4] hover:text-white font-bold cursor-pointer"
            >
              EP01 Argon vs Flash
            </button>
            <a
              href="https://mixiuh.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Mixiuh
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
