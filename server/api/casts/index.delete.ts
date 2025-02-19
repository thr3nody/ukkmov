import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "ID cannot be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readValidatedBody(event, bodySchema.parse);

    const deletedData = await useDrizzle()
      .delete(tables.casts)
      .where(eq(tables.casts.id, id))
      .returning({
        deleteId: tables.casts.id,
      });

    return {
      success: true,
      deletedCastId: deletedData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during deletion.",
    };
  }
});
