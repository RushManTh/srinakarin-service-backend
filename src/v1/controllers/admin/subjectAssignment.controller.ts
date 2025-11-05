import type { Context } from "elysia";
import {
  listSubjectAssignments,
  createSubjectAssignment,
  deleteSubjectAssignment,
} from "../../services/admin/subjectAssignment.service";

export const listSubjectAssignmentsController = async (ctx: Context) => {
  try {
    const { subjectId, teacherId, page, pageSize } = ctx.query;
    return await listSubjectAssignments({
      subjectId: subjectId ? Number(subjectId) : undefined,
      teacherId: teacherId ? Number(teacherId) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSubjectAssignmentController = async (ctx: Context) => {
  try {
    const assignment = await createSubjectAssignment(ctx.body);
    ctx.set.status = 201;
    return assignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSubjectAssignmentController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    await deleteSubjectAssignment(id);
    return { message: "SubjectAssignment deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
