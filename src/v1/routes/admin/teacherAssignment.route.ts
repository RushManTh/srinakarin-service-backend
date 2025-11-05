import { Elysia, t } from "elysia";
import {
  listTeacherAssignmentsController,
  getTeacherAssignmentByIdController,
  createTeacherAssignmentController,
  updateTeacherAssignmentController,
  deleteTeacherAssignmentController,
} from "../../controllers/admin/teacherAssignment.controller";

export const teacherAssignmentRoutes = new Elysia({
  prefix: "/teacher-assignments",
})
  .get("/", listTeacherAssignmentsController, {
    tags: ["TeacherAssignment (AdminRoutes)"],
    summary: "รายการมอบหมายครู (Teacher Assignment)",
  })
  .get("/:id", getTeacherAssignmentByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["TeacherAssignment (AdminRoutes)"],
    summary: "ดูข้อมูลมอบหมายครู (Teacher Assignment)",
  })
  .post("/create", createTeacherAssignmentController, {
    body: t.Object({
      teacherId: t.String(),
      schoolSubjectId: t.String(),
      classroomId: t.String(),
      termId: t.String(),
      academicYearId: t.String(),
      note: t.Optional(t.String()),
    }),
    tags: ["TeacherAssignment (AdminRoutes)"],
    summary: "สร้างมอบหมายครู (Teacher Assignment)",
  })
  .patch("/update/:id", updateTeacherAssignmentController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      teacherId: t.Optional(t.String()),
      schoolSubjectId: t.Optional(t.String()),
      classroomId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      note: t.Optional(t.String()),
    }),
    tags: ["TeacherAssignment (AdminRoutes)"],
    summary: "อัพเดตมอบหมายครู (Teacher Assignment)",
  })
  .delete("/delete/:id", deleteTeacherAssignmentController, {
    params: t.Object({ id: t.String() }),
    tags: ["TeacherAssignment (AdminRoutes)"],
    summary: "ลบมอบหมายครู (Teacher Assignment)",
  });
