import { prisma } from "../../models/prisma";

// List all learning areas
export async function listLearningAreas() {
  return prisma.learningArea.findMany();
}

// Get learning area by ID
export async function getLearningAreaById(id: string) {
  return prisma.learningArea.findUnique({
    where: { id },
    include: { schoolSubject: true },
  });
}

// Create a learning area
export async function createLearningArea(data: any) {
  return prisma.learningArea.create({ data });
}

// Update a learning area
export async function updateLearningArea(id: string, data: any) {
  return prisma.learningArea.update({ where: { id }, data });
}

// Delete a learning area
export async function deleteLearningArea(id: string) {
  return prisma.learningArea.delete({ where: { id } });
}
