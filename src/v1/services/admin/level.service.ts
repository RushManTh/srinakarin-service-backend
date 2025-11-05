import { prisma } from "../../models/prisma";

// List all levels
export async function listLevels() {
  return prisma.level.findMany({
    include: { studentLevels: true },
    orderBy: {
      code: "asc",
    },
  });
}

// Get level by ID
export async function getLevelById(id: string) {
  return prisma.level.findUnique({
    where: { id },
    include: { competencies: true, studentLevels: true },
  });
}

// Create a level
export async function createLevel(data: any) {
  return prisma.level.create({ data });
}

// Update a level
export async function updateLevel(id: string, data: any) {
  return prisma.level.update({ where: { id }, data });
}

// Delete a level
export async function deleteLevel(id: string) {
  return prisma.level.delete({ where: { id } });
}
