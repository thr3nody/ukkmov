export default defineEventHandler(async (event) => {
  try {
    const results = await useDrizzle()
      .select({
        id: tables.users.id,
        name: tables.users.name,
        reviewCount: sql<number>`COUNT(${tables.reviews.id})`,
      })
      .from(tables.users)
      .innerJoin(tables.reviews, eq(tables.reviews.userId, tables.users.id))
      // .leftJoin(tables.reviews, eq(tables.reviews.userId, tables.users.id)) // If showing users with 0 reviews as well is needed
      .groupBy(tables.users.id);

    return {
      success: true,
      perUserReviews: results,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch review counts.",
    };
  }
});
