import { z } from "zod";
import { hash as h } from "bcrypt";

const bodySchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  role: z.enum(["subscriber", "author"]),
});

export default defineEventHandler(async (event) => {
  try {
    const { name, email, password, role } = await readValidatedBody(
      event,
      bodySchema.parse,
    );

    const existing = await useDrizzle()
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, email));

    if (existing.length > 0) {
      return {
        success: false,
        message: "Email already in use.",
      };
    }

    const hashedPassword = await h(password, 12);

    const [newUser] = await useDrizzle()
      .insert(tables.users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: role ?? "subscriber",
        createdAt: new Date(),
      })
      .returning();

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  } catch (error: any) {}
});
