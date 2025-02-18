import { z } from "zod";

const bodySchema = z.object({
  id: z.coerce.number().min(1, "Number can't be empty."),
});

export default defineEventHandler(async (event) => {
  try {
    const dataToDelete = await readValidatedBody(event, bodySchema.parse);
  } catch (error: any) {}
});
