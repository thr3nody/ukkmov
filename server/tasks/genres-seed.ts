export default defineTask({
  meta: {
    name: "db:genres-seed",
    description:
      "Run database seed task for genres table, make sure movies are already seeded.",
  },
  async run() {
    console.log("Running DB seed task...");
    const genres = [
      { name: "Action" },
      { name: "Drama" },
      { name: "Comedy" },
      { name: "Thriller" },
      { name: "Horror" },
      { name: "Sci-Fi" },
    ];

    const now = new Date();

    const seedingData = genres.map((genre) => ({
      ...genre,
      createdAt: now,
    }));

    await useDrizzle().insert(tables.genres).values(seedingData);

    const insertedGenres = await useDrizzle().select().from(tables.genres);
    const movies = await useDrizzle().select().from(tables.movies);

    const genresRelations = movies.map((movie) => {
      const randomGenre =
        insertedGenres[Math.floor(Math.random() * insertedGenres.length)];
      return {
        genresId: randomGenre.id,
        moviesId: movie.id,
        createdAt: now,
        updatedAt: now,
      };
    });

    await useDrizzle().insert(tables.genresRelation).values(genresRelations);

    return { result: "success" };
  },
});
