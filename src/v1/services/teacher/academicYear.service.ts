import { prisma } from "../../models/prisma";

// List all academic years
export async function listAcademicYears() {
  return prisma.academicYear.findMany({
    include: { terms: true },
  });
}

// Get academic year by ID
export async function getAcademicYearById(id: string) {
  return prisma.academicYear.findUnique({
    where: { id },
    include: { terms: true },
  });
}

// List terms by academic year
export async function listTermsByAcademicYear(academicYearId: string) {
  return prisma.term.findMany({ where: { academicYearId } });
}
