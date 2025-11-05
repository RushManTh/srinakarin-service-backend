import type { Context } from "elysia";
import {
  listTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm,
} from "../../services/admin/term.service";

export const listTermsController = async (ctx: Context) => {
  try {
    return await listTerms();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getTermByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const term = await getTermById(id);
    if (!term) {
      ctx.set.status = 404;
      return { error: "Term not found" };
    }
    return term;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createTermController = async (ctx: Context) => {
  try {
    const body = { ...ctx.body };
    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);
    const term = await createTerm(body);
    ctx.set.status = 201;
    return term;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateTermController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const body = { ...ctx.body };
    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);
    const term = await updateTerm(id, body);
    return term;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteTermController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteTerm(id);
    return { message: "Term deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
