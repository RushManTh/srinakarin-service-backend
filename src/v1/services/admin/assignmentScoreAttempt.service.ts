import { prisma } from "../../models/prisma";

// List all assignment score attempts
export async function listAssignmentScoreAttempts() {
  return prisma.assignmentScoreAttempt.findMany();
}

// Get assignment score attempt by ID
export async function getAssignmentScoreAttemptById(id: string) {
  return prisma.assignmentScoreAttempt.findUnique({
    where: { id },
    include: {
      assignment: true,
      scores: true,
    },
  });
}

// Create an assignment score attempt
export async function createAssignmentScoreAttempt(data: any) {
  return prisma.assignmentScoreAttempt.create({ data });
}

// Update an assignment score attempt
export async function updateAssignmentScoreAttempt(id: string, data: any) {
  return prisma.assignmentScoreAttempt.update({ where: { id }, data });
}

// Delete an assignment score attempt
export async function deleteAssignmentScoreAttempt(id: string) {
  return prisma.assignmentScoreAttempt.delete({ where: { id } });
}
