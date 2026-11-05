import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Space_Mono, Silkscreen, Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Only a late fallback in the pixel-ui heading stack (after Pixelify Sans and its
// Arial-based metric fallback), so it is not preloaded: browsers that never fall
// back to it no longer download its four weights on first visit.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixelify",
  display: "swap",
});

// Pixelify Sans draws 5 like S, 0 like O and ( like {, so headings read
// "Opus S.S". Their digits and $ % ( ) . come from Jersey 10 instead (OFL,
// fonts/Jersey10-OFL.txt; Google Fonts subset of just those characters),
// scaled to Pixelify's cap height. It has one weight: declared for all of them,
// so bold headings never get a smeared synthetic bold. globals.css puts it first
// in the heading stack.
const headingDigits = localFont({
  src: "./fonts/Jersey10-digits.woff2",
  weight: "100 900",
  variable: "--font-heading-digits",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+0024-0025, U+0028-0029, U+002E, U+0030-0039" },
    { prop: "size-adjust", value: "121%" },
  ],
});

// Runs before first paint. The hash view (#foro...) and a saved English
// preference only apply after hydration, so until then #contenido would show
// the Spanish home: these attributes hide it (globals.css) and PortalClient
// removes them once both apply. The timeout reveals it if the app never boots.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var h=location.hash;if(h&&h!=="#"&&h!=="#top")d.setAttribute("data-boot-view","");if(localStorage.getItem("mixiuh_lang")==="en")d.setAttribute("data-boot-lang","en")}catch(e){}setTimeout(function(){d.removeAttribute("data-boot-view");d.removeAttribute("data-boot-lang")},3000)})()`;

export const metadata: Metadata = {
  metadataBase: new URL("https://labs.mixiuh.online"),
  title: {
    default:
      "Mixiuh Labs | Benchmarks Zero-Shot de IA, Arena de Demos y Foro Tecnico",
    template: "%s | Mixiuh Labs",
  },
  description:
    "Aqui no se opina: se prueba. Laboratorio de Mixiuh Labs con benchmarks zero-shot de IA (Escalera Claude 5.5, Gemini 4 Argon vs Opus 5.5, Superpowers Kit), demos jugables en la Arena, facturas reales de tokens, Noticias IA (Gemini 4 Carbon), foro tecnico y la libreria gratuita Mixiuh Pixel UI.",
  keywords: [
    "Mixiuh Labs",
    "Claude Opus 5.5",
    "Claude Sonnet 5.5",
    "Claude Haiku 5.5",
    "Gemini 4 Argon",
    "Gemini 4 Carbon",
    "Gemini 3.8 Flash",
    "Zero-Shot Coding Benchmark",
    "Antigravity",
    "Claude Code",
    "Foro IA",
    "Mixiuh Pixel UI",
    "Pixel Art UI",
    "Mixiuh",
  ],
  authors: [{ name: "Kevin Gonzalez", url: "https://mixiuh.online" }],
  alternates: { canonical: "/" },
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
    title: "Mixiuh Labs | Aqui no se opina: se prueba",
    description:
      "Benchmarks zero-shot de IA con la factura real de tokens: juega cada demo en tu navegador (Claude 5.5, Gemini 4 Argon, Superpowers Kit), lee las autopsias del foro y descarga gratis Mixiuh Pixel UI.",
    url: "https://labs.mixiuh.online",
    siteName: "Mixiuh Labs",
    // The share image comes from src/app/opengraph-image.tsx (and twitter-image.tsx):
    // an evergreen generated card, so no episode art goes stale here.
    locale: "es_MX",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mixiuh Labs | Aqui no se opina: se prueba",
    description:
      "Benchmarks zero-shot de IA, demos jugables en vivo, telemetria de tokens, foro de ingenieria y la libreria Mixiuh Pixel UI.",
  },
};

export const viewport: Viewport = {
  themeColor: "#090B10",
  colorScheme: "dark",
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://labs.mixiuh.online/#org",
      name: "Mixiuh Labs",
      url: "https://labs.mixiuh.online",
      logo: "https://labs.mixiuh.online/icon-512.png",
      parentOrganization: {
        "@type": "Organization",
        name: "Mixiuh",
        url: "https://mixiuh.online",
      },
      sameAs: [
        "https://mixiuh.online",
        "https://holdyfy.mixiuh.online",
        "https://stockfy.mixiuh.online",
        "https://queryfy.mixiuh.online",
        "https://reelfy.mixiuh.online",
        "https://tinteca.mixiuh.online",
        "https://labs.mixiuh.online",
        "https://keruvin.store",
        "https://github.com/danpez",
        "https://apps.apple.com/mx/developer/kevin-daniel-gonzalez-lopez/id6792172872",
        "https://apps.apple.com/app/id6796437368",
        "https://apps.apple.com/app/id6792858421",
        "https://apps.apple.com/app/id6792172870",
        "https://play.google.com/store/apps/details?id=com.mixiuh.holdyfy",
        "https://play.google.com/store/apps/details?id=com.mixiuh.queryfy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://labs.mixiuh.online/#website",
      url: "https://labs.mixiuh.online",
      name: "Mixiuh Labs",
      inLanguage: ["es-MX", "en"],
      description:
        "Laboratorio empirico de Mixiuh con benchmarks zero-shot de IA, Arena de 88 motores 3D y WebGL2 jugables en vivo, telemetria real de tokens, foro de ingenieria y la libreria open-source @mixiuh/pixel-ui.",
      publisher: { "@id": "https://labs.mixiuh.online/#org" },
    },
    {
      "@type": "Dataset",
      "@id": "https://labs.mixiuh.online/#benchmarks-dataset",
      name: "Mixiuh Labs Zero-Shot LLM Coding & 3D Physics Benchmarks (EP01-EP05)",
      description:
        "Conjunto empirico de pruebas zero-shot de programacion, motores fisicos 3D WebGL2, shaders GLSL y ciberseguridad comparando tiempos de ejecucion, costos reales de API, volumen de tokens y FPS entre Gemini 4 Carbon, Gemini 4 Argon, Claude Opus 5.5 (Claude Opus 4.6), Claude Sonnet 5.5, Claude Haiku 5.5, GPT-6 Astra (GPT-5.4), Grok 4.20, Qwen 3.6 y Gemini 3.8 Flash.",
      url: "https://labs.mixiuh.online/#dossiers",
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@id": "https://labs.mixiuh.online/#org" },
      keywords: [
        "Zero-Shot LLM Benchmark",
        "Gemini 4 Carbon",
        "Gemini 4 Argon",
        "Claude Opus 5.5",
        "Claude Opus 4.6",
        "Claude Sonnet 5.5",
        "Claude Haiku 5.5",
        "GPT-6 Astra",
        "GPT-5.4",
        "Grok 4.20",
        "Qwen 3.6",
        "Gemini 3.8 Flash",
        "WebGL2 Physics Benchmark",
        "Terminal-Bench 4.0",
      ],
    },
    {
      "@type": "TechArticle",
      "@id": "https://labs.mixiuh.online/#benchmark-report",
      headline:
        "Benchmarks Zero-Shot de IA (EP01-EP05): Gemini 4 Argon vs Claude Opus 5.5 (4.6) vs GPT-6 Astra (5.4) y Especial Gemini 4 Carbon",
      description:
        "Auditoria forense de codigo zero-shot a lo largo de 5 episodios de laboratorio (EP01 a EP05), 2 retos de comunidad (OVERFIT Studio 3D y ROBLOX 3D) y el analisis de las 18 evaluaciones de Gemini 4 Carbon.",
      url: "https://labs.mixiuh.online",
      datePublished: "2026-10-16",
      dateModified: "2026-11-05",
      author: {
        "@type": "Person",
        name: "Kevin Gonzalez",
        url: "https://mixiuh.online",
      },
      publisher: { "@id": "https://labs.mixiuh.online/#org" },
      about: [
        { "@type": "Thing", name: "Gemini 4 Argon" },
        { "@type": "Thing", name: "Gemini 4 Carbon" },
        { "@type": "Thing", name: "Claude Opus 5.5" },
        { "@type": "Thing", name: "Claude Opus 4.6" },
        { "@type": "Thing", name: "GPT-6 Astra" },
        { "@type": "Thing", name: "GPT-5.4" },
        { "@type": "Thing", name: "Grok 4.20" },
        { "@type": "Thing", name: "Qwen 3.6" },
      ],
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://labs.mixiuh.online/#pixel-ui",
      name: "@mixiuh/pixel-ui",
      version: "2.5.0",
      programmingLanguage: ["TypeScript", "React", "CSS"],
      runtimePlatform: "Next.js, React 19, Browser",
      url: "https://labs.mixiuh.online/#pixel-ui",
      downloadUrl: "https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui-kit.zip",
      license: "https://creativecommons.org/licenses/by/4.0/",
      author: { "@id": "https://labs.mixiuh.online/#org" },
      description:
        "Libreria open-source de interfaz Pixel-Art, hardware 3D retro (estacion CRT y disquetes 3.5 pulgadas), mas de 45 componentes React accesibles, iconos 16x16, graficas de telemetria y sintetizador WebAudio 8-bit.",
    },
    {
      "@type": "FAQPage",
      "@id": "https://labs.mixiuh.online/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Como se auditan las pruebas zero-shot en Mixiuh Labs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cada reto se ejecuta con el mismo prompt exacto en un unico intento (zero-shot) en entornos aislados sin editar ni una linea de codigo. Publicamos el archivo index.html integro en la Arena interactiva, el tiempo cronometrado de principio a fin y la factura real de tokens de API.",
          },
        },
        {
          "@type": "Question",
          name: "¿Que episodios y modelos incluye el catalogo de benchmarks de Mixiuh Labs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Incluye 5 episodios de laboratorio (EP01: Gemini 4 Argon vs Gemini 3.8 Flash; EP02: Gemini 4 Argon vs Claude Opus 5.5/4.6; EP03: Argon High Sin Kit vs Superpowers Kit; EP04: Escalera Claude 5.5 Haiku vs Sonnet vs Opus; EP05: Torneo de los 3 Gigantes entre Gemini 4 Argon High, Claude Opus 5.5/4.6 High y GPT-6 Astra/GPT-5.4 High en 6 retos 3D mas Ronda de Rescate), 2 especiales de comunidad (CC01 OVERFIT Studio 3D y CC02 ROBLOX 3D) y el Radar Noticias IA #01 sobre Gemini 4 Carbon, junto con comparativas de referencia frente a Grok 4.20 y Qwen 3.6.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo usar la libreria @mixiuh/pixel-ui en proyectos comerciales?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si, @mixiuh/pixel-ui v2.5.0 es 100% gratuita para proyectos personales y comerciales bajo licencia CC-BY 4.0 / MIT con atribucion, requiriendo unicamente conservar el credito o enlace visible hacia labs.mixiuh.online.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${poppins.variable} ${spaceMono.variable} ${silkscreen.variable} ${pixelifySans.variable} ${headingDigits.variable}`}
      // The boot script adds its data-boot-* attributes before hydration
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#090B10] text-[#F5F2EB] antialiased selection:bg-[#FFD100] selection:text-[#090B10]">
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
