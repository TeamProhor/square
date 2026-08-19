"use client";

import { useRouter } from "next/navigation";
import { Clock, Information, TaskSquare } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStartExam } from "@/hooks/use-exam";
import type { ExamDetail } from "@/types";

interface ExamAccess {
  allowed: boolean;
  error?: string;
  batchExamId?: string | null;
}

interface ExamLobbyViewProps {
  exam: ExamDetail;
  access: ExamAccess;
  userId: string;
}

export function ExamLobbyView({ exam, access, userId }: ExamLobbyViewProps) {
  const router = useRouter();
  const startExamMutation = useStartExam();

  const handleStart = async () => {
    if (!access.allowed) return;

    // We pass batchExamId if it's assigned via batch. Otherwise it's undefined (for practice exams).
    const res = await startExamMutation.mutateAsync({
      examId: exam.id,
      userId: userId,
      batchExamId: access.batchExamId || undefined,
    });

    if (res.success && res.submission?.id) {
      router.push(`/exams/${exam.slug}/take?sid=${res.submission.id}`);
    } else {
      alert(`পরীক্ষা শুরু করতে সমস্যা হয়েছে: ${res.error}`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-12 pt-4 md:py-12 gap-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {exam.title}
        </h1>
        {exam.description && (
          <p className="text-muted-foreground">{exam.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <TaskSquare className="size-6 text-primary mb-2" />
          <div className="text-2xl font-bold">{exam.totalMarks}</div>
          <div className="text-xs text-muted-foreground font-medium">
            মোট মার্কস
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Clock className="size-6 text-primary mb-2" />
          <div className="text-2xl font-bold">{exam.durationMinutes}</div>
          <div className="text-xs text-muted-foreground font-medium">
            সময় (মিনিট)
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Information className="size-6 text-amber-500 mb-2" />
          <div className="text-2xl font-bold text-amber-500">
            {exam.negativeMarking}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            নেগেটিভ মার্কিং
          </div>
        </div>
      </div>

      <div className="bg-muted/50 border rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">নির্দেশনা</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>পরীক্ষা শুরু করার পর কোনোভাবেই ট্যাব বা ব্রাউজার বন্ধ করা যাবে না।</li>
          <li>নির্ধারিত সময় শেষ হওয়ার সাথে সাথে পরীক্ষা স্বয়ংক্রিয়ভাবে সাবমিট হয়ে যাবে।</li>
          <li>প্রতিটি ভুল উত্তরের জন্য {exam.negativeMarking} নম্বর কাটা যাবে।</li>
          <li>যেকোনো ধরনের অসাধু উপায় অবলম্বন করলে পরীক্ষা বাতিল বলে গণ্য হবে।</li>
        </ul>
      </div>

      <div className="flex flex-col items-center pt-4">
        {!access.allowed ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center font-medium w-full">
            দুঃখিত, আপনি এই পরীক্ষায় অংশগ্রহণ করার জন্য অনুমোদিত নন।
            <div className="text-xs mt-1 font-normal opacity-80">
              {access.error}
            </div>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full md:w-auto px-12 rounded-full h-14 text-lg font-bold shadow-lg"
            onClick={handleStart}
            disabled={startExamMutation.isPending}
          >
            {startExamMutation.isPending ? (
              <>
                <Spinner className="size-5 mr-2" /> শুরু হচ্ছে...
              </>
            ) : (
              "পরীক্ষা শুরু করুন"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
