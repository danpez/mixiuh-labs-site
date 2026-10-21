// Verified dataset for Mixiuh Labs Episode 02: Gemini 4 Argon (High) vs. Claude Opus 5.5 (High)
// Strict compliance: Zero emojis, 100% verified metrics, token telemetry, and verbatim prompts.

export interface Ep02ChallengeData {
  n: number;
  slug: string;
  dir: string;
  world_es: string;
  world_en: string;
  category_es: string;
  category_en: string;
  name_es: string;
  name_en: string;
  tech: string;
  timestamp_es: string;
  timestamp_en: string;
  prompt_gist_es: string;
  prompt_gist_en: string;
  prompt_verbatim: string;
  key_requirements: string[];
  time_min: { argon: number; opus: number };
  time_exact_min: { argon: number; opus: number };
  cost_usd: { argon: number; opus: number };
  tokens: {
    argon_in: string;
    argon_cache: string;
    argon_out: string;
    argon_total: string;
    argon_steps: number;
    opus_in: string;
    opus_cache: string;
    opus_out: string;
    opus_total: string;
    opus_steps: number;
  };
  fps: { argon: string; opus: string };
  winner: "argon" | "opus";
  opus_slow_fps: boolean;
  kevin_note_es: string;
  kevin_note_en: string;
  argon_features: string[];
  opus_features: string[];
  opus_observations: string[];
  code_stats: {
    argon_lines: number;
    opus_lines: number;
    argon_kb: number;
    opus_kb: number;
    argon_bytes: number;
    opus_bytes: number;
  };
  page_titles: { argon: string; opus: string };
  fun_angle_es: string;
  fun_angle_en: string;
  speed_ratio_es: string;
  speed_ratio_en: string;
  cost_ratio_es: string;
  cost_ratio_en: string;
  faster_model: "argon" | "opus";
  demo_urls: { argon: string; opus: string };
  stills: { argon: string[]; opus: string[]; vs: string };
}

export interface Ep02ChapterItem {
  time_es: string;
  seconds_es: number;
  time_en: string;
  seconds_en: number;
  title_es: string;
  title_en: string;
  level: number | null;
}

export const EP02_BENCHMARK_TOTALS = {
  score: "4-2",
  argon_wins: 4,
  opus_wins: 2,
  argon_min_rounded: 90,
  opus_min_rounded: 159,
  argon_min_exact: 90.13,
  opus_min_exact: 158.66,
  minutes_saved_by_argon: 68.53,
  pct_time_saved: 43.2,
  speed_multiplier: "1.76x",
  argon_cost_usd: 6.26,
  opus_cost_usd: 16.26,
  usd_saved_by_argon: 10.0,
  cost_multiplier: "2.60x",
  argon_tokens_total: "3.63M",
  opus_tokens_total: "13.01M",
  argon_tokens_breakdown: "1.06M In · 2.26M Cache · 306.9K Out (45 pasos)",
  opus_tokens_breakdown: "755K In+CW · 12.25M Cache · 501K Out (143 pasos)",
  argon_fps_summary: "120 FPS en los 6 retos",
  opus_fps_summary: "28 FPS en Reto 01 · 82 FPS en Reto 03 · 120 FPS en resto",
  code_totals: {
    argon_lines: 15719,
    opus_lines: 9603,
    argon_kb: 531.0,
    opus_kb: 507.6,
  },
  pricing_note_es:
    "Tarifas oficiales verificadas: Gemini 4 Argon ($2.00/1M In, $0.20/1M Cache Read, $12.00/1M Out) vs Claude Opus 5.5 ($4.00/1M In, $5-$8/1M Cache Write, $0.20/1M Cache Read, $20.00/1M Out).",
  pricing_note_en:
    "Verified official API pricing: Gemini 4 Argon ($2.00/1M In, $0.20/1M Cache Read, $12.00/1M Out) vs Claude Opus 5.5 ($4.00/1M In, $5-$8/1M Cache Write, $0.20/1M Cache Read, $20.00/1M Out).",
} as const;

export const EP02_CHALLENGES: Ep02ChallengeData[] = [
  {
    n: 1,
    slug: "01_tela_verlet",
    dir: "01-tela-verlet",
    world_es: "Nivel 01 · Integracion de Verlet y Desgarro",
    world_en: "Level 01 · Verlet Integration & Cloth Tearing",
    category_es: "Física de Partículas y Restricciones (Canvas 2D)",
    category_en: "Particle & Constraint Physics (Canvas 2D)",
    name_es: "Tela Física con Desgarro (Verlet)",
    name_en: "Tearable Cloth Physics (Verlet)",
    tech: "Integrador de Verlet + Solver Gauss-Seidel + Bisturí Láser + Viento Simplex",
    timestamp_es: "01:12",
    timestamp_en: "01:15",
    prompt_gist_es:
      "Malla de tela de alta densidad (mínimo 65x40 partículas) con integración de Verlet desde cero, mapa de calor de tensión mecánica, bisturí láser que corta enlaces en vivo y túnel de viento turbulento.",
    prompt_gist_en:
      "High-density cloth mesh (65x40+ particles) using custom Verlet integration, real-time mechanical tension heatmap, laser scalpel link cutting, and Simplex wind tunnel.",
    prompt_verbatim: `Actúa como un Ingeniero de motores físicos y Desarrollador Creativo Senior. Tu objetivo es superar un benchmark de código "Zero-Shot" construyendo un **Simulador Interactivo de Tela Física con Desgarro en Tiempo Real (Verlet Integration & Tearable Cloth)** de alto rendimiento y estética cyberpunk/laboratorio científico.

REGLAS ESTRICTAS DEL BENCHMARK:
1. Debes entregar un ÚNICO archivo \`index.html\` 100% autocontenido (HTML, CSS y JavaScript en el mismo archivo) que funcione al primer intento al abrirlo en el navegador, sin errores de consola y sin pasos de compilación.
2. PROHIBIDO cargar imágenes, texturas o recursos externos. Todo el renderizado, iluminación, gradientes y telemetría debe generarse mediante código y matemáticas.
3. PROHIBIDO usar librerías de física prefabricadas (como Matter.js, Planck.js, Ammo.js o Cannon.js). Debes programar el integrador de Verlet y el solver de restricciones desde cero.

REQUERIMIENTOS MATEMÁTICOS Y FÍSICOS OBLIGATORIOS:
1. **Integración de Verlet y Solver de Restricciones (Constraints):**
   - Crea una malla densa de partículas (mínimo 65 columnas por 40 filas) conectadas mediante restricciones estructurales (horizontales y verticales) y opcionalmente de cizalla/flexión.
   - Implementa múltiples iteraciones de relajación por frame (mínimo 8 a 15 sub-pasos configurables) para que la tela se comporte como un tejido tenso y realista, no como un resorte flojo.
   - Los puntos superiores de la tela deben poder anclarse (pins) con varios presets (cortina colgada de ganchos, bandera anclada a la izquierda, red sujeta de las 4 esquinas).
2. **Tensión Mecánica, Mapa de Calor y Desgarro (Tearing):**
   - Calcula la elongación real de cada enlace respecto a su longitud de reposo.
   - Si un enlace supera su umbral crítico de ruptura (\`tearThreshold\`), el enlace debe romperse dinámicamente, produciendo un desgarro físico real que se propaga bajo el propio peso de la tela.
   - Incluye un modo visual de "Mapa de Tensión Mecánica" donde cada hilo cambie de color en tiempo real según su estrés (de cian/azul en reposo a ámbar y rojo incandescente justo antes de romperse), además de un modo de tejido sombreado con iluminación direccional calculada por las normales de cada celda.
3. **Interacción Dual con el Mouse y Túnel de Viento:**
   - **Clic izquierdo + arrastrar:** Agarrar y tirar de la tela con un radio de influencia elástico (que permita estirarla hasta desgarrarla si se tira con fuerza).
   - **Clic derecho (o Shift + Clic izquierdo) + arrastrar:** Modo "Bisturí Láser" con estela brillante que corta instantáneamente cualquier enlace que cruce el segmento de movimiento del cursor.
   - **Viento Turbulento Procedural:** Campo de viento tridimensional basado en ruido Simplex/Perlin que ondule la tela de forma orgánica, más un botón para disparar una "Onda de Choque / Explosión Radial".
4. **HUD de Laboratorio y Telemetría en Tiempo Real:**
   - Panel de control interactivo para ajustar en vivo: gravedad, fuerza de viento, iteraciones del solver, umbral de ruptura (\`tearThreshold\`), rigidez, modo de renderizado (Malla de Tensión, Sombreado Volumétrico, Neón Cyberpunk) y botones de reinicio / presets de anclaje.
   - Indicadores en tiempo real de FPS, número de partículas activas, enlaces íntegros vs. enlaces rotos y tensión máxima actual.

Escribe el archivo completo y funcional en la carpeta \`01-tela-verlet/index.html\` dentro del directorio asignado a tu modelo.`,
    key_requirements: [
      "Malla densa de partículas (mínimo 65x40) con integración de Verlet desde cero",
      "8 a 15+ sub-pasos de relajación por frame y presets de anclaje (cortina, bandera, 4 esquinas)",
      "Desgarro físico real al superar tearThreshold y mapa de calor de tensión mecánica",
      "Agarre elástico con clic izquierdo, Bisturí Láser con clic derecho/Shift y onda de choque",
    ],
    time_min: { argon: 7, opus: 31 },
    time_exact_min: { argon: 6.68, opus: 30.87 },
    cost_usd: { argon: 0.65, opus: 3.05 },
    tokens: {
      argon_in: "92.7K",
      argon_cache: "0",
      argon_out: "38.5K",
      argon_total: "131.3K",
      argon_steps: 2,
      opus_in: "145K",
      opus_cache: "2.40M",
      opus_out: "92.0K",
      opus_total: "2.64M",
      opus_steps: 28,
    },
    fps: { argon: "120 FPS", opus: "28 FPS" },
    winner: "argon",
    opus_slow_fps: true,
    kevin_note_es:
      "Gana Gemini 4 Argon. Fue 4.62x más rápido (6.68 min vs 30.87 min), 4.7x más barato ($0.65 vs $3.05 USD) y corre a 120 FPS clavados con osciloscopio de tensión y chispas térmicas. Opus activó cizalla + flexión (18,430 enlaces) con 30 iteraciones de relajación por defecto en CPU, hundiendo su framerate a 28 FPS.",
    kevin_note_en:
      "Gemini 4 Argon wins decisively. It finished 4.62x faster (6.68m vs 30.87m), cost 4.7x less ($0.65 vs $3.05 USD), and runs at a locked 120 FPS with a live tension oscilloscope and thermal sparks. Opus enabled shear + bend constraints (18,430 links) with 30 relaxation iterations per frame on the CPU, dropping its frame rate to 28 FPS.",
    argon_features: [
      "120 FPS estables con malla 72x44 (3,168 partículas y 6,228 enlaces estructurales)",
      "Osciloscopio de tensión mecánica en vivo en el panel lateral y chispas térmicas al romper fibras",
      "4 modos de renderizado: Mapa de Tensión, Sombreado Volumétrico Lambertiano, Neón Cyberpunk e Híbrido",
      "5 presets de anclaje: Cortina, Bandera, Hamaca 4 Esquinas, Puente Colgante y Dosel Central",
      "Entregado en solo 2 pasos de agente (6.68 minutos, $0.65 USD)",
    ],
    opus_features: [
      "Malla de 3,696 nodos con enlaces estructurales, de cizalla y de flexión activables (hasta 18,430 enlaces)",
      "5 presets de anclaje: Cortina, Bandera, Red 4 Esquinas, Puente y Puerta",
      "4 modos visuales: Tensión, Volumétrico, Neón y Mixto con chispas al desgarrar",
    ],
    opus_observations: [
      "Por defecto inicia con Cizalla + Flexión activadas (18,430 enlaces) y 30 iteraciones de solver en CPU, cayendo a 28 FPS (6.28 ms de física por frame)",
      "Tardó 30.87 minutos (28 pasos de agente) y consumió $3.05 USD en tokens",
    ],
    code_stats: {
      argon_lines: 2766,
      opus_lines: 1352,
      argon_kb: 88.0,
      opus_kb: 65.9,
      argon_bytes: 90128,
      opus_bytes: 67479,
    },
    page_titles: {
      argon: "VERLET-CLOTH // Laboratorio de Tela Física, Tensión Mecánica y Desgarro",
      opus: "VERLET LAB // Simulador de Tela Física y Tensión Mecánica",
    },
    fun_angle_es:
      "Opus quiso lucirse activando 18,430 enlaces (estructurales, cizalla y flexión) con 30 pasadas de relajación por cuadro en un solo hilo de JavaScript: su propio HUD confiesa 28 FPS. Argon calibró la malla a 120 FPS clavados en menos de 7 minutos y por 65 centavos.",
    fun_angle_en:
      "Opus tried to flex by enabling 18,430 constraints (structural, shear, and bend) at 30 solver iterations per frame on a single JS thread—its own HUD confesses 28 FPS. Argon calibrated its solver for a locked 120 FPS in under 7 minutes for 65 cents.",
    speed_ratio_es: "Argon 4.62x más rápido (-24.2 min)",
    speed_ratio_en: "Argon 4.62x faster (-24.2 min)",
    cost_ratio_es: "Argon 4.69x más barato ($0.65 vs $3.05)",
    cost_ratio_en: "Argon 4.69x cheaper ($0.65 vs $3.05)",
    faster_model: "argon",
    demo_urls: {
      argon: "/demos/argon/01-tela-verlet/index.html",
      opus: "/demos/opus/01-tela-verlet/index.html",
    },
    stills: {
      argon: [
        "/stills/ep02/01_tela_verlet_argon_1.jpg",
        "/stills/ep02/01_tela_verlet_argon_2.jpg",
      ],
      opus: [
        "/stills/ep02/01_tela_verlet_opus_1.jpg",
        "/stills/ep02/01_tela_verlet_opus_2.jpg",
      ],
      vs: "/stills/ep02/01_tela_verlet_vs.jpg",
    },
  },
  {
    n: 2,
    slug: "02_fluidos_navier_stokes",
    dir: "02-fluidos-navier-stokes",
    world_es: "Nivel 02 · Dinamica de Fluidos Computacional (GPU)",
    world_en: "Level 02 · Computational Fluid Dynamics (GPU)",
    category_es: "WebGL2 + Ping-Pong FBOs + Shaders GLSL",
    category_en: "WebGL2 + Ping-Pong FBOs + GLSL Shaders",
    name_es: "Fluidos Navier-Stokes en GPU",
    name_en: "GPU Navier-Stokes Fluids",
    tech: "WebGL2 + FBOs Flotantes Ping-Pong + Solver Jacobi + Confinamiento de Vorticidad",
    timestamp_es: "02:28",
    timestamp_en: "02:26",
    prompt_gist_es:
      "Ecuaciones de Navier-Stokes incompresibles resueltas en GPU con shaders GLSL (advección semi-lagrangiana, confinamiento de vorticidad, proyección de presión de Jacobi), túnel de Karman y modos científicos.",
    prompt_gist_en:
      "Incompressible Navier-Stokes equations solved on GPU via GLSL shaders (semi-Lagrangian advection, vorticity confinement, Jacobi pressure projection), Karman vortex street, and scientific modes.",
    prompt_verbatim: `Actúa como un Programador Gráfico de GPU y Especialista en Dinámica de Fluidos Computacional (CFD). Tu objetivo es superar un benchmark de código "Zero-Shot" creando un **Simulador de Fluidos Eulerianos Navier-Stokes en Tiempo Real acelerado por GPU (WebGL / Shaders GLSL)** en un solo archivo.

REGLAS ESTRICTAS DEL BENCHMARK:
1. Entrega un ÚNICO archivo \`index.html\` 100% autocontenido (HTML, CSS, JavaScript y Shaders GLSL embebidos) que funcione al abrirlo directamente en el navegador a 60–120 FPS sin errores de consola.
2. PROHIBIDO cargar imágenes o texturas externas. Todo debe calcularse en la GPU mediante Framebuffer Objects (FBOs) en ping-pong y Fragment Shaders.

REQUERIMIENTOS MATEMÁTICOS Y DE GPU OBLIGATORIOS:
1. **Pipeline Completo de Navier-Stokes en Shaders GLSL (Ping-Pong FBOs):**
   - Implementa en WebGL (WebGL2 o WebGL1 con extensiones de textura flotante \`EXT_color_buffer_float\` / \`OES_texture_half_float\`) las etapas clásicas de Jos Stam (*Stable Fluids*):
     a) **Inyección de fuerzas y tinta (Splats):** Al mover o arrastrar el mouse, inyecta cantidad de movimiento en el campo de velocidad y color bioluminiscente en el campo de densidad.
     b) **Confinamiento de Vorticidad (Vorticity Confinement):** Calcula el rotacional ($\\nabla \\times \\vec{u}$) y reinyecta fuerza rotacional para preservar los remolinos turbulentos finos característicos del humo y plasma.
     c) **Divergencia y Proyección de Presión (Solver de Jacobi):** Calcula la divergencia del campo de velocidad, resuelve la ecuación de Poisson para la presión con múltiples iteraciones de Jacobi en GPU y resta el gradiente de presión ($\\nabla p$) para garantizar un fluido incompresible ($\\nabla \\cdot \\vec{u} = 0$).
     d) **Advección Semi-Lagrangiana:** Transporta tanto el campo de velocidad como el campo de color/densidad hacia atrás en el tiempo con interpolación bilineal.
2. **Obstáculos Sólidos Interactivos en el Flujo:**
   - Permite colocar o mover al menos un obstáculo circular/cilíndrico dentro del túnel (o dibujar barreras) con condiciones de frontera sin deslizamiento/reflexión para observar el desprendimiento de vórtices (Calle de Vórtices de Karman) cuando se activa un chorro continuo de fluido.
3. **Modos de Visualización Científica y Estética:**
   - Selector en vivo para alternar entre:
     1) **Tinta Bioluminiscente + Bloom/Glow** (humo neón multicapa sobre fondo oscuro).
     2) **Mapa de Velocidad Vectorial** (color codificado por dirección y magnitud de velocidad).
     3) **Mapa de Vorticidad / Rotacional** (visualización científica de giros horarios vs. antihorarios).
     4) **Mapa de Presión Interna.**
4. **HUD y Controles en Caliente:**
   - Sliders para viscosidad/disipación de velocidad, disipación de tinta, intensidad de vorticidad (\`curl\`), iteraciones de presión de Jacobi, radio de inyección, modo "Chorro de Túnel de Viento Automático", explosión multicolor y botón de limpieza.
   - Telemetría en pantalla con FPS, resolución de la rejilla de simulación y estado de FBOs.

Escribe el archivo completo y funcional en la carpeta \`02-fluidos-navier-stokes/index.html\` dentro del directorio asignado a tu modelo.`,
    key_requirements: [
      "Pipeline completo Stable Fluids en WebGL FBOs ping-pong (Splats, Vorticity Confinement, Divergencia, Jacobi, Advección)",
      "Obstáculo cilíndrico interactivo y dibujo de barreras para Calle de Vórtices de Karman",
      "4 modos de visualización: Tinta Bioluminiscente + Bloom, Velocidad, Vorticidad y Presión",
      "Sliders de viscosidad, curl, iteraciones de Jacobi, chorro de túnel de viento y explosión multicolor",
    ],
    time_min: { argon: 10, opus: 18 },
    time_exact_min: { argon: 10.0, opus: 18.47 },
    cost_usd: { argon: 1.4, opus: 2.05 },
    tokens: {
      argon_in: "290.2K",
      argon_cache: "610.9K",
      argon_out: "58.4K",
      argon_total: "959.5K",
      argon_steps: 9,
      opus_in: "95.0K",
      opus_cache: "1.45M",
      opus_out: "64.0K",
      opus_total: "1.61M",
      opus_steps: 18,
    },
    fps: { argon: "120 FPS", opus: "120 FPS" },
    winner: "argon",
    opus_slow_fps: false,
    kevin_note_es:
      "Ambos entregaron simuladores CFD espectaculares a 120 FPS. El punto es para Gemini 4 Argon por lograrlo en 10.00 minutos contra 18.47 de Opus ($1.40 vs $2.05 USD), sumando post-procesado GPU Bloom multicapa, partículas lagrangianas trazadoras y dibujo libre de muros.",
    kevin_note_en:
      "Both models delivered spectacular 120 FPS GPU fluid solvers. Gemini 4 Argon takes the point for finishing in 10.00 minutes vs Opus's 18.47 minutes ($1.40 vs $2.05 USD) while adding multi-pass GPU Bloom post-processing, Lagrangian tracer particles, and freehand wall drawing.",
    argon_features: [
      "WebGL2 RGBA16F ping-pong FBOs a 120 FPS con post-procesado GPU Bloom HDR multicapa",
      "4 modos científicos (Tinta + Bloom, Velocidad Vectorial, Vorticidad Curl y Presión Poisson)",
      "Herramientas interactivas: Inyectar Fluido, Mover Cilindro SDF y Dibujar Muros Libres",
      "5 escenas rápidas: Túnel de Karman, Colisión de Jets, Explosión Radial, Doble Cilindro y Cámara Limpia",
      "Sondas de partículas lagrangianas y vectores de flujo superpuestos en tiempo real",
    ],
    opus_features: [
      "Calle de Vórtices de Karman clásica con 4 toberas coloreadas y sombreado pseudo-Schlieren con relieve 3D",
      "5 modos visuales incluyendo Schlieren / Gradiente de Densidad (|∇ρ|)",
      "Herramientas para mover cilindro, pintar barreras y borrar obstáculos a 120 FPS",
    ],
    opus_observations: [
      "Excelente acabado científico, pero tardó 18.47 minutos (85% más tiempo) y costó $2.05 USD frente a $1.40 USD de Argon",
    ],
    code_stats: {
      argon_lines: 2506,
      opus_lines: 1444,
      argon_kb: 83.6,
      opus_kb: 62.7,
      argon_bytes: 85618,
      opus_bytes: 64196,
    },
    page_titles: {
      argon: "NAVIER-STOKES GPU // Laboratorio CFD Euleriano & Vórtices de Karman",
      opus: "KÁRMÁN-GPU // Laboratorio CFD Navier-Stokes Euleriano",
    },
    fun_angle_es:
      "Duelo de titanes en shaders GLSL: Opus agregó un quinto modo óptico Schlieren digno de un túnel supersónico, pero Argon montó un pipeline de Bloom HDR multicapa en GPU con sondas lagrangianas en 10 minutos exactos.",
    fun_angle_en:
      "A true titan duel in GLSL shaders: Opus added a fifth Schlieren optical mode worthy of a supersonic wind tunnel, while Argon built a multi-pass HDR GPU Bloom pipeline with Lagrangian tracer particles in exactly 10 minutes.",
    speed_ratio_es: "Argon 1.85x más rápido (-8.5 min)",
    speed_ratio_en: "Argon 1.85x faster (-8.5 min)",
    cost_ratio_es: "Argon 1.46x más barato ($1.40 vs $2.05)",
    cost_ratio_en: "Argon 1.46x cheaper ($1.40 vs $2.05)",
    faster_model: "argon",
    demo_urls: {
      argon: "/demos/argon/02-fluidos-navier-stokes/index.html",
      opus: "/demos/opus/02-fluidos-navier-stokes/index.html",
    },
    stills: {
      argon: [
        "/stills/ep02/02_fluidos_navier_stokes_argon_1.jpg",
        "/stills/ep02/02_fluidos_navier_stokes_argon_2.jpg",
      ],
      opus: [
        "/stills/ep02/02_fluidos_navier_stokes_opus_1.jpg",
        "/stills/ep02/02_fluidos_navier_stokes_opus_2.jpg",
      ],
      vs: "/stills/ep02/02_fluidos_navier_stokes_vs.jpg",
    },
  },
  {
    n: 3,
    slug: "03_cuerpo_blando_sdf",
    dir: "03-cuerpo-blando-sdf",
    world_es: "Nivel 03 · Cuerpos Blandos 3D y Conservacion de Volumen",
    world_en: "Level 03 · 3D Soft-Body Physics & Volume Conservation",
    category_es: "Three.js + Física XPBD / Gases Ideales + Shaders Subsurface",
    category_en: "Three.js + XPBD / Ideal Gas Physics + Subsurface Shaders",
    name_es: "Cuerpos Blandos 3D y Gelatina SDF",
    name_en: "3D Soft Bodies & SDF Jelly Physics",
    tech: "Three.js + Retícula Volumétrica XPBD + Conservación de Volumen (Efecto Poisson) + Fresnel",
    timestamp_es: "03:36",
    timestamp_en: "03:33",
    prompt_gist_es:
      "Laboratorio 3D de cuerpos blandos translúcidos (ositos de goma, toroides, cubos) con conservación de volumen por presión interna, efecto Poisson al aplastarse y agarre tipo resortera.",
    prompt_gist_en:
      "3D translucent soft-body physics lab (gummy bears, toruses, cubes) with internal pressure volume conservation, Poisson lateral expansion on squash, and 3D slingshot grabbing.",
    prompt_verbatim: `Actúa como un Ingeniero de Simulación Física 3D y Artista Técnico en WebGL/Three.js. Tu objetivo es superar un benchmark de código "Zero-Shot" creando un **Laboratorio Interactivo de Física de Cuerpos Blandos 3D (Soft-Body Jelly / Gummy Physics)** donde figuras tridimensionales gelatinosas y translúcidas caigan, rebotan, se deformen elásticamente conservando su volumen y colisionen entre sí y con el cursor.

REGLAS ESTRICTAS DEL BENCHMARK:
1. Entrega un ÚNICO archivo \`index.html\` 100% autocontenido. Puedes importar únicamente \`three\` y \`OrbitControls\` mediante \`<script type="importmap">\` desde un CDN estándar (unpkg o cdnjs).
2. PROHIBIDO usar motores de física externos (Ammo, Cannon, Rapier, Oimo) y PROHIBIDO cargar modelos 3D o texturas externas. Toda la geometría deformable, la física de masas-resortes/presión interna y los materiales translúcidos deben programarse desde cero en el archivo.

REQUERIMIENTOS MATEMÁTICOS Y VISUALES OBLIGATORIOS:
1. **Motor de Cuerpos Blandos 3D con Conservación de Volumen:**
   - Cada cuerpo blando debe estar modelado por una red tridimensional de nodos de masa conectados por resortes estructurales, de cizalla y de presión interna (o un esqueleto volumétrico de partículas acoplado a una superficie suave mediante *skinning* ponderado o *Marching Cubes / SDF*).
   - Si un cuerpo se aplasta verticalmente al chocar contra el suelo, debe expandirse horizontalmente (*efecto Poisson / conservación de volumen*) y jamás colapsar en un plano invertido (debe contar con fuerzas de restauración de forma o presión de gas ideal $P \\propto 1/V$).
2. **Materiales Translúcidos Tipo Goma / Gelatina (Subsurface & Fresnel):**
   - Renderiza los cuerpos con un aspecto visual espectacular de gelatina/gomita translúcida: brillo especular húmedo, borde Fresnel luminoso, refracción/transmisión simulada o shaders personalizados, sombras suaves proyectadas sobre una plataforma de laboratorio reflectante y partículas de impacto.
   - Incluye al menos 3 morfologías generadas por código (por ejemplo: Osito de Goma procedural / Cápsula Orgánica, Cubo biselado gelatinoso y Esfera/Toroide elástico) en distintos colores neón translúcidos.
3. **Interacción Directa en 3D (Raycasting):**
   - **Arrastrar y Lanzar (Grab & Slingshot):** Hacer clic sobre cualquier cuerpo blando para sujetarlo en el aire, estirarlo como goma elástica y lanzarlo contra otros cuerpos o contra las paredes de contención.
   - **Golpe / Impulso Radial y Gravedad Cero:** Botón para invocar nuevos cuerpos blandos desde arriba, botón de "Pisotón / Aplastamiento Masivo" y conmutador de gravedad o cámara lenta (*Bullet Time*).
4. **HUD de Telemetría y Control Físico:**
   - Controles en tiempo real para rigidez de resortes (\`stiffness\`), presión interna de volumen, amortiguamiento (\`damping\`), elasticidad de rebote contra el suelo, visualización del esqueleto interno de resortes/nodos en paralelo con la piel translúcida, y contador de FPS y energía cinética/elástica del sistema.

Escribe el archivo completo y funcional en la carpeta \`03-cuerpo-blando-sdf/index.html\` dentro del directorio asignado a tu modelo.`,
    key_requirements: [
      "Red 3D de nodos y resortes con conservación de volumen (efecto Poisson P ∝ 1/V) sin inversión de malla",
      "Materiales translúcidos Subsurface + Fresnel y mínimo 3 morfologías (Osito, Cubo, Toroide)",
      "Raycasting 3D para agarrar, estirar y lanzar (Slingshot), Pisotón Masivo, Gravedad Cero y Bullet Time",
      "Visualización simultánea de piel + esqueleto interno y telemetría de energía cinética/elástica",
    ],
    time_min: { argon: 35, opus: 31 },
    time_exact_min: { argon: 34.74, opus: 30.87 },
    cost_usd: { argon: 1.98, opus: 3.08 },
    tokens: {
      argon_in: "332.3K",
      argon_cache: "1.27M",
      argon_out: "88.1K",
      argon_total: "1.69M",
      argon_steps: 19,
      opus_in: "140K",
      opus_cache: "2.30M",
      opus_out: "96.0K",
      opus_total: "2.54M",
      opus_steps: 26,
    },
    fps: { argon: "120 FPS", opus: "82 FPS" },
    winner: "opus",
    opus_slow_fps: false,
    kevin_note_es:
      "Primer punto para Claude Opus 5.5. Fue el único reto donde Opus terminó antes que Argon (30.87 min vs 34.74 min) y entregó una cámara de contención preciosa con 6 morfologías XPBD (Osito, Cubo, Toroide, Cápsula, Flan y Estrella) y piso reflectante. Argon gana en costo ($1.98 vs $3.08) y mantiene 120 FPS clavados.",
    kevin_note_en:
      "First point for Claude Opus 5.5. This was the only challenge where Opus finished faster than Argon (30.87m vs 34.74m), delivering a gorgeous containment chamber with 6 XPBD morphologies (Gummy Bear, Cube, Torus, Capsule, Flan, and Star) and a reflective floor. Argon still cost less ($1.98 vs $3.08) and held a locked 120 FPS.",
    argon_features: [
      "120 FPS clavados con 5 cuerpos activos (270 nodos de masa, 2,521 enlaces y 13,568 triángulos)",
      "4 morfologías (Osito Gummy, Toroide, Cubo Biselado y Cápsula) con vista simultánea Piel + Esqueleto [X]",
      "Osciloscopio en tiempo real de Energía Cinética (Ek), Potencial Elástica (Ep) y razón de volumen V/V0",
      "Prensa Hidráulica (Pisotón Masivo), Explosión Radial, Vórtice Centrífugo, Gravedad Cero y Bullet Time 0.25x",
    ],
    opus_features: [
      "6 morfologías XPBD: Osito de Goma, Cubo Biselado, Toroide, Cápsula, Pudín/Flan y Gota/Estrella",
      "6 sabores neón (Fresa, Lima, Arándano, Mango, Uva y Menta) con transmisión subsurface y reflejos de piso",
      "Terminó 3.87 minutos antes que Argon (30.87 min vs 34.74 min)",
      "Medidor en vivo de desviación de volumen (ΔV +0.8%) y energías cinética/potencial en Joules",
    ],
    opus_observations: [
      "Corre a 82 FPS con 5 cuerpos (367 nodos y 3,907 resortes) frente a los 120 FPS de Argon, y costó $3.08 vs $1.98 USD",
    ],
    code_stats: {
      argon_lines: 2543,
      opus_lines: 1701,
      argon_kb: 93.7,
      opus_kb: 101.7,
      argon_bytes: 95978,
      opus_bytes: 104101,
    },
    page_titles: {
      argon: "GUMMY-LAB 3D // Física de Cuerpos Blandos, Conservación de Volumen y Subsurface GLSL",
      opus: "JELLYLAB // Física de Cuerpos Blandos 3D (XPBD + SDF Skinning)",
    },
    fun_angle_es:
      "El único reto de los seis donde Opus le ganó al reloj de Argon (31 contra 35 minutos) y además esculpió seis formas de gelatina distintas, incluyendo un flan que tiembla con conservación de volumen XPBD.",
    fun_angle_en:
      "The only challenge out of six where Opus beat Argon on the clock (31 vs 35 minutes), sculpting six distinct jelly shapes—including a wobbling flan with XPBD volume conservation.",
    speed_ratio_es: "Opus 1.13x más rápido (-3.9 min)",
    speed_ratio_en: "Opus 1.13x faster (-3.9 min)",
    cost_ratio_es: "Argon 1.56x más barato ($1.98 vs $3.08)",
    cost_ratio_en: "Argon 1.56x cheaper ($1.98 vs $3.08)",
    faster_model: "opus",
    demo_urls: {
      argon: "/demos/argon/03-cuerpo-blando-sdf/index.html",
      opus: "/demos/opus/03-cuerpo-blando-sdf/index.html",
    },
    stills: {
      argon: [
        "/stills/ep02/03_cuerpo_blando_sdf_argon_1.jpg",
        "/stills/ep02/03_cuerpo_blando_sdf_argon_2.jpg",
      ],
      opus: [
        "/stills/ep02/03_cuerpo_blando_sdf_opus_1.jpg",
        "/stills/ep02/03_cuerpo_blando_sdf_opus_2.jpg",
      ],
      vs: "/stills/ep02/03_cuerpo_blando_sdf_vs.jpg",
    },
  },
  {
    n: 4,
    slug: "04_voxel_minecraft",
    dir: "04-voxel-minecraft",
    world_es: "Nivel 04 · Motor de Mundo Voxel 3D y Culling",
    world_en: "Level 04 · 3D Voxel World Engine & Culling",
    category_es: "Three.js + Atlas Pixel-Art 16x16 + InstancedMesh / Chunks",
    category_en: "Three.js + 16x16 Pixel-Art Atlas + InstancedMesh / Chunks",
    name_es: "Motor Voxel 3D (Estilo Minecraft)",
    name_en: "3D Voxel Engine (Minecraft-Style)",
    tech: "Three.js + Atlas 16x16 NearestFilter + Face Culling + Ciclo Día/Noche + Raycasting",
    timestamp_es: "04:47",
    timestamp_en: "04:37",
    prompt_gist_es:
      "Mundo voxel 3D procedural con biomas, agua animada, atlas de texturas pixel-art 16x16 generado por código, destrucción con partículas físicas, colocación de 8 bloques y ciclo día/noche.",
    prompt_gist_en:
      "Procedural 3D voxel world with biomes, animated water, code-generated 16x16 pixel-art texture atlas, block mining with physics debris, 8-block hotbar placement, and day/night cycle.",
    prompt_verbatim: `Actúa como un Arquitecto de Motores de Videojuegos 3D. Tu objetivo es superar un benchmark de código "Zero-Shot" construyendo un **Motor de Mundo Voxel 3D Procedural e Interactivo (estilo Minecraft Técnico)** en un único archivo HTML utilizando Three.js, optimizado para correr a 60–120 FPS y con texturas pixel-art 100% generadas por código.

REGLAS ESTRICTAS DEL BENCHMARK:
1. Entrega un ÚNICO archivo \`index.html\` 100% autocontenido. Usa \`<script type="importmap">\` apuntando a un CDN confiable para importar \`three\` y \`OrbitControls\` (o \`PointerLockControls\`).
2. PROHIBIDO cargar imágenes \`.png/.jpg\` externas. Debes generar un atlas de texturas pixel-art de 16x16 (con sombreado lateral, bordes y variación de ruido por píxel) en memoria usando \`<canvas>\` con \`NearestFilter\` para que los bloques tengan estética voxel nítida y auténtica.

REQUERIMIENTOS TÉCNICOS Y DE JUGABILIDAD OBLIGATORIOS:
1. **Generación Procedural de Terreno Multi-Bioma y Estructuras:**
   - Implementa ruido fractal 2D/3D (Simplex o Perlin con múltiples octavas) con semilla configurable para generar montañas, valles, playas de arena, lagos de agua translúcida animada al nivel del mar, árboles voxelizados (troncos de madera y copas de hojas) y vetas de mineral o cristal luminoso.
   - Incluye al menos 8 tipos de bloques distintos en una barra de inventario inferior (*Hotbar* seleccionable con teclas \`1\`–\`8\` o rueda del mouse): Pasto, Tierra, Piedra, Madera, Hojas, Arena, Cristal/Vidrio y Bloque Luminoso/Lava.
2. **Optimización de Renderizado (\`InstancedMesh\` o Geometría por Chunks con Culling):**
   - No crees miles de \`THREE.Mesh\` individuales que hundan el framerate. Usa \`THREE.InstancedMesh\` por tipo de bloque o generación de mallas fusionadas ocultando caras internas para mantener fluidez absoluta.
3. **Raycasting Preciso de Construcción y Destrucción + Partículas:**
   - Resalta con un wireframe cúbico el bloque exacto al que apunta el cursor/mira.
   - **Clic izquierdo:** Destruir el bloque seleccionado disparando una explosión de mini-voxels físicos que caigan con gravedad y reboten antes de desaparecer.
   - **Clic derecho (o Alt/Shift + Clic):** Colocar el bloque activo del inventario exactamente adosado a la cara normal (\`face.normal\`) del bloque apuntado.
4. **Ciclo Día/Noche Dinámico y Controles:**
   - Slider o ciclo automático de hora del día que mueva el Sol y la Luna en el cielo, cambie el color de la bóveda celeste y la niebla atmosférica, y haga resaltar los bloques emisivos durante la noche.
   - HUD con FPS, coordenadas del bloque apuntado, contador total de voxels activos, selector de semilla / regenerar mundo y controles de cámara cómodos (órbita + desplazamiento WASD o modo exploración).

Escribe el archivo completo y funcional en la carpeta \`04-voxel-minecraft/index.html\` dentro del directorio asignado a tu modelo.`,
    key_requirements: [
      "Terreno multi-bioma con ruido fractal y semilla, agua animada, árboles y minerales",
      "Atlas de texturas pixel-art 16x16 en memoria con NearestFilter y Hotbar de 8 bloques",
      "Optimización por InstancedMesh o Chunks con ocultamiento de caras internas a 120 FPS",
      "Raycasting para minar (con partículas físicas) y colocar bloques + Ciclo Día/Noche dinámico",
    ],
    time_min: { argon: 7, opus: 24 },
    time_exact_min: { argon: 6.99, opus: 23.65 },
    cost_usd: { argon: 0.67, opus: 2.51 },
    tokens: {
      argon_in: "94.5K",
      argon_cache: "0",
      argon_out: "40.4K",
      argon_total: "134.9K",
      argon_steps: 2,
      opus_in: "115K",
      opus_cache: "1.85M",
      opus_out: "78.0K",
      opus_total: "2.04M",
      opus_steps: 22,
    },
    fps: { argon: "120 FPS", opus: "120 FPS" },
    winner: "argon",
    opus_slow_fps: false,
    kevin_note_es:
      "Empate técnico en ingeniería visual donde el punto va para Gemini 4 Argon por eficiencia radical: entregó en 6.99 minutos (2 pasos, $0.67 USD) un mundo de 66,684 voxels a 120 FPS con iconos 3D isométricos en el Hotbar. Opus tardó 23.65 minutos ($2.51 USD), pero construyó un motor masivo de 2.58 millones de voxels con Ambient Occlusion por vértice e iluminación BFS.",
    kevin_note_en:
      "A high-contrast engineering tie where Gemini 4 Argon takes the point on radical efficiency: in just 6.99 minutes (2 steps, $0.67 USD) it delivered a 66,684-voxel world at 120 FPS with isometric 3D hotbar icons. Opus took 23.65 minutes ($2.51 USD) to build a massive 2.58-million-voxel chunk engine with per-vertex Ambient Occlusion and BFS light propagation.",
    argon_features: [
      "Entregado en solo 2 pasos de agente (6.99 min, $0.67 USD) corriendo a 120 FPS clavados",
      "66,684 voxels totales con Face Culling (solo 10,889 bloques expuestos en GPU vía InstancedMesh)",
      "Hotbar con cubos 3D isométricos renderizados a partir del atlas pixel-art 16x16",
      "Modo Órbita + Modo Primera Persona FPS [F] con física de salto y colisión, y Explosión TNT [X]",
    ],
    opus_features: [
      "Escala masiva: 2,586,165 voxels activos en 213 chunks (radio de 7 chunks) a 120 FPS",
      "Oclusión Ambiental (AO) por vértice, propagación de luz BFS para bloques emisivos y nubes 3D",
      "Minimapa superior derecho en vivo y vista previa del atlas procedural 16x16 en el HUD",
    ],
    opus_observations: [
      "Tardó 3.38x más tiempo (23.65 min vs 6.99 min) y costó 3.75x más ($2.51 vs $0.67 USD)",
    ],
    code_stats: {
      argon_lines: 2569,
      opus_lines: 1665,
      argon_kb: 89.7,
      opus_kb: 91.6,
      argon_bytes: 91841,
      opus_bytes: 93802,
    },
    page_titles: {
      argon: "VOXELFORGE 3D // Motor Procedural Multi-Bioma [Three.js r160]",
      opus: "VOXELCRAFT // Motor de Mundo Voxel 3D Procedural",
    },
    fun_angle_es:
      "Contraste brutal de filosofías: Argon resolvió el reto en 2 pasos (7 minutos y 67 centavos) usando InstancedMesh con culling; Opus invirtió 24 minutos para programar un motor de chunks con 2.58 millones de bloques e iluminación BFS.",
    fun_angle_en:
      "A stark contrast in philosophy: Argon solved the challenge in 2 agent steps (7 minutes and 67 cents) using face-culled InstancedMesh; Opus spent 24 minutes building a 213-chunk engine with 2.58 million voxels and BFS lighting.",
    speed_ratio_es: "Argon 3.38x más rápido (-16.7 min)",
    speed_ratio_en: "Argon 3.38x faster (-16.7 min)",
    cost_ratio_es: "Argon 3.75x más barato ($0.67 vs $2.51)",
    cost_ratio_en: "Argon 3.75x cheaper ($0.67 vs $2.51)",
    faster_model: "argon",
    demo_urls: {
      argon: "/demos/argon/04-voxel-minecraft/index.html",
      opus: "/demos/opus/04-voxel-minecraft/index.html",
    },
    stills: {
      argon: [
        "/stills/ep02/04_voxel_minecraft_argon_1.jpg",
        "/stills/ep02/04_voxel_minecraft_argon_2.jpg",
      ],
      opus: [
        "/stills/ep02/04_voxel_minecraft_opus_1.jpg",
        "/stills/ep02/04_voxel_minecraft_opus_2.jpg",
      ],
      vs: "/stills/ep02/04_voxel_minecraft_vs.jpg",
    },
  },
  {
    n: 5,
    slug: "05_sintetizador_fm",
    dir: "05-sintetizador-fm",
    world_es: "Nivel 05 · Procesamiento Digital de Senales (DSP) y WebAudio",
    world_en: "Level 05 · Digital Signal Processing (DSP) & WebAudio",
    category_es: "Web Audio API Nativa + Síntesis FM + Analizador FFT",
    category_en: "Native Web Audio API + FM Synthesis + FFT Analyzer",
    name_es: "Sintetizador Polifónico FM + Secuenciador",
    name_en: "Polyphonic FM Synthesizer + Sequencer",
    tech: "Web Audio API (Carrier + FM Modulator + Sub + ADSR + Biquad + Delay) + FFT 60 FPS",
    timestamp_es: "05:59",
    timestamp_en: "05:47",
    prompt_gist_es:
      "Estación de síntesis polifónica FM y sustractiva en Web Audio API puro (cero samples externos), batería electrónica sintetizada, secuenciador de 16 pasos con canciones demo y osciloscopio + FFT.",
    prompt_gist_en:
      "Polyphonic FM & subtractive synth workstation in pure Web Audio API (zero external samples), synthesized drum machine, 16-step sequencer with demo songs, and dual oscilloscope + FFT analyzer.",
    prompt_verbatim: `Actúa como un Ingeniero de Procesamiento Digital de Señales (DSP), Desarrollador de Sintetizadores de Audio y Diseñador de Interfaces de Estudio. Tu objetivo es superar un benchmark de código "Zero-Shot" construyendo una **Estación de Síntesis Polifónica FM/Sustractiva con Secuenciador de 16 Pasos y Analizador de Espectro FFT/Osciloscopio en Tiempo Real** utilizando exclusivamente la Web Audio API nativa y Canvas 2D.

REGLAS ESTRICTAS DEL BENCHMARK:
1. Entrega un ÚNICO archivo \`index.html\` 100% autocontenido que funcione al abrirlo directamente en el navegador sin errores de consola.
2. PROHIBIDO cargar archivos de audio externos (\`.mp3\`, \`.wav\`, \`.ogg\`) o librerías de audio externas (como Tone.js). Todo sonido —incluyendo leads, bajos, acordes y percusión electrónica (bombo, caja con ruido blanco filtrado y hi-hats metálicos)— debe sintetizarse en tiempo real mediante nodos matemáticos de \`AudioContext\`.

REQUERIMIENTOS DE DSP, MÚSICA E INTERFAZ OBLIGATORIOS:
1. **Motor de Síntesis Polifónica + Batería Sintetizada:**
   - **Sintetizador Principal (Polifónico de al menos 6 voces):** Oscilador portador (*Carrier*: Sine, Sawtooth, Square, Triangle) modulado en frecuencia por un oscilador modulador (*FM Modulator* con ratio e índice de modulación ajustables) + Sub-oscilador una octava abajo.
   - **Cadena de Modelado y Efectos:** Envolvente ADSR completa (Attack, Decay, Sustain, Release), filtro resonante (\`BiquadFilterNode\` Lowpass/Highpass/Bandpass con Cutoff y Resonance), Delay estéreo sincronizado al tempo (\`DelayNode\` + feedback) y distorsión/saturación suave (\`WaveShaperNode\`).
   - **Sintetizador de Percusión Integrado:** Generación procedural de Kick (barrido exponencial de frecuencia 150Hz -> 40Hz), Snare (tono + buffer de ruido blanco con envolvente rápida) y Hi-Hat para acompañar la secuencia.
2. **Secuenciador por Pasos (16-Step Sequencer) con Canciones Demo Listas para Sonar:**
   - Matriz interactiva de 16 pasos con pistas para Melodía/Arpegio, Bajo y Batería (Kick, Snare, Hat), control de BPM (60 a 180 BPM) y Swing.
   - **OBLIGATORIO:** Incluye al menos 3 patrones/canciones demo pre-programadas con mucho ritmo y musicalidad (ej. *"Cyberpunk Outrun 128 BPM"*, *"8-Bit Boss Battle 150 BPM"*, *"Acid Techno Lab 135 BPM"*) para que al presionar el botón **PLAY** la estación empiece a tocar música espectacular de inmediato.
3. **Teclado Musical Tocable y Perillas (Knobs) Interactivas:**
   - Teclado de piano de al menos 2 octavas en pantalla que se pueda tocar tanto con el mouse como con el teclado de la computadora (con iluminación reactiva de cada nota activa, tanto manual como disparada por el secuenciador).
4. **Visualizador Dual de Laboratorio a 60 FPS (\`AnalyserNode\`):**
   - Pantalla superior dividida o conmutable con estética de osciloscopio de fósforo/neón que dibuje en tiempo real:
     a) **Forma de Onda en el Dominio del Tiempo (Osciloscopio con efecto de persistencia/glow).**
     b) **Analizador de Espectro de Frecuencias FFT con barras y curva envolvente.**

Escribe el archivo completo y funcional en la carpeta \`05-sintetizador-fm/index.html\` dentro del directorio asignado a tu modelo.`,
    key_requirements: [
      "Sintetizador polifónico FM (Carrier + Modulator + Sub) + ADSR + BiquadFilter + Delay + WaveShaper",
      "Batería electrónica procedural (Kick, Snare, Hi-Hat) sin samples externos",
      "Secuenciador de 16 pasos con mínimo 3 canciones demo listas para sonar y teclado de 2+ octavas",
      "Visualizador dual a 60 FPS: Osciloscopio de fósforo y Analizador de espectro FFT",
    ],
    time_min: { argon: 24, opus: 30 },
    time_exact_min: { argon: 24.07, opus: 30.23 },
    cost_usd: { argon: 0.85, opus: 3.08 },
    tokens: {
      argon_in: "153.6K",
      argon_cache: "317.9K",
      argon_out: "40.3K",
      argon_total: "511.8K",
      argon_steps: 10,
      opus_in: "142K",
      opus_cache: "2.35M",
      opus_out: "95.0K",
      opus_total: "2.59M",
      opus_steps: 27,
    },
    fps: { argon: "60 FPS", opus: "60 FPS" },
    winner: "opus",
    opus_slow_fps: false,
    kevin_note_es:
      "Segundo punto para Claude Opus 5.5. Aunque Argon terminó antes (24.07 min vs 30.23 min) y costó 3.6x menos ($0.85 vs $3.08 USD), Opus entregó una estación DAW completa (`KRONOS-FM // DX-808`) con 8 pistas (sumando línea Acid 303, Pad de Acordes y Clap), 4 compases encadenables (A/B/C/D), Goniómetro X-Y Lissajous y Espectrograma.",
    kevin_note_en:
      "Second point for Claude Opus 5.5. Although Argon finished faster (24.07m vs 30.23m) and cost 3.6x less ($0.85 vs $3.08 USD), Opus delivered a full-blown DAW workstation (`KRONOS-FM // DX-808`) featuring 8 tracks (adding an Acid 303 line, Chord Pad, and Clap), 4 chainable bars (A/B/C/D), an X-Y Lissajous Goniometer, and a Waterfall Spectrogram.",
    argon_features: [
      "8 voces polifónicas FM con 4 canciones demo (Cyberpunk Outrun, 8-Bit Boss, Acid Lab, Blade Synth) y 6 presets de timbre",
      "6 pistas de secuenciador (Lead, Bass, Kick, Snare, Hat Closed, Hat Open) con controles Mute [M] por pista",
      "Doble pantalla CRT simultánea: Osciloscopio en dominio del tiempo + Analizador FFT con retención de picos",
      "3.6x más económico en tokens ($0.85 USD contra $3.08 USD de Opus)",
    ],
    opus_features: [
      "Estación DAW de 8 pistas: Lead FM, Pad Acorde, Bajo FM, Acid 303, Kick 808, Snare, Clap y Hi-Hat",
      "4 bancos de compás (A, B, C, D) con modo Cadena A-D (64 pasos totales) y 5 canciones demo completas",
      "4 modos de visualización CRT: Dual (Onda + FFT), Osciloscopio + Lissajous X-Y, Espectro FFT con notas y Cascada (Espectrograma)",
      "8 presets de parche FM y teclado de 3 octavas (C3 a B5)",
    ],
    opus_observations: [
      "Tardó 30.23 minutos (27 pasos de agente) y costó $3.08 USD",
    ],
    code_stats: {
      argon_lines: 2586,
      opus_lines: 1933,
      argon_kb: 81.0,
      opus_kb: 106.3,
      argon_bytes: 82980,
      opus_bytes: 108860,
    },
    page_titles: {
      argon: "AETHER-FM // Estación de Síntesis Polifónica DSP & Secuenciador de 16 Pasos",
      opus: "KRONOS-FM // DX-808 — Estación de Síntesis Polifónica FM & Secuenciador de 16 Pasos",
    },
    fun_angle_es:
      "Opus se metió en papel de ingeniero de Roland y Yamaha: construyó 8 pistas con una línea Acid 303, encadenamiento de 4 compases y hasta un goniómetro de fase Lissajous X-Y. Su archivo superó los 106 KB de puro DSP.",
    fun_angle_en:
      "Opus channeled classic Roland and Yamaha engineers: it built an 8-track workstation complete with a dedicated Acid 303 bassline, 4-bar pattern chaining, and an X-Y Lissajous phase goniometer in 106 KB of pure DSP code.",
    speed_ratio_es: "Argon 1.26x más rápido (-6.2 min)",
    speed_ratio_en: "Argon 1.26x faster (-6.2 min)",
    cost_ratio_es: "Argon 3.62x más barato ($0.85 vs $3.08)",
    cost_ratio_en: "Argon 3.62x cheaper ($0.85 vs $3.08)",
    faster_model: "argon",
    demo_urls: {
      argon: "/demos/argon/05-sintetizador-fm/index.html",
      opus: "/demos/opus/05-sintetizador-fm/index.html",
    },
    stills: {
      argon: [
        "/stills/ep02/05_sintetizador_fm_argon_1.jpg",
        "/stills/ep02/05_sintetizador_fm_argon_2.jpg",
      ],
      opus: [
        "/stills/ep02/05_sintetizador_fm_opus_1.jpg",
        "/stills/ep02/05_sintetizador_fm_opus_2.jpg",
      ],
      vs: "/stills/ep02/05_sintetizador_fm_vs.jpg",
    },
  },
  {
    n: 6,
    slug: "06_pinball_ccd",
    dir: "06-pinball-ccd",
    world_es: "Nivel 06 · Fisica Arcade con Colision Continua (CCD)",
    world_en: "Level 06 · Arcade Physics with Continuous Collision (CCD)",
    category_es: "Canvas 2D + Sub-stepping 1200 Hz + Transferencia Angular ω×r + WebAudio",
    category_en: "Canvas 2D + 1200 Hz Sub-stepping + ω×r Angular Transfer + WebAudio",
    name_es: "Mesa de Pinball Cyberpunk con CCD",
    name_en: "Cyberpunk Pinball Table with CCD",
    tech: "Sub-stepping 16-20x (960-1200 Hz) + CCD Círculo-Segmento + ω×r Flippers + Multiball",
    timestamp_es: "07:16",
    timestamp_en: "07:01",
    prompt_gist_es:
      "Mesa de pinball cyberpunk sin librerías físicas, con sub-stepping y detección continua de colisiones (CCD) para prohibir el efecto túnel, transferencia tangencial ω×r en flippers, multiball y sonido WebAudio.",
    prompt_gist_en:
      "Zero-library cyberpunk pinball table featuring high-frequency sub-stepping and Continuous Collision Detection (CCD) to prevent tunneling, ω×r tangential flipper impulse, multiball, and WebAudio SFX.",
    prompt_verbatim: `Actúa como un Programador Senior de Física de Videojuegos Arcade. Tu objetivo es superar un benchmark de código "Zero-Shot" construyendo una **Mesa de Pinball Cyberpunk Completa con Física de Colisión Continua (CCD / Sub-stepping), Efectos de Partículas y Sonido Procedural WebAudio** en un único archivo HTML.

REGLAS ESTRICTAS DEL BENCHMARK:
1. Entrega un ÚNICO archivo \`index.html\` 100% autocontenido (HTML, CSS y JavaScript puro con Canvas 2D) que funcione al primer intento sin errores de consola.
2. PROHIBIDO cargar imágenes o sonidos externos, y PROHIBIDO usar librerías de física externas. Todo el motor de colisiones (círculo-segmento, círculo-círculo, velocidad angular de flippers y sub-stepping) debe programarse desde cero.

EL NÚCLEO TÉCNICO DEL RETO (PROHIBIDO EL EFECTO TÚNEL / TUNNELING):
El fallo clásico de las IAs al programar un Pinball es que la bola atraviesa los flippers o las paredes cuando viaja a alta velocidad. Tu motor DEBE garantizar:
1. **Sub-stepping Físico (mínimo 12 a 20 sub-pasos por frame) + Colisión Continua Círculo-Segmento:**
   - En cada sub-paso, calcula el punto más cercano entre el centro de la bola y cada segmento de línea (paredes, plásticos, slingshots y flippers).
   - Cuando un flipper gira hacia arriba a gran velocidad angular ($\\omega$), la bola debe recibir la transferencia real de velocidad tangencial ($\\vec{v}_{\\text{impacto}} = \\vec{\\omega} \\times \\vec{r}$) en el punto exacto de contacto sobre el flipper, saliendo disparada con fuerza realista sin atravesarlo jamás.

ELEMENTOS OBLIGATORIOS DE LA MESA Y JUGABILIDAD:
1. **Arquitectura Completa de Mesa de Pinball:**
   - **Carril de Lanzamiento Derecho con Resorte (Plunger):** Mantener presionado \`Espacio\` (o arrastrar con el mouse) para comprimir el resorte con medidor de tensión y soltar para lanzar la bola por el arco superior.
   - **Par de Flippers Inferiores (y opcionalmente un 3er Flipper superior):** Controlados con \`Flecha Izquierda / Derecha\` o teclas \`A / D\` (y botones táctiles/mouse en pantalla).
   - **Bumpers Activos de Alta Energía (mínimo 4):** Círculos de neón en la zona superior que al ser tocados empujan la bola violentamente, suman puntos, destellan con ondas de choque, sacuden ligeramente la mesa (*screen shake*) y disparan un sonido sintetizado en WebAudio.
   - **Slingshots Laterales, Dianas Abatibles (Drop Targets) y Spinner / Rampa Multiplicadora:** Al completar las dianas se activa el modo **"MULTIBALL (2 o 3 bolas simultáneas en juego con colisión bola-bola)"** o aumenta el multiplicador (\`2x\`, \`4x\`, \`8x\`).
2. **Estética Visual, Telemetría y Marcador LED:**
   - Estelas de luz en las bolas según su velocidad, partículas de chispas en cada rebote y sonido arcade sintetizado con \`AudioContext\` (con botón de Mute).
   - Panel lateral con Marcador estilo Matriz LED (Puntaje actual, High Score, Bolas restantes, Multiplicador activo), más un **Modo Debug Físico** conmutable para ver los vectores de velocidad, normales de colisión de cada pared y contador de sub-steps/FPS en tiempo real.

Escribe el archivo completo y funcional en la carpeta \`06-pinball-ccd/index.html\` dentro del directorio asignado a tu modelo.`,
    key_requirements: [
      "Sub-stepping físico (12-20 sub-pasos/frame) y CCD círculo-segmento con transferencia ω×r en flippers",
      "Carril plunger con resorte, flippers inferiores + 3er flipper superior opcional, 4+ bumpers y slingshots",
      "Dianas abatibles (Drop Targets), rampa/spinner multiplicador y modo MULTIBALL con colisión bola-bola",
      "Marcador Matriz LED (DMD), sonido arcade WebAudio y Modo Debug Físico con vectores y normales",
    ],
    time_min: { argon: 8, opus: 25 },
    time_exact_min: { argon: 7.65, opus: 24.57 },
    cost_usd: { argon: 0.7, opus: 2.49 },
    tokens: {
      argon_in: "97.2K",
      argon_cache: "65.2K",
      argon_out: "41.2K",
      argon_total: "203.6K",
      argon_steps: 3,
      opus_in: "118K",
      opus_cache: "1.90M",
      opus_out: "76.0K",
      opus_total: "2.09M",
      opus_steps: 22,
    },
    fps: { argon: "120 FPS (1200 Hz)", opus: "120 FPS (960 Hz)" },
    winner: "argon",
    opus_slow_fps: false,
    kevin_note_es:
      "Cierre contundente de Gemini 4 Argon para sellar el 4-2. En apenas 7.65 minutos (3 pasos, $0.70 USD) contra 24.57 minutos de Opus ($2.49 USD), Argon entregó una mesa con 3 flippers (incluyendo flipper superior derecho), 20 sub-pasos CCD a 1200 Hz (361,560 chequeos/seg), escudos láser Kickback y botón directo TEST MULTIBALL (3X).",
    kevin_note_en:
      "Emphatic closer by Gemini 4 Argon to seal the 4-2 victory. In just 7.65 minutes (3 steps, $0.70 USD) versus Opus's 24.57 minutes ($2.49 USD), Argon delivered a 3-flipper table (including an upper-right flipper), 20 CCD sub-steps at 1200 Hz (361,560 checks/sec), laser Kickback shields, and an instant TEST MULTIBALL (3X) button.",
    argon_features: [
      "3 flippers activos (2 inferiores + 1 flipper superior derecho para cruzar hacia la rampa de neón)",
      "20 sub-pasos CCD por frame (1,200 Hz / 361,560 chequeos por segundo) con cero efecto túnel",
      "5 bumpers reactivos, 2 bancos de dianas (CYBER y NEXUS), rampa orbital, spinner y escudos láser Kickback",
      "Botón directo TEST MULTIBALL (3X) en el HUD para auditar colisiones bola-bola al instante",
      "Entregado en solo 3 pasos de agente (7.65 min, $0.70 USD)",
    ],
    opus_features: [
      "3 flippers (2 inferiores + 1 superior izquierdo), 5 bumpers, 6 drop targets y rampa SKYWAY RAMP",
      "Pantalla Dot-Matrix Display (DMD) ámbar estilo arcade clásico y telemetría de transferencia ω×r",
      "Botón de Multiball [M], Nudge [T] con sensor de TILT y modo Debug Físico [D]",
    ],
    opus_observations: [
      "Tardó 3.21x más tiempo (24.57 min vs 7.65 min) y costó 3.55x más ($2.49 vs $0.70 USD)",
    ],
    code_stats: {
      argon_lines: 2749,
      opus_lines: 1508,
      argon_kb: 95.0,
      opus_kb: 79.4,
      argon_bytes: 97293,
      opus_bytes: 81275,
    },
    page_titles: {
      argon: "CYBER-PINBALL 2099 // Motor Físico CCD & Sub-Stepping Lab",
      opus: "NEXUS PINBALL // CCD Physics Lab — Sub-Stepping 16x",
    },
    fun_angle_es:
      "Argon resolvió una mesa de pinball completa de 2,749 líneas en 7 minutos y medio (3 pasos de agente y 70 centavos), incluyendo un tercer flipper superior, escudos láser en los carriles exteriores y 361,560 chequeos CCD por segundo.",
    fun_angle_en:
      "Argon built a complete 2,749-line pinball table in 7.6 minutes (3 agent steps and 70 cents), complete with a third upper flipper, outlane laser kickback shields, and 361,560 CCD checks per second.",
    speed_ratio_es: "Argon 3.21x más rápido (-16.9 min)",
    speed_ratio_en: "Argon 3.21x faster (-16.9 min)",
    cost_ratio_es: "Argon 3.56x más barato ($0.70 vs $2.49)",
    cost_ratio_en: "Argon 3.56x cheaper ($0.70 vs $2.49)",
    faster_model: "argon",
    demo_urls: {
      argon: "/demos/argon/06-pinball-ccd/index.html",
      opus: "/demos/opus/06-pinball-ccd/index.html",
    },
    stills: {
      argon: [
        "/stills/ep02/06_pinball_ccd_argon_1.jpg",
        "/stills/ep02/06_pinball_ccd_argon_2.jpg",
      ],
      opus: [
        "/stills/ep02/06_pinball_ccd_opus_1.jpg",
        "/stills/ep02/06_pinball_ccd_opus_2.jpg",
      ],
      vs: "/stills/ep02/06_pinball_ccd_vs.jpg",
    },
  },
];

export const EPISODE_02_CHAPTERS: Ep02ChapterItem[] = [
  {
    time_es: "00:00",
    seconds_es: 0,
    time_en: "00:00",
    seconds_en: 0,
    title_es: "La factura de tokens y el cronómetro (Gancho)",
    title_en: "The token bill and the stopwatch (Hook)",
    level: null,
  },
  {
    time_es: "00:29",
    seconds_es: 29,
    time_en: "00:31",
    seconds_en: 31,
    title_es: "Protocolo Fair-Play y auditoría de tokens",
    title_en: "Fair-Play protocol and token audit",
    level: null,
  },
  {
    time_es: "01:12",
    seconds_es: 72,
    time_en: "01:15",
    seconds_en: 75,
    title_es: "Nivel 1: Tela Física con Desgarro (Verlet)",
    title_en: "Level 1: Tearable Cloth Physics (Verlet)",
    level: 1,
  },
  {
    time_es: "02:28",
    seconds_es: 148,
    time_en: "02:26",
    seconds_en: 146,
    title_es: "Nivel 2: Fluidos Navier-Stokes en GPU",
    title_en: "Level 2: GPU Navier-Stokes Fluids",
    level: 2,
  },
  {
    time_es: "03:36",
    seconds_es: 216,
    time_en: "03:33",
    seconds_en: 213,
    title_es: "Nivel 3: Cuerpos Blandos 3D y Raymarching SDF",
    title_en: "Level 3: 3D Soft Bodies & SDF Raymarching",
    level: 3,
  },
  {
    time_es: "04:47",
    seconds_es: 287,
    time_en: "04:37",
    seconds_en: 277,
    title_es: "Nivel 4: Motor Voxel 3D y Greedy Meshing",
    title_en: "Level 4: 3D Voxel Engine & Greedy Meshing",
    level: 4,
  },
  {
    time_es: "05:59",
    seconds_es: 359,
    time_en: "05:47",
    seconds_en: 347,
    title_es: "Nivel 5: Sintetizador Polifónico FM (WebAudio)",
    title_en: "Level 5: Polyphonic FM Synthesizer (WebAudio)",
    level: 5,
  },
  {
    time_es: "07:16",
    seconds_es: 436,
    time_en: "07:01",
    seconds_en: 421,
    title_es: "Nivel 6: Pinball Cyberpunk con CCD",
    title_en: "Level 6: Cyberpunk Pinball with CCD",
    level: 6,
  },
  {
    time_es: "08:29",
    seconds_es: 509,
    time_en: "08:15",
    seconds_en: 495,
    title_es: "Resultados finales, tiempos y factura de tokens",
    title_en: "Final scoreboard, times and token bill",
    level: null,
  },
  {
    time_es: "09:22",
    seconds_es: 562,
    time_en: "09:03",
    seconds_en: 543,
    title_es: "Veredicto del Laboratorio ($6.26 vs $16.26 USD)",
    title_en: "Lab Verdict ($6.26 vs $16.26 USD)",
    level: null,
  },
];

export const EP02_HONESTY_NOTES: { es: string; en: string }[] = [
  {
    es: "Igualdad estricta de esfuerzo (Fair-Play High vs High): Ambos modelos se corrieron en su nivel 'High'. No se usó 'Medium' en Opus para no restarle capacidad de razonamiento, ni 'Max/Ultracode' porque dispara bucles multi-hora que distorsionan la métrica Zero-Shot.",
    en: "Strict effort symmetry (Fair-Play High vs High): Both models ran at 'High' effort. We avoided 'Medium' on Opus so as not to handicap its reasoning, and avoided 'Max/Ultracode' which triggers multi-hour loops that distort Zero-Shot wall-clock metrics.",
  },
  {
    es: "Ningún modelo entregó código roto (6/6 funcionales en ambos): A diferencia del Episodio 01 donde Flash rompió 2 entregas, tanto Gemini 4 Argon como Claude Opus 5.5 lograron 6 de 6 aplicaciones 100% ejecutables sin errores de consola.",
    en: "Neither model shipped broken code (6/6 functional on both): Unlike Episode 01 where Flash broke 2 deliverables, both Gemini 4 Argon and Claude Opus 5.5 achieved 6 out of 6 fully working applications with zero console errors.",
  },
  {
    es: "¿Por qué Opus consumió 13.01M de tokens ($16.26 USD) frente a 3.63M ($6.26 USD) de Argon? Porque el agente de Claude Opus 5.5 realizó 143 pasos totales abriendo el navegador headless y releyendo su propio contexto cacheado (12.25M en Cache Read), mientras que Argon resolvió 3 de los 6 retos en solo 2 a 3 pasos directos (45 pasos en total).",
    en: "Why did Opus consume 13.01M tokens ($16.26 USD) vs Argon's 3.63M ($6.26 USD)? Because Claude Opus 5.5's agent executed 143 total steps spinning up headless browser checks and re-reading its cached context (12.25M Cache Read tokens), whereas Argon solved 3 of the 6 challenges in just 2 to 3 direct steps (45 total steps).",
  },
  {
    es: "Transparencia en el Nivel 04 (Motor Voxel): Argon se llevó el punto por velocidad (6.99 min vs 23.65 min) y costo ($0.67 vs $2.51 USD) a 120 FPS, pero documentamos que el motor de Opus escala a 2,586,165 voxels en 213 chunks con Ambient Occlusion por vértice e iluminación BFS.",
    en: "Transparency on Level 04 (Voxel Engine): Argon took the point for speed (6.99m vs 23.65m) and cost ($0.67 vs $2.51 USD) at 120 FPS, but we explicitly credit Opus for scaling to 2,586,165 voxels across 213 chunks with per-vertex Ambient Occlusion and BFS lighting.",
  },
  {
    es: "Victorias legítimas de Claude Opus 5.5 (Niveles 03 y 05): En Cuerpos Blandos 3D Opus fue más rápido (30.87 vs 34.74 min) e incluyó 6 morfologías XPBD; en el Sintetizador FM construyó una estación DAW de 8 pistas con línea Acid 303, 4 compases encadenables y goniómetro Lissajous X-Y.",
    en: "Claude Opus 5.5's well-earned victories (Levels 03 & 05): In 3D Soft Bodies Opus finished faster (30.87m vs 34.74m) and sculpted 6 XPBD shapes; in the FM Synthesizer it built an 8-track DAW with an Acid 303 line, 4-bar chaining, and an X-Y Lissajous goniometer.",
  },
  {
    es: "Audio real de cada proyecto sincronizado al cuadro (0.000 ms delay): Tanto en el video 4K60 como en los 6 Shorts, las 12 ventanas de demostración reproducen el audio real sintetizado por el Web Audio API de cada entrega sin música ni voz encima.",
    en: "Frame-accurate real project audio (0.000 ms delay): Across both the 4K60 master video and all 6 Shorts, the 12 showcase windows play the genuine Web Audio output generated by each model's code with zero background music or voiceover.",
  },
];
