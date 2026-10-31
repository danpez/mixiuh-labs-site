"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { pixelSound } from "./sound";
import { PixelIcon } from "./icons";
import { PIXEL_TONE_STYLES, type PixelTone } from "./components";

/* ============================================================================
   MODAL DRAWERS (ROADMAP PHASE 2): PIXELDRAWER SIDE PANEL & PIXELSHEET
   ============================================================================ */

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

const hasNode = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/* ----------------------------------------------------------------------------
   Focus trap & page scroll lock shared by every open drawer
   ---------------------------------------------------------------------------- */

const TABBABLE_SELECTOR =
  "a[href], area[href], button, input, select, textarea, iframe, summary, audio[controls], video[controls], [contenteditable], [tabindex]";

const isGroupedRadio = (el: Element): el is HTMLInputElement =>
  el instanceof HTMLInputElement && el.type === "radio" && el.name !== "";

/**
 * True when `el` is rendered and visible. checkVisibility() also rules out
 * content that keeps its boxes while Tab and focus() skip it: a closed
 * <details> or `hidden="until-found"` (content-visibility: hidden).
 */
function isRendered(el: HTMLElement): boolean {
  if (typeof el.checkVisibility === "function") {
    return el.checkVisibility({
      visibilityProperty: true,
      checkVisibilityCSS: true,
    });
  }
  return (
    el.getClientRects().length > 0 &&
    window.getComputedStyle(el).visibility === "visible"
  );
}

/** Elements reachable with Tab inside `root`, in document order. */
function getTabbables(root: HTMLElement): HTMLElement[] {
  const found = Array.from(
    root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
  ).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.matches(":disabled") &&
      !(el instanceof HTMLInputElement && el.type === "hidden") &&
      !el.closest("[inert]") &&
      isRendered(el)
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

/** True when `el` has content to scroll (1px slack for subpixel rounding). */
const canScroll = (el: HTMLElement) =>
  el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;

/**
 * Tab stops of a panel in document order. A body with content to scroll is
 * one too, between the title bar and its own content: it takes focus from
 * script only (tabIndex -1), but the keyboard has to reach it to scroll it.
 */
function getPanelStops(
  panel: HTMLElement,
  body: HTMLElement | null
): HTMLElement[] {
  const stops = getTabbables(panel);
  if (body && canScroll(body)) {
    const i = stops.findIndex(
      (el) =>
        (body.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !==
        0
    );
    stops.splice(i < 0 ? stops.length : i, 0, body);
  }
  return stops;
}

/** Focuses the first candidate that really takes focus; false if none does. */
function focusFirst(
  candidates: readonly (HTMLElement | null | undefined)[]
): boolean {
  for (const el of candidates) {
    if (!el) continue;
    el.focus();
    if (document.activeElement === el) return true;
  }
  return false;
}

/**
 * Focuses the first (or last) stop of `panel`, walking inward past any stop
 * that refuses focus, else the panel itself.
 */
function focusEdge(
  panel: HTMLElement,
  body: HTMLElement | null,
  last: boolean,
  stops = getPanelStops(panel, body)
) {
  if (!focusFirst(last ? [...stops].reverse() : stops)) panel.focus();
}

/** Open panels, newest last: keys pressed outside every panel go to the top one. */
const openPanels: HTMLElement[] = [];

let scrollLocks = 0;
let savedOverflow = "";
let savedGutter = "";

/**
 * Stops page scrolling until the returned function runs. The lock goes on
 * <html>, not <body>: this kit gives <html> `overflow-x: clip`, and once the
 * root overflow is not `visible` the body overflow no longer reaches the
 * viewport. Counted, so stacked drawers may close in any order and the
 * previous inline values come back with the last one.
 */
function lockPageScroll(): () => void {
  const root = document.documentElement;
  if (scrollLocks === 0) {
    savedOverflow = root.style.overflow;
    savedGutter = root.style.getPropertyValue("scrollbar-gutter");
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    // Keep the scrollbar's room so the page behind does not jump sideways
    if (scrollbarWidth > 0) root.style.setProperty("scrollbar-gutter", "stable");
  }
  scrollLocks += 1;
  return () => {
    scrollLocks -= 1;
    if (scrollLocks > 0) return;
    root.style.overflow = savedOverflow;
    root.style.setProperty("scrollbar-gutter", savedGutter);
  };
}

/* ----------------------------------------------------------------------------
   PixelDrawer — modal side panel (role="dialog") & PixelSheet — bottom sheet
   ---------------------------------------------------------------------------- */

export interface PixelDrawerProps {
  /** Controlled visibility; nothing is rendered while false. */
  open: boolean;
  /** Receives `false` when the user dismisses it: close button, Escape or a press on the backdrop. */
  onOpenChange: (open: boolean) => void;
  /** Title bar text; it also names the dialog. */
  title: React.ReactNode;
  /** Muted line under the title bar; it also describes the dialog. */
  description?: React.ReactNode;
  /** Edge the panel docks to (default "right"). */
  side?: "left" | "right" | "bottom";
  /**
   * Side panels: width sm 20rem, md 26rem, lg 34rem (never wider than the
   * screen). Bottom sheet: max height sm 50vh, md 70vh, lg 85vh.
   */
  size?: "sm" | "md" | "lg";
  tone?: PixelTone;
  /** Scrollable body. */
  children: React.ReactNode;
  /** Actions pinned under the body, laid out as a right-aligned wrapping row. */
  footer?: React.ReactNode;
  /** Accessible name of the close button (default "Cerrar"). */
  closeLabel?: string;
  /**
   * Element focused on open. Default: the first focusable element of the
   * body when it is in view, else the body itself (arrow keys, Page Up/Down,
   * Space, Home and End then scroll it).
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Extra classes for the panel. */
  className?: string;
}

export type PixelSheetProps = Omit<PixelDrawerProps, "side">;

const BACKDROP_LAYOUT: Record<NonNullable<PixelDrawerProps["side"]>, string> = {
  left: "justify-start",
  right: "justify-end",
  bottom: "flex-col justify-end",
};

const PANEL_SIZE = {
  side: {
    sm: "h-full w-[min(20rem,100vw)]",
    md: "h-full w-[min(26rem,100vw)]",
    lg: "h-full w-[min(34rem,100vw)]",
  },
  bottom: {
    sm: "w-full max-h-[50vh]",
    md: "w-full max-h-[70vh]",
    lg: "w-full max-h-[85vh]",
  },
} as const;

/**
 * Modal panel docked to a screen edge. Focus moves in on open (see
 * `initialFocusRef`), Tab and Shift+Tab wrap inside it (a body with content
 * to scroll is a stop of its own), Escape or a press on the backdrop closes
 * it, page scroll is locked while it is open and focus returns to the opener
 * on close.
 */
export function PixelDrawer({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  size = "md",
  tone = "yellow",
  children,
  footer,
  closeLabel = "Cerrar",
  initialFocusRef,
  className = "",
}: PixelDrawerProps) {
  const isClient = useIsClient();
  const shown = isClient && open;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  // Last keydown that went through this drawer's React tree (portaled
  // popovers inside it included): the page-level listener leaves it alone.
  const treeKeyRef = useRef<KeyboardEvent | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const latestRef = useRef({ onOpenChange, initialFocusRef });

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const hasDescription = hasNode(description);
  const t = PIXEL_TONE_STYLES[tone];
  const accent = tone === "ink" ? "#3A4560" : t.hex;

  useIsoLayoutEffect(() => {
    latestRef.current = { onOpenChange, initialFocusRef };
  });

  const requestClose = useCallback(() => {
    pixelSound.play("toggleOff");
    latestRef.current.onOpenChange(false);
  }, []);

  // Remember who had focus. Insertion effects run before React applies
  // `autoFocus` inside the new panel, so this still sees the opener.
  useInsertionEffect(() => {
    if (!shown) return;
    const active = document.activeElement;
    openerRef.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }, [shown]);

  // Open: lock scroll, move focus in, watch keys outside. Close: undo it all.
  useIsoLayoutEffect(() => {
    if (!shown) return;
    const panel = panelRef.current;
    if (!panel) return;
    const body = bodyRef.current;
    const opener = openerRef.current;
    const unlockScroll = lockPageScroll();
    openPanels.push(panel);
    pixelSound.play("cartridgeInsert");

    // Next frame, once the press that opened it has done its own focusing
    const frame = requestAnimationFrame(() => {
      const current = document.activeElement;
      if (current && current !== panel && panel.contains(current)) return;
      const initial = latestRef.current.initialFocusRef?.current;
      const first = body ? getTabbables(body)[0] : undefined;
      // Below the fold it would scroll the start of the content away: the
      // body itself takes focus then, ready to scroll with the keyboard
      const firstInView =
        body && first
          ? first.getBoundingClientRect().top <
            body.getBoundingClientRect().bottom
          : false;
      focusFirst([
        initial && panel.contains(initial) ? initial : null,
        firstInView ? first : null,
        body,
        panel,
      ]);
    });

    // Keys pressed with focus outside the panel: on <body> after a focused
    // control unmounted, or on a toast stacked above the backdrop
    const onDocumentKeyDown = (e: KeyboardEvent) => {
      if (
        e.defaultPrevented ||
        e.isComposing ||
        treeKeyRef.current === e ||
        openPanels[openPanels.length - 1] !== panel
      ) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      } else if (e.key === "Tab") {
        e.preventDefault();
        focusEdge(panel, body, e.shiftKey);
      }
    };
    document.addEventListener("keydown", onDocumentKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onDocumentKeyDown);
      const index = openPanels.lastIndexOf(panel);
      if (index >= 0) openPanels.splice(index, 1);
      unlockScroll();
      // Back to the opener, unless the app already moved focus elsewhere
      const current = document.activeElement;
      const lost =
        !current || current === document.body || panel.contains(current);
      if (lost && opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [shown, requestClose]);

  if (!shown) return null;

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      requestClose();
      return;
    }
    const panel = e.currentTarget;
    const from = e.target;
    // Popovers portaled out of the panel run their own Tab handling
    if (e.key !== "Tab" || !(from instanceof Element) || !panel.contains(from)) {
      return;
    }
    const body = bodyRef.current;
    const stops = getPanelStops(panel, body);
    const ahead = e.shiftKey
      ? Node.DOCUMENT_POSITION_PRECEDING
      : Node.DOCUMENT_POSITION_FOLLOWING;
    // Stops that way, nearest first
    const way = stops.filter(
      (el) => el !== from && (from.compareDocumentPosition(el) & ahead) !== 0
    );
    if (e.shiftKey) way.reverse();
    // From one regular stop to the next: the browser gets there by itself
    const fromStop = from instanceof HTMLElement && from.tabIndex >= 0;
    if (fromStop && way.length > 0 && way[0].tabIndex >= 0) return;
    // Into the body, out of a container (panel, body: the browser could start
    // from the point clicked inside it) or around the end: by script
    e.preventDefault();
    if (!focusFirst(way)) focusEdge(panel, body, e.shiftKey, stops);
  };

  const panelSize = PANEL_SIZE[side === "bottom" ? "bottom" : "side"][size];

  return createPortal(
    <div
      className={`fixed inset-0 z-[88] px-backdrop flex ${BACKDROP_LAYOUT[side]}`}
      onMouseDown={(e) => {
        if (e.target !== e.currentTarget || e.button !== 0) return;
        // Keeps the press from blurring the opener that focus returns to
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        // Clicks with no press behind them (assistive tech) close it too.
        // Having onClick also makes iOS Safari deliver taps to this layer.
        if (e.target === e.currentTarget && e.detail === 0) requestClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDownCapture={(e) => {
          treeKeyRef.current = e.nativeEvent;
        }}
        onKeyDown={onPanelKeyDown}
        style={{ outline: `2px solid ${accent}` }}
        className={`animate-px-pop flex flex-col max-w-full bg-[#111622] border-2 border-[#090B10] shadow-[8px_8px_0_#040508] ${panelSize} ${className}`}
      >
        <div
          className={`shrink-0 flex items-center justify-between gap-3 py-2 pl-4 pr-2 border-b-2 border-[#090B10] ${t.bg} ${t.text}`}
        >
          <h2
            id={titleId}
            className="min-w-0 font-pixel text-[11px] sm:text-xs font-bold leading-snug break-words"
            // Flat like the palette/popover title bars: no global h2 shadow
            style={{ textShadow: "none" }}
          >
            {title}
          </h2>
          <button
            type="button"
            aria-label={closeLabel}
            title={closeLabel}
            onClick={requestClose}
            className={`shrink-0 inline-flex items-center justify-center w-7 h-7 bg-[#090B10] text-[#F5F2EB] cursor-pointer ${
              tone === "coral" ? "hover:bg-[#B31935]" : "hover:bg-[#FF3355]"
            } ${tone === "ink" ? "" : "focus-visible:outline-[#090B10]"}`}
          >
            <PixelIcon name="close" size={12} />
          </button>
        </div>
        {hasDescription && (
          <div
            id={descriptionId}
            className="shrink-0 px-4 py-2.5 border-b-2 border-[#2A344B] font-mono-hud text-xs leading-relaxed text-[#94A3B8]"
          >
            {description}
          </div>
        )}
        <div
          ref={bodyRef}
          // Takes focus when nothing in view inside it can, and is a Tab stop
          // while it has content to scroll, so the keyboard scrolls it; the
          // ring is inset to clear the title bar and the footer
          tabIndex={-1}
          className="min-h-0 flex-auto overflow-y-auto overscroll-contain p-4 font-mono-hud text-[13px] leading-relaxed text-[#CBD5E1] focus-visible:outline-offset-[-4px]"
        >
          {children}
        </div>
        {hasNode(footer) && (
          <div className="shrink-0 flex flex-wrap items-center justify-end gap-2 px-4 py-3 border-t-2 border-[#2A344B] bg-[#090B10]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Bottom sheet: a full-width PixelDrawer docked to the bottom edge. */
export function PixelSheet(props: PixelSheetProps) {
  return <PixelDrawer {...props} side="bottom" />;
}
