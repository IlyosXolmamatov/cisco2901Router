// === Cisco 2901 Router — Three.js Scene Setup (Senior) ===
// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050a12);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0.8, 4.5);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// 4. Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1.5;
controls.maxDistance = 8;

// 5. Lights
const ambientLight = new THREE.AmbientLight(0xe8f4fd, 0.4);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(3, 5, 3);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);

// 6. Router group
const routerGroup = new THREE.Group();
scene.add(routerGroup);

// 7. Add all parts
routerGroup.add(createChassis());
routerGroup.add(createFrontPanel());
routerGroup.add(createRearPanel());

const interiorGroup = createInterior();
interiorGroup.visible = false;
routerGroup.add(interiorGroup);

// 8. Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({
    color: 0x0a0a12, roughness: 0.8
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.23;
ground.receiveShadow = true;
scene.add(ground);

// 9. Raycaster
setupRaycaster();

// 10. LED state
let blinkState = true;
setInterval(() => { blinkState = !blinkState; }, 150);

// 11. Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (window.sysMat) {
    window.sysMat.emissiveIntensity = 1.5 + Math.sin(Date.now() / 800);
  }
  if (window.actMat) {
    window.actMat.emissiveIntensity = blinkState ? 2.5 : 0;
  }
  if (window.fanBlades) {
    window.fanBlades.rotation.z += 0.04;
  }
  renderer.render(scene, camera);
}
animate();

// 12. Hide loading
window.addEventListener('load', () => {
  setTimeout(() => {
    const el = document.getElementById('loading');
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => el.style.display = 'none', 500);
    }
  }, 1000);
});

// 13. Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === UI QO'SHIMCHALARI (Yuqoridagi ko'rsatmaga asosan) ===
// LOADING SCREEN
(function startLoading() {
  const bar = document.getElementById('load-bar');
  const pct = document.getElementById('load-percent');
  const el = document.getElementById('loading');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 11 + 3;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s';
        setTimeout(() => el.style.display = 'none', 600);
      }, 400);
    }
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 100);
})();

// PORT DOTS (right panel)
(function buildPortDots() {
  const dotEl = document.getElementById('port-dots');
  const ports = Object.keys(portData);
  ports.forEach(key => {
    const d = document.createElement('div');
    d.className = 'port-dot';
    const st = portData[key].status || '';
    d.className += st.includes('🟢')
      ? ' dot-green'
      : st.includes('🟡')
        ? ' dot-amber'
        : ' dot-gray';
    d.title = portData[key].nomi;
    d.onclick = () => showTooltip(key);
    dotEl.appendChild(d);
  });
})();

// PORT LIST MODAL
function openPortModal() {
  const groups = {
    'Gigabit Ethernet': ['GE_0_0', 'GE_0_1'],
    'EHWIC Modullar': ['EHWIC_2_FE_0', 'EHWIC_2_FE_1', 'EHWIC_2_FE_2', 'EHWIC_2_FE_3', 'EHWIC_2_SFP_0', 'EHWIC_3_SERIAL'],
    'Boshqaruv': ['CONSOLE', 'AUX', 'USB'],
    'Saqlash': ['CF_0', 'CF_1', 'PVDM_0', 'PVDM_1', 'SM'],
    'Quvvat va LED': ['POWER_SWITCH', 'IEC_POWER', 'SYS_LED', 'ACT_LED', 'POE_LED']
  };
  const body = document.getElementById('port-modal-body');
  body.innerHTML = '';
  Object.entries(groups).forEach(([grp, keys]) => {
    const t = document.createElement('div');
    t.className = 'port-group-title';
    t.textContent = grp;
    body.appendChild(t);
    keys.forEach(key => {
      const d = portData[key];
      if (!d) return;
      const r = document.createElement('div');
      r.className = 'port-modal-row';
      const isFaol = d.status.includes('🟢');
      r.innerHTML = `
        <span class="p-name">${key}</span>
        <span class="p-speed">${d.tezlik || '—'}</span>
        <span class="p-status ${isFaol ? 's-faol' : 's-bosh'}">
          ${isFaol ? '● Faol' : '● Bo\'sh'}
        </span>`;
      r.onclick = () => {
        closePortModal();
        showTooltip(key);
      };
      body.appendChild(r);
    });
  });
  document.getElementById('port-modal-overlay').style.display = 'flex';
}
function closePortModal() {
  document.getElementById('port-modal-overlay').style.display = 'none';
}

// NOTIFICATION
function showNotif(msg) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'slide-up 0.25s ease';
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      el.style.display = 'none';
      el.style.opacity = '1';
    }, 400);
  }, 2500);
}

// POWER BUTTON STATE
let powerOn = true;
function togglePower() {
  powerOn = !powerOn;
  const btn = document.getElementById('power-btn');
  btn.className = 'ctrl-btn ' + (powerOn ? 'power-on' : 'power-off');
  btn.querySelector('span') || (btn.lastChild.textContent = powerOn ? ' Quvvat: ON' : ' Quvvat: OFF');
  showNotif(powerOn ? '⚡ Quvvat yoqildi' : '⚡ Quvvat o\'chirildi');
  if (window.sysMat) window.sysMat.emissiveIntensity = powerOn ? 2.5 : 0;
  if (window.actMat) window.actMat.emissiveIntensity = powerOn ? 2.5 : 0;
  if (window.poeMat) window.poeMat.emissiveIntensity = powerOn ? 2.5 : 0;
}

// WRAP EXISTING FUNCTIONS
const _origOpenLid = window.triggerLidAnimation || function () { };
window.openLid = function () { _origOpenLid(); showNotif('🔓 Qopqoq ochildi'); };
const _origCloseLid = window.closeLidAnimation || function () { };
window.closeLid = function () { _origCloseLid(); showNotif('🔒 Qopqoq yopildi'); };
const _origReset = window.resetCamera || function () { };
window.resetCam = function () { _origReset(); showNotif('🔄 Kamera qaytarildi'); };