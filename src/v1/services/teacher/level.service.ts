import { prisma } from "../../models/prisma";

// List all levels
export async function listLevels() {
  return prisma.level.findMany({ include: { studentLevels: true } });
}

// Get level by ID
export async function getLevelById(id: string) {
  return prisma.level.findUnique({
    where: { id },
    include: { competencies: true, studentLevels: true },
  });
}
