import type { Context } from "elysia";
import {
  listScores,
  getScoreById,
  createScore,
  updateScore,
  deleteScore,
  listStudentSubjectScores,
  listIndicatorScores,
} from "../../services/admin/score.service";

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
    const id = Number(ctx.params.id);
    const score = await getScoreById(id);
    if (!score) {
      ctx.set.status = 404;
      return { error: "Score not found" };
    }
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createScoreController = async (ctx: Context) => {
  try {
    const score = await createScore(ctx.body);
    ctx.set.status = 201;
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateScoreController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    const score = await updateScore(id, ctx.body);
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteScoreController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    await deleteScore(id);
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
