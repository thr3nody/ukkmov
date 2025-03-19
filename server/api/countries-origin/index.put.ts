import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number cannot be empty."),
  name: z.string().min(1, "Name cannot be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id, name } = await readValidatedBody(event, bodySchema.parse);

    const [updatedRecord] = await useDrizzle()
      .update(tables.countriesOrigin)
      .set({ name })
      .where(eq(tables.countriesOrigin.id, id))
      .returning({
        updatedID: tables.countriesOrigin.id,
        updateName: tables.countriesOrigin.name,
      });

    if (!updatedRecord) {
      return {
        success: false,
        message: `No country origin found with ID ${id}.`,
      };
    }

    return {
      success: true,
      updated: updatedRecord,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Error occured when updating data.",
    };
  }
});
