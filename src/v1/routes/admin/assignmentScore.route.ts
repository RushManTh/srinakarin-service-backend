import { Elysia, t } from "elysia";
import {
  listAssignmentScoresController,
  getAssignmentScoreByIdController,
  createAssignmentScoreController,
  updateAssignmentScoreController,
  deleteAssignmentScoreController,
  getStudentScoresBySubjectGroupedByCompetencyController,
  getStudentAssignmentScoresBySubjectController,
} from "../../controllers/admin/assignmentScore.controller";

export const assignmentScoreRoutes = new Elysia({
  prefix: "/assignment-scores",
})
  .get("/", listAssignmentScoresController, {
    tags: ["AssignmentScore (AdminRoutes)"],
    summary: "รายการคะแนนงาน (AssignmentScore)",
  })
  .get("/:id", getAssignmentScoreByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScore (AdminRoutes)"],
    summary: "ดูข้อมูลคะแนนงาน (AssignmentScore)",
  })
  .post("/create", createAssignmentScoreController, {
    body: t.Object({
      assignmentScoreAttemptId: t.String(),
      studentId: t.String(),
      score: t.Number(),
      comment: t.Optional(t.String()),
    }),
    tags: ["AssignmentScore (AdminRoutes)"],
    summary: "สร้างคะแนนงาน (AssignmentScore)",
  })
  .patch("/update/:id", updateAssignmentScoreController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      assignmentScoreAttemptId: t.Optional(t.String()),
      studentId: t.Optional(t.String()),
      score: t.Optional(t.Number()),
      comment: t.Optional(t.String()),
    }),
    tags: ["AssignmentScore (AdminRoutes)"],
    summary: "อัพเดตคะแนนงาน (AssignmentScore)",
  })
  .delete("/delete/:id", deleteAssignmentScoreController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScore (AdminRoutes)"],
    summary: "ลบคะแนนงาน (AssignmentScore)",
  })
  .get(
    "/students/:studentId/subjects/:schoolSubjectId/grouped-by-competency",
    getStudentScoresBySubjectGroupedByCompetencyController,
    {
      params: t.Object({
        studentId: t.String(),
        schoolSubjectId: t.String(),
      }),
      query: t.Object({
        academicYearId: t.Optional(t.String()),
        termId: t.Optional(t.String()),
      }),
      tags: ["AssignmentScore (AdminRoutes)"],
      summary:
        "ดูคะแนนของนักเรียนในวิชา จัดกลุ่มตาม Competency (สามารถกรองตามปีการศึกษาและเทอมได้)",
    }
  )
  .get(
    "/students/:studentId/subjects/:schoolSubjectId/assignments",
    getStudentAssignmentScoresBySubjectController,
    {
      params: t.Object({
        studentId: t.String(),
        schoolSubjectId: t.String(),
      }),
      query: t.Object({
        academicYearId: t.Optional(t.String()),
        termId: t.Optional(t.String()),
      }),
      tags: ["AssignmentScore (AdminRoutes)"],
      summary:
        "ดูคะแนน Assignment ทั้งหมดของนักเรียนในวิชา (สามารถกรองตามปีการศึกษาและเทอมได้)",
    }
  );
