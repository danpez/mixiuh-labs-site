"use client";

import React, { useState } from "react";
import {
  PixelButton,
  PixelKeycap,
  PixelToggle,
  PixelCrank,
  PixelCard,
  PixelWindow,
  Pixel3DCartridge,
  PixelBarChart,
  PixelVersusBar,
  PixelSparkline,
  PixelDialogBox,
  PixelTelemetryPill,
  PixelCreditBadge,
  PixelIcon,
  PixelSprite,
  ALL_PIXEL_ICON_NAMES,
  usePixelSound,
  type PixelSoundName,
  type PixelSpriteCharacter,
  type PixelIconName,
} from "@/lib/mixiuh-pixel-ui";

const SOUND_PRESETS: {
  id: PixelSoundName;
  label: string;
  desc_es: string;
  desc_en: string;
  tone: "yellow" | "cyan" | "emerald" | "coral" | "violet" | "chalk";
}[] = [
  {
    id: "click",
    label: "SFX_CLICK",
    desc_es: "Micro-switch mecanico Playdate (1950Hz -> 620Hz)",
    desc_en: "Playdate mechanical micro-switch (1950Hz -> 620Hz)",
    tone: "yellow",
  },
  {
    id: "crank",
    label: "SFX_CRANK",
    desc_es: "Trinquete rotativo de manivela Playdate",
    desc_en: "Playdate rotary crank ratchet tick",
    tone: "cyan",
  },
  {
    id: "coin",
    label: "SFX_COIN",
    desc_es: "Moneda arcade 8-bit (B5 -> E6 onda cuadrada)",
    desc_en: "8-bit arcade coin pickup (B5 -> E6 square wave)",
    tone: "yellow",
  },
  {
    id: "powerup",
    label: "SFX_POWERUP",
    desc_es: "Arpegio ascendente de 6 notas chiptune",
    desc_en: "6-note ascending chiptune arpeggio",
    tone: "emerald",
  },
  {
    id: "cartridgeInsert",
    label: "SFX_CARTRIDGE",
    desc_es: "Encaje mecanico de cartucho ROM + acorde",
    desc_en: "Mechanical ROM cartridge lock + boot chord",
    tone: "violet",
  },
  {
    id: "laser",
    label: "SFX_LASER",
    desc_es: "Barrido de frecuencia sci-fi (1480Hz -> 140Hz)",
    desc_en: "Sci-fi frequency sweep (1480Hz -> 140Hz)",
    tone: "coral",
  },
  {
    id: "jump",
    label: "SFX_JUMP",
    desc_es: "Salto de plataformas 8-bit (210Hz -> 680Hz)",
    desc_en: "8-bit platformer jump bend (210Hz -> 680Hz)",
    tone: "cyan",
  },
  {
    id: "hit",
    label: "SFX_HIT",
    desc_es: "Impacto / colision retro de baja frecuencia",
    desc_en: "Retro low-frequency collision impact",
    tone: "coral",
  },
  {
    id: "dialogBlip",
    label: "SFX_DIALOG",
    desc_es: "Voz sintetizada de dialogo RPG por letra",
    desc_en: "Per-character RPG typewriter voice blip",
    tone: "chalk",
  },
  {
    id: "achievement",
    label: "SFX_FANFARE",
    desc_es: "Fanfarria de logro desbloqueado en 4 tiempos",
    desc_en: "4-step achievement unlocked fanfare",
    tone: "emerald",
  },
  {
    id: "toggleOn",
    label: "SFX_SWITCH_ON",
    desc_es: "Interruptor fisico activado (C5 -> G5)",
    desc_en: "Physical dip-switch ON (C5 -> G5)",
    tone: "cyan",
  },
  {
    id: "hover",
    label: "SFX_TICK_1BIT",
    desc_es: "Pulso sutil 1-bit al pasar el cursor",
    desc_en: "Subtle 1-bit cursor hover tick",
    tone: "chalk",
  },
];

const SPRITE_LIST: {
  id: PixelSpriteCharacter;
  name: string;
  role_es: string;
  role_en: string;
}[] = [
  {
    id: "mixiuh",
    name: "MIXIUH",
    role_es: "Director de Laboratorio",
    role_en: "Lab Director Mascot",
  },
  {
    id: "carbon",
    name: "GEMINI 4 CARBON",
    role_es: "Reactor #1 Mundial",
    role_en: "#1 Worldwide Reactor",
  },
  {
    id: "argon",
    name: "GEMINI 4 ARGON",
    role_es: "Nucleo Violeta/Cian",
    role_en: "Violet/Cyan Core",
  },
  {
    id: "opus",
    name: "CLAUDE OPUS 5.5",
    role_es: "Arquitecto Corona",
    role_en: "Crown Architect",
  },
  {
    id: "sonnet",
    name: "CLAUDE SONNET 5.5",
    role_es: "Sintetizador Agil",
    role_en: "Agile Synth Unit",
  },
  {
    id: "haiku",
    name: "CLAUDE HAIKU 5.5",
    role_es: "Unidad Velocidad",
    role_en: "Speed Unit",
  },
  {
    id: "flash",
    name: "GEMINI 3.8 FLASH",
    role_es: "Rayo Amarillo",
    role_en: "Yellow Bolt",
  },
  {
    id: "pocket-lab",
    name: "POCKET LAB 3D",
    role_es: "Consola Portatil",
    role_en: "Handheld Console",
  },
];

export default function PixelUiShowcase({ lang }: { lang: "es" | "en" }) {
  const { enabled: soundEnabled, play, toggle: toggleSound } = usePixelSound();
  const [crankAngle, setCrankAngle] = useState(90);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [switchC, setSwitchC] = useState(true);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<PixelIconName>("cartridge");
  const [creditVariant, setCreditVariant] = useState<
    "pill" | "hardware" | "minimal" | "banner"
  >("hardware");

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    play("coin");
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const creditSnippet = `<!-- Mixiuh Pixel UI v1.0 (Free Commercial & Personal Use with Attribution) -->
<link rel="stylesheet" href="https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui.css" />

<!-- React / Next.js Attribution Component -->
import { PixelCreditBadge } from "@mixiuh/pixel-ui";
<PixelCreditBadge variant="${creditVariant}" />

<!-- Plain HTML Attribution -->
<a href="https://labs.mixiuh.online#pixel-ui" target="_blank" rel="noopener">
  UI powered by Mixiuh Pixel UI (labs.mixiuh.online)
</a>`;

  return (
    <div className="py-8 sm:py-10 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HERO BANNER — PLAYDATE FLAT YELLOW + 3D HARDWARE CONTRAST */}
        <div className="bg-[#FFD100] text-[#090B10] border-3 border-[#090B10] shadow-[8px_8px_0_#040508] p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#090B10] text-[#FFD100] font-pixel text-xs font-bold">
                  @MIXIUH/PIXEL-UI v1.0.0
                </span>
                <span className="px-3 py-1 bg-[#F5F2EB] text-[#090B10] border-2 border-[#090B10] font-mono-hud text-xs font-bold">
                  {lang === "es"
                    ? "100% GRATIS · USO COMERCIAL Y PERSONAL CON CREDITO"
                    : "100% FREE · COMMERCIAL & PERSONAL USE WITH CREDIT"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.04]">
                {lang === "es"
                  ? "La Libreria Pixel-Art + 3D Hardware Mas Completa del Mundo."
                  : "The World's Most Complete Pixel-Art + 3D Hardware UI Library."}
              </h1>

              <p className="text-sm sm:text-base font-medium text-[#090B10]/85 leading-relaxed">
                {lang === "es"
                  ? "Inspirada en el minimalismo plano + objetos 3D tactiles de Playdate y la telemetria arcade de Mixiuh Labs. Incluye +40 componentes React/Tailwind, 52 iconos vectoriales en grilla 16x16, 8 sprites animados, graficas pixeladas, consolas y cartuchos 3D y un sintetizador WebAudio 8-bit sin archivos externos. Libre para cualquier proyecto comercial o indie dando credito a Mixiuh Labs."
                  : "Inspired by Playdate's flat minimalism + tactile 3D renders and Mixiuh Labs' arcade telemetry. Includes 40+ React/Tailwind components, 52 16x16 grid SVG icons, 8 animated sprites, pixel charts, 3D consoles & cartridges, and a zero-dependency WebAudio 8-bit synthesizer. Free for any commercial or indie project with credit to Mixiuh Labs."}
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
                      ? "Descargar Libreria Completa (.ZIP)"
                      : "Download Complete Library (.ZIP)"}
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

            {/* Right: Floating 3D Keycaps & Rotary Crank Hardware Module */}
            <div className="lg:col-span-5 bg-[#090B10] text-[#F5F2EB] border-3 border-[#090B10] shadow-[6px_6px_0_rgba(0,0,0,0.35)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 font-mono-hud text-xs">
                <span className="font-pixel text-[#FFD100]">
                  HARDWARE DECK // PRUEBA EN VIVO
                </span>
                <span className="text-[#00E5FF] font-bold">60 FPS + AUDIO</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <PixelCrank
                  angle={crankAngle}
                  onChange={setCrankAngle}
                  label={
                    lang === "es" ? "MANIVELA PLAYDATE" : "PLAYDATE CRANK"
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
                    caption="LASER"
                    tone="coral"
                    onTrigger={() => play("laser")}
                  />
                  <PixelKeycap
                    keyLabel="X"
                    caption="POWER"
                    tone="cyan"
                    onTrigger={() => play("powerup")}
                  />
                </div>
              </div>

              {/* Segmented Crank Meter */}
              <div className="p-3 bg-[#131824] border border-white/15 font-mono-hud text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">
                    {lang === "es"
                      ? "ANGULO DE MANIVELA ROTATIVA"
                      : "ROTARY CRANK TELEMETRY"}
                  </span>
                  <span className="font-pixel text-[#00E5FF]">
                    {crankAngle}° / 360°
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3"
                      style={{
                        backgroundColor:
                          i <= Math.floor((crankAngle / 360) * 12)
                            ? "#FFD100"
                            : "#090B10",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: WEBAUDIO 8-BIT SYNTHESIZER SOUNDBOARD */}
        <PixelWindow
          title="01 // PIXEL_SOUND_ENGINE.TS (SINTETIZADOR WEBAUDIO 8-BIT)"
          subtitle={
            lang === "es"
              ? "12 efectos procedurales en tiempo real · Cero archivos MP3 externos"
              : "12 procedural real-time sound effects · Zero external MP3 files"
          }
          tone="cyan"
          statusLeft="CHANNELS: SQUARE + TRIANGLE + SAWTOOTH"
          statusRight="LATENCY: < 2MS"
        >
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
                  <code className="text-[#00E5FF]">
                    {`play("${s.id}")`}
                  </code>
                  <span className="px-1.5 py-0.5 bg-[#FFD100] text-[#090B10] font-bold">
                    TEST ▶
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PixelWindow>

        {/* SECTION 2: BUTTONS, TACTILE SWITCHES, TELEMETRY PILLS & RPG DIALOG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PixelWindow
            title="02 // BOTONES TACTILES, INTERRUPTORES Y PILDORAS"
            subtitle="7 paletas Playdate + desplazamiento fisico de 4px"
            tone="yellow"
            statusLeft="WCAG AA CONTRAST"
            statusRight="STEPPED CORNERS"
          >
            <div className="space-y-5">
              <div>
                <div className="font-mono-hud text-xs font-bold text-[#94A3B8] mb-2.5 uppercase">
                  {lang === "es"
                    ? "Paleta Limitada de Alto Contraste (PixelButton)"
                    : "High-Contrast Limited Palette (PixelButton)"}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <PixelButton tone="yellow" icon="bolt">
                    SIGNAL YELLOW
                  </PixelButton>
                  <PixelButton tone="cyan" icon="terminal">
                    ELECTRIC CYAN
                  </PixelButton>
                  <PixelButton tone="emerald" icon="check">
                    ARCADE EMERALD
                  </PixelButton>
                  <PixelButton tone="coral" icon="flame" sound="laser">
                    SIGNAL CORAL
                  </PixelButton>
                  <PixelButton tone="violet" icon="cpu" sound="powerup">
                    ARGON VIOLET
                  </PixelButton>
                  <PixelButton tone="chalk" icon="star" sound="coin">
                    WARM CHALK
                  </PixelButton>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="font-mono-hud text-xs font-bold text-[#94A3B8] mb-2.5 uppercase">
                  {lang === "es"
                    ? "Interruptores DIP de Hardware (PixelToggle)"
                    : "Hardware DIP Switches (PixelToggle)"}
                </div>
                <div className="flex flex-wrap gap-5">
                  <PixelToggle
                    checked={switchA}
                    onChange={setSwitchA}
                    label="60 FPS LOCK"
                    tone="yellow"
                  />
                  <PixelToggle
                    checked={switchB}
                    onChange={setSwitchB}
                    label="CRT SCANLINES"
                    tone="cyan"
                  />
                  <PixelToggle
                    checked={switchC}
                    onChange={setSwitchC}
                    label="ZERO-SHOT MODE"
                    tone="emerald"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="font-mono-hud text-xs font-bold text-[#94A3B8] mb-2.5 uppercase">
                  {lang === "es"
                    ? "Pildoras Oficiales de Telemetria (PixelTelemetryPill)"
                    : "Official Telemetry Pills (PixelTelemetryPill)"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <PixelTelemetryPill
                    kind="time"
                    value="90 MIN"
                    tone="cyan"
                  />
                  <PixelTelemetryPill
                    kind="cost"
                    value="$6.26 USD"
                    tone="yellow"
                  />
                  <PixelTelemetryPill
                    kind="score"
                    value="4 - 2 WINNER"
                    tone="emerald"
                  />
                  <PixelTelemetryPill
                    kind="model"
                    value="GEMINI 4 CARBON"
                    tone="violet"
                  />
                </div>
              </div>
            </div>
          </PixelWindow>

          <PixelWindow
            title="03 // DIALOGO RPG INTERACTIVO Y SPRITES IA"
            subtitle="Efecto maquina de escribir + voz sintetizada por personaje"
            tone="emerald"
            statusLeft="8 ANIMATED SVG SPRITES"
            statusRight="ZERO UNICODE EMOJIS"
          >
            <div className="space-y-4">
              <PixelDialogBox
                speaker="MIXIUH LABS"
                role="OPEN SOURCE UI KIT v1.0"
                character="mixiuh"
                tone="yellow"
                messages={[
                  lang === "es"
                    ? "Aqui no se opina: se prueba. Haz clic en esta caja de dialogo para escuchar las voces 8-bit y avanzar el texto."
                    : "Here we don't guess: we test. Click this dialog box to hear the 8-bit voice blips and advance the text.",
                  lang === "es"
                    ? "Puedes usar todos estos componentes, iconos, sonidos y cartuchos 3D totalmente GRATIS en tus proyectos comerciales o personales dando credito a Mixiuh Labs."
                    : "You can use all these components, icons, sounds, and 3D cartridges 100% FREE in your commercial or personal projects by crediting Mixiuh Labs.",
                ]}
              />

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {SPRITE_LIST.map((sp) => (
                  <div
                    key={sp.id}
                    onClick={() => play("coin")}
                    className="p-2 bg-[#131824] border border-white/15 hover:border-[#FFD100] flex flex-col items-center text-center cursor-pointer"
                    title={lang === "es" ? sp.role_es : sp.role_en}
                  >
                    <PixelSprite character={sp.id} size={34} />
                    <span className="font-pixel text-[8px] text-[#F5F2EB] mt-1.5 truncate w-full">
                      {sp.id.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PixelWindow>
        </div>

        {/* SECTION 3: PIXEL-ART DATA CHARTS & BENCHMARK VISUALIZATIONS */}
        <PixelWindow
          title="04 // GRAFICAS PIXEL-ART Y TELEMETRIA (PIXEL_CHARTS)"
          subtitle="Barras segmentadas LED, marcadores Arcade VS y osciloscopios escalonados"
          tone="violet"
          statusLeft="PURE CSS + SVG GRID"
          statusRight="ZERO CHARTING BLOAT"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <div className="font-pixel text-xs text-[#FFD100] mb-3">
                A. PIXEL_BAR_CHART (TERMINAL-BENCH HARD)
              </div>
              <PixelBarChart
                items={[
                  {
                    label: "Gemini 4 Carbon",
                    value: 54.5,
                    maxValue: 60,
                    displayValue: "54.5%",
                    tone: "cyan",
                    badge: "#1 WORLD",
                  },
                  {
                    label: "Claude Opus 5.5",
                    value: 53.0,
                    maxValue: 60,
                    displayValue: "53.0%",
                    tone: "coral",
                  },
                  {
                    label: "Gemini 4 Argon",
                    value: 48.2,
                    maxValue: 60,
                    displayValue: "48.2%",
                    tone: "violet",
                  },
                  {
                    label: "Claude Haiku 5.5",
                    value: 39.4,
                    maxValue: 60,
                    displayValue: "39.4%",
                    tone: "emerald",
                  },
                ]}
              />
            </div>

            <div className="space-y-4">
              <div className="font-pixel text-xs text-[#FFD100] mb-3">
                B. PIXEL_VERSUS_BAR (TUG-OF-WAR)
              </div>
              <PixelVersusBar
                leftName="GEMINI 4 ARGON"
                leftScore={4}
                leftTone="violet"
                rightName="CLAUDE OPUS 5.5"
                rightScore={2}
                rightTone="yellow"
                subtitle="EP02: 90 MIN ($6.26 USD) vs 159 MIN ($16.26 USD)"
              />
              <PixelVersusBar
                leftName="SUPERPOWERS KIT"
                leftScore={4}
                leftTone="emerald"
                rightName="ARGON SIN KIT"
                rightScore={2}
                rightTone="cyan"
                subtitle="EP03: 70,406 ORD/S HFT + AUTO-DEBUGGER MCP"
              />
            </div>

            <div className="space-y-4">
              <div className="font-pixel text-xs text-[#FFD100] mb-3">
                C. PIXEL_SPARKLINE (OSCILOSCOPIO 60 FPS)
              </div>
              <PixelSparkline
                label="RENDIMIENTO SHADER NAVIER-STOKES (FPS)"
                currentValue="60.0 FPS"
                tone="emerald"
                data={[42, 48, 51, 55, 58, 60, 60, 59, 60, 60, 60, 60]}
              />
              <PixelSparkline
                label="COSTO ACUMULADO POR RONDA ($ USD)"
                currentValue="$0.21 USD"
                tone="yellow"
                data={[18, 24, 15, 29, 21, 19, 22, 16, 20, 14, 18, 12]}
              />
            </div>
          </div>
        </PixelWindow>

        {/* SECTION 4: 52 CRISP 16x16 PIXEL SVG ICONS */}
        <PixelWindow
          title="05 // 52 ICONOS VECTORIALES PIXEL-ART EN GRILLA 16x16"
          subtitle="Haz clic en cualquier icono para copiar el componente <PixelIcon />"
          tone="chalk"
          statusLeft={`SELECTED: <PixelIcon name="${selectedIcon}" />`}
          statusRight="CRISP EDGES SVG"
        >
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-2">
            {ALL_PIXEL_ICON_NAMES.map((iconName) => {
              const isSel = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(iconName);
                    copyCode(
                      `icon-${iconName}`,
                      `<PixelIcon name="${iconName}" size={16} />`
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
                    size={18}
                    color={isSel ? "#090B10" : "#00E5FF"}
                  />
                  <span className="font-mono-hud text-[9px] truncate w-full text-center">
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>
          {copiedSnippet?.startsWith("icon-") && (
            <div className="mt-3 px-3 py-2 bg-[#10B981] text-[#090B10] font-mono-hud text-xs font-bold inline-flex items-center gap-2">
              <PixelIcon name="check" size={14} color="#090B10" />
              <span>
                {`Copiado al portapapeles: <PixelIcon name="${selectedIcon}" size={16} />`}
              </span>
            </div>
          )}
        </PixelWindow>

        {/* SECTION 5: FREE COMMERCIAL LICENSE & 1-LINE ATTRIBUTION GENERATOR */}
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

          {/* Live Preview of the Selected Credit Badge */}
          <div className="p-6 bg-[#090B10] border-2 border-[#2A344B] px-dither-dots flex items-center justify-center">
            <PixelCreditBadge variant={creditVariant} />
          </div>

          {/* Code Snippet + Copy Button */}
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
