export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.casts);
    return {
      success: true,
      casts: data.map((castsData) => ({
        id: castsData.id,
        name: castsData.name,
      })),
    };
  } catch (error: any) {
    return createError({
      statusCode: 404,
      message: "Can't find any casts.",
    });
  }
});
