function createInterior() {
  const group = new THREE.Group();

  // CPU
  group.add(createCPU());

  // RAM
  group.add(createRAM());

  // Fan
  group.add(createFan());

  // EHWIC slots
  group.add(createEHWIC());

  // Power
  group.add(createPower());

  // Set global fan blades reference
  // (fan.js already sets window.fanBlades)

  return group;
}