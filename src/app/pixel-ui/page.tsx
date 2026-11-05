import type { Metadata } from "next";
import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

export const metadata: Metadata = {
  title: "Mixiuh Pixel UI v2.5.0 — Libreria React Open-Source de Componentes Pixel-Art y CRT 3D",
  description:
    "Descarga gratis @mixiuh/pixel-ui v2.5.0: mas de 45 componentes React accesibles, estacion CRT 3D interactiva, cartuchos retro, disquetes de 3.5 pulgadas, iconos pixel-art 16x16, telemetria y sintetizador WebAudio 8-bit.",
  alternates: {
    canonical: "https://labs.mixiuh.online/pixel-ui",
  },
  openGraph: {
    title: "Mixiuh Pixel UI v2.5.0 | Libreria React Pixel-Art y CRT 3D",
    description:
      "Sistema de diseno Neo-Brutalista Pixel-Art con mas de 45 componentes React, estacion CRT 3D y audio 8-bit.",
    url: "https://labs.mixiuh.online/pixel-ui",
  },
};

export default function PixelUiPage() {
  return (
    <>
      <PortalClient forumCounts={FORUM_COUNTS} initialView="pixelui" />
      <section className="sr-only" aria-label="Documentacion y Descarga de Mixiuh Pixel UI">
        <h1>Mixiuh Pixel UI v2.5.0 (@mixiuh/pixel-ui)</h1>
        <p>
          Libreria de interfaz neo-brutalista pixel-art en React y Tailwind CSS con mas de 45 componentes, soporte bilingue (ES/EN), accesibilidad por teclado, estacion de trabajo CRT 3D, selectores de disquete y cartucho, y motor de sonido WebAudio 8-bit.
        </p>
      </section>
    </>
  );
}
