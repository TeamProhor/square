"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewChapterForm } from "@/components/admin/forms/new-chapter-form";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import { ArrowRight2, BookOpen, TaskSquare, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteSubitemAction as deleteChapterAction } from "@/lib/actions/question";
import type { Container, Item, Subitem } from "@/types";

interface AdminSubitemsManagerProps {
  readonly qb: Container;
  readonly subject: Item;
  readonly initialChapters: readonly Subitem[];
}

export function AdminSubitemsManager({
  qb,
  subject,
  initialChapters,
}: AdminSubitemsManagerProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent, chapterId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("এই অধ্যায়টি স্থায়ীভাবে ডিলিট করতে চান?")) {
      await deleteChapterAction(chapterId, qb.slug, subject.slug);
      router.refresh();
    }
  };

  const items: QuickListItem[] = initialChapters.map((ch: Subitem) => ({
    href: `/admin/qb/${qb.slug}/${subject.slug}/${ch.slug}`,
    title: ch.name,
    description: (
      <span className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 font-medium">
          <BookOpen className="size-3.5" /> {ch.topics?.[0]?.count ?? 0} টি টপিক
        </span>
        <span className="flex items-center gap-1 font-medium">
          <TaskSquare className="size-3.5" /> {ch.questions?.[0]?.count ?? 0} টি
          প্রশ্ন
        </span>
      </span>
    ),
    icon: BookOpen,
    text: "text-primary",
    iconBg: "bg-primary/10",
    extra: ch.paper ? (
      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
        {ch.paper} Paper
      </Badge>
    ) : undefined,
    rightElement: (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleDelete(e, ch.id)}
        className="text-destructive hover:bg-destructive/10 gap-1 rounded-xl text-xs"
      >
        <Trash2 className="size-3.5" />
        <span>ডিলিট</span>
      </Button>
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
        <span className="text-foreground font-semibold">অধ্যায়সমূহ</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {subject.name} - অধ্যায়সমূহ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            অধ্যায়ের টপিক দেখতে ক্লিক করুন অথবা নতুন অধ্যায় যোগ ও রিমুভ করুন।
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl gap-2 font-bold"
        >
          + নতুন অধ্যায় যোগ করুন
        </Button>
      </div>

      <QuickList items={items} columns={{ sm: 1, md: 2, lg: 3 }} gap="md" />

      <ResponsiveDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={`${subject.name} এ নতুন অধ্যায়`}
        description="অধ্যায়ের নাম, slug ও পেপার নির্বাচন করুন।"
        className="sm:max-w-lg"
      >
        <NewChapterForm
          qbSlug={qb.slug}
          subjectId={subject.id}
          subjectSlug={subject.slug}
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
