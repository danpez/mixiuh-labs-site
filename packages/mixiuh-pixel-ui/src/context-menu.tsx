"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { pixelSound } from "./sound";
import { PixelIcon, type PixelIconName } from "./icons";
import { PIXEL_TONE_STYLES, type PixelTone } from "./components";

/* ============================================================================
   CONTEXT MENU (ROADMAP PHASE 2): RIGHT-CLICK PIXEL MENU WITH ROVING FOCUS
   ============================================================================ */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ----------------------------------------------------------------------------
   PixelContextMenu — right-click / Shift+F10 menu (role="menu", typeahead)
   ---------------------------------------------------------------------------- */

export type PixelMenuItem =
  | {
      type?: "item";
      id: string;
      label: string;
      icon?: PixelIconName;
      /** Keycap hint such as "Ctrl+C". Display only: bind the key yourself. */
      shortcut?: string;
      /** Destructive action (delete, reset): coral text. */
      danger?: boolean;
      /** Still listed, but skipped by the keyboard and ignored on click. */
      disabled?: boolean;
      /**
       * Runs once the menu is gone from the page and focus is back where it
       * was, still inside the user's click or key press (clipboard, popups
       * and fullscreen keep working).
       */
      onSelect: () => void;
    }
  | { type: "separator"; id: string }
  | {
      /** Non-interactive group heading. */
      type: "label";
      id: string;
      label: string;
    };

export interface PixelContextMenuProps {
  items: PixelMenuItem[];
  /** Area that answers to right-click, Shift+F10 and the ContextMenu key. */
  children: React.ReactNode;
  /** Accessible name of the menu (default "Menu contextual"). */
  label?: string;
  tone?: PixelTone;
  /** Leave the browser's native context menu alone. */
  disabled?: boolean;
  /** Classes for the wrapper `<div>`. */
  className?: string;
}

type PixelMenuAction = Extract<PixelMenuItem, { onSelect: () => void }>;
type FocusTarget = HTMLElement | SVGElement;

interface MenuAnchor {
  /** Preferred top-left corner of the menu. */
  x: number;
  y: number;
  /** Right / bottom edge of the menu once it flips left / up. */
  flipX: number;
  flipY: number;
}

interface MenuState {
  anchor: MenuAnchor;
  left: number;
  top: number;
  /** False until measured: the first pass renders hidden at the anchor. */
  placed: boolean;
  /** Item holding DOM focus (roving focus), mirrored for styling. */
  activeId: string | null;
}

const VIEWPORT_MARGIN = 8;

const NON_TEXT_INPUTS = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

const isAction = (item: PixelMenuItem): item is PixelMenuAction =>
  item.type === undefined || item.type === "item";

const isEnabledAction = (item: PixelMenuItem): item is PixelMenuAction =>
  isAction(item) && !item.disabled;

/** Enabled action at `index` or after it, else the closest one before it. */
const nearestEnabled = (items: PixelMenuItem[], index: number) =>
  items.slice(index).find(isEnabledAction) ??
  items.slice(0, index).reverse().find(isEnabledAction);

/** Lowercase without accents, so typing "e" also reaches "Éxito". */
const foldText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

/** True when `target` is a node inside `root` (DOM tree, not React tree). */
function within(root: Element | null, target: EventTarget | null): boolean {
  return !!root && target instanceof Node && root.contains(target);
}

/** Text fields keep the native menu so paste and spellcheck still work. */
function isTextField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target instanceof HTMLTextAreaElement) {
    return true;
  }
  return target instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(target.type);
}

function asFocusTarget(el: Element | null): FocusTarget | null {
  return (el instanceof HTMLElement || el instanceof SVGElement) &&
    el !== document.body
    ? el
    : null;
}

/** Anchor at the bottom-left of `el`; flipping lines up with its other edges. */
function anchorBelow(el: Element): MenuAnchor {
  const rect = el.getBoundingClientRect();
  return { x: rect.left, y: rect.bottom, flipX: rect.right, flipY: rect.top };
}

/**
 * Top-left corner for a `width` x `height` menu: flips left / up when it would
 * overflow the right / bottom edge, then clamps inside the viewport (8px).
 */
function placeMenu(anchor: MenuAnchor, width: number, height: number) {
  const root = document.documentElement;
  const vw = root.clientWidth || window.innerWidth;
  const vh = root.clientHeight || window.innerHeight;
  const left =
    anchor.x + width > vw - VIEWPORT_MARGIN ? anchor.flipX - width : anchor.x;
  const top =
    anchor.y + height > vh - VIEWPORT_MARGIN ? anchor.flipY - height : anchor.y;
  return {
    left: Math.round(clamp(left, VIEWPORT_MARGIN, vw - VIEWPORT_MARGIN - width)),
    top: Math.round(clamp(top, VIEWPORT_MARGIN, vh - VIEWPORT_MARGIN - height)),
  };
}

/** Scrolls a menu taller than the viewport just enough to show `item`. */
function keepInView(menu: HTMLElement | null, item: HTMLElement) {
  if (!menu || menu.scrollHeight <= menu.clientHeight) return;
  const top = item.offsetTop;
  const bottom = top + item.offsetHeight;
  if (top < menu.scrollTop) menu.scrollTop = top;
  else if (bottom > menu.scrollTop + menu.clientHeight) {
    menu.scrollTop = bottom - menu.clientHeight;
  }
}

/**
 * Wraps `children` and replaces the browser context menu with a pixel menu.
 * Opens on right-click (at the pointer) or Shift+F10 / the ContextMenu key
 * (under the focused element). Arrow keys, Home/End and typeahead move a
 * roving focus; Escape, Tab, a press outside, focus moving elsewhere, scroll,
 * resize and window blur close it. Focus returns to the element focused
 * before it opened, unless a press or a script already put it elsewhere.
 */
export function PixelContextMenu({
  items,
  children,
  label = "Menu contextual",
  tone = "yellow",
  disabled = false,
  className = "",
}: PixelContextMenuProps) {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  // Where focus goes back to, and whether the current close should send it
  const restoreFocusRef = useRef<FocusTarget | null>(null);
  const restoreOnCloseRef = useRef(true);
  const focusPendingRef = useRef(false);
  // Position in `items` of the item that last held focus
  const focusIndexRef = useRef(0);

  const enabled = !disabled && items.length > 0;
  // Disabling the menu (or emptying `items`) while it is open closes it
  if (menu && !enabled) setMenu(null);
  const current = enabled ? menu : null;
  const shown = current !== null;
  const anchor = current?.anchor ?? null;

  const t = PIXEL_TONE_STYLES[tone];
  // "ink" is the panel colour itself: use the strong hairline / chalk instead
  const accent = tone === "ink" ? "#3A4560" : t.hex;
  const iconAccent = tone === "ink" ? "#F5F2EB" : t.hex;
  const hasIcons = items.some((item) => isAction(item) && !!item.icon);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    restoreOnCloseRef.current = restoreFocus;
    setMenu(null);
  }, []);

  const openMenu = (next: MenuAnchor) => {
    const active = document.activeElement;
    // Re-opening from inside the menu keeps the original return target
    if (!within(menuRef.current, active)) {
      restoreFocusRef.current = asFocusTarget(active);
    }
    restoreOnCloseRef.current = true;
    focusPendingRef.current = true;
    if (!menu) pixelSound.play("crank");
    setMenu({
      anchor: next,
      left: next.x,
      top: next.y,
      placed: false,
      activeId: null,
    });
  };

  const setActiveId = (activeId: string | null) =>
    setMenu((m) => (m && m.activeId !== activeId ? { ...m, activeId } : m));

  const focusItem = (id: string) => {
    const el = itemRefs.current.get(id);
    if (!el) return;
    el.focus({ preventScroll: true });
    keepInView(menuRef.current, el);
  };

  const selectItem = (item: PixelMenuAction) => {
    if (item.disabled) return;
    pixelSound.play("click");
    // Commit the close before onSelect (the restore effect hands focus back
    // as the menu unmounts): a dialog, print or navigation it starts never
    // sees the menu, and it still runs inside the user's gesture
    flushSync(() => closeMenu(true));
    item.onSelect();
  };

  // Measure, flip/clamp into the viewport, then focus the first enabled item.
  // When `items` change while open and that unmounts the focused item (focus
  // falls back to <body>), the enabled item now in its place takes over.
  useIsoLayoutEffect(() => {
    const menuEl = menuRef.current;
    if (!anchor || !menuEl) return;
    const { left, top } = placeMenu(
      anchor,
      menuEl.offsetWidth,
      menuEl.offsetHeight
    );
    // Write to the DOM right away so the items are visible (focusable) now
    menuEl.style.left = `${left}px`;
    menuEl.style.top = `${top}px`;
    menuEl.style.visibility = "";
    setMenu((m) =>
      m && m.anchor === anchor && (!m.placed || m.left !== left || m.top !== top)
        ? { ...m, left, top, placed: true }
        : m
    );
    const active = document.activeElement;
    const lost =
      !active ||
      active === document.body ||
      active === document.documentElement;
    if (!focusPendingRef.current && !lost) return;
    const from = focusPendingRef.current ? 0 : focusIndexRef.current;
    focusPendingRef.current = false;
    const target = nearestEnabled(items, from);
    const targetEl = target ? itemRefs.current.get(target.id) : undefined;
    (targetEl ?? menuEl).focus({ preventScroll: true });
    if (targetEl) keepInView(menuEl, targetEl);
  }, [anchor, items]);

  // Give focus back on close, but only when it would otherwise be lost
  useIsoLayoutEffect(() => {
    if (!shown) return;
    const menuEl = menuRef.current;
    return () => {
      const restore = restoreOnCloseRef.current;
      const back = restoreFocusRef.current;
      restoreOnCloseRef.current = true;
      restoreFocusRef.current = null;
      if (!restore || !back?.isConnected) return;
      const active = document.activeElement;
      if (!active || active === document.body || within(menuEl, active)) {
        back.focus({ preventScroll: true });
      }
    };
  }, [shown]);

  // Dismiss on a press or a focus move outside, a related scroll, resize and
  // window blur. Escape / Tab also work while focus sits outside the menu.
  useEffect(() => {
    if (!shown) return;
    const onPointerDown = (e: PointerEvent) => {
      // That press decides where focus goes, so no restore here
      if (!within(menuRef.current, e.target)) closeMenu(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      const menuEl = menuRef.current;
      // A script or assistive tech moved focus out: close, leave it there.
      // No menu element means it is unmounting and handing focus back.
      if (menuEl && !within(menuEl, e.target)) closeMenu(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // Keys on the menu go to its own handler; these come from outside it,
      // usually <body> after a script blurred the focused item. Capture
      // phase, so this top layer closes before a drawer underneath it.
      const menuEl = menuRef.current;
      if (
        !menuEl ||
        e.defaultPrevented ||
        e.isComposing ||
        within(menuEl, e.target)
      ) {
        return;
      }
      if (e.key === "Escape" || e.key === "Tab") {
        e.preventDefault();
        closeMenu(true);
      }
    };
    const onScroll = (e: Event) => {
      const target = e.target;
      const wrapper = wrapperRef.current;
      if (within(menuRef.current, target)) return;
      // Scrollers that cannot move the wrapped area (tickers, side panels)
      if (
        target instanceof Node &&
        wrapper &&
        !target.contains(wrapper) &&
        !wrapper.contains(target)
      ) {
        return;
      }
      closeMenu(true);
    };
    const onDismiss = () => closeMenu(true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onDismiss);
    window.addEventListener("blur", onDismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onDismiss);
      window.removeEventListener("blur", onDismiss);
    };
  }, [shown, closeMenu]);

  const onWrapperContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !enabled ||
      e.defaultPrevented ||
      !within(wrapperRef.current, e.target) ||
      isTextField(e.target)
    ) {
      return;
    }
    e.preventDefault();
    const native = e.nativeEvent as MouseEvent & { pointerType?: string };
    // Keyboard and assistive-tech invocations carry no pointer position
    const fromKeyboard =
      native.pointerType === "" || (e.clientX === 0 && e.clientY === 0);
    openMenu(
      fromKeyboard && e.target instanceof Element
        ? anchorBelow(e.target)
        : { x: e.clientX, y: e.clientY, flipX: e.clientX, flipY: e.clientY }
    );
  };

  const onWrapperKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!enabled || e.defaultPrevented) return;
    const isMenuKey =
      e.key === "ContextMenu" ||
      (e.key === "F10" && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey);
    if (
      !isMenuKey ||
      !within(wrapperRef.current, e.target) ||
      isTextField(e.target)
    ) {
      return;
    }
    e.preventDefault();
    const active = document.activeElement;
    const from =
      active && within(wrapperRef.current, active) ? active : wrapperRef.current;
    if (from) openMenu(anchorBelow(from));
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Portals bubble through the React tree: keep keys away from the
    // wrapped content's own handlers (tables, tabs, shortcuts)
    e.stopPropagation();
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      closeMenu(true);
      return;
    }
    const enabledItems = items.filter(isEnabledAction);
    const count = enabledItems.length;
    const activeEl = document.activeElement;
    const index = enabledItems.findIndex(
      (item) => itemRefs.current.get(item.id) === activeEl
    );
    if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "Home" ||
      e.key === "End"
    ) {
      e.preventDefault();
      if (count === 0) return;
      const next =
        e.key === "Home"
          ? 0
          : e.key === "End"
          ? count - 1
          : e.key === "ArrowDown"
          ? (index + 1) % count
          : index < 0
          ? count - 1
          : (index - 1 + count) % count;
      focusItem(enabledItems[next].id);
      return;
    }
    // Typeahead: next enabled item whose label starts with the typed key
    if (
      e.key.length === 1 &&
      e.key !== " " &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();
      const char = foldText(e.key);
      for (let step = 1; step <= count; step += 1) {
        const candidate = enabledItems[(index + step + count) % count];
        if (foldText(candidate.label).startsWith(char)) {
          focusItem(candidate.id);
          return;
        }
      }
    }
    // Enter / Space fall through to the native <button> click
  };

  return (
    <div
      ref={wrapperRef}
      onContextMenu={onWrapperContextMenu}
      onKeyDown={onWrapperKeyDown}
      className={className || undefined}
    >
      {children}
      {current &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            aria-orientation="vertical"
            tabIndex={-1}
            onKeyDown={onMenuKeyDown}
            // Clicks inside the menu are not clicks on the wrapped content
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Keep focus on the active item and avoid text selection
              if (e.target !== e.currentTarget) e.preventDefault();
            }}
            onFocus={(e) => {
              if (e.target === e.currentTarget) setActiveId(null);
            }}
            className="fixed z-[97] w-max min-w-[13rem] max-w-[calc(100vw-16px)] max-h-[calc(100dvh-16px)] overflow-y-auto py-1 bg-[#111622] border-2 border-[#090B10] shadow-[5px_5px_0_#040508] animate-px-pop select-none"
            style={{
              left: current.left,
              top: current.top,
              visibility: current.placed ? undefined : "hidden",
              outline: `2px solid ${accent}`,
              outlineOffset: 0,
            }}
          >
            {items.map((item, index) => {
              if (item.type === "separator") {
                return (
                  <div
                    key={item.id}
                    role="separator"
                    className="h-[2px] my-1 bg-[#2A344B]"
                  />
                );
              }
              if (item.type === "label") {
                return (
                  <div
                    key={item.id}
                    role="presentation"
                    className="pl-4 pr-3 pt-2 pb-1 font-pixel text-[9px] uppercase tracking-wider text-[#94A3B8] truncate"
                  >
                    {item.label}
                  </div>
                );
              }
              const isActive = current.activeId === item.id;
              const iconColor =
                item.disabled || item.danger
                  ? undefined
                  : isActive
                  ? iconAccent
                  : "#94A3B8";
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled ? true : undefined}
                  onClick={() => selectItem(item)}
                  onFocus={() => {
                    focusIndexRef.current = index;
                    setActiveId(item.id);
                  }}
                  onPointerMove={(e) => {
                    // Hover moves the roving focus, like a native menu
                    if (e.pointerType === "touch" || item.disabled) return;
                    if (document.activeElement !== e.currentTarget) {
                      e.currentTarget.focus({ preventScroll: true });
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left font-mono-hud text-xs leading-snug border-l-4 focus-visible:outline-offset-[-2px] ${
                    item.disabled
                      ? "border-transparent text-[#64748B] cursor-not-allowed"
                      : `cursor-pointer ${
                          isActive ? "bg-[#1A2132]" : "border-transparent"
                        } ${
                          item.danger
                            ? "text-[#FF3355]"
                            : isActive
                            ? "text-[#F5F2EB]"
                            : "text-[#CBD5E1]"
                        }`
                  }`}
                  style={isActive ? { borderLeftColor: accent } : undefined}
                >
                  {item.icon ? (
                    <PixelIcon
                      name={item.icon}
                      size={12}
                      color={iconColor}
                      className="shrink-0"
                    />
                  ) : hasIcons ? (
                    <span className="w-3 shrink-0" aria-hidden="true" />
                  ) : null}
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                  {item.shortcut && (
                    <kbd
                      className={`px-kbd ml-4 shrink-0 ${
                        item.disabled ? "opacity-50" : ""
                      }`}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
