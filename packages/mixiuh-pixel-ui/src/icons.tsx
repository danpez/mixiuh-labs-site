"use client";

import React from "react";

export type PixelIconName =
  // 1. Social Media & Tech Brands (28)
  | "youtube"
  | "x"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "google"
  | "github"
  | "gitlab"
  | "discord"
  | "twitch"
  | "linkedin"
  | "reddit"
  | "telegram"
  | "whatsapp"
  | "spotify"
  | "apple"
  | "windows"
  | "linux"
  | "android"
  | "anthropic"
  | "openai"
  | "gemini-brand"
  | "npm"
  | "react"
  | "nextjs"
  | "vercel"
  | "blender"
  | "figma"
  // 2. Navigation & Layout (20)
  | "home"
  | "menu"
  | "grid"
  | "window"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up"
  | "arrow-down"
  | "arrow-up-right"
  | "chevron-right"
  | "chevron-left"
  | "chevron-up"
  | "chevron-down"
  | "expand"
  | "minimize"
  | "refresh"
  | "sync"
  | "external"
  | "login"
  | "logout"
  | "plus"
  | "minus"
  | "command"
  // 3. Communication & Social Actions (20)
  | "message"
  | "chat-dots"
  | "mail"
  | "inbox"
  | "send"
  | "share"
  | "heart"
  | "thumbs-up"
  | "thumbs-down"
  | "bookmark"
  | "bell"
  | "bell-off"
  | "megaphone"
  | "phone"
  | "video-cam"
  | "mic"
  | "mic-off"
  | "rss"
  | "flag"
  | "at-sign"
  // 4. Files, Code & Editing (24)
  | "file"
  | "file-code"
  | "folder"
  | "folder-open"
  | "save"
  | "download"
  | "upload"
  | "cloud"
  | "cloud-upload"
  | "cloud-download"
  | "copy"
  | "clipboard"
  | "edit"
  | "pen"
  | "trash"
  | "scissors"
  | "link"
  | "paperclip"
  | "terminal"
  | "code"
  | "bug"
  | "git-branch"
  | "git-commit"
  | "book"
  // 5. Media, Audio & Video (18)
  | "play"
  | "pause"
  | "stop"
  | "skip-prev"
  | "skip-next"
  | "fast-forward"
  | "rewind"
  | "repeat"
  | "shuffle"
  | "volume-on"
  | "volume-off"
  | "music"
  | "headphones"
  | "camera"
  | "image"
  | "film"
  | "sliders"
  | "equalizer"
  // 6. Commerce, Analytics & Trophies (18)
  | "coin"
  | "dollar"
  | "credit-card"
  | "wallet"
  | "cart"
  | "shopping-bag"
  | "tag"
  | "percent"
  | "chart-bar"
  | "chart-line"
  | "chart-pie"
  | "trending-up"
  | "trending-down"
  | "calculator"
  | "trophy"
  | "crown"
  | "medal"
  | "star"
  // 7. System, Users & Security (22)
  | "settings"
  | "wrench"
  | "hammer"
  | "search"
  | "check"
  | "close"
  | "shield"
  | "lock"
  | "unlock"
  | "key"
  | "eye"
  | "eye-off"
  | "users"
  | "user"
  | "user-plus"
  | "wifi"
  | "bluetooth"
  | "battery-full"
  | "battery-low"
  | "power"
  | "bolt"
  | "flame"
  // 8. Retro Hardware, AI & World (32)
  | "crt-tv"
  | "computer-old"
  | "floppy"
  | "cassette"
  | "cartridge"
  | "console"
  | "gamepad"
  | "joystick"
  | "dpad"
  | "crank"
  | "keyboard"
  | "mouse"
  | "cursor-hand"
  | "antenna-tv"
  | "dial-knob"
  | "cpu"
  | "gpu"
  | "memory"
  | "circuit"
  | "server"
  | "database"
  | "brain-ai"
  | "robot"
  | "target"
  | "radar"
  | "broadcast"
  | "flask"
  | "dna"
  | "atom"
  | "sword"
  | "potion"
  | "rocket"
  | "planet"
  | "campfire"
  | "hourglass"
  | "skull"
  | "ghost"
  | "chest"
  | "diamond"
  | "wand"
  | "sun-pixel"
  | "moon-pixel"
  | "clock"
  | "calendar"
  | "map-pin"
  | "compass"
  | "globe"
  | "sparkles";

export type PixelIconCategoryId =
  | "all"
  | "brands"
  | "navigation"
  | "communication"
  | "files-code"
  | "media"
  | "commerce-data"
  | "system-security"
  | "retro-ai";

export const PIXEL_ICON_CATEGORIES: {
  id: PixelIconCategoryId;
  label_es: string;
  label_en: string;
  icons: PixelIconName[];
}[] = [
  {
    id: "brands",
    label_es: "Marcas y Redes Sociales (28)",
    label_en: "Brands & Social Media (28)",
    icons: [
      "youtube",
      "x",
      "instagram",
      "facebook",
      "tiktok",
      "google",
      "github",
      "gitlab",
      "discord",
      "twitch",
      "linkedin",
      "reddit",
      "telegram",
      "whatsapp",
      "spotify",
      "apple",
      "windows",
      "linux",
      "android",
      "anthropic",
      "openai",
      "gemini-brand",
      "npm",
      "react",
      "nextjs",
      "vercel",
      "blender",
      "figma",
    ],
  },
  {
    id: "navigation",
    label_es: "Navegacion y Layout (23)",
    label_en: "Navigation & Layout (23)",
    icons: [
      "home",
      "menu",
      "grid",
      "window",
      "arrow-right",
      "arrow-left",
      "arrow-up",
      "arrow-down",
      "arrow-up-right",
      "chevron-right",
      "chevron-left",
      "chevron-up",
      "chevron-down",
      "expand",
      "minimize",
      "refresh",
      "sync",
      "external",
      "login",
      "logout",
      "plus",
      "minus",
      "command",
    ],
  },
  {
    id: "communication",
    label_es: "Comunicacion y Accion Social (20)",
    label_en: "Communication & Social (20)",
    icons: [
      "message",
      "chat-dots",
      "mail",
      "inbox",
      "send",
      "share",
      "heart",
      "thumbs-up",
      "thumbs-down",
      "bookmark",
      "bell",
      "bell-off",
      "megaphone",
      "phone",
      "video-cam",
      "mic",
      "mic-off",
      "rss",
      "flag",
      "at-sign",
    ],
  },
  {
    id: "files-code",
    label_es: "Archivos, Codigo y Edicion (24)",
    label_en: "Files, Code & Editing (24)",
    icons: [
      "file",
      "file-code",
      "folder",
      "folder-open",
      "save",
      "download",
      "upload",
      "cloud",
      "cloud-upload",
      "cloud-download",
      "copy",
      "clipboard",
      "edit",
      "pen",
      "trash",
      "scissors",
      "link",
      "paperclip",
      "terminal",
      "code",
      "bug",
      "git-branch",
      "git-commit",
      "book",
    ],
  },
  {
    id: "media",
    label_es: "Audio, Video y Multimedia (18)",
    label_en: "Audio, Video & Media (18)",
    icons: [
      "play",
      "pause",
      "stop",
      "skip-prev",
      "skip-next",
      "fast-forward",
      "rewind",
      "repeat",
      "shuffle",
      "volume-on",
      "volume-off",
      "music",
      "headphones",
      "camera",
      "image",
      "film",
      "sliders",
      "equalizer",
    ],
  },
  {
    id: "commerce-data",
    label_es: "Finanzas, Graficas y Trofeos (18)",
    label_en: "Finance, Charts & Trophies (18)",
    icons: [
      "coin",
      "dollar",
      "credit-card",
      "wallet",
      "cart",
      "shopping-bag",
      "tag",
      "percent",
      "chart-bar",
      "chart-line",
      "chart-pie",
      "trending-up",
      "trending-down",
      "calculator",
      "trophy",
      "crown",
      "medal",
      "star",
    ],
  },
  {
    id: "system-security",
    label_es: "Sistema, Usuarios y Seguridad (22)",
    label_en: "System, Users & Security (22)",
    icons: [
      "settings",
      "wrench",
      "hammer",
      "search",
      "check",
      "close",
      "shield",
      "lock",
      "unlock",
      "key",
      "eye",
      "eye-off",
      "users",
      "user",
      "user-plus",
      "wifi",
      "bluetooth",
      "battery-full",
      "battery-low",
      "power",
      "bolt",
      "flame",
    ],
  },
  {
    id: "retro-ai",
    label_es: "Hardware Retro, IA y Arcade (48)",
    label_en: "Retro Hardware, AI & Arcade (48)",
    icons: [
      "crt-tv",
      "computer-old",
      "floppy",
      "cassette",
      "cartridge",
      "console",
      "gamepad",
      "joystick",
      "dpad",
      "crank",
      "keyboard",
      "mouse",
      "cursor-hand",
      "antenna-tv",
      "dial-knob",
      "cpu",
      "gpu",
      "memory",
      "circuit",
      "server",
      "database",
      "brain-ai",
      "robot",
      "target",
      "radar",
      "broadcast",
      "flask",
      "dna",
      "atom",
      "sword",
      "potion",
      "rocket",
      "planet",
      "campfire",
      "hourglass",
      "skull",
      "ghost",
      "chest",
      "diamond",
      "wand",
      "sun-pixel",
      "moon-pixel",
      "clock",
      "calendar",
      "map-pin",
      "compass",
      "globe",
      "sparkles",
    ],
  },
];

export const ALL_PIXEL_ICON_NAMES: PixelIconName[] =
  PIXEL_ICON_CATEGORIES.flatMap((c) => c.icons);

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
      case "crt-tv":
        return (
          <>
            <rect x="4" y="1" width="2" height="2" />
            <rect x="10" y="1" width="2" height="2" />
            <rect x="6" y="2" width="4" height="2" />
            <rect x="1" y="4" width="14" height="10" />
            <rect x="3" y="6" width="8" height="6" fill="#090B10" />
            <rect x="12" y="6" width="2" height="2" fill="#090B10" />
            <rect x="12" y="10" width="2" height="2" fill="#090B10" />
            <rect x="3" y="14" width="2" height="2" />
            <rect x="11" y="14" width="2" height="2" />
          </>
        );
      case "computer-old":
        return (
          <>
            <rect x="2" y="1" width="12" height="9" />
            <rect x="4" y="3" width="8" height="5" fill="#090B10" />
            <rect x="5" y="10" width="6" height="2" />
            <rect x="1" y="12" width="14" height="3" />
            <rect x="10" y="13" width="3" height="1" fill="#090B10" />
          </>
        );
      case "floppy":
        return (
          <>
            <rect x="2" y="1" width="11" height="14" />
            <rect x="13" y="3" width="1" height="12" />
            <rect x="5" y="2" width="6" height="4" fill="#090B10" />
            <rect x="9" y="3" width="1" height="2" />
            <rect x="4" y="9" width="8" height="5" fill="#090B10" />
          </>
        );
      case "cassette":
        return (
          <>
            <rect x="1" y="3" width="14" height="10" />
            <rect x="3" y="5" width="10" height="4" fill="#090B10" />
            <rect x="4" y="6" width="2" height="2" />
            <rect x="10" y="6" width="2" height="2" />
            <rect x="4" y="11" width="8" height="2" fill="#090B10" />
          </>
        );
      case "joystick":
        return (
          <>
            <rect x="6" y="1" width="4" height="4" />
            <rect x="7" y="5" width="2" height="5" />
            <rect x="2" y="10" width="12" height="4" />
            <rect x="4" y="9" width="2" height="1" />
          </>
        );
      case "keyboard":
        return (
          <>
            <rect x="1" y="4" width="14" height="8" />
            <rect x="3" y="6" width="2" height="2" fill="#090B10" />
            <rect x="6" y="6" width="2" height="2" fill="#090B10" />
            <rect x="9" y="6" width="2" height="2" fill="#090B10" />
            <rect x="12" y="6" width="1" height="2" fill="#090B10" />
            <rect x="4" y="9" width="8" height="2" fill="#090B10" />
          </>
        );
      case "mouse":
        return (
          <>
            <rect x="4" y="2" width="8" height="12" />
            <rect x="7" y="3" width="2" height="4" fill="#090B10" />
            <rect x="4" y="7" width="8" height="1" fill="#090B10" />
          </>
        );
      case "cursor-hand":
        return (
          <>
            <rect x="6" y="1" width="2" height="7" />
            <rect x="4" y="6" width="9" height="8" />
            <rect x="2" y="8" width="2" height="3" />
          </>
        );
      case "antenna-tv":
        return (
          <>
            <rect x="2" y="1" width="2" height="2" />
            <rect x="12" y="1" width="2" height="2" />
            <rect x="4" y="3" width="2" height="2" />
            <rect x="10" y="3" width="2" height="2" />
            <rect x="6" y="5" width="4" height="3" />
            <rect x="7" y="8" width="2" height="6" />
            <rect x="4" y="13" width="8" height="2" />
          </>
        );
      case "dial-knob":
        return (
          <>
            <rect x="4" y="2" width="8" height="12" />
            <rect x="2" y="4" width="12" height="8" />
            <rect x="7" y="3" width="2" height="5" fill="#090B10" />
          </>
        );
      case "circuit":
        return (
          <>
            <rect x="2" y="2" width="3" height="3" />
            <rect x="5" y="3" width="6" height="2" />
            <rect x="11" y="2" width="3" height="3" />
            <rect x="7" y="5" width="2" height="6" />
            <rect x="6" y="11" width="4" height="3" />
          </>
        );
      case "server":
      case "database":
        return (
          <>
            <rect x="2" y="2" width="12" height="3" />
            <rect x="2" y="6" width="12" height="3" />
            <rect x="2" y="10" width="12" height="4" />
            <rect x="4" y="3" width="2" height="1" fill="#090B10" />
            <rect x="4" y="7" width="2" height="1" fill="#090B10" />
            <rect x="4" y="11" width="2" height="1" fill="#090B10" />
          </>
        );
      case "brain-ai":
        return (
          <>
            <rect x="3" y="3" width="10" height="9" />
            <rect x="1" y="5" width="2" height="5" />
            <rect x="13" y="5" width="2" height="5" />
            <rect x="7" y="4" width="2" height="7" fill="#090B10" />
            <rect x="4" y="6" width="2" height="2" fill="#090B10" />
            <rect x="10" y="6" width="2" height="2" fill="#090B10" />
          </>
        );
      case "robot":
        return (
          <>
            <rect x="7" y="1" width="2" height="2" />
            <rect x="3" y="3" width="10" height="10" />
            <rect x="5" y="5" width="2" height="2" fill="#090B10" />
            <rect x="9" y="5" width="2" height="2" fill="#090B10" />
            <rect x="5" y="9" width="6" height="2" fill="#090B10" />
          </>
        );
      case "potion":
        return (
          <>
            <rect x="6" y="1" width="4" height="2" />
            <rect x="7" y="3" width="2" height="3" />
            <rect x="4" y="6" width="8" height="3" />
            <rect x="2" y="9" width="12" height="5" />
            <rect x="5" y="10" width="2" height="2" fill="#090B10" />
          </>
        );
      case "rocket":
        return (
          <>
            <rect x="7" y="1" width="2" height="2" />
            <rect x="5" y="3" width="6" height="8" />
            <rect x="3" y="8" width="2" height="4" />
            <rect x="11" y="8" width="2" height="4" />
            <rect x="7" y="5" width="2" height="2" fill="#090B10" />
            <rect x="6" y="11" width="4" height="3" />
          </>
        );
      case "planet":
        return (
          <>
            <rect x="4" y="4" width="8" height="8" />
            <rect x="1" y="7" width="14" height="2" />
            <rect x="2" y="9" width="3" height="1" />
            <rect x="11" y="6" width="3" height="1" />
          </>
        );
      case "campfire":
        return (
          <>
            <rect x="7" y="2" width="2" height="3" />
            <rect x="5" y="5" width="6" height="5" />
            <rect x="2" y="11" width="12" height="3" />
          </>
        );
      case "hourglass":
        return (
          <>
            <rect x="3" y="1" width="10" height="2" />
            <rect x="4" y="3" width="8" height="3" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="4" y="10" width="8" height="3" />
            <rect x="3" y="13" width="10" height="2" />
          </>
        );
      case "skull":
        return (
          <>
            <rect x="3" y="2" width="10" height="8" />
            <rect x="5" y="5" width="2" height="2" fill="#090B10" />
            <rect x="9" y="5" width="2" height="2" fill="#090B10" />
            <rect x="5" y="10" width="6" height="4" />
            <rect x="7" y="11" width="2" height="3" fill="#090B10" />
          </>
        );
      case "ghost":
        return (
          <>
            <rect x="4" y="2" width="8" height="2" />
            <rect x="2" y="4" width="12" height="9" />
            <rect x="2" y="13" width="2" height="2" />
            <rect x="7" y="13" width="2" height="2" />
            <rect x="12" y="13" width="2" height="2" />
            <rect x="5" y="6" width="2" height="2" fill="#090B10" />
            <rect x="9" y="6" width="2" height="2" fill="#090B10" />
          </>
        );
      case "chest":
        return (
          <>
            <rect x="2" y="3" width="12" height="10" />
            <rect x="2" y="7" width="12" height="2" fill="#090B10" />
            <rect x="7" y="6" width="2" height="4" />
          </>
        );
      case "diamond":
        return (
          <>
            <rect x="6" y="2" width="4" height="2" />
            <rect x="4" y="4" width="8" height="2" />
            <rect x="2" y="6" width="12" height="3" />
            <rect x="4" y="9" width="8" height="2" />
            <rect x="6" y="11" width="4" height="3" />
          </>
        );
      case "wand":
        return (
          <>
            <rect x="10" y="2" width="4" height="4" />
            <rect x="8" y="6" width="2" height="2" />
            <rect x="6" y="8" width="2" height="2" />
            <rect x="4" y="10" width="2" height="2" />
            <rect x="2" y="12" width="2" height="2" />
          </>
        );
      case "sun-pixel":
        return (
          <>
            <rect x="5" y="5" width="6" height="6" />
            <rect x="7" y="1" width="2" height="2" />
            <rect x="7" y="13" width="2" height="2" />
            <rect x="1" y="7" width="2" height="2" />
            <rect x="13" y="7" width="2" height="2" />
          </>
        );
      case "moon-pixel":
        return (
          <>
            <rect x="5" y="2" width="6" height="2" />
            <rect x="3" y="4" width="4" height="8" />
            <rect x="5" y="12" width="6" height="2" />
            <rect x="9" y="10" width="4" height="2" />
          </>
        );
      case "eye":
        return (
          <>
            <rect x="4" y="4" width="8" height="2" />
            <rect x="2" y="6" width="12" height="4" />
            <rect x="4" y="10" width="8" height="2" />
            <rect x="6" y="6" width="4" height="4" fill="#090B10" />
          </>
        );
      case "bell":
        return (
          <>
            <rect x="6" y="2" width="4" height="2" />
            <rect x="4" y="4" width="8" height="7" />
            <rect x="2" y="11" width="12" height="2" />
            <rect x="7" y="13" width="2" height="2" />
          </>
        );
      case "megaphone":
        return (
          <>
            <rect x="10" y="2" width="3" height="10" />
            <rect x="6" y="4" width="4" height="6" />
            <rect x="2" y="6" width="4" height="3" />
            <rect x="4" y="9" width="2" height="4" />
          </>
        );
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
      // ====================================================================
      // 1. SOCIAL MEDIA & TECH BRANDS (28 PIXEL-ART LOGOS)
      // ====================================================================
      case "youtube":
        return (
          <>
            <rect x="2" y="3" width="12" height="10" />
            <rect x="1" y="4" width="14" height="8" />
            <rect x="6" y="5" width="2" height="6" fill="#090B10" />
            <rect x="8" y="6" width="2" height="4" fill="#090B10" />
            <rect x="10" y="7" width="1" height="2" fill="#090B10" />
          </>
        );
      case "x":
        return (
          <>
            <rect x="2" y="2" width="3" height="2" />
            <rect x="4" y="4" width="2" height="2" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="10" y="10" width="2" height="2" />
            <rect x="11" y="12" width="3" height="2" />
            <rect x="12" y="2" width="2" height="2" />
            <rect x="10" y="4" width="2" height="2" />
            <rect x="4" y="10" width="2" height="2" />
            <rect x="2" y="12" width="2" height="2" />
          </>
        );
      case "vercel":
        return (
          <>
            <rect x="7" y="2" width="2" height="2" />
            <rect x="6" y="4" width="4" height="2" />
            <rect x="5" y="6" width="6" height="2" />
            <rect x="4" y="8" width="8" height="2" />
            <rect x="3" y="10" width="10" height="2" />
            <rect x="2" y="12" width="12" height="2" />
          </>
        );
      case "instagram":
        return (
          <>
            <rect x="3" y="1" width="10" height="2" />
            <rect x="3" y="13" width="10" height="2" />
            <rect x="1" y="3" width="2" height="10" />
            <rect x="13" y="3" width="2" height="10" />
            <rect x="5" y="5" width="6" height="6" />
            <rect x="7" y="7" width="2" height="2" fill="#090B10" />
            <rect x="11" y="3" width="2" height="2" />
          </>
        );
      case "facebook":
        return (
          <>
            <rect x="2" y="1" width="12" height="14" />
            <rect x="9" y="3" width="4" height="2" fill="#090B10" />
            <rect x="8" y="4" width="2" height="11" fill="#090B10" />
            <rect x="6" y="7" width="6" height="2" fill="#090B10" />
          </>
        );
      case "tiktok":
        return (
          <>
            <rect x="8" y="1" width="2" height="11" />
            <rect x="10" y="2" width="3" height="2" />
            <rect x="12" y="4" width="2" height="2" />
            <rect x="4" y="8" width="4" height="2" />
            <rect x="3" y="10" width="2" height="3" />
            <rect x="5" y="12" width="5" height="2" />
          </>
        );
      case "google":
        return (
          <>
            <rect x="5" y="2" width="7" height="2" />
            <rect x="3" y="4" width="2" height="8" />
            <rect x="5" y="12" width="7" height="2" />
            <rect x="11" y="9" width="2" height="3" />
            <rect x="8" y="7" width="5" height="2" />
          </>
        );
      case "github":
        return (
          <>
            <rect x="3" y="2" width="2" height="2" />
            <rect x="11" y="2" width="2" height="2" />
            <rect x="2" y="4" width="12" height="6" />
            <rect x="4" y="6" width="2" height="2" fill="#090B10" />
            <rect x="10" y="6" width="2" height="2" fill="#090B10" />
            <rect x="5" y="10" width="6" height="5" />
            <rect x="3" y="11" width="2" height="2" />
          </>
        );
      case "gitlab":
        return (
          <>
            <rect x="2" y="2" width="3" height="5" />
            <rect x="11" y="2" width="3" height="5" />
            <rect x="1" y="7" width="14" height="3" />
            <rect x="3" y="10" width="10" height="2" />
            <rect x="6" y="12" width="4" height="2" />
          </>
        );
      case "discord":
        return (
          <>
            <rect x="3" y="3" width="3" height="2" />
            <rect x="10" y="3" width="3" height="2" />
            <rect x="1" y="5" width="14" height="6" />
            <rect x="4" y="7" width="2" height="2" fill="#090B10" />
            <rect x="10" y="7" width="2" height="2" fill="#090B10" />
            <rect x="2" y="11" width="4" height="2" />
            <rect x="10" y="11" width="4" height="2" />
          </>
        );
      case "twitch":
        return (
          <>
            <rect x="2" y="1" width="12" height="10" />
            <rect x="4" y="3" width="8" height="6" fill="#090B10" />
            <rect x="6" y="4" width="2" height="4" />
            <rect x="10" y="4" width="2" height="4" />
            <rect x="4" y="11" width="3" height="3" />
          </>
        );
      case "linkedin":
        return (
          <>
            <rect x="1" y="1" width="14" height="14" />
            <rect x="3" y="4" width="2" height="2" fill="#090B10" />
            <rect x="3" y="7" width="2" height="6" fill="#090B10" />
            <rect x="7" y="7" width="2" height="6" fill="#090B10" />
            <rect x="9" y="7" width="3" height="2" fill="#090B10" />
            <rect x="11" y="9" width="2" height="4" fill="#090B10" />
          </>
        );
      case "reddit":
        return (
          <>
            <rect x="8" y="1" width="4" height="2" />
            <rect x="7" y="3" width="2" height="2" />
            <rect x="2" y="5" width="12" height="8" />
            <rect x="5" y="7" width="2" height="2" fill="#090B10" />
            <rect x="9" y="7" width="2" height="2" fill="#090B10" />
            <rect x="5" y="10" width="6" height="1" fill="#090B10" />
          </>
        );
      case "telegram":
        return (
          <>
            <rect x="11" y="2" width="3" height="3" />
            <rect x="7" y="4" width="6" height="4" />
            <rect x="2" y="6" width="10" height="3" />
            <rect x="5" y="9" width="6" height="3" />
            <rect x="8" y="12" width="3" height="2" />
          </>
        );
      case "whatsapp":
        return (
          <>
            <rect x="4" y="1" width="8" height="2" />
            <rect x="2" y="3" width="12" height="9" />
            <rect x="2" y="12" width="4" height="3" />
            <rect x="5" y="5" width="2" height="3" fill="#090B10" />
            <rect x="7" y="8" width="4" height="2" fill="#090B10" />
          </>
        );
      case "spotify":
        return (
          <>
            <rect x="3" y="2" width="10" height="12" />
            <rect x="2" y="4" width="12" height="8" />
            <rect x="4" y="5" width="8" height="1" fill="#090B10" />
            <rect x="4" y="8" width="7" height="1" fill="#090B10" />
            <rect x="5" y="11" width="5" height="1" fill="#090B10" />
          </>
        );
      case "apple":
        return (
          <>
            <rect x="8" y="1" width="3" height="2" />
            <rect x="3" y="4" width="10" height="8" />
            <rect x="11" y="6" width="2" height="3" fill="#090B10" />
            <rect x="4" y="12" width="3" height="2" />
            <rect x="9" y="12" width="3" height="2" />
          </>
        );
      case "windows":
        return (
          <>
            <rect x="2" y="2" width="5" height="5" />
            <rect x="9" y="2" width="5" height="5" />
            <rect x="2" y="9" width="5" height="5" />
            <rect x="9" y="9" width="5" height="5" />
          </>
        );
      case "linux":
        return (
          <>
            <rect x="5" y="1" width="6" height="5" />
            <rect x="6" y="3" width="1" height="1" fill="#090B10" />
            <rect x="9" y="3" width="1" height="1" fill="#090B10" />
            <rect x="3" y="6" width="10" height="7" />
            <rect x="6" y="7" width="4" height="5" fill="#090B10" />
            <rect x="3" y="13" width="3" height="2" />
            <rect x="10" y="13" width="3" height="2" />
          </>
        );
      case "android":
        return (
          <>
            <rect x="4" y="1" width="1" height="2" />
            <rect x="11" y="1" width="1" height="2" />
            <rect x="3" y="3" width="10" height="4" />
            <rect x="5" y="4" width="1" height="1" fill="#090B10" />
            <rect x="10" y="4" width="1" height="1" fill="#090B10" />
            <rect x="3" y="8" width="10" height="6" />
            <rect x="1" y="8" width="1" height="4" />
            <rect x="14" y="8" width="1" height="4" />
          </>
        );
      case "anthropic":
        return (
          <>
            <rect x="7" y="1" width="2" height="14" />
            <rect x="1" y="7" width="14" height="2" />
            <rect x="3" y="3" width="3" height="3" />
            <rect x="10" y="3" width="3" height="3" />
            <rect x="3" y="10" width="3" height="3" />
            <rect x="10" y="10" width="3" height="3" />
          </>
        );
      case "openai":
        return (
          <>
            <rect x="5" y="1" width="6" height="2" />
            <rect x="2" y="3" width="3" height="6" />
            <rect x="11" y="3" width="3" height="6" />
            <rect x="3" y="9" width="3" height="4" />
            <rect x="10" y="9" width="3" height="4" />
            <rect x="5" y="13" width="6" height="2" />
            <rect x="6" y="6" width="4" height="4" />
          </>
        );
      case "gemini-brand":
        return (
          <>
            <rect x="7" y="1" width="2" height="3" />
            <rect x="6" y="4" width="4" height="2" />
            <rect x="1" y="7" width="14" height="2" />
            <rect x="4" y="6" width="8" height="4" />
            <rect x="6" y="10" width="4" height="2" />
            <rect x="7" y="12" width="2" height="3" />
          </>
        );
      case "npm":
        return (
          <>
            <rect x="1" y="4" width="14" height="8" />
            <rect x="3" y="6" width="10" height="4" fill="#090B10" />
            <rect x="7" y="7" width="2" height="3" />
          </>
        );
      case "react":
        return (
          <>
            <rect x="7" y="7" width="2" height="2" />
            <rect x="3" y="3" width="10" height="2" />
            <rect x="3" y="11" width="10" height="2" />
            <rect x="1" y="6" width="3" height="4" />
            <rect x="12" y="6" width="3" height="4" />
          </>
        );
      case "nextjs":
        return (
          <>
            <rect x="2" y="2" width="12" height="12" />
            <rect x="4" y="4" width="2" height="8" fill="#090B10" />
            <rect x="6" y="6" width="2" height="2" fill="#090B10" />
            <rect x="8" y="8" width="2" height="2" fill="#090B10" />
            <rect x="10" y="4" width="2" height="8" fill="#090B10" />
          </>
        );
      case "blender":
        return (
          <>
            <rect x="6" y="2" width="5" height="2" />
            <rect x="2" y="5" width="4" height="2" />
            <rect x="4" y="6" width="10" height="8" />
            <rect x="7" y="8" width="4" height="4" fill="#090B10" />
          </>
        );
      case "figma":
        return (
          <>
            <rect x="4" y="1" width="4" height="4" />
            <rect x="8" y="1" width="4" height="4" />
            <rect x="4" y="6" width="4" height="4" />
            <rect x="9" y="6" width="3" height="4" />
            <rect x="4" y="11" width="4" height="4" />
          </>
        );

      // ====================================================================
      // 2. NAVIGATION & LAYOUT ICONS
      // ====================================================================
      case "home":
        return (
          <>
            <rect x="7" y="1" width="2" height="2" />
            <rect x="5" y="3" width="6" height="2" />
            <rect x="3" y="5" width="10" height="2" />
            <rect x="1" y="7" width="14" height="2" />
            <rect x="3" y="9" width="10" height="6" />
            <rect x="6" y="11" width="4" height="4" fill="#090B10" />
          </>
        );
      case "menu":
        return (
          <>
            <rect x="2" y="3" width="12" height="2" />
            <rect x="2" y="7" width="12" height="2" />
            <rect x="2" y="11" width="12" height="2" />
          </>
        );
      case "arrow-left":
        return (
          <>
            <rect x="4" y="7" width="10" height="2" />
            <rect x="6" y="4" width="2" height="2" />
            <rect x="4" y="6" width="2" height="4" />
            <rect x="6" y="10" width="2" height="2" />
          </>
        );
      case "arrow-up":
        return (
          <>
            <rect x="7" y="4" width="2" height="10" />
            <rect x="6" y="2" width="4" height="2" />
            <rect x="4" y="4" width="8" height="2" />
          </>
        );
      case "arrow-down":
        return (
          <>
            <rect x="7" y="2" width="2" height="10" />
            <rect x="4" y="10" width="8" height="2" />
            <rect x="6" y="12" width="4" height="2" />
          </>
        );
      case "chevron-right":
        return (
          <>
            <rect x="5" y="2" width="2" height="2" />
            <rect x="7" y="4" width="2" height="2" />
            <rect x="9" y="6" width="2" height="4" />
            <rect x="7" y="10" width="2" height="2" />
            <rect x="5" y="12" width="2" height="2" />
          </>
        );
      case "chevron-left":
        return (
          <>
            <rect x="9" y="2" width="2" height="2" />
            <rect x="7" y="4" width="2" height="2" />
            <rect x="5" y="6" width="2" height="4" />
            <rect x="7" y="10" width="2" height="2" />
            <rect x="9" y="12" width="2" height="2" />
          </>
        );
      case "chevron-up":
        return (
          <>
            <rect x="2" y="9" width="2" height="2" />
            <rect x="4" y="7" width="2" height="2" />
            <rect x="6" y="5" width="4" height="2" />
            <rect x="10" y="7" width="2" height="2" />
            <rect x="12" y="9" width="2" height="2" />
          </>
        );
      case "chevron-down":
        return (
          <>
            <rect x="2" y="5" width="2" height="2" />
            <rect x="4" y="7" width="2" height="2" />
            <rect x="6" y="9" width="4" height="2" />
            <rect x="10" y="7" width="2" height="2" />
            <rect x="12" y="5" width="2" height="2" />
          </>
        );
      case "expand":
        return (
          <>
            <rect x="2" y="2" width="4" height="2" />
            <rect x="2" y="4" width="2" height="2" />
            <rect x="10" y="2" width="4" height="2" />
            <rect x="12" y="4" width="2" height="2" />
            <rect x="2" y="10" width="2" height="4" />
            <rect x="4" y="12" width="2" height="2" />
            <rect x="12" y="10" width="2" height="4" />
            <rect x="10" y="12" width="2" height="2" />
          </>
        );
      case "plus":
        return (
          <>
            <rect x="7" y="2" width="2" height="12" />
            <rect x="2" y="7" width="12" height="2" />
          </>
        );
      case "minus":
        return <rect x="2" y="7" width="12" height="2" />;
      case "command":
        return (
          <>
            <rect x="5" y="1" width="2" height="14" />
            <rect x="9" y="1" width="2" height="14" />
            <rect x="1" y="5" width="14" height="2" />
            <rect x="1" y="9" width="14" height="2" />
            <rect x="1" y="1" width="4" height="2" />
            <rect x="1" y="1" width="2" height="4" />
            <rect x="11" y="1" width="4" height="2" />
            <rect x="13" y="1" width="2" height="4" />
            <rect x="1" y="13" width="4" height="2" />
            <rect x="1" y="11" width="2" height="4" />
            <rect x="11" y="13" width="4" height="2" />
            <rect x="13" y="11" width="2" height="4" />
          </>
        );
      case "minimize":
        return (
          <>
            <rect x="4" y="2" width="2" height="4" />
            <rect x="2" y="4" width="4" height="2" />
            <rect x="10" y="2" width="2" height="4" />
            <rect x="10" y="4" width="4" height="2" />
            <rect x="2" y="10" width="4" height="2" />
            <rect x="4" y="10" width="2" height="4" />
            <rect x="10" y="10" width="4" height="2" />
            <rect x="10" y="10" width="2" height="4" />
          </>
        );
      case "refresh":
      case "sync":
        return (
          <>
            <rect x="4" y="2" width="8" height="2" />
            <rect x="11" y="1" width="3" height="4" />
            <rect x="2" y="4" width="2" height="5" />
            <rect x="12" y="7" width="2" height="5" />
            <rect x="4" y="12" width="8" height="2" />
            <rect x="2" y="11" width="3" height="4" />
          </>
        );
      case "login":
        return (
          <>
            <rect x="8" y="2" width="6" height="12" />
            <rect x="10" y="4" width="2" height="8" fill="#090B10" />
            <rect x="1" y="7" width="8" height="2" />
            <rect x="6" y="5" width="2" height="6" />
          </>
        );
      case "logout":
        return (
          <>
            <rect x="2" y="2" width="6" height="12" />
            <rect x="4" y="4" width="2" height="8" fill="#090B10" />
            <rect x="7" y="7" width="8" height="2" />
            <rect x="12" y="5" width="2" height="6" />
          </>
        );

      // ====================================================================
      // 3. COMMUNICATION & SOCIAL ACTIONS
      // ====================================================================
      case "chat-dots":
        return (
          <>
            <rect x="1" y="2" width="14" height="9" />
            <rect x="3" y="11" width="3" height="3" />
            <rect x="4" y="5" width="2" height="2" fill="#090B10" />
            <rect x="7" y="5" width="2" height="2" fill="#090B10" />
            <rect x="10" y="5" width="2" height="2" fill="#090B10" />
          </>
        );
      case "mail":
        return (
          <>
            <rect x="1" y="3" width="14" height="10" />
            <rect x="3" y="5" width="2" height="2" fill="#090B10" />
            <rect x="5" y="7" width="2" height="2" fill="#090B10" />
            <rect x="7" y="8" width="2" height="2" fill="#090B10" />
            <rect x="9" y="7" width="2" height="2" fill="#090B10" />
            <rect x="11" y="5" width="2" height="2" fill="#090B10" />
          </>
        );
      case "inbox":
        return (
          <>
            <rect x="2" y="2" width="12" height="12" />
            <rect x="4" y="4" width="8" height="5" fill="#090B10" />
            <rect x="6" y="9" width="4" height="2" fill="#090B10" />
          </>
        );
      case "send":
        return (
          <>
            <rect x="12" y="2" width="2" height="3" />
            <rect x="8" y="4" width="5" height="4" />
            <rect x="2" y="6" width="9" height="3" />
            <rect x="6" y="9" width="5" height="4" />
          </>
        );
      case "thumbs-up":
        return (
          <>
            <rect x="7" y="1" width="3" height="5" />
            <rect x="5" y="6" width="9" height="7" />
            <rect x="2" y="6" width="2" height="7" />
          </>
        );
      case "thumbs-down":
        return (
          <>
            <rect x="2" y="3" width="2" height="7" />
            <rect x="5" y="3" width="9" height="7" />
            <rect x="7" y="10" width="3" height="5" />
          </>
        );
      case "bell-off":
        return (
          <>
            <rect x="2" y="2" width="2" height="2" />
            <rect x="5" y="3" width="6" height="8" />
            <rect x="3" y="11" width="10" height="2" />
            <rect x="12" y="12" width="2" height="2" />
          </>
        );
      case "phone":
        return (
          <>
            <rect x="2" y="2" width="4" height="4" />
            <rect x="4" y="6" width="3" height="3" />
            <rect x="7" y="9" width="3" height="3" />
            <rect x="10" y="10" width="4" height="4" />
          </>
        );
      case "video-cam":
        return (
          <>
            <rect x="1" y="4" width="9" height="8" />
            <rect x="10" y="6" width="2" height="4" />
            <rect x="12" y="4" width="3" height="8" />
          </>
        );
      case "mic":
        return (
          <>
            <rect x="6" y="1" width="4" height="7" />
            <rect x="4" y="6" width="8" height="4" />
            <rect x="7" y="10" width="2" height="4" />
            <rect x="5" y="13" width="6" height="2" />
          </>
        );
      case "mic-off":
        return (
          <>
            <rect x="6" y="1" width="4" height="7" />
            <rect x="2" y="2" width="3" height="3" />
            <rect x="4" y="6" width="8" height="4" />
            <rect x="7" y="10" width="2" height="4" />
            <rect x="11" y="11" width="3" height="3" />
          </>
        );
      case "rss":
        return (
          <>
            <rect x="2" y="11" width="3" height="3" />
            <rect x="2" y="6" width="6" height="2" />
            <rect x="7" y="8" width="2" height="6" />
            <rect x="2" y="2" width="10" height="2" />
            <rect x="11" y="4" width="2" height="10" />
          </>
        );
      case "flag":
        return (
          <>
            <rect x="3" y="1" width="2" height="14" />
            <rect x="5" y="2" width="9" height="6" />
          </>
        );
      case "at-sign":
        return (
          <>
            <rect x="4" y="2" width="8" height="2" />
            <rect x="2" y="4" width="2" height="8" />
            <rect x="12" y="4" width="2" height="6" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="4" y="12" width="8" height="2" />
          </>
        );

      // ====================================================================
      // 4. FILES, CODE & EDITING
      // ====================================================================
      case "file-code":
        return (
          <>
            <rect x="3" y="1" width="10" height="14" />
            <rect x="5" y="6" width="2" height="4" fill="#090B10" />
            <rect x="9" y="6" width="2" height="4" fill="#090B10" />
          </>
        );
      case "folder-open":
        return (
          <>
            <rect x="1" y="2" width="5" height="2" />
            <rect x="1" y="4" width="12" height="4" />
            <rect x="2" y="8" width="13" height="6" />
          </>
        );
      case "save":
        return (
          <>
            <rect x="2" y="2" width="12" height="12" />
            <rect x="5" y="2" width="6" height="4" fill="#090B10" />
            <rect x="4" y="9" width="8" height="5" fill="#090B10" />
          </>
        );
      case "upload":
        return (
          <>
            <rect x="7" y="3" width="2" height="8" />
            <rect x="5" y="5" width="6" height="2" />
            <rect x="2" y="12" width="12" height="2" />
          </>
        );
      case "cloud":
        return (
          <>
            <rect x="5" y="4" width="6" height="3" />
            <rect x="2" y="7" width="12" height="5" />
          </>
        );
      case "cloud-upload":
        return (
          <>
            <rect x="5" y="3" width="6" height="3" />
            <rect x="2" y="6" width="12" height="4" />
            <rect x="7" y="10" width="2" height="5" />
          </>
        );
      case "cloud-download":
        return (
          <>
            <rect x="5" y="2" width="6" height="3" />
            <rect x="2" y="5" width="12" height="4" />
            <rect x="7" y="9" width="2" height="6" />
            <rect x="5" y="12" width="6" height="2" />
          </>
        );
      case "clipboard":
        return (
          <>
            <rect x="5" y="1" width="6" height="3" />
            <rect x="3" y="3" width="10" height="12" />
            <rect x="5" y="6" width="6" height="6" fill="#090B10" />
          </>
        );
      case "edit":
      case "pen":
        return (
          <>
            <rect x="11" y="2" width="3" height="3" />
            <rect x="8" y="5" width="3" height="3" />
            <rect x="5" y="8" width="3" height="3" />
            <rect x="2" y="11" width="3" height="3" />
          </>
        );
      case "trash":
        return (
          <>
            <rect x="5" y="1" width="6" height="2" />
            <rect x="2" y="3" width="12" height="2" />
            <rect x="4" y="5" width="8" height="10" />
            <rect x="6" y="7" width="1" height="6" fill="#090B10" />
            <rect x="9" y="7" width="1" height="6" fill="#090B10" />
          </>
        );
      case "scissors":
        return (
          <>
            <rect x="2" y="2" width="4" height="4" />
            <rect x="2" y="10" width="4" height="4" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="10" y="3" width="4" height="3" />
            <rect x="10" y="10" width="4" height="3" />
          </>
        );
      case "link":
        return (
          <>
            <rect x="2" y="5" width="5" height="6" />
            <rect x="9" y="5" width="5" height="6" />
            <rect x="5" y="7" width="6" height="2" />
          </>
        );
      case "paperclip":
        return (
          <>
            <rect x="5" y="2" width="6" height="12" />
            <rect x="7" y="4" width="2" height="8" fill="#090B10" />
          </>
        );
      case "git-branch":
        return (
          <>
            <rect x="3" y="2" width="3" height="12" />
            <rect x="10" y="2" width="3" height="6" />
            <rect x="6" y="7" width="5" height="2" />
          </>
        );
      case "git-commit":
        return (
          <>
            <rect x="1" y="7" width="14" height="2" />
            <rect x="5" y="5" width="6" height="6" />
            <rect x="7" y="7" width="2" height="2" fill="#090B10" />
          </>
        );
      case "book":
        return (
          <>
            <rect x="2" y="2" width="5" height="12" />
            <rect x="9" y="2" width="5" height="12" />
            <rect x="7" y="3" width="2" height="11" />
          </>
        );

      // ====================================================================
      // 5. MEDIA, AUDIO & VIDEO
      // ====================================================================
      case "stop":
        return <rect x="3" y="3" width="10" height="10" />;
      case "skip-prev":
        return (
          <>
            <rect x="3" y="3" width="2" height="10" />
            <rect x="7" y="6" width="2" height="4" />
            <rect x="9" y="4" width="4" height="8" />
          </>
        );
      case "skip-next":
        return (
          <>
            <rect x="3" y="4" width="4" height="8" />
            <rect x="7" y="6" width="2" height="4" />
            <rect x="11" y="3" width="2" height="10" />
          </>
        );
      case "fast-forward":
        return (
          <>
            <rect x="2" y="4" width="4" height="8" />
            <rect x="6" y="6" width="2" height="4" />
            <rect x="9" y="4" width="4" height="8" />
            <rect x="13" y="6" width="2" height="4" />
          </>
        );
      case "rewind":
        return (
          <>
            <rect x="1" y="6" width="2" height="4" />
            <rect x="3" y="4" width="4" height="8" />
            <rect x="8" y="6" width="2" height="4" />
            <rect x="10" y="4" width="4" height="8" />
          </>
        );
      case "repeat":
        return (
          <>
            <rect x="3" y="3" width="10" height="2" />
            <rect x="3" y="11" width="10" height="2" />
            <rect x="2" y="5" width="2" height="6" />
            <rect x="12" y="5" width="2" height="6" />
          </>
        );
      case "shuffle":
        return (
          <>
            <rect x="2" y="4" width="4" height="2" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="10" y="4" width="4" height="2" />
            <rect x="2" y="10" width="4" height="2" />
            <rect x="10" y="10" width="4" height="2" />
          </>
        );
      case "headphones":
        return (
          <>
            <rect x="4" y="2" width="8" height="2" />
            <rect x="2" y="4" width="2" height="9" />
            <rect x="12" y="4" width="2" height="9" />
            <rect x="3" y="8" width="3" height="5" />
            <rect x="10" y="8" width="3" height="5" />
          </>
        );
      case "camera":
        return (
          <>
            <rect x="5" y="2" width="6" height="2" />
            <rect x="1" y="4" width="14" height="10" />
            <rect x="6" y="6" width="4" height="5" fill="#090B10" />
          </>
        );
      case "image":
        return (
          <>
            <rect x="1" y="2" width="14" height="12" />
            <rect x="3" y="4" width="10" height="8" fill="#090B10" />
            <rect x="4" y="5" width="2" height="2" />
            <rect x="5" y="9" width="7" height="3" />
          </>
        );
      case "film":
        return (
          <>
            <rect x="2" y="1" width="12" height="14" />
            <rect x="5" y="3" width="6" height="4" fill="#090B10" />
            <rect x="5" y="9" width="6" height="4" fill="#090B10" />
          </>
        );
      case "equalizer":
        return (
          <>
            <rect x="2" y="6" width="2" height="8" />
            <rect x="5" y="2" width="2" height="12" />
            <rect x="8" y="8" width="2" height="6" />
            <rect x="11" y="4" width="2" height="10" />
          </>
        );

      // ====================================================================
      // 6. COMMERCE, ANALYTICS & TROPHIES
      // ====================================================================
      case "dollar":
        return (
          <>
            <rect x="7" y="1" width="2" height="14" />
            <rect x="4" y="3" width="8" height="2" />
            <rect x="4" y="5" width="2" height="2" />
            <rect x="4" y="7" width="8" height="2" />
            <rect x="10" y="9" width="2" height="2" />
            <rect x="4" y="11" width="8" height="2" />
          </>
        );
      case "credit-card":
        return (
          <>
            <rect x="1" y="3" width="14" height="10" />
            <rect x="1" y="5" width="14" height="2" fill="#090B10" />
            <rect x="3" y="9" width="4" height="2" fill="#090B10" />
          </>
        );
      case "wallet":
        return (
          <>
            <rect x="2" y="3" width="12" height="10" />
            <rect x="10" y="6" width="4" height="4" fill="#090B10" />
            <rect x="11" y="7" width="2" height="2" />
          </>
        );
      case "cart":
        return (
          <>
            <rect x="1" y="2" width="3" height="2" />
            <rect x="3" y="4" width="11" height="6" />
            <rect x="4" y="12" width="2" height="2" />
            <rect x="10" y="12" width="2" height="2" />
          </>
        );
      case "shopping-bag":
        return (
          <>
            <rect x="5" y="2" width="6" height="3" />
            <rect x="3" y="5" width="10" height="9" />
          </>
        );
      case "tag":
        return (
          <>
            <rect x="2" y="2" width="6" height="6" />
            <rect x="6" y="6" width="6" height="6" />
            <rect x="4" y="4" width="2" height="2" fill="#090B10" />
          </>
        );
      case "percent":
        return (
          <>
            <rect x="3" y="3" width="3" height="3" />
            <rect x="10" y="10" width="3" height="3" />
            <rect x="11" y="3" width="2" height="2" />
            <rect x="7" y="7" width="2" height="2" />
            <rect x="3" y="11" width="2" height="2" />
          </>
        );
      case "chart-pie":
        return (
          <>
            <rect x="3" y="3" width="10" height="10" />
            <rect x="8" y="3" width="5" height="5" fill="#090B10" />
            <rect x="9" y="2" width="5" height="5" />
          </>
        );
      case "trending-up":
        return (
          <>
            <rect x="2" y="10" width="3" height="2" />
            <rect x="5" y="8" width="3" height="2" />
            <rect x="8" y="6" width="3" height="2" />
            <rect x="10" y="3" width="4" height="4" />
          </>
        );
      case "trending-down":
        return (
          <>
            <rect x="2" y="4" width="3" height="2" />
            <rect x="5" y="6" width="3" height="2" />
            <rect x="8" y="8" width="3" height="2" />
            <rect x="10" y="9" width="4" height="4" />
          </>
        );
      case "calculator":
        return (
          <>
            <rect x="3" y="1" width="10" height="14" />
            <rect x="5" y="3" width="6" height="3" fill="#090B10" />
            <rect x="5" y="8" width="2" height="2" fill="#090B10" />
            <rect x="9" y="8" width="2" height="2" fill="#090B10" />
            <rect x="5" y="11" width="2" height="2" fill="#090B10" />
            <rect x="9" y="11" width="2" height="2" fill="#090B10" />
          </>
        );

      // ====================================================================
      // 7. SYSTEM, USERS & SECURITY
      // ====================================================================
      case "hammer":
        return (
          <>
            <rect x="3" y="2" width="10" height="4" />
            <rect x="7" y="6" width="2" height="8" />
          </>
        );
      case "unlock":
        return (
          <>
            <rect x="8" y="1" width="5" height="5" />
            <rect x="3" y="6" width="10" height="8" />
            <rect x="7" y="9" width="2" height="2" fill="#090B10" />
          </>
        );
      case "eye-off":
        return (
          <>
            <rect x="2" y="6" width="12" height="4" />
            <rect x="2" y="2" width="3" height="3" />
            <rect x="11" y="11" width="3" height="3" />
          </>
        );
      case "user":
        return (
          <>
            <rect x="5" y="2" width="6" height="5" />
            <rect x="3" y="8" width="10" height="6" />
          </>
        );
      case "user-plus":
        return (
          <>
            <rect x="4" y="2" width="5" height="5" />
            <rect x="2" y="8" width="9" height="6" />
            <rect x="12" y="4" width="2" height="6" />
            <rect x="10" y="6" width="6" height="2" />
          </>
        );
      case "wifi":
        return (
          <>
            <rect x="2" y="3" width="12" height="2" />
            <rect x="4" y="6" width="8" height="2" />
            <rect x="6" y="9" width="4" height="2" />
            <rect x="7" y="12" width="2" height="2" />
          </>
        );
      case "bluetooth":
        return (
          <>
            <rect x="7" y="1" width="2" height="14" />
            <rect x="9" y="3" width="3" height="3" />
            <rect x="9" y="10" width="3" height="3" />
            <rect x="4" y="5" width="3" height="2" />
            <rect x="4" y="9" width="3" height="2" />
          </>
        );
      case "battery-full":
        return (
          <>
            <rect x="1" y="4" width="12" height="8" />
            <rect x="13" y="6" width="2" height="4" />
          </>
        );
      case "battery-low":
        return (
          <>
            <rect x="1" y="4" width="12" height="8" />
            <rect x="5" y="6" width="6" height="4" fill="#090B10" />
            <rect x="13" y="6" width="2" height="4" />
          </>
        );
      case "power":
        return (
          <>
            <rect x="7" y="1" width="2" height="7" />
            <rect x="3" y="4" width="2" height="8" />
            <rect x="11" y="4" width="2" height="8" />
            <rect x="5" y="12" width="6" height="2" />
          </>
        );
      case "calendar":
        return (
          <>
            <rect x="4" y="1" width="2" height="2" />
            <rect x="10" y="1" width="2" height="2" />
            <rect x="2" y="3" width="12" height="11" />
            <rect x="4" y="6" width="8" height="6" fill="#090B10" />
          </>
        );
      case "map-pin":
        return (
          <>
            <rect x="5" y="1" width="6" height="2" />
            <rect x="3" y="3" width="10" height="6" />
            <rect x="7" y="5" width="2" height="2" fill="#090B10" />
            <rect x="5" y="9" width="6" height="3" />
            <rect x="7" y="12" width="2" height="3" />
          </>
        );
      case "compass":
        return (
          <>
            <rect x="3" y="2" width="10" height="12" />
            <rect x="7" y="4" width="3" height="4" fill="#090B10" />
            <rect x="6" y="8" width="3" height="4" fill="#090B10" />
          </>
        );
      case "globe":
        return (
          <>
            <rect x="4" y="1" width="8" height="2" />
            <rect x="2" y="3" width="12" height="10" />
            <rect x="4" y="13" width="8" height="2" />
            <rect x="7" y="3" width="2" height="10" fill="#090B10" />
            <rect x="3" y="7" width="10" height="2" fill="#090B10" />
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
   16 ANIMATED PIXEL-ART AI & LAB CHARACTER SPRITES (16x16 Crisp Grid)
   ============================================================================ */

export type PixelSpriteCharacter =
  | "mixiuh"
  | "carbon"
  | "argon"
  | "opus"
  | "sonnet"
  | "haiku"
  | "flash"
  | "crt-monitor"
  | "floppy-bot"
  | "cyber-cat"
  | "mech-drone"
  | "knight-debugger"
  | "wizard-llm"
  | "arcade-invader"
  | "glitch-boss"
  | "pocket-lab";

export type PixelSpriteMotion = "float" | "bounce" | "pulse" | "none";

export interface PixelSpriteProps {
  character: PixelSpriteCharacter;
  size?: number;
  animate?: boolean;
  motion?: PixelSpriteMotion;
  className?: string;
}

export function PixelSprite({
  character,
  size = 44,
  animate = true,
  motion = "float",
  className = "",
}: PixelSpriteProps) {
  const paletteMap: Record<
    PixelSpriteCharacter,
    {
      body: string;
      accent: string;
      visor: string;
      crown?: string;
      ears?: "cat" | "antenna" | "horns" | "hat";
    }
  > = {
    mixiuh: {
      body: "#00E5FF",
      accent: "#FFD100",
      visor: "#090B10",
      crown: "#FFD100",
    },
    carbon: {
      body: "#00E5FF",
      accent: "#FFD100",
      visor: "#090B10",
      crown: "#10B981",
    },
    argon: { body: "#A855F7", accent: "#00E5FF", visor: "#090B10" },
    opus: {
      body: "#FF3355",
      accent: "#FFD100",
      visor: "#090B10",
      crown: "#FFD100",
    },
    sonnet: { body: "#38BDF8", accent: "#10B981", visor: "#090B10" },
    haiku: { body: "#10B981", accent: "#FFD100", visor: "#090B10" },
    flash: { body: "#FFD100", accent: "#FF3355", visor: "#090B10" },
    "crt-monitor": {
      body: "#E2DDD2",
      accent: "#00E5FF",
      visor: "#090B10",
      ears: "antenna",
    },
    "floppy-bot": {
      body: "#38BDF8",
      accent: "#F5F2EB",
      visor: "#090B10",
    },
    "cyber-cat": {
      body: "#FFD100",
      accent: "#FF3355",
      visor: "#090B10",
      ears: "cat",
    },
    "mech-drone": {
      body: "#10B981",
      accent: "#00E5FF",
      visor: "#090B10",
      ears: "antenna",
    },
    "knight-debugger": {
      body: "#94A3B8",
      accent: "#FFD100",
      visor: "#090B10",
      crown: "#FF3355",
    },
    "wizard-llm": {
      body: "#A855F7",
      accent: "#FFD100",
      visor: "#090B10",
      ears: "hat",
    },
    "arcade-invader": {
      body: "#FF3355",
      accent: "#00E5FF",
      visor: "#090B10",
      ears: "horns",
    },
    "glitch-boss": {
      body: "#FF3355",
      accent: "#A855F7",
      visor: "#090B10",
      ears: "horns",
    },
    "pocket-lab": {
      body: "#E2DDD2",
      accent: "#00E5FF",
      visor: "#090B10",
    },
  };

  const p = paletteMap[character] || paletteMap.mixiuh;
  const animClass = !animate
    ? ""
    : motion === "bounce"
    ? "animate-bounce"
    : motion === "pulse"
    ? "animate-pulse"
    : "animate-px-float";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`shrink-0 ${animClass} ${className}`}
      aria-label={character}
    >
      {/* Top Crown / Cat Ears / Wizard Hat / Antenna */}
      {p.ears === "cat" ? (
        <>
          <rect x="3" y="1" width="3" height="2" fill={p.accent} />
          <rect x="10" y="1" width="3" height="2" fill={p.accent} />
        </>
      ) : p.ears === "hat" ? (
        <>
          <rect x="6" y="0" width="4" height="2" fill={p.accent} />
          <rect x="2" y="2" width="12" height="2" fill={p.accent} />
        </>
      ) : p.ears === "horns" ? (
        <>
          <rect x="2" y="0" width="2" height="3" fill={p.accent} />
          <rect x="12" y="0" width="2" height="3" fill={p.accent} />
        </>
      ) : p.crown ? (
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

/* ============================================================================
   8 PURE PIXEL-ART ANIMATED MINI-SCENES & LOADERS (<PixelSceneAnimation />)
   ============================================================================ */

export type PixelSceneType =
  | "crt-boot"
  | "floppy-rw"
  | "ai-duel"
  | "campfire"
  | "potion-lab"
  | "radar-sweep"
  | "hourglass-sand"
  | "cassette-spin";

export function PixelSceneAnimation({
  scene,
  label,
}: {
  scene: PixelSceneType;
  label?: string;
}) {
  return (
    <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] flex flex-col items-center justify-between gap-2.5 font-mono-hud">
      <div className="w-full h-24 bg-[#111622] border border-white/10 px-dither-dots flex items-center justify-center relative overflow-hidden">
        {scene === "crt-boot" && (
          <div className="flex flex-col items-center gap-1">
            <PixelIcon
              name="crt-tv"
              size={34}
              color="#00E5FF"
              className="animate-px-float"
            />
            <span className="font-pixel text-[9px] text-[#10B981] animate-px-blink">
              BIOS OK // 640K RAM
            </span>
          </div>
        )}

        {scene === "floppy-rw" && (
          <div className="flex items-center gap-3">
            <PixelIcon
              name="floppy"
              size={34}
              color="#FFD100"
              className="animate-px-float"
            />
            <div className="space-y-1">
              <div className="font-pixel text-[9px] text-[#FFD100]">
                WRITING TRACK 08
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-[#00E5FF] animate-px-blink"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {scene === "ai-duel" && (
          <div className="flex items-center justify-between w-full px-4">
            <PixelSprite character="carbon" size={32} />
            <div className="flex-1 mx-2 h-1.5 bg-[#090B10] flex items-center justify-around">
              <span className="w-2 h-1.5 bg-[#00E5FF] animate-ping" />
              <span className="w-2 h-1.5 bg-[#FFD100] animate-px-blink" />
              <span className="w-2 h-1.5 bg-[#FF3355] animate-ping" />
            </div>
            <PixelSprite character="opus" size={32} />
          </div>
        )}

        {scene === "campfire" && (
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 bg-[#FFD100] animate-ping" />
              <span className="w-1.5 h-1.5 bg-[#FF3355] animate-px-blink" />
            </div>
            <PixelIcon
              name="campfire"
              size={34}
              color="#FF3355"
              className="animate-px-float"
            />
          </div>
        )}

        {scene === "potion-lab" && (
          <div className="flex flex-col items-center">
            <div className="flex gap-1.5 mb-0.5">
              <span className="w-2 h-2 bg-[#10B981] animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#00E5FF] animate-ping" />
            </div>
            <PixelIcon name="potion" size={32} color="#10B981" />
          </div>
        )}

        {scene === "radar-sweep" && (
          <div className="flex items-center gap-3">
            <PixelIcon
              name="radar"
              size={34}
              color="#10B981"
              className="animate-spin"
            />
            <div className="font-pixel text-[9px] text-[#10B981]">
              <div>TARGET LOCKED</div>
              <div className="text-[#FFD100] animate-px-blink">
                X:128 Y:064
              </div>
            </div>
          </div>
        )}

        {scene === "hourglass-sand" && (
          <div className="flex flex-col items-center gap-1">
            <PixelIcon
              name="hourglass"
              size={32}
              color="#FFD100"
              className="animate-px-float"
            />
            <span className="font-pixel text-[9px] text-[#00E5FF]">
              COMPILING SHADER...
            </span>
          </div>
        )}

        {scene === "cassette-spin" && (
          <div className="flex flex-col items-center gap-1">
            <PixelIcon
              name="cassette"
              size={34}
              color="#A855F7"
              className="animate-px-float"
            />
            <span className="font-pixel text-[9px] text-[#FFD100] animate-px-blink">
              PLAYING SIDE A // 60FPS
            </span>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between text-[10px]">
        <span className="font-pixel text-[#F5F2EB]">
          {label || scene.toUpperCase()}
        </span>
        <span className="text-[#00E5FF]">16x16 SCENE</span>
      </div>
    </div>
  );
}
