export interface Ep11ThinkingLevelData {
  key: "low" | "medium" | "high" | "xhigh";
  label_es: string;
  label_en: string;
  sec: number;
  min: number;
  usd: number;
  outTokens: number;
  lines: number;
  summary_es: string;
  summary_en: string;
  demoUrl: string;
  stillUrl: string;
}

export interface Ep11ModelMetric {
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

export interface Ep11LiveArenaData {
  arenaUrl: string;
  logUrl: string;
  stillUrl: string;
  arenaWinner: "hydrogen" | "flash";
  score_es: string;
  score_en: string;
  summary_es: string;
  summary_en: string;
  keyLogs: Array<{ t: string; actor: string; msg_es: string; msg_en: string }>;
}

export interface Ep11ChallengeData {
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
  build_winner: "hydrogen" | "flash";
  winner_label_es: string;
  winner_label_en: string;
  hydrogen: Ep11ModelMetric;
  flash: Ep11ModelMetric;
  arena?: Ep11LiveArenaData;
  verdict_es: string;
  verdict_en: string;
}

export const EP11_THINKING_LEVELS: Ep11ThinkingLevelData[] = [
  {
    key: "low",
    label_es: "Nivel Bajo (Low)",
    label_en: "Low Thinking",
    sec: 49,
    min: 0.82,
    usd: 0.139,
    outTokens: 13085,
    lines: 1037,
    summary_es: "Termina en 49 segundos ($0.14 USD), pero con desviacion de apenas 18 px y 0 bolas embocadas.",
    summary_en: "Finishes in 49 seconds ($0.14 USD), with only 18 px curve bend and 0 pocketed balls.",
    demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen-low/01-billar-curva-masse.html",
    stillUrl: "/brand/thumbs/ep11/R01_h4_low_t04.png",
  },
  {
    key: "medium",
    label_es: "Nivel Medio (Medium)",
    label_en: "Medium Thinking",
    sec: 177,
    min: 2.95,
    usd: 0.3651,
    outTokens: 36653,
    lines: 1794,
    summary_es: "Tarda 2.95 min ($0.37 USD), escribe 1,794 lineas y ya calcula una curva de 485 px alrededor del bloqueo.",
    summary_en: "Takes 2.95 min ($0.37 USD), writes 1,794 lines, and bends shots up to 485 px around obstacles.",
    demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen-medium/01-billar-curva-masse.html",
    stillUrl: "/brand/thumbs/ep11/R01_h4_med_t04.png",
  },
  {
    key: "high",
    label_es: "Nivel Alto (High)",
    label_en: "High Thinking",
    sec: 296,
    min: 4.93,
    usd: 0.6697,
    outTokens: 64888,
    lines: 2630,
    summary_es: "Sube a 4.93 min ($0.67 USD), agrega 2,630 lineas con giro 3D completo a 1,634 rpm y emboca desde el primer disparo.",
    summary_en: "Runs 4.93 min ($0.67 USD), ships 2,630 lines with full 1,634 rpm 3D spin, and sinks balls cleanly.",
    demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen-high/01-billar-curva-masse.html",
    stillUrl: "/brand/thumbs/ep11/R01_h4_high_t04.png",
  },
  {
    key: "xhigh",
    label_es: "Modo Extra (xHigh)",
    label_en: "Extra Thinking (xHigh)",
    sec: 640,
    min: 10.67,
    usd: 1.1824,
    outTokens: 101815,
    lines: 2447,
    summary_es: "Razona 101,815 tokens durante 10.67 min ($1.18 USD) para entregar esfera 3D de impacto, deslizamiento + curva y 3 tiros de exhibicion.",
    summary_en: "Reasons through 101,815 tokens over 10.67 min ($1.18 USD) to deliver a 3D impact sphere, skid+curve phases, and 3 trick shots.",
    demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/01-billar-curva-masse.html",
    stillUrl: "/brand/thumbs/ep11/R01_hydrogen_t04.png",
  },
];

export const EP11_BENCHMARK_TOTALS = {
  score: "7 - 2",
  build_score: "4 - 2",
  arena_score: "3 - 0",
  hydrogen_points: 7,
  flash_points: 2,
  hydrogen_min: 22.83,
  flash_min: 11.3,
  hydrogen_usd: 3.22,
  flash_usd: 0.58,
  hydrogen_tokens: "260.7K OUT",
  flash_tokens: "102.8K OUT",
  hydrogen_lines: 11565,
  flash_lines: 7445,
};

export const EP11_CHALLENGES: Ep11ChallengeData[] = [
  {
    n: 1,
    dir: "01-billar-curva-masse",
    name_es: "Billar con Curva Masse a 70 Grados (+ Prueba de 4 Niveles)",
    name_en: "70-Degree Masse Curve Pool (+ 4 Thinking Levels Test)",
    world_es: "RETO 01 · FASE A · MECANICA DE DESLIZAMIENTO Y CURVA 3D",
    world_en: "CHALLENGE 01 · PHASE A · 3D SPIN & FRICTION CURVE PHYSICS",
    fun_fact_es:
      "Dato curioso real: Cuando golpeas la bola blanca con el taco inclinado entre 45 y 80 grados, primero patina en linea recta y despues la friccion del pano transforma el giro en una curva cerrada.",
    fun_fact_en:
      "Real-world fact: Striking the cue ball with a 45 to 80 degree elevated cue causes an initial straight skid before cloth friction turns the back-side spin into a tight bend.",
    tech_es: "Esfera 3D de Impacto + Fase Deslizamiento vs Rodamiento + 3 Tiros de Exhibicion",
    tech_en: "3D Cue-Tip Impact Sphere + Skid-to-Roll Phase Split + 3 Preset Trick Shots",
    build_winner: "hydrogen",
    winner_label_es: "CONSTRUCCION: HYDROGEN EXTRA (1 - 0)",
    winner_label_en: "BUILD WINNER: HYDROGEN EXTRA (1 - 0)",
    hydrogen: {
      min: 10.67,
      usd: 1.18,
      tok: "101.8K",
      lines: 2447,
      fps: "60 FPS (Esfera 3D + Curva en S + 246.4 px Desvio)",
      fps_en: "60 FPS (3D Impact Sphere + S-Curve + 246.4 px Bend)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/01-billar-curva-masse.html",
      stillUrl: "/brand/thumbs/ep11/R01_hydrogen_t15.png",
    },
    flash: {
      min: 2.65,
      usd: 0.12,
      tok: "22.4K",
      lines: 1444,
      fps: "60 FPS (Mesa Limpia en 2.65 min)",
      fps_en: "60 FPS (Clean Table in 2.65 min)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-3.8-flash/01-billar-curva-masse.html",
      stillUrl: "/brand/thumbs/ep11/R01_flash_t15.png",
    },
    verdict_es:
      "Flash 3.8 entrego una mesa funcional en 2.65 minutos ($0.12 USD), pero Hydrogen en modo Extra separo deslizamiento de curvatura, incluyo esfera de impacto 3D y emboco la bola negra rodeando el bloqueo.",
    verdict_en:
      "Flash 3.8 built a clean working table in 2.65 minutes ($0.12 USD), while Hydrogen Extra split skid vs rolling friction, added an interactive 3D cue-tip sphere, and sank the 8-ball around the guard balls.",
  },
  {
    n: 2,
    dir: "02-fuegos-artificiales-hanabi",
    name_es: "Pirotecnia Japonesa Hanabi: El Secreto del Fuego Azul",
    name_en: "Japanese Hanabi Fireworks: The Chemistry of Blue Skyfire",
    world_es: "RETO 02 · FASE A · QUIMICA TERMICA Y RETRASO ACUSTICO (343 M/S)",
    world_en: "CHALLENGE 02 · PHASE A · COPPER THERMOCHEMISTRY & 343 M/S SOUND DELAY",
    fun_fact_es:
      "Dato curioso real: El azul es el color mas dificil en pirotecnia; usa cloruro de cobre, y si la combustion rebasa ~1,200 C la molecula se descompone y el color se lava a blanco.",
    fun_fact_en:
      "Real-world fact: Blue is the hardest firework color; copper chloride decomposes above ~1,200 C, washing the sapphire flame out to white unless buffered cleanly.",
    tech_es: "Corte Transversal Warimono + 1,150 Chispas en Reflejo de Lago + Onda a 343 m/s",
    tech_en: "Warimono Cross-Section Shell + 1,150 Sparks w/ Lake Ripples + 343 m/s Wave",
    build_winner: "hydrogen",
    winner_label_es: "CONSTRUCCION: HYDROGEN EXTRA (2 - 0)",
    winner_label_en: "BUILD WINNER: HYDROGEN EXTRA (2 - 0)",
    hydrogen: {
      min: 2.32,
      usd: 0.46,
      tok: "28.8K",
      lines: 1854,
      fps: "60 FPS (1,150 Chispas + Reflejo en Lago + 2.17s Audio)",
      fps_en: "60 FPS (1,150 Sparks + Lake Reflection + 2.17s Audio Delay)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/02-fuegos-artificiales-hanabi.html",
      stillUrl: "/brand/thumbs/ep11/R02_hydrogen_t15.png",
    },
    flash: {
      min: 1.68,
      usd: 0.08,
      tok: "16.2K",
      lines: 1193,
      fps: "60 FPS (335 Chispas + Corte 3 Capas)",
      fps_en: "60 FPS (335 Sparks + 3-Layer Cutaway)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-3.8-flash/02-fuegos-artificiales-hanabi.html",
      stillUrl: "/brand/thumbs/ep11/R02_flash_t15.png",
    },
    verdict_es:
      "En 2.32 minutos, Hydrogen ilumino el cielo con 1,150 chispas reflejadas sobre olas reales del lago, cuatro sales metalicas intercambiables y onda expansiva acustica retardada 2.17 segundos.",
    verdict_en:
      "In 2.32 minutes, Hydrogen lit up the night with 1,150 sparks mirrored on real lake ripples, four swappable metal salts, and a 2.17-second speed-of-sound shockwave.",
  },
  {
    n: 3,
    dir: "03-esclusas-canal-panama",
    name_es: "Esclusas del Canal de Panama: 80,000 Toneladas Sin Bombas",
    name_en: "Panama Canal Locks: Lifting 80,000 Tons Without Pumps",
    world_es: "RETO 03 · FASE A · VASOS COMUNICANTES POR GRAVEDAD",
    world_en: "CHALLENGE 03 · PHASE A · GRAVITY-FED COMMUNICATING VESSELS",
    fun_fact_es:
      "Dato curioso real: Cada transito eleva barcos gigantes 26 metros hasta el Lago Gatun usando unicamente vasos comunicantes por gravedad desde el lago, con cero bombas electricas.",
    fun_fact_en:
      "Real-world fact: Every transit lifts mega-ships 26 meters toward Gatun Lake using gravity-fed underground culverts and zero electric water pumps.",
    tech_es: "3 Escalones de 26 Metros + Compuertas en Mitra + Caudal en m3/s",
    tech_en: "3 Stepped 26m Chambers + Miter Lock Gates + Live m3/s Culvert Flow",
    build_winner: "flash",
    winner_label_es: "CONSTRUCCION: FLASH 3.8 (2 - 1 HYDROGEN)",
    winner_label_en: "BUILD WINNER: FLASH 3.8 (2 - 1 HYDROGEN)",
    hydrogen: {
      min: 2.43,
      usd: 0.50,
      tok: "29.0K",
      lines: 1457,
      fps: "60 FPS (Corte Tecnico + Locomotoras Mula)",
      fps_en: "60 FPS (Technical Cutaway + Electric Mules)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/03-esclusas-canal-panama.html",
      stillUrl: "/brand/thumbs/ep11/R03_hydrogen_t15.png",
    },
    flash: {
      min: 1.43,
      usd: 0.07,
      tok: "13.9K",
      lines: 1016,
      fps: "60 FPS (Visualizacion Didactica en 1.43 min)",
      fps_en: "60 FPS (Clear Hydrostatic Flow in 1.43 min)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-3.8-flash/03-esclusas-canal-panama.html",
      stillUrl: "/brand/thumbs/ep11/R03_flash_t15.png",
    },
    verdict_es:
      "Primer punto claro para Gemini 3.8 Flash: en 1.43 minutos y por solo 7 centavos entrego la lectura hidraulica mas transparente para seguir paso a paso el ascenso por gravedad con 0 kWh en bombeo.",
    verdict_en:
      "First clear point to Gemini 3.8 Flash: in 1.43 minutes for just 7 cents, it produced the cleanest hydraulic readout of gravity-fed chamber leveling at 0 kWh pumping.",
  },
  {
    n: 4,
    dir: "04-maquina-garra-peluches",
    name_es: "Maquina de Garra Trucada (24V a 9V) + Duelo IA vs IA",
    name_en: "Rigged Claw Machine (24V to 9V) + Live AI vs AI Duel",
    world_es: "RETO 04 · 2 PUNTOS (FASE A + FASE B EN CABINA GEMELA)",
    world_en: "CHALLENGE 04 · 2 POINTS (PHASE A + TWIN-CABINET AI DUEL)",
    fun_fact_es:
      "Dato curioso real: Las maquinas de garra comerciales sujetan con 24 voltios al cerrar y caen a ~9 voltios al subir en turnos sin premio programado, dejando resbalar la carga por peso.",
    fun_fact_en:
      "Real-world fact: Arcade claw machines grip at 24 volts on pickup and step down to ~9 volts during the lift on non-payout turns so heavy prizes slip free.",
    tech_es: "Solenoide 24V->9V + Osciloscopio en Vivo + Arena Semilla 20261116",
    tech_en: "24V->9V Coil Solenoid + Live Oscilloscope + Dual-Rig Arena (Seed 20261116)",
    build_winner: "hydrogen",
    winner_label_es: "BUILD Y ARENA: HYDROGEN (4 - 1)",
    winner_label_en: "BUILD & ARENA: HYDROGEN (4 - 1)",
    hydrogen: {
      min: 3.9,
      usd: 0.41,
      tok: "47.9K",
      lines: 2155,
      fps: "60 FPS (Osciloscopio 24V/9V + Enganche Lateral)",
      fps_en: "60 FPS (24V/9V Oscilloscope + Off-Center Ring Hook)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/04-maquina-garra-peluches.html",
      stillUrl: "/brand/thumbs/ep11/R04_hydrogen_t15.png",
    },
    flash: {
      min: 2.57,
      usd: 0.14,
      tok: "21.4K",
      lines: 1498,
      fps: "60 FPS (Agarre Central + Cabina Arcade)",
      fps_en: "60 FPS (Center-Grab Logic + Arcade Cabinet)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-3.8-flash/04-maquina-garra-peluches.html",
      stillUrl: "/brand/thumbs/ep11/R04_flash_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep11-hydrogen-vs-flash/arenas-en-vivo/04-maquina-garra-peluches/index.html",
      logUrl: "/demos/ep11-hydrogen-vs-flash/logs/arena_summary_ep11.json",
      stillUrl: "/brand/thumbs/ep11/R04_arena_t15.png",
      arenaWinner: "hydrogen",
      score_es: "ARENA GARRA: HYDROGEN ENGANCHA ARO Y PENDULO VS FLASH AL CENTRO",
      score_en: "CLAW ARENA: HYDROGEN HOOKS RING & PENDULUM VS FLASH DEAD-CENTER",
      summary_es:
        "En dos cabinas gemelas con caida confirmada a 9V (auditoria `currentVoltage: 9`), Flash apunto al centro geometrico sufriendo deslizamiento, mientras Hydrogen desplazo la pinza para enganchar aros y lanzar premios con balanceo pendular.",
      summary_en:
        "Inside twin rigged cabinets verified dropping to 9V (`currentVoltage: 9`), Flash grabbed dead center and slipped, whereas Hydrogen offset its claw to hook prize rings and sling with pendulum momentum.",
      keyLogs: [
        { t: "03.0s", actor: "VOLTAJE", msg_es: "Bobina cae de 24V a 9V al iniciar ascenso", msg_en: "Solenoid steps down 24V -> 9V on lift" },
        { t: "07.0s", actor: "FLASH 3.8", msg_es: "Intenta agarre simetrico; capsula resbala a 9V", msg_en: "Attempts dead-center pinch; capsule slips at 9V" },
        { t: "11.0s", actor: "HYDROGEN", msg_es: "Alinea diente lateral en el aro + impulso pendular", msg_en: "Offsets prong into prize ring + pendulum fling" },
      ],
    },
    verdict_es:
      "Doble golpe de Gemini 4 Hydrogen: sumo punto en construccion por su osciloscopio de caida a 9 voltios y se llevo la primera arena combinando enganche lateral con tiro pendular.",
    verdict_en:
      "Double strike for Gemini 4 Hydrogen: won build quality with its live 9V drop oscilloscope and took the twin-cabinet AI arena using ring-hooking plus pendulum swing.",
  },
  {
    n: 5,
    dir: "05-curling-olimpico-termico",
    name_es: "Curling Olimpico y Mapa Termico de Barrido (+ Arena en Hielo)",
    name_en: "Olympic Curling & Ice Sweep Thermal Map (+ Live Ice Arena)",
    world_es: "RETO 05 · 2 PUNTOS (CONSTRUCCION FLASH · ARENA HYDROGEN)",
    world_en: "CHALLENGE 05 · 2 POINTS (BUILD FLASH · ARENA HYDROGEN)",
    fun_fact_es:
      "Dato curioso real: Barrer frente a una piedra de granito de 20 kg derrite momentaneamente las gotitas congeladas del hielo en una micro-pelicula liquida, estirando el tiro hasta 3 metros.",
    fun_fact_en:
      "Real-world fact: Sweeping ahead of a 20 kg Scottish granite stone transiently melts ice pebble crests into a micro-film of water, extending glide by up to 3 meters.",
    tech_es: "Curl Asimetrico + Mapa Termico de Friccion + Duelo Tactico de Guardias y Takeouts",
    tech_en: "Asymmetric Curl + Thermal Friction Map + Live Guard & Double-Takeout AI",
    build_winner: "flash",
    winner_label_es: "BUILD: FLASH · ARENA: HYDROGEN (5 - 2)",
    winner_label_en: "BUILD: FLASH · ARENA: HYDROGEN (5 - 2)",
    hydrogen: {
      min: 1.82,
      usd: 0.33,
      tok: "28.0K",
      lines: 1968,
      fps: "60 FPS (Distancia 0.52 m al Tee + Marcador 1-0)",
      fps_en: "60 FPS (0.52 m to Tee + Arena Score 1 - 0)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/05-curling-olimpico-termico.html",
      stillUrl: "/brand/thumbs/ep11/R05_hydrogen_t15.png",
    },
    flash: {
      min: 1.47,
      usd: 0.08,
      tok: "14.4K",
      lines: 1173,
      fps: "60 FPS (Pista Clara en 1.47 min · 7.22 m)",
      fps_en: "60 FPS (Clean Sheet in 1.47 min · 7.22 m)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-3.8-flash/05-curling-olimpico-termico.html",
      stillUrl: "/brand/thumbs/ep11/R05_flash_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep11-hydrogen-vs-flash/arenas-en-vivo/05-curling-olimpico-termico/index.html",
      logUrl: "/demos/ep11-hydrogen-vs-flash/logs/arena_summary_ep11.json",
      stillUrl: "/brand/thumbs/ep11/R05_arena_t15.png",
      arenaWinner: "hydrogen",
      score_es: "ARENA HIELO: HYDROGEN GANA 1 - 0 (0.52 M DEL BOTON CENTRAL)",
      score_en: "ICE ARENA: HYDROGEN WINS 1 - 0 (0.52 M FROM TEE BUTTON)",
      summary_es:
        "Flash gano la construccion visual en 1.47 minutos ($0.08 USD), pero sobre el hielo vivo Hydrogen evaluo 4 trayectorias candidatas para rodear piedras de guardia, ejecuto doble takeout y cerro 1-0 a 0.52 m del boton.",
      summary_en:
        "Flash took the build point in 1.47 minutes ($0.08 USD), yet on live ice Hydrogen simulated 4 candidate curls to bypass guard stones, nailed a double takeout, and led 1-0 just 0.52 m from the tee.",
      keyLogs: [
        { t: "04.0s", actor: "FLASH 3.8", msg_es: "Lanza con velocidades fijas y deja piedras expuestas", msg_en: "Throws fixed speeds leaving guards exposed" },
        { t: "09.0s", actor: "HYDROGEN", msg_es: "Prueba 4 curvas candidatas alrededor de la guardia", msg_en: "Tests 4 candidate curls around guard stones" },
        { t: "15.0s", actor: "FINAL", msg_es: "Marcador 1-0 Hydrogen (distancia minima 0.52 m)", msg_en: "Score 1-0 Hydrogen (closest distance 0.52 m)" },
      ],
    },
    verdict_es:
      "Empate parcial repartido: Flash construyo la pista mas legible de leer en 1.47 minutos, y Hydrogen le remonto dentro de su propio hielo simulando 4 curvas antes de tirar.",
    verdict_en:
      "Split challenge: Flash built the sharpest readable rink in 1.47 minutes, then Hydrogen swept inside Flash's ice by simulating 4 candidate curls before releasing each stone.",
  },
  {
    n: 6,
    dir: "06-grua-puerto-pendulo",
    name_es: "Grua Portuaria 40t Anti-Pendulo (+ Duelo de Descarga)",
    name_en: "40t Anti-Sway Port Crane (+ Live Container Duel)",
    world_es: "RETO 06 · 2 PUNTOS (DOBLE TIRON E INPUT SHAPING ZVD)",
    world_en: "CHALLENGE 06 · 2 POINTS (PHASE A + DOUBLE-PULSE ZVD DUEL)",
    fun_fact_es:
      "Dato curioso real: Para frenar un contenedor de 40 toneladas colgado a 50 metros sin golpear el buque, se aplica un doble tiron en contrafase que cancela la energia del pendulo.",
    fun_fact_en:
      "Real-world fact: Stopping a 40-ton container hanging 50 meters high without smashing the vessel requires ZVD input shaping: a timed counter-pulse that cancels swing energy.",
    tech_es: "Grua Fantasma Sin Control + Controlador de 4o Orden (8.42° vs 73.46° Sway)",
    tech_en: "Ghost Open-Loop Crane + 4th-Order Input Shaping (8.42° vs 73.46° Sway)",
    build_winner: "hydrogen",
    winner_label_es: "BUILD Y ARENA: HYDROGEN (FINAL 7 - 2)",
    winner_label_en: "BUILD & ARENA: HYDROGEN (FINAL 7 - 2)",
    hydrogen: {
      min: 1.7,
      usd: 0.35,
      tok: "25.2K",
      lines: 1684,
      fps: "60 FPS (Entrega 1 Contenedor · 8.42° Oscilacion Max)",
      fps_en: "60 FPS (Delivers 1st Box · 8.42° Max Sway)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-4-hydrogen/06-grua-puerto-pendulo.html",
      stillUrl: "/brand/thumbs/ep11/R06_hydrogen_t15.png",
    },
    flash: {
      min: 1.5,
      usd: 0.08,
      tok: "14.4K",
      lines: 1121,
      fps: "60 FPS (0 Entregas al 15s · 73.46° Pendulo Max)",
      fps_en: "60 FPS (0 Delivered at 15s · 73.46° Peak Sway)",
      status: "ok",
      demoUrl: "/demos/ep11-hydrogen-vs-flash/gemini-3.8-flash/06-grua-puerto-pendulo.html",
      stillUrl: "/brand/thumbs/ep11/R06_flash_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep11-hydrogen-vs-flash/arenas-en-vivo/06-grua-puerto-pendulo/index.html",
      logUrl: "/demos/ep11-hydrogen-vs-flash/logs/arena_summary_ep11.json",
      stillUrl: "/brand/thumbs/ep11/R06_arena_t15.png",
      arenaWinner: "hydrogen",
      score_es: "ARENA PUERTO: HYDROGEN ENTREGA CONTENEDOR (8.42° SWAY) VS FLASH (73.46°)",
      score_en: "PORT ARENA: HYDROGEN DELIVERS BOX (8.42° MAX SWAY) VS FLASH (73.46°)",
      summary_es:
        "En la medicion a 15 segundos del duelo gemelo (`arena_summary_ep11.json`), Hydrogen deposito 1 contenedor limpio con apenas 8.42° de balanceo maximo frente a 73.46° descontrolados de Flash 3.8 (0 entregas).",
      summary_en:
        "At the 15-second checkpoint of the twin crane duel (`arena_summary_ep11.json`), Hydrogen landed 1 container cleanly with only 8.42° max sway compared to 73.46° un-damped swing from Flash 3.8 (0 deliveries).",
      keyLogs: [
        { t: "04.5s", actor: "FLASH 3.8", msg_es: "Acelera carro sin shaping; pendulo alcanza 73.46°", msg_en: "Accelerates trolley unshaped; load swings to 73.46°" },
        { t: "09.0s", actor: "HYDROGEN", msg_es: "Activa doble pulso ZVD; balanceo maximo 8.42°", msg_en: "Fires ZVD double pulse; caps sway at 8.42°" },
        { t: "15.0s", actor: "FINAL", msg_es: "Hydrogen 1 contenedor entregado vs Flash 0 -> Final 7-2", msg_en: "Hydrogen 1 container landed vs Flash 0 -> Final 7-2" },
      ],
    },
    verdict_es:
      "Cierre aplastante 7 a 2 para Gemini 4 Hydrogen: su grua fantasma comparativa explica visualmente el pendulo sin control y su controlador de cuarto orden gana las 3 arenas de punta a punta.",
    verdict_en:
      "Decisive 7-to-2 finish for Gemini 4 Hydrogen: its comparative ghost crane makes open-loop sway unmistakable and its fourth-order controller sweeps all 3 live AI arenas.",
  },
];
