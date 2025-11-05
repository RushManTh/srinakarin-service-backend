import { Elysia, t } from "elysia";
import {
  listSubjectTypesController,
  getSubjectTypeByIdController,
} from "../../controllers/teacher/subjectType.controller";

export const subjectTypeRoutes = new Elysia({ prefix: "/subject-types" })
  .get("/", listSubjectTypesController, {
    tags: ["SubjectType (TeacherRoutes)"],
    summary: "รายการประเภทวิชา",
  })
  .get("/:id", getSubjectTypeByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["SubjectType (TeacherRoutes)"],
    summary: "ดูข้อมูลประเภทวิชา",
  });
