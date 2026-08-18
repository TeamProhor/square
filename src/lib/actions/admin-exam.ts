"use server";

import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { examQuestions, examSubmissions, exams } from "@/db/schema";
import type { ExamDetail } from "@/types";

export async function createExamAction(data: {
  title: string;
  slug: string;
  description?: string;
  type: "practice" | "chapter_test" | "weekly" | "model_test" | "live_contest";
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: string;
  showResultImmediately: boolean;
  isPublished: boolean;
  createdBy: string;
}) {
  try {
    const res = await db.insert(exams).values(data).returning();
    revalidatePath("/admin/exams");
    return { success: true, data: res[0] as unknown as ExamDetail };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create exam",
    };
  }
}

export async function updateExamAction(id: string, data: Partial<ExamDetail>) {
  try {
    const res = await db
      .update(exams)
      .set({ ...data, updatedAt: sql`(CURRENT_TIMESTAMP)` })
      .where(eq(exams.id, id))
      .returning();
    revalidatePath(`/admin/exams/${id}`);
    revalidatePath("/admin/exams");
    return { success: true, data: res[0] as unknown as ExamDetail };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update exam",
    };
  }
}

export async function deleteExamAction(id: string) {
  try {
    await db.delete(exams).where(eq(exams.id, id));
    revalidatePath("/admin/exams");
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete exam",
    };
  }
}

export async function publishExamAction(id: string) {
  try {
    await db
      .update(exams)
      .set({ isPublished: true, updatedAt: sql`(CURRENT_TIMESTAMP)` })
      .where(eq(exams.id, id));
    revalidatePath(`/admin/exams/${id}`);
    revalidatePath("/admin/exams");
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish exam",
    };
  }
}

export async function addQuestionToExamAction(
  examId: string,
  questionId: string,
  orderNo: number,
  marks: number,
  section?: string,
) {
  try {
    const res = await db
      .insert(examQuestions)
      .values({
        examId,
        questionId,
        orderNo,
        marks,
        section,
      })
      .returning();
    revalidatePath(`/admin/exams/${examId}/questions`);
    return { success: true, data: res[0] };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add question",
    };
  }
}

export async function removeQuestionFromExamAction(
  examQuestionId: string,
  examId: string,
) {
  try {
    await db.delete(examQuestions).where(eq(examQuestions.id, examQuestionId));
    revalidatePath(`/admin/exams/${examId}/questions`);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove question",
    };
  }
}

export async function reorderExamQuestionsAction(
  examId: string,
  orderedIds: string[],
) {
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(examQuestions)
        .set({ orderNo: i + 1 })
        .where(eq(examQuestions.id, orderedIds[i]));
    }
    revalidatePath(`/admin/exams/${examId}/questions`);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reorder questions",
    };
  }
}

export async function getExamWithQuestionsAdmin(examId: string) {
  try {
    const exam = await db.query.exams.findFirst({
      where: eq(exams.id, examId),
      with: {
        examQuestions: {
          orderBy: (eqs, { asc }) => [asc(eqs.orderNo)],
          with: {
            question: true,
          },
        },
      },
    });
    if (!exam) return { success: false, error: "Exam not found" };
    return { success: true, data: exam };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch exam",
    };
  }
}

export async function getExamResultsAdmin(examId: string) {
  try {
    const list = await db.query.examSubmissions.findMany({
      where: eq(examSubmissions.examId, examId),
      with: {
        user: true,
      },
      orderBy: [desc(examSubmissions.submittedAt)],
    });
    return { success: true, data: list };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch results",
    };
  }
}

export async function getAllExamsAdmin() {
  try {
    const list = await db.query.exams.findMany({
      orderBy: [desc(exams.createdAt)],
    });
    return { success: true, data: list };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch exams",
    };
  }
}
