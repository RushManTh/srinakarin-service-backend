import { prisma } from "../../models/prisma";

export async function getTeacherById(id: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { homeroomClassroom: true },
  });
  if (!teacher) throw new Error("Teacher not found");
  return teacher;
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
    select: {
      id: true,
      name: true,
      code: true,
      homeroomTeachers: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
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
      include: { studentLevel: true, classroom: true, programEducation: true },
    }),
    prisma.student.count({ where }),
  ]);
  return {
    items,
    classrooms: classrooms[0],
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function listTeacherAssignmentsByTeacherId(teacherId: string) {
  return prisma.teacherAssignment.findMany({
    where: { teacherId },
    include: {
      schoolSubject: true,
      classroom: true,
      term: true,
      academicYear: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
