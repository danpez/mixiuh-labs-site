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
  episode?: "ep01" | "ep02" | "ep03" | "cc01";
  relatedChallengeN?: number;
  tags: string[];
  codeComparison?: {
    title_es: string;
    title_en: string;
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
    status_es: "En Vivo Arriba (/overfit)",
    status_en: "Live Above (/overfit)",
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
    status_es: "En cabeza para EP03",
    status_en: "Leading for EP03",
  },
  {
    id: "prop-emulador-chip8",
    title_es: "Reto Jefe: Emulador de Consola Retro + Ensamblador y ROM Procedural en 1 Archivo",
    title_en: "Boss Challenge: Retro Console Emulator + Assembler & Procedural ROM in 1 File",
    models: "Argon vs Opus 5.5 vs GPT-5.4",
    category_es: "Arquitectura de Sistemas",
    category_en: "Systems Architecture",
    description_es: "Pedir en un solo intento una maquina virtual con ciclo fetch-decode-execute, registros en vivo, debugger paso a paso en hexadecimal y un juego jugable compilado en memoria al abrir el HTML.",
    description_en: "Zero-shot virtual machine featuring a fetch-decode-execute cycle, live CPU register inspector, hex step-by-step debugger, and a playable game compiled in memory on load.",
    votes: 156,
    status_es: "Candidato Nivel Jefe EP03",
    status_en: "EP03 Boss Level Candidate",
  },
  {
    id: "prop-raytracer-bvh",
    title_es: "Path Tracer en Tiempo Real en WebGL2 con BVH, Refraccion Caustica y Denoiser",
    title_en: "Real-Time WebGL2 Path Tracer with BVH, Caustic Refraction & Temporal Denoiser",
    models: "Gemini 4 Argon vs Claude Opus 5.5",
    category_es: "GPU y Shaders Avanzados",
    category_en: "GPU & Advanced Shaders",
    description_es: "Trazado de rayos estocastico de multiples rebotes en un fragment shader GLSL con jerarquia de volumenes delimitadores (BVH), lentes de vidrio con dispersion cromatica y acumulacion temporal.",
    description_en: "Multi-bounce stochastic path tracing in a GLSL fragment shader with Bounding Volume Hierarchy (BVH), dispersive glass lenses, and progressive temporal accumulation.",
    votes: 129,
    status_es: "En evaluacion",
    status_en: "Under Evaluation",
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
    createdAt: "2026-10-22",
    readTime: "8 min",
    upvotes: 412,
    views: 3890,
    tags: ["EP03", "Gemini 4 Argon High", "Superpowers Kit", "MCP Auto-Debugger", "Zero-GC", "Benchmark Real"],
    codeComparison: {
      title_es: "Reto 02 (Terminal HFT): Objetos JS Estandar (11,073 ord/s) vs Skill 02 Float64Array RingBuffer (70,406 ord/s)",
      title_en: "Challenge 02 (HFT Terminal): Standard JS Objects (11,073 ord/s) vs Skill 02 Float64Array RingBuffer (70,406 ord/s)",
      leftLabel_es: "[IZQUIERDA] IA SIN KIT (58 MIN · $1.60 USD · 11,073 ORD/S)",
      leftLabel_en: "[LEFT] RAW AI (58 MIN · $1.60 USD · 11,073 ORD/S)",
      rightLabel_es: "[DERECHA] IA + SUPERPOWERS KIT (42 MIN · $1.40 USD · 70,406 ORD/S)",
      rightLabel_en: "[RIGHT] AI + SUPERPOWERS KIT (42 MIN · $1.40 USD · 70,406 ORD/S)",
      flashCode: `// ia-sin-kit/02-terminal-trading/index.html
// Asigna objetos { price, size, side, ts } en el heap en cada tick:
function pushTradeTick(price, size, side) {
  trades.unshift({ id: ++seq, price, size, side, ts: performance.now() });
  if (trades.length > 250) trades.pop(); // <-- Presion al Garbage Collector (11,073 ord/s)
}`,
      argonCode: `// ia-superpowers-kit/02-terminal-trading/index.html
// Skill 02 Zero-GC: RingBuffer pre-alocado en Float64Array (0 allocs por tick)
const RING_CAP = 16384;
const tradeRing = new Float64Array(RING_CAP * 4); // [price, size, side, ts]
function recordTickZeroGC(price, size, side, now) {
  const base = (head & (RING_CAP - 1)) << 2;
  tradeRing[base] = price; tradeRing[base + 1] = size; // <-- 70,406 ord/s clavados
}`,
      explanation_es: "En el Reto 02 (Terminal HFT), darle al modelo el Skill 02 de arquitectura Zero-GC con RingBuffers pre-alocados no solo sextuplico el throughput de ordenes por segundo (70,406 vs 11,073 ord/s), sino que evito que el agente reescribiera el motor a mitad de camino, terminando 16 minutos antes (42m vs 58m) y costando menos ($1.40 vs $1.60 USD).",
      explanation_en: "In Challenge 02 (HFT Terminal), equipping the model with Skill 02's Zero-GC Float64Array RingBuffer pattern not only boosted throughput 6.3x (70,406 vs 11,073 ord/s), it prevented the agent from refactoring mid-run—finishing 16 minutes faster (42m vs 58m) and costing less ($1.40 vs $1.60 USD)."
    },
    content_es: [
      "Con modelos frontera tan capaces como Gemini 4 Argon High, quisimos responder con datos reales una pregunta que todo ingeniero se hace hoy: ¿siguen siendo necesarios los Kits de Skills, bancos de memoria y el Auto-Debugger MCP, o solo queman tokens extra?",
      "Protocolo de Laboratorio: Ejecutamos 12 instancias reales y aisladas de `agy --model gemini-4-argon-high --effort high` (6 en carpetas limpias sin ninguna regla y 6 con el Mixiuh Superpowers Kit v1.0). Primero lo mas importante: ninguna de las 12 entregas fallo ni arrojo errores de consola. Gemini 4 Argon High sin kit es un monstruo por derecho propio.",
      "Cuando Gana la IA Sin Kit (2 puntos): En el Reto 03 (Arcade Bullet-Hell Boss Rush), las reglas conservadoras de presupuesto de particulas del Kit limitaron los proyectiles a 432 y tardaron 69 min ($2.32 USD), mientras que Gemini 4 Argon High sin kit desato patrones Danmaku 4 veces mas densos (1,829 proyectiles activos a 60 FPS) en 51 min ($1.09 USD). En el Reto 04 (Red Zero-Trust 3D), el modelo sin kit resolvio todo en apenas 5 pasos de agente ($0.74 USD vs $2.04 USD de 21 pasos con Kit) con un HUD eBPF/XDP mas limpio.",
      "Por que el Mixiuh Superpowers Kit Gana 4-2 en el Global (276 min vs 302 min): En sistemas donde la arquitectura de memoria o el estado multi-ventana son criticos, el Kit marco una diferencia contundente: en el Reto 01 (Galaxia N-Body) entrego 20,000 estrellas por GPU Instancing con Bloom HDR y lente de Einstein; en el Reto 02 (Terminal HFT) fue 16 minutos mas rapido, mas barato y 6.3x mas veloz (70,406 ord/s); en el Reto 05 (Motor DAG GLSL) ahorro 10 minutos al mismo precio ($1.41 USD) e incluyo ventana PiP Raymarching 3D; y en el Reto 06 (MixiuhOS Desktop) el Auto-Debugger MCP detecto en el DOM que las ventanas iniciales se solapaban y las distribuyo limpiamente."
    ],
    content_en: [
      "With frontier models as capable as Gemini 4 Argon High, we wanted to answer with hard data a question every engineer asks today: do you still need Skills Kits, Memory Banks, and MCP Auto-Debuggers, or do they just burn extra tokens?",
      "Lab Protocol: We ran 12 real isolated instances of `agy --model gemini-4-argon-high --effort high` (6 in clean directories with zero rules, and 6 with the Mixiuh Superpowers Kit v1.0). First, the headline finding: zero out of 12 deliverables crashed or threw console errors. Raw Gemini 4 Argon High is a beast in its own right.",
      "When Raw AI Wins (2 points): In Challenge 03 (Bullet-Hell Boss Rush), the Kit's conservative particle-budget guardrails capped active bullets at 432 and took 69 min ($2.32 USD), whereas Raw Gemini 4 Argon High unleashed 4x denser Danmaku spirals (1,829 active bullets at 60 FPS) in 51 min ($1.09 USD). In Challenge 04 (3D Zero-Trust Network), Raw AI finished in just 5 agent steps ($0.74 USD vs $2.04 USD across 21 steps with the Kit) with a cleaner eBPF/XDP quarantine HUD.",
      "Why the Mixiuh Superpowers Kit Wins 4-2 Overall (276 min vs 302 min): Whenever memory layout or multi-window DOM state is critical, the Kit proved decisive: in Challenge 01 (N-Body Galaxy) it delivered 20,000 GPU-instanced stars with HDR Bloom and Einstein lensing; in Challenge 02 (HFT Terminal) it finished 16 minutes faster, cheaper, and with 6.3x higher order throughput (70,406 ord/s); in Challenge 05 (DAG GLSL Studio) it saved 10 minutes at the exact same $1.41 cost while adding a floating 3D SDF Raymarching PiP viewport; and in Challenge 06 (MixiuhOS Desktop) the MCP Auto-Debugger caught overlapping startup windows in the live DOM and arranged 4 clean multi-window apps."
    ],
    comments: []
  },
  {
    id: "thread-cc01-overfit-tenito03",
    slug: "del-comentario-al-codigo-01-tenito03-overfit-studio-3d-marca-ropa-ia",
    category: "propuestas",
    pinned: true,
    episode: "ep02",
    badge_es: "DEL COMENTARIO AL CODIGO #01 · @TENITO03",
    badge_en: "COMMENT TO CODE #01 · @TENITO03",
    title_es: "De un Comentario a una Marca de Ropa IA en 3D (OVERFIT): Mockups 300 GSM en Blender Cycles y 10 Artes 'Guerra de Pesos'",
    title_en: "From a Comment to a 3D AI Streetwear Brand (OVERFIT): Blender Cycles 300 GSM Mockups & 10 'Weight War' Prints",
    excerpt_es: "@tenito03 nos pregunto en Instagram si con la textura de tela Verlet podiamos hacer una playera, un mockup en blanco editable y crear una marca de ropa. Construimos OVERFIT Studio 3D y lo abrimos gratis en el navegador.",
    excerpt_en: "@tenito03 asked on Instagram if we could turn the Verlet cloth texture into a t-shirt, an editable blank mockup, and launch a clothing brand. We built OVERFIT Studio 3D and opened it free in the browser.",
    author: "Kevin Gonzalez",
    authorRole_es: "Director de Laboratorio · Mixiuh Labs",
    authorRole_en: "Lab Director · Mixiuh Labs",
    createdAt: "2026-10-22",
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
        createdAt: "hace 2 h",
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
    badge_es: "DOSSIER OFICIAL EP02 · NUEVO",
    badge_en: "OFFICIAL EP02 DOSSIER · NEW",
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
        createdAt: "Hoy",
        body_es: "Las 12 nuevas simulaciones del Episodio 02 ya estan activas en la Arena Interactiva aqui arriba (pueden alternar entre Episodio 02 y Episodio 01 con un clic). No olviden activar el sonido en los Niveles 05 y 06 para escuchar el Web Audio procedural en vivo.",
        body_en: "All 12 new Episode 02 simulations are now live in the Interactive Arena above (you can toggle between Episode 02 and Episode 01 with one click). Make sure to unmute on Levels 05 and 06 to hear the procedural Web Audio live.",
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
    title_es: "Nivel 1 (Tela Verlet): Por que los 18,430 enlaces y 30 iteraciones de Claude Opus 5.5 hundieron el CPU a 28 FPS mientras Argon clavo 120 FPS",
    title_en: "Level 1 (Verlet Cloth): Why Claude Opus 5.5's 18,430 Links & 30 Solver Iterations Tanked CPU to 28 FPS While Argon Locked 120 FPS",
    excerpt_es: "Mas restricciones no siempre significa mejor ingenieria en tiempo real: analizamos las 552,900 relajaciones por cuadro de Opus frente al solver Gauss-Seidel calibrado de Argon.",
    excerpt_en: "More constraints don't always mean better real-time engineering: dissecting Opus's 552,900 relaxations per frame vs Argon's calibrated Gauss-Seidel solver.",
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
      leftLabel_es: "[IZQUIERDA] CLAUDE OPUS 5.5 (28 FPS · 30.87 MIN · $3.05)",
      leftLabel_en: "[LEFT] CLAUDE OPUS 5.5 (28 FPS · 30.87 MIN · $3.05)",
      rightLabel_es: "[DERECHA] GEMINI 4 ARGON (120 FPS · 6.68 MIN · $0.65)",
      rightLabel_en: "[RIGHT] GEMINI 4 ARGON (120 FPS · 6.68 MIN · $0.65)",
      flashCode: `// claude-opus-5.5/01-tela-verlet/index.html
// Malla 77x48 (3,696 nodos) con Estructural + Cizalla + Flexion activados de serie:
// Total: 18,430 enlaces * 30 iteraciones = 552,900 pases por frame en 1 hilo JS
const state = {
  cols: 77, rows: 48,
  iterations: 30,
  useShear: true,
  useBend: true, // <-- Multiplica enlaces a 18,430; cae a 28 FPS (6.28 ms/frame)
};`,
      argonCode: `// gemini-4-argon/01-tela-verlet/index.html
// Malla 72x44 (3,168 nodos, 6,228 enlaces) en Float32Arrays contiguos:
// 14 iteraciones Gauss-Seidel = 87,192 operaciones en cache L1 -> 120 FPS clavados
const CONFIG = {
  cols: 72, rows: 44,
  solverIterations: 14, // <-- Tensado perfecto a 120 FPS (0.9 ms/frame)
  stiffness: 0.98,
  tearThreshold: 2.35,
};`,
      explanation_es: "En simulacion fisica sobre un hilo principal de JavaScript (presupuesto de 8.33 ms por cuadro a 120 Hz), activar simultaneamente enlaces estructurales, diagonales de cizalla y saltos dobles de flexion eleva la malla de Opus a 18,430 objetos en memoria. Multiplicado por 30 iteraciones de relajacion y el renderizado de 18,430 trazos en Canvas 2D, el frame tarda ~35 ms (28 FPS). Argon empaqueto coordenadas en arreglos tipados y calibro 14 iteraciones estructurales con sombreado por celda a 120 FPS.",
      explanation_en: "In single-threaded JavaScript physics (an 8.33 ms frame budget at 120 Hz), enabling structural, diagonal shear, and double-stride bend links simultaneously inflates Opus's mesh to 18,430 heap objects. Multiplied by 30 solver iterations plus 18,430 Canvas 2D stroke calls, each frame takes ~35 ms (28 FPS). Argon packed coordinates into contiguous arrays and calibrated 14 Gauss-Seidel iterations to hold a locked 120 FPS."
    },
    content_es: [
      "El Nivel 01 del Episodio 02 pedia una malla densa de tela con integracion de Verlet desde cero, mapa de calor de tension mecanica y corte con bisturi laser.",
      "Gemini 4 Argon completo el reto en solo 2 pasos de agente (6.68 minutos y $0.65 USD). Su simulador mantiene 120 FPS inamovibles incluso mientras cortas la tela con el bisturi laser, disparas ondas de choque y observas el osciloscopio de tension maxima en tiempo real.",
      "Claude Opus 5.5 tardo 30.87 minutos (28 pasos de agente y $3.05 USD). Aunque su interfaz es limpia, cometio un error clasico de sobre-ingenieria sin presupuesto de frame: activo por defecto restricciones estructurales, de cizalla y de flexion (18,430 enlaces totales) con 30 iteraciones de relajacion por cuadro, hundiendo el rendimiento a 28 FPS en su propio contador de telemetria."
    ],
    content_en: [
      "Level 01 of Episode 02 called for a dense Verlet cloth mesh built from scratch with a mechanical tension heatmap and a laser scalpel cutter.",
      "Gemini 4 Argon finished the challenge in just 2 agent steps (6.68 minutes and $0.65 USD). Its simulator holds a rock-solid 120 FPS even while slicing fabric with the laser scalpel, firing radial shockwaves, and plotting peak tension on a live oscilloscope.",
      "Claude Opus 5.5 took 30.87 minutes (28 agent steps and $3.05 USD). While its UI is clean, it fell into a classic unbudgeted over-engineering trap: enabling structural, shear, and bend constraints by default (18,430 total links) at 30 solver iterations per frame, dropping performance to 28 FPS on its own telemetry counter."
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
      "En los benchmarks tradicionales rara vez se habla de cuanto cuesta en dolares reales que un agente autonomo termine un proyecto complejo. En el Episodio 02 instrumentamos ambos entornos para medir tanto el tiempo de reloj como el consumo de tokens con tarifas oficiales.",
      "En 3 de los 6 retos (Nivel 01 Tela Verlet, Nivel 04 Motor Voxel y Nivel 06 Pinball CCD), Gemini 4 Argon (High) necesito unicamente entre 2 y 3 pasos de agente: planifico la arquitectura matematica completa y escribio archivos de 2,500 a 2,760 lineas de un solo tiron, costando entre $0.65 y $0.70 USD por reto.",
      "En los retos con shaders 3D mas delicados (Nivel 02 Navier-Stokes, Nivel 03 Cuerpos Blandos y Nivel 05 Sintetizador FM), Argon realizo entre 9 y 19 pasos para verificar y pulir detalles, sumando 45 pasos en todo el torneo (1.06M Input, 2.26M Cache Read, 306.9K Output = $6.26 USD).",
      "Claude Opus 5.5 (High), en cambio, ejecuto un bucle intensivo de entre 18 y 28 pasos en CADA UNO de los 6 retos (143 pasos totales). En cada paso de verificacion con navegador headless, el agente vuelve a enviar todo el historial de conversacion (acumulando 12.25 millones de tokens en Cache Read mas 501K de Output), elevando la factura total a $16.26 USD y el tiempo a 158.66 minutos."
    ],
    content_en: [
      "Traditional benchmarks rarely disclose how many real dollars it costs for an autonomous agent to ship a complex project. In Episode 02 we instrumented both environments to audit wall-clock latency alongside exact token billing under official API pricing.",
      "Across 3 of the 6 challenges (Level 01 Verlet Cloth, Level 04 Voxel Engine, and Level 06 Pinball CCD), Gemini 4 Argon (High) needed only 2 to 3 agent steps: it architected the full mathematical solver and wrote 2,500 to 2,760 lines in a single pass, costing just $0.65 to $0.70 USD per challenge.",
      "On the more intricate 3D shader and DSP challenges (Level 02 Navier-Stokes, Level 03 Soft Bodies, and Level 05 FM Synthesizer), Argon used 9 to 19 steps to verify and refine, totaling 45 steps across the tournament (1.06M Input, 2.26M Cache Read, 306.9K Output = $6.26 USD).",
      "Claude Opus 5.5 (High), by contrast, ran an intensive 18-to-28-step verification loop on EVERY single challenge (143 total steps). Because each tool-call turn re-reads the growing conversation context, Opus accumulated 12.25M Cache Read tokens plus 501K Output tokens, driving its total bill to $16.26 USD and wall-clock time to 158.66 minutes."
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
    createdAt: "2026-10-15",
    readTime: "8 min",
    upvotes: 214,
    views: 1840,
    tags: ["EP01", "Gemini 4 Argon", "Gemini 3.8 Flash", "Antigravity", "Zero-Shot", "Benchmark"],
    content_es: [
      "En Mixiuh Labs partimos de una regla simple: aqui no se opina, se prueba. Para inaugurar el laboratorio enfrentamos a Gemini 4 Argon (High) contra Gemini 3.8 Flash (High) dentro de Antigravity bajo un protocolo identico en 10 retos de ingenieria grafica, fisica, algoritmos y matematicas.",
      "Reglas del protocolo Zero-Shot: (1) Exactamente el mismo prompt en espanol para ambos modelos. (2) Un solo disparo por reto: sin corregir errores de consola, sin pedir ajustes y sin segundas oportunidades. (3) Cero imagenes, texturas .png/.jpg, hojas de sprites o modelos 3D externos: todo debia generarse con matematicas, shaders GLSL o sintesis procedural en un unico archivo index.html.",
      "Resultado global en calidad y funcionalidad: 10 - 0 a favor de Gemini 4 Argon (10/10 entregables funcionales contra 8/10 de Flash, que entrego el Nivel 4 de Mazmorras incompleto a los 2 minutos y rompio el renderizador 3D en el Nivel 6 de Raycasting).",
      "Resultado en reloj acumulado: Argon completo los 10 retos en 55 minutos totales (mediana de 4.0 min; 8 de 10 retos en 5 minutos o menos) frente a 94 minutos de Flash (mediana de 8.0 min), ahorrando 39 minutos (-41.5%). Por rigor y transparencia: en velocidad pura NO fue 10-0; Flash termino antes en 3 pruebas (Nivel 1 Sistema Solar: 7 vs 11 min; Nivel 3 Vida Artificial: 3 vs 5 min; Nivel 4 Mazmorras: 2 vs 12 min, porque Flash abandono la generacion a los 2 minutos).",
      "Volumen de codigo generado: Argon escribio 17,582 lineas (671.3 KB) y Flash escribio 18,673 lineas (603.7 KB). Argon produjo menos lineas pero mas kilobytes totales: codigo mas denso, con motores matematicos completos y sin relleno."
    ],
    content_en: [
      "At Mixiuh Labs we operate on a single rule: here, we don't guess—we test. To inaugurate the lab, we pitted Gemini 4 Argon (High) against Gemini 3.8 Flash (High) inside Antigravity under an identical protocol across 10 graphics, physics, algorithmic, and math challenges.",
      "Zero-Shot Protocol Rules: (1) The exact same Spanish prompt for both models. (2) Single attempt per challenge: zero console bug fixes, zero follow-up prompts, zero second chances. (3) Zero external images, .png/.jpg textures, spritesheets, or 3D models: everything had to be synthesized via math, GLSL shaders, or procedural code in a single index.html file.",
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
        createdAt: "Hace 2 horas",
        body_es: "Todos los 20 archivos index.html originales estan cargados aqui mismo en la pestana 'Arena Interactiva (20 Demos)'. Pueden correr Flash a la izquierda y Argon a la derecha en vivo o copiar los 10 prompts integros para auditarlos en su propia maquina.",
        body_en: "All 20 original index.html deliverables are live right here under the 'Interactive Arena (20 Demos)' tab. You can run Flash on the left and Argon on the right simultaneously or copy all 10 verbatim prompts to audit them on your own machine.",
        upvotes: 42
      },
      {
        id: "c-ep01-2",
        author: "Carlos M. · Graphics Dev",
        role: "Ingeniero WebGL",
        handle: "@carlos_glsl",
        createdAt: "Hace 1 hora",
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
    excerpt_es: "Inspeccion forense de la linea 1263 de `gemini-3.8-flash/motor-raycasting/index.html`. Como una division flotante sin redondear dejo mudas todas las columnas impares del buffer de video.",
    excerpt_en: "Forensic inspection of line 1263 in `gemini-3.8-flash/motor-raycasting/index.html`. How an unrounded float division silently dropped every odd-height wall column in the video buffer.",
    author: "Kevin Gonzalez",
    authorRole_es: "Arbitro y Arquitecto · Mixiuh Labs",
    authorRole_en: "Referee & Architect · Mixiuh Labs",
    createdAt: "2026-10-15",
    readTime: "6 min",
    upvotes: 189,
    views: 1520,
    relatedChallengeN: 6,
    tags: ["Nivel 6", "Raycasting", "DDA", "Uint32Array", "JavaScript TypedArrays", "Bug Forense"],
    codeComparison: {
      title_es: "Comparativa directa del calculo de columna vertical en el bucle DDA",
      title_en: "Direct comparison of vertical column bounds in the DDA loop",
      flashCode: `// gemini-3.8-flash/motor-raycasting/index.html (Linea ~1263)
// Tardo 17 minutos. Cuando lineHeight es IMPAR, lineHeight / 2 termina en .5
const lineHeight = Math.floor(h / perpWallDist);
let drawStart = -lineHeight / 2 + halfH; // <-- BUG CRITICO: Flotante .5 si lineHeight es impar
if (drawStart < 0) drawStart = 0;

for (let y = drawStart; y < drawEnd; y++) {
  // En JS, escribir en buf32[y * w + x] cuando y tiene .5 (ej. 142.5)
  // trata el indice como propiedad de cadena y Uint32Array LO IGNORA SILENCIOSAMENTE:
  buf32[y * w + x] = color;
}`,
      argonCode: `// gemini-4-argon/motor-raycasting/index.html
// Tardo 4 minutos (4.25x mas rapido). Corrimiento de bits garantiza entero 32-bit:
const lineH = (H / perpDist) | 0;
const halfLine = lineH >> 1; // <-- Division entera por desplazamiento de bits (siempre entero)
const drawStart = Math.max(0, (H >> 1) - halfLine);
const drawEnd = Math.min(H - 1, (H >> 1) + halfLine);

for (let y = drawStart; y < drawEnd; y++) {
  // Indice 100% entero garantizado en cada iteracion:
  pixels32[y * W + x] = shadedTexel;
}`,
      explanation_es: "En la especificacion ECMAScript para TypedArrays (`Uint32Array`), cualquier acceso `arr[idx]` donde `idx` no es un CanonicalNumericIndexString entero valido (como `45120.5`) no lanza excepcion en consola: simplemente no escribe nada en el buffer o escribe desfasado. Como `lineHeight` alterna entre par e impar segun la distancia perpendicular del rayo, la mitad de las tiras verticales desaparecen y las paredes parecen rejas.",
      explanation_en: "Under the ECMAScript specification for TypedArrays (`Uint32Array`), any indexed write `arr[idx]` where `idx` is a non-integer float (like `45120.5`) throws zero console errors: it silently discards the write. Because `lineHeight` alternates between even and odd integers as perpendicular distance changes, half the vertical wall strips vanish, turning solid walls into broken cages."
    },
    content_es: [
      "El Nivel 6 (Motor 3D Raycasting estilo Wolfenstein 3D sin WebGL) era el jefe del torneo. Ambos modelos eligieron el camino de mayor rendimiento para Canvas 2D: crear un `ImageData` y envolver su buffer en un `Uint32Array` para pintar cada texel de 32 bits (`0xAABBGGRR`) directamente en memoria.",
      "Gemini 3.8 Flash tardo 17 minutos en entregar su archivo `index.html`. Al abrirlo en el navegador, el contador de su HUD marcaba orgullosamente 118-120 FPS sin un solo error en la consola de Chrome DevTools. Sin embargo, el laberinto 3D estaba completamente roto: las paredes se veian como peines o rejas transparentes y solo respondian las puertas.",
      "Al auditar el codigo fuente de Flash encontramos al culpable exacto: `const lineHeight = Math.floor(h / perpWallDist); let drawStart = -lineHeight / 2 + halfH;`. Flash redondeo `lineHeight`, pero luego lo dividio entre `2` sin `Math.floor` ni `>> 1`. Siempre que `lineHeight` resulta en un numero impar (por ejemplo, 241 pixeles de alto), `drawStart` vale `.5`.",
      "En el bucle `for (let y = drawStart; y < drawEnd; y++)`, la variable `y` incrementa de uno en uno conservando el `.5` decimal (`100.5`, `101.5`, `102.5`...). Cuando multiplica `y * w + x` y cuando `w` es impar o el producto conserva `.5`, el `Uint32Array` de JavaScript ignora silenciosamente la escritura o desplaza la columna medio renglon.",
      "Gemini 4 Argon, en cambio, tardo apenas 4 minutos (13 minutos menos que Flash) y utilizo operadores de bits (`| 0` y `>> 1`) en toda la tuberia de proyeccion DDA, garantizando indices enteros exactos, texturas procedurales 64x64 impecables, canon de plasma funcional, drones y vista dividida 2D/3D con tecla TAB."
    ],
    content_en: [
      "Level 6 (Wolfenstein 3D-style Raycasting Engine without WebGL) was the boss fight of the tournament. Both models chose the highest-performance path for 2D Canvas: allocating an `ImageData` buffer wrapped in a `Uint32Array` to write 32-bit packed pixels (`0xAABBGGRR`) directly in memory.",
      "Gemini 3.8 Flash took 17 minutes to produce its `index.html`. Upon opening it in the browser, its HUD counter proudly read 118-120 FPS with zero errors in the Chrome DevTools console. Yet the 3D world was shattered: walls looked like vertical jail bars or combs with missing slices, and only doors responded.",
      "Auditing Flash's source code revealed the exact culprit: `const lineHeight = Math.floor(h / perpWallDist); let drawStart = -lineHeight / 2 + halfH;`. Flash floored `lineHeight`, but then divided it by `2` without `Math.floor` or `>> 1`. Whenever `lineHeight` is an odd integer (e.g., 241 pixels tall), `drawStart` ends in `.5`.",
      "Inside `for (let y = drawStart; y < drawEnd; y++)`, `y` increments by 1 while keeping the `.5` fraction (`100.5`, `101.5`, `102.5`...). In JavaScript's `Uint32Array`, non-integer indices are silently ignored without throwing a runtime error, or shifted by half a row when multiplied by an even width.",
      "Gemini 4 Argon took only 4 minutes (13 minutes less than Flash) and used bitwise integer operators (`| 0` and `>> 1`) across the entire DDA projection pipeline, guaranteeing exact integer indices, crisp 64x64 procedural textures, a working plasma cannon, target drones, and a live TAB split-screen 2D/3D view."
    ],
    comments: [
      {
        id: "c-ray-1",
        author: "Diego R. · Engine Programmer",
        role: "Desarrollador C++ / JS",
        handle: "@diego_lowlevel",
        createdAt: "Hace 3 horas",
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
    createdAt: "2026-10-15",
    readTime: "4 min",
    upvotes: 141,
    views: 980,
    relatedChallengeN: 2,
    tags: ["Nivel 2", "Visualizador ADN", "Three.js", "GLSL", "Telemetria", "Hookes Law"],
    codeComparison: {
      title_es: "Inspeccion de la linea 412 de Flash frente al buffer dinamico de Argon",
      title_en: "Inspecting line 412 of Flash vs Argon's dynamic particle buffer",
      flashCode: `<!-- gemini-3.8-flash/visualizador-adn/index.html (Linea 412) -->
<div class="stat-value" id="particle-count">18,480</div>

<script>
  // En el script de Flash:
  // Helice: 14,640 particulas + Polvo ambiental: 3,200 = 17,840 reales.
  // Ninguna linea de JS actualiza jamas #particle-count ni existe slider de densidad.
</script>`,
      argonCode: `// gemini-4-argon/visualizador-adn/index.html
// Slider de densidad en vivo (5,000 a 40,000 particulas; 24,500 por defecto):
function rebuildDNAGeometry(targetCount) {
  // Recalcula hebras A/B, peldanos ATCG (A-T, T-A, C-G, G-C) y polvo ambiental
  hudTotalParticles.textContent = totalAllocated.toLocaleString();
}`,
      explanation_es: "El prompt exigia explicitamente un HUD con contador de particulas en tiempo real y un control deslizante para modificar la densidad de particulas en caliente. Flash omitio el slider de densidad, instancio 17,840 particulas fijas y escribio `18,480` directamente en el HTML.",
      explanation_en: "The prompt explicitly required a real-time HUD particle counter and a live slider to adjust particle density on the fly. Flash omitted the density slider, instantiated 17,840 fixed particles, and hardcoded `18,480` in the static HTML."
    },
    content_es: [
      "En el Nivel 2 pedimos un Visualizador de ADN 3D con mas de 10,000 particulas sometidas a repulsión del cursor y retorno elástico amortiguado por Ley de Hooke ($F = -k \\cdot d - c \\cdot v$), mas un HUD con contador de particulas y slider de densidad.",
      "Al revisar el HUD de Gemini 3.8 Flash en pantalla, se leia `18,480` particulas. Parecia cumplir. Pero al abrir el archivo en el editor encontramos dos sorpresas: primero, no habia slider para cambiar la densidad; segundo, la etiqueta `<div id=\"particle-count\">18,480</div>` en la linea 412 nunca era referenciada por el JavaScript. Sumando los arreglos reales del script (`14,640` en la helice + `3,200` de polvo), habia `17,840` particulas.",
      "Ademas, en la grabacion de Flash la cadena de ADN se deforma en una espiral abierta tipo galaxia donde cuesta distinguir los peldanos transversales A-T y C-G.",
      "Gemini 4 Argon tardo 5 minutos (2 minutos menos que los 7 de Flash), implemento el slider de densidad real de 5,000 a 40,000 particulas (24,500 por defecto: 22,000 en la doble helice + 2,500 de polvo), sonda 3D con onda de choque al hacer clic y selector de secuencias geneticas."
    ],
    content_en: [
      "In Level 2 we requested a 3D DNA Visualizer with 10,000+ particles governed by cursor repulsion and Hooke's Law damped spring restoration ($F = -k \\cdot d - c \\cdot v$), plus a live HUD particle counter and density slider.",
      "Looking at Gemini 3.8 Flash's HUD on screen, it displayed `18,480` particles. At first glance it looked compliant. Opening the source file revealed two surprises: first, there was no density slider; second, `<div id=\"particle-count\">18,480</div>` on line 412 was never referenced anywhere in JavaScript. Summing the actual buffers (`14,640` helix + `3,200` dust) yielded `17,840` particles.",
      "Furthermore, in Flash's recording the DNA chain warps into an open galaxy-like spiral where the transverse A-T and C-G rungs are barely distinguishable.",
      "Gemini 4 Argon finished in 5 minutes (2 minutes faster than Flash's 7), implemented a real live density slider from 5,000 to 40,000 particles (24,500 default: 22,000 in the double helix + 2,500 ambient dust), a 3D shockwave probe on click, and genetic sequence presets."
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
    createdAt: "2026-10-15",
    readTime: "5 min",
    upvotes: 128,
    views: 860,
    relatedChallengeN: 4,
    tags: ["Nivel 4", "BSP", "Kruskal MST", "A-Star", "Dijkstra", "Roguelike"],
    content_es: [
      "Si solo miraramos una tabla de tiempos de respuesta, alguien podria pensar que Gemini 3.8 Flash gano el Nivel 4 porque tardo 2 minutos contra 12 minutos de Gemini 4 Argon. Pero al ejecutar ambos programas la historia cambia por completo.",
      "Flash se dio por satisfecho a los 2 minutos dejando fuera el slider de tamano de cuadrícula y el de radio de vision (ambos obligatorios en el prompt). Peor aun: su titulo en pantalla anuncia 'Arbol de Expansion Minima', pero el codigo no implementa Prim ni Kruskal, solo conecta hermanos del arbol BSP. Y al activar 'Ver Construccion Paso a Paso', la ruta A* del mapa anterior permanece pintada flotando en la nada mientras apenas se estan partiendo las cajas BSP.",
      "Por su parte, Argon invirtio 12 minutos (su ejecucion mas larga de todo el torneo) y entrego `CRYPT-ARCHITECT`: particion BSP sin colisiones con margen AABB, algoritmo de Kruskal real para el MST con porcentaje configurable de ciclos, A* interactivo con clic y Shift+clic, mapa de calor Dijkstra, y un Modo Explorador [E] que es un mini-RPG completo con HP 100/100, centinelas, trampas activas, cofres, guardian del abismo y bitacora de eventos en vivo."
    ],
    content_en: [
      "If you only looked at a wall-clock latency chart, you might think Gemini 3.8 Flash won Level 4 because it finished in 2 minutes versus 12 minutes for Gemini 4 Argon. Running both deliverables tells the real story.",
      "Flash declared victory after 2 minutes while omitting the grid-size slider and FOV radius slider (both mandatory in the prompt). Worse still: its header claims 'Minimum Spanning Tree', yet the code implements neither Prim nor Kruskal—it only links BSP sibling nodes. And when triggering 'Step-by-Step Construction', the previous map's A* path stays painted in mid-air while the new BSP partitions are still being carved.",
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
    createdAt: "2026-10-15",
    readTime: "5 min",
    upvotes: 116,
    views: 740,
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
    createdAt: "2026-10-15",
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
