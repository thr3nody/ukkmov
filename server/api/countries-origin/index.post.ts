import { z } from "zod";
import { useToArray } from "~/server/utils/to-array";

const singleCountryOriginSchema = z.object({
  name: z.string().min(1, "Countries origin name must not be empty."),
});

const bodySchema = z.union([
  singleCountryOriginSchema,
  z.array(singleCountryOriginSchema),
]);

export default defineEventHandler(async (event) => {
  try {
    const parsed = await readValidatedBody(event, bodySchema.parse);
    const countriesOrigin = useToArray(parsed);

    const countriesOriginToInsert = countriesOrigin.map((countryOrigin) => {
      return {
        name: countryOrigin.name,
        createdAt: new Date(),
      };
    });

    const result = await useDrizzle()
      .insert(tables.countriesOrigin)
      .values(countriesOriginToInsert);

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred countries origin creation.",
    };
  }
});
