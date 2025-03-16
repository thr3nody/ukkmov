import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Id can't be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readValidatedBody(event, bodySchema.parse);

    const deletedData = await useDrizzle()
      .delete(tables.reviews)
      .where(eq(tables.reviews.id, id))
      .returning({ deletedId: tables.reviews.id });

    return {
      success: true,
      deltedReviewsId: deletedData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during deletion.",
    };
  }
});
