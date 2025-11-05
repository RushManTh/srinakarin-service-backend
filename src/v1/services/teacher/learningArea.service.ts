import { prisma } from "../../models/prisma";

// List all learning areas
export async function listLearningAreas() {
  return prisma.learningArea.findMany({ include: { schoolSubject: true } });
}

// Get learning area by ID
export async function getLearningAreaById(id: string) {
  return prisma.learningArea.findUnique({
    where: { id },
    include: { schoolSubject: true },
  });
}
