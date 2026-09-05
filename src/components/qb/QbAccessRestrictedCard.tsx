import Link from "next/link";
import { ArrowLeft2, Lock } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface AssignedBatch {
  id: string;
  name: string;
  slug: string;
  hscBatch?: string;
}

interface QbAccessRestrictedCardProps {
  readonly title: string;
  readonly assignedBatches?: readonly AssignedBatch[];
}

export function QbAccessRestrictedCard({
  title,
  assignedBatches = [],
}: QbAccessRestrictedCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 my-8 rounded-3xl border border-dashed border-border bg-card/60 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
      <div className="size-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
        <Lock className="size-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-foreground">
          {title} - অ্যাক্সেস সংরক্ষিত
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {assignedBatches.length > 0
            ? "এই প্রশ্নব্যাংকটির বিষয় ও প্রশ্ন অনুশীলন করার জন্য আপনাকে নির্দিষ্ট ব্যাচে বা কোর্সে ভর্তি থাকতে হবে।"
            : "এই প্রশ্নব্যাংকটির অ্যাক্সেস বর্তমানে অ্যাডমিন প্যানেল থেকে বন্ধ রাখা হয়েছে।"}
        </p>
      </div>

      {assignedBatches.length > 0 && (
        <div className="w-full space-y-3 pt-2">
          <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
            যে সকল কোর্সে এই প্রশ্নব্যাংক অন্তর্ভুক্ত রয়েছে:
          </p>
          <div className="flex flex-col gap-2.5">
            {assignedBatches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-muted/40 border border-border/80"
              >
                <div className="text-left space-y-0.5">
                  <p className="font-bold text-sm text-foreground">{b.name}</p>
                  {b.hscBatch && (
                    <span className="text-[11px] text-muted-foreground">
                      HSC {b.hscBatch}
                    </span>
                  )}
                </div>
                <Link href={`/courses/${b.slug}`}>
                  <Button
                    size="sm"
                    className="rounded-xl text-xs font-bold px-4 h-8.5 cursor-pointer"
                  >
                    কোর্সে ভর্তি হোন &rarr;
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <Link href="/qb">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-bold gap-2 cursor-pointer"
          >
            <ArrowLeft2 className="size-3.5" />
            প্রশ্নব্যাংক তালিকায় ফিরে যান
          </Button>
        </Link>
      </div>
    </div>
  );
}
