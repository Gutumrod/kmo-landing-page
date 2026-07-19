# CODEX HANDOFF — KMO Landing Page

Updated: 2026-07-20 (PC session → handing off to Mac session)

---

## Project Paths

Landing repo:

`D:\AI-Workspace\projects\kmo-landing-page\`

Remote:

`https://github.com/Gutumrod/kmo-landing-page.git`

Production repo:

`D:\AI-Workspace\projects\kmorackbarcustom.github.io\`

Remote:

`https://github.com/kmorackbarcustom/kmorackbarcustom.github.io.git`

Do not edit stale clone:

`D:\AI-Workspace\projects\landing page\KMO\`

---

## Session Handoff (2026-07-19/20, PC → Mac)

Full plan/context lives in this repo's `COMMANDER_PLAN.md` and `DEV_SCHEDULE.md` — read those first.
Short version of what changed this session:

1. Verified live site works (Supabase catalog fetch confirmed via console on production, not just local)
2. Found gap: `admin-products.html` (in the **production** repo) only had a text box for `image_url` —
   no way to upload a photo file, one photo per product (schema unchanged, still one `image_url` column)
3. Built + deployed a fix in the **production repo** (`kmorackbarcustom.github.io`), not this one:
   - New public Supabase Storage bucket `product-images` on HR project `ybyseaenceyswjnwdmdf` (5MB limit,
     jpeg/png/webp only)
   - Extended `supabase-hr/supabase/functions/products-proxy/index.ts` to also proxy `PUT` requests to
     `storage/v1/object/product-images/*` — same `x-staff-key` gate and service-role forwarding pattern
     already used for the `products` table, no new auth model introduced
   - `admin-products.html` now has a file picker next to `image_url` — pick a file, it uploads through the
     proxy and auto-fills `image_url` with the public URL
   - Deployed the edge function via `supabase functions deploy products-proxy --project-ref ybyseaenceyswjnwdmdf`
     (CLI already logged into the separate KMO Supabase account on this machine)
   - Tested end-to-end (curl upload, wrong-mime-type rejection, and a simulated file-picker flow in-browser)
     before pushing — all test objects cleaned out of the bucket afterward
4. Pushed to production repo: commit `fcf388c`
5. Considered an alternative (store photos in this repo's `assets/images/`, keyed by product `id`, git
   push instead of Supabase) — rejected for now because it would require a git commit/push per photo,
   which `admin-products.html` can't do and reintroduces the "go find somewhere to host it" friction this
   fix was meant to remove. Worth revisiting only if CEO wants everything versioned in one git repo instead.

**Still open / not yet done:**
- CEO has not yet tried the new upload button live on the real deployed page themselves (only tested via
  script-simulated file selection, confirmed working end-to-end)
- Everything else in `COMMANDER_PLAN.md` Phase 1/2/4 (mark featured products, fill in real photos per
  product, mobile density pass) — all still pending, all owner/content work now that the upload path exists

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

- `fcf388c feat: add direct photo upload to product admin via Supabase Storage`
- `bf1b4e1 feat: prefill vehicle from landing catalog`
- `963ffb3 feat: store landing cart metadata`
- `d746ca3 feat: prefill customer order from query`
- `44cae9e feat: prefill booking services from query`

---

## Verification Snapshot

Checks from 2026-07-19 (live site, `https://gutumrod.github.io/kmo-landing-page/`):

- Console confirms Supabase catalog fetch works on production: "Successfully fetched 195 products from Supabase" — commit `5cd0658` (CSV → Supabase switch) is live and working, not just local
- No console errors on load
- Catalog, category filters, per-product buttons (`สอบถามราคา` / `นัดคิวคัสตอมงาน` / `สั่งตรงกับร้าน`), cart, and booking form all render correctly
- Featured (`สินค้าขายดี`) section correctly stays hidden — expected, since no one has marked `featured=TRUE` in Supabase/admin yet
- Not yet checked: whether `admin-products.html` can create products through `products-proxy` (still open from prior snapshot)

Prior checks (2026-07-15):

- Landing remote verified: `Gutumrod/kmo-landing-page`
- Production remote verified: `kmorackbarcustom/kmorackbarcustom.github.io`
- Production repo clean at `bf1b4e1`
- `node --check app.js` passed for featured-products changes
- Local browser check passed: with all CSV rows `featured=FALSE`, featured section stays hidden
- Local browser check passed: temporary in-memory `featured=TRUE` rows render in `สินค้าขายดี` and remain in the main grid

---

## Next Work

1. CEO tries the new photo-upload button live on `admin-products.html` (production repo) — confirm it
   works from a real device before relying on it
2. Owner marks `featured=TRUE` rows in Supabase/admin page for `สินค้าขายดี`
3. Continue filling real product photos through admin page (now that the upload button exists) —
   this is still the single biggest content gap (195 products, only 5 recycled placeholder images)
4. Recheck mobile layout after content is fuller
5. See `COMMANDER_PLAN.md` / `DEV_SCHEDULE.md` for the full phased breakdown

---

## Local Git Note

`AGENTS.md` and `CODEX_HANDOFF.md` are tracked in the landing repo as of commit `3cf03b2`.
