/*
  Warnings:

  - You are about to drop the column `order` on the `MontessoriSubcategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MontessoriSubcategory_order_idx";

-- AlterTable
ALTER TABLE "MontessoriSubcategory" DROP COLUMN "order";
