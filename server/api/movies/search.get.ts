import { ilike, inArray } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().optional(),
  genres: z.string().optional(),
  casts: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const { q, genres, casts } = querySchema.parse(getQuery(event));
    // console.log("Search query:", q);

    const genreArray = genres ? genres.split(",") : [];
    const castArray = casts ? casts.split(",") : [];

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

    if (genreArray.length) {
      queryBuilder
        .leftJoin(
          tables.genresRelation,
          eq(tables.movies.id, tables.genresRelation.moviesId),
        )
        .leftJoin(
          tables.genres,
          eq(tables.genresRelation.genresId, tables.genres.id),
        )
        .where(inArray(tables.genres.name, genreArray))
        .groupBy(tables.movies.id)
        .having(
          sql<number>`COUNT(DISTINCT ${tables.genres.name}) = ${genreArray.length}`,
        );
    }

    if (castArray.length) {
      queryBuilder
        .leftJoin(
          tables.castsRelation,
          eq(tables.movies.id, tables.castsRelation.moviesId),
        )
        .leftJoin(
          tables.casts,
          eq(tables.castsRelation.castsId, tables.casts.id),
        )
        .where(inArray(tables.casts.name, castArray))
        .groupBy(tables.movies.id)
        .having(
          sql<number>`COUNT(DISTINCT ${tables.casts.name}) = ${castArray.length}`,
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
