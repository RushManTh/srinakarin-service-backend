import { Elysia, t } from "elysia";
import {
  listMontessoriLearnedController,
  getMontessoriLearnedByIdController,
  upsertMontessoriLearnedController,
  toggleMontessoriLearnedController,
  deleteMontessoriLearnedController,
  upsertMontessoriLearnedBatchController,
  toggleMontessoriLearnedBatchController,
  listLearnedByStudentAndCategoryController,
} from "../../controllers/admin/montessoriActivityLearned.controller";

export const montessoriActivityLearnedRoutes = new Elysia({
  prefix: "/montessori-learned",
})
  .get("/", listMontessoriLearnedController, {
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "List learned ticks",
  })
  .get("/by-student-and-category", listLearnedByStudentAndCategoryController, {
    query: t.Object({ studentId: t.String(), categoryId: t.String() }),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "List learned ticks by studentId and categoryId",
  })
  .get("/:id", getMontessoriLearnedByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "Get learned tick",
  })
  .post("/upsert", upsertMontessoriLearnedController, {
    body: t.Object({
      studentId: t.String(),
      activityId: t.String(),
      learned: t.Boolean(),
      learnedAt: t.Optional(t.Union([t.String(), t.Null()])),
      note: t.Optional(t.Union([t.String(), t.Null()])),
      markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "Upsert learned tick",
  })
  .post("/toggle", toggleMontessoriLearnedController, {
    body: t.Object({
      studentId: t.String(),
      activityId: t.String(),
      note: t.Optional(t.Union([t.String(), t.Null()])),
      markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "Toggle learned tick",
  })
  .post("/upsert-batch", upsertMontessoriLearnedBatchController, {
    body: t.Array(
      t.Object({
        studentId: t.String(),
        activityId: t.String(),
        learned: t.Boolean(),
        learnedAt: t.Optional(t.Union([t.String(), t.Null()])),
        note: t.Optional(t.Union([t.String(), t.Null()])),
        markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
      })
    ),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "Upsert learned ticks in batch",
  })
  .post("/toggle-batch", toggleMontessoriLearnedBatchController, {
    body: t.Array(
      t.Object({
        studentId: t.String(),
        activityId: t.String(),
        note: t.Optional(t.Union([t.String(), t.Null()])),
        markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
      })
    ),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "Toggle learned ticks in batch",
  })
  .delete("/delete/:id", deleteMontessoriLearnedController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Learned (AdminRoutes)"],
    summary: "Delete learned tick",
  });
