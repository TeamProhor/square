"use client";

import { useQuery } from "@tanstack/react-query";
import { getBatchesAction } from "@/lib/actions/batch";

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
