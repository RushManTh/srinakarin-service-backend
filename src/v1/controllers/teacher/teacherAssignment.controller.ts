import type { Context } from "elysia";
import {
  listTeacherAssignments,
  getTeacherAssignmentById,
  getStudentsWithScoresByTeacherAssignment,
} from "../../services/teacher/teacherAssignment.service";

export const listTeacherAssignmentsController = async (ctx: Context) => {
  try {
    const { store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    return await listTeacherAssignments(teacherId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getTeacherAssignmentByIdController = async (ctx: Context) => {
  try {
    const { store } = ctx as any;
    const teacherId = store.user?.userRoleId;
    const id = ctx.params.id;
    const teacherAssignment = await getTeacherAssignmentById(id, teacherId);
    if (!teacherAssignment) {
      ctx.set.status = 404;
      return { error: "TeacherAssignment not found" };
    }
    return teacherAssignment;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

// Controller สำหรับดึงข้อมูลนักเรียนที่ลงทะเบียนใน TeacherAssignment พร้อมคะแนนรวมแต่ละประเภท
export const getStudentsWithScoresByTeacherAssignmentController = async (
  ctx: Context
) => {
  try {
    const id = ctx.params.id;
    const students = await getStudentsWithScoresByTeacherAssignment(id);
    return students;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
