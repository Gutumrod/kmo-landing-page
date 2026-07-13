# Codex Task Brief — ส่งข้อมูลตะกร้าไปพรีฟิลฟอร์มจองคิว (Phase D1)

อ่านเต็มก่อนเริ่ม: `PROJECT_CONTEXT.md`, `implementation_plan.md` (บรรทัด 71-72 พูดถึงงานนี้ไว้แล้ว)

## ปัญหา

ตอนนี้ปุ่ม "จองคิวติดตั้งหน้าร้าน" ในตะกร้า (`app.js` บรรทัด ~241-245) แค่
`window.location.href = BOOKING_URL` เฉยๆ — ลูกค้าเลือกสินค้าไว้ในตะกร้าแล้ว แต่พอกดจองคิว
ไปเจอฟอร์มเปล่าที่ `booking.html` ต้องพิมพ์รายการที่ต้องการทำเองใหม่หมด ข้อมูลตะกร้าหายหมด

งานนี้คือเชื่อมสองจุดนี้เข้าด้วยกัน โดยส่งชื่อสินค้า + ราคาอ้างอิง (ข้อความอย่างเดียว ไม่ผูกมัด)
ผ่าน URL query param ไปพรีฟิลช่อง "รายการที่ต้องการทำ" ใน `booking.html`

---

## ⚠️ Phase 0 — Gate บังคับ (สำคัญมาก อ่านก่อนแตะไฟล์)

งานนี้แตะ **2 repo คนละที่**:

1. `D:\AI-Workspace\projects\kmo-landing-page\` — remote ต้องเป็น `Gutumrod/kmo-landing-page`
2. `D:\AI-Workspace\projects\kmorackbarcustom.github.io\` — remote ต้องเป็น
   `kmorackbarcustom/kmorackbarcustom.github.io` **(นี่คือ production repo จริง มีลูกค้าใช้งานอยู่)**

ก่อนแก้ไฟล์ทั้งสอง repo:
1. `git remote -v` เช็คให้ตรงชื่อข้างบนเป๊ะ ผิดให้หยุดถามก่อน
2. `git status` ต้อง clean + `git pull` ก่อนแก้
3. **ห้ามแตะ** `D:\AI-Workspace\projects\landing page\KMO\` เด็ดขาด (clone เก่าตกรุ่น)

**สำคัญเรื่อง production repo:** วันนี้ (2026-07-13) เพิ่งแก้บั๊ก capacity model ของ `booking.html`
ไป 2 รอบ (commit `6f3a716` แล้ว `cab6d9e`) — **ห้ามแตะ/ห้ามแก้ฟังก์ชัน `buildPoolUsage`,
ตัวแปร `DAILY_CAP`/`MIN_BOOKING_DAYS`/`DENSE_THRESHOLD`, หรือ logic คำนวณคิวว่างใดๆ ทั้งสิ้น**
งานนี้แค่ "เพิ่ม" การอ่าน query param มาพรีฟิลช่องข้อความเฉยๆ ไม่เกี่ยวกับ capacity เลย
`git pull` ก่อนแก้เพื่อให้ชัวร์ว่าได้โค้ดล่าสุดที่มี fix วันนี้ครบ

---

## สิ่งที่ต้องทำ

### 1. `kmo-landing-page/app.js` — สร้าง query string จากตะกร้าตอนกดจองคิว

ในฟังก์ชัน handler ของ `checkoutBookingBtn` (บรรทัด ~241-245 ปัจจุบัน):

- ดึงเฉพาะ `bookingItems` (item ที่ `type === 'booking'`) จาก cart — **ไม่เอา order items**
- สร้างพารามิเตอร์ 2 ตัว แล้ว `encodeURIComponent` ก่อนต่อเข้า URL:
  - `services` = รายชื่อสินค้าคั่นด้วย comma เช่น `"แร็คท้าย Forza350 x1, แครชบาร์ ADV350 x2"`
    (รูปแบบ `${ชื่อสินค้า}${quantity > 1 ? ' x'+quantity : ''}`)
  - `note` = ข้อความราคาอ้างอิงรวม เช่น `"ราคาอ้างอิงจากเว็บ ~3,500 บาท (ไม่ผูกมัด ยืนยันราคาจริงหน้างาน)"`
    (คำนวณราคารวมจาก `bookingItems` เท่านั้น ปัดเป็นข้อความ ไม่ใช่ field ราคาแยก)
- ถ้าตะกร้า booking ว่าง (ไม่ควรเกิดเพราะปุ่มถูก disable แล้วตอนตะกร้าว่าง แต่กันไว้) ไม่ต้องใส่ query
  string เลย ใช้ `BOOKING_URL` เปล่าเหมือนเดิม
- ต่อ query string เข้ากับ `BOOKING_URL` แล้ว `window.location.href = ...`

**ห้ามเปลี่ยน** id/class ใดๆ ที่ระบุห้ามแตะใน `DESIGN_BRIEF.md` (`#btn-checkout-cart` ฯลฯ)

### 2. `kmorackbarcustom.github.io/booking.html` — อ่าน query param มาพรีฟิล

หาโค้ด `getDateFromQuery()` (ประมาณบรรทัด 1013) เป็นตัวอย่าง pattern การอ่าน query param ที่มีอยู่แล้ว
เพิ่ม logic ข้าง ๆ กัน (ไม่ต้องเปลี่ยนฟังก์ชันเดิม เพิ่มฟังก์ชันใหม่หรือ inline ใน
`DOMContentLoaded` handler เดิมได้):

- อ่าน `services` param → ถ้ามีค่า ให้ `decodeURIComponent` แล้วใส่ใน
  `document.getElementById('services').value` (ช่อง textarea "รายการที่ต้องการทำ")
- อ่าน `note` param → ถ้ามีค่า ให้แสดงเป็นข้อความเล็กๆ ใต้ช่อง services (เช่น `<small>` หรือ
  `<div class="form-hint">`) — **ไม่ใส่ในฟิลด์ราคา ไม่บันทึกลง DB เป็นตัวเลข ไม่ auto-fill มัดจำ**
  แค่ข้อความอ้างอิงให้ลูกค้า/แอดมินเห็นเฉยๆ
- ทั้งสอง param เป็น optional — ถ้าไม่มีใน URL (เช่น ลูกค้าเข้าตรงจาก `calendar.html` หรือ URL เปล่า)
  ฟอร์มต้องว่างเหมือนเดิมทุกอย่าง ไม่ error

---

## ทดสอบก่อนบอกว่าเสร็จ

1. เปิด `kmo-landing-page` จริง เพิ่มสินค้า 2 ชิ้นลงตะกร้าฝั่ง "จองคิวติดตั้ง" กดปุ่มจองคิว
2. เช็ค URL ที่ redirect ไปว่ามี `?services=...&note=...` เข้ารหัสถูกต้อง (เปิด URL ตรงๆ ต้องอ่านออก)
3. เปิด `booking.html` ด้วย URL นั้น เช็คว่าช่อง "รายการที่ต้องการทำ" มีข้อความสินค้าขึ้นมาให้แล้ว
   และมีข้อความราคาอ้างอิงโชว์อยู่ใกล้ๆ (ไม่ใช่ในฟิลด์ราคา)
4. เปิด `booking.html` เปล่าๆ ไม่มี query param เลย (พิมพ์ URL ตรงๆ) — ฟอร์มต้องว่างปกติเหมือนเดิม
5. เช็คว่าปฏิทิน/ปุ่มยืนยันจอง/checkQueueDensity ยังทำงานปกติ **ไม่มี regression** จากการแก้วันนี้
   (ลองจองจริง 1 รอบดูว่า insert เข้า Supabase สำเร็จ ไม่ error)
6. เช็คปุ่ม "สั่งซื้อกับทางร้าน" (`btn-checkout-order` → `CustomerOrder.html`) ว่ายังทำงานปกติ
   ไม่กระทบจากการแก้รอบนี้ (ไม่ใช่ scope งานนี้ ไม่ต้องแก้)
7. `git diff --check` ผ่านทั้งสอง repo

---

## เสร็จแล้วให้ทำอะไรต่อ

- Commit ไว้ local ก่อนใน**ทั้งสอง repo** — **ห้าม push** ทั้งคู่จนกว่า CEO จะสั่ง
  (โดยเฉพาะ `kmorackbarcustom.github.io` เป็น production ลูกค้าใช้งานจริง)
- อัปเดต `PROJECT_CONTEXT.md` ใน `kmo-landing-page`: mark Phase D1 ว่าเสร็จแล้ว (เดิมค้างมาตั้งแต่ 07-11)
- รายงานกลับว่า diff ทั้งสอง repo มีอะไรบ้าง ให้ CEO/Commander รีวิวก่อน push
