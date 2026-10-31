/* ============================================================================
   FOCUS & MODAL HELPERS (INTERNAL): TAB STOPS, FOCUS MOVES, SCROLL LOCK
   Shared by PixelDrawer, PixelPopover, PixelContextMenu, PixelCommandPalette
   and usePixelDialog. Not exported from index.ts.
   ============================================================================ */

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
export function getTabbables(root: ParentNode): HTMLElement[] {
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
 * one too, right before its own content: it takes focus from script only
 * (tabIndex -1), but the keyboard has to reach it to scroll it.
 */
export function getPanelStops(
  panel: HTMLElement,
  body: HTMLElement | null
): HTMLElement[] {
  const stops = getTabbables(panel);
  if (body && canScroll(body)) {
    // First stop inside the body or after it (descendants count as following)
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
export function focusFirst(
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
 * Makes a subtree that just went from `visibility: hidden` to visible take
 * focus in the same tick. CSS that transitions every property (`transition:
 * all`, or the common reduced-motion snippet that cuts every transition to
 * 0.01ms) starts a visibility transition there, and Chrome then reveals the
 * subtree one tree level per frame: until its level's turn, a control still
 * computes `visibility: hidden` and focus() on it does nothing. Finishing
 * those transitions shows the whole subtree at once.
 */
export function finishVisibilityTransitions(root: Element): void {
  if (typeof root.getAnimations !== "function") return;
  // Finishing a parent's transition starts its children's at the next style
  // update (getAnimations runs one), so one round per level; capped
  for (let level = 0; level < 64; level += 1) {
    const pending = root
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          "transitionProperty" in animation &&
          animation.transitionProperty === "visibility"
      );
    if (pending.length === 0) return;
    pending.forEach((animation) => animation.finish());
  }
}

let scrollLocks = 0;
let savedOverflow = "";
let savedGutter = "";

/**
 * Stops page scrolling until the returned function runs. The lock goes on
 * <html>, not <body>: this kit gives <html> `overflow-x: clip`, and once the
 * root overflow is not `visible` the body overflow no longer reaches the
 * viewport. Counted, so stacked modals may close in any order and the
 * previous inline values come back with the last one.
 */
export function lockPageScroll(): () => void {
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
  let released = false;
  return () => {
    // A second call must not release another modal's lock
    if (released) return;
    released = true;
    scrollLocks -= 1;
    if (scrollLocks > 0) return;
    root.style.overflow = savedOverflow;
    root.style.setProperty("scrollbar-gutter", savedGutter);
  };
}
