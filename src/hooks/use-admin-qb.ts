"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuestionAction,
  deleteQuestionAction,
  getQuestionsAdminAction,
  importQuestionsAction,
  updateQuestionAction,
} from "@/lib/actions/question";
import type { CreateQuestionPayload, ImportQuestionItem } from "@/types";

export function useAdminQuestions(filters?: {
  chapterId?: string;
  topicId?: string;
  subjectId?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: ["admin-questions", filters],
    queryFn: async () => {
      return await getQuestionsAdminAction(filters);
    },
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuestionPayload) => {
      const res = await createQuestionAction(payload);
      if (res.error) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateQuestionPayload>;
    }) => {
      const res = await updateQuestionAction(id, payload);
      if (res.error) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });
}

export function useImportQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chapterId,
      questionsList,
      topicId,
    }: {
      chapterId: string;
      questionsList: readonly ImportQuestionItem[];
      topicId?: string;
    }) => {
      const res = await importQuestionsAction(
        chapterId,
        questionsList,
        topicId,
      );
      if (res.error) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const res = await deleteQuestionAction(questionId);
      if (res.error) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });
}
