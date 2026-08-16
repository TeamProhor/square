"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarTick,
  Flame,
  Information,
  ShieldCheck,
  Star,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { COURSES, type Course } from "@/lib/courses";

export function CoursesPricingSection() {
  const [selectedBatch, setSelectedBatch] = useState<"HSC 26" | "HSC 27" | "Admission">("HSC 26");

  const filteredCourses = COURSES.filter((course) => course.hscBatch === selectedBatch);

  return (
    <section id="courses-section" className="w-full overflow-hidden py-4 md:py-8 scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-6 max-w-2xl space-y-2">
          <h2 className="font-black text-2xl tracking-tight sm:text-3xl lg:text-4xl text-foreground">
            আমাদের এক্সক্লুসিভ কোর্সসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            লাইভ ক্লাস, অধ্যায়ভিত্তিক মেগা এক্সাম, ডেডিকেটেড ডাউট সলভ ও বোর্ড স্ট্যান্ডার্ড শিটসহ সম্পূর্ণ একাডেমিক ও এডমিশন প্রস্তুতি।
          </p>
        </div>

        {/* Batch Segment Switcher */}
        <div className="mb-6 flex items-center justify-start sm:justify-center">
          <div className="flex w-fit rounded-xl border border-border/80 bg-card p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setSelectedBatch("HSC 26")}
              className={`relative px-3.5 py-1.5 font-bold text-xs sm:text-sm rounded-lg transition-all ${
                selectedBatch === "HSC 26"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HSC 26 ব্যাচ ({COURSES.filter((c) => c.hscBatch === "HSC 26").length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch("HSC 27")}
              className={`relative px-3.5 py-1.5 font-bold text-xs sm:text-sm rounded-lg transition-all ${
                selectedBatch === "HSC 27"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HSC 27 ব্যাচ
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch("Admission")}
              className={`relative px-3.5 py-1.5 font-bold text-xs sm:text-sm rounded-lg transition-all ${
                selectedBatch === "Admission"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ভার্সিটি / ইঞ্জিনিয়ারিং
            </button>
          </div>
        </div>

        {/* Pricing Grid with Corner Crosshairs and Horizontal Border Lines */}
        <div className="relative border-y border-border/80">
          {/* Top & Bottom Accent Lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-px bg-border -top-px left-1/2 w-screen -translate-x-1/2"
          />

          {selectedBatch === "HSC 26" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
              {filteredCourses.map((course: Course, idx: number) => {
                const isFeatured = idx === 0;

                return (
                  <div
                    key={course.slug}
                    className={`group relative flex w-full flex-col justify-between p-6 sm:p-7 md:p-8 border-b md:border-b-0 transition-all duration-300 ${
                      isFeatured
                        ? "bg-card dark:bg-[radial-gradient(60%_80%_at_20%_0%,--theme(--color-foreground/.06),transparent)]"
                        : "bg-card/60 hover:bg-card"
                    }`}
                  >
                    {/* Corner Crosshair Decoration */}
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute z-10 size-4 shrink-0 stroke-1 stroke-muted-foreground/60 top-0 left-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)] hidden md:block"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>

                    <div>
                      {/* Badge / Tag */}
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          {course.badge ?? course.hscBatch}
                        </span>
                        {isFeatured && (
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                            <Star className="size-3 fill-amber-500 text-amber-500" /> সর্বাধিক ভর্তি
                          </span>
                        )}
                      </div>

                      {/* Header Info */}
                      <div className="mb-6 flex flex-col gap-2">
                        <h3 className="font-black text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {course.subtitle}
                        </p>

                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="font-black text-3xl text-foreground">
                            ৳{course.price}
                          </span>
                          {course.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ৳{course.originalPrice}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-muted-foreground">/ এককালীন</span>
                        </div>
                      </div>

                      {/* Feature Bullet Points */}
                      <div className="mb-8 space-y-2.5 pt-4 border-t border-border/60">
                        {course.features.map((feature: string) => (
                          <div key={feature} className="flex items-start gap-2">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                            <p className="text-xs text-foreground font-medium line-clamp-2">
                              {feature}
                            </p>
                          </div>
                        ))}
                        <div className="flex items-start gap-2 text-[11px] text-muted-foreground pt-1">
                          <CalendarTick className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                          <span className="line-clamp-1">শিডিউল: {course.routineInfo.schedule}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-4">
                      <Button
                        asChild
                        className={`w-full py-5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all ${
                          isFeatured
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                            : "bg-foreground text-background hover:bg-foreground/90"
                        }`}
                      >
                        <Link href={`/courses/${course.slug}`}>এখনই এনরোল করুন</Link>
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-muted-foreground font-bold hover:text-foreground hover:bg-accent border-border/70 text-xs"
                        >
                          <Link href={`/courses/${course.slug}`}>
                            <CalendarTick className="size-3.5 text-primary" />
                            <span>রুটিন</span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-foreground font-bold hover:bg-accent border-border/70 text-xs"
                        >
                          <Link href={`/courses/${course.slug}`}>
                            <Information className="size-3.5 text-primary" />
                            <span>বিস্তারিত</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : selectedBatch === "HSC 27" ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Flame className="size-6" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-foreground">
                HSC 27 ব্যাচের কোর্স খুব শীঘ্রই উন্মুক্ত করা হবে
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                আমাদের টেলিগ্রাম সাপোর্ট গ্রুপে যুক্ত হয়ে সবার আগে ব্যাচ সংক্রান্ত আপডেট ও স্পেশাল ছাড় পেয়ে যান।
              </p>
              <Button asChild variant="outline" className="mt-2 rounded-xl font-bold text-xs">
                <a href="https://t.me/shu_yaib" target="_blank" rel="noopener noreferrer">
                  টেলিগ্রাম গ্রুপে যুক্ত হোন &rarr;
                </a>
              </Button>
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Star className="size-6" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-foreground">
                ইঞ্জিনিয়ারিং ও ভার্সিটি এডমিশন কোর্স
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                এইচএসসি বোর্ড পরীক্ষার পরই শুরু হবে পূর্ণাঙ্গ ডেডিকেটেড এডমিশন মাস্টারক্লাস।
              </p>
              <Button asChild variant="outline" className="mt-2 rounded-xl font-bold text-xs">
                <a href="https://t.me/shu_yaib" target="_blank" rel="noopener noreferrer">
                  নোটিফিকেশনের জন্য যুক্ত থাকুন &rarr;
                </a>
              </Button>
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-px bg-border -bottom-px left-1/2 w-screen -translate-x-1/2"
          />
        </div>
      </div>
    </section>
  );
}
