function showTooltip(key) {
  const data = portData[key];
  if (!data) return;
  const el = document.getElementById('tooltip');
  el.innerHTML = `
    <strong>${data.nomi}</strong>
    <div class="port-status">${data.status}</div>
    <div><b>Tezlik:</b> ${data.tezlik}</div>
    <div><b>Konnektyor:</b> ${data.konnektyor}</div>
    <div><b>Vazifa:</b> ${data.vazifa}</div>
    <div class="port-extra"><b>Maxsus:</b> ${data.maxsus}</div>
    <div class="port-extra"><b>Standart:</b> ${data.standart}</div>
  `;
  el.style.display = 'block';
  document.body.style.cursor = 'pointer';
  // Position tooltip near mouse
  document.addEventListener('mousemove', function moveTooltip(e) {
    el.style.left = (e.clientX + 18) + 'px';
    el.style.top = (e.clientY + 18) + 'px';
    document.removeEventListener('mousemove', moveTooltip);
  });
}
function hideTooltip() {
  const el = document.getElementById('tooltip');
  el.style.display = 'none';
  document.body.style.cursor = 'default';
}