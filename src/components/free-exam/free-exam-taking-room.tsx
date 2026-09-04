"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  Clock,
  Danger,
  Flash,
  SecurityCard,
  TaskSquare,
  TickCircle,
  Warning,
} from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { submitFreeGuestExamAction } from "@/lib/actions/free-exam";

const OPTION_KEYS = ["ক", "খ", "গ", "ঘ", "ঙ"];

interface FreeExamTakingRoomProps {
  exam: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    durationMinutes: number;
    totalMarks: number;
    negativeMarking: string;
  };
  questions: Array<{
    examQuestionId: string;
    orderNo: number;
    marks: number;
    section?: string | null;
    question: {
      id: string;
      questionText: string;
      type: string;
      marks: number;
      standard?: string | null;
      source?: string | null;
      mcqOptions: Array<{
        id: string;
        optionText: string;
        orderNo: number;
      }>;
      cqParts: Array<{
        id: string;
        partKey: string;
        marks: number;
        questionText: string;
        orderNo: number;
      }>;
    };
  }>;
  submissionId: string;
}

export function FreeExamTakingRoom({
  exam,
  questions,
  submissionId,
}: FreeExamTakingRoomProps) {
  const router = useRouter();

  // Retrieve stored guest user info
  const [guestInfo, setGuestInfo] = useState<{
    guestUserId: string;
    studentName: string;
  }>({
    guestUserId: "",
    studentName: "Guest Student",
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`free_exam_${exam.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setGuestInfo({
          guestUserId: parsed.guestUserId || "",
          studentName: parsed.studentName || "Guest Student",
        });
      }
    } catch {
      // Ignore
    }
  }, [exam.id]);

  // Exam state
  const totalSeconds = exam.durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [timeTaken, setTimeTaken] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentItem = questions[currentIdx];
  const answeredCount = Object.keys(responses).length;
  const totalCount = questions.length;

  const handleSelectOption = (examQuestionId: string, optionId: string) => {
    setResponses((prev) => {
      if (prev[examQuestionId] === optionId) {
        // Deselect if already selected
        const updated = { ...prev };
        delete updated[examQuestionId];
        return updated;
      }
      return { ...prev, [examQuestionId]: optionId };
    });
  };

  const handleClearCurrent = () => {
    if (currentItem) {
      setResponses((prev) => {
        const updated = { ...prev };
        delete updated[currentItem.examQuestionId];
        return updated;
      });
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const formattedResponses = questions.map((q) => ({
      examQuestionId: q.examQuestionId,
      selectedOptionId: responses[q.examQuestionId] || null,
      cqAnswerText: null,
    }));

    const res = await submitFreeGuestExamAction({
      submissionId,
      examId: exam.id,
      guestUserId: guestInfo.guestUserId,
      timeTakenSeconds: timeTaken,
      responses: formattedResponses,
    });

    if (res.success) {
      router.push(`/free-exam/${exam.slug}/result?id=${submissionId}`);
    } else {
      setIsSubmitting(false);
      alert(res.error || "সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  if (!currentItem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm font-bold text-muted-foreground">
          প্রশ্নপত্র লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const isLowTime = timeLeft < 180; // less than 3 minutes

  return (
    <div className="w-full flex flex-col gap-5 pb-16">
      {/* Top Fixed / Sticky Control Bar */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl md:rounded-3xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-xs sm:text-sm font-extrabold text-foreground line-clamp-1">
              {exam.title}
            </h2>
            <span className="text-[11px] text-muted-foreground font-semibold">
              পরীক্ষার্থী: <strong className="text-foreground">{guestInfo.studentName}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Answered Progress Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 text-xs font-bold text-muted-foreground border border-border/60">
            <TaskSquare className="size-3.5 text-primary" />
            <span>উত্তর: {answeredCount}/{totalCount}</span>
          </div>

          {/* Live Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-extrabold border transition-colors shadow-2xs",
              isLowTime
                ? "bg-destructive/15 text-destructive border-destructive/30 animate-pulse"
                : "bg-primary/10 text-primary border-primary/25",
            )}
          >
            <Clock className="size-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="rounded-xl font-extrabold text-xs sm:text-sm h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-3.5" />
                <span>সাবমিট হচ্ছে...</span>
              </>
            ) : (
              <>
                <TickCircle className="size-4" />
                <span>সাবমিট করুন</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Center: Question Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-xs">
                  {currentIdx + 1}
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  প্রশ্ন নং {currentIdx + 1} / {totalCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                  মান: {currentItem.marks}
                </span>
                {responses[currentItem.examQuestionId] && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    উত্তর দেওয়া হয়েছে
                  </span>
                )}
              </div>
            </div>

            {/* Question Text with KaTeX Math Rendering */}
            <div className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                }}
              >
                {currentItem.question.questionText}
              </ReactMarkdown>
            </div>

            {/* MCQ Options List */}
            {currentItem.question.type === "mcq" && (
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {currentItem.question.mcqOptions.map((opt, optIdx) => {
                  const isSelected =
                    responses[currentItem.examQuestionId] === opt.id;
                  const optionLabel = OPTION_KEYS[optIdx] || String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() =>
                        handleSelectOption(currentItem.examQuestionId, opt.id)
                      }
                      className={cn(
                        "w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer group select-none",
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/40"
                          : "bg-muted/20 border-border/70 hover:bg-muted/50 hover:border-border text-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20",
                        )}
                      >
                        {optionLabel}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm font-medium pt-0.5 leading-snug">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {opt.optionText}
                        </ReactMarkdown>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action Bar (Clear Answer / Prev / Next) */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearCurrent}
                disabled={!responses[currentItem.examQuestionId]}
                className="text-xs font-bold text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
              >
                উত্তর মুছুন
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="rounded-xl font-bold text-xs h-9 px-4 cursor-pointer"
                >
                  &larr; পূর্ববর্তী
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setCurrentIdx((prev) =>
                      Math.min(totalCount - 1, prev + 1),
                    )
                  }
                  disabled={currentIdx === totalCount - 1}
                  className="rounded-xl font-bold text-xs h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  পরবর্তী &rarr;
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Question Jump Palette (4 cols) */}
        <div className="lg:col-span-4 sticky top-36 flex flex-col gap-4">
          <Card className="rounded-3xl border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="font-extrabold text-xs sm:text-sm text-foreground">
                প্রশ্ন প্যালেট (Jump)
              </h3>
              <span className="text-[11px] font-bold text-muted-foreground">
                {answeredCount}/{totalCount} সম্পন্ন
              </span>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto no-scrollbar p-1">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(responses[q.examQuestionId]);
                const isCurrent = currentIdx === idx;

                return (
                  <button
                    type="button"
                    key={q.examQuestionId}
                    onClick={() => setCurrentIdx(idx)}
                    className={cn(
                      "size-10 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer select-none",
                      isCurrent
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background font-black scale-105"
                        : "",
                      isAnswered
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20",
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px] font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-md bg-emerald-500" />
                <span>উত্তর দেওয়া হয়েছে</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-md bg-muted border border-border" />
                <span>বাকি আছে</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full rounded-2xl font-black text-xs h-10 bg-primary text-primary-foreground hover:bg-primary/90 mt-2 shadow-xs cursor-pointer"
            >
              পরীক্ষা সম্পন্ন করুন &rarr;
            </Button>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="rounded-3xl max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold mb-1">
              <Warning className="size-5" />
            </div>
            <DialogTitle className="text-lg font-black text-foreground">
              পরীক্ষা সাবমিট করতে চান?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              আপনি মোট <strong className="text-foreground">{totalCount}</strong> টির মধ্যে{" "}
              <strong className="text-primary">{answeredCount}</strong> টি প্রশ্নের উত্তর দিয়েছেন।{" "}
              {totalCount - answeredCount > 0 && (
                <span className="text-destructive font-semibold">
                  ({totalCount - answeredCount} টি প্রশ্নের উত্তর দেওয়া বাকি আছে।)
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="rounded-xl font-bold text-xs h-10 cursor-pointer"
            >
              ফিরে যান
            </Button>
            <Button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="rounded-xl font-black text-xs h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-3.5 mr-1" />
                  <span>জমা হচ্ছে...</span>
                </>
              ) : (
                "হ্যাঁ, সাবমিট করুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
