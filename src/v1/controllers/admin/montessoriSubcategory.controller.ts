import type { Context } from "elysia";
import {
  listMontessoriSubcategories,
  getMontessoriSubcategoryById,
  createMontessoriSubcategory,
  updateMontessoriSubcategory,
  deleteMontessoriSubcategory,
} from "../../services/admin/montessoriSubcategory.service";

export const listMontessoriSubcategoriesController = async (ctx: Context) => {
  try {
    const { categoryId, search, page, pageSize } = ctx.query as any;
    return await listMontessoriSubcategories({
      categoryId,
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getMontessoriSubcategoryByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await getMontessoriSubcategoryById(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "MontessoriSubcategory not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createMontessoriSubcategoryController = async (ctx: Context) => {
  try {
    const item = await createMontessoriSubcategory(ctx.body as any);
    ctx.set.status = 201;
    return item;
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};

export const updateMontessoriSubcategoryController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const item = await updateMontessoriSubcategory(id, ctx.body as any);
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteMontessoriSubcategoryController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteMontessoriSubcategory(id);
    return { message: "MontessoriSubcategory deleted" };
  } catch (e: any) {
    ctx.set.status = (e as any)?.status || 400;
    return { error: e.message };
  }
};
