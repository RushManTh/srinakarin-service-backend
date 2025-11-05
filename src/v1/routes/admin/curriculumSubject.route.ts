import { Elysia, t } from "elysia";
import {
  listCurriculumSubjectsController,
  getCurriculumSubjectByIdController,
  createCurriculumSubjectController,
  updateCurriculumSubjectController,
  deleteCurriculumSubjectController,
} from "../../controllers/admin/curriculumSubject.controller";

export const curriculumSubjectRoutes = new Elysia({
  prefix: "/curriculum-subjects",
})
  .get("/", listCurriculumSubjectsController, {
    tags: ["CurriculumSubject (AdminRoutes)"],
    summary: "รายการวิชาในหลักสูตร",
  })
  .get("/:id", getCurriculumSubjectByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["CurriculumSubject (AdminRoutes)"],
    summary: "ดูข้อมูลวิชาในหลักสูตร",
  })
  .post("/create", createCurriculumSubjectController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      credit: t.Number(),
      subjectGroupId: t.String(),
      curriculumId: t.String(),
      studentLevelId: t.String(),
    }),
    tags: ["CurriculumSubject (AdminRoutes)"],
    summary: "สร้างวิชาในหลักสูตร",
  })
  .patch("/update/:id", updateCurriculumSubjectController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      credit: t.Optional(t.Number()),
      subjectGroupId: t.Optional(t.String()),
      curriculumId: t.Optional(t.String()),
      studentLevelId: t.Optional(t.String()),
    }),
    tags: ["CurriculumSubject (AdminRoutes)"],
    summary: "อัพเดตวิชาในหลักสูตร",
  })
  .delete("/delete/:id", deleteCurriculumSubjectController, {
    params: t.Object({ id: t.String() }),
    tags: ["CurriculumSubject (AdminRoutes)"],
    summary: "ลบวิชาในหลักสูตร",
  });
