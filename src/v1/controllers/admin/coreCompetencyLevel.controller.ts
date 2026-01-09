import { Context } from "elysia";
import * as coreCompetencyLevelSvc from "../../services/admin/coreCompetencyLevel.service";

// Get levels matrix for UI display
export async function getLevelsMatrix(ctx: Context) {
  try {
    const { coreCompetencyId } = ctx.params as { coreCompetencyId: string };

    const result = await coreCompetencyLevelSvc.getCoreCompetencyLevelsMatrix(
      coreCompetencyId
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// List levels by core competency and optionally by grade range
export async function listLevels(ctx: Context) {
  try {
    const { coreCompetencyId, levelId } = ctx.query as {
      coreCompetencyId?: string;
      levelId?: string;
    };

    if (!coreCompetencyId) {
      ctx.set.status = 400;
      return { error: "coreCompetencyId is required" };
    }

    const result = await coreCompetencyLevelSvc.listCoreCompetencyLevelsByGrade(
      coreCompetencyId,
      levelId
    );

    return result;
  } catch (error: any) {
    ctx.set.status = 400;
    return { error: error.message };
  }
}

// Get level by ID
export async function getLevelById(ctx: Context) {
  try {
    const { id } = ctx.params as { id: string };

    const result = await coreCompetencyLevelSvc.getCoreCompetencyLevelById(id);

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// Create new level
export async function createLevel(ctx: Context) {
  try {
    const data = ctx.body as {
      coreCompetencyId: string;
      level: number;
      name: string;
      description?: string;
      minScore: number;
      maxScore: number;
      order?: number;
      levelId: string;
    };

    const result = await coreCompetencyLevelSvc.createCoreCompetencyLevel(data);

    ctx.set.status = 201;
    return result;
  } catch (error: any) {
    ctx.set.status = 400;
    return { error: error.message };
  }
}

// Update level
export async function updateLevel(ctx: Context) {
  try {
    const { id } = ctx.params as { id: string };
    const data = ctx.body as {
      name?: string;
      description?: string;
      minScore?: number;
      maxScore?: number;
      order?: number;
    };

    const result = await coreCompetencyLevelSvc.updateCoreCompetencyLevel(
      id,
      data
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// Delete level
export async function deleteLevel(ctx: Context) {
  try {
    const { id } = ctx.params as { id: string };

    await coreCompetencyLevelSvc.deleteCoreCompetencyLevel(id);

    return { message: "Core competency level deleted successfully" };
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}
