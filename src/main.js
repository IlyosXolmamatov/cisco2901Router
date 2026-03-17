// === Cisco 2901 Router — Three.js Scene Setup (Senior) ===
// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050a12);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0.8, 4.5);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// 4. Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1.5;
controls.maxDistance = 8;

// 5. Lights
const ambientLight = new THREE.AmbientLight(0xe8f4fd, 0.4);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(3, 5, 3);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);

// 6. Router group
const routerGroup = new THREE.Group();
scene.add(routerGroup);

// 7. Add all parts
routerGroup.add(createChassis());
routerGroup.add(createFrontPanel());
routerGroup.add(createRearPanel());

const interiorGroup = createInterior();
interiorGroup.visible = false;
routerGroup.add(interiorGroup);

// 8. Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({
    color: 0x0a0a12, roughness: 0.8
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.23;
ground.receiveShadow = true;
scene.add(ground);

// 9. Raycaster
setupRaycaster();

// 10. LED state
let blinkState = true;
setInterval(() => { blinkState = !blinkState; }, 150);

// 11. Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (window.sysMat) {
    window.sysMat.emissiveIntensity = 1.5 + Math.sin(Date.now() / 800);
  }
  if (window.actMat) {
    window.actMat.emissiveIntensity = blinkState ? 2.5 : 0;
  }
  if (window.fanBlades) {
    window.fanBlades.rotation.z += 0.04;
  }
  renderer.render(scene, camera);
}
animate();

// 12. Hide loading
window.addEventListener('load', () => {
  setTimeout(() => {
    const el = document.getElementById('loading');
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => el.style.display = 'none', 500);
    }
  }, 1000);
});

// 13. Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
