import { z } from "zod";
import { useToArray } from "~/server/utils/to-array";

const singleAgeRatingSchema = z.object({
  content: z.string().min(1, "Age ratings name must not be empty."),
});

const bodySchema = z.union([
  singleAgeRatingSchema,
  z.array(singleAgeRatingSchema),
]);

export default defineEventHandler(async (event) => {
  try {
    const parsed = await readValidatedBody(event, bodySchema.parse);
    const ageRatings = useToArray(parsed);

    const ageRatingsToInsert = ageRatings.map((ageRating) => {
      return {
        content: ageRating.content,
        createdAt: new Date(),
      };
    });

    const result = await useDrizzle()
      .insert(tables.ageRatings)
      .values(ageRatingsToInsert);

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred age ratings creation.",
    };
  }
});
