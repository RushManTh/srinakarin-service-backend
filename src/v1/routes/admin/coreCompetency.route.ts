import { Elysia, t } from "elysia";
import {
  listCoreCompetenciesController,
  getCoreCompetencyById,
  createCoreCompetency,
  updateCoreCompetency,
  deleteCoreCompetency,
} from "../../controllers/admin/coreCompetency.controller";

export const coreCompetencyRoute = new Elysia({
  prefix: "/core-competencies",
})
  .get("/", listCoreCompetenciesController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      pageSize: t.Optional(t.Numeric()),
    }),
    tags: ["CoreCompetency (AdminRoutes)"],
    summary: "รายการสมรรถนะหลัก",
  })
  .get("/:id", getCoreCompetencyById, {
    params: t.Object({ id: t.String() }),
    tags: ["CoreCompetency (AdminRoutes)"],
    summary: "ดูข้อมูลสมรรถนะหลัก",
  })
  .post("/create", createCoreCompetency, {
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.String(),
      description: t.Optional(t.String()),
      competencyIds: t.Optional(t.Array(t.String())),
    }),
    tags: ["CoreCompetency (AdminRoutes)"],
    summary: "สร้างสมรรถนะหลัก",
  })
  .patch("/update/:id", updateCoreCompetency, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      competencyIds: t.Optional(t.Array(t.String())),
    }),
    tags: ["CoreCompetency (AdminRoutes)"],
    summary: "แก้ไขสมรรถนะหลัก",
  })
  .delete("/delete/:id", deleteCoreCompetency, {
    params: t.Object({ id: t.String() }),
    tags: ["CoreCompetency (AdminRoutes)"],
    summary: "ลบสมรรถนะหลัก",
  });
