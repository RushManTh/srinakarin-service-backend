import { Elysia, t } from "elysia";
import {
  listAssignmentScoreFilesController,
  getAssignmentScoreFileByIdController,
  createAssignmentScoreFileController,
  updateAssignmentScoreFileController,
  deleteAssignmentScoreFileController,
} from "../../controllers/teacher/assignmentScoreFile.controller";

export const assignmentScoreFileRoutes = new Elysia({
  prefix: "/assignment-score-files",
})
  .get("/", listAssignmentScoreFilesController, {
    tags: ["AssignmentScoreFile (TeacherRoutes)"],
    summary: "รายการไฟล์คะแนน (AssignmentScoreFile)",
  })
  .get("/:id", getAssignmentScoreFileByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScoreFile (TeacherRoutes)"],
    summary: "ดูข้อมูลไฟล์คะแนน (AssignmentScoreFile)",
  })
  .post("/create", createAssignmentScoreFileController, {
    body: t.Object({
      fileUrl: t.String(),
      fileType: t.String(),
      AssignmentScoreId: t.String(),
    }),
    tags: ["AssignmentScoreFile (TeacherRoutes)"],
    summary: "สร้างไฟล์คะแนน (AssignmentScoreFile)",
  })
  .patch("/update/:id", updateAssignmentScoreFileController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      fileUrl: t.Optional(t.String()),
      fileType: t.Optional(t.String()),
      AssignmentScoreId: t.Optional(t.String()),
    }),
    tags: ["AssignmentScoreFile (TeacherRoutes)"],
    summary: "อัพเดตไฟล์คะแนน (AssignmentScoreFile)",
  })
  .delete("/delete/:id", deleteAssignmentScoreFileController, {
    params: t.Object({ id: t.String() }),
    tags: ["AssignmentScoreFile (TeacherRoutes)"],
    summary: "ลบไฟล์คะแนน (AssignmentScoreFile)",
  });
