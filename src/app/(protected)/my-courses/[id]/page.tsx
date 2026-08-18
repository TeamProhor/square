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
  TickCircle,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-16 sm:pb-24 pt-0 sm:pt-2 md:pt-4 gap-6 sm:gap-8 px-3 sm:px-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/my-courses"
              className="inline-flex items-center justify-center size-8 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-1"
              title="আমার কোর্সসমূহে ফিরুন"
            >
              <ArrowLeft2 className="size-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {course.title}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              {course.hscBatch}
            </span>
            {course.badge && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-muted text-foreground border border-border/60">
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
        <div className="flex flex-wrap items-center gap-2.5">
          {details?.telegramGroupUrl && (
            <a
              href={details.telegramGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="rounded-xl h-9 px-3.5 text-xs font-semibold gap-1.5 bg-[#229ED9] hover:bg-[#1E8BC0] text-white shadow-xs"
              >
                <Send className="size-3.5" />
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
                className="rounded-xl h-9 px-3.5 text-xs font-semibold gap-1.5 border-border/70 shadow-xs"
              >
                <FileDown className="size-3.5 text-primary" />
                রুটিন (PDF)
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Course Exams Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 border-b gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <CalendarTick className="size-5 text-primary" />
                কোর্সের অনলাইন পরীক্ষাসমূহ
              </h2>
              {batches.flatMap((b) => b.batchExams || []).length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                  {batches.flatMap((b) => b.batchExams || []).length} টি পরীক্ষা
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

        {batches.flatMap((b) => b.batchExams || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {batches.flatMap((batch) =>
              (batch.batchExams || []).map((be) => {
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
                    className="group/exam border border-border/70 rounded-2xl p-4 sm:p-5 bg-card flex flex-col justify-between gap-4 shadow-2xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold bg-primary/10 text-primary border border-primary/20">
                          {examTypeLabel}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {batch.name}
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

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1.5 font-medium bg-muted/50 px-2 py-0.5 rounded-md border border-border/30">
                          <TaskSquare className="size-3.5 text-primary shrink-0" />
                          {exam.totalMarks} Marks
                        </span>
                        <span className="flex items-center gap-1.5 font-medium bg-muted/50 px-2 py-0.5 rounded-md border border-border/30">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          {exam.durationMinutes} Min
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {be.startsAt
                          ? `শুরু: ${new Date(be.startsAt).toLocaleDateString("bn-BD")}`
                          : "যেকোনো সময়"}
                      </span>
                      <Link href={`/exams/${exam.slug}`}>
                        <Button
                          size="sm"
                          className="rounded-xl px-4 text-xs font-semibold h-9 shadow-xs"
                        >
                          পরীক্ষা দিন &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              }),
            )}
          </div>
        ) : (
          <div className="p-8 border border-dashed rounded-2xl text-center text-muted-foreground bg-muted/10 space-y-2">
            <CalendarTick className="size-8 text-muted-foreground mx-auto" />
            <p className="font-semibold text-sm text-foreground">
              এই কোর্সের জন্য বর্তমানে কোনো পরীক্ষা নির্ধারিত নেই
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              নতুন অধ্যায়ভিত্তিক পরীক্ষা ও মডেল টেস্ট যুক্ত হলে এখানে দেখতে পাবেন।
            </p>
          </div>
        )}
      </div>

      {/* Course Syllabus / Modules */}
      {modules.length > 0 && (
        <div className="space-y-4">
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

          <div className="space-y-3">
            {modules.map((m, index) => (
              <div
                key={m.id || index}
                className="border border-border/70 rounded-xl p-4 sm:p-5 bg-card shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="size-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base">{m.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/40 w-fit">
                    {m.totalClasses} টি ক্লাস
                  </span>
                </div>

                {m.chapters && m.chapters.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-border/40">
                    {m.chapters.map((chapter, cIdx) => (
                      <div
                        key={cIdx}
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
        </div>
      )}

      {/* Course Features */}
      {course.features && course.features.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold pb-1 border-b flex items-center gap-2">
            <TickCircle className="size-5 text-emerald-500" />
            কোর্সের অন্তর্ভুক্ত সুবিধাসমূহ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.features.map((feat, idx) => (
              <div
                key={idx}
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
            {instructors.map((ins, idx) => (
              <div
                key={idx}
                className="border border-border/60 rounded-xl p-4 bg-card flex items-center gap-3.5 shadow-2xs"
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
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-card border border-border/60 space-y-1.5"
              >
                <h4 className="font-bold text-sm text-foreground">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
