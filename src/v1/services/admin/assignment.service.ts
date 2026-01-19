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

// List assignments by school subject with optional filters
export async function listAssignmentsBySubject(filters: {
  schoolSubjectId?: string;
  teacherId?: string;
  academicYearId?: string;
  termId?: string;
  classroomId?: string;
}) {
  const { schoolSubjectId, teacherId, academicYearId, termId, classroomId } =
    filters;

  // Build where clause for TeacherAssignment
  const teacherAssignmentWhere: any = {};
  if (schoolSubjectId) teacherAssignmentWhere.schoolSubjectId = schoolSubjectId;
  if (teacherId) teacherAssignmentWhere.teacherId = teacherId;
  if (academicYearId) teacherAssignmentWhere.academicYearId = academicYearId;
  if (termId) teacherAssignmentWhere.termId = termId;
  if (classroomId) teacherAssignmentWhere.classroomId = classroomId;

  // Find all matching TeacherAssignments
  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where: teacherAssignmentWhere,
  });

  if (teacherAssignments.length === 0) return [];

  const teacherAssignmentIds = teacherAssignments.map((ta) => ta.id);

  // Find all assignments for these TeacherAssignments
  return prisma.assignment.findMany({
    where: {
      teacherAssignmentId: { in: teacherAssignmentIds },
    },
    include: {
      teacherAssignment: {
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              prefix: true,
            },
          },
          schoolSubject: true,
          classroom: true,
          term: true,
          academicYear: true,
        },
      },
      attempts: {
        include: {
          _count: {
            select: { scores: true },
          },
        },
      },
      competencies: {
        include: {
          competency: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// List assignments by teacherAssignmentId
export async function listAssignmentsByTeacherAssignment(
  teacherAssignmentId: string
) {
  return prisma.assignment.findMany({
    where: {
      teacherAssignmentId,
    },
    include: {
      teacherAssignment: {
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              prefix: true,
            },
          },
          schoolSubject: true,
          classroom: true,
          term: true,
          academicYear: true,
        },
      },
      attempts: {
        include: {
          _count: {
            select: { scores: true },
          },
        },
      },
      competencies: {
        include: {
          competency: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
