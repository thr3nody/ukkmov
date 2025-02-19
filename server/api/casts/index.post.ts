import { z } from "zod";
import { useToArray } from "~/server/utils/to-array";

const singleCastSchema = z.object({
  name: z.string().min(1, "Casts name must not be empty."),
});

const bodySchema = z.union([singleCastSchema, z.array(singleCastSchema)]);

export default defineEventHandler(async (event) => {
  try {
    const parsed = await readValidatedBody(event, bodySchema.parse);
    const casts = useToArray(parsed);

    const castsToInsert = casts.map((cast) => {
      return {
        name: cast.name,
        createdAt: new Date(),
      };
    });

    const result = await useDrizzle()
      .insert(tables.casts)
      .values(castsToInsert);

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred casts creation.",
    };
  }
});
