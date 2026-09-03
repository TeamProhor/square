"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import { Trash2, User } from "@/components/icons";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteBatchAction } from "@/lib/actions/batch";
import type { Batch } from "@/types";

interface AdminBatchesManagerProps {
  readonly batches: readonly Batch[];
}

export function AdminBatchesManager({ batches }: AdminBatchesManagerProps) {
  const router = useRouter();

  const items: QuickListItem[] = batches.map((batch) => ({
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
    rightElement: (
      <DeleteConfirmDialog
        title="ব্যাচ ডিলিট নিশ্চিতকরণ"
        description={`আপনি কি নিশ্চিত যে "${batch.name}" ব্যাচটি ডিলিট করতে চান? এর সাথে যুক্ত সকল এক্সাম অ্যাসাইনমেন্ট, মেম্বার এবং বিস্তারিত তথ্য মুছে যাবে!`}
        onConfirm={async () => {
          const res = await deleteBatchAction(batch.id);
          if (res.error) {
            alert(res.error);
          } else {
            router.refresh();
          }
        }}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="text-destructive hover:bg-destructive/10 gap-1 rounded-xl text-xs cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>ডিলিট</span>
          </Button>
        }
      />
    ),
  }));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">ব্যাচ ও কোর্স তালিকা</h2>
          <p className="text-xs text-muted-foreground">
            সকল চলমান ও পূর্বের ব্যাচ পরিচালনা করুন
          </p>
        </div>
        <Link href="/admin/batches/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-xl font-bold shadow-xs cursor-pointer">
            + নতুন ব্যাচ
          </Button>
        </Link>
      </div>

      <div>
        {items.length === 0 ? (
          <div className="py-12 text-center border border-dashed rounded-xl text-muted-foreground bg-card">
            কোনো ব্যাচ পাওয়া যায়নি
          </div>
        ) : (
          <QuickList
            items={items}
            columns={{ sm: 1, md: 2, lg: 3 }}
            gap="md"
          />
        )}
      </div>
    </div>
  );
}
