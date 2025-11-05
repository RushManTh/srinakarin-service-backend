import { Elysia, t } from "elysia";
import {
  listCompetenciesController,
  getCompetencyByIdController,
} from "../../controllers/teacher/competency.controller";
import { requirePermission } from "../../middleware/requirePermission";

export const competencyRoutes = new Elysia({ prefix: "/competencies" })
  .get("/", listCompetenciesController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Competency (TeacherRoutes)"],
    summary: "รายการสมรรถนะ",
  })
  .get("/:id", getCompetencyByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Competency (TeacherRoutes)"],
    summary: "ดูข้อมูลสมรรถนะ",
  });
