import { prisma } from "../../models/prisma";

// List all teacher assignments for the current teacher
export async function listTeacherAssignments(teacherId?: string) {
  // ถ้ามี teacherId ให้ filter เฉพาะ assignment ของ teacher นั้น
  const where = teacherId ? { teacherId } : {};
  return prisma.teacherAssignment.findMany({
    where,
    include: {
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

// Get teacher assignment by ID (เฉพาะ assignment ของ teacher)
export async function getTeacherAssignmentById(id: string, teacherId?: string) {
  return prisma.teacherAssignment.findFirst({
    where: {
      id,
      ...(teacherId ? { teacherId } : {}),
    },
    include: {
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
      assignment: {
        include: {
          competencies: {
            include: {
              competency: true,
            },
          },
          attempts: true,
        },
      },
    },
  });
}

// ดึงข้อมูลนักเรียนที่ลงทะเบียนในวิชาตาม TeacherAssignment พร้อมคะแนนรวมแต่ละประเภท
export async function getStudentsWithScoresByTeacherAssignment(
  teacherAssignmentId: string
) {
  // ดึง TeacherAssignment
  const ta = await prisma.teacherAssignment.findUnique({
    where: { id: teacherAssignmentId },
    include: {
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
      assignment: true,
    },
  });
  if (!ta) throw new Error("TeacherAssignment not found");

  // ดึง Enrollment พร้อม Student
  const enrollments = await prisma.enrollment.findMany({
    where: {
      schoolSubjectId: ta.schoolSubjectId,
      classroomId: ta.classroomId,
      termId: ta.termId,
      academicYearId: ta.academicYearId,
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentCode: true,
        },
      },
    },
  });

  // assignments ที่เกี่ยวข้องกับ TeacherAssignment นี้
  const assignmentIdsByType: Record<string, string[]> = {
    SCORE: [],
    MIDTERM: [],
    FINAL: [],
  };
  for (const a of ta.assignment) {
    if (assignmentIdsByType[a.scoreType]) {
      assignmentIdsByType[a.scoreType].push(a.id);
    }
  }

  // ดึงคะแนน AssignmentScore ของนักเรียนแต่ละคน
  const result = await Promise.all(
    enrollments.map(async (enroll) => {
      const scores: Record<string, number> = { SCORE: 0, MIDTERM: 0, FINAL: 0 };
      for (const type of ["SCORE", "MIDTERM", "FINAL"]) {
        if (assignmentIdsByType[type].length > 0) {
          const scoreSum = await prisma.assignmentScore.aggregate({
            where: {
              studentId: enroll.studentId,
              assignmentScoreAttempt: {
                assignmentId: { in: assignmentIdsByType[type] },
              },
            },
            _sum: { score: true },
          });
          scores[type] = scoreSum._sum.score || 0;
        }
      }
      return {
        student: enroll.student,
        scores,
      };
    })
  );

  return result;
}
