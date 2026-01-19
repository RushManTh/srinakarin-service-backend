import { prisma } from "../../models/prisma";

// List all assignment scores
export async function listAssignmentScores() {
  return prisma.assignmentScore.findMany();
}

// Get assignment score by ID
export async function getAssignmentScoreById(id: string) {
  return prisma.assignmentScore.findUnique({
    where: { id },
    include: {
      assignmentScoreAttempt: true,
      student: true,
      assignmentScoreFiles: true,
    },
  });
}

// Create an assignment score
export async function createAssignmentScore(data: any) {
  return prisma.assignmentScore.create({ data });
}

// Update an assignment score
export async function updateAssignmentScore(id: string, data: any) {
  return prisma.assignmentScore.update({ where: { id }, data });
}

// Delete an assignment score
export async function deleteAssignmentScore(id: string) {
  return prisma.assignmentScore.delete({ where: { id } });
}

// ดึงคะแนนของนักเรียนในวิชานั้น ๆ โดยจัดกลุ่มตาม competency
export async function getStudentScoresBySubjectGroupedByCompetency(
  studentId: string,
  schoolSubjectId: string,
  filters?: { academicYearId?: string; termId?: string }
) {
  // หา TeacherAssignment ที่ตรงกับ schoolSubjectId และ filter
  const where: any = { schoolSubjectId };
  if (filters?.academicYearId) {
    where.academicYearId = filters.academicYearId;
  }
  if (filters?.termId) {
    where.termId = filters.termId;
  }

  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where,
  });

  if (teacherAssignments.length === 0) return [];

  // หา assignment ทั้งหมดที่เกี่ยวข้องกับ teacherAssignment เหล่านี้
  const teacherAssignmentIds = teacherAssignments.map((ta) => ta.id);
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
    const assignment = score.assignmentScoreAttempt?.assignment;
    if (!assignment) return;
    const maxScore = assignment.maxScore || 0;

    assignment.competencies.forEach((ac: any) => {
      const compId = ac.competencyId;
      if (!grouped[compId]) grouped[compId] = [];
      grouped[compId].push(score);

      // รวมคะแนน
      totalScoreMap[compId] = (totalScoreMap[compId] || 0) + (score.score || 0);
      // รวม maxScore
      maxScoreMap[compId] = (maxScoreMap[compId] || 0) + maxScore;
    });
  });

  // สร้างผลลัพธ์แบบ array โดยรวม competency ทุกตัว (แม้ไม่มีคะแนน)
  const allCompetencyIds = Object.keys(competencyMap);
  const result = allCompetencyIds.map((competencyId) => ({
    competencyId,
    competencyName: competencyMap[competencyId]?.name || "",
    competencyCode: competencyMap[competencyId]?.code || "",
    totalScore: totalScoreMap[competencyId] || 0,
    maxScore: maxScoreMap[competencyId] || 0,
  }));

  return result.sort((a, b) =>
    (a.competencyCode || "").localeCompare(b.competencyCode || "")
  );
}

// ดึงคะแนน assignment ทั้งหมดของนักเรียนในวิชา
export async function getStudentAssignmentScoresBySubject(
  studentId: string,
  schoolSubjectId: string,
  filters?: { academicYearId?: string; termId?: string }
) {
  // หา TeacherAssignment ที่ตรงกับ schoolSubjectId และ filter
  const where: any = { schoolSubjectId };
  if (filters?.academicYearId) {
    where.academicYearId = filters.academicYearId;
  }
  if (filters?.termId) {
    where.termId = filters.termId;
  }

  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where,
  });

  if (teacherAssignments.length === 0) return [];

  // หา assignment ทั้งหมดที่เกี่ยวข้อง
  const teacherAssignmentIds = teacherAssignments.map((ta) => ta.id);
  const assignments = await prisma.assignment.findMany({
    where: {
      teacherAssignmentId: { in: teacherAssignmentIds },
    },
    select: { id: true },
  });

  const assignmentIds = assignments.map((a) => a.id);
  if (assignmentIds.length === 0) return [];

  // ดึงคะแนนของนักเรียน
  return prisma.assignmentScore.findMany({
    where: {
      studentId,
      assignmentScoreAttempt: {
        assignmentId: { in: assignmentIds },
      },
    },
    include: {
      assignmentScoreAttempt: {
        include: {
          assignment: {
            include: {
              teacherAssignment: {
                include: {
                  teacher: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                  schoolSubject: true,
                  term: true,
                  academicYear: true,
                },
              },
              competencies: {
                include: {
                  competency: true,
                },
              },
            },
          },
        },
      },
      assignmentScoreFiles: true,
    },
  });
}
