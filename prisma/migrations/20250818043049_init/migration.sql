/*
  Warnings:

  - The primary key for the `AcademicYear` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Classroom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `year` on the `Classroom` table. All the data in the column will be lost.
  - The primary key for the `Competency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subjectId` on the `Enrollment` table. All the data in the column will be lost.
  - The primary key for the `LearningArea` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Level` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProgramEducation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sibling` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentHealth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentLevel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubjectType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Term` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectIndicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectIndicatorScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectIndicatorScoreFile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `programEducatioId` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroomId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolSubjectId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "scoreType" AS ENUM ('SCORE', 'MIDTERM', 'FINAL');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Sibling" DROP CONSTRAINT "Sibling_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_programEducationId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_studentLevelId_fkey";

-- DropForeignKey
ALTER TABLE "StudentHealth" DROP CONSTRAINT "StudentHealth_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentLevel" DROP CONSTRAINT "StudentLevel_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_learningAreaId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_subjectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectAssignment" DROP CONSTRAINT "SubjectAssignment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectAssignment" DROP CONSTRAINT "SubjectAssignment_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicator" DROP CONSTRAINT "SubjectIndicator_competencyId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicator" DROP CONSTRAINT "SubjectIndicator_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicatorScore" DROP CONSTRAINT "SubjectIndicatorScore_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicatorScore" DROP CONSTRAINT "SubjectIndicatorScore_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicatorScore" DROP CONSTRAINT "SubjectIndicatorScore_subjectIndicatorId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicatorScore" DROP CONSTRAINT "SubjectIndicatorScore_termId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectIndicatorScoreFile" DROP CONSTRAINT "SubjectIndicatorScoreFile_subjectIndicatorScoreId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "Term" DROP CONSTRAINT "Term_academicYearId_fkey";

-- AlterTable
ALTER TABLE "AcademicYear" DROP CONSTRAINT "AcademicYear_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AcademicYear_id_seq";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_pkey",
DROP COLUMN "year",
ADD COLUMN     "programEducatioId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Classroom_id_seq";

-- AlterTable
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subjectTypeId" SET DATA TYPE TEXT,
ALTER COLUMN "levelId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Competency_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Competency_id_seq";

-- AlterTable
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_pkey",
DROP COLUMN "subjectId",
ADD COLUMN     "classroomId" TEXT NOT NULL,
ADD COLUMN     "schoolSubjectId" TEXT NOT NULL,
ADD COLUMN     "termId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "academicYearId" DROP DEFAULT,
ALTER COLUMN "academicYearId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Enrollment_id_seq";

-- AlterTable
ALTER TABLE "LearningArea" DROP CONSTRAINT "LearningArea_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LearningArea_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LearningArea_id_seq";

-- AlterTable
ALTER TABLE "Level" DROP CONSTRAINT "Level_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Level_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Level_id_seq";

-- AlterTable
ALTER TABLE "ProgramEducation" DROP CONSTRAINT "ProgramEducation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProgramEducation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProgramEducation_id_seq";

-- AlterTable
ALTER TABLE "Sibling" DROP CONSTRAINT "Sibling_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sibling_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sibling_id_seq";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "classroomId" SET DATA TYPE TEXT,
ALTER COLUMN "studentLevelId" SET DATA TYPE TEXT,
ALTER COLUMN "programEducationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_id_seq";

-- AlterTable
ALTER TABLE "StudentHealth" DROP CONSTRAINT "StudentHealth_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentHealth_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentHealth_id_seq";

-- AlterTable
ALTER TABLE "StudentLevel" DROP CONSTRAINT "StudentLevel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "levelId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentLevel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentLevel_id_seq";

-- AlterTable
ALTER TABLE "SubjectType" DROP CONSTRAINT "SubjectType_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SubjectType_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SubjectType_id_seq";

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "classroomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Teacher_id_seq";

-- AlterTable
ALTER TABLE "Term" DROP CONSTRAINT "Term_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "academicYearId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Term_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Term_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "SubjectAssignment";

-- DropTable
DROP TABLE "SubjectIndicator";

-- DropTable
DROP TABLE "SubjectIndicatorScore";

-- DropTable
DROP TABLE "SubjectIndicatorScoreFile";

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGroup" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enName" TEXT,
    "description" TEXT,
    "curriculumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumSubject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "credit" INTEGER NOT NULL,
    "subjectGroupId" TEXT NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "studentLevelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSubject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "curriculumSubjectId" TEXT NOT NULL,
    "learningAreaId" TEXT NOT NULL,
    "subjectTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "learningApproach" "LearningApproach" NOT NULL,

    CONSTRAINT "SchoolSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAssignment" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "schoolSubjectId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "teacherAssignmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scoreType" "scoreType" NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentScoreAttempt" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "name" TEXT,
    "date" TIMESTAMP(3),

    CONSTRAINT "AssignmentScoreAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentScore" (
    "id" TEXT NOT NULL,
    "assignmentScoreAttemptId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentScoreFile" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AssignmentScoreId" TEXT NOT NULL,

    CONSTRAINT "AssignmentScoreFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentCompetency" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,

    CONSTRAINT "AssignmentCompetency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_code_key" ON "Curriculum"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGroup_code_key" ON "SubjectGroup"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumSubject_code_key" ON "CurriculumSubject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSubject_code_key" ON "SchoolSubject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentCompetency_assignmentId_competencyId_key" ON "AssignmentCompetency"("assignmentId", "competencyId");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentLevelId_fkey" FOREIGN KEY ("studentLevelId") REFERENCES "StudentLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_programEducationId_fkey" FOREIGN KEY ("programEducationId") REFERENCES "ProgramEducation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sibling" ADD CONSTRAINT "Sibling_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentHealth" ADD CONSTRAINT "StudentHealth_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLevel" ADD CONSTRAINT "StudentLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_programEducatioId_fkey" FOREIGN KEY ("programEducatioId") REFERENCES "ProgramEducation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "SubjectType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGroup" ADD CONSTRAINT "SubjectGroup_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumSubject" ADD CONSTRAINT "CurriculumSubject_subjectGroupId_fkey" FOREIGN KEY ("subjectGroupId") REFERENCES "SubjectGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumSubject" ADD CONSTRAINT "CurriculumSubject_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumSubject" ADD CONSTRAINT "CurriculumSubject_studentLevelId_fkey" FOREIGN KEY ("studentLevelId") REFERENCES "StudentLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubject" ADD CONSTRAINT "SchoolSubject_curriculumSubjectId_fkey" FOREIGN KEY ("curriculumSubjectId") REFERENCES "CurriculumSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubject" ADD CONSTRAINT "SchoolSubject_learningAreaId_fkey" FOREIGN KEY ("learningAreaId") REFERENCES "LearningArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubject" ADD CONSTRAINT "SchoolSubject_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "SubjectType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_schoolSubjectId_fkey" FOREIGN KEY ("schoolSubjectId") REFERENCES "SchoolSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_schoolSubjectId_fkey" FOREIGN KEY ("schoolSubjectId") REFERENCES "SchoolSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacherAssignmentId_fkey" FOREIGN KEY ("teacherAssignmentId") REFERENCES "TeacherAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentScoreAttempt" ADD CONSTRAINT "AssignmentScoreAttempt_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentScore" ADD CONSTRAINT "AssignmentScore_assignmentScoreAttemptId_fkey" FOREIGN KEY ("assignmentScoreAttemptId") REFERENCES "AssignmentScoreAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentScore" ADD CONSTRAINT "AssignmentScore_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentScoreFile" ADD CONSTRAINT "AssignmentScoreFile_AssignmentScoreId_fkey" FOREIGN KEY ("AssignmentScoreId") REFERENCES "AssignmentScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCompetency" ADD CONSTRAINT "AssignmentCompetency_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCompetency" ADD CONSTRAINT "AssignmentCompetency_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
