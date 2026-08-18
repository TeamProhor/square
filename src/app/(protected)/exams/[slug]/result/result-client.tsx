"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft2,
  BookOpen,
  Clock,
  CloseCircle,
  Danger,
  StatusUp,
  TickCircle,
} from "@/components/icons";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ResultClient({
  submission,
  slug,
}: {
  submission: any;
  slug: string;
}) {
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  const exam = submission.exam;
  const responses = submission.responses || [];

  const scoreNum = parseFloat(submission.score || "0");
  const totalMarks = submission.totalMarks || 1;
  const percentage = Math.max(0, Math.min(100, Math.round((scoreNum / totalMarks) * 100)));

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)] || digit);
  };

  const formatTimeBangla = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${toBanglaDigits(h)} ঘণ্টা ${toBanglaDigits(m)} মিনিট ${toBanglaDigits(s)} সেকেন্ড`;
    if (m > 0) return `${toBanglaDigits(m)} মিনিট ${toBanglaDigits(s)} সেকেন্ড`;
    return `${toBanglaDigits(s)} সেকেন্ড`;
  };

  const correctCount = responses.filter((r: any) => r.isCorrect).length;
  const incorrectCount = responses.filter((r: any) => !r.isCorrect && r.selectedOptionId).length;
  const unattemptedCount = responses.filter((r: any) => !r.selectedOptionId && !r.cqAnswerText?.trim()).length;

  const toggleSolution = (qId: string) => {
    setOpenSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-16 sm:pb-24 pt-0 sm:pt-2 md:pt-4 gap-6 sm:gap-8 px-3 sm:px-6">

      {/* Main Scorecard Banner */}
      <div className="border border-border/70 rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-card shadow-xs flex flex-col items-center justify-center text-center gap-6">
        <div className="space-y-1 max-w-md">
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {exam?.title || "পরীক্ষার ফলাফল"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            আপনার পরীক্ষা মূল্যায়নের পূর্ণাঙ্গ রিপোর্ট নিচে দেওয়া হলো
          </p>
        </div>

        {/* Score Ring & Circle */}
        <div className="relative size-36 sm:size-44 flex flex-col items-center justify-center rounded-full border-8 border-muted shadow-2xs my-1">
          <div
            className="absolute inset-0 rounded-full border-8 border-primary transition-all"
            style={{
              clipPath: `inset(${100 - Math.max(5, percentage)}% 0 0 0)`,
            }}
          />
          <span className="text-3xl sm:text-4xl font-black tracking-tight">
            {toBanglaDigits(scoreNum)}
          </span>
          <span className="text-xs sm:text-sm font-bold text-muted-foreground">
            / {toBanglaDigits(totalMarks)} মার্কস
          </span>
        </div>

        {/* Accuracy Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-2xs">
            সঠিকতার হার: {toBanglaDigits(percentage)}%
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl pt-2">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">
              সঠিক উত্তর
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TickCircle className="size-4" /> {toBanglaDigits(correctCount)} টি
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">
              ভুল উত্তর
            </span>
            <span className="text-base sm:text-lg font-bold text-destructive flex items-center gap-1">
              <CloseCircle className="size-4" /> {toBanglaDigits(incorrectCount)} টি
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">
              উত্তর দেননি
            </span>
            <span className="text-base sm:text-lg font-bold text-muted-foreground flex items-center gap-1">
              <Danger className="size-4" /> {toBanglaDigits(unattemptedCount)} টি
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">
              সময় লেগেছে
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1 mt-0.5">
              <Clock className="size-3.5 text-primary shrink-0" />
              {toBanglaDigits(Math.floor(submission.timeTakenSeconds / 60))} মি.{" "}
              {toBanglaDigits(submission.timeTakenSeconds % 60)} সে.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
          <Link href={`/exams/${slug}/leaderboard`}>
            <Button className="rounded-xl px-6 h-11 text-xs sm:text-sm font-bold gap-2 shadow-xs">
              <StatusUp className="size-4" />
              লিডারবোর্ড দেখুন
            </Button>
          </Link>
          <Link href={`/exams/${slug}`}>
            <Button
              variant="outline"
              className="rounded-xl px-6 h-11 text-xs sm:text-sm font-semibold border-border/70 shadow-xs"
            >
              পরীক্ষা লবিতে যান
            </Button>
          </Link>
        </div>
      </div>

      {/* Answer Sheet Review Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b gap-2">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              উত্তরপত্র ও সমাধান পর্যালোচনা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              প্রতিটি প্রশ্নের সঠিক উত্তর এবং বিস্তারিত ব্যাখ্যা নিচে দেখুন
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border/60 w-fit">
            মোট প্রশ্ন: {toBanglaDigits(responses.length)} টি
          </span>
        </div>

        <div className="space-y-6">
          {responses.map((res: any, idx: number) => {
            const eq = res.examQuestion;
            const q = eq?.question;
            if (!q) return null;

            const isCorrect = res.isCorrect;
            const marksObtained = parseFloat(res.marksObtained || "0");
            const isAttempted = Boolean(res.selectedOptionId || res.cqAnswerText?.trim());

            return (
              <div key={res.id} className="relative">
                <UniversalQuestionCard
                  question={q}
                  questionIndex={idx}
                  selectedOptionId={res.selectedOptionId}
                  showCorrectAnswer={true}
                  minimal={true}
                  isSolutionOpen={openSolutions[q.id] ?? false}
                  onToggleSolution={toggleSolution}
                  headerActions={
                    <div className="flex items-center gap-2">
                      {/* Evaluation Badge */}
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          <TickCircle className="size-3.5 text-emerald-600" />
                          সঠিক উত্তর
                        </span>
                      ) : isAttempted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-md border border-destructive/20">
                          <CloseCircle className="size-3.5 text-destructive" />
                          ভুল উত্তর
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md border border-border/40">
                          উত্তর দেওয়া হয়নি
                        </span>
                      )}

                      {/* Marks Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                          marksObtained > 0
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : marksObtained < 0
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-muted text-muted-foreground border-border/40"
                        }`}
                      >
                        {marksObtained > 0 ? "+" : ""}
                        {toBanglaDigits(marksObtained)} Marks
                      </span>
                    </div>
                  }
                >
                  {/* CQ Answer Response Review (if written question) */}
                  {q.type === "cq" && (
                    <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-muted-foreground uppercase">
                          আপনার জমা দেওয়া উত্তর:
                        </label>
                      </div>
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                        {res.cqAnswerText?.trim() ? (
                          res.cqAnswerText
                        ) : (
                          <span className="text-muted-foreground italic">
                            কোনো উত্তর জমা দেওয়া হয়নি
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </UniversalQuestionCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
