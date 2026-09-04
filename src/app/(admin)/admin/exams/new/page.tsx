"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-auth";
import { createExamAction } from "@/lib/actions/admin-exam";
import { getAllBatchesAction } from "@/lib/actions/batch";

export default function NewExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBatchId = searchParams.get("batchId") || "";

  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);

  useEffect(() => {
    getAllBatchesAction().then((res) => {
      if (res.success && res.data) {
        setBatches(res.data);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isFreeExam = formData.get("isFreeExam") === "true";
    const batchId = (formData.get("batchId") as string) || null;
    const type = isFreeExam || !batchId ? "practice" : "chapter_test";
    const durationMinutes = parseInt(
      formData.get("durationMinutes") as string,
      10,
    );
    const totalMarks = parseInt(formData.get("totalMarks") as string, 10);
    const negativeMarking = formData.get("negativeMarking") as string;
    const showResultImmediately =
      formData.get("showResultImmediately") === "true";
    const isPublished = formData.get("isPublished") === "true";

    const createdBy = user?.id || "admin";

    const res = await createExamAction({
      title,
      slug,
      description,
      type,
      durationMinutes,
      totalMarks,
      negativeMarking,
      showResultImmediately,
      isPublished,
      createdBy,
      batchId,
    });

    if (res.success) {
      router.push(`/admin/exams/${res.data?.id}/questions`);
    } else {
      setError(res.error || "Failed to create exam");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          নতুন পরীক্ষা তৈরি করুন
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 border p-6 rounded-xl bg-card"
      >
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            পরীক্ষার শিরোনাম
          </label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g. Physics Chapter 1 MCQ Test"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            স্লাগ (Slug)
          </label>
          <Input
            id="slug"
            name="slug"
            required
            placeholder="e.g. physics-ch1-mcq"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            বর্ণনা
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Optional description"
            className="rounded-xl min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="batchId" className="text-sm font-medium">
            কোর্স / ব্যাচ নির্বাচন করুন (ঐচ্ছিক)
          </label>
          <select
            id="batchId"
            name="batchId"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full h-10 px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">কোনো কোর্সে যুক্ত নয় (সরাসরি এক্সাম)</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            কোর্স নির্বাচন করলে স্বয়ংক্রিয়ভাবে সেই কোর্সের শিক্ষার্থীদের জন্য এক্সামটি উন্মুক্ত হবে।
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="durationMinutes" className="text-sm font-medium">
              সময় (মিনিট)
            </label>
            <Input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              required
              min="1"
              placeholder="e.g. 25"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="totalMarks" className="text-sm font-medium">
              মোট মার্কস
            </label>
            <Input
              id="totalMarks"
              name="totalMarks"
              type="number"
              required
              min="1"
              placeholder="e.g. 25"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="negativeMarking" className="text-sm font-medium">
              নেগেটিভ মার্কিং
            </label>
            <Input
              id="negativeMarking"
              name="negativeMarking"
              required
              placeholder="e.g. 0.25"
              defaultValue="0.25"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 p-4 border rounded-xl bg-muted/50 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFreeExam"
              value="true"
              defaultChecked
              className="size-4 rounded accent-primary"
            />
            <span className="text-sm font-medium">ফ্রি এক্সাম (সবার জন্য উন্মুক্ত)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="showResultImmediately"
              value="true"
              defaultChecked
              className="size-4 rounded accent-primary"
            />
            <span className="text-sm font-medium">সাথেই রেজাল্ট দেখান</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked
              className="size-4 rounded accent-primary"
            />
            <span className="text-sm font-medium">পাবলিশ করুন (Published)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => router.back()}
          >
            বাতিল
          </Button>
          <Button type="submit" className="rounded-xl" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="size-4 mr-2" /> তৈরি হচ্ছে...
              </>
            ) : (
              "পরবর্তী ধাপ (প্রশ্ন যোগ করুন)"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
