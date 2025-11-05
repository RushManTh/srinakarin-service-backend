/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "code" TEXT NOT NULL DEFAULT 'AS0000001';

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_code_key" ON "Assignment"("code");
