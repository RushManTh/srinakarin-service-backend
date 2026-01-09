/*
  Warnings:

  - A unique constraint covering the columns `[coreCompetencyId,level,levelId]` on the table `CoreCompetencyLevel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `maxScore` to the `CoreCompetencyLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minScore` to the `CoreCompetencyLevel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CoreCompetencyLevel_coreCompetencyId_level_key";

-- AlterTable
ALTER TABLE "CoreCompetencyLevel" ADD COLUMN     "maxScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minScore" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "CoreCompetencyLevel_coreCompetencyId_levelId_idx" ON "CoreCompetencyLevel"("coreCompetencyId", "levelId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreCompetencyLevel_coreCompetencyId_level_levelId_key" ON "CoreCompetencyLevel"("coreCompetencyId", "level", "levelId");
