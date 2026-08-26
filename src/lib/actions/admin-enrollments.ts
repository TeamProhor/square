"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  batchEnrollmentRequests,
  batchEnrollments,
  batchMembers,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getEnrollmentRequests() {
  const reqs = await db.query.batchEnrollmentRequests.findMany({
    with: {
      user: true,
      batch: true,
    },
    orderBy: [desc(batchEnrollmentRequests.createdAt)],
  });
  return reqs;
}

export async function approveEnrollmentRequest(requestId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const adminId = session?.user?.id;

  if (!adminId) {
    throw new Error("Unauthorized");
  }

  await db.transaction(async (tx) => {
    // 1. Mark request as approved
    const [updatedReq] = await tx
      .update(batchEnrollmentRequests)
      .set({
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: adminId,
      })
      .where(eq(batchEnrollmentRequests.id, requestId))
      .returning();

    if (!updatedReq) throw new Error("Request not found");

    // 2. Create actual enrollment
    await tx.insert(batchEnrollments).values({
      userId: updatedReq.userId,
      batchId: updatedReq.batchId,
      requestId: updatedReq.id,
      amountPaid: updatedReq.amount,
      accessGrantedBy: adminId,
    });

    // 3. Add user to batch_members
    await tx.insert(batchMembers).values({
      batchId: updatedReq.batchId,
      userId: updatedReq.userId,
      role: "student",
    });
  });

  revalidatePath("/admin/enrollments");
  revalidatePath("/my-courses");
}

export async function rejectEnrollmentRequest(
  requestId: string,
  reason: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const adminId = session?.user?.id;

  if (!adminId) {
    throw new Error("Unauthorized");
  }

  await db
    .update(batchEnrollmentRequests)
    .set({
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: adminId,
      rejectionReason: reason,
    })
    .where(eq(batchEnrollmentRequests.id, requestId));

  revalidatePath("/admin/enrollments");
}
