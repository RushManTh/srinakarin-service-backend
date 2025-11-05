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
