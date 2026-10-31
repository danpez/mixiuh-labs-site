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
      sameAs: [
        "https://x.com/MixiuhLabs",
        "https://www.youtube.com/@MixiuhLabsES",
        "https://www.youtube.com/@MixiuhLabsEN",
        "https://mixiuh.online",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://labs.mixiuh.online/#website",
      url: "https://labs.mixiuh.online",
      name: "Mixiuh Labs",
      inLanguage: ["es-MX", "en"],
      publisher: { "@id": "https://labs.mixiuh.online/#org" },
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
