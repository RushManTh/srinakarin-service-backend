import { Elysia, t } from "elysia";
import {
  listScoresController,
  getScoreByIdController,
  createScoreController,
  updateScoreController,
  deleteScoreController,
  listStudentSubjectScoresController,
  listIndicatorScoresController,
  getStudentSubjectScoreSummaryController,
  getAllStudentsSubjectScoreSummaryController,
  listScoresByCompetencyController,
  getStudentScoresBySubjectGroupedByCompetencyController,
} from "../../controllers/teacher/score.controller";

export const scoreRoutes = new Elysia({ prefix: "/scores" })
  .get("/", listScoresController, {
    query: t.Object({
      studentId: t.Optional(t.String()),
      subjectId: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Score (TeacherRoutes)"],
    summary: "รายการคะแนน (filter ได้ตาม student, subject, year, term)",
  })
  .get("/:id", getScoreByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Score (TeacherRoutes)"],
    summary: "ข้อมูลคะแนน",
  })
  .post("/create", createScoreController, {
    body: t.Object({
      studentId: t.Number(),
      subjectIndicatorId: t.Number(),
      score: t.Number(),
      comment: t.Optional(t.String()),
      commentDirection: t.Optional(t.String()),
      academicYearId: t.Optional(t.Number()),
      termId: t.Optional(t.Number()),
    }),
    tags: ["Score (TeacherRoutes)"],
    summary: "บันทึกคะแนน",
  })
  .patch("/update/:id", updateScoreController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      score: t.Optional(t.Number()),
      comment: t.Optional(t.String()),
      commentDirection: t.Optional(t.String()),
      academicYearId: t.Optional(t.Number()),
      termId: t.Optional(t.Number()),
    }),
    tags: ["Score (TeacherRoutes)"],
    summary: "แก้ไขคะแนน/คอมเมนต์/ไฟล์แนบ",
  })
  .delete("/delete/:id", deleteScoreController, {
    params: t.Object({ id: t.String() }),
    tags: ["Score (TeacherRoutes)"],
    summary: "ลบคะแนน",
  })
  .get(
    "/summary/:studentId/:subjectId",
    getStudentSubjectScoreSummaryController,
    {
      params: t.Object({
        studentId: t.String(),
        subjectId: t.String(),
        academicYearId: t.Optional(t.String()),
        termId: t.Optional(t.String()),
      }),
      tags: ["Score (TeacherRoutes)"],
      summary:
        "คะแนนรวมของนักเรียนในวิชานั้น ๆ (แบ่งตามประเภทคะแนน ปีการศึกษา เทอม)",
    }
  )
  .get(
    "/summary/all/:subjectId/:academicYearId/:termId",
    getAllStudentsSubjectScoreSummaryController,
    {
      params: t.Object({
        subjectId: t.String(),
        academicYearId: t.String(),
        termId: t.String(),
      }),
      tags: ["Score (TeacherRoutes)"],
      summary:
        "คะแนนรวมของนักเรียนทุกคนในวิชานั้น ๆ (แบ่งตามประเภทคะแนน ปีการศึกษา เทอม)",
    }
  )
  .get("/by-competency", listScoresByCompetencyController, {
    query: t.Object({
      subjectTypeId: t.String(),
      competencyId: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      studentId: t.Optional(t.String()),
    }),
    tags: ["Score (TeacherRoutes)"],
    summary: "ดูคะแนนนักเรียนทุกคนในตัวชี้วัดนี้",
  })
  .get(
    "/by-subject-competency",
    getStudentScoresBySubjectGroupedByCompetencyController,
    {
      query: t.Object({
        subjectId: t.String(),
        studentId: t.String(),
        academicYearId: t.Optional(t.String()),
        termId: t.Optional(t.String()),
      }),
      tags: ["Score (TeacherRoutes)"],
      summary:
        "ดูคะแนนของนักเรียนในวิชานี้ แยกตาม competency ที่เชื่อมกับ subjectType ของวิชานั้น",
    }
  );

// export const studentSubjectScoreRoutes = new Elysia({
//   prefix: "/students",
// }).get(
//   ":studentId/subjects/:subjectId/scores",
//   listStudentSubjectScoresController,
//   {
//     params: t.Object({ studentId: t.String(), subjectId: t.String() }),
//     tags: ["Score"],
//     summary: "ดูคะแนนนักเรียนในวิชานี้ (ทุกตัวชี้วัด)",
//   }
// );

// export const subjectIndicatorScoreRoutes = new Elysia({
//   prefix: "/subjects",
// }).get(
//   ":subjectId/indicators/:indicatorId/scores",
//   listIndicatorScoresController,
//   {
//     params: t.Object({ subjectId: t.String(), indicatorId: t.String() }),
//     tags: ["Score"],
//     summary: "ดูคะแนนนักเรียนทุกคนในตัวชี้วัดนี้",
//   }
// );
