# CODEX HANDOFF — KMO Landing Page

Updated: 2026-07-15

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
- Local CSV catalog
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

Current cache refs:

- CSS: `styles.css?v=11.2`
- JS: `app.js?v=11.4`

---

## Product CSV

Source:

`assets/product_catalog_template.csv`

Columns:

`id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`

Rules:

- `allow_booking=TRUE` shows `นัดคิวคัสตอมงาน`
- `allow_order=TRUE` shows `สั่งตรงกับร้าน`
- `shopee_url` shows `ซื้อผ่าน Shopee`
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
- Landing live page served `app.js?v=11.4`
- Live app script contains `นัดคิวคัสตอมงาน`
- Live app script no longer contains old product-card label `จองติดตั้ง`

---

## Next Work

1. Add `สินค้าขายดี` / featured products section
2. Continue filling product images/descriptions in CSV
3. Recheck mobile layout after content is fuller
4. Production hardening: server-side slip/upload validation
5. Custom domain after content is final

---

## Local Git Note

At the time of this handoff, `AGENTS.md` and this `CODEX_HANDOFF.md` may be untracked in the landing repo. Do not commit them unless the owner explicitly wants repo-local agent docs tracked.
