export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle()
      .select({
        id: tables.reviews.id,
        rating: tables.reviews.rating,
        comment: tables.reviews.comment,

        users: {
          id: tables.users.id,
          name: tables.users.name,
        },

        movies: {
          id: tables.movies.id,
          title: tables.movies.title,
        },
      })
      .from(tables.reviews)
      .leftJoin(tables.users, eq(tables.reviews.userId, tables.users.id))
      .leftJoin(tables.movies, eq(tables.reviews.movieId, tables.movies.id));

    return {
      success: true,
      reviews: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred when fetching movies data.",
    };
  }
});
