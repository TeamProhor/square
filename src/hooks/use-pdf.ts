"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreatePdfPayload,
  createPdfSuggestion,
  deletePdfSuggestion,
  getPdfSuggestions,
} from "@/lib/actions/pdf";

export function usePdfSuggestions(filter?: {
  subject?: string;
  paper?: string;
  chapter?: string;
}) {
  return useQuery({
    queryKey: ["pdfSuggestions", filter],
    queryFn: () => getPdfSuggestions(filter),
  });
}

export function useCreatePdfSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePdfPayload) => {
      const res = await createPdfSuggestion(payload);
      if (!res.success) throw new Error(res.message || "Failed to create PDF");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdfSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pdf-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["pdf-suggestions"] });
    },
  });
}

export function useDeletePdfSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deletePdfSuggestion(id);
      if (!res.success) throw new Error(res.message || "Failed to delete PDF");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdfSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pdf-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["pdf-suggestions"] });
    },
  });
}
