"use client";

import { Danger, TickCircle } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import type { ExamQuestion } from "@/types";

interface ExamOverviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  examQuestions: readonly ExamQuestion[];
  answers: Record<string, { selectedOptionId?: string; cqAnswerText?: string }>;
  answeredCount: number;
  unansweredCount: number;
  totalQuestionsCount: number;
  toBanglaDigits: (str: string | number) => string;
  onScrollToQuestion: (index: number) => void;
  onSubmitClick: () => void;
  isSubmitting: boolean;
}

export function ExamOverviewDialog({
  isOpen,
  onOpenChange,
  examQuestions,
  answers,
  answeredCount,
  unansweredCount,
  totalQuestionsCount,
  toBanglaDigits,
  onScrollToQuestion,
  onSubmitClick,
  isSubmitting,
}: ExamOverviewDialogProps) {
  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="প্রশ্নের সার্বিক বিবরণী"
      description={`মোট ${toBanglaDigits(totalQuestionsCount)} টি প্রশ্নের মধ্যে আপনার অগ্রগতি`}
      className="sm:max-w-xl"
    >
      <div className="flex flex-col gap-5 pt-2">
        {/* Progress summary stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <TickCircle className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                উত্তর দেওয়া হয়েছে
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {toBanglaDigits(answeredCount)} টি
              </span>
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
            <Danger className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                বাকি আছে
              </span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                {toBanglaDigits(unansweredCount)} টি
              </span>
            </div>
          </div>
        </div>

        {/* Question Grid Map */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground">
            যে কোনো প্রশ্নে সরাসরি যেতে ক্লিক করুন:
          </span>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-2 border rounded-xl bg-muted/20">
            {examQuestions.map((eq, idx) => {
              const isAnswered = Boolean(
                answers[eq.id]?.selectedOptionId ||
                  answers[eq.id]?.cqAnswerText?.trim(),
              );
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => {
                    onScrollToQuestion(idx);
                    onOpenChange(false);
                  }}
                  className={`size-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer border ${
                    isAnswered
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background text-muted-foreground border-border/80 hover:border-primary/50"
                  }`}
                >
                  {toBanglaDigits(idx + 1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl flex-1 text-xs font-semibold h-10"
          >
            পরীক্ষায় ফিরুন
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onSubmitClick();
            }}
            disabled={isSubmitting}
            className="rounded-xl flex-1 text-xs font-bold h-10 shadow-xs"
          >
            পরীক্ষা সাবমিট করুন
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
