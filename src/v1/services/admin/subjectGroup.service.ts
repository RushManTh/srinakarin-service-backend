import { prisma } from "../../models/prisma";

// List all subject groups
export async function listSubjectGroups() {
  return prisma.subjectGroup.findMany({
    orderBy: {
      code: "asc",
    },
  });
}

// Get subject group by ID
export async function getSubjectGroupById(id: string) {
  return prisma.subjectGroup.findUnique({
    where: { id },
    include: { curriculum: true, curriculumSubjects: true },
  });
}

// Create a subject group
export async function createSubjectGroup(data: any) {
  return prisma.subjectGroup.create({ data });
}

// Update a subject group
export async function updateSubjectGroup(id: string, data: any) {
  return prisma.subjectGroup.update({ where: { id }, data });
}

// Delete a subject group
export async function deleteSubjectGroup(id: string) {
  return prisma.subjectGroup.delete({ where: { id } });
}
