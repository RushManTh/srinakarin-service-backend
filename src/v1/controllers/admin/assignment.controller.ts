import type { Context } from "elysia";
import {
  listAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  listAssignmentsBySubject,
  listAssignmentsByTeacherAssignment,
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

export const listAssignmentsBySubjectController = async (ctx: Context) => {
  try {
    const { schoolSubjectId, teacherId, academicYearId, termId, classroomId } =
      ctx.query;
    return await listAssignmentsBySubject({
      schoolSubjectId,
      teacherId,
      academicYearId,
      termId,
      classroomId,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listAssignmentsByTeacherAssignmentController = async (
  ctx: Context
) => {
  try {
    const teacherAssignmentId = ctx.params.teacherAssignmentId;
    return await listAssignmentsByTeacherAssignment(teacherAssignmentId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
