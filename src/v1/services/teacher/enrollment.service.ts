import { prisma } from "../../models/prisma";

// List all enrollments
export async function listEnrollments({
  studentId,
  subjectId,
  page = 1,
  pageSize = 10,
}: {
  studentId?: number;
  subjectId?: number;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (subjectId) where.subjectId = subjectId;
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      skip,
      take: pageSize,
      include: { student: true, subject: true },
    }),
    prisma.enrollment.count({ where }),
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

// Create an enrollment (with teacher access control)
export async function createEnrollment(data: any, teacherId?: number) {
  if (teacherId !== undefined) {
    // Check if teacher is assigned to the subject
    const assignment = await prisma.subjectAssignment.findFirst({
      where: {
        subjectId: data.subjectId,
        teacherId: Number(teacherId),
      },
    });
    if (assignment) {
      return prisma.enrollment.create({ data });
    }
    // If not assigned, check if teacher is homeroom teacher of the student
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: { classroom: { include: { homeroomTeachers: true } } },
    });
    if (
      student &&
      student.classroom &&
      student.classroom.homeroomTeachers.some(
        (t) => Number(t.id) === Number(teacherId)
      )
    ) {
      return prisma.enrollment.create({ data });
    }
    // Not allowed
    return null;
  }
  // No teacherId provided, allow (for admin or system use)
  return prisma.enrollment.create({ data });
}

// Helper: check if teacher is assigned to the subject of this enrollment
export async function isTeacherAssignedToEnrollment(
  enrollmentId: number,
  teacherId: number
) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { subject: true },
  });
  if (!enrollment || !enrollment.subject) return false;
  const assignment = await prisma.subjectAssignment.findFirst({
    where: {
      subjectId: enrollment.subjectId,
      teacherId: Number(teacherId),
    },
  });
  return !!assignment;
}

// Delete an enrollment by ID (with teacher access control)
export async function deleteEnrollment(id: number, teacherId?: number) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToEnrollment(id, teacherId);
    if (!allowed) return null;
  }
  return prisma.enrollment.delete({ where: { id } });
}

// List enrollments by student (with teacher access control)
export async function listStudentEnrollments(
  studentId: number,
  teacherId?: number
) {
  if (teacherId !== undefined) {
    // Only return enrollments for subjects assigned to this teacher
    const assignments = await prisma.subjectAssignment.findMany({
      where: { teacherId: Number(teacherId) },
      select: { subjectId: true },
    });
    const subjectIds = assignments.map((a) => a.subjectId);
    if (subjectIds.length === 0) return [];
    return prisma.enrollment.findMany({
      where: { studentId, subjectId: { in: subjectIds } },
      include: { subject: true },
    });
  }
  return prisma.enrollment.findMany({
    where: { studentId },
    include: { subject: true },
  });
}

// List enrollments by subject (with teacher access control)
export async function listSubjectEnrollments(
  subjectId: number,
  teacherId?: number
) {
  if (teacherId !== undefined) {
    // Only allow if teacher is assigned to this subject
    const assignment = await prisma.subjectAssignment.findFirst({
      where: { subjectId, teacherId: Number(teacherId) },
    });
    if (!assignment) return [];
  }
  return prisma.enrollment.findMany({
    where: { subjectId },
    include: { student: true },
  });
}
