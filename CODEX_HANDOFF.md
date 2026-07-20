# CODEX HANDOFF — KMO Landing Page

Updated: 2026-07-15

---

## Project Paths

Landing repo:

`D:\AI-Workspace\projects\kmo-landing-page\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmo-landing-page/` (Mac)

Remote:

`https://github.com/Gutumrod/kmo-landing-page.git`

Production repo:

`D:\AI-Workspace\projects\kmorackbarcustom.github.io\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmorackbarcustom.github.io/` (Mac)

Remote:

`https://github.com/kmorackbarcustom/kmorackbarcustom.github.io.git`

Do not edit stale clone:

`D:\AI-Workspace\projects\landing page\KMO\` (Windows-only, not present on Mac — do not recreate it there)

---

## Landing Repo Scope

This repo owns:

- `index.html`
- `app.js`
- `styles.css`
- `assets/product_catalog_template.csv`
- catalog/search/filter/cart/mobile UX

This repo must not maintain production transaction pages:

- `booking.html`
- `calendar.html`
- `CustomerOrder.html`

Those live in production repo.

---

## Current Status

Completed:

- Industrial KMO design import
- Favicon
- Supabase catalog runtime prep
- 195 product rows
- Brand/model fields
- Search by brand/model/name/description/category
- Split cart: booking/order
- Booking/order production prefill
- Structured metadata: `cart_meta`, `estimated_total`, `source_page`
- Shared vehicle prefill: `brand`, `model`
- Shopee button stays alongside direct order
- Mobile nav/header/title fixes
- Catalog load-more
- Product booking button label changed to `นัดคิวคัสตอมงาน`
- Featured products section support; hidden until CSV has `featured=TRUE`
- Landing `app.js` reads runtime products from HR Supabase table `public.products`; CSV remains as snapshot/seed reference

Current cache refs:

- CSS: `styles.css?v=11.3`
- JS: `app.js?v=11.6`

---

## Product Catalog Source

Runtime source:

`public.products` in HR Supabase project `ybyseaenceyswjnwdmdf`

Snapshot / seed source:

`assets/product_catalog_template.csv`

Columns:

`id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order,featured`

Rules:

- `allow_booking=TRUE` shows `นัดคิวคัสตอมงาน`
- `allow_order=TRUE` shows `สั่งตรงกับร้าน`
- `shopee_url` shows `ซื้อผ่าน Shopee`
- `featured=TRUE` shows the product in the `สินค้าขายดี` section while keeping it in the main catalog grid
- Shopee is additive; do not remove direct-order button because a Shopee link exists

---

## Latest Important Commits

Landing:

- `30b6403 fix: bust product action label cache`
- `6183c53 fix: rename booking product action`
- `d39cf76 feat: add catalog load more`
- `28a80e6 fix: restore mobile nav and tame headings`
- `e8b9bbb feat: keep direct order alongside Shopee`
- `7339be3 feat: add brand model catalog fields`
- `b9330e1 feat: load local KMO product catalog`
- `d4d0961 feat: pass structured cart metadata`

Production:

- `bf1b4e1 feat: prefill vehicle from landing catalog`
- `963ffb3 feat: store landing cart metadata`
- `d746ca3 feat: prefill customer order from query`
- `44cae9e feat: prefill booking services from query`

---

## Verification Snapshot

Latest checks:

- Landing remote verified: `Gutumrod/kmo-landing-page`
- Production remote verified: `kmorackbarcustom/kmorackbarcustom.github.io`
- Production repo clean at `bf1b4e1`
- `node --check app.js` passed for featured-products changes
- Local browser check passed: with all CSV rows `featured=FALSE`, featured section stays hidden
- Local browser check passed: temporary in-memory `featured=TRUE` rows render in `สินค้าขายดี` and remain in the main grid
- Landing live Pages deploy was not rechecked after these local changes

---

## Next Work

1. Run HR Supabase setup/seed SQL and deploy `products-proxy`
2. Verify `admin-products.html` can create products through `products-proxy`
3. Owner marks `featured=TRUE` rows in Supabase/admin page for `สินค้าขายดี`
4. Continue filling product images/descriptions through admin page
5. Recheck mobile layout after content is fuller

---

## Local Git Note

`AGENTS.md` and `CODEX_HANDOFF.md` are tracked in the landing repo as of commit `3cf03b2`.
