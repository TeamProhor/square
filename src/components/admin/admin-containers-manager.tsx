"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewQuestionBankForm } from "@/components/admin/forms/new-qb-form";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import { BookOpen, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteContainerAction } from "@/lib/actions/question";
import type { Container } from "@/types";

interface AdminContainersManagerProps {
  readonly initialQbs: readonly Container[];
}

export function AdminContainersManager({
  initialQbs,
}: AdminContainersManagerProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const items: QuickListItem[] = initialQbs.map((qb: Container) => ({
    href: `/admin/qb/${qb.slug}`,
    title: qb.title,
    icon: BookOpen,
    text: "text-primary",
    iconBg: "bg-primary/10",
    extra: (
      <span className="flex items-center gap-1 font-medium text-xs text-muted-foreground">
        {qb.items?.[0]?.count ?? 0} টি বিষয়
      </span>
    ),
    rightElement: (
      <DeleteConfirmDialog
        title="প্রশ্নব্যাংক ডিলিট নিশ্চিতকরণ"
        description="আপনি কি নিশ্চিত যে এই প্রশ্নব্যাংকটি ডিলিট করতে চান? এর ভিতরের সব বিষয়, অধ্যায় এবং প্রশ্ন মুছে যাবে!"
        onConfirm={async () => {
          await deleteContainerAction(qb.id);
          router.refresh();
        }}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="text-destructive hover:bg-destructive/10 gap-1 rounded-xl text-xs cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>ডিলিট</span>
          </Button>
        }
      />
    ),
  }));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl gap-2 font-bold"
        >
          + নতুন প্রশ্নব্যাংক যোগ করুন
        </Button>
      </div>

      <QuickList items={items} columns={{ sm: 1, lg: 2 }} gap="md" />

      <ResponsiveDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="নতুন প্রশ্নব্যাংক"
        description="প্রশ্নব্যাংকের শিরোনাম ও বিবরণ লিখুন।"
        className="sm:max-w-lg"
      >
        <NewQuestionBankForm
          onSuccess={() => {
            setIsCreateOpen(false);
            router.refresh();
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </ResponsiveDialog>
    </div>
  );
}
