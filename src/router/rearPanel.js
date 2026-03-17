function createRearPanel() {
  const group = new THREE.Group();

  // Panel geometry
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.12, 0.18),
    MATERIALS.panel
  );
  panel.position.set(0, 0.08, -1.75);
  panel.castShadow = true;
  panel.receiveShadow = true;
  panel.name = "REAR_PANEL";
  group.add(panel);

  // Power input
  const power = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.08),
    MATERIALS.power
  );
  power.position.set(-1.7, 0.08, -1.85);
  power.name = "POWER";
  group.add(power);

  // Reset button
  const reset = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    MATERIALS.power
  );
  reset.position.set(-1.5, 0.12, -1.85);
  reset.name = "RESET";
  group.add(reset);

  return group;
}