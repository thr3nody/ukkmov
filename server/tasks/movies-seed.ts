import slugify from "slugify";

export default defineTask({
  meta: {
    name: "db:users-seed",
    description: "Run database seed task for movies table",
  },
  async run() {
    console.log("Running DB seed task...");
    const movies = [
      {
        title: "The Matrix",
        synopsis:
          "A computer hacker learns about the true nature of reality...",
        duration: 136,
        releaseDate: new Date("1999-03-31"),
      },
      {
        title: "Inception",
        synopsis: "A skilled thief is offered a chance at redemption...",
        duration: 148,
        releaseDate: new Date("2010-07-16"),
      },
      {
        title: "Interstellar",
        synopsis: "A team of explorers travel through a wormhole in space...",
        duration: 169,
        releaseDate: new Date("2014-11-07"),
      },
    ];

    const seedingData = movies.map((movie) => ({
      ...movie,
      slug: slugify(movie.title, { lower: true, strict: true }),
      createdAt: new Date(),
    }));

    await useDrizzle().insert(tables.movies).values(seedingData);

    return { result: "success" };
  },
});
