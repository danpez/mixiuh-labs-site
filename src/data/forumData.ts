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
  relatedChallengeN?: number;
  tags: string[];
  codeComparison?: {
    title_es: string;
    title_en: string;
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
    id: "prop-argon-vs-claude",
    title_es: "Gemini 4 Argon (High) vs. Claude 4.6 Opus — 10 Retos de Fisica y Motores 3D",
    title_en: "Gemini 4 Argon (High) vs. Claude 4.6 Opus — 10 Physics & 3D Engine Challenges",
    models: "Gemini 4 Argon vs Claude 4.6 Opus",
    category_es: "Duelo de Modelos Frontera",
    category_en: "Frontier Model Duel",
    description_es: "Mismo protocolo estricto Zero-Shot en un solo index.html sin texturas externas: tela Verlet con desgarro, fluidos Navier-Stokes en WebGL, cinematica inversa y raytracing en tiempo real.",
    description_en: "Same strict single-file index.html Zero-Shot protocol with zero external assets: tearable Verlet cloth, WebGL Navier-Stokes fluids, inverse kinematics, and real-time raytracing.",
    votes: 148,
    status_es: "En cabeza para EP02",
    status_en: "Leading for EP02",
  },
  {
    id: "prop-emulador-chip8",
    title_es: "Reto Jefe: Emulador de Consola Retro + Ensamblador y ROM Procedural en 1 Archivo",
    title_en: "Boss Challenge: Retro Console Emulator + Assembler & Procedural ROM in 1 File",
    models: "Argon vs Flash vs Opus",
    category_es: "Arquitectura de Sistemas",
    category_en: "Systems Architecture",
    description_es: "Pedir en un solo intento una maquina virtual con ciclo fetch-decode-execute, registros en vivo, debugger paso a paso en hexadecimal y un juego jugable compilado en memoria al abrir el HTML.",
    description_en: "Zero-shot virtual machine featuring a fetch-decode-execute cycle, live CPU register inspector, hex step-by-step debugger, and a playable game compiled in memory on load.",
    votes: 112,
    status_es: "Candidato Nivel Jefe",
    status_en: "Boss Level Candidate",
  },
  {
    id: "prop-sintetizador-dsp",
    title_es: "Sintetizador Polifonico FM + Secuenciador y Osciloscopio FFT con WebAudio Puro",
    title_en: "Polyphonic FM Synth + Sequencer & FFT Oscilloscope in Pure WebAudio",
    models: "Gemini 4 Argon vs GPT-5.4 High",
    category_es: "DSP y Audio Procedural",
    category_en: "DSP & Procedural Audio",
    description_es: "Cero samples externos: osciladores modulados en frecuencia, envolventes ADSR, filtro resonante biquad, reverb de convolucion algoritmica y espectro FFT a 60 FPS.",
    description_en: "Zero external audio samples: FM operators, ADSR envelopes, biquad resonant filter, algorithmic convolution reverb, and 60 FPS FFT spectrum analyzer.",
    votes: 94,
    status_es: "En evaluacion",
    status_en: "Under Evaluation",
  },
  {
    id: "prop-cuerpo-blando-sdf",
    title_es: "Fisica de Cuerpo Blando 3D (Marching Cubes SDF) — El Origen de los Gummy Bears",
    title_en: "3D Soft-Body Physics (Marching Cubes SDF) — The Gummy Bears Challenge",
    models: "Benchmark Abierto",
    category_es: "WebGL y Shaders",
    category_en: "WebGL & Shaders",
    description_es: "Convertir el experimento extra de la madrugada del 14 de octubre (Gummy Bears con 10 puntos de masa, conservacion de volumen y Marching Cubes SDF) en una prueba oficial cronometrada.",
    description_en: "Turn the post-benchmark Gummy Bears experiment (10 mass points, volume conservation, and Marching Cubes SDF) into an official timed zero-shot challenge.",
    votes: 87,
    status_es: "Solicitado por la comunidad",
    status_en: "Community Requested",
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: "thread-ep01-dossier",
    slug: "ep01-dossier-oficial-gemini-4-argon-vs-3-8-flash",
    category: "benchmarks",
    pinned: true,
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
