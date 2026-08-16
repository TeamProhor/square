import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import {
  ArrowLeft2,
  CalendarTick,
  Clock,
  Flame,
  Information,
  ShieldCheck,
  Star,
  User,
} from "@/components/icons";
import { LandingFooter, LandingHeader } from "@/components/landing-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { COURSES, getCourseBySlug } from "@/lib/courses";

interface CourseDetailPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateStaticParams() {
  return COURSES.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground transition-colors duration-300">
      <LandingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 w-full flex flex-col gap-8 md:gap-12">
        {/* Back Link */}
        <div>
          <Link
            href="/#courses-section"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="p-1 rounded-lg border border-border/80 group-hover:border-primary/50 group-hover:text-primary transition-all">
              <ArrowLeft2 className="size-3.5" />
            </div>
            <span>সকল কোর্সে ফিরে যান</span>
          </Link>
        </div>

        {/* Course Header & Hero (Crosshair Grid Layout) */}
        <div className="relative border-y border-border/80">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-px bg-border -top-px left-1/2 w-screen -translate-x-1/2"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/80">
            {/* Left Column: Details & Overview (Span 7) */}
            <div className="lg:col-span-7 p-5 sm:p-6 md:p-8 flex flex-col justify-between gap-6 bg-card dark:bg-[radial-gradient(50%_60%_at_10%_0%,--theme(--color-foreground/.04),transparent)]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
                    {course.badge ?? course.hscBatch}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    <Star className="size-3 fill-amber-500 text-amber-500" /> স্পেশাল লাইভ ব্যাচ
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                {/* Key Features Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {course.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 bg-background/60 p-2.5 sm:p-3 rounded-xl border border-border/70"
                    >
                      <ShieldCheck className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructors Section */}
              <div className="pt-4 border-t border-border/60 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  মেন্টরস ও ইন্সট্রাক্টর
                </span>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {course.instructors.map((instructor) => (
                    <div
                      key={instructor.name}
                      className="flex items-center gap-2.5 bg-background/80 px-3 py-2 rounded-xl border border-border/70 shadow-2xs"
                    >
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <User className="size-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground leading-none">
                          {instructor.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {instructor.role} • {instructor.institution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Pricing & Enrollment Block (Span 5) */}
            <div className="lg:col-span-5 p-5 sm:p-6 md:p-8 flex flex-col justify-between gap-5 bg-card/60">
              <div className="space-y-4">
                {/* Course Banner Image */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/70 shadow-xs">
                  <img
                    alt={course.title}
                    src={course.image}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/60">
                    <Flame className="size-3 text-primary inline mr-1" /> লাইভ ক্লাস + এক্সাম
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-foreground">
                        ৳{course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ৳{course.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">এককালীন ফুল কোর্স ফি</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    সীমিত সময়ের অফার
                  </span>
                </div>

                {/* Schedule Quick Info */}
                <div className="space-y-2 bg-muted/40 p-3 rounded-xl border border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="size-3 text-primary" /> সময়কাল:
                    </span>
                    <span className="font-bold text-foreground text-xs">{course.routineInfo.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <CalendarTick className="size-3 text-primary" /> শিডিউল:
                    </span>
                    <span className="font-bold text-foreground text-xs">{course.routineInfo.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Flame className="size-3 text-primary" /> মোট ক্লাস ও পরীক্ষা:
                    </span>
                    <span className="font-bold text-foreground text-xs">
                      {course.routineInfo.totalClasses}+ ক্লাস • {course.routineInfo.totalExams}+ এক্সাম
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 rounded-xl text-xs sm:text-sm shadow-md"
                >
                  <Link href="/login">এখনই এনরোল করুন</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full font-bold py-4 rounded-xl text-foreground hover:bg-accent border-border/80 text-xs"
                >
                  <a href="https://t.me/shu_yaib" target="_blank" rel="noopener noreferrer">
                    ভর্তি সংক্রান্ত সহায়তা (টেলিগ্রাম)
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-px bg-border -bottom-px left-1/2 w-screen -translate-x-1/2"
          />
        </div>

        {/* Detailed Syllabus & Modules */}
        <section className="flex flex-col gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              অধ্যায়ভিত্তিক সিলেবাস ও প্ল্যান
            </h2>
            <p className="text-xs text-muted-foreground">
              প্রতিটি বিষয়ের বিস্তারিত অধ্যায় এবং নির্ধারিত লাইভ ক্লাসের সংখ্যা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {course.modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-card rounded-xl p-5 border border-border/80 shadow-2xs flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-border/60">
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {mod.title}
                    </h3>
                    <span className="text-[11px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full whitespace-nowrap border border-border/60">
                      {mod.totalClasses} টি ক্লাস
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {mod.chapters.map((ch) => (
                      <li
                        key={ch}
                        className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
                      >
                        <div className="size-1.5 rounded-full bg-primary/70 shrink-0" />
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="flex flex-col gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h2>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-5 md:p-6 border border-border/80 shadow-2xs">
            <Accordion type="single" collapsible className="w-full">
              {course.faqs.map((faq, idx) => (
                <AccordionItem key={faq.question} value={`faq-${idx}`} className="border-border/60">
                  <AccordionTrigger className="text-left font-bold text-foreground text-xs sm:text-sm hover:no-underline py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
