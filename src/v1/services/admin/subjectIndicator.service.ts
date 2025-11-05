import { prisma } from "../../models/prisma";

// List all subject indicators
export async function listSubjectIndicators() {
  return prisma.subjectIndicator.findMany();
}

// Get subject indicator by ID
export async function getSubjectIndicatorById(id: number) {
  return prisma.subjectIndicator.findUnique({
    where: { id },
    include: { competency: true, subject: true },
  });
}

// Create a subject indicator
export async function createSubjectIndicator(data: any) {
  return prisma.subjectIndicator.create({ data });
}

// Update a subject indicator
export async function updateSubjectIndicator(id: number, data: any) {
  return prisma.subjectIndicator.update({ where: { id }, data });
}

// Delete a subject indicator
export async function deleteSubjectIndicator(id: number) {
  return prisma.subjectIndicator.delete({ where: { id } });
}

// List subject indicators by subject ID
export async function listSubjectIndicatorsBySubjectId(subjectId: number) {
  return prisma.subjectIndicator.findMany({ where: { subjectId } });
}
