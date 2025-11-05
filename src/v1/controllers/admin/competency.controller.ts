import type { Context } from "elysia";
import {
  listCompetencies,
  getCompetencyById,
  createCompetency,
  updateCompetency,
  deleteCompetency,
} from "../../services/admin/competency.service";

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
    const id = ctx.params.id;
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

export const createCompetencyController = async (ctx: Context) => {
  try {
    const competency = await createCompetency(ctx.body);
    ctx.set.status = 201;
    return competency;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateCompetencyController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const competency = await updateCompetency(id, ctx.body);
    return competency;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteCompetencyController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteCompetency(id);
    return { message: "Competency deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
