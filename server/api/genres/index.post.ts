import { z } from "zod";
import { useToArray } from "~/server/utils/to-array";

const singleGenreSchema = z.object({
  name: z.string().min(1, "Genres name must not be empty."),
});

const bodySchema = z.union([singleGenreSchema, z.array(singleGenreSchema)]);

export default defineEventHandler(async (event) => {
  try {
    const parsed = await readValidatedBody(event, bodySchema.parse);
    const genres = useToArray(parsed);

    const genresToInsert = genres.map((genre) => {
      return {
        name: genre.name,
        createdAt: new Date(),
      };
    });

    const result = await useDrizzle()
      .insert(tables.genres)
      .values(genresToInsert);

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred genres creation.",
    };
  }
});
