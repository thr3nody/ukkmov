import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number cannot be empty."),
  name: z.string().min(1, "Name cannot be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id, name } = await readValidatedBody(event, bodySchema.parse);

    const [updatedRecord] = await useDrizzle()
      .update(tables.genres)
      .set({ name })
      .where(eq(tables.genres.id, id))
      .returning({
        updatedID: tables.genres.id,
        updateName: tables.genres.name,
      });

    if (!updatedRecord) {
      return {
        success: false,
        message: `No genre found with ID ${id}.`,
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
