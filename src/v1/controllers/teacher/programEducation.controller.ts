import type { Context } from "elysia";
import {
  listProgramEducations,
  getProgramEducationById,
} from "../../services/teacher/programEducation.service";

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
