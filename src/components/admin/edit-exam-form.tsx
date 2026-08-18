"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { deleteExamAction, updateExamAction } from "@/lib/actions/admin-exam";

export function EditExamForm({ exam }: { exam: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as
        | "practice"
        | "chapter_test"
        | "weekly"
        | "model_test"
        | "live_contest",
      durationMinutes: parseInt(formData.get("durationMinutes") as string, 10),
      totalMarks: parseInt(formData.get("totalMarks") as string, 10),
      negativeMarking: formData.get("negativeMarking") as string,
      showResultImmediately: formData.get("showResultImmediately") === "true",
      isPublished: formData.get("isPublished") === "true",
    };

    const res = await updateExamAction(exam.id, data);

    if (res.success) {
      router.push(`/admin/exams/${exam.id}/questions`);
    } else {
      setError(res.error || "পরীক্ষা আপডেট করতে ব্যর্থ হয়েছে");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">এডিট পরীক্ষা</h1>
        <DeleteConfirmDialog
          title="পরীক্ষা ডিলিট নিশ্চিতকরণ"
          description="আপনি কি নিশ্চিতভাবে এই পরীক্ষাটি ডিলিট করতে চান? এই পরীক্ষাটি ও এর সকল প্রশ্ন স্থায়ীভাবে মুছে যাবে।"
          onConfirm={async () => {
            setLoading(true);
            const res = await deleteExamAction(exam.id);
            if (res.success) {
              router.push("/admin/exams");
            } else {
              setError(res.error || "পরীক্ষা ডিলিট করতে ব্যর্থ হয়েছে");
              setLoading(false);
            }
          }}
          trigger={
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl cursor-pointer"
              disabled={loading}
            >
              পরীক্ষা ডিলিট করুন
            </Button>
          }
        />
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
          <label className="text-sm font-medium">পরীক্ষার শিরোনাম (Title)</label>
          <Input
            name="title"
            required
            defaultValue={exam.title}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">স্লাগ (Slug)</label>
          <Input
            name="slug"
            required
            defaultValue={exam.slug}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">বর্ণনা (Description)</label>
          <Textarea
            name="description"
            defaultValue={exam.description || ""}
            className="rounded-xl min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">পরীক্ষার ধরন (Type)</label>
            <select
              name="type"
              defaultValue={exam.type}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="practice">Practice Exam</option>
              <option value="chapter_test">Chapter Test</option>
              <option value="weekly">Weekly Exam</option>
              <option value="model_test">Model Test</option>
              <option value="live_contest">Live Contest</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">সময় (মিনিট)</label>
            <Input
              name="durationMinutes"
              type="number"
              required
              defaultValue={exam.durationMinutes}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">মোট নম্বর (Total Marks)</label>
            <Input
              name="totalMarks"
              type="number"
              required
              defaultValue={exam.totalMarks}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">নেগেটিভ মার্কিং</label>
            <Input
              name="negativeMarking"
              defaultValue={exam.negativeMarking}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="showResultImmediately"
              value="true"
              defaultChecked={exam.showResultImmediately}
              className="size-4"
            />
            <span className="text-sm font-medium">
              পরীক্ষা শেষ হওয়ার সাথে সাথে রেজাল্ট দেখাবে
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={exam.isPublished}
              className="size-4"
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
                <Spinner className="size-4 mr-2" /> সংরক্ষণ হচ্ছে...
              </>
            ) : (
              "সংরক্ষণ করুন"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
