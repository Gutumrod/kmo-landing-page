// -------------------------------------------------------------
// KMO RACK BAR CUSTOM - Front-end JavaScript App Logic
// -------------------------------------------------------------

// ==========================================
// 1. PRODUCT DATABASE & CONFIGURATION
// ==========================================
let PRODUCTS = [];

// Google Sheets CSV URL - Replace this with your actual published CSV link
// To publish: File -> Share -> Publish to web -> Select sheet -> Format CSV
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5K76P35W6v3c85l4k35s0e3c8/pub?output=csv'; // Placeholder URL

// Fallback products in case CSV fetch fails
const FALLBACK_PRODUCTS = [
  {
    id: 'rear-forza',
    name: 'แร็คท้าย Forza 350 Custom',
    price: 2900,
    category: 'rear',
    description: 'แร็คท้ายเหล็กหนาพิเศษ พ่นสีพาวเดอร์โค้ทดำกึ่งเงา ตรงรุ่นสำหรับ Honda Forza 350',
    image: 'assets/images/rack-rear-forza.jpg',
    shopee_url: '',
    allow_booking: true,
    allow_order: true
  },
  {
    id: 'rear-adv',
    name: 'แร็คท้าย ADV 350 Heavy Duty',
    price: 2900,
    category: 'rear',
    description: 'แร็คท้ายสำหรับสายลุย บรรทุกหนักได้สบาย ออกแบบรองรับการติดตั้งกล่องท้ายทุกแบรนด์',
    image: 'assets/images/rack-rear-adv.jpg',
    shopee_url: '',
    allow_booking: true,
    allow_order: true
  },
  {
    id: 'side-adv-forza',
    name: 'ชุดแร็คข้าง ADV350 / Forza 350',
    price: 3500,
    category: 'side',
    description: 'ชุดแร็คข้างแบบเข้ารูป บรรทุกปี๊บข้างหรือกระเป๋าข้างทัวริ่งได้อย่างมั่นคง แข็งแรงพิเศษ',
    image: 'assets/images/rack-side.jpg',
    shopee_url: '',
    allow_booking: true,
    allow_order: true
  },
  {
    id: 'rack-giorno',
    name: 'แร็คท้าย & ตะแกรงหน้า Giorno+',
    price: 1800,
    category: 'rear',
    description: 'แร็คท้ายดีไซน์คลาสสิก เข้ากับทรงรถ Honda Giorno+ แข็งแรงใช้งานได้จริง',
    image: 'assets/images/giorno-rack.jpg',
    shopee_url: '',
    allow_booking: true,
    allow_order: true
  },
  {
    id: 'crashbar-adv',
    name: 'ชุดแครชบาร์ ADV350 เต็มระบบ',
    price: 4500,
    category: 'crashbar',
    description: 'แครชบาร์กันล้มคัสตอม ป้องกันตัวรถรอบคัน ท่อเหล็กหนา พ่นสีกันสนิมหนาพิเศษ',
    image: 'assets/images/crashbar.jpg',
    shopee_url: '',
    allow_booking: true,
    allow_order: true
  },
  {
    id: 'spotlight-60w',
    name: 'ไฟสปอร์ตไลท์คู่ Motovision (60W)',
    price: 3200,
    category: 'other',
    description: 'ไฟสปอร์ตไลท์เพิ่มทัศนวิสัยเวลากลางคืน พร้อมชุดขาสแตนเลสและสวิตช์กันน้ำ',
    image: 'assets/images/spotlight.jpg',
    shopee_url: '',
    allow_booking: false,
    allow_order: true
  },
  {
    id: 'service-installation',
    name: 'บริการติดตั้งด่วน & เซ็ตระบบไฟ',
    price: 500,
    category: 'other',
    description: 'บริการเดินสายไฟสปอร์ตไลท์แบบซ่อนสาย ติดตั้งอุปกรณ์เสริมอื่นๆ โดยช่างมืออาชีพ',
    image: 'assets/images/service.jpg',
    shopee_url: '',
    allow_booking: true,
    allow_order: false
  }
];

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
let cart = [];
let isCatalogLoading = false;

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  loadProductsFromCSV().then(() => {
    renderCatalog('all');
  });
  initEventListeners();
});

// ==========================================
// 3.5 GOOGLE SHEETS CSV CLIENT-SIDE PARSER
// ==========================================
async function loadProductsFromCSV() {
  if (isCatalogLoading) return;
  isCatalogLoading = true;
  toggleLoader(true, 'กำลังดึงข้อมูลแคตตาล็อกสินค้า...');
  const startTime = performance.now();

  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL);
    if (!response.ok) throw new Error('Sheet network response failed');
    const csvText = await response.text();
    
    const parsed = parseCSV(csvText);
    if (parsed && parsed.length > 0) {
      PRODUCTS = parsed;
      const endTime = performance.now();
      console.log(`Successfully fetched and parsed ${PRODUCTS.length} products from CSV in ${(endTime - startTime).toFixed(2)}ms`);
    } else {
      throw new Error('Parsed CSV resulted in 0 products');
    }
  } catch (error) {
    console.warn('Failed to load products from Google Sheets CSV. Falling back to default list. Error:', error);
    PRODUCTS = FALLBACK_PRODUCTS;
  } finally {
    isCatalogLoading = false;
    toggleLoader(false);
  }
}

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }

  if (lines.length < 2) return [];
  const headers = lines[0].map(h => h.trim().toLowerCase());
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i];
    if (cells.length < headers.length) continue;
    const p = {};
    headers.forEach((header, index) => {
      const val = cells[index] ? cells[index].trim() : '';
      if (header === 'price') {
        p[header] = parseInt(val) || 0;
      } else if (header === 'allow_booking' || header === 'allow_order') {
        p[header] = val.toUpperCase() === 'TRUE';
      } else if (header === 'image_url') {
        p[header] = val;
        p['image'] = val; // map alias
      } else {
        p[header] = val;
      }
    });
    products.push(p);
  }
  return products;
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================
function initEventListeners() {
  // Navigation Links highlighting on scroll
  window.addEventListener('scroll', highlightNavOnScroll);

  // Catalog Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderCatalog(e.target.dataset.category);
    });
  });

  // Cart Drawer open/close
  const cartToggleBtn = document.getElementById('cart-toggle');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  
  cartToggleBtn.addEventListener('click', toggleCartDrawer);
  cartCloseBtn.addEventListener('click', toggleCartDrawer);
  cartBackdrop.addEventListener('click', toggleCartDrawer);

  // Checkout button in cart drawer
  const checkoutCartBtn = document.getElementById('btn-checkout-cart');
  checkoutCartBtn.addEventListener('click', () => {
    toggleCartDrawer();
    // ponytail: booking.html/calendar.html ไม่ maintain ไฟล์แยกในนี้แล้ว ลิงก์ออกไป production ที่เดียว กัน sync หลุด
    window.location.href = 'https://kmorackbarcustom.github.io/booking.html';
  });
}

// ==========================================
// 5. SHOPPING CART LOGIC
// ==========================================
function initCart() {
  const savedCart = localStorage.getItem('kmo_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('kmo_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.product.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  saveCart();
  showToast(`เพิ่ม "${product.name}" ลงในตะกร้าแล้ว`);
}

function updateQuantity(productId, quantity) {
  const item = cart.find(item => item.product.id === productId);
  if (!item) return;

  item.quantity = parseInt(quantity);
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  if (itemIndex > -1) {
    const itemName = cart[itemIndex].product.name;
    cart.splice(itemIndex, 1);
    saveCart();
    showToast(`นำ "${itemName}" ออกจากตะกร้าเรียบร้อย`, 'danger');
  }
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  drawer.classList.toggle('open');
  backdrop.classList.toggle('open');
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const cartTotalVal = document.getElementById('cart-total-val');
  const cartDepositVal = document.getElementById('cart-deposit-val');
  const cartBalanceVal = document.getElementById('cart-balance-val');
  const checkoutCartBtn = document.getElementById('btn-checkout-cart');
  
  // Calculate total items count and subtotal price
  let totalItems = 0;
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.product.price * item.quantity;
  });

  // Flat deposit rate of 500 Baht if there are items, otherwise 0
  const depositPrice = totalItems > 0 ? 500 : 0;
  const balancePrice = Math.max(0, totalPrice - depositPrice);

  // Badge count updates
  if (totalItems > 0) {
    cartBadgeCount.textContent = totalItems;
    cartBadgeCount.style.display = 'flex';
    checkoutCartBtn.disabled = false;
  } else {
    cartBadgeCount.style.display = 'none';
    checkoutCartBtn.disabled = true;
  }

  cartTotalVal.textContent = `฿${totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  if (cartDepositVal) {
    cartDepositVal.textContent = `฿${depositPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  }
  if (cartBalanceVal) {
    cartBalanceVal.textContent = `฿${balancePrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  }

  // Populate Cart Items HTML
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty-message">ไม่มีสินค้าในตะกร้าของคุณ</div>';
  } else {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-price">฿${(item.product.price * item.quantity).toLocaleString()}</div>
          <div class="cart-item-controls">
            <div class="quantity-selector">
              <button class="quantity-btn min-btn" onclick="updateItemQty('${item.product.id}', ${item.quantity - 1})">-</button>
              <div class="quantity-val">${item.quantity}</div>
              <button class="quantity-btn plus-btn" onclick="updateItemQty('${item.product.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem('${item.product.id}')">ลบ</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  // Also update checkout section in Intake Form
  updateIntakeFormSelectedServices();
}

// Global functions exposed to inline HTML event handlers
window.updateItemQty = function(productId, qty) {
  updateQuantity(productId, qty);
};

window.removeCartItem = function(productId) {
  removeFromCart(productId);
};

// ==========================================
// 6. PRODUCT CATALOG RENDERING
// ==========================================
function renderCatalog(category) {
  const productGridContainer = document.getElementById('product-grid-container');
  productGridContainer.innerHTML = '';

  const filteredProducts = category === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  filteredProducts.forEach(product => {
    const cardEl = document.createElement('div');
    cardEl.className = 'product-card';
    
    // Determine dynamic actions buttons
    let actionButtonsHTML = '';
    
    if (product.allow_booking) {
      actionButtonsHTML += `<button class="btn-add-cart" onclick="addToCart('${product.id}')">จองติดตั้ง</button>`;
    }
    
    if (product.allow_order) {
      const orderUrl = product.shopee_url && product.shopee_url.trim() !== '' 
        ? product.shopee_url 
        : 'https://kmorackbarcustom.github.io/CustomerOrder.html';
      const orderBtnLabel = product.shopee_url && product.shopee_url.trim() !== '' 
        ? 'สั่งซื้อ Shopee' 
        : 'สั่งผลิต';
      actionButtonsHTML += `<a href="${orderUrl}" target="_blank" class="btn-order">${orderBtnLabel}</a>`;
    }

    cardEl.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='assets/images/service.jpg'">
        <span class="product-tag">${getCategoryLabel(product.category)}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-models">${product.description}</p>
        <div class="product-footer">
          <div class="product-price-row">
            <span class="product-price">฿${product.price.toLocaleString()}</span>
          </div>
          <div class="product-actions">
            ${actionButtonsHTML}
          </div>
        </div>
      </div>
    `;
    productGridContainer.appendChild(cardEl);
  });
}

function getCategoryLabel(category) {
  switch (category) {
    case 'rear': return 'แร็คท้าย';
    case 'side': return 'แร็คข้าง';
    case 'crashbar': return 'แครชบาร์';
    default: return 'อุปกรณ์เสริม';
  }
}

// ==========================================
// 7. DEPRECATED INLINE BOOKING (MOVED TO booking.html & calendar.html)
// ==========================================

// ==========================================
// 11. GENERAL UTILITY FUNCTIONS
// ==========================================
function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateStrInput(date) {
  return formatDateStr(date);
}

function formatThaiDateStr(date) {
  const d = date.getDate();
  const m = THAI_MONTHS[date.getMonth()];
  const y = date.getFullYear() + 543;
  return `${d} ${m} ${y}`;
}

function toggleLoader(show, text = 'กำลังโหลด...') {
  const overlay = document.getElementById('booking-loading');
  const textEl = document.getElementById('loading-text');
  if (show) {
    textEl.textContent = text;
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
}

function highlightNavOnScroll() {
  const sections = ['hero', 'catalog', 'booking'];
  const scrollPosition = window.scrollY + 100;

  sections.forEach(id => {
    const el = document.getElementById(id);
    const navLink = document.getElementById(`nav-${id}`);
    if (el && navLink) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-wrapper');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
