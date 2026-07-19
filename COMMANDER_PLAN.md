# Commander Plan — kmo-landing-page

Written by: Claude (Commander), Mac session, 2026-07-18
Status: planning only — no implementation done in this pass

Scope reminder (repo's own `CLAUDE.md`/`PROJECT_CONTEXT.md`): this repo owns catalog/cart/UX only.
It must never maintain `booking.html`/`calendar.html`/`CustomerOrder.html` — those belong to the
production repo (`kmorackbarcustom/kmorackbarcustom.github.io`), not cloned on this machine yet.
Anything below that touches product data-entry tooling likely lives in that other repo, not here —
flagged where relevant instead of assumed.

---

## Audit — actual current state (verified by reading code)

- `app.js` fetches products live from Supabase REST (`ybyseaenceyswjnwdmdf.supabase.co/rest/v1/products`) — **confirmed wired**, not still on CSV runtime (docs said "in progress", code shows it's actually done)
- `assets/product_catalog_template.csv` (196 lines incl. header) is now snapshot/seed only, per docs — consistent with what's in code
- **Featured products: all 195 rows are `FALSE`** in the CSV snapshot — nobody has marked a bestseller yet, matches docs exactly. Section exists in `index.html` (`#featured-products-section`, `hidden` by default) and will self-reveal once Supabase rows flip to `TRUE` — no frontend work needed here, purely a data-entry task
- **Product photos: not real yet.** Checked `image_url` values across the CSV — only 5 distinct files are referenced (`crashbar.jpg`, `rack-rear-adv.jpg`, `rack-side.jpg`, `service.jpg`, `spotlight.jpg`), reused as generic category placeholders across all 195 products. None are per-product real photos. This confirms the "เติมรูปจริง" pending item is not close to done — it's essentially not started at the per-product level
- `products-proxy` (the write-path edge function for staff to add/edit products) is **not referenced anywhere in this repo's `app.js`** — the write UI (`admin-products.html`) lives in the production repo, not here. Cannot confirm from this repo alone whether `products-proxy` has actually been deployed — that check belongs with the production repo, not this one

## Phase 1 — Mark featured products (data-only, zero code)

No code change needed — the UI already handles it. This is purely: pick which of the 195 products are bestsellers, flip `featured` to `TRUE` in the Supabase `products` table (via dashboard or once `admin-products.html`/`products-proxy` is confirmed working in the production repo). Blocked on someone (owner) actually deciding which products, not on engineering.

## Phase 2 — Real product photos (highest-effort, highest-value gap)

The catalog visually reads as "195 products" but only shows 5 recycled category images. This is the single biggest gap between "looks done" and "actually done" in this repo.
- Needs real photos per product (or per meaningful product group, not just per category) — this is data/content work (photography or sourcing), not code
- Once photos exist, `image_url` in the `products` table needs updating — same write-path question as Phase 1 (depends on `admin-products.html`/`products-proxy` in the production repo)

## Phase 3 — Confirm `products-proxy` deployment status (cross-repo check)

Update 2026-07-19 (PC session, repo now cloned locally): confirmed by reading source —
`products-proxy` (`kmorackbarcustom.github.io/supabase-hr/supabase/functions/products-proxy/index.ts`)
is a generic REST proxy: checks `x-staff-key` against `STAFF_PASSCODE` secret, then forwards to
`${SUPABASE_URL}/rest/v1/{path}` using the service-role key. `admin-products.html` wires create/edit/delete
through it correctly. Still open: never confirmed live against the actual deployed function (only read
source + client code) — a real add/edit/delete through the live page hasn't been run yet.

## Phase 3b — Add photo upload to `admin-products.html` (new, 2026-07-19)

Gap found: `image_url` in the admin form is a plain text box (path/URL you have to already have), there's
no file upload and no gallery — schema is one `image_url` column per product, one photo per product only.
CEO asked to move this to Day 1 priority since it's what actually unblocks Phase 2 (real photos) being easy
enough for non-technical day-to-day use.

Plan (approved before implementing):
1. Create a public Supabase Storage bucket (`product-images`) on the HR project (`ybyseaenceyswjnwdmdf`)
2. Extend `products-proxy` to also allow forwarding to `storage/v1/object/product-images/*` (same
   `x-staff-key` gate, same service-role forwarding pattern already used for `products` — no new auth model)
3. Add a file `<input type="file">` in `admin-products.html`; on change, upload the file through the proxy,
   get back the public object URL, and auto-fill it into `image_url`
4. Still one photo per product (schema unchanged) — multi-photo gallery is a separate, bigger ask, not in
   this pass unless CEO asks for it explicitly

## Phase 4 — Mobile density pass (low priority, per docs)

Docs note this as "still should check spacing/card density on mobile with real 195 products" — cosmetic, do after Phase 1/2 land since real content (photos, featured badges) will change what the density actually looks like. Not worth doing against placeholder images.

## Not in scope for this repo

- Anything touching `booking.html`/`calendar.html`/`CustomerOrder.html`/dashboards — production repo's job
- Custom domain — explicitly "pending until content/photos/domain is final" per docs, no action needed yet

---

## Recommended immediate next step

Phase 3 first, even though it's "just a check" — it determines whether Phase 1/2 are even actionable
right now, or blocked on production-repo work that hasn't shipped. Everything else is data entry that
depends on that answer.
