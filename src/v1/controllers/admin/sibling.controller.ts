import type { Context } from "elysia";
import {
  listSiblings,
  getSiblingById,
  createSibling,
  updateSibling,
  deleteSibling,
  createManySiblings,
  updateManySiblings,
  deleteManySiblings,
} from "../../services/admin/sibling.service";

export const listSiblingsController = async (ctx: Context) => {
  try {
    const studentId = ctx.query.studentId || ctx.params.studentId;
    return await listSiblings(studentId);
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getSiblingByIdController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const sibling = await getSiblingById(id);
    if (!sibling) {
      ctx.set.status = 404;
      return { error: "Sibling not found" };
    }
    return sibling;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createSiblingController = async (ctx: Context) => {
  try {
    const sibling = await createSibling(ctx.body);
    ctx.set.status = 201;
    return sibling;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateSiblingController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const sibling = await updateSibling(id, ctx.body);
    return sibling;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteSiblingController = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    await deleteSibling(id);
    return { message: "Sibling deleted" };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const createManySiblingsController = async (ctx: Context) => {
  try {
    const siblings = ctx.body as any[];
    const result = await createManySiblings(siblings);
    ctx.set.status = 201;
    return { message: "Add Sibling Completed", result };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const updateManySiblingsController = async (ctx: Context) => {
  try {
    const updates = ctx.body as { id: string; data: any }[];
    const result = await updateManySiblings(updates);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const deleteManySiblingsController = async (ctx: Context) => {
  try {
    const ids = ctx.body as string[];
    const result = await deleteManySiblings(ids);
    return result;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
