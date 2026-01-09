import type { Context } from "elysia";
import {
  listCoreCompetencies,
  getCoreCompetencyById as getByIdSvc,
  createCoreCompetency as createSvc,
  updateCoreCompetency as updateSvc,
  deleteCoreCompetency as deleteSvc,
} from "../../services/admin/coreCompetency.service";

export const listCoreCompetenciesController = async (ctx: Context) => {
  try {
    const { search, page, pageSize } = ctx.query as any;
    return await listCoreCompetencies({
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getCoreCompetencyById = async (ctx: Context) => {
  try {
    const id = (ctx.params as any).id;
    const item = await getByIdSvc(id);
    if (!item) {
      ctx.set.status = 404;
      return { error: "CoreCompetency not found" };
    }
    return item;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createCoreCompetency = async (ctx: Context) => {
  try {
    const body = ctx.body as {
      code?: string;
      name: string;
      description?: string;
      competencyIds?: string[];
    };
    const created = await createSvc(body);
    ctx.set.status = 201;
    return created;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateCoreCompetency = async (ctx: Context) => {
  try {
    const id = (ctx.params as any).id;
    const body = ctx.body as {
      code?: string;
      name?: string;
      description?: string;
      competencyIds?: string[];
    };
    const updated = await updateSvc(id, body);
    return updated;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteCoreCompetency = async (ctx: Context) => {
  try {
    const id = (ctx.params as any).id;
    await deleteSvc(id);
    return { message: "CoreCompetency deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
