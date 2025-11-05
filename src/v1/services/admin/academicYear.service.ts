import { prisma } from "../../models/prisma";

// List all academic years
export async function listAcademicYears() {
  return prisma.academicYear.findMany();
}

// Get academic year by ID
export async function getAcademicYearById(id: string) {
  return prisma.academicYear.findUnique({
    where: { id },
    include: { terms: true },
  });
}

// Create an academic year
export async function createAcademicYear(data: any) {
  return prisma.academicYear.create({ data });
}

// Update an academic year
export async function updateAcademicYear(id: string, data: any) {
  return prisma.academicYear.update({ where: { id }, data });
}

// Delete an academic year
export async function deleteAcademicYear(id: string) {
  return prisma.academicYear.delete({ where: { id } });
}

// List terms by academic year
export async function listTermsByAcademicYear(academicYearId: string) {
  return prisma.term.findMany({ where: { academicYearId } });
}
