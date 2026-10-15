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
  title: "Mixiuh Labs | Foro de Ingenieria, Benchmarks de IA y Demos Zero-Shot",
  description:
    "Aqui no se opina: se prueba. Laboratorio interactivo y foro tecnico de Mixiuh Labs. Episodio 01: Gemini 4 Argon (High) vs. Gemini 3.8 Flash (High) — 10 retos extremos zero-shot, 20 demos jugables en vivo, prompts integros y autopsias de codigo.",
  keywords: [
    "Mixiuh Labs",
    "Gemini 4 Argon",
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
    title: "Mixiuh Labs | Gemini 4 Argon vs. 3.8 Flash (10-0 Zero-Shot Benchmark)",
    description:
      "Aqui no se opina: se prueba. Juega las 20 simulaciones zero-shot en tu navegador, inspecciona el bug del medio pixel en Uint32Array, copia los 10 prompts y participa en el foro de Mixiuh Labs.",
    url: "https://labs.mixiuh.online",
    siteName: "Mixiuh Labs",
    images: [
      {
        url: "/brand/thumbs/ep01_x-card_1200x675.png",
        width: 1200,
        height: 675,
        alt: "Mixiuh Labs EP01 - Gemini 4 Argon vs 3.8 Flash",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mixiuh Labs | Gemini 4 Argon vs. 3.8 Flash (10-0 Zero-Shot Benchmark)",
    description:
      "Aqui no se opina: se prueba. 10 retos zero-shot, 20 demos jugables en vivo, prompts integros y foro de ingenieria.",
    images: ["/brand/thumbs/ep01_x-card_1200x675.png"],
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
