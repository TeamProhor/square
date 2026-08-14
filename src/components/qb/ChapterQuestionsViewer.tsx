"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Lightbulb } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CQPart, MCQOption, Question, Topic } from "@/types";

interface ChapterQuestionsViewerProps {
	readonly topics: Topic[];
	readonly questions: Question[];
}

const OPTION_KEYS = ["ক", "খ", "গ", "ঘ", "ঙ"];

export function ChapterQuestionsViewer({
	topics,
	questions,
}: ChapterQuestionsViewerProps) {
	const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedSource, setSelectedSource] = useState<string | null>(null);

	const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
	const [revealedSolutions, setRevealedSolutions] = useState<
		Record<string, boolean>
	>({});
	const [revealedCqAnswers, setRevealedCqAnswers] = useState<
		Record<string, boolean>
	>({});

	const availableSources = Array.from(
		new Set(questions.map((q) => q.source)),
	).filter(Boolean) as string[];
	const availableTypes = Array.from(
		new Set(questions.map((q) => q.type)),
	).filter(Boolean) as string[];

	const filteredQuestions = questions.filter((q) => {
		if (selectedTopicId && q.topic_id !== selectedTopicId) return false;
		if (selectedType && q.type !== selectedType) return false;
		if (selectedSource && q.source !== selectedSource) return false;
		return true;
	});

	const handleSelectOption = (questionId: string, optionId: string) => {
		if (userAnswers[questionId]) return;
		setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
		setRevealedSolutions((prev) => ({ ...prev, [questionId]: true }));
	};

	const toggleSolution = (questionId: string) => {
		const willOpen = !revealedSolutions[questionId];
		if (willOpen && !userAnswers[questionId]) {
			const q = questions.find((item) => item.id === questionId);
			if (q?.type === "mcq") {
				const correctOpt = q.mcq_options?.find((opt) => opt.is_correct);
				if (correctOpt) {
					setUserAnswers((prev) => ({ ...prev, [questionId]: correctOpt.id }));
				}
			}
		}
		setRevealedSolutions((prev) => ({
			...prev,
			[questionId]: willOpen,
		}));
	};

	const toggleCqAnswer = (partId: string) => {
		setRevealedCqAnswers((prev) => ({
			...prev,
			[partId]: !prev[partId],
		}));
	};

	return (
		<div className="flex flex-col gap-4 sm:gap-6 w-full">
			<div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
				{topics.length > 0 && (
					<Select
						value={selectedTopicId ?? "all"}
						onValueChange={(val) =>
							setSelectedTopicId(val === "all" ? null : val)
						}
					>
						<SelectTrigger className="h-8 sm:h-9 w-full sm:w-auto min-w-[180px] sm:min-w-[200px] rounded-xl bg-card border-border/70 text-xs sm:text-sm font-medium">
							<SelectValue placeholder="সকল টপিক" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup>
								<SelectItem value="all">
									সকল টপিক ({questions.length})
								</SelectItem>
								{topics.map((topic) => {
									const count = questions.filter(
										(q) => q.topic_id === topic.id,
									).length;
									return (
										<SelectItem key={topic.id} value={topic.id}>
											{topic.name} {count > 0 ? `(${count})` : ""}
										</SelectItem>
									);
								})}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}

				{availableTypes.length > 1 && (
					<Select
						value={selectedType ?? "all"}
						onValueChange={(val) => setSelectedType(val === "all" ? null : val)}
					>
						<SelectTrigger className="h-8 sm:h-9 min-w-[110px] sm:min-w-[130px] rounded-xl bg-card border-border/70 text-xs sm:text-sm font-medium uppercase">
							<SelectValue placeholder="সকল ধরন" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup>
								<SelectItem value="all">সকল ধরন</SelectItem>
								{availableTypes.map((type) => (
									<SelectItem key={type} value={type} className="uppercase">
										{type}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}

				{availableSources.length > 1 && (
					<Select
						value={selectedSource ?? "all"}
						onValueChange={(val) =>
							setSelectedSource(val === "all" ? null : val)
						}
					>
						<SelectTrigger className="h-8 sm:h-9 min-w-[120px] sm:min-w-[140px] rounded-xl bg-card border-border/70 text-xs sm:text-sm font-medium capitalize">
							<SelectValue placeholder="সকল উৎস" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup>
								<SelectItem value="all">সকল উৎস</SelectItem>
								{availableSources.map((source) => (
									<SelectItem
										key={source}
										value={source}
										className="capitalize"
									>
										{source.replace("-", " ")}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			</div>

			<div className="flex flex-col gap-3.5 sm:gap-5 mt-1">
				{filteredQuestions.length === 0 ? (
					<div className="py-10 sm:py-12 text-center text-muted-foreground text-xs sm:text-sm border border-dashed rounded-2xl">
						কোনো প্রশ্ন পাওয়া যায়নি।
					</div>
				) : (
					filteredQuestions.map((q: Question, i: number) => {
						const selectedOptionId = userAnswers[q.id];
						const isAnswered = selectedOptionId !== undefined;
						const isSolutionOpen = Boolean(revealedSolutions[q.id]);

						return (
							<div
								key={q.id}
								className="p-3.5 sm:p-5 md:p-6 rounded-2xl md:rounded-[24px] border border-border/50 bg-card shadow-xs transition-all"
							>
								<div className="flex items-center justify-between mb-2.5 sm:mb-4">
									<span className="text-sm sm:text-base md:text-lg font-bold text-primary">
										প্রশ্ন {i + 1}
									</span>
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Badge
											variant="outline"
											className="uppercase font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5"
										>
											{q.type}
										</Badge>
										<Badge
											variant="secondary"
											className="capitalize text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5"
										>
											{q.source}
										</Badge>
									</div>
								</div>

								<div className="text-[13.5px] sm:text-base font-medium text-foreground leading-relaxed mb-3.5 sm:mb-5 [&_p]:m-0">
									<ReactMarkdown
										remarkPlugins={[remarkMath]}
										rehypePlugins={[rehypeKatex]}
									>
										{q.question_text}
									</ReactMarkdown>
								</div>

								{q.type === "mcq" && (q.mcq_options?.length ?? 0) > 0 && (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
										{[...(q.mcq_options ?? [])]
											.sort(
												(a: MCQOption, b: MCQOption) =>
													(a.order_no ?? 0) - (b.order_no ?? 0),
											)
											.map((opt: MCQOption, idx: number) => {
												const isSelected = selectedOptionId === opt.id;
												const isCorrect = opt.is_correct;

												return (
													<button
														type="button"
														key={opt.id}
														disabled={isAnswered}
														onClick={() => handleSelectOption(q.id, opt.id)}
														className={cn(
															"p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm flex items-center gap-2 sm:gap-2.5 border text-left w-full transition-all active:scale-[0.99]",
															!isAnswered &&
																"bg-muted/30 hover:bg-muted/70 hover:border-primary/40 text-foreground border-border/50 cursor-pointer",
															isAnswered &&
																isCorrect &&
																"bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs",
															isAnswered &&
																isSelected &&
																!isCorrect &&
																"bg-destructive/15 border-destructive/50 text-destructive font-semibold",
															isAnswered &&
																!isSelected &&
																!isCorrect &&
																"bg-muted/20 text-muted-foreground border-border/30 opacity-70",
														)}
													>
														<span
															className={cn(
																"size-6 sm:size-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 border transition-colors",
																!isAnswered &&
																	"bg-background text-foreground border-border",
																isAnswered &&
																	isCorrect &&
																	"bg-emerald-500 text-white border-emerald-500",
																isAnswered &&
																	isSelected &&
																	!isCorrect &&
																	"bg-destructive text-white border-destructive",
																isAnswered &&
																	!isSelected &&
																	!isCorrect &&
																	"bg-muted text-muted-foreground border-border/40",
															)}
														>
															{OPTION_KEYS[idx] || idx + 1}
														</span>
														<div className="flex-1 [&_p]:m-0 font-medium">
															<ReactMarkdown
																remarkPlugins={[remarkMath]}
																rehypePlugins={[rehypeKatex]}
															>
																{opt.option_text}
															</ReactMarkdown>
														</div>
													</button>
												);
											})}
									</div>
								)}

								{q.type === "cq" && (q.cq_parts?.length ?? 0) > 0 && (
									<div className="flex flex-col gap-2.5 sm:gap-3 mt-3">
										{[...(q.cq_parts ?? [])]
											.sort(
												(a: CQPart, b: CQPart) =>
													(a.order_no ?? 0) - (b.order_no ?? 0),
											)
											.map((part: CQPart) => {
												const isPartOpen = Boolean(revealedCqAnswers[part.id]);

												return (
													<div
														key={part.id}
														className="flex flex-col gap-1.5 sm:gap-2 p-3 sm:p-4 bg-muted/20 rounded-xl sm:rounded-2xl border border-border/30"
													>
														<div className="flex items-start gap-2.5 sm:gap-3">
															<span className="font-bold text-primary text-xs sm:text-sm flex-shrink-0">
																({part.part_key})
															</span>
															<div className="text-[13px] sm:text-sm md:text-base flex-1 [&_p]:m-0">
																<ReactMarkdown
																	remarkPlugins={[remarkMath]}
																	rehypePlugins={[rehypeKatex]}
																>
																	{part.question_text}
																</ReactMarkdown>
															</div>
															<Badge
																variant="secondary"
																className="flex-shrink-0 text-[10px] sm:text-xs px-1.5"
															>
																{part.marks} Marks
															</Badge>
														</div>

														{part.answer_text && (
															<div className="mt-1.5 pt-1.5 border-t border-border/20">
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => toggleCqAnswer(part.id)}
																	className="text-[11px] sm:text-xs h-6 sm:h-7 font-bold text-primary hover:text-primary hover:bg-primary/10 px-2 rounded-lg"
																>
																	{isPartOpen ? "উত্তর লুকান" : "উত্তর দেখুন"}
																</Button>
																{isPartOpen && (
																	<div className="mt-1.5 p-2.5 sm:p-3 bg-primary/5 rounded-xl border border-primary/10 animate-in fade-in slide-in-from-top-1">
																		<p className="text-[10px] sm:text-xs font-bold text-primary uppercase mb-1">
																			উত্তর:
																		</p>
																		<div className="text-xs sm:text-sm text-foreground/90 [&_p]:m-0">
																			<ReactMarkdown
																				remarkPlugins={[remarkMath]}
																				rehypePlugins={[rehypeKatex]}
																			>
																				{part.answer_text}
																			</ReactMarkdown>
																		</div>
																	</div>
																)}
															</div>
														)}
													</div>
												);
											})}
									</div>
								)}

								{q.explanation && (
									<div className="mt-3 pt-2.5 border-t border-dashed border-border/40">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleSolution(q.id)}
											className="text-[11px] sm:text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-lg gap-1.5 h-7 sm:h-8 px-2 sm:px-2.5"
										>
											<Lightbulb className="size-3 sm:size-3.5" />
											{isSolutionOpen ? "ব্যাখ্যা লুকান" : "ব্যাখ্যা / সমাধান দেখুন"}
										</Button>

										{isSolutionOpen && (
											<div className="mt-2.5 p-3 sm:p-4 bg-primary/5 rounded-xl sm:rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-top-2">
												<p className="text-[10px] sm:text-xs font-bold text-primary uppercase mb-1">
													ব্যাখ্যা / সমাধান
												</p>
												<div className="text-xs sm:text-sm text-foreground/90 leading-relaxed [&_p]:m-0">
													<ReactMarkdown
														remarkPlugins={[remarkMath]}
														rehypePlugins={[rehypeKatex]}
													>
														{q.explanation}
													</ReactMarkdown>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
