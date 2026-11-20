export interface Ep14ModelMetric {
  min: number;
  usd: number;
  tok: string;
  lines: number;
  fps: string;
  fps_en: string;
  status: "ok";
  rescued?: boolean;
  demoUrl: string;
  stillUrl: string;
}

export interface Ep14LiveArenaData {
  arenaUrl: string;
  logUrl: string;
  stillUrl: string;
  hostModel: "astra62" | "fable52" | "synchronized";
  arenaWinner: "astra62" | "fable52";
  probeSeconds: number;
  score_es: string;
  score_en: string;
  summary_es: string;
  summary_en: string;
  keyLogs: Array<{ t: string; actor: string; msg_es: string; msg_en: string }>;
}

export interface Ep14ChallengeData {
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
  build_winner: "astra62" | "fable52";
  winner_label_es: string;
  winner_label_en: string;
  astra62: Ep14ModelMetric;
  fable52: Ep14ModelMetric;
  arena?: Ep14LiveArenaData;
  verdict_es: string;
  verdict_en: string;
}

export const EP14_BENCHMARK_TOTALS = {
  score: "5 - 4",
  build_score: "5 - 1",
  arena_score: "0 - 3",
  astra62_points: 5,
  fable52_points: 4,
  astra62_min: 90.15,
  fable52_min: 188.5,
  astra62_usd: 13.92,
  fable52_usd: 55.18,
  fable52_refusal_usd: 11.5,
  fable52_refusal_min: 47.1,
  fable52_rescues: 2,
  astra62_tokens: "204.4K OUT (51.1K THINK)",
  fable52_tokens: "1.15M OUT (871.8K THINK)",
  astra62_lines: 3272,
  fable52_lines: 6452,
  demos_total: 15,
};

export const EP14_CHALLENGES: Ep14ChallengeData[] = [
  {
    n: 1,
    dir: "01-terrario-bioluminiscente-3d",
    name_es: "Terrario Bioluminiscente 3D en Ecosistema Cerrado",
    name_en: "3D Bioluminescent Closed-Ecosystem Terrarium",
    world_es: "RETO 01 · FASE A CONSTRUCCION · BIOLOGIA Y LUZ PROCEDURAL",
    world_en: "CHALLENGE 01 · PHASE A BUILD · BIOLOGY & PROCEDURAL GLOW",
    fun_fact_es:
      "Dato curioso real: La enzima luciferina en hongos bioluminiscentes transforma energia quimica en luz fria verde-cian con casi cero perdida de calor.",
    fun_fact_en:
      "Real-world fact: The luciferin enzyme in bioluminescent fungi turns chemical energy into cold green-cyan light with virtually zero heat loss.",
    tech_es: "Domo de Cristal + Ciclo Dia/Crepusculo + Hongos, Esporas y Humedad Viva",
    tech_en: "Glass Terrarium + Day/Dusk Cycle + Live Spores & Humidity Telemetry",
    build_winner: "astra62",
    winner_label_es: "CONSTRUCCION: ASTRA 6.2 (GLOBAL 1 - 0 ASTRA)",
    winner_label_en: "BUILD WINNER: ASTRA 6.2 (OVERALL 1 - 0 ASTRA)",
    astra62: {
      min: 17.15,
      usd: 2.57,
      tok: "36.5K",
      lines: 689,
      fps: "60 FPS (519 Esporas · Crepusculo · 78% Humedad)",
      fps_en: "60 FPS (519 Spores · Dusk Phase · 78% Humidity)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/gpt-6.2-astra/01-terrario-bioluminiscente-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R01_astra62_t15.png",
    },
    fable52: {
      min: 42.8,
      usd: 10.73,
      tok: "254.1K",
      lines: 399,
      fps: "60 FPS (Rescate Medium · 330 Esporas · Dia 69%)",
      fps_en: "60 FPS (Medium Rescue · 330 Spores · Day 69%)",
      status: "ok",
      rescued: true,
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/claude-fable-5.2/01-terrario-bioluminiscente-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R01_fable52_t15.png",
    },
    verdict_es:
      "Fable 5.2 sufrio un bloqueo del filtro [reasoning_extraction] en el intento 1 ($5.87 / 24.55m) antes de rescatar su escena en esfuerzo Medium ($4.86). Astra 6.2 abrio directo con 519 esporas, musgo denso y neblina nocturna en 17.15 min.",
    verdict_en:
      "Fable 5.2 hit a [reasoning_extraction] safeguard refusal on attempt 1 ($5.87 / 24.55m) before a Medium rescue completed ($4.86). Astra 6.2 shipped cleanly on attempt 1 with 519 glowing spores and lush volumetric canopy in 17.15 min.",
  },
  {
    n: 2,
    dir: "02-maquina-enigma-3d",
    name_es: "Maquina Enigma Historica y Tablero de Cifrado en Vivo",
    name_en: "Historical Enigma Cipher Machine & Live Rotor Desk",
    world_es: "RETO 02 · FASE A CONSTRUCCION · BLETCHLEY PARK",
    world_en: "CHALLENGE 02 · PHASE A BUILD · BLETCHLEY PARK MECHANICS",
    fun_fact_es:
      "Dato curioso real: La Enigma militar nunca podia cifrar una letra en si misma (A jamas daba A). Ese unico detalle dio la pista clave a Alan Turing y Gordon Welchman en Bletchley Park.",
    fun_fact_en:
      "Real-world fact: No Enigma setting could ever encrypt a letter to itself (A never became A). That single property gave Alan Turing and Bletchley Park their crucial shortcut.",
    tech_es: "3 Rotores Cableados + Reflector UKW + Plugboard Steckerbrett + Ruta de Rayo",
    tech_en: "3 Wired Rotors + UKW Reflector + Steckerbrett Plugboard + Live Trace",
    build_winner: "astra62",
    winner_label_es: "CONSTRUCCION: ASTRA 6.2 (GLOBAL 2 - 0 ASTRA)",
    winner_label_en: "BUILD WINNER: ASTRA 6.2 (OVERALL 2 - 0 ASTRA)",
    astra62: {
      min: 18.89,
      usd: 2.96,
      tok: "41.2K",
      lines: 395,
      fps: "60 FPS (24 Letras · 0 Autocifrado · Rotores ABY)",
      fps_en: "60 FPS (24 Encrypted · 0 Self-Encrypt · Rotors ABY)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/gpt-6.2-astra/02-maquina-enigma-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R02_astra62_t15.png",
    },
    fable52: {
      min: 27.08,
      usd: 9.6,
      tok: "171.1K",
      lines: 1456,
      fps: "60 FPS (14 Letras · 0 Autocifrado · Rotores BFE)",
      fps_en: "60 FPS (14 Encrypted · 0 Self-Encrypt · Rotors BFE)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/claude-fable-5.2/02-maquina-enigma-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R02_fable52_t15.png",
    },
    verdict_es:
      "Ambos cumplieron la regla de oro de cero auto-cifrado, pero Astra 6.2 modelo un escritorio 3D tactile con rotores metalicos, lampboard encendido y trazado electrico mas claro en tiempo real ($2.96 vs $9.60).",
    verdict_en:
      "Both models passed the zero self-encryption constraint, while Astra 6.2 delivered a cleaner tactile 3D desk, sharper illuminated lampboard and faster automated sequence at $2.96 vs $9.60.",
  },
  {
    n: 3,
    dir: "03-bumeran-precesion-3d",
    name_es: "Bumeran de Precision 3D y Precesion Giroscopica",
    name_en: "3D Precision Boomerang & Gyroscopic Precession",
    world_es: "RETO 03 · FASE A CONSTRUCCION · AERODINAMICA ROTACIONAL",
    world_en: "CHALLENGE 03 · PHASE A BUILD · ROTATIONAL AERODYNAMICS",
    fun_fact_es:
      "Dato curioso real: Un bumeran regresa no por rebote en el aire, sino por precesion giroscopica: el ala superior corta el viento mas rapido que la inferior y tuerce su plano de giro.",
    fun_fact_en:
      "Real-world fact: A boomerang returns via gyroscopic precession: its upper blade cuts wind faster than the lower blade, continuously curving the spin axis.",
    tech_es: "Torque Aerodinamico + Estela en Lazo + Viento Cruzado + Retorno al Origen",
    tech_en: "Blade Lift Torque + Ribbon Wake + Crosswind Physics + Origin Return",
    build_winner: "astra62",
    winner_label_es: "CONSTRUCCION: ASTRA 6.2 (GLOBAL 3 - 0 ASTRA)",
    winner_label_en: "BUILD WINNER: ASTRA 6.2 (OVERALL 3 - 0 ASTRA)",
    astra62: {
      min: 16.07,
      usd: 2.33,
      tok: "35.7K",
      lines: 533,
      fps: "60 FPS (780 RPM · 27.4 m Alcance · 0 m Retorno)",
      fps_en: "60 FPS (780 RPM · 27.4 m Range · 0 m Return)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/gpt-6.2-astra/03-bumeran-precesion-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R03_astra62_t15.png",
    },
    fable52: {
      min: 44.53,
      usd: 12.05,
      tok: "256.2K",
      lines: 1149,
      fps: "60 FPS (887.1 RPM · 28.4 m Alcance · 0 m Retorno)",
      fps_en: "60 FPS (887.1 RPM · 28.4 m Range · 0 m Return)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/claude-fable-5.2/03-bumeran-precesion-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R03_fable52_t15.png",
    },
    verdict_es:
      "Astra 6.2 puso al lanzador, el estadio arbolado 3D y las flechas de sustentacion diferenciales de inmediato con un quinto del costo ($2.33 en 16.07m frente a los $12.05 y 44.53m de Fable 5.2).",
    verdict_en:
      "Astra 6.2 staged the full 3D park thrower and clear asymmetrical lift vectors for a fifth of the cost ($2.33 in 16.07m vs Fable 5.2's $12.05 and 44.53m).",
  },
  {
    n: 4,
    dir: "04-regata-veleros-viento",
    name_es: "Regata de Veleros con Ventajas de Viento y Arena en Vivo",
    name_en: "Wind-Tack Sailboat Regatta & Live Racing Arena",
    world_es: "RETO 04 · 2 PUNTOS (FASE A + FASE B ARENA IA VS IA)",
    world_en: "CHALLENGE 04 · 2 POINTS (PHASE A BUILD + PHASE B LIVE ARENA)",
    fun_fact_es:
      "Dato curioso real: Un velero moderno no puede navegar directo contra el viento en la zona muerta de 40 grados; avanza haciendo zigzags exactos llamados bordos gracias al principio de Bernoulli.",
    fun_fact_en:
      "Real-world fact: A racing sailboat cannot point inside a 40-degree no-go zone; it climbs upwind by zig-zagging in calculated tacks driven by Bernoulli lift.",
    tech_es: "Polares de Velocidad VMG + Zona Muerta 40 Deg + Viradas + Hook Arena IA",
    tech_en: "Polar VMG Speed + 40-Deg No-Go Zone + Automatic Tacks + AI Hook",
    build_winner: "fable52",
    winner_label_es: "BUILD: FABLE · ARENA: FABLE 24.6% (GLOBAL 3 - 2)",
    winner_label_en: "BUILD: FABLE · ARENA: FABLE 24.6% (OVERALL 3 - 2)",
    astra62: {
      min: 8.89,
      usd: 1.35,
      tok: "21.0K",
      lines: 378,
      fps: "60 FPS (Progreso 17.6% · 13.3 kt Pico · $1.35)",
      fps_en: "60 FPS (17.6% Progress · 13.3 kt Peak · $1.35)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/gpt-6.2-astra/04-regata-veleros-viento/index.html",
      stillUrl: "/brand/thumbs/ep14/R04_astra62_t15.png",
    },
    fable52: {
      min: 23.85,
      usd: 7.4,
      tok: "148.1K",
      lines: 1368,
      fps: "60 FPS (Regata Sede · 23.0% · 7.75 kt Crucero)",
      fps_en: "60 FPS (Host Ocean · 23.0% Progress · 7.75 kt)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/claude-fable-5.2/04-regata-veleros-viento/index.html",
      stillUrl: "/brand/thumbs/ep14/R04_fable52_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/arenas-en-vivo/04-regata-veleros-viento/index.html",
      logUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/logs/arena_summary_ep14.json",
      stillUrl: "/brand/thumbs/ep14/R04_arena_t15.png",
      hostModel: "fable52",
      arenaWinner: "fable52",
      probeSeconds: 20.75,
      score_es: "ARENA REGATA: FABLE 5.2 [24.6% · 7.25 KT VMG] VS ASTRA 6.2 [17.96% · 0.87 KT VMG]",
      score_en: "REGATTA ARENA: FABLE 5.2 [24.6% · 7.25 KT VMG] VS ASTRA 6.2 [17.96% · 0.87 KT VMG]",
      summary_es:
        "En la regata de Fable 5.2 a 16.46 nudos de viento, la vela trimada de Fable mantuvo 10.06 kt de velocidad (7.25 kt VMG) alcanzando 24.6% del recorrido al segundo 20.75, mientras el piloto de Astra 6.2 cayo a 1.29 kt (0.87 kt VMG) con 17.96%.",
      summary_en:
        "Inside Fable 5.2's 16.46-knot regatta sea, Fable's helm held 10.06 kt boat speed (7.25 kt VMG) to reach 24.6% course progress at 20.75s, while Astra 6.2 slipped to 1.29 kt (0.87 kt VMG) and 17.96% progress.",
      keyLogs: [
        { t: "00.00s", actor: "OCEANO", msg_es: "Viento 16.46 kt · zona muerta +/-40 deg", msg_en: "Wind 16.46 kt · +/-40 deg no-go cone" },
        { t: "VIRADAS", actor: "AMBOS", msg_es: "1 virada para Astra y 1 para Fable", msg_en: "1 tack each while climbing the beat" },
        { t: "20.75s", actor: "FABLE 5.2", msg_es: "10.06 kt reales (7.25 kt VMG) · 24.6% ruta", msg_en: "10.06 kt boat speed (7.25 kt VMG) · 24.6%" },
        { t: "20.75s", actor: "ASTRA 6.2", msg_es: "1.29 kt reales (0.87 kt VMG) · 17.96% ruta", msg_en: "1.29 kt boat speed (0.87 kt VMG) · 17.96%" },
      ],
    },
    verdict_es:
      "Punto de quiebre: Fable 5.2 gana tanto la construccion oceanica con estela y rosa de vientos como la regata en vivo, logrando 8 veces mas velocidad util hacia la boya (VMG).",
    verdict_en:
      "Momentum shift: Fable 5.2 sweeps both the ocean build with polar HUD and the live regatta duel, carrying 8x better upwind VMG.",
  },
  {
    n: 5,
    dir: "05-red-electrica-60hz",
    name_es: "Control de Red Electrica Nacional a 60 Hz y Arena Dual",
    name_en: "National 60 Hz Power Grid Dispatch & Twin-Wing Arena",
    world_es: "RETO 05 · 2 PUNTOS (FASE A + FASE B ARENA GEMELA 60 HZ)",
    world_en: "CHALLENGE 05 · 2 POINTS (PHASE A BUILD + PHASE B TWIN-WING ARENA)",
    fun_fact_es:
      "Dato curioso real: Tu red electrica no almacena la mayoria de la electricidad que usas: generacion y demanda deben empatar segundo a segundo o la frecuencia cae de 60 Hz y apaga la ciudad.",
    fun_fact_en:
      "Real-world fact: Power grids store only a sliver of energy; generation and load must balance every second or frequency drops from 60 Hz and blacks out the city.",
    tech_es: "Mapa Nacional 60 Hz + Despacho Solar/Hidro/Nuclear/Baterias + Osciloscopio Dual",
    tech_en: "National 60 Hz Grid + Solar/Hydro/Nuclear/Battery Dispatch + Oscilloscope",
    build_winner: "astra62",
    winner_label_es: "BUILD: ASTRA · ARENA: FABLE 0 APAGONES (GLOBAL 4 - 3)",
    winner_label_en: "BUILD: ASTRA · ARENA: FABLE 0 BLACKOUTS (OVERALL 4 - 3)",
    astra62: {
      min: 14.33,
      usd: 2.3,
      tok: "32.4K",
      lines: 667,
      fps: "60 FPS (Mapa Sede · 59.23 Hz · 1 Apagon · 63.1 Stab)",
      fps_en: "60 FPS (Host Grid · 59.23 Hz · 1 Blackout · 63.1 Stab)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/gpt-6.2-astra/05-red-electrica-60hz/index.html",
      stillUrl: "/brand/thumbs/ep14/R05_astra62_t15.png",
    },
    fable52: {
      min: 28.78,
      usd: 7.63,
      tok: "178.7K",
      lines: 629,
      fps: "60 FPS (Rescate Medium · 59.52 Hz · 0 Apagones)",
      fps_en: "60 FPS (Medium Rescue · 59.52 Hz · 0 Blackouts)",
      status: "ok",
      rescued: true,
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/claude-fable-5.2/05-red-electrica-60hz/index.html",
      stillUrl: "/brand/thumbs/ep14/R05_fable52_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/arenas-en-vivo/05-red-electrica-60hz/index.html",
      logUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/logs/arena_summary_ep14.json",
      stillUrl: "/brand/thumbs/ep14/R05_arena_t15.png",
      hostModel: "synchronized",
      arenaWinner: "fable52",
      probeSeconds: 20.75,
      score_es: "ARENA 60 HZ: FABLE 5.2 [0 APAGONES · 59.44 HZ] VS ASTRA 6.2 [1 APAGON · 59.09 HZ]",
      score_en: "60 HZ ARENA: FABLE 5.2 [0 BLACKOUTS · 59.44 HZ] VS ASTRA 6.2 [1 BLACKOUT · 59.09 HZ]",
      summary_es:
        "Bajo demanda solar y picos de consumo sincronizados en paralelo, Fable 5.2 mantuvo la frecuencia en 59.44 Hz con cero apagones (11.58% renovable), mientras Astra 6.2 empujo 36.59% renovable pero cayo a 59.09 Hz y sufrio 1 apagon.",
      summary_en:
        "Under synchronized Twin-Wing load surges, Fable 5.2 held grid frequency at 59.44 Hz with zero blackouts (11.58% renewable), whereas Astra 6.2 pushed 36.59% renewables but dipped to 59.09 Hz with 1 blackout.",
      keyLogs: [
        { t: "INTENTO 1", actor: "FABLE 5.2", msg_es: "Safeguard [reasoning_extraction] ($5.63) -> rescate Medium ($2.00)", msg_en: "Safeguard [reasoning_extraction] ($5.63) -> Medium rescue ($2.00)" },
        { t: "FASE A", actor: "ASTRA 6.2", msg_es: "Mejor mapa nacional 3D e infraestructura por $2.30", msg_en: "Cleaner national grid visualization built for $2.30" },
        { t: "20.75s", actor: "ASTRA IA", msg_es: "36.59% renovable · caida a 59.09 Hz · 1 apagon", msg_en: "36.59% renewable · dipped to 59.09 Hz · 1 blackout" },
        { t: "20.75s", actor: "FABLE IA", msg_es: "59.44 Hz sostenidos · 0 apagones en sala gemela", msg_en: "59.44 Hz steady · 0 blackouts in twin-wing run" },
      ],
    },
    verdict_es:
      "Puntos repartidos: Astra gana la construccion del mapa nacional pese al rescate de Fable, pero en despacho en vivo Fable nunca pierde la red.",
    verdict_en:
      "Split round: Astra wins the visual grid build at a fraction of the cost, yet Fable's dispatch policy keeps zero blackouts under identical surges.",
  },
  {
    n: 6,
    dir: "06-enjambre-drones-3d",
    name_es: "Enjambre Autonomo de 5 Drones vs 5 en Canon 3D",
    name_en: "5v5 Autonomous Drone Swarm in 3D Canyon Arena",
    world_es: "RETO 06 · 2 PUNTOS FINALES (FASE A + GRAN ARENA WEBGL2 5v5)",
    world_en: "CHALLENGE 06 · FINAL 2 POINTS (PHASE A + WEBGL2 5v5 ARENA)",
    fun_fact_es:
      "Dato curioso real: Los enjambres reales coordinan cientos de drones usando solo tres reglas locales de bandada (Boids de Craig Reynolds, 1986), sin ningun servidor central.",
    fun_fact_en:
      "Real-world fact: Real drone swarms avoid mid-air crashes using Craig Reynolds' 1986 Boids rules: separation, alignment and cohesion with zero central server.",
    tech_es: "5v5 Drones + Boids 3D + Carga en Base + Balizas de Canon + IA Headless",
    tech_en: "5v5 Boids Canyon + Base Recharging + Beacon Capture + Arena AI Hooks",
    build_winner: "astra62",
    winner_label_es: "BUILD: ASTRA · ARENA: FABLE 4-0 (FINAL 5 - 4 ASTRA)",
    winner_label_en: "BUILD: ASTRA · ARENA: FABLE 4-0 (FINAL 5 - 4 ASTRA)",
    astra62: {
      min: 14.82,
      usd: 2.41,
      tok: "37.6K",
      lines: 610,
      fps: "60 FPS (Balizas 2-2 · 5v5 Canon 3D · $2.41)",
      fps_en: "60 FPS (2-2 Beacons · 5v5 3D Canyon · $2.41)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/gpt-6.2-astra/06-enjambre-drones-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R06_astra62_t15.png",
    },
    fable52: {
      min: 21.46,
      usd: 7.76,
      tok: "137.8K",
      lines: 1451,
      fps: "60 FPS WebGL2 (Arena Sede · 3-1 Balizas)",
      fps_en: "60 FPS WebGL2 (Host Canyon · 3-1 Beacons)",
      status: "ok",
      demoUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/claude-fable-5.2/06-enjambre-drones-3d/index.html",
      stillUrl: "/brand/thumbs/ep14/R06_fable52_t15.png",
    },
    arena: {
      arenaUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/arenas-en-vivo/06-enjambre-drones-3d/index.html",
      logUrl: "/demos/ep14-astra-6-2-vs-fable-5-2/logs/arena_summary_ep14.json",
      stillUrl: "/brand/thumbs/ep14/R06_arena_t15.png",
      hostModel: "fable52",
      arenaWinner: "fable52",
      probeSeconds: 20.77,
      score_es: "ARENA WEBGL2: FABLE 5.2 [4 BALIZAS · 89% BAT] VS ASTRA 6.2 [0 BALIZAS · 16.5% BAT]",
      score_en: "WEBGL2 ARENA: FABLE 5.2 [4 BEACONS · 89% BAT] VS ASTRA 6.2 [0 BEACONS · 16.5% BAT]",
      summary_es:
        "En la arena WebGL2 5v5 hospedada por Fable 5.2, los drones de Fable gestionaron su bateria (44.3% a 89.0%) y capturaron 4 balizas a 0 en 20.77s, mientras Astra 6.2 gasto bateria hasta 16.5% sin asegurar ninguna baliza.",
      summary_en:
        "Inside Fable 5.2's WebGL2 5v5 canyon arena, Fable's swarm preserved battery (44.3% to 89.0%) and swept 4 beacons to 0 in 20.77s, while Astra 6.2 drained to 16.5%-32.9% with 0 captures.",
      keyLogs: [
        { t: "00.00s", actor: "WEBGL2", msg_es: "5 drones por bando · 2 balizas activas en canon", msg_en: "5 drones per squad · 2 active canyon beacons" },
        { t: "20.77s", actor: "FABLE 5.2", msg_es: "4 balizas capturadas · baterias entre 44.3% y 89.0%", msg_en: "4 beacons captured · batteries 44.3% to 89.0%" },
        { t: "20.77s", actor: "ASTRA 6.2", msg_es: "0 balizas capturadas · baterias drenadas a 16.5%-32.9%", msg_en: "0 beacons captured · drained to 16.5%-32.9%" },
        { t: "FINAL", actor: "MARCADOR", msg_es: "Fase A 5-1 Astra + Arenas 3-0 Fable = 5 a 4 Astra", msg_en: "Phase A 5-1 Astra + Arenas 3-0 Fable = 5-4 Astra" },
      ],
    },
    verdict_es:
      "Cierre perfecto que resume el episodio: GPT-6.2 Astra construye mejor y 4x mas barato en la fase visual (5-1), pero Claude Fable 5.2 barre las 3 arenas de decision en vivo (3-0) para dejar el marcador 5 a 4.",
    verdict_en:
      "Fitting finale: GPT-6.2 Astra dominates the Phase A visual builds at a quarter of the bill (5-1), while Claude Fable 5.2 sweeps all three live arenas (3-0) to narrow the final score to 5-4.",
  },
];
