import { prisma } from "../../models/prisma";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export type KioskEventType = "CHECK_IN" | "CHECK_OUT";

// ---------- helpers ----------

/** Build start/end of today in a given UTC offset (default +7 for Thailand). */
function todayRange(utcOffsetHours = 7): { start: Date; end: Date } {
  const now = new Date();
  const localNow = new Date(now.getTime() + utcOffsetHours * 60 * 60 * 1000);
  const yyyy = localNow.getUTCFullYear();
  const mm = localNow.getUTCMonth();
  const dd = localNow.getUTCDate();
  const startLocal = new Date(Date.UTC(yyyy, mm, dd, 0, 0, 0));
  const endLocal = new Date(Date.UTC(yyyy, mm, dd + 1, 0, 0, 0));
  // Convert back to UTC for DB query
  const start = new Date(
    startLocal.getTime() - utcOffsetHours * 60 * 60 * 1000,
  );
  const end = new Date(endLocal.getTime() - utcOffsetHours * 60 * 60 * 1000);
  return { start, end };
}

async function autoDetectEventType(studentId: string): Promise<KioskEventType> {
  const { start, end } = todayRange();
  const lastLog = await prisma.kioskAttendanceLog.findFirst({
    where: { studentId, eventTime: { gte: start, lt: end } },
    orderBy: { eventTime: "desc" },
    select: { eventType: true },
  });
  if (!lastLog) return "CHECK_IN";
  return lastLog.eventType === "CHECK_IN" ? "CHECK_OUT" : "CHECK_IN";
}

/** Delete photo file from disk if it exists. */
async function unlinkPhoto(photoPath: string | null | undefined) {
  if (!photoPath) return;
  try {
    const fullPath = path.join(process.cwd(), "public", photoPath);
    if (existsSync(fullPath)) await unlink(fullPath);
  } catch {
    // Ignore file deletion errors
  }
}

// ---------- tap (create) ----------

export async function tapKioskAttendance({
  studentCode,
  academicYearId,
  termId,
  photoPath,
}: {
  studentCode: string;
  academicYearId: string;
  termId: string;
  photoPath?: string;
}) {
  // Validate references exist
  const [student, academicYear, term] = await Promise.all([
    prisma.student.findUnique({
      where: { studentCode },
      select: { id: true, studentCode: true },
    }),
    prisma.academicYear.findUnique({
      where: { id: academicYearId },
      select: { id: true },
    }),
    prisma.term.findUnique({ where: { id: termId }, select: { id: true } }),
  ]);

  if (!student) {
    const err: any = new Error(
      `Student with studentCode "${studentCode}" not found`,
    );
    err.status = 404;
    throw err;
  }
  if (!academicYear) {
    const err: any = new Error("AcademicYear not found");
    err.status = 404;
    throw err;
  }
  if (!term) {
    const err: any = new Error("Term not found");
    err.status = 404;
    throw err;
  }

  const eventType = await autoDetectEventType(student.id);

  const log = await prisma.kioskAttendanceLog.create({
    data: {
      studentId: student.id,
      eventType,
      academicYearId,
      termId,
      photoPath: photoPath ?? null,
    },
    include: {
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return log;
}

// ---------- list ----------

export async function getKioskAttendanceLogs({
  studentId,
  date,
  eventType,
  academicYearId,
  termId,
  page = 1,
  limit = 20,
}: {
  studentId?: string;
  date?: string; // ISO date string, e.g. "2026-03-09"
  eventType?: KioskEventType;
  academicYearId?: string;
  termId?: string;
  page?: number;
  limit?: number;
}) {
  const where: any = {};

  if (studentId) where.studentId = studentId;
  if (eventType) where.eventType = eventType;
  if (academicYearId) where.academicYearId = academicYearId;
  if (termId) where.termId = termId;

  if (date) {
    const { start, end } = todayRange();
    // Use the requested date instead of today
    const d = new Date(date);
    const utcOffset = 7;
    const localStart = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
    const localEnd = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1),
    );
    const rangeStart = new Date(
      localStart.getTime() - utcOffset * 60 * 60 * 1000,
    );
    const rangeEnd = new Date(localEnd.getTime() - utcOffset * 60 * 60 * 1000);
    where.eventTime = { gte: rangeStart, lt: rangeEnd };
  }

  const skip = (page - 1) * limit;
  const [total, data] = await Promise.all([
    prisma.kioskAttendanceLog.count({ where }),
    prisma.kioskAttendanceLog.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            studentCode: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { eventTime: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ---------- get by id ----------

export async function getKioskAttendanceLogById(id: string) {
  const log = await prisma.kioskAttendanceLog.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      },
      academicYear: { select: { id: true, year: true } },
      term: { select: { id: true, name: true } },
    },
  });
  if (!log) {
    const err: any = new Error("KioskAttendanceLog not found");
    err.status = 404;
    throw err;
  }
  return log;
}

// ---------- update ----------

export async function updateKioskAttendanceLog(
  id: string,
  data: {
    eventType?: KioskEventType;
    eventTime?: string;
    photoPath?: string | null;
    remark?: string;
  },
) {
  const existing = await prisma.kioskAttendanceLog.findUnique({
    where: { id },
    select: { id: true, photoPath: true },
  });
  if (!existing) {
    const err: any = new Error("KioskAttendanceLog not found");
    err.status = 404;
    throw err;
  }

  // If photoPath is being replaced, delete old file
  if (data.photoPath !== undefined && data.photoPath !== existing.photoPath) {
    await unlinkPhoto(existing.photoPath);
  }

  return prisma.kioskAttendanceLog.update({
    where: { id },
    data: {
      ...(data.eventType !== undefined && { eventType: data.eventType }),
      ...(data.eventTime !== undefined && {
        eventTime: new Date(data.eventTime),
      }),
      ...(data.photoPath !== undefined && { photoPath: data.photoPath }),
    },
  });
}

// ---------- delete ----------

export async function deleteKioskAttendanceLog(id: string) {
  const existing = await prisma.kioskAttendanceLog.findUnique({
    where: { id },
    select: { id: true, photoPath: true },
  });
  if (!existing) {
    const err: any = new Error("KioskAttendanceLog not found");
    err.status = 404;
    throw err;
  }

  await prisma.kioskAttendanceLog.delete({ where: { id } });
  await unlinkPhoto(existing.photoPath);

  return { message: "KioskAttendanceLog deleted" };
}

// ---------- parent view (public) ----------

export async function getKioskAttendanceByStudentCode({
  studentCode,
  date,
  page = 1,
  limit = 50,
}: {
  studentCode: string;
  date?: string; // ISO date string e.g. "2026-03-09"
  page?: number;
  limit?: number;
}) {
  const student = await prisma.student.findUnique({
    where: { studentCode },
    select: {
      id: true,
      studentCode: true,
      firstName: true,
      lastName: true,
      prefix: true,
    },
  });
  if (!student) {
    const err: any = new Error(
      `Student with studentCode "${studentCode}" not found`,
    );
    err.status = 404;
    throw err;
  }

  const where: any = { studentId: student.id };

  if (date) {
    const utcOffset = 7;
    const d = new Date(date);
    const localStart = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
    const localEnd = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1),
    );
    where.eventTime = {
      gte: new Date(localStart.getTime() - utcOffset * 60 * 60 * 1000),
      lt: new Date(localEnd.getTime() - utcOffset * 60 * 60 * 1000),
    };
  }

  const skip = (page - 1) * limit;
  const [total, logs] = await Promise.all([
    prisma.kioskAttendanceLog.count({ where }),
    prisma.kioskAttendanceLog.findMany({
      where,
      select: {
        id: true,
        eventType: true,
        eventTime: true,
        photoPath: true,
        academicYear: { select: { id: true, year: true } },
        term: { select: { id: true, name: true } },
      },
      orderBy: { eventTime: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    student,
    data: logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
