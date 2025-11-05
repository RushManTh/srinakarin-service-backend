import { Elysia, t } from "elysia";
import {
  createScoreFileController,
  deleteScoreFileController,
} from "../../controllers/admin/scoreFile.controller";

export const scoreFileRoutes = new Elysia()
  .post("/scores/:scoreId/files", createScoreFileController, {
    params: t.Object({ scoreId: t.String() }),
    body: t.Object({
      fileUrl: t.String(),
      fileType: t.String(),
    }),
    tags: ["ScoreFile (AdminRoutes)"],
    summary: "อัปโหลดไฟล์แนบคะแนน",
  })
  .delete("/score-files/:id", deleteScoreFileController, {
    params: t.Object({ id: t.String() }),
    tags: ["ScoreFile (AdminRoutes)"],
    summary: "ลบไฟล์แนบคะแนน",
  });
