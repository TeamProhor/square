"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createContainerAction } from "@/lib/actions/question";

interface NewQuestionBankFormProps {
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function NewQuestionBankForm({
  onSuccess,
  onCancel,
}: NewQuestionBankFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsPending(true);
    setError(null);
    const res = await createContainerAction(
      title,
      slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description,
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
          <FieldLabel>শিরোনাম (Title)</FieldLabel>
          <Input
            required
            placeholder="যেমন: HSC 2026 প্রস্তুতি প্রশ্নব্যাংক"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input
            required
            placeholder="hsc-2026"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel>বিবরণ (Description)</FieldLabel>
          <Textarea
            rows={3}
            placeholder="প্রশ্নব্যাংকের বিবরণ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner className="size-4 mr-2" /> সংরক্ষণ হচ্ছে...
            </>
          ) : (
            "সংরক্ষণ করুন"
          )}
        </Button>
      </div>
    </form>
  );
}
