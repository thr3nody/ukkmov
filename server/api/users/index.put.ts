import { z } from "zod";
import { hash as h } from "bcrypt";

const bodySchema = z.object({
  id: z.string().uuid("Invalid user Id."),
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter valid email.").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .optional()
    .or(z.literal("")),
  role: z.enum(["subscriber", "author"]).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const { id, name, email, password, role } = await readValidatedBody(
      event,
      bodySchema.parse,
    );

    const [oldUser] = await useDrizzle()
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, id));

    if (!oldUser) {
      return {
        success: false,
        message: `No user found with ID ${id}.`,
      };
    }

    const updateData: Partial<typeof tables.users.$inferInsert> = {
      name,
      updatedAt: new Date(),
    };

    if (email && email !== oldUser.email) {
      const [existing] = await useDrizzle()
        .select()
        .from(tables.users)
        .where(eq(tables.users.email, email));
      if (existing && existing.id !== id) {
        return {
          success: false,
          message: "Email already in use.",
        };
      }
      updateData.email = email;
    }

    if (password === "" || password === undefined) {
      console.log("Not changing the password.");
    } else {
      const hashedPassword = await h(password, 12);
      updateData.password = hashedPassword;
    }

    if (role && role !== oldUser.role) {
      updateData.role = role;
    }

    const [updatedRecord] = await useDrizzle()
      .update(tables.users)
      .set(updateData)
      .where(eq(tables.users.id, id))
      .returning();

    if (!updatedRecord) {
      return {
        success: false,
        message: `No user found with ID ${id}.`,
      };
    }

    return {
      success: true,
      updated: updatedRecord,
    };
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    return {
      success: false,
      message: error.message || "Error occured when updating data.",
    };
  }
});
