import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Lightbulb } from "@/components/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { CQQuestion } from "@/lib/cqs";
import type { MCQQuestion } from "@/lib/mcqs";
import { cn } from "@/lib/utils";

const toBengaliNumber = (num: number) => {
	const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
	return num
		.toString()
		.split("")
		.map((digit) => bengaliDigits[parseInt(digit, 10)] || digit)
		.join("");
};

export type QuestionWithOptions =
	| (MCQQuestion & { type?: "mcq" })
	| (CQQuestion & { type: "written" });

export interface QuestionCardProps {
	readonly question: QuestionWithOptions;
	readonly questionIndex: number;
	readonly selectedOptionIndex?: number;
	readonly showExplanation?: boolean;
	readonly onSelectAnswer: (qIdx: number, optIdx: number) => void;
}

export function QuestionCard({
	question,
	questionIndex,
	selectedOptionIndex,
	showExplanation = true,
	onSelectAnswer,
}: QuestionCardProps): ReactElement {
	const isAnswered = selectedOptionIndex !== undefined;

	const optKeys = ["ক", "খ", "গ", "ঘ", "ঙ"];

	const type = "type" in question ? question.type : "mcq";

	return (
		<div
			className={cn(
				"bg-card border border-border/60 rounded-2xl md:rounded-[32px] shadow-sm transition-all duration-300",
				"hover:shadow-lg hover:border-primary/20 p-3.5 sm:p-5 md:p-8",
			)}
		>
			<div className="flex flex-col gap-2.5 sm:gap-4 md:gap-6">
				{/* Header: Index, Tags, Actions */}
				<div className="flex items-center justify-between gap-3 md:gap-4">
					<div className="flex items-center gap-2 md:gap-3">
						<span className="flex items-center justify-center size-6 sm:size-7 md:size-9 rounded-full bg-primary/10 text-primary font-black text-[10px] sm:text-xs md:text-sm shrink-0">
							{toBengaliNumber(questionIndex + 1)}
						</span>
					</div>
				</div>

				{/* Question Text */}
				<div className="font-bold leading-relaxed text-foreground px-0.5 text-balance text-[13.5px] sm:text-base md:text-xl [&_p]:m-0">
					<ReactMarkdown
						remarkPlugins={[remarkMath]}
						rehypePlugins={[rehypeKatex]}
					>
						{type === "written"
							? (question as CQQuestion).question_text
							: (question as MCQQuestion).question}
					</ReactMarkdown>
				</div>

				{/* Content */}
				<div className="border-t border-dashed border-border/50 pt-2.5 sm:pt-4 md:pt-6">
					{type === "mcq" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
							{(question as MCQQuestion).options.map((opt, optIdx) => {
								const isSelected = selectedOptionIndex === optIdx;
								const isCorrect =
									optIdx === (question as MCQQuestion).correctIdx;
								const showResult = isAnswered;

								return (
									<button
										type="button"
										key={opt}
										disabled={isAnswered}
										onClick={() => onSelectAnswer(questionIndex, optIdx)}
										className={cn(
											"flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all text-left w-full active:scale-[0.98] relative",
											!showResult &&
												"border-muted hover:border-primary/30 hover:bg-muted/50",
											showResult && isCorrect && "border-primary bg-primary/10",
											showResult &&
												isSelected &&
												!isCorrect &&
												"border-destructive bg-destructive/10",
											showResult &&
												!isSelected &&
												!isCorrect &&
												"border-transparent bg-muted/30 opacity-60",
										)}
									>
										<div
											className={cn(
												"size-6 sm:size-7 md:size-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-black transition-colors shrink-0",
												showResult && isCorrect
													? "bg-primary text-white border-primary"
													: showResult && isSelected && !isCorrect
														? "bg-destructive text-white border-destructive"
														: "bg-background border border-border",
											)}
										>
											{optKeys[optIdx] || optIdx + 1}
										</div>
										<div className="font-bold text-[13px] sm:text-sm md:text-base flex-1 leading-tight min-w-0 overflow-hidden text-foreground/90 [&_p]:m-0">
											<ReactMarkdown
												remarkPlugins={[remarkMath]}
												rehypePlugins={[rehypeKatex]}
											>
												{opt}
											</ReactMarkdown>
										</div>
									</button>
								);
							})}
						</div>
					)}

					{type === "written" && (
						<Accordion
							type="multiple"
							className="w-full space-y-2 md:space-y-3"
						>
							{(question as CQQuestion).parts.map((part) => (
								<AccordionItem
									key={part.id}
									value={part.id}
									className="border-none"
								>
									<AccordionTrigger
										className={cn(
											"hover:no-underline p-2.5 md:p-4 bg-muted/30 rounded-xl md:rounded-2xl",
										)}
									>
										<div className="flex gap-3 md:gap-4 items-center min-w-0 w-full text-left">
											<div className="size-6 md:size-8 rounded-lg md:rounded-xl bg-background border flex items-center justify-center text-[10px] md:text-xs font-black text-primary shrink-0">
												{part.part_key}
											</div>
											<div className="font-bold text-[13px] md:text-sm text-foreground text-left leading-tight min-w-0 flex-1 [&_p]:m-0">
												<ReactMarkdown
													remarkPlugins={[remarkMath]}
													rehypePlugins={[rehypeKatex]}
												>
													{part.question_text}
												</ReactMarkdown>
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className="pt-1.5 md:pt-2 px-1 md:px-2">
										<div className="p-3 md:p-4 bg-primary/5 rounded-xl md:rounded-2xl border border-primary/10 text-[13px] md:text-sm font-medium leading-relaxed [&_p]:m-0">
											{part.answer_text ? (
												<ReactMarkdown
													remarkPlugins={[remarkMath]}
													rehypePlugins={[rehypeKatex]}
												>
													{part.answer_text}
												</ReactMarkdown>
											) : (
												"কোনো উত্তর নেই।"
											)}
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					)}
				</div>

				{/* Explanation Footer */}
				{((type === "mcq" && isAnswered && showExplanation) ||
					type === "written") &&
					question.explanation && (
						<div className="p-3.5 md:p-5 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10 flex gap-2.5 md:gap-3 animate-in fade-in slide-in-from-top-2">
							<Lightbulb className="size-4 md:size-5 text-primary shrink-0 mt-0.5 font-bold" />
							<div className="text-foreground/80 font-medium text-[13px] md:text-sm leading-relaxed flex-1 min-w-0 [&_p]:m-0">
								<ReactMarkdown
									remarkPlugins={[remarkMath]}
									rehypePlugins={[rehypeKatex]}
								>
									{question.explanation}
								</ReactMarkdown>
							</div>
						</div>
					)}
			</div>
		</div>
	);
}
