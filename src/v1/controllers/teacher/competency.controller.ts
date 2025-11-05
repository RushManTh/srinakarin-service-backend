import type { Context } from "elysia";
import {
  listCompetencies,
  getCompetencyById,
} from "../../services/teacher/competency.service";

export const listCompetenciesController = async (ctx: Context) => {
  try {
    const { search, page, pageSize } = ctx.query;
    return await listCompetencies({
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getCompetencyByIdController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    const competency = await getCompetencyById(id);
    if (!competency) {
      ctx.set.status = 404;
      return { error: "Competency not found" };
    }
    return competency;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
