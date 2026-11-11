export interface Ep10ModelMetric {
  min: number;
  usd: number;
  tok: string;
  lines: number;
  fps: string;
  fps_en: string;
  status: "ok";
  demoUrl: string;
  stillUrl: string;
}

export interface Ep10LiveArenaData {
  arenaUrl: string;
  logUrl: string;
  stillUrl: string;
  hostModel: "carbon" | "fable52";
  arenaWinner: "carbon" | "fable52";
  loggedActions: number;
  score_es: string;
  score_en: string;
  summary_es: string;
  summary_en: string;
  keyLogs: Array<{ t: string; actor: string; msg_es: string; msg_en: string }>;
}

export interface Ep10ChallengeData {
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
  build_winner: "carbon" | "fable52";
  winner_label_es: string;
  winner_label_en: string;
  carbon: Ep10ModelMetric;
  fable52: Ep10ModelMetric;
  arena?: Ep10LiveArenaData;
  verdict_es: string;
  verdict_en: string;
}

export const EP10_BENCHMARK_TOTALS = {
  score: "7 - 3",
  build_score: "4 - 2",
  arena_score: "3 - 1",
  fable52_points: 7,
  carbon_points: 3,
  fable52_min: 152.4,
  carbon_min: 95.6,
  fable52_usd: 23.35,
  carbon_usd: 8.20,
  fable52_tokens: "879.7K OUT (605.6K THINK)",
  carbon_tokens: "468.9K OUT",
  fable52_lines: 9626,
  carbon_lines: 20246,
  total_logged_plays: 430,
};

export const EP10_CHALLENGES: Ep10ChallengeData[] = [
  {
    n: 1,
    dir: "01-rascacielos-sismo-taipei",
    name_es: "Rascacielos Sismo M8.2 y Pendulo Dorado del Taipei 101",
    name_en: "M8.2 Earthquake Skyscraper & Taipei 101's 660-Ton Pendulum",
    world_es: "RETO 01 · CONSTRUCCION FASE A · INGENIERIA SISMICA EN VIVO",
    world_en: "CHALLENGE 01 · PHASE A BUILD · LIVE SEISMIC ENGINEERING",
    fun_fact_es:
      "Dato curioso real: Entre los pisos 87 y 92 del Taipei 101 cuelga una esfera dorada de acero de 660 toneladas que se balancea en sentido opuesto al terremoto, absorbiendo hasta el 40% de la oscilacion.",
    fun_fact_en:
      "Real-world fact: Suspended between floors 87 and 92 of Taipei 101 hangs a 660-ton golden steel sphere that swings opposite the earthquake, absorbing up to 40% of tower sway.",
    tech_es: "Torres Gemelas 22 Pisos + Amortiguador TMD 660t + Fractura de Columnas en Vivo",
    tech_en: "22-Story Twin Towers + 660t Tuned Mass Damper + Live Column Fracture Physics",
    build_winner: "carbon",
    winner_label_es: "CONSTRUCCION: CARBON (GLOBAL 0 - 1 CARBON)",
    winner_label_en: "BUILD WINNER: CARBON (OVERALL 0 - 1 CARBON)",
    carbon: {
      min: 14.4,
      usd: 1.26,
      tok: "78.5K",
      lines: 2994,
      fps: "60 FPS (5/18 Columnas Fracturadas + Zoom TMD 660t)",
      fps_en: "60 FPS (5/18 Fractured Columns + 660t TMD Zoom)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/gemini-4-carbon/01-rascacielos-sismo-taipei.html",
      stillUrl: "/brand/thumbs/ep10/R01_carbon_t10.png",
    },
    fable52: {
      min: 43.7,
      usd: 4.85,
      tok: "177.5K",
      lines: 1291,
      fps: "60 FPS (142K Tokens Calculo Modal Exacto)",
      fps_en: "60 FPS (142K Modal Physics Thinking Tokens)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/claude-fable-5.2/01-rascacielos-sismo-taipei.html",
      stillUrl: "/brand/thumbs/ep10/R01_fable52_t10.png",
    },
    verdict_es:
      "Gemini 4 Carbon termino 3 veces mas rapido y por $3.59 menos ($1.26 vs $4.85), iluminando 5 de 18 columnas fracturadas al rojo vivo en la torre sin pendulo con camara dedicada al amortiguador de 660 toneladas.",
    verdict_en:
      "Gemini 4 Carbon delivered 3x faster for $3.59 less ($1.26 vs $4.85), highlighting 5 of 18 glowing fractured columns on the unprotected tower plus a dedicated zoom viewport on the 660-ton damper.",
  },
  {
    n: 2,
    dir: "02-cabina-dj-dual-vivo",
    name_es: "Cabina DJ Dual en Vivo y Fisica del Muro Vecino",
    name_en: "Live Dual DJ Booth & Brick-Wall Bass Physics",
    world_es: "RETO 02 · CONSTRUCCION FASE A · SINTESIS WEB AUDIO Y FFT",
    world_en: "CHALLENGE 02 · PHASE A BUILD · WEB AUDIO DSP & MIRRORED FFT",
    fun_fact_es:
      "Dato curioso real: Un agudo de 6,000 Hz mide apenas 5.7 cm y rebota contra el ladrillo, pero un bajo de 50 Hz mide casi 7 metros de largo y envuelve el muro entero de tu habitacion.",
    fun_fact_en:
      "Real-world fact: A crisp 6,000 Hz hi-hat wave is 5.7 cm long and bounces off concrete, whereas a 50 Hz bass wave stretches 6.9 meters long and bends straight through walls.",
    tech_es: "2 Tornamesas Procedurales + Beat-Sync + Espectro FFT Espejo + Filtro Fiesta Vecina",
    tech_en: "Dual Procedural Decks + Beat-Sync + Mirrored FFT + Neighbor Wall Low-Pass Filter",
    build_winner: "fable52",
    winner_label_es: "CONSTRUCCION: FABLE 5.2 (GLOBAL 1 - 1)",
    winner_label_en: "BUILD WINNER: FABLE 5.2 (OVERALL TIED 1 - 1)",
    carbon: {
      min: 19.2,
      usd: 1.66,
      tok: "80.2K",
      lines: 3670,
      fps: "60 FPS (8 Pads de Samples + Crossfader Dual)",
      fps_en: "60 FPS (8 Sample Pads + Dual Synth Crossfader)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/gemini-4-carbon/02-cabina-dj-dual-vivo.html",
      stillUrl: "/brand/thumbs/ep10/R02_carbon_t10.png",
    },
    fable52: {
      min: 27.6,
      usd: 4.66,
      tok: "172.7K",
      lines: 1700,
      fps: "60 FPS (Ondas RGB Serato + Diagrama 5.7cm vs 6.9m)",
      fps_en: "60 FPS (Serato RGB Waves + 5.7cm vs 6.9m Wall Diagram)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/claude-fable-5.2/02-cabina-dj-dual-vivo.html",
      stillUrl: "/brand/thumbs/ep10/R02_fable52_t10.png",
    },
    verdict_es:
      "Claude Fable 5.2 empato el duelo con ondas multicolores deslizantes dignas de software profesional de club y un diagrama acustico en vivo que dibuja las ondas de 5.7 cm rebotando y las de 6.9 m cruzando el muro.",
    verdict_en:
      "Claude Fable 5.2 tied the match with club-grade RGB scrolling waveforms, mirrored deck spectrums, and an animated brick-wall diagram contrasting 5.7 cm highs against 6.9 m bass waves.",
  },
  {
    n: 3,
    dir: "03-urgencias-hospital-ia",
    name_es: "Sala de Urgencias Hospital IA (Construccion + Duelo Gemelo en Vivo)",
    name_en: "Hospital ER Triage AI (Build + Live Twin-Wing Triage Duel)",
    world_es: "RETO 03 · 2 PUNTOS (FASE A + FASE B EN HOSPITAL GANADOR)",
    world_en: "CHALLENGE 03 · 2 POINTS (PHASE A BUILD + PHASE B LIVE ARENA)",
    fun_fact_es:
      "Regla de Arena Viva: Carbon construyo el mejor hospital (8 UCIs + 3 ORs con ECG vivo), asi que clonamos el hospital de Carbon en dos alas gemelas alimentadas por la misma semilla de ambulancias (20261103).",
    fun_fact_en:
      "Live Arena Rule: Carbon built the superior hospital UI (8 ICUs + 3 ORs with live ECGs), so we cloned Carbon's hospital into twin wings fed by identical ambulance surges (seed 20261103).",
    tech_es: "Codigo Manchester 5 Colores + Preempcion de Camas + 199 Decisiones en JSON",
    tech_en: "5-Color Manchester Triage + Bed Preemption + 199 Logged JSON Decisions",
    build_winner: "carbon",
    winner_label_es: "BUILD: CARBON · ARENA: FABLE 37-33 (GLOBAL 2 - 2)",
    winner_label_en: "BUILD: CARBON · ARENA: FABLE 37-33 (TIED 2 - 2)",
    carbon: {
      min: 15.6,
      usd: 1.35,
      tok: "79.9K",
      lines: 3699,
      fps: "60 FPS (Hospital Sede · 33 Salvadas / 2.67s Roja)",
      fps_en: "60 FPS (Host Hospital · 33 Saved / 2.67s Red Wait)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/gemini-4-carbon/03-urgencias-hospital-ia.html",
      stillUrl: "/brand/thumbs/ep10/R03_carbon_t10.png",
    },
    fable52: {
      min: 18.0,
      usd: 2.93,
      tok: "115.5K",
      lines: 1476,
      fps: "60 FPS (Gana Arena Viva · 37 Salvadas / 2.08s Roja)",
      fps_en: "60 FPS (Wins Live Arena · 37 Saved / 2.08s Red Wait)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/claude-fable-5.2/03-urgencias-hospital-ia.html",
      stillUrl: "/brand/thumbs/ep10/R03_fable52_t10.png",
    },
    arena: {
      arenaUrl: "/demos/ep10-carbon-vs-fable/arenas-en-vivo/03-urgencias-hospital-ia/index.html",
      logUrl: "/demos/ep10-carbon-vs-fable/logs/arena_R03_hospital.json",
      stillUrl: "/brand/thumbs/ep10/R03_arena_end.png",
      hostModel: "carbon",
      arenaWinner: "fable52",
      loggedActions: 199,
      score_es: "FABLE 5.2 SALVA 37 PACIENTES (2.08s) VS CARBON 33 (2.67s)",
      score_en: "FABLE 5.2 SAVES 37 PATIENTS (2.08s) VS CARBON 33 (2.67s)",
      summary_es:
        "Dentro del propio hospital de Carbon, los 199 logs JSON revelaron que Carbon hizo 17 preempciones de cama vs solo 12 de Fable 5.2; al evitar traslados innecesarios, Fable libero cubiculos antes y dio de alta a 4 pacientes mas en 72s sin una sola muerte.",
      summary_en:
        "Inside Carbon's own hospital, 199 logged JSON events showed Carbon triggered 17 bed preemptions vs Fable's surgical 12 — keeping corridors clearer so Fable discharged 37 rescued patients vs 33 with zero deaths.",
      keyLogs: [
        { t: "00.0s", actor: "CARBON", msg_es: "PREEMPT P-105 de UCI-06 con UCI-04 libre", msg_en: "PREEMPT P-105 from UCI-06 while UCI-04 open" },
        { t: "00.0s", actor: "FABLE 5.2", msg_es: "ASSIGN P-110 directo a UCI-04 sin desalojar", msg_en: "ASSIGN P-110 directly into open UCI-04" },
        { t: "13.0s", actor: "FABLE 5.2", msg_es: "PUENTE OR: transfiere critico directo a OR-01", msg_en: "OR BRIDGE: routes red surgical patient to OR-01" },
        { t: "72.1s", actor: "FINAL", msg_es: "Fable 37 altas (2.08s) vs Carbon 33 (2.67s)", msg_en: "Fable 37 saved (2.08s) vs Carbon 33 (2.67s)" },
      ],
    },
    verdict_es:
      "Reparto apasionante: Gemini 4 Carbon gano la construccion del simulador ($1.35 USD), y Claude Fable 5.2 se metio a su hospital para robarle el punto en vivo 37 altas contra 33.",
    verdict_en:
      "Thrilling split: Gemini 4 Carbon won the simulator build ($1.35 USD), and Claude Fable 5.2 stepped inside Carbon's hospital to win the live triage duel 37 saved lives to 33.",
  },
  {
    n: 4,
    dir: "04-batalla-naval-sonar",
    name_es: "Batalla Naval con Sonar Bayesiano (Serie al Mejor de 3)",
    name_en: "Bayesian Naval Sonar Warfare (Live Best-of-3 Series)",
    world_es: "RETO 04 · 2 PUNTOS (FASE A + SERIE BO3 EN TABLERO DE FABLE)",
    world_en: "CHALLENGE 04 · 2 POINTS (PHASE A + LIVE BO3 IN FABLE'S BOARD)",
    fun_fact_es:
      "Historia real: En 1968 el matematico John Craven uso cuadriculas de inferencia bayesiana para localizar el submarino desaparecido USS Scorpion a mas de 3,000 metros bajo el Atlantico.",
    fun_fact_en:
      "Real history: In 1968 mathematician John Craven used Bayesian probability grids to locate the lost submarine USS Scorpion more than 3,000 meters beneath the Atlantic.",
    tech_es: "Mapa de Calor de Probabilidad 10x10 + Serie BO3 + 189 Tiros en JSON",
    tech_en: "10x10 Live Bayesian Heatmap + Best-of-3 Series + 189 Logged Shots",
    build_winner: "fable52",
    winner_label_es: "DOBLE PUNTO FABLE: BUILD + SERIE 2-0 (GLOBAL 4 - 2)",
    winner_label_en: "2 PTS FABLE: BUILD + 2-0 SWEEP (FABLE LEADS 4 - 2)",
    carbon: {
      min: 14.2,
      usd: 1.23,
      tok: "72.7K",
      lines: 3120,
      fps: "60 FPS (31.9% Precision en Serie · 30 Impactos)",
      fps_en: "60 FPS (31.9% Series Hit Accuracy · 30 Hits)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/gemini-4-carbon/04-batalla-naval-sonar.html",
      stillUrl: "/brand/thumbs/ep10/R04_carbon_t10.png",
    },
    fable52: {
      min: 16.3,
      usd: 2.78,
      tok: "109.3K",
      lines: 1654,
      fps: "60 FPS (Tablero Sede + Barre 2-0 con 35.4% Hit)",
      fps_en: "60 FPS (Host Board + Sweeps 2-0 at 35.4% Hit)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/claude-fable-5.2/04-batalla-naval-sonar.html",
      stillUrl: "/brand/thumbs/ep10/R04_fable52_t10.png",
    },
    arena: {
      arenaUrl: "/demos/ep10-carbon-vs-fable/arenas-en-vivo/04-batalla-naval-sonar/index.html",
      logUrl: "/demos/ep10-carbon-vs-fable/logs/arena_R04_naval.json",
      stillUrl: "/brand/thumbs/ep10/R04_arena_end.png",
      hostModel: "fable52",
      arenaWinner: "fable52",
      loggedActions: 189,
      score_es: "SERIE BO3: CLAUDE FABLE 5.2 [2] - [0] GEMINI 4 CARBON",
      score_en: "BO3 SERIES: CLAUDE FABLE 5.2 [2] - [0] GEMINI 4 CARBON",
      summary_es:
        "En ambas partidas Carbon dejo a Fable con una sola Fragata viva, pero la inferencia por densidad y paridad de Fable 5.2 cerro en 46 y 48 tiros, hundiendo el ultimo submarino en E9 con 100% de certeza.",
      summary_en:
        "Carbon pushed Fable down to a single surviving Frigate in both games, yet Fable's parity-density solver closed in 46 and 48 shots, sinking Carbon's final submarine at E9 with 100% certainty.",
      keyLogs: [
        { t: "J1 T17", actor: "CARBON", msg_es: "Dispara A4 -> Hunde Portaaviones de Fable", msg_en: "Fires A4 -> Sinks Fable's Carrier early" },
        { t: "J1 T42", actor: "FABLE 5.2", msg_es: "Dispara F3 (99.5%) -> Hunde Acorazado", msg_en: "Fires F3 (99.5%) -> Sinks Battleship" },
        { t: "J1 T92", actor: "FABLE 5.2", msg_es: "Gana Juego 1 (46 tiros, 17 impactos)", msg_en: "Wins Game 1 (46 shots, 17 hits)" },
        { t: "J2 T95", actor: "FABLE 5.2", msg_es: "Dispara E9 (100%) -> Hunde Submarino (2-0)", msg_en: "Fires E9 (100%) -> Sinks Submarine (2-0)" },
      ],
    },
    verdict_es:
      "Dominio naval completo de Claude Fable 5.2: construyo el tablero mas claro y luego derroto 2 a 0 a la funcion tactica de Carbon a lo largo de 189 disparos verificados.",
    verdict_en:
      "Full naval sweep by Claude Fable 5.2: winning both the probability visualizer build and the live Best-of-3 series 2-0 across 189 audited shots.",
  },
  {
    n: 5,
    dir: "05-futbol-robot-2v2",
    name_es: "Futbol Robotico 2v2 RoboCup (Estadio + Goleada en Vivo)",
    name_en: "2v2 Autonomous Robot Soccer (Stadium Build + Live Match)",
    world_es: "RETO 05 · 2 PUNTOS (ESTADIO DE FABLE + BATACAZO 3-0 DE CARBON)",
    world_en: "CHALLENGE 05 · 2 POINTS (FABLE STADIUM + CARBON 3-0 SHUTOUT)",
    fun_fact_es:
      "Dato real RoboCup: Cuando ambos robots persiguen el balon sin dividirse roles de delantero y portero, cualquier rebote termina en gol en contra.",
    fun_fact_en:
      "RoboCup robotics fact: When both bots chase the ball together instead of splitting striker and goalkeeper roles, any counter-bounce rolls into an empty net.",
    tech_es: "Choques Elasticos 60 FPS + Pastillas Turbo + Rotacion Delantero/Portero",
    tech_en: "60 FPS Elastic Physics + Boost Pads + Dynamic Striker/Keeper Role Split",
    build_winner: "fable52",
    winner_label_es: "BUILD: FABLE · PARTIDO: CARBON 3-0 (GLOBAL 5 - 3)",
    winner_label_en: "BUILD: FABLE · MATCH: CARBON 3-0 (FABLE LEADS 5 - 3)",
    carbon: {
      min: 16.5,
      usd: 1.47,
      tok: "75.6K",
      lines: 3275,
      fps: "60 FPS (GOLEA 3-0 EN VIVO · 4 Atajadas · 55.9% Pos)",
      fps_en: "60 FPS (WINS 3-0 LIVE · 4 Saves · 55.9% Possession)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/gemini-4-carbon/05-futbol-robot-2v2.html",
      stillUrl: "/brand/thumbs/ep10/R05_carbon_t10.png",
    },
    fable52: {
      min: 22.7,
      usd: 3.77,
      tok: "150.0K",
      lines: 1790,
      fps: "60 FPS (Estadio Sede · Tiro Max 1,085 u/s · 0-3)",
      fps_en: "60 FPS (Host Stadium · 1,085 u/s Max Shot · 0-3)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/claude-fable-5.2/05-futbol-robot-2v2.html",
      stillUrl: "/brand/thumbs/ep10/R05_fable52_t10.png",
    },
    arena: {
      arenaUrl: "/demos/ep10-carbon-vs-fable/arenas-en-vivo/05-futbol-robot-2v2/index.html",
      logUrl: "/demos/ep10-carbon-vs-fable/logs/arena_R05_soccer.json",
      stillUrl: "/brand/thumbs/ep10/R05_arena_end.png",
      hostModel: "fable52",
      arenaWinner: "carbon",
      loggedActions: 14,
      score_es: "PARTIDO OFICIAL: GEMINI 4 CARBON [3] - [0] CLAUDE FABLE 5.2",
      score_en: "OFFICIAL MATCH: GEMINI 4 CARBON [3] - [0] CLAUDE FABLE 5.2",
      summary_es:
        "La gran sorpresa del episodio: jugando dentro del propio estadio de Fable 5.2, los dos robots de Gemini 4 Carbon tuvieron 55.9% de posesion, taparon 4 disparos a quemarropa (incluyendo un misil a 1,085 u/s) y golearon 3 a 0.",
      summary_en:
        "Shock of the episode: competing inside Fable 5.2's own stadium, Gemini 4 Carbon's bots held 55.9% possession, made 4 goal-line saves including a 1,085 u/s rocket, and shut out Fable 3-0.",
      keyLogs: [
        { t: "08.57s", actor: "CAR-1", msg_es: "GOL 1-0! Disparo cruzado a 546 u/s", msg_en: "GOAL 1-0! Angled strike at 546 u/s" },
        { t: "15.26s", actor: "CARBON", msg_es: "GOL 2-0! Presion alta fuerza desvio de FAB-2", msg_en: "GOAL 2-0! High press forces FAB-2 deflection" },
        { t: "15.74s", actor: "CAR-1", msg_es: "ATAJADA en la linea ante misil de 1,085 u/s", msg_en: "MONSTER SAVE on goal line vs 1,085 u/s rocket" },
        { t: "33.42s", actor: "CARBON", msg_es: "GOL 3-0! Rebote a 868 u/s sella la goleada", msg_en: "GOAL 3-0! 868 u/s rebound seals the shutout" },
      ],
    },
    verdict_es:
      "Fable 5.2 construyo el estadio mas vistoso con faros conicos y vectores tacticos, pero la coordinacion ofensiva y defensiva de Gemini 4 Carbon lo goleo 3 a 0 en su propia cancha.",
    verdict_en:
      "Fable 5.2 built the flashier stadium with headlight cones and vector HUDs, then Gemini 4 Carbon's striker-keeper brain stormed onto that pitch and won 3-0.",
  },
  {
    n: 6,
    dir: "06-isla-lava-bomberman",
    name_es: "Isla de Lava Bomberman (Arena Volcanica + Supervivencia BO3)",
    name_en: "Shrinking Lava Island Bomberman (Volcanic Build + Survival BO3)",
    world_es: "RETO 06 · 2 PUNTOS FINALES · ULTIMO ROBOT CON VIDA GANA",
    world_en: "CHALLENGE 06 · FINAL 2 POINTS · LAST BOT ALIVE WINS",
    fun_fact_es:
      "Regla de oro en IA de juegos: Plantar una bomba sin verificar antes una ruta BFS de escape de 3 pasos o ignorar el reloj del anillo de lava equivale a auto-eliminarse.",
    fun_fact_en:
      "Game AI golden rule: Dropping a bomb without first verifying a 3-step BFS safe tile — or ignoring the 10-second lava collapse timer — guarantees self-elimination.",
    tech_es: "Cuadricula 13x11 + Bombas en Cruz + Anillo de Lava cada 10s + Vision Peligro IA",
    tech_en: "13x11 Grid + Chain-Reaction Crosses + 10s Lava Ring + Live AI Danger Overlay",
    build_winner: "fable52",
    winner_label_es: "DOBLE PUNTO FABLE · MARCADOR FINAL: FABLE [7] - [3] CARBON",
    winner_label_en: "2 PTS FABLE · FINAL SCORE: FABLE [7] - [3] CARBON",
    carbon: {
      min: 15.7,
      usd: 1.22,
      tok: "82.1K",
      lines: 3488,
      fps: "60 FPS (Eliminado por Anillo de Lava en R1 y R2)",
      fps_en: "60 FPS (Caught by Shrinking Lava Ring in R1 & R2)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/gemini-4-carbon/06-isla-lava-bomberman.html",
      stillUrl: "/brand/thumbs/ep10/R06_carbon_t10.png",
    },
    fable52: {
      min: 24.3,
      usd: 4.36,
      tok: "154.8K",
      lines: 1715,
      fps: "60 FPS (Arena Sede + Sobrevive 2-0 · 34 Cajas)",
      fps_en: "60 FPS (Host Arena + Sweeps Survival 2-0 · 34 Crates)",
      status: "ok",
      demoUrl: "/demos/ep10-carbon-vs-fable/claude-fable-5.2/06-isla-lava-bomberman.html",
      stillUrl: "/brand/thumbs/ep10/R06_fable52_t10.png",
    },
    arena: {
      arenaUrl: "/demos/ep10-carbon-vs-fable/arenas-en-vivo/06-isla-lava-bomberman/index.html",
      logUrl: "/demos/ep10-carbon-vs-fable/logs/arena_R06_lava.json",
      stillUrl: "/brand/thumbs/ep10/R06_arena_end.png",
      hostModel: "fable52",
      arenaWinner: "fable52",
      loggedActions: 28,
      score_es: "SUPERVIVENCIA BO3: CLAUDE FABLE 5.2 [2] - [0] GEMINI 4 CARBON",
      score_en: "SURVIVAL BO3: CLAUDE FABLE 5.2 [2] - [0] GEMINI 4 CARBON",
      summary_es:
        "En 28 eventos registrados, Fable 5.2 abrio paso rapido hacia el centro seguro con rango de explosion 4, mientras Carbon quedo atrapado en el borde al segundo 18.68 (R1) y en (0,1) justo al hundirse el primer anillo al segundo 10.0 (R2).",
      summary_en:
        "Across 28 logged events, Fable 5.2 carved straight into safe interior ground with range-4 blasts, whereas Carbon got caught on the rim at 18.68s (R1) and on outer tile (0,1) right as Ring 1 sank into magma at 10.0s (R2).",
      keyLogs: [
        { t: "R1 10.8s", actor: "FABLE 5.2", msg_es: "Asegura centro (10,5) con rango 4", msg_en: "Claims center (10,5) with blast range 4" },
        { t: "R1 18.7s", actor: "LAVA", msg_es: "CARBON tragado por lava -> Punto Fable (1-0)", msg_en: "CARBON swallowed by lava -> Fable leads 1-0" },
        { t: "R2 09.7s", actor: "CARBON", msg_es: "Planta bomba en (0,1) a 0.3s del colapso", msg_en: "Drops bomb at (0,1) 0.3s before sink" },
        { t: "R2 10.0s", actor: "CAMPEON", msg_es: "Anillo 1 hunde (0,1) -> Fable gana 2-0 (7-3)", msg_en: "Ring 1 sinks (0,1) -> Fable sweeps 2-0 (7-3)" },
      ],
    },
    verdict_es:
      "Claude Fable 5.2 sella el campeonato 7 puntos a 3 dominando tanto el diseno volcanico con capa de vision de peligro como la supervivencia tactica frente al magma.",
    verdict_en:
      "Claude Fable 5.2 clinches the 7-to-3 championship, winning both the volcanic arena build with AI danger vision and the live survival series.",
  },
];
