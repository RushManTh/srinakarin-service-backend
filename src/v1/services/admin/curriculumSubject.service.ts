import { prisma } from "../../models/prisma";

// List all curriculum subjects
export async function listCurriculumSubjects() {
  return prisma.curriculumSubject.findMany({
    include: {
      SubjectGroup: true,
      curriculum: true,
      studentLevel: true,
    },
    orderBy: {
      code: "asc",
    },
  });
}

// Get curriculum subject by ID
export async function getCurriculumSubjectById(id: string) {
  return prisma.curriculumSubject.findUnique({
    where: { id },
    include: {
      SubjectGroup: true,
      curriculum: true,
      schoolSubjects: true,
      studentLevel: true,
    },
  });
}

// Create a curriculum subject
export async function createCurriculumSubject(data: any) {
  return prisma.curriculumSubject.create({ data });
}

// Update a curriculum subject
export async function updateCurriculumSubject(id: string, data: any) {
  return prisma.curriculumSubject.update({ where: { id }, data });
}

// Delete a curriculum subject
export async function deleteCurriculumSubject(id: string) {
  return prisma.curriculumSubject.delete({ where: { id } });
}
