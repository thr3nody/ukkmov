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
    let avatarBuffer: Buffer | null = null;
    let newAvatarFileName: string | null = null;

    if (!formData) {
      throw new Error("No form data provided.");
    }

    for (const field of formData) {
      if (!field.name) continue;

      if (field.name === "avatar") {
        const extension = path.extname(field.filename || "");
        newAvatarFileName = `user-${Date.now()}${extension}`;

        avatarBuffer = field.data;
      } else {
        formDataValues[field.name] = field.data.toString();
      }
    }

    const profile = bodySchema.parse(formDataValues);

    const [oldUser] = await useDrizzle()
      .select({
        avatarPath: tables.users.avatarPath,
      })
      .from(tables.users)
      .where(eq(tables.users.id, profile.userId))
      .execute();

    if (!oldUser) {
      throw new Error("User not found.");
    }

    if (newAvatarFileName && oldUser.avatarPath) {
      const oldPath = path.resolve("./public/avatars/", oldUser.avatarPath);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn("Could not remove old avatar:", err);
      }
    }

    if (newAvatarFileName && avatarBuffer) {
      const destinationPath = path.resolve(
        "./public/avatars/",
        newAvatarFileName,
      );
      await fs.writeFile(destinationPath, avatarBuffer);
      profile.avatarPath = newAvatarFileName;
    }

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
