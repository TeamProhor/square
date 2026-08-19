"use client";

import type * as React from "react";
import { useState } from "react";
import { Danger } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  readonly title?: string;
  readonly description?: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly trigger: React.ReactNode;
}

export function DeleteConfirmDialog({
  title = "ডিলিট করার নিশ্চিতকরণ",
  description = "আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান? এই কাজটি আর ফিরিয়ে আনা সম্ভব নয়।",
  onConfirm,
  trigger,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={
        <div className="flex items-center gap-2 text-destructive">
          <Danger className="size-5 shrink-0 text-destructive" />
          <span>{title}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto rounded-xl px-4 cursor-pointer"
          >
            বাতিল করুন
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto rounded-xl px-4 font-bold cursor-pointer"
          >
            {loading ? "ডিলিট হচ্ছে..." : "ডিলিট করুন"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
