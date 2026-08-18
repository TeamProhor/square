import { notFound } from "next/navigation";
import { getBatchDetailAction } from "@/lib/actions/batch";
import { BatchDetailView } from "@/components/admin/batch-detail-view";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, data } = await getBatchDetailAction(id);

  if (!success || !data) {
    return notFound();
  }

  return <BatchDetailView batch={data} />;
}
