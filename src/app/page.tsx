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
import {
  EP04_BENCHMARK_TOTALS,
  EP04_CHALLENGES,
} from "@/data/ep04Data";
import DemoArenaSection from "@/components/DemoArenaModal";
import ForumSection from "@/components/ForumSection";
import NewsSection from "@/components/NewsSection";
import PixelUiShowcase from "@/components/PixelUiShowcase";
import {
  Pixel3DCRTWorkstation,
  PixelCalendar,
  PixelCollapse,
  PixelCreditBadge,
  PixelDonutGauge,
  PixelFloppyCard,
  PixelIcon,
  PixelMultiLineChart,
  PixelProceduralAmbientBg,
  PixelScrollMaterializer,
  PixelSocialBar,
  PixelSprite,
  ALL_PIXEL_ICON_NAMES,
  PIXEL_CURSOR_PRESETS,
  usePixelCursor,
  usePixelSound,
  type AmbientSimulationMode,
  type PocketConsoleCartridgeItem,
} from "@/lib/mixiuh-pixel-ui";
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
  Radio,
} from "lucide-react";

type MainView =
  | "blog"
  | "dossiers"
  | "comunidad"
  | "noticias"
  | "arena"
  | "pixelui"
  | "foro";
type DossierEpisode = "ep04" | "ep03" | "ep02" | "ep01";
type BlogFilter = "all" | "laboratorios" | "comunidad" | "noticias";

export default function MixiuhLabsHomePage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const { enabled: sfxEnabled, play: playSfx, toggle: toggleSfx } =
    usePixelSound();
  const { cursorStyle, setCursorStyle } = usePixelCursor("cyber-arrow");
  const [ambientMode, setAmbientMode] =
    useState<AmbientSimulationMode>("ai-ecosystem");

  const cycleCursorStyle = () => {
    const idx = PIXEL_CURSOR_PRESETS.findIndex((p) => p.id === cursorStyle);
    const next =
      PIXEL_CURSOR_PRESETS[(idx + 1) % PIXEL_CURSOR_PRESETS.length].id;
    setCursorStyle(next);
  };

  const cycleAmbientMode = () => {
    playSfx("click");
    const modes: AmbientSimulationMode[] = [
      "ai-ecosystem",
      "neural-packets",
      "voxel-rain",
      "off",
    ];
    const next = modes[(modes.indexOf(ambientMode) + 1) % modes.length];
    setAmbientMode(next);
  };
  const [released, setReleased] = useState<ReleasedState>(() =>
    getReleasedStatus()
  );
  const [mainView, setMainView] = useState<MainView>("blog");
  const [blogFilter, setBlogFilter] = useState<BlogFilter>("all");
  const [dossierEp, setDossierEp] = useState<DossierEpisode>(() => {
    const r = getReleasedStatus();
    if (r.ep04) return "ep04";
    if (r.ep03) return "ep03";
    return "ep02";
  });

  // Arena & Episode state
  const [activeEpisode, setActiveEpisode] = useState<"ep02" | "ep01">("ep02");
  const [selectedChallengeN, setSelectedChallengeN] = useState<number>(1);
  const [arenaMode, setArenaMode] = useState<"ep04" | "ep03" | "ep02_ep01">(
    () => {
      const r = getReleasedStatus();
      if (r.ep04) return "ep04";
      if (r.ep03) return "ep03";
      return "ep02_ep01";
    }
  );

  // EP03 interactive comparator state
  const [ep03ChallengeN, setEp03ChallengeN] = useState<number>(2);
  const [ep03Mode, setEp03Mode] = useState<
    "split" | "superkit" | "vanilla" | "still" | "prompt"
  >("split");
  const [copiedEp03Prompt, setCopiedEp03Prompt] = useState(false);

  // EP04 interactive 3-way comparator state
  const [ep04ChallengeN, setEp04ChallengeN] = useState<number>(4);
  const [ep04Mode, setEp04Mode] = useState<
    "triple" | "haiku" | "sonnet" | "opus" | "prompt"
  >("triple");
  const [copiedEp04Prompt, setCopiedEp04Prompt] = useState(false);

  // CC02 Roblox 3D 3-Giants interactive comparator state
  const [cc02Model, setCc02Model] = useState<
    "astra" | "argon" | "opus" | "opus_fixed" | "triple" | "prompt"
  >("astra");
  const [comunidadEp, setComunidadEp] = useState<"all" | "cc02" | "cc01">(
    "all"
  );
  const [copiedCc02Prompt, setCopiedCc02Prompt] = useState(false);

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

    if (!rel.ep04 && !rel.ep03) {
      setDossierEp((prev) =>
        prev === "ep04" || prev === "ep03" ? "ep02" : prev
      );
      setArenaMode("ep02_ep01");
    } else if (!rel.ep04 && rel.ep03) {
      setDossierEp((prev) => (prev === "ep04" ? "ep03" : prev));
    }

    const applyHash = () => {
      const h = window.location.hash.replace("#", "");
      if (!h || h === "top") return;
      if (
        (h === "noticias" ||
          h === "radar-mixiuh" ||
          h === "gemini-4-carbon") &&
        rel.carbon01
      ) {
        setMainView("noticias");
      } else if (h === "ep04-escalera-claude" && rel.ep04) {
        setMainView("dossiers");
        setDossierEp("ep04");
      } else if (h === "ep03-superpowers-kit" && rel.ep03) {
        setMainView("dossiers");
        setDossierEp("ep03");
      } else if (h === "comentario-al-codigo" && rel.cc01) {
        setMainView("comunidad");
      } else if (h === "dossier" || h === "matriz" || h === "laboratorios") {
        setMainView("dossiers");
      } else if (h === "arena") {
        setMainView("arena");
      } else if (h === "pixel-ui" || h === "pixelui" || h === "ui-kit") {
        setMainView("pixelui");
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
    playSfx("click");
    if (view === "comunidad" && !released.cc01 && !released.ep03) {
      setMainView("blog");
      return;
    }
    if (view === "noticias" && !released.carbon01) {
      setMainView("blog");
      return;
    }
    setMainView(view);
    if (subEp) {
      const safeEp =
        subEp === "ep04" && !released.ep04
          ? released.ep03
            ? "ep03"
            : "ep02"
          : subEp === "ep03" && !released.ep03
          ? "ep02"
          : subEp;
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
    episode: "ep04" | "ep03" | "ep02" | "ep01",
    challengeN: number
  ) => {
    if (episode === "ep04" && released.ep04) {
      setEp04ChallengeN(challengeN);
      setArenaMode("ep04");
      setMainView("arena");
    } else if (episode === "ep03" && released.ep03) {
      setEp03ChallengeN(challengeN);
      setArenaMode("ep03");
      setMainView("arena");
    } else {
      const safeEp =
        episode === "ep04" || episode === "ep03" ? "ep02" : episode;
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

  // Blog Cards Data (All 7 Productions across the 3 Editorial Pillars, gated by releaseSchedule.ts)
  const BLOG_ARTICLES = [
    {
      id: "cc02" as ReleaseKey,
      filter: "comunidad" as const,
      date: "31 Oct 2026",
      readTime: "Video 4K60 · 3 Motores Roblox 3D",
      badge_es: "DEL COMENTARIO AL CODIGO #02 · RETO ROBLOX 3D",
      badge_en: "FROM COMMENT TO CODE #02 · 3D ROBLOX CHALLENGE",
      accentColor: "#34D399",
      scoreBadge_es: "ASTRA 2 · ARGON 1 · OPUS 0",
      scoreBadge_en: "ASTRA 2 · ARGON 1 · OPUS 0",
      thumb: "/brand/thumbs/cc02_thumb_A.png",
      title_es:
        "Le Pedi un Juego Tipo ROBLOX 3D a Gemini 4 Argon High ($0.32) vs. Claude Opus 5.5 High ($9.91) vs. GPT-6 Astra High ($1.11)",
      title_en:
        "I Asked Gemini 4 Argon High ($0.32) vs. Claude Opus 5.5 High ($9.91) vs. GPT-6 Astra High ($1.11) to Build a 3D ROBLOX Game",
      excerpt_es:
        "Un suscriptor en Instagram nos reto a enfrentar a los 3 gigantes en modo HIGH creando un juego tipo ROBLOX 3D completo (circuito Obby de 10 etapas, 6 bots IA con chat y modo Roblox Studio 3D). GPT-6 Astra High termino primero en 18.9 min con 4,727 lineas a 61 FPS por $1.11 USD, Gemini 4 Argon High entrego el mejor modo Roblox Studio 3D con molde 3D en vivo por $0.32 USD, y Claude Opus 5.5 High tardo 55.1 min y $9.91 USD dejando la escena 3D en negro.",
      excerpt_en:
        "An Instagram subscriber challenged us to pit the 3 AI Giants in HIGH mode building a complete 3D ROBLOX game (10-stage Obby course, 6 AI bots with chat, and live 3D Roblox Studio mode). GPT-6 Astra High finished first in 18.9 min with 4,727 lines at 61 FPS for $1.11 USD, Gemini 4 Argon High built the best 3D Studio preview tool for $0.32 USD, and Claude Opus 5.5 High spent 55.1 min and $9.91 USD only to leave its 3D scene black.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "2 - 1 - 0 Astra" },
        { label_es: "GPT-6 ASTRA", label_en: "GPT-6 ASTRA", val: "18.9m · 4,727 Lín ($1.11)" },
        { label_es: "ARGON HIGH", label_en: "ARGON HIGH", val: "27.2m · 2,578 Lín ($0.32)" },
        { label_es: "OPUS 5.5 HIGH", label_en: "OPUS 5.5 HIGH", val: "55.1m · $9.91 (Sin 3D)" },
      ],
      onOpenDossier: () => navigateToView("comunidad"),
      onOpenArena: () => navigateToView("comunidad"),
    },
    {
      id: "carbon01" as ReleaseKey,
      filter: "noticias" as const,
      date: "29 Oct 2026",
      readTime: "04:19 Video · 8 Capitulos · 19 Evals",
      badge_es: "RADAR MIXIUH · NOTICIAS IA #01",
      badge_en: "MIXIUH NEWS · AI RADAR #01",
      accentColor: "#22D3EE",
      scoreBadge_es: "NUEVO #1 MUNDIAL",
      scoreBadge_en: "NEW #1 WORLDWIDE",
      thumb: "/brand/thumbs/carbon_thumb_A.jpg",
      title_es:
        "Google Anuncia Gemini 4 Carbon: El Nuevo #1 Mundial (14 Dias Despues de Argon) y el Salto a $4/$20 USD",
      title_en:
        "Google Unveils Gemini 4 Carbon: The New #1 Worldwide (14 Days After Argon) & the $4/$20 USD Price Jump",
      excerpt_es:
        "Analisis completo de las 19 evaluaciones oficiales de Google DeepMind: como Gemini 4 Carbon destrona a Claude Opus 5.5 en Terminal-Bench Hard (54.5% vs 53.0%) y programacion de largo horizonte, arrasa en ciberseguridad defensiva (84.0% en SecBench) y por que duplicar el precio de la API ($4/$20 USD) sigue costando un 20% menos que Opus ($5/$25).",
      excerpt_en:
        "Full breakdown of Google DeepMind's 19 official benchmarks: how Gemini 4 Carbon dethrones Claude Opus 5.5 on Terminal-Bench Hard (54.5% vs 53.0%) and long-horizon coding, sweeps defensive cybersecurity (84.0% on SecBench), and why doubling the API price ($4/$20 USD) still costs 20% less than Opus ($5/$25).",
      metrics: [
        { label_es: "TERMINAL HARD", label_en: "TERMINAL HARD", val: "54.5% (#1)" },
        { label_es: "SECBENCH PRO", label_en: "SECBENCH PRO", val: "84.0% (#1)" },
        { label_es: "CHARXIV-R", label_en: "CHARXIV-R", val: "91.0% (#1)" },
        { label_es: "PRECIO API", label_en: "API PRICE", val: "$4 / $20 USD" },
      ],
      onOpenDossier: () => navigateToView("noticias"),
      onOpenArena: () => navigateToView("noticias"),
    },
    {
      id: "ep04" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "28 Oct 2026",
      readTime: "08:15 Video · 18 Demos",
      badge_es: "LABORATORIO EP04 · ESCALERA CLAUDE 5.5",
      badge_en: "LAB EP04 · CLAUDE 5.5 LADDER",
      accentColor: "#38BDF8",
      scoreBadge_es: "OPUS 3 · SONNET 2 · HAIKU 1",
      scoreBadge_en: "OPUS 3 · SONNET 2 · HAIKU 1",
      thumb: "/brand/thumbs/ep04_thumb_A.jpg",
      title_es:
        "Claude Haiku 5.5 vs. Sonnet 5.5 vs. Opus 5.5: ¿En Que Nivel Conviene Gastar Tu Dinero? ($1.54 vs $12.22 vs $29.94)",
      title_en:
        "Claude Haiku 5.5 vs. Sonnet 5.5 vs. Opus 5.5: Which Tier Is Actually Worth Your Money? ($1.54 vs $12.22 vs $29.94)",
      excerpt_es:
        "Corrimos 18 pruebas aisladas en Claude Code CLI con los 3 niveles de Claude 5.5 en 6 retos extremos. Opus 5.5 gano los primeros 3 retos de fisica y shaders (3-0), pero Haiku 5.5 sorprendio construyendo el Estudio Acido 3D a 61 FPS por solo $0.21 USD (24x mas barato que Opus), y Sonnet 5.5 gano los ultimos 2 retos duplicando los FPS del Path Tracer (29 vs 15 FPS) y arrancando Pong en vivo en la consola CHIP-8.",
      excerpt_en:
        "We ran 18 isolated Claude Code CLI benchmarks across all 3 tiers of Claude 5.5 in 6 extreme challenges. Opus 5.5 swept the first 3 physics and shader rounds (3-0), but Haiku 5.5 stunned by building a 61 FPS 3D Acid Studio for $0.21 USD (24x cheaper than Opus), and Sonnet 5.5 won the final 2 challenges—doubling Path Tracer FPS (29 vs 15 FPS) and booting live Pong on the CHIP-8 console.",
      metrics: [
        { label_es: "MARCADOR", label_en: "SCORE", val: "3 - 2 - 1" },
        { label_es: "HAIKU 5.5", label_en: "HAIKU 5.5", val: "$1.54 · 87m" },
        { label_es: "SONNET 5.5", label_en: "SONNET 5.5", val: "$12.22 · 105m" },
        { label_es: "OPUS 5.5", label_en: "OPUS 5.5", val: "$29.94 · 179m" },
      ],
      onOpenDossier: () => navigateToView("dossiers", "ep04"),
      onOpenArena: () => handleJumpToArena("ep04", 4),
    },
    {
      id: "ep03" as ReleaseKey,
      filter: "laboratorios" as const,
      date: "25 Oct 2026",
      readTime: "07:31 Video · 12 Demos",
      badge_es: "LABORATORIO EP03 · BENCHMARK AGY CLI",
      badge_en: "LAB EP03 · AGY CLI BENCHMARK",
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
      onOpenArena: () => handleJumpToArena("ep03", 2),
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
      filter: "laboratorios" as const,
      date: "21 Oct 2026",
      readTime: "08:06 Video · 12 Demos",
      badge_es: "LABORATORIO EP02 · DUELO DE TITANES HIGH",
      badge_en: "LAB EP02 · HIGH TITAN DUEL",
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
      filter: "laboratorios" as const,
      date: "16 Oct 2026",
      readTime: "10:05 Video · 21 Demos",
      badge_es: "LABORATORIO EP01 · TORNEO FUNDACIONAL",
      badge_en: "LAB EP01 · FOUNDATIONAL TOURNAMENT",
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
  const totalLabsCount =
    2 + (released.ep03 ? 1 : 0) + (released.ep04 ? 1 : 0);
  const totalComunidadCount =
    (released.cc01 ? 1 : 0) + (released.cc02 ? 1 : 0);
  const totalDemosCount =
    21 +
    12 +
    (released.cc01 ? 1 : 0) +
    (released.ep03 ? 12 : 0) +
    (released.ep04 ? 18 : 0) +
    (released.cc02 ? 4 : 0);
  const totalPromptsCount =
    10 + 6 + (released.ep03 ? 6 : 0) + (released.ep04 ? 6 : 0) + (released.cc02 ? 1 : 0);
  const totalForumThreadsCount =
    totalPromptsCount +
    5 +
    (released.cc01 ? 1 : 0) +
    (released.ep03 ? 1 : 0) +
    (released.ep04 ? 1 : 0) +
    (released.carbon01 ? 1 : 0) +
    (released.cc02 ? 1 : 0);

  const pocketConsoleItems: PocketConsoleCartridgeItem[] = [
    ...(released.cc02
      ? [
          {
            id: "cc02",
            code: "CC.02",
            kicker:
              lang === "es"
                ? "COMENTARIO AL CODIGO #02 · ROBLOX 3D"
                : "COMMENT TO CODE #02 · 3D ROBLOX",
            title:
              lang === "es"
                ? "Roblox 3D: GPT-6 Astra vs Argon vs Opus 5.5"
                : "3D Roblox: GPT-6 Astra vs Argon vs Opus 5.5",
            verdict:
              lang === "es"
                ? "ASTRA 2 - ARGON 1 - OPUS 0 ($9.91 CRASH)"
                : "ASTRA 2 - ARGON 1 - OPUS 0 ($9.91 CRASH)",
            timeMetric: "18.9m vs 27.2m vs 55.1m",
            costMetric: "$1.11 vs $0.32 vs $9.91",
            thumb: "/brand/thumbs/cc02_thumb_A.png",
            accentHex: "#34D399",
            character: "argon" as const,
            onLaunchPrimary: () => navigateToView("comunidad"),
            onLaunchSecondary: () => navigateToView("noticias"),
            primaryLabel:
              lang === "es"
                ? "JUGAR LOS 3 ROBLOX 3D EN VIVO"
                : "PLAY ALL 3 LIVE 3D ROBLOX GAMES",
            secondaryLabel: "CARBON #1",
          },
        ]
      : []),
    ...(released.carbon01
      ? [
          {
            id: "carbon01",
            code: "CARBON",
            kicker:
              lang === "es"
                ? "NOTICIA IA #01 · #1 MUNDIAL"
                : "AI NEWS #01 · #1 WORLD",
            title:
              lang === "es"
                ? "Gemini 4 Carbon: 54.5% Terminal-Bench Hard"
                : "Gemini 4 Carbon: 54.5% Terminal-Bench Hard",
            verdict:
              lang === "es"
                ? "DESTRONA A OPUS 5.5 · 19 EVALS"
                : "DETHRONES OPUS 5.5 · 19 EVALS",
            timeMetric: "04:19 4K60",
            costMetric: "$4/$20 USD",
            thumb:
              lang === "es"
                ? "/brand/thumbs/carbon_thumb_A.jpg"
                : "/brand/thumbs/carbon_thumb_A_en.jpg",
            accentHex: "#00E5FF",
            character: "carbon" as const,
            onLaunchPrimary: () => navigateToView("noticias"),
            onLaunchSecondary: () => navigateToView("dossiers", "ep04"),
            primaryLabel:
              lang === "es"
                ? "ABRIR ESPECIAL CARBON (VIDEO + 19 EVALS)"
                : "OPEN CARBON SPECIAL (VIDEO + 19 EVALS)",
            secondaryLabel: "EP04",
          },
        ]
      : []),
    ...(released.ep04
      ? [
          {
            id: "ep04",
            code: "EP.04",
            kicker:
              lang === "es"
                ? "ESCALERA CLAUDE 5.5 · 18 DEMOS"
                : "CLAUDE 5.5 LADDER · 18 DEMOS",
            title:
              lang === "es"
                ? "Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5"
                : "Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5",
            verdict: "OPUS 3 · SONNET 2 · HAIKU 1",
            timeMetric: "87m/105m/179m",
            costMetric: "$1.54 - $29.94",
            thumb: "/brand/thumbs/ep04_thumb_A.jpg",
            accentHex: "#FFD100",
            character: "opus" as const,
            onLaunchPrimary: () => navigateToView("dossiers", "ep04"),
            onLaunchSecondary: () => handleJumpToArena("ep04", 4),
            primaryLabel:
              lang === "es"
                ? "ABRIR LABORATORIO EP04 (18 DEMOS)"
                : "OPEN LAB EP04 (18 DEMOS)",
            secondaryLabel: "ARENA",
          },
        ]
      : []),
    ...(released.ep03
      ? [
          {
            id: "ep03",
            code: "EP.03",
            kicker: "BENCHMARK AGY CLI · 12 DEMOS",
            title:
              lang === "es"
                ? "Argon High Sin Kit vs Superpowers Kit"
                : "Argon High Raw vs Superpowers Kit",
            verdict: "SUPERKIT 4 - 2 SIN KIT",
            timeMetric: "276m vs 302m",
            costMetric: "$10.85 vs $7.69",
            thumb: "/brand/thumbs/ep03_thumb_A.jpg",
            accentHex: "#10B981",
            character: "mixiuh" as const,
            onLaunchPrimary: () => navigateToView("dossiers", "ep03"),
            onLaunchSecondary: () => handleJumpToArena("ep03", 2),
            primaryLabel:
              lang === "es"
                ? "ABRIR LABORATORIO EP03 (12 DEMOS)"
                : "OPEN LAB EP03 (12 DEMOS)",
            secondaryLabel: "ARENA",
          },
        ]
      : []),
    ...(released.cc01
      ? [
          {
            id: "cc01",
            code: "CC.01",
            kicker: "COMENTARIO AL CODIGO · @TENITO03",
            title: "OVERFIT Studio 3D · 300 GSM Streetwear",
            verdict: "3 MANIQUIES 3D + 10 ARTES 2K",
            timeMetric: "BLENDER + GLB",
            costMetric: "EXPORT 4K",
            thumb: "/brand/thumbs/cc01_thumb_A.jpg",
            accentHex: "#FFD100",
            character: "flash" as const,
            onLaunchPrimary: () => navigateToView("comunidad"),
            primaryLabel:
              lang === "es"
                ? "ABRIR OVERFIT STUDIO 3D EN VIVO"
                : "OPEN LIVE OVERFIT STUDIO 3D",
          },
        ]
      : []),
    {
      id: "ep02",
      code: "EP.02",
      kicker: "DUELO DE TITANES HIGH · 12 DEMOS",
      title: "Gemini 4 Argon vs Claude Opus 5.5",
      verdict: "ARGON 4 - 2 OPUS 5.5",
      timeMetric: "90m vs 159m",
      costMetric: "$6.26 vs $16.26",
      thumb: "/brand/thumbs/ep02_thumb_A.jpg",
      accentHex: "#A855F7",
      character: "argon" as const,
      onLaunchPrimary: () => navigateToView("dossiers", "ep02"),
      onLaunchSecondary: () => handleJumpToArena("ep02", 1),
      primaryLabel:
        lang === "es"
          ? "ABRIR LABORATORIO EP02 (12 MOTORES)"
          : "OPEN LAB EP02 (12 ENGINES)",
      secondaryLabel: "ARENA",
    },
  ];

  return (
    <div className="min-h-screen labs-grid-bg text-[#F5F2EB] flex flex-col relative overflow-x-clip">
      {/* PROCEDURAL PIXEL-ART AI ECOSYSTEM BACKGROUND (Strictly z-0 underneath all opaque components) */}
      <PixelProceduralAmbientBg mode={ambientMode} opacity={0.34} />

      {/* PROCEDURAL PIXEL-BY-PIXEL SCROLL CARD MATERIALIZER */}
      <PixelScrollMaterializer
        watchKey={`${mainView}-${dossierEp}-${blogFilter}-${arenaMode}-${foroSubTab}`}
      />

      {/* FOREGROUND OPAQUE LAYER (Strictly z-10 above background canvas) */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        {/* FULL-WIDTH SINGLE-ROW OPAQUE PIXEL-ART HEADER (Zero Wrap, Zero Overflow) */}
        <header className="sticky top-0 z-50 bg-[#090B10] border-b-3 border-[#FFD100] shadow-[0_4px_0_#040508] w-full">
          <div className="w-full px-2 sm:px-3 lg:px-4">
            <div className="h-14 flex items-center justify-between gap-2 flex-nowrap">
              {/* Left: Clean Mixiuh Labs Brand Logo */}
              <button
                onClick={() => navigateToView("blog")}
                className="flex items-center gap-2 shrink-0 group cursor-pointer text-left"
              >
                <div className="p-1 bg-[#FFD100] border-2 border-[#090B10] shadow-[2px_2px_0_#00E5FF]">
                  <img
                    src="/brand/logos/mixiuh-labs_mark_dark.svg"
                    alt="Mixiuh Labs"
                    className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
                  />
                </div>
                <span className="font-pixel text-xs sm:text-sm font-bold tracking-wider text-white whitespace-nowrap">
                  MIXIUH <span className="text-[#FFD100]">LABS</span>
                </span>
              </button>

              {/* Center: Single-Row Centered Tactile Navigation Bar */}
              <nav className="hidden md:flex flex-nowrap items-center justify-center gap-1 bg-[#111622] p-1 border-2 border-[#2A344B] font-mono-hud text-[11px] xl:text-xs mx-auto overflow-x-auto">
                <button
                  onClick={() => navigateToView("blog")}
                  className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    mainView === "blog"
                      ? "bg-[#FFD100] text-[#090B10] border border-[#090B10]"
                      : "text-[#CBD5E1] hover:text-white"
                  }`}
                >
                  <PixelIcon
                    name="home"
                    size={12}
                    color={mainView === "blog" ? "#090B10" : "#FFD100"}
                  />
                  <span>
                    {lang === "es"
                      ? `Inicio (${totalEpisodesCount})`
                      : `Home (${totalEpisodesCount})`}
                  </span>
                </button>

                <button
                  onClick={() => navigateToView("dossiers")}
                  className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    mainView === "dossiers"
                      ? "bg-[#10B981] text-[#090B10] border border-[#090B10]"
                      : "text-[#CBD5E1] hover:text-white"
                  }`}
                >
                  <PixelIcon
                    name="floppy"
                    size={12}
                    color={mainView === "dossiers" ? "#090B10" : "#10B981"}
                  />
                  <span>{`Videos / Labs (${totalLabsCount})`}</span>
                </button>

                {released.cc01 && (
                  <button
                    onClick={() => navigateToView("comunidad")}
                    className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      mainView === "comunidad"
                        ? "bg-[#FFD100] text-[#090B10] border border-[#090B10]"
                        : "text-[#CBD5E1] hover:text-white"
                    }`}
                  >
                    <PixelIcon
                      name="sparkles"
                      size={12}
                      color={mainView === "comunidad" ? "#090B10" : "#FFD100"}
                    />
                    <span>
                      {lang === "es"
                        ? `Comentario al Codigo (${totalComunidadCount})`
                        : `Comment to Code (${totalComunidadCount})`}
                    </span>
                  </button>
                )}

                {released.carbon01 && (
                  <button
                    onClick={() => navigateToView("noticias")}
                    className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      mainView === "noticias"
                        ? "bg-[#00E5FF] text-[#090B10] border border-[#090B10]"
                        : "text-[#00E5FF] hover:text-white"
                    }`}
                  >
                    <PixelIcon
                      name="broadcast"
                      size={12}
                      color={mainView === "noticias" ? "#090B10" : "#00E5FF"}
                    />
                    <span>
                      {lang === "es" ? "Noticias IA (1)" : "AI News (1)"}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => navigateToView("arena")}
                  className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    mainView === "arena"
                      ? "bg-[#A855F7] text-white border border-[#090B10]"
                      : "text-[#CBD5E1] hover:text-white"
                  }`}
                >
                  <PixelIcon
                    name="gamepad"
                    size={12}
                    color={mainView === "arena" ? "#FFFFFF" : "#A855F7"}
                  />
                  <span>{`Arena (${totalDemosCount})`}</span>
                </button>

                <button
                  onClick={() => navigateToView("pixelui")}
                  className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    mainView === "pixelui"
                      ? "bg-[#FF3355] text-white border border-[#090B10]"
                      : "text-[#FF3355] hover:text-white"
                  }`}
                >
                  <PixelIcon
                    name="crt-tv"
                    size={12}
                    color={mainView === "pixelui" ? "#FFFFFF" : "#FF3355"}
                  />
                  <span>Pixel UI Kit</span>
                </button>

                <button
                  onClick={() => navigateToView("foro")}
                  className={`px-2 xl:px-2.5 py-1 font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    mainView === "foro"
                      ? "bg-[#F5F2EB] text-[#090B10] border border-[#090B10]"
                      : "text-[#CBD5E1] hover:text-white"
                  }`}
                >
                  <PixelIcon
                    name="message"
                    size={12}
                    color={mainView === "foro" ? "#090B10" : "#F5F2EB"}
                  />
                  <span>{lang === "es" ? "Foro" : "Forum"}</span>
                </button>
              </nav>

              {/* Right: Compact Hardware & Social Controls (Single Row, Zero Overflow) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={cycleCursorStyle}
                  title={
                    lang === "es"
                      ? `Cambiar cursor Pixel-Art (${cursorStyle})`
                      : `Switch Pixel-Art cursor (${cursorStyle})`
                  }
                  className="hidden sm:inline-flex px-2 py-1 bg-[#111622] hover:bg-[#00E5FF] hover:text-[#090B10] text-[#00E5FF] border-2 border-[#090B10] font-pixel text-[9px] font-bold items-center gap-1 cursor-pointer shadow-[2px_2px_0_#040508]"
                >
                  <PixelIcon name="mouse" size={11} />
                  <span className="hidden xl:inline">CURSOR</span>
                </button>

                <button
                  type="button"
                  onClick={cycleAmbientMode}
                  title={
                    lang === "es"
                      ? `Cambiar ecosistema IA de fondo (${ambientMode})`
                      : `Switch background AI ecosystem (${ambientMode})`
                  }
                  className={`hidden sm:inline-flex px-2 py-1 border-2 border-[#090B10] font-pixel text-[9px] font-bold items-center gap-1 cursor-pointer shadow-[2px_2px_0_#040508] ${
                    ambientMode !== "off"
                      ? "bg-[#10B981] text-[#090B10]"
                      : "bg-[#111622] text-[#94A3B8]"
                  }`}
                >
                  <PixelIcon name="brain-ai" size={11} />
                  <span className="hidden xl:inline">BG IA</span>
                </button>

                <button
                  type="button"
                  onClick={toggleSfx}
                  title={
                    lang === "es"
                      ? "Activar/Desactivar sonidos 8-Bit WebAudio"
                      : "Toggle 8-Bit WebAudio SFX"
                  }
                  className={`px-2 py-1 border-2 border-[#090B10] font-pixel text-[9px] font-bold flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_#040508] ${
                    sfxEnabled
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#94A3B8]"
                  }`}
                >
                  <PixelIcon
                    name={sfxEnabled ? "volume-on" : "volume-off"}
                    size={12}
                    color={sfxEnabled ? "#090B10" : "#94A3B8"}
                  />
                  <span className="hidden lg:inline">
                    {sfxEnabled ? "SFX" : "MUTE"}
                  </span>
                </button>

                <div className="inline-flex bg-[#111622] p-0.5 border-2 border-[#2A344B]">
                  <button
                    onClick={() => {
                      playSfx("click");
                      setLang("es");
                    }}
                    className={`px-1.5 py-0.5 font-pixel text-[9px] font-bold transition cursor-pointer ${
                      lang === "es"
                        ? "bg-[#FFD100] text-[#090B10]"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => {
                      playSfx("click");
                      setLang("en");
                    }}
                    className={`px-1.5 py-0.5 font-pixel text-[9px] font-bold transition cursor-pointer ${
                      lang === "en"
                        ? "bg-[#FFD100] text-[#090B10]"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    EN
                  </button>
                </div>

                <a
                  href="https://x.com/MixiuhLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("coin")}
                  title="X @MixiuhLabs"
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-[#F5F2EB] text-[#090B10] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] font-pixel text-[9px] font-bold hover:bg-[#00E5FF] transition"
                >
                  <PixelIcon name="x" size={11} color="#090B10" />
                </a>

                <a
                  href={
                    lang === "es"
                      ? YOUTUBE_LINKS.channel_es
                      : YOUTUBE_LINKS.channel_en
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("coin")}
                  title="YouTube Mixiuh Labs"
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-[#FF3355] text-white border-2 border-[#090B10] shadow-[2px_2px_0_#040508] font-pixel text-[9px] font-bold hover:brightness-110 transition"
                >
                  <PixelIcon name="youtube" size={12} color="#FFFFFF" />
                  <span className="hidden 2xl:inline">YT</span>
                </a>
              </div>
            </div>

            {/* Mobile View Switcher Bar */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 font-mono-hud text-[11px] whitespace-nowrap">
              <button
                onClick={() => navigateToView("blog")}
                className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                  mainView === "blog"
                    ? "bg-[#FFD100] text-[#090B10]"
                    : "bg-[#111622] text-[#94A3B8]"
                }`}
              >
                {lang === "es"
                  ? `Inicio (${totalEpisodesCount})`
                  : `Home (${totalEpisodesCount})`}
              </button>
              <button
                onClick={() => navigateToView("dossiers")}
                className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                  mainView === "dossiers"
                    ? "bg-[#10B981] text-[#090B10]"
                    : "bg-[#111622] text-[#94A3B8]"
                }`}
              >
                {`Videos / Labs (${totalLabsCount})`}
              </button>
              {released.cc01 && (
                <button
                  onClick={() => navigateToView("comunidad")}
                  className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                    mainView === "comunidad"
                      ? "bg-[#FFD100] text-[#090B10]"
                      : "bg-[#111622] text-[#94A3B8]"
                  }`}
                >
                  {lang === "es"
                    ? `Comentario al Codigo (${totalComunidadCount})`
                    : `Comment to Code (${totalComunidadCount})`}
                </button>
              )}
              {released.carbon01 && (
                <button
                  onClick={() => navigateToView("noticias")}
                  className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                    mainView === "noticias"
                      ? "bg-[#00E5FF] text-[#090B10]"
                      : "bg-[#111622] text-[#00E5FF]"
                  }`}
                >
                  {lang === "es" ? "Noticias IA" : "AI News"}
                </button>
              )}
              <button
                onClick={() => navigateToView("arena")}
                className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                  mainView === "arena"
                    ? "bg-[#A855F7] text-white"
                    : "bg-[#111622] text-[#94A3B8]"
                }`}
              >
                {`Arena (${totalDemosCount})`}
              </button>
              <button
                onClick={() => navigateToView("pixelui")}
                className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                  mainView === "pixelui"
                    ? "bg-[#FF3355] text-white"
                    : "bg-[#111622] text-[#FF3355]"
                }`}
              >
                Pixel UI Kit
              </button>
              <button
                onClick={() => navigateToView("foro")}
                className={`px-2.5 py-1 font-bold border border-[#090B10] cursor-pointer ${
                  mainView === "foro"
                    ? "bg-[#F5F2EB] text-[#090B10]"
                    : "bg-[#111622] text-[#94A3B8]"
                }`}
              >
                {lang === "es" ? "Foro" : "Forum"}
              </button>
            </div>
          </div>
        </header>

      {/* =====================================================================
          VIEW 1: PLAYDATE FLAT MINIMALIST + 3D CONSOLE PORTAL PRINCIPAL
         ===================================================================== */}
      {mainView === "blog" && (
        <main className="flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* PLAYDATE HERO: FLAT MINIMALIST LEFT + FLOATING 3D POCKET CONSOLE RIGHT */}
            <div className="bg-[#111622] border-3 border-[#FFD100] shadow-[8px_8px_0_#040508] overflow-hidden">
              {/* Top Signal Yellow Hardware Banner Strip */}
              <div className="px-5 py-2.5 bg-[#FFD100] text-[#090B10] border-b-3 border-[#090B10] flex flex-wrap items-center justify-between gap-2 font-mono-hud text-xs font-bold">
                <div className="flex items-center gap-2">
                  <PixelIcon name="console" size={15} color="#090B10" />
                  <span className="font-pixel text-[11px] tracking-wider">
                    {lang === "es"
                      ? "MIXIUH LABS // AQUI NO SE OPINA: SE PRUEBA."
                      : "MIXIUH LABS // HERE WE DON'T GUESS: WE TEST."}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 bg-[#090B10] text-[#FFD100] font-pixel text-[9px]">
                    {`${totalEpisodesCount} PRODUCCIONES 4K60`}
                  </span>
                  <span className="px-2 py-0.5 bg-[#090B10] text-[#00E5FF] font-pixel text-[9px]">
                    {`${totalDemosCount} MOTORES EN VIVO`}
                  </span>
                </div>
              </div>

              {/* Main 2-Column Playdate Flat + 3D Stage */}
              <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Clean Flat Editorial Protagonist */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#00E5FF] text-[#090B10] border-2 border-[#090B10] font-pixel text-[10px] font-bold">
                      {lang === "es"
                        ? "ULTIMA HORA · RADAR MIXIUH NOTICIAS IA #01"
                        : "BREAKING · MIXIUH AI NEWS RADAR #01"}
                    </span>
                    <span className="px-2.5 py-1 bg-[#090B10] text-[#10B981] border border-[#10B981] font-mono-hud text-xs font-bold inline-flex items-center gap-1.5">
                      <PixelIcon name="trophy" size={12} color="#10B981" />
                      <span>19 EVALS DEEPMIND</span>
                    </span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.06] px-extrude-title">
                    {lang === "es" ? (
                      <>
                        Google Anuncia{" "}
                        <span className="text-[#00E5FF]">Gemini 4 Carbon</span>:
                        El Nuevo{" "}
                        <span className="text-[#FFD100]">#1 Mundial</span> y el
                        Salto a{" "}
                        <span className="text-[#FF3355]">$4/$20 USD</span>
                      </>
                    ) : (
                      <>
                        Google Unveils{" "}
                        <span className="text-[#00E5FF]">Gemini 4 Carbon</span>:
                        The New{" "}
                        <span className="text-[#FFD100]">#1 Worldwide</span> &
                        the <span className="text-[#FF3355]">$4/$20 USD</span>{" "}
                        Jump
                      </>
                    )}
                  </h1>

                  <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                    {lang === "es"
                      ? "A solo 14 dias de lanzar Argon, Google DeepMind publica Gemini 4 Carbon. Desglosamos los 8 capitulos del reporte en 4K60: como destrona a Claude Opus 5.5 en Terminal-Bench Hard (54.5% vs 53.0%), su dominio en ciberseguridad defensiva (84.0% en SecBench) y por que duplicar la tarifa API ($4/$20 USD) sigue costando 20% menos que Opus ($5/$25)."
                      : "Just 14 days after launching Argon, Google DeepMind releases Gemini 4 Carbon. We break down all 8 chapters in 4K60: how it dethrones Claude Opus 5.5 on Terminal-Bench Hard (54.5% vs 53.0%), sweeps defensive cybersecurity (84.0% on SecBench), and why doubling the API rate ($4/$20 USD) still costs 20% less than Opus ($5/$25)."}
                  </p>

                  {/* Standard Mixiuh Telemetry Strip ([CLOCK + MIN] & [COIN + $ USD]) */}
                  <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                    <span className="px-3 py-1.5 bg-[#090B10] border-2 border-[#00E5FF] text-[#F5F2EB] font-bold inline-flex items-center gap-1.5">
                      <PixelIcon name="clock" size={13} color="#00E5FF" />
                      <span>TERMINAL HARD: 54.5% (#1)</span>
                    </span>
                    <span className="px-3 py-1.5 bg-[#090B10] border-2 border-[#FFD100] text-[#FFD100] font-bold inline-flex items-center gap-1.5">
                      <PixelIcon name="coin" size={13} color="#FFD100" />
                      <span>API: $4 / $20 USD (-20% VS OPUS)</span>
                    </span>
                    <span className="px-3 py-1.5 bg-[#090B10] border-2 border-[#10B981] text-[#10B981] font-bold inline-flex items-center gap-1.5">
                      <PixelIcon name="shield" size={13} color="#10B981" />
                      <span>SECBENCH: 84.0% (#1)</span>
                    </span>
                  </div>

                  {/* Tactile Hardware Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {released.cc02 && (
                      <button
                        onClick={() => {
                          setComunidadEp("cc02");
                          navigateToView("comunidad");
                        }}
                        className="px-btn bg-[#10B981] text-[#090B10] px-5 py-3 text-xs sm:text-sm"
                      >
                        <PixelIcon name="gamepad" size={15} color="#090B10" />
                        <span>
                          {lang === "es"
                            ? "Nuevo: Reto ROBLOX 3D (CC02 · 3 Gigantes + Bonus)"
                            : "New: 3D ROBLOX Challenge (CC02 · 3 Giants + Bonus)"}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => navigateToView("noticias")}
                      className="px-btn bg-[#FFD100] text-[#090B10] px-5 py-3 text-xs sm:text-sm"
                    >
                      <PixelIcon name="play" size={15} color="#090B10" />
                      <span>
                        {lang === "es"
                          ? "Ver Video + Especial Gemini 4 Carbon"
                          : "Watch Video + Gemini 4 Carbon Special"}
                      </span>
                    </button>

                    <button
                      onClick={() => navigateToView("dossiers", "ep04")}
                      className="px-btn bg-[#00E5FF] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                    >
                      <PixelIcon name="cartridge" size={15} color="#090B10" />
                      <span>
                        {lang === "es"
                          ? "Laboratorio EP04: Escalera Claude 5.5"
                          : "Lab EP04: Claude 5.5 Ladder"}
                      </span>
                    </button>

                    <button
                      onClick={() => navigateToView("pixelui")}
                      className="px-btn bg-[#F5F2EB] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                    >
                      <PixelIcon name="console" size={15} color="#090B10" />
                      <span>
                        {lang === "es"
                          ? "Mixiuh Pixel UI (Gratis)"
                          : "Mixiuh Pixel UI (Free)"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Interactive 3D Retro CRT Monitor Workstation */}
                <div className="lg:col-span-5">
                  <Pixel3DCRTWorkstation
                    items={pocketConsoleItems}
                    lang={lang}
                  />
                </div>
              </div>
            </div>

            {/* OFFICIAL SOCIAL MEDIA & COMMUNITY REDIRECT HUB IN PIXEL-ART */}
            <div
              data-px-reveal="true"
              className="bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] p-4 sm:p-5 space-y-3"
              style={{ outline: "2px solid #2A344B" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-pixel text-[10px] font-bold text-[#FFD100]">
                  <PixelIcon name="share" size={14} color="#FFD100" />
                  <span>
                    {lang === "es"
                      ? "REDES OFICIALES Y COMUNIDAD MIXIUH LABS (YOUTUBE · INSTAGRAM · TIKTOK · X · GITHUB)"
                      : "OFFICIAL MIXIUH LABS SOCIAL CHANNELS & COMMUNITY"}
                  </span>
                </div>
                <span className="font-mono-hud text-[11px] text-[#94A3B8]">
                  @MixiuhLabs · @labs.mixiuh · labs.mixiuh.online
                </span>
              </div>
              <PixelSocialBar />
            </div>

            {/* 4-PILLAR FLAT PLAYDATE SPEC DIRECTORY BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pillar 1: Videos / Laboratorios */}
              <div
                onClick={() => navigateToView("dossiers", "ep04")}
                className="px-card-emerald px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#10B981] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>01 // VIDEOS & LABS</span>
                    <span>EP01-EP04</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "Benchmarks Empiricos y Duelos Zero-Shot"
                        : "Empirical Benchmarks & Zero-Shot Duels"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? "4 episodios completos y 63 simuladores: Escalera Claude 5.5, Superpowers Kit, Argon vs Opus 5.5 y Argon vs 3.8 Flash."
                        : "4 full episodes and 63 simulators: Claude 5.5 Ladder, Superpowers Kit, Argon vs Opus 5.5, and Argon vs 3.8 Flash."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-white/10 flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#10B981] font-bold">
                    {lang === "es" ? "Abrir Dossiers →" : "Open Dossiers →"}
                  </span>
                  <PixelIcon name="cartridge" size={14} color="#10B981" />
                </div>
              </div>

              {/* Pillar 2: Del Comentario al Codigo */}
              <div
                onClick={() => navigateToView("comunidad")}
                className="px-card-yellow px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#FFD100] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>02 // COMENTARIO AL CODIGO</span>
                    <span>CC02 + CC01</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "ROBLOX 3D (3 Gigantes) + OVERFIT 3D"
                        : "3D ROBLOX (3 Giants) + OVERFIT 3D"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? "Duelo Roblox 3D en modo HIGH (GPT-6 Astra vs Argon vs Opus 5.5) y estudio de ropa 300 GSM en Blender Cycles."
                        : "HIGH mode 3D Roblox showdown (GPT-6 Astra vs Argon vs Opus 5.5) & 300 GSM Blender Cycles streetwear studio."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-white/10 flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#FFD100] font-bold">
                    {lang === "es"
                      ? "Jugar Roblox 3D + Estudio →"
                      : "Play 3D Roblox + Studio →"}
                  </span>
                  <PixelIcon name="sparkles" size={14} color="#FFD100" />
                </div>
              </div>

              {/* Pillar 3: Radar Mixiuh Noticias IA */}
              <div
                onClick={() => navigateToView("noticias")}
                className="px-card-cyan px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#00E5FF] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>03 // NOTICIAS IA · RADAR</span>
                    <span>CARBON #1</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "Especial #01: Gemini 4 Carbon (19 Evals)"
                        : "Special #01: Gemini 4 Carbon (19 Evals)"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? "Video 4K60, Short vertical, tabla interactiva de las 19 evaluaciones de DeepMind y comparativa de costos API."
                        : "4K60 video, vertical Short, interactive table of all 19 DeepMind benchmarks, and API cost breakdown."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-white/10 flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#00E5FF] font-bold">
                    {lang === "es" ? "Abrir Noticias IA →" : "Open AI News →"}
                  </span>
                  <PixelIcon name="broadcast" size={14} color="#00E5FF" />
                </div>
              </div>

              {/* Pillar 4: Mixiuh Pixel UI Open Source Library */}
              <div
                onClick={() => navigateToView("pixelui")}
                className="px-card-coral px-card-interactive flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="px-4 py-2 bg-[#FF3355] text-white border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
                    <span>04 // PIXEL UI KIT v1.0</span>
                    <span>OPEN SOURCE</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display text-base sm:text-lg font-black text-white">
                      {lang === "es"
                        ? "Libreria Pixel-Art + 3D + Audio (Gratis)"
                        : "Pixel-Art + 3D + Audio UI Library (Free)"}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {lang === "es"
                        ? "+40 componentes, 52 iconos 16x16, graficas, consolas 3D y sintetizador WebAudio 8-bit. Libre para uso comercial con credito."
                        : "40+ components, 52 16x16 icons, charts, 3D consoles & WebAudio 8-bit synth. Free for commercial use with credit."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#090B10] border-t border-white/10 flex items-center justify-between font-mono-hud text-xs">
                  <span className="text-[#FF3355] font-bold">
                    {lang === "es"
                      ? "Probar y Descargar UI Kit →"
                      : "Test & Download UI Kit →"}
                  </span>
                  <PixelIcon name="download" size={14} color="#FF3355" />
                </div>
              </div>
            </div>

            {/* CATALOGO DE EPISODIOS EN CARTUCHOS / SPEC CARDS PLAYDATE */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#2A344B] pb-4">
                <div>
                  <div className="font-pixel text-xs font-bold text-[#FFD100] uppercase mb-1">
                    {lang === "es"
                      ? "CATALOGO DE PRODUCCIONES Y CARTUCHOS DE LABORATORIO"
                      : "PRODUCTION CATALOG & LAB CARTRIDGE ARCHIVE"}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {lang === "es"
                      ? "Videos / Laboratorios, Del Comentario al Codigo y Noticias IA"
                      : "Videos / Labs, Comment to Code & AI News"}
                  </h2>
                </div>

                {/* Playdate Tactile Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                  {(
                    [
                      {
                        id: "all" as const,
                        show: true,
                        es: `Todos (${totalEpisodesCount})`,
                        en: `All (${totalEpisodesCount})`,
                      },
                      {
                        id: "laboratorios" as const,
                        show: true,
                        es: `Videos / Labs (${totalLabsCount})`,
                        en: `Videos / Labs (${totalLabsCount})`,
                      },
                      {
                        id: "comunidad" as const,
                        show: released.cc01 || released.cc02,
                        es: `Comentario al Codigo (${(released.cc01 ? 1 : 0) + (released.cc02 ? 1 : 0)})`,
                        en: `Comment to Code (${(released.cc01 ? 1 : 0) + (released.cc02 ? 1 : 0)})`,
                      },
                      {
                        id: "noticias" as const,
                        show: released.carbon01,
                        es: "Noticias IA (1)",
                        en: "AI News (1)",
                      },
                    ]
                  )
                    .filter((f) => f.show)
                    .map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          playSfx("click");
                          setBlogFilter(f.id);
                        }}
                        className={`px-3 py-1.5 font-bold border-2 border-[#090B10] shadow-[3px_3px_0_#040508] transition cursor-pointer ${
                          blogFilter === f.id
                            ? "bg-[#FFD100] text-[#090B10]"
                            : "bg-[#131824] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {lang === "es" ? f.es : f.en}
                      </button>
                    ))}
                </div>
              </div>

              {/* 2-Column Playdate Spec + 3D Cartridge Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className="bg-[#111622] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] flex flex-col justify-between transition hover:-translate-y-1"
                    style={{ outline: `2px solid ${art.accentColor}` }}
                  >
                    <div>
                      {/* Top Cartridge Header Strip */}
                      <div
                        className="px-4 py-2 border-b-2 border-[#090B10] flex items-center justify-between gap-2 font-pixel text-[10px] font-bold text-[#090B10]"
                        style={{ backgroundColor: art.accentColor }}
                      >
                        <span className="truncate">
                          {lang === "es" ? art.badge_es : art.badge_en}
                        </span>
                        <span className="px-2 py-0.5 bg-[#090B10] text-[#FFD100] shrink-0">
                          {lang === "es"
                            ? art.scoreBadge_es
                            : art.scoreBadge_en}
                        </span>
                      </div>

                      {/* 4K Thumbnail Protagonist */}
                      <div
                        onClick={art.onOpenDossier}
                        className="relative aspect-video bg-[#090B10] border-b-2 border-[#090B10] overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={art.thumb}
                          alt={lang === "es" ? art.title_es : art.title_en}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono-hud text-[11px]">
                          <span className="px-2.5 py-1 bg-[#090B10] border border-white/25 text-[#F5F2EB] font-bold">
                            {art.date}
                          </span>
                          <span className="px-2.5 py-1 bg-[#090B10] border border-[#FFD100] text-[#FFD100] font-bold">
                            {art.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <h3
                          onClick={art.onOpenDossier}
                          className="font-display text-xl sm:text-2xl font-black text-white leading-snug hover:text-[#FFD100] transition cursor-pointer"
                        >
                          {lang === "es" ? art.title_es : art.title_en}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                          {lang === "es" ? art.excerpt_es : art.excerpt_en}
                        </p>

                        {/* 4 Mini Telemetry Blocks */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {art.metrics.map((m, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-[#090B10] border border-[#2A344B]"
                            >
                              <div className="font-mono-hud text-[10px] text-[#94A3B8]">
                                {lang === "es" ? m.label_es : m.label_en}
                              </div>
                              <div
                                className="font-mono-hud text-xs font-bold mt-0.5 truncate"
                                style={{
                                  color:
                                    idx === 0 ? art.accentColor : "#F5F2EB",
                                }}
                              >
                                {m.val}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Hardware Buttons */}
                    <div className="px-5 py-3.5 bg-[#090B10] border-t-2 border-[#2A344B] flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={art.onOpenDossier}
                        className="px-btn px-4 py-2 text-xs text-[#090B10]"
                        style={{ backgroundColor: art.accentColor }}
                      >
                        <PixelIcon name="play" size={13} color="#090B10" />
                        <span>
                          {art.filter === "noticias"
                            ? lang === "es"
                              ? "Abrir Noticia + Video"
                              : "Open News + Video"
                            : art.id === "cc02"
                            ? lang === "es"
                              ? "Jugar ROBLOX 3D (4 Demos)"
                              : "Play 3D ROBLOX (4 Demos)"
                            : art.filter === "comunidad"
                            ? lang === "es"
                              ? "Abrir OVERFIT Studio 3D"
                              : "Open OVERFIT Studio 3D"
                            : lang === "es"
                            ? "Abrir Laboratorio"
                            : "Open Lab Dossier"}
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={art.onOpenArena}
                          className="px-btn bg-[#131824] text-[#F5F2EB] hover:bg-[#FFD100] hover:text-[#090B10] px-3 py-2 text-xs"
                        >
                          <PixelIcon name="gamepad" size={13} />
                          <span>
                            {art.filter === "noticias"
                              ? lang === "es"
                                ? "19 Evals"
                                : "19 Evals"
                              : lang === "es"
                              ? "Probar Demos"
                              : "Play Demos"}
                          </span>
                        </button>

                        <button
                          onClick={() => navigateToView("foro")}
                          className="px-btn bg-[#131824] text-[#94A3B8] hover:text-white px-3 py-2 text-xs"
                        >
                          {lang === "es" ? "Foro" : "Forum"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* QUICK NAVIGATION CARDS TO ARENA, PIXEL UI KIT & FORUM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div
                onClick={() => navigateToView("arena")}
                className="px-card-violet px-card-interactive p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#A855F7] text-white font-pixel text-[10px] font-bold mb-3">
                    <PixelIcon name="gamepad" size={13} color="#FFFFFF" />
                    <span>{`ARENA (${totalDemosCount} DEMOS)`}</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-white mb-2">
                    {lang === "es"
                      ? `Ejecuta los ${totalDemosCount} Simuladores en tu Navegador`
                      : `Run All ${totalDemosCount} Simulators Live in Your Browser`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {lang === "es"
                      ? "Compara lado a lado las entregas de EP04 (Haiku vs Sonnet vs Opus), EP03 (Sin Kit vs Superpowers Kit), EP02 (Argon vs Opus 5.5), EP01 y OVERFIT 3D."
                      : "Compare side-by-side deliverables from EP04 (Haiku vs Sonnet vs Opus), EP03 (Raw vs Superpowers Kit), EP02 (Argon vs Opus 5.5), EP01, and OVERFIT 3D."}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#A855F7]">
                  {lang === "es" ? "Entrar a la Arena →" : "Enter the Arena →"}
                </div>
              </div>

              <div
                onClick={() => navigateToView("pixelui")}
                className="px-card-chalk px-card-interactive p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#090B10] text-[#FFD100] font-pixel text-[10px] font-bold mb-3">
                    <PixelIcon name="crt-tv" size={13} color="#FFD100" />
                    <span>@MIXIUH/PIXEL-UI v2.0 (GRATIS)</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-[#090B10] mb-2">
                    {lang === "es"
                      ? `Descarga Nuestra Libreria Pixel-Art (${ALL_PIXEL_ICON_NAMES.length} Iconos + 3D + Audio)`
                      : `Download Our Pixel-Art UI Library (${ALL_PIXEL_ICON_NAMES.length} Icons + 3D + Audio)`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#090B10] leading-relaxed">
                    {lang === "es"
                      ? `Usa libremente todos nuestros botones tactiles, monitor CRT 3D, disquetes 3.5", ${ALL_PIXEL_ICON_NAMES.length} iconos (incluyendo redes sociales), cursores y sonidos 8-bit dando credito a Mixiuh Labs.`
                      : `Freely use all our tactile buttons, 3D CRT monitor, 3.5" floppies, ${ALL_PIXEL_ICON_NAMES.length} icons (including social brands), cursors, and 8-bit sounds by crediting Mixiuh Labs.`}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#090B10]">
                  {lang === "es"
                    ? "Abrir Estudio Pixel UI + Descargar ZIP →"
                    : "Open Pixel UI Studio + Download ZIP →"}
                </div>
              </div>

              <div
                onClick={() => {
                  setForoSubTab("hilos");
                  navigateToView("foro");
                }}
                className="px-card-cyan px-card-interactive p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00E5FF] text-[#090B10] font-pixel text-[10px] font-bold mb-3">
                    <PixelIcon name="message" size={13} color="#090B10" />
                    <span>{`FORO Y GLOSARIO (${totalForumThreadsCount} HILOS)`}</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-white mb-2">
                    {lang === "es"
                      ? "Autopsias de Codigo, Facturas de Tokens y 53 Conceptos"
                      : "Code Autopsies, Token Bills & 53 Concepts"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {lang === "es"
                      ? `Lee las autopsias forenses de Gemini 4 Carbon, Escalera Claude 5.5, Superpowers Kit y copia los ${totalPromptsCount} prompts originales.`
                      : `Read the forensic breakdowns of Gemini 4 Carbon, Claude 5.5 Ladder, Superpowers Kit, and copy all ${totalPromptsCount} verbatim prompts.`}
                  </p>
                </div>
                <div className="mt-4 font-mono-hud text-xs font-bold text-[#00E5FF]">
                  {lang === "es"
                    ? "Abrir Foro y Glosario →"
                    : "Open Forum & Glossary →"}
                </div>
              </div>
            </div>

            {/* LIVE PIXEL-ART TELEMETRY CHARTS, RELEASE CALENDAR & COLLAPSE FAQ */}
            <div
              data-px-reveal="true"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left 7 Cols: Multi-Series Pixel Telemetry Chart + Donut Gauges */}
              <div className="lg:col-span-7 space-y-4">
                <PixelMultiLineChart
                  title={
                    lang === "es"
                      ? "TELEMETRIA COMPARATIVA // GEMINI 4 CARBON VS OPUS 5.5 VS SONNET 5.5"
                      : "COMPARATIVE TELEMETRY // GEMINI 4 CARBON VS OPUS 5.5 VS SONNET 5.5"
                  }
                  subtitle={
                    lang === "es"
                      ? "Haz clic en cada modelo para activar/ocultar series o pasa el cursor sobre los nodos"
                      : "Click any model legend to toggle series or hover over pixel nodes"
                  }
                  series={[
                    {
                      key: "carbon",
                      name: "Gemini 4 Carbon",
                      color: "#00E5FF",
                    },
                    {
                      key: "opus",
                      name: "Claude Opus 5.5",
                      color: "#A855F7",
                    },
                    {
                      key: "sonnet",
                      name: "Claude Sonnet 5.5",
                      color: "#FFD100",
                    },
                  ]}
                  data={[
                    {
                      label: "TERM-HARD",
                      values: { carbon: 54.5, opus: 53.0, sonnet: 43.8 },
                    },
                    {
                      label: "SECBENCH",
                      values: { carbon: 84.0, opus: 76.2, sonnet: 68.5 },
                    },
                    {
                      label: "SWE-VERIF",
                      values: { carbon: 79.4, opus: 78.1, sonnet: 72.4 },
                    },
                    {
                      label: "WEBGL-60FPS",
                      values: { carbon: 92.0, opus: 86.0, sonnet: 78.0 },
                    },
                    {
                      label: "COST-EFF",
                      values: { carbon: 94.0, opus: 48.0, sonnet: 76.0 },
                    },
                  ]}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <PixelDonutGauge
                    label="TERMINAL-BENCH HARD"
                    sublabel="Gemini 4 Carbon #1"
                    value={54.5}
                    maxValue={100}
                    displayValue="54.5%"
                    tone="cyan"
                  />
                  <PixelDonutGauge
                    label="SECBENCH DEFENSIVE"
                    sublabel="Record ciberseguridad"
                    value={84.0}
                    maxValue={100}
                    displayValue="84.0%"
                    tone="emerald"
                  />
                  <PixelDonutGauge
                    label="AHORRO API VS OPUS"
                    sublabel="$4/$20 vs $5/$25 USD"
                    value={80}
                    maxValue={100}
                    displayValue="-80%"
                    tone="yellow"
                  />
                </div>
              </div>

              {/* Right 5 Cols: Release Calendar + Collapsible Methodology */}
              <div className="lg:col-span-5 space-y-4">
                <PixelCalendar
                  lang={lang}
                  selectedDate="2026-10-31"
                  tone="yellow"
                  events={[
                    {
                      date: "2026-10-14",
                      label: "EP01: Argon vs 3.8 Flash (10-0)",
                      tone: "violet",
                    },
                    {
                      date: "2026-10-18",
                      label: "EP02: Argon vs Claude Opus 5.5 (4-2)",
                      tone: "cyan",
                    },
                    {
                      date: "2026-10-22",
                      label: "CC01: OVERFIT Studio 3D (@tenito03)",
                      tone: "yellow",
                    },
                    {
                      date: "2026-10-25",
                      label: "EP03: Sin Kit vs Superpowers Kit (4-2)",
                      tone: "emerald",
                    },
                    {
                      date: "2026-10-28",
                      label: "EP04: Escalera Claude 5.5 (18 corridas)",
                      tone: "coral",
                    },
                    {
                      date: "2026-10-30",
                      label: "Noticias IA #01: Gemini 4 Carbon + Pixel UI v2.2",
                      tone: "cyan",
                    },
                    {
                      date: "2026-10-31",
                      label: "CC02: ROBLOX 3D (Astra vs Argon vs Opus + Bonus)",
                      tone: "emerald",
                    },
                  ]}
                />

                <PixelCollapse
                  tone="cyan"
                  defaultOpenIds={["faq-1"]}
                  items={[
                    {
                      id: "faq-1",
                      title:
                        lang === "es"
                          ? "¿Como se auditan las pruebas en Mixiuh Labs?"
                          : "How are benchmarks audited at Mixiuh Labs?",
                      badge: "ZERO-SHOT",
                      icon: "shield",
                      content:
                        lang === "es"
                          ? "Cada reto se ejecuta con el mismo prompt exacto en un unico intento (zero-shot) sin editar ni una linea de codigo. Publicamos el index.html integro, el tiempo cronometrado y la factura real de API."
                          : "Every challenge runs with the exact same verbatim prompt in a single zero-shot attempt without editing a single line of code. We publish the raw index.html, wall-clock time, and real API bill.",
                    },
                    {
                      id: "faq-2",
                      title:
                        lang === "es"
                          ? "¿Puedo usar @mixiuh/pixel-ui en proyectos comerciales?"
                          : "Can I use @mixiuh/pixel-ui in commercial projects?",
                      badge: "CC-BY 4.0",
                      icon: "crt-tv",
                      content:
                        lang === "es"
                          ? "Si, 100% gratis para uso personal o comercial en cualquier parte del mundo. Solo debes incluir una insignia o enlace de credito a labs.mixiuh.online."
                          : "Yes, 100% free for personal or commercial use worldwide. Just include a visible credit badge or link back to labs.mixiuh.online.",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 2: SECCION 01 · VIDEOS Y LABORATORIOS (EP01 – EP04) — 100% OPAQUE PIXEL UI
         ===================================================================== */}
      {mainView === "dossiers" && (
        <main className="flex-1 py-8 sm:py-10">
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
                <h1 className="font-display text-xl sm:text-2xl font-black text-white">
                  {lang === "es"
                    ? "Bitacora de Benchmarks, Dossiers Tecnicos y Pruebas en Vivo (EP01 – EP04)"
                    : "Benchmark Log, Technical Dossiers & Live Tests (EP01 – EP04)"}
                </h1>
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
                  <span>
                    {lang === "es"
                      ? "SELECCIONA EL DISQUETE / LABORATORIO A INSPECCIONAR:"
                      : "SELECT THE FLOPPY DISK / LAB EPISODE TO INSPECT:"}
                  </span>
                </div>
                <span className="text-[#94A3B8]">3.5&quot; HD // ZERO-SHOT</span>
              </div>

              <div
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
                      setDossierEp("ep04");
                    }}
                    className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                      dossierEp === "ep04"
                        ? "bg-[#182235] border-[#00E5FF]"
                        : "bg-[#090B10] border-[#2A344B] hover:border-[#00E5FF]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-pixel text-[9px]">
                      <span className="px-1.5 py-0.5 bg-[#00E5FF] text-[#090B10] font-bold">
                        DISK 04 · NUEVO
                      </span>
                      <span className="text-[#10B981]">
                        3-2-1 · $1.54 vs $29.94
                      </span>
                    </div>
                    <div className="font-display text-sm font-black text-white mt-2 truncate">
                      Escalera Claude: Haiku vs Sonnet vs Opus
                    </div>
                  </button>
                )}

                {released.ep03 && (
                  <button
                    onClick={() => {
                      playSfx("cartridgeInsert");
                      setDossierEp("ep03");
                    }}
                    className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                      dossierEp === "ep03"
                        ? "bg-[#182235] border-[#10B981]"
                        : "bg-[#090B10] border-[#2A344B] hover:border-[#10B981]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-pixel text-[9px]">
                      <span className="px-1.5 py-0.5 bg-[#10B981] text-[#090B10] font-bold">
                        DISK 03
                      </span>
                      <span className="text-[#FFD100]">4-2 · 276m vs 302m</span>
                    </div>
                    <div className="font-display text-sm font-black text-white mt-2 truncate">
                      Argon High Sin Kit vs. Superpowers Kit
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    playSfx("cartridgeInsert");
                    handleEpisodeChange("ep02");
                  }}
                  className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                    dossierEp === "ep02"
                      ? "bg-[#182235] border-[#A855F7]"
                      : "bg-[#090B10] border-[#2A344B] hover:border-[#A855F7]"
                  }`}
                >
                  <div className="flex items-center justify-between font-pixel text-[9px]">
                    <span className="px-1.5 py-0.5 bg-[#A855F7] text-white font-bold">
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
                  className={`p-3.5 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                    dossierEp === "ep01"
                      ? "bg-[#182235] border-[#FFD100]"
                      : "bg-[#090B10] border-[#2A344B] hover:border-[#FFD100]"
                  }`}
                >
                  <div className="flex items-center justify-between font-pixel text-[9px]">
                    <span className="px-1.5 py-0.5 bg-[#FFD100] text-[#090B10] font-bold">
                      DISK 01
                    </span>
                    <span className="text-[#94A3B8]">10-0 · 55m vs 94m</span>
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
                        <span className="text-[#34D399]">Haiku ($1.54)</span> vs.{" "}
                        <span className="text-[#FBBF24]">Sonnet ($12.22)</span>{" "}
                        vs.{" "}
                        <span className="text-[#B794F6]">Opus ($29.94)</span>
                      </>
                    ) : (
                      <>
                        The Full Claude 5.5 Ladder:{" "}
                        <span className="text-[#34D399]">Haiku ($1.54)</span> vs.{" "}
                        <span className="text-[#FBBF24]">Sonnet ($12.22)</span>{" "}
                        vs.{" "}
                        <span className="text-[#B794F6]">Opus ($29.94)</span>
                      </>
                    )}
                  </h1>

                  <p className="text-sm sm:text-base text-[#8FA3B8] leading-relaxed max-w-4xl">
                    {lang === "es"
                      ? "Enfrentamos a los 3 niveles de Claude 5.5 en 18 ejecuciones aisladas (6 retos extremos x 3 modelos). Opus 5.5 gano 3 puntos en fisica multicapa y shaders cientificos (Rover Verlet, Bio-Red Tokio GPU y Puente XPBD), Sonnet 5.5 gano 2 puntos en los retos finales (Path Tracer WebGL2 a 29 FPS vs 15 FPS de Opus y Consola Retro CHIP-8 con Pong en vivo mientras Opus olvido ensamblar la ROM), y Haiku 5.5 gano 1 punto historico al construir el Estudio Acido 3D a 61 FPS por solo $0.21 USD (24 veces mas barato que Opus)."
                      : "We pitted all 3 tiers of Claude 5.5 across 18 isolated runs (6 extreme challenges x 3 models). Opus 5.5 won 3 points on multi-pass physics and scientific shaders (Verlet Rover, Tokyo GPU Bio-Network, and XPBD Bridge), Sonnet 5.5 won 2 points in the final challenges (WebGL2 Path Tracer at 29 FPS vs Opus's 15 FPS and Retro CHIP-8 Console booting live Pong while Opus left a 0-byte ROM), and Haiku 5.5 won 1 historic ROI point by building a 61 FPS 3D Acid Studio for $0.21 USD (24x cheaper than Opus)."}
                  </p>

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
                        CLAUDE HAIKU 5.5 (6 RETOS)
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        ${EP04_BENCHMARK_TOTALS.haiku_usd.toFixed(2)}{" "}
                        <span className="text-sm text-[#10B981]">
                          ({EP04_BENCHMARK_TOTALS.haiku_min}m)
                        </span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                        19.4x mas barato que Opus · 5/6 OK
                      </div>
                    </div>

                    <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
                      <div className="font-pixel text-[10px] text-[#FFD100] font-bold">
                        CLAUDE SONNET 5.5 (6 RETOS)
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        ${EP04_BENCHMARK_TOTALS.sonnet_usd.toFixed(2)}{" "}
                        <span className="text-sm text-[#FFD100]">
                          ({EP04_BENCHMARK_TOTALS.sonnet_min}m)
                        </span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                        2.45x mas barato que Opus · 5/6 OK
                      </div>
                    </div>

                    <div className="p-4 bg-[#090B10] border-2 border-[#A855F7] shadow-[4px_4px_0_#040508]">
                      <div className="font-pixel text-[10px] text-[#A855F7] font-bold">
                        CLAUDE OPUS 5.5 (6 RETOS)
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                        ${EP04_BENCHMARK_TOTALS.opus_usd.toFixed(2)}{" "}
                        <span className="text-sm text-[#A855F7]">
                          ({EP04_BENCHMARK_TOTALS.opus_min}m)
                        </span>
                      </div>
                      <div className="font-mono-hud text-xs text-[#94A3B8] mt-1">
                        8,900 lineas · 4.46M tokens · 5/6 OK
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
                              className={`p-3 border-2 text-left transition cursor-pointer shadow-[4px_4px_0_#040508] ${
                                active
                                  ? "bg-[#182235] border-[#00E5FF]"
                                  : "bg-[#111622] border-[#2A344B] hover:border-[#00E5FF]"
                              }`}
                            >
                              <div className="flex items-center justify-between font-pixel text-[9px]">
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
                            <div className="font-mono-hud text-xs font-bold text-[#22D3EE]">
                              {lang === "es" ? ch4.world_es : ch4.world_en} ·{" "}
                              {lang === "es"
                                ? ch4.winner_label_es
                                : ch4.winner_label_en}
                            </div>
                            <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
                              0{ch4.n}.{" "}
                              {lang === "es" ? ch4.name_es : ch4.name_en}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#8FA3B8] mt-1">
                              {lang === "es" ? ch4.sub_es : ch4.sub_en}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 font-mono-hud text-xs">
                            {(
                              [
                                {
                                  id: "triple" as const,
                                  label:
                                    lang === "es"
                                      ? "Comparativa Triple"
                                      : "3-Way Composite",
                                },
                                {
                                  id: "haiku" as const,
                                  label: `Haiku 5.5 ($${ch4.haiku.usd.toFixed(
                                    2
                                  )})`,
                                },
                                {
                                  id: "sonnet" as const,
                                  label: `Sonnet 5.5 ($${ch4.sonnet.usd.toFixed(
                                    2
                                  )})`,
                                },
                                {
                                  id: "opus" as const,
                                  label: `Opus 5.5 ($${ch4.opus.usd.toFixed(
                                    2
                                  )})`,
                                },
                                {
                                  id: "prompt" as const,
                                  label: "Prompt",
                                },
                              ]
                            ).map((m) => (
                              <button
                                key={m.id}
                                onClick={() => setEp04Mode(m.id)}
                                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                                  ep04Mode === m.id
                                    ? "bg-[#22D3EE] text-[#060B14]"
                                    : "bg-[#060B14] text-[#8FA3B8] hover:text-white border border-white/10"
                                }`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">
                          {ep04Mode === "triple" && (
                            <div className="space-y-4">
                              <img
                                src={ch4.vs_still}
                                alt={ch4.name_es}
                                className="w-full rounded-xl border border-white/15 shadow-lg"
                              />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-hud text-xs">
                                {(
                                  [
                                    {
                                      id: "haiku" as const,
                                      title: "CLAUDE HAIKU 5.5",
                                      col: "#34D399",
                                      data: ch4.haiku,
                                    },
                                    {
                                      id: "sonnet" as const,
                                      title: "CLAUDE SONNET 5.5",
                                      col: "#FBBF24",
                                      data: ch4.sonnet,
                                    },
                                    {
                                      id: "opus" as const,
                                      title: "CLAUDE OPUS 5.5",
                                      col: "#B794F6",
                                      data: ch4.opus,
                                    },
                                  ]
                                ).map((t) => (
                                  <div
                                    key={t.id}
                                    className="p-4 rounded-xl bg-[#060B14] border border-white/10 flex flex-col justify-between gap-3"
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
                                      <div className="text-[#8FA3B8] mt-0.5">
                                        {t.data.fps} · {t.data.tok} tok
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setEp04Mode(t.id)}
                                      className="w-full py-2 rounded-lg font-bold text-[#060B14] hover:brightness-110 transition cursor-pointer"
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
                            <div className="space-y-3">
                              <div className="flex items-center justify-between font-mono-hud text-xs bg-[#060B14] px-4 py-2.5 rounded-xl border border-white/10">
                                <span className="text-[#5EEAD4] font-bold">
                                  {ep04Mode.toUpperCase()} 5.5 ·{" "}
                                  {ch4[ep04Mode].min} min · $
                                  {ch4[ep04Mode].usd.toFixed(2)} USD ·{" "}
                                  {ch4[ep04Mode].fps}
                                </span>
                                <a
                                  href={ch4[ep04Mode].demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white hover:text-[#22D3EE] inline-flex items-center gap-1"
                                >
                                  <span>
                                    {lang === "es"
                                      ? "Abrir en pestaña completa"
                                      : "Open in new tab"}
                                  </span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              <iframe
                                src={ch4[ep04Mode].demoUrl}
                                title={`${ch4.dir}-${ep04Mode}`}
                                className="w-full h-[620px] rounded-xl border border-white/15 bg-black"
                              />
                            </div>
                          )}

                          {ep04Mode === "prompt" && (
                            <div className="p-5 rounded-xl bg-[#060B14] border border-white/15 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-mono-hud text-xs font-bold text-[#22D3EE]">
                                  PROMPT EXACTO (1 INTENTO · CLAUDE CODE CLI)
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      ch4.prompt_verbatim
                                    );
                                    setCopiedEp04Prompt(true);
                                    setTimeout(
                                      () => setCopiedEp04Prompt(false),
                                      2000
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#11283F] text-white font-mono-hud text-xs inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  {copiedEp04Prompt ? (
                                    <Check className="w-3.5 h-3.5 text-[#34D399]" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                  <span>
                                    {copiedEp04Prompt ? "Copiado" : "Copiar"}
                                  </span>
                                </button>
                              </div>
                              <pre className="text-xs sm:text-sm text-[#F5F7FA] whitespace-pre-wrap font-mono-hud leading-relaxed">
                                {ch4.prompt_verbatim}
                              </pre>
                            </div>
                          )}

                          <div className="p-4 bg-[#090B10] border-2 border-[#00E5FF] text-xs sm:text-sm text-[#F5F7FA] leading-relaxed">
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
                          className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${
                            active
                              ? "bg-[#182235] border-[#10B981]"
                              : "bg-[#111622] border-[#2A344B] hover:border-[#10B981]"
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
          VIEW 3: SECCION 02 · DEL COMENTARIO AL CODIGO (#01 OVERFIT 3D)
         ===================================================================== */}
      {mainView === "comunidad" && released.cc01 && (
        <main id="comentario-al-codigo" className="flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Section 02 Header Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1D30] to-[#11283F] border border-[#FBBF24]/45 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FBBF24]/15 border border-[#FBBF24]/45 font-mono-hud text-[11px] font-bold text-[#FBBF24] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {lang === "es"
                      ? "SECCION 02 · DEL COMENTARIO AL CODIGO"
                      : "SECTION 02 · FROM COMMENT TO CODE"}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                  {lang === "es"
                    ? "Retos y Preguntas de la Comunidad Convertidos en Software 3D Real"
                    : "Community Questions & Challenges Turned Into Live 3D Software"}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
                {released.cc02 && (
                  <>
                    <button
                      onClick={() => setComunidadEp("all")}
                      className={`px-3 py-2 rounded-xl font-bold cursor-pointer ${
                        comunidadEp === "all"
                          ? "bg-[#FFD100] text-[#060B14]"
                          : "bg-[#060B14] border border-white/15 text-[#CBD5E1]"
                      }`}
                    >
                      {lang === "es" ? "Todos (2)" : "All (2)"}
                    </button>
                    <button
                      onClick={() => setComunidadEp("cc02")}
                      className={`px-3 py-2 rounded-xl font-bold cursor-pointer ${
                        comunidadEp === "cc02"
                          ? "bg-[#34D399] text-[#060B14]"
                          : "bg-[#060B14] border border-[#34D399]/50 text-[#34D399]"
                      }`}
                    >
                      {lang === "es"
                        ? "#02 ROBLOX 3D (3 Gigantes + Bonus)"
                        : "#02 3D ROBLOX (3 Giants + Bonus)"}
                    </button>
                    <button
                      onClick={() => setComunidadEp("cc01")}
                      className={`px-3 py-2 rounded-xl font-bold cursor-pointer ${
                        comunidadEp === "cc01"
                          ? "bg-[#FBBF24] text-[#060B14]"
                          : "bg-[#060B14] border border-[#FBBF24]/50 text-[#FBBF24]"
                      }`}
                    >
                      #01 OVERFIT Studio 3D (@tenito03)
                    </button>
                  </>
                )}
                <button
                  onClick={() => navigateToView("dossiers", "ep04")}
                  className="px-3.5 py-2 rounded-xl bg-[#060B14] border border-[#34D399]/40 text-[#34D399] hover:bg-[#11283F] font-bold cursor-pointer"
                >
                  {lang === "es"
                    ? "Ir a Videos / Laboratorios →"
                    : "Go to Videos / Labs →"}
                </button>
              </div>
            </div>

            {/* CC02: 3D ROBLOX CHALLENGE (GEMINI 4 ARGON HIGH vs CLAUDE OPUS 5.5 HIGH vs GPT-6 ASTRA HIGH) */}
            {released.cc02 && (comunidadEp === "all" || comunidadEp === "cc02") && (
              <div className="rounded-2xl bg-[#0B1D30] border-2 border-[#34D399]/55 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="px-3.5 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/50 font-mono-hud text-xs font-bold text-[#34D399]">
                    {lang === "es"
                      ? "SERIE DEL COMENTARIO AL CODIGO #02 · RETO ROBLOX 3D (3 GIGANTES EN HIGH)"
                      : "FROM COMMENT TO CODE SERIES #02 · 3D ROBLOX CHALLENGE (3 GIANTS IN HIGH)"}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="/demos/cc02-roblox/gpt-6-astra.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#34D399] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>GPT-6 Astra High ($1.11 · 61 FPS)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="/demos/cc02-roblox/gemini-4-argon.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#22D3EE] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Gemini 4 Argon High ($0.32 · 60 FPS)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="/demos/cc02-roblox/claude-opus-5.5.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#060B14] border border-[#B794F6]/50 text-[#B794F6] font-mono-hud text-xs font-bold hover:bg-[#11283F] transition inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Claude Opus 5.5 High ($9.91 · Sin 3D)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#B794F6] text-[#060B14] font-mono-hud text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === "es" ? "Bonus: Opus 5.5 Reparado (1 Línea · 60 FPS)" : "Bonus: Opus 5.5 Fixed (1 Line · 60 FPS)"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                  {lang === "es"
                    ? "Reto de Suscriptor en IG: Juego Tipo ROBLOX 3D Completo en 1 Intento — Gemini 4 Argon High vs. Claude Opus 5.5 High vs. GPT-6 Astra High"
                    : "IG Subscriber Challenge: Complete 3D ROBLOX Engine in 1 Shot — Gemini 4 Argon High vs. Claude Opus 5.5 High vs. GPT-6 Astra High"}
                </h1>

                <p className="text-sm sm:text-base text-[#C4D3E3] leading-relaxed">
                  {lang === "es"
                    ? "Pusimos a competir a los tres modelos de inteligencia artificial mas potentes del mundo en modo de maximo razonamiento (HIGH): Gemini 4 Argon High, Claude Opus 5.5 High y GPT-6 Astra High. Los tres recibieron exactamente la misma instruccion en un solo intento: crear un circuito de saltos tipo Roblox en 3D con diez islas en el cielo, personaje cuadrado que se desarma al caer, seis robots corriendo juntos con chat en vivo y un modo constructor estilo Roblox Studio 3D a 60 cuadros por segundo."
                    : "We put the three most powerful AI models in the world head-to-head in maximum reasoning (HIGH) mode: Gemini 4 Argon High, Claude Opus 5.5 High, and GPT-6 Astra High. All three received the exact same instruction in a single attempt: build a complete 3D Roblox-style game with a ten-island sky obstacle course, blocky character ragdoll physics, six robot players racing with live chat, and a live 3D Roblox Studio builder mode at 60 frames per second."}
                </p>

                {/* Telemetry Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#060B14] border border-[#34D399]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#34D399]">
                      MARCADOR TRIPLE (3 RONDAS)
                    </div>
                    <div className="font-display text-2xl font-black text-white mt-1">
                      2 - 1 - 0
                    </div>
                    <div className="font-mono-hud text-[11px] text-[#94A8BE] mt-1">
                      Astra 2 pts · Argon 1 pt · Opus 0 pts
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#060B14] border border-[#34D399]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#34D399]">
                      1º GPT-6 ASTRA HIGH
                    </div>
                    <div className="font-display text-2xl font-black text-white mt-1">
                      18.9m · $1.11 USD
                    </div>
                    <div className="font-mono-hud text-[11px] text-[#34D399] mt-1">
                      4,727 Lín · 61 FPS · Relieve 3D + Chat 3D
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#060B14] border border-[#22D3EE]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#22D3EE]">
                      2º GEMINI 4 ARGON HIGH
                    </div>
                    <div className="font-display text-2xl font-black text-white mt-1">
                      27.2m · $0.32 USD
                    </div>
                    <div className="font-mono-hud text-[11px] text-[#22D3EE] mt-1">
                      2,578 Lín · 60 FPS · Mejor Modo Studio 3D
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#060B14] border border-[#FB7185]/50">
                    <div className="font-mono-hud text-[11px] font-bold text-[#FB7185]">
                      3º CLAUDE OPUS 5.5 HIGH
                    </div>
                    <div className="font-display text-2xl font-black text-white mt-1">
                      55.1m · $9.91 USD
                    </div>
                    <div className="font-mono-hud text-[11px] text-[#FB7185] mt-1">
                      2,413 Lín · 4.53M tokens · Pantalla 3D Negra
                    </div>
                  </div>
                </div>

                {/* Interactive Simulator Switcher */}
                <div className="rounded-2xl bg-[#060B14] border-2 border-[#34D399]/50 overflow-hidden shadow-2xl">
                  <div className="px-4 py-3 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-hud text-xs font-bold text-white">
                      {lang === "es"
                        ? "SIMULADOR ROBLOX 3D EN VIVO · ALTERNA ENTRE LOS 3 MODELOS O PRUEBA EL MODO ROBLOX STUDIO 3D"
                        : "LIVE 3D ROBLOX SIMULATOR · SWITCH BETWEEN ALL 3 MODELS OR TEST LIVE 3D ROBLOX STUDIO MODE"}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono-hud text-xs">
                      <button
                        onClick={() => setCc02Model("astra")}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition ${
                          cc02Model === "astra"
                            ? "bg-[#34D399] text-[#060B14]"
                            : "bg-[#060B14] text-[#34D399] border border-[#34D399]/40"
                        }`}
                      >
                        GPT-6 Astra High (18.9m · 4,727 Lín)
                      </button>
                      <button
                        onClick={() => setCc02Model("argon")}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition ${
                          cc02Model === "argon"
                            ? "bg-[#22D3EE] text-[#060B14]"
                            : "bg-[#060B14] text-[#22D3EE] border border-[#22D3EE]/40"
                        }`}
                      >
                        Gemini 4 Argon High ($0.32 · 60 FPS)
                      </button>
                      <button
                        onClick={() => setCc02Model("opus")}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition ${
                          cc02Model === "opus"
                            ? "bg-[#B794F6] text-[#060B14]"
                            : "bg-[#060B14] text-[#B794F6] border border-[#B794F6]/40"
                        }`}
                      >
                        Claude Opus 5.5 High ($9.91 · Sin 3D)
                      </button>
                      <button
                        onClick={() => setCc02Model("opus_fixed")}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition ${
                          cc02Model === "opus_fixed"
                            ? "bg-[#F472B6] text-[#060B14]"
                            : "bg-[#060B14] text-[#F472B6] border border-[#F472B6]/40"
                        }`}
                      >
                        {lang === "es" ? "Bonus: Opus 5.5 Reparado (1 Línea)" : "Bonus: Opus 5.5 Fixed (1 Line)"}
                      </button>
                      <button
                        onClick={() => setCc02Model("triple")}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition ${
                          cc02Model === "triple"
                            ? "bg-[#FBBF24] text-[#060B14]"
                            : "bg-[#060B14] text-[#FBBF24] border border-[#FBBF24]/40"
                        }`}
                      >
                        {lang === "es" ? "Comparativa Triple" : "Triple View"}
                      </button>
                      <button
                        onClick={() => setCc02Model("prompt")}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition ${
                          cc02Model === "prompt"
                            ? "bg-[#00E5FF] text-[#060B14]"
                            : "bg-[#060B14] text-[#00E5FF] border border-[#00E5FF]/40"
                        }`}
                      >
                        {lang === "es"
                          ? "Prompt + Autopsia Línea 1062"
                          : "Prompt + Line 1062 Autopsy"}
                      </button>
                    </div>
                  </div>

                  {cc02Model === "prompt" ? (
                    <div className="p-5 sm:p-6 bg-[#060B14] space-y-5">
                      <div className="p-4 rounded-xl bg-[#0B1D30] border border-[#F472B6]/50 space-y-3">
                        <div className="font-mono-hud text-xs font-bold text-[#F472B6]">
                          {lang === "es"
                            ? "AUTOPSIA FORENSE LÍNEA 1062 (CLAUDE OPUS 5.5 HIGH) · EL CARÁCTER 'z' QUE APAGÓ UN MUNDO 3D DE $9.91 USD"
                            : "FORENSIC AUTOPSY LINE 1062 (CLAUDE OPUS 5.5 HIGH) · THE 'z' CHARACTER THAT BLACKED OUT A $9.91 USD 3D WORLD"}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 font-mono-hud text-xs">
                          <div className="p-3.5 rounded-lg bg-[#04060A] border border-[#FB7185]/50">
                            <div className="text-[#FB7185] font-bold mb-1.5">
                              {lang === "es"
                                ? "ORIGINAL ZERO-SHOT (Línea 1062 · Crash Three.js)"
                                : "ORIGINAL ZERO-SHOT (Line 1062 · Three.js Crash)"}
                            </div>
                            <pre className="text-[#F5F7FA] whitespace-pre-wrap">
{`const idx = axis === 0 ? 0 : axis === 1 ? 1 : 'z';
pos.setComponent(idx, val);
// Error: index is out of range: z`}
                            </pre>
                          </div>
                          <div className="p-3.5 rounded-lg bg-[#04060A] border border-[#34D399]/50">
                            <div className="text-[#34D399] font-bold mb-1.5">
                              {lang === "es"
                                ? "BONUS REPARADO (1 Carácter: 'z' -> 2 · 60 FPS)"
                                : "REPAIRED BONUS (1 Character: 'z' -> 2 · 60 FPS)"}
                            </div>
                            <pre className="text-[#F5F7FA] whitespace-pre-wrap">
{`const idx = axis === 0 ? 0 : axis === 1 ? 1 : 2;
pos.setComponent(idx, val);
// Desbloquea 10 islas Obby, Studio 3D y bots a 60 FPS`}
                            </pre>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0B1D30] border border-[#00E5FF]/40 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-hud text-xs font-bold text-[#00E5FF]">
                            {lang === "es"
                              ? "PROMPT EXACTO (1 SOLO INTENTO PARA LAS 3 ETAPAS · MODO HIGH)"
                              : "VERBATIM PROMPT (1 SINGLE ATTEMPT FOR ALL 3 STAGES · HIGH MODE)"}
                          </span>
                          <button
                            onClick={() => {
                              const promptText = `Construye en UN UNICO ARCHIVO HTML autocontenido (index.html) un motor y juego 3D completo tipo ROBLOX ("MixiuhBlox 3D: Obby + Studio + Bot Lobby") a 60 FPS con Three.js r128:\n1. Circuito Obby 3D de 10 Islas en el Cielo + Personaje Blocky articulado de 6 piezas con desarme Ragdoll al caer a la lava.\n2. Modo Constructor Roblox Studio 3D en Vivo (colocar, mover, escalar, pintar bloques, rampas, trampolines, spinners y lava con previsualización en la cuadrícula).\n3. Multijugador Simulado con 6 Jugadores Bots IA corriendo el circuito en vivo, globos de chat 3D sobre sus cabezas y tabla de líderes.`;
                              navigator.clipboard.writeText(promptText);
                              setCopiedCc02Prompt(true);
                              setTimeout(() => setCopiedCc02Prompt(false), 2000);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#060B14] text-white font-mono-hud text-xs inline-flex items-center gap-1.5 cursor-pointer border border-white/15"
                          >
                            {copiedCc02Prompt ? (
                              <Check className="w-3.5 h-3.5 text-[#34D399]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedCc02Prompt ? "Copiado" : "Copiar Prompt"}</span>
                          </button>
                        </div>
                        <pre className="text-xs sm:text-sm text-[#F5F7FA] whitespace-pre-wrap font-mono-hud leading-relaxed">
{`Construye en UN UNICO ARCHIVO HTML autocontenido (index.html) un motor y juego 3D completo tipo ROBLOX ("MixiuhBlox 3D: Obby + Studio + Bot Lobby") a 60 FPS con Three.js r128:
1. Circuito Obby 3D de 10 Islas en el Cielo + Personaje Blocky articulado de 6 piezas con desarme Ragdoll al caer a la lava.
2. Modo Constructor Roblox Studio 3D en Vivo (colocar, mover, escalar, pintar bloques, rampas, trampolines, spinners y lava con previsualización en la cuadrícula).
3. Multijugador Simulado con 6 Jugadores Bots IA corriendo el circuito en vivo, globos de chat 3D sobre sus cabezas y tabla de líderes.`}
                        </pre>
                      </div>
                    </div>
                  ) : cc02Model === "triple" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/15 bg-[#04060A]">
                      <div>
                        <div className="px-3 py-2 bg-[#060B14] text-[#22D3EE] font-mono-hud text-[11px] font-bold flex justify-between">
                          <span>GEMINI 4 ARGON HIGH (27.2m · $0.32 eq)</span>
                          <span>60 FPS · STUDIO WIN</span>
                        </div>
                        <iframe
                          src="/demos/cc02-roblox/gemini-4-argon.html"
                          title="Roblox 3D - Gemini 4 Argon High"
                          className="w-full h-[640px] border-0 bg-[#04060A]"
                        />
                      </div>
                      <div>
                        <div className="px-3 py-2 bg-[#060B14] text-[#FB7185] font-mono-hud text-[11px] font-bold flex justify-between">
                          <span>CLAUDE OPUS 5.5 HIGH (55.1m · $9.91 USD)</span>
                          <span>3D CRASH (index z)</span>
                        </div>
                        <iframe
                          src="/demos/cc02-roblox/claude-opus-5.5.html"
                          title="Roblox 3D - Claude Opus 5.5 High"
                          className="w-full h-[640px] border-0 bg-[#04060A]"
                        />
                      </div>
                      <div>
                        <div className="px-3 py-2 bg-[#060B14] text-[#34D399] font-mono-hud text-[11px] font-bold flex justify-between">
                          <span>GPT-6 ASTRA HIGH (18.9m · $1.11 USD)</span>
                          <span>61 FPS · GANADOR 2-1</span>
                        </div>
                        <iframe
                          src="/demos/cc02-roblox/gpt-6-astra.html"
                          title="Roblox 3D - GPT-6 Astra High"
                          className="w-full h-[640px] border-0 bg-[#04060A]"
                        />
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={
                        cc02Model === "astra"
                          ? "/demos/cc02-roblox/gpt-6-astra.html"
                          : cc02Model === "argon"
                          ? "/demos/cc02-roblox/gemini-4-argon.html"
                          : cc02Model === "opus_fixed"
                          ? "/demos/cc02-roblox/claude-opus-5.5-fixed.html"
                          : "/demos/cc02-roblox/claude-opus-5.5.html"
                      }
                      title={`Roblox 3D - ${cc02Model}`}
                      className="w-full h-[780px] border-0 bg-[#04060A]"
                    />
                  )}
                </div>

                {/* Single-Attempt Total Time & 3-Stage Evaluation Table */}
                <div className="rounded-xl bg-[#060B14] border border-white/15 overflow-hidden">
                  <div className="px-4 py-3 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-hud text-xs font-bold text-[#34D399]">
                      {lang === "es"
                        ? "TABLA DE TIEMPO TOTAL (1 SOLO INTENTO) Y EVALUACIÓN DE LAS 3 ETAPAS + BONUS EXTENDIDO"
                        : "SINGLE-ATTEMPT TOTAL TIME & 3-STAGE EVALUATION MATRIX + EXTENDED BONUS"}
                    </span>
                    <span className="font-mono-hud text-[11px] text-[#CBD5E1]">
                      {lang === "es"
                        ? "Cada IA construyó las 3 etapas dentro de una única corrida continua"
                        : "Each AI built all 3 stages in a single continuous run"}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono-hud text-xs">
                      <thead>
                        <tr className="bg-[#04060A] border-b border-white/10 text-[#94A3B8]">
                          <th className="py-3 px-4">
                            {lang === "es" ? "Etapa / Métrica" : "Stage / Metric"}
                          </th>
                          <th className="py-3 px-4 text-[#22D3EE]">
                            Gemini 4 Argon High
                          </th>
                          <th className="py-3 px-4 text-[#B794F6]">
                            Claude Opus 5.5 High
                          </th>
                          <th className="py-3 px-4 text-[#34D399]">
                            GPT-6 Astra High
                          </th>
                          <th className="py-3 px-4">
                            {lang === "es" ? "Ganador" : "Winner"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        <tr className="bg-[#0B1D30]/50 font-bold">
                          <td className="py-3 px-4 text-[#FFD100]">
                            {lang === "es"
                              ? "TIEMPO Y COSTO TOTAL (1 INTENTO PARA LAS 3 ETAPAS)"
                              : "TOTAL TIME & COST (1 SINGLE ATTEMPT FOR ALL 3 STAGES)"}
                          </td>
                          <td className="py-3 px-4 text-[#22D3EE]">
                            27.2 min · $0.32 USD · 2,578 Lín
                          </td>
                          <td className="py-3 px-4 text-[#FB7185]">
                            55.1 min · $9.91 USD · 2,413 Lín
                          </td>
                          <td className="py-3 px-4 text-[#34D399]">
                            18.9 min · $1.11 USD · 4,727 Lín
                          </td>
                          <td className="py-3 px-4 text-[#34D399]">
                            ASTRA (1.44x vs Argon)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-white">
                            01. Circuito Obby 3D (10 Islas + Ragdoll)
                          </td>
                          <td className="py-3 px-4 text-[#CBD5E1]">
                            60 FPS · 10 Etapas + Ragdoll
                          </td>
                          <td className="py-3 px-4 text-[#FB7185]">
                            Sin 3D (Error línea 1062)
                          </td>
                          <td className="py-3 px-4 text-[#34D399] font-bold">
                            61 FPS · Relieve Studs 3D + 10 Islas
                          </td>
                          <td className="py-3 px-4 text-[#34D399] font-bold">
                            GPT-6 ASTRA (1-0-0)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-white">
                            02. Modo Constructor Roblox Studio 3D
                          </td>
                          <td className="py-3 px-4 text-[#22D3EE] font-bold">
                            60 FPS · Molde Fantasma 3D en Vivo
                          </td>
                          <td className="py-3 px-4 text-[#FB7185]">
                            Sin Escena 3D
                          </td>
                          <td className="py-3 px-4 text-[#CBD5E1]">
                            61 FPS · Inspector + Export JSON
                          </td>
                          <td className="py-3 px-4 text-[#22D3EE] font-bold">
                            ARGON HIGH (1-1-0)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-white">
                            03. Multijugador (6 Robots IA + Chat)
                          </td>
                          <td className="py-3 px-4 text-[#CBD5E1]">
                            60 FPS · 6 Robots IA + Chat
                          </td>
                          <td className="py-3 px-4 text-[#FB7185]">
                            Solo Interfaz 2D
                          </td>
                          <td className="py-3 px-4 text-[#34D399] font-bold">
                            61 FPS · 6 Bots + Globos Chat 3D
                          </td>
                          <td className="py-3 px-4 text-[#34D399] font-bold">
                            GPT-6 ASTRA (2-1-0)
                          </td>
                        </tr>
                        <tr className="bg-[#B794F6]/10">
                          <td className="py-3 px-4 text-[#F472B6] font-bold">
                            {lang === "es"
                              ? "BONUS EXTENDIDO: Opus 5.5 Reparado (1 Carácter)"
                              : "EXTENDED BONUS: Opus 5.5 Fixed (1 Character)"}
                          </td>
                          <td className="py-3 px-4 text-[#94A3B8]">—</td>
                          <td className="py-3 px-4 text-[#F472B6] font-bold">
                            60 FPS · 10 Islas + Flechas RGB + 8 Bots (axis &apos;z&apos; → 2)
                          </td>
                          <td className="py-3 px-4 text-[#94A3B8]">—</td>
                          <td className="py-3 px-4 text-[#F472B6] font-bold">
                            {lang === "es" ? "EXTRA SIN PUNTO" : "EXHIBITION BONUS"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(comunidadEp === "all" || comunidadEp === "cc01") && (
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
            )}
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 4: SECCION 03 · RADAR MIXIUH NOTICIAS IA (#01 GEMINI 4 CARBON)
         ===================================================================== */}
      {mainView === "noticias" && released.carbon01 && (
        <main id="noticias" className="flex-1 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsSection
              lang={lang}
              onOpenLabEpisode={(ep) => navigateToView("dossiers", ep)}
              onOpenArena={() => navigateToView("arena")}
            />
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 5: ARENA INTERACTIVA (STRICTLY RELEASED DEMOS ONLY)
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
                {released.ep04 && (
                  <button
                    onClick={() => setArenaMode("ep04")}
                    className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer ${
                      arenaMode === "ep04"
                        ? "bg-[#22D3EE] text-[#060B14]"
                        : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                    }`}
                  >
                    EP04: Escalera Claude 5.5 (18)
                  </button>
                )}
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
                    arenaMode === "ep02_ep01" && activeEpisode === "ep02"
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
                    arenaMode === "ep02_ep01" && activeEpisode === "ep01"
                      ? "bg-[#22A2DD] text-[#060B14]"
                      : "bg-[#060B14] text-[#8FA3B8] hover:text-white"
                  }`}
                >
                  EP01: Argon vs 3.8 Flash (20 + Bonus)
                </button>
                {released.cc02 && (
                  <button
                    onClick={() => {
                      setComunidadEp("cc02");
                      navigateToView("comunidad");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#34D399]/20 border border-[#34D399]/60 text-[#34D399] font-bold cursor-pointer"
                  >
                    CC02: ROBLOX 3D (3 Gigantes + Bonus)
                  </button>
                )}
                {released.cc01 && (
                  <button
                    onClick={() => {
                      setComunidadEp("cc01");
                      navigateToView("comunidad");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] font-bold cursor-pointer"
                  >
                    CC01: OVERFIT Studio 3D (1)
                  </button>
                )}
              </div>
            </div>
          </div>

          {released.ep04 && arenaMode === "ep04" ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {EP04_CHALLENGES.map((ch) => (
                  <button
                    key={ch.n}
                    onClick={() => setEp04ChallengeN(ch.n)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      ep04ChallengeN === ch.n
                        ? "bg-[#11283F] border-[#22D3EE]"
                        : "bg-[#0B1D30] border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-hud text-[10px]">
                      <span className="text-[#5EEAD4] font-bold">R0{ch.n}</span>
                      <span
                        className={
                          ch.winner === "haiku"
                            ? "text-[#34D399] font-bold"
                            : ch.winner === "sonnet"
                            ? "text-[#FBBF24] font-bold"
                            : "text-[#B794F6] font-bold"
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
                return (
                  <div className="rounded-2xl bg-[#060B14] border-2 border-[#22D3EE] overflow-hidden shadow-2xl">
                    <div className="p-4 bg-[#11283F] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-black text-white">
                          EP04 Reto 0{cur.n}:{" "}
                          {lang === "es" ? cur.name_es : cur.name_en}
                        </h3>
                        <p className="text-xs text-[#CBD5E1] mt-1">
                          {lang === "es" ? cur.verdict_es : cur.verdict_en}
                        </p>
                      </div>
                      <button
                        onClick={() => navigateToView("dossiers", "ep04")}
                        className="px-3.5 py-1.5 bg-[#22D3EE] text-[#060B14] font-mono-hud text-xs font-bold cursor-pointer border-2 border-[#090B10] shadow-[3px_3px_0_#040508]"
                      >
                        {lang === "es"
                          ? "Ver Dossier Completo EP04 →"
                          : "Open Full EP04 Dossier →"}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                      {/* Column 1: Claude Haiku 5.5 */}
                      <div className="flex flex-col">
                        <div className="px-3 py-2 bg-[#090B10] border-b border-white/10 flex items-center justify-between gap-2 font-mono-hud text-xs">
                          <span className="font-pixel text-[10px] text-[#34D399] font-bold">
                            CLAUDE HAIKU 5.5 (${cur.haiku.usd} · {cur.haiku.min}m)
                          </span>
                          <a
                            href={haikuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-[#131824] text-[#34D399] border border-[#34D399]/50 text-[10px] font-bold"
                          >
                            {cur.haiku.fps} ↗
                          </a>
                        </div>
                        <iframe
                          src={haikuUrl}
                          title={`Haiku ${cur.dir}`}
                          className="w-full h-[520px] border-0 bg-[#04060A]"
                        />
                      </div>

                      {/* Column 2: Claude Sonnet 5.5 */}
                      <div className="flex flex-col">
                        <div className="px-3 py-2 bg-[#090B10] border-b border-white/10 flex items-center justify-between gap-2 font-mono-hud text-xs">
                          <span className="font-pixel text-[10px] text-[#FFD100] font-bold">
                            CLAUDE SONNET 5.5 (${cur.sonnet.usd} · {cur.sonnet.min}m)
                          </span>
                          <a
                            href={sonnetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-[#131824] text-[#FFD100] border border-[#FFD100]/50 text-[10px] font-bold"
                          >
                            {cur.sonnet.fps} ↗
                          </a>
                        </div>
                        <iframe
                          src={sonnetUrl}
                          title={`Sonnet ${cur.dir}`}
                          className="w-full h-[520px] border-0 bg-[#04060A]"
                        />
                      </div>

                      {/* Column 3: Claude Opus 5.5 */}
                      <div className="flex flex-col">
                        <div className="px-3 py-2 bg-[#090B10] border-b border-white/10 flex items-center justify-between gap-2 font-mono-hud text-xs">
                          <span className="font-pixel text-[10px] text-[#A855F7] font-bold">
                            CLAUDE OPUS 5.5 (${cur.opus.usd} · {cur.opus.min}m)
                          </span>
                          <a
                            href={opusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-[#131824] text-[#A855F7] border border-[#A855F7]/50 text-[10px] font-bold"
                          >
                            {cur.opus.fps} ↗
                          </a>
                        </div>
                        <iframe
                          src={opusUrl}
                          title={`Opus ${cur.dir}`}
                          className="w-full h-[520px] border-0 bg-[#04060A]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : released.ep03 && arenaMode === "ep03" ? (
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
          VIEW 6: FORO TECNICO, AUTOPSIAS & GLOSARIO (53 TERMINOS)
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

      {/* =====================================================================
          VIEW 7: MIXIUH PIXEL UI v2.0 (OPEN SOURCE LIBRARY & PLAYGROUND)
         ===================================================================== */}
      {mainView === "pixelui" && (
        <main className="flex-1">
          <PixelUiShowcase
            lang={lang}
            cursorStyle={cursorStyle}
            onChangeCursor={setCursorStyle}
            ambientMode={ambientMode}
            onChangeAmbient={setAmbientMode}
          />
        </main>
      )}

      {/* PIXEL-ART HARDWARE FOOTER WITH SOCIAL BAR & OPEN-SOURCE ATTRIBUTION BADGE */}
      <footer className="py-8 border-t-3 border-[#FFD100] bg-[#090B10] text-xs font-mono-hud text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Compact Social Media Redirect Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2A344B]">
            <div className="flex items-center gap-2 font-pixel text-[10px] text-[#FFD100]">
              <PixelIcon name="share" size={14} color="#FFD100" />
              <span>
                {lang === "es"
                  ? "SIGUENOS EN TODAS LAS REDES DE MIXIUH LABS:"
                  : "FOLLOW MIXIUH LABS ACROSS ALL PLATFORMS:"}
              </span>
            </div>
            <PixelSocialBar compact />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <PixelCreditBadge variant="hardware" />
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
                Inicio
              </button>
              <button
                onClick={() => navigateToView("dossiers", "ep04")}
                className="text-[#10B981] hover:text-white font-bold cursor-pointer"
              >
                Videos / Laboratorios (EP01–EP04)
              </button>
              {released.cc01 && (
                <button
                  onClick={() => navigateToView("comunidad")}
                  className="text-[#FFD100] hover:text-white font-bold cursor-pointer"
                >
                  {released.cc02
                    ? "Del Comentario al Codigo (#01–#02)"
                    : "Del Comentario al Codigo (#01)"}
                </button>
              )}
              {released.carbon01 && (
                <button
                  onClick={() => navigateToView("noticias")}
                  className="text-[#00E5FF] hover:text-white font-bold cursor-pointer"
                >
                  Noticias IA (Gemini 4 Carbon)
                </button>
              )}
              <button
                onClick={() => navigateToView("pixelui")}
                className="text-[#FF3355] hover:text-white font-bold cursor-pointer"
              >
                Mixiuh Pixel UI (Gratis)
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
        </div>
      </footer>
      </div>
    </div>
  );
}
