import type { Context } from "elysia";
import {
  listAssignmentScores,
  getAssignmentScoreById,
  createAssignmentScore,
  updateAssignmentScore,
  deleteAssignmentScore,
  listAssignmentScoresByCompetency,
  getStudentScoresBySubjectGroupedByCompetency,
  getStudentAssignmentScoresByTeacherAssignment,
} from "../../services/teacher/assignmentScore.service";

export const listAssignmentScoresController = async (ctx: Context) => {
  try {
    return await listAssignmentScores();
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getAssignmentScoreByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const score = await getAssignmentScoreById(id);
    if (!score) {
      ctx.set.status = 404;
      return { error: "AssignmentScore not found" };
    }
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createAssignmentScoreController = async (ctx: Context) => {
  try {
    const score = await createAssignmentScore(ctx.body);
    ctx.set.status = 201;
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateAssignmentScoreController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const score = await updateAssignmentScore(id, ctx.body);
    return score;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteAssignmentScoreController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteAssignmentScore(id);
    return { message: "AssignmentScore deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

// ดึงคะแนน AssignmentScore ทั้งหมดที่เกี่ยวข้องกับ competencyId
export const listAssignmentScoresByCompetencyController = async (
  ctx: Context
) => {
  try {
    const competencyId = ctx.params.competencyId;
    return await listAssignmentScoresByCompetency(competencyId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

// ดึงคะแนนของนักเรียนในวิชานั้น ๆ โดยจัดกลุ่มตาม competency
export const getStudentScoresBySubjectGroupedByCompetencyController = async (
  ctx: Context
) => {
  try {
    const studentId = ctx.params.studentId;
    const teacherAssignmentId = ctx.params.teacherAssignmentId;
    return await getStudentScoresBySubjectGroupedByCompetency(
      studentId,
      teacherAssignmentId
    );
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

// ดึงคะแนน AssignmentScore ของนักเรียนรายคนใน teacherAssignmentId
export const getStudentAssignmentScoresByTeacherAssignmentController = async (
  ctx: Context
) => {
  try {
    const studentId = ctx.params.studentId;
    const teacherAssignmentId = ctx.params.teacherAssignmentId;
    return await getStudentAssignmentScoresByTeacherAssignment(
      teacherAssignmentId,
      studentId
    );
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
