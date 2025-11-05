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

// Get score by ID
export async function getScoreById(id: number) {
  return prisma.subjectIndicatorScore.findUnique({
    where: { id },
    include: { subjectIndicator: true, student: true, files: true },
  });
}

// Create a score
export async function createScore(data: any) {
  return prisma.subjectIndicatorScore.create({ data });
}

// Update a score
export async function updateScore(id: number, data: any) {
  return prisma.subjectIndicatorScore.update({ where: { id }, data });
}

// Delete a score
export async function deleteScore(id: number) {
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
