"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updateTopicAction } from "@/lib/actions/question";
import type { Topic } from "@/types";

interface EditTopicFormProps {
  readonly qbSlug: string;
  readonly subjectSlug: string;
  readonly chapterSlug: string;
  readonly topic: Topic;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function EditTopicForm({
  qbSlug,
  subjectSlug,
  chapterSlug,
  topic,
  onSuccess,
  onCancel,
}: EditTopicFormProps) {
  const [name, setName] = useState(topic.name || "");
  const [slug, setSlug] = useState(topic.slug || "");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setIsPending(true);
    setError(null);
    const res = await updateTopicAction(
      topic.id,
      qbSlug,
      subjectSlug,
      chapterSlug,
      {
        name,
        slug,
      },
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          বাতিল
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner className="size-4 mr-2" /> আপডেট হচ্ছে...
            </>
          ) : (
            "আপডেট করুন"
          )}
        </Button>
      </div>
    </form>
  );
}
