# PRD: KMO RACK BAR CUSTOM - Landing Page & Booking System

**Project Owner:** คุณฟรี (CEO / Project Owner)  
**Project Orchestrator:** Antigravity Agent  
**Execution Engine:** OpenClaw (Multi-model Pipeline)  
**Created:** 2026-07-07  
**Last Updated:** 2026-07-07

---

## 1. Objective

**ปัญหาที่ต้องการแก้:**
- ลูกค้าของร้าน **KMO RACK BAR CUSTOM** ที่ต้องการสั่งทำหรือติดตั้งแร็คท้าย แครชบาร์ หรือแร็คข้าง ต้องติดต่อสื่อสารผ่านทางแชท (Line/Facebook) เป็นหลัก ทำให้การดูรายการสินค้า การประเมินราคา การเช็คคิวงาน และการบันทึกข้อมูลตกหล่นและล่าช้า
- ปัจจุบันยังไม่มีหน้ารวมศูนย์สินค้า (Catalog) และระบบเช็คคิวงานติดตั้งที่เป็นมิตรต่อผู้ใช้งาน (User-Friendly) ส่งผลให้ร้านเสียโอกาสในการขายและเสียเวลาในการตอบคำถามคิวงานซ้ำๆ

**เป้าหมาย:**
- สร้าง **Landing Page** ที่ดูพรีเมียม สวยงาม รวดเร็ว และเป็นมิตรต่ออุปกรณ์มือถือ (Mobile-Responsive) สำหรับร้าน KMO
- มีแคตตาล็อกแสดงสินค้าพร้อมภาพถ่ายที่แบ่งตามหมวดหมู่ชัดเจน (แร็คท้าย, แร็คข้าง, แครชบาร์ ฯลฯ)
- มีระบบ **Cart & Manual Checkout** ที่ให้ลูกค้าเลือกสินค้า สรุปรายการคำสั่งซื้อ พร้อมแสดง QR Code บัญชีธนาคารสำหรับโอนเงินและช่องทางติดต่อส่งสลิปหลักฐาน
- มีหน้า **Interactive Booking Calendar** เชื่อมต่อกับระบบ Google Calendar/Google Sheets (ผ่าน Apps Script) เพื่อให้ลูกค้าเช็คจำนวนคิวที่ยังว่างในแต่ละวัน และส่งจองคิวออนไลน์ด้วยฟอร์มที่สะอาดและเข้าใจง่าย

**ขอบเขต:**
- **อยู่ใน Scope:**
  - **Premium Dark-Theme UI/UX:** ออกแบบหน้าเว็บสไตล์โมเดิร์น โทนสีทอง/เหลืองเข้มตัดกับสีดำ-เทาเข้ม ตามแบรนด์ KMO ใช้ฟอนต์ Kanit/Sarabun วรรณยุกต์ไม่จม
  - **Product Showcase & Catalog:** แสดงรายละเอียดสินค้า ราคา และรูปภาพสินค้า แยกหมวดหมู่แร็คท้าย แครชบาร์ แร็คข้าง และบริการเสริม
  - **Local Cart System:** ระบบตะกร้าสินค้าชั่วคราวบนเบราว์เซอร์ (Local Storage) เพื่อกดสั่งซื้อหลายรายการได้
  - **Manual Checkout Flow:** สรุปยอดรวมสินค้า แสดงเลขบัญชี/QR Code สำหรับการชำระเงินแบบโอนเงิน พร้อมปุ่มลิงก์ด่วนสำหรับแจ้งแอดมินทาง Line หรือแชทแพลตฟอร์ม
  - **Booking Calendar & Intake Form:** ดึงข้อมูลปฏิทินคิวว่างรายวันจาก Google Calendar API (ผ่าน Apps Script `doGet`) และส่งข้อมูลจองคิวกลับไปบันทึกที่ Google Sheet (ผ่าน Apps Script `doPost`)
- **ไม่อยู่ใน Scope (Out of Scope):**
  - ระบบตัดบัตรเครดิต หรือระบบชำระเงินอัตโนมัติ (Payment Gateway Integration)
  - ระบบสมัครสมาชิกของลูกค้า (User Authentication)
  - ระบบควบคุมสต็อกสินค้าและระบบหลังบ้านบริหารงานคลังขั้นสูง (Inventory Management)

---

## 2. Full System Architecture

### Communication Flow
```
CEO (Telegram) → Antigravity (Manager) → Mailbox → OpenClaw (Worker) → Antigravity → CEO
```

### Component Stack

| Component | Technology |
|-----------|------------|
| Management | Antigravity Agent (Python / Global config) |
| Execution | OpenClaw (Node.js) |
| Tool Pool | Gemini 3.5 Flash (Medium), Custom Skills |
| Data Store | Google Sheets (ฐานข้อมูลคิว), LocalStorage (ตะกร้าสินค้าชั่วคราว) |
| Frontend | Vanilla HTML5, Vanilla CSS3 (Custom Grid, CSS Variables), Vanilla JS |
| Infrastructure | Google Apps Script (Web App endpoints), GitHub Pages |

---

## 3. Mailbox Structure & Protocol (v2)

**Path:** `D:\AI-Workspace\mailbox\`

| Folder | หน้าที่ |
|--------|--------|
| `inbox/hermes/` | งานของ Hermes / Antigravity (รอทำ) |
| `inbox/openclaw/` | งานของ OpenClaw (รอทำ) |
| `results/hermes/` | ผลลัพธ์ Hermes / Antigravity (เฉพาะสำเร็จ) |
| `results/openclaw/` | ผลลัพธ์ OpenClaw (เฉพาะสำเร็จ) |
| `errors/hermes/` | งาน Hermes / Antigravity ที่ Failed |
| `errors/openclaw/` | งาน OpenClaw ที่ Failed |
| `archive/` | งานเก่า (cleanup) |

### Task Format (v2)

```json
{
  "task_id": "task_20260707_182500_kmo_landing",
  "title": "สร้างหน้า Landing Page KMO RACK BAR CUSTOM",
  "assigned_to": "OpenClaw",
  "type": "generic",
  "status": "pending",
  "message": "สร้างหน้า Landing Page สำหรับร้าน KMO ตามรายละเอียด PRD",
  "created_at": "2026-07-07T18:25:00+07:00",
  "claimed_at": null,
  "completed_at": null,
  "deadline": "2026-07-07T21:00:00+07:00",
  "source": "CEO",
  "priority": "high",
  "timeout_minutes": 30,
  "model": "gemini-3.5-flash",
  "deliverables": [],
  "context": "",
  "inputs": {},
  "expected_outputs": {},
  "on_success": {
    "action": "notify_ceo",
    "next_task": null
  }
}
```

---

## 4. Detailed Implementation Steps

### Phase 1: Setup & Design Blueprint (โครงสร้างพื้นฐานและการออกแบบ)
- [ ] สรุปโทนสี พาเลทสี แบบอักษร (Design Tokens) ลงใน `styles.css`
- [ ] คัดลอกและสร้างโครงสร้างโฟลเดอร์สำหรับพัฒนาโค้ดจริงใน `D:\AI-Workspace\projects\landing page\KMO`
- [ ] ออกแบบโมเดลจำลองรูปภาพสินค้า หรือคัดลอกไฟล์รูปจาก Google Drive (`X:\My Drive\workspace\K-MO\รูปสินค้า`) มาเตรียมใช้งานในโปรเจกต์

### Phase 2: Page Implementation & Frontend (หน้าตาเว็บและระบบตระกร้า)
- [ ] พัฒนา HTML โครงสร้างหลัก (Header, Hero Section, Catalog, Cart, Booking Section, Footer)
- [ ] พัฒนา CSS สำหรับ Layout, Grid, Responsive Design และ Micro-animations ที่น่าดึงดูด
- [ ] พัฒนา JavaScript จัดการ Catalog สไลด์โชว์สินค้า และระบบการเลือกสินค้าใส่ตะกร้า (Cart logic)
- [ ] พัฒนาขั้นตอนการสั่งจองและ Checkout แบบ Manual พร้อมกล่องข้อความโอนเงินและช่องทางส่งใบเสร็จ

### Phase 3: Booking Calendar Integration (เชื่อมต่อระบบจองคิว)
- [ ] พัฒนาหน้า Calendar Widget ในตัว Landing Page เพื่อแสดงคิวงาน
- [ ] เชื่อมต่อ API `doGet` จาก Google Apps Script เพื่อดึงปริมาณคิวในแต่ละวันมาแสดงผลแบบ Interactive (แสดงวันเต็ม/วันว่าง)
- [ ] เชื่อมต่อ API `doPost` จากฟอร์มกรอกข้อมูลลูกค้าแะลการนัดหมายเพื่อบันทึกลง Google Sheet
- [ ] ทดสอบระบบส่งคิวและเช็คความถูกต้องบนปฏิทิน Google Calendar

### Phase 4: Quality Assurance & Deployment (ตรวจสอบคุณภาพและการติดตั้ง)
- [ ] ตรวจสอบความถูกต้องของสระภาษาไทยและวรรณยุกต์จม
- [ ] ทดสอบความเร็วและ Performance บนโทรศัพท์มือถือและอุปกรณ์หน้าจอขนาดต่างๆ
- [ ] สร้างคู่มือการนำระบบขึ้นติดตั้ง (Deployment SOP) บน GitHub Pages

---

## 5. Success Criteria

- [ ] หน้าเว็บโหลดได้เร็ว (ในระยะเวลาต่ำกว่า 2 วินาทีบนเครือข่ายมือถือ 4G/5G)
- [ ] หน้าตาของเว็บต้องเป็นแบบ Premium Dark-Theme ที่ดูแพง สมกับเป็นร้าน Custom มืออาชีพ
- [ ] ระบบสั่งซื้อ (Cart) และปฏิทินจองคิวสามารถตอบสนองและส่งข้อมูลไปถึงปลายทางของ Google Sheet ได้สำเร็จ
- [ ] การแสดงผลภาษาไทยถูกต้อง 100% ไม่มีปัญหาวรรณยุกต์ซ้อนหรือจมลงใต้ฐานอักษร

---

## 6. Risks & Mitigation

| ความเสี่ยง | ผลกระทบ | วิธีแก้ |
|-----------|----------|----------|
| ปริมาณการเรียกดูปฏิทินสะสมสูงเกินลิมิตโควตาของ Apps Script | หน้าจองคิวปฏิทินอาจไม่แสดงผลชั่วคราว | ทำระบบ Cache ใน LocalStorage หรือแจ้งเตือนให้ติดต่อจองคิวทางแชทสำรองเมื่อ API ล่ม |
| ภาพถ่ายจากไฟล์ดิบมีขนาดใหญ่เกินไปทำให้เว็บโหลดช้า | หน้าเว็บช้าและเกิด UX แย่สำหรับผู้ใช้ | นำไฟล์ภาพไปทำการบีบอัดเป็นสกุล `.webp` ที่มีขนาดเบาแต่คุณภาพสูงก่อนนำขึ้นโฮสต์จริง |
| ข้อมูลใน Google Sheet อาจรั่วไหลหากลูกค้าเดา URL ของ Apps Script | ความเป็นส่วนตัวของลูกค้าถูกเปิดเผย | กำหนดให้ฟังก์ชัน `doGet` คืนค่าเฉพาะจำนวนยอดจองสะสมต่อวัน (จำนวนตัวเลข 1, 2, 3) โดยไม่มีการส่งชื่อ/เบอร์โทรลูกค้าออกมาเด็ดขาด |

---

## 7. Related Documents

- `PROJECT_CONTEXT.md` — บันทึกความคืบหน้าการพัฒนาโปรเจกต์
- `D:\AI-Workspace\mailbox\` — ประวัติงานรับและส่งมอบ
- `X:\My Drive\workspace\K-MO\` — โฟลเดอร์เก็บทรัพยากร รูปภาพ และไฟล์งานจาก Google Drive

---

**สถานะ:** Draft  
**Priority:** High
