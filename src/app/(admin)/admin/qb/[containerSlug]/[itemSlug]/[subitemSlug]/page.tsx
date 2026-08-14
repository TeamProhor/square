import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminTopicsManager } from "@/components/admin/admin-topics-manager";
import { db } from "@/db";
import { containers, items, subitems, topics } from "@/db/schema";

import type { Item, Subitem, Topic } from "@/types";

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

  const formattedSubject: Item = {
    ...subject,
    container_id: subject.containerId,
  };

  const formattedChapter: Subitem = {
    ...chapter,
    item_id: chapter.itemId,
    order_no: chapter.orderNo,
    paper: chapter.paper || undefined,
  };

  const formattedTopics: Topic[] = topicList.map((t) => ({
    ...t,
    subitem_id: t.subitemId,
    questions: [{ count: t.questions?.length || 0 }],
  }));

  return (
    <AdminTopicsManager
      qb={qb}
      subject={formattedSubject}
      chapter={formattedChapter}
      initialTopics={formattedTopics}
    />
  );
}
