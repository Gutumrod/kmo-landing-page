# Codex Task Brief — KMO Landing Page (แก้ Mobile Layout: hero text + product grid)

อ่านเต็มก่อนเริ่ม: `PROJECT_CONTEXT.md`

Category taxonomy เสร็จและ push แล้ว (`73dfb4c`, `ebb2caf` สำหรับ design brief docs). ตอนนี้ site live จริงที่
`https://gutumrod.github.io/kmo-landing-page/` (เพิ่งเปิด GitHub Pages) — CEO เปิดจากมือถือแล้วเจอ 2 ปัญหา

---

## ⚠️ Phase 0 — Gate บังคับ

1. ทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น ห้ามแตะ `D:\AI-Workspace\projects\landing page\KMO\`
2. `git remote -v` ต้องขึ้น `Gutumrod/kmo-landing-page` เท่านั้น
3. `git status` ต้อง clean + `git pull` ก่อนแก้ไฟล์
4. ถ้าเจอ path/remote ผิด → หยุดทันที ถามกลับก่อน

---

## บริบท — ยืนยันสาเหตุแล้วจาก computed style บนเว็บจริง (viewport 375px)

### ปัญหา 1: "ตัวหนังสือแปลก" บนมือถือ
`.hero-title` (`styles.css` บรรทัด 237-243) ตอนนี้:
```css
.hero-title {
  font-size: 54px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
```
**ไม่มี media query ลดขนาดบนจอแคบเลย** — 54px บนจอ 375px ทำให้ตัดคำแปลก + `line-height: 1.2` แน่นเกินไป (โปรเจกต์นี้มีกฎเรื่องวรรณยุกต์จมอยู่แล้วใน `CLAUDE.md`: ต้องใช้ line-height สูงกว่านี้กับ text ใหญ่) ทำให้วรรณยุกต์มีโอกาสซ้อนทับกัน

### ปัญหา 2: คอลัมน์สินค้าเป็น 1 แถวยาว ไม่ใช่กริดแบบ Shopee
`.product-grid` (`styles.css` บรรทัด 393-397) ตอนนี้:
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}
```
บนจอ 375px พื้นที่จริงในตะกร้า (หลังหัก `.container` padding 24px x2) เหลือ ~327px — `minmax(280px, ...)` เลยพอดี 1 คอลัมน์เท่านั้น ยืนยันแล้วจาก `getComputedStyle` บนเว็บจริง (`gridTemplateColumns: "327px"`)

---

## สิ่งที่ต้องทำ

### 1. `styles.css` — `.hero-title` responsive
เพิ่ม media query ลดขนาดลงบนจอแคบ (ใช้ pattern เดียวกับที่ไฟล์นี้มีอยู่แล้ว คือ `@media (min-width: ...)` ครอบ desktop-up แทน — เพราะ base rule ปัจจุบันไม่ใช่ mobile-first) วิธีที่ตรงกับ pattern เดิมของไฟล์นี้:
```css
.hero-title {
  font-size: 32px;   /* ค่า default = มือถือ (เดิมคือ 54px ยกไปไว้ desktop) */
  line-height: 1.5;  /* กันวรรณยุกต์จม แทน 1.2 เดิม */
}

@media (min-width: 576px) {
  .hero-title {
    font-size: 42px;
    line-height: 1.3;
  }
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 54px;
    line-height: 1.2;
  }
}
```
(ปรับตัวเลขได้ตามความเหมาะสม แต่ต้องคุมหลักการ: มือถือเล็กสุด, desktop ค่อยขยับกลับไป 54px เดิม, line-height มือถือต้องหลวมกว่า desktop)

### 2. `styles.css` — `.product-grid` บังคับ 2 คอลัมน์ขั้นต่ำบนมือถือ
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 576px) {
  .product-grid {
    gap: 20px;
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
}
```
มือถือ = บังคับ 2 คอลัมน์เสมอ (แบบ Shopee), tablet ขึ้นไปค่อยกลับไปใช้ auto-fill เดิม

### 3. `styles.css` — ปรับ card ให้พอดีกับคอลัมน์แคบบนมือถือ
เช็คว่า `.product-info` (padding 20px เดิม), `.product-title` (font-size 18px เดิม), ปุ่ม `.product-actions .btn-add-cart`/`.btn-order` (font-size 13px เดิม) ยังพอดีไหมตอนการ์ดเหลือ ~155px กว้าง (2 คอลัมน์ - gap) ถ้าข้อความปุ่ม/ชื่อสินค้าล้น/ตัดคำแปลกๆ ให้เพิ่ม media query ลดขนาดเฉพาะช่วงมือถือ เช่น:
```css
@media (max-width: 575px) {
  .product-info { padding: 12px; }
  .product-title { font-size: 14px; }
  .product-actions .btn-add-cart,
  .product-actions .btn-order { font-size: 11px; padding: 8px 4px; }
}
```
(ปรับตัวเลขจริงตามที่เทสแล้วดูดี ไม่ต้องตรงเป๊ะตามนี้)

---

## ทดสอบก่อนบอกว่าเสร็จ

- เปิดที่ viewport 375px (iPhone SE/มาตรฐาน): hero title ต้องไม่ตัดคำแปลก, วรรณยุกต์ไม่ซ้อน, อ่านง่าย
- Product grid ที่ 375px ต้องเห็น **2 คอลัมน์** ไม่ใช่ 1 แถวยาว
- การ์ดสินค้าในคอลัมน์แคบ: ชื่อสินค้า/ราคา/ปุ่มยังอ่านออก ไม่ล้นกรอบ ไม่ตัดคำประหลาด
- เช็คที่ 320px (จอเล็กสุดที่พบได้) ด้วยว่าไม่พัง
- เช็คที่ desktop (1280px) ว่า hero-title/grid กลับไปเหมือนเดิมทุกอย่าง (ไม่มี regression)
- `git diff --check` ผ่าน

---

## เสร็จแล้วให้ทำอะไรต่อ

- Commit ไว้ local ก่อน **อย่า push** จนกว่า CEO จะสั่ง
- อัปเดต `PROJECT_CONTEXT.md` เพิ่มบรรทัด "แก้ mobile layout (hero + grid)" ในตาราง completed
