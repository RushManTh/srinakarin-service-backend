import type { Context } from "elysia";
import {
  listAssignmentScoreFiles,
  getAssignmentScoreFileById,
  createAssignmentScoreFile,
  updateAssignmentScoreFile,
  deleteAssignmentScoreFile,
} from "../../services/teacher/assignmentScoreFile.service";

export const listAssignmentScoreFilesController = async (ctx: Context) => {
  try {
    return await listAssignmentScoreFiles();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentScoreFileByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const file = await getAssignmentScoreFileById(id);
    if (!file) {
      ctx.set.status = 404;
      return { error: "AssignmentScoreFile not found" };
    }
    return file;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createAssignmentScoreFileController = async (ctx: Context) => {
  try {
    const file = await createAssignmentScoreFile(ctx.body);
    ctx.set.status = 201;
    return file;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAssignmentScoreFileController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const file = await updateAssignmentScoreFile(id, ctx.body);
    return file;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentScoreFileController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAssignmentScoreFile(id);
    return { message: "AssignmentScoreFile deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
