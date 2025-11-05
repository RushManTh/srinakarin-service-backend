import { Elysia, t } from "elysia";
import {
  createAssignmentController,
  deleteAssignmentController,
  getAssignmentByIdController,
  listAssignmentsController,
  listAssignmentsWithStudentScoreStatusController,
  listSubjectAssignmentsByTeacherAssignmentIdController,
  updateAssignmentController,
} from "../../controllers/teacher/subjectIndicator.controller";
import { scoreType } from "../../../generated/prisma";

export const subjectIndicatorRoutes = new Elysia({
  prefix: "/assignments",
})
  .get("/", listAssignmentsController, {
    tags: ["SubjectIndicator (TeacherRoutes)"],
    summary: "รายชื่อตัวชี้วัด",
  })
  .get(
    "/school-subject/:teacherAssignmentId",
    listSubjectAssignmentsByTeacherAssignmentIdController,
    {
      params: t.Object({ teacherAssignmentId: t.String() }),
      tags: ["SubjectIndicator (TeacherRoutes)"],
      summary: "รายการตัวชี้วัดของวิชา",
    }
  )
  .get(
    "/school-subject/:teacherAssignmentId/student/:studentId",
    listAssignmentsWithStudentScoreStatusController,
    {
      params: t.Object({
        teacherAssignmentId: t.String(),
        studentId: t.String(),
      }),
      tags: ["SubjectIndicator (TeacherRoutes)"],
      summary:
        "ดึง subjectindicator ของวิชานั้น ๆ พร้อมสถานะ hasScore ของนักเรียนแต่ละตัวชี้วัด",
    }
  )
  .get("/:id", getAssignmentByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectIndicator (TeacherRoutes)"],
    summary: "ข้อมูลตัวชี้วัด",
  })
  .post("/create", createAssignmentController, {
    body: t.Object({
      teacherAssignmentId: t.String(),
      code: t.String(),
      title: t.String(),
      description: t.Optional(t.String()),
      scoreType: t.Enum(scoreType),
      maxScore: t.Number(),
    }),
    tags: ["SubjectIndicator (TeacherRoutes)"],
    summary: "เพิ่มตัวชี้วัด",
  })
  .patch("/update/:id", updateAssignmentController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      teacherAssignmentId: t.Optional(t.String()),
      code: t.Optional(t.String()),
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      scoreType: t.Optional(t.String()),
      maxScore: t.Optional(t.Number()),
    }),
    tags: ["SubjectIndicator (TeacherRoutes)"],
    summary: "แก้ไขตัวชี้วัด",
  })
  .delete("/delete/:id", deleteAssignmentController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectIndicator (TeacherRoutes)"],
    summary: "ลบตัวชี้วัด",
  });
