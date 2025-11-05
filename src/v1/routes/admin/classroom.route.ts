import { Elysia, t } from "elysia";
import {
  listClassroomsController,
  getClassroomByIdController,
  createClassroomController,
  updateClassroomController,
  deleteClassroomController,
  listClassroomStudentsController,
  addStudentsToClassroomController,
  removeStudentFromClassroomController,
  listClassroomSubjectsController,
  addHomeroomTeacherController,
  removeHomeroomTeacherController,
} from "../../controllers/admin/classroom.controller";

export const classroomRoutes = new Elysia({ prefix: "/classrooms" })
  .get("/", listClassroomsController, {
    query: t.Object({
      search: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
    }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "รายชื่อห้องเรียน",
  })
  .get("/:id", getClassroomByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "ดูข้อมูลห้องเรียน",
  })
  .post("/create", createClassroomController, {
    body: t.Object({
      code: t.String(),
      name: t.String(),
      programEducationId: t.String(),
    }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "สร้างห้องเรียน",
  })
  .patch("/update/:id", updateClassroomController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      programEducationId: t.Optional(t.String()),
    }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "อัพเดตห้องเรียน",
  })
  .delete("/delete/:id", deleteClassroomController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "ลบห้องเรียน",
  })
  .get("/:id/students", listClassroomStudentsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "รายการนักเรียนในห้องเรียน",
  })
  .post("/:id/students", addStudentsToClassroomController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({ studentIds: t.Array(t.String()) }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "เพิ่มนักเรียนเข้าไปในห้องเรียน",
  })
  .delete("/:id/students/:studentId", removeStudentFromClassroomController, {
    params: t.Object({ id: t.String(), studentId: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "ลบนักเรียนออกจากห้องเรียน",
  })
  .get("/:id/subjects", listClassroomSubjectsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "รายการวิชาในห้องเรียน",
  })
  .post("/:id/homeroom-teachers", addHomeroomTeacherController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({ teacherId: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "เพิ่มครูเป็นครูประจำห้องเรียน",
  })
  .delete("/:id/homeroom-teachers", removeHomeroomTeacherController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({ teacherId: t.String() }),
    tags: ["Classroom (AdminRoutes)"],
    summary: "ลบครูออกจากครูประจำห้องเรียน",
  });
