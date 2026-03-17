function createFan() {
  const group = new THREE.Group();
  // Fan base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32),
    MATERIALS.fan
  );
  base.position.set(-1.7, 0.22, 0);
  base.name = "FAN";
  group.add(base);

  // Fan blades
  const bladesGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.04, 0.12),
      MATERIALS.fan
    );
    blade.position.set(0, 0, 0.06);
    blade.rotation.y = (i * Math.PI * 2) / 5;
    bladesGroup.add(blade);
  }
  bladesGroup.position.set(-1.7, 0.22, 0);
  bladesGroup.name = "FAN_BLADES";
  group.add(bladesGroup);

  window.fanBlades = bladesGroup;
  return group;
}