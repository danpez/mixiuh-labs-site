# `@mixiuh/pixel-ui` v1.0.0 — Mixiuh Pixel UI

> **The World's Most Complete Pixel-Art + Playdate 3D Hardware UI Library.**
> Built by **Mixiuh Labs** (`https://labs.mixiuh.online`).
> **100% Free for Commercial & Personal Use** worldwide — just credit **Mixiuh Labs** where you use it!

---

## What's Inside `@mixiuh/pixel-ui`

1. **Playdate Minimalist + 3D Hardware Contrast System (`pixel-ui.css`)**:
   - Signature high-contrast limited palette (`Signal Yellow #FFD100`, `Electric Cyan #00E5FF`, `Signal Coral #FF3355`, `Arcade Emerald #10B981`, `Argon Violet #A855F7`, `Warm Chalk #F5F2EB`, `Deep Carbon Ink #090B10`).
   - Stepped pixel corners (`.px-step-sm`, `.px-step-md`), hard offset shadows (`.px-card`, `.px-btn`), 1-bit Bayer dithering textures (`.px-dither-dots`, `.px-dither-checker`, `.px-hazard-stripe`), and 3D hardware shells (`.px-3d-console-shell`, `.px-3d-cartridge`, `.px-3d-keycap`).
2. **Procedural WebAudio 8-Bit Sound Engine (`sound.ts`)**:
   - 12 real-time procedural sound effects (`click`, `hover`, `crank`, `coin`, `powerup`, `laser`, `jump`, `hit`, `dialogBlip`, `cartridgeInsert`, `achievement`, `toggleOn`/`toggleOff`) with zero external MP3 dependencies.
3. **52 Grid-Aligned 16x16 Vector Pixel Icons & 8 Animated AI Sprites (`icons.tsx`)**:
   - Zero Unicode emojis. Every icon is rendered on a crisp `16x16` SVG grid (`shapeRendering="crispEdges"`).
4. **40+ Tactile Components, 3D Consoles & Pixel Charts (`components.tsx`)**:
   - `<Pixel3DPocketConsole />`, `<Pixel3DCartridge />`, `<PixelCrank />`, `<PixelKeycap />`, `<PixelButton />`, `<PixelToggle />`, `<PixelCard />`, `<PixelWindow />`, `<PixelDialogBox />`, `<PixelBarChart />`, `<PixelVersusBar />`, `<PixelSparkline />`, `<PixelTelemetryPill />`, and `<PixelCreditBadge />`.

---

## Quick Start

### Option A: CDN / Plain HTML
```html
<link rel="stylesheet" href="https://labs.mixiuh.online/pixel-ui/mixiuh-pixel-ui.css" />
```

### Option B: React / Next.js + Tailwind CSS
Copy the `src/lib/mixiuh-pixel-ui` folder into your project and import:
```tsx
import {
  PixelButton,
  PixelCard,
  PixelWindow,
  Pixel3DCartridge,
  PixelCrank,
  PixelBarChart,
  PixelDialogBox,
  PixelIcon,
  PixelCreditBadge,
  usePixelSound,
} from "@/lib/mixiuh-pixel-ui";
```

---

## Free Commercial & Personal License (With Attribution)

`@mixiuh/pixel-ui` is free to use in any personal, indie, studio, or commercial project worldwide as long as you include credit to **Mixiuh Labs (`https://labs.mixiuh.online`)**:

```tsx
<PixelCreditBadge variant="hardware" />
```
