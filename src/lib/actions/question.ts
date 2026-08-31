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

export interface ImportDefaults {
  type?: "mcq" | "cq";
  standard?: string;
  source?: string;
  isFree?: boolean;
  topicId?: string;
}

export async function importQuestionsAction(
  chapterId: string,
  questionsList: readonly any[],
  topicIdOrDefaults?: string | ImportDefaults,
) {
  try {
    if (!questionsList || questionsList.length === 0) {
      return { error: "কোনো প্রশ্ন প্রদান করা হয়নি।" };
    }

    const defaults: ImportDefaults =
      typeof topicIdOrDefaults === "string"
        ? { topicId: topicIdOrDefaults }
        : topicIdOrDefaults || {};

    const insertedCount = await db.transaction(async (tx) => {
      let count = 0;

      for (const item of questionsList) {
        const qText = (
          item.questionText ||
          item.question_text ||
          item.question ||
          ""
        ).trim();
        if (!qText) continue;

        const resolvedType = (item.type || defaults.type || "mcq") === "cq" ? "cq" : "mcq";
        const resolvedStandard = (
          item.standard ||
          defaults.standard ||
          "HSC"
        ) as "HSC" | "Varsity" | "Engineering" | "Medical";
        const resolvedSource = (item.source || defaults.source || "Custom").trim();
        const resolvedIsFree = Boolean(
          item.isFree ?? item.is_free ?? defaults.isFree ?? false,
        );
        const resolvedTopicId = item.topicId || item.topic_id || defaults.topicId || null;
        const resolvedExplanation = (item.explanation || item.solution || "").trim() || null;

        const [question] = await tx
          .insert(questions)
          .values({
            subitemId: chapterId,
            topicId: resolvedTopicId,
            type: resolvedType,
            source: resolvedSource,
            standard: resolvedStandard,
            questionText: qText,
            explanation: resolvedExplanation,
            isFree: resolvedIsFree,
          })
          .returning();

        if (!question) continue;
        count++;

        // Handle MCQ Options
        if (resolvedType === "mcq") {
          const rawOptions = item.mcqOptions || item.mcq_options || item.options || [];
          if (Array.isArray(rawOptions) && rawOptions.length > 0) {
            const correctIndex =
              typeof item.correctIdx === "number"
                ? item.correctIdx
                : typeof item.correctIndex === "number"
                  ? item.correctIndex
                  : typeof item.correctOption === "number"
                    ? item.correctOption
                    : -1;

            const optionsToInsert = rawOptions.map((opt: any, idx: number) => {
              const optText = (
                typeof opt === "string"
                  ? opt
                  : opt.optionText || opt.option_text || opt.text || ""
              ).trim();

              const isOptCorrect =
                typeof opt === "object" && opt !== null && "isCorrect" in opt
                  ? Boolean(opt.isCorrect)
                  : typeof opt === "object" && opt !== null && "is_correct" in opt
                    ? Boolean(opt.is_correct)
                    : correctIndex === idx;

              return {
                questionId: question.id,
                optionText: optText,
                isCorrect: isOptCorrect,
                orderNo: idx + 1,
              };
            });

            // Ensure at least one option is marked correct if not already
            if (!optionsToInsert.some((o) => o.isCorrect) && optionsToInsert.length > 0) {
              optionsToInsert[0].isCorrect = true;
            }

            await tx.insert(mcqOptions).values(optionsToInsert);
          }
        } else if (resolvedType === "cq") {
          // Handle CQ Parts
          const rawParts = item.cqParts || item.cq_parts || item.parts || [];
          if (Array.isArray(rawParts) && rawParts.length > 0) {
            const defaultKeys: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];
            const partsToInsert = rawParts.map((pt: any, idx: number) => ({
              questionId: question.id,
              partKey: (pt.partKey || pt.part_key || defaultKeys[idx] || "a") as
                | "a"
                | "b"
                | "c"
                | "d",
              questionText: (pt.questionText || pt.question_text || pt.text || "").trim(),
              answerText: (pt.answerText || pt.answer_text || pt.answer || "").trim() || null,
              marks: typeof pt.marks === "number" ? pt.marks : idx + 1,
              orderNo: idx + 1,
            }));
            await tx.insert(cqParts).values(partsToInsert);
          }
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
