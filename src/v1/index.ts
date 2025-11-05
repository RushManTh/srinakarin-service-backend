import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { auth } from "./middleware/auth";
import { userRoutes } from "./routes/auth/user.route";
import { indexAdminRoutes } from "./routes/index.admin.route";
import { indexTeacherRoutes } from "./routes/index.teacher.route";
import { fileRoutes } from "./routes/file/file.route";

const JWT_SECRET = process.env.JWT_SECRET || "dsjfksnbskbvbsvksbvsk";

export const v1App = new Elysia({ prefix: "/api/v1" })
  .guard({ beforeHandle: auth }, (app) =>
    app
      .use(jwt({ secret: JWT_SECRET, exp: "7d" }))
      .use(cookie())
      .state("user", "")
      .use(indexAdminRoutes)
      .use(indexTeacherRoutes)
  )
  .use(fileRoutes)
  .use(userRoutes);
