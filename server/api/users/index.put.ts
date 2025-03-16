import { z } from "zod";
import path from "path";
import { promises as fs } from "fs";

const bodySchema = z.object({
  userId: z.string().min(1, "Id can't be empty."),
  name: z.string().optional(),
  avatarPath: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const contentType = event.node.req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      throw new Error("Please send multipart/form-data!");
    }

    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw new Error("No form data provided.");
    }

    const formDataValues: Record<string, any> = {};
    let avatarFileName: string | null = null;

    if (!formData) {
      throw new Error("No form data provided.");
    }

    for (const field of formData) {
      if (!field.name) continue;

      if (field.name === "avatar") {
        const extension = path.extname(field.filename || "");
        avatarFileName = `user-${Date.now()}${extension}`;
        const destinationPath = path.resolve(
          "./public/avatars/",
          avatarFileName,
        );
        await fs.writeFile(destinationPath, field.data);

        formDataValues.avatarPath = avatarFileName;
      } else {
        formDataValues[field.name] = field.data.toString();
      }
    }

    const profile = bodySchema.parse(formDataValues);

    const [updatedUser] = await useDrizzle()
      .update(tables.users)
      .set({
        name: profile.name ?? undefined,
        avatarPath: profile.avatarPath ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(tables.users.id, profile.userId))
      .returning({
        id: tables.users.id,
        name: tables.users.name,
        email: tables.users.email,
        avatarPath: tables.users.avatarPath,
        role: tables.users.role,
        createdAt: tables.users.createdAt,
      });
    await setUserSession(event, {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarPath: updatedUser.avatarPath,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });

    return {
      success: true,
      updated: updatedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user.",
    };
  }
});
