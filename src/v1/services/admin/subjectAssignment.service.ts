import { prisma } from "../../models/prisma";

// List all subject assignments
export async function listSubjectAssignments({
  subjectId,
  teacherId,
  page = 1,
  pageSize = 10,
}: {
  subjectId?: number;
  teacherId?: number;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (subjectId) where.subjectId = subjectId;
  if (teacherId) where.teacherId = teacherId;
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.subjectAssignment.findMany({
      where,
      skip,
      take: pageSize,
      include: { subject: true, teacher: true },
    }),
    prisma.subjectAssignment.count({ where }),
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

// Create a subject assignment
export async function createSubjectAssignment(data: any) {
  return prisma.subjectAssignment.create({ data });
}

// Delete a subject assignment by ID
export async function deleteSubjectAssignment(id: number) {
  return prisma.subjectAssignment.delete({ where: { id } });
}
