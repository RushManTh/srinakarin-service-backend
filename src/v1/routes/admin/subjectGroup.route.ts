import { Elysia, t } from "elysia";
import {
  listSubjectGroupsController,
  getSubjectGroupByIdController,
  createSubjectGroupController,
  updateSubjectGroupController,
  deleteSubjectGroupController,
} from "../../controllers/admin/subjectGroup.controller";

export const subjectGroupRoutes = new Elysia({ prefix: "/subject-groups" })
  .get("/", listSubjectGroupsController, {
    tags: ["SubjectGroup (AdminRoutes)"],
    summary: "รายการกลุ่มสาระการเรียนรู้",
  })
  .get("/:id", getSubjectGroupByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectGroup (AdminRoutes)"],
    summary: "ดูข้อมูลกลุ่มสาระการเรียนรู้",
  })
  .post("/create", createSubjectGroupController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      enName: t.Optional(t.String()),
      description: t.Optional(t.String()),
      curriculumId: t.String(),
    }),
    tags: ["SubjectGroup (AdminRoutes)"],
    summary: "สร้างกลุ่มสาระการเรียนรู้",
  })
  .patch("/update/:id", updateSubjectGroupController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      enName: t.Optional(t.String()),
      description: t.Optional(t.String()),
      curriculumId: t.Optional(t.String()),
    }),
    tags: ["SubjectGroup (AdminRoutes)"],
    summary: "อัพเดตกลุ่มสาระการเรียนรู้",
  })
  .delete("/delete/:id", deleteSubjectGroupController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectGroup (AdminRoutes)"],
    summary: "ลบกลุ่มสาระการเรียนรู้",
  });
