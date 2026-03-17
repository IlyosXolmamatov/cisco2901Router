# 🎯 Cisco 2901 Router — Three.js Loyihasi
## QISM 5: Raycaster, O'zbek Tooltip Tizimi va Loyihani Yig'ish

---

## 🎯 Raycaster — Port Klik Aniqlash

```javascript
// interaction/raycaster.js
export function setupRaycaster(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredObject = null;
  let originalMaterial = null;

  // Hover effekti uchun material
  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.3,
    metalness: 0.70,
    roughness: 0.40,
  });

  // Mouse harakati — hover effekti
  renderer.domElement.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Oldingi hover ni tiklash
    if (hoveredObject && originalMaterial) {
      hoveredObject.material = originalMaterial;
      hoveredObject = null;
      originalMaterial = null;
      document.body.style.cursor = 'default';
    }

    // Yangi hover
    const clickable = intersects.find(i => i.object.name && portData[i.object.name]);
    if (clickable) {
      hoveredObject = clickable.object;
      originalMaterial = hoveredObject.material;
      hoveredObject.material = highlightMat;
      document.body.style.cursor = 'pointer';
    }
  });

  // Klik — tooltip ko'rsatish
  renderer.domElement.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const clicked = intersects.find(i => i.object.name && portData[i.object.name]);
    if (clicked) {
      showTooltip(clicked.object.name, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  });

  // Double-click — qopqoq
  renderer.domElement.addEventListener('dblclick', (e) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const topPanel = intersects.find(i => i.object.name === 'TOP_PANEL');
    if (topPanel) triggerLidAnimation();
  });
}
```

---

## 📋 Port Ma'lumotlari — O'zbek Tilida (portData.uz.js)

```javascript
// data/portData.uz.js
export const portData = {

  // ═══════════════════════════════════════
  // GIGABIT ETHERNET PORTLAR
  // ═══════════════════════════════════════
  "GE_0_0": {
    nomi:       "GE 0/0 — Gigabit Ethernet Port",
    tezlik:     "10 / 100 / 1000 Mbps",
    konnektyor: "RJ-45 (8P8C)",
    vazifa:     "WAN yoki LAN ulanishi uchun asosiy port",
    status:     "🟢 Faol",
    maxsus:     "Auto-MDI/MDIX avtomatik aniqlaydi",
    standart:   "IEEE 802.3ab (1000BASE-T)",
    rang:       "#B8860B",
  },

  "GE_0_1": {
    nomi:       "GE 0/1 — Gigabit Ethernet Port",
    tezlik:     "10 / 100 / 1000 Mbps",
    konnektyor: "RJ-45 (8P8C)",
    vazifa:     "Ikkilamchi WAN yoki DMZ segmenti",
    status:     "🟢 Faol",
    maxsus:     "PoE qo'shimcha moduli bilan ishlaydi",
    standart:   "IEEE 802.3ab",
    rang:       "#B8860B",
  },

  // ═══════════════════════════════════════
  // EHWIC PORTLAR
  // ═══════════════════════════════════════
  "EHWIC_2_FE_0": {
    nomi:       "FE 0/0/0 — FastEthernet (EHWIC-2)",
    tezlik:     "10 / 100 Mbps",
    konnektyor: "RJ-45",
    vazifa:     "LAN kengaytirish — 1-port",
    status:     "🟢 Faol",
    maxsus:     "VLAN, QoS, STP protokollarini qo'llab-quvvatlaydi",
    standart:   "IEEE 802.3u (100BASE-TX)",
    rang:       "#444444",
  },

  "EHWIC_2_FE_1": {
    nomi:       "FE 0/0/1 — FastEthernet (EHWIC-2)",
    tezlik:     "10 / 100 Mbps",
    konnektyor: "RJ-45",
    vazifa:     "LAN kengaytirish — 2-port",
    status:     "🟢 Faol",
    maxsus:     "Port-security va 802.1X autentifikatsiyasi",
    standart:   "IEEE 802.3u",
    rang:       "#444444",
  },

  "EHWIC_2_FE_2": {
    nomi:       "FE 0/0/2 — FastEthernet (EHWIC-2)",
    tezlik:     "10 / 100 Mbps",
    konnektyor: "RJ-45",
    vazifa:     "LAN kengaytirish — 3-port",
    status:     "🟡 Ulangan emas",
    maxsus:     "Trunk yoki access rejimida ishlaydi",
    standart:   "IEEE 802.3u",
    rang:       "#444444",
  },

  "EHWIC_2_FE_3": {
    nomi:       "FE 0/0/3 — FastEthernet (EHWIC-2)",
    tezlik:     "10 / 100 Mbps",
    konnektyor: "RJ-45",
    vazifa:     "LAN kengaytirish — 4-port",
    status:     "🟡 Ulangan emas",
    maxsus:     "EtherChannel (LACP/PAgP) uchun ishlatish mumkin",
    standart:   "IEEE 802.3u",
    rang:       "#444444",
  },

  "EHWIC_2_SFP_0": {
    nomi:       "SFP Port 0 — Optik (EHWIC-2)",
    tezlik:     "100 Mbps / 1 Gbps",
    konnektyor: "SFP (LC yoki SC optik)",
    vazifa:     "Fiber optik tarmoq ulanishi",
    status:     "⚫ Bo'sh (chang qopqog'i o'rnatilgan)",
    maxsus:     "1000BASE-LX, 1000BASE-SX modullari mos keladi",
    standart:   "IEEE 802.3z (1000BASE-X)",
    rang:       "#0044ff",
  },

  "EHWIC_3_SERIAL": {
    nomi:       "Serial WAN Port — DB-60 (EHWIC-3)",
    tezlik:     "2 Mbps gacha (sinxron)",
    konnektyor: "DB-60 Smart Serial",
    vazifa:     "Frame Relay, PPP, HDLC WAN protokollari",
    status:     "🟢 Faol",
    maxsus:     "DCE/DTE rejimini avtomatik aniqlaydi. Clock rate sozlanadi.",
    standart:   "EIA/TIA-232, V.35, X.21",
    rang:       "#888888",
  },

  // ═══════════════════════════════════════
  // BOSHQARUV PORTLARI
  // ═══════════════════════════════════════
  "CONSOLE": {
    nomi:       "Console — Boshqaruv Porti",
    tezlik:     "9600 baud (standart)",
    konnektyor: "RJ-45 → DB-9 adapter orqali",
    vazifa:     "Qurilmani dastlabki sozlash va diagnostika",
    status:     "🟢 Doim faol",
    maxsus:     "Cisco IOS CLI ga to'g'ridan-to'g'ri kirish imkoni beradi",
    standart:   "EIA/TIA-232 (async serial)",
    rang:       "#0066ff",
  },

  "AUX": {
    nomi:       "AUX — Yordamchi (Auxiliary) Port",
    tezlik:     "115200 baud gacha",
    konnektyor: "RJ-45",
    vazifa:     "Modem orqali masofaviy boshqaruv",
    status:     "🟡 Faol (ixtiyoriy)",
    maxsus:     "Dial-up backup ulanishi uchun ishlatiladi",
    standart:   "EIA/TIA-232",
    rang:       "#333333",
  },

  // ═══════════════════════════════════════
  // SAQLASH QURILMALARI
  // ═══════════════════════════════════════
  "USB": {
    nomi:       "USB 2.0 Port",
    tezlik:     "USB 2.0 — 480 Mbps",
    konnektyor: "USB Type-A",
    vazifa:     "IOS image yuklash, konfiguratsiya saqlash",
    status:     "🟢 Faol",
    maxsus:     "USB flesh disk orqali IOS yangilash mumkin. FAT32 format.",
    standart:   "USB 2.0 (High Speed)",
    rang:       "#333333",
  },

  "CF_0": {
    nomi:       "CompactFlash Slot 0",
    tezlik:     "UDMA Mode 4",
    konnektyor: "CF Type II",
    vazifa:     "IOS operatsion tizim va konfiguratsiya saqlash",
    status:     "🟢 CF karta o'rnatilgan",
    maxsus:     "Maksimal 4 GB. Industrial darajali CF tavsiya etiladi.",
    standart:   "CompactFlash Association CF+ Specification Rev. 4.1",
    rang:       "#222222",
  },

  "CF_1": {
    nomi:       "CompactFlash Slot 1",
    tezlik:     "UDMA Mode 4",
    konnektyor: "CF Type II",
    vazifa:     "Qo'shimcha saqlash — log fayllar, backup config",
    status:     "⚫ Bo'sh",
    maxsus:     "IOS redundancy va disaster recovery uchun ishlatilishi mumkin",
    standart:   "CF+ Specification Rev. 4.1",
    rang:       "#222222",
  },

  // ═══════════════════════════════════════
  // KENGAYTIRISH MODULLARI
  // ═══════════════════════════════════════
  "PVDM_0": {
    nomi:       "PVDM0 — DSP Moduli Slot",
    tezlik:     "—",
    konnektyor: "Maxsus PVDM interfeysi",
    vazifa:     "VoIP, ovozli qo'ng'iroqlar real-time qayta ishlash",
    status:     "⚫ Modul o'rnatilmagan",
    maxsus:     "PVDM3-16, PVDM3-32, PVDM3-64 modullari mos keladi",
    standart:   "Cisco PVDM3",
    rang:       "#1a1a1a",
  },

  "PVDM_1": {
    nomi:       "PVDM1 — DSP Moduli Slot",
    tezlik:     "—",
    konnektyor: "Maxsus PVDM interfeysi",
    vazifa:     "Qo'shimcha ovoz kanallari, transcoding",
    status:     "⚫ Modul o'rnatilmagan",
    maxsus:     "T1/E1 va FXO/FXS interfeyslari bilan ishlaydi",
    standart:   "Cisco PVDM3",
    rang:       "#1a1a1a",
  },

  "SM": {
    nomi:       "SM — Service Module Slot",
    tezlik:     "—",
    konnektyor: "SM (Service Module) interfeysi",
    vazifa:     "Kengaytirilgan xizmat modullari — 3G, EtherSwitch",
    status:     "⚫ Bo'sh",
    maxsus:     "SM-ES2-24-P (24-port PoE switch) moduli o'rnatiladi",
    standart:   "Cisco SM",
    rang:       "#1a1a1a",
  },

  // ═══════════════════════════════════════
  // QUVVAT VA INDIKATORLAR
  // ═══════════════════════════════════════
  "POWER_SWITCH": {
    nomi:       "Quvvat Kaliti — ON/OFF",
    tezlik:     "—",
    konnektyor: "—",
    vazifa:     "Routerni yoqish va o'chirish",
    status:     "🟢 Yoniq (I pozitsiyasi)",
    maxsus:     "O'chirishdan oldin 'reload' yoki 'shutdown' buyrug'i tavsiya etiladi",
    standart:   "—",
    rang:       "#1a1a1a",
  },

  "IEC_POWER": {
    nomi:       "IEC C14 — AC Quvvat Kiritish",
    tezlik:     "—",
    konnektyor: "IEC 60320 C14",
    vazifa:     "Qurilmaga AC elektr quvvat berish",
    status:     "🟢 Ulangan",
    maxsus:     "100–240V avtomatik, 2–1A, 50–60Hz — universal quvvat",
    standart:   "IEC 60320",
    rang:       "#222222",
  },

  "SYS_LED": {
    nomi:       "SYS — Tizim Holati LED",
    tezlik:     "—",
    konnektyor: "—",
    vazifa:     "Tizim normal ishlayotganini ko'rsatadi",
    status:     "🟢 Yashil miltillaydi",
    maxsus:     "Yashil miltillaydi → IOS yuklanmoqda | Doimiy yashil → tayyor | Qizil → xato",
    standart:   "—",
    rang:       "#00ff41",
  },

  "ACT_LED": {
    nomi:       "ACT — Faollik LED",
    tezlik:     "—",
    konnektyor: "—",
    vazifa:     "Flash xotira yoki CPU faoliyatini ko'rsatadi",
    status:     "🟡 Tez miltillaydi",
    maxsus:     "IOS ishga tushirish paytida tez miltillab turadi",
    standart:   "—",
    rang:       "#ffa500",
  },

  "POE_LED": {
    nomi:       "POE — Power over Ethernet LED",
    tezlik:     "—",
    konnektyor: "—",
    vazifa:     "PoE moduli faol ekanligini ko'rsatadi",
    status:     "🔵 Doimiy ko'k",
    maxsus:     "IEEE 802.3af (15.4W) va 802.3at (30W) standartlarini qo'llab-quvvatlaydi",
    standart:   "IEEE 802.3af / 802.3at",
    rang:       "#00aaff",
  },
};
```

---

## 💬 Tooltip UI Tizimi

```javascript
// interaction/tooltip.js
let tooltipEl = null;

export function createTooltipDOM() {
  tooltipEl = document.createElement('div');
  tooltipEl.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(0, 20, 40, 0.90);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 150, 255, 0.35);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 100, 255, 0.18);
    color: #e0f0ff;
    font-family: 'Courier New', monospace;
    padding: 16px 20px;
    min-width: 280px;
    max-width: 340px;
    display: none;
    z-index: 2000;
    transition: opacity 0.2s ease;
  `;
  document.body.appendChild(tooltipEl);
}

export function showTooltip(portKey, mouseX, mouseY) {
  const data = portData[portKey];
  if (!data) return;

  const statusColor = data.status.startsWith('🟢') ? '#00ff88'
    : data.status.startsWith('🟡') ? '#ffaa00'
    : data.status.startsWith('🔵') ? '#00aaff'
    : '#888888';

  tooltipEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-size:14px; font-weight:bold; color:#00aaff;">
        ${data.nomi}
      </span>
      <button onclick="hideTooltip()" style="
        background:none; border:none; color:#888;
        font-size:18px; cursor:pointer; line-height:1;
      ">×</button>
    </div>

    <div style="border-top:1px solid rgba(0,150,255,0.2); padding-top:10px;">
      ${renderRow('⚡ Tezlik',     data.tezlik)}
      ${renderRow('🔌 Konnektyor', data.konnektyor)}
      ${renderRow('📋 Vazifa',     data.vazifa)}
      ${renderRow('📡 Standart',   data.standart || '—')}
      <div style="display:flex; gap:8px; margin:6px 0; align-items:flex-start;">
        <span style="color:#6688aa; min-width:90px;">🔵 Holat</span>
        <span style="color:${statusColor}; font-size:12px;">${data.status}</span>
      </div>
      ${renderRow('💡 Maxsus',     data.maxsus)}
    </div>
  `;

  tooltipEl.style.display = 'block';
  tooltipEl.style.opacity = '1';
}

function renderRow(label, value) {
  if (!value || value === '—') return '';
  return `
    <div style="display:flex; gap:8px; margin:6px 0; align-items:flex-start;">
      <span style="color:#6688aa; min-width:90px; font-size:11px;">${label}</span>
      <span style="color:#c8e0f0; font-size:11px; line-height:1.4;">${value}</span>
    </div>
  `;
}

export function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.style.opacity = '0';
    setTimeout(() => { tooltipEl.style.display = 'none'; }, 200);
  }
}

window.hideTooltip = hideTooltip; // Global kirish uchun
```

---

## 🏗️ main.js — Loyihani To'liq Yig'ish

```javascript
// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { createChassis }       from './router/chassis.js';
import { createFrontGrille,
         createCiscoLogoPanel,
         createSeriesLabel }   from './router/frontPanel.js';
import { createEHWIC2,
         createEHWIC3,
         createEHWIC1,
         createGE01Port,
         createCFSlots,
         createConsolePorts,
         createUSBPort,
         createBuiltinGEPorts,
         createSFPPorts,
         createPowerSection,
         createIECPowerInlet } from './router/rearPanel.js';
import { createInterior,
         createCPU,
         createRAMModules,
         createCapacitors,
         createCoolingFan,
         fanBlades }           from './router/interior.js';
import { setupPostProcessing } from './postprocessing.js';
import { setupRaycaster }      from './interaction/raycaster.js';
import { createTooltipDOM }    from './interaction/tooltip.js';
import { updateLEDs, leds }    from './interaction/animations.js';
import { portData }            from './data/portData.uz.js';

// ── SAHNA YARATISH ─────────────────────
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.8, 4.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ── CONTROLS ───────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance   = 1.5;
controls.maxDistance   = 8.0;
controls.maxPolarAngle = Math.PI * 0.85;

// ── ROUTER GURUHI ──────────────────────
const routerGroup = new THREE.Group();
scene.add(routerGroup);

// Barcha qismlarni qo'shish
routerGroup.add(createChassis());
routerGroup.add(createFrontGrille());
routerGroup.add(createCiscoLogoPanel());
routerGroup.add(createSeriesLabel());

// Orqa panel
routerGroup.add(createEHWIC3());
routerGroup.add(createEHWIC2());
routerGroup.add(createEHWIC1());
routerGroup.add(createGE01Port());
routerGroup.add(createCFSlots());
routerGroup.add(createConsolePorts());
routerGroup.add(createUSBPort());
routerGroup.add(createBuiltinGEPorts());
routerGroup.add(createSFPPorts());

const { group: powerGroup, switchMesh } = createPowerSection();
routerGroup.add(powerGroup);
routerGroup.add(createIECPowerInlet());

// Ichki qism
const interiorGroup = new THREE.Group();
interiorGroup.visible = false;
createCPU(interiorGroup);
createRAMModules(interiorGroup);
createCapacitors(interiorGroup);
createCoolingFan(interiorGroup);
routerGroup.add(interiorGroup);

// ── POST-PROCESSING ────────────────────
const composer = setupPostProcessing(renderer, scene, camera);

// ── INTERAKTIVLIK ──────────────────────
createTooltipDOM();
setupRaycaster(scene, camera, renderer);

// ── ANIMATE ────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateLEDs();
  if (fanBlades) fanBlades.rotation.z += 0.05;
  composer.render();
}
animate();

// ── RESPONSIVE ────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

console.log(`
╔══════════════════════════════════════╗
║   Cisco 2901 Router — 3D Viewer      ║
║   Three.js r128 | Ilyos aka          ║
╠══════════════════════════════════════╣
║  [Scroll]      Zoom                  ║
║  [Drag]        Rotate                ║
║  [Click port]  Port ma'lumoti        ║
║  [DblClick]    Qopqoqni och/yop      ║
╚══════════════════════════════════════╝
`);
```

---

## 🚀 index.html — To'liq Shablon

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cisco 2901 Router — 3D Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #050a12;
      overflow: hidden;
      font-family: 'Courier New', monospace;
    }
    canvas { display: block; }

    /* Loading ekran */
    #loading {
      position: fixed; inset: 0;
      background: #050a12;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #00aaff;
      font-size: 18px;
      z-index: 9999;
      transition: opacity 0.5s;
    }
    #loading-bar-wrap {
      width: 280px; height: 4px;
      background: rgba(0,100,255,0.2);
      border-radius: 2px;
      margin-top: 16px;
    }
    #loading-bar {
      height: 100%;
      background: linear-gradient(90deg, #00aaff, #0066ff);
      border-radius: 2px;
      width: 0%;
      transition: width 0.3s;
    }
  </style>

  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js",
      "three/examples/jsm/controls/OrbitControls":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js",
      "three/examples/jsm/loaders/RGBELoader":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/RGBELoader.js",
      "three/examples/jsm/loaders/FontLoader":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/FontLoader.js",
      "three/examples/jsm/geometries/TextGeometry":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/geometries/TextGeometry.js",
      "three/examples/jsm/postprocessing/EffectComposer":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js",
      "three/examples/jsm/postprocessing/RenderPass":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/RenderPass.js",
      "three/examples/jsm/postprocessing/UnrealBloomPass":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js",
      "three/examples/jsm/postprocessing/SMAAPass":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/SMAAPass.js",
      "three/examples/jsm/lights/RectAreaLightUniformsLib":
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/lights/RectAreaLightUniformsLib.js"
    }
  }
  </script>
</head>
<body>

  <!-- Loading ekrani -->
  <div id="loading">
    <div>🔌 Cisco 2901 — yuklanmoqda...</div>
    <div id="loading-bar-wrap">
      <div id="loading-bar"></div>
    </div>
  </div>

  <script type="module" src="./src/main.js"></script>

  <script>
    // Loading progressi simulatsiyasi
    let progress = 0;
    const bar = document.getElementById('loading-bar');
    const loadingEl = document.getElementById('loading');
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingEl.style.opacity = '0';
          setTimeout(() => loadingEl.style.display = 'none', 500);
        }, 300);
      }
      bar.style.width = progress + '%';
    }, 150);
  </script>

</body>
</html>
```

---

## ✅ Loyiha Tekshiruv Ro'yxati (Checklist)

| # | Qism | Holat |
|---|------|-------|
| 1 | Sahna, kamera, renderer | ☐ |
| 2 | OrbitControls | ☐ |
| 3 | 5 ta yoritish manbai | ☐ |
| 4 | HDR environment map | ☐ |
| 5 | Asosiy korpus geometriyasi | ☐ |
| 6 | Cisco logo (embossed TextGeometry) | ☐ |
| 7 | Chevron ventilatsiya panjarasi | ☐ |
| 8 | 3 ta LED (SYS, ACT, POE) + animatsiya | ☐ |
| 9 | EHWIC 3 (Serial port) | ☐ |
| 10 | EHWIC 2 (4×FE + 4×SFP) | ☐ |
| 11 | EHWIC 1 (laser stiker) | ☐ |
| 12 | GE 0/0, GE 0/1 portlari | ☐ |
| 13 | CF 0, CF 1 slotlari | ☐ |
| 14 | Console, AUX, USB portlari | ☐ |
| 15 | SFP combo portlari | ☐ |
| 16 | Quvvat kaliti va IEC C14 | ☐ |
| 17 | PCB, CPU+heatsink, RAM modullari | ☐ |
| 18 | Sovutish ventilyatori (animatsiyali) | ☐ |
| 19 | Qopqoq ochish animatsiyasi (GSAP) | ☐ |
| 20 | Raycaster (hover + klik) | ☐ |
| 21 | O'zbek tooltip tizimi (19 port) | ☐ |
| 22 | UI boshqaruv paneli | ☐ |
| 23 | UnrealBloomPass (LED glow) | ☐ |
| 24 | SMAA anti-aliasing | ☐ |
| 25 | Responsive (resize handler) | ☐ |
