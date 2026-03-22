// === Cisco 2901 Router — Three.js Scene Setup (Senior) ===
// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050a12);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0.15, 5.5);

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

// Front face fill light — directly illuminates front panel
const frontLight = new THREE.DirectionalLight(0xddeeff, 1.2);
frontLight.position.set(0, 0.5, 8);
scene.add(frontLight);

const rimLight = new THREE.DirectionalLight(0x88ccff, 0.4);
rimLight.position.set(-4, 1, 4);
scene.add(rimLight);

// 6. Router group
const routerGroup = new THREE.Group();
scene.add(routerGroup);

// 7. Add all parts
routerGroup.add(createChassis());
routerGroup.add(createFrontPanel());
routerGroup.add(createRearPanel());

const interiorGroup = createInterior();
interiorGroup.visible = false;
interiorGroup.name = 'INTERIOR';
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

// === UI QO'SHIMCHALARI ===

// ── LOADING SCREEN ───────────────────────────────────────────
(function startLoading() {
  const bar = document.getElementById('load-bar');
  const pct = document.getElementById('load-percent');
  const el = document.getElementById('loading');
  const steps = ['ls1', 'ls2', 'ls3'];
  let p = 0, step = 0;
  const iv = setInterval(() => {
    p += Math.random() * 11 + 3;
    if (p >= 100) { p = 100; clearInterval(iv); }
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    const newStep = p < 33 ? 0 : p < 66 ? 1 : 2;
    if (newStep > step) {
      for (let i = 0; i <= newStep; i++) {
        const s = document.getElementById(steps[i]);
        if (s) s.classList.add('done');
      }
      step = newStep;
    }
    if (p >= 100) {
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s';
        setTimeout(() => el.style.display = 'none', 600);
      }, 400);
    }
  }, 100);
})();

// ── PORT DOTS (right panel — Portlar tab) ────────────────────
(function buildPortDots() {
  const dotEl = document.getElementById('port-dots');
  if (!dotEl) return;
  const ports = Object.keys(portData);
  let active = 0;
  ports.forEach(key => {
    const d = document.createElement('div');
    d.className = 'port-dot';
    const st = portData[key].status || '';
    if (st.includes('🟢')) { d.classList.add('dot-green'); active++; }
    else if (st.includes('🟡')) { d.classList.add('dot-amber'); active++; }
    else { d.classList.add('dot-gray'); }
    d.title = portData[key].nomi;
    d.onclick = () => showTooltip(key);
    dotEl.appendChild(d);
  });
  const badge = document.getElementById('active-port-count');
  if (badge) badge.textContent = active + ' faol';
})();

// ── RIGHT PANEL TABS ─────────────────────────────────────────
function switchRTab(tab, btn) {
  document.querySelectorAll('.rtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.r-tab-body').forEach(b => b.classList.add('hidden'));
  btn.classList.add('active');
  document.getElementById('rtab-' + tab).classList.remove('hidden');
}

// ── PORT LIST MODAL ───────────────────────────────────────────
function openPortModal() {
  _buildPortModal('');
  document.getElementById('port-modal-overlay').classList.add('open');
  document.getElementById('port-search').value = '';
  document.getElementById('port-search').focus();
}
function closePortModal() {
  document.getElementById('port-modal-overlay').classList.remove('open');
}
function filterPorts(q) { _buildPortModal(q.toLowerCase()); }

function _buildPortModal(q) {
  const groups = {
    'Gigabit Ethernet': ['GE_0_0', 'GE_0_1'],
    'EHWIC Modullar': ['EHWIC_2_FE_0', 'EHWIC_2_FE_1', 'EHWIC_2_FE_2', 'EHWIC_2_FE_3', 'EHWIC_2_SFP_0', 'EHWIC_3_SERIAL'],
    'Boshqaruv': ['CONSOLE', 'AUX', 'USB'],
    'Saqlash': ['CF_0', 'CF_1', 'PVDM_0', 'PVDM_1', 'SM'],
    'Quvvat va LED': ['POWER_SWITCH', 'IEC_POWER', 'SYS_LED', 'ACT_LED', 'POE_LED']
  };
  const body = document.getElementById('port-modal-body');
  body.innerHTML = '';
  let total = 0;
  Object.entries(groups).forEach(([grp, keys]) => {
    const rows = keys.filter(key => {
      if (!portData[key]) return false;
      if (!q) return true;
      return key.toLowerCase().includes(q) || portData[key].nomi.toLowerCase().includes(q);
    });
    if (!rows.length) return;
    const t = document.createElement('div');
    t.className = 'port-group-title'; t.textContent = grp;
    body.appendChild(t);
    rows.forEach(key => {
      const d = portData[key]; if (!d) return;
      total++;
      const r = document.createElement('div');
      r.className = 'port-modal-row';
      const isFaol = d.status && d.status.includes('🟢');
      r.innerHTML = `
        <span class="p-name">${key}</span>
        <span class="p-speed">${d.tezlik || '—'}</span>
        <span class="p-status ${isFaol ? 's-faol' : 's-bosh'}">
          ${isFaol ? '● Faol' : '● Bosh'}
        </span>`;
      r.onclick = () => { closePortModal(); showTooltip(key); };
      body.appendChild(r);
    });
  });
  document.querySelector('#port-modal-header span').textContent =
    'BARCHA PORTLAR' + (q ? ` · "${q}"` : '') + ` · ${total} ta`;
}

// ── NOTIFICATION TOAST ───────────────────────────────────────
function showNotif(msg) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.opacity = '1';
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'slide-up 0.22s ease';
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.4s';
    setTimeout(() => { el.style.display = 'none'; el.style.opacity = '1'; }, 400);
  }, 2500);
}

// ── CAMERA PRESETS ───────────────────────────────────────────
const CAM_PRESETS = {
  overview: { pos: [0, 0.15, 5.5], target: [0, 0, 0], label: 'Umumiy ko\'rinish' },
  front: { pos: [0, 0.05, 3.8], target: [0, 0, 0.5], label: 'Old panel' },
  rear: { pos: [0, 0.05, -3.8], target: [0, 0, -0.5], label: 'Orqa panel' },
  top: { pos: [0, 4.0, 0.1], target: [0, 0, 0], label: 'Yuqoridan' },
  side: { pos: [4.5, 0.2, 0.5], target: [0, 0, 0], label: 'Yon taraf' },
};

function camPreset(name, btn) {
  const p = CAM_PRESETS[name]; if (!p) return;
  gsap.to(camera.position, { x: p.pos[0], y: p.pos[1], z: p.pos[2], duration: 0.9, ease: 'power2.inOut' });
  gsap.to(controls.target, {
    x: p.target[0], y: p.target[1], z: p.target[2], duration: 0.9, ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });
  // Update active tab
  document.querySelectorAll('.vtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Bottom bar label
  const lbl = document.getElementById('cam-view-lbl');
  if (lbl) lbl.lastChild.textContent = ' ' + p.label;
  showNotif('📷 ' + p.label);
}

function resetCam() {
  camPreset('overview', document.getElementById('vtab-overview'));
}

// ── LID TOGGLE ────────────────────────────────────────────────
let _lidOpen = false;
function toggleLid() {
  const lid = routerGroup.getObjectByName('LID');
  if (!lid) { showNotif('Qopqoq topilmadi'); return; }
  _lidOpen = !_lidOpen;
  gsap.to(lid.rotation, { x: _lidOpen ? Math.PI / 2 : 0, duration: 0.7, ease: 'power2.inOut' });
  const txt = document.getElementById('lid-btn-txt');
  if (txt) txt.textContent = _lidOpen ? 'Qopqoqni yop' : 'Qopqoqni och';
  // Show/hide interior
  const interior = routerGroup.children.find(c => c.name === 'INTERIOR' || c.children.length > 3);
  if (interior) interior.visible = _lidOpen;
  showNotif(_lidOpen ? '🔓 Qopqoq ochildi' : '🔒 Qopqoq yopildi');
}
// legacy aliases
window.openLid = () => { if (!_lidOpen) toggleLid(); };
window.closeLid = () => { if (_lidOpen) toggleLid(); };

// ── POWER TOGGLE ─────────────────────────────────────────────
let _powerOn = true;
function togglePower() {
  _powerOn = !_powerOn;
  const btn = document.getElementById('power-btn');
  const txt = document.getElementById('power-btn-txt');
  if (_powerOn) {
    btn.classList.remove('off-state');
    if (txt) txt.textContent = 'Quvvat: ON';
  } else {
    btn.classList.add('off-state');
    if (txt) txt.textContent = 'Quvvat: OFF';
  }
  const intensity = _powerOn ? 2.5 : 0;
  if (window.sysMat) window.sysMat.emissiveIntensity = intensity;
  if (window.actMat) window.actMat.emissiveIntensity = intensity;
  if (window.poeMat) window.poeMat.emissiveIntensity = intensity;
  showNotif(_powerOn ? '⚡ Quvvat yoqildi' : '⚡ Quvvat o\'chirildi');
}

// ── WIREFRAME TOGGLE ─────────────────────────────────────────
let _wireframe = false;
function toggleWireframe() {
  _wireframe = !_wireframe;
  routerGroup.traverse(obj => {
    if (obj.isMesh && obj.material) {
      (Array.isArray(obj.material) ? obj.material : [obj.material])
        .forEach(m => { m.wireframe = _wireframe; });
    }
  });
  const st = document.getElementById('wire-state');
  if (st) { st.textContent = _wireframe ? 'ON' : 'OFF'; st.className = 'toggle-state' + (_wireframe ? ' toggle-on' : ''); }
  showNotif('🔲 Wireframe: ' + (_wireframe ? 'ON' : 'OFF'));
}

// ── GRID TOGGLE ───────────────────────────────────────────────
let _gridVisible = true;
let _gridHelper = null;
function toggleGrid() {
  if (!_gridHelper) {
    _gridHelper = new THREE.GridHelper(12, 24, 0x003344, 0x001122);
    _gridHelper.position.y = -0.23;
    scene.add(_gridHelper);
  }
  _gridVisible = !_gridVisible;
  _gridHelper.visible = _gridVisible;
  const st = document.getElementById('grid-state');
  if (st) { st.textContent = _gridVisible ? 'ON' : 'OFF'; st.className = 'toggle-state' + (_gridVisible ? ' toggle-on' : ''); }
  showNotif('⊞ Grid: ' + (_gridVisible ? 'ON' : 'OFF'));
}
// Add initial grid
window.addEventListener('load', () => {
  _gridHelper = new THREE.GridHelper(12, 24, 0x003344, 0x001122);
  _gridHelper.position.y = -0.23;
  scene.add(_gridHelper);
});

// ── AUTO-ROTATE TOGGLE ───────────────────────────────────────
let _autoRotate = false;
function toggleAutoRotate() {
  _autoRotate = !_autoRotate;
  controls.autoRotate = _autoRotate;
  controls.autoRotateSpeed = 0.8;
  const st = document.getElementById('autorot-state');
  if (st) { st.textContent = _autoRotate ? 'ON' : 'OFF'; st.className = 'toggle-state' + (_autoRotate ? ' toggle-on' : ''); }
  showNotif('🔄 Auto aylanish: ' + (_autoRotate ? 'ON' : 'OFF'));
}

// ── HELP OVERLAY ─────────────────────────────────────────────
function toggleHelp() {
  document.getElementById('help-overlay').classList.toggle('open');
}

// ── ZOOM LEVEL DISPLAY ───────────────────────────────────────
(function trackZoom() {
  const base = 4.5;
  function updateZoom() {
    const dist = camera.position.distanceTo(controls.target);
    const pct = Math.round((base / dist) * 100);
    const el = document.getElementById('zoom-lbl');
    if (el) el.lastChild.textContent = ' Zoom: ' + pct + '%';
  }
  renderer.domElement.addEventListener('wheel', () => setTimeout(updateZoom, 80));
  controls.addEventListener('change', updateZoom);
})();

// ── FPS COUNTER ──────────────────────────────────────────────
(function fpsCounter() {
  let frames = 0, last = performance.now();
  const el = document.getElementById('fps-lbl');
  function tick() {
    frames++;
    const now = performance.now();
    if (now - last >= 1000) {
      if (el) el.textContent = Math.round(frames * 1000 / (now - last)) + ' FPS';
      frames = 0; last = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ── SIMULATED LIVE STATS ─────────────────────────────────────
(function liveStats() {
  // Uptime counter
  let secs = 4 * 3600 + 23 * 60 + 11;
  setInterval(() => {
    secs++;
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    const el = document.getElementById('uptime-val');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }, 1000);

  // CPU / RAM bars with slight randomness
  setInterval(() => {
    const cpu = 28 + Math.round(Math.random() * 20);
    const ram = 57 + Math.round(Math.random() * 10);
    const cpuBar = document.getElementById('cpu-bar');
    const ramBar = document.getElementById('ram-bar');
    const cpuPct = document.getElementById('cpu-pct');
    const ramPct = document.getElementById('ram-pct');
    if (cpuBar) cpuBar.style.width = cpu + '%';
    if (cpuPct) cpuPct.textContent = cpu + '%';
    if (ramBar) ramBar.style.width = ram + '%';
    if (ramPct) ramPct.textContent = ram + '%';
  }, 2500);

  // Packet counter
  let pkt = 1240000;
  setInterval(() => {
    pkt += Math.floor(Math.random() * 1200);
    const el = document.getElementById('pkt-val');
    if (el) el.textContent = (pkt / 1e6).toFixed(2) + 'M';
  }, 1000);

  // Mini chart
  const chartData = Array.from({ length: 20 }, () => Math.random() * 60 + 10);
  function drawChart() {
    const canvas = document.getElementById('mini-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // New data point
    chartData.shift();
    chartData.push(Math.random() * 60 + 10);
    // Draw gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(0,180,255,0.4)');
    grad.addColorStop(1, 'rgba(0,180,255,0.0)');
    ctx.beginPath();
    ctx.moveTo(0, H);
    chartData.forEach((v, i) => {
      const x = (i / (chartData.length - 1)) * W;
      const y = H - (v / 100) * H;
      i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    // Draw line
    ctx.beginPath();
    chartData.forEach((v, i) => {
      const x = (i / (chartData.length - 1)) * W;
      const y = H - (v / 100) * H;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(0,180,255,0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  setInterval(drawChart, 1000);
  drawChart();
})();

// ── KEYBOARD SHORTCUTS ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  switch (e.key) {
    case 'r': case 'R': resetCam(); break;
    case 'l': case 'L': toggleLid(); break;
    case 'p': case 'P': togglePower(); break;
    case 'w': case 'W': toggleWireframe(); break;
    case 'g': case 'G': toggleGrid(); break;
    case '1': camPreset('overview', document.getElementById('vtab-overview')); break;
    case '2': camPreset('front', document.getElementById('vtab-front')); break;
    case '3': camPreset('rear', document.getElementById('vtab-rear')); break;
    case '4': camPreset('top', document.getElementById('vtab-top')); break;
    case '5': camPreset('side', document.getElementById('vtab-side')); break;
    case '?': toggleHelp(); break;
    case 'Escape':
      closePortModal();
      document.getElementById('help-overlay').classList.remove('open');
      break;
  }
});