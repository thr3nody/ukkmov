export default defineTask({
  meta: {
    name: "db:reviews-seed",
    description:
      "Run database seed task for reviews table, make sure users and movies are already seeded.",
  },
  async run() {
    console.log("Running DB seed task...");
    const reviews = [
      {
        userId: "3f50b6dc-d4bf-49a1-8a10-0dc299e62d19",
        movieId: 1,
        rating: "4" as const,
        comment: "Pretty good movie!",
      },
      {
        userId: "3f50b6dc-d4bf-49a1-8a10-0dc299e62d19",
        movieId: 2,
        rating: "5" as const,
        comment: "Loved it!",
      },
      {
        userId: "3f50b6dc-d4bf-49a1-8a10-0dc299e62d19",
        movieId: 3,
        rating: "1" as const,
        comment: "Meh.",
      },
      {
        userId: "3f50b6dc-d4bf-49a1-8a10-0dc299e62d19",
        movieId: 4,
        rating: "3" as const,
        comment: "Mid.",
      },
      {
        userId: "3f50b6dc-d4bf-49a1-8a10-0dc299e62d19",
        movieId: 5,
        rating: "5" as const,
        comment: "Loved it so much!",
      },
    ];

    const seedingData = reviews.map((review) => ({
      ...review,
      createdAt: new Date(),
    }));

    await useDrizzle().insert(tables.reviews).values(seedingData);

    return { result: "success" };
  },
});
