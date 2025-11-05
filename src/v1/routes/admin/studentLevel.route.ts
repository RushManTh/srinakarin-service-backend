import { Elysia, t } from "elysia";
import {
  listStudentLevelsController,
  getStudentLevelByIdController,
  createStudentLevelController,
  updateStudentLevelController,
  deleteStudentLevelController,
} from "../../controllers/admin/studentLevel.controller";

export const studentLevelRoutes = new Elysia({ prefix: "/student-levels" })
  .get("/", listStudentLevelsController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["StudentLevel (AdminRoutes)"],
    summary: "รายการระดับนักเรียน",
  })
  .get("/:id", getStudentLevelByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["StudentLevel (AdminRoutes)"],
    summary: "ดูข้อมูลระดับชั้นของนักเรียน",
  })
  .post("/create", createStudentLevelController, {
    body: t.Object({
      name: t.String(),
      enName: t.Optional(t.String()),
      code: t.String(),
      order: t.Number(),
      levelId: t.String(),
    }),
    tags: ["StudentLevel (AdminRoutes)"],
    summary: "สร้างระดับชั้นของนักเรียน",
  })
  .patch("/update/:id", updateStudentLevelController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      enName: t.Optional(t.String()),
      code: t.Optional(t.String()),
      order: t.Optional(t.Number()),
      levelId: t.Optional(t.String()),
    }),
    tags: ["StudentLevel (AdminRoutes)"],
    summary: "อัพเดตระดับชั้นของนักเรียน",
  })
  .delete("/delete/:id", deleteStudentLevelController, {
    params: t.Object({ id: t.String() }),
    tags: ["StudentLevel (AdminRoutes)"],
    summary: "ลบระดับชั้นของนักเรียน",
  });
