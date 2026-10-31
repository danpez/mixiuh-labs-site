"use client";

import React, { useEffect } from "react";
import { prefersReducedMotion } from "./motion";

const PALETTE_SPARKS = [
  "#FFD100",
  "#00E5FF",
  "#10B981",
  "#A855F7",
  "#FF3355",
];

/** Elements waiting off-screen are hidden by this attribute (see pixel-ui.css). */
export const PIXEL_REVEAL_PENDING_ATTR = "data-px-reveal-pending";

const MIN_REVEAL_WIDTH = 40;
const MIN_REVEAL_HEIGHT = 32;
const REVEAL_DURATION_MS = 520;

/**
 * Deterministic 2D hash in [0, 1) so each pixel cell has a procedural threshold
 */
function cellHash(gx: number, gy: number, seed: number): number {
  let n = gx * 374761393 + gy * 668265263 + seed * 1442695041;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967296;
}

/**
 * Covers an element with a pixel matrix canvas and dissolves it with a
 * procedural wavefront. The first, fully opaque frame is drawn synchronously so
 * the caller can un-hide the element in the same task without a visible flash.
 * Returns false when the element is too small or already animating.
 */
function runProceduralPixelMaterialize(el: HTMLElement, seed: number): boolean {
  if (el.dataset.pxAnimating === "1") return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < MIN_REVEAL_WIDTH || rect.height < MIN_REVEAL_HEIGHT) return false;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  el.dataset.pxAnimating = "1";
  if (window.getComputedStyle(el).position === "static") {
    el.style.position = "relative";
  }

  const blockSize = rect.width > 640 ? 16 : 12;
  const cols = Math.max(4, Math.ceil(rect.width / blockSize));
  const rows = Math.max(3, Math.ceil(rect.height / blockSize));

  canvas.width = cols;
  canvas.height = rows;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "25";
  canvas.style.imageRendering = "pixelated";

  const accentColor = PALETTE_SPARKS[Math.abs(seed) % PALETTE_SPARKS.length];

  const draw = (progress: number) => {
    ctx.clearRect(0, 0, cols, rows);
    // Procedural diagonal + cellular wavefront construction
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const wavePos = (gx / cols) * 0.55 + (gy / rows) * 0.45;
        const jitter = (cellHash(gx, gy, seed) - 0.5) * 0.32;
        const cellThreshold = Math.max(0.02, Math.min(0.96, wavePos + jitter));

        if (progress < cellThreshold - 0.11) {
          // Unbuilt region: opaque dark pixel matrix
          ctx.fillStyle = (gx + gy) % 2 === 0 ? "#090B10" : "#0F1420";
          ctx.fillRect(gx, gy, 1, 1);
        } else if (progress < cellThreshold) {
          // Active construction wavefront: neon pixel blocks
          const h = cellHash(gx + 7, gy + 13, seed);
          ctx.fillStyle = h > 0.55 ? accentColor : h > 0.25 ? "#FFD100" : "#F5F2EB";
          ctx.fillRect(gx, gy, 1, 1);
        }
        // Built cells stay transparent: the element shows through
      }
    }
  };

  // Frame 0 is fully opaque and painted before the element becomes visible.
  // Prepended (not appended) with zeroed box so space-y / divide-y rules that
  // target :last-child or siblings never shift the card's layout.
  draw(0);
  canvas.style.margin = "0";
  canvas.style.border = "0";
  el.prepend(canvas);

  const startTime = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / REVEAL_DURATION_MS);
    if (progress >= 1 || !canvas.isConnected) {
      canvas.remove();
      el.dataset.pxAnimating = "0";
      return;
    }
    draw(progress);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return true;
}

export interface PixelScrollMaterializerProps {
  /** Re-scan trigger when view or episode tab changes */
  watchKey?: string;
  /** CSS selector for cards to materialize by pixels on scroll */
  selector?: string;
}

/**
 * Global observer that procedurally builds cards pixel-by-pixel as they scroll
 * into view. Cards that start on screen are left alone; cards below the fold
 * are hidden until the opaque pixel matrix covers them, so nothing ever flashes
 * visible and then disappears. Disabled for prefers-reduced-motion.
 */
export function PixelScrollMaterializer({
  watchKey = "default",
  selector = "[data-px-reveal], .px-card, .px-card-yellow, .px-card-cyan, .px-card-emerald, .px-card-coral, .px-card-violet, .px-card-chalk, article",
}: PixelScrollMaterializerProps) {
  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;
    if (typeof IntersectionObserver === "undefined") return;

    const armed = new Set<HTMLElement>();
    let seedCounter = 1;

    const arm = (el: HTMLElement) => {
      el.setAttribute(PIXEL_REVEAL_PENDING_ATTR, "1");
      armed.add(el);
    };
    const disarm = (el: HTMLElement) => {
      el.removeAttribute(PIXEL_REVEAL_PENDING_ATTR);
      armed.delete(el);
    };
    const isOnScreen = (r: DOMRect) =>
      r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    const isLargeEnough = (r: DOMRect) =>
      r.width >= MIN_REVEAL_WIDTH && r.height >= MIN_REVEAL_HEIGHT;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (armed.has(el)) {
              // Cover first, then un-hide in the same task: no flash
              runProceduralPixelMaterialize(el, seedCounter++);
              disarm(el);
            }
          } else {
            // Fully off-screen again: re-arm so scrolling back rebuilds it
            const r = entry.boundingClientRect;
            if (isLargeEnough(r) && el.dataset.pxAnimating !== "1") arm(el);
          }
        }
      },
      { threshold: 0 }
    );

    const scanTimer = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!isLargeEnough(r)) return;
        // Already visible on load / view switch: never hide what the user sees
        if (!isOnScreen(r)) arm(el);
        observer.observe(el);
      });
    }, 35);

    return () => {
      window.clearTimeout(scanTimer);
      observer.disconnect();
      // Never leave content hidden behind
      armed.forEach((el) => el.removeAttribute(PIXEL_REVEAL_PENDING_ATTR));
      armed.clear();
    };
  }, [watchKey, selector]);

  return null;
}

export interface PixelProceduralRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component to procedurally construct any custom block pixel-by-pixel on scroll
 */
export function PixelProceduralReveal({
  children,
  className = "",
}: PixelProceduralRevealProps) {
  return (
    <div data-px-reveal="true" className={`relative ${className}`}>
      {children}
    </div>
  );
}
