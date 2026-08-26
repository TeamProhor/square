import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight2,
  BookOpen,
  Calendar,
  CalendarTick,
  DocumentDownload,
  Flash,
  StatusUp,
  TaskSquare,
  TickCircle,
  Trophy,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import {
  courseEnrollments,
  courses,
  examRoutines,
  examSubmissions,
  exams,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const userId = user?.id;

  // 1. Fetch Question Banks
  const containers = await db.query.containers.findMany({
    limit: 4,
    orderBy: (containers, { asc }) => [asc(containers.createdAt)],
  });

  // 2. Fetch User's Enrolled Courses
  let userEnrolledCourses: (typeof courses.$inferSelect)[] = [];
  if (userId) {
    const enrollments = await db
      .select({
        id: courseEnrollments.id,
        status: courseEnrollments.status,
        enrolledAt: courseEnrollments.enrolledAt,
        course: courses,
      })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.userId, userId));

    userEnrolledCourses = enrollments.map((e) => e.course);
  }

  // 3. If user has no enrollments, fetch popular courses to show
  const featuredCourses =
    userEnrolledCourses.length > 0
      ? userEnrolledCourses.slice(0, 3)
      : await db
          .select()
          .from(courses)
          .where(eq(courses.isPublished, true))
          .limit(3);

  // 4. Fetch User's Exam Submissions & Activity Stats
  let examsTakenCount = 0;
  let averageScore = 0;
  if (userId) {
    const submissions = await db
      .select()
      .from(examSubmissions)
      .where(eq(examSubmissions.userId, userId));

    examsTakenCount = submissions.filter(
      (s) => s.status === "submitted",
    ).length;
    if (examsTakenCount > 0) {
      const totalPercentage = submissions
        .filter((s) => s.status === "submitted")
        .reduce((acc, curr) => {
          const score = parseFloat(curr.score || "0");
          const total = curr.totalMarks || 1;
          return acc + (score / total) * 100;
        }, 0);
      averageScore = Math.round(totalPercentage / examsTakenCount);
    }
  }

  // 5. Fetch Upcoming / Live Exams
  const liveExams = await db
    .select()
    .from(exams)
    .where(eq(exams.isPublished, true))
    .orderBy(desc(exams.createdAt))
    .limit(3);

  // 6. Fetch Upcoming Routines
  const upcomingRoutines = await db
    .select()
    .from(examRoutines)
    .orderBy(desc(examRoutines.examDate))
    .limit(3);

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(
      /[0-9]/g,
      (digit) => bnDigits[Number(digit)] || digit,
    );
  };

  const featureCards = [
    {
      title: "প্রশ্নব্যাংক",
      description: "অধ্যায় ও টপিকভিত্তিক হাজারো MCQ এবং সৃজনশীল সমাধান",
      href: "/qb",
      icon: TaskSquare,
      iconBg:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      badge: "জনপ্রিয়",
    },
    {
      title: "পরীক্ষা ও টেস্ট",
      description: "অনলাইন লাইভ এক্সাম ও সেলফ অ্যাসেসমেন্ট দিয়ে প্রস্তুতি যাচাই",
      href: "/exams",
      icon: CalendarTick,
      iconBg:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      badge: "লাইভ",
    },
    {
      title: "পিডিএফ রিসোর্স",
      description: "বাছাইকৃত হ্যান্ডনোট, ফর্মুলা শিট ও এক্সক্লুসিভ সাজেশনস",
      href: "/pdf",
      icon: DocumentDownload,
      iconBg:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      badge: "ফ্রি নোটস",
    },
    {
      title: "ইনস্ট্যান্ট পোল",
      description: "বোর্ড ও এডমিশন স্ট্যান্ডার্ড দ্রুত কুইজ সলভিং প্র্যাকটিস",
      href: "/poll",
      icon: StatusUp,
      iconBg:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      badge: "কুইক সলভ",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-16 pt-1 sm:pt-4 md:py-6 gap-6 sm:gap-8 px-2 sm:px-4 md:px-6">
      {/* ─── Hero Welcome Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 p-4 sm:p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-end gap-3 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button
              asChild
              className="rounded-xl px-5 h-10 sm:h-11 text-xs sm:text-sm font-bold shadow-xs flex-1 sm:flex-initial"
            >
              <Link href="/exams">
                <CalendarTick className="size-4 mr-2" /> পরীক্ষা দিন
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl px-5 h-10 sm:h-11 text-xs sm:text-sm font-bold flex-1 sm:flex-initial"
            >
              <Link href="/qb">
                <TaskSquare className="size-4 mr-2" /> প্রশ্নব্যাংক
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Metric & Activity Highlights ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              এনরোল্ড কোর্স
            </span>
            <div className="size-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {toBanglaDigits(userEnrolledCourses.length)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              সক্রিয় কোর্সসমূহ
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              পরীক্ষা সম্পন্ন
            </span>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TickCircle className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {toBanglaDigits(examsTakenCount)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              অংশগ্রহণকৃত পরীক্ষা
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              গড় একিউরেসি
            </span>
            <div className="size-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {examsTakenCount > 0 ? `${toBanglaDigits(averageScore)}%` : "--"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              সামগ্রিক পারফরম্যান্স
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              প্রশ্নব্যাংক
            </span>
            <div className="size-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flash className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {toBanglaDigits(containers.length)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ক্যাটাগরি উপলব্ধ
            </p>
          </div>
        </div>
      </div>

      {/* ─── Core Learning Hub Grid ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              লার্নিং হাব ও রিসোর্স
            </h2>
            <p className="text-xs text-muted-foreground">
              আপনার প্রয়োজনীয় ফিচার দ্রুত অ্যাক্সেস করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className="group">
                <Card className="h-full border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 rounded-[22px] overflow-hidden">
                  <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full gap-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`size-11 rounded-2xl flex items-center justify-center border ${card.iconBg}`}
                      >
                        <Icon className="size-5.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {card.title}
                        <ArrowRight2 className="size-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Two-Column Section: Live Exams & Exam Schedule ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Live / Active Exams */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-foreground">
                চলমান পরীক্ষাসমূহ
              </h2>
            </div>
            <Link
              href="/exams"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              সকল পরীক্ষা <ArrowRight2 className="size-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {liveExams.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 text-muted-foreground text-xs">
                বর্তমানে কোনো প্রকাশিত পরীক্ষা নেই
              </div>
            ) : (
              liveExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                        {exam.type === "practice" ? "প্র্যাকটিস" : "মডেল টেস্ট"}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        সময়: {toBanglaDigits(exam.durationMinutes)} মিনিট
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      মোট মার্কস: {toBanglaDigits(exam.totalMarks)} • নেগেটিভ:{" "}
                      {toBanglaDigits(exam.negativeMarking)}
                    </p>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl font-bold text-xs h-9 px-4 shrink-0 shadow-xs"
                  >
                    <Link href={`/exams/${exam.slug}`}>অংশ নিন</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Exam Routine */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="size-4.5 text-primary" /> আসন্ন পরীক্ষার রুটিন
            </h2>
            <Link
              href="/calendar"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              ক্যালেন্ডার <ArrowRight2 className="size-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingRoutines.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 text-muted-foreground text-xs">
                কোনো আসন্ন পরীক্ষার রুটিন যোগ করা হয়নি
              </div>
            ) : (
              upcomingRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card shadow-2xs flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">
                        {routine.subject}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        • {routine.examDate.toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                      {routine.title}
                    </h3>
                    {routine.syllabus && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        সিলেবাস: {routine.syllabus}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary block">
                      {toBanglaDigits(routine.totalMarks)} মার্কস
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {toBanglaDigits(routine.durationMinutes)} মিনিট
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Courses Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {userEnrolledCourses.length > 0
                ? "আমার কোর্সসমূহ"
                : "জনপ্রিয় ও প্রস্তাবিত কোর্স"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {userEnrolledCourses.length > 0
                ? "চলমান কোর্সের ক্লাসে অংশগ্রহণ করুন"
                : "আপনার একাডেমিক ও এডমিশন প্রস্তুতির কোর্সসমূহ"}
            </p>
          </div>
          <Link
            href={userEnrolledCourses.length > 0 ? "/my-courses" : "/#courses"}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            সকল কোর্স <ArrowRight2 className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredCourses.map((course) => (
            <Card
              key={course.id}
              className="bg-card rounded-[22px] overflow-hidden border border-border/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-0 group"
            >
              {course.image && (
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    alt={course.title}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={course.image}
                    width={500}
                    height={280}
                    unoptimized
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-1">
                    ব্যাচ: {course.hscBatch}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-foreground line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <span className="text-base font-black text-foreground">
                    ৳{toBanglaDigits(course.price)}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl font-bold text-xs h-8.5 px-4 shadow-xs"
                  >
                    <Link
                      href={
                        userEnrolledCourses.some((c) => c.id === course.id)
                          ? `/my-courses/${course.id}`
                          : `/courses/${course.slug}`
                      }
                    >
                      {userEnrolledCourses.some((c) => c.id === course.id)
                        ? "কোর্সে প্রবেশ"
                        : "বিস্তারিত দেখুন"}
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── Question Banks Quick Selector ────────────────────────────────────── */}
      {containers.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                প্রশ্নব্যাংক সংকলন
              </h2>
              <p className="text-xs text-muted-foreground">
                অধ্যায় ও টপিকভিত্তিক প্রশ্ন সরাসরি সমাধান করুন
              </p>
            </div>
            <Link
              href="/qb"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              সকল প্রশ্নব্যাংক <ArrowRight2 className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {containers.map((qb) => (
              <Link href={`/qb/${qb.slug}`} key={qb.id} className="group">
                <div className="rounded-2xl p-4 md:p-5 border border-border/70 bg-card hover:border-primary/50 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[105px] gap-1.5">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TaskSquare className="size-4" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {qb.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
