import { prisma } from "../../models/prisma";

export async function isTeacherAssignedToAssignment(
  assignmentId: string,
  teacherId: string
) {
  // หา TeacherAssignment ที่มี assignmentId นี้
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { teacherAssignmentId: true },
  });
  if (!assignment) return false;
  const ta = await prisma.teacherAssignment.findUnique({
    where: { id: assignment.teacherAssignmentId },
  });
  if (!ta) return false;
  return ta.teacherId === teacherId;
}

// List all assignment scores
export async function listAssignmentScores() {
  return prisma.assignmentScore.findMany({
    include: {
      assignmentScoreAttempt: true,
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
      assignmentScoreFiles: true,
    },
  });
}

// Get assignment score by ID
export async function getAssignmentScoreById(id: string) {
  return prisma.assignmentScore.findUnique({
    where: { id },
    include: {
      assignmentScoreAttempt: true,
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
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

// List assignment scores by competencyId
export async function listAssignmentScoresByCompetency(competencyId: string) {
  // หา assignmentId ทั้งหมดที่มี competencyId นี้
  const assignmentCompetencies = await prisma.assignmentCompetency.findMany({
    where: { competencyId },
    select: { assignmentId: true },
  });
  const assignmentIds = assignmentCompetencies.map((ac) => ac.assignmentId);
  if (assignmentIds.length === 0) return [];
  // ดึงคะแนน AssignmentScore ที่ assignmentId ตรงกับ competency
  return prisma.assignmentScore.findMany({
    where: {
      assignmentScoreAttempt: {
        assignment: {
          id: { in: assignmentIds },
        },
      },
    },
    include: {
      assignmentScoreAttempt: {
        include: {
          assignment: true,
        },
      },
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
      assignmentScoreFiles: true,
    },
  });
}

// ดึงคะแนนของนักเรียนในวิชานั้น ๆ โดยจัดกลุ่มตาม competency

export async function getStudentScoresBySubjectGroupedByCompetency(
  studentId: string,
  teacherAssignmentId: string
) {
  // หา assignment ทั้งหมดที่เกี่ยวข้องกับ teacherAssignmentId
  const assignments = await prisma.assignment.findMany({
    where: {
      teacherAssignmentId,
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

export async function getStudentAssignmentScoresByTeacherAssignment(
  teacherAssignmentId: string,
  studentId: string
) {
  // Find all assignments for the given teacherAssignmentId
  const assignments = await prisma.assignment.findMany({
    where: { teacherAssignmentId },
    select: { id: true },
  });
  const assignmentIds = assignments.map((a) => a.id);
  if (assignmentIds.length === 0) return [];

  // Find all scores for the student in those assignments
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
          assignment: true,
        },
      },
      assignmentScoreFiles: true,
    },
  });
}
