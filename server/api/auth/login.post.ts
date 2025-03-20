import { z } from "zod";
import { compare as c } from "bcrypt";

const bodySchema = z.object({
  email: z.string().email("Please enter valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    try {
      const result = bodySchema.safeParse(body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        return {
          success: false,
          message: firstError.message,
        };
      }

      const { email, password } = body;

      const users = await useDrizzle()
        .select()
        .from(tables.users)
        .where(eq(tables.users.email, email))
        .execute();

      if (!users || users.length === 0) {
        throw createError({
          statusCode: 401,
          message: "Email doesn't exist, please use a valid email or register.",
        });
      }

      const user = users[0];

      const isPasswordValid = await c(password, user.password);
      if (!isPasswordValid) {
        throw createError({
          statusCode: 401,
          message: "Password is incorrect, try again.",
        });
      }

      await setUserSession(event, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarPath: user.avatarPath,
          createdAt: user.createdAt,
        },
      });

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarPath: user.avatarPath,
          createdAt: user.createdAt,
        },
      };
    } catch (zodError: any) {
      return {
        success: false,
        message: zodError.message || "Validation failed",
      };
    }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        success: false,
        message: error.errors[0].message || "Validation failed",
      };
    }

    return {
      success: false,
      message: error.message || "An error occurred during movie creation.",
    };
  }
});
