import { Elysia, t } from "elysia";
import {
  listLearningAreasController,
  getLearningAreaByIdController,
  createLearningAreaController,
  updateLearningAreaController,
  deleteLearningAreaController,
} from "../../controllers/admin/learningArea.controller";

export const learningAreaRoutes = new Elysia({ prefix: "/learning-areas" })
  .get("/", listLearningAreasController, {
    tags: ["LearningArea (AdminRoutes)"],
    summary: "รายการกลุ่มสาระการเรียนรู้ (Learning Area)",
  })
  .get("/:id", getLearningAreaByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["LearningArea (AdminRoutes)"],
    summary: "ดูข้อมูลกลุ่มสาระการเรียนรู้ (Learning Area)",
  })
  .post("/create", createLearningAreaController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      enName: t.Optional(t.String()),
      description: t.Optional(t.String()),
    }),
    tags: ["LearningArea (AdminRoutes)"],
    summary: "สร้างกลุ่มสาระการเรียนรู้ (Learning Area)",
  })
  .patch("/update/:id", updateLearningAreaController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      enName: t.Optional(t.String()),
      description: t.Optional(t.String()),
    }),
    tags: ["LearningArea (AdminRoutes)"],
    summary: "อัพเดตกลุ่มสาระการเรียนรู้ (Learning Area)",
  })
  .delete("/delete/:id", deleteLearningAreaController, {
    params: t.Object({ id: t.String() }),
    tags: ["LearningArea (AdminRoutes)"],
    summary: "ลบกลุ่มสาระการเรียนรู้ (Learning Area)",
  });
