"use server";

import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { batches, examRoutines } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { Batch, ExamRoutine } from "@/types";

export interface CreateRoutinePayload {
  batchId: string;
  title: string;
  subject: string;
  syllabus?: string;
  examDate: string;
  durationMinutes?: number;
  totalMarks?: number;
}

export async function getBatches(): Promise<Batch[]> {
  try {
    return (await db
      .select()
      .from(batches)
      .orderBy(desc(batches.createdAt))) as unknown as Batch[];
  } catch (error) {
    console.error("Error fetching batches:", error);
    return [];
  }
}

export async function getExamRoutines(
  batchId?: string,
): Promise<ExamRoutine[]> {
  try {
    const query = db.select().from(examRoutines);
    if (batchId && batchId !== "all") {
      return (await query
        .where(eq(examRoutines.batchId, batchId))
        .orderBy(asc(examRoutines.examDate))) as ExamRoutine[];
    }
    return (await query.orderBy(asc(examRoutines.examDate))) as ExamRoutine[];
  } catch (error) {
    console.error("Error fetching exam routines:", error);
    return [];
  }
}

export async function createExamRoutine(
  payload: CreateRoutinePayload,
): Promise<{ success: boolean; data?: ExamRoutine; message?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "অনুমতি নেই। শুধুমাত্র এডমিন এক্সেস প্রয়োজন।",
      };
    }

    if (
      !payload.title?.trim() ||
      !payload.subject?.trim() ||
      !payload.examDate?.trim()
    ) {
      return { success: false, message: "পরীক্ষার নাম, বিষয় এবং তারিখ আবশ্যক।" };
    }

    // Ensure batch exists, or create default HSC 2026 batch
    let finalBatchId = payload.batchId;
    if (!finalBatchId) {
      let defaultBatch = await db.query.batches.findFirst({
        where: (b, { eq }) => eq(b.slug, "hsc-2026"),
      });

      if (!defaultBatch) {
        const [newB] = await db
          .insert(batches)
          .values({
            name: "HSC 2026 ব্যাচ",
            slug: "hsc-2026",
            description: "HSC 2026 মূল ব্যাচ",
            hscBatch: "HSC 26",
            price: 0,
            image: "",
          })
          .returning();
        defaultBatch = newB;
      }
      finalBatchId = defaultBatch.id;
    }

    const [newRoutine] = await db
      .insert(examRoutines)
      .values({
        batchId: finalBatchId,
        title: payload.title.trim(),
        subject: payload.subject.trim(),
        syllabus: payload.syllabus?.trim() || null,
        examDate: new Date(payload.examDate.trim()),
        durationMinutes: payload.durationMinutes || 30,
        totalMarks: payload.totalMarks || 25,
      })
      .returning();

    revalidatePath("/calendar");
    revalidatePath("/admin/exams");

    return { success: true, data: newRoutine as ExamRoutine };
  } catch (error: unknown) {
    console.error("Error creating exam routine:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "রুটিন যুক্ত করতে ব্যর্থ হয়েছে।",
    };
  }
}

export async function deleteExamRoutine(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "অনুমতি নেই। শুধুমাত্র এডমিন এক্সেস প্রয়োজন।",
      };
    }

    if (!id) {
      return { success: false, message: "রুটিন আইডি আবশ্যক।" };
    }

    await db.delete(examRoutines).where(eq(examRoutines.id, id));

    revalidatePath("/calendar");
    revalidatePath("/admin/exams");

    return { success: true, message: "রুটিন সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error: unknown) {
    console.error("Error deleting exam routine:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "রুটিন মুছতে ব্যর্থ হয়েছে।",
    };
  }
}
