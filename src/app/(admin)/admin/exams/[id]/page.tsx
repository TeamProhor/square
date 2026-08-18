import { notFound } from "next/navigation";
import { getExamWithQuestionsAdmin } from "@/lib/actions/admin-exam";
import { EditExamForm } from "@/components/admin/edit-exam-form";

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

  return <EditExamForm exam={data} />;
}
