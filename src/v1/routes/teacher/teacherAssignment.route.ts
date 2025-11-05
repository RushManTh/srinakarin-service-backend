import { Elysia, t } from "elysia";
import {
  listTeacherAssignmentsController,
  getTeacherAssignmentByIdController,
  getStudentsWithScoresByTeacherAssignmentController,
} from "../../controllers/teacher/teacherAssignment.controller";

export const teacherAssignmentRoutes = new Elysia({
  prefix: "/teacher-assignments",
})
  .get("/", listTeacherAssignmentsController, {
    tags: ["TeacherAssignment (TeacherRoutes)"],
    summary: "รายการวิชาที่ครูได้รับมอบหมาย ",
  })
  .get("/:id", getTeacherAssignmentByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["TeacherAssignment (TeacherRoutes)"],
    summary: "ข้อมูลการมอบหมายวิชา",
  })
  .get(
    "/:id/students-with-scores",
    getStudentsWithScoresByTeacherAssignmentController,
    {
      params: t.Object({ id: t.String() }),
      tags: ["TeacherAssignment (TeacherRoutes)"],
      summary:
        "ดึงข้อมูลนักเรียนที่ลงทะเบียนในวิชานั้น ๆ พร้อมคะแนนรวมแต่ละประเภท",
    }
  );
