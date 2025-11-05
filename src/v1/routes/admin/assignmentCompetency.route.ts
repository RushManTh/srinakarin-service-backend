import { Elysia, t } from "elysia";
import {
  listAssignmentCompetenciesController,
  getAssignmentCompetencyByIdController,
  createAssignmentCompetencyController,
  updateAssignmentCompetencyController,
  deleteAssignmentCompetencyController,
} from "../../controllers/admin/assignmentCompetency.controller";

export const assignmentCompetencyRoutes = new Elysia({
  prefix: "/assignment-competencies",
})
  .get("/", listAssignmentCompetenciesController, {
    tags: ["AssignmentCompetency (AdminRoutes)"],
    summary: "รายการตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .get("/:id", getAssignmentCompetencyByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentCompetency (AdminRoutes)"],
    summary: "ดูข้อมูลตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .post("/create", createAssignmentCompetencyController, {
    body: t.Object({
      assignmentId: t.String(),
      competencyId: t.String(),
    }),
    tags: ["AssignmentCompetency (AdminRoutes)"],
    summary: "สร้างตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .patch("/update/:id", updateAssignmentCompetencyController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      assignmentId: t.Optional(t.String()),
      competencyId: t.Optional(t.String()),
    }),
    tags: ["AssignmentCompetency (AdminRoutes)"],
    summary: "อัพเดตตัวชี้วัดงาน (AssignmentCompetency)",
  })
  .delete("/delete/:id", deleteAssignmentCompetencyController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentCompetency (AdminRoutes)"],
    summary: "ลบตัวชี้วัดงาน (AssignmentCompetency)",
  });
