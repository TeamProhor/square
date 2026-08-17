"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSubmitExam } from "@/hooks/use-exam";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function LiveExamClient({ exam, submissionId, initialTimeLeft }: { exam: any, submissionId: string, initialTimeLeft: number }) {
  const router = useRouter();
  const submitExamMutation = useSubmitExam();

  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId?: string; cqAnswerText?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isSubmitting) handleAutoSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!isSubmitting) handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prepareSubmitPayload = () => {
    return Object.entries(answers).map(([examQuestionId, ans]) => ({
      examQuestionId,
      selectedOptionId: ans.selectedOptionId,
      cqAnswerText: ans.cqAnswerText,
    }));
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    const totalTimeTaken = (exam.durationMinutes * 60) - 0; // Time's up
    const res = await submitExamMutation.mutateAsync({
      submissionId,
      responses: prepareSubmitPayload(),
      timeTakenSeconds: totalTimeTaken,
    });
    if (res.success) {
      router.replace(`/exams/${exam.slug}/result?sid=${submissionId}`);
    } else {
      alert("Error auto-submitting: " + res.error);
    }
  };

  const handleManualSubmit = async () => {
    if (!confirm("Are you sure you want to submit your exam now?")) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const totalTimeTaken = (exam.durationMinutes * 60) - timeLeft;
    const res = await submitExamMutation.mutateAsync({
      submissionId,
      responses: prepareSubmitPayload(),
      timeTakenSeconds: totalTimeTaken,
    });
    
    if (res.success) {
      router.replace(`/exams/${exam.slug}/result?sid=${submissionId}`);
    } else {
      alert("Error submitting: " + res.error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (examQuestionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [examQuestionId]: { ...prev[examQuestionId], selectedOptionId: optionId },
    }));
  };

  const handleCqChange = (examQuestionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [examQuestionId]: { ...prev[examQuestionId], cqAnswerText: text },
    }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-muted/30">
      {/* Top Bar */}
      <div className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shrink-0">
        <h1 className="font-bold text-lg hidden sm:block truncate max-w-sm">{exam.title}</h1>
        
        <div className={`font-mono font-bold text-xl px-4 py-1.5 rounded-xl ${timeLeft < 300 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          {formatTime(timeLeft)}
        </div>

        <Button onClick={handleManualSubmit} disabled={isSubmitting || submitExamMutation.isPending} className="rounded-full px-6">
          {isSubmitting ? "Submitting..." : "Submit Exam"}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Question Navigator */}
        <div className="w-20 sm:w-64 border-r bg-card flex flex-col shrink-0">
          <div className="p-4 border-b font-semibold text-sm hidden sm:block bg-muted/50">Questions</div>
          <div className="flex-1 overflow-y-auto p-2 sm:p-4">
            <div className="flex flex-wrap gap-2">
              {exam.examQuestions.map((eq: any, idx: number) => {
                const isAnswered = answers[eq.id]?.selectedOptionId || (answers[eq.id]?.cqAnswerText && answers[eq.id]?.cqAnswerText!.length > 0);
                return (
                  <a
                    key={eq.id}
                    href={`#q-${eq.id}`}
                    className={`size-10 rounded-lg flex items-center justify-center text-sm font-medium border transition-colors
                      ${isAnswered ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    {idx + 1}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Exam Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-12 pb-32">
          {exam.examQuestions.map((eq: any, idx: number) => {
            const q = eq.question;
            if (!q) return null;

            return (
              <div key={eq.id} id={`q-${eq.id}`} className="bg-card border rounded-2xl p-6 shadow-sm scroll-mt-20">
                <div className="flex justify-between items-start gap-4 mb-6 pb-4 border-b">
                  <div className="flex gap-3">
                    <span className="font-bold text-lg">{idx + 1}.</span>
                    <h3 className="font-medium text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: q.questionText }}></h3>
                  </div>
                  <div className="text-xs font-bold bg-muted px-2 py-1 rounded text-muted-foreground whitespace-nowrap shrink-0">
                    {eq.marks} Marks
                  </div>
                </div>

                {q.type === "mcq" && q.mcqOptions && (
                  <div className="space-y-3 pl-8">
                    {q.mcqOptions.map((opt: any) => {
                      const isSelected = answers[eq.id]?.selectedOptionId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleOptionSelect(eq.id, opt.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                            ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50 bg-background'}`}
                        >
                          <div className={`size-5 rounded-full border flex items-center justify-center shrink-0
                            ${isSelected ? 'border-primary' : 'border-muted-foreground'}`}>
                            {isSelected && <div className="size-2.5 rounded-full bg-primary" />}
                          </div>
                          <span className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: opt.optionText }}></span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === "cq" && q.cqParts && (
                  <div className="space-y-6 pl-8">
                    {q.cqParts.map((part: any) => (
                      <div key={part.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-semibold text-foreground">({part.partKey}) {part.questionText}</span>
                          <span className="text-xs text-muted-foreground">{part.marks} Marks</span>
                        </div>
                        {/* Currently saving CQ as a single block for the whole question instead of per part, 
                            To match the schema ExamResponse (one per examQuestionId), we just have one textarea.
                            Wait, the schema ties ExamResponse to examQuestionId. 
                            So CQ answer must be a single string. Let's just have one textarea per examQuestion. */}
                      </div>
                    ))}
                    <div className="mt-4">
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">আপনার উত্তর</label>
                      <Textarea 
                        placeholder="এখানে আপনার সম্পূর্ণ সৃজনশীল উত্তর লিখুন..." 
                        className="min-h-[200px] rounded-xl resize-y"
                        value={answers[eq.id]?.cqAnswerText || ""}
                        onChange={(e) => handleCqChange(eq.id, e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* If it's CQ but no parts (simple descriptive) */}
                {q.type === "cq" && !q.cqParts?.length && (
                   <div className="mt-4 pl-8">
                     <Textarea 
                       placeholder="এখানে আপনার উত্তর লিখুন..." 
                       className="min-h-[200px] rounded-xl resize-y"
                       value={answers[eq.id]?.cqAnswerText || ""}
                       onChange={(e) => handleCqChange(eq.id, e.target.value)}
                     />
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
