# Task: เพิ่ม section "สินค้าขายดี" (Featured Products)

> เขียน 2026-07-15 โดย Claude (Commander) — สั่งงานให้ Codex ทำ แล้ว Claude ตรวจ diff เองก่อน push
> อ้างอิงจาก `PROJECT_CONTEXT.md` ตาราง "Pending / Next Work" แถวที่ 2 (priority High)
> ห้ามใช้บรีฟเก่าไฟล์อื่นซ้ำ — ไฟล์นี้คุมเฉพาะงาน featured products เท่านั้น

---

## Goal

เพิ่ม section สินค้าขายดีที่โดดเด่นกว่าการ์ดสินค้าทั่วไป อยู่ต้น catalog (ตามที่ระบุใน
PROJECT_CONTEXT.md) เพื่อดันสินค้าที่ CEO อยากโปรโมทให้ลูกค้าเห็นก่อน แทนที่จะให้ลูกค้าไล่หาเองใน
195 รายการ

**⚠️ อัปเดต 2026-07-15 — CEO ระบุรุ่นรถขายดีมาแล้ว ให้ mark ตามนี้เท่านั้น (ห้าม Codex เพิ่ม/เดาเอง):**

CEO สั่งตรงๆ ว่าเจาะที่รุ่นรถ 6 รุ่นนี้ก่อน: **Versys650, Forza350, ADV350, Giorno, Burgman400, Crf300r**
("ถ้ารุ่นไหนไม่มี ข้ามไป")

Claude ไล่ grep CSV จริงมาแล้ว แมตช์เป็นรายการ `id` ที่แน่นอนด้านล่าง (ไม่ใช้ fuzzy matching เพราะข้อมูล
`model` ในคอลัมน์สกปรกมาก — ตัวพิมพ์เล็กใหญ่ปนกัน, มีช่องว่าง, มีปี, มีคำต่อท้ายที่เป็นคนละรุ่นจริงๆ
เช่น `Crf300l` vs `CRF300RALLY` vs `CRF 300R` คือคนละรุ่นกันแม้ชื่อคล้ายกัน) — **ให้ Codex mark
featured=TRUE เฉพาะ id ที่ระบุไว้ด้านล่างเป๊ะๆ ห้ามใช้ text match เองเพิ่มเติม เผื่อจับรุ่นผิดตัว**

| รุ่นที่ CEO สั่ง | จำนวนที่เจอ | id ที่ต้อง mark `featured=TRUE` |
|---|---|---|
| Versys650 | 3 | `kmo-110`, `kmo-111`, `kmo-114` |
| Forza350 | 3 | `kmo-052` (Forza 300/350 รวม), `kmo-055`, `kmo-056` |
| ADV350 | 11 | `kmo-027`, `kmo-028`, `kmo-029`, `kmo-other-001`, `kmo-other-002`, `kmo-other-003`, `kmo-other-004`, `kmo-other-005`, `kmo-other-006`, `kmo-other-007`, `kmo-other-015` |
| Giorno | 7 | `kmo-061`, `kmo-062`, `kmo-063`, `kmo-064`, `kmo-065`, `kmo-066`, `kmo-067` (รวม "Giorno+") |
| Burgman400 | 5 | `kmo-120`, `kmo-121`, `kmo-122`, `kmo-123`, `kmo-135` |
| Crf300r | 3 | `kmo-other-008` ("CRF 300R"), `kmo-other-010` ("CRF300RALLY"), `kmo-other-011` ("Crf300rally") |

**⚠️ แก้ไข 2026-07-15 (2) — CEO ยืนยันแล้วว่า CRF300R กับ CRF300 Rally คือรุ่นเดียวกัน**
เดิม Claude แยก Rally ออกเพราะไม่มั่นใจ ตอนนี้รวมเข้าไปในกลุ่ม Crf300r แล้ว (รวมเป็น 3 rows จากเดิม 1)

**รวม 32 rows ที่เข้าเกณฑ์ featured**

**CEO แจ้งว่าจะเข้าไปแก้ค่า `TRUE`/`FALSE` ใน CSV เองโดยตรง** — Codex ไม่ต้อง mark ตาม id list นี้เอง
แค่สร้างคอลัมน์ `featured` เพิ่มเข้าไปพร้อม default `FALSE` ทุกแถว (ตาราง id ด้านบนไว้เป็น reference ให้ CEO
ใช้เทียบตอนแก้เอง) — ดู Step 1 ที่ปรับใหม่ด้านล่าง

**จุดที่ Claude ตัดสินใจแทนไม่ได้ ต้องถาม CEO ก่อน (ยังไม่ mark, ปล่อย FALSE ไว้):**
- `kmo-048`, `kmo-other-009` — model เขียนแค่ `CRF300` เฉยๆ ไม่รู้ว่าหมายถึง R หรือ L
- `kmo-other-010`, `kmo-other-011` — model คือ `CRF300RALLY`/`Crf300rally` เป็นรุ่น Rally แยกจาก R
  เฉยๆ ที่ CEO พูดถึง ไม่แน่ใจว่านับรวมด้วยไหม
- `kmo-049` — `Crf300l` เป็นรุ่น L ชัดเจน ไม่ใช่ R ตัดออกแน่นอน ไม่ต้องถาม
- `kmo-104` — brand เขียนผิดปกติเป็น `Honda Giorno` (ทั้งที่ปกติ brand คือ `Honda` model คือ `Giorno`)
  model จริงในแถวนี้คือ `ABS 125` เป็น data entry ผิดรูปแบบ ไม่ mark ไปก่อนเพราะไม่ชัดว่าใช่ Giorno
  ตัวเดียวกันไหม

ถ้า CEO อยากรวม 4 รายการข้างบนด้วย บอกได้ แล้วอัปเดตตารางนี้อีกรอบ — Codex ทำแค่ตามตารางที่ confirm แล้วเท่านั้น

**Non-goal อื่นๆ:**
- ห้ามแตะ `booking.html`, `calendar.html`, `CustomerOrder.html` หรือไฟล์ใดๆ ใน production repo
  (`kmorackbarcustom.github.io`) — repo นี้คุม catalog/UX เท่านั้น
- ห้ามแตะ capacity logic ใดๆ (ไม่เกี่ยวกับ repo นี้อยู่แล้ว แต่ระบุไว้กันพลาด)
- ห้ามลบ/แก้ id/class ที่ผูกกับ `DESIGN_BRIEF.md` เดิม
- ห้าม mark สินค้า id อื่นนอกเหนือจาก 32 รายการในตารางเป็น featured เองเพิ่มเติม (ไม่กระทบ
  implementation รอบนี้อยู่แล้ว เพราะ Step 1 สั่งให้ตั้ง `FALSE` ทุกแถวไว้ก่อน — เลขนี้ไว้กันสับสนตอนอ่านทีหลัง)

---

## สถานะที่เช็คแล้วก่อนเขียนบรีฟ

- CSV ปัจจุบัน (`assets/product_catalog_template.csv`) columns:
  `id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`
  — **ยังไม่มีคอลัมน์ featured**
- `app.js` มี CSV parser generic อยู่แล้ว (บรรทัด ~140-203) ที่ map ทุก column เป็น key อัตโนมัติ
  รูปแบบ boolean parsing มีตัวอย่างอยู่แล้วจาก `allow_booking`/`allow_order`
  (`val.toUpperCase() === 'TRUE'`) — ใช้ pattern เดียวกันสำหรับ `featured`
- `renderCatalog()` อยู่บรรทัด ~416 — จุดที่ต้องเพิ่ม logic แยกสินค้า featured ออกมา
- grep ทั้ง repo แล้ว **ไม่มีโค้ดใดๆ เกี่ยวกับ featured/ขายดีอยู่เลย** — งานนี้เริ่มจากศูนย์จริง ไม่ใช่ resume งานเก่า

---

## ขอบเขตงาน

### Step 1 — เพิ่มคอลัมน์ `featured` ใน CSV

- เพิ่ม column `featured` ต่อท้าย schema เดิม: `...,allow_booking,allow_order,featured`
- ทุกแถวตั้งเป็น `FALSE` หมด — **CEO จะเข้ามาแก้เป็น `TRUE` เองตามตาราง 32 id ด้านบน (และอาจเพิ่ม/ตัดเอง)**
  Codex ไม่ต้อง mark ค่าใดๆ ในคอลัมน์นี้เอง
- อัปเดต `PROJECT_CONTEXT.md`/`CODEX_HANDOFF.md` ระบุ schema ใหม่ให้ตรง

### Step 2 — Parser + data model

- `app.js`: เพิ่ม parse rule `featured` เป็น boolean แบบเดียวกับ `allow_booking`
- ถ้า CSV เก่า/fallback products (บรรทัด ~25-91 ที่ hardcode ไว้ตอน CSV โหลดไม่ได้) ไม่มี field นี้
  ให้ default เป็น `false` ไม่ error

### Step 3 — Render section

- เพิ่ม section ใหม่ในตำแหน่ง**ต้น catalog** (ก่อน grid สินค้าทั่วไป ตามที่ PROJECT_CONTEXT.md ระบุ)
- Filter สินค้าที่ `featured === true` มาแสดงในการ์ดที่มี visual เด่นกว่าปกติ (เช่น badge/border สี safety
  yellow ตาม `DESIGN_BRIEF.md` theme เดิม — ห้ามคิดสีใหม่นอกโทน industrial ที่มีอยู่)
- **section ต้องซ่อนตัวเองอัตโนมัติถ้าไม่มีสินค้า featured=true เลย** (สำคัญมาก — ตอนนี้ทุกแถวเป็น
  `FALSE` เพราะ CEO ยังไม่ได้เข้ามา mark เอง ถ้า section โชว์กล่องว่างตอนนี้จะดูเหมือนบั๊กหน้าเว็บจริงทันที)
- สินค้าที่ปรากฏใน featured section ยังต้องปรากฏใน catalog grid ปกติด้วย (ไม่ตัดออกจาก grid หลัก)
- ถ้า CEO ทำตามตาราง reference (32 rows, ADV350 เดี่ยวมี 11 รายการ) แล้ว layout ดูแน่นเกินไป
  ให้รายงานกลับมา ไม่ต้องตัดสินใจเองว่าจะจำกัดจำนวนต่อรุ่นหรือไม่

### Step 4 — Cache busting

- bump `styles.css?v=11.2` → `v=11.3` และ `app.js?v=11.4` → `v=11.5` ใน `index.html`
  (ตามมาตรฐานเดิมของ repo นี้ กันเบราว์เซอร์แคช JS/CSS เก่า)

### Step 5 — รายงานกลับ

ส่ง diff กลับพร้อมบอกชัดว่า:
- ตอนนี้ featured section จะไม่โชว์อะไรเลยบนเว็บจริง (เพราะ CEO ยังไม่ได้เข้ามา mark) เป็นพฤติกรรมที่ถูกต้อง ไม่ใช่บั๊ก
- CEO จะเข้ามาแก้ `assets/product_catalog_template.csv` เปลี่ยน `FALSE` เป็น `TRUE` เองตามตาราง reference
  ในไฟล์นี้ (32 id) ถึงจะเห็น section ทำงานจริง — ไม่ใช่งานที่ Codex ต้องทำต่อ

---

## Verify ก่อนถือว่าจบงาน

1. `node --check app.js` ผ่าน
2. เปิดเว็บจริง/local ตอนที่ CSV ทุกแถว `featured=FALSE` (สถานะตอน commit) → ต้อง**ไม่เห็น section ว่างโผล่มา**
3. แก้ CSV ทดสอบ mark สินค้า 2-3 แถวเป็น `featured=TRUE` ชั่วคราว (ในเครื่อง ไม่ push) → section ต้องโชว์
   การ์ดถูกต้อง แล้วสินค้านั้นต้องยังอยู่ใน grid ปกติด้วย จากนั้น **revert CSV กลับเป็น FALSE ทั้งหมดก่อน commit**
   (ห้าม push CSV ที่มีการ mark เอง — CEO จะเป็นคน mark จริงเองทีหลัง)
4. เช็ค mobile viewport ว่า section ใหม่ไม่ชนกับ mobile nav/header ที่เพิ่งแก้เสร็จ (`28a80e6`, `f0b24a1`)
5. `git remote -v` ต้องเป็น `Gutumrod/kmo-landing-page` ก่อน commit ใดๆ

---

## Where things live

- Landing repo: `D:\AI-Workspace\projects\kmo-landing-page\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmo-landing-page/` (Mac) (remote `Gutumrod/kmo-landing-page`)
- Production repo (ห้ามแตะในงานนี้): `D:\AI-Workspace\projects\kmorackbarcustom.github.io\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmorackbarcustom.github.io/` (Mac)
- Design tokens: `DESIGN_BRIEF.md`
- สถานะโปรเจกต์เต็ม: `PROJECT_CONTEXT.md`, `CODEX_HANDOFF.md`
