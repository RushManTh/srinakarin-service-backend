import { prisma } from "../../models/prisma";

// List all classrooms
export async function listClassrooms({
  search,
  page = 1,
  pageSize = 10,
}: { search?: string; page?: number; pageSize?: number } = {}) {
  const where: any = {};
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.classroom.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        homeroomTeachers: true,
        programEducation: true,
        students: { select: { id: true, studentCode: true } },
      },
    }),
    prisma.classroom.count({ where }),
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

// Get classroom by ID
export async function getClassroomById(id: string) {
  return prisma.classroom.findUnique({
    where: { id },
    include: {
      homeroomTeachers: true,
      programEducation: true,
      students: {
        include: { studentLevel: true, programEducation: true },
      },
    },
  });
}

// Create a classroom
export async function createClassroom(data: any) {
  return prisma.classroom.create({ data });
}

// Update a classroom
export async function updateClassroom(id: string, data: any) {
  return prisma.classroom.update({ where: { id }, data });
}

// Delete a classroom
export async function deleteClassroom(id: string) {
  // ตรวจสอบว่ามีนักเรียนในห้องหรือไม่
  const classroom = await prisma.classroom.findUnique({
    where: { id },
    include: {
      students: true,
      homeroomTeachers: true, // ตรวจสอบครูประจำชั้นด้วย
    },
  });

  // ถ้าไม่พบห้องเรียน
  if (!classroom) {
    throw new Error("ไม่พบห้องเรียนนี้");
  }

  // ถ้ามีนักเรียนในห้อง
  if (classroom.students.length > 0) {
    throw new Error("ไม่สามารถลบห้องเรียนได้เนื่องจากยังมีนักเรียนอยู่ในห้อง");
  }

  // ถ้ามีครูประจำชั้น
  if (classroom.homeroomTeachers.length > 0) {
    throw new Error("ไม่สามารถลบห้องเรียนได้เนื่องจากยังมีครูประจำชั้น");
  }

  // ถ้าไม่มีนักเรียนและครูประจำชั้น จึงลบห้องเรียนได้
  return prisma.classroom.delete({
    where: { id },
  });
}

// List students in a classroom
export async function listClassroomStudents(classroomId: string) {
  return prisma.student.findMany({ where: { classroomId } });
}

// Add students to a classroom (batch or single)
export async function addStudentsToClassroom(
  classroomId: string,
  studentIds: string[]
) {
  return prisma.student.updateMany({
    where: { id: { in: studentIds } },
    data: { classroomId },
  });
}

// Remove a student from a classroom
export async function removeStudentFromClassroom(
  classroomId: string,
  studentId: string
) {
  return prisma.student.update({
    where: { id: studentId },
    data: { classroomId: null },
  });
}

// List subjects taught in the classroom (via enrollments/assignments)
export async function listClassroomSubjects(classroomId: string) {
  // Find all students in the classroom, then all their enrollments, then unique subjects
  const students = await prisma.student.findMany({
    where: { classroomId },
    select: { id: true },
  });
  const studentIds = students.map((s) => s.id);
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: { in: studentIds } },
    include: { schoolSubject: true },
  });
  // Unique subjects
  const subjectsMap: Record<string, any> = {};
  enrollments.forEach((e) => {
    if (e.schoolSubject) subjectsMap[e.schoolSubject.id] = e.schoolSubject;
  });
  return Object.values(subjectsMap);
}

// Add a teacher as a homeroom teacher for a classroom
export async function addHomeroomTeacher(
  classroomId: string,
  teacherId: string
) {
  return prisma.classroom.update({
    where: { id: classroomId },
    data: {
      homeroomTeachers: {
        connect: { id: teacherId },
      },
    },
    include: { homeroomTeachers: true },
  });
}

// Remove a teacher as a homeroom teacher for a classroom
export async function removeHomeroomTeacher(
  classroomId: string,
  teacherId: string
) {
  return prisma.classroom.update({
    where: { id: classroomId },
    data: {
      homeroomTeachers: {
        disconnect: { id: teacherId },
      },
    },
    include: { homeroomTeachers: true },
  });
}
