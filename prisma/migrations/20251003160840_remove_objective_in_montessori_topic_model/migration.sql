/*
  Warnings:

  - You are about to drop the column `objective` on the `MontessoriTopic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MontessoriTopic" DROP COLUMN "objective",
ADD COLUMN     "description" TEXT;
