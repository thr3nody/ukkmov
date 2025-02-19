export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.movies)
    return {
      success: true,
      movies: data.map(moviesData => ({
        id: moviesData.id,
        title: moviesData.title,
        slug: moviesData.slug,
        synopsis: moviesData.synopsis,
        averageRating: moviesData.averageRating,
        releaseDate: moviesData.releaseDate
      }))
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred when fetching movies data.",
    };
  }
})
