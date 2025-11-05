import { Elysia, t } from "elysia";
import {
  listMontessoriCategoriesController,
  getMontessoriCategoryByIdController,
  createMontessoriCategoryController,
  updateMontessoriCategoryController,
  deleteMontessoriCategoryController,
} from "../../controllers/admin/montessoriCategory.controller";

export const montessoriCategoryRoutes = new Elysia({
  prefix: "/montessori-categories",
})
  .get("/", listMontessoriCategoriesController, {
    tags: ["Montessori Categories (AdminRoutes)"],
    summary: "List Montessori categories",
  })
  .get("/:id", getMontessoriCategoryByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Categories (AdminRoutes)"],
    summary: "Get Montessori category by id",
  })
  .post("/create", createMontessoriCategoryController, {
    body: t.Object({
      schoolSubjectIds: t.Array(t.String()),
      levelId: t.Optional(t.Union([t.String(), t.Null()])),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      code: t.String(),
      name: t.String(),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["Montessori Categories (AdminRoutes)"],
    summary: "Create Montessori category",
  })
  .patch("/update/:id", updateMontessoriCategoryController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      schoolSubjectIds: t.Optional(t.Array(t.String())),
      levelId: t.Optional(t.Union([t.String(), t.Null()])),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["Montessori Categories (AdminRoutes)"],
    summary: "Update Montessori category",
  })
  .delete("/delete/:id", deleteMontessoriCategoryController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Categories (AdminRoutes)"],
    summary: "Delete Montessori category",
  });
