function createFrontPanel() {
  const group = new THREE.Group();

  // Panel geometry
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.12, 0.18),
    MATERIALS.panel
  );
  panel.position.set(0, 0.08, 1.75);
  panel.castShadow = true;
  panel.receiveShadow = true;
  panel.name = "FRONT_PANEL";
  group.add(panel);

  // GE ports
  const ge0 = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.08, 0.08),
    MATERIALS.port
  );
  ge0.position.set(-1.2, 0.08, 1.85);
  ge0.name = "GE_0_0";
  group.add(ge0);

  const ge1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.08, 0.08),
    MATERIALS.port
  );
  ge1.position.set(-0.9, 0.08, 1.85);
  ge1.name = "GE_0_1";
  group.add(ge1);

  // Console port
  const consolePort = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.08),
    MATERIALS.port
  );
  consolePort.position.set(-0.6, 0.08, 1.85);
  consolePort.name = "CONSOLE";
  group.add(consolePort);

  // AUX port
  const auxPort = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.08),
    MATERIALS.port
  );
  auxPort.position.set(-0.3, 0.08, 1.85);
  auxPort.name = "AUX";
  group.add(auxPort);

  // USB ports
  const usb0 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.08),
    MATERIALS.port
  );
  usb0.position.set(0.0, 0.08, 1.85);
  usb0.name = "USB_0";
  group.add(usb0);

  const usb1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.08),
    MATERIALS.port
  );
  usb1.position.set(0.2, 0.08, 1.85);
  usb1.name = "USB_1";
  group.add(usb1);

  // CompactFlash slot
  const cf = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.08),
    MATERIALS.port
  );
  cf.position.set(0.5, 0.08, 1.85);
  cf.name = "CF";
  group.add(cf);

  // LED indicators
  const sysLedMaterial = MATERIALS.ledSys;
  const actLedMaterial = MATERIALS.ledAct;
  const poeLedMaterial = MATERIALS.ledPoe;

  const sysLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    sysLedMaterial
  );
  sysLed.position.set(1.0, 0.12, 1.85);
  sysLed.name = "SYS_LED";
  group.add(sysLed);

  const actLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    actLedMaterial
  );
  actLed.position.set(1.2, 0.12, 1.85);
  actLed.name = "ACT_LED";
  group.add(actLed);

  const poeLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    poeLedMaterial
  );
  poeLed.position.set(1.4, 0.12, 1.85);
  poeLed.name = "POE_LED";
  group.add(poeLed);

  // Set global LED material references
  window.sysMat = sysLedMaterial;
  window.actMat = actLedMaterial;
  window.poeMat = poeLedMaterial;

  return group;
}