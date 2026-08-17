"use client";

import Link from "next/link";
import { useState } from "react";
import { EditQuestionForm } from "@/components/admin/forms/edit-question-form";
import { ImportQuestionsForm } from "@/components/admin/forms/import-questions-form";
import { NewQuestionForm } from "@/components/admin/forms/new-question-form";
import {
  ArrowRight2,
  Edit,
  FileDown,
  TaskSquare,
  Trash2,
} from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAdminQuestions, useDeleteQuestion } from "@/hooks/use-admin-qb";
import type { Question } from "@/types";

interface AdminQuestionsManagerProps {
  readonly qbSlug: string;
  readonly subjectSlug: string;
  readonly subjectId: string;
  readonly chapterId: string;
  readonly topicId?: string;
  readonly topicName: string;
  readonly chapterSlug: string;
}

const ITEMS_PER_PAGE = 10;

export function AdminQuestionsManager({
  qbSlug,
  subjectSlug,
  subjectId,
  chapterId,
  topicId,
  topicName,
  chapterSlug,
}: AdminQuestionsManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedSolutions, setRevealedSolutions] = useState<
    Record<string, boolean>
  >({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const { data: questions, isLoading } = useAdminQuestions({ subjectId });
  const deleteMutation = useDeleteQuestion();

  const totalQuestions = questions?.length ?? 0;
  const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE);

  // Keep currentPage in valid range if list changes
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions =
    questions?.slice(startIndex, startIndex + ITEMS_PER_PAGE) ?? [];

  const handleDelete = (questionId: string) => {
    if (confirm("এই প্রশ্নটি স্থায়ীভাবে ডিলিট করতে চান?")) {
      deleteMutation.mutate(questionId);
    }
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
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground flex-wrap">
        <Link
          href="/admin/qb"
          className="hover:text-foreground transition-colors"
        >
          প্রশ্নব্যাংকসমূহ
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qbSlug}`}
          className="hover:text-foreground transition-colors"
        >
          প্রশ্নব্যাংক
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qbSlug}/${subjectSlug}`}
          className="hover:text-foreground transition-colors"
        >
          বিষয়
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qbSlug}/${subjectSlug}/${chapterSlug}`}
          className="hover:text-foreground transition-colors"
        >
          অধ্যায়
        </Link>
        <ArrowRight2 className="size-3" />
        <span className="text-foreground font-semibold">{topicName}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {topicName} - প্রশ্ন তালিকা
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            এই টপিকের জন্য নতুন MCQ/CQ প্রশ্ন যোগ করুন, এডিট করুন বা বিদ্যমান প্রশ্ন ডিলিট
            করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            className="rounded-xl gap-2 font-bold hover:border-primary/50"
          >
            <FileDown className="size-4 text-primary" />
            <span>JSON থেকে ইমপোর্ট</span>
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl gap-2 font-bold"
          >
            + নতুন প্রশ্ন যোগ করুন
          </Button>
        </div>
      </div>

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
          <div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
            প্রশ্ন লোড হচ্ছে...
          </div>
        ) : totalQuestions === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl">
            এই টপিকে কোনো প্রশ্ন পাওয়া যায়নি।
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(q.id)}
                        className="text-destructive hover:bg-destructive/10 gap-1.5 rounded-xl text-xs"
                      >
                        <Trash2 className="size-3.5" />
                        <span>ডিলিট</span>
                      </Button>
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

      {/* Import Questions Dialog */}
      <ResponsiveDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        title="JSON থেকে প্রশ্ন ইমপোর্ট করুন"
        description="নমুনা ফরম্যাট কপি করে অথবা .json ফাইল আপলোড/পেস্ট করে এক ক্লিকে প্রশ্নসমূহ যুক্ত করুন।"
        className="sm:max-w-2xl"
      >
        <ImportQuestionsForm
          chapterId={chapterId}
          topicId={topicId}
          topicName={topicName}
          onSuccess={() => setIsImportOpen(false)}
          onCancel={() => setIsImportOpen(false)}
        />
      </ResponsiveDialog>

      {/* New Question Dialog */}
      <ResponsiveDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={`${topicName} এ নতুন প্রশ্ন`}
        description="প্রশ্নের ধরন, বিবরণ ও উত্তর লিখুন।"
        className="sm:max-w-2xl"
      >
        <NewQuestionForm
          subjectId={subjectId}
          chapterId={chapterId}
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </ResponsiveDialog>

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
