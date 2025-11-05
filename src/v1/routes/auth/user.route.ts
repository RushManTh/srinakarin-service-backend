import { Elysia, t } from "elysia";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  getUserListController,
} from "../../controllers/auth/user.controller";

export const userRoutes = new Elysia({ prefix: "/users" })
  .post("/register", registerUserController, {
    tags: ["Auth"],
    summary: "ลงทะเบียนผู้ใช้งาน",
  })
  .post("/login", loginUserController, {
    tags: ["Auth"],
    summary: "เข้าสู่ระบบ",
  })
  .post("/logout", logoutUserController, {
    tags: ["Auth"],
    summary: "ออกจากระบบ",
  })
  .get("/me", getMeController, {
    tags: ["Auth"],
    summary: "ดูข้อมูลผู้ใช้ที่ล็อกอิน (me)",
  })
  .get("/list", getUserListController, {
    tags: ["Auth"],
    summary: "ดูข้อมูลผู้ใช้งานทั้งหมด",
  });
