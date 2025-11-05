import { prisma } from "../../models/prisma";

// List all student levels
export async function listStudentLevels({
  search,
  page = 1,
  pageSize = 10,
}: { search?: string; page?: number; pageSize?: number } = {}) {
  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.studentLevel.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        level: true,
      },
      orderBy: {
        code: "asc",
      },
    }),
    prisma.studentLevel.count({ where }),
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

// Get student level by ID
export async function getStudentLevelById(id: string) {
  return prisma.studentLevel.findUnique({
    where: { id },
    include: { level: true, students: true },
  });
}

// Create a student level
export async function createStudentLevel(data: any) {
  return prisma.studentLevel.create({ data });
}

// Update a student level
export async function updateStudentLevel(id: string, data: any) {
  return prisma.studentLevel.update({ where: { id }, data });
}

// Delete a student level
export async function deleteStudentLevel(id: string) {
  return prisma.studentLevel.delete({ where: { id } });
}
