/*
  Warnings:

  - Made the column `comment` on table `AssignmentScore` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AssignmentScore" ALTER COLUMN "comment" SET NOT NULL;
