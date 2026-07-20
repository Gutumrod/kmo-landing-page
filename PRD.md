# PRD: KMO RACK BAR CUSTOM - Landing Catalog

**Project Owner:** คุณฟรี
**Created:** 2026-07-07
**Last Updated:** 2026-07-19
**Status:** Active, near production polish

---

## 1. Objective

KMO RACK BAR CUSTOM ต้องมีหน้าร้านแคตตาล็อกที่ลูกค้าเปิดดูสินค้า เลือกรายการ และเริ่มทำรายการได้เองโดยไม่ต้องถามแอดมินทุกขั้นตอน

เป้าหมายหลัก:

- ลดเวลาคุยซ้ำเรื่องสินค้า/รุ่นรถ/รายการที่ต้องการทำ
- เพิ่มช่องทางสั่งตรงกับร้าน เพื่อลดผลกระทบจากค่าคอมแพลตฟอร์ม
- ให้ลูกค้าเลือกสินค้าแล้วส่งข้อมูลต่อไป production forms ได้
- ทำให้แอดมินเห็นบริบทสินค้า/ราคาอ้างอิง/รุ่นรถจาก landing page

---

## 2. Scope

### In Scope

- Industrial black + safety-yellow landing page
- Product catalog from HR Supabase with local CSV snapshot/seed reference
- Search by product, brand, model, category, description
- Category filters
- Load-more catalog UX for large product list
- Cart drawer with booking and order groups
- Direct-order and Shopee coexistence
- Query prefill into production booking/order forms
- Structured cart metadata handoff to production
- Mobile responsive layout

### Out of Scope For This Repo

- Payment gateway
- Customer authentication
- Inventory management
- Production transaction forms
- Production transaction Supabase schema/RPC/dashboard changes
- Booking calendar implementation inside this landing repo

Transaction forms live in `kmorackbarcustom.github.io`.

---

## 3. System Architecture

| Component | Current implementation |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Catalog data | HR Supabase `public.products` |
| Catalog snapshot/seed | `assets/product_catalog_template.csv` |
| Cart storage | Browser localStorage |
| Transaction destination | Production GitHub Pages repo |
| Production backend | Supabase-backed production forms |
| Hosting | GitHub Pages |

Landing repo:

`D:\AI-Workspace\projects\kmo-landing-page\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmo-landing-page/` (Mac)

Production repo:

`D:\AI-Workspace\projects\kmorackbarcustom.github.io\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmorackbarcustom.github.io/` (Mac)

---

## 4. Product Data Requirements

Runtime table:

`public.products` in HR Supabase project `ybyseaenceyswjnwdmdf`

CSV snapshot / seed file:

`assets/product_catalog_template.csv`

Required columns:

`id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order,featured`

Rules:

- `id` must be unique
- `price` can be `0` when price must be confirmed by admin
- `brand/model` are used for search and production form prefill
- `allow_booking=TRUE` means customer can add item to booking cart
- `allow_order=TRUE` means customer can add item to direct-order cart
- `shopee_url` adds a Shopee button but does not remove direct order
- `featured=TRUE` shows the product in `สินค้าขายดี`

---

## 5. User Flows

### Browse / Search

1. Customer lands on page
2. Catalog loads from HR Supabase
3. Customer searches by brand/model/product
4. Customer filters by category
5. Page shows 24 products first
6. Customer taps `ดูเพิ่มเติม` to load more products

### Booking Flow

1. Product has `allow_booking=TRUE`
2. Product card shows `นัดคิวคัสตอมงาน`
3. Customer adds item to booking cart
4. Checkout opens production `booking.html`
5. Landing passes `services`, `note`, `cart_meta`, and shared `brand/model` when possible

### Direct Order Flow

1. Product has `allow_order=TRUE`
2. Product card shows `สั่งตรงกับร้าน`
3. Customer adds item to order cart
4. Checkout opens production `CustomerOrder.html`
5. Landing passes `products`, `other_text`, `cart_meta`, and shared `brand/model` when possible

### Shopee Flow

1. Product has `shopee_url`
2. Product card shows `ซื้อผ่าน Shopee`
3. Customer can open Shopee in a new tab
4. Direct-order button remains available when `allow_order=TRUE`

---

## 6. Success Criteria

- Catalog loads from Supabase reliably, with fallback products if the fetch fails
- Search/filter works with Thai product text and brand/model
- Mobile layout does not overlap header/nav/headings
- Product cards show the right buttons from CSV fields
- Booking and order flows prefill production forms
- Shopee link is optional and additive
- Landing page remains fast enough for mobile use
- Future agents can identify repo boundaries without guessing

---

## 7. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Supabase catalog fetch fails | Catalog may show fallback products only | Keep fallback products and monitor browser/network errors |
| CSV snapshot drifts from Supabase | Future seed/reference may be stale | Treat Supabase as runtime source and refresh snapshot intentionally |
| User edits wrong repo | Production or landing drift | Keep repo map in docs and gate before edits |
| Browser caches old JS | UI label/logic appears stale | Bump `app.js?v=...` whenever app logic changes |
| Product count grows too large | Mobile catalog feels long | Use load-more; consider featured/best-seller section |
| Production forms change separately | Prefill can drift | Test production form direct URLs and query-prefill URLs |

---

## 8. Next Product Decisions

1. Confirm production `admin-products.html` + `products-proxy` can edit Supabase products end-to-end
2. Mark `featured=TRUE` products for `สินค้าขายดี`
3. Finish real product images and remaining product descriptions
4. Decide timing for custom domain
5. Decide if production dashboard needs richer display of `cart_meta`

---

## 9. Related Documents

- `PROJECT_CONTEXT.md` — latest implementation status
- `implementation_plan.md` — current roadmap and validation checklist
- `DESIGN_BRIEF.md` — industrial visual direction and JS-bound IDs/classes
- `CODEX_TASK.md` — archived D1 task brief
- `CODEX_HANDOFF.md` — local agent handoff, currently untracked unless intentionally committed
