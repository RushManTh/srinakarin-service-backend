import { prisma } from "../../models/prisma";

// List all teacher assignments
export async function listTeacherAssignments({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.teacherAssignment.findMany({
      skip,
      take: pageSize,
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
    }),
    prisma.teacherAssignment.count(),
  ]);
  return {
    items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
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
