# Codex Task Brief — KMO Landing Page (Phase 0 + A + E)

อ่านเต็มก่อนเริ่ม: `implementation_plan.md` (แผนทั้งหมด) + `PROJECT_CONTEXT.md` (ประวัติ/เป้าหมายโปรเจกต์)

---

## ⚠️ Phase 0 — Gate บังคับ (เช็คก่อนแก้ไฟล์แม้แต่บรรทัดเดียว)

1. ต้องทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น
   **ห้ามแตะ** `D:\AI-Workspace\projects\landing page\KMO\` — เป็น git clone เก่าตกรุ่น (ยังมี booking.html/calendar.html ที่ถูกลบไปแล้วในของจริง)
2. เช็ค `git remote -v` ต้องขึ้น `Gutumrod/kmo-landing-page` เท่านั้นสำหรับงานชุดนี้ (ไม่ต้องแตะ repo production `kmorackbarcustom.github.io` ในรอบนี้)
3. `git status` ต้อง clean ก่อนเริ่ม + `git pull` ให้ล่าสุดก่อนแก้อะไรทั้งสิ้น
4. ถ้าเจอ path/remote ผิดเงื่อนไข → หยุดทันที ห้ามแก้ไฟล์ต่อ ถามกลับก่อน

---

## Phase A — ต่อ CSV จริงเข้าแคตตาล็อก

**ไฟล์:** `app.js`

- แทนที่ `GOOGLE_SHEETS_CSV_URL` (บรรทัด 12, ปัจจุบันเป็น placeholder) ด้วย:
  `https://docs.google.com/spreadsheets/d/11vOmugedMi3GoMN-a1NriI-hIvGVOSxg07fNI6DyRLM/export?format=csv`
  (ทดสอบแล้วด้วย curl 2026-07-11 — ได้ CSV จริง HTTP 200, sharing เป็น anyone-with-link พอ ไม่ต้อง publish-to-web เพิ่ม)
- คอลัมน์ CSV ต้องตรงกับที่ `parseCSV()` รองรับอยู่แล้ว (ไม่ต้องแก้ parser):
  `id,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`
  (อ้างอิงตัวอย่างจริงที่ `assets/product_catalog_template.csv`)
- คงพฤติกรรม fallback เดิมไว้ (ถ้า fetch fail → ใช้ `FALLBACK_PRODUCTS` 7 ชิ้น hardcode เหมือนเดิม เงียบๆ ไม่ error ให้ user เห็น)
- **ทดสอบ:** ลอง URL ผิด/ตัดเน็ต → ต้องยัง fallback แสดงสินค้าได้ปกติ, ลอง URL จริง → สินค้าจาก sheet ต้องขึ้นถูกต้องครบ

## Phase E — ปิดช่องโหว่ XSS (ทำคู่กับ Phase A เพราะ A ทำให้ช่องโหว่นี้กลายเป็นจริง)

**ไฟล์:** `app.js` (จุดที่ใช้ `innerHTML` render ชื่อ/รายละเอียดสินค้า — ค้นหา `innerHTML` ในไฟล์)

- Escape ค่าที่มาจาก CSV ก่อน insert เข้า `innerHTML` เสมอ (โดยเฉพาะ `name`, `description` — เป็น field ที่คนแก้ Google Sheet พิมพ์เองได้ ถ้าไม่ escape ใส่ `<script>` ได้ตรงๆ)
- ใช้วิธี escape มาตรฐาน (เช่น `textContent` แทน `innerHTML` สำหรับ field พวกนี้ หรือฟังก์ชัน escape ง่ายๆ แบบที่ `CustomerOrder.html` มีอยู่แล้วเป็นตัวอย่าง — ดูฟังก์ชัน `e()` บรรทัด 81 ของไฟล์นั้น)
- **ทดสอบ:** ลองใส่ชื่อสินค้าเป็น `<img src=x onerror=alert(1)>` ใน CSV ทดสอบ → ต้อง render เป็นข้อความเฉยๆ ไม่รัน script

---

## เสร็จแล้วให้ทำอะไรต่อ

- Commit แยกเป็น 2 commit (A กับ E คนละ commit ชัดเจน) หรือรวมก็ได้ถ้า diff เล็ก — อย่า push โดยไม่บอก CEO ก่อน
- อัปเดต `PROJECT_CONTEXT.md` ตาราง "เสร็จแล้ว" ให้ตรงกับที่ทำจริง
- Phase ถัดไป (B: ช่องค้นหา, C: ตะกร้า 2 กลุ่ม, D1/D2: ส่งราคาไป production) อยู่ใน `implementation_plan.md` แล้ว — รอบรีฟแยกทีหลัง
