import { Elysia, t } from "elysia";
import * as mappingController from "../../controllers/admin/coreCompetencyMapping.controller";

export const coreCompetencyMappingRoute = new Elysia({
  prefix: "/core-competency-mappings",
})
  // Get all competencies linked to a core competency
  .get(
    "/core-competency/:coreCompetencyId/competencies",
    mappingController.getCompetenciesByCoreCompetency,
    {
      params: t.Object({
        coreCompetencyId: t.String(),
      }),
      detail: {
        tags: ["Core Competency Mapping"],
        summary: "Get competencies by core competency",
        description:
          "Get all competencies (สมรรถนะเฉพาะ) linked to a core competency (สมรรถนะหลัก)",
      },
    }
  )

  // Get all core competencies linked to a competency
  .get(
    "/competency/:competencyId/core-competencies",
    mappingController.getCoreCompetenciesByCompetency,
    {
      params: t.Object({
        competencyId: t.String(),
      }),
      detail: {
        tags: ["Core Competency Mapping"],
        summary: "Get core competencies by competency",
        description:
          "Get all core competencies (สมรรถนะหลัก) linked to a competency (สมรรถนะเฉพาะ)",
      },
    }
  )

  // Link competencies to core competency (replace all existing links)
  .put(
    "/core-competency/:coreCompetencyId/competencies",
    mappingController.linkCompetencies,
    {
      params: t.Object({
        coreCompetencyId: t.String(),
      }),
      body: t.Object({
        competencyIds: t.Array(t.String()),
      }),
      detail: {
        tags: ["Core Competency Mapping"],
        summary: "Link competencies to core competency",
        description: "Replace all competency links for a core competency",
      },
    }
  )

  // Add competencies to core competency (append to existing)
  .post(
    "/core-competency/:coreCompetencyId/competencies",
    mappingController.addCompetencies,
    {
      params: t.Object({
        coreCompetencyId: t.String(),
      }),
      body: t.Object({
        competencyIds: t.Array(t.String()),
      }),
      detail: {
        tags: ["Core Competency Mapping"],
        summary: "Add competencies to core competency",
        description: "Add more competencies to existing links",
      },
    }
  )

  // Remove competencies from core competency
  .delete(
    "/core-competency/:coreCompetencyId/competencies",
    mappingController.removeCompetencies,
    {
      params: t.Object({
        coreCompetencyId: t.String(),
      }),
      body: t.Object({
        competencyIds: t.Array(t.String()),
      }),
      detail: {
        tags: ["Core Competency Mapping"],
        summary: "Remove competencies from core competency",
        description: "Remove specific competency links",
      },
    }
  );
