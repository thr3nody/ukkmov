import { z } from "zod";

const bodySchema = z.object({
  userId: z.string().min(1, "User ID can't be empty."),
  movieId: z.number().min(1, "Movie ID can't be empty."),
  rating: z.preprocess((val) => String(val), z.enum(["1", "2", "3", "4", "5"])),
  comment: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const review = await readValidatedBody(event, bodySchema.parse);
    const now = new Date();

    const result = await useDrizzle()
      .insert(tables.reviews)
      .values({
        userId: review.userId,
        movieId: review.movieId,
        rating: review.rating,
        comment: review.comment,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: [tables.reviews.userId, tables.reviews.movieId],
        set: {
          rating: review.rating,
          comment: review.comment,
          updatedAt: now,
        },
      })
      .returning();

    return {
      success: true,
      result: result[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred genres creation.",
    };
  }
});
