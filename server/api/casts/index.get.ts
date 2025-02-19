export default defineEventHandler(async (event) => {
  try {
    return await useDrizzle().select().from(tables.casts);
  } catch (error: any) {
    return createError({
      statusCode: 404,
      message: "Can't find any genres.",
    });
  }
});
