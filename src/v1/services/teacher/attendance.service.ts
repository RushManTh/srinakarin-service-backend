import { prisma } from "../../models/prisma";

export type AttendanceSession = "MORNING" | "AFTERNOON";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

export interface AttendanceRecordInput {
  id?: string;
  studentId: string;
  status: AttendanceStatus;
  remark?: string | null;
}

async function ensureHomeroomAccess(teacherId: string, classroomId: string) {
  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    include: { homeroomTeachers: { select: { id: true } } },
  });
  if (!classroom) throw new Error("Classroom not found");
  const isHomeroom = classroom.homeroomTeachers.some((t) => t.id === teacherId);
  if (!isHomeroom) {
    const err: any = new Error(
      "Forbidden: Not homeroom teacher of this classroom"
    );
    err.status = 403;
    throw err;
  }
}

async function validateStudentsInClassroom(
  classroomId: string,
  studentIds: string[]
) {
  if (studentIds.length === 0) return;
  const validStudents = await prisma.student.findMany({
    where: { id: { in: studentIds }, classroomId },
    select: { id: true },
  });
  const validSet = new Set(validStudents.map((s) => s.id));
  const invalid = studentIds.filter((id) => !validSet.has(id));
  if (invalid.length > 0) {
    const err: any = new Error(
      `Some students are not in this classroom: ${invalid.join(",")}`
    );
    err.status = 400;
    throw err;
  }
}

export async function createSchoolAttendance({
  date,
  session,
  classroomId,
  academicYearId,
  termId,
  records = [],
  teacherId,
}: {
  date: string; // ISO date string
  session: AttendanceSession;
  classroomId: string;
  academicYearId: string;
  termId: string;
  records?: AttendanceRecordInput[];
  teacherId: string;
}) {
  await ensureHomeroomAccess(teacherId, classroomId);

  // Dedupe records by studentId (last one wins)
  const dedupMap = new Map<string, AttendanceRecordInput>();
  for (const r of records) dedupMap.set(r.studentId, r);
  const deduped = Array.from(dedupMap.values());
  await validateStudentsInClassroom(
    classroomId,
    deduped.map((r) => r.studentId)
  );

  try {
    const created = await prisma.schoolAttendance.create({
      data: {
        date: new Date(date),
        session,
        classroomId,
        teacherId,
        academicYearId,
        termId,
        records: {
          create: deduped.map((r) => ({
            studentId: r.studentId,
            status: r.status,
            remark: r.remark ?? null,
          })),
        },
      },
      include: {
        records: true,
      },
    });
    return created;
  } catch (e: any) {
    // Prisma unique constraint error code
    if (e?.code === "P2002") {
      const err: any = new Error(
        "Attendance for this classroom, date, and session already exists"
      );
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

export async function listSchoolAttendances({
  teacherId,
  classroomId,
  session,
  fromDate,
  toDate,
  academicYearId,
  termId,
  page = 1,
  pageSize = 10,
}: {
  teacherId: string;
  classroomId?: string;
  session?: AttendanceSession;
  fromDate?: string;
  toDate?: string;
  academicYearId?: string;
  termId?: string;
  page?: number;
  pageSize?: number;
}) {
  // Determine allowed classrooms (homeroom)
  const allowedClassrooms = await prisma.classroom.findMany({
    where: { homeroomTeachers: { some: { id: teacherId } } },
    select: { id: true },
  });
  const allowedIds = new Set(allowedClassrooms.map((c) => c.id));
  if (classroomId && !allowedIds.has(classroomId)) {
    const err: any = new Error(
      "Forbidden: Not homeroom teacher of this classroom"
    );
    err.status = 403;
    throw err;
  }
  const where: any = {
    classroomId: classroomId ? classroomId : { in: Array.from(allowedIds) },
  };
  if (session) where.session = session;
  if (academicYearId) where.academicYearId = academicYearId;
  if (termId) where.termId = termId;
  if (fromDate || toDate) {
    where.date = {};
    if (fromDate) where.date.gte = new Date(fromDate);
    if (toDate) where.date.lte = new Date(toDate);
  }

  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.schoolAttendance.findMany({
      where,
      orderBy: [{ date: "desc" }],
      skip,
      take: pageSize,
      include: {
        classroom: true,
        term: true,
        academicYear: true,
        records: {
          include: {
            student: {
              select: {
                id: true,
                studentCode: true,
                prefix: true,
                firstName: true,
                lastName: true,
                studentLevel: true,
              },
            },
          },
        },
      },
    }),
    prisma.schoolAttendance.count({ where }),
  ]);
  return {
    items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getSchoolAttendanceById(id: string, teacherId: string) {
  const attendance = await prisma.schoolAttendance.findUnique({
    where: { id },
    include: {
      classroom: { include: { homeroomTeachers: { select: { id: true } } } },
      term: true,
      academicYear: true,
      records: { include: { student: true } },
    },
  });
  if (!attendance) return null;
  const isHomeroom = attendance.classroom.homeroomTeachers.some(
    (t) => t.id === teacherId
  );
  if (!isHomeroom) {
    const err: any = new Error(
      "Forbidden: Not homeroom teacher of this classroom"
    );
    err.status = 403;
    throw err;
  }
  return attendance;
}

export async function updateSchoolAttendance({
  id,
  teacherId,
  date,
  session,
  academicYearId,
  termId,
  records,
}: {
  id: string;
  teacherId: string;
  date?: string;
  session?: AttendanceSession;
  academicYearId?: string;
  termId?: string;
  records?: AttendanceRecordInput[];
}) {
  // Check ownership by homeroom
  const current = await prisma.schoolAttendance.findUnique({
    where: { id },
    include: { classroom: { include: { homeroomTeachers: true } } },
  });
  if (!current) return null;
  const isHomeroom = current.classroom.homeroomTeachers.some(
    (t) => t.id === teacherId
  );
  if (!isHomeroom) {
    const err: any = new Error(
      "Forbidden: Not homeroom teacher of this classroom"
    );
    err.status = 403;
    throw err;
  }

  // Prepare updates
  const data: any = {};
  if (date) data.date = new Date(date);
  if (session) data.session = session;
  if (academicYearId) data.academicYearId = academicYearId;
  if (termId) data.termId = termId;

  // Execute in a transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.schoolAttendance.update({ where: { id }, data });
      }
      if (records && records.length > 0) {
        // Validate students belong to classroom
        await validateStudentsInClassroom(
          current.classroom.id,
          records.map((r) => r.studentId)
        );
        // Upsert each record by unique (schoolAttendanceId, studentId)
        for (const r of records) {
          if (r.id) {
            await tx.schoolAttendanceRecord.update({
              where: { id: r.id },
              data: { status: r.status, remark: r.remark ?? null },
            });
          } else {
            await tx.schoolAttendanceRecord.upsert({
              where: {
                schoolAttendanceId_studentId: {
                  schoolAttendanceId: id,
                  studentId: r.studentId,
                },
              },
              update: { status: r.status, remark: r.remark ?? null },
              create: {
                schoolAttendanceId: id,
                studentId: r.studentId,
                status: r.status,
                remark: r.remark ?? null,
              },
            });
          }
        }
      }
      // Return full entity
      return tx.schoolAttendance.findUnique({
        where: { id },
        include: {
          classroom: true,
          term: true,
          academicYear: true,
          records: { include: { student: true } },
        },
      });
    });
    return result;
  } catch (e: any) {
    if (e?.code === "P2002") {
      const err: any = new Error(
        "Another attendance already exists for the same classroom/date/session"
      );
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

export async function deleteSchoolAttendance(id: string, teacherId: string) {
  const current = await prisma.schoolAttendance.findUnique({
    where: { id },
    include: { classroom: { include: { homeroomTeachers: true } } },
  });
  if (!current) return null;
  const isHomeroom = current.classroom.homeroomTeachers.some(
    (t) => t.id === teacherId
  );
  if (!isHomeroom) {
    const err: any = new Error(
      "Forbidden: Not homeroom teacher of this classroom"
    );
    err.status = 403;
    throw err;
  }
  // delete children first due to FK constraints
  await prisma.$transaction([
    prisma.schoolAttendanceRecord.deleteMany({
      where: { schoolAttendanceId: id },
    }),
    prisma.schoolAttendance.delete({ where: { id } }),
  ]);
  return { id };
}
