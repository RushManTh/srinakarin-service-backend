import { prisma } from "../../models/prisma";

// List all scores with optional filters
export async function listScores(filters: any) {
  const {
    studentId,
    subjectId,
    academicYearId,
    termId,
    page = 1,
    pageSize = 10,
  } = filters;
  return prisma.subjectIndicatorScore
    .findMany({
      where: {
        ...(studentId && { studentId: Number(studentId) }),
        ...(academicYearId && { academicYearId: Number(academicYearId) }),
        ...(termId && { termId: Number(termId) }),
        ...(subjectId && {
          subjectIndicator: { subjectId: Number(subjectId) },
        }),
      },
      include: { subjectIndicator: true, student: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    .then((items) =>
      prisma.subjectIndicatorScore
        .count({
          where: {
            ...(studentId && { studentId: Number(studentId) }),
            ...(academicYearId && { academicYearId: Number(academicYearId) }),
            ...(termId && { termId: Number(termId) }),
            ...(subjectId && {
              subjectIndicator: { subjectId: Number(subjectId) },
            }),
          },
        })
        .then((total) => ({
          items,
          meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        }))
    );
}

// Helper: check if teacher is assigned to the subject of this score
export async function isTeacherAssignedToScore(
  scoreId: number,
  teacherId: number
) {
  const score = await prisma.subjectIndicatorScore.findUnique({
    where: { id: scoreId },
    include: { subjectIndicator: true },
  });
  if (!score || !score.subjectIndicator) return false;
  const assignment = await prisma.subjectAssignment.findFirst({
    where: {
      subjectId: score.subjectIndicator.subjectId,
      teacherId: Number(teacherId),
    },
  });
  return !!assignment;
}

// Get score by ID (with teacher access control)
export async function getScoreById(id: number, teacherId?: number) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToScore(id, teacherId);
    if (!allowed) return null;
  }
  return prisma.subjectIndicatorScore.findUnique({
    where: { id },
    include: { subjectIndicator: true, student: true, files: true },
  });
}

// Create a score (with teacher access control)
export async function createScore(data: any, teacherId?: number) {
  if (teacherId !== undefined) {
    // Find the subjectId from the subjectIndicator
    const indicator = await prisma.subjectIndicator.findUnique({
      where: { id: data.subjectIndicatorId },
    });
    if (!indicator) return null;
    // Check if teacher is assigned to the subject
    const assignment = await prisma.subjectAssignment.findFirst({
      where: {
        subjectId: indicator.subjectId,
        teacherId: Number(teacherId),
      },
    });
    if (assignment) {
      return prisma.subjectIndicatorScore.create({ data });
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
      return prisma.subjectIndicatorScore.create({ data });
    }
    // Not allowed
    return null;
  }
  // No teacherId provided, allow (for admin or system use)
  return prisma.subjectIndicatorScore.create({ data });
}

// Update a score (with teacher access control)
export async function updateScore(id: number, data: any, teacherId?: number) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToScore(id, teacherId);
    if (!allowed) return null;
  }
  return prisma.subjectIndicatorScore.update({ where: { id }, data });
}

// Delete a score (with teacher access control)
export async function deleteScore(id: number, teacherId?: number) {
  if (teacherId !== undefined) {
    const allowed = await isTeacherAssignedToScore(id, teacherId);
    if (!allowed) return null;
  }
  return prisma.subjectIndicatorScore.delete({ where: { id } });
}

// List all scores for a student in a subject (all indicators)
export async function listStudentSubjectScores(
  studentId: number,
  subjectId: number
) {
  return prisma.subjectIndicatorScore.findMany({
    where: {
      studentId,
      subjectIndicator: { subjectId },
    },
    include: { subjectIndicator: true },
    orderBy: { subjectIndicator: { code: "asc" } },
  });
}

// List all scores for all students in an indicator
export async function listIndicatorScores(
  subjectId: number,
  indicatorId: number
) {
  return prisma.subjectIndicatorScore.findMany({
    where: {
      subjectIndicatorId: indicatorId,
      subjectIndicator: { subjectId },
    },
    include: { student: true },
  });
}

// Get total scores for a student in a subject, grouped by indicatorType, academicYear, and term
export async function getStudentSubjectScoreSummary({
  studentId,
  subjectId,
  academicYearId,
  termId,
}: {
  studentId: number;
  subjectId: number;
  academicYearId?: number;
  termId?: number;
}) {
  // Fetch all scores for this student/subject (optionally filter by year/term)
  const scores = await prisma.subjectIndicatorScore.findMany({
    where: {
      studentId,
      subjectIndicator: { subjectId },
      ...(academicYearId && { academicYearId }),
      ...(termId && { termId }),
    },
    include: {
      subjectIndicator: true,
      academicYear: true,
      term: true,
    },
  });
  // Group and sum by indicatorType, academicYear, term
  const summary: any = {};
  for (const s of scores) {
    const indicatorType = s.subjectIndicator.indicatorType;
    const year = s.academicYear?.id || s.academicYearId || "none";
    const term = s.term?.id || s.termId || "none";
    const key = `${year}_${term}`;
    if (!summary[key]) {
      summary[key] = {
        academicYearId: year,
        termId: term,
        SCORE: 0,
        MIDTERM: 0,
        FINAL: 0,
      };
    }
    summary[key][indicatorType] += s.score;
  }
  // Return as array
  return Object.values(summary);
}

// Get total scores for all students in a subject, grouped by indicatorType, academicYear, and term
export async function getAllStudentsSubjectScoreSummary({
  subjectId,
  academicYearId,
  termId,
  search,
  studentLevelId,
  classroomId,
  programEducationId,
}: {
  subjectId: number;
  academicYearId?: number;
  termId?: number;
  search?: string;
  studentLevelId?: number;
  classroomId?: number;
  programEducationId?: number;
}) {
  // Find all students enrolled in this subject (with filters)
  const studentWhere: any = {};
  if (studentLevelId) studentWhere.studentLevelId = studentLevelId;
  if (classroomId) studentWhere.classroomId = classroomId;
  if (programEducationId) studentWhere.programEducationId = programEducationId;
  if (search) {
    studentWhere.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { studentCode: { contains: search, mode: "insensitive" } },
    ];
  }
  // Get all students enrolled in this subject
  const enrollments = await prisma.enrollment.findMany({
    where: { subjectId },
    include: { student: true },
  });
  const filteredStudents = enrollments
    .map((e) => e.student)
    .filter(
      (s, i, arr) =>
        arr.findIndex((ss) => ss.id === s.id) === i &&
        Object.entries(studentWhere).every(([k, v]) => {
          if (k === "OR" && Array.isArray(v)) {
            return v.some((cond: any) => {
              const key = Object.keys(cond)[0] as keyof typeof s;
              const val = cond[key]?.contains;
              return typeof s[key] === "string" && typeof val === "string"
                ? (s[key] as string).toLowerCase().includes(val.toLowerCase())
                : false;
            });
          }
          if (v === undefined) return true;
          return s[k as keyof typeof s] === v;
        })
    );

  // Fetch all scores for this subject (optionally filter by year/term)
  const scores = await prisma.subjectIndicatorScore.findMany({
    where: {
      subjectIndicator: { subjectId },
      ...(academicYearId && { academicYearId }),
      ...(termId && { termId }),
    },
    include: {
      subjectIndicator: true,
      academicYear: true,
      term: true,
      student: true,
    },
  });
  // Group by student, then by year/term/type
  const studentMap: Record<number, any> = {};
  for (const s of scores) {
    const studentId = s.studentId;
    if (!studentMap[studentId]) {
      studentMap[studentId] = {
        student: s.student,
        summary: {},
      };
    }
    const indicatorType = s.subjectIndicator.indicatorType;
    const year = s.academicYear?.id || s.academicYearId || "none";
    const term = s.term?.id || s.termId || "none";
    const key = `${year}_${term}`;
    if (!studentMap[studentId].summary[key]) {
      studentMap[studentId].summary[key] = {
        academicYearId: year,
        termId: term,
        SCORE: 0,
        MIDTERM: 0,
        FINAL: 0,
      };
    }
    studentMap[studentId].summary[key][indicatorType] += s.score;
  }
  // Merge all students (with or without scores)
  return filteredStudents.map((student) => ({
    student,
    summary: studentMap[student.id]
      ? Object.values(studentMap[student.id].summary)
      : [],
  }));
}

// List scores by competency for a subject type, with optional filters for academic year and term
export async function listScoresByCompetency({
  subjectTypeId,
  competencyId,
  academicYearId,
  termId,
  studentId,
}: {
  subjectTypeId: number;
  competencyId?: number;
  academicYearId?: number;
  termId?: number;
  studentId?: number;
}) {
  // 1. หา competency ของ subjectType
  const competencies = await prisma.competency.findMany({
    where: {
      subjectTypeId: Number(subjectTypeId),
      ...(competencyId && { id: Number(competencyId) }),
    },
    select: { id: true },
  });
  const competencyIds = competencies.map((c) => c.id);
  if (competencyIds.length === 0) return [];

  // 2. หา subjectIndicator ที่ competencyId อยู่ในกลุ่มนี้
  const indicators = await prisma.subjectIndicator.findMany({
    where: { competencyId: { in: competencyIds } },
    select: { id: true },
  });
  const indicatorIds = indicators.map((i) => i.id);
  if (indicatorIds.length === 0) return [];

  // 3. หาคะแนน
  return prisma.subjectIndicatorScore.findMany({
    where: {
      subjectIndicatorId: { in: indicatorIds },
      ...(academicYearId && { academicYearId: Number(academicYearId) }),
      ...(termId && { termId: Number(termId) }),
      ...(studentId && { studentId: Number(studentId) }),
    },
    include: {
      student: true,
      subjectIndicator: {
        include: { competency: true },
      },
      academicYear: true,
      term: true,
    },
  });
}

export async function getStudentScoresBySubjectGroupedByCompetency({
  subjectId,
  studentId,
  academicYearId,
  termId,
}: {
  subjectId: number;
  studentId: number;
  academicYearId?: number;
  termId?: number;
}) {
  // 1. หา subjectTypeId ของวิชานี้
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { subjectTypeId: true },
  });
  if (!subject) return [];

  // 2. หา competency ทั้งหมดของ subjectTypeId นี้
  const competencies = await prisma.competency.findMany({
    where: { subjectTypeId: subject.subjectTypeId },
    select: { id: true, name: true, code: true },
  });
  if (!competencies.length) return [];

  // 3. หา subjectIndicator ที่ competencyId อยู่ในกลุ่มนี้ และ subjectId ตรงกับที่รับมา
  const indicators = await prisma.subjectIndicator.findMany({
    where: {
      subjectId,
      competencyId: { in: competencies.map((c) => c.id) },
    },
    select: { id: true, competencyId: true, maxScore: true },
  });
  if (!indicators.length) return [];

  // 4. หาคะแนนของ studentId ที่ subjectIndicatorId อยู่ในกลุ่มนี้
  const indicatorIds = indicators.map((i) => i.id);
  const scores = await prisma.subjectIndicatorScore.findMany({
    where: {
      studentId,
      subjectIndicatorId: { in: indicatorIds },
      ...(academicYearId && { academicYearId }),
      ...(termId && { termId }),
    },
    include: {
      subjectIndicator: {
        select: { id: true, competencyId: true, maxScore: true },
      },
      academicYear: true,
      term: true,
    },
  });

  // 5. Group ตาม competency และรวมคะแนน (maxScore เฉพาะ subjectIndicator ที่มีคะแนน)
  const result: Record<number, any> = {};
  for (const comp of competencies) {
    result[comp.id] = {
      competencyId: comp.id,
      competencyName: comp.name,
      competencyCode: comp.code,
      scores: [],
      totalScore: 0,
      maxScore: 0,
    };
  }
  for (const s of scores) {
    const compId = s.subjectIndicator.competencyId;
    if (result[compId]) {
      result[compId].scores.push(s);
      result[compId].totalScore += s.score;
      // รวม maxScore เฉพาะ subjectIndicator ที่มีคะแนนของนักเรียน
      result[compId].maxScore += s.subjectIndicator.maxScore || 0;
    }
  }
  // return array
  return Object.values(result);
}
