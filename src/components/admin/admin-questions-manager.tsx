"use client";

import Link from "next/link";
import { useState } from "react";
import { NewQuestionForm } from "@/components/admin/forms/new-question-form";
import { ArrowRight2, TaskSquare, Trash2 } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAdminQuestions, useDeleteQuestion } from "@/hooks/use-admin-qb";
import type { MCQOption, Question } from "@/types";

interface AdminQuestionsManagerProps {
	readonly qbSlug: string;
	readonly subjectSlug: string;
	readonly subjectId: string;
	readonly chapterId: string;
	readonly topicName: string;
	readonly chapterSlug: string;
}

export function AdminQuestionsManager({
	qbSlug,
	subjectSlug,
	subjectId,
	chapterId,
	topicName,
	chapterSlug,
}: AdminQuestionsManagerProps) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const { data: questions, isLoading } = useAdminQuestions({ subjectId });
	const deleteMutation = useDeleteQuestion();

	const handleDelete = (questionId: string) => {
		if (confirm("এই প্রশ্নটি স্থায়ীভাবে ডিলিট করতে চান?")) {
			deleteMutation.mutate(questionId);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground flex-wrap">
				<Link
					href="/admin/qb"
					className="hover:text-foreground transition-colors"
				>
					প্রশ্নব্যাংকসমূহ
				</Link>
				<ArrowRight2 className="size-3" />
				<Link
					href={`/admin/qb/${qbSlug}`}
					className="hover:text-foreground transition-colors"
				>
					প্রশ্নব্যাংক
				</Link>
				<ArrowRight2 className="size-3" />
				<Link
					href={`/admin/qb/${qbSlug}/${subjectSlug}`}
					className="hover:text-foreground transition-colors"
				>
					বিষয়
				</Link>
				<ArrowRight2 className="size-3" />
				<Link
					href={`/admin/qb/${qbSlug}/${subjectSlug}/${chapterSlug}`}
					className="hover:text-foreground transition-colors"
				>
					অধ্যায়
				</Link>
				<ArrowRight2 className="size-3" />
				<span className="text-foreground font-semibold">{topicName}</span>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
						{topicName} - প্রশ্ন তালিকা
					</h1>
					<p className="text-muted-foreground text-sm mt-1">
						এই টপিকের জন্য নতুন MCQ/CQ প্রশ্ন যোগ করুন বা বিদ্যমান প্রশ্ন ডিলিট করুন।
					</p>
				</div>

				<Button
					onClick={() => setIsCreateOpen(true)}
					className="rounded-xl gap-2 font-bold"
				>
					+ নতুন প্রশ্ন যোগ করুন
				</Button>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold flex items-center gap-2">
						<TaskSquare className="size-5 text-primary" /> মোট প্রশ্ন (
						{questions?.length ?? 0})
					</h2>
				</div>

				{isLoading ? (
					<div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
						প্রশ্ন লোড হচ্ছে...
					</div>
				) : questions?.length === 0 ? (
					<div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
						এই টপিকে কোনো প্রশ্ন পাওয়া যায়নি।
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{questions?.map((q: Question) => (
							<Card
								key={q.id}
								className="shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between p-5 rounded-2xl border"
							>
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className="uppercase font-bold text-[10px]"
											>
												{q.type}
											</Badge>
											<Badge
												variant="secondary"
												className="capitalize text-[10px] font-semibold"
											>
												{q.source}
											</Badge>
										</div>
										<Badge className="capitalize text-[10px]">
											{q.standard}
										</Badge>
									</div>

									<p className="text-sm font-semibold text-foreground leading-relaxed">
										{q.question_text}
									</p>

									{q.type === "mcq" && (q.mcq_options?.length ?? 0) > 0 && (
										<div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border/50">
											{q.mcq_options?.map((opt: MCQOption, idx: number) => (
												<div
													key={opt.id || idx}
													className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
														opt.is_correct
															? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20"
															: "bg-muted/50 text-muted-foreground"
													}`}
												>
													<span className="font-bold">{idx + 1}.</span>
													<span className="truncate">{opt.option_text}</span>
												</div>
											))}
										</div>
									)}
								</div>

								<div className="flex items-center justify-end pt-4 mt-4 border-t border-border/40">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDelete(q.id)}
										className="text-destructive hover:bg-destructive/10 gap-1.5 rounded-xl text-xs"
									>
										<Trash2 className="size-3.5" />
										<span>ডিলিট</span>
									</Button>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>

			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{topicName} এ নতুন প্রশ্ন
						</DialogTitle>
						<DialogDescription>
							প্রশ্নের ধরন, বিবরণ ও উত্তর লিখুন।
						</DialogDescription>
					</DialogHeader>
					<NewQuestionForm
						subjectId={subjectId}
						chapterId={chapterId}
						onSuccess={() => setIsCreateOpen(false)}
						onCancel={() => setIsCreateOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
