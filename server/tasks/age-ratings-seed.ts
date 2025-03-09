export default defineTask({
  meta: {
    name: "db:age-ratings-seed",
    description:
      "Run database seed task for genres table, make sure movies are already seeded.",
  },
  async run() {
    console.log("Running DB seed task...");
    const ageRatings = [
      { content: "G" },
      { content: "PG" },
      { content: "R" },
      { content: "NC-17" },
      { content: "PG-13" },
    ];

    const now = new Date();

    const seedingData = ageRatings.map((ageRating) => ({
      ...ageRating,
      createdAt: now,
    }));

    await useDrizzle().insert(tables.ageRatings).values(seedingData);

    return { result: "success" };
  },
});
