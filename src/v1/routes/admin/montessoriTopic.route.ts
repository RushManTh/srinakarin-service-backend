import { Elysia, t } from "elysia";
import {
  listMontessoriTopicsController,
  getMontessoriTopicByIdController,
  createMontessoriTopicController,
  updateMontessoriTopicController,
  deleteMontessoriTopicController,
} from "../../controllers/admin/montessoriTopic.controller";

export const montessoriTopicRoutes = new Elysia({
  prefix: "/montessori-topics",
})
  .get("/", listMontessoriTopicsController, {
    tags: ["Montessori Topics (AdminRoutes)"],
    summary: "List Montessori topics",
  })
  .get("/:id", getMontessoriTopicByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Topics (AdminRoutes)"],
    summary: "Get Montessori topic by id",
  })
  .post("/create", createMontessoriTopicController, {
    body: t.Object({
      subcategoryId: t.String(),
      code: t.String(),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      name: t.String(),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    tags: ["Montessori Topics (AdminRoutes)"],
    summary: "Create Montessori topic",
  })
  .patch("/update/:id", updateMontessoriTopicController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      subcategoryId: t.Optional(t.String()),
      code: t.Optional(t.String()),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      name: t.Optional(t.String()),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    tags: ["Montessori Topics (AdminRoutes)"],
    summary: "Update Montessori topic",
  })
  .delete("/delete/:id", deleteMontessoriTopicController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Topics (AdminRoutes)"],
    summary: "Delete Montessori topic",
  });
