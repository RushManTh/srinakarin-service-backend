import { Elysia, t } from "elysia";
import {
  listAssignmentScoresController,
  getAssignmentScoreByIdController,
  createAssignmentScoreController,
  updateAssignmentScoreController,
  deleteAssignmentScoreController,
  listAssignmentScoresByCompetencyController,
  getStudentScoresBySubjectGroupedByCompetencyController,
  getStudentAssignmentScoresByTeacherAssignmentController,
} from "../../controllers/teacher/assignmentScore.controller";

export const assignmentScoreRoutes = new Elysia({
  prefix: "/assignment-scores",
})
  .get("/", listAssignmentScoresController, {
    tags: ["AssignmentScore (TeacherRoutes)"],
    summary: "รายการคะแนนงาน (AssignmentScore)",
  })
  .get("/:id", getAssignmentScoreByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScore (TeacherRoutes)"],
    summary: "ดูข้อมูลคะแนนงาน (AssignmentScore)",
  })
  .post("/create", createAssignmentScoreController, {
    body: t.Object({
      assignmentScoreAttemptId: t.String(),
      studentId: t.String(),
      score: t.Number(),
      comment: t.String(),
    }),
    tags: ["AssignmentScore (TeacherRoutes)"],
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
    tags: ["AssignmentScore (TeacherRoutes)"],
    summary: "อัพเดตคะแนนงาน (AssignmentScore)",
  })
  .delete("/delete/:id", deleteAssignmentScoreController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScore (TeacherRoutes)"],
    summary: "ลบคะแนนงาน (AssignmentScore)",
  })

  // Route สำหรับดึงคะแนน AssignmentScore ทั้งหมดที่เกี่ยวข้องกับ competencyId
  .get(
    "/by-competency/:competencyId",
    listAssignmentScoresByCompetencyController,
    {
      params: t.Object({ competencyId: t.String() }),
      tags: ["AssignmentScore (TeacherRoutes)"],
      summary: "ดูคะแนนงานทั้งหมดที่เกี่ยวกับ competencyId",
    }
  )

  // Route สำหรับดึงคะแนนของนักเรียนในวิชานั้น ๆ โดยจัดกลุ่มตาม competency
  .get(
    "/student/:studentId/subject/:teacherAssignmentId/grouped-by-competency",
    getStudentScoresBySubjectGroupedByCompetencyController,
    {
      params: t.Object({
        studentId: t.String(),
        teacherAssignmentId: t.String(),
      }),
      tags: ["AssignmentScore (TeacherRoutes)"],
      summary: "ดูคะแนนของนักเรียนในวิชานั้น ๆ โดยจัดกลุ่มตาม competency",
    }
  )

  // Route สำหรับดึงคะแนน AssignmentScore ของนักเรียนรายคนใน teacherAssignmentId
  .get(
    "/student/:studentId/subject/:teacherAssignmentId",
    getStudentAssignmentScoresByTeacherAssignmentController,
    {
      params: t.Object({
        studentId: t.String(),
        teacherAssignmentId: t.String(),
      }),
      tags: ["AssignmentScore (TeacherRoutes)"],
      summary: "ดูคะแนน AssignmentScore ของนักเรียนรายคนใน teacherAssignmentId",
    }
  );
