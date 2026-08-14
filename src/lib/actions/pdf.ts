"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { pdfSuggestions } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { PdfSuggestion } from "@/types";

export interface CreatePdfPayload {
  title: string;
  subject: string;
  paper?: string;
  chapter?: string;
  hscBatch?: string;
  fileUrl: string;
  isFeatured?: boolean;
}

export async function getPdfSuggestions(filter?: {
  subject?: string;
  paper?: string;
  chapter?: string;
}): Promise<PdfSuggestion[]> {
  try {
    const data = await db
      .select()
      .from(pdfSuggestions)
      .orderBy(desc(pdfSuggestions.createdAt));

    return data.filter((item) => {
      if (
        filter?.subject &&
        filter.subject !== "all" &&
        item.subject.toLowerCase() !== filter.subject.toLowerCase()
      ) {
        return false;
      }
      if (
        filter?.paper &&
        filter.paper !== "all" &&
        item.paper !== filter.paper
      ) {
        return false;
      }
      if (
        filter?.chapter &&
        item.chapter &&
        item.chapter.toLowerCase() !== filter.chapter.toLowerCase()
      ) {
        return false;
      }
      return true;
    }) as PdfSuggestion[];
  } catch (error) {
    console.error("Error fetching PDF suggestions:", error);
    return [];
  }
}

export async function createPdfSuggestion(
  payload: CreatePdfPayload,
): Promise<{ success: boolean; data?: PdfSuggestion; message?: string }> {
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
      !payload.fileUrl?.trim()
    ) {
      return { success: false, message: "শিরোনাম, বিষয় এবং ড্রাইভ লিংক আবশ্যক।" };
    }

    const [newPdf] = await db
      .insert(pdfSuggestions)
      .values({
        title: payload.title.trim(),
        subject: payload.subject.trim(),
        paper: payload.paper || "1st",
        chapter: payload.chapter?.trim() || null,
        hscBatch: payload.hscBatch?.trim() || null,
        fileUrl: payload.fileUrl.trim(),
        isFeatured: Boolean(payload.isFeatured),
      })
      .returning();

    revalidatePath("/pdf");
    revalidatePath("/admin/pdf");

    return { success: true, data: newPdf as PdfSuggestion };
  } catch (error: unknown) {
    console.error("Error creating PDF suggestion:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "পিডিএফ যুক্ত করতে ব্যর্থ হয়েছে।",
    };
  }
}

export async function deletePdfSuggestion(
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
      return { success: false, message: "পিডিএফ আইডি আবশ্যক।" };
    }

    await db.delete(pdfSuggestions).where(eq(pdfSuggestions.id, id));

    revalidatePath("/pdf");
    revalidatePath("/admin/pdf");

    return { success: true, message: "পিডিএফ সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error: unknown) {
    console.error("Error deleting PDF suggestion:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "পিডিএফ মুছতে ব্যর্থ হয়েছে।",
    };
  }
}
