import type { Context } from "elysia";
import {
  createTeacher,
  updateTeacher,
  deleteTeacher,
  listTeachers,
  getTeacherById,
  listHomeroomStudentsByTeacher,
} from "../../services/admin/teacher.service";

export const createTeacherController = async (ctx: Context) => {
  try {
    const teacher = await createTeacher(ctx.body);
    ctx.set.status = 201;
    return teacher;
  } catch (e: unknown) {
    ctx.set.status = 400;
    return { error: (e as Error).message };
  }
};

export const updateTeacherController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const teacher = await updateTeacher(id, ctx.body);
    return teacher;
  } catch (e: unknown) {
    ctx.set.status = 400;
    return { error: (e as Error).message };
  }
};

export const deleteTeacherController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const teacher = await deleteTeacher(id);
    return teacher;
  } catch (e: unknown) {
    ctx.set.status = 400;
    return { error: (e as Error).message };
  }
};

export const getTeacherByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const teacher = await getTeacherById(id);
    if (!teacher) {
      ctx.set.status = 404;
      return { error: "Teacher not found" };
    }
    return teacher;
  } catch (e: unknown) {
    ctx.set.status = 400;
    return { error: (e as Error).message };
  }
};

export const listTeachersController = async (ctx: Context) => {
  try {
    const { search, page, pageSize } = ctx.query;
    return await listTeachers({
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listHomeroomStudentsByTeacherController = async (ctx: Context) => {
  try {
    const teacherId = ctx.params.id;
    const { search, page, pageSize } = ctx.query;
    return await listHomeroomStudentsByTeacher({
      teacherId,
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
