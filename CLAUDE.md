# CLAUDE.md — Agent Guide for KMO Landing Page

Last updated: 2026-07-15

---

## Project Overview

This repo is the landing catalog for **KMO RACK BAR CUSTOM**.

It is not the production transaction system.

The landing repo owns:

- `index.html`
- `app.js`
- `styles.css`
- `assets/product_catalog_template.csv`
- catalog/search/cart/mobile UX

The production repo owns:

- `booking.html`
- `calendar.html`
- `CustomerOrder.html`
- Supabase/dashboard/transaction flows

---

## Repo Map

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

## Current Architecture

| Layer | Implementation |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Catalog source | `assets/product_catalog_template.csv` |
| Cart | Browser localStorage |
| Booking/order destination | Production GitHub Pages repo |
| Hosting | GitHub Pages |

Current CSV columns:

`id,brand,model,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`

Current product count: 195

---

## Current User-Facing Behavior

- Catalog starts with 24 products
- `ดูเพิ่มเติม` loads 24 more products each click
- Search includes brand, model, product name, description, and category
- `allow_booking=TRUE` shows `นัดคิวคัสตอมงาน`
- `allow_order=TRUE` shows `สั่งตรงกับร้าน`
- `shopee_url` shows `ซื้อผ่าน Shopee`
- Shopee is additive; it does not replace direct order
- If cart items share the same brand/model, landing sends those fields to production forms
- Current script cache ref: `app.js?v=11.4`

---

## Design Direction

Use the industrial KMO direction from `DESIGN_BRIEF.md`:

- black / dark surfaces
- safety yellow accents
- practical workshop/touring tone
- Kanit/Sarabun typography in the current implementation
- avoid Thai tone-mark clipping by checking line-height on mobile

Do not rename JS-bound IDs/classes from `DESIGN_BRIEF.md`.

Additional JS-bound IDs added after the brief:

- `#catalog-load-more`
- `#catalog-count`
- `#catalog-load-more-btn`

---

## Important Gate Before Editing

Before changing code:

1. Confirm path is `D:\AI-Workspace\projects\kmo-landing-page\`
2. Confirm remote is `Gutumrod/kmo-landing-page`
3. Run/check `git status --short`
4. Fetch before larger work: `git fetch --all --prune`
5. If touching production forms, switch to production repo and verify its remote
6. Do not commit untracked `AGENTS.md` or `CODEX_HANDOFF.md` unless the owner asks

---

## Current Completed Work

- Industrial design import
- Favicon
- Local CSV catalog
- Brand/model fields and production form prefill
- Structured cart metadata
- Booking/order split cart
- Direct order alongside Shopee
- Mobile nav/header fixes
- Catalog load-more
- Product booking label renamed to `นัดคิวคัสตอมงาน`

---

## Next Likely Work

1. Add `สินค้าขายดี` / featured products section
2. Finish product images/descriptions in CSV
3. Recheck mobile catalog density after product data is complete
4. Production hardening: upload/slip validation
5. Custom domain after content is ready

---

## Resource Paths

KMO assets on Google Drive:

`X:\My Drive\workspace\K-MO\`

Local agent handoff folder:

`D:\AI-Workspace\agents\codex\handoff\`

Primary docs:

- `PROJECT_CONTEXT.md`
- `implementation_plan.md`
- `PRD.md`
- `DESIGN_BRIEF.md`
