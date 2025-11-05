import { Elysia, t } from "elysia";
import {
  listSubjectsController,
  getSubjectByIdController,
  listSubjectStudentsController,
  listSubjectIndicatorsController,
} from "../../controllers/teacher/subject.controller";
import { LearningApproach } from "../../../generated/prisma";

export const subjectRoutes = new Elysia({ prefix: "/subjects" })
  .get("/", listSubjectsController, {
    query: t.Object({
      search: t.Optional(t.String()),
      subjectTypeId: t.Optional(t.String()),
      levelId: t.Optional(t.String()),
      learningAreaId: t.Optional(t.String()),
      isActive: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Subject (TeacherRoutes)"],
    summary: "รายการวิชา",
  })
  .get("/:id", getSubjectByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (TeacherRoutes)"],
    summary: "ดูข้อมูลวิชา",
  })
  .get("/:id/students", listSubjectStudentsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (TeacherRoutes)"],
    summary: "นักเรียนที่ลงทะเบียนในวิชานี้",
  })
  .get("/:id/indicators", listSubjectIndicatorsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (TeacherRoutes)"],
    summary: "ตัวชี้วัดของวิชานี้",
  });
