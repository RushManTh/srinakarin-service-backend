import type { Context } from "elysia";
import {
  listMontessoriActivities,
  getMontessoriActivityById,
  createMontessoriActivity,
  updateMontessoriActivity,
  deleteMontessoriActivity,
} from "../../services/admin/montessoriActivity.service";

export const listMontessoriActivitiesController = async (ctx: Context) => {
  try {
    const { topicId, search, page, pageSize } = ctx.query as any;
    return await listMontessoriActivities({
      topicId,
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getMontessoriActivityByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await getMontessoriActivityById(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "MontessoriActivity not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createMontessoriActivityController = async (ctx: Context) => {
  try {
    const item = await createMontessoriActivity(ctx.body as any);
    ctx.set.status = 201;
    return item;
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};

export const updateMontessoriActivityController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await updateMontessoriActivity(id, ctx.body as any);
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteMontessoriActivityController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteMontessoriActivity(id);
    return { message: "MontessoriActivity deleted" };
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};
