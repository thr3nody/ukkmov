import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number can't be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readValidatedBody(event, bodySchema.parse);
    const [movie] = await useDrizzle()
      .select({
        posterPath: tables.movies.posterPath,
      })
      .from(tables.movies)
      .where(eq(tables.movies.id, id));

    if (!movie) {
      return {
        success: false,
        message: "Movie not found.",
      };
    }

    const deletedData = await useDrizzle()
      .delete(tables.movies)
      .where(eq(tables.movies.id, id))
      .returning({ deletedId: tables.movies.id });

    if (deletedData.length && movie.posterPath) {
      const filePath = path.resolve("./public/posters", movie.posterPath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("Poster file not found or already deleted:", err);
      }
    }

    return {
      success: true,
      deltedGenresId: deletedData[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during deletion.",
    };
  }
});
