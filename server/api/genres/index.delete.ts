import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number can't be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readValidatedBody(event, bodySchema.parse);

    const deletedData = await useDrizzle()
      .delete(tables.genres)
      .where(eq(tables.genres.id, id))
      .returning({ deletedId: tables.genres.id });

    return {
      success: true,
      deltedId: deletedData,
    };
  } catch (error: any) {}
});
