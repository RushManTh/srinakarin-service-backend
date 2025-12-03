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

// Bulk create enrollments for multiple students at once
export async function bulkCreateEnrollments(params: {
  studentIds: string[];
  schoolSubjectId: string;
  classroomId: string;
  termId: string;
  academicYearId: string;
  enrolledAt?: string;
  grade?: string | null;
  isCompleted?: boolean | null;
  completedAt?: string | null;
  note?: string | null;
}) {
  const {
    studentIds,
    schoolSubjectId,
    classroomId,
    termId,
    academicYearId,
    enrolledAt,
    grade,
    isCompleted,
    completedAt,
    note,
  } = params;

  // Normalize and validate inputs
  const uniqueStudentIds = Array.from(
    new Set((studentIds || []).filter(Boolean))
  );
  if (uniqueStudentIds.length === 0)
    throw new Error("studentIds is required and must be a non-empty array");

  // Validate referenced entities exist (lightweight checks)
  const [subject, classroom, term, academicYear] = await Promise.all([
    prisma.schoolSubject.findUnique({
      where: { id: schoolSubjectId },
      select: { id: true },
    }),
    prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { id: true },
    }),
    prisma.term.findUnique({ where: { id: termId }, select: { id: true } }),
    prisma.academicYear.findUnique({
      where: { id: academicYearId },
      select: { id: true },
    }),
  ]);
  if (!subject) throw new Error("SchoolSubject not found");
  if (!classroom) throw new Error("Classroom not found");
  if (!term) throw new Error("Term not found");
  if (!academicYear) throw new Error("AcademicYear not found");

  // Filter only existing students
  const existingStudents = await prisma.student.findMany({
    where: { id: { in: uniqueStudentIds } },
    select: { id: true },
  });
  const existingIds = new Set(existingStudents.map((s) => s.id));
  const invalidStudentIds = uniqueStudentIds.filter(
    (id) => !existingIds.has(id)
  );

  // Find already enrolled among existing students for same subject/term/year
  const alreadyEnrolled = await prisma.enrollment.findMany({
    where: {
      studentId: { in: Array.from(existingIds) },
      schoolSubjectId,
      termId,
      academicYearId,
    },
    select: { studentId: true },
  });
  const alreadyEnrolledIds = new Set(alreadyEnrolled.map((e) => e.studentId));

  // Determine target list to insert
  const toInsertIds = Array.from(existingIds).filter(
    (id) => !alreadyEnrolledIds.has(id)
  );

  // Build data rows
  const enrolledAtDate = enrolledAt ? new Date(enrolledAt) : undefined;
  const completedAtDate = completedAt ? new Date(completedAt) : undefined;

  let createdCount = 0;
  if (toInsertIds.length > 0) {
    const result = await prisma.enrollment.createMany({
      data: toInsertIds.map((studentId) => ({
        studentId,
        schoolSubjectId,
        classroomId,
        termId,
        academicYearId,
        enrolledAt: enrolledAtDate,
        grade: grade ?? undefined,
        isCompleted: isCompleted ?? undefined,
        completedAt: completedAtDate,
        note: note ?? undefined,
      })),
      skipDuplicates: true, // Respect DB unique constraint
    });
    createdCount = result.count;
  }

  // Fetch resulting enrollments for all requested (existing) students
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: { in: Array.from(existingIds) },
      schoolSubjectId,
      termId,
      academicYearId,
    },
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

  return {
    success: true,
    requested: uniqueStudentIds.length,
    validStudents: existingIds.size,
    created: createdCount,
    alreadyEnrolled: alreadyEnrolledIds.size,
    invalidStudentIds,
    items: enrollments,
  };
}
