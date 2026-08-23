import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft2, Clock, Crown, Trophy } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  if (!success || !leaderboard) return notFound();

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(
      /[0-9]/g,
      (digit) => bnDigits[Number(digit)] || digit,
    );
  };

  const formatTimeBangla = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${toBanglaDigits(m)} মি. ${toBanglaDigits(s)} সে.`;
    return `${toBanglaDigits(s)} সে.`;
  };

  const totalCount = leaderboard?.length || 0;
  const topThree = leaderboard.slice(0, 3);
  const myRankEntry = leaderboard.find((e) => e.userId === session.user?.id);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-16 sm:pb-24 pt-0 sm:pt-2 md:pt-4 gap-6 px-2 sm:px-6 font-sans">
      {/* Top Breadcrumb & Exam Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link
            href={`/exams/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded-lg"
          >
            <ArrowLeft2 className="size-4" />
            <span>পরীক্ষায় ফিরে যান</span>
          </Link>
          {totalCount > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              মোট পরীক্ষার্থী: {toBanglaDigits(totalCount)} জন
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Trophy className="size-6 text-primary shrink-0" />
            <span>{exam.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            সর্বোচ্চ নম্বর ও দ্রুততম সময়ের ভিত্তিতে মেধা তালিকা প্রণয়ন করা হয়েছে
          </p>
        </div>
      </div>

      {totalCount > 0 ? (
        <div className="flex flex-col gap-6">
          {/* Top 3 Podium Highlights (if >= 3 candidates) */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
              {topThree.map((winner) => {
                const isFirst = winner.rank === 1;
                const isSecond = winner.rank === 2;
                const isThird = winner.rank === 3;
                const initial = winner.userName?.charAt(0).toUpperCase() || "U";

                return (
                  <div
                    key={winner.userId}
                    className={`relative bg-card border rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center gap-3 shadow-2xs transition-all ${
                      isFirst
                        ? "border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-card to-card ring-1 ring-amber-500/30 order-first sm:order-2 sm:-translate-y-2"
                        : isSecond
                          ? "border-slate-400/40 bg-gradient-to-b from-slate-400/5 via-card to-card order-2 sm:order-1"
                          : "border-amber-700/40 bg-gradient-to-b from-amber-700/5 via-card to-card order-3"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`absolute -top-3 px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-xs ${
                        isFirst
                          ? "bg-amber-500 text-white"
                          : isSecond
                            ? "bg-slate-400 text-white"
                            : "bg-amber-700 text-white"
                      }`}
                    >
                      <Crown className="size-3" />
                      <span>স্থান {toBanglaDigits(winner.rank)}</span>
                    </div>

                    {/* Avatar */}
                    <div className="relative mt-2">
                      <Avatar
                        className={`size-14 sm:size-16 border-2 shadow-xs ${
                          isFirst
                            ? "border-amber-500"
                            : isSecond
                              ? "border-slate-400"
                              : "border-amber-700"
                        }`}
                      >
                        {winner.userImage ? (
                          <AvatarImage
                            src={winner.userImage}
                            alt={winner.userName}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="text-base font-bold bg-muted text-foreground">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Name & Marks */}
                    <div className="space-y-0.5 w-full">
                      <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                        {winner.userName}
                      </h3>
                      <div className="text-base sm:text-lg font-black text-primary">
                        {toBanglaDigits(winner.score)}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          / {toBanglaDigits(winner.totalMarks)}
                        </span>
                      </div>
                    </div>

                    {/* Time Taken */}
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                      <Clock className="size-3 text-muted-foreground" />
                      <span>{formatTimeBangla(winner.timeTakenSeconds)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Current User's Sticky Rank Summary (if participated) */}
          {myRankEntry && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm flex items-center justify-center shadow-xs">
                  {toBanglaDigits(myRankEntry.rank)}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                    <span>আপনার বর্তমান অবস্থান</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">
                      YOU
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    প্রাপ্ত স্কোর: {toBanglaDigits(myRankEntry.score)} /{" "}
                    {toBanglaDigits(myRankEntry.totalMarks)}
                  </div>
                </div>
              </div>

              <div className="text-right text-xs font-semibold text-primary">
                {formatTimeBangla(myRankEntry.timeTakenSeconds)}
              </div>
            </div>
          )}

          {/* Full Merit Table */}
          <div className="border border-border/70 rounded-2xl overflow-hidden bg-card shadow-2xs">
            <div className="px-4 py-3 border-b bg-muted/30 font-bold text-xs sm:text-sm text-foreground flex items-center justify-between">
              <span>সকল অংশগ্রহণকারী</span>
              <span className="text-xs text-muted-foreground font-normal">
                {toBanglaDigits(totalCount)} জন
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 sm:px-4 w-16 text-center">স্থান</th>
                    <th className="py-2.5 px-3 sm:px-4">পরীক্ষার্থী</th>
                    <th className="py-2.5 px-3 sm:px-4 text-center">প্রাপ্ত নম্বর</th>
                    <th className="py-2.5 px-3 sm:px-4 text-right">সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {leaderboard.map((entry) => {
                    const isMe = entry.userId === session.user?.id;
                    const initial = entry.userName?.charAt(0).toUpperCase() || "U";

                    let rankBadge = (
                      <span className="font-bold text-muted-foreground text-xs">
                        {toBanglaDigits(entry.rank)}
                      </span>
                    );

                    if (entry.rank === 1) {
                      rankBadge = (
                        <span className="size-6 rounded-full bg-amber-500 text-white font-black mx-auto text-[11px] flex items-center justify-center shadow-2xs">
                          ১
                        </span>
                      );
                    } else if (entry.rank === 2) {
                      rankBadge = (
                        <span className="size-6 rounded-full bg-slate-400 text-white font-black mx-auto text-[11px] flex items-center justify-center shadow-2xs">
                          ২
                        </span>
                      );
                    } else if (entry.rank === 3) {
                      rankBadge = (
                        <span className="size-6 rounded-full bg-amber-700 text-white font-black mx-auto text-[11px] flex items-center justify-center shadow-2xs">
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
                        <td className="py-3 px-3 sm:px-4 text-center">
                          {rankBadge}
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-8 rounded-full border border-border/60 shrink-0">
                              {entry.userImage ? (
                                <AvatarImage
                                  src={entry.userImage}
                                  alt={entry.userName}
                                  className="object-cover"
                                />
                              ) : null}
                              <AvatarFallback className="text-xs font-bold bg-muted text-foreground">
                                {initial}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 truncate min-w-0">
                              <span className="truncate text-foreground font-medium text-xs sm:text-sm">
                                {entry.userName}
                              </span>
                              {isMe && (
                                <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 shrink-0">
                                  আপনি
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center font-bold text-foreground">
                          {toBanglaDigits(entry.score)}{" "}
                          <span className="text-muted-foreground font-normal text-[11px] sm:text-xs">
                            / {toBanglaDigits(entry.totalMarks)}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                          {formatTimeBangla(entry.timeTakenSeconds)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground bg-muted/10 space-y-2">
          <Trophy className="size-8 text-muted-foreground mx-auto" />
          <p className="font-semibold text-sm text-foreground">
            এখনও কোনো ফলাফল জমা পড়েনি
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            প্রথম অংশগ্রহণকারী হিসেবে পরীক্ষায় অংশ নিয়ে মেধা তালিকায় আপনার স্থান নিশ্চিত
            করুন।
          </p>
        </div>
      )}
    </div>
  );
}
