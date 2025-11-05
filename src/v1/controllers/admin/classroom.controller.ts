import type { Context } from "elysia";
import {
  listClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  listClassroomStudents,
  addStudentsToClassroom,
  removeStudentFromClassroom,
  listClassroomSubjects,
  addHomeroomTeacher,
  removeHomeroomTeacher,
} from "../../services/admin/classroom.service";

export const listClassroomsController = async (ctx: Context) => {
  try {
    const { search, page, pageSize } = ctx.query;
    return await listClassrooms({
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getClassroomByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const classroom = await getClassroomById(id);
    if (!classroom) {
      ctx.set.status = 404;
      return { error: "Classroom not found" };
    }
    return classroom;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createClassroomController = async (ctx: Context) => {
  try {
    const classroom = await createClassroom(ctx.body);
    ctx.set.status = 201;
    return classroom;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateClassroomController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const classroom = await updateClassroom(id, ctx.body);
    return classroom;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteClassroomController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteClassroom(id);
    return { message: "Classroom deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listClassroomStudentsController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    return await listClassroomStudents(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const addStudentsToClassroomController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const { studentIds } = ctx.body as { studentIds: string[] };
    await addStudentsToClassroom(id, studentIds);
    return { message: "Students added to classroom" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const removeStudentFromClassroomController = async (ctx: Context) => {
  try {
    const classroomId = ctx.params.id;
    const studentId = ctx.params.studentId;
    await removeStudentFromClassroom(classroomId, studentId);
    return { message: "Student removed from classroom" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listClassroomSubjectsController = async (ctx: Context) => {
  try {
    const classroomId = ctx.params.id;
    return await listClassroomSubjects(classroomId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const addHomeroomTeacherController = async (ctx: Context) => {
  try {
    const classroomId = ctx.params.id;
    const { teacherId } = ctx.body as { teacherId: string };
    const classroom = await addHomeroomTeacher(classroomId, teacherId);
    return classroom;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const removeHomeroomTeacherController = async (ctx: Context) => {
  try {
    const classroomId = ctx.params.id;
    const { teacherId } = ctx.body as { teacherId: string };
    const classroom = await removeHomeroomTeacher(classroomId, teacherId);
    return classroom;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
