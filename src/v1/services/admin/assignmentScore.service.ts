import { prisma } from "../../models/prisma";

// List all assignment scores
export async function listAssignmentScores() {
  return prisma.assignmentScore.findMany();
}

// Get assignment score by ID
export async function getAssignmentScoreById(id: string) {
  return prisma.assignmentScore.findUnique({
    where: { id },
    include: {
      assignmentScoreAttempt: true,
      student: true,
      assignmentScoreFiles: true,
    },
  });
}

// Create an assignment score
export async function createAssignmentScore(data: any) {
  return prisma.assignmentScore.create({ data });
}

// Update an assignment score
export async function updateAssignmentScore(id: string, data: any) {
  return prisma.assignmentScore.update({ where: { id }, data });
}

// Delete an assignment score
export async function deleteAssignmentScore(id: string) {
  return prisma.assignmentScore.delete({ where: { id } });
}
