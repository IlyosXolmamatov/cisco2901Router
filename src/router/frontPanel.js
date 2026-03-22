function createFrontPanel() {
  const group = new THREE.Group();

  // Chassis front face is at z = 3.68/2 = 1.84
  // We layer elements slightly in front with thin depth offsets
  const FZ = 1.845;  // front face Z — safely outside chassis (1.84 + gap)
  const D = 0.005;  // base step depth for layering

  // ── 1. Full Front Face Plate ─────────────────────────────────
  // Dark navy base — covers entire chassis front face
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0x0e1e2e, metalness: 0.55, roughness: 0.65
  });
  const face = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.44, D),
    faceMat
  );
  face.position.set(0, 0, FZ);
  face.name = "FRONT_FACE";
  group.add(face);

  // ── 2. Top Header Strip ──────────────────────────────────────
  // Slightly darker thin strip at the very top (holds "Cisco 2900 Series" text)
  const hdrMat = new THREE.MeshStandardMaterial({
    color: 0x080e14, metalness: 0.6, roughness: 0.5
  });
  const header = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.068, D * 1.5),
    hdrMat
  );
  header.position.set(0, 0.186, FZ + D);
  group.add(header);

  // ── 3. Diamond Grille Texture ────────────────────────────────
  // Build diamond/hexagonal mesh pattern on a canvas
  const gCanvas = document.createElement('canvas');
  gCanvas.width = 1024;
  gCanvas.height = 256;
  const gCtx = gCanvas.getContext('2d');
  gCtx.fillStyle = '#0e1e2e';
  gCtx.fillRect(0, 0, 1024, 256);
  const dW = 26, dH = 16;
  gCtx.strokeStyle = '#1b5468';
  gCtx.lineWidth = 1.2;
  for (let row = -1; row <= Math.ceil(256 / dH) + 1; row++) {
    for (let col = -1; col <= Math.ceil(1024 / dW) + 2; col++) {
      const ox = (((row % 2) + 2) % 2 === 0) ? 0 : dW / 2;
      const cx = col * dW + ox;
      const cy = row * dH;
      gCtx.beginPath();
      gCtx.moveTo(cx + dW / 2, cy);
      gCtx.lineTo(cx + dW, cy + dH / 2);
      gCtx.lineTo(cx + dW / 2, cy + dH);
      gCtx.lineTo(cx, cy + dH / 2);
      gCtx.closePath();
      gCtx.stroke();
    }
  }
  const grilleTex = new THREE.CanvasTexture(gCanvas);
  const grilleMat = new THREE.MeshStandardMaterial({
    map: grilleTex, metalness: 0.1, roughness: 0.9
  });
  // Grille sits in the center — leaves ~0.65 on left (logo), ~0.75 on right (power)
  const grille = new THREE.Mesh(
    new THREE.PlaneGeometry(3.00, 0.33),
    grilleMat
  );
  grille.position.set(-0.1, 0.01, FZ + D * 2);
  grille.name = "GRILLE";
  group.add(grille);

  // ── 4. Cisco Wave-Logo (6 arch bars, top-left) ──────────────
  // Classic 6-bar arch: short → tall → short, forming a rainbow arc
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0x00aacc,
    emissive: 0x005577,
    emissiveIntensity: 0.7,
    metalness: 0.3,
    roughness: 0.45
  });
  const barHeights = [0.034, 0.050, 0.065, 0.065, 0.050, 0.034];
  const barW = 0.022;
  const barSpacing = 0.013;
  const logoStartX = -1.945;
  const logoBaseY = 0.115;
  barHeights.forEach((h, i) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(barW, h, D * 3),
      logoMat
    );
    bar.position.set(
      logoStartX + i * (barW + barSpacing),
      logoBaseY + h / 2,
      FZ + D * 1.5
    );
    group.add(bar);
  });

  // "cisco" lowercase italic text — canvas plane
  const ciscoC = document.createElement('canvas');
  ciscoC.width = 168; ciscoC.height = 36;
  const cc = ciscoC.getContext('2d');
  cc.clearRect(0, 0, 168, 36);
  cc.fillStyle = '#00aacc';
  cc.font = 'bold italic 22px Arial';
  cc.textAlign = 'left';
  cc.fillText('cisco', 4, 26);
  const ciscoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.047),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ciscoC), transparent: true })
  );
  ciscoPlane.position.set(-1.875, 0.088, FZ + D * 3);
  group.add(ciscoPlane);

  // ── 5. "Cisco 2900 Series" Header Text ───────────────────────
  const serC = document.createElement('canvas');
  serC.width = 340; serC.height = 38;
  const sc = serC.getContext('2d');
  sc.clearRect(0, 0, 340, 38);
  sc.fillStyle = '#c8d8d8';
  sc.font = '17px Arial';
  sc.textAlign = 'right';
  sc.fillText('Cisco 2900 Series', 334, 26);
  const serPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.60, 0.067),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(serC), transparent: true })
  );
  serPlane.position.set(1.63, 0.186, FZ + D * 2.5);
  group.add(serPlane);

  // ── 6. Left-Right Section Separator ─────────────────────────
  const sepMat = new THREE.MeshStandardMaterial({
    color: 0x1a3a4a, metalness: 0.8, roughness: 0.3
  });
  const sep = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.44, D),
    sepMat
  );
  sep.position.set(1.455, 0, FZ + D * 2);
  group.add(sep);

  // ── 7. Power Section Background (right panel) ────────────────
  const pwrBgMat = new THREE.MeshStandardMaterial({
    color: 0x0a1520, metalness: 0.5, roughness: 0.6
  });
  const pwrBg = new THREE.Mesh(
    new THREE.BoxGeometry(0.74, 0.44, D * 1.5),
    pwrBgMat
  );
  pwrBg.position.set(1.83, 0, FZ + D);
  group.add(pwrBg);

  // ── 8. Power Switch Button ───────────────────────────────────
  const swMat = new THREE.MeshStandardMaterial({
    color: 0x141414, metalness: 0.9, roughness: 0.25
  });
  const powerSwitch = new THREE.Mesh(
    new THREE.BoxGeometry(0.105, 0.205, D * 4),
    swMat
  );
  powerSwitch.position.set(1.68, 0.075, FZ + D * 3);
  powerSwitch.name = "POWER_SWITCH";
  group.add(powerSwitch);

  // Switch border (lighter frame)
  const swBorderMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, metalness: 0.7, roughness: 0.4
  });
  const swBorder = new THREE.Mesh(
    new THREE.BoxGeometry(0.118, 0.218, D * 3),
    swBorderMat
  );
  swBorder.position.set(1.68, 0.075, FZ + D * 2.5);
  group.add(swBorder);

  // "|" (I) symbol on switch
  const symMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6
  });
  const iBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.042, D * 5),
    symMat
  );
  iBar.position.set(1.68, 0.116, FZ + D * 5);
  group.add(iBar);

  // "O" (O/off) ring on switch — torus
  const oRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.019, 0.0045, 8, 22),
    symMat
  );
  oRing.position.set(1.68, 0.054, FZ + D * 5);
  group.add(oRing);

  // ── 9. Power Specifications Text ────────────────────────────
  const specC = document.createElement('canvas');
  specC.width = 140; specC.height = 70;
  const spc = specC.getContext('2d');
  spc.clearRect(0, 0, 140, 70);
  spc.fillStyle = '#99aaaa';
  spc.font = '11px monospace';
  spc.textAlign = 'left';
  spc.fillText('100-240V~', 4, 20);
  spc.fillText('2-3A', 4, 36);
  spc.fillText('50-60 Hz', 4, 52);
  const specPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.21, 0.105),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(specC), transparent: true })
  );
  specPlane.position.set(1.925, 0.075, FZ + D * 3);
  group.add(specPlane);

  // ── 10. Power Connector Port ─────────────────────────────────
  // Outer housing (grey trapezoid-like box)
  const connMat = new THREE.MeshStandardMaterial({
    color: 0x888888, metalness: 0.65, roughness: 0.45
  });
  const connector = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.095, D * 6),
    connMat
  );
  connector.position.set(1.83, -0.088, FZ + D * 2);
  connector.name = "POWER_CONNECTOR";
  group.add(connector);
  // Inner dark socket
  const connInnerMat = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.4, roughness: 0.8
  });
  const connInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.058, D * 2),
    connInnerMat
  );
  connInner.position.set(1.83, -0.088, FZ + D * 6);
  group.add(connInner);

  // ── 11. LED Indicators (bottom-left) ─────────────────────────
  const sysMat = new THREE.MeshStandardMaterial({
    color: 0x00ff55, emissive: 0x00ff55, emissiveIntensity: 2.5
  });
  const sysLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.036, 0.022, D * 4),
    sysMat
  );
  sysLed.position.set(-2.01, -0.163, FZ + D * 3);
  sysLed.name = "SYS_LED";
  group.add(sysLed);

  const actMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 2.5
  });
  const actLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.036, 0.022, D * 4),
    actMat
  );
  actLed.position.set(-1.905, -0.163, FZ + D * 3);
  actLed.name = "ACT_LED";
  group.add(actLed);

  const poeMat = new THREE.MeshStandardMaterial({
    color: 0x3388ff, emissive: 0x3388ff, emissiveIntensity: 2.5
  });
  const poeLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.036, 0.022, D * 4),
    poeMat
  );
  poeLed.position.set(-1.800, -0.163, FZ + D * 3);
  poeLed.name = "POE_LED";
  group.add(poeLed);

  // LED labels ("SYS", "ACT", "POE") — canvas plane
  const ledC = document.createElement('canvas');
  ledC.width = 210; ledC.height = 28;
  const lc = ledC.getContext('2d');
  lc.clearRect(0, 0, 210, 28);
  lc.fillStyle = '#778899';
  lc.font = 'bold 11px Arial';
  lc.textAlign = 'center';
  lc.fillText('SYS', 35, 18);
  lc.fillText('ACT', 105, 18);
  lc.fillText('POE', 175, 18);
  const ledLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.32, 0.042),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ledC), transparent: true })
  );
  ledLabel.position.set(-1.905, -0.183, FZ + D * 3.5);
  group.add(ledLabel);

  // ── Global LED material refs (used by animation loop) ────────
  window.sysMat = sysMat;
  window.actMat = actMat;
  window.poeMat = poeMat;

  return group;
}