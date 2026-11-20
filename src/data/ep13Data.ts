export interface Ep13ModelMetric {
  min: number;
  usd: number;
  tok: string;
  lines: number;
  fps: string;
  fps_en: string;
  demoUrl: string;
  stillUrl: string;
}

export interface Ep13ModularSide {
  min: number;
  usd: number;
  usdNote_es: string;
  usdNote_en: string;
  steps: number;
  tok: string;
  lines: number;
  testsPassed: boolean;
  testsLabel_es: string;
  testsLabel_en: string;
  demoUrl: string;
  stillUrl: string;
}

export interface Ep13SoloChallengeData {
  n: number;
  dir: string;
  name_es: string;
  name_en: string;
  world_es: string;
  world_en: string;
  fun_fact_es: string;
  fun_fact_en: string;
  tech_es: string;
  tech_en: string;
  winner: "neon" | "argon" | "hydrogen";
  winner_label_es: string;
  winner_label_en: string;
  neon: Ep13ModelMetric;
  argon: Ep13ModelMetric;
  hydrogen: Ep13ModelMetric;
  verdict_es: string;
  verdict_en: string;
}

export interface Ep13PeriodicTier {
  id: "hydrogen" | "neon" | "argon" | "carbon" | "orchestrator";
  name: string;
  role_es: string;
  role_en: string;
  apiPrice_es: string;
  apiPrice_en: string;
  subTier_es: string;
  subTier_en: string;
  aaScore: string;
  bestUse_es: string;
  bestUse_en: string;
  accentHex: string;
}

export const EP13_PERIODIC_TIERS: Ep13PeriodicTier[] = [
  {
    id: "hydrogen",
    name: "Gemini 4 Hydrogen",
    role_es: "Base rapida (reemplaza a Flash)",
    role_en: "Fast everyday base (replaces Flash)",
    apiPrice_es: "$1.50 in / $7.50 out (1M plano)",
    apiPrice_en: "$1.50 in / $7.50 out (flat 1M)",
    subTier_es: "Free (Auto) · AI Plus ($4.99/mes) · AI Pro · AI Ultra",
    subTier_en: "Free (Auto) · AI Plus ($4.99/mo) · AI Pro · AI Ultra",
    aaScore: "54 pts (Extra)",
    bestUse_es: "Programacion cotidiana, agentes veloces y ejecutor dentro de Orchestrator",
    bestUse_en: "Everyday coding, fast agents, and worker inside Orchestrator",
    accentHex: "#38BDF8",
  },
  {
    id: "neon",
    name: "Gemini 4 Neon",
    role_es: "Estrella equilibrada (18 nov 2026)",
    role_en: "Balanced flagship agent (Nov 18, 2026)",
    apiPrice_es: "$3.00 in / $15.00 out ($0.15 cache)",
    apiPrice_en: "$3.00 in / $15.00 out ($0.15 cached)",
    subTier_es: "AI Pro ($19.99/mes, reemplaza a Argon) · AI Ultra · Antigravity",
    subTier_en: "AI Pro ($19.99/mo, replaces Argon) · AI Ultra · Antigravity",
    aaScore: "61 pts · #1 Coding Agent",
    bestUse_es: "Ingenieria de software compleja, agentes autonomos (~3x mas rapido que Carbon)",
    bestUse_en: "Complex software engineering & autonomous coding (~3x faster than Carbon)",
    accentHex: "#22D3EE",
  },
  {
    id: "argon",
    name: "Gemini 4 Argon",
    role_es: "Razonador previo (retirado del picker)",
    role_en: "Prior reasoning tier (removed from picker)",
    apiPrice_es: "$2/$10 hasta 30 nov -> $4/$20 desde 1 dic 2026",
    apiPrice_en: "$2/$10 thru Nov 30 -> $4/$20 starting Dec 1, 2026",
    subTier_es: "API y Antigravity (reemplazado por Neon en AI Pro)",
    subTier_en: "API & Antigravity (replaced by Neon consumer-side)",
    aaScore: "51 pts (High)",
    bestUse_es: "Legado en pipelines existentes; Neon ofrece mayor indice a menor costo que Argon dic",
    bestUse_en: "Existing workflows; Neon scores higher for less once Dec 1 pricing starts",
    accentHex: "#B794F6",
  },
  {
    id: "carbon",
    name: "Gemini 4 Carbon",
    role_es: "Frontera pesada de largo aliento",
    role_en: "Heavy long-horizon frontier model",
    apiPrice_es: "$2/$10 hasta 30 nov -> $4/$20 desde 1 dic 2026",
    apiPrice_en: "$2/$10 thru Nov 30 -> $4/$20 starting Dec 1, 2026",
    subTier_es: "Exclusivo AI Ultra ($99.99 - $199.99/mes) y API/Enterprise",
    subTier_en: "Exclusive to AI Ultra ($99.99 - $199.99/mo) & API/Enterprise",
    aaScore: "~60 pts (High)",
    bestUse_es: "Investigacion profunda y arquitectura de larga duracion sin limite estricto de tiempo",
    bestUse_en: "Deep research and marathon reasoning workloads",
    accentHex: "#FFD100",
  },
  {
    id: "orchestrator",
    name: "Orchestrator (Neon)",
    role_es: "Modo hibrido Antigravity (Planificador + Ejecutor)",
    role_en: "Antigravity hybrid workflow (Planner + Executor)",
    apiPrice_es: "Neon planifica/revisa + Hydrogen edita y corre pruebas",
    apiPrice_en: "Neon plans/reviews + Hydrogen edits & runs tests",
    subTier_es: "Google Antigravity IDE / CLI (AI Pro y AI Ultra)",
    subTier_en: "Google Antigravity IDE / CLI (AI Pro & AI Ultra)",
    aaScore: "11.75m vs 22.23m Solo",
    bestUse_es: "Repositorios multi-archivo donde dividir planeacion y ejecucion duplica la velocidad",
    bestUse_en: "Multi-file modular repos where plan+execute splitting halves wall time",
    accentHex: "#10B981",
  },
];

export const EP13_SUBSCRIPTION_PLANS = [
  {
    plan: "Free",
    price: "$0",
    storage: "15 GB",
    flowCredits: "-",
    models_es: "Modo Auto limitado (Hydrogen)",
    models_en: "Limited Auto access (Hydrogen)",
  },
  {
    plan: "Google AI Plus",
    price: "$4.99/mes",
    storage: "400 GB",
    flowCredits: "200 / mes",
    models_es: "2x limite · Gemini 4 Hydrogen",
    models_en: "2x quota · Gemini 4 Hydrogen",
  },
  {
    plan: "Google AI Pro",
    price: "$19.99/mes",
    storage: "5 TB",
    flowCredits: "1,000 / mes",
    models_es: "4x limite · Neon (reemplazo a Argon) + Hydrogen",
    models_en: "4x quota · Neon (replaces Argon) + Hydrogen",
  },
  {
    plan: "Google AI Ultra",
    price: "$99.99 - $199.99/mes",
    storage: "20 TB",
    flowCredits: "Max prioridad",
    models_es: "5x-20x limite · Exclusivo Gemini 4 Carbon + Neon",
    models_en: "5x-20x quota · Exclusive Gemini 4 Carbon + Neon",
  },
];

export const EP13_BENCHMARK_TOTALS = {
  score: "1 - 1 - 1 (R1-R3)",
  neon_points: 1,
  argon_points: 1,
  hydrogen_points: 1,
  neon_min: 17.22,
  argon_min: 28.85,
  hydrogen_min: 11.82,
  neon_usd: 2.5435,
  argon_usd: 1.1675,
  hydrogen_usd: 1.37,
  neon_tokens: "122.6K OUT",
  argon_tokens: "78.5K OUT",
  hydrogen_tokens: "120.4K OUT",
  neon_lines: 6354,
  argon_lines: 4773,
  hydrogen_lines: 5081,
};

export const EP13_CHALLENGES: Ep13SoloChallengeData[] = [
  {
    n: 1,
    dir: "01-levitacion-acustica-40khz",
    name_es: "Levitacion Acustica Ultrasonica 40 kHz (Potencial Gor'kov)",
    name_en: "40 kHz Ultrasonic Acoustic Levitation (Gor'kov Field)",
    world_es: "RETO 01 · ONDAS ESTACIONARIAS LAMBDA/2 = 4.28 MM",
    world_en: "CHALLENGE 01 · STANDING WAVES LAMBDA/2 = 4.28 MM",
    fun_fact_es:
      "Dato curioso real: A 40 kHz la longitud de onda en aire es 8.57 mm; un reflector concavo crea nodos de presion minima cada 4.28 mm donde gotas de agua levitan venciendo la gravedad sin tocar nada.",
    fun_fact_en:
      "Real physics: At 40 kHz, wavelength in air is 8.57 mm; a concave reflector traps water droplets inside low-pressure Gor'kov wells spaced every 4.28 mm in mid-air.",
    tech_es: "8 Gotas Levantadas + Inyector H2O + 99.4% Estabilidad Nodal (Argon)",
    tech_en: "8 Levitated Drops + H2O Injector + 99.4% Nodal Stability (Argon)",
    winner: "argon",
    winner_label_es: "PUNTO: ARGON (0 - 1 - 0)",
    winner_label_en: "POINT: ARGON (0 - 1 - 0)",
    neon: {
      min: 4.82,
      usd: 0.64,
      tok: "37.3K",
      lines: 2423,
      fps: "60 FPS (Elevador Fase + Vectores · Typo &sub0)",
      fps_en: "60 FPS (Phase Lift + Vectors · Minor HTML typo)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-neon/01-levitacion-acustica-40khz.html",
      stillUrl: "/brand/thumbs/ep13/R01_neon_t15.png",
    },
    argon: {
      min: 4.2,
      usd: 0.33,
      tok: "27.4K",
      lines: 1774,
      fps: "60 FPS (99.4% Estabilidad · 8 Gotas + Inyector)",
      fps_en: "60 FPS (99.4% Stability · 8 Drops + Injector)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-argon/01-levitacion-acustica-40khz.html",
      stillUrl: "/brand/thumbs/ep13/R01_argon_t15.png",
    },
    hydrogen: {
      min: 3.92,
      usd: 0.46,
      tok: "55.3K",
      lines: 1921,
      fps: "60 FPS (93.5% · Waterfall Spectrogram + WebAudio)",
      fps_en: "60 FPS (93.5% · Waterfall Spectrogram + Audio)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-hydrogen/01-levitacion-acustica-40khz.html",
      stillUrl: "/brand/thumbs/ep13/R01_hydrogen_t15.png",
    },
    verdict_es:
      "Argon se lleva el primer punto: cero errores visuales, el inyector de gotas mejor acabado y 99.4% de estabilidad nodal por apenas $0.33 USD.",
    verdict_en:
      "Argon opens the scoring 0-1-0: zero UI typos, slick animated injector nozzle, and 99.4% nodal stability for just $0.33 USD.",
  },
  {
    n: 2,
    dir: "02-origami-espacial-miura-ori",
    name_es: "Origami Espacial Miura-ori NASA (Panel 1 m2 a 25 m2)",
    name_en: "NASA Miura-ori Space Origami (1 m² to 25 m² Solar Array)",
    world_es: "RETO 02 · CINEMATICA RIGIDA 1-DOF EN ORBITA LEO",
    world_en: "CHALLENGE 02 · RIGID 1-DOF ORBITAL SOLAR DEPLOYMENT",
    fun_fact_es:
      "Dato curioso real: Disenado por Koryo Miura, este patron de paralelogramos tiene un solo grado de libertad rigido: jalar una esquina despliega todo el arreglo solar de golpe dentro del espacio.",
    fun_fact_en:
      "Real aerospace engineering: Designed by Koryo Miura, rigid parallelogram hinges give the sheet a single degree of freedom—pull one corner and all 64 facets deploy smoothly.",
    tech_es: "64 Facetas Exactas + Actuador 1-DOF + Huella XY y Perfil Gamma (Neon)",
    tech_en: "64 Crisp Facets + 1-DOF Actuator + XY Footprint & Profile (Neon)",
    winner: "neon",
    winner_label_es: "PUNTO: NEON (1 - 1 - 0)",
    winner_label_en: "POINT: NEON (1 - 1 - 0)",
    neon: {
      min: 5.48,
      usd: 0.72,
      tok: "40.7K",
      lines: 1826,
      fps: "60 FPS (64 Facetas · 1.00-25.00 m² Sin Solapes)",
      fps_en: "60 FPS (64 Facets · 1.00-25.00 m² Clean UI)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-neon/02-origami-espacial-miura-ori.html",
      stillUrl: "/brand/thumbs/ep13/R02_neon_t15.png",
    },
    argon: {
      min: 21.25,
      usd: 0.49,
      tok: "28.9K",
      lines: 1534,
      fps: "60 FPS (64 Facetas · 21.3m + Etiqueta Justa)",
      fps_en: "60 FPS (64 Facets · 21.3m + Minor Clip)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-argon/02-origami-espacial-miura-ori.html",
      stillUrl: "/brand/thumbs/ep13/R02_argon_t15.png",
    },
    hydrogen: {
      min: 1.8,
      usd: 0.32,
      tok: "26.1K",
      lines: 1569,
      fps: "60 FPS (48 Facetas PBR · Termino en 1.80 min)",
      fps_en: "60 FPS (48 PBR Facets · Finished in 1.80 min)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-hydrogen/02-origami-espacial-miura-ori.html",
      stillUrl: "/brand/thumbs/ep13/R02_hydrogen_t15.png",
    },
    verdict_es:
      "Neon empata 1-1-0: desplego las 64 facetas exactas de 1 a 25 m² con actuador en esquina y doble diagrama XY/perfil sin ningun texto recortado.",
    verdict_en:
      "Neon evens it 1-1-0: clean 64-facet 3D array from 1 to 25 m² with corner actuator vector and zero text clipping in nearly a quarter of Argon's runtime.",
  },
  {
    n: 3,
    dir: "03-litografia-euv-chips-2nm",
    name_es: "Fabrica de Chips 2 nm por Litografia EUV (Estano 13.5 nm)",
    name_en: "2 nm EUV Chip Lithography (50k/s Tin Droplet Plasma)",
    world_es: "RETO 03 · PLASMA 500,000 K + ESPEJOS BRAGG MO/SI",
    world_en: "CHALLENGE 03 · 500,000 K PLASMA + MO/SI BRAGG OPTICS",
    fun_fact_es:
      "Dato curioso real: Ningun lente de vidrio transmite luz EUV de 13.5 nm (la absorbe toda). Las maquinas disparan 50,000 gotas de estano/s con doble laser CO2 y rebotan el haz en espejos de 40 bicapas Mo/Si al vacio.",
    fun_fact_en:
      "Real physics: Glass absorbs 100% of 13.5 nm EUV light, so chipmakers vaporize 50,000 molten tin drops per second with dual CO2 pulses and guide light across 40-bilayer Mo/Si vacuum mirrors.",
    tech_es: "Cero Solapes + Esquema Multicapa 40 Bicapas Bragg (Hydrogen 1-1-1)",
    tech_en: "Zero Text Overlaps + Embedded 40-Bilayer Bragg Schematic (Hydrogen 1-1-1)",
    winner: "hydrogen",
    winner_label_es: "PUNTO: HYDROGEN (EMPATE 1-1-1)",
    winner_label_en: "POINT: HYDROGEN (1-1-1 TIE)",
    neon: {
      min: 6.92,
      usd: 1.18,
      tok: "44.6K",
      lines: 2105,
      fps: "60 FPS (Tren 6 Espejos + Curva Pancake · Leve Solape)",
      fps_en: "60 FPS (6-Mirror Train + Pancake Curve · Minor Overlap)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-neon/03-litografia-euv-chips-2nm.html",
      stillUrl: "/brand/thumbs/ep13/R03_neon_t15.png",
    },
    argon: {
      min: 3.4,
      usd: 0.34,
      tok: "22.2K",
      lines: 1465,
      fps: "60 FPS (98.6% Yield + Grilla FinFET GAA 2nm)",
      fps_en: "60 FPS (98.6% Yield + FinFET 2nm GAA Grid)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-argon/03-litografia-euv-chips-2nm.html",
      stillUrl: "/brand/thumbs/ep13/R03_argon_t15.png",
    },
    hydrogen: {
      min: 6.1,
      usd: 0.6,
      tok: "39.1K",
      lines: 1591,
      fps: "60 FPS (98.6% Yield · Cero Errores + Diagrama Bragg)",
      fps_en: "60 FPS (98.6% Yield · Zero Glitches + Bragg Inset)",
      demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-hydrogen/03-litografia-euv-chips-2nm.html",
      stillUrl: "/brand/thumbs/ep13/R03_hydrogen_t15.png",
    },
    verdict_es:
      "Hydrogen sella el triple empate 1-1-1: su maqueta EUV no encimo ni una etiqueta, explico visualmente las 40 capas Bragg Mo/Si y lidero velocidad total (11.82 min en los 3 retos).",
    verdict_en:
      "Hydrogen locks in a 1-1-1 three-way tie: zero label overlaps, clear 40-bilayer Mo/Si Bragg inset, and the fastest 3-challenge total at 11.82 minutes.",
  },
];

export const EP13_R04_MODULAR: {
  dir: string;
  name_es: string;
  name_en: string;
  fun_fact_es: string;
  fun_fact_en: string;
  winner: "orchestrator" | "neon_solo";
  orchestrator: Ep13ModularSide;
  neon_solo: Ep13ModularSide;
  verdict_es: string;
  verdict_en: string;
} = {
  dir: "04-rueda-falkirk-modular",
  name_es: "La Rueda de Falkirk en Escocia (Arquitectura Modular en 4 Archivos + Tests)",
  name_en: "Scotland's Falkirk Wheel (4-File Modular ES Build + Automated Tests)",
  fun_fact_es:
    "Dato curioso real: La Rueda de Falkirk eleva barcos 24 metros consumiendo apenas ~1.5 kWh por media vuelta (equivalente a hervir 8 teteras) gracias al Principio de Arquimedes: cada barco desaloja su propio peso en agua dejando ambas gondolas en ~500 t.",
  fun_fact_en:
    "Real engineering marvel: The Falkirk Wheel lifts boats 24 meters using only ~1.5 kWh per half-turn (~8 kettles) via Archimedes' principle—each vessel displaces its exact weight in water so both gondolas stay balanced at ~500 tons.",
  winner: "orchestrator",
  orchestrator: {
    min: 11.75,
    usd: 1.7411,
    usdNote_es: "$1.74 equiv Neon (12 pasos)",
    usdNote_en: "$1.74 Neon equiv (12 steps)",
    steps: 12,
    tok: "71.6K OUT",
    lines: 2885,
    testsPassed: true,
    testsLabel_es: "6/6 PRUEBAS PASS (node tests.mjs)",
    testsLabel_en: "6/6 TESTS PASS (node tests.mjs)",
    demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/orchestrator-neon/04-rueda-falkirk-modular/index.html",
    stillUrl: "/brand/thumbs/ep13/R04_orchestrator_t15.png",
  },
  neon_solo: {
    min: 22.23,
    usd: 2.4085,
    usdNote_es: "$2.41 USD reales (14 pasos)",
    usdNote_en: "$2.41 USD real (14 steps)",
    steps: 14,
    tok: "85.8K OUT",
    lines: 2926,
    testsPassed: true,
    testsLabel_es: "6/6 PRUEBAS PASS (node tests.mjs)",
    testsLabel_en: "6/6 TESTS PASS (node tests.mjs)",
    demoUrl: "/demos/ep13-ecosistema-gemini-4-neon/gemini-4-neon/04-rueda-falkirk-modular/index.html",
    stillUrl: "/brand/thumbs/ep13/R04_neon_t15.png",
  },
  verdict_es:
    "Ambos entregaron los 4 modulos ES separados (`index.html`, `physics.js`, `renderer.js`, `tests.mjs`) con 6/6 pruebas matematicas en verde al primer intento; pero Orchestrator (Neon planeando + Hydrogen ejecutando) termino en 11.75 min (casi el doble de rapido que los 22.23 min de Neon Solo) y con 28% menor costo equivalente.",
  verdict_en:
    "Both shipped clean 4-file ES modules (`index.html`, `physics.js`, `renderer.js`, `tests.mjs`) passing 6/6 automated physics assertions first try, yet Orchestrator (Neon planning + Hydrogen executing) finished in 11.75 min—nearly twice as fast as Neon Solo's 22.23 min at 28% lower equivalent token cost.",
};
