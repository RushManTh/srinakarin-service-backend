/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,schoolSubjectId,classroomId,termId,academicYearId]` on the table `TeacherAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_teacherId_schoolSubjectId_classroomId_ter_key" ON "TeacherAssignment"("teacherId", "schoolSubjectId", "classroomId", "termId", "academicYearId");
