/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "firstNameEn" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "lastNameEn" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "prefix" TEXT;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "academicYearId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address",
DROP COLUMN "phone",
ADD COLUMN     "addressAmphoe" TEXT,
ADD COLUMN     "addressMoo" TEXT,
ADD COLUMN     "addressPostcode" TEXT,
ADD COLUMN     "addressProvince" TEXT,
ADD COLUMN     "addressRoad" TEXT,
ADD COLUMN     "addressTambon" TEXT,
ADD COLUMN     "addresshomeNo" TEXT,
ADD COLUMN     "ethnicity" TEXT,
ADD COLUMN     "fammilyRelationship" TEXT,
ADD COLUMN     "fatherBloodGroup" TEXT,
ADD COLUMN     "fatherEthnicity" TEXT,
ADD COLUMN     "fatherFirstName" TEXT,
ADD COLUMN     "fatherIdCardFileUrl" TEXT,
ADD COLUMN     "fatherIdCardNo" TEXT,
ADD COLUMN     "fatherIncomeRange" TEXT,
ADD COLUMN     "fatherLastName" TEXT,
ADD COLUMN     "fatherNationality" TEXT,
ADD COLUMN     "fatherOccupation" TEXT,
ADD COLUMN     "fatherPhone" TEXT,
ADD COLUMN     "fatherPrefix" TEXT,
ADD COLUMN     "fatherReligion" TEXT,
ADD COLUMN     "fatherStatus" BOOLEAN,
ADD COLUMN     "fatherWorkplace" TEXT,
ADD COLUMN     "guardianAddressAmphoe" TEXT,
ADD COLUMN     "guardianAddressHomeNo" TEXT,
ADD COLUMN     "guardianAddressMoo" TEXT,
ADD COLUMN     "guardianAddressPostcode" TEXT,
ADD COLUMN     "guardianAddressProvince" TEXT,
ADD COLUMN     "guardianAddressRoad" TEXT,
ADD COLUMN     "guardianAddressTambon" TEXT,
ADD COLUMN     "guardianBloodGroup" TEXT,
ADD COLUMN     "guardianEthnicity" TEXT,
ADD COLUMN     "guardianFirstName" TEXT,
ADD COLUMN     "guardianHomePhone" TEXT,
ADD COLUMN     "guardianIdCardFileUrl" TEXT,
ADD COLUMN     "guardianIdCardNo" TEXT,
ADD COLUMN     "guardianIncomeRange" TEXT,
ADD COLUMN     "guardianLastName" TEXT,
ADD COLUMN     "guardianNationality" TEXT,
ADD COLUMN     "guardianPhone" TEXT,
ADD COLUMN     "guardianPrefix" TEXT,
ADD COLUMN     "guardianRelationship" TEXT,
ADD COLUMN     "guardianReligion" TEXT,
ADD COLUMN     "guardianWorkplace" TEXT,
ADD COLUMN     "homePhone" TEXT,
ADD COLUMN     "houseRegistrationFileUrl" TEXT,
ADD COLUMN     "idCardNo" TEXT,
ADD COLUMN     "mobilePhone" TEXT,
ADD COLUMN     "motherBloodGroup" TEXT,
ADD COLUMN     "motherEthnicity" TEXT,
ADD COLUMN     "motherFirstName" TEXT,
ADD COLUMN     "motherIdCardFileUrl" TEXT,
ADD COLUMN     "motherIdCardNo" TEXT,
ADD COLUMN     "motherIncomeRange" TEXT,
ADD COLUMN     "motherLastName" TEXT,
ADD COLUMN     "motherNationality" TEXT,
ADD COLUMN     "motherOccupation" TEXT,
ADD COLUMN     "motherPhone" TEXT,
ADD COLUMN     "motherPrefix" TEXT,
ADD COLUMN     "motherReligion" TEXT,
ADD COLUMN     "motherStatus" BOOLEAN,
ADD COLUMN     "motherWorkplace" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "nicknameEn" TEXT,
ADD COLUMN     "previousSchool" TEXT,
ADD COLUMN     "previousSchoolAddressAmphore" TEXT,
ADD COLUMN     "previousSchoolAddressProvince" TEXT,
ADD COLUMN     "previousSchoolFileUrl" TEXT,
ADD COLUMN     "previousSchoolReasonMove" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "studentCodeOpec" TEXT;

-- CreateTable
CREATE TABLE "StudentHealth" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bloodGroup" TEXT,
    "congenitalDisease" TEXT,
    "allergy" TEXT,
    "disability" TEXT,
    "note" TEXT,

    CONSTRAINT "StudentHealth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentHealth" ADD CONSTRAINT "StudentHealth_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
