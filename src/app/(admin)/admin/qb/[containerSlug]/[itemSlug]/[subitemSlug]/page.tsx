import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminTopicsManager } from "@/components/admin/admin-topics-manager";
import { db } from "@/db";
import { containers, items, subitems, topics } from "@/db/schema";

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

  const qb = await db.query.containers.findFirst({
    where: eq(containers.slug, containerSlug),
  });

  const subject = await db.query.items.findFirst({
    where: eq(items.slug, itemSlug),
  });

  const chapter = await db.query.subitems.findFirst({
    where: eq(subitems.slug, subitemSlug),
  });

  if (!qb || !subject || !chapter) notFound();

  const topicList = await db.query.topics.findMany({
    where: eq(topics.subitemId, chapter.id),
    with: {
      questions: true,
    },
  });

  const formattedTopics = topicList.map((t) => ({
    ...t,
    subitem_id: t.subitemId,
    questions: [{ count: t.questions?.length || 0 }],
  }));

  return (
    <AdminTopicsManager
      qb={qb}
      subject={subject as any}
      chapter={chapter as any}
      initialTopics={formattedTopics as any}
    />
  );
}
