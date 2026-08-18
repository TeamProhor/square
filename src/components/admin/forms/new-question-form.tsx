"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuestion } from "@/hooks/use-admin-qb";
import { cn } from "@/lib/utils";

interface NewQuestionFormProps {
  readonly subjectId: string;
  readonly chapterId: string;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function NewQuestionForm({
  subjectId,
  chapterId,
  onSuccess,
  onCancel,
}: NewQuestionFormProps) {
  const [type, setType] = useState<"mcq" | "cq">("mcq");
  const [source, setSource] = useState("Board");
  const [standard, setStandard] = useState("HSC");
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");

  const [mcqOptions, setMcqOptions] = useState([
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ]);

  const createMutation = useCreateQuestion();

  const handleOptionChange = (idx: number, text: string) => {
    const next = [...mcqOptions];
    next[idx].optionText = text;
    setMcqOptions(next);
  };

  const handleCorrectSelect = (correctIdx: number) => {
    const next = mcqOptions.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === correctIdx,
    }));
    setMcqOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText) return;

    createMutation.mutate(
      {
        subjectId,
        chapterId,
        type,
        source: source.trim() || "Custom",
        standard: standard.trim() || "HSC",
        questionText,
        explanation,
        mcqOptions: type === "mcq" ? mcqOptions : undefined,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {createMutation.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {createMutation.error.message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Field>
          <FieldLabel>টাইপ</FieldLabel>
          <NativeSelect
            className="w-full"
            value={type}
            onChange={(e) => setType(e.target.value as "mcq" | "cq")}
          >
            <NativeSelectOption value="mcq">MCQ (বহুনির্বাচনী)</NativeSelectOption>
            <NativeSelectOption value="cq">CQ (সৃজনশীল)</NativeSelectOption>
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel>উৎস (Source)</FieldLabel>
          <Input
            placeholder="যেমন: কুমিল্লা বোর্ড ২০২৩, ঢাকা বোর্ড ২০২২..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
            list="new-source-suggestions"
          />
          <datalist id="new-source-suggestions">
            <option value="ঢাকা বোর্ড ২০২৩" />
            <option value="কুমিল্লা বোর্ড ২০২৩" />
            <option value="চট্টগ্রাম বোর্ড ২০২৩" />
            <option value="রাজশাহী বোর্ড ২০২৩" />
            <option value="যশোর বোর্ড ২০২৩" />
            <option value="সিলেট বোর্ড ২০২৩" />
            <option value="বরিশাল বোর্ড ২০২৩" />
            <option value="দিনাজপুর বোর্ড ২০২৩" />
            <option value="ময়মনসিংহ বোর্ড ২০২৩" />
            <option value="Custom" />
          </datalist>
        </Field>

        <Field>
          <FieldLabel>মান / স্তর (Standard)</FieldLabel>
          <NativeSelect
            className="w-full"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
          >
            <NativeSelectOption value="HSC">HSC</NativeSelectOption>
            <NativeSelectOption value="Varsity">Varsity</NativeSelectOption>
            <NativeSelectOption value="Engineering">
              Engineering
            </NativeSelectOption>
            <NativeSelectOption value="Medical">Medical</NativeSelectOption>
          </NativeSelect>
        </Field>
      </div>

      <Field>
        <FieldLabel>প্রশ্নের বিবরণ (LaTeX সম্বলিত)</FieldLabel>
        <Textarea
          required
          rows={3}
          placeholder="যেমন: দুটি সমান মানের ভেক্টরের লব্ধির মান..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </Field>

      {type === "mcq" && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">MCQ অপশনসমূহ</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {mcqOptions.map((opt, idx) => (
              <div
                key={opt.optionText || (opt.isCorrect ? "correct" : "option")}
                className={cn(
                  "flex items-center gap-2 rounded-md border p-2 transition-colors",
                  opt.isCorrect
                    ? "border-primary/40 bg-primary/5"
                    : "border-input",
                )}
              >
                <input
                  type="radio"
                  name="correctOption"
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectSelect(idx)}
                  className="size-4 shrink-0 accent-primary"
                  aria-label={`অপশন ${idx + 1} সঠিক হিসেবে চিহ্নিত করুন`}
                />
                <Input
                  required
                  placeholder={`অপশন ${idx + 1}`}
                  value={opt.optionText}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            সঠিক উত্তরের পাশের রেডিও বাটনটি নির্বাচন করুন।
          </p>
        </div>
      )}

      <Field>
        <FieldLabel>ব্যাখ্যা (Optional)</FieldLabel>
        <Textarea
          rows={2}
          placeholder="প্রশ্নের বিস্তারিত ব্যাখ্যা..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </Field>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? (
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
