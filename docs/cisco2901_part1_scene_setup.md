# 🎯 Cisco 2901 Router — Three.js Loyihasi
## QISM 1: Sahna Sozlamalari, O'lchamlar va Yoritish

---

## 📐 Fizik O'lchamlar (Rack-accurate)

| Parametr | Haqiqiy o'lcham | Three.js birligi |
|----------|----------------|-----------------|
| Kenglik  | 440 mm         | 4.40            |
| Balandlik| 44 mm          | 0.44 (1U rack)  |
| Chuqurlik| 368 mm         | 3.68            |

> ⚠️ Barcha geometriya aniq aspect ratio ni saqlashi shart.

---

## 🎬 Renderer Sozlamalari

```javascript
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  physicallyCorrectLights: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);
```

---

## 📷 Kamera Sozlamalari

```javascript
const camera = new THREE.PerspectiveCamera(
  45,                                          // FOV
  window.innerWidth / window.innerHeight,      // Aspect ratio
  0.1,                                         // Near
  100                                          // Far
);

camera.position.set(0, 0.8, 4.5);
camera.lookAt(0, 0, 0);
```

---

## 🕹️ OrbitControls Sozlamalari

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping    = true;
controls.dampingFactor    = 0.05;
controls.minDistance      = 1.5;
controls.maxDistance      = 8.0;
controls.maxPolarAngle    = Math.PI * 0.85;
controls.enablePan        = true;
controls.autoRotate       = false;
```

---

## 💡 Yoritish Tizimi (5 ta manba)

### 1. Ambient Light — Umumiy fon yoriti'sh
```javascript
const ambientLight = new THREE.AmbientLight(0xe8f4fd, 0.4);
scene.add(ambientLight);
```

### 2. Directional Light (Key) — Asosiy yoritish
```javascript
const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(3, 5, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width  = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far  = 20;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);
```

### 3. Directional Light (Fill) — To'ldiruvchi yoritish
```javascript
const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);
```

### 4. Point Light (Front Accent) — Old panel aksent
```javascript
const frontLight = new THREE.PointLight(0xffffff, 0.8, 10);
frontLight.position.set(0, 1, 3);
scene.add(frontLight);
```

### 5. RectAreaLight (Top) — Yuqori panel yoritish
```javascript
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

const rectLight = new THREE.RectAreaLight(0xffffff, 2.0, 6, 2);
rectLight.position.set(0, 3, 0);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);
```

---

## 🌍 Environment Map (HDR)

```javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader()
  .setDataType(THREE.UnsignedByteType)
  .load('studio.hdr', (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.8;
    texture.dispose();
    pmremGenerator.dispose();
  });
```

---

## 🏔️ Zamin (Ground Plane)

```javascript
const groundGeo = new THREE.PlaneGeometry(12, 12);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x0a0a12,
  metalness: 0.1,
  roughness: 0.8,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.22;
ground.receiveShadow = true;
scene.add(ground);
```

---

## 🔄 Animate Loop

```javascript
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // LED animatsiyalari (Qism 3 da batafsil)
  updateLEDs();

  // Fan aylantirish (Qism 4 da batafsil)
  if (fanBlades) fanBlades.rotation.y += 0.05;

  renderer.render(scene, camera);
}
animate();
```

---

## 📱 Responsive Handler

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
```

---

## 📦 Dependencies (CDN)

```html
<!-- index.html head qismiga qo'shing -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js",
    "three/examples/jsm/controls/OrbitControls": "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js",
    "three/examples/jsm/loaders/RGBELoader": "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/RGBELoader.js",
    "three/examples/jsm/postprocessing/EffectComposer": "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js",
    "three/examples/jsm/postprocessing/UnrealBloomPass": "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js"
  }
}
</script>
```

---

## 📁 Fayl Tuzilmasi

```
cisco-2901-3d/
├── index.html
├── src/
│   ├── main.js                  ← sahna init, animate loop
│   ├── router/
│   │   ├── chassis.js           ← asosiy korpus geometriyasi
│   │   ├── frontPanel.js        ← LED, logo, panjara
│   │   ├── rearPanel.js         ← barcha portlar va modullar
│   │   ├── interior.js          ← PCB, CPU, RAM, fan
│   │   └── materials.js         ← umumiy materiallar
│   ├── interaction/
│   │   ├── raycaster.js         ← klik aniqlash
│   │   ├── tooltip.js           ← UI tooltip tizimi
│   │   └── animations.js        ← lid, LED, fan GSAP
│   └── data/
│       └── portData.uz.js       ← O'zbek tilidagi port ma'lumotlari
├── assets/
│   ├── studio.hdr               ← environment map
│   └── textures/
│       ├── brushed_metal.png
│       └── pcb_normal.png
└── package.json
```
