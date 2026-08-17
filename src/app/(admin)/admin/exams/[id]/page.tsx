import { notFound } from "next/navigation";
import { getExamWithQuestionsAdmin } from "@/lib/actions/admin-exam";
import EditExamClient from "./edit-exam-client";

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, data } = await getExamWithQuestionsAdmin(id);

  if (!success || !data) {
    return notFound();
  }

  return <EditExamClient exam={data} />;
}
