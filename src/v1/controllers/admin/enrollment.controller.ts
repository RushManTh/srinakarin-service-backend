import type { Context } from "elysia";
import {
  listEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../../services/admin/enrollment.service";

export const listEnrollmentsController = async (ctx: Context) => {
  try {
    return await listEnrollments();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getEnrollmentByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const enrollment = await getEnrollmentById(id);
    if (!enrollment) {
      ctx.set.status = 404;
      return { error: "Enrollment not found" };
    }
    return enrollment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createEnrollmentController = async (ctx: Context) => {
  try {
    const enrollment = await createEnrollment(ctx.body);
    ctx.set.status = 201;
    return enrollment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateEnrollmentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const enrollment = await updateEnrollment(id, ctx.body);
    return enrollment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteEnrollmentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteEnrollment(id);
    return { message: "Enrollment deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
