# Implementation Plan — KMO Landing Page

**Last Updated:** 2026-07-15
**Source of truth:** `PROJECT_CONTEXT.md` + current repo files
**Current live page:** `https://gutumrod.github.io/kmo-landing-page/`

---

## Current Objective

`kmo-landing-page` คือหน้าร้านแคตตาล็อกขายตรงสำหรับ KMO RACK BAR CUSTOM:

- ให้ลูกค้าเห็นรายการสินค้า/งานคัสตอม
- ค้นหาด้วยชื่อสินค้า ยี่ห้อ รุ่นรถ หรือหมวด
- กดเก็บลงตะกร้า
- แยก flow ระหว่างนัดคิวคัสตอมงานกับสั่งตรงกับร้าน
- ส่งข้อมูลสินค้าไป production forms ให้ลูกค้าไม่ต้องกรอกซ้ำทั้งหมด

Repo นี้ไม่ใช่ production transaction system และไม่ควร maintain `booking.html`, `calendar.html`, หรือ `CustomerOrder.html` เอง

---

## Mandatory Gate Before Editing

ทำทุกครั้งก่อนแก้ไฟล์:

1. Path ต้องเป็น `D:\AI-Workspace\projects\kmo-landing-page\`
2. Remote ต้องเป็น `https://github.com/Gutumrod/kmo-landing-page.git`
3. Fetch/check status ก่อนแก้: `git fetch --all --prune`, `git status --short`
4. ถ้าต้องแตะ transaction form หรือ Supabase ให้สลับไป production repo:
   `D:\AI-Workspace\projects\kmorackbarcustom.github.io\`
5. ห้ามแก้ clone เก่า:
   `D:\AI-Workspace\projects\landing page\KMO\`

---

## Current Data Model

Catalog source:

`assets/product_catalog_template.csv`

Columns:

`id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`

Current count: 195 products

Supported categories:

- `rear`
- `side`
- `crashbar`
- `accessory`
- `gear`
- `service`

Note: Latest CSV has no `gear` rows yet, but code and UI still support it.

---

## Product Button Rules

| CSV field | Button | Behavior |
|---|---|---|
| `allow_booking=TRUE` | `นัดคิวคัสตอมงาน` | Adds product to booking cart |
| `allow_order=TRUE` | `สั่งตรงกับร้าน` | Adds product to direct-order cart |
| `shopee_url` not empty | `ซื้อผ่าน Shopee` | Opens Shopee link in new tab |

Shopee button is additive only. It must not replace direct order.

---

## Completed Phases

### Phase A — Catalog Source

Done.

- Replaced runtime Google Sheet dependency with local CSV
- Added 195 product rows
- Added brand/model fields
- Kept fallback hardcoded products for CSV fetch failure

### Phase B — Search / Empty State

Done.

- Search checks brand, model, name, description, category
- Search combines with category filter
- Empty state offers admin contact fallback

### Phase C — Split Cart

Done.

- Booking and order items are separated in the same cart drawer
- Each section has its own checkout action
- Booking/order URL builders only use the matching item type

### Phase D1 — Prefill Production Forms

Done.

- Booking cart sends `services` and `note` to production `booking.html`
- Order cart sends `products` and `other_text` to production `CustomerOrder.html`
- Forms still work when opened without query params

### Phase D2 — Metadata / Brand Model

Done for the current agreed scope.

- Landing sends structured `cart_meta`
- Landing sends `estimated_total`
- Landing sends `source_page`
- Landing sends `brand` and `model` when selected cart items share one vehicle
- Production repo stores/reads those fields where applicable

### Phase E — Safety / Render Hygiene

Done for landing-controlled catalog/cart rendering.

- CSV-controlled visible fields render through DOM/textContent paths
- External URLs go through safe URL handling
- Loader guards prevent missing DOM nodes from breaking init

### Mobile / Catalog UX

Done.

- Restored mobile nav while avoiding overlap
- Added mobile title breaks
- Catalog renders first 24 products and uses `ดูเพิ่มเติม` to append 24 more
- `app.js` cache-busted to `v=11.4`

---

## Next Recommended Work

### Phase F — Featured / Best Sellers

Need design + implementation.

Problem observed by owner: current page lacks a clear `สินค้าขายดี` section.

Recommended direction:

- Add a featured row before the normal catalog grid
- Use larger cards than normal products
- Keep JS-bound IDs/classes intact
- Data source can be simple at first:
  - either a fixed featured ID list in `app.js`
  - or a new CSV column such as `featured_rank`

Do not add this until deciding the data source.

### Phase G — Catalog Content Completion

Owner will continue filling product data.

Need to keep:

- same CSV file path
- same column names
- UTF-8 encoding
- duplicate rows can be removed

### Phase H — Production Hardening

Production repo scope:

- server-side slip/upload validation
- additional dashboard display of metadata/estimated prices if needed
- any Supabase RPC/schema changes beyond the current metadata columns

---

## Validation Checklist

Before saying done after any future change:

- `node --check app.js`
- `git diff --check`
- Confirm no unintended changes to `assets/product_catalog_template.csv`
- Confirm live Pages has the latest `app.js?v=...`
- If changing visual/mobile: check iPhone-width layout
- If changing checkout: test booking and order URLs separately
- If changing production: test direct production form URL without query params

---

## Known Local State

As of 2026-07-15:

- `AGENTS.md` is untracked
- `CODEX_HANDOFF.md` is untracked
- Do not commit untracked files unless the owner explicitly wants them tracked
