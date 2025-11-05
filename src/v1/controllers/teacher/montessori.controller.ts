import type { Context } from "elysia";
import { getMontessoriTreeBySchoolSubject } from "../../services/teacher/montessori.service";

export const getMontessoriTreeBySubjectController = async (ctx: Context) => {
  try {
    const { schoolSubjectId, levelId, includeInactive } = ctx.query as any;
    if (!schoolSubjectId) {
      ctx.set.status = 400;
      return { error: "schoolSubjectId is required" };
    }
    const data = await getMontessoriTreeBySchoolSubject({
      schoolSubjectId: String(schoolSubjectId),
      levelId: levelId ? String(levelId) : undefined,
      includeInactive: includeInactive === "true" ? true : false,
    });
    return { items: data };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
