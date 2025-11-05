import type { Context } from "elysia";
import {
  listLearningAreas,
  getLearningAreaById,
  createLearningArea,
  updateLearningArea,
  deleteLearningArea,
} from "../../services/admin/learningArea.service";

export const listLearningAreasController = async (ctx: Context) => {
  try {
    return await listLearningAreas();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getLearningAreaByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const learningArea = await getLearningAreaById(id);
    if (!learningArea) {
      ctx.set.status = 404;
      return { error: "LearningArea not found" };
    }
    return learningArea;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createLearningAreaController = async (ctx: Context) => {
  try {
    const learningArea = await createLearningArea(ctx.body);
    ctx.set.status = 201;
    return learningArea;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateLearningAreaController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const learningArea = await updateLearningArea(id, ctx.body);
    return learningArea;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteLearningAreaController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteLearningArea(id);
    return { message: "LearningArea deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
