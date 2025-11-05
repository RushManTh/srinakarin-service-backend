import type { Context } from "elysia";
import {
  getTeacherById,
  listHomeroomStudentsByTeacher,
  listTeacherAssignmentsByTeacherId,
} from "../../services/teacher/teacher.service";

export const getTeacherProfileController = async (ctx: Context) => {
  try {
    const { store } = ctx as any;
    const id = store.user?.userRoleId;
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

export const listMyHomeroomStudentsController = async (ctx: Context) => {
  try {
    const { query, set, store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const { search, page, pageSize } = query;
    return await listHomeroomStudentsByTeacher({
      teacherId: String(teacherId),
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listTeacherAssignmentsByTeacherIdController = async (
  ctx: Context
) => {
  try {
    const { store } = ctx as any;
    const teacherId = store.user?.userRoleId || ctx.params.teacherId;
    if (!teacherId) {
      ctx.set.status = 400;
      return { error: "Missing teacherId" };
    }
    return await listTeacherAssignmentsByTeacherId(teacherId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
