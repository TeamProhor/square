"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Add,
  ArchiveBox,
  DocumentDownload,
  Download,
  Edit,
  Eye,
  FileDown,
  Trash2,
} from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type CreatePdfPayload,
  createBatchPdf,
  deleteBatchPdf,
  getBatchPdfs,
  updateBatchPdf,
} from "@/lib/actions/course-content";
import type { CoursePdf } from "@/types";

export function BatchPdfsTab({ batchId }: { batchId: string }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<CoursePdf | null>(null);
  const [previewPdf, setPreviewPdf] = useState<CoursePdf | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [description, setDescription] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: pdfs = [], isLoading } = useQuery<CoursePdf[]>({
    queryKey: ["batch-pdfs", batchId],
    queryFn: () => getBatchPdfs(batchId),
  });

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setChapter("");
    setPdfUrl("");
    setDescription("");
    setFileSize("");
    setOrderIndex(pdfs.length + 1);
    setFormError(null);
    setEditingPdf(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditDialog = (p: CoursePdf) => {
    setEditingPdf(p);
    setTitle(p.title);
    setSubject(p.subject);
    setChapter(p.chapter || "");
    setPdfUrl(p.pdfUrl);
    setDescription(p.description || "");
    setFileSize(p.fileSize || "");
    setOrderIndex(p.orderIndex || 1);
    setFormError(null);
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: CreatePdfPayload) => {
      const res = await createBatchPdf(payload);
      if (!res.success) throw new Error(res.message || "Failed to add PDF");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-pdfs", batchId] });
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
      payload: Partial<CreatePdfPayload>;
    }) => {
      const res = await updateBatchPdf(id, payload);
      if (!res.success) throw new Error(res.message || "Failed to update PDF");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-pdfs", batchId] });
      setIsOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "একটি ত্রুটি ঘটেছে");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteBatchPdf(id);
      if (!res.success) throw new Error(res.message || "Failed to delete PDF");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-pdfs", batchId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("পিডিএফের শিরোনাম দিন");
      return;
    }
    if (!pdfUrl.trim()) {
      setFormError("পিডিএফের লিঙ্ক (URL) দিন");
      return;
    }

    if (editingPdf) {
      updateMutation.mutate({
        id: editingPdf.id,
        payload: {
          title,
          subject,
          chapter,
          pdfUrl,
          description,
          fileSize,
          orderIndex: Number(orderIndex),
        },
      });
    } else {
      createMutation.mutate({
        batchId,
        title,
        subject: subject || "সাধারণ",
        chapter,
        pdfUrl,
        description,
        fileSize,
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
            <DocumentDownload className="size-5 text-primary" />
            কোর্সের পিডিএফ রিসোর্স ও লেকচার শিট ({pdfs.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            এই কোর্সের শিক্ষার্থীরা ক্লাসরুম ভিউতে এই পিডিএফগুলো সরাসরি পড়তে ও ডাউনলোড করতে
            পারবে।
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="rounded-full shadow-xs gap-1.5 h-10 px-5 font-semibold cursor-pointer w-full sm:w-auto"
        >
          <Add className="size-4" /> নতুন পিডিএফ যুক্ত করুন
        </Button>
      </div>

      {/* PDF List */}
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center">
          <Spinner className="size-8 text-primary mb-3" />
          <p className="text-sm text-muted-foreground">
            পিডিএফ তালিকা লোড হচ্ছে...
          </p>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl bg-muted/10 space-y-3">
          <DocumentDownload className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">
            এখনও কোনো পিডিএফ যোগ করা হয়নি
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            উপরের "নতুন পিডিএফ যুক্ত করুন" বাটনে ক্লিক করে লেকচার শিট ও হ্যান্ডনোট লিঙ্ক
            যোগ করুন।
          </p>
          <Button
            onClick={openCreateDialog}
            variant="outline"
            size="sm"
            className="rounded-xl mt-2"
          >
            + প্রথম পিডিএফ যুক্ত করুন
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-primary/40 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {pdf.subject}
                  </span>
                  {pdf.chapter && (
                    <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[200px]">
                      {pdf.chapter}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 shrink-0">
                    <FileDown className="size-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base leading-snug">
                      {pdf.title}
                    </h3>
                    {pdf.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {pdf.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  {pdf.fileSize && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <ArchiveBox className="size-3.5 shrink-0" />
                      <span>{pdf.fileSize}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded">
                    সিরিয়াল: #{pdf.orderIndex}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewPdf(pdf)}
                    className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer font-medium"
                  >
                    <Eye className="size-3.5 text-primary" /> প্রিভিউ
                  </Button>
                  <a
                    href={pdf.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <Download className="size-3.5" /> ওপেন
                    </Button>
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(pdf)}
                    className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Edit className="size-4" />
                  </Button>

                  <DeleteConfirmDialog
                    title="পিডিএফ ডিলিট নিশ্চিতকরণ"
                    description={`আপনি কি নিশ্চিত "${pdf.title}" পিডিএফ রিসোর্সটি মুছে ফেলতে চান?`}
                    onConfirm={async () => {
                      await deleteMutation.mutateAsync(pdf.id);
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
          ))}
        </div>
      )}

      {/* Add / Edit PDF Dialog */}
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={editingPdf ? "পিডিএফ তথ্য সম্পাদনা করুন" : "নতুন পিডিএফ যুক্ত করুন"}
        description="হ্যান্ডনোট, সাজেশন বা ফর্মুলা শিটের লিঙ্ক ও বিবরণ প্রদান করুন।"
        className="sm:max-w-[540px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {formError && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="pdf-title">পিডিএফ শিরোনাম *</Label>
            <Input
              id="pdf-title"
              placeholder="যেমন: ভেক্টর স্পেশাল ফর্মুলা শিট ও হ্যান্ডনোট"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pdf-subject">বিষয় *</Label>
              <Input
                id="pdf-subject"
                placeholder="যেমন: পদার্থবিজ্ঞান ১ম পত্র"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pdf-chapter">অধ্যায় (ঐচ্ছিক)</Label>
              <Input
                id="pdf-chapter"
                placeholder="যেমন: অধ্যায় ০২: ভেক্টর"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pdf-url">পিডিএফ ডাউনলোড / ড্রাইভ লিঙ্ক (URL) *</Label>
            <Input
              id="pdf-url"
              placeholder="https://drive.google.com/file/d/... অথবা ডিরেক্ট পিডিএফ লিঙ্ক"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pdf-size">ফাইল সাইজ (ঐচ্ছিক)</Label>
              <Input
                id="pdf-size"
                placeholder="যেমন: 2.4 MB"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pdf-order">ক্রম নম্বর (Order)</Label>
              <Input
                id="pdf-order"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pdf-desc">বিবরণ (ঐচ্ছিক)</Label>
            <Input
              id="pdf-desc"
              placeholder="পিডিএফের বিষয়বস্তু বা নির্দেশাবলী"
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
              ) : editingPdf ? (
                "আপডেট করুন"
              ) : (
                "পিডিএফ যুক্ত করুন"
              )}
            </Button>
          </div>
        </form>
      </ResponsiveDialog>

      {/* PDF Viewer / Preview Modal */}
      {previewPdf && (
        <ResponsiveDialog
          open={Boolean(previewPdf)}
          onOpenChange={(open) => !open && setPreviewPdf(null)}
          title={previewPdf.title}
          description={`${previewPdf.subject} ${previewPdf.chapter ? `• ${previewPdf.chapter}` : ""}`}
          className="sm:max-w-[850px]"
        >
          <div className="space-y-3 py-2">
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden bg-muted/20 border border-border">
              <iframe
                src={
                  previewPdf.pdfUrl.includes("drive.google.com")
                    ? previewPdf.pdfUrl.replace("/view", "/preview")
                    : previewPdf.pdfUrl
                }
                title={previewPdf.title}
                className="w-full h-full"
              />
            </div>
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs text-muted-foreground">
                {previewPdf.description || "পিডিএফ ফাইল ভিউয়ার"}
              </span>
              <a
                href={previewPdf.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="rounded-xl h-8 text-xs gap-1.5 font-bold"
                >
                  <Download className="size-3.5" /> আলাদা ট্যাবে খুলুন
                </Button>
              </a>
            </div>
          </div>
        </ResponsiveDialog>
      )}
    </div>
  );
}
