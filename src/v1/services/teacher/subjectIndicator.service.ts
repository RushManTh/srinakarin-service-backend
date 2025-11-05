import { prisma } from "../../models/prisma";

// List all assignments
export async function listAssignments() {
  return prisma.assignment.findMany({
    include: {
      competencies: { include: { competency: true } },
      attempts: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Helper: check if teacher is assigned to the subject of this assignment
export async function isTeacherAssignedToAssignment(
  assignmentId: string,
  teacherId: string
) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });
  if (!assignment || !assignment.teacherAssignmentId) return false;
  const teacherAssignment = await prisma.teacherAssignment.findUnique({
    where: { id: assignment.teacherAssignmentId },
  });
  if (!teacherAssignment) return false;
  return teacherAssignment.teacherId === teacherId;
}

// Get assignment by ID (with teacher access control)
export async function getAssignmentById(id: string, teacherId?: string) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToAssignment(id, teacherId);
    if (!allowed) return null;
  }
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      competencies: { include: { competency: true } },
      attempts: true,
    },
  });
}

// Create an assignment
export async function createAssignment(data: any) {
  return prisma.assignment.create({ data });
}

// Update an assignment (with teacher access control)
export async function updateAssignment(
  id: string,
  data: any,
  teacherId?: string
) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToAssignment(id, teacherId);
    if (!allowed) return null;
  }
  return prisma.assignment.update({ where: { id }, data });
}

// Delete a subject assignment (with teacher access control)
export async function deleteAssignment(id: string, teacherId?: string) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToAssignment(id, teacherId);
    if (!allowed) return null;
  }
  // เช็คว่ามีคะแนนที่อ้างถึงตัวชี้วัดนี้หรือไม่
  const scoreCount = await prisma.assignmentScore.count({
    where: { assignmentScoreAttemptId: id },
  });
  if (scoreCount > 0) {
    throw new Error(
      "ไม่สามารถลบตัวชี้วัดนี้ได้ เนื่องจากมีการลงคะแนนที่อ้างถึงตัวชี้วัดนี้อยู่"
    );
  }
  return prisma.assignment.delete({ where: { id } });
}

// List subject assignments by teacher assignment ID
export async function listSubjectAssignmentsByTeacherAssignmentId(
  teacherAssignmentId: string
) {
  return prisma.assignment.findMany({
    where: { teacherAssignmentId },
    include: {
      competencies: { include: { competency: true } },
      attempts: true,
    },
    orderBy: { code: "asc" },
  });
}

// List subject indicators by teacher assignment ID, with score status for a student

export async function listAssignmentsWithStudentScoreStatus(
  teacherAssignmentId: string,
  studentId: string,
  teacherId?: string
) {
  // ดึง assignment ทั้งหมดที่เกี่ยวข้องกับ teacherAssignmentId
  const assignments = await prisma.assignment.findMany({
    where: { teacherAssignmentId },
    orderBy: { code: "asc" },
    include: {
      attempts: {
        include: {
          scores: true,
        },
      },
    },
  });
  if (assignments.length === 0) return [];
  // Attach hasScore ให้แต่ละ attempt ใน assignment
  return assignments.map((assignment: any) => ({
    ...assignment,
    attempts:
      assignment.attempts?.map((attempt: any) => ({
        ...attempt,
        hasScore: attempt.scores.some(
          (score: any) => score.studentId === studentId
        ),
      })) ?? [],
  }));
}
