function createChassis() {
  const group = new THREE.Group();

  // ── Main chassis body (silver-aluminium box) ─────────────────
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.44, 3.68),
    MATERIALS.chassis
  );
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = "CHASSIS_BODY";
  group.add(body);

  // ── Rack ear tabs (left & right) ─────────────────────────────
  const earMat = new THREE.MeshStandardMaterial({
    color: 0xa0a09a, metalness: 0.80, roughness: 0.35
  });

  [-2.28, 2.28].forEach((x, side) => {
    const ear = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.44, 0.36),
      earMat
    );
    ear.position.set(x, 0, 1.66);
    ear.castShadow = true;
    group.add(ear);

    // Rack screw hole on each ear
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.18, 10),
      new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.2 })
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(x + (side === 0 ? -0.06 : 0.06), 0, 1.75);
    group.add(screw);
  });

  // ── Bottom edge rail ─────────────────────────────────────────
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x888883, metalness: 0.75, roughness: 0.45
  });
  const bottomRail = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.025, 3.68),
    railMat
  );
  bottomRail.position.y = -0.2075;
  group.add(bottomRail);

  // ── Vent slits on both sides (thin horizontal lines) ─────────
  const ventMat = new THREE.MeshStandardMaterial({
    color: 0x181818, metalness: 0.3, roughness: 0.8
  });
  for (let i = 0; i < 6; i++) {
    [-2.18, 2.18].forEach(x => {
      const slit = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.018, 0.36),
        ventMat
      );
      slit.position.set(x, -0.10 + i * 0.04, 0);
      group.add(slit);
    });
  }

  // ── Top lid ───────────────────────────────────────────────────
  const lidMat = new THREE.MeshStandardMaterial({
    color: 0xb8b6b0, metalness: 0.65, roughness: 0.40
  });
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.025, 3.64),
    lidMat
  );
  lid.position.y = 0.2125;
  lid.castShadow = true;
  lid.receiveShadow = true;
  lid.name = "LID";
  group.add(lid);

  // ── Lid vent grille (stamped slots on top) ────────────────────
  const lidVentMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, metalness: 0.4, roughness: 0.8
  });
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 14; col++) {
      const v = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.028, 0.06),
        lidVentMat
      );
      v.position.set(-2.0 + col * 0.31, 0.228, -0.6 + row * 0.22);
      group.add(v);
    }
  }

  // ── Double-click lid to open/close ───────────────────────────
  let lidOpen = false;
  lid.userData = { isLid: true };

  lid.onDblClick = function () {
    lidOpen = !lidOpen;
    gsap.to(lid.rotation, {
      x: lidOpen ? Math.PI / 2 : 0,
      duration: 0.7,
      ease: "power2.inOut"
    });
  };

  renderer.domElement.addEventListener('dblclick', function (e) {
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects([lid], true);
    if (hits.length && hits[0].object.userData.isLid) {
      lid.onDblClick();
    }
  });

  return group;
}