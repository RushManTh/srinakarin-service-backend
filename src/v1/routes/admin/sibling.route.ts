import { Elysia, t } from "elysia";
import {
  listSiblingsController,
  getSiblingByIdController,
  createSiblingController,
  updateSiblingController,
  deleteSiblingController,
  createManySiblingsController,
  updateManySiblingsController,
  deleteManySiblingsController,
} from "../../controllers/admin/sibling.controller";

export const siblingRoutes = new Elysia({ prefix: "/siblings" })
  .get("/", listSiblingsController, {
    query: t.Object({ studentId: t.String() }),
    tags: ["Sibling (AdminRoutes)"],
    summary: "รายชื่อพี่น้องของนักเรียน",
  })
  .get("/:id", getSiblingByIdController, {
    params: t.Object({ id: t.String() }),
    tags: ["Sibling (AdminRoutes)"],
    summary: "ดูข้อมูลพี่น้องรายคน",
  })
  .post("/create", createSiblingController, {
    body: t.Object({
      studentId: t.String(),
      firstName: t.String(),
      lastName: t.String(),
      status: t.String(), // SiblingStatus enum
      schoolName: t.Optional(t.String()),
    }),
    tags: ["Sibling (AdminRoutes)"],
    summary: "เพิ่มพี่น้อง",
  })
  .post("/create", createManySiblingsController, {
    body: t.Array(
      t.Object({
        studentId: t.String(),
        firstName: t.String(),
        lastName: t.String(),
        status: t.String(),
        schoolName: t.Optional(t.String()),
      })
    ),
    tags: ["Sibling (AdminRoutes)"],
    summary: "เพิ่มพี่น้องหลายคน",
  })
  .patch("/update/:id", updateSiblingController, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      firstName: t.Optional(t.String()),
      lastName: t.Optional(t.String()),
      status: t.Optional(t.String()),
      schoolName: t.Optional(t.String()),
    }),
    tags: ["Sibling (AdminRoutes)"],
    summary: "แก้ไขข้อมูลพี่น้อง",
  })
  .patch("/update", updateManySiblingsController, {
    body: t.Array(
      t.Object({
        id: t.String(),
        data: t.Object({
          firstName: t.Optional(t.String()),
          lastName: t.Optional(t.String()),
          status: t.Optional(t.String()),
          schoolName: t.Optional(t.String()),
        }),
      })
    ),
    tags: ["Sibling (AdminRoutes)"],
    summary: "แก้ไขข้อมูลพี่น้องหลายคน",
  })
  .delete("/delete/:id", deleteSiblingController, {
    params: t.Object({ id: t.String() }),
    tags: ["Sibling (AdminRoutes)"],
    summary: "ลบพี่น้อง",
  })
  .delete("/delete", deleteManySiblingsController, {
    body: t.Array(t.String()),
    tags: ["Sibling (AdminRoutes)"],
    summary: "ลบพี่น้องหลายคน",
  });
