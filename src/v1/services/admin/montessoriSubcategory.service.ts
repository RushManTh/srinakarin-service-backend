import { prisma } from "../../models/prisma";

export async function listMontessoriSubcategories({
  categoryId,
  search,
  page = 1,
  pageSize = 10,
}: {
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { enName: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.montessoriSubcategory.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ order: "asc" }, { code: "asc" }, { createdAt: "asc" }],
      include: { category: true },
    }),
    prisma.montessoriSubcategory.count({ where }),
  ]);
  return {
    items,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getMontessoriSubcategoryById(id: string) {
  return prisma.montessoriSubcategory.findUnique({
    where: { id },
    include: { category: true, topics: true },
  });
}

export async function createMontessoriSubcategory(data: {
  categoryId: string;
  code: string;
  order?: number | null;
  name: string;
  enName?: string | null;
  description?: string | null;
  isActive?: boolean;
}) {
  const category = await prisma.montessoriCategory.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) throw new Error("Category not found");
  return prisma.montessoriSubcategory.create({ data });
}

export async function updateMontessoriSubcategory(
  id: string,
  data: Partial<{
    categoryId: string;
    code: string;
    order?: number | null;
    name: string;
    enName?: string | null;
    description?: string | null;
    isActive?: boolean;
  }>
) {
  return prisma.montessoriSubcategory.update({ where: { id }, data });
}

export async function deleteMontessoriSubcategory(id: string) {
  try {
    return await prisma.montessoriSubcategory.delete({ where: { id } });
  } catch (e: any) {
    if (e?.code === "P2003") {
      const err: any = new Error(
        "Cannot delete subcategory with existing children"
      );
      err.status = 409;
      throw err;
    }
    throw e;
  }
}
