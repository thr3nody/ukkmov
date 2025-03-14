import { ilike } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  s: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const slug = querySchema.parse(getQuery(event));
    const s = slug.s;

    const rawData = await useDrizzle()
      .select({
        id: tables.movies.id,
        title: tables.movies.title,
        synopsis: tables.movies.synopsis,
        duration: tables.movies.duration,
        releaseDate: tables.movies.releaseDate,
        averageRating: tables.movies.averageRating,
        trailerLink: tables.movies.trailerLink,
        posterPath: tables.movies.posterPath,

        ageRating: {
          id: tables.ageRatings.id,
          content: tables.ageRatings.content,
        },

        genre: {
          id: tables.genres.id,
          name: tables.genres.name,
        },

        cast: {
          id: tables.casts.id,
          name: tables.casts.name,
        },

        reviews: {
          id: tables.reviews.id,
          rating: tables.reviews.rating,
          comment: tables.reviews.comment,
          usersId: tables.users.id,
          usersName: tables.users.name,
        },
      })
      .from(tables.movies)
      .where(or(ilike(tables.movies.slug, `%${s}%`)))
      .leftJoin(
        tables.ageRatings,
        eq(tables.movies.ageRatingId, tables.ageRatings.id),
      )
      .leftJoin(
        tables.genresRelation,
        eq(tables.movies.id, tables.genresRelation.moviesId),
      )
      .leftJoin(
        tables.genres,
        eq(tables.genresRelation.genresId, tables.genres.id),
      )
      .leftJoin(
        tables.castsRelation,
        eq(tables.movies.id, tables.castsRelation.moviesId),
      )
      .leftJoin(tables.casts, eq(tables.castsRelation.castsId, tables.casts.id))
      .leftJoin(tables.reviews, eq(tables.movies.id, tables.reviews.moviesId))
      .leftJoin(tables.users, eq(tables.reviews.userId, tables.users.id));

    const movieDetail = formatMovie(rawData);

    if (!movieDetail || formatMovie.length === 0) {
      return {
        success: false,
        message: s
          ? `Movies with given slug doesn't exist: ${s}`
          : "No movies found.",
      };
    }

    return {
      success: true,
      movieDetail,
    };
  } catch (error: any) {
    console.error("Error getting movie data:", error);
    return {
      success: false,
      message: "Something while getting movie detail.",
    };
  }
});

function formatMovie(data: any[]): any[] {
  const moviesMap = new Map();

  for (const row of data) {
    const movieId = row.id;
    if (!moviesMap.has(movieId)) {
      moviesMap.set(movieId, {
        id: row.id,
        title: row.title,
        synopsis: row.synopsis,
        duration: row.duration,
        releaseDate: row.releaseDate,
        averageRating: row.averageRating,
        ageRating: row.ageRating,
        trailerLink: row.trailerLink,
        posterPath: row.posterPath,
        genres: [],
        casts: [],
        reviews: [],
      });
    }

    const movie = moviesMap.get(movieId);

    if (row.genre && !movie.genres.find((g: any) => g.id === row.genre.id)) {
      movie.genres.push(row.genre);
    }

    if (row.cast && !movie.casts.find((c: any) => c.id === row.cast.id)) {
      movie.casts.push(row.cast);
    }

    if (row.reviews) {
      const review = {
        id: row.reviews.id,
        rating: row.reviews.rating,
        comment: row.reviews.comment,
        user: {
          id: row.reviews.usersId,
          name: row.reviews.usersName,
        },
      };

      if (!movie.reviews.find((r: any) => r.id === review.id)) {
        movie.reviews.push(review);
      }
    }
  }
  return Array.from(moviesMap.values());
}
