"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  containers,
  cqParts,
  items,
  mcqOptions,
  questions,
  subitems,
  topics,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import type { CreateQuestionPayload } from "@/types";

export interface HierarchyTopic {
  id: string;
  name: string;
  slug: string;
}

export interface HierarchyChapter {
  id: string;
  name: string;
  slug: string;
  paper?: string | null;
  topics: HierarchyTopic[];
}

export interface HierarchySubject {
  id: string;
  name: string;
  slug: string;
  code?: string | null;
  chapters: HierarchyChapter[];
}

export interface HierarchyContainer {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  subjects: HierarchySubject[];
}

export async function getFullQbHierarchy(): Promise<HierarchyContainer[]> {
  try {
    const rawContainers = await db.query.containers.findMany({
      with: {
        items: {
          with: {
            subitems: {
              with: {
                topics: true,
              },
            },
          },
        },
      },
      orderBy: (containers, { asc }) => [asc(containers.createdAt)],
    });

    return rawContainers.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      isPublic: c.isPublic,
      subjects: (c.items || []).map((itm) => ({
        id: itm.id,
        name: itm.name,
        slug: itm.slug,
        code: itm.code,
        chapters: (itm.subitems || []).map((ch) => ({
          id: ch.id,
          name: ch.name,
          slug: ch.slug,
          paper: ch.paper,
          topics: (ch.topics || []).map((tp) => ({
            id: tp.id,
            name: tp.name,
            slug: tp.slug,
          })),
        })),
      })),
    }));
  } catch (error) {
    console.error("Error fetching QB hierarchy:", error);
    return [];
  }
}

export async function createQuickQuestionAction(payload: CreateQuestionPayload) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return { success: false, message: "শুধুমাত্র অ্যাডমিন এক্সেস প্রয়োজন।" };
    }

    if (!payload.chapterId || !payload.questionText?.trim()) {
      return { success: false, message: "অধ্যায় এবং প্রশ্নের বিবরণ আবশ্যক।" };
    }

    const questionId = await db.transaction(async (tx) => {
      const [question] = await tx
        .insert(questions)
        .values({
          subitemId: payload.chapterId,
          type: payload.type,
          source: payload.source?.trim() || "Custom",
          standard:
            (payload.standard as
              | "HSC"
              | "Varsity"
              | "Engineering"
              | "Medical") || "HSC",
          questionText: payload.questionText.trim(),
          explanation: payload.explanation?.trim() || null,
          isFree: Boolean(payload.isFree),
        })
        .returning();

      if (!question) {
        throw new Error("প্রশ্ন ডাটাবেজে সংরক্ষণ করা যায়নি");
      }

      if (payload.type === "mcq" && payload.mcqOptions?.length) {
        const optionsToInsert = payload.mcqOptions.map((opt, idx: number) => ({
          questionId: question.id,
          optionText: opt.optionText.trim(),
          isCorrect: opt.isCorrect,
          orderNo: idx + 1,
        }));
        await tx.insert(mcqOptions).values(optionsToInsert);
      }

      if (payload.type === "cq" && payload.cqParts?.length) {
        const partsToInsert = payload.cqParts.map((pt, idx: number) => ({
          questionId: question.id,
          partKey: (pt.partKey as "a" | "b" | "c" | "d") || "a",
          questionText: pt.questionText.trim(),
          answerText: pt.answerText?.trim() || null,
          marks: pt.marks,
          orderNo: idx + 1,
        }));
        await tx.insert(cqParts).values(partsToInsert);
      }

      return question.id;
    });

    try {
      revalidatePath("/qb");
      revalidatePath("/admin/qb");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return {
      success: true,
      questionId,
    };
  } catch (error: unknown) {
    console.error("Error creating quick question:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "প্রশ্ন যুক্ত করতে সমস্যা হয়েছে।",
    };
  }
}

export async function getRecentUploadedQuestions(limit = 10) {
  try {
    const rawQuestions = await db.query.questions.findMany({
      limit,
      orderBy: (questions, { desc }) => [desc(questions.createdAt)],
      with: {
        mcqOptions: true,
        cqParts: true,
        subitem: {
          with: {
            item: {
              with: {
                container: true,
              },
            },
          },
        },
      },
    });

    return rawQuestions.map((q) => ({
      id: q.id,
      type: q.type,
      source: q.source,
      standard: q.standard,
      questionText: q.questionText,
      explanation: q.explanation,
      isFree: q.isFree,
      createdAt: q.createdAt,
      chapterName: q.subitem?.name || "অজ্ঞাত অধ্যায়",
      subjectName: q.subitem?.item?.name || "অজ্ঞাত বিষয়",
      containerTitle: q.subitem?.item?.container?.title || "অজ্ঞাত প্রশ্নব্যাংক",
      mcqOptions: q.mcqOptions.map((o) => ({
        id: o.id,
        optionText: o.optionText,
        isCorrect: o.isCorrect,
      })),
      cqParts: q.cqParts.map((p) => ({
        id: p.id,
        partKey: p.partKey,
        questionText: p.questionText,
        marks: p.marks,
      })),
    }));
  } catch (error) {
    console.error("Error fetching recent questions:", error);
    return [];
  }
}
