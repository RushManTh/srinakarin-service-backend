import type { Context } from "elysia";
import {
  listSchoolSubjects,
  getSchoolSubjectById,
  createSchoolSubject,
  updateSchoolSubject,
  deleteSchoolSubject,
} from "../../services/admin/schoolSubject.service";

export const listSchoolSubjectsController = async (ctx: Context) => {
  try {
    return await listSchoolSubjects();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getSchoolSubjectByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const schoolSubject = await getSchoolSubjectById(id);
    if (!schoolSubject) {
      ctx.set.status = 404;
      return { error: "SchoolSubject not found" };
    }
    return schoolSubject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSchoolSubjectController = async (ctx: Context) => {
  try {
    const schoolSubject = await createSchoolSubject(ctx.body);
    ctx.set.status = 201;
    return schoolSubject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateSchoolSubjectController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const schoolSubject = await updateSchoolSubject(id, ctx.body);
    return schoolSubject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSchoolSubjectController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteSchoolSubject(id);
    return { message: "SchoolSubject deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
