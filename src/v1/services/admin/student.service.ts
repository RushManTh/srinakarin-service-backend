import { prisma } from "../../models/prisma";

// List all students with filter and pagination
export async function listStudents({
  studentLevelId,
  programEducationId,
  classroomId,
  search,
  page = 1,
  pageSize = 10,
}: {
  studentLevelId?: string;
  programEducationId?: string;
  classroomId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (studentLevelId) where.studentLevelId = studentLevelId;
  if (programEducationId) where.programEducationId = programEducationId;
  if (classroomId) where.classroomId = classroomId;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { studentCode: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: pageSize,
      include: { studentLevel: true, classroom: true, programEducation: true },
    }),
    prisma.student.count({ where }),
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

// Get student by ID
export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      studentLevel: true,
      classroom: true,
      programEducation: true,
      siblings: true,
      studentHealth: true,
    },
  });
}

// Create a student
// รองรับ field ครบตาม schema.prisma ของ Student
export async function createStudent(data: any) {
  return prisma.student.create({ data });
}

// Update a student
// รองรับ field ครบตาม schema.prisma ของ Student
export async function updateStudent(id: string, data: any) {
  return prisma.student.update({ where: { id }, data });
}

// Delete a student
export async function deleteStudent(id: string) {
  return prisma.student.delete({ where: { id } });
}

// List enrollments for a student
export async function listStudentEnrollments(id: string) {
  return prisma.enrollment.findMany({
    where: { studentId: id },
    include: { schoolSubject: true },
  });
}

// List subjects for a student
export async function listStudentSubjects(id: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: id },
    include: { schoolSubject: true },
  });
  return enrollments.map((e) => e.schoolSubject);
}

// List all scores for a student (all subjects/indicators)
export async function listStudentScores(id: string) {
  return prisma.assignmentScore.findMany({
    where: { studentId: id },
    include: { assignmentScoreAttempt: true },
  });
}

// List all scores for a student in a subject (all indicators)
export async function listStudentSubjectScores(id: string, subjectId: string) {
  return prisma.assignmentScore.findMany({
    where: {
      studentId: id,
      assignmentScoreAttempt: {
        assignment: {
          teacherAssignment: { schoolSubjectId: subjectId },
        },
      },
    },
    include: { assignmentScoreAttempt: true },
  });
}
