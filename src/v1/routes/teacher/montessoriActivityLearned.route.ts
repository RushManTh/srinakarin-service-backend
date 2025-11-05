import { Elysia, t } from "elysia";
import {
  listMontessoriLearnedController,
  getMontessoriLearnedByIdController,
  upsertMontessoriLearnedController,
  toggleMontessoriLearnedController,
  upsertMontessoriLearnedBatchController,
  toggleMontessoriLearnedBatchController,
  listLearnedByStudentAndCategoryController,
  listLearnedByStudentAndSchoolSubjectController,
} from "../../controllers/teacher/montessoriActivityLearned.controller";

export const montessoriLearnedRoutes = new Elysia({
  prefix: "/montessori-learned",
})
  .get("/", listMontessoriLearnedController, {
    tags: ["Montessori Learned (TeacherRoutes)"],
  })
  .get("/by-student-and-category", listLearnedByStudentAndCategoryController, {
    query: t.Object({ studentId: t.String(), categoryId: t.String() }),
    tags: ["Montessori Learned (TeacherRoutes)"],
  })
  .get(
    "/by-student-and-subject",
    listLearnedByStudentAndSchoolSubjectController,
    {
      query: t.Object({
        studentId: t.String(),
        schoolSubjectId: t.String(),
      }),
      tags: ["Montessori Learned (TeacherRoutes)"],
      summary:
        "รายการกิจกรรมที่ถูกติ๊กว่าเรียนแล้ว (learned=true) ของนักเรียนตามวิชา (schoolSubjectId)",
    }
  )
  .get("/:id", getMontessoriLearnedByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Montessori Learned (TeacherRoutes)"],
  })
  .post("/upsert", upsertMontessoriLearnedController, {
    body: t.Object({
      studentId: t.String(),
      activityId: t.String(),
      learned: t.Boolean(),
      learnedAt: t.Optional(t.Union([t.String(), t.Null()])),
      note: t.Optional(t.Union([t.String(), t.Null()])),
      markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    tags: ["Montessori Learned (TeacherRoutes)"],
  })
  .post("/toggle", toggleMontessoriLearnedController, {
    body: t.Object({
      studentId: t.String(),
      activityId: t.String(),
      note: t.Optional(t.Union([t.String(), t.Null()])),
      markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    tags: ["Montessori Learned (TeacherRoutes)"],
  })
  .post("/upsert-batch", upsertMontessoriLearnedBatchController, {
    body: t.Array(
      t.Object({
        studentId: t.String(),
        activityId: t.String(),
        learned: t.Boolean(),
        learnedAt: t.Optional(t.Union([t.String(), t.Null()])),
        note: t.Optional(t.Union([t.String(), t.Null()])),
        markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
      })
    ),
    tags: ["Montessori Learned (TeacherRoutes)"],
  })
  .post("/toggle-batch", toggleMontessoriLearnedBatchController, {
    body: t.Array(
      t.Object({
        studentId: t.String(),
        activityId: t.String(),
        note: t.Optional(t.Union([t.String(), t.Null()])),
        markedByTeacherId: t.Optional(t.Union([t.String(), t.Null()])),
      })
    ),
    tags: ["Montessori Learned (TeacherRoutes)"],
  });
