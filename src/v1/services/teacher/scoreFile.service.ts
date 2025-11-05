import { prisma } from "../../models/prisma";

// Upload a file for a score
export async function createScoreFile(data: any) {
  return prisma.subjectIndicatorScoreFile.create({ data });
}

// Delete a score file by ID
export async function deleteScoreFile(id: number) {
  return prisma.subjectIndicatorScoreFile.delete({ where: { id } });
}
