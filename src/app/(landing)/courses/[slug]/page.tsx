import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { CheckoutModal } from "@/components/checkout-modal";
import {
  ArrowLeft2,
  FileDown,
  Flame,
  Send,
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
import {
  checkEnrollmentStatus,
  getCourseWithDetailsBySlug,
} from "@/lib/actions/course";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const courseWithDetails = await getCourseWithDetailsBySlug(slug);

  if (!courseWithDetails) {
    notFound();
  }

  const course = {
    id: courseWithDetails.id,
    slug: courseWithDetails.slug,
    title: courseWithDetails.title,
    subtitle: courseWithDetails.subtitle || "",
    description: courseWithDetails.description,
    hscBatch: courseWithDetails.hscBatch,
    price: courseWithDetails.price,
    originalPrice: courseWithDetails.originalPrice,
    image: courseWithDetails.image,
    badge: courseWithDetails.badge || "স্পেশাল ব্যাচ",
    routinePdfUrl: courseWithDetails.details?.routinePdfUrl,
    telegramGroupUrl: courseWithDetails.details?.telegramGroupUrl || "https://t.me/shu_yaib",
    features: courseWithDetails.details?.features || [],
    instructors: courseWithDetails.details?.instructors || [],
    modules: courseWithDetails.details?.modules || [],
    faqs: courseWithDetails.details?.faqs || [],
  };

  let enrollmentStatus = "none";
  if (session?.user?.id && course.id) {
    const statusResult = await checkEnrollmentStatus(
      session.user.id,
      course.id,
    );
    enrollmentStatus = statusResult.status || "none";
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-foreground flex flex-col font-sans selection:bg-black selection:text-white transition-colors duration-300">
      <LandingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 w-full flex flex-col gap-10">
        {/* Back Link */}
        <div>
          <Link
            href="/#courses-section"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors group"
          >
            <div className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-black dark:group-hover:border-white transition-all bg-white dark:bg-card">
              <ArrowLeft2 className="size-3.5" />
            </div>
            <span>সকল কোর্সে ফিরে যান</span>
          </Link>
        </div>

        {/* Hero Section Container */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-slate-200/80 dark:border-border/80 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left details (Span 7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-border/80">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-3.5 py-1 rounded-full">
                  {course.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  <Star className="size-3.5 fill-current text-amber-500" />{" "}
                  এক্সক্লুসিভ লাইভ ব্যাচ
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                  {course.subtitle}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {course.description}
              </p>

              {/* Key Features List */}
              <div className="pt-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  কোর্সের মূল আকর্ষণসমূহ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2.5 bg-slate-50 dark:bg-muted/40 p-3 rounded-2xl border border-slate-100 dark:border-border/60"
                    >
                      <div className="size-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 mt-0.5 text-xs">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructors */}
            {course.instructors.length > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-border/60">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">
                  মেন্টরস ও ইন্সট্রাক্টর
                </span>
                <div className="flex flex-wrap gap-3">
                  {course.instructors.map(
                    (instructor: {
                      name: string;
                      role: string;
                      institution: string;
                    }) => (
                      <div
                        key={instructor.name}
                        className="flex items-center gap-3 bg-slate-50 dark:bg-muted/40 px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-border/60"
                      >
                        <div className="size-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                          <User className="size-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-black dark:text-white leading-none">
                            {instructor.name}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                            {instructor.role} • {instructor.institution}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Pricing Card (Span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-6 bg-slate-50/50 dark:bg-card/40">
            <div className="space-y-5">
              {/* Image with live tag */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-border/80">
                <Image
                  alt={course.title}
                  src={course.image}
                  className="size-full object-cover"
                  fill
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-black/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                  <Flame className="size-3.5 text-white" /> লাইভ ক্লাস + এক্সাম
                </span>
              </div>

              {/* Price Banner */}
              <div className="bg-white dark:bg-card p-5 rounded-2xl border border-slate-200/80 dark:border-border/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-black dark:text-white">
                      ৳{course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-bold">
                        ৳{course.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                    এককালীন ফুল কোর্স ফি
                  </span>
                </div>
                <span className="text-xs font-extrabold bg-black text-white px-3 py-1 rounded-full shadow-xs">
                  ভর্তি চলছে
                </span>
              </div>

              {/* Routine Download Button */}
              <div className="bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border/80 shadow-xs flex flex-col items-center gap-2 text-center">
                <span className="font-extrabold text-black dark:text-white text-xs uppercase tracking-wider">
                  কোর্স রুটিন ও দিনপঞ্জি
                </span>
                {course.routinePdfUrl ? (
                  <a
                    href={course.routinePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-muted text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold py-2.5 px-4 rounded-xl transition-all text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <FileDown className="size-4" /> রুটিন ডাউনলোড করুন (PDF)
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs py-2 px-4 rounded-xl w-full bg-slate-50 dark:bg-muted/20 border border-slate-100 dark:border-border">
                    রুটিন খুব শীঘ্রই আপডেট হবে
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons with CheckoutModal kept fully intact */}
            <div className="flex flex-col gap-3 pt-2">
              {enrollmentStatus === "active" ? (
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 h-auto rounded-xl text-sm shadow-md"
                >
                  <Link href={`/my-courses/${course.id}`}>
                    ইতিমধ্যে যুক্ত আছো &rarr;
                  </Link>
                </Button>
              ) : enrollmentStatus === "pending" ? (
                <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-center font-extrabold py-4 rounded-xl text-sm shadow-xs">
                  পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন
                </div>
              ) : !session?.user?.id ? (
                <Button
                  asChild
                  className="w-full bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-bold py-4 h-auto rounded-xl text-sm shadow-md transition-all hover:scale-101"
                >
                  <Link href={`/login?callbackUrl=/courses/${slug}`}>
                    এখনই এনরোল করুন
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  {enrollmentStatus === "rejected" && (
                    <div className="w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-center font-bold py-3 px-3 rounded-xl text-xs shadow-xs leading-snug">
                      আপনার পূর্বের পেমেন্ট রিকোয়েস্ট বাতিল করা হয়েছে। অনুগ্রহ করে সঠিক
                      তথ্য দিয়ে পুনরায় সাবমিট করুন।
                    </div>
                  )}
                  <CheckoutModal
                    courseId={course.id}
                    courseTitle={course.title}
                    price={course.price}
                    userId={session.user.id}
                  >
                    <Button className="w-full bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-bold py-4 h-auto rounded-xl text-sm shadow-md transition-all hover:scale-101 cursor-pointer">
                      {enrollmentStatus === "rejected"
                        ? "পুনরায় এনরোল করুন"
                        : "এখনই এনরোল করুন"}
                    </Button>
                  </CheckoutModal>
                </div>
              )}

              <Button
                asChild
                variant="outline"
                className="w-full font-bold py-3.5 h-auto rounded-xl text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-muted border-slate-200 dark:border-slate-800 text-xs"
              >
                <a
                  href={course.telegramGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Send
                    data-icon="inline-start"
                    className="size-3.5 text-sky-500"
                  />
                  <span>ভর্তি সংক্রান্ত সহায়তা (টেলিগ্রাম)</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        {course.faqs.length > 0 && (
          <section className="flex flex-col gap-5">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white tracking-tight">
                সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
              </h2>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-border/80 shadow-xs">
              <Accordion type="single" collapsible className="w-full">
                {course.faqs.map((faq, idx) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${idx}`}
                    className="border-slate-100 dark:border-border/60 py-1"
                  >
                    <AccordionTrigger className="text-left font-extrabold text-black dark:text-white text-sm sm:text-base hover:no-underline py-3 cursor-pointer">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed pt-1 pb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
