import { AdminContainersManager } from "@/components/admin/admin-containers-manager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQbBanksPage() {
  const supabase = await createClient();

  const { data: qbs } = await supabase
    .from("containers")
    .select(`
      *,
      items(count)
    `)
    .order("created_at", { ascending: false });

  return <AdminContainersManager initialQbs={qbs || []} />;
}
