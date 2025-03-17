import { z } from "zod";
import { inArray } from "drizzle-orm";

const bulkDeleteSchema = z.object({
  ids: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  try {
    const { ids } = await readBody(event);
    bulkDeleteSchema.parse({ ids });

    const deleted = await useDrizzle()
      .delete(tables.casts)
      .where(inArray(tables.casts.id, ids))
      .returning();

    return { success: true, message: `Deleted: ${deleted}` };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Bulk delete failed.",
    };
  }
});
