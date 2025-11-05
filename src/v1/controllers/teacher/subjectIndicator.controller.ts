import type { Context } from "elysia";
import {
  listAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  listSubjectAssignmentsByTeacherAssignmentId,
  listAssignmentsWithStudentScoreStatus,
} from "../../services/teacher/subjectIndicator.service";

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
    const { store, params, set } = ctx as any;
    const id = params.id;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const assignment = await getAssignmentById(id, teacherId);
    if (!assignment) {
      set.status = 404;
      return { error: "Assignment not found or not accessible" };
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
    const { store, params, set } = ctx as any;
    const id = params.id;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const assignment = await updateAssignment(id, ctx.body, teacherId);
    if (!assignment) {
      set.status = 404;
      return { error: "Assignment not found or not accessible" };
    }
    return assignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = params.id;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const result = await deleteAssignment(id, teacherId);
    if (!result) {
      set.status = 404;
      return { error: "Assignment not found or not accessible" };
    }
    return { message: "Assignment deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectAssignmentsByTeacherAssignmentIdController = async (
  ctx: Context
) => {
  try {
    const teacherAssignmentId = ctx.params.teacherAssignmentId;
    return await listSubjectAssignmentsByTeacherAssignmentId(
      teacherAssignmentId
    );
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listAssignmentsWithStudentScoreStatusController = async (
  ctx: Context
) => {
  try {
    const { store, params } = ctx as any;
    const { teacherAssignmentId, studentId } = params;
    const teacherId = store.user?.userRoleId;
    const assignments = await listAssignmentsWithStudentScoreStatus(
      teacherAssignmentId,
      studentId,
      teacherId
    );
    return assignments;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
