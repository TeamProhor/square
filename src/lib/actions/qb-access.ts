"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  batchEnrollments,
  batchQbAccess,
  batches,
  containers,
  items,
  questions,
  subitems,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getBatchQbAccess(batchId: string): Promise<string[]> {
  try {
    const records = await db
      .select({ containerId: batchQbAccess.containerId })
      .from(batchQbAccess)
      .where(eq(batchQbAccess.batchId, batchId));

    return records.map((r) => r.containerId);
  } catch (error) {
    console.error("Error fetching batch QB access:", error);
    return [];
  }
}

export async function setBatchQbAccess(
  batchId: string,
  containerIds: string[],
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    // Delete existing assignments for this batch
    await db.delete(batchQbAccess).where(eq(batchQbAccess.batchId, batchId));

    // Insert new assignments if any
    if (containerIds.length > 0) {
      const values = containerIds.map((cid) => ({
        batchId,
        containerId: cid,
      }));
      await db.insert(batchQbAccess).values(values);
    }

    try {
      revalidatePath(`/admin/batches/${batchId}`);
      revalidatePath("/qb");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating batch QB access:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "অ্যাক্সেস আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function toggleContainerPublic(
  containerId: string,
  isPublic: boolean,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    await db
      .update(containers)
      .set({ isPublic })
      .where(eq(containers.id, containerId));

    try {
      revalidatePath("/qb");
      revalidatePath("/admin/qb");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error toggling container public:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function toggleQuestionFree(
  questionId: string,
  isFree: boolean,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    await db
      .update(questions)
      .set({ isFree })
      .where(eq(questions.id, questionId));

    try {
      revalidatePath("/qb");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error toggling question free:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function getUserQbContainers(userId?: string) {
  try {
    // 1. Fetch all containers with items count and assigned batches
    const allContainers = await db.query.containers.findMany({
      with: {
        items: true,
        batchAccess: {
          with: {
            batch: true,
          },
        },
      },
      orderBy: (containers, { asc }) => [asc(containers.createdAt)],
    });

    // 2. Fetch user's active enrolled batches if logged in
    let userBatchIds: string[] = [];
    let isAdmin = false;

    if (userId) {
      const session = await auth.api.getSession({ headers: await headers() });
      isAdmin = session?.user?.role === "admin";

      if (!isAdmin) {
        const enrollments = await db
          .select({ batchId: batchEnrollments.batchId })
          .from(batchEnrollments)
          .where(
            and(
              eq(batchEnrollments.userId, userId),
              eq(batchEnrollments.status, "active"),
            ),
          );
        userBatchIds = enrollments.map((e) => e.batchId);
      }
    }

    return allContainers.map((c) => {
      const assignedBatches = c.batchAccess?.map((ba) => ({
        id: ba.batch.id,
        name: ba.batch.name,
        slug: ba.batch.slug,
        hscBatch: ba.batch.hscBatch,
      })) || [];

      const hasBatchAccess =
        isAdmin ||
        c.isPublic ||
        assignedBatches.some((b) => userBatchIds.includes(b.id));

      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        isPublic: c.isPublic,
        itemsCount: c.items?.length || 0,
        hasAccess: hasBatchAccess,
        assignedBatches,
      };
    });
  } catch (error) {
    console.error("Error fetching user QB containers:", error);
    return [];
  }
}

export async function checkQbContainerAccess(containerSlug: string, userId?: string) {
  try {
    const container = await db.query.containers.findFirst({
      where: eq(containers.slug, containerSlug),
      with: {
        batchAccess: {
          with: {
            batch: true,
          },
        },
      },
    });

    if (!container) return { exists: false, hasAccess: false, container: null, assignedBatches: [] };

    const assignedBatches = container.batchAccess?.map((ba) => ({
      id: ba.batch.id,
      name: ba.batch.name,
      slug: ba.batch.slug,
      hscBatch: ba.batch.hscBatch,
    })) || [];

    if (container.isPublic) {
      return { exists: true, hasAccess: true, container, assignedBatches };
    }

    if (!userId) {
      return { exists: true, hasAccess: false, container, assignedBatches };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role === "admin") {
      return { exists: true, hasAccess: true, container, assignedBatches };
    }

    const enrollments = await db
      .select({ batchId: batchEnrollments.batchId })
      .from(batchEnrollments)
      .where(
        and(
          eq(batchEnrollments.userId, userId),
          eq(batchEnrollments.status, "active"),
        ),
      );

    const userBatchIds = enrollments.map((e) => e.batchId);
    const hasAccess = assignedBatches.some((b) => userBatchIds.includes(b.id));

    return { exists: true, hasAccess, container, assignedBatches };
  } catch (error) {
    console.error("Error checking QB container access:", error);
    return { exists: false, hasAccess: false, container: null, assignedBatches: [] };
  }
}
