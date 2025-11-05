/*
  Warnings:

  - A unique constraint covering the columns `[studentId,schoolSubjectId,termId,academicYearId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_schoolSubjectId_termId_academicYearId_key" ON "Enrollment"("studentId", "schoolSubjectId", "termId", "academicYearId");
