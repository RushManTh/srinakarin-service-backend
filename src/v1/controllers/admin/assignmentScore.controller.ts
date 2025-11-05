import type { Context } from "elysia";
import {
  listAssignmentScores,
  getAssignmentScoreById,
  createAssignmentScore,
  updateAssignmentScore,
  deleteAssignmentScore,
} from "../../services/admin/assignmentScore.service";

export const listAssignmentScoresController = async (ctx: Context) => {
  try {
    return await listAssignmentScores();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentScoreByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const score = await getAssignmentScoreById(id);
    if (!score) {
      ctx.set.status = 404;
      return { error: "AssignmentScore not found" };
    }
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createAssignmentScoreController = async (ctx: Context) => {
  try {
    const score = await createAssignmentScore(ctx.body);
    ctx.set.status = 201;
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAssignmentScoreController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const score = await updateAssignmentScore(id, ctx.body);
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentScoreController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAssignmentScore(id);
    return { message: "AssignmentScore deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
