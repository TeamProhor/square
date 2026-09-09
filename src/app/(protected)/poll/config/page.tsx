"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight2, Trophy } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
  getPollContainersAction,
  getPollItemsAction,
  getPollQuestionsAction,
  getPollSubitemsAction,
} from "@/lib/actions/poll";
import type { Container, Item, Subitem } from "@/types";

export default function PollConfigPage() {
  const router = useRouter();

  const {
    container,
    setContainer,
    item,
    setItem,
    paper,
    setPaper,
    subitem,
    setSubitem,
    standard,
    setStandard,
    questionLimit,
    setQuestionLimit,
    setActiveQuestions,
    setUserAnswers,
    setCurrentQuestionIndex,
  } = usePollStore();

  const [dbContainers, setDbContainers] = useState<Container[]>([]);
  const [dbItems, setDbSubjects] = useState<Item[]>([]);
  const [dbSubitems, setDbChapters] = useState<
    (Subitem & { questionCount?: number })[]
  >([]);

  const [loadingContainers, setLoadingContainers] = useState(true);
  const [loadingItems, setLoadingSubjects] = useState(false);
  const [loadingSubitems, setLoadingChapters] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Custom Amount State
  const [isCustomLimit, setIsCustomLimit] = useState(false);
  const [customLimitValue, setCustomLimitValue] = useState("");

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(
      /[0-9]/g,
      (digit) => bnDigits[Number(digit)] || digit,
    );
  };

  // 1. Fetch Question Bank Containers
  useEffect(() => {
    async function loadContainers() {
      setLoadingContainers(true);
      const conts = await getPollContainersAction();
      setDbContainers(conts);
      if (conts.length > 0) {
        if (!container || !conts.some((c) => c.id === container)) {
          setContainer(conts[0].id);
        }
      }
      setLoadingContainers(false);
    }
    loadContainers();
  }, [setContainer, container]);

  // 2. Fetch items (Subjects) when container changes
  useEffect(() => {
    async function loadSubjects() {
      if (!container) return;
      setLoadingSubjects(true);
      const subs = await getPollItemsAction(container);
      setDbSubjects(subs);
      if (subs.length > 0) {
        if (!item || !subs.some((s) => s.id === item)) {
          setItem(subs[0].id);
        }
      } else {
        setItem("");
      }
      setLoadingSubjects(false);
    }
    loadSubjects();
  }, [container, setItem, item]);

  // 3. Fetch subitems (Chapters/Years) when item or paper changes
  useEffect(() => {
    async function loadChapters() {
      if (!item) {
        setDbChapters([]);
        setSubitem("all");
        return;
      }
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
      : (currentSelectedSubitem?.questionCount ?? 0);

  const handleLimitToggle = (val: string) => {
    if (!val) return;
    if (val === "custom") {
      setIsCustomLimit(true);
      const parsed = parseInt(customLimitValue, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setQuestionLimit(parsed);
      }
    } else {
      setIsCustomLimit(false);
      setQuestionLimit(Number(val));
    }
  };

  const handleCustomLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomLimitValue(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setQuestionLimit(num);
    }
  };

  const handleStart = async () => {
    try {
      setIsStarting(true);

      const effectiveLimit =
        isCustomLimit && customLimitValue
          ? Math.max(1, parseInt(customLimitValue, 10))
          : questionLimit === 0
            ? 1000
            : questionLimit;

      const qbQuestions = await getPollQuestionsAction({
        itemId: item || undefined,
        subitemId: subitem,
        paper,
        standard,
        limit: effectiveLimit,
      });

      if (!qbQuestions || qbQuestions.length === 0) {
        setIsStarting(false);
        return;
      }

      setActiveQuestions(qbQuestions);
      setUserAnswers({});
      setCurrentQuestionIndex(0);

      router.push("/poll/take");
    } catch {
      setIsStarting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-1 sm:py-4">
      <div className="w-full bg-card border border-border/60 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs">
        <FieldGroup className="flex flex-col gap-4 sm:gap-6 w-full">
          {/* Row 1: Container (Question Bank) & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Question Bank Select */}
            <Field className="w-full">
              <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 sm:mb-2">
                ১. প্রশ্নব্যাংক নির্বাচন করুন
              </FieldLabel>
              <Select
                value={container}
                onValueChange={(v) => v && setContainer(v)}
              >
                <SelectTrigger className="w-full h-10 sm:h-12 bg-background border-border/80 rounded-xl text-xs sm:text-sm font-semibold">
                  <SelectValue
                    placeholder={
                      loadingContainers
                        ? "প্রশ্নব্যাংক লোড হচ্ছে..."
                        : "প্রশ্নব্যাংক সিলেক্ট করুন"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {dbContainers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {/* Subject Select */}
            <Field className="w-full">
              <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 sm:mb-2">
                ২. বিষয় নির্বাচন করুন
              </FieldLabel>
              <Select value={item} onValueChange={(v) => v && setItem(v)}>
                <SelectTrigger className="w-full h-10 sm:h-12 bg-background border-border/80 rounded-xl text-xs sm:text-sm font-semibold">
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
          </div>

          {/* Row 2: Chapter & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Chapter / Year Select */}
            <Field className="w-full">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  ৩. অধ্যায় / সাল সিলেক্ট করুন
                </FieldLabel>
                {currentChapterQuestions > 0 && (
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {toBanglaDigits(currentChapterQuestions)} টি প্রশ্ন উপলব্ধ
                  </span>
                )}
              </div>
              <Select
                value={subitem || "all"}
                onValueChange={(v) => v && setSubitem(v)}
              >
                <SelectTrigger className="w-full h-10 sm:h-12 bg-background border-border/80 rounded-xl text-xs sm:text-sm font-semibold">
                  <SelectValue
                    placeholder={
                      loadingSubitems
                        ? "অধ্যায় লোড হচ্ছে..."
                        : "অধ্যায় সিলেক্ট করুন"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="all">
                      সকল অধ্যায় / সাল ({toBanglaDigits(totalSubitemsQuestions)} টি
                      প্রশ্ন)
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

            {/* Standard Category */}
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

          {/* Row 3: Question Limit (5-10-20 or Enter Amount / সবগুলো) */}
          <Field className="w-full">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <FieldLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                ৫. প্রশ্নের সংখ্যা নির্বাচন করুন (Amount)
              </FieldLabel>
              {isCustomLimit && (
                <span className="text-[11px] font-bold text-primary">
                  কাস্টম সংখ্যা মোড চালু
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <ToggleGroup
                type="single"
                value={isCustomLimit ? "custom" : String(questionLimit)}
                onValueChange={handleLimitToggle}
                className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 h-auto"
              >
                <ToggleGroupItem
                  value="5"
                  className="h-10 sm:h-11 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs sm:text-sm font-semibold"
                >
                  ৫টি
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="10"
                  className="h-10 sm:h-11 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs sm:text-sm font-semibold"
                >
                  ১০টি
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="20"
                  className="h-10 sm:h-11 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs sm:text-sm font-semibold"
                >
                  ২০টি
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="0"
                  className="h-10 sm:h-11 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs sm:text-sm font-semibold"
                >
                  সবগুলো ({toBanglaDigits(currentChapterQuestions)})
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="custom"
                  className="h-10 sm:h-11 border border-border/80 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary text-xs sm:text-sm font-semibold"
                >
                  Enter Amount ✎
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Custom Input Field when selected */}
              {isCustomLimit && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 border border-primary/30 rounded-xl animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-foreground shrink-0">
                    প্রশ্নের সংখ্যা লিখুন:
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="যেমন: ১৫, ২৫, ৫০ ইত্যাদি"
                    value={customLimitValue}
                    onChange={handleCustomLimitChange}
                    className="h-9 rounded-lg bg-background text-xs font-bold max-w-[200px]"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    (সর্বোচ্চ {toBanglaDigits(currentChapterQuestions)} টি)
                  </span>
                </div>
              )}
            </div>
          </Field>

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
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold rounded-xl shadow-xs cursor-pointer"
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
