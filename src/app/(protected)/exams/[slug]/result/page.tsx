import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSubmissionResult } from "@/lib/actions/exam";
import { auth } from "@/lib/auth";
import { ExamResultView } from "@/components/exams/exam-result-view";

export default async function ExamResultPage({
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

  const { success, data: submission } = await getSubmissionResult(
    sid,
    session.user.id,
  );

  if (!success || !submission) return notFound();

  // Make sure it's submitted
  if (submission.status === "in_progress") {
    return redirect(`/exams/${slug}/take?sid=${sid}`);
  }

  return <ExamResultView submission={submission} slug={slug} />;
}
