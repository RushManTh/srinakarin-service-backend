import { Elysia, t } from "elysia";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Ensure public directory exists
const publicDir = path.join(process.cwd(), "public");
if (!existsSync(publicDir)) {
  await mkdir(publicDir, { recursive: true });
}

export const fileRoutes = new Elysia({ prefix: "/files" })
  .post(
    "/upload",
    async ({ body }) => {
      try {
        const file = body.file;
        const { type, id, typefile } = body;
        if (!file) throw new Error("No file uploaded");

        // Sanitize path segments
        const sanitize = (s: string) => {
          if (typeof s !== "string" || !/^[A-Za-z0-9_-]+$/.test(s))
            throw new Error("Invalid path segment");
          return s;
        };
        const safeType = sanitize(type);
        const safeId = sanitize(id);
        const safeTypefile = sanitize(typefile);

        // Validate extension
        const ext = path.extname(file.name).toLowerCase();
        const allowedExtensions = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".pdf",
        ];
        if (!allowedExtensions.includes(ext)) {
          throw new Error("Invalid file type. Only images are allowed.");
        }

        // Prepare target directory: public/uploads/<type>/<id>/<typefile>
        const uploadsRoot = path.join(publicDir, "uploads");
        const targetDir = path.join(
          uploadsRoot,
          safeType,
          safeId,
          safeTypefile
        );
        if (!existsSync(targetDir)) {
          await mkdir(targetDir, { recursive: true });
        }

        // Generate unique filename and final path
        const filename = `${randomUUID()}${ext}`;
        const filePath = path.join(targetDir, filename);

        // Save file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await writeFile(filePath, buffer);

        // Build accessible URL via this router
        const url = `/uploads/${safeType}/${safeId}/${safeTypefile}/${filename}`;

        return {
          success: true,
          fileType: file.type,
          url,
          filename,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        };
      }
    },
    {
      body: t.Object({
        file: t.File({
          type: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
          ],
          maxSize: "5m", // Max 5MB
        }),
        type: t.String(),
        id: t.String(),
        typefile: t.String(),
      }),
      detail: {
        summary: "Upload image file",
        tags: ["Upload"],
      },
    }
  )
  .get(
    "/file/:filename",
    async ({ params: { filename } }) => {
      try {
        const filePath = path.join(publicDir, filename);
        const file = Bun.file(filePath);
        const exists = await file.exists();

        if (!exists) {
          return new Response("Image not found", { status: 404 });
        }

        // Get file type from extension
        const ext = path.extname(filename).toLowerCase();
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
            "Cache-Control": "public, max-age=31536000", // Cache for 1 year
          },
        });
      } catch (error) {
        return new Response("Error loading image", { status: 500 });
      }
    },
    {
      detail: {
        summary: "Get image by filename",
        tags: ["Upload"],
      },
    }
  )
  .get(
    "/uploads/:type/:id/:typefile/:filename",
    async ({ params }) => {
      try {
        const { type, id, typefile, filename } = params as Record<
          string,
          string
        >;

        // Sanitize path segments
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
            "Cache-Control": "public, max-age=31536000",
          },
        });
      } catch (error) {
        return new Response("Error loading file", { status: 500 });
      }
    },
    {
      detail: {
        summary: "Get uploaded file by nested path",
        tags: ["Upload"],
      },
    }
  )
  .post(
    "/delete-file",
    async ({ body }) => {
      const { fileUrl } = body;
      if (!fileUrl || typeof fileUrl !== "string") {
        return { success: false, message: "Invalid fileUrl" };
      }

      // Allow absolute URL; extract pathname if needed
      let urlPath = fileUrl.trim();
      try {
        if (/^https?:\/\//i.test(urlPath)) {
          const u = new URL(urlPath);
          urlPath = u.pathname;
        }
      } catch {
        // ignore parse errors and proceed with raw string
      }

      // Determine prefix and extract target path
      const prefixes = [
        "/api/v1/files/uploads/",
        "/uploads/",
        "/api/v1/images/",
      ];
      let matchedPrefix = "";
      for (const p of prefixes) {
        const i = urlPath.indexOf(p);
        if (i !== -1) {
          matchedPrefix = p;
          urlPath = urlPath.slice(i + p.length);
          break;
        }
      }
      if (!matchedPrefix) {
        return { success: false, message: "URL is not a supported files path" };
      }

      const decoded = decodeURIComponent(urlPath);
      let targetPath = decoded;

      // Validate extension to match allowed upload types
      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".pdf",
      ];
      const ext = path.extname(targetPath).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return { success: false, message: "Disallowed file type" };
      }

      let filePath = "";
      if (matchedPrefix.includes("/images/")) {
        const filename = path.basename(targetPath);
        filePath = path.join(publicDir, filename);
      } else {
        // uploads path may contain nested directories; normalize it
        const safeRel = targetPath
          .split("/")
          .filter((seg) => seg && /^[A-Za-z0-9._-]+$/.test(seg))
          .join(path.sep);
        filePath = path.join(publicDir, "uploads", safeRel);
      }

      try {
        if (!existsSync(filePath)) {
          return { success: false, message: "File not found" };
        }

        await unlink(filePath);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Deletion failed",
        };
      }
    },
    {
      body: t.Object({
        fileUrl: t.String(),
      }),
      detail: {
        summary: "Delete file by URL",
        tags: ["Upload"],
      },
    }
  );
