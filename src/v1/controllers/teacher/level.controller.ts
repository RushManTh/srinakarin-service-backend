import type { Context } from "elysia";
import { listLevels, getLevelById } from "../../services/teacher/level.service";

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
