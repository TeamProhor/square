import { AdminBatchesManager } from "@/components/admin/admin-batches-manager";
import { getAllBatchesAction } from "@/lib/actions/batch";

export default async function AdminBatchesPage() {
  const { data: batches } = await getAllBatchesAction();

  return <AdminBatchesManager batches={batches || []} />;
}

