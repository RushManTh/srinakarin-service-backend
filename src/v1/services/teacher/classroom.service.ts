import { prisma } from "../../models/prisma";

// Get classroom by ID (with homeroom teacher access control)
export async function getClassroomById(id: number, teacherId: number) {
  const classroom = await prisma.classroom.findUnique({
    where: { id },
    include: { homeroomTeachers: true, students: true },
  });
  if (!classroom) return null;
  if (
    classroom.homeroomTeachers.some((t) => Number(t.id) === Number(teacherId))
  ) {
    return classroom;
  }
  return null;
}

// List students in a classroom
export async function listClassroomStudents(classroomId: number) {
  return prisma.student.findMany({ where: { classroomId } });
}

// List subjects taught in the classroom (via enrollments/assignments)
export async function listClassroomSubjects(classroomId: number) {
  // Find all students in the classroom, then all their enrollments, then unique subjects
  const students = await prisma.student.findMany({
    where: { classroomId },
    select: { id: true },
  });
  const studentIds = students.map((s) => s.id);
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: { in: studentIds } },
    include: { subject: true },
  });
  // Unique subjects
  const subjectsMap: Record<number, any> = {};
  enrollments.forEach((e) => {
    if (e.subject) subjectsMap[e.subject.id] = e.subject;
  });
  return Object.values(subjectsMap);
}
