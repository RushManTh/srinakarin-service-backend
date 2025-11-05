import { Elysia, t } from "elysia";
import {
  listLevelsController,
  getLevelByIdController,
  createLevelController,
  updateLevelController,
  deleteLevelController,
} from "../../controllers/admin/level.controller";

export const levelRoutes = new Elysia({ prefix: "/levels" })
  .get("/", listLevelsController, {
    tags: ["Level (AdminRoutes)"],
    summary: "รายการระดับชั้น",
  })
  .get("/:id", getLevelByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Level (AdminRoutes)"],
    summary: "ดูข้อมูลช่วงชั้น/ระดับ",
  })
  .post("/create", createLevelController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
    }),
    tags: ["Level (AdminRoutes)"],
    summary: "สร้างช่วงชั้น/ระดับ",
  })
  .patch("/update/:id", updateLevelController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
    }),
    tags: ["Level (AdminRoutes)"],
    summary: "อัพเดตช่วงชั้น/ระดับ",
  })
  .delete("/delete/:id", deleteLevelController, {
    params: t.Object({ id: t.String() }),
    tags: ["Level (AdminRoutes)"],
    summary: "ลบช่วงชั้น/ระดับ",
  });
