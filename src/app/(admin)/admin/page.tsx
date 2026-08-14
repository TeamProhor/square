import Link from "next/link";
import { count } from "drizzle-orm";
import { BookOpen, CalendarTick, TaskSquare, User } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { batches, exams, items, questions } from "@/db/schema";

export default async function AdminDashboardPage() {
  const [
    [{ value: questionsCount }],
    [{ value: subjectsCount }],
    [{ value: examsCount }],
    [{ value: batchesCount }],
  ] = await Promise.all([
    db.select({ value: count() }).from(questions),
    db.select({ value: count() }).from(items),
    db.select({ value: count() }).from(exams),
    db.select({ value: count() }).from(batches),
  ]);

  const stats = [
    {
      title: "মোট প্রশ্ন",
      count: questionsCount ?? 0,
      icon: TaskSquare,
      href: "/admin/qb",
      description: "পদার্থ, রসায়ন, গণিত প্রশ্নব্যাংক",
    },
    {
      title: "বিষয় ও অধ্যায়",
      count: subjectsCount ?? 0,
      icon: BookOpen,
      href: "/admin/qb",
      description: "একাডেমিক সাবজেক্টসমূহ",
    },
    {
      title: "এক্টিভ পরীক্ষা",
      count: examsCount ?? 0,
      icon: CalendarTick,
      href: "/admin/exams",
      description: "তৈরিকৃত পরীক্ষা ও টেস্ট",
    },
    {
      title: "লাইভ ব্যাচসমূহ",
      count: batchesCount ?? 0,
      icon: User,
      href: "/admin/batches",
      description: "স্টুডেন্ট ব্যাচ ও এনরোলমেন্ট",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          এডমিন ড্যাশবোর্ড ওভারভিউ
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          আপনার স্কয়ার প্ল্যাটফর্মের প্রশ্নব্যাংক, পরীক্ষা এবং ব্যাচসমূহ ম্যানেজ করুন সহজে।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="size-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.count}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
