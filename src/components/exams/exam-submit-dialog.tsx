"use client";

import { Danger } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ExamSubmitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  answeredCount: number;
  unansweredCount: number;
  totalQuestionsCount: number;
  toBanglaDigits: (str: string | number) => string;
  onConfirmSubmit: () => void;
  isSubmitting: boolean;
}

export function ExamSubmitDialog({
  isOpen,
  onOpenChange,
  answeredCount,
  unansweredCount,
  totalQuestionsCount,
  toBanglaDigits,
  onConfirmSubmit,
  isSubmitting,
}: ExamSubmitDialogProps) {
  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="পরীক্ষা চূড়ান্তভাবে জমা দিতে চান?"
      description="সাবমিট করার পর আপনার ফলাফল ও বিশ্লেষণ প্রস্তুত করা হবে"
      className="sm:max-w-md"
    >
      <div className="flex flex-col gap-4 pt-2">
        {/* Status Summary Banner */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <span className="text-[11px] text-muted-foreground font-medium block">
              উত্তর দিয়েছেন
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {toBanglaDigits(answeredCount)} /{" "}
              {toBanglaDigits(totalQuestionsCount)}
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <span className="text-[11px] text-muted-foreground font-medium block">
              অনুতর রয়েছে
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {toBanglaDigits(unansweredCount)} টি
            </span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
            <Danger className="size-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              আপনার এখনও {toBanglaDigits(unansweredCount)} টি প্রশ্নের উত্তর বাকি
              আছে। একবার সাবমিট করার পর আর পরিবর্তন করা যাবে না।
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1 rounded-xl h-11 text-xs sm:text-sm font-semibold"
          >
            ফিরে যান
          </Button>
          <Button
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-xl h-11 text-xs sm:text-sm font-bold shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4 mr-2" /> সাবমিট হচ্ছে...
              </>
            ) : (
              "হ্যাঁ, জমা দিন"
            )}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
