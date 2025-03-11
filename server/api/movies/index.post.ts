import { z } from "zod";
import slugify from "slugify";
import { useToArray } from "~/server/utils/to-array";

const singleMovieSchema = z.object({
  title: z.string().min(1, "Title can't be empty."),
  synopsis: z.string().min(1, "Synopsis can't be empty."),
  duration: z.number().min(1, "Duration must't be empty."),
  releaseDate: z.coerce.date(),
  ageRatingId: z.number().optional(),

  // Optional array
  genres: z.array(z.number()).optional(),
  casts: z.array(z.number()).optional(),
});

const bodySchema = z.union([singleMovieSchema, z.array(singleMovieSchema)]);

export default defineEventHandler(async (event) => {
  try {
    const parsed = await readValidatedBody(event, bodySchema.parse);
    const movies = useToArray(parsed);
    const now = new Date();

    const dataToInsert = movies.map((movie) => {
      const slug = slugify(movie.title, { lower: true, strict: true });
      return {
        title: movie.title,
        slug: slug,
        synopsis: movie.synopsis,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        ageRatingId: movie.ageRatingId,
        createdAt: now,
      };
    });

    const insertedMovies = await useDrizzle()
      .insert(tables.movies)
      .values(dataToInsert)
      .returning();

    const genresRelations: genresRelations[] = [];
    const castsRelations: castsRelations[] = [];

    movies.forEach((movie, index) => {
      const movieId = insertedMovies[index].id;
      if (movie.genres && movie.genres.length > 0) {
        movie.genres.forEach((genreId) => {
          genresRelations.push({
            genresId: genreId,
            moviesId: movieId,
            createdAt: now,
          });
        });
      }
      if (movie.casts && movie.casts.length > 0) {
        movie.casts.forEach((castId) => {
          castsRelations.push({
            castsId: castId,
            moviesId: movieId,
            createdAt: now,
          });
        });
      }
    });

    if (genresRelations.length > 0) {
      await useDrizzle().insert(tables.genresRelation).values(genresRelations);
    }

    if (castsRelations.length > 0) {
      await useDrizzle().insert(tables.castsRelation).values(castsRelations);
    }

    return {
      success: true,
      movie: insertedMovies[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during movie creation.",
    };
  }
});
