// -------------------------------------------------------------
// KMO RACK BAR CUSTOM - Front-end JavaScript App Logic
// -------------------------------------------------------------

// ==========================================
// 1. PRODUCT DATABASE & CONFIGURATION
// ==========================================
let PRODUCTS = [];

const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/11vOmugedMi3GoMN-a1NriI-hIvGVOSxg07fNI6DyRLM/export?format=csv';
const BOOKING_URL = 'https://kmorackbarcustom.github.io/booking.html';
const CUSTOMER_ORDER_URL = 'https://kmorackbarcustom.github.io/CustomerOrder.html';
const FALLBACK_PRODUCT_IMAGE = 'assets/images/service.jpg';

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
    category: 'gear',
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
    category: 'service',
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
let activeCatalogCategory = 'all';
let catalogSearchTerm = '';

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  loadProductsFromCSV().then(() => {
    renderCatalog();
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
      activeCatalogCategory = e.target.dataset.category || 'all';
      renderCatalog();
    });
  });

  const catalogSearchInput = document.getElementById('catalog-search-input');
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (e) => {
      catalogSearchTerm = e.target.value.trim().toLowerCase();
      renderCatalog();
    });
  }

  // Cart Drawer open/close
  const cartToggleBtn = document.getElementById('cart-toggle');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  
  cartToggleBtn.addEventListener('click', toggleCartDrawer);
  cartCloseBtn.addEventListener('click', toggleCartDrawer);
  cartBackdrop.addEventListener('click', toggleCartDrawer);

  // Checkout button in cart drawer
  const checkoutBookingBtn = document.getElementById('btn-checkout-cart');
  const checkoutOrderBtn = document.getElementById('btn-checkout-order');
  checkoutBookingBtn.addEventListener('click', () => {
    toggleCartDrawer();
    // ponytail: booking.html/calendar.html ไม่ maintain ไฟล์แยกในนี้แล้ว ลิงก์ออกไป production ที่เดียว กัน sync หลุด
    window.location.href = buildBookingCheckoutUrl();
  });
  checkoutOrderBtn.addEventListener('click', () => {
    toggleCartDrawer();
    window.location.href = buildOrderCheckoutUrl();
  });
}

// ==========================================
// 5. SHOPPING CART LOGIC
// ==========================================
function initCart() {
  const savedCart = localStorage.getItem('kmo_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart).map(item => ({
        ...item,
        type: item.type === 'order' ? 'order' : 'booking'
      }));
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

function addToCart(productId, type = 'booking') {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const itemType = type === 'order' ? 'order' : 'booking';
  const existingItem = cart.find(item => item.product.id === productId && item.type === itemType);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1, type: itemType });
  }

  saveCart();
  const actionLabel = itemType === 'order' ? 'สั่งซื้อกับทางร้าน' : 'จองคิวติดตั้ง';
  showToast(`เพิ่ม "${product.name}" ลงในตะกร้า${actionLabel}แล้ว`);
}

function updateQuantity(productId, type, quantity) {
  const item = cart.find(item => item.product.id === productId && item.type === type);
  if (!item) return;

  item.quantity = parseInt(quantity);
  if (item.quantity <= 0) {
    removeFromCart(productId, type);
  } else {
    saveCart();
  }
}

function removeFromCart(productId, type) {
  const itemIndex = cart.findIndex(item => item.product.id === productId && item.type === type);
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
  const cartOrderTotalVal = document.getElementById('cart-order-total-val');
  const checkoutCartBtn = document.getElementById('btn-checkout-cart');
  const checkoutOrderBtn = document.getElementById('btn-checkout-order');
  const cartFooter = document.querySelector('.cart-footer');
  const bookingFooter = document.getElementById('cart-booking-footer');
  const orderFooter = document.getElementById('cart-order-footer');
  
  const bookingItems = cart.filter(item => item.type === 'booking');
  const orderItems = cart.filter(item => item.type === 'order');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const bookingTotalPrice = getCartItemsSubtotal(bookingItems);
  const orderTotalPrice = getCartItemsSubtotal(orderItems);

  // Flat deposit rate of 500 Baht if there are items, otherwise 0
  const depositPrice = bookingItems.length > 0 ? 500 : 0;
  const balancePrice = Math.max(0, bookingTotalPrice - depositPrice);

  // Badge count updates
  if (totalItems > 0) {
    cartBadgeCount.textContent = totalItems;
    cartBadgeCount.style.display = 'flex';
    checkoutCartBtn.disabled = false;
  } else {
    cartBadgeCount.style.display = 'none';
  }

  checkoutCartBtn.disabled = bookingItems.length === 0;
  checkoutOrderBtn.disabled = orderItems.length === 0;
  cartFooter.style.display = totalItems > 0 ? 'block' : 'none';
  bookingFooter.style.display = bookingItems.length > 0 ? 'block' : 'none';
  orderFooter.style.display = orderItems.length > 0 ? 'block' : 'none';

  cartTotalVal.textContent = formatBaht(bookingTotalPrice);
  if (cartDepositVal) {
    cartDepositVal.textContent = formatBaht(depositPrice);
  }
  if (cartBalanceVal) {
    cartBalanceVal.textContent = formatBaht(balancePrice);
  }
  if (cartOrderTotalVal) {
    cartOrderTotalVal.textContent = formatBaht(orderTotalPrice);
  }

  // Populate Cart Items HTML
  if (cart.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'cart-empty-message';
    emptyMessage.textContent = 'ไม่มีสินค้าในตะกร้าของคุณ';
    cartItemsContainer.replaceChildren(emptyMessage);
  } else {
    cartItemsContainer.replaceChildren();
    if (bookingItems.length > 0) {
      cartItemsContainer.appendChild(createCartSectionElement('จองคิวติดตั้ง', bookingItems));
    }
    if (orderItems.length > 0) {
      cartItemsContainer.appendChild(createCartSectionElement('สั่งซื้อกับทางร้าน', orderItems));
    }
  }

  // Keep compatibility if the old inline booking section is reintroduced.
  if (typeof updateIntakeFormSelectedServices === 'function') {
    updateIntakeFormSelectedServices();
  }
}

// Global functions exposed to inline HTML event handlers
window.updateItemQty = function(productId, type, qty) {
  updateQuantity(productId, type, qty);
};

window.removeCartItem = function(productId, type) {
  removeFromCart(productId, type);
};

// ==========================================
// 6. PRODUCT CATALOG RENDERING
// ==========================================
function renderCatalog(category = activeCatalogCategory) {
  const productGridContainer = document.getElementById('product-grid-container');
  productGridContainer.replaceChildren();

  activeCatalogCategory = category || 'all';
  const filteredProducts = getFilteredProducts(activeCatalogCategory, catalogSearchTerm);

  if (filteredProducts.length === 0) {
    productGridContainer.appendChild(createCatalogEmptyStateElement());
    return;
  }

  filteredProducts.forEach(product => {
    productGridContainer.appendChild(createProductCardElement(product));
  });
}

function getFilteredProducts(category, searchTerm) {
  const normalizedTerm = (searchTerm || '').trim().toLowerCase();

  return PRODUCTS.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    if (!matchesCategory) return false;

    if (!normalizedTerm) return true;

    const searchableText = [
      product.name,
      product.description,
      product.category,
      getCategoryLabel(product.category)
    ].join(' ').toLowerCase();

    return searchableText.includes(normalizedTerm);
  });
}

function createCatalogEmptyStateElement() {
  const emptyState = document.createElement('div');
  emptyState.className = 'catalog-empty-state';

  const title = document.createElement('h3');
  title.className = 'catalog-empty-title';
  title.textContent = 'ไม่พบรุ่นนี้ในแคตตาล็อก';

  const description = document.createElement('p');
  description.className = 'catalog-empty-desc';
  description.textContent = 'ปรึกษาแอดมินได้เลย';

  const actions = document.createElement('div');
  actions.className = 'catalog-empty-actions';

  const lineLink = document.createElement('a');
  lineLink.className = 'catalog-empty-btn catalog-empty-btn-primary';
  lineLink.href = 'https://lin.ee/qeCcYUC';
  lineLink.target = '_blank';
  lineLink.rel = 'noopener noreferrer';
  lineLink.textContent = 'LINE OA';

  const facebookLink = document.createElement('a');
  facebookLink.className = 'catalog-empty-btn';
  facebookLink.href = 'https://m.me/215552639006777';
  facebookLink.target = '_blank';
  facebookLink.rel = 'noopener noreferrer';
  facebookLink.textContent = 'Facebook Inbox';

  actions.append(lineLink, facebookLink);
  emptyState.append(title, description, actions);

  return emptyState;
}

function createCartSectionElement(titleText, items) {
  const section = document.createElement('section');
  section.className = 'cart-item-section';

  const title = document.createElement('h3');
  title.className = 'cart-item-section-title';
  title.textContent = titleText;

  const list = document.createElement('div');
  list.className = 'cart-item-section-list';
  items.forEach(item => {
    list.appendChild(createCartItemElement(item));
  });

  section.append(title, list);
  return section;
}

function createCartItemElement(item) {
  const itemEl = document.createElement('div');
  itemEl.className = 'cart-item';

  const product = item.product;
  const image = document.createElement('img');
  image.className = 'cart-item-img';
  image.src = getSafeImageUrl(product.image);
  image.alt = product.name || '';
  image.addEventListener('error', () => {
    image.src = FALLBACK_PRODUCT_IMAGE;
  }, { once: true });

  const details = document.createElement('div');
  details.className = 'cart-item-details';

  const name = document.createElement('div');
  name.className = 'cart-item-name';
  name.textContent = product.name || '';

  const price = document.createElement('div');
  price.className = 'cart-item-price';
  price.textContent = `฿${(Number(product.price || 0) * item.quantity).toLocaleString()}`;

  const controls = document.createElement('div');
  controls.className = 'cart-item-controls';

  const quantitySelector = document.createElement('div');
  quantitySelector.className = 'quantity-selector';

  const minusBtn = document.createElement('button');
  minusBtn.className = 'quantity-btn min-btn';
  minusBtn.type = 'button';
  minusBtn.textContent = '-';
  minusBtn.addEventListener('click', () => updateQuantity(product.id, item.type, item.quantity - 1));

  const quantityVal = document.createElement('div');
  quantityVal.className = 'quantity-val';
  quantityVal.textContent = item.quantity;

  const plusBtn = document.createElement('button');
  plusBtn.className = 'quantity-btn plus-btn';
  plusBtn.type = 'button';
  plusBtn.textContent = '+';
  plusBtn.addEventListener('click', () => updateQuantity(product.id, item.type, item.quantity + 1));

  const removeBtn = document.createElement('button');
  removeBtn.className = 'cart-item-remove';
  removeBtn.type = 'button';
  removeBtn.textContent = 'ลบ';
  removeBtn.addEventListener('click', () => removeFromCart(product.id, item.type));

  quantitySelector.append(minusBtn, quantityVal, plusBtn);
  controls.append(quantitySelector, removeBtn);
  details.append(name, price, controls);
  itemEl.append(image, details);

  return itemEl;
}

function createProductCardElement(product) {
  const cardEl = document.createElement('div');
  cardEl.className = 'product-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'product-img-wrapper';

  const image = document.createElement('img');
  image.className = 'product-img';
  image.loading = 'lazy';
  image.src = getSafeImageUrl(product.image);
  image.alt = product.name || '';
  image.addEventListener('error', () => {
    image.src = FALLBACK_PRODUCT_IMAGE;
  }, { once: true });

  const tag = document.createElement('span');
  tag.className = 'product-tag';
  tag.textContent = getCategoryLabel(product.category);

  const info = document.createElement('div');
  info.className = 'product-info';

  const title = document.createElement('h3');
  title.className = 'product-title';
  title.textContent = product.name || '';

  const description = document.createElement('p');
  description.className = 'product-models';
  description.textContent = product.description || '';

  const footer = document.createElement('div');
  footer.className = 'product-footer';

  const priceRow = document.createElement('div');
  priceRow.className = 'product-price-row';

  const price = document.createElement('span');
  price.className = 'product-price';
  price.textContent = `฿${Number(product.price || 0).toLocaleString()}`;

  const actions = document.createElement('div');
  actions.className = 'product-actions';

  if (product.allow_booking) {
    const bookingBtn = document.createElement('button');
    bookingBtn.className = 'btn-add-cart';
    bookingBtn.type = 'button';
    bookingBtn.textContent = 'จองติดตั้ง';
    bookingBtn.addEventListener('click', () => addToCart(product.id, 'booking'));
    actions.appendChild(bookingBtn);
  }

  if (product.allow_order) {
    const hasShopeeUrl = product.shopee_url && product.shopee_url.trim() !== '';
    const orderBtn = hasShopeeUrl ? document.createElement('a') : document.createElement('button');
    orderBtn.className = 'btn-order';
    orderBtn.textContent = hasShopeeUrl ? 'สั่งซื้อ Shopee' : 'สั่งผลิต';
    if (hasShopeeUrl) {
      orderBtn.target = '_blank';
      orderBtn.rel = 'noopener noreferrer';
      orderBtn.href = getSafeExternalUrl(product.shopee_url, CUSTOMER_ORDER_URL);
    } else {
      orderBtn.type = 'button';
      orderBtn.addEventListener('click', () => addToCart(product.id, 'order'));
    }
    actions.appendChild(orderBtn);
  }

  imageWrapper.append(image, tag);
  priceRow.appendChild(price);
  footer.append(priceRow, actions);
  info.append(title, description, footer);
  cardEl.append(imageWrapper, info);

  return cardEl;
}

function getSafeImageUrl(url) {
  if (!url || url.trim() === '') {
    return FALLBACK_PRODUCT_IMAGE;
  }

  const trimmedUrl = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmedUrl)) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  return trimmedUrl;
}

function getSafeExternalUrl(url, fallbackUrl) {
  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch (error) {
    return fallbackUrl;
  }
  return fallbackUrl;
}

function getCartItemsSubtotal(items) {
  return items.reduce((sum, item) => {
    return sum + (Number(item.product.price || 0) * item.quantity);
  }, 0);
}

function formatBaht(amount) {
  return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
}

function encodeCartMeta(cartItems, flow) {
  const estimatedTotal = getCartItemsSubtotal(cartItems);
  const meta = {
    version: 1,
    flow,
    source_page: window.location.href.split('#')[0],
    estimated_total: estimatedTotal,
    currency: 'THB',
    items: cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      category: item.product.category,
      type: item.type,
      quantity: item.quantity,
      unit_price: Number(item.product.price || 0),
      subtotal: Number(item.product.price || 0) * item.quantity
    }))
  };

  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(meta))));
    return encoded.length <= 6000 ? encoded : '';
  } catch (error) {
    return '';
  }
}

function buildBookingCheckoutUrl() {
  const bookingItems = cart.filter(item => item.type === 'booking');
  if (bookingItems.length === 0) return BOOKING_URL;

  const services = bookingItems
    .map(item => {
      const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
      return `${item.product.name}${quantityText}`;
    })
    .join(', ');

  const totalPrice = getCartItemsSubtotal(bookingItems);
  const note = `ราคาอ้างอิงจากเว็บ ~${totalPrice.toLocaleString('th-TH')} บาท (ไม่ผูกมัด ยืนยันราคาจริงหน้างาน)`;
  const params = new URLSearchParams({
    services,
    note
  });
  const cartMeta = encodeCartMeta(bookingItems, 'booking');
  if (cartMeta) params.set('cart_meta', cartMeta);

  return `${BOOKING_URL}?${params.toString()}`;
}

function buildOrderCheckoutUrl() {
  const orderItems = cart.filter(item => item.type === 'order');
  if (orderItems.length === 0) return CUSTOMER_ORDER_URL;

  const categoryMap = {
    rear: 'rear_rack',
    side: 'side_rack',
    crashbar: 'crash_bar',
    accessory: 'bar',
    gear: 'other',
    service: 'other'
  };

  const productIds = new Set();
  orderItems.forEach(item => {
    const mappedProductId = categoryMap[item.product.category] || 'other';
    productIds.add(mappedProductId);
  });

  const itemsText = orderItems
    .map(item => {
      const quantityText = `x${item.quantity}`;
      const itemPrice = Number(item.product.price || 0) * item.quantity;
      return `${item.product.name} ${quantityText} (${itemPrice.toLocaleString('th-TH')} บาท)`;
    })
    .join(', ');

  const totalPrice = getCartItemsSubtotal(orderItems);
  const otherText = `อ้างอิงจากเว็บ: ${itemsText} | รวมประมาณ ${totalPrice.toLocaleString('th-TH')} บาท (ไม่ผูกมัด ยืนยันราคาจริงกับแอดมิน)`;
  const params = new URLSearchParams({
    products: Array.from(productIds).join(','),
    other_text: otherText
  });
  const cartMeta = encodeCartMeta(orderItems, 'order');
  if (cartMeta) params.set('cart_meta', cartMeta);

  return `${CUSTOMER_ORDER_URL}?${params.toString()}`;
}

function getCategoryLabel(category) {
  switch (category) {
    case 'rear': return 'แร็คท้าย';
    case 'side': return 'แร็คข้าง';
    case 'crashbar': return 'แครชบาร์';
    case 'accessory': return 'อุปกรณ์แต่งรถ';
    case 'gear': return 'ไฟ/จอ/กล่อง/กระเป๋า';
    case 'service': return 'บริการ';
    default: return 'อื่นๆ';
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
  if (!overlay || !textEl) return;

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
