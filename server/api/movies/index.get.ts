export default defineEventHandler(async (event) => {
  try {
    const rawData = await useDrizzle()
      .select({
        id: tables.movies.id,
        title: tables.movies.title,
        synopsis: tables.movies.synopsis,
        duration: tables.movies.duration,
        releaseDate: tables.movies.releaseDate,
        averageRating: tables.movies.averageRating,
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
      })
      .from(tables.movies)
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
      .leftJoin(
        tables.casts,
        eq(tables.castsRelation.castsId, tables.casts.id),
      );

    const moviesGrouped = groupMovies(rawData);

    return {
      success: true,
      movies: moviesGrouped,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred when fetching movies data.",
    };
  }
});

function groupMovies(data: any[]): any[] {
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
        posterPath: row.posterPath,
        genres: [],
        casts: [],
      });
    }

    const movie = moviesMap.get(movieId);

    // Add genre if it exists and isn't already added.
    if (row.genre && !movie.genres.find((g: any) => g.id === row.genre.id)) {
      movie.genres.push(row.genre);
    }

    // Add cast if it exists and isn't already added.
    if (row.cast && !movie.casts.find((c: any) => c.id === row.cast.id)) {
      movie.casts.push(row.cast);
    }
  }
  return Array.from(moviesMap.values());
}
