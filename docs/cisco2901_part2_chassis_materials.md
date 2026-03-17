# 🎯 Cisco 2901 Router — Three.js Loyihasi
## QISM 2: Korpus Geometriyasi va Materiallar

---

## 🧱 Asosiy Korpus (Main Chassis)

```javascript
// materials.js
export const chassisMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,           // Juda to'q qoʻngʻir-qora
  metalness: 0.85,
  roughness: 0.35,
  envMapIntensity: 1.2,
});

// chassis.js
export function createChassis() {
  const group = new THREE.Group();

  // Asosiy korpus
  const bodyGeo = new THREE.BoxGeometry(4.40, 0.44, 3.68);
  const body = new THREE.Mesh(bodyGeo, chassisMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  return group;
}
```

---

## 🔩 Korpus Teksturasi (Brushed Metal Normal Map)

```javascript
// Protsedural normal map — gorizontal chiziqlar
function createBrushedNormalMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#8080ff'; // Neytral normal rengi
  ctx.fillRect(0, 0, 512, 512);

  // Gorizontal chiziqlar
  for (let y = 0; y < 512; y += 3) {
    const intensity = Math.random() * 20 - 10;
    ctx.fillStyle = `rgb(${128 + intensity}, ${128 + intensity}, 255)`;
    ctx.fillRect(0, y, 512, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

chassisMaterial.normalMap = createBrushedNormalMap();
chassisMaterial.normalScale.set(0.3, 0.3);
```

---

## 🔤 Yuqori Panel — Cisco Logotipi (Embossed)

```javascript
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const fontLoader = new FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
  (font) => {
    const textGeo = new TextGeometry('cisco', {
      font: font,
      size: 0.18,
      height: 0.005,       // Sayoz ekstruziya (embossed effekt)
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.001,
    });

    textGeo.computeBoundingBox();
    const centerX = -(textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) / 2;

    const logoMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.85,
      roughness: 0.20,     // Silliqroq — logotip ajralib turadi
      envMapIntensity: 1.5,
    });

    const logoMesh = new THREE.Mesh(textGeo, logoMat);
    logoMesh.position.set(centerX, 0.223, 0);  // Yuqori yuzada
    logoMesh.rotation.x = -Math.PI / 2;
    scene.add(logoMesh);
  }
);
```

---

## 🔷 Old Panel — Ventilatsiya Panjarasi (Chevron Pattern)

```javascript
// frontPanel.js
export function createFrontGrille() {
  const group = new THREE.Group();

  const grilleMat = new THREE.MeshStandardMaterial({
    color: 0x0d4f6e,    // Ko'k-yashil (teal)
    metalness: 0.90,
    roughness: 0.20,
    envMapIntensity: 1.0,
  });

  // 18 ustun × 3 qator chevron shakli
  const cols = 18;
  const rows = 3;
  const chevWidth  = 0.12;
  const chevHeight = 0.08;
  const gapX = 0.02;
  const gapY = 0.03;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shape = new THREE.Shape();
      // Chevron (o'q belgisi) shakli
      shape.moveTo(0, 0);
      shape.lineTo(chevWidth * 0.4, chevHeight);
      shape.lineTo(chevWidth * 0.6, chevHeight);
      shape.lineTo(chevWidth, 0);
      shape.lineTo(chevWidth * 0.8, 0);
      shape.lineTo(chevWidth * 0.5, chevHeight * 0.65);
      shape.lineTo(chevWidth * 0.2, 0);
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: 0.008,
        bevelEnabled: false,
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mesh = new THREE.Mesh(geo, grilleMat);

      const startX = -1.50;
      const startY = -0.10;

      mesh.position.set(
        startX + c * (chevWidth + gapX),
        startY + r * (chevHeight + gapY),
        1.841
      );
      group.add(mesh);
    }
  }

  return group;
}
```

---

## 🔷 Orqa Panel — Ventilatsiya Panjarasi (Gorizontal Lamellar)

```javascript
export function createRearGrille() {
  const group = new THREE.Group();

  const grilleMat = new THREE.MeshStandardMaterial({
    color: 0x0d4f6e,
    metalness: 0.90,
    roughness: 0.20,
  });

  const slats = 8;
  const slotWidth = 0.80;

  for (let i = 0; i < slats; i++) {
    const geo = new THREE.BoxGeometry(slotWidth, 0.025, 0.01);
    const mesh = new THREE.Mesh(geo, grilleMat);
    mesh.position.set(
      1.6,                          // O'ng tomonda joylashgan
      -0.15 + i * 0.04,
      -1.841
    );
    group.add(mesh);
  }

  return group;
}
```

---

## 🖤 Rack Uchun Qulflash Quloqlari (Rack Ears)

```javascript
export function createRackEars() {
  const group = new THREE.Group();

  const earMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.80,
    roughness: 0.40,
  });

  // Chap quloq
  const leftEarGeo = new THREE.BoxGeometry(0.15, 0.44, 0.04);
  const leftEar = new THREE.Mesh(leftEarGeo, earMat);
  leftEar.position.set(-2.275, 0, 1.841);
  group.add(leftEar);

  // O'ng quloq
  const rightEarGeo = new THREE.BoxGeometry(0.15, 0.44, 0.04);
  const rightEar = new THREE.Mesh(rightEarGeo, earMat);
  rightEar.position.set(2.275, 0, 1.841);
  group.add(rightEar);

  // Vintlar (4ta)
  const screwMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.95,
    roughness: 0.15,
  });

  const screwPositions = [
    [-2.275, 0.15, 1.843], [-2.275, -0.15, 1.843],
    [2.275, 0.15, 1.843],  [2.275, -0.15, 1.843],
  ];

  screwPositions.forEach(pos => {
    const screwGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.005, 8);
    const screw = new THREE.Mesh(screwGeo, screwMat);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(...pos);
    // Phillips (+) belgisi
    const slotH = new THREE.BoxGeometry(0.008, 0.001, 0.003);
    const slotV = new THREE.BoxGeometry(0.001, 0.001, 0.008);
    [slotH, slotV].forEach(s => {
      const m = new THREE.Mesh(s, screwMat);
      m.position.set(...pos);
      m.position.z += 0.003;
      group.add(m);
    });
    group.add(screw);
  });

  return group;
}
```

---

## 🎨 Material Konstantlari (materials.js)

```javascript
// Barcha qismlarda qayta ishlatiladigan materiallar
export const MATERIALS = {
  chassis: new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.85, roughness: 0.35, envMapIntensity: 1.2
  }),
  tealGrille: new THREE.MeshStandardMaterial({
    color: 0x0d4f6e, metalness: 0.90, roughness: 0.20
  }),
  portBezel: new THREE.MeshStandardMaterial({
    color: 0x333333, metalness: 0.75, roughness: 0.45
  }),
  portSocket: new THREE.MeshStandardMaterial({
    color: 0x080808, metalness: 0.50, roughness: 0.80
  }),
  moduleFrame: new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, metalness: 0.70, roughness: 0.50
  }),
  ejectorBlue: new THREE.MeshStandardMaterial({
    color: 0x0066cc, metalness: 0.60, roughness: 0.35
  }),
  goldBezel: new THREE.MeshStandardMaterial({
    color: 0xB8860B, metalness: 0.80, roughness: 0.30   // GE portlar uchun
  }),
  sfpCage: new THREE.MeshStandardMaterial({
    color: 0x444444, metalness: 0.85, roughness: 0.25
  }),
  screwMetal: new THREE.MeshStandardMaterial({
    color: 0x666666, metalness: 0.95, roughness: 0.15
  }),
  ledGreen: new THREE.MeshStandardMaterial({
    color: 0x00ff41, emissive: 0x00ff41, emissiveIntensity: 2.5,
    metalness: 0.0, roughness: 0.3
  }),
  ledAmber: new THREE.MeshStandardMaterial({
    color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 2.5,
    metalness: 0.0, roughness: 0.3
  }),
  ledBlue: new THREE.MeshStandardMaterial({
    color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2.5,
    metalness: 0.0, roughness: 0.3
  }),
};
```

---

## 🏷️ Cisco Logo Belgi Paneli (Chap old burchak)

```javascript
export function createCiscoLogoPanel() {
  const group = new THREE.Group();

  // Qora panel
  const panelGeo = new THREE.BoxGeometry(0.45, 0.38, 0.005);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  panel.position.set(-1.85, 0, 1.843);
  group.add(panel);

  // CanvasTexture: "cisco" matni va nuqtalar chizig'i
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 192;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 256, 192);

  // Nuqtalar chizig'i (Cisco dot pattern)
  const dotColors = ['#00aaff','#0088cc','#0066aa','#0066aa','#0088cc','#00aaff'];
  dotColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(30 + i * 35, 55, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // "cisco" yozuvi
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('cisco', 128, 130);

  const texture = new THREE.CanvasTexture(canvas);
  const logoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.44, 0.37),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  logoPlane.position.set(-1.85, 0, 1.844);
  group.add(logoPlane);

  return group;
}
```

---

## 📌 "Cisco 2900 Series" Yozuvi (O'ng tomonda)

```javascript
export function createSeriesLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'transparent';
  ctx.clearRect(0, 0, 256, 64);

  ctx.fillStyle = '#cccccc';
  ctx.font = 'italic 22px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('Cisco 2900 Series', 248, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.70, 0.08),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  label.position.set(1.65, 0.12, 1.844);
  return label;
}
```
