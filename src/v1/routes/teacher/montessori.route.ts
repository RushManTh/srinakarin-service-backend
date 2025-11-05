import { Elysia, t } from "elysia";
import { getMontessoriTreeBySubjectController } from "../../controllers/teacher/montessori.controller";

export const montessoriRoutes = new Elysia({ prefix: "/montessori" }).get(
  "/tree/by-subject",
  getMontessoriTreeBySubjectController,
  {
    query: t.Object({
      schoolSubjectId: t.String(),
      levelId: t.Optional(t.String()),
      includeInactive: t.Optional(t.String()), // "true" to include inactive entries
    }),
    tags: ["Montessori (TeacherRoutes)"],
    summary:
      "ดึงโครงสร้าง Montessori ทั้งหมด (Category → Subcategory → Topic → Activity) ตาม schoolSubjectId และเลือกกรอง levelId ได้",
  }
);
