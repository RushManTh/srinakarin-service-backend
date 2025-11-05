import { prisma } from "../../models/prisma";

// List all competencies
export async function listCompetencies({
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
    prisma.competency.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        subjectType: true,
        level: true,
      },
      orderBy: {
        code: "asc",
      },
    }),
    prisma.competency.count({ where }),
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

// Get competency by ID
export async function getCompetencyById(id: string) {
  return prisma.competency.findUnique({
    where: { id },
    include: { subjectType: true, level: true },
  });
}

// Create a competency
export async function createCompetency(data: any) {
  return prisma.competency.create({ data });
}

// Update a competency
export async function updateCompetency(id: string, data: any) {
  return prisma.competency.update({ where: { id }, data });
}

// Delete a competency
export async function deleteCompetency(id: string) {
  return prisma.competency.delete({ where: { id } });
}
