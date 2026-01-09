import { Context } from "elysia";
import * as mappingSvc from "../../services/admin/coreCompetencyMapping.service";

// Link competencies to core competency (replace all)
export async function linkCompetencies(ctx: Context) {
  try {
    const { coreCompetencyId } = ctx.params as { coreCompetencyId: string };
    const { competencyIds } = ctx.body as { competencyIds: string[] };

    const result = await mappingSvc.linkCompetenciesToCoreCompetency(
      coreCompetencyId,
      competencyIds
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// Add competencies to core competency (append)
export async function addCompetencies(ctx: Context) {
  try {
    const { coreCompetencyId } = ctx.params as { coreCompetencyId: string };
    const { competencyIds } = ctx.body as { competencyIds: string[] };

    const result = await mappingSvc.addCompetenciesToCoreCompetency(
      coreCompetencyId,
      competencyIds
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// Remove competencies from core competency
export async function removeCompetencies(ctx: Context) {
  try {
    const { coreCompetencyId } = ctx.params as { coreCompetencyId: string };
    const { competencyIds } = ctx.body as { competencyIds: string[] };

    const result = await mappingSvc.removeCompetenciesFromCoreCompetency(
      coreCompetencyId,
      competencyIds
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// Get competencies by core competency
export async function getCompetenciesByCoreCompetency(ctx: Context) {
  try {
    const { coreCompetencyId } = ctx.params as { coreCompetencyId: string };

    const result = await mappingSvc.getCompetenciesByCoreCompetency(
      coreCompetencyId
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}

// Get core competencies by competency
export async function getCoreCompetenciesByCompetency(ctx: Context) {
  try {
    const { competencyId } = ctx.params as { competencyId: string };

    const result = await mappingSvc.getCoreCompetenciesByCompetency(
      competencyId
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("not found") ? 404 : 400;
    return { error: error.message };
  }
}
