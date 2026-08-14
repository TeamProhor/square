"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBatchesAction, createBatchAction } from "@/lib/actions/batch";

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await getBatchesAction();
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      name: string;
      slug: string;
      hscYear: string;
      description?: string;
    }) =>
      createBatchAction(vars.name, vars.slug, vars.hscYear, vars.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}
