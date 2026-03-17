function createCPU() {
  const group = new THREE.Group();
  const cpu = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.04, 0.18),
    MATERIALS.cpu
  );
  cpu.position.set(0, 0.22, 0);
  cpu.name = "CPU";
  group.add(cpu);
  return group;
}