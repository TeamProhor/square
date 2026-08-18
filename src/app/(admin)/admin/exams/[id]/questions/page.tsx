import { notFound } from "next/navigation";
import { getExamWithQuestionsAdmin } from "@/lib/actions/admin-exam";
import { getQuestionsAdminAction } from "@/lib/actions/question";
import { ExamQuestionBuilder } from "@/components/admin/exam-question-builder";

export default async function ExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch exam
  const { success: examSuccess, data: exam } =
    await getExamWithQuestionsAdmin(id);
  if (!examSuccess || !exam) return notFound();

  // Fetch some questions for the bank (simplified for now)
  const questions = await getQuestionsAdminAction();

  return <ExamQuestionBuilder exam={exam} questions={questions || []} />;
}
