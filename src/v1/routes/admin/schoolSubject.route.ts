import { Elysia, t } from "elysia";
import {
  listSchoolSubjectsController,
  getSchoolSubjectByIdController,
  createSchoolSubjectController,
  updateSchoolSubjectController,
  deleteSchoolSubjectController,
} from "../../controllers/admin/schoolSubject.controller";
import { LearningApproach } from "../../../generated/prisma";

export const schoolSubjectRoutes = new Elysia({ prefix: "/school-subjects" })
  .get("/", listSchoolSubjectsController, {
    tags: ["SchoolSubject (AdminRoutes)"],
    summary: "รายการวิชาในโรงเรียน (School Subject)",
  })
  .get("/:id", getSchoolSubjectByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["SchoolSubject (AdminRoutes)"],
    summary: "ดูข้อมูลวิชาในโรงเรียน (School Subject)",
  })
  .post("/create", createSchoolSubjectController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      curriculumSubjectId: t.String(),
      learningAreaId: t.String(),
      subjectTypeId: t.String(),
      learningApproach: t.Enum(LearningApproach),
    }),
    tags: ["SchoolSubject (AdminRoutes)"],
    summary: "สร้างวิชาในโรงเรียน (School Subject)",
  })
  .patch("/update/:id", updateSchoolSubjectController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      curriculumSubjectId: t.Optional(t.String()),
      learningAreaId: t.Optional(t.String()),
      subjectTypeId: t.Optional(t.String()),
      learningApproach: t.Optional(t.Enum(LearningApproach)),
    }),
    tags: ["SchoolSubject (AdminRoutes)"],
    summary: "อัพเดตวิชาในโรงเรียน (School Subject)",
  })
  .delete("/delete/:id", deleteSchoolSubjectController, {
    params: t.Object({ id: t.String() }),
    tags: ["SchoolSubject (AdminRoutes)"],
    summary: "ลบวิชาในโรงเรียน (School Subject)",
  });
