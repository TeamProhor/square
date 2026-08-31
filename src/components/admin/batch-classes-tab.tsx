"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Add,
  BookOpen,
  Clock,
  Edit,
  Eye,
  Flash,
  Trash2,
} from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type CreateClassPayload,
  createBatchClass,
  deleteBatchClass,
  getBatchClasses,
  updateBatchClass,
} from "@/lib/actions/course-content";
import type { CourseClass } from "@/types";

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

export function BatchClassesTab({ batchId }: { batchId: string }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [previewVideo, setPreviewVideo] = useState<CourseClass | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [orderIndex, setOrderIndex] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: classes = [], isLoading } = useQuery<CourseClass[]>({
    queryKey: ["batch-classes", batchId],
    queryFn: () => getBatchClasses(batchId),
  });

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setChapter("");
    setYoutubeUrl("");
    setDescription("");
    setDurationMinutes(60);
    setOrderIndex(classes.length + 1);
    setFormError(null);
    setEditingClass(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditDialog = (c: CourseClass) => {
    setEditingClass(c);
    setTitle(c.title);
    setSubject(c.subject);
    setChapter(c.chapter || "");
    setYoutubeUrl(c.youtubeUrl);
    setDescription(c.description || "");
    setDurationMinutes(c.durationMinutes || 60);
    setOrderIndex(c.orderIndex || 1);
    setFormError(null);
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: CreateClassPayload) => {
      const res = await createBatchClass(payload);
      if (!res.success) throw new Error(res.message || "Failed to add class");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-classes", batchId] });
      setIsOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "একটি ত্রুটি ঘটেছে");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateClassPayload>;
    }) => {
      const res = await updateBatchClass(id, payload);
      if (!res.success)
        throw new Error(res.message || "Failed to update class");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-classes", batchId] });
      setIsOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "একটি ত্রুটি ঘটেছে");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteBatchClass(id);
      if (!res.success)
        throw new Error(res.message || "Failed to delete class");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-classes", batchId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("ক্লাসের শিরোনাম দিন");
      return;
    }
    if (!youtubeUrl.trim()) {
      setFormError("ইউটিউব ভিডিও লিঙ্ক দিন");
      return;
    }

    if (editingClass) {
      updateMutation.mutate({
        id: editingClass.id,
        payload: {
          title,
          subject,
          chapter,
          youtubeUrl,
          description,
          durationMinutes: Number(durationMinutes),
          orderIndex: Number(orderIndex),
        },
      });
    } else {
      createMutation.mutate({
        batchId,
        title,
        subject: subject || "সাধারণ",
        chapter,
        youtubeUrl,
        description,
        durationMinutes: Number(durationMinutes),
        orderIndex: Number(orderIndex),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            কোর্সের ক্লাস ও ভিডিও লেকচারসমূহ ({classes.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            এই কোর্সের শিক্ষার্থীরা ক্লাসরুম ভিউতে এই ইউটিউব ক্লাসগুলো দেখতে পাবে।
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="rounded-full shadow-xs gap-1.5 h-10 px-5 font-semibold cursor-pointer w-full sm:w-auto"
        >
          <Add className="size-4" /> নতুন ক্লাস যুক্ত করুন
        </Button>
      </div>

      {/* Class List */}
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center">
          <Spinner className="size-8 text-primary mb-3" />
          <p className="text-sm text-muted-foreground">ক্লাস তালিকা লোড হচ্ছে...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl bg-muted/10 space-y-3">
          <BookOpen className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">
            এখনও কোনো ক্লাস যোগ করা হয়নি
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            উপরের "নতুন ক্লাস যুক্ত করুন" বাটনে ক্লিক করে ইউটিউব ভিডিও ক্লাস যুক্ত করুন।
          </p>
          <Button
            onClick={openCreateDialog}
            variant="outline"
            size="sm"
            className="rounded-xl mt-2"
          >
            + প্রথম ক্লাস যুক্ত করুন
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => {
            const embedUrl = getYouTubeEmbedUrl(cls.youtubeUrl);
            return (
              <div
                key={cls.id}
                className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-primary/40 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {cls.subject}
                    </span>
                    {cls.chapter && (
                      <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[200px]">
                        {cls.chapter}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base leading-snug">
                    {cls.title}
                  </h3>

                  {cls.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cls.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5 text-primary" />
                      {cls.durationMinutes} মিনিট
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded">
                      সিরিয়াল: #{cls.orderIndex}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewVideo(cls)}
                    className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer font-medium"
                  >
                    <Eye className="size-3.5 text-primary" /> প্লে প্রিভিউ
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(cls)}
                      className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Edit className="size-4" />
                    </Button>

                    <DeleteConfirmDialog
                      title="ক্লাস ডিলিট নিশ্চিতকরণ"
                      description={`আপনি কি নিশ্চিত "${cls.title}" ক্লাসটি মুছে ফেলতে চান?`}
                      onConfirm={async () => {
                        await deleteMutation.mutateAsync(cls.id);
                      }}
                      trigger={
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={deleteMutation.isPending}
                          className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Class Dialog */}
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={editingClass ? "ক্লাসের তথ্য সম্পাদনা করুন" : "নতুন ক্লাস যুক্ত করুন"}
        description="ইউটিউব ভিডিও লিঙ্ক ও বিবরণ দিয়ে কোর্সের ক্লাস তৈরি করুন।"
        className="sm:max-w-[540px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {formError && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="class-title">ক্লাসের শিরোনাম *</Label>
            <Input
              id="class-title"
              placeholder="যেমন: লেকচার ০১: ভেক্টর রাশির ডট ও ক্রস গুণন"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="class-subject">বিষয় *</Label>
              <Input
                id="class-subject"
                placeholder="যেমন: পদার্থবিজ্ঞান ১ম পত্র"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="class-chapter">অধ্যায় (ঐচ্ছিক)</Label>
              <Input
                id="class-chapter"
                placeholder="যেমন: অধ্যায় ০২: ভেক্টর"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="class-youtube">ইউটিউব ভিডিও লিঙ্ক (URL) *</Label>
            <Input
              id="class-youtube"
              placeholder="https://www.youtube.com/watch?v=... অথবা https://youtu.be/..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="class-duration">সময় (মিনিট)</Label>
              <Input
                id="class-duration"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="class-order">ক্রম নম্বর (Order)</Label>
              <Input
                id="class-order"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="class-desc">বিবরণ (ঐচ্ছিক)</Label>
            <Input
              id="class-desc"
              placeholder="ক্লাসের মূল বিষয়বস্তু বা নির্দেশাবলী"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Spinner className="mr-2" /> সংরক্ষণ হচ্ছে...
                </>
              ) : editingClass ? (
                "আপডেট করুন"
              ) : (
                "ক্লাস যুক্ত করুন"
              )}
            </Button>
          </div>
        </form>
      </ResponsiveDialog>

      {/* Video Preview Modal */}
      {previewVideo && (
        <ResponsiveDialog
          open={Boolean(previewVideo)}
          onOpenChange={(open) => !open && setPreviewVideo(null)}
          title={previewVideo.title}
          description={`${previewVideo.subject} ${previewVideo.chapter ? `• ${previewVideo.chapter}` : ""}`}
          className="sm:max-w-[720px]"
        >
          <div className="space-y-3 py-2">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border">
              <iframe
                src={getYouTubeEmbedUrl(previewVideo.youtubeUrl)}
                title={previewVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {previewVideo.description && (
              <p className="text-xs text-muted-foreground leading-relaxed px-1">
                {previewVideo.description}
              </p>
            )}
          </div>
        </ResponsiveDialog>
      )}
    </div>
  );
}
