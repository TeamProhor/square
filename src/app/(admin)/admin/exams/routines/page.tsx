"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarTick, Clock, Flash, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type CreateRoutinePayload,
  createExamRoutine,
  deleteExamRoutine,
  getBatches,
  getExamRoutines,
} from "@/lib/actions/routine";
import type { Batch, ExamRoutine } from "@/types";

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

  const { data: batchesList = [] } = useQuery<Batch[]>({
    queryKey: ["admin-batches"],
    queryFn: () => getBatches(),
  });

  const { data: routines = [], isLoading } = useQuery<ExamRoutine[]>({
    queryKey: ["admin-routines", selectedBatch],
    queryFn: () => getExamRoutines(selectedBatch),
  });

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
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
            <CalendarTick className="size-7 sm:size-8 text-primary" />
            পরীক্ষার রুটিন ও ক্যালেন্ডার ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            বোর্ড ও ব্যাচ পরীক্ষার রুটিন তৈরি ও সম্পাদনা করুন।
          </p>
        </div>

        <ResponsiveDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          trigger={
            <Button className="rounded-full shadow-xs gap-1.5 h-10 px-5 font-semibold">
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
