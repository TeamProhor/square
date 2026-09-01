import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { db } from "@/db";
import { containers, items } from "@/db/schema";
import type { Item } from "@/types";

export default async function QbSubjectsPage({
  params,
}: {
  readonly params: Promise<{ containerSlug: string }>;
}): Promise<ReactElement> {
  const { containerSlug } = await params;

  const qb = await db.query.containers.findFirst({
    where: eq(containers.slug, containerSlug),
  });

  if (!qb) notFound();

  const itemList = await db.query.items.findMany({
    where: eq(items.containerId, qb.id),
    with: {
      subitems: {
        with: {
          questions: {
            columns: { id: true },
          },
        },
      },
    },
    orderBy: (items, { asc }) => [asc(items.name)],
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-8 pt-2 md:py-8">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground mb-2">
          <Link href="/qb" className="hover:text-primary transition-colors">
            প্রশ্নব্যাংক
          </Link>
          <span>/</span>
          <span className="text-foreground">{qb.title}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          বিষয়সমূহ
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {qb.title} এর অন্তর্গত বিষয় নির্বাচন করুন
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {itemList?.map((sub) => {
          const chaptersCount = sub.subitems?.length || 0;
          const questionsCount = (sub.subitems || []).reduce(
            (acc, s) => acc + (s.questions?.length || 0),
            0,
          );

          return (
            <Link href={`/qb/${qb.slug}/${sub.slug}`} key={sub.id}>
              <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 cursor-pointer border border-border/70 bg-card hover:border-primary/50 shadow-2xs hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 min-h-[160px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit">
                    {chaptersCount} টি অধ্যায়
                  </span>
                  <h3 className="font-bold text-lg md:text-xl leading-tight text-foreground group-hover:text-primary transition-colors duration-300 pt-2">
                    {sub.name}
                  </h3>
                </div>

                <div className="relative z-10 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {questionsCount} টি প্রশ্ন
                  </span>
                  <span className="text-[11px] text-primary font-bold">
                    অনুশীলন →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        {itemList?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
            কোনো বিষয় পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
