import type { Context } from "elysia";
import {
  listEnrollments,
  createEnrollment,
  deleteEnrollment,
  listStudentEnrollments,
  listSubjectEnrollments,
} from "../../services/teacher/enrollment.service";

export const listEnrollmentsController = async (ctx: Context) => {
  try {
    const { studentId, subjectId, page, pageSize } = ctx.query;
    return await listEnrollments({
      studentId: studentId ? Number(studentId) : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createEnrollmentController = async (ctx: Context) => {
  try {
    const { store, set } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const enrollment = await createEnrollment(ctx.body, teacherId);
    if (!enrollment) {
      set.status = 403;
      return {
        error:
          "Forbidden: You are not allowed to enroll this student in this subject",
      };
    }
    ctx.set.status = 201;
    return enrollment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteEnrollmentController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const result = await deleteEnrollment(id, teacherId);
    if (!result) {
      set.status = 404;
      return { error: "Enrollment not found or not accessible" };
    }
    return { message: "Enrollment deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentEnrollmentsController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    return await listStudentEnrollments(id, teacherId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectEnrollmentsController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    return await listSubjectEnrollments(id, teacherId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
