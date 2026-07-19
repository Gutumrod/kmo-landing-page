# KMO Landing Page — ตารางพัฒนารายวัน

**สร้าง:** 2026-07-19 | **ทีม:** Claude (spec/review) + Codex (build) + CEO (ตัดสินใจ/ถ่ายรูป/ข้อมูล)

สถานะทำเครื่องหมาย: `[ ]` ยังไม่ทำ / `[x]` เสร็จแล้ว — อัปเดตในไฟล์นี้เมื่อจบแต่ละวัน

อ้างอิงแผนเต็ม: `COMMANDER_PLAN.md`

---

## Day 1 — เช็ค products-proxy ให้จบ (ปลดล็อกทุก phase ถัดไป)
- [ ] (Claude/Codex) clone/เปิด production repo (`kmorackbarcustom.github.io`) เช็คว่า edge function `products-proxy` deploy จริงกับ project `ybyseaenceyswjnwdmdf` แล้วหรือยัง
- [ ] (Claude/Codex) ทดสอบ `admin-products.html` เพิ่ม/แก้สินค้า 1 รายการจริง ยืนยันเขียนเข้า Supabase ได้จบ end-to-end
- [ ] ถ้ายังไม่จบ: สเปก/แก้ proxy ให้ทำงานได้ก่อน ค่อยไป Day 2

> ถ้า Day 1 ติด ห้ามข้ามไปทำ Day 2/3 เพราะทั้งสอง phase ต้องพึ่งช่องเขียนข้อมูลนี้

## Day 2 — Featured products (data-only)
- [ ] (CEO) เลือกสินค้าเบสท์เซลเลอร์จาก 195 รายการ (ไม่ต้องเยอะ เริ่ม 5-10 ตัวก่อนได้)
- [ ] (CEO ผ่าน admin-products.html) ติ๊ก `featured=TRUE` ให้สินค้าที่เลือก
- [ ] (Claude) เช็คหน้าเว็บจริงว่า section `สินค้าขายดี` โผล่และแสดงถูกต้อง

## Day 3-7 — รูปสินค้าจริง (ช่องว่างใหญ่สุด)
- [ ] (CEO) ถ่าย/หารูปจริงต่อสินค้า หรือต่อกลุ่มสินค้าที่หน้าตาเหมือนกัน (ไม่ต้องครบ 195 ทีเดียว เริ่มจากสินค้าที่ขายดี/featured ก่อน)
- [ ] (CEO ผ่าน admin-products.html) อัปโหลด/อัปเดต `image_url` ทีละสินค้า
- [ ] (Claude) สุ่มเช็คหน้าเว็บว่ารูปที่อัปเดตขึ้นจริง ไม่ค้าง cache

> งานนี้เป็นคอขวดที่สุด เพราะเป็นงานถ่ายภาพ/เนื้อหา ไม่ใช่งานโค้ด ปริมาณวันจริงขึ้นกับ CEO มีเวลาว่างแค่ไหน

## Day 8 — Mobile density pass (ทำหลังมีเนื้อหาจริงแล้วเท่านั้น)
- [ ] (Claude) เช็ค spacing/card density บนมือถือ ด้วยรูปจริง+featured badge ที่ลงแล้ว (เช็คตอนยังเป็น placeholder ไม่มีประโยชน์)
- [ ] (Codex) แก้ CSS ตามที่เจอ ถ้ามี

## ค้างไว้ก่อน (ไม่ใช่ตอนนี้)
- Custom domain — รอ content/รูปจบก่อนตามที่ตกลงไว้เดิม
- booking.html/calendar.html/CustomerOrder.html/dashboard — อยู่ repo production คนละที่ ไม่ใช่สโคปที่นี่

---

**หมายเหตุ:** ต่างจาก CraftBikeLab ตรงที่งานหลักของ repo นี้ (Day 2 เป็นต้นไป) เป็นงาน data-entry/ถ่ายภาพของ CEO เอง ไม่ใช่งาน build ของ Codex เป็นหลัก — จังหวะจริงจึงขึ้นกับ CEO ว่าง ไม่ใช่ขึ้นกับความเร็วเขียนโค้ด
