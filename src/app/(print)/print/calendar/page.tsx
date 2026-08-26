"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import { ArrowLeft2, Download } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getExamRoutines } from "@/lib/actions/routine";
import { EXAMS } from "@/lib/routine";
import type { Exam, ExamRoutine } from "@/types";

function PrintCalendarContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

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

  return (
    <div className="max-w-4xl mx-auto w-full py-4 print:py-0 text-black">
      {/* Top Action Header (hidden in print) */}
      <div className="flex items-center justify-between gap-3 pb-6 mb-6 border-b print:hidden">
        <Link href="/calendar">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
            <ArrowLeft2 className="size-4" /> ক্যালেন্ডারে ফিরুন
          </Button>
        </Link>
        <Button
          onClick={handlePrint}
          size="sm"
          className="gap-1.5 rounded-xl font-bold px-5 shadow-xs"
        >
          <Download className="size-4" /> প্রিন্ট করুন (Print / PDF)
        </Button>
      </div>

      {/* Printable Sheet Header */}
      <div className="text-center space-y-1.5 pb-6 border-b-2 border-black/80 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
          স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী
        </h1>
        <p className="text-sm font-medium text-zinc-700">
          এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন
        </p>
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
