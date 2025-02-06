import { z } from "zod"
import { hash as h, } from "bcrypt"

const bodySchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
})

export default defineEventHandler(async (event) => {
  try {
    const {name, email, password} = await readValidatedBody(event, bodySchema.parse)
    if (!name || !email || !password) {
      throw createError({
        statusCode: 500,
        statusMessage: "Missing credential."
      })
    }

    const hashedPassword = await h(password, 12)

    const result = await useDrizzle().insert(tables.users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
      })
      .returning()

    if (!result || result.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "User registration failed.",
      }); 
    }

    const newUser = result[0]
    await setUserSession(event, {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during registration.",
    };
  }
})
