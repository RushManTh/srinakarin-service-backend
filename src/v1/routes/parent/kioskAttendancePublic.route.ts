import { Elysia, t } from "elysia";
import { getKioskAttendanceByStudentCodeController } from "../../controllers/admin/kioskAttendance.controller";

/**
 * Public routes — ไม่ต้องใช้ JWT
 * ผู้ปกครองสามารถดูการเข้าเรียนรายวันของนักเรียนโดยใส่รหัสนักเรียน
 */
export const kioskAttendancePublicRoutes = new Elysia({
  prefix: "/kiosk-attendances",
})
  // GET /by-student-code?studentCode=12345&date=2026-03-09
  .get("/by-student-code", getKioskAttendanceByStudentCodeController, {
    query: t.Object({
      studentCode: t.String({ description: "รหัสนักเรียน เช่น 12345" }),
      date: t.Optional(
        t.String({
          description: "วันที่ ISO เช่น 2026-03-09 (ถ้าไม่ระบุ = ทุกวัน)",
        }),
      ),
      page: t.Optional(t.String({ description: "หน้า (default 1)" })),
      limit: t.Optional(t.String({ description: "จำนวนต่อหน้า (default 50)" })),
    }),
    tags: ["KioskAttendance (Public)"],
    summary: "ดูการเข้าเรียนรายวันของนักเรียน (สำหรับผู้ปกครอง)",
    detail: {
      description:
        "ผู้ปกครองใส่รหัสนักเรียน (studentCode) เพื่อดูประวัติการแตะบัตรเข้า/ออก ไม่ต้องล็อกอิน\n" +
        "- ระบุ `date` เพื่อดูเฉพาะวันนั้น หรือไม่ระบุเพื่อดูทั้งหมด\n" +
        "- ผลลัพธ์เรียงจากใหม่ → เก่า",
    },
  });
