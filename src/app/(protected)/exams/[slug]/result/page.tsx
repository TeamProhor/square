import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSubmissionResult } from "@/lib/actions/exam";
import ResultClient from "./result-client";

export default async function ExamResultPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ sid: string }> }) {
  const { slug } = await params;
  const { sid } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return redirect("/login");

  if (!sid) return redirect(`/exams/${slug}`);

  const { success, data: submission } = await getSubmissionResult(sid, session.user.id);
  
  if (!success || !submission) return notFound();

  // Make sure it's submitted
  if (submission.status === "in_progress") {
    return redirect(`/exams/${slug}/take?sid=${sid}`);
  }

  return <ResultClient submission={submission} slug={slug} />;
}
