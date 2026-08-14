"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getExamsAction, submitExamAction } from "@/lib/actions/exam";

export function useExams() {
	return useQuery({
		queryKey: ["exams"],
		queryFn: async () => {
			const res = await getExamsAction();
			if (res.error) throw new Error(res.error);
			return res.data;
		},
	});
}

export function useSubmitExam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (vars: {
			examId: string;
			userId: string;
			score: string;
			totalMarks: number;
			timeTakenSeconds: number;
		}) =>
			submitExamAction(
				vars.examId,
				vars.userId,
				vars.score,
				vars.totalMarks,
				vars.timeTakenSeconds,
			),
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: ["exam", vars.examId] });
			queryClient.invalidateQueries({ queryKey: ["submissions", vars.userId] });
		},
	});
}
