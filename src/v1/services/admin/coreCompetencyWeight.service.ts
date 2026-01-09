import { prisma } from "../../models/prisma";

// List all weight configurations with optional filters and pagination
export async function listWeights({
  coreCompetencyId,
  levelId,
  learningAreaId,
  isActive,
  page = 1,
  pageSize = 10,
}: {
  coreCompetencyId?: string;
  levelId?: string;
  learningAreaId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: any = {};

  if (coreCompetencyId) {
    where.coreCompetencyId = coreCompetencyId;
  }
  if (levelId) {
    where.levelId = levelId;
  }
  if (learningAreaId) {
    where.learningAreaId = learningAreaId;
  }
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.coreCompetencyLearningAreaWeight.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        coreCompetency: true,
        learningArea: true,
        level: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.coreCompetencyLearningAreaWeight.count({ where }),
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

// Get weight by ID
export async function getWeightById(id: string) {
  return prisma.coreCompetencyLearningAreaWeight.findUnique({
    where: { id },
    include: {
      coreCompetency: true,
      learningArea: true,
      level: true,
    },
  });
}

// Create a new weight configuration
export async function createWeight(data: {
  coreCompetencyId: string;
  learningAreaId: string;
  weight: number;
  levelId?: string;
  isActive?: boolean;
}) {
  // Validate weight range
  if (data.weight < 0 || data.weight > 1) {
    throw new Error("Weight must be between 0 and 1");
  }

  return prisma.coreCompetencyLearningAreaWeight.create({
    data,
    include: {
      coreCompetency: true,
      learningArea: true,
      level: true,
    },
  });
}

// Update a weight configuration
export async function updateWeight(
  id: string,
  data: {
    weight?: number;
    levelId?: string;
    isActive?: boolean;
  }
) {
  // Validate weight range if provided
  if (data.weight !== undefined && (data.weight < 0 || data.weight > 1)) {
    throw new Error("Weight must be between 0 and 1");
  }

  // Check if weight exists
  const existing = await prisma.coreCompetencyLearningAreaWeight.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Weight configuration not found");
  }

  return prisma.coreCompetencyLearningAreaWeight.update({
    where: { id },
    data,
    include: {
      coreCompetency: true,
      learningArea: true,
      level: true,
    },
  });
}

// Delete a weight configuration
export async function deleteWeight(id: string) {
  // Check if weight exists
  const existing = await prisma.coreCompetencyLearningAreaWeight.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Weight configuration not found");
  }

  return prisma.coreCompetencyLearningAreaWeight.delete({
    where: { id },
  });
}

// Validate that weights sum to 100% (1.0)
export async function validateWeightSum(
  coreCompetencyId: string,
  levelId?: string
) {
  const where: any = {
    coreCompetencyId,
    isActive: true,
  };

  if (levelId !== undefined) {
    where.levelId = levelId;
  }

  const weights = await prisma.coreCompetencyLearningAreaWeight.findMany({
    where,
    include: {
      learningArea: true,
    },
  });

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const isValid = Math.abs(totalWeight - 1.0) < 0.0001; // tolerance for float precision

  return {
    isValid,
    totalWeight,
    message: isValid
      ? "Weight configuration is valid (sum = 100%)"
      : `Weight configuration is invalid (sum = ${(totalWeight * 100).toFixed(
          2
        )}%)`,
    weights: weights.map((w) => ({
      id: w.id,
      learningAreaId: w.learningAreaId,
      learningAreaName: w.learningArea.name,
      weight: w.weight,
      weightPercentage: `${(w.weight * 100).toFixed(1)}%`,
    })),
  };
}
