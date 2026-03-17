function createChassis() {
  const group = new THREE.Group();
  // Main chassis body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.44, 3.68),
    MATERIALS.chassis
  );
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Top lid (for animation)
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(4.40, 0.04, 3.68),
    MATERIALS.panel
  );
  lid.position.y = 0.22;
  lid.castShadow = true;
  lid.receiveShadow = true;
  lid.name = "LID";
  group.add(lid);

  // Double-click lid to open/close
  let lidOpen = false;
  lid.cursor = 'pointer';
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