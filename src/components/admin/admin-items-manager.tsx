"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditSubjectForm } from "@/components/admin/forms/edit-subject-form";
import { NewSubjectForm } from "@/components/admin/forms/new-subject-form";
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
import { deleteItemAction as deleteSubjectAction } from "@/lib/actions/question";
import { toast } from "sonner";
import type { Container, Item } from "@/types";

interface AdminItemsManagerProps {
  readonly qb: Container;
  readonly initialSubjects: readonly Item[];
}

export function AdminItemsManager({
  qb,
  initialSubjects,
}: AdminItemsManagerProps) {
  const router = useRouter();
  const [subjects, setSubjects] = useState<readonly Item[]>(initialSubjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Item | null>(null);

  useEffect(() => {
    setSubjects(initialSubjects);
  }, [initialSubjects]);

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const res = await deleteSubjectAction(subjectId, qb.slug);
      if (res?.error) {
        toast.error(res.error);
      } else {
        setSubjects((prev) => prev.filter((sub) => sub.id !== subjectId));
        toast.success("বিষয়টি সফলভাবে ডিলিট করা হয়েছে");
        router.refresh();
      }
    } catch {
      toast.error("বিষয় ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const items: QuickListItem[] = subjects.map((sub: Item) => ({
    href: `/admin/qb/${qb.slug}/${sub.slug}`,
    title: sub.name,
    description: (
      <span className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 font-medium">
          <BookOpen className="size-3.5" /> {sub.subitems?.[0]?.count ?? 0} টি
          অধ্যায়
        </span>
        <span className="flex items-center gap-1 font-medium">
          <TaskSquare className="size-3.5" /> {sub.questions?.[0]?.count ?? 0}{" "}
          টি প্রশ্ন
        </span>
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
            setEditingSubject(sub);
          }}
          className="text-primary hover:bg-primary/10 gap-1 rounded-xl text-xs cursor-pointer"
        >
          <Edit className="size-3.5" />
          <span>এডিট</span>
        </Button>
        <DeleteConfirmDialog
          title="বিষয় ডিলিট নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিতভাবে "${sub.name}" বিষয়টি ডিলিট করতে চান? এর ভিতরের সব অধ্যায় ও প্রশ্ন মুছে যাবে!`}
          onConfirm={() => handleDeleteSubject(sub.id)}
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
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link
          href="/admin/qb"
          className="hover:text-foreground transition-colors"
        >
          প্রশ্নব্যাংকসমূহ
        </Link>
        <ArrowRight2 className="size-3" />
        <span className="text-foreground font-semibold">{qb.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {qb.title} - বিষয়সমূহ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            বিষয় নির্বাচন করে অধ্যায় দেখুন অথবা বিষয় এডিট, যোগ ও রিমুভ করুন।
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl gap-2 font-bold cursor-pointer"
        >
          + নতুন বিষয় যোগ করুন
        </Button>
      </div>

      <QuickList items={items} columns={{ sm: 1, md: 2, lg: 3 }} gap="md" />

      <ResponsiveDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={`${qb.title} এ নতুন বিষয়`}
        description="বিষয়ের আইডি, নাম ও কোড লিখুন।"
        className="sm:max-w-lg"
      >
        <NewSubjectForm
          qbId={qb.id}
          qbSlug={qb.slug}
          onSuccess={() => {
            setIsCreateOpen(false);
            router.refresh();
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </ResponsiveDialog>

      <ResponsiveDialog
        open={Boolean(editingSubject)}
        onOpenChange={(open) => {
          if (!open) setEditingSubject(null);
        }}
        title="বিষয় এডিট করুন"
        description="বিষয়ের নাম, slug ও কোড পরিবর্তন করুন।"
        className="sm:max-w-lg"
      >
        {editingSubject && (
          <EditSubjectForm
            qbSlug={qb.slug}
            subject={editingSubject}
            onSuccess={() => {
              setEditingSubject(null);
              router.refresh();
            }}
            onCancel={() => setEditingSubject(null)}
          />
        )}
      </ResponsiveDialog>
    </div>
  );
}

