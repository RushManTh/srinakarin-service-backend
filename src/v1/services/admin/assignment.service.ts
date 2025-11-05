import { prisma } from "../../models/prisma";

// List all assignments
export async function listAssignments() {
  return prisma.assignment.findMany();
}

// Get assignment by ID
export async function getAssignmentById(id: string) {
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      teacherAssignment: true,
      attempts: true,
      competencies: true,
    },
  });
}

// Create an assignment
export async function createAssignment(data: any) {
  return prisma.assignment.create({ data });
}

// Update an assignment
export async function updateAssignment(id: string, data: any) {
  return prisma.assignment.update({ where: { id }, data });
}

// Delete an assignment
export async function deleteAssignment(id: string) {
  return prisma.assignment.delete({ where: { id } });
}
