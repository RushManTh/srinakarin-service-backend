import { Elysia, t } from "elysia";
import {
  listAssignmentCompetenciesController,
  getAssignmentCompetencyByIdController,
  createAssignmentCompetencyController,
  updateAssignmentCompetencyController,
  deleteAssignmentCompetencyController,
  deleteAssignmentCompetenciesByAssignmentIdController,
  getAssignmentCompetenciesByAssignmentIdController,
} from "../../controllers/teacher/assignmentCompetency.controller";

export const assignmentCompetencyRoutes = new Elysia({
  prefix: "/assignment-competencies",
})
  .get("/", listAssignmentCompetenciesController, {
    tags: ["AssignmentCompetency (TeacherRoutes)"],
    summary: "รายการตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .get("/:id", getAssignmentCompetencyByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentCompetency (TeacherRoutes)"],
    summary: "ดูข้อมูลตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .post("/create", createAssignmentCompetencyController, {
    body: t.Object({
      assignmentId: t.String(),
      competencyId: t.String(),
    }),
    tags: ["AssignmentCompetency (TeacherRoutes)"],
    summary: "สร้างตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .patch("/update/:id", updateAssignmentCompetencyController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      assignmentId: t.Optional(t.String()),
      competencyId: t.Optional(t.String()),
    }),
    tags: ["AssignmentCompetency (TeacherRoutes)"],
    summary: "อัพเดตตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .delete("/delete/:id", deleteAssignmentCompetencyController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentCompetency (TeacherRoutes)"],
    summary: "ลบตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .get(
    "/assignment/:assignmentId",
    getAssignmentCompetenciesByAssignmentIdController,
    {
      params: t.Object({ assignmentId: t.String() }),
      tags: ["AssignmentCompetency (TeacherRoutes)"],
      summary: "ดูรายการตัวชี้วัดงานทั้งหมดโดยใช้ Assignment ID",
    }
  )
  .delete(
    "/delete/assignment/:assignmentId",
    deleteAssignmentCompetenciesByAssignmentIdController,
    {
      params: t.Object({ assignmentId: t.String() }),
      tags: ["AssignmentCompetency (TeacherRoutes)"],
      summary: "ลบตัวชี้วัดงานทั้งหมดโดยใช้ Assignment ID",
    }
  );
