import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getStudentExams, getPublishedExams } from "@/lib/actions/exam";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, TaskSquare } from "@/components/icons";

export default async function ExamsBrowserPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const [studentExamsRes, publishedExamsRes] = await Promise.all([
    userId ? getStudentExams(userId) : Promise.resolve({ data: [] }),
    getPublishedExams(),
  ]);

  const batchExams = studentExamsRes.data || [];
  const practiceExams = publishedExamsRes.data || [];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-16 sm:pb-24 pt-2 sm:pt-4 md:py-12 gap-6 sm:gap-10 md:gap-12 px-3 sm:px-6">
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">পরীক্ষাসমূহ</h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">আপনার ব্যাচের পরীক্ষা এবং উন্মুক্ত প্র্যাকটিস টেস্ট দিন</p>
      </div>

      <Tabs defaultValue="batch" className="w-full space-y-6 sm:space-y-10">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex h-auto sm:h-14 md:h-16 p-1 sm:p-2 bg-muted/60 rounded-xl sm:rounded-2xl border gap-1 sm:gap-2">
          <TabsTrigger
            value="batch"
            className="h-full rounded-lg sm:rounded-xl px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all leading-tight text-center"
          >
            <span>আমার ব্যাচ</span>
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold shrink-0">
              {batchExams.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="practice"
            className="h-full rounded-lg sm:rounded-xl px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all leading-tight text-center"
          >
            <span>প্র্যাকটিস টেস্ট</span>
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 rounded-full bg-muted-foreground/15 text-muted-foreground font-bold shrink-0">
              {practiceExams.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batch" className="space-y-6 sm:space-y-8 focus-visible:outline-none min-h-[380px] sm:min-h-[520px]">
          <div className="flex items-center justify-between pb-1 border-b">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">আমার ব্যাচের পরীক্ষা</h2>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">মোট {batchExams.length} টি পরীক্ষা</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {batchExams.map((be) => {
              const exam = be.exam;
              if (!exam) return null;
              return (
                <div key={be.id} className="border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-card flex flex-col gap-4 sm:gap-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-bold text-base sm:text-xl leading-snug">{exam.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 sm:gap-1.5 font-medium"><TaskSquare className="size-3.5 sm:size-4 text-primary shrink-0" /> {exam.totalMarks} Marks</span>
                      <span className="flex items-center gap-1 sm:gap-1.5 font-medium"><Clock className="size-3.5 sm:size-4 text-primary shrink-0" /> {exam.durationMinutes} Min</span>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm bg-muted/40 p-3 sm:p-4 rounded-lg sm:rounded-xl text-muted-foreground space-y-1.5 sm:space-y-2 border">
                    <div><strong className="text-foreground/80 font-semibold">Starts:</strong> {be.startsAt ? new Date(be.startsAt).toLocaleString("bn-BD") : "যে কোনো সময়"}</div>
                    <div><strong className="text-foreground/80 font-semibold">Ends:</strong> {be.endsAt ? new Date(be.endsAt).toLocaleString("bn-BD") : "যে কোনো সময়"}</div>
                  </div>
                  <Link href={`/exams/${exam.slug}`} className="mt-auto pt-1 sm:pt-2">
                    <Button className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-sm">বিস্তারিত ও শুরু করুন</Button>
                  </Link>
                </div>
              );
            })}
            {batchExams.length === 0 && (
              <div className="col-span-full py-16 sm:py-28 md:py-36 flex flex-col items-center justify-center text-center border border-dashed rounded-2xl sm:rounded-3xl text-muted-foreground bg-muted/15 px-4 sm:px-6">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-muted/80 flex items-center justify-center mb-3 sm:mb-4">
                  <TaskSquare className="size-6 sm:size-8 text-muted-foreground" />
                </div>
                <p className="font-bold text-base sm:text-xl text-foreground">আপনার জন্য কোনো ব্যাচের পরীক্ষা নেই</p>
                <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 text-muted-foreground max-w-md">কোনো নতুন পরীক্ষা আপনার ব্যাচে নির্ধারিত হলে এখানে বিস্তারিত দেখতে পাবেন।</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6 sm:space-y-8 focus-visible:outline-none min-h-[380px] sm:min-h-[520px]">
          <div className="flex items-center justify-between pb-1 border-b">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">প্র্যাকটিস টেস্ট (সবার জন্য উন্মুক্ত)</h2>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">মোট {practiceExams.length} টি পরীক্ষা</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {practiceExams.map((exam) => (
              <div key={exam.id} className="border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-card flex flex-col gap-4 sm:gap-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all">
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-bold text-base sm:text-xl leading-snug">{exam.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 sm:gap-1.5 font-medium"><TaskSquare className="size-3.5 sm:size-4 text-primary shrink-0" /> {exam.totalMarks} Marks</span>
                    <span className="flex items-center gap-1 sm:gap-1.5 font-medium"><Clock className="size-3.5 sm:size-4 text-primary shrink-0" /> {exam.durationMinutes} Min</span>
                  </div>
                </div>
                <Link href={`/exams/${exam.slug}`} className="mt-auto pt-1 sm:pt-2">
                  <Button variant="secondary" className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold">প্র্যাকটিস শুরু করুন</Button>
                </Link>
              </div>
            ))}
            {practiceExams.length === 0 && (
              <div className="col-span-full py-16 sm:py-28 md:py-36 flex flex-col items-center justify-center text-center border border-dashed rounded-2xl sm:rounded-3xl text-muted-foreground bg-muted/15 px-4 sm:px-6">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-muted/80 flex items-center justify-center mb-3 sm:mb-4">
                  <TaskSquare className="size-6 sm:size-8 text-muted-foreground" />
                </div>
                <p className="font-bold text-base sm:text-xl text-foreground">কোনো প্র্যাকটিস টেস্ট পাওয়া যায়নি</p>
                <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 text-muted-foreground max-w-md">শীঘ্রই নতুন উন্মুক্ত প্র্যাকটিস টেস্ট প্ল্যাটফর্মে যোগ করা হবে।</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
