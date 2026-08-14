import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminQuestionsManager } from "@/components/admin/admin-questions-manager";
import { ArrowRight2 } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQbQuestionsPage({
  params,
}: {
  readonly params: Promise<{
    containerSlug: string;
    itemSlug: string;
    subitemSlug: string;
    topicSlug: string;
  }>;
}) {
  const { containerSlug, itemSlug, subitemSlug, topicSlug } = await params;
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

  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", topicSlug)
    .single();

  if (!qb || !subject || !chapter || !topic) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground flex-wrap">
        <Link
          href="/admin/qb"
          className="hover:text-foreground transition-colors"
        >
          প্রশ্নব্যাংকসমূহ
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qb.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {qb.title}
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qb.slug}/${subject.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {subject.name}
        </Link>
        <ArrowRight2 className="size-3" />
        <Link
          href={`/admin/qb/${qb.slug}/${subject.slug}/${chapter.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {chapter.name}
        </Link>
        <ArrowRight2 className="size-3" />
        <span className="text-foreground font-semibold">{topic.name}</span>
      </div>

      <AdminQuestionsManager
        qbSlug={qb.slug}
        subjectSlug={subject.slug}
        subjectId={subject.id}
        chapterId={chapter.id}
        topicName={topic.name}
        chapterSlug={chapter.slug}
      />
    </div>
  );
}
