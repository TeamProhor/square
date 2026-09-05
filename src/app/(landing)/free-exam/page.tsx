import Link from "next/link";
import type { ReactElement } from "react";
import { Award, Flash, TaskSquare, User } from "@/components/icons";
import { LandingFooter, LandingHeader } from "@/components/landing-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicFreeExamsListAction } from "@/lib/actions/free-exam";

export const dynamic = "force-dynamic";

export default async function FreeExamsPortalPage(): Promise<ReactElement> {
  const { data: examsList = [] } = await getPublicFreeExamsListAction();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white transition-colors duration-300">
      <LandingHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full flex flex-col gap-6">
        {/* Simple Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Flash className="size-5 text-primary" />
              <span>ফ্রি এক্সাম</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              যেকোনো পরীক্ষায় ক্লিক করে সরাসরি অংশ নিন
            </p>
          </div>
          {examsList.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-xl text-muted-foreground self-start sm:self-auto border border-border/60">
              মোট পরীক্ষা: {examsList.length}টি
            </span>
          )}
        </div>

        {/* Compact Exams Grid */}
        {examsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examsList.map((exam) => (
              <Card
                key={exam.id}
                className="rounded-2xl border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group p-4 gap-3.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ফ্রি এক্সাম
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <User className="size-3 text-muted-foreground" />
                      <span>{exam.participantsCount} জন</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {exam.title}
                  </h3>

                  {/* Compact Info Badges */}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-muted/60 font-medium">
                      {exam.durationMinutes} মিনিট
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-muted/60 font-medium">
                      {exam.totalMarks} মার্কস
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-destructive/10 text-destructive font-medium">
                      -{exam.negativeMarking}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 rounded-xl font-bold text-xs h-8.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-none cursor-pointer"
                  >
                    <Link href={`/free-exam/${exam.slug}`}>
                      পরীক্ষা দিন
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-xl font-medium text-xs h-8.5 border-border/80 hover:bg-accent cursor-pointer px-3"
                  >
                    <Link href={`/free-exam/${exam.slug}/leaderboard`}>
                      <Award className="size-3.5 text-amber-500 mr-1" />
                      র‍্যাংক
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed rounded-2xl bg-muted/20 p-6 space-y-2">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <TaskSquare className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              কোনো ফ্রি এক্সাম পাওয়া যায়নি
            </h3>
            <p className="text-xs text-muted-foreground">
              শীঘ্রই নতুন ফ্রি পরীক্ষা যুক্ত করা হবে।
            </p>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
