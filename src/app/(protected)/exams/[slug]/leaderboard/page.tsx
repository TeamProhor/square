import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Trophy } from "@/components/icons";
import { getExamBySlug, getExamLeaderboard } from "@/lib/actions/exam";
import { auth } from "@/lib/auth";

export default async function ExamLeaderboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return redirect("/login");

  const { success: eSuccess, data: exam } = await getExamBySlug(slug);
  if (!eSuccess || !exam) return notFound();

  const { success, data: leaderboard } = await getExamLeaderboard(exam.id);
  if (!success) return notFound();

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)] || digit);
  };

  const formatTimeBangla = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${toBanglaDigits(m)} মি. ${toBanglaDigits(s)} সে.`;
    return `${toBanglaDigits(s)} সে.`;
  };

  const totalCount = leaderboard?.length || 0;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-16 sm:pb-24 pt-0 sm:pt-2 md:pt-4 gap-4 px-3 sm:px-6 font-sans">
      {/* Leaderboard Title Header */}
      <div className="flex items-center justify-between pb-1 border-b">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <Trophy className="size-4 text-primary" />
          পূর্ণাঙ্গ মেধা তালিকা
        </h2>
        {totalCount > 0 && (
          <span className="text-xs text-muted-foreground font-medium">
            মোট {toBanglaDigits(totalCount)} জন
          </span>
        )}
      </div>

      {/* Complete Merit List Table */}
      {totalCount > 0 ? (
        <div className="border border-border/70 rounded-2xl overflow-hidden bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/60 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-3 sm:px-4 w-16 text-center">স্থান</th>
                  <th className="py-3 px-3 sm:px-4">শিক্ষার্থীর নাম</th>
                  <th className="py-3 px-3 sm:px-4 text-center">প্রাপ্ত নম্বর</th>
                  <th className="py-3 px-3 sm:px-4 text-right">সময়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {leaderboard.map((entry) => {
                  const isMe = entry.userId === session.user?.id;

                  let rankPill = (
                    <span className="font-bold text-muted-foreground">
                      {toBanglaDigits(entry.rank)}
                    </span>
                  );

                  if (entry.rank === 1) {
                    rankPill = (
                      <span className="size-7 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-black mx-auto text-xs">
                        ১
                      </span>
                    );
                  } else if (entry.rank === 2) {
                    rankPill = (
                      <span className="size-7 rounded-full bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30 flex items-center justify-center font-black mx-auto text-xs">
                        ২
                      </span>
                    );
                  } else if (entry.rank === 3) {
                    rankPill = (
                      <span className="size-7 rounded-full bg-amber-700/15 text-amber-800 dark:text-amber-500 border border-amber-700/30 flex items-center justify-center font-black mx-auto text-xs">
                        ৩
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={`${entry.userId}-${entry.rank}`}
                      className={`transition-colors hover:bg-muted/30 ${
                        isMe ? "bg-primary/5 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3 sm:px-4 text-center">
                        {rankPill}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-muted flex items-center justify-center font-bold text-xs shrink-0 text-muted-foreground border border-border/50">
                            {entry.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <span className="truncate text-foreground font-medium">
                              {entry.userName}
                            </span>
                            {isMe && (
                              <span className="text-[10px] font-bold text-primary shrink-0">
                                (আপনি)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-foreground">
                        {toBanglaDigits(entry.score)}{" "}
                        <span className="text-muted-foreground font-normal text-xs">
                          / {toBanglaDigits(entry.totalMarks)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-right text-muted-foreground">
                        {formatTimeBangla(entry.timeTakenSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground bg-muted/10 space-y-2">
          <Trophy className="size-8 text-muted-foreground mx-auto" />
          <p className="font-semibold text-sm text-foreground">
            এখনও কোনো ফলাফল জমা পড়েনি
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            প্রথম অংশগ্রহণকারী হিসেবে পরীক্ষায় অংশ নিয়ে মেধা তালিকায় আপনার স্থান নিশ্চিত করুন।
          </p>
        </div>
      )}
    </div>
  );
}
