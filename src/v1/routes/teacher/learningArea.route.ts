import { Elysia, t } from "elysia";
import {
  listLearningAreasController,
  getLearningAreaByIdController,
} from "../../controllers/teacher/learningArea.controller";

export const learningAreaRoutes = new Elysia({
  prefix: "/learning-areas",
})
  .get("/", listLearningAreasController, {
    tags: ["LearningArea (TeacherRoutes)"],
    summary: "รายการกลุ่มสาระการเรียนรู้",
  })
  .get("/:id", getLearningAreaByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["LearningArea (TeacherRoutes)"],
    summary: "ดูข้อมูลกลุ่มสาระการเรียนรู้",
  });
