"use client";

import { useState } from "react";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question, Topic } from "@/types";

interface ChapterQuestionsViewerProps {
  readonly topics: Topic[];
  readonly questions: Question[];
}

const ITEMS_PER_PAGE = 10;

export function ChapterQuestionsViewer({
  topics,
  questions,
}: ChapterQuestionsViewerProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const hasMcq = questions.some((q) => q.type === "mcq");
  const [selectedType, setSelectedType] = useState<string | null>(
    hasMcq ? "mcq" : null,
  );
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const availableTypes = Array.from(
    new Set(questions.map((q) => q.type)),
  ).filter(Boolean) as string[];

  const filteredQuestions = questions.filter((q) => {
    if (selectedTopicId && q.topic_id !== selectedTopicId) return false;
    if (selectedType && q.type !== selectedType) return false;
    if (selectedStandard) {
      const src = q.source?.toLowerCase() || "";
      const std = q.standard?.toLowerCase() || "";
      const isBoard =
        src.includes("বোর্ড") || src.includes("board") || std.includes("hsc");
      const isAdmission =
        src.includes("ভর্তি") ||
        src.includes("admission") ||
        src.includes("বুয়েট") ||
        src.includes("ঢাবি") ||
        src.includes("মেডিকেল");

      if (selectedStandard === "board" && !isBoard) return false;
      if (selectedStandard === "admission" && !isAdmission) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (userAnswers[questionId]) return;
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
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full">
        {topics.length > 0 && (
          <div className="col-span-2 sm:col-auto sm:flex-1 sm:min-w-[200px]">
            <Select
              value={selectedTopicId ?? "all"}
              onValueChange={(val) => {
                setSelectedTopicId(val === "all" ? null : val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 sm:h-9 w-full rounded-xl bg-card border-border/70 text-xs sm:text-sm font-medium">
                <SelectValue placeholder="সকল টপিক" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="all">
                    সকল টপিক ({questions.length})
                  </SelectItem>
                  {topics.map((topic) => {
                    const count = questions.filter(
                      (q) => q.topic_id === topic.id,
                    ).length;
                    return (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name} {count > 0 ? `(${count})` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {availableTypes.length > 1 && (
          <div className="flex-1 min-w-0">
            <Select
              value={selectedType ?? "all"}
              onValueChange={(val) => {
                setSelectedType(val === "all" ? null : val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 sm:h-9 w-full rounded-xl bg-card border-border/70 text-xs sm:text-sm font-medium uppercase">
                <SelectValue placeholder="সকল ধরন" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="all">সকল ধরন</SelectItem>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type} className="uppercase">
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Select
            value={selectedStandard ?? "all"}
            onValueChange={(val) => {
              setSelectedStandard(val === "all" ? null : val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 sm:h-9 w-full rounded-xl bg-card border-border/70 text-xs sm:text-sm font-medium">
              <SelectValue placeholder="সকল ক্যাটাগরি" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">সকল ক্যাটাগরি</SelectItem>
                <SelectItem value="board">বোর্ড স্ট্যান্ডার্ড</SelectItem>
                <SelectItem value="admission">ভর্তি পরীক্ষা</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 sm:gap-5 mt-1">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground text-sm font-medium">
              এই ফিল্টারের জন্য কোনো প্রশ্ন পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedQuestions.map((q: Question, idx: number) => (
              <UniversalQuestionCard
                key={q.id}
                question={q}
                questionIndex={startIndex + idx}
                selectedOptionId={userAnswers[q.id]}
                isSolutionOpen={Boolean(revealedSolutions[q.id])}
                onSelectOption={handleSelectOption}
                onToggleSolution={toggleSolution}
              />
            ))}

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
    </div>
  );
}
