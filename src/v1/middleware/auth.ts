import { Context } from "elysia";
import { prisma } from "../models/prisma";

export const auth = async ({ set, jwt, cookie, store }: Context) => {
  const token = cookie.token?.value;
  if (!token) {
    set.status = 401;
    return { error: "Unauthorized: No token provided" };
  }
  const payload = await jwt.verify(token);

  if (!payload) {
    set.status = 401;
    return { error: "Unauthorized: Invalid token" };
  }

  const checkIdUser = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true },
  });

  if (!checkIdUser) {
    set.status = 401;
    return { error: "Unauthorized: Invalid userId" };
  }

  (
    store as {
      user: {
        id: string;
        email: string;
        role: string;
        userRoleId: string;
      };
    }
  ).user = { ...payload };
};
