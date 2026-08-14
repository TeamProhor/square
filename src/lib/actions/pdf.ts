"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pdfSuggestions } from "@/db/schema";

export async function getPdfSuggestionsAction(subject?: string) {
  try {
    const list = await db.query.pdfSuggestions.findMany({
      where: subject ? eq(pdfSuggestions.subject, subject) : undefined,
      orderBy: (pdfSuggestions, { desc }) => [desc(pdfSuggestions.createdAt)],
    });
    return { data: list };
  } catch (error: any) {
    return { error: error?.message || "Failed to fetch PDF suggestions" };
  }
}

export async function createPdfSuggestionAction(
  title: string,
  subject: string,
  fileUrl: string,
  paper: string = "1st",
  chapter?: string,
  hscBatch?: string,
  thumbnailUrl?: string,
) {
  try {
    const res = await db.insert(pdfSuggestions).values({
      title,
      subject,
      fileUrl,
      paper,
      chapter,
      hscBatch,
      thumbnailUrl,
    }).returning();
    revalidatePath("/pdf");
    return { success: true, pdf: res[0] };
  } catch (error: any) {
    return { error: error?.message || "Failed to create PDF suggestion" };
  }
}
