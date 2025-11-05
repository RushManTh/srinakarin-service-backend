import type { Context } from "elysia";
import {
  listProgramEducations,
  getProgramEducationById,
  createProgramEducation,
  updateProgramEducation,
  deleteProgramEducation,
} from "../../services/admin/programEducation.service";

export const listProgramEducationsController = async (ctx: Context) => {
  try {
    const { search, page, pageSize } = ctx.query;
    return await listProgramEducations({
      search,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getProgramEducationByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const program = await getProgramEducationById(id);
    if (!program) {
      ctx.set.status = 404;
      return { error: "ProgramEducation not found" };
    }
    return program;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createProgramEducationController = async (ctx: Context) => {
  try {
    const program = await createProgramEducation(ctx.body);
    ctx.set.status = 201;
    return program;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateProgramEducationController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const program = await updateProgramEducation(id, ctx.body);
    return program;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteProgramEducationController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteProgramEducation(id);
    return { message: "ProgramEducation deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
