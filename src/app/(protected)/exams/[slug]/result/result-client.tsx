"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TaskSquare, StatusUp, Clock } from "@/components/icons";

export default function ResultClient({ submission, slug }: { submission: any, slug: string }) {
  const exam = submission.exam;
  const responses = submission.responses || [];

  const percentage = (parseFloat(submission.score) / submission.totalMarks) * 100;
  const isPass = exam.passMarks ? parseFloat(submission.score) >= exam.passMarks : true;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-12 pt-4 md:py-8 gap-8 px-4">
      {/* Result Summary Card */}
      <div className="bg-card border rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-muted-foreground">আপনার ফলাফল</h1>
        
        <div className="relative size-40 md:size-48 flex items-center justify-center rounded-full border-[12px] border-muted mb-8">
          <div className={`absolute inset-0 rounded-full border-[12px] ${isPass ? 'border-emerald-500' : 'border-destructive'}`} 
               style={{ clipPath: `inset(${100 - percentage}% 0 0 0)` }}></div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-black">{submission.score}</span>
            <span className="text-sm font-bold text-muted-foreground mt-1">/ {submission.totalMarks}</span>
          </div>
        </div>

        <div className={`px-6 py-2 rounded-full font-bold text-lg mb-8 ${isPass ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
          {isPass ? "উত্তীর্ণ (PASSED)" : "অনুত্তীর্ণ (FAILED)"}
        </div>

        <div className="flex gap-4 md:gap-8 w-full justify-center text-sm md:text-base">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground font-medium mb-1">সময় লেগেছে</span>
            <span className="font-bold flex items-center gap-1.5"><Clock className="size-4" /> {formatTime(submission.timeTakenSeconds)}</span>
          </div>
          <div className="w-px bg-border h-10"></div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground font-medium mb-1">সঠিক উত্তর</span>
            <span className="font-bold text-emerald-500">{responses.filter((r: any) => r.isCorrect).length} টি</span>
          </div>
          <div className="w-px bg-border h-10"></div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground font-medium mb-1">ভুল উত্তর</span>
            <span className="font-bold text-destructive">{responses.filter((r: any) => !r.isCorrect && r.selectedOptionId).length} টি</span>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <Link href={`/exams/${slug}/leaderboard`}>
            <Button className="rounded-full px-8 h-12 gap-2" size="lg">
              <StatusUp className="size-5" /> লিডারবোর্ড
            </Button>
          </Link>
          <Link href={`/exams/${slug}`}>
            <Button variant="outline" className="rounded-full px-8 h-12" size="lg">ফিরে যান</Button>
          </Link>
        </div>
      </div>

      {/* Answer Review */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b pb-2">উত্তরপত্র পর্যালোচনা</h2>
        
        {responses.map((res: any, idx: number) => {
          const eq = res.examQuestion;
          const q = eq.question;
          const isCorrect = res.isCorrect;
          const marksObtained = parseFloat(res.marksObtained);

          return (
            <div key={res.id} className={`bg-card border rounded-2xl p-6 ${isCorrect ? 'border-emerald-500/30' : res.selectedOptionId ? 'border-destructive/30' : ''}`}>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex gap-3">
                  <span className="font-bold text-lg">{idx + 1}.</span>
                  <h3 className="font-medium text-base" dangerouslySetInnerHTML={{ __html: q.questionText }}></h3>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap shrink-0 
                  ${marksObtained > 0 ? 'bg-emerald-500/10 text-emerald-600' : marksObtained < 0 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                  {marksObtained > 0 ? '+' : ''}{marksObtained} Marks
                </div>
              </div>

              {q.type === "mcq" && q.mcqOptions && (
                <div className="space-y-2 pl-8">
                  {q.mcqOptions.map((opt: any) => {
                    const isSelected = res.selectedOptionId === opt.id;
                    const isActualCorrect = opt.isCorrect;
                    
                    let bgClass = "bg-background border-muted";
                    if (isActualCorrect) bgClass = "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium";
                    else if (isSelected && !isActualCorrect) bgClass = "bg-destructive/10 border-destructive text-destructive font-medium";

                    return (
                      <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border ${bgClass}`}>
                        <div className={`size-5 rounded-full border flex items-center justify-center shrink-0 
                          ${isActualCorrect ? 'border-emerald-500' : isSelected ? 'border-destructive' : 'border-muted-foreground'}`}>
                          {(isSelected || isActualCorrect) && <div className={`size-2.5 rounded-full ${isActualCorrect ? 'bg-emerald-500' : 'bg-destructive'}`} />}
                        </div>
                        <span className="text-sm" dangerouslySetInnerHTML={{ __html: opt.optionText }}></span>
                      </div>
                    );
                  })}
                </div>
              )}

              {q.type === "cq" && (
                <div className="pl-8 space-y-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase">আপনার উত্তর:</div>
                  <div className="p-4 rounded-xl bg-muted/50 text-sm whitespace-pre-wrap">
                    {res.cqAnswerText || <span className="text-muted-foreground italic">উত্তর দেয়া হয়নি</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
