import type { Metadata } from "next";
import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

export const metadata: Metadata = {
  title: "Arena de Demos 3D y Simuladores Jugables en Vivo (88 Motores Zero-Shot)",
  description:
    "Ejecuta en tu navegador los 20 simuladores 3D del Torneo EP05 y los 88 motores WebGL2, fisica Verlet/XPBD, Navier-Stokes, sintetizadores FM/TB-303 y juegos generados zero-shot por Gemini 4 Argon, Claude Opus 5.5 y GPT-6 Astra.",
  alternates: {
    canonical: "https://labs.mixiuh.online/arena",
  },
  openGraph: {
    title: "Arena de Demos Jugables en Vivo | Mixiuh Labs",
    description:
      "88 simuladores interactivos 3D y motores WebGL2 generados zero-shot listos para probar en el navegador.",
    url: "https://labs.mixiuh.online/arena",
  },
};

export default function ArenaPage() {
  return (
    <>
      <PortalClient forumCounts={FORUM_COUNTS} initialView="arena" />
      <section className="sr-only" aria-label="Catalogo de la Arena de Demos de Mixiuh Labs">
        <h1>Arena Interactiva de Demos Zero-Shot (20 Simuladores 3D EP05 y 88 Demos Totales)</h1>
        <p>
          Prueba directamente en el navegador cada ejecutable HTML/WebGL2 generado sin intervencion humana durante los torneos de Mixiuh Labs: Impacto Planetario 3D, Tunel de Viento Aerodinamico, Atascos Fantasma de Trafico, Figuras de Chladni, Puente Colgante con Tension Estructural, Consola DJ de 32 Pads, Path Tracer WebGL2, Emulador CHIP-8 y mas.
        </p>
      </section>
    </>
  );
}
