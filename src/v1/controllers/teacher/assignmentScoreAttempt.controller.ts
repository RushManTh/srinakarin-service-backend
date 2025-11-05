import type { Context } from "elysia";
import {
  listAssignmentScoreAttempts,
  getAssignmentScoreAttemptById,
  createAssignmentScoreAttempt,
  updateAssignmentScoreAttempt,
  deleteAssignmentScoreAttempt,
} from "../../services/teacher/assignmentScoreAttempt.service";

export const listAssignmentScoreAttemptsController = async (ctx: Context) => {
  try {
    return await listAssignmentScoreAttempts();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentScoreAttemptByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const attempt = await getAssignmentScoreAttemptById(id);
    if (!attempt) {
      ctx.set.status = 404;
      return { error: "AssignmentScoreAttempt not found" };
    }
    return attempt;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createAssignmentScoreAttemptController = async (ctx: Context) => {
  try {
    const attempt = await createAssignmentScoreAttempt(ctx.body);
    ctx.set.status = 201;
    return attempt;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAssignmentScoreAttemptController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const attempt = await updateAssignmentScoreAttempt(id, ctx.body);
    return attempt;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentScoreAttemptController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAssignmentScoreAttempt(id);
    return { message: "AssignmentScoreAttempt deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
