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
      include: {
        learningArea: true,
        subjectType: true,
        level: true,
        SubjectAssignment: { include: { teacher: true } },
      },
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

// Get subject by ID
export async function getSubjectById(id: number) {
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

// Create a subject
export async function createSubject(data: any) {
  return prisma.subject.create({ data });
}

// Update a subject
export async function updateSubject(id: number, data: any) {
  return prisma.subject.update({ where: { id }, data });
}

// Delete a subject
export async function deleteSubject(id: number) {
  return prisma.subject.delete({ where: { id } });
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

// List subjects by learning approach
export async function listSubjectsByLearningApproach(
  learningApproach: LearningApproach
) {
  return prisma.subject.findMany({
    where: { learningApproach },
  });
}
