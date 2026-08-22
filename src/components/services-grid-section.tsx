"use client";

import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Chart,
  FileDown,
  FileText,
  Star,
} from "@/components/icons";
import { Card } from "@/components/ui/card";

interface ServiceItem {
  readonly title: string;
  readonly href: string;
  readonly icon: typeof Chart;
  readonly bgClass: string;
  readonly textClass: string;
}

const services: readonly ServiceItem[] = [
  {
    title: "লাইভ পোল",
    href: "/poll",
    icon: Chart,
    bgClass: "bg-primary/10",
    textClass: "text-primary",
  },
  {
    title: "আমাদের স্পেশাল কোর্স",
    href: "#courses-section",
    icon: BookOpen,
    bgClass: "bg-muted",
    textClass: "text-foreground",
  },
  {
    title: "ফ্রী এক্সাম",
    href: "/qb",
    icon: FileText,
    bgClass: "bg-primary/10",
    textClass: "text-primary",
  },
  {
    title: "সাবজেক্ট রিভিউ",
    href: "/qb",
    icon: Star,
    bgClass: "bg-muted",
    textClass: "text-foreground",
  },
  {
    title: "সাজেশন পোর্টাল",
    href: "/pdf",
    icon: FileDown,
    bgClass: "bg-primary/10",
    textClass: "text-primary",
  },
  {
    title: "পরীক্ষার ক্যালেন্ডার",
    href: "/calendar",
    icon: Calendar,
    bgClass: "bg-muted",
    textClass: "text-foreground",
  },
];

export function ServicesGridSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-1">
          এক নজরে সকল সার্ভিস
        </h2>
        <div className="h-1.5 w-12 bg-primary mt-3 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-8">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <Link key={service.title} href={service.href} className="group">
              <Card className="flex flex-col items-center justify-center gap-2 md:gap-5 p-3 sm:p-5 md:p-8 bg-card border-border/70 rounded-2xl md:rounded-3xl shadow-xs group-hover:shadow-xl group-hover:border-primary transition-all group-hover:-translate-y-1 text-center cursor-pointer active:scale-98 overflow-hidden relative">
                <div
                  className={`${service.bgClass} p-2 sm:p-4 md:p-5 rounded-xl md:rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:rotate-6 flex items-center justify-center shrink-0`}
                >
                  <Icon
                    className={`${service.textClass} group-hover:text-primary-foreground transition-colors size-5 sm:size-7 md:size-9 shrink-0`}
                  />
                </div>
                <span className="text-[11px] sm:text-xs md:text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {service.title}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
