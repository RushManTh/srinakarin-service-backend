import { Elysia, t } from "elysia";
import {
  listCurriculumsController,
  getCurriculumByIdController,
  createCurriculumController,
  updateCurriculumController,
  deleteCurriculumController,
} from "../../controllers/admin/curriculum.controller";

export const curriculumRoutes = new Elysia({ prefix: "/curriculums" })
  .get("/", listCurriculumsController, {
    tags: ["Curriculum (AdminRoutes)"],
    summary: "รายการหลักสูตร",
  })
  .get("/:id", getCurriculumByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Curriculum (AdminRoutes)"],
    summary: "ดูข้อมูลหลักสูตร",
  })
  .post("/create", createCurriculumController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
    }),
    tags: ["Curriculum (AdminRoutes)"],
    summary: "สร้างหลักสูตร",
  })
  .patch("/update/:id", updateCurriculumController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
    }),
    tags: ["Curriculum (AdminRoutes)"],
    summary: "อัพเดตหลักสูตร",
  })
  .delete("/delete/:id", deleteCurriculumController, {
    params: t.Object({ id: t.String() }),
    tags: ["Curriculum (AdminRoutes)"],
    summary: "ลบหลักสูตร",
  });
