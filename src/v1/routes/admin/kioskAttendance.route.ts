import { Elysia, t } from "elysia";
import {
  tapKioskAttendanceController,
  getKioskAttendanceLogsController,
  getKioskAttendanceLogByIdController,
  updateKioskAttendanceLogController,
  deleteKioskAttendanceLogController,
} from "../../controllers/admin/kioskAttendance.controller";

export const kioskAttendanceRoutes = new Elysia({
  prefix: "/kiosk-attendances",
})
  // POST /tap — แตะบัตรเช็คเข้า/ออก (auto-detect eventType)
  .post("/tap", tapKioskAttendanceController, {
    body: t.Object({
      studentCode: t.String({
        description: "รหัสนักเรียน (studentCode) เช่น 12345",
      }),
      academicYearId: t.String({ description: "ID ปีการศึกษา" }),
      termId: t.String({ description: "ID ภาคเรียน" }),
      photo: t.Optional(
        t.File({
          type: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          maxSize: "5m",
        }),
      ),
    }),
    tags: ["KioskAttendance (AdminRoutes)"],
    summary: "แตะบัตรเช็คเข้า/ออก (auto-detect ทิศทาง)",
    detail: {
      description:
        "บันทึก log การแตะบัตรจากตู้เช็คชื่อ ระบบจะตรวจ record ล่าสุดของนักเรียนในวันนั้นแล้วสลับ CHECK_IN ↔ CHECK_OUT อัตโนมัติ",
    },
  })
  // GET / — รายการ log พร้อม filter และ pagination
  .get("/", getKioskAttendanceLogsController, {
    query: t.Object({
      studentId: t.Optional(t.String()),
      date: t.Optional(t.String({ description: "วันที่ ISO เช่น 2026-03-09" })),
      eventType: t.Optional(
        t.Union([t.Literal("CHECK_IN"), t.Literal("CHECK_OUT")]),
      ),
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      page: t.Optional(t.String({ description: "หน้า (default 1)" })),
      limit: t.Optional(t.String({ description: "จำนวนต่อหน้า (default 20)" })),
    }),
    tags: ["KioskAttendance (AdminRoutes)"],
    summary: "รายการ Kiosk Attendance Log",
  })
  // GET /:id — ดู log รายการเดียว
  .get("/:id", getKioskAttendanceLogByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["KioskAttendance (AdminRoutes)"],
    summary: "ดู Kiosk Attendance Log รายการเดียว",
  })
  // PATCH /update/:id — แก้ไข log (admin only — เช่น แก้ eventType ที่ผิด)
  .patch("/update/:id", updateKioskAttendanceLogController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      eventType: t.Optional(
        t.Union([t.Literal("CHECK_IN"), t.Literal("CHECK_OUT")]),
      ),
      eventTime: t.Optional(t.String({ description: "ISO datetime string" })),
      photoPath: t.Optional(t.Nullable(t.String())),
    }),
    tags: ["KioskAttendance (AdminRoutes)"],
    summary: "แก้ไข Kiosk Attendance Log (admin)",
  })
  // DELETE /delete/:id — ลบ log (+ ลบไฟล์รูปจาก disk)
  .delete("/delete/:id", deleteKioskAttendanceLogController, {
    params: t.Object({ id: t.String() }),
    tags: ["KioskAttendance (AdminRoutes)"],
    summary: "ลบ Kiosk Attendance Log",
  });
