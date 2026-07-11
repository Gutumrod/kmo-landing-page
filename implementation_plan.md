# Implementation Plan — KMO Landing Page

**สร้างจาก:** Discovery Interview (5/5 หัวข้อ) เสร็จสมบูรณ์ 2026-07-11
**อ้างอิงพื้นฐาน:** `PROJECT_CONTEXT.md` (เป้าหมายโปรเจกต์ + ประวัติ phase 1-5)

---

## สรุปเป้าหมาย (ย้ำจาก PROJECT_CONTEXT.md)

kmo-landing-page คือหน้าร้านแคตตาล็อกขายตรง (ลดค่าคอม Shopee ~30%) **ไม่ใช่ตัวแทน production**
ดูแลแค่ `index.html + app.js + styles.css` (แคตตาล็อก/ตะกร้า/ค้นหา) — ธุรกรรมจริง (จอง/สั่งซื้อ)
ลิงก์ออกไป production (`kmorackbarcustom.github.io`) เสมอ ไม่ copy ไฟล์มาไว้เอง

---

## ประเภทสินค้า (ยืนยันแล้ว)

| ประเภท | รูป/ราคา | ต้องเอารถมาไหม | ปุ่ม | CSV row |
|---|---|---|---|---|
| 1. คัสตอมเต็มรูปแบบ | ❌ | ต้องคุยหน้างาน/แชท | ปรึกษาแอดมิน (LINE/FB) | ไม่ต้องมีแถวใน CSV |
| 2. มีแบบ+ราคาแล้ว ต้องขึ้นงานกับรถจริง | ✅ | ✅ | จองคิว → `booking.html` | `allow_booking=TRUE, allow_order=FALSE` |
| 3. มีแบบสำเร็จ ไม่ต้องใช้รถ | ✅ | ❌ | สั่งซื้อ → `CustomerOrder.html` | `allow_booking=FALSE, allow_order=TRUE` |

CSV จริงอยู่ที่ `assets/product_catalog_template.csv` คอลัมน์ตรงกับ `parseCSV()` ใน `app.js` แล้ว 100%:
`id,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`

---

## Phase 0 — Repo/File Gate (บังคับ ทำก่อนแตะไฟล์ทุกครั้ง)

เกิดปัญหาซ้ำมาแล้ว 2 รอบจากการแก้ผิด repo/ผิดไฟล์ (booking.html/calendar.html ตกรุ่นในโฟลเดอร์ clone เก่า)
ก่อนเริ่ม Phase ไหนก็ตามที่จะแก้ไฟล์ ต้องเช็คครบ 4 ข้อนี้ก่อนเสมอ ข้ามไม่ได้:

1. **เช็ค path** — งาน landing page ต้องอยู่ที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น
   ห้ามแตะ `D:\AI-Workspace\projects\landing page\KMO\` (clone เก่า ค้างอยู่)
2. **เช็ค remote** — `git remote -v` ต้องขึ้น repo ที่ตั้งใจแก้จริง:
   - แก้ landing page → `Gutumrod/kmo-landing-page`
   - แก้ production (booking.html, CustomerOrder.html, Supabase RPC) → `kmorackbarcustom/kmorackbarcustom.github.io`
   คนละ repo กันเด็ดขาด ห้ามสลับ
3. **เช็คว่า pull ล่าสุดแล้ว** — `git status` ต้อง clean และ `git pull` ก่อนแก้ทุกครั้ง กัน diff ทับของเก่า
4. **แก้ production เสร็จ → verify ก่อนบอกว่าเสร็จ** — curl หรือเปิดเว็บจริงเช็คพฤติกรรม ไม่ใช่แค่ push แล้วจบ (โดยเฉพาะ Phase D1 ที่แก้ทั้ง 2 repo)

ถ้าข้อไหนไม่ผ่าน (path ผิด/remote ผิด/pull ไม่ทัน) → หยุดทันที ห้ามแก้ไฟล์ต่อ

---

## Phase A — ต่อ CSV จริงเข้าแคตตาล็อก (High priority)

- แก้ `GOOGLE_SHEETS_CSV_URL` ใน `app.js` จาก placeholder เป็น published-CSV URL จริงของ Google Sheet
- คงพฤติกรรม fallback เดิม (7 สินค้า hardcode) ไว้ตอน fetch fail — แค่เปลี่ยน URL ต้นทาง
- ทดสอบ: ปิด wifi / URL ผิด → ต้องยัง fallback ได้เงียบๆ เหมือนเดิม

## Phase B — ช่องค้นหา + fallback "ปรึกษาแอดมิน" (สินค้าประเภท 1)

- เพิ่ม search input เหนือ grid สินค้า, filter แบบ client-side จับคู่ `name` / `description` / `category` (substring match, ไม่ต้อง index/backend แยก)
- พิมพ์แล้วไม่เจอ (0 results) → โชว์การ์ด "ไม่พบรุ่นนี้ในแคตตาล็อก ปรึกษาแอดมินได้เลย" พร้อม 2 ปุ่ม:
  - LINE OA: `https://lin.ee/qeCcYUC`
  - Facebook Inbox: `m.me/215552639006777`
- ไม่ต้องเพิ่มแถวอะไรใน CSV สำหรับสินค้าประเภท 1 — "หาไม่เจอ" คือ trigger เอง

## Phase C — ตะกร้าแบ่ง 2 กลุ่ม (ตกลงไว้ตั้งแต่ session ก่อน)

- แบ่งตะกร้าเป็น 2 ส่วนในหน้าเดียว: **สั่งซื้อ** (`allow_order` items) / **จองคิว** (`allow_booking` items)
- แต่ละส่วนมียอดรวม (`฿ subtotal`) + ปุ่มเช็คเอาต์แยกกัน ไปคนละ production URL

## Phase D — ส่งราคาอ้างอิงไปที่ production form (ทำ 1 → 2 ตามที่ตกลง)

### D1 (ทำก่อน — additive, ไม่กระทบของเดิม)
- ปุ่มเช็คเอาต์ยิง URL param ไปพร้อมลิงก์ เช่น:
  `CustomerOrder.html?items=แร็คท้าย+Forza+350+Custom&price=2900`
  `booking.html?items=...&price=...`
- แก้ **production** (`booking.html` / `CustomerOrder.html`) เพิ่ม logic อ่าน query string ตอนโหลดหน้า:
  - ถ้ามี param → ต่อท้ายข้อความเข้าไปใน `items` array ที่มีอยู่แล้ว เช่น
    `["แร็คท้าย", "อ้างอิงจากเว็บ: Forza 350 Custom ₿2,900"]`
  - ถ้าไม่มี param (ร้านแชร์ลิงก์ตรงให้ลูกค้าแบบเดิม) → ฟอร์มทำงานปกติเป๊ะเหมือนวันนี้ ไม่กระทบอะไร
  - ราคานี้เป็นแค่ note ให้คนอ่าน ไม่เข้าไปคำนวณ/บวกลบในระบบ
- **ขอบเขต:** ต้องแก้โค้ด production repo ด้วย ไม่ใช่แค่ landing page ฝ่ายเดียว — คุยกับ CEO ก่อน deploy จริงเพราะกระทบไฟล์ที่ร้านแชร์ตรงให้ลูกค้าอยู่

### D2 (ทำทีหลัง — ต้องแก้ schema)
- เพิ่มคอลัมน์ราคาใน Supabase table `orders`/`bookings` + แก้ RPC (`create_customer_order` และเทียบเคียงฝั่ง booking)
- อัปเดต staff dashboard ให้โชว์ราคาที่ลูกค้าคาดหวังจากเว็บ
- Scope ใหญ่กว่า D1 — วางแผนแยกรอบเมื่อ D1 เสร็จและใช้งานจริงแล้ว

## Phase E — ปิดช่องโหว่ค้าง (จากรีวิวความปลอดภัยรอบแรก)

- Validate ไฟล์อัปโหลด (สลิป) ฝั่ง server ไม่ใช่แค่ client JS
- แก้ `innerHTML` ที่ render ชื่อ/รายละเอียดสินค้าให้ escape ก่อนเสมอ (เสี่ยง stored-XSS ทันทีที่ CSV ต่อจริงแล้วมีคนแก้ sheet ใส่ script ได้ — Phase A ทำให้ความเสี่ยงนี้กลายเป็นจริง ต้องทำคู่กัน)

---

## ลำดับที่แนะนำ

0. **Phase 0 เช็คก่อนทุกครั้ง** ที่จะแก้ไฟล์ ไม่ใช่ทำครั้งเดียวจบ — โดยเฉพาะก่อน Phase D1 ที่ต้องสลับไปแก้ repo production ด้วย
1. **Phase A** (ต่อ CSV จริง) + **Phase E** (escape XSS) — ทำพร้อมกัน เพราะ A ทำให้ E กลายเป็นความเสี่ยงจริง
2. **Phase B** (ค้นหา + ปรึกษาแอดมิน)
3. **Phase C** (ตะกร้า 2 กลุ่ม)
4. **Phase D1** (URL param → note text)
5. **Phase D2** (ราคาจริงใน DB) — ทำเมื่อ D1 พิสูจน์ว่าเวิร์กแล้วเท่านั้น

---

## ค้างไว้ต่างหาก (ไม่ใช่ scope ของแผนนี้ แต่ต้องจำไว้)

- โฟลเดอร์ซ้ำ `D:\AI-Workspace\projects\landing page\KMO\` เป็น clone เก่าของ repo เดียวกัน (commit ค้างอยู่ก่อนลบ booking.html/calendar.html) — ห้ามแก้ไฟล์ในนั้นอีก จนกว่าจะตัดสินใจว่าจะลบหรือเก็บไว้เฉยๆ
