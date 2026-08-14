import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { ChapterQuestionsViewer } from "@/components/qb/ChapterQuestionsViewer";
import { createClient } from "@/lib/supabase/server";

export default async function QbChapterPage({
  params,
}: {
  readonly params: Promise<{
    containerSlug: string;
    itemSlug: string;
    subitemSlug: string;
  }>;
}): Promise<ReactElement> {
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
    .eq("container_id", qb?.id)
    .single();

  const { data: chapter } = await supabase
    .from("subitems")
    .select("*")
    .eq("slug", subitemSlug)
    .single();

  if (!qb || !subject || !chapter) notFound();

  // Fetch topics in this chapter
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("subitem_id", chapter.id)
    .order("name", { ascending: true });

  // Fetch all questions in this chapter
  const { data: questions } = await supabase
    .from("questions")
    .select(`
      *,
      mcq_options(*),
      cq_parts(*)
    `)
    .eq("subitem_id", chapter.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-8 pt-2 md:py-8">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground mb-2 flex-wrap">
          <Link href="/qb" className="hover:text-primary transition-colors">
            প্রশ্নব্যাংক
          </Link>
          <span>/</span>
          <Link
            href={`/qb/${qb.slug}`}
            className="hover:text-primary transition-colors"
          >
            {qb.title}
          </Link>
          <span>/</span>
          <Link
            href={`/qb/${qb.slug}/${subject.slug}`}
            className="hover:text-primary transition-colors"
          >
            {subject.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{chapter.name}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          {chapter.name} - প্রশ্নসমূহ
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          টপিক অনুযায়ী ফিল্টার করে প্রশ্নগুলো অনুশীলন করুন
        </p>
      </div>

      <div>
        <ChapterQuestionsViewer
          topics={topics || []}
          questions={questions || []}
        />
      </div>
    </div>
  );
}
