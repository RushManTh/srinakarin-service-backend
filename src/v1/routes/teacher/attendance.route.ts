import { Elysia, t } from "elysia";
import {
  createAttendanceController,
  deleteAttendanceController,
  getAttendanceByIdController,
  listAttendancesController,
  listAttendancesByClassYearTermController,
  updateAttendanceController,
} from "../../controllers/teacher/attendance.controller";
import { requirePermission } from "../../middleware/requirePermission";

export const attendanceRoutes = new Elysia({ prefix: "/attendances" })
  .get("/", listAttendancesController, {
    query: t.Object({
      classroomId: t.Optional(t.String()),
      session: t.Optional(
        t.Union([t.Literal("MORNING"), t.Literal("AFTERNOON")])
      ),
      fromDate: t.Optional(t.String()),
      toDate: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Attendance (TeacherRoutes)"],
    summary: "รายการเช็คชื่อ (รายวัน) ของครูประจำชั้น",
  })
  .get("/:id", getAttendanceByIdController, {
    params: t.Object({ id: t.String() }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Attendance (TeacherRoutes)"],
    summary: "ดูรายละเอียดการเช็คชื่อ",
  })
  .get("/by-classroom", listAttendancesByClassYearTermController, {
    query: t.Object({
      classroomId: t.String(),
      academicYearId: t.String(),
      termId: t.String(),
      date: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Attendance (TeacherRoutes)"],
    summary:
      "รายการเช็คชื่อรายวันของห้องเรียนตามปีการศึกษาและเทอม (ต้องระบุ classroomId, academicYearId, termId) และสามารถระบุ date เฉพาะวันได้",
  })
  .post("/create", createAttendanceController, {
    body: t.Object({
      date: t.String(), // ISO string
      session: t.Union([t.Literal("MORNING"), t.Literal("AFTERNOON")]),
      classroomId: t.String(),
      academicYearId: t.String(),
      termId: t.String(),
      records: t.Optional(
        t.Array(
          t.Object({
            studentId: t.String(),
            status: t.Union([
              t.Literal("PRESENT"),
              t.Literal("ABSENT"),
              t.Literal("LATE"),
              t.Literal("LEAVE"),
            ]),
            remark: t.Optional(t.String()),
          })
        )
      ),
    }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Attendance (TeacherRoutes)"],
    summary: "สร้างการเช็คชื่อรายวัน",
  })
  .patch("/update/:id", updateAttendanceController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      date: t.Optional(t.String()),
      session: t.Optional(
        t.Union([t.Literal("MORNING"), t.Literal("AFTERNOON")])
      ),
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      records: t.Optional(
        t.Array(
          t.Object({
            id: t.Optional(t.String()),
            studentId: t.String(),
            status: t.Union([
              t.Literal("PRESENT"),
              t.Literal("ABSENT"),
              t.Literal("LATE"),
              t.Literal("LEAVE"),
            ]),
            remark: t.Optional(t.String()),
          })
        )
      ),
    }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Attendance (TeacherRoutes)"],
    summary: "แก้ไขการเช็คชื่อ/บันทึกของนักเรียน",
  })
  .delete("/delete/:id", deleteAttendanceController, {
    params: t.Object({ id: t.String() }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Attendance (TeacherRoutes)"],
    summary: "ลบการเช็คชื่อและรายการทั้งหมด",
  });
