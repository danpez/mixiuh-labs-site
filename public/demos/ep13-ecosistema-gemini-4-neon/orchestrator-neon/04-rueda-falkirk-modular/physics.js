// physics.js - Pure ES Module physics & kinematics engine for The Falkirk Wheel (Scotland)
// Works identically in browser (<script type="module">) and Node.js (tests.mjs).

export const FALKIRK_CONSTANTS = Object.freeze({
  GRAVITY: 9.81,                   // m/s^2
  LIFT_HEIGHT_M: 24.0,             // Vertical lift between Forth & Clyde and Union canals (m)
  ARM_RADIUS_M: 12.0,              // Axle center to gondola center (2 * 12 = 24 m)
  WHEEL_DIAMETER_M: 35.0,          // Total structural outer diameter (m)
  CAISSON_STRUCTURE_TONNES: 200.0, // Dry steel mass of each caisson/gondola (tonnes)
  WATER_CAPACITY_TONNES: 300.0,    // Water volume when empty: 300,000 L = 300 tonnes
  NOMINAL_GONDOLA_TONNES: 500.0,   // 200 t structure + 300 t water = 500 t constant mass
  MAX_BOAT_TONNES: 250.0,          // Maximum boat weight per gondola (tonnes)
  MIN_BOAT_A_TONNES: 40.0,         // UI minimum for Gondola A boat slider (tonnes)
  BASE_HALF_TURN_KWH: 1.5,         // Real Falkirk Wheel energy per 180-deg turn (~8 kettles)
  DRIVETRAIN_EFFICIENCY: 0.72,     // Hydraulic motors + planetary gear train efficiency
  REAL_HALF_TURN_SECONDS: 240.0,   // Real-world 180-deg rotation time (4 minutes)
  GEAR_TEETH_CENTER: 28,           // Fixed sun gear mounted to central pylon
  GEAR_TEETH_IDLER: 22,            // Intermediate idler gears on rotating arm
  GEAR_TEETH_GONDOLA: 28,          // Outer ring gears coupled to gondola cradles
  JOULES_PER_KWH: 3_600_000,       // 1 kWh = 3.6 MJ
  KETTLE_KWH: 0.1875,              // 1.5 kWh / 8 kettles = 0.1875 kWh per kettle
  SIM_ROTATION_DURATION_S: 10.0,   // Visual simulation duration for 180-deg half-turn (s)
  SIM_DOCK_DURATION_S: 3.6,        // Visual simulation duration for gate/boat exchange (s)
});

export function clampBoatMass(massTonnes) {
  const numeric = Number(massTonnes);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(FALKIRK_CONSTANTS.MAX_BOAT_TONNES, numeric));
}

export function normalizeAngleDeg(angleDeg) {
  const mod = angleDeg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Computes mass, displaced water, and waterline state for a single gondola.
 * When Archimedes' Principle is active, a floating vessel displaces exactly its
 * own weight in water out past the open canal gate before sealing, keeping the
 * total mass locked at 500.0 tonnes regardless of vessel weight.
 */
export function computeGondolaState(boatMassTonnes, archimedesEnabled = true) {
  const boatMass = clampBoatMass(boatMassTonnes);
  const structureTonnes = FALKIRK_CONSTANTS.CAISSON_STRUCTURE_TONNES;
  const fullWater = FALKIRK_CONSTANTS.WATER_CAPACITY_TONNES;

  if (archimedesEnabled) {
    const displacedWaterTonnes = boatMass;
    const waterMassTonnes = fullWater - displacedWaterTonnes;
    const totalMassTonnes = structureTonnes + waterMassTonnes + boatMass;
    return {
      structureTonnes,
      waterMassTonnes,
      boatMassTonnes: boatMass,
      displacedWaterTonnes,
      totalMassTonnes,
      waterLevelRatio: 1.0,
      excessMassTonnes: 0,
    };
  }

  // Blocked gate: boat mass is added without displacing water out of the caisson.
  const displacedWaterTonnes = 0;
  const waterMassTonnes = fullWater;
  const totalMassTonnes = structureTonnes + waterMassTonnes + boatMass;
  const waterLevelRatio = 1.0 + (boatMass / fullWater) * 0.45;
  return {
    structureTonnes,
    waterMassTonnes,
    boatMassTonnes: boatMass,
    displacedWaterTonnes,
    totalMassTonnes,
    waterLevelRatio,
    excessMassTonnes: boatMass,
  };
}

/**
 * Computes exact epicyclic / planetary gear kinematics for the 5-gear train.
 * Fixed center sun gear (28T) -> 2 Idler gears (22T) -> 2 Gondola gears (28T).
 * Because Z_center === Z_gondola, the outer gear counter-rotates by -theta
 * relative to the arm, maintaining a 0.00 deg horizontal world tilt at all angles.
 */
export function computePlanetaryGears(wheelAngleDeg) {
  const zCenter = FALKIRK_CONSTANTS.GEAR_TEETH_CENTER;
  const zIdler = FALKIRK_CONSTANTS.GEAR_TEETH_IDLER;
  const zGondola = FALKIRK_CONSTANTS.GEAR_TEETH_GONDOLA;

  const centerGearWorldDeg = 0;
  const centerGearRelDeg = -wheelAngleDeg;
  const idlerRatio = zCenter / zIdler;
  const idlerGearRelDeg = wheelAngleDeg * idlerRatio;
  const idlerGearWorldDeg = wheelAngleDeg + idlerGearRelDeg;
  const gondolaGearRelDeg = -wheelAngleDeg * (zCenter / zGondola);
  const gondolaWorldTiltDeg = wheelAngleDeg + gondolaGearRelDeg;

  return {
    zCenter,
    zIdler,
    zGondola,
    centerGearWorldDeg,
    centerGearRelDeg,
    idlerGearRelDeg,
    idlerGearWorldDeg,
    gondolaGearRelDeg,
    gondolaWorldTiltDeg,
  };
}

/**
 * Computes instantaneous 2D positions, weights, gravitational torque imbalance,
 * and gear angles for any given wheel angle and boat masses.
 *
 * Angle convention:
 *   0 deg   -> Gondola A at lower canal (0 m), Gondola B at upper aqueduct (+24 m)
 *   90 deg  -> Gondola A ascending on left (+12 m), Gondola B descending on right (+12 m)
 *   180 deg -> Gondola A at upper aqueduct (+24 m), Gondola B at lower canal (0 m)
 *   270 deg -> Gondola A descending on right (+12 m), Gondola B ascending on left (+12 m)
 */
export function computeWheelMechanics({
  wheelAngleDeg = 0,
  boatAMassTonnes = 140,
  boatBMassTonnes = 60,
  archimedesEnabled = true,
} = {}) {
  const thetaRad = (wheelAngleDeg * Math.PI) / 180;
  const R = FALKIRK_CONSTANTS.ARM_RADIUS_M;
  const g = FALKIRK_CONSTANTS.GRAVITY;

  const gondolaA = computeGondolaState(boatAMassTonnes, archimedesEnabled);
  const gondolaB = computeGondolaState(boatBMassTonnes, archimedesEnabled);

  const sinT = Math.sin(thetaRad);
  const cosT = Math.cos(thetaRad);

  const posAM = { x: -R * sinT, y: -R * cosT };
  const posBM = { x: R * sinT, y: R * cosT };
  const heightAM = R + posAM.y; // 0 m at 0 deg -> 24 m at 180 deg
  const heightBM = R + posBM.y; // 24 m at 0 deg -> 0 m at 180 deg

  // Potential energy U(theta) = -(mA - mB) * 1000 * g * R * cos(theta)
  // Gravitational torque opposing +theta rotation: tau = dU/dtheta = (mA - mB)*1000*g*R*sin(theta)
  const massDiffTonnes = gondolaA.totalMassTonnes - gondolaB.totalMassTonnes;
  const peakTorqueImbalanceNm = Math.abs(massDiffTonnes) * 1000 * g * R;
  const signedTorqueImbalanceNm = massDiffTonnes * 1000 * g * R * sinT;
  const torqueImbalanceNm = Math.abs(signedTorqueImbalanceNm);

  const gears = computePlanetaryGears(wheelAngleDeg);

  return {
    wheelAngleDeg: normalizeAngleDeg(wheelAngleDeg),
    thetaRad,
    archimedesEnabled: Boolean(archimedesEnabled),
    gondolaA: { ...gondolaA, positionM: posAM, heightM: heightAM },
    gondolaB: { ...gondolaB, positionM: posBM, heightM: heightBM },
    massDiffTonnes,
    signedTorqueImbalanceNm,
    torqueImbalanceNm,
    peakTorqueImbalanceNm,
    gears,
  };
}

/**
 * Computes electrical energy (kWh) consumed across an infinitesimal angular step dThetaRad > 0.
 * Base losses integrate to exactly 1.50 kWh per 180-deg half-turn.
 * When Archimedes is disabled, lifting the unbalanced load requires additional gravitational
 * work divided by hydraulic efficiency (plus hydraulic braking overhead when lowering).
 */
export function computeIncrementalEnergyKwh({
  dThetaRad,
  signedTorqueImbalanceNm,
}) {
  if (dThetaRad <= 0) return 0;

  const baseKwh = FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH * (dThetaRad / Math.PI);
  let extraKwh = 0;

  if (signedTorqueImbalanceNm > 0) {
    // Motors actively lift heavier gondola against gravity
    const mechWorkJ = signedTorqueImbalanceNm * dThetaRad;
    extraKwh = mechWorkJ / (FALKIRK_CONSTANTS.DRIVETRAIN_EFFICIENCY * FALKIRK_CONSTANTS.JOULES_PER_KWH);
  } else if (signedTorqueImbalanceNm < 0) {
    // Heavier gondola descends: non-regenerative hydraulic counterbalance braking overhead
    const brakingWorkJ = Math.abs(signedTorqueImbalanceNm) * dThetaRad;
    extraKwh = (0.35 * brakingWorkJ) / FALKIRK_CONSTANTS.JOULES_PER_KWH;
  }

  return baseKwh + extraKwh;
}

/**
 * Analytical electrical energy (kWh) required for one 180-deg lift (0 -> 180 deg).
 * Integral of sin(theta) from 0 to pi is 2, giving exact delta-U = delta_m * g * 24 m.
 */
export function computeHalfTurnEnergyKwh({
  boatAMassTonnes = 140,
  boatBMassTonnes = 60,
  archimedesEnabled = true,
} = {}) {
  const gA = computeGondolaState(boatAMassTonnes, archimedesEnabled);
  const gB = computeGondolaState(boatBMassTonnes, archimedesEnabled);
  const massDiffTonnes = gA.totalMassTonnes - gB.totalMassTonnes;
  const deltaPotJ = massDiffTonnes * 1000 * FALKIRK_CONSTANTS.GRAVITY * FALKIRK_CONSTANTS.LIFT_HEIGHT_M;

  let extraKwh = 0;
  if (deltaPotJ > 0) {
    extraKwh = deltaPotJ / (FALKIRK_CONSTANTS.DRIVETRAIN_EFFICIENCY * FALKIRK_CONSTANTS.JOULES_PER_KWH);
  } else if (deltaPotJ < 0) {
    extraKwh = (0.35 * Math.abs(deltaPotJ)) / FALKIRK_CONSTANTS.JOULES_PER_KWH;
  }

  return FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH + extraKwh;
}

/**
 * Smooth monotonic profile p(u) in [0, 1] for u in [0, 1] with non-zero
 * initial slope (p'(0) = 0.25) so rotation starts immediately at t = 0.0
 * while easing gracefully near docking angles.
 */
function smoothMotionProgress(u) {
  const clamped = Math.max(0, Math.min(1, u));
  return clamped - (0.75 / (2 * Math.PI)) * Math.sin(2 * Math.PI * clamped);
}

function smoothMotionVelocityFactor(u) {
  const clamped = Math.max(0, Math.min(1, u));
  return 1.0 - 0.75 * Math.cos(2 * Math.PI * clamped);
}

export class FalkirkSimulation {
  constructor(options = {}) {
    this.boatAMassTonnes = clampBoatMass(options.boatAMassTonnes ?? 140);
    this.boatBMassTonnes = clampBoatMass(options.boatBMassTonnes ?? 60);
    this.archimedesEnabled = options.archimedesEnabled ?? true;
    this.paused = Boolean(options.paused ?? false);

    // Cycle starts directly in active rotation from t = 0.0
    this.phase = 'ROTATING_A_UP';
    this.phaseTimeS = 0;
    this.elapsedTimeS = 0;

    this.wheelAngleDeg = 0;
    this.unwrappedAngleDeg = 0;
    this.angularVelocityDegPerS = 0;
    this.angularAccelDegPerS2 = 0;

    this.energyKwh = 0;
    this.currentHalfTurnEnergyKwh = 0;
    this.lastHalfTurnEnergyKwh = FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH;
    this.instantPowerKw = 0;
    this.halfTurnsCompleted = 0;
    this.boatsTransferred = 0;
    this.boatCycleId = 1;

    this.torqueHistory = [];
    this._historyTimerS = 0;

    // Seed initial power & torque point
    const initMech = this.getMechanics();
    this.torqueHistory.push({
      angleDeg: 0,
      torqueNm: initMech.torqueImbalanceNm,
      signedTorqueNm: initMech.signedTorqueImbalanceNm,
      archimedesEnabled: this.archimedesEnabled,
    });
  }

  setBoatAMass(massTonnes) {
    this.boatAMassTonnes = clampBoatMass(massTonnes);
  }

  setBoatBMass(massTonnes) {
    this.boatBMassTonnes = clampBoatMass(massTonnes);
  }

  setArchimedesEnabled(enabled) {
    this.archimedesEnabled = Boolean(enabled);
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
  }

  togglePaused() {
    this.paused = !this.paused;
    return this.paused;
  }

  resetEnergy() {
    this.energyKwh = 0;
    this.currentHalfTurnEnergyKwh = 0;
    this.halfTurnsCompleted = 0;
    this.boatsTransferred = 0;
    this.torqueHistory = [];
  }

  getMechanics() {
    return computeWheelMechanics({
      wheelAngleDeg: this.wheelAngleDeg,
      boatAMassTonnes: this.boatAMassTonnes,
      boatBMassTonnes: this.boatBMassTonnes,
      archimedesEnabled: this.archimedesEnabled,
    });
  }

  step(dtSeconds) {
    if (this.paused || !Number.isFinite(dtSeconds) || dtSeconds <= 0) {
      this.angularVelocityDegPerS = 0;
      this.angularAccelDegPerS2 = 0;
      this.instantPowerKw = 0;
      return this.getSnapshot();
    }

    // Clamp large frame jumps to maintain numerical integration accuracy
    const dt = Math.min(dtSeconds, 0.05);
    this.elapsedTimeS += dt;

    const rotDur = FALKIRK_CONSTANTS.SIM_ROTATION_DURATION_S;
    const dockDur = FALKIRK_CONSTANTS.SIM_DOCK_DURATION_S;

    const prevAngle = this.unwrappedAngleDeg;
    const prevVel = this.angularVelocityDegPerS;

    this.phaseTimeS += dt;

    if (this.phase === 'ROTATING_A_UP') {
      if (this.phaseTimeS >= rotDur) {
        const targetUnwrapped = this.halfTurnsCompleted * 180 + 180;
        const deltaDeg = Math.max(0, targetUnwrapped - prevAngle);
        this._integrateRotationStep(prevAngle, deltaDeg, dt);
        this.unwrappedAngleDeg = targetUnwrapped;
        this.wheelAngleDeg = 180;
        this.halfTurnsCompleted += 1;
        this.lastHalfTurnEnergyKwh = this.currentHalfTurnEnergyKwh;
        this.currentHalfTurnEnergyKwh = 0;
        this.phase = 'DOCK_EXCHANGE_180';
        this.phaseTimeS = this.phaseTimeS - rotDur;
      } else {
        const u = this.phaseTimeS / rotDur;
        const nextUnwrapped = this.halfTurnsCompleted * 180 + 180 * smoothMotionProgress(u);
        const deltaDeg = Math.max(0, nextUnwrapped - prevAngle);
        this._integrateRotationStep(prevAngle, deltaDeg, dt);
        this.unwrappedAngleDeg = nextUnwrapped;
        this.wheelAngleDeg = normalizeAngleDeg(nextUnwrapped);
        this.angularVelocityDegPerS = (180 / rotDur) * smoothMotionVelocityFactor(u);
      }
    } else if (this.phase === 'DOCK_EXCHANGE_180') {
      this.wheelAngleDeg = 180;
      this.angularVelocityDegPerS = 0;
      this.instantPowerKw = 0.8; // Auxiliary lock gate hydraulics idle draw
      if (this.phaseTimeS >= dockDur) {
        this.boatsTransferred += this.boatBMassTonnes > 0 ? 2 : 1;
        this.boatCycleId += 1;
        this.phase = 'ROTATING_B_UP';
        this.phaseTimeS = this.phaseTimeS - dockDur;
      }
    } else if (this.phase === 'ROTATING_B_UP') {
      if (this.phaseTimeS >= rotDur) {
        const targetUnwrapped = this.halfTurnsCompleted * 180 + 180;
        const deltaDeg = Math.max(0, targetUnwrapped - prevAngle);
        this._integrateRotationStep(prevAngle, deltaDeg, dt);
        this.unwrappedAngleDeg = targetUnwrapped;
        this.wheelAngleDeg = 0;
        this.halfTurnsCompleted += 1;
        this.lastHalfTurnEnergyKwh = this.currentHalfTurnEnergyKwh;
        this.currentHalfTurnEnergyKwh = 0;
        this.phase = 'DOCK_EXCHANGE_0';
        this.phaseTimeS = this.phaseTimeS - rotDur;
      } else {
        const u = this.phaseTimeS / rotDur;
        const nextUnwrapped = this.halfTurnsCompleted * 180 + 180 * smoothMotionProgress(u);
        const deltaDeg = Math.max(0, nextUnwrapped - prevAngle);
        this._integrateRotationStep(prevAngle, deltaDeg, dt);
        this.unwrappedAngleDeg = nextUnwrapped;
        this.wheelAngleDeg = normalizeAngleDeg(nextUnwrapped);
        this.angularVelocityDegPerS = (180 / rotDur) * smoothMotionVelocityFactor(u);
      }
    } else if (this.phase === 'DOCK_EXCHANGE_0') {
      this.wheelAngleDeg = 0;
      this.angularVelocityDegPerS = 0;
      this.instantPowerKw = 0.8;
      if (this.phaseTimeS >= dockDur) {
        this.boatsTransferred += this.boatBMassTonnes > 0 ? 2 : 1;
        this.boatCycleId += 1;
        this.phase = 'ROTATING_A_UP';
        this.phaseTimeS = this.phaseTimeS - dockDur;
      }
    }

    this.angularAccelDegPerS2 = (this.angularVelocityDegPerS - prevVel) / dt;

    // Sample sparkline history roughly every 0.08 s
    this._historyTimerS += dt;
    if (this._historyTimerS >= 0.08) {
      this._historyTimerS = 0;
      const mech = this.getMechanics();
      this.torqueHistory.push({
        angleDeg: mech.wheelAngleDeg,
        torqueNm: mech.torqueImbalanceNm,
        signedTorqueNm: mech.signedTorqueImbalanceNm,
        archimedesEnabled: this.archimedesEnabled,
      });
      if (this.torqueHistory.length > 160) {
        this.torqueHistory.shift();
      }
    }

    return this.getSnapshot();
  }

  _integrateRotationStep(startAngleDeg, deltaDeg, dtSim) {
    if (deltaDeg <= 0) return;
    // Midpoint rule for accurate torque-angle energy integration
    const midAngleDeg = startAngleDeg + deltaDeg * 0.5;
    const midMech = computeWheelMechanics({
      wheelAngleDeg: midAngleDeg,
      boatAMassTonnes: this.boatAMassTonnes,
      boatBMassTonnes: this.boatBMassTonnes,
      archimedesEnabled: this.archimedesEnabled,
    });

    const dThetaRad = (deltaDeg * Math.PI) / 180;
    const dEnergyKwh = computeIncrementalEnergyKwh({
      dThetaRad,
      signedTorqueImbalanceNm: midMech.signedTorqueImbalanceNm,
    });

    this.energyKwh += dEnergyKwh;
    this.currentHalfTurnEnergyKwh += dEnergyKwh;

    // Map energy rate to real-world 240 s half-turn power (kW)
    const timeScale = FALKIRK_CONSTANTS.REAL_HALF_TURN_SECONDS / FALKIRK_CONSTANTS.SIM_ROTATION_DURATION_S;
    const realDtHours = (dtSim * timeScale) / 3600;
    this.instantPowerKw = realDtHours > 0 ? dEnergyKwh / realDtHours : 0;
  }

  _computeDockAnimation() {
    const isDocking = this.phase === 'DOCK_EXCHANGE_180' || this.phase === 'DOCK_EXCHANGE_0';
    if (!isDocking) {
      return {
        isDocking: false,
        gateOpenness: 0,
        stage: 'ROTATING',
        exitProgress: 0,
        enterProgress: 0,
        displacementPulse: 0,
        topGondolaId: this.wheelAngleDeg < 90 || this.wheelAngleDeg >= 270 ? 'B' : 'A',
        bottomGondolaId: this.wheelAngleDeg < 90 || this.wheelAngleDeg >= 270 ? 'A' : 'B',
      };
    }

    const u = Math.max(0, Math.min(1, this.phaseTimeS / FALKIRK_CONSTANTS.SIM_DOCK_DURATION_S));
    let gateOpenness = 1;
    if (u < 0.14) gateOpenness = u / 0.14;
    else if (u > 0.86) gateOpenness = (1 - u) / 0.14;

    let stage = 'GATES_OPENING';
    let exitProgress = 0;
    let enterProgress = 0;
    let displacementPulse = 0;

    if (u >= 0.14 && u < 0.50) {
      stage = 'BOATS_EXITING';
      exitProgress = (u - 0.14) / 0.36;
    } else if (u >= 0.50 && u <= 0.86) {
      stage = 'BOATS_ENTERING';
      exitProgress = 1;
      enterProgress = (u - 0.50) / 0.36;
      // Smooth bell pulse while vessel enters and displaces water
      displacementPulse = Math.sin(enterProgress * Math.PI);
    } else if (u > 0.86) {
      stage = 'GATES_SEALING';
      exitProgress = 1;
      enterProgress = 1;
    }

    const topGondolaId = this.phase === 'DOCK_EXCHANGE_180' ? 'A' : 'B';
    const bottomGondolaId = this.phase === 'DOCK_EXCHANGE_180' ? 'B' : 'A';

    return {
      isDocking: true,
      gateOpenness,
      stage,
      exitProgress,
      enterProgress,
      displacementPulse,
      topGondolaId,
      bottomGondolaId,
    };
  }

  getSnapshot() {
    const mech = this.getMechanics();
    const dock = this._computeDockAnimation();
    const isRotating = this.phase === 'ROTATING_A_UP' || this.phase === 'ROTATING_B_UP';
    const halfTurnAngleDeg =
      this.phase === 'ROTATING_A_UP'
        ? this.wheelAngleDeg
        : this.phase === 'DOCK_EXCHANGE_180'
          ? 180
          : this.phase === 'ROTATING_B_UP'
            ? this.wheelAngleDeg - 180
            : 0;

    const theoreticalHalfTurnKwh = computeHalfTurnEnergyKwh({
      boatAMassTonnes: this.boatAMassTonnes,
      boatBMassTonnes: this.boatBMassTonnes,
      archimedesEnabled: this.archimedesEnabled,
    });

    return {
      ...mech,
      halfTurnAngleDeg: Math.max(0, Math.min(180, halfTurnAngleDeg)),
      unwrappedAngleDeg: this.unwrappedAngleDeg,
      angularVelocityDegPerS: this.angularVelocityDegPerS,
      angularAccelDegPerS2: this.angularAccelDegPerS2,
      phase: this.phase,
      isRotating,
      paused: this.paused,
      elapsedTimeS: this.elapsedTimeS,
      energyKwh: this.energyKwh,
      currentHalfTurnEnergyKwh: this.currentHalfTurnEnergyKwh,
      lastHalfTurnEnergyKwh: this.lastHalfTurnEnergyKwh,
      theoreticalHalfTurnKwh,
      kettlesEquivalent: this.energyKwh / FALKIRK_CONSTANTS.KETTLE_KWH,
      halfTurnKettles: theoreticalHalfTurnKwh / FALKIRK_CONSTANTS.KETTLE_KWH,
      instantPowerKw: this.instantPowerKw,
      halfTurnsCompleted: this.halfTurnsCompleted,
      boatsTransferred: this.boatsTransferred,
      boatCycleId: this.boatCycleId,
      boatAMassTonnes: this.boatAMassTonnes,
      boatBMassTonnes: this.boatBMassTonnes,
      dock,
      torqueHistory: this.torqueHistory,
    };
  }
}
