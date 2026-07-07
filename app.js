// -------------------------------------------------------------
// KMO RACK BAR CUSTOM - Front-end JavaScript App Logic
// -------------------------------------------------------------

// ==========================================
// 1. PRODUCT DATABASE & CONFIGURATION
// ==========================================
const PRODUCTS = [
  {
    id: 'rear-forza',
    name: 'แร็คท้าย Forza 350 Custom',
    price: 2500,
    category: 'rear',
    description: 'แร็คท้ายเหล็กหนาพิเศษ พ่นสีพาวเดอร์โค้ทดำกึ่งเงา ตรงรุ่นสำหรับ Honda Forza 350',
    image: 'assets/images/rack-rear-forza.jpg'
  },
  {
    id: 'rear-adv',
    name: 'แร็คท้าย ADV 350 Heavy Duty',
    price: 2500,
    category: 'rear',
    description: 'แร็คท้ายสำหรับสายลุย บรรทุกหนักได้สบาย ออกแบบรองรับการติดตั้งกล่องท้ายทุกแบรนด์',
    image: 'assets/images/rack-rear-adv.jpg'
  },
  {
    id: 'side-adv-forza',
    name: 'ชุดแร็คข้าง ADV350 / Forza 350',
    price: 3500,
    category: 'side',
    description: 'ชุดแร็คข้างแบบเข้ารูป บรรทุกปี๊บข้างหรือกระเป๋าข้างทัวริ่งได้อย่างมั่นคง แข็งแรงพิเศษ',
    image: 'assets/images/rack-side.jpg'
  },
  {
    id: 'rack-giorno',
    name: 'แร็คท้าย & ตะแกรงหน้า Giorno+',
    price: 1800,
    category: 'rear',
    description: 'แร็คท้ายดีไซน์คลาสสิก เข้ากับทรงรถ Honda Giorno+ แข็งแรงใช้งานได้จริง',
    image: 'assets/images/giorno-rack.jpg'
  },
  {
    id: 'crashbar-adv',
    name: 'ชุดแครชบาร์ ADV350 เต็มระบบ',
    price: 4500,
    category: 'crashbar',
    description: 'แครชบาร์กันล้มคัสตอม ป้องกันตัวรถรอบคัน ท่อเหล็กหนา พ่นสีกันสนิมหนาพิเศษ',
    image: 'assets/images/crashbar.jpg'
  },
  {
    id: 'spotlight-60w',
    name: 'ไฟสปอร์ตไลท์คู่ Motovision (60W)',
    price: 3200,
    category: 'other',
    description: 'ไฟสปอร์ตไลท์เพิ่มทัศนวิสัยเวลากลางคืน พร้อมชุดขาสแตนเลสและสวิตช์กันน้ำ',
    image: 'assets/images/spotlight.jpg'
  },
  {
    id: 'service-installation',
    name: 'บริการติดตั้งด่วน & เซ็ตระบบไฟ',
    price: 500,
    category: 'other',
    description: 'บริการเดินสายไฟสปอร์ตไลท์แบบซ่อนสาย ติดตั้งอุปกรณ์เสริมอื่นๆ โดยช่างมืออาชีพ',
    image: 'assets/images/service.jpg'
  }
];

// Apps Script API URLs
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXPeVBxV4DGV_kH6omKgRzf7-f5vpgUiBxkq0fBOqAmAAVX6_Z8tDg8Zh3IHd1RFnhEA/exec';
const CALENDAR_API_URL = 'https://script.google.com/macros/s/AKfycbywK3CGtpGqT9qrS3dRKGUbAIS-n6dNgujLQO6sJ4SV-eRDvGo7e2amj9gJ2aCgLsSi/exec';

const MAX_PER_DAY = 3;

// Thai Months Translation helper
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Special holidays list (YYYY-MM-DD)
const SPECIAL_HOLIDAYS = [
  '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14', '2026-04-15', '2026-04-16', // Songkran
  '2026-05-01', // Labor Day
  '2026-12-05', '2026-12-31'
];

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
let cart = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-based
let bookingData = {}; // Stores slot counts { 'YYYY-MM-DD': count }
let selectedDateStr = ''; // Stores selected date 'YYYY-MM-DD'
let currentStep = 1;
let isCalendarLoading = false;

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  renderCatalog('all');
  initEventListeners();
  loadCalendarSlots();
});

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
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  });

  // Step 1: Calendar Navigation buttons
  document.getElementById('cal-prev-month').addEventListener('click', () => changeMonth(-1));
  document.getElementById('cal-next-month').addEventListener('click', () => changeMonth(1));

  // Step 1: Navigation to Step 2
  document.getElementById('btn-goto-step2').addEventListener('click', () => {
    if (selectedDateStr) {
      goToStep(2);
    }
  });

  // Step 2: Form Back to Step 1 button
  document.getElementById('btn-back-to-step1').addEventListener('click', () => {
    goToStep(1);
  });

  // Step 2: Form Submit
  const bookingForm = document.getElementById('booking-form');
  bookingForm.addEventListener('submit', handleFormSubmit);

  // Success Step Restart Flow Button
  document.getElementById('btn-restart-flow').addEventListener('click', restartBookingFlow);
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
  const checkoutCartBtn = document.getElementById('btn-checkout-cart');
  
  // Calculate total items count and subtotal price
  let totalItems = 0;
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.product.price * item.quantity;
  });

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
    cardEl.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <span class="product-tag">${getCategoryLabel(product.category)}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-models">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">฿${product.price.toLocaleString()}</span>
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">ใส่ตะกร้า</button>
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
// 7. BOOKING CALENDAR SYSTEM
// ==========================================
async function loadCalendarSlots() {
  if (isCalendarLoading) return;
  isCalendarLoading = true;
  toggleLoader(true, 'กำลังดึงข้อมูลคิวที่ว่างล่าสุด...');

  try {
    const url = `${CALENDAR_API_URL}?year=${currentYear}&month=${currentMonth + 1}`;
    const response = await fetch(url);
    const data = await response.json();
    bookingData = data.bookings || {};
  } catch (error) {
    console.error('Failed to load slots from Apps Script:', error);
    bookingData = {};
    showToast('ไม่สามารถเชื่อมต่อข้อมูลปฏิทินคิวว่างได้ชั่วคราว', 'danger');
  }

  isCalendarLoading = false;
  toggleLoader(false);
  renderCalendar();
}

function renderCalendar() {
  const monthTitle = document.getElementById('calendar-month-title');
  const daysGrid = document.getElementById('calendar-days-grid');
  
  monthTitle.textContent = `${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;
  daysGrid.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
  const daysInMonth = lastDay.getDate();

  // 1. Generate padding cells for previous month
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    daysGrid.appendChild(emptyCell);
  }

  // 2. Generate actual days in the selected month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const dateStr = formatDateStr(date);
    const isPast = date < today;
    const isTuesday = date.getDay() === 2;
    const isHoliday = SPECIAL_HOLIDAYS.includes(dateStr);
    const slotCount = bookingData[dateStr] || 0;
    const slotsRemaining = MAX_PER_DAY - slotCount;

    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.dataset.date = dateStr;

    // Set status state classes
    let statusText = '';
    let statusClass = '';

    if (isPast) {
      dayEl.classList.add('past', 'disabled');
    } else if (isTuesday || isHoliday || slotsRemaining <= 0) {
      dayEl.classList.add('disabled', 'status-full');
      statusText = isTuesday ? 'ร้านหยุดประจำ' : (isHoliday ? 'วันหยุดพิเศษ' : 'เต็มโควตา');
    } else if (slotsRemaining <= 2) {
      statusClass = 'status-low';
      statusText = `ว่าง ${slotsRemaining} คิว`;
      dayEl.classList.add('status-low');
    } else {
      statusClass = 'status-open';
      statusText = `ว่าง ${slotsRemaining} คิว`;
      dayEl.classList.add('status-open');
    }

    // Today highlight
    if (formatDateStr(today) === dateStr) {
      dayEl.classList.add('today');
    }

    // Selection recovery
    if (selectedDateStr === dateStr) {
      dayEl.classList.add('selected');
    }

    // Inner layout for day cells
    dayEl.innerHTML = `
      <div class="day-number-circle">${d}</div>
      <div class="day-slot-status">${statusText}</div>
      ${(!isPast && !isTuesday && !isHoliday && slotsRemaining > 0) ? '<div class="day-dot-indicator"></div>' : ''}
    `;

    // Click handler for day cells
    if (!isPast && !isTuesday && !isHoliday && slotsRemaining > 0) {
      dayEl.addEventListener('click', () => {
        // Toggle selected state
        const allDays = daysGrid.querySelectorAll('.calendar-day');
        allDays.forEach(day => day.classList.remove('selected'));
        
        selectedDateStr = dateStr;
        dayEl.classList.add('selected');
        document.getElementById('btn-goto-step2').disabled = false;
        
        // Populate dates in Form
        const formattedThaiAppointDate = formatThaiDateStr(date);
        document.getElementById('display-appoint-date').value = formattedThaiAppointDate;
        
        // Auto default pickup date to next day (or same day)
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        document.getElementById('input-pickup-date').value = formatDateStrInput(nextDay);
        document.getElementById('input-pickup-date').min = dateStr;
      });
    }

    daysGrid.appendChild(dayEl);
  }

  // Disable Prev month navigation button if viewing the current month
  const currentActualDate = new Date();
  const isViewingCurrentMonth = currentYear === currentActualDate.getFullYear() && currentMonth === currentActualDate.getMonth();
  document.getElementById('cal-prev-month').disabled = isViewingCurrentMonth;
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  selectedDateStr = '';
  document.getElementById('btn-goto-step2').disabled = true;
  loadCalendarSlots();
}

// ==========================================
// 8. BOOKING FORM & INTAKE LOGIC
// ==========================================
function updateIntakeFormSelectedServices() {
  const container = document.getElementById('form-items-container');
  if (cart.length === 0) {
    container.innerHTML = '<span class="selected-item-tag">🛠️ งานคัสตอมทั่วไป (ไม่มีรายการของในตะกร้า)</span>';
  } else {
    container.innerHTML = '';
    cart.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'selected-item-tag';
      tag.textContent = `• ${item.product.name} (x${item.quantity})`;
      container.appendChild(tag);
    });
  }
}

function getServicesString() {
  if (cart.length === 0) {
    return 'งานแร็คคัสตอมทั่วไป';
  }
  return cart.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'danger');
    return;
  }

  toggleLoader(true, 'กำลังส่งข้อมูลจองคิวเข้าระบบ...');

  const nameVal = document.getElementById('input-name').value.trim();
  const phoneVal = document.getElementById('input-phone').value.trim();
  const platformVal = document.getElementById('select-platform').value;
  const brandVal = document.getElementById('input-brand').value.trim();
  const modelVal = document.getElementById('input-model').value.trim();
  const colorVal = document.getElementById('input-color').value.trim() || 'ไม่ได้ระบุ';
  const pickupDateVal = document.getElementById('input-pickup-date').value;

  const payload = {
    name: nameVal,
    phone: phoneVal,
    platform: platformVal,
    brand: brandVal,
    model: modelVal,
    services: getServicesString(),
    color: colorVal,
    appointDate: selectedDateStr,
    pickupDate: pickupDateVal
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (result.result === 'success') {
      showToast('ส่งคำขอจองคิวสำเร็จแล้ว!');
      
      // Clear LocalStorage cart on success
      cart = [];
      saveCart();

      // Configure Line pre-filled message URL
      setupLineMessageLink(payload);

      // Navigate to step 3 (Payment Details)
      goToStep(3);
    } else {
      throw new Error(result.message || 'API Error');
    }
  } catch (error) {
    console.error('Submission failed:', error);
    showToast('เกิดข้อผิดพลาดในการบันทึกคิว กรุณาลองใหม่อีกครั้ง', 'danger');
  } finally {
    toggleLoader(false);
  }
}

function validateForm() {
  let isValid = true;
  
  // Validate Name
  const nameField = document.getElementById('input-name');
  if (nameField.value.trim() === '') {
    markFieldError('group-name', true);
    isValid = false;
  } else {
    markFieldError('group-name', false);
  }

  // Validate Phone (10 digits)
  const phoneField = document.getElementById('input-phone');
  const phoneRegex = /^[0-9]{9,10}$/;
  if (!phoneRegex.test(phoneField.value.trim())) {
    markFieldError('group-phone', true);
    isValid = false;
  } else {
    markFieldError('group-phone', false);
  }

  // Validate Platform selection
  const platformField = document.getElementById('select-platform');
  if (platformField.value === '') {
    markFieldError('group-platform', true);
    isValid = false;
  } else {
    markFieldError('group-platform', false);
  }

  // Validate Motorcycle Brand
  const brandField = document.getElementById('input-brand');
  if (brandField.value.trim() === '') {
    markFieldError('group-brand', true);
    isValid = false;
  } else {
    markFieldError('group-brand', false);
  }

  // Validate Motorcycle Model
  const modelField = document.getElementById('input-model');
  if (modelField.value.trim() === '') {
    markFieldError('group-model', true);
    isValid = false;
  } else {
    markFieldError('group-model', false);
  }

  // Validate Pickup Date
  const pickupField = document.getElementById('input-pickup-date');
  if (pickupField.value === '') {
    markFieldError('group-pickup-date', true);
    isValid = false;
  } else {
    markFieldError('group-pickup-date', false);
  }

  return isValid;
}

function markFieldError(groupId, hasError) {
  const el = document.getElementById(groupId);
  if (el) {
    if (hasError) {
      el.classList.add('has-error');
    } else {
      el.classList.remove('has-error');
    }
  }
}

// ==========================================
// 9. LINE MESSAGE PROTOCOL SETUP
// ==========================================
function setupLineMessageLink(data) {
  const appointDateFormatted = formatThaiDateStr(new Date(data.appointDate));
  const pickupDateFormatted = formatThaiDateStr(new Date(data.pickupDate));
  
  const textMsg = `🏍️ *แจ้งจองคิวติดตั้ง KMO CUSTOM*
ชื่อผู้จอง: ${data.name}
เบอร์โทร: ${data.phone}
แพลตฟอร์ม: ${data.platform}
ยี่ห้อ: ${data.brand}
รุ่นรถ: ${data.model}
วันนัดติดตั้ง: ${appointDateFormatted}
วันรับรถ: ${pickupDateFormatted}
รายการ: ${data.services}
สี: ${data.color}
-------------------------
*แนบสลิปโอนเงินมัดจำ 500 บาท ที่นี่*`;

  // URL Encode message parameters for Line URL
  const encodedText = encodeURIComponent(textMsg);
  
  // Set link hrefs
  const lineOfficialLink = `https://line.me/R/oaMessage/%40kmocustom/?${encodedText}`;
  
  document.getElementById('btn-line-confirm').href = lineOfficialLink;
  document.getElementById('btn-success-line').href = lineOfficialLink;
}

// ==========================================
// 10. STEP WIZARD NAVIGATION
// ==========================================
function goToStep(stepNum) {
  currentStep = stepNum;
  
  // Update step indicators
  const indicators = document.querySelectorAll('.step-indicator');
  indicators.forEach((ind, index) => {
    const indNum = index + 1;
    ind.classList.remove('active', 'completed');
    if (indNum === stepNum) {
      ind.classList.add('active');
    } else if (indNum < stepNum) {
      ind.classList.add('completed');
    }
  });

  // Update panels
  const panels = document.querySelectorAll('.step-panel');
  panels.forEach(panel => panel.classList.remove('active'));

  const activePanel = document.getElementById(`step-panel-${stepNum}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }
}

function restartBookingFlow() {
  selectedDateStr = '';
  document.getElementById('btn-goto-step2').disabled = true;
  document.getElementById('booking-form').reset();
  
  // Reset all validation styles
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => group.classList.remove('has-error'));

  loadCalendarSlots();
  goToStep(1);
}

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
