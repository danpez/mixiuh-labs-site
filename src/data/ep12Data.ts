export interface Ep12ModelMetric {
  min: number;
  usd: number;
  tok: string;
  lines: number;
  fps: string;
  fps_en: string;
  status: "ok" | "recovered";
  demoUrl: string;
  rescuedDemoUrl?: string;
  rescuedLines?: number;
  stillUrl: string;
}

export interface Ep12LiveArenaData {
  arenaUrl: string;
  logUrl: string;
  stillUrl: string;
  arenaWinner: "hydrogen" | "haiku" | "luna";
  score_es: string;
  score_en: string;
  summary_es: string;
  summary_en: string;
  keyLogs: Array<{ t: string; actor: string; msg_es: string; msg_en: string }>;
}

export interface Ep12ChallengeData {
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
  build_winner: "hydrogen" | "haiku" | "luna";
  winner_label_es: string;
  winner_label_en: string;
  hydrogen: Ep12ModelMetric;
  haiku: Ep12ModelMetric;
  luna: Ep12ModelMetric;
  arena: Ep12LiveArenaData;
  verdict_es: string;
  verdict_en: string;
}

export const EP12_BENCHMARK_TOTALS = {
  score: "6 - 2 - 4",
  hydrogen_points: 6,
  haiku_points: 2,
  luna_points: 4,
  hydrogen_min: 14.48,
  haiku_min: 147.03,
  luna_min: 58.66,
  hydrogen_usd: 2.26,
  haiku_usd: 1.66,
  luna_usd: 0.17,
  hydrogen_tokens: "176.0K OUT",
  haiku_tokens: "1.57M OUT",
  luna_tokens: "302.8K OUT",
  hydrogen_lines: 9766,
  haiku_lines: 4461,
  haiku_rescued_lines: 1129,
  luna_lines: 9145,
};

export const EP12_CHALLENGES: Ep12ChallengeData[] = [
  {
    n: 1,
    dir: "01-espejismo-fibra-optica",
    name_es: "Espejismo en Carretera y Fibra Optica Submarina (+ Rescate de Haiku)",
    name_en: "Highway Mirage & Undersea Fiber Optics (+ Haiku Recovery Round)",
    world_es: "RETO 01 · 2 PUNTOS (FASE A + ARENA OPTICA 100 GBPS + RECUPERACION HAIKU)",
    world_en: "CHALLENGE 01 · 2 POINTS (PHASE A + 100 GBPS OPTICAL ARENA + HAIKU RESCUE)",
    fun_fact_es:
      "Dato curioso real: El aparente charco en la carretera no es agua: es un pedazo del cielo refractado hacia arriba por la capa de aire ardiente pegada al asfalto, bajo la misma ley optica que confina los pulsos en la fibra submarina.",
    fun_fact_en:
      "Real-world fact: That shimmering highway puddle isn't water; hot air near the asphalt bends skylight upward via the same Snell refraction and total internal reflection that traps pulses inside undersea glass fiber.",
    tech_es: "Reflexion Interna Total (764 Rebotes) + Techo 256K Tokens Haiku + Arena Triple Laser",
    tech_en: "Total Internal Reflection (764 Bounces) + Haiku 256K Thinking Cap + 3-Way Laser Arena",
    build_winner: "hydrogen",
    winner_label_es: "BUILD Y ARENA: HYDROGEN (2 - 0 - 0)",
    winner_label_en: "BUILD & ARENA: HYDROGEN (2 - 0 - 0)",
    hydrogen: {
      min: 3.0,
      usd: 0.32,
      tok: "36.0K",
      lines: 1924,
      fps: "60 FPS (272 Paquetes en Solo · 0.24% Fuga)",
      fps_en: "60 FPS (272 Solo Packets · 0.24% Leakage)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gemini-4-hydrogen/01-espejismo-fibra-optica.html",
      stillUrl: "/brand/thumbs/ep12/R01_hydrogen_t15.png",
    },
    haiku: {
      min: 21.37,
      usd: 0.13,
      tok: "256K CAP",
      lines: 0,
      fps: "0 LOC 1er Intento (Rescate: 502 LOC · 35 Pkts)",
      fps_en: "0 LOC 1st Try (Rescued: 502 LOC · 35 Pkts)",
      status: "recovered",
      demoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5/01-espejismo-fibra-optica.html",
      rescuedDemoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5-recuperacion/01-espejismo-fibra-optica.html",
      rescuedLines: 502,
      stillUrl: "/brand/thumbs/ep12/R01_haiku_t15.png",
    },
    luna: {
      min: 9.48,
      usd: 0.02,
      tok: "45.0K",
      lines: 1513,
      fps: "60 FPS (15 Paquetes · 0% Fuga · $0.02 USD)",
      fps_en: "60 FPS (15 Packets · 0% Leakage · $0.02 USD)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gpt-6-luna/01-espejismo-fibra-optica.html",
      stillUrl: "/brand/thumbs/ep12/R01_luna_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep12-torneo-ligeros/arenas-en-vivo/01-espejismo-fibra-optica/index.html",
      logUrl: "/demos/ep12-torneo-ligeros/logs/arena_summary_ep12.json",
      stillUrl: "/brand/thumbs/ep12/R01_arena_t15.png",
      arenaWinner: "hydrogen",
      score_es: "ARENA OPTICA: HYDROGEN 251 PAQUETES SIN FUGA (764 REBOTES · 0.26% LEAK)",
      score_en: "OPTICAL ARENA: HYDROGEN 251 PACKETS (764 REFLECTIONS · 0.26% LEAK)",
      summary_es:
        "Haiku 5.5 en modo Extra agoto el techo de 256,000 tokens en 21.4 minutos sin escribir archivo en 1er intento; destrabado en Ronda de Recuperacion (502 LOC). En la Arena triple, Hydrogen entrego 251 paquetes con 764 reflexiones totales y apenas 0.26% de fuga.",
      summary_en:
        "Haiku 5.5 Extra burned 21.4 min and hit its 256K thinking ceiling with zero output on try 1 (unlocked via Recovery Round at 502 LOC). In the 3-way laser arena, Hydrogen delivered 251 packets across 764 total internal reflections with 0.26% leak.",
      keyLogs: [
        { t: "1er Try", actor: "HAIKU 5.5", msg_es: "21.37 min pensando -> agota techo 256K tokens sin archivo", msg_en: "21.37 min thinking -> hits 256K token cap with 0 LOC" },
        { t: "Rescate", actor: "HAIKU REC", msg_es: "Esfuerzo menor desbloquea simulador funcional (502 LOC)", msg_en: "Lower effort unlocks working simulator (502 LOC)" },
        { t: "15.0s", actor: "HYDROGEN", msg_es: "251 paquetes entregados (0.26% fuga) -> 2 - 0 - 0", msg_en: "251 packets delivered (0.26% leak) -> 2 - 0 - 0" },
      ],
    },
    verdict_es:
      "Barrida inicial 2-0-0 de Gemini 4 Hydrogen en apenas 3 minutos, exponiendo ademas el riesgo real de poner modelos ligeros al maximo esfuerzo sin tope de razonamiento como le paso a Haiku 5.5.",
    verdict_en:
      "Opening 2-0-0 sweep by Gemini 4 Hydrogen in just 3 minutes, also exposing the real timeout/ceiling risk of uncapped Extra thinking on lightweight models when Haiku 5.5 burned 256K tokens.",
  },
  {
    n: 2,
    dir: "02-air-hockey-triangular",
    name_es: "Air Hockey Triangular a 3 Porterias y 2 Discos Simultaneos",
    name_en: "Triangular 3-Goal Air Hockey with 2 Simultaneous Pucks",
    world_es: "RETO 02 · 2 PUNTOS (MESA DE 3 BANDAS + REBOTE DE 2 DISCOS)",
    world_en: "CHALLENGE 02 · 2 POINTS (3-SIDED AIR CUSHION + 2-PUCK ARENA)",
    fun_fact_es:
      "Dato curioso real: Una mesa real perfora mas de mil micro-orificios de aire comprimido que levitan el disco medio milimetro sobre un colchon sin friccion, lanzandolo por encima de 100 km/h.",
    fun_fact_en:
      "Real-world fact: An air-hockey rink drills over a thousand pressurized micro-jets that float the puck half a millimeter on frictionless air above 100 km/h.",
    tech_es: "Fisica de 2 Discos a 253.9 u/s + 9 Atajadas + Marcador Triple 17 - 9 - 8",
    tech_en: "2-Puck 253.9 px/s Collisions + 9 Verified Saves + Live Score 17 - 9 - 8",
    build_winner: "luna",
    winner_label_es: "BUILD Y ARENA: GPT-6 LUNA (2 - 0 - 2)",
    winner_label_en: "BUILD & ARENA: GPT-6 LUNA (2 - 0 - 2)",
    hydrogen: {
      min: 4.15,
      usd: 0.79,
      tok: "40.2K",
      lines: 1633,
      fps: "60 FPS (Mesa Sede + 8 Goles en Arena)",
      fps_en: "60 FPS (Host Rink + 8 Arena Goals)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gemini-4-hydrogen/02-air-hockey-triangular.html",
      stillUrl: "/brand/thumbs/ep12/R02_hydrogen_t15.png",
    },
    haiku: {
      min: 20.15,
      usd: 0.21,
      tok: "229.3K",
      lines: 1075,
      fps: "60 FPS (Vectores de Rebote + 9 Goles Arena)",
      fps_en: "60 FPS (Rebound Vectors + 9 Arena Goals)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5/02-air-hockey-triangular.html",
      stillUrl: "/brand/thumbs/ep12/R02_haiku_t15.png",
    },
    luna: {
      min: 9.26,
      usd: 0.02,
      tok: "43.7K",
      lines: 1693,
      fps: "60 FPS (Gana Build y Arena: 17 Goles por $0.02)",
      fps_en: "60 FPS (Wins Build & Arena: 17 Goals for $0.02)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gpt-6-luna/02-air-hockey-triangular.html",
      stillUrl: "/brand/thumbs/ep12/R02_luna_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep12-torneo-ligeros/arenas-en-vivo/02-air-hockey-triangular/index.html",
      logUrl: "/demos/ep12-torneo-ligeros/logs/arena_summary_ep12.json",
      stillUrl: "/brand/thumbs/ep12/R02_arena_t15.png",
      arenaWinner: "luna",
      score_es: "ARENA 3 BANDAS: LUNA [17] - HAIKU [9] - HYDROGEN [8]",
      score_en: "3-WAY HOCKEY: LUNA [17] - HAIKU [9] - HYDROGEN [8]",
      summary_es:
        "GPT-6 Luna construyo la mesa triangular mas fluida por 2 centavos y, ya con las 3 IAs defendiendo cada vertice con 2 discos a 253.9 u/s y 9 atajadas totales, Luna clavo 17 tantos para empatar 2-0-2.",
      summary_en:
        "GPT-6 Luna crafted the crispest triangular table for 2 cents, then dominated the 2-puck match (253.9 max puck speed, 9 saves) scoring 17 goals against Haiku's 9 and Hydrogen's 8.",
      keyLogs: [
        { t: "05.0s", actor: "LUNA EXTRA", msg_es: "Intercepta disco rapido en banda inferior", msg_en: "Intercepts fast puck off lower cushion" },
        { t: "10.0s", actor: "HAIKU 5.5", msg_es: "Logra 1,075 LOC al 1er intento y suma 9 goles", msg_en: "Completes 1,075 LOC 1st try and tallies 9 goals" },
        { t: "15.0s", actor: "FINAL", msg_es: "Luna 17 - Haiku 9 - Hydrogen 8 (Global 2-0-2)", msg_en: "Luna 17 - Haiku 9 - Hydrogen 8 (Overall 2-0-2)" },
      ],
    },
    verdict_es:
      "Despertar fulminante de GPT-6 Luna: empata el torneo 2-0-2 llevandose construccion y arena triangular por apenas $0.0242 USD.",
    verdict_en:
      "Breakout sweep for GPT-6 Luna: ties the tournament 2-0-2 by sweeping both build quality and the live 3-goal arena for just $0.0242 USD.",
  },
  {
    n: 3,
    dir: "03-subasta-ciega-maldicion",
    name_es: "Subasta Ciega y la Maldicion del Ganador (48 Puntos Bayesianos)",
    name_en: "Blind Container Auction & The Winner's Curse (48-Point Bayes)",
    world_es: "RETO 03 · 2 PUNTOS (ECONOMIA BAYESIANA VS SOBREPUJA + RESCATE HAIKU)",
    world_en: "CHALLENGE 03 · 2 POINTS (BAYESIAN VALUE VS WINNER'S CURSE)",
    fun_fact_es:
      "Dato curioso real: Cuando todos pujan por un activo de valor incierto con estimaciones ruidosas, quien hace la oferta ganadora suele ser quien mas se equivoco al alza, sufriendo la Maldicion del Ganador.",
    fun_fact_en:
      "Real-world fact: In common-value auctions with noisy private signals, the highest bidder is systematically the most over-optimistic, often losing money upon winning (the Winner's Curse).",
    tech_es: "Integral Gauss-Hermite 48 Puntos + 8 Lotes en Vivo + $12,831 Patrimonio Final",
    tech_en: "48-Point Bayesian Expectation + 8 Live Contested Lots + $12,831 Net Worth",
    build_winner: "hydrogen",
    winner_label_es: "BUILD Y ARENA: HYDROGEN (4 - 0 - 2)",
    winner_label_en: "BUILD & ARENA: HYDROGEN (4 - 0 - 2)",
    hydrogen: {
      min: 1.75,
      usd: 0.42,
      tok: "22.6K",
      lines: 1471,
      fps: "60 FPS (Integral Bayesiana -> $12,831 Final)",
      fps_en: "60 FPS (Bayesian Integral -> $12,831 Ending)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gemini-4-hydrogen/03-subasta-ciega-maldicion.html",
      stillUrl: "/brand/thumbs/ep12/R03_hydrogen_t15.png",
    },
    haiku: {
      min: 19.25,
      usd: 0.13,
      tok: "256K CAP",
      lines: 0,
      fps: "0 LOC 1er Intento (Rescate: 627 LOC · $9,941)",
      fps_en: "0 LOC 1st Try (Rescued: 627 LOC · $9,941)",
      status: "recovered",
      demoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5/03-subasta-ciega-maldicion.html",
      rescuedDemoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5-recuperacion/03-subasta-ciega-maldicion.html",
      rescuedLines: 627,
      stillUrl: "/brand/thumbs/ep12/R03_haiku_t15.png",
    },
    luna: {
      min: 7.86,
      usd: 0.03,
      tok: "46.6K",
      lines: 883,
      fps: "60 FPS ($10,237 Arena · $0.03 USD)",
      fps_en: "60 FPS ($10,237 Arena · $0.03 USD)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gpt-6-luna/03-subasta-ciega-maldicion.html",
      stillUrl: "/brand/thumbs/ep12/R03_luna_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep12-torneo-ligeros/arenas-en-vivo/03-subasta-ciega-maldicion/index.html",
      logUrl: "/demos/ep12-torneo-ligeros/logs/arena_summary_ep12.json",
      stillUrl: "/brand/thumbs/ep12/R03_arena_t15.png",
      arenaWinner: "hydrogen",
      score_es: "ARENA SUBASTA: HYDROGEN $12,831 VS LUNA $10,237 VS HAIKU $9,941",
      score_en: "AUCTION ARENA: HYDROGEN $12,831 VS LUNA $10,237 VS HAIKU $9,941",
      summary_es:
        "Desde $10,000 iniciales a lo largo de 8 lotes con 3 casos de maldicion del ganador, la integral bayesiana de Hydrogen evito sobrepujar y cerro en $12,831 (+$2,831 netos). Haiku requirio su segunda ronda de rescate (627 LOC).",
      summary_en:
        "Starting at $10,000 across 8 auction lots (3 Winner's Curse traps triggered), Hydrogen's Bayesian conditional shading grew bankroll to $12,831 (+$2,831 net). Haiku required its 2nd Recovery Round build (627 LOC).",
      keyLogs: [
        { t: "1er Try", actor: "HAIKU 5.5", msg_es: "19.25 min pensando -> agota techo 256K sin archivo", msg_en: "19.25 min thinking -> hits 256K ceiling with 0 LOC" },
        { t: "Rescate", actor: "HAIKU REC", msg_es: "Recuperacion genera estrategia de pujas (627 LOC)", msg_en: "Recovery delivers bidding policy (627 LOC)" },
        { t: "Lote 8", actor: "HYDROGEN", msg_es: "Caja neta $12,831 vs Luna $10,237 vs Haiku $9,941", msg_en: "Net worth $12,831 vs Luna $10,237 vs Haiku $9,941" },
      ],
    },
    verdict_es:
      "Superioridad algoritmica absoluta de Hydrogen en 1.75 minutos: no solo diseno el muelle mas legible, sino que su integral bayesiana fue la unica que genero beneficio solido frente a lotes trampa.",
    verdict_en:
      "Clear algorithmic edge for Hydrogen in 1.75 minutes: it won both the harbor simulator build and the live auction via Bayesian shading against overbidding traps.",
  },
  {
    n: 4,
    dir: "04-perros-pastores-rebano",
    name_es: "Perros Pastores y Fisica de Rebano (60 Ovejas sin Tocarlas)",
    name_en: "Sheepdogs & 60-Sheep Herd Magnetism Physics",
    world_es: "RETO 04 · 2 PUNTOS (VECTORES DE FLANQUEO + 3 CORRALES)",
    world_en: "CHALLENGE 04 · 2 POINTS (ARC FLANKING VS 3-CORRAL PRESSURE)",
    fun_fact_es:
      "Dato curioso real: Un perro pastor mueve cientos de ovejas sin morder ninguna porque cada animal huye hacia el centro de masa de sus vecinas al sentir presion; embestir de frente parte la manada.",
    fun_fact_en:
      "Real-world fact: A single sheepdog steers hundreds of sheep untouched by exploiting centripetal flock cohesion: every sheep steers toward herd center under threat, while charging straight splits it.",
    tech_es: "Modelo Boids de Manada (60 Ovejas · Cohesion 0.6208) + Arena 3 Corrales",
    tech_en: "60-Sheep Centripetal Flock Dynamics (0.6208 Cohesion) + 3-Pen Arena",
    build_winner: "hydrogen",
    winner_label_es: "BUILD Y ARENA: HYDROGEN (6 - 0 - 2)",
    winner_label_en: "BUILD & ARENA: HYDROGEN (6 - 0 - 2)",
    hydrogen: {
      min: 2.57,
      usd: 0.31,
      tok: "34.4K",
      lines: 1852,
      fps: "60 FPS (25 Ovejas Encerradas · 2.57 min)",
      fps_en: "60 FPS (25 Sheep Penned · 2.57 min)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gemini-4-hydrogen/04-perros-pastores-rebano.html",
      stillUrl: "/brand/thumbs/ep12/R04_hydrogen_t15.png",
    },
    haiku: {
      min: 35.39,
      usd: 0.64,
      tok: "222.3K",
      lines: 1192,
      fps: "60 FPS (Radio de Alerta · 35.39 min)",
      fps_en: "60 FPS (Panic Radius · 35.39 min)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5/04-perros-pastores-rebano.html",
      stillUrl: "/brand/thumbs/ep12/R04_haiku_t15.png",
    },
    luna: {
      min: 8.38,
      usd: 0.02,
      tok: "42.2K",
      lines: 1780,
      fps: "60 FPS (1,780 LOC por $0.02 USD)",
      fps_en: "60 FPS (1,780 LOC for $0.02 USD)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gpt-6-luna/04-perros-pastores-rebano.html",
      stillUrl: "/brand/thumbs/ep12/R04_luna_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep12-torneo-ligeros/arenas-en-vivo/04-perros-pastores-rebano/index.html",
      logUrl: "/demos/ep12-torneo-ligeros/logs/arena_summary_ep12.json",
      stillUrl: "/brand/thumbs/ep12/R04_arena_t15.png",
      arenaWinner: "hydrogen",
      score_es: "ARENA PASTOREO: HYDROGEN ENCIERRA 25 DE 60 OVEJAS VS HAIKU 0 Y LUNA 0",
      score_en: "HERDING ARENA: HYDROGEN PENS 25 OF 60 SHEEP VS HAIKU 0 & LUNA 0",
      summary_es:
        "Haiku invirtio 35.39 minutos ($0.64 USD — mas caro que Hydrogen en $0.31) y aun asi en la arena combinada de 60 ovejas (cohesion 0.6208) el perro de Hydrogen rodeo por los flancos y metio 25 ovejas a su corral antes de los 20s.",
      summary_en:
        "Haiku spent 35.39 min ($0.64 USD — over 2x Hydrogen's $0.31) yet in the shared 60-sheep arena (0.6208 cohesion), Hydrogen's flanking dog swept 25 sheep into its pen while Haiku and Luna scored zero.",
      keyLogs: [
        { t: "06.0s", actor: "HYDROGEN", msg_es: "Traza arco detras de ovejas rezagadas sin partir grupo", msg_en: "Arcs behind trailing stragglers without splitting" },
        { t: "12.0s", actor: "LUNA / HAIKU", msg_es: "Presionan demasiado cerca del centro; 0 en corral", msg_en: "Press too close to flock center; 0 penned" },
        { t: "15.0s", actor: "FINAL", msg_es: "Hydrogen 25 ovejas encerradas (6 - 0 - 2)", msg_en: "Hydrogen 25 sheep penned (6 - 0 - 2)" },
      ],
    },
    verdict_es:
      "Con este 6-0-2 matematico en apenas 15 segundos de arena, Gemini 4 Hydrogen ya se asegura no perder la tabla general y demuestra velocidad 13x mayor que Haiku en modo Extra.",
    verdict_en:
      "Moving to 6-0-2, Gemini 4 Hydrogen proves 13x faster execution than Haiku Extra here while delivering both the sharpest field vectors and decisive flanking herding.",
  },
  {
    n: 5,
    dir: "05-tablero-galton-campana",
    name_es: "Maquina de Galton, Electroimanes y Campana de Gauss",
    name_en: "Galton Marble Board, Electromagnets & Gaussian Bell Curve",
    world_es: "RETO 05 · 2 PUNTOS (ESTADISTICA + DESVIO DE CANICAS DORADAS)",
    world_en: "CHALLENGE 05 · 2 POINTS (GAUSSIAN FIT R²=0.9893 + GOLDEN DEFLECTORS)",
    fun_fact_es:
      "Dato curioso real: Aunque cada choque contra un clavo tiene 50% de probabilidad aleatoria a izquierda o derecha, cientos de rebotes convergen siempre en una distribucion normal suave (Campana de Gauss).",
    fun_fact_en:
      "Real-world fact: Even though each peg collision is a pure 50/50 coin flip left or right, stacking 14 layers of pegs forces hundreds of marbles into the smooth Gaussian Bell Curve.",
    tech_es: "Ajuste R² = 0.9893 (Solo) / 0.9484 (Arena) + Pulsos Magneticos sobre 5x Doradas",
    tech_en: "R² = 0.9893 Solo Curve Fit + 30 Active Marbles + 5x Gold Gate Steering",
    build_winner: "haiku",
    winner_label_es: "BUILD Y ARENA: HAIKU 5.5 (6 - 2 - 2)",
    winner_label_en: "BUILD & ARENA: HAIKU 5.5 (6 - 2 - 2)",
    hydrogen: {
      min: 1.52,
      usd: 0.22,
      tok: "21.9K",
      lines: 1423,
      fps: "60 FPS (217 PTS Arena · 1.52 min)",
      fps_en: "60 FPS (217 Arena PTS · 1.52 min)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gemini-4-hydrogen/05-tablero-galton-campana.html",
      stillUrl: "/brand/thumbs/ep12/R05_hydrogen_t15.png",
    },
    haiku: {
      min: 26.24,
      usd: 0.31,
      tok: "313.0K",
      lines: 1006,
      fps: "60 FPS (Gana Build R²=0.9893 y Arena 227 PTS)",
      fps_en: "60 FPS (Wins Build R²=0.9893 & Arena 227 PTS)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5/05-tablero-galton-campana.html",
      stillUrl: "/brand/thumbs/ep12/R05_haiku_t15.png",
    },
    luna: {
      min: 12.24,
      usd: 0.03,
      tok: "60.9K",
      lines: 861,
      fps: "60 FPS (208 PTS · 140 Bolas · $0.03 USD)",
      fps_en: "60 FPS (208 PTS · 140 Balls · $0.03 USD)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gpt-6-luna/05-tablero-galton-campana.html",
      stillUrl: "/brand/thumbs/ep12/R05_luna_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep12-torneo-ligeros/arenas-en-vivo/05-tablero-galton-campana/index.html",
      logUrl: "/demos/ep12-torneo-ligeros/logs/arena_summary_ep12.json",
      stillUrl: "/brand/thumbs/ep12/R05_arena_t15.png",
      arenaWinner: "haiku",
      score_es: "ARENA GALTON: HAIKU 227 PTS VS HYDROGEN 217 VS LUNA 208 (R² 0.9484)",
      score_en: "GALTON ARENA: HAIKU 227 PTS VS HYDROGEN 217 VS LUNA 208 (R² 0.9484)",
      summary_es:
        "Despertar completo de Claude Haiku 5.5: su tablero obtuvo ajuste gaussiano R²=0.9893 en solo, y en la arena triple de energia limitada priorizo las canicas doradas de valor quintuple para sumar 227 pts con apenas 119 bolas (vs 125 Hydrogen y 140 Luna).",
      summary_en:
        "Full comeback by Claude Haiku 5.5: its build hit R²=0.9893 Gaussian fit solo, and inside the shared magnet-energy arena it targeted 5x golden marbles to win 227 pts with only 119 balls (vs 125 Hydrogen, 140 Luna).",
      keyLogs: [
        { t: "05.0s", actor: "LUNA EXTRA", msg_es: "Captura volumen alto de bolas normales (140 total)", msg_en: "Captures high volume of regular marbles (140 total)" },
        { t: "10.0s", actor: "HAIKU 5.5", msg_es: "Reserva energia magnetica para doradas 5x centrales", msg_en: "Saves coil pulse budget for center-lane 5x goldens" },
        { t: "15.0s", actor: "FINAL", msg_es: "Haiku 227 pts vs Hydrogen 217 vs Luna 208 -> 6-2-2", msg_en: "Haiku 227 pts vs Hydrogen 217 vs Luna 208 -> 6-2-2" },
      ],
    },
    verdict_es:
      "Doblete limpio para Claude Haiku 5.5 (6 - 2 - 2): demostro que cuando logra completar su sintesis sin chocar contra el tope de tokens, su criterio estadistico compite al tu por tu.",
    verdict_en:
      "Clean double for Claude Haiku 5.5 (6 - 2 - 2): showing that when it clears code synthesis cleanly without stalling at the thinking cap, its analytical control is genuinely sharp.",
  },
  {
    n: 6,
    dir: "06-sumo-robots-iman",
    name_es: "Sumo Japones de Robots con Imanes de Neodimio en Acero",
    name_en: "Magnetic Neodymium Robot Sumo in Solid Steel Dohyo Ring",
    world_es: "RETO 06 · 2 PUNTOS (IMANES 10X + FINTA LATERAL Y KO POR INERCIA)",
    world_en: "CHALLENGE 06 · 2 POINTS (10X DOWNFORCE + SIDESTEP KNOCKOUTS)",
    fun_fact_es:
      "Dato curioso real: Los robots All-Japan de sumo compiten sobre acero macizo usando imanes de neodimio que multiplican su agarre 10x sobre su propio peso y cuchillas inferiores que levantan al rival por debajo.",
    fun_fact_en:
      "Real-world fact: All-Japan autonomous sumo bots battle on solid steel rings with neodymium magnets multiplying grip 10x and razor-sharp front wedges to slip underneath opponents.",
    tech_es: "2,415 Lineas + Impacto Pico 1,042.5 N + 14 Expulsiones (Luna 14-12-4)",
    tech_en: "2,415 LOC + 1,042.5 Peak Force + 14 Ring-Outs (Luna 14 - Hydrogen 12 - Haiku 4)",
    build_winner: "luna",
    winner_label_es: "BUILD Y ARENA: LUNA (FINAL 6 - 2 - 4)",
    winner_label_en: "BUILD & ARENA: LUNA (FINAL 6 - 2 - 4)",
    hydrogen: {
      min: 1.5,
      usd: 0.2,
      tok: "20.9K",
      lines: 1463,
      fps: "60 FPS (12 Puntos Arena · 1.50 min)",
      fps_en: "60 FPS (12 Arena PTS · 1.50 min)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gemini-4-hydrogen/06-sumo-robots-iman.html",
      stillUrl: "/brand/thumbs/ep12/R06_hydrogen_t15.png",
    },
    haiku: {
      min: 24.63,
      usd: 0.25,
      tok: "298.3K",
      lines: 1188,
      fps: "60 FPS (4 Puntos Arena · Agarre Magnetico)",
      fps_en: "60 FPS (4 Arena PTS · Magnetic Grip HUD)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/claude-haiku-5.5/06-sumo-robots-iman.html",
      stillUrl: "/brand/thumbs/ep12/R06_haiku_t15.png",
    },
    luna: {
      min: 11.44,
      usd: 0.04,
      tok: "64.5K",
      lines: 2415,
      fps: "60 FPS (2,415 LOC + 14 Pts Sumo por $0.04)",
      fps_en: "60 FPS (2,415 LOC + 14 Sumo Pts for $0.04)",
      status: "ok",
      demoUrl: "/demos/ep12-torneo-ligeros/gpt-6-luna/06-sumo-robots-iman.html",
      stillUrl: "/brand/thumbs/ep12/R06_luna_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep12-torneo-ligeros/arenas-en-vivo/06-sumo-robots-iman/index.html",
      logUrl: "/demos/ep12-torneo-ligeros/logs/arena_summary_ep12.json",
      stillUrl: "/brand/thumbs/ep12/R06_arena_t15.png",
      arenaWinner: "luna",
      score_es: "ARENA SUMO: LUNA 14 PTS VS HYDROGEN 12 VS HAIKU 4 (14 EXPULSIONES)",
      score_en: "SUMO ARENA: LUNA 14 PTS VS HYDROGEN 12 VS HAIKU 4 (14 KOs)",
      summary_es:
        "GPT-6 Luna escribio el simulador mas ambicioso (2,415 lineas con chispas e inclinacion magnetica) y en la arena triple con 14 expulsiones (1,042.5 de impacto) ejecuto fintas laterales que mandaron fuera por inercia a los rivales para cerrar 14-12-4.",
      summary_en:
        "GPT-6 Luna authored the deepest build (2,415 LOC with wedge tilt and impact sparks), then executed sidestep dodges inside the steel dohyo (14 knockouts, 1,042.5 peak force) to outscore Hydrogen 14-12-4.",
      keyLogs: [
        { t: "04.5s", actor: "HYDROGEN", msg_es: "Embiste frontal directo y suma 12 puntos rapidos", msg_en: "Charges head-on for 12 quick ring-out points" },
        { t: "10.0s", actor: "LUNA EXTRA", msg_es: "Esquiva lateral deja que el rival salga por inercia", msg_en: "Sidestep dodge sends charging attacker over rim" },
        { t: "15.0s", actor: "FINAL", msg_es: "Luna 14 - Hydrogen 12 - Haiku 4 -> Final 6 - 2 - 4", msg_en: "Luna 14 - Hydrogen 12 - Haiku 4 -> Final 6 - 2 - 4" },
      ],
    },
    verdict_es:
      "Cierre de campeonato brillante: Gemini 4 Hydrogen se corona campeon 6-2-4 siendo 4x mas rapido (14.48 min), pero GPT-6 Luna da el campanazo economico entregando 9,145 lineas y 4 puntos completos por apenas $0.17 USD en total.",
    verdict_en:
      "Dramatic tournament finish: Gemini 4 Hydrogen claims the 6-2-4 championship at 4x speed (14.48 min), while GPT-6 Luna delivers 9,145 LOC and 4 points for an astonishing $0.17 USD grand total.",
  },
];
