# CODEX_TASK.md — Archived Phase D1 Brief

**Status:** Done / archived
**Last updated:** 2026-07-15

This file originally briefed Phase D1: sending cart data from `kmo-landing-page` to production `booking.html`.

The task is now complete and no longer represents current pending work.

---

## Completed Outcome

Landing repo:

`D:\AI-Workspace\projects\kmo-landing-page\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmo-landing-page/` (Mac)

Production repo:

`D:\AI-Workspace\projects\kmorackbarcustom.github.io\` (Windows) / `/Users/wachirayachankhonkan/AI-Workspace/projects/kmorackbarcustom.github.io/` (Mac)

D1 behavior completed:

- Booking cart sends `services` and `note` query params to production `booking.html`
- Order cart sends `products` and `other_text` query params to production `CustomerOrder.html`
- Production forms still work normally when opened without query params

Later additions also completed:

- Landing sends structured `cart_meta`
- Landing sends `estimated_total`
- Landing sends `source_page`
- Landing sends shared `brand/model` prefill when cart items match one vehicle
- Production repo supports the added metadata/prefill behavior

---

## Important Commits

Landing:

- `d4d0961 feat: pass structured cart metadata`
- `7339be3 feat: add brand model catalog fields`

Production:

- `44cae9e feat: prefill booking services from query`
- `d746ca3 feat: prefill customer order from query`
- `963ffb3 feat: store landing cart metadata`
- `bf1b4e1 feat: prefill vehicle from landing catalog`

---

## Current Source Of Truth

Use these files instead of this archived task brief:

- `PROJECT_CONTEXT.md`
- `implementation_plan.md`
- `PRD.md`
- `CODEX_HANDOFF.md` if present locally

---

## Gate Reminder

Before future edits:

1. Confirm landing repo remote is `Gutumrod/kmo-landing-page`
2. Confirm production repo remote is `kmorackbarcustom/kmorackbarcustom.github.io` before touching transaction files
3. Do not edit stale clone `D:\AI-Workspace\projects\landing page\KMO\` (Windows-only, not present on Mac — do not recreate it there)
