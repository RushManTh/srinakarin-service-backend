import type { Context } from "elysia";
import {
  listSubjectTypes,
  getSubjectTypeById,
  createSubjectType,
  updateSubjectType,
  deleteSubjectType,
} from "../../services/admin/subjectType.service";

export const listSubjectTypesController = async (ctx: Context) => {
  try {
    return await listSubjectTypes();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getSubjectTypeByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const subjectType = await getSubjectTypeById(id);
    if (!subjectType) {
      ctx.set.status = 404;
      return { error: "SubjectType not found" };
    }
    return subjectType;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSubjectTypeController = async (ctx: Context) => {
  try {
    const subjectType = await createSubjectType(ctx.body);
    ctx.set.status = 201;
    return subjectType;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateSubjectTypeController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const subjectType = await updateSubjectType(id, ctx.body);
    return subjectType;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSubjectTypeController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteSubjectType(id);
    return { message: "SubjectType deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
