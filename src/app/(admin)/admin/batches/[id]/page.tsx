import { notFound } from "next/navigation";
import { BatchDetailView } from "@/components/admin/batch-detail-view";
import { db } from "@/db";
import { getBatchDetailAction } from "@/lib/actions/batch";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ success, data }, allContainers] = await Promise.all([
    getBatchDetailAction(id),
    db.query.containers.findMany({
      orderBy: (containers, { asc }) => [asc(containers.title)],
    }),
  ]);

  if (!success || !data) {
    return notFound();
  }

  return <BatchDetailView batch={data} allContainers={allContainers} />;
}
