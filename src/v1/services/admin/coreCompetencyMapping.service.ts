import { prisma } from "../../models/prisma";

// Link competencies to a core competency
export async function linkCompetenciesToCoreCompetency(
  coreCompetencyId: string,
  competencyIds: string[]
) {
  const coreCompetency = await prisma.coreCompetency.findUnique({
    where: { id: coreCompetencyId },
  });

  if (!coreCompetency) {
    throw new Error("Core competency not found");
  }

  // Update the core competency to link with competencies
  return prisma.coreCompetency.update({
    where: { id: coreCompetencyId },
    data: {
      competencies: {
        set: competencyIds.map((id) => ({ id })),
      },
    },
    include: {
      competencies: {
        include: {
          subjectType: true,
          level: true,
        },
      },
    },
  });
}

// Add competencies to a core competency (append, not replace)
export async function addCompetenciesToCoreCompetency(
  coreCompetencyId: string,
  competencyIds: string[]
) {
  const coreCompetency = await prisma.coreCompetency.findUnique({
    where: { id: coreCompetencyId },
  });

  if (!coreCompetency) {
    throw new Error("Core competency not found");
  }

  return prisma.coreCompetency.update({
    where: { id: coreCompetencyId },
    data: {
      competencies: {
        connect: competencyIds.map((id) => ({ id })),
      },
    },
    include: {
      competencies: {
        include: {
          subjectType: true,
          level: true,
        },
      },
    },
  });
}

// Remove competencies from a core competency
export async function removeCompetenciesFromCoreCompetency(
  coreCompetencyId: string,
  competencyIds: string[]
) {
  const coreCompetency = await prisma.coreCompetency.findUnique({
    where: { id: coreCompetencyId },
  });

  if (!coreCompetency) {
    throw new Error("Core competency not found");
  }

  return prisma.coreCompetency.update({
    where: { id: coreCompetencyId },
    data: {
      competencies: {
        disconnect: competencyIds.map((id) => ({ id })),
      },
    },
    include: {
      competencies: {
        include: {
          subjectType: true,
          level: true,
        },
      },
    },
  });
}

// Get all competencies linked to a core competency
export async function getCompetenciesByCoreCompetency(
  coreCompetencyId: string
) {
  const coreCompetency = await prisma.coreCompetency.findUnique({
    where: { id: coreCompetencyId },
    include: {
      competencies: {
        include: {
          subjectType: true,
          level: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!coreCompetency) {
    throw new Error("Core competency not found");
  }

  return {
    coreCompetencyId: coreCompetency.id,
    coreCompetencyName: coreCompetency.name,
    competencies: coreCompetency.competencies,
  };
}

// Get all core competencies linked to a competency
export async function getCoreCompetenciesByCompetency(competencyId: string) {
  const competency = await prisma.competency.findUnique({
    where: { id: competencyId },
    include: {
      coreCompetencies: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!competency) {
    throw new Error("Competency not found");
  }

  return {
    competencyId: competency.id,
    competencyName: competency.name,
    coreCompetencies: competency.coreCompetencies,
  };
}
