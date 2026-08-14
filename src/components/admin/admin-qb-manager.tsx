"use client";

import { useState } from "react";
import { Star, TaskSquare, Trash2 } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminQuestions,
  useCreateQuestion,
  useDeleteQuestion,
} from "@/hooks/use-admin-qb";
import type { MCQOption, Question } from "@/types";

export function AdminQbManager() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [subjectId, setSubjectId] = useState("physics");
  const [type, setType] = useState<"mcq" | "cq">("mcq");
  const [source, setSource] = useState<
    "frostfoe" | "varsity" | "engineering" | "board" | "custom_csv_json"
  >("board");
  const [standard, _setStandard] = useState<
    "board" | "varsity" | "engineering" | "medical"
  >("board");
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");

  const [mcqOptions, setMcqOptions] = useState([
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ]);

  const { data: questions, isLoading } = useAdminQuestions();
  const createMutation = useCreateQuestion();
  const deleteMutation = useDeleteQuestion();

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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText) return;

    createMutation.mutate(
      {
        subjectId,
        chapterId: "00000000-0000-0000-0000-000000000000",
        type,
        source,
        standard,
        questionText,
        explanation,
        mcqOptions: type === "mcq" ? mcqOptions : undefined,
      },
      {
        onSuccess: () => {
          setActiveTab("list");
          setQuestionText("");
          setExplanation("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            প্রশ্নব্যাংক ব্যবস্থাপনা
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            নতুন MCQ ও CQ প্রশ্ন যোগ করুন অথবা বিদ্যমান প্রশ্নব্যাংক কার্ড গ্যালারিতে দেখুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "list" ? "default" : "outline"}
            onClick={() => setActiveTab("list")}
            className="rounded-xl"
          >
            প্রশ্ন তালিকা
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="rounded-xl gap-2"
          >
            + নতুন প্রশ্ন যোগ করুন
          </Button>
        </div>
      </div>

      {activeTab === "list" ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TaskSquare className="size-5 text-primary" /> মোট প্রশ্ন (
              {questions?.length ?? 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
              প্রশ্ন লোড হচ্ছে...
            </div>
          ) : questions?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
              কোনো প্রশ্ন পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions?.map((q: Question) => (
                <Card
                  key={q.id}
                  className="shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between p-5 rounded-2xl border"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="uppercase font-bold text-[10px]"
                        >
                          {q.type}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="capitalize text-[10px] font-semibold"
                        >
                          {q.source}
                        </Badge>
                      </div>
                      <Badge className="capitalize text-[10px]">
                        {q.standard}
                      </Badge>
                    </div>

                    <p className="text-sm font-semibold text-foreground leading-relaxed">
                      {q.question_text}
                    </p>

                    {q.type === "mcq" && (q.mcq_options?.length ?? 0) > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border/50">
                        {q.mcq_options?.map((opt: MCQOption, idx: number) => (
                          <div
                            key={opt.id || idx}
                            className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
                              opt.is_correct
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20"
                                : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <span className="font-bold">{idx + 1}.</span>
                            <span className="truncate">{opt.option_text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end pt-4 mt-4 border-t border-border/40">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(q.id)}
                      className="text-destructive hover:bg-destructive/10 gap-1.5 rounded-xl text-xs"
                    >
                      <Trash2 className="size-3.5" />
                      <span>ডিলিট</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card className="shadow-sm max-w-3xl rounded-2xl">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="size-5 text-primary" /> নতুন প্রশ্ন তৈরি করুন
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>বিষয়</FieldLabel>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">পদার্থবিজ্ঞান</SelectItem>
                      <SelectItem value="chemistry">রসায়ন</SelectItem>
                      <SelectItem value="math">উচ্চতর গণিত</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>টাইপ</FieldLabel>
                  <Select
                    value={type}
                    onValueChange={(v: string) => setType(v as "mcq" | "cq")}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">MCQ (বহুনির্বাচনী)</SelectItem>
                      <SelectItem value="cq">CQ (সৃজনশীল)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>উৎস (Source)</FieldLabel>
                  <Select
                    value={source}
                    onValueChange={(v: string) =>
                      setSource(
                        v as
                          | "frostfoe"
                          | "varsity"
                          | "engineering"
                          | "board"
                          | "custom_csv_json",
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frostfoe">FrostFoe Special</SelectItem>
                      <SelectItem value="varsity">Varsity</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="board">Board</SelectItem>
                      <SelectItem value="custom_csv_json">
                        Custom CSV/JSON
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>প্রশ্নের বিবরণ (LaTeX সম্বলিত)</FieldLabel>
                <Input
                  required
                  placeholder="যেমন: দুটি সমান মানের ভেক্টরের লব্ধির মান..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="rounded-xl"
                />
              </Field>

              {type === "mcq" && (
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-muted/20 border">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    MCQ অপশনসমূহ (সঠিক উত্তরে টিক দিন)
                  </span>
                  {mcqOptions.map((opt, idx) => (
                    <div
                      key={
                        opt.optionText || opt.isCorrect ? "correct" : "option"
                      }
                      className="flex items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectSelect(idx)}
                        className="size-4 text-primary"
                      />
                      <Input
                        required
                        placeholder={`অপশন ${idx + 1}`}
                        value={opt.optionText}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        className="rounded-xl flex-1 bg-background"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Field>
                <FieldLabel>ব্যাখ্যা (Optional)</FieldLabel>
                <Input
                  placeholder="প্রশ্নের বিস্তারিত ব্যাখ্যা..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="rounded-xl"
                />
              </Field>

              <Button
                type="submit"
                size="lg"
                disabled={createMutation.isPending}
                className="w-full rounded-xl font-bold gap-2 shadow-lg mt-2"
              >
                {createMutation.isPending ? "তৈরি হচ্ছে..." : "প্রশ্ন সংরক্ষণ করুন"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
