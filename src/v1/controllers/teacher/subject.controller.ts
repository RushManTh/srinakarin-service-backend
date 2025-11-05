import type { Context } from "elysia";
import {
  listSubjects,
  getSubjectById,
  listSubjectStudents,
  listSubjectIndicators,
} from "../../services/teacher/subject.service";
import { LearningApproach } from "../../../generated/prisma";

export const listSubjectsController = async (ctx: Context) => {
  try {
    const {
      search,
      subjectTypeId,
      levelId,
      learningAreaId,
      isActive,
      page,
      pageSize,
    } = ctx.query;
    return await listSubjects({
      search,
      subjectTypeId: subjectTypeId ? Number(subjectTypeId) : undefined,
      levelId: levelId ? Number(levelId) : undefined,
      learningAreaId: learningAreaId ? Number(learningAreaId) : undefined,
      isActive: typeof isActive === "string" ? isActive === "true" : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getSubjectByIdController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const subject = await getSubjectById(id, teacherId);
    if (!subject) {
      set.status = 404;
      return { error: "Subject not found or not accessible" };
    }
    return subject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectStudentsController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const subject = await getSubjectById(id, teacherId);
    if (!subject) {
      set.status = 404;
      return { error: "Subject not found or not accessible" };
    }
    return await listSubjectStudents(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectIndicatorsController = async (ctx: Context) => {
  try {
    const { store, params, set } = ctx as any;
    const id = Number(params.id);
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const subject = await getSubjectById(id, teacherId);
    if (!subject) {
      set.status = 404;
      return { error: "Subject not found or not accessible" };
    }
    return await listSubjectIndicators(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
