import type { Context } from "elysia";
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  listStudentEnrollments,
  listStudentSubjects,
  listStudentScores,
  listStudentSubjectScores,
} from "../../services/admin/student.service";

export const listStudentsController = async (ctx: Context) => {
  try {
    const {
      studentLevelId,
      programEducationId,
      classroomId,
      search,
      page,
      pageSize,
    } = ctx.query;
    return await listStudents({
      studentLevelId: studentLevelId || undefined,
      programEducationId: programEducationId || undefined,
      classroomId: classroomId || undefined,
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const student = await getStudentById(id);
    if (!student) {
      ctx.set.status = 404;
      return { error: "Student not found" };
    }
    return student;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createStudentController = async (ctx: Context) => {
  try {
    const body = { ...ctx.body };
    if (body.birthDate) body.birthDate = new Date(body.birthDate);
    if (body.createdAt) body.createdAt = new Date(body.createdAt);
    const student = await createStudent(body);
    ctx.set.status = 201;
    return student;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateStudentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const body = { ...ctx.body };
    if (body.birthDate) body.birthDate = new Date(body.birthDate);
    if (body.createdAt) body.createdAt = new Date(body.createdAt);
    const student = await updateStudent(id, body);
    return student;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteStudentController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteStudent(id);
    return { message: "Student deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentEnrollmentsController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    return await listStudentEnrollments(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentSubjectsController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    return await listStudentSubjects(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentScoresController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    return await listStudentScores(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentSubjectScoresController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const subjectId = ctx.params.subjectId;
    return await listStudentSubjectScores(id, subjectId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
