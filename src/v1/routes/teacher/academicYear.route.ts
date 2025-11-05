import { Elysia, t } from "elysia";
import {
  listAcademicYearsController,
  getAcademicYearByIdController,
  listTermsByAcademicYearController,
} from "../../controllers/teacher/academicYear.controller";

export const academicYearRoutes = new Elysia({
  prefix: "/academic-years",
})
  .get("/", listAcademicYearsController, {
    tags: ["AcademicYear (TeacherRoutes)"],
    summary: "รายชื่อปีการศึกษา",
  })
  .get("/:id", getAcademicYearByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AcademicYear (TeacherRoutes)"],
    summary: "ข้อมูลปีการศึกษา",
  })
  .get("/:id/terms", listTermsByAcademicYearController, {
    params: t.Object({ id: t.String() }),
    tags: ["AcademicYear (TeacherRoutes)"],
    summary: "ดูเทอมในปีการศึกษานั้น",
  });
