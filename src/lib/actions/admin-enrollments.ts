"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courseEnrollmentRequests, courseEnrollments } from "@/db/schema";

export async function approveRequest(formData: FormData) {
  const requestId = formData.get("requestId") as string;
  const courseId = formData.get("courseId") as string;
  const userId = formData.get("userId") as string;

  await db.transaction(async (tx) => {
    await tx
      .update(courseEnrollmentRequests)
      .set({ status: "approved", reviewedAt: new Date() })
      .where(eq(courseEnrollmentRequests.id, requestId));

    await tx.insert(courseEnrollments).values({
      id: crypto.randomUUID(),
      userId,
      courseId,
      requestId,
      status: "active",
      enrolledAt: new Date(),
    });
  });

  revalidatePath("/admin/enrollments");
  revalidatePath(`/courses`);
}

export async function rejectRequest(formData: FormData) {
  const requestId = formData.get("requestId") as string;
  const adminNote = (formData.get("adminNote") as string) || "Payment mismatch";

  await db
    .update(courseEnrollmentRequests)
    .set({ status: "rejected", reviewedAt: new Date(), adminNote })
    .where(eq(courseEnrollmentRequests.id, requestId));

  revalidatePath("/admin/enrollments");
}
