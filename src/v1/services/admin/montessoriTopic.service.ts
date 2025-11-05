import { prisma } from "../../models/prisma";

export async function listMontessoriTopics({
  subcategoryId,
  search,
  page = 1,
  pageSize = 10,
}: {
  subcategoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (subcategoryId) where.subcategoryId = subcategoryId;
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { enName: { contains: search, mode: "insensitive" } },
      { objective: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.montessoriTopic.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ order: "asc" }, { code: "asc" }, { createdAt: "asc" }],
      include: { subcategory: true },
    }),
    prisma.montessoriTopic.count({ where }),
  ]);
  return {
    items,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getMontessoriTopicById(id: string) {
  return prisma.montessoriTopic.findUnique({
    where: { id },
    include: { subcategory: true, activities: true },
  });
}

export async function createMontessoriTopic(data: {
  subcategoryId: string;
  code: string;
  order?: number | null;
  name: string;
  enName?: string | null;
  objective?: string | null;
}) {
  const subcat = await prisma.montessoriSubcategory.findUnique({
    where: { id: data.subcategoryId },
  });
  if (!subcat) throw new Error("Subcategory not found");
  return prisma.montessoriTopic.create({ data });
}

export async function updateMontessoriTopic(
  id: string,
  data: Partial<{
    subcategoryId: string;
    code: string;
    order?: number | null;
    name: string;
    enName?: string | null;
    objective?: string | null;
  }>
) {
  return prisma.montessoriTopic.update({ where: { id }, data });
}

export async function deleteMontessoriTopic(id: string) {
  try {
    return await prisma.montessoriTopic.delete({ where: { id } });
  } catch (e: any) {
    if (e?.code === "P2003") {
      const err: any = new Error("Cannot delete topic with existing children");
      err.status = 409;
      throw err;
    }
    throw e;
  }
}
