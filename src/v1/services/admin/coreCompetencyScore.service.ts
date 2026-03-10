import { prisma } from "../../models/prisma";

// Interfaces for type safety
interface CalculateParams {
  studentId: string;
  coreCompetencyId: string;
  academicYearId: string;
  termId: string;
  levelId?: string;
}

interface AssignmentDetail {
  assignmentId: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface SubjectScore {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  assignmentCount: number;
}

interface LearningAreaBreakdown {
  learningAreaId: string;
  learningAreaName: string;
  weight: number;
  weightPercentage: string;
  averageScore: number;
  weightedScore: number;
  subjects: SubjectScore[];
}

interface CalculationMetadata {
  totalSubjects: number;
  totalAssignments: number;
  calculatedAt: Date;
  academicYear: string;
  term: string;
}

interface LevelInfo {
  level: number;
  name: string;
  description?: string | null;
  minScore?: number;
  maxScore?: number;
}

interface ScoreResult {
  studentId: string;
  studentName: string;
  coreCompetencyId: string;
  coreCompetencyName: string;
  finalScore: number;
  finalLevel: number;
  finalLevelName: string;
  finalLevelInfo?: LevelInfo;
  breakdown: LearningAreaBreakdown[];
  metadata: CalculationMetadata;
}

// Calculate core competency score for a single student
export async function calculateStudentCoreCompetencyScore(
  params: CalculateParams,
): Promise<ScoreResult> {
  const { studentId, coreCompetencyId, academicYearId, termId, levelId } =
    params;

  // Step 1: Get student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Step 2: Get weight configuration
  const where: any = {
    coreCompetencyId,
    isActive: true,
  };

  if (levelId) {
    where.levelId = levelId;
  }

  const weights = await prisma.coreCompetencyLearningAreaWeight.findMany({
    where,
    include: {
      learningArea: true,
      coreCompetency: true,
    },
  });

  if (weights.length === 0) {
    throw new Error("No weight configuration found for this core competency");
  }

  // Step 3: Validate weights sum to 100%
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.0001) {
    throw new Error(
      `Invalid weight configuration: sum is ${(totalWeight * 100).toFixed(
        2,
      )}% instead of 100%`,
    );
  }

  const breakdown: LearningAreaBreakdown[] = [];
  let totalWeightedScore = 0;
  let totalAssignments = 0;
  let totalSubjects = 0;

  // Step 4: Loop through each Learning Area
  for (const weightConfig of weights) {
    // Get all subjects in this learning area
    const subjects = await prisma.schoolSubject.findMany({
      where: {
        learningAreaId: weightConfig.learningAreaId,
      },
    });

    const subjectScores: SubjectScore[] = [];
    let laScoreSum = 0;
    let laSubjectCount = 0;

    // Loop through each subject
    for (const subject of subjects) {
      // Get all assignments for this subject that are linked to the core competency
      const assignments = await prisma.assignment.findMany({
        where: {
          teacherAssignment: {
            schoolSubjectId: subject.id,
            academicYearId,
            termId,
          },
          competencies: {
            some: {
              competency: {
                coreCompetencies: {
                  some: {
                    id: coreCompetencyId,
                  },
                },
              },
            },
          },
        },
        include: {
          attempts: {
            include: {
              scores: {
                where: {
                  studentId,
                },
              },
            },
            orderBy: {
              attemptNo: "desc",
            },
          },
        },
      });

      // Calculate average score for this subject
      let subjectScoreSum = 0;
      let subjectAssignmentCount = 0;

      for (const assignment of assignments) {
        // Use the latest attempt
        const latestAttempt = assignment.attempts[0];
        const studentScore = latestAttempt?.scores[0];

        if (studentScore && studentScore.score !== null) {
          const percentage = (studentScore.score / assignment.maxScore) * 100;
          subjectScoreSum += percentage;
          subjectAssignmentCount++;
        }
      }

      // If this subject has scores, add to learning area calculation
      if (subjectAssignmentCount > 0) {
        const subjectAverage = subjectScoreSum / subjectAssignmentCount;
        laScoreSum += subjectAverage;
        laSubjectCount++;
        totalSubjects++;
        totalAssignments += subjectAssignmentCount;

        subjectScores.push({
          subjectId: subject.id,
          subjectName: subject.name,
          averageScore: parseFloat(subjectAverage.toFixed(2)),
          assignmentCount: subjectAssignmentCount,
        });
      }
    }

    // Calculate learning area average and weighted score
    const laAverage = laSubjectCount > 0 ? laScoreSum / laSubjectCount : 0;
    const weightedScore = laAverage * weightConfig.weight;
    totalWeightedScore += weightedScore;

    breakdown.push({
      learningAreaId: weightConfig.learningAreaId,
      learningAreaName: weightConfig.learningArea.name,
      weight: weightConfig.weight,
      weightPercentage: `${(weightConfig.weight * 100).toFixed(1)}%`,
      averageScore: parseFloat(laAverage.toFixed(2)),
      weightedScore: parseFloat(weightedScore.toFixed(2)),
      subjects: subjectScores,
    });
  }

  // Step 5: Map score to level (dynamic based on database configuration)
  const levelInfo = await mapScoreToLevel(
    totalWeightedScore,
    coreCompetencyId,
    levelId,
  );

  // Step 6: Get academic year and term names
  const academicYear = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    select: { year: true },
  });

  const term = await prisma.term.findUnique({
    where: { id: termId },
    select: { name: true },
  });

  return {
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    coreCompetencyId,
    coreCompetencyName: weights[0].coreCompetency.name,
    finalScore: parseFloat(totalWeightedScore.toFixed(2)),
    finalLevel: levelInfo.level,
    finalLevelName: levelInfo.name,
    finalLevelInfo: levelInfo,
    breakdown,
    metadata: {
      totalSubjects,
      totalAssignments,
      calculatedAt: new Date(),
      academicYear: academicYear?.year || "N/A",
      term: term?.name || "N/A",
    },
  };
}

// Calculate core competency scores for entire classroom
export async function calculateClassroomCoreCompetencyScores(params: {
  classroomId: string;
  coreCompetencyId: string;
  academicYearId: string;
  termId: string;
}) {
  const { classroomId, coreCompetencyId, academicYearId, termId } = params;

  // Get classroom info
  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    include: {
      students: {
        where: { isActive: true },
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  if (!classroom) {
    throw new Error("Classroom not found");
  }

  if (classroom.students.length === 0) {
    throw new Error("No active students in this classroom");
  }

  // Calculate scores for all students
  const studentScores: ScoreResult[] = [];
  const scores: number[] = [];

  for (const student of classroom.students) {
    try {
      const result = await calculateStudentCoreCompetencyScore({
        studentId: student.id,
        coreCompetencyId,
        academicYearId,
        termId,
      });
      studentScores.push(result);
      scores.push(result.finalScore);
    } catch (error) {
      console.error(
        `Error calculating score for student ${student.id}:`,
        error,
      );
      // Continue with other students
    }
  }

  // Calculate statistics
  const averageScore =
    scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

  return {
    classroomId: classroom.id,
    classroomName: classroom.name,
    coreCompetencyId,
    coreCompetencyName: studentScores[0]?.coreCompetencyName || "N/A",
    studentScores,
    statistics: {
      averageScore: parseFloat(averageScore.toFixed(2)),
      highestScore: parseFloat(highestScore.toFixed(2)),
      lowestScore: parseFloat(lowestScore.toFixed(2)),
      studentCount: scores.length,
    },
  };
}

// Get score history for a student
export async function getCoreCompetencyScoreHistory(
  studentId: string,
  coreCompetencyId: string,
  limit: number = 10,
) {
  // This would typically query a StudentCoreCompetencyScore cache table
  // For now, we'll return a placeholder structure
  // In production, you'd implement Phase 4 first (cache table)

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { firstName: true, lastName: true },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const coreCompetency = await prisma.coreCompetency.findUnique({
    where: { id: coreCompetencyId },
    select: { name: true },
  });

  if (!coreCompetency) {
    throw new Error("Core competency not found");
  }

  // Get recent academic years and terms to calculate history
  const academicYears = await prisma.academicYear.findMany({
    take: limit,
    orderBy: { year: "desc" },
    include: {
      terms: {
        orderBy: { name: "asc" },
      },
    },
  });

  const scores = [];

  for (const year of academicYears) {
    for (const term of year.terms) {
      try {
        const result = await calculateStudentCoreCompetencyScore({
          studentId,
          coreCompetencyId,
          academicYearId: year.id,
          termId: term.id,
        });

        scores.push({
          academicYearId: year.id,
          academicYearName: year.year,
          termId: term.id,
          termName: term.name,
          score: result.finalScore,
          level: result.finalLevel,
          levelName: result.finalLevelName,
          levelInfo: result.finalLevelInfo,
          calculatedAt: new Date(),
        });
      } catch (error) {
        // Skip if no data for this term
        continue;
      }
    }
  }

  return {
    studentId,
    studentName: `${student.firstName} ${student.lastName}`,
    coreCompetencyId,
    coreCompetencyName: coreCompetency.name,
    scores,
  };
}

// Calculate all core competency scores for a student
export async function calculateAllCoreCompetencyScores(params: {
  studentId: string;
  academicYearId: string;
  termId: string;
  levelId: string;
}) {
  const { studentId, academicYearId, termId, levelId } = params;

  // Get student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      studentLevel: {
        include: {
          level: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Get academic year and term info
  const academicYear = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    select: { year: true },
  });

  const term = await prisma.term.findUnique({
    where: { id: termId },
    select: { name: true },
  });

  // Get all core competencies
  const coreCompetencies = await prisma.coreCompetency.findMany({
    orderBy: { name: "asc" },
  });

  if (coreCompetencies.length === 0) {
    throw new Error("No core competencies found");
  }

  const results = [];
  const errors = [];

  // Calculate score for each core competency
  for (const coreCompetency of coreCompetencies) {
    try {
      const scoreResult = await calculateStudentCoreCompetencyScore({
        studentId,
        coreCompetencyId: coreCompetency.id,
        academicYearId,
        termId,
        levelId,
      });

      results.push({
        coreCompetencyId: coreCompetency.id,
        coreCompetencyCode: coreCompetency.code,
        coreCompetencyName: coreCompetency.name,
        coreCompetencyDescription: coreCompetency.description,
        finalScore: scoreResult.finalScore,
        finalLevel: scoreResult.finalLevel,
        finalLevelName: scoreResult.finalLevelName,
        finalLevelInfo: scoreResult.finalLevelInfo,
        breakdown: scoreResult.breakdown,
      });
    } catch (error: any) {
      // Record error but continue with other competencies
      errors.push({
        coreCompetencyId: coreCompetency.id,
        coreCompetencyName: coreCompetency.name,
        error: error.message,
      });
    }
  }

  return {
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    studentLevel: student.studentLevel?.level?.name,
    academicYear: academicYear?.year || "N/A",
    term: term?.name || "N/A",
    levelId,
    calculatedAt: new Date(),
    totalCoreCompetencies: coreCompetencies.length,
    successfulCalculations: results.length,
    failedCalculations: errors.length,
    coreCompetencyScores: results,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Calculate all core competency scores for all students in a classroom
export async function calculateClassroomAllCoreCompetencyScores(params: {
  classroomId: string;
  academicYearId: string;
  termId: string;
  levelId: string;
}) {
  const { classroomId, academicYearId, termId, levelId } = params;

  // Get classroom info with students
  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    include: {
      students: {
        where: { isActive: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentLevel: {
            include: {
              level: true,
            },
          },
        },
      },
    },
  });

  if (!classroom) {
    throw new Error("Classroom not found");
  }

  if (classroom.students.length === 0) {
    throw new Error("No active students in this classroom");
  }

  // Get academic year and term info
  const academicYear = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    select: { year: true },
  });

  const term = await prisma.term.findUnique({
    where: { id: termId },
    select: { name: true },
  });

  // Get all core competencies
  const coreCompetencies = await prisma.coreCompetency.findMany({
    orderBy: { name: "asc" },
  });

  if (coreCompetencies.length === 0) {
    throw new Error("No core competencies found");
  }

  const studentResults: any[] = [];
  let totalSuccessfulCalculations = 0;
  let totalFailedCalculations = 0;

  // Calculate all core competency scores for each student
  for (const student of classroom.students) {
    try {
      const studentScores = await calculateAllCoreCompetencyScores({
        studentId: student.id,
        academicYearId,
        termId,
        levelId,
      });

      studentResults.push(studentScores);
      totalSuccessfulCalculations += studentScores.successfulCalculations;
      totalFailedCalculations += studentScores.failedCalculations;
    } catch (error: any) {
      console.error(
        `Error calculating scores for student ${student.id}:`,
        error,
      );
      // Continue with other students
      studentResults.push({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        error: error.message,
        coreCompetencyScores: [],
      });
    }
  }

  // Calculate classroom statistics per core competency
  const competencyStatistics = coreCompetencies.map((competency) => {
    const scores: number[] = [];
    const levels: number[] = [];

    studentResults.forEach((studentResult: any) => {
      if (studentResult.coreCompetencyScores) {
        const competencyScore = studentResult.coreCompetencyScores.find(
          (cs: any) => cs.coreCompetencyId === competency.id,
        );

        if (competencyScore) {
          scores.push(competencyScore.finalScore);
          levels.push(competencyScore.finalLevel);
        }
      }
    });

    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 0;
    const averageLevel =
      levels.length > 0
        ? Math.round(levels.reduce((sum, l) => sum + l, 0) / levels.length)
        : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    return {
      coreCompetencyId: competency.id,
      coreCompetencyCode: competency.code,
      coreCompetencyName: competency.name,
      averageScore: parseFloat(averageScore.toFixed(2)),
      averageLevel,
      highestScore: parseFloat(highestScore.toFixed(2)),
      lowestScore: parseFloat(lowestScore.toFixed(2)),
      studentCount: scores.length,
    };
  });

  return {
    classroomId: classroom.id,
    classroomName: classroom.name,
    academicYear: academicYear?.year || "N/A",
    term: term?.name || "N/A",
    levelId,
    calculatedAt: new Date(),
    totalStudents: classroom.students.length,
    totalCoreCompetencies: coreCompetencies.length,
    totalSuccessfulCalculations,
    totalFailedCalculations,
    studentScores: studentResults,
    competencyStatistics,
  };
}

// Helper: Map score to CoreCompetencyLevel
// This function dynamically maps scores based on minScore/maxScore defined in the database
// Supports unlimited number of levels (not just 4)
// Supports different level mappings per studentLevel (e.g., P1-3 uses levels 1-4, P4-6 uses levels 3-6)
async function mapScoreToLevel(
  score: number,
  coreCompetencyId: string,
  levelId?: string, // studentLevel.levelId (e.g., "level-p1-3" or "level-p4-6")
) {
  const where: any = {
    coreCompetencyId,
  };

  // Filter by levelId if provided - this enables different level ranges per grade
  // Example: P1-3 might use levels 1-4, while P4-6 uses levels 3-6
  if (levelId) {
    where.levelId = levelId;
  }

  // Get all levels for this core competency, ordered by level descending
  // This way we check from highest level down to lowest
  const levels = await prisma.coreCompetencyLevel.findMany({
    where,
    select: {
      id: true,
      level: true,
      name: true,
      description: true,
      minScore: true,
      maxScore: true,
    },
    orderBy: {
      level: "desc",
    },
  });

  if (levels.length === 0) {
    // Default if no levels defined - return level 0 as "undefined"
    return { level: 0, name: "ไม่ได้กำหนดระดับ" };
  }

  // Find the appropriate level based on minScore and maxScore
  // We iterate from highest to lowest level
  for (const levelData of levels) {
    // Check if score falls within this level's range
    // minScore is inclusive, maxScore is inclusive
    if (score >= levelData.minScore && score <= levelData.maxScore) {
      return {
        level: levelData.level,
        name: levelData.name,
        description: levelData.description,
        minScore: levelData.minScore,
        maxScore: levelData.maxScore,
      };
    }
  }

  // If score doesn't fall in any defined range, return the lowest level
  const lowestLevel = levels[levels.length - 1];
  return {
    level: lowestLevel.level,
    name: lowestLevel.name,
    description: lowestLevel.description,
    minScore: lowestLevel.minScore,
    maxScore: lowestLevel.maxScore,
  };
}
