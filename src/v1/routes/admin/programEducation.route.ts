import { Elysia, t } from "elysia";
import {
  listProgramEducationsController,
  getProgramEducationByIdController,
  createProgramEducationController,
  updateProgramEducationController,
  deleteProgramEducationController,
} from "../../controllers/admin/programEducation.controller";

export const programEducationRoutes = new Elysia({
  prefix: "/program-educations",
})
  .get("/", listProgramEducationsController, {
    tags: ["ProgramEducation (AdminRoutes)"],
    summary: "รายการหลักสูตรการศึกษา",
  })
  .get("/:id", getProgramEducationByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["ProgramEducation (AdminRoutes)"],
    summary: "ดูข้อมูลหลักสูตรการศึกษา",
  })
  .post("/create", createProgramEducationController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      enName: t.Optional(t.String()),
      description: t.Optional(t.String()),
    }),
    tags: ["ProgramEducation (AdminRoutes)"],
    summary: "สร้างหลักสูตรการศึกษา",
  })
  .patch("/update/:id", updateProgramEducationController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      enName: t.Optional(t.String()),
      description: t.Optional(t.String()),
    }),
    tags: ["ProgramEducation (AdminRoutes)"],
    summary: "อัพเดตหลักสูตรการศึกษา",
  })
  .delete("/delete/:id", deleteProgramEducationController, {
    params: t.Object({ id: t.String() }),
    tags: ["ProgramEducation (AdminRoutes)"],
    summary: "ลบหลักสูตรการศึกษา",
  });
