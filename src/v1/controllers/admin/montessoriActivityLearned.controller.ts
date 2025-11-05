import type { Context } from "elysia";
import {
  listMontessoriLearned,
  getMontessoriLearnedById,
  upsertMontessoriLearned,
  toggleMontessoriLearned,
  deleteMontessoriLearned,
  upsertMontessoriLearnedBatch,
  toggleMontessoriLearnedBatch,
  listLearnedByStudentAndCategory,
} from "../../services/admin/montessoriActivityLearned.service";

export const listMontessoriLearnedController = async (ctx: Context) => {
  try {
    const { studentId, activityId, learned, page, pageSize } = ctx.query as any;
    return await listMontessoriLearned({
      studentId,
      activityId,
      learned: typeof learned === "string" ? learned === "true" : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getMontessoriLearnedByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await getMontessoriLearnedById(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "MontessoriActivityLearned not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const upsertMontessoriLearnedController = async (ctx: Context) => {
  try {
    const item = await upsertMontessoriLearned(ctx.body as any);
    ctx.set.status = 201;
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const toggleMontessoriLearnedController = async (ctx: Context) => {
  try {
    const item = await toggleMontessoriLearned(ctx.body as any);
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteMontessoriLearnedController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteMontessoriLearned(id);
    return { message: "MontessoriActivityLearned deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const upsertMontessoriLearnedBatchController = async (ctx: Context) => {
  try {
    const items = await upsertMontessoriLearnedBatch(ctx.body as any);
    ctx.set.status = 201;
    return { items, count: items.length };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const toggleMontessoriLearnedBatchController = async (ctx: Context) => {
  try {
    const items = await toggleMontessoriLearnedBatch(ctx.body as any);
    return { items, count: items.length };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listLearnedByStudentAndCategoryController = async (
  ctx: Context
) => {
  try {
    const { studentId, categoryId } = ctx.query as any;
    if (!studentId || !categoryId) {
      ctx.set.status = 400;
      return { error: "studentId and categoryId are required" };
    }
    const items = await listLearnedByStudentAndCategory({
      studentId,
      categoryId,
    });
    return { items, count: items.length };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
