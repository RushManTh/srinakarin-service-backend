import type { Context } from "elysia";
import {
  registerUser,
  loginUser,
  getUserList,
} from "../../services/auth/user.service";
import { prisma } from "../../models/prisma";

export const registerUserController = async (ctx: Context) => {
  try {
    const { email, password } = await ctx.request.json();
    const user = await registerUser(email, password);
    ctx.set.status = 201;
    return { ...user, message: "User created successfully" };
  } catch (e: unknown) {
    ctx.set.status = 400;
    return { error: (e as Error).message };
  }
};

export const loginUserController = async (ctx: Context) => {
  try {
    const { email, password } = await ctx.request.json();
    const user = await loginUser(email, password);

    // sign JWT token
    const authToken = await ctx.jwt.sign({
      id: String(user.id),
      email: String(user.email),
      role: String(user.role),
      userRoleId: String(user.userRoleId),
    });

    ctx.cookie.token.set({
      value: authToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? ".beachforlife.org"
          : "localhost",
      path: "/",
      maxAge: 7 * 86400, // 7 days
    });

    ctx.set.status = 200;
    return { ...user, message: "User logged in successfully" };
  } catch (e: unknown) {
    ctx.set.status = 401;
    return { error: (e as Error).message };
  }
};

export const logoutUserController = async (ctx: Context) => {
  ctx.cookie.token.set({
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain:
      process.env.NODE_ENV === "production" ? ".beachforlife.org" : "localhost",
    path: "/",
    expires: new Date(0),
  });
  ctx.set.status = 200;
  return { message: "Logged out successfully" };
};

export const getMeController = async (ctx: Context) => {
  try {
    const authToken = ctx.cookie.token.value;
    const user = await ctx.jwt.verify(authToken);
    if (!user) {
      ctx.set.status = 401;
      return { error: "Unauthorized" };
    }
    let profile = null;
    if (user.role === "teacher") {
      profile = await prisma.teacher.findUnique({
        where: { id: user.userRoleId },
        select: {
          id: true,
          prefix: true,
          firstName: true,
          lastName: true,
          firstNameEn: true,
          lastNameEn: true,
          phone: true,
          birthDate: true,
          address: true,
          education: true,
          experienceYears: true,
          profileImage: true,
          department: true,
          position: true,
          isActive: true,
          note: true,
        },
      });
    } else if (user.role === "admin") {
      profile = await prisma.admin.findUnique({
        where: { id: user.userRoleId },
        select: {
          id: true,
          employeeCode: true,
          role: true,
          level: true,
        },
      });
    }
    return { ...user, profile };
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};

export const getUserListController = async (ctx: Context) => {
  try {
    const userList = await getUserList();
    ctx.set.status = 200;
    return userList;
  } catch (e: any) {
    ctx.set.status = 400;
    return { error: e.message };
  }
};
