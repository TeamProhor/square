"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

export async function createContainerAction(
  title: string,
  slug: string,
  description?: string,
) {
  try {
    await db.insert(containers).values({
      title,
      slug,
      description,
    });
    revalidatePath("/admin/qb");
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create container",
    };
  }
}

export async function deleteContainerAction(id: string) {
  try {
    await db.delete(containers).where(eq(containers.id, id));
    revalidatePath("/admin/qb");
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete container",
    };
  }
}

export async function createItemAction(
  containerId: string,
  qbSlug: string,
  idOrName: string,
  slug: string,
  name?: string,
  code?: string,
) {
  try {
    const finalName = name || idOrName;
    const finalId = slug || idOrName;
    await db.insert(items).values({
      id: finalId,
      containerId,
      name: finalName,
      slug,
      code,
    });
    revalidatePath(`/admin/qb/${qbSlug}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to create item",
    };
  }
}

export async function deleteItemAction(itemId: string, qbSlug: string) {
  try {
    await db.delete(items).where(eq(items.id, itemId));
    revalidatePath(`/admin/qb/${qbSlug}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete item",
    };
  }
}

export async function createSubitemAction(
  itemId: string,
  qbSlug: string,
  itemSlug: string,
  name: string,
  slug: string,
  paper?: string,
) {
  try {
    await db.insert(subitems).values({
      itemId,
      name,
      slug,
      paper,
    });
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create subitem",
    };
  }
}

export async function deleteSubitemAction(
  subitemId: string,
  qbSlug: string,
  itemSlug: string,
) {
  try {
    await db.delete(subitems).where(eq(subitems.id, subitemId));
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete subitem",
    };
  }
}

export async function createTopicAction(
  subitemId: string,
  qbSlug: string,
  itemSlug: string,
  subitemSlug: string,
  name: string,
  slug: string,
) {
  try {
    await db.insert(topics).values({
      subitemId,
      name,
      slug,
    });
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}/${subitemSlug}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to create topic",
    };
  }
}

export async function deleteTopicAction(
  topicId: string,
  qbSlug: string,
  itemSlug: string,
  subitemSlug: string,
) {
  try {
    await db.delete(topics).where(eq(topics.id, topicId));
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}/${subitemSlug}`);
    return { success: true };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete topic",
    };
  }
}

import type { CreateQuestionPayload } from "@/types";

export async function createQuestionAction(payload: CreateQuestionPayload) {
  try {
    const [question] = await db
      .insert(questions)
      .values({
        subitemId: payload.chapterId,
        type: payload.type,
        source: payload.source,
        standard: payload.standard || "board",
        questionText: payload.questionText,
        explanation: payload.explanation || null,
      })
      .returning();

    if (!question) {
      return { error: "Failed to create question" };
    }

    if (payload.type === "mcq" && payload.mcqOptions?.length) {
      const optionsToInsert = payload.mcqOptions.map((opt, idx: number) => ({
        questionId: question.id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        orderNo: idx + 1,
      }));
      await db.insert(mcqOptions).values(optionsToInsert);
    } else if (payload.type === "cq" && payload.cqParts?.length) {
      const partsToInsert = payload.cqParts.map((pt, idx: number) => ({
        questionId: question.id,
        partKey: pt.partKey as "a" | "b" | "c" | "d",
        questionText: pt.questionText,
        answerText: pt.answerText || null,
        marks: pt.marks,
        orderNo: idx + 1,
      }));
      await db.insert(cqParts).values(partsToInsert);
    }

    revalidatePath("/admin/qb");
    return { success: true, questionId: question.id };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create question",
    };
  }
}

export async function deleteQuestionAction(questionId: string) {
  try {
    await db.delete(questions).where(eq(questions.id, questionId));
    revalidatePath("/admin/qb");
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete question",
    };
  }
}

export async function getQuestionsAdminAction(filters?: {
  subjectId?: string;
  type?: string;
}) {
  try {
    const list = await db.query.questions.findMany({
      where: (questions, { and, eq }) => {
        const conditions = [];
        if (filters?.type) {
          conditions.push(eq(questions.type, filters.type as "mcq" | "cq"));
        }
        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      with: {
        mcqOptions: true,
        cqParts: true,
      },
      orderBy: (questions, { desc }) => [desc(questions.createdAt)],
    });
    return list || [];
  } catch (error: unknown) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
