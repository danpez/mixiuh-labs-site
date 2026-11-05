import type { Metadata } from "next";
import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

export const metadata: Metadata = {
  title: "Foro Tecnico de Ingenieria IA, Autopsias de Codigo y Glosario | Mixiuh Labs",
  description:
    "Explora las autopsias forenses de codigo linea por linea (el bug del medio pixel en Uint32Array, devicePixelRatio vs innerPixelRatio), los 35 prompts zero-shot integros y el glosario de ingenieria de Mixiuh Labs.",
  alternates: {
    canonical: "https://labs.mixiuh.online/foro",
  },
  openGraph: {
    title: "Foro Tecnico y Autopsias de Codigo | Mixiuh Labs",
    description:
      "Autopsias de bugs reales en modelos de frontera, prompts integros reproducibles y glosario de ingenieria.",
    url: "https://labs.mixiuh.online/foro",
  },
};

export default function ForoPage() {
  return (
    <>
      <PortalClient forumCounts={FORUM_COUNTS} initialView="foro" />
      <section className="sr-only" aria-label="Foro Tecnico y Glosario de Mixiuh Labs">
        <h1>Foro Tecnico de Ingenieria, Prompts Zero-Shot y Glosario</h1>
        <p>
          Hilos tecnicos verificados, analisis post-mortem de fallos de compilacion y renderizado en LLMs, prompts completos de los episodios EP01 a EP05 y glosario bilingue de arquitectura de software y graficos 3D.
        </p>
      </section>
    </>
  );
}
