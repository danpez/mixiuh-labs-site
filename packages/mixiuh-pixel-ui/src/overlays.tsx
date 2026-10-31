"use client";

import React, {
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { pixelSound, type PixelSoundName } from "./sound";
import { PixelIcon, type PixelIconName } from "./icons";
import { PIXEL_TONE_STYLES, type PixelTone } from "./components";
import { prefersReducedMotion } from "./motion";
import { getTabbables, lockPageScroll } from "./focus";

/* ============================================================================
   12. NAVIGATION & OVERLAY SUITE (v2.3): TABS, COPY, TOASTS, COMMAND PALETTE
   ============================================================================ */

/* ----------------------------------------------------------------------------
   PixelTabs — accessible segmented control (role="tablist", arrow keys)
   ---------------------------------------------------------------------------- */

export interface PixelTabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: PixelIconName;
  badge?: string | number;
  disabled?: boolean;
}

export interface PixelTabsProps<T extends string = string> {
  items: PixelTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  tone?: PixelTone;
  size?: "sm" | "md";
  ariaLabel?: string;
  /** Wrap onto several rows instead of scrolling horizontally. */
  wrap?: boolean;
  className?: string;
}

export function PixelTabs<T extends string = string>({
  items,
  value,
  onChange,
  tone = "yellow",
  size = "md",
  ariaLabel,
  wrap = false,
  className = "",
}: PixelTabsProps<T>) {
  const t = PIXEL_TONE_STYLES[tone];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: T) => {
    if (id === value) return;
    pixelSound.play("click");
    onChange(id);
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabled = items
      .map((item, i) => (item.disabled ? -1 : i))
      .filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = enabled[(pos + 1) % enabled.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = enabled[(pos - 1 + enabled.length) % enabled.length];
    } else if (e.key === "Home") {
      next = enabled[0];
    } else if (e.key === "End") {
      next = enabled[enabled.length - 1];
    }
    if (next < 0) return;
    e.preventDefault();
    refs.current[next]?.focus();
    select(items[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex max-w-full gap-1 p-1 bg-[#111622] border-2 border-[#2A344B] shadow-[4px_4px_0_#040508] font-mono-hud ${
        wrap ? "flex-wrap" : "overflow-x-auto"
      } ${className}`}
    >
      {items.map((item, i) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            disabled={item.disabled}
            onClick={() => select(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`shrink-0 inline-flex items-center gap-1.5 font-bold whitespace-nowrap border-2 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
              size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } ${
              active
                ? `${t.bg} ${t.text} border-[#090B10] shadow-[2px_2px_0_#040508]`
                : "border-transparent text-[#94A3B8] hover:text-white hover:bg-[#1A2132]"
            }`}
          >
            {item.icon && <PixelIcon name={item.icon} size={12} />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`px-1 font-pixel text-[10px] ${
                  active ? "bg-[#090B10] text-[#F5F2EB]" : "bg-[#1A2132] text-[#CBD5E1]"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Toasts — global store + <PixelToaster /> (mount once near the root)
   ---------------------------------------------------------------------------- */

export interface PixelToastItem {
  id: number;
  title: string;
  description?: string;
  tone: PixelTone;
  icon: PixelIconName;
}

export interface PixelToastInput {
  title: string;
  description?: string;
  tone?: PixelTone;
  icon?: PixelIconName;
  /** Milliseconds before auto-dismiss (default 2600). */
  duration?: number;
  /** Sound to play, or null for silence (default "dialogBlip"). */
  sound?: PixelSoundName | null;
}

type ToastListener = () => void;
const NO_TOASTS: PixelToastItem[] = [];

class PixelToastStore {
  private items: PixelToastItem[] = NO_TOASTS;
  private listeners = new Set<ToastListener>();
  private nextId = 1;

  show = (input: PixelToastInput): number => {
    const id = this.nextId++;
    const item: PixelToastItem = {
      id,
      title: input.title,
      description: input.description,
      tone: input.tone ?? "yellow",
      icon: input.icon ?? "bell",
    };
    this.items = [...this.items, item].slice(-4);
    this.emit();
    if (input.sound !== null) pixelSound.play(input.sound ?? "dialogBlip");
    if (typeof window !== "undefined") {
      window.setTimeout(() => this.dismiss(id), input.duration ?? 2600);
    }
    return id;
  };

  dismiss = (id: number) => {
    if (!this.items.some((t) => t.id === id)) return;
    this.items = this.items.filter((t) => t.id !== id);
    this.emit();
  };

  subscribe = (fn: ToastListener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.items;

  private emit() {
    this.listeners.forEach((fn) => fn());
  }
}

/** Imperative toast API: `pixelToast.show({ title: "Copiado", tone: "emerald" })`. */
export const pixelToast = new PixelToastStore();

export function usePixelToasts(): PixelToastItem[] {
  return useSyncExternalStore(
    pixelToast.subscribe,
    pixelToast.getSnapshot,
    () => NO_TOASTS
  );
}

export function PixelToaster({ className = "" }: { className?: string }) {
  const toasts = usePixelToasts();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-[90] right-4 bottom-20 flex flex-col items-end gap-2 pointer-events-none ${className}`}
    >
      {toasts.map((toast) => {
        const t = PIXEL_TONE_STYLES[toast.tone];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto animate-px-pop w-[min(20rem,calc(100vw-2rem))] flex items-stretch bg-[#111622] border-2 border-[#090B10] shadow-[5px_5px_0_#040508]"
            style={{ outline: `2px solid ${t.hex}` }}
          >
            <div className={`${t.bg} ${t.text} px-2.5 flex items-center`}>
              <PixelIcon name={toast.icon} size={16} />
            </div>
            <div className="flex-1 min-w-0 px-3 py-2">
              <div className="font-pixel text-[10px] font-bold text-white leading-snug">
                {toast.title}
              </div>
              {toast.description && (
                <div className="font-mono-hud text-[11px] text-[#94A3B8] leading-snug mt-0.5">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => pixelToast.dismiss(toast.id)}
              aria-label="Cerrar notificacion / Dismiss"
              className="px-2 text-[#94A3B8] hover:text-white hover:bg-[#1A2132] cursor-pointer"
            >
              <PixelIcon name="close" size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   PixelCopyButton — clipboard with insecure-context fallback + feedback
   ---------------------------------------------------------------------------- */

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export interface PixelCopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  /** Optional toast shown after copying. */
  toastTitle?: string;
  tone?: PixelTone;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function PixelCopyButton({
  text,
  label = "Copiar",
  copiedLabel = "Copiado",
  toastTitle,
  tone = "ink",
  size = "sm",
  className = "",
}: PixelCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = PIXEL_TONE_STYLES[tone];

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const sizeMap = {
    xs: "px-2 py-1 text-[10px]",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs sm:text-sm",
  };

  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyTextToClipboard(text);
        setCopied(ok);
        pixelSound.play(ok ? "coin" : "hit");
        if (toastTitle) {
          pixelToast.show({
            title: ok ? toastTitle : "No se pudo copiar / Copy failed",
            tone: ok ? "emerald" : "coral",
            icon: ok ? "check" : "close",
            sound: null,
          });
        }
      }}
      className={`px-btn ${copied ? "bg-[#10B981] text-[#090B10]" : `${t.bg} ${t.text}`} ${sizeMap[size]} ${className}`}
    >
      <PixelIcon name={copied ? "check" : "copy"} size={size === "xs" ? 11 : 13} />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}

/* ----------------------------------------------------------------------------
   PixelCommandPalette — Ctrl/Cmd+K "BIOS terminal" launcher
   ---------------------------------------------------------------------------- */

export interface PixelCommandItem {
  id: string;
  label: string;
  group?: string;
  hint?: string;
  icon?: PixelIconName;
  /** Extra search terms that are not displayed. */
  keywords?: string;
  tone?: PixelTone;
  onSelect: () => void;
}

export interface PixelCommandPaletteProps {
  items: PixelCommandItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  placeholder?: string;
  emptyLabel?: string;
  footerHint?: string;
  /** Listen for Ctrl/Cmd+K globally (default true). */
  hotkey?: boolean;
}

const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function PixelCommandPalette({
  items,
  open,
  onOpenChange,
  title = "MIXIUH LABS // COMMAND BIOS",
  placeholder = "Escribe un comando o busca...",
  emptyLabel = "Sin resultados",
  footerHint = "↑↓ navegar · ENTER abrir · ESC cerrar",
  hotkey = true,
}: PixelCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  const listId = useId();

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  // Global Ctrl/Cmd+K toggle
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey, open, onOpenChange]);

  // Focus management, page scroll lock & reset on open/close
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    pixelSound.play("powerup", { volume: 0.5 });
    const unlockScroll = lockPageScroll();
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    // The field handles its own keys. With focus anywhere else (<body> after
    // a press on the dialog's text, the ESC button, a scrolled list) Escape
    // still closes and Tab goes back to the field. Capture phase: this top
    // layer answers before a drawer underneath it.
    const onDocumentKeyDown = (e: KeyboardEvent) => {
      if (
        e.defaultPrevented ||
        e.isComposing ||
        e.target === inputRef.current
      ) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChangeRef.current(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onDocumentKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onDocumentKeyDown, true);
      unlockScroll();
      setQuery("");
      setActive(0);
      const prev = restoreFocusRef.current;
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [open]);

  const results = useMemo(() => {
    const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return items;
    const scored: { item: PixelCommandItem; score: number; idx: number }[] = [];
    items.forEach((item, idx) => {
      const label = normalizeSearch(item.label);
      const haystack = normalizeSearch(
        `${item.label} ${item.group ?? ""} ${item.hint ?? ""} ${item.keywords ?? ""}`
      );
      if (!tokens.every((tok) => haystack.includes(tok))) return;
      const score = label.startsWith(tokens[0])
        ? 0
        : label.includes(tokens[0])
        ? 1
        : 2;
      scored.push({ item, score, idx });
    });
    return scored
      .sort((a, b) => a.score - b.score || a.idx - b.idx)
      .map((s) => s.item);
  }, [items, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!open) return null;

  const run = (item: PixelCommandItem) => {
    pixelSound.play("cartridgeInsert");
    onOpenChange(false);
    // Let the palette unmount (and restore focus) before navigating
    window.setTimeout(item.onSelect, 0);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(
        (activeIndex - 1 + Math.max(results.length, 1)) %
          Math.max(results.length, 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) run(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog
      e.preventDefault();
    }
  };

  // Group header shown on the first option of each group
  const startsGroup = results.map(
    (item, i) => !!item.group && item.group !== results[i - 1]?.group
  );

  return (
    <div
      className="fixed inset-0 z-[95] px-backdrop flex items-start justify-center p-3 sm:p-6 pt-[10vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-px-pop w-full max-w-2xl bg-[#090B10] border-2 border-[#090B10] shadow-[8px_8px_0_#040508] flex flex-col max-h-[75vh]"
        style={{ outline: "2px solid #FFD100" }}
      >
        <div className="px-3.5 py-2 bg-[#FFD100] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <PixelIcon name="terminal" size={14} />
            <span className="font-pixel text-[10px] sm:text-xs font-bold truncate">
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-1.5 py-0.5 bg-[#090B10] text-[#F5F2EB] font-pixel text-[10px] font-bold cursor-pointer hover:bg-[#FF3355]"
          >
            ESC
          </button>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-3 border-b-2 border-[#2A344B] bg-[#111622]">
          <span className="font-pixel text-sm text-[#FFD100]" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              results[activeIndex] ? `${listId}-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent font-mono-hud text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus-visible:outline-none"
          />
          <span className="hidden sm:inline-flex items-center gap-1 font-mono-hud text-[10px] text-[#94A3B8]">
            {results.length}
          </span>
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label={title}
          className="flex-1 overflow-y-auto py-1.5"
        >
          {results.length === 0 && (
            <div className="px-4 py-8 text-center font-mono-hud text-xs text-[#94A3B8]">
              {emptyLabel}
            </div>
          )}
          {results.map((item, i) => {
            const isActive = i === activeIndex;
            const showGroup = startsGroup[i];
            const accent = PIXEL_TONE_STYLES[item.tone ?? "yellow"].hex;
            return (
              <React.Fragment key={item.id}>
                {showGroup && (
                  <div className="px-3.5 pt-2.5 pb-1 font-pixel text-[10px] text-[#94A3B8] uppercase tracking-wider">
                    {item.group}
                  </div>
                )}
                <button
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  id={`${listId}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  onMouseMove={() => {
                    if (!isActive) setActive(i);
                  }}
                  onClick={() => run(item)}
                  className={`w-full px-3.5 py-2 flex items-center gap-2.5 text-left cursor-pointer border-l-4 ${
                    isActive
                      ? "bg-[#1A2132] text-white"
                      : "border-transparent text-[#CBD5E1]"
                  }`}
                  style={isActive ? { borderLeftColor: accent } : undefined}
                >
                  <PixelIcon
                    name={item.icon ?? "chevron-right"}
                    size={14}
                    color={isActive ? accent : "#94A3B8"}
                  />
                  <span className="flex-1 min-w-0 font-mono-hud text-xs sm:text-sm truncate">
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="hidden sm:inline font-mono-hud text-[10px] text-[#94A3B8] truncate max-w-[40%]">
                      {item.hint}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="px-3.5 py-1.5 border-t-2 border-[#2A344B] bg-[#111622] font-mono-hud text-[10px] text-[#94A3B8] flex items-center justify-between gap-2">
          <span className="truncate">{footerHint}</span>
          <span className="shrink-0 inline-flex items-center gap-1">
            <kbd className="px-kbd">Ctrl</kbd>
            <kbd className="px-kbd">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   PixelBackToTop — floating "▲" keycap after scrolling down
   ---------------------------------------------------------------------------- */

export interface PixelBackToTopProps {
  threshold?: number;
  label?: string;
}

export function PixelBackToTop({
  threshold = 640,
  label = "Volver arriba",
}: PixelBackToTopProps) {
  const visible = useSyncExternalStore(
    (cb) => {
      window.addEventListener("scroll", cb, { passive: true });
      return () => window.removeEventListener("scroll", cb);
    },
    () => window.scrollY > threshold,
    () => false
  );

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        pixelSound.play("jump");
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }}
      className="fixed bottom-4 right-4 z-[80] px-btn animate-px-pop w-11 h-11 bg-[#FFD100] text-[#090B10]"
    >
      <PixelIcon name="arrow-up" size={18} />
    </button>
  );
}

/* ----------------------------------------------------------------------------
   PixelSwipeHint — tells touch users a wide table/chart scrolls sideways
   ---------------------------------------------------------------------------- */

export interface PixelSwipeHintProps {
  label?: string;
  /** Tailwind breakpoint class that hides the hint on wide screens. */
  hideFrom?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SWIPE_HIDE_CLASS = {
  sm: "sm:hidden",
  md: "md:hidden",
  lg: "lg:hidden",
  xl: "xl:hidden",
};

export function PixelSwipeHint({
  label = "Desliza para ver todas las columnas",
  hideFrom = "lg",
  className = "",
}: PixelSwipeHintProps) {
  return (
    <div
      className={`${SWIPE_HIDE_CLASS[hideFrom]} flex items-center justify-center gap-2 px-3 py-1.5 bg-[#090B10] border-b border-[#2A344B] font-pixel text-[10px] text-[#CBD5E1] ${className}`}
    >
      <PixelIcon name="arrow-left" size={10} color="#FFD100" />
      <span>{label}</span>
      <PixelIcon name="arrow-right" size={10} color="#FFD100" />
    </div>
  );
}

/* ----------------------------------------------------------------------------
   usePixelDialog — modal behaviour for custom dialogs (focus in, trap, Escape,
   scroll lock, focus restore). Attach the returned ref to the dialog panel and
   give it role="dialog" aria-modal="true" aria-labelledby={...}.
   ---------------------------------------------------------------------------- */

export function usePixelDialog<T extends HTMLElement = HTMLDivElement>(
  open: boolean,
  onClose: () => void
) {
  const panelRef = useRef<T | null>(null);
  const onCloseRef = useRef(onClose);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Remember who had focus. Insertion effects run before React applies
  // `autoFocus` inside the new dialog, so this still sees the opener.
  useInsertionEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    openerRef.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    const openPanel = panelRef.current;
    const unlockScroll = lockPageScroll();

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      // `autoFocus` inside the dialog already chose where focus starts
      const current = document.activeElement;
      if (current && current !== panel && panel.contains(current)) return;
      const first = getTabbables(panel)[0];
      if (first) first.focus({ preventScroll: true });
      else {
        if (!panel.hasAttribute("tabindex")) panel.setAttribute("tabindex", "-1");
        panel.focus({ preventScroll: true });
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      // Already handled (a menu or popover inside closed on it), or the key
      // belongs to an IME composition
      if (e.defaultPrevented || e.isComposing) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const list = getTabbables(panel);
      if (list.length === 0) {
        e.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const active = document.activeElement;
      const ahead = e.shiftKey
        ? Node.DOCUMENT_POSITION_PRECEDING
        : Node.DOCUMENT_POSITION_FOLLOWING;
      // Inside the panel with a stop further that way: the browser gets there
      // by itself. From the last stop (first, with Shift), from the panel
      // itself or from outside it, wrap around to the other end.
      if (
        active &&
        active !== panel &&
        panel.contains(active) &&
        list.some(
          (el) => el !== active && (active.compareDocumentPosition(el) & ahead) !== 0
        )
      ) {
        return;
      }
      e.preventDefault();
      (e.shiftKey ? list[list.length - 1] : list[0]).focus({
        preventScroll: true,
      });
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      // Back to the opener, unless the app already moved focus elsewhere
      const current = document.activeElement;
      const lost =
        !current ||
        current === document.body ||
        (!!openPanel && openPanel.contains(current));
      if (lost && opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  return panelRef;
}
