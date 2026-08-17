import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getExamBySlug, checkExamAccess } from "@/lib/actions/exam";
import ExamLobbyClient from "./exam-lobby-client";

export default async function ExamLobbyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return notFound();
  }

  const { success, data: exam } = await getExamBySlug(slug);
  
  if (!success || !exam) {
    return notFound();
  }

  const access = await checkExamAccess(session.user.id, exam.id);

  return <ExamLobbyClient exam={exam} access={access} userId={session.user.id} />;
}
