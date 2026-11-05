import type { Metadata } from "next";
import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

export const metadata: Metadata = {
  title: "Radar Noticias IA #01: Gemini 4 Carbon y Benchmarks Oficiales de DeepMind",
  description:
    "Analisis tecnico de las 18 evaluaciones oficiales de Google DeepMind para Gemini 4 Carbon: 65.2% en Terminal-Bench 4.0, 88.2% en SEC-bench Pro, 96.2% en GraphWalks y comparativa de precios API frente a Claude Opus 5.5 y Gemini 4 Argon.",
  alternates: {
    canonical: "https://labs.mixiuh.online/noticias",
  },
  openGraph: {
    title: "Radar Noticias IA #01: Gemini 4 Carbon | Mixiuh Labs",
    description:
      "Desglose de las 18 evaluaciones oficiales de Gemini 4 Carbon frente a Claude Opus 5.5 y Gemini 4 Argon.",
    url: "https://labs.mixiuh.online/noticias",
  },
};

export default function NoticiasPage() {
  return (
    <>
      <PortalClient forumCounts={FORUM_COUNTS} initialView="noticias" />
      <section className="sr-only" aria-label="Radar de Noticias IA de Mixiuh Labs">
        <h1>Radar Noticias IA #01: Gemini 4 Carbon frente a Claude Opus 5.5 y Gemini 4 Argon</h1>
        <p>
          Cobertura tecnica con las metricas oficiales de Terminal-Bench 4.0 (65.2%), SEC-bench Pro (88.2%), AA Index v5.0, CWE-bench, ExploitGym y costos por millon de tokens.
        </p>
      </section>
    </>
  );
}
