import { prisma } from "../../models/prisma";

export async function getMontessoriTreeBySchoolSubject({
  schoolSubjectId,
  levelId,
  includeInactive = false,
}: {
  schoolSubjectId: string;
  levelId?: string;
  includeInactive?: boolean;
}) {
  const categoryWhere: any = {
    schoolSubjects: { some: { id: schoolSubjectId } },
  };
  if (levelId) categoryWhere.levelId = levelId;
  if (!includeInactive) categoryWhere.isActive = true;

  return prisma.montessoriCategory.findMany({
    where: categoryWhere,
    orderBy: [{ order: "asc" }, { code: "asc" }],
    include: {
      subcategories: {
        where: includeInactive ? {} : { isActive: true },
        orderBy: [{ order: "asc" }, { code: "asc" }],
        include: {
          topics: {
            orderBy: [{ order: "asc" }, { code: "asc" }],
            include: {
              activities: {
                where: includeInactive ? {} : { isActive: true },
                orderBy: [{ order: "asc" }, { code: "asc" }],
              },
            },
          },
        },
      },
      schoolSubjects: true,
      level: true,
    },
  });
}
