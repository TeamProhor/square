"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  addQuestionToExamAction,
  removeQuestionFromExamAction,
  reorderExamQuestionsAction,
} from "@/lib/actions/admin-exam";
import type { ExamDetail, ExamQuestion, Question } from "@/types";

interface ExamWithQuestions extends ExamDetail {
  examQuestions: ExamQuestion[];
}

interface ExamQuestionBuilderProps {
  exam: ExamWithQuestions;
  questions: Question[];
}

export function ExamQuestionBuilder({
  exam,
  questions,
}: ExamQuestionBuilderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAddQuestion(questionId: string) {
    setLoading(true);
    const nextOrderNo = exam.examQuestions.length + 1;
    await addQuestionToExamAction(exam.id, questionId, nextOrderNo, 1);
    setLoading(false);
    router.refresh();
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === exam.examQuestions.length - 1) return;

    const newArr = [...exam.examQuestions];
    const swapIdx = direction === "up" ? index - 1 : index + 1;

    const temp = newArr[index];
    newArr[index] = newArr[swapIdx];
    newArr[swapIdx] = temp;

    setLoading(true);
    await reorderExamQuestionsAction(
      exam.id,
      newArr.map((eq) => eq.id),
    );
    setLoading(false);
    router.refresh();
  }

  const assignedQuestionIds = new Set(
    exam.examQuestions.map((eq) => eq.questionId),
  );
  const availableQuestions = questions.filter(
    (q) => !assignedQuestionIds.has(q.id),
  );

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8 h-[calc(100vh-100px)]">
      {/* Left panel: Question Bank */}
      <div className="w-full md:w-1/2 flex flex-col border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b font-bold bg-muted/50">
          প্রশ্ন ব্যাংক ({availableQuestions.length})
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {availableQuestions.map((q) => (
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
                যোগ করুন
              </Button>
            </div>
          ))}
          {availableQuestions.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
              আর কোনো প্রশ্ন অবশিষ্ট নেই
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
          {exam.examQuestions.map((eq, idx) => (
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
                  নম্বর: {eq.marks}
                </div>
              </div>
              <DeleteConfirmDialog
                title="প্রশ্ন ডিলিট নিশ্চিতকরণ"
                description={`আপনি কি নিশ্চিত এই পরীক্ষা থেকে "${eq.question?.questionText?.slice(0, 30)}..." প্রশ্নটি সরাতে চান?`}
                onConfirm={async () => {
                  setLoading(true);
                  await removeQuestionFromExamAction(eq.id, exam.id);
                  setLoading(false);
                  router.refresh();
                }}
                trigger={
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loading}
                    className="cursor-pointer font-bold rounded-lg"
                  >
                    ডিলিট
                  </Button>
                }
              />
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
