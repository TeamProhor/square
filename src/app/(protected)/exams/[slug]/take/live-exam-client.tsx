"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Clock, Danger, Eye, TickCircle } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitExam } from "@/hooks/use-exam";
import type { ExamDetail } from "@/types";

export default function LiveExamClient({
  exam,
  submissionId,
  initialTimeLeft,
}: {
  exam: ExamDetail;
  submissionId: string;
  initialTimeLeft: number;
}) {
  const router = useRouter();
  const submitExamMutation = useSubmitExam();

  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [answers, setAnswers] = useState<
    Record<string, { selectedOptionId?: string; cqAnswerText?: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const examQuestions = exam.examQuestions || [];
  const totalQuestionsCount = examQuestions.length;

  const answeredCount = examQuestions.filter((eq) =>
    Boolean(
      answers[eq.id]?.selectedOptionId ||
        answers[eq.id]?.cqAnswerText?.trim(),
    ),
  ).length;

  const unansweredCount = totalQuestionsCount - answeredCount;

  const prepareSubmitPayload = () => {
    return Object.entries(answers).map(([examQuestionId, ans]) => ({
      examQuestionId,
      selectedOptionId: ans.selectedOptionId,
      cqAnswerText: ans.cqAnswerText,
    }));
  };

  const executeFinalSubmit = async (isAuto = false) => {
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalTimeTaken = isAuto
      ? exam.durationMinutes * 60
      : exam.durationMinutes * 60 - timeLeft;

    const res = await submitExamMutation.mutateAsync({
      submissionId,
      responses: prepareSubmitPayload(),
      timeTakenSeconds: totalTimeTaken,
    });

    if (res.success) {
      router.replace(`/exams/${exam.slug}/result?sid=${submissionId}`);
    } else {
      alert(`সাবমিট করতে সমস্যা হয়েছে: ${res.error}`);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isSubmitting) executeFinalSubmit(true);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!isSubmitting) executeFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSubmitting]);

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)] || digit);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    let timeStr = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    if (h > 0) {
      timeStr = `${h}:${timeStr}`;
    }
    return toBanglaDigits(timeStr);
  };

  const handleOptionSelect = (examQuestionId: string, optionId: string) => {
    setAnswers((prev) => {
      if (prev[examQuestionId]?.selectedOptionId) return prev;
      return {
        ...prev,
        [examQuestionId]: { ...prev[examQuestionId], selectedOptionId: optionId },
      };
    });
  };

  const handleCqChange = (examQuestionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [examQuestionId]: { ...prev[examQuestionId], cqAnswerText: text },
    }));
  };

  const scrollToQuestion = (eqId: string) => {
    setIsOverviewOpen(false);
    const el = document.getElementById(`q-${eqId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground font-sans relative">
      {/* Sticky Top Bar (Minimalist) */}
      <header className="sticky top-0 z-20 shrink-0 bg-card/95 backdrop-blur-md border-b border-border/70 shadow-2xs">
        <div className="h-14 sm:h-16 max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 gap-3">
          <h1 className="font-extrabold text-sm sm:text-base truncate leading-tight">
            {exam.title}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border/60">
              উত্তর: {toBanglaDigits(answeredCount)}/{toBanglaDigits(totalQuestionsCount)}
            </span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="h-1 w-full bg-muted/50 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${totalQuestionsCount > 0 ? (answeredCount / totalQuestionsCount) * 100 : 0}%`,
            }}
          />
        </div>
      </header>

      {/* Main Questions Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-32">
        {examQuestions.map((eq, idx) => {
          const q = eq.question;
          if (!q) return null;

          const isAnswered =
            Boolean(answers[eq.id]?.selectedOptionId) ||
            Boolean(answers[eq.id]?.cqAnswerText?.trim());

          return (
            <div key={eq.id} id={`q-${eq.id}`} className="scroll-mt-20">
              <UniversalQuestionCard
                question={q}
                questionIndex={idx}
                selectedOptionId={answers[eq.id]?.selectedOptionId}
                showCorrectAnswer={false}
                minimal={true}
                onSelectOption={(_qId, optId) =>
                  handleOptionSelect(eq.id, optId)
                }
                headerActions={
                  <div className="flex items-center gap-1.5">
                    {isAnswered && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <TickCircle className="size-3 text-emerald-600" />
                        উত্তর দেওয়া হয়েছে
                      </span>
                    )}
                    <span className="text-[11px] font-bold bg-muted px-2 py-0.5 rounded-md text-muted-foreground border border-border/40">
                      {toBanglaDigits(eq.marks)} Marks
                    </span>
                  </div>
                }
              >
                {/* CQ Answer Textarea (if question is creative/written) */}
                {q.type === "cq" && (
                  <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      আপনার সৃজনশীল উত্তর লিখুন:
                    </label>
                    <Textarea
                      placeholder="এখানে আপনার সম্পূর্ণ লিখিত উত্তর প্রদান করুন..."
                      className="min-h-[160px] rounded-xl resize-y text-xs sm:text-sm bg-background"
                      value={answers[eq.id]?.cqAnswerText || ""}
                      onChange={(e) => handleCqChange(eq.id, e.target.value)}
                    />
                  </div>
                )}
              </UniversalQuestionCard>
            </div>
          );
        })}

        {/* Bottom Submit Section */}
        <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border/70 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg">
              পরীক্ষা সম্পন্ন করতে প্রস্তুত?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              মোট {toBanglaDigits(totalQuestionsCount)} টির মধ্যে {toBanglaDigits(answeredCount)} টি প্রশ্নের উত্তর দেওয়া হয়েছে।
            </p>
          </div>
          <Button
            onClick={() => setIsConfirmSubmitOpen(true)}
            disabled={isSubmitting || submitExamMutation.isPending}
            className="w-full sm:w-auto rounded-xl px-8 h-11 font-bold text-sm shadow-md"
          >
            {isSubmitting ? "সাবমিট হচ্ছে..." : "পরীক্ষা জমা দিন"}
          </Button>
        </div>
      </main>

      {/* Floating Control Capsule (Timer + Eye Button) */}
      <div className="fixed bottom-6 right-4 sm:right-8 z-30 flex items-center gap-3 pl-4 sm:pl-5 pr-2 py-2 bg-card/95 backdrop-blur-xl border border-border/80 rounded-full shadow-xl hover:shadow-2xl transition-all">
        {/* Floating Timer (Hind Siliguri font, Bangla digits, clean) */}
        <span
          className={`font-sans font-bold text-base sm:text-lg min-w-[70px] sm:min-w-[80px] text-center tracking-wide select-none tabular-nums transition-colors ${
            timeLeft < 300
              ? "text-destructive animate-pulse font-black"
              : "text-foreground"
          }`}
        >
          {formatTime(timeLeft)}
        </span>

        {/* Floating Eye Button */}
        <button
          type="button"
          aria-label="প্রশ্ন তালিকা দেখুন"
          onClick={() => setIsOverviewOpen(true)}
          className="relative size-10 sm:size-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
          title="প্রশ্ন তালিকা দেখুন"
        >
          <Eye className="size-5 sm:size-5.5" />
          {answeredCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-emerald-500 text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center border-2 border-background shadow-xs">
              {toBanglaDigits(answeredCount)}
            </span>
          )}
        </button>
      </div>

      {/* Responsive Dialog / Drawer for Question Navigator */}
      <ResponsiveDialog
        open={isOverviewOpen}
        onOpenChange={setIsOverviewOpen}
        title="পরীক্ষার প্রশ্ন তালিকা ও স্ট্যাটাস"
        description="যে প্রশ্নে যেতে চান সেটির নাম্বারে ক্লিক করুন"
        className="max-w-lg"
      >
        <div className="space-y-5 pt-2">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium block">
                উত্তর দেওয়া হয়েছে
              </span>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                {toBanglaDigits(answeredCount)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/60 border border-border/60 text-center">
              <span className="text-xs text-muted-foreground font-medium block">
                বাকি আছে
              </span>
              <span className="text-lg font-black text-foreground">
                {toBanglaDigits(unansweredCount)}
              </span>
            </div>
          </div>

          {/* Question Number Pills Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase block">
              সকল প্রশ্নাবলি ({toBanglaDigits(totalQuestionsCount)} টি):
            </span>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-2.5 max-h-[300px] overflow-y-auto p-1">
              {examQuestions.map((eq, idx) => {
                const isAnswered =
                  Boolean(answers[eq.id]?.selectedOptionId) ||
                  Boolean(answers[eq.id]?.cqAnswerText?.trim());

                return (
                  <button
                    type="button"
                    key={eq.id}
                    onClick={() => scrollToQuestion(eq.id)}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                      isAnswered
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border/70 hover:border-primary/40"
                    }`}
                  >
                    <span>{toBanglaDigits(idx + 1)}</span>
                    <span className="text-[9px] font-normal opacity-80 leading-none">
                      {isAnswered ? "উত্তরিত" : "বাকি"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action within Dialog */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOverviewOpen(false)}
              className="rounded-xl flex-1 text-xs font-semibold h-10"
            >
              পরীক্ষায় ফিরুন
            </Button>
            <Button
              onClick={() => {
                setIsOverviewOpen(false);
                setIsConfirmSubmitOpen(true);
              }}
              disabled={isSubmitting || submitExamMutation.isPending}
              className="rounded-xl flex-1 text-xs font-bold h-10 shadow-xs"
            >
              পরীক্ষা সাবমিট করুন
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Responsive Dialog / Drawer for Submit Confirmation */}
      <ResponsiveDialog
        open={isConfirmSubmitOpen}
        onOpenChange={setIsConfirmSubmitOpen}
        title="পরীক্ষা চূড়ান্তভাবে জমা দিতে চান?"
        description="সাবমিট করার পর আপনার ফলাফল ও বিশ্লেষণ প্রস্তুত করা হবে"
        className="max-w-md"
      >
        <div className="space-y-4 pt-1">
          {/* Summary Details */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground">মোট প্রশ্ন:</span>
              <p className="font-bold text-foreground text-sm">
                {toBanglaDigits(totalQuestionsCount)} টি
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground">বাকি সময়:</span>
              <p className="font-bold text-foreground text-sm">
                {formatTime(timeLeft)}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground">উত্তর দেওয়া হয়েছে:</span>
              <p className="font-bold text-emerald-600 text-sm">
                {toBanglaDigits(answeredCount)} টি
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground">উত্তর বাকি:</span>
              <p
                className={`font-bold text-sm ${
                  unansweredCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                }`}
              >
                {toBanglaDigits(unansweredCount)} টি
              </p>
            </div>
          </div>

          {/* Unanswered Notice if any */}
          {unansweredCount > 0 && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
              <Danger className="size-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                আপনার এখনও {toBanglaDigits(unansweredCount)} টি প্রশ্নের উত্তর বাকি আছে। একবার সাবমিট করার পর আর পরিবর্তন করা যাবে না।
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmSubmitOpen(false)}
              disabled={isSubmitting}
              className="flex-1 rounded-xl h-11 text-xs sm:text-sm font-semibold"
            >
              ফিরে যান
            </Button>
            <Button
              onClick={() => executeFinalSubmit(false)}
              disabled={isSubmitting || submitExamMutation.isPending}
              className="flex-1 rounded-xl h-11 text-xs sm:text-sm font-bold shadow-xs"
            >
              {isSubmitting ? "সাবমিট হচ্ছে..." : "হ্যাঁ, জমা দিন"}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
