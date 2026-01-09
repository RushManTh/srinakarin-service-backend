import type { Context } from "elysia";
import {
  getFullDashboard,
  getOverviewStats,
  getCurrentAcademicInfo,
  getStudentDistribution,
  getAttendanceStats,
  getCoreCompetencyOverview,
  getAssignmentStats,
  getTeacherAssignmentStats,
  getEnrollmentStats,
  getStudentHealthStats,
  getMontessoriStats,
  getAlerts,
} from "../../services/admin/dashboard.service";

export const getDashboard = async (ctx: Context) => {
  try {
    const { academicYearId, termId, attendanceDays } = ctx.query as any;

    const result = await getFullDashboard({
      academicYearId,
      termId,
      attendanceDays: attendanceDays ? Number(attendanceDays) : 7,
    });

    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getOverview = async (ctx: Context) => {
  try {
    const result = await getOverviewStats();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getCurrentAcademic = async (ctx: Context) => {
  try {
    const result = await getCurrentAcademicInfo();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getDistribution = async (ctx: Context) => {
  try {
    const result = await getStudentDistribution();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAttendance = async (ctx: Context) => {
  try {
    const { days } = ctx.query as any;
    const result = await getAttendanceStats(days ? Number(days) : 7);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getCoreCompetency = async (ctx: Context) => {
  try {
    const result = await getCoreCompetencyOverview();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignments = async (ctx: Context) => {
  try {
    const { academicYearId, termId } = ctx.query as any;
    const result = await getAssignmentStats(academicYearId, termId);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getTeacherAssignments = async (ctx: Context) => {
  try {
    const { academicYearId, termId } = ctx.query as any;
    const result = await getTeacherAssignmentStats(academicYearId, termId);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getEnrollments = async (ctx: Context) => {
  try {
    const { academicYearId, termId } = ctx.query as any;
    const result = await getEnrollmentStats(academicYearId, termId);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getHealth = async (ctx: Context) => {
  try {
    const result = await getStudentHealthStats();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getMontessori = async (ctx: Context) => {
  try {
    const result = await getMontessoriStats();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAlertsList = async (ctx: Context) => {
  try {
    const result = await getAlerts();
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
