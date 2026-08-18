"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewTopicForm } from "@/components/admin/forms/new-topic-form";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import { ArrowRight2, BookOpen, TaskSquare, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteTopicAction } from "@/lib/actions/question";
import type { Container, Item, Subitem, Topic } from "@/types";

interface AdminTopicsManagerProps {
  readonly qb: Container;
  readonly subject: Item;
  readonly chapter: Subitem;
  readonly initialTopics: readonly Topic[];
}

export function AdminTopicsManager({
  qb,
  subject,
  chapter,
  initialTopics,
}: AdminTopicsManagerProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const items: QuickListItem[] = initialTopics.map((top: Topic) => ({
    href: `/admin/qb/${qb.slug}/${subject.slug}/${chapter.slug}/${top.slug}`,
    title: top.name,
    description: (
      <span className="flex items-center gap-1 font-medium text-xs">
        <TaskSquare className="size-3.5" /> {top.questions?.[0]?.count ?? 0} টি
        প্রশ্ন
      </span>
    ),
    icon: BookOpen,
    text: "text-primary",
    iconBg: "bg-primary/10",
    rightElement: (
      <DeleteConfirmDialog
        title="টপিক ডিলিট নিশ্চিতকরণ"
        description={`আপনি কি নিশ্চিতভাবে "${top.name}" টপিকটি ডিলিট করতে চান? এর ভিতরের সব প্রশ্ন মুছে যাবে!`}
        onConfirm={async () => {
          await deleteTopicAction(top.id, qb.slug, subject.slug, chapter.slug);
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
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground flex-wrap">
        <Link
          href="/admin/qb"
          className="hover:text-foreground transition-colors"
        >
          প্রশ্নব্যাংকসমূহ
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qb.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {qb.title}
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qb.slug}/${subject.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {subject.name}
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qb.slug}/${subject.slug}/${chapter.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {chapter.name}
        </Link>
        <ArrowRight2 className="size-3" />
        <span className="text-foreground font-semibold">টপিকসমূহ</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {chapter.name} - টপিকসমূহ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            টপিকের প্রশ্ন দেখতে ক্লিক করুন অথবা নতুন টপিক যোগ ও রিমুভ করুন।
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl gap-2 font-bold"
        >
          + নতুন টপিক যোগ করুন
        </Button>
      </div>

      <QuickList items={items} columns={{ sm: 1, md: 2, lg: 3 }} gap="md" />

      <ResponsiveDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={`${chapter.name} এ নতুন টপিক`}
        description="টপিকের নাম লিখুন।"
        className="sm:max-w-lg"
      >
        <NewTopicForm
          qbSlug={qb.slug}
          subjectSlug={subject.slug}
          chapterId={chapter.id}
          chapterSlug={chapter.slug}
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
