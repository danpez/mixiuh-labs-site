import type { Metadata } from "next";
import { Inter, Poppins, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://labs.mixiuh.online"),
  title:
    "Mixiuh Labs | Gemini 4 Argon vs Claude Opus 5.5 · Foro y Benchmarks Zero-Shot",
  description:
    "Aqui no se opina: se prueba. Laboratorio interactivo y foro tecnico de Mixiuh Labs. Episodio 02: Gemini 4 Argon vs. Claude Opus 5.5 (4-2, $6.26 vs $16.26 USD, 12 motores en vivo) y Episodio 01: Argon vs. 3.8 Flash (10-0, 20 demos).",
  keywords: [
    "Mixiuh Labs",
    "Gemini 4 Argon",
    "Claude Opus 5.5",
    "Gemini 3.8 Flash",
    "Zero-Shot Coding Benchmark",
    "Antigravity",
    "Foro IA",
    "Voicefy",
    "Reelfy",
    "Mixiuh",
  ],
  authors: [{ name: "Kevin Gonzalez", url: "https://mixiuh.online" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title:
      "Mixiuh Labs | Gemini 4 Argon vs. Claude Opus 5.5 (6 Retos Extremos y la Factura Real)",
    description:
      "Aqui no se opina: se prueba. Juega las 32 simulaciones zero-shot en tu navegador (EP02 Argon vs Opus 5.5 + EP01 Argon vs Flash), audita la factura real de tokens ($6.26 vs $16.26 USD) y participa en el foro de ingenieria.",
    url: "https://labs.mixiuh.online",
    siteName: "Mixiuh Labs",
    images: [
      {
        url: "/brand/thumbs/ep02_x-card_1200x675.png",
        width: 1200,
        height: 675,
        alt: "Mixiuh Labs EP02 - Gemini 4 Argon vs Claude Opus 5.5",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Mixiuh Labs | Gemini 4 Argon vs. Claude Opus 5.5 (4-2 · $6.26 vs $16.26 USD)",
    description:
      "Aqui no se opina: se prueba. 6 retos extremos zero-shot, 32 demos jugables en vivo, telemetria de tokens y foro de ingenieria.",
    images: ["/brand/thumbs/ep02_x-card_1200x675.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen bg-[#060B14] text-[#F5F7FA] antialiased selection:bg-[#22A2DD]/30 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
