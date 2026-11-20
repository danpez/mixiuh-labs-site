// renderer.js
// ES module rendering the Falkirk Wheel simulation at 1920x1080 and 60 FPS.
// Zero external dependencies, zero Unicode emojis, strict palette compliance.

import {
  FALKIRK_CONSTANTS,
  clamp,
  stepSimulation,
} from './physics.js';

export const PALETTE = Object.freeze({
  bgDeep: '#060A12',
  bgMid: '#0B1324',
  panel: '#0F172A',
  panelBorder: '#1E293B',
  magenta: '#E879F9',
  cyan: '#22D3EE',
  emerald: '#10B981',
  amber: '#FBBF24',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  steelLight: '#CBD5E1',
  steelMid: '#64748B',
  steelDark: '#1E293B',
  waterDeep: '#083344',
  waterMid: '#0E7490',
});

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// Layout constants in 1920x1080 canvas coordinates
const SCENE = Object.freeze({
  cx: 740,
  cy: 526,
  radiusPx: 264, // 264 px = 12 m -> 528 px = 24 m lift (22 px/m)
  sunGearR: 88, // R / 3 (24 teeth)
  idlerGearR: 44, // R / 6 (12 teeth)
  gondolaGearR: 88, // R / 3 (24 teeth)
  gondolaW: 196,
  gondolaH: 74,
  upperWaterY: 262, // cy - radiusPx
  lowerWaterY: 790, // cy + radiusPx
  aqueductRightX: 640,
  lowerGateX: 840,
  sceneRightX: 1356,
  hudX: 1384,
  hudW: 500,
});

const FONT_SANS = "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', monospace";

function formatNumber(val, decimals = 1) {
  if (!Number.isFinite(val)) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatTorque(nm) {
  const abs = Math.abs(nm);
  if (abs < 1) return '0 N-m';
  if (abs >= 1_000_000) {
    return `${formatNumber(nm / 1_000_000, 2)} MN-m`;
  }
  if (abs >= 1_000) {
    return `${formatNumber(nm / 1_000, 1)} kN-m`;
  }
  return `${formatNumber(nm, 0)} N-m`;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
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

function easeOutCubic(u) {
  const t = clamp(u, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(u) {
  const t = clamp(u, 0, 1);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Draws a precision involute-style spur gear centered at (cx, cy).
 * Tooth #0 peak sits at local angle 0 so phase offsets mesh with zero slip.
 */
function drawSpurGear(ctx, cx, cy, pitchR, teeth, angleRad, options = {}) {
  const {
    fill = '#FBBF24',
    rimStroke = '#FEF3C7',
    hubFill = '#0F172A',
    alpha = 1.0,
    isFixed = false,
  } = options;

  const moduleSize = (2 * pitchR) / teeth;
  const addendum = moduleSize * 0.72;
  const dedendum = moduleSize * 0.85;
  const outerR = pitchR + addendum;
  const rootR = Math.max(8, pitchR - dedendum);
  const step = (Math.PI * 2) / teeth;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);

  // Outer toothed profile
  ctx.beginPath();
  for (let i = 0; i < teeth; i += 1) {
    const base = i * step;
    const aRoot1 = base - step * 0.34;
    const aTip1 = base - step * 0.17;
    const aTip2 = base + step * 0.17;
    const aRoot2 = base + step * 0.34;

    if (i === 0) {
      ctx.moveTo(Math.cos(aRoot1) * rootR, Math.sin(aRoot1) * rootR);
    } else {
      ctx.lineTo(Math.cos(aRoot1) * rootR, Math.sin(aRoot1) * rootR);
    }
    ctx.lineTo(Math.cos(aTip1) * outerR, Math.sin(aTip1) * outerR);
    ctx.lineTo(Math.cos(aTip2) * outerR, Math.sin(aTip2) * outerR);
    ctx.lineTo(Math.cos(aRoot2) * rootR, Math.sin(aRoot2) * rootR);
  }
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 0, rootR * 0.25, 0, 0, outerR);
  grad.addColorStop(0, hubFill);
  grad.addColorStop(0.68, fill);
  grad.addColorStop(1, rimStroke);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.stroke();

  // Inner ring cutouts (spokes) so gear rotation is unmistakably readable
  const spokeCount = teeth >= 24 ? 6 : 4;
  const innerHoleR = rootR * 0.74;
  const hubR = rootR * 0.34;

  ctx.beginPath();
  ctx.arc(0, 0, innerHoleR, 0, Math.PI * 2);
  ctx.fillStyle = hubFill;
  ctx.fill();

  ctx.strokeStyle = fill;
  ctx.lineWidth = Math.max(4, rootR * 0.12);
  for (let s = 0; s < spokeCount; s += 1) {
    const a = (s * Math.PI * 2) / spokeCount;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * hubR, Math.sin(a) * hubR);
    ctx.lineTo(Math.cos(a) * innerHoleR, Math.sin(a) * innerHoleR);
    ctx.stroke();
  }

  // Pitch circle engineering trace
  ctx.beginPath();
  ctx.arc(0, 0, pitchR, 0, Math.PI * 2);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // Central boss & anchor bolts
  ctx.beginPath();
  ctx.arc(0, 0, hubR, 0, Math.PI * 2);
  ctx.fillStyle = isFixed ? '#0F172A' : '#1E293B';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = isFixed ? PALETTE.emerald : fill;
  ctx.stroke();

  // Reference orientation mark on one spoke
  ctx.beginPath();
  ctx.arc(0, -(hubR + innerHoleR) * 0.5, Math.max(3, rootR * 0.055), 0, Math.PI * 2);
  ctx.fillStyle = isFixed ? PALETTE.emerald : PALETTE.textPrimary;
  ctx.fill();

  if (isFixed) {
    // 4 rigid mounting bolts showing central sun gear is anchored to the pier
    for (let b = 0; b < 4; b += 1) {
      const ba = (b * Math.PI) / 2 + Math.PI / 4;
      ctx.beginPath();
      ctx.arc(Math.cos(ba) * hubR * 0.55, Math.sin(ba) * hubR * 0.55, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.emerald;
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Draws a crisp vector kettle silhouette (zero Unicode emojis!).
 */
function drawVectorKettle(ctx, x, y, size, color, lit = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = lit ? 1.0 : 0.22;

  // Kettle body
  ctx.beginPath();
  ctx.moveTo(-size * 0.36, size * 0.35);
  ctx.lineTo(-size * 0.28, -size * 0.25);
  ctx.lineTo(size * 0.24, -size * 0.25);
  ctx.lineTo(size * 0.34, size * 0.35);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Spout (left)
  ctx.beginPath();
  ctx.moveTo(-size * 0.30, -size * 0.08);
  ctx.lineTo(-size * 0.52, -size * 0.22);
  ctx.lineTo(-size * 0.45, -size * 0.02);
  ctx.lineTo(-size * 0.32, size * 0.08);
  ctx.closePath();
  ctx.fill();

  // Lid & knob
  ctx.fillRect(-size * 0.24, -size * 0.34, size * 0.44, size * 0.08);
  ctx.beginPath();
  ctx.arc(-size * 0.02, -size * 0.39, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Handle (right)
  ctx.beginPath();
  ctx.arc(size * 0.31, size * 0.04, size * 0.19, -Math.PI * 0.48, Math.PI * 0.48);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.09);
  ctx.stroke();

  // Base plate
  ctx.fillStyle = '#334155';
  ctx.fillRect(-size * 0.40, size * 0.35, size * 0.78, size * 0.09);

  ctx.restore();
}

/**
 * Draws a Scottish canal narrowboat / barge whose geometry scales with tonnage.
 */
function drawCanalBoat(ctx, x, waterY, boatTonnes, options = {}) {
  if (boatTonnes <= 0) return;

  const {
    accentColor = PALETTE.magenta,
    facing = 1, // 1 = bow right, -1 = bow left
    label = '',
    showWake = false,
    time = 0,
    seed = 0,
  } = options;

  const weightNorm = clamp(boatTonnes / FALKIRK_CONSTANTS.MAX_BOAT_TONNES, 0.14, 1.0);
  const hullLen = 70 + weightNorm * 72; // 80..142 px
  const draft = 8 + weightNorm * 16; // submerged depth 10..24 px
  const freeboard = 10 + weightNorm * 8; // hull above waterline
  const cabinH = 12 + weightNorm * 11;
  const cabinLen = hullLen * 0.58;

  // Subtle buoyancy bob
  const bobY = Math.sin(time * 2.8 + seed * 1.9) * 1.1;

  ctx.save();
  ctx.translate(x, waterY + bobY);

  // Moving wake ripples on water surface
  if (showWake) {
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)';
    ctx.lineWidth = 2;
    for (let w = 0; w < 3; w += 1) {
      const offset = ((time * 45 + w * 16) % 48) * -facing;
      const alpha = 1 - Math.abs(offset) / 48;
      ctx.globalAlpha = alpha * 0.65;
      ctx.beginPath();
      ctx.moveTo(-facing * (hullLen * 0.48) + offset, 1);
      ctx.lineTo(-facing * (hullLen * 0.48) + offset - facing * 12, 5 + w * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  ctx.scale(facing, 1);

  // Submerged hull shadow / displacement volume hint
  ctx.beginPath();
  ctx.moveTo(-hullLen * 0.47, 0);
  ctx.lineTo(hullLen * 0.49, 0);
  ctx.lineTo(hullLen * 0.37, draft);
  ctx.lineTo(-hullLen * 0.39, draft);
  ctx.closePath();
  ctx.fillStyle = '#0B172A';
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Main upper hull
  ctx.beginPath();
  ctx.moveTo(-hullLen * 0.49, -freeboard);
  ctx.lineTo(hullLen * 0.40, -freeboard);
  ctx.quadraticCurveTo(hullLen * 0.52, -freeboard * 0.8, hullLen * 0.54, -2);
  ctx.lineTo(hullLen * 0.49, 1);
  ctx.lineTo(-hullLen * 0.47, 1);
  ctx.closePath();
  ctx.fillStyle = '#1E293B';
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Accent waterline trim stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(-hullLen * 0.46, -4, hullLen * 0.92, 3.2);

  // Cabin superstructure
  const cabinLeft = -hullLen * 0.36;
  drawRoundedRect(ctx, cabinLeft, -freeboard - cabinH, cabinLen, cabinH + 1, 4);
  ctx.fillStyle = '#334155';
  ctx.fill();
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Warm glowing cabin windows
  const winCount = Math.max(2, Math.floor(cabinLen / 18));
  const winGap = cabinLen / (winCount + 0.6);
  ctx.fillStyle = PALETTE.amber;
  for (let i = 0; i < winCount; i += 1) {
    const wx = cabinLeft + 8 + i * winGap;
    drawRoundedRect(ctx, wx, -freeboard - cabinH + 4, 9, Math.min(7, cabinH - 6), 2);
    ctx.fill();
  }

  // Wheelhouse / smokestack accent for heavier barges
  if (boatTonnes >= 100) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(cabinLeft + cabinLen * 0.72, -freeboard - cabinH - 7, 14, 7);
    ctx.fillStyle = accentColor;
    ctx.fillRect(cabinLeft + cabinLen * 0.72, -freeboard - cabinH - 5, 14, 2.5);
  }

  // Bow navigation light
  ctx.beginPath();
  ctx.arc(hullLen * 0.46, -freeboard - 2, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = PALETTE.cyan;
  ctx.fill();

  ctx.restore();

  // Weight badge cleanly above boat (always upright, never flipped)
  const tagText = label || `${Math.round(boatTonnes)} t`;
  ctx.save();
  ctx.font = `700 14px ${FONT_MONO}`;
  const tw = ctx.measureText(tagText).width + 14;
  const tagY = waterY + bobY - freeboard - cabinH - 25;
  drawRoundedRect(ctx, x - tw / 2, tagY, tw, 20, 6);
  ctx.fillStyle = 'rgba(6, 10, 18, 0.88)';
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = PALETTE.textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagText, x, tagY + 10.5);
  ctx.restore();
}

export function createFalkirkRenderer({ canvas, state, onFrame } = {}) {
  if (!canvas) {
    throw new Error('createFalkirkRenderer requires a canvas element');
  }
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const ctx = canvas.getContext('2d');
  let rafId = null;
  let lastTimestamp = null;
  let smoothedFps = 60.0;
  let latestStepResult = stepSimulation(state, 0);

  // Static twinkling star points for Scottish evening atmosphere
  const stars = Array.from({ length: 42 }, (_, idx) => ({
    x: ((idx * 173 + 91) % 1340) + 15,
    y: ((idx * 89 + 37) % 340) + 20,
    r: (idx % 3 === 0 ? 1.5 : 1.0),
    phase: idx * 0.7,
  }));

  function drawBackground(time) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    skyGrad.addColorStop(0, '#04070E');
    skyGrad.addColorStop(0.55, '#070E1C');
    skyGrad.addColorStop(1, '#060A12');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle radial engineering glow behind the wheel center
    const glowColor = state.archimedesEnabled
      ? 'rgba(34, 211, 238, 0.11)'
      : 'rgba(232, 121, 249, 0.16)';
    const radial = ctx.createRadialGradient(SCENE.cx, SCENE.cy, 40, SCENE.cx, SCENE.cy, 460);
    radial.addColorStop(0, glowColor);
    radial.addColorStop(0.65, 'rgba(15, 23, 42, 0.04)');
    radial.addColorStop(1, 'rgba(6, 10, 18, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, SCENE.sceneRightX + 40, CANVAS_H);

    // Faint blueprint grid inside scene region
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = 44; gx < SCENE.sceneRightX; gx += 44) {
      ctx.moveTo(gx, 110);
      ctx.lineTo(gx, 926);
    }
    for (let gy = 132; gy < 926; gy += 44) {
      ctx.moveTo(0, gy);
      ctx.lineTo(SCENE.sceneRightX, gy);
    }
    ctx.stroke();

    // Stars
    for (const s of stars) {
      const twinkle = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(time * 1.4 + s.phase));
      ctx.fillStyle = `rgba(226, 232, 240, ${twinkle.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant Scottish Ochil Hills silhouette
    ctx.beginPath();
    ctx.moveTo(0, 790);
    ctx.lineTo(0, 650);
    ctx.quadraticCurveTo(180, 585, 360, 628);
    ctx.quadraticCurveTo(540, 672, 740, 608);
    ctx.quadraticCurveTo(960, 548, 1170, 616);
    ctx.quadraticCurveTo(1275, 650, SCENE.sceneRightX, 622);
    ctx.lineTo(SCENE.sceneRightX, 790);
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.58)';
    ctx.fill();
  }

  function drawAqueductAndBasin(time) {
    // 1. Iconic curved Falkirk concrete aqueduct piers (background plane)
    const pierXs = [150, 345, 535];
    for (const px of pierXs) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px - 26, SCENE.upperWaterY + 38);
      ctx.quadraticCurveTo(px - 18, 520, px - 34, SCENE.lowerWaterY + 125);
      ctx.lineTo(px + 34, SCENE.lowerWaterY + 125);
      ctx.quadraticCurveTo(px + 18, 520, px + 26, SCENE.upperWaterY + 38);
      ctx.closePath();

      const pGrad = ctx.createLinearGradient(px - 34, 0, px + 34, 0);
      pGrad.addColorStop(0, '#0F172A');
      pGrad.addColorStop(0.45, '#1E293B');
      pGrad.addColorStop(1, '#0B1324');
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vertical architectural lighting groove on each pier
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, SCENE.upperWaterY + 46);
      ctx.lineTo(px, SCENE.lowerWaterY - 6);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Upper Aqueduct Trough (Union Canal, +24.0 m)
    const aqTop = SCENE.upperWaterY - 22;
    const aqBottom = SCENE.upperWaterY + 44;

    // Concrete trough shell
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, aqTop, SCENE.aqueductRightX, aqBottom - aqTop);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(-2, aqTop, SCENE.aqueductRightX + 2, aqBottom - aqTop);

    // Aqueduct water cutaway
    const aqWaterGrad = ctx.createLinearGradient(0, SCENE.upperWaterY, 0, SCENE.upperWaterY + 34);
    aqWaterGrad.addColorStop(0, 'rgba(34, 211, 238, 0.72)');
    aqWaterGrad.addColorStop(1, 'rgba(8, 51, 68, 0.92)');
    ctx.fillStyle = aqWaterGrad;
    ctx.fillRect(0, SCENE.upperWaterY, SCENE.aqueductRightX - 4, 34);

    // Animated water surface shimmer in upper aqueduct
    ctx.strokeStyle = 'rgba(165, 243, 252, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let wx = 0; wx <= SCENE.aqueductRightX - 4; wx += 14) {
      const wy = SCENE.upperWaterY + Math.sin(wx * 0.045 - time * 3.0) * 1.5;
      if (wx === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // Aqueduct guardrail & lamps
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, aqTop - 10);
    ctx.lineTo(SCENE.aqueductRightX - 8, aqTop - 10);
    ctx.stroke();
    for (let lx = 60; lx < SCENE.aqueductRightX - 20; lx += 110) {
      ctx.beginPath();
      ctx.moveTo(lx, aqTop);
      ctx.lineTo(lx, aqTop - 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lx, aqTop - 15, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.amber;
      ctx.fill();
    }

    // Upper canal datum label
    ctx.font = `700 15px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.cyan;
    ctx.textAlign = 'left';
    ctx.fillText('ACUEDUCTO SUPERIOR · CANAL UNION (+24.0 m)', 26, aqTop - 22);

    // 3. Lower Canal Basin (Forth & Clyde Canal, 0.0 m)
    const basinBottomY = 924;
    const basinGrad = ctx.createLinearGradient(0, SCENE.lowerWaterY, 0, basinBottomY);
    basinGrad.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
    basinGrad.addColorStop(0.22, 'rgba(14, 116, 144, 0.62)');
    basinGrad.addColorStop(1, '#051525');
    ctx.fillStyle = basinGrad;
    ctx.fillRect(0, SCENE.lowerWaterY, SCENE.sceneRightX, basinBottomY - SCENE.lowerWaterY);

    // Lower water animated surface ripples
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let wx = 0; wx <= SCENE.sceneRightX; wx += 16) {
      const wy = SCENE.lowerWaterY + Math.sin(wx * 0.035 + time * 2.5) * 1.8;
      if (wx === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // Subtle horizontal water reflection bands
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.14)';
    ctx.lineWidth = 1.5;
    for (let row = 0; row < 4; row += 1) {
      const ry = SCENE.lowerWaterY + 22 + row * 24;
      const shift = Math.sin(time * 1.5 + row) * 18;
      ctx.beginPath();
      ctx.moveTo(40 + shift, ry);
      ctx.lineTo(420 + shift, ry);
      ctx.moveTo(880 - shift, ry);
      ctx.lineTo(1310 - shift, ry);
      ctx.stroke();
    }

    // Basin concrete floor & right quay wall
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, basinBottomY, SCENE.sceneRightX, 14);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, basinBottomY);
    ctx.lineTo(SCENE.sceneRightX, basinBottomY);
    ctx.stroke();

    // Lower canal datum label
    ctx.font = `700 15px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.cyan;
    ctx.textAlign = 'right';
    ctx.fillText('CANAL INFERIOR · FORTH & CLYDE (0.0 m)', SCENE.sceneRightX - 18, SCENE.lowerWaterY - 14);

    // 4. Vertical 24.0 m Elevation Dimension Bracket (left side)
    const dimX = 72;
    ctx.save();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(dimX, SCENE.upperWaterY);
    ctx.lineTo(dimX, SCENE.lowerWaterY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Top & bottom arrows
    for (const [ay, dir] of [
      [SCENE.upperWaterY, 1],
      [SCENE.lowerWaterY, -1],
    ]) {
      ctx.beginPath();
      ctx.moveTo(dimX - 12, ay);
      ctx.lineTo(dimX + 12, ay);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dimX, ay);
      ctx.lineTo(dimX - 6, ay + dir * 11);
      ctx.lineTo(dimX + 6, ay + dir * 11);
      ctx.closePath();
      ctx.fillStyle = PALETTE.amber;
      ctx.fill();
    }

    // 24.0 m badge
    drawRoundedRect(ctx, dimX - 44, SCENE.cy - 20, 88, 40, 8);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fill();
    ctx.strokeStyle = PALETTE.amber;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = `800 17px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.amber;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('24.0 m', dimX, SCENE.cy + 1);
    ctx.restore();
  }

  function drawHydraulicGates(time) {
    const open = state.gateOpenRatio;
    const blocked = !state.archimedesEnabled;
    const gateColor = blocked
      ? PALETTE.magenta
      : open > 0.1
        ? PALETTE.emerald
        : PALETTE.cyan;

    // Upper gate at right edge of aqueduct (x = 638, y = 240..304)
    const upperSlideY = open * 28;
    ctx.save();
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = gateColor;
    ctx.lineWidth = 2.2;
    drawRoundedRect(ctx, SCENE.aqueductRightX - 7, SCENE.upperWaterY - 22 + upperSlideY, 12, 62 - upperSlideY * 0.7, 3);
    ctx.fill();
    ctx.stroke();

    // Lower gate at right edge of bottom gondola dock (x = 840, y = 766..828)
    const lowerSlideY = open * 28;
    drawRoundedRect(ctx, SCENE.lowerGateX - 5, SCENE.lowerWaterY - 22 + lowerSlideY, 12, 62 - lowerSlideY * 0.7, 3);
    ctx.fill();
    ctx.stroke();

    // Displaced water outflow arrows during docking_in when Archimedes is ON!
    if (state.archimedesEnabled && state.displacementFlowIntensity > 0.05) {
      const flow = state.displacementFlowIntensity;
      ctx.globalAlpha = flow;
      ctx.strokeStyle = PALETTE.cyan;
      ctx.fillStyle = PALETTE.cyan;
      ctx.lineWidth = 2.6;

      // Upper outflow leftwards into aqueduct
      for (let i = 0; i < 3; i += 1) {
        const shift = ((time * 90 + i * 26) % 78);
        const ax = SCENE.aqueductRightX - 10 - shift;
        const ay = SCENE.upperWaterY + 12 + (i - 1) * 7;
        ctx.beginPath();
        ctx.moveTo(ax + 16, ay);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ax - 5, ay);
        ctx.lineTo(ax + 3, ay - 4);
        ctx.lineTo(ax + 3, ay + 4);
        ctx.closePath();
        ctx.fill();
      }

      // Lower outflow rightwards into lower canal
      for (let i = 0; i < 3; i += 1) {
        const shift = ((time * 90 + i * 26) % 78);
        const ax = SCENE.lowerGateX + 10 + shift;
        const ay = SCENE.lowerWaterY + 12 + (i - 1) * 7;
        ctx.beginPath();
        ctx.moveTo(ax - 16, ay);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ax + 5, ay);
        ctx.lineTo(ax - 3, ay - 4);
        ctx.lineTo(ax - 3, ay + 4);
        ctx.closePath();
        ctx.fill();
      }

      // Clean floating label explaining water displacement in real time
      drawRoundedRect(ctx, SCENE.aqueductRightX - 245, SCENE.upperWaterY + 52, 232, 26, 6);
      ctx.fillStyle = 'rgba(6, 10, 18, 0.9)';
      ctx.fill();
      ctx.strokeStyle = PALETTE.emerald;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.font = `700 13px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.emerald;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AGUA DESALOJADA AL CANAL', SCENE.aqueductRightX - 129, SCENE.upperWaterY + 65);
    }

    // Blocked gate alert badge when Archimedes is OFF
    if (blocked) {
      const pulse = 0.65 + 0.35 * Math.sin(time * 7.0);
      ctx.globalAlpha = pulse;
      drawRoundedRect(ctx, SCENE.aqueductRightX - 220, SCENE.upperWaterY + 52, 212, 28, 6);
      ctx.fillStyle = 'rgba(40, 10, 48, 0.92)';
      ctx.fill();
      ctx.strokeStyle = PALETTE.magenta;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.font = `700 13px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.magenta;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('COMPUERTA BLOQUEADA', SCENE.aqueductRightX - 114, SCENE.upperWaterY + 66);
    }

    ctx.restore();
  }

  function drawCentralPier() {
    // Structural A-frame central steel support pier supporting the 1,200 t wheel
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(SCENE.cx - 42, SCENE.cy + 14);
    ctx.lineTo(SCENE.cx - 96, 924);
    ctx.lineTo(SCENE.cx + 96, 924);
    ctx.lineTo(SCENE.cx + 42, SCENE.cy + 14);
    ctx.closePath();

    const grad = ctx.createLinearGradient(SCENE.cx - 96, 0, SCENE.cx + 96, 0);
    grad.addColorStop(0, '#0B1324');
    grad.addColorStop(0.5, '#1E293B');
    grad.addColorStop(1, '#0B1324');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner hollow arch cutout
    ctx.beginPath();
    ctx.moveTo(SCENE.cx - 20, SCENE.cy + 85);
    ctx.lineTo(SCENE.cx - 46, 924);
    ctx.lineTo(SCENE.cx + 46, 924);
    ctx.lineTo(SCENE.cx + 20, SCENE.cy + 85);
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 10, 18, 0.62)';
    ctx.fill();

    // Horizontal cross-bracing
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(SCENE.cx - 64, 710);
    ctx.lineTo(SCENE.cx + 64, 710);
    ctx.stroke();

    ctx.restore();
  }

  function drawFalkirkArmAndGears(gears, balance, time) {
    // Subtle mechanical vibration when overloaded without Archimedes
    const shakeX =
      state.strainFactor > 0.05 && state.isRunning && state.phase === 'rotating'
        ? Math.sin(time * 58) * state.strainFactor * 2.2
        : 0;
    const shakeY =
      state.strainFactor > 0.05 && state.isRunning && state.phase === 'rotating'
        ? Math.cos(time * 67) * state.strainFactor * 1.6
        : 0;

    const cx = SCENE.cx + shakeX;
    const cy = SCENE.cy + shakeY;

    // 1. Faint circular trajectory path of gondola pivots (24 m diameter)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, SCENE.radiusPx, 0, Math.PI * 2);
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = state.archimedesEnabled
      ? 'rgba(34, 211, 238, 0.20)'
      : 'rgba(232, 121, 249, 0.28)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. Sculpted Iconic Falkirk Celtic Double-Headed Axe Arms
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(gears.armAngleCanvasRad);

    // Draw symmetric top & bottom Celtic axe lobes
    for (const sign of [-1, 1]) {
      ctx.save();
      ctx.scale(1, sign);

      // Swept aerodynamic twin structural side ribs ("Celtic axe beaks")
      ctx.beginPath();
      ctx.moveTo(-46, 0);
      ctx.bezierCurveTo(-112, 85, -148, 178, -144, 266);
      ctx.quadraticCurveTo(-132, 336, -68, 358);
      ctx.quadraticCurveTo(-96, 314, -92, 264);
      ctx.bezierCurveTo(-88, 198, -58, 132, -32, 62);
      ctx.lineTo(32, 62);
      ctx.bezierCurveTo(58, 132, 88, 198, 92, 264);
      ctx.quadraticCurveTo(96, 314, 68, 358);
      ctx.quadraticCurveTo(132, 336, 144, 266);
      ctx.bezierCurveTo(148, 178, 112, 85, 46, 0);
      ctx.closePath();

      const armGrad = ctx.createLinearGradient(-145, 0, 145, 0);
      armGrad.addColorStop(0, '#334155');
      armGrad.addColorStop(0.24, '#94A3B8');
      armGrad.addColorStop(0.5, '#1E293B');
      armGrad.addColorStop(0.76, '#94A3B8');
      armGrad.addColorStop(1, '#334155');
      ctx.fillStyle = armGrad;
      ctx.fill();

      ctx.strokeStyle = state.archimedesEnabled
        ? 'rgba(226, 232, 240, 0.65)'
        : 'rgba(232, 121, 249, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Inner metallic highlight rib
      ctx.beginPath();
      ctx.moveTo(-58, 32);
      ctx.bezierCurveTo(-114, 112, -134, 198, -126, 272);
      ctx.moveTo(58, 32);
      ctx.bezierCurveTo(114, 112, 134, 198, 126, 272);
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Circular gondola bearing cradle ring
      ctx.beginPath();
      ctx.arc(0, SCENE.radiusPx, 102, 0, Math.PI * 2);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // Translucent dark cutaway gearbox housing connecting all 5 gears along arm centerline
    drawRoundedRect(ctx, -64, -SCENE.radiusPx - 20, 128, SCENE.radiusPx * 2 + 40, 64);
    ctx.fillStyle = 'rgba(6, 10, 18, 0.72)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.32)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // 3. Five Real Synchronous Planetary Gears (exact world-space coordinates & zero-slip angles!)
    const sinA = Math.sin(gears.wheelAngleRad);
    const cosA = Math.cos(gears.wheelAngleRad);

    // Gondola pivot coordinates in canvas space
    // A starts bottom (+radiusPx), B starts top (-radiusPx)
    const ax = cx + SCENE.radiusPx * sinA;
    const ay = cy + SCENE.radiusPx * cosA;
    const bx = cx - SCENE.radiusPx * sinA;
    const by = cy - SCENE.radiusPx * cosA;

    // Idler gear centers midway between hub and each gondola (distance = R / 2 = 132 px)
    const idlerDist = SCENE.sunGearR + SCENE.idlerGearR; // 88 + 44 = 132 px
    const idlerAX = cx + idlerDist * sinA;
    const idlerAY = cy + idlerDist * cosA;
    const idlerBX = cx - idlerDist * sinA;
    const idlerBY = cy - idlerDist * cosA;

    // Central Fixed Sun Gear (24 teeth, world angle = 0 deg ALWAYS)
    drawSpurGear(ctx, cx, cy, SCENE.sunGearR, gears.sunGearTeeth, gears.sunGearWorldRad, {
      fill: '#10B981',
      rimStroke: '#6EE7B7',
      hubFill: '#060A12',
      alpha: 0.94,
      isFixed: true,
    });

    // 2 Idler Gears (12 teeth, rotating at -3 * theta + pi/12)
    const idlerAngle = gears.idlerGearWorldRad + gears.idlerPhaseOffsetRad;
    drawSpurGear(ctx, idlerAX, idlerAY, SCENE.idlerGearR, gears.idlerGearTeeth, idlerAngle, {
      fill: PALETTE.amber,
      rimStroke: '#FEF08A',
      hubFill: '#0F172A',
      alpha: 0.96,
    });
    drawSpurGear(ctx, idlerBX, idlerBY, SCENE.idlerGearR, gears.idlerGearTeeth, idlerAngle, {
      fill: PALETTE.amber,
      rimStroke: '#FEF08A',
      hubFill: '#0F172A',
      alpha: 0.96,
    });

    // 2 Outer Gondola Ring Gears (24 teeth, world angle = 0 deg ALWAYS -> horizontal lock!)
    drawSpurGear(ctx, ax, ay, SCENE.gondolaGearR, gears.gondolaGearTeeth, gears.gondolaGearWorldRad, {
      fill: '#38BDF8',
      rimStroke: '#BAE6FD',
      hubFill: '#0F172A',
      alpha: 0.72,
    });
    drawSpurGear(ctx, bx, by, SCENE.gondolaGearR, gears.gondolaGearTeeth, gears.gondolaGearWorldRad, {
      fill: '#38BDF8',
      rimStroke: '#BAE6FD',
      hubFill: '#0F172A',
      alpha: 0.72,
    });

    // 4. Torque Imbalance Arc / Equilibrium Ring at Central Axle
    ctx.save();
    if (state.archimedesEnabled) {
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.strokeStyle = PALETTE.emerald;
      ctx.lineWidth = 3;
      ctx.stroke();

      drawRoundedRect(ctx, cx - 54, cy - 12, 108, 24, 6);
      ctx.fillStyle = 'rgba(6, 10, 18, 0.92)';
      ctx.fill();
      ctx.strokeStyle = PALETTE.emerald;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.font = `700 13px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.emerald;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TAU = 0 N-m', cx, cy + 0.5);
    } else {
      const mag = clamp(balance.absTorqueImbalanceNm / 22_000_000, 0.12, 1.0);
      const dir = balance.torqueImbalanceNm >= 0 ? 1 : -1;
      const arcR = 54 + mag * 22;
      const sweep = Math.PI * (0.4 + mag * 0.95);
      const startA = -Math.PI / 2;
      const endA = startA + dir * sweep;

      ctx.beginPath();
      ctx.arc(cx, cy, arcR, startA, endA, dir < 0);
      ctx.strokeStyle = PALETTE.magenta;
      ctx.lineWidth = 5 + mag * 4;
      ctx.stroke();

      // Arrowhead at end of torque arc
      const tipX = cx + Math.cos(endA) * arcR;
      const tipY = cy + Math.sin(endA) * arcR;
      const tangent = endA + (dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(tipX + Math.cos(tangent) * 14, tipY + Math.sin(tangent) * 14);
      ctx.lineTo(tipX + Math.cos(tangent + 2.45) * 14, tipY + Math.sin(tangent + 2.45) * 14);
      ctx.lineTo(tipX + Math.cos(tangent - 2.45) * 14, tipY + Math.sin(tangent - 2.45) * 14);
      ctx.closePath();
      ctx.fillStyle = PALETTE.magenta;
      ctx.fill();

      // Torque alert pill at hub
      drawRoundedRect(ctx, cx - 72, cy - 13, 144, 26, 6);
      ctx.fillStyle = 'rgba(40, 8, 48, 0.94)';
      ctx.fill();
      ctx.strokeStyle = PALETTE.magenta;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.font = `800 13px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.magenta;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatTorque(balance.torqueImbalanceNm), cx, cy + 0.5);
    }
    ctx.restore();

    return { ax, ay, bx, by };
  }

  function drawGondola(gx, gy, label, gondolaData, accentColor, showInternalBoat, time, seed) {
    const w = SCENE.gondolaW;
    const h = SCENE.gondolaH;
    const left = gx - w / 2;
    const top = gy - h * 0.45;
    const bottom = top + h;

    // Water surface sits at gy (matching upperWaterY = cy - R and lowerWaterY = cy + R!)
    const nominalWaterY = gy;
    const extraRisePx = (gondolaData.waterLevelRatio - 1.0) * 44;
    const actualWaterY = nominalWaterY - extraRisePx;

    ctx.save();

    // 1. Gondola outer steel U-caisson shell
    drawRoundedRect(ctx, left - 6, top - 6, w + 12, h + 14, 12);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // 2. Interior cutaway water chamber (clipped to trough interior)
    ctx.save();
    drawRoundedRect(ctx, left, top, w, h, 7);
    ctx.clip();

    // Chamber dark interior backdrop
    ctx.fillStyle = '#060A12';
    ctx.fillRect(left, top, w, h);

    // Water body inside gondola
    const waterTopY = Math.max(top + 3, actualWaterY);
    const wGrad = ctx.createLinearGradient(0, waterTopY, 0, bottom);
    if (gondolaData.overflowWarning) {
      wGrad.addColorStop(0, 'rgba(232, 121, 249, 0.72)');
      wGrad.addColorStop(0.35, 'rgba(34, 211, 238, 0.78)');
      wGrad.addColorStop(1, '#083344');
    } else {
      wGrad.addColorStop(0, 'rgba(34, 211, 238, 0.78)');
      wGrad.addColorStop(1, '#083344');
    }

    ctx.beginPath();
    ctx.moveTo(left, bottom);
    for (let px = 0; px <= w; px += 10) {
      const waveAmp = 1.2 + state.strainFactor * 2.2;
      const wy = waterTopY + Math.sin(px * 0.06 + time * 3.8 + seed) * waveAmp;
      ctx.lineTo(left + px, wy);
    }
    ctx.lineTo(left + w, bottom);
    ctx.closePath();
    ctx.fillStyle = wGrad;
    ctx.fill();

    // Bright surface meniscus line
    ctx.strokeStyle = gondolaData.overflowWarning ? PALETTE.magenta : '#A5F3FC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= w; px += 10) {
      const waveAmp = 1.2 + state.strainFactor * 2.2;
      const wy = waterTopY + Math.sin(px * 0.06 + time * 3.8 + seed) * waveAmp;
      if (px === 0) ctx.moveTo(left + px, wy);
      else ctx.lineTo(left + px, wy);
    }
    ctx.stroke();

    // Nominal 100% canal datum reference line
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(left + 4, nominalWaterY);
    ctx.lineTo(left + w - 4, nominalWaterY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore(); // end interior clip

    // 3. Floating Boat inside Gondola (when carrying boat during rotation)
    if (showInternalBoat && gondolaData.boatMassTonnes > 0) {
      drawCanalBoat(ctx, gx, waterTopY, gondolaData.boatMassTonnes, {
        accentColor,
        facing: label === 'A' ? -1 : 1,
        label: `${Math.round(gondolaData.boatMassTonnes)} t`,
        showWake: false,
        time,
        seed,
      });
    } else if (showInternalBoat && gondolaData.boatMassTonnes === 0) {
      // Explicit "SOLO AGUA" label when boat weight is 0 t
      ctx.font = `700 12px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.cyan;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SOLO AGUA (250 t)', gx, nominalWaterY + 18);
    }

    // 4. Glass cutaway rim sheen + level indicator
    drawRoundedRect(ctx, left, top, w, h, 7);
    ctx.strokeStyle = gondolaData.overflowWarning
      ? PALETTE.magenta
      : 'rgba(148, 163, 184, 0.65)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Gondola ID & Total Mass Badge on lower front sill
    const sillY = bottom + 12;
    drawRoundedRect(ctx, gx - 88, sillY - 12, 176, 25, 6);
    ctx.fillStyle = 'rgba(6, 10, 18, 0.94)';
    ctx.fill();
    ctx.strokeStyle = gondolaData.overflowWarning ? PALETTE.magenta : accentColor;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.font = `800 13px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `GONDOLA ${label}: ${formatNumber(gondolaData.totalMassTonnes, 1)} t`,
      gx,
      sillY + 0.5
    );

    // 6. Downward Gravity Force Vector Arrow (scaled by total mass)
    const forceMN = (gondolaData.totalMassTonnes * 1000 * FALKIRK_CONSTANTS.GRAVITY_MS2) / 1e6;
    const arrowLen = 28 + ((gondolaData.totalMassTonnes - 450) / 300) * 46;
    const arrowStartY = sillY + 16;
    const arrowEndY = arrowStartY + arrowLen;
    const arrowColor = gondolaData.overflowWarning ? PALETTE.magenta : PALETTE.emerald;

    ctx.strokeStyle = arrowColor;
    ctx.fillStyle = arrowColor;
    ctx.lineWidth = gondolaData.overflowWarning ? 4.0 : 2.6;
    ctx.beginPath();
    ctx.moveTo(gx, arrowStartY);
    ctx.lineTo(gx, arrowEndY - 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gx, arrowEndY);
    ctx.lineTo(gx - 7, arrowEndY - 11);
    ctx.lineTo(gx + 7, arrowEndY - 11);
    ctx.closePath();
    ctx.fill();

    ctx.font = `700 12px ${FONT_MONO}`;
    ctx.fillStyle = arrowColor;
    ctx.textAlign = 'left';
    ctx.fillText(`${formatNumber(forceMN, 2)} MN`, gx + 12, arrowStartY + arrowLen * 0.55);

    ctx.restore();
  }

  function drawTransferAndCanalBoats(balance, time) {
    // Identify which gondola is docked at top vs bottom during docking phases
    const isAAtTop = Math.abs(state.wheelAngleDeg - 180) < 1;
    const topLabel = isAAtTop ? 'A' : 'B';
    const bottomLabel = isAAtTop ? 'B' : 'A';
    const topData = isAAtTop ? balance.gondolaA : balance.gondolaB;
    const bottomData = isAAtTop ? balance.gondolaB : balance.gondolaA;
    const topColor = isAAtTop ? PALETTE.magenta : PALETTE.cyan;
    const bottomColor = isAAtTop ? PALETTE.cyan : PALETTE.magenta;

    const topWaterRise = (topData.waterLevelRatio - 1.0) * 44;
    const bottomWaterRise = (bottomData.waterLevelRatio - 1.0) * 44;

    ctx.save();
    // Clip canal traffic strictly to the left/main engineering scene so exiting
    // boats glide smoothly off-edge without ever crossing the HUD cards.
    ctx.beginPath();
    ctx.rect(0, 0, SCENE.sceneRightX, CANVAS_H);
    ctx.clip();

    // Continuous ambient Scottish narrowboat cruising across the lower basin foreground
    const cruiseU = (time * 0.045) % 1;
    const cruiseX = -110 + cruiseU * (SCENE.sceneRightX + 220);
    drawCanalBoat(ctx, cruiseX, SCENE.lowerWaterY + 56, 45, {
      accentColor: PALETTE.emerald,
      facing: 1,
      label: 'CRUCERO',
      showWake: true,
      time,
      seed: 99,
    });

    if (state.phase === 'docking_out') {
      const u = easeInOutQuad(state.phaseElapsed / FALKIRK_CONSTANTS.DOCK_OUT_SECONDS);

      // Top boat sails left out onto Upper Aqueduct and smoothly exits frame
      if (topData.boatMassTonnes > 0) {
        const bx = SCENE.cx - u * (SCENE.cx + 120);
        const wy = bx > SCENE.aqueductRightX ? SCENE.upperWaterY - topWaterRise : SCENE.upperWaterY;
        drawCanalBoat(ctx, bx, wy, topData.boatMassTonnes, {
          accentColor: topColor,
          facing: -1,
          label: `${Math.round(topData.boatMassTonnes)} t (${topLabel})`,
          showWake: true,
          time,
          seed: state.boatCycleSeed,
        });
      }

      // Bottom boat sails right out onto Lower Canal and smoothly exits scene edge
      if (bottomData.boatMassTonnes > 0) {
        const bx = SCENE.cx + u * (SCENE.sceneRightX + 120 - SCENE.cx);
        const wy = bx < SCENE.lowerGateX ? SCENE.lowerWaterY - bottomWaterRise : SCENE.lowerWaterY;
        drawCanalBoat(ctx, bx, wy, bottomData.boatMassTonnes, {
          accentColor: bottomColor,
          facing: 1,
          label: `${Math.round(bottomData.boatMassTonnes)} t (${bottomLabel})`,
          showWake: true,
          time,
          seed: state.boatCycleSeed + 5,
        });
      }
    } else if (state.phase === 'docking_in') {
      const u = easeOutCubic(state.phaseElapsed / FALKIRK_CONSTANTS.DOCK_IN_SECONDS);

      // New boat enters smoothly from left edge of Upper Aqueduct into Top Gondola
      if (topData.boatMassTonnes > 0) {
        const bx = -120 + u * (SCENE.cx + 120);
        const wy = bx > SCENE.aqueductRightX ? SCENE.upperWaterY - topWaterRise : SCENE.upperWaterY;
        drawCanalBoat(ctx, bx, wy, topData.boatMassTonnes, {
          accentColor: topColor,
          facing: 1,
          label: `${Math.round(topData.boatMassTonnes)} t (${topLabel})`,
          showWake: u < 0.92,
          time,
          seed: state.boatCycleSeed + 1,
        });
      }

      // New boat enters smoothly from right edge of Lower Canal into Bottom Gondola
      if (bottomData.boatMassTonnes > 0) {
        const bx = SCENE.sceneRightX + 120 - u * (SCENE.sceneRightX + 120 - SCENE.cx);
        const wy = bx < SCENE.lowerGateX ? SCENE.lowerWaterY - bottomWaterRise : SCENE.lowerWaterY;
        drawCanalBoat(ctx, bx, wy, bottomData.boatMassTonnes, {
          accentColor: bottomColor,
          facing: -1,
          label: `${Math.round(bottomData.boatMassTonnes)} t (${bottomLabel})`,
          showWake: u < 0.92,
          time,
          seed: state.boatCycleSeed + 6,
        });
      }
    }

    ctx.restore();
  }

  function drawHeaderBanner() {
    // Clean title & live physics mode pill at top-left
    ctx.save();
    ctx.font = `800 32px ${FONT_SANS}`;
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('LA RUEDA DE FALKIRK', 36, 26);

    ctx.font = `600 15px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.fillText('ESCOCIA · PRINCIPIO DE ARQUIMEDES · ENGRANAJES PLANETARIOS', 38, 66);

    // Live Mode Pill
    const pillX = 438;
    const pillY = 28;
    const pillW = state.archimedesEnabled ? 344 : 430;
    const pillColor = state.archimedesEnabled ? PALETTE.emerald : PALETTE.magenta;
    drawRoundedRect(ctx, pillX, pillY, pillW, 34, 17);
    ctx.fillStyle = state.archimedesEnabled
      ? 'rgba(16, 185, 129, 0.14)'
      : 'rgba(232, 121, 249, 0.18)';
    ctx.fill();
    ctx.strokeStyle = pillColor;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Status indicator dot
    ctx.beginPath();
    ctx.arc(pillX + 18, pillY + 17, 5, 0, Math.PI * 2);
    ctx.fillStyle = pillColor;
    ctx.fill();

    ctx.font = `700 13px ${FONT_MONO}`;
    ctx.fillStyle = pillColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      state.archimedesEnabled
        ? 'ARQUIMEDES ACTIVO · EQUILIBRIO 500 t'
        : 'SIN ARQUIMEDES · COMPUERTA BLOQUEADA',
      pillX + 32,
      pillY + 17.5
    );
    ctx.restore();
  }

  function drawHudCard(x, y, w, h, borderColor) {
    drawRoundedRect(ctx, x, y, w, h, 14);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fill();
    ctx.strokeStyle = borderColor || PALETTE.panelBorder;
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  function drawTelemetryDashboard(stepResult) {
    const { balance, gears, halfTurnEnergy } = stepResult;
    const x = SCENE.hudX;
    const w = SCENE.hudW;

    // ------------------------------------------------------------------
    // CARD 1: ANGULO (deg) & PLANETARY GEAR SYNC
    // ------------------------------------------------------------------
    const c1Y = 26;
    const c1H = 204;
    drawHudCard(x, c1Y, w, c1H, 'rgba(34, 211, 238, 0.38)');

    ctx.font = `700 14px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.cyan;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('01 / ANGULO DE ROTACION Y ENGRANAJES', x + 22, c1Y + 18);

    // FPS badge top-right of card 1
    const fpsText = `${Math.round(smoothedFps)} FPS`;
    drawRoundedRect(ctx, x + w - 92, c1Y + 14, 72, 24, 6);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.fill();
    ctx.strokeStyle = PALETTE.emerald;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.font = `700 13px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.emerald;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fpsText, x + w - 56, c1Y + 26.5);

    // Huge live Angle readout
    ctx.font = `800 50px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${formatNumber(gears.wheelAngleDeg, 1)} deg`, x + 22, c1Y + 48);

    // Sub-metrics
    const phaseMap = {
      rotating: state.halfTurnIndex % 2 === 0 ? 'GIRO 0 -> 180 deg (A SUBE)' : 'GIRO 180 -> 360 deg (B SUBE)',
      docking_out: 'ACOPLADO · SALIDA DE BARCOS',
      docking_in: 'ACOPLADO · ENTRADA Y DESALOJO',
    };
    ctx.font = `600 14px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.amber;
    ctx.fillText(state.isRunning ? phaseMap[state.phase] : 'PAUSADO', x + 22, c1Y + 114);

    ctx.font = `600 13px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.fillText(
      `INCLINACION GONDOLAS: ${formatNumber(gears.gondolaATiltDeg, 1)} deg  |  ELEV. A: ${formatNumber(gears.gondolaAElevationM, 1)} m`,
      x + 22,
      c1Y + 144
    );
    ctx.fillStyle = PALETTE.emerald;
    ctx.fillText(
      `ENGRANAJES 5-RUEDAS (24:12:24) · SOL FIJO 0 deg`,
      x + 22,
      c1Y + 170
    );

    // Mini angle compass dial on right side of card 1
    const dialX = x + w - 68;
    const dialY = c1Y + 94;
    const dialR = 40;
    ctx.beginPath();
    ctx.arc(dialX, dialY, dialR, 0, Math.PI * 2);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Swept progress arc
    ctx.beginPath();
    ctx.arc(dialX, dialY, dialR, Math.PI / 2, Math.PI / 2 - gears.wheelAngleRad, true);
    ctx.strokeStyle = PALETTE.cyan;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Arm indicator inside mini dial
    const dx = Math.sin(gears.wheelAngleRad) * (dialR - 6);
    const dy = Math.cos(gears.wheelAngleRad) * (dialR - 6);
    ctx.beginPath();
    ctx.moveTo(dialX - dx, dialY - dy);
    ctx.lineTo(dialX + dx, dialY + dy);
    ctx.strokeStyle = PALETTE.amber;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(dialX + dx, dialY + dy, 5, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.magenta;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dialX - dx, dialY - dy, 5, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.cyan;
    ctx.fill();

    // ------------------------------------------------------------------
    // CARD 2: PESO GONDOLA A vs B (t)
    // ------------------------------------------------------------------
    const c2Y = 246;
    const c2H = 246;
    drawHudCard(
      x,
      c2Y,
      w,
      c2H,
      balance.isBalanced ? 'rgba(16, 185, 129, 0.45)' : 'rgba(232, 121, 249, 0.65)'
    );

    ctx.font = `700 14px ${FONT_MONO}`;
    ctx.fillStyle = balance.isBalanced ? PALETTE.emerald : PALETTE.magenta;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('02 / PESO GONDOLA A vs B (t)', x + 22, c2Y + 18);

    // Balance badge top-right
    const deltaLabel = balance.isBalanced
      ? 'DELTA: 0.0 t'
      : `DELTA: ${balance.massDifferenceTonnes > 0 ? '+' : ''}${formatNumber(balance.massDifferenceTonnes, 1)} t`;
    drawRoundedRect(ctx, x + w - 156, c2Y + 14, 136, 24, 6);
    ctx.fillStyle = balance.isBalanced
      ? 'rgba(16, 185, 129, 0.16)'
      : 'rgba(232, 121, 249, 0.22)';
    ctx.fill();
    ctx.strokeStyle = balance.isBalanced ? PALETTE.emerald : PALETTE.magenta;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.font = `700 13px ${FONT_MONO}`;
    ctx.fillStyle = balance.isBalanced ? PALETTE.emerald : PALETTE.magenta;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(deltaLabel, x + w - 88, c2Y + 26.5);

    // Stacked horizontal mass bars (scale max = 750 t so blocked overflow clearly extends past 500 t!)
    const barX = x + 22;
    const barMaxW = w - 44;
    const maxTonnesScale = 750;
    const ref500X = barX + (500 / maxTonnesScale) * barMaxW;

    const rows = [
      { id: 'A', data: balance.gondolaA, boatColor: PALETTE.magenta, y: c2Y + 56 },
      { id: 'B', data: balance.gondolaB, boatColor: PALETTE.amber, y: c2Y + 132 },
    ];

    for (const row of rows) {
      ctx.font = `700 15px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.textPrimary;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`GONDOLA ${row.id}`, barX, row.y);

      ctx.font = `800 20px ${FONT_MONO}`;
      ctx.fillStyle = row.data.overflowWarning ? PALETTE.magenta : PALETTE.emerald;
      ctx.textAlign = 'right';
      ctx.fillText(`${formatNumber(row.data.totalMassTonnes, 1)} t`, barX + barMaxW, row.y - 2);

      // Bar track
      const trackY = row.y + 24;
      const trackH = 22;
      drawRoundedRect(ctx, barX, trackY, barMaxW, trackH, 5);
      ctx.fillStyle = '#060A12';
      ctx.fill();

      const structW = (row.data.structureMassTonnes / maxTonnesScale) * barMaxW;
      const waterW = (row.data.waterMassTonnes / maxTonnesScale) * barMaxW;
      const boatW = (row.data.boatMassTonnes / maxTonnesScale) * barMaxW;

      ctx.fillStyle = '#475569';
      ctx.fillRect(barX, trackY, structW, trackH);
      ctx.fillStyle = PALETTE.cyan;
      ctx.fillRect(barX + structW, trackY, waterW, trackH);
      ctx.fillStyle = row.boatColor;
      ctx.fillRect(barX + structW + waterW, trackY, boatW, trackH);

      ctx.font = `600 12px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.textSecondary;
      ctx.textAlign = 'left';
      ctx.fillText(
        `Acero 250t + Agua ${Math.round(row.data.waterMassTonnes)}t + Barco ${Math.round(row.data.boatMassTonnes)}t (Desalojado: ${Math.round(row.data.displacedWaterTonnes)}t)`,
        barX,
        trackY + 27
      );
    }

    // Vertical 500 t Archimedes Equilibrium Reference Line across both bars
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = PALETTE.emerald;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ref500X, c2Y + 74);
    ctx.lineTo(ref500X, c2Y + 186);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = `700 11px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.emerald;
    ctx.textAlign = 'center';
    ctx.fillText('500 t', ref500X, c2Y + 216);
    ctx.restore();

    // Legend strip bottom of card 2
    const legY = c2Y + 220;
    const legendItems = [
      { color: '#475569', text: 'ACERO' },
      { color: PALETTE.cyan, text: 'AGUA' },
      { color: PALETTE.magenta, text: 'BARCO A' },
      { color: PALETTE.amber, text: 'BARCO B' },
    ];
    let lx = barX;
    ctx.font = `700 11px ${FONT_MONO}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (const item of legendItems) {
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, legY - 5, 10, 10);
      ctx.fillStyle = PALETTE.textSecondary;
      ctx.fillText(item.text, lx + 14, legY + 0.5);
      lx += 94;
    }

    // ------------------------------------------------------------------
    // CARD 3: TORQUE NETO EN EJE (N-m)
    // ------------------------------------------------------------------
    const c3Y = 508;
    const c3H = 200;
    const torqueColor = balance.isBalanced ? PALETTE.emerald : PALETTE.magenta;
    drawHudCard(
      x,
      c3Y,
      w,
      c3H,
      balance.isBalanced ? 'rgba(16, 185, 129, 0.42)' : 'rgba(232, 121, 249, 0.72)'
    );

    ctx.font = `700 14px ${FONT_MONO}`;
    ctx.fillStyle = torqueColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('03 / TORQUE DESEQUILIBRIO (N-m)', x + 22, c3Y + 18);

    // Big torque readout
    ctx.font = `800 44px ${FONT_MONO}`;
    ctx.fillStyle = torqueColor;
    ctx.fillText(formatTorque(balance.torqueImbalanceNm), x + 22, c3Y + 46);

    // Center-zero bipolar torque bar
    const tBarX = x + 22;
    const tBarY = c3Y + 108;
    const tBarW = w - 44;
    const tBarH = 18;
    const tMidX = tBarX + tBarW / 2;

    drawRoundedRect(ctx, tBarX, tBarY, tBarW, tBarH, 5);
    ctx.fillStyle = '#060A12';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    const normTorque = clamp(balance.torqueImbalanceNm / 30_000_000, -1, 1);
    if (Math.abs(normTorque) > 0.002) {
      const fillW = Math.abs(normTorque) * (tBarW / 2);
      ctx.fillStyle = PALETTE.magenta;
      if (normTorque > 0) {
        ctx.fillRect(tMidX, tBarY + 2, fillW, tBarH - 4);
      } else {
        ctx.fillRect(tMidX - fillW, tBarY + 2, fillW, tBarH - 4);
      }
    } else {
      ctx.fillStyle = PALETTE.emerald;
      ctx.fillRect(tMidX - 3, tBarY + 1, 6, tBarH - 2);
    }

    // Center 0 tick
    ctx.strokeStyle = PALETTE.textPrimary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tMidX, tBarY - 4);
    ctx.lineTo(tMidX, tBarY + tBarH + 4);
    ctx.stroke();

    ctx.font = `600 13px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.textAlign = 'left';
    ctx.fillText(
      `PICO A 90 deg: ${formatTorque(balance.peakTorqueImbalanceNm)}`,
      x + 22,
      c3Y + 138
    );

    ctx.fillStyle = balance.isBalanced ? PALETTE.emerald : PALETTE.magenta;
    ctx.fillText(
      balance.isBalanced
        ? 'Desalojo exacto: par gravitatorio nulo en todo giro'
        : 'Sin desalojo: sobrecarga estructural proporcional a delta M',
      x + 22,
      c3Y + 164
    );

    // ------------------------------------------------------------------
    // CARD 4: ENERGIA ACUMULADA (kWh) & KETTLES EQUIVALENT
    // ------------------------------------------------------------------
    const c4Y = 724;
    const c4H = 212;
    drawHudCard(x, c4Y, w, c4H, 'rgba(251, 191, 36, 0.48)');

    ctx.font = `700 14px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.amber;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('04 / ENERGIA ACUMULADA (kWh)', x + 22, c4Y + 18);

    // Completed half-turns badge
    drawRoundedRect(ctx, x + w - 166, c4Y + 14, 146, 24, 6);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
    ctx.fill();
    ctx.strokeStyle = PALETTE.amber;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.font = `700 12px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.amber;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`MEDIAS VUELTAS: ${state.completedHalfTurns}`, x + w - 93, c4Y + 26.5);

    // Huge cumulative kWh readout
    ctx.font = `800 48px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.amber;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${formatNumber(state.energyKwh, 2)} kWh`, x + 22, c4Y + 46);

    // Per half-turn rate & kettles equivalent
    const perTurnKwh = halfTurnEnergy.totalKwh;
    const kettles = halfTurnEnergy.kettlesEquivalent;
    ctx.font = `700 14px ${FONT_MONO}`;
    ctx.fillStyle = state.archimedesEnabled ? PALETTE.emerald : PALETTE.magenta;
    ctx.fillText(
      `CONSUMO / 180 deg: ${formatNumber(perTurnKwh, 2)} kWh (~${formatNumber(kettles, 1)} teteras)`,
      x + 22,
      c4Y + 108
    );

    // Row of crisp vector kettle icons (8 lit in balanced 1.5 kWh mode; overflow badge if > 10)
    const kettleIconsToDraw = 10;
    const litCount = Math.min(kettleIconsToDraw, Math.round(kettles));
    const kettleColor = state.archimedesEnabled ? PALETTE.amber : PALETTE.magenta;
    for (let k = 0; k < kettleIconsToDraw; k += 1) {
      drawVectorKettle(ctx, x + 38 + k * 38, c4Y + 156, 26, kettleColor, k < litCount);
    }

    if (kettles > kettleIconsToDraw) {
      ctx.font = `800 15px ${FONT_MONO}`;
      ctx.fillStyle = PALETTE.magenta;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`+${Math.round(kettles - kettleIconsToDraw)}`, x + 422, c4Y + 156);
    }

    ctx.font = `600 12px ${FONT_MONO}`;
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      state.archimedesEnabled
        ? '10 motores hidraulicos · 1.50 kWh por elevacion de 24 m'
        : `Sobrecosto energetico: ${(perTurnKwh / FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH).toFixed(1)}x vs Arquimedes`,
      x + 22,
      c4Y + 184
    );
  }

  function renderFrame(stepResult) {
    const { balance, gears } = stepResult;
    const time = state.timeSeconds;

    drawBackground(time);
    drawAqueductAndBasin(time);
    drawCentralPier();

    // Draw wheel structure, planetary gears, and get live gondola coordinates
    const { ax, ay, bx, by } = drawFalkirkArmAndGears(gears, balance, time);

    // Draw both horizontal gondolas
    const showInternalBoats = state.phase === 'rotating';
    drawGondola(ax, ay, 'A', balance.gondolaA, PALETTE.magenta, showInternalBoats, time, state.boatCycleSeed);
    drawGondola(bx, by, 'B', balance.gondolaB, PALETTE.cyan, showInternalBoats, time, state.boatCycleSeed + 3);

    // Draw canal boats entering/exiting & waiting boats
    drawTransferAndCanalBoats(balance, time);

    // Draw hydraulic lock gates & Archimedes displaced water arrows on top
    drawHydraulicGates(time);

    // Top title banner + right-hand telemetry cards
    drawHeaderBanner();
    drawTelemetryDashboard(stepResult);
  }

  function loop(timestamp) {
    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
      // Advance a tiny initial step so rotation is alive immediately at t = 0.0
      latestStepResult = stepSimulation(state, 1 / 60);
    } else {
      const rawDt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (rawDt > 0 && rawDt < 0.25) {
        const instantFps = 1 / rawDt;
        smoothedFps = smoothedFps * 0.9 + clamp(instantFps, 1, 240) * 0.1;
      }

      const dt = clamp(rawDt, 0, 0.05);
      latestStepResult = stepSimulation(state, dt);
    }

    renderFrame(latestStepResult);
    if (typeof onFrame === 'function') {
      onFrame(latestStepResult, smoothedFps);
    }
    rafId = window.requestAnimationFrame(loop);
  }

  // Render initial frame immediately and start 60 FPS loop
  latestStepResult = stepSimulation(state, 1 / 60);
  renderFrame(latestStepResult);
  rafId = window.requestAnimationFrame(loop);

  return {
    getAuditMetrics() {
      const balance = latestStepResult.balance;
      return {
        fps: Number(smoothedFps.toFixed(1)),
        wheelAngleDeg: Number(state.wheelAngleDeg.toFixed(3)),
        torqueImbalanceNm: Number(balance.torqueImbalanceNm.toFixed(2)),
        energyKwh: Number(state.energyKwh.toFixed(4)),
      };
    },
    renderNow() {
      latestStepResult = stepSimulation(state, 0);
      renderFrame(latestStepResult);
    },
    destroy() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
  };
}
