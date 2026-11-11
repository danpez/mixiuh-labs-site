export interface Ep09ModelMetric {
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

export interface Ep09ChallengeData {
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
  winner: "fable52" | "opus55";
  winner_label_es: string;
  winner_label_en: string;
  fable52: Ep09ModelMetric;
  opus55: Ep09ModelMetric;
  verdict_es: string;
  verdict_en: string;
}

export const EP09_BENCHMARK_TOTALS = {
  score: "3 - 1",
  fable52_wins: 3,
  opus55_wins: 1,
  fable52_min: 133.0,
  opus55_min: 102.5,
  fable52_usd: 17.70,
  opus55_usd: 16.33,
  fable52_tokens: "690.8K OUT",
  opus55_tokens: "592.8K OUT",
  fable52_lines: 3204,
  opus55_lines: 3910,
};

export const EP09_CHALLENGES: Ep09ChallengeData[] = [
  {
    n: 1,
    dir: "01-agujero-negro-gargantua",
    name_es: "Observatorio de Agujero Negro Gargantua (Lente Gravitacional + Relatividad)",
    name_en: "Gargantua Black Hole Observatory (Gravitational Lensing + Relativity)",
    world_es: "PRUEBA 01 · ANILLO DE FOTONES Y DILATACION DEL TIEMPO DE EINSTEIN",
    world_en: "TEST 01 · PHOTON RING & EINSTEIN'S GRAVITATIONAL TIME DILATION",
    fun_fact_es:
      "Dato curioso real: El tiempo no corre igual en todas partes; incluso los satelites GPS de tu celular atrasarian su posicion ~10 km al dia si no corrigieran la Relatividad General de Einstein. Cerca del horizonte de un agujero negro, 1 segundo en la nave equivale a 42.8 minutos en la Tierra.",
    fun_fact_en:
      "Real-world fact: Even your phone's GPS satellites would drift by ~10 km per day without correcting for Einstein's General Relativity. Right outside a black hole's horizon, 1 second aboard the ship equals 42.8 minutes on Earth.",
    tech_es: "Ray-Marching Geodesico GLSL WebGL2 + Corrimiento Doppler + Relojes Sincronizados",
    tech_en: "WebGL2 GLSL Geodesic Ray-Marching + Relativistic Doppler Beaming + Synced Clocks",
    winner: "fable52",
    winner_label_es: "PUNTO PARA CLAUDE FABLE 5.2 (1 - 0)",
    winner_label_en: "POINT FOR CLAUDE FABLE 5.2 (1 - 0)",
    fable52: {
      min: 23.3,
      usd: 2.97,
      tok: "122.5K",
      lines: 558,
      fps: "60 FPS (1s Nave = 42.8 min Tierra + Kerr GLSL)",
      fps_en: "60 FPS (1s Ship = 42.8 min Earth + Kerr GLSL)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-fable-5.2/01-agujero-negro-gargantua.html",
      stillUrl: "/brand/thumbs/ep09/P01_fable52_t10.png",
    },
    opus55: {
      min: 18.4,
      usd: 2.68,
      tok: "96.5K",
      lines: 1023,
      fps: "60 FPS (Disco Volumetrico + Curva Logaritmica)",
      fps_en: "60 FPS (Volumetric Disk + Log Dilation Curve)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-opus-5.5/01-agujero-negro-gargantua.html",
      stillUrl: "/brand/thumbs/ep09/P01_opus55_t10.png",
    },
    verdict_es:
      "Ambos renderizaron un agujero negro Kerr en WebGL2 a 60 FPS con cero errores, pero Claude Fable 5.2 logro un anillo de fotones nitido con imagen secundaria limpia y demostro en vivo como 9 segundos en la sonda equivalen a 34 minutos en la Tierra.",
    verdict_en:
      "Both rendered a 60 FPS WebGL2 Kerr black hole with zero errors, and Claude Fable 5.2 won with a razor-sharp photon ring, clean secondary lensed halo, and live clocks proving 9 seconds aboard the probe equal 34 minutes on Earth.",
  },
  {
    n: 2,
    dir: "02-laboratorio-electronico-555",
    name_es: "Mesa de Circuitos Viva con Chip NE555, Osciloscopio y Cortocircuito",
    name_en: "Live NE555 Analog Circuit Bench, Dual Oscilloscope & Short Circuit",
    world_es: "PRUEBA 02 · EL CHIP DE 1971 CON MIL MILLONES DE UNIDADES AL ANO",
    world_en: "TEST 02 · THE 1971 CHIP STILL BUILT A BILLION TIMES PER YEAR",
    fun_fact_es:
      "Dato curioso real: El temporizador NE555 fue disenado en el verano de 1971 por Hans Camenzind y medio siglo despues se siguen fabricando mas de mil millones al ano porque con dos resistencias y un capacitor crea el latido de casi cualquier circuito.",
    fun_fact_en:
      "Real-world fact: Designed in summer 1971 by Hans Camenzind, over one billion NE555 timer chips are still manufactured every year because just two resistors and a capacitor give almost any gadget a heartbeat.",
    tech_es: "Protoboard Viva + Osciloscopio Dual + Sobrecorriente 11.3A / 101W + Fusible Termico",
    tech_en: "Live Breadboard + Dual-Channel Scope + 11.3A / 101W Fault + Thermal Fuse",
    winner: "opus55",
    winner_label_es: "PUNTO PARA CLAUDE OPUS 5.5 (1 - 1)",
    winner_label_en: "POINT FOR CLAUDE OPUS 5.5 (1 - 1)",
    fable52: {
      min: 34.9,
      usd: 4.39,
      tok: "179.6K",
      lines: 771,
      fps: "60 FPS (Chispas 5.0A + Fusible + Bandas Ohm)",
      fps_en: "60 FPS (5.0A Sparks + Fuse + Ohm Color Bands)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-fable-5.2/02-laboratorio-electronico-555.html",
      stillUrl: "/brand/thumbs/ep09/P02_fable52_t03.png",
    },
    opus55: {
      min: 25.1,
      usd: 4.77,
      tok: "158.3K",
      lines: 1074,
      fps: "60 FPS (Protoboard Real + Fuente 11.3A + Humo)",
      fps_en: "60 FPS (Real Breadboard + 11.3A Bench PSU + Smoke)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-opus-5.5/02-laboratorio-electronico-555.html",
      stillUrl: "/brand/thumbs/ep09/P02_opus55_t03.png",
    },
    verdict_es:
      "Claude Opus 5.5 empata la serie 1 a 1 construyendo en 9.8 minutos menos una protoboard realista con fuente regulable de laboratorio (que cae a 4.93V y 11.3A bajo cortocircuito), humo termico y mediciones automaticas de osciloscopio.",
    verdict_en:
      "Claude Opus 5.5 ties the series 1-1 in 9.8 fewer minutes by crafting a realistic breadboard bench with a rotary DC supply (sagging to 4.93V at 11.3A during a short), thermal smoke, and automatic scope readouts.",
  },
  {
    n: 3,
    dir: "03-rescate-caja-90s",
    name_es: "Rescate Financiero Exacto: Caja Rota de 1994 vs Motor BigInt 2026",
    name_en: "Zero-Error Financial Rescue: Broken 1994 POS vs 2026 BigInt Engine",
    world_es: "PRUEBA 03 · POR QUE 0.1 + 0.2 ROBA MILLONES EN SISTEMAS BANCARIOS",
    world_en: "TEST 03 · WHY 0.1 + 0.2 QUIETLY DRAINS MILLIONS IN LEGACY BANKS",
    fun_fact_es:
      "Dato curioso real: Para una computadora binaria 0.1 + 0.2 vale 0.30000000000000004. En un comercio con un millon de cobros diarios, truncar esos residuos y usar redondeo sesgado provoca fugas proyectadas de $27 millones de dolares al ano.",
    fun_fact_en:
      "Real-world fact: In binary floating-point, 0.1 + 0.2 equals 0.30000000000000004. Across one million daily retail orders, premature float truncation and biased rounding project to $27.01 million per year in leaked revenue.",
    tech_es: "50/50 Casos Golden ROUND_HALF_EVEN + Bits Reales IEEE-754 + Radiografia de 4 Bugs",
    tech_en: "50/50 ROUND_HALF_EVEN Golden Cases + Live 64-Bit IEEE-754 + 4-Bug X-Ray Table",
    winner: "fable52",
    winner_label_es: "PUNTO PARA CLAUDE FABLE 5.2 (2 - 1)",
    winner_label_en: "POINT FOR CLAUDE FABLE 5.2 (2 - 1)",
    fable52: {
      min: 24.5,
      usd: 3.65,
      tok: "128.7K",
      lines: 1252,
      fps: "60 FPS (50/50 Exactos + Radiografia de 4 Bugs)",
      fps_en: "60 FPS (50/50 Exact + 4-Stage Bug X-Ray)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-fable-5.2/03-rescate-caja-90s.html",
      stillUrl: "/brand/thumbs/ep09/P03_fable52_t10.png",
    },
    opus55: {
      min: 13.9,
      usd: 2.56,
      tok: "86.2K",
      lines: 993,
      fps: "60 FPS (50/50 Exactos + Terminal Fosforo)",
      fps_en: "60 FPS (50/50 Exact + Green CRT Ledger)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-opus-5.5/03-rescate-caja-90s.html",
      stillUrl: "/brand/thumbs/ep09/P03_opus55_t10.png",
    },
    verdict_es:
      "Ambos aprobaron 50 de 50 casos dorados con 0 centavos de error, pero Fable 5.2 confirmo la promesa central de Anthropic con 1,252 lineas que desarman visualmente los 64 bits IEEE-754 y diagnostican etapa por etapa los 4 bugs de 1994 (-$27.01M/ano).",
    verdict_en:
      "Both passed 50 of 50 golden cases with zero cent drift, and Fable 5.2 validated Anthropic's #1 legacy-migration claim with 1,252 lines dissecting all 64 IEEE-754 bits and diagnosing every 1994 stage bug (-$27.01M/yr).",
  },
  {
    n: 4,
    dir: "04-reloj-mecanico-suizo",
    name_es: "Calibre Mecanico Suizo Esqueleto (28,800 A/h + Escape de Ancora)",
    name_en: "Skeleton Swiss Mechanical Watch Caliber (28,800 vph + Lever Escapement)",
    world_es: "PRUEBA 04 · 691,200 GOLPES DE RUBI AL DIA SIN BATERIA NI CHIPS",
    world_en: "TEST 04 · 691,200 RUBY PALLET BEATS PER DAY WITH ZERO BATTERIES",
    fun_fact_es:
      "Dato curioso real: Un reloj mecanico suizo de 28,800 alternancias por hora divide cada segundo en 8 golpes exactos — 691,200 impactos diarios de dos diminutos rubies sinteticos contra 15 dientes de acero — sin usar un solo electron.",
    fun_fact_en:
      "Real-world fact: A 28,800 vph Swiss mechanical watch slices every second into 8 crisp beats — 691,200 daily impacts of two tiny synthetic rubies against a 15-tooth escape wheel — without a single battery.",
    tech_es: "Evolventes Exactas + Lupa Optica Rayos-X 2.35x + Macro Escape Rubi (0 Interferencias)",
    tech_en: "Exact Involute Teeth + Draggable 2.35x X-Ray Loupe + Ruby Macro Escapement",
    winner: "fable52",
    winner_label_es: "PUNTO PARA CLAUDE FABLE 5.2 (FINAL 3 - 1)",
    winner_label_en: "POINT FOR CLAUDE FABLE 5.2 (FINAL 3 - 1)",
    fable52: {
      min: 50.4,
      usd: 6.69,
      tok: "260.0K",
      lines: 623,
      fps: "60 FPS (Lupa Rayos-X Viva + Evolventes Exactas)",
      fps_en: "60 FPS (Live X-Ray Lens + Exact Involute Teeth)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-fable-5.2/04-reloj-mecanico-suizo.html",
      stillUrl: "/brand/thumbs/ep09/P04_fable52_t03.png",
    },
    opus55: {
      min: 45.1,
      usd: 6.32,
      tok: "251.9K",
      lines: 820,
      fps: "60 FPS (Caja Completa + Puentes + Error 1.8e-15)",
      fps_en: "60 FPS (Full Watch Bezel + Bridges + 1.8e-15 Err)",
      status: "ok",
      demoUrl: "/demos/ep09-fable-vivo/claude-opus-5.5/04-reloj-mecanico-suizo.html",
      stillUrl: "/brand/thumbs/ep09/P04_opus55_t03.png",
    },
    verdict_es:
      "Duelo altisimo: Opus 5.5 construyo una caja completa con manecillas y puentes calados, pero Fable 5.2 invirtio 213,891 tokens de razonamiento para resolver perfiles evolventes exactos con 0 interferencias, una lupa optica Rayos-X arrastrable sobre el calibre y vista macro del contacto rubi-diente para ganar 3 a 1.",
    verdict_en:
      "An elite horology duel: Opus 5.5 built a full wristwatch bezel with skeleton bridges and hands, while Fable 5.2 invested 213,891 thinking tokens to solve exact involute teeth with zero collisions, a draggable optical X-Ray lens over the movement, and a macro ruby-tooth escapement view to win 3-1.",
  },
];
