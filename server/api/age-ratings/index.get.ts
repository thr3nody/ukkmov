export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.ageRatings);
    return {
      success: true,
      genres: data.map((genresData) => ({
        id: genresData.id,
        content: genresData.content,
      })),
    };
  } catch (error: any) {
    return createError({
      statusCode: 404,
      message: "Can't find any age ratings.",
    });
  }
});
