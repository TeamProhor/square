import Link from "next/link";
import type { ReactElement } from "react";
import {
  Award,
  BookOpen,
  Clock,
  Eye,
  Flash,
  Star,
  TaskSquare,
  TickCircle,
  User,
} from "@/components/icons";
import { LandingFooter, LandingHeader } from "@/components/landing-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublicFreeExamsListAction } from "@/lib/actions/free-exam";

export const dynamic = "force-dynamic";

export default async function FreeExamsPortalPage(): Promise<ReactElement> {
  const { data: examsList = [] } = await getPublicFreeExamsListAction();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white transition-colors duration-300">
      <LandingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex flex-col gap-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-muted border border-border/80 p-6 sm:p-10 md:p-14 shadow-sm text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20 text-xs font-extrabold uppercase tracking-wide">
            <Flash className="size-3.5" />
            <span>সবার জন্য উন্মুক্ত ও ১০০% ফ্রি</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground max-w-3xl leading-tight">
            লগইন ছাড়াই অংশ নিন <span className="text-primary">ফ্রি অনলাইন এক্সামে</span>
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            কোনো রেজিস্ট্রেশন বা পাসওয়ার্ড ছাড়াই শুধু নাম দিয়ে পরীক্ষা দিন, তাৎক্ষণিক ফলাফল ও সমাধান দেখুন এবং লাইভ লিডারবোর্ডে নিজের অবস্থান জানুন।
          </p>

          {/* Quick Highlight Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 pt-4 w-full max-w-2xl">
            <div className="bg-card/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-border/70 text-center">
              <span className="text-lg sm:text-2xl font-black text-primary block">
                {examsList.length}টি+
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">
                লাইভ ও প্র্যাকটিস টেস্ট
              </span>
            </div>

            <div className="bg-card/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-border/70 text-center">
              <span className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                ইনস্ট্যান্ট
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">
                অটোমেটিক রেজাল্ট
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-card/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-border/70 text-center">
              <span className="text-lg sm:text-2xl font-black text-amber-500 block">
                রিয়েলটাইম
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">
                মেরিট লিস্ট ও র‍্যাংকিং
              </span>
            </div>
          </div>
        </section>

        {/* Exams Grid Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <span>চলমান ফ্রি অনলাইন পরীক্ষাসমূহ</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                যেকোনো পরীক্ষায় ক্লিক করে সরাসরি অংশ নিতে পারেন
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-muted rounded-xl text-muted-foreground self-start sm:self-auto">
              মোট পরীক্ষা: {examsList.length} টি
            </span>
          </div>

          {examsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {examsList.map((exam) => (
                <Card
                  key={exam.id}
                  className="rounded-3xl border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <CardHeader className="p-5 sm:p-6 pb-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        ● ফ্রি এক্সাম
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <User className="size-3 text-primary" />
                        <span>{exam.participantsCount} জন অংশ নিয়েছে</span>
                      </span>
                    </div>

                    <div>
                      <CardTitle className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {exam.title}
                      </CardTitle>
                      {exam.description && (
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {exam.description}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 sm:px-6 py-0 space-y-3">
                    {/* Metadata Pills */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-muted/40 border border-border/50 text-center">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-medium text-muted-foreground block">
                          সময়
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {exam.durationMinutes} মি.
                        </span>
                      </div>
                      <div className="space-y-0.5 border-x border-border/60">
                        <span className="text-[10px] font-medium text-muted-foreground block">
                          পূর্ণমান
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {exam.totalMarks}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-medium text-muted-foreground block">
                          নেগেটিভ
                        </span>
                        <span className="text-xs font-bold text-destructive">
                          -{exam.negativeMarking}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 sm:p-6 pt-5 flex items-center gap-2 border-t border-border/50 mt-4">
                    <Button
                      asChild
                      className="flex-1 rounded-xl font-extrabold text-xs h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer gap-1.5"
                    >
                      <Link href={`/free-exam/${exam.slug}`}>
                        <span>পরীক্ষা দিন</span>
                        <Flash className="size-3.5" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="rounded-xl font-bold text-xs h-10 border-border/80 hover:bg-accent cursor-pointer gap-1 px-3.5"
                    >
                      <Link href={`/free-exam/${exam.slug}/leaderboard`}>
                        <Award className="size-3.5 text-amber-500" />
                        <span>র‍্যাংক</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed rounded-3xl bg-muted/20 p-8 space-y-3">
              <div className="size-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <TaskSquare className="size-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                কোনো ফ্রি এক্সাম পাওয়া যায়নি
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                শীঘ্রই নতুন ফ্রি মডেল টেস্ট ও চ্যাপ্টার পরীক্ষা আপলোড করা হবে।
              </p>
            </div>
          )}
        </section>

        {/* Informational Guidance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              ১
            </div>
            <h3 className="font-bold text-sm text-foreground">লগইন বা রেজিস্ট্রেশন ছাড়া</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              সরাসরি যেকোনো ডিভাইস থেকে নাম লিখে ইনস্ট্যান্ট পরীক্ষা শুরু করুন। কোনো পাসওয়ার্ড বা ওটিপি প্রয়োজন নেই।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ২
            </div>
            <h3 className="font-bold text-sm text-foreground">তাৎক্ষণিক ফলাফল ও সলিউশন</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              সাবমিট করার সাথে সাথেই আপনার প্রাপ্ত মার্কস, সঠিক-ভুল উত্তর এবং প্রতিটি প্রশ্নের গণিত ও বৈজ্ঞানিক ব্যাখ্যা দেখুন।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              ৩
            </div>
            <h3 className="font-bold text-sm text-foreground">লাইভ মেধা তালিকা (Leaderboard)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              সারা দেশের শিক্ষার্থীদের সাথে নিজের অবস্থান যাচাই করুন লাইভ মেধা তালিকায়।
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
