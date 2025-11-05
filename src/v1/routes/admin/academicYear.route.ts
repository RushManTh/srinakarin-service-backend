import { Elysia, t } from "elysia";
import {
  listAcademicYearsController,
  getAcademicYearByIdController,
  createAcademicYearController,
  updateAcademicYearController,
  deleteAcademicYearController,
  listTermsByAcademicYearController,
} from "../../controllers/admin/academicYear.controller";

export const academicYearRoutes = new Elysia({ prefix: "/academic-years" })
  .get("/", listAcademicYearsController, {
    tags: ["AcademicYear (AdminRoutes)"],
    summary: "รายชื่อปีการศึกษา",
  })
  .get("/:id", getAcademicYearByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AcademicYear (AdminRoutes)"],
    summary: "ข้อมูลปีการศึกษา",
  })
  .post("/create", createAcademicYearController, {
    body: t.Object({
      year: t.String(),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
    }),
    tags: ["AcademicYear (AdminRoutes)"],
    summary: "เพิ่มปีการศึกษา",
  })
  .patch("/update/:id", updateAcademicYearController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      year: t.Optional(t.String()),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
    }),
    tags: ["AcademicYear (AdminRoutes)"],
    summary: "แก้ไขปีการศึกษา",
  })
  .delete("/delete/:id", deleteAcademicYearController, {
    params: t.Object({ id: t.String() }),
    tags: ["AcademicYear (AdminRoutes)"],
    summary: "ลบปีการศึกษา",
  })
  .get("/:id/terms", listTermsByAcademicYearController, {
    params: t.Object({ id: t.String() }),
    tags: ["AcademicYear (AdminRoutes)"],
    summary: "ดูเทอมในปีการศึกษานั้น",
  });
