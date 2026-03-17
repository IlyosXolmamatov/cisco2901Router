function createEHWIC() {
  const group = new THREE.Group();
  // EHWIC slot 1
  const slot1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.12, 0.18),
    MATERIALS.hwic
  );
  slot1.position.set(-1.2, 0.08, 1.7);
  slot1.name = "EHWIC_1";
  group.add(slot1);

  // EHWIC slot 2
  const slot2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.12, 0.18),
    MATERIALS.hwic
  );
  slot2.position.set(1.2, 0.08, 1.7);
  slot2.name = "EHWIC_2";
  group.add(slot2);

  return group;
}