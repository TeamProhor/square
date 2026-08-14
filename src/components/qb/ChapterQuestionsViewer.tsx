"use client";

import { useState } from "react";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
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

const _OPTION_KEYS = ["ক", "খ", "গ", "ঘ", "ঙ"];

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

  const _availableStandards = Array.from(
    new Set(
      questions.map((q) => {
        const src = q.source?.toLowerCase() || "";
        const std = q.standard?.toLowerCase() || "";
        if (
          src.includes("বোর্ড") ||
          src.includes("board") ||
          std.includes("hsc")
        ) {
          return "board";
        }
        if (
          src.includes("ভর্তি") ||
          src.includes("admission") ||
          src.includes("বুয়েট") ||
          src.includes("ঢাবি") ||
          src.includes("মেডিকেল")
        ) {
          return "admission";
        }
        return "other";
      }),
    ),
  ).filter(Boolean) as string[];

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

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full">
        {topics.length > 0 && (
          <div className="col-span-2 sm:col-auto sm:flex-1 sm:min-w-[200px]">
            <Select
              value={selectedTopicId ?? "all"}
              onValueChange={(val) =>
                setSelectedTopicId(val === "all" ? null : val)
              }
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
              onValueChange={(val) =>
                setSelectedType(val === "all" ? null : val)
              }
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
            onValueChange={(val) =>
              setSelectedStandard(val === "all" ? null : val)
            }
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
          filteredQuestions.map((q: Question, idx: number) => (
            <UniversalQuestionCard
              key={q.id}
              question={q}
              questionIndex={idx}
              selectedOptionId={userAnswers[q.id]}
              isSolutionOpen={Boolean(revealedSolutions[q.id])}
              onSelectOption={handleSelectOption}
              onToggleSolution={toggleSolution}
            />
          ))
        )}
      </div>
    </div>
  );
}
