# Project Context: KMO RACK BAR CUSTOM - Landing Catalog

**Last Updated:** 2026-07-19
**Current Phase:** Landing catalog runtime on HR Supabase; remaining work is product data/photos and production write-path verification
**Progress:** ~98% สำหรับ landing catalog และ handoff ไป production forms
**Live URL:** `https://gutumrod.github.io/kmo-landing-page/`

---

## เป้าหมายโปรเจกต์

`kmo-landing-page` เป็นหน้าร้านแคตตาล็อกขายตรงของ KMO RACK BAR CUSTOM ไม่ใช่ระบบ transaction หลัก และไม่ใช่ตัวแทน production repo

หน้าที่ของ repo นี้:

- หน้าแรก / hero / branding
- catalog สินค้าจาก Supabase table `products` ใน HR project
- search / filter / load more
- cart drawer แบ่ง booking และ order
- ส่งข้อมูลสินค้าในตะกร้าไป production forms ผ่าน query string

ธุรกรรมจริงยังอยู่ที่ production repo:

- `booking.html`
- `calendar.html`
- `CustomerOrder.html`
- dashboard / Supabase / RPC

หลักการสำคัญ: repo นี้ไม่ควร copy หรือ maintain transaction forms เอง ให้ลิงก์ออกไป production เท่านั้น

---

## Repo Map

| Purpose | Windows Path | Mac Path | Remote |
|---|---|---|---|
| Landing catalog | `D:\AI-Workspace\projects\kmo-landing-page\` | `/Users/wachirayachankhonkan/AI-Workspace/projects/kmo-landing-page/` | `https://github.com/Gutumrod/kmo-landing-page.git` |
| Production transaction | `D:\AI-Workspace\projects\kmorackbarcustom.github.io\` | `/Users/wachirayachankhonkan/AI-Workspace/projects/kmorackbarcustom.github.io/` | `https://github.com/kmorackbarcustom/kmorackbarcustom.github.io.git` |
| Old clone, do not edit | `D:\AI-Workspace\projects\landing page\KMO\` | not present on Mac (stale, do not recreate) | stale |

ก่อนแก้ไฟล์ทุกครั้งให้เช็ก `git remote -v`, `git status`, และ branch ให้ตรง repo

---

## สถานะล่าสุดจากโค้ดจริง

### Catalog

- Runtime source of truth ปัจจุบันคือ Supabase table `public.products` ใน HR project `ybyseaenceyswjnwdmdf`
- `assets/product_catalog_template.csv` ยังเก็บไว้เป็น snapshot/fallback reference และ seed source
- จำนวนสินค้าใน CSV snapshot ล่าสุด: 195 รายการ
- Schema ปัจจุบัน:
  `id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order,featured`
- จำนวนตามหมวดล่าสุด:
  - `accessory`: 84
  - `crashbar`: 55
  - `rear`: 30
  - `side`: 25
  - `service`: 1
- ยังไม่มี `gear` ใน CSV ล่าสุด แม้ปุ่ม filter ยังรองรับอยู่
- มี fallback products 7 รายการใน `app.js` ถ้า Supabase โหลดไม่ได้
- คอลัมน์ `featured` เพิ่มแล้ว ค่าเริ่มต้นทุกแถวเป็น `FALSE` จนกว่า owner จะ mark สินค้าขายดีเอง

### Product actions

ปุ่มในการ์ดสินค้าขึ้นตามข้อมูล Supabase:

- `allow_booking=TRUE` แสดงปุ่ม `นัดคิวคัสตอมงาน`
- `allow_order=TRUE` แสดงปุ่ม `สั่งตรงกับร้าน`
- `shopee_url` ไม่ว่าง แสดงปุ่ม `ซื้อผ่าน Shopee`

Shopee เป็นช่องทางเสริมเท่านั้น ไม่ตัดปุ่มสั่งตรงกับร้านออก

### Cart / Prefill

- Cart แบ่งเป็น 2 กลุ่ม:
  - booking items
  - order items
- ถ้า cart items มี `brand/model` เดียวกัน จะส่ง `brand` และ `model` ไป production forms เพื่อ prefill รุ่นรถ
- ส่ง structured metadata ผ่าน `cart_meta`
- ส่ง `estimated_total` และ `source_page`
- Production repo รองรับคอลัมน์ / metadata แล้ว

### Catalog UX

- Search รองรับ `brand`, `model`, `name`, `description`, `category`
- Filter รองรับ `all`, `rear`, `side`, `crashbar`, `accessory`, `gear`, `service`
- Catalog แสดงเริ่มต้น 24 รายการ
- ปุ่ม `ดูเพิ่มเติม` โหลดเพิ่มครั้งละ 24 รายการ
- เปลี่ยน search/filter แล้ว reset กลับไป 24 รายการแรก

### Mobile / Visual

- ใช้ industrial black + safety yellow theme
- แก้ mobile header/nav ให้ไม่ชนกันแล้ว
- แก้ heading mobile ด้วย `.mobile-title-break`
- script cache ล่าสุดใน `index.html`: `app.js?v=11.6`
- CSS cache ล่าสุด: `styles.css?v=11.3`

---

## Completed

| Area | Status | Notes |
|---|---|---|
| Repo scope clarification | Done | Landing ไม่ maintain transaction forms |
| Industrial redesign import | Done | ใช้ภาพ/ดีไซน์ที่ผู้ใช้ออกแบบเป็นฐาน |
| Favicon | Done | ใช้ไฟล์ profile image เป็น favicon |
| D1 booking prefill | Done | Landing ส่ง `services`/`note` ไป production `booking.html` |
| D1 order prefill | Done | Landing ส่ง `products`/`other_text` ไป production `CustomerOrder.html` |
| D2 metadata | Done | `cart_meta`, `estimated_total`, `source_page` ใน production DB/RPC |
| Brand/model prefill | Done | CSV + landing + production forms รองรับ `brand/model` |
| Local CSV catalog | Done | ใช้ `assets/product_catalog_template.csv` แทน Google Sheet runtime |
| Supabase catalog runtime | Done | `app.js` โหลด runtime products จาก HR Supabase `public.products`; CSV เป็น snapshot/seed |
| Shopee/direct order logic | Done | Shopee ไม่แทนปุ่มสั่งตรง |
| Load more | Done | 24 รายการแรก + ปุ่มเพิ่มครั้งละ 24 |
| Product booking label | Done | `จองติดตั้ง` เปลี่ยนเป็น `นัดคิวคัสตอมงาน` |
| Mobile nav/heading fix | Done | Live Pages verified หลัง bump cache |
| Featured products support | Done | section ซ่อนอัตโนมัติจนกว่า CSV จะมี `featured=TRUE` |

---

## Important Commits

Landing repo:

- `3b2b19e feat: import custom landing page design`
- `0647889 fix: add site favicon`
- `d4d0961 feat: pass structured cart metadata`
- `b9330e1 feat: load local KMO product catalog`
- `7339be3 feat: add brand model catalog fields`
- `e8b9bbb feat: keep direct order alongside Shopee`
- `f0b24a1 fix: clean up mobile hero header layout`
- `28a80e6 fix: restore mobile nav and tame headings`
- `d39cf76 feat: add catalog load more`
- `c3dd634 fix: bust catalog script cache`
- `6183c53 fix: rename booking product action`
- `30b6403 fix: bust product action label cache`

Production repo:

- `44cae9e feat: prefill booking services from query`
- `d746ca3 feat: prefill customer order from query`
- `963ffb3 feat: store landing cart metadata`
- `bf1b4e1 feat: prefill vehicle from landing catalog`

---

## Pending / Next Work

| Task | Priority | Notes |
|---|---|---|
| Confirm `products-proxy` + `admin-products.html` write path | High | ต้องเช็กใน production repo ว่า edge function/admin page ใช้งานจริงกับ project `ybyseaenceyswjnwdmdf` ได้หรือยัง |
| เติมข้อมูลสินค้า/รูปจริงที่เหลือ | High | CSV snapshot ยังใช้รูป placeholder 5 รูปซ้ำกันทั้ง 195 รายการ; runtime ควรแก้ผ่าน Supabase/admin write path |
| Mark สินค้าขายดี | High | frontend พร้อมแล้ว แต่ snapshot ล่าสุดมี `featured=FALSE` ทั้ง 195 รายการ; owner ต้องเลือกสินค้าแล้ว flip ใน Supabase |
| ตรวจ UX หลังสินค้า 195 รายการบนมือถือจริง | Medium | load-more ทำแล้ว แต่ยังควรดู spacing/card density |
| Server-side slip/upload validation ใน production | Medium | เป็น production scope ไม่ใช่ landing |
| ราคา/สถานะจริงใน dashboard เพิ่มเติม | Low-Medium | metadata รองรับแล้ว ถ้าจะทำ workflow หลังบ้านเพิ่มค่อยวางรอบใหม่ |
| Deploy custom domain | Pending | ยังไม่พร้อมจนกว่าสินค้า/รูป/โดเมนจะ final |

---

## Open Decisions

| Decision | Current stance |
|---|---|
| Google Sheet ยังใช้เป็น runtime source ไหม | ไม่ใช้แล้ว; runtime อยู่ที่ Supabase `products` ใน HR project |
| Brand/model ต้องตรง form production ไหม | ใช่ ตอนนี้ส่ง query prefill แล้ว |
| Shopee item ควรมีปุ่มสั่งตรงด้วยไหม | ใช่ ลูกค้าที่ไม่อยากจ่ายค่าบวก platform ต้องสั่งตรงได้ |
| Catalog จำนวนเยอะควรใช้ pagination หรือ load more | ใช้ load more ก่อน เหมาะกับ mobile มากกว่า |

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page structure, catalog container, cart drawer, cache-busted script/style refs |
| `app.js` | Catalog loader/parser, search/filter, product cards, cart, checkout URL building |
| `styles.css` | Industrial KMO visual system, responsive fixes, catalog/card/cart styles |
| `assets/product_catalog_template.csv` | CSV snapshot/seed reference; runtime source อยู่ที่ Supabase |
| `PRD.md` | Updated high-level product requirements |
| `implementation_plan.md` | Current implementation roadmap/status |
| `CODEX_HANDOFF.md` | Local handoff summary for future agents; tracked in repo as of `3cf03b2` |
| `DESIGN_BRIEF.md` | Industrial design requirements and JS-bound IDs/classes |

---

## Verification Snapshot

Latest checks done 2026-07-19:

- landing repo clean on `main...origin/main`
- landing remote confirmed as `Gutumrod/kmo-landing-page`
- code confirmed loading products from `https://ybyseaenceyswjnwdmdf.supabase.co/rest/v1/products`
- CSV snapshot parsed as 195 product rows, 12 columns, `featured=FALSE` for all rows
- CSV snapshot references only 5 distinct image files, so real per-product images remain the biggest content gap
- cache refs confirmed: `styles.css?v=11.3`, `app.js?v=11.6`

---

**Last Edited By:** Codex
