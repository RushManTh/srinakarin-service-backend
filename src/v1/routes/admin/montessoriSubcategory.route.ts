import { Elysia, t } from "elysia";
import {
  listMontessoriSubcategoriesController,
  getMontessoriSubcategoryByIdController,
  createMontessoriSubcategoryController,
  updateMontessoriSubcategoryController,
  deleteMontessoriSubcategoryController,
} from "../../controllers/admin/montessoriSubcategory.controller";

export const montessoriSubcategoryRoutes = new Elysia({
  prefix: "/montessori-subcategories",
})
  .get("/", listMontessoriSubcategoriesController, {
    tags: ["Montessori Subcategories (AdminRoutes)"],
    summary: "List Montessori subcategories",
  })
  .get("/:id", getMontessoriSubcategoryByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Subcategories (AdminRoutes)"],
    summary: "Get Montessori subcategory by id",
  })
  .post("/create", createMontessoriSubcategoryController, {
    body: t.Object({
      categoryId: t.String(),
      code: t.String(),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      name: t.String(),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["Montessori Subcategories (AdminRoutes)"],
    summary: "Create Montessori subcategory",
  })
  .patch("/update/:id", updateMontessoriSubcategoryController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      categoryId: t.Optional(t.String()),
      code: t.Optional(t.String()),
      order: t.Optional(t.Union([t.Number(), t.Null()])),
      name: t.Optional(t.String()),
      enName: t.Optional(t.Union([t.String(), t.Null()])),
      description: t.Optional(t.Union([t.String(), t.Null()])),
      isActive: t.Optional(t.Boolean()),
    }),
    tags: ["Montessori Subcategories (AdminRoutes)"],
    summary: "Update Montessori subcategory",
  })
  .delete("/delete/:id", deleteMontessoriSubcategoryController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Subcategories (AdminRoutes)"],
    summary: "Delete Montessori subcategory",
  });
