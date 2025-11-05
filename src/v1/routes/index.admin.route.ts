import { Elysia } from "elysia";
import { academicYearRoutes } from "./admin/academicYear.route";
import { classroomRoutes } from "./admin/classroom.route";
import { competencyRoutes } from "./admin/competency.route";
import { enrollmentRoutes } from "./admin/enrollment.route";
import { learningAreaRoutes } from "./admin/learningArea.route";
import { levelRoutes } from "./admin/level.route";
import { programEducationRoutes } from "./admin/programEducation.route";
import { studentRoutes } from "./admin/student.route";
import { subjectTypeRoutes } from "./admin/subjectType.route";
import { teacherRoutes } from "./admin/teacher.route";
import { termRoutes } from "./admin/term.route";
import { studentLevelRoutes } from "./admin/studentLevel.route";
import { requirePermission } from "../middleware/requirePermission";
import { studentHealthRoutes } from "./admin/studentHealth.route";
import { siblingRoutes } from "./admin/sibling.route";
import { curriculumRoutes } from "./admin/curriculum.route";
import { subjectGroupRoutes } from "./admin/subjectGroup.route";
import { curriculumSubjectRoutes } from "./admin/curriculumSubject.route";
import { schoolSubjectRoutes } from "./admin/schoolSubject.route";
import { teacherAssignmentRoutes } from "./admin/teacherAssignment.route";
import { assignmentRoutes } from "./admin/assignment.route";
import { assignmentScoreRoutes } from "./admin/assignmentScore.route";
import { assignmentScoreAttemptRoutes } from "./admin/assignmentScoreAttempt.route";
import { assignmentScoreFileRoutes } from "./admin/assignmentScoreFile.route";
import { assignmentCompetencyRoutes } from "./admin/assignmentCompetency.route";
import { montessoriCategoryRoutes } from "./admin/montessoriCategory.route";
import { montessoriSubcategoryRoutes } from "./admin/montessoriSubcategory.route";
import { montessoriTopicRoutes } from "./admin/montessoriTopic.route";
import { montessoriActivityRoutes } from "./admin/montessoriActivity.route";
import { montessoriActivityLearnedRoutes } from "./admin/montessoriActivityLearned.route";

export const indexAdminRoutes = new Elysia({ prefix: "/admin" }).guard(
  { beforeHandle: requirePermission(["admin"]) },
  (app) =>
    app
      .use(academicYearRoutes)
      .use(classroomRoutes)
      .use(competencyRoutes)
      .use(enrollmentRoutes)
      .use(learningAreaRoutes)
      .use(levelRoutes)
      .use(programEducationRoutes)
      .use(studentLevelRoutes)
      .use(studentRoutes)
      .use(subjectTypeRoutes)
      .use(teacherRoutes)
      .use(termRoutes)
      .use(studentHealthRoutes)
      .use(siblingRoutes)
      .use(curriculumRoutes)
      .use(subjectGroupRoutes)
      .use(curriculumSubjectRoutes)
      .use(schoolSubjectRoutes)
      .use(teacherAssignmentRoutes)
      .use(assignmentRoutes)
      .use(assignmentScoreRoutes)
      .use(assignmentScoreAttemptRoutes)
      .use(assignmentScoreFileRoutes)
      .use(assignmentCompetencyRoutes)
      .use(montessoriCategoryRoutes)
      .use(montessoriSubcategoryRoutes)
      .use(montessoriTopicRoutes)
      .use(montessoriActivityRoutes)
      .use(montessoriActivityLearnedRoutes)
);
