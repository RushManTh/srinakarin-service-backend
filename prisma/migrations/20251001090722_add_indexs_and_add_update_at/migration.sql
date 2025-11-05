-- AlterTable
ALTER TABLE "AcademicYear" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AssignmentCompetency" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AssignmentScore" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AssignmentScoreAttempt" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AssignmentScoreFile" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sibling" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudentHealth" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Assignment_teacherAssignmentId_idx" ON "Assignment"("teacherAssignmentId");

-- CreateIndex
CREATE INDEX "AssignmentCompetency_assignmentId_idx" ON "AssignmentCompetency"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentCompetency_competencyId_idx" ON "AssignmentCompetency"("competencyId");

-- CreateIndex
CREATE INDEX "AssignmentScore_assignmentScoreAttemptId_idx" ON "AssignmentScore"("assignmentScoreAttemptId");

-- CreateIndex
CREATE INDEX "AssignmentScore_studentId_idx" ON "AssignmentScore"("studentId");

-- CreateIndex
CREATE INDEX "AssignmentScoreAttempt_assignmentId_idx" ON "AssignmentScoreAttempt"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentScoreFile_AssignmentScoreId_idx" ON "AssignmentScoreFile"("AssignmentScoreId");

-- CreateIndex
CREATE INDEX "Classroom_programEducationId_idx" ON "Classroom"("programEducationId");

-- CreateIndex
CREATE INDEX "Competency_subjectTypeId_idx" ON "Competency"("subjectTypeId");

-- CreateIndex
CREATE INDEX "Competency_levelId_idx" ON "Competency"("levelId");

-- CreateIndex
CREATE INDEX "CurriculumSubject_subjectGroupId_idx" ON "CurriculumSubject"("subjectGroupId");

-- CreateIndex
CREATE INDEX "CurriculumSubject_curriculumId_idx" ON "CurriculumSubject"("curriculumId");

-- CreateIndex
CREATE INDEX "CurriculumSubject_studentLevelId_idx" ON "CurriculumSubject"("studentLevelId");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");

-- CreateIndex
CREATE INDEX "Enrollment_schoolSubjectId_idx" ON "Enrollment"("schoolSubjectId");

-- CreateIndex
CREATE INDEX "Enrollment_classroomId_idx" ON "Enrollment"("classroomId");

-- CreateIndex
CREATE INDEX "Enrollment_termId_idx" ON "Enrollment"("termId");

-- CreateIndex
CREATE INDEX "Enrollment_academicYearId_idx" ON "Enrollment"("academicYearId");

-- CreateIndex
CREATE INDEX "SchoolSubject_curriculumSubjectId_idx" ON "SchoolSubject"("curriculumSubjectId");

-- CreateIndex
CREATE INDEX "SchoolSubject_learningAreaId_idx" ON "SchoolSubject"("learningAreaId");

-- CreateIndex
CREATE INDEX "SchoolSubject_subjectTypeId_idx" ON "SchoolSubject"("subjectTypeId");

-- CreateIndex
CREATE INDEX "Sibling_studentId_idx" ON "Sibling"("studentId");

-- CreateIndex
CREATE INDEX "Student_studentLevelId_idx" ON "Student"("studentLevelId");

-- CreateIndex
CREATE INDEX "Student_classroomId_idx" ON "Student"("classroomId");

-- CreateIndex
CREATE INDEX "Student_programEducationId_idx" ON "Student"("programEducationId");

-- CreateIndex
CREATE INDEX "StudentHealth_studentId_recordDate_idx" ON "StudentHealth"("studentId", "recordDate");

-- CreateIndex
CREATE INDEX "StudentLevel_levelId_idx" ON "StudentLevel"("levelId");

-- CreateIndex
CREATE INDEX "SubjectGroup_curriculumId_idx" ON "SubjectGroup"("curriculumId");

-- CreateIndex
CREATE INDEX "Teacher_classroomId_idx" ON "Teacher"("classroomId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_teacherId_idx" ON "TeacherAssignment"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_schoolSubjectId_idx" ON "TeacherAssignment"("schoolSubjectId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_classroomId_idx" ON "TeacherAssignment"("classroomId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_termId_idx" ON "TeacherAssignment"("termId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_academicYearId_idx" ON "TeacherAssignment"("academicYearId");

-- CreateIndex
CREATE INDEX "Term_academicYearId_idx" ON "Term"("academicYearId");
