import { notFound } from "next/navigation";
import { AdminSubitemsManager } from "@/components/admin/admin-subitems-manager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQbChaptersPage({
  params,
}: {
  readonly params: Promise<{ containerSlug: string; itemSlug: string }>;
}) {
  const { containerSlug, itemSlug } = await params;
  const supabase = await createClient();

  const { data: qb } = await supabase
    .from("containers")
    .select("*")
    .eq("slug", containerSlug)
    .single();

  const { data: subject } = await supabase
    .from("items")
    .select("*")
    .eq("slug", itemSlug)
    .single();

  if (!qb || !subject) notFound();

  const { data: subitems } = await supabase
    .from("subitems")
    .select(`
      *,
      topics(count),
      questions(count)
    `)
    .eq("item_id", subject.id)
    .order("order_no", { ascending: true });

  return (
    <AdminSubitemsManager
      qb={qb}
      subject={subject}
      initialChapters={subitems || []}
    />
  );
}
