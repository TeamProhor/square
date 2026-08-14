"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QuestionCard } from "@/components/shared/QuestionCard";
import { usePollStore } from "@/hooks/usePollStore";
import { MCQ_DATABASE } from "@/lib/mcqs";

export default function PollTakePage() {
  const router = useRouter();
  const {
    item,
    standard,
    paper,
    activeQuestions,
    userAnswers,
    currentQuestionIndex,
    setUserAnswers,
    setCurrentQuestionIndex,
  } = usePollStore();

  const subjectData = MCQ_DATABASE[item as keyof typeof MCQ_DATABASE];
  const _chaptersMap =
    (subjectData ? subjectData[paper as "1st" | "2nd"] : {}) || {};

  useEffect(() => {
    if (activeQuestions.length === 0) {
      router.push("/poll/config");
    }
  }, [activeQuestions.length, router]);

  useEffect(() => {
    if (
      activeQuestions.length > 0 &&
      currentQuestionIndex === activeQuestions.length
    ) {
      router.push("/poll/solve");
    }
  }, [currentQuestionIndex, activeQuestions.length, router]);

  if (
    activeQuestions.length === 0 ||
    currentQuestionIndex >= activeQuestions.length
  ) {
    return null;
  }

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (userAnswers[qIdx] !== undefined) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 800);
  };

  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  activeQuestions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctIdx) {
      correctCount++;
    }
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-3.5 sm:gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-card border rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
            লাইভ কুইজ পরীক্ষা
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
            ক্যাটাগরি: {standard === "board" ? "বোর্ড স্ট্যান্ডার্ড" : "এডমিশন স্ট্যান্ডার্ড"} |
            মোট প্রশ্ন: {activeQuestions.length}টি
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 bg-muted/30 border p-2 sm:p-3 px-3 sm:px-4 rounded-xl shrink-0 self-start sm:self-auto">
          <div className="text-center">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground block uppercase font-bold">
              সম্পন্ন
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {answeredCount}/{activeQuestions.length}
            </span>
          </div>
          <div className="h-6 sm:h-8 w-px bg-border" />
          <div className="text-center">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground block uppercase font-bold">
              সঠিক উত্তর
            </span>
            <span className="text-xs sm:text-sm font-bold text-primary">
              {correctCount}টি
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <QuestionCard
          question={activeQuestions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          selectedOptionIndex={userAnswers[currentQuestionIndex]}
          showExplanation={false}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>
    </div>
  );
}
