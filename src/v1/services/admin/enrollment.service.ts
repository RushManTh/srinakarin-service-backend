import { prisma } from "../../models/prisma";

// List all enrollments
export async function listEnrollments() {
  return prisma.enrollment.findMany({
    include: {
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
    },
  });
}

// Get enrollment by ID
export async function getEnrollmentById(id: string) {
  return prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
    },
  });
}

// Create an enrollment
export async function createEnrollment(data: any) {
  return prisma.enrollment.create({ data });
}

// Update an enrollment
export async function updateEnrollment(id: string, data: any) {
  return prisma.enrollment.update({ where: { id }, data });
}

// Delete an enrollment
export async function deleteEnrollment(id: string) {
  return prisma.enrollment.delete({ where: { id } });
}
