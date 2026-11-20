// tests.mjs
// Executable verification suite for physics.js using node:assert/strict.
// Run with: node tests.mjs

import assert from 'node:assert/strict';
import {
  FALKIRK_CONSTANTS,
  calculateGondolaState,
  calculateHalfTurnEnergyKwh,
  calculatePlanetaryGears,
  calculateStepEnergyKwh,
  calculateWheelBalance,
  createSimulationState,
  stepSimulation,
} from './physics.js';

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`[PASS] ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`[FAIL] ${name}`);
    console.error(`       ${err.message}`);
  }
}

function assertApprox(actual, expected, tolerance, label) {
  const diff = Math.abs(actual - expected);
  assert.ok(
    diff <= tolerance,
    `${label}: expected ${expected} +/- ${tolerance}, got ${actual} (diff ${diff})`
  );
}

// (a) Constancia del peso total con Principio de Arquimedes activo (0 t a 220 t+)
runTest('(a) Gondola total mass stays constant at 500 t with Archimedes ON across 0 t .. 220 t .. 250 t', () => {
  const testWeights = [0, 40, 85, 140, 220, 250];
  for (const boatMass of testWeights) {
    const g = calculateGondolaState(boatMass, true);
    assertApprox(g.totalMassTonnes, 500.0, 1e-9, `Total mass for ${boatMass} t boat`);
    assertApprox(g.displacedWaterTonnes, boatMass, 1e-9, `Displaced water for ${boatMass} t boat`);
    assertApprox(g.waterMassTonnes, 250.0 - boatMass, 1e-9, `Remaining water for ${boatMass} t boat`);
    assertApprox(g.waterLevelRatio, 1.0, 1e-9, `Canal datum water level for ${boatMass} t boat`);
    assert.equal(g.overflowWarning, false, `No overflow warning expected for ${boatMass} t`);
  }

  // Explicitly compare empty gondola (0 t) vs heavy barge (220 t)
  const emptyGondola = calculateGondolaState(0, true);
  const heavyGondola = calculateGondolaState(220, true);
  assert.equal(
    emptyGondola.totalMassTonnes,
    heavyGondola.totalMassTonnes,
    'Empty gondola (0 t) and loaded gondola (220 t) must weigh identically'
  );
});

// (b) Desequilibrio de torque cercano a 0 N-m con Arquimedes activo
runTest('(b) Torque imbalance is ~0 N-m with Archimedes ON regardless of asymmetric boats and wheel angle', () => {
  const scenarios = [
    { boatATonnes: 220, boatBTonnes: 0 },
    { boatATonnes: 40, boatBTonnes: 220 },
    { boatATonnes: 250, boatBTonnes: 0 },
    { boatATonnes: 180, boatBTonnes: 50 },
  ];
  const angles = [0, 30, 45, 90, 135, 180, 270];

  for (const { boatATonnes, boatBTonnes } of scenarios) {
    for (const wheelAngleDeg of angles) {
      const bal = calculateWheelBalance({
        boatATonnes,
        boatBTonnes,
        archimedesEnabled: true,
        wheelAngleDeg,
      });
      assertApprox(
        bal.massDifferenceTonnes,
        0,
        1e-9,
        `Mass diff for A=${boatATonnes}t B=${boatBTonnes}t`
      );
      assertApprox(
        bal.torqueImbalanceNm,
        0,
        1e-6,
        `Instantaneous torque at ${wheelAngleDeg} deg`
      );
      assertApprox(
        bal.peakTorqueImbalanceNm,
        0,
        1e-6,
        `Peak torque for A=${boatATonnes}t B=${boatBTonnes}t`
      );
      assert.equal(bal.isBalanced, true);
    }
  }
});

// (c) Consumo energetico por media vuelta (0 -> 180 deg) ronda 1.5 kWh (~8 teteras)
runTest('(c) Energy consumption per 180-deg half-turn is ~1.5 kWh (~8 kettles) with Archimedes ON', () => {
  for (const [boatA, boatB] of [
    [40, 0],
    [180, 50],
    [220, 0],
    [250, 250],
  ]) {
    const energy = calculateHalfTurnEnergyKwh({
      boatATonnes: boatA,
      boatBTonnes: boatB,
      archimedesEnabled: true,
      ascendingGondola: 'A',
    });
    assertApprox(energy.totalKwh, 1.5, 0.05, `Half-turn kWh for A=${boatA}t B=${boatB}t`);
    assertApprox(energy.extraGravitationalKwh, 0, 1e-9, 'No extra gravitational energy');
    assertApprox(energy.kettlesEquivalent, 8.0, 0.25, 'Kettle equivalent (~8 kettles)');
  }

  // Verify 60 FPS time-stepped integration from 0 deg to 180 deg matches 1.5 kWh
  const sim = createSimulationState({
    boatATonnes: 220,
    boatBTonnes: 0,
    archimedesEnabled: true,
    isRunning: true,
  });
  const dt = 1 / 60;
  let guard = 0;
  while (sim.completedHalfTurns < 1 && guard < 2000) {
    stepSimulation(sim, dt);
    guard += 1;
  }
  assert.equal(sim.completedHalfTurns, 1, 'Wheel must complete one 180-deg half-turn');
  assertApprox(sim.wheelAngleDeg, 180, 1e-6, 'Angle after first half-turn');
  assertApprox(sim.energyKwh, 1.5, 0.02, 'Integrated 60 FPS half-turn energy (kWh)');
});

// (d) Al desactivar Arquimedes (compuerta bloqueada), el peso y el torque suben proporcionalmente
runTest('(d) Disabling Archimedes (blocked gate) increases gondola mass and torque strictly proportionally', () => {
  const gA = calculateGondolaState(200, false);
  const gB = calculateGondolaState(0, false);
  assertApprox(gA.displacedWaterTonnes, 0, 1e-9, 'Blocked gate displaces 0 t of water');
  assertApprox(gA.totalMassTonnes, 700.0, 1e-9, 'Blocked gondola A mass = 500 + 200 = 700 t');
  assertApprox(gB.totalMassTonnes, 500.0, 1e-9, 'Empty gondola B mass = 500 t');
  assert.equal(gA.overflowWarning, true, 'Overflow warning must activate when blocked with boat');

  // Verify strict linear proportionality across mass deltas at 90 deg
  const bal50 = calculateWheelBalance({
    boatATonnes: 50,
    boatBTonnes: 0,
    archimedesEnabled: false,
    wheelAngleDeg: 90,
  });
  const bal100 = calculateWheelBalance({
    boatATonnes: 100,
    boatBTonnes: 0,
    archimedesEnabled: false,
    wheelAngleDeg: 90,
  });
  const bal200 = calculateWheelBalance({
    boatATonnes: 200,
    boatBTonnes: 0,
    archimedesEnabled: false,
    wheelAngleDeg: 90,
  });

  // Exact physics: tau = deltaM(kg) * 9.81 * 12.0
  const expected100Nm = 100_000 * FALKIRK_CONSTANTS.GRAVITY_MS2 * FALKIRK_CONSTANTS.WHEEL_RADIUS_M;
  assertApprox(bal100.torqueImbalanceNm, expected100Nm, 1e-3, 'Exact torque for 100 t delta at 90 deg');
  assertApprox(bal100.torqueImbalanceNm / bal50.torqueImbalanceNm, 2.0, 1e-9, 'Linear 2x scaling (100 t / 50 t)');
  assertApprox(bal200.torqueImbalanceNm / bal100.torqueImbalanceNm, 2.0, 1e-9, 'Linear 2x scaling (200 t / 100 t)');

  // Verify sinusoidal lever arm scaling: sin(30 deg) = 0.5
  const bal200At30 = calculateWheelBalance({
    boatATonnes: 200,
    boatBTonnes: 0,
    archimedesEnabled: false,
    wheelAngleDeg: 30,
  });
  assertApprox(bal200At30.torqueImbalanceNm / bal200.torqueImbalanceNm, 0.5, 1e-9, 'Sinusoidal lever arm at 30 deg');

  // Verify uncompensated half-turn energy spikes dramatically & matches incremental step integral
  const energyBlocked = calculateHalfTurnEnergyKwh({
    boatATonnes: 200,
    boatBTonnes: 0,
    archimedesEnabled: false,
    ascendingGondola: 'A',
  });
  assert.ok(
    energyBlocked.totalKwh > 15.0,
    `Expected massive energy spike lifting 200 t without Archimedes, got ${energyBlocked.totalKwh} kWh`
  );

  // Sum 180 incremental 1-deg steps and confirm analytical equivalence
  let integratedKwh = 0;
  for (let deg = 0; deg < 180; deg += 1) {
    integratedKwh += calculateStepEnergyKwh({
      prevAngleDeg: deg,
      nextAngleDeg: deg + 1,
      boatATonnes: 200,
      boatBTonnes: 0,
      archimedesEnabled: false,
    });
  }
  assertApprox(
    integratedKwh,
    energyBlocked.totalKwh,
    1e-6,
    'Stepwise integral must equal analytical blocked-gate half-turn kWh'
  );
});

// (e) Engranajes planetarios sincronizados mantienen gondolas horizontales (0 deg) en todo el giro
runTest('(e) Planetary gear train keeps both gondolas strictly horizontal (0 deg) across 0..360 deg', () => {
  for (let deg = 0; deg <= 360; deg += 5) {
    const g = calculatePlanetaryGears(deg);
    assertApprox(g.sunGearWorldDeg, 0, 1e-9, `Fixed sun gear at ${deg} deg`);
    assertApprox(g.gondolaATiltDeg, 0, 1e-9, `Gondola A tilt at ${deg} deg`);
    assertApprox(g.gondolaBTiltDeg, 0, 1e-9, `Gondola B tilt at ${deg} deg`);
    const normDeg = ((deg % 360) + 360) % 360;
    assertApprox(g.idlerGearWorldDeg, -3 * normDeg, 1e-9, `Idler gear 3x rate at ${deg} deg`);
  }

  // Verify exact 24.0 m vertical elevation change between 0 deg and 180 deg
  const g0 = calculatePlanetaryGears(0);
  const g180 = calculatePlanetaryGears(180);
  assertApprox(g0.gondolaAElevationM, 0.0, 1e-9, 'Gondola A starts at 0.0 m');
  assertApprox(g180.gondolaAElevationM, 24.0, 1e-9, 'Gondola A lifts to 24.0 m at 180 deg');
  assertApprox(g0.gondolaBElevationM, 24.0, 1e-9, 'Gondola B starts at 24.0 m');
  assertApprox(g180.gondolaBElevationM, 0.0, 1e-9, 'Gondola B descends to 0.0 m at 180 deg');
});

// (f) Ciclo automatico continuo desde t = 0.0 (rotacion -> acople/salida -> entrada -> siguiente giro)
runTest('(f) Cyclic simulation begins rotating at t=0.0 and loops smoothly through full 360-deg cycle', () => {
  const sim = createSimulationState({
    boatATonnes: 180,
    boatBTonnes: 50,
    archimedesEnabled: true,
    isRunning: true,
  });

  // Immediately starts turning on the very first 60 FPS frame from t = 0.0
  stepSimulation(sim, 1 / 60);
  assert.ok(sim.wheelAngleDeg > 0, `Expected immediate rotation at t=0+, got ${sim.wheelAngleDeg} deg`);
  assert.equal(sim.phase, 'rotating');

  const seenPhases = new Set([sim.phase]);
  let ticks = 0;
  while (sim.completedHalfTurns < 2 && ticks < 4000) {
    stepSimulation(sim, 1 / 60);
    seenPhases.add(sim.phase);
    ticks += 1;
  }

  assert.equal(sim.completedHalfTurns, 2, 'Simulation must complete 2 half-turns (full 360 deg)');
  assert.ok(seenPhases.has('docking_out'), 'Must transition through docking_out phase');
  assert.ok(seenPhases.has('docking_in'), 'Must transition through docking_in phase');
  assertApprox(sim.energyKwh, 3.0, 0.03, 'Two balanced half-turns must consume ~3.0 kWh');
});

console.log(`\nSummary: ${passed} passed, ${failed} failed (total ${passed + failed}).`);
if (failed > 0) {
  process.exit(1);
}
