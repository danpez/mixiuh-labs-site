"use client";

import React from "react";

export type PixelIconName =
  | "play"
  | "pause"
  | "volume-on"
  | "volume-off"
  | "music"
  | "crank"
  | "dpad"
  | "gamepad"
  | "cartridge"
  | "console"
  | "cpu"
  | "gpu"
  | "memory"
  | "terminal"
  | "code"
  | "folder"
  | "file"
  | "window"
  | "grid"
  | "search"
  | "sliders"
  | "settings"
  | "download"
  | "copy"
  | "check"
  | "close"
  | "arrow-right"
  | "arrow-up-right"
  | "external"
  | "clock"
  | "coin"
  | "bolt"
  | "flame"
  | "trophy"
  | "crown"
  | "medal"
  | "star"
  | "heart"
  | "shield"
  | "lock"
  | "key"
  | "sword"
  | "target"
  | "radar"
  | "broadcast"
  | "flask"
  | "dna"
  | "atom"
  | "chart-bar"
  | "chart-line"
  | "sparkles"
  | "bug"
  | "wrench"
  | "message"
  | "users"
  | "share"
  | "bookmark";

export const ALL_PIXEL_ICON_NAMES: PixelIconName[] = [
  "play",
  "pause",
  "volume-on",
  "volume-off",
  "music",
  "crank",
  "dpad",
  "gamepad",
  "cartridge",
  "console",
  "cpu",
  "gpu",
  "memory",
  "terminal",
  "code",
  "folder",
  "file",
  "window",
  "grid",
  "search",
  "sliders",
  "settings",
  "download",
  "copy",
  "check",
  "close",
  "arrow-right",
  "arrow-up-right",
  "external",
  "clock",
  "coin",
  "bolt",
  "flame",
  "trophy",
  "crown",
  "medal",
  "star",
  "heart",
  "shield",
  "lock",
  "key",
  "sword",
  "target",
  "radar",
  "broadcast",
  "flask",
  "dna",
  "atom",
  "chart-bar",
  "chart-line",
  "sparkles",
  "bug",
  "wrench",
  "message",
  "users",
  "share",
  "bookmark",
];

export interface PixelIconProps {
  name: PixelIconName;
  size?: number;
  className?: string;
  color?: string;
}

export function PixelIcon({
  name,
  size = 16,
  className = "",
  color = "currentColor",
}: PixelIconProps) {
  const renderRects = () => {
    switch (name) {
      case "play":
        return (
          <>
            <rect x="4" y="2" width="2" height="12" />
            <rect x="6" y="3" width="2" height="10" />
            <rect x="8" y="4" width="2" height="8" />
            <rect x="10" y="5" width="2" height="6" />
            <rect x="12" y="6" width="2" height="4" />
          </>
        );
      case "pause":
        return (
          <>
            <rect x="3" y="2" width="4" height="12" />
            <rect x="9" y="2" width="4" height="12" />
          </>
        );
      case "volume-on":
        return (
          <>
            <rect x="2" y="6" width="3" height="4" />
            <rect x="5" y="4" width="2" height="8" />
            <rect x="7" y="2" width="2" height="12" />
            <rect x="11" y="5" width="1" height="2" />
            <rect x="11" y="9" width="1" height="2" />
            <rect x="13" y="3" width="1" height="3" />
            <rect x="13" y="10" width="1" height="3" />
            <rect x="14" y="6" width="1" height="4" />
          </>
        );
      case "volume-off":
        return (
          <>
            <rect x="2" y="6" width="3" height="4" />
            <rect x="5" y="4" width="2" height="8" />
            <rect x="7" y="2" width="2" height="12" />
            <rect x="11" y="5" width="2" height="2" />
            <rect x="13" y="7" width="2" height="2" />
            <rect x="11" y="9" width="2" height="2" />
          </>
        );
      case "music":
        return (
          <>
            <rect x="6" y="2" width="8" height="2" />
            <rect x="6" y="4" width="2" height="8" />
            <rect x="12" y="4" width="2" height="6" />
            <rect x="3" y="10" width="5" height="4" />
            <rect x="9" y="8" width="5" height="4" />
          </>
        );
      case "crank":
        return (
          <>
            <rect x="2" y="6" width="4" height="4" />
            <rect x="6" y="7" width="5" height="2" />
            <rect x="9" y="3" width="2" height="5" />
            <rect x="11" y="2" width="3" height="4" />
          </>
        );
      case "dpad":
        return (
          <>
            <rect x="6" y="2" width="4" height="12" />
            <rect x="2" y="6" width="12" height="4" />
            <rect x="7" y="7" width="2" height="2" fill="#090B10" />
          </>
        );
      case "gamepad":
        return (
          <>
            <rect x="2" y="4" width="12" height="8" />
            <rect x="1" y="6" width="2" height="6" />
            <rect x="13" y="6" width="2" height="6" />
            <rect x="4" y="7" width="3" height="1" fill="#090B10" />
            <rect x="5" y="6" width="1" height="3" fill="#090B10" />
            <rect x="10" y="6" width="2" height="2" fill="#090B10" />
            <rect x="12" y="8" width="2" height="2" fill="#090B10" />
          </>
        );
      case "cartridge":
        return (
          <>
            <rect x="3" y="1" width="9" height="2" />
            <rect x="2" y="3" width="12" height="10" />
            <rect x="4" y="13" width="8" height="2" />
            <rect x="5" y="5" width="6" height="4" fill="#090B10" />
          </>
        );
      case "console":
        return (
          <>
            <rect x="3" y="1" width="10" height="14" />
            <rect x="5" y="3" width="6" height="5" fill="#090B10" />
            <rect x="5" y="10" width="2" height="2" fill="#090B10" />
            <rect x="9" y="10" width="2" height="2" fill="#090B10" />
            <rect x="13" y="6" width="2" height="4" />
          </>
        );
      case "cpu":
        return (
          <>
            <rect x="4" y="4" width="8" height="8" />
            <rect x="6" y="6" width="4" height="4" fill="#090B10" />
            <rect x="5" y="1" width="2" height="2" />
            <rect x="9" y="1" width="2" height="2" />
            <rect x="5" y="13" width="2" height="2" />
            <rect x="9" y="13" width="2" height="2" />
            <rect x="1" y="5" width="2" height="2" />
            <rect x="1" y="9" width="2" height="2" />
            <rect x="13" y="5" width="2" height="2" />
            <rect x="13" y="9" width="2" height="2" />
          </>
        );
      case "gpu":
        return (
          <>
            <rect x="1" y="4" width="14" height="8" />
            <rect x="3" y="6" width="4" height="4" fill="#090B10" />
            <rect x="9" y="6" width="4" height="4" fill="#090B10" />
            <rect x="3" y="12" width="6" height="2" />
          </>
        );
      case "memory":
        return (
          <>
            <rect x="1" y="5" width="14" height="6" />
            <rect x="3" y="7" width="2" height="2" fill="#090B10" />
            <rect x="7" y="7" width="2" height="2" fill="#090B10" />
            <rect x="11" y="7" width="2" height="2" fill="#090B10" />
            <rect x="3" y="11" width="2" height="2" />
            <rect x="7" y="11" width="2" height="2" />
            <rect x="11" y="11" width="2" height="2" />
          </>
        );
      case "terminal":
        return (
          <>
            <rect x="1" y="2" width="14" height="12" />
            <rect x="3" y="4" width="10" height="8" fill="#090B10" />
            <rect x="4" y="6" width="2" height="1" />
            <rect x="6" y="7" width="2" height="1" />
            <rect x="4" y="8" width="2" height="1" />
            <rect x="8" y="9" width="3" height="1" />
          </>
        );
      case "code":
        return (
          <>
            <rect x="4" y="5" width="2" height="2" />
            <rect x="2" y="7" width="2" height="2" />
            <rect x="4" y="9" width="2" height="2" />
            <rect x="10" y="5" width="2" height="2" />
            <rect x="12" y="7" width="2" height="2" />
            <rect x="10" y="9" width="2" height="2" />
            <rect x="7" y="3" width="2" height="10" />
          </>
        );
      case "folder":
        return (
          <>
            <rect x="1" y="3" width="6" height="2" />
            <rect x="1" y="5" width="14" height="9" />
          </>
        );
      case "file":
        return (
          <>
            <rect x="3" y="1" width="8" height="14" />
            <rect x="11" y="3" width="2" height="12" />
            <rect x="5" y="5" width="6" height="1" fill="#090B10" />
            <rect x="5" y="8" width="6" height="1" fill="#090B10" />
            <rect x="5" y="11" width="4" height="1" fill="#090B10" />
          </>
        );
      case "window":
        return (
          <>
            <rect x="1" y="2" width="14" height="12" />
            <rect x="3" y="6" width="10" height="6" fill="#090B10" />
            <rect x="11" y="3" width="2" height="2" fill="#090B10" />
          </>
        );
      case "grid":
        return (
          <>
            <rect x="2" y="2" width="5" height="5" />
            <rect x="9" y="2" width="5" height="5" />
            <rect x="2" y="9" width="5" height="5" />
            <rect x="9" y="9" width="5" height="5" />
          </>
        );
      case "search":
        return (
          <>
            <rect x="4" y="2" width="6" height="2" />
            <rect x="2" y="4" width="2" height="6" />
            <rect x="10" y="4" width="2" height="6" />
            <rect x="4" y="10" width="6" height="2" />
            <rect x="10" y="10" width="2" height="2" />
            <rect x="12" y="12" width="2" height="2" />
          </>
        );
      case "sliders":
        return (
          <>
            <rect x="2" y="3" width="12" height="2" />
            <rect x="9" y="1" width="3" height="6" />
            <rect x="2" y="10" width="12" height="2" />
            <rect x="4" y="8" width="3" height="6" />
          </>
        );
      case "settings":
        return (
          <>
            <rect x="6" y="1" width="4" height="14" />
            <rect x="1" y="6" width="14" height="4" />
            <rect x="3" y="3" width="10" height="10" />
            <rect x="6" y="6" width="4" height="4" fill="#090B10" />
          </>
        );
      case "download":
        return (
          <>
            <rect x="7" y="1" width="2" height="8" />
            <rect x="4" y="6" width="8" height="2" />
            <rect x="6" y="8" width="4" height="2" />
            <rect x="2" y="12" width="12" height="2" />
          </>
        );
      case "copy":
        return (
          <>
            <rect x="2" y="2" width="8" height="8" />
            <rect x="6" y="6" width="8" height="8" />
            <rect x="8" y="8" width="4" height="4" fill="#090B10" />
          </>
        );
      case "check":
        return (
          <>
            <rect x="2" y="8" width="2" height="2" />
            <rect x="4" y="10" width="2" height="2" />
            <rect x="6" y="8" width="2" height="2" />
            <rect x="8" y="6" width="2" height="2" />
            <rect x="10" y="4" width="2" height="2" />
            <rect x="12" y="2" width="2" height="2" />
          </>
        );
      case "close":
        return (
          <>
            <rect x="2" y="2" width="2" height="2" />
            <rect x="4" y="4" width="2" height="2" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="10" y="4" width="2" height="2" />
            <rect x="12" y="2" width="2" height="2" />
            <rect x="4" y="10" width="2" height="2" />
            <rect x="2" y="12" width="2" height="2" />
            <rect x="10" y="10" width="2" height="2" />
            <rect x="12" y="12" width="2" height="2" />
          </>
        );
      case "arrow-right":
        return (
          <>
            <rect x="2" y="7" width="10" height="2" />
            <rect x="8" y="4" width="2" height="2" />
            <rect x="10" y="6" width="2" height="4" />
            <rect x="8" y="10" width="2" height="2" />
          </>
        );
      case "arrow-up-right":
      case "external":
        return (
          <>
            <rect x="5" y="3" width="8" height="2" />
            <rect x="11" y="5" width="2" height="6" />
            <rect x="9" y="5" width="2" height="2" />
            <rect x="7" y="7" width="2" height="2" />
            <rect x="5" y="9" width="2" height="2" />
            <rect x="3" y="11" width="2" height="2" />
          </>
        );
      case "clock":
        return (
          <>
            <rect x="4" y="1" width="8" height="2" />
            <rect x="4" y="13" width="8" height="2" />
            <rect x="1" y="4" width="2" height="8" />
            <rect x="13" y="4" width="2" height="8" />
            <rect x="2" y="2" width="2" height="2" />
            <rect x="12" y="2" width="2" height="2" />
            <rect x="2" y="12" width="2" height="2" />
            <rect x="12" y="12" width="2" height="2" />
            <rect x="7" y="4" width="2" height="5" />
            <rect x="9" y="7" width="3" height="2" />
          </>
        );
      case "coin":
        return (
          <>
            <rect x="5" y="1" width="6" height="2" />
            <rect x="3" y="3" width="10" height="10" />
            <rect x="5" y="13" width="6" height="2" />
            <rect x="7" y="4" width="2" height="8" fill="#090B10" />
          </>
        );
      case "bolt":
        return (
          <>
            <rect x="8" y="1" width="4" height="3" />
            <rect x="6" y="4" width="4" height="3" />
            <rect x="4" y="7" width="8" height="2" />
            <rect x="6" y="9" width="4" height="3" />
            <rect x="4" y="12" width="4" height="3" />
          </>
        );
      case "flame":
        return (
          <>
            <rect x="7" y="1" width="2" height="3" />
            <rect x="5" y="4" width="6" height="3" />
            <rect x="3" y="7" width="10" height="5" />
            <rect x="5" y="12" width="6" height="3" />
            <rect x="7" y="9" width="2" height="3" fill="#090B10" />
          </>
        );
      case "trophy":
        return (
          <>
            <rect x="4" y="2" width="8" height="6" />
            <rect x="2" y="3" width="2" height="3" />
            <rect x="12" y="3" width="2" height="3" />
            <rect x="6" y="8" width="4" height="3" />
            <rect x="4" y="11" width="8" height="3" />
          </>
        );
      case "crown":
        return (
          <>
            <rect x="1" y="4" width="2" height="8" />
            <rect x="7" y="3" width="2" height="9" />
            <rect x="13" y="4" width="2" height="8" />
            <rect x="3" y="7" width="4" height="5" />
            <rect x="9" y="7" width="4" height="5" />
            <rect x="1" y="12" width="14" height="2" />
          </>
        );
      case "medal":
        return (
          <>
            <rect x="4" y="1" width="3" height="5" />
            <rect x="9" y="1" width="3" height="5" />
            <rect x="4" y="6" width="8" height="8" />
            <rect x="7" y="9" width="2" height="2" fill="#090B10" />
          </>
        );
      case "star":
        return (
          <>
            <rect x="7" y="1" width="2" height="4" />
            <rect x="2" y="5" width="12" height="3" />
            <rect x="4" y="8" width="8" height="3" />
            <rect x="3" y="11" width="3" height="3" />
            <rect x="10" y="11" width="3" height="3" />
          </>
        );
      case "heart":
        return (
          <>
            <rect x="2" y="3" width="4" height="2" />
            <rect x="10" y="3" width="4" height="2" />
            <rect x="1" y="5" width="14" height="4" />
            <rect x="3" y="9" width="10" height="2" />
            <rect x="5" y="11" width="6" height="2" />
            <rect x="7" y="13" width="2" height="2" />
          </>
        );
      case "shield":
        return (
          <>
            <rect x="2" y="2" width="12" height="6" />
            <rect x="4" y="8" width="8" height="3" />
            <rect x="6" y="11" width="4" height="3" />
          </>
        );
      case "lock":
        return (
          <>
            <rect x="5" y="2" width="6" height="5" />
            <rect x="7" y="4" width="2" height="3" fill="#090B10" />
            <rect x="3" y="7" width="10" height="7" />
            <rect x="7" y="10" width="2" height="2" fill="#090B10" />
          </>
        );
      case "key":
        return (
          <>
            <rect x="2" y="5" width="6" height="6" />
            <rect x="4" y="7" width="2" height="2" fill="#090B10" />
            <rect x="8" y="7" width="7" height="2" />
            <rect x="11" y="9" width="2" height="2" />
            <rect x="13" y="9" width="2" height="3" />
          </>
        );
      case "sword":
        return (
          <>
            <rect x="11" y="2" width="3" height="3" />
            <rect x="9" y="4" width="3" height="3" />
            <rect x="7" y="6" width="3" height="3" />
            <rect x="5" y="8" width="3" height="3" />
            <rect x="2" y="11" width="4" height="3" />
          </>
        );
      case "target":
      case "radar":
        return (
          <>
            <rect x="5" y="1" width="6" height="2" />
            <rect x="5" y="13" width="6" height="2" />
            <rect x="1" y="5" width="2" height="6" />
            <rect x="13" y="5" width="2" height="6" />
            <rect x="6" y="6" width="4" height="4" />
          </>
        );
      case "broadcast":
        return (
          <>
            <rect x="7" y="6" width="2" height="8" />
            <rect x="4" y="4" width="2" height="4" />
            <rect x="10" y="4" width="2" height="4" />
            <rect x="2" y="2" width="2" height="8" />
            <rect x="12" y="2" width="2" height="8" />
          </>
        );
      case "flask":
        return (
          <>
            <rect x="6" y="1" width="4" height="5" />
            <rect x="4" y="6" width="8" height="3" />
            <rect x="2" y="9" width="12" height="5" />
          </>
        );
      case "dna":
      case "atom":
        return (
          <>
            <rect x="3" y="2" width="10" height="2" />
            <rect x="5" y="5" width="6" height="2" />
            <rect x="7" y="7" width="2" height="2" />
            <rect x="5" y="9" width="6" height="2" />
            <rect x="3" y="12" width="10" height="2" />
          </>
        );
      case "chart-bar":
        return (
          <>
            <rect x="2" y="9" width="3" height="5" />
            <rect x="6" y="5" width="3" height="9" />
            <rect x="10" y="2" width="3" height="12" />
          </>
        );
      case "chart-line":
        return (
          <>
            <rect x="2" y="11" width="3" height="2" />
            <rect x="5" y="8" width="3" height="2" />
            <rect x="8" y="9" width="3" height="2" />
            <rect x="11" y="4" width="3" height="2" />
          </>
        );
      case "sparkles":
        return (
          <>
            <rect x="7" y="1" width="2" height="14" />
            <rect x="1" y="7" width="14" height="2" />
            <rect x="5" y="5" width="6" height="6" />
          </>
        );
      case "bug":
        return (
          <>
            <rect x="5" y="2" width="6" height="3" />
            <rect x="4" y="5" width="8" height="8" />
            <rect x="2" y="6" width="2" height="2" />
            <rect x="12" y="6" width="2" height="2" />
            <rect x="2" y="10" width="2" height="2" />
            <rect x="12" y="10" width="2" height="2" />
          </>
        );
      case "wrench":
        return (
          <>
            <rect x="8" y="2" width="6" height="5" />
            <rect x="6" y="7" width="4" height="3" />
            <rect x="3" y="10" width="4" height="4" />
          </>
        );
      case "message":
        return (
          <>
            <rect x="2" y="2" width="12" height="9" />
            <rect x="4" y="11" width="3" height="3" />
            <rect x="5" y="5" width="6" height="2" fill="#090B10" />
          </>
        );
      case "users":
        return (
          <>
            <rect x="4" y="2" width="4" height="4" />
            <rect x="10" y="3" width="3" height="3" />
            <rect x="2" y="7" width="8" height="6" />
            <rect x="10" y="7" width="5" height="5" />
          </>
        );
      case "share":
        return (
          <>
            <rect x="10" y="2" width="4" height="4" />
            <rect x="2" y="6" width="4" height="4" />
            <rect x="10" y="10" width="4" height="4" />
            <rect x="6" y="5" width="4" height="2" />
            <rect x="6" y="9" width="4" height="2" />
          </>
        );
      case "bookmark":
        return (
          <>
            <rect x="3" y="1" width="10" height="14" />
            <rect x="6" y="11" width="4" height="4" fill="#090B10" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      shapeRendering="crispEdges"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {renderRects()}
    </svg>
  );
}

/* ============================================================================
   ANIMATED PIXEL-ART AI & LAB CHARACTER SPRITES (16x16 Crisp Grid)
   ============================================================================ */

export type PixelSpriteCharacter =
  | "mixiuh"
  | "carbon"
  | "argon"
  | "opus"
  | "sonnet"
  | "haiku"
  | "flash"
  | "pocket-lab";

export interface PixelSpriteProps {
  character: PixelSpriteCharacter;
  size?: number;
  animate?: boolean;
  className?: string;
}

export function PixelSprite({
  character,
  size = 44,
  animate = true,
  className = "",
}: PixelSpriteProps) {
  const paletteMap: Record<
    PixelSpriteCharacter,
    { body: string; accent: string; visor: string; crown?: string }
  > = {
    mixiuh: { body: "#00E5FF", accent: "#FFD100", visor: "#090B10", crown: "#FFD100" },
    carbon: { body: "#00E5FF", accent: "#FFD100", visor: "#090B10", crown: "#10B981" },
    argon: { body: "#A855F7", accent: "#00E5FF", visor: "#090B10" },
    opus: { body: "#FF3355", accent: "#FFD100", visor: "#090B10", crown: "#FFD100" },
    sonnet: { body: "#38BDF8", accent: "#10B981", visor: "#090B10" },
    haiku: { body: "#10B981", accent: "#FFD100", visor: "#090B10" },
    flash: { body: "#FFD100", accent: "#FF3355", visor: "#090B10" },
    "pocket-lab": { body: "#FFD100", accent: "#00E5FF", visor: "#090B10" },
  };

  const p = paletteMap[character];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`shrink-0 ${animate ? "animate-px-float" : ""} ${className}`}
      aria-label={character}
    >
      {/* Top Crown or Antenna */}
      {p.crown ? (
        <>
          <rect x="4" y="1" width="2" height="2" fill={p.crown} />
          <rect x="7" y="0" width="2" height="3" fill={p.crown} />
          <rect x="10" y="1" width="2" height="2" fill={p.crown} />
        </>
      ) : (
        <>
          <rect x="7" y="1" width="2" height="2" fill={p.accent} />
        </>
      )}

      {/* Outer Black Pixel Outline */}
      <rect x="3" y="3" width="10" height="10" fill="#090B10" />

      {/* Main Robot / Agent Chassis */}
      <rect x="4" y="4" width="8" height="8" fill={p.body} />

      {/* Side Ears / Cooling Fins */}
      <rect x="2" y="6" width="2" height="4" fill={p.accent} />
      <rect x="12" y="6" width="2" height="4" fill={p.accent} />

      {/* Visor Screen */}
      <rect x="5" y="5" width="6" height="4" fill={p.visor} />

      {/* Glowing Eyes */}
      <rect x="6" y="6" width="1" height="2" fill="#F5F2EB" />
      <rect x="9" y="6" width="1" height="2" fill="#F5F2EB" />

      {/* Core Chest Telemetry Indicator */}
      <rect x="6" y="10" width="4" height="1" fill={p.accent} />

      {/* Pixel Feet */}
      <rect x="4" y="13" width="3" height="2" fill={p.accent} />
      <rect x="9" y="13" width="3" height="2" fill={p.accent} />
    </svg>
  );
}
