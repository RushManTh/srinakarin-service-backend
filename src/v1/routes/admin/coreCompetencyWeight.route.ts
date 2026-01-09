import { Elysia, t } from "elysia";
import {
  listWeightsController,
  getWeightById,
  createWeight,
  updateWeight,
  deleteWeight,
  validateWeightSum,
} from "../../controllers/admin/coreCompetencyWeight.controller";

export const coreCompetencyWeightRoute = new Elysia({
  prefix: "/core-competency-weights",
})
  .get("/", listWeightsController, {
    query: t.Object({
      coreCompetencyId: t.Optional(t.String()),
      levelId: t.Optional(t.String()),
      learningAreaId: t.Optional(t.String()),
      isActive: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      pageSize: t.Optional(t.Numeric()),
    }),
    tags: ["CoreCompetencyWeight (AdminRoutes)"],
    summary: "รายการ Weight Configuration",
  })
  .get("/:id", getWeightById, {
    params: t.Object({ id: t.String() }),
    tags: ["CoreCompetencyWeight (AdminRoutes)"],
    summary: "ดูข้อมูล Weight Configuration",
  })
  .post("/create", createWeight, {
    body: t.Object({
      coreCompetencyId: t.String(),
      learningAreaId: t.String(),
      weight: t.Number(),
      levelId: t.Optional(t.String()),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["CoreCompetencyWeight (AdminRoutes)"],
    summary: "สร้าง Weight Configuration",
  })
  .patch("/update/:id", updateWeight, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      weight: t.Optional(t.Number()),
      levelId: t.Optional(t.String()),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["CoreCompetencyWeight (AdminRoutes)"],
    summary: "แก้ไข Weight Configuration",
  })
  .delete("/delete/:id", deleteWeight, {
    params: t.Object({ id: t.String() }),
    tags: ["CoreCompetencyWeight (AdminRoutes)"],
    summary: "ลบ Weight Configuration",
  })
  .post("/validate", validateWeightSum, {
    body: t.Object({
      coreCompetencyId: t.String(),
      levelId: t.Optional(t.String()),
    }),
    tags: ["CoreCompetencyWeight (AdminRoutes)"],
    summary: "ตรวจสอบ Weight รวม 100%",
  });
