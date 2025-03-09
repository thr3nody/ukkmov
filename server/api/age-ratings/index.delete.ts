import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number can't be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readValidatedBody(event, bodySchema.parse);

    const deletedData = await useDrizzle()
      .delete(tables.ageRatings)
      .where(eq(tables.ageRatings.id, id))
      .returning({ deletedId: tables.ageRatings.id });

    return {
      success: true,
      deltedAgeRatingsId: deletedData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during deletion.",
    };
  }
});
