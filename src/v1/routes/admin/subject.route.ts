import { Elysia, t } from "elysia";
import {
  listSubjectsController,
  getSubjectByIdController,
  createSubjectController,
  updateSubjectController,
  deleteSubjectController,
  listSubjectStudentsController,
  listSubjectIndicatorsController,
  listSubjectsByLearningApproachController,
} from "../../controllers/admin/subject.controller";
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
    tags: ["Subject (AdminRoutes)"],
    summary: "รายการวิชา",
  })
  .get("/:id", getSubjectByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (AdminRoutes)"],
    summary: "ดูข้อมูลวิชา",
  })
  .post("/create", createSubjectController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      credit: t.Optional(t.Number()),
      isActive: t.Optional(t.Boolean()),
      subjectTypeId: t.Number(),
      levelId: t.Number(),
      learningApproach: t.Enum(LearningApproach),
      learningAreaId: t.Number(),
    }),
    tags: ["Subject (AdminRoutes)"],
    summary: "สร้างวิชา",
  })
  .patch("/update/:id", updateSubjectController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      credit: t.Optional(t.Number()),
      isActive: t.Optional(t.Boolean()),
      subjectTypeId: t.Optional(t.Number()),
      levelId: t.Optional(t.Number()),
      learningApproach: t.Optional(t.Enum(LearningApproach)),
      learningAreaId: t.Optional(t.Number()),
    }),
    tags: ["Subject (AdminRoutes)"],
    summary: "อัพเดตวิชา",
  })
  .delete("/delete/:id", deleteSubjectController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (AdminRoutes)"],
    summary: "ลบวิชา",
  })
  .get("/:id/students", listSubjectStudentsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (AdminRoutes)"],
    summary: "นักเรียนที่ลงทะเบียนในวิชานี้",
  })
  .get("/:id/indicators", listSubjectIndicatorsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Subject (AdminRoutes)"],
    summary: "ตัวชี้วัดของวิชานี้",
  })
  .get(
    "/learning-approach/:learningApproach",
    listSubjectsByLearningApproachController,
    {
      params: t.Object({ learningApproach: t.Enum(LearningApproach) }),
      tags: ["Subject (AdminRoutes)"],
      summary: "รายการวิชาตามวิธีเรียน",
    }
  );
