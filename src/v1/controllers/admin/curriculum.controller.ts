import type { Context } from "elysia";
import {
  listCurriculums,
  getCurriculumById,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
} from "../../services/admin/curriculum.service";

export const listCurriculumsController = async (ctx: Context) => {
  try {
    return await listCurriculums();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getCurriculumByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const curriculum = await getCurriculumById(id);
    if (!curriculum) {
      ctx.set.status = 404;
      return { error: "Curriculum not found" };
    }
    return curriculum;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createCurriculumController = async (ctx: Context) => {
  try {
    const curriculum = await createCurriculum(ctx.body);
    ctx.set.status = 201;
    return curriculum;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateCurriculumController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const curriculum = await updateCurriculum(id, ctx.body);
    return curriculum;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteCurriculumController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteCurriculum(id);
    return { message: "Curriculum deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
