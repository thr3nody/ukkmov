export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.countriesOrigin);
    return {
      success: true,
      countriesOrigin: data.map((countriesOriginData) => ({
        id: countriesOriginData.id,
        name: countriesOriginData.name,
      })),
    };
  } catch (error: any) {
    return createError({
      statusCode: 404,
      message: "Can't find any countries origin.",
    });
  }
});
