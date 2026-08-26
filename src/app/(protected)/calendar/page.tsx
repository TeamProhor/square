"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarTick as CalendarIcon,
  Clock,
  Download,
  Filter,
  Search,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getExamRoutines } from "@/lib/actions/routine";
import { EXAMS } from "@/lib/routine";
import type { Exam, ExamRoutine } from "@/types";

const _handlePrint = () => {
  if (typeof window !== "undefined") {
    window.print();
  }
};

export default function CalendarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data: dbRoutines = [] } = useQuery<ExamRoutine[]>({
    queryKey: ["exam-routines"],
    queryFn: () => getExamRoutines(),
  });

  // Combine dynamic DB routines with static fallback routine
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

  const examDates = allExams
    .map((exam) => exam.dateObj)
    .filter(Boolean) as Date[];

  const filteredExams = allExams.filter((exam) =>
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Target the earliest upcoming exam date
  const firstExamDate =
    examDates.length > 0
      ? new Date(Math.min(...examDates.map((d) => d.getTime())))
      : new Date(2026, 5, 21);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +firstExamDate - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [firstExamDate]);

  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-5xl mx-auto w-full gap-6 sm:gap-8 px-2 sm:px-4 md:px-6">
      {/* Live Countdown Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-none shadow-xl relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute -top-10 -right-10 opacity-10">
          <Clock
            className="size-64 animate-spin"
            style={{ animationDuration: "60s" }}
          />
        </div>
        <CardContent className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-center relative z-10">
          <div className="lg:col-span-2 flex flex-col gap-1.5 sm:gap-2 text-center lg:text-left items-center lg:items-start">
            <span className="text-[11px] sm:text-xs uppercase font-bold text-primary-foreground/90 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-400 animate-ping" />{" "}
              লাইভ কাউন্টডাউন
            </span>
            <h2 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
              বোর্ড পরীক্ষা শুরু হতে বাকি:
            </h2>
            <p className="text-xs text-primary-foreground/80">
              প্রথম পরীক্ষা: {allExams[0]?.subject || "বাংলা ১ম পত্র"} (
              {allExams[0]?.date || "২১ জুন, ২০২৬ ইং"})
            </p>
          </div>
          {/* Timer Display Grid */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm">
              <div className="flex flex-col items-center bg-background/20 rounded-xl p-2 sm:p-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-medium mt-0.5 sm:mt-1">
                  দিন
                </span>
              </div>
              <div className="flex flex-col items-center bg-background/20 rounded-xl p-2 sm:p-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-medium mt-0.5 sm:mt-1">
                  ঘণ্টা
                </span>
              </div>
              <div className="flex flex-col items-center bg-background/20 rounded-xl p-2 sm:p-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-medium mt-0.5 sm:mt-1">
                  মিনিট
                </span>
              </div>
              <div className="flex flex-col items-center bg-background/20 rounded-xl p-2 sm:p-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-medium mt-0.5 sm:mt-1">
                  সেকেন্ড
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Interactive Calendar & Full Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column: Interactive Mini Calendar */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm border-muted-foreground/10 rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="size-4 text-primary" /> পরীক্ষার দিনপঞ্জি
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex justify-center">
              <Calendar
                mode="multiple"
                selected={examDates}
                className="rounded-md"
              />
            </CardContent>
            <div className="p-3 bg-muted/20 border-t flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-primary inline-block" />
              <span>হাইলাইট করা তারিখগুলো পরীক্ষার দিন নির্দেশ করে</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Routine Filter Table */}
        <Card className="lg:col-span-2 flex flex-col shadow-sm border-muted-foreground/10 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b bg-muted/20">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="size-5 text-primary" /> এইচএসসি ২০২৬ চূড়ান্ত
                রুটিন
              </CardTitle>
              <CardDescription className="mt-1">
                সবগুলো পরীক্ষা একই সূচীতে দেখে নিন সহজে
              </CardDescription>
            </div>
            {/* Interactive Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="বিষয়ের নাম বা পত্র লিখুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background shadow-sm rounded-xl"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-bold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
                    বিষয়ের নাম ও পত্র
                  </TableHead>
                  <TableHead className="font-bold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
                    পরীক্ষার তারিখ
                  </TableHead>
                  <TableHead className="text-right font-bold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
                    কাউন্টডাউন
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id} className="hover:bg-muted/20">
                    <TableCell className="font-semibold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
                      {exam.subject}
                    </TableCell>
                    <TableCell className="text-muted-foreground p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm">
                      {exam.date}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm">
                      {exam.countdown}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExams.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center p-8 text-muted-foreground text-sm"
                    >
                      কোনো পরীক্ষা পাওয়া যায়নি।
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>

          <div className="p-4 bg-muted/20 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                সর্বমোট পরীক্ষা সংখ্যা:
              </span>
              <span className="text-xs font-bold text-foreground">
                {allExams.length} টি
              </span>
            </div>
            <Link
              href={
                searchTerm
                  ? `/print/calendar?search=${encodeURIComponent(searchTerm)}&autoprint=true`
                  : `/print/calendar?autoprint=true`
              }
              target="_blank"
            >
              <Button
                variant="outline"
                size="sm"
                className="bg-background shadow-sm hover:bg-muted rounded-xl w-full sm:w-auto"
              >
                <Download className="size-3.5 mr-1.5" /> রুটিন প্রিন্ট করুন
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
