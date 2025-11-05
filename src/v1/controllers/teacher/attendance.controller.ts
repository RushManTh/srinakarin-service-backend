import type { Context } from "elysia";
import {
  createSchoolAttendance,
  deleteSchoolAttendance,
  getSchoolAttendanceById,
  listSchoolAttendances,
  updateSchoolAttendance,
} from "../../services/teacher/attendance.service";

export const createAttendanceController = async (ctx: Context) => {
  try {
    const { body, store, set } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const created = await createSchoolAttendance({
      date: String(body.date),
      session: String(body.session) as any,
      classroomId: String(body.classroomId),
      academicYearId: String(body.academicYearId),
      termId: String(body.termId),
      records: (body.records || []) as any,
      teacherId,
    });
    return created;
  } catch (e: any) {
    const status = e?.status || 400;
    ctx.set.status = status;
    return { error: e.message };
  }
};

export const listAttendancesController = async (ctx: Context) => {
  try {
    const { query, store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      ctx.set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const {
      classroomId,
      session,
      fromDate,
      toDate,
      academicYearId,
      termId,
      page,
      pageSize,
    } = query;
    return await listSchoolAttendances({
      teacherId,
      classroomId,
      session,
      fromDate,
      toDate,
      academicYearId,
      termId,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAttendanceByIdController = async (ctx: Context) => {
  try {
    const { params, store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      ctx.set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const att = await getSchoolAttendanceById(String(params.id), teacherId);
    if (!att) {
      ctx.set.status = 404;
      return { error: "Attendance not found" };
    }
    return att;
  } catch (e: any) {
    const status = e?.status || 400;
    ctx.set.status = status;
    return { error: e.message };
  }
};

export const updateAttendanceController = async (ctx: Context) => {
  try {
    const { params, body, store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      ctx.set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const updated = await updateSchoolAttendance({
      id: String(params.id),
      teacherId,
      date: body.date,
      session: body.session,
      academicYearId: body.academicYearId,
      termId: body.termId,
      records: body.records,
    });
    if (!updated) {
      ctx.set.status = 404;
      return { error: "Attendance not found" };
    }
    return updated;
  } catch (e: any) {
    const status = e?.status || 400;
    ctx.set.status = status;
    return { error: e.message };
  }
};

export const deleteAttendanceController = async (ctx: Context) => {
  try {
    const { params, store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      ctx.set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const deleted = await deleteSchoolAttendance(String(params.id), teacherId);
    if (!deleted) {
      ctx.set.status = 404;
      return { error: "Attendance not found" };
    }
    return deleted;
  } catch (e: any) {
    const status = e?.status || 400;
    ctx.set.status = status;
    return { error: e.message };
  }
};

export const listAttendancesByClassYearTermController = async (
  ctx: Context
) => {
  try {
    const { query, store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    if (!teacherId) {
      ctx.set.status = 403;
      return { error: "Forbidden: No teacher context" };
    }
    const { classroomId, academicYearId, termId, date, page, pageSize } = query;
    if (!classroomId || !academicYearId || !termId) {
      ctx.set.status = 400;
      return { error: "classroomId, academicYearId and termId are required" };
    }
    // If a specific date is provided, filter the entire day range
    let fromDate: string | undefined;
    let toDate: string | undefined;
    if (date) {
      const d = new Date(String(date));
      if (isNaN(d.getTime())) {
        ctx.set.status = 400;
        return { error: "Invalid date format" };
      }
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      fromDate = start.toISOString();
      toDate = end.toISOString();
    }

    return await listSchoolAttendances({
      teacherId,
      classroomId,
      academicYearId,
      termId,
      fromDate,
      toDate,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 50,
    });
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
