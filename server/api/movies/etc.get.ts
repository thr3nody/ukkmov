import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const latestMovies = await useDrizzle()
    .select()
    .from(tables.movies)
    .orderBy(desc(tables.movies.releaseDate))
    .limit(10);

  const trendingMovies = await useDrizzle()
    .select()
    .from(tables.movies)
    .orderBy(desc(tables.movies.averageRating))
    .limit(10);

  return {
    success: true,
    latest: latestMovies,
    trending: trendingMovies,
  };
});
