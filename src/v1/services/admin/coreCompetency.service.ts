import { prisma } from "../../models/prisma";

// List all core competencies with optional search and pagination
export async function listCoreCompetencies({
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
    prisma.coreCompetency.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        coreLevels: true,
        competencies: true,
      },
      orderBy: {
        code: "asc",
      },
    }),
    prisma.coreCompetency.count({ where }),
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

// Get core competency by ID
export async function getCoreCompetencyById(id: string) {
  return prisma.coreCompetency.findUnique({
    where: { id },
    include: { coreLevels: true, competencies: true },
  });
}

// Create a core competency
export async function createCoreCompetency(data: {
  code?: string;
  name: string;
  description?: string;
  competencyIds?: string[];
}) {
  const { competencyIds, ...coreCompetencyData } = data;

  return prisma.coreCompetency.create({
    data: {
      ...coreCompetencyData,
      ...(competencyIds && {
        competencies: {
          connect: competencyIds.map((id) => ({ id })),
        },
      }),
    },
    include: { coreLevels: true, competencies: true },
  });
}

// Update a core competency
export async function updateCoreCompetency(
  id: string,
  data: {
    code?: string;
    name?: string;
    description?: string;
    competencyIds?: string[];
  }
) {
  const { competencyIds, ...coreCompetencyData } = data;

  return prisma.coreCompetency.update({
    where: { id },
    data: {
      ...coreCompetencyData,
      ...(competencyIds !== undefined && {
        competencies: {
          set: competencyIds.map((id) => ({ id })),
        },
      }),
    },
    include: { coreLevels: true, competencies: true },
  });
}

// Delete a core competency
export async function deleteCoreCompetency(id: string) {
  return prisma.coreCompetency.delete({ where: { id } });
}
