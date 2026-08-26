"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight2, Trophy } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePollStore } from "@/hooks/usePollStore";
import {
  getPollItemsAction,
  getPollQuestionsAction,
  getPollSubitemsAction,
} from "@/lib/actions/poll";
import type { Item, Subitem } from "@/types";

export default function PollConfigPage() {
  const router = useRouter();

  const {
    item,
    setItem,
    paper,
    setPaper,
    subitem,
    setSubitem,
    standard,
    setStandard,
    setActiveQuestions,
    setUserAnswers,
    setCurrentQuestionIndex,
  } = usePollStore();

  const [dbItems, setDbSubjects] = useState<Item[]>([]);
  const [dbSubitems, setDbChapters] = useState<(Subitem & { questionCount?: number })[]>([]);
  const [loadingItems, setLoadingSubjects] = useState(true);
  const [loadingSubitems, setLoadingChapters] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [_availableCount, _setAvailableCount] = useState<number | null>(null);

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(
      /[0-9]/g,
      (digit) => bnDigits[Number(digit)] || digit,
    );
  };

  // Fetch items from Question Bank DB
  useEffect(() => {
    async function loadSubjects() {
      setLoadingSubjects(true);
      const subs = await getPollItemsAction();
      setDbSubjects(subs);
      if (subs.length > 0 && (!item || !subs.some((s) => s.id === item))) {
        setItem(subs[0].id);
      }
      setLoadingSubjects(false);
    }
    loadSubjects();
  }, [setItem, item]);

  // Fetch subitems when item or paper changes
  useEffect(() => {
    async function loadChapters() {
      if (!item) return;
      setLoadingChapters(true);
      const chs = await getPollSubitemsAction(item, paper);
      setDbChapters(chs);
      if (chs.length > 0) {
        setSubitem(chs[0].id);
      } else {
        setSubitem("all");
      }
      setLoadingChapters(false);
    }
    loadChapters();
  }, [item, paper, setSubitem]);

  // Calculate total questions for selected filters
  const totalSubitemsQuestions = dbSubitems.reduce(
    (acc, curr) => acc + (curr.questionCount || 0),
    0,
  );

  const currentSelectedSubitem = dbSubitems.find((c) => c.id === subitem);
  const currentChapterQuestions =
    subitem === "all"
      ? totalSubitemsQuestions
      : currentSelectedSubitem?.questionCount ?? 0;

  const handleStart = async () => {
    setIsStarting(true);

    const qbQuestions = await getPollQuestionsAction({
      itemId: item,
      subitemId: subitem,
      paper,
      standard,
      limit: 20,
    });

    setActiveQuestions(qbQuestions);
    setUserAnswers({});
    setCurrentQuestionIndex(0);

    router.push("/poll/take");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-1 sm:py-4">
      <div className="w-full bg-card border border-border/60 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs">
        <FieldGroup className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Item Select */}
            <Field className="w-full">
              <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 sm:mb-2">
                ১. বিষয় নির্বাচন করুন
              </FieldLabel>
              <Select value={item} onValueChange={(v) => v && setItem(v)}>
                <SelectTrigger className="w-full h-10 sm:h-12 bg-background border-border/80 rounded-xl text-xs sm:text-sm">
                  <SelectValue
                    placeholder={
                      loadingItems ? "বিষয় লোড হচ্ছে..." : "বিষয় সিলেক্ট করুন"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {dbItems.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {/* Paper Select */}
            <Field className="w-full">
              <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 sm:mb-2">
                ২. পত্র
              </FieldLabel>
              <Select value={paper} onValueChange={(v) => v && setPaper(v)}>
                <SelectTrigger className="w-full h-10 sm:h-12 bg-background border-border/80 rounded-xl text-xs sm:text-sm">
                  <SelectValue placeholder="পত্র সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="1st">১ম পত্র</SelectItem>
                    <SelectItem value="2nd">২য় পত্র</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Subitem Select */}
            <Field className="w-full">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  ৩. অধ্যায় সিলেক্ট করুন
                </FieldLabel>
                {currentChapterQuestions > 0 && (
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {toBanglaDigits(currentChapterQuestions)} টি প্রশ্ন উপলব্ধ
                  </span>
                )}
              </div>
              <Select value={subitem} onValueChange={(v) => v && setSubitem(v)}>
                <SelectTrigger className="w-full h-10 sm:h-12 bg-background border-border/80 rounded-xl text-xs sm:text-sm">
                  <SelectValue
                    placeholder={
                      loadingSubitems ? "অধ্যায় লোড হচ্ছে..." : "অধ্যায় সিলেক্ট করুন"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="all">
                      সকল অধ্যায় ({toBanglaDigits(totalSubitemsQuestions)} টি প্রশ্ন)
                    </SelectItem>
                    {dbSubitems.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        {ch.name} ({toBanglaDigits(ch.questionCount || 0)} টি)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {/* Standard Select */}
            <Field className="w-full">
              <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 sm:mb-2">
                ৪. পরীক্ষার ক্যাটাগরি
              </FieldLabel>
              <ToggleGroup
                type="single"
                value={standard}
                onValueChange={(v) => v && setStandard(v)}
                className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 h-auto"
              >
                <ToggleGroupItem
                  value="board"
                  className="h-10 sm:h-12 flex flex-row items-center justify-center gap-2 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs font-semibold"
                >
                  <Trophy className="size-3.5 sm:size-4" /> বোর্ড
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="varsity"
                  className="h-10 sm:h-12 flex flex-row items-center justify-center gap-2 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs font-semibold"
                >
                  <Trophy className="size-3.5 sm:size-4" /> এডমিশন
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
          </div>

          {/* Question availability info card */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 bg-muted/40 rounded-xl border border-border/60 text-xs sm:text-sm">
            <span className="text-muted-foreground font-medium">
              সার্ভারে মোট প্রশ্ন সংখ্যা:
            </span>
            <span className="font-extrabold text-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {toBanglaDigits(currentChapterQuestions)} টি প্রশ্ন সংরক্ষিত
            </span>
          </div>

          <div className="pt-2 sm:pt-4 w-full">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isStarting || currentChapterQuestions === 0}
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold rounded-xl shadow-xs"
            >
              {isStarting ? (
                <>
                  <Spinner className="mr-2" /> প্রশ্নব্যাংক থেকে লোড হচ্ছে...
                </>
              ) : (
                <>
                  পোল শুরু করুন <ArrowRight2 data-icon="inline-end" />
                </>
              )}
            </Button>
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}
