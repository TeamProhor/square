import Link from "next/link";
import { QuickList } from "@/components/admin/quick-list";
import { User } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getAllBatchesAction } from "@/lib/actions/batch";

export default async function AdminBatchesPage() {
  const { data: batches } = await getAllBatchesAction();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div className="flex items-center justify-end w-full">
        <Link href="/admin/batches/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-xl font-bold shadow-xs">
            + নতুন ব্যাচ
          </Button>
        </Link>
      </div>

      <div>
        {!batches || batches.length === 0 ? (
          <div className="py-12 text-center border border-dashed rounded-xl text-muted-foreground bg-card">
            কোনো ব্যাচ পাওয়া যায়নি
          </div>
        ) : (
          <QuickList
            items={batches.map((batch) => ({
              title: batch.name,
              description: batch.description || undefined,
              href: `/admin/batches/${batch.id}`,
              icon: User,
              iconBg: "bg-primary/10",
              text: "text-primary",
              extra: (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    batch.isActive
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {batch.isActive ? "Active" : "Inactive"}
                </span>
              ),
            }))}
            columns={{ sm: 1, md: 2, lg: 3 }}
            gap="md"
          />
        )}
      </div>
    </div>
  );
}
