import { prisma } from "../../models/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";

export async function registerUser(email: string, password: string) {
  if (!email || !password) throw new Error("Email and password are required");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already exists");
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
  // return only safe fields
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) throw new Error("Email and password are required");
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      teacher: true,
      admin: true,
    },
  });
  if (!user) throw new Error("Invalid email or password");
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  let userRoleId = "";
  let role = "user";
  if (user.teacher) {
    role = "teacher";
    userRoleId = user.teacher.id;
  } else if (user.admin) {
    role = "admin";
    userRoleId = user.admin.id;
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    role,
    userRoleId,
  };
}

export async function getUserList() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });
}
