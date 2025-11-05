import { Elysia, t } from "elysia";
import {
  listSubjectTypesController,
  getSubjectTypeByIdController,
  createSubjectTypeController,
  updateSubjectTypeController,
  deleteSubjectTypeController,
} from "../../controllers/admin/subjectType.controller";

export const subjectTypeRoutes = new Elysia({ prefix: "/subject-types" })
  .get("/", listSubjectTypesController, {
    tags: ["SubjectType (AdminRoutes)"],
    summary: "รายการประเภทวิชา",
  })
  .get("/:id", getSubjectTypeByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectType (AdminRoutes)"],
    summary: "ดูข้อมูลประเภทวิชา",
  })
  .post("/create", createSubjectTypeController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
    }),
    tags: ["SubjectType (AdminRoutes)"],
    summary: "สร้างประเภทวิชา",
  })
  .patch("/update/:id", updateSubjectTypeController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
    }),
    tags: ["SubjectType (AdminRoutes)"],
    summary: "อัพเดตประเภทวิชา",
  })
  .delete("/delete/:id", deleteSubjectTypeController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectType (AdminRoutes)"],
    summary: "ลบประเภทวิชา",
  });
