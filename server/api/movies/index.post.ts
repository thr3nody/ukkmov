import { z } from "zod";
import slugify from "slugify";
import { useToArray } from "~/server/utils/to-array";

const singleMovieSchema = z.object({
  title: z.string().min(1, "Title can't be empty."),
  synopsis: z.string().min(1, "Synopsis can't be empty."),
  duration: z.number().min(1, "Duration must't be empty."),
  releaseDate: z.coerce.date(),
});

const bodySchema = z.union([singleMovieSchema, z.array(singleMovieSchema)]);

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const parsed = await readValidatedBody(event, bodySchema.parse);
    const movies = useToArray(parsed);

    const dataToInsert = movies.map((movie) => {
      const slug = slugify(movie.title, { lower: true, strict: true });
      return {
        title: movie.title,
        slug: slug,
        synopsis: movie.synopsis,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        createdAt: new Date(),
      };
    });

    const data = await useDrizzle().insert(tables.movies).values(dataToInsert);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during movie creation.",
    };
  }
});
