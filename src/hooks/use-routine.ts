"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoutinesAction, createRoutineAction } from "@/lib/actions/routine";

export function useRoutines(batchId?: string) {
  return useQuery({
    queryKey: ["routines", batchId],
    queryFn: async () => {
      const res = await getRoutinesAction(batchId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      batchId: string;
      title: string;
      subject: string;
      examDate: string;
      durationMinutes: number;
      totalMarks: number;
      syllabus?: string;
    }) =>
      createRoutineAction(
        vars.batchId,
        vars.title,
        vars.subject,
        vars.examDate,
        vars.durationMinutes,
        vars.totalMarks,
        vars.syllabus,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });
}
