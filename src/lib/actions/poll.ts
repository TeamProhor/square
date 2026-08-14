"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { pollOptions, pollVotes } from "@/db/schema";
import type { MCQQuestion } from "@/types";

export async function getPollItemsAction() {
  try {
    const list = await db.query.items.findMany({
      orderBy: (items, { asc }) => [asc(items.name)],
    });
    return list;
  } catch (error: unknown) {
    console.error("Error fetching poll items:", error);
    return [];
  }
}

export const getPollSubjectsAction = getPollItemsAction;

export async function getPollSubitemsAction(itemId: string, paper?: string) {
  try {
    const list = await db.query.subitems.findMany({
      where: (subitems, { and, eq }) => {
        const conditions = [eq(subitems.itemId, itemId)];
        if (paper) {
          conditions.push(eq(subitems.paper, paper));
        }
        return and(...conditions);
      },
      orderBy: (subitems, { asc }) => [asc(subitems.orderNo)],
    });
    return list;
  } catch (error: unknown) {
    console.error("Error fetching poll subitems:", error);
    return [];
  }
}

export async function getPollQuestionsAction(params: {
  itemId: string;
  subitemId?: string;
  paper?: string;
  standard?: string;
  limit?: number;
}): Promise<MCQQuestion[]> {
  try {
    const data = await db.query.questions.findMany({
      where: (questions, { and, eq }) => {
        const conditions = [eq(questions.type, "mcq")];
        if (
          params.subitemId &&
          params.subitemId !== "none" &&
          params.subitemId !== "all"
        ) {
          conditions.push(eq(questions.subitemId, params.subitemId));
        }
        if (params.standard) {
          conditions.push(eq(questions.standard, params.standard));
        }
        return and(...conditions);
      },
      with: {
        mcqOptions: true,
      },
    });

    if (!data || data.length === 0) {
      return [];
    }

    const limit = params.limit || 20;
    const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, limit);

    return shuffled.map((q) => {
      const rawOptions = q.mcqOptions || [];
      const sortedOptions = [...rawOptions].sort(
        (a, b) => a.orderNo - b.orderNo,
      );
      const optionsText = sortedOptions.map((opt) => opt.optionText);
      const correctIdx = sortedOptions.findIndex((opt) => opt.isCorrect);

      return {
        question: q.questionText,
        options: optionsText,
        correctIdx: correctIdx >= 0 ? correctIdx : 0,
        explanation: q.explanation || "",
      };
    });
  } catch (error: unknown) {
    console.error("Error or no questions found from QB:", error);
    return [];
  }
}

export async function votePollAction(
  pollId: string,
  pollOptionId: string,
  userId: string,
) {
  try {
    await db.insert(pollVotes).values({
      pollId,
      pollOptionId,
      userId,
    });
    await db
      .update(pollOptions)
      .set({
        votesCount: sql`${pollOptions.votesCount} + 1`,
      })
      .where(eq(pollOptions.id, pollOptionId));

    revalidatePath("/poll");
    return { success: true };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to vote",
    };
  }
}
