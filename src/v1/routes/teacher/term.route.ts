import { Elysia, t } from "elysia";
import {
  listTermsController,
  getTermByIdController,
} from "../../controllers/teacher/term.controller";

export const termRoutes = new Elysia({ prefix: "/terms" })
  .get("/", listTermsController, {
    tags: ["Term (TeacherRoutes)"],
    summary: "รายชื่อเทอม",
  })
  .get("/:id", getTermByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Term (TeacherRoutes)"],
    summary: "ข้อมูลเทอม",
  });
