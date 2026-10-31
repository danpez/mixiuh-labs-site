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
| `src/motion.ts` · `src/storage.ts` | `usePrefersReducedMotion()` · `usePixelPref()` (hydration-safe, tab-synced localStorage preferences). |
| `src/ambient.tsx` | Procedural AI-ecosystem background canvas (auto-disabled for reduced motion). |
| `src/cursor.tsx` | 6 pixel-art cursor presets + `usePixelCursor()`. |
| `src/scroll-reveal.tsx` | Pixel-by-pixel "materialize on scroll" observer. |
| `src/version.ts` | `PIXEL_UI_VERSION` (kept in sync with `package.json`). |

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
- `PixelCommandPalette` is a modal `role="dialog"` with a `combobox` + `listbox`, focus restore and scroll lock.
- `PixelToaster` announces messages through `aria-live="polite"`.
- `PixelDataTable` uses `aria-sort`, announces result counts and sort changes; `PixelDrawer` traps focus; `PixelContextMenu` implements the WAI-ARIA menu pattern; `PixelTooltip` wires `aria-describedby`.
- `PixelIcon` cuts its "holes" with an SVG mask, so icons stay readable in any color on any background (active states never collapse into solid blocks).
- `prefers-reduced-motion: reduce` disables the ambient canvas, the scroll materializer and CSS animations.

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
