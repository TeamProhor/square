import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminItemsManager } from "@/components/admin/admin-items-manager";
import { db } from "@/db";
import { containers, items } from "@/db/schema";

import type { Item } from "@/types";

export default async function AdminQbSubjectsPage({
  params,
}: {
  readonly params: Promise<{ containerSlug: string }>;
}) {
  const { containerSlug } = await params;

  const qb = await db.query.containers.findFirst({
    where: eq(containers.slug, containerSlug),
  });

  if (!qb) notFound();

  const itemList = await db.query.items.findMany({
    where: eq(items.containerId, qb.id),
    with: {
      subitems: true,
    },
  });

  const formattedItems: Item[] = itemList.map((item) => ({
    ...item,
    container_id: item.containerId,
    subitems: [{ count: item.subitems?.length || 0 }],
  }));

  return <AdminItemsManager qb={qb} initialSubjects={formattedItems} />;
}
