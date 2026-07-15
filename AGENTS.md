# AGENTS.md — คู่มือนำทางสำหรับ Agent (KMO Landing Page)

> **สำหรับเอเจนต์ที่ทำงานบนเครื่อง Mac:** โปรดอ่านหน้านี้เพื่อสืบทอดบริบททั้งหมดของโปรเจกต์นี้

---

## 🏍️ ข้อมูลโปรเจกต์ (Project Overview)
โปรเจกต์นี้เป็นการพัฒนาหน้า Landing Page สำหรับร้าน **KMO RACK BAR CUSTOM** (ร้านทำแร็คท้าย แครชบาร์ และบริการติดตั้งมอเตอร์ไซค์)

### ฟีเจอร์หลัก:
1. **Catalog สินค้า:** แสดงแร็คท้าย แร็คข้าง แครชบาร์ และบริการอื่นๆ จาก `assets/product_catalog_template.csv`
2. **Cart แยกงาน booking/order:** ลูกค้าเลือกสินค้าลงตะกร้า แยก `นัดคิวคัสตอมงาน` กับ `สั่งตรงกับร้าน` แล้วส่งข้อมูลไป production forms
3. **Production handoff:** งานจองคิว/สั่งซื้อจริงอยู่ที่ `kmorackbarcustom.github.io` ไม่ copy transaction forms มาไว้ใน repo นี้

---

## 📁 ทรัพยากรและตำแหน่งไฟล์ (Resources & Paths)

### คลังทรัพยากรร้าน KMO ใน Google Drive:
- **Windows Path:** `X:\My Drive\workspace\K-MO\`
- **Mac Path (คาดการณ์):** `~/Library/CloudStorage/GoogleDrive-titazmth@gmail.com/My Drive/workspace/K-MO/` หรือ `/Volumes/GoogleDrive/My Drive/workspace/K-MO/` (โปรดใช้คำสั่งค้นหาไดเรกทอรีจริงบนเครื่อง Mac เพื่ออัปเดต)
- **ไฟล์สำคัญใน Drive:**
  - รูปภาพสินค้าสำหรับนำมาใช้: `ลง Online/`
  - ตัวอย่างโค้ดระบบจองคิวเดิม (Apps Script & HTML): `KMO-Booking-System/project1_booking/`

### คลังข้อมูลความทรงจำสะสมเอเจนต์ (Antigravity Vault):
- **ข้อมูลส่วนตัวและการตั้งค่า:** ซิงค์ผ่าน Google Drive ที่โฟลเดอร์ `workspace/AI-Project/Vault/AGY-Vualt/`
- **Windows Path:** `D:\AI-Workspace\agents\antigravity\AGY-Vualt\` (ทำเป็น Junction Link ชี้ไปที่ `X:\My Drive\workspace\AI-Project\Vault\AGY-Vualt\`)
- **Mac Path (คาดการณ์):** `~/Library/CloudStorage/GoogleDrive-titazmth@gmail.com/My Drive/workspace/AI-Project/Vault/AGY-Vualt/` หรือ `/Volumes/GoogleDrive/My Drive/workspace/AI-Project/Vault/AGY-Vualt/`
- **คำแนะนำสำหรับ Mac Agent:** โปรดอ่านไฟล์ `00_START_HERE.md` และ `AI/Memory/User_Preferences.md` ในโฟลเดอร์นี้เพื่อเข้าใจบริบทและข้อกำหนดการสื่อสารของคุณฟรีทันที

---

## 🛠️ สถาปัตยกรรมระบบ (Tech Stack)
- **Frontend:** HTML5, Vanilla CSS3 (Custom responsive styling), Vanilla JavaScript
- **Catalog Data:** Local CSV ที่ `assets/product_catalog_template.csv`
- **Transactions:** ลิงก์ออกไป production repo `kmorackbarcustom.github.io` ซึ่งดูแล booking/order/Supabase flow
- **Hosting:** GitHub Pages

---

## 📝 แนวทางการเขียนโค้ดและดีไซน์ (Design & Code Guidelines)
- **Theme (เปลี่ยนทิศทาง 2026-07-11):** ย้ายจาก Premium gold theme (`#e8b84b`) เดิม → **Industrial/หน้างาน ดำ+เหลืองสด** (safety-yellow, ไม่ใช่ทองหรูหรา) ตามภาพอ้างอิงโปสเตอร์ KMO — ดู [DESIGN_BRIEF.md](DESIGN_BRIEF.md) สำหรับรายละเอียดเต็ม (สี/ตัวอักษร/แบนเนอร์ปาดแปรง/ลายทางเฉียง/กล่องไอคอน) และรายชื่อ id/class ที่ห้ามเปลี่ยนตอนปรับดีไซน์
- **Typography:** ใช้ฟอนต์ **Kanit** สำหรับหัวข้อ และ **Sarabun** สำหรับเนื้อหาทั่วไป (ยังคงใช้ต่อ เว้นแต่ DESIGN_BRIEF.md ระบุเปลี่ยน)
- **วรรณยุกต์จม (Thai Font Bug):** ระวังปัญหาฟอนต์ไทยที่มีสระวรรณยุกต์ซ้อนทับกัน ตรวจสอบ CSS `line-height`, `font-family` เสมอ เพื่อให้การแสดงผลลื่นไหลและวรรณยุกต์ไม่หาย/ไม่ลอยจม
- **Keep it Clean & Simple:** ทำงานโดยไม่ Over-engineer เน้นประสิทธิภาพความเร็วในการโหลด และเสร็จสมบูรณ์รันได้จริง 100%

---

## 📋 เอกสารอ้างอิง
- [PRD.md](file:///D:/AI-Workspace/projects/kmo-landing-page/PRD.md) — รายละเอียดระบบและขอบเขตงานทั้งหมด
- [PROJECT_CONTEXT.md](file:///D:/AI-Workspace/projects/kmo-landing-page/PROJECT_CONTEXT.md) — สถานะ ความคืบหน้า และสิ่งที่ต้องทำถัดไป
