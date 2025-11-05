/*
  Warnings:

  - You are about to drop the column `schoolSubjectId` on the `MontessoriCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MontessoriCategory" DROP CONSTRAINT "MontessoriCategory_schoolSubjectId_fkey";

-- DropIndex
DROP INDEX "MontessoriCategory_schoolSubjectId_code_key";

-- DropIndex
DROP INDEX "MontessoriCategory_schoolSubjectId_idx";

-- AlterTable
ALTER TABLE "MontessoriCategory" DROP COLUMN "schoolSubjectId";

-- CreateTable
CREATE TABLE "_MontessoriCategoryToSchoolSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MontessoriCategoryToSchoolSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MontessoriCategoryToSchoolSubject_B_index" ON "_MontessoriCategoryToSchoolSubject"("B");

-- AddForeignKey
ALTER TABLE "_MontessoriCategoryToSchoolSubject" ADD CONSTRAINT "_MontessoriCategoryToSchoolSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "MontessoriCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MontessoriCategoryToSchoolSubject" ADD CONSTRAINT "_MontessoriCategoryToSchoolSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "SchoolSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
