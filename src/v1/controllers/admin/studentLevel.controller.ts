import type { Context } from "elysia";
import {
  listStudentLevels,
  getStudentLevelById,
  createStudentLevel,
  updateStudentLevel,
  deleteStudentLevel,
} from "../../services/admin/studentLevel.service";

export const listStudentLevelsController = async (ctx: Context) => {
  try {
    const { search, page, pageSize } = ctx.query;
    return await listStudentLevels({
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentLevelByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const studentLevel = await getStudentLevelById(id);
    if (!studentLevel) {
      ctx.set.status = 404;
      return { error: "StudentLevel not found" };
    }
    return studentLevel;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createStudentLevelController = async (ctx: Context) => {
  try {
    const studentLevel = await createStudentLevel(ctx.body);
    ctx.set.status = 201;
    return studentLevel;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateStudentLevelController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const studentLevel = await updateStudentLevel(id, ctx.body);
    return studentLevel;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteStudentLevelController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteStudentLevel(id);
    return { message: "StudentLevel deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
