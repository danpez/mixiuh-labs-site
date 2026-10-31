"use client";

import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { pixelSound } from "./sound";
import { PixelIcon } from "./icons";
import { PIXEL_TONE_STYLES, type PixelTone } from "./components";

/* ============================================================================
   13. FLOATING LAYER (PHASE 2): POSITIONING HOOK, TOOLTIP & POPOVER
   ============================================================================ */

export type PixelPlacement = "top" | "bottom" | "left" | "right";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const subscribeNoop = () => () => {};

/** False on the server and during hydration, true afterwards (portal gate). */
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

/** True when `target` is a node inside `root` (DOM tree, not React tree). */
function within(root: Element | null, target: EventTarget | null): boolean {
  return !!root && target instanceof Node && root.contains(target);
}

const TABBABLE_SELECTOR =
  "a[href], area[href], button, input, select, textarea, iframe, summary, audio[controls], video[controls], [contenteditable], [tabindex]";

/** Elements reachable with Tab inside `root`, in document order. */
function getTabbables(root: ParentNode): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
  ).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.matches(":disabled") &&
      !(el instanceof HTMLInputElement && el.type === "hidden") &&
      !el.closest("[inert]") &&
      el.getClientRects().length > 0 &&
      window.getComputedStyle(el).visibility !== "hidden"
  );
}

/* ----------------------------------------------------------------------------
   usePixelFloating — fixed positioning with flip, viewport clamp & tracking
   ---------------------------------------------------------------------------- */

export interface PixelFloatingOptions {
  /** Measure and follow the anchor only while true. */
  open: boolean;
  /** Preferred side; flips to the opposite one when it does not fit. */
  placement: PixelPlacement;
  /** Gap in px between the anchor and the floating element (default 8). */
  offset?: number;
}

export interface PixelFloatingResult {
  /** `position: fixed` + `top`/`left`; `visibility: hidden` until measured. */
  style: React.CSSProperties;
  /** Side actually used after flipping. */
  placement: PixelPlacement;
  /**
   * Px from the floating element's left edge (top/bottom placements) or top
   * edge (left/right) to the anchor's center, kept 8px inside the corners, so
   * an arrow keeps pointing at the anchor after clamping. 0 until measured.
   */
  arrowOffset: number;
}

interface FloatingPosition {
  top: number;
  left: number;
  placement: PixelPlacement;
  arrowOffset: number;
}

const VIEWPORT_MARGIN = 8;
const ARROW_INSET = 8;

const OPPOSITE_SIDE: Record<PixelPlacement, PixelPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const HIDDEN_FLOATING_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  visibility: "hidden",
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

function computeFloatingPosition(
  anchor: DOMRect,
  floating: DOMRect,
  preferred: PixelPlacement,
  offset: number
): FloatingPosition {
  const root = document.documentElement;
  const vw = root.clientWidth || window.innerWidth;
  const vh = root.clientHeight || window.innerHeight;
  const { width, height } = floating;

  // Free room on each side once the gap and the viewport margin are taken out
  const room: Record<PixelPlacement, number> = {
    top: anchor.top - offset - VIEWPORT_MARGIN,
    bottom: vh - anchor.bottom - offset - VIEWPORT_MARGIN,
    left: anchor.left - offset - VIEWPORT_MARGIN,
    right: vw - anchor.right - offset - VIEWPORT_MARGIN,
  };
  const needed =
    preferred === "top" || preferred === "bottom" ? height : width;
  const opposite = OPPOSITE_SIDE[preferred];
  const placement =
    room[preferred] < needed && room[opposite] > room[preferred]
      ? opposite
      : preferred;

  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;
  let left = centerX - width / 2;
  let top = centerY - height / 2;
  if (placement === "top") top = anchor.top - offset - height;
  else if (placement === "bottom") top = anchor.bottom + offset;
  else if (placement === "left") left = anchor.left - offset - width;
  else left = anchor.right + offset;

  // Stay on screen; anything larger than the viewport sticks to the top/left
  left = Math.round(clamp(left, VIEWPORT_MARGIN, vw - VIEWPORT_MARGIN - width));
  top = Math.round(clamp(top, VIEWPORT_MARGIN, vh - VIEWPORT_MARGIN - height));

  const arrowOffset = Math.round(
    placement === "top" || placement === "bottom"
      ? clamp(centerX - left, ARROW_INSET, width - ARROW_INSET)
      : clamp(centerY - top, ARROW_INSET, height - ARROW_INSET)
  );
  return { top, left, placement, arrowOffset };
}

/**
 * Places a `position: fixed` (usually portaled) element next to its anchor:
 * flips to the opposite side when the preferred one has no room, clamps to the
 * viewport with an 8px margin and follows resize, scroll and size changes
 * while `open`. Mount the floating element in the same render that opens it
 * and spread `style` on it.
 */
export function usePixelFloating(
  anchorRef: React.RefObject<HTMLElement | null>,
  floatingRef: React.RefObject<HTMLElement | null>,
  { open, placement, offset = 8 }: PixelFloatingOptions
): PixelFloatingResult {
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useIsoLayoutEffect(() => {
    if (!open) return;

    const update = () => {
      const anchorEl = anchorRef.current;
      const floatingEl = floatingRef.current;
      if (!anchorEl || !floatingEl) return;
      const next = computeFloatingPosition(
        anchorEl.getBoundingClientRect(),
        floatingEl.getBoundingClientRect(),
        placement,
        offset
      );
      // Write to the DOM right away too: the state update alone lands a frame
      // late, so the element would trail its anchor while scrolling.
      floatingEl.style.top = `${next.top}px`;
      floatingEl.style.left = `${next.left}px`;
      floatingEl.style.visibility = "";
      setPosition((prev) =>
        prev &&
        prev.top === next.top &&
        prev.left === next.left &&
        prev.placement === next.placement &&
        prev.arrowOffset === next.arrowOffset
          ? prev
          : next
      );
    };

    // Size changes (async content, text wrapping) are batched into the next
    // frame, which also keeps ResizeObserver from reporting a loop.
    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleUpdate)
        : null;
    if (anchorRef.current) observer?.observe(anchorRef.current);
    if (floatingRef.current) observer?.observe(floatingRef.current);

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, { capture: true });
      setPosition(null);
    };
  }, [open, placement, offset, anchorRef, floatingRef]);

  if (!open || !position) {
    return { style: HIDDEN_FLOATING_STYLE, placement, arrowOffset: 0 };
  }
  return {
    style: { position: "fixed", top: position.top, left: position.left },
    placement: position.placement,
    arrowOffset: position.arrowOffset,
  };
}

/* ----------------------------------------------------------------------------
   PixelTooltip — hover/focus hint with a pixel notch (role="tooltip")
   ---------------------------------------------------------------------------- */

export interface PixelTooltipProps {
  /** Short, non-interactive hint, announced as the child's description. */
  content: React.ReactNode;
  /**
   * One focusable element (button, link, input...), not a Fragment. While the
   * tooltip is open it is cloned only to add `aria-describedby`, so a custom
   * component must forward that prop to its DOM node.
   */
  children: React.ReactElement;
  placement?: PixelPlacement;
  /** Hover delay in ms; keyboard focus opens it at once. */
  delay?: number;
  tone?: PixelTone;
  /** Keep the child but never show the tooltip. */
  disabled?: boolean;
}

type DescribableProps = { "aria-describedby"?: string };

/** 8x6px notch poking out of the edge that faces the anchor. */
const NOTCH_CLASS: Record<PixelPlacement, string> = {
  top: "top-full w-2 h-1.5 border-x-2 border-b-2",
  bottom: "bottom-full w-2 h-1.5 border-x-2 border-t-2",
  left: "left-full w-1.5 h-2 border-y-2 border-r-2",
  right: "right-full w-1.5 h-2 border-y-2 border-l-2",
};

/** Keyboard focus only (":focus-visible"), so a mouse click does not pop it. */
function isKeyboardFocus(target: EventTarget): boolean {
  if (!(target instanceof Element)) return false;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}

export function PixelTooltip({
  content,
  children,
  placement = "top",
  delay = 300,
  tone = "chalk",
  disabled = false,
}: PixelTooltipProps) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();
  const isClient = useIsClient();
  const hasContent =
    content !== null &&
    content !== undefined &&
    content !== false &&
    content !== "";
  const shown =
    isClient && !disabled && hasContent && (hoverOpen || focusOpen);
  const floating = usePixelFloating(anchorRef, tooltipRef, {
    open: shown,
    placement,
  });
  const t = PIXEL_TONE_STYLES[tone];
  const edge = tone === "ink" ? "border-[#3A4560]" : "border-[#090B10]";

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const cancelHover = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const hide = () => {
    cancelHover();
    setHoverOpen(false);
    setFocusOpen(false);
  };

  const child = children as React.ReactElement<DescribableProps>;
  const anchorChild =
    shown && isValidElement(child)
      ? cloneElement(child, {
          "aria-describedby": [child.props["aria-describedby"], tooltipId]
            .filter(Boolean)
            .join(" "),
        })
      : children;

  const notchAlongX =
    floating.placement === "top" || floating.placement === "bottom";

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onPointerEnter={(e) => {
          // Skip touch, and events bubbling from portals the child renders
          if (
            disabled ||
            e.pointerType === "touch" ||
            !within(e.currentTarget, e.target)
          ) {
            return;
          }
          cancelHover();
          timerRef.current = window.setTimeout(
            () => setHoverOpen(true),
            delay
          );
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "touch") return;
          cancelHover();
          setHoverOpen(false);
        }}
        onPointerDown={hide}
        onFocus={(e) => {
          if (disabled || !within(e.currentTarget, e.target)) return;
          if (isKeyboardFocus(e.target)) setFocusOpen(true);
        }}
        onBlur={(e) => {
          if (within(e.currentTarget, e.relatedTarget)) return;
          setFocusOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Escape" || !shown) return;
          // Dismiss the tooltip first; a parent overlay closes on the next Escape
          e.stopPropagation();
          hide();
        }}
      >
        {anchorChild}
      </span>
      {shown &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            data-placement={floating.placement}
            style={floating.style}
            className={`pointer-events-none z-[99] max-w-[16rem] px-2 py-1 font-pixel text-[10px] leading-snug break-words border-2 ${edge} shadow-[3px_3px_0_#040508] ${t.bg} ${t.text}`}
          >
            {content}
            <span
              aria-hidden="true"
              className={`absolute ${NOTCH_CLASS[floating.placement]} ${edge} ${t.bg}`}
              // -6 = half the 8px notch + the 2px tooltip border
              style={
                notchAlongX
                  ? { left: floating.arrowOffset - 6 }
                  : { top: floating.arrowOffset - 6 }
              }
            />
          </div>,
          document.body
        )}
    </>
  );
}

/* ----------------------------------------------------------------------------
   PixelPopover — click-to-open, non-modal dialog anchored to its own trigger
   ---------------------------------------------------------------------------- */

export interface PixelPopoverProps {
  /** Content of the trigger button (text and/or PixelIcon). */
  trigger: React.ReactNode;
  /** Name for an icon-only trigger; also names the panel when there is no title. */
  triggerAriaLabel?: string;
  /** Replaces the trigger's tone colors and padding (it stays a `px-btn`). */
  triggerClassName?: string;
  tone?: PixelTone;
  /** Tone title bar with a close button; it also labels the dialog. */
  title?: React.ReactNode;
  children: React.ReactNode;
  placement?: PixelPlacement;
  /** Controlled open state; omit it to let the popover manage itself. */
  open?: boolean;
  /** Called on every open/close request, controlled or not. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes for the panel. */
  className?: string;
  /** Width utility for the panel (default "w-72"). */
  widthClassName?: string;
  /** Accessible name of the title bar close button (default "Cerrar"). */
  closeLabel?: string;
}

/**
 * Non-modal dialog: focus moves into the panel on open, Tab flows from the
 * trigger into the panel and back out to the page, Escape closes it and
 * returns focus to the trigger, and pressing or focusing outside closes it.
 */
export function PixelPopover({
  trigger,
  triggerAriaLabel,
  triggerClassName,
  tone = "yellow",
  title,
  children,
  placement = "bottom",
  open,
  onOpenChange,
  className = "",
  widthClassName = "w-72",
  closeLabel = "Cerrar",
}: PixelPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const isClient = useIsClient();
  const shown = isClient && isOpen;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  // Raised by the panel's React capture handlers: events from overlays
  // portaled inside the panel (nested popovers, menus) still count as inside.
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);

  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;
  const titleId = `${baseId}-title`;

  const floating = usePixelFloating(triggerRef, panelRef, {
    open: shown,
    placement,
  });
  const t = PIXEL_TONE_STYLES[tone];
  const accent = tone === "ink" ? "#3A4560" : t.hex;

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === isOpen) return;
      pixelSound.play("click");
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isOpen, isControlled, onOpenChange]
  );

  // Focus in on open, hand focus back to the trigger on close
  useEffect(() => {
    if (!shown) return;
    const triggerEl = triggerRef.current;
    const panelEl = panelRef.current;
    // Next frame: the panel has been measured and is visible (focusable)
    const frame = requestAnimationFrame(() => {
      if (!panelEl) return;
      const body = bodyRef.current;
      const first = body ? getTabbables(body)[0] : undefined;
      (first ?? panelEl).focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      // Only when focus would be lost, never when the user moved it elsewhere
      const active = document.activeElement;
      const lost =
        !active || active === document.body || within(panelEl, active);
      if (lost && triggerEl?.isConnected) {
        triggerEl.focus({ preventScroll: true });
      }
    };
  }, [shown]);

  // Close on a press or a focus move outside trigger + panel
  useEffect(() => {
    if (!shown) return;
    pointerInsideRef.current = false;
    focusInsideRef.current = false;
    const isInside = (
      target: EventTarget | null,
      flag: React.RefObject<boolean>
    ) => {
      const fromPanelTree = flag.current;
      flag.current = false;
      return (
        fromPanelTree ||
        within(triggerRef.current, target) ||
        within(panelRef.current, target)
      );
    };
    // Mouse/pen close on press; touch waits for the tap so scrolling does not
    let tapOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      const inside = isInside(e.target, pointerInsideRef);
      if (e.pointerType === "touch") tapOutside = !inside;
      else if (!inside) setOpen(false);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch" && tapOutside) setOpen(false);
      tapOutside = false;
    };
    const onPointerCancel = () => {
      tapOutside = false;
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!isInside(e.target, focusInsideRef)) setOpen(false);
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
  }, [shown, setOpen]);

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!shown || e.defaultPrevented) return;
    const panelEl = panelRef.current;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab" && !e.shiftKey && panelEl) {
      // The panel lives at the end of <body>: Tab continues inside it
      e.preventDefault();
      (getTabbables(panelEl)[0] ?? panelEl).focus();
    }
  };

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      return;
    }
    const panelEl = panelRef.current;
    const triggerEl = triggerRef.current;
    if (e.key !== "Tab" || !panelEl || !triggerEl) return;
    const items = getTabbables(panelEl);
    const active = document.activeElement;
    if (e.shiftKey) {
      // Before the first item: back to the trigger, the popover stays open
      if (active === panelEl || active === items[0]) {
        e.preventDefault();
        triggerEl.focus();
      }
      return;
    }
    const atEnd =
      items.length === 0 ? active === panelEl : active === items[items.length - 1];
    if (!atEnd) return;
    // After the last item: resume the page order after the trigger (that
    // focus move closes the popover); with nothing after it, just close.
    e.preventDefault();
    const page = getTabbables(document.body).filter(
      (el) => !panelEl.contains(el)
    );
    const next = page[page.indexOf(triggerEl) + 1];
    if (next) next.focus();
    else setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={shown}
        aria-controls={shown ? panelId : undefined}
        aria-label={triggerAriaLabel}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onTriggerKeyDown}
        className={`px-btn ${
          triggerClassName ?? `${t.bg} ${t.text} px-3 py-1.5 text-xs`
        }`}
      >
        {trigger}
      </button>
      {shown &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={
              title ? titleId : triggerAriaLabel ? undefined : triggerId
            }
            aria-label={title ? undefined : triggerAriaLabel}
            tabIndex={-1}
            data-placement={floating.placement}
            onKeyDown={onPanelKeyDown}
            onPointerDownCapture={() => {
              pointerInsideRef.current = true;
            }}
            onFocusCapture={() => {
              focusInsideRef.current = true;
            }}
            style={{ ...floating.style, outline: `2px solid ${accent}` }}
            className={`z-[89] animate-px-pop flex flex-col max-w-[calc(100vw-16px)] max-h-[calc(100dvh-16px)] bg-[#111622] border-2 border-[#090B10] shadow-[5px_5px_0_#040508] ${widthClassName} ${className}`}
          >
            {title && (
              <div
                className={`shrink-0 flex items-center justify-between gap-2 pl-3 pr-1.5 py-1.5 border-b-2 border-[#090B10] ${t.bg} ${t.text}`}
              >
                <span
                  id={titleId}
                  className="min-w-0 font-pixel text-[10px] font-bold leading-snug"
                >
                  {title}
                </span>
                <button
                  type="button"
                  aria-label={closeLabel}
                  title={closeLabel}
                  onClick={() => setOpen(false)}
                  className={`shrink-0 p-1 bg-[#090B10] text-[#F5F2EB] hover:bg-[#FF3355] cursor-pointer ${
                    tone === "ink" ? "" : "focus-visible:outline-[#090B10]"
                  }`}
                >
                  <PixelIcon name="close" size={10} />
                </button>
              </div>
            )}
            <div
              ref={bodyRef}
              className="min-h-0 overflow-y-auto p-3 font-mono-hud text-xs leading-relaxed text-[#CBD5E1]"
            >
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
