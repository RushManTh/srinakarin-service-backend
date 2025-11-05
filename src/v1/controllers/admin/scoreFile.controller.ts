import type { Context } from "elysia";
import {
  createScoreFile,
  deleteScoreFile,
} from "../../services/admin/scoreFile.service";

export const createScoreFileController = async (ctx: Context) => {
  try {
    // Expecting fileUrl, fileType in body, and scoreId from params
    const scoreId = Number(ctx.params.scoreId);
    const { fileUrl, fileType } = ctx.body as {
      fileUrl: string;
      fileType: string;
    };
    const file = await createScoreFile({
      subjectIndicatorScoreId: scoreId,
      fileUrl,
      fileType,
    });
    ctx.set.status = 201;
    return file;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteScoreFileController = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    await deleteScoreFile(id);
    return { message: "Score file deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
