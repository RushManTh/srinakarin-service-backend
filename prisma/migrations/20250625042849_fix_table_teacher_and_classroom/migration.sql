/*
  Warnings:

  - You are about to drop the column `homeroomTeacherId` on the `Classroom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_homeroomTeacherId_fkey";

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "homeroomTeacherId";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "classroomId" INTEGER;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
