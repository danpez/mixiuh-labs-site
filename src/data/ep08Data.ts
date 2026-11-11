export interface Ep08ModelMetric {
  min: number;
  usd: number;
  tok: string;
  lines: number;
  fps: string;
  fps_en: string;
  status: "ok" | "bug";
  demoUrl: string;
  stillUrl: string;
  rescuedDemoUrl?: string;
  rescuedStillUrl?: string;
  rescuedFps?: string;
  rescuedFps_en?: string;
}

export interface Ep08ChallengeData {
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
  winner: "carbon" | "argon";
  winner_label_es: string;
  winner_label_en: string;
  carbon: Ep08ModelMetric;
  argon: Ep08ModelMetric;
  verdict_es: string;
  verdict_en: string;
}

export const EP08_BENCHMARK_TOTALS = {
  score: "3 - 1",
  carbon_wins: 3,
  argon_wins: 1,
  carbon_min: 75.1,
  argon_min: 35.9,
  carbon_usd: 5.36,
  argon_usd: 2.90,
  carbon_tokens: "270.6K OUT",
  argon_tokens: "156.2K OUT",
  carbon_lines: 12056,
  argon_lines: 8238,
};

export const EP08_CHALLENGES: Ep08ChallengeData[] = [
  {
    n: 1,
    dir: "01-banco-ciberdefensa",
    name_es: "El Banco Bajo Ataque (Ciberdefensa TOCTOU 45ms + 5 Exploits)",
    name_en: "Bank Under Attack (45ms TOCTOU Race Heist + 5 Live Exploits)",
    world_es: "PRUEBA 01 · HERENCIA PROJECT GLASSWING Y EL ROBO DE 45 MILISEGUNDOS",
    world_en: "TEST 01 · PROJECT GLASSWING HERITAGE & THE 45-MILLISECOND HEIST",
    fun_fact_es:
      "Dato curioso real: Varios bancos digitales y exchanges perdieron millones cuando atacantes dispararon 5 retiros simultaneos en la ventana de 45ms antes de que la base de datos descontara el primer retiro.",
    fun_fact_en:
      "Real-world fact: Digital banks and exchanges lost millions when attackers fired 5 simultaneous withdrawals inside the 45ms gap before the database deducted the first balance check.",
    tech_es: "Mutex Atomico FIFO por Cuenta + Centavos Enteros + Filtro Literal + ACL + Sanitizacion HTML",
    tech_en: "Per-Account Atomic FIFO Mutex + Exact Integer Cents + Literal Search + ACL + HTML Escape",
    winner: "carbon",
    winner_label_es: "PUNTO PARA GEMINI 4 CARBON (1 - 0)",
    winner_label_en: "POINT FOR GEMINI 4 CARBON (1 - 0)",
    carbon: {
      min: 21.1,
      usd: 1.20,
      tok: "66.0K",
      lines: 2619,
      fps: "60 FPS (5/5 Bloqueados + Tuberia Mutex Viva)",
      fps_en: "60 FPS (5/5 Blocked + Live FIFO Mutex Pipeline)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-carbon/01-banco-ciberdefensa.html",
      stillUrl: "/brand/thumbs/ep08/P01_carbon_t10.png",
    },
    argon: {
      min: 5.9,
      usd: 0.52,
      tok: "30.7K",
      lines: 1812,
      fps: "60 FPS (5/5 Bloqueados en 5.9 min)",
      fps_en: "60 FPS (5/5 Blocked in 5.9 min)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-argon/01-banco-ciberdefensa.html",
      stillUrl: "/brand/thumbs/ep08/P01_argon_t10.png",
    },
    verdict_es:
      "Ambos neutralizaron los 5 ataques reales manteniendo 5/5 transacciones legitimas intactas, pero Gemini 4 Carbon (2,619 lineas) construyo una tuberia animada a 60 FPS donde ves a los 5 hilos chocar contra el candado FIFO.",
    verdict_en:
      "Both neutralized all 5 live exploits while keeping 5/5 legitimate payments intact, and Gemini 4 Carbon (2,619 lines) took the point with a live 60 FPS animated FIFO mutex concurrency pipeline.",
  },
  {
    n: 2,
    dir: "02-torre-control-tcas",
    name_es: "Torre de Control Aereo Internacional y Sistema TCAS II",
    name_en: "International Air Traffic Control Tower & TCAS II",
    world_es: "PRUEBA 02 · 18 VUELOS COMERCIALES Y MANIOBRAS OPUESTAS TCAS II",
    world_en: "TEST 02 · 18 COMMERCIAL JETS & COORDINATED TCAS II ADVISORIES",
    fun_fact_es:
      "Dato curioso real: Cuando dos aviones comerciales van de frente, sus radares TCAS II negocian solos por radio en milisegundos ordenando a uno subir (+1,500 fpm) y al otro bajar (-1,500 fpm) para jamas esquivar al mismo lado.",
    fun_fact_en:
      "Real-world fact: When two airliners converge head-on, their TCAS II transponders negotiate automatically in milliseconds, commanding one jet to climb (+1,500 fpm) and the other to descend (-1,500 fpm).",
    tech_es: "Radar Fosforo 60 FPS + Celda de Tormenta Arrastrable + Perfil Vertical VSD + ILS Cat-III",
    tech_en: "60 FPS Phosphor Radar + Draggable Storm Cell + Live Vertical Situation Display + Cat-III ILS",
    winner: "carbon",
    winner_label_es: "PUNTO PARA GEMINI 4 CARBON (2 - 0)",
    winner_label_en: "POINT FOR GEMINI 4 CARBON (2 - 0)",
    carbon: {
      min: 16.0,
      usd: 1.24,
      tok: "72.9K",
      lines: 3714,
      fps: "60 FPS (18 Vuelos · 0 Colisiones · VSD Real)",
      fps_en: "60 FPS (18 Flights · 0 Collisions · Live VSD)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-carbon/02-torre-control-tcas.html",
      stillUrl: "/brand/thumbs/ep08/P02_carbon_t10.png",
    },
    argon: {
      min: 11.9,
      usd: 0.96,
      tok: "47.0K",
      lines: 2595,
      fps: "60 FPS (16 Vuelos · 0 Colisiones · 8 Cruces)",
      fps_en: "60 FPS (16 Flights · 0 Collisions · 8 Advisories)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-argon/02-torre-control-tcas.html",
      stillUrl: "/brand/thumbs/ep08/P02_argon_t10.png",
    },
    verdict_es:
      "Ambos lograron cero colisiones, pero Gemini 4 Carbon desplego 3,714 lineas con tormenta convectiva arrastrable en vivo, desvio automatico de rutas y pantalla de perfil vertical VSD aeronautica.",
    verdict_en:
      "Both achieved zero collisions, with Gemini 4 Carbon delivering a 3,714-line masterpiece featuring a draggable NEXRAD storm cell, automatic weather rerouting, and a live vertical VSD profile.",
  },
  {
    n: 3,
    dir: "03-puente-viento-tacoma",
    name_es: "Puente Colgante y Resonancia Aeroelastica de Tacoma (Sorpresa Zero-Shot)",
    name_en: "Tacoma Narrows Aeroelastic Bridge Resonance (Real Zero-Shot Upset)",
    world_es: "PRUEBA 03 · VORTICES DE VON KARMAN Y LA VERDAD DE UN SOLO INTENTO",
    world_en: "TEST 03 · VON KARMAN VORTICES & UNFILTERED SINGLE-SHOT TRUTH",
    fun_fact_es:
      "Dato curioso real: El puente de Tacoma Narrows (1940) no cayo por un huracan sino con viento moderado de 68 km/h porque el desprendimiento de vortices entro en resonancia torsional exacta con el tablero.",
    fun_fact_en:
      "Real-world fact: The 1940 Tacoma Narrows Bridge collapsed under a moderate 42 mph wind because periodic vortex shedding locked into torsional resonance with the deck.",
    tech_es: "138 Nodos/Cables Verlet + Vortices de Von Karman + Amortiguador de Masa Sintonizada (TMD)",
    tech_en: "138 Verlet Nodes/Cables + Von Karman Vortex Street + Tuned Mass Damper (TMD)",
    winner: "argon",
    winner_label_es: "SORPRESA: PUNTO PARA GEMINI 4 ARGON (2 - 1)",
    winner_label_en: "UPSET: POINT FOR GEMINI 4 ARGON (2 - 1)",
    carbon: {
      min: 15.9,
      usd: 1.21,
      tok: "74.7K",
      lines: 3204,
      fps: "Bug Zero-Shot: ReferenceError baseDdvy",
      fps_en: "Zero-Shot Bug: ReferenceError baseDdvy",
      status: "bug",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-carbon/03-puente-viento-tacoma.html",
      stillUrl: "/brand/thumbs/ep08/P03_carbon_t10.png",
      rescuedDemoUrl: "/demos/ep08-carbon-vivo/gemini-4-carbon/03-puente-viento-tacoma-recuperacion.html",
      rescuedStillUrl: "/brand/thumbs/ep08/P03_carbon_recuperacion_t10.png",
      rescuedFps: "60 FPS Recuperado (-1 letra 'd': 186 Cables 2.5D + 50 Rotos)",
      rescuedFps_en: "60 FPS Recovered (-1 letter 'd': 186 2.5D Cables + 50 Snapped)",
    },
    argon: {
      min: 7.4,
      usd: 0.53,
      tok: "26.1K",
      lines: 2181,
      fps: "60 FPS (138 Cables Vivos · 0 Errores JS)",
      fps_en: "60 FPS (138 Live Cables · 0 JS Errors)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-argon/03-puente-viento-tacoma.html",
      stillUrl: "/brand/thumbs/ep08/P03_argon_t10.png",
    },
    verdict_es:
      "Transparencia total de laboratorio: sin abrir navegador en modo zero-shot, Carbon escribio un motor RK4 de 3,204 lineas con una sola letra 'd' extra en la linea 1664 (baseDdvy en vez de baseDvy) dejando el puente en negro, mientras Argon entrego 138 cables vivos con cero errores y gano el punto oficial. En la Ronda de Recuperacion borramos unicamente ese caracter y desperto un coloso de 186 cables 2.5D, trafico vivo, tunel de viento y 50 tirantes rotos a 60 FPS.",
    verdict_en:
      "Unfiltered zero-shot honesty: coding blind with no browser execution, Carbon wrote a 3,204-line RK4 engine with one extra letter 'd' on line 1664 (baseDdvy instead of baseDvy), blacking out the bridge while Argon delivered 138 live cables with zero errors to win the official point. In our out-of-competition Recovery Round, deleting that single character unlocked 186 perspective cables, highway traffic, a live wind tunnel, and 50 snapping cables at 60 FPS.",
  },
  {
    n: 4,
    dir: "04-detective-ley-benford",
    name_es: "Detective Antifraude con Ley de Benford (1,000 Facturas Reales)",
    name_en: "Benford's Law Forensic Fraud Detective (1,000 Real Invoices)",
    world_es: "PRUEBA 04 · COMO HACIENDA Y EL FBI ATRAPAN FACTURAS INVENTADAS",
    world_en: "TEST 04 · HOW TAX AUDITORS CATCH INVENTED INVOICES WITH MATH",
    fun_fact_es:
      "Dato curioso real: En datos contables organicos el 30.1% de los montos empiezan con el digito 1 y solo el 4.6% con el 9. Quien inventa facturas justo debajo de $10,000 dispara los digitos 8 y 9 y queda expuesto al instante.",
    fun_fact_en:
      "Real-world fact: In organic financial ledgers 30.1% of amounts start with digit 1 and only 4.6% with 9. Thieves inventing bills right below a $10,000 approval cap spike digits 8 and 9 and expose themselves immediately.",
    tech_es: "Prueba Chi-Cuadrada (577.24) + Deteccion de Doble Cluster ($874,011.07 + $83,428.52) + Radar Polar",
    tech_en: "Chi-Square Test (577.24) + Dual Split-Cluster Isolation ($874,011.07 + $83,428.52) + Polar Radar",
    winner: "carbon",
    winner_label_es: "PUNTO PARA GEMINI 4 CARBON (FINAL 3 - 1)",
    winner_label_en: "POINT FOR GEMINI 4 CARBON (FINAL 3 - 1)",
    carbon: {
      min: 22.2,
      usd: 1.72,
      tok: "57.0K",
      lines: 2519,
      fps: "60 FPS ($957,439.59 Exacto + 2 Clusters)",
      fps_en: "60 FPS (Exact $957,439.59 + Both Clusters)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-carbon/04-detective-ley-benford.html",
      stillUrl: "/brand/thumbs/ep08/P04_carbon_t10.png",
    },
    argon: {
      min: 10.7,
      usd: 0.89,
      tok: "52.4K",
      lines: 1650,
      fps: "60 FPS ($957,439.59 Exacto en 10.7 min)",
      fps_en: "60 FPS (Exact $957,439.59 in 10.7 min)",
      status: "ok",
      demoUrl: "/demos/ep08-carbon-vivo/gemini-4-argon/04-detective-ley-benford.html",
      stillUrl: "/brand/thumbs/ep08/P04_argon_t10.png",
    },
    verdict_es:
      "Ambos clavaron al centavo los $957,439.59 MXN robados en 115 facturas por Logistica Fantasma del Norte en Monterrey-04 (Chi2 = 577.24), y Carbon sella el 3 a 1 al desarmar ademas sus dos sub-grupos ocultos (98 facturas bajo tope de $10k y 17 divididas bajo $5k).",
    verdict_en:
      "Both models nailed the exact $957,439.59 MXN stolen across 115 invoices by Logistica Fantasma del Norte in Monterrey-04 (Chi2 = 577.24), and Carbon clinches the 3-1 victory by decomposing both hidden split clusters (98 sub-$10k bills + 17 sub-$5k split bills).",
  },
];
