import { prisma } from "../../models/prisma";

// List all subject types
export async function listSubjectTypes() {
  return prisma.subjectType.findMany({
    include: {
      competencies: true,
      schoolSubject: true,
    },
    orderBy: {
      code: "asc",
    },
  });
}

// Get subject type by ID
export async function getSubjectTypeById(id: string) {
  return prisma.subjectType.findUnique({
    where: { id },
    include: { competencies: true, schoolSubject: true },
  });
}

// Create a subject type
export async function createSubjectType(data: any) {
  return prisma.subjectType.create({ data });
}

// Update a subject type
export async function updateSubjectType(id: string, data: any) {
  return prisma.subjectType.update({ where: { id }, data });
}

// Delete a subject type
export async function deleteSubjectType(id: string) {
  return prisma.subjectType.delete({ where: { id } });
}
