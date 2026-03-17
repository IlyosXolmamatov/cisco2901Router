# 🎯 Cisco 2901 Router — Three.js Loyihasi
## QISM 3: Old Panel LED va Orqa Panel Portlari

---

## 💡 Old Panel — LED Indikatorlari

### LED Yordamchi Funksiya

```javascript
// frontPanel.js
function createLED(color, emissive, x, y, z) {
  const group = new THREE.Group();

  // LED disk geometriyasi
  const ledGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.003, 16);
  const ledMat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: emissive,
    emissiveIntensity: 2.5,
    metalness: 0.0,
    roughness: 0.3,
  });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.rotation.x = Math.PI / 2;
  led.position.set(x, y, z);
  group.add(led);

  // LED ortidagi PointLight (glow effekt)
  const light = new THREE.PointLight(emissive, 0.3, 0.1);
  light.position.set(x, y, z - 0.01);
  group.add(light);

  return { group, ledMat, light };
}
```

### 3 ta LED Yaratiish

```javascript
export const leds = {};

// 1. SYS LED — Yashil
leds.sys = createLED(0x00ff41, 0x00ff41, -1.72, -0.17, 1.843);
scene.add(leds.sys.group);

// 2. ACT LED — Sariq/To'sariq
leds.act = createLED(0xffa500, 0xffa500, -1.66, -0.17, 1.843);
scene.add(leds.act.group);

// 3. POE LED — Ko'k
leds.poe = createLED(0x00aaff, 0x00aaff, -1.60, -0.17, 1.843);
scene.add(leds.poe.group);
```

### LED Labeları (CanvasTexture)

```javascript
function createLEDLabel(text, x, y, z) {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 64, 32);
  ctx.fillStyle = '#cccccc';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, 32, 20);
  const texture = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 0.02),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  mesh.position.set(x, y - 0.025, z);
  return mesh;
}

scene.add(createLEDLabel('SYS', -1.72, -0.17, 1.844));
scene.add(createLEDLabel('ACT', -1.66, -0.17, 1.844));
scene.add(createLEDLabel('POE', -1.60, -0.17, 1.844));
```

### LED Animatsiyalari

```javascript
// animations.js
let blinkState = true;
setInterval(() => { blinkState = !blinkState; }, 150);

export function updateLEDs() {
  const t = Date.now() / 800;

  // SYS — silliq pulsatsiya
  leds.sys.ledMat.emissiveIntensity = 1.5 + Math.sin(t) * 1.0;
  leds.sys.light.intensity = (1.5 + Math.sin(t)) * 0.15;

  // ACT — tez miltillash
  leds.act.ledMat.emissiveIntensity = blinkState ? 2.5 : 0.0;
  leds.act.light.intensity = blinkState ? 0.3 : 0.0;

  // POE — doimiy yoniq
  leds.poe.ledMat.emissiveIntensity = 2.5;
}
```

---

## 🔌 Orqa Panel — EHWIC Slotlari

### EHWIC Umumiy Frame Yaratish

```javascript
// rearPanel.js
function createEHWICFrame(x, width = 0.28) {
  const group = new THREE.Group();

  const frameGeo = new THREE.BoxGeometry(width, 0.36, 0.02);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, metalness: 0.70, roughness: 0.50
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(x, 0, -1.841);
  group.add(frame);

  // Chiqarish dastagi (ejector) — ko'k
  const ejectorGeo = new THREE.BoxGeometry(0.008, 0.30, 0.015);
  const ejectorMat = new THREE.MeshStandardMaterial({
    color: 0x0066cc, metalness: 0.60, roughness: 0.35
  });
  const leftEjector = new THREE.Mesh(ejectorGeo, ejectorMat);
  leftEjector.position.set(x - width / 2 + 0.01, 0, -1.835);
  group.add(leftEjector);

  return group;
}
```

### EHWIC 3 — Serial/WAN Moduli

```javascript
export function createEHWIC3() {
  const group = createEHWICFrame(-1.70, 0.28);

  // DB-60 Serial port (sakkizburchak shakl)
  const shape = new THREE.Shape();
  const w = 0.06, h = 0.03, cut = 0.007;
  shape.moveTo(-w/2 + cut, -h/2);
  shape.lineTo(w/2 - cut, -h/2);
  shape.lineTo(w/2, -h/2 + cut);
  shape.lineTo(w/2, h/2 - cut);
  shape.lineTo(w/2 - cut, h/2);
  shape.lineTo(-w/2 + cut, h/2);
  shape.lineTo(-w/2, h/2 - cut);
  shape.lineTo(-w/2, -h/2 + cut);
  shape.closePath();

  const serialGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: false });
  const serialMat = new THREE.MeshStandardMaterial({
    color: 0x888888, metalness: 0.90, roughness: 0.20
  });
  const serialPort = new THREE.Mesh(serialGeo, serialMat);
  serialPort.position.set(-1.70, 0.05, -1.840);
  serialPort.name = 'EHWIC_3_SERIAL';
  group.add(serialPort);

  // 2 ta status LED
  [-0.03, 0.03].forEach((offset, i) => {
    const ledGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.002, 12);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.rotation.x = Math.PI / 2;
    led.position.set(-1.70 + offset, -0.05, -1.840);
    group.add(led);
  });

  // SERIAL label
  group.add(createRearLabel('SERIAL', -1.70, -0.10, -1.839));
  group.add(createRearLabel('EHWIC 3', -1.70, 0.16, -1.839));

  return group;
}
```

### EHWIC 2 — 4-Port FE + 4-Port SFP

```javascript
function createRJ45Port(x, y, z, name, labelText) {
  const group = new THREE.Group();

  // Tashqi quti
  const bezelGeo = new THREE.BoxGeometry(0.055, 0.042, 0.015);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x444444, metalness: 0.75, roughness: 0.45
  });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(x, y, z);
  bezel.name = name;
  group.add(bezel);

  // Ichki socket (qoʻngʻir bo'shliq)
  const socketGeo = new THREE.BoxGeometry(0.044, 0.034, 0.005);
  const socketMat = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.50, roughness: 0.80
  });
  const socket = new THREE.Mesh(socketGeo, socketMat);
  socket.position.set(x, y, z + 0.006);
  group.add(socket);

  // 2 ta kichik LED (LNK + ACT)
  const ledPositions = [{ dx: 0.015, color: 0x00ff00 }, { dx: 0.025, color: 0xffaa00 }];
  ledPositions.forEach(({ dx, color }) => {
    const ledGeo = new THREE.BoxGeometry(0.006, 0.004, 0.002);
    const ledMat = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 1.8
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(x + dx - 0.02, y + 0.015, z + 0.008);
    group.add(led);
  });

  if (labelText) group.add(createRearLabel(labelText, x, y - 0.028, z + 0.008));
  return group;
}

export function createEHWIC2() {
  const group = createEHWICFrame(-1.10, 0.42);

  // 4× RJ-45 (2×2 joylashuv)
  const fePositions = [
    { x: -1.20, y: 0.07, name: 'EHWIC_2_FE_0', label: 'FE0/0/0' },
    { x: -1.13, y: 0.07, name: 'EHWIC_2_FE_1', label: 'FE0/0/1' },
    { x: -1.20, y: 0.02, name: 'EHWIC_2_FE_2', label: 'FE0/0/2' },
    { x: -1.13, y: 0.02, name: 'EHWIC_2_FE_3', label: 'FE0/0/3' },
  ];
  fePositions.forEach(p => group.add(createRJ45Port(p.x, p.y, -1.841, p.name, p.label)));

  // 4× SFP qafasi
  for (let i = 0; i < 4; i++) {
    const sfpGeo = new THREE.BoxGeometry(0.038, 0.014, 0.020);
    const sfpMat = new THREE.MeshStandardMaterial({
      color: 0x555555, metalness: 0.85, roughness: 0.25
    });
    const sfp = new THREE.Mesh(sfpGeo, sfpMat);
    sfp.position.set(-1.00, 0.07 - i * 0.018, -1.841);
    sfp.name = `EHWIC_2_SFP_${i}`;

    // Ko'k chang qopqog'i
    const plugGeo = new THREE.BoxGeometry(0.030, 0.010, 0.008);
    const plugMat = new THREE.MeshStandardMaterial({
      color: 0x0044ff, transparent: true, opacity: 0.7
    });
    const plug = new THREE.Mesh(plugGeo, plugMat);
    plug.position.set(-1.00, 0.07 - i * 0.018, -1.836);

    group.add(sfp);
    group.add(plug);
  }

  group.add(createRearLabel('EHWIC 2', -1.10, 0.16, -1.839));
  return group;
}
```

### EHWIC 1 — Bo'sh + Laser Ogohlantirish

```javascript
export function createEHWIC1() {
  const group = new THREE.Group();

  // Bo'sh faceplate
  const plateGeo = new THREE.BoxGeometry(0.32, 0.36, 0.005);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.set(-0.45, 0, -1.841);
  group.add(plate);

  // Sariq laser ogohlantirish stiкeri (CanvasTexture)
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('⚠ CAUTION: LASER PRODUCT', 128, 25);
  ctx.font = '11px Arial';
  ctx.fillText('CLASS 1 LASER', 128, 45);
  ctx.fillText('PRODUIT LASER DE CLASSE 1', 128, 65);
  ctx.fillText('PRODUCTO LASER CLASE 1', 128, 85);
  ctx.fillText('LASERPRODUKT DER KLASSE 1', 128, 105);

  const sticker = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.10),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
  );
  sticker.position.set(-0.45, 0, -1.838);
  sticker.rotation.z = 0.02;  // Hafif qiyshiq
  group.add(sticker);

  group.add(createRearLabel('EHWIC 1', -0.45, 0.16, -1.839));
  return group;
}
```

---

## 🔌 Markaziy Bo'lim Portlari

### GE 0/1 Port

```javascript
export function createGE01Port() {
  const group = new THREE.Group();
  const port = createRJ45Port(0.18, -0.02, -1.841, 'GE_0_1', 'GE 0/1');

  // Yashil bezel (GE portni ajratib ko'rsatish)
  const bezel = port.children[0];
  bezel.material = new THREE.MeshStandardMaterial({
    color: 0x1a5a1a, metalness: 0.75, roughness: 0.40
  });

  group.add(port);
  return group;
}
```

### CompactFlash Slotlari

```javascript
export function createCFSlots() {
  const group = new THREE.Group();

  ['CF 0', 'CF 1'].forEach((label, i) => {
    // Slot qutisi
    const slotGeo = new THREE.BoxGeometry(0.055, 0.040, 0.008);
    const slotMat = new THREE.MeshStandardMaterial({
      color: 0x222222, metalness: 0.70, roughness: 0.50
    });
    const slot = new THREE.Mesh(slotGeo, slotMat);
    slot.position.set(0.30 + i * 0.08, 0.05, -1.841);
    slot.name = `CF_${i}`;
    group.add(slot);

    // Chiqarish tugmasi
    const btnGeo = new THREE.SphereGeometry(0.004, 8, 8);
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0x888888, metalness: 0.90, roughness: 0.20
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0.30 + i * 0.08, 0.075, -1.838);
    group.add(btn);

    group.add(createRearLabel(label, 0.30 + i * 0.08, 0.015, -1.839));
  });

  return group;
}
```

### Console va AUX Portlari

```javascript
export function createConsolePorts() {
  const group = new THREE.Group();

  // CONSOLE port — ko'k bezel
  const consoleGeo = new THREE.BoxGeometry(0.055, 0.042, 0.015);
  const consoleMat = new THREE.MeshStandardMaterial({
    color: 0x0066ff, metalness: 0.70, roughness: 0.40
  });
  const console_ = new THREE.Mesh(consoleGeo, consoleMat);
  console_.position.set(0.85, 0, -1.841);
  console_.name = 'CONSOLE';
  group.add(console_);

  // Ichki socket
  const socketGeo = new THREE.BoxGeometry(0.044, 0.034, 0.005);
  const socketMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
  const socket = new THREE.Mesh(socketGeo, socketMat);
  socket.position.set(0.85, 0, -1.837);
  group.add(socket);

  group.add(createRearLabel('CONSOLE', 0.85, -0.030, -1.839));

  // AUX port
  const auxPort = createRJ45Port(0.95, 0.12, -1.841, 'AUX', 'AUX');
  group.add(auxPort);

  return group;
}
```

### USB Port

```javascript
export function createUSBPort() {
  const group = new THREE.Group();

  const usbGeo = new THREE.BoxGeometry(0.022, 0.012, 0.008);
  const usbMat = new THREE.MeshStandardMaterial({
    color: 0x333333, metalness: 0.80, roughness: 0.40
  });
  const usb = new THREE.Mesh(usbGeo, usbMat);
  usb.position.set(0.72, 0, -1.841);
  usb.name = 'USB';
  group.add(usb);

  const innerGeo = new THREE.BoxGeometry(0.016, 0.008, 0.005);
  const inner = new THREE.Mesh(innerGeo, new THREE.MeshStandardMaterial({ color: 0x222266 }));
  inner.position.set(0.72, 0, -1.838);
  group.add(inner);

  group.add(createRearLabel('USB', 0.72, -0.018, -1.839));
  return group;
}
```

---

## 🔌 O'ng Bo'lim — GE Portlari va SFP

### Built-in GE 0/0 va GE 0/1

```javascript
export function createBuiltinGEPorts() {
  const group = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xB8860B, metalness: 0.80, roughness: 0.30
  });

  // 2 ta GE port (tepada va pastda)
  [{ y: 0.06, name: 'GE_0_0', label: 'GE 0/0' },
   { y: 0.00, name: 'GE_0_1', label: 'GE 0/1' }].forEach(p => {
    const geo = new THREE.BoxGeometry(0.068, 0.052, 0.018);
    const mesh = new THREE.Mesh(geo, goldMat);
    mesh.position.set(1.30, p.y, -1.841);
    mesh.name = p.name;
    group.add(mesh);

    // Ichki socket
    const sGeo = new THREE.BoxGeometry(0.056, 0.042, 0.005);
    const s = new THREE.Mesh(sGeo, new THREE.MeshStandardMaterial({ color: 0x050505 }));
    s.position.set(1.30, p.y, -1.836);
    group.add(s);

    group.add(createRearLabel(p.label, 1.30, p.y - 0.032, -1.839));
  });

  return group;
}
```

### SFP Combo Portlari (4 ta)

```javascript
export function createSFPPorts() {
  const group = new THREE.Group();

  for (let i = 0; i < 4; i++) {
    const sfpGeo = new THREE.BoxGeometry(0.038, 0.014, 0.020);
    const sfpMat = new THREE.MeshStandardMaterial({
      color: 0x444444, metalness: 0.85, roughness: 0.25
    });
    const sfp = new THREE.Mesh(sfpGeo, sfpMat);
    sfp.position.set(1.45, 0.10 - i * 0.028, -1.841);
    sfp.name = `SFP_${i}`;

    const plugGeo = new THREE.BoxGeometry(0.030, 0.010, 0.008);
    const plugMat = new THREE.MeshStandardMaterial({
      color: 0x0044ff, transparent: true, opacity: 0.7
    });
    const plug = new THREE.Mesh(plugGeo, plugMat);
    plug.position.set(1.45, 0.10 - i * 0.028, -1.836);

    group.add(sfp);
    group.add(plug);
  }

  return group;
}
```

---

## 🏷️ Orqa Label Yordamchi Funksiya

```javascript
function createRearLabel(text, x, y, z) {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 32);
  ctx.fillStyle = '#aaaaaa';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 64, 20);
  const tex = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.06, 0.015),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  mesh.rotation.y = Math.PI;
  mesh.position.set(x, y, z);
  return mesh;
}
```
