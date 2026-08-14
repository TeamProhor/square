import { notFound } from "next/navigation";
import { AdminItemsManager } from "@/components/admin/admin-items-manager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQbSubjectsPage({
  params,
}: {
  readonly params: Promise<{ containerSlug: string }>;
}) {
  const { containerSlug } = await params;
  const supabase = await createClient();

  const { data: qb } = await supabase
    .from("containers")
    .select("*")
    .eq("slug", containerSlug)
    .single();

  if (!qb) notFound();

  const { data: items } = await supabase
    .from("items")
    .select(`
      *,
      subitems(count),
      questions(count)
    `)
    .eq("container_id", qb.id);

  return <AdminItemsManager qb={qb} initialSubjects={items || []} />;
}
