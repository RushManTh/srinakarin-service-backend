import type { Context } from "elysia";
import {
  listLearningAreas,
  getLearningAreaById,
} from "../../services/teacher/learningArea.service";

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
    const area = await getLearningAreaById(id);
    if (!area) {
      ctx.set.status = 404;
      return { error: "LearningArea not found" };
    }
    return area;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
