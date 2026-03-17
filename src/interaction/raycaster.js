function setupRaycaster() {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;
  let origMat = null;

  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.4
  });

  renderer.domElement.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(routerGroup.children, true);
    if (hovered && origMat) {
      hovered.material = origMat;
      hovered = null; origMat = null;
      document.body.style.cursor = 'default';
    }
    const hit = hits.find(
      h => h.object.name && portData[h.object.name]
    );
    if (hit) {
      hovered = hit.object;
      origMat = hovered.material;
      hovered.material = highlightMat;
      document.body.style.cursor = 'pointer';
    }
  });

  renderer.domElement.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(routerGroup.children, true);
    const hit = hits.find(
      h => h.object.name && portData[h.object.name]
    );
    if (hit) showTooltip(hit.object.name);
    else hideTooltip();
  });
}