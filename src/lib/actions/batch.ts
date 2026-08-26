"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  batchDetails,
  batchEnrollmentRequests,
  batchExams,
  batches,
  batchMembers,
} from "@/db/schema";

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

export async function createBatchAction(formData: FormData) {
  try {
    const id = nanoid();
    const slug = formData.get("slug") as string;

    await db.transaction(async (tx) => {
      await tx.insert(batches).values({
        id,
        name: formData.get("title") as string,
        slug,
        hscBatch: formData.get("hscBatch") as string,
        price: parseInt(formData.get("price") as string, 10),
        originalPrice:
          parseInt(formData.get("originalPrice") as string, 10) || null,
        description: formData.get("description") as string,
        image: formData.get("image") as string,
        isPublished: false,
        isActive: true,
      });

      await tx.insert(batchDetails).values({
        id: nanoid(),
        batchId: id,
        features: [],
        curriculum: [],
        mentorIds: [],
        faqs: [],
      });
    });
    revalidatePath("/admin/batches");
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create batch",
    };
  }
}

export async function deleteBatchAction(batchId: string) {
  try {
    await db.delete(batches).where(eq(batches.id, batchId));
    revalidatePath("/admin/batches");
    return { success: true };
  } catch (_error: unknown) {
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateBatchAction(formData: FormData) {
  try {
    const batchId = formData.get("batchId") as string;
    const originalPriceRaw = formData.get("originalPrice") as string;

    await db
      .update(batches)
      .set({
        name: formData.get("title") as string,
        slug: formData.get("slug") as string,
        hscBatch: formData.get("hscBatch") as string,
        price: parseInt(formData.get("price") as string, 10),
        originalPrice: originalPriceRaw ? parseInt(originalPriceRaw, 10) : null,
        description: formData.get("description") as string,
        image: formData.get("image") as string,
        updatedAt: new Date(),
      })
      .where(eq(batches.id, batchId));

    revalidatePath("/admin/batches");
    return { success: true };
  } catch (_error: unknown) {
    return { success: false, error: "Failed to update" };
  }
}

export async function getAllBatchesAction() {
  try {
    const list = await db.query.batches.findMany({
      orderBy: [desc(batches.createdAt)],
    });
    return { success: true, data: list };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch batches",
    };
  }
}

export async function getBatchDetailAction(id: string) {
  try {
    const batch = await db.query.batches.findFirst({
      where: eq(batches.id, id),
      with: {
        details: true,
        members: {
          with: { user: true },
        },
        batchExams: {
          with: { exam: true },
        },
      },
    });
    if (!batch) return { success: false, error: "Batch not found" };

    const memberUserIds = batch.members.map((m) => m.userId);
    let enrollmentRequests: (typeof batchEnrollmentRequests.$inferSelect)[] =
      [];
    if (memberUserIds.length > 0) {
      enrollmentRequests = await db.query.batchEnrollmentRequests.findMany({
        where: and(
          inArray(batchEnrollmentRequests.userId, memberUserIds),
          eq(batchEnrollmentRequests.batchId, batch.id),
        ),
      });
    }

    const membersWithRequests = batch.members.map((m) => {
      const request = enrollmentRequests.find((r) => r.userId === m.userId);
      return {
        ...m,
        enrollmentRequest: request
          ? {
              request,
              user: m.user,
              batch: batch,
            }
          : null,
      };
    });

    return {
      success: true,
      data: {
        ...batch,
        members: membersWithRequests,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch batch details",
    };
  }
}

export async function assignExamToBatchAction(
  batchId: string,
  examId: string,
  opts?: {
    startsAt?: string;
    endsAt?: string;
    maxAttempts?: number;
    isRequired?: boolean;
  },
) {
  try {
    const res = await db
      .insert(batchExams)
      .values({
        batchId,
        examId,
        startsAt: opts?.startsAt,
        endsAt: opts?.endsAt,
        maxAttempts: opts?.maxAttempts,
        isRequired: opts?.isRequired ?? true,
      })
      .returning();
    revalidatePath(`/admin/batches/${batchId}`);
    return { success: true, data: res[0] };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to assign exam",
    };
  }
}

export async function removeExamFromBatchAction(
  batchExamId: string,
  batchId: string,
) {
  try {
    await db.delete(batchExams).where(eq(batchExams.id, batchExamId));
    revalidatePath(`/admin/batches/${batchId}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove exam",
    };
  }
}

export async function addMemberToBatchAction(
  batchId: string,
  userId: string,
  role: "student" | "moderator" | "instructor" = "student",
) {
  try {
    const res = await db
      .insert(batchMembers)
      .values({
        batchId,
        userId,
        role,
      })
      .returning();
    revalidatePath(`/admin/batches/${batchId}`);
    return { success: true, data: res[0] };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add member",
    };
  }
}

export async function removeMemberFromBatchAction(
  batchMemberId: string,
  batchId: string,
) {
  try {
    await db.delete(batchMembers).where(eq(batchMembers.id, batchMemberId));
    revalidatePath(`/admin/batches/${batchId}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}

export async function getBatchMembersAction(batchId: string) {
  try {
    const members = await db.query.batchMembers.findMany({
      where: eq(batchMembers.batchId, batchId),
      with: { user: true },
    });
    return { success: true, data: members };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch members",
    };
  }
}

export async function updateBatchExamAction(
  batchExamId: string,
  batchId: string,
  opts: {
    startsAt?: string | null;
    endsAt?: string | null;
    maxAttempts?: number | null;
    isRequired?: boolean;
  },
) {
  try {
    const res = await db
      .update(batchExams)
      .set({
        startsAt: opts.startsAt ?? undefined,
        endsAt: opts.endsAt ?? undefined,
        maxAttempts: opts.maxAttempts ?? undefined,
        isRequired: opts.isRequired ?? undefined,
      })
      .where(eq(batchExams.id, batchExamId))
      .returning();
    revalidatePath(`/admin/batches/${batchId}`);
    return { success: true, data: res[0] };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update batch exam",
    };
  }
}
