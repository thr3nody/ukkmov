import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number cannot be empty."),
  content: z.string().min(1, "Content cannot be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id, content } = await readValidatedBody(event, bodySchema.parse);

    const [updatedRecord] = await useDrizzle()
      .update(tables.ageRatings)
      .set({ content })
      .where(eq(tables.ageRatings.id, id))
      .returning({
        updatedID: tables.ageRatings.id,
        updatedContent: tables.ageRatings.content,
      });

    if (!updatedRecord) {
      return {
        success: false,
        message: `No data found with ID ${id}.`,
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
