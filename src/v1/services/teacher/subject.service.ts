import { LearningApproach } from "../../../generated/prisma";
import { prisma } from "../../models/prisma";

// List all subjects
export async function listSubjects({
  search,
  subjectTypeId,
  levelId,
  learningAreaId,
  isActive,
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  subjectTypeId?: number;
  levelId?: number;
  learningAreaId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }
  if (subjectTypeId) where.subjectTypeId = subjectTypeId;
  if (levelId) where.levelId = levelId;
  if (learningAreaId) where.learningAreaId = learningAreaId;
  if (typeof isActive === "boolean") where.isActive = isActive;
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take: pageSize,
      include: { learningArea: true },
    }),
    prisma.subject.count({ where }),
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

// Get subject by ID (with teacher access control)
export async function getSubjectById(id: number, teacherId: number) {
  // Check if this teacher is assigned to this subject
  const assignment = await prisma.subjectAssignment.findFirst({
    where: {
      subjectId: id,
      teacherId: Number(teacherId),
    },
  });
  if (!assignment) return null;
  // If assigned, return subject details
  return prisma.subject.findUnique({
    where: { id },
    include: {
      subjectType: true,
      level: true,
      learningArea: true,
      indicators: true,
      SubjectAssignment: {
        include: {
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });
}

// List students enrolled in a subject
export async function listSubjectStudents(subjectId: number) {
  return prisma.enrollment.findMany({
    where: { subjectId },
    include: { student: true },
  });
}

// List indicators for a subject
export async function listSubjectIndicators(subjectId: number) {
  return prisma.subjectIndicator.findMany({
    where: { subjectId },
  });
}
