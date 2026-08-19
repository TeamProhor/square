import Link from "next/link";
import { AdminExamsList } from "@/components/admin/admin-exams-list";
import { Button } from "@/components/ui/button";
import { getAllExamsWithBatchesAdmin } from "@/lib/actions/admin-exam";

export default async function AdminExamsPage() {
  const { data: exams } = await getAllExamsWithBatchesAdmin();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/exams/routines">
          <Button variant="outline" className="rounded-xl">
            রুটিন ক্যালেন্ডার
          </Button>
        </Link>
        <Link href="/admin/exams/new">
          <Button className="rounded-xl">+ নতুন পরীক্ষা</Button>
        </Link>
      </div>

      <AdminExamsList exams={exams ?? []} />
    </div>
  );
}
