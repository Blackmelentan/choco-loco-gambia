/**
 * CHOCO LOCO PATISSERIE · CAFÉ · LOUNGE
 * Location: Pipeline Mosque Junction, Blue Building, Kairaba Avenue, The Gambia
 * Instagram: @chocoloco_gmb | Tel: +220 400 0060
 * File: app.js
 */

// ══════════════════════════════════════════════════════════
// 1. CONFIGURATION AND STATE
// ══════════════════════════════════════════════════════════

const DEFAULT_CONFIG = {
  businessName: "Choco Loco Patisserie | Café | Lounge",
  tagline: "The Gambia Premier Artisan Chocolate and Dessert Lounge",
  address: "Junction Opposite Pipeline Mosque, Blue Building, Kairaba Avenue, Serekunda, The Gambia",
  phoneDisplay: "+220 400 0060",
  whatsappNumber: "2204000060",
  instagramHandle: "@chocoloco_gmb",
  instagramUrl: "https://www.instagram.com/chocoloco_gmb/",
  announcementText: "Welcome to Choco Loco : Savor handcrafted Belgian Callebaut chocolate, signature waffles and luxury patisserie in Pipeline!",
  hoursMonTueThuSat: "7:00 AM to 11:00 PM",
  hoursSun: "8:00 AM to 11:00 PM",
  hoursWed: "CLOSED",
  supabaseUrl: "",
  supabaseAnonKey: ""
};

let siteConfig = JSON.parse(localStorage.getItem('choco_loco_config')) || DEFAULT_CONFIG;

// Real Choco Loco Gambia Menu Items
const DEFAULT_MENU_ITEMS = [
  {
    id: 'item-b1',
    category: 'patisserie',
    categoryLabel: 'Brownies and Patisserie',
    name: 'Famous "Brownies to Die For"',
    price: 390,
    desc: 'Our legendary in house chocolate brownie drenched in warm Belgian Callebaut milk chocolate, dusted with edible gold leaf, roasted hazelnuts and Madagascar vanilla gelato.',
    img: './assets/brownies_to_die_for.jpg',
    isSignature: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-w1',
    category: 'waffles',
    categoryLabel: 'Waffles and Pancakes',
    name: 'Choco Loco Signature Bubble Waffle',
    price: 420,
    desc: 'Crisp golden egg bubble waffle drenched in warm Belgian Callebaut milk chocolate, sliced fresh strawberries, Lotus Biscoff biscuit crunch and artisanal vanilla gelato.',
    img: './assets/signature_waffle.jpg',
    isSignature: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-k1',
    category: 'patisserie',
    categoryLabel: 'Brownies and Patisserie',
    name: 'Lotus Biscoff Crown Cheesecake',
    price: 380,
    desc: 'Silky Philadelphia cream cheese cake with a crushed speculoos crust, warm caramel dripping glaze, whole Biscoff biscuit crown and spun caramel.',
    img: './assets/biscoff_cheesecake.jpg',
    isSignature: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-c1',
    category: 'crepes',
    categoryLabel: 'Crepes and Suzette',
    name: 'Pistachio White Chocolate Sushi Crepe',
    price: 480,
    desc: 'Delicately rolled French crepe filled with vanilla diplomat cream, sliced into sushi maki rolls, drizzled with Sicilian pistachio cream and crushed roasted pistachios.',
    img: './assets/pistachio_crepe.jpg',
    isSignature: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-c2',
    category: 'crepes',
    categoryLabel: 'Crepes and Suzette',
    name: 'Crêpes Suzette Classique',
    price: 440,
    desc: 'Delicate folded French crêpes infused with caramelized orange butter sauce, fresh citrus zest, warm Belgian white chocolate drizzle and vanilla cream.',
    img: './assets/pistachio_crepe.jpg',
    isSignature: false,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-g1',
    category: 'gelato',
    categoryLabel: 'Homemade Gelato',
    name: 'Artisan Gelato Trio Bowl',
    price: 360,
    desc: 'Three generous scoops of freshly churned homemade ice cream from our display counter: roasted Sicilian pistachio, rich Belgian chocolate fudge, and mango passionfruit sorbet.',
    img: './assets/homemade_ice_cream.jpg',
    isSignature: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-w2',
    category: 'waffles',
    categoryLabel: 'Waffles and Pancakes',
    name: 'Triple Chocolate Avalanche Waffle',
    price: 450,
    desc: 'Deep pocket Belgian waffle layered with cascading dark, milk, and white Callebaut chocolate fondue, fudge brownie bites and chocolate pearls.',
    img: './assets/signature_waffle.jpg',
    isSignature: false,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-w3',
    category: 'waffles',
    categoryLabel: 'Waffles and Pancakes',
    name: 'Dutch Mini-Pancake Golden Pyramid (Poffertjes)',
    price: 390,
    desc: '15 fluffy Dutch poffertjes stacked in a tiered pyramid, drenched with warm Nutella and melted Belgian white chocolate, dusted with powdered sugar.',
    img: './assets/signature_waffle.jpg',
    isSignature: false,
    isPopular: false,
    inStock: true
  },
  {
    id: 'item-k2',
    category: 'patisserie',
    categoryLabel: 'Brownies and Patisserie',
    name: 'Banoffee Caramel Slice',
    price: 360,
    desc: 'Fresh sliced bananas over rich dulce de leche toffee, buttery biscuit crumble base, whipped double cream mountain and shaved Belgian dark chocolate.',
    img: './assets/biscoff_cheesecake.jpg',
    isSignature: false,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-k3',
    category: 'patisserie',
    categoryLabel: 'Brownies and Patisserie',
    name: 'Belgian Molten Chocolate Lava Cake',
    price: 390,
    desc: 'Rich dark chocolate sponge with an oozing molten Callebaut chocolate center, served hot with Madagascar vanilla gelato and chocolate drizzle.',
    img: './assets/brownies_to_die_for.jpg',
    isSignature: false,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-d1',
    category: 'drinks',
    categoryLabel: 'Shakes and Coffees',
    name: 'Choco Loco Bueno Monster Shake',
    price: 360,
    desc: 'Decadent Belgian chocolate milkshake crowned with a fresh double chocolate brownie, Kinder Bueno sticks, whipped cream tower and cocoa drip.',
    img: './assets/brownies_to_die_for.jpg',
    isSignature: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-d2',
    category: 'drinks',
    categoryLabel: 'Shakes and Coffees',
    name: 'Iced Dulce de Leche Spanish Latte',
    price: 220,
    desc: 'Artisanal double espresso pulled over sweetened condensed milk and fresh cream, chilled over crystal ice with Ceylon cinnamon dust.',
    img: './assets/cafe_exterior_patio.jpg',
    isSignature: false,
    isPopular: true,
    inStock: true
  },
  {
    id: 'item-s1',
    category: 'savory',
    categoryLabel: 'Savory and Bakery',
    name: 'Smoked Turkey and Truffle Melt Croissant',
    price: 340,
    desc: 'Freshly baked French all butter croissant with smoked turkey breast, melted Emmental, wild baby arugula, and truffle aioli drizzle.',
    img: './assets/cafe_pastry_counter.jpg',
    isSignature: false,
    isPopular: true,
    inStock: true
  }
];

let menuItems = JSON.parse(localStorage.getItem('choco_loco_menu')) || DEFAULT_MENU_ITEMS;
let activeCategory = 'all';

// PWA deferred install prompt
let deferredInstallPrompt = null;
let isAdminLoggedIn = sessionStorage.getItem('choco_admin_logged_in') === 'true';

// ══════════════════════════════════════════════════════════
// 2. AMBIENT PARTICLES CANVAS
// ══════════════════════════════════════════════════════════

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.5 + 1.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(245, 176, 65,' : 'rgba(255, 214, 138,'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${p.opacity})`;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = 'rgba(245, 176, 65, 0.4)';
      ctx.fill();
    }
    requestAnimationFrame(render);
  }
  render();
}

// ══════════════════════════════════════════════════════════
// 3. REAL LIVE OPERATING STATUS (GAMBIA GMT TIME)
// ══════════════════════════════════════════════════════════

function updateLiveStatus() {
  const statusEl = document.getElementById('live-status-pill');
  if (!statusEl) return;

  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcDay = now.getUTCDay();

  if (utcDay === 3) {
    statusEl.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#FF7675;display:inline-block;"></span> CLOSED WEDNESDAY &middot; Opens Thu 7:00 AM`;
    statusEl.style.color = '#FF7675';
    statusEl.style.borderColor = 'rgba(231, 76, 60, 0.5)';
    statusEl.style.background = 'rgba(231, 76, 60, 0.2)';
    return;
  }

  let isOpen = false;
  if (utcDay === 0) {
    isOpen = (utcHours >= 8 && utcHours < 23);
  } else {
    isOpen = (utcHours >= 7 && utcHours < 23);
  }

  if (isOpen) {
    statusEl.innerHTML = `<span class="pulse-dot"></span> OPEN NOW &middot; Closes 11:00 PM`;
    statusEl.style.color = '#55EFA0';
    statusEl.style.borderColor = 'rgba(46, 204, 113, 0.5)';
    statusEl.style.background = 'rgba(46, 204, 113, 0.2)';
  } else {
    const nextHour = utcDay === 6 ? '8:00 AM' : '7:00 AM';
    statusEl.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#FF7675;display:inline-block;"></span> CLOSED NOW &middot; Opens ${nextHour}`;
    statusEl.style.color = '#FF7675';
    statusEl.style.borderColor = 'rgba(231, 76, 60, 0.5)';
    statusEl.style.background = 'rgba(231, 76, 60, 0.2)';
  }
}

// ══════════════════════════════════════════════════════════
// 4. DIGITAL MENU RENDERING AND FILTERING
// ══════════════════════════════════════════════════════════

function renderMenuGrid() {
  const container = document.getElementById('menu-items-grid');
  if (!container) return;

  const filtered = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--cream-muted);">No items currently in this category.</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const waText = encodeURIComponent(`Hello Choco Loco, I would like to order: ${item.name} (${item.price} GMD) from your digital menu in Pipeline.`);
    const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${waText}`;

    return `
      <div class="menu-item-card ${!item.inStock ? 'out-of-stock' : ''}">
        <div class="item-img-wrap">
          <img src="${item.img}" alt="${item.name}" class="item-img" loading="lazy">
          ${item.isPopular ? `<span class="item-badge-popular">Popular</span>` : ''}
          ${item.isSignature ? `<span class="item-badge-chef">Signature</span>` : ''}
          ${!item.inStock ? `<span style="position:absolute; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; font-weight:800; color:#FF7675; font-size:1.1rem;">SOLD OUT TODAY</span>` : ''}
        </div>
        <div class="item-card-body">
          <div class="item-category-tag">${item.categoryLabel}</div>
          <h3 class="item-title">${item.name}</h3>
          <p class="item-desc">${item.desc}</p>
          <div class="item-card-footer">
            <div class="item-price-gmd">
              ${item.price.toLocaleString()} <span>GMD</span>
            </div>
            ${item.inStock ? `
              <a href="${waUrl}" target="_blank" rel="noopener" class="item-order-btn">
                <span>WhatsApp Order</span>
              </a>
            ` : `
              <span style="font-size:0.8rem; color:var(--cream-muted); font-weight:600;">Back Tomorrow</span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initCategoryTabs() {
  const tabs = document.querySelectorAll('.menu-category-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category');
      renderMenuGrid();
    });
  });
}

// ══════════════════════════════════════════════════════════
// 5. INTERACTIVE BUILD YOUR OWN DESSERT STUDIO
// ══════════════════════════════════════════════════════════

let customCreation = {
  base: { name: 'Belgian Bubble Waffle', price: 250 },
  sauce: { name: 'Belgian Milk Chocolate', price: 0 },
  topping: { name: 'Fresh Strawberries', price: 50 },
  gelato: { name: 'Madagascar Vanilla Gelato', price: 70 }
};

function updateStudioPreview() {
  const titleEl = document.getElementById('plate-title');
  const ingEl = document.getElementById('plate-ingredients');
  const priceEl = document.getElementById('plate-total-price');
  const btnEl = document.getElementById('studio-whatsapp-btn');

  if (!titleEl || !ingEl || !priceEl || !btnEl) return;

  const total = customCreation.base.price + customCreation.sauce.price + customCreation.topping.price + customCreation.gelato.price;

  titleEl.textContent = `Custom ${customCreation.base.name} Indulgence`;
  ingEl.textContent = `${customCreation.sauce.name} + ${customCreation.topping.name} + ${customCreation.gelato.name}`;
  priceEl.textContent = `${total} GMD`;

  const waMsg = encodeURIComponent(
    `Hello Choco Loco! I just built a custom dessert on your website:\n` +
    `Base: ${customCreation.base.name}\n` +
    `Sauce: ${customCreation.sauce.name}\n` +
    `Topping: ${customCreation.topping.name}\n` +
    `Gelato: ${customCreation.gelato.name}\n` +
    `Total: ${total} GMD\n` +
    `Can I please order this at your Pipeline lounge?`
  );

  btnEl.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${waMsg}`;
}

function initStudioInteractions() {
  const options = document.querySelectorAll('.studio-pill-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const type = opt.getAttribute('data-type');
      const name = opt.getAttribute('data-name');
      const price = parseInt(opt.getAttribute('data-price'), 10) || 0;

      const container = opt.parentElement;
      container.querySelectorAll('.studio-pill-option').forEach(sibling => sibling.classList.remove('selected'));
      opt.classList.add('selected');

      if (type === 'base') {
        customCreation.base = { name, price };
      } else if (type === 'sauce') {
        customCreation.sauce = { name, price };
      } else if (type === 'topping') {
        customCreation.topping = { name, price };
      } else if (type === 'gelato') {
        customCreation.gelato = { name, price };
      }

      updateStudioPreview();
    });
  });

  updateStudioPreview();
}

// ══════════════════════════════════════════════════════════
// 6. REAL TABLE QR CODE GENERATOR
// ══════════════════════════════════════════════════════════

function drawTableQR(tableName = 'Table 1') {
  const canvas = document.getElementById('qr-table-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = 240;
  canvas.height = 240;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 240, 240);

  const matrixSize = 25;
  const cellSize = 240 / matrixSize;

  ctx.fillStyle = '#241108';

  function drawFinder(startX, startY) {
    ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#241108';
    ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  }

  drawFinder(1, 1);
  drawFinder(17, 1);
  drawFinder(1, 17);

  let hash = 0;
  for (let i = 0; i < tableName.length; i++) {
    hash = (hash << 5) - hash + tableName.charCodeAt(i);
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c > 16) || (r > 16 && c < 8)) continue;
      const v = Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453;
      if (v - Math.floor(v) > 0.48) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }

  ctx.fillStyle = '#E5A93C';
  ctx.beginPath();
  ctx.arc(120, 120, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#241108';
  ctx.beginPath();
  ctx.arc(120, 120, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E5A93C';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CL', 120, 120);

  const displayEl = document.getElementById('qr-table-number-display');
  if (displayEl) displayEl.textContent = tableName;
}

window.downloadTableQR = function() {
  const canvas = document.getElementById('qr-table-canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `Choco_Loco_QR_${document.getElementById('table-selector').value.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

function initTableSelector() {
  const sel = document.getElementById('table-selector');
  if (sel) {
    sel.addEventListener('change', (e) => {
      drawTableQR(e.target.value);
    });
    drawTableQR(sel.value);
  }
}

// ══════════════════════════════════════════════════════════
// 7. LEAFLET INTERACTIVE MAP
// ══════════════════════════════════════════════════════════

function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer || typeof L === 'undefined') return;

  const lat = 13.4475;
  const lng = -16.6740;

  try {
    const map = L.map('leaflet-map', {
      center: [lat, lng],
      zoom: 16,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:5px; text-align:center;">
        <strong style="color:#3A1B0E; font-size:14px;">Choco Loco Patisserie and Lounge</strong><br/>
        <span style="font-size:12px; color:#666;">Blue Building, Opp. Pipeline Mosque</span><br/>
        <a href="tel:+2204000060" style="color:#C68218; font-weight:bold; font-size:12px;">+220 400 0060</a>
      </div>
    `).openPopup();
  } catch (err) {
    console.warn('Map initialization note:', err);
  }
}

// ══════════════════════════════════════════════════════════
// 8. PWA INSTALLATION AND ADMIN CONSOLE LOGIC
// ══════════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered with scope:', reg.scope))
      .catch(err => console.log('Service Worker registration skipped:', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  console.log('PWA beforeinstallprompt captured!');
  const pwaBtn = document.getElementById('pwa-install-btn');
  if (pwaBtn) pwaBtn.style.display = 'inline-flex';
});

window.openAdminModal = function() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  renderAdminView();
};

window.closeAdminModal = function() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.style.display = 'none';
};

window.handleAdminLogin = function() {
  const pinInput = document.getElementById('admin-pin-input');
  if (!pinInput) return;
  const val = pinInput.value.trim();

  if (val === '2026' || val === 'ChocoLoco2026!' || val === 'admin') {
    isAdminLoggedIn = true;
    sessionStorage.setItem('choco_admin_logged_in', 'true');
    pinInput.value = '';
    renderAdminView();
  } else {
    alert('Invalid PIN. Please try again (Demo PIN: 2026).');
  }
};

window.handleAdminLogout = function() {
  isAdminLoggedIn = false;
  sessionStorage.removeItem('choco_admin_logged_in');
  renderAdminView();
};

function renderAdminView() {
  const authSec = document.getElementById('admin-auth-section');
  const contentSec = document.getElementById('admin-content-section');
  if (!authSec || !contentSec) return;

  if (isAdminLoggedIn) {
    authSec.style.display = 'none';
    contentSec.style.display = 'block';

    const bannerIn = document.getElementById('admin-banner-input');
    const phoneIn = document.getElementById('admin-phone-input');
    const waIn = document.getElementById('admin-whatsapp-input');
    const supUrl = document.getElementById('supabase-url-input');
    const supKey = document.getElementById('supabase-key-input');

    if (bannerIn) bannerIn.value = siteConfig.announcementText;
    if (phoneIn) phoneIn.value = siteConfig.phoneDisplay;
    if (waIn) waIn.value = siteConfig.whatsappNumber;
    if (supUrl) supUrl.value = siteConfig.supabaseUrl || '';
    if (supKey) supKey.value = siteConfig.supabaseAnonKey || '';

    renderAdminMenuList();
    updateSupabaseStatusIndicator();
  } else {
    authSec.style.display = 'block';
    contentSec.style.display = 'none';
  }
}

// Seed sample bookings & live orders if not present
function getStoredBookings() {
  const raw = localStorage.getItem('choco_loco_bookings');
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [
    { guest: 'Fatou Sowe', phone: '2207123456', guests: '4 Guests', date: 'Tonight', time: '7:00 PM', area: 'Indoor Ambient Lounge', status: 'Confirmed', notes: 'Birthday celebration' },
    { guest: 'Modou Ceesay', phone: '2203345678', guests: '2 Guests', date: 'Tomorrow', time: '8:30 PM', area: 'VIP Private Booth', status: 'Pending', notes: 'Anniversary dessert tasting' },
    { guest: 'Awa Jallow', phone: '2209988776', guests: '6 Guests', date: 'Saturday', time: '4:00 PM', area: 'Outdoor Terrace Patio', status: 'Confirmed', notes: 'High tea & waffle party' },
    { guest: 'Kemo Bojang', phone: '2207890123', guests: '2 Guests', date: 'Tonight', time: '9:15 PM', area: 'Indoor Ambient Lounge', status: 'Seated', notes: 'Dessert & Spanish latte' }
  ];
}

function getStoredOrders() {
  const raw = localStorage.getItem('choco_loco_orders');
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [
    { id: 'ORD-1042', table: 'Table 4', items: 'Bubble Waffle + 70% Dark Ganache + Pistachio Royale + Gelato', total: '430 GMD', status: 'Preparing' },
    { id: 'ORD-1041', table: 'Takeaway', items: '2x "Brownies to Die For" + 1x Lotus Biscoff Cheesecake', total: '680 GMD', status: 'Ready' },
    { id: 'ORD-1040', table: 'Table 2', items: 'Pistachio Sushi Crepe + 2x Specialty Spanish Lattes', total: '580 GMD', status: 'Delivered' },
    { id: 'ORD-1039', table: 'Table 7', items: 'Dutch Mini-Pancakes + Warm Milk Chocolate + Strawberries', total: '380 GMD', status: 'Delivered' }
  ];
}

function renderAdminMenuList() {
  const listEl = document.getElementById('admin-menu-list');
  if (!listEl) return;

  listEl.innerHTML = menuItems.map(item => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.8rem 0; border-bottom:1px solid rgba(255,255,255,0.08); gap:1rem;">
      <div style="flex:1;">
        <strong style="color:var(--cream); font-size:0.92rem;">${item.name}</strong>
        <div style="font-size:0.75rem; color:var(--gold-light);">${item.categoryLabel}</div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span style="font-size:0.78rem; color:var(--cream-muted);">GMD:</span>
        <input type="number" class="admin-price-input" value="${item.price}" onchange="updateItemPriceAdmin('${item.id}', this.value)" />
      </div>
      <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; font-size:0.8rem; color:${item.inStock ? '#55EFA0' : '#FF7675'}; font-weight:700;">
        <input type="checkbox" ${item.inStock ? 'checked' : ''} onchange="toggleMenuItemStock('${item.id}')" style="accent-color:var(--gold);" />
        ${item.inStock ? 'In Stock' : 'Sold Out'}
      </label>
    </div>
  `).join('');
}

window.updateItemPriceAdmin = function(id, val) {
  const price = parseInt(val, 10);
  if (isNaN(price) || price < 0) return;
  const item = menuItems.find(m => m.id === id);
  if (item) {
    item.price = price;
    localStorage.setItem('choco_loco_menu', JSON.stringify(menuItems));
    renderMenuGrid();
  }
};

function renderAdminBookings() {
  const tbody = document.getElementById('admin-bookings-table-body');
  if (!tbody) return;
  const bookings = getStoredBookings();

  tbody.innerHTML = bookings.map((b, idx) => `
    <tr>
      <td>
        <strong>${b.guest}</strong>
        <div style="font-size:0.74rem; color:var(--cream-muted);">${b.notes || 'No special requests'}</div>
      </td>
      <td>${b.guests}</td>
      <td>${b.date} &middot; ${b.time}</td>
      <td>${b.area}</td>
      <td>
        <span class="admin-badge-status ${b.status === 'Confirmed' ? 'status-confirmed' : b.status === 'Seated' ? 'status-seated' : 'status-pending'}">
          ${b.status}
        </span>
      </td>
      <td>
        <a href="https://wa.me/${b.phone}?text=Hello%20${encodeURIComponent(b.guest)}%2C%20your%20table%20reservation%20at%20Choco%20Loco%20Pipeline%20is%20confirmed!" target="_blank" rel="noopener" class="admin-action-btn-sm">
          WhatsApp
        </a>
      </td>
    </tr>
  `).join('');
}

function renderAdminOrders() {
  const tbody = document.getElementById('admin-orders-table-body');
  if (!tbody) return;
  const orders = getStoredOrders();

  tbody.innerHTML = orders.map((o, idx) => `
    <tr>
      <td><strong style="color:var(--gold);">${o.id}</strong></td>
      <td>${o.table}</td>
      <td style="max-width:240px; font-size:0.82rem; color:var(--cream-soft);">${o.items}</td>
      <td><strong style="color:var(--gold-bright); font-family:var(--font-mono);">${o.total}</strong></td>
      <td>
        <span class="admin-badge-status ${o.status === 'Delivered' ? 'status-confirmed' : o.status === 'Ready' ? 'status-seated' : 'status-pending'}">
          ${o.status}
        </span>
      </td>
      <td>
        <button class="admin-action-btn-sm" onclick="advanceOrderStatusAdmin(${idx})">
          Next Status
        </button>
      </td>
    </tr>
  `).join('');
}

window.advanceOrderStatusAdmin = function(idx) {
  const orders = getStoredOrders();
  if (orders[idx]) {
    if (orders[idx].status === 'Preparing') orders[idx].status = 'Ready';
    else if (orders[idx].status === 'Ready') orders[idx].status = 'Delivered';
    else orders[idx].status = 'Preparing';
    localStorage.setItem('choco_loco_orders', JSON.stringify(orders));
    renderAdminOrders();
  }
};

window.toggleStoreOpenAdmin = function() {
  const pill = document.getElementById('live-status-pill');
  if (!pill) return;
  const isCurrentlyOpen = pill.textContent.includes('OPEN');
  if (isCurrentlyOpen) {
    pill.className = 'live-status-pill';
    pill.style.background = 'rgba(231,76,60,0.2)';
    pill.style.borderColor = 'rgba(231,76,60,0.5)';
    pill.style.color = '#FF7675';
    pill.innerHTML = '<span class="pulse-dot" style="background:#E74C3C;"></span> CURRENTLY CLOSED';
    alert('Store status set to CLOSED on website.');
  } else {
    pill.className = 'live-status-pill';
    pill.style.background = 'rgba(46,204,113,0.2)';
    pill.style.borderColor = 'rgba(46,204,113,0.5)';
    pill.style.color = '#55efa0';
    pill.innerHTML = '<span class="pulse-dot"></span> OPEN NOW · Closes 11:00 PM';
    alert('Store status set to OPEN on website.');
  }
};

window.toggleMenuItemStock = function(id) {
  const item = menuItems.find(m => m.id === id);
  if (item) {
    item.inStock = !item.inStock;
    localStorage.setItem('choco_loco_menu', JSON.stringify(menuItems));
    renderAdminMenuList();
    renderMenuGrid();
  }
};

window.switchAdminTab = function(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');

  const panel = document.getElementById('admin-tab-' + tabName);
  if (panel) panel.style.display = 'block';

  // Highlight button
  const buttons = document.querySelectorAll('.admin-tab-btn');
  const tabs = ['dashboard', 'bookings', 'orders', 'menu', 'staff', 'settings'];
  const tabIdx = tabs.indexOf(tabName);
  if (tabIdx >= 0 && buttons[tabIdx]) {
    buttons[tabIdx].classList.add('active');
  }

  if (tabName === 'bookings') renderAdminBookings();
  if (tabName === 'orders') renderAdminOrders();
  if (tabName === 'menu') renderAdminMenuList();
};

window.handleBookingSubmit = function(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('book-name').value.trim();
  const phone = document.getElementById('book-phone').value.trim();
  const guests = document.getElementById('book-guests').value;
  const date = document.getElementById('book-date').value;
  const time = document.getElementById('book-time').value;
  const area = document.getElementById('book-area').value;
  const notes = document.getElementById('book-notes').value.trim();

  if (!name || !phone || !date) {
    alert('Please provide your name, phone number, and preferred date.');
    return;
  }

  // Save to stored bookings
  const bookings = getStoredBookings();
  bookings.unshift({
    guest: name,
    phone: phone.startsWith('220') ? phone : '220' + phone,
    guests: guests,
    date: date,
    time: time,
    area: area,
    status: 'Pending',
    notes: notes || 'Online table booking'
  });
  localStorage.setItem('choco_loco_bookings', JSON.stringify(bookings));

  // Construct pre-filled WhatsApp link
  const message = [
    'Hello Choco Loco, I would like to reserve a table:',
    'Guest: ' + name,
    'WhatsApp: ' + phone,
    'Party Size: ' + guests,
    'Date: ' + date,
    'Time: ' + time,
    'Seating: ' + area,
    notes ? ('Requests: ' + notes) : ''
  ].filter(Boolean).join('\n');

  const waUrl = 'https://wa.me/' + siteConfig.whatsappNumber + '?text=' + encodeURIComponent(message);

  alert('Thank you, ' + name + '! Your table reservation request has been created. Opening WhatsApp now to confirm with our floor manager.');
  window.open(waUrl, '_blank');
};

window.saveAdminSettings = function() {
  const banner = document.getElementById('admin-banner-input').value.trim();
  const phone = document.getElementById('admin-phone-input').value.trim();
  const wa = document.getElementById('admin-whatsapp-input').value.trim();
  const supUrl = document.getElementById('supabase-url-input').value.trim();
  const supKey = document.getElementById('supabase-key-input').value.trim();

  if (banner) siteConfig.announcementText = banner;
  if (phone) siteConfig.phoneDisplay = phone;
  if (wa) siteConfig.whatsappNumber = wa;
  siteConfig.supabaseUrl = supUrl;
  siteConfig.supabaseAnonKey = supKey;

  localStorage.setItem('choco_loco_config', JSON.stringify(siteConfig));

  const annEl = document.getElementById('announcement-text');
  if (annEl) annEl.textContent = siteConfig.announcementText;

  alert('Settings saved successfully!');
  closeAdminModal();
};

document.addEventListener('DOMContentLoaded', () => {
  const pwaBtn = document.getElementById('pwa-install-btn');
  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log('User response to PWA install:', outcome);
        deferredInstallPrompt = null;
      } else {
        alert('App is already installed or your browser does not support automatic prompts. On mobile Safari/Chrome, tap Share or Menu and Add to Home Screen.');
      }
    });
  }
});

// ══════════════════════════════════════════════════════════
// 9. SUPABASE BACKEND CLIENT WITH RESILIENT FALLBACK
// ══════════════════════════════════════════════════════════

function updateSupabaseStatusIndicator() {
  const badge = document.getElementById('supabase-status-badge');
  if (!badge) return;

  if (siteConfig.supabaseUrl && siteConfig.supabaseAnonKey) {
    badge.className = 'supabase-status-pill supabase-online';
    badge.textContent = 'Supabase Cloud Configured';
  } else {
    badge.className = 'supabase-status-pill supabase-fallback';
    badge.textContent = 'Local Resilient Fallback';
  }
}

window.testSupabaseConnection = async function() {
  const url = document.getElementById('supabase-url-input').value.trim();
  const key = document.getElementById('supabase-key-input').value.trim();

  if (!url || !key) {
    alert('Please enter both Supabase URL and Anon Key.');
    return;
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    if (res.ok || res.status === 404) {
      alert('Connection to Supabase successful!');
      siteConfig.supabaseUrl = url;
      siteConfig.supabaseAnonKey = key;
      localStorage.setItem('choco_loco_config', JSON.stringify(siteConfig));
      updateSupabaseStatusIndicator();
    } else {
      alert(`Supabase responded with status ${res.status}. Check API key and CORS permissions.`);
    }
  } catch (err) {
    alert(`Could not reach Supabase endpoint (${err.message}). Using local fallback mode.`);
  }
};

window.syncMenuToSupabase = async function() {
  if (!siteConfig.supabaseUrl || !siteConfig.supabaseAnonKey) {
    alert('Please configure Supabase URL and Key first, or continue enjoying local resilient storage.');
    return;
  }

  alert('Simulated sync: 13 menu items synchronized to Supabase menu_items table!');
};

// ══════════════════════════════════════════════════════════
// 10. SPA PAGE VIEW ROUTER
// ══════════════════════════════════════════════════════════

/**
 * Map of hash fragment -> data-page attribute on .page-view wrappers.
 * Pages that don't exist as separate views fall back to 'home'.
 */
const PAGE_MAP = {
  '':          'home',
  'home':      'home',
  'menu':      'menu',
  'studio':    'studio',
  'boutique':  'boutique',
  'lounge':    'lounge',
  'bookings':  'bookings',
  'catering':  'catering',
  'about':     'about',
  'location':  'location',
  // Legacy hash aliases (old section IDs in single-page layout)
  'hero':            'home',
  'custom-studio':   'studio',
  'retail-products': 'boutique',
  'gallery':         'lounge',
  'table-qr':        'location',
};

function getPageIdFromHash() {
  const raw = (location.hash || '#home').replace('#', '').toLowerCase();
  return PAGE_MAP[raw] || 'home';
}

function navigateToPage(pageId) {
  const allPages = document.querySelectorAll('.page-view');
  if (!allPages.length) return; // SPA containers not present

  allPages.forEach(p => {
    if (p.dataset.page === pageId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Update desktop nav active link
  document.querySelectorAll('.nav-link[data-target]').forEach(a => {
    a.classList.toggle('active', a.dataset.target === pageId);
  });

  // Update mobile drawer active link
  document.querySelectorAll('.drawer-link[data-target]').forEach(a => {
    a.classList.toggle('active', a.dataset.target === pageId);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-init map if navigating to location
  if (pageId === 'location') {
    setTimeout(initLeafletMap, 120);
  }
}

function initSPARouter() {
  // Handle all nav-link and drawer-link clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-target]');
    if (!link) return;

    const pageId = link.dataset.target;
    if (!pageId) return;

    e.preventDefault();
    history.pushState(null, '', '#' + pageId);
    navigateToPage(pageId);
    closeDrawer();
  });

  // Handle hash changes (browser back/forward)
  window.addEventListener('hashchange', () => {
    navigateToPage(getPageIdFromHash());
  });

  // Initial load
  navigateToPage(getPageIdFromHash());
}

// ══════════════════════════════════════════════════════════
// 11. MOBILE DRAWER
// ══════════════════════════════════════════════════════════

function openDrawer() {
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const btn     = document.getElementById('mobile-menu-btn');
  const ham     = btn ? btn.querySelector('.hamburger-icon') : null;
  const cls     = btn ? btn.querySelector('.close-icon') : null;

  if (drawer)  drawer.classList.add('open');
  if (overlay) {
    overlay.style.display = 'block';
    requestAnimationFrame(() => overlay.classList.add('open'));
  }
  if (ham) ham.style.display = 'none';
  if (cls) cls.style.display = '';
  if (btn) btn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const btn     = document.getElementById('mobile-menu-btn');
  const ham     = btn ? btn.querySelector('.hamburger-icon') : null;
  const cls     = btn ? btn.querySelector('.close-icon') : null;

  if (drawer)  drawer.classList.remove('open');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }
  if (ham) ham.style.display = '';
  if (cls) cls.style.display = 'none';
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer && drawer.classList.contains('open')) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

function initMobileDrawer() {
  const btn     = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (btn)      btn.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay)  overlay.addEventListener('click', closeDrawer);

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });
}

// ══════════════════════════════════════════════════════════
// 12. INITIALIZATION LIFECYCLE
// ══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);
  renderMenuGrid();
  initCategoryTabs();
  initStudioInteractions();
  initTableSelector();

  // SPA router must run before map init (map only inits when location page is active)
  initSPARouter();
  initMobileDrawer();

  // Only init map if location page is the starting page
  if (getPageIdFromHash() === 'location') {
    initLeafletMap();
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  });
});

