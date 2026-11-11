/**
 * DrawerZero: BCS508 E-Waste Project
 * Standalone Script
 */

// Step 6: Lifespan Matrix
const lifespan = { smartphone: 4, laptop: 6, charger: 3, earphones: 2, tv: 10 };

// Weights & recovery factors for Step 8
const factors = {
  smartphone: { kg: 0.18, cu: 16, au: 34 },
  laptop:     { kg: 2.20, cu: 380, au: 125 },
  charger:    { kg: 0.09, cu: 32, au: 0.8 },
  earphones:  { kg: 0.04, cu: 12, au: 0.3 },
  tv:         { kg: 11.5, cu: 1100, au: 55 }
};

// Chart instances
let doughnutChartInstance = null;
let barChartInstance = null;
let leafletMapInstance = null;

// Step 5: Page navigation with JavaScript
function showPage(id) {
  const targetId = id || 'home';
  document.querySelectorAll('section').forEach(s => s.style.display = 'none');
  const target = document.getElementById(targetId);
  if (target) {
    target.style.display = 'block';
  } else {
    document.getElementById('home').style.display = 'block';
  }

  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${targetId}`);
  });

  // Re-draw charts when impact page is visited
  if (targetId === 'impact') {
    renderCharts();
  }
  // Initialize map when map page is visited
  if (targetId === 'map') {
    initLeafletMap();
  }

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => showPage(location.hash.slice(1) || 'home'));

// Step 6: The core logic
function getLabel(device) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - device.yearBought;
  const standardLife = lifespan[device.type] || 3;
  const score = age / standardLife; // End-of-Life score

  if (device.condition === 'working' && score < 1) return 'Keep / Reuse';
  if (device.condition === 'repairable') return 'Repair';
  return 'Recycle';
}

// Step 7: Save devices with LocalStorage
function saveDevice(device) {
  const list = JSON.parse(localStorage.getItem('dz_devices') || '[]');
  device.id = 'DZ-' + Date.now();
  device.label = getLabel(device);
  list.unshift(device);
  localStorage.setItem('dz_devices', JSON.stringify(list));
}

// Validation function (Step 7 & Step 12)
function validateDeviceForm(name, type, yearStr, condition, pin) {
  const currentYear = new Date().getFullYear();
  const yr = parseInt(yearStr, 10);
  const pinPattern = /^\d{6}$/;

  if (!name.trim()) {
    alert('Please enter a device name or model.');
    return false;
  }
  if (!yearStr || isNaN(yr)) {
    alert('Please enter a valid purchase year.');
    return false;
  }
  if (yr > currentYear) {
    alert(`Year bought cannot be in the future (max: ${currentYear}).`);
    return false;
  }
  if (!pinPattern.test(pin.trim())) {
    alert('PIN code must be exactly 6 digits (e.g., 560001).');
    return false;
  }
  return true;
}

// Step 8: Show the drawer and the stats
function refreshUI() {
  const list = JSON.parse(localStorage.getItem('dz_devices') || '[]');

  // Update Home Stat Cards
  let totalKg = 0;
  let totalCu = 0;
  let totalAu = 0;

  list.forEach(d => {
    const f = factors[d.type] || factors.smartphone;
    totalKg += f.kg;
    totalCu += f.cu;
    totalAu += f.au;
  });

  const countEl = document.getElementById('stat-devices-count');
  const kgEl = document.getElementById('stat-kg-count');
  const metalsEl = document.getElementById('stat-metals-count');

  if (countEl) countEl.innerText = list.length;
  if (kgEl) kgEl.innerText = totalKg.toFixed(2) + ' kg';
  if (metalsEl) metalsEl.innerText = Math.round(totalCu) + 'g Cu / ' + Math.round(totalAu) + 'mg Au';

  // Step 9: Add the community drive idea
  const byPin = {};
  list.forEach(d => byPin[d.pin] = (byPin[d.pin] || 0) + 1);

  const driveBanner = document.getElementById('drive-banner');
  const qualifyingPins = Object.keys(byPin).filter(pin => byPin[pin] >= 5);

  if (driveBanner) {
    if (qualifyingPins.length > 0) {
      driveBanner.style.display = 'block';
      const text = document.getElementById('drive-banner-text');
      if (text) {
        text.innerText = `Your area (PIN ${qualifyingPins.join(', ')}) has reached ${qualifyingPins.reduce((s, p) => s + byPin[p], 0)} devices. That's enough devices for an organized community collection drive!`;
      }
    } else {
      driveBanner.style.display = 'none';
    }
  }

  // Populate Drawer Table
  const tbody = document.getElementById('drawer-table-body');
  if (tbody) {
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #64748b;">No devices in drawer. Click "Add a Device" to get started!</td></tr>';
    } else {
      tbody.innerHTML = list.map(d => {
        const badgeClass = d.label === 'Keep / Reuse' ? 'badge-reuse' : (d.label === 'Repair' ? 'badge-repair' : 'badge-recycle');
        return `
          <tr>
            <td><code>${d.id}</code></td>
            <td><strong>${escapeHtml(d.name)}</strong></td>
            <td style="text-transform: capitalize;">${d.type}</td>
            <td>${d.yearBought}</td>
            <td style="text-transform: capitalize;">${d.condition}</td>
            <td><code>${d.pin}</code></td>
            <td><span class="badge ${badgeClass}">${d.label}</span></td>
          </tr>
        `;
      }).join('');
    }
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Step 10: Charts (Chart.js)
function renderCharts() {
  const list = JSON.parse(localStorage.getItem('dz_devices') || '[]');
  if (typeof Chart === 'undefined') return;

  // Chart 1: Doughnut Reuse vs Repair vs Recycle
  const doughnutCtx = document.getElementById('chart-doughnut');
  if (doughnutCtx) {
    if (doughnutChartInstance) doughnutChartInstance.destroy();

    const reuse = list.filter(d => d.label === 'Keep / Reuse').length;
    const repair = list.filter(d => d.label === 'Repair').length;
    const recycle = list.filter(d => d.label === 'Recycle').length;

    doughnutChartInstance = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Keep / Reuse', 'Repair', 'Recycle'],
        datasets: [{
          data: list.length > 0 ? [reuse, repair, recycle] : [1, 1, 1],
          backgroundColor: list.length > 0 ? ['#2e7d32', '#f59e0b', '#2563eb'] : ['#cbd5e1', '#e2e8f0', '#f1f5f9']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Chart 2: Bar chart of devices by type
  const barCtx = document.getElementById('chart-bar');
  if (barCtx) {
    if (barChartInstance) barChartInstance.destroy();

    const types = ['smartphone', 'laptop', 'charger', 'earphones', 'tv'];
    const counts = types.map(t => list.filter(d => d.type === t).length);

    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: types.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
        datasets: [{
          label: 'Devices in Drawer',
          data: counts,
          backgroundColor: '#4caf50'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}

// Step 11: Optional map (Leaflet)
function initLeafletMap() {
  if (typeof L === 'undefined' || leafletMapInstance) return;
  const mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  leafletMapInstance = L.map('leaflet-map').setView([12.9716, 77.5946], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(leafletMapInstance);

  const points = [
    { name: 'Saahas Zero Waste Hub', lat: 12.9128, lng: 77.6092, reg: 'KSPCB/WMC/2021/104', pin: '560076' },
    { name: 'Karo Sambhav Center', lat: 12.9784, lng: 77.6408, reg: 'CPCB/B-29016/EPR/12', pin: '560038' },
    { name: 'Eco Recycling Ltd (Ecoreco)', lat: 13.0334, lng: 77.5186, reg: 'CPCB/REG/2016/E-14', pin: '560058' },
    { name: 'KSPCB Regional Center', lat: 12.9749, lng: 77.6053, reg: 'GO-KAR-KSPCB-CP-009', pin: '560001' },
    { name: 'Hulladek Drop-off Point', lat: 12.9345, lng: 77.6255, reg: 'CPCB-EPR-PRO-2022-771', pin: '560034' }
  ];

  points.forEach(p => {
    L.marker([p.lat, p.lng]).addTo(leafletMapInstance)
      .bindPopup(`<strong>${p.name}</strong><br>PIN: ${p.pin}<br><small>Reg: ${p.reg}</small>`);
  });
}

// Initial Sample Devices Seeding
function seedInitialDataIfEmpty() {
  const existing = localStorage.getItem('dz_devices');
  if (!existing) {
    const demo = [
      { id: 'DZ-1', name: 'Redmi Note 7', type: 'smartphone', yearBought: 2018, condition: 'broken', pin: '560001', label: 'Recycle' },
      { id: 'DZ-2', name: 'Dell Inspiron 15', type: 'laptop', yearBought: 2023, condition: 'working', pin: '560001', label: 'Keep / Reuse' },
      { id: 'DZ-3', name: 'Mi 18W Fast Charger', type: 'charger', yearBought: 2019, condition: 'broken', pin: '560001', label: 'Recycle' },
      { id: 'DZ-4', name: 'Boat Earphones 255', type: 'earphones', yearBought: 2024, condition: 'repairable', pin: '560001', label: 'Repair' },
      { id: 'DZ-5', name: 'Samsung J7 Prime', type: 'smartphone', yearBought: 2016, condition: 'broken', pin: '560001', label: 'Recycle' },
      { id: 'DZ-6', name: 'Sony Bravia 32"', type: 'tv', yearBought: 2013, condition: 'broken', pin: '560034', label: 'Recycle' }
    ];
    localStorage.setItem('dz_devices', JSON.stringify(demo));
  }
}

// Form Submission Event
document.addEventListener('DOMContentLoaded', () => {
  seedInitialDataIfEmpty();
  refreshUI();
  showPage(location.hash.slice(1) || 'home');

  const form = document.getElementById('device-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('dev-name').value;
      const type = document.getElementById('dev-type').value;
      const year = document.getElementById('dev-year').value;
      const condition = document.getElementById('dev-condition').value;
      const pin = document.getElementById('dev-pin').value;

      if (!validateDeviceForm(name, type, year, condition, pin)) {
        return;
      }

      saveDevice({
        name: name.trim(),
        type,
        yearBought: parseInt(year, 10),
        condition,
        pin: pin.trim()
      });

      alert('Device successfully audited and saved to your drawer!');
      form.reset();
      refreshUI();
      location.hash = '#drawer';
    });
  }
});
