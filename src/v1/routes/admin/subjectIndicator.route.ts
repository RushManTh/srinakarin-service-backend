import { Elysia, t } from "elysia";
import {
  listSubjectIndicatorsController,
  getSubjectIndicatorByIdController,
  createSubjectIndicatorController,
  updateSubjectIndicatorController,
  deleteSubjectIndicatorController,
  listSubjectIndicatorsBySubjectIdController,
} from "../../controllers/admin/subjectIndicator.controller";

export const subjectIndicatorRoutes = new Elysia({
  prefix: "/subject-indicators",
})
  .get("/", listSubjectIndicatorsController, {
    tags: ["SubjectIndicator (AdminRoutes)"],
    summary: "รายชื่อตัวชี้วัด",
  })
  .get("/:id", getSubjectIndicatorByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectIndicator (AdminRoutes)"],
    summary: "ข้อมูลตัวชี้วัด",
  })
  .post("/create", createSubjectIndicatorController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      competencyId: t.Number(),
      subjectId: t.Number(),
      maxScore: t.Optional(t.Number()),
      indicatorType: t.String(),
    }),
    tags: ["SubjectIndicator (AdminRoutes)"],
    summary: "เพิ่มตัวชี้วัด",
  })
  .patch("/update/:id", updateSubjectIndicatorController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      competencyId: t.Optional(t.Number()),
      subjectId: t.Optional(t.Number()),
      maxScore: t.Optional(t.Number()),
      indicatorType: t.Optional(t.String()),
    }),
    tags: ["SubjectIndicator (AdminRoutes)"],
    summary: "แก้ไขตัวชี้วัด",
  })
  .delete("/delete/:id", deleteSubjectIndicatorController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectIndicator (AdminRoutes)"],
    summary: "ลบตัวชี้วัด",
  })
  .get("/subject/:subjectId", listSubjectIndicatorsBySubjectIdController, {
    params: t.Object({ subjectId: t.String() }),
    tags: ["SubjectIndicator (AdminRoutes)"],
    summary: "รายการตัวชี้วัดของวิชา",
  });
