import type { Context } from "elysia";
import {
  listStudents,
  getStudentById,
  listStudentEnrollments,
  listStudentSubjects,
  listStudentScores,
  listStudentSubjectScores,
  getStudentScoresBySubjectGroupedByCompetency,
  getTeacherAssignmentIdsBySubjectTermYear,
} from "../../services/teacher/student.service";

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
    const { params, set, store } = ctx as any;
    const id = params.id;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const student = await getStudentById(id, teacherId);

    if (!student) {
      set.status = 404;
      return { error: "Student not found or not accessible" };
    }
    return student;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentEnrollmentsController = async (ctx: Context) => {
  try {
    const { params, set, store } = ctx as any;
    const id = params.id;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const student = await getStudentById(id, teacherId);
    if (!student) {
      set.status = 404;
      return { error: "Student not found or not accessible" };
    }
    return await listStudentEnrollments(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentSubjectsController = async (ctx: Context) => {
  try {
    const { params, set, store } = ctx as any;
    const id = params.id;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const student = await getStudentById(id, teacherId);
    if (!student) {
      set.status = 404;
      return { error: "Student not found or not accessible" };
    }
    return await listStudentSubjects(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentScoresController = async (ctx: Context) => {
  try {
    const { jwt, cookie, params, set } = ctx as any;
    const id = params.id;
    const token = cookie.token?.value;
    const user = await jwt.verify(token);
    const teacherId = user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const student = await getStudentById(id, teacherId);
    if (!student) {
      set.status = 404;
      return { error: "Student not found or not accessible" };
    }
    return await listStudentScores(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listStudentSubjectScoresController = async (ctx: Context) => {
  try {
    const { params, set, store } = ctx as any;
    const id = params.id;
    const schoolSubjectId = params.schoolSubjectId;
    const academicYearId = params.academicYearId;
    const termId = params.termId;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const student = await getStudentById(id, teacherId);
    if (!student) {
      set.status = 404;
      return { error: "Student not found or not accessible" };
    }
    return await listStudentSubjectScores(
      id,
      schoolSubjectId,
      academicYearId,
      termId
    );
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getStudentScoresBySubjectGroupedByCompetencyController = async (
  ctx: Context
) => {
  try {
    const { params, set, store } = ctx as any;
    const id = params.id;
    const schoolSubjectId = params.schoolSubjectId;
    const academicYearId = params.academicYearId;
    const termId = params.termId;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const student = await getStudentById(id, teacherId);
    if (!student) {
      set.status = 404;
      return { error: "Student not found or not accessible" };
    }
    return await getStudentScoresBySubjectGroupedByCompetency(
      id,
      schoolSubjectId,
      termId,
      academicYearId
    );
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getTeacherAssignmentIdsBySubjectTermYearController = async (
  ctx: Context
) => {
  try {
    const { params, set, store } = ctx as any;
    const schoolSubjectId = params.schoolSubjectId;
    const termId = params.termId;
    const academicYearId = params.academicYearId;
    if (!schoolSubjectId || !termId || !academicYearId) {
      ctx.set.status = 400;
      return { error: "Missing required parameters" };
    }
    const ids = await getTeacherAssignmentIdsBySubjectTermYear(
      schoolSubjectId,
      termId,
      academicYearId
    );
    return { teacherAssignmentIds: ids };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
