-- CreateEnum
CREATE TYPE "AttendanceSession" AS ENUM ('MORNING', 'AFTERNOON');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'LEAVE');

-- CreateTable
CREATE TABLE "SchoolAttendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "session" "AttendanceSession" NOT NULL,
    "classroomId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAttendanceRecord" (
    "id" TEXT NOT NULL,
    "schoolAttendanceId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolAttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SchoolAttendance_classroomId_idx" ON "SchoolAttendance"("classroomId");

-- CreateIndex
CREATE INDEX "SchoolAttendance_teacherId_idx" ON "SchoolAttendance"("teacherId");

-- CreateIndex
CREATE INDEX "SchoolAttendance_date_idx" ON "SchoolAttendance"("date");

-- CreateIndex
CREATE INDEX "SchoolAttendance_academicYearId_idx" ON "SchoolAttendance"("academicYearId");

-- CreateIndex
CREATE INDEX "SchoolAttendance_termId_idx" ON "SchoolAttendance"("termId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAttendance_date_session_classroomId_key" ON "SchoolAttendance"("date", "session", "classroomId");

-- CreateIndex
CREATE INDEX "SchoolAttendanceRecord_studentId_idx" ON "SchoolAttendanceRecord"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAttendanceRecord_schoolAttendanceId_studentId_key" ON "SchoolAttendanceRecord"("schoolAttendanceId", "studentId");

-- AddForeignKey
ALTER TABLE "SchoolAttendance" ADD CONSTRAINT "SchoolAttendance_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendance" ADD CONSTRAINT "SchoolAttendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendance" ADD CONSTRAINT "SchoolAttendance_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendance" ADD CONSTRAINT "SchoolAttendance_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendanceRecord" ADD CONSTRAINT "SchoolAttendanceRecord_schoolAttendanceId_fkey" FOREIGN KEY ("schoolAttendanceId") REFERENCES "SchoolAttendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendanceRecord" ADD CONSTRAINT "SchoolAttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
