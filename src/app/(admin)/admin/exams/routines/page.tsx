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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [batchId, setBatchId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Calendar Header Settings State (Unified Title & Subtitle for both Calendar & Print)
  const [calTitle, setCalTitle] = useState("");
  const [calSubtitle, setCalSubtitle] = useState("");
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
    }
  }, [calSettings]);

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSuccess(false);
    setSettingsError(null);

    try {
      const res = await updateCalendarSettings({
        title: calTitle,
        subtitle: calSubtitle,
      });

      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["calendar-settings"] });
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3500);
      } else {
        setSettingsError(res.message || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch (err: unknown) {
      setSettingsError(
        err instanceof Error ? err.message : "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  const applyPreset = (preset: { title: string; subtitle: string }) => {
    setCalTitle(preset.title);
    setCalSubtitle(preset.subtitle);
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
                ক্যালেন্ডার ও প্রিন্ট শিরোনাম সেটিংস
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                এখানে সেট করা টাইটেল ও সাবটাইটেল সরাসরি ক্যালেন্ডার পেইজ (/calendar) এবং প্রিন্ট পেইজ (/print/calendar)-এ সিঙ্ক হয়ে যাবে।
              </CardDescription>
            </div>
            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
                onClick={() =>
                  applyPreset({
                    title: "স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী",
                    subtitle: "এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন",
                  })
                }
              >
                🎓 এইচএসসি ২০২৬
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
                onClick={() =>
                  applyPreset({
                    title: "স্কয়ার বিশ্ববিদ্যালয় ও ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা সময়সূচী ২০২৬",
                    subtitle: "এডমিশন টেস্ট ও ভর্তি পরীক্ষার চূড়ান্ত ক্যালেন্ডার",
                  })
                }
              >
                🏛️ এডমিশন ২০২৬
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {settingsSuccess && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
                <TickCircle className="size-4 shrink-0" />
                শিরোনাম ও উপ-শিরোনাম ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে!
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
                  ক্যালেন্ডার ও প্রিন্ট প্রধান শিরোনাম (Title)
                </Label>
                <Input
                  id="cal-title"
                  value={calTitle}
                  onChange={(e) => setCalTitle(e.target.value)}
                  placeholder="যেমন: স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-subtitle" className="text-xs font-bold">
                  উপ-শিরোনাম (Subtitle)
                </Label>
                <Input
                  id="cal-subtitle"
                  value={calSubtitle}
                  onChange={(e) => setCalSubtitle(e.target.value)}
                  placeholder="যেমন: এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="font-bold shadow-xs px-6 rounded-xl cursor-pointer"
              >
                {isSavingSettings ? (
                  <>
                    <Spinner className="mr-2" /> সেভ হচ্ছে...
                  </>
                ) : (
                  "শিরোনাম সেভ করুন"
                )}
              </Button>
            </div>
          </div>
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

              {batchesList.length > 1 && (
                <div className="space-y-1.5">
                  <Label htmlFor="batch-select">ব্যাচ নির্বাচন করুন</Label>
                  <select
                    id="batch-select"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {batchesList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
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
