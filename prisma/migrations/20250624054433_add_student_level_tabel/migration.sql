/*
  Warnings:

  - You are about to drop the column `yearLevel` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "yearLevel",
ADD COLUMN     "studentLevelId" INTEGER;

-- CreateTable
CREATE TABLE "StudentLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enName" TEXT,
    "code" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "StudentLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentLevel_code_key" ON "StudentLevel"("code");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentLevelId_fkey" FOREIGN KEY ("studentLevelId") REFERENCES "StudentLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLevel" ADD CONSTRAINT "StudentLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
