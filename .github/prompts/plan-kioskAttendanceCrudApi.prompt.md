# Plan: Kiosk Attendance CRUD API

เพิ่มระบบบันทึก log การเช็คชื่อผ่านตู้เช็คบัตร โดยเป็นอิสระจากระบบครูเดิม (`SchoolAttendance`) ทุก event (แตะบัตรครั้งไหน ก็ได้ 1 row) พร้อมบันทึกรูปถ่ายหน้าตู้ ใช้ JWT admin role เดิม

---

## Steps

### 1. เพิ่ม Enum และ Model ใน `prisma/schema.prisma`

เพิ่ม enum ใหม่:

```
enum KioskEventType { CHECK_IN, CHECK_OUT }
```

เพิ่ม model `KioskAttendanceLog`:

- `id` — uuid PK
- `studentId` → relation to `Student`
- `eventType` — `KioskEventType`
- `eventTime` — `DateTime @default(now())`
- `photoPath` — `String?` (relative URL เก็บ path รูป เช่น `/uploads/kiosk/<studentId>/attendance/<file>`)
- `academicYearId` → relation to `AcademicYear`
- `termId` → relation to `Term`
- `createdAt`, `updatedAt`
- Index บน `[studentId, eventTime]` และ `[academicYearId, termId, eventTime]`

เพิ่ม back-relation บน `Student`, `AcademicYear`, `Term`

### 2. รัน Prisma migration

```bash
bunx prisma migrate dev --name add_kiosk_attendance
```

### 3. สร้าง Service: `src/v1/services/admin/kiosk-attendance.service.ts`

ฟังก์ชันที่ต้องมี:

- `createKioskAttendanceLog({ studentId, academicYearId, termId, photoPath? })` — validate ว่า student/academicYear/term มีอยู่จริง → **auto-detect `eventType`** โดยดู record ล่าสุดของ `studentId` ในวันเดียวกัน (timezone ของ server):
  - ไม่มี record → `CHECK_IN`
  - record ล่าสุดเป็น `CHECK_IN` → `CHECK_OUT`
  - record ล่าสุดเป็น `CHECK_OUT` → `CHECK_IN` (เข้าใหม่)
    → สร้าง record พร้อม `eventType` ที่คำนวณได้ และ return ทั้ง record + `eventType` ที่ใช้จริง
- `getKioskAttendanceLogs({ studentId?, date?, eventType?, academicYearId?, termId?, page, limit })` — filter + pagination
- `getKioskAttendanceLogById(id)` — get single + throw 404
- `updateKioskAttendanceLog(id, payload)` — partial update
- `deleteKioskAttendanceLog(id)` — ลบ record (+ ลบไฟล์รูปจาก disk ถ้า photoPath มีค่า)

### 4. สร้าง Controller: `src/v1/controllers/admin/kiosk-attendance.controller.ts`

ตามรูปแบบเดิม: แต่ละ controller รับ `ctx`, ดึง `body`/`params`/`query` → เรียก service → catch error → set `ctx.set.status`

endpoint หลัก:

- `tapKioskAttendanceController` — POST, รับ multipart: `studentId`, `academicYearId`, `termId`, `photo?` (t.File optional, max 5MB, images only) → **ไม่รับ `eventType` จาก device** → ถ้ามีรูปให้บันทึกไปที่ `public/uploads/kiosk/<studentId>/attendance/<uuid><ext>` ด้วย `Bun.write()` แล้วเก็บ path ใน `photoPath` → response กลับรวม `eventType` ที่ระบบตัดสินใจ เพื่อให้ตู้แสดงผล "เช็คเข้า / เช็คออก" บนหน้าจอได้
- `getKioskAttendanceLogsController` — GET, query params
- `getKioskAttendanceLogByIdController` — GET /:id
- `updateKioskAttendanceLogController` — PATCH /update/:id
- `deleteKioskAttendanceLogController` — DELETE /delete/:id

### 5. สร้าง Route: `src/v1/routes/admin/kiosk-attendance.route.ts`

```
new Elysia({ prefix: "/kiosk-attendances" })
  .post("/tap", controller, { body: t.Object({ studentId, academicYearId, termId, photo: t.Optional(t.File(...)) }), beforeHandle: [requirePermission(["admin"])], ... })
  // หมายเหตุ: ไม่มี eventType ใน body — ระบบ auto-detect ฝั่ง service
  .get("/", controller, { query: t.Object({ ... }), ... })
  .get("/:id", controller, { ... })
  .patch("/update/:id", controller, { ... })
  .delete("/delete/:id", controller, { ... })
```

ใช้ `tags: ["KioskAttendance (AdminRoutes)"]` ตามรูปแบบ Swagger เดิม

### 6. ลงทะเบียน route ใน `src/v1/routes/index.admin.route.ts`

import `kioskAttendanceRoutes` และ `.use(kioskAttendanceRoutes)` เหมือน admin route อื่นๆ

---

## Verification

- `bunx prisma studio` — ตรวจ schema/migration ใหม่
- Swagger UI (`/swagger`) — ตรวจ endpoint `/api/v1/admin/kiosk-attendances/*` ครบ 5 endpoints
- ทดสอบ POST `/tap` ด้วย Postman multipart: ไม่มีรูป vs มีรูป ตรวจ `photoPath` ถูกต้อง
- ตรวจ auto-detect: tap ครั้งที่ 1 → response มี `eventType: "CHECK_IN"`, ครั้งที่ 2 → `CHECK_OUT`, ครั้งที่ 3 → `CHECK_IN` อีกครั้ง
- ทดสอบ GET พร้อม filter `studentId`, `date`, `eventType`
- ตรวจ `public/uploads/kiosk/<id>/attendance/` มีไฟล์จริงหลัง upload

---

## Decisions

- เลือก **1 row per tap** แทน 1 row per day เพื่อ log ทุก event อย่างครบถ้วน
- **Auto-detect `eventType`** ฝั่ง server โดย toggle จาก record ล่าสุดของวันนั้น — device ส่งแค่ `studentId` ไม่ต้องรู้ state
  - ⚠️ ถ้า tap พลาด (server บันทึกแต่ตู้ไม่แสดงผล) → state จะกลับทิศ ต้องลบ record ที่ผิดด้วย CRUD admin
- **ไม่คำนวณ status** (สาย/ตรงเวลา) — เก็บแค่ `eventTime` ไว้ให้ฝั่ง client/report คำนวณเอง
- รูปถ่ายจัดการใน **tap endpoint เดียว** (ไม่แยก 2 รอบ call) เพื่อลด round-trip จากตู้
- ระบบครูเดิม (`SchoolAttendance`, `SchoolAttendanceRecord`) **ยังคงอยู่** ไม่ถูกแตะต้อง
- ใช้ **admin JWT** เดิม ไม่สร้าง auth ใหม่สำหรับ device
