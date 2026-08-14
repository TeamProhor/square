"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPdfSuggestionAction,
	getPdfSuggestionsAction,
} from "@/lib/actions/pdf";

export function usePdfSuggestions(subject?: string) {
	return useQuery({
		queryKey: ["pdfSuggestions", subject],
		queryFn: async () => {
			const res = await getPdfSuggestionsAction(subject);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
	});
}

export function useCreatePdfSuggestion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (vars: {
			title: string;
			subject: string;
			fileUrl: string;
			paper?: string;
			chapter?: string;
			hscBatch?: string;
			thumbnailUrl?: string;
		}) =>
			createPdfSuggestionAction(
				vars.title,
				vars.subject,
				vars.fileUrl,
				vars.paper,
				vars.chapter,
				vars.hscBatch,
				vars.thumbnailUrl,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pdfSuggestions"] });
		},
	});
}
