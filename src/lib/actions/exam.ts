"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { examSubmissions } from "@/db/schema";

export async function getExamsAction() {
	try {
		const list = await db.query.exams.findMany({
			orderBy: (exams, { desc }) => [desc(exams.createdAt)],
		});
		return { data: list };
	} catch (error: any) {
		return { error: error?.message || "Failed to fetch exams" };
	}
}

export async function submitExamAction(
	examId: string,
	userId: string,
	score: string,
	totalMarks: number,
	timeTakenSeconds: number,
) {
	try {
		const res = await db
			.insert(examSubmissions)
			.values({
				examId,
				userId,
				score,
				totalMarks,
				timeTakenSeconds,
			})
			.returning();
		revalidatePath(`/exams/${examId}`);
		return { success: true, submission: res[0] };
	} catch (error: any) {
		return { error: error?.message || "Failed to submit exam" };
	}
}
