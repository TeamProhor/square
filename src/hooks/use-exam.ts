"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPublishedExams,
  getStudentExams,
  type SubmitResponsePayload,
  startExamAction,
  submitExamAction,
} from "@/lib/actions/exam";

export function usePublishedExams() {
  return useQuery({
    queryKey: ["publishedExams"],
    queryFn: async () => {
      const res = await getPublishedExams();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
}

export function useStudentExams(userId: string) {
  return useQuery({
    queryKey: ["studentExams", userId],
    queryFn: async () => {
      const res = await getStudentExams(userId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useStartExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      examId: string;
      userId: string;
      batchExamId?: string;
    }) => startExamAction(vars.examId, vars.userId, vars.batchExamId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["exam", vars.examId] });
      queryClient.invalidateQueries({ queryKey: ["submissions", vars.userId] });
    },
  });
}

export function useSubmitExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      submissionId: string;
      responses: SubmitResponsePayload[];
      timeTakenSeconds: number;
    }) =>
      submitExamAction(
        vars.submissionId,
        vars.responses,
        vars.timeTakenSeconds,
      ),
    onSuccess: (_, _vars) => {
      // Invalidate relevant queries; since we don't have user id here easily,
      // we might want to invalidate all submissions just in case, or let the component do it.
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
