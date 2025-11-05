import { Elysia, t } from "elysia";
import {
  getClassroomByIdController,
  listClassroomStudentsController,
  listClassroomSubjectsController,
} from "../../controllers/teacher/classroom.controller";
import { requireTeacherResource } from "../../middleware/requireTeacherResource";
import { prisma } from "../../models/prisma";

export const classroomRoutes = new Elysia({ prefix: "/classrooms" })
  .get("/:id", getClassroomByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (TeacherRoutes)"],
    summary: "ดูข้อมูลห้องเรียน",
  })
  .get("/:id/students", listClassroomStudentsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (TeacherRoutes)"],
    summary: "รายการนักเรียนในห้องเรียน",
  })
  .get("/:id/subjects", listClassroomSubjectsController, {
    params: t.Object({ id: t.String() }),
    tags: ["Classroom (TeacherRoutes)"],
    summary: "รายการวิชาในห้องเรียน",
  });
