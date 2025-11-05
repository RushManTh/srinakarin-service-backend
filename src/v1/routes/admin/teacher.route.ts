import { Elysia, t } from "elysia";
import {
  createTeacherController,
  updateTeacherController,
  deleteTeacherController,
  getTeacherByIdController,
  listTeachersController,
  listHomeroomStudentsByTeacherController,
} from "../../controllers/admin/teacher.controller";

export const teacherRoutes = new Elysia({ prefix: "/teacher" })
  .post("/create", createTeacherController, {
    body: t.Object({
      userId: t.String(),
      prefix: t.Optional(t.String()),
      firstName: t.String(),
      lastName: t.String(),
      firstNameEn: t.Optional(t.String()),
      lastNameEn: t.Optional(t.String()),
      department: t.String(),
      position: t.String(),
      phone: t.Optional(t.String()),
      birthDate: t.Optional(t.String()),
      address: t.Optional(t.String()),
      education: t.Optional(t.String()),
      experienceYears: t.Optional(t.Number()),
      profileImage: t.Optional(t.String()),
      isActive: t.Optional(t.Boolean()),
      note: t.Optional(t.String()),
      classroomId: t.Optional(t.String()),
    }),
    tags: ["Teacher (AdminRoutes)"],
    summary: "สร้างครู",
  })
  .put("/update/:id", updateTeacherController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      userId: t.Optional(t.String()),
      prefix: t.Optional(t.String()),
      firstNameEn: t.Optional(t.String()),
      lastNameEn: t.Optional(t.String()),
      employeeCode: t.Optional(t.String()),
      firstName: t.Optional(t.String()),
      lastName: t.Optional(t.String()),
      department: t.Optional(t.String()),
      position: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      birthDate: t.Optional(t.String()),
      address: t.Optional(t.String()),
      education: t.Optional(t.String()),
      experienceYears: t.Optional(t.Number()),
      profileImage: t.Optional(t.String()),
      isActive: t.Optional(t.Boolean()),
      note: t.Optional(t.String()),
      classroomId: t.Optional(t.String()),
    }),
    tags: ["Teacher (AdminRoutes)"],
    summary: "อัพเดตครู",
  })
  .delete("/delete/:id", deleteTeacherController, {
    params: t.Object({ id: t.String() }),
    tags: ["Teacher (AdminRoutes)"],
    summary: "ลบครู",
  })
  .get("/", listTeachersController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Teacher (AdminRoutes)"],
    summary: "รายชื่อครู",
  })
  .get("/:id", getTeacherByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Teacher (AdminRoutes)"],
    summary: "ดูข้อมูลครู",
  })
  .get("/:id/homeroom-students", listHomeroomStudentsByTeacherController, {
    params: t.Object({ id: t.String() }),
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Teacher (AdminRoutes)"],
    summary: "รายชื่อนักเรียนในห้องที่ครูเป็นครูประจำชั้น (filter/pagination)",
  });
