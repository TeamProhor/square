import Link from "next/link";
import { getAllExamsAdmin } from "@/lib/actions/admin-exam";
import { Button } from "@/components/ui/button";
import { CalendarTick, DocumentDownload, TaskSquare } from "@/components/icons";

export default async function AdminExamsPage() {
  const { data: exams } = await getAllExamsAdmin();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ম্যানেজ পরীক্ষা</h1>
          <p className="text-muted-foreground text-sm mt-1">সব ধরনের পরীক্ষা পরিচালনা ও তৈরি করুন</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/exams/routines">
            <Button variant="outline" className="rounded-xl">রুটিন ক্যালেন্ডার</Button>
          </Link>
          <Link href="/admin/exams/new">
            <Button className="rounded-xl">+ নতুন পরীক্ষা</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams?.map((exam) => (
          <div key={exam.id} className="border rounded-xl p-5 bg-card hover:border-primary/50 transition-all flex flex-col gap-4 shadow-sm">
            <div>
              <h3 className="font-bold text-lg leading-tight">{exam.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-accent text-[10px] font-medium capitalize">
                  {exam.type.replace("_", " ")}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${exam.isPublished ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {exam.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mt-2 bg-muted/50 p-3 rounded-lg">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">মার্কস</span>
                <span>{exam.totalMarks} (Pass: {exam.passMarks || 0})</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">সময়</span>
                <span>{exam.durationMinutes} মিনিট</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto pt-2">
              <Link href={`/admin/exams/${exam.id}/questions`}>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 rounded-xl">
                  <TaskSquare className="size-4" /> প্রশ্ন যোগ করুন
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link href={`/admin/exams/${exam.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl">এডিট</Button>
                </Link>
                <Link href={`/admin/exams/${exam.id}/results`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl">রেজাল্ট</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        {(!exams || exams.length === 0) && (
          <div className="col-span-full py-16 text-center border border-dashed rounded-xl text-muted-foreground">
            কোনো পরীক্ষা পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
