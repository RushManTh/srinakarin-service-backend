import { Elysia, t } from "elysia";
import {
  listSubjectAssignmentsController,
  createSubjectAssignmentController,
  deleteSubjectAssignmentController,
} from "../../controllers/admin/subjectAssignment.controller";

export const subjectAssignmentRoutes = new Elysia({
  prefix: "/subject-assignments",
})
  .get("/", listSubjectAssignmentsController, {
    query: t.Object({
      subjectId: t.Optional(t.String()),
      teacherId: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["SubjectAssignment (AdminRoutes)"],
    summary: "รายการมอบหมายวิชาให้ครู",
  })
  .post("/", createSubjectAssignmentController, {
    body: t.Object({
      subjectId: t.Number(),
      teacherId: t.Number(),
    }),
    tags: ["SubjectAssignment (AdminRoutes)"],
    summary: "มอบหมายวิชาให้ครู",
  })
  .delete("/:id", deleteSubjectAssignmentController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectAssignment (AdminRoutes)"],
    summary: "ยกเลิกการมอบหมายวิชา",
  });
