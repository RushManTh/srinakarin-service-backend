import { prisma } from "../../models/prisma";

// Get core competency levels matrix for UI display
// Returns all levels (1-6) with grade range applicability
export async function getCoreCompetencyLevelsMatrix(coreCompetencyId: string) {
  const coreCompetency = await prisma.coreCompetency.findUnique({
    where: { id: coreCompetencyId },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
    },
  });

  if (!coreCompetency) {
    throw new Error("Core competency not found");
  }

  // Get all levels for this core competency
  const levels = await prisma.coreCompetencyLevel.findMany({
    where: { coreCompetencyId },
    include: {
      levelRef: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
    orderBy: [{ level: "asc" }, { order: "asc" }],
  });

  // Get all unique level references (grade ranges)
  const levelRefs = await prisma.level.findMany({
    where: {
      coreCompetencyLevels: {
        some: {
          coreCompetencyId,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // Group levels by level number
  const levelMap = new Map<number, any>();

  for (const levelData of levels) {
    const levelNum = levelData.level;

    if (!levelMap.has(levelNum)) {
      levelMap.set(levelNum, {
        level: levelNum,
        name: levelData.name,
        description: levelData.description,
        order: levelData.order,
        grades: {},
      });
    }

    const gradeKey = levelData.levelRef.code || levelData.levelRef.name;
    levelMap.get(levelNum).grades[gradeKey] = {
      applicable: true,
      minScore: levelData.minScore,
      maxScore: levelData.maxScore,
      levelId: levelData.levelId,
      levelName: levelData.levelRef.name,
    };
  }

  // Fill in non-applicable grades
  for (const [levelNum, levelInfo] of levelMap.entries()) {
    for (const levelRef of levelRefs) {
      const gradeKey = levelRef.code || levelRef.name;
      if (!levelInfo.grades[gradeKey]) {
        levelInfo.grades[gradeKey] = {
          applicable: false,
        };
      }
    }
  }

  return {
    coreCompetencyId: coreCompetency.id,
    coreCompetencyCode: coreCompetency.code,
    coreCompetencyName: coreCompetency.name,
    description: coreCompetency.description,
    gradeRanges: levelRefs.map((ref) => ({
      id: ref.id,
      code: ref.code,
      name: ref.name,
    })),
    levels: Array.from(levelMap.values()).sort((a, b) => a.level - b.level),
  };
}

// List all levels for a specific core competency and grade range
export async function listCoreCompetencyLevelsByGrade(
  coreCompetencyId: string,
  levelId?: string
) {
  const where: any = { coreCompetencyId };

  if (levelId) {
    where.levelId = levelId;
  }

  const levels = await prisma.coreCompetencyLevel.findMany({
    where,
    include: {
      coreCompetency: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      levelRef: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
    orderBy: [{ level: "asc" }, { order: "asc" }],
  });

  return {
    coreCompetencyId,
    levelId,
    levels: levels.map((l) => ({
      id: l.id,
      level: l.level,
      name: l.name,
      description: l.description,
      minScore: l.minScore,
      maxScore: l.maxScore,
      order: l.order,
      gradeRange: l.levelRef.name,
      gradeRangeCode: l.levelRef.code,
    })),
  };
}

// Get single level detail
export async function getCoreCompetencyLevelById(id: string) {
  const level = await prisma.coreCompetencyLevel.findUnique({
    where: { id },
    include: {
      coreCompetency: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      levelRef: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });

  if (!level) {
    throw new Error("Core competency level not found");
  }

  return level;
}

// Create new level
export async function createCoreCompetencyLevel(data: {
  coreCompetencyId: string;
  level: number;
  name: string;
  description?: string;
  minScore: number;
  maxScore: number;
  order?: number;
  levelId: string;
}) {
  // Validate score range
  if (
    data.minScore < 0 ||
    data.maxScore > 100 ||
    data.minScore > data.maxScore
  ) {
    throw new Error(
      "Invalid score range. minScore must be 0-100 and less than maxScore"
    );
  }

  return prisma.coreCompetencyLevel.create({
    data,
    include: {
      coreCompetency: true,
      levelRef: true,
    },
  });
}

// Update level
export async function updateCoreCompetencyLevel(
  id: string,
  data: {
    name?: string;
    description?: string;
    minScore?: number;
    maxScore?: number;
    order?: number;
  }
) {
  // Validate score range if provided
  if (data.minScore !== undefined || data.maxScore !== undefined) {
    const existing = await prisma.coreCompetencyLevel.findUnique({
      where: { id },
      select: { minScore: true, maxScore: true },
    });

    if (!existing) {
      throw new Error("Core competency level not found");
    }

    const minScore = data.minScore ?? existing.minScore;
    const maxScore = data.maxScore ?? existing.maxScore;

    if (minScore < 0 || maxScore > 100 || minScore > maxScore) {
      throw new Error(
        "Invalid score range. minScore must be 0-100 and less than maxScore"
      );
    }
  }

  return prisma.coreCompetencyLevel.update({
    where: { id },
    data,
    include: {
      coreCompetency: true,
      levelRef: true,
    },
  });
}

// Delete level
export async function deleteCoreCompetencyLevel(id: string) {
  const existing = await prisma.coreCompetencyLevel.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Core competency level not found");
  }

  return prisma.coreCompetencyLevel.delete({
    where: { id },
  });
}
