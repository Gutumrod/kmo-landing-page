# Product Photos Staging

Shared drop folder for raw product photos, synced between the Windows PC and this Mac via git (this repo).

**This folder is not used by the live site.** It's a shared workspace so photos taken/collected on either machine show up on the other. The actual product images are hosted in Supabase Storage (bucket `product-images`, HR project `ybyseaenceyswjnwdmdf`) and uploaded one at a time through `admin-products.html` in the production repo (`kmorackbarcustom.github.io`), which writes the resulting public URL into each product's `image_url` field.

## Workflow

1. Drop a photo here, named by product `id` from `assets/product_catalog_template.csv` (or the Supabase `products` table) — e.g. `137.jpg`. Add a short slug if it helps identify it: `137-giorno-rack.jpg`.
2. `git add` / commit / push from whichever machine has the new photo, then `git pull` on the other machine to see it.
3. When ready to publish a photo, open `admin-products.html`, find the product by id, use the file picker to upload the photo from this folder — it goes to Supabase Storage and `image_url` is auto-filled.
4. Once uploaded and confirmed live, the file can stay here as a backup or be deleted — it's not required for the site to keep working.

## Notes

- JPEG/PNG/WEBP only, 5MB limit (matches the Supabase Storage bucket's constraints).
- One photo per product (schema is still a single `image_url` column, no gallery yet).
- Keep filenames matched to product `id` so it's obvious which staged photo goes with which product.
