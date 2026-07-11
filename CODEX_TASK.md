# Codex Task Brief — KMO Landing Page (Phase B: ค้นหา + ปรึกษาแอดมิน)

อ่านเต็มก่อนเริ่ม: `implementation_plan.md` (แผนทั้งหมด, Phase B อยู่บรรทัด 53-59) + `PROJECT_CONTEXT.md`

Phase 0+A+E เสร็จแล้ว (verify ผ่านจริงแล้ว 2026-07-11 — CSV live fetch 7 สินค้า, ไม่มี `innerHTML` เหลือในไฟล์). commit `fc1e4b3` อยู่ใน local (ยังไม่ push).

---

## ⚠️ Phase 0 — Gate บังคับ (เช็คก่อนแก้ไฟล์แม้แต่บรรทัดเดียว)

1. ต้องทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น
   **ห้ามแตะ** `D:\AI-Workspace\projects\landing page\KMO\` — clone เก่าตกรุ่น
2. `git remote -v` ต้องขึ้น `Gutumrod/kmo-landing-page` เท่านั้น
3. `git status` ต้อง clean ก่อนเริ่ม (commit `fc1e4b3` ค้างไว้แบบ unpushed ถือว่า clean ปกติ ไม่ต้องแก้)
4. ถ้าเจอ path/remote ผิดเงื่อนไข → หยุดทันที ถามกลับก่อน

---

## Phase B — ช่องค้นหา + fallback "ปรึกษาแอดมิน"

**ไฟล์ที่แก้:** `index.html`, `app.js`, `styles.css`

### โครงสร้างปัจจุบันที่ต้องต่อยอด (อย่าสร้างใหม่ซ้ำ)
- Filter ปุ่มหมวดหมู่มีอยู่แล้วที่ `index.html` บรรทัด ~78-82 (`.catalog-filters` / `.filter-btn[data-category]`)
- `renderCatalog(category)` ใน `app.js` (บรรทัด ~369) filter จาก `PRODUCTS` array แล้ว render เข้า `#product-grid-container`
- Event listener ของปุ่ม filter อยู่ใน `initEventListeners()` บรรทัด ~207-214

### สิ่งที่ต้องเพิ่ม
1. **Search input** — เพิ่ม `<input>` เหนือ `.catalog-filters` ใน `index.html` (ธีม dark/gold ตาม `styles.css` เดิม, ใช้ font Sarabun/Kanit ตามที่มีอยู่)
2. **Filter logic** — client-side substring match (case-insensitive) บน `name` / `description` / `category` label ของแต่ละ product ใน `PRODUCTS`
   - ต้องทำงาน**ร่วมกับ** filter หมวดหมู่เดิม ไม่ใช่แทนที่ — เช่น เลือกหมวด "แร็คท้าย" แล้วพิมพ์ค้นหาต่อ ต้อง AND กัน (กรองทั้งสองเงื่อนไข)
   - แนะนำ: ทำ state ตัวแปรเก็บ search term ปัจจุบัน, แก้ `renderCatalog()` ให้รับ/ใช้ทั้ง category + search term แทนที่จะรับแค่ category
   - ใช้ `textContent`/`e()`-style escape ต่อจาก Phase E เดิม ห้ามกลับไปใช้ `innerHTML` ดิบ
3. **Empty state (0 results)** — ไม่พบสินค้าตรงคำค้น → แสดงการ์ดแทน grid ว่างเปล่า ข้อความ "ไม่พบรุ่นนี้ในแคตตาล็อก ปรึกษาแอดมินได้เลย" พร้อม 2 ปุ่มลิงก์:
   - LINE OA: `https://lin.ee/qeCcYUC`
   - Facebook Inbox: `https://m.me/215552639006777`
   - การ์ดนี้แทนที่เนื้อหา `#product-grid-container` ตอน 0 results เท่านั้น พอมีคำค้นที่เจอผลอีกครั้งให้กลับมา render สินค้าปกติ
4. **ไม่ต้องแก้ CSV/parser** — สินค้าประเภท 1 (คัสตอมเต็มรูปแบบ) ไม่มีแถวใน CSV อยู่แล้ว "หาไม่เจอ" คือ trigger ของมันเอง ไม่ต้องทำอะไรเพิ่มฝั่งข้อมูล

### ทดสอบก่อนบอกว่าเสร็จ
- พิมพ์คำที่มีสินค้าจริง (เช่น "Forza") → grid กรองเหลือแค่ที่ตรง, ปุ่มหมวดยังกดสลับได้ปกติ
- พิมพ์คำที่ไม่มีสินค้า (เช่น "จรวด") → ขึ้นการ์ดปรึกษาแอดมินแทน grid, ปุ่ม LINE/FB คลิกได้จริง
- ลบคำค้นออก → กลับมาเห็นสินค้าครบตามหมวดที่เลือกไว้
- เลือกหมวด + พิมพ์คำค้นพร้อมกัน → filter ต้อง AND กันถูกต้อง

---

## เสร็จแล้วให้ทำอะไรต่อ

- **อย่า push** — CEO บอกไว้ว่าจะรวม commit+push ทีเดียวหลัง Phase B เสร็จ ให้ commit ไว้ใน local พอ (ต่อจาก `fc1e4b3` ที่ค้างอยู่ก็ได้ หรือแยก commit ใหม่ก็ได้)
- อัปเดต `PROJECT_CONTEXT.md` ตาราง "เสร็จแล้ว" ให้ตรงกับที่ทำจริง
- Phase ถัดไป (C: ตะกร้า 2 กลุ่ม, D1/D2: ส่งราคาไป production) อยู่ใน `implementation_plan.md` แล้ว — รอบรีฟแยกทีหลัง
