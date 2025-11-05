import { prisma } from "../../models/prisma";

// List all assignment score files
export async function listAssignmentScoreFiles() {
  return prisma.assignmentScoreFile.findMany();
}

// Get assignment score file by ID
export async function getAssignmentScoreFileById(id: string) {
  return prisma.assignmentScoreFile.findUnique({
    where: { id },
    include: {
      assignmentScore: true,
    },
  });
}

// Create an assignment score file
export async function createAssignmentScoreFile(data: any) {
  return prisma.assignmentScoreFile.create({ data });
}

// Update an assignment score file
export async function updateAssignmentScoreFile(id: string, data: any) {
  return prisma.assignmentScoreFile.update({ where: { id }, data });
}

// Delete an assignment score file
export async function deleteAssignmentScoreFile(id: string) {
  return prisma.assignmentScoreFile.delete({ where: { id } });
}
