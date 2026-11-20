// physics.js
// Pure ES module (browser + Node.js compatible) modeling the real physics of
// the Falkirk Wheel (Scotland): Archimedes' principle water displacement,
// residual and blocked-gate torque (N-m), energy consumption (kWh),
// 0..180..360 deg cyclic kinematics, and 5-gear planetary horizontality train.

export const FALKIRK_CONSTANTS = Object.freeze({
  GRAVITY_MS2: 9.81,
  LIFT_HEIGHT_M: 24.0,
  WHEEL_RADIUS_M: 12.0, // Center-to-center lift = 2 * R = 24.0 m
  CAISSON_STRUCTURE_TONNES: 250.0, // Steel gondola shell mass
  WATER_CAPACITY_TONNES: 250.0, // Water capacity when no boat is inside
  NOMINAL_GONDOLA_MASS_TONNES: 500.0, // 250 t steel + 250 t water/boat
  MIN_BOAT_A_TONNES: 40.0,
  MIN_BOAT_B_TONNES: 0.0,
  MAX_BOAT_TONNES: 250.0,
  BASE_HALF_TURN_KWH: 1.5, // Real Falkirk Wheel consumption per 180 deg turn
  KETTLE_BOIL_KWH: 0.1875, // 1.5 kWh / 8 kettles = 0.1875 kWh per kettle
  DRIVE_EFFICIENCY: 0.80, // 10 hydraulic motors + planetary transmission
  BRAKING_CONTROL_LOSS_FACTOR: 0.18, // Hydraulic throttling overhead when lowering imbalance
  JOULES_PER_KWH: 3_600_000,
  SUN_GEAR_TEETH: 24,
  IDLER_GEAR_TEETH: 12,
  GONDOLA_GEAR_TEETH: 24,
  ROTATION_PHASE_SECONDS: 10.0, // Duration of each 180 deg sweep in real-time sim
  DOCK_OUT_SECONDS: 2.1, // Boats sailing out after docking
  DOCK_IN_SECONDS: 2.4, // New boats entering + water displacement
});

export function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Computes mass breakdown and water displacement for one gondola (caisson).
 *
 * When archimedesEnabled === true:
 *   The floating boat enters while the watertight gate is open, displacing
 *   exactly its own weight in water back into the canal before closing.
 *   Total mass = 250 t (steel) + (250 - m_boat) t (water) + m_boat = 500 t.
 *
 * When archimedesEnabled === false (blocked gate):
 *   Water cannot escape out of the caisson; displaced outflow = 0 t.
 *   Total mass = 250 t (steel) + 250 t (water) + m_boat = (500 + m_boat) t.
 */
export function calculateGondolaState(boatMassTonnes, archimedesEnabled = true) {
  const clampedBoat = clamp(Number(boatMassTonnes) || 0, 0, FALKIRK_CONSTANTS.MAX_BOAT_TONNES);
  const structureMassTonnes = FALKIRK_CONSTANTS.CAISSON_STRUCTURE_TONNES;
  const capacityTonnes = FALKIRK_CONSTANTS.WATER_CAPACITY_TONNES;

  const displacedWaterTonnes = archimedesEnabled ? clampedBoat : 0;
  const waterMassTonnes = capacityTonnes - displacedWaterTonnes;
  const totalMassTonnes = structureMassTonnes + waterMassTonnes + clampedBoat;

  // With Archimedes active, canal datum stays level (1.0).
  // Without outflow, trapped water rises noticeably above datum.
  const waterLevelRatio = archimedesEnabled
    ? 1.0
    : 1.0 + (clampedBoat / capacityTonnes) * 0.42;

  return {
    boatMassTonnes: clampedBoat,
    structureMassTonnes,
    displacedWaterTonnes,
    waterMassTonnes,
    totalMassTonnes,
    waterLevelRatio,
    overflowWarning: !archimedesEnabled && clampedBoat > 0,
  };
}

/**
 * Computes static and instantaneous gravitational torque imbalance (N-m)
 * around the central axle at wheelAngleDeg.
 *
 * Angle convention:
 *   0 deg   -> Gondola A at bottom (-12 m), Gondola B at top (+12 m).
 *   90 deg  -> Gondola A on right (+12 m horizontal), Gondola B on left (-12 m).
 *   180 deg -> Gondola A at top (+12 m), Gondola B at bottom (-12 m).
 *   270 deg -> Gondola A on left (-12 m horizontal), Gondola B on right (+12 m).
 *
 * Torque opposing positive rotation (A ascending from 0 -> 180 deg):
 *   tau(theta) = (M_A - M_B) * g * R * sin(theta)
 */
export function calculateWheelBalance({
  boatATonnes = 180,
  boatBTonnes = 50,
  archimedesEnabled = true,
  wheelAngleDeg = 90,
} = {}) {
  const gondolaA = calculateGondolaState(boatATonnes, archimedesEnabled);
  const gondolaB = calculateGondolaState(boatBTonnes, archimedesEnabled);

  const massDifferenceTonnes = gondolaA.totalMassTonnes - gondolaB.totalMassTonnes;
  const massDifferenceKg = massDifferenceTonnes * 1000;
  const angleRad = degToRad(wheelAngleDeg);

  const peakTorqueImbalanceNm =
    massDifferenceKg * FALKIRK_CONSTANTS.GRAVITY_MS2 * FALKIRK_CONSTANTS.WHEEL_RADIUS_M;
  const torqueImbalanceNm = peakTorqueImbalanceNm * Math.sin(angleRad);

  return {
    gondolaA,
    gondolaB,
    massDifferenceTonnes,
    massDifferenceKg,
    peakTorqueImbalanceNm,
    torqueImbalanceNm,
    absTorqueImbalanceNm: Math.abs(torqueImbalanceNm),
    absPeakTorqueImbalanceNm: Math.abs(peakTorqueImbalanceNm),
    isBalanced: Math.abs(massDifferenceTonnes) < 1e-9,
  };
}

/**
 * Analytical electrical energy required for one full 180-degree half-turn (kWh).
 *
 * With Archimedes ON:
 *   Gravitational work is identically 0 J; energy = 1.50 kWh (hydraulic motors
 *   overcoming bearing friction, planetary gear mesh losses, and drive overhead,
 *   equivalent to boiling ~8 domestic kettles).
 *
 * With Archimedes OFF:
 *   Uncompensated mass delta must be lifted 24 m (or controlled by hydraulic
 *   brakes when descending), adding substantial electrical energy demand.
 */
export function calculateHalfTurnEnergyKwh({
  boatATonnes = 180,
  boatBTonnes = 50,
  archimedesEnabled = true,
  ascendingGondola = 'A',
} = {}) {
  const balance = calculateWheelBalance({
    boatATonnes,
    boatBTonnes,
    archimedesEnabled,
    wheelAngleDeg: 90,
  });

  const liftedMassDiffKg =
    ascendingGondola === 'A' ? balance.massDifferenceKg : -balance.massDifferenceKg;

  const gravitationalWorkJ =
    liftedMassDiffKg * FALKIRK_CONSTANTS.GRAVITY_MS2 * FALKIRK_CONSTANTS.LIFT_HEIGHT_M;

  let extraElectricalKwh = 0;
  if (gravitationalWorkJ > 0) {
    extraElectricalKwh =
      gravitationalWorkJ /
      (FALKIRK_CONSTANTS.JOULES_PER_KWH * FALKIRK_CONSTANTS.DRIVE_EFFICIENCY);
  } else if (gravitationalWorkJ < 0) {
    extraElectricalKwh =
      (Math.abs(gravitationalWorkJ) / FALKIRK_CONSTANTS.JOULES_PER_KWH) *
      FALKIRK_CONSTANTS.BRAKING_CONTROL_LOSS_FACTOR;
  }

  const totalKwh = FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH + extraElectricalKwh;
  const kettlesEquivalent = totalKwh / FALKIRK_CONSTANTS.KETTLE_BOIL_KWH;

  return {
    baseKwh: FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH,
    extraGravitationalKwh: extraElectricalKwh,
    totalKwh,
    kettlesEquivalent,
    gravitationalWorkJ,
  };
}

/**
 * Exact incremental electrical energy (kWh) consumed across an angular step
 * from prevAngleDeg to nextAngleDeg (in degrees, non-decreasing).
 * Integrates identically to calculateHalfTurnEnergyKwh over [0, 180] and [180, 360].
 */
export function calculateStepEnergyKwh({
  prevAngleDeg,
  nextAngleDeg,
  boatATonnes = 180,
  boatBTonnes = 50,
  archimedesEnabled = true,
}) {
  const deltaDeg = Math.abs(nextAngleDeg - prevAngleDeg);
  if (deltaDeg <= 0) return 0;

  const theta1 = degToRad(prevAngleDeg);
  const theta2 = degToRad(nextAngleDeg);
  const deltaRad = Math.abs(theta2 - theta1);

  const baseStepKwh = FALKIRK_CONSTANTS.BASE_HALF_TURN_KWH * (deltaRad / Math.PI);
  if (archimedesEnabled) {
    return baseStepKwh;
  }

  const balance = calculateWheelBalance({
    boatATonnes,
    boatBTonnes,
    archimedesEnabled: false,
    wheelAngleDeg: nextAngleDeg,
  });

  // Elevation of Gondola A is y_A(theta) = R * (1 - cos(theta)),
  // so dy_A = R * (cos(theta1) - cos(theta2)).
  const deltaHeightAM = FALKIRK_CONSTANTS.WHEEL_RADIUS_M * (Math.cos(theta1) - Math.cos(theta2));
  const gravWorkJ = balance.massDifferenceKg * FALKIRK_CONSTANTS.GRAVITY_MS2 * deltaHeightAM;

  let extraStepKwh = 0;
  if (gravWorkJ > 0) {
    extraStepKwh =
      gravWorkJ / (FALKIRK_CONSTANTS.JOULES_PER_KWH * FALKIRK_CONSTANTS.DRIVE_EFFICIENCY);
  } else if (gravWorkJ < 0) {
    extraStepKwh =
      (Math.abs(gravWorkJ) / FALKIRK_CONSTANTS.JOULES_PER_KWH) *
      FALKIRK_CONSTANTS.BRAKING_CONTROL_LOSS_FACTOR;
  }

  return baseStepKwh + extraStepKwh;
}

/**
 * Computes exact kinematics of the Falkirk Wheel's 5-gear synchronous epicyclic
 * mechanism (1 fixed central sun gear, 2 idler gears, 2 outer gondola ring gears).
 *
 * Willis epicyclic proof:
 *   Central sun gear is fixed to the pier: phi_sun_world = 0.
 *   In the rotating arm frame (canvas angle = -theta):
 *     phi_sun_rel    = +theta
 *     phi_idler_rel  = -(Z_sun / Z_idler) * phi_sun_rel = -2 * theta
 *     phi_gond_rel   = -(Z_idler / Z_gond) * phi_idler_rel = +theta
 *   Back in the world frame (+ arm angle -theta):
 *     phi_idler_world   = -theta - 2 * theta = -3 * theta
 *     phi_gondola_world = -theta + theta     = 0 deg ALWAYS (strictly horizontal!)
 */
export function calculatePlanetaryGears(wheelAngleDeg) {
  const normalizedDeg = ((wheelAngleDeg % 360) + 360) % 360;
  const rad = degToRad(normalizedDeg);
  const R = FALKIRK_CONSTANTS.WHEEL_RADIUS_M;

  const gearRatioSunToIdler =
    FALKIRK_CONSTANTS.SUN_GEAR_TEETH / FALKIRK_CONSTANTS.IDLER_GEAR_TEETH; // 2.0
  const gearRatioSunToGondola =
    FALKIRK_CONSTANTS.SUN_GEAR_TEETH / FALKIRK_CONSTANTS.GONDOLA_GEAR_TEETH; // 1.0

  // World-frame angles in Canvas CW-positive convention (arm rotates CCW by -rad)
  const armAngleCanvasRad = -rad;
  const sunGearWorldDeg = 0;
  const sunGearWorldRad = 0;

  const idlerGearWorldDeg = -(1 + gearRatioSunToIdler) * normalizedDeg;
  const idlerGearWorldRad = -(1 + gearRatioSunToIdler) * rad;
  const idlerPhaseOffsetRad = Math.PI / FALKIRK_CONSTANTS.IDLER_GEAR_TEETH;

  // Gondola ring gear rotates relative to arm by +theta, cancelling -theta identically
  const gondolaGearRelativeToArmDeg = gearRatioSunToGondola * normalizedDeg;
  const gondolaGearWorldDeg = -normalizedDeg + gondolaGearRelativeToArmDeg; // 0
  const gondolaGearWorldRad = -rad + gearRatioSunToGondola * rad; // 0

  // Physical coordinates in meters (x right, y up from central axle)
  const gondolaAPositionM = {
    x: R * Math.sin(rad),
    y: -R * Math.cos(rad),
  };
  const gondolaBPositionM = {
    x: -R * Math.sin(rad),
    y: R * Math.cos(rad),
  };

  // Elevation above lower canal basin (0.0 m .. 24.0 m)
  const gondolaAElevationM = R * (1 - Math.cos(rad));
  const gondolaBElevationM = R * (1 + Math.cos(rad));

  return {
    wheelAngleDeg: normalizedDeg,
    wheelAngleRad: rad,
    armAngleCanvasRad,
    sunGearTeeth: FALKIRK_CONSTANTS.SUN_GEAR_TEETH,
    idlerGearTeeth: FALKIRK_CONSTANTS.IDLER_GEAR_TEETH,
    gondolaGearTeeth: FALKIRK_CONSTANTS.GONDOLA_GEAR_TEETH,
    sunGearWorldDeg,
    sunGearWorldRad,
    idlerGearWorldDeg,
    idlerGearWorldRad,
    idlerPhaseOffsetRad,
    gondolaGearRelativeToArmDeg,
    gondolaGearWorldDeg,
    gondolaGearWorldRad,
    gondolaATiltDeg: gondolaGearWorldDeg,
    gondolaBTiltDeg: gondolaGearWorldDeg,
    gondolaAPositionM,
    gondolaBPositionM,
    gondolaAElevationM,
    gondolaBElevationM,
  };
}

/**
 * Smooth hydraulic rotation easing profile for u in [0, 1].
 * Non-zero initial slope ensures crisp immediate rotation from t = 0.0
 * while gently accelerating to cruising speed and cushioning into the lock dock.
 */
export function easeHydraulicRotation(u) {
  const t = clamp(u, 0, 1);
  const cosineEase = 0.5 - 0.5 * Math.cos(Math.PI * t);
  return 0.84 * cosineEase + 0.16 * t;
}

/**
 * Creates the mutable simulation state for continuous cyclic 60 FPS animation.
 * Starts directly in the 'rotating' phase at t = 0.0 so motion begins immediately.
 */
export function createSimulationState({
  boatATonnes = 180,
  boatBTonnes = 50,
  archimedesEnabled = true,
  isRunning = true,
} = {}) {
  return {
    timeSeconds: 0,
    isRunning,
    archimedesEnabled,
    boatATonnes: clamp(boatATonnes, FALKIRK_CONSTANTS.MIN_BOAT_A_TONNES, FALKIRK_CONSTANTS.MAX_BOAT_TONNES),
    boatBTonnes: clamp(boatBTonnes, FALKIRK_CONSTANTS.MIN_BOAT_B_TONNES, FALKIRK_CONSTANTS.MAX_BOAT_TONNES),
    phase: 'rotating', // 'rotating' | 'docking_out' | 'docking_in'
    phaseElapsed: 0,
    halfTurnIndex: 0, // Even: 0 -> 180 (A rises, B descends); Odd: 180 -> 360 (B rises, A descends)
    wheelAngleDeg: 0,
    angularVelocityDegPerSec: 0,
    energyKwh: 0,
    completedHalfTurns: 0,
    boatCycleSeed: 0, // Increments each dock exchange to vary arriving boat hull livery
    gateOpenRatio: 0, // 0 = watertight closed, 1 = open to canal/aqueduct
    displacementFlowIntensity: 0, // 0..1 visual outflow cue during docking_in
    strainFactor: 0, // 0..1 visual hydraulic strain when Archimedes OFF
  };
}

/**
 * Advances simulation state by dtSeconds (typically ~1/60 s).
 * Returns derived balance, gear kinematics, and energy metrics for the current frame.
 */
export function stepSimulation(state, dtSeconds) {
  const dt = clamp(Number(dtSeconds) || 0, 0, 0.1);
  const rotDuration = FALKIRK_CONSTANTS.ROTATION_PHASE_SECONDS;
  const dockOutDuration = FALKIRK_CONSTANTS.DOCK_OUT_SECONDS;
  const dockInDuration = FALKIRK_CONSTANTS.DOCK_IN_SECONDS;

  const currentBalanceBefore = calculateWheelBalance({
    boatATonnes: state.boatATonnes,
    boatBTonnes: state.boatBTonnes,
    archimedesEnabled: state.archimedesEnabled,
    wheelAngleDeg: state.wheelAngleDeg,
  });

  // Severe torque imbalance slows the overloaded hydraulic drive slightly for realism
  const overloadRatio = clamp(currentBalanceBefore.absPeakTorqueImbalanceNm / 25_000_000, 0, 1);
  const speedMultiplier = state.archimedesEnabled ? 1.0 : 1.0 - 0.30 * overloadRatio;

  if (state.isRunning && dt > 0) {
    state.timeSeconds += dt;

    if (state.phase === 'rotating') {
      const effectiveDt = dt * speedMultiplier;
      state.phaseElapsed += effectiveDt;

      const u = clamp(state.phaseElapsed / rotDuration, 0, 1);
      const eased = easeHydraulicRotation(u);

      const startDeg = (state.halfTurnIndex % 2) * 180;
      const targetDeg = startDeg + eased * 180;
      const prevUnwrappedDeg =
        startDeg === 0
          ? state.wheelAngleDeg > 180
            ? 0
            : state.wheelAngleDeg
          : state.wheelAngleDeg < 180
            ? 180
            : state.wheelAngleDeg;

      const stepKwh = calculateStepEnergyKwh({
        prevAngleDeg: prevUnwrappedDeg,
        nextAngleDeg: targetDeg,
        boatATonnes: state.boatATonnes,
        boatBTonnes: state.boatBTonnes,
        archimedesEnabled: state.archimedesEnabled,
      });

      state.energyKwh += stepKwh;
      state.angularVelocityDegPerSec = dt > 0 ? (targetDeg - prevUnwrappedDeg) / dt : 0;
      state.wheelAngleDeg = targetDeg >= 360 ? targetDeg % 360 : targetDeg;
      state.gateOpenRatio = 0;
      state.displacementFlowIntensity = 0;

      if (state.phaseElapsed >= rotDuration) {
        state.wheelAngleDeg = ((state.halfTurnIndex + 1) * 180) % 360;
        state.angularVelocityDegPerSec = 0;
        state.completedHalfTurns += 1;
        state.phase = 'docking_out';
        state.phaseElapsed = 0;
      }
    } else if (state.phase === 'docking_out') {
      state.phaseElapsed += dt;
      state.angularVelocityDegPerSec = 0;
      const u = clamp(state.phaseElapsed / dockOutDuration, 0, 1);
      state.gateOpenRatio = state.archimedesEnabled ? clamp(u * 3.5, 0, 1) : 0;
      state.displacementFlowIntensity = 0;

      if (state.phaseElapsed >= dockOutDuration) {
        state.phase = 'docking_in';
        state.phaseElapsed = 0;
        state.boatCycleSeed += 1;
      }
    } else if (state.phase === 'docking_in') {
      state.phaseElapsed += dt;
      state.angularVelocityDegPerSec = 0;
      const u = clamp(state.phaseElapsed / dockInDuration, 0, 1);
      // Gate stays open while incoming boats glide in, then closes near end of phase
      state.gateOpenRatio = state.archimedesEnabled
        ? u < 0.82
          ? 1.0
          : clamp((1.0 - u) / 0.18, 0, 1)
        : 0;
      state.displacementFlowIntensity =
        state.archimedesEnabled && u > 0.1 && u < 0.85
          ? Math.sin(((u - 0.1) / 0.75) * Math.PI)
          : 0;

      if (state.phaseElapsed >= dockInDuration) {
        state.phase = 'rotating';
        state.phaseElapsed = 0;
        state.halfTurnIndex += 1;
        state.gateOpenRatio = 0;
        state.displacementFlowIntensity = 0;
      }
    }
  } else {
    state.angularVelocityDegPerSec = 0;
  }

  const balance = calculateWheelBalance({
    boatATonnes: state.boatATonnes,
    boatBTonnes: state.boatBTonnes,
    archimedesEnabled: state.archimedesEnabled,
    wheelAngleDeg: state.wheelAngleDeg,
  });

  const gears = calculatePlanetaryGears(state.wheelAngleDeg);
  const ascendingGondola = state.halfTurnIndex % 2 === 0 ? 'A' : 'B';
  const halfTurnEnergy = calculateHalfTurnEnergyKwh({
    boatATonnes: state.boatATonnes,
    boatBTonnes: state.boatBTonnes,
    archimedesEnabled: state.archimedesEnabled,
    ascendingGondola,
  });

  state.strainFactor = state.archimedesEnabled
    ? 0
    : clamp(balance.absTorqueImbalanceNm / 20_000_000, 0, 1);

  return {
    state,
    balance,
    gears,
    halfTurnEnergy,
    ascendingGondola,
  };
}
