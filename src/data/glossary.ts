/**
 * Glossary terms and official channel links. Kept apart from labsData.ts (the
 * EP01 dataset) so the home page can use them without shipping episode data;
 * labsData.ts re-exports them for older importers.
 */

export interface GlossaryItem {
  term: string;
  /** English display name, set only where `term` is not already English. Keep `term` as the key/id. */
  term_en?: string;
  plain_es: string;
  plain_en?: string;
}

export const LAB_GLOSSARY: GlossaryItem[] = [
  {
    "term": "zero-shot",
    "plain_es": "Pedirle algo a la IA una sola vez, sin ejemplos ni segundas oportunidades para corregir.",
    "plain_en": "Asking the AI for something just once, with no examples and no second chances to fix it."
  },
  {
    "term": "benchmark",
    "plain_es": "Una prueba estandarizada para comparar quién lo hace mejor bajo las mismas reglas.",
    "plain_en": "A standardized test to compare who does better under the same rules."
  },
  {
    "term": "Antigravity",
    "plain_es": "El entorno de programación con agentes de Google donde se corrieron ambos modelos.",
    "plain_en": "Google's agent-based coding environment where both models were run."
  },
  {
    "term": "(High)",
    "plain_es": "La variante del modelo que piensa más antes de responder.",
    "plain_en": "The model variant that thinks more before answering."
  },
  {
    "term": "index.html autocontenido",
    "term_en": "self-contained index.html",
    "plain_es": "Todo el programa en un solo archivo que abres en el navegador, sin instalar nada.",
    "plain_en": "The whole program in a single file that you open in the browser, with nothing to install."
  },
  {
    "term": "procedural",
    "plain_es": "Generado con matemáticas y código en lugar de dibujado a mano o cargado de una imagen.",
    "plain_en": "Generated with math and code instead of being drawn by hand or loaded from an image."
  },
  {
    "term": "WebGL",
    "plain_es": "La tecnología del navegador para dibujar gráficos 3D usando la tarjeta de video.",
    "plain_en": "The browser technology for drawing 3D graphics with the graphics card."
  },
  {
    "term": "Three.js",
    "plain_es": "Una librería muy popular que facilita hacer escenas 3D en la web.",
    "plain_en": "A very popular library that makes it easy to build 3D scenes on the web."
  },
  {
    "term": "shader / GLSL",
    "plain_es": "Pequeños programas que corren en la tarjeta de video y deciden el color de cada píxel.",
    "plain_en": "Small programs that run on the graphics card and decide the color of each pixel."
  },
  {
    "term": "bloom",
    "plain_es": "Efecto de brillo que hace que las luces intensas se 'desborden' como en una cámara real.",
    "plain_en": "A glow effect that makes bright lights 'bleed' over, like in a real camera."
  },
  {
    "term": "ruido Perlin / Simplex / fBM",
    "term_en": "Perlin / Simplex noise / fBM",
    "plain_es": "Un azar suave y continuo que imita cosas naturales como nubes, terreno o viento.",
    "plain_en": "Smooth, continuous randomness that imitates natural things like clouds, terrain or wind."
  },
  {
    "term": "grafo de escena (jerarquía padre-hijo)",
    "term_en": "scene graph (parent-child hierarchy)",
    "plain_es": "Objetos que heredan el movimiento de su 'padre': la Luna sigue a la Tierra y la Tierra al Sol.",
    "plain_en": "Objects that inherit the motion of their 'parent': the Moon follows the Earth and the Earth follows the Sun."
  },
  {
    "term": "sicigia",
    "term_en": "syzygy",
    "plain_es": "Cuando Sol, Tierra y Luna quedan alineados; es lo que provoca los eclipses.",
    "plain_en": "When the Sun, Earth and Moon line up; it is what causes eclipses."
  },
  {
    "term": "Ley de Hooke",
    "term_en": "Hooke's Law",
    "plain_es": "La física de los resortes: entre más los estiras, más fuerte regresan.",
    "plain_en": "The physics of springs: the more you stretch them, the harder they pull back."
  },
  {
    "term": "boids",
    "plain_es": "Simulación de parvadas donde cada 'pájaro' sigue tres reglas simples y surge un comportamiento colectivo.",
    "plain_en": "A flocking simulation where each 'bird' follows three simple rules and a collective behavior emerges."
  },
  {
    "term": "quadtree",
    "plain_es": "Dividir el espacio en cuadros cada vez más pequeños para que cada agente solo revise a sus vecinos cercanos.",
    "plain_en": "Splitting space into smaller and smaller squares so each agent only checks its nearby neighbors."
  },
  {
    "term": "O(N²)",
    "plain_es": "Comparar a todos contra todos: con miles de agentes son millones de cálculos por cuadro.",
    "plain_en": "Comparing everyone against everyone: with thousands of agents that means millions of calculations per frame."
  },
  {
    "term": "roguelike",
    "plain_es": "Género de videojuego de mazmorras generadas al azar que cambian en cada partida.",
    "plain_en": "A video game genre of randomly generated dungeons that change every run."
  },
  {
    "term": "BSP (partición binaria del espacio)",
    "term_en": "BSP (binary space partitioning)",
    "plain_es": "Cortar el mapa en mitades una y otra vez para acomodar cuartos sin que se encimen.",
    "plain_en": "Cutting the map in half again and again to fit rooms without them overlapping."
  },
  {
    "term": "árbol de expansión mínima (MST / Kruskal)",
    "term_en": "minimum spanning tree (MST / Kruskal)",
    "plain_es": "La forma más corta de conectar todos los cuartos sin dejar ninguno aislado.",
    "plain_en": "The shortest way to connect every room without leaving any of them isolated."
  },
  {
    "term": "A* (A estrella)",
    "term_en": "A* (A-star)",
    "plain_es": "Algoritmo que encuentra el camino más corto entre dos puntos, como el GPS de un videojuego.",
    "plain_en": "An algorithm that finds the shortest path between two points, like a video game's GPS."
  },
  {
    "term": "Dijkstra",
    "plain_es": "Algoritmo que calcula la distancia desde un punto a todos los demás; se ve como mapa de calor.",
    "plain_en": "An algorithm that computes the distance from one point to all the others; it shows up as a heat map."
  },
  {
    "term": "fog of war / campo de visión",
    "term_en": "fog of war / field of view",
    "plain_es": "Solo ves lo que tu personaje alcanza a ver; lo demás queda en sombra.",
    "plain_en": "You only see what your character can see; everything else stays in shadow."
  },
  {
    "term": "autómata celular",
    "term_en": "cellular automaton",
    "plain_es": "Una cuadrícula donde cada píxel decide qué hacer viendo solo a sus vecinos.",
    "plain_en": "A grid where each pixel decides what to do by looking only at its neighbors."
  },
  {
    "term": "falling sand",
    "plain_es": "Juegos tipo arenero donde cada píxel es arena, agua o fuego y se comportan con física.",
    "plain_en": "Sandbox-style games where each pixel is sand, water or fire and they all behave with physics."
  },
  {
    "term": "raycasting",
    "plain_es": "Lanzar un rayo por cada columna de la pantalla para fingir un mundo 3D, como en Wolfenstein 3D de 1992.",
    "plain_en": "Casting one ray per screen column to fake a 3D world, as in Wolfenstein 3D from 1992."
  },
  {
    "term": "DDA",
    "plain_es": "Forma eficiente de avanzar un rayo casilla por casilla en una cuadrícula sin saltarse paredes.",
    "plain_en": "An efficient way to step a ray cell by cell across a grid without skipping walls."
  },
  {
    "term": "efecto ojo de pez",
    "term_en": "fisheye effect",
    "plain_es": "Distorsión que curva las paredes rectas si no corriges la distancia del rayo.",
    "plain_en": "A distortion that bends straight walls if you don't correct the ray's distance."
  },
  {
    "term": "z-buffer",
    "plain_es": "Una lista de distancias que decide qué objeto queda delante y cuál se tapa.",
    "plain_en": "A list of distances that decides which object stays in front and which one gets hidden."
  },
  {
    "term": "sprite / pixel art",
    "plain_es": "Dibujos hechos píxel por píxel, como los personajes de las consolas de 8 bits.",
    "plain_en": "Drawings made pixel by pixel, like the characters on 8-bit consoles."
  },
  {
    "term": "simetría bilateral",
    "term_en": "bilateral symmetry",
    "plain_es": "Generar solo la mitad del dibujo y reflejarla como espejo.",
    "plain_en": "Generating only half of the drawing and mirroring it."
  },
  {
    "term": "hue shifting",
    "plain_es": "Truco de artistas: las sombras tiran a azul o violeta y las luces a amarillo, para colores más vivos.",
    "plain_en": "An artists' trick: shadows lean toward blue or violet and highlights toward yellow, for more vivid colors."
  },
  {
    "term": "shmup",
    "plain_es": "Juego de naves de disparos, de 'shoot em up'.",
    "plain_en": "A spaceship shooting game; short for shoot 'em up."
  },
  {
    "term": "neumorfismo",
    "term_en": "neumorphism",
    "plain_es": "Estilo de diseño con sombras suaves que hace que los botones parezcan moldeados en plástico.",
    "plain_en": "A design style with soft shadows that makes buttons look molded out of plastic."
  },
  {
    "term": "tourbillon",
    "plain_es": "Mecanismo giratorio de relojes de lujo que compensa la gravedad; aquí animado solo con CSS.",
    "plain_en": "A rotating mechanism in luxury watches that compensates for gravity; here it is animated with CSS alone."
  },
  {
    "term": "CSS @keyframes",
    "plain_es": "Animaciones que el navegador ejecuta por sí solo, sin JavaScript.",
    "plain_en": "Animations that the browser runs on its own, without JavaScript."
  },
  {
    "term": "L-system",
    "plain_es": "Reglas de reescritura que generan estructuras tipo planta, rama por rama.",
    "plain_en": "Rewriting rules that generate plant-like structures, branch by branch."
  },
  {
    "term": "fractal",
    "plain_es": "Una forma que se repite dentro de sí misma a distintas escalas, como las ramas de un árbol.",
    "plain_en": "A shape that repeats inside itself at different scales, like the branches of a tree."
  },
  {
    "term": "cinemática directa (FK)",
    "term_en": "forward kinematics (FK)",
    "plain_es": "Cada rama se mueve junto con su rama padre, como los huesos de un brazo.",
    "plain_en": "Each branch moves along with its parent branch, like the bones of an arm."
  },
  {
    "term": "hipotrocoide / epitrocoide",
    "term_en": "hypotrochoid / epitrochoid",
    "plain_es": "Las curvas que salen al rodar una rueda por dentro o por fuera de otra: el espirógrafo de toda la vida.",
    "plain_en": "The curves you get by rolling one wheel inside or outside another: the classic spirograph."
  },
  {
    "term": "guilloché",
    "plain_es": "Grabado de líneas entrelazadas como el de los billetes y pasaportes.",
    "plain_en": "An engraving of interlaced lines like the one on banknotes and passports."
  },
  {
    "term": "MCD (algoritmo de Euclides)",
    "term_en": "GCD (Euclidean algorithm)",
    "plain_es": "El máximo común divisor; aquí dice cuántas vueltas faltan para cerrar el dibujo.",
    "plain_en": "The greatest common divisor; here it tells how many turns it takes to close the drawing."
  },
  {
    "term": "MCM",
    "term_en": "LCM",
    "plain_es": "Mínimo común múltiplo; con un tercer engranaje dice cuándo coinciden todas las vueltas.",
    "plain_en": "The least common multiple; with a third gear it tells when all the turns line up."
  },
  {
    "term": "radianes",
    "term_en": "radians",
    "plain_es": "Otra forma de medir ángulos: una vuelta completa son unos 6.28 radianes.",
    "plain_en": "Another way to measure angles: one full turn is about 6.28 radians."
  },
  {
    "term": "FPS",
    "plain_es": "Cuadros por segundo: cuántas veces se redibuja la imagen cada segundo; más es más fluido.",
    "plain_en": "Frames per second: how many times the image is redrawn each second; more means smoother."
  },
  {
    "term": "Canvas 2D",
    "plain_es": "Un lienzo del navegador donde el código pinta píxeles y figuras.",
    "plain_en": "A browser canvas where code paints pixels and shapes."
  },
  {
    "term": "requestAnimationFrame",
    "plain_es": "La forma en que el navegador avisa 'ya puedes dibujar el siguiente cuadro'.",
    "plain_en": "The browser's way of saying 'you can draw the next frame now'."
  },
  {
    "term": "Integración de Verlet",
    "term_en": "Verlet Integration",
    "plain_es": "Método físico donde la velocidad sale sola de restar la posición actual menos la anterior; ideal para telas y cuerdas estables.",
    "plain_en": "A physics method where velocity falls out on its own as the current position minus the previous one; ideal for stable cloth and ropes."
  },
  {
    "term": "Relajación de Gauss-Seidel",
    "term_en": "Gauss-Seidel Relaxation",
    "plain_es": "Repasar varias veces cada hilo de la tela en un mismo cuadro para que no se estire como chicle.",
    "plain_en": "Going over each thread of the cloth several times in the same frame so it doesn't stretch like chewing gum."
  },
  {
    "term": "Ecuaciones de Navier-Stokes",
    "term_en": "Navier-Stokes Equations",
    "plain_es": "Las ecuaciones matemáticas que describen cómo se mueven los líquidos, el humo y el aire.",
    "plain_en": "The mathematical equations that describe how liquids, smoke and air move."
  },
  {
    "term": "Confinamiento de Vorticidad (Curl)",
    "term_en": "Vorticity Confinement (Curl)",
    "plain_es": "Truco gráfico que reinyecta pequeños remolinos para que el humo no se vea borroso.",
    "plain_en": "A graphics trick that re-injects small swirls so the smoke doesn't look blurry."
  },
  {
    "term": "Solver de Jacobi (Proyección de Presión)",
    "term_en": "Jacobi Solver (Pressure Projection)",
    "plain_es": "Iteraciones en la GPU que obligan al fluido a ser incompresible para que no desaparezca ni se acumule.",
    "plain_en": "GPU iterations that force the fluid to be incompressible so it neither disappears nor piles up."
  },
  {
    "term": "FBO Ping-Pong (Framebuffer Objects)",
    "plain_es": "Dos texturas en la tarjeta gráfica que se turnan: una lee el estado anterior mientras la otra escribe el nuevo.",
    "plain_en": "Two textures on the graphics card that take turns: the previous state is read from one while the new one is written to the other."
  },
  {
    "term": "Calle de Vórtices de Kármán",
    "term_en": "Kármán Vortex Street",
    "plain_es": "La fila de remolinos alternados que se forma detrás de un cilindro cuando choca una corriente rápida.",
    "plain_en": "The row of alternating swirls that forms behind a cylinder when a fast current hits it."
  },
  {
    "term": "XPBD (Extended Position-Based Dynamics)",
    "plain_es": "Evolución moderna de la física por posiciones que permite calibrar rigidez real en cuerpos blandos sin que exploten.",
    "plain_en": "A modern evolution of position-based physics that lets you tune real stiffness in soft bodies without them blowing up."
  },
  {
    "term": "Efecto Poisson (Conservación de Volumen)",
    "term_en": "Poisson Effect (Volume Conservation)",
    "plain_es": "Cuando aplastas una gomita hacia abajo, se ensancha hacia los lados para mantener el mismo volumen interno.",
    "plain_en": "When you squash a gummy candy downward, it widens to the sides to keep the same internal volume."
  },
  {
    "term": "Face Culling / Greedy Meshing",
    "plain_es": "No dibujar las caras ocultas entre dos bloques pegados tipo Minecraft para ahorrar millones de triángulos.",
    "plain_en": "Not drawing the hidden faces between two touching Minecraft-style blocks, to save millions of triangles."
  },
  {
    "term": "Oclusión Ambiental (AO) por Vértice",
    "term_en": "Per-Vertex Ambient Occlusion (AO)",
    "plain_es": "Oscurecer las esquinas donde se juntan tres bloques para dar profundidad realista sin usar luces costosas.",
    "plain_en": "Darkening the corners where three blocks meet to give realistic depth without using expensive lights."
  },
  {
    "term": "Síntesis FM (Modulación de Frecuencia)",
    "term_en": "FM Synthesis (Frequency Modulation)",
    "plain_es": "Un oscilador (modulador) agita la frecuencia de otro (portador) para crear timbres metálicos, bajos y campanas como el Yamaha DX7.",
    "plain_en": "One oscillator (the modulator) shakes the frequency of another (the carrier) to create metallic timbres, basses and bells like the Yamaha DX7."
  },
  {
    "term": "Transformada Rápida de Fourier (FFT)",
    "term_en": "Fast Fourier Transform (FFT)",
    "plain_es": "Algoritmo que descompone el sonido en vivo en sus frecuencias graves, medias y agudas para dibujar el espectro.",
    "plain_en": "An algorithm that breaks live sound down into its low, mid and high frequencies to draw the spectrum."
  },
  {
    "term": "Goniómetro X-Y (Curvas de Lissajous)",
    "term_en": "X-Y Goniometer (Lissajous Curves)",
    "plain_es": "Cruzar el canal izquierdo contra el derecho en un osciloscopio para medir la amplitud estéreo y la fase.",
    "plain_en": "Plotting the left channel against the right one on an oscilloscope to measure stereo amplitude and phase."
  },
  {
    "term": "Detección Continua de Colisiones (CCD)",
    "term_en": "Continuous Collision Detection (CCD)",
    "plain_es": "Calcular el choque a lo largo de toda la trayectoria entre un cuadro y otro para que una bola rápida jamás atraviese una pared.",
    "plain_en": "Computing the collision along the whole path between one frame and the next so a fast ball never passes through a wall."
  },
  {
    "term": "Prompt Caching (Cache Read / Write)",
    "plain_es": "Memoria temporal del proveedor de IA para reutilizar el contexto de pasos previos a menor costo por millón de tokens.",
    "plain_en": "The AI provider's temporary memory for reusing the context of previous steps at a lower cost per million tokens."
  }
];

export const YOUTUBE_LINKS = {
  channel_es: "https://www.youtube.com/@MixiuhLabsES",
  channel_en: "https://www.youtube.com/@MixiuhLabsEN",
  ep01_es: "https://youtu.be/BE8g1jnP-2M",
  ep01_en: "https://youtu.be/S4v6v9r5mVA",
  ep02_es: "https://youtu.be/x2lHrnOII90",
  ep02_en: "https://youtu.be/3ryguBs7n40",
  cc01_es: "https://youtu.be/5jhEdc6UkPc",
  ep03_es: "https://youtu.be/z0YKF1j_Cf0",
  ep03_en: "https://youtu.be/EncZiYwiR9U",
  ep04_es: "https://youtu.be/YlMva-urwNM",
  ep04_en: "https://youtu.be/7r5ctAamhL0",
  carbon_es: "https://youtu.be/h_wVhlSfl64",
  carbon_en: "https://youtu.be/1PspBBoP318",
  carbon_short_es: "https://www.youtube.com/shorts/MY_86o2GqEs",
  carbon_short_en: "https://www.youtube.com/shorts/tBHRMWmC_Vk",
  instagram: "https://www.instagram.com/labs.mixiuh",
  tiktok: "https://www.tiktok.com/@mixiuhlabs",
  x: "https://x.com/MixiuhLabs",
  twitter: "https://x.com/MixiuhLabs",
} as const;
