import { prisma } from "../../models/prisma";

// List all assignment competencies
export async function listAssignmentCompetencies() {
  return prisma.assignmentCompetency.findMany();
}

// Get assignment competency by ID
export async function getAssignmentCompetencyById(id: string) {
  return prisma.assignmentCompetency.findUnique({
    where: { id },
    include: {
      assignment: true,
      competency: true,
    },
  });
}

// Create an assignment competency
export async function createAssignmentCompetency(data: any) {
  return prisma.assignmentCompetency.create({ data });
}

// Update an assignment competency
export async function updateAssignmentCompetency(id: string, data: any) {
  return prisma.assignmentCompetency.update({ where: { id }, data });
}

// Delete an assignment competency
export async function deleteAssignmentCompetency(id: string) {
  return prisma.assignmentCompetency.delete({ where: { id } });
}
