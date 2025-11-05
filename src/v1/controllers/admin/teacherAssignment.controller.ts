import type { Context } from "elysia";
import {
  listTeacherAssignments,
  getTeacherAssignmentById,
  createTeacherAssignment,
  updateTeacherAssignment,
  deleteTeacherAssignment,
} from "../../services/admin/teacherAssignment.service";

export const listTeacherAssignmentsController = async (ctx: Context) => {
  try {
    return await listTeacherAssignments();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getTeacherAssignmentByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const teacherAssignment = await getTeacherAssignmentById(id);
    if (!teacherAssignment) {
      ctx.set.status = 404;
      return { error: "TeacherAssignment not found" };
    }
    return teacherAssignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createTeacherAssignmentController = async (ctx: Context) => {
  try {
    const teacherAssignment = await createTeacherAssignment(ctx.body);
    ctx.set.status = 201;
    return teacherAssignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateTeacherAssignmentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const teacherAssignment = await updateTeacherAssignment(id, ctx.body);
    return teacherAssignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteTeacherAssignmentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteTeacherAssignment(id);
    return { message: "TeacherAssignment deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
