import Link from "next/link";
import type { ReactElement } from "react";
import { db } from "@/db";
import type { Container } from "@/types";

export default async function QuestionBankPage(): Promise<ReactElement> {
  const qbs = await db.query.containers.findMany({
    orderBy: (containers, { asc }) => [asc(containers.createdAt)],
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-8 pt-2 md:py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {qbs?.map((qb: Container) => (
          <Link href={`/qb/${qb.slug}`} key={qb.id}>
            <div className="group relative overflow-hidden rounded-[20px] md:rounded-[28px] p-4 md:p-6 cursor-pointer border border-border/50 bg-card hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 aspect-square flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center justify-center px-2">
                <h3 className="font-bold text-[18px] md:text-[24px] leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {qb.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
