"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminQuestionsManager } from "@/components/admin/admin-questions-manager";
import { EditTopicForm } from "@/components/admin/forms/edit-topic-form";
import { NewTopicForm } from "@/components/admin/forms/new-topic-form";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import {
  ArrowRight2,
  BookOpen,
  Edit,
  TaskSquare,
  Trash2,
} from "@/components/icons";
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
  const [topicsList, setTopicsList] = useState<readonly Topic[]>(initialTopics);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  useEffect(() => {
    setTopicsList(initialTopics);
  }, [initialTopics]);

  const handleDeleteTopic = async (topicId: string) => {
    try {
      const res = await deleteTopicAction(topicId, qb.slug, subject.slug, chapter.slug);
      if (res?.error) {
        toast.error(res.error);
      } else {
        setTopicsList((prev) => prev.filter((t) => t.id !== topicId));
        toast.success("টপিকটি সফলভাবে ডিলিট করা হয়েছে");
        router.refresh();
      }
    } catch {
      toast.error("টপিক ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const items: QuickListItem[] = topicsList.map((top: Topic) => ({
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
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setEditingTopic(top);
          }}
          className="text-primary hover:bg-primary/10 gap-1 rounded-xl text-xs cursor-pointer"
        >
          <Edit className="size-3.5" />
          <span>এডিট</span>
        </Button>
        <DeleteConfirmDialog
          title="টপিক ডিলিট নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিতভাবে "${top.name}" টপিকটি ডিলিট করতে চান? এর ভিতরের সব প্রশ্ন মুছে যাবে!`}
          onConfirm={() => handleDeleteTopic(top.id)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-destructive hover:bg-destructive/10 gap-1 rounded-xl text-xs cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>ডিলিট</span>
            </Button>
          }
        />
      </div>
    ),
  }));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      {/* Breadcrumbs */}
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
        <span className="text-foreground font-semibold">{chapter.name}</span>
      </div>

      {/* Topics Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {chapter.name} - টপিকসমূহ ({topicsList.length})
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              অধ্যায়টিকে সুনির্দিষ্ট টপিকে ভাগ করতে টপিক যোগ বা পরিচালনা করুন।
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl gap-2 font-bold cursor-pointer text-xs h-9"
          >
            + নতুন টপিক যোগ করুন
          </Button>
        </div>

        {topicsList.length > 0 ? (
          <QuickList items={items} columns={{ sm: 1, md: 2, lg: 3 }} gap="md" />
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-border/80 text-center bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium">
              এই অধ্যায়ে এখনও কোনো টপিক তৈরি করা হয়নি। চাইলে টপিক ছাড়া সরাসরি নিচে প্রশ্ন যুক্ত করতে পারেন।
            </p>
          </div>
        )}
      </div>

      {/* Chapter Questions Manager Section */}
      <div className="pt-4 border-t border-border/80">
        <AdminQuestionsManager
          qbSlug={qb.slug}
          subjectSlug={subject.slug}
          subjectId={subject.id}
          chapterId={chapter.id}
          chapterSlug={chapter.slug}
          chapterName={chapter.name}
          topics={topicsList.map((t) => ({ id: t.id, name: t.name, slug: t.slug }))}
          hideBreadcrumbs
        />
      </div>

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

      <ResponsiveDialog
        open={Boolean(editingTopic)}
        onOpenChange={(open) => {
          if (!open) setEditingTopic(null);
        }}
        title="টপিক এডিট করুন"
        description="টপিকের নাম ও slug পরিবর্তন করুন।"
        className="sm:max-w-lg"
      >
        {editingTopic && (
          <EditTopicForm
            qbSlug={qb.slug}
            subjectSlug={subject.slug}
            chapterSlug={chapter.slug}
            topic={editingTopic}
            onSuccess={() => {
              setEditingTopic(null);
              router.refresh();
            }}
            onCancel={() => setEditingTopic(null)}
          />
        )}
      </ResponsiveDialog>
    </div>
  );
}
