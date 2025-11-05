import type { Context } from "elysia";
import {
  getClassroomById,
  listClassroomStudents,
  listClassroomSubjects,
} from "../../services/teacher/classroom.service";

export const getClassroomByIdController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const classroom = await getClassroomById(id, teacherId);
    if (!classroom) {
      set.status = 404;
      return { error: "Classroom not found or not accessible" };
    }
    return classroom;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listClassroomStudentsController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const classroom = await getClassroomById(id, teacherId);
    if (!classroom) {
      set.status = 404;
      return { error: "Classroom not found or not accessible" };
    }
    return await listClassroomStudents(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listClassroomSubjectsController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const classroom = await getClassroomById(id, teacherId);
    if (!classroom) {
      set.status = 404;
      return { error: "Classroom not found or not accessible" };
    }
    return await listClassroomSubjects(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
