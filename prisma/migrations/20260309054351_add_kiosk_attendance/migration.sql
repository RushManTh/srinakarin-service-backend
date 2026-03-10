-- CreateEnum
CREATE TYPE "KioskEventType" AS ENUM ('CHECK_IN', 'CHECK_OUT');

-- CreateTable
CREATE TABLE "KioskAttendanceLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "eventType" "KioskEventType" NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photoPath" TEXT,
    "academicYearId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KioskAttendanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KioskAttendanceLog_studentId_eventTime_idx" ON "KioskAttendanceLog"("studentId", "eventTime");

-- CreateIndex
CREATE INDEX "KioskAttendanceLog_academicYearId_termId_eventTime_idx" ON "KioskAttendanceLog"("academicYearId", "termId", "eventTime");

-- CreateIndex
CREATE INDEX "KioskAttendanceLog_studentId_idx" ON "KioskAttendanceLog"("studentId");

-- CreateIndex
CREATE INDEX "KioskAttendanceLog_termId_idx" ON "KioskAttendanceLog"("termId");

-- AddForeignKey
ALTER TABLE "KioskAttendanceLog" ADD CONSTRAINT "KioskAttendanceLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KioskAttendanceLog" ADD CONSTRAINT "KioskAttendanceLog_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KioskAttendanceLog" ADD CONSTRAINT "KioskAttendanceLog_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
