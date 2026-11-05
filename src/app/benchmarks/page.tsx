import type { Metadata } from "next";
import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

export const metadata: Metadata = {
  title: "Benchmarks Zero-Shot de IA (EP01 a EP05): Gemini 4 Argon vs Claude Opus 5.5 vs GPT-6 Astra",
  description:
    "Dossiers empiricos de benchmarks zero-shot de programacion con telemetria real de tokens, costos en USD, tiempos de ejecucion y FPS: Gemini 4 Argon High, Claude Opus 5.5 (Opus 4.6), Claude Sonnet 5.5, Claude Haiku 5.5, GPT-6 Astra (GPT-5.4) y Mixiuh Superpowers Kit.",
  alternates: {
    canonical: "https://labs.mixiuh.online/benchmarks",
  },
  openGraph: {
    title: "Benchmarks Zero-Shot de IA (EP01 a EP05) | Mixiuh Labs",
    description:
      "Tablas comparativas verificables, costos de tokens y resultados de los 5 episodios de laboratorio zero-shot en Mixiuh Labs.",
    url: "https://labs.mixiuh.online/benchmarks",
  },
};

export default function BenchmarksPage() {
  return (
    <>
      <PortalClient forumCounts={FORUM_COUNTS} initialView="dossiers" />
      <section className="sr-only" aria-label="Dossier Completo de Benchmarks Zero-Shot de Mixiuh Labs">
        <h1>Benchmarks Zero-Shot de IA en Mixiuh Labs (EP01 a EP05)</h1>
        <p>
          Evaluaciones reproducibles de modelos de frontera programando motores 3D WebGL2, simuladores de fisica, shaders GLSL y consolas de audio WebAudio desde un unico prompt sin edicion manual.
        </p>
        <ul>
          <li>EP05 Torneo de los 3 Gigantes: GPT-6 Astra / GPT-5.4 High ($2.74 USD, 42.9 min, 6/6) vs Gemini 4 Argon High ($1.51 USD, 25.8 min) vs Claude Opus 5.5 / 4.6 High ($32.75 USD, 194.6 min).</li>
          <li>EP04 Escalera Claude 5.5: Haiku 5.5 ($1.54 USD, 87 min) vs Sonnet 5.5 ($12.22 USD, 105 min) vs Opus 5.5 ($29.94 USD, 179 min).</li>
          <li>EP03 Antigravity CLI: Mixiuh Superpowers Kit (4 victorias, $10.85 USD) vs Gemini 4 Argon High sin kit (2 victorias, $7.69 USD).</li>
          <li>EP02 Duelo de Titanes High: Gemini 4 Argon (4-2, 90 min, $6.26 USD) vs Claude Opus 5.5 (159 min, $16.26 USD).</li>
          <li>EP01 Torneo Fundacional: Gemini 4 Argon (10-0, 55 min) vs Gemini 3.8 Flash (94 min).</li>
        </ul>
      </section>
    </>
  );
}
