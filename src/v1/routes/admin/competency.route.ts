import { Elysia, t } from "elysia";
import {
  listCompetenciesController,
  getCompetencyByIdController,
  createCompetencyController,
  updateCompetencyController,
  deleteCompetencyController,
} from "../../controllers/admin/competency.controller";

export const competencyRoutes = new Elysia({ prefix: "/competencies" })
  .get("/", listCompetenciesController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Competency (AdminRoutes)"],
    summary: "รายการสมรรถนะ",
  })
  .get("/:id", getCompetencyByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Competency (AdminRoutes)"],
    summary: "ดูข้อมูลสมรรถนะ",
  })
  .post("/create", createCompetencyController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      subjectTypeId: t.String(),
      levelId: t.String(),
    }),
    tags: ["Competency (AdminRoutes)"],
    summary: "สร้างสมรรถนะ",
  })
  .patch("/update/:id", updateCompetencyController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      subjectTypeId: t.Optional(t.String()),
      levelId: t.Optional(t.String()),
    }),
    tags: ["Competency (AdminRoutes)"],
    summary: "อัพเดตสมรรถนะ",
  })
  .delete("/delete/:id", deleteCompetencyController, {
    params: t.Object({ id: t.String() }),
    tags: ["Competency (AdminRoutes)"],
    summary: "ลบสมรรถนะ",
  });
