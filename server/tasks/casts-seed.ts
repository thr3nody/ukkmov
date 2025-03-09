export default defineTask({
  meta: {
    name: "db:casts-seed",
    description:
      "Run database seed task for casts table, make sure movies are already seeded.",
  },
  async run() {
    console.log("Running DB seed task...");
    const casts = [
      { name: "Keanu Reeves" },
      { name: "Leonardo DiCaprio" },
      { name: "Matthew McConaughey" },
      { name: "Natalie Portman" },
      { name: "Scarlett Johansson" },
    ];

    const now = new Date();

    const seedingData = casts.map((cast) => ({
      ...cast,
      createdAt: now,
    }));

    await useDrizzle().insert(tables.casts).values(seedingData);

    const insertedCasts = await useDrizzle().select().from(tables.casts);
    const movies = await useDrizzle().select().from(tables.movies);

    const castsRelations = movies.map((movie) => {
      const randomCast =
        insertedCasts[Math.floor(Math.random() * insertedCasts.length)];
      return {
        castsId: randomCast.id,
        moviesId: movie.id,
        createdAt: now,
        updatedAt: now,
      };
    });

    await useDrizzle().insert(tables.castsRelation).values(castsRelations);

    return { result: "success" };
  },
});
