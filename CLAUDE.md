# CLAUDE.md — คู่มือนำทางสำหรับ Agent (KMO Landing Page)

> **สำหรับเอเจนต์ที่ทำงานบนเครื่อง Mac:** โปรดอ่านหน้านี้เพื่อสืบทอดบริบททั้งหมดของโปรเจกต์นี้

---

## 🏍️ ข้อมูลโปรเจกต์ (Project Overview)
โปรเจกต์นี้เป็นการพัฒนาหน้า Landing Page สำหรับร้าน **KMO RACK BAR CUSTOM** (ร้านทำแร็คท้าย แครชบาร์ และบริการติดตั้งมอเตอร์ไซค์) 

### ฟีเจอร์หลัก:
1. **Catalog สินค้า:** แสดงแร็คท้าย แร็คข้าง แครชบาร์ และบริการอื่นๆ
2. **Cart & Manual Checkout:** ลูกค้าเลือกของลงตะกร้า แสดงยอดรวม โชว์บัญชีธนาคาร/QR Code สำหรับโอนเงินแบบออฟไลน์ พร้อมปุ่มกดส่งสลิปแจ้งแอดมินทาง Line
3. **Queue Booking Calendar:** แสดงปฏิทินแสดงคิวงานที่ว่างต่อวัน และส่งแบบฟอร์มจองคิวออนไลน์

---

## 📁 ทรัพยากรและตำแหน่งไฟล์ (Resources & Paths)

### คลังทรัพยากรร้าน KMO ใน Google Drive:
- **Windows Path:** `X:\My Drive\workspace\K-MO\`
- **Mac Path (คาดการณ์):** `~/Library/CloudStorage/GoogleDrive-titazmth@gmail.com/My Drive/workspace/K-MO/` หรือ `/Volumes/GoogleDrive/My Drive/workspace/K-MO/` (โปรดใช้คำสั่งค้นหาไดเรกทอรีจริงบนเครื่อง Mac เพื่ออัปเดต)
- **ไฟล์สำคัญใน Drive:**
  - รูปภาพสินค้าสำหรับนำมาใช้: `ลง Online/`
  - ตัวอย่างโค้ดระบบจองคิวเดิม (Apps Script & HTML): `KMO-Booking-System/project1_booking/`

---

## 🛠️ สถาปัตยกรรมระบบ (Tech Stack)
- **Frontend:** HTML5, Vanilla CSS3 (Custom responsive styling), Vanilla JavaScript
- **Database/Calendar:** Google Sheets และ Google Calendar ทำงานผ่าน API ของ Google Apps Script (Web App)
- **Hosting:** GitHub Pages

---

## 📝 แนวทางการเขียนโค้ดและดีไซน์ (Design & Code Guidelines)
- **Theme:** Premium Dark Theme (สีดำ/เทาเข้ม ตัดด้วยสีทอง/เหลืองเข้ม `#e8b84b`) เพื่อให้ดูหรูหรา น่าเชื่อถือ สไตล์งานคัสตอมคุณภาพสูง
- **Typography:** ใช้ฟอนต์ **Kanit** สำหรับหัวข้อ และ **Sarabun** สำหรับเนื้อหาทั่วไป
- **วรรณยุกต์จม (Thai Font Bug):** ระวังปัญหาฟอนต์ไทยที่มีสระวรรณยุกต์ซ้อนทับกัน ตรวจสอบ CSS `line-height`, `font-family` เสมอ เพื่อให้การแสดงผลลื่นไหลและวรรณยุกต์ไม่หาย/ไม่ลอยจม
- **Keep it Clean & Simple:** ทำงานโดยไม่ Over-engineer เน้นประสิทธิภาพความเร็วในการโหลด และเสร็จสมบูรณ์รันได้จริง 100%

---

## 📋 เอกสารอ้างอิง
- [PRD.md](file:///D:/AI-Workspace/projects/landing%20page/KMO/PRD.md) — รายละเอียดระบบและขอบเขตงานทั้งหมด
- [PROJECT_CONTEXT.md](file:///D:/AI-Workspace/projects/landing%20page/KMO/PROJECT_CONTEXT.md) — สถานะ ความคืบหน้า และสิ่งที่ต้องทำถัดไป
