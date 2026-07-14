# Project Context: KMO RACK BAR CUSTOM - Landing Page & Booking System

**Last Updated:** 2026-07-14
**Current Phase:** Phase D1 prefill complete locally (booking + order)
**Progress:** ~95% (ตะกร้า booking/order ส่งรายการ+ราคาอ้างอิงไปพรีฟิล production forms แล้ว)
**Next Session:** CEO/Commander review local commits แล้วค่อยตัดสินใจ push/deploy production

---

## 🎯 เป้าหมายโปรเจกต์ (ยืนยันแล้ว 2026-07-10 — สำคัญ อ่านก่อนแก้อะไร)

**โปรเจกต์นี้ไม่ได้มาแทน production (`kmorackbarcustom.github.io`)** เป็นช่องทางขายตรงแยกต่างหาก
เป้าหมายหลัก: สร้างช่องขายของร้านเองที่ไม่โดนหักค่าคอมจากแพลตฟอร์ม (Shopee หักเกือบ 30%/ชิ้น)
ลูกค้าเห็นแคตตาล็อกสวยๆ แบบ Shopee, กดสั่ง/จอง, จ่ายมัดจำ, จบ — ลดเวลาคุยไปมากับร้าน

**โครงสร้าง**: สินค้าแต่ละชิ้นมี 2 ปุ่มอิสระต่อกัน
- **จองคิว (booking)** — ลูกค้าเอารถเข้ามาคัสตอมที่ร้านจริง → ลิงก์ออกไป production
  (`https://kmorackbarcustom.github.io/booking.html`, `/calendar.html`)
- **สั่งซื้อ (order)** — 2 ทางเลือกในตัว: (1) สั่งตรงกับร้าน (กรอกข้อมูล+มัดจำ+เลือกส่ง/มารับเอง)
  ผ่าน `CustomerOrder.html` บน production, หรือ (2) ลิงก์ไป Shopee เดิม (ไม่ทิ้งเพราะลูกค้าบางคนติดแพลตฟอร์ม)

**หลักการสำคัญ**: kmo-landing-page **ไม่ maintain ไฟล์ booking/calendar/order ของตัวเอง**
ทุกอย่างที่เป็น transaction จริง (จอง/สั่งซื้อ) ต้องลิงก์ออกไป production ที่เดียว —
กันปัญหาไฟล์หลุด sync (เคยเกิดมาแล้ว 2026-07-10: booking.html/calendar.html ในนี้ตกรุ่นไม่มี
capacity model ใหม่ที่แก้ที่ production) โปรเจกต์นี้โฟกัสแค่ **แคตตาล็อก + ตะกร้า + UX หน้าแรก**

---

## 🎯 สถานะปัจจุบัน

### เสร็จแล้ว (Completed)
| Phase | Tasks | เสร็จเมื่อ | หมายเหตุ |
|-------|-------|-----------|----------|
| Phase 1-4 | โครงหน้าเว็บ, catalog, cart, dark theme, dual CTA | 2026-07-07~09 | ดูรายละเอียดเดิมด้านล่าง (ประวัติก่อนหน้า) |
| Phase 5 | Discovery interview เป้าหมายโปรเจกต์ใหม่ | 2026-07-10 | พบว่าเข้าใจสโคปผิดมาตลอด (คิดว่าจะมาแทน production) แก้ความเข้าใจแล้ว |
| Phase 5 | ลบ `booking.html`/`calendar.html` ที่ตกรุ่น เปลี่ยนเป็นลิงก์ออก production | 2026-07-10 | commit `c1c2523` push แล้ว |
| Phase 0 | Repo/file gate สำหรับงาน landing page | 2026-07-11 | ยืนยันทำงานที่ `D:\AI-Workspace\projects\kmo-landing-page\`, remote `Gutumrod/kmo-landing-page`, ไม่แตะ clone เก่า/production repo |
| Phase A | ต่อ Google Sheets CSV จริงเข้า catalog | 2026-07-11 | `app.js` ใช้ CSV export URL จริงแล้ว และยัง fallback ไป `FALLBACK_PRODUCTS` 7 ชิ้นเมื่อ fetch fail |
| Phase E | ปิด XSS จาก field สินค้าใน catalog/cart render | 2026-07-11 | เปลี่ยน render path สำคัญจาก `innerHTML` เป็น DOM + `textContent`, guard dangerous URL protocol และ loader เก่าที่ไม่มี element แล้ว |
| Phase B | ช่องค้นหา + fallback ปรึกษาแอดมิน | 2026-07-11 | เพิ่ม search input เหนือ filter เดิม, filter แบบ AND กับหมวดหมู่, และแสดง LINE/Facebook fallback เมื่อไม่พบสินค้า |
| Phase C | ตะกร้าแบ่ง 2 กลุ่ม | 2026-07-11 | cart item มี `type` booking/order, ปุ่มสั่งผลิตกับร้านเข้าตะกร้า order, Shopee ยังลิงก์ตรง, checkout แยกไป booking/CustomerOrder |
| Category taxonomy | ขยายหมวดสินค้าเป็น 6 กลุ่ม | 2026-07-11 | ยกเลิก `other`, เพิ่ม `accessory`/`gear`/`service`, ย้าย fallback ไฟสปอร์ตไลท์ไป `gear` และบริการติดตั้งไป `service` |
| Mobile layout | แก้ hero text + product grid บนมือถือ | 2026-07-12 | hero title ลดขนาด/เพิ่ม line-height บนมือถือ, product grid บังคับ 2 คอลัมน์บนจอแคบ และคืน layout desktop ที่ 768px |
| Phase D1 | ส่งข้อมูลตะกร้าไปพรีฟิล booking form | 2026-07-13 | landing ส่ง `services`/`note` จาก booking cart ผ่าน query string, production `booking.html` อ่านมาเติมช่องรายการและแสดงราคาอ้างอิงเป็นข้อความ |
| Phase D1 | ส่งข้อมูลตะกร้าไปพรีฟิล CustomerOrder form | 2026-07-14 | landing ส่ง `products`/`other_text` จาก order cart ผ่าน query string, production `CustomerOrder.html` อ่านมาเลือกสินค้าและแนบราคาอ้างอิงเป็น note โดยไม่แตะ DB/RPC |

### กำลังทำ (In Progress)
| Phase | Tasks | เริ่มเมื่อ | คาดว่าเสร็จ |
|-------|-------|----------|-------------|

### ยังไม่ได้ทำ (Pending — เรียงตามที่คุยไว้)
| Task | Priority | หมายเหตุ |
|------|----------|----------|
| Validate ไฟล์อัปโหลด (สลิป) ฝั่ง server ไม่ใช่แค่ client JS | Medium | มาจากรีวิวความปลอดภัยรอบแรก |
| ราคาจริงใน DB/RPC/dashboard (D2) | Medium | Scope ใหญ่กว่า D1 ต้องวางแผนแยกรอบหลัง D1 พิสูจน์แล้ว |

---

## 📝 Last Session Summary

**Session Date:** 2026-07-10 (ช่วงบ่าย-เย็น)
**Model Used:** Claude Sonnet 5

### ทำอะไรเสร็จไปบ้าง
- ✅ รีวิวความปลอดภัยรอบแรก พบช่องโหว่ใหญ่ในระบบที่ยืมมา (RLS เปิดโล่งบน Supabase) — แก้ที่ต้นทาง (production repo) ไม่ใช่ในนี้ เพราะเป็น backend ร่วมกัน
- ✅ ทำ Discovery Interview เป้าหมายโปรเจกต์ (5 หัวข้อตามสกิล `discovery-interview`) — ทำถึงหัวข้อ 3 ครบ, หัวข้อ 4-5 เริ่มแล้วแต่ยังไม่จบ
- ✅ พบว่า `CustomerOrder.html` (production) ทำงานสมบูรณ์แล้วจริง ไม่ใช่ mockup อย่างที่เข้าใจตอนแรก (mockup คือแค่รายการสินค้าหน้าแรกที่รอ CSV จริง)
- ✅ พบ gap สำคัญ: ตะกร้าที่มีราคาจริงเชื่อมแค่ booking.html เท่านั้น ไม่เชื่อมกับ CustomerOrder.html เลย — ตกลงแนวทางแก้แล้ว (ดูด้านล่าง)
- ✅ ลบ `booking.html`/`calendar.html` ที่ตกรุ่น เปลี่ยนปุ่มในหน้าแรก+ตะกร้าให้ลิงก์ออกไป production ตรงๆ (commit `c1c2523`, pushed)

### เจอปัญหาอะไร
- เข้าใจผิดมาตลอดว่าโปรเจกต์นี้จะ "แทน" production — จริงๆ แค่เป็นหน้าร้านแคตตาล็อกที่ยิงปุ่มออกไปหา production
- `booking.html`/`calendar.html` ที่ copy มาไว้ในนี้ตกรุ่น ไม่มี capacity model 2 พูลที่เพิ่งแก้ที่ production — สาเหตุคือ maintain ไฟล์ซ้ำ 2 ที่

### บทเรียนที่ได้
- 💡 โปรเจกต์ที่ "ยืม" ฟีเจอร์จากระบบอื่น ควร**ลิงก์ออก ไม่ copy ไฟล์มาไว้เอง** กันปัญหาหลุด sync ตั้งแต่แรก — ใช้หลักการนี้กับปุ่มออเดอร์อยู่แล้ว (ลิงก์ไป CustomerOrder.html) แต่ตอน booking/calendar ไม่ได้ทำแบบเดียวกันตั้งแต่ต้น

---

## 🚀 Next Steps

### ต้องทำอะไรต่อ (ลำดับความสำคัญ)
1. CEO/Commander review local D1 commits แล้วค่อยตัดสินใจ push/deploy production
2. ปิดช่องโหว่ upload validation ฝั่ง server ใน production repo แยกรอบ ไม่ใช่ scope ของ landing page รอบนี้
3. วาง Phase D2 แยกรอบเมื่อ D1 ใช้งานจริงแล้ว: ราคาจริงใน DB/RPC/dashboard

---

## ❓ Open Questions / Decisions Needed

| คำถาม | สถานะ | รายละเอียด |
|-------|-------|-----------|
| ตะกร้าแบ่ง 2 กลุ่มยังไง เวลามีทั้งสินค้าสั่งซื้อ+จองคิวปนกัน | ✅ ตกลงแล้ว | แบ่งเป็น 2 ส่วนในตะกร้าเดียว แต่ละส่วนมียอดรวม+ปุ่มเช็คเอาต์แยกกัน (ไปคนละหน้า production) ไม่พยายามยัดรวม flow เดียว |
| มัดจำ/ราคาที่ลูกค้าเห็นตอนสั่งซื้อ มาจากตะกร้าหรือคุยทีหลังทาง LINE | ✅ ตกลงแนว D1 แล้ว | รอบแรกส่งเป็น note ผ่าน URL param ไป production form เท่านั้น ยังไม่คำนวณราคาใน DB |
| CSV ต้องมีคอลัมน์อะไรบ้างให้ตรงกับที่ `parseCSV()` ใน app.js รองรับ | ✅ ตกลงแล้ว | ใช้ `id,name,price,category,description,image_url,shopee_url,allow_booking,allow_order`; category ใช้ `rear`/`side`/`crashbar`/`accessory`/`gear`/`service` |

---

## 📁 ไฟล์สำคัญในโปรเจกต์

| ไฟล์ | หน้าที่ |
|------|--------|
| PRD.md | Master blueprint เดิม (อาจต้อง revise ตามเป้าหมายที่ชัดเจนขึ้นรอบนี้) |
| PROJECT_CONTEXT.md | ไฟล์นี้ — ความคืบหน้าล่าสุด |
| index.html + app.js + styles.css | หน้าแรก, catalog, cart — **นี่คือขอบเขตจริงของโปรเจกต์นี้** |
| ~~booking.html~~ / ~~calendar.html~~ | **ลบแล้ว** ลิงก์ออกไป production แทน |

---

## 📞 Contact & Roles

| บทบาท | ใคร | ติดต่อ |
|-------|-----|--------|
| CEO / Project Owner | คุณฟรี | Telegram: @craftbikelabceo |
| Commander | Claude | - |

---

**Template Version:** 1.1
**Last Edited By:** Claude Sonnet 5
