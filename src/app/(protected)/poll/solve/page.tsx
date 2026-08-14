"use client";

import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestionCard } from "@/components/shared/QuestionCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePollStore } from "@/hooks/usePollStore";

const toBengaliNumber = (num: number) => {
	const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
	return num
		.toString()
		.split("")
		.map((digit) => bengaliDigits[parseInt(digit, 10)] || digit)
		.join("");
};

export default function PollSolvePage() {
	const router = useRouter();
	const { activeQuestions, userAnswers, resetPoll } = usePollStore();

	const [isRestarting, setIsRestarting] = useState(false);

	useEffect(() => {
		if (activeQuestions.length === 0) {
			router.push("/poll/config");
		}
	}, [activeQuestions.length, router]);

	useEffect(() => {
		if (activeQuestions.length > 0) {
			const timer = setTimeout(() => {
				const duration = 3 * 1000;
				const animationEnd = Date.now() + duration;
				const defaults = {
					startVelocity: 30,
					spread: 360,
					ticks: 60,
					zIndex: 0,
				};

				const randomInRange = (min: number, max: number) =>
					Math.random() * (max - min) + min;

				const interval = setInterval(() => {
					const timeLeft = animationEnd - Date.now();

					if (timeLeft <= 0) {
						clearInterval(interval);
						return;
					}

					const particleCount = 50 * (timeLeft / duration);
					confetti({
						...defaults,
						particleCount,
						origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
					});
					confetti({
						...defaults,
						particleCount,
						origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
					});
				}, 250);

				return () => clearInterval(interval);
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [activeQuestions.length]);

	if (activeQuestions.length === 0) {
		return null;
	}

	let correctCount = 0;
	activeQuestions.forEach((q, idx) => {
		if (userAnswers[idx] === q.correctIdx) {
			correctCount++;
		}
	});

	return (
		<div className="flex-1 w-full flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto mt-1 sm:mt-2">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-card border border-border/60 rounded-2xl md:rounded-[32px] p-3.5 sm:p-5 md:p-6 shadow-xs">
				<div className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
					<h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
						পোল সম্পন্ন হয়েছে!
					</h2>
					<p className="text-xs sm:text-sm font-medium text-muted-foreground">
						আপনি {toBengaliNumber(activeQuestions.length)} টি প্রশ্নের মধ্যে{" "}
						<span className="text-primary font-bold">
							{toBengaliNumber(correctCount)}
						</span>{" "}
						টির সঠিক উত্তর দিয়েছেন।
					</p>
				</div>
				<Button
					onClick={() => {
						setIsRestarting(true);
						resetPoll();
						router.push("/poll/config");
					}}
					disabled={isRestarting}
					className="rounded-full shadow-xs font-semibold px-5 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
				>
					{isRestarting ? (
						<>
							<Spinner className="mr-2" /> লোড হচ্ছে...
						</>
					) : (
						"নতুন পোল শুরু করুন"
					)}
				</Button>
			</div>

			<div className="flex flex-col gap-3.5 sm:gap-5">
				<h3 className="text-sm sm:text-base font-bold text-foreground px-0.5">
					সকল প্রশ্নের সমাধান:
				</h3>
				{activeQuestions.map((q, idx) => (
					<QuestionCard
						key={q.question}
						question={q}
						questionIndex={idx}
						selectedOptionIndex={userAnswers[idx]}
						onSelectAnswer={() => {}}
					/>
				))}
			</div>
		</div>
	);
}
