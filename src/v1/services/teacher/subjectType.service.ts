import { prisma } from "../../models/prisma";

// List all subject types
export async function listSubjectTypes() {
  return prisma.subjectType.findMany({
    include: {
      competencies: true,
    },
  });
}

// Get subject type by ID
export async function getSubjectTypeById(id: string) {
  return prisma.subjectType.findUnique({
    where: { id },
    include: { schoolSubject: true, competencies: true },
  });
}
