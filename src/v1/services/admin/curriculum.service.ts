import { prisma } from "../../models/prisma";

// List all curriculums
export async function listCurriculums() {
  return prisma.curriculum.findMany();
}

// Get curriculum by ID
export async function getCurriculumById(id: string) {
  return prisma.curriculum.findUnique({
    where: { id },
    include: { SubjectGroups: true, curriculumSubjects: true },
  });
}

// Create a curriculum
export async function createCurriculum(data: any) {
  return prisma.curriculum.create({ data });
}

// Update a curriculum
export async function updateCurriculum(id: string, data: any) {
  return prisma.curriculum.update({ where: { id }, data });
}

// Delete a curriculum
export async function deleteCurriculum(id: string) {
  return prisma.curriculum.delete({ where: { id } });
}
