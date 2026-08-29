"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ArrowLeft2, Download, Edit } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getCalendarSettings, getExamRoutines } from "@/lib/actions/routine";
import { EXAMS } from "@/lib/routine";
import type { CalendarSettings, Exam, ExamRoutine } from "@/types";

function PrintCalendarContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const paramTitle = searchParams.get("title");
  const paramSubtitle = searchParams.get("subtitle");

  const [title, setTitle] = useState(paramTitle || "");
  const [subtitle, setSubtitle] = useState(paramSubtitle || "");

  const { data: calSettings } = useQuery<CalendarSettings>({
    queryKey: ["calendar-settings"],
    queryFn: () => getCalendarSettings(),
  });

  useEffect(() => {
    if (paramTitle) {
      setTitle(paramTitle);
    } else if (calSettings?.printTitle) {
      setTitle(calSettings.printTitle);
    } else if (!title) {
      setTitle("স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী");
    }

    if (paramSubtitle) {
      setSubtitle(paramSubtitle);
    } else if (calSettings?.printSubtitle) {
      setSubtitle(calSettings.printSubtitle);
    } else if (!subtitle) {
      setSubtitle("এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন");
    }
  }, [calSettings, paramTitle, paramSubtitle]);

  const { data: dbRoutines = [] } = useQuery<ExamRoutine[]>({
    queryKey: ["exam-routines"],
    queryFn: () => getExamRoutines(),
  });

  const allExams: Exam[] =
    dbRoutines.length > 0
      ? dbRoutines.map((r) => {
          const dateObj = new Date(r.examDate);
          const formattedDate = dateObj.toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          return {
            id: r.id,
            subject: r.subject,
            title: r.title,
            date: formattedDate,
            dateObj,
            countdown: `${Math.max(
              0,
              Math.ceil(
                (dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              ),
            )} দিন`,
          };
        })
      : (EXAMS as Exam[]);

  const filteredExams = search
    ? allExams.filter((exam) =>
        exam.subject.toLowerCase().includes(search.toLowerCase()),
      )
    : allExams;

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  useEffect(() => {
    // Optional auto trigger print if query param has autoprint
    if (searchParams.get("autoprint") === "true") {
      const timer = setTimeout(() => {
        handlePrint();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchParams, handlePrint]);

  const setPreset = (presetTitle: string, presetSubtitle: string) => {
    setTitle(presetTitle);
    setSubtitle(presetSubtitle);
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-4 print:py-0 text-black font-sans">
      {/* Top Action Header & Controls (hidden in print) */}
      <div className="flex flex-col gap-4 pb-6 mb-6 border-b print:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/calendar">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl cursor-pointer">
              <ArrowLeft2 className="size-4" /> ক্যালেন্ডারে ফিরুন
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="gap-1.5 rounded-xl font-bold px-5 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="size-4" /> প্রিন্ট করুন (Print / PDF)
            </Button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/40 rounded-2xl border border-border/60 text-xs">
          <span className="font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Edit className="size-3.5" /> দ্রুত রুটিন হেডার নির্বাচন:
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPreset(
                "স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী",
                "এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন",
              )
            }
            className="h-7 text-xs px-2.5 rounded-lg font-medium cursor-pointer"
          >
            🎓 এইচএসসি রুটিন
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPreset(
                "স্কয়ার বিশ্ববিদ্যালয় ও ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা সময়সূচী",
                "এডমিশন টেস্ট ও ভর্তি পরীক্ষার চূড়ান্ত ক্যালেন্ডার",
              )
            }
            className="h-7 text-xs px-2.5 rounded-lg font-medium cursor-pointer"
          >
            🏛️ এডমিশন ক্যালেন্ডার
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPreset(
                "স্কয়ার বিশেষ মডেল টেস্ট ও মূল্যায়ন পরীক্ষার সময়সূচী",
                "মডেল টেস্ট ও প্রস্তুতিমূলক মূল্যায়ন চূড়ান্ত রুটিন",
              )
            }
            className="h-7 text-xs px-2.5 rounded-lg font-medium cursor-pointer"
          >
            📝 স্পেশাল মডেল টেস্ট
          </Button>
          <span className="text-[11px] text-muted-foreground ml-auto italic">
            💡 নিচের শিরোনামে ক্লিক করে সরাসরি যেকোনো টেক্সট এডিট করতে পারেন
          </span>
        </div>
      </div>

      {/* Printable Sheet Header (Editable) */}
      <div className="text-center space-y-2 pb-6 border-b-2 border-black/80 mb-6">
        <div className="group relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ক্যালেন্ডারের শিরোনাম লিখুন..."
            aria-label="ক্যালেন্ডার শিরোনাম"
            className="w-full text-center text-2xl sm:text-3xl font-black tracking-tight text-black bg-transparent border border-transparent hover:border-dashed hover:border-zinc-400 focus:border-black focus:outline-hidden rounded-lg px-2 py-1 transition-all print:border-none print:p-0 print:text-center"
          />
        </div>

        <div className="group relative">
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="উপ-শিরোনাম লিখুন..."
            aria-label="ক্যালেন্ডার উপ-শিরোনাম"
            className="w-full text-center text-sm font-medium text-zinc-700 bg-transparent border border-transparent hover:border-dashed hover:border-zinc-400 focus:border-black focus:outline-hidden rounded-lg px-2 py-0.5 transition-all print:border-none print:p-0 print:text-center print:text-zinc-700"
          />
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-zinc-600 pt-1 font-medium">
          <span>মোট বিষয়: {filteredExams.length} টি</span>
          <span>•</span>
          <span>মুদ্রণ তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
        </div>
      </div>

      {/* Routine Table */}
      <table className="w-full text-left text-sm border-collapse border border-black/60">
        <thead>
          <tr className="bg-zinc-100 border-b border-black/60">
            <th className="py-2.5 px-4 font-bold border-r border-black/60 w-16 text-center">
              ক্রম
            </th>
            <th className="py-2.5 px-4 font-bold border-r border-black/60">
              বিষয়ের নাম ও পত্র
            </th>
            <th className="py-2.5 px-4 font-bold border-r border-black/60">
              পরীক্ষার তারিখ
            </th>
            <th className="py-2.5 px-4 font-bold text-right">সময় / মন্তব্য</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/40">
          {filteredExams.map((exam, idx) => (
            <tr key={exam.id} className="border-b border-black/40">
              <td className="py-2.5 px-4 text-center font-medium border-r border-black/40">
                {idx + 1}
              </td>
              <td className="py-2.5 px-4 font-bold border-r border-black/40">
                {exam.subject}
              </td>
              <td className="py-2.5 px-4 font-medium border-r border-black/40">
                {exam.date}
              </td>
              <td className="py-2.5 px-4 text-right font-medium">
                সকাল ১০:০০ - ১:০০
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Footer */}
      <div className="mt-8 pt-4 border-t border-black/40 flex items-center justify-between text-xs text-zinc-600">
        <span>স্কয়ার অনলাইন লার্নিং প্ল্যাটফর্ম • square.ac</span>
        <span>পৃষ্ঠা ১ / ১</span>
      </div>
    </div>
  );
}

export default function PrintCalendarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">লোড হচ্ছে...</div>}>
      <PrintCalendarContent />
    </Suspense>
  );
}
