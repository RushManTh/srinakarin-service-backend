/*
  Warnings:

  - You are about to drop the `_CoreCompetencyToLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoreCompetencyToStudentLevel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CoreCompetencyToLevel" DROP CONSTRAINT "_CoreCompetencyToLevel_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoreCompetencyToLevel" DROP CONSTRAINT "_CoreCompetencyToLevel_B_fkey";

-- DropForeignKey
ALTER TABLE "_CoreCompetencyToStudentLevel" DROP CONSTRAINT "_CoreCompetencyToStudentLevel_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoreCompetencyToStudentLevel" DROP CONSTRAINT "_CoreCompetencyToStudentLevel_B_fkey";

-- DropTable
DROP TABLE "_CoreCompetencyToLevel";

-- DropTable
DROP TABLE "_CoreCompetencyToStudentLevel";

-- CreateTable
CREATE TABLE "CoreCompetencyLevel" (
    "id" TEXT NOT NULL,
    "coreCompetencyId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "levelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoreCompetencyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreCompetencyLearningAreaWeight" (
    "id" TEXT NOT NULL,
    "coreCompetencyId" TEXT NOT NULL,
    "learningAreaId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "levelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoreCompetencyLearningAreaWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetencyToCoreCompetency" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompetencyToCoreCompetency_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "CoreCompetencyLevel_coreCompetencyId_idx" ON "CoreCompetencyLevel"("coreCompetencyId");

-- CreateIndex
CREATE INDEX "CoreCompetencyLevel_levelId_idx" ON "CoreCompetencyLevel"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreCompetencyLevel_coreCompetencyId_level_key" ON "CoreCompetencyLevel"("coreCompetencyId", "level");

-- CreateIndex
CREATE INDEX "CoreCompetencyLearningAreaWeight_coreCompetencyId_idx" ON "CoreCompetencyLearningAreaWeight"("coreCompetencyId");

-- CreateIndex
CREATE INDEX "CoreCompetencyLearningAreaWeight_learningAreaId_idx" ON "CoreCompetencyLearningAreaWeight"("learningAreaId");

-- CreateIndex
CREATE INDEX "CoreCompetencyLearningAreaWeight_levelId_idx" ON "CoreCompetencyLearningAreaWeight"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreCompetencyLearningAreaWeight_coreCompetencyId_learningA_key" ON "CoreCompetencyLearningAreaWeight"("coreCompetencyId", "learningAreaId", "levelId");

-- CreateIndex
CREATE INDEX "_CompetencyToCoreCompetency_B_index" ON "_CompetencyToCoreCompetency"("B");

-- AddForeignKey
ALTER TABLE "CoreCompetencyLevel" ADD CONSTRAINT "CoreCompetencyLevel_coreCompetencyId_fkey" FOREIGN KEY ("coreCompetencyId") REFERENCES "CoreCompetency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreCompetencyLevel" ADD CONSTRAINT "CoreCompetencyLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreCompetencyLearningAreaWeight" ADD CONSTRAINT "CoreCompetencyLearningAreaWeight_coreCompetencyId_fkey" FOREIGN KEY ("coreCompetencyId") REFERENCES "CoreCompetency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreCompetencyLearningAreaWeight" ADD CONSTRAINT "CoreCompetencyLearningAreaWeight_learningAreaId_fkey" FOREIGN KEY ("learningAreaId") REFERENCES "LearningArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreCompetencyLearningAreaWeight" ADD CONSTRAINT "CoreCompetencyLearningAreaWeight_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyToCoreCompetency" ADD CONSTRAINT "_CompetencyToCoreCompetency_A_fkey" FOREIGN KEY ("A") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyToCoreCompetency" ADD CONSTRAINT "_CompetencyToCoreCompetency_B_fkey" FOREIGN KEY ("B") REFERENCES "CoreCompetency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
