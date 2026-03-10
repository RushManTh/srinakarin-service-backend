import type { Context } from "elysia";
import {
  calculateStudentCoreCompetencyScore as calculateStudentSvc,
  calculateClassroomCoreCompetencyScores as calculateClassroomSvc,
  getCoreCompetencyScoreHistory as getHistorySvc,
  calculateAllCoreCompetencyScores as calculateAllSvc,
  calculateClassroomAllCoreCompetencyScores as calculateClassroomAllSvc,
} from "../../services/admin/coreCompetencyScore.service";

export const calculateStudentScore = async (ctx: Context) => {
  try {
    const { studentId, coreCompetencyId, academicYearId, termId, levelId } =
      ctx.body as any;

    if (!studentId || !coreCompetencyId || !academicYearId || !termId) {
      ctx.set.status = 400;
      return {
        error:
          "Missing required fields: studentId, coreCompetencyId, academicYearId, termId",
      };
    }

    const result = await calculateStudentSvc({
      studentId,
      coreCompetencyId,
      academicYearId,
      termId,
      levelId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentScore = async (ctx: Context) => {
  try {
    const studentId = (ctx.params as any).studentId;
    const { coreCompetencyId, academicYearId, termId, levelId } =
      ctx.query as any;

    if (!coreCompetencyId || !academicYearId || !termId) {
      ctx.set.status = 400;
      return {
        error:
          "Missing required query params: coreCompetencyId, academicYearId, termId",
      };
    }

    const result = await calculateStudentSvc({
      studentId,
      coreCompetencyId,
      academicYearId,
      termId,
      levelId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const calculateClassroomScore = async (ctx: Context) => {
  try {
    const { classroomId, coreCompetencyId, academicYearId, termId } =
      ctx.body as any;

    if (!classroomId || !coreCompetencyId || !academicYearId || !termId) {
      ctx.set.status = 400;
      return {
        error:
          "Missing required fields: classroomId, coreCompetencyId, academicYearId, termId",
      };
    }

    const result = await calculateClassroomSvc({
      classroomId,
      coreCompetencyId,
      academicYearId,
      termId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getScoreHistory = async (ctx: Context) => {
  try {
    const studentId = (ctx.params as any).studentId;
    const coreCompetencyId = (ctx.params as any).coreCompetencyId;
    const { limit } = ctx.query as any;

    const result = await getHistorySvc(
      studentId,
      coreCompetencyId,
      limit ? Number(limit) : 10,
    );

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const calculateAllStudentScores = async (ctx: Context) => {
  try {
    const { studentId, academicYearId, termId, levelId } = ctx.body as any;

    if (!studentId || !academicYearId || !termId || !levelId) {
      ctx.set.status = 400;
      return {
        error:
          "Missing required fields: studentId, academicYearId, termId, levelId",
      };
    }

    const result = await calculateAllSvc({
      studentId,
      academicYearId,
      termId,
      levelId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAllStudentScores = async (ctx: Context) => {
  try {
    const studentId = (ctx.params as any).studentId;
    const { academicYearId, termId, levelId } = ctx.query as any;

    if (!academicYearId || !termId || !levelId) {
      ctx.set.status = 400;
      return {
        error: "Missing required query params: academicYearId, termId, levelId",
      };
    }

    const result = await calculateAllSvc({
      studentId,
      academicYearId,
      termId,
      levelId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const calculateClassroomAllScores = async (ctx: Context) => {
  try {
    const { classroomId, academicYearId, termId, levelId } = ctx.body as any;

    if (!classroomId || !academicYearId || !termId || !levelId) {
      ctx.set.status = 400;
      return {
        error:
          "Missing required fields: classroomId, academicYearId, termId, levelId",
      };
    }

    const result = await calculateClassroomAllSvc({
      classroomId,
      academicYearId,
      termId,
      levelId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getClassroomAllScores = async (ctx: Context) => {
  try {
    const classroomId = (ctx.params as any).classroomId;
    const { academicYearId, termId, levelId } = ctx.query as any;

    if (!academicYearId || !termId || !levelId) {
      ctx.set.status = 400;
      return {
        error: "Missing required query params: academicYearId, termId, levelId",
      };
    }

    const result = await calculateClassroomAllSvc({
      classroomId,
      academicYearId,
      termId,
      levelId,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
