"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBatchAction } from "@/lib/actions/batch";

export default function NewBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const courseId = formData.get("courseId") as string;

    const res = await createBatchAction(name, slug, description, courseId);

    if (res.success) {
      router.push("/admin/batches");
    } else {
      setError(res.error || "Failed to create batch");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          নতুন ব্যাচ তৈরি করুন
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
          <label className="text-sm font-medium">ব্যাচের নাম</label>
          <Input
            name="name"
            required
            placeholder="e.g. HSC 2026 Science"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">স্লাগ (Slug)</label>
          <Input
            name="slug"
            required
            placeholder="e.g. hsc-2026-science"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">বর্ণনা (Optional)</label>
          <Textarea
            name="description"
            placeholder="Short description of this batch"
            className="rounded-xl min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Course ID (Optional)</label>
          <Input
            name="courseId"
            placeholder="Related Course ID if any"
            className="rounded-xl"
          />
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
            {loading ? "তৈরি হচ্ছে..." : "ব্যাচ তৈরি করুন"}
          </Button>
        </div>
      </form>
    </div>
  );
}
