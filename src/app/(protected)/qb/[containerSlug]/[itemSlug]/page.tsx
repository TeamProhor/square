import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { QbAccessRestrictedCard } from "@/components/qb/QbAccessRestrictedCard";
import { db } from "@/db";
import { items, subitems } from "@/db/schema";
import { checkQbContainerAccess } from "@/lib/actions/qb-access";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function QbChaptersPage({
  params,
}: {
  readonly params: Promise<{ containerSlug: string; itemSlug: string }>;
}): Promise<ReactElement> {
  const { containerSlug, itemSlug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const accessInfo = await checkQbContainerAccess(containerSlug, userId);
  if (!accessInfo.exists || !accessInfo.container) {
    notFound();
  }

  const qb = accessInfo.container;

  // Access check
  if (!accessInfo.hasAccess) {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto pb-8 pt-2 md:py-8">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground mb-4">
          <Link href="/qb" className="hover:text-primary transition-colors">
            প্রশ্নব্যাংক
          </Link>
          <span>/</span>
          <span className="text-foreground">{qb.title}</span>
        </div>
        <QbAccessRestrictedCard
          title={qb.title}
          assignedBatches={accessInfo.assignedBatches}
        />
      </div>
    );
  }

  const subject = await db.query.items.findFirst({
    where: eq(items.slug, itemSlug),
  });

  if (!subject) notFound();

  const chapterList = await db.query.subitems.findMany({
    where: eq(subitems.itemId, subject.id),
    with: {
      questions: {
        columns: { id: true },
      },
      topics: {
        columns: { id: true },
      },
    },
    orderBy: (subitems, { asc }) => [asc(subitems.orderNo)],
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-8 pt-2 md:py-8">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground mb-2 flex-wrap">
          <Link href="/qb" className="hover:text-primary transition-colors">
            প্রশ্নব্যাংক
          </Link>
          <span>/</span>
          <Link
            href={`/qb/${qb.slug}`}
            className="hover:text-primary transition-colors"
          >
            {qb.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">{subject.name}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          অধ্যায়সমূহ
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {subject.name} এর অধ্যায় নির্বাচন করুন
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {chapterList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
            {chapterList.map((ch) => {
              const qCount = ch.questions?.length || 0;
              const topicsCount = ch.topics?.length || 0;

              return (
                <Link
                  href={`/qb/${qb.slug}/${subject.slug}/${ch.slug}`}
                  key={ch.id}
                >
                  <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 cursor-pointer border border-border/70 bg-card hover:border-primary/50 shadow-2xs hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 min-h-[160px] flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                          {qCount} টি প্রশ্ন
                        </span>
                        {topicsCount > 0 && (
                          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {topicsCount} টি টপিক
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base md:text-lg leading-tight text-foreground group-hover:text-primary transition-colors duration-300 pt-2">
                        {ch.name}
                      </h3>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-muted-foreground">
                        {qCount > 0 ? "অনুশীলন করুন" : "প্রশ্ন নেই"}
                      </span>
                      <span className="text-[11px] text-primary font-bold">
                        প্রবেশ করুন →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
            কোনো অধ্যায় পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
