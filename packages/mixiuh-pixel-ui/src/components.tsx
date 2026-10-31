"use client";

import React, {
  useState,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { pixelSound, type PixelSoundName } from "./sound";
import { PIXEL_UI_VERSION } from "./version";
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

export type PixelColorTone = PixelTone;

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
    text: "text-[#090B10]",
    border: "border-[#FF3355]",
    hex: "#FF3355",
    cardClass: "px-card-coral",
  },
  violet: {
    bg: "bg-[#A855F7]",
    text: "text-[#090B10]",
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

/** Tone -> Tailwind classes + hex lookup shared by every Pixel UI component. */
export const PIXEL_TONE_STYLES = TONE_STYLES;

/* ----------------------------------------------------------------------------
   Shared accessibility helpers
   ---------------------------------------------------------------------------- */

/*
 * Accent frames are outline utilities fed by the --px-frame custom property
 * (pair FRAME_* with frameStyle(hex)). An inline `outline` style beats every
 * stylesheet rule, so it used to hide the keyboard focus ring.
 */
const FRAME_1 = "outline-1 outline-[color:var(--px-frame)]";
const FRAME_2 = "outline-2 outline-[color:var(--px-frame)]";
/** Keyboard focus swaps the resting frame for the yellow pixel ring. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-[#FFD100] focus-visible:outline-offset-2";
/** The same ring on a field wrapper while its input (or a field button) has focus. */
const FOCUS_WITHIN_RING =
  "focus-within:outline-2 focus-within:outline-[#FFD100] focus-within:outline-offset-2";
/** Ring drawn inside the element, for rows of scrolling lists and buttons inside fields. */
const FOCUS_RING_INSET =
  "focus-visible:outline-2 focus-visible:outline-[#FFD100] focus-visible:-outline-offset-2";
/** The inset ring on the option picked with the arrow keys while focus stays in a combobox input. */
const ACTIVE_RING_INSET = "outline-2 outline-[#FFD100] -outline-offset-2";

const frameStyle = (hex: string) =>
  ({ "--px-frame": hex }) as React.CSSProperties;

/**
 * Props that make a clickable non-button element (a card that holds block
 * content) work as a button: focusable, Enter / Space to activate.
 */
function pressableProps(
  onPress?: () => void
): Pick<React.HTMLAttributes<HTMLElement>, "role" | "tabIndex" | "onKeyDown"> {
  if (!onPress) return {};
  return {
    role: "button",
    tabIndex: 0,
    onKeyDown: (e) => {
      // Ignore keys typed into controls nested inside the card
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPress();
      }
    },
  };
}

/** True when a key event comes from a place where the user is typing. */
function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

/** Swallow a key so dialogs listening on document (Escape) do not see it. */
function consumeKey(e: React.KeyboardEvent) {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

/**
 * Closes a dropdown when the user presses or moves focus outside `rootRef`.
 * Touch closes on the tap's pointerup, so scrolling the page does not.
 */
function useDismissOutside(
  open: boolean,
  rootRef: React.RefObject<HTMLElement | null>,
  setOpen: (open: boolean) => void
) {
  useEffect(() => {
    if (!open) return;
    const outside = (target: EventTarget | null) =>
      target instanceof Node && !rootRef.current?.contains(target);
    let tapOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") tapOutside = outside(e.target);
      else if (outside(e.target)) setOpen(false);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch" && tapOutside) setOpen(false);
      tapOutside = false;
    };
    const onPointerCancel = () => {
      tapOutside = false;
    };
    const onFocusIn = (e: FocusEvent) => {
      if (outside(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerCancel);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerCancel);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open, rootRef, setOpen]);
}

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
  /**
   * Also trigger when the matching key is pressed anywhere on the page
   * (default true). Typing in a field, Ctrl/Cmd/Alt shortcuts, IME
   * composition and key auto-repeat never trigger it.
   */
  hotkey?: boolean;
}

export function PixelKeycap({
  keyLabel,
  caption,
  tone = "chalk",
  onTrigger,
  hotkey = true,
}: PixelKeycapProps) {
  const [pressed, setPressed] = useState(false);
  const t = TONE_STYLES[tone];

  useEffect(() => {
    if (!hotkey) return;
    // Autofill can dispatch key events without a `key`
    const matches = (e: KeyboardEvent) =>
      typeof e.key === "string" &&
      e.key.toUpperCase() === keyLabel.toUpperCase();
    const down = (e: KeyboardEvent) => {
      if (
        e.repeat ||
        e.isComposing ||
        e.defaultPrevented ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        isTypingTarget(e.target) ||
        !matches(e)
      ) {
        return;
      }
      setPressed(true);
      pixelSound.play("click", { pitchMultiplier: 1.1 });
      onTrigger?.();
    };
    // Releasing the key always lifts the cap, wherever focus went meanwhile
    const up = (e: KeyboardEvent) => {
      if (matches(e)) setPressed(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [hotkey, keyLabel, onTrigger]);

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
        <span className="font-mono-hud text-[10px] opacity-75 mt-1 uppercase">
          {caption}
        </span>
      )}
    </button>
  );
}

/* ============================================================================
   2. RETRO VHF ROTARY CHANNEL DIAL & HARDWARE DIP-SWITCH TOGGLE
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
      role="switch"
      aria-checked={checked}
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

  const chNumber = Math.floor((angle / 360) * 12) + 1;

  return (
    <div className="inline-flex items-center gap-3 p-3 bg-[#111622] border-2 border-[#00E5FF] shadow-[4px_4px_0_#040508]">
      <div
        onClick={() => stepRotate(30)}
        title="Click to turn VHF/UHF Rotary Tuner (+30 deg)"
        className="relative w-14 h-14 rounded-full bg-[#1E2638] border-3 border-[#090B10] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_3px_0_#040508] flex items-center justify-center cursor-pointer select-none"
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-150"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="w-2.5 h-11 bg-[#D8D1C2] border-2 border-[#090B10] flex flex-col items-center justify-start pt-0.5">
            <span className="w-1.5 h-2.5 bg-[#FF3355]" />
          </div>
        </div>
      </div>
      <div className="font-mono-hud text-xs">
        <div className="text-[10px] font-bold text-[#00E5FF] uppercase">
          {label || "VHF ROTARY TUNER"}
        </div>
        <div className="text-sm font-black text-white">
          CH {chNumber < 10 ? `0${chNumber}` : chNumber} · {angle}°
        </div>
        <div className="flex items-center gap-1 mt-1">
          <button
            type="button"
            onClick={() => stepRotate(-30)}
            className="px-2.5 py-1 bg-[#1A2132] hover:bg-[#00E5FF] hover:text-[#090B10] text-[11px] font-bold border border-[#3A4560] cursor-pointer"
          >
            CH -
          </button>
          <button
            type="button"
            onClick={() => stepRotate(30)}
            className="px-2.5 py-1 bg-[#FFD100] text-[#090B10] text-[11px] font-bold border border-[#090B10] cursor-pointer"
          >
            CH +
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. SPEC CARDS, RETRO OS WINDOWS, 3.5" FLOPPY DISKS & ROM CARTRIDGES
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
  const press = onClick
    ? () => {
        pixelSound.play("click");
        onClick();
      }
    : undefined;

  return (
    <div
      onClick={press}
      {...pressableProps(press)}
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
            className="uppercase tracking-wider truncate"
            style={{ color: tone === "chalk" ? "#090B10" : t.hex }}
          >
            {kicker}
          </span>
          {badge && (
            <span
              className="px-2 py-0.5 text-[10px] font-bold text-[#090B10] shrink-0"
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
          <span className="font-pixel text-xs font-bold min-w-0 break-words sm:truncate">
            {title}
          </span>
          {subtitle && (
            <span className="hidden sm:inline-block font-mono-hud text-[10px] opacity-80 truncate">
              {"// "}
              {subtitle}
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
            className="w-6 h-6 bg-[#090B10] text-[#F5F2EB] font-mono-hud text-[11px] font-bold flex items-center justify-center hover:bg-[#FF3355] cursor-pointer"
            title={minimized ? "Expand window" : "Minimize window"}
          >
            {minimized ? "+" : "-"}
          </button>
          <span aria-hidden="true" className="w-6 h-6 bg-[#090B10] text-[#F5F2EB] font-mono-hud text-[11px] font-bold flex items-center justify-center">
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

export interface PixelFloppyCardProps {
  diskCode: string;
  title: string;
  capacity?: string;
  description: string;
  tone?: PixelTone;
  onInsert?: () => void;
  /** Left text of the label footer (default "SECTOR 00 // ZERO-SHOT"). */
  sectorLabel?: string;
  /** Text of the label footer chip, shown before "▶" (default "LOAD DISK"). */
  loadLabel?: string;
}

export function PixelFloppyCard({
  diskCode,
  title,
  capacity = "1.44 MB HD",
  description,
  tone = "cyan",
  onInsert,
  sectorLabel = "SECTOR 00 // ZERO-SHOT",
  loadLabel = "LOAD DISK",
}: PixelFloppyCardProps) {
  const t = TONE_STYLES[tone];
  const insert = () => {
    pixelSound.play("cartridgeInsert");
    onInsert?.();
  };
  return (
    <div
      onClick={insert}
      {...pressableProps(onInsert ? insert : undefined)}
      className={`group relative bg-[#182032] border-3 border-[#090B10] shadow-[6px_6px_0_#040508] p-4 pt-12 cursor-pointer select-none transition hover:-translate-y-1 focus-visible:-translate-y-1 ${FRAME_2} ${FOCUS_RING}`}
      style={frameStyle(t.hex)}
    >
      {/* Top 3.5" Metal Sliding Shutter */}
      <div className="absolute top-0 left-6 right-10 h-9 bg-[#CBD5E1] border-x-2 border-b-2 border-[#090B10] flex items-center justify-between px-3 transition-transform duration-200 group-hover:translate-x-2 group-focus-visible:translate-x-2">
        <div className="w-4 h-6 bg-[#090B10]" />
        <span className="font-pixel text-[10px] text-[#090B10] font-bold">
          {diskCode} {"//"} {capacity}
        </span>
      </div>

      {/* Floppy Label Sticker */}
      <div className="bg-[#F5F2EB] text-[#090B10] border-2 border-[#090B10] p-3.5 space-y-2">
        <div
          className="h-2 w-full"
          style={{ backgroundColor: t.hex }}
        />
        <div className="font-display text-sm sm:text-base font-black leading-snug">
          {title}
        </div>
        <p className="font-mono-hud text-[11px] text-[#090B10]/80 leading-relaxed">
          {description}
        </p>
        {/* One row when both fit; otherwise the chip drops whole to its own row, right-aligned */}
        <div className="pt-1 border-t border-[#090B10]/20 flex flex-wrap items-center justify-between gap-x-1 gap-y-1 font-pixel text-[10px]">
          <span>{sectorLabel}</span>
          <span className="ml-auto px-1.5 py-0.5 bg-[#090B10] text-[#FFD100] whitespace-nowrap">
            {loadLabel} <span aria-hidden="true">▶</span>
          </span>
        </div>
      </div>
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
  const select = () => {
    pixelSound.play("cartridgeInsert");
    onSelect?.();
  };

  return (
    <div
      onClick={select}
      {...pressableProps(onSelect ? select : undefined)}
      aria-pressed={onSelect ? active : undefined}
      className={`px-3d-cartridge bg-[#151B29] p-3.5 cursor-pointer select-none flex flex-col justify-between ${
        active ? "ring-2 ring-[#FFD100]" : ""
      }`}
      style={{ borderColor: t.hex }}
    >
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

      <div className="bg-[#090B10] border-2 border-[#040508] p-2.5 space-y-2">
        {thumb && (
          <div className="relative aspect-video overflow-hidden border border-white/15">
            <img
              src={thumb}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#090B10]/90 border border-white/20 font-mono-hud text-[10px] font-bold text-[#FFD100]">
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

      <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-2.5 bg-[#FFD100] border border-[#090B10]"
            />
          ))}
        </div>
        <span className="font-mono-hud text-[10px] font-bold text-[#94A3B8] uppercase">
          INSERT ROM →
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
   4. 3D RETRO CRT COMPUTER & TELE-MONITOR WORKSTATION ("MIXIUH CRT-9000")
   100% Original Retro TV / Lab Computer with Working Channels, Degauss,
   Phosphor Modes, Power Switch & Zero Text Overflow!
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
  /**
   * Model plate printed on the monitor chassis (default
   * "MIXIUH LABS // MONITOR DE PRUEBAS", or "... // BENCHMARK MONITOR" in English).
   */
  headerLabel?: string;
}

export function Pixel3DCRTWorkstation({
  items,
  lang = "es",
  headerLabel,
}: Pixel3DPocketConsoleProps) {
  const [idx, setIdx] = useState(0);
  const [poweredOn, setPoweredOn] = useState(true);
  const [staticFlash, setStaticFlash] = useState(false);
  const [degaussing, setDegaussing] = useState(false);
  const [crtMode, setCrtMode] = useState<"rgb" | "amber" | "green" | "mono">(
    "rgb"
  );

  const current = items[idx] || items[0];
  if (!current) return null;

  const switchChannel = (nextIdx: number) => {
    const safeIdx = (nextIdx + items.length) % items.length;
    setIdx(safeIdx);
    setStaticFlash(true);
    pixelSound.play("cartridgeInsert");
    setTimeout(() => setStaticFlash(false), 140);
  };

  const triggerDegauss = () => {
    setDegaussing(true);
    pixelSound.play("laser", { pitchMultiplier: 0.55 });
    setTimeout(() => setDegaussing(false), 450);
  };

  const cyclePhosphorMode = () => {
    const order: ("rgb" | "amber" | "green" | "mono")[] = [
      "rgb",
      "amber",
      "green",
      "mono",
    ];
    const next = order[(order.indexOf(crtMode) + 1) % order.length];
    setCrtMode(next);
    pixelSound.play("click", { pitchMultiplier: 1.25 });
  };

  const togglePower = () => {
    const next = !poweredOn;
    setPoweredOn(next);
    pixelSound.play(next ? "powerup" : "hit");
  };

  const filterClass =
    crtMode === "amber"
      ? "px-crt-filter-amber"
      : crtMode === "green"
      ? "px-crt-filter-green"
      : crtMode === "mono"
      ? "px-crt-filter-mono"
      : "";

  return (
    <div className="px-3d-stage w-full">
      {/* UPPER 3D CRT MONITOR CHASSIS */}
      <div
        className={`px-3d-crt-shell p-3.5 sm:p-4 text-[#090B10] ${
          degaussing ? "px-degauss-active" : ""
        }`}
      >
        {/* Monitor Top Ventilation Slots & Model Plate */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full border border-[#090B10] shrink-0 ${
                poweredOn ? "bg-[#10B981]" : "bg-[#FF3355]"
              }`}
            />
            <span className="font-pixel text-[10px] font-bold tracking-wider truncate">
              {headerLabel ??
                (lang === "es"
                  ? "MIXIUH LABS // MONITOR DE PRUEBAS"
                  : "MIXIUH LABS // BENCHMARK MONITOR")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 bg-[#090B10] text-[#FFD100] font-pixel text-[10px]">
              CH 0{idx + 1}/0{items.length}
            </span>
            <span className="px-2 py-0.5 bg-[#090B10] text-[#00E5FF] font-pixel text-[10px] uppercase">
              {crtMode}
            </span>
          </div>
        </div>

        {/* CRT Recessed Dark Glass Tube — Constant Height Whether Powered ON or OFF */}
        <div className="px-3d-screen-bezel p-2.5 sm:p-3 text-[#F5F2EB] space-y-2.5 overflow-hidden">
          {/* Top OSD Telemetry Bar inside CRT (Constant Height) */}
          <div className="flex items-center justify-between gap-2 font-mono-hud text-[10px] min-w-0 h-5">
            <span
              className="px-2 py-0.5 font-bold text-[#090B10] truncate"
              style={{
                backgroundColor: poweredOn ? current.accentHex : "#475569",
              }}
            >
              {poweredOn ? current.kicker : "STANDBY // CRT POWER OFF"}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-[#00E5FF] font-bold">
                <PixelIcon name="clock" size={11} color="#00E5FF" />
                <span>{current.timeMetric}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[#FFD100] font-bold">
                <PixelIcon name="coin" size={11} color="#FFD100" />
                <span>{current.costMetric}</span>
              </span>
            </div>
          </div>

          {/* 16:9 CRT Phosphor Screen with Scanlines (Identical aspect-video dimensions ON or OFF) */}
          {poweredOn ? (
            <div
              onClick={() => {
                pixelSound.play("powerup");
                current.onLaunchPrimary();
              }}
              className={`relative aspect-video overflow-hidden border-2 border-[#2A344B] bg-[#05070B] group cursor-pointer ${filterClass}`}
            >
              {staticFlash ? (
                <div className="w-full h-full px-dither-checker bg-[#1E293B] flex items-center justify-center">
                  <span className="font-pixel text-sm text-[#FFD100]">
                    TUNING CH 0{idx + 1} {"//"} {current.code}...
                  </span>
                </div>
              ) : (
                <>
                  <img
                    src={current.thumb}
                    alt={current.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />
                  {/* Subtle CRT Scanline Overlay */}
                  <div className="absolute inset-0 px-crt-scanlines pointer-events-none" />
                  {/* Top-Left Green OSD Channel Indicator */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#090B10] border border-[#10B981] font-pixel text-[10px] text-[#10B981]">
                    CH 0{idx + 1} · {current.code}
                  </div>
                  {/* Floating Character Sprite in Corner */}
                  <div className="absolute bottom-2 right-2 p-1 bg-[#090B10] border border-white/25">
                    <PixelSprite character={current.character} size={28} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              onClick={togglePower}
              className="relative aspect-video overflow-hidden bg-[#040508] border-2 border-[#1E2638] flex flex-col items-center justify-center gap-3 cursor-pointer"
            >
              <div className="w-2/3 h-0.5 bg-[#F5F2EB] shadow-[0_0_12px_#00E5FF]" />
              <span className="font-pixel text-[10px] text-[#94A3B8]">
                CRT STANDBY // CLICK PWR TO BOOT
              </span>
            </div>
          )}

          {/* Dedicated Non-Overflowing OSD Episode Title & Verdict Box (Constant Height) */}
          <div className="p-2.5 bg-[#111622] border border-[#2A344B] min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className="font-pixel text-[10px] font-bold truncate"
                style={{
                  color: poweredOn ? current.accentHex : "#94A3B8",
                }}
              >
                {poweredOn
                  ? current.verdict
                  : lang === "es"
                  ? "TUBO CATODICO EN REPOSO · PRESIONA PWR PARA ENCENDER"
                  : "CRT TUBE IN STANDBY · PRESS PWR TO RESUME"}
              </span>
              <span className="font-mono-hud text-[10px] text-[#94A3B8] shrink-0">
                {poweredOn ? "60Hz LOCK" : "0Hz OFF"}
              </span>
            </div>
            <div className="font-display text-xs sm:text-sm font-black text-white leading-snug line-clamp-2 min-h-[2.75em]">
              {current.title}
            </div>
          </div>

          {/* Physical VHF Channel Push-Buttons inside Monitor Bezel */}
          <div className="grid grid-cols-3 min-[420px]:grid-cols-5 gap-1 pt-0.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={i === idx}
                onClick={() => switchChannel(i)}
                className={`py-1.5 px-1 font-pixel text-[10px] border-2 transition cursor-pointer truncate ${
                  i === idx
                    ? "bg-[#FFD100] text-[#090B10] border-[#090B10] font-bold shadow-[2px_2px_0_#00E5FF]"
                    : "bg-[#131824] text-[#94A3B8] border-[#2A344B] hover:text-white"
                }`}
              >
                {item.code}
              </button>
            ))}
          </div>
        </div>

        {/* Monitor Front Panel Hardware Controls: CH -, CH +, DEGAUSS, CRT MODE, POWER */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => switchChannel(idx - 1)}
              className="px-2.5 py-1.5 bg-[#131824] hover:bg-[#090B10] text-[#F5F2EB] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] active:translate-y-0.5 font-pixel text-[10px] font-bold cursor-pointer"
              title={lang === "es" ? "Canal Anterior" : "Previous Channel"}
            >
              ◀ CH
            </button>
            <button
              type="button"
              onClick={() => switchChannel(idx + 1)}
              className="px-2.5 py-1.5 bg-[#131824] hover:bg-[#090B10] text-[#F5F2EB] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] active:translate-y-0.5 font-pixel text-[10px] font-bold cursor-pointer"
              title={lang === "es" ? "Siguiente Canal" : "Next Channel"}
            >
              CH ▶
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={triggerDegauss}
              className="px-2.5 py-1.5 bg-[#00E5FF] text-[#090B10] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] active:translate-y-0.5 font-pixel text-[10px] font-bold cursor-pointer"
              title="Magnetic CRT Degauss Coil"
            >
              DEGAUSS
            </button>
            <button
              type="button"
              onClick={cyclePhosphorMode}
              className="px-2.5 py-1.5 bg-[#FFD100] text-[#090B10] border-2 border-[#090B10] shadow-[2px_2px_0_#040508] active:translate-y-0.5 font-pixel text-[10px] font-bold cursor-pointer"
              title="Cycle CRT Phosphor Filter (RGB / Amber / Green / Mono)"
            >
              CRT: {crtMode.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={togglePower}
              className={`px-2.5 py-1.5 border-2 border-[#090B10] shadow-[2px_2px_0_#040508] active:translate-y-0.5 font-pixel text-[10px] font-bold cursor-pointer ${
                poweredOn
                  ? "bg-[#10B981] text-[#090B10]"
                  : "bg-[#FF3355] text-[#090B10]"
              }`}
              title="Toggle CRT Power"
            >
              PWR
            </button>
          </div>
        </div>
      </div>

      {/* LOWER 3D RETRO COMPUTER FLOPPY DRIVE & FUNCTIONAL KEYBOARD ACTION DECK */}
      <div className="px-3d-crt-deck mx-2 p-3 text-[#090B10] space-y-2.5">
        {/* 3.5" Floppy Drive Slot & Activity LED */}
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 bg-[#090B10] text-[#F5F2EB] border-2 border-[#040508]">
          <div className="flex items-center gap-2 min-w-0">
            <PixelIcon name="floppy" size={13} color="#FFD100" />
            <span className="font-mono-hud text-[10px] font-bold text-[#94A3B8] truncate">
              DRIVE A: // {current.code}_MASTER.ROM
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-[#10B981] animate-px-blink" />
            <span className="font-pixel text-[10px] text-[#FFD100]">READY</span>
          </div>
        </div>

        {/* 100% Visible, Non-Clipping Mechanical Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <button
            type="button"
            onClick={() => {
              pixelSound.play("powerup");
              current.onLaunchPrimary();
            }}
            className={`${
              current.onLaunchSecondary ? "sm:col-span-8" : "sm:col-span-12"
            } py-2.5 px-3 bg-[#090B10] hover:bg-[#131824] text-[#FFD100] border-2 border-[#090B10] shadow-[3px_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 font-pixel text-[10px] font-bold flex items-center justify-center gap-2 cursor-pointer`}
          >
            <PixelIcon name="play" size={13} color="#FFD100" />
            <span className="text-left leading-snug">{current.primaryLabel}</span>
          </button>

          {current.onLaunchSecondary && (
            <button
              type="button"
              onClick={() => {
                pixelSound.play("coin");
                current.onLaunchSecondary?.();
              }}
              className="sm:col-span-4 py-2.5 px-3 bg-[#00E5FF] hover:brightness-105 text-[#090B10] border-2 border-[#090B10] shadow-[3px_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 font-pixel text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PixelIcon name="gamepad" size={13} color="#090B10" />
              <span className="truncate">
                {current.secondaryLabel ||
                  (lang === "es" ? "SIMULADOR" : "SIMULATOR")}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Keep alias so imports of Pixel3DPocketConsole automatically use the new CRT Workstation
export const Pixel3DPocketConsole = Pixel3DCRTWorkstation;

/* ============================================================================
   5. PIXEL-ART CHARTS, GAUGES & TELEMETRY VISUALIZATIONS
   ============================================================================ */

export interface PixelBarChartItem {
  label: string;
  value: number;
  /**
   * Full-scale value of this bar (e.g. 10 for a score out of 10). Bars
   * without one share the chart scale: the largest `value` or `maxValue`.
   */
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
  const cells = Math.max(1, Math.floor(segments));
  const sharedMax = Math.max(...items.map((i) => i.maxValue || i.value), 1);

  return (
    <div className="space-y-3 font-mono-hud">
      {items.map((item) => {
        const t = TONE_STYLES[item.tone || "yellow"];
        const scale =
          item.maxValue && item.maxValue > 0 ? item.maxValue : sharedMax;
        const ratio = Math.min(1, Math.max(0, item.value / scale));
        // Zero lights nothing; any other value lights at least one segment
        const activeCount =
          ratio > 0 ? Math.max(1, Math.round(ratio * cells)) : 0;

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
            <div
              className="grid gap-1 p-1 bg-[#090B10] border-2 border-[#2A344B]"
              style={{
                gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: cells }).map((_, idx) => (
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
   6. INTERACTIVE 8-BIT CHIPTUNE STEP SEQUENCER (<PixelAudioSequencer />)
   ============================================================================ */

const SEQ_TRACKS = [
  { name: "LEAD (C6)", sound: "coin" as PixelSoundName, pitch: 1.2, color: "#00E5FF" },
  { name: "SYNTH (G5)", sound: "toggleOn" as PixelSoundName, pitch: 1.0, color: "#FFD100" },
  { name: "BASS (C4)", sound: "crank" as PixelSoundName, pitch: 0.75, color: "#10B981" },
  { name: "PERC (HIT)", sound: "click" as PixelSoundName, pitch: 0.9, color: "#FF3355" },
];

export interface PixelAudioSequencerProps {
  /** Accessible name of each cell, e.g. (track, step) => `${track} step ${step}` */
  cellLabel?: (track: string, step: number) => string;
}

export function PixelAudioSequencer({
  cellLabel = (track, step) => `${track} paso ${step}`,
}: PixelAudioSequencerProps = {}) {
  const [grid, setGrid] = useState<boolean[][]>([
    [true, false, false, true, false, true, false, false],
    [false, false, true, false, true, false, false, true],
    [true, false, true, false, true, false, true, false],
    [true, false, false, false, true, false, false, true],
  ]);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % 8;
        grid.forEach((row, rIdx) => {
          if (row[next]) {
            const tr = SEQ_TRACKS[rIdx];
            pixelSound.play(tr.sound, {
              pitchMultiplier: tr.pitch + (next % 3) * 0.08,
              volume: 0.65,
            });
          }
        });
        return next;
      });
    }, 185);
    return () => clearInterval(timer);
  }, [playing, grid]);

  const toggleCell = (r: number, c: number) => {
    const next = grid.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? !val : val))
    );
    setGrid(next);
    if (!grid[r][c]) {
      pixelSound.play(SEQ_TRACKS[r].sound, {
        pitchMultiplier: SEQ_TRACKS[r].pitch,
      });
    }
  };

  return (
    <div className="p-4 bg-[#090B10] border-2 border-[#2A344B] space-y-3 font-mono-hud">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PixelIcon name="music" size={15} color="#FFD100" />
          <span className="font-pixel text-xs text-[#FFD100] font-bold">
            8-BIT CHIPTUNE STEP SEQUENCER (4x8)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className={`px-3 py-1 font-pixel text-[10px] font-bold border-2 border-[#090B10] cursor-pointer ${
              playing
                ? "bg-[#FF3355] text-[#090B10]"
                : "bg-[#10B981] text-[#090B10]"
            }`}
          >
            {playing ? "■ STOP LOOP" : "▶ PLAY 8-BIT LOOP"}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {SEQ_TRACKS.map((tr, rIdx) => (
          <div key={tr.name} className="grid grid-cols-12 gap-1.5 items-center">
            <span
              className="col-span-4 sm:col-span-3 font-pixel text-[10px] truncate"
              style={{ color: tr.color }}
            >
              {tr.name}
            </span>
            <div className="col-span-8 sm:col-span-9 grid grid-cols-8 gap-1">
              {grid[rIdx].map((active, cIdx) => {
                const isCur = playing && step === cIdx;
                return (
                  <button
                    key={cIdx}
                    type="button"
                    aria-label={cellLabel(tr.name, cIdx + 1)}
                    aria-pressed={active}
                    onClick={() => toggleCell(rIdx, cIdx)}
                    className={`h-6 border transition cursor-pointer ${
                      isCur ? "ring-2 ring-white" : "border-[#2A344B]"
                    }`}
                    style={{
                      backgroundColor: active ? tr.color : "#131824",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   7. RPG TYPEWRITER DIALOG BOX WITH VOICE BLIPS
   ============================================================================ */

export interface PixelDialogBoxProps {
  speaker: string;
  role?: string;
  character?: PixelSpriteCharacter;
  messages: string[];
  tone?: PixelTone;
  /** Prompt next to the blinking arrow (default "CLICK NEXT"). */
  nextLabel?: string;
}

export function PixelDialogBox({
  speaker,
  role,
  character = "mixiuh",
  messages,
  tone = "yellow",
  nextLabel = "CLICK NEXT",
}: PixelDialogBoxProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const fullText = messages[msgIdx] || "";
  const t = TONE_STYLES[tone];

  // Restart the typewriter whenever the visible message changes (adjusting
  // state during render avoids an extra effect pass with stale text)
  const [typedText, setTypedText] = useState(fullText);
  if (typedText !== fullText) {
    setTypedText(fullText);
    setCharCount(0);
  }

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
      role="button"
      tabIndex={0}
      aria-label={`${speaker}: ${fullText}`}
      onClick={handleNext}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNext();
        }
      }}
      className="p-4 bg-[#090B10] border-2 border-[#FFD100] shadow-[6px_6px_0_#040508] flex items-start gap-4 cursor-pointer select-none"
      style={{ borderColor: t.hex }}
    >
      <div className="p-2 bg-[#131824] border-2 border-[#2A344B] shrink-0">
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
              <span className="text-[10px] text-[#94A3B8]">{`// ${role}`}</span>
            )}
          </div>
          <span className="text-[10px] text-[#94A3B8]">
            [{msgIdx + 1}/{messages.length}]
          </span>
        </div>
        <p
          aria-hidden="true"
          className="text-xs sm:text-sm text-[#F5F2EB] leading-relaxed min-h-[42px]"
        >
          {fullText.slice(0, charCount)}
          <span className="inline-block w-2 h-3.5 bg-[#FFD100] ml-1 animate-px-blink align-middle" />
        </p>
        <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-bold text-[#FFD100]">
          <span>{nextLabel}</span>
          <span aria-hidden="true" className="animate-px-blink">▼</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   8. TELEMETRY PILLS (AGENTS.MD STANDARD: [CLOCK + MIN] & [COIN + $ USD])
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
   9. OPEN-SOURCE ATTRIBUTION COMPONENT (<PixelCreditBadge />)
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
        <PixelIcon name="crt-tv" size={13} color="#FFD100" />
        <span>
          UI powered by{" "}
          <strong className="text-[#F5F2EB]">Mixiuh Pixel UI</strong>
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
        <span className="p-0.5 bg-[#090B10] border border-[#090B10] inline-flex">
          <PixelSprite character="mixiuh" size={20} animate={false} />
        </span>
        <div>
          <div className="font-pixel text-[10px] leading-none">
            {`MIXIUH PIXEL UI v${PIXEL_UI_VERSION}`}
          </div>
          <div className="text-[10px] font-bold opacity-80">
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
              {`BUILT WITH MIXIUH PIXEL UI v${PIXEL_UI_VERSION}`}
            </span>
            <p className="text-[11px] text-[#94A3B8]">
              Free Open-Source Pixel-Art & Retro 3D CRT Component System by
              Mixiuh Labs.
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
      <PixelIcon name="crt-tv" size={13} color="#FFD100" />
      <span>
        PIXEL UI BY <span className="text-[#FFD100]">MIXIUH LABS</span>
      </span>
    </a>
  );
}

/* ============================================================================
   10. PIXEL-ART SOCIAL MEDIA & COMMUNITY REDIRECT BAR (<PixelSocialBar />)
   ============================================================================ */

export interface PixelSocialLinkItem {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  icon: PixelIconName;
  accentHex: string;
}

export interface PixelSocialBarProps {
  links?: PixelSocialLinkItem[];
  compact?: boolean;
  className?: string;
}

export const DEFAULT_MIXIUH_SOCIAL_LINKS: PixelSocialLinkItem[] = [
  {
    id: "youtube-es",
    label: "YouTube ES",
    sublabel: "@MixiuhLabsES",
    href: "https://www.youtube.com/@MixiuhLabsES",
    icon: "youtube",
    accentHex: "#FF3355",
  },
  {
    id: "youtube-en",
    label: "YouTube EN",
    sublabel: "@MixiuhLabsEN",
    href: "https://www.youtube.com/@MixiuhLabsEN",
    icon: "youtube",
    accentHex: "#FFD100",
  },
  {
    id: "instagram",
    label: "Instagram",
    sublabel: "@labs.mixiuh",
    href: "https://www.instagram.com/labs.mixiuh",
    icon: "instagram",
    accentHex: "#F472B6",
  },
  {
    id: "tiktok",
    label: "TikTok",
    sublabel: "@mixiuhlabs",
    href: "https://www.tiktok.com/@mixiuhlabs",
    icon: "tiktok",
    accentHex: "#00E5FF",
  },
  {
    id: "x",
    label: "X",
    sublabel: "@MixiuhLabs",
    href: "https://x.com/MixiuhLabs",
    icon: "x",
    accentHex: "#F5F2EB",
  },
  {
    id: "github",
    label: "GitHub",
    sublabel: "Open Source",
    // Public repository; keep in sync with `repository.url` in package.json
    href: "https://github.com/danpez/mixiuh-labs-site",
    icon: "github",
    accentHex: "#10B981",
  },
  {
    id: "web",
    label: "Mixiuh Web",
    sublabel: "mixiuh.online",
    href: "https://mixiuh.online",
    icon: "globe",
    accentHex: "#A855F7",
  },
];

export function PixelSocialBar({
  links = DEFAULT_MIXIUH_SOCIAL_LINKS,
  compact = false,
  className = "",
}: PixelSocialBarProps) {
  if (compact) {
    return (
      <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
        {links.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => pixelSound.play("coin")}
            title={`${item.label} (${item.sublabel || item.href})`}
            className={`px-2.5 py-1.5 bg-[#111622] hover:bg-[#090B10] border-2 border-[#090B10] shadow-[3px_3px_0_#040508] inline-flex items-center gap-1.5 font-pixel text-[10px] font-bold text-[#F5F2EB] transition hover:-translate-y-0.5 ${FRAME_1} ${FOCUS_RING}`}
            style={frameStyle(item.accentHex)}
          >
            <PixelIcon name={item.icon} size={13} color={item.accentHex} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 ${className}`}
    >
      {links.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => pixelSound.play("coin")}
          className={`p-3 bg-[#111622] hover:bg-[#171E2E] border-2 border-[#090B10] shadow-[4px_4px_0_#040508] flex items-center gap-2.5 transition hover:-translate-y-0.5 ${FRAME_2} ${FOCUS_RING}`}
          style={frameStyle(item.accentHex)}
        >
          <div
            className="w-8 h-8 border-2 border-[#090B10] flex items-center justify-center shrink-0"
            style={{ backgroundColor: item.accentHex }}
          >
            <PixelIcon name={item.icon} size={16} color="#090B10" />
          </div>
          <div className="min-w-0">
            <div className="font-pixel text-[10px] font-bold text-white break-words">
              {item.label}
            </div>
            {item.sublabel && (
              <div
                className="font-mono-hud text-[10px] font-bold break-words"
                style={{ color: item.accentHex }}
              >
                {item.sublabel}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

/* ============================================================================
   11. PRO FORM, NAVIGATION, COLLAPSE, CALENDAR & DATA-VIZ SUITE (v2.2)
   ============================================================================ */

export interface PixelInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  tone?: PixelColorTone;
  size?: "sm" | "md" | "lg";
  iconLeft?: PixelIconName;
  iconRight?: PixelIconName;
  clearable?: boolean;
  onClear?: () => void;
  /** Accessible name and tooltip of the clear button (default "Limpiar"). */
  clearLabel?: string;
}

export function PixelInput({
  label,
  helperText,
  errorText,
  tone = "cyan",
  size = "md",
  iconLeft,
  iconRight,
  clearable = false,
  onClear,
  clearLabel = "Limpiar",
  className = "",
  value,
  onChange,
  ...rest
}: PixelInputProps) {
  const autoId = useId();
  const inputId = rest.id || autoId;
  const hintId = `${inputId}-hint`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const accent = TONE_STYLES[tone].hex;
  const borderHex = errorText ? "#FF3355" : accent;
  const describedBy =
    [rest["aria-describedby"], errorText || helperText ? hintId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const sizePad =
    size === "sm"
      ? "px-2.5 py-1.5 text-xs"
      : size === "lg"
      ? "px-4 py-3 text-sm"
      : "px-3 py-2 text-xs sm:text-sm";

  return (
    <div className={`space-y-1.5 font-mono-hud ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block font-pixel text-[10px] font-bold text-[#F5F2EB] tracking-wider uppercase"
        >
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center bg-[#090B10] border-2 border-[#090B10] shadow-[4px_4px_0_#040508] ${FRAME_2} ${FOCUS_WITHIN_RING}`}
        style={frameStyle(borderHex)}
      >
        {iconLeft && (
          <span className="pl-3 pr-1 flex items-center shrink-0">
            <PixelIcon name={iconLeft} size={14} color={borderHex} />
          </span>
        )}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            pixelSound.play("dialogBlip");
            onChange?.(e);
          }}
          className={`w-full bg-transparent text-[#F5F2EB] placeholder:text-[#94A3B8] focus:outline-none font-mono-hud ${sizePad}`}
          {...rest}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={errorText ? true : rest["aria-invalid"]}
        />
        {clearable && value && String(value).length > 0 && (
          <button
            type="button"
            onClick={() => {
              pixelSound.play("click");
              onClear?.();
              // The button unmounts once the value is empty: keep focus in the field
              inputRef.current?.focus();
            }}
            className={`pr-2.5 pl-1.5 py-2 text-[#94A3B8] hover:text-[#FF3355] cursor-pointer ${FOCUS_RING_INSET}`}
            aria-label={clearLabel}
            title={clearLabel}
          >
            <PixelIcon name="close" size={13} color="currentColor" />
          </button>
        )}
        {iconRight && (
          <span className="pr-3 pl-1 flex items-center shrink-0">
            <PixelIcon name={iconRight} size={14} color={borderHex} />
          </span>
        )}
      </div>
      {errorText ? (
        <p
          id={hintId}
          className="text-[11px] text-[#FF3355] font-bold flex items-center gap-1"
        >
          <PixelIcon name="bug" size={12} color="#FF3355" />
          <span>{errorText}</span>
        </p>
      ) : helperText ? (
        <p id={hintId} className="text-[11px] text-[#94A3B8]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export interface PixelSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: PixelIconName;
}

export interface PixelSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: PixelSelectOption[];
  placeholder?: string;
  tone?: PixelColorTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PixelSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccionar opcion...",
  tone = "yellow",
  size = "md",
  className = "",
}: PixelSelectProps) {
  const [open, setOpen] = useState(false);
  // Option holding the roving tab stop (and focus) while the listbox is open
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const triggerId = `${baseId}-trigger`;
  const listId = `${baseId}-list`;
  const accent = TONE_STYLES[tone].hex;
  const selectedIdx = options.findIndex((o) => o.value === value);
  const selected = selectedIdx >= 0 ? options[selectedIdx] : undefined;
  const lastIdx = options.length - 1;
  const sizePad =
    size === "sm"
      ? "px-2.5 py-1.5 text-xs"
      : size === "lg"
      ? "px-4 py-3 text-sm"
      : "px-3 py-2 text-xs sm:text-sm";

  useDismissOutside(open, rootRef, setOpen);

  // Focus follows the active option while the listbox is open
  useEffect(() => {
    if (!open) return;
    const el = optionRefs.current[activeIdx];
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "nearest" });
  }, [open, activeIdx]);

  const openList = (idx: number) => {
    pixelSound.play("click");
    setActiveIdx(Math.max(0, Math.min(lastIdx, idx)));
    setOpen(true);
  };

  const closeList = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (open) optionRefs.current[activeIdx]?.focus();
      else if (selectedIdx >= 0) openList(selectedIdx);
      else openList(e.key === "ArrowUp" ? lastIdx : 0);
    } else if (e.key === "Escape" && open) {
      consumeKey(e);
      setOpen(false);
    }
  };

  const onOptionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    i: number
  ) => {
    if (e.key === "Escape") {
      consumeKey(e);
      closeList();
      return;
    }
    let next = -1;
    if (e.key === "ArrowDown") next = Math.min(lastIdx, i + 1);
    else if (e.key === "ArrowUp") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = lastIdx;
    if (next < 0) return;
    e.preventDefault();
    setActiveIdx(next);
  };

  return (
    <div
      ref={rootRef}
      className={`relative space-y-1.5 font-mono-hud ${className}`}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={triggerId}
          onClick={(e) => {
            // Like a native <select>: the label focuses the control without opening it
            e.preventDefault();
            triggerRef.current?.focus();
          }}
          className="block font-pixel text-[10px] font-bold text-[#F5F2EB] tracking-wider uppercase"
        >
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={label ? `${labelId} ${triggerId}` : undefined}
        onClick={() => {
          if (open) {
            pixelSound.play("click");
            setOpen(false);
          } else {
            openList(selectedIdx >= 0 ? selectedIdx : 0);
          }
        }}
        onKeyDown={onTriggerKeyDown}
        className={`w-full bg-[#090B10] hover:bg-[#111622] text-left text-[#F5F2EB] border-2 border-[#090B10] shadow-[4px_4px_0_#040508] flex items-center justify-between gap-2 cursor-pointer transition ${FRAME_2} ${FOCUS_RING} ${sizePad}`}
        style={frameStyle(accent)}
      >
        {/* Never shrinks while the badge can give way; capped to leave the chevron room */}
        <div className="flex grow shrink-0 basis-auto items-center gap-2 min-w-0 max-w-[calc(100%-0.5rem-14px)]">
          {selected?.icon && (
            <PixelIcon name={selected.icon} size={14} color={accent} />
          )}
          <span className="font-bold truncate">
            {selected ? selected.label : placeholder}
          </span>
          {selected?.sublabel && (
            // The label keeps priority: the sublabel only fills the room left
            // beside it, and is left out (not cut to "· …") under 5rem of room.
            <span className="@container flex-1 min-w-0 hidden sm:block">
              <span className="hidden @min-[5rem]:block text-[11px] text-[#94A3B8] truncate">
                · {selected.sublabel}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center min-w-0">
          {selected?.badge && (
            // The badge also gives way to the label. The invisible copy sizes
            // the slot (and keeps today's height); when the slot gets narrower
            // than the badge, the badge wraps onto a clipped second line, so it
            // shows whole or not at all (the option list still shows it).
            <span className="relative min-w-0 overflow-hidden">
              <span
                aria-hidden="true"
                className="invisible block mr-1.5 px-1.5 py-0.5 font-pixel text-[10px] font-bold whitespace-nowrap"
              >
                {selected.badge}
              </span>
              <span className="absolute inset-0 pr-1.5 flex flex-wrap items-center overflow-hidden">
                <span className="h-full" />
                <span
                  className="shrink-0 px-1.5 py-0.5 font-pixel text-[10px] font-bold text-[#090B10] whitespace-nowrap"
                  style={{ backgroundColor: accent }}
                >
                  {selected.badge}
                </span>
              </span>
            </span>
          )}
          <PixelIcon
            name={open ? "chevron-up" : "chevron-down"}
            size={14}
            color={accent}
          />
        </div>
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-labelledby={label ? labelId : triggerId}
          className="absolute left-0 right-0 z-50 mt-1 bg-[#090B10] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] max-h-60 overflow-y-auto divide-y divide-[#1E2638]"
          style={{ outline: `2px solid ${accent}` }}
        >
          {options.map((opt, i) => {
            const isSel = opt.value === value;
            return (
              <button
                key={opt.value}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={isSel}
                tabIndex={i === activeIdx ? 0 : -1}
                onClick={() => {
                  pixelSound.play("coin");
                  onChange(opt.value);
                  closeList();
                }}
                onKeyDown={(e) => onOptionKeyDown(e, i)}
                className={`w-full px-3 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer transition ${FOCUS_RING_INSET} ${
                  isSel
                    ? "bg-[#172033] text-white font-bold"
                    : "hover:bg-[#111622] text-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {opt.icon && (
                    <PixelIcon
                      name={opt.icon}
                      size={14}
                      color={isSel ? accent : "#94A3B8"}
                    />
                  )}
                  <div className="min-w-0">
                    {/* Wraps rather than truncates: in narrow columns the badge
                        beside it would otherwise cut the name ("Gemini 4 Ca…") */}
                    <div className="text-xs font-bold break-words">{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-[10px] text-[#94A3B8] truncate">
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {opt.badge && (
                    <span
                      className="px-1.5 py-0.5 font-pixel text-[10px] font-bold text-[#090B10]"
                      style={{ backgroundColor: accent }}
                    >
                      {opt.badge}
                    </span>
                  )}
                  {isSel && <PixelIcon name="check" size={13} color={accent} />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface PixelAutocompleteProps {
  label?: string;
  options: PixelSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tone?: PixelColorTone;
  className?: string;
  /** Accessible name and tooltip of the clear button (default "Limpiar"). */
  clearLabel?: string;
  /** Accessible name and tooltip of the open/close button (default "Mostrar opciones"). */
  toggleLabel?: string;
  /** Text shown before the quoted query when nothing matches (default "Sin coincidencias para"). */
  emptyLabel?: string;
}

export function PixelAutocomplete({
  label,
  options,
  value,
  onChange,
  placeholder = "Escribe para filtrar...",
  tone = "emerald",
  className = "",
  clearLabel = "Limpiar",
  toggleLabel = "Mostrar opciones",
  emptyLabel = "Sin coincidencias para",
}: PixelAutocompleteProps) {
  const accent = TONE_STYLES[tone].hex;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  // The text filters the list only after the user types in it: a picked label
  // (or one set by the parent) keeps every option on show, and so does the toggle.
  const [filtering, setFiltering] = useState(false);
  // Option highlighted with the arrow keys (focus stays in the input); -1 = none
  const [activeIdx, setActiveIdx] = useState(-1);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${listId}-opt-${i}`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Show the selected label again when the parent changes `value`, or when the
  // selected option is relabelled (e.g. a language switch) while the field
  // still shows the old label. Text the user is typing is left alone.
  const [synced, setSynced] = useState({ value, label: selectedLabel });
  if (value !== synced.value || selectedLabel !== synced.label) {
    if (value !== synced.value || query === synced.label) {
      setQuery(selectedLabel);
      setFiltering(false);
    }
    setSynced({ value, label: selectedLabel });
  }

  useDismissOutside(open, rootRef, setOpen);

  const needle = filtering ? query.trim().toLowerCase() : "";
  const filtered = needle
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(needle) ||
          (o.sublabel && o.sublabel.toLowerCase().includes(needle)) ||
          (o.badge && o.badge.toLowerCase().includes(needle))
      )
    : options;
  const activeIndex = open && activeIdx < filtered.length ? activeIdx : -1;

  // Keep the highlighted option visible inside the scrolling list
  useEffect(() => {
    if (activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Opened on the full list: bring the picked option into view. Only the list
  // scrolls (scrollIntoView could also move the page on a phone).
  useEffect(() => {
    const list = listRef.current;
    if (!open || filtering || !list) return;
    const picked = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!picked) return;
    const top = picked.offsetTop;
    const bottom = top + picked.offsetHeight;
    if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = top - (list.clientHeight - picked.offsetHeight) / 2;
    }
  }, [open, filtering]);

  // The list is about to unmount: move focus out of it so it is not lost.
  // The toggle (not the input) avoids popping the phone keyboard up again.
  const keepFocusOnClose = () => {
    if (listRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus();
    }
  };

  const choose = (opt: PixelSelectOption) => {
    pixelSound.play("powerup");
    onChange(opt.value);
    setQuery(opt.label);
    setFiltering(false);
    keepFocusOnClose();
    setOpen(false);
  };

  // WAI-ARIA combobox keys: arrows move the highlight (opening the list
  // first), Alt+ArrowDown only opens it, Enter picks the highlighted option.
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      const n = filtered.length;
      if (n === 0 || e.altKey) return;
      if (e.key === "ArrowDown") {
        setActiveIdx(activeIndex < n - 1 ? activeIndex + 1 : 0);
      } else {
        setActiveIdx(activeIndex > 0 ? activeIndex - 1 : n - 1);
      }
    } else if (e.key === "Enter" && activeIndex >= 0) {
      // Pick the option instead of submitting a surrounding form
      e.preventDefault();
      choose(filtered[activeIndex]);
    }
  };

  return (
    <div
      ref={rootRef}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !open) return;
        consumeKey(e);
        keepFocusOnClose();
        setOpen(false);
      }}
      className={`relative space-y-1.5 font-mono-hud ${className}`}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className="block font-pixel text-[10px] font-bold text-[#F5F2EB] tracking-wider uppercase"
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center bg-[#090B10] border-2 border-[#090B10] shadow-[4px_4px_0_#040508] ${FRAME_2} ${FOCUS_WITHIN_RING}`}
        style={frameStyle(accent)}
      >
        <span className="pl-3 pr-1 flex items-center shrink-0">
          <PixelIcon name="search" size={14} color={accent} />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          value={query}
          onFocus={() => {
            if (open) return;
            setActiveIdx(-1);
            // Opened from the field, the list follows its text: every option
            // while it shows the picked label, the matches when it holds typed text
            setFiltering(query !== selectedLabel);
            setOpen(true);
          }}
          onChange={(e) => {
            pixelSound.play("dialogBlip");
            setQuery(e.target.value);
            setFiltering(true);
            setActiveIdx(-1);
            setOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          className="w-full px-2.5 py-2 bg-transparent text-xs sm:text-sm text-[#F5F2EB] placeholder:text-[#94A3B8] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label={clearLabel}
            title={clearLabel}
            onClick={() => {
              pixelSound.play("click");
              setQuery("");
              setActiveIdx(-1);
              setOpen(true);
              // This button unmounts with the text: continue typing in the field
              inputRef.current?.focus();
            }}
            className={`px-2.5 py-2 text-[#94A3B8] hover:text-white cursor-pointer ${FOCUS_RING_INSET}`}
          >
            <PixelIcon name="close" size={12} />
          </button>
        )}
        <button
          ref={toggleRef}
          type="button"
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => {
            pixelSound.play("click");
            setActiveIdx(-1);
            // Opening from the toggle always lists every option
            if (!open) setFiltering(false);
            setOpen(!open);
          }}
          className={`px-2.5 py-2 border-l border-[#1E2638] text-[#94A3B8] hover:text-white cursor-pointer ${FOCUS_RING_INSET}`}
        >
          <PixelIcon
            name={open ? "chevron-up" : "chevron-down"}
            size={13}
            color={accent}
          />
        </button>
      </div>

      {open && (
        <div
          ref={listRef}
          id={listId}
          // A listbox only while it holds options; the empty state is plain text
          role={filtered.length > 0 ? "listbox" : undefined}
          aria-labelledby={filtered.length > 0 && label ? labelId : undefined}
          className="absolute left-0 right-0 z-50 mt-1 bg-[#090B10] border-2 border-[#090B10] shadow-[6px_6px_0_#040508] max-h-56 overflow-y-auto divide-y divide-[#1E2638]"
          style={{ outline: `2px solid ${accent}` }}
        >
          {filtered.length === 0 ? (
            <div className="p-3 text-xs text-[#94A3B8] flex items-center justify-between">
              <span>
                {emptyLabel} &ldquo;{query}&rdquo;
              </span>
              <PixelIcon name="ghost" size={14} color="#FF3355" />
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isSel = opt.value === value;
              return (
                <button
                  key={opt.value}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  id={optionId(i)}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  // Reached with the arrow keys from the input, not with Tab
                  tabIndex={-1}
                  onClick={() => choose(opt)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 cursor-pointer transition ${FOCUS_RING_INSET} ${
                    i === activeIndex ? ACTIVE_RING_INSET : ""
                  } ${
                    isSel
                      ? "bg-[#172033] text-white font-bold"
                      : "hover:bg-[#111622] text-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {opt.icon && (
                      <PixelIcon name={opt.icon} size={14} color={accent} />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {opt.label}
                      </div>
                      {opt.sublabel && (
                        <div className="text-[10px] text-[#94A3B8] truncate">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {opt.badge && (
                    <span
                      className="px-1.5 py-0.5 font-pixel text-[10px] font-bold text-[#090B10] shrink-0"
                      style={{ backgroundColor: accent }}
                    >
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export interface PixelCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  tone?: PixelColorTone;
  disabled?: boolean;
  className?: string;
}

export function PixelCheckbox({
  checked,
  onChange,
  label,
  description,
  tone = "yellow",
  disabled = false,
  className = "",
}: PixelCheckboxProps) {
  const accent = TONE_STYLES[tone].hex;
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const descId = `${baseId}-desc`;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={description ? descId : undefined}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        pixelSound.play(checked ? "toggleOff" : "toggleOn");
        onChange(!checked);
      }}
      className={`group flex items-start gap-3 text-left font-mono-hud cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div
        className="w-5 h-5 mt-0.5 border-2 border-[#090B10] shadow-[2px_2px_0_#040508] flex items-center justify-center shrink-0 transition"
        style={{
          backgroundColor: checked ? accent : "#090B10",
          outline: `2px solid ${checked ? accent : "#475569"}`,
        }}
      >
        {checked && <PixelIcon name="check" size={13} color="#090B10" />}
      </div>
      <div className="min-w-0">
        <div
          id={labelId}
          className="text-xs sm:text-sm font-bold text-[#F5F2EB] group-hover:text-white"
        >
          {label}
        </div>
        {description && (
          <div id={descId} className="text-[11px] text-[#94A3B8] leading-snug">
            {description}
          </div>
        )}
      </div>
    </button>
  );
}

export interface PixelRadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface PixelRadioGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: PixelRadioOption[];
  tone?: PixelColorTone;
  className?: string;
}

export function PixelRadioGroup({
  label,
  value,
  onChange,
  options,
  tone = "cyan",
  className = "",
}: PixelRadioGroupProps) {
  const accent = TONE_STYLES[tone].hex;
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const checkedIdx = options.findIndex((o) => o.value === value);
  // Roving tab stop: the checked radio, or the first one when none is checked
  const tabStopIdx = checkedIdx >= 0 ? checkedIdx : 0;

  const choose = (i: number) => {
    pixelSound.play("click");
    onChange(options[i].value);
  };

  // Arrow keys move focus and check the radio they land on (native radio behaviour)
  const onRadioKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    i: number
  ) => {
    const n = options.length;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    optionRefs.current[next]?.focus();
    if (next !== checkedIdx) choose(next);
  };

  return (
    <div className={`space-y-2 font-mono-hud ${className}`}>
      {label && (
        <div
          id={labelId}
          className="font-pixel text-[10px] font-bold text-[#F5F2EB] uppercase"
        >
          {label}
        </div>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        className="space-y-2"
      >
        {options.map((opt, i) => {
          const active = opt.value === value;
          const optId = `${baseId}-opt-${i}`;
          const describedBy =
            [
              opt.description ? `${optId}-desc` : "",
              opt.badge ? `${optId}-badge` : "",
            ]
              .filter(Boolean)
              .join(" ") || undefined;
          return (
            <button
              key={opt.value}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              aria-labelledby={`${optId}-label`}
              aria-describedby={describedBy}
              tabIndex={i === tabStopIdx ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={(e) => onRadioKeyDown(e, i)}
              className={`w-full p-2.5 border-2 border-[#090B10] shadow-[3px_3px_0_#040508] text-left flex items-center justify-between gap-3 cursor-pointer transition ${FRAME_2} ${FOCUS_RING} ${
                active ? "bg-[#161F33]" : "bg-[#090B10] hover:bg-[#111622]"
              }`}
              style={frameStyle(active ? accent : "#2A344B")}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-4 h-4 border-2 border-[#090B10] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "#090B10",
                    outline: `2px solid ${active ? accent : "#64748B"}`,
                  }}
                >
                  {active && (
                    <div
                      className="w-2 h-2"
                      style={{ backgroundColor: accent }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div
                    id={`${optId}-label`}
                    className="text-xs font-bold text-white truncate"
                  >
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div
                      id={`${optId}-desc`}
                      className="text-[11px] text-[#94A3B8] truncate"
                    >
                      {opt.description}
                    </div>
                  )}
                </div>
              </div>
              {opt.badge && (
                <span
                  id={`${optId}-badge`}
                  className="px-1.5 py-0.5 font-pixel text-[10px] font-bold text-[#090B10] shrink-0"
                  style={{ backgroundColor: accent }}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface PixelCollapseItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: PixelIconName;
  content: React.ReactNode;
}

export interface PixelCollapseProps {
  items: PixelCollapseItem[];
  defaultOpenIds?: string[];
  allowMultiple?: boolean;
  tone?: PixelColorTone;
  className?: string;
}

export function PixelCollapse({
  items,
  defaultOpenIds = [],
  allowMultiple = true,
  tone = "yellow",
  className = "",
}: PixelCollapseProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const accent = TONE_STYLES[tone].hex;
  // Scoped ids: two collapses with the same item ids never share a panel id
  const baseId = useId();
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  const toggleItem = (id: string) => {
    const isOpen = openIds.includes(id);
    pixelSound.play(isOpen ? "toggleOff" : "toggleOn");
    if (allowMultiple) {
      setOpenIds((prev) =>
        isOpen ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds(isOpen ? [] : [id]);
    }
  };

  return (
    <div className={`space-y-2.5 font-mono-hud ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="bg-[#090B10] border-2 border-[#090B10] shadow-[4px_4px_0_#040508]"
            style={{ outline: `2px solid ${isOpen ? accent : "#2A344B"}` }}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              // Closed panels are not rendered, so only reference an existing one
              aria-controls={isOpen ? panelId(item.id) : undefined}
              className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 cursor-pointer transition ${
                isOpen ? "bg-[#151D2E]" : "bg-[#111622] hover:bg-[#151D2E]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <PixelIcon
                  name={item.icon || (isOpen ? "folder-open" : "folder")}
                  size={15}
                  color={isOpen ? accent : "#94A3B8"}
                />
                <div className="min-w-0">
                  <div className="font-display text-xs sm:text-sm font-bold text-white truncate">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="text-[11px] text-[#94A3B8] truncate">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.badge && (
                  <span
                    className="px-2 py-0.5 font-pixel text-[10px] font-bold text-[#090B10]"
                    style={{ backgroundColor: accent }}
                  >
                    {item.badge}
                  </span>
                )}
                <PixelIcon
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={accent}
                />
              </div>
            </button>
            {isOpen && (
              <div
                id={panelId(item.id)}
                className="p-3.5 bg-[#090B10] border-t-2 border-[#1E2638] text-xs sm:text-sm text-[#CBD5E1] leading-relaxed"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export interface PixelCalendarEvent {
  date: string; // YYYY-MM-DD
  label: string;
  tone?: PixelColorTone;
}

export interface PixelCalendarProps {
  /** Highlighted day (YYYY-MM-DD). Without it the calendar opens on the viewer's current month. */
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  events?: PixelCalendarEvent[];
  tone?: PixelColorTone;
  lang?: "es" | "en";
  className?: string;
}

/** "YYYY-MM-DD" -> year * 12 + month index, or null when missing or malformed. */
function isoMonthKey(iso?: string): number | null {
  const m = iso ? /^(\d{4})-(\d{2})/.exec(iso) : null;
  if (!m) return null;
  const month = Number(m[2]);
  return month >= 1 && month <= 12 ? Number(m[1]) * 12 + month - 1 : null;
}

const subscribeNever = () => () => {};
/** The viewer's current month. Only the browser knows it: the server snapshot is null. */
const getCurrentMonthKey = (): number | null => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};
const getNoMonthKey = (): number | null => null;

export function PixelCalendar({
  selectedDate,
  onSelectDate,
  events = [],
  tone = "cyan",
  lang = "es",
  className = "",
}: PixelCalendarProps) {
  // Month on screen: the one browsed to with the arrows, else the month of
  // selectedDate, else the viewer's current month. A new selectedDate brings
  // the grid back to its month.
  const [browsedKey, setBrowsedKey] = useState<number | null>(null);
  const [prevSelected, setPrevSelected] = useState(selectedDate);
  if (selectedDate !== prevSelected) {
    setPrevSelected(selectedDate);
    setBrowsedKey(null);
  }
  const currentKey = useSyncExternalStore(
    subscribeNever,
    getCurrentMonthKey,
    getNoMonthKey
  );
  // null only while server-rendering (and hydrating) a calendar without
  // selectedDate: the grid stays empty until the browser knows the month
  const shownKey = browsedKey ?? isoMonthKey(selectedDate) ?? currentKey;
  const year = shownKey === null ? 0 : Math.floor(shownKey / 12);
  const month = shownKey === null ? 0 : shownKey % 12; // 0-indexed
  const accent = TONE_STYLES[tone].hex;

  const monthNamesEs = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const monthNamesEn = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  const weekDaysEs = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];
  const weekDaysEn = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const prevLabel = lang === "es" ? "Mes anterior" : "Previous month";
  const nextLabel = lang === "es" ? "Mes siguiente" : "Next month";

  const startOffset =
    shownKey === null ? 0 : (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth =
    shownKey === null ? 0 : new Date(year, month + 1, 0).getDate();

  const shiftMonth = (delta: number) => {
    if (shownKey === null) return;
    pixelSound.play("click");
    setBrowsedKey(shownKey + delta);
  };
  const prevMonth = () => shiftMonth(-1);
  const nextMonth = () => shiftMonth(1);

  const formatIso = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const activeEvent = events.find((e) => e.date === selectedDate);

  return (
    <div
      className={`bg-[#090B10] border-2 border-[#090B10] shadow-[5px_5px_0_#040508] p-3.5 font-mono-hud space-y-3 ${className}`}
      style={{ outline: `2px solid ${accent}` }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between gap-2 bg-[#111622] p-2 border border-[#2A344B]">
        <button
          type="button"
          onClick={prevMonth}
          aria-label={prevLabel}
          title={prevLabel}
          className="px-2.5 py-1.5 bg-[#090B10] hover:bg-[#1E293B] border border-[#2A344B] cursor-pointer"
        >
          <PixelIcon name="chevron-left" size={13} color={accent} />
        </button>
        <div className="flex items-center gap-1.5 font-pixel text-xs font-bold text-white">
          <PixelIcon name="calendar" size={13} color={accent} />
          {/* Announces the new month after the arrows */}
          <span aria-live="polite" aria-atomic="true">
            {shownKey !== null &&
              `${(lang === "es" ? monthNamesEs : monthNamesEn)[month]} ${year}`}
          </span>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          aria-label={nextLabel}
          title={nextLabel}
          className="px-2.5 py-1.5 bg-[#090B10] hover:bg-[#1E293B] border border-[#2A344B] cursor-pointer"
        >
          <PixelIcon name="chevron-right" size={13} color={accent} />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {(lang === "es" ? weekDaysEs : weekDaysEn).map((wd) => (
          <div
            key={wd}
            className="font-pixel text-[10px] text-[#94A3B8] py-1 bg-[#111622]"
          >
            {wd}
          </div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8 bg-[#06080C]" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const iso = formatIso(day);
          const isSelected = iso === selectedDate;
          const ev = events.find((e) => e.date === iso);
          const evHex = ev
            ? TONE_STYLES[ev.tone || "yellow"].hex
            : undefined;
          const dayClass = `relative h-8 font-mono-hud text-xs font-bold border transition flex flex-col items-center justify-center ${
            isSelected
              ? "text-[#090B10] border-[#090B10] shadow-[2px_2px_0_#FFFFFF]"
              : `bg-[#111622] text-[#F5F2EB] border-[#1E2638] ${
                  onSelectDate ? "hover:bg-[#1A2336]" : ""
                }`
          } ${onSelectDate ? "cursor-pointer" : ""}`;
          const dayStyle = { backgroundColor: isSelected ? accent : undefined };
          const dayContent = (
            <>
              <span>{day}</span>
              {ev && (
                <>
                  <span
                    className="w-1.5 h-1.5"
                    style={{
                      backgroundColor: isSelected ? "#090B10" : evHex,
                    }}
                  />
                  {/* The coloured marker alone does not reach screen readers */}
                  <span className="px-sr-only">{`: ${ev.label}`}</span>
                </>
              )}
            </>
          );

          // Read-only calendar: plain cells, not 31 buttons that do nothing
          if (!onSelectDate) {
            return (
              <div
                key={iso}
                aria-current={isSelected ? "date" : undefined}
                className={dayClass}
                style={dayStyle}
              >
                {dayContent}
              </div>
            );
          }

          return (
            <button
              key={iso}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                pixelSound.play(ev ? "coin" : "click");
                onSelectDate(iso);
              }}
              className={dayClass}
              style={dayStyle}
            >
              {dayContent}
            </button>
          );
        })}
      </div>

      {/* Selected Date / Event Telemetry Footer (only when a date is selected) */}
      {selectedDate && (
        <div className="p-2.5 bg-[#111622] border border-[#2A344B] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2 py-0.5 font-pixel text-[10px] font-bold text-[#090B10] shrink-0"
              style={{ backgroundColor: accent }}
            >
              {selectedDate}
            </span>
            <span className="text-[#CBD5E1] font-bold truncate">
              {activeEvent
                ? activeEvent.label
                : lang === "es"
                ? "Fecha activa en calendario"
                : "Active calendar date"}
            </span>
          </div>
          <PixelIcon name="clock" size={13} color={accent} />
        </div>
      )}
    </div>
  );
}

export interface PixelSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  tone?: PixelColorTone;
  className?: string;
}

export function PixelSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
  tone = "emerald",
  className = "",
}: PixelSliderProps) {
  const accent = TONE_STYLES[tone].hex;
  const inputId = useId();
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const totalBlocks = 16;
  const activeBlocks = Math.round((pct / 100) * totalBlocks);

  return (
    <div className={`space-y-1.5 font-mono-hud ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <label
          htmlFor={inputId}
          className="font-pixel text-[10px] font-bold text-[#F5F2EB]"
        >
          {label}
        </label>
        <span
          className="px-2 py-0.5 font-pixel text-[10px] font-bold text-[#090B10]"
          style={{ backgroundColor: accent }}
        >
          {value}
          {unit}
        </span>
      </div>
      {/* The range input is invisible (opacity-0), so the LED track shows its focus */}
      <div className="relative p-2 bg-[#090B10] border-2 border-[#2A344B] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#FFD100] has-[:focus-visible]:outline-offset-2">
        <div className="grid grid-cols-16 gap-1 pointer-events-none">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 transition-colors"
              style={{
                backgroundColor: i < activeBlocks ? accent : "#151C2B",
              }}
            />
          ))}
        </div>
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={`${value}${unit}`}
          onChange={(e) => {
            pixelSound.play("hover");
            onChange(Number(e.target.value));
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

export interface PixelMultiSeriesPoint {
  label: string;
  values: Record<string, number>;
}

export interface PixelMultiSeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface PixelMultiLineChartProps {
  title?: string;
  subtitle?: string;
  series: PixelMultiSeriesConfig[];
  data: PixelMultiSeriesPoint[];
  maxY?: number;
  unit?: string;
  className?: string;
  /**
   * What each x-axis point is (default "Benchmark"): names the point picker
   * and the screen-reader table column, and prefixes the readout in capitals.
   */
  categoryLabel?: string;
  /**
   * Text of each data value in the readout and the screen-reader table
   * (default: the number followed by `unit`, so 42.0 reads "42%"). Return the
   * whole text, unit included: `(v) => v.toFixed(1) + "%"` keeps "42.0%".
   * The y-axis ticks keep `unit`.
   */
  formatValue?: (value: number) => string;
}

export function PixelMultiLineChart({
  title,
  subtitle,
  series,
  data,
  maxY = 100,
  unit = "%",
  className = "",
  categoryLabel = "Benchmark",
  formatValue,
}: PixelMultiLineChartProps) {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(data.length - 1);
  const valueText = (v: number | undefined) =>
    v === undefined ? "—" : formatValue ? formatValue(v) : `${v}${unit}`;

  const toggleSeries = (k: string) => {
    pixelSound.play("click");
    setHiddenKeys((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  // Size the plot from the longest x label (11px monospace ~6.6px/char) so
  // labels never overlap; the SVG never renders below 1:1 (see wrapper).
  const labelW = Math.max(1, ...data.map((d) => d.label.length)) * 6.6;
  const h = 210;
  const padL = Math.max(46, Math.ceil(labelW / 2) + 4);
  const padR = Math.max(18, Math.ceil(labelW / 2) + 4);
  const padT = 18;
  const padB = 32;
  const plotW = Math.max(
    520 - padL - padR,
    Math.ceil(Math.max(0, data.length - 1) * (labelW + 12))
  );
  const w = padL + plotW + padR;
  const plotH = h - padT - padB;

  const getX = (i: number) =>
    padL + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const getY = (v: number) =>
    padT + plotH - (Math.max(0, Math.min(maxY, v)) / maxY) * plotH;

  return (
    <div
      className={`p-4 bg-[#090B10] border-2 border-[#2A344B] shadow-[5px_5px_0_#040508] font-mono-hud space-y-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {title && (
            <div className="font-pixel text-xs font-bold text-[#FFD100]">
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-[11px] text-[#94A3B8]">{subtitle}</div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {series.map((s) => {
            const hidden = hiddenKeys.includes(s.key);
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={!hidden}
                onClick={() => toggleSeries(s.key)}
                className={`px-2 py-1 border text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  hidden
                    ? "bg-[#090B10] text-[#94A3B8] line-through border-[#1E2638]"
                    : "bg-[#131824] text-white border-[#2A344B]"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 inline-block border border-[#090B10]"
                  style={{ backgroundColor: hidden ? "#475569" : s.color }}
                />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Never scale below 1:1 so axis labels stay readable; phones scroll sideways */}
      <div className="relative overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role={title ? "img" : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        className="block w-full h-auto bg-[#06080D] border border-[#1E2638]"
        style={{ shapeRendering: "crispEdges", aspectRatio: `${w} / ${h}`, minWidth: w }}
      >
        {/* Horizontal Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const y = padT + plotH * (1 - t);
          const val = Math.round(maxY * t);
          return (
            <g key={idx}>
              <line
                x1={padL}
                y1={y}
                x2={w - padR}
                y2={y}
                stroke="#151D2E"
                strokeWidth="1"
              />
              <text
                x={padL - 6}
                y={y + 4}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="monospace"
              >
                {val}
                {unit}
              </text>
            </g>
          );
        })}

        {/* Series Polylines & Pixel Nodes */}
        {series
          .filter((s) => !hiddenKeys.includes(s.key))
          .map((s) => {
            const pts = data
              .map((d, i) => `${getX(i)},${getY(d.values[s.key] ?? 0)}`)
              .join(" ");
            return (
              <g key={s.key}>
                <polyline
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  points={pts}
                />
                {data.map((d, i) => {
                  const cx = getX(i);
                  const cy = getY(d.values[s.key] ?? 0);
                  return (
                    <rect
                      key={`${s.key}-${i}`}
                      x={cx - 3.5}
                      y={cy - 3.5}
                      width="7"
                      height="7"
                      fill={s.color}
                      stroke="#090B10"
                      strokeWidth="1.5"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverIdx(i)}
                    />
                  );
                })}
              </g>
            );
          })}

        {/* X Axis Labels */}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={getX(i)}
            y={h - 9}
            textAnchor="middle"
            fill={hoverIdx === i ? "#FFD100" : "#CBD5E1"}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {d.label}
          </text>
        ))}
      </svg>

      {/* The chart's data as text for screen readers (the SVG is a single image) */}
      <div className="px-sr-only">
        <table>
          {title && <caption>{title}</caption>}
          <thead>
            <tr>
              <th scope="col">{categoryLabel}</th>
              {series.map((s) => (
                <th key={s.key} scope="col">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={`${d.label}-${i}`}>
                <th scope="row">{d.label}</th>
                {series.map((s) => (
                  <td key={s.key}>{valueText(d.values[s.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Keyboard and touch twin of hovering the pixel nodes */}
      {data.length > 0 && (
        <div
          role="group"
          aria-label={categoryLabel}
          className="flex flex-wrap gap-1.5"
        >
          {data.map((d, i) => {
            const isOn = hoverIdx === i;
            return (
              <button
                key={`${d.label}-${i}`}
                type="button"
                aria-pressed={isOn}
                onClick={() => setHoverIdx(i)}
                onFocus={() => setHoverIdx(i)}
                onMouseEnter={() => setHoverIdx(i)}
                className={`px-2 py-1 border text-[10px] font-bold cursor-pointer transition ${
                  isOn
                    ? "bg-[#FFD100] text-[#090B10] border-[#090B10]"
                    : "bg-[#131824] text-[#CBD5E1] border-[#2A344B] hover:text-white"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Live readout: announces the benchmark picked above */}
      <div role="status">
        {hoverIdx !== null && data[hoverIdx] && (
          <div className="p-2 bg-[#111622] border border-[#2A344B] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-pixel text-[10px] text-[#FFD100]">
              {categoryLabel.toUpperCase()}: {data[hoverIdx].label}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {series
                .filter((s) => !hiddenKeys.includes(s.key))
                .map((s) => (
                  <span
                    key={s.key}
                    className="font-bold"
                    style={{ color: s.color }}
                  >
                    {s.name}: {valueText(data[hoverIdx].values[s.key])}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface PixelDonutGaugeProps {
  label: string;
  sublabel?: string;
  value: number;
  maxValue?: number;
  displayValue?: string;
  tone?: PixelColorTone;
  className?: string;
}

export function PixelDonutGauge({
  label,
  sublabel,
  value,
  maxValue = 100,
  displayValue,
  tone = "cyan",
  className = "",
}: PixelDonutGaugeProps) {
  const accent = TONE_STYLES[tone].hex;
  const pct = Math.max(0, Math.min(1, value / maxValue));
  const segments = 16;
  const activeCount = Math.round(pct * segments);

  return (
    <div
      className={`p-3.5 bg-[#090B10] border-2 border-[#2A344B] shadow-[4px_4px_0_#040508] flex items-center gap-3.5 font-mono-hud ${className}`}
    >
      <svg
        width="68"
        height="68"
        viewBox="0 0 68 68"
        className="shrink-0"
        style={{ shapeRendering: "crispEdges" }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
          const r = 25;
          const x = Math.round(34 + Math.cos(angle) * r) - 3;
          const y = Math.round(34 + Math.sin(angle) * r) - 3;
          const active = i < activeCount;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="6"
              height="6"
              fill={active ? accent : "#1A2234"}
            />
          );
        })}
        <text
          x="34"
          y="37"
          textAnchor="middle"
          fill="#F5F2EB"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {displayValue || `${Math.round(pct * 100)}%`}
        </text>
      </svg>
      <div className="min-w-0">
        <div
          className="font-pixel text-[10px] font-bold truncate"
          style={{ color: accent }}
        >
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-[#CBD5E1] font-bold mt-0.5 leading-snug">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

