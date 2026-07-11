# Codex Task Brief — KMO Landing Page (Phase C: ตะกร้าแบ่ง 2 กลุ่ม)

อ่านเต็มก่อนเริ่ม: `implementation_plan.md` (Phase C บรรทัด 61-64) + `PROJECT_CONTEXT.md`

Phase 0+A+B+E เสร็จและ push แล้ว (`ebc024a`, `origin/main` up to date ณ 2026-07-11).

---

## ⚠️ Phase 0 — Gate บังคับ

1. ทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น ห้ามแตะ `D:\AI-Workspace\projects\landing page\KMO\`
2. `git remote -v` ต้องขึ้น `Gutumrod/kmo-landing-page` เท่านั้น
3. `git status` ต้อง clean + `git pull` ก่อนแก้ไฟล์
4. ถ้าเจอ path/remote ผิด → หยุดทันที ถามกลับก่อน

---

## บริบทสำคัญ — สถานะจริงที่ค้นพบระหว่างคุยกับ CEO (2026-07-11)

Plan เดิมสมมติว่า "ตะกร้ามีของปนกันระหว่างสั่งซื้อ/จองคิว ต้องแยก" แต่โค้ดจริงตอนนี้:
- ปุ่ม **"จองติดตั้ง"** (`allow_booking`) → `addToCart(product.id)` เข้าตะกร้าอยู่แล้ว
- ปุ่ม **"สั่งซื้อ"** (`allow_order`) เป็น `<a>` ลิงก์ตรงออกไปทันที **ไม่เข้าตะกร้าเลย** — และมี 2 เคสปนกันอยู่ในปุ่มเดียว (`app.js` บรรทัด ~565-572):
  - มี `shopee_url` → ลิงก์ไป Shopee
  - ไม่มี `shopee_url` → ลิงก์ตรงไป `CustomerOrder.html`

**CEO ยืนยันแล้วว่า "สั่งซื้อ" ต้องมี 2 ทางแยกกันชัดเจน:**
1. **สั่งซื้อกับทางร้าน** (ไม่มี shopee_url) → **ต้องเข้าตะกร้า** เหมือนจองติดตั้ง แล้วค่อย checkout ไป `CustomerOrder.html`
2. **สั่งซื้อผ่าน Shopee** (มี shopee_url) → **ลิงก์ตรงออกไป Shopee เหมือนเดิม** ไม่ต้องเข้าตะกร้า

---

## สิ่งที่ต้องทำ

### 1. `app.js` — เพิ่ม `type` ให้ cart item
- Cart item object เปลี่ยนจาก `{ product, quantity }` เป็น `{ product, quantity, type }` โดย `type` คือ `'booking'` หรือ `'order'`
- `addToCart(productId, type)` — รับ `type` เป็น parameter ที่สอง, ใช้ match item เดิมด้วย `productId + type` คู่กัน (สินค้าชิ้นเดียวกันอาจถูกเพิ่มเป็นทั้ง booking-line และ order-line แยกกันได้ ถ้ามีทั้งสองปุ่ม)
- ปุ่ม **"จองติดตั้ง"** → `addToCart(product.id, 'booking')` (เดิม `addToCart(product.id)` เฉยๆ)
- ปุ่ม **"สั่งผลิต"** (ไม่มี shopee_url) → เปลี่ยนจาก `<a href="CUSTOMER_ORDER_URL">` เป็น `<button>` ที่เรียก `addToCart(product.id, 'order')` (พฤติกรรมเหมือนปุ่มจองติดตั้ง — เพิ่มลงตะกร้า ไม่ navigate ทันที)
- ปุ่ม **"สั่งซื้อ Shopee"** (มี shopee_url) → **ไม่แตะ** ยังเป็น `<a>` ลิงก์ตรงเหมือนเดิมทุกอย่าง

### 2. `index.html` — โครง cart drawer แบ่ง 2 section
- แบ่ง `#cart-items-container` (หรือ section คลุมมัน) เป็น 2 ส่วนแยกกันในตะกร้าเดียว:
  - **"จองคิวติดตั้ง"** — item ที่ `type === 'booking'`, คงยอดรวม+มัดจำ 500+ยอดคงเหลือแบบเดิม (`cart-total-val` / `cart-deposit-val` / `cart-balance-val` logic เดิม ใช้กับกลุ่มนี้กลุ่มเดียว) + ปุ่มเช็คเอาต์เดิม → `https://kmorackbarcustom.github.io/booking.html`
  - **"สั่งซื้อกับทางร้าน"** — item ที่ `type === 'order'`, มียอดรวมของกลุ่มนี้เอง (ไม่มีมัดจำ 500 เพราะนั่นเป็นเงื่อนไขจองคิวติดตั้งอย่างเดียว) + ปุ่มเช็คเอาต์แยก → `https://kmorackbarcustom.github.io/CustomerOrder.html` (ใช้ const `CUSTOMER_ORDER_URL` ที่มีอยู่แล้วใน `app.js` บรรทัด 11)
- แต่ละ section ซ่อนไปเลยถ้าไม่มี item ในกลุ่มนั้น (ไม่ใช่โชว์ "0 รายการ" ค้างไว้)
- ถ้าทั้งสองกลุ่มว่าง → ใช้ `cart-empty-message` เดิมที่มีอยู่แล้ว (ครอบคลุมทั้งตะกร้า)

### 3. `app.js` — `updateCartUI()`
- แยกคำนวณ subtotal 2 ชุดจาก `cart.filter(item => item.type === 'booking')` และ `.filter(item => item.type === 'order')`
- badge count (`cart-badge-count`) ยังนับรวมทั้งสองกลุ่มเหมือนเดิม (ไม่ต้องแยก)
- `localStorage` ต้อง persist `type` ไปด้วย (แค่ save/load ทั้ง object ตามปกติ ไม่ต้องแก้ schema เพิ่ม)

### 4. `styles.css`
- Style ให้ 2 section แยกกันชัดเจน (หัวข้อ/เส้นคั่น) ธีมเดิม dark/gold ตามที่มีอยู่ ไม่ต้องคิดใหม่

---

## ทดสอบก่อนบอกว่าเสร็จ

- เพิ่มสินค้าที่มีทั้ง `allow_booking` และ `allow_order` (ไม่มี shopee_url) ลงตะกร้าทั้ง 2 ปุ่ม → ต้องเห็น 2 บรรทัดแยกกันคนละ section (ไม่ merge เป็นบรรทัดเดียว)
- กด "สั่งซื้อ Shopee" → เด้งไป Shopee ทันที ไม่เข้าตะกร้า (regression check — plan เดิมต้องไม่เปลี่ยนพฤติกรรมนี้)
- ตะกร้ามีแต่ booking items → section "สั่งซื้อกับทางร้าน" ต้องไม่โชว์เลย (ไม่ใช่โชว์ว่างเปล่า)
- ตะกร้ามีแต่ order items → section "จองคิวติดตั้ง" ไม่โชว์, ไม่มีเลขมัดจำ 500 ปนอยู่ในยอด order
- กดเช็คเอาต์ฝั่ง booking → ไป `booking.html`, กดเช็คเอาต์ฝั่ง order → ไป `CustomerOrder.html` — คนละปุ่ม คนละปลายทางจริง
- reload หน้า (localStorage persist) → ของในตะกร้ายังแยกกลุ่มถูกต้องเหมือนเดิม
- `node --check app.js` ผ่าน, ลองเปิดเว็บจริงเช็ค console ไม่มี error

---

## เสร็จแล้วให้ทำอะไรต่อ

- Commit ไว้ใน local ก่อน **อย่า push** จนกว่า CEO จะสั่ง (ตามรอบที่แล้ว)
- อัปเดต `PROJECT_CONTEXT.md` ตาราง "เสร็จแล้ว" ให้ตรงกับที่ทำจริง, เปลี่ยน "Next Session" เป็น Phase D1
- Phase D1 (ส่งราคาอ้างอิงไป production form ผ่าน URL param) รอบรีฟแยกทีหลัง — ต้องคุย scope เพิ่มเพราะแตะ repo production ด้วย
