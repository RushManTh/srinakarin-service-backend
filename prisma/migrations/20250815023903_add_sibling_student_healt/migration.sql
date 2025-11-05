-- CreateEnum
CREATE TYPE "SiblingStatus" AS ENUM ('THIS_SCHOOL', 'OTHER_SCHOOL', 'WORKING');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "siblingCount" INTEGER;

-- CreateTable
CREATE TABLE "Sibling" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "status" "SiblingStatus" NOT NULL,
    "schoolName" TEXT,

    CONSTRAINT "Sibling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sibling" ADD CONSTRAINT "Sibling_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
