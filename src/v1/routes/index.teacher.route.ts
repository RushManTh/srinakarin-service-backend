import { Elysia } from "elysia";
import { academicYearRoutes } from "./teacher/academicYear.route";
import { classroomRoutes } from "./teacher/classroom.route";
import { competencyRoutes } from "./teacher/competency.route";
import { enrollmentRoutes } from "./teacher/enrollment.route";
import { learningAreaRoutes } from "./teacher/learningArea.route";
import { levelRoutes } from "./teacher/level.route";
import { programEducationRoutes } from "./teacher/programEducation.route";
import { scoreRoutes } from "./teacher/score.route";
import { scoreFileRoutes } from "./teacher/scoreFile.route";
import { studentRoutes } from "./teacher/student.route";
import { subjectRoutes } from "./teacher/subject.route";
import { subjectIndicatorRoutes } from "./teacher/subjectIndicator.route";
import { subjectTypeRoutes } from "./teacher/subjectType.route";
import { teacherRoutes } from "./teacher/teacher.route";
import { termRoutes } from "./teacher/term.route";
import { requirePermission } from "../middleware/requirePermission";
import { teacherAssignmentRoutes } from "./teacher/teacherAssignment.route";
import { assignmentCompetencyRoutes } from "./teacher/assignmentCompetency.route";
import { assignmentScoreRoutes } from "./teacher/assignmentScore.route";
import { assignmentScoreAttemptRoutes } from "./teacher/assignmentScoreAttempt.route";
import { assignmentScoreFileRoutes } from "./teacher/assignmentScoreFile.route";
import { attendanceRoutes } from "./teacher/attendance.route";
import { montessoriLearnedRoutes } from "./teacher/montessoriActivityLearned.route";
import { montessoriRoutes } from "./teacher/montessori.route";

export const indexTeacherRoutes = new Elysia({ prefix: "/teacher" }).guard(
  { beforeHandle: requirePermission(["teacher"]) },
  (app) =>
    app
      .use(academicYearRoutes)
      .use(classroomRoutes)
      .use(competencyRoutes)
      .use(enrollmentRoutes)
      .use(learningAreaRoutes)
      .use(levelRoutes)
      .use(programEducationRoutes)
      .use(scoreRoutes)
      .use(scoreFileRoutes)
      .use(studentRoutes)
      .use(subjectRoutes)
      .use(subjectIndicatorRoutes)
      .use(subjectTypeRoutes)
      .use(teacherRoutes)
      .use(termRoutes)
      .use(teacherAssignmentRoutes)
      .use(assignmentCompetencyRoutes)
      .use(assignmentScoreRoutes)
      .use(assignmentScoreAttemptRoutes)
      .use(assignmentScoreFileRoutes)
      .use(attendanceRoutes)
      .use(montessoriLearnedRoutes)
      .use(montessoriRoutes)
);
