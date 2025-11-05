import { prisma } from "../../models/prisma";

export async function listMontessoriLearned({
  studentId,
  activityId,
  learned,
  page = 1,
  pageSize = 10,
}: {
  studentId?: string;
  activityId?: string;
  learned?: boolean;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (activityId) where.activityId = activityId;
  if (typeof learned === "boolean") where.learned = learned;
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.montessoriActivityLearned.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ updatedAt: "desc" }],
      include: { student: true, activity: true, markedByTeacher: true },
    }),
    prisma.montessoriActivityLearned.count({ where }),
  ]);
  return {
    items,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getMontessoriLearnedById(id: string) {
  return prisma.montessoriActivityLearned.findUnique({
    where: { id },
    include: { student: true, activity: true, markedByTeacher: true },
  });
}

export async function upsertMontessoriLearned(data: {
  studentId: string;
  activityId: string;
  learned: boolean;
  learnedAt?: Date | string | null;
  note?: string | null;
  markedByTeacherId?: string | null;
}) {
  const key = {
    studentId_activityId: {
      studentId: data.studentId,
      activityId: data.activityId,
    },
  } as const;
  return prisma.montessoriActivityLearned.upsert({
    where: key,
    create: {
      studentId: data.studentId,
      activityId: data.activityId,
      learned: data.learned,
      learnedAt: data.learnedAt ? new Date(data.learnedAt) : undefined,
      note: data.note,
      markedByTeacherId: data.markedByTeacherId,
    },
    update: {
      learned: data.learned,
      learnedAt: data.learnedAt ? new Date(data.learnedAt) : undefined,
      note: data.note,
      markedByTeacherId: data.markedByTeacherId,
    },
  });
}

export async function toggleMontessoriLearned({
  studentId,
  activityId,
  markedByTeacherId,
  note,
}: {
  studentId: string;
  activityId: string;
  markedByTeacherId?: string | null;
  note?: string | null;
}) {
  const existing = await prisma.montessoriActivityLearned.findUnique({
    where: { studentId_activityId: { studentId, activityId } },
  });
  if (!existing) {
    return prisma.montessoriActivityLearned.create({
      data: {
        studentId,
        activityId,
        learned: true,
        learnedAt: new Date(),
        note,
        markedByTeacherId,
      },
    });
  }
  return prisma.montessoriActivityLearned.update({
    where: { id: existing.id },
    data: {
      learned: !existing.learned,
      learnedAt: !existing.learned ? new Date() : existing.learnedAt,
      note,
      markedByTeacherId,
    },
  });
}

export async function deleteMontessoriLearned(id: string) {
  return prisma.montessoriActivityLearned.delete({ where: { id } });
}

export async function upsertMontessoriLearnedBatch(
  payloads: Array<{
    studentId: string;
    activityId: string;
    learned: boolean;
    learnedAt?: Date | string | null;
    note?: string | null;
    markedByTeacherId?: string | null;
  }>
) {
  if (!Array.isArray(payloads) || payloads.length === 0) return [];
  const ops = payloads.map((data) =>
    prisma.montessoriActivityLearned.upsert({
      where: {
        studentId_activityId: {
          studentId: data.studentId,
          activityId: data.activityId,
        },
      },
      create: {
        studentId: data.studentId,
        activityId: data.activityId,
        learned: data.learned,
        learnedAt: data.learnedAt ? new Date(data.learnedAt) : undefined,
        note: data.note,
        markedByTeacherId: data.markedByTeacherId ?? undefined,
      },
      update: {
        learned: data.learned,
        learnedAt: data.learnedAt ? new Date(data.learnedAt) : undefined,
        note: data.note,
        markedByTeacherId: data.markedByTeacherId ?? undefined,
      },
    })
  );
  return prisma.$transaction(ops);
}

export async function toggleMontessoriLearnedBatch(
  payloads: Array<{
    studentId: string;
    activityId: string;
    note?: string | null;
    markedByTeacherId?: string | null;
  }>
) {
  if (!Array.isArray(payloads) || payloads.length === 0) return [];
  // Prefetch existing records for all pairs
  const whereOr = payloads.map((p) => ({
    studentId: p.studentId,
    activityId: p.activityId,
  }));
  const existing = await prisma.montessoriActivityLearned.findMany({
    where: { OR: whereOr },
  });
  const key = (s: string, a: string) => `${s}__${a}`;
  const map = new Map(
    existing.map((e) => [key(e.studentId, e.activityId), e] as const)
  );

  const ops = payloads.map((p) => {
    const found = map.get(key(p.studentId, p.activityId));
    if (!found) {
      return prisma.montessoriActivityLearned.create({
        data: {
          studentId: p.studentId,
          activityId: p.activityId,
          learned: true,
          learnedAt: new Date(),
          note: p.note,
          markedByTeacherId: p.markedByTeacherId ?? undefined,
        },
      });
    }
    const toggled = !found.learned;
    return prisma.montessoriActivityLearned.update({
      where: { id: found.id },
      data: {
        learned: toggled,
        learnedAt: toggled ? new Date() : found.learnedAt,
        note: p.note,
        markedByTeacherId: p.markedByTeacherId ?? undefined,
      },
    });
  });

  return prisma.$transaction(ops);
}

export async function listLearnedByStudentAndCategory({
  studentId,
  categoryId,
}: {
  studentId: string;
  categoryId: string;
}) {
  return prisma.montessoriActivityLearned.findMany({
    where: {
      studentId,
      learned: true,
      activity: {
        topic: { subcategory: { categoryId } },
      },
    },
    include: {
      student: {
        select: {
          id: true,
          studentCode: true,
          prefix: true,
          firstName: true,
          lastName: true,
        },
      },
      markedByTeacher: {
        select: { id: true, firstName: true, lastName: true },
      },
      activity: {
        include: {
          topic: {
            include: {
              subcategory: {
                include: { category: true },
              },
            },
          },
        },
      },
    },
    orderBy: [{ learnedAt: "desc" }, { updatedAt: "desc" }],
  });
}
