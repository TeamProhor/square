import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft2,
  BookOpen,
  CalendarTick,
  Clock,
  FileDown,
  Information,
  Send,
  TaskSquare,
  TickCircle,
} from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getUserCourseById } from "@/lib/actions/course";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyCourseClassroomPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    redirect(`/login?callbackUrl=/my-courses/${id}`);
  }

  const res = await getUserCourseById(userId, id);
  const course = res.data;

  if (!course) {
    notFound();
  }

  const details = course.details;
  const modules = course.modules || [];
  const batches = course.batches || [];
  const instructors = course.instructors || [];
  const faqs = course.faqs || [];

  const allExams = batches.flatMap((batch) =>
    (batch.batchExams || []).map((be) => ({
      ...be,
      batchName: batch.name,
    })),
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-12 sm:pb-24 pt-0 sm:pt-2 md:pt-4 gap-4 sm:gap-8 px-1 sm:px-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b pb-3 sm:pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Link
              href="/my-courses"
              className="inline-flex items-center justify-center size-7 sm:size-8 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-0.5"
              title="আমার কোর্সসমূহে ফিরুন"
            >
              <ArrowLeft2 className="size-3.5 sm:size-4" />
            </Link>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              {course.title}
            </h1>
            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              {course.hscBatch}
            </span>
            {course.badge && (
              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-bold bg-muted text-foreground border border-border/60">
                {course.badge}
              </span>
            )}
          </div>
          {course.subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              {course.subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {details?.telegramGroupUrl && (
            <a
              href={details.telegramGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="rounded-xl h-8 sm:h-9 px-3 text-xs font-semibold gap-1.5 bg-[#229ED9] hover:bg-[#1E8BC0] text-white shadow-xs"
              >
                <Send className="size-3 sm:size-3.5" />
                টেলিগ্রাম গ্রুপ
              </Button>
            </a>
          )}

          {details?.routinePdfUrl && (
            <a
              href={details.routinePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-8 sm:h-9 px-3 text-xs font-semibold gap-1.5 border-border/70 shadow-xs"
              >
                <FileDown className="size-3 sm:size-3.5 text-primary" />
                রুটিন (PDF)
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Classroom Content Tabs */}
      <Tabs defaultValue="exams" className="w-full space-y-4 sm:space-y-6">
        <div className="w-full border-b pb-2 overflow-x-auto no-scrollbar">
          <TabsList className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 bg-transparent p-0 h-auto min-w-max mx-auto">
            <TabsTrigger
              value="exams"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[8px] font-medium text-xs sm:text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:font-semibold transition-colors shrink-0 whitespace-nowrap"
            >
              <CalendarTick className="size-3.5 sm:size-4 shrink-0 text-primary" />
              <span>পরীক্ষাসমূহ</span>
              <span className="bg-primary/10 text-primary font-bold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-[6px]">
                {allExams.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="syllabus"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[8px] font-medium text-xs sm:text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:font-semibold transition-colors shrink-0 whitespace-nowrap"
            >
              <BookOpen className="size-3.5 sm:size-4 shrink-0 text-primary" />
              <span>সিলেবাস ও মডিউল</span>
              {modules.length > 0 && (
                <span className="bg-muted text-muted-foreground font-bold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-[6px]">
                  {modules.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[8px] font-medium text-xs sm:text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:font-semibold transition-colors shrink-0 whitespace-nowrap"
            >
              <Information className="size-3.5 sm:size-4 shrink-0 text-primary" />
              <span>কোর্স বিস্তারিত</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Course Exams */}
        <TabsContent value="exams" className="space-y-4 focus-visible:outline-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 border-b gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <CalendarTick className="size-5 text-primary" />
                  কোর্সের অনলাইন পরীক্ষাসমূহ
                </h2>
                {allExams.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                    {allExams.length} টি পরীক্ষা
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                আপনার ব্যাচে নির্ধারিত সকল অধ্যায়ভিত্তিক টেস্ট ও মডেল টেস্ট দিন
              </p>
            </div>
            <Link href="/exams">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-semibold hover:bg-primary/10 w-fit -ml-2 sm:ml-0"
              >
                সকল পরীক্ষা দেখুন &rarr;
              </Button>
            </Link>
          </div>

          {allExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {allExams.map((be) => {
                const exam = be.exam;
                if (!exam) return null;

                const examTypeLabel =
                  exam.type === "chapter_test"
                    ? "অধ্যায়ভিত্তিক পরীক্ষা"
                    : exam.type === "model_test"
                      ? "মডেল টেস্ট"
                      : exam.type === "weekly"
                        ? "উইকলি এক্সাম"
                        : "প্র্যাকটিস টেস্ট";

                return (
                  <div
                    key={be.id}
                    className="group/exam border border-border/60 rounded-2xl p-4 sm:p-5 bg-card flex flex-col justify-between gap-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold bg-primary/10 text-primary border border-primary/20">
                          {examTypeLabel}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {be.batchName}
                        </span>
                      </div>

                      <h3 className="font-bold text-base sm:text-lg leading-snug group-hover/exam:text-primary transition-colors">
                        {exam.title}
                      </h3>

                      {exam.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {exam.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                        <span className="inline-flex items-center gap-1.5 font-medium bg-muted/40 px-2.5 py-1 rounded-lg border border-border/40">
                          <TaskSquare className="size-3.5 text-primary shrink-0" />
                          {exam.totalMarks} Marks
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium bg-muted/40 px-2.5 py-1 rounded-lg border border-border/40">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          {exam.durationMinutes} Min
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {be.startsAt
                          ? `শুরু: ${new Date(be.startsAt).toLocaleDateString("bn-BD")}`
                          : "যেকোনো সময়"}
                      </span>
                      <Link href={`/exams/${exam.slug}`}>
                        <Button
                          size="sm"
                          className="rounded-xl px-4 text-xs font-semibold h-9"
                        >
                          পরীক্ষা দিন &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 border border-dashed rounded-2xl text-center text-muted-foreground bg-muted/10 space-y-2">
              <CalendarTick className="size-8 text-muted-foreground mx-auto" />
              <p className="font-semibold text-sm text-foreground">
                এই কোর্সের জন্য বর্তমানে কোনো পরীক্ষা নির্ধারিত নেই
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                নতুন অধ্যায়ভিত্তিক পরীক্ষা ও মডেল টেস্ট যুক্ত হলে এখানে দেখতে পাবেন।
              </p>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Syllabus & Modules */}
        <TabsContent value="syllabus" className="space-y-4 focus-visible:outline-none">
          <div className="flex items-center justify-between pb-1 border-b">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                কোর্স সিলেবাস ও মডিউল
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                মোট {modules.length} টি মডিউলের বিস্তারিত রূপরেখা
              </p>
            </div>
          </div>

          {modules.length > 0 ? (
            <div className="space-y-3">
              {modules.map((m, index) => (
                <div
                  key={m.id || index}
                  className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="size-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base">
                        {m.title}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/40 w-fit">
                      {m.totalClasses} টি ক্লাস
                    </span>
                  </div>

                  {m.chapters && m.chapters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-border/40">
                      {m.chapters.map((chapter) => (
                        <div
                          key={chapter}
                          className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/30 flex items-center gap-2"
                        >
                          <span className="size-1.5 rounded-full bg-primary shrink-0" />
                          <span className="font-medium text-foreground/90">
                            {chapter}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-dashed rounded-2xl text-center text-muted-foreground bg-muted/10 space-y-2">
              <BookOpen className="size-8 text-muted-foreground mx-auto" />
              <p className="font-semibold text-sm text-foreground">
                সিলেবাস তথ্য শীঘ্রই যুক্ত হবে
              </p>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Course Overview, Instructors & FAQ */}
        <TabsContent value="overview" className="space-y-8 focus-visible:outline-none">
          {/* Course Features */}
          {course.features && course.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold pb-1 border-b flex items-center gap-2">
                <TickCircle className="size-5 text-emerald-500" />
                কোর্সের অন্তর্ভুক্ত সুবিধাসমূহ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-card border border-border/60 text-xs sm:text-sm font-medium"
                  >
                    <TickCircle className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructors */}
          {instructors.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold pb-1 border-b">
                ইন্সট্রাক্টরবৃন্দ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {instructors.map((ins) => (
                  <div
                    key={`${ins.name}-${ins.institution}`}
                    className="border border-border/60 rounded-xl p-4 bg-card flex items-center gap-3.5"
                  >
                    {ins.image ? (
                      <div className="relative size-12 rounded-full overflow-hidden bg-muted shrink-0 border">
                        <Image
                          src={ins.image}
                          alt={ins.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="size-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0">
                        {ins.name.charAt(0)}
                      </div>
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-sm truncate">{ins.name}</h4>
                      <p className="text-xs text-primary font-medium">{ins.role}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {ins.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold pb-1 border-b flex items-center gap-2">
                <Information className="size-5 text-primary" />
                সাধারণ জিজ্ঞাসাসমূহ (FAQ)
              </h2>
              <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border/60">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, idx) => (
                    <AccordionItem
                      key={faq.question}
                      value={`faq-${idx}`}
                      className="border-border/50 py-0.5"
                    >
                      <AccordionTrigger className="text-left font-bold text-foreground text-xs sm:text-sm hover:no-underline py-3 cursor-pointer">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed pt-1 pb-3">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

