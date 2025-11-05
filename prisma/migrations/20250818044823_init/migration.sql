/*
  Warnings:

  - You are about to drop the column `employeeCode` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `hireDate` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Teacher_employeeCode_key";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "employeeCode",
DROP COLUMN "hireDate";
