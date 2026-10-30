"use client";

import React, { useState, useEffect } from "react";
import { pixelSound, type PixelSoundName } from "./sound";
import {
  PixelIcon,
  PixelSprite,
  type PixelIconName,
  type PixelSpriteCharacter,
} from "./icons";

export type PixelTone =
  | "yellow"
  | "cyan"
  | "emerald"
  | "coral"
  | "violet"
  | "chalk"
  | "ink";

const TONE_STYLES: Record<
  PixelTone,
  {
    bg: string;
    text: string;
    border: string;
    hex: string;
    cardClass: string;
  }
> = {
  yellow: {
    bg: "bg-[#FFD100]",
    text: "text-[#090B10]",
    border: "border-[#FFD100]",
    hex: "#FFD100",
    cardClass: "px-card-yellow",
  },
  cyan: {
    bg: "bg-[#00E5FF]",
    text: "text-[#090B10]",
    border: "border-[#00E5FF]",
    hex: "#00E5FF",
    cardClass: "px-card-cyan",
  },
  emerald: {
    bg: "bg-[#10B981]",
    text: "text-[#090B10]",
    border: "border-[#10B981]",
    hex: "#10B981",
    cardClass: "px-card-emerald",
  },
  coral: {
    bg: "bg-[#FF3355]",
    text: "text-white",
    border: "border-[#FF3355]",
    hex: "#FF3355",
    cardClass: "px-card-coral",
  },
  violet: {
    bg: "bg-[#A855F7]",
    text: "text-white",
    border: "border-[#A855F7]",
    hex: "#A855F7",
    cardClass: "px-card-violet",
  },
  chalk: {
    bg: "bg-[#F5F2EB]",
    text: "text-[#090B10]",
    border: "border-[#F5F2EB]",
    hex: "#F5F2EB",
    cardClass: "px-card-chalk",
  },
  ink: {
    bg: "bg-[#131824]",
    text: "text-[#F5F2EB]",
    border: "border-[#2A344B]",
    hex: "#131824",
    cardClass: "px-card",
  },
};

/* ============================================================================
   1. TACTILE PIXEL BUTTON & 3D KEYCAP
   ============================================================================ */

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: PixelTone;
  size?: "xs" | "sm" | "md" | "lg";
  icon?: PixelIconName;
  sound?: PixelSoundName;
  stepped?: boolean;
}

export function PixelButton({
  tone = "yellow",
  size = "md",
  icon,
  sound = "click",
  stepped = false,
  className = "",
  children,
  onClick,
  onMouseEnter,
  ...rest
}: PixelButtonProps) {
  const t = TONE_STYLES[tone];
  const sizeMap = {
    xs: "px-2.5 py-1 text-[11px]",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-xs sm:text-sm",
    lg: "px-6 py-3.5 text-sm sm:text-base",
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        pixelSound.play(sound);
        onClick?.(e);
      }}
      onMouseEnter={(e) => {
        pixelSound.play("hover", { volume: 0.4 });
        onMouseEnter?.(e);
      }}
      className={`px-btn ${t.bg} ${t.text} ${sizeMap[size]} ${
        stepped ? "px-step-sm" : "rounded-none"
      } ${className}`}
      {...rest}
    >
      {icon && <PixelIcon name={icon} size={size === "lg" ? 18 : 15} />}
      <span>{children}</span>
    </button>
  );
}

export interface PixelKeycapProps {
  keyLabel: string;
  caption?: string;
  tone?: PixelTone;
  onTrigger?: () => void;
}

export function PixelKeycap({
  keyLabel,
  caption,
  tone = "chalk",
  onTrigger,
}: PixelKeycapProps) {
  const [pressed, setPressed] = useState(false);
  const t = TONE_STYLES[tone];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === keyLabel.toUpperCase()) {
        setPressed(true);
        pixelSound.play("click", { pitchMultiplier: 1.1 });
        onTrigger?.();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === keyLabel.toUpperCase()) {
        setPressed(false);
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [keyLabel, onTrigger]);

  return (
    <button
      type="button"
      onClick={() => {
        pixelSound.play("click", { pitchMultiplier: 1.1 });
        onTrigger?.();
      }}
      className={`px-3d-keycap ${t.bg} ${t.text} px-3.5 py-2.5 flex flex-col items-center justify-center min-w-[54px] ${
        pressed ? "is-pressed" : ""
      }`}
    >
      <span className="font-pixel text-sm font-bold leading-none">
        {keyLabel}
      </span>
      {caption && (
        <span className="font-mono-hud text-[9px] opacity-75 mt-1 uppercase">
          {caption}
        </span>
      )}
    </button>
  );
}

/* ============================================================================
   2. PLAYDATE ROTARY CRANK & HARDWARE TOGGLE
   ============================================================================ */

export interface PixelToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  tone?: PixelTone;
}

export function PixelToggle({
  checked,
  onChange,
  label,
  tone = "yellow",
}: PixelToggleProps) {
  const t = TONE_STYLES[tone];
  return (
    <button
      type="button"
      onClick={() => {
        const next = !checked;
        pixelSound.play(next ? "toggleOn" : "toggleOff");
        onChange(next);
      }}
      className="inline-flex items-center gap-2.5 font-mono-hud text-xs cursor-pointer select-none"
    >
      <div
        className={`w-12 h-6 border-2 border-[#090B10] p-0.5 flex items-center transition-colors ${
          checked ? t.bg : "bg-[#1A2132]"
        }`}
        style={{ boxShadow: "3px 3px 0px #040508" }}
      >
        <div
          className={`w-5 h-4 bg-[#090B10] transition-transform duration-100 flex items-center justify-center ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 ${
              checked ? "bg-[#10B981]" : "bg-[#64748B]"
            }`}
          />
        </div>
      </div>
      {label && <span className="font-bold text-[#F5F2EB]">{label}</span>}
    </button>
  );
}

export interface PixelCrankProps {
  angle: number;
  onChange: (nextAngle: number) => void;
  label?: string;
}

export function PixelCrank({ angle, onChange, label }: PixelCrankProps) {
  const stepRotate = (delta: number) => {
    const next = (angle + delta + 360) % 360;
    pixelSound.play("crank", {
      pitchMultiplier: 0.85 + (next / 360) * 0.45,
    });
    onChange(next);
  };

  return (
    <div className="inline-flex items-center gap-3 p-3 bg-[#111622] border-2 border-[#FFD100] shadow-[4px_4px_0_#040508]">
      <div
        onClick={() => stepRotate(45)}
        title="Click to spin Playdate Crank (+45 deg)"
        className="relative w-14 h-14 rounded-full bg-[#090B10] border-2 border-[#FFD100] flex items-center justify-center cursor-pointer select-none group"
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-150"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="w-2 h-6 bg-[#FFD100] -translate-y-2 border border-[#090B10]" />
          <div className="w-4 h-4 rounded-full bg-[#FFD100] border-2 border-[#090B10] absolute top-1" />
        </div>
        <div className="w-3 h-3 rounded-full bg-[#F5F2EB] border border-[#090B10] absolute" />
      </div>
      <div className="font-mono-hud text-xs">
        <div className="text-[10px] font-bold text-[#FFD100] uppercase">
          {label || "PLAYDATE CRANK"}
        </div>
        <div className="text-sm font-black text-white">{angle}°</div>
        <div className="flex items-center gap-1 mt-1">
          <button
            type="button"
            onClick={() => stepRotate(-45)}
            className="px-1.5 py-0.5 bg-[#1A2132] hover:bg-[#FFD100] hover:text-[#090B10] text-[10px] font-bold border border-white/20 cursor-pointer"
          >
            -45°
          </button>
          <button
            type="button"
            onClick={() => stepRotate(45)}
            className="px-1.5 py-0.5 bg-[#FFD100] text-[#090B10] text-[10px] font-bold border border-[#090B10] cursor-pointer"
          >
            +45°
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. PLAYDATE SPEC CARDS, RETRO OS WINDOWS & 3D CARTRIDGES
   ============================================================================ */

export interface PixelCardProps {
  tone?: PixelTone;
  kicker?: string;
  title?: string;
  badge?: string;
  interactive?: boolean;
  ditherHeader?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function PixelCard({
  tone = "ink",
  kicker,
  title,
  badge,
  interactive = false,
  ditherHeader = false,
  className = "",
  onClick,
  children,
}: PixelCardProps) {
  const t = TONE_STYLES[tone];

  return (
    <div
      onClick={() => {
        if (onClick) {
          pixelSound.play("click");
          onClick();
        }
      }}
      className={`${t.cardClass} ${
        interactive || onClick ? "px-card-interactive cursor-pointer" : ""
      } ${className}`}
    >
      {(kicker || badge) && (
        <div
          className={`px-4 py-2 border-b-2 border-[#090B10] flex items-center justify-between gap-2 font-mono-hud text-[11px] font-bold ${
            tone === "chalk"
              ? "bg-[#FFD100] text-[#090B10]"
              : "bg-[#090B10] text-[#F5F2EB]"
          } ${ditherHeader ? "px-dither-dots" : ""}`}
        >
          <span
            className="uppercase tracking-wider"
            style={{ color: tone === "chalk" ? "#090B10" : t.hex }}
          >
            {kicker}
          </span>
          {badge && (
            <span
              className="px-2 py-0.5 text-[10px] font-bold text-[#090B10]"
              style={{ backgroundColor: tone === "ink" ? "#FFD100" : t.hex }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        {title && (
          <h3 className="font-display text-lg sm:text-xl font-black mb-2">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}

export interface PixelWindowProps {
  title: string;
  subtitle?: string;
  tone?: PixelTone;
  statusLeft?: string;
  statusRight?: string;
  children: React.ReactNode;
  className?: string;
}

export function PixelWindow({
  title,
  subtitle,
  tone = "yellow",
  statusLeft,
  statusRight,
  children,
  className = "",
}: PixelWindowProps) {
  const [minimized, setMinimized] = useState(false);
  const t = TONE_STYLES[tone];

  return (
    <div
      className={`bg-[#0E121B] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] overflow-hidden ${className}`}
      style={{ outline: `2px solid ${t.hex}` }}
    >
      {/* Retro Lab OS Titlebar */}
      <div
        className={`px-3.5 py-2 ${t.bg} ${t.text} border-b-2 border-[#090B10] flex items-center justify-between gap-2 select-none`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <PixelIcon name="window" size={14} />
          <span className="font-pixel text-xs font-bold truncate">{title}</span>
          {subtitle && (
            <span className="hidden sm:inline-block font-mono-hud text-[10px] opacity-80 truncate">
              // {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              pixelSound.play("click");
              setMinimized(!minimized);
            }}
            className="w-5 h-5 bg-[#090B10] text-[#F5F2EB] font-mono-hud text-[10px] font-bold flex items-center justify-center hover:bg-[#FF3355] cursor-pointer"
            title={minimized ? "Expand window" : "Minimize window"}
          >
            {minimized ? "+" : "-"}
          </button>
          <span className="w-5 h-5 bg-[#090B10] text-[#F5F2EB] font-mono-hud text-[10px] font-bold flex items-center justify-center">
            □
          </span>
        </div>
      </div>

      {!minimized && <div className="p-4 sm:p-5">{children}</div>}

      {(statusLeft || statusRight) && (
        <div className="px-3.5 py-1.5 bg-[#090B10] border-t border-white/10 flex items-center justify-between font-mono-hud text-[10px] text-[#94A3B8]">
          <span>{statusLeft || "READY"}</span>
          <span style={{ color: t.hex }}>{statusRight}</span>
        </div>
      )}
    </div>
  );
}

export interface Pixel3DCartridgeProps {
  code: string;
  title: string;
  subtitle: string;
  score: string;
  timeLabel: string;
  costLabel: string;
  tone?: PixelTone;
  thumb?: string;
  active?: boolean;
  onSelect?: () => void;
}

export function Pixel3DCartridge({
  code,
  title,
  subtitle,
  score,
  timeLabel,
  costLabel,
  tone = "yellow",
  thumb,
  active = false,
  onSelect,
}: Pixel3DCartridgeProps) {
  const t = TONE_STYLES[tone];

  return (
    <div
      onClick={() => {
        pixelSound.play("cartridgeInsert");
        onSelect?.();
      }}
      className={`px-3d-cartridge bg-[#151B29] p-3.5 cursor-pointer select-none flex flex-col justify-between ${
        active ? "ring-2 ring-[#FFD100]" : ""
      }`}
      style={{ borderColor: t.hex }}
    >
      {/* Top Cartridge Grip Ribs & Serial Code */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex flex-col gap-1 w-14">
          <div className="h-1 bg-white/20" />
          <div className="h-1 bg-white/20" />
          <div className="h-1 bg-white/20" />
        </div>
        <span
          className={`px-2 py-0.5 font-pixel text-[10px] font-bold ${t.bg} ${t.text} border border-[#090B10]`}
        >
          {code}
        </span>
      </div>

      {/* Recessed Cartridge Artwork Sticker */}
      <div className="bg-[#090B10] border-2 border-[#040508] p-2.5 space-y-2">
        {thumb && (
          <div className="relative aspect-video overflow-hidden border border-white/15">
            <img
              src={thumb}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#090B10]/90 border border-white/20 font-mono-hud text-[9px] font-bold text-[#FFD100]">
              {score}
            </div>
          </div>
        )}
        <div>
          <div
            className="font-pixel text-xs font-bold leading-snug"
            style={{ color: t.hex }}
          >
            {title}
          </div>
          <div className="font-mono-hud text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">
            {subtitle}
          </div>
        </div>

        {/* Standard Mixiuh Telemetry Pills: [CLOCK + MIN] & [COIN + $ USD] */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono-hud text-[10px]">
          <div className="px-2 py-1 bg-[#131824] border border-white/10 flex items-center gap-1 text-[#F5F2EB]">
            <PixelIcon name="clock" size={11} color="#00E5FF" />
            <span className="truncate">{timeLabel}</span>
          </div>
          <div className="px-2 py-1 bg-[#131824] border border-white/10 flex items-center gap-1 text-[#FFD100]">
            <PixelIcon name="coin" size={11} color="#FFD100" />
            <span className="truncate">{costLabel}</span>
          </div>
        </div>
      </div>

      {/* Bottom Gold PCB Contact Pins */}
      <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-2.5 bg-[#FFD100] border border-[#090B10]"
            />
          ))}
        </div>
        <span className="font-mono-hud text-[9px] font-bold text-[#94A3B8] uppercase">
          INSERT ROM →
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
   4. PLAYDATE 3D HANDHELD CONSOLE RENDER ("MIXIUH POCKET LAB // REV 4.0")
   ============================================================================ */

export interface PocketConsoleCartridgeItem {
  id: string;
  code: string;
  kicker: string;
  title: string;
  verdict: string;
  timeMetric: string;
  costMetric: string;
  thumb: string;
  accentHex: string;
  character: PixelSpriteCharacter;
  onLaunchPrimary: () => void;
  onLaunchSecondary?: () => void;
  primaryLabel: string;
  secondaryLabel?: string;
}

export interface Pixel3DPocketConsoleProps {
  items: PocketConsoleCartridgeItem[];
  lang?: "es" | "en";
}

export function Pixel3DPocketConsole({
  items,
  lang = "es",
}: Pixel3DPocketConsoleProps) {
  const [idx, setIdx] = useState(0);
  const [crankAngle, setCrankAngle] = useState(0);
  const current = items[idx] || items[0];

  if (!current) return null;

  const cycleCartridge = (dir: 1 | -1) => {
    const next = (idx + dir + items.length) % items.length;
    setIdx(next);
    setCrankAngle((a) => (a + dir * 45 + 360) % 360);
    pixelSound.play("cartridgeInsert");
  };

  return (
    <div className="px-3d-stage w-full">
      <div className="px-3d-console-shell p-4 sm:p-5 text-[#090B10]">
        {/* Top Console Hardware Stamp & LED */}
        <div className="flex items-center justify-between gap-2 mb-2.5 font-mono-hud text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#090B10]" />
            <span className="tracking-wider uppercase font-black">
              MIXIUH POCKET LAB // 3D DECK
            </span>
          </div>
          <span className="px-2 py-0.5 bg-[#090B10] text-[#FFD100] font-pixel text-[9px]">
            ROM {idx + 1}/{items.length} · {current.code}
          </span>
        </div>

        {/* Recessed High-Contrast Screen Bezel */}
        <div className="px-3d-screen-bezel p-3 text-[#F5F2EB] space-y-2.5">
          {/* Screen Top Telemetry Strip */}
          <div className="flex items-center justify-between gap-2 font-mono-hud text-[10px]">
            <span
              className="px-2 py-0.5 font-bold text-[#090B10]"
              style={{ backgroundColor: current.accentHex }}
            >
              {current.kicker}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[#00E5FF]">
                <PixelIcon name="clock" size={11} color="#00E5FF" />
                {current.timeMetric}
              </span>
              <span className="inline-flex items-center gap-1 text-[#FFD100]">
                <PixelIcon name="coin" size={11} color="#FFD100" />
                {current.costMetric}
              </span>
            </div>
          </div>

          {/* 4K Thumbnail Viewport with Floating Pixel Sprite Badge */}
          <div
            onClick={() => {
              pixelSound.play("powerup");
              current.onLaunchPrimary();
            }}
            className="relative aspect-video overflow-hidden border-2 border-[#2A344B] group cursor-pointer"
          >
            <img
              src={current.thumb}
              alt={current.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-transparent to-transparent flex items-end justify-between p-2.5">
              <div>
                <div className="font-pixel text-[10px] text-[#FFD100]">
                  {current.verdict}
                </div>
                <div className="font-display text-xs sm:text-sm font-black text-white leading-tight line-clamp-1">
                  {current.title}
                </div>
              </div>
              <div className="p-1 bg-[#090B10]/90 border border-white/20">
                <PixelSprite character={current.character} size={30} />
              </div>
            </div>
          </div>

          {/* Cartridge Quick Selector Tabs inside Screen */}
          <div className="grid grid-cols-5 gap-1 pt-0.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIdx(i);
                  pixelSound.play("cartridgeInsert");
                }}
                className={`py-1 px-1 font-pixel text-[9px] border transition cursor-pointer truncate ${
                  i === idx
                    ? "bg-[#FFD100] text-[#090B10] border-[#FFD100] font-bold"
                    : "bg-[#131824] text-[#94A3B8] border-white/10 hover:text-white"
                }`}
              >
                {item.code}
              </button>
            ))}
          </div>
        </div>

        {/* Physical Console Controls Deck: D-Pad + A/B Buttons + Playdate Side Crank */}
        <div className="mt-3.5 pt-2 border-t-2 border-[#090B10]/25 flex items-center justify-between gap-3">
          {/* Tactile Cross D-Pad */}
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <button
                type="button"
                onClick={() => cycleCartridge(-1)}
                title={lang === "es" ? "Cartucho anterior" : "Previous cartridge"}
                className="w-16 h-6 bg-[#131824] text-[#F5F2EB] border-2 border-[#090B10] shadow-[0_3px_0_#040508] active:translate-y-0.5 flex items-center justify-between px-1.5 font-pixel text-[9px] cursor-pointer"
              >
                <span>◀</span>
                <span>▶</span>
              </button>
              <button
                type="button"
                onClick={() => cycleCartridge(1)}
                title={lang === "es" ? "Siguiente cartucho" : "Next cartridge"}
                className="absolute w-6 h-16 bg-[#131824] text-[#F5F2EB] border-2 border-[#090B10] shadow-[0_3px_0_#040508] active:translate-y-0.5 flex flex-col items-center justify-between py-1 font-pixel text-[8px] cursor-pointer"
              >
                <span>▲</span>
                <span className="w-2 h-2 rounded-full bg-[#FFD100]" />
                <span>▼</span>
              </button>
            </div>
          </div>

          {/* Center Speaker Grille + Action CTA */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#090B10]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                pixelSound.play("powerup");
                current.onLaunchPrimary();
              }}
              className="w-full py-2 px-3 bg-[#090B10] hover:bg-[#131824] text-[#FFD100] border-2 border-[#090B10] font-pixel text-[10px] font-bold shadow-[3px_3px_0_rgba(0,0,0,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PixelIcon name="play" size={12} color="#FFD100" />
              <span className="truncate">{current.primaryLabel}</span>
            </button>
          </div>

          {/* B / A Physical Round Buttons + Crank Hinge */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                pixelSound.play("coin");
                if (current.onLaunchSecondary) {
                  current.onLaunchSecondary();
                } else {
                  cycleCartridge(1);
                }
              }}
              title={current.secondaryLabel || "Action B"}
              className="w-10 h-10 rounded-full bg-[#131824] text-[#F5F2EB] border-2 border-[#090B10] shadow-[0_4px_0_#040508] active:translate-y-1 font-pixel text-xs font-bold flex items-center justify-center cursor-pointer"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => {
                pixelSound.play("powerup");
                current.onLaunchPrimary();
              }}
              title={current.primaryLabel}
              className="w-10 h-10 rounded-full bg-[#FF3355] text-white border-2 border-[#090B10] shadow-[0_4px_0_#040508] active:translate-y-1 font-pixel text-xs font-bold flex items-center justify-center -translate-y-2 cursor-pointer"
            >
              A
            </button>
            {/* Docked Rotary Crank Handle */}
            <button
              type="button"
              onClick={() => {
                cycleCartridge(1);
                pixelSound.play("crank", { pitchMultiplier: 1.15 });
              }}
              title={`Crank (${crankAngle} deg) — Click to spin`}
              className="w-6 h-14 bg-[#C49F00] border-2 border-[#090B10] flex flex-col items-center justify-between p-1 cursor-pointer hover:bg-[#00E5FF]"
            >
              <span className="w-2.5 h-2.5 bg-[#090B10]" />
              <span className="font-mono-hud text-[8px] font-bold leading-none">
                CRK
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   5. PIXEL-ART CHARTS & TELEMETRY VISUALIZATIONS
   ============================================================================ */

export interface PixelBarChartItem {
  label: string;
  value: number;
  maxValue?: number;
  displayValue: string;
  tone?: PixelTone;
  badge?: string;
}

export function PixelBarChart({
  items,
  segments = 16,
}: {
  items: PixelBarChartItem[];
  segments?: number;
}) {
  const maxVal = Math.max(...items.map((i) => i.maxValue || i.value), 1);

  return (
    <div className="space-y-3 font-mono-hud">
      {items.map((item) => {
        const t = TONE_STYLES[item.tone || "yellow"];
        const ratio = Math.min(1, Math.max(0, item.value / maxVal));
        const activeCount = Math.max(1, Math.round(ratio * segments));

        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F5F2EB]">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold ${t.bg} ${t.text}`}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="font-bold" style={{ color: t.hex }}>
                  {item.displayValue}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-16 gap-1 p-1 bg-[#090B10] border-2 border-[#2A344B]">
              {Array.from({ length: segments }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-3.5 transition-all duration-150"
                  style={{
                    backgroundColor:
                      idx < activeCount ? t.hex : "rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PixelVersusBar({
  leftName,
  leftScore,
  leftTone = "cyan",
  rightName,
  rightScore,
  rightTone = "coral",
  subtitle,
}: {
  leftName: string;
  leftScore: number;
  leftTone?: PixelTone;
  rightName: string;
  rightScore: number;
  rightTone?: PixelTone;
  subtitle?: string;
}) {
  const total = Math.max(1, leftScore + rightScore);
  const leftPct = Math.round((leftScore / total) * 100);
  const lt = TONE_STYLES[leftTone];
  const rt = TONE_STYLES[rightTone];

  return (
    <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] space-y-2 font-mono-hud">
      <div className="flex items-center justify-between text-xs font-bold">
        <span style={{ color: lt.hex }}>
          {leftName} [{leftScore}]
        </span>
        <span className="px-2 py-0.5 bg-[#FFD100] text-[#090B10] font-pixel text-[10px]">
          VS
        </span>
        <span style={{ color: rt.hex }}>
          [{rightScore}] {rightName}
        </span>
      </div>
      <div className="h-5 w-full bg-[#131824] border-2 border-[#040508] flex overflow-hidden">
        <div
          style={{ width: `${leftPct}%`, backgroundColor: lt.hex }}
          className="h-full border-r-2 border-[#090B10] transition-all duration-300"
        />
        <div
          style={{ width: `${100 - leftPct}%`, backgroundColor: rt.hex }}
          className="h-full transition-all duration-300"
        />
      </div>
      {subtitle && (
        <div className="text-[10px] text-center text-[#94A3B8]">{subtitle}</div>
      )}
    </div>
  );
}

export function PixelSparkline({
  data,
  tone = "cyan",
  label,
  currentValue,
}: {
  data: number[];
  tone?: PixelTone;
  label: string;
  currentValue: string;
}) {
  const t = TONE_STYLES[tone];
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);

  return (
    <div className="p-3.5 bg-[#090B10] border-2 border-[#2A344B] font-mono-hud">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-[#94A3B8] font-bold uppercase">{label}</span>
        <span className="font-pixel text-xs font-bold" style={{ color: t.hex }}>
          {currentValue}
        </span>
      </div>
      <div className="h-16 flex items-end gap-1 pt-2 px-1 bg-[#111622] border border-white/10 px-dither-dots">
        {data.map((v, idx) => {
          const hPct = Math.max(12, Math.round(((v - min) / range) * 100));
          return (
            <div
              key={idx}
              className="flex-1 transition-all"
              style={{
                height: `${hPct}%`,
                backgroundColor:
                  idx === data.length - 1 ? "#FFD100" : t.hex,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   6. RPG TYPEWRITER DIALOG BOX WITH VOICE BLIPS
   ============================================================================ */

export interface PixelDialogBoxProps {
  speaker: string;
  role?: string;
  character?: PixelSpriteCharacter;
  messages: string[];
  tone?: PixelTone;
}

export function PixelDialogBox({
  speaker,
  role,
  character = "mixiuh",
  messages,
  tone = "yellow",
}: PixelDialogBoxProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const fullText = messages[msgIdx] || "";
  const t = TONE_STYLES[tone];

  useEffect(() => {
    setCharCount(0);
  }, [msgIdx, fullText]);

  useEffect(() => {
    if (charCount >= fullText.length) return;
    const timer = setTimeout(() => {
      setCharCount((c) => c + 1);
      if (charCount % 3 === 0) {
        pixelSound.play("dialogBlip", {
          pitchMultiplier: character === "opus" ? 0.85 : 1.05,
          volume: 0.35,
        });
      }
    }, 22);
    return () => clearTimeout(timer);
  }, [charCount, fullText, character]);

  const handleNext = () => {
    if (charCount < fullText.length) {
      setCharCount(fullText.length);
      pixelSound.play("click");
    } else {
      setMsgIdx((i) => (i + 1) % messages.length);
      pixelSound.play("coin");
    }
  };

  return (
    <div
      onClick={handleNext}
      className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[6px_6px_0_#040508] flex items-start gap-4 cursor-pointer select-none"
      style={{ borderColor: t.hex }}
    >
      <div className="p-2 bg-[#131824] border-2 border-white/15 shrink-0">
        <PixelSprite character={character} size={48} />
      </div>
      <div className="flex-1 min-w-0 font-mono-hud">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span
              className="font-pixel text-xs font-bold"
              style={{ color: t.hex }}
            >
              {speaker}
            </span>
            {role && (
              <span className="text-[10px] text-[#94A3B8]">// {role}</span>
            )}
          </div>
          <span className="text-[10px] text-[#94A3B8]">
            [{msgIdx + 1}/{messages.length}]
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#F5F2EB] leading-relaxed min-h-[42px]">
          {fullText.slice(0, charCount)}
          <span className="inline-block w-2 h-3.5 bg-[#FFD100] ml-1 animate-px-blink align-middle" />
        </p>
        <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-bold text-[#FFD100]">
          <span>CLICK NEXT</span>
          <span className="animate-px-blink">▼</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   7. TELEMETRY PILLS (AGENTS.MD STANDARD: [CLOCK + MIN] & [COIN + $ USD])
   ============================================================================ */

export function PixelTelemetryPill({
  kind,
  value,
  tone = "cyan",
}: {
  kind: "time" | "cost" | "score" | "model";
  value: string;
  tone?: PixelTone;
}) {
  const t = TONE_STYLES[tone];
  const iconMap: Record<typeof kind, PixelIconName> = {
    time: "clock",
    cost: "coin",
    score: "trophy",
    model: "cpu",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#090B10] border font-mono-hud text-[11px] font-bold text-[#F5F2EB]"
      style={{ borderColor: t.hex }}
    >
      <PixelIcon name={iconMap[kind]} size={12} color={t.hex} />
      <span>{value}</span>
    </span>
  );
}

/* ============================================================================
   8. OPEN-SOURCE ATTRIBUTION COMPONENT (<PixelCreditBadge />)
   Required for free worldwide personal & commercial use of @mixiuh/pixel-ui
   ============================================================================ */

export interface PixelCreditBadgeProps {
  variant?: "minimal" | "pill" | "hardware" | "banner";
  className?: string;
}

export function PixelCreditBadge({
  variant = "pill",
  className = "",
}: PixelCreditBadgeProps) {
  if (variant === "minimal") {
    return (
      <a
        href="https://labs.mixiuh.online#pixel-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 font-mono-hud text-[11px] text-[#94A3B8] hover:text-[#FFD100] transition ${className}`}
      >
        <PixelIcon name="gamepad" size={13} color="#FFD100" />
        <span>
          UI powered by <strong className="text-[#F5F2EB]">Mixiuh Pixel UI</strong>
        </span>
      </a>
    );
  }

  if (variant === "hardware") {
    return (
      <a
        href="https://labs.mixiuh.online#pixel-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#FFD100] text-[#090B10] border-2 border-[#090B10] shadow-[4px_4px_0_#040508] font-mono-hud text-xs font-bold hover:brightness-105 transition ${className}`}
      >
        <PixelSprite character="mixiuh" size={22} animate={false} />
        <div>
          <div className="font-pixel text-[10px] leading-none">
            MIXIUH PIXEL UI v1.0
          </div>
          <div className="text-[9px] font-bold opacity-80">
            OPEN SOURCE · LABS.MIXIUH.ONLINE
          </div>
        </div>
      </a>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`p-3 bg-[#111622] border-2 border-[#00E5FF] shadow-[4px_4px_0_#040508] flex flex-wrap items-center justify-between gap-3 font-mono-hud text-xs ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <PixelSprite character="mixiuh" size={28} />
          <div>
            <span className="font-pixel text-[#FFD100] font-bold">
              BUILT WITH MIXIUH PIXEL UI
            </span>
            <p className="text-[11px] text-[#94A3B8]">
              Free Open-Source Pixel-Art & Playdate 3D Component System by Mixiuh
              Labs.
            </p>
          </div>
        </div>
        <a
          href="https://labs.mixiuh.online#pixel-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-[#00E5FF] text-[#090B10] font-bold border border-[#090B10]"
        >
          labs.mixiuh.online →
        </a>
      </div>
    );
  }

  return (
    <a
      href="https://labs.mixiuh.online#pixel-ui"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3 py-1 bg-[#090B10] border-2 border-[#FFD100] shadow-[3px_3px_0_#040508] font-mono-hud text-[11px] font-bold text-[#F5F2EB] hover:bg-[#131824] transition ${className}`}
    >
      <PixelIcon name="console" size={13} color="#FFD100" />
      <span>
        PIXEL UI BY <span className="text-[#FFD100]">MIXIUH LABS</span>
      </span>
    </a>
  );
}
