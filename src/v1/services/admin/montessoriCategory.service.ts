import { prisma } from "../../models/prisma";

export async function listMontessoriCategories({
  schoolSubjectId,
  levelId,
  search,
  page = 1,
  pageSize = 10,
}: {
  schoolSubjectId?: string;
  levelId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (schoolSubjectId) where.schoolSubjects = { some: { id: schoolSubjectId } };
  if (levelId) where.levelId = levelId;
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { enName: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.montessoriCategory.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ order: "asc" }, { code: "asc" }, { createdAt: "asc" }],
      include: { schoolSubjects: true, level: true },
    }),
    prisma.montessoriCategory.count({ where }),
  ]);
  return {
    items,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getMontessoriCategoryById(id: string) {
  return prisma.montessoriCategory.findUnique({
    where: { id },
    include: { schoolSubjects: true, level: true, subcategories: true },
  });
}

export async function createMontessoriCategory(data: {
  schoolSubjectIds: string[];
  levelId?: string | null;
  order?: number | null;
  code: string;
  name: string;
  enName?: string | null;
  description?: string | null;
  isActive?: boolean;
}) {
  // Validate subjects exist
  const ids = Array.isArray(data.schoolSubjectIds) ? data.schoolSubjectIds : [];
  if (!ids.length) throw new Error("schoolSubjectIds is required");
  const subjectCount = await prisma.schoolSubject.count({
    where: { id: { in: ids } },
  });
  if (subjectCount !== ids.length) {
    throw new Error("Some SchoolSubjects not found");
  }

  const { schoolSubjectIds, ...rest } = data as any;
  return prisma.montessoriCategory.create({
    data: {
      ...rest,
      schoolSubjects: { connect: ids.map((id) => ({ id })) },
    },
  });
}

export async function updateMontessoriCategory(
  id: string,
  data: Partial<{
    schoolSubjectIds: string[];
    levelId?: string | null;
    order?: number | null;
    code: string;
    name: string;
    enName?: string | null;
    description?: string | null;
    isActive?: boolean;
  }>
) {
  const { schoolSubjectIds, ...rest } = data as any;
  const rel: any = {};
  if (Array.isArray(schoolSubjectIds)) {
    // Validate subjects
    const subjectCount = await prisma.schoolSubject.count({
      where: { id: { in: schoolSubjectIds } },
    });
    if (subjectCount !== schoolSubjectIds.length) {
      throw new Error("Some SchoolSubjects not found");
    }
    rel.schoolSubjects = {
      set: schoolSubjectIds.map((id: string) => ({ id })),
    };
  }
  return prisma.montessoriCategory.update({
    where: { id },
    data: { ...rest, ...rel },
  });
}

export async function deleteMontessoriCategory(id: string) {
  try {
    return await prisma.montessoriCategory.delete({ where: { id } });
  } catch (e: any) {
    if (e?.code === "P2003") {
      const err: any = new Error(
        "Cannot delete category with existing children"
      );
      err.status = 409;
      throw err;
    }
    throw e;
  }
}
