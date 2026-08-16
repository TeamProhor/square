import Link from "next/link";
import type { ReactElement } from "react";
import {
  CalendarTick,
  DocumentDownload,
  Flame,
  StatusUp,
  TaskSquare,
} from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";

export default async function DashboardPage(): Promise<ReactElement> {
  const containers = await db.query.containers.findMany({
    limit: 4,
    orderBy: (containers, { asc }) => [asc(containers.createdAt)],
  });

  const cards = [
    {
      title: "প্রশ্নব্যাংক",
      description: "অধ্যায়ভিত্তিক এমসিকিউ ও সিকিউ অনুশীলন করুন",
      href: "/qb",
      icon: TaskSquare,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "পিডিএফ সাজেশন",
      description: "গুরুত্বপূর্ণ হ্যান্ডনোট ও প্রশ্ন সংকলন ডাউনলোড করুন",
      href: "/pdf",
      icon: DocumentDownload,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      title: "পরীক্ষার ক্যালেন্ডার",
      description: "আসন্ন সকল পরীক্ষা ও ক্লাসের সময়সূচী",
      href: "/calendar",
      icon: CalendarTick,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "লাইভ পোল ও কুইজ",
      description: "অন্যান্য শিক্ষার্থীদের সাথে লাইভ টেস্টে অংশ নিন",
      href: "/poll",
      icon: StatusUp,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/60 rounded-[24px] p-6 md:p-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <Flame className="size-3.5" /> ড্যাশবোর্ড ওভারভিউ
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            স্বাগতম স্কয়ার ড্যাশবোর্ডে!
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            আপনার অ্যাকাডেমিক ও এডমিশন প্রস্তুতির প্রয়োজনীয় সব রিসোর্স ও পরীক্ষা এক নজরে
            এক্সপ্লোর করুন।
          </p>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group">
              <Card className="h-full border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-[20px]">
                <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                  <div className={`p-3.5 rounded-2xl w-fit ${card.color}`}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {card.title}
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

      {/* Quick Section: Question Banks */}
      {containers.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                জনপ্রিয় প্রশ্নব্যাংক
              </h2>
              <p className="text-xs text-muted-foreground">
                সরাসরি চ্যাপ্টারভিত্তিক প্রশ্ন সমাধান শুরু করুন
              </p>
            </div>
            <Link
              href="/qb"
              className="text-xs font-semibold text-primary hover:underline"
            >
              সবগুলো দেখুন &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {containers.map((qb) => (
              <Link href={`/qb/${qb.slug}`} key={qb.id} className="group">
                <div className="rounded-[18px] p-4 md:p-5 border border-border/50 bg-card hover:border-primary/40 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[100px]">
                  <span className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
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
