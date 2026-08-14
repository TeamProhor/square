"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateRoutinePayload,
  createExamRoutine,
  deleteExamRoutine,
  getBatches,
  getExamRoutines,
} from "@/lib/actions/routine";

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: () => getBatches(),
  });
}

export function useRoutines(batchId?: string) {
  return useQuery({
    queryKey: ["routines", batchId],
    queryFn: () => getExamRoutines(batchId),
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoutinePayload) => {
      const res = await createExamRoutine(payload);
      if (!res.success)
        throw new Error(res.message || "Failed to create routine");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
      queryClient.invalidateQueries({ queryKey: ["admin-routines"] });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteExamRoutine(id);
      if (!res.success)
        throw new Error(res.message || "Failed to delete routine");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
      queryClient.invalidateQueries({ queryKey: ["admin-routines"] });
    },
  });
}
