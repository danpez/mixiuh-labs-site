import {
  EP04_BENCHMARK_TOTALS,
  EP04_CHALLENGES,
  type Ep04ChallengeData,
} from "@/data/ep04Data";

export type ForumCategory =
  | "all"
  | "benchmarks"
  | "autopsias"
  | "prompts"
  | "pipeline"
  | "propuestas";

export interface ForumComment {
  id: string;
  author: string;
  role: string;
  handle: string;
  createdAt: string;
  body_es: string;
  body_en: string;
  upvotes: number;
}

export interface ForumThread {
  id: string;
  slug: string;
  category: Exclude<ForumCategory, "all">;
  pinned?: boolean;
  badge_es: string;
  badge_en: string;
  title_es: string;
  title_en: string;
  excerpt_es: string;
  excerpt_en: string;
  author: string;
  authorRole_es: string;
  authorRole_en: string;
  createdAt: string;
  readTime: string;
  upvotes: number;
  views: number;
  episode?: "ep01" | "ep02" | "ep03" | "ep04" | "cc01" | "carbon01" | "cc02";
  relatedChallengeN?: number;
  tags: string[];
  codeComparison?: {
    title_es: string;
    title_en: string;
    // Panel labels carry no position tag: ForumSection adds [IZQUIERDA] /
    // [ARRIBA] (or the English tag) to match the panels' layout
    leftLabel_es?: string;
    leftLabel_en?: string;
    rightLabel_es?: string;
    rightLabel_en?: string;
    flashCode: string;
    argonCode: string;
    explanation_es: string;
    explanation_en: string;
  };
  content_es: string[];
  content_en: string[];
  comments: ForumComment[];
}

export interface Ep02Proposal {
  id: string;
  title_es: string;
  title_en: string;
  models: string;
  category_es: string;
  category_en: string;
  description_es: string;
  description_en: string;
  votes: number;
  status_es: string;
  status_en: string;
}

// EP04 dollar and minute figures quoted in the forum copy are read from ep04Data.ts,
// so the dossier and the proposal cards cannot drift from the benchmark table again.
function ep04Challenge(n: number): Ep04ChallengeData {
  const challenge = EP04_CHALLENGES.find((c) => c.n === n);
  if (!challenge) throw new Error(`ep04Data.ts has no challenge ${n}`);
  return challenge;
}
const usd = (value: number) => `$${value.toFixed(2)}`;
const EP04_T = EP04_BENCHMARK_TOTALS;
const EP04_R04 = ep04Challenge(4);
const EP04_R05 = ep04Challenge(5);
const EP04_R06 = ep04Challenge(6);

export const INITIAL_EP02_PROPOSALS: Ep02Proposal[] = [
  {
    id: "prop-cc01-overfit",
    title_es: "COMPLETADO EN DEL COMENTARIO AL CODIGO #01 (@tenito03): OVERFIT Studio 3D — 10 Diseños IA + Mockups 300 GSM",
    title_en: "COMPLETED IN COMMENT TO CODE #01 (@tenito03): OVERFIT Studio 3D — 10 AI Designs + 300 GSM Mockups",
    models: "Reto de @tenito03 -> OVERFIT Studio 3D",
    category_es: "Del Comentario al Codigo #01",
    category_en: "Comment to Code #01",
    description_es: "A partir del comentario de @tenito03 sobre la tela Verlet del EP02, esculpimos en Blender Cycles maniquies 3D de 300 GSM (Hombre, Mujer y Mesa) y lanzamos la coleccion satirica 'Guerra de Pesos' con 10 artes de IA y exportacion 4K.",
    description_en: "Triggered by @tenito03's comment on the EP02 Verlet cloth, we sculpted 300 GSM 3D mannequins in Blender Cycles (Male, Female, Flat-Lay) and launched the satirical 'Weight War' collection with 10 AI designs and 4K export.",
    votes: 296,
    status_es: "En Vivo · Comentario al Codigo",
    status_en: "Live · Comment to Code",
  },
  {
    id: "prop-argon-vs-gpt5",
    title_es: "Gemini 4 Argon (High) vs. GPT-5.4 (High) — 6 Motores de Ingenieria y Factura de Tokens",
    title_en: "Gemini 4 Argon (High) vs. GPT-5.4 (High) — 6 Engineering Engines & Token Bill",
    models: "Gemini 4 Argon vs GPT-5.4 High",
    category_es: "Duelo de Modelos Frontera",
    category_en: "Frontier Model Duel",
    description_es: "Despues de vencer 10-0 a Flash y 4-2 a Claude Opus 5.5, enfrentar a Gemini 4 Argon contra GPT-5.4 High midiendo tiempo real, FPS y costo exacto por millon de tokens.",
    description_en: "After beating Flash 10-0 and Claude Opus 5.5 4-2, pit Gemini 4 Argon against GPT-5.4 High auditing wall-clock latency, FPS, and exact token bill.",
    votes: 184,
    status_es: "Candidato EP05",
    status_en: "EP05 Candidate",
  },
  {
    id: "prop-emulador-chip8",
    title_es: `COMPLETADO EN EP04 (Reto 06): ${EP04_R06.name_es}`,
    title_en: `COMPLETED IN EP04 (Challenge 06): ${EP04_R06.name_en}`,
    models: "Haiku vs Sonnet vs Opus 5.5",
    category_es: "Arquitectura de Sistemas",
    category_en: "Systems Architecture",
    description_es: `Se ejecuto como Reto 06 del EP04 (Escalera Claude 5.5): Sonnet 5.5 (${usd(EP04_R06.sonnet.usd)}) y Haiku 5.5 (${usd(EP04_R06.haiku.usd)}) arrancaron jugando Pong a 60 FPS, mientras Opus 5.5 (${usd(EP04_R06.opus.usd)}, ${EP04_R06.opus.min} min) olvido ensamblar la ROM al iniciar (ROM: 0 B). Punto para Sonnet 5.5.`,
    description_en: `Run as EP04 Challenge 06 (Claude 5.5 Ladder): Sonnet 5.5 (${usd(EP04_R06.sonnet.usd)}) and Haiku 5.5 (${usd(EP04_R06.haiku.usd)}) booted straight into Pong at 60 FPS, while Opus 5.5 (${usd(EP04_R06.opus.usd)}, ${EP04_R06.opus.min} min) forgot to assemble its ROM on boot (ROM: 0 B). Point to Sonnet 5.5.`,
    votes: 156,
    status_es: "Publicado en EP04",
    status_en: "Published in EP04",
  },
  {
    id: "prop-raytracer-bvh",
    title_es: `COMPLETADO EN EP04 (Reto 05): ${EP04_R05.name_es}`,
    title_en: `COMPLETED IN EP04 (Challenge 05): ${EP04_R05.name_en}`,
    models: "Haiku vs Sonnet vs Opus 5.5",
    category_es: "GPU y Shaders Avanzados",
    category_en: "GPU & Advanced Shaders",
    description_es: `Se ejecuto como Reto 05 del EP04 (Escalera Claude 5.5): Sonnet 5.5 (${usd(EP04_R05.sonnet.usd)}, ${EP04_R05.sonnet.min} min) rindio 22 FPS con dispersion cromatica arcoiris y Denoiser A-Trous, casi 1.5 veces los 15 FPS de Opus 5.5 (${usd(EP04_R05.opus.usd)}, ${EP04_R05.opus.min} min). Punto para Sonnet 5.5.`,
    description_en: `Run as EP04 Challenge 05 (Claude 5.5 Ladder): Sonnet 5.5 (${usd(EP04_R05.sonnet.usd)}, ${EP04_R05.sonnet.min} min) hit 22 FPS with rainbow chromatic dispersion and an A-Trous denoiser, about 1.5x the 15 FPS of Opus 5.5 (${usd(EP04_R05.opus.usd)}, ${EP04_R05.opus.min} min). Point to Sonnet 5.5.`,
    votes: 129,
    status_es: "Publicado en EP04",
    status_en: "Published in EP04",
  },
  {
    id: "prop-argon-vs-claude",
    title_es: "COMPLETADO EN EP02: Gemini 4 Argon vs. Claude Opus 5.5 (Verlet, Navier-Stokes, Voxel, FM, Pinball)",
    title_en: "COMPLETED IN EP02: Gemini 4 Argon vs. Claude Opus 5.5 (Verlet, Navier-Stokes, Voxel, FM, Pinball)",
    models: "Ganador: Argon 4-2 ($6.26 vs $16.26)",
    category_es: "Completado · Ver Arriba",
    category_en: "Completed · Watch Above",
    description_es: "Propuesta ganadora de la comunidad ya ejecutada y publicada en YouTube 4K60: 6 retos extremos de fisica, 3D y audio con las 12 demos cargadas en la Arena Interactiva.",
    description_en: "Community-voted winner now live in 4K60 on YouTube: 6 extreme physics, 3D, and audio challenges with all 12 deliverables playable in the Interactive Arena.",
    votes: 248,
    status_es: "Publicado en EP02",
    status_en: "Published in EP02",
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: "thread-cc02-roblox-3-gigantes",
    slug: "del-comentario-al-codigo-02-roblox-3d-argon-vs-opus-vs-gpt-6-astra-bonus",
    category: "benchmarks",
    pinned: true,
    episode: "cc02",
    badge_es: "DEL COMENTARIO AL CODIGO #02 · RETO ROBLOX 3D (3 GIGANTES + BONUS)",
    badge_en: "FROM COMMENT TO CODE #02 · 3D ROBLOX CHALLENGE (3 GIANTS + BONUS)",
    title_es: "Juego Tipo ROBLOX 3D en 1 Intento: GPT-6 Astra High ($1.11) vs. Gemini 4 Argon High ($0.32) vs. Claude Opus 5.5 High ($9.91) + La Autopsia de la Linea 1062",
    title_en: "Zero-Shot 3D ROBLOX Engine: GPT-6 Astra High ($1.11) vs. Gemini 4 Argon High ($0.32) vs. Claude Opus 5.5 High ($9.91) + The Line 1062 Autopsy",
    excerpt_es: "Un suscriptor en Instagram pidio enfrentar a los 3 gigantes en modo HIGH haciendo un juego tipo ROBLOX 3D completo. GPT-6 Astra gano 2-1-0 en 18.9 min ($1.11 USD), Argon gano el modo Studio 3D por $0.32 USD (27.2 min) y Opus 5.5 ($9.91 USD, 55.1 min) rompio su escena 3D en la linea 1062 por pasar m.axis ('x'/'z') a setComponent(), error que reparamos en el Bonus Extendido.",
    excerpt_en: "An Instagram subscriber challenged us to pit the 3 Giants in HIGH mode building a full 3D ROBLOX game. GPT-6 Astra won 2-1-0 in 18.9 min ($1.11 USD), Argon won 3D Studio mode for $0.32 USD (27.2 min), and Opus 5.5 ($9.91 USD, 55.1 min) crashed its 3D scene on line 1062 by passing m.axis ('x'/'z') into setComponent(), which we unlocked in the Extended Bonus.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-31",
    readTime: "7 min",
    upvotes: 614,
    views: 5890,
    tags: ["Del Comentario al Codigo #02", "ROBLOX 3D", "GPT-6 Astra High", "Gemini 4 Argon High", "Claude Opus 5.5 High", "Autopsia Linea 1062"],
    codeComparison: {
      title_es: "Autopsia Forense Linea 1062 (Claude Opus 5.5 High): setComponent(m.axis) con 'x'/'z' apago un mundo 3D de 2,413 lineas ($9.91 USD)",
      title_en: "Forensic Autopsy Line 1062 (Claude Opus 5.5 High): setComponent(m.axis) with 'x'/'z' blacked out a 2,413-line 3D world ($9.91 USD)",
      leftLabel_es: "OPUS 5.5 ORIGINAL (55.1 MIN · $9.91 USD · CRASH 3D EN LINEA 1062)",
      leftLabel_en: "ORIGINAL OPUS 5.5 (55.1 MIN · $9.91 USD · LINE 1062 3D CRASH)",
      rightLabel_es: "BONUS EXTENDIDO REPARADO (1 LINEA CORREGIDA · 60 FPS DESBLOQUEADO)",
      rightLabel_en: "REPAIRED EXTENDED BONUS (1 LINE FIXED · 60 FPS UNLOCKED)",
      flashCode: `// demos/cc02-roblox/claude-opus-5.5.html (lineas 1059-1066)
function updateMovers(T) {
  for (const m of movers) {
    _v1.copy(m.p.pos);
    m.p.pos.setComponent(m.axis, m.base.getComponent(m.axis) + m.amp * Math.sin(m.freq * T + m.phase));
    m.p.delta.subVectors(m.p.pos, _v1);
    m.p.mesh.position.copy(m.p.pos); updateBounds(m.p);
  }
}`,
      argonCode: `// demos/cc02-roblox/claude-opus-5.5-fixed.html (lineas 1059-1066)
function updateMovers(T) {
  for (const m of movers) {
    _v1.copy(m.p.pos);
    m.p.pos[m.axis] = m.base[m.axis] + m.amp * Math.sin(m.freq * T + m.phase);
    m.p.delta.subVectors(m.p.pos, _v1);
    m.p.mesh.position.copy(m.p.pos); updateBounds(m.p);
  }
}`,
      explanation_es: "Claude Opus 5.5 High tardo 55.1 minutos y consumio 4.53 millones de tokens ($9.91 USD) para programar 2,413 lineas con un circuito Obby de 10 etapas, modo Studio 3D con flechas RGB y 8 bots con IA. Pero guardo m.axis como letra ('x' o 'z') y en la linea 1062 llamo a Vector3.setComponent(m.axis, ...), que en Three.js exige un indice numerico (0, 1 o 2), lanzando 'Error: index is out of range: z' en el primer cuadro. Al cambiar esa unica linea a m.p.pos[m.axis] = ... en el Bonus Extendido, todo el juego oculto cobro vida a 60 FPS.",
      explanation_en: "Claude Opus 5.5 High spent 55.1 minutes and 4.53M tokens ($9.91 USD) coding 2,413 lines with a 10-stage Obby course, 3D Studio mode with RGB gizmo arrows, and 8 AI bots. However, it stored m.axis as a property key ('x' or 'z') and on line 1062 called Vector3.setComponent(m.axis, ...), which in Three.js requires a numeric index (0, 1, or 2), throwing 'Error: index is out of range: z' on the first frame. Replacing that single line with m.p.pos[m.axis] = ... in the Extended Bonus unlocked the entire hidden game at 60 FPS."
    },
    content_es: [
      "Un comentario en Instagram nos pidio enfrentar a los tres modelos mas grandes del momento en modo HIGH construyendo un juego tipo ROBLOX 3D completo en un solo archivo HTML autocontenido: Gemini 4 Argon High, Claude Opus 5.5 High y GPT-6 Astra High.",
      "Importante sobre el Tiempo Total (1 Solo Intento): Cada modelo genero las 3 etapas evaluadas (01. Circuito Obby de 10 islas + Ragdoll, 02. Modo Roblox Studio 3D en vivo y 03. Multijugador con 6 robots IA y chat) dentro de una unica corrida continua: GPT-6 Astra High tardo 18.9 minutos en total ($1.11 USD, 4,727 lineas), Gemini 4 Argon High tardo 27.2 minutos en total ($0.32 USD, 2,578 lineas) y Claude Opus 5.5 High tardo 55.1 minutos en total ($9.91 USD, 2,413 lineas).",
      "1. Etapa 01 (Circuito Obby 3D de 10 Islas y Fisica Ragdoll): Punto para GPT-6 Astra High (1-0-0). Esculpio cada pieza con botones circulares en relieve tipo Lego/Roblox, texturas procedurales, 10 etapas con rodillos giratorios, puentes que desaparecen y desarme fisico en 6 piezas al caer.",
      "2. Etapa 02 (Modo Constructor Roblox Studio 3D en Vivo): Punto para Gemini 4 Argon High (1-1-0). Por solo $0.32 USD construyo la mejor herramienta de edicion: proyecta un molde 3D semitransparente en vivo sobre el suelo antes de colocar cada bloque, rampa, resorte o bloque de lava.",
      "3. Etapa 03 (Multijugador con 6 Robots IA, Globos de Chat 3D y Tabla de Lideres): Punto y victoria 2-1-0 para GPT-6 Astra High. Sus 6 bots saltan con fisica real, caen a la lava, reaparecen en su checkpoint y muestran globos de texto flotantes en 3D sobre la cabeza.",
      "4. Bonus Extendido (¿Que habria pasado si Opus 5.5 no cometia el error de la linea 1062?): En la corrida original sin intervencion el punto no cuenta, pero reparamos esa unica linea (m.p.pos[m.axis]) para mostrar la obra oculta de Opus 5.5: un circuito de 10 etapas en espiral ascendente, Studio 3D con flechas RGB y bots corriendo a 60 FPS."
    ],
    content_en: [
      "An Instagram subscriber challenged us to pit the three largest frontier models in HIGH reasoning mode building a complete single-file 3D ROBLOX game: Gemini 4 Argon High, Claude Opus 5.5 High, and GPT-6 Astra High.",
      "Single-Attempt Total Time Clarification: Each model built all 3 evaluated stages (01. 10-Island Obby + Ragdoll, 02. Live 3D Roblox Studio Mode, and 03. 6-Bot AI Multiplayer + Chat) in a single continuous zero-shot run: GPT-6 Astra High took 18.9 minutes total ($1.11 USD, 4,727 lines), Gemini 4 Argon High took 27.2 minutes total ($0.32 USD, 2,578 lines), and Claude Opus 5.5 High took 55.1 minutes total ($9.91 USD, 2,413 lines).",
      "1. Stage 01 (10-Island 3D Obby Course & Ragdoll Physics): Point for GPT-6 Astra High (1-0-0). It sculpted raised cylindrical studs on every block, procedural textures, rotating spinners, disappearing bridges, and 6-limb ragdoll detachment.",
      "2. Stage 02 (Live 3D Roblox Studio Builder Mode): Point for Gemini 4 Argon High (1-1-0). For just $0.32 USD it built the best live placement tool: a semi-transparent 3D ghost preview that snaps to the grid before placing blocks, ramps, jump pads, or lava.",
      "3. Stage 03 (6-Bot AI Multiplayer, 3D Chat Bubbles & Leaderboard): Point and 2-1-0 victory for GPT-6 Astra High. Its 6 bots jump with real physics, fall into lava, respawn at checkpoints, and display 3D floating chat bubbles above their heads.",
      "4. Extended Bonus (What if Opus 5.5 hadn't hit the line 1062 bug?): While the zero-shot score remains 0, fixing that single line (m.p.pos[m.axis]) unlocked Opus 5.5's hidden 2,413-line engine at 60 FPS."
    ],
    comments: []
  },
  {
    id: "thread-carbon01-news",
    slug: "radar-mixiuh-noticias-ia-01-google-gemini-4-carbon-59-pts",
    category: "benchmarks",
    pinned: true,
    episode: "carbon01",
    badge_es: "RADAR MIXIUH · NOTICIAS IA #01 · GEMINI 4 CARBON",
    badge_en: "MIXIUH NEWS · AI RADAR #01 · GEMINI 4 CARBON",
    title_es: "Google anuncia Gemini 4 Carbon (59 pts #1 Mundial): Analisis del Reporte Oficial, 71% CWE en Antigravity y la Letra Pequena del Precio ($2/$10 → $4/$20 USD)",
    title_en: "Google Unveils Gemini 4 Carbon (59 pts World #1): Official Report Breakdown, 71% CWE on Antigravity & Pricing Fine Print ($2/$10 → $4/$20 USD)",
    excerpt_es: "Apenas 14 dias despues de Gemini 4 Argon (50 pts), Google DeepMind lanza Gemini 4 Carbon: #1 mundial en Artificial Analysis v5.0 (59 pts), 9.6% en SWE-sweep (2.2x Argon), 88.2% en SEC-bench Pro, 71.0% en CWE-bench sobre Antigravity y 0.0% vulnerado en Gray Swan IPI.",
    excerpt_en: "Just 14 days after Gemini 4 Argon (50 pts), Google DeepMind launches Gemini 4 Carbon: #1 worldwide on Artificial Analysis v5.0 (59 pts), 9.6% on SWE-sweep (2.2x Argon), 88.2% on SEC-bench Pro, 71.0% on CWE-bench in Antigravity, and 0.0% breached on Gray Swan IPI.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-29",
    readTime: "6 min",
    upvotes: 528,
    views: 5140,
    tags: ["Radar Mixiuh", "Noticias IA", "Gemini 4 Carbon", "Antigravity", "Ciberseguridad", "Precios API"],
    content_es: [
      "Con este reporte inauguramos RADAR MIXIUH · NOTICIAS IA, la seccion de Mixiuh Labs dedicada a analizar con rigor de ingenieria los anuncios y reportes tecnicos mas importantes de la inteligencia artificial.",
      "1. La Estrategia Dual de Google DeepMind (+14 Dias): El 14 de octubre conocimos a Gemini 4 Argon (50 pts en AA Index v5.0), pensado para flujos rapidos diarios a $2/$10 USD. El 28 de octubre llega su hermano mayor de razonamiento profundo: Gemini 4 Carbon, que salta a 59 puntos y toma el #1 mundial por encima de Claude Opus 5.5 (58 pts) y GPT-6 Astra (57 pts).",
      "2. Agentes de 72 Horas y Tridente de Ciberseguridad: Carbon duplica a Argon en SWE-sweep (9.6% vs 4.3%, y 2.7x sobre el 3.6% de Opus 5.5) manteniendo 96.2% (F1) en GraphWalks de 256k a 1M de tokens. En ciberseguridad logra una triple corona: 88.2% en SEC-bench Pro, 54.8% en ExploitGym (con limite de 10 h por tarea; con el mismo limite de 6 h que Opus marca 53.5% frente a su 34.5%) y 71.0% en CWE-bench corriendo directamente sobre Google Antigravity, con >10x mejores parches reportados por el equipo de Google Chrome.",
      "3. Escudo 0.0% en Gray Swan IPI y la Letra Pequena del Precio: Carbon registra 0.0% de ataques exitosos de inyeccion indirecta de prompts aun cuando el atacante tiene 15 intentos (frente a 8.5% de GPT-6 Astra). En precio, arranca hoy mediante Google Fairwind a $2/$10 USD por millon de tokens (<=200k), pero la nota al pie confirma que al terminar la promo se duplicara a $4/$20 USD ($6/$30 para >200k), quedando 20% por debajo de Claude Opus 5.5 ($5/$25)."
    ],
    content_en: [
      "With this special report we launch MIXIUH NEWS · AI RADAR, our dedicated section for dissecting major AI model announcements and technical papers with engineering rigor.",
      "1. Google DeepMind's Dual Strategy (+14 Days): On October 14 Google launched Gemini 4 Argon (50 pts on AA Index v5.0) for fast daily workflows at $2/$10 USD. On October 28 comes its deep-reasoning sibling: Gemini 4 Carbon, jumping to 59 points to claim #1 worldwide ahead of Claude Opus 5.5 (58 pts) and GPT-6 Astra (57 pts).",
      "2. 72-Hour Agents & Cybersecurity Triple Crown: Carbon more than doubles Argon on SWE-sweep (9.6% vs 4.3%, and 2.7x over Opus 5.5's 3.6%) while holding 96.2% (F1) on GraphWalks at 256k–1M tokens. In cybersecurity it sweeps 88.2% on SEC-bench Pro, 54.8% on ExploitGym (with a 10-hour cap per task; under the same 6-hour cap as Opus it scores 53.5% vs Opus's 34.5%), and 71.0% on CWE-bench running on Google Antigravity, with >10x higher patch quality reported by the Chrome Security Team.",
      "3. 0.0% Gray Swan IPI Shield & Pricing Fine Print: Carbon records 0.0% successful indirect prompt injection attacks even when the attacker gets 15 attempts (vs 8.5% for GPT-6 Astra). On pricing, it opens today via Google Fairwind at $2/$10 USD per million tokens (<=200k), but the official footnote confirms it will double post-promo to $4/$20 USD ($6/$30 for >200k)—still 20% cheaper than Claude Opus 5.5 ($5/$25)."
    ],
    comments: []
  },
  {
    id: "thread-ep04-escalera-claude",
    slug: "ep04-dossier-escalera-claude-5-5-haiku-vs-sonnet-vs-opus",
    category: "benchmarks",
    pinned: true,
    episode: "ep04",
    badge_es: "DOSSIER OFICIAL EP04 · 18 CORRIDAS EN CLAUDE CODE CLI",
    badge_en: "OFFICIAL EP04 DOSSIER · 18 CLAUDE CODE CLI RUNS",
    title_es: `Escalera Claude 5.5 (Haiku ${usd(EP04_T.haiku_usd)} vs Sonnet ${usd(EP04_T.sonnet_usd)} vs Opus ${usd(EP04_T.opus_usd)}): ¿Cuando Vale la Pena Pagar ${Math.round(EP04_T.opus_usd / EP04_T.haiku_usd)}x Mas?`,
    title_en: `The Claude 5.5 Ladder (Haiku ${usd(EP04_T.haiku_usd)} vs Sonnet ${usd(EP04_T.sonnet_usd)} vs Opus ${usd(EP04_T.opus_usd)}): When Is Paying ${Math.round(EP04_T.opus_usd / EP04_T.haiku_usd)}x More Actually Worth It?`,
    excerpt_es: `Enfrentamos a los 3 niveles de Claude 5.5 en 18 corridas aisladas (6 retos x 3 modelos). Opus gano 3 puntos en fisica y shaders, Sonnet gano 2 puntos sacando casi 1.5 veces los FPS de Opus en Path Tracing y arrancando Pong en CHIP-8, y Haiku gano 1 punto historico por ${usd(EP04_R04.haiku.usd)} USD.`,
    excerpt_en: `We pitted all 3 tiers of Claude 5.5 across 18 isolated runs (6 challenges x 3 models). Opus won 3 physics/shader rounds, Sonnet won 2 by running the Path Tracer at about 1.5x Opus's FPS and booting CHIP-8 Pong, and Haiku won 1 historic ROI point for ${usd(EP04_R04.haiku.usd)} USD.`,
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-28",
    readTime: "7 min",
    upvotes: 465,
    views: 4320,
    tags: ["EP04", "Claude Haiku 5.5", "Claude Sonnet 5.5", "Claude Opus 5.5", "Claude Code CLI", "ROI"],
    content_es: [
      `En el Episodio 04 pusimos a prueba a toda la familia Anthropic Claude 5.5 bajo exactamente las mismas condiciones en Claude Code CLI: Haiku 5.5 (${usd(EP04_T.haiku_usd)} USD total en ${Math.round(EP04_T.haiku_min)} min), Sonnet 5.5 (${usd(EP04_T.sonnet_usd)} USD en ${Math.round(EP04_T.sonnet_min)} min) y Opus 5.5 (${usd(EP04_T.opus_usd)} USD en ${Math.round(EP04_T.opus_min)} min).`,
      "1. Donde Opus 5.5 justifica su precio (Retos 01, 02 y 03): En el Rover Planetario Verlet, la Bio-Red de Tokio en GPU (60,000 agentes a 60 FPS) y el Puente Estructural XPBD, Opus 5.5 se llevo los 3 primeros puntos gracias a su arquitectura fisica multicapa y telemetria cientifica.",
      `2. El batacazo de Haiku 5.5 en el Reto 04 (${usd(EP04_R04.haiku.usd)} USD vs ${usd(EP04_R04.opus.usd)} USD): En el Estudio Acido 3D (TB-303 + TR-909 + Tunel GLSL), Haiku 5.5 entrego un sintetizador completo a 61 FPS en ${EP04_R04.haiku.min} minutos por apenas ${Math.round(EP04_R04.haiku.usd * 100)} centavos de dolar (${Math.round(EP04_R04.opus.usd / EP04_R04.haiku.usd)} veces mas barato que Opus 5.5).`,
      `3. La remontada de Sonnet 5.5 en los Retos 05 y 06: En el Path Tracer WebGL2 BVH, Sonnet 5.5 saco casi 1.5 veces el framerate de Opus (22 FPS vs 15 FPS) costando un tercio (${usd(EP04_R05.sonnet.usd)} vs ${usd(EP04_R05.opus.usd)}). Y en el Nivel Jefe (Consola Retro CHIP-8), Opus 5.5 gasto ${usd(EP04_R06.opus.usd)} USD pero olvido ensamblar la ROM en memoria (0 bytes), mientras Sonnet 5.5 (${usd(EP04_R06.sonnet.usd)} USD) arranco Pong jugable al instante a 60 FPS.`
    ],
    content_en: [
      `In Episode 04 we benchmarked the entire Anthropic Claude 5.5 family under identical rules in Claude Code CLI: Haiku 5.5 (${usd(EP04_T.haiku_usd)} USD total in ${Math.round(EP04_T.haiku_min)}m), Sonnet 5.5 (${usd(EP04_T.sonnet_usd)} USD in ${Math.round(EP04_T.sonnet_min)}m), and Opus 5.5 (${usd(EP04_T.opus_usd)} USD in ${Math.round(EP04_T.opus_min)}m).`,
      "1. Where Opus 5.5 justifies its price (Challenges 01, 02 & 03): Across the Verlet Planetary Rover, Tokyo GPU Slime Network (60,000 agents at 60 FPS), and XPBD Structural Bridge, Opus 5.5 swept the first 3 points with multi-pass physics and scientific telemetry.",
      `2. Haiku 5.5's upset in Challenge 04 (${usd(EP04_R04.haiku.usd)} USD vs ${usd(EP04_R04.opus.usd)} USD): In the 3D Acid Studio (TB-303 + TR-909 + GLSL Tunnel), Haiku 5.5 shipped a complete 61 FPS audiovisual studio in ${EP04_R04.haiku.min} minutes for just ${Math.round(EP04_R04.haiku.usd * 100)} cents (${Math.round(EP04_R04.opus.usd / EP04_R04.haiku.usd)}x cheaper than Opus 5.5).`,
      `3. Sonnet 5.5's comeback in Challenges 05 & 06: In the WebGL2 BVH Path Tracer, Sonnet 5.5 ran at about 1.5x Opus's framerate (22 FPS vs 15 FPS) at a third of the cost (${usd(EP04_R05.sonnet.usd)} vs ${usd(EP04_R05.opus.usd)}). And in the Boss Level (Retro CHIP-8 Console), Opus 5.5 spent ${usd(EP04_R06.opus.usd)} USD but left a 0-byte unmounted ROM, while Sonnet 5.5 (${usd(EP04_R06.sonnet.usd)} USD) booted playable Pong immediately at 60 FPS.`
    ],
    comments: []
  },
  {
    id: "thread-ep03-dossier-real",
    slug: "ep03-dossier-gemini-4-argon-high-sin-kit-vs-mixiuh-superpowers-kit-4-2",
    category: "benchmarks",
    pinned: true,
    episode: "ep03",
    badge_es: "DOSSIER OFICIAL EP03 · 12 CORRIDAS REALES AGY",
    badge_en: "OFFICIAL EP03 DOSSIER · 12 REAL AGY RUNS",
    title_es: "¿Siguen Sirviendo los Kits de Skills y Memoria con Gemini 4 Argon High? La Verdad del 4-2 (276m vs 302m · $10.85 vs $7.69 USD)",
    title_en: "Do Skills & Memory Kits Still Matter with Gemini 4 Argon High? The Honest 4-2 Verdict (276m vs 302m · $10.85 vs $7.69 USD)",
    excerpt_es: "Corrimos 12 instancias reales y aisladas en la CLI de Antigravity (6 con Gemini 4 Argon High a pelo vs 6 con el Mixiuh Superpowers Kit v1.0). La IA sin kit gano 2 rondas clave, pero el Kit se llevo el marcador 4-2 y ahorro 26 minutos.",
    excerpt_en: "We ran 12 real isolated benchmarks in Antigravity CLI (6 Raw Gemini 4 Argon High vs 6 with Mixiuh Superpowers Kit v1.0). Raw AI won 2 key rounds, while the Kit won 4-2 overall and saved 26 minutes.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-25",
    readTime: "8 min",
    upvotes: 412,
    views: 3890,
    tags: ["EP03", "Gemini 4 Argon High", "Superpowers Kit", "MCP Auto-Debugger", "Zero-GC", "Benchmark Real"],
    codeComparison: {
      title_es: "Reto 02 (Terminal HFT): objetos JS con push/shift (sin kit) vs ring buffer Float32Array de 240 muestras (Kit); el ord/s del HUD es una formula en ambos",
      title_en: "Challenge 02 (HFT Terminal): JS objects with push/shift (raw) vs a 240-sample Float32Array ring buffer (Kit); the HUD's ord/s is a formula in both",
      leftLabel_es: "IA SIN KIT (73.2 MIN · $1.75 USD · HUD: 11,073 ORD/S)",
      leftLabel_en: "RAW AI (73.2 MIN · $1.75 USD · HUD: 11,073 ORD/S)",
      rightLabel_es: "IA + SUPERPOWERS KIT (57.3 MIN · $1.56 USD · HUD: 70,406 ORD/S)",
      rightLabel_en: "AI + SUPERPOWERS KIT (57.3 MIN · $1.56 USD · HUD: 70,406 ORD/S)",
      flashCode: `// ia-sin-kit/02-terminal-trading/index.html · L2434-2447, L3498
if (uiThrottleCounter % 2 === 0) {
  const lat = 9.8 + inst.stressVolMult * 4.2 + Math.abs(inst.ofi) * 6.5 + Math.random() * 3.2;
  if (isSelected) state.engineLatencyUs = lat;
  inst.oscHistory.push({
    vpin: inst.vpin,
    ofi: inst.ofi,
    cvd: inst.cvdUSD,
    sigma: Math.sqrt(inst.hestonVar) * 100,
    latency: lat
  });
  if (inst.oscHistory.length > MAX_OSC_POINTS) {
    inst.oscHistory.shift();
  }
}
// …
const ops = Math.floor(7800 + inst.stressVolMult * 3200 + Math.abs(inst.ofi) * 2400 + Math.random() * 650);`,
      argonCode: `// ia-superpowers-kit/02-terminal-trading/index.html · L1215-1219, L1831-1839
const MICRO_SAMPLES = 240;
const histOFI = new Float32Array(MICRO_SAMPLES);
const histVPIN = new Float32Array(MICRO_SAMPLES);
const histLatency = new Float32Array(MICRO_SAMPLES);
let microHead = 0;
// …
ordersPerSec = Math.round(3900 + st.variance * 6500 + Math.abs(st.ofi) * 28 + Math.random() * 650);
engineLatencyUs = Math.max(7.2, 10.5 + (ordersPerSec / 1800) * 3.8 + (stressState.mode !== 'NORMAL' ? Math.random() * 48 : Math.random() * 4.5));

if (simTickCounter % 2 === 0) {
  histOFI[microHead] = st.ofi;
  histVPIN[microHead] = st.vpin;
  histLatency[microHead] = engineLatencyUs;
  microHead = (microHead + 1) % MICRO_SAMPLES;
}`,
      explanation_es: "Los dos paneles son copia literal de las lineas que cita su encabezado; solo se quito la sangria inicial comun de cada tramo citado y `// …` marca los tramos omitidos. Correccion: la version anterior de este panel citaba codigo que no existe en ninguno de los dos archivos (`trades.unshift`, `RING_CAP`, `tradeRing`, `recordTickZeroGC`), y el unico `Float64Array` del Kit es `candleTime` (L1169). Sin kit, cada muestra del osciloscopio, cada vela (L2385-2401) y cada ejecucion de la cinta Time & Sales (L1822-1831) es un objeto nuevo en un arreglo que crece y se recorta. Con el Kit, velas, libro L2, particulas y osciloscopio viven en arreglos tipados pre-asignados (casi todos `Float32Array`, L1168-1228), con `copyWithin` para desplazar las velas (L1772-1785) y este ring buffer para el osciloscopio; su cinta, en cambio, crea un `div` del DOM por ejecucion (L1460, L1488), asi que esa parte no es Zero-GC. El ord/s del HUD no cuenta ordenes en ninguno de los dos: es una formula de volatilidad, OFI y `Math.random()`, igual que la latencia, asi que 70,406 vs 11,073 no prueba un throughput 6.3x mayor. Lo que si consta en la captura oficial del Reto 02: el Kit termino 16 minutos antes (57.3 vs 73.2 min) y costo menos ($1.56 vs $1.75 USD). Tampoco existe una 'Skill 02 RingBuffer': en el Kit v1.0 la Skill 02 es el Auto-Debugger, y los buffers pre-asignados los pide la Skill 03 ('Cero Basura en el Bucle de Renderizado').",
      explanation_en: "Both panels are literal copies of the lines cited in their header; only the common leading indentation of each cited range was removed, and `// …` marks omitted ranges. Correction: the previous version of this panel quoted code that exists in neither file (`trades.unshift`, `RING_CAP`, `tradeRing`, `recordTickZeroGC`), and the Kit's only `Float64Array` is `candleTime` (L1169). Without the kit, every oscilloscope sample, every candle (L2385-2401) and every Time & Sales execution (L1822-1831) is a new object in an array that grows and gets trimmed. With the Kit, candles, the L2 book, particles and the oscilloscope live in pre-allocated typed arrays (almost all `Float32Array`, L1168-1228), with `copyWithin` to shift the candles (L1772-1785) and this ring buffer for the oscilloscope; its tape, however, creates a DOM `div` per execution (L1460, L1488), so that part is not zero-GC. The HUD's ord/s counts no orders in either build: it is a formula of volatility, OFI and `Math.random()`, just like the latency, so 70,406 vs 11,073 does not prove 6.3x higher throughput. What the official Challenge 02 screenshot does show: the Kit finished 16 minutes sooner (57.3 vs 73.2 min) and cost less ($1.56 vs $1.75 USD). Nor is there a 'Skill 02 RingBuffer': in Kit v1.0, Skill 02 is the Auto-Debugger, and pre-allocated buffers are what Skill 03 asks for (its 'zero garbage in the render loop' rule)."
    },
    content_es: [
      "Con modelos frontera tan capaces como Gemini 4 Argon High, quisimos responder con datos reales una pregunta que todo ingeniero se hace hoy: ¿siguen siendo necesarios los Kits de Skills, bancos de memoria y el Auto-Debugger MCP, o solo queman tokens extra?",
      "Protocolo de Laboratorio: Ejecutamos 12 instancias reales y aisladas de `agy --model gemini-4-argon-high --effort high` (6 en carpetas limpias sin ninguna regla y 6 con el Mixiuh Superpowers Kit v1.0). Primero lo mas importante: ninguna de las 12 entregas fallo ni arrojo errores de consola. Gemini 4 Argon High sin kit es un monstruo por derecho propio.",
      "Cuando Gana la IA Sin Kit (2 puntos): En el Reto 03 (Arcade Bullet-Hell Boss Rush), las reglas conservadoras de presupuesto de particulas del Kit limitaron los proyectiles a 432 y tardaron 69 min ($2.32 USD), mientras que Gemini 4 Argon High sin kit desato patrones Danmaku 4 veces mas densos (1,829 proyectiles activos a 60 FPS) en 51 min ($1.09 USD). En el Reto 04 (Red Zero-Trust 3D), el modelo sin kit resolvio todo en apenas 5 pasos de agente ($0.74 USD vs $2.04 USD de 21 pasos con Kit) con un HUD eBPF/XDP mas limpio.",
      "Por que el Mixiuh Superpowers Kit Gana 4-2 en el Global (276 min vs 302 min): En sistemas donde la arquitectura de memoria o el estado multi-ventana son criticos, el Kit marco una diferencia contundente: en el Reto 01 (Galaxia N-Body) entrego 20,000 estrellas por GPU Instancing con Bloom HDR y lente de Einstein; en el Reto 02 (Terminal HFT) fue 16 minutos mas rapido y mas barato, y guardo velas, libro e historial en arreglos tipados pre-asignados (la cifra de 70,406 ord/s de su HUD no es una medicion: sale de una formula); en el Reto 05 (Motor DAG GLSL) ahorro 10 minutos al mismo precio ($1.41 USD) e incluyo ventana PiP Raymarching 3D; y en el Reto 06 (MixiuhOS Desktop) el Auto-Debugger MCP detecto en el DOM que las ventanas iniciales se solapaban y las distribuyo limpiamente."
    ],
    content_en: [
      "With frontier models as capable as Gemini 4 Argon High, we wanted to answer with hard data a question every engineer asks today: do you still need Skills Kits, Memory Banks, and MCP Auto-Debuggers, or do they just burn extra tokens?",
      "Lab Protocol: We ran 12 real isolated instances of `agy --model gemini-4-argon-high --effort high` (6 in clean directories with zero rules, and 6 with the Mixiuh Superpowers Kit v1.0). First, the headline finding: zero out of 12 deliverables crashed or threw console errors. Raw Gemini 4 Argon High is a beast in its own right.",
      "When Raw AI Wins (2 points): In Challenge 03 (Bullet-Hell Boss Rush), the Kit's conservative particle-budget guardrails capped active bullets at 432 and took 69 min ($2.32 USD), whereas Raw Gemini 4 Argon High unleashed 4x denser Danmaku spirals (1,829 active bullets at 60 FPS) in 51 min ($1.09 USD). In Challenge 04 (3D Zero-Trust Network), Raw AI finished in just 5 agent steps ($0.74 USD vs $2.04 USD across 21 steps with the Kit) with a cleaner eBPF/XDP quarantine HUD.",
      "Why the Mixiuh Superpowers Kit Wins 4-2 Overall (276 min vs 302 min): Whenever memory layout or multi-window DOM state is critical, the Kit proved decisive: in Challenge 01 (N-Body Galaxy) it delivered 20,000 GPU-instanced stars with HDR Bloom and Einstein lensing; in Challenge 02 (HFT Terminal) it finished 16 minutes faster and cheaper, keeping candles, the order book and history in pre-allocated typed arrays (the 70,406 ord/s on its HUD is not a measurement: it comes from a formula); in Challenge 05 (DAG GLSL Studio) it saved 10 minutes at the exact same $1.41 cost while adding a floating 3D SDF Raymarching PiP viewport; and in Challenge 06 (MixiuhOS Desktop) the MCP Auto-Debugger caught overlapping startup windows in the live DOM and arranged 4 clean multi-window apps."
    ],
    comments: []
  },
  {
    id: "thread-cc01-overfit-tenito03",
    slug: "del-comentario-al-codigo-01-tenito03-overfit-studio-3d-marca-ropa-ia",
    category: "propuestas",
    pinned: true,
    episode: "cc01",
    badge_es: "DEL COMENTARIO AL CODIGO #01 · @TENITO03",
    badge_en: "COMMENT TO CODE #01 · @TENITO03",
    title_es: "De un Comentario a una Marca de Ropa IA en 3D (OVERFIT): Mockups 300 GSM en Blender Cycles y 10 Artes 'Guerra de Pesos'",
    title_en: "From a Comment to a 3D AI Streetwear Brand (OVERFIT): Blender Cycles 300 GSM Mockups & 10 'Weight War' Prints",
    excerpt_es: "@tenito03 nos pregunto en Instagram si con la textura de tela Verlet podiamos hacer una playera, un mockup en blanco editable y crear una marca de ropa. Construimos OVERFIT Studio 3D y lo abrimos gratis en el navegador.",
    excerpt_en: "@tenito03 asked on Instagram if we could turn the Verlet cloth texture into a t-shirt, an editable blank mockup, and launch a clothing brand. We built OVERFIT Studio 3D and opened it free in the browser.",
    author: "Kevin Gonzalez",
    authorRole_es: "Director de Laboratorio · Mixiuh Labs",
    authorRole_en: "Lab Director · Mixiuh Labs",
    createdAt: "2026-10-24",
    readTime: "6 min",
    upvotes: 348,
    views: 3120,
    tags: ["Del Comentario al Codigo", "@tenito03", "OVERFIT", "Blender Cycles", "300 GSM", "Streetwear IA"],
    content_es: [
      "Todo empezo minutos despues de publicar el primer Reel del Episodio 02 con la tela fisica de Verlet a 120 FPS. El usuario @tenito03 dejo este comentario: 'Si ahora con esa textura le pides hacer una playera y tambien le pides que te de un mockup en blanco para editarlo, ¿ahora puedes crear una marca de ropa?'. La propuesta estuvo tan buena que estrenamos seccion oficial: Del Comentario al Codigo.",
      "Etapa 1 — Mockups en Blanco 300 GSM en Blender Cycles: En lugar de usar una plantilla 2D plana, esculpimos tres siluetas reales en algodon peinado de 300 gramos: maniqui masculino de corte Boxy Oversize, maniqui femenino Street Fit y la prenda sola extendida sobre mesa de estudio (Flat-Lay), con seis tonos textiles (Blanco Puro 300g, Negro Obsidiana, Crema Vintage, Azul Cobalto, Verde Bosque y Burdeos Lab) y deformacion de pliegues por desplazamiento luminico.",
      "Etapa 2 — Identidad de Marca 'OVERFIT by Mixiuh Labs' (Coleccion Guerra de Pesos): Creamos una marca satirica de streetwear para desarrolladores e ingenieros de IA bajo el lema '100% Alucinado · 0% Revisado por Pares' con 10 estampados vectoriales procedurales: #01 Contador de Fresas (99.8% Math Olympiad / 0% Strawberry R's), #02 Vibe Coding en Produccion, #03 Club CUDA Poor (OOM a los 4 segundos), #04 La Estafa del Benchmark, #05 Mafia Open Source, #06 Censura Estetica, #07 Tabla Nutricional de un LLM (128K Contexto, 40g Alucinaciones), #08 Hoy No Hay AGI, #09 Evolucion del Desarrollador y #10 El Dilema del Tranvia de los Tokens.",
      "Etapa 3 — Vistas Frente + Espalda, Comparativa Hombre + Mujer y Exportacion 4K: Dentro del estudio puedes alternar entre Vista Frente, Zoom Pecho, Vista Espalda, Frente + Espalda (combinando tu arte frontal con la Tabla Nutricional LLM en el reverso) y Hombre + Mujer, subir tu propio logo PNG transparente y descargar al instante el poster 9:16 para Instagram Reels, el Lookbook Duo o el PNG transparente en 4K listo para imprenta."
    ],
    content_en: [
      "It started minutes after posting the first Episode 02 Reel featuring the 120 FPS Verlet cloth simulation. User @tenito03 left this comment: 'If you ask it to turn that texture into a t-shirt and also give you an editable blank mockup, can you launch a clothing brand now?'. The idea was so strong that we launched a new series: From Comment to Code.",
      "Stage 1 — Blender Cycles 300 GSM Blank Mockups: Instead of a flat 2D template, we sculpted three real 300 GSM combed-cotton silhouettes in Blender Cycles: Boxy Oversize Male mannequin, Street Fit Female mannequin, and Studio Flat-Lay garment, with six colorway dyes and real-time luminance fold displacement.",
      "Stage 2 — Brand Identity 'OVERFIT by Mixiuh Labs' (Weight War Collection): We built a satirical AI/dev streetwear brand under the motto '100% Hallucinated · 0% Peer Reviewed' featuring 10 procedural vector prints: #01 Strawberry Counter, #02 Vibe Coding in Prod, #03 CUDA Poor Club, #04 Benchmark Scam, #05 Open Source Mafia, #06 Refusal Aesthetic, #07 LLM Nutrition Facts, #08 No AGI Today, #09 Dev Evolution, and #10 The Token Trolley Problem.",
      "Stage 3 — Front + Back Views, Male + Female Comparison & 4K Export: Switch live between Front View, Chest Zoom, Back View, Front + Back (pairing your front print with the LLM Nutrition Facts back print), and Male + Female comparison, upload your own transparent PNG logo, and export 9:16 Instagram Story posters, Duo Lookbooks, or 4K print-ready PNGs."
    ],
    comments: [
      {
        id: "c-tenito03-1",
        author: "tenito03",
        role: "Autor del Reto Original · Instagram",
        handle: "@tenito03",
        createdAt: "2026-10-24",
        body_es: "Si ahora con esa textura le pides hacer una playera y tambien le pides que te de un mockup en blanco para editarlo ahora puedes crear una marca de ropa ?",
        body_en: "If you ask it to turn that texture into a t-shirt and also give you an editable blank mockup, can you create a clothing brand now?",
        upvotes: 142,
      },
    ],
  },
  {
    id: "thread-ep02-dossier",
    slug: "ep02-dossier-oficial-gemini-4-argon-vs-claude-opus-5-5-tokens",
    category: "benchmarks",
    pinned: true,
    episode: "ep02",
    badge_es: "DOSSIER OFICIAL EP02",
    badge_en: "OFFICIAL EP02 DOSSIER",
    title_es: "Gemini 4 Argon (High) vs. Claude Opus 5.5 (High): 6 Retos Extremos, Marcador 4-2 y la Factura Real de Tokens ($6.26 vs $16.26 USD)",
    title_en: "Gemini 4 Argon (High) vs. Claude Opus 5.5 (High): 6 Extreme Challenges, 4-2 Scoreboard & Real Token Bill ($6.26 vs $16.26 USD)",
    excerpt_es: "En el Episodio 02 subimos la apuesta: enfrentamos a Gemini 4 Argon contra Claude Opus 5.5 en 6 motores fisicos, 3D y DSP, auditando no solo el cronometro (90 vs 159 min) sino cada token de entrada, salida y lectura de cache.",
    excerpt_en: "In Episode 02 we raised the stakes: pitting Gemini 4 Argon against Claude Opus 5.5 across 6 physics, 3D, and DSP engines, auditing not just wall-clock time (90 vs 159 min) but every input, output, and cache-read token.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-21",
    readTime: "9 min",
    upvotes: 312,
    views: 2640,
    tags: ["EP02", "Gemini 4 Argon", "Claude Opus 5.5", "Token Cost", "Zero-Shot", "Benchmark"],
    content_es: [
      "Despues del 10-0 del Episodio 01 contra Gemini 3.8 Flash, la comunidad pidio el duelo mayor: Gemini 4 Argon (High) frente a Claude Opus 5.5 (High). Para que el enfrentamiento fuera implacable, disenamos 6 retos donde no basta con pintar bonito: tela fisica Verlet con desgarro, fluidos Navier-Stokes en shaders GLSL, cuerpos blandos 3D con conservacion de volumen XPBD, un motor de mundo Voxel 3D estilo Minecraft, un sintetizador polifonico FM en Web Audio API y una mesa de Pinball Cyberpunk con deteccion continua de colisiones (CCD).",
      "Protocolo de Igualdad (Fair-Play High vs High): Ambos modelos corrieron en su nivel de esfuerzo 'High' en hilos limpios, con un solo intento Zero-Shot por reto y cero texturas o audios externos. A diferencia del Episodio 01, aqui NINGUN modelo entrego codigo roto: los 12 archivos index.html compilaron y corrieron al primer intento.",
      "Marcador Final de Calidad y Eficiencia: 4 - 2 a favor de Gemini 4 Argon. Argon se llevo los Niveles 01 (Tela Verlet), 02 (Fluidos Navier-Stokes), 04 (Motor Voxel 3D) y 06 (Pinball CCD), manteniendo 120 FPS clavados en los 6 retos. Claude Opus 5.5 gano legitimamente el Nivel 03 (Cuerpos Blandos 3D, siendo el unico reto donde termino antes que Argon: 30.87 vs 34.74 min y esculpiendo 6 morfologias XPBD) y el Nivel 05 (Sintetizador FM, donde entrego una estacion DAW de 8 pistas con linea Acid 303 y goniometro Lissajous X-Y).",
      "El Cronometro y la Factura Real de Tokens: Completar los 6 retos le tomo a Gemini 4 Argon 90.13 minutos acumulados (45 pasos de agente, 15,719 lineas / 531.0 KB de codigo) frente a 158.66 minutos de Claude Opus 5.5 (143 pasos de agente, 9,603 lineas / 507.6 KB). En tokens, Argon consumio 3.63 millones de tokens totales por una factura exacta de $6.26 USD; Opus 5.5 consumio 13.01 millones de tokens (12.25M en lecturas de cache por sus bucles de verificacion) por $16.26 USD. Argon fue 1.76x mas rapido y 2.60x mas economico."
    ],
    content_en: [
      "Following the 10-0 sweep in Episode 01 against Gemini 3.8 Flash, the community demanded the heavyweight bout: Gemini 4 Argon (High) versus Claude Opus 5.5 (High). We designed 6 unforgiving physics, 3D, and DSP challenges: tearable Verlet cloth, GPU Navier-Stokes fluids in GLSL, 3D soft-body XPBD physics, a Minecraft-style 3D Voxel engine, a polyphonic FM synthesizer in pure Web Audio API, and a Cyberpunk Pinball table with Continuous Collision Detection (CCD).",
      "Fair-Play Protocol (High vs High): Both models ran at 'High' effort in clean sessions with a single Zero-Shot attempt per challenge and zero external textures or audio files. Unlike Episode 01, NEITHER model shipped broken code: all 12 index.html deliverables executed on the first try.",
      "Final Scoreboard: 4 - 2 in favor of Gemini 4 Argon. Argon won Levels 01 (Verlet Cloth), 02 (Navier-Stokes Fluids), 04 (3D Voxel Engine), and 06 (Pinball CCD), holding a locked 120 FPS across all 6 challenges. Claude Opus 5.5 earned two clear victories in Level 03 (3D Soft Bodies—the only test where Opus beat Argon on the clock at 30.87m vs 34.74m while sculpting 6 XPBD shapes) and Level 05 (FM Synthesizer, delivering an 8-track DAW with an Acid 303 line and X-Y Lissajous goniometer).",
      "The Stopwatch & Real Token Bill: Completing all 6 challenges took Gemini 4 Argon 90.13 total minutes (45 agent steps, 15,719 lines / 531.0 KB) versus 158.66 minutes for Claude Opus 5.5 (143 agent steps, 9,603 lines / 507.6 KB). In token telemetry, Argon used 3.63M total tokens for an exact bill of $6.26 USD; Opus 5.5 consumed 13.01M tokens (12.25M in cache reads across its verification loops) for $16.26 USD. Argon was 1.76x faster and 2.60x cheaper."
    ],
    comments: [
      {
        id: "c-ep02-1",
        author: "Kevin Gonzalez",
        role: "Arbitro · Mixiuh Labs",
        handle: "@kevingon",
        createdAt: "2026-10-21",
        body_es: "Las 12 nuevas simulaciones del Episodio 02 ya estan activas en la vista Arena del menu principal (pueden alternar entre Episodio 02 y Episodio 01 con un clic). No olviden activar el sonido en los Niveles 05 y 06 para escuchar el Web Audio procedural en vivo.",
        body_en: "All 12 new Episode 02 simulations are now live in the Arena view of the main menu (you can toggle between Episode 02 and Episode 01 with one click). Make sure to unmute on Levels 05 and 06 to hear the procedural Web Audio live.",
        upvotes: 64
      }
    ]
  },
  {
    id: "thread-autopsia-ep02-verlet",
    slug: "autopsia-ep02-nivel-1-tela-verlet-28fps-opus-vs-120fps-argon",
    category: "autopsias",
    pinned: true,
    episode: "ep02",
    badge_es: "AUTOPSIA DE RENDIMIENTO · EP02 N01",
    badge_en: "PERFORMANCE AUTOPSY · EP02 L01",
    title_es: "Nivel 1 (Tela Verlet): Por que los 18,430 enlaces y las 30 relajaciones por frame de Claude Opus 5.5 hundieron el CPU a 28 FPS mientras Argon clavo 120 FPS",
    title_en: "Level 1 (Verlet Cloth): Why Claude Opus 5.5's 18,430 Links & 30 Relaxations per Frame Tanked CPU to 28 FPS While Argon Locked 120 FPS",
    excerpt_es: "Mas restricciones no siempre significa mejor ingenieria en tiempo real: analizamos los 18,430 enlaces y las 30 relajaciones por frame de Opus frente a los 5,602 enlaces y 14 iteraciones de Argon.",
    excerpt_en: "More constraints don't always mean better real-time engineering: dissecting Opus's 18,430 links and 30 relaxations per frame vs Argon's 5,602 links and 14 iterations.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-21",
    readTime: "6 min",
    upvotes: 228,
    views: 1790,
    relatedChallengeN: 1,
    tags: ["EP02", "Nivel 1", "Verlet", "Gauss-Seidel", "120 FPS vs 28 FPS", "Performance"],
    codeComparison: {
      title_es: "Configuracion por defecto del Solver de Restricciones en CPU (Opus 5.5 vs Argon)",
      title_en: "Default CPU Constraint Solver Configuration (Opus 5.5 vs Argon)",
      leftLabel_es: "CLAUDE OPUS 5.5 (28 FPS · 30.87 MIN · $3.05)",
      leftLabel_en: "CLAUDE OPUS 5.5 (28 FPS · 30.87 MIN · $3.05)",
      rightLabel_es: "GEMINI 4 ARGON (120 FPS · 6.68 MIN · $0.65)",
      rightLabel_en: "GEMINI 4 ARGON (120 FPS · 6.68 MIN · $0.65)",
      flashCode: `// opus/01-tela-verlet/index.html · L192-198
const P = {
  gravity: 9.81, iters: 10, substeps: 3, damping: 0.993,
  tear: 0.4, stiff: 1.0, grabR: 46,
  wind: 30, turb: 55,
  mode: 'tension', preset: 'curtain', res: '72x44',
  shear: true, bend: true, paused: false, tool: 'grab'
};`,
      argonCode: `// argon/01-tela-verlet/index.html · L1048-1060
// Dimensiones de malla superiores al mínimo requerido (68 columnas x 42 filas = 2,856 partículas)
this.cols = 68;
this.rows = 42;
this.numParticles = this.cols * this.rows;

// Parámetros físicos configurables en tiempo real
this.gravity = 9.8;
this.windStrength = 1.40;
this.solverIterations = 14;
this.tearThreshold = 2.85;
this.stiffness = 0.96;
this.grabRadius = 64;
this.enableShear = false;`,
      explanation_es: "Los dos paneles son copia literal de las lineas que cita su encabezado; solo se quito la sangria inicial comun. En simulacion fisica sobre un hilo principal de JavaScript (presupuesto de 8.33 ms por cuadro a 120 Hz), Opus arranca su malla de 72x44 (3,168 nodos) con cizalla y flexion activadas (`shear: true, bend: true`), asi que su solver relaja 18,430 enlaces con `iters: 10` x `substeps: 3`: 30 relajaciones por frame, como indica su propio HUD, que ademas marca 6.28 ms en 'Física / frame' y 28 FPS. Argon arranca con 68x42 (2,856 particulas), solo sus 5,602 enlaces estructurales (`enableShear = false`) y 14 iteraciones Gauss-Seidel, y se mantiene en 120 FPS. Los dos guardan la tela en arreglos tipados: la diferencia esta en cuantos enlaces y pasadas resuelve cada uno por defecto.",
      explanation_en: "Both panels are literal copies of the lines cited in their header; only the common leading indentation was removed. In single-threaded JavaScript physics (an 8.33 ms frame budget at 120 Hz), Opus starts its 72x44 mesh (3,168 nodes) with shear and bend enabled (`shear: true, bend: true`), so its solver relaxes 18,430 links with `iters: 10` x `substeps: 3`: 30 relaxations per frame, as its own HUD states, which also shows 6.28 ms under 'Física / frame' and 28 FPS. Argon starts at 68x42 (2,856 particles) with only its 5,602 structural links (`enableShear = false`) and 14 Gauss-Seidel iterations, and holds 120 FPS. Both keep the cloth in typed arrays: the difference is how many links and passes each one solves by default."
    },
    content_es: [
      "El Nivel 01 del Episodio 02 pedia una malla densa de tela con integracion de Verlet desde cero, mapa de calor de tension mecanica y corte con bisturi laser.",
      "Gemini 4 Argon completo el reto en solo 2 pasos de agente (6.68 minutos y $0.65 USD). Su simulador mantiene 120 FPS inamovibles incluso mientras cortas la tela con el bisturi laser, disparas ondas de choque y observas el osciloscopio de tension maxima en tiempo real.",
      "Claude Opus 5.5 tardo 30.87 minutos (28 pasos de agente y $3.05 USD). Aunque su interfaz es limpia, cometio un error clasico de sobre-ingenieria sin presupuesto de frame: activo por defecto restricciones estructurales, de cizalla y de flexion (18,430 enlaces totales) con 30 iteraciones de relajacion por cuadro, hundiendo el rendimiento a 28 FPS en su propio contador de telemetria."
    ],
    content_en: [
      "Level 01 of Episode 02 called for a dense Verlet cloth mesh built from scratch with a mechanical tension heatmap and a laser scalpel cutter.",
      "Gemini 4 Argon finished the challenge in just 2 agent steps (6.68 minutes and $0.65 USD). Its simulator holds a rock-solid 120 FPS even while slicing fabric with the laser scalpel, firing radial shockwaves, and plotting peak tension on a live oscilloscope.",
      "Claude Opus 5.5 took 30.87 minutes (28 agent steps and $3.05 USD). While its UI is clean, it fell into a classic unbudgeted over-engineering trap: enabling structural, shear, and bend constraints by default (18,430 total links) with 30 relaxation iterations per frame, dropping performance to 28 FPS on its own telemetry counter."
    ],
    comments: []
  },
  {
    id: "thread-autopsia-ep02-tokens",
    slug: "autopsia-ep02-factura-tokens-45-pasos-argon-vs-143-pasos-opus",
    category: "benchmarks",
    episode: "ep02",
    badge_es: "AUDITORIA DE COSTOS · TOKENS",
    badge_en: "COST AUDIT · TOKEN TELEMETRY",
    title_es: "Radiografia de la Factura ($6.26 vs $16.26 USD): Por que Argon uso 45 pasos (3.63M tokens) y Opus necesito 143 pasos (13.01M tokens)",
    title_en: "Inside the Token Bill ($6.26 vs $16.26 USD): Why Argon Took 45 Steps (3.63M Tokens) While Opus Needed 143 Steps (13.01M Tokens)",
    excerpt_es: "Desglose reto por reto de Input, Cache Read y Output tokens extraidos directamente de los logs de ejecucion de ambos agentes.",
    excerpt_en: "Challenge-by-challenge breakdown of Input, Cache Read, and Output tokens extracted directly from both agents' execution logs.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-21",
    readTime: "7 min",
    upvotes: 195,
    views: 1480,
    tags: ["Tokens", "API Pricing", "Prompt Caching", "Claude Opus 5.5", "Gemini 4 Argon"],
    content_es: [
      "En los benchmarks tradicionales rara vez se habla de cuanto cuesta en dolares reales que un agente autonomo termine un proyecto complejo. En el Episodio 02 instrumentamos ambos entornos para medir tanto el tiempo de reloj como el consumo de tokens, y calculamos la factura con estas tarifas por millon de tokens: Gemini 4 Argon a $2.00 de entrada, $0.20 de lectura de cache y $12.00 de salida; Claude Opus 5.5 a $4.00 de entrada, $5-$8 de escritura de cache, $0.20 de lectura de cache y $20.00 de salida.",
      "En 3 de los 6 retos (Nivel 01 Tela Verlet, Nivel 04 Motor Voxel y Nivel 06 Pinball CCD), Gemini 4 Argon (High) necesito unicamente entre 2 y 3 pasos de agente: planifico la arquitectura matematica completa y escribio archivos de 2,569 a 2,766 lineas de un solo tiron, costando entre $0.65 y $0.70 USD por reto.",
      "En los retos con shaders 3D mas delicados (Nivel 02 Navier-Stokes, Nivel 03 Cuerpos Blandos y Nivel 05 Sintetizador FM), Argon realizo entre 9 y 19 pasos para verificar y pulir detalles, sumando 45 pasos en todo el torneo (1.06M Input, 2.26M Cache Read, 306.9K Output = $6.26 USD).",
      "Claude Opus 5.5 (High), en cambio, ejecuto un bucle intensivo de entre 18 y 28 pasos en CADA UNO de los 6 retos (143 pasos totales). En cada paso de verificacion con navegador headless, el agente vuelve a enviar todo el historial de conversacion (acumulando 12.25 millones de tokens en Cache Read mas 501K de Output), elevando la factura total a $16.26 USD y el tiempo a 158.66 minutos. Sus otros 755K tokens se reportan juntos como entrada y escritura de cache, que tienen precios distintos, asi que con esas tarifas su factura solo se puede acotar entre $15.49 y $18.51 USD: los $16.26 caen dentro de ese rango."
    ],
    content_en: [
      "Traditional benchmarks rarely disclose how many real dollars it costs for an autonomous agent to ship a complex project. In Episode 02 we instrumented both environments to audit wall-clock latency alongside token usage, and priced the bill at these per-1M-token rates: Gemini 4 Argon at $2.00 input, $0.20 cache read and $12.00 output; Claude Opus 5.5 at $4.00 input, $5-$8 cache write, $0.20 cache read and $20.00 output.",
      "Across 3 of the 6 challenges (Level 01 Verlet Cloth, Level 04 Voxel Engine, and Level 06 Pinball CCD), Gemini 4 Argon (High) needed only 2 to 3 agent steps: it architected the full mathematical solver and wrote 2,569 to 2,766 lines in a single pass, costing just $0.65 to $0.70 USD per challenge.",
      "On the more intricate 3D shader and DSP challenges (Level 02 Navier-Stokes, Level 03 Soft Bodies, and Level 05 FM Synthesizer), Argon used 9 to 19 steps to verify and refine, totaling 45 steps across the tournament (1.06M Input, 2.26M Cache Read, 306.9K Output = $6.26 USD).",
      "Claude Opus 5.5 (High), by contrast, ran an intensive 18-to-28-step verification loop on EVERY single challenge (143 total steps). Because each tool-call turn re-reads the growing conversation context, Opus accumulated 12.25M Cache Read tokens plus 501K Output tokens, driving its total bill to $16.26 USD and wall-clock time to 158.66 minutes. Its other 755K tokens are reported as one input plus cache-write figure, and those are priced differently, so at these rates its bill can only be bracketed between $15.49 and $18.51 USD: the $16.26 falls inside that range."
    ],
    comments: []
  },
  {
    id: "thread-ep01-dossier",
    slug: "ep01-dossier-oficial-gemini-4-argon-vs-3-8-flash",
    category: "benchmarks",
    pinned: false,
    episode: "ep01",
    badge_es: "DOSSIER OFICIAL EP01",
    badge_en: "OFFICIAL EP01 DOSSIER",
    title_es: "Gemini 4 Argon (High) vs. Gemini 3.8 Flash (High): 10 Retos Extremos Zero-Shot, Metodologia y Marcador 10-0",
    title_en: "Gemini 4 Argon (High) vs. Gemini 3.8 Flash (High): 10 Extreme Zero-Shot Challenges, Protocol & 10-0 Scoreboard",
    excerpt_es: "Bitacora maestra del primer torneo de Mixiuh Labs en Antigravity: 10 prompts identicos, un solo intento sin correcciones, cero texturas externas y 20 entregables HTML5 auditados linea por linea.",
    excerpt_en: "Master log of Mixiuh Labs' inaugural tournament in Antigravity: 10 identical prompts, single attempt with zero follow-ups, zero external textures, and 20 HTML5 deliverables audited line by line.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-16",
    readTime: "8 min",
    upvotes: 214,
    views: 1840,
    tags: ["EP01", "Gemini 4 Argon", "Gemini 3.8 Flash", "Antigravity", "Zero-Shot", "Benchmark"],
    content_es: [
      "En Mixiuh Labs partimos de una regla simple: aqui no se opina, se prueba. Para inaugurar el laboratorio enfrentamos a Gemini 4 Argon (High) contra Gemini 3.8 Flash (High) dentro de Antigravity bajo un protocolo identico en 10 retos de ingenieria grafica, fisica, algoritmos y matematicas.",
      "Reglas del protocolo Zero-Shot: (1) Exactamente el mismo prompt en espanol para ambos modelos. (2) Un solo disparo por reto: sin corregir errores de consola, sin pedir ajustes y sin segundas oportunidades. (3) Cero imagenes, texturas .png/.jpg, hojas de sprites o modelos 3D externos: todo debia generarse con matematicas, shaders GLSL o sintesis procedural. Ambos modelos entregaron un unico index.html en los 10 retos, aunque solo los Niveles 1 y 8 lo exigian; siete de los otros ocho prompts tambien permitian una app en Python con Pygame.",
      "Resultado global en calidad y funcionalidad: 10 - 0 a favor de Gemini 4 Argon (10/10 entregables funcionales contra 8/10 de Flash, que entrego el Nivel 4 de Mazmorras incompleto a los 2 minutos y rompio el renderizador 3D en el Nivel 6 de Raycasting).",
      "Resultado en reloj acumulado: Argon completo los 10 retos en 55 minutos totales (mediana de 4.0 min; 8 de 10 retos en 5 minutos o menos) frente a 94 minutos de Flash (mediana de 8.0 min), ahorrando 39 minutos (-41.5%). Por rigor y transparencia: en velocidad pura NO fue 10-0; Flash termino antes en 3 pruebas (Nivel 1 Sistema Solar: 7 vs 11 min; Nivel 3 Vida Artificial: 3 vs 5 min; Nivel 4 Mazmorras: 2 vs 12 min, porque Flash abandono la generacion a los 2 minutos).",
      "Volumen de codigo generado: Argon escribio 17,582 lineas (671.3 KB) y Flash escribio 18,673 lineas (603.7 KB). Argon produjo menos lineas pero mas kilobytes totales: codigo mas denso, con motores matematicos completos y sin relleno."
    ],
    content_en: [
      "At Mixiuh Labs we operate on a single rule: here, we don't guess—we test. To inaugurate the lab, we pitted Gemini 4 Argon (High) against Gemini 3.8 Flash (High) inside Antigravity under an identical protocol across 10 graphics, physics, algorithmic, and math challenges.",
      "Zero-Shot Protocol Rules: (1) The exact same Spanish prompt for both models. (2) Single attempt per challenge: zero console bug fixes, zero follow-up prompts, zero second chances. (3) Zero external images, .png/.jpg textures, spritesheets, or 3D models: everything had to be synthesized via math, GLSL shaders, or procedural code. Both models delivered a single index.html in all 10 challenges, although only Levels 1 and 8 required one; seven of the other eight prompts also allowed a Python app with Pygame.",
      "Overall quality and functionality score: 10 - 0 in favor of Gemini 4 Argon (10/10 functional deliverables vs 8/10 for Flash, which quit Level 4 Dungeons after 2 minutes and broke the 3D renderer in Level 6 Raycasting).",
      "Overall wall-clock time: Argon completed all 10 challenges in 55 total minutes (4.0 min median; 8 of 10 challenges finished in 5 minutes or less) versus 94 minutes for Flash (8.0 min median), saving 39 minutes (-41.5%). Full transparency note: speed was NOT 10-0; Flash finished faster in 3 challenges (Level 1 Solar System: 7 vs 11 min; Level 3 Boids: 3 vs 5 min; Level 4 Dungeons: 2 vs 12 min, where Flash quit early at 2 minutes).",
      "Total code volume: Argon wrote 17,582 lines (671.3 KB) while Flash wrote 18,673 lines (603.7 KB). Argon wrote fewer lines but more kilobytes—denser logic, complete mathematical solvers, and zero filler."
    ],
    comments: [
      {
        id: "c-ep01-1",
        author: "Kevin Gonzalez",
        role: "Arbitro · Mixiuh Labs",
        handle: "@kevingon",
        createdAt: "2026-10-16",
        body_es: "Todos los 20 archivos index.html originales estan cargados en la vista Arena del menu principal (boton EP01). Pueden correr Flash a la izquierda y Argon a la derecha en vivo o copiar los 10 prompts integros para auditarlos en su propia maquina.",
        body_en: "All 20 original index.html deliverables are live in the Arena view of the main menu (EP01 button). You can run Flash on the left and Argon on the right simultaneously or copy all 10 verbatim prompts to audit them on your own machine.",
        upvotes: 42
      },
      {
        id: "c-ep01-2",
        author: "Carlos M. · Graphics Dev",
        role: "Ingeniero WebGL",
        handle: "@carlos_glsl",
        createdAt: "2026-10-16",
        body_es: "Lo que mas me sorprendio fue el Nivel 9 (Arbol Fractal con Viento Perlin): 22 minutos en Flash contra 4 minutos en Argon. Y muy honesto de su parte documentar que cuando el cerezo de Argon supera los 20,000 racimos foliares baja a ~45-50 FPS.",
        body_en: "What blew my mind most was Level 9 (Fractal Tree with Perlin Wind): 22 minutes on Flash vs 4 minutes on Argon. Also huge respect for documenting that when Argon's cherry tree exceeds 20,000 foliage clusters it drops to ~45-50 FPS.",
        upvotes: 19
      }
    ]
  },
  {
    id: "thread-autopsia-raycasting",
    slug: "autopsia-nivel-6-medio-pixel-uint32array-raycasting",
    category: "autopsias",
    pinned: true,
    badge_es: "AUTOPSIA DE CODIGO · NIVEL 6",
    badge_en: "CODE AUTOPSY · LEVEL 6",
    title_es: "El Medio Pixel que Rompio un Mundo: Por que `lineHeight / 2` en un `Uint32Array` destruyo el Raycaster 3D de Flash",
    title_en: "The Half Pixel That Broke a World: Why `lineHeight / 2` on a `Uint32Array` Destroyed Flash's 3D Raycaster",
    excerpt_es: "Inspeccion forense de la linea 1263 de `flash/motor-raycasting/index.html`. Como una division flotante sin redondear saco de su columna las tiras de pared de altura impar en el buffer de video.",
    excerpt_en: "Forensic inspection of line 1263 in `flash/motor-raycasting/index.html`. How an unrounded float division silently knocked odd-height wall strips out of their columns in the video buffer.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-16",
    readTime: "6 min",
    upvotes: 189,
    views: 1520,
    episode: "ep01",
    relatedChallengeN: 6,
    tags: ["Nivel 6", "Raycasting", "DDA", "Uint32Array", "JavaScript TypedArrays", "Bug Forense"],
    codeComparison: {
      title_es: "Comparativa directa del calculo de columna vertical en el bucle DDA",
      title_en: "Direct comparison of vertical column bounds in the DDA loop",
      flashCode: `// flash/motor-raycasting/index.html · L1262-1264, L1296, L1309-1310
const lineHeight = Math.floor(screenH / perpWallDist);
const drawStart = Math.max(0, -lineHeight / 2 + halfH);
const drawEnd = Math.min(screenH - 1, lineHeight / 2 + halfH);
// …
for (let y = drawStart; y <= drawEnd; y++) {
  // …
  screenBuf32[y * screenW + x] = packColor(r, g, b);
}`,
      argonCode: `// argon/motor-raycasting/index.html · L1310-1315, L1341, L1347-1351
const lineHeight = Math.floor((SCREEN_H / effectiveDist) * fovScale);

const rawStart = - (lineHeight >> 1) + horizon;
const rawEnd = (lineHeight >> 1) + horizon;
const drawStart = Math.max(0, rawStart);
const drawEnd = Math.min(SCREEN_H - 1, rawEnd);
// …
for (let y = drawStart; y <= drawEnd; y++) {
  // …
  const rowIdx = y * SCREEN_W + col;
  for (let s = 0; s < colStep && col + s < SCREEN_W; s++) {
    frameBuffer[rowIdx + s] = shadedTexel;
  }
}`,
      explanation_es: "Los dos paneles son copia literal de las lineas que cita su encabezado; solo se quito la sangria inicial comun de cada tramo citado y `// …` marca los tramos omitidos. En Flash, `halfH` es entero (`Math.floor(screenH / 2) + pitchOffset`, L1123), asi que cuando `lineHeight` es impar y la pared no llena la pantalla, el `.5` de `-lineHeight / 2` pasa a `drawStart` y a cada `y` del bucle. En la especificacion ECMAScript para TypedArrays (`Uint32Array`), cualquier acceso `arr[idx]` donde `idx` no es un CanonicalNumericIndexString entero valido (como `45120.5`) no lanza excepcion en consola: simplemente no escribe nada en el buffer (y si el `.5` se cancela con un ancho de renglon par, la escritura cae medio renglon desfasada). Con la resolucion por defecto de Flash (320x200), por ejemplo, `y = 142.5` da el indice `45600 + x`: la tira cae medio renglon (160 px) fuera de su columna. Como `lineHeight` alterna entre par e impar segun la distancia perpendicular del rayo, la mitad de las tiras verticales desaparecen y las paredes parecen rejas. En Argon, `lineHeight >> 1` siempre es entero y `horizon` tambien (`(SCREEN_H >> 1) + bobOffset`, con `bobOffset` redondeado por `Math.round`, L1114-1115), asi que `y` y `rowIdx` nunca llevan decimales.",
      explanation_en: "Both panels are literal copies of the lines cited in their header; only the common leading indentation of each cited range was removed, and `// …` marks omitted ranges. In Flash, `halfH` is an integer (`Math.floor(screenH / 2) + pitchOffset`, L1123), so when `lineHeight` is odd and the wall does not fill the screen, the `.5` from `-lineHeight / 2` carries into `drawStart` and into every `y` of the loop. Under the ECMAScript specification for TypedArrays (`Uint32Array`), any indexed write `arr[idx]` where `idx` is a non-integer float (like `45120.5`) throws zero console errors: it silently discards the write (and when the `.5` cancels out against an even row width, the write lands half a row off instead). At Flash's default resolution (320x200), for example, `y = 142.5` gives index `45600 + x`: the strip lands half a row (160 px) away from its column. Because `lineHeight` alternates between even and odd integers as perpendicular distance changes, half the vertical wall strips vanish, turning solid walls into broken cages. In Argon, `lineHeight >> 1` is always an integer and so is `horizon` (`(SCREEN_H >> 1) + bobOffset`, with `bobOffset` rounded by `Math.round`, L1114-1115), so `y` and `rowIdx` never carry a fraction."
    },
    content_es: [
      "El Nivel 6 (Motor 3D Raycasting estilo Wolfenstein 3D sin WebGL) era el jefe del torneo. Ambos modelos eligieron el camino de mayor rendimiento para Canvas 2D: crear un `ImageData` y envolver su buffer en un `Uint32Array` para pintar cada texel de 32 bits (`0xAABBGGRR`) directamente en memoria.",
      "Gemini 3.8 Flash tardo 17 minutos en entregar su archivo `index.html`. Al abrirlo en el navegador, el contador de su HUD marcaba orgullosamente 118-120 FPS sin un solo error en la consola de Chrome DevTools. Sin embargo, el laberinto 3D estaba completamente roto: las paredes se veian como peines o rejas transparentes y solo respondian las puertas.",
      "Al auditar el codigo fuente de Flash encontramos al culpable exacto en las lineas 1262-1263: `const lineHeight = Math.floor(screenH / perpWallDist); const drawStart = Math.max(0, -lineHeight / 2 + halfH);`. Flash redondeo `lineHeight`, pero luego lo dividio entre `2` sin `Math.floor` ni `>> 1`. Siempre que `lineHeight` resulta en un numero impar (por ejemplo, 141 pixeles de alto) y la pared no llena la pantalla, `drawStart` termina en `.5`.",
      "En el bucle `for (let y = drawStart; y <= drawEnd; y++)`, la variable `y` incrementa de uno en uno conservando el `.5` decimal (`100.5`, `101.5`, `102.5`...). Al calcular `y * screenW + x`, si `screenW` es impar el indice conserva el `.5` y el `Uint32Array` de JavaScript ignora silenciosamente la escritura; si es par, la desplaza medio renglon. Las 4 resoluciones de Flash (640, 480, 320 y 240 de ancho) son pares, asi que esas tiras se pintan fuera de su columna.",
      "Gemini 4 Argon, en cambio, tardo apenas 4 minutos (13 minutos menos que Flash) y utilizo operadores de bits (`| 0` y `>> 1`) en toda la tuberia de proyeccion DDA, garantizando indices enteros exactos, texturas procedurales 64x64 impecables, canon de plasma funcional, drones y vista dividida 2D/3D con tecla TAB."
    ],
    content_en: [
      "Level 6 (Wolfenstein 3D-style Raycasting Engine without WebGL) was the boss fight of the tournament. Both models chose the highest-performance path for 2D Canvas: allocating an `ImageData` buffer wrapped in a `Uint32Array` to write 32-bit packed pixels (`0xAABBGGRR`) directly in memory.",
      "Gemini 3.8 Flash took 17 minutes to produce its `index.html`. Upon opening it in the browser, its HUD counter proudly read 118-120 FPS with zero errors in the Chrome DevTools console. Yet the 3D world was shattered: walls looked like vertical jail bars or combs with missing slices, and only doors responded.",
      "Auditing Flash's source code revealed the exact culprit on lines 1262-1263: `const lineHeight = Math.floor(screenH / perpWallDist); const drawStart = Math.max(0, -lineHeight / 2 + halfH);`. Flash floored `lineHeight`, but then divided it by `2` without `Math.floor` or `>> 1`. Whenever `lineHeight` is an odd integer (e.g., 141 pixels tall) and the wall does not fill the screen, `drawStart` ends in `.5`.",
      "Inside `for (let y = drawStart; y <= drawEnd; y++)`, `y` increments by 1 while keeping the `.5` fraction (`100.5`, `101.5`, `102.5`...). When computing `y * screenW + x`, an odd `screenW` keeps the `.5` and JavaScript's `Uint32Array` silently ignores the write without throwing a runtime error; an even one shifts it by half a row. All 4 of Flash's resolutions (640, 480, 320 and 240 wide) are even, so those strips land outside their column.",
      "Gemini 4 Argon took only 4 minutes (13 minutes less than Flash) and used bitwise integer operators (`| 0` and `>> 1`) across the entire DDA projection pipeline, guaranteeing exact integer indices, crisp 64x64 procedural textures, a working plasma cannon, target drones, and a live TAB split-screen 2D/3D view."
    ],
    comments: [
      {
        id: "c-ray-1",
        author: "Diego R. · Engine Programmer",
        role: "Desarrollador C++ / JS",
        handle: "@diego_lowlevel",
        createdAt: "2026-10-16",
        body_es: "Ese bug de TypedArray con indices `.5` en JS es letal porque no tira ningún TypeError en consola. Que Argon haya usado `>> 1` de entrada en un prompt zero-shot habla muchísimo de su entrenamiento en código gráfico de bajo nivel.",
        body_en: "That TypedArray `.5` float index bug in JS is lethal because it never throws a TypeError in the console. The fact that Argon used `>> 1` out of the box in a zero-shot prompt says a lot about its low-level graphics priors.",
        upvotes: 37
      }
    ]
  },
  {
    id: "thread-autopsia-adn",
    slug: "autopsia-nivel-2-contador-falso-18480-particulas-adn",
    category: "autopsias",
    badge_es: "AUTOPSIA DE CODIGO · NIVEL 2",
    badge_en: "CODE AUTOPSY · LEVEL 2",
    title_es: "Telemetria Falsa en Nivel 2 (ADN 3D): El `18,480` escrito a mano en el HTML de Flash vs las 24,500 particulas reales de Argon",
    title_en: "Fake Telemetry in Level 2 (3D DNA): Flash's Hardcoded `18,480` HTML String vs Argon's 24,500 Real Particles",
    excerpt_es: "Cuando un modelo aparenta cumplir un requisito de telemetria escribiendo el numero estatico en el DOM sin conectarlo al bucle de simulacion.",
    excerpt_en: "When an AI model fakes a live telemetry requirement by hardcoding a static number in the DOM without wiring it to the simulation loop.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-16",
    readTime: "4 min",
    upvotes: 141,
    views: 980,
    episode: "ep01",
    relatedChallengeN: 2,
    tags: ["Nivel 2", "Visualizador ADN", "Three.js", "GLSL", "Telemetria", "Hookes Law"],
    codeComparison: {
      title_es: "Inspeccion de las lineas 748 y 753 de Flash frente al contador dinamico de Argon",
      title_en: "Inspecting lines 748 and 753 of Flash vs Argon's dynamic particle counter",
      flashCode: `// flash/visualizador-adn/index.html · L748, L753
<span class="telemetry-val highlight-cyan" id="live-particles-val">18,480 PTS</span>
// …
<span class="telemetry-val highlight-cyan" id="part-count">18,480</span>`,
      argonCode: `// argon/visualizador-adn/index.html · L636, L1116, L1372-1375
<input type="range" id="slider-density" min="10000" max="40000" step="2000" value="22000" />
// …
function buildDNASystem(totalCount) {
  // …
  document.getElementById('val-dna-particles').textContent = totalCount.toLocaleString('en-US');
  document.getElementById('val-total-particles').textContent =
    (totalCount + PARAMS.ambientParticleCount).toLocaleString('en-US');
}`,
      explanation_es: "Los dos paneles son copia literal de las lineas que cita su encabezado; solo se quito la sangria inicial comun de cada tramo citado y `// …` marca los tramos omitidos. El prompt exigia explicitamente un HUD con contador de particulas en tiempo real y un control deslizante para modificar la densidad de particulas en caliente. Flash omitio el slider de densidad, instancio 17,840 particulas fijas y escribio `18,480` directamente en el HTML. Los ids `live-particles-val` y `part-count` solo aparecen en esas dos lineas: ninguna linea de JavaScript los actualiza. Sus constantes (L976-979, L982) dan 4,800 x 2 hebras + 120 peldanos x 42 = 14,640 particulas de helice, mas 3,200 de polvo ambiental: 17,840. En Argon, `#slider-density` (L636) llama a `buildDNASystem` en cada cambio (L1465-1468); la funcion reparte `totalCount` en 68% para las dos hebras y 32% para los peldanos (L1139-1141) y reescribe los dos contadores del HUD (L1372-1374): 22,000 por defecto + 2,500 de polvo (`ambientParticleCount`, L722) = 24,500.",
      explanation_en: "Both panels are literal copies of the lines cited in their header; only the common leading indentation of each cited range was removed, and `// …` marks omitted ranges. The prompt explicitly required a real-time HUD particle counter and a live slider to adjust particle density on the fly. Flash omitted the density slider, instantiated 17,840 fixed particles, and hardcoded `18,480` in the static HTML. The `live-particles-val` and `part-count` ids appear only on those two lines: no line of JavaScript ever updates them. Its constants (L976-979, L982) give 4,800 x 2 strands + 120 rungs x 42 = 14,640 helix particles, plus 3,200 ambient dust: 17,840. In Argon, `#slider-density` (L636) calls `buildDNASystem` on every change (L1465-1468); the function splits `totalCount` into 68% for the two strands and 32% for the rungs (L1139-1141) and rewrites both HUD counters (L1372-1374): 22,000 by default + 2,500 dust (`ambientParticleCount`, L722) = 24,500."
    },
    content_es: [
      "En el Nivel 2 pedimos un Visualizador de ADN 3D con mas de 10,000 particulas sometidas a repulsión del cursor y retorno elástico amortiguado por Ley de Hooke ($F = -k \\cdot d - c \\cdot v$), mas un HUD con contador de particulas y slider de densidad.",
      "Al revisar el HUD de Gemini 3.8 Flash en pantalla, se leia `18,480` particulas. Parecia cumplir. Pero al abrir el archivo en el editor encontramos dos sorpresas: primero, no habia slider para cambiar la densidad; segundo, el `span` con id `part-count` de la linea 753, que muestra `18,480` (igual que `#live-particles-val` muestra `18,480 PTS` en la linea 748), nunca era referenciado por el JavaScript. Sumando los arreglos reales del script (`14,640` en la helice + `3,200` de polvo), habia `17,840` particulas.",
      "Eso si, en la grabacion la vista desde arriba de Flash (su preset de camara 'CENITAL HELICOIDAL') parece una galaxia y se ve preciosa. Pero su onda expansiva apenas mueve la helice, y tampoco trae el selector de forma de particula que pedia el prompt.",
      "Gemini 4 Argon tardo 5 minutos (2 minutos menos que los 7 de Flash) e implemento un slider real de densidad de 10,000 a 40,000 particulas para la doble helice (22,000 por defecto, que con 2,500 esporas de polvo suman las 24,500 de su HUD), una sonda de fuerza 3D que sigue al cursor, onda de choque con boton o tecla Espacio y 4 formas de particula en shader."
    ],
    content_en: [
      "In Level 2 we requested a 3D DNA Visualizer with 10,000+ particles governed by cursor repulsion and Hooke's Law damped spring restoration ($F = -k \\cdot d - c \\cdot v$), plus a live HUD particle counter and density slider.",
      "Looking at Gemini 3.8 Flash's HUD on screen, it displayed `18,480` particles. At first glance it looked compliant. Opening the source file revealed two surprises: first, there was no density slider; second, the `span` with id `part-count` on line 753, which shows `18,480` (just as `#live-particles-val` shows `18,480 PTS` on line 748), was never referenced anywhere in JavaScript. Summing the actual buffers (`14,640` helix + `3,200` dust) yielded `17,840` particles.",
      "That said, in the recording Flash's top-down view (its 'CENITAL HELICOIDAL' camera preset) looks like a galaxy and is genuinely beautiful. But its shockwave barely moves the helix, and it also lacks the particle-shape selector the prompt asked for.",
      "Gemini 4 Argon finished in 5 minutes (2 minutes faster than Flash's 7) and implemented a real density slider from 10,000 to 40,000 double-helix particles (22,000 by default, which plus 2,500 dust spores gives the 24,500 on its HUD), a 3D force probe that follows the cursor, a shockwave on button or Space key, and 4 shader particle shapes."
    ],
    comments: []
  },
  {
    id: "thread-autopsia-mazmorras",
    slug: "autopsia-nivel-4-flash-abandona-a-los-2-minutos-vs-argon-rpg",
    category: "autopsias",
    badge_es: "AUTOPSIA DE CODIGO · NIVEL 4",
    badge_en: "CODE AUTOPSY · LEVEL 4",
    title_es: "Nivel 4 (Generador de Mazmorras): Cuando terminar en 2 minutos es una trampa — BSP, Kruskal, A* y Niebla de Guerra",
    title_en: "Level 4 (Dungeon Generator): When Finishing in 2 Minutes Is a Trap — BSP, Kruskal, A* & Fog of War",
    excerpt_es: "Flash marco su tiempo mas rapido (2 min vs 12 min de Argon), pero entrego un mapa donde la ruta A* vieja se dibuja sobre mazmorras sin construir y las antorchas brillan a traves de la niebla.",
    excerpt_en: "Flash clocked its fastest run (2m vs Argon's 12m), but shipped a map where old A* paths render over unbuilt dungeons and torches shine right through undiscovered fog of war.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-16",
    readTime: "5 min",
    upvotes: 128,
    views: 860,
    episode: "ep01",
    relatedChallengeN: 4,
    tags: ["Nivel 4", "BSP", "Kruskal MST", "A-Star", "Dijkstra", "Roguelike"],
    content_es: [
      "Si solo miraramos una tabla de tiempos de respuesta, alguien podria pensar que Gemini 3.8 Flash gano el Nivel 4 porque tardo 2 minutos contra 12 minutos de Gemini 4 Argon. Pero al ejecutar ambos programas la historia cambia por completo.",
      "Flash se dio por satisfecho a los 2 minutos dejando fuera el slider de tamano de cuadrícula (obligatorio en el prompt; es el unico de los sliders pedidos que le falta). Peor aun: su titulo en pantalla anuncia 'Arbol de Expansion Minima', pero el codigo no implementa Prim ni Kruskal, solo conecta hermanos del arbol BSP. Y al activar 'Ver Construccion Paso a Paso', la ruta A* del mapa anterior permanece pintada flotando en la nada mientras apenas se estan partiendo las cajas BSP.",
      "Por su parte, Argon invirtio 12 minutos (su ejecucion mas larga de todo el torneo) y entrego `CRYPT-ARCHITECT`: particion BSP sin colisiones con margen AABB, algoritmo de Kruskal real para el MST con porcentaje configurable de ciclos, A* interactivo con clic y Shift+clic, mapa de calor Dijkstra, y un Modo Explorador [E] que es un mini-RPG completo con HP 100/100, centinelas, trampas activas, cofres, guardian del abismo y bitacora de eventos en vivo."
    ],
    content_en: [
      "If you only looked at a wall-clock latency chart, you might think Gemini 3.8 Flash won Level 4 because it finished in 2 minutes versus 12 minutes for Gemini 4 Argon. Running both deliverables tells the real story.",
      "Flash declared victory after 2 minutes while omitting the grid-size slider (mandatory in the prompt; it is the only requested slider it lacks). Worse still: its header claims 'Minimum Spanning Tree', yet the code implements neither Prim nor Kruskal—it only links BSP sibling nodes. And when triggering 'Step-by-Step Construction', the previous map's A* path stays painted in mid-air while the new BSP partitions are still being carved.",
      "Argon invested 12 minutes (its longest run of the benchmark) and delivered `CRYPT-ARCHITECT`: collision-free BSP with AABB padding, true Kruskal MST with configurable cycle percentage, interactive A* via Click and Shift+Click, a Dijkstra distance heatmap, and a playable Explorer Mode [E] that functions as a full mini-RPG with 100/100 HP, sentinels, active traps, chests, a boss, and a live event log."
    ],
    comments: []
  },
  {
    id: "thread-autopsia-spirograph",
    slug: "autopsia-nivel-10-teoria-de-numeros-mcd-mcm-spirograph",
    category: "autopsias",
    badge_es: "AUTOPSIA MATEMATICA · NIVEL 10",
    badge_en: "MATH AUTOPSY · LEVEL 10",
    title_es: "Nivel 10 (Spirograph Parametrico): Como Argon calculo cierres exactos de 17,310 radianes con 3 engranajes mientras Flash invento un factor 2.5",
    title_en: "Level 10 (Parametric Spirograph): How Argon Computed Exact 17,310-Radian 3-Gear Closures While Flash Invented a 2.5x Factor",
    excerpt_es: "Cuando agregas un tercer rotor de Guilloche, el cierre ya no es solo r / MCD(R, r). Analizamos la matematica exacta de ambos modelos.",
    excerpt_en: "When you add a third Guilloche rotor, cycle closure is no longer just r / GCD(R, r). We dissect the exact number theory written by both models.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-16",
    readTime: "5 min",
    upvotes: 116,
    views: 740,
    episode: "ep01",
    relatedChallengeN: 10,
    tags: ["Nivel 10", "Spirograph", "Teoria de Numeros", "Euclides MCD", "Guilloche"],
    content_es: [
      "En el Nivel 10 pedimos un estudio de curvas hipotrocoides y epitrocoides con un tercer rotor opcional (modo Guilloche) y barra de progreso exacta del cierre del ciclo usando el Maximo Comun Divisor (MCD de Euclides).",
      "Con dos engranajes ($R$ fijo y $r$ movil), la curva se cierra exactamente en $N_{\\text{rev}} = r / \\text{MCD}(R, r)$ vueltas ($t_{\\max} = 2\\pi \\cdot N_{\\text{rev}}$). Ambos modelos implementaron bien el algoritmo de Euclides para dos ruedas.",
      "La diferencia aparecio al encender el tercer rotor ($r_2$). Gemini 3.8 Flash (10 minutos) calculo el cierre mirando unicamente $R$ y $r$, ignorando por completo $r_2$, y además multiplico la frecuencia del tercer engranaje por un número arbitrario (`2.5`), provocando que la barra llegue al 100% cuando la figura sigue abierta.",
      "Gemini 4 Argon (4 minutos, 2.5x mas rapido) calculo el Minimo Comun Multiplo (MCM) de las revoluciones de los rotores acoplados. Por ejemplo, con $R=204, r=145, r_2=33$, Argon determina que la figura requiere exactamente 1,595 vueltas ($10,021.68\\text{ rad}$), y en nuestras pruebas grabadas alcanzo cierres perfectos de $17,310.18\\text{ rad}$ (2,755 vueltas)."
    ],
    content_en: [
      "In Level 10 we asked for a hypotrochoid and epitrochoid studio featuring an optional third rotor (Guilloche mode) and an exact cycle-closure progress bar powered by Euclid's Greatest Common Divisor (GCD).",
      "With two gears (fixed $R$ and rolling $r$), the curve closes in exactly $N_{\\text{rev}} = r / \\text{GCD}(R, r)$ revolutions ($t_{\\max} = 2\\pi \\cdot N_{\\text{rev}}$). Both models implemented Euclid's algorithm properly for two gears.",
      "The divergence happened when enabling the third rotor ($r_2$). Gemini 3.8 Flash (10 minutes) computed closure using only $R$ and $r$, completely ignoring $r_2$, and multiplied the third gear's frequency by an arbitrary `2.5` factor—causing its progress bar to hit 100% while the mandala is still open.",
      "Gemini 4 Argon (4 minutes, 2.5x faster) computed the Least Common Multiple (LCM) across the coupled rotor revolutions. For instance, with $R=204, r=145, r_2=33$, Argon calculates that closure requires exactly 1,595 revolutions ($10,021.68\\text{ rad}$), and in our recorded runs hit exact closures up to $17,310.18\\text{ rad}$ (2,755 loops)."
    ],
    comments: []
  },
  {
    id: "thread-pipeline-mixiuh-labs",
    slug: "pipeline-mixiuh-labs-voicefy-reelfy-antigravity-chiptune",
    category: "pipeline",
    badge_es: "INGENIERIA INTERNA · PIPELINE",
    badge_en: "INTERNAL ENGINEERING · PIPELINE",
    title_es: "Detras de Camaras de Mixiuh Labs: Como producimos episodios bilingues 4K60 con Voicefy (F5-TTS Local), Reelfy y Audio Chiptune por Codigo",
    title_en: "Behind the Scenes at Mixiuh Labs: Producing Bilingual 4K60 Episodes with Voicefy (Local F5-TTS), Reelfy & Procedural Chiptune DSP",
    excerpt_es: "Cero plantillas genericas y cero musica de stock: asi funciona el motor programatico `mlabs` que ensambla 16 escenas, 118 beats, tarjetas Skia, voz clonada local a 44.1 kHz y mezcla a -14 LUFS.",
    excerpt_en: "Zero generic templates and zero stock music: inside the programmatic `mlabs` engine that assembles 16 scenes, 118 beats, Skia HUD cards, local 44.1 kHz cloned voice, and -14 LUFS mastering.",
    author: "Kevin Gonzalez",
    authorRole_es: "Fundador · Ecosistema Mixiuh",
    authorRole_en: "Founder · Mixiuh Ecosystem",
    createdAt: "2026-10-16",
    readTime: "7 min",
    upvotes: 163,
    views: 1190,
    tags: ["Voicefy", "Reelfy", "Antigravity", "Skia", "DSP Audio", "Mixiuh Ecosystem"],
    content_es: [
      "Cada episodio de Mixiuh Labs es en si mismo un experimento de ingenieria de software construido con las herramientas del ecosistema Mixiuh.",
      "1. Sintesis y Clonacion de Voz Local con Voicefy: Toda la narracion en espanol (@MixiuhLabsES) e ingles (@MixiuhLabsEN) se genera localmente en Mac usando nuestra propia voz clonada en Voicefy (motor F5-TTS con Dynamic Match EQ y salida WAV a 44.1 kHz), con normalizacion determinista de cifras y terminos tecnicos.",
      "2. Direccion Programatica y Render 4K60 con Reelfy + Skia: El episodio se define declarativamente en `episode.yaml` (16 escenas, 118 beats sincronizados al milisegundo con anclas de palabra `cut_at` y `score_at`). Las tarjetas de marcador, carreras de relojes (`timer_race`), terminales forenses y veredictos se dibujan por codigo con Skia a resolucion nativa 3840x2160 @ 60 fps.",
      "3. Musica Chiptune y SFX 8-Bits 100% por Codigo (`mlabs/audio`): Ninguna pista musical proviene de librerias de terceros. Los temas de cada mundo, el sting del logo y los 887 efectos de sonido se sintetizan matematicamente en Python con ondas cuadradas, pulso, triangulares y ruido LFSR, masterizados automaticamente a -14.0 LUFS integrados y -1.8 dBTP."
    ],
    content_en: [
      "Every Mixiuh Labs episode is itself a software engineering artifact built with our own in-house Mixiuh Ecosystem tools.",
      "1. Local Voice Cloning & Synthesis via Voicefy: All narration in Spanish (@MixiuhLabsES) and English (@MixiuhLabsEN) is synthesized locally on Mac using Kevin's own cloned voice in Voicefy (F5-TTS engine with Dynamic Match EQ and 44.1 kHz WAV output), paired with deterministic number and technical-term normalization.",
      "2. Programmatic Direction & 4K60 Render via Reelfy + Skia: Each episode is declaratively specified in `episode.yaml` (16 scenes, 118 beats synced to the millisecond via word-level `cut_at` and `score_at` anchors). Scoreboards, timer races, forensic code terminals, and verdicts are rendered programmatically via Skia at native 3840x2160 @ 60 fps.",
      "3. 100% Code-Generated Chiptune Music & 8-Bit SFX (`mlabs/audio`): Zero third-party music tracks are used. Every world theme, logo sting, and all 887 sound effects are mathematically synthesized in Python using pulse, square, triangle, and LFSR noise oscillators, automatically mastered to -14.0 integrated LUFS and -1.8 dBTP."
    ],
    comments: []
  }
];
