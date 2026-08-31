"use server";

import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  courseClasses,
  coursePdfs,
  batches,
  batchExams,
  exams,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import type { CourseClass, CoursePdf } from "@/types";

export interface CreateClassPayload {
  batchId: string;
  title: string;
  subject: string;
  chapter?: string;
  youtubeUrl: string;
  description?: string;
  durationMinutes?: number;
  orderIndex?: number;
  isLive?: boolean;
}

export interface UpdateClassPayload {
  title?: string;
  subject?: string;
  chapter?: string;
  youtubeUrl?: string;
  description?: string;
  durationMinutes?: number;
  orderIndex?: number;
  isLive?: boolean;
  isPublished?: boolean;
}

export interface CreatePdfPayload {
  batchId: string;
  title: string;
  subject: string;
  chapter?: string;
  pdfUrl: string;
  description?: string;
  fileSize?: string;
  orderIndex?: number;
}

export interface UpdatePdfPayload {
  title?: string;
  subject?: string;
  chapter?: string;
  pdfUrl?: string;
  description?: string;
  fileSize?: string;
  orderIndex?: number;
  isPublished?: boolean;
}

export async function getBatchClasses(batchId: string): Promise<CourseClass[]> {
  try {
    const rows = await db
      .select()
      .from(courseClasses)
      .where(eq(courseClasses.batchId, batchId))
      .orderBy(asc(courseClasses.orderIndex), asc(courseClasses.createdAt));

    return rows.map((r) => ({
      id: r.id,
      batchId: r.batchId,
      title: r.title,
      subject: r.subject,
      chapter: r.chapter,
      youtubeUrl: r.youtubeUrl,
      description: r.description,
      durationMinutes: r.durationMinutes,
      orderIndex: r.orderIndex,
      isLive: r.isLive,
      isPublished: r.isPublished,
      createdAt:
        r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt),
      updatedAt:
        r.updatedAt instanceof Date ? r.updatedAt : new Date(r.updatedAt),
    }));
  } catch (error) {
    console.error("Error fetching batch classes:", error);
    return [];
  }
}

export async function createBatchClass(
  payload: CreateClassPayload,
): Promise<{ success: boolean; data?: CourseClass; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    if (
      !payload.batchId ||
      !payload.title?.trim() ||
      !payload.youtubeUrl?.trim()
    ) {
      return {
        success: false,
        message: "ব্যাচ, ক্লাসের শিরোনাম এবং ইউটিউব লিঙ্ক আবশ্যক।",
      };
    }

    const [newClass] = await db
      .insert(courseClasses)
      .values({
        batchId: payload.batchId,
        title: payload.title.trim(),
        subject: payload.subject?.trim() || "সাধারণ",
        chapter: payload.chapter?.trim() || null,
        youtubeUrl: payload.youtubeUrl.trim(),
        description: payload.description?.trim() || null,
        durationMinutes: payload.durationMinutes || 60,
        orderIndex: payload.orderIndex || 0,
        isLive: Boolean(payload.isLive),
        isPublished: true,
      })
      .returning();

    try {
      revalidatePath(`/my-courses/${payload.batchId}`);
      revalidatePath(`/admin/batches/${payload.batchId}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return {
      success: true,
      data: {
        id: newClass.id,
        batchId: newClass.batchId,
        title: newClass.title,
        subject: newClass.subject,
        chapter: newClass.chapter,
        youtubeUrl: newClass.youtubeUrl,
        description: newClass.description,
        durationMinutes: newClass.durationMinutes,
        orderIndex: newClass.orderIndex,
        isLive: newClass.isLive,
        isPublished: newClass.isPublished,
        createdAt: newClass.createdAt,
        updatedAt: newClass.updatedAt,
      },
    };
  } catch (error: unknown) {
    console.error("Error creating class:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "ক্লাস যুক্ত করতে সমস্যা হয়েছে।",
    };
  }
}

export async function updateBatchClass(
  id: string,
  payload: UpdateClassPayload,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    await db
      .update(courseClasses)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(courseClasses.id, id));

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating class:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "ক্লাস আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function deleteBatchClass(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    await db.delete(courseClasses).where(eq(courseClasses.id, id));
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting class:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "ক্লাস মুছতে সমস্যা হয়েছে।",
    };
  }
}

export async function getBatchPdfs(batchId: string): Promise<CoursePdf[]> {
  try {
    const rows = await db
      .select()
      .from(coursePdfs)
      .where(eq(coursePdfs.batchId, batchId))
      .orderBy(asc(coursePdfs.orderIndex), asc(coursePdfs.createdAt));

    return rows.map((r) => ({
      id: r.id,
      batchId: r.batchId,
      title: r.title,
      subject: r.subject,
      chapter: r.chapter,
      pdfUrl: r.pdfUrl,
      description: r.description,
      fileSize: r.fileSize,
      orderIndex: r.orderIndex,
      isPublished: r.isPublished,
      createdAt:
        r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt),
      updatedAt:
        r.updatedAt instanceof Date ? r.updatedAt : new Date(r.updatedAt),
    }));
  } catch (error) {
    console.error("Error fetching batch pdfs:", error);
    return [];
  }
}

export async function createBatchPdf(
  payload: CreatePdfPayload,
): Promise<{ success: boolean; data?: CoursePdf; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    if (!payload.batchId || !payload.title?.trim() || !payload.pdfUrl?.trim()) {
      return {
        success: false,
        message: "ব্যাচ, পিডিএফের শিরোনাম এবং লিঙ্ক আবশ্যক।",
      };
    }

    const [newPdf] = await db
      .insert(coursePdfs)
      .values({
        batchId: payload.batchId,
        title: payload.title.trim(),
        subject: payload.subject?.trim() || "সাধারণ",
        chapter: payload.chapter?.trim() || null,
        pdfUrl: payload.pdfUrl.trim(),
        description: payload.description?.trim() || null,
        fileSize: payload.fileSize?.trim() || null,
        orderIndex: payload.orderIndex || 0,
        isPublished: true,
      })
      .returning();

    try {
      revalidatePath(`/my-courses/${payload.batchId}`);
      revalidatePath(`/admin/batches/${payload.batchId}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return {
      success: true,
      data: {
        id: newPdf.id,
        batchId: newPdf.batchId,
        title: newPdf.title,
        subject: newPdf.subject,
        chapter: newPdf.chapter,
        pdfUrl: newPdf.pdfUrl,
        description: newPdf.description,
        fileSize: newPdf.fileSize,
        orderIndex: newPdf.orderIndex,
        isPublished: newPdf.isPublished,
        createdAt: newPdf.createdAt,
        updatedAt: newPdf.updatedAt,
      },
    };
  } catch (error: unknown) {
    console.error("Error creating pdf:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "পিডিএফ যুক্ত করতে সমস্যা হয়েছে।",
    };
  }
}

export async function updateBatchPdf(
  id: string,
  payload: UpdatePdfPayload,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    await db
      .update(coursePdfs)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(coursePdfs.id, id));

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating pdf:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "পিডিএফ আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function deleteBatchPdf(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    await db.delete(coursePdfs).where(eq(coursePdfs.id, id));
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting pdf:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "পিডিএফ মুছতে সমস্যা হয়েছে।",
    };
  }
}

export async function getBatchClassroomData(batchId: string) {
  try {
    const [batch, classes, pdfs, batchExamsData] = await Promise.all([
      db.query.batches.findFirst({
        where: eq(batches.id, batchId),
        with: {
          details: true,
        },
      }),
      db
        .select()
        .from(courseClasses)
        .where(eq(courseClasses.batchId, batchId))
        .orderBy(asc(courseClasses.orderIndex), asc(courseClasses.createdAt)),
      db
        .select()
        .from(coursePdfs)
        .where(eq(coursePdfs.batchId, batchId))
        .orderBy(asc(coursePdfs.orderIndex), asc(coursePdfs.createdAt)),
      db
        .select({
          id: batchExams.id,
          batchId: batchExams.batchId,
          examId: batchExams.examId,
          startsAt: batchExams.startsAt,
          endsAt: batchExams.endsAt,
          exam: exams,
        })
        .from(batchExams)
        .innerJoin(exams, eq(batchExams.examId, exams.id))
        .where(eq(batchExams.batchId, batchId))
        .orderBy(desc(exams.createdAt)),
    ]);

    return {
      batch,
      classes: classes.map((c) => ({
        ...c,
        createdAt:
          c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt),
        updatedAt:
          c.updatedAt instanceof Date ? c.updatedAt : new Date(c.updatedAt),
      })),
      pdfs: pdfs.map((p) => ({
        ...p,
        createdAt:
          p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
        updatedAt:
          p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt),
      })),
      exams: batchExamsData,
    };
  } catch (error) {
    console.error("Error fetching batch classroom data:", error);
    return {
      batch: null,
      classes: [],
      pdfs: [],
      exams: [],
    };
  }
}
