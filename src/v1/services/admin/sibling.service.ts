import { prisma } from "../../models/prisma";

// List all siblings for a student
export async function listSiblings(studentId: string) {
  return prisma.sibling.findMany({ where: { studentId } });
}

// Get a sibling by id
export async function getSiblingById(id: string) {
  return prisma.sibling.findUnique({ where: { id } });
}

// Create a sibling
export async function createSibling(data: any) {
  return prisma.sibling.create({ data });
}

// Update a sibling
export async function updateSibling(id: string, data: any) {
  return prisma.sibling.update({ where: { id }, data });
}

// Delete a sibling
export async function deleteSibling(id: string) {
  return prisma.sibling.delete({ where: { id } });
}

// Create many siblings
export async function createManySiblings(siblings: any[]) {
  return prisma.sibling.createMany({ data: siblings });
}

// Update many siblings (by id)
export async function updateManySiblings(updates: { id: string; data: any }[]) {
  const results = [];
  for (const { id, data } of updates) {
    results.push(await prisma.sibling.update({ where: { id }, data }));
  }
  return results;
}

// Delete many siblings (by id)
export async function deleteManySiblings(ids: string[]) {
  return prisma.sibling.deleteMany({ where: { id: { in: ids } } });
}
