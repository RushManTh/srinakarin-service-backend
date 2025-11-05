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

// Get student by ID (with teacher access control)
export async function getStudentById(id: string, teacherId: string) {
  // ดึงข้อมูลนักเรียน พร้อม classroom, homeroomTeachers, enrollments, schoolSubject, teacherAssignment
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      studentLevel: true,
      classroom: {
        include: {
          homeroomTeachers: true,
        },
      },
      programEducation: true,
      siblings: true,
      studentHealth: true,
      enrollments: {
        include: {
          schoolSubject: true,
          classroom: true,
          term: true,
          academicYear: true,
        },
      },
    },
  });
  if (!student) return null;

  // 1. Homeroom teacher check
  if (
    student.classroom &&
    student.classroom.homeroomTeachers.some((t) => t.id === teacherId)
  ) {
    return student;
  }

  // 2. Subject teacher check
  // หา TeacherAssignment ที่ตรงกับ schoolSubject ที่นักเรียนลงทะเบียน
  const schoolSubjectIds = student.enrollments.map((e) => e.schoolSubjectId);
  if (schoolSubjectIds.length > 0) {
    const teacherAssignment = await prisma.teacherAssignment.findFirst({
      where: {
        schoolSubjectId: { in: schoolSubjectIds },
        teacherId: teacherId,
      },
    });
    if (teacherAssignment) {
      return student;
    }
  }

  // ไม่อนุญาต
  return null;
}

// List enrollments for a student
export async function listStudentEnrollments(id: string) {
  return prisma.enrollment.findMany({
    where: { studentId: id },
    include: {
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
    },
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
    include: {
      assignmentScoreAttempt: {
        include: {
          assignment: true,
        },
      },
      assignmentScoreFiles: true,
    },
  });
}

// List all scores for a student in a subject (all indicators)
export async function listStudentSubjectScores(
  id: string,
  schoolSubjectId: string,
  academicYearId?: string,
  termId?: string
) {
  // หา assignmentId ทั้งหมดที่ตรงกับ schoolSubjectId, academicYearId, termId
  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where: {
      schoolSubjectId,
      ...(academicYearId && { academicYearId }),
      ...(termId && { termId }),
    },
    select: { id: true },
  });
  const teacherAssignmentIds = teacherAssignments.map((ta) => ta.id);
  if (teacherAssignmentIds.length === 0) return [];
  const assignments = await prisma.assignment.findMany({
    where: {
      teacherAssignmentId: { in: teacherAssignmentIds },
    },
    select: { id: true },
  });
  const assignmentIds = assignments.map((a) => a.id);
  if (assignmentIds.length === 0) return [];
  // ดึงคะแนน AssignmentScore ของนักเรียนใน assignment เหล่านี้
  return prisma.assignmentScore.findMany({
    where: {
      studentId: id,
      assignmentScoreAttempt: {
        assignmentId: { in: assignmentIds },
      },
    },
    include: {
      assignmentScoreAttempt: {
        include: {
          assignment: true,
        },
      },
      assignmentScoreFiles: true,
    },
  });
}

// ดึงคะแนนของนักเรียนในวิชานั้น ๆ โดยจัดกลุ่มตาม competency

export async function getStudentScoresBySubjectGroupedByCompetency(
  studentId: string,
  schoolSubjectId: string,
  termId: string,
  academicYearId: string
) {
  // หา teacherAssignment ที่ตรงกับ schoolSubjectId, termId, academicYearId
  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where: {
      schoolSubjectId,
      termId,
      academicYearId,
    },
    select: { id: true },
  });
  const teacherAssignmentIds = teacherAssignments.map((ta) => ta.id);
  if (teacherAssignmentIds.length === 0) return [];
  // หา assignment ทั้งหมดที่เกี่ยวข้องกับ teacherAssignmentIds
  const assignments = await prisma.assignment.findMany({
    where: {
      teacherAssignmentId: { in: teacherAssignmentIds },
    },
    include: {
      competencies: {
        include: {
          competency: true,
        },
      },
    },
  });
  // สร้าง mapping competencyId -> competency
  const competencyMap: Record<
    string,
    { id: string; name: string; code: string }
  > = {};
  assignments.forEach((a) => {
    a.competencies.forEach((ac) => {
      competencyMap[ac.competencyId] = {
        id: ac.competency.id,
        name: ac.competency.name,
        code: ac.competency.code,
      };
    });
  });
  // หา assignmentId ทั้งหมด
  const assignmentIds = assignments.map((a) => a.id);
  if (assignmentIds.length === 0) return [];
  // ดึงคะแนน AssignmentScore ของนักเรียนใน assignment เหล่านี้
  const scores = await prisma.assignmentScore.findMany({
    where: {
      studentId,
      assignmentScoreAttempt: {
        assignment: {
          id: { in: assignmentIds },
        },
      },
    },
    include: {
      assignmentScoreAttempt: {
        include: {
          assignment: {
            include: {
              competencies: {
                include: { competency: true },
              },
            },
          },
        },
      },
      assignmentScoreFiles: true,
    },
  });
  // จัดกลุ่มคะแนนตาม competency
  const grouped: Record<string, any[]> = {};
  const totalScoreMap: Record<string, number> = {};
  const maxScoreMap: Record<string, number> = {};
  scores.forEach((score) => {
    // assignment อาจมีหลาย competency
    const assignment = score.assignmentScoreAttempt?.assignment;
    if (!assignment) return;
    const maxScore = assignment.maxScore || 0;
    assignment.competencies.forEach((ac: any) => {
      const compId = ac.competencyId;
      if (!grouped[compId]) grouped[compId] = [];
      grouped[compId].push(score);
      // รวมคะแนน
      totalScoreMap[compId] = (totalScoreMap[compId] || 0) + (score.score || 0);
      // รวม maxScore เฉพาะ assignment ที่มีคะแนนของนักเรียน
      maxScoreMap[compId] = (maxScoreMap[compId] || 0) + maxScore;
    });
  });
  // สร้างผลลัพธ์แบบ array โดยรวม competency ทุกตัว (แม้ไม่มีคะแนน) และเรียงตาม competencyCode
  const allCompetencyIds = Object.keys(competencyMap);
  const result = allCompetencyIds.map((competencyId) => ({
    competencyId,
    competencyName: competencyMap[competencyId]?.name || "",
    competencyCode: competencyMap[competencyId]?.code || "",
    // scores: grouped[competencyId] || [],
    totalScore: totalScoreMap[competencyId] || 0,
    maxScore: maxScoreMap[competencyId] || 0,
  }));
  return result.sort((a, b) =>
    (a.competencyCode || "").localeCompare(b.competencyCode || "")
  );
}

export async function getTeacherAssignmentIdsBySubjectTermYear(
  schoolSubjectId: string,
  termId: string,
  academicYearId: string
): Promise<string[]> {
  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where: {
      schoolSubjectId,
      termId,
      academicYearId,
    },
    select: { id: true },
  });
  return teacherAssignments.map((ta) => ta.id);
}
