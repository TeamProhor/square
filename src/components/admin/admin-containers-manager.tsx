"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewQuestionBankForm } from "@/components/admin/forms/new-qb-form";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import { BookOpen, Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const handleDelete = async (e: React.MouseEvent, qbId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      confirm(
        "আপনি কি নিশ্চিত যে এই প্রশ্নব্যাংকটি ডিলিট করতে চান? এর ভিতরের সব ডাটা মুছে যাবে!",
      )
    ) {
      await deleteContainerAction(qbId);
      router.refresh();
    }
  };

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
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleDelete(e, qb.id)}
        className="text-destructive hover:bg-destructive/10 gap-1 rounded-xl text-xs"
      >
        <Trash2 className="size-3.5" />
        <span>ডিলিট</span>
      </Button>
    ),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            প্রশ্নব্যাংকসমূহ (Question Banks)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            একটি প্রশ্নব্যাংক নির্বাচন করে তার বিষয়সমূহ দেখুন অথবা নতুন প্রশ্নব্যাংক যোগ করুন।
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl gap-2 font-bold"
        >
          + নতুন প্রশ্নব্যাংক যোগ করুন
        </Button>
      </div>

      <QuickList items={items} columns={{ sm: 1, lg: 2 }} gap="md" />

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              নতুন প্রশ্নব্যাংক
            </DialogTitle>
            <DialogDescription>
              প্রশ্নব্যাংকের শিরোনাম ও বিবরণ লিখুন।
            </DialogDescription>
          </DialogHeader>
          <NewQuestionBankForm
            onSuccess={() => {
              setIsCreateOpen(false);
              router.refresh();
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
