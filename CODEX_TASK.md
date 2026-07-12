# Codex Task Brief — เปลี่ยนธีมทั้งหน้าตาม Stitch mockup "Industrial Kinetic" (v2)

อ่านเต็มก่อนเริ่ม: `PROJECT_CONTEXT.md`, `design-ref/stitch-industrial-v2/DESIGN.md`, ดูภาพ `design-ref/stitch-industrial-v2/screen.png`

CEO ดู mockup ใหม่จาก Google Stitch แล้วชอบ สั่งให้ใช้แทนธีมดำ/เหลืองที่ทำไปแล้วรอบก่อน (`bb38b14`)
ธีมเดิมมีปัญหาที่ยังไม่ได้แก้อยู่ด้วย (ดูหัวข้อ "บั๊กเดิมที่ต้องแก้พร้อมกัน" ด้านล่าง) — รอบนี้คือ rebuild ธีมใหม่ทั้งยวง ไม่ใช่แค่ patch

---

## ⚠️ Phase 0 — Gate บังคับ

1. ทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น ห้ามแตะ `D:\AI-Workspace\projects\landing page\KMO\`
2. `git remote -v` ต้องขึ้น `Gutumrod/kmo-landing-page` เท่านั้น
3. `git status` ต้อง clean + `git pull` ก่อนแก้ไฟล์
4. ถ้าเจอ path/remote ผิด → หยุดทันที ถามกลับก่อน

---

## ดีไซน์อ้างอิง — `design-ref/stitch-industrial-v2/`

- `DESIGN.md` — design tokens เต็ม (สี/ฟอนต์/spacing/shape) ใช้เป็น source of truth แทน `DESIGN_BRIEF.md` เดิม
- `screen.png` — mockup หน้าเต็ม (hero → catalog → booking → footer)
- `code.html` — static mockup จาก Stitch **ห้าม copy วางทับตรงๆ** เพราะไม่มี cart logic/JS ผูกจริง ใช้ดูโครงสร้าง/class name เป็นไอเดียเท่านั้น

### สรุป design tokens หลัก (ดูละเอียดใน DESIGN.md)
- พื้นหลัง `#121414`/`#0c0f0f`, การ์ด/container ไล่โทน `#1a1c1c` → `#282a2b` → `#333535`
- Primary yellow `#ffcf07`, ปุ่มหลักพื้นเหลือง ตัวหนังสือดำ
- ตัวหนังสือ: หัวข้อใหญ่ฟอนต์ **Anton** (ตัวหนา ตั้งตรง ไม่ italic ในเวอร์ชันนี้ — ต่างจาก brief เดิมที่มี `font-style: italic`) ตัวพิมพ์ใหญ่ทั้งหมด, เนื้อหาใช้ **Archivo Narrow**, label/status ใช้ **JetBrains Mono**
- มุมเหลี่ยม 90 องศาทั้งหมด ไม่มี border-radius, ไม่มี box-shadow แบบลอย ใช้ 1-2px border แทน
- ปุ่ม secondary = border เหลือง 2px ไม่มีพื้น hover ถึงเปลี่ยนเป็นพื้นเหลือง

โหลดฟอนต์ Anton / Archivo Narrow / JetBrains Mono จาก Google Fonts ใน `index.html` (`<link>` เดิมที่มีอยู่ให้เช็คว่าใช้ฟอนต์ไหน แก้ให้ตรง 3 ตัวนี้)

---

## Element ที่ห้ามเปลี่ยนชื่อ/ลบ (JS ผูกอยู่ ถ้าเปลี่ยนฟีเจอร์จะพัง) — เหมือนเดิมทุกจุด

- `#product-grid-container`
- `#catalog-search-input`
- `.filter-btn` + attribute `data-category` (ต้องมีครบ 7 ปุ่ม: all/rear/side/crashbar/accessory/gear/service)
- `#cart-toggle`, `#cart-drawer`, `#cart-drawer-backdrop`, `#cart-close`
- `#cart-items-container`
- `#cart-total-val`, `#cart-deposit-val`, `#cart-balance-val`
- `#btn-checkout-cart`
- `#btn-checkout-order`
- `#cart-badge-count`

ปรับได้แค่หน้าตา/สี/ฟอนต์/เลย์เอาต์รอบนอกของ element พวกนี้ ห้ามเปลี่ยนชื่อ id/class/โครงสร้าง DOM ที่ JS query อยู่

---

## บั๊กเดิมที่ต้องแก้พร้อมกัน (ค้างจากรอบก่อน อย่าลืม)

1. **Heading style ต้องไม่หลุดไปโดน element ที่ไม่ใช่หัวข้อการตลาด** — รอบก่อนมี global rule
   `h1,h2,h3,h4,h5,h6 { text-transform: uppercase; ... }` ทำให้ `.product-title` (เป็น `<h3>`), cart section
   title, footer heading โดน uppercase ไปด้วยทั้งที่ไม่ควร ตอน implement ธีมใหม่นี้ **อย่าตั้ง rule กว้างแบบนั้นอีก**
   ให้ apply เฉพาะ selector ที่ตั้งใจ (เช่น `.hero-title`, `.section-title`) เท่านั้น แล้วเช็ค `getComputedStyle()`
   ของ `.product-title`, cart footer title, footer `h3` ว่าไม่โดนไปด้วยโดยไม่ตั้งใจ
2. **`.hazard-separator`** (ถ้ายังใช้ลายทางเฉียงคั่น section ต่อในธีมนี้) ต้องมี `aria-hidden="true"` ทุกจุด (3 จุดใน `index.html`)
3. **ปุ่มเช็คเอาต์ (`#btn-checkout-cart`, `#btn-checkout-order`) และ cart badge (`#cart-badge-count`)**
   ต้องโดน theme ใหม่ด้วย ไม่ใช่เหลือสีเดิม (เช็คให้ชัดเจน อย่าปล่อยผ่าน)
4. **คำโปรย hero** — CEO ยังไม่ตัดสินใจว่าจะใช้คำไหน คงข้อความปัจจุบันไว้ก่อน (ห้ามเปลี่ยนคำเองอีก) รอ CEO สั่งแยก

---

## สิ่งที่ต้องทำ

1. อัปเดต `styles.css` ทั้งไฟล์ตาม design tokens ใน `DESIGN.md` (สี/ฟอนต์/spacing/shape/border/hover behavior)
2. เช็ค `index.html` ว่า class/id เดิมยังอยู่ครบ ปรับแค่ markup รอบนอก (เช่น เพิ่ม wrapper div สำหรับ layout ใหม่ได้ แต่ element ที่ระบุห้ามแตะข้างบนต้องอยู่ครบ)
3. โหลดฟอนต์ Anton, Archivo Narrow, JetBrains Mono ผ่าน Google Fonts
4. แก้ 3 บั๊กเดิมในหัวข้อ "บั๊กเดิมที่ต้องแก้พร้อมกัน" ไปพร้อมกันในรอบนี้
5. เช็ค mobile responsive (375px, 320px) ตาม pattern เดิมที่เคยแก้ไว้ (`.hero-title`, `.product-grid` บังคับ 2 คอลัมน์) — **อย่าทำ regression ของ mobile fix รอบก่อน**

---

## ทดสอบก่อนบอกว่าเสร็จ

- เปิดเว็บจริง desktop (1280px) เทียบกับ `screen.png` — โทนสี/ฟอนต์/เลย์เอาต์ต้องใกล้เคียง
- เปิดที่ 375px และ 320px — hero title ไม่ตัดคำแปลก, product grid ยังเป็น 2 คอลัมน์, การ์ดอ่านง่าย
- `getComputedStyle()` เช็ค `.product-title`, cart section title, footer `h3` ว่า**ไม่**โดน uppercase/italic จาก global heading rule
- เช็ค `#btn-checkout-cart`, `#btn-checkout-order`, `#cart-badge-count` ว่าใช้สี/ฟอนต์ธีมใหม่แล้ว
- เช็ค `.hazard-separator` ทุกจุด (ถ้ามี) มี `aria-hidden="true"`
- Filter ปุ่มหมวดหมู่ยังทำงานถูก (data-category ครบ 7), ค้นหายังทำงาน, ตะกร้ายัง add/remove/checkout ได้ปกติ
- `git diff --check` ผ่าน

---

## เสร็จแล้วให้ทำอะไรต่อ

- Commit ไว้ local ก่อน **อย่า push** จนกว่า CEO จะสั่ง
- อัปเดต `PROJECT_CONTEXT.md`: เพิ่มบรรทัด "rebuild ธีมตาม Stitch mockup v2 (Industrial Kinetic)" ในตาราง completed พร้อมระบุว่าบั๊กเดิม 3 ข้อแก้ไปด้วยหรือยัง
