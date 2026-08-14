"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { batches } from "@/db/schema";

export async function getBatchesAction() {
  try {
    const list = await db.query.batches.findMany({
      where: eq(batches.isActive, true),
      orderBy: (batches, { desc }) => [desc(batches.createdAt)],
    });
    return { data: list };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch batches",
    };
  }
}

export async function createBatchAction(
  name: string,
  slug: string,
  hscYear: string,
  description?: string,
) {
  try {
    const res = await db
      .insert(batches)
      .values({
        name,
        slug,
        hscYear,
        description,
      })
      .returning();
    revalidatePath("/admin/batches");
    return { success: true, batch: res[0] };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to create batch",
    };
  }
}
