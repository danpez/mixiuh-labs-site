import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

/**
 * The single-page portal. This server shell computes the forum thread counts
 * and renders crawlable semantic SSR sections (<section>, <article>) for search
 * engines and AI indexers before any client-side tab interaction occurs.
 */
export default function MixiuhLabsHomePage() {
  return (
    <>
      <PortalClient forumCounts={FORUM_COUNTS} />

      <section
        aria-label="Indice Tecnico Completo de Mixiuh Labs: Benchmarks Zero-Shot EP01 a EP05, Arena de Demos, Mixiuh Pixel UI y Foro de Ingenieria"
        className="sr-only"
      >
        <h2>
          Resumen Empirico de Benchmarks Zero-Shot de IA (EP01 a EP05), Arena Interactiva, Mixiuh Pixel UI y Foro Tecnico
        </h2>

        <article>
          <h3>
            Laboratorio EP05: El Torneo de los 3 Gigantes (Gemini 4 Argon High vs Claude Opus 5.5 / 4.6 High vs GPT-6 Astra / GPT-5.4 High) en 6 Retos 3D + Ronda de Rescate (20 Demos Jugables)
          </h3>
          <p>
            Torneo zero-shot en modo HIGH comparando Gemini 4 Argon High ($1.51 USD, 25.8 min, 12,844 lineas), Claude Opus 5.5 / Claude Opus 4.6 High ($32.75 USD, 194.6 min) y GPT-6 Astra / GPT-5.4 High ($2.74 USD, 42.9 min) junto con referencias de Grok 4.20 y Qwen 3.6. GPT-6 Astra (GPT-5.4) gano 3-2-1 completando 6/6 simuladores 3D al primer intento: Impacto Planetario 3D y Problema de los 3 Cuerpos, Tunel de Viento Aerodinamico 3D, Atascos Fantasma de Trafico 3D, Figuras de Chladni y Sonido Matematico 3D, Puente Colgante con Tension Estructural 3D y Consola DJ de 32 Pads Sintetizados. En la Ronda de Rescate, corregir innerPixelRatio por devicePixelRatio desbloqueo los 2 juegos finales de Gemini 4 Argon a 60 FPS (20 simuladores 3D jugables en la Arena).
          </p>
        </article>

        <article>
          <h3>
            Laboratorio EP04: Escalera Claude 5.5 (Claude Haiku 5.5 vs Claude Sonnet 5.5 vs Claude Opus 5.5 / 4.6) — 18 Demos en Vivo
          </h3>
          <p>
            18 pruebas aisladas en Claude Code CLI a lo largo de 6 retos extremos de fisica, shaders GLSL y arquitectura de sistemas. Marcador final: Opus 3, Sonnet 2, Haiku 1 ($1.54 USD en 87 min para Haiku vs $12.22 USD en 105 min para Sonnet vs $29.94 USD en 179 min para Opus). Haiku construyo un Estudio Acido TB-303 3D a 61 FPS por $0.21 USD (24x mas barato que Opus) y Sonnet supero a Opus en el Path Tracer WebGL2 (22 vs 15 FPS) y en el emulador CHIP-8 con Pong jugable.
          </p>
        </article>

        <article>
          <h3>
            Laboratorio EP03: Gemini 4 Argon High Sin Kit vs Mixiuh Superpowers Kit en Antigravity CLI — 12 Demos en Vivo
          </h3>
          <p>
            Comparativa empirica de 12 ejecuciones aisladas en la terminal de Google Antigravity midiendo el impacto real de los Skills, banco de memoria evolutivo y Auto-Debugger MCP frente al modelo puro sin kit. El Superpowers Kit se impuso 4-2 (276 min vs 302 min; $10.85 vs $7.69 USD; 3.52M vs 2.65M tokens), destacando en la Terminal HFT Zero-GC y en la correccion automatica de geometria DOM, mientras que Argon sin kit gano en el Arcade Bullet-Hell (1,829 proyectiles) y la Red Zero-Trust 3D ($0.74 USD).
          </p>
        </article>

        <article>
          <h3>
            Laboratorio EP02: Duelo de Titanes High — Gemini 4 Argon vs Claude Opus 5.5 (Claude Opus 4.6) en 6 Motores WebGL2 y Fisica — 12 Demos en Vivo
          </h3>
          <p>
            Enfrentamiento directo zero-shot en 6 motores de alta complejidad: Tela Verlet desgarrable, Fluidos Navier-Stokes en shaders GLSL, Cuerpos Blandos XPBD, Motor Voxel 3D con iluminacion, Sintetizador FM DX7 de 6 operadores y Pinball con deteccion continua de colisiones (CCD). Gemini 4 Argon gano 4-2 en 90 minutos por $6.26 USD (3.63M tokens) frente a los 159 minutos y $16.26 USD (13.01M tokens) de Claude Opus, siendo 1.76x mas veloz y 2.60x mas economico.
          </p>
        </article>

        <article>
          <h3>
            Laboratorio EP01: Torneo Fundacional — Gemini 4 Argon vs Gemini 3.8 Flash en 10 Retos Zero-Shot y la Autopsia del Medio Pixel — 21 Demos en Vivo
          </h3>
          <p>
            10 desafios zero-shot sin recursos externos: Sistema Solar 3D, Helice de ADN, Enjambre Boids, Generador de Mazmorras, Falling Sand, Raycaster estilo Wolfenstein 3D, Editor Pixel Art, Reloj CSS, Arbol Fractal y Spirograph. Gemini 4 Argon barrerio 10-0 (55 min, 10/10 apps funcionales, 671 KB de codigo) frente a Gemini 3.8 Flash (94 min, 8/10 apps). Incluye la autopsia forense del error de medio pixel (drawStart sin Math.floor sobre Uint32Array) y el demo reparado en vivo.
          </p>
        </article>

        <article>
          <h3>
            Del Comentario al Codigo (#01 OVERFIT Studio 3D y #02 Reto ROBLOX 3D) y Radar Noticias IA #01 (Gemini 4 Carbon)
          </h3>
          <p>
            En Del Comentario al Codigo #01 transformamos la pregunta de @tenito03 en OVERFIT Studio 3D con 3 maniquies de algodon de 300 GSM en Blender Cycles y 10 estampados 2K. En el episodio #02 enfrentamos a GPT-6 Astra / GPT-5.4 High ($1.11 USD, 18.9 min, 61 FPS, ganador 2-1), Gemini 4 Argon High ($0.32 USD, 27.2 min) y Claude Opus 5.5 / 4.6 High ($9.91 USD, 55.1 min + Bonus reparado a 60 FPS) programando un juego tipo ROBLOX 3D completo. En Radar Noticias IA #01 analizamos las 18 evaluaciones oficiales de Google DeepMind para Gemini 4 Carbon (65.2% en Terminal-Bench 4.0, 88.2% en SEC-bench Pro, 96.2% en GraphWalks y tarifa API de $4/$20 USD).
          </p>
        </article>

        <article>
          <h3>
            Arena Interactiva (20 Demos 3D del Torneo EP05 y 88 Simuladores Totales), Libreria @mixiuh/pixel-ui v2.5.0 y Foro de Ingenieria
          </h3>
          <p>
            La Arena de Mixiuh Labs permite ejecutar en el navegador los 20 simuladores 3D de EP05 y los 88 motores totales sin modificaciones. La libreria open-source @mixiuh/pixel-ui v2.5.0 ofrece mas de 45 componentes React accesibles, estacion CRT 3D interactiva, cartuchos y disquetes 3.5 pulgadas, iconos pixel-art 16x16, graficas de telemetria y sintetizador WebAudio 8-bit gratis para uso comercial con atribucion a labs.mixiuh.online. El Foro Tecnico reune las autopsias de codigo linea por linea, los 35 prompts originales integros y el glosario de ingenieria en lenguaje claro.
          </p>
        </article>

        <nav aria-label="Rutas Directas de Secciones de Mixiuh Labs">
          <ul>
            <li><a href="/benchmarks">Benchmarks Zero-Shot de IA (EP01 a EP05)</a></li>
            <li><a href="/arena">Arena de Demos 3D Jugables en Vivo</a></li>
            <li><a href="/pixel-ui">Mixiuh Pixel UI v2.5.0 — Libreria React Open-Source</a></li>
            <li><a href="/foro">Foro Tecnico de Ingenieria y Autopsias de Codigo</a></li>
            <li><a href="/noticias">Radar Noticias IA #01: Gemini 4 Carbon</a></li>
          </ul>
        </nav>
      </section>
    </>
  );
}
