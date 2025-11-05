/*
  Warnings:

  - You are about to drop the column `programEducatioId` on the `Classroom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_programEducatioId_fkey";

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "programEducatioId",
ADD COLUMN     "programEducationId" TEXT NOT NULL DEFAULT 'f3ad965f-c9c7-4e00-af92-71bde4d3e86e';

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_programEducationId_fkey" FOREIGN KEY ("programEducationId") REFERENCES "ProgramEducation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
