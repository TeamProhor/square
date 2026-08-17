"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  addQuestionToExamAction,
  removeQuestionFromExamAction,
  reorderExamQuestionsAction,
} from "@/lib/actions/admin-exam";

export default function QuestionBuilderClient({
  exam,
  questions,
}: {
  exam: any;
  questions: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAddQuestion(questionId: string) {
    setLoading(true);
    // Simple logic: add to the end
    const nextOrderNo = exam.examQuestions.length + 1;
    await addQuestionToExamAction(exam.id, questionId, nextOrderNo, 1);
    setLoading(false);
    router.refresh();
  }

  async function handleRemoveQuestion(examQuestionId: string) {
    if (!confirm("Remove this question?")) return;
    setLoading(true);
    await removeQuestionFromExamAction(examQuestionId, exam.id);
    setLoading(false);
    router.refresh();
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === exam.examQuestions.length - 1) return;

    const newArr = [...exam.examQuestions];
    const swapIdx = direction === "up" ? index - 1 : index + 1;

    // Swap
    const temp = newArr[index];
    newArr[index] = newArr[swapIdx];
    newArr[swapIdx] = temp;

    setLoading(true);
    await reorderExamQuestionsAction(
      exam.id,
      newArr.map((eq: any) => eq.id),
    );
    setLoading(false);
    router.refresh();
  }

  const assignedQuestionIds = new Set(
    exam.examQuestions.map((eq: any) => eq.questionId),
  );
  const availableQuestions = questions.filter(
    (q: any) => !assignedQuestionIds.has(q.id),
  );

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8 h-[calc(100vh-100px)]">
      {/* Left panel: Question Bank */}
      <div className="w-full md:w-1/2 flex flex-col border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b font-bold bg-muted/50">
          প্রশ্ন ব্যাংক ({availableQuestions.length})
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {availableQuestions.map((q: any) => (
            <div
              key={q.id}
              className="p-3 border rounded-lg flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <span className="text-[10px] uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded mr-2 font-bold">
                  {q.type}
                </span>
                <span className="text-sm line-clamp-2">{q.questionText}</span>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddQuestion(q.id)}
                disabled={loading}
                variant="secondary"
              >
                Add
              </Button>
            </div>
          ))}
          {availableQuestions.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
              No more questions available
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Exam Questions */}
      <div className="w-full md:w-1/2 flex flex-col border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b font-bold bg-muted/50">
          পরীক্ষার প্রশ্নসমূহ ({exam.examQuestions.length})
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {exam.examQuestions.map((eq: any, idx: number) => (
            <div
              key={eq.id}
              className="p-3 border rounded-lg flex gap-4 items-center bg-background"
            >
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0 || loading}
                >
                  ↑
                </Button>
                <span className="text-xs font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === exam.examQuestions.length - 1 || loading}
                >
                  ↓
                </Button>
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded mr-2 font-bold">
                  {eq.question?.type}
                </span>
                <span className="text-sm line-clamp-2">
                  {eq.question?.questionText}
                </span>
                <div className="text-xs text-muted-foreground mt-1">
                  Marks: {eq.marks}
                </div>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveQuestion(eq.id)}
                disabled={loading}
              >
                Remove
              </Button>
            </div>
          ))}
          {exam.examQuestions.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
              কোনো প্রশ্ন যোগ করা হয়নি
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
