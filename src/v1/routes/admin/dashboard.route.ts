import { Elysia, t } from "elysia";
import {
  getDashboard,
  getOverview,
  getCurrentAcademic,
  getDistribution,
  getAttendance,
  getCoreCompetency,
  getAssignments,
  getTeacherAssignments,
  getEnrollments,
  getHealth,
  getMontessori,
  getAlertsList,
} from "../../controllers/admin/dashboard.controller";

export const dashboardRoute = new Elysia({
  prefix: "/dashboard",
})
  .get("/", getDashboard, {
    query: t.Object({
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
      attendanceDays: t.Optional(t.Numeric()),
    }),
    tags: ["Dashboard (AdminRoutes)"],
    summary: "ดึงข้อมูล Dashboard ทั้งหมด",
    description: "ดึงข้อมูลสถิติและภาพรวมทั้งหมดสำหรับ Admin Dashboard",
  })
  .get("/overview", getOverview, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "ภาพรวมสถิติหลัก",
    description: "จำนวนนักเรียน/ครู/ห้องเรียน/วิชา",
  })
  .get("/current-academic", getCurrentAcademic, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "ข้อมูลปีการศึกษาและภาคการศึกษาปัจจุบัน",
  })
  .get("/distribution", getDistribution, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "การกระจายตัวนักเรียน",
    description: "แยกตามระดับชั้น/ห้อง/หลักสูตร",
  })
  .get("/attendance", getAttendance, {
    query: t.Object({
      days: t.Optional(t.Numeric()),
    }),
    tags: ["Dashboard (AdminRoutes)"],
    summary: "สถิติการเข้าเรียน",
    description: "อัตราการเข้าเรียนย้อนหลัง N วัน (default: 7)",
  })
  .get("/core-competency", getCoreCompetency, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "ภาพรวมสมรรถนะหลัก",
    description: "คะแนนเฉลี่ยและการกระจายระดับของแต่ละสมรรถนะหลัก",
  })
  .get("/assignments", getAssignments, {
    query: t.Object({
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
    }),
    tags: ["Dashboard (AdminRoutes)"],
    summary: "สถิติชิ้นงาน/Assignment",
    description: "จำนวนชิ้นงาน/รอตรวจ/อัตราการส่งงาน",
  })
  .get("/teacher-assignments", getTeacherAssignments, {
    query: t.Object({
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
    }),
    tags: ["Dashboard (AdminRoutes)"],
    summary: "สถิติการมอบหมายงานครู",
    description: "ครูที่สอนมากที่สุด/วิชาที่ไม่มีครู",
  })
  .get("/enrollments", getEnrollments, {
    query: t.Object({
      academicYearId: t.Optional(t.String()),
      termId: t.Optional(t.String()),
    }),
    tags: ["Dashboard (AdminRoutes)"],
    summary: "สถิติการลงทะเบียนเรียน",
    description: "นักเรียนที่ยังไม่ได้ลงทะเบียน/วิชายอดนิยม",
  })
  .get("/health", getHealth, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "สถิติสุขภาพนักเรียน",
    description: "นักเรียนที่มีโรคประจำตัว/ความพิการ",
  })
  .get("/montessori", getMontessori, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "สถิติ Montessori",
    description: "จำนวน Activity/อัตราการเรียนรู้/นักเรียน Top 5",
  })
  .get("/alerts", getAlertsList, {
    tags: ["Dashboard (AdminRoutes)"],
    summary: "การแจ้งเตือน/Alerts",
    description: "นักเรียนที่ขาดเรียนบ่อย/ครูที่ยังไม่เช็คชื่อ",
  });
