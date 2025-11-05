import { Elysia, t } from "elysia";
import {
  listEnrollmentsController,
  createEnrollmentController,
  deleteEnrollmentController,
  listStudentEnrollmentsController,
  listSubjectEnrollmentsController,
} from "../../controllers/teacher/enrollment.controller";

export const enrollmentRoutes = new Elysia({ prefix: "/enrollments" })
  .get("/", listEnrollmentsController, {
    query: t.Object({
      studentId: t.Optional(t.String()),
      subjectId: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Enrollment (TeacherRoutes)"],
    summary: "รายการลงทะเบียน",
  })
  .post("/", createEnrollmentController, {
    body: t.Object({
      studentId: t.Number(),
      subjectId: t.Number(),
      // สามารถเพิ่ม field อื่นๆ เช่น grade, status, note ได้ถ้าต้องการ
    }),
    tags: ["Enrollment (TeacherRoutes)"],
    summary: "ลงทะเบียนเรียน",
  })
  .delete("/:id", deleteEnrollmentController, {
    params: t.Object({ id: t.String() }),
    tags: ["Enrollment (TeacherRoutes)"],
    summary: "ยกเลิกการลงทะเบียน",
  });

export const studentEnrollmentRoutes = new Elysia({ prefix: "/students" }).get(
  ":id/enrollments",
  listStudentEnrollmentsController,
  {
    params: t.Object({ id: t.String() }),
    tags: ["Enrollment (TeacherRoutes)"],
    summary: "ดูวิชาที่นักเรียนลงทะเบียน",
  }
);

export const subjectEnrollmentRoutes = new Elysia({ prefix: "/subjects" }).get(
  ":id/enrollments",
  listSubjectEnrollmentsController,
  {
    params: t.Object({ id: t.String() }),
    tags: ["Enrollment (TeacherRoutes)"],
    summary: "ดูนักเรียนที่ลงทะเบียนในวิชานี้",
  }
);
