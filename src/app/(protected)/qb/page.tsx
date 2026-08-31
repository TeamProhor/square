import { headers } from "next/headers";
import Link from "next/link";
import type { ReactElement } from "react";
import { Lock, TaskSquare, TickCircle } from "@/components/icons";
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
        {qbs?.map((qb) => (
          <Link href={`/qb/${qb.slug}`} key={qb.id} className="block group">
            <div
              className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 cursor-pointer border transition-all duration-300 min-h-[170px] sm:min-h-[200px] flex flex-col justify-between ${
                qb.hasAccess
                  ? "bg-card border-border/70 hover:border-primary/50 shadow-2xs hover:shadow-lg hover:-translate-y-1"
                  : "bg-muted/30 border-dashed border-border/80 hover:border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    qb.isPublic
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : qb.hasAccess
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  }`}
                >
                  {qb.isPublic ? (
                    <>
                      <TickCircle className="size-3" /> ফ্রি ও উন্মুক্ত
                    </>
                  ) : qb.hasAccess ? (
                    <>
                      <TickCircle className="size-3" /> এনরোল্ড এক্সেস
                    </>
                  ) : (
                    <>
                      <Lock className="size-3" /> ব্যাচ রেস্ট্রিক্টেড
                    </>
                  )}
                </span>

                <span className="text-[11px] text-muted-foreground font-semibold">
                  {qb.itemsCount} টি বিষয়
                </span>
              </div>

              <div className="space-y-1.5 py-3">
                <h3 className="font-extrabold text-base sm:text-lg md:text-xl leading-snug text-foreground group-hover:text-primary transition-colors">
                  {qb.title}
                </h3>
                {qb.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {qb.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {qb.hasAccess ? "অনুশীলন শুরু করুন →" : "ফ্রি প্রিভিউ ও বিবরণ →"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
