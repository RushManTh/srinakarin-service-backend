import type { Context } from "elysia";
import {
  listScores,
  getScoreById,
  createScore,
  updateScore,
  deleteScore,
  listStudentSubjectScores,
  listIndicatorScores,
  getStudentSubjectScoreSummary,
  getAllStudentsSubjectScoreSummary,
  listScoresByCompetency,
  getStudentScoresBySubjectGroupedByCompetency,
} from "../../services/teacher/score.service";

export const listScoresController = async (ctx: Context) => {
  try {
    const { studentId, subjectId, academicYearId, termId, page, pageSize } =
      ctx.query;
    return await listScores({
      studentId: studentId ? Number(studentId) : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      academicYearId: academicYearId ? Number(academicYearId) : undefined,
      termId: termId ? Number(termId) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getScoreByIdController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const score = await getScoreById(id, teacherId);
    if (!score) {
      set.status = 404;
      return { error: "Score not found or not accessible" };
    }
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createScoreController = async (ctx: Context) => {
  try {
    const { store, set } = ctx as any;
    const teacherId = store.user?.userRoleId;

    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const score = await createScore(ctx.body, teacherId);

    if (!score) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    ctx.set.status = 201;
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateScoreController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const score = await updateScore(id, ctx.body, teacherId);
    if (!score) {
      set.status = 404;
      return { error: "Score not found or not accessible" };
    }
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteScoreController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const result = await deleteScore(id, teacherId);
    if (!result) {
      set.status = 404;
      return { error: "Score not found or not accessible" };
    }
    return { message: "Score deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentSubjectScoresController = async (ctx: Context) => {
  try {
    const studentId = Number(ctx.params.studentId);
    const subjectId = Number(ctx.params.subjectId);
    return await listStudentSubjectScores(studentId, subjectId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listIndicatorScoresController = async (ctx: Context) => {
  try {
    const subjectId = Number(ctx.params.subjectId);
    const indicatorId = Number(ctx.params.indicatorId);
    return await listIndicatorScores(subjectId, indicatorId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentSubjectScoreSummaryController = async (ctx: Context) => {
  try {
    const { studentId, subjectId, academicYearId, termId } = ctx.params;
    const summary = await getStudentSubjectScoreSummary({
      studentId: Number(studentId),
      subjectId: Number(subjectId),
      academicYearId: academicYearId ? Number(academicYearId) : undefined,
      termId: termId ? Number(termId) : undefined,
    });
    return summary;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAllStudentsSubjectScoreSummaryController = async (
  ctx: Context
) => {
  try {
    const { subjectId, academicYearId, termId } = ctx.params;
    console.log(ctx.params);
    const { search, studentLevelId, classroomId, programEducationId } =
      ctx.query;
    const summary = await getAllStudentsSubjectScoreSummary({
      subjectId: Number(subjectId),
      academicYearId: academicYearId ? Number(academicYearId) : undefined,
      termId: termId ? Number(termId) : undefined,
      search,
      studentLevelId: studentLevelId ? Number(studentLevelId) : undefined,
      classroomId: classroomId ? Number(classroomId) : undefined,
      programEducationId: programEducationId
        ? Number(programEducationId)
        : undefined,
    });

    return summary;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listScoresByCompetencyController = async (ctx: Context) => {
  try {
    const { subjectTypeId, competencyId, academicYearId, termId, studentId } =
      ctx.query;
    return await listScoresByCompetency({
      subjectTypeId: Number(subjectTypeId),
      competencyId: competencyId ? Number(competencyId) : undefined,
      academicYearId: academicYearId ? Number(academicYearId) : undefined,
      termId: termId ? Number(termId) : undefined,
      studentId: studentId ? Number(studentId) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentScoresBySubjectGroupedByCompetencyController = async (
  ctx: Context
) => {
  try {
    const { subjectId, studentId, academicYearId, termId } = ctx.query;
    return await getStudentScoresBySubjectGroupedByCompetency({
      subjectId: Number(subjectId),
      studentId: Number(studentId),
      academicYearId: academicYearId ? Number(academicYearId) : undefined,
      termId: termId ? Number(termId) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
