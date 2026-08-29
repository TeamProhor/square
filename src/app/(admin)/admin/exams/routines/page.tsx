"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  CalendarTick,
  Clock,
  Edit,
  Flash,
  TickCircle,
  Trash2,
} from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type CreateRoutinePayload,
  createExamRoutine,
  deleteExamRoutine,
  getBatches,
  getCalendarSettings,
  getExamRoutines,
  seedDemoRoutines,
  updateCalendarSettings,
} from "@/lib/actions/routine";
import type { Batch, CalendarSettings, ExamRoutine } from "@/types";

export default function AdminExamsPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBatch, _setSelectedBatch] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [examDate, setExamDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [totalMarks, setTotalMarks] = useState(25);
  const [batchId, _setBatchId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Calendar Header Settings State
  const [calTitle, setCalTitle] = useState("");
  const [calSubtitle, setCalSubtitle] = useState("");
  const [calCountdownTitle, setCalCountdownTitle] = useState("");
  const [calPrintTitle, setCalPrintTitle] = useState("");
  const [calPrintSubtitle, setCalPrintSubtitle] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const { data: batchesList = [] } = useQuery<Batch[]>({
    queryKey: ["admin-batches"],
    queryFn: () => getBatches(),
  });

  const { data: routines = [], isLoading } = useQuery<ExamRoutine[]>({
    queryKey: ["admin-routines", selectedBatch],
    queryFn: () => getExamRoutines(selectedBatch),
  });

  const { data: calSettings } = useQuery<CalendarSettings>({
    queryKey: ["calendar-settings"],
    queryFn: () => getCalendarSettings(),
  });

  useEffect(() => {
    if (calSettings) {
      setCalTitle(calSettings.title);
      setCalSubtitle(calSettings.subtitle);
      setCalCountdownTitle(calSettings.countdownTitle);
      setCalPrintTitle(calSettings.printTitle);
      setCalPrintSubtitle(calSettings.printSubtitle);
    }
  }, [calSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (payload: Partial<CalendarSettings>) => {
      const res = await updateCalendarSettings(payload);
      if (!res.success)
        throw new Error(res.message || "Failed to update calendar settings");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-settings"] });
      setSettingsSuccess(true);
      setSettingsError(null);
      setTimeout(() => setSettingsSuccess(false), 3500);
    },
    onError: (err: unknown) => {
      setSettingsError(
        err instanceof Error ? err.message : "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে",
      );
      setSettingsSuccess(false);
    },
  });

  const seedMutation = useMutation({
    mutationFn: async (type: "hsc" | "admission") => {
      const res = await seedDemoRoutines(type);
      if (!res.success)
        throw new Error(res.message || "Failed to seed demo routines");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-routines"] });
      queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
    },
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      title: calTitle,
      subtitle: calSubtitle,
      countdownTitle: calCountdownTitle,
      printTitle: calPrintTitle,
      printSubtitle: calPrintSubtitle,
    });
  };

  const applyPreset = (preset: {
    title: string;
    subtitle: string;
    countdownTitle: string;
    printTitle: string;
    printSubtitle: string;
  }) => {
    setCalTitle(preset.title);
    setCalSubtitle(preset.subtitle);
    setCalCountdownTitle(preset.countdownTitle);
    setCalPrintTitle(preset.printTitle);
    setCalPrintSubtitle(preset.printSubtitle);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: CreateRoutinePayload) => {
      const res = await createExamRoutine(payload);
      if (!res.success)
        throw new Error(res.message || "Failed to create routine");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-routines"] });
      queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
      setIsOpen(false);
      setTitle("");
      setSubject("");
      setSyllabus("");
      setExamDate("");
      setFormError(null);
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "একটি ত্রুটি ঘটেছে");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteExamRoutine(id);
      if (!res.success)
        throw new Error(res.message || "Failed to delete routine");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-routines"] });
      queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("পরীক্ষার শিরোনাম প্রদান করুন");
      return;
    }
    if (!subject.trim()) {
      setFormError("বিষয় প্রদান করুন");
      return;
    }
    if (!examDate.trim()) {
      setFormError("পরীক্ষার তারিখ ও সময় প্রদান করুন");
      return;
    }

    createMutation.mutate({
      batchId: batchId || (batchesList[0]?.id ?? ""),
      title,
      subject,
      syllabus,
      examDate,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
    });
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      {/* ─── Calendar & Print Header Settings (Database-driven) ─── */}
      <Card className="shadow-xs border rounded-2xl overflow-hidden bg-card">
        <CardHeader className="p-4 sm:p-6 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Edit className="size-5 text-primary" />
                ক্যালেন্ডার ও প্রিন্ট হেডার সেটিংস (ডাইনামিক ডাটাবেজ)
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                এখানে পরিবর্তন করলে মূল ক্যালেন্ডার পেইজ (/calendar) এবং প্রিন্ট পেইজ (/print/calendar)-এ সাথে সাথে সিঙ্ক হয়ে যাবে।
              </CardDescription>
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
                onClick={() =>
                  applyPreset({
                    title: "এইচএসসি ২০২৬ চূড়ান্ত রুটিন",
                    subtitle: "সবগুলো পরীক্ষা একই সূচীতে দেখে নিন সহজে",
                    countdownTitle: "বোর্ড পরীক্ষা শুরু হতে বাকি:",
                    printTitle: "স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী",
                    printSubtitle: "এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন",
                  })
                }
              >
                🎓 HSC 2026
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
                onClick={() =>
                  applyPreset({
                    title: "বিশ্ববিদ্যালয় ও ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা সময়সূচী ২০২৬",
                    subtitle: "সকল বিশ্ববিদ্যালয় ও ইঞ্জিনিয়ারিং এডমিশন টেস্টের চূড়ান্ত রুটিন",
                    countdownTitle: "এডমিশন পরীক্ষা শুরু হতে বাকি:",
                    printTitle: "স্কয়ার বিশ্ববিদ্যালয় ও ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা সময়সূচী",
                    printSubtitle: "এডমিশন টেস্ট ও ভর্তি পরীক্ষার চূড়ান্ত ক্যালেন্ডার",
                  })
                }
              >
                🏛️ Admission 2026
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
                onClick={() =>
                  applyPreset({
                    title: "বিশেষ মডেল টেস্ট ও মূল্যায়ন পরীক্ষার সময়সূচী",
                    subtitle: "অনলাইন ও অফলাইন মডেল টেস্ট পরীক্ষার চূড়ান্ত রুটিন",
                    countdownTitle: "পরবর্তী মডেল টেস্ট বাকি:",
                    printTitle: "স্কয়ার বিশেষ মডেল টেস্ট ও মূল্যায়ন পরীক্ষার সময়সূচী",
                    printSubtitle: "মডেল টেস্ট ও প্রস্তুতিমূলক মূল্যায়ন চূড়ান্ত রুটিন",
                  })
                }
              >
                📝 Model Test
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            {settingsSuccess && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
                <TickCircle className="size-4 shrink-0" />
                ক্যালেন্ডার ও প্রিন্ট হেডার সেটিংস ডাটাবেজে সফলভাবে সংরক্ষিত ও সিঙ্ক হয়েছে!
              </div>
            )}
            {settingsError && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                {settingsError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cal-title" className="text-xs font-bold">
                  ক্যালেন্ডার পেইজ টাইটেল (/calendar)
                </Label>
                <Input
                  id="cal-title"
                  value={calTitle}
                  onChange={(e) => setCalTitle(e.target.value)}
                  placeholder="যেমন: এইচএসসি ২০২৬ চূড়ান্ত রুটিন বা এডমিশন ক্যালেন্ডার"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-subtitle" className="text-xs font-bold">
                  ক্যালেন্ডার পেইজ সাব-টাইটেল (/calendar)
                </Label>
                <Input
                  id="cal-subtitle"
                  value={calSubtitle}
                  onChange={(e) => setCalSubtitle(e.target.value)}
                  placeholder="যেমন: সবগুলো পরীক্ষা একই সূচীতে দেখে নিন সহজে"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-countdown" className="text-xs font-bold">
                  লাইভ কাউন্টডাউন টেক্সট (/calendar)
                </Label>
                <Input
                  id="cal-countdown"
                  value={calCountdownTitle}
                  onChange={(e) => setCalCountdownTitle(e.target.value)}
                  placeholder="যেমন: বোর্ড পরীক্ষা শুরু হতে বাকি: বা এডমিশন টেস্ট শুরু হতে বাকি:"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-print-title" className="text-xs font-bold">
                  প্রিন্ট পেইজ প্রধান শিরোনাম (/print/calendar)
                </Label>
                <Input
                  id="cal-print-title"
                  value={calPrintTitle}
                  onChange={(e) => setCalPrintTitle(e.target.value)}
                  placeholder="যেমন: স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী"
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="cal-print-subtitle" className="text-xs font-bold">
                  প্রিন্ট পেইজ উপ-শিরোনাম (/print/calendar)
                </Label>
                <Input
                  id="cal-print-subtitle"
                  value={calPrintSubtitle}
                  onChange={(e) => setCalPrintSubtitle(e.target.value)}
                  placeholder="যেমন: এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">ডেমো ডাটা পুশ:</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={seedMutation.isPending}
                  onClick={() => seedMutation.mutate("hsc")}
                  className="h-8 text-xs rounded-lg cursor-pointer"
                >
                  {seedMutation.isPending ? <Spinner className="size-3 mr-1" /> : null}
                  + HSC ডেমো রুটিন পুশ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={seedMutation.isPending}
                  onClick={() => seedMutation.mutate("admission")}
                  className="h-8 text-xs rounded-lg cursor-pointer"
                >
                  {seedMutation.isPending ? <Spinner className="size-3 mr-1" /> : null}
                  + এডমিশন ডেমো রুটিন পুশ
                </Button>
              </div>

              <Button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="font-bold shadow-xs px-6 rounded-xl cursor-pointer"
              >
                {updateSettingsMutation.isPending ? (
                  <>
                    <Spinner className="mr-2" /> সেভ হচ্ছে...
                  </>
                ) : (
                  "হেডার সেটিংস সেভ করুন"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ─── Routine Management Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <ResponsiveDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          trigger={
            <Button className="rounded-full shadow-xs gap-1.5 h-10 px-5 font-semibold cursor-pointer">
              <Flash className="size-4" /> নতুন পরীক্ষার সূচী যোগ করুন
            </Button>
          }
          title="নতুন পরীক্ষার রুটিন যোগ করুন"
          description="তারিখ, বিষয় ও সিলেবাস নির্ধারণ করে ক্যালেন্ডারে প্রকাশ করুন।"
          className="sm:max-w-[540px]"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 py-2">
              {formError && (
                <div className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="exam-title">পরীক্ষার নাম / শিরোনাম *</Label>
                <Input
                  id="exam-title"
                  placeholder="যেমন: পদার্থবিজ্ঞান ১ম পত্র - ভেক্টর স্পেশাল এক্সাম"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="exam-subject">বিষয় *</Label>
                  <Input
                    id="exam-subject"
                    placeholder="যেমন: পদার্থবিজ্ঞান ১ম পত্র"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exam-date">পরীক্ষার তারিখ ও সময় *</Label>
                  <Input
                    id="exam-date"
                    type="datetime-local"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="exam-duration">সময় (মিনিট)</Label>
                  <Input
                    id="exam-duration"
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exam-marks">মোট নম্বর</Label>
                  <Input
                    id="exam-marks"
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exam-syllabus">সিলেবাস (ঐচ্ছিক)</Label>
                <Input
                  id="exam-syllabus"
                  placeholder="যেমন: অধ্যায় ২ (সম্পূর্ণ ভেক্টর)"
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={createMutation.isPending}
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Spinner className="mr-2" /> সেভ হচ্ছে...
                  </>
                ) : (
                  "রুটিন যুক্ত করুন"
                )}
              </Button>
            </div>
          </form>
        </ResponsiveDialog>
      </div>

      {/* Routine Table */}
      <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            পরীক্ষার তালিকা ({routines.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Spinner className="size-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">
              রুটিন তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : routines.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CalendarTick className="size-12 text-muted-foreground/40 mb-3" />
            <h4 className="font-bold text-base text-foreground">
              এখনও কোনো রুটিন যোগ করা হয়নি
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              উপরের "নতুন পরীক্ষার সূচী যোগ করুন" বাটনে ক্লিক করে পরীক্ষার তারিখ ও সময়
              প্রকাশ করুন।
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {routines.map((routine) => {
              const formattedDate = new Date(routine.examDate).toLocaleString(
                "bn-BD",
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              );

              return (
                <div
                  key={routine.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-base text-foreground">
                        {routine.title}
                      </h4>
                      <span className="text-xs font-bold text-primary">
                        • {routine.subject}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        ({routine.durationMinutes} মিনিট | {routine.totalMarks}{" "}
                        নম্বর)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      📅 তারিখ ও সময়:{" "}
                      <span className="font-medium text-foreground">
                        {formattedDate}
                      </span>
                      {routine.syllabus && (
                        <span className="ml-3">
                          📖 সিলেবাস: {routine.syllabus}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <DeleteConfirmDialog
                      title="রুটিন ডিলিট নিশ্চিতকরণ"
                      description={`আপনি কি নিশ্চিত এই রুটিনটি ("${routine.title}") ডিলিট করতে চান?`}
                      onConfirm={async () => {
                        await deleteMutation.mutateAsync(routine.id);
                      }}
                      trigger={
                        <Button
                          variant="ghost"
                          disabled={deleteMutation.isPending}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
