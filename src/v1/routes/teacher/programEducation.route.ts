import { Elysia, t } from "elysia";
import {
  listProgramEducationsController,
  getProgramEducationByIdController,
} from "../../controllers/teacher/programEducation.controller";

export const programEducationRoutes = new Elysia({
  prefix: "/program-educations",
})
  .get("/", listProgramEducationsController, {
    tags: ["ProgramEducation (TeacherRoutes)"],
    summary: "รายการหลักสูตรการศึกษา",
  })
  .get("/:id", getProgramEducationByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["ProgramEducation (TeacherRoutes)"],
    summary: "ดูข้อมูลหลักสูตรการศึกษา",
  });
