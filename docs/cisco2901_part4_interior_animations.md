# 🎯 Cisco 2901 Router — Three.js Loyihasi
## QISM 4: Quvvat Bo'limi, Ichki Qism, Animatsiyalar va Post-Processing

---

## ⚡ Quvvat Bo'limi (Orqa Panel — O'ng Tomon)

### Quvvat Kaliti (ON/OFF Switch)

```javascript
// rearPanel.js
export function createPowerSection() {
  const group = new THREE.Group();

  // Switch korpusi
  const switchGeo = new THREE.BoxGeometry(0.025, 0.045, 0.012);
  const switchMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.70, roughness: 0.40
  });
  const switchMesh = new THREE.Mesh(switchGeo, switchMat);
  switchMesh.position.set(1.65, 0.05, -1.841);
  switchMesh.name = 'POWER_SWITCH';
  group.add(switchMesh);

  // I/O belgisi (CanvasTexture)
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 64, 96);

  // "I" belgisi (yoqilgan)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('I', 32, 30);

  // "O" belgisi (o'chirilgan)
  ctx.fillText('O', 32, 70);

  const tex = new THREE.CanvasTexture(canvas);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.022, 0.040),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  label.rotation.y = Math.PI;
  label.position.set(1.65, 0.05, -1.843);
  group.add(label);

  return { group, switchMesh };
}
```

### IEC C14 Quvvat Kiritish

```javascript
export function createIECPowerInlet() {
  const group = new THREE.Group();

  // Asosiy quti
  const inletGeo = new THREE.BoxGeometry(0.06, 0.045, 0.015);
  const inletMat = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.75, roughness: 0.45
  });
  const inlet = new THREE.Mesh(inletGeo, inletMat);
  inlet.position.set(1.78, 0.05, -1.841);
  inlet.name = 'IEC_POWER';
  group.add(inlet);

  // 3 ta pin teshigi
  const pinPositions = [
    { x: 0, y: 0.012 },   // Yuqori — Earth (L)
    { x: -0.015, y: -0.008 }, // Chap — Neutral (N)
    { x: 0.015, y: -0.008 },  // O'ng — Live
  ];

  pinPositions.forEach(p => {
    const pinGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.016, 8);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0x050505, metalness: 0.50, roughness: 0.80
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(1.78 + p.x, 0.05 + p.y, -1.840);
    group.add(pin);
  });

  // Texnik ma'lumot stikeri
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = '#cccccc';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('100-240V~', 64, 15);
  ctx.fillText('2-1A', 64, 30);
  ctx.fillText('50-60 Hz', 64, 45);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.055, 0.028),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
  );
  label.rotation.y = Math.PI;
  label.position.set(1.78, 0.085, -1.843);
  group.add(label);

  return group;
}
```

---

## 🔧 Ichki Qism (Interior) — Qopqoq Ochilganda Ko'rinadi

### PCB (Printed Circuit Board)

```javascript
// interior.js
export function createInterior() {
  const group = new THREE.Group();
  group.visible = false; // Dastlab yashirin

  // PCB Asosiy Plata
  const pcbCanvas = document.createElement('canvas');
  pcbCanvas.width = 1024; pcbCanvas.height = 768;
  const ctx = pcbCanvas.getContext('2d');

  // Yashil PCB foni
  ctx.fillStyle = '#1a4a1a';
  ctx.fillRect(0, 0, 1024, 768);

  // PCB trace chiziqlar (gorizontal)
  ctx.strokeStyle = '#2a7a2a';
  ctx.lineWidth = 1;
  for (let y = 0; y < 768; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // PCB trace chiziqlar (vertikal)
  for (let x = 0; x < 1024; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 768);
    ctx.stroke();
  }

  // Via nuqtalari
  ctx.fillStyle = '#4aaa4a';
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 768;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const pcbGeo = new THREE.PlaneGeometry(4.0, 3.4);
  const pcbMat = new THREE.MeshStandardMaterial({
    map: new THREE.CanvasTexture(pcbCanvas),
    metalness: 0.1,
    roughness: 0.9,
  });
  const pcb = new THREE.Mesh(pcbGeo, pcbMat);
  pcb.rotation.x = -Math.PI / 2;
  pcb.position.set(0, -0.20, 0);
  group.add(pcb);

  return group;
}
```

### CPU va Heatsink

```javascript
export function createCPU(parentGroup) {
  const group = new THREE.Group();

  // CPU chip
  const cpuGeo = new THREE.BoxGeometry(0.35, 0.035, 0.35);
  const cpuMat = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.70, roughness: 0.40
  });
  const cpu = new THREE.Mesh(cpuGeo, cpuMat);
  cpu.position.set(0, -0.175, 0.2);
  group.add(cpu);

  // CPU yozuvi
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#888888';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CISCO', 64, 55);
  ctx.fillText('CPU', 64, 72);
  ctx.fillText('MPC8572E', 64, 90);

  cpu.material.map = new THREE.CanvasTexture(canvas);

  // Heatsink (12 ta alümin qanot)
  const heatsinkMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, metalness: 0.85, roughness: 0.25
  });
  for (let i = 0; i < 12; i++) {
    const finGeo = new THREE.BoxGeometry(0.30, 0.06, 0.008);
    const fin = new THREE.Mesh(finGeo, heatsinkMat);
    fin.position.set(0, -0.140 + (i * 0.005), 0.2 - 0.14 + i * 0.026);
    group.add(fin);
  }

  parentGroup.add(group);
  return group;
}
```

### RAM Modullari

```javascript
export function createRAMModules(parentGroup) {
  const ramMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, metalness: 0.80, roughness: 0.35
  });

  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.70, roughness: 0.50
  });

  for (let r = 0; r < 2; r++) {
    const group = new THREE.Group();

    // RAM plata
    const ramGeo = new THREE.BoxGeometry(0.80, 0.005, 0.12);
    const ram = new THREE.Mesh(ramGeo, ramMat);
    ram.position.set(-0.5 + r * 1.1, -0.17, -0.3);
    group.add(ram);

    // RAM chip bumplari
    for (let c = 0; c < 8; c++) {
      const chipGeo = new THREE.BoxGeometry(0.08, 0.008, 0.06);
      const chip = new THREE.Mesh(chipGeo, chipMat);
      chip.position.set(-0.5 + r * 1.1 - 0.30 + c * 0.09, -0.165, -0.3);
      group.add(chip);
    }

    // Oltin kontakt chiziqlar
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700, metalness: 0.95, roughness: 0.10
    });
    for (let g = 0; g < 40; g++) {
      const gGeo = new THREE.BoxGeometry(0.003, 0.012, 0.001);
      const gMesh = new THREE.Mesh(gGeo, goldMat);
      gMesh.position.set(-0.5 + r * 1.1 - 0.38 + g * 0.02, -0.178, -0.3 + 0.06);
      group.add(gMesh);
    }

    parentGroup.add(group);
  }
}
```

### Kondansatörlar va Boshqa Komponentlar

```javascript
export function createCapacitors(parentGroup) {
  const colors = [0x333333, 0x444444, 0x1a3a1a, 0x3a1a1a];

  for (let i = 0; i < 8; i++) {
    const capGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.04, 12);
    const capMat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length], metalness: 0.30, roughness: 0.70
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(-1.5 + i * 0.40, -0.155, -0.8);
    parentGroup.add(cap);

    // Kondansator ustidagi belgi
    const topGeo = new THREE.CircleGeometry(0.010, 12);
    const topMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.rotation.x = -Math.PI / 2;
    top.position.set(-1.5 + i * 0.40, -0.135, -0.8);
    parentGroup.add(top);
  }
}
```

### Sovutish Ventilyatori

```javascript
export let fanBlades = null;

export function createCoolingFan(parentGroup) {
  const group = new THREE.Group();

  // Fan ramkasi
  const frameGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.015, 32, 1, true);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.70, roughness: 0.50, side: THREE.DoubleSide
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.rotation.x = Math.PI / 2;
  frame.position.set(1.5, -0.18, -1.5);
  group.add(frame);

  // Fan qanotlari (7 ta)
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x333333, metalness: 0.80, roughness: 0.30,
    side: THREE.DoubleSide
  });

  const bladeGroup = new THREE.Group();
  bladeGroup.position.set(1.5, -0.18, -1.5);

  for (let i = 0; i < 7; i++) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.02, 0.04, 0, 0.08);
    shape.quadraticCurveTo(-0.01, 0.04, 0, 0);

    const bladeGeo = new THREE.ShapeGeometry(shape);
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.rotation.z = (i / 7) * Math.PI * 2;
    blade.rotation.x = Math.PI / 2;
    bladeGroup.add(blade);
  }

  fanBlades = bladeGroup;
  parentGroup.add(group);
  parentGroup.add(bladeGroup);
}
```

---

## 🎬 GSAP Animatsiyalari

### Qopqoq Ochish Animatsiyasi (Lid Flip)

```javascript
// animations.js
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';

let lidOpen = false;
let lidGroup = null; // Yuqori panel guruhi

export function setupLid(chassisGroup) {
  lidGroup = new THREE.Group();

  // Qopqoqni old qirraga (hinge) nisbatan burish uchun
  // Pivotni old qirraga o'rnatamiz
  const lid = createTopPanel(); // TopPanel geometriyasi
  lidGroup.add(lid);

  // Hinge nuqtasi: z = +1.84 (old qirra)
  lidGroup.position.set(0, 0.22, 1.84);
  chassisGroup.add(lidGroup);
}

export function triggerLidAnimation() {
  if (lidOpen) return;
  lidOpen = true;

  // Ichki qismni ko'rsatish
  interiorGroup.visible = true;

  gsap.to(lidGroup.rotation, {
    x: -1.92,        // ~110 daraja
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      console.log('Qopqoq ochildi — ichki qism ko'rinmoqda');
    }
  });
}

export function closeLidAnimation() {
  if (!lidOpen) return;
  lidOpen = false;

  gsap.to(lidGroup.rotation, {
    x: 0,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      interiorGroup.visible = false;
    }
  });
}
```

### Quvvat Kaliti Animatsiyasi

```javascript
export function togglePowerSwitch(switchMesh) {
  const targetRotX = switchMesh.userData.on ? 0 : -0.26;  // ~15 daraja
  switchMesh.userData.on = !switchMesh.userData.on;

  gsap.to(switchMesh.rotation, {
    x: targetRotX,
    duration: 0.12,
    ease: 'power1.inOut',
  });

  // Quvvat animatsiyasi: LEDlar yonadi/o'chadi
  const intensity = switchMesh.userData.on ? 2.5 : 0.0;
  gsap.to(leds.sys.ledMat, { emissiveIntensity: intensity, duration: 0.3 });
  gsap.to(leds.act.ledMat, { emissiveIntensity: intensity, duration: 0.3 });
  gsap.to(leds.poe.ledMat, { emissiveIntensity: intensity, duration: 0.3 });
}
```

### Kamera Reset Animatsiyasi

```javascript
export function resetCamera() {
  gsap.to(camera.position, {
    x: 0, y: 0.8, z: 4.5,
    duration: 1.0,
    ease: 'power2.inOut',
  });
  gsap.to(controls.target, {
    x: 0, y: 0, z: 0,
    duration: 1.0,
    ease: 'power2.inOut',
    onUpdate: () => controls.update(),
  });
}
```

---

## ✨ Post-Processing (EffectComposer)

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

let composer;

export function setupPostProcessing(renderer, scene, camera) {
  composer = new EffectComposer(renderer);

  // 1. Asosiy render
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. Bloom effekt — LED glow
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4,    // strength — kuchlilik
    0.3,    // radius — tarqalish
    0.85    // threshold — ostonа
  );
  composer.addPass(bloomPass);

  // 3. SMAA — anti-aliasing
  const smaaPass = new SMAAPass(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio()
  );
  composer.addPass(smaaPass);

  return composer;
}

// Animate loop da render o'rniga composer ishlatiladi:
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateLEDs();
  if (fanBlades) fanBlades.rotation.z += 0.05;
  composer.render(); // renderer.render() o'rniga!
}
```

---

## 🖥️ UI Boshqaruv Paneli

```javascript
// UI panelini HTML da yarating
const uiPanel = document.createElement('div');
uiPanel.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 20, 40, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 100, 255, 0.15);
  padding: 16px;
  color: #e0f0ff;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  z-index: 1000;
  min-width: 180px;
`;

const buttons = [
  { label: '🔓 Qopqoqni och',    fn: () => triggerLidAnimation() },
  { label: '🔒 Qopqoqni yop',    fn: () => closeLidAnimation() },
  { label: '💡 LEDlarni yoq',    fn: () => toggleAllLEDs(true) },
  { label: '⚡ Quvvat',          fn: () => togglePowerSwitch(powerSwitch) },
  { label: '🔄 Kamerani reset',  fn: () => resetCamera() },
  { label: '📋 Port ro\'yxati',  fn: () => showPortList() },
];

buttons.forEach(({ label, fn }) => {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.cssText = `
    display: block; width: 100%;
    margin: 4px 0; padding: 8px 12px;
    background: rgba(0, 80, 160, 0.4);
    border: 1px solid rgba(0, 150, 255, 0.4);
    border-radius: 6px; color: #e0f0ff;
    font-family: inherit; font-size: 12px;
    cursor: pointer; text-align: left;
    transition: background 0.2s;
  `;
  btn.addEventListener('mouseover', () => {
    btn.style.background = 'rgba(0, 100, 200, 0.6)';
  });
  btn.addEventListener('mouseout', () => {
    btn.style.background = 'rgba(0, 80, 160, 0.4)';
  });
  btn.addEventListener('click', fn);
  uiPanel.appendChild(btn);
});

document.body.appendChild(uiPanel);
```
