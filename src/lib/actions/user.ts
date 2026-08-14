"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function getUserProfileAction(userId: string) {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });
    return { data: profile };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
}

export async function updateUserProfileAction(
  userId: string,
  data: {
    fullName?: string;
    hscBatch?: string;
    college?: string;
    avatarUrl?: string;
  },
) {
  try {
    const res = await db
      .update(profiles)
      .set(data)
      .where(eq(profiles.id, userId))
      .returning();
    revalidatePath("/profile");
    return { success: true, profile: res[0] };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
