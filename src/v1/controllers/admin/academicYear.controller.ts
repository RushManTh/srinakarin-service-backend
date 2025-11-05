import type { Context } from "elysia";
import {
  listAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  listTermsByAcademicYear,
} from "../../services/admin/academicYear.service";

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

export const createAcademicYearController = async (ctx: Context) => {
  try {
    const body = { ...ctx.body };
    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);
    const year = await createAcademicYear(body);
    ctx.set.status = 201;
    return year;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAcademicYearController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const body = { ...ctx.body };
    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);
    const year = await updateAcademicYear(id, body);
    return year;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAcademicYearController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAcademicYear(id);
    return { message: "AcademicYear deleted" };
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
