import type { Context } from "elysia";
import {
  listLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel,
} from "../../services/admin/level.service";

export const listLevelsController = async (ctx: Context) => {
  try {
    return await listLevels();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getLevelByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const level = await getLevelById(id);
    if (!level) {
      ctx.set.status = 404;
      return { error: "Level not found" };
    }
    return level;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createLevelController = async (ctx: Context) => {
  try {
    const level = await createLevel(ctx.body);
    ctx.set.status = 201;
    return level;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateLevelController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const level = await updateLevel(id, ctx.body);
    return level;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteLevelController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteLevel(id);
    return { message: "Level deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
