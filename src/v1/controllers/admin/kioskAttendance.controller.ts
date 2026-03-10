import type { Context } from "elysia";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  tapKioskAttendance,
  getKioskAttendanceLogs,
  getKioskAttendanceLogById,
  updateKioskAttendanceLog,
  deleteKioskAttendanceLog,
  getKioskAttendanceByStudentCode,
  type KioskEventType,
} from "../../services/admin/kioskAttendance.service";

// -------- tap (POST /tap) --------

export const tapKioskAttendanceController = async (ctx: Context) => {
  try {
    const body = ctx.body as any;
    const { studentCode, academicYearId, termId } = body;
    const photoFile: File | undefined = body.photo;

    let photoPath: string | undefined;

    if (photoFile) {
      // Validate extension
      const ext = path.extname(photoFile.name).toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      if (!allowedExtensions.includes(ext)) {
        ctx.set.status = 400;
        return { error: "Invalid file type. Only images are allowed." };
      }

      // Build target directory: public/uploads/kiosk/<studentCode>/attendance
      const publicDir = path.join(process.cwd(), "public");
      const targetDir = path.join(
        publicDir,
        "uploads",
        "kiosk",
        studentCode,
        "attendance",
      );
      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
      }

      const filename = `${randomUUID()}${ext}`;
      const filePath = path.join(targetDir, filename);

      const arrayBuffer = await photoFile.arrayBuffer();
      await writeFile(filePath, Buffer.from(arrayBuffer));

      photoPath = `/uploads/kiosk/${studentCode}/attendance/${filename}`;
    }

    const log = await tapKioskAttendance({
      studentCode,
      academicYearId,
      termId,
      photoPath,
    });
    ctx.set.status = 201;
    return log;
  } catch (e: any) {
    ctx.set.status = e?.status || 400;
    return { error: e.message };
  }
};

// -------- list (GET /) --------

export const getKioskAttendanceLogsController = async (ctx: Context) => {
  try {
    const query = ctx.query as any;
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 20;
    return await getKioskAttendanceLogs({
      studentId: query.studentId,
      date: query.date,
      eventType: query.eventType as KioskEventType | undefined,
      academicYearId: query.academicYearId,
      termId: query.termId,
      page,
      limit,
    });
  } catch (e: any) {
    ctx.set.status = e?.status || 400;
    return { error: e.message };
  }
};

// -------- get by id (GET /:id) --------

export const getKioskAttendanceLogByIdController = async (ctx: Context) => {
  try {
    const { id } = ctx.params as any;
    return await getKioskAttendanceLogById(id);
  } catch (e: any) {
    ctx.set.status = e?.status || 400;
    return { error: e.message };
  }
};

// -------- update (PATCH /update/:id) --------

export const updateKioskAttendanceLogController = async (ctx: Context) => {
  try {
    const { id } = ctx.params as any;
    const body = ctx.body as any;
    return await updateKioskAttendanceLog(id, body);
  } catch (e: any) {
    ctx.set.status = e?.status || 400;
    return { error: e.message };
  }
};

// -------- delete (DELETE /delete/:id) --------

export const deleteKioskAttendanceLogController = async (ctx: Context) => {
  try {
    const { id } = ctx.params as any;
    return await deleteKioskAttendanceLog(id);
  } catch (e: any) {
    ctx.set.status = e?.status || 400;
    return { error: e.message };
  }
};

// -------- parent view (GET /public/by-student-code) --------

export const getKioskAttendanceByStudentCodeController = async (
  ctx: Context,
) => {
  try {
    const query = ctx.query as any;
    if (!query.studentCode) {
      ctx.set.status = 400;
      return { error: "studentCode is required" };
    }
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 50;
    return await getKioskAttendanceByStudentCode({
      studentCode: query.studentCode,
      date: query.date,
      page,
      limit,
    });
  } catch (e: any) {
    ctx.set.status = e?.status || 400;
    return { error: e.message };
  }
};
