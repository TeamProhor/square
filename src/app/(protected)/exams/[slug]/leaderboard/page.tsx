import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getExamLeaderboard, getExamBySlug } from "@/lib/actions/exam";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ExamLeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return redirect("/login");

  const { success: eSuccess, data: exam } = await getExamBySlug(slug);
  if (!eSuccess || !exam) return notFound();

  const { success, data: leaderboard } = await getExamLeaderboard(exam.id);
  
  if (!success) return notFound();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-12 pt-4 md:py-8 gap-8 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">লিডারবোর্ড</h1>
          <p className="text-muted-foreground mt-1">{exam.title}</p>
        </div>
        <Link href={`/exams/${slug}`}>
          <Button variant="outline" className="rounded-xl">ফিরে যান</Button>
        </Link>
      </div>

      <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
        <table className="w-full text-left text-sm md:text-base">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 font-bold w-20 text-center">Rank</th>
              <th className="p-4 font-bold">Student Name</th>
              <th className="p-4 font-bold text-center">Score</th>
              <th className="p-4 font-bold text-right hidden sm:table-cell">Time Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leaderboard?.map((entry) => {
              const isMe = entry.userId === session.user?.id;
              
              let rankStyle = "text-muted-foreground font-medium";
              let rankBadge = "";
              if (entry.rank === 1) { rankStyle = "text-amber-500 font-black text-xl"; rankBadge = "👑"; }
              else if (entry.rank === 2) { rankStyle = "text-slate-400 font-black text-lg"; }
              else if (entry.rank === 3) { rankStyle = "text-amber-700 font-black text-lg"; }

              return (
                <tr key={`${entry.userId}-${entry.rank}`} className={`${isMe ? 'bg-primary/5' : 'bg-card'}`}>
                  <td className={`p-4 text-center ${rankStyle}`}>
                    {rankBadge} {entry.rank}
                  </td>
                  <td className="p-4">
                    <div className="font-bold flex items-center gap-2">
                      {entry.userName}
                      {isMe && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold">
                    {entry.score}
                  </td>
                  <td className="p-4 text-right text-muted-foreground hidden sm:table-cell">
                    {formatTime(entry.timeTakenSeconds)}
                  </td>
                </tr>
              );
            })}
            {(!leaderboard || leaderboard.length === 0) && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                  এখনো কোনো সাবমিশন নেই
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
