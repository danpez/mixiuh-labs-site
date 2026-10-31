# `@mixiuh/pixel-ui` v2.5.0 — Mixiuh Pixel UI

> Pixel-art + Playdate 3D hardware UI library for React / Next.js + Tailwind CSS v4.
> Built by **Mixiuh Labs** (`https://labs.mixiuh.online`).
> **100% free for commercial & personal use** worldwide, with a visible credit and link back to
> **Mixiuh Labs** (`https://labs.mixiuh.online`). See [License](#license).

This folder is the **single source of truth** of the library. The Mixiuh Labs site
imports it directly (`@mixiuh/pixel-ui` path alias + `styles/pixel-ui.css`), and
`npm run pixel-ui:kit` publishes the CDN stylesheet and the downloadable ZIP to
`/public/pixel-ui/` (it also runs automatically before every `next build`).

---

## What's inside

| Module | Contents |
| --- | --- |
| `styles/pixel-ui.css` | Design tokens (`--px-*`), opaque spec cards (`.px-card-*`), tactile buttons (`.px-btn`), stepped corners, 1-bit dithering, 3D CRT / cartridge / keycap shells, `.px-kbd`, `.px-backdrop`, `.px-skip-link`, pixel focus ring and `prefers-reduced-motion` support. |
| `src/sound.ts` | Procedural WebAudio 8-bit synth: 13 SFX (`click`, `hover`, `coin`, `powerup`, `achievement`, …) + `usePixelSound()`. Zero MP3 files. |
| `src/icons.tsx` | 200+ grid-aligned 16x16 SVG icons (28 brands), 16 animated sprites, 8 scenes. `shapeRendering="crispEdges"`, zero emojis. |
| `src/components.tsx` | Buttons, keycaps, toggles, VHF crank, cards, OS windows, floppies, cartridges, 3D CRT workstation, dialog box, charts (bar, versus, sparkline, multi-line, donut), forms (input, select, autocomplete, checkbox, radio, slider), collapse, calendar, social bar, credit badge. |
| `src/overlays.tsx` (2.3) | `PixelCommandPalette` (Ctrl/Cmd+K), `PixelToaster` + `pixelToast`, `PixelTabs`, `PixelCopyButton` + `copyTextToClipboard`, `PixelBackToTop`, `PixelSwipeHint`. |
| `src/data-table.tsx` (**new in 2.5**) | `PixelDataTable` (sortable `aria-sort` columns, accent-insensitive search, pagination, CSV export via `pixelTableToCsv` / `downloadPixelCsv`). |
| `src/floating.tsx` (**new in 2.5**) | `PixelTooltip`, `PixelPopover` and the `usePixelFloating` positioning hook (flip + viewport clamp). |
| `src/drawer.tsx` (**new in 2.5**) | `PixelDrawer` (left/right/bottom modal panel with focus trap) and `PixelSheet`. |
| `src/context-menu.tsx` (**new in 2.5**) | `PixelContextMenu` (right click, Shift+F10 / Menu key, roving focus, typeahead). |
| `src/motion.ts` · `src/storage.ts` | `usePrefersReducedMotion()` · `usePixelPref()` (hydration-safe, tab-synced localStorage preferences; when storage is blocked or full, a change still applies for the rest of the visit). |
| `src/ambient.tsx` | Procedural AI-ecosystem background canvas (auto-disabled for reduced motion). |
| `src/cursor.tsx` | 5 pixel-art cursor presets plus the system cursor (`PIXEL_CURSOR_PRESETS`) + `usePixelCursor()`. |
| `src/scroll-reveal.tsx` | Pixel-by-pixel "materialize on scroll" observer. |
| `src/version.ts` | `PIXEL_UI_VERSION` (kept in sync with `package.json`). |

### Optional text & layout props

All optional: leaving one out keeps the Spanish default text or the current behaviour.

- `PixelAutocomplete`: `clearLabel` / `toggleLabel` (accessible names of the clear and open/close buttons), `emptyLabel` (text before the quoted query when nothing matches). Typing filters the list; the toggle always lists every option.
- `PixelKeycap` and `PixelCommandPalette`: `hotkey={false}` stops the page-wide key (Ctrl/Cmd+K for the palette).
- `PixelAudioSequencer`: `cellLabel(track, step)`, the accessible name of each step cell.
- `PixelFloppyCard`: `sectorLabel` / `loadLabel`, the two texts of the label footer.
- `Pixel3DCRTWorkstation`: `headerLabel`, the model plate on the monitor chassis.
- `PixelDialogBox`: `nextLabel`, the prompt beside the blinking arrow.
- `PixelMultiLineChart`: `categoryLabel` (what each x-axis point is) and `formatValue(v)` (value text in the readout and the screen-reader table, e.g. `(v) => v.toFixed(1) + "%"` keeps "42.0%"); `scrollLabel`, the name of the plot's sideways scroller, which is a focusable region only while the plot is wider than its box (defaults to `title`, else "Grafica de lineas").
- `PixelCopyButton`: `failedLabel`, the toast title when copying fails.
- `PixelDataTable`: `toolbarLayout="stacked"` gives the `toolbar` slot its own row; under 640px the search takes the full width with the export button below it. `labels.sortReset` is announced when a third press restores the original order (default "Orden original"; it is a required key of `PixelDataTableLabels`, so a full labels object needs it, while `labels` itself stays partial).
- `PixelTooltip`: `className` replaces the wrapper's default `inline-flex` (e.g. `"hidden sm:inline-flex"` when the trigger itself is hidden on phones, so the empty wrapper adds no gap).
- `PixelBackToTop`: `focusTargetId`, the id of the element that takes focus (without scrolling) before the page scrolls up, usually `<main>`, so the next Tab continues from the top of the page.
- `PixelCommandPalette`: `resultsLabel(count)`, the result count announced in a polite status region once typing pauses for 400 ms (default "1 resultado" / "N resultados"; `emptyLabel` is announced when nothing matches).
- `PixelWindow`: `minimizeLabel` / `expandLabel`, the tooltip and the start of the accessible name of the titlebar button (defaults "Minimizar ventana" / "Expandir ventana").
- `Pixel3DCRTWorkstation` items: `thumbAlt`, the alt text of the channel screenshot (defaults to the visible `title`; set it when the image has text the title doesn't say).
- `usePixelFloating` also returns `overlapsAnchor`: true when the viewport clamp leaves the floating element on top of its anchor (`PixelTooltip` then lets clicks through to the anchor).

---

## Quick start

### Option A — CDN / plain HTML (CSS classes only)

```html
<link rel="stylesheet" href="https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui.css" />

<button class="px-btn" style="background:#FFD100;padding:.6rem 1rem">PLAY</button>
<div class="px-card-cyan" style="padding:1rem">Opaque pixel spec card</div>
```

The CDN build already loads the fonts (Pixelify Sans, Silkscreen, Space Mono, Inter).

Besides the classes, the stylesheet themes the page itself: dark `html` / `body` background and
chalk text, the Inter body font, Pixelify Sans titles with a 2px drop shadow on `h1`–`h4`, smooth
scrolling with room for a sticky header, `overflow-x: clip` and yellow scrollbars. Load it on pages
meant to look like Mixiuh Pixel UI, or override those element rules after it.

### Option B — React / Next.js + Tailwind CSS v4

1. Download `https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui-kit.zip` and copy the
   `mixiuh-pixel-ui/` folder into your repo (e.g. `packages/mixiuh-pixel-ui`).
2. Point an alias at it in `tsconfig.json`:

   ```json
   { "compilerOptions": { "paths": { "@mixiuh/pixel-ui": ["./packages/mixiuh-pixel-ui/src/index.ts"] } } }
   ```

3. Import the styles and let Tailwind scan the components in your global CSS:

   ```css
   @import "tailwindcss";
   @import "../../packages/mixiuh-pixel-ui/styles/pixel-ui.css" layer(components);
   @source "../../packages/mixiuh-pixel-ui/src";
   ```

   Keep `layer(components)`: Tailwind utilities must be able to override the library. Imported
   without a layer, rules such as `.px-btn { position: relative }` beat every utility, so classes
   like `fixed` (the `PixelBackToTop` keycap) or `tracking-tight` on titles are silently ignored.

4. Use it (the components use hooks, so in the Next.js App Router this is a client component):

   ```tsx
   "use client";

   import { useState } from "react";
   import {
     PixelButton,
     PixelCard,
     PixelCommandPalette,
     PixelToaster,
     pixelToast,
     PixelCreditBadge,
   } from "@mixiuh/pixel-ui";

   export function App() {
     const [open, setOpen] = useState(false);
     return (
       <>
         <PixelCard tone="cyan" kicker="LAB 01" title="Hello, pixels">
           <PixelButton tone="yellow" icon="play" onClick={() => pixelToast.show({ title: "READY!" })}>
             Start
           </PixelButton>
         </PixelCard>
         <PixelCommandPalette
           open={open}
           onOpenChange={setOpen}
           items={[
             { id: "home", label: "Home", icon: "home", onSelect: () => pixelToast.show({ title: "HOME" }) },
           ]}
         />
         <PixelToaster />
         <PixelCreditBadge variant="hardware" />
       </>
     );
   }
   ```

Optional fonts (Next.js): expose `--font-pixelify`, `--font-pixel`, `--font-space-mono`,
`--font-inter` and `--font-poppins` with `next/font/google`; otherwise the CSS falls back to
the font family names.

---

## Accessibility

- Square, high-contrast `:focus-visible` ring on every interactive element (field wrappers show it while their input has focus).
- Form controls expose their state: `PixelToggle` is a `switch`, `PixelCheckbox` a `checkbox`, `PixelRadioGroup` a `radiogroup` with Arrow-key `radio`s; every field label is wired to its control.
- `PixelSelect` is a listbox button (Arrow / Home / End / Escape) and `PixelAutocomplete` a `combobox` (Arrow keys highlight through `aria-activedescendant`, Enter picks, Escape closes); both close when you click or tab away.
- `PixelKeycap` hotkeys ignore typing in fields, Ctrl / Cmd / Alt shortcuts and key auto-repeat (`hotkey={false}` turns them off).
- `PixelTabs` implements `role="tablist"` with Arrow / Home / End keys.
- `PixelCommandPalette` is a modal `role="dialog"` with a `combobox` + `listbox`, focus restore and scroll lock; it announces the result count after a short typing pause.
- `PixelDrawer` / `PixelSheet`, `usePixelDialog` and `PixelCommandPalette` share one modal stack: only the top modal answers Escape and Tab, and a dialog opened inside a popover or another modal keeps its own keys.
- `PixelToaster` announces messages through `aria-live="polite"`.
- `PixelDataTable` uses `aria-sort` and announces result counts and sort changes; a column button cycles ascending, descending, then back to the original order (`initialSort` or the order of `rows`). A table or chart that scrolls sideways becomes a named, focusable region only while it overflows. `PixelDrawer` traps focus; `PixelContextMenu` implements the WAI-ARIA menu pattern.
- `PixelTooltip` wires `aria-describedby`, stays open while the pointer moves onto it and closes with Escape (WCAG 1.4.13). `PixelPopover` follows its trigger when the page scrolls it away instead of sticking to the screen edge.
- `PixelWindow`'s minimize button has a full name ("Minimizar ventana: <title>") and `aria-expanded`; the CRT `PWR` button exposes `aria-pressed`.
- `PixelCollapse` titles wrap instead of being cut off; on phones `PixelMultiLineChart` scrolls the chosen point into view.
- `PixelIcon` cuts its "holes" with an SVG mask, so icons stay readable in any color on any background (active states never collapse into solid blocks).
- `prefers-reduced-motion: reduce` disables the ambient canvas, the scroll materializer and CSS animations.
- Printing (or saving as PDF) shows every card, including the ones still waiting for the scroll materializer, and hides the skip link.

## Maintaining the kit

```bash
npm run pixel-ui:kit   # regenerate public/pixel-ui/{mixiuh-pixel-ui.css,mixiuh-pixel-ui-kit.zip}
```

Bump `version` in `package.json` **and** `src/version.ts` together; the script refuses to
build when they differ. The output is deterministic, so an unchanged library leaves git clean.

---

## License

`@mixiuh/pixel-ui` is released under the **Mixiuh Open Attribution License** ([`LICENSE`](./LICENSE)):
a permissive MIT-style grant, free for any personal, indie, studio or commercial project worldwide,
with one condition. Every website, app, game, video or product that uses it must show a **visible
credit and link back to Mixiuh Labs (`https://labs.mixiuh.online`)** in its footer, its About /
Credits screen, or its public README / documentation:

```tsx
<PixelCreditBadge variant="hardware" />
```

Plain HTML / text alternative: `UI powered by Mixiuh Pixel UI — Mixiuh Labs (https://labs.mixiuh.online)`.
