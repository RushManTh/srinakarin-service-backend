import type { Context } from "elysia";

// รับฟังก์ชัน getTeacherIdsFromResource เพื่อดึง teacherId ที่เกี่ยวข้องกับ resource นั้น ๆ
export const requireTeacherResource = (
  getTeacherIdsFromResource: (
    ctx: Context & { user?: any }
  ) => Promise<number[]> | number[]
) => {
  return async (ctx: Context & { user?: any }) => {
    const token = ctx.cookie.token?.value;
    const user = await ctx.jwt.verify(token);

    console.log(user);

    if (!user || user.role !== "teacher") {
      ctx.set.status = 403;
      return { error: "Forbidden: Only teacher can access" };
    }
    const teacherIds = await getTeacherIdsFromResource(user);
    if (!teacherIds.includes(user.userRoleId)) {
      ctx.set.status = 403;
      return { error: "Forbidden: Not your resource" };
    }
  };
};
