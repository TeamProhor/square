"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Add,
  ArrowLeft2,
  Category,
  Copy,
  Danger,
  DocumentDownload,
  Edit,
  Eye,
  FileText,
  Flash,
  Information,
  Lightbulb,
  SecurityCard,
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
  const [mobileActiveView, setMobileActiveView] = useState<"editor" | "preview">("editor");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recentList, setRecentList] = useState<any[]>(initialRecentQuestions);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

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

  const handleCqPartChange = (
    idx: number,
    field: "questionText" | "answerText" | "marks",
    value: string | number,
  ) => {
    const updated = [...cqParts];
    updated[idx] = { ...updated[idx], [field]: value };
    setCqParts(updated);
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
    mutationFn: async () => {
      if (!selectedChapterId) {
        throw new Error("অনুগ্রহ করে একটি অধ্যায় নির্বাচন করুন।");
      }
      if (!questionText.trim()) {
        throw new Error("প্রশ্নের বিবরণ আবশ্যক।");
      }

      if (type === "mcq") {
        const hasValidOptions = mcqOptions.some((o) => o.optionText.trim().length > 0);
        if (!hasValidOptions) {
          throw new Error("কমপক্ষে ২টি অপশনের টেক্সট পূরণ করুন।");
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
        throw new Error(res.message || "প্রশ্ন সংরক্ষণে সমস্যা হয়েছে");
      }

      return res;
    },
    onSuccess: (data) => {
      setSuccessMsg("প্রশ্নটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে।");
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

  // Clean MCQ JSON (Without meta fields)
  const cleanSampleMcqJson = `[
  {
    "questionText": "নিচের কোনটি ভেক্টর রাশি?",
    "mcqOptions": [
      { "optionText": "বেগ", "isCorrect": true },
      { "optionText": "দ্রুতি", "isCorrect": false },
      { "optionText": "কাজ", "isCorrect": false },
      { "optionText": "ক্ষমতা", "isCorrect": false }
    ],
    "explanation": "বেগ একটি ভেক্টর রাশি কারণ এর নির্দিষ্ট মান ও দিক উভয়ই বিদ্যমান।"
  },
  {
    "questionText": "$$\\\\vec{A} = 2\\\\hat{i} + 3\\\\hat{j}$$ এবং $$\\\\vec{B} = 4\\\\hat{i} - \\\\hat{j}$$ হলে ভেক্টরদ্বয়ের ডট গুণন কত?",
    "mcqOptions": [
      { "optionText": "5", "isCorrect": true },
      { "optionText": "8", "isCorrect": false },
      { "optionText": "11", "isCorrect": false },
      { "optionText": "14", "isCorrect": false }
    ],
    "explanation": "$$\\\\vec{A} \\\\cdot \\\\vec{B} = (2 \\\\times 4) + (3 \\\\times -1) = 8 - 3 = 5$$"
  }
]`;

  // Clean CQ JSON (Without meta fields)
  const cleanSampleCqJson = `[
  {
    "questionText": "একটি গাড়ি স্থির অবস্থান থেকে $2\\\\text{ ms}^{-2}$ সুষম ত্বরণে চলা শুরু করল এবং $10\\\\text{ s}$ পর সমবেগে চলল।",
    "cqParts": [
      {
        "partKey": "a",
        "marks": 1,
        "questionText": "ত্বরণ কাকে বলে?",
        "answerText": "সময়ের সাথে বস্তুর অসম বেগের পরিবর্তনের হারকে ত্বরণ বলে।"
      },
      {
        "partKey": "b",
        "marks": 2,
        "questionText": "সুষম ত্বরণে চলমান বস্তুর বেগ নিয়মিত বৃদ্ধি পায় কেন? ব্যাখ্যা করো।",
        "answerText": "ত্বরণ হলো বেগের পরিবর্তনের হার, তাই সুষম ত্বরণে বেগ নির্দিষ্ট হারে বাড়তে থাকে।"
      },
      {
        "partKey": "c",
        "marks": 3,
        "questionText": "প্রথম $10\\\\text{ s}$-এ গাড়িটি কত দূরত্ব অতিক্রম করবে?",
        "answerText": "$$s = ut + \\\\frac{1}{2}at^2 = 0 + \\\\frac{1}{2}(2)(10)^2 = 100\\\\text{ m}$$"
      },
      {
        "partKey": "d",
        "marks": 4,
        "questionText": "উদ্দীপকের তথ্যানুযায়ী বেগ-সময় লেখচিত্র অঙ্কন করে গতি বিশ্লেষণ করো।",
        "answerText": "প্রথম ১০ সেকেন্ড বেগ বৃদ্ধি পেয়ে ২০ মি/সে হবে, পরবর্তীতে সমবেগে চলবে।"
      }
    ],
    "explanation": "গতিবিদ্যার সৃজনশীল সমাধান।"
  }
]`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(label);
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  const copyAiPrompt = () => {
    const promptText = `তুমি একজন অভিজ্ঞ শিক্ষক ও প্রশ্নপ্রণেতা।
দয়া করে নিচের বিষয়ের উপর ১০টি ${type === "mcq" ? "MCQ (বহুনির্বাচনী ৪টি অপশন সহ)" : "CQ (সৃজনশীল ৪টি অংশ ক,খ,গ,ঘ সহ)"} প্রশ্ন তৈরি করে দাও।

বিষয়: ${currentSubject?.name || "পদার্থবিজ্ঞান"}
অধ্যায়: ${currentChapter?.name || "অধ্যায়"}

নির্দেশনা:
১. ম্যাথমেটিক্যাল বা সাইন্টিফিক সূত্রের জন্য অবশ্যই LaTeX ($...$ বা $$...$$) ব্যবহার করবে।
২. আউটপুট হিসেবে কোনো অতিরিক্ত কথা, ব্যাখ্যা বা মেটাডেটা ছাড়া শুধুমাত্র নিচের JSON ফরম্যাটে একটি ভ্যালিড JSON অ্যারে আউটপুট দেবে:

${type === "mcq" ? cleanSampleMcqJson : cleanSampleCqJson}`;

    copyToClipboard(promptText, "ai-prompt");
  };

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

      // Always pass the manual selections so they are assigned to every question!
      const res = await importQuestionsAction(
        selectedChapterId,
        parsed,
        {
          type,
          standard,
          source,
          isFree,
          topicId: selectedTopicId || undefined,
        },
      );
      if (res.error) throw new Error(res.error);

      setBulkImportStatus(`সফলভাবে ${parsed.length} টি প্রশ্ন ইমপোর্ট হয়েছে।`);
      setBulkJson("");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
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
      answerText: p.answerText || "",
      marks: p.marks,
    })),
  };

  const banglaLetters = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24 sm:pb-16 pt-1 sm:pt-2 md:py-8 gap-5 sm:gap-8 px-2.5 sm:px-4 md:px-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="size-8 sm:size-9 rounded-xl shrink-0"
              title="প্রশ্নব্যাংক তালিকায় ফিরুন"
            >
              <Link href="/admin/qb">
                <ArrowLeft2 className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                <TaskSquare className="size-5 sm:size-6 text-primary shrink-0" />
                <span>প্রশ্ন আপলোড ও বিল্ডার</span>
              </h1>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground pl-10 sm:pl-12">
            এক পেজেই ক্যাটাগরি, বিষয় ও অধ্যায় সিলেক্ট করে সরাসরি একক ও বাল্ক প্রশ্ন তৈরি করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto pl-10 sm:pl-0">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5 h-8 sm:h-9">
            <Link href="/admin/qb">
              <span>প্রশ্নব্যাংক তালিকা</span>
              <ArrowLeft2 className="size-3.5 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs">
          <TickCircle className="size-4 sm:size-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {formError && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-bold flex items-center gap-2.5">
          <Danger className="size-4 sm:size-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Mobile Toggle Bar: Editor vs Live Preview */}
      <div className="flex lg:hidden items-center justify-between p-1.5 bg-muted/70 rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setMobileActiveView("editor")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileActiveView === "editor"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Edit className="size-3.5" />
          <span>প্রশ্ন এডিটর</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileActiveView("preview")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileActiveView === "preview"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eye className="size-3.5" />
          <span>লাইভ প্রিভিউ</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Editor Forms */}
        <div className={`lg:col-span-7 flex flex-col gap-5 sm:gap-6 ${mobileActiveView === "preview" ? "hidden lg:flex" : "flex"}`}>
          <Tabs defaultValue="single" className="w-full flex flex-col gap-4 sm:gap-5">
            <TabsList className="grid grid-cols-2 w-full max-w-sm rounded-xl p-1 bg-muted/60 h-10">
              <TabsTrigger value="single" className="rounded-lg text-xs font-bold gap-1.5 h-8">
                <Edit className="size-3.5" />
                <span>একক প্রশ্ন তৈরি</span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="rounded-lg text-xs font-bold gap-1.5 h-8">
                <DocumentDownload className="size-3.5" />
                <span>বাল্ক JSON ইমপোর্ট</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Single Question Creator */}
            <TabsContent value="single" className="flex flex-col gap-5 sm:gap-6 focus-visible:outline-none m-0">
              {/* STEP 1: CASCADING LOCATION SELECTOR */}
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Category className="size-4 text-primary shrink-0" />
                  <h3 className="font-extrabold text-xs sm:text-sm md:text-base">
                    ১. লোকেশন নির্বাচন (প্রশ্নব্যাংক, বিষয় ও অধ্যায়)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Container / QB Select */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      প্রশ্নব্যাংক ক্যাটাগরি *
                    </Label>
                    <NativeSelect
                      value={selectedContainerId}
                      onChange={(e) => handleContainerChange(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold min-h-[42px]"
                    >
                      {hierarchy.map((c) => (
                        <NativeSelectOption key={c.id} value={c.id}>
                          {c.title} {c.isPublic ? "(উন্মুক্ত)" : ""}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  {/* Subject Select */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      বিষয় (Subject) *
                    </Label>
                    <NativeSelect
                      value={selectedSubjectId}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold min-h-[42px]"
                    >
                      {availableSubjects.map((s) => (
                        <NativeSelectOption key={s.id} value={s.id}>
                          {s.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  {/* Chapter Select */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      অধ্যায় (Chapter) *
                    </Label>
                    <NativeSelect
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold min-h-[42px]"
                    >
                      {availableChapters.map((ch) => (
                        <NativeSelectOption key={ch.id} value={ch.id}>
                          {ch.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  {/* Topic Select (Optional) */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      টপিক (ঐচ্ছিক)
                    </Label>
                    <NativeSelect
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="w-full rounded-xl text-xs min-h-[42px]"
                    >
                      <NativeSelectOption value="">সাধারণ (কোনো নির্দিষ্ট টপিক ছাড়া)</NativeSelectOption>
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
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <SecurityCard className="size-4 text-primary shrink-0" />
                  <h3 className="font-extrabold text-xs sm:text-sm md:text-base">
                    ২. প্রশ্নের ধরন ও উৎস সেটিংস
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Type */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold">টাইপ *</Label>
                    <NativeSelect
                      value={type}
                      onChange={(e) => setType(e.target.value as "mcq" | "cq")}
                      className="w-full rounded-xl text-xs font-bold min-h-[42px]"
                    >
                      <NativeSelectOption value="mcq">MCQ (বহুনির্বাচনী)</NativeSelectOption>
                      <NativeSelectOption value="cq">CQ (সৃজনশীল)</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  {/* Standard */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold">মান / স্তর (Standard) *</Label>
                    <NativeSelect
                      value={standard}
                      onChange={(e) => setStandard(e.target.value)}
                      className="w-full rounded-xl text-xs font-bold min-h-[42px]"
                    >
                      <NativeSelectOption value="HSC">HSC (বোর্ড)</NativeSelectOption>
                      <NativeSelectOption value="Varsity">Varsity (ভার্সিটি)</NativeSelectOption>
                      <NativeSelectOption value="Engineering">Engineering (ইঞ্জিনিয়ারিং)</NativeSelectOption>
                      <NativeSelectOption value="Medical">Medical (মেডিকেল)</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  {/* Source */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold">উৎস (Source)</Label>
                    <Input
                      placeholder="যেমন: ঢাকা বোর্ড ২০২৩..."
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      list="unified-source-suggestions"
                      className="rounded-xl text-xs min-h-[42px]"
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
                <div className="flex items-center gap-2.5 p-3 sm:p-3.5 bg-muted/40 rounded-2xl border border-border/70">
                  <input
                    type="checkbox"
                    id="universal-is-free"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="size-4.5 rounded accent-primary cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="universal-is-free"
                    className="text-xs font-bold text-foreground cursor-pointer select-none"
                  >
                    সবার জন্য উন্মুক্ত ও ফ্রি প্রশ্ন (লগইন থাকুক বা না থাকুক যেকোনো শিক্ষার্থী অনুশীলন করতে পারবে)
                  </label>
                </div>
              </div>

              {/* STEP 3: QUESTION STEM & ANSWERS */}
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary shrink-0" />
                    <h3 className="font-extrabold text-xs sm:text-sm md:text-base">
                      {type === "mcq" ? "৩. প্রশ্নের মূল বিবরণ ও অপশনসমূহ" : "৩. সৃজনশীল উদ্দীপক ও অংশসমূহ"}
                    </h3>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground">
                    LaTeX: $...$ বা $$...$$
                  </span>
                </div>

                {/* Question Stem Textarea */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-bold">
                    {type === "mcq" ? "প্রশ্নের বিবরণ (Question Stem) *" : "সৃজনশীল উদ্দীপক (Stem) *"}
                  </Label>
                  <Textarea
                    placeholder={type === "mcq" ? "প্রশ্ন লিখুন... (ম্যাথ সূত্রের জন্য LaTeX যেমন $F = ma$ ব্যবহার করুন)" : "উদ্দীপক লিখুন..."}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={4}
                    className="rounded-2xl text-xs sm:text-sm font-sans"
                    required
                  />
                </div>

                {/* MCQ Options Block */}
                {type === "mcq" && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold">
                        অপশনসমূহ (সঠিক উত্তরের বর্ণে ক্লিক করুন)
                      </Label>
                      {mcqOptions.length < 6 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleAddOption}
                          className="h-7 text-xs font-bold text-primary gap-1"
                        >
                          <Add className="size-3.5" />
                          <span>অপশন যোগ করুন</span>
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {mcqOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-2xl border transition-all ${
                            opt.isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/40"
                              : "bg-card border-border/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCorrectSelect(idx)}
                            className={`size-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              opt.isCorrect
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-muted text-muted-foreground hover:bg-accent"
                            }`}
                            title={opt.isCorrect ? "সঠিক উত্তর" : "সঠিক হিসেবে মার্ক করুন"}
                          >
                            {banglaLetters[idx] || idx + 1}
                          </button>

                          <Input
                            placeholder={`অপশন ${banglaLetters[idx] || idx + 1} এর টেক্সট`}
                            value={opt.optionText}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className="h-10 rounded-xl text-xs flex-1 bg-background"
                          />

                          {mcqOptions.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOption(idx)}
                              className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
                              title="অপশন মুছুন"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CQ Parts Block */}
                {type === "cq" && (
                  <div className="flex flex-col gap-3 pt-2">
                    <Label className="text-xs font-bold">
                      সৃজনশীল প্রশ্ন ও উত্তরের অংশসমূহ (ক, খ, গ, ঘ)
                    </Label>

                    <div className="flex flex-col gap-3">
                      {cqParts.map((part, idx) => (
                        <div
                          key={part.partKey}
                          className="flex flex-col gap-2.5 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-muted/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="size-6 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                                {banglaLetters[idx] || part.partKey}
                              </span>
                              <span className="text-xs font-bold">
                                অংশ {banglaLetters[idx]} ({part.marks} নম্বর)
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Label className="text-[11px] text-muted-foreground">নম্বর:</Label>
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={part.marks}
                                onChange={(e) =>
                                  handleCqPartChange(idx, "marks", parseInt(e.target.value) || 1)
                                }
                                className="w-14 h-8 text-xs rounded-lg text-center"
                              />
                            </div>
                          </div>

                          <Input
                            placeholder={`অংশ ${banglaLetters[idx]} এর প্রশ্ন...`}
                            value={part.questionText}
                            onChange={(e) =>
                              handleCqPartChange(idx, "questionText", e.target.value)
                            }
                            className="text-xs rounded-xl h-9 bg-background"
                          />

                          <Textarea
                            placeholder={`অংশ ${banglaLetters[idx]} এর সমাধান/উত্তর...`}
                            value={part.answerText}
                            onChange={(e) =>
                              handleCqPartChange(idx, "answerText", e.target.value)
                            }
                            rows={2}
                            className="text-xs rounded-xl bg-background"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation Block */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <Label className="text-xs font-bold flex items-center gap-1.5">
                    <Lightbulb className="size-3.5 text-amber-500" />
                    <span>সার্বিক ব্যাখ্যা ও নোট (Explanation)</span>
                  </Label>
                  <Textarea
                    placeholder="শিক্ষার্থীদের জন্য ব্যাখ্যামূলক নোট ও সমাধান..."
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
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending}
                  className="rounded-xl h-11 px-6 text-xs font-bold gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                  {createMutation.isPending ? (
                    <>
                      <Spinner className="size-4" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Flash className="size-4" />
                      <span>সংরক্ষণ করুন ও পরবর্তী প্রশ্ন যোগ করুন</span>
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* TAB 2: Bulk JSON Import */}
            <TabsContent value="bulk" className="flex flex-col gap-4 focus-visible:outline-none m-0">
              <div className="bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xs flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                      <DocumentDownload className="size-4 text-primary" />
                      <span>বাল্ক প্রশ্ন ইমপোর্ট (JSON)</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      নিচের টেক্সটবক্সে শুধুমাত্র প্রশ্ন ও অপশনের JSON অ্যারে পেস্ট করুন।
                    </p>
                  </div>

                  {/* Template & Copy Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(cleanSampleMcqJson, "mcq-json")}
                      className="text-[11px] h-8 rounded-xl font-bold gap-1"
                    >
                      <Copy className="size-3" />
                      <span>{copiedStatus === "mcq-json" ? "কপি হয়েছে!" : "MCQ ফরম্যাট কপি"}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(cleanSampleCqJson, "cq-json")}
                      className="text-[11px] h-8 rounded-xl font-bold gap-1"
                    >
                      <Copy className="size-3" />
                      <span>{copiedStatus === "cq-json" ? "কপি হয়েছে!" : "CQ ফরম্যাট কপি"}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={copyAiPrompt}
                      className="text-[11px] h-8 rounded-xl font-bold gap-1 text-primary bg-primary/10 hover:bg-primary/20"
                    >
                      <Flash className="size-3" />
                      <span>{copiedStatus === "ai-prompt" ? "প্রম্পট কপি হয়েছে!" : "AI প্রম্পট কপি"}</span>
                    </Button>
                  </div>
                </div>

                {/* Info banner explaining that manual selections are automatically applied */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/50 border border-border/70 text-xs flex flex-col gap-2">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Information className="size-4 text-primary shrink-0" />
                    <span>স্বয়ংক্রিয়ভাবে কার্যকর সেটিংস (Auto-Applied Settings):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px]">
                    <span className="bg-background px-2.5 py-1 rounded-lg border border-border/60 font-medium">
                      প্রশ্নব্যাংক: {currentContainer?.title || "ক্যাটাগরি"}
                    </span>
                    <span className="bg-background px-2.5 py-1 rounded-lg border border-border/60 font-medium">
                      বিষয়: {currentSubject?.name || "বিষয়"}
                    </span>
                    <span className="bg-background px-2.5 py-1 rounded-lg border border-border/60 font-medium">
                      অধ্যায়: {currentChapter?.name || "অধ্যায়"}
                    </span>
                    <span className="bg-background px-2.5 py-1 rounded-lg border border-border/60 font-medium">
                      টাইপ: {type === "mcq" ? "MCQ" : "CQ"}
                    </span>
                    <span className="bg-background px-2.5 py-1 rounded-lg border border-border/60 font-medium">
                      মান: {standard}
                    </span>
                    <span className="bg-background px-2.5 py-1 rounded-lg border border-border/60 font-medium">
                      উৎস: {source}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg border font-bold ${isFree ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-background border-border/60"}`}>
                      {isFree ? "উন্মুক্ত ও ফ্রি" : "ব্যাচ নিয়ন্ত্রিত"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic pt-0.5">
                    উপরের এই সেটিংসগুলো স্বয়ংক্রিয়ভাবে ইমপোর্টের সব প্রশ্নে সেট হয়ে যাবে। তাই JSON-এ এগুলো উল্লেখ করার প্রয়োজন নেই।
                  </p>
                </div>

                {/* JSON Input Area */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">JSON ডেটা পেস্ট করুন</Label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBulkJson(cleanSampleMcqJson)}
                        className="text-[11px] text-primary hover:underline font-bold cursor-pointer"
                      >
                        MCQ নমুনা লোড
                      </button>
                      <span className="text-muted-foreground text-[11px]">•</span>
                      <button
                        type="button"
                        onClick={() => setBulkJson(cleanSampleCqJson)}
                        className="text-[11px] text-primary hover:underline font-bold cursor-pointer"
                      >
                        CQ নমুনা লোড
                      </button>
                    </div>
                  </div>
                  <Textarea
                    placeholder={cleanSampleMcqJson}
                    value={bulkJson}
                    onChange={(e) => setBulkJson(e.target.value)}
                    rows={12}
                    className="font-mono text-xs rounded-2xl bg-background leading-relaxed"
                  />
                </div>

                {bulkImportStatus && (
                  <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${bulkImportStatus.includes("সফলভাবে") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                    {bulkImportStatus.includes("সফলভাবে") ? <TickCircle className="size-4 shrink-0" /> : <Danger className="size-4 shrink-0" />}
                    <span>{bulkImportStatus}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBulkJson("")}
                    className="rounded-xl font-bold text-xs h-10 px-4"
                  >
                    ক্লিয়ার
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBulkImport}
                    disabled={!bulkJson.trim() || !selectedChapterId}
                    className="rounded-xl font-bold text-xs h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer gap-2"
                  >
                    <DocumentDownload className="size-4" />
                    <span>বাল্ক প্রশ্ন ইমপোর্ট করুন</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Live Preview Panel */}
        <div className={`lg:col-span-5 flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-20 ${mobileActiveView === "editor" ? "hidden lg:flex" : "flex"}`}>
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <Eye className="size-4 text-primary shrink-0" />
              <span>লাইভ প্রিভিউ</span>
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
              {type}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <UniversalQuestionCard
              question={previewQuestionObj}
              questionIndex={0}
              showCorrectAnswer={true}
              badgeText={isFree ? "উন্মুক্ত ও ফ্রি প্রশ্ন" : "ব্যাচ এক্সক্লুসিভ"}
            />
          </div>

          {/* Location Summary Card */}
          {currentChapter && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/70 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-muted-foreground">বর্তমান লোকেশন:</span>
                <span className="text-primary">{currentContainer?.title}</span>
              </div>
              <p className="text-muted-foreground">
                বিষয়: {currentSubject?.name} • অধ্যায়: {currentChapter.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Recently Uploaded Questions */}
      <div className="flex flex-col gap-4 pt-6 sm:pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-base sm:text-xl font-bold flex items-center gap-2">
            <TickCircle className="size-4.5 sm:size-5 text-emerald-500" />
            <span>সাম্প্রতিক আপলোডকৃত প্রশ্নসমূহ ({recentList.length})</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            আপনার এই সেশনে আপলোড হওয়া প্রশ্নগুলোর তালিকা
          </p>
        </div>

        {recentList.length === 0 ? (
          <div className="p-6 sm:p-8 text-center border border-dashed rounded-2xl bg-muted/10 text-muted-foreground text-xs">
            এখনও কোনো প্রশ্ন আপলোড করা হয়নি। উপরের ফর্ম থেকে প্রশ্ন যুক্ত করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {recentList.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-card border border-border/70 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex flex-col gap-2">
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
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg p-1 px-2 cursor-pointer gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    <span>মুছুন</span>
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
