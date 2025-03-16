import { z } from "zod";

const bodySchema = z.object({
  id: z.string().uuid("Invalid user Id."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readValidatedBody(event, bodySchema.parse);

    const deletedData = await useDrizzle()
      .delete(tables.users)
      .where(eq(tables.users.id, id))
      .returning({ deletedId: tables.users.id });

    return {
      success: true,
      deltedUsersId: deletedData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during deletion.",
    };
  }
});
