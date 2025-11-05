import type { Context } from "elysia";

export const requirePermission = (permissions: string[]) => {
  return async ({ set, cookie, jwt }: Context & { user?: any }) => {
    const token = cookie.token?.value;
    const user = await jwt.verify(token);
    if (
      !user ||
      !user.role ||
      !permissions.some((p) => user.role.includes(p))
    ) {
      set.status = 403;
      return { error: "Forbidden: insufficient permission" };
    }
  };
};
