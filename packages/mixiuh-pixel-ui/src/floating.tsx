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

const isGroupedRadio = (el: Element): el is HTMLInputElement =>
  el instanceof HTMLInputElement && el.type === "radio" && el.name !== "";

/** Elements reachable with Tab inside `root`, in document order. */
function getTabbables(root: ParentNode): HTMLElement[] {
  const found = Array.from(
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
  // A radio group is a single Tab stop: its checked radio, else its first one
  const radioStops: HTMLInputElement[] = [];
  for (const el of found) {
    if (!isGroupedRadio(el)) continue;
    const i = radioStops.findIndex(
      (stop) => stop.name === el.name && stop.form === el.form
    );
    if (i < 0) radioStops.push(el);
    else if (el.checked && !radioStops[i].checked) radioStops[i] = el;
  }
  return found.filter((el) => !isGroupedRadio(el) || radioStops.includes(el));
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

/**
 * Hint shown on hover (after `delay`) or keyboard focus. Escape hides it
 * wherever focus is, so a hover-only tooltip can be dismissed too.
 */
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
  // Last Escape that dismissed the tooltip (seen first, in the capture phase)
  const escapeRef = useRef<KeyboardEvent | null>(null);
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

  const cancelHover = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const hide = useCallback(() => {
    cancelHover();
    setHoverOpen(false);
    setFocusOpen(false);
  }, [cancelHover]);

  // Escape dismisses it wherever focus is, also after a plain hover (WCAG
  // 1.4.13). The key still reaches the focused element afterwards.
  useEffect(() => {
    if (!shown) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      escapeRef.current = e;
      hide();
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [shown, hide]);

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
          // That Escape only dismissed the tooltip (listener above): a parent
          // overlay closes on the next one
          if (
            escapeRef.current === e.nativeEvent &&
            within(e.currentTarget, e.target)
          ) {
            e.stopPropagation();
          }
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
            // w-max: its width must not depend on `left`, or content growing
            // near the right edge wraps and creeps back 8px per frame
            className={`pointer-events-none z-[99] w-max max-w-[min(16rem,calc(100vw-16px))] px-2 py-1 font-pixel text-[10px] leading-snug break-words border-2 ${edge} shadow-[3px_3px_0_#040508] ${t.bg} ${t.text}`}
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

/** Open panels, newest last: keys pressed once focus is lost go to the top one. */
const openPopovers: HTMLElement[] = [];

/** True when `el` has content to scroll (1px slack for subpixel rounding). */
const canScroll = (el: HTMLElement) =>
  el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;

/**
 * Tab stops of a popover panel in document order. A body with content to
 * scroll counts as one: it only takes focus from script (tabIndex -1), but
 * the keyboard has to reach it to scroll it.
 */
function getPanelStops(
  panel: HTMLElement,
  body: HTMLElement | null
): HTMLElement[] {
  const stops = getTabbables(panel);
  if (body && canScroll(body)) {
    const i = stops.findIndex((el) => body.contains(el));
    stops.splice(i < 0 ? stops.length : i, 0, body);
  }
  return stops;
}

/** The panel stop after `from` in Tab order (`backward`: the one before). */
function adjacentStop(
  panel: HTMLElement,
  body: HTMLElement | null,
  from: Node,
  backward: boolean
): HTMLElement | undefined {
  const ahead = backward
    ? Node.DOCUMENT_POSITION_PRECEDING
    : Node.DOCUMENT_POSITION_FOLLOWING;
  const way = getPanelStops(panel, body).filter(
    (el) => el !== from && (from.compareDocumentPosition(el) & ahead) !== 0
  );
  return backward ? way[way.length - 1] : way[0];
}

/**
 * Tab past either end of the panel, as if it sat right after its trigger in
 * the page: back to the trigger, or on to the page stop that follows it (that
 * focus move closes the popover; with nothing there, `close` runs).
 */
function leavePanel(
  panel: HTMLElement,
  trigger: HTMLElement,
  backward: boolean,
  close: () => void
) {
  if (backward) {
    trigger.focus();
    return;
  }
  const page = getTabbables(document.body).filter((el) => !panel.contains(el));
  const next = page[page.indexOf(trigger) + 1];
  if (next) next.focus();
  else close();
}

/**
 * Non-modal dialog: focus moves into the panel on open (its first control,
 * else its body, which the arrow keys then scroll), Tab flows from the
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
  // Last press and focus events that went through the panel's React tree, so
  // overlays portaled inside it (nested popovers, menus) count as inside.
  // Events, not flags: one stopped before it reaches the document must not
  // make the next outside press or focus count as inside.
  const treePressRef = useRef<Event | null>(null);
  const treeFocusRef = useRef<Event | null>(null);

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
  // The document listeners call the latest one without subscribing again
  const setOpenRef = useRef(setOpen);
  useIsoLayoutEffect(() => {
    setOpenRef.current = setOpen;
  });

  // Focus in on open, hand focus back to the trigger on close
  useEffect(() => {
    if (!shown) return;
    const triggerEl = triggerRef.current;
    const panelEl = panelRef.current;
    // Next frame: the panel has been measured and is visible (focusable)
    const frame = requestAnimationFrame(() => {
      const body = bodyRef.current;
      if (!body) return;
      const first = getTabbables(body)[0];
      // Below the fold it would scroll the start of the content away: the
      // body itself takes focus then, ready to scroll with the keyboard
      const target =
        first &&
        first.getBoundingClientRect().top < body.getBoundingClientRect().bottom
          ? first
          : body;
      target.focus({ preventScroll: true });
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

  // Close on a press or a focus move outside trigger + panel. Keys pressed
  // after focus fell to <body> from inside (the focused control unmounted)
  // still reach the innermost open popover.
  useEffect(() => {
    if (!shown) return;
    const panelEl = panelRef.current;
    if (!panelEl) return;
    openPopovers.push(panelEl);
    const close = () => setOpenRef.current(false);
    const isInside = (e: Event, treeEvent: React.RefObject<Event | null>) =>
      treeEvent.current === e ||
      within(triggerRef.current, e.target) ||
      within(panelEl, e.target);

    // Mouse/pen close on press; touch waits for the tap so scrolling does not
    let tapOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      const inside = isInside(e, treePressRef);
      if (e.pointerType === "touch") tapOutside = !inside;
      else if (!inside) close();
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch" && tapOutside) close();
      tapOutside = false;
    };
    const onPointerCancel = () => {
      tapOutside = false;
    };
    let focusInside = true;
    const onFocusIn = (e: FocusEvent) => {
      focusInside = isInside(e, treeFocusRef);
      if (!focusInside) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const triggerEl = triggerRef.current;
      if (
        e.defaultPrevented ||
        e.isComposing ||
        !focusInside ||
        (active && active !== document.body) ||
        openPopovers[openPopovers.length - 1] !== panelEl
      ) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && triggerEl) {
        // Start over from the panel: Tab to its first stop, Shift+Tab to the
        // trigger
        e.preventDefault();
        const stop = adjacentStop(panelEl, bodyRef.current, panelEl, e.shiftKey);
        if (stop) stop.focus();
        else leavePanel(panelEl, triggerEl, e.shiftKey, close);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerCancel);
    document.addEventListener("focusin", onFocusIn);
    // Capture phase: ahead of page-level key handlers, such as a parent drawer's
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerCancel);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown, true);
      const index = openPopovers.lastIndexOf(panelEl);
      if (index >= 0) openPopovers.splice(index, 1);
    };
  }, [shown]);

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
      const body = bodyRef.current;
      (adjacentStop(panelEl, body, panelEl, false) ?? body ?? panelEl).focus();
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
    const panelEl = e.currentTarget;
    const triggerEl = triggerRef.current;
    const from = e.target;
    // Overlays portaled out of the panel (nested popovers) handle their own Tab
    if (
      e.key !== "Tab" ||
      !triggerEl ||
      !(from instanceof Node) ||
      !panelEl.contains(from)
    ) {
      return;
    }
    const stop = adjacentStop(panelEl, bodyRef.current, from, e.shiftKey);
    // A regular Tab stop: the browser gets there by itself
    if (stop && stop.tabIndex >= 0) return;
    // The body (focusable from script only), or out of the panel: before its
    // first stop back to the trigger (it stays open), after its last one on
    // to the page
    e.preventDefault();
    if (stop) stop.focus();
    else leavePanel(panelEl, triggerEl, e.shiftKey, () => setOpen(false));
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
            onPointerDownCapture={(e) => {
              treePressRef.current = e.nativeEvent;
            }}
            onFocusCapture={(e) => {
              treeFocusRef.current = e.nativeEvent;
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
              // Takes focus when nothing inside it can, so the keyboard
              // scrolls it; the ring is inset to clear the title bar
              tabIndex={-1}
              className="min-h-0 overflow-y-auto p-3 font-mono-hud text-xs leading-relaxed text-[#CBD5E1] focus-visible:outline-offset-[-4px]"
            >
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
