/*
  Warnings:

  - Added the required column `learningApproach` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LearningApproach" AS ENUM ('TRADITIONAL', 'MONTESSORI');

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "learningApproach" "LearningApproach" NOT NULL;
