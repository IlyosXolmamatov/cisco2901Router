function createRearPanel() {
  const group = new THREE.Group();

  // Rear face is at z = -1.84  (chassis depth 3.68 / 2)
  const RZ = -1.845;  // safely outside chassis rear face
  const D = 0.005; // layer step

  // ─────────────────────────────────────────────────────────
  // Helper: make a canvas-label plane
  function labelPlane(text, w, h, fontSize, color, bgAlpha) {
    const S = 3;
    const c = document.createElement('canvas');
    c.width = Math.round(w * 600 * S);
    c.height = Math.round(h * 600 * S);
    const ctx = c.getContext('2d');
    if (bgAlpha) {
      ctx.fillStyle = `rgba(30,30,30,${bgAlpha})`;
      ctx.fillRect(0, 0, c.width, c.height);
    } else {
      ctx.clearRect(0, 0, c.width, c.height);
    }
    ctx.fillStyle = color || '#cccccc';
    ctx.font = `bold ${Math.round(fontSize * S)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, c.width / 2, c.height / 2);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })
    );
    return mesh;
  }

  // Helper: RJ-45 style port (box + inset)
  function rj45(name, x, y, z) {
    const g = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.BoxGeometry(0.085, 0.072, D * 6),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.35 })
    );
    outer.name = name;
    g.add(outer);
    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(0.066, 0.052, D * 3),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 })
    );
    inner.position.z = D * 4;
    g.add(inner);
    // LED dots (green + amber) top of port
    [[-0.018, 0.031], [0.012, 0.031]].forEach((pos, i) => {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.010, D * 3),
        new THREE.MeshStandardMaterial({
          color: i === 0 ? 0x00ff44 : 0xffaa00,
          emissive: i === 0 ? 0x00ff44 : 0xffaa00,
          emissiveIntensity: 2.0
        })
      );
      led.position.set(pos[0], pos[1], D * 5);
      g.add(led);
    });
    g.position.set(x, y, z);
    return g;
  }

  // Helper: small square port (serial/console/USB)
  function sqPort(name, x, y, z, w, h, col) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w || 0.060, h || 0.050, D * 5),
      new THREE.MeshStandardMaterial({ color: col || 0x555555, metalness: 0.6, roughness: 0.5 })
    );
    m.name = name;
    m.position.set(x, y, z);
    return m;
  }

  // Helper: tiny LED pill
  function led(name, x, y, z, col) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.016, D * 4),
      new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 2.2 })
    );
    m.name = name;
    m.position.set(x, y, z);
    return m;
  }

  // ── 1. FULL REAR FACE PLATE ─────────────────────────────────
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0xd0cfc8, metalness: 0.45, roughness: 0.65
  });
  const face = new THREE.Mesh(new THREE.BoxGeometry(4.40, 0.44, D), faceMat);
  face.position.set(0, 0, RZ);
  face.name = "REAR_FACE";
  group.add(face);

  // Thin top dark strip (vent area)
  const topStrip = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.055, D * 1.5),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.5 })
  );
  topStrip.position.set(0, 0.192, RZ + D);
  group.add(topStrip);

  // ── 2. EHWIC SLOT DIVIDERS ───────────────────────────────────
  // 4 EHWIC slots:  x boundaries (panel width 4.40, rightmost ~0.65 for logo)
  // EHWIC3: -2.20 to -1.28   EHWIC2: -1.28 to -0.38
  // EHWIC1: -0.38 to +0.58   EHWIC0: +0.58 to +1.10
  const ehwicSlots = [
    { name: 'EHWIC3', x: -1.740, w: 0.880 },
    { name: 'EHWIC2', x: -0.830, w: 0.880 },
    { name: 'EHWIC1', x: 0.100, w: 0.940 },
    { name: 'EHWIC0', x: 0.845, w: 0.450 },
  ];

  const slotMat = new THREE.MeshStandardMaterial({
    color: 0x404040, metalness: 0.7, roughness: 0.45
  });
  const slotInnerMat = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.5, roughness: 0.7
  });
  const slotBorderMat = new THREE.MeshStandardMaterial({
    color: 0x888880, metalness: 0.55, roughness: 0.5
  });

  ehwicSlots.forEach(s => {
    // Slot border frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(s.w, 0.325, D * 2),
      slotBorderMat
    );
    frame.position.set(s.x, 0.028, RZ + D * 1.5);
    frame.name = s.name + '_FRAME';
    group.add(frame);

    // Slot inner (darker recess)
    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(s.w - 0.020, 0.305, D),
      slotInnerMat
    );
    inner.position.set(s.x, 0.028, RZ + D * 2.5);
    inner.name = s.name + '_INNER';
    group.add(inner);

    // Slot label above
    const lbl = labelPlane(s.name, s.w * 0.7, 0.035, 7, '#aaaaaa');
    lbl.position.set(s.x, 0.200, RZ + D * 3);
    group.add(lbl);
  });

  // Vertical separator bars between slots
  [-1.285, -0.375, 0.575, 1.115].forEach(x => {
    const sep = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.44, D * 2),
      new THREE.MeshStandardMaterial({ color: 0x555550, metalness: 0.8, roughness: 0.3 })
    );
    sep.position.set(x, 0, RZ + D * 1.2);
    group.add(sep);
  });

  // ── 3. EHWIC 3 — module ports (left-most slot) ──────────────
  // Small WIC-style ports: typically 2x serial / 1x WAN
  const e3z = RZ + D * 4;
  // Two mini serial ports (D-sub style)
  [-1.870, -1.640].forEach((x, i) => {
    const p = sqPort('EHWIC3_SER' + i, x, 0.075, e3z, 0.105, 0.065, 0x5a5a72);
    group.add(p);
    // label
    const l = labelPlane('SER ' + i, 0.10, 0.028, 6, '#8888aa');
    l.position.set(x, -0.005, e3z + D);
    group.add(l);
  });
  // Screw holes on module bracket
  [-2.145, -1.350].forEach(x => {
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, D * 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x999990, metalness: 0.9, roughness: 0.2 })
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(x, 0.130, e3z);
    group.add(screw);
  });

  // ── 4. EHWIC 2 — WAN/DSL module ─────────────────────────────
  const e2z = RZ + D * 4;
  // Long horizontal port (HWIC-1ADSL or similar)
  const wanPort = sqPort('EHWIC2_WAN', -0.830, 0.065, e2z, 0.38, 0.055, 0x444444);
  group.add(wanPort);
  const wanLbl = labelPlane('WAN / xDSL', 0.30, 0.028, 6, '#999999');
  wanLbl.position.set(-0.830, -0.005, e2z + D);
  group.add(wanLbl);
  // HWIC-1CE label on module face
  const hwicLbl = labelPlane('HWIC-1CE', 0.38, 0.030, 7, '#aaaacc', 0.3);
  hwicLbl.position.set(-0.830, 0.130, e2z + D);
  group.add(hwicLbl);
  [-1.245, -0.415].forEach(x => {
    const sc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, D * 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x999990, metalness: 0.9, roughness: 0.2 })
    );
    sc.rotation.x = Math.PI / 2;
    sc.position.set(x, 0.130, e2z);
    group.add(sc);
  });

  // ── 5. EHWIC 1 — GE 0 (+SM/EN/LINK/TX/RX LEDs) ─────────────
  // This slot has the built-in GE 0/0 port + status LEDs
  const e1z = RZ + D * 4;

  // Warning/product label (yellow, center of slot)
  const warnC = document.createElement('canvas');
  warnC.width = 256; warnC.height = 120;
  const wc = warnC.getContext('2d');
  wc.fillStyle = '#e8c800';
  wc.fillRect(0, 0, 256, 120);
  wc.fillStyle = '#111111';
  wc.font = 'bold 11px Arial'; wc.textAlign = 'center';
  wc.fillText('CISCO PRODUCT', 128, 20);
  wc.fillText('USER CLASS 1', 128, 38);
  wc.fillText('LASER PRODUCT', 128, 56);
  wc.font = '9px Arial';
  wc.fillText('IEC 60825-1', 128, 76);
  const warnPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.200, 0.095),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(warnC), transparent: false })
  );
  warnPlane.position.set(0.055, 0.090, e1z + D);
  group.add(warnPlane);

  // GE 0 port (large black SFP/combo)
  const ge0Box = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.088, D * 6),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.4, roughness: 0.7 })
  );
  ge0Box.name = 'GE_0';
  ge0Box.position.set(0.240, 0.010, e1z);
  group.add(ge0Box);
  const ge0Lbl = labelPlane('GE 0', 0.09, 0.026, 7, '#00ccff');
  ge0Lbl.position.set(0.240, -0.060, e1z + D);
  group.add(ge0Lbl);

  // HWIC USE-SFP label
  const sfpLbl = labelPlane('HWIC\nUSE-SFP', 0.085, 0.040, 6, '#8888aa');
  sfpLbl.position.set(0.140, -0.045, e1z + D);
  group.add(sfpLbl);

  // SM / EN / LINK / TX / RX LEDs row
  const ledRow = [
    { name: 'SM_LED', col: 0x00ff44, lbl: 'SM' },
    { name: 'EN_LED', col: 0x00ff44, lbl: 'EN' },
    { name: 'LINK_LED', col: 0xffaa00, lbl: 'LINK' },
    { name: 'TX_LED', col: 0xffaa00, lbl: 'TX' },
    { name: 'RX_LED', col: 0x00ff44, lbl: 'RX' },
  ];
  ledRow.forEach((item, i) => {
    const lx = -0.375 + i * 0.062;
    group.add(led(item.name, lx, -0.100, e1z + D * 3, item.col));
    const ll = labelPlane(item.lbl, 0.055, 0.020, 5, '#aaaaaa');
    ll.position.set(lx, -0.125, e1z + D * 3.5);
    group.add(ll);
  });

  [-0.345, 0.555].forEach(x => {
    const sc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, D * 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x999990, metalness: 0.9, roughness: 0.2 })
    );
    sc.rotation.x = Math.PI / 2;
    sc.position.set(x, 0.130, e1z);
    group.add(sc);
  });

  // ── 6. EHWIC 0 — blue-labeled module ────────────────────────
  const e0z = RZ + D * 4;
  // Two stacked blue-labeled ports
  [[0.740, 0.080], [0.740, 0.000], [0.940, 0.080], [0.940, 0.000]].forEach((pos, i) => {
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.055, D * 5),
      new THREE.MeshStandardMaterial({ color: 0x1a4a88, metalness: 0.5, roughness: 0.6 })
    );
    p.name = 'EHWIC0_PORT' + i;
    p.position.set(pos[0], pos[1], e0z);
    group.add(p);
  });
  const e0Lbl = labelPlane('EHWIC 0', 0.30, 0.028, 7, '#5588cc', 0.0);
  e0Lbl.position.set(0.840, 0.200, e0z + D);
  group.add(e0Lbl);
  [0.590, 1.090].forEach(x => {
    const sc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, D * 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x999990, metalness: 0.9, roughness: 0.2 })
    );
    sc.rotation.x = Math.PI / 2;
    sc.position.set(x, 0.130, e0z);
    group.add(sc);
  });

  // ── 7. AUX PORT (top-right, above GE 0/0 & 0/1) ─────────────
  const auxZ = RZ + D * 4;
  const auxBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.090, 0.075, D * 5),
    new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.5 })
  );
  auxBox.name = 'AUX';
  auxBox.position.set(1.285, 0.115, auxZ);
  group.add(auxBox);
  const auxI = new THREE.Mesh(
    new THREE.BoxGeometry(0.072, 0.055, D * 2),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  auxI.position.set(1.285, 0.115, auxZ + D * 4);
  group.add(auxI);
  const auxLbl = labelPlane('AUX', 0.088, 0.024, 7, '#aaaaaa');
  auxLbl.position.set(1.285, 0.165, auxZ + D);
  group.add(auxLbl);

  // ── 8. GE 0/0 and GE 0/1 (stacked RJ45, right side) ─────────
  const geZ = RZ + D * 4;
  const ge00 = rj45('GE_0_0', 1.285, 0.008, geZ);
  group.add(ge00);
  const ge01 = rj45('GE_0_1', 1.285, -0.082, geZ);
  group.add(ge01);
  const geLbl = labelPlane('GE 0/0', 0.085, 0.020, 6, '#00ccff');
  geLbl.position.set(1.285, 0.050, geZ + D * 6);
  group.add(geLbl);
  const geLbl2 = labelPlane('GE 0/1', 0.085, 0.020, 6, '#00ccff');
  geLbl2.position.set(1.285, -0.040, geZ + D * 6);
  group.add(geLbl2);

  // Right-side section background (light beige)
  const rightBg = new THREE.Mesh(
    new THREE.BoxGeometry(0.315, 0.44, D * 1.5),
    new THREE.MeshStandardMaterial({ color: 0xc8c5bc, metalness: 0.35, roughness: 0.7 })
  );
  rightBg.position.set(1.285, 0, RZ + D * 0.8);
  group.add(rightBg);

  // ── 9. USB PORT (bottom-right, small) ───────────────────────
  const usbPort = sqPort('USB', 1.415, -0.150, RZ + D * 4, 0.038, 0.026, 0x333399);
  group.add(usbPort);
  const usbLbl = labelPlane('USB', 0.044, 0.020, 5, '#8888cc');
  usbLbl.position.set(1.415, -0.172, RZ + D * 4.5);
  group.add(usbLbl);

  // "L" indicator LED
  group.add(led('L_LED', 1.185, 0.115, RZ + D * 4, 0x00ff44));
  const lLbl = labelPlane('L', 0.030, 0.022, 7, '#aaaaaa');
  lLbl.position.set(1.185, 0.090, RZ + D * 5);
  group.add(lLbl);

  // ── 10. CONSOLE PORT (bottom-center-right) ──────────────────
  const conZ = RZ + D * 4;
  const conBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.090, 0.075, D * 5),
    new THREE.MeshStandardMaterial({ color: 0x3377cc, metalness: 0.6, roughness: 0.5 })
  );
  conBox.name = 'CONSOLE';
  conBox.position.set(0.740, -0.145, conZ);
  group.add(conBox);
  const conI = new THREE.Mesh(
    new THREE.BoxGeometry(0.072, 0.055, D * 2),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  conI.position.set(0.740, -0.145, conZ + D * 4);
  group.add(conI);
  const conLbl = labelPlane('CONSOLE', 0.10, 0.022, 6, '#66aaee');
  conLbl.position.set(0.740, -0.175, conZ + D);
  group.add(conLbl);

  // ── 11. BOTTOM ROW: CF-1, CF-0, SM, PVDM1, PVDM0 ───────────
  const botZ = RZ + D * 4;
  const botSlots = [
    { name: 'CF_1', x: -2.010, w: 0.155, h: 0.055, col: 0x555555, lbl: 'CF-1' },
    { name: 'CF_0', x: -1.530, w: 0.155, h: 0.055, col: 0x555555, lbl: 'CF-0' },
    { name: 'SM', x: -0.440, w: 0.155, h: 0.055, col: 0x444455, lbl: 'SM' },
    { name: 'PVDM1', x: 0.180, w: 0.115, h: 0.055, col: 0x334455, lbl: 'PVDM1' },
    { name: 'PVDM0', x: 0.540, w: 0.115, h: 0.055, col: 0x334455, lbl: 'PVDM0' },
  ];
  botSlots.forEach(s => {
    const sl = new THREE.Mesh(
      new THREE.BoxGeometry(s.w, s.h, D * 5),
      new THREE.MeshStandardMaterial({ color: s.col, metalness: 0.6, roughness: 0.55 })
    );
    sl.name = s.name;
    sl.position.set(s.x, -0.148, botZ);
    group.add(sl);
    const ll = labelPlane(s.lbl, s.w, 0.022, 6, '#aaaaaa');
    ll.position.set(s.x, -0.175, botZ + D);
    group.add(ll);
  });

  // ── 12. CISCO LOGO + "2901" (far right) ─────────────────────
  const logoZ = RZ + D * 3;
  // Wave arch bars
  const ciscoBars = [0.028, 0.042, 0.055, 0.055, 0.042, 0.028];
  const bW = 0.018, bSp = 0.010;
  const lStartX = 1.885;
  ciscoBars.forEach((h, i) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(bW, h, D * 3),
      new THREE.MeshStandardMaterial({
        color: 0x00aacc, emissive: 0x005577, emissiveIntensity: 0.7,
        metalness: 0.3, roughness: 0.45
      })
    );
    bar.position.set(lStartX + i * (bW + bSp), 0.175, logoZ);
    group.add(bar);
  });
  // "cisco" text
  const ciscoC = document.createElement('canvas');
  ciscoC.width = 140; ciscoC.height = 32;
  const ccc = ciscoC.getContext('2d');
  ccc.clearRect(0, 0, 140, 32);
  ccc.fillStyle = '#00aacc';
  ccc.font = 'bold italic 20px Arial';
  ccc.textAlign = 'left';
  ccc.fillText('cisco', 2, 24);
  const ciscoP = new THREE.Mesh(
    new THREE.PlaneGeometry(0.175, 0.040),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ciscoC), transparent: true })
  );
  ciscoP.position.set(1.960, 0.140, logoZ + D);
  group.add(ciscoP);

  // "2901" model number
  const mdlC = document.createElement('canvas');
  mdlC.width = 100; mdlC.height = 26;
  const mc = mdlC.getContext('2d');
  mc.clearRect(0, 0, 100, 26);
  mc.fillStyle = '#cccccc';
  mc.font = 'bold 15px Arial';
  mc.textAlign = 'center';
  mc.fillText('2901', 50, 19);
  const mdlP = new THREE.Mesh(
    new THREE.PlaneGeometry(0.115, 0.030),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(mdlC), transparent: true })
  );
  mdlP.position.set(1.960, 0.108, logoZ + D);
  group.add(mdlP);

  // Small round dot (status LED, far right)
  group.add(led('STATUS_DOT', 2.165, 0.045, logoZ + D * 2, 0x00ff55));

  return group;
}