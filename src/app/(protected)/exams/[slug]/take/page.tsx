import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { examSubmissions } from "@/db/schema";
import { getExamBySlug } from "@/lib/actions/exam";
import { auth } from "@/lib/auth";
import { LiveExamView } from "@/components/exams/live-exam-view";

export default async function TakeExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sid: string }>;
}) {
  const { slug } = await params;
  const { sid } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return redirect("/login");

  if (!sid) return redirect(`/exams/${slug}`);

  // Validate submission
  const submission = await db.query.examSubmissions.findFirst({
    where: and(
      eq(examSubmissions.id, sid),
      eq(examSubmissions.userId, session.user.id),
    ),
  });

  if (!submission) return notFound();

  if (submission.status !== "in_progress") {
    return redirect(`/exams/${slug}/result?sid=${sid}`);
  }

  // Fetch full exam structure
  const { success, data: exam } = await getExamBySlug(slug);

  if (!success || !exam) return notFound();

  // Calculate elapsed time based on startedAt
  // We'll pass the remaining time to the client component
  const startedAtMs = new Date(submission.startedAt).getTime();
  const nowMs = Date.now();
  const elapsedSeconds = Math.floor((nowMs - startedAtMs) / 1000);

  const totalSeconds = exam.durationMinutes * 60;
  const initialTimeLeft = Math.max(0, totalSeconds - elapsedSeconds);

  // If time is up, client component will handle auto-submit on mount

  return (
    <LiveExamView
      exam={exam}
      submissionId={sid}
      initialTimeLeft={initialTimeLeft}
    />
  );
}
