import { prisma } from "../../models/prisma";

// List all program educations
export async function listProgramEducations({
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
    prisma.programEducation.findMany({
      where,
      skip,
      take: pageSize,
    }),
    prisma.programEducation.count({ where }),
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

// Get program education by ID
export async function getProgramEducationById(id: string) {
  return prisma.programEducation.findUnique({
    where: { id },
    include: { students: true },
  });
}
