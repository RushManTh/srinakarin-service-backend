import { prisma } from "../../models/prisma";

// ========== ภาพรวมสถิติหลัก ==========
export async function getOverviewStats() {
  const [
    totalStudents,
    activeStudents,
    totalTeachers,
    activeTeachers,
    totalClassrooms,
    totalSubjects,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { isActive: true } }),
    prisma.teacher.count(),
    prisma.teacher.count({ where: { isActive: true } }),
    prisma.classroom.count(),
    prisma.schoolSubject.count(),
  ]);

  return {
    students: {
      total: totalStudents,
      active: activeStudents,
      inactive: totalStudents - activeStudents,
    },
    teachers: {
      total: totalTeachers,
      active: activeTeachers,
      inactive: totalTeachers - activeTeachers,
    },
    classrooms: totalClassrooms,
    subjects: totalSubjects,
  };
}

// ========== ข้อมูลปัจจุบัน ==========
export async function getCurrentAcademicInfo() {
  // หา academic year ล่าสุด (สมมติว่าเรียงตาม year desc)
  const currentAcademicYear = await prisma.academicYear.findFirst({
    orderBy: { year: "desc" },
    include: {
      terms: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!currentAcademicYear) {
    return null;
  }

  // หา term ปัจจุบัน (ตาม startDate/endDate หรือ term แรก)
  const now = new Date();
  let currentTerm = currentAcademicYear.terms.find(
    (t) => t.startDate && t.endDate && now >= t.startDate && now <= t.endDate
  );

  if (!currentTerm && currentAcademicYear.terms.length > 0) {
    currentTerm = currentAcademicYear.terms[0];
  }

  return {
    academicYear: {
      id: currentAcademicYear.id,
      year: currentAcademicYear.year,
      startDate: currentAcademicYear.startDate,
      endDate: currentAcademicYear.endDate,
    },
    currentTerm: currentTerm
      ? {
          id: currentTerm.id,
          name: currentTerm.name,
          startDate: currentTerm.startDate,
          endDate: currentTerm.endDate,
        }
      : null,
    allTerms: currentAcademicYear.terms.map((t) => ({
      id: t.id,
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate,
    })),
  };
}

// ========== การกระจายตัวนักเรียน ==========
export async function getStudentDistribution() {
  // จำนวนนักเรียนแต่ละระดับชั้น
  const byStudentLevel = await prisma.student.groupBy({
    by: ["studentLevelId"],
    where: { isActive: true },
    _count: true,
  });

  const studentLevelDetails = await prisma.studentLevel.findMany({
    where: {
      id: {
        in: byStudentLevel
          .map((s) => s.studentLevelId)
          .filter(Boolean) as string[],
      },
    },
    select: { id: true, name: true, code: true, order: true },
  });

  const byLevel = byStudentLevel
    .map((item) => {
      const level = studentLevelDetails.find(
        (l) => l.id === item.studentLevelId
      );
      return {
        studentLevelId: item.studentLevelId,
        studentLevelName: level?.name || "ไม่ระบุ",
        studentLevelCode: level?.code,
        order: level?.order || 999,
        count: item._count,
      };
    })
    .sort((a, b) => a.order - b.order);

  // จำนวนนักเรียนแต่ละห้อง
  const byClassroom = await prisma.student.groupBy({
    by: ["classroomId"],
    where: { isActive: true },
    _count: true,
  });

  const classroomDetails = await prisma.classroom.findMany({
    where: {
      id: {
        in: byClassroom.map((c) => c.classroomId).filter(Boolean) as string[],
      },
    },
    select: { id: true, name: true, code: true },
  });

  const byClassroomData = byClassroom
    .map((item) => {
      const classroom = classroomDetails.find((c) => c.id === item.classroomId);
      return {
        classroomId: item.classroomId,
        classroomName: classroom?.name || "ไม่ระบุ",
        classroomCode: classroom?.code,
        count: item._count,
      };
    })
    .sort((a, b) => b.count - a.count);

  // จำนวนนักเรียนตามหลักสูตร
  const byProgram = await prisma.student.groupBy({
    by: ["programEducationId"],
    where: { isActive: true },
    _count: true,
  });

  const programDetails = await prisma.programEducation.findMany({
    where: {
      id: {
        in: byProgram
          .map((p) => p.programEducationId)
          .filter(Boolean) as string[],
      },
    },
    select: { id: true, name: true, code: true },
  });

  const byProgramData = byProgram.map((item) => {
    const program = programDetails.find(
      (p) => p.id === item.programEducationId
    );
    return {
      programEducationId: item.programEducationId,
      programName: program?.name || "ไม่ระบุ",
      programCode: program?.code,
      count: item._count,
    };
  });

  return {
    byLevel,
    byClassroom: byClassroomData,
    byProgram: byProgramData,
  };
}

// ========== การเข้าเรียน (Attendance) ==========
export async function getAttendanceStats(days: number = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // ดึงข้อมูลการเช็คชื่อย้อนหลัง
  const attendanceRecords = await prisma.schoolAttendance.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      records: true,
    },
  });

  let totalRecords = 0;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;

  const dailyStats: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
    leave: number;
    total: number;
  }> = [];

  // สถิติรายวัน
  const dateMap = new Map<string, any>();

  attendanceRecords.forEach((attendance) => {
    const dateKey = attendance.date.toISOString().split("T")[0];

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, {
        date: dateKey,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        total: 0,
      });
    }

    const dayData = dateMap.get(dateKey);

    attendance.records.forEach((record) => {
      totalRecords++;
      dayData.total++;

      switch (record.status) {
        case "PRESENT":
          presentCount++;
          dayData.present++;
          break;
        case "ABSENT":
          absentCount++;
          dayData.absent++;
          break;
        case "LATE":
          lateCount++;
          dayData.late++;
          break;
        case "LEAVE":
          leaveCount++;
          dayData.leave++;
          break;
      }
    });
  });

  dateMap.forEach((value) => dailyStats.push(value));
  dailyStats.sort((a, b) => a.date.localeCompare(b.date));

  const attendanceRate =
    totalRecords > 0 ? ((presentCount + lateCount) / totalRecords) * 100 : 0;

  // วันนี้
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = await prisma.schoolAttendance.findMany({
    where: {
      date: {
        gte: new Date(today),
        lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      records: {
        where: { status: "ABSENT" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
        },
      },
    },
  });

  const absentTodayList = todayAttendance.flatMap((att) =>
    att.records.map((r) => ({
      studentId: r.student.id,
      studentName: `${r.student.firstName} ${r.student.lastName}`,
      studentCode: r.student.studentCode,
    }))
  );

  return {
    summary: {
      days,
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      leaveCount,
      attendanceRate: parseFloat(attendanceRate.toFixed(2)),
    },
    dailyStats,
    today: {
      absentCount: absentTodayList.length,
      absentStudents: absentTodayList,
    },
  };
}

// ========== สมรรถนะหลัก (Core Competency) - ภาพรวม ==========
export async function getCoreCompetencyOverview() {
  const coreCompetencies = await prisma.coreCompetency.findMany({
    select: { id: true, code: true, name: true },
    orderBy: { name: "asc" },
  });

  // Note: ต้องมีข้อมูล cache หรือคำนวณจริง ตอนนี้ return placeholder
  // ในการใช้งานจริงควรใช้ StudentCoreCompetencyScore cache table
  const scores = coreCompetencies.map((cc) => ({
    coreCompetencyId: cc.id,
    coreCompetencyCode: cc.code,
    coreCompetencyName: cc.name,
    averageScore: 0, // TODO: คำนวณจริงจาก cache
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level4Count: 0,
  }));

  return {
    totalCoreCompetencies: coreCompetencies.length,
    coreCompetencies: scores,
  };
}

// ========== ชิ้นงาน/Assignment ==========
export async function getAssignmentStats(
  academicYearId?: string,
  termId?: string
) {
  const where: any = {};

  if (academicYearId || termId) {
    where.teacherAssignment = {};
    if (academicYearId) where.teacherAssignment.academicYearId = academicYearId;
    if (termId) where.teacherAssignment.termId = termId;
  }

  const totalAssignments = await prisma.assignment.count({ where });

  // ชิ้นงานที่สร้างในเดือนนี้
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthAssignments = await prisma.assignment.count({
    where: {
      ...where,
      createdAt: { gte: startOfMonth },
    },
  });

  // ชิ้นงานที่รอตรวจ (ไม่มีคะแนน หรือ score = 0)
  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      attempts: {
        include: {
          scores: true,
        },
      },
    },
  });

  let pendingCount = 0;
  let totalSubmissions = 0;
  let scoredSubmissions = 0;

  assignments.forEach((assignment) => {
    assignment.attempts.forEach((attempt) => {
      attempt.scores.forEach((score) => {
        totalSubmissions++;
        if (score.score > 0) {
          scoredSubmissions++;
        } else {
          pendingCount++;
        }
      });
    });
  });

  const submissionRate =
    totalSubmissions > 0 ? (scoredSubmissions / totalSubmissions) * 100 : 0;

  return {
    totalAssignments,
    thisMonthAssignments,
    pendingScoreCount: pendingCount,
    totalSubmissions,
    scoredSubmissions,
    submissionRate: parseFloat(submissionRate.toFixed(2)),
  };
}

// ========== การมอบหมายงานครู ==========
export async function getTeacherAssignmentStats(
  academicYearId?: string,
  termId?: string
) {
  const where: any = {};
  if (academicYearId) where.academicYearId = academicYearId;
  if (termId) where.termId = termId;

  const totalAssignments = await prisma.teacherAssignment.count({ where });

  // ครูที่สอนมากที่สุด
  const teacherGroups = await prisma.teacherAssignment.groupBy({
    by: ["teacherId"],
    where,
    _count: true,
  });

  const teacherDetails = await prisma.teacher.findMany({
    where: {
      id: { in: teacherGroups.map((t) => t.teacherId) },
    },
    select: { id: true, firstName: true, lastName: true },
  });

  const topTeachers = teacherGroups
    .map((t) => {
      const teacher = teacherDetails.find((td) => td.id === t.teacherId);
      return {
        teacherId: t.teacherId,
        teacherName: teacher
          ? `${teacher.firstName} ${teacher.lastName}`
          : "ไม่ระบุ",
        assignmentCount: t._count,
      };
    })
    .sort((a, b) => b.assignmentCount - a.assignmentCount)
    .slice(0, 5);

  // วิชาที่ไม่มีครูสอน
  const allSubjects = await prisma.schoolSubject.findMany({
    select: { id: true, name: true, code: true },
  });

  const assignedSubjectIds = await prisma.teacherAssignment.findMany({
    where,
    select: { schoolSubjectId: true },
    distinct: ["schoolSubjectId"],
  });

  const assignedIds = new Set(assignedSubjectIds.map((a) => a.schoolSubjectId));
  const unassignedSubjects = allSubjects.filter((s) => !assignedIds.has(s.id));

  return {
    totalTeacherAssignments: totalAssignments,
    topTeachers,
    unassignedSubjects: unassignedSubjects.map((s) => ({
      subjectId: s.id,
      subjectName: s.name,
      subjectCode: s.code,
    })),
  };
}

// ========== การลงทะเบียนเรียน ==========
export async function getEnrollmentStats(
  academicYearId?: string,
  termId?: string
) {
  const where: any = {};
  if (academicYearId) where.academicYearId = academicYearId;
  if (termId) where.termId = termId;

  const totalEnrollments = await prisma.enrollment.count({ where });

  // นักเรียนที่ยังไม่ได้ลงทะเบียนวิชาใด
  const allActiveStudents = await prisma.student.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true, studentCode: true },
  });

  const enrolledStudentIds = await prisma.enrollment.findMany({
    where,
    select: { studentId: true },
    distinct: ["studentId"],
  });

  const enrolledIds = new Set(enrolledStudentIds.map((e) => e.studentId));
  const notEnrolledStudents = allActiveStudents.filter(
    (s) => !enrolledIds.has(s.id)
  );

  // วิชาที่มีนักเรียนลงทะเบียนมากที่สุด
  const subjectGroups = await prisma.enrollment.groupBy({
    by: ["schoolSubjectId"],
    where,
    _count: true,
  });

  const subjectDetails = await prisma.schoolSubject.findMany({
    where: {
      id: { in: subjectGroups.map((s) => s.schoolSubjectId) },
    },
    select: { id: true, name: true, code: true },
  });

  const topSubjects = subjectGroups
    .map((s) => {
      const subject = subjectDetails.find((sd) => sd.id === s.schoolSubjectId);
      return {
        subjectId: s.schoolSubjectId,
        subjectName: subject?.name || "ไม่ระบุ",
        subjectCode: subject?.code,
        enrollmentCount: s._count,
      };
    })
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5);

  return {
    totalEnrollments,
    notEnrolledStudentCount: notEnrolledStudents.length,
    notEnrolledStudents: notEnrolledStudents.map((s) => ({
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      studentCode: s.studentCode,
    })),
    topSubjects,
  };
}

// ========== สุขภาพนักเรียน ==========
export async function getStudentHealthStats() {
  // นักเรียนที่มีโรคประจำตัว
  const withDisease = await prisma.studentHealth.findMany({
    where: {
      congenitalDisease: { not: null },
    },
    distinct: ["studentId"],
    select: { studentId: true },
  });

  // นักเรียนที่มีความพิการ
  const withDisability = await prisma.studentHealth.findMany({
    where: {
      disability: { not: null },
    },
    distinct: ["studentId"],
    select: { studentId: true },
  });

  // บันทึกสุขภาพล่าสุด
  const latestHealthRecords = await prisma.studentHealth.findMany({
    orderBy: { recordDate: "desc" },
    take: 5,
    include: {
      student: {
        select: { firstName: true, lastName: true, studentCode: true },
      },
    },
  });

  return {
    studentsWithDiseaseCount: withDisease.length,
    studentsWithDisabilityCount: withDisability.length,
    latestHealthRecords: latestHealthRecords.map((r) => ({
      studentId: r.studentId,
      studentName: `${r.student.firstName} ${r.student.lastName}`,
      studentCode: r.student.studentCode,
      recordDate: r.recordDate,
      congenitalDisease: r.congenitalDisease,
      disability: r.disability,
    })),
  };
}

// ========== Montessori ==========
export async function getMontessoriStats() {
  const totalActivities = await prisma.montessoriActivity.count({
    where: { isActive: true },
  });

  const totalLearned = await prisma.montessoriActivityLearned.count({
    where: { learned: true },
  });

  const totalRecords = await prisma.montessoriActivityLearned.count();

  const learningRate =
    totalRecords > 0 ? (totalLearned / totalRecords) * 100 : 0;

  // นักเรียนที่เรียนรู้ Activity มากที่สุด
  const studentGroups = await prisma.montessoriActivityLearned.groupBy({
    by: ["studentId"],
    where: { learned: true },
    _count: true,
  });

  const studentDetails = await prisma.student.findMany({
    where: {
      id: { in: studentGroups.map((s) => s.studentId) },
    },
    select: { id: true, firstName: true, lastName: true, studentCode: true },
  });

  const topStudents = studentGroups
    .map((s) => {
      const student = studentDetails.find((sd) => sd.id === s.studentId);
      return {
        studentId: s.studentId,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : "ไม่ระบุ",
        studentCode: student?.studentCode,
        learnedCount: s._count,
      };
    })
    .sort((a, b) => b.learnedCount - a.learnedCount)
    .slice(0, 5);

  return {
    totalActivities,
    totalLearned,
    learningRate: parseFloat(learningRate.toFixed(2)),
    topStudents,
  };
}

// ========== การแจ้งเตือน/Alerts ==========
export async function getAlerts() {
  // นักเรียนที่ขาดเรียนติดต่อกันมากกว่า 3 วัน
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentAttendances = await prisma.schoolAttendance.findMany({
    where: {
      date: { gte: sevenDaysAgo },
    },
    include: {
      records: {
        where: { status: "ABSENT" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  // Group by student and count consecutive absences
  const studentAbsenceMap = new Map<string, { count: number; student: any }>();

  recentAttendances.forEach((att) => {
    att.records.forEach((record) => {
      const existing = studentAbsenceMap.get(record.studentId);
      if (existing) {
        existing.count++;
      } else {
        studentAbsenceMap.set(record.studentId, {
          count: 1,
          student: record.student,
        });
      }
    });
  });

  const frequentAbsentees = Array.from(studentAbsenceMap.entries())
    .filter(([_, data]) => data.count >= 3)
    .map(([studentId, data]) => ({
      studentId,
      studentName: `${data.student.firstName} ${data.student.lastName}`,
      studentCode: data.student.studentCode,
      absentDays: data.count,
    }))
    .sort((a, b) => b.absentDays - a.absentDays);

  // ครูที่ยังไม่ได้เช็คชื่อวันนี้
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendanceToday = await prisma.schoolAttendance.findMany({
    where: {
      date: { gte: today },
    },
    select: { teacherId: true, classroomId: true },
  });

  const checkedTeacherIds = new Set(attendanceToday.map((a) => a.teacherId));

  const allTeachers = await prisma.teacher.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true },
  });

  const teachersNotChecked = allTeachers
    .filter((t) => !checkedTeacherIds.has(t.id))
    .map((t) => ({
      teacherId: t.id,
      teacherName: `${t.firstName} ${t.lastName}`,
    }));

  return {
    frequentAbsentees,
    teachersNotCheckedToday: teachersNotChecked,
  };
}

// ========== Dashboard แบบรวม ==========
export async function getFullDashboard(params?: {
  academicYearId?: string;
  termId?: string;
  attendanceDays?: number;
}) {
  const { academicYearId, termId, attendanceDays = 7 } = params || {};

  const [
    overview,
    currentInfo,
    distribution,
    attendance,
    coreCompetency,
    assignments,
    teacherAssignments,
    enrollments,
    health,
    montessori,
    alerts,
  ] = await Promise.all([
    getOverviewStats(),
    getCurrentAcademicInfo(),
    getStudentDistribution(),
    getAttendanceStats(attendanceDays),
    getCoreCompetencyOverview(),
    getAssignmentStats(academicYearId, termId),
    getTeacherAssignmentStats(academicYearId, termId),
    getEnrollmentStats(academicYearId, termId),
    getStudentHealthStats(),
    getMontessoriStats(),
    getAlerts(),
  ]);

  return {
    overview,
    currentAcademicInfo: currentInfo,
    studentDistribution: distribution,
    attendance,
    coreCompetency,
    assignments,
    teacherAssignments,
    enrollments,
    health,
    montessori,
    alerts,
    generatedAt: new Date(),
  };
}
