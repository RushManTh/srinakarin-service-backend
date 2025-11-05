import type { Context } from "elysia";
import { listTerms, getTermById } from "../../services/teacher/term.service";

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
