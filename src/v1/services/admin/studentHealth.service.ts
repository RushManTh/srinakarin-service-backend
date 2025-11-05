import { prisma } from "../../models/prisma";

// List all health records for a student
export async function listStudentHealth(studentId: string) {
  return prisma.studentHealth.findMany({ where: { studentId } });
}

// Get a health record by id
export async function getStudentHealthById(id: string) {
  return prisma.studentHealth.findUnique({ where: { id } });
}

// Create a health record
export async function createStudentHealth(data: any) {
  return prisma.studentHealth.create({ data });
}

// Create many health records
export async function createManyStudentHealth(healths: any[]) {
  return prisma.studentHealth.createMany({ data: healths });
}

// Update a health record
export async function updateStudentHealth(id: string, data: any) {
  return prisma.studentHealth.update({ where: { id }, data });
}

// Update many health records
export async function updateManyStudentHealth(
  updates: { id: string; data: any }[]
) {
  const results = [];
  for (const { id, data } of updates) {
    results.push(await prisma.studentHealth.update({ where: { id }, data }));
  }
  return results;
}

// Delete a health record
export async function deleteStudentHealth(id: string) {
  return prisma.studentHealth.delete({ where: { id } });
}

// Delete many health records
export async function deleteManyStudentHealth(ids: string[]) {
  return prisma.studentHealth.deleteMany({ where: { id: { in: ids } } });
}
