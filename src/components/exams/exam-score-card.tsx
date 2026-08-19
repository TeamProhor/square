"use client";

import { Clock, Danger, TickCircle } from "@/components/icons";

interface ExamScoreCardProps {
  scoreNum: number;
  totalMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  toBanglaDigits: (str: string | number) => string;
  formatTimeBangla: (seconds: number) => string;
}

export function ExamScoreCard({
  scoreNum,
  totalMarks,
  percentage,
  timeTakenSeconds,
  correctCount,
  incorrectCount,
  unattemptedCount,
  toBanglaDigits,
  formatTimeBangla,
}: ExamScoreCardProps) {
  return (
    <>
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
          <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
            <Danger className="size-4" /> {toBanglaDigits(incorrectCount)} টি
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground font-medium">
            উত্তর দেওয়া হয়নি
          </span>
          <span className="text-base sm:text-lg font-bold text-muted-foreground flex items-center gap-1">
            {toBanglaDigits(unattemptedCount)} টি
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground font-medium">
            ব্যয়িত সময়
          </span>
          <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
            <Clock className="size-3.5 text-primary" />{" "}
            {formatTimeBangla(timeTakenSeconds || 0)}
          </span>
        </div>
      </div>
    </>
  );
}
