"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { deleteCourse } from "@/lib/actions/admin-course";

interface DeleteCourseButtonProps {
  readonly courseId: string;
  readonly courseTitle: string;
}

export function DeleteCourseButton({
  courseId,
  courseTitle,
}: DeleteCourseButtonProps) {
  const router = useRouter();

  const handleConfirm = async () => {
    await deleteCourse(courseId);
    router.refresh();
  };

  return (
    <DeleteConfirmDialog
      title="কোর্স ডিলিট নিশ্চিতকরণ"
      description={`আপনি কি নিশ্চিতভাবে "${courseTitle}" কোর্সটি ডিলিট করতে চান? এর ভিতরের সব ক্লাস ও রিসোর্স মুছে যাবে!`}
      onConfirm={handleConfirm}
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
