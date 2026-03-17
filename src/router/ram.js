function createRAM() {
  const group = new THREE.Group();
  const ram = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.04, 0.08),
    MATERIALS.ram
  );
  ram.position.set(0.4, 0.22, 0);
  ram.name = "RAM";
  group.add(ram);
  return group;
}