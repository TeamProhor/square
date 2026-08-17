import { notFound } from "next/navigation";
import { getExamWithQuestionsAdmin } from "@/lib/actions/admin-exam";
import QuestionBuilderClient from "./question-builder-client";
import { getQuestionsAdminAction } from "@/lib/actions/question";

export default async function ExamQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch exam
  const { success: examSuccess, data: exam } = await getExamWithQuestionsAdmin(id);
  if (!examSuccess || !exam) return notFound();

  // Fetch some questions for the bank (simplified for now)
  const questions = await getQuestionsAdminAction();

  return <QuestionBuilderClient exam={exam} questions={questions || []} />;
}
