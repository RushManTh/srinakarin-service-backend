import { Elysia, t } from "elysia";
import {
  listEnrollmentsController,
  getEnrollmentByIdController,
  createEnrollmentController,
  updateEnrollmentController,
  deleteEnrollmentController,
} from "../../controllers/admin/enrollment.controller";
import { bulkCreateEnrollmentsController } from "../../controllers/admin/enrollment.controller";

export const enrollmentRoutes = new Elysia({ prefix: "/enrollments" })
  .get("/", listEnrollmentsController, {
    tags: ["Enrollment (AdminRoutes)"],
    summary: "รายการการลงทะเบียน (Enrollment)",
  })
  .get("/:id", getEnrollmentByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Enrollment (AdminRoutes)"],
    summary: "ดูข้อมูลการลงทะเบียน (Enrollment)",
  })
  .post("/create", createEnrollmentController, {
    body: t.Object({
      studentId: t.String(),
      schoolSubjectId: t.String(),
      classroomId: t.String(),
      termId: t.String(),
      academicYearId: t.String(),
      enrolledAt: t.Optional(t.String()),
      grade: t.Optional(t.String()),
      isCompleted: t.Optional(t.Boolean()),
      completedAt: t.Optional(t.String()),
      note: t.Optional(t.String()),
    }),
    tags: ["Enrollment (AdminRoutes)"],
    summary: "สร้างการลงทะเบียน (Enrollment)",
  })
  .post("/bulk-create", bulkCreateEnrollmentsController, {
    body: t.Object({
      studentIds: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
      schoolSubjectId: t.String(),
      classroomId: t.String(),
      termId: t.String(),
      academicYearId: t.String(),
      enrolledAt: t.Optional(t.String()),
      grade: t.Optional(t.String()),
      isCompleted: t.Optional(t.Boolean()),
      completedAt: t.Optional(t.String()),
      note: t.Optional(t.String()),
    }),
    tags: ["Enrollment (AdminRoutes)"],
    summary: "ลงทะเบียนนักเรียนหลายคนพร้อมกัน (Bulk Create)",
  })
  .patch("/update/:id", updateEnrollmentController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      studentId: t.Optional(t.String()),
      schoolSubjectId: t.Optional(t.String()),
      classroomId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      enrolledAt: t.Optional(t.String()),
      grade: t.Optional(t.String()),
      isCompleted: t.Optional(t.Boolean()),
      completedAt: t.Optional(t.String()),
      note: t.Optional(t.String()),
    }),
    tags: ["Enrollment (AdminRoutes)"],
    summary: "อัพเดตการลงทะเบียน (Enrollment)",
  })
  .delete("/delete/:id", deleteEnrollmentController, {
    params: t.Object({ id: t.String() }),
    tags: ["Enrollment (AdminRoutes)"],
    summary: "ลบการลงทะเบียน (Enrollment)",
  });
