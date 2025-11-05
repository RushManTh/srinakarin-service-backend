import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { v1App } from "./v1";
import { swagger } from "@elysiajs/swagger";
import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
const publicDir = path.join(process.cwd(), "public");
if (!existsSync(publicDir)) {
  await mkdir(publicDir, { recursive: true });
}

const app = new Elysia()
  .use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URL
          : "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Set-Cookie"],
    })
  )
  .use(
    swagger({
      path: "/api/v1/docs",
      documentation: {
        info: {
          title: "Srinakarin School Management API",
          version: "1.0.0",
          description: "Srinakarin School Management API",
        },
        tags: [
          { name: "Auth", description: "การเข้าสู่ระบบ" },
          {
            name: "Student (AdminRoutes)",
            description: "การจัดการนักเรียน (สำหรับ Admin)",
          },
          {
            name: "Student (TeacherRoutes)",
            description: "การจัดการนักเรียน (สำหรับ Teacher)",
          },
          {
            name: "Teacher (AdminRoutes)",
            description: "การจัดการครู (สำหรับ Admin)",
          },
          {
            name: "Teacher (TeacherRoutes)",
            description: "การจัดการครู (สำหรับ Teacher)",
          },
          {
            name: "Classroom (AdminRoutes)",
            description: "การจัดการห้องเรียน (สำหรับ Admin)",
          },
          {
            name: "Classroom (TeacherRoutes)",
            description: "การจัดการห้องเรียน (สำหรับ Teacher)",
          },
          {
            name: "Subject (AdminRoutes)",
            description: "การจัดการวิชา (สำหรับ Admin)",
          },
          {
            name: "Subject (TeacherRoutes)",
            description: "การจัดการวิชา (สำหรับ Teacher)",
          },
          {
            name: "Competency (AdminRoutes)",
            description: "การจัดการสมรรถนะ (สำหรับ Admin)",
          },
          {
            name: "Competency (TeacherRoutes)",
            description: "การจัดการสมรรถนะ (สำหรับ Teacher)",
          },
          {
            name: "SubjectType (AdminRoutes)",
            description: "การจัดการประเภทวิชา (สำหรับ Admin)",
          },
          {
            name: "SubjectType (TeacherRoutes)",
            description: "การจัดการประเภทวิชา (สำหรับ Teacher)",
          },
          {
            name: "Level (AdminRoutes)",
            description: "การจัดการช่วงชั้น/ระดับ (สำหรับ Admin)",
          },
          {
            name: "Level (TeacherRoutes)",
            description: "การจัดการช่วงชั้น/ระดับ (สำหรับ Teacher)",
          },
          {
            name: "Enrollment (AdminRoutes)",
            description: "การจัดการการลงทะเบียน (สำหรับ Admin)",
          },
          {
            name: "Enrollment (TeacherRoutes)",
            description: "การจัดการการลงทะเบียน (สำหรับ Teacher)",
          },
          {
            name: "SubjectIndicator (AdminRoutes)",
            description: "การจัดการตัวชี้วัด (สำหรับ Admin)",
          },
          {
            name: "SubjectIndicator (TeacherRoutes)",
            description: "การจัดการตัวชี้วัด (สำหรับ Teacher)",
          },
          {
            name: "AcademicYear (AdminRoutes)",
            description: "การจัดการปีการศึกษา (สำหรับ Admin)",
          },
          {
            name: "AcademicYear (TeacherRoutes)",
            description: "การจัดการปีการศึกษา (สำหรับ Teacher)",
          },
          {
            name: "Term (AdminRoutes)",
            description: "การจัดการเทอม (สำหรับ Admin)",
          },
          {
            name: "Term (TeacherRoutes)",
            description: "การจัดการเทอม (สำหรับ Teacher)",
          },
          {
            name: "Score (AdminRoutes)",
            description: "การจัดการคะแนน (สำหรับ Admin)",
          },
          {
            name: "Score (TeacherRoutes)",
            description: "การจัดการคะแนน (สำหรับ Teacher)",
          },
          {
            name: "ScoreFile (AdminRoutes)",
            description: "การจัดการไฟล์แนบคะแนน (สำหรับ Admin)",
          },
          {
            name: "ScoreFile (TeacherRoutes)",
            description: "การจัดการไฟล์แนบคะแนน (สำหรับ Teacher)",
          },
          {
            name: "StudentLevel (AdminRoutes)",
            description: "การจัดการระดับชั้นของนักเรียน (สำหรับ Admin)",
          },
          {
            name: "ProgramEducation (AdminRoutes)",
            description: "การจัดการหลักสูตรการศึกษา (สำหรับ Admin)",
          },
          {
            name: "ProgramEducation (TeacherRoutes)",
            description: "การจัดการหลักสูตรการศึกษา (สำหรับ Teacher)",
          },
          {
            name: "LearningArea (AdminRoutes)",
            description: "การจัดการพื้นที่เรียนรู้ (สำหรับ Admin)",
          },
          {
            name: "LearningArea (TeacherRoutes)",
            description: "การจัดการพื้นที่เรียนรู้ (สำหรับ Teacher)",
          },
          {
            name: "SubjectAssignment (AdminRoutes)",
            description: "การจัดการมอบหมายวิชา (สำหรับ Admin)",
          },
          {
            name: "AssignmentScoreFile (AdminRoutes)",
            description: "การจัดการไฟล์แนบคะแนนการทำแบบทดสอบ (สำหรับ Admin)",
          },
          {
            name: "AssignmentScoreFile (TeacherRoutes)",
            description: "การจัดการไฟล์แนบคะแนนการทำแบบทดสอบ (สำหรับ Teacher)",
          },
        ],
      },
    })
  )
  .use(cookie())
  .use(v1App)
  // Serve uploads at root path for backward compatibility: /uploads/<type>/<id>/<typefile>/<filename>
  .get(
    "/uploads/:type/:id/:typefile/:filename",
    async ({ params }) => {
      try {
        const { type, id, typefile, filename } = params as Record<
          string,
          string
        >;
        const sanitize = (s: string) => {
          if (typeof s !== "string" || !/^[A-Za-z0-9_-]+$/.test(s))
            throw new Response("Invalid path segment", { status: 400 });
          return s;
        };
        const safeType = sanitize(type);
        const safeId = sanitize(id);
        const safeTypefile = sanitize(typefile);
        const safeFilename = path.basename(filename);

        const filePath = path.join(
          publicDir,
          "uploads",
          safeType,
          safeId,
          safeTypefile,
          safeFilename
        );
        const file = Bun.file(filePath);
        const exists = await file.exists();
        if (!exists) return new Response("File not found", { status: 404 });

        const ext = path.extname(safeFilename).toLowerCase();
        const contentType =
          {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".pdf": "application/pdf",
          }[ext] || "application/octet-stream";

        return new Response(file, {
          headers: {
            "Content-Type": contentType,
            // "Cache-Control": "public, max-age=31536000",
            "Cache-Control": "no-cache, private",
          },
        });
      } catch (error) {
        return new Response("Error loading file", { status: 500 });
      }
    },
    {
      detail: {
        summary: "Serve uploaded file at root uploads path",
        tags: ["Upload"],
      },
    }
  )
  .use((app) => {
    app.onRequest((ctx) => {
      const now = new Date().toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
      });
      console.log(`[${now} GMT+7] ${ctx.request.method} ${ctx.request.url}`);
    });
    return app;
  })
  .listen(3001);

console.log(
  `Srinakarin-Service is running at ${app.server?.hostname}:${app.server?.port}`
);
