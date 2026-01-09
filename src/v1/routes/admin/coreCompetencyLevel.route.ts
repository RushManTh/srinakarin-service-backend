import { Elysia, t } from "elysia";
import * as coreCompetencyLevelController from "../../controllers/admin/coreCompetencyLevel.controller";

export const coreCompetencyLevelRoute = new Elysia({
  prefix: "/core-competency-levels",
})
  // Get levels matrix for specific core competency (UI display)
  .get(
    "/matrix/:coreCompetencyId",
    coreCompetencyLevelController.getLevelsMatrix,
    {
      params: t.Object({
        coreCompetencyId: t.String(),
      }),
      detail: {
        tags: ["Core Competency Level (AdminRoutes)"],
        summary: "Get levels matrix for UI display",
        description:
          "Returns all levels (1-6) with grade range applicability for table display",
      },
    }
  )

  // List levels with filters
  .get("/", coreCompetencyLevelController.listLevels, {
    query: t.Object({
      coreCompetencyId: t.String(),
      levelId: t.Optional(t.String()),
    }),
    detail: {
      tags: ["Core Competency Level (AdminRoutes)"],
      summary: "List core competency levels",
      description:
        "List all levels for a core competency, optionally filtered by grade range",
    },
  })

  // Get level by ID
  .get("/:id", coreCompetencyLevelController.getLevelById, {
    params: t.Object({
      id: t.String(),
    }),
    detail: {
      tags: ["Core Competency Level (AdminRoutes)"],
      summary: "Get level by ID",
      description:
        "Get detailed information about a specific core competency level",
    },
  })

  // Create new level
  .post("/create", coreCompetencyLevelController.createLevel, {
    body: t.Object({
      coreCompetencyId: t.String(),
      level: t.Number({ minimum: 1 }),
      name: t.String(),
      description: t.Optional(t.String()),
      minScore: t.Number({ minimum: 0, maximum: 100 }),
      maxScore: t.Number({ minimum: 0, maximum: 100 }),
      order: t.Optional(t.Number()),
      levelId: t.String(),
    }),
    detail: {
      tags: ["Core Competency Level (AdminRoutes)"],
      summary: "Create core competency level",
      description:
        "Create a new level for a core competency in a specific grade range",
    },
  })

  // Update level
  .patch("/update/:id", coreCompetencyLevelController.updateLevel, {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      minScore: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
      maxScore: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
      order: t.Optional(t.Number()),
    }),
    detail: {
      tags: ["Core Competency Level (AdminRoutes)"],
      summary: "Update core competency level",
      description:
        "Update level information (name, description, score ranges, order)",
    },
  })

  // Delete level
  .delete("/delete/:id", coreCompetencyLevelController.deleteLevel, {
    params: t.Object({
      id: t.String(),
    }),
    detail: {
      tags: ["Core Competency Level (AdminRoutes)"],
      summary: "Delete core competency level",
      description: "Delete a core competency level",
    },
  });
