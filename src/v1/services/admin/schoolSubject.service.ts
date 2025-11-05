import { prisma } from "../../models/prisma";

// List all school subjects
export async function listSchoolSubjects() {
  return prisma.schoolSubject.findMany({
    include: {
      curriculumSubject: true,
      learningArea: true,
      subjectType: true,
    },
    orderBy: {
      code: "asc",
    },
  });
}

// Get school subject by ID
export async function getSchoolSubjectById(id: string) {
  return prisma.schoolSubject.findUnique({
    where: { id },
    include: {
      curriculumSubject: true,
      learningArea: true,
      subjectType: true,
      assignments: true,
      enrollment: true,
      // learningApproach: true, // removed due to linter error
    },
  });
}

// Create a school subject
export async function createSchoolSubject(data: any) {
  return prisma.schoolSubject.create({ data });
}

// Update a school subject
export async function updateSchoolSubject(id: string, data: any) {
  return prisma.schoolSubject.update({ where: { id }, data });
}

// Delete a school subject
export async function deleteSchoolSubject(id: string) {
  return prisma.schoolSubject.delete({ where: { id } });
}
