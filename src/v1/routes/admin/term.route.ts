import { Elysia, t } from "elysia";
import {
  listTermsController,
  getTermByIdController,
  createTermController,
  updateTermController,
  deleteTermController,
} from "../../controllers/admin/term.controller";

export const termRoutes = new Elysia({ prefix: "/terms" })
  .get("/", listTermsController, {
    tags: ["Term (AdminRoutes)"],
    summary: "รายชื่อเทอม",
  })
  .get("/:id", getTermByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Term (AdminRoutes)"],
    summary: "ข้อมูลเทอม",
  })
  .post("/create", createTermController, {
    body: t.Object({
      name: t.String(),
      academicYearId: t.String(),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
    }),
    tags: ["Term (AdminRoutes)"],
    summary: "เพิ่มเทอม",
  })
  .patch("/update/:id", updateTermController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      academicYearId: t.Optional(t.String()),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
    }),
    tags: ["Term (AdminRoutes)"],
    summary: "แก้ไขเทอม",
  })
  .delete("/delete/:id", deleteTermController, {
    params: t.Object({ id: t.String() }),
    tags: ["Term (AdminRoutes)"],
    summary: "ลบเทอม",
  });
