"use client";

import { useState, useEffect } from "react";
import { pixelSound } from "./sound";
import { usePixelPref } from "./storage";

export type PixelCursorStyle =
  | "cyber-arrow"
  | "amber-crt"
  | "arcade-reticle"
  | "rpg-sword"
  | "classic-os"
  | "system";

export interface CursorPresetInfo {
  id: PixelCursorStyle;
  name_es: string;
  name_en: string;
  accent: string;
}

export const PIXEL_CURSOR_PRESETS: CursorPresetInfo[] = [
  {
    id: "cyber-arrow",
    name_es: "Flecha Lab Cian",
    name_en: "Cyan Lab Arrow",
    accent: "#00E5FF",
  },
  {
    id: "amber-crt",
    name_es: "Terminal Ambar CRT",
    name_en: "Amber CRT Pointer",
    accent: "#FFD100",
  },
  {
    id: "arcade-reticle",
    name_es: "Mira Arcade",
    name_en: "Arcade Crosshair",
    accent: "#FF3355",
  },
  {
    id: "rpg-sword",
    name_es: "Espada 16-Bit",
    name_en: "16-Bit RPG Blade",
    accent: "#10B981",
  },
  {
    id: "classic-os",
    name_es: "OS Clasico 1-Bit",
    name_en: "Classic 1-Bit OS",
    accent: "#F5F2EB",
  },
  {
    id: "system",
    name_es: "Cursor Nativo",
    name_en: "System Default",
    accent: "#94A3B8",
  },
];

function buildCursorDataUri(svgBody: string, hotX = 2, hotY = 2): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" shape-rendering="crispEdges">${svgBody}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${hotX} ${hotY}, auto`;
}

function buildPointerDataUri(svgBody: string, hotX = 6, hotY = 2): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" shape-rendering="crispEdges">${svgBody}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${hotX} ${hotY}, pointer`;
}

const CURSOR_SVGS: Record<
  Exclude<PixelCursorStyle, "system">,
  { normal: string; pointer: string }
> = {
  "cyber-arrow": {
    normal: buildCursorDataUri(
      `<rect x="1" y="1" width="2" height="12" fill="#090B10"/>
       <rect x="3" y="3" width="2" height="8" fill="#090B10"/>
       <rect x="5" y="5" width="2" height="6" fill="#090B10"/>
       <rect x="7" y="7" width="4" height="3" fill="#090B10"/>
       <rect x="2" y="2" width="2" height="9" fill="#00E5FF"/>
       <rect x="4" y="4" width="2" height="6" fill="#00E5FF"/>
       <rect x="6" y="6" width="3" height="3" fill="#FFD100"/>`
    ),
    pointer: buildPointerDataUri(
      `<rect x="5" y="1" width="3" height="7" fill="#090B10"/>
       <rect x="3" y="6" width="10" height="8" fill="#090B10"/>
       <rect x="6" y="2" width="2" height="6" fill="#FFD100"/>
       <rect x="4" y="7" width="8" height="6" fill="#00E5FF"/>`,
      6,
      2
    ),
  },
  "amber-crt": {
    normal: buildCursorDataUri(
      `<rect x="1" y="1" width="2" height="12" fill="#090B10"/>
       <rect x="2" y="2" width="2" height="9" fill="#FFD100"/>
       <rect x="4" y="4" width="2" height="6" fill="#FFD100"/>
       <rect x="6" y="6" width="3" height="3" fill="#FF9900"/>`
    ),
    pointer: buildPointerDataUri(
      `<rect x="5" y="1" width="3" height="7" fill="#090B10"/>
       <rect x="6" y="2" width="2" height="6" fill="#FFD100"/>
       <rect x="4" y="7" width="8" height="6" fill="#FFD100"/>`,
      6,
      2
    ),
  },
  "arcade-reticle": {
    normal: buildCursorDataUri(
      `<rect x="7" y="1" width="2" height="4" fill="#FF3355"/>
       <rect x="7" y="11" width="2" height="4" fill="#FF3355"/>
       <rect x="1" y="7" width="4" height="2" fill="#FF3355"/>
       <rect x="11" y="7" width="4" height="2" fill="#FF3355"/>
       <rect x="7" y="7" width="2" height="2" fill="#FFD100"/>`,
      12,
      12
    ),
    pointer: buildPointerDataUri(
      `<rect x="4" y="4" width="8" height="8" fill="#090B10"/>
       <rect x="5" y="5" width="6" height="6" fill="#00E5FF"/>
       <rect x="7" y="7" width="2" height="2" fill="#FF3355"/>`,
      12,
      12
    ),
  },
  "rpg-sword": {
    normal: buildCursorDataUri(
      `<rect x="1" y="1" width="3" height="3" fill="#00E5FF"/>
       <rect x="3" y="3" width="3" height="3" fill="#F5F2EB"/>
       <rect x="5" y="5" width="3" height="3" fill="#F5F2EB"/>
       <rect x="7" y="7" width="3" height="3" fill="#10B981"/>
       <rect x="6" y="10" width="6" height="2" fill="#FFD100"/>
       <rect x="10" y="12" width="3" height="3" fill="#FF3355"/>`,
      2,
      2
    ),
    pointer: buildPointerDataUri(
      `<rect x="1" y="1" width="4" height="4" fill="#FFD100"/>
       <rect x="4" y="4" width="4" height="4" fill="#00E5FF"/>
       <rect x="7" y="7" width="4" height="4" fill="#10B981"/>`,
      2,
      2
    ),
  },
  "classic-os": {
    normal: buildCursorDataUri(
      `<rect x="1" y="1" width="2" height="12" fill="#090B10"/>
       <rect x="2" y="2" width="2" height="9" fill="#F5F2EB"/>
       <rect x="4" y="4" width="2" height="6" fill="#F5F2EB"/>
       <rect x="6" y="6" width="3" height="3" fill="#F5F2EB"/>`
    ),
    pointer: buildPointerDataUri(
      `<rect x="5" y="1" width="3" height="7" fill="#090B10"/>
       <rect x="6" y="2" width="2" height="6" fill="#F5F2EB"/>
       <rect x="4" y="7" width="8" height="6" fill="#F5F2EB"/>`,
      6,
      2
    ),
  },
};

const isPixelCursorStyle = (value: string): value is PixelCursorStyle =>
  PIXEL_CURSOR_PRESETS.some((p) => p.id === value);

export function usePixelCursor(initial: PixelCursorStyle = "cyber-arrow") {
  // Persisted + synced across tabs; hydration renders `initial` first
  const [cursorStyle, setCursorStyle] = usePixelPref(
    "mixiuh_pixel_cursor",
    initial,
    isPixelCursorStyle
  );
  const [trailEnabled, setTrailEnabled] = useState<boolean>(true);

  useEffect(() => {
    const styleElId = "mixiuh-pixel-cursor-style";
    let styleEl = document.getElementById(styleElId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleElId;
      document.head.appendChild(styleEl);
    }

    if (cursorStyle === "system") {
      styleEl.textContent = "";
      return;
    }

    const pair = CURSOR_SVGS[cursorStyle];
    styleEl.textContent = `
      html, body {
        cursor: ${pair.normal} !important;
      }
      a, button, [role="button"], [role="tab"], [role="option"], [role="menuitem"], select, .cursor-pointer,
      input[type="checkbox"], input[type="radio"], input[type="range"], input[type="button"], input[type="submit"] {
        cursor: ${pair.pointer} !important;
      }
      input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea {
        cursor: text !important;
      }
      :disabled, [aria-disabled="true"] {
        cursor: not-allowed !important;
      }
    `;
  }, [cursorStyle]);

  return {
    cursorStyle,
    setCursorStyle: (next: PixelCursorStyle) => {
      pixelSound.play("click");
      setCursorStyle(next);
    },
    trailEnabled,
    setTrailEnabled,
  };
}
