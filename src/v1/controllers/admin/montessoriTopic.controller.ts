import type { Context } from "elysia";
import {
  listMontessoriTopics,
  getMontessoriTopicById,
  createMontessoriTopic,
  updateMontessoriTopic,
  deleteMontessoriTopic,
} from "../../services/admin/montessoriTopic.service";

export const listMontessoriTopicsController = async (ctx: Context) => {
  try {
    const { subcategoryId, search, page, pageSize } = ctx.query as any;
    return await listMontessoriTopics({
      subcategoryId,
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getMontessoriTopicByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await getMontessoriTopicById(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "MontessoriTopic not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createMontessoriTopicController = async (ctx: Context) => {
  try {
    const item = await createMontessoriTopic(ctx.body as any);
    ctx.set.status = 201;
    return item;
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};

export const updateMontessoriTopicController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await updateMontessoriTopic(id, ctx.body as any);
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteMontessoriTopicController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteMontessoriTopic(id);
    return { message: "MontessoriTopic deleted" };
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};
