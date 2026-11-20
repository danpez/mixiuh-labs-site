// renderer.js - 1920x1080 @ 60 FPS Canvas 2D renderer for The Falkirk Wheel
// Imports pure physics constants from physics.js; zero external dependencies, zero Unicode emojis.

import { FALKIRK_CONSTANTS } from './physics.js';

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

const PALETTE = Object.freeze({
  bgDeep: '#060A12',
  bgMid: '#0B1324',
  panelBg: '#0F172A',
  panelBorder: '#1E293B',
  panelBorderBright: '#334155',
  magenta: '#E879F9',
  cyan: '#22D3EE',
  emerald: '#10B981',
  amber: '#FBBF24',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  steelDark: '#172235',
  steelMid: '#2B3B54',
  steelLight: '#475569',
  steelEdge: '#94A3B8',
  waterTop: '#22D3EE',
  waterMid: '#0891B2',
  waterDeep: '#0E4D64',
});

const LAYOUT = Object.freeze({
  cx: 755,
  cy: 556,
  armRadiusPx: 232, // 12.0 m -> 464 px vertical lift = 24.0 m
  gondolaW: 214,
  gondolaH: 84,
  panelX: 1424,
  panelW: 468,
  aqueductStartX: 874,
  aqueductEndX: 1396,
  lowerCanalStartX: 98,
  lowerCanalEndX: 636,
});

function formatTorque(nm) {
  const abs = Math.abs(nm);
  if (abs < 1) return '0 N-m';
  if (abs >= 1_000_000) return `${(nm / 1_000_000).toFixed(2)} MN-m`;
  if (abs >= 1_000) return `${(nm / 1_000).toFixed(1)} kN-m`;
  return `${Math.round(nm)} N-m`;
}

function formatTorqueFull(nm) {
  const rounded = Math.round(nm);
  return `${rounded.toLocaleString('en-US')} N-m`;
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export class FalkirkRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx = canvas.getContext('2d');

    this.sloshAngle = 0;
    this.sloshVelocity = 0;

    // Precompute deterministic starfield & displacement droplets for 60 FPS zero-GC rendering
    this.stars = Array.from({ length: 48 }, (_, i) => ({
      x: ((i * 293 + 71) % 1380) + 20,
      y: ((i * 157 + 37) % 290) + 18,
      r: (i % 3) * 0.55 + 0.7,
      phase: i * 0.85,
    }));

    this.outflowParticles = Array.from({ length: 22 }, (_, i) => ({
      offset: i / 22,
      lane: (i % 5) - 2,
      size: 2.2 + (i % 3) * 1.1,
    }));
  }

  render(snapshot, dtSeconds = 1 / 60, fps = 60) {
    const ctx = this.ctx;
    const t = snapshot.elapsedTimeS || 0;

    // Gentle damped harmonic water slosh excited by wheel angular acceleration
    const targetSlosh = Math.max(-0.07, Math.min(0.07, snapshot.angularAccelDegPerS2 * 0.0018));
    const stiffness = 24;
    const damping = 5.5;
    const dt = Math.min(dtSeconds, 0.05);
    this.sloshVelocity += ((targetSlosh - this.sloshAngle) * stiffness - this.sloshVelocity * damping) * dt;
    this.sloshAngle += this.sloshVelocity * dt;

    ctx.save();
    this._drawBackdrop(ctx, t);
    this._drawElevationScale(ctx, snapshot);
    this._drawCanalsAndAqueduct(ctx, snapshot, t);
    this._drawCentralPylon(ctx);
    this._drawWheelStructureAndGears(ctx, snapshot, t);
    this._drawGondolasAndBoats(ctx, snapshot, t);
    this._drawDockTransitBoats(ctx, snapshot, t);
    this._drawHubMotorsAndTorqueArc(ctx, snapshot, t);
    this._drawHeaderBanner(ctx, snapshot);
    this._drawTelemetryPanels(ctx, snapshot, fps);
    ctx.restore();
  }

  _drawBackdrop(ctx, t) {
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    sky.addColorStop(0, '#04070E');
    sky.addColorStop(0.55, PALETTE.bgDeep);
    sky.addColorStop(1, '#091120');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle radial spotlight behind Falkirk Wheel
    const glow = ctx.createRadialGradient(
      LAYOUT.cx,
      LAYOUT.cy,
      30,
      LAYOUT.cx,
      LAYOUT.cy,
      540
    );
    glow.addColorStop(0, 'rgba(34, 211, 238, 0.075)');
    glow.addColorStop(0.5, 'rgba(15, 23, 42, 0.08)');
    glow.addColorStop(1, 'rgba(6, 10, 18, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1420, 920);

    // Subtle engineering blueprint grid
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 80; x < 1410; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 96);
      ctx.lineTo(x, 908);
      ctx.stroke();
    }
    for (let y = 120; y < 910; y += 60) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(1405, y);
      ctx.stroke();
    }

    // Subtle Scottish dusk stars
    for (const s of this.stars) {
      const alpha = 0.22 + 0.18 * Math.sin(t * 1.4 + s.phase);
      ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Silhouetted Scottish hills of Falkirk in deep background
    ctx.fillStyle = '#0A1324';
    ctx.beginPath();
    ctx.moveTo(0, 860);
    ctx.quadraticCurveTo(220, 710, 460, 770);
    ctx.quadraticCurveTo(720, 680, 990, 745);
    ctx.quadraticCurveTo(1220, 650, 1420, 725);
    ctx.lineTo(1420, 912);
    ctx.lineTo(0, 912);
    ctx.closePath();
    ctx.fill();

    // Horizon embankment line
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(24, 910);
    ctx.lineTo(1896, 910);
    ctx.stroke();
  }

  _drawElevationScale(ctx, snapshot) {
    const x = 58;
    const yTop = LAYOUT.cy - LAYOUT.armRadiusPx; // +24 m
    const yBottom = LAYOUT.cy + LAYOUT.armRadiusPx; // 0 m

    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, yTop);
    ctx.lineTo(x, yBottom);
    ctx.stroke();

    ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let m = 0; m <= 24; m += 4) {
      const py = yBottom - (m / 24) * (yBottom - yTop);
      ctx.strokeStyle = m === 0 || m === 24 ? PALETTE.cyan : 'rgba(148, 163, 184, 0.35)';
      ctx.beginPath();
      ctx.moveTo(x - 7, py);
      ctx.lineTo(x + 7, py);
      ctx.stroke();

      ctx.fillStyle = m === 0 || m === 24 ? PALETTE.textPrimary : PALETTE.textMuted;
      ctx.fillText(`${m}m`, x - 11, py);
    }

    // 24 m span badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    roundedRectPath(ctx, 18, LAYOUT.cy - 15, 62, 30, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
    ctx.stroke();
    ctx.fillStyle = PALETTE.cyan;
    ctx.textAlign = 'center';
    ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('24.0 m', 49, LAYOUT.cy);

    // Live Gondola A & B altitude markers
    const yA = yBottom - (snapshot.gondolaA.heightM / 24) * (yBottom - yTop);
    const yB = yBottom - (snapshot.gondolaB.heightM / 24) * (yBottom - yTop);

    this._drawAltitudePointer(ctx, x + 8, yA, 'A', PALETTE.magenta);
    this._drawAltitudePointer(ctx, x + 8, yB, 'B', PALETTE.cyan);
    ctx.restore();
  }

  _drawAltitudePointer(ctx, x, y, label, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y - 6);
    ctx.lineTo(x + 26, y - 6);
    ctx.lineTo(x + 26, y + 6);
    ctx.lineTo(x + 8, y + 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.bgDeep;
    ctx.font = '800 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 17, y + 0.5);
  }

  _drawCanalsAndAqueduct(ctx, snapshot, t) {
    const yTopCenter = LAYOUT.cy - LAYOUT.armRadiusPx; // 324
    const yBottomCenter = LAYOUT.cy + LAYOUT.armRadiusPx; // 788

    // --- 1. UPPER UNION CANAL AQUEDUCT (RIGHT SIDE) ---
    const aqX0 = LAYOUT.aqueductStartX;
    const aqX1 = LAYOUT.aqueductEndX;
    const aqWaterY = yTopCenter - 4; // Coplanar with top gondola equilibrium waterline (320 px)
    const aqTopY = aqWaterY - 12;
    const aqBotY = yTopCenter + 36;

    // Iconic curved Scottish concrete aqueduct piers
    const pierXs = [985, 1155, 1325];
    for (const px of pierXs) {
      const pierGrad = ctx.createLinearGradient(px - 22, aqBotY, px + 22, 865);
      pierGrad.addColorStop(0, '#27354C');
      pierGrad.addColorStop(0.5, '#192438');
      pierGrad.addColorStop(1, '#0D1524');
      ctx.fillStyle = pierGrad;

      ctx.beginPath();
      ctx.moveTo(px - 28, aqBotY);
      ctx.quadraticCurveTo(px - 18, aqBotY + 120, px - 14, 868);
      ctx.lineTo(px + 14, 868);
      ctx.quadraticCurveTo(px + 18, aqBotY + 120, px + 28, aqBotY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sculptural arch rib under aqueduct deck
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px - 75, aqBotY);
      ctx.quadraticCurveTo(px, aqBotY + 46, px + 75, aqBotY);
      ctx.stroke();
    }

    // Aqueduct structural concrete trough back wall
    const troughGrad = ctx.createLinearGradient(0, aqTopY, 0, aqBotY + 14);
    troughGrad.addColorStop(0, '#334155');
    troughGrad.addColorStop(0.5, '#1E293B');
    troughGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = troughGrad;
    ctx.fillRect(aqX0, aqTopY - 8, aqX1 - aqX0, aqBotY - aqTopY + 22);

    // Upper aqueduct water (exact level match with upper gondola)
    this._drawAnimatedWater(ctx, aqX0 + 4, aqWaterY, aqX1 - aqX0 - 4, aqBotY - aqWaterY, t, 1.0);

    // Ambient boat on upper aqueduct when wheel is rotating
    if (!snapshot.dock.isDocking) {
      const aqStart = LAYOUT.aqueductStartX + 40;
      const aqEnd = LAYOUT.aqueductEndX - 65;
      const cruise = (t * 28) % 360;
      const bx = aqEnd - 30 - Math.abs(180 - cruise) * 1.1;
      const dir = cruise < 180 ? -1 : 1;
      this._drawCanalBoat(ctx, Math.max(aqStart + 70, bx), aqWaterY + 2, 95, PALETTE.cyan, dir, t);
    }

    // Aqueduct top railing & concrete flange
    ctx.fillStyle = '#475569';
    ctx.fillRect(aqX0, aqBotY + 6, aqX1 - aqX0, 8);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(aqX0, aqTopY - 8);
    ctx.lineTo(aqX1, aqTopY - 8);
    ctx.stroke();

    // Aqueduct watertight hydraulic seal gate
    this._drawHydraulicGate(
      ctx,
      aqX0 - 4,
      aqTopY + 2,
      10,
      aqBotY - aqTopY + 2,
      snapshot.dock.gateOpenness,
      snapshot.archimedesEnabled
    );

    // Label for Upper Union Canal
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    roundedRectPath(ctx, aqX0 + 48, aqTopY - 46, 286, 28, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = PALETTE.cyan;
    ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('ACUEDUCTO UNION CANAL  (+24.0 m)', aqX0 + 60, aqTopY - 32);

    // --- 2. LOWER FORTH & CLYDE CANAL BASIN (LEFT SIDE) ---
    const lcX0 = LAYOUT.lowerCanalStartX;
    const lcX1 = LAYOUT.lowerCanalEndX;
    const lcTopY = yBottomCenter - 4; // Coplanar with lower gondola equilibrium waterline (784 px)
    const lcBotY = 866;

    // Canal basin masonry walls
    ctx.fillStyle = '#172235';
    ctx.fillRect(lcX0 - 6, lcTopY - 12, lcX1 - lcX0 + 12, lcBotY - lcTopY + 28);

    // Lower canal water
    this._drawAnimatedWater(ctx, lcX0, lcTopY, lcX1 - lcX0, lcBotY - lcTopY, t + 1.7, -0.7);

    // Ambient boat in lower basin when wheel is rotating
    if (!snapshot.dock.isDocking) {
      const sway = Math.sin(t * 0.7) * 55;
      this._drawCanalBoat(ctx, 310 + sway, lcTopY + 2, 120, PALETTE.magenta, 1, t);
    }

    // Lower canal hydraulic seal gate (separating basin from wheel dry well)
    this._drawHydraulicGate(
      ctx,
      lcX1 - 4,
      lcTopY - 8,
      10,
      58,
      snapshot.dock.gateOpenness,
      snapshot.archimedesEnabled
    );

    // Real Falkirk Wheel Pumped Dry Well directly beneath the rotating wheel
    const pitX = lcX1 + 6;
    const pitW = LAYOUT.aqueductStartX - pitX - 4;
    ctx.fillStyle = '#070C17';
    ctx.fillRect(pitX, 838, pitW, 56);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(pitX, 838, pitW, 56);

    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POZO SECO (DRENAJE SIN ARRASTRE HIDRODINAMICO)', pitX + pitW * 0.5, 876);

    // Label for Lower Forth & Clyde Canal
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    roundedRectPath(ctx, lcX0 + 14, lcTopY - 46, 304, 28, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = PALETTE.cyan;
    ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CANAL FORTH & CLYDE  (0.0 m)', lcX0 + 26, lcTopY - 32);

    // Ground slab foundation line
    ctx.fillStyle = '#111B2E';
    ctx.fillRect(lcX0 - 12, 866, lcX1 - lcX0 + 18, 28);
    ctx.fillRect(LAYOUT.aqueductStartX - 2, 866, 526, 28);
  }

  _drawAnimatedWater(ctx, x, y, w, h, t, flowDir = 1) {
    const waterGrad = ctx.createLinearGradient(0, y, 0, y + h);
    waterGrad.addColorStop(0, 'rgba(34, 211, 238, 0.72)');
    waterGrad.addColorStop(0.28, 'rgba(8, 145, 178, 0.78)');
    waterGrad.addColorStop(1, 'rgba(14, 77, 100, 0.92)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y);
    const steps = Math.max(12, Math.floor(w / 18));
    for (let i = 0; i <= steps; i++) {
      const px = x + (i / steps) * w;
      const wave = Math.sin(px * 0.045 - t * 3.1 * flowDir) * 2.2 + Math.cos(px * 0.09 + t * 2.0) * 1.1;
      ctx.lineTo(px, y + wave);
    }
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fillStyle = waterGrad;
    ctx.fill();

    // Specular crest highlight
    ctx.strokeStyle = 'rgba(165, 243, 252, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const px = x + (i / steps) * w;
      const wave = Math.sin(px * 0.045 - t * 3.1 * flowDir) * 2.2 + Math.cos(px * 0.09 + t * 2.0) * 1.1;
      if (i === 0) ctx.moveTo(px, y + wave);
      else ctx.lineTo(px, y + wave);
    }
    ctx.stroke();
    ctx.restore();
  }

  _drawHydraulicGate(ctx, x, y, w, h, openness, archimedesEnabled) {
    const retracted = openness * (h - 6);
    const gateColor = !archimedesEnabled ? PALETTE.amber : openness > 0.2 ? PALETTE.emerald : '#64748B';
    ctx.save();
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x, y + retracted, w, h - retracted);
    ctx.strokeStyle = gateColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + retracted, w, h - retracted);

    // Indicator light on gate top
    ctx.fillStyle = gateColor;
    ctx.beginPath();
    ctx.arc(x + w * 0.5, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawDockTransitBoats(ctx, snapshot, t) {
    const dock = snapshot.dock;
    if (!dock.isDocking) return;
    if (dock.stage !== 'BOATS_EXITING' && dock.stage !== 'BOATS_ENTERING') return;

    const yTopWater = LAYOUT.cy - LAYOUT.armRadiusPx - 2;
    const yBottomWater = LAYOUT.cy + LAYOUT.armRadiusPx - 2;
    const aqEnd = LAYOUT.aqueductEndX - 65;
    const lcLeft = LAYOUT.lowerCanalStartX + 80;

    const topMass =
      dock.topGondolaId === 'A' ? snapshot.boatAMassTonnes : snapshot.boatBMassTonnes;
    const topAccent = dock.topGondolaId === 'A' ? PALETTE.magenta : PALETTE.cyan;

    const botMass =
      dock.bottomGondolaId === 'A' ? snapshot.boatAMassTonnes : snapshot.boatBMassTonnes;
    const botAccent = dock.bottomGondolaId === 'A' ? PALETTE.magenta : PALETTE.cyan;

    if (topMass > 0) {
      if (dock.stage === 'BOATS_EXITING') {
        const bx = LAYOUT.cx + dock.exitProgress * (aqEnd - LAYOUT.cx);
        this._drawCanalBoat(ctx, bx, yTopWater, topMass, topAccent, 1, t);
      } else if (dock.stage === 'BOATS_ENTERING') {
        const bx = aqEnd - dock.enterProgress * (aqEnd - LAYOUT.cx);
        this._drawCanalBoat(ctx, bx, yTopWater, topMass, topAccent, -1, t);
      }
    }

    if (botMass > 0) {
      if (dock.stage === 'BOATS_EXITING') {
        const bx = LAYOUT.cx - dock.exitProgress * (LAYOUT.cx - lcLeft);
        this._drawCanalBoat(ctx, bx, yBottomWater, botMass, botAccent, -1, t);
      } else if (dock.stage === 'BOATS_ENTERING') {
        const bx = lcLeft + dock.enterProgress * (LAYOUT.cx - lcLeft);
        this._drawCanalBoat(ctx, bx, yBottomWater, botMass, botAccent, 1, t);
      }
    }
  }

  _drawCentralPylon(ctx) {
    const { cx, cy } = LAYOUT;
    ctx.save();
    // Rear structural steel-and-concrete A-frame support holding the central axle
    const pylonGrad = ctx.createLinearGradient(cx - 80, cy, cx + 80, 880);
    pylonGrad.addColorStop(0, '#1E2B42');
    pylonGrad.addColorStop(1, '#0B1322');
    ctx.fillStyle = pylonGrad;

    ctx.beginPath();
    ctx.moveTo(cx - 42, cy + 20);
    ctx.lineTo(cx - 72, 875);
    ctx.lineTo(cx + 72, 875);
    ctx.lineTo(cx + 42, cy + 20);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Circular architectural guide ring (35 m outer sweep indicator)
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
    ctx.setLineDash([8, 10]);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(cx, cy, LAYOUT.armRadiusPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  _drawWheelStructureAndGears(ctx, snapshot, t) {
    const { cx, cy, armRadiusPx: R } = LAYOUT;
    const thetaRad = (snapshot.wheelAngleDeg * Math.PI) / 180;
    const gears = snapshot.gears;

    ctx.save();
    ctx.translate(cx, cy);
    // Positive Canvas rotate moves (0, +R) -> (-R, 0) -> (0, -R), matching physics.js exactly
    ctx.rotate(thetaRad);

    // --- 1. ICONIC CELTIC DOUBLE-HEADED AXE ARMS ---
    this._drawCelticAxeArmHalf(ctx, R, 1, snapshot.archimedesEnabled);
    this._drawCelticAxeArmHalf(ctx, R, -1, snapshot.archimedesEnabled);

    // Central mechanical gear-train cutaway housing spine
    const spineW = 148;
    const spineH = R * 2 + 12;
    const spineGrad = ctx.createLinearGradient(-spineW * 0.5, 0, spineW * 0.5, 0);
    spineGrad.addColorStop(0, '#09101E');
    spineGrad.addColorStop(0.5, '#0D172B');
    spineGrad.addColorStop(1, '#09101E');
    ctx.fillStyle = spineGrad;
    roundedRectPath(ctx, -spineW * 0.5, -R - 6, spineW, spineH, 74);
    ctx.fill();

    ctx.strokeStyle = snapshot.archimedesEnabled
      ? 'rgba(34, 211, 238, 0.32)'
      : 'rgba(232, 121, 249, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // --- 2. FIVE PRECISION MESHING PLANETARY GEARS ---
    // Exact pitch radii: rCenter + rIdler = 0.5 * R, rIdler + rGondola = 0.5 * R
    const rCenter = R * 0.28; // 28T
    const rIdler = R * 0.22;  // 22T
    const rGondola = R * 0.28; // 28T

    const centerRelRad = (gears.centerGearRelDeg * Math.PI) / 180;
    const idlerRelRad = (gears.idlerGearRelDeg * Math.PI) / 180;
    const gondolaRelRad = (gears.gondolaGearRelDeg * Math.PI) / 180;

    // Outer Gondola A ring gear (at +R) and Gondola B ring gear (at -R)
    this._drawGear(ctx, 0, R, rGondola, gears.zGondola, gondolaRelRad, {
      fill: '#1A2740',
      stroke: PALETTE.magenta,
      hubColor: PALETTE.magenta,
      label: '28T',
    });
    this._drawGear(ctx, 0, -R, rGondola, gears.zGondola, gondolaRelRad, {
      fill: '#1A2740',
      stroke: PALETTE.cyan,
      hubColor: PALETTE.cyan,
      label: '28T',
    });

    // Two intermediate Idler gears (at +0.5*R and -0.5*R)
    this._drawGear(ctx, 0, R * 0.5, rIdler, gears.zIdler, idlerRelRad, {
      fill: '#232018',
      stroke: PALETTE.amber,
      hubColor: PALETTE.amber,
      label: '22T',
    });
    this._drawGear(ctx, 0, -R * 0.5, rIdler, gears.zIdler, idlerRelRad, {
      fill: '#232018',
      stroke: PALETTE.amber,
      hubColor: PALETTE.amber,
      label: '22T',
    });

    // Center stationary Sun gear (fixed to pylon at 0 deg world angle)
    this._drawGear(ctx, 0, 0, rCenter, gears.zCenter, centerRelRad, {
      fill: '#14262E',
      stroke: PALETTE.emerald,
      hubColor: PALETTE.emerald,
      label: '28T',
    });

    // Subtle structural diagonal tension struts linking outer axe blades to hub
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 2;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-66, 0);
      ctx.lineTo(-108, dir * (R - 22));
      ctx.moveTo(66, 0);
      ctx.lineTo(108, dir * (R - 22));
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawCelticAxeArmHalf(ctx, R, dir, archimedesEnabled) {
    // Sweeping sculptural Celtic axe-head blade silhouette on each end of the wheel
    const bladeGrad = ctx.createLinearGradient(-190, dir * (R * 0.4), 190, dir * (R + 90));
    bladeGrad.addColorStop(0, '#1B2840');
    bladeGrad.addColorStop(0.5, '#334666');
    bladeGrad.addColorStop(1, '#1A253B');

    ctx.save();
    ctx.fillStyle = bladeGrad;
    ctx.beginPath();
    ctx.moveTo(-74, 0);
    ctx.bezierCurveTo(-92, dir * (R * 0.45), -165, dir * (R * 0.65), -204, dir * (R + 28));
    // Sweeping curved horn tip
    ctx.quadraticCurveTo(-150, dir * (R + 82), -95, dir * (R + 68));
    ctx.quadraticCurveTo(0, dir * (R + 94), 95, dir * (R + 68));
    ctx.quadraticCurveTo(150, dir * (R + 82), 204, dir * (R + 28));
    ctx.bezierCurveTo(165, dir * (R * 0.65), 92, dir * (R * 0.45), 74, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = archimedesEnabled
      ? 'rgba(148, 163, 184, 0.48)'
      : 'rgba(251, 191, 36, 0.55)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Inner sculptural lightening cutout crescents near horn tips
    ctx.fillStyle = PALETTE.bgDeep;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 124, dir * (R - 14));
      ctx.quadraticCurveTo(side * 165, dir * (R + 12), side * 168, dir * (R + 34));
      ctx.quadraticCurveTo(side * 138, dir * (R + 48), side * 116, dir * (R + 26));
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawGear(ctx, gx, gy, pitchRadius, teethCount, angleRad, style) {
    const outerR = pitchRadius + 6.5;
    const rootR = pitchRadius - 5.5;
    const step = (Math.PI * 2) / teethCount;

    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(angleRad);

    // Gear tooth silhouette
    ctx.beginPath();
    for (let i = 0; i < teethCount; i++) {
      const a0 = i * step;
      const a1 = a0 + step * 0.18;
      const a2 = a0 + step * 0.32;
      const a3 = a0 + step * 0.68;
      const a4 = a0 + step * 0.82;

      const p0x = Math.cos(a0) * outerR;
      const p0y = Math.sin(a0) * outerR;
      if (i === 0) ctx.moveTo(p0x, p0y);
      else ctx.lineTo(p0x, p0y);

      ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
      ctx.lineTo(Math.cos(a2) * rootR, Math.sin(a2) * rootR);
      ctx.lineTo(Math.cos(a3) * rootR, Math.sin(a3) * rootR);
      ctx.lineTo(Math.cos(a4) * outerR, Math.sin(a4) * outerR);
    }
    ctx.closePath();
    ctx.fillStyle = style.fill;
    ctx.fill();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Inner web ring & 6 machined radial spokes so rotation speed is visually obvious
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, rootR - 6, 0, Math.PI * 2);
    ctx.stroke();

    for (let s = 0; s < 6; s++) {
      const sa = (s * Math.PI) / 3;
      ctx.strokeStyle = s === 0 ? style.stroke : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = s === 0 ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sa) * 11, Math.sin(sa) * 11);
      ctx.lineTo(Math.cos(sa) * (rootR - 7), Math.sin(sa) * (rootR - 7));
      ctx.stroke();
    }

    // Center bearing hub
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = style.hubColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  _drawGondolasAndBoats(ctx, snapshot, t) {
    const scale = LAYOUT.armRadiusPx / FALKIRK_CONSTANTS.ARM_RADIUS_M;

    const posA = {
      x: LAYOUT.cx + snapshot.gondolaA.positionM.x * scale,
      y: LAYOUT.cy - snapshot.gondolaA.positionM.y * scale,
    };
    const posB = {
      x: LAYOUT.cx + snapshot.gondolaB.positionM.x * scale,
      y: LAYOUT.cy - snapshot.gondolaB.positionM.y * scale,
    };

    const dock = snapshot.dock;
    const hideBoatA =
      dock.isDocking &&
      (dock.stage === 'BOATS_EXITING' || dock.stage === 'BOATS_ENTERING');
    const hideBoatB = hideBoatA;

    this._drawSingleGondola(ctx, {
      id: 'A',
      x: posA.x,
      y: posA.y,
      accent: PALETTE.magenta,
      gondola: snapshot.gondolaA,
      archimedesEnabled: snapshot.archimedesEnabled,
      hideBoatDuringTransit: hideBoatA,
      displacementPulse: dock.isDocking ? dock.displacementPulse : 0,
      isAtTop: snapshot.gondolaA.heightM > 12,
      t,
    });

    this._drawSingleGondola(ctx, {
      id: 'B',
      x: posB.x,
      y: posB.y,
      accent: PALETTE.cyan,
      gondola: snapshot.gondolaB,
      archimedesEnabled: snapshot.archimedesEnabled,
      hideBoatDuringTransit: hideBoatB,
      displacementPulse: dock.isDocking ? dock.displacementPulse : 0,
      isAtTop: snapshot.gondolaB.heightM > 12,
      t,
    });
  }

  _drawSingleGondola(ctx, opts) {
    const {
      id,
      x,
      y,
      accent,
      gondola,
      archimedesEnabled,
      hideBoatDuringTransit,
      displacementPulse,
      isAtTop,
      t,
    } = opts;

    const w = LAYOUT.gondolaW;
    const h = LAYOUT.gondolaH;
    const left = x - w * 0.5;
    const top = y - h * 0.5;

    ctx.save();
    // Gondola NEVER tilts (0.00 deg guaranteed by planetary gears)

    // Outer steel cradle shell
    const shellGrad = ctx.createLinearGradient(left, top, left, top + h);
    shellGrad.addColorStop(0, '#2A3954');
    shellGrad.addColorStop(0.5, '#172236');
    shellGrad.addColorStop(1, '#0C1424');

    roundedRectPath(ctx, left - 6, top - 4, w + 12, h + 10, 14);
    ctx.fillStyle = shellGrad;
    ctx.fill();
    ctx.strokeStyle = !archimedesEnabled && gondola.excessMassTonnes > 0 ? PALETTE.amber : accent;
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Cutaway dark interior basin
    const innerX = left + 6;
    const innerY = top + 6;
    const innerW = w - 12;
    const innerH = h - 12;

    roundedRectPath(ctx, innerX, innerY, innerW, innerH, 8);
    ctx.save();
    ctx.clip();

    ctx.fillStyle = '#070E1C';
    ctx.fillRect(innerX, innerY, innerW, innerH);

    // Equilibrium water height (500 t mark) is 58% of basin height;
    // when Archimedes OFF, locked water rises visibly up to 88%!
    const eqWaterFrac = 0.56;
    const actualWaterFrac = Math.min(0.92, eqWaterFrac * gondola.waterLevelRatio);
    const eqLineY = innerY + innerH * (1 - eqWaterFrac);
    const waterSurfaceY = innerY + innerH * (1 - actualWaterFrac);

    // Draw gondola water with subtle horizontal slosh
    const waterGrad = ctx.createLinearGradient(0, waterSurfaceY, 0, innerY + innerH);
    if (!archimedesEnabled && gondola.excessMassTonnes > 0) {
      waterGrad.addColorStop(0, 'rgba(251, 191, 36, 0.78)');
      waterGrad.addColorStop(0.28, 'rgba(34, 211, 238, 0.78)');
      waterGrad.addColorStop(1, 'rgba(14, 77, 100, 0.94)');
    } else {
      waterGrad.addColorStop(0, 'rgba(34, 211, 238, 0.8)');
      waterGrad.addColorStop(0.35, 'rgba(8, 145, 178, 0.85)');
      waterGrad.addColorStop(1, 'rgba(14, 77, 100, 0.95)');
    }

    ctx.beginPath();
    ctx.moveTo(innerX, innerY + innerH);
    const sloshDy = Math.tan(this.sloshAngle) * (innerW * 0.5);
    const segs = 16;
    for (let i = 0; i <= segs; i++) {
      const frac = i / segs;
      const px = innerX + frac * innerW;
      const tiltOffset = (frac - 0.5) * 2 * sloshDy;
      const ripple = Math.sin(frac * 12 + t * 4.2 + (id === 'A' ? 0 : 2)) * 1.4;
      ctx.lineTo(px, waterSurfaceY + tiltOffset + ripple);
    }
    ctx.lineTo(innerX + innerW, innerY + innerH);
    ctx.closePath();
    ctx.fillStyle = waterGrad;
    ctx.fill();

    // Draw boat floating inside the gondola
    if (!hideBoatDuringTransit && gondola.boatMassTonnes > 0) {
      this._drawCanalBoat(ctx, x, waterSurfaceY + 2, gondola.boatMassTonnes, accent, isAtTop ? 1 : -1, t);
    }

    // Water surface crest line
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.9)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const frac = i / segs;
      const px = innerX + frac * innerW;
      const tiltOffset = (frac - 0.5) * 2 * sloshDy;
      const ripple = Math.sin(frac * 12 + t * 4.2 + (id === 'A' ? 0 : 2)) * 1.4;
      if (i === 0) ctx.moveTo(px, waterSurfaceY + tiltOffset + ripple);
      else ctx.lineTo(px, waterSurfaceY + tiltOffset + ripple);
    }
    ctx.stroke();

    // Dashed equilibrium 500 t waterline reference
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(innerX + 2, eqLineY);
    ctx.lineTo(innerX + innerW - 2, eqLineY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore(); // end clip

    // Locked-gate hazard clamps when Archimedes OFF
    if (!archimedesEnabled) {
      ctx.fillStyle = PALETTE.amber;
      ctx.fillRect(left - 8, top + 12, 6, h - 24);
      ctx.fillRect(left + w + 2, top + 12, 6, h - 24);
    }

    // Archimedes water displacement outflow particles during boat boarding
    if (archimedesEnabled && displacementPulse > 0.05 && gondola.displacedWaterTonnes > 0) {
      const flowDir = isAtTop ? 1 : -1;
      const gateX = isAtTop ? left + w + 6 : left - 6;
      ctx.save();
      for (const p of this.outflowParticles) {
        const prog = (p.offset + t * 1.6) % 1;
        const px = gateX + flowDir * prog * 68;
        const py = y + 4 + p.lane * 5 + Math.sin(prog * 8) * 3;
        const alpha = (1 - prog) * displacementPulse * 0.9;
        ctx.fillStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      // Outflow badge
      const tagX = isAtTop ? gateX + 10 : gateX - 134;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      roundedRectPath(ctx, tagX, top - 28, 126, 22, 5);
      ctx.fill();
      ctx.strokeStyle = PALETTE.cyan;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = PALETTE.cyan;
      ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`-${Math.round(gondola.displacedWaterTonnes)} t AGUA`, tagX + 63, top - 17);
      ctx.restore();
    }

    // Gondola ID badge (top-left corner)
    ctx.fillStyle = accent;
    roundedRectPath(ctx, left - 4, top - 16, 30, 22, 6);
    ctx.fill();
    ctx.fillStyle = PALETTE.bgDeep;
    ctx.font = '800 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(id, left + 11, top - 5);

    // Live total weight pill below gondola
    const isOverloaded = !archimedesEnabled && gondola.excessMassTonnes > 0;
    const pillW = isOverloaded ? 196 : 164;
    const pillX = x - pillW * 0.5;
    const pillY = top + h + 10;

    ctx.fillStyle = 'rgba(6, 10, 18, 0.92)';
    roundedRectPath(ctx, pillX, pillY, pillW, 26, 7);
    ctx.fill();
    ctx.strokeStyle = isOverloaded ? PALETTE.amber : PALETTE.emerald;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isOverloaded ? PALETTE.amber : PALETTE.textPrimary;
    const labelText = isOverloaded
      ? `${gondola.totalMassTonnes.toFixed(0)} t (+${gondola.excessMassTonnes.toFixed(0)} t)`
      : `${gondola.totalMassTonnes.toFixed(1)} t  (EQ)`;
    ctx.fillText(labelText, x, pillY + 13.5);

    ctx.restore();
  }

  _drawCanalBoat(ctx, cx, waterY, massTonnes, accent, facing = 1, t = 0) {
    // Scale boat length & draft realistically by tonnage (40..250 t)
    const norm = Math.max(0.15, Math.min(1, massTonnes / 250));
    const len = 76 + norm * 78;
    const hullH = 11 + norm * 10;
    const draft = 5 + norm * 11; // Deeper immersion for heavier vessels (Archimedes!)
    const bob = Math.sin(t * 2.8 + cx * 0.02) * 1.1;

    ctx.save();
    ctx.translate(cx, waterY + bob);
    ctx.scale(facing, 1);

    const half = len * 0.5;
    const deckY = draft - hullH;

    // Hull body
    ctx.beginPath();
    ctx.moveTo(-half + 6, draft);
    ctx.lineTo(half - 10, draft);
    ctx.quadraticCurveTo(half + 2, draft - 2, half + 6, deckY);
    ctx.lineTo(-half, deckY);
    ctx.quadraticCurveTo(-half + 1, draft - 2, -half + 6, draft);
    ctx.closePath();
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Accent stripe along hull gunwale
    ctx.fillStyle = accent;
    ctx.fillRect(-half + 3, deckY + 2, len - 4, 3.5);

    // Scottish narrowboat / barge superstructure cabin
    const cabinW = len * 0.58;
    const cabinH = 13 + norm * 5;
    const cabinX = -cabinW * 0.56;
    const cabinY = deckY - cabinH;

    roundedRectPath(ctx, cabinX, cabinY, cabinW, cabinH, 4);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Illuminated cabin portholes
    const windows = Math.max(3, Math.floor(cabinW / 18));
    ctx.fillStyle = '#FEF08A';
    for (let i = 0; i < windows; i++) {
      const wx = cabinX + 8 + i * ((cabinW - 18) / Math.max(1, windows - 1));
      ctx.fillRect(wx, cabinY + 4, 7, 5);
    }

    // Small wheelhouse & navigation beacon at bow
    ctx.fillStyle = '#475569';
    ctx.fillRect(cabinX + cabinW - 14, cabinY - 6, 13, 6);
    ctx.fillStyle = PALETTE.amber;
    ctx.beginPath();
    ctx.arc(half + 2, deckY - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Subtle tonnage tag printed on cabin side
    ctx.scale(facing, 1); // Keep text readable regardless of direction
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.font = '700 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(massTonnes)}t`, 0, deckY - cabinH - 8);

    ctx.restore();
  }

  _drawHubMotorsAndTorqueArc(ctx, snapshot, t) {
    const { cx, cy } = LAYOUT;
    const balanced = snapshot.archimedesEnabled || snapshot.torqueImbalanceNm < 1000;

    ctx.save();
    ctx.translate(cx, cy);

    // 10 radial hydraulic motor housings around the main axle (authentic Falkirk Wheel detail)
    const motorRingR = 36;
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2) / 10;
      const mx = Math.cos(a) * motorRingR;
      const my = Math.sin(a) * motorRingR;
      const pulse = 0.65 + 0.35 * Math.sin(t * (balanced ? 3 : 10) + i * 0.6);

      ctx.fillStyle = balanced
        ? `rgba(16, 185, 129, ${pulse.toFixed(2)})`
        : `rgba(232, 121, 249, ${pulse.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(mx, my, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central axle cap
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = balanced ? PALETTE.emerald : PALETTE.magenta;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = balanced ? PALETTE.emerald : PALETTE.amber;
    ctx.font = '800 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EJE', 0, 0.5);

    // Live Torque Imbalance Vector Arc around hub
    const arcR = 94;
    if (balanced) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, arcR, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const maxRefTorque = 25_000_000;
      const frac = Math.min(1, snapshot.torqueImbalanceNm / maxRefTorque);
      const sweep = Math.max(0.28, frac * Math.PI * 1.45);
      const sign = snapshot.signedTorqueImbalanceNm >= 0 ? -1 : 1; // Opposing gravity arrow
      const startA = -Math.PI * 0.5;
      const endA = startA + sign * sweep;

      ctx.strokeStyle = PALETTE.magenta;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, arcR, startA, endA, sign < 0);
      ctx.stroke();

      // Arrowhead at end of torque arc
      const tipX = Math.cos(endA) * arcR;
      const tipY = Math.sin(endA) * arcR;
      const tangent = endA + (sign > 0 ? Math.PI * 0.5 : -Math.PI * 0.5);
      ctx.fillStyle = PALETTE.amber;
      ctx.beginPath();
      ctx.moveTo(tipX + Math.cos(tangent) * 12, tipY + Math.sin(tangent) * 12);
      ctx.lineTo(tipX + Math.cos(tangent + 2.4) * 11, tipY + Math.sin(tangent + 2.4) * 11);
      ctx.lineTo(tipX + Math.cos(tangent - 2.4) * 11, tipY + Math.sin(tangent - 2.4) * 11);
      ctx.closePath();
      ctx.fill();

      // Live overload torque pill over hub
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      roundedRectPath(ctx, -98, -124, 196, 26, 7);
      ctx.fill();
      ctx.strokeStyle = PALETTE.magenta;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.fillStyle = PALETTE.magenta;
      ctx.font = '800 12px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(`TORQUE: ${formatTorque(snapshot.torqueImbalanceNm)}`, 0, -110.5);
    }

    ctx.restore();
  }

  _drawHeaderBanner(ctx, snapshot) {
    // Top-left title panel
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    roundedRectPath(ctx, 26, 24, 650, 74, 12);
    ctx.fill();
    ctx.strokeStyle = PALETTE.panelBorderBright;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Geometric Falkirk Wheel emblem (pure canvas geometry, zero emojis)
    ctx.save();
    ctx.translate(64, 61);
    ctx.strokeStyle = PALETTE.cyan;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = PALETTE.magenta;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(0, 16);
    ctx.stroke();
    ctx.fillStyle = PALETTE.amber;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.magenta;
    ctx.fillRect(-7, -19, 14, 5);
    ctx.fillStyle = PALETTE.cyan;
    ctx.fillRect(-7, 14, 14, 5);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.font = '800 22px system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText('LA RUEDA DE FALKIRK  |  ESCOCIA', 98, 48);

    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      'PRINCIPIO DE ARQUIMEDES  ·  ELEVACION 24 M  ·  1.5 kWh POR MEDIA VUELTA',
      98,
      74
    );

    // Active physics mode badge (top-center-right)
    const on = snapshot.archimedesEnabled;
    const badgeX = 696;
    const badgeW = 702;
    ctx.fillStyle = on ? 'rgba(16, 185, 129, 0.14)' : 'rgba(232, 121, 249, 0.16)';
    roundedRectPath(ctx, badgeX, 24, badgeW, 74, 12);
    ctx.fill();
    ctx.strokeStyle = on ? PALETTE.emerald : PALETTE.magenta;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Status dot
    ctx.fillStyle = on ? PALETTE.emerald : PALETTE.magenta;
    ctx.beginPath();
    ctx.arc(badgeX + 28, 61, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = on ? PALETTE.emerald : PALETTE.magenta;
    ctx.font = '800 17px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      on
        ? 'MODO: PRINCIPIO DE ARQUIMEDES ACTIVO (EQUILIBRIO 500 t = 500 t)'
        : 'MODO: SIN ARQUIMEDES - COMPUERTA BLOQUEADA (DESEQUILIBRIO REAL)',
      badgeX + 48,
      48
    );

    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = '500 13px system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText(
      on
        ? 'Cada barco desaloja su propio peso en agua antes de cerrar la compuerta: torque neto = 0 N-m.'
        : 'El agua no escapa al entrar el barco: los motores deben vencer todo el peso extra a 12 m de brazo.',
      badgeX + 48,
      74
    );

    ctx.restore();
  }

  _drawTelemetryPanels(ctx, snapshot, fps) {
    const x = LAYOUT.panelX;
    const w = LAYOUT.panelW;

    this._drawCardKinematics(ctx, x, 24, w, 166, snapshot, fps);
    this._drawCardWeights(ctx, x, 204, w, 224, snapshot);
    this._drawCardTorque(ctx, x, 442, w, 192, snapshot);
    this._drawCardEnergy(ctx, x, 648, w, 158, snapshot);
    this._drawCardGears(ctx, x, 820, w, 82, snapshot);
  }

  _drawCardFrame(ctx, x, y, w, h, title, accentColor) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    roundedRectPath(ctx, x, y, w, h, 12);
    ctx.fill();
    ctx.strokeStyle = PALETTE.panelBorderBright;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Accent bar on left of card header
    ctx.fillStyle = accentColor;
    ctx.fillRect(x + 14, y + 14, 4, 16);

    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, x + 26, y + 22);
    ctx.restore();
  }

  _drawCardKinematics(ctx, x, y, w, h, snapshot, fps) {
    this._drawCardFrame(ctx, x, y, w, h, 'ANGULO Y CINEMATICA DE GIRO', PALETTE.cyan);

    ctx.save();
    // Big live angle readout
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.font = '800 44px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${snapshot.wheelAngleDeg.toFixed(1)} deg`, x + 18, y + 74);

    // Phase status pill
    const phaseLabel = snapshot.paused
      ? 'PAUSADO'
      : snapshot.phase === 'ROTATING_A_UP'
        ? 'SUBIENDO GONDOLA A (0 -> 180 deg)'
        : snapshot.phase === 'DOCK_EXCHANGE_180'
          ? 'INTERCAMBIO DE BARCOS (180 deg)'
          : snapshot.phase === 'ROTATING_B_UP'
            ? 'SUBIENDO GONDOLA B (180 -> 360 deg)'
            : 'INTERCAMBIO DE BARCOS (0 deg)';

    ctx.fillStyle = 'rgba(34, 211, 238, 0.14)';
    roundedRectPath(ctx, x + 18, y + 106, 294, 24, 6);
    ctx.fill();
    ctx.fillStyle = PALETTE.cyan;
    ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(phaseLabel, x + 28, y + 118);

    // Gondola horizontal leveling confirmation & stats
    ctx.fillStyle = PALETTE.emerald;
    ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `NIVEL GONDOLAS: ${Math.abs(snapshot.gears.gondolaWorldTiltDeg).toFixed(2)} deg  |  CICLOS: ${snapshot.halfTurnsCompleted}`,
      x + 18,
      y + 148
    );

    // Mini angle compass dial on right side of card
    const dcx = x + w - 68;
    const dcy = y + 86;
    const dr = 44;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(dcx, dcy, dr, 0, Math.PI * 2);
    ctx.stroke();

    const rad = (snapshot.wheelAngleDeg * Math.PI) / 180;
    const ax = dcx - Math.sin(rad) * (dr - 8);
    const ay = dcy + Math.cos(rad) * (dr - 8);
    const bx = dcx + Math.sin(rad) * (dr - 8);
    const by = dcy - Math.cos(rad) * (dr - 8);

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.fillStyle = PALETTE.magenta;
    ctx.beginPath();
    ctx.arc(ax, ay, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.cyan;
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.fill();

    // Subtle FPS stamp in top-right corner of card
    ctx.textAlign = 'right';
    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`${Math.round(fps)} FPS`, x + w - 16, y + 22);
    ctx.restore();
  }

  _drawCardWeights(ctx, x, y, w, h, snapshot) {
    this._drawCardFrame(ctx, x, y, w, h, 'PESO GONDOLA A vs B (t)', PALETTE.magenta);

    const gA = snapshot.gondolaA;
    const gB = snapshot.gondolaB;
    const maxScaleT = 760;
    const barX = x + 18;
    const barW = w - 36;

    ctx.save();
    this._drawStackedMassBar(ctx, barX, y + 48, barW, 'GONDOLA A', gA, PALETTE.magenta, maxScaleT);
    this._drawStackedMassBar(ctx, barX, y + 106, barW, 'GONDOLA B', gB, PALETTE.cyan, maxScaleT);

    // Interactive balance beam fulcrum graphic
    const beamCx = x + w * 0.5;
    const beamCy = y + 184;
    const diff = snapshot.massDiffTonnes;
    const tiltRad = Math.max(-0.24, Math.min(0.24, (diff / 250) * 0.24));

    // Fulcrum triangle
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(beamCx, beamCy + 2);
    ctx.lineTo(beamCx - 12, beamCy + 22);
    ctx.lineTo(beamCx + 12, beamCy + 22);
    ctx.closePath();
    ctx.fill();

    // Tilting beam
    ctx.save();
    ctx.translate(beamCx, beamCy);
    ctx.rotate(-tiltRad); // Heavier A pushes left side down
    ctx.strokeStyle = Math.abs(diff) < 0.01 ? PALETTE.emerald : PALETTE.amber;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-135, 0);
    ctx.lineTo(135, 0);
    ctx.stroke();

    ctx.fillStyle = PALETTE.magenta;
    ctx.beginPath();
    ctx.arc(-135, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PALETTE.cyan;
    ctx.beginPath();
    ctx.arc(135, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Delta readout
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = Math.abs(diff) < 0.01 ? PALETTE.emerald : PALETTE.amber;
    const diffStr =
      Math.abs(diff) < 0.01
        ? 'DELTA PESO: 0.0 t  (EQUILIBRIO PERFECTO)'
        : `DELTA PESO: ${diff > 0 ? '+' : ''}${diff.toFixed(1)} t  (DESEQUILIBRIO)`;
    ctx.fillText(diffStr, beamCx, y + 160);

    ctx.restore();
  }

  _drawStackedMassBar(ctx, x, y, w, label, g, boatColor, maxScaleT) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(label, x, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = g.excessMassTonnes > 0 ? PALETTE.amber : PALETTE.emerald;
    ctx.font = '800 15px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`${g.totalMassTonnes.toFixed(1)} t`, x + w, y);

    // Bar track
    const barY = y + 12;
    const barH = 14;
    ctx.fillStyle = '#09101E';
    roundedRectPath(ctx, x, barY, w, barH, 4);
    ctx.fill();

    const wStruct = (g.structureTonnes / maxScaleT) * w;
    const wWater = (g.waterMassTonnes / maxScaleT) * w;
    const wBoat = (g.boatMassTonnes / maxScaleT) * w;

    ctx.fillStyle = '#475569';
    ctx.fillRect(x, barY, wStruct, barH);
    ctx.fillStyle = '#0891B2';
    ctx.fillRect(x + wStruct, barY, wWater, barH);
    ctx.fillStyle = boatColor;
    ctx.fillRect(x + wStruct + wWater, barY, wBoat, barH);

    // 500 t nominal vertical marker tick
    const x500 = x + (500 / maxScaleT) * w;
    ctx.strokeStyle = PALETTE.emerald;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x500, barY - 3);
    ctx.lineTo(x500, barY + barH + 3);
    ctx.stroke();

    // Breakdown micro-caption
    ctx.textAlign = 'left';
    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `Acero ${g.structureTonnes.toFixed(0)}t + Agua ${g.waterMassTonnes.toFixed(0)}t + Barco ${g.boatMassTonnes.toFixed(0)}t  (Desalojo: ${g.displacedWaterTonnes.toFixed(0)}t)`,
      x,
      barY + barH + 12
    );
  }

  _drawCardTorque(ctx, x, y, w, h, snapshot) {
    const balanced = snapshot.torqueImbalanceNm < 1;
    this._drawCardFrame(
      ctx,
      x,
      y,
      w,
      h,
      'TORQUE DE DESEQUILIBRIO (N-m)',
      balanced ? PALETTE.emerald : PALETTE.magenta
    );

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = balanced ? PALETTE.emerald : PALETTE.magenta;
    ctx.font = '800 32px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(formatTorqueFull(snapshot.torqueImbalanceNm), x + 18, y + 60);

    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `PICO A 90 deg: ${formatTorque(snapshot.peakTorqueImbalanceNm)}   |   BRAZO: 12.0 m`,
      x + 18,
      y + 88
    );

    // Live torque oscilloscope sparkline
    const gx = x + 18;
    const gy = y + 104;
    const gw = w - 36;
    const gh = 72;

    ctx.fillStyle = '#070D19';
    roundedRectPath(ctx, gx, gy, gw, gh, 7);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Zero baseline
    const zeroY = gy + gh - 10;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(gx + 4, zeroY);
    ctx.lineTo(gx + gw - 4, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    const hist = snapshot.torqueHistory || [];
    if (hist.length > 1) {
      let maxVal = 5_000_000;
      for (const pt of hist) {
        if (pt.torqueNm > maxVal) maxVal = pt.torqueNm;
      }

      ctx.beginPath();
      for (let i = 0; i < hist.length; i++) {
        const px = gx + 6 + (i / (hist.length - 1)) * (gw - 12);
        const py = zeroY - (hist[i].torqueNm / maxVal) * (gh - 22);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = balanced ? PALETTE.emerald : PALETTE.magenta;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }

    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('HISTORIAL TORQUE (N-m)', gx + gw - 8, gy + 12);
    ctx.restore();
  }

  _drawCardEnergy(ctx, x, y, w, h, snapshot) {
    this._drawCardFrame(ctx, x, y, w, h, 'ENERGIA ACUMULADA (kWh)', PALETTE.amber);

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PALETTE.amber;
    ctx.font = '800 36px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`${snapshot.energyKwh.toFixed(3)} kWh`, x + 18, y + 62);

    ctx.textAlign = 'right';
    ctx.fillStyle = snapshot.archimedesEnabled ? PALETTE.emerald : PALETTE.magenta;
    ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `180 deg: ${snapshot.theoreticalHalfTurnKwh.toFixed(2)} kWh`,
      x + w - 18,
      y + 52
    );
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`POTENCIA: ${snapshot.instantPowerKw.toFixed(1)} kW`, x + w - 18, y + 72);

    // Visual 8-kettle energy equivalent bar (1.5 kWh = 8 boiling kettles)
    const bx = x + 18;
    const by = y + 96;
    const bw = w - 36;
    const cellCount = 8;
    const gap = 6;
    const cellW = (bw - gap * (cellCount - 1)) / cellCount;
    const halfTurnProgressKettles =
      (snapshot.currentHalfTurnEnergyKwh / FALKIRK_CONSTANTS.KETTLE_KWH);
    const activeFill =
      snapshot.currentHalfTurnEnergyKwh > 0.001
        ? halfTurnProgressKettles
        : snapshot.lastHalfTurnEnergyKwh / FALKIRK_CONSTANTS.KETTLE_KWH;

    for (let i = 0; i < cellCount; i++) {
      const cxCell = bx + i * (cellW + gap);
      const fillRatio = Math.max(0, Math.min(1, activeFill - i));
      ctx.fillStyle = '#09101E';
      roundedRectPath(ctx, cxCell, by, cellW, 22, 4);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (fillRatio > 0) {
        ctx.fillStyle = snapshot.archimedesEnabled ? PALETTE.amber : PALETTE.magenta;
        roundedRectPath(ctx, cxCell + 1, by + 1, (cellW - 2) * fillRatio, 20, 3);
        ctx.fill();
      }
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `EQUIV. ACTUAL: ${snapshot.halfTurnKettles.toFixed(1)} TETERAS / MEDIA VUELTA  (TOTAL: ${snapshot.kettlesEquivalent.toFixed(1)})`,
      bx,
      y + 136
    );
    ctx.restore();
  }

  _drawCardGears(ctx, x, y, w, h, snapshot) {
    this._drawCardFrame(ctx, x, y, w, h, 'ENGRANAJES PLANETARIOS (SINCRONIA)', PALETTE.emerald);

    const g = snapshot.gears;
    const cols = [
      { label: 'SOL FIJO 28T', val: `${g.centerGearWorldDeg.toFixed(1)} deg`, color: PALETTE.emerald },
      { label: 'SATELITE 22T', val: `${(g.idlerGearWorldDeg % 360).toFixed(1)} deg`, color: PALETTE.amber },
      { label: 'GONDOLA 28T', val: `${g.gondolaWorldTiltDeg.toFixed(2)} deg`, color: PALETTE.cyan },
    ];

    const colW = (w - 36) / 3;
    ctx.save();
    for (let i = 0; i < cols.length; i++) {
      const cxCol = x + 18 + i * colW;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = PALETTE.textMuted;
      ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(cols[i].label, cxCol, y + 48);

      ctx.fillStyle = cols[i].color;
      ctx.font = '800 16px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(cols[i].val, cxCol, y + 66);
    }
    ctx.restore();
  }
}
