import { prisma } from "../../models/prisma";

function processTeacherData(data: any) {
  return {
    ...data,
    birthDate:
      data.birthDate && data.birthDate !== "" ? new Date(data.birthDate) : null,
    experienceYears:
      data.experienceYears !== "" ? Number(data.experienceYears) : null,
  };
}

export async function createTeacher(data: any) {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) throw new Error("User not found");
  const processedData = processTeacherData(data);
  return prisma.teacher.create({ data: processedData });
}

export async function updateTeacher(id: string, data: any) {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new Error("Teacher not found");
  const processedData = processTeacherData(data);
  return prisma.teacher.update({ where: { id }, data: processedData });
}

export async function deleteTeacher(id: string) {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new Error("Teacher not found");
  return prisma.teacher.delete({ where: { id } });
}

export async function getTeacherById(id: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      homeroomClassroom: true,
      user: { select: { id: true, email: true } },
    },
  });
  if (!teacher) throw new Error("Teacher not found");
  return teacher;
}

export async function listTeachers({
  search,
  page = 1,
  pageSize = 10,
}: { search?: string; page?: number; pageSize?: number } = {}) {
  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { employeeCode: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        homeroomClassroom: true,
        user: { select: { id: true, email: true } },
      },
    }),
    prisma.teacher.count({ where }),
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

export async function listHomeroomStudentsByTeacher({
  teacherId,
  search,
  page = 1,
  pageSize = 10,
}: {
  teacherId: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  // Find classrooms where teacher is a homeroom teacher
  const classrooms = await prisma.classroom.findMany({
    where: { homeroomTeachers: { some: { id: teacherId } } },
    select: { id: true },
  });
  const classroomIds = classrooms.map((c) => c.id);
  if (classroomIds.length === 0) {
    return { items: [], meta: { total: 0, page, pageSize, totalPages: 0 } };
  }
  const where: any = { classroomId: { in: classroomIds } };
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { studentCode: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        studentLevel: true,
        classroom: true,
        programEducation: true,
      },
    }),
    prisma.student.count({ where }),
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
