import { Elysia, t } from "elysia";
import {
  listLevelsController,
  getLevelByIdController,
} from "../../controllers/teacher/level.controller";

export const levelRoutes = new Elysia({ prefix: "/levels" })
  .get("/", listLevelsController, {
    tags: ["Level (TeacherRoutes)"],
    summary: "รายการระดับชั้น",
  })
  .get("/:id", getLevelByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Level (TeacherRoutes)"],
    summary: "ดูข้อมูลช่วงชั้น/ระดับ",
  });
