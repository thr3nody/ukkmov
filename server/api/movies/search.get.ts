import { ilike } from "drizzle-orm";
import { z } from "zod";

const bodySchema = z.object({
  q: z.string().min(1, "Search field cannot be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const query = bodySchema.parse(getQuery(event));
    const { q } = query;
    console.log("Search query:", q);

    const result = await useDrizzle()
      .select({
        title: tables.movies.title,
        slut: tables.movies.slug,
        synopsis: tables.movies.synopsis,
        releaseDate: tables.movies.releaseDate,
        averageRating: tables.movies.averageRating,
      })
      .from(tables.movies)
      .where(
        or(
          ilike(tables.movies.title, `%${q}%`),
          ilike(tables.movies.synopsis, `%${q}%`),
        ),
      );
    console.log("Query result:", result);

    if (!result || result.length === 0) {
      return {
        success: false,
        message: `Cannot find movies: ${q}`,
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
