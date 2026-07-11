# Codex Task Brief — KMO Landing Page (Category Taxonomy ขยาย: เพิ่ม 3 หมวดใหม่)

อ่านเต็มก่อนเริ่ม: `PROJECT_CONTEXT.md`

Phase 0+A+B+C+E เสร็จและ push แล้ว (`50fd0d2`, `origin/main` up to date ณ 2026-07-11).
งานนี้ไม่ใช่ Phase D — เป็นงานคั่นกลางที่ CEO ขอเพิ่ม เพราะกำลังจะเพิ่มสินค้าจริงเข้าชีตเยอะ (บาร์เสริม/พักเท้า/ไฟ/กล่อง/กระเป๋า/น้ำมันเครื่อง/ผ้าเบรก) แล้วพบว่าปุ่มหมวดเดิมไม่พอ

---

## ⚠️ Phase 0 — Gate บังคับ

1. ทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\` เท่านั้น ห้ามแตะ `D:\AI-Workspace\projects\landing page\KMO\`
2. `git remote -v` ต้องขึ้น `Gutumrod/kmo-landing-page` เท่านั้น
3. `git status` ต้อง clean + `git pull` ก่อนแก้ไฟล์
4. ถ้าเจอ path/remote ผิด → หยุดทันที ถามกลับก่อน

---

## บริบท — Taxonomy ใหม่ที่ CEO confirm แล้ว (2026-07-11)

เดิมมี 4 หมวด: `rear` / `side` / `crashbar` / `other` (ปุ่ม "อุปกรณ์เสริม & บริการ")
ตอนนี้ต้องขยายเป็น 6 หมวด — **ยกเลิก `other` ไปเลย แยกเป็น 3 หมวดใหม่แทน:**

| Slug | ปุ่มภาษาไทย | ตัวอย่างสินค้า |
|---|---|---|
| `rear` | แร็คท้าย | เหมือนเดิม ไม่แตะ |
| `side` | แร็คข้าง | เหมือนเดิม ไม่แตะ |
| `crashbar` | แครชบาร์ | เหมือนเดิม ไม่แตะ |
| `accessory` | อุปกรณ์แต่งรถ | บาร์เสริม/ค้ำท้าย, พักเท้า |
| `gear` | ไฟ/จอ/กล่อง/กระเป๋า | ไฟสปอร์ตไลท์, ที่ชาร์จ, กล่องหลัง/ข้าง, กระเป๋า |
| `service` | บริการ | บริการติดตั้ง, น้ำมันเครื่อง, ผ้าเบรก |

---

## สิ่งที่ต้องทำ

### 1. `index.html` — ปุ่ม filter
- ลบปุ่ม `<button class="filter-btn" data-category="other">อุปกรณ์เสริม & บริการ</button>` ทิ้ง
- เพิ่ม 3 ปุ่มใหม่ต่อจาก `crashbar` (เรียงตามตารางด้านบน):
  ```html
  <button class="filter-btn" data-category="accessory">อุปกรณ์แต่งรถ</button>
  <button class="filter-btn" data-category="gear">ไฟ/จอ/กล่อง/กระเป๋า</button>
  <button class="filter-btn" data-category="service">บริการ</button>
  ```
- ไม่ต้องแก้ JS ส่วน event listener — `initEventListeners()` ใช้ `querySelectorAll('.filter-btn')` แบบ generic อยู่แล้ว ปุ่มใหม่ทำงานอัตโนมัติ

### 2. `app.js` — `getCategoryLabel()` (บรรทัด ~667-674)
ตอนนี้ default ทุกอย่างที่ไม่ใช่ rear/side/crashbar ไปเป็น "อุปกรณ์เสริม" หมดเลย ต้องแก้ให้ตรงหมวดจริง:
```js
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
```

### 3. `app.js` — `FALLBACK_PRODUCTS` (ต้น ๆ ไฟล์ บรรทัด ~15-95) — ย้ายหมวดของเดิม 2 ชิ้น
สินค้าที่เคยเป็น `category: 'other'` ต้องย้ายตาม taxonomy ใหม่:
- `spotlight-60w-3200` (ไฟสปอร์ตไลท์คู่ Motovision) → `category: 'gear'`
- `service-installation-500` (บริการติดตั้งด่วน & เซ็ตระบบไฟ) → `category: 'service'`
(สินค้าอื่นในนี้ไม่ต้องแตะ)

### 4. `styles.css`
- ปุ่ม filter ใหม่ 3 ปุ่มใช้ class `.filter-btn` เดิม สไตล์อัตโนมัติตรงกันอยู่แล้ว ไม่ต้องเพิ่ม CSS ใหม่ ตรวจแค่ไม่ล้นแถวตอนมี 7 ปุ่ม (ทั้งหมด+6 หมวด) บนจอมือถือ — ถ้าล้น ให้ปรับ `.catalog-filters` เป็น wrap/scroll แนวนอนตามที่มีอยู่แล้วในไฟล์ (เช็คว่ามี `flex-wrap` หรือ `overflow-x` อยู่แล้วหรือยัง)

---

## ทดสอบก่อนบอกว่าเสร็จ

- กดปุ่มใหม่ทั้ง 3 (accessory/gear/service) → filter ทำงานถูกต้อง (ทดสอบด้วยการแก้ category สินค้าทดสอบชั่วคราวใน `FALLBACK_PRODUCTS` แล้วเช็ค แล้ว revert ก่อน commit)
- `spotlight-60w-3200` ต้องขึ้นตอนกดปุ่ม "ไฟ/จอ/กล่อง/กระเป๋า" ไม่ใช่ปุ่มอื่น
- `service-installation-500` ต้องขึ้นตอนกดปุ่ม "บริการ"
- ปุ่ม "ทั้งหมด" ยังโชว์ครบทุกชิ้นเหมือนเดิม
- 7 ปุ่มไม่ล้น/ตัดขาดบนจอมือถือ (ลอง resize แคบดู)
- `node --check app.js` ผ่าน

---

## เสร็จแล้วให้ทำอะไรต่อ

- Commit ไว้ local ก่อน **อย่า push** จนกว่า CEO จะสั่ง
- อัปเดต `PROJECT_CONTEXT.md` ให้ตรงกับ taxonomy ใหม่นี้
- **แจ้ง CEO แยกต่างหาก:** ข้อมูลสินค้าจริงในชีตต้องแก้ category ตามตารางนี้ (CEO เป็นคนแก้ชีตเอง ไม่ใช่งาน Codex):
  - `แครชบาร์` (9 แถว) → `crashbar`
  - `แร็คท้าย` (4 แถว) → `rear`
  - `แร็คข้าง` (1 แถว) → `side`
  - `บาร์เสริม/ค้ำท้าย` (6 แถว) + `พักเท้า` (3 แถว) → `accessory`
  - สินค้ากลุ่ม ไฟ/จอ/ที่ชาร์จ/กล่องหลัง/กล่องข้าง/กระเป๋า ที่จะเพิ่มใหม่ → `gear`
  - สินค้ากลุ่ม น้ำมันเครื่อง/ผ้าเบรก ที่จะเพิ่มใหม่ → `service`
- Phase D1 (ส่งราคาไป production form) ยังรอคิวเหมือนเดิม
