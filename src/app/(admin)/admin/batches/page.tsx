import Link from "next/link";
import { getAllBatchesAction } from "@/lib/actions/batch";
import { Button } from "@/components/ui/button";
import { User, CalendarTick } from "@/components/icons";

export default async function AdminBatchesPage() {
  const { data: batches } = await getAllBatchesAction();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ম্যানেজ ব্যাচ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            শিক্ষার্থীদের ব্যাচ এবং এনরোলমেন্ট পরিচালনা করুন
          </p>
        </div>
        <Link href="/admin/batches/new">
          <Button className="rounded-xl">+ নতুন ব্যাচ</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {batches?.map((batch) => (
          <div key={batch.id} className="border rounded-xl p-5 bg-card hover:border-primary/50 transition-all flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-lg">{batch.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{batch.slug}</p>
            </div>
            {batch.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{batch.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-auto pt-2">
              <span className="flex items-center gap-1.5">
                <User className="size-4 text-primary" />
                সদস্য
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarTick className="size-4 text-primary" />
                পরীক্ষা
              </span>
              <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${batch.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                {batch.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <Link href={`/admin/batches/${batch.id}`} className="mt-2">
              <Button variant="outline" className="w-full rounded-xl" size="sm">বিস্তারিত দেখুন</Button>
            </Link>
          </div>
        ))}
        {(!batches || batches.length === 0) && (
          <div className="col-span-full py-12 text-center border border-dashed rounded-xl text-muted-foreground">
            কোনো ব্যাচ পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
