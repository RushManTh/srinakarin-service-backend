import { prisma } from "../../models/prisma";

export async function listMontessoriActivities({
  topicId,
  search,
  page = 1,
  pageSize = 10,
}: {
  topicId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (topicId) where.topicId = topicId;
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { enName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { materialNotes: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.montessoriActivity.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ order: "asc" }, { code: "asc" }, { createdAt: "asc" }],
      include: { topic: true },
    }),
    prisma.montessoriActivity.count({ where }),
  ]);
  return {
    items,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getMontessoriActivityById(id: string) {
  return prisma.montessoriActivity.findUnique({
    where: { id },
    include: { topic: true },
  });
}

export async function createMontessoriActivity(data: {
  topicId: string;
  code: string;
  order?: number | null;
  name: string;
  enName?: string | null;
  description?: string | null;
  materialNotes?: string | null;
  isActive?: boolean;
}) {
  const topic = await prisma.montessoriTopic.findUnique({
    where: { id: data.topicId },
  });
  if (!topic) throw new Error("Topic not found");
  return prisma.montessoriActivity.create({ data });
}

export async function updateMontessoriActivity(
  id: string,
  data: Partial<{
    topicId: string;
    code: string;
    order?: number | null;
    name: string;
    enName?: string | null;
    description?: string | null;
    materialNotes?: string | null;
    isActive?: boolean;
  }>
) {
  return prisma.montessoriActivity.update({ where: { id }, data });
}

export async function deleteMontessoriActivity(id: string) {
  try {
    return await prisma.montessoriActivity.delete({ where: { id } });
  } catch (e: any) {
    if (e?.code === "P2003") {
      const err: any = new Error(
        "Cannot delete activity with existing learned records"
      );
      err.status = 409;
      throw err;
    }
    throw e;
  }
}
