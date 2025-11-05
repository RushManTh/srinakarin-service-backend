import type { Context } from "elysia";
import {
  listAssignmentCompetencies,
  getAssignmentCompetencyById,
  createAssignmentCompetency,
  updateAssignmentCompetency,
  deleteAssignmentCompetency,
  deleteAssignmentCompetenciesByAssignmentId,
  getAssignmentCompetenciesByAssignmentId,
} from "../../services/teacher/assignmentCompetency.service";

export const listAssignmentCompetenciesController = async (ctx: Context) => {
  try {
    return await listAssignmentCompetencies();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentCompetencyByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const competency = await getAssignmentCompetencyById(id);
    if (!competency) {
      ctx.set.status = 404;
      return { error: "AssignmentCompetency not found" };
    }
    return competency;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createAssignmentCompetencyController = async (ctx: Context) => {
  try {
    const competency = await createAssignmentCompetency(ctx.body);
    ctx.set.status = 201;
    return competency;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAssignmentCompetencyController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const competency = await updateAssignmentCompetency(id, ctx.body);
    return competency;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentCompetencyController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAssignmentCompetency(id);
    return { message: "AssignmentCompetency deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentCompetenciesByAssignmentIdController = async (
  ctx: Context
) => {
  try {
    const assignmentId = ctx.params.assignmentId;
    await deleteAssignmentCompetenciesByAssignmentId(assignmentId);
    return { message: "AssignmentCompetencies deleted for the assignment" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentCompetenciesByAssignmentIdController = async (
  ctx: Context
) => {
  const assignmentId = ctx.params.assignmentId;
  if (!assignmentId) {
    ctx.set.status = 400;
    return { error: "assignmentId parameter is required" };
  }

  try {
    const competencies = await getAssignmentCompetenciesByAssignmentId(
      assignmentId
    );
    return competencies;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
