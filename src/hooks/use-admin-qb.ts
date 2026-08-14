"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateQuestionPayload,
  createQuestionAction,
  deleteQuestionAction,
  getQuestionsAdminAction,
} from "@/lib/actions/admin-qb";

export function useAdminQuestions(filters?: {
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
