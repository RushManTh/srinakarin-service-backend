import { Elysia, t } from "elysia";
import {
  listStudentHealthController,
  getStudentHealthByIdController,
  createStudentHealthController,
  updateStudentHealthController,
  deleteStudentHealthController,
  createManyStudentHealthController,
  updateManyStudentHealthController,
  deleteManyStudentHealthController,
} from "../../controllers/admin/studentHealth.controller";

export const studentHealthRoutes = new Elysia({ prefix: "/student-health" })
  .get("/", listStudentHealthController, {
    query: t.Object({ studentId: t.String() }),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "ประวัติสุขภาพของนักเรียน",
  })
  .get("/:id", getStudentHealthByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "ดูข้อมูลสุขภาพรายรายการ",
  })
  .post("/create", createStudentHealthController, {
    body: t.Object({
      studentId: t.String(),
      recordDate: t.String(),
      height: t.Optional(t.Number()),
      weight: t.Optional(t.Number()),
      bloodGroup: t.Optional(t.String()),
      congenitalDisease: t.Optional(t.String()),
      allergy: t.Optional(t.String()),
      disability: t.Optional(t.String()),
      note: t.Optional(t.String()),
    }),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "เพิ่มประวัติสุขภาพ",
  })
  .post("/create-many", createManyStudentHealthController, {
    body: t.Array(
      t.Object({
        studentId: t.String(),
        recordDate: t.String(),
        height: t.Optional(t.Number()),
        weight: t.Optional(t.Number()),
        bloodGroup: t.Optional(t.String()),
        congenitalDisease: t.Optional(t.String()),
        allergy: t.Optional(t.String()),
        disability: t.Optional(t.String()),
        note: t.Optional(t.String()),
      })
    ),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "เพิ่มประวัติสุขภาพหลายรายการ",
  })
  .patch("/update/:id", updateStudentHealthController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      recordDate: t.Optional(t.String()),
      height: t.Optional(t.Number()),
      weight: t.Optional(t.Number()),
      bloodGroup: t.Optional(t.String()),
      congenitalDisease: t.Optional(t.String()),
      allergy: t.Optional(t.String()),
      disability: t.Optional(t.String()),
      note: t.Optional(t.String()),
    }),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "แก้ไขประวัติสุขภาพ",
  })
  .patch("/update-many", updateManyStudentHealthController, {
    body: t.Array(
      t.Object({
        id: t.String(),
        data: t.Object({
          recordDate: t.Optional(t.String()),
          height: t.Optional(t.Number()),
          weight: t.Optional(t.Number()),
          bloodGroup: t.Optional(t.String()),
          congenitalDisease: t.Optional(t.String()),
          allergy: t.Optional(t.String()),
          disability: t.Optional(t.String()),
          note: t.Optional(t.String()),
        }),
      })
    ),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "แก้ไขประวัติสุขภาพหลายรายการ",
  })
  .delete("/delete/:id", deleteStudentHealthController, {
    params: t.Object({ id: t.String() }),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "ลบประวัติสุขภาพ",
  })
  .delete("/delete-many", deleteManyStudentHealthController, {
    body: t.Array(t.String()),
    tags: ["StudentHealth (AdminRoutes)"],
    summary: "ลบประวัติสุขภาพหลายรายการ",
  });
