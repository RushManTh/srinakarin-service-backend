import { Elysia, t } from "elysia";
import {
  listAssignmentScoreAttemptsController,
  getAssignmentScoreAttemptByIdController,
  createAssignmentScoreAttemptController,
  updateAssignmentScoreAttemptController,
  deleteAssignmentScoreAttemptController,
} from "../../controllers/teacher/assignmentScoreAttempt.controller";

export const assignmentScoreAttemptRoutes = new Elysia({
  prefix: "/assignment-score-attempts",
})
  .get("/", listAssignmentScoreAttemptsController, {
    tags: ["AssignmentScoreAttempt (TeacherRoutes)"],
    summary: "รายการรอบการให้คะแนน (AssignmentScoreAttempt)",
  })
  .get("/:id", getAssignmentScoreAttemptByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScoreAttempt (TeacherRoutes)"],
    summary: "ดูข้อมูลรอบการให้คะแนน (AssignmentScoreAttempt)",
  })
  .post("/create", createAssignmentScoreAttemptController, {
    body: t.Object({
      assignmentId: t.String(),
      attemptNo: t.Number(),
      name: t.Optional(t.String()),
    }),
    tags: ["AssignmentScoreAttempt (TeacherRoutes)"],
    summary: "สร้างรอบการให้คะแนน (AssignmentScoreAttempt)",
  })
  .patch("/update/:id", updateAssignmentScoreAttemptController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      assignmentId: t.Optional(t.String()),
      attemptNo: t.Optional(t.Number()),
    }),
    tags: ["AssignmentScoreAttempt (TeacherRoutes)"],
    summary: "อัพเดตรอบการให้คะแนน (AssignmentScoreAttempt)",
  })
  .delete("/delete/:id", deleteAssignmentScoreAttemptController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScoreAttempt (TeacherRoutes)"],
    summary: "ลบรอบการให้คะแนน (AssignmentScoreAttempt)",
  });
