import { headers } from "next/headers";
import Link from "next/link";
import type { ReactElement } from "react";
import { Lock, TickCircle } from "@/components/icons";
import { getUserQbContainers } from "@/lib/actions/qb-access";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function QuestionBankPage(): Promise<ReactElement> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  const qbs = await getUserQbContainers(userId);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          প্রশ্নব্যাংক
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          বোর্ড ও এডমিশন স্ট্যান্ডার্ড অধ্যায়ভিত্তিক ও টপিকভিত্তিক প্রশ্ন অনুশীলন করুন
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {qbs?.map((qb) => {
          const accessType = qb.accessType || (qb.hasAccess ? "enrolled" : "restricted");
          const firstBatch = qb.assignedBatches?.[0];

          return (
            <Link href={`/qb/${qb.slug}`} key={qb.id} className="block group">
              <div
                className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 cursor-pointer border transition-all duration-300 min-h-[180px] sm:min-h-[210px] flex flex-col justify-between ${
                  qb.hasAccess
                    ? "bg-card border-border/70 hover:border-primary/50 shadow-2xs hover:shadow-lg hover:-translate-y-1"
                    : "bg-muted/20 border-dashed border-border/80 hover:border-amber-500/50 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      accessType === "public"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : accessType === "enrolled"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : accessType === "admin"
                            ? "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                    }`}
                  >
                    {accessType === "public" ? (
                      <>
                        <TickCircle className="size-3" /> ফ্রি ও উন্মুক্ত
                      </>
                    ) : accessType === "enrolled" ? (
                      <>
                        <TickCircle className="size-3" /> এনরোল্ড এক্সেস
                      </>
                    ) : accessType === "admin" ? (
                      <>
                        <TickCircle className="size-3" /> অ্যাডমিন প্রিভিউ
                      </>
                    ) : (
                      <>
                        <Lock className="size-3" /> কোর্স রেস্ট্রিক্টেড
                      </>
                    )}
                  </span>

                  <span className="text-[11px] text-muted-foreground font-semibold">
                    {qb.itemsCount} টি বিষয়
                  </span>
                </div>

                <div className="space-y-1.5 py-3">
                  <h3 className="font-extrabold text-base sm:text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
                    {qb.title}
                  </h3>
                  {qb.description ? (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {qb.description}
                    </p>
                  ) : null}

                  {accessType === "restricted" && firstBatch && (
                    <p className="text-[11px] text-amber-600/90 font-medium">
                      প্রয়োজনীয় কোর্স: {firstBatch.name}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {qb.questionsCount || 0} টি প্রশ্ন
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium group-hover:text-primary transition-colors">
                    {qb.hasAccess
                      ? accessType === "admin"
                        ? "প্রিভিউ দেখুন →"
                        : "অনুশীলন শুরু করুন →"
                      : "লকড • বিস্তারিত দেখুন →"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
