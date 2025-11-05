import { Elysia, t } from "elysia";
import {
  getTeacherProfileController,
  listMyHomeroomStudentsController,
  listTeacherAssignmentsByTeacherIdController,
} from "../../controllers/teacher/teacher.controller";

export const teacherRoutes = new Elysia({ prefix: "/teacher" })
  .get("/me", getTeacherProfileController, {
    tags: ["Teacher (TeacherRoutes)"],
    summary: "ดูข้อมูลครู",
  })
  .get("/me/homeroom-students", listMyHomeroomStudentsController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Teacher (TeacherRoutes)"],
    summary: "รายชื่อนักเรียนในห้องที่ฉันเป็นครูประจำชั้น (filter/pagination)",
  })
  .get("/me/teacher-assignments", listTeacherAssignmentsByTeacherIdController, {
    tags: ["Teacher (TeacherRoutes)"],
    summary: "รายการวิชาที่ครูได้รับมอบหมาย ",
  });
