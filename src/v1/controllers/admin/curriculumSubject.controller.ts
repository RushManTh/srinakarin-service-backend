import type { Context } from "elysia";
import {
  listCurriculumSubjects,
  getCurriculumSubjectById,
  createCurriculumSubject,
  updateCurriculumSubject,
  deleteCurriculumSubject,
} from "../../services/admin/curriculumSubject.service";

export const listCurriculumSubjectsController = async (ctx: Context) => {
  try {
    return await listCurriculumSubjects();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getCurriculumSubjectByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const curriculumSubject = await getCurriculumSubjectById(id);
    if (!curriculumSubject) {
      ctx.set.status = 404;
      return { error: "CurriculumSubject not found" };
    }
    return curriculumSubject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createCurriculumSubjectController = async (ctx: Context) => {
  try {
    const curriculumSubject = await createCurriculumSubject(ctx.body);
    ctx.set.status = 201;
    return curriculumSubject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateCurriculumSubjectController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const curriculumSubject = await updateCurriculumSubject(id, ctx.body);
    return curriculumSubject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteCurriculumSubjectController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteCurriculumSubject(id);
    return { message: "CurriculumSubject deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
