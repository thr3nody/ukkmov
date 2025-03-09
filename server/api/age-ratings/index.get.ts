export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.ageRatings);
    return {
      success: true,
      ageRatings: data.map((ageRatingsData) => ({
        id: ageRatingsData.id,
        content: ageRatingsData.content,
      })),
    };
  } catch (error: any) {
    return createError({
      statusCode: 404,
      message: "Can't find any age ratings.",
    });
  }
});
