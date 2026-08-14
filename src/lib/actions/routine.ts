"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { examRoutines } from "@/db/schema";

export async function getRoutinesAction(batchId?: string) {
  try {
    const list = await db.query.examRoutines.findMany({
      where: batchId ? eq(examRoutines.batchId, batchId) : undefined,
      orderBy: (examRoutines, { asc }) => [asc(examRoutines.examDate)],
    });
    return { data: list };
  } catch (error: any) {
    return { error: error?.message || "Failed to fetch routines" };
  }
}

export async function createRoutineAction(
  batchId: string,
  title: string,
  subject: string,
  examDate: string,
  durationMinutes: number,
  totalMarks: number,
  syllabus?: string,
) {
  try {
    const res = await db.insert(examRoutines).values({
      batchId,
      title,
      subject,
      examDate,
      durationMinutes,
      totalMarks,
      syllabus,
    }).returning();
    revalidatePath("/calendar");
    return { success: true, routine: res[0] };
  } catch (error: any) {
    return { error: error?.message || "Failed to create routine" };
  }
}
