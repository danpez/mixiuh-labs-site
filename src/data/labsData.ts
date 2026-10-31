// Auto-generated verified dataset from Mixiuh Labs research/facts.json and comparative lab notes.
// Strict compliance: Zero emojis, 100% verified metrics and verbatim prompts.

export interface ChallengeData {
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
  /** English twin of `tech`; set only where `tech` contains Spanish words. */
  tech_en?: string;
  timestamp: string;
  prompt_gist_es: string;
  prompt_gist_en: string;
  prompt_verbatim: string;
  key_requirements: string[];
  time_min: { argon: number; flash: number };
  winner: "argon" | "flash";
  flash_broken: boolean;
  kevin_note_verbatim: string;
  /** Faithful, literal English translation of `kevin_note_verbatim`: the only English text to quote as Kevin's words. */
  kevin_note_verbatim_en?: string;
  kevin_note_paraphrase_es: string;
  /** Editorial English summary, not Kevin's words: never show it in quotes or label it as his note or verdict. */
  kevin_note_en: string;
  argon_features: string[];
  /** English twin of `argon_features` (same length and order). */
  argon_features_en?: string[];
  flash_features: string[];
  /** English twin of `flash_features` (same length and order). */
  flash_features_en?: string[];
  flash_problems: string[];
  /** English twin of `flash_problems` (same length and order). */
  flash_problems_en?: string[];
  code_stats: {
    argon_lines: number;
    flash_lines: number;
    argon_kb: number;
    flash_kb: number;
    argon_bytes: number;
    flash_bytes: number;
  };
  page_titles: { argon: string; flash: string };
  fun_angle_es: string;
  fun_angle_en: string;
  speed_ratio: string;
  /** English twin of `speed_ratio` (which is Spanish); same figures. */
  speed_ratio_en?: string;
  faster_model: "argon" | "flash";
  observed_in_recording: Record<string, string> | null;
  demo_urls: { argon: string; flash: string };
  stills: { argon: string[]; flash: string[] };
}

export interface ChapterItem {
  time: string;
  seconds: number;
  title_es: string;
  title_en: string;
  level: number | null;
}

// The glossary and channel links live in glossary.ts, which the home page can
// load without this EP01 dataset; re-exported here for existing importers.
export {
  LAB_GLOSSARY,
  YOUTUBE_LINKS,
  type GlossaryItem,
} from "@/data/glossary";

export const BENCHMARK_TOTALS = {
  "argon_min": 55,
  "flash_min": 94,
  "minutes_saved_by_argon": 39,
  "argon_functional": "10/10",
  "flash_functional": "8/10",
  "flash_broken_challenges": [
    4,
    6
  ],
  "score": "10-0",
  "score_basis": "Calidad/funcionalidad según las notas de Kevin (Argon declarado ganador en los 10). En velocidad NO es 10-0: Argon fue más rápido en 7 retos y Flash en 3 (1 sistema solar, 3 boids, 4 mazmorras; en mazmorras porque Flash se rindió a los 2 min).",
  "pct_time_saved": 41.5,
  "flash_vs_argon_total_ratio": 1.71,
  "argon_faster_in": [
    2,
    5,
    6,
    7,
    8,
    9,
    10
  ],
  "flash_faster_in": [
    1,
    3,
    4
  ],
  "argon_median_min": 4.0,
  "flash_median_min": 8.0,
  "code_fun_fact_es": "Argon escribió menos líneas en total que Flash pero más kilobytes: líneas más densas. Ver code_totals.",
  "biggest_gap": "Reto 9 árbol fractal: 22 vs 4 min (5.5x)",
  "fastest_single": "Reto 8 reloj CSS: Argon 2 min",
  "slowest_single": "Reto 9 árbol fractal: Flash 22 min",
  "argon_under_5min": "8 de 10 retos en 5 minutos o menos (todos menos sistema solar 11 y mazmorras 12)",
  "code_totals": {
    "argon_lines": 17582,
    "flash_lines": 18673,
    "argon_kb": 671.3,
    "flash_kb": 603.7
  },
  "computed_from": "Argon: 11+5+5+12+4+4+4+2+4+4 = 55 min. Flash: 7+7+3+2+9+17+13+4+22+10 = 94 min. Ahorro: 94-55 = 39 min; 39/94 = 41.49% = 41.5%. Flash/Argon = 94/55 = 1.709x. Ratios por reto = mayor/menor: 7/5=1.4, 9/4=2.25, 17/4=4.25, 13/4=3.25, 4/2=2.0, 22/4=5.5, 10/4=2.5 (Argon); 11/7=1.57, 5/3=1.67, 12/2=6.0 (Flash). Lineas = conteo de saltos de linea (wc -l); kb = bytes/1024."
} as const;

export const CHALLENGES: ChallengeData[] = [
  {
    "n": 1,
    "slug": "sistema_solar",
    "dir": "sistema-solar",
    "world_es": "Mundo 1 · WebGL y 3D (Three.js)",
    "world_en": "World 1 · WebGL & 3D (Three.js)",
    "category_es": "WebGL y 3D (Three.js)",
    "category_en": "World 1 · WebGL & 3D (Three.js)",
    "name_es": "Sistema Solar Relativo",
    "name_en": "Relative Solar System",
    "tech": "Three.js r160 (CDN, importmap) + shaders GLSL propios + UnrealBloom",
    "tech_en": "Three.js r160 (CDN, importmap) + custom GLSL shaders + UnrealBloom",
    "timestamp": "01:00",
    "prompt_gist_es": "Un mini sistema solar en 3D: el Sol en el centro dando luz, la Tierra con océanos y continentes inventados por código, y la Luna girando alrededor de la Tierra mientras ambas viajan alrededor del Sol.",
    "prompt_gist_en": "A relative 3D solar system in Three.js with real point-light emission, procedural GLSL/Canvas Earth continents, hierarchical SceneGraph moon orbit, and eclipse occlusion.",
    "prompt_verbatim": "Actúa como un Programador Gráfico de Élite y Artista Técnico (Creative Coder) experto en WebGL y Three.js. \n\nTu objetivo es superar un benchmark de código \"Zero-Shot\". Debes escribir un archivo HTML único que contenga HTML, CSS y JavaScript (Three.js) para renderizar un \"Mini Sistema Solar Relativo\". El código debe ejecutarse a la perfección en el navegador al primer intento, sin errores de consola, sin requerir servidores locales y sin pasos adicionales de compilación.\n\nREGLA DE ORO: ESTÁ ESTRICTAMENTE PROHIBIDO cargar recursos externos (imágenes, texturas .jpg/.png, modelos 3D). Todo lo visual debe generarse mediante código, matemáticas o proceduralmente.\n\n## Requisitos Técnicos Obligatorios:\n1. **Entorno y Librerías:** Usa módulos ES (ESM) nativos en el navegador. Utiliza un `<script type=\"importmap\">` apuntando a un CDN confiable (como unpkg o cdnjs) para importar `three` y el addon `OrbitControls`.\n2. **Jerarquía Espacial (SceneGraph):** Debes demostrar un dominio perfecto de las agrupaciones (Object3D/Groups).\n   - La Tierra debe orbitar alrededor del Sol.\n   - La Luna debe orbitar alrededor de la Tierra (y seguirla en su viaje alrededor del Sol).\n   - Usa la jerarquía de padres/hijos nativa de Three.js. No hardcodees las posiciones de la luna calculando senos y cosenos basados en el Sol de forma plana; usa la matriz de transformación del Group de la Tierra.\n3. **El Sol e Iluminación:** El Sol debe situarse en el centro. No debe verse afectado por las luces (emite luz). Usa un `PointLight` anclado a la posición del Sol para iluminar el resto del sistema.\n4. **Textura Procedural (El mayor reto):** Como no puedes usar imágenes, la Tierra debe tener océanos y continentes generados proceduralmente. Puedes lograrlo escribiendo un `ShaderMaterial` personalizado (GLSL con ruido Perlin/Simplex) o generando un `<canvas>` en memoria con ruido fractal bidimensional y pasándolo como un `CanvasTexture` al material de la Tierra. \n5. **Cámara y Controles:** La cámara debe empezar en un ángulo isométrico atractivo. Instancia `OrbitControls` con damping habilitado para que el usuario pueda rotar, hacer zoom y panear suavemente.\n\n## Libertad Creativa y Estética (¡Lúcete!):\nNo te limites a un diseño sobrio o aburrido. Tienes total libertad albedrío para hacer que esto se vea ESPECTACULAR. \n- Puedes agregar un campo de estrellas tridimensional (`THREE.Points`).\n- Puedes añadir post-procesamiento (Bloom) para que el Sol brille de verdad, o simular un resplandor atmosférico alrededor de la Tierra usando shaders o sprites (siempre generado por código).\n- Juega con los colores, las velocidades de órbita y los tamaños relativos (no tienen que ser a escala real, deben ser visualmente atractivos).\n\n## Formato de Entrega:\nDevuelve ÚNICAMENTE el bloque de código ` ```html ` con el código completo y final. No incluyas explicaciones antes ni después. Tu respuesta debe empezar con `<!DOCTYPE html>` y terminar con `</html>`. Demuestra de lo que eres capaz.\n\nTodo en una carpeta llamada \"sistema-solar\"",
    "key_requirements": [
      "Three.js con importmap desde CDN y OrbitControls con damping",
      "Jerarquía padre-hijo real: Luna hija del grupo de la Tierra (sin senos/cosenos planos)",
      "Sol emisivo + PointLight en su posición",
      "Textura procedural de la Tierra (shader con ruido o CanvasTexture), cero imágenes",
      "Cámara inicial isométrica; libertad para estrellas, bloom, atmósfera"
    ],
    "time_min": {
      "argon": 11,
      "flash": 7
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "4 Argon gana. Mejores graficos, sin errores, luminicencia del sol configurable, angulo de la luna configurable, fondo mejor diseñado.",
    "kevin_note_verbatim_en": "4 Argon wins. Better graphics, no errors, configurable sun luminescence, configurable moon angle, better-designed background.",
    "kevin_note_paraphrase_es": "Gana Argon: mejores gráficos y cero errores; además deja configurar la intensidad del brillo del Sol y el ángulo de la órbita de la Luna, y su fondo espacial está mejor diseñado.",
    "kevin_note_en": "Argon wins. Superior shader graphics, zero console errors, configurable solar luminescence, adjustable lunar inclination, and real GLSL eclipse shadow.",
    "argon_features": [
      "Sol con shader GLSL propio: granulación, manchas solares y filamentos (ruido simplex + fBM)",
      "Corona solar con capas Fresnel aditivas y prominencias; UnrealBloom con slider 'Intensidad Corona / Bloom HDR'",
      "Tierra en shader: continentes procedurales, luces de ciudades en el lado nocturno, capa de nubes con giro propio y halo atmosférico Fresnel",
      "Inclinación axial 23.44° e inclinación orbital lunar 5.14° (slider para cambiarla)",
      "Laboratorio de eclipses: botones Eclipse Solar / Eclipse Lunar ('luna de sangre') y oclusión calculada por píxel en GLSL",
      "Panel que dibuja el grafo de escena (árbol de matrices Sol -> Tierra -> Luna) y widget de fase lunar",
      "Nebulosa procedural en GLSL sobre esfera de fondo + campo de estrellas (THREE.Points)",
      "Anclaje de cámara con teclas 1-4 (Sol, Tierra, Luna, Sistema); toggles O/V/C/S/L/G; escala temporal 0.05x a 8x"
    ],
    "argon_features_en": [
      "Sun with its own GLSL shader: granulation, sunspots and filaments (simplex noise + fBM)",
      "Solar corona with additive Fresnel layers and prominences; UnrealBloom with an 'Intensidad Corona / Bloom HDR' (corona intensity / HDR bloom) slider",
      "Shader-based Earth: procedural continents, city lights on the night side, a cloud layer with its own rotation and a Fresnel atmospheric halo",
      "23.44° axial tilt and 5.14° lunar orbital inclination (with a slider to change it)",
      "Eclipse lab: Solar Eclipse / Lunar Eclipse buttons ('blood moon') and per-pixel occlusion computed in GLSL",
      "Panel that draws the scene graph (matrix tree Sun -> Earth -> Moon) and a lunar phase widget",
      "Procedural GLSL nebula on a background sphere + star field (THREE.Points)",
      "Camera anchoring with keys 1-4 (Sun, Earth, Moon, System); O/V/C/S/L/G toggles; time scale 0.05x to 8x"
    ],
    "flash_features": [
      "Texturas de la Tierra generadas en CPU con ruido simplex a CanvasTexture (día, especular, noche, relieve) + nubes",
      "Luna con mares y cráteres procedurales; 10,000 estrellas con color por temperatura",
      "Botones Eclipse Solar / Eclipse Lunar, enfoque de cámara 1-5 y modo cinemático [H]",
      "Slider de intensidad de luz solar; velocidades 0.2x a 60x; UnrealBloom"
    ],
    "flash_features_en": [
      "Earth textures generated on the CPU with simplex noise into a CanvasTexture (day, specular, night, relief) + clouds",
      "Moon with procedural maria and craters; 10,000 stars colored by temperature",
      "Solar Eclipse / Lunar Eclipse buttons, camera focus 1-5 and cinematic mode [H]",
      "Sunlight intensity slider; speeds 0.2x to 60x; UnrealBloom"
    ],
    "flash_problems": [
      "Sin errores graves reportados; Kevin lo consideró inferior en gráficos y fondo",
      "No tiene control del ángulo de la órbita lunar (Argon sí)",
      "Carga Google Fonts y es-module-shims desde CDN (no son imágenes, pero no es 100% autocontenido)"
    ],
    "flash_problems_en": [
      "No serious errors reported; Kevin considered it inferior in graphics and background",
      "No control over the lunar orbit angle (Argon has one)",
      "Loads Google Fonts and es-module-shims from a CDN (they are not images, but it is not 100% self-contained)"
    ],
    "code_stats": {
      "argon_lines": 2653,
      "flash_lines": 2285,
      "argon_kb": 100.0,
      "flash_kb": 78.2,
      "argon_bytes": 102401,
      "flash_bytes": 80074
    },
    "page_titles": {
      "argon": "ASTRUM // Simulación Relativa Sol - Tierra - Luna [Motor Procedural GLSL]",
      "flash": "HELIOS-3 // Simulador Orbital Relativo Sol - Tierra - Luna"
    },
    "fun_angle_es": "El único reto 3D donde Flash fue más rápido: 7 minutos contra 11. Aun así perdió: Argon se tomó el tiempo de dibujar en pantalla su propio árbol genealógico de matrices, Sol, Tierra y Luna, y de calcular los eclipses píxel por píxel.",
    "fun_angle_en": "The only 3D challenge where Flash was faster: 7 minutes vs 11. It still lost: Argon took the time to draw its own family tree of matrices on screen, Sun, Earth and Moon, and to compute the eclipses pixel by pixel.",
    "speed_ratio": "Flash 1.57x más rápido (4 min menos)",
    "speed_ratio_en": "Flash 1.57x faster (4 min less)",
    "faster_model": "flash",
    "observed_in_recording": null,
    "demo_urls": {
      "argon": "/demos/argon/sistema-solar/index.html",
      "flash": "/demos/flash/sistema-solar/index.html"
    },
    "stills": {
      "argon": [
        "/stills/sistema_solar_101.2s_argon.jpg",
        "/stills/sistema_solar_82.0s_argon.jpg",
        "/stills/sistema_solar_89.5s_argon.jpg"
      ],
      "flash": [
        "/stills/sistema_solar_20.0s_flash.jpg",
        "/stills/sistema_solar_38.5s_flash.jpg",
        "/stills/sistema_solar_50.0s_flash.jpg"
      ]
    }
  },
  {
    "n": 2,
    "slug": "visualizador_adn",
    "dir": "visualizador-adn",
    "world_es": "Mundo 1 · WebGL y 3D (Three.js)",
    "world_en": "World 1 · WebGL & 3D (Three.js)",
    "category_es": "WebGL y 3D (Three.js)",
    "category_en": "World 1 · WebGL & 3D (Three.js)",
    "name_es": "Visualizador ADN 3D",
    "name_en": "3D Particle DNA Visualizer",
    "tech": "Three.js r160 + shaders GLSL de puntos + física de resortes (Ley de Hooke) en CPU",
    "tech_en": "Three.js r160 + GLSL point shaders + spring physics (Hooke's Law) on the CPU",
    "timestamp": "01:44",
    "prompt_gist_es": "Una doble hélice de ADN hecha con miles de partículas que gira sola; al pasar el mouse las partículas se dispersan y luego regresan a su lugar como si fueran resortes.",
    "prompt_gist_en": "High-density 3D double helix made of thousands of reactive particles with Hooke's Law spring-damping restoration, cursor repulsion, and ATCG base-pair coloring.",
    "prompt_verbatim": "Actúa como un Ingeniero Gráfico Senior y Desarrollador Creativo. Tu objetivo es construir un **Visualizador de ADN en 3D Interactivo de alta densidad de partículas**, que cuente con simulación física de fuerzas y un estilo visual cinematográfico/cyberpunk espectacular. Se ejecutará en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** No estás limitado únicamente a tecnologías web básicas. Puedes utilizar el entorno que te permita alcanzar la mayor fidelidad visual y rendimiento en tiempo real para simular más de 10,000 partículas activas (por ejemplo, un archivo único HTML5 con **Three.js + Shaders GLSL personalizados + Post-procesado/Bloom**, o una aplicación local en **Python con ModernGL/Pygame**).\n* **Estilo Visual (Cero Sobriedad):** Imagina una interfaz sacada de una película de ciencia ficción de bio-tecnología: bioluminiscencia intensa, efecto de brillo acumulado (*Bloom/Glow*), aberración cromática, rastros de movimiento de partículas, sutiles rejillas digitales en el fondo, y un HUD de datos en pantalla estilo cyberpunk con telemetría en tiempo real (FPS, contador de partículas, fuerza de dispersión, velocidad de rotación).\n* **Cero Dependencias Externas de Texturas:** **PROHIBIDO** cargar imágenes externas para las partículas o texturas. Las partículas de la cadena de ADN deben generarse proceduralmente (como esferas 3D con Shaders, \"point sprites\" con gradientes, o a través de buffers de renderizado rápido).\n\n---\n\n### 2. Requerimientos Matemáticos y Físicos (El Núcleo del Reto)\nDebes recrear la doble hélice con precisión utilizando matemáticas y un motor de partículas con estado dinámico (fuerzas y restauración):\n1. **La Doble Hélice (Matemáticas):** \n   * Calcula los puntos de la hélice dual usando fórmulas paramétricas: \n     $$x_1 = r \\cdot \\cos(\\theta), \\quad z_1 = r \\cdot \\sin(\\theta), \\quad y_1 = p \\cdot \\theta$$\n     $$x_2 = r \\cdot \\cos(\\theta + \\pi), \\quad z_2 = r \\cdot \\sin(\\theta + \\pi), \\quad y_2 = p \\cdot \\theta$$\n     Donde $r$ es el radio y $p$ es el paso de la hélice.\n   * La cadena debe componerse de dos hebras principales (miles de partículas estrechamente unidas) y los \"peldaños\" (enlaces base o pares de bases nitrogenadas) que conectan ambas hebras de manera transversal, interpolando posiciones y cambiando de color según el tipo de base (Adenina, Timina, Citosina, Guanina) en base a un índice procedural.\n2. **Sistema de Partículas Dinámico (Fuerza e Inercia):**\n   * **Posiciones Objetivo (Base):** Cada una de las miles de partículas debe conocer su posición original/teórica dentro de la hélice de ADN.\n   * **Comportamiento del Mouse / Puntero (Raycasting o espacio de pantalla):** Al pasar el cursor, calcula la distancia 3D de cada partícula al cursor. Si está por debajo de un umbral de influencia, aplica una **Fuerza de Dispersión / Repulsión** que empuje la partícula hacia afuera del puntero (por ejemplo, $F \\propto 1/d^k$ o una explosión de partículas).\n   * **Algoritmo de Retorno (Física de Resortes):** Cada partícula, una vez que el mouse se aleja, debe volver a su posición teórica original aplicando una fuerza de retorno elástico amortiguado (Estilo *Hooke's Law*: $F = -k \\cdot \\text{distancia} - c \\cdot v$). Esto evitará que las partículas vuelvan de forma instantánea o lineal, dándoles un comportamiento de \"tejido fluido\" o \"rebote magnético\" orgánico y natural.\n\n---\n\n### 3. Requerimientos Visuales y Controles\n1. **Representación de Alta Complejidad Visual:**\n   * Bioluminiscencia de colores intensos (Ej: Cyans/Azules para la hebra A, Magentas/Violetas para la hebra B, y combinaciones de verdes, amarillos o naranjas para las uniones base).\n   * Haz que la cadena completa rote suavemente de forma autónoma en el espacio tridimensional mientras se ondula sutilmente como una estructura orgánica vibrante.\n   * Añade partículas de \"ambiente\" (polvo de fondo flotando perezosamente en el espacio oscuro) para generar mayor profundidad de campo tridimensional.\n2. **Interfaz de Usuario Interactiva (HUD):**\n   * Panel de control gráfico o barra lateral interactiva (como `dat.gui` o similar inyectada) para ajustar parámetros en caliente:\n     - Escala del efecto de dispersión (fuerza del mouse).\n     - Velocidad y elasticidad de retorno de las partículas (`springiness`, `damping`).\n     - Velocidad orbital de rotación de la cadena.\n     - Densidad de las partículas.\n     - Tipo de visualización (Partículas de diferentes formas, modo alambre de uniones base, o rastro de partículas).\n3. **Cámara Interactiva:**\n   * Soporte para órbita libre, zoom de acercamiento extremo para ver la física a micro-escala y paneo.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión de código (`// ... continuar con el resto`) o dejar algoritmos de física y retorno a medias.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"visualizador-adn\"",
    "key_requirements": [
      "Doble hélice con fórmulas paramétricas y peldaños de bases A, T, C, G con colores",
      "Más de 10,000 partículas con posición objetivo, repulsión por el cursor y retorno tipo resorte amortiguado",
      "Estética cyberpunk: bloom, aberración cromática, estelas, rejilla, polvo ambiental, HUD con FPS",
      "Panel en vivo: fuerza de dispersión, elasticidad y amortiguamiento, velocidad de rotación, DENSIDAD de partículas y TIPO de visualización (formas de partícula, alambre, rastro)"
    ],
    "time_min": {
      "argon": 5,
      "flash": 7
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "Gana Argon en calidad y tiempo, mas personalizacion, cambio de particulas, animaciones, efectos, etc.",
    "kevin_note_verbatim_en": "Argon wins on quality and time, more customization, changing particles, animations, effects, etc.",
    "kevin_note_paraphrase_es": "Argon gana en calidad y en tiempo: más opciones de personalización, cambio de forma de las partículas, más animaciones y efectos.",
    "kevin_note_en": "Argon wins in both quality and speed (5m vs 7m): real 24,500-particle physics, richer customization, and genuine HUD telemetry.",
    "argon_features": [
      "24,500 partículas por defecto (22,000 en la hélice + 2,500 esporas ambientales); slider de densidad de 10,000 a 40,000",
      "4 morfologías de partícula en shader GLSL: esfera 3D, hexágono, cruz de plasma y anillo",
      "Física por partícula: repulsión del cursor y retorno Hooke F = -k x - c v",
      "Sonda de fuerza 3D, botón de onda de choque, centrar cámara",
      "Modos: alambre de bases [B], rastro [T], aberración RGB [C], rejilla digital [G]; slider de bloom",
      "Secuenciador genómico en vivo (5' a 3') y contadores de telemetría actualizados en tiempo real"
    ],
    "argon_features_en": [
      "24,500 particles by default (22,000 in the helix + 2,500 ambient spores); density slider from 10,000 to 40,000",
      "4 particle morphologies in a GLSL shader: 3D sphere, hexagon, plasma cross and ring",
      "Per-particle physics: cursor repulsion and Hooke return F = -k x - c v",
      "3D force probe, shockwave button, center camera",
      "Modes: base-pair wireframe [B], trail [T], RGB aberration [C], digital grid [G]; bloom slider",
      "Live genome sequencer (5' to 3') and telemetry counters updated in real time"
    ],
    "flash_features": [
      "Doble hélice con física Hooke, bloom, aberración cromática, enlaces moleculares, rejilla holográfica",
      "Audio sintetizado interactivo (Web Audio) y botón de dispersión cuántica",
      "Presets de cámara: vista completa, macro nucleótidos, cenital"
    ],
    "flash_features_en": [
      "Double helix with Hooke physics, bloom, chromatic aberration, molecular bonds, holographic grid",
      "Interactive synthesized audio (Web Audio) and a quantum dispersion button",
      "Camera presets: full view, nucleotide macro, top-down"
    ],
    "flash_problems": [
      "No tiene slider de densidad de partículas (lo pedía el prompt): el número es una constante",
      "No tiene selector de forma de partícula (lo pedía el prompt)",
      "El HUD dice 18,480 partículas pero ese texto está fijo en el HTML: el código genera 14,640 en la hélice (+3,200 de polvo = 17,840)"
    ],
    "flash_problems_en": [
      "No particle density slider (the prompt asked for one): the number is a constant",
      "No particle shape selector (the prompt asked for one)",
      "The HUD says 18,480 particles but that text is fixed in the HTML: the code generates 14,640 in the helix (+3,200 dust particles = 17,840)"
    ],
    "code_stats": {
      "argon_lines": 1754,
      "flash_lines": 1801,
      "argon_kb": 62.3,
      "flash_kb": 57.9,
      "argon_bytes": 63842,
      "flash_bytes": 59305
    },
    "page_titles": {
      "argon": "HELIX-9 // Visualizador Cuántico de ADN 3D [Simulación Física de Partículas]",
      "flash": "GENOM-X // Visualizador 3D de ADN Cyberpunk"
    },
    "fun_angle_es": "Flash presume 18,480 partículas en su panel... pero ese número está escrito a mano en su HTML (líneas 748 y 753, #live-particles-val y #part-count) y nunca se actualiza; en su código hay 17,840 (14,640 en la hélice + 3,200 de polvo). Argon pone 24,500 por defecto y su contador sí es real.",
    "fun_angle_en": "Flash's HUD boasts 18,480 particles... but that number is typed by hand into its HTML (lines 748 and 753, #live-particles-val and #part-count) and never updates; its code has 17,840 (14,640 in the helix + 3,200 dust particles). Argon defaults to 24,500 and its counter is real.",
    "speed_ratio": "Argon 1.4x más rápido (2 min menos)",
    "speed_ratio_en": "Argon 1.4x faster (2 min less)",
    "faster_model": "argon",
    "observed_in_recording": {
      "argon": "24,500 particulas; 104-120 FPS durante la interaccion (8 frames muestreados 60-114 s)"
    },
    "demo_urls": {
      "argon": "/demos/argon/visualizador-adn/index.html",
      "flash": "/demos/flash/visualizador-adn/index.html"
    },
    "stills": {
      "argon": [
        "/stills/visualizador_adn_50.0s_argon.jpg",
        "/stills/visualizador_adn_58.0s_argon.jpg",
        "/stills/visualizador_adn_88.0s_argon.jpg"
      ],
      "flash": [
        "/stills/visualizador_adn_25.0s_flash.jpg",
        "/stills/visualizador_adn_39.5s_flash.jpg",
        "/stills/visualizador_adn_5.0s_flash.jpg"
      ]
    }
  },
  {
    "n": 3,
    "slug": "vida_artificial",
    "dir": "vida-artificial",
    "world_es": "Mundo 2 · Generacion Procedural y Fisica",
    "world_en": "World 2 · Procedural Generation & Physics",
    "category_es": "Generación Procedural y Física (Canvas 2D)",
    "category_en": "World 2 · Procedural Generation & Physics",
    "name_es": "Vida Artificial (Boids)",
    "name_en": "Artificial Life (Reynolds Boids)",
    "tech": "Canvas 2D + boids de Reynolds + Quadtree",
    "tech_en": "Canvas 2D + Reynolds boids + Quadtree",
    "timestamp": "02:36",
    "prompt_gist_es": "Una parvada de cientos de pajaritos que vuelan juntos siguiendo tres reglas simples: no chocar, ir en la misma dirección y mantenerse unidos. El mouse es un depredador que los asusta.",
    "prompt_gist_en": "Craig Reynolds flocking simulation (separation, alignment, cohesion) with Quadtree spatial partitioning, apex predator evasion, and live vector/grid debugging.",
    "prompt_verbatim": "Actúa como un Ingeniero de Simulaciones Físicas y Desarrollador Creativo Senior. Tu objetivo es construir una **Simulación de Vida Artificial y Comportamiento Emergente (\"Boids\" de Craig Reynolds)** masiva, ultrarrápida y visualmente hipnótica, ejecutada en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** Tienes libertad para elegir el entorno que logre el mejor equilibrio entre rendimiento masivo (60 FPS estables con cientos o miles de agentes) y espectacularidad visual (por ejemplo, un archivo único HTML5 con **Canvas 2D avanzado / WebGL**, o una aplicación en **Python con Pygame/ModernGL**).\n* **Libertad Creativa (Cero Sobriedad):** No te limites a dibujar triángulos blancos sobre un fondo negro plano. Diseña una experiencia estética de alto impacto: estelas de movimiento dinámicas (*motion trails* con *alpha blending*), bioluminiscencia reactiva donde el color de cada agente cambie según su velocidad, ángulo de dirección o densidad de su parvada local, ondas de choque visuales y un HUD de telemetría científica en tiempo real.\n* **Cero Dependencias Externas Rotas:** Todo el motor vectorial, particionamiento espacial, gráficos e interfaz deben ser 100% autocontenidos y generados por código.\n\n---\n\n### 2. Requerimientos Matemáticos y Algorítmicos (El Núcleo del Reto)\nDebes programar desde cero un motor de física vectorial autónomo basado en fuerzas de dirección (*Steering Behaviors* de Reynolds):\n\n1. **Cinemática Vectorial por Agente:**\n   * Cada *Boid* debe poseer vectores de Posición ($\\vec{p}$), Velocidad ($\\vec{v}$) y Aceleración ($\\vec{a}$), además de límites escalares estrictos para su velocidad máxima (`maxSpeed`) y fuerza máxima de giro (`maxForce`).\n   * Toda fuerza de dirección debe calcularse mediante la fórmula clásica de Reynolds:\n     $$\\vec{F}_{\\text{steer}} = \\text{limit}(\\vec{v}_{\\text{desired}} - \\vec{v}_{\\text{actual}}, \\text{maxForce})$$\n   * El triángulo o geometría de cada agente debe rotar suavemente alineándose con el ángulo de su vector velocidad ($\\theta = \\text{atan2}(v_y, v_x)$).\n\n2. **Las 3 Leyes Clásicas de Flocking:**\n   * **Separación (Repulsión a corto alcance):** Detectar vecinos dentro de un radio personal $r_s$ y calcular un vector de alejamiento inversamente proporcional a la distancia ($\\propto 1/d$ o $1/d^2$) para evitar colisiones superpuestas.\n   * **Alineación (Sincronización cinemática):** Calcular la velocidad promedio de los vecinos dentro del radio de percepción $r_a$ y aplicar una fuerza de giro para igualar su rumbo y velocidad.\n   * **Cohesión (Atracción al centro de masa):** Calcular el centroide (posición promedio) de los vecinos cercanos dentro de $r_c$ y generar una fuerza de búsqueda (*seek*) hacia ese punto.\n\n3. **Interacción con el Depredador (El Mouse + Amenazas):**\n   * El cursor del mouse actúa como un **Depredador Ápex**. Cuando los *Boids* entran en el radio de pánico del cursor, deben activar una fuerza de evasión/huida intensa ($\\vec{F}_{\\text{flee}}$) que supere a las reglas normales, aumentando temporalmente su `maxSpeed` (efecto adrenalina) y alterando su color para reflejar el estado de alerta.\n   * Permite que al hacer clic izquierdo se genere una onda expansiva de repulsión o se coloquen obstáculos físicos que la parvada deba esquivar dinámicamente, y añade la opción de soltar 1 o 2 \"Depredadores IA autónomos\" que persigan activamente el centro de densidad de las parvadas.\n\n4. **Optimización Espacial Obligatoria (Prohibido $O(N^2)$ puro):**\n   * Para soportar entre 600 y 2,000+ agentes sin caídas de FPS, implementa una estructura de particionamiento espacial (**Quadtree** o **Spatial Hash Grid**) para consultar únicamente los vecinos de las celdas adyacentes en lugar de comparar cada agente contra todos los demás.\n\n---\n\n### 3. Requerimientos Visuales, Telemetría y Controles (HUD)\n1. **Visualización de Depuración Científica (Toggles en vivo):**\n   * Incluye interruptores interactivos en pantalla para renderizar en tiempo real:\n     * **La estructura del Quadtree o Spatial Grid** (ver cómo se subdividen las cajas dinámicamente donde hay mayor concentración de agentes).\n     * **Vectores de fuerza y radios de percepción** (mostrar flechas de velocidad/fuerza y círculos de visión sobre una muestra de agentes).\n     * **Modo Estelas (Trails) / Modo Nítido:** Control del desvanecimiento del lienzo para crear patrones fluidos orgánicos.\n2. **Panel de Control en Tiempo Real:**\n   * Controles deslizantes (*sliders*) para modificar en caliente los multiplicadores de peso de **Separación**, **Alineación**, **Cohesión**, **Fuerza del Depredador**, **Radio de Percepción**, **Velocidad Máxima** y **Cantidad de Boids**.\n   * Botones de *Presets* de comportamiento (ej. \"Enjambre Caótico de Insectos\", \"Cardumen de Peces Compacto\", \"Bandada de Estorninos / Murmuration\").\n   * Contador de FPS en tiempo real, número de agentes activos y conteo de chequeos de vecindad por fotograma.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto del código`) o dejar métodos matemáticos sin implementar.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"vida-artificial\"",
    "key_requirements": [
      "Separación, alineación y cohesión con fuerza de dirección limitada (maxForce, maxSpeed)",
      "Cursor depredador con huida y 'adrenalina'; clic para onda expansiva u obstáculos; 1 o 2 depredadores IA",
      "Prohibido O(N²) puro: Quadtree o Spatial Hash para 600 a 2,000+ agentes",
      "Toggles de depuración (quadtree, vectores, estelas), sliders de pesos y presets, contador de FPS y chequeos de vecindad"
    ],
    "time_min": {
      "argon": 5,
      "flash": 3
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "Los resultados fueron muy parecidos, en cuanto a funcionalidad, ambos cumplen, pero la personalizacion y keymaps de Argon le da la victoria",
    "kevin_note_verbatim_en": "The results were very similar, in terms of functionality, both deliver, but Argon's customization and keymaps give it the win",
    "kevin_note_paraphrase_es": "Muy parejos: los dos cumplen en funcionalidad. Lo que le da la victoria a Argon es la personalización y los atajos de teclado.",
    "kevin_note_en": "Very close functional tie, but Argon takes the point for its 11 live sliders, 3 autonomous predators, and complete debugging keymaps.",
    "argon_features": [
      "Quadtree real con telemetría de chequeos por frame vs equivalente O(N²)",
      "De 0 a 3 depredadores IA autónomos ('Leviatanes') ciclables con [P]",
      "Clic: onda de choque; Shift+clic: obstáculo; clic derecho: borrar obstáculo",
      "Atajos Q (quadtree), V (vectores), T (estelas), N (red local), P (depredadores), Espacio (pausa)",
      "11 sliders en vivo, incluida cantidad de agentes de 200 a 2,400",
      "4 presets: estorninos, cardumen, enjambre caótico, vórtice abisal"
    ],
    "argon_features_en": [
      "Real Quadtree with checks-per-frame telemetry vs the O(N²) equivalent",
      "0 to 3 autonomous AI predators ('Leviathans'), cycled with [P]",
      "Click: shockwave; Shift+click: obstacle; right-click: delete obstacle",
      "Shortcuts Q (quadtree), V (vectors), T (trails), N (local network), P (predators), Space (pause)",
      "11 live sliders, including agent count from 200 to 2,400",
      "4 presets: starlings, fish school, chaotic swarm, abyssal vortex"
    ],
    "flash_features": [
      "Quadtree recursivo con contador de ahorro de cálculo",
      "Depredador IA activable, espacio toroidal, audio bioacústico sintetizado",
      "4 presets (teclas 1-4), botones +200 / -200 boids, modos de clic: onda, obstáculo, sembrar boids"
    ],
    "flash_features_en": [
      "Recursive Quadtree with a computation-savings counter",
      "Toggleable AI predator, toroidal space, synthesized bioacoustic audio",
      "4 presets (keys 1-4), +200 / -200 boids buttons, click modes: wave, obstacle, seed boids"
    ],
    "flash_problems": [
      "Funcional; menos controles (7 sliders, un solo depredador IA) y menos atajos que Argon",
      "Carga Google Fonts desde internet aunque el prompt pedía interfaz 100% autocontenida"
    ],
    "flash_problems_en": [
      "Functional; fewer controls (7 sliders, a single AI predator) and fewer shortcuts than Argon",
      "Loads Google Fonts from the internet although the prompt asked for a 100% self-contained interface"
    ],
    "code_stats": {
      "argon_lines": 1771,
      "flash_lines": 2011,
      "argon_kb": 60.5,
      "flash_kb": 64.1,
      "argon_bytes": 62001,
      "flash_bytes": 65643
    },
    "page_titles": {
      "argon": "AETHER-FLOCK // Simulación de Vida Artificial y Comportamiento Emergente [Reynolds Boids + Quadtree]",
      "flash": "A-LIFE LAB // Motor de Vida Artificial y Boids de Reynolds"
    },
    "fun_angle_es": "Flash terminó en 3 minutos y hasta le puso sonido. Argon tardó 5, pero soltó hasta tres 'leviatanes' depredadores con inteligencia propia y un atajo de teclado para cada capa de depuración.",
    "fun_angle_en": "Flash finished in 3 minutes and added bioacoustic synth audio. Argon took 5 minutes and unleashed up to 3 autonomous AI leviathan predators plus full keyboard telemetry toggles.",
    "speed_ratio": "Flash 1.67x más rápido (2 min menos)",
    "speed_ratio_en": "Flash 1.67x faster (2 min less)",
    "faster_model": "flash",
    "observed_in_recording": {
      "argon": "2,400 boids: 116 FPS, reduccion quadtree 96.8%, 181,527 chequeos/frame (t=146.5 s)",
      "flash": "2,000 boids: 120.0 FPS (8.3 ms) (t=48.8 s)"
    },
    "demo_urls": {
      "argon": "/demos/argon/vida-artificial/index.html",
      "flash": "/demos/flash/vida-artificial/index.html"
    },
    "stills": {
      "argon": [
        "/stills/vida_artificial_104.5s_argon.jpg",
        "/stills/vida_artificial_131.0s_argon.jpg",
        "/stills/vida_artificial_177.0s_argon.jpg"
      ],
      "flash": [
        "/stills/vida_artificial_16.3s_flash.jpg",
        "/stills/vida_artificial_44.0s_flash.jpg",
        "/stills/vida_artificial_53.0s_flash.jpg"
      ]
    }
  },
  {
    "n": 4,
    "slug": "generador_mazmorras",
    "dir": "generador-mazmorras",
    "world_es": "Mundo 2 · Generacion Procedural y Fisica",
    "world_en": "World 2 · Procedural Generation & Physics",
    "category_es": "Generación Procedural y Física (Canvas 2D)",
    "category_en": "World 2 · Procedural Generation & Physics",
    "name_es": "Generador de Mazmorras",
    "name_en": "Procedural Rogue-like Dungeon",
    "tech": "Canvas 2D + BSP + MST (Kruskal) + A* + Dijkstra + FOV por raycasting",
    "tech_en": "Canvas 2D + BSP + MST (Kruskal) + A* + Dijkstra + FOV via raycasting",
    "timestamp": "03:17",
    "prompt_gist_es": "Un generador de mazmorras estilo videojuego roguelike: cuartos que nunca se encimen, conectados por pasillos de una sola casilla, con una ruta calculada de la entrada a la salida y un modo para explorarla con niebla de guerra.",
    "prompt_gist_en": "Procedural roguelike dungeon generator using Binary Space Partitioning (BSP), Kruskal MST connectivity, 1-tile corridors, A* pathfinding, and playable FOV fog of war.",
    "prompt_verbatim": "Actúa como un Arquitecto de Generación Procedural (PCG) y Desarrollador Senior de Motores de Videojuegos. Tu objetivo es construir un **Generador y Explorador Interactivo de Mazmorras Procedurales (Estilo Rogue-like)** visualmente rico, matemáticamente riguroso y con herramientas de visualización algorítmica en tiempo real, que se ejecutará en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** Tienes libertad para usar el entorno que te permita lograr la mejor combinación de rendimiento, control de píxeles/tiles y acabado visual (por ejemplo, un archivo único HTML5 con **Canvas 2D avanzado**, o una aplicación local en **Python con Pygame**).\n* **Libertad Creativa (Cero Sobriedad):** No entregues una simple cuadrícula estática en blanco y negro. Diseña una interfaz digna de una herramienta de desarrollo de videojuegos indie o un *Dungeon Crawler* retro-moderno: texturizado procedural de baldosas (*autotiling* para muros, grietas en el suelo, antorchas animadas), iluminación dinámica 2D (antorchas con parpadeo y *Fog of War* / Campo de Visión), biomas temáticos (cripta oscura, caverna volcánica, laboratorio arcano) y un HUD de telemetría completo.\n* **Cero Dependencias Externas Rotas:** **PROHIBIDO** cargar hojas de sprites (*spritesheets*) o imágenes desde URLs externas. Todos los gráficos, texturas de muros/pisos, iconos de entidades y efectos de luz deben dibujarse **100% de forma procedural mediante código**.\n\n---\n\n### 2. Requerimientos Algorítmicos y Matemáticos (El Núcleo del Reto)\nEl motor de generación debe cumplir estrictamente con las siguientes reglas topológicas y geométricas:\n\n1. **Generación de Habitaciones Sin Superposición (Cero Colisiones):**\n   * Implementa un algoritmo sólido como **Partición Binaria del Espacio (BSP Tree)** o **Generación por Rechazo/Separación Física con AABB (Axis-Aligned Bounding Boxes)** incluyendo un margen de seguridad (*padding*) mínimo de al menos 1 a 2 celdas de muro entre cualquier par de habitaciones para que jamás se fusionen ni se encimen por error.\n   * Las habitaciones deben ser rectangulares con dimensiones variables controladas por parámetros (`minRoomSize`, `maxRoomSize`).\n\n2. **Conexión Lógica por Pasillos de 1 Unidad de Ancho:**\n   * Todas las habitaciones deben estar conectadas mediante pasillos ortogonales (en forma de L o trazados mediante búsqueda de caminos en cuadrícula) de **exactamente 1 celda/píxel lógico de ancho**.\n   * **Garantía de Conectividad Total (Grafo Conexo):** Queda estrictamente prohibido que existan habitaciones aisladas o inalcanzables. Utiliza la jerarquía de ramas del árbol BSP o un **Árbol de Expansión Mínima (Algoritmo de Prim / Kruskal)** sobre los centroides de las habitaciones (opcionalmente reintroduciendo un porcentaje configurable de ciclos/atajos para que la mazmorra no sea puramente lineal).\n   * Coloca puertas lógicas en las intersecciones exactas donde un pasillo de 1 celda de ancho desemboca en una habitación.\n\n3. **Población Procedural y Verificación con Pathfinding (A*):**\n   * Designa algorítmicamente una **Habitación de Inicio (Entrada/Escaleras arriba)** y la habitación más lejana en el grafo como **Habitación del Jefe / Salida (Escaleras abajo)**, además de distribuir cofres, trampas o enemigos según heurísticas de distancia.\n   * Implementa el algoritmo **A* (A-Estrella)** o **Mapa de Dijkstra** para trazar y visualizar en pantalla la ruta crítica óptima desde la entrada hasta la salida (o entre cualquier par de celdas que el usuario seleccione con el mouse), demostrando matemáticamente que la mazmorra es 100% resoluble.\n\n---\n\n### 3. Requerimientos Visuales, Modos Interactivos y Controles (HUD)\n1. **Visualización Algorítmica Paso a Paso vs. Instantánea:**\n   * Incluye un modo **\"Ver Construcción Paso a Paso\"** animado donde se observe en vivo cómo el algoritmo divide el espacio (líneas de partición del árbol BSP o cajas de colisión), talla las habitaciones, calcula el grafo de conectividad (líneas entre centros) y excava los pasillos celda por celda.\n   * Incluye un botón de **\"Generación Instantánea\"** con soporte para **Semilla Alfanumérica (Seed / PRNG propio)** para poder recrear exactamente la misma mazmorra cuando se desee.\n\n2. **Capas de Renderizado y Modo Exploración:**\n   * Permite alternar entre **Vista de Arquitecto (Mapa Completo + Capas de Debug)** y **Modo Explorador Jugable**, donde puedas mover a un aventurero con el teclado (`WASD` / Flechas) a través de la mazmorra con **Cálculo de Campo de Visión (2D Raycasting / Shadowcasting)** y *Fog of War* (niebla de guerra que revela solo lo que tienes en línea de visión y deja en penumbra lo ya visitado).\n   * Interruptores (*Toggles*) para mostrar/ocultar: Particiones BSP, Grafo de nodos/conexiones, Mapa de calor de distancias (Dijkstra Distance Map) y Ruta A*.\n\n3. **Panel de Control y Telemetría:**\n   * Controles deslizantes (*sliders*) para ajustar en caliente: Tamaño de la cuadrícula del mapa, Profundidad de partición / Cantidad de habitaciones, Tamaño mínimo y máximo de habitaciones, Porcentaje de pasillos extra (ciclos) y Velocidad de animación de construcción.\n   * Métricas en pantalla: Semilla actual, Número de habitaciones generadas, Longitud del camino crítico (Entrada $\\rightarrow$ Salida), Porcentaje de área excavada y Tiempo de cómputo en milisegundos.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto del código`) o dejar algoritmos como el BSP o el A* incompletos.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"generador-mazmorras\"",
    "key_requirements": [
      "Habitaciones sin superposición (BSP o AABB con margen)",
      "Pasillos de exactamente 1 celda y grafo 100% conexo (ramas BSP o MST Prim/Kruskal) con ciclos opcionales",
      "Inicio, jefe/salida, cofres, trampas, enemigos; ruta A* o Dijkstra visible",
      "Construcción paso a paso animada, semilla alfanumérica, modo explorador con WASD, FOV y fog of war",
      "Sliders: tamaño de mapa, profundidad, tamaños de cuarto, % ciclos, velocidad de animación; métricas en pantalla"
    ],
    "time_min": {
      "argon": 12,
      "flash": 2
    },
    "winner": "argon",
    "flash_broken": true,
    "kevin_note_verbatim": "Indiscutiblemente mejor Argon, por alguna razón Flash solo trabajo por dos minutos y decidio que habia terminado, tiene varios bugs y no interactua con el entorno, en cambio, Argon dejo algo completamente funcional y que se actualiza visualmente en tiempo real, interaccion con entorno, logs, A* en vivo, etc.",
    "kevin_note_verbatim_en": "Argon is indisputably better, for some reason Flash only worked for two minutes and decided it was done, it has several bugs and doesn't interact with the environment, whereas Argon left something fully functional that updates visually in real time, interaction with the environment, logs, live A*, etc.",
    "kevin_note_paraphrase_es": "Indiscutiblemente mejor Argon. Flash trabajó solo dos minutos, decidió que ya había terminado y entregó algo con varios bugs y sin interacción con el entorno. Argon dejó algo completo que se actualiza en tiempo real, con interacción, bitácora y A* en vivo.",
    "kevin_note_en": "Undisputed win for Argon. Flash quit after 2 minutes with multiple bugs and zero entity interaction; Argon delivered a full interactive RPG + live A*.",
    "argon_features": [
      "BSP sin colisiones con padding AABB, MST con Kruskal + porcentaje de ciclos extra, puertas lógicas 1x1",
      "A* personalizado con clic (inicio) y Shift+clic (destino); mapa de calor Dijkstra",
      "Modo Explorador [E]: fog of war con FOV por raycasting (radio ajustable)",
      "Mini RPG: HP 100/100, cofres, centinelas/enemigos, trampas, jefe; bitácora de eventos en vivo",
      "Biomas Cripta, Volcán y Arcano; semilla PRNG (ej. ARGON-CRYPT-77); construcción paso a paso",
      "7 sliders incluido tamaño de cuadrícula (72 x 46 por defecto) y velocidad de animación"
    ],
    "argon_features_en": [
      "Collision-free BSP with AABB padding, MST with Kruskal + a percentage of extra loops, 1x1 logical doors",
      "Custom A* with click (start) and Shift+click (destination); Dijkstra heat map",
      "Explorer Mode [E]: fog of war with FOV via raycasting (adjustable radius)",
      "Mini RPG: HP 100/100, chests, sentinels/enemies, traps, boss; live event log",
      "Crypt, Volcano and Arcane biomes; PRNG seed (e.g. ARGON-CRYPT-77); step-by-step construction",
      "7 sliders including grid size (72 x 46 by default) and animation speed"
    ],
    "flash_features": [
      "BSP con conexión por ramas hermanas + ciclos extra, A*, mapa Dijkstra, paso a paso",
      "Biomas Cripta, Volcán, Arcano; modo explorador con FOV y niebla; cofres que se abren"
    ],
    "flash_features_en": [
      "BSP connected through sibling branches + extra loops, A*, Dijkstra map, step by step",
      "Crypt, Volcano, Arcane biomes; explorer mode with FOV and fog; chests that open"
    ],
    "flash_problems": [
      "Se declaró terminado a los 2 minutos (nota de Kevin)",
      "Varios bugs y sin interacción con el entorno (nota de Kevin): sin enemigos, sin trampas activas, sin HP",
      "No tiene slider de tamaño de mapa (lo pedía el prompt)",
      "Su título dice 'Árbol de Expansión Mínima' pero el código no implementa MST: conecta hermanos del árbol BSP (válido según el prompt, pero la etiqueta es falsa)",
      "Observado en la grabación: durante 'paso a paso' la ruta A* del mapa anterior se dibuja sobre un mapa todavía sin construir, y en modo explorador las antorchas de cuartos no descubiertos brillan a través de la niebla"
    ],
    "flash_problems_en": [
      "Declared itself finished after 2 minutes (Kevin's note)",
      "Several bugs and no interaction with the environment (Kevin's note): no enemies, no active traps, no HP",
      "No map-size slider (the prompt asked for one)",
      "Its title says 'Árbol de Expansión Mínima' (Minimum Spanning Tree) but the code does not implement an MST: it connects siblings of the BSP tree (valid under the prompt, but the label is false)",
      "Observed in the recording: during 'step by step' the A* route from the previous map is drawn over a map that is not built yet, and in explorer mode the torches of undiscovered rooms glow through the fog"
    ],
    "code_stats": {
      "argon_lines": 1914,
      "flash_lines": 2143,
      "argon_kb": 84.4,
      "flash_kb": 70.7,
      "argon_bytes": 86439,
      "flash_bytes": 72429
    },
    "page_titles": {
      "argon": "CRYPT-ARCHITECT // Generador y Explorador de Mazmorras Procedurales [BSP + MST + A* + FOV]",
      "flash": "ARCHITECT-PCG // Generador y Explorador de Mazmorras Rogue-like"
    },
    "fun_angle_es": "Flash trabajó dos minutos y se dio por terminado. Argon se tomó doce, su prueba más larga, y entregó un mini RPG: vida, cofres, centinelas, trampas y una bitácora de todo lo que pasa.",
    "fun_angle_en": "Flash stopped working after 2 minutes and delivered a dungeon with no enemies, no HP, and torches glowing through undiscovered fog of war. Argon spent 12 minutes building a complete playable mini-RPG with live event logs.",
    "speed_ratio": "Flash 6x más rápido (10 min menos)",
    "speed_ratio_en": "Flash 6x faster (10 min less)",
    "faster_model": "flash",
    "observed_in_recording": {
      "flash": "119.9-120.1 FPS en su HUD",
      "argon": "modo explorador con 2/8 cofres, bitacora de cofres y puertas"
    },
    "demo_urls": {
      "argon": "/demos/argon/generador-mazmorras/index.html",
      "flash": "/demos/flash/generador-mazmorras/index.html"
    },
    "stills": {
      "argon": [
        "/stills/generador_mazmorras_137.0s_argon.jpg",
        "/stills/generador_mazmorras_70.0s_argon.jpg",
        "/stills/generador_mazmorras_81.5s_argon.jpg"
      ],
      "flash": [
        "/stills/generador_mazmorras_29.2s_flash.jpg",
        "/stills/generador_mazmorras_44.0s_flash.jpg",
        "/stills/generador_mazmorras_5.0s_flash.jpg"
      ]
    }
  },
  {
    "n": 5,
    "slug": "falling_sand",
    "dir": "falling-sand",
    "world_es": "Mundo 2 · Generacion Procedural y Fisica",
    "world_en": "World 2 · Procedural Generation & Physics",
    "category_es": "Generación Procedural y Física (Canvas 2D)",
    "category_en": "World 2 · Procedural Generation & Physics",
    "name_es": "Simulador Falling Sand",
    "name_en": "Falling Sand Cellular Automata",
    "tech": "Canvas 2D + buffer Uint32 / ImageData + autómatas celulares",
    "tech_en": "Canvas 2D + Uint32 buffer / ImageData + cellular automata",
    "timestamp": "04:04",
    "prompt_gist_es": "Un arenero de píxeles donde dibujas con el mouse: la arena cae y forma pirámides, el agua se esparce y la piedra se queda quieta, además de fuego, lava, ácido y otras reacciones químicas.",
    "prompt_gist_en": "Noita-style pixel physics sandbox manipulating Uint32Array buffers with alternating horizontal sweeps, density displacement, and emergent chemical reactions.",
    "prompt_verbatim": "Actúa como un Ingeniero de Motores Físicos y Desarrollador Creativo Senior (al estilo de Nolla Games, creadores de *Noita*). Tu objetivo es construir un **Motor de Simulación Física de Autómatas Celulares (\"Falling Sand\" / Píxeles Físicos)** ultrarrápido, con reacciones químicas emergentes y un acabado visual vibrante, que se ejecutará en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** Elige el entorno que te permita manipular buffers de píxeles directamente en memoria a 60 FPS estables con decenas de miles de partículas activas (por ejemplo, un archivo único HTML5 manipulando directamente `ImageData` / `Uint32Array` en **Canvas 2D / WebGL**, o una aplicación local en **Python con Pygame / ModernGL**).\n* **Libertad Creativa (Cero Sobriedad):** Prohibido usar colores planos y aburridos tipo MS Paint.Cada grano de arena, gota de agua o bloque de roca debe tener **variación cromática procedural (dithering / ruido de textura por píxel)** para darle textura orgánica. Añade efectos visuales avanzados como resplandor térmico (*glow/bloom*) para elementos incandescentes, chispas, humo ascendente y un HUD de laboratorio físico en tiempo real.\n* **Cero Dependencias Externas:** Todo el motor de autómatas celulares, renderizador por buffer e interfaz debe ser 100% autocontenido en el código.\n\n---\n\n### 2. Requerimientos Físicos y Algorítmicos (El Núcleo del Reto)\nDebes implementar una cuadrícula física de alta densidad donde cada píxel es un autómata celular con propiedades de **estado, densidad ($\\rho$), inflamabilidad, color base y un flag de actualización por frame (`updated`)**:\n\n1. **Los 3 Elementos Fundamentales (Obligatorios):**\n   * **Arena (Sólido Granular - $\\rho = 3$):** Cae verticalmente por gravedad ($y+1$). Si está bloqueada abajo, se desliza diagonalmente hacia abajo-izquierda ($x-1, y+1$) o abajo-derecha ($x+1, y+1$) formando pirámides naturales perfectas. **Interacción de densidad:** Si cae sobre Agua o Aceite, debe hundirse desplazando el líquido hacia arriba (intercambio de celdas).\n   * **Agua (Líquido - $\\rho = 2$):** Cae verticalmente y en diagonal inferior; si no puede bajar, se esparce horizontalmente ($x \\pm v_{\\text{disp}}$) con una tasa de dispersión horizontal de varios píxeles por frame para nivelarse rápidamente como un fluido real y no quedarse estancada en escalones irreales.\n   * **Piedra (Sólido Estático - $\\rho = \\infty$):** Inmune a la gravedad, actúa como contenedor, suelo o estructura arquitectónica. Aplica un patrón sutil de ruido en escala de grises al dibujarla para que parezca roca tallada.\n\n2. **Química Emergente Estilo *Noita* (Elementos Extra para Libre Albedrío):**\n   * Incorpora al menos **4 elementos reactivos adicionales** en la paleta para demostrar interacciones complejas:\n     * **Fuego / Brasas:** Asciende erráticamente, tiene un tiempo de vida (`lifetime`), ilumina su entorno, quema materiales inflamables y se apaga al contacto con el agua generando **Vapor**.\n     * **Vapor / Humo (Gas - $\\rho = -1$):** Flota hacia arriba, atraviesa líquidos hacia la superficie y se condensa o disipa con el tiempo.\n     * **Madera / Planta (Sólido Inflamable)** y **Aceite (Líquido Inflamable - $\\rho = 1$):** El aceite debe flotar siempre por encima del agua y arder violentamente en contacto con el fuego.\n     * **Ácido o Lava:** El ácido corroe la piedra y la arena emitiendo vapores tóxicos; la lava funde materiales y al tocar el agua se solidifica en **Piedra/Obsidiana** liberando vapor.\n\n3. **Rigor en el Bucle de Simulación (Sin Sesgos Direccionales):**\n   * Recorre la matriz de abajo hacia arriba para la gravedad, pero **alterna o aleatoriza el orden de barrido horizontal (izquierda-derecha vs. derecha-izquierda)** en cada fotograma o fila. Esto es crítico para evitar el clásico \"sesgo de barrido\" donde el agua o la arena tienden a fluir siempre hacia la izquierda.\n   * Implementa control de estado por fotograma (*clock bit* o *updated flag*) para que una partícula no sea procesada ni teletransportada múltiples veces en un mismo *tick*.\n\n---\n\n### 3. Requerimientos de Interfaz, Herramientas y Telemetría (HUD)\n1. **Herramientas de Manipulación Física:**\n   * **Pincel Dinámico:** Rueda del mouse o *slider* para cambiar el radio del pincel (desde 1 píxel de precisión hasta brocha masiva), con opción de rocío disperso (*spray*) para polvos/líquidos y trazo continuo interpolado (algoritmo de línea de *Bresenham* entre la posición anterior y actual del mouse) para que al mover el cursor rápido los muros de piedra no queden con huecos.\n   * **Herramientas Especiales:** Borrador (Vacío), \"Bomba/Explosión\" de onda expansiva que lance los píxeles por los aires con velocidad física, y un Grifo/Emisor continuo (*Spawner*).\n2. **Controles de Simulación y Telemetría:**\n   * Selector visual de elementos con código de colores e indicador de su categoría (Sólido, Polvo, Líquido, Gas, Energía).\n   * Controles de Pausa, Avanzar 1 Frame (*Step*), Limpiar Lienzo, Invertir Gravedad y generar un \"Escenario de Prueba / Terrario\" preconstruido con un clic.\n   * Telemetría en vivo: FPS, resolución de la cuadrícula lógica, conteo total de píxeles activos desglosado por tipo de materia y tiempo de cómputo del *tick* físico en milisegundos.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto de elementos`) o dejar las reglas de colisión/densidad incompletas.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"falling-sand\"",
    "key_requirements": [
      "Arena, agua y piedra con densidades e intercambio (la arena se hunde en el agua)",
      "Al menos 4 elementos reactivos extra: fuego, vapor/humo, madera/aceite, ácido o lava",
      "Barrido horizontal alternado sin sesgo + bandera 'updated' por tick",
      "Pincel con radio, spray y trazo Bresenham; borrador, bomba, grifo; pausa, paso, invertir gravedad, terrario; telemetría"
    ],
    "time_min": {
      "argon": 4,
      "flash": 9
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "Aqui a pesar de que Argon tardo menos de la mitad que Flash, le dio dos vueltas, la interaccion y la complegidad del entendimiento del como interactuan las cosas en el entorno entre si, es 10 veces mejor en el resultado de Argon que en el de Flash",
    "kevin_note_verbatim_en": "Here, even though Argon took less than half the time Flash did, it ran circles around it, the interaction and the complexity of understanding how things in the environment interact with each other is 10 times better in Argon's result than in Flash's",
    "kevin_note_paraphrase_es": "Argon tardó menos de la mitad que Flash y aun así le dio dos vueltas: su forma de entender cómo interactúan los materiales entre sí es, según Kevin, diez veces mejor.",
    "kevin_note_en": "Argon took less than half the time (4m vs 9m) and delivered emergent material chemistry an order of magnitude richer than Flash.",
    "argon_features": [
      "Paleta de 12 elementos (arena, agua, piedra, madera, aceite, fuego, lava, ácido, pólvora, planta, vapor, humo) + obsidiana y brasa internas",
      "Reacciones: lava + agua = obsidiana + vapor; ácido corroe piedra, arena y madera con humo tóxico; planta crece absorbiendo agua; fuego + aceite o pólvora = deflagración",
      "Barrido alternado por fila y frame + clock bit por celda; trazo Bresenham",
      "Herramientas: pincel, borrador, bomba con proyectiles balísticos, grifo emisor; invertir gravedad; terrario Noita [T]",
      "Cuadrícula 340 x 210 (71,400 celdas); censo de materia por elemento en vivo; bloom térmico"
    ],
    "argon_features_en": [
      "12-element palette (sand, water, stone, wood, oil, fire, lava, acid, gunpowder, plant, steam, smoke) + internal obsidian and ember",
      "Reactions: lava + water = obsidian + steam; acid corrodes stone, sand and wood with toxic smoke; plants grow by absorbing water; fire + oil or gunpowder = deflagration",
      "Sweep alternated per row and frame + per-cell clock bit; Bresenham strokes",
      "Tools: brush, eraser, bomb with ballistic projectiles, emitter faucet; invert gravity; Noita terrarium [T]",
      "340 x 210 grid (71,400 cells); live per-element matter census; thermal bloom"
    ],
    "flash_features": [
      "Paleta de 12 elementos (arena, agua, piedra, madera, aceite, ácido, fuego, lava, pólvora, obsidiana, hielo, humo) + vapor y chispa",
      "4 terrarios precargados, herramienta 'rayo térmico', sonido, cuadrícula 400 x 250 (100,000 celdas)",
      "Clock por celda y trazo Bresenham"
    ],
    "flash_features_en": [
      "12-element palette (sand, water, stone, wood, oil, acid, fire, lava, gunpowder, obsidian, ice, smoke) + steam and spark",
      "4 preloaded terrariums, 'rayo térmico' (thermal ray) tool, sound, 400 x 250 grid (100,000 cells)",
      "Per-cell clock and Bresenham strokes"
    ],
    "flash_problems": [
      "Funcional; Kevin lo juzgó muy inferior en la complejidad de las interacciones entre materiales (opinión subjetiva)",
      "Tardó más del doble (9 contra 4 minutos)"
    ],
    "flash_problems_en": [
      "Functional; Kevin judged it far inferior in the complexity of the interactions between materials (subjective opinion)",
      "Took more than twice as long (9 vs 4 minutes)"
    ],
    "code_stats": {
      "argon_lines": 1732,
      "flash_lines": 2004,
      "argon_kb": 71.3,
      "flash_kb": 61.8,
      "argon_bytes": 72969,
      "flash_bytes": 63325
    },
    "page_titles": {
      "argon": "NOITA-CORE // Motor de Autómatas Celulares y Química Emergente [Falling Sand]",
      "flash": "Cellular Automata Physics Engine // Noita-Style Falling Sand"
    },
    "fun_angle_es": "Ojo: los dos tienen 12 elementos, así que no ganó por cantidad. Ganó por química: en Argon las plantas beben agua para crecer, el ácido se come la piedra y la pólvora explota en cadena, y lo hizo en menos de la mitad del tiempo.",
    "fun_angle_en": "Both palettes include 12 elements, so Argon didn't win on count—it won on emergent chemistry: plants drink water to grow, acid corrodes stone with toxic fumes, and gunpowder chain-detonates in less than half the time (4m vs 9m).",
    "speed_ratio": "Argon 2.25x más rápido (5 min menos)",
    "speed_ratio_en": "Argon 2.25x faster (5 min less)",
    "faster_model": "argon",
    "observed_in_recording": {
      "argon": "120 FPS, 340x210, 41,382 pixeles activos",
      "flash": "120.0 FPS, 22,740 particulas"
    },
    "demo_urls": {
      "argon": "/demos/argon/falling-sand/index.html",
      "flash": "/demos/flash/falling-sand/index.html"
    },
    "stills": {
      "argon": [
        "/stills/falling_sand_119.0s_argon.jpg",
        "/stills/falling_sand_186.5s_argon.jpg",
        "/stills/falling_sand_198.5s_argon.jpg"
      ],
      "flash": [
        "/stills/falling_sand_20.0s_flash.jpg",
        "/stills/falling_sand_54.75s_flash.jpg",
        "/stills/falling_sand_81.5s_flash.jpg"
      ]
    }
  },
  {
    "n": 6,
    "slug": "motor_raycasting",
    "dir": "motor-raycasting",
    "world_es": "Mundo 3 · Pixel Art y Retro Computing",
    "world_en": "World 3 · Pixel Art & Retro Computing",
    "category_es": "Pixel Art y Retro Computing",
    "category_en": "World 3 · Pixel Art & Retro Computing",
    "name_es": "Motor 3D Raycasting",
    "name_en": "3D Raycasting Engine (Wolfenstein DDA)",
    "tech": "Canvas 2D puro (cero WebGL) + DDA + Z-buffer 1D",
    "tech_en": "Pure Canvas 2D (zero WebGL) + DDA + 1D Z-buffer",
    "timestamp": "04:50",
    "prompt_gist_es": "Un motor tipo Wolfenstein 3D hecho desde cero solo con dibujo en 2D: lanzar un rayo por cada columna de la pantalla para fingir paredes en tres dimensiones, con texturas, puertas y un minimapa.",
    "prompt_gist_en": "First-person 3D raycasting engine built from scratch in pure 2D Canvas (zero WebGL) with DDA grid traversal, fisheye correction toggle, 64x64 procedural textures, and 1D Z-buffer.",
    "prompt_verbatim": "Actúa como un Ingeniero de Motores Gráficos Retro (al estilo de John Carmack en los inicios de id Software) y Desarrollador Creativo Senior. Tu objetivo es construir desde cero un **Motor 3D en Primera Persona basado en Raycasting (Estilo Wolfenstein 3D)**, utilizando exclusivamente matemáticas trigonométricas y renderizado 2D puro, que se ejecutará en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total (Con Restricción de Motor 3D)\n* **Restricción de Honor del Reto:** Queda **ESTRICTAMENTE PROHIBIDO** utilizar WebGL, Three.js, OpenGL o cualquier librería/API 3D. Toda la ilusión tridimensional debe construirse desde cero proyectando rayos en un entorno 2D y dibujando columnas verticales o manipulando el buffer de píxeles en **Canvas 2D Vanilla JS** (o un lienzo 2D puro equivalente).\n* **Libertad Creativa (Cero Sobriedad):** No hagas un laberinto básico de bloques grises planos. Diseña una experiencia inmersiva completa: texturas procedurales detalladas de 64x64 píxeles (muros de piedra musgosa, ladrillos sangrientos, paneles metálicos, puertas), iluminación atmosférica con niebla de distancia (*depth fog*), arma o artefacto animado en primera persona con *head-bobbing* al caminar, puertas corredizas interactivas y objetos/sprites en el escenario.\n* **Cero Dependencias Externas Rotas:** **PROHIBIDO** cargar imágenes o texturas desde URLs externas. Todas las texturas de paredes, sprites de objetos y gráficos del arma deben generarse **100% en memoria de forma procedural** al iniciar el script.\n\n---\n\n### 2. Requerimientos Matemáticos y Algorítmicos (El Núcleo del Reto)\nTu motor de Raycasting debe implementar con precisión matemática los siguientes pilares:\n\n1. **Algoritmo DDA (Digital Differential Analysis):**\n   * En lugar de usar *ray-marching* de paso fijo (que es lento y atraviesa esquinas por imprecisión), implementa el algoritmo **DDA** para saltar exactamente de intersección en intersección sobre la cuadrícula del mapa 2D ($\\Delta x$, $\\Delta y$, `sideDistX`, `sideDistY`), logrando precisión matemática perfecta y alto rendimiento.\n\n2. **Corrección Obligatoria del Efecto \"Ojo de Pez\" (Fisheye Correction):**\n   * Si utilizas la distancia euclidiana directa desde el jugador hasta el muro, las paredes rectas se verán curvadas como una pecera. Debes calcular la **distancia perpendicular al plano de la cámara**:\n     $$d_{\\perp} = d_{\\text{real}} \\cdot \\cos(\\theta_{\\text{rayo}} - \\theta_{\\text{jugador}})$$\n     (o su equivalente mediante vectores de dirección y plano de cámara $\\vec{d}$ y $\\vec{p}$).\n   * Calcula la altura proyectada de cada tira vertical en pantalla como $h_{\\text{muro}} = \\frac{H_{\\text{pantalla}}}{d_{\\perp}}$.\n\n3. **Mapeo de Texturas Procedurales y Sombreado Direccional:**\n   * Calcula la coordenada exacta del impacto en el muro (`wallX` $\\in [0, 1)$) para extraer la columna correspondiente (`texX`) de la textura procedural de $64 \\times 64$ píxeles y escalarla verticalmente en pantalla.\n   * Aplica **sombreado diferencial por orientación**: las paredes impactadas en orientación Norte-Sur vs. Este-Oeste (`side == 1`) deben tener distinta intensidad lumínica para que las esquinas se distingan claramente, además de un factor de atenuación proporcional a la distancia ($I \\propto 1 / (1 + k \\cdot d_{\\perp}^2)$) que simule la luz de una antorcha o linterna en la oscuridad.\n\n4. **Z-Buffer 1D, Sprites (*Billboarding*) y Colisiones Deslizantes:**\n   * Almacena la distancia perpendicular de cada columna de la pantalla en un arreglo `zBuffer[width]`. Úsalo para renderizar **Sprites 2D en el espacio 3D** (barriles, pilares, antorchas, orbes o enemigos) que se oculten correctamente detrás de las paredes.\n   * Implementa **detección de colisiones con deslizamiento (*Wall Sliding*)** separando la validación de movimiento en los ejes $X$ e $Y$ con un radio de margen (`playerRadius`), permitiendo que el jugador se deslice suavemente al rozar una pared en diagonal en lugar de quedarse trabado en seco.\n\n---\n\n### 3. Requerimientos Visuales, Minimapa e Interfaz (HUD)\n1. **Minimapa 2D Técnico en Tiempo Real (Dual-View):**\n   * Renderiza en una esquina (o en vista dividida conmutable) el mapa 2D visto desde arriba mostrando: la cuadrícula de muros, la posición del jugador, las entidades y el **abanico/cono completo de rayos proyectados en tiempo real** chocando exactamente contra las paredes.\n2. **Interactividad y Controles Fluidos:**\n   * Movimiento completo en primera persona (`WASD` para caminar y desplazarse lateralmente / *strafe*, Flechas o **Mouse con `PointerLockAPI`** para girar la vista, `Shift` para correr, `E` o `Espacio` para abrir/cerrar puertas mecánicas en el mapa, y Clic para accionar el arma/linterna con destello de luz dinámica).\n3. **Panel de Telemetría y Ajustes en Caliente:**\n   * Controles interactivos para modificar en vivo: Campo de Visión (**FOV** de 40° a 110°), Resolución de Rayos (desde modo ultra-pixelado retro hasta resolución nativa), Distancia de Niebla/Iluminación, y un interruptor para **activar/desactivar la corrección de Ojo de Pez** (para demostrar visualmente la diferencia matemática al instante).\n   * Indicadores en pantalla: FPS, Coordenadas $(X, Y)$, Ángulo de visión y cantidad de rayos trazados por frame.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto del código`) o dejar las funciones de texturizado o el algoritmo DDA incompletos.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"motor-raycasting\"",
    "key_requirements": [
      "Prohibido WebGL/Three.js: solo Canvas 2D",
      "Algoritmo DDA, corrección de ojo de pez (interruptor para activarla/desactivarla)",
      "Texturas procedurales 64x64, sombreado por orientación y niebla por distancia",
      "Z-buffer 1D con sprites, colisiones con deslizamiento, puertas, arma con head-bobbing",
      "Minimapa con cono de rayos, PointerLock, sliders de FOV, resolución y niebla, telemetría"
    ],
    "time_min": {
      "argon": 4,
      "flash": 17
    },
    "winner": "argon",
    "flash_broken": true,
    "kevin_note_verbatim": "Aqui no hay de donde defender a Flash, el resultado para haber tardado mas de 4 veces lo que Argon es deplorable, es injugable, no hay interaccion mas que con las puertas, el mundo se rompe, en cambio, Argon con los 4 minutos que demoro en dar el resultado, es 100 veces mejor, jugable y con interaccion en el entorno, Argon esta siendo mas eficiente, efectivo y rapido.",
    "kevin_note_verbatim_en": "Here there's no way to defend Flash, the result, considering it took more than 4 times as long as Argon, is deplorable, it's unplayable, there's no interaction except with the doors, the world breaks, whereas Argon, with the 4 minutes it took to deliver the result, is 100 times better, playable and with interaction with the environment, Argon is being more efficient, more effective and faster.",
    "kevin_note_paraphrase_es": "Aquí no hay forma de defender a Flash: tardó más de cuatro veces lo que Argon y el resultado es injugable, solo puedes interactuar con las puertas y el mundo se rompe. Argon, en 4 minutos, entregó algo jugable y con interacción: más eficiente, efectivo y rápido.",
    "kevin_note_en": "No defense for Flash: it took 4.25x longer (17m vs 4m) and produced an unplayable broken world due to unrounded Uint32Array indices. Argon is fast, solid, and playable.",
    "argon_features": [
      "DDA con corrección de ojo de pez conmutable [P] y fórmula en pantalla",
      "Texturas procedurales 64x64: piedra musgosa, ladrillo sangriento, acero tech, puerta corrediza, altar rúnico",
      "Cañón de plasma [Clic/F] y objetivos: orbes y drones con contador",
      "Vista dividida 2D/3D [TAB], minimapa con cono DDA en tiempo real, 160/320/640 rayos",
      "Sliders de FOV y alcance de antorcha/niebla, suelo texturizado, reiniciar nivel; PointerLock"
    ],
    "argon_features_en": [
      "DDA with toggleable fisheye correction [P] and an on-screen formula",
      "64x64 procedural textures: mossy stone, bloody brick, tech steel, sliding door, runic altar",
      "Plasma cannon [Click/F] and targets: orbs and drones with a counter",
      "Split 2D/3D view [TAB], minimap with a real-time DDA cone, 160/320/640 rays",
      "FOV and torch/fog range sliders, textured floor, restart level; PointerLock"
    ],
    "flash_features": [
      "DDA, minimapa con cono de rayos, corrección de ojo de pez, FOV, resolución y niebla",
      "Audio procedural, linterna/disparo, puertas"
    ],
    "flash_features_en": [
      "DDA, minimap with a ray cone, fisheye correction, FOV, resolution and fog",
      "Procedural audio, flashlight/shot, doors"
    ],
    "flash_problems": [
      "Injugable y 'el mundo se rompe' (nota de Kevin): las paredes se ven como rejas o peines con huecos",
      "Causa verificada en el código: drawStart = -lineHeight/2 + halfH sin redondear; cuando la altura de la columna es impar, la fila de inicio termina en .5 y, como los 4 anchos de pantalla de Flash (640, 480, 320 y 240) son pares, el índice y * screenW + x del Uint32Array sale entero pero desfasado medio renglón: esas tiras de pared se pintan fuera de su columna",
      "Solo hay interacción con puertas (nota de Kevin)",
      "Tardó 17 minutos, el más lento de Flash después del árbol fractal"
    ],
    "flash_problems_en": [
      "Unplayable and 'the world breaks' (Kevin's note): the walls look like bars or combs with gaps",
      "Cause verified in the code: drawStart = -lineHeight/2 + halfH without rounding; when the column height is odd, the starting row ends in .5 and, because all 4 of Flash's screen widths (640, 480, 320 and 240) are even, the Uint32Array index y * screenW + x comes out as an integer but shifted half a row: those wall strips get painted outside their column",
      "The only interaction is with doors (Kevin's note)",
      "Took 17 minutes, Flash's slowest after the fractal tree"
    ],
    "code_stats": {
      "argon_lines": 1829,
      "flash_lines": 1623,
      "argon_kb": 74.3,
      "flash_kb": 52.0,
      "argon_bytes": 76052,
      "flash_bytes": 53284
    },
    "page_titles": {
      "argon": "WOLF-DDA // Motor 3D de Raycasting Trigonómetrico Puro [Sin WebGL]",
      "flash": "Wolfenstein 3D Style // Pure 2D Canvas Raycasting Engine"
    },
    "fun_angle_es": "Medio píxel rompió el mundo de Flash: dividió la altura de cada pared entre dos sin redondear, y en las columnas de altura impar JavaScript pinta la tira de pared medio renglón fuera de su lugar. Argon usó un corrimiento de bits que siempre da un entero... y lo hizo en 4 minutos contra 17.",
    "fun_angle_en": "Half a pixel broke Flash's world: dividing odd column heights by 2 without rounding left a .5 in the starting row, and at Flash's even screen widths that shifted every odd-height wall slice half a row out of its column in the Uint32Array. Argon used bitwise >> 1 and shipped a playable shooter in 4 minutes vs Flash's 17.",
    "speed_ratio": "Argon 4.25x más rápido (13 min menos)",
    "speed_ratio_en": "Argon 4.25x faster (13 min less)",
    "faster_model": "argon",
    "observed_in_recording": {
      "argon": "120 FPS, 320 rayos",
      "flash": "118-120 FPS (el mundo se ve roto pese a los FPS)"
    },
    "demo_urls": {
      "argon": "/demos/argon/motor-raycasting/index.html",
      "flash": "/demos/flash/motor-raycasting/index.html"
    },
    "stills": {
      "argon": [
        "/stills/motor_raycasting_33.4s_argon.jpg",
        "/stills/motor_raycasting_67.0s_argon.jpg",
        "/stills/motor_raycasting_74.0s_argon.jpg"
      ],
      "flash": [
        "/stills/motor_raycasting_14.0s_flash.jpg",
        "/stills/motor_raycasting_23.5s_flash.jpg",
        "/stills/motor_raycasting_3.8s_flash.jpg"
      ]
    }
  },
  {
    "n": 7,
    "slug": "generador_sprites",
    "dir": "generador-sprites",
    "world_es": "Mundo 3 · Pixel Art y Retro Computing",
    "world_en": "World 3 · Pixel Art & Retro Computing",
    "category_es": "Pixel Art y Retro Computing",
    "category_en": "World 3 · Pixel Art & Retro Computing",
    "name_es": "Sprites Espaciales 8-Bits",
    "name_en": "8-Bit Procedural Spaceship Forge",
    "tech": "Canvas 2D pixel-perfect + simetría bilateral + sombreado HSL con hue shifting",
    "tech_en": "Pixel-perfect Canvas 2D + bilateral symmetry + HSL shading with hue shifting",
    "timestamp": "05:54",
    "prompt_gist_es": "Un generador de naves espaciales en pixel art de ocho bits: cada recarga crea una nave única y simétrica, con colores coherentes, sombreado y un modo para pilotarla y disparar.",
    "prompt_gist_en": "8-bit procedural spaceship hangar using bilateral symmetry, anatomical density masks, automatic 2D normal shading, HSL hue-shifted faction palettes, and playable test flight.",
    "prompt_verbatim": "Actúa como un Artista Técnico de Pixel Art Procedural y Desarrollador Creativo Senior. Tu objetivo es construir una **Forja y Hangar Interactivo de Sprites Espaciales Procedurales en 8-Bits (Estilo Arcade / Shmup)**, capaz de sintetizar naves espaciales únicas mediante matrices matemáticas, sombreado automático y animación en tiempo real, ejecutándose en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** Elige el entorno que te brinde el control más nítido a nivel de píxel (*pixel-perfect rendering* sin suavizado borroso) y una interfaz fluida (por ejemplo, un archivo único HTML5 con **Canvas 2D (`imageSmoothingEnabled = false`)**, o una aplicación local en **Python con Pygame**).\n* **Libertad Creativa (Cero Sobriedad):** No te limites a dibujar un único sprite estático sobre un fondo gris. Construye un **Hangar de Naves Espaciales Retro-Futurista** completo: fondo de espacio profundo con paralaje de estrellas (*starfield*), vista principal de la nave insignia con propulsores de plasma animados, vista de escuadrón/flota en cuadrícula, estadísticas RPG generadas proceduralmente para cada nave (nombre, facción, potencia de fuego, escudo, velocidad) y un **\"Modo Vuelo de Prueba (Test Flight)\"** donde puedas pilotar la nave recién generada y disparar láseres en el lienzo.\n* **Cero Dependencias Externas:** Todos los algoritmos de generación, paletas cromáticas, efectos de partículas y renderizado deben ser 100% autocontenidos en el código.\n\n---\n\n### 2. Requerimientos Algorítmicos y Matemáticos (El Núcleo del Reto)\nPara que el resultado parezca arte diseñado por un humano y no un código QR aleatorio, debes implementar el siguiente pipeline algorítmico (inspirado en el método de *Dave Bollinger / Pixel Spaceships* evolucionado):\n\n1. **Matriz de Plantilla Estructural y Simetría Bilateral:**\n   * Trabaja con una matriz bidimensional de resolución configurable (ej. $16 \\times 16$, $24 \\times 24$ o $32 \\times 32$).\n   * Calcula únicamente la mitad izquierda de la matriz ($0 \\le x < W/2$) y refléjala matemáticamente sobre el eje vertical central ($W - 1 - x$) para garantizar **simetría bilateral perfecta**.\n   * **Máscara de Densidad Anatómica:** En lugar de ruido uniforme, utiliza una función de probabilidad ponderada según la coordenada $(x, y)$ o zonas lógicas:\n     * **Núcleo/Fuselaje central (cerca del eje de simetría):** Alta probabilidad de celdas sólidas conectadas y cabina de mando (*cockpit*).\n     * **Alas y Armamento (zonas medias/exteriores):** Probabilidad media con reglas de conectividad celular (autómata celular de 1 o 2 pasos para eliminar píxeles huérfanos flotantes y consolidar estructuras sólidas).\n     * **Propulsores (borde inferior):** Nodos específicos en la base del fuselaje que actuarán como emisores de fuego/plasma.\n\n2. **Detección de Bordes y Sombreado Volumétrico Automático (Pixel Shading):**\n   * Una vez generada la silueta base y las sub-partes (casco primario, placas secundarias, cabina, motores), recorre la matriz aplicando reglas de iluminación 2D:\n     * **Contorno Exterior (*Outline*):** Todo píxel vacío que sea adyacente (ortogonalmente) a un píxel sólido de la nave debe convertirse en un borde oscuro (negro o el tono más profundo de la paleta) para darle acabado de sprite arcade clásico.\n     * **Iluminación Especular y Sombras Internas:** Calcula la normal aproximada de cada píxel interno; si tiene vacío o un componente distinto arriba, aplica un tono más brillante (*highlight* superior); si está en el borde inferior de una estructura, aplica un tono más oscuro (*shadow* inferior). Esto dará volumen 3D real al pixel art.\n\n3. **Teoría del Color y Paletas Armónicas Coherentes:**\n   * **Prohibido usar `RGB` completamente aleatorio.** Construye un generador de rampas de color en espacio **HSL / HSV** con *Hue Shifting* (desplazamiento sutil de matiz hacia el azul/violeta en las sombras y hacia el amarillo/blanco en las luces altas).\n   * Genera paletas coherentes por facción o arquetipo (ej. *Imperio Galáctico, Caza Cyberpunk Neón, Flota Alienígena Bio-orgánica, Industrial Pesado, Retro GameBoy 4-Colores*) diferenciando claramente el color del chasis, el cristal brillante de la cabina y la energía de los propulsores.\n\n---\n\n### 3. Requerimientos Visuales, Modos Interactivos y Controles (HUD)\n1. **Recarga Única + Generador por Semilla (Seed):**\n   * Cada recarga de la página debe inicializar una semilla aleatoria nueva mostrando una nave principal inédita en gran escala, acompañada de una galería inferior o lateral con una flota de variantes generadas al instante.\n   * Permite ingresar una **Semilla (Seed)** personalizada para recrear exactamente cualquier nave.\n2. **Animación Viva y Modo \"Test Flight\" (Jugable):**\n   * Incluso en el hangar, la nave debe sentirse viva: oscilación suave de levitación (*hover*), parpadeo de luces de navegación y partículas de escape saliendo de las celdas marcadas como propulsores.\n   * Incluye un botón o tecla para activar el **Modo Vuelo de Prueba**, permitiendo mover la nave por la pantalla con el teclado o mouse a través del campo de estrellas y disparar proyectiles procedurales desde las puntas de sus alas/cañones con retroceso visual (*screen shake* / *muzzle flash*).\n3. **Controles de Ingeniería y Exportación:**\n   * Selectores para cambiar la **Clase de Nave** (*Interceptor Ligero, Cazabombardero, Crucero Pesado, Nave Nodriza*), tamaño de matriz ($12\\times12$ a $32\\times32$), estilo de contorno y paleta cromática.\n   * Visor de capas del algoritmo (ver Máscara de Probabilidad $\\rightarrow$ Matriz Binaria Base $\\rightarrow$ Mapa de Regiones $\\rightarrow$ Sombreado Final) y botón para **Descargar el Sprite en PNG** (escalado limpio sin *aliasing*).\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto del código`) o dejar el algoritmo de sombreado/simetría incompleto.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"generador-sprites\"",
    "key_requirements": [
      "Matriz 12x12 a 32x32 calculando solo la mitad y reflejándola (simetría bilateral)",
      "Máscara de densidad anatómica + autómata celular para limpiar píxeles sueltos",
      "Contorno, luces y sombras automáticas; paletas HSL con hue shifting por facción",
      "Semilla reproducible, galería de flota, animación viva, modo Test Flight jugable",
      "Visor de capas del algoritmo y descarga en PNG"
    ],
    "time_min": {
      "argon": 4,
      "flash": 13
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "En este caso, la interfaz no se rompe, pero las naves generadas, el simulador, efectos y demas, sin duda y de nuevo se lo lleva Argon, en este caso, Flash tardo mas de tres veces lo que Argon y aun asi volvio a salir victorioso en esta comparativa",
    "kevin_note_verbatim_en": "In this case, the interface doesn't break, but the generated ships, the simulator, effects and so on, without a doubt and once again Argon takes it, in this case, Flash took more than three times as long as Argon and even so Argon came out victorious again in this comparison",
    "kevin_note_paraphrase_es": "La interfaz de Flash no se rompe, pero en naves generadas, simulador y efectos gana Argon otra vez, y eso que Flash tardó más del triple.",
    "kevin_note_en": "Flash's UI works, but Argon's generated ships, 4-stage pipeline viewer, and arcade test-flight simulator win decisively in less than a third of the time (4m vs 13m).",
    "argon_features": [
      "4 clases (interceptor, caza shmup, crucero, nodriza) y matrices 12x12 a 32x32",
      "7 arquetipos de color HSL con hue shifting (incluye GameBoy DMG-01) y 4 estilos de contorno",
      "Visor de pipeline en 4 etapas: máscara de probabilidad, matriz binaria, regiones, sprite final",
      "Vuelo de prueba [V]: movimiento en 8 direcciones, postquemador, láseres desde los cañones generados, rocas y drones con puntos y explosiones de píxeles",
      "Ficha de nave con stats, escuadrón generado clicable, descarga PNG"
    ],
    "argon_features_en": [
      "4 classes (interceptor, shmup fighter, cruiser, mothership) and 12x12 to 32x32 matrices",
      "7 HSL color archetypes with hue shifting (including GameBoy DMG-01) and 4 outline styles",
      "4-stage pipeline viewer: probability mask, binary matrix, regions, final sprite",
      "Test flight [V]: 8-direction movement, afterburner, lasers from the generated cannons, rocks and drones with points and pixel explosions",
      "Ship card with stats, clickable generated squadron, PNG download"
    ],
    "flash_features": [
      "5 clases, matrices 16x16 a 32x32, 7 paletas, 3 estilos de contorno",
      "Sliders morfológicos (densidad de fuselaje, envergadura, blindaje), visor de 4 capas",
      "Vuelo de prueba con blancos, exportación PNG y spritesheet, sonido"
    ],
    "flash_features_en": [
      "5 classes, 16x16 to 32x32 matrices, 7 palettes, 3 outline styles",
      "Morphology sliders (fuselage density, wingspan, armor), 4-layer viewer",
      "Test flight with targets, PNG and spritesheet export, sound"
    ],
    "flash_problems": [
      "Funcional; Kevin lo juzgó inferior en las naves generadas, el simulador y los efectos",
      "Tardó 13 minutos contra 4"
    ],
    "flash_problems_en": [
      "Functional; Kevin judged it inferior in the generated ships, the simulator and the effects",
      "Took 13 minutes vs 4"
    ],
    "code_stats": {
      "argon_lines": 1708,
      "flash_lines": 2472,
      "argon_kb": 68.5,
      "flash_kb": 81.7,
      "argon_bytes": 70106,
      "flash_bytes": 83627
    },
    "page_titles": {
      "argon": "STAR-FORGE 8-BIT // Forja y Hangar de Sprites Espaciales Procedurales",
      "flash": "8-BIT VOID FORGE // Hangar y Generador Procedural de Sprites Espaciales"
    },
    "fun_angle_es": "Los dos hicieron un hangar con vuelo de prueba, pero Flash tardó 13 minutos y Argon 4. En el de Argon cada roca que destruyes revienta en píxeles y te da puntos, como un arcade de verdad.",
    "fun_angle_en": "Both models built a spaceship hangar with a test-flight mode, but Flash took 13 minutes while Argon took 4—and Argon's asteroids shatter into pixel debris with arcade scoring.",
    "speed_ratio": "Argon 3.25x más rápido (9 min menos)",
    "speed_ratio_en": "Argon 3.25x faster (9 min less)",
    "faster_model": "argon",
    "observed_in_recording": {
      "argon": "120 FPS en vuelo de prueba, 2,800 PTS"
    },
    "demo_urls": {
      "argon": "/demos/argon/generador-sprites/index.html",
      "flash": "/demos/flash/generador-sprites/index.html"
    },
    "stills": {
      "argon": [
        "/stills/generador_sprites_60.5s_argon.jpg",
        "/stills/generador_sprites_69.5s_argon.jpg",
        "/stills/generador_sprites_84.6s_argon.jpg"
      ],
      "flash": [
        "/stills/generador_sprites_1.0s_flash.jpg",
        "/stills/generador_sprites_17.0s_flash.jpg",
        "/stills/generador_sprites_3.5s_flash.jpg"
      ]
    }
  },
  {
    "n": 8,
    "slug": "reloj_analogico",
    "dir": "reloj-analogico",
    "world_es": "Mundo 4 · Pura Magia CSS",
    "world_en": "World 4 · Pure CSS Engineering",
    "category_es": "Pura Magia CSS",
    "category_en": "World 4 · Pure CSS Engineering",
    "name_es": "Reloj Analógico Neumórfico",
    "name_en": "Neumorphic Pure CSS Chronograph",
    "tech": "HTML + CSS puro (@keyframes, gradientes cónicos y radiales, :checked); JS solo para sincronizar la hora al cargar",
    "tech_en": "Pure HTML + CSS (@keyframes, conic and radial gradients, :checked); JS only to sync the time on load",
    "timestamp": "06:40",
    "prompt_gist_es": "Un reloj de lujo hecho solo con HTML y CSS: las manecillas giran con animaciones de CSS, y JavaScript solo se usa una vez para poner la hora correcta al abrir la página.",
    "prompt_gist_en": "Haute horlogerie neumorphic analog watch driven 100% by CSS @keyframes and conic/radial gradients, using JavaScript only once on load to sync system time.",
    "prompt_verbatim": "Actúa como un Ingeniero de UI/UX Senior, Maestro de CSS Avanzado y Diseñador de Alta Relojería (*Haute Horlogerie*). Tu objetivo es construir un **Reloj Analógico Neumórfico y Esqueuomórfico Fotorrealista de Alta Precisión**, renderizado y animado mediante **HTML y CSS Puro**, que se ejecutará en mi máquina local.\n\n### 1. Libertad Estética Total (Con la Restricción de Oro del Reto)\n* **Restricción de Honor (Cero JS en el Bucle de Animación):** Queda **ESTRICTAMENTE PROHIBIDO** usar `<canvas>`, SVG complejos prefabricados, imágenes externas o bucles de JavaScript (`setInterval` / `requestAnimationFrame`) para mover las manecillas. Toda la geometría, texturas metálicas, biseles, sombras e impulsos cinemáticos deben construirse con **HTML + CSS Puro**.\n* **Uso Permitido de JavaScript (Solo Sincronización Inicial):** El único código JS permitido es un micro-script al cargar la página (`DOMContentLoaded`) que lea la hora exacta del sistema una sola vez y configure Variables CSS (`--initial-hours`, `--initial-minutes`, `--initial-seconds` o `animation-delay` negativos) para que, a partir de ese milisegundo, las animaciones `@keyframes` de CSS mantengan la hora real de forma perpetua y autónoma. (También puedes usar un mínimo de JS al inicio solo para inyectar en el DOM los 60 nodos de las marcas de minutos si deseas evitar repetir 60 etiquetas HTML a mano).\n* **Libertad Creativa (Cero Sobriedad):** No hagas un círculo plano con tres líneas simples. Diseña una pieza maestra de relojería industrial (inspirada en Dieter Rams / Braun, Omega o Patek Philippe combinada con Neumorfismo táctil moderno): chasis con extrusión suave, bisel de metal cepillado, sub-esferas (*complicaciones*), ventana de volante/engranaje vista (*Open-Heart / Tourbillon* animado con CSS), cristal de zafiro con reflejo especular y modos de iluminación.\n\n---\n\n### 2. Requerimientos Técnicos y Matemáticos en CSS (El Núcleo del Reto)\nDebes demostrar un dominio absoluto del motor de renderizado CSS implementando:\n\n1. **Cinemática de Barrido Continuo y Pivotes Exactos (`transform-origin`):**\n   * Configura las 3 manecillas principales (**Horas, Minutos y Segundos**) con sus respectivos `transform-origin` milimétricamente calculados para que roten sobre el eje central exacto del reloj, incluyendo el **contrapeso trasero** característico de la aguja segundera.\n   * **Movimiento Mecánico de Barrido (*Smooth Sweep*):** La manecilla de los segundos debe girar con un movimiento continuo fluido (`linear`) o simulando el latido de un calibre mecánico suizo de alta frecuencia (28,800 alternancias/hora usando `steps(480)` en 60s), mientras que las de minutos (`3600s`) y horas (`43200s`) avanzan de forma continua e imperceptible.\n\n2. **Arquitectura Neumórfica y Materiales Fotorrealistas con Gradientes:**\n   * **Doble Sombra Neumórfica:** Utiliza múltiples capas de `box-shadow` (sombras externas proyectadas e internas `inset` con luces altas en el ángulo superior izquierdo y penumbra en el inferior derecho) para esculpir una caja exterior convexa y una esfera interior (*dial*) cóncava profunda.\n   * **Texturas Procedurales CSS:** Crea el acabado de **acero cepillado radial** en el bisel usando `repeating-conic-gradient` y texturas concéntricas (*guilloché* o *sunburst*) en la carátula usando `radial-gradient` y `repeating-radial-gradient`.\n   * **Sombras Dinámicas de las Manecillas:** Cada aguja y el perno central (*capuchón*) deben proyectar sombras realistas (`filter: drop-shadow(...)`) sobre la esfera inferior para dar sensación real de separación física en el eje Z (capas de altura).\n\n3. **Índices, Sub-esferas y Complicaciones Relojeras:**\n   * Posiciona las **60 marcas del dial** (12 índices horarios principales en relieve + 48 marcas de minutos/segundos) utilizando variables CSS por índice (`--i`) y transformaciones trigonométricas o rotaciones anidadas (`rotate(calc(var(--i) * 6deg)) translateY(...)`).\n   * Añade al menos **dos detalles de alta relojería en la esfera**:\n     * Una **ventana de fecha (*Date Aperture*)** biselada con cristal de aumento tipo *Cyclops* o una sub-esfera de cronógrafo/indicador de 24 horas.\n     * Una apertura **Open-Heart / Tourbillon mecánico** donde se vea una rueda de escape o engranaje dorado girando y oscilando en tiempo real mediante `@keyframes` de CSS puro.\n\n---\n\n### 3. Requerimientos Interactivos (CSS State Machines)\nSin usar JavaScript para la interacción, implementa controles táctiles neumáticos (usando el patrón `input[type=\"checkbox\"]` o `input[type=\"radio\"]` + selectores `:checked` y variables CSS en `:root`):\n1. **Selector de Material / Tema en Vivo:**\n   * **Modo Neumórfico Clásico (Soft Clay / Blanco Mate):** Sombras suaves de arcilla táctil.\n   * **Modo Titanio Oscuro (Dark Carbon):** Chasis negro mate con detalles en rojo/naranja deportivo.\n   * **Modo Lujo Nocturno (Super-LumiNova):** Apaga las luces del entorno y hace que los índices horarios y las manecillas emitan un **resplandor fosforescente verde/azul cian intenso** (`box-shadow` y `text-shadow` luminiscentes).\n2. **Efecto Cristal de Zafiro Interactivo:**\n   * Una capa superior semitransparente con reflejo diagonal y efecto `backdrop-filter` que reaccione sutilmente al pasar el cursor (`:hover`) sobre el reloj, desplazando el brillo especular como si la luz incidiera desde otro ángulo.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque HTML (con el CSS y el micro-script de sincronización inicial embebidos) listo para guardar y abrir en el navegador.\n* **Prohibido** usar comentarios de omisión (`/* ... resto de estilos */`) o dejar reglas CSS incompletas.\n* Incluye al final una breve nota de 2 líneas indicando cómo abrirlo y probarlo en mi máquina.\n\nTodo en una carpeta llamada \"reloj-analogico\"",
    "key_requirements": [
      "Cero JS en el bucle de animación (sin setInterval ni requestAnimationFrame)",
      "Manecillas con transform-origin exacto y contrapeso; segundero de barrido o 28,800 alternancias/hora con steps(480)",
      "Sombras neumórficas, acero cepillado con repeating-conic-gradient, 60 marcas por índice",
      "Ventana de fecha o subesfera + tourbillon animado en CSS",
      "Temas por :checked (Clay, Titanio, Lumi) y cristal de zafiro con hover"
    ],
    "time_min": {
      "argon": 2,
      "flash": 4
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "Aqui ambos cumplieron, en cuanto a funcionalidad, los dos cumplen al pie de la letra, el tema es que a pesar de que Argon tardo la mitad de tiempo que Flash, Argon de nuevo gana en tanto a calidad del producto entregado, es mas agradable y vistoso de ver, de nuevo, Argon ganando en eficiencia y calidad",
    "kevin_note_verbatim_en": "Here both delivered, in terms of functionality, both follow it to the letter, the thing is that even though Argon took half the time Flash did, Argon again wins in terms of the quality of the delivered product, it's more pleasant and eye-catching to look at, once again, Argon winning on efficiency and quality",
    "kevin_note_paraphrase_es": "Los dos cumplieron al pie de la letra. Aun así, Argon tardó la mitad y gana en calidad: su reloj es más agradable y vistoso. Otra vez Argon gana en eficiencia y calidad.",
    "kevin_note_en": "Both models fulfilled every CSS rule to the letter; Argon wins on visual horology craftsmanship and finished in half the time (2m vs 4m).",
    "argon_features": [
      "Animación 100% CSS: horas 43200s, minutos 3600s, segundero steps(480) a 8 Hz, sin rAF ni setInterval",
      "3 acabados por radio :checked (Soft Clay, Titanio Carbono, Lujo Nocturno Super-LumiNova)",
      "3 cadencias de segundero (28,800 A/h, barrido continuo, 1 Hz cuarzo)",
      "Tourbillon girando y volante oscilando con @keyframes, subesfera GMT 24H, ventana de fecha",
      "Cristal de zafiro conmutable con hover; JS de sincronización de 43 líneas"
    ],
    "argon_features_en": [
      "100% CSS animation: hours 43200s, minutes 3600s, seconds hand steps(480) at 8 Hz, no rAF or setInterval",
      "3 finishes via :checked radios (Soft Clay, Carbon Titanium, Nocturnal Luxury Super-LumiNova)",
      "3 seconds-hand cadences (28,800 A/h, continuous sweep, 1 Hz quartz)",
      "Rotating tourbillon and oscillating balance wheel with @keyframes, GMT 24H sub-dial, date window",
      "Toggleable sapphire crystal with hover; 43-line sync JS"
    ],
    "flash_features": [
      "También 100% CSS: 3 temas, 3 cadencias, tourbillon volante, día y fecha, cristal con backdrop-filter",
      "Usa el selector :has() para los temas; JS de sincronización de 62 líneas"
    ],
    "flash_features_en": [
      "Also 100% CSS: 3 themes, 3 cadences, flying tourbillon, day and date, crystal with backdrop-filter",
      "Uses the :has() selector for the themes; 62-line sync JS"
    ],
    "flash_problems": [
      "Ninguno funcional (nota de Kevin: ambos cumplen); solo estética inferior según Kevin"
    ],
    "flash_problems_en": [
      "No functional problems (Kevin's note: both deliver); only inferior aesthetics according to Kevin"
    ],
    "code_stats": {
      "argon_lines": 1229,
      "flash_lines": 1210,
      "argon_kb": 39.3,
      "flash_kb": 38.0,
      "argon_bytes": 40255,
      "flash_bytes": 38910
    },
    "page_titles": {
      "argon": "CHRONOGRAPHIA NEUMORPHICA // Alta Relojería en HTML y CSS Puro",
      "flash": "Haute Horlogerie // Reloj Analógico Neumórfico de Alta Precisión"
    },
    "fun_angle_es": "Un reloj de lujo sin una sola línea de JavaScript moviendo las manecillas. Los dos lo lograron, pero Argon lo hizo en 2 minutos: la prueba más rápida de todo el benchmark.",
    "fun_angle_en": "A luxury mechanical timepiece with zero JavaScript in the animation loop. Both models nailed the spec, with Argon completing it in 2 minutes—the fastest single run of the entire benchmark.",
    "speed_ratio": "Argon 2x más rápido (2 min menos)",
    "speed_ratio_en": "Argon 2x faster (2 min less)",
    "faster_model": "argon",
    "observed_in_recording": null,
    "demo_urls": {
      "argon": "/demos/argon/reloj-analogico/index.html",
      "flash": "/demos/flash/reloj-analogico/index.html"
    },
    "stills": {
      "argon": [
        "/stills/reloj_analogico_21.0s_argon.jpg",
        "/stills/reloj_analogico_26.0s_argon.jpg",
        "/stills/reloj_analogico_28.5s_argon.jpg"
      ],
      "flash": [
        "/stills/reloj_analogico_10.0s_flash.jpg",
        "/stills/reloj_analogico_2.0s_flash.jpg"
      ]
    }
  },
  {
    "n": 9,
    "slug": "arbol_fractal",
    "dir": "arbol-fractal",
    "world_es": "Mundo 5 · Matematicas Puras",
    "world_en": "World 5 · Pure Mathematics",
    "category_es": "Matemáticas Puras",
    "category_en": "World 5 · Pure Mathematics",
    "name_es": "Árbol Fractal con Viento",
    "name_en": "Fractal Tree with Perlin Wind",
    "tech": "Canvas 2D + L-systems estocásticos + cinemática directa (FK) + ruido Perlin/fBM",
    "tech_en": "Canvas 2D + stochastic L-systems + forward kinematics (FK) + Perlin/fBM noise",
    "timestamp": "07:12",
    "prompt_gist_es": "Un árbol generado con recursividad cuyas ramas se mecen con un viento natural hecho con ruido matemático; el mouse sopla, las hojas se desprenden y puedes cambiar de especie.",
    "prompt_gist_en": "Stochastic L-system fractal tree with precomputed skeleton, Leonardo da Vinci branch tapering, hierarchical forward kinematics, Perlin/fBM wind field, and leaf detachment.",
    "prompt_verbatim": "Actúa como un Ingeniero de Simulaciones Botánicas Computacionales y Desarrollador Creativo Senior. Tu objetivo es construir un **Simulador Interactivo de Árboles Fractales con Física de Viento y Cinemática Directa (L-Systems Estocásticos)**, visualmente poético y matemáticamente riguroso, que se ejecutará en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** Elige el entorno que te permita renderizar miles de segmentos orgánicos, follaje y partículas a 60 FPS estables (por ejemplo, un archivo único HTML5 con **Canvas 2D avanzado / WebGL**, o una aplicación local en **Python con Pygame / ModernGL**).\n* **Libertad Creativa (Cero Sobriedad):** Prohibido dibujar un simple árbol de líneas cafés sobre un fondo blanco. Diseña un ecosistema atmosférico vivo: cielo con gradiente dinámico o iluminación crepuscular, corteza con sombreado cilíndrico, follaje exuberante con variaciones cromáticas (flores de cerezo *Sakura*, otoño dorado, sauce llorón o un árbol de almas bioluminiscente estilo *Avatar*), hierba reactiva en la base del tronco, hojas que se desprenden con las ráfagas fuertes y vuelan siguiendo el mismo campo vectorial de viento, y un HUD de telemetría botánica.\n* **Cero Dependencias Externas:** Todo el generador de ruido coherente (Perlin/Simplex 2D/3D), motor cinemático y gráficos deben estar 100% autocontenidos en el código.\n\n---\n\n### 2. Requerimientos Matemáticos y Físicos (El Núcleo del Reto)\nTu motor debe resolver con precisión la topología recursiva y la física estructural:\n\n1. **Separación de Topología y Renderizado (Cero Parpadeo Estocástico):**\n   * **Regla Crítica:** No llames a `Math.random()` en bruto dentro del bucle de dibujo de cada fotograma sin fijar la estructura. Debes generar primero el **Grafo / Esqueleto del Árbol en memoria** (usando recursividad o reglas de producción *L-System* con una semilla fija), almacenando para cada rama su longitud base, ángulo de reposo ($\\theta_0$), grosor, nivel de profundidad ($d$) y nodos hijos.\n   * **Regla de Leonardo da Vinci para el Grosor:** El radio de una rama madre debe decaer de forma natural en cada bifurcación ($r_{d} = r_{d-1} \\cdot \\text{ratio}$, con $\\text{ratio} \\approx 0.68 - 0.75$), dibujando trapecios o trazos cónicos suaves en lugar de rectángulos bruscos.\n\n2. **Cinemática Directa Jerárquica (Forward Kinematics):**\n   * Las ramas no pueden doblarse de forma aislada desconectándose de sus ramas hijas. Cada nodo hijo debe calcular su posición de inicio exactamente en el punto final $(x_{\\text{end}}, y_{\\text{end}})$ de su rama padre en ese instante de tiempo, y **heredar el ángulo acumulado** de toda su cadena ancestral:\n     $$\\theta_{\\text{actual}}(d, t) = \\theta_{\\text{padre}}(t) + \\theta_{\\text{local}} + \\Delta\\theta_{\\text{viento}}(x, y, d, t)$$\n   * De este modo, cuando el tronco o una rama principal se inclina por un vendaval, toda la sub-estructura de ramas secundarias y hojas se traslada y rota solidariamente como un esqueleto articulado real.\n\n3. **Campo de Viento con Ruido Coherente (Perlin / Simplex Noise) y Elasticidad:**\n   * Implementa desde cero un generador de **Ruido Perlin o Simplex 2D** (o una superposición armónica de ondas espaciales con turbulencia fractal *fBM*) evaluado en las coordenadas espaciales de cada rama y el tiempo: $\\text{Noise}(x \\cdot s, y \\cdot s, t \\cdot \\omega)$.\n   * **Rigidez Estructural por Nivel ($k_{\\text{flex}}$):** El tronco principal ($d=0$) debe ser sumamente rígido y apenas mecerse unos pocos grados, mientras que la flexibilidad debe crecer exponencialmente hacia las ramas terminales y las hojas ($\\Delta\\theta \\propto d^{\\alpha}$), añadiendo un desfase de fase temporal para simular la propagación de la onda de viento a través de la copa del árbol.\n\n4. **Interacción Física con el Mouse y Desprendimiento de Hojas:**\n   * El cursor del mouse debe actuar como un **vórtice o soplador local**: al mover o arrastrar el mouse cerca de las ramas, aplica una fuerza direccional proporcional a la velocidad del cursor que doble las ramas cercanas con rebote elástico (*spring damping*) al soltarlas.\n   * Cuando la fuerza instantánea del viento supere un umbral en las ramas finales, desprende pétalos u hojas que pasen a ser partículas autónomas arrastradas por la gravedad, la turbulencia del ruido Perlin y el viento global.\n\n---\n\n### 3. Requerimientos Visuales, Especies y Controles (HUD)\n1. **Selector de Especies / Estaciones (Presets en Vivo):**\n   * Incluye botones para transformar la morfología y estética del árbol al instante:\n     * **Cerezo Japonés (*Sakura*):** Tronco oscuro retorcido, copa amplia y miles de flores/pétalos rosados cayendo en el viento.\n     * **Sauce Llorón (*Weeping Willow*):** Ramas largas y flexibles con factor de gravedad positivo que caen como cortinas verdes mecidas suavemente.\n     * **Roble Invernal / Secuoya:** Estructura imponente, alta profundidad fractal y follaje denso o escarcha.\n     * **Árbol Bioluminiscente Nocturno:** Estética de fantasía/sci-fi con savia brillante, hojas de neón cian/violeta con efecto *glow* y esporas flotantes.\n2. **Panel de Control Botánico y Meteorológico:**\n   * Controles deslizantes (*sliders*) para ajustar en tiempo real:\n     * **Fuerza Base del Viento** (desde brisa calmada hasta huracán/tormenta).\n     * **Turbulencia y Frecuencia de Ráfagas** (escala del ruido Perlin).\n     * **Profundidad de Recursión** (hasta 10-12 niveles con optimización).\n     * **Ángulo de Bifurcación, Asimetría del Árbol y Relación de Longitud**.\n   * Botón para generar una **Nueva Semilla**, interruptor para visualizar el **Campo Vectorial del Viento (flechas de flujo en el fondo)** y contador de FPS, número total de ramas y hojas activas.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto del código`) o dejar la función de ruido Perlin/Simplex sin implementar.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"arbol-fractal\"",
    "key_requirements": [
      "Esqueleto del árbol precalculado con semilla (sin Math.random en el dibujo)",
      "Grosor tipo Leonardo da Vinci y cinemática directa jerárquica (los hijos heredan el ángulo del padre)",
      "Ruido Perlin/Simplex escrito desde cero; flexibilidad creciente hacia las puntas",
      "Mouse como vórtice con rebote elástico; hojas que se desprenden y vuelan",
      "4 especies (Sakura, sauce, roble, bioluminiscente), sliders de viento, recursión, ángulos; FPS y conteos"
    ],
    "time_min": {
      "argon": 4,
      "flash": 22
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "Mismo caso que los anteriores, mejores graficos, mejores configuraciones, interaccion mas realista, actualizacion en tiempo real, y todo esto en menos de 1/5 del tiempo que le costo a Flash hacerlo, Argon es una maquina de eficiencia y calidad.",
    "kevin_note_verbatim_en": "Same case as the previous ones, better graphics, better settings, more realistic interaction, real-time updates, and all this in less than 1/5 of the time it took Flash to do it, Argon is an efficiency and quality machine.",
    "kevin_note_paraphrase_es": "Igual que los anteriores: mejores gráficos, mejores configuraciones, interacción más realista y actualización en tiempo real, y todo en menos de una quinta parte del tiempo que le tomó a Flash. Argon es una máquina de eficiencia y calidad.",
    "kevin_note_en": "Better graphics, deeper botanical settings, more realistic wind kinematics, and real-time updates in less than 1/5 of Flash's time (4m vs 22m).",
    "argon_features": [
      "Ángulo acumulado por rama θ(d,t) = θ_padre + θ_local + Δθ_Perlin + resorte; flexibilidad k0·(d+0.18)^1.65",
      "4 especies con teclas 1-4 (Sakura, sauce llorón, roble otoñal, bioluminiscente)",
      "Profundidad 5 a 11 niveles, ángulo, asimetría, decaimiento de longitud y conicidad Da Vinci",
      "Viento: fuerza, turbulencia fBM, frecuencia; ráfaga vendaval [G]; campo vectorial [V]; esqueleto FK [K]",
      "Racimos de follaje precalculados (5/3/2 por rama terminal/subterminal) que se desprenden y rebrotan"
    ],
    "argon_features_en": [
      "Accumulated angle per branch θ(d,t) = θ_parent + θ_local + Δθ_Perlin + spring; flexibility k0·(d+0.18)^1.65",
      "4 species on keys 1-4 (Sakura, weeping willow, autumn oak, bioluminescent)",
      "Depth from 5 to 11 levels, angle, asymmetry, length decay and Da Vinci tapering",
      "Wind: strength, fBM turbulence, frequency; gale gust [G]; vector field [V]; FK skeleton [K]",
      "Precomputed foliage clusters (5/3/2 per terminal/subterminal branch) that detach and regrow"
    ],
    "flash_features": [
      "4 especies (Sakura, sauce, roble dorado, árbol de almas), viento, ráfagas, turbulencia, profundidad 5-11, flexibilidad",
      "Campo de viento, caída de hojas, pantalla completa"
    ],
    "flash_features_en": [
      "4 species (Sakura, willow, golden oak, tree of souls), wind, gusts, turbulence, depth 5-11, flexibility",
      "Wind field, falling leaves, fullscreen"
    ],
    "flash_problems": [
      "Funcional; Kevin lo juzgó inferior en gráficos, configuración e interacción",
      "Tardó 22 minutos: la prueba más lenta de todo el benchmark",
      "Telemetría observada en la grabación: 120 FPS con 1,023 ramas, 46 a 106 FPS con 4,095 y 40 FPS con 7,165"
    ],
    "flash_problems_en": [
      "Functional; Kevin judged it inferior in graphics, settings and interaction",
      "Took 22 minutes: the slowest run of the entire benchmark",
      "Telemetry observed in the recording: 120 FPS with 1,023 branches, 46 to 106 FPS with 4,095 and 40 FPS with 7,165"
    ],
    "code_stats": {
      "argon_lines": 1371,
      "flash_lines": 1636,
      "argon_kb": 53.2,
      "flash_kb": 53.7,
      "argon_bytes": 54468,
      "flash_bytes": 54944
    },
    "page_titles": {
      "argon": "ARBOR-KINEMATICS // Simulador de Árboles Fractales, L-Systems y Física de Viento Perlin",
      "flash": "Simulador de Árboles Fractales // Cinemática y Viento Perlin"
    },
    "fun_angle_es": "La diferencia más brutal del benchmark: 22 minutos contra 4, cinco veces y media. Y un dato honesto: cuando el árbol de Argon pasa de veinte mil racimos de flores, hasta él baja a unos 45 cuadros por segundo.",
    "fun_angle_en": "The widest time gap of the tournament: 22 minutes for Flash versus 4 minutes for Argon (5.5x faster). Transparency note: when Argon's canopy exceeds 20,000 blossom clusters, frame rate dips to 43-53 FPS.",
    "speed_ratio": "Argon 5.5x más rápido (18 min menos)",
    "speed_ratio_en": "Argon 5.5x faster (18 min less)",
    "faster_model": "argon",
    "observed_in_recording": {
      "argon": "7,407 segmentos y 18,530-25,984 racimos: 43-53 FPS; 120 FPS solo con poco follaje",
      "flash": "1,023 ramas: 120 FPS; 4,095 ramas: 46-106 FPS; 7,165 ramas: 40 FPS"
    },
    "demo_urls": {
      "argon": "/demos/argon/arbol-fractal/index.html",
      "flash": "/demos/flash/arbol-fractal/index.html"
    },
    "stills": {
      "argon": [
        "/stills/arbol_fractal_156.5s_argon.jpg",
        "/stills/arbol_fractal_173.5s_argon.jpg",
        "/stills/arbol_fractal_86.0s_argon.jpg"
      ],
      "flash": [
        "/stills/arbol_fractal_55.0s_flash.jpg",
        "/stills/arbol_fractal_67.0s_flash.jpg",
        "/stills/arbol_fractal_77.0s_flash.jpg"
      ]
    }
  },
  {
    "n": 10,
    "slug": "spirograph_parametrico",
    "dir": "spirograph-parametrico",
    "world_es": "Mundo 5 · Matematicas Puras",
    "world_en": "World 5 · Pure Mathematics",
    "category_es": "Matemáticas Puras",
    "category_en": "World 5 · Pure Mathematics",
    "name_es": "Spirograph Paramétrico",
    "name_en": "Parametric Spirograph & Guilloche",
    "tech": "Canvas 2D doble buffer + hipotrocoides/epitrocoides + MCD de Euclides",
    "tech_en": "Double-buffered Canvas 2D + hypotrochoids/epitrochoids + Euclid's GCD",
    "timestamp": "08:04",
    "prompt_gist_es": "Un espirógrafo digital, como el juguete de ruedas dentadas, que va dibujando curvas hipnóticas que cambian de color, y que calcula exactamente cuántas vueltas necesita para cerrar la figura.",
    "prompt_gist_en": "Dual-canvas parametric plotter for hypotrochoids, epitrochoids, and 3-rotor guilloche engravings with Euclidean GCD/LCM exact cycle closure and velocity-based HSL calligraphy.",
    "prompt_verbatim": "Actúa como un Ingeniero de Geometría Computacional, Artista Algorítmico y Desarrollador Creativo Senior. Tu objetivo es construir un **Estudio Interactivo de Trazado Paramétrico de Alta Precisión (Spirograph Mecánico, Curvas Hipotrocoides, Epitrocoides y Guilloché)**, visualmente hipnótico y matemáticamente exacto, que se ejecutará en mi máquina local.\n\n### 1. Libertad Tecnológica y Estética Total\n* **Elección de Stack:** Elige el entorno que te permita alcanzar una nitidez vectorial/sub-píxel impecable y animación fluida a 60 FPS (por ejemplo, un archivo único HTML5 con una **Arquitectura de Doble Canvas 2D** o **WebGL**, o una aplicación local en **Python con Pygame / ModernGL**).\n* **Libertad Creativa (Cero Sobriedad):** No te limites a dibujar una línea simple sobre un fondo negro vacío. Diseña un laboratorio de geometría sagrada y arte generativo: trazos con fusión aditiva luminiscente (`globalCompositeOperation = 'lighter'` o `'screen'`), simulación visual en vivo de los **engranajes mecánicos dentados y el brazo articulado** girando mientras la punta láser incandescente deposita tinta brillante sobre el lienzo, chispas sutiles en el cabezal de dibujo, caligrafía variable (grosor dinámico según la velocidad del trazo) y un HUD de telemetría matemática.\n* **Cero Dependencias Externas:** Todo el motor paramétrico, cálculo de teoría de números, renderizado de doble capa e interfaz debe ser 100% autocontenido en el código.\n\n---\n\n### 2. Requerimientos Matemáticos y Algorítmicos (El Núcleo del Reto)\nTu motor matemático debe implementar con rigor absoluto los siguientes componentes:\n\n1. **Ecuaciones Paramétricas Exactas y Modos de Ruleta:**\n   * **Hipotrocoide (Rueda rodando por el interior del anillo fijo):**\n     $$x(t) = (R - r)\\cos(t) + d\\cos\\left(\\frac{R - r}{r}t\\right)$$\n     $$y(t) = (R - r)\\sin(t) - d\\sin\\left(\\frac{R - r}{r}t\\right)$$\n   * **Epitrocoide (Rueda rodando por el exterior del anillo fijo):**\n     $$x(t) = (R + r)\\cos(t) - d\\cos\\left(\\frac{R + r}{r}t\\right)$$\n     $$y(t) = (R + r)\\sin(t) - d\\sin\\left(\\frac{R + r}{r}t\\right)$$\n   * **Modo Avanzado Multi-Rotor (Epiciclos / 3er Engranaje Opcional):** Permite activar una tercera rueda secundaria ($r_2, d_2$) acoplada o una modulación armónica para generar patrones de *Guilloché* de alta complejidad (como los grabados de seguridad de los billetes y pasaportes).\n\n2. **Teoría de Números para el Cierre Perfecto del Ciclo (MCD / GCD):**\n   * Calcula mediante el **Algoritmo de Euclides** el Máximo Común Divisor $\\text{MCD}(R, r)$.\n   * Determina y muestra matemáticamente antes de empezar a dibujar:\n     * **Número exacto de revoluciones para cerrar la curva:** $N_{\\text{rev}} = \\frac{r}{\\text{MCD}(R, r)}$ (por lo que el ángulo total de cierre es $t_{\\max} = 2\\pi \\cdot N_{\\text{rev}}$).\n     * **Número total de pétalos / cúspides / lóbulos de la figura:** $P = \\frac{R}{\\text{MCD}(R, r)}$.\n   * Muestra una barra de progreso precisa ($0\\% \\rightarrow 100\\%$) que indique en qué momento exacto la aguja completará el circuito cerrado sin sobre-dibujar innecesariamente (a menos que el usuario active el modo de rotación continua).\n\n3. **Arquitectura de Doble Buffer (Dual-Canvas) y Sub-Stepping Temporal:**\n   * **Separación de Capas Obligatoria:** Utiliza **dos capas/lienzos superpuestos**:\n     * **Capa 1 (Buffer Persistente de Tinta):** Acumula únicamente los segmentos de la curva paramétrica con *anti-aliasing* sin borrarse entre fotogramas, permitiendo trazar curvas de cientos de miles de pasos con 0% de degradación de FPS.\n     * **Capa 2 (Overlay Mecánico Dinámico):** Se limpia en cada `requestAnimationFrame` para dibujar el anillo estator ($R$), la rueda dentada móvil ($r$) rotando sin deslizamiento en su posición instantánea, el radio vector hacia el orificio del bolígrafo ($d$) y el cabezal láser brillante en $(x(t), y(t))$.\n   * **Sub-stepping de Alta Frecuencia:** Dentro de cada fotograma de `requestAnimationFrame`, ejecuta un bucle de $K$ micro-pasos con un diferencial $\\delta t$ muy pequeño (ej. $\\delta t = 0.005\\text{ rad}$) para que, incluso a velocidades de dibujo altísimas, las curvas sean perfectamente suaves y jamás se vean poligonales o quebradas.\n\n4. **Dinámica Cromática en Espacio HSL y Caligrafía Basada en Velocidad:**\n   * Calcula la velocidad lineal instantánea de la pluma:\n     $$v(t) = \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}$$\n   * Modula dinámicamente el color `HSL(h, s, l)` y la opacidad de cada micro-segmento según el modo elegido: por avance del ángulo $t$, por distancia radial al centro $\\sqrt{x^2+y^2}$, o por la velocidad instantánea $v(t)$ (haciendo que las cúspides lentas brillen con más intensidad y distinto matiz que los arcos rápidos).\n\n---\n\n### 3. Requerimientos Visuales, Presets e Interfaz (HUD)\n1. **Visualización Mecánica Conmutable:**\n   * Interruptor en vivo para **Mostrar / Ocultar los Engranajes Guía**: cuando está activo, se ven las ruedas dentadas translúcidas tipo acrílico de ingeniero girando en sincronía perfecta con la línea que va naciendo; cuando se oculta, solo queda la obra de arte luminosa sobre el lienzo oscuro.\n2. **Controles Paramétricos en Tiempo Real y Presets:**\n   * Controles deslizantes (*sliders*) y campos numéricos para ajustar: Radio Fijo ($R$), Radio Móvil ($r$), Distancia de la Pluma ($d$), Velocidad de Trazado (sub-pasos por frame), Grosor de Pluma y Modo de Coloración HSL.\n   * **Selector de Presets Matemáticos:** *Astroide Clásico, Deltoide, Roseta Solar de 17 Puntas, Mandala Hipotrocoide Complejo (ej. $R=144, r=55, d=89$ - proporción Fibonacci), Grabado Guilloché Imperial y Supernova Multi-Engranaje*.\n   * Botones de acción rápida: **Pausar/Reanudar**, **Reiniciar Trazo Animado**, **Renderizar Ciclo Completo al Instante (Warp)**, **Añadir Capa (Superponer otra curva sin borrar la anterior)** y **Exportar Arte en PNG de Alta Resolución**.\n\n---\n\n### 4. Reglas de Entrega\n* Entrega el **código completo, íntegro y 100% funcional** en un solo bloque listo para copiar, guardar y ejecutar directamente.\n* **Prohibido** usar comentarios de omisión (`// ... resto del código`) o dejar las ecuaciones paramétricas o el renderizado de los engranajes incompletos.\n* Incluye al final una breve nota de 2 líneas indicando el comando exacto o la forma de ejecutarlo en mi máquina.\n\nTodo en una carpeta llamada \"spirograph-parametrico\"",
    "key_requirements": [
      "Ecuaciones exactas de hipotrocoide y epitrocoide + tercer rotor opcional (guilloché)",
      "MCD por Euclides: vueltas para cerrar r/MCD, pétalos R/MCD, barra de progreso exacta",
      "Doble canvas (tinta persistente + engranajes) y sub-pasos por frame",
      "Color HSL según ángulo, radio o velocidad; grosor según velocidad",
      "Presets (astroide, deltoide, roseta 17, mandala Fibonacci 144/55/89, guilloché, supernova), warp, capas, PNG"
    ],
    "time_min": {
      "argon": 4,
      "flash": 10
    },
    "winner": "argon",
    "flash_broken": false,
    "kevin_note_verbatim": "Aqui ambos hicieron bien su trabajo, el unico detalle es la calidad de personalizacion que nos permitio Argon, dando asi la posibilidad de conseguir mandalas que lleguen 40,000.00 rad, y esto 2.5 veces mas rapido que Flash, es indiscutible, Argon es una mejora significativa a los modelos previos de Gemini en tanto a generacion, entendimiento y eficiencia.",
    "kevin_note_verbatim_en": "Here both did their job well, the only detail is the quality of customization Argon allowed us, thus making it possible to get mandalas that reach 40,000.00 rad, and this 2.5 times faster than Flash, it's indisputable, Argon is a significant improvement over the previous Gemini models in terms of generation, understanding and efficiency.",
    "kevin_note_paraphrase_es": "Los dos hicieron bien su trabajo; la diferencia es cuánto deja personalizar Argon, al punto de lograr mandalas de hasta 40,000 radianes, y 2.5 veces más rápido que Flash. Para Kevin, Argon es una mejora significativa sobre los Gemini anteriores en generación, entendimiento y eficiencia.",
    "kevin_note_en": "Both did great work, with Argon winning on customization depth (multi-rotor mandalas reaching tens of thousands of radians) and 2.5x faster generation (4m vs 10m).",
    "argon_features": [
      "Hipotrocoide/epitrocoide + 3er rotor guilloché combinable con cualquiera de los dos modos",
      "Cierre exacto con MCD y, con el 3er rotor, mínimo común múltiplo de las vueltas (ej. R=204, r=145, r2=33: 1,595 vueltas = 10,021.68 rad)",
      "6 presets, 4 modos de color HSL, sub-pasos 2-280 por frame, grosor caligráfico por velocidad",
      "Engranajes guía [G], warp 100% [W], añadir capa [L], auto-stop, exportar PNG [P]",
      "Telemetría de la pluma: coordenadas, velocidad v(t), radio polar, micro-segmentos"
    ],
    "argon_features_en": [
      "Hypotrochoid/epitrochoid + a 3rd guilloché rotor that can be combined with either mode",
      "Exact closure with the GCD and, with the 3rd rotor, the least common multiple of the revolutions (e.g. R=204, r=145, r2=33: 1,595 revolutions = 10,021.68 rad)",
      "6 presets, 4 HSL color modes, 2-280 sub-steps per frame, velocity-based calligraphic stroke width",
      "Guide gears [G], 100% warp [W], add layer [L], auto-stop, PNG export [P]",
      "Pen telemetry: coordinates, velocity v(t), polar radius, micro-segments"
    ],
    "flash_features": [
      "Hipotrocoide, epitrocoide y modo guilloché (3R); 6 presets; 7 paletas; 3 modos de fusión óptica",
      "MCD, vueltas y pétalos; warp, capas, limpiar, exportar PNG, bucle continuo"
    ],
    "flash_features_en": [
      "Hypotrochoid, epitrochoid and guilloché mode (3R); 6 presets; 7 palettes; 3 optical blend modes",
      "GCD, revolutions and petals; warp, layers, clear, PNG export, continuous loop"
    ],
    "flash_problems": [
      "Funcional (nota de Kevin: ambos hicieron bien su trabajo)",
      "En modo guilloché el cierre se calcula solo con R y r, ignorando el tercer engranaje, y su frecuencia usa un factor arbitrario de 2.5 (R/r2·2.5), así que el 100% de progreso no coincide con el cierre real"
    ],
    "flash_problems_en": [
      "Functional (Kevin's note: both did their job well)",
      "In guilloché mode the closure is computed only from R and r, ignoring the third gear, and its frequency uses an arbitrary factor of 2.5 (R/r2·2.5), so 100% progress does not match the real closure"
    ],
    "code_stats": {
      "argon_lines": 1621,
      "flash_lines": 1488,
      "argon_kb": 57.5,
      "flash_kb": 45.5,
      "argon_bytes": 58851,
      "flash_bytes": 46603
    },
    "page_titles": {
      "argon": "CYCLOTRON-GUILLOCHÉ // Estudio de Trazado Paramétrico, Hipotrocoides y Epitrocoides",
      "flash": "Estudio de Trazado Paramétrico // Spirograph & Guilloché Mecánico"
    },
    "fun_angle_es": "Argon calculó exactamente cuándo se cierra la figura incluso con un tercer engranaje; en la grabación hay cierres de más de 17 mil radianes, unas 2,755 vueltas. Flash ignoró ese tercer engranaje al hacer la cuenta.",
    "fun_angle_en": "Argon computed the exact cycle closure even with a third guilloche rotor using LCM over GCD revolutions (reaching 17,310+ radians / 2,755 loops in recording). Flash ignored the third gear in its closure math.",
    "speed_ratio": "Argon 2.5x más rápido (6 min menos)",
    "speed_ratio_en": "Argon 2.5x faster (6 min less)",
    "faster_model": "argon",
    "observed_in_recording": {
      "argon": "120-121 FPS; t_max observado hasta 17,310.18 rad (2,755 vueltas, R=204 r=145 + 3er rotor)"
    },
    "demo_urls": {
      "argon": "/demos/argon/spirograph-parametrico/index.html",
      "flash": "/demos/flash/spirograph-parametrico/index.html"
    },
    "stills": {
      "argon": [
        "/stills/spirograph_parametrico_107.0s_argon.jpg",
        "/stills/spirograph_parametrico_136.0s_argon.jpg",
        "/stills/spirograph_parametrico_84.0s_argon.jpg"
      ],
      "flash": [
        "/stills/spirograph_parametrico_12.0s_flash.jpg",
        "/stills/spirograph_parametrico_24.0s_flash.jpg",
        "/stills/spirograph_parametrico_55.0s_flash.jpg"
      ]
    }
  }
];

export const EPISODE_01_CHAPTERS: ChapterItem[] = [
  {
    "time": "00:00",
    "seconds": 0,
    "title_es": "El mundo roto (Gancho)",
    "title_en": "The Broken World (Hook)",
    "level": 6
  },
  {
    "time": "00:19",
    "seconds": 19,
    "title_es": "Protocolo del experimento Zero-Shot",
    "title_en": "Zero-Shot Experiment Protocol",
    "level": null
  },
  {
    "time": "01:00",
    "seconds": 60,
    "title_es": "Mundo 1, Nivel 1: Sistema Solar Relativo",
    "title_en": "World 1, Level 1: Relative Solar System",
    "level": 1
  },
  {
    "time": "01:44",
    "seconds": 104,
    "title_es": "Mundo 1, Nivel 2: Visualizador de ADN 3D",
    "title_en": "World 1, Level 2: 3D Particle DNA Visualizer",
    "level": 2
  },
  {
    "time": "02:36",
    "seconds": 156,
    "title_es": "Mundo 2, Nivel 3: Vida Artificial (Boids)",
    "title_en": "World 2, Level 3: Artificial Life (Boids)",
    "level": 3
  },
  {
    "time": "03:17",
    "seconds": 197,
    "title_es": "Mundo 2, Nivel 4: Generador de Mazmorras",
    "title_en": "World 2, Level 4: Procedural Dungeon Generator",
    "level": 4
  },
  {
    "time": "04:04",
    "seconds": 244,
    "title_es": "Mundo 2, Nivel 5: Simulador Falling Sand",
    "title_en": "World 2, Level 5: Falling Sand Simulator",
    "level": 5
  },
  {
    "time": "04:50",
    "seconds": 290,
    "title_es": "Mundo 3, Nivel 6: Motor 3D Raycasting, el jefe",
    "title_en": "World 3, Level 6: 3D Raycasting Engine (The Boss)",
    "level": 6
  },
  {
    "time": "05:54",
    "seconds": 354,
    "title_es": "Mundo 3, Nivel 7: Sprites Espaciales 8 Bits",
    "title_en": "World 3, Level 7: 8-Bit Spaceship Sprites",
    "level": 7
  },
  {
    "time": "06:40",
    "seconds": 400,
    "title_es": "Mundo 4, Nivel 8: Reloj Analogico CSS",
    "title_en": "World 4, Level 8: Pure CSS Analog Watch",
    "level": 8
  },
  {
    "time": "07:12",
    "seconds": 432,
    "title_es": "Mundo 5, Nivel 9: Arbol Fractal con Viento",
    "title_en": "World 5, Level 9: Fractal Tree with Perlin Wind",
    "level": 9
  },
  {
    "time": "08:04",
    "seconds": 484,
    "title_es": "Mundo 5, Nivel 10: Spirograph Parametrico",
    "title_en": "World 5, Level 10: Parametric Spirograph",
    "level": 10
  },
  {
    "time": "08:56",
    "seconds": 536,
    "title_es": "Pantalla de resultados (10-0 / 55 vs 94 min)",
    "title_en": "Final Scoreboard (10-0 / 55 vs 94 min)",
    "level": null
  },
  {
    "time": "09:21",
    "seconds": 561,
    "title_es": "Veredicto del Lab",
    "title_en": "Lab Verdict & Next Benchmark",
    "level": null
  }
];

export const SCIENTIFIC_HONESTY_NOTES: string[] = [
  "'10/10 a 120 FPS' o '120 FPS' como ventaja de Argon: 120 es el tope de refresco de la pantalla de Kevin (ProMotion 120 Hz). Las apps de Flash TAMBIÉN marcan ~120 FPS (boids 120.0, raycasting 118-120, falling sand 120). Y el árbol de Argon cayó a 43-53 FPS con 18-26 mil racimos de follaje en la propia grabación; el ADN de Argon marcó 104-120 FPS. Si se menciona, decir 'fluido en mi Mac' o 'más de 100 FPS' solo donde se vio.",
  "'24.5k partículas a 120 FPS' (ADN): las 24,500 son ciertas; los FPS observados fueron 104-120 mientras se interactuaba.",
  "'Quadtree 98.8%': es un contador en vivo que depende del número de agentes; en la grabación se vio 96.8% con 2,400 boids. Flash también tiene quadtree con ~98% en su HUD, así que no diferencia.",
  "'12 elementos' como ventaja de Argon en falling sand: Flash también tiene 12 elementos en su paleta. '10x superior' es opinión de Kevin, no una medición.",
  "'Shmup 360°' en sprites: el vuelo de prueba de Argon es un shmup vertical con movimiento en 8 direcciones, sin rotación ni disparo en 360°.",
  "'Sombreado volumétrico 3D' en sprites: es sombreado 2D de pixel art (luces arriba, sombras abajo) que da sensación de volumen; no hay 3D.",
  "'Nebulosa volumétrica' en sistema solar: es una nebulosa procedural en shader sobre una esfera de fondo, no un render volumétrico real.",
  "'Mandalas de hasta 40,000 rad' presentado como visto en pantalla: el código lo permite de sobra (máximo teórico ~134,963 rad con r=179, r2=120 y R coprimo), pero en la grabación el máximo visto es 17,310.18 rad. Decir 'decenas de miles de radianes' o mostrar el 17,310.",
  "'24,400 racimos foliares' junto a '120 FPS': con esa cantidad de follaje el árbol corre a ~45-50 FPS. El contador osciló entre 18,530 y 25,984 en la grabación.",
  "Tourbillon, 3 temas y cristal de zafiro como exclusivos de Argon en el reloj: Flash también los tiene. La diferencia es estética (juicio de Kevin) y de tiempo (2 vs 4 min).",
  "Eclipses como exclusivos de Argon: Flash también tiene botones de eclipse solar y lunar. Exclusivo de Argon: slider de inclinación lunar, panel del grafo de escena, oclusión de eclipse calculada en GLSL.",
  "'Cada prueba exigió un único index.html': solo el reto 1 (y el 8, 'un solo bloque HTML') lo exigían; los demás permitían Python/Pygame. Lo cierto: ambos modelos entregaron un solo index.html en los 10.",
  "'100% autocontenido/offline': los retos 1-2 cargan Three.js de CDN y Flash carga Google Fonts en 4 entregas; se necesita internet para esos.",
  "'Argon fue más rápido en todo': Flash fue más rápido en 3 de 10 (sistema solar 7 vs 11, boids 3 vs 5, mazmorras 2 vs 12).",
  "Decir que el video muestra cuánto tardó cada modelo: las grabaciones son demos posteriores; los minutos vienen de las notas de Kevin (redondeados a minuto).",
  "Mostrar/anunciar los enlaces de demo en danpez.github.io sin comprobarlos: según memoria la cuenta danpez estuvo suspendida (28-sep) y no se verificó que las Pages funcionen.",
  "Mezclar la carpeta gummy-bears con el benchmark: no es parte de los 10 retos (ver extras.gummy_bears)."
];

export const BONUS_EXPERIMENT = {
  slug: "gummy_bears",
  dir: "gummy-bears",
  title_es: "Experimento Extra Post-Benchmark: Gummy Bears (Soft-Body SDF Physics)",
  title_en: "Post-Benchmark Bonus Lab: Gummy Bears (Soft-Body SDF Physics)",
  description_es: "Simulacion WebGL (Three.js 0.160) de ositos de gomita translucidos con fisica de cuerpo blando: malla de superficie implicita (SDF) por marching cubes, 10 puntos de masa y 9 resortes elasticos por oso, conservacion de volumen, 5 sabores y agarre interactivo. Creado en la madrugada del 14 de octubre de 2026 fuera de los 10 retos oficiales.",
  description_en: "WebGL (Three.js 0.160) translucent gummy bear simulation featuring soft-body physics: implicit surface mesh (SDF) via marching cubes, 10 mass points and 9 elastic springs per bear, volume conservation, 5 flavors, and interactive grab/stretch/throw. Created after the official 10-challenge benchmark.",
  demo_url: "/demos/argon/gummy-bears/index.html",
  lines: 1899,
  kb: 69.8
} as const;

