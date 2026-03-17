function createPower() {
  const group = new THREE.Group();
  const power = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.04, 0.08),
    MATERIALS.power
  );
  power.position.set(-1.7, 0.22, -1.7);
  power.name = "POWER";
  group.add(power);
  return group;
}