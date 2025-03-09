export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.genres);
    return {
      success: true,
      genres: data.map((genresData) => ({
        id: genresData.id,
        name: genresData.name,
      })),
    };
  } catch (error: any) {
    return createError({
      statusCode: 404,
      message: "Can't find any genres.",
    });
  }
});
