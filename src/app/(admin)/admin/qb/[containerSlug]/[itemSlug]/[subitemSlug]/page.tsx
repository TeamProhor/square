import { notFound } from "next/navigation";
import { AdminTopicsManager } from "@/components/admin/admin-topics-manager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQbTopicsPage({
  params,
}: {
  readonly params: Promise<{
    containerSlug: string;
    itemSlug: string;
    subitemSlug: string;
  }>;
}) {
  const { containerSlug, itemSlug, subitemSlug } = await params;
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

  const { data: chapter } = await supabase
    .from("subitems")
    .select("*")
    .eq("slug", subitemSlug)
    .single();

  if (!qb || !subject || !chapter) notFound();

  const { data: topics } = await supabase
    .from("topics")
    .select(`
      *,
      questions(count)
    `)
    .eq("subitem_id", chapter.id);

  return (
    <AdminTopicsManager
      qb={qb}
      subject={subject}
      chapter={chapter}
      initialTopics={topics || []}
    />
  );
}
