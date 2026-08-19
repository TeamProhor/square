"use client";

import { useState } from "react";
import { EditQuestionForm } from "@/components/admin/forms/edit-question-form";
import { Edit, Star, TaskSquare, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  useAdminQuestions,
  useCreateQuestion,
  useDeleteQuestion,
} from "@/hooks/use-admin-qb";
import type { Question } from "@/types";

const ITEMS_PER_PAGE = 10;

export function AdminQbManager() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedSolutions, setRevealedSolutions] = useState<
    Record<string, boolean>
  >({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const [subjectId, setSubjectId] = useState("physics");
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

  const { data: questions, isLoading } = useAdminQuestions();
  const createMutation = useCreateQuestion();
  const deleteMutation = useDeleteQuestion();

  const totalQuestions = questions?.length ?? 0;
  const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions =
    questions?.slice(startIndex, startIndex + ITEMS_PER_PAGE) ?? [];

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

  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleSolution = (questionId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getPageNumbers = (): (number | { key: string })[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, { key: "ellipsis-end" }, totalPages];
    }
    if (safeCurrentPage >= totalPages - 2) {
      return [
        1,
        { key: "ellipsis-start" },
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      { key: "ellipsis-start" },
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      { key: "ellipsis-end" },
      totalPages,
    ];
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
              {totalQuestions})
            </h2>
            {totalPages > 1 && (
              <span className="text-xs font-medium text-muted-foreground">
                পৃষ্ঠা {safeCurrentPage} / {totalPages} (প্রতি পৃষ্ঠায় {ITEMS_PER_PAGE}
                টি)
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-card border rounded-2xl">
              <Spinner className="size-6 text-primary" />
              <span>প্রশ্ন লোড হচ্ছে...</span>
            </div>
          ) : totalQuestions === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
              কোনো প্রশ্ন পাওয়া যায়নি।
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedQuestions.map((q: Question, idx: number) => (
                  <UniversalQuestionCard
                    key={q.id}
                    question={q}
                    questionIndex={startIndex + idx}
                    selectedOptionId={userAnswers[q.id]}
                    isSolutionOpen={Boolean(revealedSolutions[q.id])}
                    onSelectOption={handleSelectOption}
                    onToggleSolution={toggleSolution}
                    footerActions={
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(q)}
                          className="text-primary hover:bg-primary/10 gap-1.5 rounded-xl text-xs"
                        >
                          <Edit className="size-3.5" />
                          <span>এডিট</span>
                        </Button>
                        <DeleteConfirmDialog
                          title="প্রশ্ন ডিলিট নিশ্চিতকরণ"
                          description="আপনি কি নিশ্চিতভাবে এই প্রশ্নটি ডিলিট করতে চান? এই প্রশ্নটি স্থায়ীভাবে মুছে যাবে।"
                          onConfirm={() => deleteMutation.mutate(q.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 gap-1.5 rounded-xl text-xs cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>ডিলিট</span>
                            </Button>
                          }
                        />
                      </div>
                    }
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          text="পূর্ববর্তী"
                          onClick={(e) => {
                            e.preventDefault();
                            if (safeCurrentPage > 1) {
                              setCurrentPage(safeCurrentPage - 1);
                            }
                          }}
                          className={
                            safeCurrentPage <= 1
                              ? "pointer-events-none opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((item) => {
                        if (typeof item === "object") {
                          return (
                            <PaginationItem key={item.key}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        const page = item;
                        const isActive = page === safeCurrentPage;

                        return (
                          <PaginationItem key={`page-${page}`}>
                            <PaginationLink
                              isActive={isActive}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          text="পরবর্তী"
                          onClick={(e) => {
                            e.preventDefault();
                            if (safeCurrentPage < totalPages) {
                              setCurrentPage(safeCurrentPage + 1);
                            }
                          }}
                          className={
                            safeCurrentPage >= totalPages
                              ? "pointer-events-none opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
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
                  <Input
                    placeholder="যেমন: কুমিল্লা বোর্ড ২০২৩, ঢাকা বোর্ড ২০২২..."
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    list="qb-source-suggestions"
                    className="rounded-xl"
                  />
                  <datalist id="qb-source-suggestions">
                    <option value="ঢাকা বোর্ড ২০২৩" />
                    <option value="কুমিল্লা বোর্ড ২০২৩" />
                    <option value="চট্টগ্রাম বোর্ড ২০২৩" />
                    <option value="রাজশাহী বোর্ড ২০২৩" />
                    <option value="যশোর বোর্ড ২০২৩" />
                    <option value="সিলেট বোর্ড ২০২৩" />
                    <option value="বরিশাল বোর্ড ২০২৩" />
                    <option value="দিনাজপুর বোর্ড ২০২৩" />
                    <option value="ময়মনসিংহ বোর্ড ২০২৩" />
                    <option value="Board" />
                    <option value="Varsity" />
                    <option value="Engineering" />
                    <option value="Medical" />
                    <option value="Custom" />
                  </datalist>
                </Field>

                <Field>
                  <FieldLabel>মান / স্তর (Standard)</FieldLabel>
                  <Select
                    value={standard}
                    onValueChange={(v: string) => setStandard(v || "HSC")}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HSC">HSC</SelectItem>
                      <SelectItem value="Varsity">Varsity</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
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
                {createMutation.isPending ? (
                  <>
                    <Spinner className="size-4 mr-2" /> তৈরি হচ্ছে...
                  </>
                ) : (
                  "প্রশ্ন সংরক্ষণ করুন"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Question Dialog */}
      <ResponsiveDialog
        open={Boolean(editingQuestion)}
        onOpenChange={(open) => {
          if (!open) setEditingQuestion(null);
        }}
        title="প্রশ্ন এডিট করুন"
        description="প্রশ্নের ধরন, বিবরণ, অপশন বা উত্তর সংশোধন করুন।"
        className="sm:max-w-2xl"
      >
        {editingQuestion && (
          <EditQuestionForm
            question={editingQuestion}
            onSuccess={() => setEditingQuestion(null)}
            onCancel={() => setEditingQuestion(null)}
          />
        )}
      </ResponsiveDialog>
    </div>
  );
}
