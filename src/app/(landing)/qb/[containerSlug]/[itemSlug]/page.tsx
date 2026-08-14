import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { db } from "@/db";
import { containers, items, subitems } from "@/db/schema";
import type { Subitem } from "@/types";

export default async function QbChaptersPage({
	params,
}: {
	readonly params: Promise<{ containerSlug: string; itemSlug: string }>;
}): Promise<ReactElement> {
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
		orderBy: (subitems, { asc }) => [asc(subitems.orderNo)],
	});

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
					<span className="text-foreground">{subject.name}</span>
				</div>
				<h1 className="text-2xl md:text-4xl font-bold text-foreground">
					অধ্যায়সমূহ
				</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					{subject.name} এর অধ্যায় নির্বাচন করুন
				</p>
			</div>

			<div className="flex flex-col gap-8">
				{chapterList.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
						{chapterList.map((ch: Subitem) => (
							<Link
								href={`/qb/${qb.slug}/${subject.slug}/${ch.slug}`}
								key={ch.id}
							>
								<div className="group relative overflow-hidden rounded-[20px] md:rounded-[28px] p-4 md:p-6 cursor-pointer border border-border/50 bg-card hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 aspect-square flex flex-col items-center justify-center text-center">
									<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<div className="relative z-10 flex flex-col items-center justify-center px-2">
										<h3 className="font-bold text-[16px] md:text-[20px] leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
											{ch.name}
										</h3>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
						কোনো অধ্যায় পাওয়া যায়নি।
					</div>
				)}
			</div>
		</div>
	);
}
