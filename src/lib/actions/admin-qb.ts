"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateQuestionPayload {
  readonly subjectId: string;
  readonly chapterId: string;
  readonly type: "mcq" | "cq";
  readonly source:
    | "frostfoe"
    | "varsity"
    | "engineering"
    | "board"
    | "custom_csv_json";
  readonly standard: "board" | "varsity" | "engineering" | "medical";
  readonly year?: number;
  readonly institution?: string;
  readonly questionText: string;
  readonly explanation?: string;
  readonly mcqOptions?: readonly { optionText: string; isCorrect: boolean }[];
  readonly cqParts?: readonly {
    partKey: string;
    questionText: string;
    answerText?: string;
    marks: number;
  }[];
}

export async function createQuestionAction(payload: CreateQuestionPayload) {
  const supabase = await createClient();

  const { data: question, error: qError } = await supabase
    .from("questions")
    .insert({
      item_id: payload.subjectId,
      subitem_id: payload.chapterId,
      type: payload.type,
      source: payload.source,
      standard: payload.standard,
      year: payload.year || null,
      institution: payload.institution || null,
      question_text: payload.questionText,
      explanation: payload.explanation || null,
    })
    .select()
    .single();

  if (qError || !question) {
    return { error: qError?.message || "Failed to create question" };
  }

  if (payload.type === "mcq" && payload.mcqOptions?.length) {
    const optionsToInsert = payload.mcqOptions.map((opt, idx) => ({
      question_id: question.id,
      option_text: opt.optionText,
      is_correct: opt.isCorrect,
      order_no: idx + 1,
    }));
    await supabase.from("mcq_options").insert(optionsToInsert);
  } else if (payload.type === "cq" && payload.cqParts?.length) {
    const partsToInsert = payload.cqParts.map((part, idx) => ({
      question_id: question.id,
      part_key: part.partKey,
      question_text: part.questionText,
      answer_text: part.answerText || null,
      marks: part.marks,
      order_no: idx + 1,
    }));
    await supabase.from("cq_parts").insert(partsToInsert);
  }

  revalidatePath("/admin/qb");
  return { success: true, questionId: question.id };
}

export async function getQuestionsAdminAction(filters?: {
  subjectId?: string;
  type?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("questions")
    .select(`
      *,
      items(name),
      subitems(name, paper),
      mcq_options(*),
      cq_parts(*)
    `)
    .order("created_at", { ascending: false });

  if (filters?.subjectId) query = query.eq("item_id", filters.subjectId);
  if (filters?.type) query = query.eq("type", filters.type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteQuestionAction(questionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);
  if (error) return { error: error.message };
  revalidatePath("/admin/qb");
  return { success: true };
}
