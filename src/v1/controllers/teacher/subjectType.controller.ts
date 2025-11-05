import type { Context } from "elysia";
import {
  listSubjectTypes,
  getSubjectTypeById,
} from "../../services/teacher/subjectType.service";

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
