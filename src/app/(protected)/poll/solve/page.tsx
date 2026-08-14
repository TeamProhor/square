"use client";

import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePollStore } from "@/hooks/usePollStore";
import type { Question } from "@/types";

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
  const [revealedSolutions, setRevealedSolutions] = useState<
    Record<string, boolean>
  >({});

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

  const percentage = Math.round((correctCount / activeQuestions.length) * 100);

  const toggleSolution = (qId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-4xl mx-auto pb-10 mt-1 sm:mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="size-14 sm:size-16 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
            <span className="text-lg sm:text-xl font-black text-primary">
              {toBengaliNumber(percentage)}%
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase">
              স্কোর
            </span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {percentage >= 80
                ? "দারুণ ফলাফল! 🎉"
                : percentage >= 50
                  ? "ভালো হয়েছে! 👍"
                  : "আরও অনুশীলন প্রয়োজন 📚"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              মোট {toBengaliNumber(activeQuestions.length)}টির মধ্যে{" "}
              {toBengaliNumber(correctCount)}টি সঠিক হয়েছে।
            </p>
          </div>
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
        {activeQuestions.map((rawQ, idx) => {
          const adaptedQ: Question = {
            id: `poll-solve-${idx}`,
            type: "mcq",
            source: "Poll",
            standard: "HSC",
            questionText: rawQ.question,
            explanation: rawQ.explanation,
            mcqOptions: rawQ.options.map((opt, optIdx) => ({
              id: String(optIdx),
              optionText: opt,
              isCorrect: optIdx === rawQ.correctIdx,
              orderNo: optIdx + 1,
            })),
          };

          const selectedOptId =
            userAnswers[idx] !== undefined
              ? String(userAnswers[idx])
              : undefined;

          return (
            <UniversalQuestionCard
              key={rawQ.question}
              question={adaptedQ}
              questionIndex={idx}
              selectedOptionId={selectedOptId}
              isSolutionOpen={Boolean(revealedSolutions[adaptedQ.id])}
              onToggleSolution={toggleSolution}
            />
          );
        })}
      </div>
    </div>
  );
}
