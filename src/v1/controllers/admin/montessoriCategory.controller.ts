import type { Context } from "elysia";
import {
  listMontessoriCategories,
  getMontessoriCategoryById,
  createMontessoriCategory,
  updateMontessoriCategory,
  deleteMontessoriCategory,
} from "../../services/admin/montessoriCategory.service";

export const listMontessoriCategoriesController = async (ctx: Context) => {
  try {
    const { schoolSubjectId, levelId, search, page, pageSize } =
      ctx.query as any;
    return await listMontessoriCategories({
      schoolSubjectId,
      levelId,
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getMontessoriCategoryByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await getMontessoriCategoryById(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "MontessoriCategory not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createMontessoriCategoryController = async (ctx: Context) => {
  try {
    const item = await createMontessoriCategory(ctx.body as any);
    ctx.set.status = 201;
    return item;
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};

export const updateMontessoriCategoryController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await updateMontessoriCategory(id, ctx.body as any);
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteMontessoriCategoryController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteMontessoriCategory(id);
    return { message: "MontessoriCategory deleted" };
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};
