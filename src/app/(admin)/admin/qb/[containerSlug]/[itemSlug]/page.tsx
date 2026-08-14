import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminSubitemsManager } from "@/components/admin/admin-subitems-manager";
import { db } from "@/db";
import { containers, items, subitems } from "@/db/schema";

export default async function AdminQbChaptersPage({
	params,
}: {
	readonly params: Promise<{ containerSlug: string; itemSlug: string }>;
}) {
	const { containerSlug, itemSlug } = await params;

	const qb = await db.query.containers.findFirst({
		where: eq(containers.slug, containerSlug),
	});

	const subject = await db.query.items.findFirst({
		where: eq(items.slug, itemSlug),
	});

	if (!qb || !subject) notFound();

	const chapterList = await db.query.subitems.findMany({
		where: eq(subitems.itemId, subject.id),
		with: {
			topics: true,
			questions: true,
		},
		orderBy: (subitems, { asc }) => [asc(subitems.orderNo)],
	});

	const formattedChapters = chapterList.map((ch) => ({
		...ch,
		item_id: ch.itemId,
		order_no: ch.orderNo,
		paper: ch.paper || undefined,
		topics: [{ count: ch.topics?.length || 0 }],
		questions: [{ count: ch.questions?.length || 0 }],
	}));

	return (
		<AdminSubitemsManager
			qb={qb}
			subject={subject as any}
			initialChapters={formattedChapters as any}
		/>
	);
}
