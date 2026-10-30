"use client";

import React, { useEffect, useRef } from "react";

const PALETTE_SPARKS = [
  "#FFD100",
  "#00E5FF",
  "#10B981",
  "#A855F7",
  "#FF3355",
];

/**
 * Deterministic 2D hash in [0, 1) so each pixel cell has a procedural threshold
 */
function cellHash(gx: number, gy: number, seed: number): number {
  let n = gx * 374761393 + gy * 668265263 + seed * 1442695041;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967296;
}

/**
 * Runs a procedural pixel-by-pixel construction animation on a target HTML element
 */
function runProceduralPixelMaterialize(el: HTMLElement, seed: number) {
  if (el.dataset.pxAnimating === "1") return;
  const rect = el.getBoundingClientRect();
  if (rect.width < 40 || rect.height < 32) return;

  el.dataset.pxAnimating = "1";

  const computedPos = window.getComputedStyle(el).position;
  if (computedPos === "static") {
    el.style.position = "relative";
  }

  const canvas = document.createElement("canvas");
  const blockSize = rect.width > 640 ? 16 : 12;
  const cols = Math.max(4, Math.ceil(rect.width / blockSize));
  const rows = Math.max(3, Math.ceil(rect.height / blockSize));

  canvas.width = cols;
  canvas.height = rows;
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "25";
  canvas.style.imageRendering = "pixelated";

  el.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    el.dataset.pxAnimating = "0";
    return;
  }

  const durationMs = 520;
  const startTime = performance.now();
  const accentColor =
    PALETTE_SPARKS[Math.abs(seed) % PALETTE_SPARKS.length];

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);

    ctx.clearRect(0, 0, cols, rows);

    if (progress >= 1) {
      canvas.remove();
      el.dataset.pxAnimating = "0";
      return;
    }

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
          // Active procedural construction wavefront: neon pixel blocks
          const h = cellHash(gx + 7, gy + 13, seed);
          ctx.fillStyle =
            h > 0.55 ? accentColor : h > 0.25 ? "#FFD100" : "#F5F2EB";
          ctx.fillRect(gx, gy, 1, 1);
        }
        // Once progress >= cellThreshold, pixel block is transparent (card revealed!)
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export interface PixelScrollMaterializerProps {
  /** Re-scan trigger when view or episode tab changes */
  watchKey?: string;
  /** CSS selector for cards to materialize by pixels on scroll */
  selector?: string;
}

/**
 * Global observer that procedurally generates cards pixel-by-pixel as the user scrolls
 */
export function PixelScrollMaterializer({
  watchKey = "default",
  selector = "[data-px-reveal], .px-card, .px-card-yellow, .px-card-cyan, .px-card-emerald, .px-card-coral, .px-card-violet, .px-card-chalk, article, main .rounded-2xl, main .rounded-3xl",
}: PixelScrollMaterializerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const seenInCurrentPass = new WeakSet<HTMLElement>();
    let seedCounter = 1;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (!seenInCurrentPass.has(el)) {
              seenInCurrentPass.add(el);
              runProceduralPixelMaterialize(el, seedCounter++);
            }
          } else {
            // Reset when scrolled well out of viewport so scrolling back re-generates pixels
            const r = entry.boundingClientRect;
            if (r.bottom < -80 || r.top > window.innerHeight + 80) {
              seenInCurrentPass.delete(el);
            }
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    const scanTimer = window.setTimeout(() => {
      const nodes = document.querySelectorAll<HTMLElement>(selector);
      nodes.forEach((node) => observer.observe(node));
    }, 35);

    return () => {
      window.clearTimeout(scanTimer);
      observer.disconnect();
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
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} data-px-reveal="true" className={`relative ${className}`}>
      {children}
    </div>
  );
}
