import type { Context } from "elysia";
import {
  listWeights,
  getWeightById as getByIdSvc,
  createWeight as createSvc,
  updateWeight as updateSvc,
  deleteWeight as deleteSvc,
  validateWeightSum as validateSvc,
} from "../../services/admin/coreCompetencyWeight.service";

export const listWeightsController = async (ctx: Context) => {
  try {
    const {
      coreCompetencyId,
      levelId,
      learningAreaId,
      isActive,
      page,
      pageSize,
    } = ctx.query as any;
    return await listWeights({
      coreCompetencyId,
      levelId,
      learningAreaId,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getWeightById = async (ctx: Context) => {
  try {
    const id = (ctx.params as any).id;
    const item = await getByIdSvc(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "Weight configuration not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createWeight = async (ctx: Context) => {
  try {
    const created = await createSvc(ctx.body as any);
    ctx.set.status = 201;
    return created;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateWeight = async (ctx: Context) => {
  try {
    const id = (ctx.params as any).id;
    const updated = await updateSvc(id, ctx.body as any);
    return updated;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteWeight = async (ctx: Context) => {
  try {
    const id = (ctx.params as any).id;
    await deleteSvc(id);
    return { message: "Weight configuration deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const validateWeightSum = async (ctx: Context) => {
  try {
    const { coreCompetencyId, levelId } = ctx.body as any;
    if (!coreCompetencyId) {
      ctx.set.status = 400;
      return { error: "coreCompetencyId is required" };
    }
    return await validateSvc(coreCompetencyId, levelId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
