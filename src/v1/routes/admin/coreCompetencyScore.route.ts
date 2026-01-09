import { Elysia, t } from "elysia";
import {
  calculateStudentScore,
  getStudentScore,
  calculateClassroomScore,
  getScoreHistory,
  calculateAllStudentScores,
  getAllStudentScores,
} from "../../controllers/admin/coreCompetencyScore.controller";

export const coreCompetencyScoreRoute = new Elysia({
  prefix: "/core-competency-scores",
})
  .post("/calculate/student", calculateStudentScore, {
    body: t.Object({
      studentId: t.String(),
      coreCompetencyId: t.String(),
      academicYearId: t.String(),
      termId: t.String(),
      levelId: t.Optional(t.String()),
    }),
    tags: ["CoreCompetencyScore (AdminRoutes)"],
    summary: "คำนวณคะแนนสมรรถนะหลักของนักเรียน",
  })
  .get("/student/:studentId", getStudentScore, {
    params: t.Object({ studentId: t.String() }),
    query: t.Object({
      coreCompetencyId: t.String(),
      academicYearId: t.String(),
      termId: t.String(),
      levelId: t.Optional(t.String()),
    }),
    tags: ["CoreCompetencyScore (AdminRoutes)"],
    summary: "ดึงคะแนนสมรรถนะหลักของนักเรียน",
  })
  .post("/calculate/classroom", calculateClassroomScore, {
    body: t.Object({
      classroomId: t.String(),
      coreCompetencyId: t.String(),
      academicYearId: t.String(),
      termId: t.String(),
    }),
    tags: ["CoreCompetencyScore (AdminRoutes)"],
    summary: "คำนวณคะแนนสมรรถนะหลักทั้งห้อง",
  })
  .get("/history/:studentId/:coreCompetencyId", getScoreHistory, {
    params: t.Object({
      studentId: t.String(),
      coreCompetencyId: t.String(),
    }),
    query: t.Object({
      limit: t.Optional(t.Numeric()),
    }),
    tags: ["CoreCompetencyScore (AdminRoutes)"],
    summary: "ประวัติคะแนนสมรรถนะหลัก",
  })
  .post("/calculate/all-competencies", calculateAllStudentScores, {
    body: t.Object({
      studentId: t.String(),
      academicYearId: t.String(),
      termId: t.String(),
      levelId: t.String(),
    }),
    tags: ["CoreCompetencyScore (AdminRoutes)"],
    summary: "คำนวณคะแนนสมรรถนะหลักทั้งหมดของนักเรียน",
  })
  .get("/all-competencies/:studentId", getAllStudentScores, {
    params: t.Object({ studentId: t.String() }),
    query: t.Object({
      academicYearId: t.String(),
      termId: t.String(),
      levelId: t.String(),
    }),
    tags: ["CoreCompetencyScore (AdminRoutes)"],
    summary: "ดึงคะแนนสมรรถนะหลักทั้งหมดของนักเรียน",
  });
