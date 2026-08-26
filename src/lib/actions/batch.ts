"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  batchExams,
  batches,
  batchMembers,
  courseEnrollmentRequests,
} from "@/db/schema";
import type { BatchDetail } from "@/types";

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
  description?: string,
  courseId?: string,
) {
  try {
    const res = await db
      .insert(batches)
      .values({
        name,
        slug,
        courseId: courseId?.trim() ? courseId.trim() : null,
        description: description?.trim() ? description.trim() : null,
        isActive: true,
      })
      .returning();
    revalidatePath("/admin/batches");
    return { success: true, data: res[0] };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create batch",
    };
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
        course: true,
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
    let enrollmentRequests: (typeof courseEnrollmentRequests.$inferSelect)[] =
      [];
    if (memberUserIds.length > 0 && batch.courseId) {
      enrollmentRequests = await db.query.courseEnrollmentRequests.findMany({
        where: and(
          inArray(courseEnrollmentRequests.userId, memberUserIds),
          eq(courseEnrollmentRequests.courseId, batch.courseId),
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
              course: batch.course,
            }
          : null,
      };
    });

    return {
      success: true,
      data: {
        ...batch,
        members: membersWithRequests,
      } as unknown as BatchDetail,
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
