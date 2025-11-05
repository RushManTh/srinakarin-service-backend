import { prisma } from "../../models/prisma";

// List all teacher assignments
export async function listTeacherAssignments() {
  return prisma.teacherAssignment.findMany({
    include: {
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Get teacher assignment by ID
export async function getTeacherAssignmentById(id: string) {
  return prisma.teacherAssignment.findUnique({
    where: { id },
    include: {
      teacher: true,
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
      assignment: true,
    },
  });
}

// Create a teacher assignment
export async function createTeacherAssignment(data: any) {
  return prisma.teacherAssignment.create({ data });
}

// Update a teacher assignment
export async function updateTeacherAssignment(id: string, data: any) {
  return prisma.teacherAssignment.update({ where: { id }, data });
}

// Delete a teacher assignment
export async function deleteTeacherAssignment(id: string) {
  return prisma.teacherAssignment.delete({ where: { id } });
}
