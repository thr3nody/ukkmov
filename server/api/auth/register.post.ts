import { z } from "zod"
import { hash as h, } from "bcrypt"

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  try {
    const {name, email, password} = await readValidatedBody(event, bodySchema.parse)
    if ( !name || !email || !password) {
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

    if (!password || password.length < 8) {
      throw createError({
        statusCode: 500,
        statusMessage: "Password must be minimum of 8 characters.",
      }); 
    }

    return {
      success: true,
      user: result[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during registration.",
    };
  }
})
