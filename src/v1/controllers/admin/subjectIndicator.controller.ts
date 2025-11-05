import type { Context } from "elysia";
import {
  listSubjectIndicators,
  getSubjectIndicatorById,
  createSubjectIndicator,
  updateSubjectIndicator,
  deleteSubjectIndicator,
  listSubjectIndicatorsBySubjectId,
} from "../../services/admin/subjectIndicator.service";

export const listSubjectIndicatorsController = async (ctx: Context) => {
  try {
    return await listSubjectIndicators();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getSubjectIndicatorByIdController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    const indicator = await getSubjectIndicatorById(id);
    if (!indicator) {
      ctx.set.status = 404;
      return { error: "SubjectIndicator not found" };
    }
    return indicator;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSubjectIndicatorController = async (ctx: Context) => {
  try {
    const indicator = await createSubjectIndicator(ctx.body);
    ctx.set.status = 201;
    return indicator;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateSubjectIndicatorController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    const indicator = await updateSubjectIndicator(id, ctx.body);
    return indicator;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSubjectIndicatorController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    await deleteSubjectIndicator(id);
    return { message: "SubjectIndicator deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectIndicatorsBySubjectIdController = async (
  ctx: Context
) => {
  try {
    const subjectId = Number(ctx.params.subjectId);
    return await listSubjectIndicatorsBySubjectId(subjectId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
