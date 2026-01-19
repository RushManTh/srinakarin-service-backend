import { Elysia, t } from "elysia";
import {
  listAssignmentsController,
  getAssignmentByIdController,
  createAssignmentController,
  updateAssignmentController,
  deleteAssignmentController,
  listAssignmentsBySubjectController,
  listAssignmentsByTeacherAssignmentController,
} from "../../controllers/admin/assignment.controller";
import { scoreType } from "../../../generated/prisma";

export const assignmentRoutes = new Elysia({ prefix: "/assignments" })
  .get("/", listAssignmentsController, {
    tags: ["Assignment (AdminRoutes)"],
    summary: "รายการงานที่มอบหมาย (Assignment)",
  })
  .get("/:id", getAssignmentByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Assignment (AdminRoutes)"],
    summary: "ดูข้อมูลงานที่มอบหมาย (Assignment)",
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
    tags: ["Assignment (AdminRoutes)"],
    summary: "สร้างงานที่มอบหมาย (Assignment)",
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
    tags: ["Assignment (AdminRoutes)"],
    summary: "อัพเดตงานที่มอบหมาย (Assignment)",
  })
  .delete("/delete/:id", deleteAssignmentController, {
    params: t.Object({ id: t.String() }),
    tags: ["Assignment (AdminRoutes)"],
    summary: "ลบงานที่มอบหมาย (Assignment)",
  })
  .get("/by-subject", listAssignmentsBySubjectController, {
    query: t.Object({
      schoolSubjectId: t.Optional(t.String()),
      teacherId: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      classroomId: t.Optional(t.String()),
    }),
    tags: ["Assignment (AdminRoutes)"],
    summary:
      "ดูรายการ Assignment ตามวิชา (สามารถกรองตามครู, ปีการศึกษา, เทอม, ห้องเรียนได้)",
  })
  .get(
    "/teacher-assignment/:teacherAssignmentId",
    listAssignmentsByTeacherAssignmentController,
    {
      params: t.Object({ teacherAssignmentId: t.String() }),
      tags: ["Assignment (AdminRoutes)"],
      summary:
        "ดูรายการ Assignment ตาม TeacherAssignment (การมอบหมายของครูในวิชา ห้องเรียน เทอม และปีการศึกษาที่เจาะจง)",
    }
  );
