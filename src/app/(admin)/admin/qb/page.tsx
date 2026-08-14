import { AdminContainersManager } from "@/components/admin/admin-containers-manager";
import { db } from "@/db";

export default async function AdminQbBanksPage() {
	const qbs = await db.query.containers.findMany({
		with: {
			items: true,
		},
		orderBy: (containers, { desc }) => [desc(containers.createdAt)],
	});

	const formatted = qbs.map((q) => ({
		...q,
		items: [{ count: q.items?.length || 0 }],
	}));

	return <AdminContainersManager initialQbs={formatted} />;
}
