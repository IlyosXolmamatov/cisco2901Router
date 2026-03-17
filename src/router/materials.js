const MATERIALS = {
  chassis: new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.85,
    roughness: 0.35
  }),
  panel: new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    metalness: 0.7,
    roughness: 0.45
  }),
  port: new THREE.MeshStandardMaterial({
    color: 0xb8860b,
    metalness: 0.6,
    roughness: 0.4
  }),
  ledSys: new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 1.5
  }),
  ledAct: new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 2.5
  }),
  ledPoe: new THREE.MeshStandardMaterial({
    color: 0x4682b4,
    emissive: 0x4682b4,
    emissiveIntensity: 1.5
  }),
  fan: new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    metalness: 0.8,
    roughness: 0.3
  }),
  cpu: new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    metalness: 0.9,
    roughness: 0.2
  }),
  ram: new THREE.MeshStandardMaterial({
    color: 0x4682b4,
    metalness: 0.7,
    roughness: 0.4
  }),
  power: new THREE.MeshStandardMaterial({
    color: 0xb22222,
    metalness: 0.7,
    roughness: 0.4
  }),
  hwic: new THREE.MeshStandardMaterial({
    color: 0x4682b4,
    metalness: 0.7,
    roughness: 0.4
  })
};