"use client";

import React, { useState } from "react";
import { EP04_CHALLENGES } from "@/data/ep04Data";
import {
  PixelButton,
  PixelKeycap,
  PixelToggle,
  PixelCrank,
  PixelWindow,
  PixelFloppyCard,
  PixelBarChart,
  PixelAudioSequencer,
  PixelDialogBox,
  PixelTelemetryPill,
  PixelCreditBadge,
  PixelSocialBar,
  PixelInput,
  PixelSelect,
  PixelAutocomplete,
  PixelCheckbox,
  PixelRadioGroup,
  PixelCollapse,
  PixelCalendar,
  PixelSlider,
  PixelMultiLineChart,
  PixelDonutGauge,
  PixelIcon,
  PixelSprite,
  PixelSceneAnimation,
  ALL_PIXEL_ICON_NAMES,
  PIXEL_ICON_CATEGORIES,
  PIXEL_CURSOR_PRESETS,
  copyTextToClipboard,
  usePixelSound,
  PIXEL_UI_VERSION,
  PixelContextMenu,
  PixelDataTable,
  PixelDrawer,
  PixelPopover,
  PixelSheet,
  PixelTooltip,
  PixelTabs,
  PixelCopyButton,
  PixelSwipeHint,
  pixelToast,
  type PixelColorTone,
  type PixelMenuItem,
  type PixelSoundName,
  type PixelSpriteCharacter,
  type PixelSpriteMotion,
  type PixelIconName,
  type PixelIconCategoryId,
  type PixelCursorStyle,
  type AmbientSimulationMode,
} from "@mixiuh/pixel-ui";

interface Ep04Row {
  n: number;
  name_es: string;
  name_en: string;
  haiku: number;
  sonnet: number;
  opus: number;
  winner: string;
}

const EP04_ROWS: Ep04Row[] = EP04_CHALLENGES.map((c) => ({
  n: c.n,
  name_es: c.name_es,
  name_en: c.name_en,
  haiku: c.haiku.usd,
  sonnet: c.sonnet.usd,
  opus: c.opus.usd,
  winner: c.winner,
}));

const SOUND_PRESETS: {
  id: PixelSoundName;
  label: string;
  desc_es: string;
  desc_en: string;
}[] = [
  {
    id: "click",
    label: "SFX_CLICK",
    desc_es: "Interruptor mecanico de terminal (1950Hz -> 620Hz)",
    desc_en: "Mechanical terminal micro-switch (1950Hz -> 620Hz)",
  },
  {
    id: "crank",
    label: "SFX_TUNER_DIAL",
    desc_es: "Perilla rotativa VHF/UHF de televisor CRT",
    desc_en: "CRT TV VHF/UHF rotary tuner dial tick",
  },
  {
    id: "coin",
    label: "SFX_COIN",
    desc_es: "Moneda arcade 8-bit (B5 -> E6 onda cuadrada)",
    desc_en: "8-bit arcade coin pickup (B5 -> E6 square wave)",
  },
  {
    id: "powerup",
    label: "SFX_POWERUP",
    desc_es: "Arpegio ascendente de 6 notas chiptune",
    desc_en: "6-note ascending chiptune arpeggio",
  },
  {
    id: "cartridgeInsert",
    label: "SFX_FLOPPY_LOAD",
    desc_es: "Encaje mecanico de disquete 3.5 + acorde BIOS",
    desc_en: "3.5 floppy disk lock + BIOS boot chord",
  },
  {
    id: "laser",
    label: "SFX_DEGAUSS",
    desc_es: "Pulso magnetico de desmagnetizacion CRT",
    desc_en: "Magnetic CRT degauss frequency sweep",
  },
  {
    id: "jump",
    label: "SFX_JUMP",
    desc_es: "Salto de plataformas 8-bit (210Hz -> 680Hz)",
    desc_en: "8-bit platformer jump bend (210Hz -> 680Hz)",
  },
  {
    id: "hit",
    label: "SFX_CRT_OFF",
    desc_es: "Colapso de tubo catodico / impacto retro",
    desc_en: "Cathode-ray tube power-down / impact thud",
  },
  {
    id: "dialogBlip",
    label: "SFX_DIALOG",
    desc_es: "Voz sintetizada de dialogo RPG por letra",
    desc_en: "Per-character RPG typewriter voice blip",
  },
  {
    id: "achievement",
    label: "SFX_FANFARE",
    desc_es: "Fanfarria de logro desbloqueado en 4 tiempos",
    desc_en: "4-step achievement unlocked fanfare",
  },
  {
    id: "toggleOn",
    label: "SFX_SWITCH_ON",
    desc_es: "Interruptor fisico activado (C5 -> G5)",
    desc_en: "Physical dip-switch ON (C5 -> G5)",
  },
  {
    id: "hover",
    label: "SFX_TICK_1BIT",
    desc_es: "Pulso sutil 1-bit al pasar el cursor",
    desc_en: "Subtle 1-bit cursor hover tick",
  },
];

const SPRITE_LIST: {
  id: PixelSpriteCharacter;
  name: string;
  role_es: string;
  role_en: string;
}[] = [
  { id: "mixiuh", name: "MIXIUH", role_es: "Director Lab", role_en: "Lab Director" },
  { id: "carbon", name: "CARBON", role_es: "Reactor #1", role_en: "#1 Reactor" },
  { id: "argon", name: "ARGON", role_es: "Nucleo Neural", role_en: "Neural Core" },
  { id: "opus", name: "OPUS 5.5", role_es: "Arquitecto", role_en: "Architect" },
  { id: "sonnet", name: "SONNET 5.5", role_es: "Unidad Synth", role_en: "Synth Unit" },
  { id: "haiku", name: "HAIKU 5.5", role_es: "Velocidad", role_en: "Speed Unit" },
  { id: "flash", name: "FLASH 3.8", role_es: "Rayo 8-Bit", role_en: "8-Bit Bolt" },
  { id: "crt-monitor", name: "CRT BOT", role_es: "Tele-Monitor", role_en: "Tele-Monitor" },
  { id: "floppy-bot", name: "FLOPPY BOT", role_es: "Unidad 1.44MB", role_en: "1.44MB Unit" },
  { id: "cyber-cat", name: "CYBER CAT", role_es: "Gato de Lab", role_en: "Lab Cat" },
  { id: "mech-drone", name: "MECH DRONE", role_es: "Dron IA", role_en: "AI Drone" },
  { id: "knight-debugger", name: "DEBUGGER", role_es: "Caza-Bugs", role_en: "Bug Slayer" },
  { id: "wizard-llm", name: "ALCHEMIST", role_es: "Mago Prompt", role_en: "Prompt Mage" },
  { id: "arcade-invader", name: "INVADER", role_es: "Invasor 80s", role_en: "80s Invader" },
  { id: "glitch-boss", name: "GLITCH BOSS", role_es: "Jefe Final", role_en: "Final Boss" },
  { id: "pocket-lab", name: "TERMINAL", role_es: "Estacion 3D", role_en: "3D Station" },
];

export interface PixelUiShowcaseProps {
  lang: "es" | "en";
  cursorStyle?: PixelCursorStyle;
  onChangeCursor?: (c: PixelCursorStyle) => void;
  ambientMode?: AmbientSimulationMode;
  onChangeAmbient?: (m: AmbientSimulationMode) => void;
}

export default function PixelUiShowcase({
  lang,
  cursorStyle = "cyber-arrow",
  onChangeCursor,
  ambientMode = "ai-ecosystem",
  onChangeAmbient,
}: PixelUiShowcaseProps) {
  const { enabled: soundEnabled, play, toggle: toggleSound } = usePixelSound();
  const [tunerAngle, setTunerAngle] = useState(90);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [switchC, setSwitchC] = useState(true);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<PixelIconName>("youtube");
  const [iconCategory, setIconCategory] = useState<PixelIconCategoryId>("all");
  const [iconSearch, setIconSearch] = useState("");
  const [iconColor, setIconColor] = useState("#00E5FF");
  const [iconSize, setIconSize] = useState<16 | 24 | 32>(24);
  const [spriteMotion, setSpriteMotion] = useState<PixelSpriteMotion>("float");
  const [creditVariant, setCreditVariant] = useState<
    "pill" | "hardware" | "minimal" | "banner"
  >("hardware");

  // Live Customizer State for Pro Form, Navigation & Chart Components
  const [customTone, setCustomTone] = useState<PixelColorTone>("cyan");
  const [customSize, setCustomSize] = useState<"sm" | "md" | "lg">("md");
  const [demoInput, setDemoInput] = useState("gemini-4-carbon-zero-shot");
  const [demoSelect, setDemoSelect] = useState("carbon");
  const [demoAuto, setDemoAuto] = useState("ep04-acid-synth");
  const [demoCheckA, setDemoCheckA] = useState(true);
  const [demoCheckB, setDemoCheckB] = useState(true);
  const [demoCheckC, setDemoCheckC] = useState(false);
  const [demoRadio, setDemoRadio] = useState("60fps");
  const [demoSlider, setDemoSlider] = useState(60);
  const [demoCalDate, setDemoCalDate] = useState("2026-10-30");
  const [demoTab, setDemoTab] = useState<"palette" | "toasts" | "a11y">(
    "palette"
  );
  const [demoDrawer, setDemoDrawer] = useState(false);
  const [demoSheet, setDemoSheet] = useState(false);
  const contextMenuItems: PixelMenuItem[] = [
    { type: "label", id: "lbl", label: lang === "es" ? "CARTUCHO EP04" : "EP04 CARTRIDGE" },
    {
      id: "load",
      label: lang === "es" ? "Cargar cartucho" : "Load cartridge",
      icon: "play",
      shortcut: "Enter",
      onSelect: () => pixelToast.show({ title: lang === "es" ? "CARTUCHO CARGADO" : "CARTRIDGE LOADED", tone: "emerald", icon: "cartridge" }),
    },
    {
      id: "copy",
      label: lang === "es" ? "Copiar ROM" : "Copy ROM",
      icon: "copy",
      shortcut: "Ctrl C",
      onSelect: () => pixelToast.show({ title: lang === "es" ? "ROM COPIADA" : "ROM COPIED", tone: "cyan", icon: "copy" }),
    },
    { type: "separator", id: "sep" },
    {
      id: "erase",
      label: lang === "es" ? "Borrar partida" : "Erase save",
      icon: "trash",
      danger: true,
      onSelect: () => pixelToast.show({ title: lang === "es" ? "PARTIDA BORRADA" : "SAVE ERASED", tone: "coral", icon: "trash", sound: "hit" }),
    },
  ];

  const overlaySnippet = `import {
  PixelCommandPalette,
  PixelToaster,
  pixelToast,
  PixelTabs,
} from "@mixiuh/pixel-ui";

<PixelCommandPalette open={open} onOpenChange={setOpen} items={[
  { id: "home", label: "Inicio", icon: "home", onSelect: goHome },
]} />
<PixelToaster />

pixelToast.show({ title: "GUARDADO", tone: "emerald", icon: "check" });`;

  const copyCode = (id: string, text: string) => {
    void copyTextToClipboard(text);
    play("coin");
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const categoryPool =
    iconCategory === "all"
      ? ALL_PIXEL_ICON_NAMES
      : PIXEL_ICON_CATEGORIES.find((c) => c.id === iconCategory)?.icons ||
        ALL_PIXEL_ICON_NAMES;

  const filteredIcons = categoryPool.filter((n) =>
    n.toLowerCase().includes(iconSearch.trim().toLowerCase())
  );

  const creditSnippet = `<!-- Mixiuh Pixel UI v${PIXEL_UI_VERSION} (Free Commercial & Personal Use with Attribution) -->
<link rel="stylesheet" href="https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui.css" />

<!-- React / Next.js Attribution Component -->
import { PixelCreditBadge } from "@mixiuh/pixel-ui";
<PixelCreditBadge variant="${creditVariant}" />

<!-- Plain HTML Attribution -->
<a href="https://labs.mixiuh.online#pixel-ui" target="_blank" rel="noopener">
  UI powered by Mixiuh Pixel UI (labs.mixiuh.online)
</a>`;

  return (
    <div className="py-8 sm:py-10 space-y-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HERO BANNER — RETRO CRT COMPUTER & OPEN SOURCE PIXEL UI */}
        <div className="bg-[#FFD100] text-[#090B10] border-3 border-[#090B10] shadow-[8px_8px_0_#040508] p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#090B10] text-[#FFD100] font-pixel text-xs font-bold">
                  {`@MIXIUH/PIXEL-UI v${PIXEL_UI_VERSION}`}
                </span>
                <span className="px-3 py-1 bg-[#F5F2EB] text-[#090B10] border-2 border-[#090B10] font-mono-hud text-xs font-bold">
                  {lang === "es"
                    ? "100% GRATIS · USO COMERCIAL Y PERSONAL CON CREDITO"
                    : "100% FREE · COMMERCIAL & PERSONAL USE WITH CREDIT"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.04]">
                {lang === "es"
                  ? "La Libreria Pixel-Art, Retro CRT 3D, Cursores y Audio 8-Bit Mas Completa del Mundo."
                  : "The World's Most Complete Pixel-Art, 3D Retro CRT, Custom Cursor & 8-Bit Audio UI Library."}
              </h1>

              <p className="text-sm sm:text-base font-medium text-[#090B10]/85 leading-relaxed">
                {lang === "es"
                  ? `Creada desde cero por Mixiuh Labs: combina superficies opacas de alto contraste con monitores CRT 3D, disquetes 3.5", ${ALL_PIXEL_ICON_NAMES.length} iconos vectoriales 16x16 (incluyendo 28 marcas y redes sociales como YouTube, X, Instagram, TikTok, Facebook, Google, GitHub, Discord), 16 sprites animados, 8 escenas pixel-art, 6 cursores personalizados, generacion procedural por pixeles al hacer scroll y un secuenciador WebAudio 8-bit.`
                  : `Built from scratch by Mixiuh Labs: combines high-contrast opaque surfaces with 3D CRT monitors, 3.5" floppy disks, ${ALL_PIXEL_ICON_NAMES.length} 16x16 vector icons (including 28 social & tech brands like YouTube, X, Instagram, TikTok, Facebook, Google, GitHub, Discord), 16 animated sprites, 8 pixel-art scenes, 6 custom cursors, procedural pixel scroll reveal, and an 8-bit WebAudio synth & sequencer.`}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/pixel-ui/mixiuh-pixel-ui-kit.zip"
                  download
                  onClick={() => play("powerup")}
                  className="px-btn bg-[#090B10] text-[#FFD100] px-5 py-3 text-xs sm:text-sm"
                >
                  <PixelIcon name="download" size={16} color="#FFD100" />
                  <span>
                    {lang === "es"
                      ? `Descargar Libreria v${PIXEL_UI_VERSION} (.ZIP)`
                      : `Download Library v${PIXEL_UI_VERSION} (.ZIP)`}
                  </span>
                </a>

                <a
                  href="/pixel-ui/mixiuh-pixel-ui.css"
                  download
                  onClick={() => play("coin")}
                  className="px-btn bg-[#F5F2EB] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                >
                  <PixelIcon name="code" size={16} color="#090B10" />
                  <span>mixiuh-pixel-ui.css (CDN)</span>
                </a>

                <button
                  type="button"
                  onClick={toggleSound}
                  className="px-btn bg-[#00E5FF] text-[#090B10] px-4 py-3 text-xs sm:text-sm"
                >
                  <PixelIcon
                    name={soundEnabled ? "volume-on" : "volume-off"}
                    size={16}
                    color="#090B10"
                  />
                  <span>
                    {soundEnabled ? "WEB AUDIO SFX: ON" : "WEB AUDIO SFX: OFF"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Retro VHF Tuner Dial & 3D Mechanical Keycaps */}
            <div className="lg:col-span-5 bg-[#090B10] text-[#F5F2EB] border-3 border-[#090B10] shadow-[6px_6px_0_rgba(0,0,0,0.35)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A344B] pb-2.5 font-mono-hud text-xs">
                <span className="font-pixel text-[#FFD100]">
                  CRT-9000 DECK // HARDWARE TEST
                </span>
                <span className="text-[#00E5FF] font-bold">VHF / 60Hz</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <PixelCrank
                  angle={tunerAngle}
                  onChange={setTunerAngle}
                  label={
                    lang === "es" ? "SINTONIZADOR VHF" : "VHF ROTARY TUNER"
                  }
                />
                <div className="flex items-center gap-2">
                  <PixelKeycap
                    keyLabel="A"
                    caption="COIN"
                    tone="yellow"
                    onTrigger={() => play("coin")}
                  />
                  <PixelKeycap
                    keyLabel="B"
                    caption="DEGAUSS"
                    tone="coral"
                    onTrigger={() => play("laser")}
                  />
                  <PixelKeycap
                    keyLabel="X"
                    caption="BOOT"
                    tone="cyan"
                    onTrigger={() => play("powerup")}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#131824] border border-[#2A344B] font-mono-hud text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">
                    {lang === "es"
                      ? "FRECUENCIA DE CANAL CRT"
                      : "CRT CHANNEL FREQUENCY"}
                  </span>
                  <span className="font-pixel text-[#00E5FF]">
                    {tunerAngle} MHz
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3"
                      style={{
                        backgroundColor:
                          i <= Math.floor((tunerAngle / 360) * 12)
                            ? "#00E5FF"
                            : "#090B10",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: CUSTOM PIXEL MOUSE & PROCEDURAL AI ECOSYSTEM CONTROLS */}
        <PixelWindow
          title="01 // PERSONALIZACION DE CURSOR PIXEL-ART Y ECOSISTEMA IA DE FONDO"
          subtitle={
            lang === "es"
              ? "Cambia el puntero del mouse en vivo y controla los agentes IA procedurales que patrullan el fondo"
              : "Switch your live mouse pointer and control the procedural AI agents patrolling the background"
          }
          tone="yellow"
          statusLeft={`ACTIVE CURSOR: ${cursorStyle.toUpperCase()}`}
          statusRight={`BACKGROUND ENGINE: ${ambientMode.toUpperCase()}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Pixel Cursor Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-[#FFD100]">
                  A. 6 CURSORES PIXEL-ART NATIVOS (USE_PIXEL_CURSOR)
                </span>
                <PixelIcon name="cursor-hand" size={16} color="#FFD100" />
              </div>
              <p className="text-xs text-[#94A3B8]">
                {lang === "es"
                  ? "Haz clic en cualquiera de los 6 estilos para cambiar inmediatamente el cursor de toda la web (incluye estado normal + mano pixelada sobre botones):"
                  : "Click any of the 6 styles to immediately switch the cursor across the entire website (includes normal state + pixel hand on buttons):"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PIXEL_CURSOR_PRESETS.map((c) => {
                  const active = cursorStyle === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onChangeCursor?.(c.id)}
                      className={`p-3 border-2 text-left transition cursor-pointer ${
                        active
                          ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold shadow-[3px_3px_0_#00E5FF]"
                          : "bg-[#131824] text-[#F5F2EB] border-[#2A344B] hover:border-[#FFD100]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <PixelIcon
                          name="mouse"
                          size={14}
                          color={active ? "#090B10" : c.accent}
                        />
                        <span className="font-pixel text-[10px]">
                          {active ? "ACTIVO" : "SELECT"}
                        </span>
                      </div>
                      <div className="font-mono-hud text-xs font-bold truncate">
                        {lang === "es" ? c.name_es : c.name_en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Procedural Background AI Simulation Mode Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-[#00E5FF]">
                  B. FONDO PROCEDURAL CON AGENTES IA (PIXEL_AMBIENT_BG)
                </span>
                <PixelIcon name="brain-ai" size={16} color="#00E5FF" />
              </div>
              <p className="text-xs text-[#94A3B8]">
                {lang === "es"
                  ? "Observa el fondo de la pagina: pequeños bots pixel-art (Carbon, Argon, Opus, Haiku) patrullan la grilla, conversan entre si enviando paquetes de datos, construyen nodos y escanean tu cursor al acercarte:"
                  : "Look at the page background: tiny pixel-art bots (Carbon, Argon, Opus, Haiku) patrol the grid, chat by exchanging data packets, build nodes, and scan your cursor when you move near them:"}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      id: "ai-ecosystem" as const,
                      es: "Ecosistema Agentes IA (Bots + Nodos)",
                      en: "AI Agent Ecosystem (Bots + Nodes)",
                    },
                    {
                      id: "neural-packets" as const,
                      es: "Solo Paquetes y Circuitos",
                      en: "Data Packets & Circuits Only",
                    },
                    {
                      id: "voxel-rain" as const,
                      es: "Lluvia Binaria Voxel 8-Bit",
                      en: "8-Bit Voxel Binary Rain",
                    },
                    {
                      id: "off" as const,
                      es: "Fondo Estatico (Pausar)",
                      en: "Static Grid (Pause)",
                    },
                  ]
                ).map((m) => {
                  const active = ambientMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        play("click");
                        onChangeAmbient?.(m.id);
                      }}
                      className={`p-3 border-2 text-left font-mono-hud text-xs transition cursor-pointer ${
                        active
                          ? "bg-[#00E5FF] text-[#090B10] border-[#090B10] font-bold shadow-[3px_3px_0_#FFD100]"
                          : "bg-[#131824] text-[#F5F2EB] border-[#2A344B] hover:border-[#00E5FF]"
                      }`}
                    >
                      <div className="font-pixel text-[10px] mb-1">
                        {active ? "● RUNNING" : "○ MODE"}
                      </div>
                      <div className="font-bold">
                        {lang === "es" ? m.es : m.en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 2: 8-BIT STEP SEQUENCER & 12-SOUND WEBAUDIO SYNTHESIZER */}
        <PixelWindow
          title="02 // SECUENCIADOR CHIPTUNE 8-BIT + SINTETIZADOR WEBAUDIO"
          subtitle={
            lang === "es"
              ? "Compon ritmos 8-bit en vivo y prueba los 12 efectos procedurales sin archivos MP3"
              : "Compose live 8-bit loops and test all 12 procedural sound effects with zero MP3 files"
          }
          tone="cyan"
          statusLeft="WEBAUDIO SYNTHESIS"
          statusRight="ZERO EXTERNAL ASSETS"
        >
          <div className="space-y-6">
            <PixelAudioSequencer />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SOUND_PRESETS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => play(s.id)}
                  className="p-3.5 bg-[#131824] border-2 border-[#2A344B] hover:border-[#FFD100] shadow-[4px_4px_0_#040508] active:translate-y-0.5 cursor-pointer transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-pixel text-xs font-bold text-[#FFD100]">
                      {s.label}
                    </span>
                    <PixelIcon name="volume-on" size={14} color="#00E5FF" />
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-snug">
                    {lang === "es" ? s.desc_es : s.desc_en}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[#2A344B] flex items-center justify-between font-mono-hud text-[10px]">
                    <code className="text-[#00E5FF]">{`play("${s.id}")`}</code>
                    <span className="px-1.5 py-0.5 bg-[#FFD100] text-[#090B10] font-bold">
                      PLAY ▶
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 3: 16 ANIMATED SPRITES + 8 PIXEL-ART MINI SCENES */}
        <PixelWindow
          title="03 // 16 SPRITES PIXEL-ART ANIMADOS Y 8 ESCENAS PROCEDURALES"
          subtitle="Controla el estado de animacion en vivo y copia cualquier sprite o escena"
          tone="emerald"
          statusLeft="16 CHARACTERS + 8 SCENES"
          statusRight="CRISP 16x16 SVG"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A344B] pb-3">
              <span className="font-pixel text-xs text-[#10B981]">
                A. GALERIA DE 16 SPRITES (<code className="text-white">&lt;PixelSprite /&gt;</code>)
              </span>
              <div className="flex items-center gap-1.5 font-mono-hud text-xs">
                <span className="text-[#94A3B8] mr-1">ANIMACION:</span>
                {(["float", "bounce", "pulse", "none"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      play("click");
                      setSpriteMotion(m);
                    }}
                    className={`px-2.5 py-1.5 font-pixel text-[10px] border cursor-pointer ${
                      spriteMotion === m
                        ? "bg-[#10B981] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#94A3B8] border-[#2A344B]"
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
              {SPRITE_LIST.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() =>
                    copyCode(
                      `sprite-${sp.id}`,
                      `<PixelSprite character="${sp.id}" size={48} motion="${spriteMotion}" />`
                    )
                  }
                  className="p-3 bg-[#131824] border-2 border-[#2A344B] hover:border-[#10B981] flex flex-col items-center text-center cursor-pointer transition"
                >
                  <PixelSprite
                    character={sp.id}
                    size={42}
                    motion={spriteMotion}
                  />
                  <span className="font-pixel text-[10px] text-[#F5F2EB] mt-2 truncate w-full">
                    {sp.name}
                  </span>
                  <span className="font-mono-hud text-[10px] text-[#94A3B8] truncate w-full">
                    {lang === "es" ? sp.role_es : sp.role_en}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="font-pixel text-xs text-[#FFD100] mb-3">
                B. 8 ESCENAS Y LOADERS PIXEL-ART ANIMADOS (<code className="text-white">&lt;PixelSceneAnimation /&gt;</code>)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <PixelSceneAnimation scene="crt-boot" label="CRT BIOS BOOT" />
                <PixelSceneAnimation scene="floppy-rw" label="FLOPPY TRACK I/O" />
                <PixelSceneAnimation scene="ai-duel" label="CARBON VS OPUS DUEL" />
                <PixelSceneAnimation scene="radar-sweep" label="RADAR TARGET LOCK" />
                <PixelSceneAnimation scene="campfire" label="8-BIT CAMPFIRE" />
                <PixelSceneAnimation scene="potion-lab" label="SHADER ALCHEMY" />
                <PixelSceneAnimation scene="hourglass-sand" label="PIXEL HOURGLASS" />
                <PixelSceneAnimation scene="cassette-spin" label="DATA CASSETTE" />
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 4: 3.5" FLOPPY DISK CARDS, BUTTONS & RPG DIALOG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PixelWindow
            title="04 // DISQUETES 3.5 PULGADAS Y CONTROLES DE HARDWARE"
            subtitle="Pasa el cursor sobre los disquetes para deslizar el obturador metalico"
            tone="coral"
            statusLeft="3.5 INCH HD FLOPPY"
            statusRight="TACTILE SWITCHES"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PixelFloppyCard
                  diskCode="DISK_01"
                  title="Gemini 4 Carbon Evals"
                  capacity="1.44 MB"
                  description="19 benchmarks oficiales verificados de Google DeepMind."
                  tone="cyan"
                />
                <PixelFloppyCard
                  diskCode="DISK_02"
                  title="Claude 5.5 Ladder"
                  capacity="1.44 MB"
                  description="18 motores en vivo: Haiku vs Sonnet vs Opus 5.5."
                  tone="yellow"
                />
              </div>

              <div className="pt-3 border-t border-[#2A344B] flex flex-wrap gap-2">
                <PixelButton tone="yellow" icon="crt-tv">
                  CRT YELLOW
                </PixelButton>
                <PixelButton tone="cyan" icon="floppy">
                  FLOPPY CYAN
                </PixelButton>
                <PixelButton tone="emerald" icon="joystick">
                  ARCADE GREEN
                </PixelButton>
                <PixelButton tone="coral" icon="rocket" sound="laser">
                  SIGNAL CORAL
                </PixelButton>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <PixelToggle
                  checked={switchA}
                  onChange={setSwitchA}
                  label="60Hz VSYNC"
                  tone="yellow"
                />
                <PixelToggle
                  checked={switchB}
                  onChange={setSwitchB}
                  label="DEGAUSS AUTO"
                  tone="cyan"
                />
                <PixelToggle
                  checked={switchC}
                  onChange={setSwitchC}
                  label="TURBO 66MHz"
                  tone="emerald"
                />
              </div>
            </div>
          </PixelWindow>

          <PixelWindow
            title="05 // DIALOGO RPG Y GRAFICAS DE TELEMETRIA"
            subtitle="Texto con voz 8-bit por letra y barras segmentadas LED"
            tone="violet"
            statusLeft="RPG TYPEWRITER"
            statusRight="LED TELEMETRY"
          >
            <div className="space-y-4">
              <PixelDialogBox
                speaker="MIXIUH BIOS"
                role={`MIXIUH PIXEL UI v${PIXEL_UI_VERSION}`}
                character="crt-monitor"
                tone="cyan"
                messages={[
                  lang === "es"
                    ? "Monitor de pruebas inicializado. Haz clic en esta ventana para avanzar el dialogo con voz sintetizada en 8-bit."
                    : "Benchmark monitor initialized. Click this box to advance the dialog with 8-bit synthesized voice blips.",
                  lang === "es"
                    ? "Toda esta libreria es 100% libre para uso comercial o personal dando credito a Mixiuh Labs."
                    : "This entire library is 100% free for commercial or personal use by crediting Mixiuh Labs.",
                ]}
              />

              <PixelBarChart
                items={[
                  {
                    label: "Gemini 4 Carbon (Terminal Hard)",
                    value: 54.5,
                    maxValue: 60,
                    displayValue: "54.5%",
                    tone: "cyan",
                    badge: "#1",
                  },
                  {
                    label: "Claude Opus 5.5 (Terminal Hard)",
                    value: 53.0,
                    maxValue: 60,
                    displayValue: "53.0%",
                    tone: "coral",
                  },
                ]}
              />

              <div className="flex flex-wrap gap-2">
                <PixelTelemetryPill kind="time" value="90 MIN" tone="cyan" />
                <PixelTelemetryPill kind="cost" value="$6.26 USD" tone="yellow" />
                <PixelTelemetryPill kind="score" value="4 - 2 WIN" tone="emerald" />
              </div>
            </div>
          </PixelWindow>
        </div>

        {/* SECTION 5B: PRO FORM, SELECT, AUTOCOMPLETE, CHECKS, COLLAPSE, CALENDAR & CHARTS STUDIO */}
        <PixelWindow
          title="06 // PERSONALIZADOR INTERACTIVO: INPUTS, SELECTS, AUTOCOMPLETE, CHECKS, COLLAPSE, CALENDARIO Y GRAFICAS"
          subtitle={
            lang === "es"
              ? "Personaliza el color de acento (tone) y tamano (size) en tiempo real y prueba cada componente profesional"
              : "Customize accent tone and size in real time and test every pro interactive component"
          }
          tone={customTone}
          statusLeft={`CUSTOMIZER TONE: ${customTone.toUpperCase()} · SIZE: ${customSize.toUpperCase()}`}
          statusRight="CLICK ANY SNIPPET TO COPY JSX"
        >
          <div className="space-y-6">
            {/* Global Live Customizer Toolbar */}
            <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] flex flex-wrap items-center justify-between gap-4 font-mono-hud text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[10px] text-[#FFD100]">
                  {lang === "es" ? "1. TEMA / ACENTO (TONE):" : "1. ACCENT TONE:"}
                </span>
                {(
                  [
                    "cyan",
                    "yellow",
                    "emerald",
                    "coral",
                    "violet",
                    "chalk",
                  ] as const
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      play("click");
                      setCustomTone(t);
                    }}
                    className={`px-2.5 py-1.5 font-pixel text-[10px] border-2 cursor-pointer uppercase ${
                      customTone === t
                        ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#CBD5E1] border-[#2A344B] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-[#00E5FF]">
                  {lang === "es" ? "2. ESCALA (SIZE):" : "2. SCALE (SIZE):"}
                </span>
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      play("click");
                      setCustomSize(sz);
                    }}
                    className={`px-2.5 py-1.5 font-pixel text-[10px] border-2 cursor-pointer uppercase ${
                      customSize === sz
                        ? "bg-[#00E5FF] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#CBD5E1] border-[#2A344B] hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Row 1: Inputs, Selects, Autocomplete & Slider */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: PixelInput + PixelSlider */}
              <div className="p-4 bg-[#131824] border-2 border-[#2A344B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A344B] pb-2">
                  <span className="font-pixel text-[10px] text-[#FFD100]">
                    &lt;PixelInput /&gt; &amp; &lt;PixelSlider /&gt;
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        "comp-input",
                        `<PixelInput label="PROMPT ID" value="${demoInput}" tone="${customTone}" size="${customSize}" iconLeft="terminal" clearable />`
                      )
                    }
                    className="px-2 py-0.5 bg-[#00E5FF] text-[#090B10] font-pixel text-[10px] font-bold cursor-pointer"
                  >
                    COPY JSX
                  </button>
                </div>

                <PixelInput
                  label={
                    lang === "es"
                      ? "1. INPUT CON ICONO Y LIMPIEZA"
                      : "1. INPUT WITH ICON & CLEAR"
                  }
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onClear={() => setDemoInput("")}
                  clearable
                  iconLeft="terminal"
                  tone={customTone}
                  size={customSize}
                  placeholder="Ej. claude-opus-5.5..."
                  helperText={
                    lang === "es"
                      ? "Soporta iconos izquierda/derecha, clearable y estado de error."
                      : "Supports left/right icons, clearable button, and error states."
                  }
                />

                <PixelSlider
                  label={
                    lang === "es"
                      ? "2. SLIDER LED DE VELOCIDAD (FPS)"
                      : "2. LED SPEED SLIDER (FPS)"
                  }
                  value={demoSlider}
                  min={15}
                  max={120}
                  step={5}
                  unit=" FPS"
                  onChange={setDemoSlider}
                  tone={customTone}
                />
              </div>

              {/* Column 2: PixelSelect + PixelAutocomplete */}
              <div className="p-4 bg-[#131824] border-2 border-[#2A344B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A344B] pb-2">
                  <span className="font-pixel text-[10px] text-[#00E5FF]">
                    &lt;PixelSelect /&gt; &amp; &lt;PixelAutocomplete /&gt;
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        "comp-select",
                        `<PixelSelect label="AI MODEL" value="${demoSelect}" onChange={setModel} tone="${customTone}" size="${customSize}" options={options} />`
                      )
                    }
                    className="px-2 py-0.5 bg-[#FFD100] text-[#090B10] font-pixel text-[10px] font-bold cursor-pointer"
                  >
                    COPY JSX
                  </button>
                </div>

                <PixelSelect
                  label={
                    lang === "es"
                      ? "3. SELECT DESPLEGABLE PIXEL-ART"
                      : "3. PIXEL-ART DROPDOWN SELECT"
                  }
                  value={demoSelect}
                  onChange={setDemoSelect}
                  tone={customTone}
                  size={customSize}
                  options={[
                    {
                      value: "carbon",
                      label: "Gemini 4 Carbon",
                      sublabel: "$4 / $20 USD · 54.5% Term-Hard",
                      badge: "#1 GLOBAL",
                      icon: "gemini-brand",
                    },
                    {
                      value: "opus",
                      label: "Claude Opus 5.5",
                      sublabel: "$5 / $25 USD · 53.0% Term-Hard",
                      badge: "ARCHITECT",
                      icon: "anthropic",
                    },
                    {
                      value: "sonnet",
                      label: "Claude Sonnet 5.5",
                      sublabel: "$3 / $15 USD · Path Tracer 29 FPS",
                      badge: "BALANCED",
                      icon: "cpu",
                    },
                    {
                      value: "haiku",
                      label: "Claude Haiku 5.5",
                      sublabel: "$0.80 / $4 USD · 24x mas barato",
                      badge: "ROI KING",
                      icon: "bolt",
                    },
                  ]}
                />

                <PixelAutocomplete
                  label={
                    lang === "es"
                      ? "4. AUTOCOMPLETE CON BUSQUEDA EN VIVO"
                      : "4. LIVE SEARCH AUTOCOMPLETE"
                  }
                  value={demoAuto}
                  onChange={setDemoAuto}
                  tone={customTone}
                  placeholder={
                    lang === "es"
                      ? "Filtra entre simuladores (ej. rover, tb-303, pathtracer)..."
                      : "Filter simulators (e.g. rover, tb-303, pathtracer)..."
                  }
                  options={[
                    {
                      value: "ep04-rover",
                      label: "EP04 R01: Rover Planetario Verlet",
                      sublabel: "Opus 5.5 ($6.81) · 61 FPS",
                      badge: "PHYSICS",
                      icon: "rocket",
                    },
                    {
                      value: "ep04-physarum",
                      label: "EP04 R02: Bio-Red Physarum 100K GPU",
                      sublabel: "Opus 5.5 ($2.55) · 28 estaciones Tokio",
                      badge: "WEBGL2",
                      icon: "dna",
                    },
                    {
                      value: "ep04-acid-synth",
                      label: "EP04 R04: Estudio Acido 3D TB-303 + TR-909",
                      sublabel: "Haiku 5.5 ($0.21) · 24x mas barato",
                      badge: "WEBAUDIO",
                      icon: "music",
                    },
                    {
                      value: "ep04-pathtracer",
                      label: "EP04 R05: Path Tracer WebGL2 con BVH",
                      sublabel: "Sonnet 5.5 ($1.62) · 29 FPS",
                      badge: "RAYTRACING",
                      icon: "gpu",
                    },
                    {
                      value: "ep04-chip8",
                      label: "EP04 R06: Consola Retro CHIP-8 + Pong",
                      sublabel: "Sonnet 5.5 ($2.25) · 60 FPS",
                      badge: "EMULATOR",
                      icon: "gamepad",
                    },
                  ]}
                />
              </div>

              {/* Column 3: PixelCheckbox & PixelRadioGroup */}
              <div className="p-4 bg-[#131824] border-2 border-[#2A344B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A344B] pb-2">
                  <span className="font-pixel text-[10px] text-[#10B981]">
                    &lt;PixelCheckbox /&gt; &amp; &lt;PixelRadioGroup /&gt;
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        "comp-check",
                        `<PixelCheckbox checked={checked} onChange={setChecked} label="Zero-Shot Verification" tone="${customTone}" />`
                      )
                    }
                    className="px-2 py-0.5 bg-[#10B981] text-[#090B10] font-pixel text-[10px] font-bold cursor-pointer"
                  >
                    COPY JSX
                  </button>
                </div>

                <div className="space-y-2.5">
                  <PixelCheckbox
                    checked={demoCheckA}
                    onChange={setDemoCheckA}
                    tone={customTone}
                    label={
                      lang === "es"
                        ? "Unico intento Zero-Shot (Sin edicion humana)"
                        : "Single Zero-Shot Attempt (No human edits)"
                    }
                    description={
                      lang === "es"
                        ? "Se publica el archivo index.html tal cual salio del CLI."
                        : "Raw index.html published directly from CLI output."
                    }
                  />
                  <PixelCheckbox
                    checked={demoCheckB}
                    onChange={setDemoCheckB}
                    tone={customTone}
                    label={
                      lang === "es"
                        ? "Auditoria de Factura API ($ USD + Tokens)"
                        : "Real API Bill Audit ($ USD + Tokens)"
                    }
                  />
                  <PixelCheckbox
                    checked={demoCheckC}
                    onChange={setDemoCheckC}
                    tone={customTone}
                    label={
                      lang === "es"
                        ? "Permitir librerias externas no autorizadas"
                        : "Allow unauthorized external libraries"
                    }
                  />
                </div>

                <PixelRadioGroup
                  label={
                    lang === "es"
                      ? "5. RADIO GROUP DE MODO DE RENDER"
                      : "5. RENDER TARGET RADIO GROUP"
                  }
                  value={demoRadio}
                  onChange={setDemoRadio}
                  tone={customTone}
                  options={[
                    {
                      value: "60fps",
                      label: "4K UHD @ 60Hz VSync Lock",
                      badge: "MASTER",
                    },
                    {
                      value: "crt-rgb",
                      label: "CRT Shadow-Mask Phosphor",
                      badge: "RETRO",
                    },
                  ]}
                />
              </div>
            </div>

            {/* Grid Row 2: PixelCalendar, PixelCollapse & PixelMultiLineChart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <PixelCalendar
                  lang={lang}
                  selectedDate={demoCalDate}
                  onSelectDate={setDemoCalDate}
                  tone={customTone}
                  events={[
                    {
                      date: "2026-10-14",
                      label: "EP01: Argon vs 3.8 Flash (10-0)",
                      tone: "violet",
                    },
                    {
                      date: "2026-10-18",
                      label: "EP02: Argon vs Claude Opus 5.5 (4-2)",
                      tone: "cyan",
                    },
                    {
                      date: "2026-10-25",
                      label: "EP03: Sin Kit vs Superpowers Kit (4-2)",
                      tone: "emerald",
                    },
                    {
                      date: "2026-10-28",
                      label: "EP04: Escalera Claude 5.5 (18 demos)",
                      tone: "coral",
                    },
                    {
                      date: "2026-10-30",
                      label: "Gemini 4 Carbon + Pixel UI v2.2",
                      tone: "yellow",
                    },
                  ]}
                />

                <PixelCollapse
                  tone={customTone}
                  defaultOpenIds={["col-1"]}
                  items={[
                    {
                      id: "col-1",
                      title:
                        lang === "es"
                          ? "01. ¿Como funciona <PixelCollapse />?"
                          : "01. How does <PixelCollapse /> work?",
                      badge: "ACCORDION",
                      icon: "folder-open",
                      content:
                        lang === "es"
                          ? "Soporta apertura unica o multiple (allowMultiple), insignias de estado, iconos 16x16 personalizados y efectos de sonido 8-bit al expandir o contraer."
                          : "Supports single or multi-panel expansion (allowMultiple), status badges, custom 16x16 icons, and 8-bit sound effects on expand/collapse.",
                    },
                    {
                      id: "col-2",
                      title:
                        lang === "es"
                          ? "02. ¿Que incluye <PixelCalendar />?"
                          : "02. What does <PixelCalendar /> include?",
                      badge: "DATE PICKER",
                      icon: "calendar",
                      content:
                        lang === "es"
                          ? "Navegacion mensual/anual bilingue (ES/EN), marcadores de eventos con color por fecha, seleccion interactiva en formato ISO (YYYY-MM-DD) y barra inferior de telemetria."
                          : "Bilingual (ES/EN) month/year navigation, color-coded event markers per date, interactive ISO date selection (YYYY-MM-DD), and a bottom telemetry bar.",
                    },
                  ]}
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <PixelMultiLineChart
                  title={
                    lang === "es"
                      ? "GRAFICA MULTISERIE (<PixelMultiLineChart />) · BENCHMARKS EN VIVO"
                      : "MULTI-SERIES LINE CHART (<PixelMultiLineChart />) · LIVE BENCHMARKS"
                  }
                  subtitle={
                    lang === "es"
                      ? "Haz clic en las leyendas superiores para filtrar series o inspecciona cada punto con el cursor"
                      : "Click top legends to toggle series or hover over pixel nodes to inspect metrics"
                  }
                  series={[
                    {
                      key: "carbon",
                      name: "Gemini 4 Carbon",
                      color: "#00E5FF",
                    },
                    {
                      key: "opus",
                      name: "Claude Opus 5.5",
                      color: "#A855F7",
                    },
                    {
                      key: "sonnet",
                      name: "Claude Sonnet 5.5",
                      color: "#FFD100",
                    },
                    {
                      key: "haiku",
                      name: "Claude Haiku 5.5",
                      color: "#10B981",
                    },
                  ]}
                  data={[
                    {
                      label: "R01 ROVER",
                      values: { carbon: 92, opus: 95, sonnet: 20, haiku: 82 },
                    },
                    {
                      label: "R02 PHYSARUM",
                      values: { carbon: 90, opus: 96, sonnet: 68, haiku: 15 },
                    },
                    {
                      label: "R03 BRIDGE",
                      values: { carbon: 89, opus: 94, sonnet: 74, haiku: 70 },
                    },
                    {
                      label: "R04 TB-303",
                      values: { carbon: 91, opus: 84, sonnet: 82, haiku: 96 },
                    },
                    {
                      label: "R05 BVH-RT",
                      values: { carbon: 93, opus: 62, sonnet: 95, haiku: 58 },
                    },
                    {
                      label: "R06 CHIP-8",
                      values: { carbon: 94, opus: 35, sonnet: 96, haiku: 72 },
                    },
                  ]}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <PixelDonutGauge
                    label="TERMINAL-BENCH HARD"
                    sublabel="Gemini 4 Carbon"
                    value={54.5}
                    maxValue={100}
                    displayValue="54.5%"
                    tone="cyan"
                  />
                  <PixelDonutGauge
                    label="SECBENCH DEFENSIVE"
                    sublabel="Gemini 4 Carbon"
                    value={84.0}
                    maxValue={100}
                    displayValue="84.0%"
                    tone="emerald"
                  />
                  <PixelDonutGauge
                    label="HAIKU ROI RATIO"
                    sublabel="$0.21 vs $5.00 Opus"
                    value={96}
                    maxValue={100}
                    displayValue="24x"
                    tone="yellow"
                  />
                </div>
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 6: CRISP 16x16 PIXEL SVG ICONS WITH CATEGORY FILTERS, BRANDS & SEARCH */}
        <PixelWindow
          title={`07 // ${ALL_PIXEL_ICON_NAMES.length} ICONOS VECTORIALES PIXEL-ART EN GRILLA 16x16 (INCLUYE MARCAS Y REDES)`}
          subtitle="Incluye YouTube, X, Instagram, Facebook, TikTok, Google, GitHub, Discord, Vercel y todas las categorias UI"
          tone="chalk"
          statusLeft={`SELECTED: <PixelIcon name="${selectedIcon}" size={${iconSize}} color="${iconColor}" />`}
          statusRight="ZERO UNICODE EMOJIS"
        >
          <div className="space-y-4">
            {/* Live Social Media Bar Component Preview */}
            <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-pixel text-[10px] text-[#FFD100]">
                  COMPONENTE DE REDES SOCIALES (<code className="text-white">&lt;PixelSocialBar /&gt;</code>)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyCode("social-bar", `<PixelSocialBar />`)
                  }
                  className="px-2.5 py-1.5 bg-[#00E5FF] text-[#090B10] font-pixel text-[10px] font-bold cursor-pointer"
                >
                  COPIAR JSX
                </button>
              </div>
              <PixelSocialBar />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  play("click");
                  setIconCategory("all");
                }}
                className={`px-3 py-1.5 font-pixel text-[10px] border-2 cursor-pointer ${
                  iconCategory === "all"
                    ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold"
                    : "bg-[#131824] text-[#94A3B8] border-[#2A344B] hover:text-white"
                }`}
              >
                {lang === "es"
                  ? `Todos (${ALL_PIXEL_ICON_NAMES.length})`
                  : `All (${ALL_PIXEL_ICON_NAMES.length})`}
              </button>
              {PIXEL_ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    play("click");
                    setIconCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 font-pixel text-[10px] border-2 cursor-pointer ${
                    iconCategory === cat.id
                      ? "bg-[#00E5FF] text-[#090B10] border-[#090B10] font-bold"
                      : "bg-[#131824] text-[#94A3B8] border-[#2A344B] hover:text-white"
                  }`}
                >
                  {lang === "es" ? cat.label_es : cat.label_en}
                </button>
              ))}
            </div>

            {/* Icon Search, Color & Size Customizer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131824] p-3 border-2 border-[#2A344B]">
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder={
                  lang === "es"
                    ? "Buscar icono (ej. youtube, google, instagram, x, floppy)..."
                    : "Search icon (e.g. youtube, google, instagram, x, floppy)..."
                }
                className="px-3 py-1.5 bg-[#090B10] border-2 border-[#2A344B] font-mono-hud text-xs text-white w-full sm:w-80"
              />

              <div className="flex flex-wrap items-center gap-3 font-mono-hud text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#94A3B8]">COLOR:</span>
                  {[
                    "#00E5FF",
                    "#FFD100",
                    "#10B981",
                    "#FF3355",
                    "#A855F7",
                    "#F5F2EB",
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => {
                        play("click");
                        setIconColor(hex);
                      }}
                      className={`w-6 h-6 border-2 cursor-pointer ${
                        iconColor === hex
                          ? "border-white scale-110"
                          : "border-[#090B10]"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[#94A3B8]">SIZE:</span>
                  {([16, 24, 32] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        play("click");
                        setIconSize(sz);
                      }}
                      className={`px-2.5 py-1.5 font-pixel text-[10px] border cursor-pointer ${
                        iconSize === sz
                          ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                          : "bg-[#090B10] text-[#94A3B8] border-[#2A344B]"
                      }`}
                    >
                      {sz}PX
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {filteredIcons.map((iconName) => {
                const isSel = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(iconName);
                      copyCode(
                        `icon-${iconName}`,
                        `<PixelIcon name="${iconName}" size={${iconSize}} color="${iconColor}" />`
                      );
                    }}
                    className={`p-2.5 border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSel
                        ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#F5F2EB] border-[#2A344B] hover:border-[#00E5FF]"
                    }`}
                  >
                    <PixelIcon
                      name={iconName}
                      size={iconSize}
                      color={isSel ? "#090B10" : iconColor}
                    />
                    <span className="font-mono-hud text-[10px] truncate w-full text-center">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
            {copiedSnippet?.startsWith("icon-") && (
              <div className="mt-2 px-3 py-2 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold inline-flex items-center gap-2">
                <PixelIcon name="check" size={14} color="#090B10" />
                <span>
                  {`Copiado: <PixelIcon name="${selectedIcon}" size={${iconSize}} color="${iconColor}" />`}
                </span>
              </div>
            )}
          </div>
        </PixelWindow>

        {/* SECTION 6: FREE COMMERCIAL LICENSE & 1-LINE ATTRIBUTION GENERATOR */}
        <div className="bg-[#111622] border-2 border-[#FFD100] shadow-[6px_6px_0_#040508] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#2A344B] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFD100] text-[#090B10] font-pixel text-[10px] font-bold mb-2">
                LICENCIA ABIERTA MIXIUH (CC-BY 4.0 / MIT CON ATRIBUCION)
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                {lang === "es"
                  ? "Usala Libremente en Cualquier Proyecto (Personal o Comercial)"
                  : "Use It Freely in Any Project (Personal or Commercial)"}
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                {lang === "es"
                  ? "La unica condicion es incluir credito visible a Mixiuh Labs (labs.mixiuh.online) en el pie de pagina, pantalla de creditos o README. Elige el estilo de insignia que prefieras:"
                  : "The only requirement is to include visible credit to Mixiuh Labs (labs.mixiuh.online) in your footer, credits screen, or README. Pick your preferred badge style:"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["hardware", "pill", "minimal", "banner"] as const).map(
                (v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      play("click");
                      setCreditVariant(v);
                    }}
                    className={`px-3 py-1.5 font-mono-hud text-xs font-bold border-2 cursor-pointer ${
                      creditVariant === v
                        ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                        : "bg-[#090B10] text-[#94A3B8] border-[#2A344B] hover:text-white"
                    }`}
                  >
                    {v.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-6 bg-[#090B10] border-2 border-[#2A344B] px-dither-dots flex items-center justify-center">
            <PixelCreditBadge variant={creditVariant} />
          </div>

          <div className="relative bg-[#090B10] border-2 border-[#2A344B] p-4 font-mono-hud text-xs text-[#00E5FF] overflow-x-auto">
            <pre className="leading-relaxed">{creditSnippet}</pre>
            <button
              type="button"
              onClick={() => copyCode("credit", creditSnippet)}
              className="mt-3 px-4 py-2 bg-[#FFD100] text-[#090B10] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PixelIcon
                name={copiedSnippet === "credit" ? "check" : "copy"}
                size={14}
                color="#090B10"
              />
              <span>
                {copiedSnippet === "credit"
                  ? lang === "es"
                    ? "¡Snippet Copiado!"
                    : "Snippet Copied!"
                  : lang === "es"
                  ? "Copiar Codigo de Instalacion + Credito"
                  : "Copy Install + Attribution Snippet"}
              </span>
            </button>
          </div>
        </div>

        {/* SECTION 8: NEW IN v2.3 — NAVIGATION & OVERLAY SUITE */}
        <PixelWindow
          title={`08 // NUEVO EN v${PIXEL_UI_VERSION}: COMMAND PALETTE, TOASTS, TABS Y COPIA`}
          subtitle={
            lang === "es"
              ? "Primera entrega de la Fase 2 del roadmap, accesible con teclado y lector de pantalla"
              : "First Phase 2 roadmap drop, fully keyboard & screen-reader friendly"
          }
          tone="cyan"
          statusLeft="WAI-ARIA · KEYBOARD · REDUCED MOTION"
          statusRight="Ctrl+K"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono-hud text-xs">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-pixel text-[10px] text-[#00E5FF]">
                  {"<PixelTabs />"}
                </div>
                <PixelTabs
                  ariaLabel="Demo tabs"
                  tone="cyan"
                  wrap
                  value={demoTab}
                  onChange={setDemoTab}
                  items={[
                    { id: "palette", label: "Command Palette", icon: "command" },
                    { id: "toasts", label: "Toasts", icon: "bell" },
                    { id: "a11y", label: lang === "es" ? "Accesibilidad" : "Accessibility", icon: "eye" },
                  ]}
                />
                <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] text-[#CBD5E1] leading-relaxed min-h-[96px]">
                  {demoTab === "palette" &&
                    (lang === "es"
                      ? "Pulsa Ctrl+K (o Cmd+K) en cualquier parte del sitio: busca secciones, episodios, demos de la Arena, ajustes y los terminos del glosario sin tocar el mouse."
                      : "Press Ctrl+K (or Cmd+K) anywhere on the site: search sections, episodes, Arena demos, settings and glossary terms without touching the mouse.")}
                  {demoTab === "toasts" &&
                    (lang === "es"
                      ? "pixelToast.show() es una API global: llamala desde cualquier evento y <PixelToaster /> la anuncia con aria-live y un blip 8-bit."
                      : "pixelToast.show() is a global API: call it from any event and <PixelToaster /> announces it via aria-live with an 8-bit blip.")}
                  {demoTab === "a11y" &&
                    (lang === "es"
                      ? "Las tabs se mueven con flechas, Inicio y Fin. Todo el kit muestra un anillo de foco pixel y respeta prefers-reduced-motion (sin fondo animado ni reveal)."
                      : "Tabs move with arrow keys, Home and End. The whole kit shows a pixel focus ring and honours prefers-reduced-motion (no animated background or reveal).")}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
                    )
                  }
                  className="px-btn bg-[#FFD100] text-[#090B10] px-4 py-2.5 text-xs"
                >
                  <PixelIcon name="command" size={14} />
                  <span>
                    {lang === "es" ? "Abrir Command Palette" : "Open Command Palette"}
                  </span>
                  <kbd className="px-kbd">Ctrl K</kbd>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-pixel text-[10px] text-[#00E5FF]">
                  {"pixelToast.show({ ... })"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { tone: "emerald", icon: "check", es: "Guardado", en: "Saved" },
                      { tone: "cyan", icon: "broadcast", es: "Nuevo episodio", en: "New episode" },
                      { tone: "yellow", icon: "trophy", es: "Logro desbloqueado", en: "Achievement unlocked" },
                      { tone: "coral", icon: "bug", es: "Error de compilacion", en: "Build error" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.tone}
                      type="button"
                      onClick={() =>
                        pixelToast.show({
                          title: (lang === "es" ? t.es : t.en).toUpperCase(),
                          description: `tone="${t.tone}" · icon="${t.icon}"`,
                          tone: t.tone,
                          icon: t.icon,
                          sound: t.tone === "yellow" ? "achievement" : t.tone === "coral" ? "hit" : "dialogBlip",
                        })
                      }
                      className="px-btn bg-[#131824] text-[#F5F2EB] px-3 py-2 text-[11px]"
                    >
                      <PixelIcon name={t.icon} size={12} />
                      <span>{lang === "es" ? t.es : t.en}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[10px] text-[#00E5FF]">
                    {"<PixelCopyButton />"}
                  </span>
                  <PixelCopyButton
                    text={overlaySnippet}
                    tone="cyan"
                    size="xs"
                    label={lang === "es" ? "Copiar" : "Copy"}
                    copiedLabel={lang === "es" ? "Copiado" : "Copied"}
                    toastTitle={lang === "es" ? "SNIPPET COPIADO" : "SNIPPET COPIED"}
                  />
                </div>
                <pre className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] text-[11px] text-[#F5F2EB] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {overlaySnippet}
                </pre>
              </div>
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 9: PHASE 2 COMPLETE — DATA TABLE, TOOLTIP, POPOVER, DRAWER, SHEET, CONTEXT MENU */}
        <PixelWindow
          title={`09 // FASE 2 COMPLETA v${PIXEL_UI_VERSION}: DATATABLE, TOOLTIP, POPOVER, DRAWER Y MENU CONTEXTUAL`}
          subtitle={
            lang === "es"
              ? "Componentes de datos y overlays con teclado completo, foco atrapado y lectores de pantalla"
              : "Data and overlay components with full keyboard support, focus management and screen readers"
          }
          tone="emerald"
          statusLeft="ARIA SORT · DIALOG · MENU · TOOLTIP"
          statusRight="CSV EXPORT"
        >
          <div className="space-y-6 font-mono-hud text-xs">
            <div className="space-y-2">
              <div className="font-pixel text-[11px] text-[#10B981]">
                {"<PixelDataTable /> // EP04 · costo por reto (USD)"}
              </div>
              <PixelDataTable<Ep04Row>
                caption={lang === "es" ? "Costo por reto EP04" : "EP04 cost per challenge"}
                tone="emerald"
                locale="es"
                searchable
                pageSize={4}
                exportFileName="ep04-costos.csv"
                rows={EP04_ROWS}
                getRowId={(r) => String(r.n)}
                className="[&_table]:min-w-[560px]"
                labels={
                  lang === "es"
                    ? undefined
                    : {
                        search: "Search the table",
                        searchPlaceholder: "Search...",
                        clearSearch: "Clear search",
                        noResults: "No results",
                        exportCsv: "Export CSV",
                        previous: "Previous",
                        next: "Next",
                        rowsSummary: (from, to, total) => `${from}–${to} of ${total}`,
                        pageOf: (page, pages) => `Page ${page} of ${pages}`,
                        sortHint: "Sort by",
                      }
                }
                columns={[
                  { key: "n", header: "#", value: (r) => r.n },
                  {
                    key: "reto",
                    header: lang === "es" ? "Reto" : "Challenge",
                    value: (r) => (lang === "es" ? r.name_es : r.name_en),
                  },
                  {
                    key: "haiku",
                    header: "Haiku 5.5",
                    value: (r) => r.haiku,
                    render: (r) => <span className="text-[#10B981]">${r.haiku.toFixed(2)}</span>,
                    align: "right",
                  },
                  {
                    key: "sonnet",
                    header: "Sonnet 5.5",
                    value: (r) => r.sonnet,
                    render: (r) => <span className="text-[#FFD100]">${r.sonnet.toFixed(2)}</span>,
                    align: "right",
                  },
                  {
                    key: "opus",
                    header: "Opus 5.5",
                    value: (r) => r.opus,
                    render: (r) => <span className="text-[#C084FC]">${r.opus.toFixed(2)}</span>,
                    align: "right",
                  },
                  {
                    key: "winner",
                    header: lang === "es" ? "Ganador" : "Winner",
                    value: (r) => r.winner.toUpperCase(),
                  },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3">
                <div className="font-pixel text-[11px] text-[#00E5FF]">{"<PixelTooltip />"}</div>
                <div className="flex flex-wrap gap-2">
                  {(["top", "bottom", "right"] as const).map((placement) => (
                    <PixelTooltip
                      key={placement}
                      placement={placement}
                      content={
                        lang === "es"
                          ? `Tooltip ${placement} (hover o foco con teclado)`
                          : `Tooltip ${placement} (hover or keyboard focus)`
                      }
                    >
                      <button type="button" className="px-btn bg-[#131824] text-[#F5F2EB] px-3 py-2 text-[11px]">
                        {placement.toUpperCase()}
                      </button>
                    </PixelTooltip>
                  ))}
                </div>
                <div className="font-pixel text-[11px] text-[#00E5FF] pt-2">{"<PixelPopover />"}</div>
                <PixelPopover
                  trigger={
                    <>
                      <PixelIcon name="settings" size={13} />
                      <span>{lang === "es" ? "Opciones" : "Options"}</span>
                    </>
                  }
                  tone="cyan"
                  title={lang === "es" ? "OPCIONES DEL LAB" : "LAB OPTIONS"}
                  closeLabel={lang === "es" ? "Cerrar" : "Close"}
                >
                  <div className="space-y-3">
                    <PixelToggle checked={switchA} onChange={setSwitchA} label="60Hz VSYNC" tone="cyan" />
                    <PixelToggle checked={switchB} onChange={setSwitchB} label="DEGAUSS AUTO" tone="coral" />
                  </div>
                </PixelPopover>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3">
                <div className="font-pixel text-[11px] text-[#FFD100]">{"<PixelDrawer /> · <PixelSheet />"}</div>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {lang === "es"
                    ? "Paneles modales laterales o inferiores con foco atrapado, Escape y bloqueo de scroll. El menu de Ajustes del sitio en movil usa PixelDrawer."
                    : "Side or bottom modal panels with focus trap, Escape and scroll lock. The site's mobile Settings menu uses PixelDrawer."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoDrawer(true)}
                    className="px-btn bg-[#FFD100] text-[#090B10] px-3 py-2 text-[11px]"
                  >
                    {lang === "es" ? "Abrir Drawer" : "Open Drawer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoSheet(true)}
                    className="px-btn bg-[#00E5FF] text-[#090B10] px-3 py-2 text-[11px]"
                  >
                    {lang === "es" ? "Abrir Sheet" : "Open Sheet"}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3">
                <div className="font-pixel text-[11px] text-[#FF3355]">{"<PixelContextMenu />"}</div>
                <PixelContextMenu
                  label={lang === "es" ? "Acciones del cartucho" : "Cartridge actions"}
                  tone="coral"
                  items={contextMenuItems}
                >
                  <div
                    tabIndex={0}
                    className="p-4 bg-[#111622] border-2 border-dashed border-[#FF3355] text-center text-[#CBD5E1] leading-relaxed"
                  >
                    <PixelIcon name="cartridge" size={28} color="#FF3355" className="mx-auto mb-2" />
                    {lang === "es"
                      ? "Clic derecho aqui (o enfoca y pulsa Shift+F10 / tecla Menu)"
                      : "Right-click here (or focus and press Shift+F10 / Menu key)"}
                  </div>
                </PixelContextMenu>
              </div>
            </div>
          </div>

          <PixelDrawer
            open={demoDrawer}
            onOpenChange={setDemoDrawer}
            title={lang === "es" ? "DRAWER DE DEMOSTRACION" : "DEMO DRAWER"}
            description={lang === "es" ? "Tab y Shift+Tab se quedan dentro; Escape cierra." : "Tab and Shift+Tab stay inside; Escape closes."}
            closeLabel={lang === "es" ? "Cerrar" : "Close"}
            footer={
              <button type="button" onClick={() => setDemoDrawer(false)} className="px-btn bg-[#FFD100] text-[#090B10] px-4 py-2 text-xs">
                OK
              </button>
            }
          >
            <div className="space-y-3 font-mono-hud text-xs">
              <PixelToggle checked={switchC} onChange={setSwitchC} label="TURBO 66MHz" tone="emerald" />
              <p className="text-[#CBD5E1]">
                {lang === "es" ? "Contenido desplazable, formularios y acciones." : "Scrollable content, forms and actions."}
              </p>
            </div>
          </PixelDrawer>
          <PixelSheet
            open={demoSheet}
            onOpenChange={setDemoSheet}
            tone="cyan"
            size="sm"
            title={lang === "es" ? "SHEET INFERIOR" : "BOTTOM SHEET"}
            closeLabel={lang === "es" ? "Cerrar" : "Close"}
          >
            <p className="font-mono-hud text-xs text-[#CBD5E1]">
              {lang === "es" ? "Ideal para acciones rapidas en movil." : "Great for quick actions on phones."}
            </p>
          </PixelSheet>
        </PixelWindow>

        {/* SECTION 8: MASTER ROADMAP & COMPETITIVE BENCHMARK MATRIX VS TOP UI LIBRARIES */}
        <PixelWindow
          title="10 // ROADMAP DE @MIXIUH/PIXEL-UI Y COMPARATIVA CONTRA LIBRERIAS UI PROFESIONALES"
          subtitle={
            lang === "es"
              ? `Que tenemos hoy en v${PIXEL_UI_VERSION}, como se compara frente a shadcn/ui, MUI, Ant Design y NES.css, y las siguientes fases de evolucion`
              : `What we have today in v${PIXEL_UI_VERSION}, how it compares against shadcn/ui, MUI, Ant Design & NES.css, and upcoming roadmap phases`
          }
          tone="yellow"
          statusLeft={`v${PIXEL_UI_VERSION} PRODUCTION READY`}
          statusRight={`ROADMAP v${PIXEL_UI_VERSION} -> v4.0`}
        >
          <div className="space-y-6 font-mono-hud text-xs">
            {/* Comparative Matrix Table */}
            <div className="border-2 border-[#2A344B]">
              <PixelSwipeHint
                label={lang === "es" ? "Desliza para comparar" : "Swipe to compare"}
              />
              <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#090B10] text-[#FFD100] font-pixel text-[10px] border-b-2 border-[#2A344B]">
                    <th className="p-3">CAPACIDAD / SISTEMA</th>
                    <th className="p-3 text-[#00E5FF]">{`@MIXIUH/PIXEL-UI v${PIXEL_UI_VERSION}`}</th>
                    <th className="p-3 text-[#94A3B8]">shadcn/ui + Radix</th>
                    <th className="p-3 text-[#94A3B8]">MUI / Ant Design</th>
                    <th className="p-3 text-[#94A3B8]">NES.css / Pixel-Retro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] bg-[#111622] text-[#CBD5E1]">
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Formularios Pro (Input, Select, Autocomplete, Checks, Radio, Slider, Calendar)
                    </td>
                    <td className="p-3 text-[#10B981] font-bold">
                      INCLUIDO (desde v2.2, con Audio 8-Bit + Tones)
                    </td>
                    <td className="p-3">Incluido (Estilo corporativo plano)</td>
                    <td className="p-3">Incluido (Pesado, sin pixel-art)</td>
                    <td className="p-3 text-[#FF3355]">
                      Incompleto (Sin Autocomplete ni Calendar)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Visualizacion de Datos (MultiLine, Bar, Versus, Sparkline, Donut Gauge)
                    </td>
                    <td className="p-3 text-[#10B981] font-bold">
                      INCLUIDO NATIVO (SVG CrispEdges)
                    </td>
                    <td className="p-3">Requiere Recharts externo</td>
                    <td className="p-3">Paquete empresarial separado</td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Hardware Retro 3D (Monitor CRT 3D, Disquetes 3.5&quot;, Perilla VHF, Keycaps)
                    </td>
                    <td className="p-3 text-[#00E5FF] font-bold">
                      EXCLUSIVO MIXIUH (3D + Degauss + Fosforo)
                    </td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                    <td className="p-3 text-[#FF3355]">Solo bordes 2D basicos</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Iconografia Vectorial Pixel-Art + Marcas (YouTube, X, Instagram, TikTok, Google)
                    </td>
                    <td className="p-3 text-[#10B981] font-bold">
                      {`${ALL_PIXEL_ICON_NAMES.length} ICONOS 16x16 NATIVOS (Cero Emojis)`}
                    </td>
                    <td className="p-3">Usa Lucide (Lineas curvas)</td>
                    <td className="p-3">Material Icons (Curvos)</td>
                    <td className="p-3">Menos de 25 iconos</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Navegacion Pro y Accesibilidad (Command Palette Ctrl+K, Tabs con teclado, Toasts, foco visible, prefers-reduced-motion)
                    </td>
                    <td className="p-3 text-[#10B981] font-bold">
                      INCLUIDO (v2.5 · WAI-ARIA + teclado)
                    </td>
                    <td className="p-3">Incluido (cmdk + Radix por separado)</td>
                    <td className="p-3">Parcial (sin Command Palette)</td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Audio Chiptune WebAudio + Cursores + Fondo IA + Scroll Procedural
                    </td>
                    <td className="p-3 text-[#FFD100] font-bold">
                      INCLUIDO (12 SFX + Secuenciador + Bots IA)
                    </td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                    <td className="p-3 text-[#FF3355]">No existe</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>

            {/* 4-Phase Roadmap Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[#090B10] border-2 border-[#10B981] space-y-2">
                <div className="px-2 py-0.5 bg-[#10B981] text-[#090B10] font-pixel text-[10px] font-bold inline-block">
                  FASE 1 · COMPLETADO (v2.2)
                </div>
                <h3 className="font-display text-sm font-black text-white">
                  Core Pixel-Art, Hardware 3D, Formularios y Graficas
                </h3>
                <ul className="space-y-1 text-[11px] text-[#CBD5E1]">
                  <li>{`+ ${ALL_PIXEL_ICON_NAMES.length} iconos 16x16 + 28 marcas (X, YT, IG, TikTok, Google)`}</li>
                  <li>+ Monitor CRT 3D + Disquetes 3.5&quot; + Keycaps</li>
                  <li>+ Input, Select, Autocomplete, Checkbox, Radio, Slider</li>
                  <li>+ Collapse, Calendar, MultiLineChart, DonutGauge</li>
                  <li>+ 16 Sprites + 8 Escenas + 12 SFX + Scroll Procedural</li>
                </ul>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#00E5FF] space-y-2">
                <div className="px-2 py-0.5 bg-[#00E5FF] text-[#090B10] font-pixel text-[10px] font-bold inline-block">
                  {`FASE 2 · COMPLETADO (v${PIXEL_UI_VERSION})`}
                </div>
                <h3 className="font-display text-sm font-black text-white">
                  Command Palette, Notificaciones, DataGrid y Overlays
                </h3>
                <ul className="space-y-1 text-[11px] text-[#10B981]">
                  <li>✓ PixelCommandPalette (Ctrl+K / Cmd+K estilo BIOS)</li>
                  <li>✓ PixelToaster + pixelToast (alertas con fanfarria)</li>
                  <li>✓ PixelTabs, PixelCopyButton y PixelBackToTop</li>
                  <li>✓ PixelDataTable (orden, filtros, paginacion, export CSV)</li>
                  <li>✓ PixelDrawer, PixelSheet, PixelTooltip y PixelPopover</li>
                  <li>✓ PixelContextMenu (menu clic derecho + Shift+F10)</li>
                </ul>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#FFD100] space-y-2">
                <div className="px-2 py-0.5 bg-[#FFD100] text-[#090B10] font-pixel text-[10px] font-bold inline-block">
                  FASE 3 · FLUJOS AVANZADOS Y MEDIA (v3.0)
                </div>
                <h3 className="font-display text-sm font-black text-white">
                  Kanban, Editor de Codigo, Grafos de Nodos y Graficas 3D
                </h3>
                <ul className="space-y-1 text-[11px] text-[#CBD5E1]">
                  <li>+ PixelKanbanBoard (Drag &amp; Drop con fisica de cartuchos)</li>
                  <li>+ PixelCodeEditor &amp; DiffViewer (Comparador lado a lado)</li>
                  <li>+ PixelNodeGraph (Editor visual de flujos de agentes IA)</li>
                  <li>+ PixelRadarChart, Heatmap &amp; Candlestick financiero</li>
                  <li>+ PixelFileDropzone (Subida de archivos con animacion Floppy)</li>
                </ul>
              </div>

              <div className="p-4 bg-[#090B10] border-2 border-[#A855F7] space-y-2">
                <div className="px-2 py-0.5 bg-[#A855F7] text-[#090B10] font-pixel text-[10px] font-bold inline-block">
                  FASE 4 · ECOSISTEMA CLI Y MULTI-FRAMEWORK (v4.0)
                </div>
                <h3 className="font-display text-sm font-black text-white">
                  CLI npx mixiuh-pixel-ui, Editor de Sprites y Temas
                </h3>
                <ul className="space-y-1 text-[11px] text-[#CBD5E1]">
                  <li>+ CLI oficial: npx @mixiuh/pixel-ui add [component]</li>
                  <li>+ Theme Builder en vivo (Exportador de variables CSS/Tailwind)</li>
                  <li>+ Editor de Sprites e Iconos 16x16 en el navegador</li>
                  <li>+ Adaptadores Web Components / Vue / Svelte / Astro</li>
                  <li>+ Kit oficial de Figma con Auto-Layout y tokens</li>
                </ul>
              </div>
            </div>
          </div>
        </PixelWindow>
      </div>
    </div>
  );
}
