import { ilike } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  userId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  try {
    const { userId } = querySchema.parse(getQuery(event));

    const result = await useDrizzle()
      .select({
        rating: tables.reviews.rating,
        comment: tables.reviews.comment,
        userId: tables.reviews.userId,
        movieId: tables.reviews.movieId,
        movies: {
          id: tables.movies.id,
          title: tables.movies.title,
          slug: tables.movies.slug,
          posterPath: tables.movies.posterPath,
        },
      })
      .from(tables.reviews)
      .where(eq(tables.reviews.userId, userId))
      .leftJoin(tables.movies, eq(tables.reviews.movieId, tables.movies.id));

    if (!result.length) {
      return {
        success: false,
        message: userId ? `Cannot find movies: ${userId}` : "No movies found.",
      };
    }

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    console.error("Error while fetching review history:", error);
    return {
      success: false,
      message: "Something went wrong while fetching review history.",
    };
  }
});
