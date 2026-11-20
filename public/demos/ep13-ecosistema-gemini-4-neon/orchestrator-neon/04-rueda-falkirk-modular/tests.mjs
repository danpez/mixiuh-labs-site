// tests.mjs - Mathematical verification suite for La Rueda de Falkirk (physics.js)
// Run with: node tests.mjs

import assert from 'node:assert/strict';
import {
  FALKIRK_CONSTANTS,
  computeGondolaState,
  computePlanetaryGears,
  computeWheelMechanics,
  computeHalfTurnEnergyKwh,
  FalkirkSimulation,
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

console.log('=== FALKIRK WHEEL PHYSICS VERIFICATION SUITE ===');

// (a) With Archimedes active, total gondola weight stays constant (500 t) for 0 t to 220 t+ boats
runTest('(a) Arquimedes activo: peso total constante (~500 t) para barcos de 0 t a 220 t y 250 t', () => {
  const testMasses = [0, 40, 85, 140, 220, 250];
  for (const boatMass of testMasses) {
    const state = computeGondolaState(boatMass, true);
    assert.equal(
      state.totalMassTonnes,
      FALKIRK_CONSTANTS.NOMINAL_GONDOLA_TONNES,
      `Con barco de ${boatMass} t, peso total debe ser 500 t y fue ${state.totalMassTonnes}`
    );
    assert.equal(
      state.displacedWaterTonnes,
      boatMass,
      `Agua desalojada debe igualar al peso del barco (${boatMass} t)`
    );
    assert.equal(
      state.waterMassTonnes + state.boatMassTonnes,
      FALKIRK_CONSTANTS.WATER_CAPACITY_TONNES,
      'Agua remanente + barco debe sumar 300 t constantes'
    );
    assert.equal(state.waterLevelRatio, 1.0, 'Nivel de agua debe mantenerse en equilibrio 1.0');
  }

  const mechAsymmetric = computeWheelMechanics({
    wheelAngleDeg: 90,
    boatAMassTonnes: 220,
    boatBMassTonnes: 0,
    archimedesEnabled: true,
  });
  assert.equal(mechAsymmetric.gondolaA.totalMassTonnes, 500.0);
  assert.equal(mechAsymmetric.gondolaB.totalMassTonnes, 500.0);
  assert.equal(mechAsymmetric.massDiffTonnes, 0);
});

// (b) With Archimedes active, torque imbalance is ~0 N-m at every angle
runTest('(b) Arquimedes activo: desequilibrio de torque neto ~0 N-m en toda la rotacion', () => {
  const angles = [0, 15, 30, 45, 60, 90, 120, 150, 180, 225, 270, 315];
  for (const angle of angles) {
    const mech = computeWheelMechanics({
      wheelAngleDeg: angle,
      boatAMassTonnes: 220,
      boatBMassTonnes: 0,
      archimedesEnabled: true,
    });
    assert.ok(
      Math.abs(mech.torqueImbalanceNm) < 1e-6,
      `Torque en ${angle} deg debe ser ~0 Nm, obtenido ${mech.torqueImbalanceNm}`
    );
    assert.equal(mech.peakTorqueImbalanceNm, 0);
  }
});

// (c) Energy consumption per 180-deg half-turn is ~1.5 kWh (analytical + 60 FPS time integration)
runTest('(c) Consumo energetico por media vuelta (180 deg) ronda 1.5 kWh', () => {
  const analyticalKwh = computeHalfTurnEnergyKwh({
    boatAMassTonnes: 220,
    boatBMassTonnes: 0,
    archimedesEnabled: true,
  });
  assert.ok(
    Math.abs(analyticalKwh - 1.5) < 0.01,
    `Consumo analitico esperado ~1.5 kWh, obtenido ${analyticalKwh}`
  );

  // Numerical integration at 60 FPS from t = 0.0 across a full 180-deg half-turn
  const sim = new FalkirkSimulation({
    boatAMassTonnes: 220,
    boatBMassTonnes: 0,
    archimedesEnabled: true,
  });

  // Verify automatic rotation starts immediately from t = 0.0
  const afterFirstFrame = sim.step(1 / 60);
  assert.ok(
    afterFirstFrame.wheelAngleDeg > 0,
    `La rueda debe iniciar giro inmediato desde t=0.0, angulo tras 1 frame: ${afterFirstFrame.wheelAngleDeg}`
  );

  let steps = 0;
  let snap = afterFirstFrame;
  while (snap.halfTurnsCompleted < 1 && steps < 2000) {
    snap = sim.step(1 / 60);
    steps += 1;
  }

  assert.equal(snap.halfTurnsCompleted, 1, 'Debe completar la primera media vuelta de 180 deg');
  assert.ok(
    Math.abs(snap.energyKwh - 1.5) < 0.02,
    `Energia integrada en 180 deg debe rondar 1.5 kWh, obtenido ${snap.energyKwh}`
  );
  assert.ok(
    Math.abs(snap.lastHalfTurnEnergyKwh - 1.5) < 0.02,
    `lastHalfTurnEnergyKwh debe rondar 1.5 kWh, obtenido ${snap.lastHalfTurnEnergyKwh}`
  );
  assert.ok(
    Math.abs(snap.kettlesEquivalent - 8.0) < 0.15,
    `1.5 kWh debe equivaler a ~8 teteras, obtenido ${snap.kettlesEquivalent}`
  );
});

// (d) Disabling Archimedes (blocked gate) makes torque rise strictly proportionally to boat weight diff
runTest('(d) Sin Arquimedes (compuerta bloqueada): torque sube proporcionalmente al desequilibrio', () => {
  const masses = [50, 100, 150, 200, 220];
  const torques = [];

  for (const mA of masses) {
    const mech = computeWheelMechanics({
      wheelAngleDeg: 90,
      boatAMassTonnes: mA,
      boatBMassTonnes: 0,
      archimedesEnabled: false,
    });
    const expectedNm = mA * 1000 * FALKIRK_CONSTANTS.GRAVITY * FALKIRK_CONSTANTS.ARM_RADIUS_M;
    assert.equal(mech.gondolaA.displacedWaterTonnes, 0, 'Con compuerta bloqueada el desalojo es 0');
    assert.equal(mech.gondolaA.totalMassTonnes, 500 + mA, 'Peso total sube a 500 + mA');
    assert.ok(
      Math.abs(mech.torqueImbalanceNm - expectedNm) < 1e-3,
      `Torque para ${mA} t esperado ${expectedNm} Nm, obtenido ${mech.torqueImbalanceNm} Nm`
    );
    torques.push(mech.torqueImbalanceNm);
  }

  // Exact linear proportionality checks
  assert.ok(Math.abs(torques[1] / torques[0] - 2.0) < 1e-9, 'Torque(100 t) / Torque(50 t) === 2');
  assert.ok(Math.abs(torques[2] / torques[0] - 3.0) < 1e-9, 'Torque(150 t) / Torque(50 t) === 3');
  assert.ok(Math.abs(torques[3] / torques[1] - 2.0) < 1e-9, 'Torque(200 t) / Torque(100 t) === 2');
  assert.ok(torques[4] > 25_000_000, 'Torque con 220 t sin Arquimedes supera 25 MN-m');

  // Verify sinusoidal lever arm law: sin(30 deg) = 0.5
  const mech30 = computeWheelMechanics({
    wheelAngleDeg: 30,
    boatAMassTonnes: 200,
    boatBMassTonnes: 0,
    archimedesEnabled: false,
  });
  assert.ok(
    Math.abs(mech30.torqueImbalanceNm / torques[3] - 0.5) < 1e-9,
    'Torque a 30 deg debe ser exactamente 0.5x el pico a 90 deg'
  );

  // Verify energy jumps dramatically without Archimedes (~21.5 kWh vs 1.5 kWh for 220 t lift)
  const blockedEnergy = computeHalfTurnEnergyKwh({
    boatAMassTonnes: 220,
    boatBMassTonnes: 0,
    archimedesEnabled: false,
  });
  assert.ok(
    blockedEnergy > 15.0,
    `Energia sin Arquimedes para 220 t debe superar 15 kWh (obtenido ${blockedEnergy.toFixed(2)} kWh)`
  );
});

// (e) Planetary gear train maintains exact 0.00 deg horizontal gondolas across full 360 deg
runTest('(e) Engranajes planetarios: gondolas horizontales (0.00 deg) en todo el giro 0..360 deg', () => {
  for (let angle = 0; angle <= 360; angle += 15) {
    const gears = computePlanetaryGears(angle);
    assert.equal(gears.centerGearWorldDeg, 0, 'Engranaje sol central debe permanecer fijo en 0 deg');
    assert.ok(
      Math.abs(gears.gondolaWorldTiltDeg) < 1e-12,
      `Inclinacion de gondola en ${angle} deg debe ser 0 deg, obtenido ${gears.gondolaWorldTiltDeg}`
    );
    assert.ok(
      Math.abs(gears.gondolaGearRelDeg + angle) < 1e-12,
      'Engranaje de gondola debe contrarrotar exactamente -theta respecto al brazo'
    );
    const expectedIdlerRel = angle * (FALKIRK_CONSTANTS.GEAR_TEETH_CENTER / FALKIRK_CONSTANTS.GEAR_TEETH_IDLER);
    assert.ok(
      Math.abs(gears.idlerGearRelDeg - expectedIdlerRel) < 1e-9,
      'Relacion de engranaje satelite 28/22 debe mantenerse exacta'
    );
  }
});

// (f) Full cyclic continuity (2 half-turns + dock exchanges) & pause/resume
runTest('(f) Ciclo continuo 360 deg con intercambio de barcos y control Pausar/Girar', () => {
  const sim = new FalkirkSimulation({
    boatAMassTonnes: 140,
    boatBMassTonnes: 60,
    archimedesEnabled: true,
  });

  let sawDocking = false;
  let snap = sim.getSnapshot();
  // Step 30 seconds at 60 FPS (> 1 full 360-deg cycle + 2 dock exchanges)
  for (let i = 0; i < 30 * 60; i++) {
    snap = sim.step(1 / 60);
    if (snap.dock.isDocking && snap.dock.gateOpenness > 0.5) {
      sawDocking = true;
    }
  }

  assert.ok(sawDocking, 'El ciclo automatico debe incluir fase de apertura de compuertas e intercambio');
  assert.ok(snap.halfTurnsCompleted >= 2, 'En 30 s debe completar al menos 2 medias vueltas (360 deg)');
  assert.ok(snap.energyKwh >= 3.0, 'Tras >= 2 medias vueltas la energia debe ser >= 3.0 kWh');

  // Verify pause freezes angle and energy
  sim.setPaused(true);
  const angleBeforePause = sim.getSnapshot().wheelAngleDeg;
  const energyBeforePause = sim.getSnapshot().energyKwh;
  const pausedSnap = sim.step(0.05);
  assert.equal(pausedSnap.wheelAngleDeg, angleBeforePause, 'Pausado no debe avanzar el angulo');
  assert.equal(pausedSnap.energyKwh, energyBeforePause, 'Pausado no debe acumular energia');
});

console.log(`=== RESULTADO: ${passed}/${passed + failed} PRUEBAS PASADAS ===`);
if (failed > 0) {
  process.exit(1);
}
