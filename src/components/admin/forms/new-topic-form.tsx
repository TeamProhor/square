"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createTopicAction } from "@/lib/actions/question";

interface NewTopicFormProps {
  readonly qbSlug: string;
  readonly subjectSlug: string;
  readonly chapterId: string;
  readonly chapterSlug: string;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function NewTopicForm({
  qbSlug,
  subjectSlug,
  chapterId,
  chapterSlug,
  onSuccess,
  onCancel,
}: NewTopicFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setIsPending(true);
    setError(null);
    const res = await createTopicAction(
      chapterId,
      qbSlug,
      subjectSlug,
      chapterSlug,
      name,
      slug.toLowerCase().trim().replace(/\s+/g, "-"),
    );
    setIsPending(false);

    if (res.error) {
      setError(res.error);
    } else {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>টপিকের নাম</FieldLabel>
          <Input
            required
            placeholder="ভেক্টরের যোগ ও বিয়োগ"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>টপিক Slug</FieldLabel>
          <Input
            required
            placeholder="vector-addition"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </form>
  );
}
