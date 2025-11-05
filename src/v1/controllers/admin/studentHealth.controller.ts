import type { Context } from "elysia";
import {
  listStudentHealth,
  getStudentHealthById,
  createStudentHealth,
  updateStudentHealth,
  deleteStudentHealth,
  createManyStudentHealth,
  updateManyStudentHealth,
  deleteManyStudentHealth,
} from "../../services/admin/studentHealth.service";

export const listStudentHealthController = async (ctx: Context) => {
  try {
    const studentId = ctx.query.studentId || ctx.params.studentId;
    const result = await listStudentHealth(studentId);
    return Array.isArray(result) ? result : result ? [result] : [];
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentHealthByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const health = await getStudentHealthById(id);
    if (!health) {
      ctx.set.status = 404;
      return { error: "StudentHealth not found" };
    }
    return health;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createStudentHealthController = async (ctx: Context) => {
  try {
    const rawBody = ctx.body as any;
    const body: any = {};
    for (const key in rawBody) body[key] = rawBody[key];
    if (body.recordDate) body.recordDate = new Date(body.recordDate);
    const health = await createStudentHealth(body);
    ctx.set.status = 201;
    return health;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createManyStudentHealthController = async (ctx: Context) => {
  try {
    const healths = ctx.body as any[];
    const result = await createManyStudentHealth(healths);
    ctx.set.status = 201;
    return { message: "Add StudentHealth Completed", result };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateStudentHealthController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const rawBody = ctx.body as any;
    const body: any = {};
    for (const key in rawBody) body[key] = rawBody[key];
    if (body.recordDate) body.recordDate = new Date(body.recordDate);
    const health = await updateStudentHealth(id, body);
    return health;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateManyStudentHealthController = async (ctx: Context) => {
  try {
    const updates = ctx.body as { id: string; data: any }[];
    const result = await updateManyStudentHealth(updates);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteStudentHealthController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteStudentHealth(id);
    return { message: "StudentHealth deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteManyStudentHealthController = async (ctx: Context) => {
  try {
    const ids = ctx.body as string[];
    await deleteManyStudentHealth(ids);
    return { message: "StudentHealth deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
