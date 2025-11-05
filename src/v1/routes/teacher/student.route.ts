import { Elysia, t } from "elysia";
import {
  listStudentsController,
  getStudentByIdController,
  listStudentEnrollmentsController,
  listStudentSubjectsController,
  listStudentScoresController,
  listStudentSubjectScoresController,
  getStudentScoresBySubjectGroupedByCompetencyController,
  getTeacherAssignmentIdsBySubjectTermYearController,
} from "../../controllers/teacher/student.controller";
import { requirePermission } from "../../middleware/requirePermission";

export const studentRoutes = new Elysia({ prefix: "/students" })
  .get("/", listStudentsController, {
    query: t.Object({
      studentLevelId: t.Optional(t.String()),
      programEducationId: t.Optional(t.String()),
      classroomId: t.Optional(t.String()),
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    beforeHandle: [requirePermission(["teacher"])],
    tags: ["Student (TeacherRoutes)"],
    summary: "รายชื่อนักเรียนทั้งหมด",
  })
  .get("/:id", getStudentByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Student (TeacherRoutes)"],
    summary: "ข้อมูลนักเรียนรายคน",
  })

  .get("/:id/enrollments", listStudentEnrollmentsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Student (TeacherRoutes)"],
    summary: "ดูวิชาที่นักเรียนลงทะเบียน",
  })
  .get("/:id/subjects", listStudentSubjectsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Student (TeacherRoutes)"],
    summary: "ดูรายชื่อวิชาที่นักเรียนลงทะเบียน",
  })
  .get("/:id/scores", listStudentScoresController, {
    params: t.Object({ id: t.String() }),
    tags: ["Student (TeacherRoutes)"],
    summary: "ดูคะแนนนักเรียนทุกวิชา/ตัวชี้วัด",
  })
  .get(
    "/:id/subjects/:schoolSubjectId/scores/:academicYearId/:termId",
    listStudentSubjectScoresController,
    {
      params: t.Object({
        id: t.String(),
        schoolSubjectId: t.String(),
        academicYearId: t.String(),
        termId: t.String(),
      }),
      tags: ["Student (TeacherRoutes)"],
      summary: "ดูคะแนนนักเรียนในวิชานี้ (ทุกตัวชี้วัด)",
    }
  )
  .get(
    "/:id/subjects/:schoolSubjectId/scores/:academicYearId/:termId/grouped-by-competency",
    getStudentScoresBySubjectGroupedByCompetencyController,
    {
      params: t.Object({
        id: t.String(),
        schoolSubjectId: t.String(),
        academicYearId: t.String(),
        termId: t.String(),
      }),
      tags: ["Student (TeacherRoutes)"],
      summary: "ดูคะแนนนักเรียนในวิชานี้ grouped by competency",
    }
  )
  .get(
    "/teacher-assignment-ids/subject/:schoolSubjectId/term/:termId/academic-year/:academicYearId",
    getTeacherAssignmentIdsBySubjectTermYearController,
    {
      params: t.Object({
        schoolSubjectId: t.String(),
        termId: t.String(),
        academicYearId: t.String(),
      }),
      tags: ["Student (TeacherRoutes)"],
      summary:
        "ดึง teacherAssignmentIds จาก schoolSubjectId, termId, academicYearId",
    }
  );
