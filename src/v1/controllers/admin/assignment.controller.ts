import type { Context } from "elysia";
import {
  listAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../services/admin/assignment.service";

export const listAssignmentsController = async (ctx: Context) => {
  try {
    return await listAssignments();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const assignment = await getAssignmentById(id);
    if (!assignment) {
      ctx.set.status = 404;
      return { error: "Assignment not found" };
    }
    return assignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createAssignmentController = async (ctx: Context) => {
  try {
    const assignment = await createAssignment(ctx.body);
    ctx.set.status = 201;
    return assignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAssignmentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const assignment = await updateAssignment(id, ctx.body);
    return assignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAssignment(id);
    return { message: "Assignment deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
