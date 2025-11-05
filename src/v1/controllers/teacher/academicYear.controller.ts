import type { Context } from "elysia";
import {
  listAcademicYears,
  getAcademicYearById,
  listTermsByAcademicYear,
} from "../../services/teacher/academicYear.service";

export const listAcademicYearsController = async (ctx: Context) => {
  try {
    return await listAcademicYears();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAcademicYearByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const year = await getAcademicYearById(id);
    if (!year) {
      ctx.set.status = 404;
      return { error: "AcademicYear not found" };
    }
    return year;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const listTermsByAcademicYearController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    return await listTermsByAcademicYear(id);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
