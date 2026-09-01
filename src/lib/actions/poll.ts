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
      where: (subitems, { and, eq, or, isNull }) => {
        const conditions = [eq(subitems.itemId, itemId)];
        if (paper && paper !== "all") {
          conditions.push(or(eq(subitems.paper, paper), isNull(subitems.paper))!);
        }
        return and(...conditions);
      },
      with: {
        questions: {
          where: (questions, { eq }) => eq(questions.type, "mcq"),
          columns: { id: true },
        },
      },
      orderBy: (subitems, { asc }) => [asc(subitems.orderNo)],
    });

    return list.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      name: item.name,
      slug: item.slug,
      paper: item.paper,
      orderNo: item.orderNo,
      questionCount: item.questions?.length || 0,
    }));
  } catch (error: unknown) {
    console.error("Error fetching poll subitems:", error);
    return [];
  }
}

export async function getPollQuestionCountAction(params: {
  itemId?: string;
  subitemId?: string;
  paper?: string;
  standard?: string;
}): Promise<number> {
  try {
    let subitemIds: string[] = [];

    if (params.subitemId && params.subitemId !== "none" && params.subitemId !== "all") {
      subitemIds = [params.subitemId];
    } else if (params.itemId && params.itemId !== "all" && params.itemId !== "none") {
      const subitemsList = await db.query.subitems.findMany({
        where: (subitems, { and, eq }) => {
          const conditions = [eq(subitems.itemId, params.itemId!)];
          if (params.paper) conditions.push(eq(subitems.paper, params.paper));
          return and(...conditions);
        },
        columns: { id: true },
      });
      subitemIds = subitemsList.map((s) => s.id);
      if (subitemIds.length === 0) return 0;
    }

    const countResult = await db.query.questions.findMany({
      where: (questions, { and, eq, inArray }) => {
        const conditions = [eq(questions.type, "mcq")];
        if (subitemIds.length > 0) {
          conditions.push(inArray(questions.subitemId, subitemIds));
        }
        if (params.standard) {
          conditions.push(
            eq(
              questions.standard,
              params.standard as "HSC" | "Varsity" | "Engineering" | "Medical",
            ),
          );
        }
        return and(...conditions);
      },
      columns: { id: true },
    });

    return countResult.length;
  } catch (error: unknown) {
    console.error("Error fetching poll questions count:", error);
    return 0;
  }
}

export async function getPollQuestionsAction(params: {
  itemId?: string;
  subitemId?: string;
  paper?: string;
  standard?: string;
  limit?: number;
}): Promise<MCQQuestion[]> {
  try {
    let subitemIds: string[] = [];

    if (params.subitemId && params.subitemId !== "none" && params.subitemId !== "all") {
      subitemIds = [params.subitemId];
    } else if (params.itemId && params.itemId !== "all" && params.itemId !== "none") {
      const subitemsList = await db.query.subitems.findMany({
        where: (subitems, { and, eq }) => {
          const conditions = [eq(subitems.itemId, params.itemId!)];
          if (params.paper) conditions.push(eq(subitems.paper, params.paper));
          return and(...conditions);
        },
        columns: { id: true },
      });
      subitemIds = subitemsList.map((s) => s.id);
      if (subitemIds.length === 0) return [];
    }

    const data = await db.query.questions.findMany({
      where: (questions, { and, eq, inArray }) => {
        const conditions = [eq(questions.type, "mcq")];
        if (subitemIds.length > 0) {
          conditions.push(inArray(questions.subitemId, subitemIds));
        }
        if (params.standard) {
          conditions.push(
            eq(
              questions.standard,
              params.standard as "HSC" | "Varsity" | "Engineering" | "Medical",
            ),
          );
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
