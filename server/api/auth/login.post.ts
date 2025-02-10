import { z } from "zod"
import { compare as c } from "bcrypt"

const bodySchema = z.object({
  email: z.string().email("Please enter valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const users = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .execute()

  if (!users || users.length === 0) {
    throw createError({
      statusCode: 401,
      message: "Bad credentials."
    })
  }

  const user = users[0]

  const isPasswordValid = await c(password, user.password);
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      message: "Bad credentials",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  });

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  }
})