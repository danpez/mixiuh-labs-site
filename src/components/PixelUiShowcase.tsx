"use client";

import React, { useState } from "react";
import {
  PixelButton,
  PixelKeycap,
  PixelToggle,
  PixelCrank,
  PixelWindow,
  PixelFloppyCard,
  PixelBarChart,
  PixelVersusBar,
  PixelSparkline,
  PixelAudioSequencer,
  PixelDialogBox,
  PixelTelemetryPill,
  PixelCreditBadge,
  PixelSocialBar,
  PixelIcon,
  PixelSprite,
  PixelSceneAnimation,
  ALL_PIXEL_ICON_NAMES,
  PIXEL_ICON_CATEGORIES,
  PIXEL_CURSOR_PRESETS,
  usePixelSound,
  type PixelSoundName,
  type PixelSpriteCharacter,
  type PixelSpriteMotion,
  type PixelIconName,
  type PixelIconCategoryId,
  type PixelCursorStyle,
  type AmbientSimulationMode,
} from "@/lib/mixiuh-pixel-ui";

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

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
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

  const creditSnippet = `<!-- Mixiuh Pixel UI v2.0 (Free Commercial & Personal Use with Attribution) -->
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
        {/* HERO BANNER — RETRO CRT COMPUTER & OPEN SOURCE PIXEL UI v2.0 */}
        <div className="bg-[#FFD100] text-[#090B10] border-3 border-[#090B10] shadow-[8px_8px_0_#040508] p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#090B10] text-[#FFD100] font-pixel text-xs font-bold">
                  @MIXIUH/PIXEL-UI v2.0.0
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
                      ? "Descargar Libreria v2.0 (.ZIP)"
                      : "Download Library v2.0 (.ZIP)"}
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
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 font-mono-hud text-xs">
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

              <div className="p-3 bg-[#131824] border border-white/15 font-mono-hud text-xs space-y-1.5">
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
                        <span className="font-pixel text-[9px]">
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
                      <div className="font-pixel text-[9px] mb-1">
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
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between font-mono-hud text-[10px]">
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
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
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
                    className={`px-2.5 py-1 font-pixel text-[10px] border cursor-pointer ${
                      spriteMotion === m
                        ? "bg-[#10B981] text-[#090B10] border-[#090B10] font-bold"
                        : "bg-[#131824] text-[#94A3B8] border-white/15"
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
                  <span className="font-pixel text-[9px] text-[#F5F2EB] mt-2 truncate w-full">
                    {sp.name}
                  </span>
                  <span className="font-mono-hud text-[9px] text-[#94A3B8] truncate w-full">
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

              <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
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
                role="MIXIUH PIXEL UI v2.0"
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

        {/* SECTION 5: 198 CRISP 16x16 PIXEL SVG ICONS WITH CATEGORY FILTERS, BRANDS & SEARCH */}
        <PixelWindow
          title={`06 // ${ALL_PIXEL_ICON_NAMES.length} ICONOS VECTORIALES PIXEL-ART EN GRILLA 16x16 (INCLUYE MARCAS Y REDES)`}
          subtitle="Incluye YouTube, X, Twitter, Instagram, Facebook, TikTok, Google, GitHub, Discord y todas las categorias UI"
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
                  className="px-2.5 py-1 bg-[#00E5FF] text-[#090B10] font-pixel text-[9px] font-bold cursor-pointer"
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
                    ? "Buscar icono (ej. youtube, google, instagram, x-twitter, floppy)..."
                    : "Search icon (e.g. youtube, google, instagram, x-twitter, floppy)..."
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
                      className={`w-5 h-5 border-2 cursor-pointer ${
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
                      className={`px-2 py-0.5 font-pixel text-[9px] border cursor-pointer ${
                        iconSize === sz
                          ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                          : "bg-[#090B10] text-[#94A3B8] border-white/15"
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
                    <span className="font-mono-hud text-[9px] truncate w-full text-center">
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
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-white/10 pb-4">
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
      </div>
    </div>
  );
}
