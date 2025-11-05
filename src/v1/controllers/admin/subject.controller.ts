import type { Context } from "elysia";
import {
  listSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  listSubjectStudents,
  listSubjectIndicators,
  listSubjectsByLearningApproach,
} from "../../services/admin/subject.service";
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
    const id = Number(ctx.params.id);
    const subject = await getSubjectById(id);
    if (!subject) {
      ctx.set.status = 404;
      return { error: "Subject not found" };
    }
    return subject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSubjectController = async (ctx: Context) => {
  try {
    const subject = await createSubject(ctx.body);
    ctx.set.status = 201;
    return subject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateSubjectController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    const subject = await updateSubject(id, ctx.body);
    return subject;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSubjectController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    await deleteSubject(id);
    return { message: "Subject deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectStudentsController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    return await listSubjectStudents(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectIndicatorsController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    return await listSubjectIndicators(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listSubjectsByLearningApproachController = async (
  ctx: Context
) => {
  try {
    const learningApproach = ctx.query.learningApproach as LearningApproach;
    return await listSubjectsByLearningApproach(learningApproach);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
