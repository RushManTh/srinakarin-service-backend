import type { Context } from "elysia";
import {
  listSubjectGroups,
  getSubjectGroupById,
  createSubjectGroup,
  updateSubjectGroup,
  deleteSubjectGroup,
} from "../../services/admin/subjectGroup.service";

export const listSubjectGroupsController = async (ctx: Context) => {
  try {
    return await listSubjectGroups();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getSubjectGroupByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const subjectGroup = await getSubjectGroupById(id);
    if (!subjectGroup) {
      ctx.set.status = 404;
      return { error: "SubjectGroup not found" };
    }
    return subjectGroup;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSubjectGroupController = async (ctx: Context) => {
  try {
    const subjectGroup = await createSubjectGroup(ctx.body);
    ctx.set.status = 201;
    return subjectGroup;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateSubjectGroupController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const subjectGroup = await updateSubjectGroup(id, ctx.body);
    return subjectGroup;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSubjectGroupController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteSubjectGroup(id);
    return { message: "SubjectGroup deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
