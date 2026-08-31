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
import type { CreateQuestionPayload, ImportQuestionItem } from "@/types";

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

export async function createQuestionAction(payload: CreateQuestionPayload) {
  try {
    const questionId = await db.transaction(async (tx) => {
      const [question] = await tx
        .insert(questions)
        .values({
          subitemId: payload.chapterId,
          type: payload.type,
          source: payload.source || "custom",
          standard:
            (payload.standard as
              | "HSC"
              | "Varsity"
              | "Engineering"
              | "Medical") || "HSC",
          questionText: payload.questionText,
          explanation: payload.explanation || null,
          isFree: Boolean(payload.isFree),
        })
        .returning();

      if (!question) {
        throw new Error("Failed to create question");
      }

      if (payload.type === "mcq" && payload.mcqOptions?.length) {
        const optionsToInsert = payload.mcqOptions.map((opt, idx: number) => ({
          questionId: question.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          orderNo: idx + 1,
        }));
        await tx.insert(mcqOptions).values(optionsToInsert);
      } else if (payload.type === "cq" && payload.cqParts?.length) {
        const partsToInsert = payload.cqParts.map((pt, idx: number) => ({
          questionId: question.id,
          partKey: pt.partKey as "a" | "b" | "c" | "d",
          questionText: pt.questionText,
          answerText: pt.answerText || null,
          marks: pt.marks,
          orderNo: idx + 1,
        }));
        await tx.insert(cqParts).values(partsToInsert);
      }

      return question.id;
    });

    revalidatePath("/admin/qb");
    return { success: true, questionId };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create question",
    };
  }
}

export async function updateQuestionAction(
  id: string,
  payload: Partial<CreateQuestionPayload>,
) {
  try {
    await db.transaction(async (tx) => {
      const updateData: Record<string, unknown> = {};
      if (payload.type !== undefined) updateData.type = payload.type;
      if (payload.source !== undefined)
        updateData.source = payload.source || "custom";
      if (payload.standard !== undefined)
        updateData.standard = payload.standard;
      if (payload.questionText !== undefined)
        updateData.questionText = payload.questionText;
      if (payload.explanation !== undefined)
        updateData.explanation = payload.explanation || null;
      if (payload.isFree !== undefined)
        updateData.isFree = payload.isFree;

      if (Object.keys(updateData).length > 0) {
        await tx.update(questions).set(updateData).where(eq(questions.id, id));
      }

      if (payload.type === "mcq" && payload.mcqOptions) {
        await tx.delete(mcqOptions).where(eq(mcqOptions.questionId, id));
        if (payload.mcqOptions.length > 0) {
          const optionsToInsert = payload.mcqOptions.map(
            (opt, idx: number) => ({
              questionId: id,
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              orderNo: idx + 1,
            }),
          );
          await tx.insert(mcqOptions).values(optionsToInsert);
        }
      } else if (payload.type === "cq" && payload.cqParts) {
        await tx.delete(cqParts).where(eq(cqParts.questionId, id));
        if (payload.cqParts.length > 0) {
          const partsToInsert = payload.cqParts.map((pt, idx: number) => ({
            questionId: id,
            partKey: pt.partKey as "a" | "b" | "c" | "d",
            questionText: pt.questionText,
            answerText: pt.answerText || null,
            marks: pt.marks,
            orderNo: idx + 1,
          }));
          await tx.insert(cqParts).values(partsToInsert);
        }
      }
    });

    revalidatePath("/admin/qb");
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update question",
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

export async function importQuestionsAction(
  chapterId: string,
  questionsList: readonly ImportQuestionItem[],
  topicId?: string,
) {
  try {
    if (!questionsList || questionsList.length === 0) {
      return { error: "কোনো প্রশ্ন প্রদান করা হয়নি।" };
    }

    const insertedCount = await db.transaction(async (tx) => {
      let count = 0;

      for (const item of questionsList) {
        const qText = item.questionText?.trim();
        if (!qText) continue;

        const [question] = await tx
          .insert(questions)
          .values({
            subitemId: chapterId,
            topicId: topicId || null,
            type: item.type === "cq" ? "cq" : "mcq",
            source: item.source?.trim() || "Custom",
            standard: item.standard || "HSC",
            questionText: qText,
            explanation: item.explanation?.trim() || null,
          })
          .returning();

        if (!question) continue;
        count++;

        if (item.type === "mcq" && item.mcqOptions?.length) {
          const optionsToInsert = item.mcqOptions.map((opt, idx: number) => ({
            questionId: question.id,
            optionText: opt.optionText?.trim() || "",
            isCorrect: Boolean(opt.isCorrect),
            orderNo: idx + 1,
          }));
          await tx.insert(mcqOptions).values(optionsToInsert);
        } else if (item.type === "cq" && item.cqParts?.length) {
          const defaultKeys: Array<"a" | "b" | "c" | "d"> = [
            "a",
            "b",
            "c",
            "d",
          ];
          const partsToInsert = item.cqParts.map((pt, idx: number) => ({
            questionId: question.id,
            partKey: (pt.partKey || defaultKeys[idx] || "a") as
              | "a"
              | "b"
              | "c"
              | "d",
            questionText: pt.questionText?.trim() || "",
            answerText: pt.answerText?.trim() || null,
            marks: pt.marks || idx + 1,
            orderNo: idx + 1,
          }));
          await tx.insert(cqParts).values(partsToInsert);
        }
      }

      return count;
    });

    revalidatePath("/admin/qb");
    return { success: true, count: insertedCount };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "প্রশ্ন ইমপোর্ট করতে ব্যর্থ হয়েছে",
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
