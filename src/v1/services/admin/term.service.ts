import { prisma } from "../../models/prisma";

// List all terms
export async function listTerms() {
  return prisma.term.findMany({ include: { academicYear: true } });
}

// Get term by ID
export async function getTermById(id: string) {
  return prisma.term.findUnique({
    where: { id },
    include: { academicYear: true },
  });
}

// Create a term
export async function createTerm(data: any) {
  return prisma.term.create({ data });
}

// Update a term
export async function updateTerm(id: string, data: any) {
  return prisma.term.update({ where: { id }, data });
}

// Delete a term
export async function deleteTerm(id: string) {
  return prisma.term.delete({ where: { id } });
}
