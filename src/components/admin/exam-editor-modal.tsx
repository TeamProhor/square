"use client";

import { useState } from "react";
import { EditExamForm } from "@/components/admin/edit-exam-form";
import { Edit } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getExamWithQuestionsAdmin } from "@/lib/actions/admin-exam";
import type { ExamDetail } from "@/types";

interface ExamEditorModalProps {
  examId: string;
  examTitle?: string;
  /** Optional custom trigger — defaults to a pencil icon button */
  trigger?: React.ReactNode;
}

export function ExamEditorModal({
  examId,
  examTitle,
  trigger,
}: ExamEditorModalProps) {
  const [open, setOpen] = useState(false);
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function handleOpenChange(next: boolean) {
    if (next) {
      setFetching(true);
      setFetchError(null);
      const res = await getExamWithQuestionsAdmin(examId);
      setFetching(false);
      if (res.success && res.data) {
        setExam(res.data);
      } else {
        setFetchError(res.error || "পরীক্ষা লোড করতে ব্যর্থ হয়েছে");
        return; // don't open if fetch failed
      }
    } else {
      setExam(null);
    }
    setOpen(next);
  }

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
    >
      <Edit className="size-4" />
    </Button>
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={examTitle || "পরীক্ষা সম্পাদনা"}
      trigger={trigger ?? defaultTrigger}
      className="sm:max-w-2xl"
    >
      {fetching && (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6" />
        </div>
      )}
      {fetchError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          {fetchError}
        </div>
      )}
      {exam && <EditExamForm exam={exam} onSuccess={() => setOpen(false)} />}
    </ResponsiveDialog>
  );
}
