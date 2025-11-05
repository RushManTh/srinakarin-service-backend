import { Elysia, t } from "elysia";
import {
  listMontessoriActivitiesController,
  getMontessoriActivityByIdController,
  createMontessoriActivityController,
  updateMontessoriActivityController,
  deleteMontessoriActivityController,
} from "../../controllers/admin/montessoriActivity.controller";

export const montessoriActivityRoutes = new Elysia({
  prefix: "/montessori-activities",
})
  .get("/", listMontessoriActivitiesController, {
    tags: ["Montessori Activities (AdminRoutes)"],
    summary: "List Montessori activities",
  })
  .get("/:id", getMontessoriActivityByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Activities (AdminRoutes)"],
    summary: "Get Montessori activity by id",
  })
  .post("/create", createMontessoriActivityController, {
    body: t.Object({
      topicId: t.String(),
      code: t.String(),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      name: t.String(),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
      materialNotes: t.Optional(t.Union([t.String(), t.Null()])),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["Montessori Activities (AdminRoutes)"],
    summary: "Create Montessori activity",
  })
  .patch("/update/:id", updateMontessoriActivityController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      topicId: t.Optional(t.String()),
      code: t.Optional(t.String()),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      name: t.Optional(t.String()),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
      materialNotes: t.Optional(t.Union([t.String(), t.Null()])),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["Montessori Activities (AdminRoutes)"],
    summary: "Update Montessori activity",
  })
  .delete("/delete/:id", deleteMontessoriActivityController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Activities (AdminRoutes)"],
    summary: "Delete Montessori activity",
  });
