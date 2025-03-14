import { ilike } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const query = querySchema.parse(getQuery(event));
    const q = query.q;
    // console.log("Search query:", q);

    const queryBuilder = useDrizzle()
      .select({
        title: tables.movies.title,
        slug: tables.movies.slug,
        synopsis: tables.movies.synopsis,
        releaseDate: tables.movies.releaseDate,
        averageRating: tables.movies.averageRating,
        posterPath: tables.movies.posterPath,
      })
      .from(tables.movies);

    if (q && q.trim().length > 0) {
      queryBuilder.where(
        or(
          ilike(tables.movies.title, `%${q}%`),
          ilike(tables.movies.synopsis, `%${q}%`),
        ),
      );
    }

    const result = await queryBuilder;
    // console.log("Query result:", result);

    if (!result || result.length === 0) {
      return {
        success: false,
        message: q ? `Cannot find movies: ${q}` : "No movies found.",
      };
    }

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    console.error("Error during movies search:", error);
    return {
      success: false,
      message: "Something went wrong during movies search.",
    };
  }
});
