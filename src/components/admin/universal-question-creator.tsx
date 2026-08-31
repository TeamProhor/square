"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  Add,
  ArrowLeft2,
  BookOpen,
  Eye,
  Flash,
  Lightbulb,
  Lock,
  Search,
  TaskSquare,
  TickCircle,
  Trash2,
} from "@/components/icons";
import { UniversalQuestionCard } from "@/components/shared/UniversalQuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { deleteQuestionAction, importQuestionsAction } from "@/lib/actions/question";
import {
  createQuickQuestionAction,
  type HierarchyContainer,
} from "@/lib/actions/universal-qb";
import type { Question } from "@/types";

interface UniversalQuestionCreatorProps {
  readonly hierarchy: HierarchyContainer[];
  readonly initialRecentQuestions?: any[];
}

export function UniversalQuestionCreator({
  hierarchy = [],
  initialRecentQuestions = [],
}: UniversalQuestionCreatorProps) {
  const queryClient = useQueryClient();

  // Hierarchy Selection States
  const [selectedContainerId, setSelectedContainerId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  // Question Form States
  const [type, setType] = useState<"mcq" | "cq">("mcq");
  const [standard, setStandard] = useState("HSC");
  const [source, setSource] = useState("ঢাকা বোর্ড ২০২৩");
  const [isFree, setIsFree] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");

  // MCQ Options
  const [mcqOptions, setMcqOptions] = useState([
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ]);

  // CQ Parts
  const [cqParts, setCqParts] = useState([
    { partKey: "a", questionText: "", answerText: "", marks: 1 },
    { partKey: "b", questionText: "", answerText: "", marks: 2 },
    { partKey: "c", questionText: "", answerText: "", marks: 3 },
    { partKey: "d", questionText: "", answerText: "", marks: 4 },
  ]);

  // UI States
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recentList, setRecentList] = useState<any[]>(initialRecentQuestions);

  // Bulk Import State
  const [bulkJson, setBulkJson] = useState("");
  const [bulkImportStatus, setBulkImportStatus] = useState<string | null>(null);

  // Auto-select first container & subject & chapter if available
  useEffect(() => {
    if (hierarchy.length > 0 && !selectedContainerId) {
      const firstCont = hierarchy[0];
      setSelectedContainerId(firstCont.id);

      if (firstCont.subjects?.length > 0) {
        const firstSubj = firstCont.subjects[0];
        setSelectedSubjectId(firstSubj.id);

        if (firstSubj.chapters?.length > 0) {
          setSelectedChapterId(firstSubj.chapters[0].id);
        }
      }
    }
  }, [hierarchy, selectedContainerId]);

  // Filtered dropdown lists
  const currentContainer = hierarchy.find((c) => c.id === selectedContainerId);
  const availableSubjects = currentContainer?.subjects || [];
  const currentSubject = availableSubjects.find((s) => s.id === selectedSubjectId);
  const availableChapters = currentSubject?.chapters || [];
  const currentChapter = availableChapters.find((ch) => ch.id === selectedChapterId);
  const availableTopics = currentChapter?.topics || [];

  const handleContainerChange = (cid: string) => {
    setSelectedContainerId(cid);
    const cont = hierarchy.find((c) => c.id === cid);
    if (cont?.subjects?.length) {
      const firstSubj = cont.subjects[0];
      setSelectedSubjectId(firstSubj.id);
      if (firstSubj.chapters?.length) {
        setSelectedChapterId(firstSubj.chapters[0].id);
      } else {
        setSelectedChapterId("");
      }
    } else {
      setSelectedSubjectId("");
      setSelectedChapterId("");
    }
    setSelectedTopicId("");
  };

  const handleSubjectChange = (sid: string) => {
    setSelectedSubjectId(sid);
    const subj = availableSubjects.find((s) => s.id === sid);
    if (subj?.chapters?.length) {
      setSelectedChapterId(subj.chapters[0].id);
    } else {
      setSelectedChapterId("");
    }
    setSelectedTopicId("");
  };

  const handleOptionChange = (idx: number, text: string) => {
    const updated = [...mcqOptions];
    updated[idx].optionText = text;
    setMcqOptions(updated);
  };

  const handleCorrectSelect = (correctIdx: number) => {
    const updated = mcqOptions.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === correctIdx,
    }));
    setMcqOptions(updated);
  };

  const handleAddOption = () => {
    if (mcqOptions.length < 6) {
      setMcqOptions([...mcqOptions, { optionText: "", isCorrect: false }]);
    }
  };

  const handleRemoveOption = (idx: number) => {
    if (mcqOptions.length > 2) {
      const updated = mcqOptions.filter((_, i) => i !== idx);
      if (!updated.some((o) => o.isCorrect)) {
        updated[0].isCorrect = true;
      }
      setMcqOptions(updated);
    }
  };

  const resetQuestionInputs = () => {
    setQuestionText("");
    setExplanation("");
    setMcqOptions([
      { optionText: "", isCorrect: true },
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
    ]);
    setCqParts([
      { partKey: "a", questionText: "", answerText: "", marks: 1 },
      { partKey: "b", questionText: "", answerText: "", marks: 2 },
      { partKey: "c", questionText: "", answerText: "", marks: 3 },
      { partKey: "d", questionText: "", answerText: "", marks: 4 },
    ]);
    setFormError(null);
  };

  const createMutation = useMutation({
    mutationFn: async (andAddAnother: boolean) => {
      if (!selectedChapterId) {
        throw new Error("অনুগ্রহ করে একটি অধ্যায় নির্বাচন করুন।");
      }
      if (!questionText.trim()) {
        throw new Error("প্রশ্নের বিবরণ আবশ্যক।");
      }

      if (type === "mcq") {
        const hasValidOptions = mcqOptions.some((o) => o.optionText.trim().length > 0);
        if (!hasValidOptions) {
          throw new Error("কমপক্ষে ২টি অপশনের লেখা পূরণ করুন।");
        }
      }

      const res = await createQuickQuestionAction({
        chapterId: selectedChapterId,
        subjectId: selectedSubjectId,
        type,
        standard,
        source,
        isFree,
        questionText: questionText.trim(),
        explanation: explanation.trim(),
        mcqOptions: type === "mcq" ? mcqOptions : undefined,
        cqParts: type === "cq" ? cqParts : undefined,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to create question");
      }

      return { ...res, andAddAnother };
    },
    onSuccess: (data) => {
      setSuccessMsg("✓ প্রশ্নটি সফলভাবে ডাটাবেজে যুক্ত হয়েছে!");
      setTimeout(() => setSuccessMsg(null), 3500);

      // Prepend to live recent list
      setRecentList((prev) => [
        {
          id: data.questionId,
          type,
          source,
          standard,
          questionText,
          explanation,
          isFree,
          chapterName: currentChapter?.name || "অধ্যায়",
          subjectName: currentSubject?.name || "বিষয়",
          containerTitle: currentContainer?.title || "প্রশ্নব্যাংক",
          mcqOptions: type === "mcq" ? mcqOptions : [],
          cqParts: type === "cq" ? cqParts : [],
          createdAt: new Date(),
        },
        ...prev,
      ]);

      resetQuestionInputs();
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "একটি ত্রুটি ঘটেছে");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteQuestionAction(id);
      if (res.error) throw new Error(res.error);
      return id;
    },
    onSuccess: (deletedId) => {
      setRecentList((prev) => prev.filter((q) => q.id !== deletedId));
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });

  const handleBulkImport = async () => {
    if (!selectedChapterId) {
      setBulkImportStatus("অনুগ্রহ করে আগে অধ্যায় নির্বাচন করুন।");
      return;
    }
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setBulkImportStatus("JSON একটি অ্যারে (Array) হতে হবে।");
        return;
      }

      const res = await importQuestionsAction(
        selectedChapterId,
        parsed,
        selectedTopicId || undefined,
      );
      if (res.error) throw new Error(res.error);

      setBulkImportStatus(`✓ সফলভাবে ${parsed.length} টি প্রশ্ন ইমপোর্ট হয়েছে!`);
      setBulkJson("");
    } catch (e: unknown) {
      setBulkImportStatus(e instanceof Error ? e.message : "ভুল JSON ফরম্যাট");
    }
  };

  const previewQuestionObj: Question = {
    id: "preview-temp",
    type,
    source,
    standard,
    questionText,
    explanation,
    isFree,
    mcqOptions: mcqOptions.map((o, idx) => ({
      id: `opt-${idx}`,
      optionText: o.optionText || `অপশন ${idx + 1}`,
      isCorrect: o.isCorrect,
    })),
    cqParts: cqParts.map((p) => ({
      id: `part-${p.partKey}`,
      partKey: p.partKey as any,
      questionText: p.questionText || `অংশ ${p.partKey}`,
      marks: p.marks,
    })),
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-16 pt-2 md:py-8 gap-8">
      {/* ─── Top Header & Back Link ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/qb"
              className="inline-flex items-center justify-center size-8 rounded-xl border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="প্রশ্নব্যাংক ম্যানেজারে ফিরুন"
            >
              <ArrowLeft2 className="size-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <TaskSquare className="size-6 text-primary shrink-0" />
              প্রশ্ন আপলোড ও ইউনিভার্সাল বিল্ডার
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground pl-10 sm:pl-10">
            একই পেজে প্রশ্নব্যাংক, বিষয় ও অধ্যায় সিলেক্ট করে সরাসরি দ্রুত প্রশ্ন আপলোড করুন।
          </p>
        </div>

        <Link href="/admin/qb">
          <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5">
            প্রশ্নব্যাংক তালিকা &rarr;
          </Button>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold flex items-center gap-2 shadow-xs">
          <TickCircle className="size-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {formError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
          {formError}
        </div>
      )}

      {/* ─── Main Unified Editor Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: Form Controls (Col Span 7) ================= */}
        <div className="lg:col-span-7 space-y-6">
          <Tabs defaultValue="single" className="w-full space-y-5">
            <TabsList className="grid grid-cols-2 w-full max-w-sm rounded-xl p-1 bg-muted/60">
              <TabsTrigger value="single" className="rounded-lg text-xs font-bold py-2">
                ✍️ সিঙ্গেল প্রশ্ন তৈরি
              </TabsTrigger>
              <TabsTrigger value="bulk" className="rounded-lg text-xs font-bold py-2">
                📦 বাল্ক JSON ইমপোর্ট
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Single Question Creator */}
            <TabsContent value="single" className="space-y-6 focus-visible:outline-none">
              {/* STEP 1: CASCADING LOCATION SELECTOR */}
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <span className="size-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                    ১
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    লোকেশন নির্বাচন (প্রশ্নব্যাংক, বিষয় ও অধ্যায়)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Container / QB Select */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      📂 প্রশ্নব্যাংক ক্যাটাগরি *
                    </Label>
                    <NativeSelect
                      value={selectedContainerId}
                      onChange={(e) => handleContainerChange(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold"
                    >
                      {hierarchy.map((c) => (
                        <NativeSelectOption key={c.id} value={c.id}>
                          {c.title} {c.isPublic ? "(ফ্রি ও উন্মুক্ত)" : ""}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  {/* Subject Select */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      📚 বিষয় (Subject) *
                    </Label>
                    <NativeSelect
                      value={selectedSubjectId}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold"
                    >
                      {availableSubjects.map((s) => (
                        <NativeSelectOption key={s.id} value={s.id}>
                          {s.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  {/* Chapter Select */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      📖 অধ্যায় (Chapter) *
                    </Label>
                    <NativeSelect
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold"
                    >
                      {availableChapters.map((ch) => (
                        <NativeSelectOption key={ch.id} value={ch.id}>
                          {ch.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  {/* Topic Select (Optional) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      🔖 টপিক (ঐচ্ছিক)
                    </Label>
                    <NativeSelect
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="w-full rounded-xl text-xs"
                    >
                      <NativeSelectOption value="">কোনো টপিক নেই (সাধারণ)</NativeSelectOption>
                      {availableTopics.map((tp) => (
                        <NativeSelectOption key={tp.id} value={tp.id}>
                          {tp.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                </div>
              </div>

              {/* STEP 2: QUESTION META & STANDARD */}
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <span className="size-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                    ২
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    প্রশ্নের ধরন ও উৎস সেটিংস
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Type */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">টাইপ *</Label>
                    <NativeSelect
                      value={type}
                      onChange={(e) => setType(e.target.value as "mcq" | "cq")}
                      className="w-full rounded-xl text-xs font-bold"
                    >
                      <NativeSelectOption value="mcq">MCQ (বহুনির্বাচনী)</NativeSelectOption>
                      <NativeSelectOption value="cq">CQ (সৃজনশীল)</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  {/* Standard */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">মান / স্তর (Standard) *</Label>
                    <NativeSelect
                      value={standard}
                      onChange={(e) => setStandard(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold"
                    >
                      <NativeSelectOption value="HSC">HSC (বোর্ড)</NativeSelectOption>
                      <NativeSelectOption value="Varsity">Varsity (ভার্সিটি)</NativeSelectOption>
                      <NativeSelectOption value="Engineering">Engineering (ইঞ্জিনিয়ারিং)</NativeSelectOption>
                      <NativeSelectOption value="Medical">Medical (মেডিকেল)</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  {/* Source */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">উৎস (Source)</Label>
                    <Input
                      placeholder="যেমন: ঢাকা বোর্ড ২০২৩..."
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      list="unified-source-suggestions"
                      className="rounded-xl text-xs"
                    />
                    <datalist id="unified-source-suggestions">
                      <option value="ঢাকা বোর্ড ২০২৩" />
                      <option value="কুমিল্লা বোর্ড ২০২৩" />
                      <option value="চট্টগ্রাম বোর্ড ২০২৩" />
                      <option value="রাজশাহী বোর্ড ২০২৩" />
                      <option value="যশোর বোর্ড ২০২৩" />
                      <option value="বুয়েট ২২-২৩" />
                      <option value="কুয়েট ২২-২৩" />
                      <option value="ঢাবি ২২-২৩" />
                      <option value="মেডিকেল ২২-২৩" />
                      <option value="Custom" />
                    </datalist>
                  </div>
                </div>

                {/* Free Question Checkbox */}
                <div className="flex items-center gap-2.5 p-3.5 bg-muted/40 rounded-2xl border border-border/70">
                  <input
                    type="checkbox"
                    id="universal-is-free"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="size-4.5 rounded accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="universal-is-free"
                    className="text-xs font-bold text-foreground cursor-pointer select-none"
                  >
                    🌐 সবার জন্য উন্মুক্ত / ফ্রি প্রশ্ন (লগইন থাকুক বা না থাকুক যেকোনো শিক্ষার্থী অনুশীলন করতে পারবে)
                  </label>
                </div>
              </div>

              {/* STEP 3: QUESTION STEM & ANSWERS */}
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                      ৩
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      প্রশ্নের মূল টেক্সট ও অপশনসমূহ
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground">
                    LaTeX Support: $...$ বা $$...$$
                  </span>
                </div>

                {/* Question Stem Textarea */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">প্রশ্নের বিবরণ (Question Stem) *</Label>
                  <Textarea
                    placeholder="প্রশ্ন লিখুন... (ম্যাথের সূত্রের জন্য LaTeX যেমন $F = ma$ ব্যবহার করুন)"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={4}
                    className="rounded-2xl text-xs sm:text-sm font-sans"
                    required
                  />
                </div>

                {/* MCQ Options Block */}
                {type === "mcq" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold">
                        অপশনসমূহ (সঠিক উত্তরের পাশে গোল বাটন সিলেক্ট করুন)
                      </Label>
                      {mcqOptions.length < 6 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleAddOption}
                          className="h-7 text-xs font-bold text-primary gap-1"
                        >
                          <Add className="size-3.5" /> + অপশন বাড়ান
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {mcqOptions.map((opt, idx) => {
                        const banglaLetters = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"];
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all ${
                              opt.isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/40"
                                : "bg-card border-border/70"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleCorrectSelect(idx)}
                              className={`size-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                opt.isCorrect
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-muted text-muted-foreground hover:bg-accent"
                              }`}
                              title={opt.isCorrect ? "সঠিক উত্তর" : "সঠিক হিসেবে মার্ক করুন"}
                            >
                              {banglaLetters[idx] || idx + 1}
                            </button>

                            <Input
                              placeholder={`অপশন ${banglaLetters[idx] || idx + 1} এর লেখা`}
                              value={opt.optionText}
                              onChange={(e) => handleOptionChange(idx, e.target.value)}
                              className="h-9 rounded-xl text-xs flex-1 bg-background"
                            />

                            {mcqOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(idx)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors cursor-pointer"
                                title="অপশন মুছুন"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Explanation Block */}
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold flex items-center gap-1.5">
                    <Lightbulb className="size-3.5 text-amber-500" />
                    ব্যাখ্যা ও সমাধান (Explanation)
                  </Label>
                  <Textarea
                    placeholder="শিক্ষার্থীদের জন্য বিস্তারিত সমাধান ও ব্যাখ্যামূলক নোট..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={3}
                    className="rounded-2xl text-xs font-sans"
                  />
                </div>
              </div>

              {/* STEP 4: ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetQuestionInputs}
                  className="rounded-xl h-11 px-5 text-xs font-bold"
                >
                  রিসেট
                </Button>

                <Button
                  type="button"
                  onClick={() => createMutation.mutate(true)}
                  disabled={createMutation.isPending}
                  className="rounded-xl h-11 px-6 text-xs font-bold gap-1.5 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                  {createMutation.isPending ? (
                    <>
                      <Spinner className="mr-1.5" /> সংরক্ষণ হচ্ছে...
                    </>
                  ) : (
                    <>
                      🚀 সংরক্ষণ ও আরেকটি যোগ করুন
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* TAB 2: Bulk JSON Import */}
            <TabsContent value="bulk" className="space-y-4 focus-visible:outline-none">
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base">বাল্ক প্রশ্ন ইমপোর্ট (JSON)</h3>
                  <p className="text-xs text-muted-foreground">
                    নির্বাচিত অধ্যায়ে ({currentChapter?.name || "অধ্যায় নির্বাচন করুন"}) একসাথে একাধিক প্রশ্ন ইমপোর্ট করতে নিচের বক্সে JSON অ্যারে পেস্ট করুন।
                  </p>
                </div>

                <Textarea
                  placeholder={`[
  {
    "type": "mcq",
    "questionText": "ভেক্টর রাশির উদাহরণ কোনটি?",
    "source": "ঢাকা বোর্ড ২০২৩",
    "standard": "HSC",
    "isFree": true,
    "mcqOptions": [
      { "optionText": "বেগ", "isCorrect": true },
      { "optionText": "দ্রুতি", "isCorrect": false }
    ]
  }
]`}
                  value={bulkJson}
                  onChange={(e) => setBulkJson(e.target.value)}
                  rows={10}
                  className="font-mono text-xs rounded-2xl"
                />

                {bulkImportStatus && (
                  <p className="text-xs font-bold p-3 rounded-xl bg-muted/60">
                    {bulkImportStatus}
                  </p>
                )}

                <Button
                  onClick={handleBulkImport}
                  className="rounded-xl font-bold text-xs h-10 px-5"
                >
                  ইমপোর্ট সম্পন্ন করুন
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ================= RIGHT COLUMN: Live Question Preview (Col Span 5) ================= */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-2 border-b">
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              লাইভ প্রিভিউ (শিক্ষার্থীরা যেমন দেখবে)
            </h3>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {type.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4">
            <UniversalQuestionCard
              question={previewQuestionObj}
              questionIndex={0}
              showCorrectAnswer={true}
              badgeText={isFree ? "🌐 ফ্রি ও উন্মুক্ত প্রশ্ন" : "🔒 ব্যাচ এক্সক্লুসিভ"}
            />
          </div>

          {/* Quick Stats of Current Chapter */}
          {currentChapter && (
            <div className="p-4 rounded-2xl bg-card border border-border/70 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span>বর্তমান নির্বাচিত লোকেশন:</span>
                <span className="text-primary">{currentContainer?.title}</span>
              </div>
              <p className="text-muted-foreground">
                বিষয়: {currentSubject?.name} • অধ্যায়: {currentChapter.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom Section: Recently Uploaded Questions ─── */}
      <div className="space-y-4 pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <TickCircle className="size-5 text-emerald-500" />
            সাম্প্রতিক আপলোডকৃত প্রশ্নসমূহ ({recentList.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            আপনার এই সেশনে আপলোড হওয়া প্রশ্নগুলোর তাৎক্ষণিক তালিকা
          </p>
        </div>

        {recentList.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/10 text-muted-foreground text-xs">
            এখনও কোনো প্রশ্ন আপলোড করা হয়নি। উপরের ফর্ম থেকে প্রশ্ন যুক্ত করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentList.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {q.subjectName} • {q.chapterName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {q.isFree && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600">
                          উন্মুক্ত
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {q.standard}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-foreground line-clamp-2">
                    {q.questionText}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    উৎস: {q.source}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(q.id)}
                    disabled={deleteMutation.isPending}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg p-1 px-2 cursor-pointer"
                  >
                    <Trash2 className="size-3.5 mr-1" /> মুছুন
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
