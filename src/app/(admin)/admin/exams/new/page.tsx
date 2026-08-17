"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createExamAction } from "@/lib/actions/admin-exam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-auth";

export default function NewExamPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as "practice" | "chapter_test" | "weekly" | "model_test" | "live_contest";
    const durationMinutes = parseInt(formData.get("durationMinutes") as string);
    const totalMarks = parseInt(formData.get("totalMarks") as string);
    const passMarks = parseInt(formData.get("passMarks") as string) || 0;
    const negativeMarking = formData.get("negativeMarking") as string;
    const showResultImmediately = formData.get("showResultImmediately") === "true";
    const isPublished = formData.get("isPublished") === "true";

    const createdBy = user?.id || "admin";

    const res = await createExamAction({
      title,
      slug,
      description,
      type,
      durationMinutes,
      totalMarks,
      passMarks,
      negativeMarking,
      showResultImmediately,
      isPublished,
      createdBy,
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
        <h1 className="text-2xl font-extrabold tracking-tight">নতুন পরীক্ষা তৈরি করুন</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 border p-6 rounded-xl bg-card">
        {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">পরীক্ষার শিরোনাম</label>
          <Input name="title" required placeholder="e.g. Physics Chapter 1 MCQ Test" className="rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">স্লাগ (Slug)</label>
          <Input name="slug" required placeholder="e.g. physics-ch1-mcq" className="rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">বর্ণনা</label>
          <Textarea name="description" placeholder="Optional description" className="rounded-xl min-h-[100px]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ধরন</label>
            <select name="type" required className="w-full h-10 px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="practice">Practice (Public)</option>
              <option value="chapter_test">Chapter Test</option>
              <option value="weekly">Weekly</option>
              <option value="model_test">Model Test</option>
              <option value="live_contest">Live Contest</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">সময় (মিনিট)</label>
            <Input name="durationMinutes" type="number" required min="1" placeholder="e.g. 25" className="rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">মোট মার্কস</label>
            <Input name="totalMarks" type="number" required min="1" placeholder="e.g. 25" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">পাস মার্কস</label>
            <Input name="passMarks" type="number" placeholder="e.g. 10" className="rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">নেগেটিভ মার্কিং</label>
            <Input name="negativeMarking" required placeholder="e.g. 0.25" defaultValue="0.25" className="rounded-xl" />
          </div>
        </div>

        <div className="flex gap-4 p-4 border rounded-xl bg-muted/50 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="showResultImmediately" value="true" defaultChecked className="size-4" />
            <span className="text-sm font-medium">সাথেই রেজাল্ট দেখান</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isPublished" value="true" className="size-4" />
            <span className="text-sm font-medium">পাবলিশ করুন (Published)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => router.back()}>
            বাতিল
          </Button>
          <Button type="submit" className="rounded-xl" disabled={loading}>
            {loading ? "তৈরি হচ্ছে..." : "পরবর্তী ধাপ (প্রশ্ন যোগ করুন)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
